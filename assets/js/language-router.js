class LanguageRouter {
    static initPromise = null;

    static SUPPORTED_LANGS = ['kr', 'en', 'jp', 'cn'];

    static parseSeoDetailPath(pathname) {
        const path = String(pathname || '');
        const match = path.match(/^\/(?:(kr|en|jp|cn)\/)?(synergy|wonder-weapon|character)\/([^/]+)\/?$/i);
        if (!match) return null;

        const prefix = (match[1] || '').toLowerCase();
        const app = (match[2] || '').toLowerCase();
        const slug = match[3];

        return {
            app,
            slug,
            lang: this.normalizeLang(prefix) || 'kr'
        };
    }

    static normalizeLang(lang) {
        const normalized = String(lang || '').toLowerCase();
        return this.SUPPORTED_LANGS.includes(normalized) ? normalized : null;
    }

    static getPathLanguage(pathname) {
        const match = String(pathname || '').toLowerCase().match(/^\/(kr|en|jp|cn)(?:\/|$)/);
        return match ? match[1] : null;
    }

    static stripLanguagePrefix(pathname) {
        const path = String(pathname || '/');
        const stripped = path.replace(/^\/(kr|en|jp|cn)(?=\/|$)/i, '');
        return stripped || '/';
    }

    static shouldPrefixPath(pathname) {
        const path = String(pathname || '/').toLowerCase();

        if (/^\/character\.html$/.test(path)) return false;
        if (/^\/article\/view\/?$/.test(path)) return false;

        return true;
    }

    static withLanguagePrefix(pathname, lang) {
        const safeLang = this.normalizeLang(lang) || 'kr';
        const cleanPath = String(pathname || '/');

        if (cleanPath === '/') {
            return `/${safeLang}/`;
        }

        const withoutLang = this.stripLanguagePrefix(cleanPath);
        return `/${safeLang}${withoutLang}`;
    }

    static getBrowserLanguage() {
        const browserLang = (navigator.language || '').toLowerCase();
        if (browserLang.startsWith('ko')) return 'kr';
        if (browserLang.startsWith('ja')) return 'jp';
        if (browserLang.startsWith('zh')) return 'cn';
        if (browserLang.startsWith('en')) return 'en';
        return 'kr';
    }

    static buildUrl(pathname, params, hash) {
        const search = params.toString();
        return `${pathname}${search ? `?${search}` : ''}${hash || ''}`;
    }

    static handleImmediateRedirect() {
        const currentUrl = new URL(window.location.href);
        const params = new URLSearchParams(currentUrl.search);
        const pathMappings = {
            '/character/character.html': '/character.html'
        };

        const mappedPath = pathMappings[currentUrl.pathname] || currentUrl.pathname;
        const pathLang = this.getPathLanguage(mappedPath);
        const queryLang = this.normalizeLang(params.get('lang'));
        const sessionLangHint = (() => {
            try {
                return this.normalizeLang(sessionStorage.getItem('__PATH_LANG_HINT__'));
            } catch (_) {
                return null;
            }
        })();

        let targetPath = mappedPath;
        let changed = targetPath !== currentUrl.pathname;

        if (!pathLang && sessionLangHint && this.shouldPrefixPath(mappedPath)) {
            const before = params.toString();
            params.delete('lang');
            params.delete('v');

            targetPath = this.withLanguagePrefix(mappedPath, sessionLangHint);

            try {
                localStorage.setItem('preferredLanguage', sessionLangHint);
            } catch (_) {
                // no-op
            }
            try {
                sessionStorage.removeItem('__PATH_LANG_HINT__');
            } catch (_) {
                // no-op
            }

            const nextUrl = this.buildUrl(targetPath, params, currentUrl.hash);
            const currentFull = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
            if (nextUrl !== currentFull || before !== params.toString()) {
                window.history.replaceState(null, '', nextUrl);
            }
            return;
        }

        if (pathLang && sessionLangHint) {
            try {
                sessionStorage.removeItem('__PATH_LANG_HINT__');
            } catch (_) {
                // no-op
            }
        }

        if (pathLang) {
            const before = params.toString();
            params.delete('lang');
            params.delete('v');
            if (before !== params.toString()) changed = true;
        } else if (queryLang) {
            try {
                localStorage.setItem('preferredLanguage', queryLang);
            } catch (_) {
                // no-op
            }

            if (this.shouldPrefixPath(targetPath)) {
                targetPath = this.withLanguagePrefix(targetPath, queryLang);

                const before = params.toString();
                params.delete('lang');
                params.delete('v');

                const nextUrl = this.buildUrl(targetPath, params, currentUrl.hash);
                const currentFull = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
                if (nextUrl !== currentFull || before !== params.toString()) {
                    window.history.replaceState(null, '', nextUrl);
                }
                return;
            }

            const before = params.toString();
            params.delete('lang');
            params.delete('v');
            if (before !== params.toString()) changed = true;
            if (targetPath !== currentUrl.pathname) changed = true;
        } else if (params.has('v') && (pathLang || targetPath === '/')) {
            params.delete('v');
            changed = true;
        }

        if (!changed) return;

        const nextUrl = this.buildUrl(targetPath, params, currentUrl.hash);
        const currentFull = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
        if (nextUrl !== currentFull) {
            window.location.replace(nextUrl);
        }
    }

    static isSeoDetailPath(pathname) {
        if (typeof window.__SEO_PATH_LANG__ === 'string') return true;

        const path = String(pathname || '');
        const patterns = [
            /^\/(kr|en|jp|cn)\/?$/i,
            /^\/(kr|en|jp|cn)\/(synergy|wonder-weapon|character)\/[^/]+\/?$/i,
            /^\/(synergy|wonder-weapon|character)\/[^/]+\/?$/i
        ];

        return patterns.some((re) => re.test(path));
    }

    static getCurrentLanguage() {
        const pathLang = this.getPathLanguage(window.location.pathname);
        if (pathLang) return pathLang;

        const seoDetail = this.parseSeoDetailPath(window.location.pathname);
        if (seoDetail) return seoDetail.lang;

        const urlLang = this.normalizeLang(new URLSearchParams(window.location.search).get('lang'));
        if (urlLang) return urlLang;

        const savedLang = this.normalizeLang(localStorage.getItem('preferredLanguage'));
        if (savedLang) return savedLang;

        return this.getBrowserLanguage();
    }

    static async detectLanguageByIP() {
        try {
            const apis = [
                'https://ipapi.co/json/',
                'https://ipinfo.io/json',
                'https://api.ipgeolocation.io/ipgeo?apiKey=demo'
            ];

            let locationData = null;
            for (const api of apis) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000);

                    const response = await fetch(api, { signal: controller.signal });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        locationData = await response.json();
                        break;
                    }
                } catch (_) {
                    // try next api
                }
            }

            const countryCode = locationData
                ? (locationData.country_code || locationData.country || locationData.countryCode || '')
                : '';

            let detectedLang = 'en';
            if (countryCode === 'KR') detectedLang = 'kr';
            else if (countryCode === 'JP') detectedLang = 'jp';
            else if (countryCode === 'CN' || countryCode === 'TW' || countryCode === 'HK') detectedLang = 'cn';

            localStorage.setItem('preferredLanguage', detectedLang);
            localStorage.setItem('languageDetected', 'true');
            localStorage.setItem('detectedCountry', countryCode || 'unknown');

            return detectedLang;
        } catch (_) {
            const fallbackLang = this.getBrowserLanguage();
            localStorage.setItem('preferredLanguage', fallbackLang);
            localStorage.setItem('languageDetected', 'true');
            localStorage.setItem('detectionMethod', 'browser');
            return fallbackLang;
        }
    }

    static async initializeLanguageDetection() {
        const path = window.location.pathname;
        const pathLang = this.getPathLanguage(path);

        if (pathLang) {
            localStorage.setItem('preferredLanguage', pathLang);
            return pathLang;
        }

        const queryLang = this.normalizeLang(new URLSearchParams(window.location.search).get('lang'));
        if (queryLang) {
            localStorage.setItem('preferredLanguage', queryLang);
            return queryLang;
        }

        const savedLang = this.normalizeLang(localStorage.getItem('preferredLanguage'));
        const hasDetected = localStorage.getItem('languageDetected');

        let targetLang = savedLang;
        if (!targetLang && !hasDetected) {
            targetLang = await this.detectLanguageByIP();
        } else if (!targetLang) {
            targetLang = this.getBrowserLanguage();
            localStorage.setItem('preferredLanguage', targetLang);
        }

        if (path === '/') {
            const params = new URLSearchParams(window.location.search);
            params.delete('lang');
            params.delete('v');
            const targetPath = this.withLanguagePrefix('/', targetLang || 'kr');
            const nextUrl = this.buildUrl(targetPath, params, window.location.hash);
            const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
            if (nextUrl !== current) {
                window.location.replace(nextUrl);
            }
        }

        return targetLang;
    }

    static handleLanguageRouting() {
        const url = new URL(window.location.href);
        const pathLang = this.getPathLanguage(url.pathname);

        if (pathLang) {
            localStorage.setItem('preferredLanguage', pathLang);

            const before = url.searchParams.toString();
            url.searchParams.delete('lang');
            url.searchParams.delete('v');
            const after = url.searchParams.toString();

            if (before !== after) {
                const nextUrl = this.buildUrl(url.pathname, url.searchParams, url.hash);
                window.location.replace(nextUrl);
            }
        }
    }

    static setupLanguageRedirection() {
        const overrideNavigationSelect = () => {
            if (!window.Navigation) return;

            window.Navigation.selectLanguage = async (lang, event) => {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                }

                const safeLang = this.normalizeLang(lang) || 'kr';
                localStorage.setItem('preferredLanguage', safeLang);

                const optionsContainer = document.querySelector('.options-container');
                if (optionsContainer) {
                    optionsContainer.classList.remove('active');
                }

                const currentUrl = new URL(window.location.href);
                const params = new URLSearchParams(currentUrl.search);
                params.delete('lang');
                params.delete('v');
                params.delete('weapon');

                let nextPath = currentUrl.pathname;
                const currentPathLang = this.getPathLanguage(currentUrl.pathname);

                if (currentPathLang) {
                    nextPath = currentUrl.pathname.replace(/^\/(kr|en|jp|cn)(?=\/|$)/i, `/${safeLang}`);
                } else if (currentUrl.pathname === '/' || this.shouldPrefixPath(currentUrl.pathname)) {
                    nextPath = this.withLanguagePrefix(currentUrl.pathname, safeLang);
                }

                const nextUrl = this.buildUrl(nextPath, params, currentUrl.hash);
                window.location.href = nextUrl;
            };
        };

        overrideNavigationSelect();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', overrideNavigationSelect);
        }
    }

    static async init() {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = (async () => {
            try {
                this.handleImmediateRedirect();
                await this.initializeLanguageDetection();
                this.handleLanguageRouting();
                this.setupLanguageRedirection();
                return this.getCurrentLanguage();
            } catch (error) {
                console.error('Language router initialization failed:', error);
                return 'kr';
            }
        })();

        return this.initPromise;
    }

    static getLanguageDebugInfo() {
        const pathLang = this.getPathLanguage(window.location.pathname);
        const queryLang = this.normalizeLang(new URLSearchParams(window.location.search).get('lang'));

        return {
            currentLanguage: this.getCurrentLanguage(),
            pathLanguage: pathLang,
            queryLanguage: queryLang,
            preferredLanguage: localStorage.getItem('preferredLanguage'),
            languageDetected: localStorage.getItem('languageDetected'),
            detectedCountry: localStorage.getItem('detectedCountry'),
            detectionMethod: localStorage.getItem('detectionMethod'),
            browserLanguage: navigator.language
        };
    }

    static resetLanguageSettings() {
        localStorage.removeItem('preferredLanguage');
        localStorage.removeItem('languageDetected');
        localStorage.removeItem('detectedCountry');
        localStorage.removeItem('detectionMethod');
    }
}

if (typeof window !== 'undefined') {
    LanguageRouter.init();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LanguageRouter.init());
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            if (document.documentElement.classList.contains('i18n-loading')) {
                console.warn('i18n-loading class was not removed. Force removing it.');
                document.documentElement.classList.remove('i18n-loading');
            }
        }, 1000);
    });
}

window.getCurrentLanguage = LanguageRouter.getCurrentLanguage.bind(LanguageRouter);
window.LanguageRouter = LanguageRouter;

window.debugLanguage = function () {
    LanguageRouter.detectLanguageByIP().catch(() => {
        // no-op
    });
};

window.resetLanguage = function () {
    LanguageRouter.resetLanguageSettings();
};

window.testIPDetection = async function () {
    const apis = [
        'https://ipapi.co/json/',
        'https://ipinfo.io/json',
        'https://api.ipgeolocation.io/ipgeo?apiKey=demo'
    ];

    for (const api of apis) {
        try {
            const response = await fetch(api);
            await response.json();
        } catch (_) {
            // no-op
        }
    }
};
