import { EventEmitter } from './event-emitter.js';
import { DataLoader } from './data-loader.js';

export class WonderUI extends EventEmitter {
    constructor(store, personaModal) {
        super();
        this.store = store;
        this.personaModal = personaModal;
        this.container = document.getElementById('wonderConfigContainer');
        this.baseUrl = window.BASE_URL || '';
        this.partyUI = null; // Will be set after PartyUI is created
        this._unsubStore = null;

        // Bind methods
        this.render = this.render.bind(this);
        this.handlePersonaSelect = this.handlePersonaSelect.bind(this);

        this.init();
    }

    setPartyUI(partyUI) {
        this.partyUI = partyUI;
    }

    getCurrentLang() {
        if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
            return window.I18nService.getCurrentLanguage();
        }
        return 'kr';
    }

    getWonderDisplayName() {
        const lang = this.getCurrentLang();
        // Use i18n translation if available
        if (window.I18nService && typeof window.I18nService.t === 'function') {
            const translated = window.I18nService.t('wonder');
            if (translated && translated !== 'wonder') {
                return translated;
            }
        }
        // Fallback per language
        if (lang === 'kr') return '원더';
        if (lang === 'en') return 'WONDER';
        if (lang === 'jp') return 'ワンダー';
        return '원더';
    }

    init() {
        if (this.personaModal) {
            this.personaModal.on('select', this.handlePersonaSelect);
        }

        // Keep UI in sync with store changes (order/weapon/personas can change indirectly)
        if (this.store && typeof this.store.subscribe === 'function') {
            this._unsubStore = this.store.subscribe((event) => {
                if (event === 'wonderChange' || event === 'fullReload' || event === 'partyChange') {
                    this.render();
                }
            });
        }

        // Auto-set first persona to '디오니소스' if empty on initial load
        this.ensureInitialPersona();
    }

    ensureInitialPersona() {
        const wonder = this.store.state.wonder || {};
        const personas = wonder.personas || [{}, {}, {}];
        // If the first persona slot is empty, set '디오니소스'
        if (!personas[0] || !personas[0].name) {
            const store = (window.personaFiles || {});
            const unique = (store['디오니소스'] && store['디오니소스'].uniqueSkill && store['디오니소스'].uniqueSkill.name)
                ? store['디오니소스'].uniqueSkill.name
                : '';
            const updated = [...personas];
            updated[0] = {
                name: '디오니소스',
                skills: [unique, '', '', ''],
                memo: ''
            };
            this.store.setWonderConfig({ ...wonder, personas: updated });
        }
    }

    handlePersonaSelect(personaName) {
        // Determine which slot was active
        const activeIndex = this.activePersonaIndex;
        if (activeIndex === undefined || activeIndex === null) return;

        const wonderState = this.store.state.wonder;
        const currentPersonas = [...(wonderState.personas || [{}, {}, {}])];

        if (!personaName) {
            currentPersonas[activeIndex] = { name: '', skills: ['', '', '', ''], memo: '' };
        } else {
            const existing = currentPersonas[activeIndex] || {};
            const store = (window.personaFiles || {});
            const unique = (store[personaName] && store[personaName].uniqueSkill && store[personaName].uniqueSkill.name)
                ? store[personaName].uniqueSkill.name
                : '';
            currentPersonas[activeIndex] = {
                ...existing,
                name: personaName,
                // Reset skills only if it's a new persona, usually expected behavior
                // skills[0] is reserved for unique skill display
                skills: [unique, '', '', '']
            };
        }

        this.store.setWonderConfig({
            ...wonderState,
            personas: currentPersonas
        });

        this.render();
    }

    render() {
        if (!this.container) return;

        const wonderState = this.store.state.wonder;

        const personas = wonderState.personas || [{}, {}, {}];

        // Html Construction - Wonder slot first, then 3 persona cards
        this.container.innerHTML = `
            <div class="wonder-config-body">
                <div class="wonder-personas-grid">
                    ${this.renderWonderSlot()}
                    ${[0, 1, 2].map(i => this.renderPersonaCard(i, personas[i])).join('')}
                </div>
            </div>
        `;

        this.bindEvents();
        this.bindWonderSlotEvents();
    }

    renderWonderSlot() {
        const config = this.store.getWonderConfig();
        const wonderImg = `${this.baseUrl}/assets/img/tier/원더.webp`;

        // Handle legacy object vs string
        let weaponId = config.weapon;
        if (typeof weaponId === 'object' && weaponId !== null) weaponId = weaponId.name;
        const weaponData = weaponId ? DataLoader.getWeaponList()[weaponId] : null;
        const weaponDisplayName = weaponId ? DataLoader.getWeaponDisplayName(weaponId) : '-';
        const weaponImageName = weaponId ? ((weaponData && (weaponData.name || weaponId)) || weaponId) : '';

        const currentOrder = config.order || '-';

        // Get element/position from first persona
        const personas = config.personas || [];
        const firstPersona = personas.find(p => p && p.name);
        let wonderElement = '';
        let wonderPosition = '';
        let attrIcon = '';
        let posIcon = '';

        if (firstPersona && firstPersona.name) {
            const personaData = (window.personaFiles || {})[firstPersona.name];
            if (personaData) {
                wonderElement = personaData.element || '';
                wonderPosition = personaData.position || '';
                if (wonderElement) {
                    attrIcon = `${this.baseUrl}/assets/img/persona/속성_${wonderElement}.png`;
                }
                if (wonderPosition) {
                    posIcon = `${this.baseUrl}/assets/img/persona/직업_${wonderPosition}.png`;
                }
            }
        }

        const displayElement = DataLoader.getElementName(wonderElement);
        const displayPosition = DataLoader.getJobName(wonderPosition);

        const slotCharSub = (wonderElement || wonderPosition) ? `
            <div class="slot-char-sub">
                ${attrIcon ? `<img src="${attrIcon}" class="meta-icon" title="${displayElement}" onerror="this.style.display='none'">` : ''}
                ${wonderElement ? `<span>${displayElement}</span>` : ''}
                ${posIcon ? `<img src="${posIcon}" class="meta-icon" title="${displayPosition}" onerror="this.style.display='none'">` : ''}
                ${wonderPosition ? `<span>${displayPosition}</span>` : ''}
            </div>
        ` : '';

        // Limit order options to number of characters with order-able slots
        const maxOrder = this.store.getOrderableCharacterCount();
        const orderOptions = [];
        for (let n = 1; n <= maxOrder; n++) {
            orderOptions.push(n);
        }

        return `
            <div class="wonder-persona-card wonder-slot-card" id="wonderSlotInGrid">
                <div class="ws-header">
                    <div class="ws-char-info">
                        <img src="${wonderImg}" class="ws-char-img">
                        <div class="ws-char-details">
                            <div class="ws-char-name">${this.getWonderDisplayName()}</div>
                            ${slotCharSub}
                        </div>
                    </div>
                </div>
                <div class="ws-details">
                    <div class="ws-order">
                        <span class="order-label">${window.I18nService ? window.I18nService.t('orderLabel') : '순서'}</span>
                        <select class="styled-select order-select ws-order-select">
                            <option value="-" ${currentOrder == '-' ? 'selected' : ''}>-</option>
                            ${orderOptions.map(n => `<option value="${n}" ${currentOrder == n ? 'selected' : ''}>${n}</option>`).join('')}
                        </select>
                    </div>
                    <div class="revelation-dropdown wonder-weapon-dropdown">
                        <button type="button" class="revelation-button" style="width: 100%; justify-content: flex-start;">
                            ${weaponId ? `<img class="revelation-icon" src="${this.baseUrl}/assets/img/wonder-weapon/${encodeURIComponent(weaponImageName)}.webp" onerror="this.style.display='none'">` : ''}
                            <span>${weaponDisplayName || '-'}</span>
                        </button>
                        <div class="revelation-menu"></div>
                    </div>
                </div>
            </div>
        `;
    }

    bindWonderSlotEvents() {
        const wonderSlot = this.container.querySelector('#wonderSlotInGrid');
        if (!wonderSlot) return;

        // Order select
        const orderSelect = wonderSlot.querySelector('.ws-order-select');
        if (orderSelect) {
            orderSelect.addEventListener('change', (e) => {
                e.stopPropagation();
                const newOrder = e.target.value;
                if (this.partyUI && typeof this.partyUI.updateSlotOrder === 'function') {
                    this.partyUI.updateSlotOrder('mystery', newOrder);
                } else {
                    // Fallback: update directly through store
                    this.store.setWonderConfig({ ...this.store.state.wonder, order: newOrder === '-' ? '-' : parseInt(newOrder) });
                }
            });
        }

        // Weapon dropdown
        const wonderWeaponDropdown = wonderSlot.querySelector('.wonder-weapon-dropdown');
        if (wonderWeaponDropdown) {
            const button = wonderWeaponDropdown.querySelector('.revelation-button');
            const menu = wonderWeaponDropdown.querySelector('.revelation-menu');

            const closeAll = () => {
                document.querySelectorAll('.wonder-weapon-dropdown.open').forEach(d => d.classList.remove('open'));
            };

            if (!this._wonderWeaponOutsideHandlerBound) {
                this._wonderWeaponOutsideHandlerBound = true;
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.wonder-weapon-dropdown')) {
                        closeAll();
                    }
                });
            }

            const buildMenu = () => {
                if (!menu) return;
                const weapons = DataLoader.getWeaponList() || {};
                const list = Object.keys(weapons);

                menu.innerHTML = '';

                const addItem = (label, value) => {
                    const item = document.createElement('button');
                    item.type = 'button';
                    item.className = 'revelation-option';

                    if (value) {
                        const img = document.createElement('img');
                        img.className = 'revelation-icon';
                        img.src = `${this.baseUrl}/assets/img/wonder-weapon/${encodeURIComponent(value)}.webp`;
                        img.alt = value;
                        img.onerror = function () { this.style.display = 'none'; };
                        item.appendChild(img);
                    }

                    const span = document.createElement('span');
                    span.textContent = label;
                    item.appendChild(span);

                    item.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        wonderWeaponDropdown.classList.remove('open');
                        button?.setAttribute('aria-expanded', 'false');
                        this.store.setWonderConfig({ ...this.store.state.wonder, weapon: value });
                        this.render();
                    });

                    menu.appendChild(item);
                };

                addItem('-', '');
                list.forEach(name => {
                    if (!name) return;
                    addItem(DataLoader.getWeaponDisplayName(name) || name, name);
                });
            };

            buildMenu();

            if (button) {
                button.setAttribute('aria-expanded', 'false');
                button.onclick = (e) => {
                    e.stopPropagation();
                    buildMenu();
                    const isOpen = wonderWeaponDropdown.classList.toggle('open');
                    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                };
            }
        }
    }

    renderPersonaCard(index, persona) {
        const p = persona || {};
        const pName = p.name || '';
        const pDisplayName = pName ? DataLoader.getPersonaDisplayName(pName) : (window.I18nService ? window.I18nService.t('notSelected') : '선택 안함');
        const skills = p.skills || ['', '', '', ''];
        const memo = p.memo || '';

        const store = (window.personaFiles || {});
        const personaData = pName ? store[pName] : null;

        const unique = (personaData && personaData.uniqueSkill && personaData.uniqueSkill.name)
            ? personaData.uniqueSkill.name
            : '';
        const getLang = () => {
            if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
                return window.I18nService.getCurrentLanguage();
            }
            return 'kr';
        };

        const lang = getLang();
        const uniqueIconRaw = (personaData && personaData.uniqueSkill)
            ? (personaData.uniqueSkill.icon || '')
            : '';

        // Localized Unique Skill Name
        let uniqueName = unique;
        if (personaData && personaData.uniqueSkill) {
            if (lang === 'en') uniqueName = personaData.uniqueSkill.name_en || uniqueName;
            else if (lang === 'jp') uniqueName = personaData.uniqueSkill.name_jp || personaData.uniqueSkill.name_en || uniqueName;
        }

        // Fallback: if persona unique skill icon is missing (or 'Default'), use personaSkillList lookup
        const skillNameForLookup = unique || (skills && skills[0]) || '';
        const skillInfo = skillNameForLookup ? ((window.personaSkillList || {})[skillNameForLookup] || {}) : {};
        const listIcon = (lang === 'en' || lang === 'jp') ? (skillInfo.icon_gl || skillInfo.icon || '') : (skillInfo.icon || '');

        let uniqueIcon = uniqueIconRaw;
        // Treat 'Default' as empty to trigger fallback
        if (uniqueIcon === 'Default') uniqueIcon = '';

        uniqueIcon = uniqueIcon || listIcon || '패시브';

        // Persona card image elements
        let cardContent = '<div class="empty-wp"></div>';
        let nameIcons = '';

        if (pName && personaData) {
            const element = personaData.element || 'phys';
            const position = personaData.position || '';
            const star = personaData.star || 5;
            const tier = personaData.tier || '';

            const bgImg = `${this.baseUrl}/assets/img/persona/persona-card-${element}.webp`;
            const pImg = `${this.baseUrl}/assets/img/persona/${pName}.webp`;
            const elIcon = `${this.baseUrl}/assets/img/persona/속성_${element}.png`;
            const posIcon = `${this.baseUrl}/assets/img/persona/직업_${position}.png`;
            const coverStar = `${this.baseUrl}/assets/img/persona/persona-cover-star${star}.webp`;

            // wp-img: No tier label, no position icon - cleaner look
            cardContent = `
                <div class="card">
                    <img src="${bgImg}" class="card-background" loading="lazy" onerror="this.style.display='none'">
                    <div class="image-container">
                        <img src="${pImg}" class="persona-img" loading="lazy" onerror="this.style.display='none'">
                    </div>
                    <img src="${coverStar}" class="cover-star" loading="lazy" onerror="this.style.display='none'">
                    <img src="${elIcon}" alt="${element}" class="element-icon" loading="lazy" onerror="this.style.display='none'">
                </div>
            `;

            // Name icons (element + position)
            nameIcons = `
                <div class="wp-name-icons">
                    <img src="${elIcon}" alt="${element}" class="wp-el-icon" onerror="this.style.display='none'">
                    <img src="${posIcon}" alt="${position}" class="wp-pos-icon" onerror="this.style.display='none'">
                </div>
            `;
        }

        return `
            <div class="wonder-persona-card" data-index="${index}">
                <div class="wp-header" data-action="select-persona">
                    <div class="wp-img-wrapper">
                         ${cardContent}
                    </div>
                    <div class="wp-name-row">
                        ${nameIcons}
                        <div class="wp-name">${pDisplayName}</div>
                    </div>
                </div>
                
                <div class="wp-details">
                    <div class="wp-skills">
                        <div class="revelation-dropdown wp-unique-skill" data-persona-index="${index}">
                            <button type="button" class="revelation-button" style="width: 100%; justify-content: flex-start;" disabled>
                                ${uniqueIcon ? `<img class="revelation-icon" src="${this.baseUrl}/assets/img/skill-element/${encodeURIComponent(uniqueIcon)}.png" onerror="this.style.display='none'">` : ''}
                                <span>${uniqueName || '-'}</span>
                            </button>
                        </div>

                        ${[1, 2, 3].map((slot) => {
            const skill = skills[slot] || '';
            return `
                                <div class="revelation-dropdown wp-skill-dropdown" data-persona-index="${index}" data-skill-index="${slot}">
                                    <button type="button" class="revelation-button" style="width: 100%; justify-content: flex-start;">
                                        <span class="wp-skill-label" data-value="${skill || ''}">${skill || '-'}</span>
                                    </button>
                                    <div class="revelation-menu"></div>
                                </div>
                            `;
        }).join('')}
                    </div>
                    <input type="text" class="wp-memo-input" placeholder="${window.I18nService ? window.I18nService.t('memo') : '메모'}" value="${memo}">
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Persona Selection Click
        this.container.querySelectorAll('.wp-header').forEach(header => {
            header.onclick = (e) => {
                const index = parseInt(header.closest('.wonder-persona-card').dataset.index);
                this.activePersonaIndex = index;
                if (this.personaModal) {
                    const currentPersonas = (this.store.state.wonder.personas || [])
                        .map(p => p.name)
                        .filter(n => n);
                    this.personaModal.open(this.handlePersonaSelect, currentPersonas);
                }
            };
        });

        const getLang = () => {
            if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
                return window.I18nService.getCurrentLanguage();
            }
            return 'kr';
        };

        const getSkillDisplayName = (skillName) => {
            const lang = getLang();
            if (!skillName) return '';
            if (lang === 'kr') return skillName;
            const data = (window.personaSkillList || {})[skillName];
            if (!data) return skillName;
            if (lang === 'en' && data.name_en) return data.name_en;
            if (lang === 'jp' && data.name_jp) return data.name_jp;
            return skillName;
        };

        const getSkillIconKey = (skillName) => {
            if (!skillName) return '';
            const data = (window.personaSkillList || {})[skillName];
            if (!data) return '';
            const lang = getLang();
            return (lang === 'en' || lang === 'jp') ? (data.icon_gl || data.icon || '') : (data.icon || '');
        };

        const getLocale = () => {
            const lang = getLang();
            if (lang === 'jp') return 'ja-JP';
            if (lang === 'en') return 'en';
            return 'ko-KR';
        };

        const getSortedSkills = (personaName) => {
            const list = Object.keys(window.personaSkillList || {});

            // 1. Get recommended skills for this Persona
            const store = window.personaFiles || {};
            const pData = personaName ? store[personaName] : null;
            const recommended = (pData && pData.recommendSkill) ? pData.recommendSkill.map(r => r.name) : [];
            const recSet = new Set(recommended);

            // 2. Separate list into [Recommended] and [Others]
            // "Remove name sort" -> Keep original order of 'list' for others?
            // User requested to put recommended on top.

            // Filter recommended items that actually exist in the skill list
            const topList = recommended.filter(name => list.includes(name));

            // Get the rest
            const otherList = list.filter(name => !recSet.has(name));

            return [...topList, ...otherList];
        };

        const renderSkillDropdownLabel = (dropdownEl, value) => {
            const btn = dropdownEl.querySelector('.revelation-button');
            if (!btn) return;
            btn.innerHTML = '';
            if (!value) {
                const span = document.createElement('span');
                span.textContent = '-';
                btn.appendChild(span);
                return;
            }
            const iconKey = getSkillIconKey(value);
            if (iconKey) {
                const img = document.createElement('img');
                img.className = 'revelation-icon';
                img.src = `${this.baseUrl}/assets/img/skill-element/${encodeURIComponent(iconKey)}.png`;
                img.alt = '';
                img.onerror = function () { this.style.display = 'none'; };
                btn.appendChild(img);
            }
            const span = document.createElement('span');
            span.textContent = getSkillDisplayName(value);
            btn.appendChild(span);
        };

        const buildSkillMenu = (dropdownEl) => {
            const menu = dropdownEl.querySelector('.revelation-menu');
            if (!menu) return;

            const pIndex = parseInt(dropdownEl.dataset.personaIndex);
            const sIndex = parseInt(dropdownEl.dataset.skillIndex);

            // Get current persona name for this slot
            const current = this.store.state.wonder;
            const currentP = (current.personas && current.personas[pIndex]) ? current.personas[pIndex] : {};
            const personaName = currentP.name || '';

            const skills = getSortedSkills(personaName);
            menu.innerHTML = '';

            const search = document.createElement('input');
            search.type = 'text';
            search.placeholder = (window.I18nService && window.I18nService.t('common.search')) || '검색...';
            search.className = 'input-text';
            search.style.minHeight = 'unset';
            search.style.height = '32px';
            search.style.marginBottom = '6px';
            menu.appendChild(search);

            const listWrap = document.createElement('div');
            listWrap.style.display = 'grid';
            listWrap.style.gap = '2px';
            menu.appendChild(listWrap);

            // Blur input on scroll to finish IME composition
            menu.onscroll = () => {
                if (document.activeElement === search) {
                    search.blur();
                }
            };

            // Create all options once
            const allOptions = [];

            const createOption = (label, value, iconKey) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'revelation-option';
                btn.dataset.skillValue = value;

                // Store text for filtering
                const searchText = (label + (value || '')).toLowerCase();

                if (iconKey) {
                    const img = document.createElement('img');
                    img.className = 'revelation-icon';
                    img.src = `${this.baseUrl}/assets/img/skill-element/${encodeURIComponent(iconKey)}.png`;
                    img.alt = '';
                    img.onerror = function () { this.style.display = 'none'; };
                    btn.appendChild(img);
                }
                const span = document.createElement('span');
                span.textContent = label;
                btn.appendChild(span);

                listWrap.appendChild(btn);
                allOptions.push({ element: btn, text: searchText });
            };

            // Add default option
            createOption('-', '', '');

            // Add all skills
            skills.forEach(name => {
                createOption(getSkillDisplayName(name), name, getSkillIconKey(name));
            });

            // Use mousedown delegation to capture event immediately and prevent focus loss
            listWrap.onmousedown = (e) => {
                const btn = e.target.closest('.revelation-option');
                if (!btn) return;

                // CRITICAL: Prevent default to stop input blur / virtual keyboard shift
                e.preventDefault();
                e.stopPropagation();

                const selectedVal = btn.dataset.skillValue;

                const current = this.store.state.wonder;
                const newPersonas = [...(current.personas || [{}, {}, {}])];
                const targetPersona = { ...(newPersonas[pIndex] || {}) };
                const newSkills = [...(targetPersona.skills || ['', '', '', ''])];
                newSkills[sIndex] = selectedVal;
                targetPersona.skills = newSkills;
                newPersonas[pIndex] = targetPersona;
                this.store.setWonderConfig({ ...current, personas: newPersonas });

                dropdownEl.classList.remove('open');
                // Force immediate render to reflect state
                this.render();
            };

            let lastFilter = null;
            let rafId = null;

            const apply = (filter) => {
                const f = String(filter || '').toLowerCase();
                if (f === lastFilter) return;
                lastFilter = f;

                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    allOptions.forEach(opt => {
                        if (!f || opt.text.includes(f)) {
                            opt.element.style.display = '';
                        } else {
                            opt.element.style.display = 'none';
                        }
                    });
                });
            };

            search.oninput = () => apply(search.value);
            // Initial state: show all
            apply('');
        };

        // Skill dropdowns
        this.container.querySelectorAll('.wp-skill-dropdown').forEach(dropdown => {
            const current = this.store.state.wonder;
            const pIndex = parseInt(dropdown.dataset.personaIndex);
            const sIndex = parseInt(dropdown.dataset.skillIndex);
            const existing = (current.personas && current.personas[pIndex] && current.personas[pIndex].skills)
                ? (current.personas[pIndex].skills[sIndex] || '')
                : '';
            renderSkillDropdownLabel(dropdown, existing);

            const btn = dropdown.querySelector('.revelation-button');
            if (btn) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const willOpen = !dropdown.classList.contains('open');
                    document.querySelectorAll('.wp-skill-dropdown.open').forEach(d => {
                        if (d !== dropdown) d.classList.remove('open');
                    });
                    dropdown.classList.toggle('open', willOpen);
                    if (willOpen) buildSkillMenu(dropdown);
                };
            }
        });

        // Memo Input
        this.container.querySelectorAll('.wp-memo-input').forEach(input => {
            input.onchange = (e) => {
                const card = input.closest('.wonder-persona-card');
                const pIndex = parseInt(card.dataset.index);

                const current = this.store.state.wonder;
                const newPersonas = [...(current.personas || [{}, {}, {}])];
                const targetPersona = { ...(newPersonas[pIndex] || {}) };

                targetPersona.memo = e.target.value;
                newPersonas[pIndex] = targetPersona;

                this.store.setWonderConfig({ ...current, personas: newPersonas });
            };
        });

        // Close dropdown on outside click
        if (!this._outsideBound) {
            this._outsideBound = true;
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.wp-skill-dropdown')) {
                    document.querySelectorAll('.wp-skill-dropdown.open').forEach(d => d.classList.remove('open'));
                }
            });
        }
    }
}
