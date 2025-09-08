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
        const loseSet = (typeof window !== 'undefined' && Array.isArray(window.LOSE_5050_LIST)) ? new Set(window.LOSE_5050_LIST.map((v)=>Number(v))) : null;
        for (const seg of segments){
            for (const r of (seg.record||[])){
                if (Number(r.grade)===5) {
                    t5++;
                    // 50:50 판정: LOSE_5050_LIST에 포함되면 패배, 아니면 승리
                    try {
                        const idNum = Number(r.id);
                        if (loseSet && Number.isFinite(idNum)) {
                            if (!loseSet.has(idNum)) win5050++;
                        }
                    } catch(_) {}
                } else if (Number(r.grade)===4) {
                    t4++;
                }
            }
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
                    const timestamp = Number(r?.timestamp||0);
                    if (!timestamp) continue;
                    // 원본 레코드 객체를 보존
                    rows.push({ raw: { ...r }, timestamp, gachaId: r?.gachaId != null ? String(r.gachaId) : null });
                }
            }
        };
        pushRowsFromSegs(oldSegs);
        pushRowsFromSegs(newSegs);
        // 정렬 및 중복 제거 (gachaId 우선)
        rows.sort((a,b)=> a.timestamp - b.timestamp);
        const seenById = new Set();
        const seenFallback = new Set();
        const uniq = [];
        for (const r of rows){
            const raw = r.raw || {};
            if (r.gachaId){ if (seenById.has(r.gachaId)) continue; seenById.add(r.gachaId); uniq.push(r); }
            else { const key = `${r.timestamp}|${raw.name}|${raw.grade}`; if (seenFallback.has(key)) continue; seenFallback.add(key); uniq.push(r); }
        }
        // 시간순으로 세그먼트 재구성: 5★가 나오면 세그먼트 종료
        const segments = []; let curSeg = { fivestar: null, lastTimestamp: 0, record: [] };
        for (const r of uniq){
            const rec = { ...r.raw };
            curSeg.record.push(rec);
            curSeg.lastTimestamp = r.timestamp;
            if (Number(rec.grade) === 5 && curSeg.fivestar == null) {
                curSeg.fivestar = { name: rec.name, timestamp: rec.timestamp };
                segments.push(curSeg);
                curSeg = { fivestar: null, lastTimestamp: 0, record: [] };
            }
        }
        if (curSeg.record.length > 0) { segments.push(curSeg); }
        const summary = recomputeSummary(segments);
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


