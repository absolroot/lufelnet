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

    /**
     * Get weapon tooltip text based on current language and mod level
     * Also includes lightning_stamp effect if stampLevel >= 1
     */
    getWeaponTooltip(weaponData, modLevel = 6, stampLevel = 0) {
        if (!weaponData) return '';
        const lang = this.getCurrentLang();
        let effect = '';
        if (lang === 'en' && weaponData.effect_en) {
            effect = weaponData.effect_en;
        } else if (lang === 'jp' && weaponData.effect_jp) {
            effect = weaponData.effect_jp;
        } else {
            effect = weaponData.effect || '';
        }
        
        // Replace 7-split values with the value at modLevel index
        const sevenSplitReplace = /(\d+(?:\.\d+)?%?)(?:\s*\/\s*(\d+(?:\.\d+)?%?)){6}/g;
        effect = effect.replace(sevenSplitReplace, (match) => {
            const parts = match.split('/').map(x => x.trim());
            return parts[Math.min(Math.max(modLevel, 0), 6)] || parts[0];
        });
        
        // Add lightning_stamp effect if stampLevel >= 1
        if (stampLevel >= 1 && weaponData.lightning_stamp && Array.isArray(weaponData.lightning_stamp) && weaponData.lightning_stamp.length > 0) {
            const stamp = weaponData.lightning_stamp[0];
            let stampName = '';
            let stampEffect = '';
            
            if (lang === 'en' && stamp.name_en) {
                stampName = stamp.name_en;
            } else if (lang === 'jp' && stamp.name_jp) {
                stampName = stamp.name_jp;
            } else {
                stampName = stamp.name || '';
            }
            
            if (lang === 'en' && stamp.effect_en) {
                stampEffect = stamp.effect_en;
            } else if (lang === 'jp' && stamp.effect_jp) {
                stampEffect = stamp.effect_jp;
            } else {
                stampEffect = stamp.effect || '';
            }
            
            // Replace 4-split values with the value at stampLevel index (1-4)
            const fourSplitReplace = /(\d+(?:\.\d+)?%?)(?:\s*\/\s*(\d+(?:\.\d+)?%?)){3}/g;
            stampEffect = stampEffect.replace(fourSplitReplace, (match) => {
                const parts = match.split('/').map(x => x.trim());
                // stampLevel is 1-4, array index is 0-3
                return parts[Math.min(Math.max(stampLevel - 1, 0), 3)] || parts[0];
            });
            
            if (stampName && stampEffect) {
                effect += `<br><br><b>${stampName}</b><br>${stampEffect}`;
            }
        }
        
        // Highlight numbers
        effect = effect.replace(/(\d+(?:\.\d+)?%?)/g, '<span class="tooltip-num">$1</span>');
        
        // Don't escape HTML - tooltip.js uses innerHTML
        return effect.replace(/\n/g, '<br>');
    }

    /**
     * Get skill tooltip text based on current language
     * Priority: 1. uniqueSkill (from persona data)
     *           2. recommendSkill description (from personaSkillList)
     *           3. personaSkillList description
     */
    getSkillTooltip(skillName, personaName = '') {
        if (!skillName) return '';
        const lang = this.getCurrentLang();
        const highlightNums = (text) => text.replace(/(\d+(?:\.\d+)?%?)/g, '<span class="tooltip-num">$1</span>');

        // 1. Check if it's a unique skill from persona data
        if (personaName) {
            const store = window.personaFiles || {};
            const personaData = store[personaName];
            if (personaData && personaData.uniqueSkill) {
                const unique = personaData.uniqueSkill;
                const uniqueNameKr = unique.name || '';
                const uniqueNameEn = unique.name_en || '';
                const uniqueNameJp = unique.name_jp || '';
                
                // Check if skillName matches unique skill name in any language
                if (skillName === uniqueNameKr || skillName === uniqueNameEn || skillName === uniqueNameJp) {
                    let desc = '';
                    if (lang === 'en' && unique.desc_en) desc = unique.desc_en;
                    else if (lang === 'jp' && unique.desc_jp) desc = unique.desc_jp;
                    else desc = unique.desc || '';
                    
                    if (desc) return highlightNums(desc);
                }
            }
        }

        // 2. Check personaSkillList (includes recommend skills)
        const skillData = (window.personaSkillList || {})[skillName];
        if (skillData) {
            let desc = '';
            if (lang === 'en' && skillData.description_en) desc = skillData.description_en;
            else if (lang === 'jp' && skillData.description_jp) desc = skillData.description_jp;
            else desc = skillData.description || '';
            
            if (desc) return highlightNums(desc);
        }

        return '';
    }

    /**
     * Get persona passive skill tooltip text based on current language
     * For 야노식, show last 2 passive skills; for others, show only the last one
     */
    getPersonaPassiveTooltip(personaName) {
        if (!personaName) return '';
        const store = window.personaFiles || {};
        const personaData = store[personaName];
        if (!personaData || !personaData.passive_skill || personaData.passive_skill.length === 0) return '';

        const lang = this.getCurrentLang();
        const passives = personaData.passive_skill;
        
        // 야노식 shows last 2, others show last 1
        const isYanosik = personaName === '야노식';
        const count = isYanosik ? 2 : 1;
        const startIdx = Math.max(0, passives.length - count);
        const selectedPassives = passives.slice(startIdx);

        // Highlight numbers in text
        const highlightNums = (text) => text.replace(/(\d+(?:\.\d+)?%?)/g, '<span class="tooltip-num">$1</span>');

        const lines = selectedPassives.map(p => {
            let name = p.name || '';
            let desc = p.desc || '';
            if (lang === 'en') {
                name = p.name_en || name;
                desc = p.desc_en || desc;
            } else if (lang === 'jp') {
                name = p.name_jp || name;
                desc = p.desc_jp || desc;
            }
            return `<b>${name}</b><br>${highlightNums(desc)}`;
        });

        const tooltip = lines.join('<br><br>');
        // Don't escape HTML - tooltip.js uses innerHTML
        return tooltip;
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
                ${wonderElement ? `<span class="slot-meta-text slot-meta-element">${displayElement}</span>` : ''}
                ${posIcon ? `<img src="${posIcon}" class="meta-icon" title="${displayPosition}" onerror="this.style.display='none'">` : ''}
                ${wonderPosition ? `<span class="slot-meta-text slot-meta-position">${displayPosition}</span>` : ''}
            </div>
        ` : '';

        // Limit order options to number of characters with order-able slots
        const maxOrder = this.store.getOrderableCharacterCount();
        const orderOptions = [];
        for (let n = 1; n <= maxOrder; n++) {
            orderOptions.push(n);
        }

        // Order image for non-edit mode
        const orderNum = currentOrder !== '-' ? String(currentOrder).padStart(2, '0') : '';
        const orderImgSrc = orderNum ? `${this.baseUrl}/assets/img/ui/num${orderNum}.png` : '';

        // Mod and Stamp options for wonder weapon
        const currentMod = config.weaponMod !== undefined ? config.weaponMod : 6;
        const currentStamp = config.weaponStamp !== undefined ? config.weaponStamp : 4;
        const hasLightningStamp = weaponData && Array.isArray(weaponData.lightning_stamp) && weaponData.lightning_stamp.length > 0;

        // Mod icon for name display (show r0 icon when mod is 0)
        const modIconSrc = `${this.baseUrl}/assets/img/ritual/r${currentMod}.png`;
        
        // Stamp icon and roman numeral for display (only if stamp >= 1)
        const romanNumerals = ['', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'];
        const stampIconHtml = (hasLightningStamp && currentStamp !== '-' && currentStamp >= 1) 
            ? `<img class="preset-icon stamp-icon" src="${this.baseUrl}/assets/img/character-weapon/weaponEngraving-icon-1.png" alt="Stamp"><span class="stamp-roman">${romanNumerals[currentStamp] || ''}</span>` 
            : '';

        return `
            <div class="wonder-persona-card wonder-slot-card" id="wonderSlotInGrid">
                <div class="ws-header">
                    <div class="ws-char-info">
                        <img src="${wonderImg}" class="ws-char-img">
                        <div class="ws-char-details">
                            <div class="ws-char-name">
                                ${this.getWonderDisplayName()}
                                <span class="preset-icons"><img class="preset-icon" src="${modIconSrc}" alt="R${currentMod}">${stampIconHtml}</span>
                            </div>
                            ${slotCharSub}
                        </div>
                    </div>
                    ${orderImgSrc ? `<img class="order-img" src="${orderImgSrc}" alt="${window.I18nService ? window.I18nService.t('orderLabel') : '순서'} ${currentOrder}">` : ''}
                </div>
                <div class="ws-details">
                    <div class="ritual-mod-wrapper" style="display: grid; grid-template-columns: ${hasLightningStamp ? '1fr 1fr 1fr' : '1fr 1fr'}; gap: 20px;">
                        <div class="slot-option-group">
                            <label style="font-size: 11px; opacity: 0.7; margin-bottom: 2px; display: block;">${window.I18nService ? window.I18nService.t('orderLabel') : '순서'}</label>
                            <select class="styled-select order-select ws-order-select">
                                <option value="-" ${currentOrder == '-' ? 'selected' : ''}>-</option>
                                ${orderOptions.map(n => `<option value="${n}" ${currentOrder == n ? 'selected' : ''}>${n}</option>`).join('')}
                            </select>
                        </div>
                        <div class="slot-option-group">
                            <label style="font-size: 11px; opacity: 0.7; margin-bottom: 2px; display: block;">${window.I18nService ? window.I18nService.t('modLabel') || '개조' : '개조'}</label>
                            <select class="styled-select mod-select ws-weapon-mod-select">
                                ${[0,1,2,3,4,5,6].map(n => `<option value="${n}" ${currentMod == n ? 'selected' : ''}>${n}</option>`).join('')}
                            </select>
                        </div>
                        ${hasLightningStamp ? `
                        <div class="slot-option-group">
                            <label style="font-size: 11px; opacity: 0.7; margin-bottom: 2px; display: block;">${window.I18nService ? window.I18nService.t('stampLabel') || '인장' : '인장'}</label>
                            <select class="styled-select stamp-select ws-weapon-stamp-select">
                                <option value="-" ${currentStamp === '-' ? 'selected' : ''}>-</option>
                                ${[0,1,2,3,4].map(n => `<option value="${n}" ${currentStamp == n ? 'selected' : ''}>${n}</option>`).join('')}
                            </select>
                        </div>
                        ` : ''}
                    </div>
                    <div class="revelation-dropdown wonder-weapon-dropdown">
                        <button type="button" class="revelation-button" style="width: 100%; justify-content: flex-start;" ${weaponId && weaponData && weaponData.effect ? `data-tooltip="${this.getWeaponTooltip(weaponData, currentMod, currentStamp).replace(/"/g, '&quot;')}"` : ''}>
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

        // Weapon mod select
        const modSelect = wonderSlot.querySelector('.ws-weapon-mod-select');
        if (modSelect) {
            modSelect.addEventListener('change', (e) => {
                e.stopPropagation();
                const newMod = parseInt(e.target.value);
                this.store.setWonderConfig({ ...this.store.state.wonder, weaponMod: newMod });
                
                // Update tooltip with new mod level
                const button = wonderSlot.querySelector('.wonder-weapon-dropdown .revelation-button');
                if (button) {
                    const config = this.store.getWonderConfig();
                    let weaponId = config.weapon;
                    if (typeof weaponId === 'object' && weaponId !== null) weaponId = weaponId.name;
                    const weaponData = weaponId ? DataLoader.getWeaponList()[weaponId] : null;
                    const currentStamp = config.weaponStamp !== undefined ? config.weaponStamp : 4;
                    
                    if (weaponData && weaponData.effect) {
                        button.setAttribute('data-tooltip', this.getWeaponTooltip(weaponData, newMod, currentStamp).replace(/"/g, '&quot;'));
                    }
                }
            });
        }

        // Weapon stamp select
        const stampSelect = wonderSlot.querySelector('.ws-weapon-stamp-select');
        if (stampSelect) {
            stampSelect.addEventListener('change', (e) => {
                e.stopPropagation();
                const val = e.target.value;
                const newStamp = val === '-' ? '-' : parseInt(val);
                this.store.setWonderConfig({ ...this.store.state.wonder, weaponStamp: newStamp });
                
                // Update tooltip with new stamp level
                const button = wonderSlot.querySelector('.wonder-weapon-dropdown .revelation-button');
                if (button) {
                    const config = this.store.getWonderConfig();
                    let weaponId = config.weapon;
                    if (typeof weaponId === 'object' && weaponId !== null) weaponId = weaponId.name;
                    const weaponData = weaponId ? DataLoader.getWeaponList()[weaponId] : null;
                    const currentMod = config.weaponMod !== undefined ? config.weaponMod : 6;
                    
                    if (weaponData && weaponData.effect) {
                        button.setAttribute('data-tooltip', this.getWeaponTooltip(weaponData, currentMod, newStamp).replace(/"/g, '&quot;'));
                    }
                }
            });
        }

        // Weapon dropdown
        const wonderWeaponDropdown = wonderSlot.querySelector('.wonder-weapon-dropdown');
        if (wonderWeaponDropdown) {
            const button = wonderWeaponDropdown.querySelector('.revelation-button');
            const menu = wonderWeaponDropdown.querySelector('.revelation-menu');
            
            // Bind tooltip for desktop hover directly (avoid bindTooltipElement which clones nodes)
            if (window.innerWidth > 1200 && button && button.hasAttribute('data-tooltip')) {
                const floating = document.getElementById('cursor-tooltip') || (() => {
                    const el = document.createElement('div');
                    el.id = 'cursor-tooltip';
                    el.className = 'cursor-tooltip';
                    document.body.appendChild(el);
                    return el;
                })();
                button.addEventListener('mouseenter', function(e) {
                    const content = this.getAttribute('data-tooltip');
                    if (content) { floating.innerHTML = content; floating.style.display = 'block'; }
                });
                button.addEventListener('mousemove', function(e) {
                    const offset = 16;
                    let x = e.clientX + offset, y = e.clientY + offset;
                    const vw = window.innerWidth, vh = window.innerHeight;
                    const ttW = floating.offsetWidth, ttH = floating.offsetHeight;
                    if (x + ttW + 8 > vw) x = e.clientX - ttW - offset;
                    if (y + ttH + 8 > vh) y = e.clientY - ttH - offset;
                    floating.style.left = x + 'px'; floating.style.top = y + 'px';
                });
                button.addEventListener('mouseleave', function() { floating.style.display = 'none'; });
            }

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

        const passiveTooltip = this.getPersonaPassiveTooltip(pName);
        // Escape quotes for HTML attribute (but keep HTML tags for innerHTML rendering)
        const escapedTooltip = passiveTooltip ? passiveTooltip.replace(/"/g, '&quot;') : '';
        
        // Get unique skill tooltip
        const uniqueSkillTooltip = uniqueName ? this.getSkillTooltip(uniqueName, pName) : '';
        const escapedUniqueTooltip = uniqueSkillTooltip ? uniqueSkillTooltip.replace(/"/g, '&quot;') : '';
        
        return `
            <div class="wonder-persona-card" data-index="${index}">
                <div class="wp-header" data-action="select-persona">
                    <div class="wp-img-wrapper" ${escapedTooltip ? `data-tooltip="${escapedTooltip}"` : ''}>
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
                            <button type="button" class="revelation-button" style="width: 100%; justify-content: flex-start;" disabled ${escapedUniqueTooltip ? `data-tooltip="${escapedUniqueTooltip}"` : ''}>
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
        // Persona Selection Click (only in edit mode)
        this.container.querySelectorAll('.wp-header').forEach(header => {
            header.onclick = (e) => {
                // Block click in non-edit mode
                if (!document.body.classList.contains('tactic-edit-mode')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
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

        const renderSkillDropdownLabel = (dropdownEl, value, personaName = '') => {
            const btn = dropdownEl.querySelector('.revelation-button');
            if (!btn) return;
            btn.innerHTML = '';
            
            // Remove old tooltip attribute
            btn.removeAttribute('data-tooltip');
            
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
            
            // Add tooltip if description exists
            const tooltip = this.getSkillTooltip(value, personaName);
            if (tooltip) {
                btn.setAttribute('data-tooltip', tooltip.replace(/"/g, '&quot;'));
            }
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
            const currentP = (current.personas && current.personas[pIndex]) ? current.personas[pIndex] : {};
            const personaName = currentP.name || '';
            const existing = (currentP.skills) ? (currentP.skills[sIndex] || '') : '';
            renderSkillDropdownLabel(dropdown, existing, personaName);

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

        // Bind tooltips for skill dropdowns
        this.container.querySelectorAll('.wp-skill-dropdown .revelation-button[data-tooltip], .wp-unique-skill .revelation-button[data-tooltip]').forEach(btn => {
            if (window.innerWidth > 1200) {
                const floating = document.getElementById('cursor-tooltip') || (() => {
                    const el = document.createElement('div');
                    el.id = 'cursor-tooltip';
                    el.className = 'cursor-tooltip';
                    document.body.appendChild(el);
                    return el;
                })();
                btn.addEventListener('mouseenter', function(e) {
                    const content = this.getAttribute('data-tooltip');
                    if (content) { floating.innerHTML = content; floating.style.display = 'block'; }
                });
                btn.addEventListener('mousemove', function(e) {
                    const offset = 16;
                    let x = e.clientX + offset, y = e.clientY + offset;
                    const vw = window.innerWidth, vh = window.innerHeight;
                    const ttW = floating.offsetWidth, ttH = floating.offsetHeight;
                    if (x + ttW + 8 > vw) x = e.clientX - ttW - offset;
                    if (y + ttH + 8 > vh) y = e.clientY - ttH - offset;
                    floating.style.left = x + 'px'; floating.style.top = y + 'px';
                });
                btn.addEventListener('mouseleave', function() { floating.style.display = 'none'; });
            }
        });

        // Bind tooltips for persona passive skills
        this.container.querySelectorAll('.wp-img-wrapper[data-tooltip]').forEach(el => {
            if (typeof bindTooltipElement === 'function') {
                bindTooltipElement(el);
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
