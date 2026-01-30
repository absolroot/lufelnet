/**
 * Tactic Maker V2 - Tactic Board UI Module
 * Handles the timeline/tactic board rendering and action editing
 */

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

        // Cache sorted party
        this.sortedChars = [];

        // Subscribe to store changes
        this.store.subscribe((event, data) => this.handleStoreUpdate(event, data));

        // Bind events (only work in edit mode)
        this.btnAddTurn?.addEventListener('click', () => {
            if (!this.isEditMode()) return;
            this.store.addTurn();
        });

        const applyEditMode = (enabled) => {
            document.body.classList.toggle('tactic-edit-mode', !!enabled);

            if (this.editModeToggle) {
                this.editModeToggle.checked = !!enabled;
            }
            if (this.editModeBtn) {
                this.editModeBtn.classList.toggle('active', !!enabled);
                this.editModeBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
            }

            this.renderTurns();
        };

        this.editModeToggle?.addEventListener('change', (e) => {
            applyEditMode(e.target.checked);
        });

        this.editModeBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            applyEditMode(!this.isEditMode());
        });

        // Initial state (default: edit mode ON)
        applyEditMode(true);
        this.renderHeaders();
        this.renderTurns();

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
            this.renderHeaders();
            this.renderTurns();
        } else if (event === 'turnsChange') {
            this.renderHeaders(); // Re-render headers to update auto-action prompt state
            this.renderTurns();
        }
    }

    getCurrentLang() {
        if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
            return window.I18nService.getCurrentLanguage();
        }
        return 'kr';
    }

    getCharacterDisplayName(charKey, charData) {
        const lang = this.getCurrentLang();
        // KR: use the character's Korean name (charData.name) or fallback to key
        // EN: use CODENAME (charData.codename) or name_en
        // JP: use name_en (romanized Japanese convention)
        if (lang === 'kr') {
            return charData.name || charKey;
        } else if (lang === 'en') {
            return charData.codename || charData.name_en || charData.name || charKey;
        } else if (lang === 'jp') {
            return charData.name_en || charData.name || charKey;
        }
        return charData.name || charKey;
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

    getActionPromptText() {
        const lang = this.getCurrentLang();
        if (lang === 'kr') return '기본 패턴을 추가하시겠습니까?';
        if (lang === 'jp') return '基本パターンを追加しますか？';
        return 'Add default pattern?';
    }

    renderHeaders() {
        const sortedChars = this.getSortedParty();
        this.sortedChars = sortedChars;

        // Clear existing headers (keep first "Turn" column)
        while (this.tableHeader.children.length > 1) {
            this.tableHeader.removeChild(this.tableHeader.lastChild);
        }

        // Add character columns
        sortedChars.forEach(char => {
            const th = document.createElement('th');
            th.className = 'col-character';
            th.dataset.order = char.order;

            // Character thumbnail
            const imgPath = char.type === 'wonder'
                ? `${this.baseUrl}/assets/img/tier/원더.webp`
                : `${this.baseUrl}/assets/img/tier/${char.name}.webp`;

            const headerContent = document.createElement('div');
            headerContent.className = 'header-char-content';
            headerContent.innerHTML = `
                <div class="header-char">
                    <img src="${imgPath}" alt="${char.displayName}"
                         onerror="this.style.display='none'"
                         class="header-char-img">
                    <span class="header-char-name">${char.order}. ${char.displayName}</span>
                </div>
            `;
            th.appendChild(headerContent);

            // Check if we should show the Auto-Action Prompt
            const autoPromptEnabled = this.settingsUI ? this.settingsUI.getAutoActionPrompt() : true;

            // Only show if:
            // 1. Setting is ON
            // 2. Character is NOT Wonder
            // 3. The column has NO actions
            // 4. A default pattern is available for this character
            if (autoPromptEnabled && char.type !== 'wonder') {
                const colKey = String(char.order);
                let hasActions = false;
                for (const turn of this.store.state.turns) {
                    if (turn.columns[colKey] && turn.columns[colKey].length > 0) {
                        hasActions = true;
                        break;
                    }
                }

                if (!hasActions && this.store.hasDefaultPattern(colKey)) {
                    const promptDiv = document.createElement('div');
                    promptDiv.className = 'auto-action-prompt';
                    promptDiv.style.marginTop = '8px';
                    promptDiv.style.display = 'flex';
                    promptDiv.style.flexDirection = 'column';
                    promptDiv.style.gap = '4px';
                    promptDiv.style.alignItems = 'center';

                    const promptText = this.getActionPromptText();

                    promptDiv.innerHTML = `
                        <span style="font-size: 0.75rem; color: #aaa; font-weight: normal; white-space: nowrap;">${promptText}</span>
                        <div style="display: flex; gap: 6px;">
                            <button type="button" class="btn-prompt-yes" style="padding: 2px 8px; font-size: 0.75rem; border: 1px solid #4ecdc4; background: rgba(78, 205, 196, 0.2); color: #fff; border-radius: 4px; cursor: pointer;">Yes</button>
                            <button type="button" class="btn-prompt-no" style="padding: 2px 8px; font-size: 0.75rem; border: 1px solid #ff6b6b; background: rgba(255, 107, 107, 0.2); color: #fff; border-radius: 4px; cursor: pointer;">No</button>
                        </div>
                    `;

                    // Bind events
                    const btnYes = promptDiv.querySelector('.btn-prompt-yes');
                    const btnNo = promptDiv.querySelector('.btn-prompt-no');

                    btnYes.addEventListener('click', () => {
                        this.store.applyDefaultPattern(colKey);
                    });

                    btnNo.addEventListener('click', () => {
                        promptDiv.remove();
                    });

                    th.appendChild(promptDiv);
                }
            }

            this.tableHeader.appendChild(th);
        });
    }

    renderTurns() {
        this.tableBody.innerHTML = '';
        const turns = this.store.state.turns;
        const sortedChars = this.sortedChars.length > 0 ? this.sortedChars : this.getSortedParty();

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

        turns.forEach((turn, turnIdx) => {
            const tr = document.createElement('tr');
            tr.dataset.turnIndex = turnIdx;
            tr.className = 'turn-row';

            // Turn number cell
            const tdTurn = document.createElement('td');
            tdTurn.className = 'col-turn';
            tdTurn.innerHTML = `
                <div class="turn-info">
                    <div class="turn-drag-handle" title="드래그하여 순서 변경">
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
                        <button class="btn-turn-action btn-duplicate-turn" data-turn-index="${turnIdx}" title="턴 복제">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        </button>
                        <button class="btn-turn-action btn-remove-turn" data-turn-index="${turnIdx}" title="턴 삭제">
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
            tdTurn.querySelector('.btn-remove-turn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.isEditMode()) return;
                if (confirm('이 턴을 삭제하시겠습니까?')) {
                    this.store.removeTurn(turnIdx);
                }
            });

            tdTurn.querySelector('.btn-duplicate-turn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.isEditMode()) return;
                this.store.duplicateTurn(turnIdx);
            });

            // Character columns
            sortedChars.forEach(char => {
                const colKey = String(char.order);
                const td = document.createElement('td');
                td.className = 'tactic-cell';
                td.dataset.turnIndex = turnIdx;
                td.dataset.columnKey = colKey;

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

            // Find drop position within action list
            const actionItems = Array.from(actionList.querySelectorAll('.action-item:not(.dragging)'));
            const mouseY = e.clientY;

            // Remove existing indicators
            actionList.querySelectorAll('.action-drop-indicator').forEach(el => el.remove());

            // Find insert position
            let insertBefore = null;
            for (const item of actionItems) {
                const rect = item.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                if (mouseY < midY) {
                    insertBefore = item;
                    break;
                }
            }

            // Add drop indicator
            const indicator = document.createElement('div');
            indicator.className = 'action-drop-indicator';
            if (insertBefore) {
                actionList.insertBefore(indicator, insertBefore);
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

            // Calculate drop position
            const actionItems = Array.from(actionList.querySelectorAll('.action-item:not(.dragging)'));
            const mouseY = e.clientY;
            let toActionIdx = actionItems.length; // Default: end of list

            for (let i = 0; i < actionItems.length; i++) {
                const rect = actionItems[i].getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                if (mouseY < midY) {
                    toActionIdx = i;
                    break;
                }
            }

            // Perform the move
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
            row.classList.add('dragging-turn');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'turn', turnIdx }));
            this._draggedTurn = { turnIdx, element: row };
        });

        row.addEventListener('dragend', () => {
            row.draggable = false;
            row.classList.remove('dragging-turn');
            this._draggedTurn = null;
            document.querySelectorAll('.turn-drop-indicator').forEach(el => el.remove());
            document.querySelectorAll('.turn-row.drag-over-turn').forEach(el => el.classList.remove('drag-over-turn'));
        });

        row.addEventListener('dragover', (e) => {
            if (!this._draggedTurn || !this.isEditMode()) return;
            if (this._draggedTurn.turnIdx === turnIdx) return;
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
            const rect = row.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            let toIdx = turnIdx;

            if (e.clientY >= midY && fromIdx < turnIdx) {
                // Dropping below, same index
            } else if (e.clientY < midY && fromIdx > turnIdx) {
                // Dropping above, same index
            } else if (e.clientY >= midY) {
                toIdx = turnIdx + 1;
            }

            if (fromIdx !== toIdx) {
                this.store.moveTurn(fromIdx, toIdx > fromIdx ? toIdx - 1 : toIdx);
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

    getActionOptions(char) {
        const options = [];
        options.push({ label: '-', value: '' });

        if (!char) return options;

        if (char.type === 'wonder') {
            const wonderConfig = this.store.state.wonder;
            (wonderConfig.personas || []).forEach((p, idx) => {
                if (p && p.name) {
                    options.push({ label: `페르소나 ${idx + 1}: ${p.name}`, isHeader: true });
                    (p.skills || []).filter(s => s).forEach(skill => {
                        options.push({ label: skill, value: skill });
                    });
                }
            });

            options.push({ label: '특수 액션', isHeader: true });
            ['HIGHLIGHT', 'ONE MORE', '총격', '근접', '방어', '아이템', 'Theurgia'].forEach(s => {
                options.push({ label: s, value: s });
            });
        } else {
            const charData = (window.characterData || {})[char.name] || {};
            const skillCount = charData.skill_item || 6;

            for (let i = 1; i <= skillCount; i++) {
                options.push({ label: `스킬 ${i}`, value: `스킬${i}` });
            }

            options.push({ label: '공통 액션', isHeader: true });
            ['일반공격', 'HIGHLIGHT', 'ONE MORE', '총격', '근접', '방어', '아이템', 'Theurgia'].forEach(s => {
                options.push({ label: s, value: s });
            });
        }
        return options;
    }

    createActionItem(action, turnIdx, colKey, actionIdx, char) {
        const item = document.createElement('div');
        item.className = 'action-item';
        item.dataset.turnIndex = turnIdx;
        item.dataset.columnKey = colKey;
        item.dataset.actionIndex = actionIdx;

        // Character color tint (if available)
        const actorName = action.character || '';
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

        const isEditMode = this.isEditMode();

        // Build action item with inline drag handle
        item.innerHTML = `
            <div class="action-content-wrapper">
                <div class="action-drag-handle" title="드래그하여 이동">
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
                <button type="button" class="action-icon-btn" data-action-btn="edit" title="수정/메모">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button type="button" class="action-icon-btn" data-action-btn="duplicate" title="복제">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                </button>
                <button type="button" class="action-icon-btn" data-action-btn="delete" title="삭제">
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
                // Store reference for drop handling
                this._draggedAction = { turnIdx, colKey, actionIdx, element: item };
            });

            item.addEventListener('dragend', () => {
                item.draggable = false;
                item.classList.remove('dragging');
                this._draggedAction = null;
                // Remove all drop indicators
                document.querySelectorAll('.action-drop-indicator').forEach(el => el.remove());
                document.querySelectorAll('.tactic-cell.drag-over').forEach(el => el.classList.remove('drag-over'));
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
            const actorOptions = [
                { label: '원더', value: '원더', image: `${this.baseUrl}/assets/img/tier/원더.webp` }
            ];
            partyNames.forEach(n => {
                actorOptions.push({ label: n, value: n, image: `${this.baseUrl}/assets/img/tier/${n}.webp` });
            });

            const initialActor = action.character || (char?.name || '원더');
            const initialPersona = action.wonderPersona || '';
            const initialActionVal = action.action || '';

            // 2. Define State Variables for this item closure
            let currentActor = initialActor;
            let currentPersona = initialPersona;
            let currentAction = initialActionVal;

            // 3. Define Commit Function
            const commitStore = (a, p, act) => {
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
                commitStore(currentActor, currentPersona, newA);
            };

            // 5. Create Components

            // Actor Dropdown
            const actorDD = this.createCustomDropdown(actorOptions, initialActor, handleActorChange);
            actorDD.container.classList.add('actor-dropdown');

            // Persona Dropdown
            const pOpts = (initialActor === '원더')
                ? (this.store.state.wonder?.personas || [])
                    .filter(p => p && p.name)
                    .map(p => ({ label: p.name, value: p.name, image: `${this.baseUrl}/assets/img/persona/${p.name}.webp` }))
                : [];

            const personaDD = this.createCustomDropdown(pOpts, initialPersona, handlePersonaChange);
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

            const actionDD = this.createCustomDropdown(actionOpts, initialActionVal, handleActionChange);
            actionDD.container.classList.add('action-dropdown');

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
                nameSpan.textContent = actorName;
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
            actionSpan.textContent = actionName;
            mainRow.appendChild(actionSpan);
        }

        // Memo (if exists)
        if (action.memo) {
            const memo = document.createElement('div');
            memo.className = 'action-memo';
            memo.textContent = action.memo;
            item.appendChild(memo);
        }

        // Action buttons (only work in edit mode)
        item.querySelectorAll('button[data-action-btn]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.isEditMode()) return;
                const kind = btn.dataset.actionBtn;
                if (kind === 'edit') {
                    this.openActionModal(turnIdx, colKey, char, actionIdx, action);
                    return;
                }
                if (kind === 'duplicate') {
                    this.store.addAction(turnIdx, colKey, { ...action });
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
                    <h3>액션 추가</h3>
                    <button class="modal-close" data-close="actionModal">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="form-group">
                        <label>사용 캐릭터</label>
                        <select class="input-select character-select"></select>
                    </div>

                    <div class="form-group persona-group" style="display: none;">
                        <label data-i18n="persona">페르소나</label>
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
                        <label data-i18n="action">액션/스킬</label>
                        <select class="input-select action-select">
                            <option value="">-</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label data-i18n="memo">메모</label>
                        <textarea class="input-text action-memo-input" rows="2" placeholder="메모 입력..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-danger btn-delete-action" style="margin-right: auto; display: none;">삭제</button>
                    <button type="button" class="btn-secondary" data-close="actionModal">취소</button>
                    <button type="button" class="btn-primary btn-save-action">저장</button>
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
        titleEl.textContent = isEdit ? '액션 수정' : '액션 추가';

        const getCharByName = (name) => {
            if (name === '원더') {
                return { type: 'wonder', name: '원더', displayName: '원더', order: 0, slotIndex: -1 };
            }
            return { type: 'party', name, displayName: name, order: 0, slotIndex: -1 };
        };

        const applyCharacterUI = (name) => {
            const isWonderSelected = String(name) === '원더';
            if (personaGroup) {
                personaGroup.style.display = isWonderSelected ? 'block' : 'none';
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
            list.push('원더');
            (this.store.state.party || []).forEach((m, idx) => {
                if (!m) return;
                list.push(m.name);
            });

            characterSelect.innerHTML = '';
            list.forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                characterSelect.appendChild(opt);
            });

            characterSelect.onchange = () => {
                applyCharacterUI(characterSelect.value);
            };
        }

        // Initial UI based on existing action or current column
        const initialCharName = existingAction?.character || char.name || '';
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

            actionSelect.value = existingAction.action || '';
            memoInput.value = existingAction.memo || '';
        } else {
            // Default values
            actionSelect.value = '';
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
            const personaValue = isWonderSelected ? personaValueInput.value : '';
            const actionValue = actionSelect.value;
            const memoValue = memoInput.value;

            // Get persona index
            let personaIndex = -1;
            if (isWonderSelected && personaValue) {
                const personas = this.store.state.wonder.personas;
                personaIndex = personas.findIndex(p => p.name === personaValue);
            }

            const actionData = {
                character: selectedCharacterName,
                wonderPersona: personaValue,
                wonderPersonaIndex: personaIndex,
                action: actionValue,
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
            if (confirm('이 액션을 삭제하시겠습니까?')) {
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

        let html = `
            <button type="button" class="target-dropdown-item" data-value="">
                <span class="none-icon">-</span>
                <span>(선택 안함)</span>
            </button>
            <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
        `;

        // Personas
        personas.forEach((p, idx) => {
            if (p.name) {
                html += `
                    <button type="button" class="target-dropdown-item" data-value="${p.name}">
                        <img src="${this.baseUrl}/assets/img/persona/${p.name}.webp" onerror="this.style.display='none'">
                        <span>${p.name}</span>
                    </button>
                `;
            }
        });

        menu.innerHTML = html;

    }

    populateActionSelect(select, char) {
        if (!select) return;

        select.innerHTML = '<option value="">-</option>';

        if (char.type === 'wonder') {
            // Wonder actions - persona skills + special actions
            const wonderConfig = this.store.state.wonder;

            // Persona skills
            wonderConfig.personas.forEach((p, idx) => {
                if (p.name) {
                    const optGroup = document.createElement('optgroup');
                    optGroup.label = `페르소나 ${idx + 1}: ${p.name}`;

                    p.skills.filter(s => s).forEach((skill, sIdx) => {
                        const opt = document.createElement('option');
                        opt.value = skill;
                        opt.textContent = skill;
                        optGroup.appendChild(opt);
                    });

                    select.appendChild(optGroup);
                }
            });

            // Special actions
            const specialGroup = document.createElement('optgroup');
            specialGroup.label = '특수 액션';
            ['HIGHLIGHT', 'ONE MORE', '총격', '근접', '방어', '아이템', 'Theurgia'].forEach(s => {
                const opt = document.createElement('option');
                opt.value = s;
                opt.textContent = s;
                specialGroup.appendChild(opt);
            });
            select.appendChild(specialGroup);
        } else {
            // Party member actions - generic skill options
            const charData = (window.characterData || {})[char.name] || {};
            const skillCount = charData.skill_item || 6;

            for (let i = 1; i <= skillCount; i++) {
                const opt = document.createElement('option');
                opt.value = `스킬${i}`;
                opt.textContent = `스킬 ${i}`;
                select.appendChild(opt);
            }

            // Common actions
            const commonGroup = document.createElement('optgroup');
            commonGroup.label = '공통 액션';
            ['일반공격', 'HIGHLIGHT', 'ONE MORE', '총격', '근접', '방어', '아이템', 'Theurgia'].forEach(s => {
                const opt = document.createElement('option');
                opt.value = s;
                opt.textContent = s;
                commonGroup.appendChild(opt);
            });
            select.appendChild(commonGroup);
        }
    }
}
