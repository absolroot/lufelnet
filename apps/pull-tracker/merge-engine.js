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

        // Helper: clone record and normalize
        const cloneRec = (r) => {
            const t = Number(r?.timestamp ?? r?.time ?? r?.ts ?? 0) || 0;
            const gid = (r?.gachaId != null) ? String(r.gachaId) : null;
            const obj = { ...r, gachaId: gid, timestamp: (r.timestamp != null ? r.timestamp : t) };
            return obj;
        };

        // 1) Start from existing segments (deep copy) and build seen set
        const outSegs = [];
        const seen = new Set();
        for (const seg of oldSegs){
            const recs = Array.isArray(seg?.record) ? seg.record : [];
            const cloned = recs.map(cloneRec);
            // fill missing tsOrder per timestamp in this existing segment
            const perTs = new Map();
            for (const r of cloned){
                const ts = Number(r.timestamp||0);
                if (r.tsOrder == null){ const idx = perTs.get(ts)||0; perTs.set(ts, idx+1); r.tsOrder = idx; }
                if (r.gachaId) seen.add(r.gachaId);
            }
            outSegs.push({ fivestar: seg?.fivestar ? { ...seg.fivestar } : null, lastTimestamp: Number(seg?.lastTimestamp || 0), record: cloned });
        }

        // 2) Append new records sequentially
        const perSegTs = new Map(); // Map<segObj, Map<ts, nextIdx>>
        const seedSegTs = (seg) => {
            if (perSegTs.has(seg)) return;
            const m = new Map();
            try {
                for (const r of (seg.record||[])){
                    const ts = Number(r.timestamp||0);
                    const cur = m.get(ts)||0;
                    const ord = Number(r.tsOrder);
                    if (Number.isFinite(ord)) {
                        m.set(ts, Math.max(cur, ord+1));
                    } else {
                        m.set(ts, cur+1);
                    }
                }
            } catch(_) {}
            perSegTs.set(seg, m);
        };
        const nextIdxForTs = (seg, ts) => {
            seedSegTs(seg);
            const m = perSegTs.get(seg);
            const cur = m.get(ts)||0; m.set(ts, cur+1); return cur;
        };
        const appendRec = (seg, rec) => {
            const ts = Number(rec.timestamp||0);
            if (rec.tsOrder == null) rec.tsOrder = nextIdxForTs(seg, ts);
            seg.record.push(rec);
            seg.lastTimestamp = Math.max(Number(seg.lastTimestamp||0), ts);
            if (seg.fivestar == null && Number(rec.grade) === 5) seg.fivestar = { ...rec };
        };

        // process new segments by time
        const sortedNew = newSegs.slice().map(seg => ({ seg, firstTs: (() => { const arr = Array.isArray(seg?.record) ? seg.record : []; if (arr.length === 0) return 0; return Number(arr[0]?.timestamp || arr[0]?.time || arr[0]?.ts || 0) || 0; })() })).sort((a,b)=> a.firstTs - b.firstTs);
        for (const { seg } of sortedNew){
            const recs = Array.isArray(seg?.record) ? seg.record : [];
            const incomingCloned = recs.map(cloneRec);
            const incomingIdSet = new Set();
            for (const r of incomingCloned){ if (r.gachaId) incomingIdSet.add(r.gachaId); }
            let replaced = false;
            if (incomingIdSet.size > 0 && outSegs.length > 0){
                let targetIdx = -1; let targetLen = 0;
                for (let i = outSegs.length - 1; i >= 0; i--){
                    const segRec = Array.isArray(outSegs[i]?.record) ? outSegs[i].record : [];
                    const oldIdSet = new Set();
                    for (const r of segRec){ if (r?.gachaId) oldIdSet.add(String(r.gachaId)); }
                    let isSubset = true;
                    for (const gid of oldIdSet){ if (!incomingIdSet.has(gid)) { isSubset = false; break; } }
                    if (isSubset){ targetIdx = i; targetLen = segRec.length; break; }
                }
                if (targetIdx >= 0 && incomingCloned.length > targetLen){
                    // tsOrder 보정: 동일 timestamp 내 입력 순서대로
                    const perTs = new Map();
                    for (const r of incomingCloned){ const ts = Number(r.timestamp||0); if (r.tsOrder == null){ const idx = perTs.get(ts)||0; r.tsOrder = idx; perTs.set(ts, idx+1); } }
                    // fivestar 계산
                    let fv = seg?.fivestar ? { ...seg.fivestar } : null;
                    if (!fv){ for (const r of incomingCloned){ if (Number(r.grade)===5){ fv = { ...r }; break; } } }
                    // timestamp 메타
                    let maxTs = 0, minTs = Number.MAX_SAFE_INTEGER;
                    for (const r of incomingCloned){ const ts = Number(r.timestamp||0); if (ts > maxTs) maxTs = ts; if (ts < minTs) minTs = ts; }
                    outSegs[targetIdx] = { fivestar: fv, lastTimestamp: maxTs, firstTimestamp: (minTs===Number.MAX_SAFE_INTEGER?0:minTs), record: incomingCloned, times: incomingCloned.length };
                    for (const r of incomingCloned){ if (r.gachaId) seen.add(r.gachaId); }
                    replaced = true;
                }
            }
            if (replaced) continue;
            for (const obj of incomingCloned){
                if (obj.gachaId && seen.has(obj.gachaId)) continue; // ID-based dedupe only
                let target = null;
                if (outSegs.length > 0) {
                    const last = outSegs[outSegs.length - 1];
                    if (last.fivestar == null) target = last; // 항상 진행 중 세그먼트에 이어 붙임
                }
                if (!target){ outSegs.push({ fivestar: null, lastTimestamp: 0, record: [] }); target = outSegs[outSegs.length - 1]; }
                appendRec(target, obj);
                if (obj.gachaId) seen.add(obj.gachaId);
            }
        }

        // 3) Finalize segment metadata
        for (const seg of outSegs){
            // recalc lastTimestamp and firstTimestamp for safety
            let maxTs = 0, minTs = Number.MAX_SAFE_INTEGER;
            for (const r of (seg.record||[])){
                const ts = Number(r.timestamp||0);
                if (ts > maxTs) maxTs = ts;
                if (ts < minTs) minTs = ts;
            }
            seg.lastTimestamp = maxTs;
            seg.firstTimestamp = (minTs===Number.MAX_SAFE_INTEGER?0:minTs);
            seg.times = Array.isArray(seg.record) ? seg.record.length : 0;
        }

        const summary = recomputeSummary(outSegs);
        return { summary, records: outSegs };
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


