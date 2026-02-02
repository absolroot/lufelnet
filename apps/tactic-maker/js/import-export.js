/**
 * Tactic Maker V2 - Import/Export Module
 * Handles data compatibility with legacy tactic maker format
 */

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzxSnf6_09q_LDRKIkmBvE2oTtQaLnK22M9ozrHMUAV0JnND9sc6CTILlnBS7_T8FIe/exec';

export class ImportExport {
    constructor(store) {
        this.store = store;
        this.fileInput = document.getElementById('fileInput');
        this.btnImport = document.getElementById('btnImport');
        this.btnExport = document.getElementById('btnExport');
        this.btnShare = document.getElementById('btnShare');
        this.btnUpload = document.getElementById('btnUpload');

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

        // Share button click
        if (this.btnShare) {
            console.log('[ImportExport] Share button listener attached');
            this.btnShare.addEventListener('click', () => {
                console.log('[ImportExport] Share button clicked');
                this.shareTactic();
            });
        }

        // Upload button click
        if (this.btnUpload) {
            this.btnUpload.addEventListener('click', () => {
                this.uploadTactic();
            });
        }
    }

    /**
     * Check URL params for shared data import
     */
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedData = urlParams.get('data');
        const binId = urlParams.get('bin');
        const libraryCode = urlParams.get('library');

        if (libraryCode) {
            this.fetchFromLibrary(libraryCode);
        } else if (binId) {
            this.fetchFromBin(binId);
        } else if (sharedData) {
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
     * Fetch tactic data from Supabase library (tactics table)
     */
    async fetchFromLibrary(code) {
        try {
            console.log('[ImportExport] Fetching from library:', code);

            // Wait for supabase to be available
            const waitForSupabase = () => new Promise((resolve) => {
                const check = () => {
                    if (typeof supabase !== 'undefined') {
                        resolve(true);
                    } else {
                        setTimeout(check, 100);
                    }
                };
                check();
                // Timeout after 5 seconds
                setTimeout(() => resolve(false), 5000);
            });

            const supabaseReady = await waitForSupabase();
            if (!supabaseReady) {
                console.error('[ImportExport] Supabase not available');
                return;
            }

            const { data, error } = await supabase
                .from('tactics')
                .select('title, query, tactic_version')
                .eq('url', code)
                .maybeSingle();

            if (error || !data) {
                console.error('[ImportExport] Library fetch error:', error);
                return;
            }

            let payload = data.query;
            if (typeof payload === 'string') {
                try {
                    payload = JSON.parse(payload);
                } catch (e) {
                    console.error('[ImportExport] Failed to parse library data:', e);
                    return;
                }
            }

            if (!payload || typeof payload !== 'object') {
                console.error('[ImportExport] Invalid library payload');
                return;
            }

            // Apply the data with title override if available
            this.applyImportedData(payload);

            // Update title if provided
            if (data.title) {
                const titleInput = document.getElementById('tacticTitle');
                if (titleInput) {
                    titleInput.value = data.title;
                }
                // Also update store title
                if (this.store && this.store.state) {
                    this.store.state.title = data.title;
                }
            }

            console.log('[ImportExport] Library data loaded successfully');

        } catch (error) {
            console.error('[ImportExport] Failed to fetch library data:', error);
        }
    }

    /**
     * Detect format type: 'v3' | 'raw' | 'compressed' | 'unknown'
     * v3 = tactic-maker-ver >= 3.0 (direct JSON load)
     * raw = legacy format (needs parseRawFormat)
     */
    detectFormat(data) {
        // Check for v3.0+ format
        const version = data['tactic-maker-ver'];
        if (version) {
            const vNum = parseFloat(version);
            if (vNum >= 3.0) {
                return 'v3';
            }
        }
        
        // Legacy raw format
        if (Array.isArray(data.turns) && Array.isArray(data.party)) {
            return 'raw';
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
        
        if (format === 'v3') {
            // v3.0+ format: direct load (remove version field before loading)
            internalState = { ...data };
            delete internalState['tactic-maker-ver'];
        } else {
            // Legacy format: parse through conversion
            internalState = this.parseRawFormat(data);
        }

        // Load data into store
        this.store.loadData(internalState);

        // Update title input
        const titleInput = document.getElementById('tacticTitle');
        if (titleInput) {
            titleInput.value = internalState.title || '';
        }

        // Update memo input
        const memoInput = document.getElementById('tacticMemo');
        if (memoInput) {
            memoInput.value = internalState.memo || '';
        }

        console.log('[ImportExport] Data imported successfully');
    }

    /**
     * Parse raw format to internal state
     */
    parseRawFormat(data) {
        const SPECIALS = ['HIGHLIGHT', 'ONE MORE', '총격', '근접', '방어', '아이템', 'Theurgia', '테우르기아', '특수 스킬'];
        const wonderPersonas = data.wonderPersonas || ['', '', ''];

        let wonderOrderFromParty = null;

        // Parse party (legacy export already uses the same slot ordering as new store)
        // New store: [slot1, slot2, slot3, elucidator, slot4]
        const party = [null, null, null, null, null];

        const legacyParty = Array.isArray(data.party) ? data.party : [];
        const nonWonder = [];

        legacyParty.forEach((p) => {
            if (!p || !p.name) return;

            if (p.name === '원더' || p.name === 'Wonder') {
                const ord = parseInt(String(p.order || ''), 10);
                if (Number.isFinite(ord)) {
                    wonderOrderFromParty = ord;
                }
                return;
            }

            nonWonder.push(p);
        });

        const elucidatorCandidate = nonWonder.find(p => String(p.order || '') === '-');
        const battleCandidates = nonWonder.filter(p => String(p.order || '') !== '-');

        battleCandidates.sort((a, b) => {
            const ao = parseInt(String(a.order || ''), 10);
            const bo = parseInt(String(b.order || ''), 10);

            const an = Number.isFinite(ao);
            const bn = Number.isFinite(bo);
            if (an && bn) return ao - bo;
            if (an && !bn) return -1;
            if (!an && bn) return 1;
            return 0;
        });

        const toInternalPartyMember = (p, forceOrderDash, fallbackOrder) => {
            return {
                name: p.name,
                order: forceOrderDash ? '-' : String(p.order || fallbackOrder || ''),
                ritual: String(p.ritual || '0'),
                modification: '0',
                role: null,
                mainRev: p.mainRev || '',
                subRev: p.subRev || ''
            };
        };

        for (let i = 0; i < 3; i++) {
            const p = battleCandidates[i];
            if (!p) continue;
            party[i] = toInternalPartyMember(p, false, String(i + 1));
        }

        if (elucidatorCandidate) {
            party[3] = toInternalPartyMember(elucidatorCandidate, true);
        }

        const slot4Candidate = battleCandidates[3];
        if (slot4Candidate) {
            party[4] = toInternalPartyMember(slot4Candidate, true);
        }

        const resolvedWonderOrder = Number.isFinite(wonderOrderFromParty)
            ? wonderOrderFromParty
            : this.inferWonderOrder(party);

        // Parse wonder config
        const personaSkills = data.personaSkills || [];
        const wonder = {
            order: resolvedWonderOrder,
            weapon: data.weapon || '',
            weaponRefinement: 0,
            personas: wonderPersonas.map((name, idx) => ({
                name: name || '',
                skills: [
                    personaSkills[idx * 3] || '',
                    personaSkills[idx * 3 + 1] || '',
                    personaSkills[idx * 3 + 2] || '',
                    ''
                ],
                memo: ''
            }))
        };

        const buildColumnPlan = () => {
            const plan = [];
            plan.push({ orderKey: String(wonder.order), actor: '원더' });
            (party || []).forEach((m, idx) => {
                if (!m) return;
                if (idx === 3) return; // elucidator
                if (String(m.order || '-') === '-') return;
                if (m.name === '원더') return;
                plan.push({ orderKey: String(m.order), actor: String(m.name || '') });
            });
            plan.sort((a, b) => parseInt(a.orderKey, 10) - parseInt(b.orderKey, 10));
            const seen = new Set();
            return plan.filter(p => {
                if (!p.orderKey || p.orderKey === '-') return false;
                if (seen.has(p.orderKey)) return false;
                seen.add(p.orderKey);
                return true;
            });
        };

        const normalizeActorName = (name) => {
            if (name === 'Wonder') return '원더';
            return String(name || '');
        };

        const normalizeActionValue = (val) => {
            const v = String(val || '');
            if (v === '테우르기아') return 'Theurgia';
            return v;
        };

        const personaSkillCandidates = (personaSkills || [])
            .map(s => String(s || ''))
            .filter(Boolean)
            .sort((a, b) => b.length - a.length);

        const extractLeadingPersonaSkill = (text) => {
            const src = String(text || '');
            if (!src) return null;

            for (const skill of personaSkillCandidates) {
                if (!skill) continue;
                if (src === skill) {
                    return { skill, rest: '' };
                }
                if (src.startsWith(skill)) {
                    const next = src.slice(skill.length, skill.length + 1);
                    if (!next) continue;
                    if (['>', ' ', '/', ',', ':', '(', '[', '-', '→'].includes(next)) {
                        const rest = src
                            .slice(skill.length)
                            .replace(/^[>\s\/,\-:→]+/g, '')
                            .trim();
                        return { skill, rest };
                    }
                }
            }
            return null;
        };

        const columnPlan = buildColumnPlan();

        const splitActionsIntoColumns = (actions) => {
            const columns = {};
            if (!Array.isArray(actions) || actions.length === 0) return columns;
            if (!Array.isArray(columnPlan) || columnPlan.length === 0) {
                columns['1'] = [];
                return { ...columns, __all: actions };
            }

            const orderKeys = columnPlan.map(p => p.orderKey);
            const actorIndex = new Map(columnPlan.map((p, idx) => [p.actor, idx]));

            const isTurnSkill123 = (actionVal) => {
                const v = normalizeActionValue(actionVal);
                // 스킬1,2,3 + 총격 + 방어 + 아이템
                return /^스킬[123]$/.test(v) || /^Skill[123]$/.test(v) || /^スキル[123]$/.test(v)
                    || /^총격$/i.test(v) || /^Gun$/i.test(v) || /^銃撃$/i.test(v)
                    || /^방어$/i.test(v) || /^Defense$/i.test(v) || /^Guard$/i.test(v) || /^防御$/i.test(v)
                    || /^아이템$/i.test(v) || /^Item$/i.test(v) || /^アイテム$/i.test(v);
            };

            const isHighlight = (actionVal) => {
                const v = normalizeActionValue(actionVal);
                // 하이라이트 + 테우르기아
                return v === 'HIGHLIGHT' 
                    || /^테우르기아$/i.test(v) || /^Theurgia$/i.test(v) || /^Theurgy$/i.test(v) || /^テウルギア$/i.test(v);
            };

            let currentColIdx = 0;

            for (const a of actions) {
                const actor = normalizeActorName(a?.character);
                const idx = actorIndex.has(actor) ? actorIndex.get(actor) : null;
                const actionVal = a?.action;

                const shouldAdvance = (idx !== null && idx >= currentColIdx)
                    && (isTurnSkill123(actionVal) || actor === '원더');

                if (shouldAdvance) {
                    currentColIdx = idx;
                }

                const placeColIdx = (idx !== null && isHighlight(actionVal))
                    ? idx
                    : currentColIdx;

                const orderKey = orderKeys[placeColIdx] || orderKeys[0] || '1';
                if (!columns[orderKey]) columns[orderKey] = [];
                columns[orderKey].push(a);
            }

            for (let i = 0; i < orderKeys.length - 1; i++) {
                const key = orderKeys[i];
                const nextKey = orderKeys[i + 1];
                const list = columns[key];
                if (!Array.isArray(list) || list.length === 0) continue;

                const last = list[list.length - 1];
                if (!last) continue;
                if (!isHighlight(last.action)) continue;

                if (!columns[nextKey]) columns[nextKey] = [];
                columns[nextKey].push(list.pop());
            }

            return columns;
        };

        const parseLegacyActionToInternal = (legacyAction) => {
            const actor = normalizeActorName(legacyAction?.character);
            let memo = String(legacyAction?.memo || '');
            const rawActionVal = normalizeActionValue(legacyAction?.action);

            const isNote = !actor && !rawActionVal && !!memo;

            if (isNote) {
                return {
                    type: 'manual',
                    isNote: true,
                    character: '',
                    wonderPersona: '',
                    wonderPersonaIndex: -1,
                    action: '',
                    memo
                };
            }

            let actionName = rawActionVal;
            let personaName = '';
            let personaIndex = -1;

            if (actor === '원더') {
                const wp = legacyAction?.wonderPersona;
                const wpStr = String(wp ?? '');

                if (wpStr && SPECIALS.includes(wpStr)) {
                    actionName = normalizeActionValue(wpStr);
                } else if (actionName && SPECIALS.includes(actionName)) {
                    // noop
                } else if (wpStr) {
                    const isNumeric = /^\d+$/.test(wpStr);
                    if (isNumeric) {
                        personaIndex = parseInt(wpStr, 10);
                        personaName = wonderPersonas[personaIndex] || '';
                    } else {
                        personaName = wpStr;
                        personaIndex = wonderPersonas.indexOf(personaName);
                    }
                }

                if (!actionName && memo) {
                    const extracted = extractLeadingPersonaSkill(memo);
                    if (extracted && extracted.skill) {
                        actionName = extracted.skill;
                        memo = extracted.rest || '';
                    }
                }
            }

            return {
                type: legacyAction?.type === 0 ? 'auto' : 'manual',
                character: actor,
                wonderPersona: personaName,
                wonderPersonaIndex: personaIndex,
                action: actionName,
                memo
            };
        };

        // Parse turns and map actions to columns (order-preserving split)
        const turns = (data.turns || []).map(turn => {
            const columns = {};

            const segmented = splitActionsIntoColumns(turn.actions || []);
            Object.keys(segmented).forEach(orderKey => {
                const list = segmented[orderKey] || [];
                if (!Array.isArray(list) || list.length === 0) return;
                if (!columns[orderKey]) columns[orderKey] = [];
                list.forEach(legacyAction => {
                    const internal = parseLegacyActionToInternal(legacyAction);
                    if (internal) columns[orderKey].push(internal);
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
            memo: data.memo || '',
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
     * Generate export data in v3.0 format (direct state export)
     */
    generateExportData() {
        const state = this.store.state;

        // v3.0 format: export state directly with version marker
        return {
            'tactic-maker-ver': '3.0',
            title: state.title || '',
            memo: state.memo || '',
            party: state.party,
            wonder: state.wonder,
            turns: state.turns,
            needStatSelections: state.needStatSelections || {}
        };
    }
    
    /**
     * Generate export data in legacy raw format (for compatibility)
     */
    generateLegacyExportData() {
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

        // Build persona skills array (legacy expects 9 elements: 3 skills per persona)
        const personaSkills = (state.wonder.personas || []).flatMap(p => (p && Array.isArray(p.skills) ? p.skills.slice(0, 3) : ['', '', '']));
        while (personaSkills.length < 9) personaSkills.push('');
        if (personaSkills.length > 9) personaSkills.length = 9;

        const weaponVal = (state.wonder && state.wonder.weapon && typeof state.wonder.weapon === 'object')
            ? (state.wonder.weapon.name || '')
            : (state.wonder.weapon || '');

        return {
            title: (state.title || '').slice(0, 20) || 'P5X Tactic',
            memo: state.memo || '',
            wonderPersonas: state.wonder.personas.map(p => p.name),
            weapon: weaponVal,
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
                const isNote = !!action.isNote || (!action.character && !action.action && !!action.memo);
                const exportAction = {
                    type: action.type === 'auto' ? 0 : 1,
                    character: isNote ? '' : (action.character || orderToChar[orderKey] || ''),
                    wonderPersona: '',
                    action: isNote ? '' : (action.action || ''),
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

    /**
     * Upload tactic to library (requires login)
     */
    async uploadTactic() {
        const t = (key) => window.I18nService ? window.I18nService.t(key) : key;

        try {
            // Generate export data
            const tacticData = this.generateExportData();
            
            // Store tactic data in sessionStorage for transfer to upload page
            sessionStorage.setItem('tacticUploadData', JSON.stringify(tacticData));
            
            // Check if user is logged in via Supabase
            if (typeof supabase === 'undefined') {
                console.error('[ImportExport] Supabase not available');
                alert(t('uploadFailed') || '업로드에 실패했습니다.');
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session || !session.user) {
                // Not logged in - redirect to login page with return URL
                const returnUrl = encodeURIComponent('/tactic/tactic-upload.html?fromMaker=1');
                window.location.href = `/login/?redirect=${returnUrl}`;
                return;
            }

            // Logged in - redirect to upload page
            window.location.href = '/tactic/tactic-upload.html?fromMaker=1';

        } catch (error) {
            console.error('[ImportExport] Upload failed:', error);
            const t = (key) => window.I18nService ? window.I18nService.t(key) : key;
            alert(t('uploadFailed') || '업로드에 실패했습니다.');
        }
    }

    /**
     * Share tactic via GAS and get short link
     */
    async shareTactic() {
        const t = (key) => window.I18nService ? window.I18nService.t(key) : key;

        try {
            // Show loading
            const originalText = this.btnShare.querySelector('span').textContent;
            this.btnShare.disabled = true;
            this.btnShare.querySelector('span').textContent = t('sharing');

            const data = this.generateExportData();
            let jsonString = JSON.stringify(data);

            if (typeof LZString !== 'undefined') {
                jsonString = LZString.compressToEncodedURIComponent(jsonString);
            }

            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify({ data: jsonString })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const result = await response.json();
            if (result.id) {
                const baseUrl = window.location.origin + window.location.pathname;
                const shareUrl = `${baseUrl}?bin=${result.id}`;

                // Copy to clipboard
                await navigator.clipboard.writeText(shareUrl);
                alert(t('shareSuccess'));
            } else {
                throw new Error('No ID returned');
            }

            // Restore button
            this.btnShare.disabled = false;
            this.btnShare.querySelector('span').textContent = originalText;

        } catch (error) {
            console.error('[ImportExport] Share failed:', error);
            alert(t('shareFailed'));
            this.btnShare.disabled = false;
            if (this.btnShare.querySelector('span')) {
                this.btnShare.querySelector('span').textContent = t('share');
            }
        }
    }

    /**
     * Fetch data from GAS bin
     */
    async fetchFromBin(binId) {
        try {
            // Show a simple loading state if possible, but for now just console
            console.log('[ImportExport] Fetching from bin:', binId);

            const response = await fetch(`${GAS_URL}?id=${binId}`);
            if (!response.ok) throw new Error('Failed to fetch from GAS');

            const result = await response.json();
            if (result.data) {
                let jsonString = result.data;
                if (typeof LZString !== 'undefined') {
                    const decompressed = LZString.decompressFromEncodedURIComponent(jsonString);
                    if (decompressed) {
                        jsonString = decompressed;
                    }
                }
                const data = JSON.parse(jsonString);
                this.applyImportedData(data);

                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                console.error('[ImportExport] Bin not found:', binId);
            }
        } catch (error) {
            console.error('[ImportExport] Failed to fetch bin data:', error);
        }
    }
}
