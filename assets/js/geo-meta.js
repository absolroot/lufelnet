(function () {
    'use strict';

    function normalizeLang(raw) {
        const value = String(raw || '').trim().toLowerCase();
        if (value === 'kr' || value === 'en' || value === 'jp') return value;
        return 'kr';
    }

    function isHomePath() {
        const path = String(window.location.pathname || '');
        if (path === '/' || path === '/index.html') return true;
        return /^\/(kr|en|jp|cn)\/?$/.test(path);
    }

    function shouldSkipGeoMeta() {
        if (!isHomePath()) return true;
        const hint = window.__SEO_CONTEXT_HINT__;
        if (hint && typeof hint === 'object' && Object.keys(hint).length > 0) return true;
        return false;
    }

    function detectRegionByIP() {
        return fetch('https://ipapi.co/json/')
            .then((response) => response.json())
            .then((data) => {
                const countryCode = String(data?.country_code || '').toUpperCase();
                if (countryCode === 'JP') return 'jp';
                if (countryCode === 'US' || countryCode === 'GB' || countryCode === 'AU' || countryCode === 'CA') return 'en';
                if (countryCode === 'KR') return 'kr';

                const browserLang = String(navigator.language || navigator.userLanguage || '').toLowerCase();
                if (browserLang.startsWith('ja')) return 'jp';
                if (browserLang.startsWith('en')) return 'en';
                return 'kr';
            })
            .catch(function () {
                const browserLang = String(navigator.language || navigator.userLanguage || '').toLowerCase();
                if (browserLang.startsWith('ja')) return 'jp';
                if (browserLang.startsWith('en')) return 'en';
                return 'kr';
            });
    }

    async function getFinalLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = normalizeLang(urlParams.get('lang'));
        if (urlParams.get('lang')) return urlLang;

        const savedLang = normalizeLang(localStorage.getItem('preferred_language'));
        if (localStorage.getItem('preferred_language')) return savedLang;

        return normalizeLang(await detectRegionByIP());
    }

    function loadLanguageData(lang) {
        const currentPath = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        const isCharacterDetailPage = (currentPath.endsWith('/character.html') && !!urlParams.get('name'));
        const dataFiles = [];

        if (currentPath.includes('/character') || currentPath === '/' || currentPath.includes('/index')) {
            if (!(isCharacterDetailPage && lang !== 'kr')) {
                dataFiles.push('/character_info.js');
            }
        }
        if (currentPath.includes('/revelations') || currentPath === '/' || currentPath.includes('/index')) {
            dataFiles.push('/revelations/revelations.js');
        }

        dataFiles.forEach(function (dataFile) {
            const script = document.createElement('script');
            const isGlobalCharacterInfo = dataFile === '/character_info.js';
            script.src = isGlobalCharacterInfo
                ? `${window.BASE_URL || ''}/data${dataFile}?v=${window.APP_VERSION || Date.now()}`
                : `${window.BASE_URL || ''}/data/${lang}${dataFile}?v=${window.APP_VERSION || Date.now()}`;
            script.onerror = function () {
                if (!isGlobalCharacterInfo && lang !== 'kr') {
                    const fallbackScript = document.createElement('script');
                    fallbackScript.src = `${window.BASE_URL || ''}/data/kr${dataFile}?v=${window.APP_VERSION || Date.now()}`;
                    document.head.appendChild(fallbackScript);
                }
            };
            document.head.appendChild(script);
        });
    }

    async function updateMetaTags(lang) {
        const finalLang = normalizeLang(lang);
        window.currentLang = finalLang;
        localStorage.setItem('preferred_language', finalLang);

        if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
            await window.SeoEngine.setContextHint({
                domain: 'home',
                mode: 'list',
                lang: finalLang
            }, { rerun: true });
            return;
        }

        if (window.SeoEngine && typeof window.SeoEngine.run === 'function') {
            await window.SeoEngine.run();
        }
    }

    async function init() {
        if (shouldSkipGeoMeta()) return;
        try {
            const finalLang = await getFinalLanguage();
            await updateMetaTags(finalLang);
            loadLanguageData(finalLang);
            window.dispatchEvent(new CustomEvent('languageDetected', { detail: { language: finalLang } }));
        } catch (_) {
            await updateMetaTags('kr');
            loadLanguageData('kr');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.updateMetaTags = updateMetaTags;
    window.getFinalLanguage = getFinalLanguage;
})();
