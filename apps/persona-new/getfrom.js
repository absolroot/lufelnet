// Acquisition (획득처) section: CSV loading and rendering
(function(){
  function BASE(){ return (typeof window !== 'undefined' && window.SITE_BASEURL) ? window.SITE_BASEURL : ''; }

  let acqMap = null; // { [krPersonaName]: { combination1, combination2, combination3, names: {kr,en,jp} } }
  let loadingPromise = null;
  // Shared global ad rotation (used by multiple modals)
  function getSharedAdRotation(){
    const w = (typeof window !== 'undefined') ? window : globalThis;
    if (!w.__modalAdRotation){
      w.__modalAdRotation = { slots: ['7254578915', '7331282728', '6018201052', '9244892982'], idx: 0 };
    }
    return w.__modalAdRotation;
  }
  function nextSharedAdSlot(){
    const state = getSharedAdRotation();
    const slot = state.slots[state.idx % state.slots.length];
    state.idx++;
    return slot;
  }

  function getCurrentLang(){
    return (typeof LanguageRouter !== 'undefined') ? LanguageRouter.getCurrentLanguage() : 'kr';
  }

  async function loadAcqMap(){
    if (acqMap) return acqMap;
    if (loadingPromise) return loadingPromise;
    const ver = (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1');

    // Try current language path first; fallback to KR if not found
    const lang = getCurrentLang();
    const tryUrls = [
      `${BASE()}/data/kr/wonder/persona_skill_from.csv?v=${ver}`
    ];

    loadingPromise = (async () => {
      for (const url of tryUrls){
        try{
          const res = await fetch(url, { cache: 'no-cache' });
          if (!res.ok) throw new Error(`${res.status}`);
          const text = await res.text();
          const map = parseCSV(text);
          acqMap = map; return map;
        }catch(_){ /* try next */ }
      }
      acqMap = {}; return acqMap;
    })();
    return loadingPromise;
  }

  function parseCSV(csv){
    const lines = csv.split(/\r?\n/).filter(l => l.trim().length);
    if (!lines.length) return {};
    const firstCols = lines[0].split(',').map(s=>s.trim().toLowerCase());
    const looksLikeHeader = firstCols.includes('korean') || firstCols.includes('english') || firstCols.includes('japanese');
    const start = looksLikeHeader ? 1 : 0;
    const map = {};
    const isComboToken = (s) => {
      if (!s) return false;
      const v = s.trim();
      if (!v) return false;
      // Heuristics: contains '+', emblem/merope/gacha pattern, or single EVENT
      return v.includes('+') || /^(white|blue|purple|rainbow|merope|gacha)\+/i.test(v) || /^event$/i.test(v);
    };
    for (let i = start; i < lines.length; i++){
      const cols = lines[i].split(',').map(s=>s.trim());
      if (cols.length < 1) continue;
      const kr = cols[0] || '';
      const en = cols[1] || '';
      const jp = cols[2] || '';
      if (!kr) continue;
      const combos = [];
      for (let c = 3; c < cols.length; c++){
        const cell = cols[c];
        if (isComboToken(cell)) combos.push(cell);
        if (combos.length === 3) break;
      }
      const [c1='', c2='', c3=''] = combos;
      const key = normalizeName(kr);
      map[key] = { names:{ kr, en, jp }, combination1:c1, combination2:c2, combination3:c3 };
    }
    return map;
  }

  function i18nLabel(key){
    const lang = getCurrentLang();
    if (key === 'label'){
      if (lang === 'en') return 'Acquisition';
      if (lang === 'jp') return '入手先';
      return '획득처';
    }
    if (key === 'detail'){
      if (lang === 'en') return 'detail';
      if (lang === 'jp') return '詳細';
      return '자세히';
    }
    return key;
  }

  function buildIconForEmblem(token){
    // token: white+30, blue+100, purple+750, rainbow+300
    const m = token.match(/^(white|blue|purple|rainbow)\+(\d+)$/i);
    if (!m) return null;
    const lang = getCurrentLang();
    let kind = m[1].toLowerCase();
    const num = m[2];
    // KR rule: white emblem uses blue icon instead
    if (lang === 'kr' && kind === 'white') kind = 'blue';
    const iconNameKr = (function(){
      if (kind === 'blue') return '와일드 엠블럼 하늘';
      if (kind === 'purple') return '와일드 엠블럼 빛';
      if (kind === 'rainbow') return '와일드 엠블럼 무지개';
      return '와일드 엠블럼 화이트';
    })();
    const wrap = document.createElement('span');
    wrap.className = 'acq-emblem';
    const img = document.createElement('img');
    img.className = 'acq-icon';
    img.src = `${BASE()}/apps/persona/persona_icon/${encodeURIComponent(iconNameKr)}.png`;
    img.alt = iconNameKr;
    img.loading = 'lazy';
    const numEl = document.createElement('span');
    numEl.className = 'acq-emblem-num';
    // Rule 1-2: show number without '+'
    numEl.textContent = `${num}`;
    wrap.appendChild(img);
    wrap.appendChild(numEl);
    return wrap;
  }

  // Build GACHA ticket icon with amount, e.g., GACHA+20 -> persona_ticket.png + "20"
  function buildIconForGacha(token){
    const m = token.match(/^gacha\+(\d+)$/i);
    if (!m) return null;
    const num = m[1];
    const lang = getCurrentLang();
    const label = (function(){
      if (lang === 'en') return 'Persona Gacha Ticket';
      if (lang === 'jp') return 'ペルソナ ガチャチケット';
      return '페르소나 가챠 티켓';
    })();
    const wrap = document.createElement('span');
    wrap.className = 'acq-emblem';
    wrap.title = label;
    const img = document.createElement('img');
    img.className = 'acq-icon';
    img.src = `${BASE()}/apps/persona/persona_icon/persona_ticket.png`;
    img.alt = label;
    img.title = label;
    img.loading = 'lazy';
    const numEl = document.createElement('span');
    numEl.className = 'acq-emblem-num';
    numEl.textContent = `${num}`;
    wrap.appendChild(img);
    wrap.appendChild(numEl);
    return wrap;
  }

  function getLocalizedName(krName){
    const lang = getCurrentLang();
    if (lang === 'kr') return krName;
    try{
      if (acqMap){
        const key = normalizeName(krName);
        let rec = acqMap[key];
        if (!rec){
          // also try compact (no-space) match
          const compact = key.replace(/\s+/g,'');
          const foundKey = Object.keys(acqMap).find(k => k.replace(/\s+/g,'') === compact);
          if (foundKey) rec = acqMap[foundKey];
        }
        if (rec && rec.names){
          if (lang === 'en' && rec.names.en) return rec.names.en;
          if (lang === 'jp' && rec.names.jp) return rec.names.jp;
        }
      }
    }catch(_){ /* ignore */ }
    return krName;
  }

  function ensureAcqStyles(){
    if (document.getElementById('acq-style')) return;
    const style = document.createElement('style');
    style.id = 'acq-style';
    style.textContent = `
      .acq-row { margin: 6px 0; }
      .acq-grid { display: grid; gap: 8px; }
      .acq-col { display: flex; align-items: center; justify-content: flex-start; padding: 6px 12px 6px 8px; border-radius:4px; background: rgba(0, 0, 0, 0.06); cursor: pointer; }
      .acq-col.disabled { cursor: default; opacity: .85; }
      .acq-col:not(.disabled):hover { background: rgba(255, 255, 255, 0.06); box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.04); }
      .acq-icons { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 4px; }
      .acq-item { display: inline-flex; align-items: center; gap: 4px; }
      .acq-item img.acq-icon { width: 18px; height: 18px; object-fit: contain; vertical-align: middle; }
      .acq-plus { display: inline-flex; align-items: center; justify-content: center; padding: 0 2px; font-weight: 400; }
      .acq-text { display: inline-flex; align-items: center; height:22px;}
      .acq-emblem { position: relative; display: inline-flex; align-items: center; }
      .acq-emblem img.acq-icon { width: 18px; height: 18px; }
      .acq-emblem-num {font-size: 11px; font-weight: 400; margin-left: 4px; }
      /* Modal tree explorer */
      .acq-tree { display: block; margin-top: 8px; }
      .acq-node { margin: 16px 0 0 0; }
      .acq-node-header { display:flex; align-items:top; gap:8px; cursor: pointer; }
      .acq-node-header.no-children { cursor: default; }
      .acq-node-toggle { width: 16px; height: 16px; display:inline-flex; align-items:center; justify-content:center; opacity:0.8; margin-top: 7px;}
      .acq-node-toggle svg { width: 14px; height: 14px; fill: currentColor; opacity: 0.9; }
      .acq-node-label { display:inline-flex; align-items:center; gap:6px; flex-wrap: wrap; }
      .acq-node-children { margin-left: 24px; margin-top: 2px; }
      .acq-totals { display:flex; align-items:center; gap:10px; margin: 6px 0 16px 0; }
      .acq-totals .acq-emblem-num {font-size: 14px;}
      .acq-totals .acq-icons { gap: 16px; }
      .acq-node .acq-text {font-size:14px;}
      .acq-node .acq-item {background: rgba(255, 255, 255, 0.07); padding: 4px 8px 4px 4px; border-radius: 4px;}
    `;
    document.head.appendChild(style);
  }

  function buildIconsForTokens(value){
    const container = document.createElement('span');
    container.className = 'acq-icons';
    if (!value) return container;

    const v = value.trim();
    if (!v) return container;
    // Special: merope+N (Rule 1-3: plain text "Merope Rank N")
    const mMerope = v.match(/^merope\+(\d+)$/i);
    if (mMerope){
      const num = mMerope[1];
      const wrap = document.createElement('span');
      wrap.className = 'acq-item';
      const img = document.createElement('img');
      img.className = 'acq-icon';
      img.src = `${BASE()}/apps/persona/persona_icon/merope.webp`;
      img.alt = 'Merope';
      img.loading = 'lazy';
      const span = document.createElement('span');
      span.className = 'acq-text';
      span.textContent = `MEROPE Rank ${num}`;
      wrap.appendChild(img);
      wrap.appendChild(span);
      container.appendChild(wrap);
      return container;
    }
    // Special: gacha+N -> ticket icon + number
    const mGacha = v.match(/^gacha\+(\d+)$/i);
    if (mGacha){
      const ticket = buildIconForGacha(v);
      if (ticket){
        container.appendChild(ticket);
        return container;
      }
    }
    if (/^event$/i.test(v)){
      const wrap = document.createElement('span');
      wrap.className = 'acq-item';
      const img = document.createElement('img');
      img.className = 'acq-icon';
      img.src = `${BASE()}/apps/persona/persona_icon/event.png`;
      img.alt = 'EVENT';
      img.loading = 'lazy';
      const span = document.createElement('span');
      span.className = 'acq-text';
      span.textContent = 'EVENT';
      wrap.appendChild(img);
      wrap.appendChild(span);
      container.appendChild(wrap);
      return container;
    }

    const emblem = buildIconForEmblem(v) || buildIconForGacha(v);
    if (emblem){
      container.appendChild(emblem);
      return container;
    }

    // Split and also merge cases like "purple + 750" -> "purple+750" and "merope + 3" -> "merope+3"
    const rawParts = v.split('+').map(s=>s.trim()).filter(Boolean).slice(0,6);
    const parts = [];
    for (let i=0;i<rawParts.length;i++){
      const t = rawParts[i];
      if (/^(white|blue|purple|purlple|rainbow)$/i.test(t) && i+1<rawParts.length && /^\d+$/.test(rawParts[i+1])){
        parts.push(`${normalizeColorName(t)}+${rawParts[i+1]}`);
        i++;
      } else if (/^merope$/i.test(t) && i+1<rawParts.length && /^\d+$/.test(rawParts[i+1])){
        parts.push(`merope+${rawParts[i+1]}`);
        i++;
      } else if (/^gacha$/i.test(t) && i+1<rawParts.length && /^\d+$/.test(rawParts[i+1])){
        parts.push(`gacha+${rawParts[i+1]}`);
        i++;
      } else {
        parts.push(t);
      }
    }
    let appended = 0;
    parts.forEach((name, idx) => {
      // Skip pure numeric segments (avoid icon lookup errors)
      if (/^\d+$/.test(name)){
        return; // do not append; also do not add separator for this part
      }
      // If this part is an emblem token after merging, render emblem
      const em2 = buildIconForEmblem(name) || buildIconForGacha(name);
      if (em2){
        container.appendChild(em2);
        appended++;
        // Separator handling below still applies
        const hasMoreValid = parts.slice(idx+1).some(p => p && !/^\d+$/.test(p));
        if (hasMoreValid){
          const sep = document.createElement('span');
          sep.className = 'acq-plus';
          sep.textContent = '+';
          container.appendChild(sep);
        }
        return;
      }
      const wrap = document.createElement('span');
      wrap.className = 'acq-item';
      const img = document.createElement('img');
      img.className = 'acq-icon';
      img.src = `${BASE()}/apps/persona/persona_icon/${encodeURIComponent(name)}.png`;
      img.alt = name;
      img.loading = 'lazy';
      img.onerror = () => { wrap.replaceChildren(document.createTextNode(getLocalizedName(name))); };
      const label = document.createElement('span');
      label.className = 'acq-text';
      label.textContent = getLocalizedName(name);
      wrap.appendChild(img);
      wrap.appendChild(label);
      container.appendChild(wrap);
      appended++;
      // Add '+' only between successfully appended items and if more valid items remain ahead
      // Find if there is any non-numeric remaining part
      const hasMoreValid = parts.slice(idx+1).some(p => p && !/^\d+$/.test(p));
      if (hasMoreValid){
        const sep = document.createElement('span');
        sep.className = 'acq-plus';
        sep.textContent = '+';
        container.appendChild(sep);
      }
    });
    return container;
  }

  // Determine if a combo contains at least one persona (not emblem/merope/event/number)
  function isPersonaCombo(combo){
    // Merge color + number pairs first so emblem detection works on single tokens
    const raw = splitTokens(combo);
    const parts = (function mergePairs(list){
      const out = [];
      for (let i=0;i<list.length;i++){
        const t = list[i];
        if (/^(white|blue|purple|purlple|rainbow)$/i.test(t) && i+1<list.length && /^\d+$/.test(list[i+1])){
          out.push(`${normalizeColorName(t)}+${list[i+1]}`);
          i++;
        } else if (/^merope$/i.test(t) && i+1<list.length && /^\d+$/.test(list[i+1])){
          out.push(`merope+${list[i+1]}`);
          i++;
        } else if (/^gacha$/i.test(t) && i+1<list.length && /^\d+$/.test(list[i+1])){
          out.push(`gacha+${list[i+1]}`);
          i++;
        } else {
          out.push(t);
        }
      }
      return out;
    })(raw);
    return parts.some(p => p && !/^\d+$/.test(p) && !parseEmblemToken(p) && !isMeropeToken(p) && !isEventToken(p) && !isGachaToken(p));
  }

  // Persona label with icon + localized name
  function buildPersonaIconLabel(nameKr){
    const wrap = document.createElement('span');
    wrap.className = 'acq-item';
    const img = document.createElement('img');
    img.className = 'acq-icon';
    img.src = `${BASE()}/apps/persona/persona_icon/${encodeURIComponent(nameKr)}.png`;
    img.alt = nameKr;
    img.loading = 'lazy';
    img.onerror = () => { wrap.replaceChildren(document.createTextNode(getLocalizedName(nameKr))); };
    const label = document.createElement('span');
    label.className = 'acq-text';
    label.textContent = getLocalizedName(nameKr);
    wrap.appendChild(img);
    wrap.appendChild(label);
    return wrap;
  }

  // SVG chevron toggle (right/down)
  function makeChevron(expanded){
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    // Right: M9 6l6 6-6 6; Down: M6 9l6 6 6-6
    path.setAttribute('d', expanded ? 'M6 9l6 6 6-6' : 'M9 6l6 6-6 6');
    path.setAttribute('stroke','currentColor');
    path.setAttribute('stroke-width','2');
    path.setAttribute('fill','none');
    path.setAttribute('stroke-linecap','round');
    path.setAttribute('stroke-linejoin','round');
    svg.appendChild(path);
    return svg;
  }

  function renderRowGroup(values){
    // values: array of combination strings OR objects like { textOnly:true, text:"..." }
    const row = document.createElement('div');
    row.className = 'acq-row acq-grid';
    const count = values.length;
    row.style.gridTemplateColumns = `repeat(${count}, minmax(0, 1fr))`;
    values.forEach(v => {
      const col = document.createElement('div');
      col.className = 'acq-col';
      // Text-only acquisition (non-clickable)
      if (v && typeof v === 'object' && v.textOnly){
        col.classList.add('disabled');
        col.title = '';
        const span = document.createElement('span');
        span.className = 'acq-text';
        span.textContent = v.text || '';
        col.appendChild(span);
        row.appendChild(col);
        return;
      }
      // Backward compatibility: string combo
      col.dataset.combo = v;
      const clickable = isPersonaCombo(v);
      if (clickable){
        col.title = 'Combination detail';
      } else {
        col.classList.add('disabled');
        col.title = '';
      }
      col.appendChild(buildIconsForTokens(v));
      if (clickable){
        col.addEventListener('click', (e) => {
          const container = e.currentTarget.closest('.persona-acq-info');
          const rootPersonaKr = container ? container.dataset.personaKr : null;
          if (!rootPersonaKr) return;
          const combo = e.currentTarget.dataset.combo || '';
          openAcqModal();
          renderCombinationModal(rootPersonaKr, combo);
        });
      }
      row.appendChild(col);
    });
    return row;
  }

  function buildSection(){
    const wrap = document.createElement('div');
    wrap.className = 'persona-acq-info';
    const header = document.createElement('div');
    header.className = 'acq-header';
    const title = document.createElement('h3');
    title.textContent = i18nLabel('label');
    header.appendChild(title);
    wrap.appendChild(header);
    const body = document.createElement('div');
    body.className = 'acq-body';
    wrap.appendChild(body);
    return { wrap, body };
  }

  function ensureAcqModal(){
    if (document.getElementById('acqModal')) return;
    const modal = document.createElement('div');
    modal.id = 'acqModal';
    modal.className = 'skill-source-modal hidden';
    modal.innerHTML = `
      <div class="skill-source-backdrop" data-close="1"></div>
      <div class="skill-source-dialog" role="dialog" aria-modal="true">
        <div class="skill-source-header">
          <div class="skill-source-title-wrap">
            <div class="skill-source-title-row">
              <h3 id="acqModalTitle">Combination Detail</h3>
            </div>
          </div>
          <button class="skill-source-close" aria-label="Close" data-close="1">×</button>
        </div>
        <div class="skill-source-content" id="acqModalContent">Coming soon.</div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target.dataset.close === '1') closeAcqModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAcqModal(); });
  }
  function openAcqModal(){ ensureAcqModal(); const m = document.getElementById('acqModal'); m.classList.remove('hidden'); document.body.style.overflow='hidden'; }
  function closeAcqModal(){ const m = document.getElementById('acqModal'); if(!m) return; m.classList.add('hidden'); document.body.style.overflow=''; }

  // ---- Recursive breakdown for combinations ----
  function getEntryForPersona(krName){
    if (!acqMap) return null;
    const key = normalizeName(krName);
    let rec = acqMap[key];
    if (!rec){
      const compact = key.replace(/\s+/g,'');
      const foundKey = Object.keys(acqMap).find(k => k.replace(/\s+/g,'') === compact);
      if (foundKey) rec = acqMap[foundKey];
    }
    return rec || null;
  }

  function normalizeColorName(s){
    if (!s) return '';
    const v = s.toLowerCase();
    if (v === 'purlple') return 'purple';
    return v;
  }

  function parseEmblemToken(token){
    const m = token.match(/^(white|blue|purple|purlple|rainbow)\+(\d+)$/i);
    if (!m) return null;
    return { color: normalizeColorName(m[1]), amount: parseInt(m[2],10) || 0 };
  }

  function isMeropeToken(token){ return /^merope\+\d+$/i.test(token.trim()); }
  function isEventToken(token){ return /^event$/i.test(token.trim()); }
  function isGachaToken(token){ return /^gacha\+\d+$/i.test(token.trim()); }

  function splitTokens(combo){
    return (combo || '')
      .split('+')
      .map(s => s.trim())
      .filter(Boolean);
  }

  // choose combination for a persona: prefer emblem-containing combo; else first non-empty
  function chooseComboForPersona(entry){
    const combos = ['combination1','combination2','combination3']
      .map(k => (entry[k] || '').trim())
      .filter(Boolean);
    if (!combos.length) return '';
    // Detect emblem on raw string to handle cases like "white+50" which splitTokens() breaks into ["white","50"]
    const emblemFirst = combos.find(c => /(white|blue|purple|purlple|rainbow)\s*\+\s*\d+/i.test(c));
    return emblemFirst || combos[0];
  }

  function buildTree(rootKr, combo, visited){
    visited = visited || new Set();
    const node = { nameKr: rootKr, combo, children: [], totals:{ blue:0, purple:0, white:0, rainbow:0 } };
    // Split tokens and merge color+number pairs into emblem tokens
    const rawTokens = splitTokens(combo);
    const tokens = (function mergePairs(list){
      const out = [];
      for (let i=0;i<list.length;i++){
        const t = list[i];
        if (/^(white|blue|purple|purlple|rainbow)$/i.test(t) && i+1<list.length && /^\d+$/.test(list[i+1])){
          out.push(`${normalizeColorName(t)}+${list[i+1]}`);
          i++;
        } else if (/^merope$/i.test(t) && i+1<list.length && /^\d+$/.test(list[i+1])){
          out.push(`merope+${list[i+1]}`);
          i++;
        } else if (/^gacha$/i.test(t) && i+1<list.length && /^\d+$/.test(list[i+1])){
          out.push(`gacha+${list[i+1]}`);
          i++;
        } else {
          out.push(t);
        }
      }
      return out;
    })(rawTokens);
    // If current combo contains any emblem token, this node is terminal: accumulate and return
    const hasEmblemInCurrent = tokens.some(t => parseEmblemToken(t));
    if (hasEmblemInCurrent){
      for (const tk of tokens){
        const em = parseEmblemToken(tk);
        if (em){ node.totals[em.color] = (node.totals[em.color] || 0) + em.amount; }
      }
      return node;
    }
    for (const tk of tokens){
      const em = parseEmblemToken(tk);
      if (em){
        node.totals[em.color] = (node.totals[em.color] || 0) + em.amount;
        continue;
      }
      if (isMeropeToken(tk) || isEventToken(tk) || isGachaToken(tk)){
        // leaf stop (no emblem accumulation)
        continue;
      }
      // persona child
      const childKr = tk; // tokens in CSV are KR names for personas
      if (visited.has(childKr)) continue; // avoid cycles
      visited.add(childKr);
      const entry = getEntryForPersona(childKr);
      if (!entry){
        node.children.push({ nameKr: childKr, combo: '', children: [], totals:{ blue:0, purple:0, white:0, rainbow:0 } });
        visited.delete(childKr); // per-path only
        continue;
      }
      const nextCombo = chooseComboForPersona(entry);
      if (!nextCombo){
        node.children.push({ nameKr: childKr, combo: '', children: [], totals:{ blue:0, purple:0, white:0, rainbow:0 } });
        visited.delete(childKr); // per-path only
        continue;
      }
      // If next combo has any emblem token, stop recursion at that combo (still count emblem)
      const nextTokens = (function(){
        const r = splitTokens(nextCombo);
        const out=[];
        for (let i=0;i<r.length;i++){
          const t=r[i];
          if (/^(white|blue|purple|purlple|rainbow)$/i.test(t) && i+1<r.length && /^\d+$/.test(r[i+1])){ out.push(`${normalizeColorName(t)}+${r[i+1]}`); i++; }
          else if (/^gacha$/i.test(t) && i+1<r.length && /^\d+$/.test(r[i+1])){ out.push(`gacha+${r[i+1]}`); i++; }
          else out.push(t);
        }
        return out;
      })();
      const hasEmblem = nextTokens.some(t => parseEmblemToken(t));
      if (hasEmblem){
        const childNode = { nameKr: childKr, combo: nextCombo, children: [], totals:{ blue:0, purple:0, white:0, rainbow:0 } };
        for (const nt of nextTokens){
          const em2 = parseEmblemToken(nt);
          if (em2){ childNode.totals[em2.color] = (childNode.totals[em2.color] || 0) + em2.amount; }
        }
        node.children.push(childNode);
        visited.delete(childKr); // per-path only
      } else {
        const childTree = buildTree(childKr, nextCombo, visited);
        node.children.push(childTree);
        visited.delete(childKr); // per-path only
      }
    }
    // accumulate totals from children
    for (const ch of node.children){
      node.totals.blue += ch.totals.blue;
      node.totals.purple += ch.totals.purple;
      node.totals.white += ch.totals.white;
      node.totals.rainbow += ch.totals.rainbow;
    }
    return node;
  }

  function totalsLine(totals){
    const parts = [];
    if (totals.purple) parts.push(`Purple : ${totals.purple}`);
    if (totals.blue) parts.push(`Blue : ${totals.blue}`);
    if (totals.white) parts.push(`White : ${totals.white}`);
    if (totals.rainbow) parts.push(`Rainbow : ${totals.rainbow}`);
    return parts.join(' / ');
  }

  function renderTreeLines(node, indent){
    indent = indent || '';
    const lines = [];
    const name = getLocalizedName(node.nameKr);
    if (node.combo){
      const comboText = splitTokens(node.combo).map(n => {
        const em = parseEmblemToken(n);
        if (em) return `${em.color.charAt(0).toUpperCase()+em.color.slice(1)}+${em.amount}`;
        if (isMeropeToken(n)) return 'Merope';
        if (isEventToken(n)) return 'EVENT';
        if (isGachaToken(n)) return 'GACHA';
        return getLocalizedName(n);
      }).join(' + ');
      lines.push(`${indent}ㄴ ${name} : ${comboText}`);
    } else {
      lines.push(`${indent}ㄴ ${name}`);
    }
    const nextIndent = indent + '    ';
    for (const ch of node.children){
      lines.push(...renderTreeLines(ch, nextIndent));
    }
    return lines;
  }

  function renderCombinationModal(rootPersonaKr, combo){
    // Build tree and totals
    const tree = buildTree(rootPersonaKr, combo, new Set([rootPersonaKr]));
    const m = document.getElementById('acqModal');
    if (!m) return;
    // Build title with icons: [root persona icon+name] : [combo icons]
    const titleWrap = m.querySelector('#acqModalTitle');
    titleWrap.replaceChildren();
    titleWrap.appendChild(buildPersonaIconLabel(rootPersonaKr));
    const sep = document.createElement('span');
    sep.textContent = ' : ';
    sep.style.margin = '0 6px';
    sep.style.opacity = '0.8';
    titleWrap.appendChild(sep);
    // Reorder the root combo to match sorted children order
    const displayRootCombo = (tree.children && tree.children.length) ? (function(){
      // reuse the same helper defined below by temporarily creating a minimal facade
      // We'll call reorderComboByChildren once it's defined; for now, fallback to original
      return combo; 
    })() : combo;
    // icons will be replaced after reorder helper is available
    const rootIconsPlaceholder = buildIconsForTokens(displayRootCombo);
    rootIconsPlaceholder.id = 'acq-root-icons';
    titleWrap.appendChild(rootIconsPlaceholder);
    const area = m.querySelector('#acqModalContent');
    area.innerHTML = '';
    // Totals bar with emblem icons
    const totalsBar = document.createElement('div');
    totalsBar.className = 'acq-totals';
    const totalsIcons = document.createElement('span');
    totalsIcons.className = 'acq-icons';
    // In KR, treat white as blue for totals display
    const totalsForDisplay = { ...tree.totals };
    if (getCurrentLang() === 'kr'){
      totalsForDisplay.blue = (totalsForDisplay.blue || 0) + (totalsForDisplay.white || 0);
      totalsForDisplay.white = 0;
    }
    ['purple','blue','white','rainbow'].forEach(color => {
      const amount = totalsForDisplay[color] || 0;
      if (!amount) return;
      const emblem = buildIconForEmblem(`${color}+${amount}`);
      if (emblem) totalsIcons.appendChild(emblem);
    });
    totalsBar.appendChild(totalsIcons);
    area.appendChild(totalsBar);
    // Tree explorer
    const treeWrap = document.createElement('div');
    treeWrap.className = 'acq-tree';
    area.appendChild(treeWrap);
    // Ads removed: no ad injection inside acquisition modal
    // helper to compute subtree depth (number of edges); leaves have depth 0
    const depthOf = (n) => {
      if (!n.children || n.children.length === 0) return 0;
      let maxd = 0;
      for (const ch of n.children){
        const d = depthOf(ch);
        if (d > maxd) maxd = d;
      }
      return 1 + maxd;
    };

    // Reorder combo tokens to match provided children order (personas only), keeping non-persona tokens after
    const reorderComboByChildren = (node, orderedChildren) => {
      if (!node || !node.combo) return node ? node.combo : '';
      const raw = splitTokens(node.combo);
      // merge emblem and merope numeric pairs
      const tokens = (function mergePairs(list){
        const out = [];
        for (let i=0;i<list.length;i++){
          const t = list[i];
          if (/^(white|blue|purple|purlple|rainbow)$/i.test(t) && i+1<list.length && /^\d+$/.test(list[i+1])){ out.push(`${normalizeColorName(t)}+${list[i+1]}`); i++; }
          else if (/^merope$/i.test(t) && i+1<list.length && /^\d+$/.test(list[i+1])){ out.push(`merope+${list[i+1]}`); i++; }
          else { out.push(t); }
        }
        return out;
      })(raw);
      const isPersona = (tk) => tk && !/^\d+$/.test(tk) && !parseEmblemToken(tk) && !isMeropeToken(tk) && !isEventToken(tk);
      const personaTokens = tokens.filter(isPersona);
      const others = tokens.filter(tk => !isPersona(tk));
      const childrenArr = orderedChildren || node.children || [];
      if (childrenArr.length === 0 || personaTokens.length <= 1) return tokens.join('+');
      // order persona tokens by children name order
      const orderNames = childrenArr.map(c => c.nameKr);
      const used = new Set();
      const orderedPersonas = [];
      for (const name of orderNames){
        const idx = personaTokens.findIndex(t => t === name && !used.has(t+"@"+personaTokens.indexOf(t)));
        if (idx !== -1){
          orderedPersonas.push(personaTokens[idx]);
          used.add(personaTokens[idx]+"@"+idx);
        }
      }
      // append remaining persona tokens in original order (if any didn't match children exactly)
      personaTokens.forEach((t, i) => {
        const key = t+"@"+i;
        if (!Array.from(used).includes(key)) orderedPersonas.push(t);
      });
      return [...orderedPersonas, ...others].join('+');
    };

    // After helpers are defined, update the title icons using reordered combo
    try{
      const rootIcons = document.getElementById('acq-root-icons');
      if (rootIcons){
        const sortedRootChildren = (tree.children && tree.children.length)
          ? [...tree.children].sort((a,b) => depthOf(a) - depthOf(b))
          : [];
        const reordered = (sortedRootChildren.length)
          ? reorderComboByChildren(tree, sortedRootChildren)
          : combo;
        const newIcons = buildIconsForTokens(reordered);
        newIcons.id = 'acq-root-icons';
        rootIcons.replaceWith(newIcons);
      }
    }catch(_){ /* ignore */ }

    const renderNode = (node, parentEl, expanded) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'acq-node';
      const header = document.createElement('div');
      header.className = 'acq-node-header';
      const toggle = document.createElement('span');
      toggle.className = 'acq-node-toggle';
      const childrenExist = node.children && node.children.length > 0;
      if (childrenExist){ toggle.appendChild(makeChevron(expanded)); } else { toggle.textContent = '-'; header.classList.add('no-children'); }
      const label = document.createElement('span');
      label.className = 'acq-node-label';
      // Name
      label.appendChild(buildPersonaIconLabel(node.nameKr));
      // Combo icons (if any)
      if (node.combo){
        const sep = document.createElement('span'); sep.textContent = ':'; sep.style.opacity='0.6'; sep.style.margin='0 4px';
        label.appendChild(sep);
        const displayCombo = childrenExist ? reorderComboByChildren(node) : node.combo;
        const icons = buildIconsForTokens(displayCombo);
        label.appendChild(icons);
      }
      header.appendChild(toggle);
      header.appendChild(label);
      nodeEl.appendChild(header);
      const childrenEl = document.createElement('div');
      childrenEl.className = 'acq-node-children';
      if (!expanded) childrenEl.style.display = 'none';
      nodeEl.appendChild(childrenEl);
      if (childrenExist){
        // sort children so shallower trees appear first
        const sortedChildren = [...node.children].sort((a,b) => depthOf(a) - depthOf(b));
        // Update the combo label to match this sorted order
        const displayCombo = reorderComboByChildren(node, sortedChildren);
        // replace existing icons in label to reflect new order
        // Find the last child of label (icons span)
        const iconsContainer = label.querySelector('.acq-icons');
        if (iconsContainer){
          const newIcons = buildIconsForTokens(displayCombo);
          newIcons.className = 'acq-icons';
          iconsContainer.replaceWith(newIcons);
        }
        sortedChildren.forEach(ch => renderNode(ch, childrenEl, true));
      }
      header.addEventListener('click', () => {
        if (!childrenExist) return;
        const isOpen = childrenEl.style.display !== 'none';
        childrenEl.style.display = isOpen ? 'none' : '';
        toggle.replaceChildren(makeChevron(!isOpen));
      });
      parentEl.appendChild(nodeEl);
    };
    // Re-apply title icons after tree render to guarantee order matches sorted root children
    try{
      const rootIcons = document.getElementById('acq-root-icons');
      if (rootIcons){
        const sortedRootChildren = (tree.children && tree.children.length)
          ? [...tree.children].sort((a,b) => depthOf(a) - depthOf(b))
          : [];
        const reordered = (sortedRootChildren.length)
          ? reorderComboByChildren(tree, sortedRootChildren)
          : combo;
        const newIcons = buildIconsForTokens(reordered);
        newIcons.id = 'acq-root-icons';
        rootIcons.replaceWith(newIcons);
      }
    }catch(_){ /* ignore */ }

    // Open all by default
    renderNode(tree, treeWrap, true);
    // Lock modal content height to initial expanded height; allow scroll past max
    area.style.overflow = 'auto';
    area.style.maxHeight = '70vh';
    requestAnimationFrame(() => {
      const maxPx = Math.floor(window.innerHeight * 0.7);
      const h = Math.min(area.scrollHeight, maxPx);
      area.style.minHeight = h + 'px';
    });
  }

  function findAddedText(personaKrName){
    try{
      const store = (typeof window !== 'undefined' && window.personaFiles && Object.keys(window.personaFiles).length)
        ? window.personaFiles
        : (typeof personaData === 'object' && personaData ? personaData : null);
      if (!store) return '';
      // Direct key
      if (store[personaKrName] && store[personaKrName].added){
        return String(store[personaKrName].added);
      }
      // Normalized lookup
      const norm = normalizeName(personaKrName);
      const key = Object.keys(store).find(k => normalizeName(k) === norm);
      if (key && store[key] && store[key].added){
        return String(store[key].added);
      }
    }catch(_){ /* ignore */ }
    return '';
  }

  async function populate(container, personaKrName){
    try{ await loadAcqMap(); }catch(_){ /* ignore */ }
    const body = container.querySelector('.acq-body');
    if (!body) return;
    body.innerHTML = '';
    ensureAcqStyles();
    // Normalize lookup to tolerate minor differences
    const normName = normalizeName(personaKrName);
    let entry = acqMap ? acqMap[normName] : null;
    if (!entry && acqMap){
      // Fallback: try removing all spaces (handles half/full-width and multi spaces)
      const compact = normName.replace(/\s+/g,'');
      const foundKey = Object.keys(acqMap).find(k => k.replace(/\s+/g,'') === compact);
      if (foundKey) entry = acqMap[foundKey];
    }
    if (!entry){
      // Hide section entirely when no data
      container.style.display = 'none';
      // Debug once per miss to help diagnose mismatches
      if (typeof console !== 'undefined' && console.debug){
        console.debug('[Acq] Missing acquisition entry for persona name:', personaKrName, 'normalized:', normName);
      }
      return;
    }
    const combos = ['combination1','combination2','combination3']
      .map(k => entry[k])
      .map(v => (v || '').trim())
      .filter(Boolean);
    // Append persona.js added text as an extra acquisition if exists
    const addedText = findAddedText(personaKrName);
    if (addedText){
      combos.push({ textOnly: true, text: addedText });
    }
    if (combos.length){
      body.appendChild(renderRowGroup(combos));
      container.style.display = '';
    } else {
      // Hide section entirely when no combos
      container.style.display = 'none';
    }
  }

  function insertAfter(newNode, referenceNode){ referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); }

  // Public API
  const Acquisition = {
    async renderInto(infoSectionEl, personaKrName){
      const { wrap } = buildSection();
      // store persona name on container for later modal rendering
      wrap.dataset.personaKr = personaKrName;
      // Preferred: place below persona-recommended-skills; fallback to skill-highlight-container; else header
      const placePreferred = () => {
        const target = infoSectionEl.querySelector('.persona-recommended-skills') || infoSectionEl.querySelector('.skill-highlight-container');
        if (target){ insertAfter(wrap, target); return true; }
        return false;
      };
      if (!placePreferred()){
        // Temporary placement above; will move when target appears
        const header = infoSectionEl.querySelector('.persona-header-info');
        if (header){ insertAfter(wrap, header); }
        else { infoSectionEl.prepend(wrap); }
        const observer = new MutationObserver(() => {
          if (placePreferred()){
            observer.disconnect();
          }
        });
        observer.observe(infoSectionEl, { childList: true, subtree: true });
        // Safety timeout to stop observing after 5s
        setTimeout(() => observer.disconnect(), 5000);
      }
      await populate(wrap, personaKrName);
      return wrap;
    },
    async populate(container, personaKrName){ await populate(container, personaKrName); }
  };

  if (typeof window !== 'undefined') window.Acquisition = Acquisition;
})();

// Helper: normalization function (kept outside IIFE scope is fine for readability)
function normalizeName(s){
  if (typeof s !== 'string') return '';
  try{
    return s
      .replace(/[\u200B\u200C\u200D\uFEFF]/g,'') // zero-width + BOM
      .replace(/\u3000/g,' ') // full-width space to half-width
      .normalize('NFC')
      .trim()
      .replace(/\s+/g,' ');
  }catch(_){
    // In environments without String.prototype.normalize
    return s.replace(/[\u200B\u200C\u200D\uFEFF]/g,'').replace(/\u3000/g,' ').trim().replace(/\s+/g,' ');
  }
}
