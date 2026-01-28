// Astrolabe Internationalization
const AstrolabeI18n = (function () {
  const SUPPORTED_LANGS = ['kr', 'en', 'jp', 'cn', 'tw', 'sea'];

  const translations = {
    title: {
      kr: '성좌의 시련',
      en: 'Trial of the Astrolabe',
      jp: 'アストロラーベの試練',
      cn: '天域星盘',
      tw: '天域星盤',
      sea: 'Trial of the Astrolabe'
    },
    timeRemaining: {
      kr: '남은 시간',
      en: 'Time Remaining',
      jp: '残り時間',
      cn: '剩余时间',
      tw: '剩餘時間',
      sea: 'Time Remaining'
    },
    ended: {
      kr: '종료',
      en: 'Ended',
      jp: '終了',
      cn: '已结束',
      tw: '已結束',
      sea: 'Ended'
    },
    enemies: {
      kr: '적',
      en: 'Enemies',
      jp: '敵',
      cn: '敌人',
      tw: '敵人',
      sea: 'Enemies'
    },
    affix: {
      kr: '기믹',
      en: 'Gimmick',
      jp: 'ギミック',
      cn: '词缀',
      tw: '詞綴',
      sea: 'Gimmick'
    },
    rewards: {
      kr: '보상',
      en: 'Rewards',
      jp: '報酬',
      cn: '奖励',
      tw: '獎勵',
      sea: 'Rewards'
    },
    level: {
      kr: 'Lv.',
      en: 'Lv.',
      jp: 'Lv.',
      cn: 'Lv.',
      tw: 'Lv.',
      sea: 'Lv.'
    },
    days: {
      kr: '일',
      en: 'd',
      jp: '日',
      cn: '天',
      tw: '天',
      sea: 'd'
    },
    close: {
      kr: '닫기',
      en: 'Close',
      jp: '閉じる',
      cn: '关闭',
      tw: '關閉',
      sea: 'Close'
    },
    home: {
      kr: '홈',
      en: 'Home',
      jp: 'ホーム',
      cn: '首页',
      tw: '首頁',
      sea: 'Home'
    },
    zoomIn: {
      kr: '확대',
      en: 'Zoom In',
      jp: '拡大',
      cn: '放大',
      tw: '放大',
      sea: 'Zoom In'
    },
    zoomOut: {
      kr: '축소',
      en: 'Zoom Out',
      jp: '縮小',
      cn: '缩小',
      tw: '縮小',
      sea: 'Zoom Out'
    },
    reset: {
      kr: '리셋',
      en: 'Reset',
      jp: 'リセット',
      cn: '重置',
      tw: '重置',
      sea: 'Reset'
    }
  };

  // Adapt labels (from bosses.js)
  const adaptLabels = {
    Weak: { kr: '약', en: 'Wk', jp: '弱', cn: '弱', tw: '弱', sea: 'Wk', cls: 'weak' },
    Resistant: { kr: '내', en: 'Res', jp: '耐', cn: '耐', tw: '耐', sea: 'Res', cls: 'res' },
    Nullify: { kr: '무', en: 'Nul', jp: '無', cn: '無', tw: '無', sea: 'Nul', cls: 'nul' },
    Absorb: { kr: '흡', en: 'Abs', jp: '吸', cn: '吸', tw: '吸', sea: 'Abs', cls: 'abs' },
    Reflect: { kr: '반', en: 'Rpl', jp: '反', cn: '反', tw: '反', sea: 'Rpl', cls: 'rpl' },
  };

  let currentLang = 'kr';

  function detectLang() {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;
      if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
        const l = (LanguageRouter.getCurrentLanguage() || 'kr').toLowerCase();
        if (SUPPORTED_LANGS.includes(l)) return l;
      }
      const saved = localStorage.getItem('preferredLanguage');
      if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    } catch (_) { }
    return 'kr';
  }

  function loadRegion() {
    // 1. Check URL param 'server' (Highest priority)
    try {
      const urlServer = new URLSearchParams(window.location.search).get('server');
      if (urlServer && typeof AstrolabeConfig !== 'undefined' && AstrolabeConfig.REGIONS.includes(urlServer)) {
        return urlServer;
      }
    } catch (_) { }

    // 2. Check localStorage
    try {
      const saved = localStorage.getItem('carousel_region');
      if (saved && typeof AstrolabeConfig !== 'undefined' && AstrolabeConfig.REGIONS.includes(saved)) {
        return saved;
      }
    } catch (_) { }

    // 3. Default based on Language
    // kr->kr, jp->jp, others->en
    const lang = detectLang();
    if (lang === 'kr') return 'kr';
    if (lang === 'jp') return 'jp';
    return 'en';
  }

  function t(key) {
    const entry = translations[key];
    if (!entry) return key;
    return entry[currentLang] || entry['en'] || key;
  }

  function getAdaptLabel(type) {
    const label = adaptLabels[type];
    if (!label) return { text: type, cls: '' };
    return {
      text: label[currentLang] || label['en'] || type,
      cls: label.cls || ''
    };
  }

  function init() {
    currentLang = detectLang();
  }

  function setLang(lang) {
    if (SUPPORTED_LANGS.includes(lang)) {
      currentLang = lang;
    }
  }

  function getLang() {
    return currentLang;
  }

  // Format countdown
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
    detectLang,
    loadRegion,
    t,
    getAdaptLabel,
    setLang,
    getLang,
    formatCountdown,
    SUPPORTED_LANGS
  };
})();
