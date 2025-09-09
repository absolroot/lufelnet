// global-stats.js
(function(){
  const qs = (sel)=>document.querySelector(sel);
  const lang = (new URLSearchParams(location.search).get('lang')||'kr').toLowerCase();

  const LABELS = {
    kr: { title: '전체 통계', avg: '평균', count: '5★ 합계', loseRate: '50:50 패배율', pullsByDay: '일별 횟수', charAvg:'캐릭터 5★ 평균', charLimitedAvg:'캐릭터 한정 5★ 평균', charCnt:'캐릭터 5★ 획득 수', weapAvg:'무기 5★ 평균', weapLimitedAvg:'무기 한정 5★ 평균', weapCnt:'무기 5★ 획득 수' },
    en: { title: 'Global Stats', avg: 'Avg', count: '5★ Count', loseRate: 'Lose 50:50 %', pullsByDay: 'Pulls By Day', charAvg:'Character 5★ Avg', charLimitedAvg:'Char Limited 5★ Avg', charCnt:'Character 5★ Count', weapAvg:'Weapon 5★ Avg', weapLimitedAvg:'Weapon Limited 5★ Avg', weapCnt:'Weapon 5★ Count' },
    jp: { title: '全体統計', avg: '平均', count: '5★ 合計', loseRate: '50:50 敗北率', pullsByDay: '日別回数', charAvg:'キャラ 5★ 平均', charLimitedAvg:'キャラ限定 5★ 平均', charCnt:'キャラ 5★ 獲得数', weapAvg:'武器 5★ 平均', weapLimitedAvg:'武器限定 5★ 平均', weapCnt:'武器 5★ 獲得数' }
  }[lang] || { title:'전체 통계', avg:'평균', count:'5★ 합계', loseRate:'50:50 패배율', pullsByDay:'일별 횟수', charAvg:'캐릭터 5★ 평균', charLimitedAvg:'캐릭터 한정 5★ 평균', charCnt:'캐릭터 5★ 획득 수', weapAvg:'무기 5★ 평균', weapLimitedAvg:'무기 한정 5★ 평균', weapCnt:'무기 5★ 획득 수' };

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

  if (titleEl) titleEl.textContent = LABELS.title;
  if (regionEl) {
    const def = lang==='en'? 'EN' : lang==='jp'? 'JP' : 'KR';
    regionEl.value = def;
    regionEl.addEventListener('change', refreshAll);
  }

  function numberFmt(n, frac=0){ try { return new Intl.NumberFormat(undefined, { maximumFractionDigits: frac, minimumFractionDigits: frac }).format(n); } catch(_) { return String(n); } }
  function baseUrl(){ try { return window.BASE_URL || ''; } catch(_) { return ''; } }

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

  function makeGlobalCard(kind, obj){
    const el = document.createElement('div');
    el.className = 'global-card';
    const avg = obj && obj.avg_pity!=null ? Number(obj.avg_pity) : null;
    const cnt = obj && obj.count!=null ? Number(obj.count) : null;
    const lose = (kind==='Fortune' || kind==='Weapon') && obj && obj.lose_5050_rate!=null ? (Number(obj.lose_5050_rate)) : null;

    const top = document.createElement('div'); top.style.display='flex'; top.style.alignItems='center'; top.style.justifyContent='space-between';
    const title = document.createElement('div'); title.style.opacity=.9; title.style.fontSize='13px'; title.textContent = NAME[kind] || kind;
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
    const order = ['Confirmed','Fortune','Gold','Weapon','Newcomer'];
    for (const k of order){ cardsWrap.appendChild(makeGlobalCard(k, data[k] || null)); }
  }

  function renderInfoCards(summary){
    if (!infoWrap) return;
    const data = (summary && summary.data) || {};
    const charKeys = ['Confirmed','Fortune','Gold','Newcomer'];
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

    const padL = 48, padR = 12, padT = 28, padB = 28;
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
    for (let i=0;i<labels.length;i+=Math.max(1, Math.floor(labels.length/10))){ const x=px(i); const y=padT+H+16; ctx.fillText(labels[i], x-14, y); }

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
    } catch(err){
      if (cardsWrap) cardsWrap.innerHTML = '<div class="global-card">Load failed</div>';
      try { console.error('[global-stats]', err); } catch(_) {}
    }
  }

  if (regionEl) refreshAll();
})();
