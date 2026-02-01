/**
 * Tactic Maker V2 - Critical Card UI Module
 * Renders a collapsible critical rate checklist below each party slot.
 */

import { DataLoader } from './data-loader.js';

export class NeedStatCardUI {
    constructor(store, baseUrl) {
        this.store = store;
        this.baseUrl = baseUrl || window.BASE_URL || '';
        this.selectedItems = new Set();
    }

    formatTotalPair(total) {
        const current = Number.isFinite(total) ? total : 0;
        const needed = Math.max(0, 100 - current);
        return {
            currentText: `${current.toFixed(1)}%`,
            neededText: `${needed.toFixed(1)}%`
        };
    }

    renderTotalPairHtml(slotIndex, total) {
        const { currentText, neededText } = this.formatTotalPair(total);
        return `
            <span class="need-stat-total" data-slot-index="${slotIndex}">
                <span class="need-stat-current">${currentText}</span>
                <span class="need-stat-sep">/</span>
                <span class="need-stat-needed">${neededText}</span>
            </span>
        `;
    }

    updateTotalPairDisplays(slotIndex, total) {
        const { currentText, neededText } = this.formatTotalPair(total);
        document
            .querySelectorAll(`.need-stat-total[data-slot-index="${slotIndex}"]`)
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

        // 2. Wonder persona skills: 리벨리온, 레볼루션
        const personaNames = personas.map(p => p?.name || '').filter(Boolean);
        if (buffData['원더']) {
            buffData['원더'].forEach(item => {
                const skillName = item.skillName || '';
                if (skillName === '리벨리온' || skillName === '레볼루션') {
                    items.push({ ...item, source: '원더' });
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
        // Character name - use DataLoader for translation
        return DataLoader.getCharacterDisplayName(source) || source;
    }

    /**
     * Render a critical item row (simplified)
     */
    renderItemRow(item, isSelf = false) {
        const lang = this.getCurrentLang();
        const itemId = item.id || `${item.source}_${item.skillName}`;

        let skillName = item.skillName || '';
        if (lang === 'en' && item.skillName_en) skillName = item.skillName_en;
        if (lang === 'jp' && item.skillName_jp) skillName = item.skillName_jp;

        let typeName = item.type || '';
        if (lang === 'en' && item.type_en) typeName = item.type_en;
        if (lang === 'jp' && item.type_jp) typeName = item.type_jp;

        const value = item.value || 0;
        const skillIcon = item.skillIcon ? `${this.baseUrl}${item.skillIcon}` : '';
        const isChecked = this.selectedItems.has(itemId);
        const sourceName = this.getSourceDisplayName(item.source);

        // Options dropdown if item has options
        let optionsHtml = '';
        if (item.options && item.options.length > 0) {
            optionsHtml = `
                <select class="need-stat-select" data-item-id="${itemId}">
                    ${item.options.map(opt => {
                        const selected = (item.defaultOption === opt) ? 'selected' : '';
                        return `<option value="${opt}" ${selected}>${opt}</option>`;
                    }).join('')}
                </select>
            `;
        }

        // Display: [check] [icon] [source] typeName skillName [options] value%
        return `
            <div class="need-stat-row ${isChecked ? 'checked' : ''}" data-item-id="${itemId}">
                <img src="${this.baseUrl}/assets/img/ui/check-${isChecked ? 'on' : 'off'}.png" class="need-stat-check">
                ${skillIcon ? `<img src="${skillIcon}" class="need-stat-icon" onerror="this.style.display='none'">` : '<span class="need-stat-icon"></span>'}
                <span class="need-stat-source">${sourceName}</span>
                <span class="need-stat-name">${typeName}${skillName ? ' ' + skillName : ''}</span>
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
            labelCritical: t('needStatCriticalRate', t('criticalRate', lang === 'en' ? 'Critical Rate' : (lang === 'jp' ? 'クリ率' : '크리티컬 확률'))),
            labelBuff: t('needStatBuff', t('criticalBuff', lang === 'en' ? 'Buff' : (lang === 'jp' ? 'バフ' : '버프'))),
            labelSelf: t('needStatSelf', t('criticalSelf', lang === 'en' ? 'Self' : (lang === 'jp' ? '自分' : '자신'))),
            labelNoItems: t('needStatNoItems', t('criticalNoItems', lang === 'en' ? 'No applicable items' : (lang === 'jp' ? '該当なし' : '해당 없음')))
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
        const container = document.createElement('div');
        container.className = `need-stat-trigger ${isOpen ? 'open' : ''}`;
        container.dataset.slotIndex = slotIndex;

        const { labelCritical } = this.getLabels();
        const buffItems = this.getApplicableBuffItems();
        const selfItems = this.getApplicableSelfItems(charData);
        this.ensureDefaultSelected(buffItems);
        const total = this.calculateTotal(buffItems, selfItems);

        container.innerHTML = `
            <div class="need-stat-trigger-header">
                <div class="need-stat-toggle">
                    <svg class="need-stat-caret ${isOpen ? 'open' : ''}" width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>${labelCritical}</span>
                </div>
                ${this.renderTotalPairHtml(slotIndex, total)}
            </div>
        `;

        return container;
    }

    renderPanel(charData, slotIndex) {
        const container = document.createElement('div');
        container.className = 'need-stat-card-accordion';
        container.dataset.slotIndex = slotIndex;

        const { labelCritical, labelBuff, labelSelf, labelNoItems } = this.getLabels();

        const buffItems = this.getApplicableBuffItems();
        const selfItems = this.getApplicableSelfItems(charData);
        this.ensureDefaultSelected(buffItems);

        const total = this.calculateTotal(buffItems, selfItems);

        container.innerHTML = `
            <div class="need-stat-header">
                <div class="need-stat-toggle">
                    <span>${labelCritical}</span>
                </div>
                ${this.renderTotalPairHtml(slotIndex, total)}
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
        `;

        this.bindEvents(container, buffItems, selfItems, slotIndex);
        return container;
    }

    /**
     * Bind critical card events
     */
    bindEvents(container, buffItems, selfItems, slotIndex) {
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

                const total = this.calculateTotal(buffItems, selfItems);
                this.updateTotalPairDisplays(slotIndex, total);
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
                    if (valueEl) valueEl.textContent = `${item.value}%`;

                    const total = this.calculateTotal(buffItems, selfItems);
                    this.updateTotalPairDisplays(slotIndex, total);
                }
            });
        });
    }
}
