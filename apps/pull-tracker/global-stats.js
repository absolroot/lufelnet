// global-stats.js
(function(){
  const qs = (sel)=>document.querySelector(sel);
  const lang = (new URLSearchParams(location.search).get('lang')||'kr').toLowerCase();

  const LABELS = {
    kr: { title: '전체 통계', avg: '평균', count: '5★ 합계', loseRate: '50:50 패배율', pullsByDay: '5★ 일별 횟수', charAvg:'캐릭터 5★ 평균', charLimitedAvg:'캐릭터 한정 5★ 평균', charCnt:'캐릭터 5★ 획득 수', weapAvg:'무기 5★ 평균', weapLimitedAvg:'무기 한정 5★ 평균', weapCnt:'무기 5★ 획득 수' },
    en: { title: 'Global Stats', avg: 'Avg', count: '5★ Count', loseRate: 'Lose 50:50 %', pullsByDay: '5★ Pulls By Day', charAvg:'Character 5★ Avg', charLimitedAvg:'Char Limited 5★ Avg', charCnt:'Character 5★ Count', weapAvg:'Weapon 5★ Avg', weapLimitedAvg:'Weapon Limited 5★ Avg', weapCnt:'Weapon 5★ Count' },
    jp: { title: '全体統計', avg: '平均', count: '5★ 合計', loseRate: '50:50 敗北率', pullsByDay: '5★ 日別回数', charAvg:'キャラ 5★ 平均', charLimitedAvg:'キャラ限定 5★ 平均', charCnt:'キャラ 5★ 獲得数', weapAvg:'武器 5★ 平均', weapLimitedAvg:'武器限定 5★ 平均', weapCnt:'武器 5★ 獲得数' }
  }[lang] || { title:'전체 통계', avg:'평균', count:'5★ 합계', loseRate:'50:50 패배율', pullsByDay:'5★ 일별 횟수', charAvg:'캐릭터 5★ 평균', charLimitedAvg:'캐릭터 한정 5★ 평균', charCnt:'캐릭터 5★ 획득 수', weapAvg:'무기 5★ 평균', weapLimitedAvg:'무기 한정 5★ 평균', weapCnt:'무기 5★ 획득 수' };

  // i18n phrases
  const I18N = {
    en: { unitTimes: 'pulls', unitCount: '', obtained: 'obtained', pickupSuccess: 'Limit' },
    jp: { unitTimes: '回', unitCount: '回', obtained: '獲得', pickupSuccess: '成功' },
    kr: { unitTimes: '회', unitCount: '번', obtained: '획득', pickupSuccess: '픽업 성공' }
  };

  const NAME = {
    kr: { Confirmed:'확정', Fortune:'운명', Gold:'일반', Weapon:'무기', Newcomer:'신규' },
    en: { Confirmed:'Confirmed', Fortune:'Fortune', Gold:'Gold', Weapon:'Weapon', Newcomer:'Newcomer' },
    jp: { Confirmed:'確定', Fortune:'フォーチュン', Gold:'通常', Weapon:'武器', Newcomer:'ニューカマー' }
  }[lang] || { Confirmed:'확정', Fortune:'운명', Gold:'일반', Weapon:'무기', Newcomer:'신규' };

  const ICONS = { Confirmed:'정해진 운명.png', Fortune:'정해진 운명.png', Gold:'미래의 운명.png', Weapon:'정해진 코인.png', Newcomer:'미래의 운명.png' };

  const regionEl = qs('#globalRegion');
  const titleEl = qs('#globalStatsTitle');
  const cardsWrap = qs('#globalCards');
  const infoWrap = qs('#globalInfoCards');
  const chartCanvas = qs('#globalDailyChart');
  const threeListsWrap = qs('#gsCards');
  const tabsWrap = qs('#gsTabs');

  if (titleEl) titleEl.textContent = LABELS.title;
  if (regionEl) {
    const def = lang==='en'? 'EN' : lang==='jp'? 'JP' : 'KR';
    regionEl.value = def;
    regionEl.addEventListener('change', ()=>{ refreshAll(); refreshPity(); });
  }
  try {
    const note = document.getElementById('globalStatsNote');
    if (note) {
      const texts = {
        kr: '※ P5X서버 기록은 50% 반천장(Win) 정보를 제공하지 않아, 현재는 한정 캐릭터를 성공으로 계산하고 있습니다. 따라서 마유미, 루우나 등은 성공 기준에 포함되지 않아 수치가 높게/낮게 보일 수 있습니다.',
        en: '※ P5X server do not provide 50:50 Win data. Currently treat [Limited] characters as wins. Therefore, like PHOEBE or MARIAN are not included as wins, which may make the success avg appear higher/lower.',
        jp: '※ P5Xサーバーの記録は50:50勝利の情報を提供していません。現在は限定キャラを勝利として計算しています。そのため、PHOEBEやMARIANなどは勝利基準に含まれず、数値が高く/低く見える場合があります。'
      };
      note.textContent = texts[lang] || texts.kr;
    }
  } catch(_) {}

  function numberFmt(n, frac=0){ try { return new Intl.NumberFormat(undefined, { maximumFractionDigits: frac, minimumFractionDigits: frac }).format(n); } catch(_) { return String(n); } }
  function baseUrl(){ try { return window.BASE_URL || ''; } catch(_) { return ''; } }

  // --- Character/Weapon helpers (reused from pull-tracker.js logic) ---
  function getCharData(){ try { return (typeof characterData !== 'undefined') ? characterData : (window.characterData||null); } catch(_) { return null; } }
  function getWeaponData(){ try { return (typeof WeaponData !== 'undefined') ? WeaponData : (window.WeaponData||null); } catch(_) { return null; } }
  function charNameByLang(info){ if(!info) return ''; if(lang==='en') return String(info.codename||info.name_en||info.name||'').trim(); if(lang==='jp') return String(info.name_jp||info.name||'').trim(); return String(info.name||'').trim(); }
  function candidateNames(info){
    if (!info) return [];
    const base=[info.name,info.name_en,info.name_jp,info.codename].map(v=>v?String(v).trim():'').filter(Boolean);
    if (lang==='jp'){
      const extra=[]; for (const s of base){ try{ const no=String(s).replace(/[\s\u3000]+/g,''); if(no && no!==s) extra.push(no);}catch(_){} }
      return Array.from(new Set(base.concat(extra)));
    }
    return Array.from(new Set(base));
  }
  const NAME_FIXUPS = { 'Yui':'YUI', 'ＹＵＩ':'YUI', 'Kotone Montagne':'Montagne Kotone' };
  function applyNameFixups(raw){ try { const k=String(raw||'').trim(); return NAME_FIXUPS[k] || k; } catch(_) { return raw; } }
  function resolveCharacterClass(displayName){
    try {
      const g=getCharData(); if(!g) return null;
      let wanted=String(applyNameFixups(displayName)).trim();
      const wantedNorm = (lang==='jp') ? wanted.replace(/[\s\u3000]+/g,'') : wanted;
      const baseOf=(s)=> String(s).split('·')[0].trim();
      const hasVar=(s)=> String(s).includes('·');
      const wantedBase=baseOf(wanted);
      const wantedHasVar=hasVar(wanted);
      for (const [cls,info] of Object.entries(g)){
        const cands=candidateNames(info);
        if (cands.some(nm=> nm===wanted || (lang==='jp' && nm.replace(/[\s\u3000]+/g,'')===wantedNorm))) return cls;
      }
      const candidates=[];
      for (const [cls,info] of Object.entries(g)){
        const cands=candidateNames(info);
        for (const nm of cands){ if(!nm) continue; const nmBase=baseOf(nm); if (nmBase===wantedBase){ candidates.push({cls,nm,hasVar:hasVar(nm)}); break; } }
      }
      if (candidates.length===0) return null;
      if (wantedHasVar){ const exact=candidates.find(c=>c.nm===wanted); return exact? exact.cls : candidates[0].cls; }
      const plain=candidates.find(c=>!c.hasVar); return plain? plain.cls : candidates[0].cls;
    } catch(_) { return null; }
  }
  function characterThumbFor(name){ try { const cls=resolveCharacterClass(name); if(!cls) return null; const img=document.createElement('img'); const base=baseUrl(); const ts=Date.now(); img.src=`${base}/assets/img/tier/${cls}.webp?v=${ts}`; img.alt=cls; img.loading='lazy'; img.onerror=function(){ this.src=`${base}/assets/img/character-half/${cls}.webp?v=${ts}`; }; img.width=32; img.height=32;  return img; } catch(_) { return null; } }
  function resolveWeaponMeta(name){
    try {
      const datasets = [];
      const kr = getWeaponData(); if (kr) datasets.push(kr);
      if (window.enCharacterWeaponData) datasets.push(window.enCharacterWeaponData);
      if (window.jpCharacterWeaponData) datasets.push(window.jpCharacterWeaponData);
      const needle = String(name||'').trim(); if (!needle) return null;
      const baseOf = (s)=> String(s).split('·')[0].trim();
      const needleBase = baseOf(needle);
      let ownerFallback = null;
      for (const db of datasets){
        for (const [ownerKey, obj] of Object.entries(db)){
          for (const [k,v] of Object.entries(obj)){
            if (!k.startsWith('weapon')) continue;
            const vname = v && typeof v.name==='string' ? v.name.trim() : '';
            if (vname && vname === needle) return { ownerKey, weaponKey: k };
            // fallback: 동일 캐릭터 무기군(변형명 제거) 매칭 → grade 5-1로 고정
            if (!ownerFallback && vname && baseOf(vname) === needleBase) ownerFallback = ownerKey;
          }
        }
      }
      if (ownerFallback) {
        const db = datasets.find(d=> d && d[ownerFallback]);
        const entries = db ? Object.keys(db[ownerFallback]).filter(k=>k.startsWith('weapon5-')) : [];
        if (entries.length){
          const pref = entries.includes('weapon5-1') ? 'weapon5-1' : entries.sort()[0];
          return { ownerKey: ownerFallback, weaponKey: pref };
        }
      }
      return null;
    } catch(_) { return null; }
  }
  function weaponThumbFor(name){ try { const meta=resolveWeaponMeta(name); if(!meta) return null; const m=meta.weaponKey.match(/^weapon(\d+)-(\d+)$/); if(!m) return null; const num1=m[1]; const num2=String(m[2]).padStart(2,'0'); const base=baseUrl(); const file=`${meta.ownerKey}-${num1}-${num2}.png`; const img=document.createElement('img'); img.src=`${base}/assets/img/character-weapon/${file}?v=${Date.now()}`; img.alt=`${meta.ownerKey}-${meta.weaponKey}`; img.loading='lazy'; img.onerror=function(){ this.style.display='none'; }; img.width=32; img.height=32; img.style.objectFit='cover'; return img; } catch(_) { return null; } }
  function weaponNameByLang(ownerKey, weaponKey){
    try {
      const db = (lang==='en') ? (window.enCharacterWeaponData||getWeaponData())
               : (lang==='jp') ? (window.jpCharacterWeaponData||getWeaponData())
               : getWeaponData();
      const entry = db && db[ownerKey] && db[ownerKey][weaponKey];
      const n = entry && entry.name ? String(entry.name).trim() : '';
      return n || null;
    } catch(_) { return null; }
  }
  function resolveDisplayName(name, label){ try { const fixed = applyNameFixups(name); if (label==='weapon'){ const meta = resolveWeaponMeta(fixed); const alt = meta ? weaponNameByLang(meta.ownerKey, meta.weaponKey) : null; return alt || name; } const cls = resolveCharacterClass(fixed); if(!cls) return name; const info=(getCharData()||{})[cls]; const alt=charNameByLang(info); return alt || name; } catch(_) { return name; } }

  async function fetchSummary(region){
    const key = String(region||'KR').toLowerCase();
    const url = `https://iant.kr:5000/gacha/stat/${encodeURIComponent(key)}`;
    const r = await fetch(url, { cache:'no-store' });
    if (!r.ok) throw new Error('stat fetch failed');
    return await r.json();
  }

  async function fetchDaily(region, days=30){
    const key = String(region||'KR').toLowerCase();
    const url = `https://iant.kr:5000/gacha/stat/day/${encodeURIComponent(key)}?days=${days}`;
    const r = await fetch(url, { cache:'no-store' });
    if (!r.ok) throw new Error('day stat fetch failed');
    return await r.json();
  }

  // character distribution for 3-column lists
  async function fetchCharacters(region){
    const key = String(region||'KR').toLowerCase();
    const url = `https://iant.kr:5000/gacha/character/${encodeURIComponent(key)}`;
    const r = await fetch(url, { cache:'no-store' });
    if (!r.ok) throw new Error('character fetch failed');
    return await r.json();
  }

  async function fetchCharactersWeek(region, weeks){
    const key = String(region||'KR').toLowerCase();
    const url = `https://iant.kr:5000/gacha/character/week/${encodeURIComponent(key)}?weeks=${Number(weeks||2)}`;
    const r = await fetch(url, { cache:'no-store' });
    if (!r.ok) throw new Error('character week fetch failed');
    return await r.json();
  }

  async function fetchCharactersDay(region, days){
    const key = String(region||'KR').toLowerCase();
    const url = `https://iant.kr:5000/gacha/character/day/${encodeURIComponent(key)}?days=${Number(days||30)}`;
    const r = await fetch(url, { cache:'no-store' });
    if (!r.ok) throw new Error('character day fetch failed');
    return await r.json();
  }

  function mergePeriodSummaries(periodJson){
    // periodJson: { data: [ { summary: {...} }, ... ] }
    const acc = { Confirmed:{}, Fortune:{}, Gold:{}, Newcomer:{}, Weapon:{} };
    try {
      const arr = Array.isArray(periodJson?.data) ? periodJson.data : [];
      for (const row of arr){
        const s = row && row.summary ? row.summary : {};
        for (const type of Object.keys(acc)){
          const obj = s[type] || {};
          for (const [name, meta] of Object.entries(obj)){
            const cur = acc[type][name] || { ...meta, count:0 };
            cur.count += Number(meta.count||0);
            acc[type][name] = cur;
          }
        }
      }
    } catch(_) {}
    return { data: acc };
  }

  function aggregateCharacters(json){
    const data = (json && json.data) || {};
    const byId = new Map();
    const add = (obj)=>{ for (const [name, meta] of Object.entries(obj||{})){ const id = Number(meta.char_id||0); const c = Number(meta.count||0); if (!Number.isFinite(c)) continue; if (!byId.has(id)) byId.set(id, { name, count:0, id }); byId.get(id).count += c; } };
    add(data.Confirmed); add(data.Fortune); add(data.Gold); add(data.Newcomer);
    const loseSet = (typeof window !== 'undefined' && Array.isArray(window.LOSE_5050_LIST)) ? new Set(window.LOSE_5050_LIST.map(v=>Number(v))) : new Set();
    const limited = []; const standard = [];
    for (const v of byId.values()) { (loseSet.has(Number(v.id)) ? standard : limited).push({ name:v.name, count:v.count }); }
    const weapons = new Map(); for (const [name, meta] of Object.entries(data.Weapon||{})){ const c = Number(meta.count||0); if (!Number.isFinite(c)) continue; weapons.set(name, (weapons.get(name)||0)+c); }
    const toEntries = (arrOrMap)=> Array.isArray(arrOrMap) ? arrOrMap.sort((a,b)=> b.count-a.count) : Array.from(arrOrMap.entries()).map(([name,count])=>({ name, count })).sort((a,b)=> b.count-a.count);
    return { limited: toEntries(limited), standard: toEntries(standard), weapon: toEntries(weapons) };
  }

  function createListCard(title, entries, type, limit){
    const card = document.createElement('div'); card.className='rank-card';
    const h = document.createElement('h3'); h.textContent = title; card.appendChild(h);
    const total = entries.reduce((s,it)=> s+it.count, 0) || 1;
    const head = document.createElement('div'); head.className='rank-row rank-head'; head.innerHTML = `<div>Name</div><div style="text-align:right">Total</div><div style="text-align:right">%</div>`; card.appendChild(head);
    const renderRow = (it)=>{
      const row = document.createElement('div'); row.className='rank-row';
      const left = document.createElement('div'); left.className='rank-name';
      const thumb = (type==='weapon') ? weaponThumbFor(it.name) : characterThumbFor(it.name);
      if (thumb) left.appendChild(thumb);
      const nm = document.createElement('span');
      try {
        const disp = resolveDisplayName(it.name, (type==='weapon'?'weapon':'character'));
        nm.textContent = disp;
      } catch(_) { nm.textContent = it.name; }
      left.appendChild(nm);
      const ratio = Math.max(0, Math.min(1, it.count/total));
      const mid = document.createElement('div'); mid.className='rank-num'; mid.textContent = numberFmt(it.count);
      const right = document.createElement('div'); right.className='rank-perc'; right.textContent = numberFmt(ratio*100, 2);
      row.style.setProperty('--ratio', String(ratio));
      row.classList.add('has-bar');
      row.appendChild(left); row.appendChild(mid); row.appendChild(right);
      card.appendChild(row);
    };
    const initial = (typeof limit==='number' && limit>0) ? entries.slice(0, limit) : entries;
    initial.forEach(renderRow);
    if (entries.length > initial.length){
      const foot = document.createElement('div'); foot.className='rank-more';
      const btn = document.createElement('button'); btn.className='more-btn';
      const text = (lang==='en'? 'More' : (lang==='jp'? 'もっと見る' : '더보기'));
      btn.innerHTML = `${text} <svg viewBox="0 0 18 18" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M4 7l5 5 5-5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      btn.addEventListener('click', ()=>{
        for (const it of entries.slice(initial.length)) renderRow(it);
        foot.remove();
      });
      foot.appendChild(btn); card.appendChild(foot);
    }
    return card;
  }

  async function renderThreeLists(region){
    if (!threeListsWrap) return;
    try {
      // source selector from active tab
      const range = (tabsWrap && tabsWrap.querySelector('.gs-tab.active') ? tabsWrap.querySelector('.gs-tab.active').dataset.range : 'all') || 'all';
      let json;
      if (range==='all') json = await fetchCharacters(region);
      else if (range==='2w') json = mergePeriodSummaries(await fetchCharactersWeek(region, 2));
      else if (range==='1m') json = mergePeriodSummaries(await fetchCharactersDay(region, 30));
      else if (range==='3m') json = mergePeriodSummaries(await fetchCharactersDay(region, 90));
      else json = await fetchCharacters(region);
      const ag = aggregateCharacters(json);
      threeListsWrap.innerHTML = '';
      const tLimited = (lang==='en'? '5★ Limited List' : (lang==='jp'? '5★ 限定リスト' : '5★ 한정 리스트'));
      const tStandard = (lang==='en'? '5★ Standard List' : (lang==='jp'? '5★ 通常リスト' : '5★ 통상 리스트'));
      const tWeapon = (lang==='en'? '5★ Weapon List' : (lang==='jp'? '5★ 武器リスト' : '5★ 무기 리스트'));
      threeListsWrap.appendChild(createListCard(tLimited, ag.limited, 'character', 10));
      threeListsWrap.appendChild(createListCard(tStandard, ag.standard, 'character', 10));
      threeListsWrap.appendChild(createListCard(tWeapon, ag.weapon, 'weapon', 10));
    } catch(_) {
      threeListsWrap.innerHTML = '<div class="rank-card">Load failed</div>';
    }
  }

  function renderTabs(){
    if (!tabsWrap) return;
    tabsWrap.innerHTML = '';
    const items = [
      { key:'all', label: (lang==='en'?'All':(lang==='jp'?'全体':'전체')) },
      { key:'2w',  label: (lang==='en'?'2 Weeks':(lang==='jp'?'2週':'2주')) },
      { key:'1m',  label: (lang==='en'?'1 Month':(lang==='jp'?'1ヶ月':'1개월')) },
    ];
    for (const it of items){
      const b = document.createElement('button'); b.className='gs-tab'; b.textContent = it.label; b.dataset.range = it.key;
      if (it.key==='all') b.classList.add('active');
      b.addEventListener('click', ()=>{
        tabsWrap.querySelectorAll('.gs-tab').forEach(x=> x.classList.remove('active'));
        b.classList.add('active');
        renderThreeLists(regionEl?regionEl.value:'KR');
      });
      tabsWrap.appendChild(b);
    }
  }

  // Pity distribution chart
  const pityCanvas = qs('#pityChart');
  const pityTabs = qs('#pityTabs');
  const PITY_MAX = { Confirmed:110, Fortune:80, Gold:80, Weapon:70, Newcomer:50 };
  let pityDataCache = null; // region별 최근 가져온 원본 JSON 캐시
  function renderPityTabs(){
    if (!pityTabs) return;
    pityTabs.innerHTML=''; pityTabs.classList.add('plain');
    const kinds = ['Fortune','Confirmed','Gold','Weapon','Newcomer'];
    kinds.forEach((k,idx)=>{
      const b=document.createElement('button'); b.className='gs-tab'; b.textContent=(NAME[k]||k); b.dataset.kind=k;
      if (k==='Fortune') b.classList.add('active');
      b.addEventListener('click', ()=>{
        pityTabs.querySelectorAll('.gs-tab').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        if (pityDataCache) { drawPityChart(pityDataCache); } else { refreshPity(); }
      });
      pityTabs.appendChild(b);
      if (idx < kinds.length-1){ const sep=document.createElement('span'); sep.className='sep'; sep.textContent='|'; pityTabs.appendChild(sep); }
    });
  }

  async function fetchPity(region){
    const key = String(region||'KR').toLowerCase();
    const url = `https://iant.kr:5000/gacha/pity/${encodeURIComponent(key)}`;
    const r = await fetch(url, { cache:'no-store' }); if (!r.ok) throw new Error('pity fetch failed');
    return await r.json();
  }

  function drawPityChart(json) {
    if (!pityCanvas) return;
    const ctx = pityCanvas.getContext('2d'); if (!ctx) return;
  
    // ---- data ----
    const kind = pityTabs && pityTabs.querySelector('.gs-tab.active')
      ? pityTabs.querySelector('.gs-tab.active').dataset.kind : 'Fortune';
    const src = (json && json.data && json.data[kind]) || {};
    const maxX = PITY_MAX[kind] || 80;
  
    const bars = []; let total = 0;
    for (let i = 1; i <= maxX; i++) { const c = Number(src[i] || 0); bars.push(c); total += c; }
    const acc = []; { let s = 0; for (let i = 0; i < bars.length; i++) { s += bars[i]; acc.push(total ? (s / total * 100) : 0); } }
  
    // ---- canvas & DPR ----
    const cssW = pityCanvas.clientWidth || 640;
    const cssH = pityCanvas.clientHeight || 240;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    pityCanvas.width = Math.floor(cssW * dpr);
    pityCanvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
  
    // ---- layout ----
    // 768 이하면 padL PadR 24px
    const padL = window.innerWidth <= 768 ? 24 : 48;
    const padR = window.innerWidth <= 768 ? 24 : 48;
    const padT = 28, padB = 38;
    const W = cssW - padL - padR, H = cssH - padT - padB;
  
    const leftLabelX  = 8;           // 왼쪽 y축 숫자 살짝 안쪽
    const rightLabelX = cssW - 8;    // 오른쪽 y축 숫자 살짝 안쪽
  
    // 좌표
    const colW = W / maxX;
    const px = (i) => padL + (i - 0.5) * colW;        // 칸의 중앙
    const maxBarVal = Math.max(1, ...bars);
    const pyBar  = (v) => padT + (H - (v / maxBarVal) * H);
    const pyLine = (v) => padT + (H - (v / 100) * H);
    const crisp = (y) => Math.round(y) + 0.5;
  
    // 좌측 눈금 nice
    function niceMax(x){ const e=Math.floor(Math.log10(x)); const f=x/10**e; const nf=(f<=1)?1:(f<=2)?2:(f<=5)?5:10; return nf*10**e; }
    const niceMaxBar = niceMax(maxBarVal);
  
    // ---- grid (균등 간격으로 소수만) ----
    const GRID = 5;                           // 5 구간 = 6줄
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    for (let j = 0; j <= GRID; j++) {
      const y = crisp(padT + H * (j / GRID));
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + W, y); ctx.stroke();
    }
  
    // ---- bars (윗부분만 라운드) ----
    const bw = Math.max(2, colW * 0.72);
    ctx.fillStyle = '#ffdd6b';
    ctx.globalAlpha = 0.9;
    function roundTopRect(x, y, w, h, r){
      const rr = Math.max(0, Math.min(r, w/2, h/2));
      ctx.beginPath();
      ctx.moveTo(x, y + rr);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w, y + rr);
      ctx.quadraticCurveTo(x + w, y, x + w - rr, y);
      ctx.lineTo(x + rr, y);
      ctx.quadraticCurveTo(x, y, x, y + rr);
      ctx.closePath();
    }
    for (let i = 1; i <= maxX; i++) {
      const v = bars[i - 1]; if (!v) continue;
      const x = px(i) - bw / 2;
      const y = pyBar(v);
      const h = (padT + H) - y;
      roundTopRect(x, y, bw, h, Math.min(6, bw * 0.4));
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  
    // ---- line + area ----
    // area (마지막 점 → 우측 끝까지 수평으로 연장해 빈 공간 제거)
    let lastY = pyLine(acc[maxX - 1] || 0);
    ctx.beginPath();
    for (let i = 1; i <= maxX; i++) {
      const x = px(i), y = pyLine(acc[i - 1] || 0);
      if (i === 1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.lineTo(padL + W, lastY);            // ← 추가: 우측 끝까지
    ctx.lineTo(padL + W, padT + H);
    ctx.lineTo(padL, padT + H);
    ctx.closePath();
    ctx.fillStyle = 'rgba(77,163,255,0.15)';
    ctx.fill();
  
    // line (선도 우측 끝까지 수평 연장)
    ctx.strokeStyle = '#4da3ff'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 1; i <= maxX; i++) {
      const x = px(i), y = pyLine(acc[i - 1] || 0);
      if (i === 1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.lineTo(padL + W, lastY);            // ← 추가
    ctx.stroke();
  
    // dots
    ctx.fillStyle = '#4da3ff';
    const dotStep = Math.max(1, Math.round(maxX / 24));
    for (let i = 1; i <= maxX; i += dotStep) {
      const x = px(i), y = pyLine(acc[i - 1] || 0);
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
    }
  
    // ---- axes labels ----
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  
    // 왼쪽 y (GRID에 맞춰서)
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    for (let j = 0; j <= GRID; j++) {
        const t = j / GRID;
        const y = padT + H * t;                          // 그리드 위치는 그대로
        const v = Math.round(niceMaxBar * (1 - t));      // ← 값만 반대로
        ctx.fillText(String(v), leftLabelX, y);
    }
  
    // 오른쪽 y (GRID에 맞춰서)
    ctx.textAlign = 'right';
    for (let j = 0; j <= GRID; j++) {
        const t = j / GRID;
        const y = padT + H * t;
        const p = Math.round(100 * (1 - t));             // ← 값만 반대로
        ctx.fillText(String(p), rightLabelX, y);
    }
  
    // x labels (2 단위 고정)
    ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
    // 1200 px 이하면 4단위, 768 이하면 8단위
    for (let i = 2; i <= maxX; i += (window.innerWidth <= 768 ? 8 : (window.innerWidth <= 1200 ? 4 : 2))) {
      const x = padL + i * colW - colW / 2 + 4;       // px(i)
      const y = padT + H + 14;
      ctx.save(); ctx.translate(x, y); ctx.rotate(-28 * Math.PI / 180);
      ctx.fillText(String(i), 0, 0); ctx.restore();
    }
  
    // ---- legend (겹침 방지) ----
    const legendY = 10; let lx = 48;
    const legend = (color, text, offset=72) => {
      ctx.fillStyle = color; ctx.fillRect(lx, legendY, 20, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillText(text, lx + offset, legendY + 9);
      lx += ctx.measureText(text).width + 72;
    };
    legend('#4da3ff', 'Chance %');
    legend('#ffdd6b', 'Total Pull 5★', 84);
  }
  
  
  
  async function refreshPity(){
    try {
      const region = regionEl?regionEl.value:'KR';
      pityDataCache = await fetchPity(region);
      drawPityChart(pityDataCache);
    } catch(_){}
  }

  function makeGlobalCard(kind, obj){
    const el = document.createElement('div');
    el.className = 'global-card';
    const avg = obj && obj.avg_pity!=null ? Number(obj.avg_pity) : null;
    const cnt = obj && obj.count!=null ? Number(obj.count) : null;
    const lose = (kind==='Fortune' || kind==='Weapon') && obj && obj.lose_5050_rate!=null ? (Number(obj.lose_5050_rate)) : null;

    const top = document.createElement('div'); top.style.display='flex'; top.style.alignItems='center'; top.style.justifyContent='space-between';
    const title = document.createElement('div'); title.style.opacity=.9; title.style.fontSize='13px'; title.style.fontWeight='700'; title.textContent = NAME[kind] || kind;
    top.appendChild(title);
    const icon = document.createElement('img'); icon.className='card-title-icon'; icon.alt=kind; icon.src = baseUrl()+`/assets/img/pay/${ICONS[kind]}`; top.appendChild(icon);
    el.appendChild(top);

    const big = document.createElement('p'); big.className='big ' + (kind==='Weapon'?'weapon':'char');
    const small = document.createElement('span'); small.textContent = '5★ '; small.style.opacity = .9; small.style.fontSize='12px'; small.style.marginRight='4px';
    const UNIT_TIMES = (I18N[lang]||I18N.kr).unitTimes;
    big.textContent = avg!=null? `${numberFmt(avg,1)} ${UNIT_TIMES}` : '-';
    big.prepend(small);
    el.appendChild(big);

    const sub = document.createElement('div'); sub.className='sub';
    const success = (lose!=null) ? (1 - lose) : null;
    const words = (I18N[lang]||I18N.kr);
    const successTxt = (success!=null) ? `, ${words.pickupSuccess} ${numberFmt(success*100,1)}%` : '';
    sub.textContent = `${cnt!=null? numberFmt(cnt):'-'}${words.unitCount} ${words.obtained}${successTxt}`;
    el.appendChild(sub);
    return el;
  }

  function renderCards(summary){
    if (!cardsWrap) return;
    cardsWrap.innerHTML = '';
    const data = (summary && summary.data) || {};
    const order = ['Fortune','Confirmed','Gold','Weapon','Newcomer'];
    for (const k of order){ cardsWrap.appendChild(makeGlobalCard(k, data[k] || null)); }
  }

  function renderInfoCards(summary){
    if (!infoWrap) return;
    const data = (summary && summary.data) || {};
    const charKeys = ['Fortune','Confirmed','Gold','Newcomer'];
    const weapKeys = ['Weapon'];
    const pick = (keys, field)=> keys.reduce((s,k)=> s + (Number((data[k]||{})[field]||0)||0), 0);
    const weightedAvg = (keys)=>{
      let num = 0, den = 0;
      for (const k of keys){
        const obj = data[k] || {};
        const a = Number(obj.avg_pity);
        const c = Number(obj.count);
        if (!Number.isFinite(a) || !Number.isFinite(c) || c <= 0) continue;
        num += a * c;
        den += c;
      }
      return den > 0 ? (num / den) : null;
    };
    // 캐릭터 평균은 공식 가이드에 따라 확정/운명/일반 기준 가중 평균
    const charAvg = weightedAvg(['Confirmed','Fortune','Gold']);
    const charCnt = pick(charKeys, 'count');
    const weapAvg = weightedAvg(weapKeys);
    const weapCnt = pick(weapKeys, 'count');

    // 픽업 성공 확률 = 1 - lose_5050_rate (운명/무기만 의미 있음)
    const fortune = data['Fortune'] || {};
    const weapon = data['Weapon'] || {};
    const fortuneWin = (Number(fortune.lose_5050_rate) != null && !isNaN(Number(fortune.lose_5050_rate))) ? (1 - Number(fortune.lose_5050_rate)) : null;
    const weaponWin = (Number(weapon.lose_5050_rate) != null && !isNaN(Number(weapon.lose_5050_rate))) ? (1 - Number(weapon.lose_5050_rate)) : null;

    // 캐릭터 한정 5★ 평균: (확정 avg*확정 cnt + 운명 avg*운명 cnt) / (확정 cnt + 운명 cnt * 픽업성공확률)
    const confirmedAvg = Number((data['Confirmed']||{}).avg_pity);
    const confirmedCnt = Number((data['Confirmed']||{}).count);
    const fortuneAvg = Number((data['Fortune']||{}).avg_pity);
    const fortuneCnt = Number((data['Fortune']||{}).count);
    let charLimitedAvg = null;
    {
      const numerator = (Number.isFinite(confirmedAvg) && Number.isFinite(confirmedCnt) ? confirmedAvg*confirmedCnt : 0)
                      + (Number.isFinite(fortuneAvg) && Number.isFinite(fortuneCnt) ? fortuneAvg*fortuneCnt : 0);
      const denom = (Number.isFinite(confirmedCnt)? confirmedCnt : 0)
                  + (Number.isFinite(fortuneCnt) && fortuneWin!=null ? fortuneCnt * fortuneWin : 0);
      charLimitedAvg = denom>0 ? (numerator/denom) : null;
    }

    // 무기 한정 5★ 평균: (무기 avg*무기 cnt) / (무기 cnt * 픽업성공확률)
    let weapLimitedAvg = null;
    {
      const wAvg = Number((data['Weapon']||{}).avg_pity);
      const wCnt = Number((data['Weapon']||{}).count);
      const num = (Number.isFinite(wAvg) && Number.isFinite(wCnt)) ? (wAvg*wCnt) : 0;
      const den = (Number.isFinite(wCnt) && weaponWin!=null) ? (wCnt*weaponWin) : 0;
      weapLimitedAvg = den>0 ? (num/den) : null;
    }

    infoWrap.innerHTML = '';
    const items = [
      { label: LABELS.charAvg, value: charAvg!=null? numberFmt(charAvg,1):'-', unit:(lang==='jp'?' 回':(lang==='en'?'':' 회')), cls:'val-char' },
      { label: LABELS.charLimitedAvg, value: charLimitedAvg!=null? numberFmt(charLimitedAvg,1):'-', unit:(lang==='jp'?' 回':(lang==='en'?'':' 회')), cls:'val-char' },
      { label: LABELS.charCnt, value: numberFmt(charCnt), unit:'', cls:'val-char' },
      { label: LABELS.weapAvg, value: weapAvg!=null? numberFmt(weapAvg,1):'-', unit:(lang==='jp'?' 回':(lang==='en'?'':' 회')), cls:'val-weapon' },
      { label: LABELS.weapLimitedAvg, value: weapLimitedAvg!=null? numberFmt(weapLimitedAvg,1):'-', unit:(lang==='jp'?' 回':(lang==='en'?'':' 회')), cls:'val-weapon' },
      { label: LABELS.weapCnt, value: numberFmt(weapCnt), unit:'', cls:'val-weapon' }
    ];
    for (const it of items){
      const d = document.createElement('div'); d.className='info-card';
      const h4 = document.createElement('h4'); h4.textContent = it.label; d.appendChild(h4);
      const val = document.createElement('div'); val.className='val '+it.cls; val.textContent = it.value + it.unit; d.appendChild(val);
      infoWrap.appendChild(d);
    }
  }

  function drawSmoothLine(ctx, points){
    if (points.length<2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i=1;i<points.length;i++){
      const prev = points[i-1];
      const cur = points[i];
      const cx = (prev.x + cur.x)/2;
      const cy = (prev.y + cur.y)/2;
      ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
    }
    const last = points[points.length-1];
    const before = points[points.length-2];
    ctx.quadraticCurveTo(before.x, before.y, last.x, last.y);
    ctx.stroke();
  }

  function drawDailyChart(json){
    if (!chartCanvas) return;
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;
    const rows = Array.isArray(json?.data)? json.data: [];
    const labels = [];
    const values = [];
    for (const d of rows){
      const sum = d && d.summary ? Object.values(d.summary).reduce((s,v)=> s + (Number(v && v.count || 0) || 0), 0) : 0;
      const day = (d && d.startTime) ? d.startTime.slice(5,10).replace('-','/') : '';
      labels.push(day);
      values.push(sum);
    }
    const width = chartCanvas.clientWidth || 600;
    const height = chartCanvas.clientHeight || 180;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    chartCanvas.width = Math.floor(width * dpr);
    chartCanvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,width,height);


    // 768 이하면 padL 24
    const padL = window.innerWidth <= 768 ? 24 : 48;
    const padR = window.innerWidth <= 768 ? 12 : 12;
    const padT = 28, padB = 28;
    const W = width - padL - padR, H = height - padT - padB;
    const maxV = Math.max(1, Math.max(...values, 1));
    const px = (i)=> padL + (labels.length<=1? 0 : (i * (W/(labels.length-1))));
    const py = (v)=> padT + (H - (v/maxV)*H);

    // legend
    const legendText = LABELS.pullsByDay;
    ctx.fillStyle = '#8fd9ff';
    ctx.globalAlpha = 1; ctx.fillRect(padL + 8, 8, 28, 12);
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = '12px sans-serif'; ctx.fillText(legendText, padL + 44, 18);

    // axes
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT+H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL, padT+H); ctx.lineTo(padL+W, padT+H); ctx.stroke();

    // grid + y labels
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = '12px sans-serif';
    const steps = 4;
    for (let i=1;i<=steps;i++){
      const v = Math.round((maxV/steps)*i);
      const y = py(v);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL+W, y); ctx.stroke();
      ctx.fillText(String(v), 10, y+4);
    }

    // x labels
    // 768이하면 4일 단위
    for (let i=0;i<labels.length;i+=Math.max(1, Math.floor(labels.length/(window.innerWidth <= 768 ? 4 : 10)))){ const x=px(i); const y=padT+H+16; ctx.fillText(labels[i], x-14, y); }

    // line
    const points = values.map((v,i)=>({ x: px(i), y: py(v) }));
    ctx.strokeStyle = '#8fd9ff';
    ctx.lineWidth = 2.5;
    drawSmoothLine(ctx, points);
    // no dots (요청 사항)
  }

  async function refreshAll(){
    try {
      const region = regionEl ? regionEl.value : 'KR';
      const [summary, daily] = await Promise.all([ fetchSummary(region), fetchDaily(region, 30) ]);
      renderInfoCards(summary);
      drawDailyChart(daily);
      renderCards(summary);
      await renderThreeLists(region);
    } catch(err){
      if (cardsWrap) cardsWrap.innerHTML = '<div class="global-card">Load failed</div>';
      try { console.error('[global-stats]', err); } catch(_) {}
    }
  }

  if (tabsWrap) renderTabs();
  if (pityTabs) renderPityTabs();
  if (regionEl){ refreshAll(); refreshPity(); }
})();
