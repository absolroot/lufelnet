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
        const inProgressCount = segments.reduce((s,seg)=> s + ((seg && seg.fivestar==null) ? ((Array.isArray(seg.record)? seg.record.length:0)) : 0), 0);
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
        const effectivePulled = Math.max(0, pulled - inProgressCount);
        return { pulledSum: pulled, total5Star: t5, total4Star: t4, win5050, avgPity, inProgressCount, effectivePulled };
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
        const gidToSegIndex = new Map(); // gachaId -> outSegs index
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
            const idx = outSegs.length;
            outSegs.push({ fivestar: seg?.fivestar ? { ...seg.fivestar } : null, lastTimestamp: Number(seg?.lastTimestamp || 0), record: cloned });
            for (const r of cloned){ if (r.gachaId) gidToSegIndex.set(String(r.gachaId), idx); }
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
            // 2-1) 교집합 기반 병합: incoming의 gachaId가 기존 세그먼트에 존재하면 해당 세그먼트로 병합
            let targetIdx = -1;
            for (const r of incomingCloned){ if (r.gachaId && gidToSegIndex.has(String(r.gachaId))) { targetIdx = gidToSegIndex.get(String(r.gachaId)); break; } }
            if (targetIdx >= 0){
                const target = outSegs[targetIdx];
                const existing = Array.isArray(target?.record) ? target.record.slice() : [];
                const byId = new Map();
                for (const r of existing){ if (r.gachaId) byId.set(String(r.gachaId), r); }
                for (const r of incomingCloned){
                    const gid = r.gachaId ? String(r.gachaId) : null;
                    if (!gid || !byId.has(gid)) { existing.push(r); if (gid) byId.set(gid, r); }
                }
                // 결정적 정렬: timestamp asc, tsOrder asc(없으면 무한대), gachaId asc
                existing.sort((a,b)=>{
                    const ta = Number(a.timestamp||0), tb = Number(b.timestamp||0);
                    if (ta !== tb) return ta - tb;
                    const oa = (a.tsOrder!=null)?Number(a.tsOrder):Infinity;
                    const ob = (b.tsOrder!=null)?Number(b.tsOrder):Infinity;
                    if (oa !== ob) return oa - ob;
                    const ga = String(a.gachaId||'');
                    const gb = String(b.gachaId||'');
                    if (ga !== gb) return ga < gb ? -1 : 1;
                    return 0;
                });
                // 같은 timestamp 묶음에 tsOrder 재시드
                const perTs = new Map();
                for (const r of existing){ const ts = Number(r.timestamp||0); const idx = perTs.get(ts)||0; r.tsOrder = idx; perTs.set(ts, idx+1); }
                // 메타 재계산
                let maxTs = 0, minTs = Number.MAX_SAFE_INTEGER; let fv = null;
                for (const r of existing){ const ts = Number(r.timestamp||0); if (ts > maxTs) maxTs = ts; if (ts < minTs) minTs = ts; if (!fv && Number(r.grade)===5) fv = { ...r }; }
                outSegs[targetIdx] = { fivestar: fv, lastTimestamp: maxTs, firstTimestamp: (minTs===Number.MAX_SAFE_INTEGER?0:minTs), record: existing, times: existing.length };
                for (const r of existing){ if (r.gachaId){ seen.add(r.gachaId); gidToSegIndex.set(String(r.gachaId), targetIdx); } }
                continue;
            }
            for (const obj of incomingCloned){
                if (obj.gachaId && seen.has(obj.gachaId)) continue; // ID-based dedupe only
                let target = null;
                if (outSegs.length > 0) {
                    const last = outSegs[outSegs.length - 1];
                    // 진행 중이며 시간 연속성이 있을 때만 이어붙임
                    const firstTsOfIncoming = Number((Array.isArray(seg?.record) && seg.record.length>0 ? (seg.record[0]?.timestamp||seg.record[0]?.time||seg.record[0]?.ts) : 0) || 0);
                    if (last.fivestar == null && firstTsOfIncoming >= Number(last.lastTimestamp||0)) target = last;
                }
                if (!target){ outSegs.push({ fivestar: null, lastTimestamp: 0, record: [] }); target = outSegs[outSegs.length - 1]; }
                appendRec(target, obj);
                if (obj.gachaId){ seen.add(obj.gachaId); gidToSegIndex.set(String(obj.gachaId), outSegs.length - 1); }
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


