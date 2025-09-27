// 갤러리 전용 i18n 매핑 (캐릭터명이 아닌 태그/그룹에 대해 번역)
(function(){
  'use strict';

  const GalleryI18N = {
    tag: {
      // 예시 매핑: 원문 => { en, jp, kr(optional) }
      '메로페': { en: 'Merope', jp: 'メロペ', kr: '메로페' },
      '아란': { en: 'Aran', jp: '平野亞蘭', kr: '아란' },
      '이고르': { en: 'Igor', jp: 'イゴール', kr: '이고르' },
    },
    category: {
      'group': { en: 'Group', jp: 'グループ', kr: '그룹' }
    },
    translateTag(raw, lang){
      if (!raw) return raw;
      const entry = this.tag[raw];
      if (!entry) return raw;
      if (lang === 'en' && entry.en) return entry.en;
      if (lang === 'jp' && entry.jp) return entry.jp;
      if (entry.kr) return entry.kr;
      return raw;
    },
    translateCategory(raw, lang){
      if (!raw) return raw;
      const entry = this.category[raw];
      if (!entry) return raw;
      if (lang === 'en' && entry.en) return entry.en;
      if (lang === 'jp' && entry.jp) return entry.jp;
      if (entry.kr) return entry.kr;
      return raw;
    }
  };

  window.GalleryI18N = GalleryI18N;
})();


