// Maps I18n - 다국어 지원

(function() {
    'use strict';

    const SUPPORTED_LANGS = ['kr', 'en', 'jp', 'cn'];
    const PAGE_PACK_VAR = {
        kr: 'I18N_PAGE_MAPS_KR',
        en: 'I18N_PAGE_MAPS_EN',
        jp: 'I18N_PAGE_MAPS_JP',
        cn: 'I18N_PAGE_MAPS_CN'
    };

    function normalizeLang(lang) {
        return SUPPORTED_LANGS.includes(lang) ? lang : 'kr';
    }

    function getPagePack(lang) {
        const normalizedLang = normalizeLang(lang);
        const varName = PAGE_PACK_VAR[normalizedLang];
        const fallbackVar = PAGE_PACK_VAR.kr;
        return window[varName] || window[fallbackVar] || {};
    }

    function getCurrentLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && SUPPORTED_LANGS.includes(urlLang)) {
            return urlLang;
        }
        const pathLang = (window.location.pathname || '').split('/')[1];
        if (pathLang && SUPPORTED_LANGS.includes(pathLang)) {
            return pathLang;
        }
        try {
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
                return savedLang;
            }
        } catch (e) {}
        if (window.MapsCore && window.MapsCore.getCurrentLanguage) {
            return normalizeLang(window.MapsCore.getCurrentLanguage());
        }
        try {
            const browserLang = String(navigator.language || '').toLowerCase();
            if (browserLang.startsWith('ko')) return 'kr';
            if (browserLang.startsWith('ja')) return 'jp';
            if (browserLang.startsWith('en')) return 'en';
            if (browserLang.startsWith('zh')) return 'cn';
        } catch (e) {}
        return 'kr';
    }

    function getMapName(mapItem, lang) {
        if (lang === 'cn' && mapItem.name_cn) return mapItem.name_cn;
        if (lang === 'en' && mapItem.name_en) return mapItem.name_en;
        if (lang === 'jp' && mapItem.name_jp) return mapItem.name_jp;
        return mapItem.name;
    }

    window.MapsI18n = {
        getText: (lang, key) => {
            const pack = getPagePack(lang);
            const fallbackPack = getPagePack('kr');
            if (Object.prototype.hasOwnProperty.call(pack, key)) return pack[key];
            if (Object.prototype.hasOwnProperty.call(fallbackPack, key)) return fallbackPack[key];
            return key;
        },
        getPack: (lang) => getPagePack(lang),
        getCurrentLanguage: getCurrentLanguage,
        getMapName: getMapName
    };
})();
