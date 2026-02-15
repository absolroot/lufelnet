(function () {
    'use strict';

    const RAW_LANGS = ['kr', 'en', 'jp', 'cn', 'tw', 'sea'];
    const UI_LANGS = ['kr', 'en', 'jp'];

    function normalizeLang(value) {
        return String(value || '').trim().toLowerCase();
    }

    function detectRawLang() {
        try {
            const urlLang = normalizeLang(new URLSearchParams(window.location.search).get('lang'));
            if (RAW_LANGS.includes(urlLang)) return urlLang;
        } catch (_) { }

        try {
            const pathLang = normalizeLang((window.location.pathname || '').split('/')[1]);
            if (RAW_LANGS.includes(pathLang)) return pathLang;
        } catch (_) { }

        try {
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
                const routerLang = normalizeLang(LanguageRouter.getCurrentLanguage());
                if (RAW_LANGS.includes(routerLang)) return routerLang;
            }
        } catch (_) { }

        try {
            const savedLang = normalizeLang(localStorage.getItem('preferredLanguage'));
            if (RAW_LANGS.includes(savedLang)) return savedLang;
        } catch (_) { }

        try {
            const savedLangAlt = normalizeLang(localStorage.getItem('preferred_language'));
            if (RAW_LANGS.includes(savedLangAlt)) return savedLangAlt;
        } catch (_) { }

        try {
            const browserLang = normalizeLang(navigator.language);
            if (browserLang.startsWith('ko')) return 'kr';
            if (browserLang.startsWith('ja')) return 'jp';
            if (browserLang.startsWith('zh')) return 'cn';
            if (browserLang.startsWith('en')) return 'en';
        } catch (_) { }

        return 'kr';
    }

    function resolveUiLang(rawLang) {
        const lang = normalizeLang(rawLang || detectRawLang());
        if (lang === 'en') return 'en';
        if (lang === 'jp') return 'jp';
        return 'kr';
    }

    function getNestedValue(obj, path) {
        if (!obj || typeof obj !== 'object') return undefined;
        if (!path || typeof path !== 'string') return undefined;

        const parts = path.split('.');
        let current = obj;
        for (const part of parts) {
            if (current && Object.prototype.hasOwnProperty.call(current, part)) {
                current = current[part];
            } else {
                return undefined;
            }
        }
        return current;
    }

    function getTranslationByLang(lang, key) {
        const safeLang = UI_LANGS.includes(lang) ? lang : 'kr';

        if (window.I18N && window.I18N[safeLang] && window.I18N[safeLang][key] !== undefined) {
            return window.I18N[safeLang][key];
        }

        const service = window.I18nService || window.__I18nService__;
        if (!service || !service.cache) return undefined;

        const fromPage = getNestedValue(service.cache?.[safeLang]?.pages?.home, key);
        if (fromPage !== undefined) return fromPage;

        const fromCommon = getNestedValue(service.cache?.[safeLang]?.common, key);
        if (fromCommon !== undefined) return fromCommon;

        return undefined;
    }

    function t(key, fallback, rawLang) {
        const uiLang = resolveUiLang(rawLang || detectRawLang());
        const value = getTranslationByLang(uiLang, key);
        if (value !== undefined) return value;
        return fallback !== undefined ? fallback : key;
    }

    function formatTemplate(template, value) {
        return String(template).replace(/\{value\}/g, String(value));
    }

    function formatRelativeDate(date, options = {}) {
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';

        const rawLang = options.rawLang || detectRawLang();
        const includeWeeks = !!options.includeWeeks;
        const now = Date.now();
        const diff = now - date.getTime();

        if (diff < 0) {
            const localeFuture = t('date_locale', 'ko-KR', rawLang);
            try {
                return date.toLocaleDateString(localeFuture);
            } catch (_) {
                return date.toLocaleDateString('ko-KR');
            }
        }

        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes < 60) {
            return formatTemplate(t('relative_minutes', '{value}분 전', rawLang), Math.max(0, minutes));
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 24) {
            return formatTemplate(t('relative_hours', '{value}시간 전', rawLang), hours);
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days < 7) {
            return formatTemplate(t('relative_days', '{value}일 전', rawLang), days);
        }

        if (includeWeeks && days < 30) {
            const weeks = Math.max(1, Math.floor(days / 7));
            const weekKey = weeks > 1 ? 'relative_weeks_plural' : 'relative_weeks_singular';
            return formatTemplate(t(weekKey, '{value}주 전', rawLang), weeks);
        }

        const locale = t('date_locale', 'ko-KR', rawLang);
        const dateOptions = (options.dateOptions && typeof options.dateOptions === 'object') ? options.dateOptions : undefined;
        try {
            return date.toLocaleDateString(locale, dateOptions);
        } catch (_) {
            return date.toLocaleDateString('ko-KR', dateOptions);
        }
    }

    async function initHomeI18n() {
        if (window.__HOME_I18N_INIT_DONE__) return true;

        if (typeof window.initPageI18n === 'function') {
            await window.initPageI18n('home');
        } else if (window.I18nService && typeof window.I18nService.init === 'function') {
            await window.I18nService.init('home');
            await Promise.all(UI_LANGS.map(async (lang) => {
                await window.I18nService.loadCommonTranslations(lang);
                await window.I18nService.loadPageTranslations('home', lang);
            }));
        }

        window.__HOME_I18N_INIT_DONE__ = true;
        return true;
    }

    window.HomeI18n = {
        detectRawLang,
        resolveUiLang,
        t,
        formatRelativeDate
    };

    if (!window.__HOME_I18N_READY__) {
        window.__HOME_I18N_READY__ = (async function () {
            try {
                await initHomeI18n();
                return true;
            } catch (error) {
                console.warn('[home-i18n] initialization failed:', error);
                return false;
            }
        })();
    }
})();
