(function () {
    'use strict';

    const DEFAULT_OVERRIDE_FIELDS = ['limit', 'release_order', 'tag', 'role'];

    function normalizeLang(raw) {
        const value = String(raw || '').trim().toLowerCase();
        if (value === 'sea') return 'en';
        if (value === 'tw') return 'cn';
        if (value === 'kr' || value === 'en' || value === 'jp' || value === 'cn') return value;
        return 'kr';
    }

    function detectCurrentLanguage() {
        try {
            if (typeof window !== 'undefined' && window.LanguageRouter && typeof window.LanguageRouter.getCurrentLanguage === 'function') {
                return normalizeLang(window.LanguageRouter.getCurrentLanguage());
            }
        } catch (_) { }

        try {
            if (typeof window !== 'undefined' && typeof window.getCurrentLanguage === 'function') {
                return normalizeLang(window.getCurrentLanguage());
            }
        } catch (_) { }

        try {
            if (typeof getCurrentLang === 'function') {
                return normalizeLang(getCurrentLang());
            }
        } catch (_) { }

        try {
            const queryLang = new URLSearchParams(window.location.search).get('lang');
            if (queryLang) return normalizeLang(queryLang);
        } catch (_) { }

        return 'kr';
    }

    function getCharacterDataPath(lang) {
        const normalized = normalizeLang(lang);
        if (normalized === 'kr' || normalized === 'cn') return '/data/character_info.js';
        if (normalized === 'en' || normalized === 'jp') return '/data/character_info_glb.js';
        return '/data/character_info.js';
    }

    function translateTerm(term) {
        try {
            if (window.I18nService && typeof window.I18nService.translateTerm === 'function') {
                return window.I18nService.translateTerm(term);
            }
        } catch (_) { }
        return term;
    }

    function parseCharacterScriptData(text) {
        if (!text) {
            return { characterList: { mainParty: [], supportParty: [] }, characterData: {} };
        }

        const sandbox = {};
        try {
            const win = (new Function('window', `${text}\n; return window;`))(sandbox);
            return {
                characterList: (win && win.characterList) || { mainParty: [], supportParty: [] },
                characterData: (win && win.characterData) || {}
            };
        } catch (_) {
            const out = {};
            try {
                new Function('out', `${text};
                    out.characterList = (typeof characterList !== 'undefined') ? characterList : { mainParty: [], supportParty: [] };
                    out.characterData = (typeof characterData !== 'undefined') ? characterData : {};
                `)(out);
            } catch (_) { }
            return {
                characterList: out.characterList || { mainParty: [], supportParty: [] },
                characterData: out.characterData || {}
            };
        }
    }

    async function fetchCharacterScriptData(url) {
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            return parseCharacterScriptData(text);
        } catch (_) {
            return null;
        }
    }

    function applyLocalizedDisplayFields(character, lang) {
        if (!character || lang === 'kr') return;

        const translatedElement = translateTerm(character.element);
        if (translatedElement && translatedElement !== character.element) {
            character.element_display = translatedElement;
        }

        const translatedPosition = translateTerm(character.position);
        if (translatedPosition && translatedPosition !== character.position) {
            character.position_display = translatedPosition;
        }
    }

    function shouldCopyOverride(field, value) {
        if (field === 'limit') return typeof value === 'boolean';
        if (field === 'release_order') return value !== undefined;
        if (field === 'tag' || field === 'role') return typeof value === 'string' && value !== '';
        return value !== undefined;
    }

    function mergeCharacterData(options) {
        const opts = options || {};
        const krData = opts.krData || {};
        const langData = opts.langData || {};
        const lang = normalizeLang(opts.lang || detectCurrentLanguage());
        const overrideFields = Array.isArray(opts.overrideFields) && opts.overrideFields.length > 0
            ? opts.overrideFields
            : DEFAULT_OVERRIDE_FIELDS;

        const mergedData = {};

        Object.keys(krData).forEach((key) => {
            const krChar = krData[key] || {};
            mergedData[key] = { ...krChar };

            if (lang === 'en') {
                if (krChar.name_en) mergedData[key].name = krChar.name_en;
                if (krChar.persona_en) mergedData[key].persona = krChar.persona_en;
            } else if (lang === 'jp') {
                if (krChar.name_jp) mergedData[key].name = krChar.name_jp;
                if (krChar.persona_jp) mergedData[key].persona = krChar.persona_jp;
            } else if (lang === 'cn') {
                if (krChar.name_cn) mergedData[key].name = krChar.name_cn;
                if (krChar.persona_cn) mergedData[key].persona = krChar.persona_cn;
            }

            applyLocalizedDisplayFields(mergedData[key], lang);
        });

        Object.keys(langData).forEach((key) => {
            if (!mergedData[key]) return;

            const langChar = langData[key] || {};

            if (lang === 'en' && !mergedData[key].name && langChar.name) {
                mergedData[key].name = langChar.name;
            } else if (lang === 'jp' && !mergedData[key].name && langChar.name) {
                mergedData[key].name = langChar.name;
            } else if (lang === 'cn' && !mergedData[key].name && langChar.name) {
                mergedData[key].name = langChar.name;
            }

            if (lang === 'en' && !mergedData[key].persona && langChar.persona) {
                mergedData[key].persona = langChar.persona;
            } else if (lang === 'jp' && !mergedData[key].persona && langChar.persona) {
                mergedData[key].persona = langChar.persona;
            } else if (lang === 'cn' && !mergedData[key].persona && langChar.persona) {
                mergedData[key].persona = langChar.persona;
            }

            overrideFields.forEach((field) => {
                if (!Object.prototype.hasOwnProperty.call(langChar, field)) return;
                if (!shouldCopyOverride(field, langChar[field])) return;
                mergedData[key][field] = langChar[field];
            });

            applyLocalizedDisplayFields(mergedData[key], lang);
        });

        return mergedData;
    }

    async function prepareCharacterData(options) {
        const opts = options || {};
        const lang = normalizeLang(opts.lang || detectCurrentLanguage());
        const spoilerEnabled = !!opts.spoilerEnabled;
        const forceKrList = !!opts.forceKrList;
        const overrideFields = Array.isArray(opts.overrideFields) && opts.overrideFields.length > 0
            ? opts.overrideFields
            : DEFAULT_OVERRIDE_FIELDS;
        const version = opts.version != null ? String(opts.version) : String(window.APP_VERSION || Date.now());
        const suffix = version ? `?v=${encodeURIComponent(version)}` : '';

        const kr = await fetchCharacterScriptData(`${getCharacterDataPath('kr')}${suffix}`);
        if (!kr) return null;

        const krCharacterData = kr.characterData || {};
        const krCharacterList = kr.characterList || { mainParty: [], supportParty: [] };

        if (lang === 'kr') {
            const krResult = {
                lang,
                characterData: krCharacterData,
                characterList: krCharacterList,
                krCharacterData,
                krCharacterList,
                langCharacterData: krCharacterData,
                langCharacterList: krCharacterList,
                originalLangCharacterList: [...(krCharacterList.mainParty || []), ...(krCharacterList.supportParty || [])]
            };
            return krResult;
        }

        const langBox = await fetchCharacterScriptData(`${getCharacterDataPath(lang)}${suffix}`);
        const langCharacterData = (langBox && langBox.characterData) || {};
        const langCharacterList = (langBox && langBox.characterList) || { mainParty: [], supportParty: [] };
        const originalLangCharacterList = [...(langCharacterList.mainParty || []), ...(langCharacterList.supportParty || [])];

        const characterData = spoilerEnabled
            ? krCharacterData
            : mergeCharacterData({
                krData: krCharacterData,
                langData: langCharacterData,
                lang,
                overrideFields
            });

        const characterList = (spoilerEnabled || forceKrList)
            ? krCharacterList
            : langCharacterList;

        return {
            lang,
            characterData,
            characterList,
            krCharacterData,
            krCharacterList,
            langCharacterData,
            langCharacterList,
            originalLangCharacterList
        };
    }

    window.CharacterDataUtils = {
        DEFAULT_OVERRIDE_FIELDS,
        normalizeLang,
        parseCharacterScriptData,
        fetchCharacterScriptData,
        getCharacterDataPath,
        mergeCharacterData,
        prepareCharacterData
    };
})();
