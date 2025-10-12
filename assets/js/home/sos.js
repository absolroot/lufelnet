// Home SOS Section (season boss) - similar to guildboss
(function () {
  const ROOT_ID = 'home-bosses-root'; // append below bosses in same container
  const REGIONS = ['cn', 'tw', 'sea', 'kr', 'en', 'jp'];
  const REGION_BASE_UTC = { cn: 8, tw: 8, sea: 8, kr: 9, en: 9, jp: 9 };
  const COUNTDOWN_INTERVAL_MS = 1000;

  const BASE = (typeof window !== 'undefined' && (window.BASE_URL || window.SITE_BASEURL)) || '';
  const APP_VER = (typeof window !== 'undefined' && (window.APP_VERSION || '')) || '';

  let sosTimer = null;

  function mapLangToRegion(lang) { const l = (lang||'').toLowerCase(); return REGIONS.includes(l) ? l : null; }
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
  function loadRegion() {
    try { const saved = localStorage.getItem('carousel_region'); if (saved && REGIONS.includes(saved)) return saved; } catch(_) {}
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      const c = [];
      if (urlLang) c.push(urlLang);
      if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) c.push((LanguageRouter.getCurrentLanguage()||'').toLowerCase());
      try { const pref = localStorage.getItem('preferredLanguage'); if (pref) c.push(pref); } catch(_) {}
      for (const cand of c) { const r = mapLangToRegion(cand); if (r) return r; }
    } catch(_) {}
    return 'kr';
  }
  function pad2(n){return n<10?'0'+n:''+n;}
  function parseRegionLocalToUTC(tsStr, region) {
    const base = REGION_BASE_UTC[region] ?? 9;
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})\s+([0-9]{2}):([0-9]{2}):([0-9]{2})$/.exec(tsStr.trim());
    if (!m) return null;
    const y = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, d = parseInt(m[3], 10);
    const hh = parseInt(m[4], 10), mm = parseInt(m[5], 10), ss = parseInt(m[6], 10);
    const millis = Date.UTC(y, mo, d, hh - base, mm, ss);
    return new Date(millis);
  }
  function formatCountdown(ms, lang){
    if (ms<=0) return (lang==='en'?'Ended':(lang==='jp'?'終了':'종료'));
    const s=Math.floor(ms/1000), d=Math.floor(s/86400), h=Math.floor((s%86400)/3600), m=Math.floor((s%3600)/60), sec=s%60;
    if (d>0){ if(lang==='en')return `${d}d ${pad2(h)}:${pad2(m)}:${pad2(sec)}`; if(lang==='jp')return `${d}日 ${pad2(h)}:${pad2(m)}:${pad2(sec)}`; return `${d}일 ${pad2(h)}:${pad2(m)}:${pad2(sec)}`; }
    return `${pad2(h)}:${pad2(m)}:${pad2(sec)}`;
  }
  function remainingLabel(lang){ if(lang==='en')return 'Time left'; if(lang==='jp')return '残り時間'; return '남은 시간'; }

  async function fetchSOS(region) {
    const baseUrl = `${BASE}/data/external/sos/${region}.json${APP_VER ? `?v=${APP_VER}` : ''}`;
    const attempts = [baseUrl, `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}_=${Date.now()}`];
    let lastErr;
    for (const u of attempts) {
      try {
        const res = await fetch(u, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const j = await res.json();
        if (j && j.data) return j;
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('Failed to load sos: ' + region);
  }

  function titleByLang(){ const l=detectLang(); if(l==='en')return 'Boss'; if(l==='jp')return 'ボス'; return '보스'; }
  function seaLabel(){ const l=detectLang(); if(l==='en')return 'Sea of Souls'; if(l==='jp')return '魂の海'; return '마음의 바다'; }

  function renderSOS(container, data, region){
    const lang = detectLang();
    // Reuse existing card if present (unified Boss card)
    let card = container.querySelector('.bosses-card');
    let hadCountdown = !!(card && card.querySelector('#bosses-countdown'));
    if (!card) {
      card = document.createElement('div');
      card.className = 'bosses-card';
    }

    // Header (create only if missing)
    if (!card.querySelector('.bosses-header')) {
      const header = document.createElement('div'); header.className = 'bosses-header';
      const t = document.createElement('div'); t.className='bosses-title'; t.textContent = titleByLang();
      header.appendChild(t); card.appendChild(header);
      hadCountdown = false;
    }

    // section wrapper to add spacing for sos part
    let section = card.querySelector('.sos-section');
    if (!section) {
      section = document.createElement('div');
      section.className = 'sos-section';
      section.style.marginTop = '24px';
      card.appendChild(section);
    }

    // buff as mode
    const buff = data && data.data && data.data.buff; let bn='', bd='';
    if (typeof buff === 'string') { const idx=buff.indexOf(':'); if (idx>=0){ bn=buff.slice(0,idx).trim(); bd=buff.slice(idx+1).trim(); } else { bn='Buff'; bd=buff; } }
    const modeEl=document.createElement('div'); modeEl.className='bosses-mode';
    const bnEl=document.createElement('div'); bnEl.className='bosses-mode-name'; bnEl.textContent=`${seaLabel()} - ${bn}`;
    const localCd=document.createElement('div'); localCd.className='bosses-countdown local'; localCd.id='sos-countdown';
    const bdEl=document.createElement('div'); bdEl.className='bosses-mode-detail'; bdEl.textContent=bd;
    modeEl.appendChild(bnEl); modeEl.appendChild(localCd); modeEl.appendChild(bdEl); section.appendChild(modeEl);

    const list=document.createElement('div'); list.className='bosses-list';
    const bosses = (data && data.data && Array.isArray(data.data.boss)) ? data.data.boss : [];
    if (bosses.length===3) list.classList.add('grid-3'); else if (bosses.length===2) list.classList.add('grid-2');

    bosses.forEach(b=>{
      const enemyArr = b.enemy || [];
      const enemy = Array.isArray(enemyArr) ? enemyArr[0] : enemyArr;
      const name = (enemy && enemy.name) || '';
      const item=document.createElement('div'); item.className='boss-item';
      const row=document.createElement('div'); row.className='boss-row';
      const left=document.createElement('div'); left.className='boss-left';
      const head=document.createElement('div'); head.className='boss-name'; head.textContent=name; left.appendChild(head);

      // reuse adapt sprite if provided
      const adapt = (enemy && enemy.adapt) || {};
      const right=document.createElement('div');
      right.className='boss-elements';
      if (adapt && (adapt.Weak||adapt.Resistant||adapt.Nullify||adapt.Absorb||adapt.Reflect)) {
        try {
          const build = (typeof window.buildAdaptSprite === 'function') ? window.buildAdaptSprite : (function(){
            const elementNameMap = { Phys:'물리', Gun:'총격', Fire:'화염', Ice:'빙결', Electric:'전격', Wind:'질풍', Psychokinesis:'염동', Nuclear:'핵열', Bless:'축복', Curse:'주원' };
            const ADAPT_LABELS = { Weak:{kr:'약',en:'Wk',jp:'弱',cls:'weak'}, Resistant:{kr:'내',en:'Res',jp:'耐',cls:'res'}, Nullify:{kr:'무',en:'Nul',jp:'無',cls:'nul'}, Absorb:{kr:'흡',en:'Abs',jp:'吸',cls:'abs'}, Reflect:{kr:'반',en:'Rpl',jp:'反',cls:'rpl'} };
            function elementOffsetPx(kr){ const map={ '물리':15, '총격':43, '화염':75, '빙결':100, '전격':124, '질풍':149, '염동':175, '핵열':205, '축복':235, '주원':263 }; return map[kr]||0; }
            return function localBuild(ad){ const l=detectLang(); const wrap=document.createElement('div'); wrap.className='elements-line'; const img=document.createElement('img'); img.className='elements-sprite'; img.alt='elements'; img.src=`${BASE}/assets/img/character-detail/elements.png`; wrap.appendChild(img); Object.keys(ADAPT_LABELS).forEach(k=>{ const list=(ad&&ad[k])||[]; const info=ADAPT_LABELS[k]; const text=(l==='en'?info.en:(l==='jp'?info.jp:info.kr)); list.forEach(en=>{ const kr=elementNameMap[en]||en; const x=elementOffsetPx(kr); const mark=document.createElement('span'); mark.className=`el-mark ${info.cls}`; mark.textContent=text; mark.title=`${k}: ${kr}`; mark.style.left=`${x}px`; if (text.length<=3) mark.classList.add('short'); wrap.appendChild(mark); }); }); return wrap; };
          })();
          right.appendChild(build(adapt));
        } catch(_) {}
      }

      row.appendChild(left);
      row.appendChild(right);
      item.appendChild(row);
      list.appendChild(item);
    });

    section.appendChild(list);
    if (!container.querySelector('.bosses-card')) container.appendChild(card);

    // Countdown only if not already running from bosses.js
    const endStr = data && data.data && data.data.endTime; const endUTC=endStr?parseRegionLocalToUTC(endStr, region):null;
    function tick(){
      const l=detectLang();
      const localEl=document.getElementById('sos-countdown');
      if (localEl) {
        if (!endUTC) localEl.textContent = '-'; else localEl.textContent = `${formatCountdown(endUTC.getTime()-Date.now(), l)}`;
      }
    }
    if (sosTimer) { clearInterval(sosTimer); sosTimer=null; }
    tick(); sosTimer=setInterval(tick, COUNTDOWN_INTERVAL_MS);
  }

  async function init(){
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    try { const region=loadRegion(); const data=await fetchSOS(region); renderSOS(root, data, region); } catch(e) { try{console.error(e);}catch(_){} }
  }

  window.reloadHomeSOS = async function(){
    const root=document.getElementById(ROOT_ID); if(!root) return;
    try{
      // cleanup sos section to avoid duplicates
      const card = root.querySelector('.bosses-card');
      const old = card && card.querySelector('.sos-section');
      if (old) old.remove();
      const region=loadRegion(); const data=await fetchSOS(region); renderSOS(root, data, region);
    }catch(e){ try{ console.error(e); }catch(_){} }
  };

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


