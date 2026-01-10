/**
 * record-manager.js
 * 레코드 추가/수정/삭제 및 데이터 조작 로직
 */
(() => {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // 유틸리티 (merge-engine.js 의존)
    // ─────────────────────────────────────────────────────────────

    // 결정적 정렬: timestamp asc → tsOrder asc → gachaId asc
    function sortRecordsDeterministic(arr) {
        return arr.sort((a, b) => {
            const ta = Number(a?.timestamp || 0), tb = Number(b?.timestamp || 0);
            if (ta !== tb) return ta - tb;
            const oa = (a && a.tsOrder != null) ? Number(a.tsOrder) : ((a && a.ts_order != null) ? Number(a.ts_order) : Infinity);
            const ob = (b && b.tsOrder != null) ? Number(b.tsOrder) : ((b && b.ts_order != null) ? Number(b.ts_order) : Infinity);
            if (oa !== ob) return oa - ob;
            const ga = String(a?.gachaId || '');
            const gb = String(b?.gachaId || '');
            return ga < gb ? -1 : ga > gb ? 1 : 0;
        });
    }

    // 같은 timestamp 내 tsOrder 재할당
    function reindexTsOrder(records) {
        const perTs = new Map();
        for (const r of records) {
            const ts = Number(r?.timestamp || 0) || 0;
            const idx = perTs.get(ts) || 0;
            r.tsOrder = idx;
            r.ts_order = idx;
            perTs.set(ts, idx + 1);
        }
    }

    // 세그먼트 메타 재계산
    function recalcSegmentMeta(seg) {
        let maxTs = 0, minTs = Number.MAX_SAFE_INTEGER;
        let fv = null;
        for (const r of (seg.record || [])) {
            const ts = Number(r.timestamp || 0);
            if (ts > maxTs) maxTs = ts;
            if (ts < minTs) minTs = ts;
            if (!fv && Number(r.grade) === 5) fv = { ...r };
        }
        seg.lastTimestamp = maxTs;
        seg.firstTimestamp = (minTs === Number.MAX_SAFE_INTEGER ? 0 : minTs);
        seg.fivestar = (seg.fivestar == null ? fv : seg.fivestar) || fv;
        seg.times = Array.isArray(seg.record) ? seg.record.length : 0;
    }

    // LOSE_5050_LIST 접근
    function getLoseSet() {
        if (typeof window !== 'undefined' && Array.isArray(window.LOSE_5050_LIST)) {
            return new Set(window.LOSE_5050_LIST.map(v => Number(v)));
        }
        return null;
    }

    // summary 재계산 (manualPity 지원)
    function recomputeSummary(segments) {
        const pulled = segments.reduce((s, seg) => s + (Array.isArray(seg.record) ? seg.record.length : 0), 0);
        const inProgressCount = segments.reduce((s, seg) => s + ((seg && seg.fivestar == null) ? ((Array.isArray(seg.record) ? seg.record.length : 0)) : 0), 0);
        let t5 = 0, t4 = 0, win5050 = 0;
        const loseSet = getLoseSet();

        for (const seg of segments) {
            for (const r of (seg.record || [])) {
                if (Number(r.grade) === 5) {
                    t5++;
                    // 50:50 판정
                    try {
                        const idNum = Number(r.id);
                        if (loseSet && Number.isFinite(idNum)) {
                            if (!loseSet.has(idNum)) win5050++;
                        }
                    } catch (_) { }
                } else if (Number(r.grade) === 4) {
                    t4++;
                }
            }
        }

        // pity 계산 (manualPity 우선 적용)
        let pitySum = 0, pityCnt = 0, pity = 0;
        for (const seg of segments) {
            for (const r of (seg.record || [])) {
                pity++;
                if (Number(r.grade) === 5) {
                    // manualPity가 있으면 그 값 사용
                    if (r.manualPity != null && isManualRecord(r)) {
                        pitySum += r.manualPity;
                    } else {
                        pitySum += pity;
                    }
                    pityCnt++;
                    pity = 0;
                }
            }
        }
        const avgPity = pityCnt > 0 ? (pitySum / pityCnt) : null;
        const effectivePulled = Math.max(0, pulled - inProgressCount);

        return { pulledSum: pulled, total5Star: t5, total4Star: t4, win5050, avgPity, inProgressCount, effectivePulled };
    }

    function isManualRecord(record) {
        return String(record?.gachaId || '').startsWith('manual-');
    }

    // ─────────────────────────────────────────────────────────────
    // 데이터 로드/저장
    // ─────────────────────────────────────────────────────────────

    function loadPayload() {
        try {
            const s = localStorage.getItem('pull-tracker:merged');
            if (!s) return null;
            return JSON.parse(s);
        } catch (_) { return null; }
    }

    function savePayload(payload) {
        try {
            payload.updatedAt = Date.now();
            localStorage.setItem('pull-tracker:merged', JSON.stringify(payload));
            return true;
        } catch (_) { return false; }
    }

    // ─────────────────────────────────────────────────────────────
    // 레코드 추가
    // ─────────────────────────────────────────────────────────────

    function addRecord(record, panelKey) {
        const payload = loadPayload();
        if (!payload || !payload.data) return false;

        const block = payload.data[panelKey];
        if (!block) return false;

        if (!Array.isArray(block.records)) {
            block.records = [];
        }

        const grade = Number(record.grade || 5);

        if (grade === 5) {
            // 5★: 새 세그먼트 생성
            const newSeg = {
                fivestar: {
                    name: record.name,
                    timestamp: record.timestamp
                },
                lastTimestamp: record.timestamp,
                firstTimestamp: record.timestamp,
                record: [record]
            };
            block.records.push(newSeg);
        } else {
            // 4★: 진행 중인 세그먼트(fivestar=null)에 추가, 없으면 새로 생성
            let targetSeg = block.records.find(seg => seg && seg.fivestar == null);
            if (!targetSeg) {
                targetSeg = {
                    fivestar: null,
                    lastTimestamp: 0,
                    firstTimestamp: 0,
                    record: []
                };
                block.records.push(targetSeg);
            }
            targetSeg.record.push(record);
            sortRecordsDeterministic(targetSeg.record);
            reindexTsOrder(targetSeg.record);
            recalcSegmentMeta(targetSeg);
        }

        // summary 재계산
        block.summary = recomputeSummary(block.records);

        return savePayload(payload);
    }

    // ─────────────────────────────────────────────────────────────
    // 레코드 수정
    // ─────────────────────────────────────────────────────────────

    function updateRecord(updatedRecord, panelKey) {
        const payload = loadPayload();
        if (!payload || !payload.data) return false;

        const block = payload.data[panelKey];
        if (!block || !Array.isArray(block.records)) return false;

        const gachaId = updatedRecord.gachaId;
        let found = false;

        for (const seg of block.records) {
            if (!Array.isArray(seg.record)) continue;
            for (let i = 0; i < seg.record.length; i++) {
                if (String(seg.record[i].gachaId) === String(gachaId)) {
                    // 기존 레코드 업데이트
                    seg.record[i] = { ...seg.record[i], ...updatedRecord };
                    found = true;

                    // 5★이고 fivestar 정보도 업데이트
                    if (Number(updatedRecord.grade) === 5 && seg.fivestar) {
                        seg.fivestar.name = updatedRecord.name;
                        seg.fivestar.timestamp = updatedRecord.timestamp;
                    }
                    break;
                }
            }
            if (found) {
                sortRecordsDeterministic(seg.record);
                reindexTsOrder(seg.record);
                recalcSegmentMeta(seg);
                break;
            }
        }

        if (!found) return false;

        block.summary = recomputeSummary(block.records);
        return savePayload(payload);
    }

    // ─────────────────────────────────────────────────────────────
    // 레코드 삭제
    // ─────────────────────────────────────────────────────────────

    function deleteRecord(record, panelKey) {
        const payload = loadPayload();
        if (!payload || !payload.data) return false;

        const block = payload.data[panelKey];
        if (!block || !Array.isArray(block.records)) return false;

        const gachaId = String(record.gachaId);
        let found = false;
        let segToRemove = null;

        for (const seg of block.records) {
            if (!Array.isArray(seg.record)) continue;
            const beforeLen = seg.record.length;
            seg.record = seg.record.filter(r => String(r.gachaId) !== gachaId);
            if (seg.record.length < beforeLen) {
                found = true;
                sortRecordsDeterministic(seg.record);
                reindexTsOrder(seg.record);
                recalcSegmentMeta(seg);

                // 빈 세그먼트 표시
                if (seg.record.length === 0) {
                    segToRemove = seg;
                }
                break;
            }
        }

        // 빈 세그먼트 제거
        if (segToRemove) {
            block.records = block.records.filter(seg => seg !== segToRemove);
        }

        if (!found) return false;

        block.summary = recomputeSummary(block.records);
        return savePayload(payload);
    }

    // ─────────────────────────────────────────────────────────────
    // 특정 이름의 모든 레코드 수집 (히스토리 패널용)
    // ─────────────────────────────────────────────────────────────

    function collectRecordsByName(name, panelKey) {
        const payload = loadPayload();
        if (!payload || !payload.data) return [];

        const block = payload.data[panelKey];
        if (!block || !Array.isArray(block.records)) return [];

        const results = [];

        for (const seg of block.records) {
            if (!Array.isArray(seg.record)) continue;

            // pity 계산을 위해 시간순 정렬
            const sorted = seg.record.slice().sort((a, b) => {
                const ta = Number(a?.timestamp || 0), tb = Number(b?.timestamp || 0);
                if (ta !== tb) return ta - tb;
                const oa = (a?.tsOrder != null) ? Number(a.tsOrder) : Infinity;
                const ob = (b?.tsOrder != null) ? Number(b.tsOrder) : Infinity;
                return oa - ob;
            });

            let pity = 0;
            for (const r of sorted) {
                pity++;
                if (r.name === name) {
                    // manualPity가 있으면 그 값 사용
                    const displayPity = (r.manualPity != null && isManualRecord(r)) ? r.manualPity : pity;
                    results.push({
                        ...r,
                        _displayPity: displayPity,
                        _panelKey: panelKey
                    });
                }
                // 5★이면 pity 리셋
                if (Number(r.grade) === 5) {
                    pity = 0;
                }
            }
        }

        return results;
    }

    // ─────────────────────────────────────────────────────────────
    // 5★ 기록 수집 (pity 포함)
    // ─────────────────────────────────────────────────────────────

    function collectFiveStarWithPity(panelKey) {
        const payload = loadPayload();
        if (!payload || !payload.data) return [];

        const block = payload.data[panelKey];
        if (!block || !Array.isArray(block.records)) return [];

        const results = [];

        for (const seg of block.records) {
            if (!Array.isArray(seg.record)) continue;

            const sorted = seg.record.slice().sort((a, b) => {
                const ta = Number(a?.timestamp || 0), tb = Number(b?.timestamp || 0);
                if (ta !== tb) return ta - tb;
                const oa = (a?.tsOrder != null) ? Number(a.tsOrder) : Infinity;
                const ob = (b?.tsOrder != null) ? Number(b.tsOrder) : Infinity;
                return oa - ob;
            });

            let pity = 0;
            for (const r of sorted) {
                pity++;
                if (Number(r.grade) === 5) {
                    const displayPity = (r.manualPity != null && isManualRecord(r)) ? r.manualPity : pity;
                    results.push({
                        ...r,
                        _displayPity: displayPity,
                        _panelKey: panelKey
                    });
                    pity = 0;
                }
            }
        }

        return results;
    }

    // ─────────────────────────────────────────────────────────────
    // 리렌더 트리거
    // ─────────────────────────────────────────────────────────────

    function triggerRerender() {
        try {
            const payload = loadPayload();
            if (payload && window.renderCardsFromExample) {
                window.renderCardsFromExample(payload);
            }
        } catch (_) { }
    }

    // ─────────────────────────────────────────────────────────────
    // 보정값 관리 (추가 횟수, 진행 중 조정)
    // ─────────────────────────────────────────────────────────────

    const ADJUSTMENTS_KEY = 'pull-tracker:adjustments';

    function loadAdjustments() {
        try {
            const s = localStorage.getItem(ADJUSTMENTS_KEY);
            if (!s) return {};
            return JSON.parse(s);
        } catch (_) { return {}; }
    }

    function saveAdjustments(adjustments) {
        try {
            localStorage.setItem(ADJUSTMENTS_KEY, JSON.stringify(adjustments));
            return true;
        } catch (_) { return false; }
    }

    function getAdjustment(panelKey) {
        const all = loadAdjustments();
        return all[panelKey] || { additionalPulls: 0, progressAdjust: 0 };
    }

    function setAdjustment(panelKey, additionalPulls, progressAdjust) {
        const all = loadAdjustments();
        all[panelKey] = {
            additionalPulls: Math.max(0, Number(additionalPulls) || 0),
            progressAdjust: Number(progressAdjust) || 0
        };
        return saveAdjustments(all);
    }

    // 보정값 적용된 총 뽑기 계산
    function getAdjustedTotal(panelKey, originalTotal) {
        const adj = getAdjustment(panelKey);
        return (originalTotal || 0) + adj.additionalPulls;
    }

    // 보정값 적용된 진행 중 계산
    function getAdjustedProgress(panelKey, originalProgress) {
        const adj = getAdjustment(panelKey);
        return Math.max(0, (originalProgress || 0) + adj.progressAdjust);
    }

    // ─────────────────────────────────────────────────────────────
    // 전역 노출
    // ─────────────────────────────────────────────────────────────

    window.RecordManager = {
        loadPayload,
        savePayload,
        addRecord,
        updateRecord,
        deleteRecord,
        collectRecordsByName,
        collectFiveStarWithPity,
        triggerRerender,
        recomputeSummary,
        isManualRecord,
        // 보정값 관리
        loadAdjustments,
        saveAdjustments,
        getAdjustment,
        setAdjustment,
        getAdjustedTotal,
        getAdjustedProgress
    };

})();

