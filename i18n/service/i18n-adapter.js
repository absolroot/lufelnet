/**
 * Global i18n Adapter
 * 
 * 기존 코드가 새로운 통합 i18n 서비스를 사용할 수 있도록 전역 어댑터를 제공합니다.
 * 모든 페이지에서 재사용 가능하도록 설계되었습니다.
 */

(function () {
    'use strict';

    // Wait for I18nService to be available
    const waitForI18nService = () => {
        return new Promise((resolve) => {
            if (window.I18nService) {
                resolve(window.I18nService);
            } else {
                const checkInterval = setInterval(() => {
                    if (window.I18nService) {
                        clearInterval(checkInterval);
                        resolve(window.I18nService);
                    }
                }, 50);

                setTimeout(() => {
                    clearInterval(checkInterval);
                    console.error('[i18n-adapter] Failed to load I18nService');
                    resolve(null);
                }, 5000);
            }
        });
    };

    // Build I18N object from i18n service cache
    const buildI18NObject = (i18nService, lang, pageName) => {
        const cache = i18nService.cache[lang];
        if (!cache) return {};

        const result = { ...cache.common };

        // Add page-specific translations
        if (pageName && cache.pages && cache.pages[pageName]) {
            Object.assign(result, cache.pages[pageName]);
        }

        // Flatten nested objects for backward compatibility
        // Example: tooltips.ticket -> tooltipTicket
        const flattened = {};
        for (const [key, value] of Object.entries(result)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value) && key !== 'mustReadContent') {
                // Remove trailing 's' for plural keys (tooltips -> tooltip)
                const singularKey = key.endsWith('s') ? key.slice(0, -1) : key;

                for (const [nestedKey, nestedValue] of Object.entries(value)) {
                    const flatKey = singularKey + nestedKey.charAt(0).toUpperCase() + nestedKey.slice(1);
                    flattened[flatKey] = nestedValue;
                }
            }
        }

        return { ...result, ...flattened };
    };

    // Build MUST_READ_CONTENT object
    const buildMustReadContent = (i18nService, lang, pageName) => {
        if (!pageName) return '';
        const cache = i18nService.cache[lang];
        return cache?.pages?.[pageName]?.mustReadContent || '';
    };

    // Initialize i18n adapter for a specific page
    window.initPageI18n = async function (pageName = null) {
        const i18nService = await waitForI18nService();

        if (!i18nService) {
            console.error('[i18n-adapter] I18nService not available');
            window.I18N = { kr: {}, en: {}, jp: {} };
            window.MUST_READ_CONTENT = { kr: '', en: '', jp: '' };
            // Fallback t function
            window.t = (key, defaultValue) => defaultValue || key;
            document.documentElement.classList.remove('i18n-loading');
            return false;
        }

        // Initialize i18n service
        if (!i18nService.cache.kr?.common) {
            await i18nService.init(pageName);
        } else if (pageName && !i18nService.cache.kr?.pages?.[pageName]) {
            await Promise.all([
                i18nService.loadPageTranslations(pageName, 'kr'),
                i18nService.loadPageTranslations(pageName, 'en'),
                i18nService.loadPageTranslations(pageName, 'jp')
            ]);
        }

        // Build I18N object compatible with existing code
        window.I18N = {
            kr: buildI18NObject(i18nService, 'kr', pageName),
            en: buildI18NObject(i18nService, 'en', pageName),
            jp: buildI18NObject(i18nService, 'jp', pageName)
        };

        // Build MUST_READ_CONTENT
        window.MUST_READ_CONTENT = {
            kr: buildMustReadContent(i18nService, 'kr', pageName),
            en: buildMustReadContent(i18nService, 'en', pageName),
            jp: buildMustReadContent(i18nService, 'jp', pageName)
        };

        console.log('[i18n-adapter] Initialized successfully');
        console.log('[i18n-adapter] Page:', pageName || 'common only');
        console.log('[i18n-adapter] Current language:', i18nService.getCurrentLanguage());
        console.log('[i18n-adapter] I18N.kr keys count:', Object.keys(window.I18N.kr).length);
        console.log('[i18n-adapter] I18N.en keys count:', Object.keys(window.I18N.en).length);
        console.log('[i18n-adapter] I18N.jp keys count:', Object.keys(window.I18N.jp).length);
        //console.log('[i18n-adapter] Sample tooltip keys (kr):', Object.keys(window.I18N.kr).filter(k => k.startsWith('tooltip')).slice(0, 5));
        //console.log('[i18n-adapter] Sample tooltip keys (en):', Object.keys(window.I18N.en).filter(k => k.startsWith('tooltip')).slice(0, 5));
        //console.log('[i18n-adapter] tooltipTicket (kr):', window.I18N.kr.tooltipTicket);
        //console.log('[i18n-adapter] tooltipTicket (en):', window.I18N.en.tooltipTicket);

        // === 함수형 API (권장) ===
        // 모든 페이지에서 일관되게 사용할 수 있는 전역 함수
        window.t = (key, defaultValue) => {
            const currentLang = i18nService.getCurrentLanguage();

            // 1. 플랫화된 I18N 객체에서 먼저 검색 (하위 호환성)
            if (window.I18N && window.I18N[currentLang] && window.I18N[currentLang][key] !== undefined) {
                return window.I18N[currentLang][key];
            }

            // 2. i18nService에서 검색 (중첩 키 지원)
            return i18nService.t(key, defaultValue);
        };
        window.getCurrentLang = () => i18nService.getCurrentLanguage();
        window.setLang = async (lang) => {
            await i18nService.setLanguage(lang);

            // Rebuild I18N objects for legacy compatibility
            window.I18N.kr = buildI18NObject(i18nService, 'kr', pageName);
            window.I18N.en = buildI18NObject(i18nService, 'en', pageName);
            window.I18N.jp = buildI18NObject(i18nService, 'jp', pageName);

            window.MUST_READ_CONTENT.kr = buildMustReadContent(i18nService, 'kr', pageName);
            window.MUST_READ_CONTENT.en = buildMustReadContent(i18nService, 'en', pageName);
            window.MUST_READ_CONTENT.jp = buildMustReadContent(i18nService, 'jp', pageName);
        };

        // Legacy helper functions (deprecated, use t() instead)
        window.getCurrentI18nLanguage = () => i18nService.getCurrentLanguage();
        window.translateI18n = (key, defaultValue) => i18nService.t(key, defaultValue);
        window.setI18nLanguage = window.setLang;  // Alias

        window.__I18nService__ = i18nService;

        // Update DOM elements with data-i18n attributes
        if (i18nService.updateDOM) {
            i18nService.updateDOM();
        }

        // Remove loading state to prevent FOUC (Flash of Untranslated Content)
        document.documentElement.classList.remove('i18n-loading');

        return true;
    };

})();
