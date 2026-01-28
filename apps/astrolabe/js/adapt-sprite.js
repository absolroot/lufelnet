// Adapt Sprite Builder (from bosses.js)
const AstrolabeAdaptSprite = (function () {
  const BASE = AstrolabeConfig.BASE;

  // Element sprite offsets (borrowed from cha_detail.js)
  function elementOffsetPx(krName) {
    const map = {
      '물리': 15, '총격': 43, '화염': 75, '빙결': 100, '전격': 124,
      '질풍': 149, '염동': 175, '핵열': 205, '축복': 235, '주원': 263
    };
    return map[krName] || 0;
  }

  const elementNameMap = {
    Phys: '물리', Gun: '총격', Fire: '화염', Ice: '빙결', Electric: '전격',
    Wind: '질풍', Psychokinesis: '염동', Nuclear: '핵열', Bless: '축복', Curse: '주원'
  };

  const ADAPT_LABELS = {
    Weak: { kr: '약', en: 'Wk', jp: '弱', cls: 'weak' },
    Resistant: { kr: '내', en: 'Res', jp: '耐', cls: 'res' },
    Nullify: { kr: '무', en: 'Nul', jp: '無', cls: 'nul' },
    Absorb: { kr: '흡', en: 'Abs', jp: '吸', cls: 'abs' },
    Reflect: { kr: '반', en: 'Rpl', jp: '反', cls: 'rpl' },
  };

  function buildAdaptSprite(adapt) {
    const lang = AstrolabeI18n.getLang();
    const wrap = document.createElement('div');
    wrap.className = 'elements-line';

    const img = document.createElement('img');
    img.className = 'elements-sprite';
    img.alt = 'elements';
    img.src = `${BASE}/assets/img/character-detail/elements.png`;
    wrap.appendChild(img);

    Object.keys(ADAPT_LABELS).forEach(key => {
      // Compatibility with object-click-handler.js logic
      const keyMap = {
        'Weak': '약',
        'Resistant': '내',
        'Nullify': '무',
        'Reflect': '반',
        'Absorb': '흡'
      };

      const krKey = keyMap[key];
      let list = [];

      if (adapt) {
        // Try Korean key first (common in data), then English key
        if (krKey && adapt[krKey]) {
          list = adapt[krKey];
        } else if (adapt[key]) {
          list = adapt[key];
        }
      }

      const labelInfo = ADAPT_LABELS[key];
      const text = (lang === 'en' ? labelInfo.en : (lang === 'jp' ? labelInfo.jp : labelInfo.kr));

      (list || []).forEach(enName => {
        const kr = elementNameMap[enName] || enName;
        const x = elementOffsetPx(kr);
        const mark = document.createElement('span');
        mark.className = `el-mark ${labelInfo.cls}`;
        mark.textContent = text;
        mark.title = `${key}: ${kr}`;
        mark.style.left = `${x}px`;
        if (text.length <= 3) mark.classList.add('short');
        wrap.appendChild(mark);
      });
    });

    return wrap;
  }

  // Check if adapt has any data
  function hasAdaptData(adapt) {
    if (!adapt) return false;
    const keyMap = {
      'Weak': '약',
      'Resistant': '내',
      'Nullify': '무',
      'Reflect': '반',
      'Absorb': '흡'
    };
    return Object.keys(ADAPT_LABELS).some(key => {
      const krKey = keyMap[key];
      // Check English key
      if (Array.isArray(adapt[key]) && adapt[key].length > 0) return true;
      // Check Korean key
      if (krKey && Array.isArray(adapt[krKey]) && adapt[krKey].length > 0) return true;
      return false;
    });
  }

  return {
    buildAdaptSprite,
    hasAdaptData,
    elementNameMap,
    ADAPT_LABELS
  };
})();
