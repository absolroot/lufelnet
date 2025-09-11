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
        const pushSegs = (segs, source) => {
            for (const seg of segs){
                // 같은 timestamp(=같은 10연차)에서 나오는 정상 중복을 보존하기 위해
                // timestamp별 순번 인덱스를 부여한다.
                const perTsIdx = new Map();
                const recs = Array.isArray(seg?.record) ? seg.record : [];
                for (const r of recs){
                    const t  = Number(r?.timestamp ?? r?.time ?? r?.ts ?? 0);
                    if (!t) continue;
                    const gid = (r?.gachaId != null) ? String(r.gachaId) : null;
                    const idx = perTsIdx.get(t) || 0;
                    perTsIdx.set(t, idx + 1);
                    rows.push({ raw: { ...r }, timestamp: t, gachaId: gid, idx, source });
                }
            }
        };
        pushSegs(oldSegs, 'old');
        pushSegs(newSegs, 'new');

        // 안정 정렬: timestamp 오름차순 → 같은 timestamp는 입력 순서(idx)
        rows.sort((a,b)=> (a.timestamp - b.timestamp) || (a.idx - b.idx));

        // "ID만" 기준으로 중복 제거. ID가 없으면 절대 dedupe 하지 않음.
        const seenById = new Set();
        const uniq = [];
        for (const r of rows){
            if (r.gachaId){
                if (seenById.has(r.gachaId)) continue;
                seenById.add(r.gachaId);
            }
            uniq.push(r);
        }

        // 시간순으로 세그먼트 재구성: 5★가 나오면 세그먼트 종료
        const segments = []; let curSeg = { fivestar: null, lastTimestamp: 0, record: [] };
        for (const r of uniq){
            const rec = { ...r.raw, gachaId: r.gachaId };
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


