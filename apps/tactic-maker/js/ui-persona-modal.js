import { EventEmitter } from './event-emitter.js';
import { DataLoader } from './data-loader.js';

/**
 * Tactic Maker - Persona Modal (apps/persona style)
 * A full-featured persona selection modal that mirrors the persona-list-panel from apps/persona
 */
export class PersonaModal extends EventEmitter {
    constructor(store) {
        super();
        this.store = store;
        this.modal = null;
        this.onSelect = null;
        this.baseUrl = window.SITE_BASEURL || window.BASE_URL || '';

        // Filter state
        this.filterCache = {
            elements: new Set(),
            positions: new Set(),
            rarities: new Set(),
            grades: new Set()
        };

        // Sort state
        this.sortMode = 'tier';
        this.searchQuery = '';

        // Persona data
        this.personaSource = {};
        this.sortedPersonas = [];

        this.createModal();
    }

    createModal() {
        // Remove existing modal if any
        const existing = document.getElementById('personaSelectModal');
        if (existing) existing.remove();

        this.modal = document.createElement('div');
        this.modal.id = 'personaSelectModal';
        this.modal.className = 'persona-select-modal hidden';

        this.modal.innerHTML = `
            <div class="persona-modal-backdrop"></div>
            <div class="persona-modal-dialog">
                <div class="persona-modal-header">
                    <h3>페르소나 선택</h3>
                    <button class="persona-modal-close">&times;</button>
                </div>
                <div class="persona-modal-body">
                    <!-- Search & Filter Header (like persona-list-panel) -->
                    <div class="persona-filter-header">
                        <div class="persona-search-sort-container">
                            <div class="persona-search-container">
                                <div class="persona-search-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="rgba(255, 255, 255, 0.6)"/>
                                    </svg>
                                </div>
                                <input type="text" class="persona-search-input" placeholder="검색..." autocomplete="off">
                                <button class="persona-search-clear" style="display: none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="m15 9-6 6"/>
                                        <path d="m9 9 6 6"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="persona-sort-container">
                                <select class="persona-sort-select">
                                    <option value="tier">티어 순</option>
                                    <option value="rarity">희귀도 순</option>
                                    <option value="name">이름 순</option>
                                </select>
                            </div>
                        </div>
                        <div class="persona-filter-row">
                            <div class="persona-filter-count">
                                <span class="persona-filtered-count">전체 0개</span>
                            </div>
                            <button class="persona-filter-open-btn">
                                <span>필터</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="persona-active-filters"></div>
                    </div>

                    <!-- Persona Grid -->
                    <div class="persona-cards-container">
                        <!-- None option -->
                        <div class="persona-card-item persona-none-option" data-persona="">
                            <div class="persona-card-section">
                                <div class="card none-card">
                                    <span>None</span>
                                </div>
                                <div class="persona-name">선택 해제</div>
                            </div>
                        </div>
                        <!-- Cards will be rendered here -->
                    </div>
                </div>
            </div>

            <!-- Filter Modal -->
            <div class="persona-filter-modal hidden">
                <div class="persona-filter-backdrop"></div>
                <div class="persona-filter-dialog">
                    <div class="persona-filter-header-inner">
                        <h3>필터</h3>
                        <button class="persona-filter-close">&times;</button>
                    </div>
                    <div class="persona-filter-body">
                        <!-- Element Filter -->
                        <div class="persona-filter-group">
                            <h4>속성</h4>
                            <div class="persona-filter-options" data-filter="element">
                                ${this.createElementFilterOptions()}
                            </div>
                        </div>
                        <!-- Position Filter -->
                        <div class="persona-filter-group">
                            <h4>직업</h4>
                            <div class="persona-filter-options" data-filter="position">
                                ${this.createPositionFilterOptions()}
                            </div>
                        </div>
                        <!-- Rarity Filter -->
                        <div class="persona-filter-group">
                            <h4>희귀도</h4>
                            <div class="persona-filter-options" data-filter="rarity">
                                ${this.createRarityFilterOptions()}
                            </div>
                        </div>
                        <!-- Grade Filter -->
                        <div class="persona-filter-group">
                            <h4>등급</h4>
                            <div class="persona-filter-options" data-filter="grade">
                                ${this.createGradeFilterOptions()}
                            </div>
                        </div>
                    </div>
                    <div class="persona-filter-footer">
                        <button class="persona-filter-reset">초기화</button>
                        <button class="persona-filter-apply">적용</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        this.bindEvents();
        this.injectStyles();
    }

    createElementFilterOptions() {
        const elements = ['물리', '총격', '화염', '빙결', '전격', '질풍', '염동', '핵열', '축복', '주원', '만능'];
        return elements.map(el => `
            <label class="persona-filter-label">
                <input type="checkbox" name="element" value="${el}">
                <img src="${this.baseUrl}/assets/img/persona/속성_${el}.png" alt="${el}" onerror="this.style.display='none'">
            </label>
        `).join('');
    }

    createPositionFilterOptions() {
        const positions = ['지배', '반항', '우월', '굴복', '방위', '구원'];
        return positions.map(pos => `
            <label class="persona-filter-label">
                <input type="checkbox" name="position" value="${pos}">
                <img src="${this.baseUrl}/assets/img/persona/직업_${pos}.png" alt="${pos}" onerror="this.style.display='none'">
            </label>
        `).join('');
    }

    createRarityFilterOptions() {
        return [5, 4, 3, 2, 1].map(rarity => `
            <label class="persona-filter-label rarity-label">
                <input type="checkbox" name="rarity" value="${rarity}">
                <div class="star-container">
                    ${Array(rarity).fill(`<img src="${this.baseUrl}/assets/img/persona/star${rarity >= 5 ? '5' : '4'}.webp" alt="★">`).join('')}
                </div>
            </label>
        `).join('');
    }

    createGradeFilterOptions() {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9].map(grade => `
            <label class="persona-filter-label">
                <input type="checkbox" name="grade" value="${grade}">
                <img src="${this.baseUrl}/assets/img/persona/persona-grade${grade}.webp" alt="Grade ${grade}" onerror="this.style.display='none'">
            </label>
        `).join('');
    }

    bindEvents() {
        // Close modal
        this.modal.querySelector('.persona-modal-backdrop').addEventListener('click', () => this.close());
        this.modal.querySelector('.persona-modal-close').addEventListener('click', () => this.close());

        // Search
        const searchInput = this.modal.querySelector('.persona-search-input');
        const searchClear = this.modal.querySelector('.persona-search-clear');

        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            searchClear.style.display = this.searchQuery ? 'flex' : 'none';
            this.applyFiltersAndRender();
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            searchClear.style.display = 'none';
            this.applyFiltersAndRender();
        });

        // Sort
        this.modal.querySelector('.persona-sort-select').addEventListener('change', (e) => {
            this.sortMode = e.target.value;
            this.sortPersonas();
            this.renderCards();
        });

        // Filter modal open/close
        this.modal.querySelector('.persona-filter-open-btn').addEventListener('click', () => {
            this.openFilterModal();
        });

        this.modal.querySelector('.persona-filter-backdrop').addEventListener('click', () => {
            this.closeFilterModal();
        });

        this.modal.querySelector('.persona-filter-close').addEventListener('click', () => {
            this.closeFilterModal();
        });

        this.modal.querySelector('.persona-filter-reset').addEventListener('click', () => {
            this.resetFilters();
        });

        this.modal.querySelector('.persona-filter-apply').addEventListener('click', () => {
            this.applyFiltersFromModal();
            this.closeFilterModal();
        });

        // Card clicks (event delegation)
        this.modal.querySelector('.persona-cards-container').addEventListener('click', (e) => {
            const cardItem = e.target.closest('.persona-card-item');
            if (cardItem) {
                const personaKey = cardItem.dataset.persona;
                if (this.onSelect) {
                    this.onSelect(personaKey);
                }
                this.close();
            }
        });
    }

    open(callback) {
        this.onSelect = callback;
        this.loadPersonaData();
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Reset search
        const searchInput = this.modal.querySelector('.persona-search-input');
        searchInput.value = '';
        this.searchQuery = '';
        this.modal.querySelector('.persona-search-clear').style.display = 'none';

        // Reset filters
        this.filterCache = {
            elements: new Set(),
            positions: new Set(),
            rarities: new Set(),
            grades: new Set()
        };
        this.renderActiveTags();

        this.applyFiltersAndRender();
    }

    close() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
        this.onSelect = null;
    }

    loadPersonaData() {
        this.personaSource = DataLoader.getPersonaList();
        this.sortPersonas();
    }

    sortPersonas() {
        const allIds = Object.keys(this.personaSource);

        if (this.sortMode === 'tier') {
            const strictOrderList = window.personaOrder || [];
            const processed = new Set();
            const orderedS = [];
            const orderedA = [];
            const orderedB = [];
            const nonOrdered = [];

            strictOrderList.forEach(name => {
                if (this.personaSource[name]) {
                    const tier = this.personaSource[name].tier;
                    if (tier === 'S') {
                        orderedS.push(name);
                        processed.add(name);
                    } else if (tier === 'A') {
                        orderedA.push(name);
                        processed.add(name);
                    } else if (tier === 'B') {
                        orderedB.push(name);
                        processed.add(name);
                    }
                }
            });

            allIds.forEach(name => {
                if (!processed.has(name)) {
                    nonOrdered.push(name);
                }
            });

            nonOrdered.sort((a, b) => {
                const starA = parseInt(this.personaSource[a].star || 0, 10);
                const starB = parseInt(this.personaSource[b].star || 0, 10);
                if (starA !== starB) return starB - starA;
                return a.localeCompare(b);
            });

            this.sortedPersonas = [...orderedS, ...orderedA, ...orderedB, ...nonOrdered];

        } else if (this.sortMode === 'rarity') {
            this.sortedPersonas = [...allIds].sort((a, b) => {
                const starA = parseInt(this.personaSource[a].star || 0, 10);
                const starB = parseInt(this.personaSource[b].star || 0, 10);
                if (starA !== starB) return starB - starA;
                return a.localeCompare(b);
            });

        } else if (this.sortMode === 'name') {
            const currentLang = window.LanguageRouter?.getCurrentLanguage?.() || 'kr';
            this.sortedPersonas = [...allIds].sort((a, b) => {
                let nameA = a;
                let nameB = b;
                if (currentLang === 'en') {
                    nameA = this.personaSource[a].name_en || a;
                    nameB = this.personaSource[b].name_en || b;
                } else if (currentLang === 'jp') {
                    nameA = this.personaSource[a].name_jp || a;
                    nameB = this.personaSource[b].name_jp || b;
                }
                return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
            });
        }
    }

    applyFiltersAndRender() {
        this.renderCards();
    }

    renderCards() {
        const container = this.modal.querySelector('.persona-cards-container');

        // Keep none option, remove others
        const noneOption = container.querySelector('.persona-none-option');
        container.innerHTML = '';
        if (noneOption) container.appendChild(noneOption);

        const currentLang = window.LanguageRouter?.getCurrentLanguage?.() || 'kr';
        let visibleCount = 0;

        const filtered = this.sortedPersonas.filter(personaName => {
            const persona = this.personaSource[personaName];
            if (!persona) return false;

            // Search filter
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                let displayName = personaName;
                if (currentLang === 'en') displayName = persona.name_en || personaName;
                else if (currentLang === 'jp') displayName = persona.name_jp || personaName;

                if (!displayName.toLowerCase().includes(query) && !personaName.toLowerCase().includes(query)) {
                    return false;
                }
            }

            // Element filter
            if (this.filterCache.elements.size > 0 && !this.filterCache.elements.has(persona.element)) {
                return false;
            }

            // Position filter
            if (this.filterCache.positions.size > 0 && !this.filterCache.positions.has(persona.position)) {
                return false;
            }

            // Rarity filter
            if (this.filterCache.rarities.size > 0 && !this.filterCache.rarities.has(parseInt(persona.star))) {
                return false;
            }

            // Grade filter
            if (this.filterCache.grades.size > 0 && !this.filterCache.grades.has(String(persona.grade))) {
                return false;
            }

            return true;
        });

        visibleCount = filtered.length;

        // Render filtered cards
        const fragment = document.createDocumentFragment();

        filtered.forEach(personaName => {
            const persona = this.personaSource[personaName];
            const element = persona.element || 'phys';

            let displayName = personaName;
            if (currentLang === 'en') displayName = persona.name_en || personaName;
            else if (currentLang === 'jp') displayName = persona.name_jp || personaName;

            const bgImg = `${this.baseUrl}/assets/img/persona/persona-card-${element}.webp`;
            const pImg = `${this.baseUrl}/assets/img/persona/${personaName}.webp`;
            const elIcon = `${this.baseUrl}/assets/img/persona/속성_${element}.png`;
            const posIcon = `${this.baseUrl}/assets/img/persona/직업_${persona.position}.png`;
            const coverStar = `${this.baseUrl}/assets/img/persona/persona-cover-star${persona.star}.webp`;

            const cardItem = document.createElement('div');
            cardItem.className = 'persona-card-item';
            cardItem.dataset.persona = personaName;

            // Build tier label
            let tierHtml = '';
            if (persona.tier) {
                tierHtml = `<div class="tier-label tier-${persona.tier.toLowerCase()}">${persona.tier}</div>`;
            }

            // Build wild emblem
            let wildEmblemHtml = '';
            if (persona.wild_emblem_rainbow) {
                wildEmblemHtml = `<img src="${this.baseUrl}/assets/img/persona/wild-emblem-rainbow.png" alt="wild emblem" class="wild-emblem" loading="lazy">`;
            }

            cardItem.innerHTML = `
                <div class="persona-card-section">
                    <div class="card" data-element="${element}" data-position="${persona.position}" data-rarity="${persona.star}">
                        <img src="${bgImg}" class="card-background" loading="lazy" onerror="this.style.display='none'">
                        <div class="image-container">
                            <img src="${pImg}" class="persona-img" loading="lazy" onerror="this.style.display='none'">
                        </div>
                        <img src="${coverStar}" class="cover-star" loading="lazy" onerror="this.style.display='none'">
                        <div class="position-container">
                            <img src="${posIcon}" alt="${persona.position}" class="position-icon" loading="lazy" onerror="this.style.display='none'">
                        </div>
                        <img src="${elIcon}" alt="${element}" class="element-icon" loading="lazy" onerror="this.style.display='none'">
                        ${wildEmblemHtml}
                        ${tierHtml}
                    </div>
                    <div class="persona-name">${displayName}</div>
                </div>
            `;

            fragment.appendChild(cardItem);
        });

        container.appendChild(fragment);

        // Update count
        const countText = window.t?.('filteredCount', '전체') || '전체';
        const countUnit = window.t?.('countUnit', '개') || '개';
        this.modal.querySelector('.persona-filtered-count').textContent = `${countText} ${visibleCount}${countUnit}`;
    }

    openFilterModal() {
        const filterModal = this.modal.querySelector('.persona-filter-modal');

        // Sync checkboxes with current filter state
        const checkboxes = filterModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            const val = cb.value;
            const name = cb.name;
            if (name === 'element') cb.checked = this.filterCache.elements.has(val);
            else if (name === 'position') cb.checked = this.filterCache.positions.has(val);
            else if (name === 'rarity') cb.checked = this.filterCache.rarities.has(parseInt(val));
            else if (name === 'grade') cb.checked = this.filterCache.grades.has(val);
        });

        filterModal.classList.remove('hidden');
    }

    closeFilterModal() {
        this.modal.querySelector('.persona-filter-modal').classList.add('hidden');
    }

    resetFilters() {
        const checkboxes = this.modal.querySelectorAll('.persona-filter-modal input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
    }

    applyFiltersFromModal() {
        const filterModal = this.modal.querySelector('.persona-filter-modal');

        this.filterCache.elements = new Set(
            Array.from(filterModal.querySelectorAll('input[name="element"]:checked')).map(cb => cb.value)
        );
        this.filterCache.positions = new Set(
            Array.from(filterModal.querySelectorAll('input[name="position"]:checked')).map(cb => cb.value)
        );
        this.filterCache.rarities = new Set(
            Array.from(filterModal.querySelectorAll('input[name="rarity"]:checked')).map(cb => parseInt(cb.value))
        );
        this.filterCache.grades = new Set(
            Array.from(filterModal.querySelectorAll('input[name="grade"]:checked')).map(cb => cb.value)
        );

        this.renderActiveTags();
        this.applyFiltersAndRender();
    }

    renderActiveTags() {
        const container = this.modal.querySelector('.persona-active-filters');
        container.innerHTML = '';

        const createTag = (text, type, value, iconSrc) => {
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            let iconHtml = iconSrc ? `<img src="${iconSrc}" alt="" onerror="this.style.display='none'">` : '';
            const textHtml = text ? `<span>${text}</span>` : '';
            tag.innerHTML = `${iconHtml}${textHtml}<button class="filter-tag-close" aria-label="Remove">&times;</button>`;

            tag.querySelector('.filter-tag-close').addEventListener('click', (e) => {
                e.stopPropagation();
                if (type === 'element') this.filterCache.elements.delete(value);
                else if (type === 'position') this.filterCache.positions.delete(value);
                else if (type === 'rarity') this.filterCache.rarities.delete(parseInt(value));
                else if (type === 'grade') this.filterCache.grades.delete(value);
                this.renderActiveTags();
                this.applyFiltersAndRender();
            });

            return tag;
        };

        this.filterCache.elements.forEach(val => {
            container.appendChild(createTag(val, 'element', val, `${this.baseUrl}/assets/img/persona/속성_${val}.png`));
        });
        this.filterCache.positions.forEach(val => {
            container.appendChild(createTag(val, 'position', val, `${this.baseUrl}/assets/img/persona/직업_${val}.png`));
        });
        this.filterCache.rarities.forEach(val => {
            container.appendChild(createTag(`★${val}`, 'rarity', val, `${this.baseUrl}/assets/img/persona/star${val >= 5 ? 5 : 4}.webp`));
        });
        this.filterCache.grades.forEach(val => {
            container.appendChild(createTag('', 'grade', val, `${this.baseUrl}/assets/img/persona/persona-grade${val}.webp`));
        });
    }

    injectStyles() {
        if (document.getElementById('persona-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'persona-modal-styles';
        style.textContent = `
            /* ==========================================================================
               Persona Select Modal - apps/persona style
               ========================================================================== */
            .persona-select-modal {
                position: fixed;
                inset: 0;
                z-index: 10000;
            }

            .persona-select-modal.hidden {
                display: none;
            }

            .persona-modal-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
            }

            .persona-modal-dialog {
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: min(900px, 95vw);
                max-height: 90vh;
                background: #1a1a1a;
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            }

            .persona-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: #252525;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .persona-modal-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #fff;
            }

            .persona-modal-close {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                font-size: 24px;
                cursor: pointer;
                line-height: 1;
                padding: 0;
            }

            .persona-modal-close:hover {
                color: #fff;
            }

            .persona-modal-body {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            /* Filter Header (like persona-list-panel) */
            .persona-filter-header {
                padding: 16px 20px;
                background: #222;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .persona-search-sort-container {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .persona-search-container {
                flex: 1;
                position: relative;
                display: flex;
                align-items: center;
            }

            .persona-search-icon {
                position: absolute;
                left: 8px;
                pointer-events: none;
                display: flex;
                align-items: center;
            }

            .persona-search-input {
                width: 100%;
                padding: 10px 32px 10px 32px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                color: #fff;
                font-size: 14px;
            }

            .persona-search-input:focus {
                outline: none;
                border-color: rgba(255, 255, 255, 0.3);
            }

            .persona-search-clear {
                position: absolute;
                right: 8px;
                background: none;
                border: none;
                cursor: pointer;
                color: #999;
                padding: 0;
                display: flex;
                align-items: center;
            }

            .persona-search-clear:hover {
                color: #fff;
            }

            .persona-sort-container {
                flex-shrink: 0;
            }

            .persona-sort-select {
                background: #333;
                color: #aaa;
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
            }

            .persona-sort-select:focus {
                outline: none;
            }

            .persona-filter-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 12px;
            }

            .persona-filter-count {
                font-size: 12px;
                color: #aaa;
            }

            .persona-filter-open-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.6);
                padding: 4px 8px;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 11px;
            }

            .persona-filter-open-btn:hover {
                color: #fff;
            }

            .persona-active-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 12px;
            }

            .persona-active-filters:empty {
                display: none;
            }

            .persona-active-filters .filter-tag {
                display: flex;
                align-items: center;
                gap: 6px;
                background: rgba(255, 255, 255, 0.15);
                padding: 3px 8px 3px 6px;
                border-radius: 4px;
                font-size: 11px;
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .persona-active-filters .filter-tag img {
                width: 14px;
                height: 14px;
                object-fit: contain;
            }

            .persona-active-filters .filter-tag-close {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                cursor: pointer;
                font-size: 14px;
                padding: 0 2px;
                line-height: 1;
            }

            .persona-active-filters .filter-tag-close:hover {
                color: #fff;
            }

            /* Persona Cards Grid */
            .persona-cards-container {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
                gap: 16px;
                align-content: start;
            }

            .persona-cards-container::-webkit-scrollbar {
                width: 6px;
            }

            .persona-cards-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
            }

            .persona-cards-container::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
            }

            .persona-card-item {
                cursor: pointer;
                transition: transform 0.15s, box-shadow 0.15s;
            }

            .persona-card-item:hover {
                transform: translateY(-2px);
            }

            .persona-card-item:hover .card {
                box-shadow: 0 0 0 2px rgba(230, 0, 18, 0.6);
            }

            .persona-card-section {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            /* Card Component (same as apps/persona) */
            .persona-card-item .card {
                position: relative;
                width: 90px;
                aspect-ratio: 1/1.67;
                overflow: hidden;
                border-radius: 10px;
            }

            .persona-card-item .card-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
            }

            .persona-card-item .image-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                border-radius: 10px;
                z-index: 2;
            }

            /* persona-img 스타일은 tactic-maker.css와 persona-img.css에서 처리 */

            .persona-card-item .cover-star {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 3;
                object-fit: cover;
            }

            .persona-card-item .position-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 4;
            }

            .persona-card-item .position-icon {
                width: 60% !important;
                height: auto !important;
                object-fit: contain !important;
            }

            .persona-card-item .element-icon {
                width: 11% !important;
                height: auto !important;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                z-index: 4;
                object-fit: contain !important;
            }

            .persona-card-item .wild-emblem {
                position: absolute;
                bottom: 12px;
                left: 51%;
                transform: translateX(-50%);
                width: 18%;
                height: auto;
                z-index: 5;
                object-fit: contain;
                pointer-events: none;
            }

            .persona-card-item .tier-label {
                position: absolute;
                top: 12px;
                right: 0;
                z-index: 6;
                background: #333;
                color: #fff;
                font-size: 9px;
                font-weight: 800;
                padding: 2px 5px;
                border-radius: 4px 0 0 4px;
                box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.2);
                line-height: 1;
                font-family: sans-serif;
            }

            .persona-card-item .tier-label.tier-s {
                background: linear-gradient(45deg, #cbebea, #e0b1f2, #cbebea, #e8baf9);
                color: #111;
            }

            .persona-card-item .tier-label.tier-a {
                background: linear-gradient(45deg, #efd16e, #fef0a2);
                color: #111;
            }

            .persona-card-item .tier-label.tier-b {
                background: #8d6e63;
                color: #fff;
            }

            .persona-card-item .persona-name {
                margin-top: 6px;
                text-align: center;
                font-weight: 500;
                font-size: 11px;
                color: #eee;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 90px;
            }

            /* None option card */
            .persona-none-option .none-card {
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.05);
                border: 1px dashed rgba(255, 255, 255, 0.2);
            }

            .persona-none-option .none-card span {
                font-size: 12px;
                color: #888;
            }

            /* Filter Modal */
            .persona-filter-modal {
                position: absolute;
                inset: 0;
                z-index: 10001;
            }

            .persona-filter-modal.hidden {
                display: none;
            }

            .persona-filter-modal .persona-filter-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
            }

            .persona-filter-dialog {
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: min(400px, 90vw);
                max-height: 80vh;
                background: #1a1a1a;
                color: #fff;
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
            }

            .persona-filter-header-inner {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: #252525;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .persona-filter-header-inner h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .persona-filter-close {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                font-size: 24px;
                cursor: pointer;
                line-height: 1;
            }

            .persona-filter-close:hover {
                color: #fff;
            }

            .persona-filter-body {
                padding: 20px;
                overflow-y: auto;
            }

            .persona-filter-group {
                margin-bottom: 20px;
            }

            .persona-filter-group:last-child {
                margin-bottom: 0;
            }

            .persona-filter-group h4 {
                font-size: 13px;
                color: #ccc;
                margin: 0 0 12px 0;
                font-weight: 500;
            }

            .persona-filter-options {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .persona-filter-label {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                background: rgba(255, 255, 255, 0.05);
                padding: 6px 10px;
                border-radius: 6px;
                border: 1px solid transparent;
                transition: all 0.2s;
                min-height: 32px;
            }

            .persona-filter-label:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .persona-filter-label:has(input:checked) {
                background: rgba(230, 0, 18, 0.2);
                border-color: #e60012;
            }

            .persona-filter-label input[type="checkbox"] {
                display: none;
            }

            .persona-filter-label img {
                width: 20px;
                height: 20px;
                object-fit: contain;
            }

            .persona-filter-label .star-container {
                display: flex;
                gap: 2px;
            }

            .persona-filter-label .star-container img {
                width: 12px;
                height: 12px;
            }

            .persona-filter-footer {
                display: flex;
                gap: 10px;
                padding: 16px 20px;
                background: #252525;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                justify-content: flex-end;
            }

            .persona-filter-reset,
            .persona-filter-apply {
                border: none;
                border-radius: 6px;
                padding: 8px 16px;
                font-size: 13px;
                cursor: pointer;
                font-weight: 500;
            }

            .persona-filter-reset {
                background: transparent;
                color: #aaa;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .persona-filter-reset:hover {
                border-color: #fff;
                color: #fff;
            }

            .persona-filter-apply {
                background: #e60012;
                color: #fff;
            }

            .persona-filter-apply:hover {
                background: #c2000f;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .persona-modal-dialog {
                    width: 95vw;
                    max-height: 95vh;
                }

                .persona-cards-container {
                    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
                    gap: 12px;
                    padding: 12px;
                }

                .persona-card-item .card {
                    width: 70px;
                }

                .persona-card-item .persona-name {
                    font-size: 10px;
                    max-width: 70px;
                }
            }

            @media (max-width: 480px) {
                .persona-cards-container {
                    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
                    gap: 8px;
                }

                .persona-card-item .card {
                    width: 60px;
                }

                .persona-card-item .persona-name {
                    font-size: 9px;
                    max-width: 60px;
                }

                .persona-search-sort-container {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 8px;
                }

                .persona-sort-container {
                    width: 100%;
                }

                .persona-sort-select {
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(style);
    }
}
