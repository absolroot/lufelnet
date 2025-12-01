(function(){
    'use strict';

    const CharacterListLoader = {
        getLang(){
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
        // 언어별 characters.js를 샌드박스에서 평가해 characterList만 추출
        async loadFor(lang){
            const l = lang || this.getLang();
            // KR은 이미 custom_data로 포함된 전역을 그대로 사용
            if (l === 'kr') {
                const globalList =
                    (typeof characterList !== 'undefined' && characterList) ||
                    (typeof window !== 'undefined' && window.characterList) ||
                    { mainParty: [], supportParty: [] };
                return { characterList: globalList };
            }
            const url = `${BASE_URL}/data/${l}/characters/characters.js?v=${APP_VERSION}`;
            try {
                const resp = await fetch(url);
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                const text = await resp.text();
                // window.* 패턴을 안전하게 평가
                const sandbox = {};
                let win;
                try {
                    win = (new Function('window', `${text}\n; return window;`))(sandbox);
                } catch (e) {
                    // 구형 포맷(const characterList = ...)에 대한 폴백
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
        async getVisibleNames(showSpoiler){
            const lang = this.getLang();
            if (showSpoiler) {
                // KR 전체 목록 사용 (전역 window.characterList 우선)
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
