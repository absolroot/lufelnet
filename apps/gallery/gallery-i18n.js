// Gallery i18n helper - 하위 호환성을 위한 래퍼
// 새로운 i18n 시스템을 사용하여 GalleryI18N API 제공
(function () {
  'use strict';

  const GalleryI18N = {
    translateTag(raw, lang) {
      if (!raw) return raw;

      // Use new i18n system if available
      if (typeof window.t === 'function') {
        const translated = window.t(`tags.${raw}`);
        // If translation found, return it; otherwise return original
        return translated !== `tags.${raw}` ? translated : raw;
      }

      // Fallback to original value
      return raw;
    },

    translateCategory(raw, lang) {
      if (!raw) return raw;

      // Use new i18n system if available
      if (typeof window.t === 'function') {
        const translated = window.t(`categories.${raw}`);
        // If translation found, return it; otherwise return original
        return translated !== `categories.${raw}` ? translated : raw;
      }

      // Fallback to original value
      return raw;
    }
  };

  window.GalleryI18N = GalleryI18N;
})();
