(function(){
    'use strict';

    const CharacterListLoader = {
        getLang(){
            try { return (typeof getCurrentLanguage==='function') ? getCurrentLanguage() : (I18NUtils && I18NUtils.getCurrentLanguageSafe ? I18NUtils.getCurrentLanguageSafe() : 'kr'); } catch(_) { return 'kr'; }
        },
        async loadFor(lang){
            const l = lang || this.getLang();
            if (l === 'kr') {
                // 이미 포함된 KR 데이터 사용
                return { characterList: (typeof characterList !== 'undefined') ? characterList : { mainParty: [], supportParty: [] } };
            }
            const url = `${BASE_URL}/data/${l}/characters/characters.js?v=${APP_VERSION}`;
            const resp = await fetch(url);
            const text = await resp.text();
            const data = this.extractLists(text);
            return data;
        },
        extractLists(scriptText){
            const listMatch = scriptText.match(/const characterList\s*=\s*({[\s\S]*?});/);
            if (!listMatch) return { characterList: { mainParty: [], supportParty: [] } };
            const characterList = new Function('return ' + listMatch[1])();
            return { characterList };
        },
        async getVisibleNames(showSpoiler){
            const lang = this.getLang();
            if (showSpoiler) {
                // KR 목록 기준
                return (typeof characterList !== 'undefined') ? [...(characterList.mainParty||[]), ...(characterList.supportParty||[])] : [];
            }
            const { characterList: cl } = await this.loadFor(lang);
            return [...(cl.mainParty||[]), ...(cl.supportParty||[])];
        }
    };

    window.CharacterListLoader = CharacterListLoader;
})();
