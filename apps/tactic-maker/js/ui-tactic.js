/**
 * Tactic Maker V2 - Tactic Board UI Module
 * Handles the timeline/tactic board rendering and action editing
 */

import { AutoActionPrompt } from './auto-action-prompt.js';

export class TacticUI {
    constructor(store, settingsUI) {
        this.store = store;
        this.settingsUI = settingsUI;
        this.tableHeader = document.getElementById('tacticHeaderRow');
        this.tableBody = document.getElementById('tacticBody');
        this.btnAddTurn = document.getElementById('btnAddTurn');
        this.editModeToggle = document.getElementById('editModeToggle');
        this.editModeBtn = document.getElementById('btnEditMode');

        // Base URL for assets
        this.baseUrl = window.BASE_URL || '';

        // Auto Action Prompt module
        this.autoActionPrompt = new AutoActionPrompt(store, settingsUI, this.baseUrl);

        // Cache sorted party
        this.sortedChars = [];

        // Track loaded skill scripts
        this.loadedSkillScripts = new Set();

        // Subscribe to store changes
        this.store.subscribe((event, data) => this.handleStoreUpdate(event, data));

        // Bind events (only work in edit mode)
        this.btnAddTurn?.addEventListener('click', () => {
            if (!this.isEditMode()) return;
            this.store.addTurn();
        });

        const applyEditMode = (enabled, skipRender = false) => {
            document.body.classList.toggle('tactic-edit-mode', !!enabled);

            if (this.editModeToggle) {
                this.editModeToggle.checked = !!enabled;
            }
            if (this.editModeBtn) {
                this.editModeBtn.classList.toggle('active', !!enabled);
                this.editModeBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
            }

            if (!skipRender) {
                this.renderTurns();
            }

            // Dispatch custom event for other modules to react
            document.dispatchEvent(new CustomEvent('editModeChange', { detail: { enabled } }));
        };

        this.editModeToggle?.addEventListener('change', (e) => {
            applyEditMode(e.target.checked);
        });

        this.editModeBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            applyEditMode(!this.isEditMode());
        });

        // Initial state (default: edit mode ON) - skip render until skill data is loaded
        applyEditMode(true, true);

        // Load skill data then render
        this.loadPartySkillData().then(() => {
            this.renderHeaders();
            this.renderTurns();
        });

        // Global click listener for custom dropdowns
        document.addEventListener('click', (e) => {
            document.querySelectorAll('.custom-select-options.show').forEach(menu => {
                const container = menu.closest('.custom-select-container');
                if (container && !container.contains(e.target)) {
                    menu.classList.remove('show');
                }
            });
        });
    }

    isEditMode() {
        return document.body.classList.contains('tactic-edit-mode');
    }

    colorToRgb(color) {
        if (!color) return null;
        const raw = String(color).trim();
        if (/^#([0-9a-f]{3}){1,2}$/i.test(raw)) {
            const hex = raw.slice(1);
            const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
            const num = parseInt(full, 16);
            return {
                r: (num >> 16) & 255,
                g: (num >> 8) & 255,
                b: num & 255
            };
        }
        const rgb = raw.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
        if (rgb) {
            return {
                r: Math.min(255, Math.max(0, parseInt(rgb[1], 10))),
                g: Math.min(255, Math.max(0, parseInt(rgb[2], 10))),
                b: Math.min(255, Math.max(0, parseInt(rgb[3], 10)))
            };
        }
        return null;
    }

    handleStoreUpdate(event, data) {
        if (['partyChange', 'fullReload', 'elucidatorChange', 'wonderChange'].includes(event)) {
            this.loadPartySkillData().then(() => {
                this.renderHeaders();
                this.renderTurns();
            });
        } else if (event === 'turnsChange') {
            this.renderHeaders(); // Re-render headers to update auto-action prompt state
            this.renderTurns();
        }
    }

    /**
     * Load skill data for all party members
     */
    async loadPartySkillData() {
        const party = this.store.state.party || [];
        const promises = [];

        for (const member of party) {
            if (member && member.name) {
                promises.push(this.loadSkillData(member.name));
            }
        }

        await Promise.all(promises);
    }

    /**
     * Load skill data for a specific character
     */
    async loadSkillData(charName) {
        if (!charName || charName === '원더') return;

        // Skip if already loaded
        if (this.loadedSkillScripts.has(charName)) return;
        if (window.characterSkillsData?.[charName]) {
            this.loadedSkillScripts.add(charName);
            return;
        }

        // Initialize global object
        window.characterSkillsData = window.characterSkillsData || {};

        try {
            const scriptUrl = `${this.baseUrl}/data/characters/${encodeURIComponent(charName)}/skill.js`;

            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = scriptUrl;
                script.onload = () => {
                    this.loadedSkillScripts.add(charName);
                    resolve();
                };
                script.onerror = () => {
                    console.warn(`[TacticUI] Failed to load skill data for: ${charName}`);
                    resolve(); // Don't reject, just warn
                };
                document.head.appendChild(script);
            });
        } catch (err) {
            console.warn(`[TacticUI] Error loading skill data for: ${charName}`, err);
        }
    }

    getCurrentLang() {
        if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
            return window.I18nService.getCurrentLanguage();
        }
        return 'kr';
    }

    getI18nText(key, fallback = '') {
        if (typeof window.t === 'function') {
            try {
                const translated = window.t(key, fallback);
                if (translated && translated !== key) {
                    return translated;
                }
            } catch (_) {
                // fall through
            }
        }
        if (window.I18nService && typeof window.I18nService.t === 'function') {
            const translated = window.I18nService.t(key, fallback);
            if (translated && translated !== key) {
                return translated;
            }
        }
        return fallback || key;
    }

    getActionLabels() {
        return {
            skill1: this.getI18nText('action_skill1', '스킬1'),
            skill2: this.getI18nText('action_skill2', '스킬2'),
            skill3: this.getI18nText('action_skill3', '스킬3'),
            highlight: this.getI18nText('action_highlight', 'HIGHLIGHT'),
            theurgia: this.getI18nText('action_theurgia', '테우르기아'),
            gun: this.getI18nText('action_gun', '총격'),
            melee: this.getI18nText('action_melee', '근접'),
            guard: this.getI18nText('action_guard', '방어'),
            commonSkillGroup: this.getI18nText('action_commonSkillGroup', '공용 스킬'),
            oneMore: this.getI18nText('action_oneMore', 'ONE MORE'),
            item: this.getI18nText('action_item', '아이템'),
            specialSkill: this.getI18nText('action_specialSkill', '특수 스킬'),
            commonActions: this.getI18nText('action_common', '공통 액션'),
            supportSkill: this.getI18nText('action_support', '지원 스킬')
        };
    }

    getCharacterDisplayName(charKey, charData) {
        const lang = this.getCurrentLang();
        // KR: use charKey (short name like "렌", "안") - same as slot-name-text
        // EN: use CODENAME (charData.codename) or name_en
        // JP: use name_jp or fallback
        if (lang === 'kr') {
            return charKey;
        } else if (lang === 'en') {
            return charData.codename || charData.name_en || charData.name || charKey;
        } else if (lang === 'jp') {
            return charData.name_jp || charData.name || charKey;
        }
        return charKey;
    }

    getWonderDisplayName() {
        const lang = this.getCurrentLang();
        // Use i18n translation if available, otherwise fallback
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

    getSortedParty() {
        // Collect all active party members + Wonder, sorted by order
        const chars = [];

        // Add Wonder
        const wonderConfig = this.store.getWonderConfig();
        chars.push({
            type: 'wonder',
            name: '원더',
            displayName: this.getWonderDisplayName(),
            order: wonderConfig.order,
            slotIndex: -1
        });

        // Add party members
        // - Exclude elucidator (index 3): no turn order and must not appear as a tactic table column
        // - Exclude members with order '-'
        this.store.state.party.forEach((member, idx) => {
            if (idx === 3) return;
            if (member && member.order && member.order !== '-') {
                const charData = (window.characterData || {})[member.name] || {};
                const parsedOrder = parseInt(member.order);
                if (!Number.isFinite(parsedOrder)) return;

                chars.push({
                    type: 'party',
                    name: member.name,
                    displayName: this.getCharacterDisplayName(member.name, charData),
                    order: parsedOrder,
                    slotIndex: idx
                });
            }
        });

        // Sort by order
        chars.sort((a, b) => a.order - b.order);

        return chars;
    }

    getLocalizedActionName(actionName) {
        if (!actionName) return '';

        const labels = this.getActionLabels();

        const valueToLabel = {
            '스킬1': labels.skill1,
            'Skill1': labels.skill1,
            'スキル1': labels.skill1,
            '스킬2': labels.skill2,
            'Skill2': labels.skill2,
            'スキル2': labels.skill2,
            '스킬3': labels.skill3,
            'Skill3': labels.skill3,
            'スキル3': labels.skill3,
            'HIGHLIGHT': labels.highlight,
            'Theurgia': labels.theurgia,
            'Theurgy': labels.theurgia,
            '테우르기아': labels.theurgia,
            'テウルギア': labels.theurgia,
            '총격': labels.gun,
            'Gunshot': labels.gun,
            '銃撃': labels.gun,
            '射撃': labels.gun,
            '근접': labels.melee,
            'Melee': labels.melee,
            '近接攻撃': labels.melee,
            '방어': labels.guard,
            'Defense': labels.guard,
            'ガード': labels.guard,
            '防御': labels.guard,
            '특수 스킬': labels.specialSkill,
            'Special Skill': labels.specialSkill,
            'スペシャルスキル': labels.specialSkill,
            '지원 스킬': labels.supportSkill,
            'Support Skill': labels.supportSkill,
            'サポートスキル': labels.supportSkill,
            'ONE MORE': labels.oneMore,
            '1more': labels.oneMore,
            '아이템': labels.item,
            'Item': labels.item,
            'アイテム': labels.item
        };

        // Special handling for HIGHLIGHT2 (J&C's second highlight)
        if (actionName === 'HIGHLIGHT2') {
            return `${labels.highlight} 2`;
        }

        if (Object.prototype.hasOwnProperty.call(valueToLabel, actionName)) {
            return valueToLabel[actionName];
        }

        // Check for Skill N pattern
        const skillMatch = actionName.match(/^(?:스킬|Skill|スキル)\s?(\d+)$/i);
        if (skillMatch) {
            const num = parseInt(skillMatch[1]);
            if (num === 1) return labels.skill1;
            if (num === 2) return labels.skill2;
            if (num === 3) return labels.skill3;
        }

        return actionName;
    }

    getActionPromptText() {
        if (window.I18nService && window.I18nService.t) {
            return window.I18nService.t('addDefaultPatternPrompt', 'Add default pattern?');
        }
        return '기본 패턴을 추가하시겠습니까?';
    }

    renderHeaders() {
        const sortedChars = this.getSortedParty();
        this.sortedChars = sortedChars;

        // Hide the header row completely - character headers are now in each cell
        if (this.tableHeader) {
            this.tableHeader.style.display = 'none';
        }
    }

    // Helper to convert hex color to rgba
    hexToRgba(hex, alpha = 0.15) {
        if (!hex) return 'transparent';
        const raw = String(hex).trim();
        if (/^#([0-9a-f]{3}){1,2}$/i.test(raw)) {
            const hexVal = raw.slice(1);
            const full = hexVal.length === 3 ? hexVal.split('').map(c => c + c).join('') : hexVal;
            const num = parseInt(full, 16);
            const r = (num >> 16) & 255;
            const g = (num >> 8) & 255;
            const b = num & 255;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return 'transparent';
    }

    renderTurns() {
        this.tableBody.innerHTML = '';

        const turns = this.store.state.turns;
        const sortedChars = this.sortedChars.length > 0 ? this.sortedChars : this.getSortedParty();

        // Create/update colgroup for fixed column widths
        const table = this.tableBody.closest('table');
        if (table) {
            let colgroup = table.querySelector('colgroup');
            if (!colgroup) {
                colgroup = document.createElement('colgroup');
                table.insertBefore(colgroup, table.firstChild);
            }
            colgroup.innerHTML = '';
            // Turn column
            const colTurn = document.createElement('col');
            colTurn.style.width = '48px';
            colTurn.style.minWidth = '48px';
            colgroup.appendChild(colTurn);
            // Character columns - equal width
            const charColWidth = `${(100 / sortedChars.length).toFixed(2)}%`;
            sortedChars.forEach(() => {
                const col = document.createElement('col');
                col.style.width = charColWidth;
                colgroup.appendChild(col);
            });
        }

        if (turns.length === 0) {
            // Show empty state
            const tr = document.createElement('tr');
            tr.className = 'empty-state-row';
            tr.innerHTML = `
                <td colspan="${sortedChars.length + 1}" class="empty-state">
                    <div class="empty-state-content">
                        <span data-i18n="noTurns">아직 턴이 없습니다. "+ 턴 추가" 버튼을 클릭하세요.</span>
                    </div>
                </td>
            `;
            this.tableBody.appendChild(tr);
            return;
        }

        // Update sortedChars with character data for color
        sortedChars.forEach(char => {
            const charData = char.type === 'wonder'
                ? (window.characterData || {})['원더'] || {}
                : (window.characterData || {})[char.name] || {};
            char.color = charData.color || null;
        });

        const getT = (k, f) => (window.I18nService && window.I18nService.t ? window.I18nService.t(k, f) : (f || k));

        turns.forEach((turn, turnIdx) => {
            const tr = document.createElement('tr');
            tr.dataset.turnIndex = turnIdx;
            tr.className = 'turn-row';

            // Turn number cell
            const tdTurn = document.createElement('td');
            tdTurn.className = 'col-turn';
            tdTurn.innerHTML = `
                <div class="turn-info">
                    <div class="turn-drag-handle" title="${getT('desc_drag_reorder', '드래그하여 순서 변경')}">
                        <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                            <circle cx="2" cy="2" r="1.5"/>
                            <circle cx="8" cy="2" r="1.5"/>
                            <circle cx="2" cy="7" r="1.5"/>
                            <circle cx="8" cy="7" r="1.5"/>
                            <circle cx="2" cy="12" r="1.5"/>
                            <circle cx="8" cy="12" r="1.5"/>
                        </svg>
                    </div>
                    <span class="turn-number">${turn.turn}</span>
                    <div class="turn-actions">
                        <button class="btn-turn-action btn-duplicate-turn" data-turn-index="${turnIdx}" title="${getT('desc_duplicate_turn', '턴 복제')}">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        </button>
                        <button class="btn-turn-action btn-remove-turn" data-turn-index="${turnIdx}" title="${getT('desc_remove_turn', '턴 삭제')}">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            tr.appendChild(tdTurn);

            // Setup turn drag & drop
            this.setupTurnDragDrop(tr, turnIdx);

            // Bind turn actions (only work in edit mode)
            // Use DOM-based index lookup for safety
            tdTurn.querySelector('.btn-remove-turn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.isEditMode()) return;
                
                // Get actual index from DOM
                const allRows = Array.from(this.tableBody.querySelectorAll('.turn-row'));
                const actualIdx = allRows.indexOf(tr);
                if (actualIdx === -1) return;
                
                const t = (key) => window.I18nService ? window.I18nService.t(key) : key;
                const confirmMsg = t('confirmDeleteTurn') || '이 턴을 삭제하시겠습니까?';
                if (confirm(confirmMsg)) {
                    this.store.removeTurn(actualIdx);
                }
            });

            tdTurn.querySelector('.btn-duplicate-turn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.isEditMode()) return;
                
                // Get actual index from DOM
                const allRows = Array.from(this.tableBody.querySelectorAll('.turn-row'));
                const actualIdx = allRows.indexOf(tr);
                if (actualIdx === -1) return;
                
                this.store.duplicateTurn(actualIdx);
            });

            // Character columns
            sortedChars.forEach(char => {
                // For wonder, use 'mystery' as column key; for others, use order
                const colKey = char.type === 'wonder' ? 'mystery' : String(char.order);
                const td = document.createElement('td');
                td.className = 'tactic-cell';
                td.dataset.turnIndex = turnIdx;
                td.dataset.columnKey = colKey;

                // Get character color for cell header
                const charData = char.type === 'wonder'
                    ? (window.characterData || {})['원더'] || {}
                    : (window.characterData || {})[char.name] || {};
                const charColor = charData.color || null;

                // Apply character color as CSS variable
                if (charColor) {
                    td.style.setProperty('--cell-char-color', charColor);
                }

                // Cell header with character info
                const cellHeader = document.createElement('div');
                cellHeader.className = 'cell-char-header';

                const imgPath = char.type === 'wonder'
                    ? `${this.baseUrl}/assets/img/tier/원더.webp`
                    : `${this.baseUrl}/assets/img/tier/${char.name}.webp`;

                cellHeader.innerHTML = `
                    <img src="${imgPath}" alt="${char.displayName}"
                         onerror="this.style.display='none'"
                         class="cell-char-img">
                    <span class="cell-char-name">${char.displayName}</span>
                `;

                // Apply color tint to header
                if (charColor) {
                    cellHeader.style.background = this.hexToRgba(charColor, 0.07);
                    cellHeader.style.borderBottom = `2px solid ${this.hexToRgba(charColor, 0.5)}`;
                }

                // Auto-Action Prompt (only in first turn) - now handled by AutoActionPrompt module
                if (turnIdx === 0) {
                    this.autoActionPrompt.checkAndShowColumnPrompt(cellHeader, char, colKey);
                }

                td.appendChild(cellHeader);

                // Elucidator prompt check (only on first turn, first column - regardless of order)
                if (turnIdx === 0 && sortedChars.indexOf(char) === 0) {
                    this.autoActionPrompt.checkAndShowElucidatorPrompt(td);
                }

                // Get actions for this column
                const actions = turn.columns[colKey] || [];

                // Actions list
                const actionList = document.createElement('div');
                actionList.className = 'action-list';

                actions.forEach((action, actionIdx) => {
                    const actionItem = this.createActionItem(action, turnIdx, colKey, actionIdx, char);
                    actionList.appendChild(actionItem);
                });

                td.appendChild(actionList);

                // Add action button (only works in edit mode)
                const btnAdd = document.createElement('button');
                btnAdd.className = 'btn-add-action';
                btnAdd.textContent = '+';
                btnAdd.addEventListener('click', () => {
                    if (!this.isEditMode()) return;
                    const defaultAction = this.getDefaultActionForColumn(char);
                    this.store.addAction(turnIdx, colKey, defaultAction);
                });
                td.appendChild(btnAdd);

                // Setup drop zone for this cell
                this.setupCellDropZone(td, actionList, turnIdx, colKey);

                tr.appendChild(td);
            });

            this.tableBody.appendChild(tr);
        });
    }

    setupCellDropZone(cell, actionList, turnIdx, colKey) {
        cell.addEventListener('dragover', (e) => {
            if (!this._draggedAction || !this.isEditMode()) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            cell.classList.add('drag-over');

            const { turnIdx: fromTurnIdx, colKey: fromColKey, actionIdx: fromActionIdx } = this._draggedAction;
            const isSameCell = fromTurnIdx === turnIdx && fromColKey === colKey;

            // Get ALL action items (including the dragging one for proper index calculation)
            const allActionItems = Array.from(actionList.querySelectorAll('.action-item'));
            const mouseY = e.clientY;

            // Remove existing indicators
            actionList.querySelectorAll('.action-drop-indicator').forEach(el => el.remove());

            // Find insert position based on all items
            let insertBeforeIdx = allActionItems.length;
            for (let i = 0; i < allActionItems.length; i++) {
                const item = allActionItems[i];
                const rect = item.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                if (mouseY < midY) {
                    insertBeforeIdx = i;
                    break;
                }
            }

            // Don't show indicator at current position if same cell
            if (isSameCell && (insertBeforeIdx === fromActionIdx || insertBeforeIdx === fromActionIdx + 1)) {
                return;
            }

            // Add drop indicator
            const indicator = document.createElement('div');
            indicator.className = 'action-drop-indicator';
            if (insertBeforeIdx < allActionItems.length) {
                actionList.insertBefore(indicator, allActionItems[insertBeforeIdx]);
            } else {
                actionList.appendChild(indicator);
            }
        });

        cell.addEventListener('dragleave', (e) => {
            // Only remove if leaving the cell entirely
            if (!cell.contains(e.relatedTarget)) {
                cell.classList.remove('drag-over');
                actionList.querySelectorAll('.action-drop-indicator').forEach(el => el.remove());
            }
        });

        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            actionList.querySelectorAll('.action-drop-indicator').forEach(el => el.remove());

            if (!this._draggedAction || !this.isEditMode()) return;

            const { turnIdx: fromTurnIdx, colKey: fromColKey, actionIdx: fromActionIdx } = this._draggedAction;
            const isSameCell = fromTurnIdx === turnIdx && fromColKey === colKey;

            // Get ALL action items for proper index calculation
            const allActionItems = Array.from(actionList.querySelectorAll('.action-item'));
            const mouseY = e.clientY;
            let toActionIdx = allActionItems.length; // Default: end of list

            for (let i = 0; i < allActionItems.length; i++) {
                const rect = allActionItems[i].getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                if (mouseY < midY) {
                    toActionIdx = i;
                    break;
                }
            }

            // Skip if dropping at the same position
            if (isSameCell && (toActionIdx === fromActionIdx || toActionIdx === fromActionIdx + 1)) {
                return;
            }

            // Perform the move (store handles index adjustment for same-cell moves)
            this.store.moveActionTo(fromTurnIdx, fromColKey, fromActionIdx, turnIdx, colKey, toActionIdx);
        });
    }

    setupTurnDragDrop(row, turnIdx) {
        const dragHandle = row.querySelector('.turn-drag-handle');
        if (!dragHandle) return;

        row.draggable = false;

        dragHandle.addEventListener('mousedown', () => {
            if (this.isEditMode()) {
                row.draggable = true;
            }
        });

        row.addEventListener('dragstart', (e) => {
            if (!this.isEditMode()) {
                e.preventDefault();
                return;
            }
            
            // Get actual index from DOM at drag start
            const allRows = Array.from(this.tableBody.querySelectorAll('.turn-row'));
            const actualIdx = allRows.indexOf(row);
            if (actualIdx === -1) {
                e.preventDefault();
                return;
            }
            
            row.classList.add('dragging-turn');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'turn', turnIdx: actualIdx }));
            this._draggedTurn = { turnIdx: actualIdx, element: row };
        });

        row.addEventListener('dragend', () => {
            row.draggable = false;
            row.classList.remove('dragging-turn');
            this._draggedTurn = null;
            document.querySelectorAll('.turn-drop-indicator').forEach(el => el.remove());
            document.querySelectorAll('.turn-row.drag-over-turn').forEach(el => el.classList.remove('drag-over-turn'));
        });

        row.addEventListener('dragover', (e) => {
            // Only show turn drag guide when dragging a turn, not an action
            if (!this._draggedTurn || this._draggedAction || !this.isEditMode()) return;
            
            // Check if dragging over self using DOM element reference
            if (this._draggedTurn.element === row) return;
            
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            // Remove existing indicators
            document.querySelectorAll('.turn-drop-indicator').forEach(el => el.remove());
            document.querySelectorAll('.turn-row.drag-over-turn').forEach(el => el.classList.remove('drag-over-turn'));

            const rect = row.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            const indicator = document.createElement('tr');
            indicator.className = 'turn-drop-indicator';
            indicator.innerHTML = '<td colspan="10"><div class="turn-drop-line"></div></td>';

            if (e.clientY < midY) {
                row.parentNode.insertBefore(indicator, row);
            } else {
                row.parentNode.insertBefore(indicator, row.nextSibling);
            }
        });

        row.addEventListener('drop', (e) => {
            e.preventDefault();
            document.querySelectorAll('.turn-drop-indicator').forEach(el => el.remove());

            if (!this._draggedTurn || !this.isEditMode()) return;

            const fromIdx = this._draggedTurn.turnIdx;
            
            // Get actual current index from DOM instead of relying on closure
            const allRows = Array.from(this.tableBody.querySelectorAll('.turn-row'));
            const currentRowIdx = allRows.indexOf(row);
            if (currentRowIdx === -1) return;
            
            const rect = row.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            const dropBelow = e.clientY >= midY;
            
            // Calculate target index based on drop position
            let toIdx;
            if (dropBelow) {
                // Insert after this row
                toIdx = currentRowIdx + 1;
            } else {
                // Insert before this row
                toIdx = currentRowIdx;
            }
            
            // Adjust for the removal of the dragged item
            if (fromIdx < toIdx) {
                toIdx = toIdx - 1;
            }
            
            // Only move if actually changing position
            if (fromIdx !== toIdx) {
                this.store.moveTurn(fromIdx, toIdx);
            }
        });
    }

    createCustomDropdown(options, initialValue, onChange) {
        const container = document.createElement('div');
        container.className = 'custom-select-container';

        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';

        const triggerVal = document.createElement('div');
        triggerVal.className = 'custom-select-val';

        const triggerIcon = document.createElement('img');
        triggerIcon.className = 'custom-select-icon';
        triggerIcon.style.display = 'none';

        const triggerText = document.createElement('span');
        triggerText.className = 'custom-select-text';

        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        arrow.setAttribute('width', '12');
        arrow.setAttribute('height', '12');
        arrow.setAttribute('viewBox', '0 0 24 24');
        arrow.setAttribute('fill', 'none');
        arrow.setAttribute('stroke', 'currentColor');
        arrow.setAttribute('stroke-width', '2');
        arrow.setAttribute('stroke-linecap', 'round');
        arrow.setAttribute('stroke-linejoin', 'round');
        arrow.setAttribute('class', 'custom-select-arrow');
        arrow.innerHTML = '<path d="m6 9 6 6 6-6"/>';

        triggerVal.appendChild(triggerIcon);
        triggerVal.appendChild(triggerText);
        trigger.appendChild(triggerVal);
        trigger.appendChild(arrow);
        container.appendChild(trigger);

        const menu = document.createElement('div');
        menu.className = 'custom-select-options';
        container.appendChild(menu);

        let currentValue = initialValue;
        let currentOptions = options;

        const updateTrigger = () => {
            const selectedOpt = currentOptions.find(o => o.value === currentValue)
                || (currentValue ? { label: currentValue, value: currentValue } : currentOptions[0])
                || { label: '-', value: '' };

            triggerText.textContent = selectedOpt.label;
            if (selectedOpt.image) {
                triggerIcon.src = selectedOpt.image;
                triggerIcon.style.display = 'block';
            } else {
                triggerIcon.style.display = 'none';
            }
            if (currentValue === selectedOpt.value) {
                trigger.classList.add('has-value');
            }
        };

        const renderOptions = () => {
            menu.innerHTML = '';
            currentOptions.forEach(opt => {
                if (opt.isHeader) {
                    const header = document.createElement('div');
                    header.style.padding = '4px 8px';
                    header.style.fontSize = '10px';
                    header.style.color = '#888';
                    header.style.background = 'rgba(0,0,0,0.2)';
                    header.textContent = opt.label;
                    menu.appendChild(header);
                    return;
                }

                const item = document.createElement('div');
                item.className = 'custom-option';
                if (opt.value === currentValue) item.classList.add('selected');

                if (opt.image) {
                    const icon = document.createElement('img');
                    icon.src = opt.image;
                    icon.className = 'custom-option-icon';
                    icon.onerror = function () { this.style.display = 'none'; };
                    item.appendChild(icon);
                }

                const text = document.createElement('span');
                text.textContent = opt.label;
                item.appendChild(text);

                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentValue = opt.value;
                    updateTrigger();
                    menu.classList.remove('show');
                    onChange(opt.value);
                });
                menu.appendChild(item);
            });
        };

        updateTrigger();
        renderOptions();

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!document.body.classList.contains('tactic-edit-mode')) return;

            document.querySelectorAll('.custom-select-options.show').forEach(el => {
                if (el !== menu) el.classList.remove('show');
            });
            menu.classList.toggle('show');

            // Adjust position if overflowing bottom of screen?
            // For now CSS scrolling max-height handles it.
        });

        // Close on outside click is handled by global listener in createActionItem or main setup...
        // ACTUALLY, we should add a global listener once or use the one from modal?
        // Let's add a self-cleaning listener.
        // Close handler is now global in constructor to prevent leaks
        // container._cleanup no longer needed

        return {
            container,
            updateOptions: (newOpts) => {
                currentOptions = newOpts;
                renderOptions();
                updateTrigger();
            },
            setValue: (val) => {
                currentValue = val;
                updateTrigger();
                renderOptions(); // to update selected class
            }
        };
    }

    /**
     * Get J&C skill mapping based on role
     * J&C has 4 base skills (skill1-4), and each role uses 2 of them as skill1/skill2
     * Role mappings:
     * - 구원: skill1, skill2
     * - 우월: skill1, skill3
     * - 지배: skill1, skill4
     * - 굴복: skill2, skill4
     * - 방위: skill2, skill3
     * - 반항: skill3, skill4
     */
    getJnCSkillMapping(role) {
        const roleMap = {
            '구원': ['skill1', 'skill2'],
            '우월': ['skill1', 'skill3'],
            '지배': ['skill1', 'skill4'],
            '굴복': ['skill2', 'skill4'],
            '방위': ['skill2', 'skill3'],
            '반항': ['skill3', 'skill4']
        };
        return roleMap[role] || ['skill1', 'skill3']; // Default to 우월
    }

    /**
     * Get J&C role from party data
     */
    getJnCRole(charName) {
        if (charName !== 'J&C') return null;

        const party = this.store.state.party || [];
        for (const member of party) {
            if (member && member.name === 'J&C') {
                return member.role || '우월';
            }
        }
        return '우월';
    }

    getSkillElementIcon(charName, skillKey, role = null) {
        // Get element icon for a character's skill
        const skillsData = window.characterSkillsData?.[charName];
        if (!skillsData) return null;

        // J&C special handling
        if (charName === 'J&C') {
            const jncRole = role || this.getJnCRole(charName);
            const skillMapping = this.getJnCSkillMapping(jncRole);

            if (skillKey === 'skill1') {
                // Use first mapped skill
                const mappedSkill = skillsData[skillMapping[0]];
                if (!mappedSkill?.element) return null;
                return `${this.baseUrl}/assets/img/skill-element/${mappedSkill.element}.png`;
            } else if (skillKey === 'skill2') {
                // Use second mapped skill
                const mappedSkill = skillsData[skillMapping[1]];
                if (!mappedSkill?.element) return null;
                return `${this.baseUrl}/assets/img/skill-element/${mappedSkill.element}.png`;
            } else if (skillKey === 'skill3') {
                // J&C action dropdown uses "스킬3" slot; use skill5 icon
                const mappedSkill = skillsData.skill5;
                if (!mappedSkill?.element) return null;
                return `${this.baseUrl}/assets/img/skill-element/${mappedSkill.element}.png`;
            } else if (skillKey === 'skill_highlight') {
                // J&C has 2 highlights, return first one's element (same as skill1)
                const mappedSkill = skillsData[skillMapping[0]];
                if (!mappedSkill?.element) return null;
                return `${this.baseUrl}/assets/img/skill-element/${mappedSkill.element}.png`;
            } else if (skillKey === 'skill_highlight2') {
                // Second highlight element (same as skill2)
                const mappedSkill = skillsData[skillMapping[1]];
                if (!mappedSkill?.element) return null;
                return `${this.baseUrl}/assets/img/skill-element/${mappedSkill.element}.png`;
            }
        }

        const skillData = skillsData[skillKey];
        if (!skillData?.element) return null;

        return `${this.baseUrl}/assets/img/skill-element/${skillData.element}.png`;
    }

    getPersonaSkillIcon(skillName) {
        // Get icon for a persona skill from personaSkillList
        const skillData = window.personaSkillList?.[skillName];
        if (!skillData?.icon) return null;

        const lang = (window.DataLoader && typeof window.DataLoader.getCurrentLang === 'function')
            ? window.DataLoader.getCurrentLang()
            : 'kr';
        const iconKey = (lang === 'en' || lang === 'jp')
            ? (skillData.icon_gl || skillData.icon)
            : skillData.icon;
        if (!iconKey) return null;
        return `${this.baseUrl}/assets/img/skill-element/${iconKey}.png`;
    }

    /**
     * Get character skill tooltip for tactic board actions (non-edit mode)
     * Maps action values (스킬1-3, HIGHLIGHT, HIGHLIGHT2, Theurgia) to actual skill data
     * Extracts 2nd and 4th values from 4-split numbers (LV10+5 / LV13+5)
     */
    getCharacterSkillTooltip(charName, actionValue) {
        if (!charName || !actionValue) return '';

        // Only handle character skill actions
        const skillActionMap = {
            '스킬1': 'skill1',
            '스킬2': 'skill2',
            '스킬3': 'skill3',
            'HIGHLIGHT': 'skill_highlight',
            'HIGHLIGHT2': 'skill_highlight2',
            'Theurgia': 'skill_highlight',
            '테우르기아': 'skill_highlight'
        };

        const baseKey = skillActionMap[actionValue];
        if (!baseKey) return '';

        const lang = this.getCurrentLang();

        // Get skill data source based on language
        let skillsData;
        if (lang === 'en' && window.enCharacterSkillsData?.[charName]) {
            skillsData = window.enCharacterSkillsData[charName];
        } else if (lang === 'jp' && window.jpCharacterSkillsData?.[charName]) {
            skillsData = window.jpCharacterSkillsData[charName];
        } else {
            skillsData = window.characterSkillsData?.[charName];
        }
        if (!skillsData) return '';

        // Resolve actual skill key (J&C special handling)
        let actualKey = baseKey;
        if (charName === 'J&C') {
            const jncRole = this.getJnCRole(charName);
            const skillMapping = this.getJnCSkillMapping(jncRole);

            if (baseKey === 'skill1') {
                actualKey = skillMapping[0]; // role-mapped first skill
            } else if (baseKey === 'skill2') {
                actualKey = skillMapping[1]; // role-mapped second skill
            } else if (baseKey === 'skill3') {
                actualKey = 'skill5'; // always skill5
            } else if (baseKey === 'skill_highlight2') {
                actualKey = 'skill_highlight'; // J&C has single skill_highlight for both
            }
        }

        const skillData = skillsData[actualKey];
        if (!skillData?.description) return '';

        let desc = skillData.description;

        // J&C: filter highlight/skill5 description by selected role's persona pair
        if (charName === 'J&C' && (actualKey === 'skill_highlight' || actualKey === 'skill5')) {
            desc = this.filterJnCDescription(desc, actualKey, lang);
        }

        // Extract 2nd and 4th values from 4-split numbers (A/B/C/D → B/D)
        const fourSplitReplace = /(\d+(?:\.\d+)?%?)(?:\s*\/\s*(\d+(?:\.\d+)?%?)){3}/g;
        desc = desc.replace(fourSplitReplace, (match) => {
            const parts = match.split('/').map(x => x.trim());
            if (parts.length >= 4) {
                return parts[1] + '/' + parts[3];
            }
            return match;
        });

        // Highlight numbers
        desc = desc.replace(/(\d+(?:\.\d+)?%?)/g, '<span class="tooltip-num">$1</span>');

        // Add skill name as title if available
        const skillName = skillData.name || '';
        const titleHtml = skillName ? `<b>${skillName}</b><br>` : '';

        // Newlines to <br>
        desc = desc.replace(/\n/g, '<br>');

        // Add LV note footer
        const lvNote = '<br><span style="opacity:0.6;font-size:0.85em">※ LV10+5 / LV13+5</span>';

        return titleHtml + desc + lvNote;
    }

    /**
     * Filter J&C highlight/skill5 description to show only sections matching the selected role
     */
    filterJnCDescription(desc, skillKey, lang) {
        const jncRole = this.getJnCRole('J&C');
        if (!jncRole) return desc;

        // Persona definitions: skill index → persona data
        const personas = [
            { id: 'skill1', mask: '장난과 천진의 페르소나', mask_en: 'Mask of Mischief & Innocence', mask_jp: '悪戯と無邪気の仮面', facade: '어설픔', facade_en: 'Facade of Mischief & Innocence', facade_jp: '相貌・悪戯と無邪気' },
            { id: 'skill2', mask: '헌신과 경고의 페르소나', mask_en: 'Mask of Service & Admonition', mask_jp: '奉仕と警告の仮面', facade: '가르침', facade_en: 'Facade of Service & Admonition', facade_jp: '相貌・奉仕と警告' },
            { id: 'skill3', mask: '부조리와 비합리의 페르소나', mask_en: 'Mask of Absurdity & Nonsense', mask_jp: '不条理と非合理の仮面', facade: '무질서', facade_en: 'Facade of Absurdity & Nonsense', facade_jp: '相貌・不条理と非合理' },
            { id: 'skill4', mask: '복과와 화근의 페르소나', mask_en: 'Mask of Luck & Loss', mask_jp: '福果と禍因の仮面', facade: '인과', facade_en: 'Facade of Luck & Loss', facade_jp: '相貌・福果と禍因' }
        ];

        // Get the 2 skill keys for this role
        const skillMapping = this.getJnCSkillMapping(jncRole);
        const keepSet = new Set(skillMapping); // e.g. {'skill1', 'skill3'} for 우월

        const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        if (skillKey === 'skill_highlight') {
            // Highlight: each section starts with mask label header
            // Build all headers for lookahead, then remove sections not in keepSet
            const allHeaders = personas.map(p => {
                if (lang === 'en') return escRe(p.mask_en + ':');
                if (lang === 'jp') return escRe('『' + p.mask_jp + '』：');
                return escRe('『' + p.mask + '』:');
            });
            const allHeadersPattern = allHeaders.join('|');

            personas.forEach((p, idx) => {
                if (keepSet.has(p.id)) return; // keep this section
                let header;
                if (lang === 'en') header = escRe(p.mask_en + ':');
                else if (lang === 'jp') header = escRe('『' + p.mask_jp + '』：');
                else header = escRe('『' + p.mask + '』:');

                const pattern = new RegExp(header + '[\\s\\S]*?(?=(' + allHeadersPattern + '|$))', 'g');
                desc = desc.replace(pattern, '');
            });
        } else if (skillKey === 'skill5') {
            // Skill5: combo sections use facade labels in pairs
            // Build all combo headers, then remove combos not matching the role pair
            const combos = [];
            for (let i = 0; i < personas.length; i++) {
                for (let j = i + 1; j < personas.length; j++) {
                    combos.push({ a: personas[i], b: personas[j] });
                }
            }

            const makeHeaders = (a, b) => {
                if (lang === 'en') {
                    return [
                        escRe(a.facade_en + ' + ' + b.facade_en + ':'),
                        escRe(b.facade_en + ' + ' + a.facade_en + ':')
                    ];
                } else if (lang === 'jp') {
                    return [
                        escRe('『' + a.facade_jp + '』＋『' + b.facade_jp + '』：'),
                        escRe('『' + b.facade_jp + '』＋『' + a.facade_jp + '』：')
                    ];
                }
                return [
                    escRe('『' + a.facade + '』+『' + b.facade + '』:'),
                    escRe('『' + b.facade + '』+『' + a.facade + '』:'),
                    escRe('『' + a.facade + '』＋『' + b.facade + '』:'),
                    escRe('『' + b.facade + '』＋『' + a.facade + '』:')
                ];
            };

            const allComboHeaders = combos.flatMap(c => makeHeaders(c.a, c.b));
            const allComboPattern = allComboHeaders.join('|');

            combos.forEach(({ a, b }) => {
                const isKeep = keepSet.has(a.id) && keepSet.has(b.id);
                if (isKeep) return;

                const headers = makeHeaders(a, b);
                headers.forEach(header => {
                    const pattern = new RegExp(header + '[\\s\\S]*?(?=(' + allComboPattern + '|$))', 'g');
                    desc = desc.replace(pattern, '');
                });
            });
        }

        // Clean up multiple consecutive newlines
        desc = desc.replace(/\n{3,}/g, '\n\n');

        return desc;
    }

    /**
     * Get persona skill tooltip for wonder actions in tactic board
     * Reuses the same data sources as WonderUI.getSkillTooltip()
     */
    getPersonaSkillTooltipForAction(skillName, personaName) {
        if (!skillName) return '';

        const lang = this.getCurrentLang();
        const highlightNums = (text) => text.replace(/(\d+(?:\.\d+)?%?)/g, '<span class="tooltip-num">$1</span>');
        const lvNote = '<br><span style="opacity:0.6;font-size:0.85em">※ LV6 / LV7 / LV8</span>';

        // 1. Check if it's a unique skill from persona data
        if (personaName) {
            const store = window.personaFiles || {};
            const personaData = store[personaName];
            if (personaData && personaData.uniqueSkill) {
                const unique = personaData.uniqueSkill;
                const uniqueNameKr = unique.name || '';
                const uniqueNameEn = unique.name_en || '';
                const uniqueNameJp = unique.name_jp || '';

                if (skillName === uniqueNameKr || skillName === uniqueNameEn || skillName === uniqueNameJp) {
                    let desc = '';
                    if (lang === 'en' && unique.desc_en) desc = unique.desc_en;
                    else if (lang === 'jp' && unique.desc_jp) desc = unique.desc_jp;
                    else desc = unique.desc || '';

                    if (desc) return highlightNums(desc) + lvNote;
                }
            }
        }

        // 2. Check personaSkillList
        const skillData = (window.personaSkillList || {})[skillName];
        if (skillData) {
            let desc = '';
            if (lang === 'en' && skillData.description_en) desc = skillData.description_en;
            else if (lang === 'jp' && skillData.description_jp) desc = skillData.description_jp;
            else desc = skillData.description || '';

            if (desc) return highlightNums(desc) + lvNote;
        }

        return '';
    }

    getActionOptions(char) {
        const options = [];
        options.push({ label: '-', value: '' });

        if (!char) return options;

        const lang = DataLoader.getCurrentLang();
        const labels = this.getActionLabels();

        if (char.type === 'wonder') {
            const wonderConfig = this.store.state.wonder;
            (wonderConfig.personas || []).forEach((p, idx) => {
                const pName = p ? p.name : '';
                if (pName) {
                    const dispPName = (window.DataLoader && window.DataLoader.getPersonaDisplayName)
                        ? window.DataLoader.getPersonaDisplayName(pName)
                        : pName;
                    options.push({ label: `P${idx + 1}: ${dispPName}`, isHeader: true });

                    const personaData = (window.personaFiles || {})[pName] || null;
                    const uniqueSkill = personaData && personaData.uniqueSkill ? personaData.uniqueSkill : null;
                    const uniqueBaseName = uniqueSkill ? (uniqueSkill.name || '') : '';

                    (p.skills || []).filter(s => s).forEach(skill => {
                        let dispSkill = (window.DataLoader && window.DataLoader.getSkillDisplayName)
                            ? window.DataLoader.getSkillDisplayName(skill)
                            : skill;

                        const isUnique = !!(uniqueSkill && uniqueBaseName && (
                            skill === uniqueBaseName ||
                            (uniqueSkill.name_en && skill === uniqueSkill.name_en) ||
                            (uniqueSkill.name_jp && skill === uniqueSkill.name_jp)
                        ));

                        if (isUnique) {
                            if (lang === 'en') dispSkill = uniqueSkill.name_en || uniqueSkill.name || dispSkill;
                            else if (lang === 'jp') dispSkill = uniqueSkill.name_jp || uniqueSkill.name_en || uniqueSkill.name || dispSkill;
                            else dispSkill = uniqueSkill.name || dispSkill;
                        }

                        let skillIcon = null;
                        if (isUnique && uniqueSkill && uniqueSkill.icon && uniqueSkill.icon !== 'Default') {
                            skillIcon = `${this.baseUrl}/assets/img/skill-element/${encodeURIComponent(uniqueSkill.icon)}.png`;
                        }
                        skillIcon = skillIcon || this.getPersonaSkillIcon(skill);

                        options.push({ label: dispSkill, value: skill, image: skillIcon });
                    });
                }
            });

            // Special actions for Wonder - no Theurgia (Wonder is not persona3)
            options.push({ label: labels.commonSkillGroup, isHeader: true });
            options.push({ label: labels.specialSkill, value: '특수 스킬' });
            options.push({ label: labels.highlight, value: 'HIGHLIGHT' });
            options.push({ label: labels.gun, value: '총격' });
            options.push({ label: labels.melee, value: '근접' });
            options.push({ label: labels.guard, value: '방어' });
            options.push({ label: labels.oneMore, value: 'ONE MORE' });
            options.push({ label: labels.item, value: '아이템' });
        } else {
            // Character skills - 스킬1, 스킬2, 스킬3 with element icons
            const charName = char.name;
            const charData = (window.characterData || {})[char.name] || {};
            const isPersona3 = charData.persona3 === true;

            // J&C special handling - has 2 skills based on role, no skill3, and 2 HIGHLIGHTs
            if (charName === 'J&C') {
                const skill1Icon = this.getSkillElementIcon(charName, 'skill1');
                const skill2Icon = this.getSkillElementIcon(charName, 'skill2');
                const skill3Icon = this.getSkillElementIcon(charName, 'skill3');
                const highlight1Icon = this.getSkillElementIcon(charName, 'skill_highlight');
                const highlight2Icon = this.getSkillElementIcon(charName, 'skill_highlight2');

                options.push({ label: labels.skill1, value: '스킬1', image: skill1Icon });
                options.push({ label: labels.skill2, value: '스킬2', image: skill2Icon });
                options.push({ label: labels.skill3, value: '스킬3', image: skill3Icon });

                // Common actions
                options.push({ label: labels.commonSkillGroup, isHeader: true });
                options.push({ label: labels.specialSkill, value: '특수 스킬' });
                // J&C has 2 HIGHLIGHTs
                options.push({ label: `${labels.highlight} 1`, value: 'HIGHLIGHT', image: highlight1Icon });
                options.push({ label: `${labels.highlight} 2`, value: 'HIGHLIGHT2', image: highlight2Icon });
                options.push({ label: labels.gun, value: '총격' });
                options.push({ label: labels.melee, value: '근접' });
                options.push({ label: labels.guard, value: '방어' });
                options.push({ label: labels.oneMore, value: 'ONE MORE' });
                options.push({ label: labels.item, value: '아이템' });
            } else {
                const skill1Icon = this.getSkillElementIcon(charName, 'skill1');
                const skill2Icon = this.getSkillElementIcon(charName, 'skill2');
                const skill3Icon = this.getSkillElementIcon(charName, 'skill3');
                const highlightIcon = this.getSkillElementIcon(charName, 'skill_highlight');

                options.push({ label: labels.skill1, value: '스킬1', image: skill1Icon });
                options.push({ label: labels.skill2, value: '스킬2', image: skill2Icon });
                options.push({ label: labels.skill3, value: '스킬3', image: skill3Icon });

                // Common actions
                options.push({ label: labels.commonSkillGroup, isHeader: true });
                options.push({ label: labels.specialSkill, value: '특수 스킬' });
                if (isPersona3) {
                    options.push({ label: labels.theurgia, value: 'Theurgia', image: highlightIcon });
                    options.push({ label: labels.supportSkill, value: '지원 스킬' });
                } else {
                    options.push({ label: labels.highlight, value: 'HIGHLIGHT', image: highlightIcon });
                }
                options.push({ label: labels.gun, value: '총격' });
                options.push({ label: labels.melee, value: '근접' });
                options.push({ label: labels.guard, value: '방어' });
                options.push({ label: labels.oneMore, value: 'ONE MORE' });
                options.push({ label: labels.item, value: '아이템' });
            }
        }
        return options;
    }

    createActionItem(action, turnIdx, colKey, actionIdx, char) {
        const item = document.createElement('div');
        item.className = 'action-item';
        item.dataset.turnIndex = turnIdx;
        item.dataset.columnKey = colKey;
        item.dataset.actionIndex = actionIdx;

        const isNote = !!action.isNote || (!action.character && !action.action && !!action.memo);

        if (isNote) {
            const noteLabel = window.I18nService ? window.I18nService.t('noteAction', '메모') : '메모';
            const hasMemoNote = !!(action.memo);
            item.classList.add('note-action-item');
            item.innerHTML = `
                <div class="action-content-wrapper">
                    <div class="action-main-row">
                        <span class="action-name">${noteLabel}</span>
                    </div>
                </div>
                <div class="action-actions">
                    <button type="button" class="action-icon-btn ${hasMemoNote ? 'active' : ''}" data-action-btn="memo" title="${window.I18nService ? window.I18nService.t('memo') : '메모'}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button type="button" class="action-icon-btn" data-action-btn="duplicate" title="${window.I18nService ? window.I18nService.t('duplicate') || '복제' : '복제'}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                    </button>
                    <button type="button" class="action-icon-btn" data-action-btn="delete" title="${window.I18nService ? window.I18nService.t('delete') : '삭제'}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            `;

            // Memo section for note item - editable inline, toggleable
            const memoContainer = document.createElement('div');
            memoContainer.className = 'action-memo-container';

            // Initially hidden unless there's a memo
            if (!action.memo) {
                memoContainer.classList.add('hidden');
            }

            if (this.isEditMode()) {
                const memoInput = document.createElement('textarea');
                memoInput.className = 'action-memo-inline note-memo-input';
                memoInput.value = action.memo || '';
                memoInput.placeholder = window.I18nService ? window.I18nService.t('memoPlaceholder', '메모...') : '메모...';
                memoInput.rows = 1;

                // Auto-resize textarea
                const autoResize = () => {
                    memoInput.style.height = 'auto';
                    memoInput.style.height = memoInput.scrollHeight + 'px';
                };

                memoInput.addEventListener('input', autoResize);
                memoInput.addEventListener('change', (e) => {
                    this.store.updateAction(turnIdx, colKey, actionIdx, {
                        ...action,
                        memo: e.target.value
                    });
                });

                memoInput.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                memoContainer.appendChild(memoInput);
                item.appendChild(memoContainer);

                // Initial resize if there's content
                if (action.memo) setTimeout(autoResize, 0);
            } else if (action.memo) {
                const memo = document.createElement('div');
                memo.className = 'action-memo';
                memo.textContent = action.memo;
                memoContainer.classList.remove('hidden');
                memoContainer.appendChild(memo);
                item.appendChild(memoContainer);
            }

            item.querySelectorAll('button[data-action-btn]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!this.isEditMode()) return;
                    const kind = btn.dataset.actionBtn;
                    if (kind === 'memo') {
                        // Toggle memo container visibility
                        const isHidden = memoContainer.classList.contains('hidden');
                        memoContainer.classList.toggle('hidden');
                        btn.classList.toggle('active', isHidden);
                        
                        if (isHidden) {
                            // Opening memo - focus input
                            const input = memoContainer.querySelector('.action-memo-inline');
                            if (input) input.focus();
                        } else {
                            // Closing memo - clear the memo value in store
                            const input = memoContainer.querySelector('.action-memo-inline');
                            if (input) {
                                input.value = '';
                                this.store.updateAction(turnIdx, colKey, actionIdx, {
                                    ...action,
                                    memo: ''
                                });
                            }
                        }
                        return;
                    }
                    if (kind === 'duplicate') {
                        this.store.addAction(turnIdx, colKey, { ...action, isNote: true, character: '', action: '' }, actionIdx);
                        return;
                    }
                    if (kind === 'delete') {
                        this.store.removeAction(turnIdx, colKey, actionIdx);
                    }
                });
            });

            return item;
        }

        // Character color tint (if available)
        // Skip color if action's character matches the column header character
        const actorName = action.character || '';
        const headerCharName = char.type === 'wonder' ? '원더' : (char.name || '');
        const isSameAsHeader = actorName && actorName === headerCharName;

        if (!isSameAsHeader) {
            const actorData = (window.characterData && actorName) ? window.characterData[actorName] : null;
            const actorColor = actorData && actorData.color ? String(actorData.color) : '';
            if (actorColor) {
                item.style.setProperty('--actor-color', actorColor);
                const rgb = this.colorToRgb(actorColor);
                if (rgb) {
                    item.style.setProperty('--actor-color-tint', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`);
                    item.style.setProperty('--actor-color-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55)`);
                }
            }
        }

        const isEditMode = this.isEditMode();

        // Build action item with inline drag handle
        const hasMemo = !!(action.memo);
        item.innerHTML = `
            <div class="action-content-wrapper">
                <div class="action-drag-handle" title="${this.getI18nText('actionDragMoveTooltip', '드래그하여 이동')}">
                    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                        <circle cx="2" cy="2" r="1.5"/>
                        <circle cx="8" cy="2" r="1.5"/>
                        <circle cx="2" cy="7" r="1.5"/>
                        <circle cx="8" cy="7" r="1.5"/>
                        <circle cx="2" cy="12" r="1.5"/>
                        <circle cx="8" cy="12" r="1.5"/>
                    </svg>
                </div>
                <div class="action-main-row"></div>
            </div>
            <div class="action-actions">
                <button type="button" class="action-icon-btn ${hasMemo ? 'active' : ''}" data-action-btn="memo" title="${window.I18nService ? window.I18nService.t('memo') : '메모'}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button type="button" class="action-icon-btn" data-action-btn="duplicate" title="${window.I18nService ? window.I18nService.t('duplicate') || '복제' : '복제'}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                </button>
                <button type="button" class="action-icon-btn" data-action-btn="delete" title="${window.I18nService ? window.I18nService.t('delete') : '삭제'}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        `;

        // Setup drag handle
        const dragHandle = item.querySelector('.action-drag-handle');
        if (dragHandle) {
            item.draggable = false; // Only drag via handle

            dragHandle.addEventListener('mousedown', () => {
                if (this.isEditMode()) {
                    item.draggable = true;
                }
            });

            item.addEventListener('dragstart', (e) => {
                if (!this.isEditMode()) {
                    e.preventDefault();
                    return;
                }
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    turnIdx: turnIdx,
                    colKey: colKey,
                    actionIdx: actionIdx
                }));

                // Use transparent drag image to hide default browser preview
                const emptyImg = document.createElement('div');
                emptyImg.style.width = '1px';
                emptyImg.style.height = '1px';
                emptyImg.style.opacity = '0';
                document.body.appendChild(emptyImg);
                e.dataTransfer.setDragImage(emptyImg, 0, 0);
                requestAnimationFrame(() => emptyImg.remove());

                // Store reference for drop handling
                this._draggedAction = { turnIdx, colKey, actionIdx, element: item };

                // Add is-dragging class to table container for layout stability
                const tableContainer = document.querySelector('.tactic-table-container');
                if (tableContainer) {
                    tableContainer.classList.add('is-dragging');
                    // Set party count CSS variable for column width calculation
                    const partyCount = (this.store.state.party || []).filter(m => m).length + 1; // +1 for wonder
                    tableContainer.style.setProperty('--party-count', partyCount);
                }
            });

            item.addEventListener('dragend', () => {
                item.draggable = false;
                item.classList.remove('dragging');
                this._draggedAction = null;
                // Remove all drop indicators
                document.querySelectorAll('.action-drop-indicator').forEach(el => el.remove());
                document.querySelectorAll('.tactic-cell.drag-over').forEach(el => el.classList.remove('drag-over'));
                // Remove is-dragging class
                const tableContainer = document.querySelector('.tactic-table-container');
                if (tableContainer) tableContainer.classList.remove('is-dragging');
            });
        }

        const mainRow = item.querySelector('.action-main-row');
        // Always render dropdowns (styling handles view mode)
        if (true) {
            // 1. Prepare Data
            const partyNames = [];
            (this.store.state.party || []).forEach((m, idx) => {
                if (!m) return;
                partyNames.push(m.name);
            });
            const noteLabel = window.I18nService ? window.I18nService.t('noteAction', '메모') : '메모';
            const actorOptions = [
                { label: noteLabel, value: '__NOTE__', image: '' },
                { label: (window.I18nService ? window.I18nService.t('wonder') : '원더'), value: '원더', image: `${this.baseUrl}/assets/img/tier/원더.webp` }
            ];
            partyNames.forEach(n => {
                // Localized name
                const charData = (window.characterData || {})[n] || {};
                const dispName = this.getCharacterDisplayName(n, charData);
                actorOptions.push({ label: dispName, value: n, image: `${this.baseUrl}/assets/img/tier/${n}.webp` });
            });

            const initialActor = action.character || (char?.name || '원더');
            const initialPersona = action.wonderPersona || '';
            const initialActionVal = action.action || '';

            // 2. Define State Variables for this item closure
            let currentActor = initialActor;
            let currentPersona = initialPersona;
            let currentAction = initialActionVal;

            // Dropdown component refs (set after creation)
            let actorDD = null;
            let personaDD = null;
            let actionDD = null;

            // 3. Define Commit Function
            const commitStore = (a, p, act) => {
                // Keep local closure state in sync
                currentActor = a;
                currentPersona = p;
                currentAction = act;

                let pIndex = -1;
                if (a === '원더' && p) {
                    const personas = this.store.state?.wonder?.personas || [];
                    pIndex = personas.findIndex(x => x && x.name === p);
                }

                this.store.updateAction(turnIdx, colKey, actionIdx, {
                    character: a,
                    wonderPersona: p,
                    wonderPersonaIndex: pIndex,
                    action: act,
                    memo: action.memo // preserve existing memo
                });
            };

            // 4. Define Handlers
            const handleActorChange = (newActor) => {
                // Handle note selection
                if (newActor === '__NOTE__') {
                    this.store.updateAction(turnIdx, colKey, actionIdx, {
                        isNote: true,
                        character: '',
                        wonderPersona: '',
                        wonderPersonaIndex: -1,
                        action: '',
                        memo: action.memo || ''
                    });
                    return;
                }

                let newPersona = '';
                let newAction = '스킬1';

                if (newActor === '원더') {
                    const personas = (this.store.state.wonder?.personas || []).filter(p => p && p.name);
                    newPersona = personas[0]?.name || '';
                    newAction = '방어';
                }

                commitStore(newActor, newPersona, newAction);
            };

            const handlePersonaChange = (newP) => {
                // Smart Switch Logic
                // If the current action (currentAction) belongs to the OLD persona (currentPersona)
                // Switch it to the NEW persona's last skill (or default)
                let nextAction = currentAction;
                const oldPName = currentPersona;
                const newPName = newP;

                if (currentActor === '원더' && oldPName && newPName && oldPName !== newPName) {
                    const personas = this.store.state?.wonder?.personas || [];
                    const oldPData = personas.find(p => p && p.name === oldPName);
                    if (oldPData && oldPData.skills && oldPData.skills.includes(currentAction)) {
                        // It was a dependent skill. Switch to new persona's last skill (index 3)
                        const newPData = personas.find(p => p && p.name === newPName);
                        if (newPData && newPData.skills) {
                            // Use 4th skill (index 3) or 1st if empty? User said "bottom one" which usually means the last slot.
                            nextAction = newPData.skills[3] || newPData.skills[0] || '방어';
                        }
                    }
                }

                commitStore(currentActor, newP, nextAction);
            };

            const handleActionChange = (newA) => {
                // If Wonder: auto-switch persona based on selected persona skill
                if (currentActor === '원더' && newA) {
                    const personas = this.store.state?.wonder?.personas || [];
                    const matches = [];
                    personas.forEach((p, idx) => {
                        if (!p || !p.name) return;
                        if ((p.skills || []).includes(newA)) {
                            matches.push({ name: p.name, idx });
                        }
                    });

                    if (matches.length > 0) {
                        // Prefer keeping currentPersona if it also contains the skill
                        const keep = matches.find(m => m.name === currentPersona);
                        const chosen = keep || matches[0];
                        if (chosen && chosen.name && chosen.name !== currentPersona) {
                            commitStore(currentActor, chosen.name, newA);
                            // Sync persona dropdown UI immediately
                            if (personaDD && typeof personaDD.setValue === 'function') {
                                personaDD.setValue(chosen.name);
                            }
                            return;
                        }
                    }
                }

                commitStore(currentActor, currentPersona, newA);
            };

            // 5. Create Components

            // Actor Dropdown
            actorDD = this.createCustomDropdown(actorOptions, initialActor, handleActorChange);
            actorDD.container.classList.add('actor-dropdown');

            // Persona Dropdown
            const pOpts = (initialActor === '원더')
                ? (this.store.state.wonder?.personas || [])
                    .filter(p => p && p.name)
                    .map(p => {
                        const dispName = (window.DataLoader && window.DataLoader.getPersonaDisplayName)
                            ? window.DataLoader.getPersonaDisplayName(p.name)
                            : p.name;
                        return { label: dispName, value: p.name, image: `${this.baseUrl}/assets/img/persona/${p.name}.webp` };
                    })
                : [];

            personaDD = this.createCustomDropdown(pOpts, initialPersona, handlePersonaChange);
            personaDD.container.classList.add('persona-dropdown');
            // Visibility is controlled by CSS via .has-persona class on wrapper

            // Wrapper for actor + persona (fixed width for grid alignment)
            const actorPersonaWrapper = document.createElement('div');
            actorPersonaWrapper.className = 'actor-persona-wrapper';
            if (initialActor === '원더') {
                actorPersonaWrapper.classList.add('has-persona');
            }
            actorPersonaWrapper.appendChild(actorDD.container);
            actorPersonaWrapper.appendChild(personaDD.container);

            // Action Dropdown
            const charObj = (initialActor === '원더')
                ? { type: 'wonder', name: '원더' }
                : { type: 'party', name: initialActor };
            const actionOpts = this.getActionOptions(charObj);

            actionDD = this.createCustomDropdown(actionOpts, initialActionVal, handleActionChange);
            actionDD.container.classList.add('action-dropdown');

            // Non-edit mode: add skill tooltip on action dropdown
            if (!this.isEditMode()) {
                const triggerEl = actionDD.container.querySelector('.custom-select-val');
                if (triggerEl) {
                    let tooltip = '';
                    if (currentActor === '원더') {
                        tooltip = this.getPersonaSkillTooltipForAction(currentAction, currentPersona);
                    } else {
                        tooltip = this.getCharacterSkillTooltip(currentActor, currentAction);
                    }
                    if (tooltip) {
                        triggerEl.setAttribute('data-tooltip', tooltip);

                        // Bind floating cursor-tooltip events
                        const floating = document.getElementById('cursor-tooltip') || (() => {
                            const el = document.createElement('div');
                            el.id = 'cursor-tooltip';
                            el.className = 'cursor-tooltip';
                            document.body.appendChild(el);
                            return el;
                        })();
                        triggerEl.addEventListener('mouseenter', function () {
                            const content = this.getAttribute('data-tooltip');
                            if (content) { floating.innerHTML = content; floating.style.display = 'block'; }
                        });
                        triggerEl.addEventListener('mousemove', function (e) {
                            const offset = 16;
                            let x = e.clientX + offset, y = e.clientY + offset;
                            const vw = window.innerWidth, vh = window.innerHeight;
                            const ttW = floating.offsetWidth, ttH = floating.offsetHeight;
                            if (x + ttW + 8 > vw) x = e.clientX - ttW - offset;
                            if (y + ttH + 8 > vh) y = e.clientY - ttH - offset;
                            floating.style.left = x + 'px'; floating.style.top = y + 'px';
                        });
                        triggerEl.addEventListener('mouseleave', function () { floating.style.display = 'none'; });
                    }
                }
            }

            // 6. Append to DOM
            mainRow.appendChild(actorPersonaWrapper);
            mainRow.appendChild(actionDD.container);

        } else {
            // Non-edit mode: text display
            const actorImg = actorName
                ? (actorName === '원더'
                    ? `${this.baseUrl}/assets/img/tier/원더.webp`
                    : `${this.baseUrl}/assets/img/tier/${actorName}.webp`)
                : '';

            if (actorName) {
                const actorWrap = document.createElement('div');
                actorWrap.className = 'action-actor';
                if (actorImg) {
                    const img = document.createElement('img');
                    img.src = actorImg;
                    img.className = 'action-actor-icon';
                    img.alt = actorName;
                    img.onerror = function () { this.style.display = 'none'; };
                    actorWrap.appendChild(img);
                }
                const nameSpan = document.createElement('span');
                nameSpan.className = 'action-actor-name';
                // Use localized character name
                const actorData = (window.characterData || {})[actorName] || {};
                nameSpan.textContent = this.getCharacterDisplayName(actorName, actorData);
                actorWrap.appendChild(nameSpan);
                mainRow.appendChild(actorWrap);
            }

            if (actorName === '원더' && action.wonderPersona) {
                const personaWrap = document.createElement('div');
                personaWrap.className = 'action-persona wonder-persona-display';
                const personaImg = document.createElement('img');
                personaImg.src = `${this.baseUrl}/assets/img/persona/${action.wonderPersona}.webp`;
                personaImg.className = 'action-persona-icon';
                personaImg.alt = action.wonderPersona;
                personaImg.onerror = function () { this.style.display = 'none'; };
                personaWrap.appendChild(personaImg);
                const personaName = document.createElement('span');
                personaName.className = 'action-persona-name';
                personaName.textContent = action.wonderPersona;
                personaWrap.appendChild(personaName);
                mainRow.appendChild(personaWrap);
            }

            const actionName = action.action || '액션';
            const actionSpan = document.createElement('span');
            actionSpan.className = 'action-name';
            // Use localized action name
            actionSpan.textContent = this.getLocalizedActionName(actionName);
            mainRow.appendChild(actionSpan);
        }

        // Memo section - editable inline, toggleable
        const memoContainer = document.createElement('div');
        memoContainer.className = 'action-memo-container';

        // Initially hidden unless there's a memo
        if (!action.memo) {
            memoContainer.classList.add('hidden');
        }

        if (this.isEditMode()) {
            // Editable textarea in edit mode
            const memoInput = document.createElement('textarea');
            memoInput.className = 'action-memo-inline';
            memoInput.value = action.memo || '';
            memoInput.placeholder = window.I18nService ? window.I18nService.t('memoPlaceholder', '메모...') : '메모...';
            memoInput.rows = 1;

            // Auto-resize textarea
            const autoResize = () => {
                memoInput.style.height = 'auto';
                memoInput.style.height = memoInput.scrollHeight + 'px';
            };

            memoInput.addEventListener('input', autoResize);
            memoInput.addEventListener('change', (e) => {
                this.store.updateAction(turnIdx, colKey, actionIdx, {
                    ...action,
                    memo: e.target.value
                });
            });

            memoInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            memoContainer.appendChild(memoInput);
            item.appendChild(memoContainer);

            // Initial resize if there's content
            if (action.memo) setTimeout(autoResize, 0);
        } else if (action.memo) {
            // Read-only display in view mode
            const memo = document.createElement('div');
            memo.className = 'action-memo';
            memo.textContent = action.memo;
            memoContainer.classList.remove('hidden');
            item.appendChild(memoContainer);
            memoContainer.appendChild(memo);
        }

        // Action buttons (only work in edit mode)
        item.querySelectorAll('button[data-action-btn]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.isEditMode()) return;
                const kind = btn.dataset.actionBtn;
                if (kind === 'memo') {
                    // Toggle memo container visibility
                    const isHidden = memoContainer.classList.contains('hidden');
                    memoContainer.classList.toggle('hidden');
                    btn.classList.toggle('active', isHidden);
                    
                    if (isHidden) {
                        // Opening memo - focus input
                        const input = memoContainer.querySelector('.action-memo-inline');
                        if (input) input.focus();
                    } else {
                        // Closing memo - clear the memo value in store
                        const input = memoContainer.querySelector('.action-memo-inline');
                        if (input) {
                            input.value = '';
                            this.store.updateAction(turnIdx, colKey, actionIdx, {
                                ...action,
                                memo: ''
                            });
                        }
                    }
                    return;
                }
                if (kind === 'duplicate') {
                    this.store.addAction(turnIdx, colKey, { ...action }, actionIdx);
                    return;
                }
                if (kind === 'delete') {
                    this.store.removeAction(turnIdx, colKey, actionIdx);
                }
            });
        });

        return item;
    }

    getDefaultActionForColumn(char) {
        if (!char) {
            return { character: '', wonderPersona: '', wonderPersonaIndex: -1, action: '스킬1', memo: '' };
        }

        if (char.type === 'wonder') {
            const personas = (this.store.state.wonder?.personas || []).filter(p => p && p.name);
            const p0 = personas[0];
            if (!p0) {
                return { character: '원더', wonderPersona: '', wonderPersonaIndex: -1, action: '방어', memo: '' };
            }
            const idx = this.store.state.wonder.personas.findIndex(p => p && p.name === p0.name);
            const firstSkill = (p0.skills || []).find(s => s) || '';
            return {
                character: '원더',
                wonderPersona: p0.name,
                wonderPersonaIndex: idx,
                action: firstSkill || '방어',
                memo: ''
            };
        }

        return {
            character: char.name,
            wonderPersona: '',
            wonderPersonaIndex: -1,
            action: '스킬1',
            memo: ''
        };
    }

    createActionModal() {
        const modal = document.createElement('div');
        modal.id = 'actionModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-backdrop" data-close="actionModal"></div>
            <div class="modal-dialog" style="max-width: 400px;">
                    <div class="modal-header">
                    <h3>${window.I18nService ? window.I18nService.t('addAction') : '액션 추가'}</h3>
                    <button class="modal-close" data-close="actionModal">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="form-group">
                        <label>${window.I18nService ? window.I18nService.t('character') : '사용 캐릭터'}</label>
                        <select class="input-select character-select"></select>
                    </div>

                    <div class="form-group persona-group" style="display: none;">
                        <label>${window.I18nService ? window.I18nService.t('persona') : '페르소나'}</label>
                        <div class="target-dropdown persona-dropdown" style="display: block; width: 100%;">
                            <button type="button" class="target-dropdown-btn" style="width: 100%; justify-content: space-between;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <img class="selected-icon" src="" style="display: none; width: 24px; height: 24px; border-radius: 4px;">
                                    <span class="selected-text">-</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-chevron">
                                    <path d="m6 9 6 6 6-6"/>
                                </svg>
                            </button>
                            <div class="target-dropdown-menu" style="width: 100%;">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        <input type="hidden" class="persona-select-value">
                    </div>

                    <div class="form-group">
                        <label>${window.I18nService ? window.I18nService.t('action') : '액션/스킬'}</label>
                        <select class="input-select action-select">
                            <option value="">-</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>${window.I18nService ? window.I18nService.t('memo') : '메모'}</label>
                        <textarea class="input-text action-memo-input" rows="2" placeholder="${window.I18nService ? window.I18nService.t('memoPlaceholder') : '메모 입력...'}"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-danger btn-delete-action" style="margin-right: auto; display: none;">${window.I18nService ? window.I18nService.t('delete') : '삭제'}</button>
                    <button type="button" class="btn-secondary" data-close="actionModal">${window.I18nService ? window.I18nService.t('cancel') : '취소'}</button>
                    <button type="button" class="btn-primary btn-save-action">${window.I18nService ? window.I18nService.t('save') : '저장'}</button>
                </div>
            </div>
        `;

        // Dropdown toggle logic
        const dropdown = modal.querySelector('.persona-dropdown');
        const btn = dropdown.querySelector('.target-dropdown-btn');
        const menu = dropdown.querySelector('.target-dropdown-menu');

        const toggleMenu = (e) => {
            e.stopPropagation();
            // Close other dropdowns if any
            document.querySelectorAll('.target-dropdown-menu.active').forEach(m => {
                if (m !== menu) m.classList.remove('active');
            });
            menu.classList.toggle('active');
        };

        btn.addEventListener('click', toggleMenu);

        // Event Delegation for dynamically populated items
        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.target-dropdown-item');
            if (!item) return;

            e.stopPropagation();
            const val = item.dataset.value;

            // Update hidden input
            const input = modal.querySelector('.persona-select-value');
            if (input) input.value = val;

            // Update display
            this.updateDropdownDisplay(modal, val);

            // Close menu
            menu.classList.remove('active');
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                menu.classList.remove('active');
            }
        });

        // Close handlers
        modal.querySelectorAll('[data-close="actionModal"]').forEach(el => {
            el.addEventListener('click', () => this.closeActionModal(modal));
        });

        return modal;
    }

    closeActionModal(modal) {
        modal.hidden = true;
        // Close dropdown
        const menu = modal.querySelector('.target-dropdown-menu');
        if (menu) menu.classList.remove('active');
    }

    openActionModal(turnIdx, colKey, char, actionIdx = null, existingAction = null) {
        // Check if modal exists, create if not
        let modal = document.getElementById('actionModal');
        if (!modal) {
            modal = this.createActionModal();
            document.body.appendChild(modal);
        }

        const isEdit = actionIdx !== null;

        // Get modal elements
        const characterSelect = modal.querySelector('.character-select');
        const personaGroup = modal.querySelector('.persona-group');
        const actionSelect = modal.querySelector('.action-select');
        const memoInput = modal.querySelector('.action-memo-input');
        const deleteBtn = modal.querySelector('.btn-delete-action');
        const saveBtn = modal.querySelector('.btn-save-action');
        const titleEl = modal.querySelector('.modal-header h3');
        const personaValueInput = modal.querySelector('.persona-select-value');

        // Update title
        titleEl.textContent = isEdit
            ? (window.I18nService ? window.I18nService.t('editAction') : '액션 수정')
            : (window.I18nService ? window.I18nService.t('addAction') : '액션 추가');

        const getCharByName = (name) => {
            if (name === '__NOTE__') {
                return { type: 'note', name: '' };
            }
            if (name === '원더') {
                return { type: 'wonder', name: '원더', displayName: '원더', order: 0, slotIndex: -1 };
            }
            return { type: 'party', name, displayName: name, order: 0, slotIndex: -1 };
        };

        const applyCharacterUI = (name) => {
            const isNoteSelected = String(name) === '__NOTE__';
            const isWonderSelected = String(name) === '원더';
            if (personaGroup) {
                personaGroup.style.display = isWonderSelected ? 'block' : 'none';
            }

            if (actionSelect) {
                actionSelect.disabled = false;
                actionSelect.parentElement.style.display = 'block';
            }

            if (isNoteSelected) {
                if (personaGroup) personaGroup.style.display = 'none';
                if (personaValueInput) personaValueInput.value = '';
                if (actionSelect) {
                    actionSelect.value = '';
                    actionSelect.disabled = true;
                    actionSelect.parentElement.style.display = 'none';
                }
                return;
            }

            if (isWonderSelected) {
                this.populatePersonaSelector(modal);
            } else {
                personaValueInput.value = '';
                this.updateDropdownDisplay(modal, '', '');
            }
            if (actionSelect) {
                this.populateActionSelect(actionSelect, getCharByName(name));
            }
        };

        // Populate character select (all available characters)
        if (characterSelect) {
            const list = [];
            list.push('__NOTE__');
            list.push('원더');
            (this.store.state.party || []).forEach((m, idx) => {
                if (!m) return;
                list.push(m.name);
            });

            characterSelect.innerHTML = '';
            list.forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;

                // Localized display name
                if (name === '__NOTE__') {
                    opt.textContent = window.I18nService ? window.I18nService.t('noteAction', '메모') : '메모';
                } else if (name === '원더') {
                    opt.textContent = window.I18nService ? window.I18nService.t('wonder') : '원더';
                } else {
                    const charData = (window.characterData || {})[name] || {};
                    opt.textContent = this.getCharacterDisplayName(name, charData);
                }

                characterSelect.appendChild(opt);
            });

            characterSelect.onchange = () => {
                applyCharacterUI(characterSelect.value);
            };
        }

        // Initial UI based on existing action or current column
        const isNote = !!existingAction?.isNote || (!existingAction?.character && !existingAction?.action && !!existingAction?.memo);
        const initialCharName = isNote ? '__NOTE__' : (existingAction?.character || char.name || '');
        if (characterSelect) {
            characterSelect.value = initialCharName;
        }
        applyCharacterUI(initialCharName);

        // Show/hide delete button
        deleteBtn.style.display = isEdit ? 'block' : 'none';

        // Set values if editing
        if (existingAction) {
            if (existingAction.character === '원더') {
                const pVal = existingAction.wonderPersona || '';
                personaValueInput.value = pVal;
                this.updateDropdownDisplay(modal, pVal);
            }

            if (actionSelect && !isNote) {
                actionSelect.value = existingAction.action || '';
            }
            memoInput.value = existingAction.memo || '';
        } else {
            // Default values
            if (actionSelect) actionSelect.value = '';
            memoInput.value = '';
        }

        // Remove old event listeners by cloning
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

        const newDeleteBtn = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

        // Save handler
        newSaveBtn.addEventListener('click', () => {
            const selectedCharacterName = characterSelect ? String(characterSelect.value || '') : '';
            const isWonderSelected = selectedCharacterName === '원더';
            const isNoteSelected = selectedCharacterName === '__NOTE__';
            const personaValue = isWonderSelected ? personaValueInput.value : '';
            const actionValue = (actionSelect && !isNoteSelected) ? actionSelect.value : '';
            const memoValue = memoInput.value;

            // Get persona index
            let personaIndex = -1;
            if (isWonderSelected && personaValue) {
                const personas = this.store.state.wonder.personas;
                personaIndex = personas.findIndex(p => p.name === personaValue);
            }

            const actionData = {
                isNote: isNoteSelected,
                character: isNoteSelected ? '' : selectedCharacterName,
                wonderPersona: personaValue,
                wonderPersonaIndex: personaIndex,
                action: isNoteSelected ? '' : actionValue,
                memo: memoValue
            };

            // NOTE: column(order) is not tied to actor; do NOT move between columns.
            if (isEdit) {
                this.store.updateAction(turnIdx, colKey, actionIdx, actionData);
            } else {
                this.store.addAction(turnIdx, colKey, actionData);
            }

            this.closeActionModal(modal);
        });

        // Delete handler
        newDeleteBtn.addEventListener('click', () => {
            const t = (key) => window.I18nService ? window.I18nService.t(key) : key;
            const confirmMsg = t('confirmDeleteAction') || '이 액션을 삭제하시겠습니까?';
            if (confirm(confirmMsg)) {
                this.store.removeAction(turnIdx, colKey, actionIdx);
                this.closeActionModal(modal);
            }
        });

        // Show modal
        modal.hidden = false;
    }

    updateDropdownDisplay(modal, value, displayText = null) {
        const dropdown = modal.querySelector('.persona-dropdown');
        const icon = dropdown.querySelector('.selected-icon');
        const text = dropdown.querySelector('.selected-text');

        if (!value) {
            icon.style.display = 'none';
            text.textContent = displayText || '-';
            return;
        }

        const items = dropdown.querySelectorAll('.target-dropdown-item');
        items.forEach(item => {
            const isSelected = item.dataset.value === value;
            item.classList.toggle('selected', isSelected);
            if (isSelected && !displayText) {
                displayText = item.querySelector('span')?.textContent || value;
            }
        });

        // Check if it's a known persona for icon
        const personas = this.store.state.wonder.personas;
        const isPersona = personas.some(p => p.name === value);

        if (isPersona) {
            icon.src = `${this.baseUrl}/assets/img/persona/${value}.webp`;
            icon.style.display = 'block';
            // Get localized name if not provided
            if (!displayText) {
                displayText = (window.DataLoader && window.DataLoader.getPersonaDisplayName)
                    ? window.DataLoader.getPersonaDisplayName(value)
                    : value;
            }
        } else {
            icon.style.display = 'none';
        }

        text.textContent = displayText || value;
    }

    populatePersonaSelector(modal) {
        const dropdown = modal.querySelector('.persona-dropdown');
        const menu = dropdown.querySelector('.target-dropdown-menu');
        const valueInput = modal.querySelector('.persona-select-value');

        if (!dropdown || !menu) return;

        const personas = this.store.state.wonder.personas;
        const t = (k, f) => (window.I18nService && window.I18nService.t ? window.I18nService.t(k, f) : (f || k));

        let html = `
            <button type="button" class="target-dropdown-item" data-value="">
                <span class="none-icon">-</span>
                <span>${t('notSelected', '(선택 안함)')}</span>
            </button>
            <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
        `;

        // Personas with localized names
        personas.forEach((p, idx) => {
            if (p.name) {
                const dispName = (window.DataLoader && window.DataLoader.getPersonaDisplayName)
                    ? window.DataLoader.getPersonaDisplayName(p.name)
                    : p.name;
                html += `
                    <button type="button" class="target-dropdown-item" data-value="${p.name}">
                        <img src="${this.baseUrl}/assets/img/persona/${p.name}.webp" onerror="this.style.display='none'">
                        <span>${dispName}</span>
                    </button>
                `;
            }
        });

        menu.innerHTML = html;

    }

    populateActionSelect(select, char) {
        if (!select) return;

        const lang = DataLoader.getCurrentLang();
        const labels = this.getActionLabels();

        select.innerHTML = '<option value="">-</option>';

        if (char.type === 'wonder') {
            // Wonder actions - persona skills + special actions
            const wonderConfig = this.store.state.wonder;

            // Persona skills
            wonderConfig.personas.forEach((p, idx) => {
                const pName = p ? p.name : '';
                if (pName) {
                    const optGroup = document.createElement('optgroup');
                    const dispPName = (window.DataLoader && window.DataLoader.getPersonaDisplayName)
                        ? window.DataLoader.getPersonaDisplayName(pName)
                        : pName;
                    optGroup.label = `P${idx + 1}: ${dispPName}`;

                    const personaData = (window.personaFiles || {})[pName] || null;
                    const uniqueSkill = personaData && personaData.uniqueSkill ? personaData.uniqueSkill : null;
                    const uniqueBaseName = uniqueSkill ? (uniqueSkill.name || '') : '';

                    (p.skills || []).filter(s => s).forEach((skill, sIdx) => {
                        const opt = document.createElement('option');
                        opt.value = skill;

                        let dispSkill = (window.DataLoader && window.DataLoader.getSkillDisplayName)
                            ? window.DataLoader.getSkillDisplayName(skill)
                            : skill;

                        const isUnique = !!(uniqueSkill && uniqueBaseName && (
                            skill === uniqueBaseName ||
                            (uniqueSkill.name_en && skill === uniqueSkill.name_en) ||
                            (uniqueSkill.name_jp && skill === uniqueSkill.name_jp)
                        ));

                        if (isUnique) {
                            if (lang === 'en') dispSkill = uniqueSkill.name_en || uniqueSkill.name || dispSkill;
                            else if (lang === 'jp') dispSkill = uniqueSkill.name_jp || uniqueSkill.name_en || uniqueSkill.name || dispSkill;
                            else dispSkill = uniqueSkill.name || dispSkill;
                        }

                        opt.textContent = dispSkill;
                        optGroup.appendChild(opt);
                    });

                    select.appendChild(optGroup);
                }
            });

            // Special actions for Wonder - no Theurgia (Wonder is not persona3)
            const specialGroup = document.createElement('optgroup');
            specialGroup.label = labels.commonSkillGroup;

            const specialActions = [
                { label: labels.specialSkill, value: '특수 스킬' },
                { label: labels.highlight, value: 'HIGHLIGHT' },
                { label: labels.gun, value: '총격' },
                { label: labels.melee, value: '근접' },
                { label: labels.guard, value: '방어' },
                { label: labels.oneMore, value: 'ONE MORE' },
                { label: labels.item, value: '아이템' }
            ];

            specialActions.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.value;
                opt.textContent = a.label;
                specialGroup.appendChild(opt);
            });
            select.appendChild(specialGroup);
        } else {
            // Party member actions - 3 skills
            const skillLabels = [labels.skill1, labels.skill2, labels.skill3];
            for (let i = 0; i < 3; i++) {
                const opt = document.createElement('option');
                opt.value = `스킬${i + 1}`;
                opt.textContent = skillLabels[i];
                select.appendChild(opt);
            }

            // Check if character has persona3: true
            // persona3: show Theurgia, hide HIGHLIGHT
            // not persona3: show HIGHLIGHT, hide Theurgia
            const charData = (window.characterData || {})[char.name] || {};
            const isPersona3 = charData.persona3 === true;

            // Common actions
            const commonGroup = document.createElement('optgroup');
            commonGroup.label = labels.commonActions;

            const commonActions = [
                { label: labels.specialSkill, value: '특수 스킬' },
                ...(isPersona3 ? [
                    { label: labels.theurgia, value: 'Theurgia' },
                    { label: labels.supportSkill, value: '지원 스킬' }
                ] : [{ label: labels.highlight, value: 'HIGHLIGHT' }]),
                { label: labels.gun, value: '총격' },
                { label: labels.melee, value: '근접' },
                { label: labels.guard, value: '방어' },
                { label: labels.oneMore, value: 'ONE MORE' },
                { label: labels.item, value: '아이템' }
            ];

            commonActions.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.value;
                opt.textContent = a.label;
                commonGroup.appendChild(opt);
            });
            select.appendChild(commonGroup);
        }
    }
}
