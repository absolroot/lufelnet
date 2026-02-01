/**
 * Tactic Maker V2 - Party UI Module
 * Handles party slot rendering with rich UI and robust dropdowns.
 */

import { DataLoader } from './data-loader.js';
import { NeedStatCardUI } from './ui-critical-card.js';

export class PartyUI {
    constructor(store, wonderUI, settingsUI) {
        this.store = store;
        this.wonderUI = wonderUI; // Dependency injection
        this.settingsUI = settingsUI; // Dependency injection
        this.container = document.getElementById('partySlots');
        this.rosterList = document.getElementById('rosterList');
        this.rosterContainer = document.getElementById('rosterContainer');
        this.needStatContainer = document.getElementById('needStatContainer');
        this.wonderConfigContainer = document.getElementById('wonderConfigContainer');
        this.toggleRosterBtn = document.getElementById('toggleRoster');

        // Base URL for assets
        this.baseUrl = window.BASE_URL || '';

        // Need Stat UI instances (per slot)
        this.needStatUIs = {};
        this.openNeedStatSlotIndex = null;

        this.ensureNeedStatContainer();

        // Initial setup
        this.store.subscribe((event, data) => this.handleStoreUpdate(event, data));
        this.rosterType = 'main';
        this.rosterFilters = {
            query: '',
            elements: new Set(),
            positions: new Set()
        };

        this.initRoster();
        this.initRosterToggle();

        // Global click listener to close Revelation dropdowns
        document.addEventListener('click', (e) => {
            document.querySelectorAll('.revelation-dropdown.open').forEach(el => {
                if (!el.contains(e.target)) {
                    el.classList.remove('open');
                }
            });
        });

        // Listen for edit mode changes to reorganize slots
        document.addEventListener('editModeChange', (e) => {
            this.reorganizeSlotsForViewMode(!e.detail.enabled);
        });

        // Listen for elucidator bonus changes to update all slot triggers
        window.addEventListener('elucidator-bonus-changed', () => {
            this.updateAllSlotTriggers();
        });

        // Explicitly render initial state to ensure UI is ready
        this.store.state.party.forEach((p, i) => this.renderSlot(i, p));
    }

    /**
     * Update all slot triggers when elucidator bonuses change
     */
    updateAllSlotTriggers() {
        this.store.state.party.forEach((charData, index) => {
            if (index === 3) return; // Skip elucidator itself
            if (!charData || !charData.name) return;
            
            const slotEl = this.getSlotElement(index);
            if (slotEl) {
                this.renderNeedStatTrigger(slotEl, charData, index).catch(err => {
                    console.error('[PartyUI] Failed to update slot trigger:', err);
                });
            }
        });
    }

    ensureNeedStatContainer() {
        if (this.needStatContainer && document.body.contains(this.needStatContainer)) return;

        this.needStatContainer = document.getElementById('needStatContainer');
        if (this.needStatContainer && document.body.contains(this.needStatContainer)) return;

        if (!this.rosterContainer || !document.body.contains(this.rosterContainer)) return;

        const el = document.createElement('div');
        el.className = 'need-stat-container';
        el.id = 'needStatContainer';
        el.hidden = true;

        this.rosterContainer.insertAdjacentElement('afterend', el);
        this.needStatContainer = el;
    }

    closeNeedStatPanel() {
        this.openNeedStatSlotIndex = null;
        this.ensureNeedStatContainer();
        if (this.needStatContainer) {
            this.needStatContainer.innerHTML = '';
            this.needStatContainer.hidden = true;
        }
        document.querySelectorAll('.need-stat-trigger.open').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('.need-stat-caret.open').forEach(el => el.classList.remove('open'));
    }

    async openNeedStatPanel(slotIndex, charData) {
        this.ensureNeedStatContainer();
        if (!this.needStatContainer) return;
        if (!charData || !charData.name) return;

        // Close roster-container when opening need-stat panel
        if (this.rosterContainer && this.rosterContainer.classList.contains('expanded')) {
            this.rosterContainer.classList.remove('expanded');
        }

        this.needStatContainer.hidden = false;

        await DataLoader.loadCriticalData();

        // If slot changed while awaiting, abort
        const currentData = this.store.state.party[slotIndex];
        if (!currentData || currentData.name !== charData.name) return;

        if (!this.needStatUIs[slotIndex]) {
            this.needStatUIs[slotIndex] = new NeedStatCardUI(this.store, this.baseUrl);
        }

        const ui = this.needStatUIs[slotIndex];
        const panelEl = ui.renderPanel(charData, slotIndex);

        this.needStatContainer.innerHTML = '';
        this.needStatContainer.appendChild(panelEl);
        this.needStatContainer.hidden = false;

        this.openNeedStatSlotIndex = slotIndex;

        document.querySelectorAll('.need-stat-trigger.open').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('.need-stat-caret.open').forEach(el => el.classList.remove('open'));
        const trigger = document.querySelector(`.need-stat-trigger[data-slot-index="${slotIndex}"]`);
        if (trigger) {
            trigger.classList.add('open');
            const caret = trigger.querySelector('.need-stat-caret');
            if (caret) caret.classList.add('open');
        }
    }

    /**
     * Reorganize slots for view mode (non-edit mode)
     * In view mode: Wonder slot moves into party-slots-container, sorted by order
     * Order: 1~n (by order number) / elucidator / slot4 (if visible)
     */
    reorganizeSlotsForViewMode(isViewMode) {
        const partyContainer = this.container; // party-slots-container
        const wonderGrid = document.querySelector('.wonder-personas-grid');
        const wonderSlot = document.getElementById('wonderSlotInGrid');

        if (!partyContainer) return;

        if (isViewMode) {
            // Move Wonder slot directly into party container (not clone)
            if (wonderSlot && wonderGrid) {
                // Add slot-card class for consistent styling
                wonderSlot.classList.add('slot-card', 'wonder-in-party');
                wonderSlot.dataset.slot = 'wonder';

                // Get Wonder order
                const wonderOrder = this.store.state.wonder?.order || '-';
                wonderSlot.dataset.order = wonderOrder !== '-' ? wonderOrder : '99';

                // Move to party container
                partyContainer.appendChild(wonderSlot);
            }

            // Now sort all slots by order
            this.sortSlotsByOrder();
        } else {
            // Edit mode: restore original layout
            if (wonderSlot && wonderGrid) {
                // Remove slot-card classes
                wonderSlot.classList.remove('slot-card', 'wonder-in-party');
                delete wonderSlot.dataset.slot;
                delete wonderSlot.dataset.order;

                // Move back to wonder grid (as first child)
                wonderGrid.insertBefore(wonderSlot, wonderGrid.firstChild);
            }

            // Restore original slot order
            this.restoreOriginalSlotOrder();
        }
    }

    sortSlotsByOrder() {
        const partyContainer = this.container;
        if (!partyContainer) return;

        const slots = Array.from(partyContainer.children);
        const party = this.store.state.party;

        // Assign order data to each slot
        slots.forEach(slot => {
            const slotNum = slot.dataset.slot;
            if (slotNum === 'elucidator') {
                slot.dataset.order = '100'; // Elucidator goes after ordered slots
            } else if (slotNum === '4') {
                slot.dataset.order = '101'; // Slot 4 goes last
            } else if (slotNum === 'wonder') {
                // Wonder slot - already has order set
            } else {
                const idx = parseInt(slotNum) - 1;
                const memberOrder = party[idx]?.order;
                slot.dataset.order = (memberOrder && memberOrder !== '-') ? memberOrder : '99';
            }
        });

        // Sort by order
        slots.sort((a, b) => {
            const orderA = parseInt(a.dataset.order) || 99;
            const orderB = parseInt(b.dataset.order) || 99;
            return orderA - orderB;
        });

        // Re-append in sorted order
        slots.forEach(slot => partyContainer.appendChild(slot));

        // If in view mode and total slots == 6, move the last slot to the rightmost column of second row (grid-column: 5 / 6)
        if (!document.body.classList.contains('tactic-edit-mode') && slots.length === 6) {
            const lastSlot = slots[slots.length - 1];
            if (lastSlot) {
                lastSlot.style.gridColumn = '5 / 6';
            }
        }
    }

    restoreOriginalSlotOrder() {
        const partyContainer = this.container;
        if (!partyContainer) return;

        // Original order: slot1, slot2, slot3, elucidator, slot4
        const originalOrder = ['1', '2', '3', 'elucidator', '4'];
        const slots = Array.from(partyContainer.children);

        slots.sort((a, b) => {
            const aSlot = a.dataset.slot || '';
            const bSlot = b.dataset.slot || '';
            return originalOrder.indexOf(aSlot) - originalOrder.indexOf(bSlot);
        });

        slots.forEach(slot => partyContainer.appendChild(slot));
    }

    handleStoreUpdate(event, data) {
        if (event === 'elucidatorChange') {
            const slot4 = document.getElementById('slot4');
            if (slot4) {
                slot4.classList.toggle('hidden', !data?.hasFuuka);
            }
            // Re-render slot 4 content if visible
            const party = this.store.state.party;
            this.renderSlot(4, party[4]);
            // Re-sort if in view mode
            if (!document.body.classList.contains('tactic-edit-mode')) {
                this.sortSlotsByOrder();
            }
            return;
        }

        if (event === 'partyChange' || event === 'fullReload') {
            const party = this.store.state.party;
            party.forEach((p, i) => this.renderSlot(i, p));
            // Re-sort if in view mode
            if (!document.body.classList.contains('tactic-edit-mode')) {
                // Need to update Wonder slot too
                this.updateWonderSlotInParty();
                this.sortSlotsByOrder();
            }
        }

        if (event === 'wonderChange') {
            // Re-sort if in view mode (Wonder order might have changed)
            if (!document.body.classList.contains('tactic-edit-mode')) {
                this.updateWonderSlotInParty();
                this.sortSlotsByOrder();
            }
        }
    }

    updateWonderSlotInParty() {
        const wonderSlot = document.getElementById('wonderSlotInGrid');
        if (!wonderSlot || !wonderSlot.classList.contains('wonder-in-party')) return;

        const wonderOrder = this.store.state.wonder?.order || '-';
        wonderSlot.dataset.order = wonderOrder !== '-' ? wonderOrder : '99';

        // Update the order image
        const orderNum = wonderOrder !== '-' ? String(wonderOrder).padStart(2, '0') : '';
        const orderImg = wonderSlot.querySelector('.order-img');
        if (orderImg) {
            if (orderNum) {
                orderImg.src = `${this.baseUrl}/assets/img/ui/num${orderNum}.png`;
                orderImg.style.display = '';
            } else {
                orderImg.style.display = 'none';
            }
        }
    }

    async initRoster() {
        await DataLoader.ensureData();
        this.ensureRosterFilterUI();
        this.rosterContainer.classList.remove('expanded');

        // Data is ready now; re-render so dropdown menus (weapons/revelations) are populated.
        this.store.state.party.forEach((p, i) => this.renderSlot(i, p));
        // Trigger wonderUI render if available
        if (this.wonderUI) this.wonderUI.render();

        // Close roster on outside click (if not clicking a slot)
        document.addEventListener('click', (e) => {
            const isSlotClick = e.target.closest('.slot-card');
            const isRosterClick = e.target.closest('.roster-container') || e.target.closest('.wonder-config-panel');
            const isNeedStatClick = e.target.closest('.need-stat-container') || e.target.closest('.need-stat-trigger');
            const isModal = e.target.closest('.modal');

            if (!isSlotClick && !isRosterClick && !isNeedStatClick && !isModal) {
                this.activeSlotIndex = null;
                this.container.querySelectorAll('.slot-card').forEach(s => s.classList.remove('selecting'));
                this.rosterContainer.classList.remove('expanded');
                this.closeNeedStatPanel();
            }

            // If clicked outside need-stat area, close need-stat panel (keep roster state as-is)
            if (!isNeedStatClick && !isModal) {
                this.closeNeedStatPanel();
            }
        });

        // Initialize Role Modal Close Logic
        const roleModal = document.getElementById('roleModal');
        if (roleModal) {
            roleModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop') || e.target.closest('.modal-close')) {
                    roleModal.hidden = true;
                    roleModal.classList.remove('show');
                }
            });
        }
    }

    ensureRosterFilterUI() {
        if (!this.rosterContainer) return;
        if (this.rosterContainer.querySelector('.roster-filter-bar')) return;

        const bar = document.createElement('div');
        bar.className = 'roster-filter-bar';

        bar.innerHTML = `
            <div class="roster-filter-search">
                <input type="text" class="roster-search-input" placeholder="${window.I18nService ? window.I18nService.t('searchPlaceholder') : '캐릭터 검색...'}" autocomplete="off">
            </div>

            <div class="roster-filter-groups">
                <div class="roster-filter-group roster-filter-elements"></div>
                <div class="roster-filter-group roster-filter-positions"></div>
            </div>
        `;

        this.rosterContainer.insertBefore(bar, this.rosterContainer.firstChild);

        const ELEMENTS = ['물리', '총격', '화염', '빙결', '전격', '질풍', '염동', '핵열', '축복', '주원', '만능'];
        const POSITIONS = ['지배', '반항', '우월', '굴복', '방위', '구원', '해명', '자율'];

        const elWrap = bar.querySelector('.roster-filter-elements');
        const posWrap = bar.querySelector('.roster-filter-positions');

        if (elWrap) {
            elWrap.innerHTML = ELEMENTS.map(v => `
                <label class="roster-filter-chip">
                    <input type="checkbox" data-kind="element" value="${v}">
                    <img src="${this.baseUrl}/assets/img/character-cards/속성_${v}.png" alt="${v}" onerror="this.style.display='none'">
                </label>
            `).join('');
        }

        if (posWrap) {
            posWrap.innerHTML = POSITIONS.map(v => `
                <label class="roster-filter-chip">
                    <input type="checkbox" data-kind="position" value="${v}">
                    <img src="${this.baseUrl}/assets/img/character-cards/직업_${v}.png" alt="${v}" onerror="this.style.display='none'">
                </label>
            `).join('');
        }

        const searchInput = bar.querySelector('.roster-search-input');
        if (searchInput) {
            searchInput.oninput = () => {
                this.rosterFilters.query = String(searchInput.value || '').trim();
                this.renderRoster(this.rosterType);
            };
        }

        bar.querySelectorAll('input[type="checkbox"][data-kind]').forEach(cb => {
            cb.onchange = () => {
                const kind = cb.dataset.kind;
                const val = cb.value;
                const set = (kind === 'element') ? this.rosterFilters.elements : this.rosterFilters.positions;
                if (cb.checked) set.add(val);
                else set.delete(val);
                this.renderRoster(this.rosterType);
            };
        });
    }

    renderRoster(type) {
        this.rosterType = type;
        const characterList = window.characterList || { mainParty: [], supportParty: [] };
        const characterData = window.characterData || {};

        let targetChars = [];
        if (type === 'support') {
            targetChars = characterList.supportParty || [];
        } else {
            targetChars = characterList.mainParty || [];
        }

        const selected = new Set(
            (this.store.state.party || [])
                .filter(Boolean)
                .map(m => m.name)
        );

        this.rosterList.className = 'roster-list';
        this.rosterList.innerHTML = '';

        const frag = document.createDocumentFragment();

        // release_order desc
        targetChars = [...targetChars].sort((a, b) => {
            const ao = (characterData[a] && Number(characterData[a].release_order)) || 0;
            const bo = (characterData[b] && Number(characterData[b].release_order)) || 0;
            return bo - ao;
        });

        const q = String(this.rosterFilters.query || '').toLowerCase();
        const activeElements = this.rosterFilters.elements;
        const activePositions = this.rosterFilters.positions;

        targetChars.forEach(name => {
            if (name === '원더') return;
            if (selected.has(name)) return;
            const charData = characterData[name];
            if (!charData) return;

            if (activeElements.size > 0 && !activeElements.has(charData.element)) return;
            if (activePositions.size > 0 && !activePositions.has(charData.position)) return;
            if (q) {
                const text = `${name} ${charData.name || ''} ${charData.codename || ''}`.toLowerCase();
                if (!text.includes(q)) return;
            }

            const div = document.createElement('div');
            div.className = 'roster-item';
            div.dataset.name = name;

            const imgPath = `${this.baseUrl}/assets/img/tier/${name}.webp`;
            const getCurrentLang = () => {
                if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
                    return window.I18nService.getCurrentLanguage();
                }
                return 'kr';
            };
            const lang = getCurrentLang();
            let displayName = charData.name || name;
            if (lang !== 'kr') {
                if (lang === 'en') displayName = charData.codename || charData.name_en || charData.name || name;
                else if (lang === 'jp') displayName = charData.name_jp || charData.name || name;
                else displayName = charData.name || name;
            }

            // Logic copied from dmg-calc/roster.js
            const element = charData.element || '';
            const position = charData.position || '';

            // For the text span, we may want to exclude element if it's redundant with the icon (e.g. in EN)
            let spanParts = [element, position].filter(Boolean);
            if (lang === 'en') {
                spanParts = [position].filter(Boolean);
            }

            const attrIconSrc = element ? `${this.baseUrl}/assets/img/character-cards/속성_${element}.png` : '';

            div.innerHTML = `
                <img class="roster-thumb" loading="lazy" decoding="async" src="${imgPath}" alt="${displayName}" onerror="this.src='${this.baseUrl}/assets/img/tier/${name}.webp'">
                <div class="roster-meta">
                    <div class="roster-name">${displayName}</div>
                    <div class="roster-sub">
                        ${attrIconSrc ? `<img class="meta-icon" src="${attrIconSrc}" alt="${element}" onerror="this.style.display='none'">` : ''}
                        <span>${spanParts.map(p => {
                const elName = DataLoader.getElementName(p);
                return elName !== p ? elName : DataLoader.getJobName(p);
            }).join(' · ')}</span>
                    </div>
                </div>
            `;

            div.addEventListener('click', () => {
                if (this.activeSlotIndex !== null) {
                    const slotEl = this.getSlotElement(this.activeSlotIndex);
                    if (slotEl) {
                        this.assignCharacterToSlot(slotEl, name);
                        this.activeSlotIndex = null;
                        this.container.querySelectorAll('.slot-card').forEach(s => s.classList.remove('selecting'));
                        this.rosterContainer.classList.remove('expanded');
                    }
                }
            });

            frag.appendChild(div);
        });

        this.rosterList.appendChild(frag);
    }

    showRosterView(type) {
        const headerTitle = this.rosterContainer.querySelector('.roster-header h3');
        if (headerTitle) {
            headerTitle.textContent = '캐릭터 목록';
            headerTitle.setAttribute('data-i18n', 'roster');
            this.updateI18n(headerTitle);
        }

        this.rosterList.classList.remove('hidden');

        this.renderRoster(type);
        this.rosterContainer.classList.add('expanded');
    }

    showWonderConfigView() {
        if (this.wonderUI) this.wonderUI.render();
        this.rosterContainer.classList.add('expanded');
    }

    renderSlot(index, data) {
        const slotEl = this.getSlotElement(index);
        if (!slotEl) return;

        const slotContent = slotEl.querySelector('.slot-content');
        if (!slotContent) return;

        const slotHeader = slotEl.querySelector('.slot-header');

        // Click handler for slot selection
        slotEl.onclick = (e) => {
            if (e.target.closest('button') ||
                e.target.closest('select') ||
                e.target.closest('.revelation-option') ||
                e.target.closest('.revelation-dropdown') ||
                e.target.closest('.role-selector') ||
                e.target.closest('.need-stat-trigger')) {
                return;
            }

            e.stopPropagation();
            
            // Close need-stat panel when opening roster
            this.closeNeedStatPanel();
            
            // Toggle roster: if same slot is clicked again and roster is expanded, close it
            if (this.activeSlotIndex === index && this.rosterContainer.classList.contains('expanded')) {
                this.rosterContainer.classList.remove('expanded');
                this.activeSlotIndex = null;
                this.container.querySelectorAll('.slot-card').forEach(s => s.classList.remove('selecting'));
                return;
            }
            
            this.showRosterView(index === 3 ? 'support' : 'main');
            this.activeSlotIndex = index;

            this.container.querySelectorAll('.slot-card').forEach(s => s.classList.remove('selecting'));
            slotEl.classList.add('selecting');
        };

        if (!data) {
            slotEl.classList.add('empty');
            slotEl.classList.remove('active', 'has-char-color');
            slotEl.style.removeProperty('--slot-char-color');
            slotContent.innerHTML = `<span class="empty-text" data-i18n="dragCharacter">클릭하여 선택</span>`;
            if (slotHeader) {
                // Show header and restore default label when empty
                slotHeader.style.display = '';
                const labelSpan = slotHeader.querySelector('span')?.outerHTML || '';
                slotHeader.innerHTML = labelSpan;
            }
            this.updateI18n(slotEl);

            slotEl.querySelectorAll('.need-stat-trigger').forEach(el => el.remove());
            if (this.needStatUIs[index]) {
                delete this.needStatUIs[index];
            }
            if (this.openNeedStatSlotIndex === index) {
                this.closeNeedStatPanel();
            }
            return;
        }

        slotEl.classList.remove('empty');
        slotEl.classList.add('active');

        const characterData = window.characterData || {};
        const charInfo = characterData[data.name] || {};

        // Apply character color as transparent background
        const charColor = charInfo.color || null;
        if (charColor) {
            slotEl.style.setProperty('--slot-char-color', charColor);
            slotEl.classList.add('has-char-color');
        } else {
            slotEl.style.removeProperty('--slot-char-color');
            slotEl.classList.remove('has-char-color');
        }

        const getCurrentLang = () => {
            if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
                return window.I18nService.getCurrentLanguage();
            }
            return 'kr';
        };

        const lang = getCurrentLang();
        // kr: use key name (아이템명). non-kr: prefer localized/full name if available.
        let displayName = data.name;
        if (lang !== 'kr') {
            if (lang === 'en') displayName = charInfo.codename || charInfo.name_en || charInfo.name || data.name;
            else if (lang === 'jp') displayName = charInfo.name_jp || charInfo.name || data.name;
            else displayName = charInfo.name || data.name;
        }
        // Updated to use tier image as requested
        const imgPath = `${this.baseUrl}/assets/img/tier/${data.name}.webp`;

        const element = charInfo.element || '';
        const position = charInfo.position || '';
        const attrIcon = element ? `${this.baseUrl}/assets/img/character-cards/속성_${element}.png` : '';
        const posIcon = position ? `${this.baseUrl}/assets/img/character-cards/직업_${position}.png` : '';

        const isJandC = data.name === 'J&C' || data.name === 'J&amp;C' || data.name?.toLowerCase() === 'j&c';
        const isWonder = data.name === '원더' || data.name === 'WONDER';

        const currentOrder = data.order || '-';

        // (1) Elucidator has no turn order
        const isElucidator = index === 3;

        // Determine order image number (01, 02, 03, 04)
        const orderNum = currentOrder !== '-' ? String(currentOrder).padStart(2, '0') : '';
        const orderImgSrc = orderNum ? `${this.baseUrl}/assets/img/ui/num${orderNum}.png` : '';

        // Determine grid columns for ritual-mod-wrapper
        let gridCols = '1fr 1fr 1fr'; // Default: order, ritual, mod
        if (isElucidator || index === 4) {
            gridCols = '1fr 1fr'; // No order for elucidator
        } else if (isWonder) {
            gridCols = '1fr'; // Only order for Wonder
        }

        slotContent.innerHTML = `
            <div class="slot-char-info">
                <img src="${imgPath}" class="slot-char-img"
                     onerror="this.src='${this.baseUrl}/assets/img/tier/${data.name}.webp'">
                <div class="slot-char-details">
                    <div class="slot-char-name">
                        <span class="slot-name-text">${displayName}</span>
                        <span class="preset-icons"></span>
                    </div>
                    <div class="slot-char-sub">
                        ${attrIcon ? `<img src="${attrIcon}" class="meta-icon" title="${DataLoader.getElementName(element)}" onerror="this.style.display='none'">` : ''}
                        ${element ? `<span class="slot-meta-text slot-meta-element">${DataLoader.getElementName(element)}</span>` : ''}
                        ${posIcon ? `<img src="${posIcon}" class="meta-icon" title="${DataLoader.getJobName(position)}" onerror="this.style.display='none'">` : ''}
                        ${position && !isJandC ? `<span class="slot-meta-text slot-meta-position">${DataLoader.getJobName(position)}</span>` : ''}

                        ${isJandC ? (() => {
                const activeRole = data.role || '우월';
                const roleIcon = `${this.baseUrl}/assets/img/character-cards/직업_${activeRole}.png`;
                return `
                                <button type="button" class="jnc-role-btn btn-role-change" title="직업 변경">
                                    <img src="${roleIcon}" class="role-icon-img" alt="${activeRole}">
                                    <span class="role-change-hint">↻</span>
                                </button>
                            `;
            })() : ''}
                    </div>
                </div>
                ${orderImgSrc && !isElucidator && index !== 4 ? `<img class="order-img" src="${orderImgSrc}" alt="${window.I18nService ? window.I18nService.t('orderLabel') : '순서'} ${currentOrder}">` : ''}
            </div>

            ${isJandC ? '' : ''}<!-- Role Selector removed -->

            <!-- Slot Options Grid (hidden for Wonder in edit mode shows only order) -->
            <div class="slot-options-grid" style="display: grid;">

                <!-- Row 1: Order, Ritual, Modification -->
                <div class="ritual-mod-wrapper" style="display: grid; grid-template-columns: ${gridCols}; gap: 20px;">
                     ${isElucidator || index === 4 ? '' : `
                     <div class="slot-option-group">
                        <label style="font-size: 11px; opacity: 0.7; margin-bottom: 2px; display: block;">${window.I18nService ? window.I18nService.t('orderLabel') : '순서'}</label>
                        <select class="styled-select order-select" data-index="${index}">
                             <!-- Populated by JS -->
                        </select>
                     </div>
                     `}
                     ${isWonder ? '' : `
                     <div class="slot-option-group">
                        <label style="font-size: 11px; opacity: 0.7; margin-bottom: 2px; display: block;">${window.I18nService ? window.I18nService.t('defaultRitual').replace('기본 ', '') : '의식'}</label>
                        <select class="styled-select ritual-select" data-index="${index}">
                             <!-- Populated by JS -->
                        </select>
                     </div>
                     <div class="slot-option-group">
                        <label style="font-size: 11px; opacity: 0.7; margin-bottom: 2px; display: block;">${window.I18nService ? window.I18nService.t('defaultModification').replace('기본 ', '') : '개조'}</label>
                        <select class="styled-select mod-select" data-index="${index}" >
                             <!-- Populated by JS -->
                        </select>
                     </div>
                     `}
                </div>

                <!-- Row 2: Revelation OR Wonder Weapon (hidden for Wonder) -->
                ${isWonder ? '' : `
                <div class="slot-option-group special-config-wrapper">
                    <!-- Injected via JS -->
                </div>
                `}
            </div>
        `;

        // (5) Hide slot-header when character is selected (active)
        if (slotHeader) {
            slotHeader.style.display = 'none';
        }

        // (6) Populate order select in ritual-mod-wrapper (except elucidator / slot4)
        if (!isElucidator && index !== 4) {
            const orderSelect = slotEl.querySelector('.order-select');
            if (orderSelect) {
                const maxOrder = this.store.getOrderableCharacterCount();
                let orderOptionsHtml = `<option value="-" ${currentOrder == '-' ? 'selected' : ''}>-</option>`;
                for (let n = 1; n <= maxOrder; n++) {
                    orderOptionsHtml += `<option value="${n}" ${currentOrder == n ? 'selected' : ''}>${n}</option>`;
                }
                orderSelect.innerHTML = orderOptionsHtml;
            }
        }

        // 1. Setup Ritual & Modification Selects
        this.setupRitualModSelects(slotEl, data, index);

        // 2. Setup Order Events (except elucidator / slot4)
        if (!isElucidator && index !== 4) {
            const orderSelect = slotEl.querySelector('.order-select');
            if (orderSelect) {
                orderSelect.addEventListener('change', (e) => {
                    e.stopPropagation();
                    this.updateSlotOrder(index, e.target.value);
                });
            }
        }

        // 3. Setup Revelation (not for Wonder - Wonder has no revelation/weapon config in slot)
        const specialWrapper = slotEl.querySelector('.special-config-wrapper');
        if (specialWrapper && !isWonder) {
            this.renderRevelationConfig(specialWrapper, data, index);
        }

        // 4. Bind other slot events
        this.bindSlotEvents(slotEl, data, index);
        this.updateI18n(slotEl);

        // 5. Render Need Stat trigger below slot (except Wonder)
        if (!isWonder) {
            // renderNeedStatTrigger is async but we don't need to block
            this.renderNeedStatTrigger(slotEl, data, index).catch(err => {
                console.error('[PartyUI] Failed to render need stat trigger:', err);
            });
        }
    }

    bindSlotEvents(slotEl, data, index) {
        // J&C Role Button Click
        const jncBtn = slotEl.querySelector('.jnc-role-btn');
        if (jncBtn) {
            jncBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openRoleModal(index, data.role || '우월');
            });
        }
    }

    openRoleModal(index, currentRole) {
        const modal = document.getElementById('roleModal');
        const roleList = document.getElementById('roleList');
        if (!modal || !roleList) return;

        // Populate Roles
        // Order: 우월 (default), 지배, 반항, 굴복, 방위, 구원
        const POSITIONS = ['우월', '지배', '반항', '굴복', '방위', '구원'];

        roleList.innerHTML = POSITIONS.map(pos => {
            const isActive = currentRole === pos;
            return `
                <div class="role-option-item ${isActive ? 'active' : ''}" data-role="${pos}" onclick="void(0)">
                    <img src="${this.baseUrl}/assets/img/character-cards/직업_${pos}.png" alt="${pos}">
                    <span>${DataLoader.getJobName(pos)}</span>
                </div>
            `;
        }).join('');

        // Apply Grid Styles via JS to ensure it looks good without CSS file edit for now
        roleList.style.display = 'grid';
        roleList.style.gridTemplateColumns = 'repeat(3, 1fr)';
        roleList.style.gap = '10px';

        roleList.querySelectorAll('.role-option-item').forEach(item => {
            // Basic styles for items
            item.style.cursor = 'pointer';
            item.style.padding = '10px';
            item.style.borderRadius = '8px';
            item.style.background = 'rgba(255,255,255,0.05)';
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.alignItems = 'center';
            item.style.gap = '6px';
            item.style.border = '1px solid transparent';

            if (item.classList.contains('active')) {
                item.style.background = 'rgba(209, 31, 31, 0.2)';
                item.style.borderColor = 'rgba(209, 31, 31, 0.8)';
            }

            const img = item.querySelector('img');
            img.style.width = '32px';
            img.style.height = '32px';
            img.style.objectFit = 'contain';

            const span = item.querySelector('span');
            span.style.fontSize = '12px';
            span.style.color = '#ddd';

            item.addEventListener('mouseover', () => {
                if (!item.classList.contains('active')) item.style.background = 'rgba(255,255,255,0.1)';
            });
            item.addEventListener('mouseout', () => {
                if (!item.classList.contains('active')) item.style.background = 'rgba(255,255,255,0.05)';
                else item.style.background = 'rgba(209, 31, 31, 0.2)';
            });

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const newRole = item.dataset.role;
                const currentData = { ...this.store.state.party[index], role: newRole };
                this.store.setPartySlot(index, currentData);
                modal.hidden = true;
                modal.classList.remove('show');
            });
        });

        modal.hidden = false;
        requestAnimationFrame(() => modal.classList.add('show'));
    }

    // --- Helper Methods for Slot Rendering ---

    renderWonderWeaponConfig(wrapper, data, index) {
        if (!wrapper) return;
        wrapper.innerHTML = `<label style="font-size: 11px; opacity: 0.7; margin-bottom: 2px; display: block;">${window.I18nService ? window.I18nService.t('weaponLabel') : '원더 무기'}</label>`;

        const config = this.buildRevelationSelectLike('wonder-weapon');
        wrapper.appendChild(config);

        const currentVal = data.wonderWeapon || '';
        let options = [];
        if (window.DmgCalc && window.__dmgCalcInstance && typeof window.__dmgCalcInstance.getWonderWeaponOptions === 'function') {
            options = window.__dmgCalcInstance.getWonderWeaponOptions();
        } else {
            // Fallback options if DmgCalc isn't ready
            options = ['파라다이스 로스트', '하이라이트', '크리스탈 소드', '메타버스 내비'];
        }

        this.populateRevelationSelect(config, 'wonder-weapon', currentVal, (val) => {
            const currentData = { ...this.store.state.party[index], wonderWeapon: val };
            this.store.setPartySlot(index, currentData);
        }, options);
    }

    renderRevelationConfig(wrapper, data, index) {
        if (!wrapper) return;
        wrapper.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'revelation-selects';

        const mainSel = this.buildRevelationSelectLike('main');
        const subSel = this.buildRevelationSelectLike('sub');

        container.appendChild(mainSel);
        container.appendChild(subSel);
        wrapper.appendChild(container);

        // Populate Main
        const revData = window.revelationData || { main: {} };
        const mainOptions = Object.keys(revData.main || {});

        this.populateRevelationSelect(mainSel, 'main', data.mainRev, (val) => {
            const currentData = { ...this.store.state.party[index], mainRev: val, subRev: '' };
            this.store.setPartySlot(index, currentData);
        }, mainOptions);

        // Populate Sub
        let subOptions = [];
        if (data.mainRev && revData.main && revData.main[data.mainRev]) {
            subOptions = revData.main[data.mainRev];
        } else {
            subOptions = Object.keys(revData.sub || {});
        }

        this.populateRevelationSelect(subSel, 'sub', data.subRev, (val) => {
            const currentData = { ...this.store.state.party[index], subRev: val };
            this.store.setPartySlot(index, currentData);
        }, subOptions);
    }

    buildRevelationSelectLike(kind) {
        const wrap = document.createElement('div');
        wrap.className = 'revelation-select';
        wrap.dataset.revKind = kind;

        const dropdown = document.createElement('div');
        dropdown.className = 'revelation-dropdown';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'revelation-button';
        button.setAttribute('aria-expanded', 'false');
        button.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.revelation-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        };

        const menu = document.createElement('div');
        menu.className = 'revelation-menu';

        dropdown.appendChild(button);
        dropdown.appendChild(menu);
        wrap.appendChild(dropdown);
        return wrap;
    }

    populateRevelationSelect(wrapEl, kind, selectedValue, onSelect, options = []) {
        const button = wrapEl.querySelector('.revelation-button');
        const menu = wrapEl.querySelector('.revelation-menu');
        const dropdown = wrapEl.querySelector('.revelation-dropdown');

        // Render Button Content
        button.innerHTML = '';
        if (selectedValue) {
            const img = this.buildRevelationIcon(selectedValue, kind === 'wonder-weapon');
            button.appendChild(img);
            const span = document.createElement('span');
            span.textContent = kind === 'wonder-weapon' ? DataLoader.getWeaponDisplayName(selectedValue) : DataLoader.getRevelationName(selectedValue);
            button.appendChild(span);
        } else {
            const span = document.createElement('span');
            span.textContent = '-';
            button.appendChild(span);
        }

        // Render Menu
        menu.innerHTML = '';
        options.forEach(opt => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'revelation-option';

            const img = this.buildRevelationIcon(opt, kind === 'wonder-weapon');
            item.appendChild(img);

            const span = document.createElement('span');
            span.textContent = kind === 'wonder-weapon' ? DataLoader.getWeaponDisplayName(opt) : DataLoader.getRevelationName(opt);
            item.appendChild(span);

            item.onclick = (e) => {
                e.stopPropagation();
                onSelect(opt);
                dropdown.classList.remove('open');
            };

            menu.appendChild(item);
        });
    }

    buildRevelationIcon(name, isWeapon = false) {
        const img = document.createElement('img');
        img.className = 'revelation-icon';
        img.loading = 'lazy';
        img.alt = name;

        const encoded = encodeURIComponent(name);
        if (isWeapon) {
            img.src = `${this.baseUrl}/assets/img/wonder-weapon/${encoded}.webp`;
        } else {
            img.src = `${this.baseUrl}/assets/img/revelation/${encoded}.webp`;
        }
        img.onerror = function () { this.style.display = 'none'; };
        return img;
    }

    setupRitualModSelects(slotEl, data, index) {
        const ritualSelect = slotEl.querySelector('.ritual-select');
        const modSelect = slotEl.querySelector('.mod-select');

        const ritualOpts = ['0', '1', '2', '3', '4', '5', '6'];
        const modOpts = ['-', '0', '1', '2', '3', '4', '5', '6'];

        // Ritual (A)
        if (ritualSelect) {
            ritualSelect.innerHTML = '';
            ritualOpts.forEach(v => {
                const op = document.createElement('option');
                op.value = v;
                op.textContent = v;
                if (String(data.ritual || '0') === v) op.selected = true;
                ritualSelect.appendChild(op);
            });
            ritualSelect.addEventListener('change', (e) => {
                e.stopPropagation();
                const val = e.target.value;
                const currentData = { ...this.store.state.party[index], ritual: val };
                this.store.setPartySlot(index, currentData);
                this.updatePresetIconsFromValues(slotEl, val, modSelect ? modSelect.value : (data.modification || '0'));
                // Refresh need-stat auto-selection
                this.refreshNeedStatForSlot(index, currentData);
            });
        }

        // Modification (R)
        if (modSelect) {
            modSelect.innerHTML = '';
            modOpts.forEach(v => {
                const op = document.createElement('option');
                op.value = v;
                op.textContent = v;
                if (String(data.modification ?? '0') === v) op.selected = true;
                modSelect.appendChild(op);
            });
            modSelect.addEventListener('change', (e) => {
                e.stopPropagation();
                const val = e.target.value;
                const currentData = { ...this.store.state.party[index], modification: val };
                this.store.setPartySlot(index, currentData);
                this.updatePresetIconsFromValues(slotEl, ritualSelect ? ritualSelect.value : (data.ritual || '0'), val);
                // Refresh need-stat auto-selection
                this.refreshNeedStatForSlot(index, currentData);
            });
        }

        this.updatePresetIconsFromValues(slotEl, data.ritual || '0', (data.modification ?? '0'));
    }

    updatePresetIconsFromValues(slotEl, ritualVal, modVal) {
        const container = slotEl.querySelector('.preset-icons');
        if (!container) return;
        container.innerHTML = '';

        // A = Ritual
        if (ritualVal && ritualVal !== '-') {
            const img = document.createElement('img');
            img.src = `${this.baseUrl}/assets/img/ritual/a${ritualVal}.png`;
            img.className = 'preset-icon';
            img.alt = `A${ritualVal}`;
            container.appendChild(img);
        }

        // R = Modification
        if (modVal && modVal !== '-') {
            const img = document.createElement('img');
            img.src = `${this.baseUrl}/assets/img/ritual/r${modVal}.png`;
            img.className = 'preset-icon';
            img.alt = `R${modVal}`;
            container.appendChild(img);
        }
    }

    updateSlotOrder(index, newOrder) {
        // Only slots with turn order participate:
        // - Wonder ('mystery')
        // - Party slots except elucidator (index 3) and slot4 (index 4)
        const isOrderParticipant = (idx) => idx === 'mystery' || (Number.isInteger(idx) && idx !== 3 && idx !== 4);

        // Capture old character->order mapping BEFORE any changes
        const oldCharToOrder = this.store.getCharacterToOrderMap();

        const getOrder = (idx) => {
            if (idx === 'mystery') return String(this.store.getWonderConfig().order);
            const member = this.store.state.party[idx];
            return member ? String(member.order || '-') : '-';
        };

        const setOrder = (idx, val) => {
            if (idx === 'mystery') {
                const cfg = this.store.getWonderConfig();
                if (String(cfg.order) !== String(val)) {
                    this.store.setWonderConfig({ ...cfg, order: val });
                }
                return;
            }
            const current = this.store.state.party[idx];
            if (current && String(current.order) !== String(val)) {
                this.store.setPartySlot(idx, { ...current, order: val });
            }
        };

        // If newOrder is '-', clear order
        if (newOrder === '-' || newOrder === '') {
            setOrder(index, '-');
            // Move column data with their owner (actions stay unchanged)
            this.store.moveActionsWithCharacters(oldCharToOrder);
            return;
        }

        const targetOrderNum = parseInt(newOrder);
        const currentOrderNum = parseInt(getOrder(index)) || 0;

        // Build a map of order -> participant index
        const orderToParticipant = new Map();
        const wonderCfg = this.store.getWonderConfig();
        const wonderOrderNum = parseInt(wonderCfg.order);
        if (!isNaN(wonderOrderNum) && wonderOrderNum >= 1 && wonderOrderNum <= 4) {
            orderToParticipant.set(wonderOrderNum, 'mystery');
        }
        this.store.state.party.forEach((member, idx) => {
            if (!isOrderParticipant(idx)) return;
            if (idx === index) return; // Exclude the one being changed
            const order = parseInt(member?.order);
            if (!isNaN(order) && order >= 1 && order <= 4) {
                orderToParticipant.set(order, idx);
            }
        });

        // Special case: Character at order 1 moving to a higher order
        // When order 1 moves to X, all characters from 2 to X should shift DOWN by 1
        if (currentOrderNum === 1 && targetOrderNum > 1) {
            // Shift down: orders 2..targetOrderNum become 1..(targetOrderNum-1)
            for (let o = 2; o <= targetOrderNum; o++) {
                if (orderToParticipant.has(o)) {
                    const participant = orderToParticipant.get(o);
                    setOrder(participant, String(o - 1));
                }
            }
            // Set the mover's order
            setOrder(index, String(targetOrderNum));
        } else {
            // Normal case: shift others UP if target is taken
            if (orderToParticipant.has(targetOrderNum)) {
                // Shift those >= targetOrderNum forward (from high to low to avoid collision)
                for (let o = 4; o >= targetOrderNum; o--) {
                    if (orderToParticipant.has(o)) {
                        const participant = orderToParticipant.get(o);
                        if (o < 4) {
                            setOrder(participant, String(o + 1));
                        }
                    }
                }
            }
            // Set the mover's order
            setOrder(index, String(targetOrderNum));
        }

        // Move column data with their owner (actions stay unchanged)
        this.store.moveActionsWithCharacters(oldCharToOrder);
    }

    updateI18n(element) {
        if (window.I18nService && typeof window.I18nService.updateDOM === 'function') {
            window.I18nService.updateDOM(element);
        }
    }

    /**
     * Render Need Stat trigger inside a slot (at the bottom)
     */
    async renderNeedStatTrigger(slotEl, data, index) {
        // Prevent concurrent renders for the same slot
        const renderKey = `_needStatRenderPending_${index}`;
        if (this[renderKey]) return;
        this[renderKey] = true;

        try {
            // Remove existing trigger (prevent duplicates)
            slotEl.querySelectorAll('.need-stat-trigger').forEach(el => el.remove());

            // If no character assigned: cleanup + close panel if it was open
            if (!data || !data.name) {
                if (this.needStatUIs[index]) {
                    delete this.needStatUIs[index];
                }
                if (this.openNeedStatSlotIndex === index) {
                    this.closeNeedStatPanel();
                }
                return;
            }

            await DataLoader.loadCriticalData();

            // Double-check slot still has this character (might have changed during async wait)
            const currentData = this.store.state.party[index];
            if (!currentData || currentData.name !== data.name) return;

            // Create UI instance if not exists
            if (!this.needStatUIs[index]) {
                this.needStatUIs[index] = new NeedStatCardUI(this.store, this.baseUrl);
            }

            const ui = this.needStatUIs[index];
            const isOpen = this.openNeedStatSlotIndex === index;
            const isElucidator = (index === 3);
            const triggerEl = ui.renderTrigger(data, index, isOpen);
            
            // Elucidator slot doesn't need panel expansion (all inputs are in trigger)
            if (!isElucidator) {
                triggerEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.openNeedStatSlotIndex === index) {
                        this.closeNeedStatPanel();
                    } else {
                        this.openNeedStatPanel(index, data).catch(err => console.error('[PartyUI] Failed to open need stat panel:', err));
                    }
                });
            }

            slotEl.appendChild(triggerEl);
        } finally {
            this[renderKey] = false;
        }
    }

    /**
     * Refresh need-stat auto-selection when ritual/modification changes
     */
    refreshNeedStatForSlot(index, charData) {
        const ui = this.needStatUIs[index];
        if (!ui) return;
        
        // Refresh auto-selection
        ui.refreshAutoSelection(charData);
        
        // Re-render trigger to update totals
        const slotEl = this.getSlotElement(index);
        if (slotEl) {
            this.renderNeedStatTrigger(slotEl, charData, index).catch(err => {
                console.error('[PartyUI] Failed to refresh need stat trigger:', err);
            });
        }
        
        // If panel is open for this slot, re-render it
        if (this.openNeedStatSlotIndex === index) {
            this.openNeedStatPanel(index, charData).catch(err => {
                console.error('[PartyUI] Failed to refresh need stat panel:', err);
            });
        }
    }

    initRosterToggle() {
        if (this.toggleRosterBtn && this.rosterContainer) {
            this.toggleRosterBtn.addEventListener('click', () => {
                this.rosterContainer.classList.toggle('expanded');
            });
        }
    }

    initDragDrop() {
        const slots = this.container.querySelectorAll('.slot-card');
        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const charName = e.dataTransfer.getData('text/plain');
                if (charName) {
                    this.assignCharacterToSlot(slot, charName);
                }
            });
        });
    }

    getSlotIndex(slotEl) {
        const slotId = slotEl.dataset.slot;
        if (slotId === 'elucidator') return 3;
        if (slotId === '4') return 4;
        return parseInt(slotId) - 1;
    }

    getSlotElement(index) {
        let slotId = '';
        if (index === 3) slotId = 'elucidator';
        else if (index === 4) slotId = '4';
        else slotId = String(index + 1);
        return this.container.querySelector(`.slot-card[data-slot="${slotId}"]`);
    }

    async assignCharacterToSlot(slotEl, charName) {
        const index = this.getSlotIndex(slotEl);
        if (index < 0) return;

        let defaultOrder = index + 1;
        if (index === 3) defaultOrder = 0;
        if (index === 4) defaultOrder = 4;

        const normalizePrefList = (val) => {
            if (!val) return [];
            if (Array.isArray(val)) return val.filter(Boolean);
            if (typeof val === 'string') return [val];
            return [];
        };

        // Preferred revelations are maintained in window.characterSetting (data/characters/*/setting.js)
        try {
            if (typeof DataLoader.loadCharacterSetting === 'function') {
                await DataLoader.loadCharacterSetting(charName);
            }
        } catch (_) { }

        const cSetting = (window.characterSetting || {})[charName] || {};
        const cData = (window.characterData || {})[charName] || {};
        const mainPrefs = normalizePrefList(cSetting.main_revelation || cData.main_revelation);
        const subPrefs = normalizePrefList(cSetting.sub_revelation || cData.sub_revelation);

        const revData = DataLoader.getRevelationData ? DataLoader.getRevelationData() : (window.revelationData || { main: {}, sub: {} });
        const mainOptions = Object.keys(revData.main || {});

        let mainRev = mainPrefs.find(v => mainOptions.includes(v)) || '';
        if (!mainRev && mainOptions.length > 0) mainRev = mainOptions[0];

        let subRev = '';
        const allowedSubs = (revData.main && mainRev && Array.isArray(revData.main[mainRev])) ? revData.main[mainRev] : [];
        if (allowedSubs.length > 0) {
            subRev = subPrefs.find(v => allowedSubs.includes(v)) || allowedSubs[0] || '';
        }

        // Find the first available order (not taken by Wonder or other party members)
        let desiredOrder = '-';
        if (index !== 3 && index !== 4) {
            const usedOrders = new Set();

            // Check Wonder's order
            const wonderOrder = String(this.store.state.wonder.order);
            if (wonderOrder && wonderOrder !== '-') {
                usedOrders.add(wonderOrder);
            }

            // Check other party members' orders (exclude elucidator and slot4)
            this.store.state.party.forEach((member, idx) => {
                if (idx === 3 || idx === 4) return;
                if (idx === index) return; // Skip the slot we're assigning to
                if (member && member.order && member.order !== '-') {
                    usedOrders.add(String(member.order));
                }
            });

            // Find the first available order (1-4)
            for (let n = 1; n <= 4; n++) {
                if (!usedOrders.has(String(n))) {
                    desiredOrder = String(n);
                    break;
                }
            }
        }

        // Default Data Construction, respecting settings
        const defaultRitual = (this.settingsUI && this.settingsUI.getDefaultRitual()) || '0';
        const defaultModification = (this.settingsUI && this.settingsUI.getDefaultModification()) || '-';

        // Set slot first with order '-' to avoid order collision, then apply through updateSlotOrder
        this.store.setPartySlot(index, {
            name: charName,
            order: (index === 3 || index === 4) ? '-' : '-',
            ritual: defaultRitual,
            modification: defaultModification,
            role: null,
            mainRev,
            subRev
        });

        if (desiredOrder !== '-') {
            this.updateSlotOrder(index, desiredOrder);
        }

        // Auto Wonder Weapon Selection (Rebel/Domination)
        // Auto Wonder Weapon Selection (Rebel/Domination)
        const isAutoWeaponEnabled = (this.settingsUI && typeof this.settingsUI.getAutoWonderWeapon === 'function' && this.settingsUI.getAutoWonderWeapon());
        console.log('[AutoWeapon] Enabled:', isAutoWeaponEnabled, 'Char:', charName, 'Position:', cData.position);

        if (isAutoWeaponEnabled) {
            const position = cData.position || '';
            if (['반항', '지배'].includes(position)) {
                try {
                    // Load party.js for this character
                    if (typeof DataLoader.loadCharacterParty === 'function') {
                        console.log('[AutoWeapon] Loading party js for', charName);
                        await DataLoader.loadCharacterParty(charName);

                        const rec = (window.recommendParty || {})[charName];
                        console.log('[AutoWeapon] Loaded rec:', rec);

                        if (rec && rec.weapon && rec.weapon.length > 0) {
                            // Take first weapon, remove trailing '!' if present
                            let weaponName = rec.weapon[0];
                            if (weaponName.endsWith('!')) {
                                weaponName = weaponName.slice(0, -1);
                            }

                            console.log('[AutoWeapon] Selected weapon:', weaponName);

                            // Update Wonder config
                            const wonderCfg = this.store.getWonderConfig();
                            // Don't overwrite if it's the same to avoid unnecessary renders
                            if (wonderCfg.weapon !== weaponName) {
                                console.log('[AutoWeapon] Updating store...');
                                this.store.setWonderConfig({ ...wonderCfg, weapon: weaponName });
                            }
                        }
                    }
                } catch (e) {
                    console.error('Failed to auto-set Wonder weapon:', e);
                }
            } else {
                console.log('[AutoWeapon] Position mismatch:', position);
            }
        }
    }
}
