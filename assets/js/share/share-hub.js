(function initShareHub(global) {
  'use strict';

  var STORAGE_KEY = 'share-hub:v1:last-tab';
  var NOTICE_PARAM = 'share_notice';
  var NOTICE_REVELATION_UNAVAILABLE = 'revelation-unavailable';

  function normalizeLang(raw) {
    var value = String(raw || '').trim().toLowerCase();
    if (value === 'tw') return 'cn';
    if (value === 'sea') return 'en';
    if (value === 'kr' || value === 'en' || value === 'jp' || value === 'cn') return value;
    return 'kr';
  }

  function normalizeTab(raw) {
    return String(raw || '').trim().toLowerCase() === 'revelation' ? 'revelation' : 'character';
  }

  function detectPathLang(pathname) {
    var match = String(pathname || '').toLowerCase().match(/^\/(kr|en|jp|cn)(\/|$)/);
    return match ? match[1] : '';
  }

  function detectPreferredLanguage() {
    var pathLang = detectPathLang(global.location && global.location.pathname);
    if (pathLang) return pathLang;

    try {
      var rawQueryLang = String(new URLSearchParams(global.location.search || '').get('lang') || '').trim().toLowerCase();
      if (rawQueryLang) return normalizeLang(rawQueryLang);
    } catch (_) {}

    try {
      var stored = String(global.localStorage.getItem('preferredLanguage') || '').toLowerCase();
      if (stored) return normalizeLang(stored);
    } catch (_) {}

    if (global.LanguageRouter && typeof global.LanguageRouter.getCurrentLanguage === 'function') {
      return normalizeLang(global.LanguageRouter.getCurrentLanguage());
    }

    return 'kr';
  }

  function getLastShareTab() {
    try {
      return normalizeTab(global.localStorage.getItem(STORAGE_KEY));
    } catch (_) {
      return 'character';
    }
  }

  function setLastShareTab(tab) {
    var normalized = normalizeTab(tab);
    try {
      global.localStorage.setItem(STORAGE_KEY, normalized);
    } catch (_) {}
    return normalized;
  }

  function isShareTabAvailable(lang, tab) {
    return true;
  }

  function buildShareUrl(lang, tab) {
    var safeLang = normalizeLang(lang);
    var safeTab = normalizeTab(tab);
    if (!isShareTabAvailable(safeLang, safeTab)) {
      safeTab = 'character';
    }
    return '/' + safeLang + '/share/' + (safeTab === 'revelation' ? 'revelation/' : 'character/');
  }

  function resolveShareTarget(lang, requestedTab) {
    var safeLang = normalizeLang(lang || detectPreferredLanguage());
    var desiredTab = normalizeTab(requestedTab || getLastShareTab());
    var available = isShareTabAvailable(safeLang, desiredTab);
    var resolvedTab = available ? desiredTab : 'character';

    return {
      lang: safeLang,
      requestedTab: desiredTab,
      tab: resolvedTab,
      available: available,
      url: buildShareUrl(safeLang, resolvedTab)
    };
  }

  function appendParams(url, params) {
    var query = '';
    if (params && typeof params.toString === 'function') {
      query = params.toString();
    }
    return url + (query ? '?' + query : '');
  }

  global.ShareHub = {
    STORAGE_KEY: STORAGE_KEY,
    NOTICE_PARAM: NOTICE_PARAM,
    NOTICE_REVELATION_UNAVAILABLE: NOTICE_REVELATION_UNAVAILABLE,
    normalizeLang: normalizeLang,
    normalizeTab: normalizeTab,
    detectPathLang: detectPathLang,
    detectPreferredLanguage: detectPreferredLanguage,
    buildShareUrl: buildShareUrl,
    getLastShareTab: getLastShareTab,
    setLastShareTab: setLastShareTab,
    isShareTabAvailable: isShareTabAvailable,
    resolveShareTarget: resolveShareTarget,
    appendParams: appendParams
  };
})(window);
