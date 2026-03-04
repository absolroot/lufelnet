const VelvetTrialI18n = (function () {
  const SUPPORTED = ['kr', 'en', 'jp'];
  const PACKS = {
    kr: 'I18N_PAGE_VELVET_TRIAL_KR',
    en: 'I18N_PAGE_VELVET_TRIAL_EN',
    jp: 'I18N_PAGE_VELVET_TRIAL_JP'
  };

  let currentLang = 'kr';

  function normalizeLang(raw) {
    const lang = String(raw || '').trim().toLowerCase().replace('_', '-');
    if (SUPPORTED.includes(lang)) return lang;
    const base = lang.split('-')[0];
    if (base === 'ko') return 'kr';
    if (base === 'ja') return 'jp';
    if (base === 'en') return 'en';
    return 'kr';
  }

  function getPack(lang = currentLang) {
    const normalized = normalizeLang(lang);
    const varName = PACKS[normalized];
    return window[varName] || window[PACKS.kr] || {};
  }

  function detectLang() {
    try {
      const path = String(window.location.pathname || '').toLowerCase();
      const match = path.match(/^\/(kr|en|jp)(\/|$)/);
      if (match && match[1]) return normalizeLang(match[1]);
    } catch (_) {}

    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get('lang');
      if (lang) return normalizeLang(lang);
    } catch (_) {}

    try {
      if (typeof LanguageRouter !== 'undefined' && typeof LanguageRouter.getCurrentLanguage === 'function') {
        return normalizeLang(LanguageRouter.getCurrentLanguage());
      }
    } catch (_) {}

    return 'kr';
  }

  function template(value, vars) {
    if (!vars || typeof vars !== 'object') return value;
    return String(value).replace(/\{([^}]+)\}/g, (_, key) => {
      if (Object.prototype.hasOwnProperty.call(vars, key)) {
        return String(vars[key]);
      }
      return `{${key}}`;
    });
  }

  function t(key, vars) {
    const pack = getPack(currentLang);
    const fallback = getPack('kr');
    const value = Object.prototype.hasOwnProperty.call(pack, key)
      ? pack[key]
      : (Object.prototype.hasOwnProperty.call(fallback, key) ? fallback[key] : key);
    return template(value, vars);
  }

  function getAdaptLabel(key) {
    const pack = getPack(currentLang);
    const labels = pack.adaptLabels || {};
    if (labels[key]) return labels[key];
    const fallback = getPack('kr').adaptLabels || {};
    return fallback[key] || { text: key, cls: '' };
  }

  function getElementName(elementId) {
    const pack = getPack(currentLang);
    const elements = pack.elements || {};
    if (elements[elementId]) return elements[elementId];
    const fallback = getPack('kr').elements || {};
    return fallback[elementId] || String(elementId);
  }

  function init() {
    currentLang = detectLang();
  }

  function getLang() {
    return currentLang;
  }

  return {
    init,
    t,
    getLang,
    detectLang,
    getPack,
    getAdaptLabel,
    getElementName,
    SUPPORTED
  };
})();
