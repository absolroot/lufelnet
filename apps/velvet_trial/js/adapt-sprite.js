const VelvetTrialAdaptSprite = (function () {
  const ADAPT_ORDER = ['Weak', 'Resistant', 'Nullify', 'Absorb', 'Reflect'];
  const ADAPT_META = {
    Weak: {
      cls: 'weak',
      fallback: { kr: '약', en: 'Wk', jp: '弱' },
      krKey: '약점'
    },
    Resistant: {
      cls: 'res',
      fallback: { kr: '내', en: 'Res', jp: '耐' },
      krKey: '내성'
    },
    Nullify: {
      cls: 'nul',
      fallback: { kr: '무', en: 'Nul', jp: '無' },
      krKey: '무효'
    },
    Absorb: {
      cls: 'abs',
      fallback: { kr: '흡', en: 'Abs', jp: '吸' },
      krKey: '흡수'
    },
    Reflect: {
      cls: 'rpl',
      fallback: { kr: '반', en: 'Rpl', jp: '反' },
      krKey: '반사'
    }
  };

  const ELEMENT_X = {
    Phys: 15,
    Gun: 43,
    Fire: 75,
    Ice: 100,
    Electric: 124,
    Wind: 149,
    Psychokinesis: 175,
    Nuclear: 205,
    Bless: 235,
    Curse: 263,
    물리: 15,
    총격: 43,
    화염: 75,
    빙결: 100,
    전격: 124,
    질풍: 149,
    염동: 175,
    핵열: 205,
    축복: 235,
    주원: 263
  };

  function getLang() {
    const lang = VelvetTrialI18n.getLang();
    if (lang === 'en' || lang === 'jp') return lang;
    return 'kr';
  }

  function pickFallbackText(adaptKey) {
    const meta = ADAPT_META[adaptKey];
    if (!meta) return adaptKey;
    const lang = getLang();
    return meta.fallback[lang] || meta.fallback.kr || adaptKey;
  }

  function getLabel(adaptKey) {
    const meta = ADAPT_META[adaptKey];
    const info = VelvetTrialI18n.getAdaptLabel(adaptKey) || {};
    const rawText = String(info.text || '').trim();
    const fallbackText = pickFallbackText(adaptKey);
    const text = !rawText || rawText === adaptKey || rawText.length > 4 ? fallbackText : rawText;
    return {
      text,
      cls: info.cls || (meta ? meta.cls : '')
    };
  }

  function getAdaptList(adapt, adaptKey) {
    if (!adapt || typeof adapt !== 'object') return [];
    const meta = ADAPT_META[adaptKey];
    if (Array.isArray(adapt[adaptKey])) return adapt[adaptKey];
    if (meta?.krKey && Array.isArray(adapt[meta.krKey])) return adapt[meta.krKey];
    return [];
  }

  function hasAdaptData(adapt) {
    return ADAPT_ORDER.some((adaptKey) => getAdaptList(adapt, adaptKey).length > 0);
  }

  function build(adapt) {
    const wrap = document.createElement('div');
    wrap.className = 'elements-line';

    const sprite = document.createElement('img');
    sprite.className = 'elements-sprite';
    sprite.alt = 'elements';
    sprite.src = `${VelvetTrialConfig.BASE}/assets/img/character-detail/elements.png`;
    wrap.appendChild(sprite);

    ADAPT_ORDER.forEach((adaptKey) => {
      const list = getAdaptList(adapt, adaptKey);
      const label = getLabel(adaptKey);
      list.forEach((elementName) => {
        const x = ELEMENT_X[elementName];
        if (!Number.isFinite(x)) return;
        const mark = document.createElement('span');
        mark.className = `el-mark ${label.cls}`.trim();
        mark.textContent = label.text;
        mark.title = `${adaptKey}: ${elementName}`;
        mark.style.left = `${x}px`;
        if (label.text.length <= 3) mark.classList.add('short');
        wrap.appendChild(mark);
      });
    });

    return wrap;
  }

  return {
    build,
    hasAdaptData
  };
})();
