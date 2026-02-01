/**
 * Tactic Maker V2 - Need Stat Card UI Module
 * Renders a collapsible critical/pierce rate checklist panel.
 */

import { DataLoader } from './data-loader.js';

// Global elucidator bonus values (shared across all slots)
let globalElucidatorCritical = 0;
let globalElucidatorPierce = 0;

export function getElucidatorBonuses() {
    return { critical: globalElucidatorCritical, pierce: globalElucidatorPierce };
}

export function setElucidatorBonuses(critical, pierce) {
    globalElucidatorCritical = critical;
    globalElucidatorPierce = pierce;
}

export class NeedStatCardUI {
    constructor(store, baseUrl) {
        this.store = store;
        this.baseUrl = baseUrl || window.BASE_URL || '';
        this.selectedItems = new Set();
        this.revelationSumCritical = 0;
        this.revelationSumPierce = 0;
        this.slotCharData = null;
        this.isElucidator = false;
    }

    formatTotalPair(total) {
        const current = Number.isFinite(total) ? total : 0;
        const needed = Math.max(0, 100 - current);
        return {
            currentText: `${current.toFixed(1)}%`,
            neededText: `${needed.toFixed(1)}%`
        };
    }

    renderTotalPairHtml(slotIndex, total, statType = 'critical', isElucidatorEditable = false) {
        const { currentText, neededText } = this.formatTotalPair(total);
        const { labelCurrent, labelNeeded } = this.getLabels();
        
        // For elucidator slot, render editable inputs instead of static text
        if (isElucidatorEditable) {
            const currentVal = Number.isFinite(total) ? total : 0;
            return `
                <span class="need-stat-total need-stat-total-editable" data-slot-index="${slotIndex}" data-stat-type="${statType}">
                    <input type="number" class="need-stat-elucidator-inline-input" data-stat="${statType}" value="${currentVal}" min="0" max="100" step="0.1">
                    <span class="need-stat-label-hint">${labelCurrent}</span>
                </span>
            `;
        }
        
        return `
            <span class="need-stat-total" data-slot-index="${slotIndex}" data-stat-type="${statType}">
                <span class="need-stat-current">${currentText}</span>
                <span class="need-stat-label-hint">${labelCurrent}</span>
                <span class="need-stat-sep">/</span>
                <span class="need-stat-needed">${neededText}</span>
                <span class="need-stat-label-hint">${labelNeeded}</span>
            </span>
        `;
    }

    updateTotalPairDisplays(slotIndex, total, statType = 'critical') {
        const { currentText, neededText } = this.formatTotalPair(total);
        document
            .querySelectorAll(`.need-stat-total[data-slot-index="${slotIndex}"][data-stat-type="${statType}"]`)
            .forEach(el => {
                const cur = el.querySelector('.need-stat-current');
                const need = el.querySelector('.need-stat-needed');
                if (cur) cur.textContent = currentText;
                if (need) need.textContent = neededText;
            });
    }

    getCurrentLang() {
        if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
            return window.I18nService.getCurrentLanguage();
        }
        return 'kr';
    }

    /**
     * Get critical buff data items that apply to this party setup
     */
    getApplicableBuffItems() {
        const items = [];
        const buffData = window.criticalBuffData || {};
        const wonderState = this.store.state.wonder || {};
        const personas = wonderState.personas || [];

        // 1. Common buffs (always available)
        if (buffData['공통']) {
            buffData['공통'].forEach(item => {
                items.push({ ...item, source: '공통' });
            });
        }

        // 2. Wonder persona skills: 리벨리온, 레볼루션 - only if in persona skill list
        const personaNames = personas.map(p => p?.name || '').filter(Boolean);
        const personaSkills = personas.flatMap(p => p?.skills || []).filter(Boolean);
        if (buffData['원더']) {
            buffData['원더'].forEach(item => {
                const skillName = item.skillName || '';
                // Only add 리벨리온/레볼루션 if they exist in the persona skill list
                if (skillName === '리벨리온' || skillName === '레볼루션') {
                    if (personaSkills.includes(skillName)) {
                        items.push({ ...item, source: '원더' });
                    }
                }
            });
        }

        // 3. Wonder items: type === '페르소나' and skillName contains selected persona name
        if (buffData['원더']) {
            buffData['원더'].forEach(item => {
                if (item.type === '페르소나') {
                    const matchesPersona = personaNames.some(pName => {
                        return item.skillName && item.skillName.includes(pName);
                    });
                    if (matchesPersona) {
                        items.push({ ...item, source: '원더' });
                    }
                }
            });
        }

        // 4. Party member buffs
        const party = this.store.state.party || [];
        party.forEach((member) => {
            if (!member || !member.name) return;
            const charName = member.name;
            if (buffData[charName]) {
                buffData[charName].forEach(item => {
                    items.push({ ...item, source: charName });
                });
            }
        });

        return items;
    }

    /**
     * Get critical self data items for a specific character
     */
    getApplicableSelfItems(charData) {
        const items = [];
        const selfData = window.criticalSelfData || {};

        if (!charData || !charData.name) return items;

        const mainRev = charData.mainRev || '';
        const subRev = charData.subRev || '';
        const charName = charData.name;

        // 1. Revelation items matching current character's revelation
        if (selfData['계시']) {
            selfData['계시'].forEach(item => {
                const skillName = item.skillName || '';

                if (skillName.includes('-')) {
                    const [mainPart, subPart] = skillName.split('-');
                    if (mainRev && mainRev.includes(mainPart) && subRev && subRev.includes(subPart)) {
                        items.push({ ...item, source: '계시' });
                    }
                } else {
                    if ((mainRev && skillName.includes(mainRev)) || (subRev && skillName.includes(subRev))) {
                        items.push({ ...item, source: '계시' });
                    }
                }
            });
        }

        // 2. Character-specific self items
        if (selfData[charName]) {
            selfData[charName].forEach(item => {
                items.push({ ...item, source: charName });
            });
        }

        return items;
    }

    /**
     * Get localized source name
     * For Korean: use slot item name (codename style) instead of character name
     */
    getSourceDisplayName(source) {
        const lang = this.getCurrentLang();
        if (source === '공통') {
            return lang === 'en' ? 'Common' : (lang === 'jp' ? '共通' : '공통');
        }
        if (source === '원더') {
            return lang === 'en' ? 'WONDER' : (lang === 'jp' ? 'ワンダー' : '원더');
        }
        if (source === '계시') {
            return lang === 'en' ? 'Revelation' : (lang === 'jp' ? '啓示' : '계시');
        }
        // Character name - use characterData for proper display
        const charMeta = (window.characterData || {})[source];
        if (charMeta) {
            if (lang === 'en') return charMeta.codename || source;
            if (lang === 'jp') return charMeta.name_jp || source;
            // Korean: use the source name directly (character name from data)
            return source;
        }
        return DataLoader.getCharacterDisplayName(source) || source;
    }

    /**
     * Get localized skill name following critical-calc.js pattern
     */
    getLocalizedSkillName(item, groupName = '') {
        const lang = this.getCurrentLang();
        let localizedName = '';

        if (lang === 'en') {
            localizedName = (item.skillName_en && String(item.skillName_en).trim()) ? item.skillName_en : '';
        } else if (lang === 'jp') {
            localizedName = (item.skillName_jp && String(item.skillName_jp).trim()) ? item.skillName_jp : '';
        }

        // Fallback rules: EN/JP only allow KR fallback for 원더 group's 전용무기/페르소나/스킬
        if (!localizedName) {
            const isWonder = groupName === '원더';
            const typeStr = String(item.type || '');
            const isWonderDisplayType = isWonder && (typeStr === '전용무기' || typeStr === '페르소나' || typeStr === '스킬');
            if (lang !== 'kr' && isWonderDisplayType) {
                localizedName = item.skillName || '';
            } else if (lang === 'kr') {
                localizedName = item.skillName || '';
            }
        }

        return localizedName;
    }

    /**
     * Render a critical item row with Target column
     */
    renderItemRow(item, isSelf = false) {
        const lang = this.getCurrentLang();
        const itemId = item.id || `${item.source}_${item.skillName}`;
        const groupName = item.source || '';

        const skillName = this.getLocalizedSkillName(item, groupName);

        let typeName = item.type || '';
        if (lang === 'en' && item.type_en) typeName = item.type_en;
        if (lang === 'jp' && item.type_jp) typeName = item.type_jp;

        const target = item.target || '';
        const value = item.value || 0;
        const skillIcon = item.skillIcon ? `${this.baseUrl}${item.skillIcon}` : '';
        const isChecked = this.selectedItems.has(itemId);
        const sourceName = this.getSourceDisplayName(item.source);

        // Build display name: for non-원더/계시 in EN/JP, show only name if available
        let displayName = '';
        const isSpecialGroup = (groupName === '원더' || groupName === '계시');
        if (lang === 'kr') {
            displayName = typeName + (skillName ? ' ' + skillName : '');
        } else {
            if (skillName && skillName.trim()) {
                if (!isSpecialGroup) {
                    displayName = skillName;
                } else {
                    displayName = typeName + (skillName ? ' ' + skillName : '');
                }
            } else {
                displayName = typeName;
            }
        }

        // Options dropdown if item has options
        let optionsHtml = '';
        if (item.options && item.options.length > 0) {
            const selectedOpt = item._selectedOption || item.defaultOption || item.options[0];
            optionsHtml = `
                <select class="need-stat-select" data-item-id="${itemId}">
                    ${item.options.map(opt => {
                        const selected = (selectedOpt === opt) ? 'selected' : '';
                        return `<option value="${opt}" ${selected}>${opt}</option>`;
                    }).join('')}
                </select>
            `;
        }

        // Display: [check] [target] [icon] [source] name [options] value%
        return `
            <div class="need-stat-row ${isChecked ? 'checked' : ''}" data-item-id="${itemId}" data-item-type="${item.type || ''}">
                <img src="${this.baseUrl}/assets/img/ui/check-${isChecked ? 'on' : 'off'}.png" class="need-stat-check">
                <span class="need-stat-target">${target}</span>
                ${skillIcon ? `<img src="${skillIcon}" class="need-stat-icon" onerror="this.style.display='none'">` : '<span class="need-stat-icon"></span>'}
                <span class="need-stat-source">${sourceName}</span>
                <span class="need-stat-name">${displayName}</span>
                ${optionsHtml}
                <span class="need-stat-value">${value}%</span>
            </div>
        `;
    }

    /**
     * Calculate total critical rate from selected items
     */
    calculateTotal(buffItems, selfItems) {
        let total = 0;
        const allItems = [...buffItems, ...selfItems];
        allItems.forEach(item => {
            const itemId = item.id || `${item.source}_${item.skillName}`;
            if (this.selectedItems.has(itemId)) {
                total += item.value || 0;
            }
        });
        return total;
    }

    getLabels() {
        const lang = this.getCurrentLang();
        const t = (key, fallback) => {
            if (window.I18nService && typeof window.I18nService.t === 'function') {
                const result = window.I18nService.t(key);
                if (result && result !== key) return result;
            }
            return fallback;
        };

        return {
            labelNeedStat: t('needStat', lang === 'en' ? 'Need Stat' : (lang === 'jp' ? '必要ステ' : 'Need Stat')),
            labelAttrImprove: lang === 'en' ? 'Attribute Improvement' : (lang === 'jp' ? 'ステータス強化' : '속성 강화'),
            labelCritical: t('needStatCriticalRate', t('criticalRate', lang === 'en' ? 'Critical Rate' : (lang === 'jp' ? 'クリ率' : '크리티컬 확률'))),
            labelPierce: t('needStatPierceRate', lang === 'en' ? 'Pierce Rate' : (lang === 'jp' ? '貫通率' : '관통 확률')),
            labelBuff: t('needStatBuff', t('criticalBuff', lang === 'en' ? 'Buff' : (lang === 'jp' ? 'バフ' : '버프'))),
            labelSelf: t('needStatSelf', t('criticalSelf', lang === 'en' ? 'Self' : (lang === 'jp' ? '自分' : '자신'))),
            labelNoItems: t('needStatNoItems', t('criticalNoItems', lang === 'en' ? 'No applicable items' : (lang === 'jp' ? '該当なし' : '해당 없음'))),
            labelRevSum: t('revelationSum', lang === 'en' ? 'Card Sum' : (lang === 'jp' ? '啓示合計' : '계시 합계')),
            labelPending: t('pending', lang === 'en' ? 'Pending' : (lang === 'jp' ? '準備中' : '준비중')),
            labelCurrent: lang === 'en' ? 'current' : (lang === 'jp' ? '現在' : '현재'),
            labelNeeded: lang === 'en' ? 'needed' : (lang === 'jp' ? '必要' : '필요')
        };
    }

    ensureDefaultSelected(buffItems) {
        buffItems.forEach(item => {
            if (item.id === 'default' || item.id === 'myPalace') {
                this.selectedItems.add(item.id);
            }
        });
    }

    renderTrigger(charData, slotIndex, isOpen = false) {
        this.slotCharData = charData;
        this.isElucidator = (slotIndex === 3);
        const container = document.createElement('div');
        container.className = `need-stat-trigger ${isOpen ? 'open' : ''}`;
        container.dataset.slotIndex = slotIndex;

        const { labelNeedStat, labelAttrImprove, labelCritical, labelPierce } = this.getLabels();
        const triggerTitle = this.isElucidator ? labelAttrImprove : labelNeedStat;

        // For elucidator, show global bonuses; for others, calculate from items
        let critTotal = 0;
        let pierceTotal = 0;
        if (this.isElucidator) {
            critTotal = globalElucidatorCritical;
            pierceTotal = globalElucidatorPierce;
        } else {
            const buffItems = this.getApplicableBuffItems();
            const selfItems = this.getApplicableSelfItems(charData);
            this.autoSelectBySlotSettings(charData, [...buffItems, ...selfItems]);
            this.ensureDefaultSelected(buffItems);
            critTotal = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + globalElucidatorCritical;
            pierceTotal = this.revelationSumPierce + globalElucidatorPierce;
        }

        // Elucidator: editable inputs in trigger rows instead of accordion
        const isElucidatorEditable = this.isElucidator;

        container.innerHTML = `
            <div class="need-stat-trigger-header">
                <div class="need-stat-toggle">
                    ${!isElucidatorEditable ? `<svg class="need-stat-caret ${isOpen ? 'open' : ''}" width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>` : ''}
                    <span>${triggerTitle}</span>
                </div>
            </div>
            <div class="need-stat-trigger-rows">
                <div class="need-stat-trigger-row">
                    <span class="need-stat-trigger-label">${labelCritical}</span>
                    ${this.renderTotalPairHtml(slotIndex, critTotal, 'critical', isElucidatorEditable)}
                </div>
                <div class="need-stat-trigger-row">
                    <span class="need-stat-trigger-label">${labelPierce}</span>
                    ${this.renderTotalPairHtml(slotIndex, pierceTotal, 'pierce', isElucidatorEditable)}
                </div>
            </div>
        `;

        // Bind elucidator inline input events
        if (isElucidatorEditable) {
            this.bindElucidatorTriggerEvents(container, slotIndex);
        }

        return container;
    }

    /**
     * Bind events for elucidator inline inputs in trigger
     */
    bindElucidatorTriggerEvents(container, slotIndex) {
        container.querySelectorAll('.need-stat-elucidator-inline-input').forEach(input => {
            input.addEventListener('input', (e) => {
                e.stopPropagation();
                const statType = input.dataset.stat;
                const val = parseFloat(input.value) || 0;
                
                if (statType === 'critical') {
                    globalElucidatorCritical = val;
                } else if (statType === 'pierce') {
                    globalElucidatorPierce = val;
                }
                
                // Trigger update for all other slots
                this.notifyAllSlotsUpdate();
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        });
    }

    /**
     * Auto-select items based on slot settings (ritual level, weapon refinement)
     * Called when slot ritual/modification changes
     */
    autoSelectBySlotSettings(charData, allItems) {
        if (!charData) return;

        const ritual = parseInt(charData.ritual, 10) || 0;
        const modification = charData.modification;
        const modNum = (modification && modification !== '-') ? parseInt(modification, 10) : -1;

        allItems.forEach(item => {
            const itemId = item.id || `${item.source}_${item.skillName}`;
            const typeStr = String(item.type || '');

            // 1. 전용무기 타입: 개조 드롭다운 값에 따라 해당 옵션 자동 선택
            // Support for 개조5&6 style options (& grouped)
            if (typeStr === '전용무기' && item.options && item.options.length > 0 && modNum >= 0) {
                // Find option that matches: 개조N or 개조X&Y where modNum is in range
                const targetOption = item.options.find(opt => {
                    // Check for exact match like 개조6
                    if (opt === `개조${modNum}`) return true;
                    // Check for range match like 개조5&6
                    const rangeMatch = opt.match(/개조(\d+)&(\d+)/);
                    if (rangeMatch) {
                        const low = parseInt(rangeMatch[1], 10);
                        const high = parseInt(rangeMatch[2], 10);
                        if (modNum >= low && modNum <= high) return true;
                    }
                    // Check for single match within text like 개조0&1 → modNum 0 or 1
                    const singleMatch = opt.match(/개조(\d+)/);
                    if (singleMatch && !rangeMatch) {
                        // Also check if it's part of a range pattern
                        const nums = opt.match(/\d+/g);
                        if (nums && nums.length > 1) {
                            // Multiple numbers like 개조0&1
                            return nums.some(n => parseInt(n, 10) === modNum);
                        }
                        return parseInt(singleMatch[1], 10) === modNum;
                    }
                    return false;
                });
                if (targetOption) {
                    item._selectedOption = targetOption;
                    if (item.values && item.values[targetOption] !== undefined) {
                        item.value = item.values[targetOption];
                    }
                    this.selectedItems.add(itemId);
                }
            }

            // 2. 의식N 타입: 슬롯 의식 값이 해당 타입 이상이면 자동 체크
            // 의식0인 경우 의식1 이상은 선택되면 안 됨
            const ritualMatch = typeStr.match(/의식(\d+)/);
            if (ritualMatch) {
                const requiredRitual = parseInt(ritualMatch[1], 10);
                // Only auto-select if slot ritual level is >= required ritual level
                // AND required ritual is > 0 (의식0 is always available if character has it)
                if (requiredRitual === 0 || ritual >= requiredRitual) {
                    this.selectedItems.add(itemId);
                }
            }
        });
    }

    /**
     * Reset and re-apply auto-selection based on current slot settings
     */
    refreshAutoSelection(charData) {
        if (!charData) return;
        // Clear previous auto-selections for weapon/ritual types
        const buffItems = this.getApplicableBuffItems();
        const selfItems = this.getApplicableSelfItems(charData);
        const allItems = [...buffItems, ...selfItems];
        
        allItems.forEach(item => {
            const itemId = item.id || `${item.source}_${item.skillName}`;
            const typeStr = String(item.type || '');
            // Remove auto-selected items (weapon and ritual types)
            if (typeStr === '전용무기' || typeStr.match(/의식\d+/)) {
                this.selectedItems.delete(itemId);
                delete item._selectedOption;
            }
        });
        
        // Re-apply auto-selection
        this.autoSelectBySlotSettings(charData, allItems);
    }

    renderPanel(charData, slotIndex) {
        this.slotCharData = charData;
        this.isElucidator = (slotIndex === 3);
        const container = document.createElement('div');
        container.className = 'need-stat-card-accordion';
        container.dataset.slotIndex = slotIndex;

        const { labelCritical, labelPierce, labelBuff, labelSelf, labelNoItems, labelRevSum, labelPending } = this.getLabels();

        // Elucidator slot: show only custom inputs for critical/pierce that affect all other slots
        if (this.isElucidator) {
            container.innerHTML = `
                <div class="need-stat-columns">
                    <div class="need-stat-column need-stat-column-critical">
                        <div class="need-stat-column-header">
                            <span>${labelCritical}</span>
                            ${this.renderTotalPairHtml(slotIndex, globalElucidatorCritical, 'critical')}
                        </div>
                        <div class="need-stat-body open">
                            <div class="need-stat-elucidator-input-row">
                                <input type="number" class="need-stat-elucidator-input" data-stat="critical" value="${globalElucidatorCritical}" min="0" max="100" step="0.1">
                            </div>
                        </div>
                    </div>
                    <div class="need-stat-column need-stat-column-pierce">
                        <div class="need-stat-column-header">
                            <span>${labelPierce}</span>
                            ${this.renderTotalPairHtml(slotIndex, globalElucidatorPierce, 'pierce')}
                        </div>
                        <div class="need-stat-body open">
                            <div class="need-stat-elucidator-input-row">
                                <input type="number" class="need-stat-elucidator-input" data-stat="pierce" value="${globalElucidatorPierce}" min="0" max="100" step="0.1">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.bindElucidatorEvents(container, slotIndex);
            return container;
        }

        // Normal slot: show buff/self items with revelation sum per column
        const buffItems = this.getApplicableBuffItems();
        const selfItems = this.getApplicableSelfItems(charData);
        this.autoSelectBySlotSettings(charData, [...buffItems, ...selfItems]);
        this.ensureDefaultSelected(buffItems);

        const critTotal = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + globalElucidatorCritical;
        const pierceTotal = this.revelationSumPierce + globalElucidatorPierce;

        container.innerHTML = `
            <div class="need-stat-columns">
                <div class="need-stat-column need-stat-column-critical">
                    <div class="need-stat-column-header">
                        <span>${labelCritical}</span>
                        ${this.renderTotalPairHtml(slotIndex, critTotal, 'critical')}
                    </div>
                    <div class="need-stat-rev-sum-row">
                        <label class="need-stat-rev-sum-label"><img src="${this.baseUrl}/assets/img/nav/qishi.png" alt="" class="need-stat-rev-icon">${labelRevSum}</label>
                        <input type="number" class="need-stat-rev-sum-input" data-stat="critical" value="${this.revelationSumCritical}" min="0" max="100" step="0.1">
                    </div>
                    <div class="need-stat-body open">
                        <div class="need-stat-section">
                            <div class="need-stat-section-title">${labelBuff}</div>
                            ${buffItems.map(item => this.renderItemRow(item, false)).join('')}
                        </div>
                        <div class="need-stat-section">
                            <div class="need-stat-section-title">${labelSelf}</div>
                            ${selfItems.length > 0
                                ? selfItems.map(item => this.renderItemRow(item, true)).join('')
                                : `<div class="need-stat-empty">${labelNoItems}</div>`
                            }
                        </div>
                    </div>
                </div>
                <div class="need-stat-column need-stat-column-pierce">
                    <div class="need-stat-column-header">
                        <span>${labelPierce}</span>
                        ${this.renderTotalPairHtml(slotIndex, pierceTotal, 'pierce')}
                    </div>
                    <div class="need-stat-rev-sum-row">
                        <label class="need-stat-rev-sum-label"><img src="${this.baseUrl}/assets/img/nav/qishi.png" alt="" class="need-stat-rev-icon">${labelRevSum}</label>
                        <input type="number" class="need-stat-rev-sum-input" data-stat="pierce" value="${this.revelationSumPierce}" min="0" max="100" step="0.1">
                    </div>
                    <div class="need-stat-body open">
                        <div class="need-stat-pending">${labelPending}</div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents(container, buffItems, selfItems, slotIndex);
        return container;
    }

    /**
     * Bind events for elucidator slot (custom inputs that affect all slots)
     */
    bindElucidatorEvents(container, slotIndex) {
        container.querySelectorAll('.need-stat-elucidator-input').forEach(input => {
            input.addEventListener('input', (e) => {
                e.stopPropagation();
                const statType = input.dataset.stat;
                const val = parseFloat(input.value) || 0;
                
                if (statType === 'critical') {
                    globalElucidatorCritical = val;
                } else if (statType === 'pierce') {
                    globalElucidatorPierce = val;
                }
                
                // Update this slot's display
                this.updateTotalPairDisplays(slotIndex, val, statType);
                
                // Trigger update for all other slots
                this.notifyAllSlotsUpdate();
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        });
    }

    /**
     * Notify all slots to update their totals (called when elucidator values change)
     */
    notifyAllSlotsUpdate() {
        // Dispatch custom event that PartyUI can listen to
        window.dispatchEvent(new CustomEvent('elucidator-bonus-changed', {
            detail: { critical: globalElucidatorCritical, pierce: globalElucidatorPierce }
        }));
    }

    /**
     * Bind critical card events
     */
    bindEvents(container, buffItems, selfItems, slotIndex) {
        // Revelation Sum inputs (one per column)
        container.querySelectorAll('.need-stat-rev-sum-input').forEach(revSumInput => {
            revSumInput.addEventListener('input', (e) => {
                e.stopPropagation();
                const statType = revSumInput.dataset.stat;
                const val = parseFloat(revSumInput.value) || 0;
                
                if (statType === 'critical') {
                    this.revelationSumCritical = val;
                    const total = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + globalElucidatorCritical;
                    this.updateTotalPairDisplays(slotIndex, total, 'critical');
                } else if (statType === 'pierce') {
                    this.revelationSumPierce = val;
                    const total = this.revelationSumPierce + globalElucidatorPierce;
                    this.updateTotalPairDisplays(slotIndex, total, 'pierce');
                }
            });
            revSumInput.addEventListener('click', (e) => e.stopPropagation());
        });

        // Item checkbox click
        container.querySelectorAll('.need-stat-row').forEach(row => {
            const checkEl = row.querySelector('.need-stat-check');
            if (!checkEl) return;

            checkEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = row.dataset.itemId;
                if (!itemId) return;

                if (this.selectedItems.has(itemId)) {
                    this.selectedItems.delete(itemId);
                    row.classList.remove('checked');
                    checkEl.src = `${this.baseUrl}/assets/img/ui/check-off.png`;
                } else {
                    this.selectedItems.add(itemId);
                    row.classList.add('checked');
                    checkEl.src = `${this.baseUrl}/assets/img/ui/check-on.png`;
                }

                const total = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + globalElucidatorCritical;
                this.updateTotalPairDisplays(slotIndex, total, 'critical');
            });
        });

        // Option select change
        container.querySelectorAll('.need-stat-select').forEach(select => {
            select.addEventListener('click', (e) => e.stopPropagation());
            select.addEventListener('change', (e) => {
                e.stopPropagation();
                const itemId = select.dataset.itemId;
                const selectedOption = select.value;
                const row = select.closest('.need-stat-row');
                const valueEl = row ? row.querySelector('.need-stat-value') : null;

                const allItems = [...buffItems, ...selfItems];
                const item = allItems.find(i => (i.id || `${i.source}_${i.skillName}`) === itemId);

                if (item && item.values && item.values[selectedOption] !== undefined) {
                    item.value = item.values[selectedOption];
                    item._selectedOption = selectedOption;
                    if (valueEl) valueEl.textContent = `${item.value}%`;

                    const total = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + globalElucidatorCritical;
                    this.updateTotalPairDisplays(slotIndex, total, 'critical');
                }
            });
        });
    }
}
