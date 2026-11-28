(() => {
    const groups = { 'J&C': 'jc', '코토네': 'kotone', '미쿠': 'miku' };
    const storagePrefix = 'calculatorCharacterPresetV1:';
    const legacyKeys = {
        critical: 'jc_desire_crit',
        pierce: 'jc_desire_jc1_penetrate',
        defense: 'jc_desire_jc2_def',
        kotone: 'calcKotoneSkillEffectAmpValueV1',
        miku: 'calcMikuSkillEffectAmpValueV1'
    };

    // Character skill data: J&C's Sentencer core and the three exclusive weapons.
    const corePoints = [0, 25, 37, 50];
    const forgeBonus = [10, 13, 13, 16, 16, 19, 19];

    function read(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (_) {
            return null;
        }
    }

    function write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (_) {}
    }

    function normalize(state = {}) {
        return {
            mode: state.mode === 'manual' ? 'manual' : 'preset',
            manual: Number.isFinite(state.manual) ? Math.max(0, state.manual) : 0,
            base: Number.isFinite(state.base) ? Math.min(100, Math.max(25, state.base)) : 100,
            core: Number.isInteger(state.core) && corePoints[state.core] !== undefined ? state.core : 0,
            weapon: Number.isInteger(state.weapon) && forgeBonus[state.weapon] !== undefined ? state.weapon : -1,
            awareness: state.awareness === true,
            birthPower: state.birthPower === true,
            condition: state.condition === true
        };
    }

    function getPresetValue(character, state, context) {
        if (state.mode === 'manual') return state.manual;
        const weapon = forgeBonus[state.weapon] ?? 0;
        if (character === 'jc') {
            const base = state.base + corePoints[state.core];
            // The weapon increases Desire Level when casting Skill 3.
            const permanentBonus = (state.awareness ? 20 : 0) + (state.birthPower ? 5 : 0);
            const bonus = permanentBonus + (context === 'defense' ? weapon : 0);
            return base * (1 + bonus / 100);
        }
        const awareness = character === 'miku' && state.awareness ? 15 : 0;
        return awareness + (state.condition ? weapon : 0);
    }

    function updateFields(container, visible) {
        container.hidden = !visible;
        container.querySelectorAll('input').forEach(input => {
            input.disabled = !visible || Boolean(input.closest('[hidden]'));
        });
    }

    function addChoices(container, name, choices) {
        for (const { value, label, bonus } of choices) {
            const option = document.createElement('label');
            option.className = 'calculator-preset-option';
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = name;
            input.value = value;
            const title = document.createElement('span');
            title.textContent = label;
            const detail = document.createElement('small');
            detail.textContent = bonus;
            option.append(input, title, detail);
            container.append(option);
        }
    }

    class CalculatorPresets {
        constructor({ getLang, onChange }) {
            this.getLang = getLang;
            this.onChange = onChange;
            this.states = {};
            this.legacy = {};
            for (const character of Object.values(groups)) this.load(character);
            for (const [key, storageKey] of Object.entries(legacyKeys)) {
                const value = read(storageKey);
                if (Number.isFinite(value)) this.legacy[key] = value;
            }
            window.addEventListener('storage', event => {
                const character = event.key?.slice(storagePrefix.length);
                if (event.key === null || (event.key.startsWith(storagePrefix) && Object.values(groups).includes(character))) {
                    if (event.key === null) this.legacy = {};
                    for (const id of event.key === null ? Object.values(groups) : [character]) this.load(id);
                    this.refresh();
                }
            });
        }

        load(character) {
            const saved = read(storagePrefix + character);
            this.states[character] = saved && typeof saved === 'object' ? normalize(saved) : null;
        }

        getValue(character, context) {
            const state = this.states[character];
            if (state) return getPresetValue(character, state, context);
            if (character === 'jc') return this.legacy[context] || 100;
            return Math.max(0, this.legacy[character] ?? 0);
        }

        getEffectiveValue(item, base, globalAmp) {
            if (!item) return base;
            if (item.jcPersonaPerformance) {
                const performance = this.getValue('jc', item.jcPersonaPerformance);
                return base * (0.5 + performance / 200);
            }
            if (item.skillEffectAmpAffected !== true) return base;
            const amp = item.mikuSkillEffectAmpAffected === true
                ? this.getValue('miku')
                : globalAmp.enabled ? globalAmp.value : 0;
            const kotoneAmp = item.kotoneSkillEffectAmpAffected === true ? this.getValue('kotone') : 0;
            return base * (1 + (amp + kotoneAmp) / 100);
        }

        get labels() {
            return window.calculatorPresetLabels[this.getLang()] || window.calculatorPresetLabels.kr;
        }

        format(character, value) {
            const locales = { kr: 'ko', en: 'en', jp: 'ja', cn: 'zh-CN' };
            const formatted = new Intl.NumberFormat(locales[this.getLang()], { maximumFractionDigits: 2 }).format(value);
            return character === 'jc' ? formatted : `${formatted}%`;
        }

        attach(header, group, context, name) {
            const character = groups[group];
            if (!character) return;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'calculator-preset-trigger';
            button.dataset.presetCharacter = character;
            button.dataset.presetContext = context;
            button.setAttribute('aria-haspopup', 'dialog');
            button.innerHTML = '<span class="calculator-preset-trigger-label"></span><span class="calculator-preset-trigger-value"></span><svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h3m5 0h8M4 17h8m5 0h3"/><circle cx="9.5" cy="7" r="2.5"/><circle cx="14.5" cy="17" r="2.5"/></svg>';
            const statLabel = this.labels[character === 'jc' ? 'performance' : 'amplification'];
            button.querySelector('.calculator-preset-trigger-label').textContent = statLabel;
            button.setAttribute('aria-label', `${name} · ${statLabel} ${this.labels.settings}`);
            this.updateTrigger(button);
            button.addEventListener('click', event => {
                event.stopPropagation();
                const name = header.querySelector('.group-name').textContent;
                const portrait = header.querySelector('.group-avatar').src;
                this.open(group, context, name, portrait, event.detail > 0 ? button : null);
            });
            header.classList.add('group-header--with-preset');
            header.querySelector('.group-header-inner').append(button);
        }

        updateTrigger(button) {
            const { presetCharacter, presetContext } = button.dataset;
            const value = this.format(presetCharacter, this.getValue(presetCharacter, presetContext));
            button.querySelector('.calculator-preset-trigger-value').textContent = value;
        }

        refresh() {
            document.querySelectorAll('.calculator-preset-trigger').forEach(button => this.updateTrigger(button));
            this.onChange();
        }

        open(group, context, name, fallbackPortrait, pointerTrigger) {
            const character = groups[group];
            const labels = this.labels;
            const statLabel = labels[character === 'jc' ? 'performance' : 'amplification'];
            const dialog = document.getElementById('calculator-preset-template').content.firstElementChild.cloneNode(true);
            const form = dialog.querySelector('form');
            const fields = form.elements;
            const value = this.getValue(character, context);
            const fallback = value === (character === 'jc' ? 100 : 0) ? 'preset' : 'manual';
            const state = this.states[character] || normalize({ mode: fallback, manual: value });

            dialog.querySelector('h2').textContent = name;
            const portrait = dialog.querySelector('.calculator-preset-heading img');
            portrait.addEventListener('error', () => { portrait.src = fallbackPortrait; }, { once: true });
            portrait.src = `${BASE_URL}/assets/img/tier/${encodeURIComponent(group)}.webp`;
            dialog.querySelector('.calculator-preset-modes').setAttribute('aria-label', labels.mode);
            dialog.querySelectorAll('[data-label]').forEach(el => { el.textContent = labels[el.dataset.label]; });
            dialog.querySelectorAll('[data-stat-label]').forEach(el => { el.textContent = statLabel; });
            dialog.querySelectorAll('[data-character]').forEach(el => {
                el.hidden = !el.dataset.character.split(' ').includes(character);
            });
            dialog.querySelector('[data-awareness-label]').textContent = labels[character === 'jc' ? 'jcAwareness' : 'mikuAwareness'];
            dialog.querySelector('[data-condition-label]').textContent = labels[character === 'kotone' ? 'lunarBond' : 'concert'];
            dialog.querySelector('[data-label="kotoneCritical"]').hidden = character !== 'kotone' || context !== 'critical';

            addChoices(dialog.querySelector('[data-choices="core"]'), 'core', corePoints.map((points, level) => ({
                value: level, label: level === 0 ? labels.none : `LV${level}`, bonus: `+${points}`
            })));
            addChoices(dialog.querySelector('[data-choices="weapon"]'), 'weapon', [
                { value: -1, label: labels.none, bonus: '+0%' },
                ...forgeBonus.map((bonus, level) => ({ value: level, label: level, bonus: `+${bonus}%` }))
            ]);
            for (const key of ['mode', 'base', 'core', 'weapon']) fields[key].value = state[key];
            fields.manual.value = state.mode === 'manual' ? state.manual : Number(value.toFixed(4));
            fields.awareness.checked = state.awareness;
            fields.birthPower.checked = state.birthPower;
            fields.condition.checked = state.condition;

            const readForm = () => normalize({
                mode: fields.mode.value,
                base: fields.base.valueAsNumber,
                core: Number(fields.core.value),
                weapon: Number(fields.weapon.value),
                manual: fields.manual.valueAsNumber,
                awareness: fields.awareness.checked,
                birthPower: fields.birthPower.checked,
                condition: fields.condition.checked
            });

            const updatePreview = () => {
                const draft = readForm();
                dialog.querySelectorAll('[data-mode]').forEach(el => updateFields(el, el.dataset.mode === draft.mode));
                fields.condition.disabled = fields.condition.disabled || draft.weapon === -1;
                fields.preview.value = this.format(character, getPresetValue(character, draft, 'pierce'));
                const hasWeapon = draft.mode === 'preset' && draft.weapon !== -1;
                const showSkill3 = hasWeapon && character === 'jc';
                const compareConcert = hasWeapon && character === 'miku';
                dialog.querySelector('[data-preview-label]').textContent = showSkill3 ? labels.baseResult : labels.result;
                dialog.querySelector('[data-weapon-preview]').hidden = !showSkill3 && !compareConcert;
                if (showSkill3) {
                    dialog.querySelector('[data-weapon-preview-label]').textContent = labels.skill3;
                    fields.weaponPreview.value = this.format(character, getPresetValue(character, draft, 'defense'));
                }
                if (compareConcert) {
                    dialog.querySelector('[data-weapon-preview-label]').textContent = draft.condition ? labels.baseResult : labels.concertResult;
                    const alternate = { ...draft, condition: !draft.condition };
                    fields.weaponPreview.value = this.format(character, getPresetValue(character, alternate));
                }
            };

            form.addEventListener('input', updatePreview);
            form.addEventListener('submit', event => {
                event.preventDefault();
                const draft = readForm();
                this.states[character] = draft;
                write(storagePrefix + character, draft);
                dialog.close();
                this.refresh();
            });
            dialog.querySelector('[data-cancel]').addEventListener('click', () => dialog.close());
            dialog.addEventListener('close', () => {
                dialog.remove();
                if (pointerTrigger && document.activeElement === pointerTrigger) {
                    pointerTrigger.blur();
                }
            }, { once: true });
            updatePreview();
            document.body.append(dialog);
            dialog.showModal();
        }
    }

    window.CalculatorPresets = CalculatorPresets;
})();
