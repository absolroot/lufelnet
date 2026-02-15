(function () {
  'use strict';

  const PAGE_NAME = 'pull-tracker';
  const SUPPORTED_LANGS = ['kr', 'en', 'jp'];
  const DEBUG = (() => {
    try { return new URLSearchParams(window.location.search).get('i18nDebug') === '1'; } catch (_) { return false; }
  })();

  const listeners = new Set();
  let initPromise = null;
  let subscribed = false;
  let currentSection = 'individual';

  function getPathValue(obj, path) {
    if (!obj || !path) return undefined;
    const keys = String(path).split('.');
    let current = obj;
    for (const key of keys) {
      if (current == null || typeof current !== 'object' || !(key in current)) {
        return undefined;
      }
      current = current[key];
    }
    return current;
  }

  function getService() {
    return window.__I18nService__ || window.I18nService || null;
  }

  function waitFor(checker, timeoutMs = 8000, intervalMs = 30) {
    return new Promise((resolve) => {
      const start = Date.now();
      const tick = () => {
        if (checker()) return resolve(true);
        if (Date.now() - start >= timeoutMs) return resolve(false);
        setTimeout(tick, intervalMs);
      };
      tick();
    });
  }

  function normalizeLang(lang) {
    const normalized = String(lang || '').toLowerCase();
    return SUPPORTED_LANGS.includes(normalized) ? normalized : 'kr';
  }

  function detectLangFromURL() {
    try {
      return normalizeLang(new URLSearchParams(window.location.search).get('lang') || 'kr');
    } catch (_) {
      return 'kr';
    }
  }

  function getCurrentLang() {
    const service = getService();
    if (service && typeof service.getCurrentLanguage === 'function') {
      return normalizeLang(service.getCurrentLanguage());
    }
    return detectLangFromURL();
  }

  function getLookupOrder(lang) {
    const dedup = [];
    [lang, 'en', 'kr'].forEach((v) => {
      if (!v) return;
      if (!dedup.includes(v)) dedup.push(v);
    });
    return dedup;
  }

  function lookupFromI18N(lang, key) {
    return getPathValue(window.I18N && window.I18N[lang], key);
  }

  function lookupFromService(service, lang, key) {
    if (!service || !service.cache) return undefined;
    const pageHit = getPathValue(service.cache[lang]?.pages?.[PAGE_NAME], key);
    if (pageHit !== undefined) return pageHit;
    return getPathValue(service.cache[lang]?.common, key);
  }

  async function ensureAllLanguageBundles(service) {
    if (!service) return false;
    if (typeof service.loadPageTranslations !== 'function') return false;

    await Promise.all(SUPPORTED_LANGS.map(async (lang) => {
      try {
        if (typeof service.loadCommonTranslations === 'function') {
          await service.loadCommonTranslations(lang);
        }
        await service.loadPageTranslations(PAGE_NAME, lang);
      } catch (_) { }
    }));

    if (!window.I18N || typeof window.I18N !== 'object') {
      window.I18N = {};
    }

    SUPPORTED_LANGS.forEach((lang) => {
      const common = service.cache?.[lang]?.common || {};
      const page = service.cache?.[lang]?.pages?.[PAGE_NAME] || {};
      window.I18N[lang] = { ...common, ...page };
    });

    return true;
  }

  function notifyLanguageChange(newLang, oldLang) {
    listeners.forEach((cb) => {
      try { cb(newLang, oldLang); } catch (_) { }
    });
  }

  function subscribeLanguageChange() {
    if (subscribed) return;
    const service = getService();
    if (!service || typeof service.onLanguageChange !== 'function') return;
    subscribed = true;
    service.onLanguageChange((oldLang, newLang) => {
      notifyLanguageChange(newLang, oldLang);
    });
  }

  async function init(pageSection) {
    if (typeof pageSection === 'string' && pageSection.trim()) {
      currentSection = pageSection.trim();
    }

    if (!initPromise) {
      initPromise = (async () => {
        await waitFor(() => {
          const service = getService();
          return !!(service && typeof service.init === 'function');
        });

        const service = getService();

        let adapterInitialized = false;
        const hasAdapter = await waitFor(() => typeof window.initPageI18n === 'function', 5000);
        if (hasAdapter) {
          try {
            await window.initPageI18n(PAGE_NAME);
            adapterInitialized = true;
          } catch (_) { }
        }

        if (!adapterInitialized && service && typeof service.init === 'function') {
          await service.init(PAGE_NAME);
        }

        await ensureAllLanguageBundles(getService() || service);
        return true;
      })();
    }

    await initPromise;
    subscribeLanguageChange();
    return true;
  }

  function t(key, fallback) {
    const service = getService();
    const lang = getCurrentLang();
    const order = getLookupOrder(lang);

    for (const targetLang of order) {
      const hit = lookupFromI18N(targetLang, key);
      if (hit !== undefined) return hit;
    }

    for (const targetLang of order) {
      const hit = lookupFromService(service, targetLang, key);
      if (hit !== undefined) return hit;
    }

    // Bridge fallback: if adapter exposed global t() and no explicit fallback passed.
    if (fallback === undefined && typeof window.t === 'function') {
      try {
        const hit = window.t(key, undefined);
        if (hit !== undefined && hit !== null && hit !== '') return hit;
      } catch (_) { }
    }

    if (DEBUG) {
      try { console.warn(`[pull-tracker i18n] Missing key: ${key} (lang: ${lang})`); } catch (_) { }
    }

    if (fallback !== undefined) return fallback;
    return key;
  }

  function onChange(callback) {
    if (typeof callback !== 'function') return () => { };
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  window.PullTrackerI18n = {
    init,
    t,
    lang: getCurrentLang,
    onChange,
    section: () => currentSection
  };
})();
