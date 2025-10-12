// Home Carousel - gacha-based dynamic banner
// Responsibilities:
// - Fetch data/external/gacha/{region}.json (auto-updating every 6h externally)
// - Build slides from data.data.thief, merge same-name banners (types multiline)
// - Show big name, fiveStar names, start/end time (formatted by selected UTC), live countdown
// - Up to 3 fiveStar character images layered (2nd front-center, 1st/3rd slightly behind)
// - Region dropdown (cn, en, jp, kr, tw, sea) and UTC dropdown (-12:00 ~ +14:00, 30-min steps)
// - Default region from localStorage or 'kr'; default UTC from browser timezone; region base offset: cn/tw/sea +8, others +9
// - Character image mapping via characterData reverse index; fallback placeholder if not found

(function () {
  const ROOT_ID = 'home-carousel-root';
  const REGIONS = ['cn', 'tw', 'sea', 'kr', 'en', 'jp'];
  const REGION_BASE_UTC = { cn: 8, tw: 8, sea: 8, kr: 9, en: 9, jp: 9 };
  const SLIDE_INTERVAL_MS = 6000;
  const COUNTDOWN_INTERVAL_MS = 1000;

  const BASE = (typeof window !== 'undefined' && (window.BASE_URL || window.SITE_BASEURL)) || '';
  const APP_VER = (typeof window !== 'undefined' && (window.APP_VERSION || '')) || '';

  // State
  let state = {
    region: loadRegion(),
    utcOffsetMin: loadUtcOffsetMinutes(),
    slides: [],
    currentIndex: 0,
    hover: false,
    countdownTimer: null,
    slideTimeout: null,
  };

  // Utilities
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function buildUtcOptions() {
    const opts = [];
    for (let half = -24; half <= 28; half++) { // -12.0 to +14.0 by 0.5
      const hours = Math.floor(half / 2);
      const mins = (half % 2 === 0) ? 0 : 30;
      const sign = hours < 0 || (hours === 0 && half < 0) ? '-' : '+';
      const absH = Math.abs(hours);
      const label = `UTC${sign}${absH}${mins ? ':' + pad2(mins) : ''}`;
      const value = hours * 60 + (sign === '+' ? mins : -mins);
      opts.push({ label, value });
    }
    return opts;
  }

  function mapLangToRegion(lang) {
    if (!lang) return null;
    const l = String(lang).toLowerCase();
    return REGIONS.includes(l) ? l : null;
  }

  function loadRegion() {
    // 1) Saved selection (highest priority)
    try {
      const saved = localStorage.getItem('carousel_region');
      if (saved && REGIONS.includes(saved)) return saved;
    } catch (_) {}

    // 2) Language-based mapping (URL lang -> LanguageRouter -> preferredLanguage)
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      const candidates = [];
      if (urlLang) candidates.push(urlLang);
      if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
        candidates.push((LanguageRouter.getCurrentLanguage() || '').toLowerCase());
      }
      try {
        const pref = localStorage.getItem('preferredLanguage');
        if (pref) candidates.push(pref);
      } catch (_) {}

      for (const cand of candidates) {
        const reg = mapLangToRegion(cand);
        if (reg) {
          try { localStorage.setItem('carousel_region', reg); } catch (_) {}
          return reg;
        }
      }
    } catch (_) {}

    // 3) Fallback
    return 'kr';
  }

  function saveRegion(region) {
    try { localStorage.setItem('carousel_region', region); } catch (_) {}
  }

  function loadUtcOffsetMinutes() {
    try {
      const saved = localStorage.getItem('carousel_utc_offset_min');
      if (saved != null) return parseInt(saved, 10);
    } catch (_) {}
    // Default to browser timezone
    // getTimezoneOffset: minutes from local time to UTC (e.g., KST -> 540, meaning UTC+9 => -540)
    const tz = new Date().getTimezoneOffset();
    const guess = -tz; // minutes east of UTC
    // Snap to nearest 30 minutes
    return Math.round(guess / 30) * 30;
  }

  function saveUtcOffsetMinutes(mins) {
    try { localStorage.setItem('carousel_utc_offset_min', String(mins)); } catch (_) {}
  }

  function normalizeName(s) {
    if (!s) return '';
    return String(s)
      .toLowerCase()
      .replace(/[\s·・\.\-_'`~!@#$%^&*()\[\]{}|:;"\\/<>?]+/g, '')
      .trim();
  }

  function buildCharacterReverseIndex() {
    const index = new Map();
    let data;
    try { data = (typeof characterData !== 'undefined') ? characterData : (window.characterData || {}); } catch (_) { data = window.characterData || {}; }
    Object.keys(data || {}).forEach(topKey => {
      const item = data[topKey] || {};
      const aliases = [topKey, item.name, item.name_en, item.name_jp];
      aliases.forEach(alias => {
        if (!alias) return;
        index.set(normalizeName(alias), topKey);
      });
    });
    return index;
  }

  const characterIndex = buildCharacterReverseIndex();

  function getCharacterImageUrl(name) {
    const key = characterIndex.get(normalizeName(name));
    if (key) return `${BASE}/assets/img/character-detail/${encodeURIComponent(key)}.webp`;
    // No match: hide by returning null
    return null;
  }

  function getCharacterTopKey(name) {
    const key = characterIndex.get(normalizeName(name));
    return key || null;
  }

  function getDisplayNameByLang(topKey, lang) {
    try {
      const item = (typeof characterData !== 'undefined' ? characterData : window.characterData || {})[topKey];
      if (!item) return topKey;
      if (lang === 'en') return item.name_en || item.name || topKey;
      if (lang === 'jp') return item.name_jp || item.name || topKey;
      // default kr
      return item.name || item.name_en || item.name_jp || topKey;
    } catch (_) {
      return topKey;
    }
  }

  // Time helpers
  function parseRegionLocalToUTC(tsStr, region) {
    // tsStr: 'YYYY-MM-DD HH:mm:ss' with no zone, interpret as region-local at REGION_BASE_UTC
    const base = REGION_BASE_UTC[region] ?? 9;
    // Build a Date as if in UTC of that base offset: create in UTC then subtract base offset to get real UTC
    // Example: '2025-09-29 08:00:00' at UTC+9 => UTC is 23:00 prev day
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})\s+([0-9]{2}):([0-9]{2}):([0-9]{2})$/.exec(tsStr.trim());
    if (!m) return null;
    const y = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, d = parseInt(m[3], 10);
    const hh = parseInt(m[4], 10), mm = parseInt(m[5], 10), ss = parseInt(m[6], 10);
    const millis = Date.UTC(y, mo, d, hh - base, mm, ss); // shift back by base hours to get UTC
    return new Date(millis);
  }

  function formatByUtcOffset(dateUTC, utcOffsetMin) {
    if (!(dateUTC instanceof Date)) return '';
    const t = dateUTC.getTime() + utcOffsetMin * 60 * 1000;
    const d = new Date(t);
    const y = d.getUTCFullYear();
    const mo = pad2(d.getUTCMonth() + 1);
    const da = pad2(d.getUTCDate());
    const hh = pad2(d.getUTCHours());
    const mm = pad2(d.getUTCMinutes());
    const sign = utcOffsetMin < 0 ? '-' : '+';
    const absMin = Math.abs(utcOffsetMin);
    const offH = Math.floor(absMin / 60);
    const offM = absMin % 60;
    const off = `UTC${sign}${offH}${offM ? ':' + pad2(offM) : ''}`;
    return `${y}-${mo}-${da} ${hh}:${mm} ${off}`;
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

  // Data
  async function fetchGacha(region) {
    const url = `${BASE}/data/external/gacha/${region}.json${APP_VER ? `?v=${APP_VER}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load gacha: ${region}`);
    return await res.json();
  }

  async function fetchCustomSlides() {
    try {
      const url = `${BASE}/assets/js/home/custom-slides.json${APP_VER ? `?v=${APP_VER}` : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return [];
      const data = await res.json().catch(() => []);
      return Array.isArray(data) ? data : [];
    } catch (_) {
      return [];
    }
  }

  function pickByLang(obj, baseKey, lang) {
    const v_en = obj[`${baseKey}_en`];
    const v_jp = obj[`${baseKey}_jp`];
    const v_kr = obj[baseKey];
    if (lang === 'en') return v_en || v_kr || v_jp || '';
    if (lang === 'jp') return v_jp || v_kr || v_en || '';
    return v_kr || v_en || v_jp || '';
  }

  function pickLinkByLang(item, lang) {
    const l_en = item.link_en;
    const l_jp = item.link_jp;
    const l_kr = item.link;
    if (lang === 'en') return l_en || l_kr || l_jp || '';
    if (lang === 'jp') return l_jp || l_kr || l_en || '';
    return l_kr || l_en || l_jp || '';
  }

  function isVisibleForLang(item, lang) {
    try {
      if (Array.isArray(item.visible_langs)) {
        const arr = item.visible_langs.map(String).map(s => s.toLowerCase());
        if (arr.length === 0) return false; // 빈 배열이면 어디에도 노출하지 않음
        return arr.includes(lang);
      }
      const show_kr = item.show_kr;
      const show_en = item.show_en;
      const show_jp = item.show_jp;
      if (lang === 'en' && typeof show_en === 'boolean') return show_en;
      if (lang === 'jp' && typeof show_jp === 'boolean') return show_jp;
      if (lang === 'kr' && typeof show_kr === 'boolean') return show_kr;
    } catch(_) {}
    return true; // default visible
  }

  function toAbsUrl(path) {
    if (!path) return '';
    const p = String(path);
    if (/^https?:\/\//i.test(p)) return p;
    if (p.startsWith('/')) return `${BASE}${p}`;
    return `${BASE}/${p}`;
  }

  function isVisibleForRegion(item, region) {
    try {
      if (Array.isArray(item.regions)) {
        if (item.regions.length === 0) return false;
        return item.regions.map(String).map(s => s.toLowerCase()).includes(String(region).toLowerCase());
      }
      if (typeof item.region === 'string' && item.region.trim()) {
        return String(item.region).toLowerCase() === String(region).toLowerCase();
      }
    } catch(_) {}
    return true;
  }

  function mapCustomSlides(rawList, currentRegion) {
    const lang = detectLang();
    return (rawList || [])
      .filter(item => isVisibleForLang(item, lang) && isVisibleForRegion(item, currentRegion))
      .map(item => {
        const title = pickByLang(item, 'title', lang);
        // support common misspelling 'subtilte'
        const subtitle1 = pickByLang(item, 'subtitle', lang);
        const subtitle2 = pickByLang(item, 'subtilte', lang);
        const subtitle = subtitle1 || subtitle2;
        const body = pickByLang(item, 'body', lang);
        const color = item.color || null;
        const image = item.image ? toAbsUrl(item.image) : null;
        const bgImage = item.background_image ? toAbsUrl(item.background_image) : null;
        const link = pickLinkByLang(item, lang) ? toAbsUrl(pickLinkByLang(item, lang)) : '';
        const order = Number.isFinite(item.order) ? Number(item.order) : null;
        return {
          kind: 'custom',
          name: title || '',
          subtitle: subtitle || '',
          body: body || '',
          customColor: color,
          customImage: image,
          customBgImage: bgImage,
          customLink: link,
          order,
        };
      }).filter(x => x.name || x.subtitle || x.body);
  }

  function mergeThiefByName(thiefArr) {
    const map = new Map();
    (thiefArr || []).forEach(entry => {
      const key = entry && entry.name ? entry.name : 'unknown';
      if (!map.has(key)) {
        map.set(key, {
          name: key,
          types: entry.type ? [entry.type] : [],
          startTime: entry.startTime || null,
          endTime: entry.endTime || null,
          fiveStar: Array.isArray(entry.fiveStar) ? [...entry.fiveStar] : [],
        });
      } else {
        const acc = map.get(key);
        if (entry.type && !acc.types.includes(entry.type)) acc.types.push(entry.type);
        // Normalize time window: union range
        const s1 = acc.startTime, s2 = entry.startTime;
        const e1 = acc.endTime, e2 = entry.endTime;
        if (s1 && s2) acc.startTime = s1 < s2 ? s1 : s2; else acc.startTime = s1 || s2;
        if (e1 && e2) acc.endTime = e1 > e2 ? e1 : e2; else acc.endTime = e1 || e2;
        // Merge fiveStar by name uniqueness
        const exist = new Set((acc.fiveStar || []).map(x => x && x.name));
        (entry.fiveStar || []).forEach(x => { if (x && !exist.has(x.name)) acc.fiveStar.push(x); });
      }
    });
    return Array.from(map.values());
  }

  // Consolidate entries where fiveStar sets are identical and names share same prefix before '·'
  function consolidateThiefByPrefixAndFiveStar(thiefArr) {
    const groups = new Map();
    const singles = [];
    (thiefArr || []).forEach((entry, index) => {
      const name = (entry && entry.name) || '';
      const dotIdx = name.indexOf('·');
      if (dotIdx === -1 || !Array.isArray(entry.fiveStar)) {
        singles.push({ index, entry });
        return;
      }
      const prefix = name.slice(0, dotIdx);
      const suffix = name.slice(dotIdx + 1);
      const setKey = (entry.fiveStar || [])
        .map(x => x && x.name)
        .filter(Boolean)
        .sort()
        .join('|');
      const key = prefix + '||' + setKey;
      if (!groups.has(key)) {
        groups.set(key, {
          prefix,
          setKey,
          suffixes: new Set([suffix]),
          startTime: entry.startTime || null,
          endTime: entry.endTime || null,
          fiveStar: entry.fiveStar || [],
          entries: [entry],
          firstIndex: index,
        });
      } else {
        const g = groups.get(key);
        if (suffix) g.suffixes.add(suffix);
        // union time window
        const s1 = g.startTime, s2 = entry.startTime;
        const e1 = g.endTime, e2 = entry.endTime;
        if (s1 && s2) g.startTime = s1 < s2 ? s1 : s2; else g.startTime = s1 || s2;
        if (e1 && e2) g.endTime = e1 > e2 ? e1 : e2; else g.endTime = e1 || e2;
        g.entries.push(entry);
        if (index < g.firstIndex) g.firstIndex = index;
      }
    });

    // Build consolidated entries with original order preserved by earliest index
    const items = [];
    groups.forEach(g => {
      if (g.entries.length <= 1) {
        items.push({ index: g.firstIndex, entry: g.entries[0] });
      } else {
        const suffixList = Array.from(g.suffixes);
        const combinedName = g.prefix + '·' + suffixList.join('/');
        items.push({
          index: g.firstIndex,
          entry: {
            name: combinedName,
            startTime: g.startTime,
            endTime: g.endTime,
            fiveStar: g.fiveStar,
          }
        });
      }
    });
    singles.forEach(s => items.push(s));
    items.sort((a, b) => a.index - b.index);
    return items.map(x => x.entry);
  }

  // Rendering
  function injectStyles(root) {
    if (!root) return;
    if (root.__carouselStylesInjected) return;
    root.__carouselStylesInjected = true;
    const style = document.createElement('style');
    style.textContent = `
      .carousel-container { position: relative; width: 100%; margin: 0px 0 0px 0; overflow: hidden; border-radius: 10px; background: #0e0e0e; }
      .carousel-toolbar { position: relative; display: flex; gap: 8px; padding: 8px 12px; justify-content: flex-end; align-items: center; background: rgb(42,33,33); }
      .carousel-toolbar select { background:rgba(31, 31, 31, 0.5); color: #fff; border: 1px solid #333; border-radius: 6px; padding: 6px 8px; font-size: 11px; }
      .carousel-viewport { position: relative; width: 100%; height: 300px; }
      @media (min-width: 1200px) { .carousel-viewport { height: 280px; } }
      .carousel-track { position: absolute; top: 0; left: 0; height: 100%; width: 100%; display: flex; transition: transform 450ms ease; }
      .carousel-slide { position: relative; min-width: 100%; height: 100%; display: flex; align-items: stretch; color: #fff; overflow: hidden; }
      .slide-left { flex: 1 1 58%; min-width: 0; padding: 64px; display: flex; flex-direction: column; gap: 10px; z-index: 2; justify-content: center; }
      .slide-name { font-size: 1.4rem; font-weight: 800; text-shadow: 0 2px 6px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.8); }
      @media (min-width: 768px) { .slide-name { font-size: 2rem; } }
      .slide-types { line-height: 1.2; opacity: 0.85; white-space: pre-line; }
      .slide-fivestar { font-size: 0.95rem; opacity: 0.95; }
      .slide-subtitle { font-size: 1.0rem; font-weight: 600; opacity: 0.95; }
      .slide-body { font-size: 0.9rem; opacity: 0.9; }
      .slide-time { font-size: 0.9rem; opacity: 0.6; }
      .slide-countdown { font-size: 1rem; font-weight: 700; color: #ffd166; }
      .slide-right { position: relative; flex: 0 0 42%; min-width: 220px; max-width: 520px; display: block; z-index: 1; justify-content: center;}
      @media (max-width: 768px) { .slide-right { flex-basis: 42%; min-width: 160px; } .slide-left { padding: 16px; } .slide-fivestar { font-size: 0.8rem; } .slide-time { font-size: 0.75rem; } .slide-countdown { font-size: 0.8rem; } .slide-name { font-size: 1.4rem !important; } }
      .char-img { position: absolute; top: 50%; right: 4%; height: auto; width: auto; max-height: 100%; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.6)); transform: translateY(-50%); transition: transform 300ms ease, opacity 300ms ease; }
      .char-img.back { opacity: 0.85; transform: translateY(-50%) scale(1.02); z-index: 1; }
      .char-img.front { z-index: 3; transform: translateY(-50%) scale(1.16); }
      .char-img.middle { z-index: 2; transform: translateX(-8%) translateY(-50%) scale(1.08) }
      .carousel-nav { position: absolute; top: 50%; transform: translateY(-50%); width: calc(100% - 16px); display: flex; justify-content: space-between; padding: 0 8px; pointer-events: none; }
      .carousel-btn { pointer-events: auto; background: rgba(0,0,0,0.35); color: #fff; border: 1px solid #444; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
      .carousel-dots { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; gap: 6px; justify-content: center; z-index: 2; }
      .carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: #666; cursor: pointer; }
      .carousel-dot.active { background: #fff; }
      .slide-bg { position: absolute; inset: 0; background: radial-gradient(120% 120% at 80% 100%, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 60%, rgba(0,0,0,0) 100%); }
      .slide-link { position: absolute; inset: 0; z-index: 6; text-decoration: none; pointer-events: auto; }
      .slide-left, .slide-right { position: relative; z-index: 2; }
      @media (max-width: 768px) {
        .carousel-viewport { height: 250px; }
        .char-img { height: auto; width: auto; max-height: 100%; }
        .char-img.front { transform: translateY(-60%) scale(2); }
        .char-img.middle { transform: translateX(-8%) translateY(-50%) scale(1.12) }
        .char-img.back { transform: translateY(-55%) scale(1.8); }
        .carousel-nav { display: none !important; }
        /* Ensure text above images on mobile */
        .slide-left { z-index: 2; }
        .slide-right { z-index: 2; height: 200px; width: 100%; }
        /* Shift images slightly more to the right to reveal text */
        .char-img { right: -6%; }
        /* Stack layout */
        .carousel-slide { flex-direction: column; }
        .slide-left { order: 1; padding: 16px; }
        .slide-right { order: 2; }
        .slide-time { display: none; }
        

      }
    `;
    document.head.appendChild(style);
  }

  function buildToolbar(region, utcOffsetMin) {
    const wrap = document.createElement('div');
    wrap.className = 'carousel-toolbar';

    // Region select
    const regionSelect = document.createElement('select');
    REGIONS.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r; opt.textContent = r.toUpperCase();
      if (r === region) opt.selected = true;
      regionSelect.appendChild(opt);
    });

    // UTC select
    const utcSelect = document.createElement('select');
    const utcOptions = buildUtcOptions();
    utcOptions.forEach(o => {
      const opt = document.createElement('option');
      opt.value = String(o.value);
      opt.textContent = o.label;
      if (o.value === utcOffsetMin) opt.selected = true;
      utcSelect.appendChild(opt);
    });

    wrap.appendChild(regionSelect);
    wrap.appendChild(utcSelect);

    regionSelect.addEventListener('change', async () => {
      const newRegion = regionSelect.value;
      state.region = newRegion;
      saveRegion(newRegion);
      await reloadSlides();
    });

    utcSelect.addEventListener('change', () => {
      const val = parseInt(utcSelect.value, 10);
      state.utcOffsetMin = val;
      saveUtcOffsetMinutes(val);
      refreshTimeDisplays();
    });

    return wrap;
  }

  function parseHexColor(hex) {
    if (!hex) return null;
    const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgba(c, a) { return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`; }

  function getSlideBaseColor(slide) {
    if (slide && slide.kind === 'custom' && slide.customColor) {
      return parseHexColor(slide.customColor);
    }
    const first = (slide.fiveStar || [])[0];
    if (!first) return null;
    const key = characterIndex.get(normalizeName(first.name));
    if (!key) return null;
    try {
      const item = (typeof characterData !== 'undefined' ? characterData : window.characterData || {})[key];
      if (item && item.color) return parseHexColor(item.color);
    } catch(_) {}
    return null;
  }

  function buildSlideElement(slide, index) {
    const el = document.createElement('div');
    el.className = 'carousel-slide';

    const bg = document.createElement('div');
    bg.className = 'slide-bg';
    // custom background image takes precedence
    if (slide.kind === 'custom' && slide.customBgImage) {
      bg.style.background = `url(${slide.customBgImage}) center/cover no-repeat`;
    } else {
      // color-based gradient if available
      const baseColor = getSlideBaseColor(slide);
      if (baseColor) {
        const cStrong = rgba(baseColor, 0.6);
        const cSoft = rgba(baseColor, 0.18);
        bg.style.background = `radial-gradient(120% 120% at 80% 100%, ${cStrong}, ${cSoft} 60%, rgba(0,0,0,0) 100%)`;
      }
    }
    el.appendChild(bg);

    const left = document.createElement('div');
    left.className = 'slide-left';

    const name = document.createElement('div');
    name.className = 'slide-name';
    name.textContent = slide.name || '';

    const types = document.createElement('div');
    types.className = 'slide-types';
    // if (slide.types && slide.types.length) {
    //   types.textContent = slide.types.join('\n');
    // }

    const fivestarText = document.createElement('div');
    fivestarText.className = 'slide-fivestar';
    if (slide.kind === 'custom') {
      if (slide.subtitle) {
        const sub = document.createElement('div');
        sub.className = 'slide-subtitle';
        sub.textContent = slide.subtitle;
        fivestarText.appendChild(sub);
      }
    } else if (slide.fiveStar && slide.fiveStar.length) {
      const rawNames = slide.fiveStar.map(x => x.name);
      const uiLang = detectLang();
      const translated = rawNames.map(n => {
        const key = getCharacterTopKey(n);
        return key ? getDisplayNameByLang(key, uiLang) : n;
      });
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 520px)').matches;
      if (isMobile && translated.length > 8) {
        fivestarText.textContent = translated.slice(0, 5).join(' · ') + ' · ...';
      } else {
        fivestarText.textContent = translated.join(' · ');
      }
    }

    let time, countdown, bodyLine;
    if (slide.kind === 'custom') {
      if (slide.body) {
        bodyLine = document.createElement('div');
        bodyLine.className = 'slide-body';
        bodyLine.textContent = slide.body;
      }
    } else {
      time = document.createElement('div');
      time.className = 'slide-time';
      time.setAttribute('data-slide-index', String(index));
      countdown = document.createElement('div');
      countdown.className = 'slide-countdown';
      countdown.setAttribute('data-countdown-index', String(index));
    }

    left.appendChild(name);
    // if (types.textContent) left.appendChild(types);
    // Stack title and fiveStar (no inline)
    left.appendChild(name);
    if (fivestarText.textContent) left.appendChild(fivestarText);
    if (bodyLine) left.appendChild(bodyLine);
    if (time) left.appendChild(time);
    if (countdown) left.appendChild(countdown);

    const right = document.createElement('div');
    right.className = 'slide-right';

    // Limit images on mobile to 2
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 520px)').matches;
    if (slide.kind === 'custom') {
      if (slide.customImage) {
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = slide.name || 'banner';
        img.src = slide.customImage;
        img.className = 'char-img front middle';
        img.onerror = function () { this.style.display = 'none'; };
        right.appendChild(img);
      }
    } else {
      const imgs = (slide.fiveStar || []).slice(0, isMobile ? 2 : 3);
      // Desired visual order for 3 images: 2(center),1(left),3(right) => indices [1,0,2]
      const order = (imgs.length === 3) ? [1, 0, 2] : imgs.map((_, i) => i);
      order.forEach((origIdx, posIdx) => {
        const c = imgs[origIdx];
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = c.name || 'character';
        const src = getCharacterImageUrl(c.name);
        if (!src) return; // hide if no image match
        img.src = src;
        img.className = 'char-img';
        if (imgs.length === 1) {
          img.style.right = '6%';
          img.classList.add('front');
        } else if (imgs.length === 2) {
          if (posIdx === 0) { img.classList.add('back'); img.style.right = '20%'; }
          else { img.classList.add('front'); img.style.right = '4%'; }
        } else if (!isMobile && imgs.length === 3) {
          // 3 images: center(front), left(back), right(back)
          if (posIdx === 0) { img.classList.add('front', 'middle'); img.style.right = '6%'; }
          else if (posIdx === 1) { img.classList.add('back'); img.style.right = '26%'; }
          else { img.classList.add('back'); img.style.right = '-6%'; }
        } else {
          // mobile 2 images spacing
          if (posIdx === 0) { img.classList.add('back'); img.style.right = '18%'; }
          else { img.classList.add('front'); img.style.right = '-2%'; }
        }
        img.onerror = function () { this.style.display = 'none'; };
        right.appendChild(img);
      });
    }
    if (!right.children.length) { right.style.display = 'none'; }

    // Adjust font-size based on number of characters
    const charCount = (slide.fiveStar || []).length;
    // Adjust five-star text size instead of title size
    const isMobileNow = window.matchMedia && window.matchMedia('(max-width: 520px)').matches;
    if (charCount <= 1) {
      fivestarText.style.fontSize = isMobileNow ? '1.0rem' : '1.2rem';
      fivestarText.style.fontWeight = '700';
    } else if (charCount === 2) {
      fivestarText.style.fontSize = isMobileNow ? '0.95rem' : '1.1rem';
    } else if (charCount <= 3) {
      fivestarText.style.fontSize = isMobileNow ? '0.9rem' : '1.0rem';
    } else {
      fivestarText.style.fontSize = isMobileNow ? '0.85rem' : '0.85rem';
    }

    // link overlay
    let link = null;
    if (slide.kind === 'custom') {
      if (slide.customLink) {
        link = document.createElement('a');
        link.className = 'slide-link';
        link.href = slide.customLink;
      }
    } else {
      const names = (slide.fiveStar || []).map(x => x.name).filter(Boolean);
      const mappedKeys = names.map(n => getCharacterTopKey(n)).filter(Boolean);
      if (names.length === 1 && mappedKeys.length === 1) {
        link = document.createElement('a');
        link.className = 'slide-link';
        link.href = `${BASE}/character.html?name=${encodeURIComponent(mappedKeys[0])}`;
      } else if (mappedKeys.length >= 1) {
        link = document.createElement('a');
        link.className = 'slide-link';
        link.href = `${BASE}/character/`;
      }
    }

    el.appendChild(left);
    el.appendChild(right);
    if (link) el.appendChild(link);
    return el;
  }

  function buildDots(count) {
    const wrap = document.createElement('div');
    wrap.className = 'carousel-dots';
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === state.currentIndex ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      wrap.appendChild(dot);
    }
    return wrap;
  }

  function enableDrag(track) {
    let isDown = false;
    let startX = 0;
    let deltaX = 0;
    const threshold = 50;
    track.addEventListener('mousedown', (e) => { isDown = true; startX = e.clientX; deltaX = 0; });
    window.addEventListener('mouseup', () => { if (!isDown) return; isDown = false; if (Math.abs(deltaX) > threshold) { if (deltaX > 0) prevSlide(); else nextSlide(); } });
    track.addEventListener('mousemove', (e) => { if (!isDown) return; deltaX = e.clientX - startX; });
    track.addEventListener('touchstart', (e) => { isDown = true; startX = e.touches[0].clientX; deltaX = 0; }, { passive: true });
    track.addEventListener('touchmove', (e) => { if (!isDown) return; deltaX = e.touches[0].clientX - startX; }, { passive: true });
    track.addEventListener('touchend', () => { if (!isDown) return; isDown = false; if (Math.abs(deltaX) > threshold) { if (deltaX > 0) prevSlide(); else nextSlide(); } });
  }

  function render(root) {
    root.innerHTML = '';
    injectStyles(root);
    const container = document.createElement('div');
    container.className = 'carousel-container';

    const viewport = document.createElement('div');
    viewport.className = 'carousel-viewport';

    const track = document.createElement('div');
    track.className = 'carousel-track';

    state.slides.forEach((s, idx) => {
      const slideEl = buildSlideElement(s, idx);
      track.appendChild(slideEl);
    });

    viewport.appendChild(track);

    const nav = document.createElement('div');
    nav.className = 'carousel-nav';
    const prev = document.createElement('button');
    prev.className = 'carousel-btn';
    prev.setAttribute('aria-label', 'Prev');
    prev.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6L9 12L15 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    prev.addEventListener('click', prevSlide);
    const next = document.createElement('button');
    next.className = 'carousel-btn';
    next.setAttribute('aria-label', 'Next');
    next.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L15 12L9 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    next.addEventListener('click', nextSlide);
    nav.appendChild(prev);
    nav.appendChild(next);

    const dots = buildDots(state.slides.length);

    viewport.addEventListener('mouseenter', () => { state.hover = true; });
    viewport.addEventListener('mouseleave', () => { state.hover = false; });

    container.appendChild(viewport);
    container.appendChild(nav);
    // toolbar at bottom
    const toolbar = buildToolbar(state.region, state.utcOffsetMin);
    container.appendChild(toolbar);
    // place dots inside toolbar; left-aligned on mobile, centered on larger screens
    dots.style.position = 'absolute';
    const mobileQuery = window.matchMedia && window.matchMedia('(max-width: 520px)').matches;
    if (mobileQuery) {
      dots.style.top = '50%';
      dots.style.left = '12px';
      dots.style.transform = 'translateY(-50%)';
    } else {
      dots.style.top = '50%';
      dots.style.left = '50%';
      dots.style.transform = 'translate(-50%, -50%)';
    }
    toolbar.style.position = 'relative';
    toolbar.appendChild(dots);
    // Toolbar moved to bottom
    root.appendChild(container);

    // Position to current index
    updateTrackPosition(track);
    refreshTimeDisplays();

    // Timers
    startTimers(track);

    // Drag/swipe
    enableDrag(track);
  }

  function updateTrackPosition(track) {
    const offsetX = -state.currentIndex * 100;
    track.style.transform = `translateX(${offsetX}%)`;
    // Update dots active
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    const dots = root.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === state.currentIndex));
  }

  function goTo(i) {
    state.currentIndex = clamp(i, 0, Math.max(0, state.slides.length - 1));
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    const track = root.querySelector('.carousel-track');
    if (track) updateTrackPosition(track);
  }

  function prevSlide() {
    const i = (state.currentIndex - 1 + state.slides.length) % state.slides.length;
    goTo(i);
    // extend delay to 20s after manual navigation
    scheduleNextSlide(20000);
  }

  function nextSlide() {
    const i = (state.currentIndex + 1) % state.slides.length;
    goTo(i);
    scheduleNextSlide(SLIDE_INTERVAL_MS);
  }

  function scheduleNextSlide(delayMs) {
    if (state.slideTimeout) { clearTimeout(state.slideTimeout); state.slideTimeout = null; }
    state.slideTimeout = setTimeout(() => { if (!state.hover) nextSlide(); }, delayMs);
  }

  function startTimers(track) {
    stopTimers();
    state.countdownTimer = setInterval(refreshTimeDisplays, COUNTDOWN_INTERVAL_MS);
    scheduleNextSlide(SLIDE_INTERVAL_MS);
  }

  function stopTimers() {
    if (state.countdownTimer) { clearInterval(state.countdownTimer); state.countdownTimer = null; }
    if (state.slideTimeout) { clearTimeout(state.slideTimeout); state.slideTimeout = null; }
  }

  function refreshTimeDisplays() {
    const nowUTC = Date.now();
    const utcMin = state.utcOffsetMin;
    const lang = detectLang();
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    state.slides.forEach((s, idx) => {
      const timeEl = root.querySelector(`.slide-time[data-slide-index="${idx}"]`);
      const cdEl = root.querySelector(`.slide-countdown[data-countdown-index="${idx}"]`);
      if (timeEl) {
        const sStr = formatByUtcOffset(s.startUTC, utcMin);
        const eStr = formatByUtcOffset(s.endUTC, utcMin);
        timeEl.textContent = `${sStr} ~ ${eStr}`;
      }
      if (cdEl) {
        const remain = (s.endUTC ? s.endUTC.getTime() : nowUTC) - nowUTC;
        cdEl.textContent = `${remainingLabel(lang)}: ${formatCountdown(remain, lang)}`;
      }
    });
  }

  async function reloadSlides() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.innerHTML = '';
    const loading = document.createElement('div');
    loading.style.cssText = 'padding: 12px 8px; color: #999;';
    loading.textContent = '캐러셀 로딩 중...';
    root.appendChild(loading);

    try {
      const [data, customRaw] = await Promise.all([
        fetchGacha(state.region),
        fetchCustomSlides(),
      ]);
      const thief = (data && data.data && data.data.thief) ? data.data.thief : [];
      const merged = consolidateThiefByPrefixAndFiveStar(
        mergeThiefByName(thief)
      ).filter(x => Array.isArray(x.fiveStar) && x.fiveStar.length > 0);
      // Attach UTC times
      let slides = merged.map(x => {
        const startUTC = parseRegionLocalToUTC(x.startTime, state.region);
        const endUTC = parseRegionLocalToUTC(x.endTime, state.region);
        return {
          ...x,
          startUTC,
          endUTC,
        };
      }).filter(x => x.startUTC && x.endUTC);

      // Merge custom slides by order
      const customSlides = mapCustomSlides(customRaw, state.region);
      const withOrder = customSlides.filter(s => Number.isFinite(s.order));
      const withoutOrder = customSlides.filter(s => !Number.isFinite(s.order));
      withOrder.sort((a, b) => a.order - b.order);
      withOrder.forEach(s => {
        const idx = Math.max(0, Math.min(s.order, slides.length));
        slides.splice(idx, 0, s);
      });
      for (let i = withoutOrder.length - 1; i >= 0; i--) {
        slides.unshift(withoutOrder[i]);
      }

      state.slides = slides;
      state.currentIndex = 0;
      render(root);
    } catch (err) {
      root.innerHTML = '';
      const errEl = document.createElement('div');
      errEl.style.cssText = 'padding: 12px 8px; color: #f88;';
      errEl.textContent = '캐러셀 데이터를 불러오지 못했습니다.';
      root.appendChild(errEl);
      // eslint-disable-next-line no-console
      try { console.error(err); } catch (_) {}
    }
  }

  function init() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    reloadSlides();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


