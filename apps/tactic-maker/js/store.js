/**
 * Tactic Maker V2 - State Management Store
 */

export class TacticStore {
    constructor() {
        // Initial State
        this.state = {
            title: "",
            memo: "", // Tactic description memo
            // Party: [Slot1, Slot2, Slot3, Elucidator, Slot4]
            // Each slot: { name, order, ritual(0-6), modification(0-6), role(J&C only), mainRev, subRev }
            party: [null, null, null, null, null],

            // Wonder Configuration
            wonder: {
                order: 1, // Default order
                weapon: "",
                weaponRefinement: 0,
                personas: [
                    { name: "", skills: ["", "", "", ""], memo: "" },
                    { name: "", skills: ["", "", "", ""], memo: "" },
                    { name: "", skills: ["", "", "", ""], memo: "" }
                ]
            },

            // Turns Data
            // Array of objects: { turn: 1, customName?: string, columns: { "orderKey": [actions...] } }
            // actions: { type: 'auto'|'manual', character, wonderPersona?, wonderPersonaIndex?, action, memo }
            turns: Array.from({ length: 6 }, (_, i) => ({
                turn: i + 1,
                columns: {}
            })),
            
            // Need Stat Selections (캐릭터별 체크된 요소)
            // { slotIndex: { critical: [...itemIds], pierce: [...itemIds], defense: [...itemIds], revSumCritical, revSumPierce, extraSumCritical, extraSumPierce, extraDefenseReduce } }
            needStatSelections: {}
        };

        this.listeners = [];

        // Undo/Redo support
        this.undoStack = [];
        this.redoStack = [];
        this.maxHistory = 30;
        this._skipHistory = false;

        // Auto-save
        this.autoSaveKey = 'tactic_maker_autosave';
        this.autoSaveTimeKey = 'tactic_maker_autosave_time';
    }

    // --- Auto-save Methods ---

    saveToLocalStorage() {
        try {
            const data = JSON.stringify(this.state);
            localStorage.setItem(this.autoSaveKey, data);
            const now = new Date().toLocaleTimeString();
            localStorage.setItem(this.autoSaveTimeKey, now);
            this.notify('autoSave', { time: now });
            
            // Remove bin/library URL params when local data is saved
            // This ensures refreshing loads local data instead of shared data
            this._clearShareUrlParams();
            
            return now;
        } catch (e) {
            console.error('[TacticStore] Auto-save failed:', e);
            return null;
        }
    }
    
    /**
     * Remove bin/library/data URL parameters to prevent reloading shared data on refresh
     */
    _clearShareUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('bin') || urlParams.has('library') || urlParams.has('data')) {
            urlParams.delete('bin');
            urlParams.delete('library');
            urlParams.delete('data');
            const newUrl = urlParams.toString() 
                ? `${window.location.pathname}?${urlParams.toString()}`
                : window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }

    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem(this.autoSaveKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.loadData(parsed);
                const time = localStorage.getItem(this.autoSaveTimeKey);
                return time;
            }
        } catch (e) {
            console.error('[TacticStore] Failed to load auto-save:', e);
        }
        return null;
    }

    getLastSaveTime() {
        return localStorage.getItem(this.autoSaveTimeKey) || null;
    }

    clearLocalStorage() {
        localStorage.removeItem(this.autoSaveKey);
        localStorage.removeItem(this.autoSaveTimeKey);
    }

    // --- Memo Methods ---

    setMemo(memo) {
        this._saveHistory();
        this.state.memo = memo;
        this.notify('memoChange', memo);
    }

    // --- Subscription ---

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify(event, data) {
        this.listeners.forEach(listener => {
            try {
                listener(event, data);
            } catch (e) {
                console.error('[TacticStore] Listener error:', e);
            }
        });
    }

    // --- History Management ---

    _saveHistory() {
        if (this._skipHistory) return;
        // Deep copy current state
        const snapshot = JSON.parse(JSON.stringify(this.state));
        this.undoStack.push(snapshot);
        if (this.undoStack.length > this.maxHistory) {
            this.undoStack.shift();
        }
        // Clear redo stack on new action
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length === 0) return false;
        // Save current state to redo
        this.redoStack.push(JSON.parse(JSON.stringify(this.state)));
        // Restore previous state
        this.state = this.undoStack.pop();
        this.notify('fullReload', this.state);
        this.checkPartySideEffects();
        return true;
    }

    redo() {
        if (this.redoStack.length === 0) return false;
        // Save current state to undo
        this.undoStack.push(JSON.parse(JSON.stringify(this.state)));
        // Restore next state
        this.state = this.redoStack.pop();
        this.notify('fullReload', this.state);
        this.checkPartySideEffects();
        return true;
    }

    // --- State Mutations ---

    setState(newState) {
        this._saveHistory();
        this.state = { ...this.state, ...newState };
        this.notify('stateChange', this.state);
    }

    setTitle(title) {
        this._saveHistory();
        this.state.title = title;
        this.notify('titleChange', title);
    }

    setPartySlot(slotIndex, characterData) {
        this._saveHistory();
        // characterData: { name, order, ritual, modification, role, mainRev, subRev } or null
        const previousData = this.state.party[slotIndex];
        this.state.party[slotIndex] = characterData;

        // "Just delete the previous character's actions when changing the character."
        // Only if we are validly switching characters in the same slot/order context
        if (previousData && characterData && previousData.name !== characterData.name) {
            // For Elucidator slot (index 3), clear actions by character name since they don't have order
            if (slotIndex === 3) {
                const prevCharName = previousData.name;
                if (prevCharName) {
                    this.state.turns.forEach(turn => {
                        Object.keys(turn.columns).forEach(colKey => {
                            turn.columns[colKey] = (turn.columns[colKey] || []).filter(
                                action => action.character !== prevCharName
                            );
                        });
                    });
                }
            } else {
                // Use previousData.order because ui-party.js temporarily sets NEW order to '-'
                // preventing us from knowing the target column if we look at characterData only.
                // But we know the actions belong to the previous char's order.
                const orderKey = String(previousData.order);
                if (orderKey && orderKey !== '-') {
                    this.state.turns.forEach(turn => {
                        // Clear actions for this column
                        if (turn.columns[orderKey]) {
                            turn.columns[orderKey] = [];
                        }
                    });
                }
            }
        }

        this.notify('partyChange', { slotIndex, characterData });

        // Check for side-effects (e.g. Fuuka in Elucidator -> Show Slot 4)
        this.checkPartySideEffects();
    }

    /**
     * Check if Wonder has a default pattern available
     */
    _hasWonderDefaultPattern() {
        const personas = this.state.wonder.personas || [];
        // Find first persona with a name set
        const firstPersona = personas.find(p => p && p.name);
        if (!firstPersona || !firstPersona.name) return false;
        
        // Get skill to use
        const skill = this._getWonderLastSkill(firstPersona);
        return !!skill;
    }
    
    /**
     * Get the last skill from a wonder persona
     * Priority: user-set skills (index 1,2,3) > unique skill (index 0) > personaFiles fallback
     */
    _getWonderLastSkill(persona) {
        if (!persona || !persona.name) return null;
        
        const allSkills = persona.skills || ['', '', '', ''];
        
        // Check user-set skills (index 1, 2, 3) from last to first
        for (let i = 3; i >= 1; i--) {
            if (allSkills[i] && allSkills[i].trim()) {
                return allSkills[i].trim();
            }
        }
        
        // Check unique skill (index 0)
        if (allSkills[0] && allSkills[0].trim()) {
            return allSkills[0].trim();
        }
        
        // Fallback to personaFiles
        const pData = (window.personaFiles || {})[persona.name];
        if (pData) {
            // Try recommendSkill last item
            const recommendSkills = pData.recommendSkill || [];
            if (recommendSkills.length > 0) {
                const lastRec = recommendSkills[recommendSkills.length - 1];
                if (lastRec && lastRec.name) return lastRec.name;
            }
            // Try uniqueSkill
            if (pData.uniqueSkill && pData.uniqueSkill.name) {
                return pData.uniqueSkill.name;
            }
        }
        
        return null;
    }
    
    /**
     * Apply wonder default pattern to all turns
     */
    _applyWonderDefaultPattern() {
        const personas = this.state.wonder.personas || [];
        const firstPersona = personas.find(p => p && p.name);
        if (!firstPersona || !firstPersona.name) return false;
        
        const personaName = firstPersona.name;
        const personaIndex = personas.indexOf(firstPersona);
        const lastSkill = this._getWonderLastSkill(firstPersona);
        
        if (!lastSkill) return false;
        
        this._saveHistory();
        this.state.turns.forEach((turn) => {
            if (!turn.columns['mystery']) {
                turn.columns['mystery'] = [];
            }
            if (turn.columns['mystery'].length === 0) {
                turn.columns['mystery'].push({
                    type: 'manual',
                    character: '원더',
                    wonderPersona: personaName,
                    wonderPersonaIndex: personaIndex,
                    action: lastSkill,
                    memo: ''
                });
            }
        });
        this.notify('turnsChange', this.state.turns);
        return true;
    }

    applyDefaultPattern(orderKey) {
        // Handle 'mystery' key for Wonder directly
        if (orderKey === 'mystery') {
            this._applyWonderDefaultPattern();
            return;
        }

        const order = parseInt(orderKey);
        const characterData = this.getCharacterByOrder(order);
        let fullCharData = null;

        // Check if this is Wonder's order
        if (characterData && characterData.type === 'wonder') {
            this._applyWonderDefaultPattern();
            return;
        } else {
            // Find party member
            fullCharData = this.state.party.find(p => p && String(p.order) === orderKey);
        }

        if (!fullCharData || !fullCharData.name) return;

        const ritualLevel = fullCharData.ritual || '0';
        const pattern = this._findPatternForLevel(fullCharData.name, ritualLevel);

        if (pattern) {
            this._saveHistory();
            // Apply pattern to turns (Append logic)
            this.state.turns.forEach((turn, idx) => {
                if (pattern[idx]) {
                    if (!turn.columns[orderKey]) {
                        turn.columns[orderKey] = [];
                    }

                    pattern[idx].forEach(actionDef => {
                        // Normalize action type: 테우르기아 -> Theurgia for consistency with dropdown values
                        let actionType = actionDef.type || '';
                        if (actionType === '테우르기아') {
                            actionType = 'Theurgia';
                        }
                        
                        const newAction = {
                            character: fullCharData.name,
                            wonderPersona: '',
                            wonderPersonaIndex: -1,
                            action: actionType,
                            memo: ''
                        };
                        turn.columns[orderKey].push(newAction);
                    });
                }
            });
            this.notify('turnsChange', this.state.turns);
        }
    }

    _findPatternForLevel(characterName, ritualLevel) {
        if (typeof ritualPatterns === 'undefined' || !ritualPatterns[characterName]) return null;

        const characterPatterns = ritualPatterns[characterName];
        const matchingPattern = characterPatterns.find(patternData => {
            if (patternData.level.includes('-')) {
                const [min, max] = patternData.level.split('-').map(Number);
                const level = Number(ritualLevel);
                return level >= min && level <= max;
            } else {
                return String(patternData.level) === String(ritualLevel);
            }
        });

        return matchingPattern ? matchingPattern.pattern : null;
    }

    hasDefaultPattern(orderKey) {
        // Wonder check - 'mystery' key
        if (orderKey === 'mystery') {
            return this._hasWonderDefaultPattern();
        }
        
        const order = parseInt(orderKey);
        // Find party member for this order
        let fullCharData = null;
        
        // Check if this is Wonder's order (numeric)
        if (!isNaN(order) && this.state.wonder.order === order) {
            return this._hasWonderDefaultPattern();
        }

        fullCharData = this.state.party.find(p => p && String(p.order) === orderKey);

        if (!fullCharData || !fullCharData.name) return false;

        const ritualLevel = fullCharData.ritual || '0';
        // Reuse _findPatternForLevel logic but just return existence
        const pattern = this._findPatternForLevel(fullCharData.name, ritualLevel);
        return !!pattern;
    }

    /**
     * Get the maximum order number available based on assigned characters
     * Returns the count of characters that have orders assigned (not '-')
     */
    getMaxAvailableOrder() {
        let count = 0;

        // Check Wonder (always counts if it has a valid order)
        const wonderOrder = this.state.wonder.order;
        if (wonderOrder && wonderOrder !== '-' && Number.isFinite(parseInt(wonderOrder))) {
            count++;
        }

        // Check party slots (exclude elucidator index 3 and slot4 index 4)
        this.state.party.forEach((member, idx) => {
            if (idx === 3 || idx === 4) return; // Elucidator and Slot4 don't have orders
            if (member && member.order && member.order !== '-') {
                count++;
            }
        });

        return Math.min(count, 4);
    }

    /**
     * Get the number of order-able slots that have characters assigned
     * (Used to determine max selectable order)
     */
    getOrderableCharacterCount() {
        let count = 1; // Wonder always counts

        // Count party slots with characters (exclude elucidator and slot4)
        this.state.party.forEach((member, idx) => {
            if (idx === 3 || idx === 4) return;
            if (member && member.name) {
                count++;
            }
        });

        return Math.min(count, 4);
    }

    checkPartySideEffects() {
        // Fuuka logic - check multiple name variants
        const FUUKA_NAMES = ['후카', 'Fuuka', 'フーカ', '風花'];
        const elucidator = this.state.party[3]; // Index 3 is Elucidator
        const hasFuuka = elucidator && FUUKA_NAMES.some(name =>
            elucidator.name === name ||
            elucidator.name?.toLowerCase() === name.toLowerCase()
        );
        // Notify UI to update visibility
        this.notify('elucidatorChange', { hasFuuka });
    }

    setWonderConfig(config) {
        this._saveHistory();
        const oldWonder = this.state.wonder;
        const newWonder = { ...this.state.wonder, ...config };

        this.state.wonder = newWonder;

        // Smart Update: Check for Persona changes
        const oldPersonas = oldWonder.personas || [];
        const newPersonas = newWonder.personas || [];

        for (let i = 0; i < 3; i++) {
            const oldP = oldPersonas[i];
            const newP = newPersonas[i];

            // If name changed, or if it was empty and now has a name (or vice versa)
            // But we mainly care if the assigned Persona CHANGED.
            // If just skills changed, we might not want to touch actions unless requested.
            // Requirement: "When switching Persona..."
            if (oldP && newP && oldP.name !== newP.name) {
                // Persona Changed at index i
                this._smartUpdateWonderGlobal(i, oldP, newP);
            }
        }

        this.notify('wonderChange', this.state.wonder);
    }

    _smartUpdateWonderGlobal(personaIndex, oldPersona, newPersona) {
        if (!oldPersona || !newPersona) return;

        const oldSkills = new Set(oldPersona.skills || []);
        const newDefaultSkill = (newPersona.skills && newPersona.skills[3]) ? newPersona.skills[3] : '';
        // If last skill is empty, try others? user said "last one" (index 3 usually). 
        // If index 3 is empty, maybe we shouldn't change it or keep it empty. 
        // Let's assume we use the last skill slot (index 3).

        // Iterate all turns and actions
        let actionsChanged = false;
        this.state.turns.forEach(turn => {
            Object.values(turn.columns).forEach(actions => {
                actions.forEach(action => {
                    // Check if it's Wonder and using this persona index
                    // Note: action.wonderPersonaIndex should track which slot was used.
                    // If -1 or undefined, maybe rely on name? But name changed.
                    // Rely on index if available. If not, check old name.

                    const isWonder = action.character === '원더' || action.character === 'WONDER';
                    if (!isWonder) return;

                    let targetMatch = false;

                    if (typeof action.wonderPersonaIndex === 'number' && action.wonderPersonaIndex === personaIndex) {
                        targetMatch = true;
                    } else if (action.wonderPersona === oldPersona.name) {
                        // Fallback: match by name if index missing
                        targetMatch = true;
                    }

                    if (targetMatch) {
                        // Check if current action is one of the old skills
                        if (oldSkills.has(action.action)) {
                            // Update to new persona
                            action.wonderPersona = newPersona.name;
                            action.wonderPersonaIndex = personaIndex;
                            action.action = newDefaultSkill; // Change skill
                            actionsChanged = true;
                        } else {
                            // It might be a common action (Attack/Guard), just update the Persona ref
                            // But user said: "if existing action was dependent on old persona... change it".
                            // If it's NOT dependent (e.g. "HIGHLIGHT"), do we update the persona name ref?
                            // Yes, the action is now performed by the New Persona in that slot.
                            action.wonderPersona = newPersona.name;
                            action.wonderPersonaIndex = personaIndex;
                            // Action string stays same
                        }
                    }
                });
            });
        });

        if (actionsChanged) {
            this.notify('turnsChange', this.state.turns);
        }
    }

    /**
     * Get sorted party (Wonder + party members) by order
     * Used by auto-action-prompt for Elucidator pattern application
     * @returns {Array} Array of { type, name, order, slotIndex }
     */
    getSortedParty() {
        const chars = [];

        // Add Wonder
        const wonderOrder = this.state.wonder.order;
        chars.push({
            type: 'wonder',
            name: '원더',
            order: wonderOrder,
            slotIndex: -1
        });

        // Add party members (exclude elucidator index 3)
        this.state.party.forEach((member, idx) => {
            if (idx === 3) return; // Skip elucidator
            if (member && member.order && member.order !== '-') {
                const parsedOrder = parseInt(member.order);
                if (!Number.isFinite(parsedOrder)) return;

                chars.push({
                    type: 'party',
                    name: member.name,
                    order: parsedOrder,
                    slotIndex: idx
                });
            }
        });

        // Sort by order
        chars.sort((a, b) => a.order - b.order);

        return chars;
    }

    /**
     * Get current order -> character mapping
     */
    getOrderToCharacterMap() {
        const map = {};

        // Wonder
        const wonderOrder = String(this.state.wonder.order);
        if (wonderOrder && wonderOrder !== '-') {
            map[wonderOrder] = '원더';
        }

        // Party members (exclude elucidator index 3 and slot4 index 4)
        this.state.party.forEach((member, idx) => {
            if (idx === 3 || idx === 4) return;
            if (member && member.order && member.order !== '-') {
                map[String(member.order)] = member.name;
            }
        });

        return map;
    }

    /**
     * Get current character -> order mapping
     */
    getCharacterToOrderMap() {
        const map = {};

        // Wonder
        const wonderOrder = String(this.state.wonder.order);
        if (wonderOrder && wonderOrder !== '-') {
            map['원더'] = wonderOrder;
        }

        // Party members (exclude elucidator index 3 and slot4 index 4)
        this.state.party.forEach((member, idx) => {
            if (idx === 3 || idx === 4) return;
            if (member && member.order && member.order !== '-') {
                map[member.name] = String(member.order);
            }
        });

        return map;
    }

    /**
     * Move actions when character orders change.
     * Actions follow their character to the new column.
     * @param {Object} oldCharToOrder - Previous character -> order mapping
     */
    moveActionsWithCharacters(oldCharToOrder) {
        const newCharToOrder = this.getCharacterToOrderMap();

        // Find characters whose order changed
        const moves = []; // { charName, fromOrder, toOrder }

        for (const [charName, oldOrder] of Object.entries(oldCharToOrder)) {
            const newOrder = newCharToOrder[charName];
            if (oldOrder && newOrder && oldOrder !== newOrder) {
                moves.push({ charName, fromOrder: oldOrder, toOrder: newOrder });
            }
        }

        if (moves.length === 0) return;

        // For each turn, rearrange columns based on moves
        this.state.turns.forEach(turn => {
            const oldColumns = JSON.parse(JSON.stringify(turn.columns));
            const newColumns = {};

            // First, copy columns that didn't move
            const movedFromOrders = new Set(moves.map(m => m.fromOrder));
            const movedToOrders = new Set(moves.map(m => m.toOrder));

            for (const [order, actions] of Object.entries(oldColumns)) {
                if (!movedFromOrders.has(order) && !movedToOrders.has(order)) {
                    newColumns[order] = actions;
                }
            }

            // Then, apply moves (actions follow their character)
            for (const move of moves) {
                const actions = oldColumns[move.fromOrder] || [];
                newColumns[move.toOrder] = actions;
            }

            turn.columns = newColumns;
        });

        this.notify('turnsChange', this.state.turns);
    }

    /**
     * Sync all action character fields to match the current order assignments.
     * Call this after actions have been moved to correct columns.
     */
    syncActionsToOrders() {
        // Build a map of order -> character name
        const orderToChar = this.getOrderToCharacterMap();

        // Update all actions in all turns
        this.state.turns.forEach(turn => {
            Object.keys(turn.columns).forEach(columnKey => {
                const charForColumn = orderToChar[columnKey];
                if (charForColumn) {
                    turn.columns[columnKey].forEach(action => {
                        action.character = charForColumn;
                        // Clear wonderPersona if this column is not Wonder
                        if (charForColumn !== '원더') {
                            action.wonderPersona = '';
                            action.wonderPersonaIndex = -1;
                        }
                    });
                }
            });
        });

        this.notify('turnsChange', this.state.turns);
    }

    getWonderConfig() {
        return this.state.wonder;
    }

    // --- Turn Management ---

    addTurn() {
        this._saveHistory();
        const nextTurnNum = this.state.turns.length + 1;
        const newTurn = {
            turn: nextTurnNum,
            columns: {} // Keyed by order (1-4)
        };
        this.state.turns.push(newTurn);
        this.notify('turnsChange', this.state.turns);
    }

    removeTurn(turnIndex) {
        this._saveHistory();
        if (turnIndex < 0 || turnIndex >= this.state.turns.length) return;

        this.state.turns.splice(turnIndex, 1);

        // Re-number turns
        this.state.turns.forEach((turn, idx) => {
            turn.turn = idx + 1;
        });

        this.notify('turnsChange', this.state.turns);
    }

    duplicateTurn(turnIndex) {
        this._saveHistory();
        if (turnIndex < 0 || turnIndex >= this.state.turns.length) return;

        const originalTurn = this.state.turns[turnIndex];
        const duplicatedTurn = JSON.parse(JSON.stringify(originalTurn));

        // Insert after the original
        this.state.turns.splice(turnIndex + 1, 0, duplicatedTurn);

        // Re-number turns
        this.state.turns.forEach((turn, idx) => {
            turn.turn = idx + 1;
        });

        this.notify('turnsChange', this.state.turns);
    }

    moveTurn(fromIndex, toIndex) {
        this._saveHistory();
        if (fromIndex < 0 || fromIndex >= this.state.turns.length) return;
        if (toIndex < 0 || toIndex >= this.state.turns.length) return;
        if (fromIndex === toIndex) return;

        const [turn] = this.state.turns.splice(fromIndex, 1);
        this.state.turns.splice(toIndex, 0, turn);

        // Re-number turns
        this.state.turns.forEach((t, idx) => {
            t.turn = idx + 1;
        });

        this.notify('turnsChange', this.state.turns);
    }

    updateTurn(turnIndex, updates) {
        this._saveHistory();
        if (!this.state.turns[turnIndex]) return;
        this.state.turns[turnIndex] = { ...this.state.turns[turnIndex], ...updates };
        this.notify('turnsChange', this.state.turns);
    }

    // --- Action Management ---

    addAction(turnIndex, columnKey, actionData, insertAfterIndex = -1) {
        this._saveHistory();
        // Ensure turn exists
        if (!this.state.turns[turnIndex]) return;

        if (!this.state.turns[turnIndex].columns[columnKey]) {
            this.state.turns[turnIndex].columns[columnKey] = [];
        }

        // Normalize action data
        // NOTE: action.type(auto/manual) is deprecated; keep the field out for new actions.
        const action = {
            isNote: !!actionData.isNote,
            character: actionData.character || '',
            wonderPersona: actionData.wonderPersona || '',
            wonderPersonaIndex: actionData.wonderPersonaIndex ?? -1,
            action: actionData.action || '',
            memo: actionData.memo || ''
        };

        // Insert after specific index if provided, otherwise push to end
        if (insertAfterIndex >= 0 && insertAfterIndex < this.state.turns[turnIndex].columns[columnKey].length) {
            this.state.turns[turnIndex].columns[columnKey].splice(insertAfterIndex + 1, 0, action);
        } else {
            this.state.turns[turnIndex].columns[columnKey].push(action);
        }
        this.notify('turnsChange', this.state.turns);
    }

    updateAction(turnIndex, columnKey, actionIndex, updates) {
        this._saveHistory();
        const turn = this.state.turns[turnIndex];
        if (!turn || !turn.columns[columnKey] || !turn.columns[columnKey][actionIndex]) return;

        const action = turn.columns[columnKey][actionIndex];
        turn.columns[columnKey][actionIndex] = { ...action, ...updates };
        this.notify('turnsChange', this.state.turns);
    }

    removeAction(turnIndex, columnKey, actionIndex) {
        this._saveHistory();
        const turn = this.state.turns[turnIndex];
        if (!turn || !turn.columns[columnKey]) return;

        turn.columns[columnKey].splice(actionIndex, 1);
        this.notify('turnsChange', this.state.turns);
    }

    moveAction(turnIndex, columnKey, fromIndex, toIndex) {
        this._saveHistory();
        const turn = this.state.turns[turnIndex];
        if (!turn || !turn.columns[columnKey]) return;

        const actions = turn.columns[columnKey];
        if (fromIndex < 0 || fromIndex >= actions.length) return;
        if (toIndex < 0 || toIndex >= actions.length) return;

        const [action] = actions.splice(fromIndex, 1);
        actions.splice(toIndex, 0, action);
        this.notify('turnsChange', this.state.turns);
    }

    /**
     * Move an action to a different turn and/or column
     * @param {number} fromTurnIdx - Source turn index
     * @param {string} fromColKey - Source column key
     * @param {number} fromActionIdx - Source action index
     * @param {number} toTurnIdx - Destination turn index
     * @param {string} toColKey - Destination column key
     * @param {number} toActionIdx - Destination action index (insert position)
     */
    moveActionTo(fromTurnIdx, fromColKey, fromActionIdx, toTurnIdx, toColKey, toActionIdx) {
        this._saveHistory();

        const fromTurn = this.state.turns[fromTurnIdx];
        const toTurn = this.state.turns[toTurnIdx];
        if (!fromTurn || !toTurn) return;

        const fromActions = fromTurn.columns[fromColKey];
        if (!fromActions || fromActionIdx < 0 || fromActionIdx >= fromActions.length) return;

        // Extract the action
        const [action] = fromActions.splice(fromActionIdx, 1);

        // Ensure destination column exists
        if (!toTurn.columns[toColKey]) {
            toTurn.columns[toColKey] = [];
        }

        // Adjust toActionIdx if moving within the same turn/column
        let insertIdx = toActionIdx;
        if (fromTurnIdx === toTurnIdx && fromColKey === toColKey && fromActionIdx < toActionIdx) {
            insertIdx = Math.max(0, toActionIdx - 1);
        }

        // Insert at destination
        toTurn.columns[toColKey].splice(insertIdx, 0, action);

        this.notify('turnsChange', this.state.turns);
    }

    // --- Data Import/Export ---

    loadData(data) {
        this._saveHistory();
        // Validate and load data
        this.state = {
            title: data.title || '',
            memo: data.memo || '',
            party: data.party || [null, null, null, null, null],
            wonder: data.wonder || {
                order: 1,
                weapon: '',
                weaponRefinement: 0,
                personas: [
                    { name: '', skills: ['', '', '', ''], memo: '' },
                    { name: '', skills: ['', '', '', ''], memo: '' },
                    { name: '', skills: ['', '', '', ''], memo: '' }
                ]
            },
            turns: data.turns || [],
            needStatSelections: data.needStatSelections || {}
        };
        this.notify('fullReload', this.state);
        this.checkPartySideEffects();
    }

    getExportData() {
        // Return a clean copy of the state for export
        return JSON.parse(JSON.stringify(this.state));
    }

    // --- Utility Methods ---

    getPartyCharacters() {
        // Return list of party characters with their orders
        const chars = [];

        // Add Wonder
        chars.push({
            type: 'wonder',
            name: '원더',
            order: this.state.wonder.order,
            slotIndex: -1
        });

        // Add party members
        // - Exclude elucidator (index 3): no turn order
        // - Exclude members with order '-'
        this.state.party.forEach((member, idx) => {
            if (idx === 3) return;
            if (member && member.order !== '-') {
                const parsedOrder = parseInt(member.order);
                if (!Number.isFinite(parsedOrder)) return;

                chars.push({
                    type: 'party',
                    name: member.name,
                    order: parsedOrder,
                    slotIndex: idx
                });
            }
        });

        // Sort by order
        chars.sort((a, b) => a.order - b.order);

        return chars;
    }

    getCharacterByOrder(order) {
        // Find character with given order
        if (this.state.wonder.order === order) {
            return { type: 'wonder', name: '원더' };
        }

        for (let idx = 0; idx < this.state.party.length; idx++) {
            if (idx === 3) continue;
            const member = this.state.party[idx];
            if (member && parseInt(member.order) === order) {
                return { type: 'party', name: member.name };
            }
        }

        return null;
    }

    clearAll() {
        this._saveHistory();
        // Create initial 6 turns
        const initialTurns = [];
        for (let i = 1; i <= 6; i++) {
            initialTurns.push({ turn: i, columns: {} });
        }
        this.state = {
            title: '',
            memo: '',
            party: [null, null, null, null, null],
            wonder: {
                order: 1,
                weapon: '',
                weaponRefinement: 0,
                personas: [
                    { name: '', skills: ['', '', '', ''], memo: '' },
                    { name: '', skills: ['', '', '', ''], memo: '' },
                    { name: '', skills: ['', '', '', ''], memo: '' }
                ]
            },
            turns: initialTurns
        };
        this.clearLocalStorage();
        this.notify('fullReload', this.state);
        this.checkPartySideEffects();
    }
}
