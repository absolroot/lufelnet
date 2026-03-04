const VelvetTrialConfig = (function () {
  const BASE = (typeof window !== 'undefined' && (window.BASE_URL || window.SITE_BASEURL)) || '';
  const APP_VER = (typeof window !== 'undefined' && window.APP_VERSION) || '';

  return {
    BASE,
    APP_VER,
    SUPPORTED_LANGS: ['kr', 'en', 'jp'],

    getDataUrl(lang) {
      return `${BASE}/apps/velvet_trial/data/${lang}.json${APP_VER ? `?v=${APP_VER}` : ''}`;
    },

    getRecommendRoundUrl(chapterSn, levelSn, phaseNo) {
      return `${BASE}/apps/velvet_trial/data/recommendations/chapter-${chapterSn}/round-${levelSn}-${phaseNo}.json${APP_VER ? `?v=${APP_VER}` : ''}`;
    },

    getRecommendBaseUrl() {
      return `${BASE}/apps/velvet_trial/data/recommendations/base.json${APP_VER ? `?v=${APP_VER}` : ''}`;
    },

    getRecommendExclusionsUrl(chapterSn) {
      return `${BASE}/apps/velvet_trial/data/recommendations/exclusions/chapter-${chapterSn}.json${APP_VER ? `?v=${APP_VER}` : ''}`;
    },

    getPartyExamplesUrl(chapterSn) {
      return `${BASE}/apps/velvet_trial/data/party-examples/chapter-${chapterSn}.json${APP_VER ? `?v=${APP_VER}` : ''}`;
    },

    getCharacterInfoUrl() {
      return `${BASE}/data/character_info.js${APP_VER ? `?v=${APP_VER}` : ''}`;
    },

    getChapterImageUrl(filename) {
      return `${BASE}/apps/velvet_trial/img/${filename}`;
    },

    getEnemyImageUrl(filename) {
      return `${BASE}/assets/img/enemy/${filename}`;
    }
  };
})();
