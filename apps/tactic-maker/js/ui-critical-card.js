/**
 * Tactic Maker V2 - Critical Card UI Module
 * Renders a collapsible critical rate checklist below each party slot.
 */

import { DataLoader } from './data-loader.js';

export class CriticalCardUI {
    constructor(store, baseUrl) {
        this.store = store;
        this.baseUrl = baseUrl || window.BASE_URL || '';
        this.selectedItems = new Set();
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
                <select class="crit-select" data-item-id="${itemId}">
                    ${item.options.map(opt => {
                        const selected = (item.defaultOption === opt) ? 'selected' : '';
                        return `<option value="${opt}" ${selected}>${opt}</option>`;
                    }).join('')}
                </select>
            `;
        }

        // Display: [check] [icon] [source] typeName skillName [options] value%
        return `
            <div class="crit-row ${isChecked ? 'checked' : ''}" data-item-id="${itemId}">
                <img src="${this.baseUrl}/assets/img/ui/check-${isChecked ? 'on' : 'off'}.png" class="crit-check">
                ${skillIcon ? `<img src="${skillIcon}" class="crit-icon" onerror="this.style.display='none'">` : '<span class="crit-icon"></span>'}
                <span class="crit-source">${sourceName}</span>
                <span class="crit-name">${typeName}${skillName ? ' ' + skillName : ''}</span>
                ${optionsHtml}
                <span class="crit-value">${value}%</span>
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

    /**
     * Render the critical card accordion
     */
    render(charData, slotIndex) {
        const lang = this.getCurrentLang();
        const container = document.createElement('div');
        container.className = 'critical-card-accordion';
        container.dataset.slotIndex = slotIndex;

        const buffItems = this.getApplicableBuffItems();
        const selfItems = this.getApplicableSelfItems(charData);

        // Auto-select default items
        buffItems.forEach(item => {
            if (item.id === 'default' || item.id === 'myPalace') {
                this.selectedItems.add(item.id);
            }
        });

        const total = this.calculateTotal(buffItems, selfItems);

        // Labels
        const t = (key, fallback) => {
            if (window.I18nService && typeof window.I18nService.t === 'function') {
                const result = window.I18nService.t(key);
                if (result && result !== key) return result;
            }
            return fallback;
        };

        const labelCritical = t('criticalRate', lang === 'en' ? 'Critical Rate' : (lang === 'jp' ? 'クリ率' : '크리티컬 확률'));
        const labelBuff = t('criticalBuff', lang === 'en' ? 'Buff' : (lang === 'jp' ? 'バフ' : '버프'));
        const labelSelf = t('criticalSelf', lang === 'en' ? 'Self' : (lang === 'jp' ? '自分' : '자신'));
        const labelNoItems = t('criticalNoItems', lang === 'en' ? 'No applicable items' : (lang === 'jp' ? '該当なし' : '해당 없음'));

        container.innerHTML = `
            <div class="crit-header">
                <div class="crit-toggle">
                    <svg class="crit-caret" width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>${labelCritical}</span>
                </div>
                <span class="crit-total">${total.toFixed(1)}%</span>
            </div>
            <div class="crit-body">
                <div class="crit-section">
                    <div class="crit-section-title">${labelBuff}</div>
                    ${buffItems.map(item => this.renderItemRow(item, false)).join('')}
                </div>
                <div class="crit-section">
                    <div class="crit-section-title">${labelSelf}</div>
                    ${selfItems.length > 0
                        ? selfItems.map(item => this.renderItemRow(item, true)).join('')
                        : `<div class="crit-empty">${labelNoItems}</div>`
                    }
                </div>
            </div>
        `;

        this.bindEvents(container, buffItems, selfItems);
        return container;
    }

    /**
     * Bind critical card events
     */
    bindEvents(container, buffItems, selfItems) {
        const header = container.querySelector('.crit-header');
        const body = container.querySelector('.crit-body');
        const caret = container.querySelector('.crit-caret');
        const totalEl = container.querySelector('.crit-total');

        // Accordion toggle
        if (header) {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = body.classList.contains('open');
                body.classList.toggle('open', !isOpen);
                caret.classList.toggle('open', !isOpen);
            });
        }

        // Item checkbox click
        container.querySelectorAll('.crit-row').forEach(row => {
            const checkEl = row.querySelector('.crit-check');
            if (checkEl) {
                checkEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const itemId = row.dataset.itemId;

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
                    if (totalEl) totalEl.textContent = `${total.toFixed(1)}%`;
                });
            }
        });

        // Option select change
        container.querySelectorAll('.crit-select').forEach(select => {
            select.addEventListener('click', (e) => e.stopPropagation());
            select.addEventListener('change', (e) => {
                e.stopPropagation();
                const itemId = select.dataset.itemId;
                const selectedOption = select.value;
                const row = select.closest('.crit-row');
                const valueEl = row.querySelector('.crit-value');

                const allItems = [...buffItems, ...selfItems];
                const item = allItems.find(i => (i.id || `${i.source}_${i.skillName}`) === itemId);

                if (item && item.values && item.values[selectedOption] !== undefined) {
                    item.value = item.values[selectedOption];
                    if (valueEl) valueEl.textContent = `${item.value}%`;

                    if (this.selectedItems.has(itemId)) {
                        const total = this.calculateTotal(buffItems, selfItems);
                        if (totalEl) totalEl.textContent = `${total.toFixed(1)}%`;
                    }
                }
            });
        });
    }
}
