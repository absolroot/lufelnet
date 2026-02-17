(function initVersionRuntime(global) {
    'use strict';

    if (global.VersionRuntime && global.VersionRuntime.__initialized__) {
        return;
    }

    const STATIC_EXTENSIONS = new Set([
        '.js', '.mjs', '.css', '.json', '.csv',
        '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico',
        '.woff', '.woff2', '.ttf'
    ]);

    const ABSOLUTE_URL_RE = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;
    const PROTOCOL_RELATIVE_RE = /^\/\//;
    const nativeFetch = (typeof global.fetch === 'function') ? global.fetch.bind(global) : null;

    function getAppVersion() {
        const value = (typeof global.APP_VERSION === 'string') ? global.APP_VERSION.trim() : '';
        return value || '0';
    }

    function hasStaticExtension(pathname) {
        const lower = String(pathname || '').toLowerCase();
        for (const ext of STATIC_EXTENSIONS) {
            if (lower.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }

    function shouldAttachVersion(url) {
        const pathname = String(url.pathname || '');
        if (pathname.startsWith('/data/')) return true;
        if (pathname.includes('/assets/js/')) return true;
        if (pathname.includes('/assets/css/')) return true;
        return hasStaticExtension(pathname);
    }

    function isSameOrigin(url) {
        if (!global.location || !global.location.origin) return false;
        return url.origin === global.location.origin;
    }

    function toOutputUrl(url, originalInput) {
        const source = String(originalInput || '');
        if (ABSOLUTE_URL_RE.test(source) || PROTOCOL_RELATIVE_RE.test(source)) {
            return url.toString();
        }
        return `${url.pathname}${url.search}${url.hash}`;
    }

    function assetUrl(input) {
        const source = String(input || '');
        if (!source) return source;

        let resolved;
        try {
            const base = (global.location && global.location.href) ? global.location.href : 'http://localhost/';
            resolved = new URL(source, base);
        } catch (_) {
            return source;
        }

        if (!isSameOrigin(resolved)) return source;
        if (!shouldAttachVersion(resolved)) return source;
        if (resolved.searchParams.has('v')) return source;

        resolved.searchParams.set('v', getAppVersion());
        return toOutputUrl(resolved, input);
    }

    function stripVersionFromCurrentUrl() {
        if (!global.location || !global.history || typeof global.history.replaceState !== 'function') {
            return false;
        }

        let current;
        try {
            current = new URL(global.location.href);
        } catch (_) {
            return false;
        }

        if (!current.searchParams.has('v')) {
            return false;
        }

        current.searchParams.delete('v');
        const normalized = `${current.pathname}${current.search}${current.hash}`;
        global.history.replaceState(global.history.state || null, '', normalized);
        return true;
    }

    function versionedFetch(input, init) {
        if (!nativeFetch) {
            return Promise.reject(new Error('Fetch API is not available.'));
        }

        try {
            const isRequestObject = (typeof Request !== 'undefined') && (input instanceof Request);
            const method = String(
                (init && init.method) ||
                (isRequestObject ? input.method : 'GET') ||
                'GET'
            ).toUpperCase();

            if (method !== 'GET') {
                return nativeFetch(input, init);
            }

            const sourceUrl = isRequestObject ? input.url : String(input || '');
            const nextUrl = assetUrl(sourceUrl);
            if (!nextUrl || nextUrl === sourceUrl) {
                return nativeFetch(input, init);
            }

            if (isRequestObject) {
                const nextRequest = new Request(nextUrl, input);
                return nativeFetch(nextRequest, init);
            }

            return nativeFetch(nextUrl, init);
        } catch (_) {
            return nativeFetch(input, init);
        }
    }

    if (nativeFetch && !global.__VERSION_RUNTIME_FETCH_PATCHED__) {
        global.fetch = versionedFetch;
        global.__VERSION_RUNTIME_FETCH_PATCHED__ = true;
    }

    const api = {
        __initialized__: true,
        getAppVersion,
        assetUrl,
        versionedFetch,
        stripVersionFromCurrentUrl
    };

    global.VersionRuntime = api;

    // Keep legacy URLs compatible while normalizing the browser URL.
    stripVersionFromCurrentUrl();
})(window);
