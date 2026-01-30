/**
 * Tactic Maker V2 - State Management Store
 */

export class TacticStore {
    constructor() {
        // Initial State
        this.state = {
            title: "",
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
            }))
        };

        this.listeners = [];

        // Undo/Redo support
        this.undoStack = [];
        this.redoStack = [];
        this.maxHistory = 30;
        this._skipHistory = false;
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
        this.state.party[slotIndex] = characterData;
        this.notify('partyChange', { slotIndex, characterData });

        // Check for side-effects (e.g. Fuuka in Elucidator -> Show Slot 4)
        this.checkPartySideEffects();
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
        this.state.wonder = { ...this.state.wonder, ...config };
        this.notify('wonderChange', this.state.wonder);
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

    addAction(turnIndex, columnKey, actionData) {
        this._saveHistory();
        // Ensure turn exists
        if (!this.state.turns[turnIndex]) return;

        if (!this.state.turns[turnIndex].columns[columnKey]) {
            this.state.turns[turnIndex].columns[columnKey] = [];
        }

        // Normalize action data
        // NOTE: action.type(auto/manual) is deprecated; keep the field out for new actions.
        const action = {
            character: actionData.character || '',
            wonderPersona: actionData.wonderPersona || '',
            wonderPersonaIndex: actionData.wonderPersonaIndex ?? -1,
            action: actionData.action || '',
            memo: actionData.memo || ''
        };

        this.state.turns[turnIndex].columns[columnKey].push(action);
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
            turns: data.turns || []
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
        this.state = {
            title: '',
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
            turns: []
        };
        this.notify('fullReload', this.state);
        this.checkPartySideEffects();
    }
}
