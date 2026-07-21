(function () {
    'use strict';

    const TYPE_SYNERGY = 501;
    const TYPE_COMBAT = 502;
    const STORAGE_PREFIX = 'lufelnet:nature-skill:v1:';
    const SUPPORTED_DATA_LANGS = ['kr', 'en', 'jp', 'cn'];
    const COST_ICON_PATH = '/assets/img/character-detail/innate/item-302069.png';

    const ELEMENT_TO_NATURE = {
        '물리': 'Phys',
        '총격': 'Gun',
        '화염': 'Fire',
        '빙결': 'Ice',
        '전격': 'Electric',
        '질풍': 'Wind',
        '염동': 'Psychokinesis',
        '핵열': 'Nuclear',
        '축복': 'Bless',
        '주원': 'Curse',
        '만능': 'Almighty',
        '버프': 'Support'
    };

    const NATURE_LABELS = {
        Phys: '물리',
        Gun: '총격',
        Fire: '화염',
        Ice: '빙결',
        Electric: '전격',
        Wind: '질풍',
        Psychokinesis: '염동',
        Nuclear: '핵열',
        Bless: '축복',
        Curse: '주원',
        Almighty: '만능',
        Support: '보조'
    };

    const NATURE_LABELS_BY_LANG = {
        en: {
            Phys: 'Physical',
            Gun: 'Gun',
            Fire: 'Fire',
            Ice: 'Ice',
            Electric: 'Electric',
            Wind: 'Wind',
            Psychokinesis: 'Psy',
            Nuclear: 'Nuclear',
            Bless: 'Bless',
            Curse: 'Curse',
            Almighty: 'Almighty',
            Support: 'Support'
        },
        jp: {
            Phys: '物理',
            Gun: '銃撃',
            Fire: '火炎',
            Ice: '氷結',
            Electric: '電撃',
            Wind: '疾風',
            Psychokinesis: '念動',
            Nuclear: '核熱',
            Bless: '祝福',
            Curse: '呪怨',
            Almighty: '万能',
            Support: '支援'
        },
        cn: {
            Phys: '物理',
            Gun: '枪击',
            Fire: '火焰',
            Ice: '冰冻',
            Electric: '电击',
            Wind: '疾风',
            Psychokinesis: '念动',
            Nuclear: '核热',
            Bless: '祝福',
            Curse: '咒怨',
            Almighty: '万能',
            Support: '辅助'
        }
    };

    const NATURE_TO_ICON = {
        Phys: '물리',
        Gun: '총격',
        Fire: '화염',
        Ice: '빙결',
        Electric: '전격',
        Wind: '질풍',
        Psychokinesis: '염동',
        Nuclear: '핵열',
        Bless: '축복',
        Curse: '주원',
        Almighty: '만능',
        Support: '버프'
    };

    const TEXT_FALLBACK = {
        title: '속성 심상',
        synergy: '속성 공명',
        combat: '속성 전투 스킬',
        selectSkill: '스킬 선택',
        clickSelect: '클릭해서 선택',
        clickChange: '클릭해서 변경',
        noSkills: '선택 가능한 스킬이 없습니다.',
        cost: 'Cost',
        level: 'LV',
        close: '닫기',
        globalNote: ''
    };

    const TEXT_KEYS = {
        title: 'characterNatureSkillTitle',
        synergy: 'characterNatureSkillSynergy',
        combat: 'characterNatureSkillCombat',
        selectSkill: 'characterNatureSkillSelect',
        clickSelect: 'characterNatureSkillClickSelect',
        clickChange: 'characterNatureSkillClickChange',
        noSkills: 'characterNatureSkillNoSkills',
        cost: 'characterNatureSkillCost',
        level: 'characterNatureSkillLevel',
        close: 'characterNatureSkillClose',
        globalNote: 'characterNatureSkillGlobalNote'
    };

    const LANG_TEXT_FALLBACK = {
        en: {
            title: 'Attribute Mindscape',
            synergy: 'Mindscape Synergy',
            combat: 'Mindscape Combat Skill',
            selectSkill: 'Select Skill',
            clickSelect: 'Click to select',
            clickChange: 'Click to change',
            noSkills: 'No available skills.',
            cost: 'Cost',
            level: 'LV',
            close: 'Close',
            globalNote: '※ This feature was first released in KR V5.2 and may not be available on global servers yet.'
        },
        jp: {
            title: '属性イメジャリー',
            synergy: 'イメジャリーシナジー',
            combat: 'イメジャリー戦闘技術',
            selectSkill: 'スキル選択',
            clickSelect: 'クリックして選択',
            clickChange: 'クリックして変更',
            noSkills: '選択可能なスキルがありません。',
            cost: 'Cost',
            level: 'LV',
            close: '閉じる',
            globalNote: '※ この機能はKR版V5.2で先行実装された機能です。グローバル版ではまだ利用できない場合があります。'
        },
        cn: {
            title: '属性心象',
            synergy: '心象协同',
            combat: '心象战斗技术',
            selectSkill: '选择技能',
            clickSelect: '点击选择',
            clickChange: '点击更换',
            noSkills: '没有可选技能。',
            cost: 'Cost',
            level: 'LV',
            close: '关闭',
            globalNote: ''
        }
    };

    let allSkills = [];
    let currentCharacterName = '';
    let activeNature = '';
    let detectedNatures = [];
    let selectedType = null;
    let activeLang = 'kr';

    function getCurrentLanguage() {
        try {
            if (window.LanguageRouter && typeof window.LanguageRouter.getCurrentLanguage === 'function') {
                const lang = window.LanguageRouter.getCurrentLanguage();
                if (lang) return lang;
            }
            if (window.I18nService && typeof window.I18nService.getCurrentLanguageSafe === 'function') {
                const lang = window.I18nService.getCurrentLanguageSafe();
                if (lang) return lang;
            }
        } catch (_) {}

        const params = new URLSearchParams(window.location.search);
        const paramLang = params.get('lang');
        if (paramLang) return paramLang;

        const pathLang = (/\/(kr|en|jp|cn)\//.exec(window.location.pathname || '') || [])[1];
        return pathLang || 'kr';
    }

    function text(key) {
        const fallback = Object.prototype.hasOwnProperty.call(LANG_TEXT_FALLBACK[activeLang] || {}, key)
            ? LANG_TEXT_FALLBACK[activeLang][key]
            : (Object.prototype.hasOwnProperty.call(TEXT_FALLBACK, key) ? TEXT_FALLBACK[key] : key);
        const i18nKey = TEXT_KEYS[key];
        if (i18nKey && typeof window.t === 'function') {
            try {
                const translated = window.t(i18nKey, fallback);
                if (translated && translated !== i18nKey && translated !== key) return translated;
            } catch (_) {}
        }
        if (i18nKey && window.I18nService && typeof window.I18nService.t === 'function') {
            const translated = window.I18nService.t(i18nKey, fallback);
            if (translated && translated !== i18nKey && translated !== key) return translated;
        }
        return fallback;
    }

    function getBaseUrl() {
        return typeof window.BASE_URL === 'string' ? window.BASE_URL : '';
    }

    function getAppVersionQuery() {
        return typeof window.APP_VERSION !== 'undefined' ? `?v=${encodeURIComponent(window.APP_VERSION)}` : '';
    }

    function getDataLang(lang) {
        return SUPPORTED_DATA_LANGS.includes(lang) ? lang : 'kr';
    }

    function getNatureIconPath(nature) {
        const iconName = NATURE_TO_ICON[nature] || NATURE_LABELS[nature] || nature;
        return `${getBaseUrl()}/assets/img/skill-element/${iconName}.png`;
    }

    function getNatureLabel(nature) {
        return (NATURE_LABELS_BY_LANG[activeLang] && NATURE_LABELS_BY_LANG[activeLang][nature])
            || NATURE_LABELS[nature]
            || nature;
    }

    function getCostIconPath() {
        return `${getBaseUrl()}${COST_ICON_PATH}`;
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[char]);
    }

    function formatSkillDescription(description) {
        return escapeHtml(description).replace(/(\d+(?:\.\d+)?%?|\[제보\])(\/(\d+(?:\.\d+)?%?|\[제보\])){1,3}/g, (match) => {
            return match.split('/').map((value) => `<span class="skill-level-values">${value}</span>`).join('/');
        });
    }

    function getCharacterName() {
        const params = new URLSearchParams(window.location.search);
        return params.get('name') || window.__CHARACTER_DEFAULT || '';
    }

    function resolveCharacterData(characterName) {
        if (!characterName || !window.characterData) return null;
        if (window.characterData[characterName]) return window.characterData[characterName];

        const normalized = characterName.trim();
        return Object.keys(window.characterData).reduce((found, key) => {
            if (found) return found;
            return key.trim() === normalized ? window.characterData[key] : null;
        }, null);
    }

    function resolveNatures(elementText) {
        const source = String(elementText || '');
        return Object.keys(ELEMENT_TO_NATURE)
            .filter((element) => source.includes(element))
            .map((element) => ELEMENT_TO_NATURE[element])
            .filter((nature, index, list) => list.indexOf(nature) === index);
    }

    function normalizeNatureSkillPayload(payload) {
        const skills = Array.isArray(payload)
            ? (Array.isArray(payload[0]) ? payload[0] : payload)
            : (Array.isArray(payload?.data) ? payload.data : []);
        return skills.filter((entry) => entry && entry.skill && (entry.innateType === TYPE_SYNERGY || entry.innateType === TYPE_COMBAT));
    }

    async function loadNatureSkills() {
        if (allSkills.length) return allSkills;
        const dataLang = getDataLang(activeLang);
        const dataPath = `/data/skills/nature_skill_${dataLang}.json`;
        const url = `${getBaseUrl()}${dataPath}${getAppVersionQuery()}`;
        const fetcher = typeof window.fetchWithRevalidate === 'function' ? window.fetchWithRevalidate : fetch;
        const response = await fetcher(url, { cache: 'no-cache' });
        if (!response || !response.ok) throw new Error(`Failed to load ${dataPath}`);
        allSkills = normalizeNatureSkillPayload(await response.json());
        return allSkills;
    }

    function getStorageKey() {
        return `${STORAGE_PREFIX}${currentCharacterName}`;
    }

    function readSavedState() {
        try {
            const raw = localStorage.getItem(getStorageKey());
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (_) {
            return {};
        }
    }

    function writeSavedState(state) {
        try {
            localStorage.setItem(getStorageKey(), JSON.stringify(state));
        } catch (_) {}
    }

    function getSkillsFor(type, nature) {
        return allSkills.filter((entry) => entry.innateType === type && entry.nature === nature);
    }

    function findSkill(sn) {
        const numericSn = Number(sn);
        if (!numericSn) return null;
        return allSkills.find((entry) => Number(entry.skill && entry.skill.sn) === numericSn) || null;
    }

    function getSelectedSkill(type) {
        const saved = readSavedState();
        const sn = type === TYPE_SYNERGY ? saved.synergySn : saved.combatSn;
        const entry = findSkill(sn);
        return entry && entry.nature === activeNature && entry.innateType === type ? entry : null;
    }

    function createSlot(type) {
        const selected = getSelectedSkill(type);
        const isSynergy = type === TYPE_SYNERGY;
        const typeLabel = isSynergy ? text('synergy') : text('combat');
        const displayName = selected ? (selected.skill.name || typeLabel) : typeLabel;
        const slot = document.createElement('button');
        slot.type = 'button';
        slot.className = `nature-skill-slot skill-card${selected ? ' selected' : ' empty'}`;
        slot.dataset.type = String(type);
        slot.setAttribute('aria-label', `${typeLabel} ${displayName} ${selected ? text('clickChange') : text('clickSelect')}`);

        const icon = document.createElement('img');
        icon.src = getNatureIconPath(activeNature);
        icon.alt = getNatureLabel(activeNature);
        icon.className = 'skill-icon nature-skill-icon';

        const info = document.createElement('span');
        info.className = 'skill-info nature-skill-slot-info';

        const header = document.createElement('span');
        header.className = 'skill-header nature-skill-slot-header';

        const label = document.createElement('span');
        label.className = 'skill-name nature-skill-slot-label';
        label.textContent = displayName;

        const hint = document.createElement('span');
        hint.className = 'skill-cost nature-skill-slot-hint';
        hint.textContent = selected ? text('clickChange') : text('clickSelect');

        header.appendChild(label);
        header.appendChild(hint);
        info.appendChild(header);

        if (selected) {
            const skillDesc = document.createElement('p');
            skillDesc.className = 'skill-description nature-skill-slot-desc';
            skillDesc.innerHTML = formatSkillDescription(selected.skill.desc || '');

            info.appendChild(skillDesc);
        } else {
            const plus = document.createElement('span');
            plus.className = 'nature-skill-slot-plus';
            plus.textContent = '+';

            info.appendChild(plus);
        }

        slot.appendChild(icon);
        slot.appendChild(info);
        slot.addEventListener('click', () => openModal(type));
        return slot;
    }

    function renderTabs() {
        const tabs = document.getElementById('nature-skill-tabs');
        if (!tabs) return;
        tabs.innerHTML = '';

        if (detectedNatures.length <= 1) {
            tabs.style.display = 'none';
            return;
        }

        tabs.style.display = '';
        detectedNatures.forEach((nature) => {
            const tab = document.createElement('button');
            tab.type = 'button';
            tab.className = `nature-skill-tab${nature === activeNature ? ' active' : ''}`;
            tab.dataset.nature = nature;
            tab.textContent = getNatureLabel(nature);
            tab.addEventListener('click', () => {
                activeNature = nature;
                const saved = readSavedState();
                writeSavedState({ ...saved, nature: activeNature });
                render();
            });
            tabs.appendChild(tab);
        });
    }

    function render() {
        const card = document.getElementById('nature-skill-card');
        const slots = document.getElementById('nature-skill-slots');
        if (!card || !slots) return;

        card.querySelectorAll('[data-nature-skill-label]').forEach((el) => {
            const key = el.getAttribute('data-nature-skill-label');
            el.textContent = text(key);
        });

        const noteEl = document.getElementById('nature-skill-global-note');
        if (noteEl) {
            const noteText = activeLang === 'en' || activeLang === 'jp' ? text('globalNote') : '';
            noteEl.textContent = noteText;
            noteEl.style.display = noteText ? '' : 'none';
        }

        slots.innerHTML = '';
        renderTabs();
        slots.appendChild(createSlot(TYPE_SYNERGY));
        slots.appendChild(createSlot(TYPE_COMBAT));
        card.style.display = '';
    }

    function ensureModal() {
        let modal = document.getElementById('nature-skill-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'nature-skill-modal';
        modal.className = 'nature-skill-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = [
            '<div class="nature-skill-modal-content">',
            '  <button type="button" class="nature-skill-modal-close" aria-label=""></button>',
            '  <div class="nature-skill-modal-header">',
            '    <h3 id="nature-skill-modal-title"></h3>',
            '  </div>',
            '  <div id="nature-skill-modal-list" class="nature-skill-modal-list"></div>',
            '</div>'
        ].join('');
        document.body.appendChild(modal);

        modal.addEventListener('click', (event) => {
            if (event.target === modal || event.target.closest('.nature-skill-modal-close')) {
                closeModal();
            }
        });

        return modal;
    }

    function openModal(type) {
        selectedType = type;
        const modal = ensureModal();
        const title = document.getElementById('nature-skill-modal-title');
        const list = document.getElementById('nature-skill-modal-list');
        const close = modal.querySelector('.nature-skill-modal-close');
        const typeLabel = type === TYPE_SYNERGY ? text('synergy') : text('combat');

        close.textContent = '×';
        close.setAttribute('aria-label', text('close'));
        title.textContent = `${typeLabel} ${text('selectSkill')}`;
        list.innerHTML = '';

        const skills = getSkillsFor(type, activeNature);
        if (!skills.length) {
            const empty = document.createElement('p');
            empty.className = 'nature-skill-modal-empty';
            empty.textContent = text('noSkills');
            list.appendChild(empty);
        } else {
            skills.forEach((entry) => list.appendChild(createModalOption(entry)));
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function createModalOption(entry) {
        const skill = entry.skill || {};
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'nature-skill-modal-option skill-card';
        option.dataset.sn = String(skill.sn || '');

        const icon = document.createElement('img');
        icon.src = getNatureIconPath(entry.nature);
        icon.alt = getNatureLabel(entry.nature) || '';
        icon.className = 'skill-icon nature-skill-icon';

        const info = document.createElement('span');
        info.className = 'skill-info';

        const header = document.createElement('span');
        header.className = 'skill-header nature-skill-option-header';

        const name = document.createElement('strong');
        name.className = 'skill-name nature-skill-option-name';
        name.textContent = skill.name || '';

        const meta = document.createElement('span');
        meta.className = 'skill-cost nature-skill-option-meta';

        const levelText = document.createElement('span');
        levelText.textContent = `${text('level')} ${skill.skill_lv || '1/2'}`;

        const separator = document.createElement('span');
        separator.className = 'nature-skill-option-meta-separator';
        separator.textContent = '·';

        const costWrap = document.createElement('span');
        costWrap.className = 'nature-skill-option-cost';

        const costIcon = document.createElement('img');
        costIcon.src = getCostIconPath();
        costIcon.alt = '';
        costIcon.className = 'nature-skill-cost-icon';
        costIcon.setAttribute('aria-hidden', 'true');

        const costValue = document.createElement('span');
        costValue.textContent = skill.cost || '75';

        costWrap.appendChild(costIcon);
        costWrap.appendChild(costValue);
        meta.appendChild(levelText);
        meta.appendChild(separator);
        meta.appendChild(costWrap);

        const desc = document.createElement('p');
        desc.className = 'skill-description nature-skill-option-desc';
        desc.innerHTML = formatSkillDescription(skill.desc || '');

        header.appendChild(name);
        header.appendChild(meta);
        info.appendChild(header);
        info.appendChild(desc);
        option.appendChild(icon);
        option.appendChild(info);
        option.addEventListener('click', () => selectSkill(entry));
        return option;
    }

    function selectSkill(entry) {
        const saved = readSavedState();
        const nextState = { ...saved, nature: activeNature };
        if (selectedType === TYPE_SYNERGY) {
            nextState.synergySn = entry.skill.sn;
        } else if (selectedType === TYPE_COMBAT) {
            nextState.combatSn = entry.skill.sn;
        }
        writeSavedState(nextState);
        closeModal();
        render();
    }

    function closeModal() {
        const modal = document.getElementById('nature-skill-modal');
        if (!modal) return;
        modal.classList.remove('show');
        selectedType = null;
        document.body.style.overflow = '';
    }

    function hideCard(reason) {
        const card = document.getElementById('nature-skill-card');
        if (card) card.style.display = 'none';
        if (reason) console.warn('[nature-skill]', reason);
    }

    async function init() {
        activeLang = getCurrentLanguage();
        if (!SUPPORTED_DATA_LANGS.includes(activeLang)) {
            hideCard();
            return;
        }

        currentCharacterName = getCharacterName();
        const character = resolveCharacterData(currentCharacterName);
        if (!character) {
            hideCard('Character data not found');
            return;
        }

        detectedNatures = resolveNatures(character.element);
        if (!detectedNatures.length) {
            hideCard(`Unsupported character element: ${character.element || ''}`);
            return;
        }

        try {
            await loadNatureSkills();
        } catch (error) {
            hideCard(error.message || 'Failed to load nature skills');
            return;
        }

        const saved = readSavedState();
        activeNature = detectedNatures.includes(saved.nature) ? saved.nature : detectedNatures[0];
        writeSavedState({ ...saved, nature: activeNature });
        render();
    }

    document.addEventListener('keydown', (event) => {
        const modal = document.getElementById('nature-skill-modal');
        if (event.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init().catch((error) => hideCard(error && error.message));
        });
    } else {
        init().catch((error) => hideCard(error && error.message));
    }
})();
