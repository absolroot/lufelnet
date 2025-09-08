(() => {
    function getMergedCache(){
        try { const s = localStorage.getItem('pull-tracker:merged'); if (!s) return null; return JSON.parse(s); } catch(_) { return null; }
    }
    function ensureSchema(payload){
        if (payload && payload.data) return payload;
        return { version: 1, updatedAt: Date.now(), data: (payload && payload.data) ? payload.data : payload };
    }
    function recomputeSummary(segments){
        const pulled = segments.reduce((s,seg)=> s + (Array.isArray(seg.record)? seg.record.length:0), 0);
        let t5=0, t4=0, win5050=0;
        for (const seg of segments){
            for (const r of (seg.record||[])){
                if (Number(r.grade)===5) t5++; else if (Number(r.grade)===4) t4++;
            }
            // 50:50 추정: 운명/무기 타입 등에서 seg.fivestar가 한정인지 판별이 필요하지만
            // 서버에서 정확한 카운트를 제공하지 않으므로 여기서는 보수적으로 0 유지
        }
        let pitySum=0, pityCnt=0; let pity=0;
        for (const seg of segments){
            for (const r of (seg.record||[])){
                pity++;
                if (Number(r.grade)===5){ pitySum += pity; pityCnt++; pity=0; }
            }
        }
        const avgPity = pityCnt>0 ? (pitySum/pityCnt) : null;
        return { pulledSum: pulled, total5Star: t5, total4Star: t4, win5050, avgPity };
    }
    function mergeTypeBlock(oldBlock, newBlock){
        const oldSegs = Array.isArray(oldBlock?.records) ? oldBlock.records : [];
        const newSegs = Array.isArray(newBlock?.records) ? newBlock.records : [];
        const rows = [];
        const pushRowsFromSegs = (segs)=>{
            for (const seg of segs){
                const recs = Array.isArray(seg?.record) ? seg.record : [];
                for (const r of recs){
                    const name = String(r?.name||'');
                    const grade = Number(r?.grade||0);
                    const timestamp = Number(r?.timestamp||0);
                    const gachaId = r?.gachaId != null ? String(r.gachaId) : null;
                    if (!timestamp) continue;
                    rows.push({ name, grade, timestamp, gachaId });
                }
            }
        };
        pushRowsFromSegs(oldSegs);
        pushRowsFromSegs(newSegs);
        rows.sort((a,b)=> (a.timestamp-b.timestamp) || (b.grade-a.grade) || String(a.name).localeCompare(String(b.name)) );
        const seenById = new Set();
        const seenFallback = new Set();
        const uniq = [];
        for (const r of rows){
            if (r.gachaId){ if (seenById.has(r.gachaId)) continue; seenById.add(r.gachaId); uniq.push(r); }
            else { const key = `${r.timestamp}|${r.name}|${r.grade}`; if (seenFallback.has(key)) continue; seenFallback.add(key); uniq.push(r); }
        }
        const msDay = 24*60*60*1000;
        const groups = []; let cur = [];
        for (let i=0;i<uniq.length;i++){
            const r = uniq[i];
            if (cur.length===0) { cur.push(r); continue; }
            const prev = cur[cur.length-1];
            if (Math.abs(r.timestamp - prev.timestamp) > 90*msDay) { groups.push(cur); cur = [r]; }
            else cur.push(r);
        }
        if (cur.length>0) groups.push(cur);
        const segments = [];
        for (const g of groups){
            const seg = { fivestar: null, lastTimestamp: g[g.length-1].timestamp, record: g.map(r=> ({ name:r.name, grade:r.grade, timestamp:r.timestamp, gachaId:r.gachaId })) };
            const idx5 = g.findIndex(r=> Number(r.grade)===5);
            if (idx5 >= 0) { const r5 = g[idx5]; seg.fivestar = { name: r5.name, timestamp: r5.timestamp }; }
            segments.push(seg);
        }
        const computed = recomputeSummary(segments);
        // 외부에서 제공된 요약(클라우드 summary_overall 등)이 있으면 우선 사용
        const provided = (newBlock && newBlock.summary) ? newBlock.summary : null;
        const summary = {
            pulledSum: (provided && typeof provided.pulledSum === 'number') ? provided.pulledSum : computed.pulledSum,
            total5Star: (provided && typeof provided.total5Star === 'number') ? provided.total5Star : computed.total5Star,
            total4Star: (provided && typeof provided.total4Star === 'number') ? provided.total4Star : computed.total4Star,
            win5050: (provided && typeof provided.win5050 === 'number') ? provided.win5050 : computed.win5050,
            avgPity: (provided && (provided.avgPity!=null)) ? provided.avgPity : computed.avgPity,
            effTotal: (provided && typeof provided.effTotal === 'number') ? provided.effTotal : undefined
        };
        return { summary, records: segments };
    }
    function mergeWithCache(incoming){
        try {
            const base = ensureSchema(getMergedCache()) || null;
            const next = ensureSchema(incoming);
            const out = { version: 1, updatedAt: Date.now(), data: {} };
            const keys = ['Confirmed','Fortune','Weapon','Gold','Newcomer'];
            for (const k of keys){ out.data[k] = mergeTypeBlock((base?base.data[k]:null), next.data[k]); }
            return out;
        } catch(_) { return incoming; }
    }
    // expose
    window.mergeWithCache = mergeWithCache;
})();


