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
     * @param {Function} onProgress - Optional callback for progress updates (receives percent 15-40)
     * @returns {Promise<void>}
     */
    static async ensureData(onProgress) {
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

                    // Calculate progress based on loaded data (15% to 40%)
                    let loadedCount = 0;
                    if (hasCharacterData) loadedCount++;
                    if (hasCharacterList) loadedCount++;
                    if (hasWeapons) loadedCount++;
                    if (hasPersonas) loadedCount++;
                    if (hasSkills) loadedCount++;
                    if (hasRevelations) loadedCount++;
                    const progress = 15 + Math.floor((loadedCount / 6) * 25); // 15% to 40%
                    if (typeof onProgress === 'function') {
                        onProgress(progress);
                    }

                    // Minimum required: characterData
                    // For Wonder components we strongly need weapons/personas/skills too
                    const minimalReady = hasCharacterData;
                    const fullReady = minimalReady && hasWeapons && hasPersonas && hasSkills;

                    if ((fullReady) || attempts >= maxAttempts) {
                        this._dataReady = true;

                        // Log data status
                        /* console.log('[DataLoader] Data status:', {
                            characterData: hasCharacterData,
                            characterList: hasCharacterList,
                            weapons: hasWeapons,
                            personas: hasPersonas,
                            skills: hasSkills,
                            revelations: hasRevelations,
                            attempts
                        });*/

                        // Load critical data and wait for it
                        this.loadCriticalData().then(() => {
                            resolve();
                        });
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
     * Load critical data (criticalBuffData, criticalSelfData) and boss data
     */
    static loadCriticalData() {
        if (this._criticalDataLoaded) return Promise.resolve(true);
        if (this._criticalDataPromise) return this._criticalDataPromise;

        const baseUrl = window.BASE_URL || '';
        const version = (typeof window.APP_VERSION !== 'undefined' && window.APP_VERSION)
            ? `?v=${encodeURIComponent(String(window.APP_VERSION))}`
            : '';

        const criticalSrc = `${baseUrl}/data/kr/calc/critical-data.js${version}`;
        const bossSrc = `${baseUrl}/data/kr/calc/boss.js${version}`;
        const defenseSrc = `${baseUrl}/data/kr/calc/defense-data.js${version}`;
        const defenseMutualRulesSrc = `${baseUrl}/data/kr/calc/defense-mutually-exclusive-rules.js${version}`;

        const loadScript = (src) => new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => {
                console.error('[DataLoader] Failed to load:', src);
                resolve(false);
            };
            document.head.appendChild(script);
        });

        this._criticalDataPromise = Promise.all([
            // Check if already loaded, otherwise load
            (window.criticalBuffData && window.criticalSelfData) ? Promise.resolve(true) : loadScript(criticalSrc),
            window.bossData ? Promise.resolve(true) : loadScript(bossSrc),
            (window.penetrateData && window.defenseCalcData) ? Promise.resolve(true) : loadScript(defenseSrc),
            (window.defenseMutuallyExclusiveRules || typeof defenseMutuallyExclusiveRules !== 'undefined')
                ? Promise.resolve(true)
                : loadScript(defenseMutualRulesSrc)
        ]).then(() => {
            // bossData is declared as const in boss.js, so we need to assign it to window
            if (typeof bossData !== 'undefined' && !window.bossData) {
                window.bossData = bossData;
            }
            // penetrateData and defenseCalcData are declared as const in defense-data.js
            if (typeof penetrateData !== 'undefined' && !window.penetrateData) {
                window.penetrateData = penetrateData;
            }
            if (typeof defenseCalcData !== 'undefined' && !window.defenseCalcData) {
                window.defenseCalcData = defenseCalcData;
            }
            if (typeof defenseMutuallyExclusiveRules !== 'undefined' && !window.defenseMutuallyExclusiveRules) {
                window.defenseMutuallyExclusiveRules = defenseMutuallyExclusiveRules;
            }
            this._criticalDataLoaded = true;
            console.log('[DataLoader] Critical/Boss/Defense data loaded:', {
                buffGroups: Object.keys(window.criticalBuffData || {}).length,
                selfGroups: Object.keys(window.criticalSelfData || {}).length,
                bosses: (window.bossData || []).length,
                penetrateGroups: Object.keys(window.penetrateData || {}).length,
                defenseGroups: Object.keys(window.defenseCalcData || {}).length,
                defenseMutualRules: (window.defenseMutuallyExclusiveRules || []).length
            });
            return true;
        });

        return this._criticalDataPromise;
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
        this._characterSettingPromises.set(name, p);
        return p;
    }

    /**
     * Load character party file (recommended party/weapons) on demand.
     * data/characters/<NAME>/party.js -> window.recommendParty[NAME]
     */
    static loadCharacterParty(charName) {
        const name = String(charName || '').trim();
        if (!name) return Promise.resolve(false);

        if (window.recommendParty && window.recommendParty[name]) {
            return Promise.resolve(true);
        }

        // We can reuse the promise map if key is distinct, or create a new map
        // Let's create a new static map for party promises
        if (!this._characterPartyPromises) {
            this._characterPartyPromises = new Map();
        }

        if (this._characterPartyPromises.has(name)) {
            return this._characterPartyPromises.get(name);
        }

        const baseUrl = window.BASE_URL || '';
        const version = (typeof window.APP_VERSION !== 'undefined' && window.APP_VERSION)
            ? `?v=${encodeURIComponent(String(window.APP_VERSION))}`
            : '';

        const src = `${baseUrl}/data/characters/${encodeURIComponent(name)}/party.js${version}`;

        const p = new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
                resolve(!!(window.recommendParty && window.recommendParty[name]));
            };
            script.onerror = () => {
                resolve(false);
            };
            document.head.appendChild(script);
        });

        this._characterPartyPromises.set(name, p);
        return p;
    }

    static getCurrentLang() {
        if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
            return window.I18nService.getCurrentLanguage();
        }
        return 'kr';
    }

    /**
     * Load language-specific character list for spoiler filtering
     * Sets window.originalLangCharacterList for non-KR languages
     */
    static async loadLangCharacterList() {
        const lang = this.getCurrentLang();
        if (lang === 'kr') return; // KR doesn't need spoiler filtering

        // Use CharacterListLoader if available
        if (typeof window.CharacterListLoader !== 'undefined') {
            try {
                const result = await window.CharacterListLoader.loadFor(lang);
                const list = result.characterList || { mainParty: [], supportParty: [] };
                window.originalLangCharacterList = [
                    ...(list.mainParty || []),
                    ...(list.supportParty || [])
                ];
                console.log('[DataLoader] Loaded lang character list:', lang, window.originalLangCharacterList.length);
                return;
            } catch (e) {
                console.error('[DataLoader] CharacterListLoader failed:', e);
            }
        }

        // Fallback: fetch directly
        const baseUrl = window.BASE_URL || '';
        const version = (typeof window.APP_VERSION !== 'undefined' && window.APP_VERSION)
            ? `?v=${encodeURIComponent(String(window.APP_VERSION))}`
            : '';
        const dataPath = (lang === 'en' || lang === 'jp')
            ? '/data/character_info_glb.js'
            : `/data/${lang}/characters/characters.js`;
        const url = `${baseUrl}${dataPath}${version}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch');
            const text = await response.text();

            // Parse characterList from the script
            const listMatch = text.match(/(?:window\.)?characterList\s*=\s*({[\s\S]*?});/);
            if (listMatch) {
                const parsed = new Function('return ' + listMatch[1])();
                window.originalLangCharacterList = [
                    ...(parsed.mainParty || []),
                    ...(parsed.supportParty || [])
                ];
                console.log('[DataLoader] Loaded lang character list (fallback):', lang, window.originalLangCharacterList.length);
            }
        } catch (e) {
            console.error('[DataLoader] Failed to load lang character list:', e);
            window.originalLangCharacterList = [];
        }
    }

    /**
     * Get character display name (with translation)
     */
    static getCharacterDisplayName(charName) {
        const charData = this.getCharacterData()[charName];
        if (!charData) return charName;

        const lang = this.getCurrentLang();
        if (lang === 'en') {
            return charData.codename || charData.name_en || charData.name || charName;
        } else if (lang === 'jp') {
            return charData.name_en || charData.name || charName;
        }
        return charData.name || charName;
    }

    /**
     * Get weapon display name (with translation)
     */
    static getWeaponDisplayName(weaponName) {
        const weaponData = this.getWeaponList()[weaponName];
        if (!weaponData) return weaponName;

        const lang = this.getCurrentLang();
        if (lang === 'en') {
            return weaponData.name_en || weaponData.name || weaponName;
        } else if (lang === 'jp') {
            return weaponData.name_jp || weaponData.name_en || weaponData.name || weaponName;
        }
        return weaponData.name || weaponName;
    }

    /**
     * Get persona display name
     */
    static getPersonaDisplayName(personaName) {
        const personaData = this.getPersonaList()[personaName];
        if (!personaData) return personaName;

        const lang = this.getCurrentLang();
        if (lang === 'en') {
            return personaData.name_en || personaData.name || personaName;
        } else if (lang === 'jp') {
            return personaData.name_jp || personaData.name_en || personaData.name || personaName;
        }
        return personaData.name || personaName;
    }

    /**
     * Get skill display name
     */
    static getSkillDisplayName(skillName) {
        const skillList = this.getSkillList();
        const skillData = skillList[skillName];
        if (!skillData) return skillName;

        const lang = this.getCurrentLang();
        if (lang === 'en') {
            return skillData.name_en || skillData.name || skillName;
        } else if (lang === 'jp') {
            return skillData.name_jp || skillData.name_en || skillData.name || skillName;
        }
        return skillData.name || skillName;
    }

    static KR_TO_I18N_POSITIONS = {
        '구원': 'medic',
        '굴복': 'breaker',
        '반항': 'assassin',
        '방위': 'guardian',
        '우월': 'striker',
        '지배': 'controller',
        '해명': 'navigator',
        '자율': 'autonomous'
    };

    static KR_TO_I18N_ELEMENTS = {
        '만능': 'almighty',
        '물리': 'physical',
        '총격': 'gun',
        '화염': 'fire',
        '빙결': 'ice',
        '전격': 'electric',
        '질풍': 'wind',
        '질풍빙결': 'windIce',
        '염동': 'psy',
        '핵열': 'nuclear',
        '축복': 'bless',
        '주원': 'curse',
        '버프': 'buff',
        '디버프': 'debuff',
        '디버프광역': 'debuffAoe'
    };

    static getJobName(rawJob) {
        if (!rawJob) return '';

        let key = rawJob;
        // Check if rawJob is Korean and needs mapping
        if (this.KR_TO_I18N_POSITIONS[rawJob]) {
            key = this.KR_TO_I18N_POSITIONS[rawJob];
        }

        if (window.I18nService && window.I18nService.t) {
            return window.I18nService.t('positions.' + key, rawJob);
        }
        return rawJob;
    }

    static getElementName(rawElement) {
        if (!rawElement) return '';

        let key = rawElement;
        // Check if rawElement is Korean and needs mapping
        if (this.KR_TO_I18N_ELEMENTS[rawElement]) {
            key = this.KR_TO_I18N_ELEMENTS[rawElement];
        }

        if (window.I18nService && window.I18nService.t) {
            return window.I18nService.t('elements.' + key, rawElement);
        }
        return rawElement;
    }

    /**
     * Load revelation translations for current language
     */
    static async loadRevelationMapping() {
        const lang = DataLoader.getCurrentLang();
        console.log('[DataLoader] loadRevelationMapping called. Lang:', lang);

        if (lang === 'kr') {
            console.log('[DataLoader] Korean language, skipping revelation mapping');
            return;
        }

        if (DataLoader._revelationMappingLoaded) {
            console.log('[DataLoader] Revelation mapping already loaded');
            return;
        }
        if (DataLoader._revelationMappingPromise) {
            console.log('[DataLoader] Revelation mapping already loading, waiting...');
            await DataLoader._revelationMappingPromise;
            return;
        }

        console.log('[DataLoader] Starting to load revelation mapping...');

        DataLoader._revelationMappingPromise = (async () => {
            try {
                const baseUrl = window.BASE_URL || '';
                const version = (typeof window.APP_VERSION !== 'undefined' && window.APP_VERSION)
                    ? `?v=${encodeURIComponent(String(window.APP_VERSION))}`
                    : '';

                const url = `${baseUrl}/data/${lang}/revelations/revelations.js${version}`;
                console.log('[DataLoader] Fetching revelation mapping from:', url);
                const res = await fetch(url);
                console.log('[DataLoader] Fetch response status:', res.status);
                if (!res.ok) throw new Error(`Failed to load revelations for ${lang}`);
                const text = await res.text();
                console.log('[DataLoader] Fetched text length:', text.length);

                // Extract mapping from the file
                // Replace all occurrences (declaration + references)
                let patchedText = text;
                if (lang === 'en') {
                    patchedText = patchedText.replaceAll('enRevelationData', 'window.__tmpEnRevelationData');
                    patchedText = patchedText.replaceAll('mapping_en', 'window.__tmpMappingEn');
                    // Remove const declarations
                    patchedText = patchedText.replace('const window.__tmpEnRevelationData', 'window.__tmpEnRevelationData');
                    patchedText = patchedText.replace('const window.__tmpMappingEn', 'window.__tmpMappingEn');
                } else if (lang === 'jp') {
                    patchedText = patchedText.replaceAll('jpRevelationData', 'window.__tmpJpRevelationData');
                    patchedText = patchedText.replaceAll('mapping_jp', 'window.__tmpMappingJp');
                    // Remove const declarations
                    patchedText = patchedText.replace('const window.__tmpJpRevelationData', 'window.__tmpJpRevelationData');
                    patchedText = patchedText.replace('const window.__tmpMappingJp', 'window.__tmpMappingJp');
                }

                console.log('[DataLoader] Executing patched script...');
                // eslint-disable-next-line no-eval
                eval(patchedText);
                console.log('[DataLoader] Script executed');

                // Extract mapping and effects
                if (lang === 'en') {
                    console.log('[DataLoader] EN - __tmpMappingEn exists:', !!window.__tmpMappingEn);
                    console.log('[DataLoader] EN - __tmpEnRevelationData exists:', !!window.__tmpEnRevelationData);
                    if (window.__tmpEnRevelationData) {
                        console.log('[DataLoader] EN - mapping_en in data:', !!window.__tmpEnRevelationData.mapping_en);
                        // 영어 sub_effects와 set_effects 저장
                        DataLoader._localizedSubEffects = window.__tmpEnRevelationData.sub_effects || {};
                        DataLoader._localizedSetEffects = window.__tmpEnRevelationData.set_effects || {};
                    }
                    DataLoader._revelationMapping = window.__tmpMappingEn ||
                        (window.__tmpEnRevelationData && window.__tmpEnRevelationData.mapping_en) || {};
                    try { delete window.__tmpMappingEn; } catch (_) { }
                    try { delete window.__tmpEnRevelationData; } catch (_) { }
                } else if (lang === 'jp') {
                    console.log('[DataLoader] JP - __tmpMappingJp exists:', !!window.__tmpMappingJp);
                    console.log('[DataLoader] JP - __tmpJpRevelationData exists:', !!window.__tmpJpRevelationData);
                    if (window.__tmpJpRevelationData) {
                        console.log('[DataLoader] JP - mapping_jp in data:', !!window.__tmpJpRevelationData.mapping_jp);
                        // 일본어 sub_effects와 set_effects 저장
                        DataLoader._localizedSubEffects = window.__tmpJpRevelationData.sub_effects || {};
                        DataLoader._localizedSetEffects = window.__tmpJpRevelationData.set_effects || {};
                    }
                    DataLoader._revelationMapping = window.__tmpMappingJp ||
                        (window.__tmpJpRevelationData && window.__tmpJpRevelationData.mapping_jp) || {};
                    try { delete window.__tmpMappingJp; } catch (_) { }
                    try { delete window.__tmpJpRevelationData; } catch (_) { }
                }

                DataLoader._revelationMappingLoaded = true;
                const keys = Object.keys(DataLoader._revelationMapping);
                console.log('[DataLoader] Revelation mapping loaded:', keys.length, 'entries');
                if (keys.length > 0) {
                    console.log('[DataLoader] Sample mappings:', keys.slice(0, 5).map(k => `${k} -> ${DataLoader._revelationMapping[k]}`));
                }
            } catch (e) {
                console.error('[DataLoader] Failed to load revelation mapping:', e);
            }
        })();

        await DataLoader._revelationMappingPromise;
        console.log('[DataLoader] loadRevelationMapping completed');
    }

    static getRevelationName(rawRev) {
        if (!rawRev) return '';

        const lang = DataLoader.getCurrentLang();

        // For non-Korean, use loaded mapping
        if (lang !== 'kr') {
            const mappingKeys = DataLoader._revelationMapping ? Object.keys(DataLoader._revelationMapping).length : 0;
            // console.log('[DataLoader] getRevelationName called. Lang:', lang, 'Rev:', rawRev, 'MappingSize:', mappingKeys, 'Loaded:', DataLoader._revelationMappingLoaded);

            if (DataLoader._revelationMapping && DataLoader._revelationMapping[rawRev]) {
                const translated = DataLoader._revelationMapping[rawRev];
                // console.log('[DataLoader] Found translation:', rawRev, '->', translated);
                return translated;
            } else {
                console.log('[DataLoader] No translation found for:', rawRev);
            }
        }

        // Fallback to i18n translations for common terms
        const map = {
            '일': 'revelation.sun',
            '월': 'revelation.moon',
            '성': 'revelation.star',
            '진': 'revelation.sky',
            '주': 'revelation.space',
            '일월성진': 'revelation.sunMoonStarSky',
            '공통': 'revelation.common',
            '주권': 'revelation.control',
            '여정': 'revelation.departure',
            '직책': 'revelation.labor',
            '결심': 'revelation.resolve',
            '자유': 'revelation.freedom',
            '개선': 'revelation.triumph',
            '희망': 'revelation.hope',
            '황야의 구세주': 'revelation.desperado'
        };
        const key = map[rawRev];
        if (key && window.I18nService && window.I18nService.t) {
            const translated = window.I18nService.t(key);
            if (translated && translated !== key) {
                return translated;
            }
        }
        return rawRev;
    }
}

// Static properties initialization
DataLoader._revelationMappingLoaded = false;
DataLoader._revelationMappingPromise = null;
DataLoader._revelationMapping = {};
DataLoader._criticalDataLoaded = false;
DataLoader._criticalDataPromise = null;


// Expose to window for global access
window.DataLoader = DataLoader;
