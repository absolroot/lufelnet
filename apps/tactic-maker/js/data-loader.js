/**
 * Tactic Maker V2 - Data Loader
 * Ensures all required data is loaded before the app initializes
 */

export class DataLoader {
    static _dataReady = false;
    static _loadPromise = null;
    static _characterSettingPromises = new Map();

    /**
     * Ensure all required data is loaded
     * @returns {Promise<void>}
     */
    static async ensureData() {
        if (this._dataReady) return;
        if (this._loadPromise) return this._loadPromise;

        this._loadPromise = new Promise((resolve) => {
            const maxAttempts = 100; // 10 seconds max
            let attempts = 0;

            const start = () => {
                const check = () => {
                    attempts++;

                    // Check required data
                    const hasCharacterData = window.characterData && Object.keys(window.characterData).length > 0;
                    const hasCharacterList = window.characterList && (
                        (window.characterList.mainParty && window.characterList.mainParty.length > 0) ||
                        (window.characterList.supportParty && window.characterList.supportParty.length > 0)
                    );

                    // Optional data (nice to have but not blocking)
                    const hasWeapons = window.matchWeapons && Object.keys(window.matchWeapons).length > 0;
                    const hasPersonas = window.personaFiles && Object.keys(window.personaFiles).length > 0;
                    const hasSkills = window.personaSkillList && Object.keys(window.personaSkillList).length > 0;
                    const hasRevelations = window.revelationData && window.revelationData.main;

                    // Minimum required: characterData
                    // For Wonder components we strongly need weapons/personas/skills too
                    const minimalReady = hasCharacterData;
                    const fullReady = minimalReady && hasWeapons && hasPersonas && hasSkills;

                    if ((fullReady) || attempts >= maxAttempts) {
                        this._dataReady = true;

                        // Log data status
                        console.log('[DataLoader] Data status:', {
                            characterData: hasCharacterData,
                            characterList: hasCharacterList,
                            weapons: hasWeapons,
                            personas: hasPersonas,
                            skills: hasSkills,
                            revelations: hasRevelations,
                            attempts
                        });

                        resolve();
                        return;
                    }

                    // Retry
                    setTimeout(check, 100);
                };
                check();
            };

            if (typeof window.ensurePersonaFilesLoaded === 'function') {
                window.ensurePersonaFilesLoaded(start);
            } else {
                start();
            }
        });

        return this._loadPromise;
    }

    /**
     * Get character data
     */
    static getCharacterData() {
        return window.characterData || {};
    }

    /**
     * Get character list
     */
    static getCharacterList() {
        return window.characterList || { mainParty: [], supportParty: [] };
    }

    /**
     * Get weapon data
     */
    static getWeaponList() {
        return window.matchWeapons || {};
    }

    /**
     * Get persona data
     */
    static getPersonaList() {
        return window.personaFiles || {};
    }

    /**
     * Get skill data
     */
    static getSkillList() {
        return window.personaSkillList || {};
    }

    /**
     * Get revelation data
     */
    static getRevelationData() {
        return window.revelationData || { main: {}, sub: {}, sub_effects: {} };
    }

    /**
     * Load character setting file (recommended revelations etc.) on demand.
     * data/characters/<NAME>/setting.js -> window.characterSetting[NAME]
     */
    static loadCharacterSetting(charName) {
        const name = String(charName || '').trim();
        if (!name) return Promise.resolve(false);

        if (window.characterSetting && window.characterSetting[name]) {
            return Promise.resolve(true);
        }

        if (this._characterSettingPromises.has(name)) {
            return this._characterSettingPromises.get(name);
        }

        const baseUrl = window.BASE_URL || '';
        const version = (typeof window.APP_VERSION !== 'undefined' && window.APP_VERSION)
            ? `?v=${encodeURIComponent(String(window.APP_VERSION))}`
            : '';

        const src = `${baseUrl}/data/characters/${encodeURIComponent(name)}/setting.js${version}`;

        const p = new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
                resolve(!!(window.characterSetting && window.characterSetting[name]));
            };
            script.onerror = () => {
                resolve(false);
            };
            document.head.appendChild(script);
        });

        this._characterSettingPromises.set(name, p);
        return p;
    }

    /**
     * Get character display name (with translation)
     */
    static getCharacterDisplayName(charName) {
        const charData = this.getCharacterData()[charName];
        if (!charData) return charName;
        return charData.name || charName;
    }

    /**
     * Get weapon display name (with translation)
     */
    static getWeaponDisplayName(weaponName) {
        const weaponData = this.getWeaponList()[weaponName];
        if (!weaponData) return weaponName;
        return weaponData.name || weaponName;
    }

    /**
     * Get persona display name
     */
    static getPersonaDisplayName(personaName) {
        const personaData = this.getPersonaList()[personaName];
        if (!personaData) return personaName;
        return personaData.name || personaName;
    }
}

// Expose to window for global access
window.DataLoader = DataLoader;
