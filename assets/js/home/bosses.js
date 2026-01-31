// Home Guild Bosses Section
(function () {
  const ROOT_ID = 'home-bosses-root';
  const REGIONS = ['cn', 'tw', 'sea', 'kr', 'en', 'jp'];
  const REGION_BASE_UTC = { cn: 8, tw: 8, sea: 8, kr: 9, en: 9, jp: 9 };
  const COUNTDOWN_INTERVAL_MS = 1000;

  const BASE = (typeof window !== 'undefined' && (window.BASE_URL || window.SITE_BASEURL)) || '';
  const APP_VER = (typeof window !== 'undefined' && (window.APP_VERSION || '')) || '';

  // timers
  let bossesCountdownTimer = null;

  // affix description -> specific name map
  let affixDescToName = null;
  let affixMapLoaded = null;

  function normalizeDesc(s) {
    try { return String(s || '').replace(/\r\n/g, '\n').trim(); } catch (_) { return ''; }
  }

  async function loadAffixMap() {
    if (affixDescToName) return affixDescToName;
    if (!affixMapLoaded) {
      affixMapLoaded = (async () => {
        try {
          const url = `${BASE}/assets/js/home/affix_name.json${APP_VER ? `?v=${APP_VER}` : ''}`;
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) throw new Error('Failed to load affix_name.json');
          const list = await res.json();
          const map = {};
          (list || []).forEach(it => {
            const desc = normalizeDesc(it && it.description);
            const name = (it && it.name) || '';
            if (desc && name) {
              map[desc] = name;
            }
          });
          affixDescToName = map;
          return affixDescToName;
        } catch (e) {
          try { console.error(e); } catch(_) {}
          affixDescToName = {};
          return affixDescToName;
        }
      })();
    }
    return await affixMapLoaded;
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function mapLangToRegion(lang) {
    if (!lang) return null;
    const l = String(lang).toLowerCase();
    return REGIONS.includes(l) ? l : null;
  }

  function detectLang() {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang && ['kr','en','jp','cn','tw','sea'].includes(urlLang)) return urlLang;
      if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
        const l = (LanguageRouter.getCurrentLanguage() || 'kr').toLowerCase();
        if (['kr','en','jp','cn','tw','sea'].includes(l)) return l;
      }
      const saved = localStorage.getItem('preferredLanguage');
      if (saved && ['kr','en','jp','cn','tw','sea'].includes(saved)) return saved;
    } catch (_) {}
    return 'kr';
  }

  function remainingLabel(lang) {
    if (lang === 'en') return 'Time left';
    if (lang === 'jp') return '残り時間';
    return '남은 시간';
  }

  function loadRegion() {
    try {
      const saved = localStorage.getItem('carousel_region');
      if (saved && REGIONS.includes(saved)) return saved;
    } catch (_) {}
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      const candidates = [];
      if (urlLang) candidates.push(urlLang);
      if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
        candidates.push((LanguageRouter.getCurrentLanguage() || '').toLowerCase());
      }
      try { const pref = localStorage.getItem('preferredLanguage'); if (pref) candidates.push(pref); } catch (_) {}
      for (const cand of candidates) { const reg = mapLangToRegion(cand); if (reg) return reg; }
    } catch (_) {}
    return 'kr';
  }

  function parseRegionLocalToUTC(tsStr, region) {
    const base = REGION_BASE_UTC[region] ?? 9;
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})\s+([0-9]{2}):([0-9]{2}):([0-9]{2})$/.exec(tsStr.trim());
    if (!m) return null;
    const y = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, d = parseInt(m[3], 10);
    const hh = parseInt(m[4], 10), mm = parseInt(m[5], 10), ss = parseInt(m[6], 10);
    const millis = Date.UTC(y, mo, d, hh - base, mm, ss);
    return new Date(millis);
  }

  function formatCountdown(ms, lang) {
    if (ms <= 0) return (lang === 'en' ? 'Ended' : (lang === 'jp' ? '終了' : '종료'));
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (days > 0) {
      if (lang === 'en') return `${days}d ${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}`;
      if (lang === 'jp') return `${days}日 ${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}`;
      return `${days}일 ${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}`;
    }
    return `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}`;
  }

  async function fetchGuildBoss(region) {
    const url = `${BASE}/data/external/guildboss/${region}.json${APP_VER ? `?v=${APP_VER}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load guildboss: ' + region);
    return await res.json();
  }

  // elements sprite offsets (borrowed from cha_detail.js logic)
  function elementOffsetPx(krName) {
    const map = { '물리': 15, '총격': 43, '화염': 75, '빙결': 100, '전격': 124, '질풍': 149, '염동': 175, '핵열': 205, '축복': 235, '주원': 263 };
    return map[krName] || 0;
  }
  const elementNameMap = {
    Phys: '물리', Gun: '총격', Fire: '화염', Ice: '빙결', Electric: '전격',
    Wind: '질풍', Psychokinesis: '염동', Nuclear: '핵열', Bless: '축복', Curse: '주원'
  };
  const ADAPT_LABELS = {
    Weak:   { kr: '약', en: 'Wk',  jp: '弱',  cls: 'weak' },
    Resistant: { kr: '내', en: 'Res', jp: '耐',  cls: 'res' },
    Nullify:   { kr: '무', en: 'Nul', jp: '無',  cls: 'nul' },
    Absorb:    { kr: '흡', en: 'Abs', jp: '吸',  cls: 'abs' },
    Reflect:   { kr: '반', en: 'Rpl', jp: '反',  cls: 'rpl' },
  };

  function buildAdaptSprite(adapt) {
    const lang = detectLang();
    const wrap = document.createElement('div');
    wrap.className = 'elements-line';
    const img = document.createElement('img');
    img.className = 'elements-sprite';
    img.alt = 'elements';
    img.src = `${BASE}/assets/img/character-detail/elements.png`;
    wrap.appendChild(img);

    Object.keys(ADAPT_LABELS).forEach(key => {
      const list = (adapt && adapt[key]) || [];
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
  // expose for sos.js reuse
  window.buildAdaptSprite = buildAdaptSprite;

  function injectStyles() {
    if (document.getElementById('bosses-style')) return;
    const s = document.createElement('style');
    s.id = 'bosses-style';
    s.textContent = `
      #${ROOT_ID} { margin: 24px 0 0px; color: #eee; width: 100%; }
      .bosses-card { background:var(--card-background); border-radius:10px; padding:20px; border-bottom: solid 3px var(--border-red); }
      @media (max-width: 1440px) { .bosses-card {box-sizing: border-box; max-width: 1200px; margin: 0 auto; } }
      .bosses-list { margin-top: 8px; }
      .bosses-list.grid-3 { display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      .bosses-list.grid-2 { display:grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
      @media (max-width: 768px) { .bosses-list.grid-3, .bosses-list.grid-2 { grid-template-columns: 1fr; } }
      .bosses-header { display:flex; gap:8px; align-items:baseline; margin-bottom:0px; grid-column: 1 / -1; }
      .bosses-title { font-weight:700; font-size: 18px; color: white; }
      .bosses-countdown { font-weight:700; color:#ff4444; margin-left:auto; }
      .bosses-countdown.local { margin-left: 0; }
      .bosses-mode { margin:6px 0 12px; opacity:.95; display:grid; grid-template-columns: 1fr; grid-auto-rows: auto; grid-row-gap: 2px; align-items: center; justify-items: start; }
      .bosses-mode-name { font-weight:700; grid-column: 1; }
      .bosses-countdown.local { grid-column: 1; justify-self: end; }
      .bosses-mode-detail { font-size:.9rem; opacity:.75; margin-top:10px; grid-column: 1 / -1; }
      .boss-image { width: 3rem; height: 3rem; object-fit: contain; margin-bottom:0px; }
      .boss-item { padding:12px; background:rgba(255, 255, 255, 0.05); border:1px solid #2a2a2a; border-radius:8px; }
      .boss-row { display:flex; flex-direction:column; gap:8px; }
      .boss-left { display:flex; align-items:center; flex-direction:column;}
      @media (min-width:1200px) { .boss-row { display:grid; grid-template-columns: 1fr; align-items:center; } .boss-left { gap:10px;} .boss-affix-list { margin:0; } .bosses-mode { grid-template-columns: minmax(0,1fr) auto; grid-row-gap: 0; } .bosses-countdown.local { grid-column: 2; align-self: center; } }
      @media (max-width: 1199px) { .bosses-countdown.local { justify-self: start !important; text-align: left !important; font-size: 0.8rem; } }
      .boss-name { font-weight:700; margin-bottom:0px; font-size: 15px;}
      .boss-name .boss-lv { opacity:.65; font-weight:600; }
      .boss-affix { font-size:.92rem; opacity:.95; margin-bottom:0px; }
      .boss-affix-list { display:flex; gap:2px; flex-wrap:wrap; margin: 2px 0 0px; }
      .affix-chip { display:inline-flex; align-items:center; padding:2px 6px; border:1px solid #333; border-radius:6px; background: rgba(0, 0, 0, 0.5); font-size:.65rem; }
      .boss-elements { margin-top:0px; display:flex; justify-content:center; }
      .elements-line { position: relative; display:inline-block; height: 40px; }
      .elements-line img.elements-sprite { height: 32px; display:block; }
      .el-mark { position:absolute; top: 24px; transform: translateX(-50%) skew(0deg); font-style: italic; font-weight:900; font-size:14px; color:#bbb; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 2px #000; }
      .el-mark.short { font-size:12px; }
      .el-mark.weak { color:#fff; }
      @media (max-width: 768px) { .bosses-mode-detail {font-size: .75rem;} .boss-name, .bosses-mode-name {font-size: 14px;} .affix-chip {font-size: 0.75rem;} .boss-affix-list{margin-top: 8px;}}
    `;
    document.head.appendChild(s);
  }

  function bossesTitle() {
    const lang = detectLang();
    if (lang === 'en') return 'Boss';
    if (lang === 'jp') return 'ボス';
    return '보스';
  }

  function nightmareLabel() {
    const lang = detectLang();
    if (lang === 'en') return 'Nightmare\'s Gateway';
    if (lang === 'jp') return '閼兇夢の扉';
    return '흉몽의 문';
  }

  function renderGuildBoss(root, data, region, affixMap) {
    injectStyles();
    const lang = detectLang();
    let card = root.querySelector('.bosses-card');
    if (!card) {
      card = document.createElement('div');
      card.className = 'bosses-card';
      root.innerHTML = '';
      root.appendChild(card);
    } else {
      const oldGb = card.querySelector('.guildboss-section');
      if (oldGb) oldGb.remove();
    }

    if (!card.querySelector('.bosses-header')) {
      const header = document.createElement('div');
      header.className = 'bosses-header';
      const title = document.createElement('div');
      title.className = 'bosses-title';
      title.textContent = bossesTitle();
      header.appendChild(title);
      card.appendChild(header);
    }

    // mode
    const gbSection = document.createElement('div');
    gbSection.className = 'guildboss-section';
    gbSection.style.marginTop = '24px';
    const mode = (data && data.data && data.data.mode) || {};
    const modeEl = document.createElement('div');
    modeEl.className = 'bosses-mode';
    const modeNameEl = document.createElement('div');
    modeNameEl.className = 'bosses-mode-name';
    modeNameEl.textContent = `${nightmareLabel()} - ${mode.name || ''}`.trim();
    const modeDetailEl = document.createElement('div');
    modeDetailEl.className = 'bosses-mode-detail';
    modeDetailEl.textContent = mode.detail || '';
    modeEl.appendChild(modeNameEl);
    // add per-source countdown for guildboss
    const gbCd = document.createElement('div');
    gbCd.className = 'bosses-countdown local';
    gbCd.id = 'gb-countdown';
    modeEl.appendChild(gbCd);
    modeEl.appendChild(modeDetailEl);
    gbSection.appendChild(modeEl);

    const bosses = (data && data.data && Array.isArray(data.data.boss)) ? data.data.boss : [];
    const list = document.createElement('div');
    list.className = 'bosses-list';
    // layout flag on list only (keep header/mode full-width)
    if (bosses.length === 3) list.classList.add('grid-3');
    else if (bosses.length === 2) list.classList.add('grid-2');
    bosses.forEach(b => {
      const enemy = b.enemy || {};
      const enemyObj = Array.isArray(enemy) ? enemy[0] : enemy;
      const name = (enemyObj && enemyObj.name) || '';
      const imageUrl = (enemyObj && enemyObj.image) || '';
      const level = '';
      const item = document.createElement('div');
      item.className = 'boss-item';

      const row = document.createElement('div');
      row.className = 'boss-row';

      const left = document.createElement('div');
      left.className = 'boss-left';
      const head = document.createElement('div');
      head.className = 'boss-name';
      const image = document.createElement('img');
      image.className = 'boss-image';
      image.src = `${BASE}/assets/img/enemy/${imageUrl}`; image.alt = name; image.onerror = function () { this.style.display = 'none'; };
      head.textContent = name;
      left.appendChild(image);
      left.appendChild(head);

      const affixList = document.createElement('div');
      affixList.className = 'boss-affix-list';
      (b.affixs || []).forEach(a => {
        if (!a || !a.name) return;
        const chip = document.createElement('span');
        chip.className = 'affix-chip';
        let displayName = a.name;
        if (displayName === 'Special Effect') {
          const key = normalizeDesc(a.detail || a.description || '');
          const map = affixMap || affixDescToName || {};
          if (key && map[key]) displayName = map[key];
        }
        chip.textContent = displayName;
        if (a.detail) chip.setAttribute('data-tooltip', a.detail);
        affixList.appendChild(chip);
      });
      left.appendChild(affixList);

      // elements sprite + labels overlay
      const adapt = (enemyObj && enemyObj.adapt) || {};
      const elementsWrap = document.createElement('div');
      elementsWrap.className = 'boss-elements';
      elementsWrap.appendChild(buildAdaptSprite(adapt));
      const right = document.createElement('div');
      right.appendChild(elementsWrap);

      row.appendChild(left);
      row.appendChild(right);
      item.appendChild(row);
      // bind tooltips after chips are in DOM
      try {
        if (typeof bindTooltipElement === 'function') {
          item.querySelectorAll('.affix-chip').forEach(chip => {
            // remove previous guard to force bind
            try { chip.dataset.tooltipBound = ''; } catch (_) {}
            bindTooltipElement(chip);
          });
        }
      } catch (_) {}

      list.appendChild(item);
    });
    gbSection.appendChild(list);
    const sosSec = card.querySelector('.sos-section');
    if (sosSec && sosSec.parentElement === card) {
      sosSec.after(gbSection);
    } else {
      card.appendChild(gbSection);
    }

    // countdown timer
    const endStr = data && data.data && data.data.endTime;
    const endUTC = endStr ? parseRegionLocalToUTC(endStr, region) : null;
    function updateCountdown() {
      const langNow = detectLang();
      const remain = endUTC ? (endUTC.getTime() - Date.now()) : null;
      const headerEl = document.getElementById('bosses-countdown');
      if (headerEl) {
        headerEl.textContent = remain == null ? `${remainingLabel(langNow)}: -` : `${remainingLabel(langNow)}: ${formatCountdown(remain, langNow)}`;
      }
      const gbEl = document.getElementById('gb-countdown');
      if (gbEl) {
        gbEl.textContent = remain == null ? '-' : `${formatCountdown(remain, langNow)}`;
      }
    }
    // reset previous timer to avoid flicker/duplication
    if (bossesCountdownTimer) { clearInterval(bossesCountdownTimer); bossesCountdownTimer = null; }
    updateCountdown();
    bossesCountdownTimer = setInterval(updateCountdown, COUNTDOWN_INTERVAL_MS);
  }

  async function init() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    try {
      const region = loadRegion();
      const [affixMap, data] = await Promise.all([
        loadAffixMap(),
        fetchGuildBoss(region)
      ]);
      renderGuildBoss(root, data, region, affixMap);
    } catch (e) {
      // eslint-disable-next-line no-console
      try { console.error(e); } catch(_) {}
    }
  }

  // expose reloader for carousel-region sync
  window.reloadHomeBosses = async function () {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    try {
      const region = loadRegion();
      const [affixMap, data] = await Promise.all([
        loadAffixMap(),
        fetchGuildBoss(region)
      ]);
      renderGuildBoss(root, data, region, affixMap);
    } catch (e) { try { console.error(e); } catch(_) {} }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


