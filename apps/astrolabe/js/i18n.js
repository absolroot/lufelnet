// Astrolabe Internationalization (i18n page-pack only)
const AstrolabeI18n = (function () {
  const SUPPORTED_LANGS = ['kr', 'en', 'jp', 'cn', 'tw', 'sea'];
  const PAGE_PACK_VAR = {
    kr: 'I18N_PAGE_ASTROLABE_KR',
    en: 'I18N_PAGE_ASTROLABE_EN',
    jp: 'I18N_PAGE_ASTROLABE_JP',
    cn: 'I18N_PAGE_ASTROLABE_CN',
    tw: 'I18N_PAGE_ASTROLABE_TW',
    sea: 'I18N_PAGE_ASTROLABE_SEA'
  };

  let currentLang = 'kr';
  const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);
  const packLoadPromises = {};

  function normalizeLang(lang) {
    const raw = String(lang || '').trim().toLowerCase().replace('_', '-');
    if (SUPPORTED_LANGS.includes(raw)) return raw;

    const base = raw.split('-')[0];
    if (base === 'ko') return 'kr';
    if (base === 'ja') return 'jp';
    if (base === 'zh') return 'cn';
    if (base === 'en') return 'en';

    return 'kr';
  }

  function getPackVarName(lang) {
    return PAGE_PACK_VAR[normalizeLang(lang)];
  }

  function getRawPack(lang) {
    const varName = getPackVarName(lang);
    const pack = window[varName];
    return pack && typeof pack === 'object' ? pack : null;
  }

  function getPackScriptUrl(lang) {
    const normalizedLang = normalizeLang(lang);
    const base = (typeof window !== 'undefined' && (window.BASE_URL || window.SITE_BASEURL)) || '';
    const version = (typeof window !== 'undefined' && window.APP_VERSION) ? window.APP_VERSION : Date.now();
    return `${base}/i18n/pages/astrolabe/${normalizedLang}.js?v=${version}`;
  }

  function ensurePackLoaded(lang) {
    const normalizedLang = normalizeLang(lang);
    const existing = getRawPack(normalizedLang);
    if (existing) return Promise.resolve(existing);

    if (packLoadPromises[normalizedLang]) {
      return packLoadPromises[normalizedLang];
    }

    packLoadPromises[normalizedLang] = new Promise((resolve) => {
      try {
        const varName = getPackVarName(normalizedLang);
        const scriptPathToken = `/i18n/pages/astrolabe/${normalizedLang}.js`;
        const existingScript = Array.from(document.querySelectorAll('script[src]'))
          .find((s) => typeof s.src === 'string' && s.src.includes(scriptPathToken));

        const resolvePack = () => {
          const pack = window[varName];
          if (!pack || typeof pack !== 'object') {
            console.warn(`[AstrolabeI18n] Pack not available: ${varName}`);
          }
          resolve(pack && typeof pack === 'object' ? pack : null);
        };

        if (existingScript) {
          // If a script tag already exists, resolve on next tick with whatever is available.
          setTimeout(resolvePack, 0);
          return;
        }

        const script = document.createElement('script');
        script.src = getPackScriptUrl(normalizedLang);
        script.async = true;
        script.onload = resolvePack;
        script.onerror = () => {
          console.warn(`[AstrolabeI18n] Failed to load pack script: ${script.src}`);
          resolve(null);
        };
        document.head.appendChild(script);
      } catch (_) {
        resolve(null);
      }
    });

    return packLoadPromises[normalizedLang];
  }

  async function ensurePacksReady() {
    const targets = [normalizeLang(currentLang)];
    if (!targets.includes('kr')) targets.push('kr');
    await Promise.all(targets.map((lang) => ensurePackLoaded(lang)));
  }

  function getPagePack(lang = currentLang) {
    const normalizedLang = normalizeLang(lang);
    return getRawPack(normalizedLang) || getRawPack('kr') || {};
  }

  function detectLang() {
    try {
      const params = new URLSearchParams(window.location.search);

      // 1) Explicit language query has highest priority.
      const urlLangValues = params.getAll('lang');
      for (let i = urlLangValues.length - 1; i >= 0; i -= 1) {
        const normalized = normalizeLang(urlLangValues[i]);
        if (SUPPORTED_LANGS.includes(normalized)) return normalized;
      }

      // 2) Router language (site-level preference).
      if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
        const l = LanguageRouter.getCurrentLanguage() || 'kr';
        return normalizeLang(l);
      }

      // 3) Saved language preference.
      const saved = localStorage.getItem('preferredLanguage');
      if (saved) {
        return normalizeLang(saved);
      }

      // 4) If no language signal exists, fall back to server region.
      const urlServerValues = params.getAll('server');
      for (let i = urlServerValues.length - 1; i >= 0; i -= 1) {
        const normalized = normalizeLang(urlServerValues[i]);
        if (SUPPORTED_LANGS.includes(normalized)) return normalized;
      }

      // 5) Last used server region.
      const savedRegion = localStorage.getItem('carousel_region');
      if (savedRegion) {
        return normalizeLang(savedRegion);
      }
    } catch (_) { }
    return 'kr';
  }

  function loadRegion() {
    try {
      const urlServer = new URLSearchParams(window.location.search).get('server');
      if (urlServer && typeof AstrolabeConfig !== 'undefined' && AstrolabeConfig.REGIONS.includes(urlServer)) {
        return urlServer;
      }
    } catch (_) { }

    try {
      const saved = localStorage.getItem('carousel_region');
      if (saved && typeof AstrolabeConfig !== 'undefined' && AstrolabeConfig.REGIONS.includes(saved)) {
        return saved;
      }
    } catch (_) { }

    const lang = detectLang();
    if (lang === 'kr') return 'kr';
    if (lang === 'jp') return 'jp';
    return 'en';
  }

  function t(key) {
    const pack = getPagePack();
    if (hasOwn(pack, key)) return pack[key];

    const enPack = getPagePack('en');
    if (hasOwn(enPack, key)) return enPack[key];

    const krPack = getPagePack('kr');
    if (hasOwn(krPack, key)) return krPack[key];

    return key;
  }

  function getAdaptLabel(type) {
    const labels = getPagePack().adaptLabels || {};
    if (hasOwn(labels, type)) {
      return {
        text: labels[type].text || type,
        cls: labels[type].cls || ''
      };
    }

    const enLabels = getPagePack('en').adaptLabels || {};
    if (hasOwn(enLabels, type)) {
      return {
        text: enLabels[type].text || type,
        cls: enLabels[type].cls || ''
      };
    }

    const krLabels = getPagePack('kr').adaptLabels || {};
    if (hasOwn(krLabels, type)) {
      return {
        text: krLabels[type].text || type,
        cls: krLabels[type].cls || ''
      };
    }

    return { text: type, cls: '' };
  }

  async function init() {
    currentLang = detectLang();
    await ensurePacksReady();
  }

  function setLang(lang) {
    currentLang = normalizeLang(lang);
  }

  function getLang() {
    return currentLang;
  }

  function formatCountdown(ms) {
    if (ms <= 0) return t('ended');
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = n => n < 10 ? '0' + n : '' + n;

    if (days > 0) {
      return `${days}${t('days')} ${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  return {
    init,
    ensurePacksReady,
    ensurePackLoaded,
    detectLang,
    loadRegion,
    t,
    getAdaptLabel,
    setLang,
    getLang,
    formatCountdown,
    getPagePack,
    SUPPORTED_LANGS
  };
})();
