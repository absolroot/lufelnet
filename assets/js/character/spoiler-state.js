(function () {
    'use strict';

    var STORAGE_KEY = 'spoilerToggle';
    var CHANGE_EVENT = 'spoiler:changed';
    var listeners = new Set();

    function parseValue(raw) {
        return raw === 'true';
    }

    function safeGetStored() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (_) {
            return null;
        }
    }

    function safeSetStored(enabled) {
        try {
            localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
        } catch (_) { }
    }

    function normalizeLang(rawLang) {
        var lang = String(rawLang || '').trim().toLowerCase();
        if (!lang) return 'kr';
        if (lang === 'kr' || lang === 'ko') return 'kr';
        if (lang === 'en') return 'en';
        if (lang === 'jp' || lang === 'ja') return 'jp';
        return lang;
    }

    function detectCurrentLang() {
        try {
            if (typeof getCurrentLanguage === 'function') {
                return normalizeLang(getCurrentLanguage());
            }
        } catch (_) { }

        try {
            if (typeof I18NUtils !== 'undefined' && I18NUtils && typeof I18NUtils.getCurrentLanguageSafe === 'function') {
                return normalizeLang(I18NUtils.getCurrentLanguageSafe());
            }
        } catch (_) { }

        try {
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter && typeof LanguageRouter.getCurrentLanguage === 'function') {
                return normalizeLang(LanguageRouter.getCurrentLanguage());
            }
        } catch (_) { }

        try {
            var saved = localStorage.getItem('preferredLanguage');
            if (saved) return normalizeLang(saved);
        } catch (_) { }

        return 'kr';
    }

    var state = parseValue(safeGetStored());

    function emitChange(source) {
        var detail = {
            enabled: !!state,
            source: source || 'api'
        };

        try {
            window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: detail }));
        } catch (_) { }

        listeners.forEach(function (listener) {
            try {
                listener(detail);
            } catch (_) { }
        });
    }

    function get() {
        return !!state;
    }

    function set(enabled, meta) {
        var next = !!enabled;
        safeSetStored(next);
        if (next === state) return;
        state = next;
        emitChange(meta && meta.source ? meta.source : 'api');
    }

    function subscribe(listener) {
        if (typeof listener !== 'function') {
            return function () { };
        }
        listeners.add(listener);
        return function () {
            listeners.delete(listener);
        };
    }

    function shouldShowControl(lang) {
        var resolved = lang ? normalizeLang(lang) : detectCurrentLang();
        return resolved !== 'kr';
    }

    function resolveElement(ref) {
        if (!ref) return null;
        if (typeof ref === 'string') return document.querySelector(ref);
        return ref;
    }

    function bindCheckbox(options) {
        var opts = options || {};
        var checkbox = resolveElement(opts.checkbox);
        if (!checkbox) return function () { };

        var container = resolveElement(opts.container);
        var displayStyle = Object.prototype.hasOwnProperty.call(opts, 'displayStyle')
            ? opts.displayStyle
            : '';

        function syncVisibility() {
            if (!container) return;
            if (opts.forceVisible === true) {
                container.style.display = displayStyle;
                return;
            }
            if (opts.forceVisible === false) {
                container.style.display = 'none';
                return;
            }
            container.style.display = shouldShowControl(opts.lang) ? displayStyle : 'none';
        }

        checkbox.checked = get();
        syncVisibility();

        var isDisposed = false;

        function handleChange() {
            if (isDisposed) return;
            set(checkbox.checked, { source: opts.source || 'checkbox' });
        }

        checkbox.addEventListener('change', handleChange);

        var unsubscribe = subscribe(function (detail) {
            if (isDisposed) return;
            if (checkbox.checked !== detail.enabled) {
                checkbox.checked = detail.enabled;
            }
            if (typeof opts.onChange === 'function') {
                try {
                    opts.onChange(detail.enabled, detail);
                } catch (_) { }
            }
        });

        return function () {
            isDisposed = true;
            checkbox.removeEventListener('change', handleChange);
            unsubscribe();
        };
    }

    window.addEventListener('storage', function (event) {
        if (event.key !== STORAGE_KEY) return;
        var next = parseValue(event.newValue);
        if (next === state) return;
        state = next;
        emitChange('storage');
    });

    window.SpoilerState = {
        get: get,
        set: set,
        subscribe: subscribe,
        bindCheckbox: bindCheckbox,
        shouldShowControl: shouldShowControl
    };
})();
