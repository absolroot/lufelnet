const VelvetTrialConfig = (function () {
  const BASE = (typeof window !== 'undefined' && (window.BASE_URL || window.SITE_BASEURL)) || '';
  const APP_VER = (typeof window !== 'undefined' && window.APP_VERSION) || '';
  const hashes = (typeof window !== 'undefined' && window.__VELVET_TRIAL_ASSET_HASHES__) || {};

  function getHashedUrl(path) {
    const hash = hashes[path];
    return BASE + path + (hash ? '?h=' + hash : '');
  }

  return {
    BASE,
    APP_VER,
    SUPPORTED_LANGS: ['kr', 'en', 'jp', 'cn'],

    getDataUrl(lang) {
      return getHashedUrl('/apps/velvet_trial/data/' + lang + '.json');
    },

    getThiefTagsUrl() {
      return getHashedUrl('/apps/velvet_trial/data/recommendations/thief-tags.json');
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
      return getHashedUrl('/data/character_info.js');
    },

    getChapterImageUrl(filename) {
      return `${BASE}/apps/velvet_trial/img/${filename}`;
    },

    getEnemyImageUrl(filename) {
      if (filename.startsWith('/')) return BASE + filename;
      return `${BASE}/assets/img/enemy/${filename}`;
    }
  };
})();
