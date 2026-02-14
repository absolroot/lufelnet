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

  const ADAPT_KEYS = ['Weak', 'Resistant', 'Nullify', 'Absorb', 'Reflect'];

  function buildAdaptSprite(adapt) {
    const wrap = document.createElement('div');
    wrap.className = 'elements-line';

    const img = document.createElement('img');
    img.className = 'elements-sprite';
    img.alt = 'elements';
    img.src = `${BASE}/assets/img/character-detail/elements.png`;
    wrap.appendChild(img);

    ADAPT_KEYS.forEach(key => {
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

      const labelInfo = AstrolabeI18n.getAdaptLabel(key);
      const text = labelInfo.text;

      (list || []).forEach(enName => {
        const kr = elementNameMap[enName] || enName;
        const x = elementOffsetPx(kr);
        const mark = document.createElement('span');
        mark.className = `el-mark ${labelInfo.cls || ''}`;
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
    return ADAPT_KEYS.some(key => {
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
    ADAPT_KEYS
  };
})();
