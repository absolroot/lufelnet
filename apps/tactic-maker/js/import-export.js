/**
 * Tactic Maker V2 - Import/Export Module
 * Handles data compatibility with legacy tactic maker format
 */

export class ImportExport {
    constructor(store) {
        this.store = store;
        this.fileInput = document.getElementById('fileInput');
        this.btnImport = document.getElementById('btnImport');
        this.btnExport = document.getElementById('btnExport');

        this.initEventListeners();
        this.checkUrlParams();
    }

    initEventListeners() {
        // Import button click
        if (this.btnImport) {
            this.btnImport.addEventListener('click', () => {
                this.fileInput?.click();
            });
        }

        // File input change
        if (this.fileInput) {
            this.fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await this.importFromFile(file);
                    // Reset input for re-selecting same file
                    this.fileInput.value = '';
                }
            });
        }

        // Export button click
        if (this.btnExport) {
            this.btnExport.addEventListener('click', () => {
                this.exportToFile();
            });
        }
    }

    /**
     * Check URL params for shared data import
     */
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedData = urlParams.get('data');

        if (sharedData) {
            try {
                // Attempt LZString decompression if available
                let jsonString = sharedData;
                if (typeof LZString !== 'undefined') {
                    const decompressed = LZString.decompressFromEncodedURIComponent(sharedData);
                    if (decompressed) {
                        jsonString = decompressed;
                    }
                }

                const data = JSON.parse(jsonString);
                this.applyImportedData(data);

                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error('[ImportExport] Failed to parse URL data:', error);
            }
        }
    }

    /**
     * Detect format type: 'raw' | 'compressed' | 'unknown'
     */
    detectFormat(data) {
        if (Array.isArray(data.turns) && Array.isArray(data.party)) {
            return 'raw';
        }
        if (Array.isArray(data.t) && Array.isArray(data.p)) {
            return 'compressed';
        }
        return 'unknown';
    }

    /**
     * Import from file
     */
    async importFromFile(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            this.applyImportedData(data);
        } catch (error) {
            console.error('[ImportExport] Import failed:', error);
            alert('Invalid file format. Please select a valid tactic JSON file.');
        }
    }

    /**
     * Apply imported data to store
     */
    applyImportedData(data) {
        const format = this.detectFormat(data);

        if (format === 'unknown') {
            throw new Error('Unrecognized file format');
        }

        let internalState;
        if (format === 'raw') {
            internalState = this.parseRawFormat(data);
        } else {
            internalState = this.parseCompressedFormat(data);
        }

        // Load data into store
        this.store.loadData(internalState);

        // Update title input
        const titleInput = document.getElementById('tacticTitle');
        if (titleInput) {
            titleInput.value = internalState.title || '';
        }

        console.log('[ImportExport] Data imported successfully');
    }

    /**
     * Parse raw format to internal state
     */
    parseRawFormat(data) {
        const SPECIALS = ['HIGHLIGHT', 'ONE MORE', '총격', '근접', '방어', '아이템', 'Theurgia'];
        const wonderPersonas = data.wonderPersonas || ['', '', ''];

        // Parse party
        const party = (data.party || []).map((p, idx) => {
            if (!p || !p.name) return null;
            return {
                name: p.name,
                order: String(p.order || (idx + 1)),
                ritual: String(p.ritual || '0'),
                modification: '0', // Legacy format doesn't have this
                role: null,
                mainRev: p.mainRev || '',
                subRev: p.subRev || ''
            };
        });

        // Ensure 5 slots
        while (party.length < 5) {
            party.push(null);
        }

        // Parse wonder config
        const personaSkills = data.personaSkills || [];
        const wonder = {
            order: this.inferWonderOrder(party),
            weapon: { name: data.weapon || '', refinement: 0 },
            personas: wonderPersonas.map((name, idx) => ({
                name: name || '',
                skills: [
                    personaSkills[idx * 3] || '',     // Unique skill
                    personaSkills[idx * 3 + 1] || '', // Skill 2
                    personaSkills[idx * 3 + 2] || ''  // Skill 3
                ],
                memo: ''
            }))
        };

        // Parse turns and map actions to columns
        const turns = (data.turns || []).map(turn => {
            const columns = {};

            (turn.actions || []).forEach(action => {
                // Determine column key based on character
                let columnKey = this.getColumnKeyForCharacter(action.character, party, wonder);

                if (!columnKey) {
                    // Fallback: use order 1
                    columnKey = '1';
                }

                if (!columns[columnKey]) {
                    columns[columnKey] = [];
                }

                // Parse action
                let actionName = action.action || '';
                let personaName = '';
                let personaIndex = -1;

                // Handle Wonder persona/special actions
                if (action.character === '원더') {
                    const wp = action.wonderPersona;
                    if (typeof wp === 'string' && SPECIALS.includes(wp)) {
                        actionName = wp;
                    } else if (typeof actionName === 'string' && SPECIALS.includes(actionName)) {
                        // Already set
                    } else if (wp) {
                        // Persona selection
                        const isNumeric = /^\d+$/.test(String(wp));
                        if (isNumeric) {
                            personaIndex = parseInt(wp);
                            personaName = wonderPersonas[personaIndex] || '';
                        } else {
                            personaName = wp;
                            personaIndex = wonderPersonas.indexOf(personaName);
                        }
                    }
                }

                columns[columnKey].push({
                    type: action.type === 0 ? 'auto' : 'manual',
                    character: action.character || '',
                    wonderPersona: personaName,
                    wonderPersonaIndex: personaIndex,
                    action: actionName,
                    memo: action.memo || ''
                });
            });

            return {
                turn: turn.turn,
                customName: turn.customName,
                columns
            };
        });

        return {
            title: data.title || '',
            party,
            wonder,
            turns
        };
    }

    /**
     * Parse compressed format to internal state
     */
    parseCompressedFormat(data) {
        const SPECIALS = ['HIGHLIGHT', 'ONE MORE', '총격', '근접', '방어', '아이템', 'Theurgia'];
        const wonderPersonas = data.w || ['', '', ''];

        // Parse party (compressed: n=name, o=order, r=ritual, mr=mainRev, sr=subRev)
        const party = (data.p || []).map((p, idx) => {
            if (!p || !p.n) return null;
            return {
                name: p.n,
                order: String(p.o || (idx + 1)),
                ritual: String(p.r || '0'),
                modification: '0',
                role: null,
                mainRev: p.mr || '',
                subRev: p.sr || ''
            };
        });

        while (party.length < 5) {
            party.push(null);
        }

        // Parse wonder config
        const personaSkills = data.ps || [];
        const wonder = {
            order: this.inferWonderOrder(party),
            weapon: { name: data.wp || '', refinement: 0 },
            personas: wonderPersonas.map((name, idx) => ({
                name: name || '',
                skills: [
                    personaSkills[idx * 3] || '',
                    personaSkills[idx * 3 + 1] || '',
                    personaSkills[idx * 3 + 2] || ''
                ],
                memo: ''
            }))
        };

        // Parse turns (compressed: n=turn number, a=actions, c=character, w=wonderPersona, m=manual, mm=memo, a=action)
        const turns = (data.t || []).map(turn => {
            const columns = {};

            (turn.a || []).forEach(action => {
                let columnKey = this.getColumnKeyForCharacter(action.c, party, wonder);
                if (!columnKey) columnKey = '1';

                if (!columns[columnKey]) {
                    columns[columnKey] = [];
                }

                let actionName = action.a || '';
                let personaName = '';
                let personaIndex = -1;

                if (action.c === '원더') {
                    const wp = action.w;
                    if (typeof wp === 'string' && SPECIALS.includes(wp)) {
                        actionName = wp;
                    } else if (wp) {
                        const isNumeric = /^\d+$/.test(String(wp));
                        if (isNumeric) {
                            personaIndex = parseInt(wp);
                            personaName = wonderPersonas[personaIndex] || '';
                        } else {
                            personaName = wp;
                            personaIndex = wonderPersonas.indexOf(personaName);
                        }
                    }
                }

                columns[columnKey].push({
                    type: action.m ? 'manual' : 'auto',
                    character: action.c || '',
                    wonderPersona: personaName,
                    wonderPersonaIndex: personaIndex,
                    action: actionName,
                    memo: action.mm || ''
                });
            });

            return {
                turn: turn.n,
                customName: turn.cn,
                columns
            };
        });

        return {
            title: data.title || data.h || '',
            party,
            wonder,
            turns
        };
    }

    /**
     * Get column key (order) for a character
     */
    getColumnKeyForCharacter(charName, party, wonder) {
        if (!charName) return null;

        // Check if it's Wonder
        if (charName === '원더' || charName === 'Wonder') {
            return String(wonder.order);
        }

        // Find in party
        for (const member of party) {
            if (member && member.name === charName && member.order !== '-') {
                return member.order;
            }
        }

        return null;
    }

    /**
     * Infer Wonder's order from party data
     */
    inferWonderOrder(party) {
        // Find Wonder in party
        for (const member of party) {
            if (member && member.name === '원더' && member.order !== '-') {
                return parseInt(member.order) || 1;
            }
        }

        // Find first available order
        const usedOrders = party
            .filter(p => p && p.order !== '-')
            .map(p => parseInt(p.order));

        for (let i = 1; i <= 4; i++) {
            if (!usedOrders.includes(i)) {
                return i;
            }
        }

        return 1;
    }

    /**
     * Generate export data in legacy raw format
     */
    generateExportData() {
        const state = this.store.state;

        // Flatten turns columns back to actions array
        const turns = state.turns.map(turn => {
            const actions = this.flattenColumnsToActions(turn.columns, state.party, state.wonder);
            const turnData = {
                turn: turn.turn,
                actions
            };
            if (turn.customName) {
                turnData.customName = turn.customName;
            }
            return turnData;
        });

        // Build party array
        const party = state.party.map((member, idx) => {
            if (!member) {
                return {
                    name: '',
                    order: idx < 4 ? String(idx + 1) : '-',
                    ritual: '0',
                    mainRev: '',
                    subRev: ''
                };
            }
            return {
                name: member.name,
                order: member.order,
                ritual: String(member.ritual || '0'),
                mainRev: member.mainRev || '',
                subRev: member.subRev || ''
            };
        });

        // Build persona skills array (9 elements: 3 skills per persona)
        const personaSkills = state.wonder.personas.flatMap(p => p.skills);

        return {
            title: (state.title || '').slice(0, 20) || 'P5X Tactic',
            wonderPersonas: state.wonder.personas.map(p => p.name),
            weapon: state.wonder.weapon.name,
            personaSkills,
            party,
            turns
        };
    }

    /**
     * Flatten columns to actions array for export
     */
    flattenColumnsToActions(columns, party, wonder) {
        const actions = [];

        // Get sorted order keys
        const orderKeys = Object.keys(columns).sort((a, b) => {
            if (a === '-') return 1;
            if (b === '-') return -1;
            return parseInt(a) - parseInt(b);
        });

        // Build character order mapping
        const orderToChar = {};
        orderToChar[String(wonder.order)] = '원더';
        party.forEach(member => {
            if (member && member.name && member.order !== '-') {
                orderToChar[member.order] = member.name;
            }
        });

        // Flatten actions
        orderKeys.forEach(orderKey => {
            const columnActions = columns[orderKey] || [];
            columnActions.forEach(action => {
                const exportAction = {
                    type: action.type === 'auto' ? 0 : 1,
                    character: action.character || orderToChar[orderKey] || '',
                    wonderPersona: '',
                    action: action.action || '',
                    memo: action.memo || ''
                };

                // Handle Wonder persona
                if (action.character === '원더' || exportAction.character === '원더') {
                    if (action.wonderPersona) {
                        exportAction.wonderPersona = action.wonderPersona;
                    } else if (action.wonderPersonaIndex >= 0) {
                        exportAction.wonderPersona = wonder.personas[action.wonderPersonaIndex]?.name || '';
                    }
                }

                actions.push(exportAction);
            });
        });

        return actions;
    }

    /**
     * Export to file download
     */
    exportToFile() {
        const data = this.generateExportData();
        const jsonString = JSON.stringify(data, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        // Generate filename
        const title = data.title.replace(/[^a-zA-Z0-9가-힣]/g, '_').slice(0, 30) || 'tactic';
        const date = new Date().toISOString().slice(0, 10);
        a.download = `p5x_tactic_${title}_${date}.json`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('[ImportExport] Data exported successfully');
    }

    /**
     * Generate shareable URL (optional, for future use)
     */
    generateShareUrl() {
        const data = this.generateExportData();
        let jsonString = JSON.stringify(data);

        // Compress if LZString available
        if (typeof LZString !== 'undefined') {
            jsonString = LZString.compressToEncodedURIComponent(jsonString);
        } else {
            jsonString = encodeURIComponent(jsonString);
        }

        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?data=${jsonString}`;
    }
}
