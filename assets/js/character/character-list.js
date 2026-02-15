(function () {
    'use strict';

    const CharacterListLoader = {
        getLang() {
            try {
                return (typeof getCurrentLanguage === 'function')
                    ? getCurrentLanguage()
                    : (I18NUtils && I18NUtils.getCurrentLanguageSafe
                        ? I18NUtils.getCurrentLanguageSafe()
                        : 'kr');
            } catch (_) {
                return 'kr';
            }
        },
        // Load language character list in an isolated sandbox.
        async loadFor(lang) {
            const l = lang || this.getLang();
            if (l === 'kr') {
                const globalList =
                    (typeof characterList !== 'undefined' && characterList) ||
                    (typeof window !== 'undefined' && window.characterList) ||
                    { mainParty: [], supportParty: [] };
                return { characterList: globalList };
            }

            const dataPath = (l === 'en' || l === 'jp')
                ? '/data/character_info_glb.js'
                : `/data/${l}/characters/characters.js`;
            const url = `${BASE_URL}${dataPath}?v=${APP_VERSION}`;

            try {
                const resp = await fetch(url);
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                const text = await resp.text();
                const sandbox = {};
                let win;
                try {
                    win = (new Function('window', `${text}\n; return window;`))(sandbox);
                } catch (e) {
                    const listMatch = text.match(/const characterList\s*=\s*({[\s\S]*?});/);
                    if (!listMatch) throw e;
                    const parsed = new Function('return ' + listMatch[1])();
                    return { characterList: parsed || { mainParty: [], supportParty: [] } };
                }
                const list = (win && win.characterList) || { mainParty: [], supportParty: [] };
                return { characterList: list };
            } catch (_) {
                return { characterList: { mainParty: [], supportParty: [] } };
            }
        },
        getSpoilerState(showSpoiler) {
            if (typeof showSpoiler === 'boolean') return showSpoiler;
            try {
                if (typeof window !== 'undefined' && window.SpoilerState && typeof window.SpoilerState.get === 'function') {
                    return !!window.SpoilerState.get();
                }
            } catch (_) { }
            try {
                return localStorage.getItem('spoilerToggle') === 'true';
            } catch (_) {
                return false;
            }
        },
        async getVisibleNames(showSpoiler) {
            const lang = this.getLang();
            const spoilerEnabled = this.getSpoilerState(showSpoiler);

            if (spoilerEnabled) {
                const globalList =
                    (typeof characterList !== 'undefined' && characterList) ||
                    (typeof window !== 'undefined' && window.characterList) ||
                    { mainParty: [], supportParty: [] };
                return [
                    ...(globalList.mainParty || []),
                    ...(globalList.supportParty || [])
                ];
            }

            const { characterList: cl } = await this.loadFor(lang);
            return [...(cl.mainParty || []), ...(cl.supportParty || [])];
        }
    };

    window.CharacterListLoader = CharacterListLoader;
})();
