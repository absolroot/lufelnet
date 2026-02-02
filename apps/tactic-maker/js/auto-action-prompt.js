/**
 * Tactic Maker V2 - Auto Action Prompt Module
 * 
 * Handles automatic action pattern prompts for characters.
 * This module is responsible for:
 * 1. Checking if a character has default patterns available
 * 2. Showing prompts to add default actions for characters without actions
 * 3. Special handling for Elucidator (해명 괴도) - shows prompt on first column
 * 
 * Dependencies:
 * - TacticStore (store.js) - for pattern checking and applying
 * - TacticSettingsUI (ui-settings.js) - for checking if auto prompt is enabled
 * - I18nService - for localized prompt text
 * - ritualPatterns (pattern.js) - for pattern data
 */

export class AutoActionPrompt {
    /**
     * @param {Object} store - TacticStore instance
     * @param {Object} settingsUI - TacticSettingsUI instance
     * @param {string} baseUrl - Base URL for assets
     */
    constructor(store, settingsUI, baseUrl) {
        this.store = store;
        this.settingsUI = settingsUI;
        this.baseUrl = baseUrl || window.BASE_URL || '';
    }

    /**
     * Get localized prompt text for adding default pattern
     * @returns {string} Localized prompt text
     */
    getPromptText() {
        if (window.I18nService && window.I18nService.t) {
            return window.I18nService.t('addDefaultPatternPrompt', 'Add default pattern?');
        }
        return '기본 패턴을 추가하시겠습니까?';
    }

    /**
     * Get localized Yes/No button text
     * @returns {{ yes: string, no: string }}
     */
    getButtonText() {
        return {
            yes: window.I18nService ? window.I18nService.t('yes') : 'Yes',
            no: window.I18nService ? window.I18nService.t('no') : 'No'
        };
    }

    /**
     * Check if auto action prompt is enabled in settings
     * @returns {boolean}
     */
    isPromptEnabled() {
        return this.settingsUI ? this.settingsUI.getAutoActionPrompt() : true;
    }

    /**
     * Check if any turn has actions for a specific column
     * @param {string} colKey - Column key (order number or 'mystery')
     * @returns {boolean}
     */
    hasActionsForColumn(colKey) {
        for (const turn of this.store.state.turns) {
            if (turn.columns[colKey] && turn.columns[colKey].length > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if there are any actions by a specific character name in the entire board
     * @param {string} charName - Character name to check
     * @returns {boolean}
     */
    hasActionsForCharacter(charName) {
        for (const turn of this.store.state.turns) {
            for (const colKey in turn.columns) {
                const actions = turn.columns[colKey] || [];
                for (const action of actions) {
                    if (action.character === charName) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Get the Elucidator character data from party (index 3)
     * @returns {Object|null}
     */
    getElucidator() {
        return this.store.state.party[3] || null;
    }

    /**
     * Check if Elucidator has a default pattern available
     * @returns {boolean}
     */
    hasElucidatorPattern() {
        const elucidator = this.getElucidator();
        if (!elucidator || !elucidator.name) return false;

        const ritualLevel = elucidator.ritual || '0';
        
        // Check if pattern exists for this character
        if (typeof ritualPatterns === 'undefined' || !ritualPatterns[elucidator.name]) {
            return false;
        }

        const characterPatterns = ritualPatterns[elucidator.name];
        const matchingPattern = characterPatterns.find(patternData => {
            if (patternData.level.includes('-')) {
                const [min, max] = patternData.level.split('-').map(Number);
                const level = Number(ritualLevel);
                return level >= min && level <= max;
            } else {
                return String(patternData.level) === String(ritualLevel);
            }
        });

        return !!matchingPattern;
    }

    /**
     * Apply Elucidator's default pattern to the first column (order 1)
     */
    applyElucidatorPattern() {
        const elucidator = this.getElucidator();
        if (!elucidator || !elucidator.name) return;

        const ritualLevel = elucidator.ritual || '0';
        
        if (typeof ritualPatterns === 'undefined' || !ritualPatterns[elucidator.name]) {
            return;
        }

        const characterPatterns = ritualPatterns[elucidator.name];
        const matchingPattern = characterPatterns.find(patternData => {
            if (patternData.level.includes('-')) {
                const [min, max] = patternData.level.split('-').map(Number);
                const level = Number(ritualLevel);
                return level >= min && level <= max;
            } else {
                return String(patternData.level) === String(ritualLevel);
            }
        });

        if (!matchingPattern || !matchingPattern.pattern) return;

        const pattern = matchingPattern.pattern;

        // Get sorted party to find actual column keys
        const sortedChars = this.store.getSortedParty();
        
        // Build order mapping: pattern order -> actual column key
        // order 0 = first column, order 1 = second column, etc.
        const orderToColKey = {};
        sortedChars.forEach((char, idx) => {
            const colKey = char.type === 'wonder' ? 'mystery' : String(char.order);
            orderToColKey[idx] = colKey;
        });

        // Apply pattern to turns
        this.store._saveHistory();
        this.store.state.turns.forEach((turn, idx) => {
            if (pattern[idx]) {
                pattern[idx].forEach(actionDef => {
                    const patternOrder = actionDef.order !== undefined ? actionDef.order : 0;
                    const targetColKey = orderToColKey[patternOrder];
                    
                    if (!targetColKey) return;
                    
                    if (!turn.columns[targetColKey]) {
                        turn.columns[targetColKey] = [];
                    }

                    let actionType = actionDef.type || '';
                    if (actionType === '테우르기아') {
                        actionType = 'Theurgia';
                    }
                    
                    const newAction = {
                        character: elucidator.name,
                        wonderPersona: '',
                        wonderPersonaIndex: -1,
                        action: actionType,
                        memo: ''
                    };
                    turn.columns[targetColKey].push(newAction);
                });
            }
        });
        
        this.store.notify('turnsChange', this.store.state.turns);
    }

    /**
     * Create a prompt element for adding default actions
     * @param {string} colKey - Column key for which to show the prompt
     * @param {Function} onYes - Callback when Yes is clicked
     * @param {Function} onNo - Callback when No is clicked
     * @returns {HTMLElement}
     */
    createPromptElement(colKey, onYes, onNo) {
        const promptDiv = document.createElement('div');
        promptDiv.className = 'auto-action-prompt';

        const promptText = this.getPromptText();
        const buttonText = this.getButtonText();

        promptDiv.innerHTML = `
            <span class="prompt-text">${promptText}</span>
            <div class="prompt-buttons">
                <button type="button" class="btn-prompt-yes">${buttonText.yes}</button>
                <button type="button" class="btn-prompt-no">${buttonText.no}</button>
            </div>
        `;

        // Bind events
        promptDiv.querySelector('.btn-prompt-yes').addEventListener('click', (e) => {
            e.stopPropagation();
            if (onYes) onYes();
        });

        promptDiv.querySelector('.btn-prompt-no').addEventListener('click', (e) => {
            e.stopPropagation();
            if (onNo) onNo();
            else promptDiv.remove();
        });

        return promptDiv;
    }

    /**
     * Create Elucidator prompt header element
     * Shows above the first column when Elucidator needs action prompt
     * @param {Function} onYes - Callback when Yes is clicked
     * @param {Function} onNo - Callback when No is clicked
     * @returns {HTMLElement}
     */
    createElucidatorPromptHeader(onYes, onNo) {
        const elucidator = this.getElucidator();
        if (!elucidator) return null;

        const charData = (window.characterData || {})[elucidator.name] || {};
        const charColor = charData.color || null;

        const wrapper = document.createElement('div');
        wrapper.className = 'elucidator-prompt-header';

        const imgPath = `${this.baseUrl}/assets/img/tier/${elucidator.name}.webp`;

        // Get display name
        let displayName = elucidator.name;
        if (window.I18nService) {
            const lang = window.I18nService.currentLang || 'kr';
            if (lang === 'en' && charData.codename) {
                displayName = charData.codename;
            } else if (lang === 'jp' && charData.name_jp) {
                displayName = charData.name_jp;
            }
        }

        wrapper.innerHTML = `
            <div class="cell-char-header elucidator-temp-header">
                <img src="${imgPath}" alt="${displayName}"
                     onerror="this.style.display='none'"
                     class="cell-char-img">
                <span class="cell-char-name">${displayName}</span>
            </div>
        `;

        const cellHeader = wrapper.querySelector('.cell-char-header');
        
        // Apply color tint
        if (charColor) {
            cellHeader.style.background = this.hexToRgba(charColor, 0.15);
            cellHeader.style.borderBottom = `2px solid ${this.hexToRgba(charColor, 0.5)}`;
        }

        // Add prompt
        const prompt = this.createPromptElement('elucidator', onYes, () => {
            wrapper.remove();
            if (onNo) onNo();
        });
        cellHeader.appendChild(prompt);

        return wrapper;
    }

    /**
     * Convert hex color to rgba
     * @param {string} hex - Hex color code
     * @param {number} alpha - Alpha value (0-1)
     * @returns {string} RGBA color string
     */
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

    /**
     * Check and show prompt for a regular party member or Wonder column
     * Called during turn rendering for the first turn only
     * 
     * @param {HTMLElement} cellHeader - The cell header element to append prompt to
     * @param {Object} char - Character data { type, name, order, displayName }
     * @param {string} colKey - Column key
     */
    checkAndShowColumnPrompt(cellHeader, char, colKey) {
        if (!this.isPromptEnabled()) return;

        // Check if this column already has actions
        if (this.hasActionsForColumn(colKey)) return;

        // Check if character has a default pattern
        if (!this.store.hasDefaultPattern(colKey)) return;

        // Create and append prompt
        const prompt = this.createPromptElement(
            colKey,
            () => this.store.applyDefaultPattern(colKey),
            () => prompt.remove()
        );

        cellHeader.appendChild(prompt);
    }

    /**
     * Check and show Elucidator prompt on the first column
     * Should be called during turn rendering for the first turn only
     * 
     * @param {HTMLElement} firstColumnTd - The first column's td element (order 1)
     * @returns {boolean} True if prompt was shown
     */
    checkAndShowElucidatorPrompt(firstColumnTd) {
        //console.log('[Elucidator Debug] checkAndShowElucidatorPrompt called');
        
        if (!this.isPromptEnabled()) {
            //console.log('[Elucidator Debug] Prompt disabled');
            return false;
        }

        const elucidator = this.getElucidator();
        //console.log('[Elucidator Debug] Elucidator:', elucidator);
        if (!elucidator || !elucidator.name) {
            //console.log('[Elucidator Debug] No elucidator or no name');
            return false;
        }

        // Check if Elucidator has any actions in the entire board
        if (this.hasActionsForCharacter(elucidator.name)) {
            //console.log('[Elucidator Debug] Already has actions for:', elucidator.name);
            return false;
        }

        // Check if Elucidator has a default pattern
        //console.log('[Elucidator Debug] ritualPatterns available:', typeof ritualPatterns !== 'undefined');
        //console.log('[Elucidator Debug] ritualPatterns keys:', typeof ritualPatterns !== 'undefined' ? Object.keys(ritualPatterns) : 'N/A');
        //console.log('[Elucidator Debug] hasElucidatorPattern:', this.hasElucidatorPattern());
        if (!this.hasElucidatorPattern()) {
            //console.log('[Elucidator Debug] No pattern for elucidator');
            return false;
        }

        // Create Elucidator header and insert it above the first column's header
        const existingHeader = firstColumnTd.querySelector('.cell-char-header');
        if (!existingHeader) return false;

        const elucidatorHeader = this.createElucidatorPromptHeader(
            () => {
                // Apply pattern and remove the header
                this.applyElucidatorPattern();
                if (elucidatorHeader && elucidatorHeader.parentNode) {
                    elucidatorHeader.remove();
                }
            },
            () => {
                // Just remove the header, nothing else needed
            }
        );

        if (elucidatorHeader) {
            existingHeader.parentNode.insertBefore(elucidatorHeader, existingHeader);
            return true;
        }

        return false;
    }
}
