(() => {
    function lang() { try { return (new URLSearchParams(location.search).get('lang') || 'kr').toLowerCase(); } catch(_) { return 'kr'; } }
    function t() {
        const l = lang();
        return {
            kr: { export: '내보내기', import: '가져오기' },
            en: { export: 'Export', import: 'Import' },
            jp: { export: 'エクスポート', import: 'インポート' }
        }[l] || { export: '내보내기', import: '가져오기' };
    }

    function setImportButtonText(){
        try {
            const btn = document.getElementById('importBtn');
            if (!btn) return;
            const label = t().import;
            // clean upload-tray icon
            btn.innerHTML = '<span class="help-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M12 21v-9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8.5 11.3L12 8l3.5 3.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="4" width="16" height="4" rx="1.5" stroke="currentColor" stroke-width="1.6"/></svg></span>'
                + '<span style="margin-left:6px;">' + label + '</span>';
        } catch(_) {}
    }

    function normalizeGachaIdText(text){
        try { return String(text).replace(/("gachaId"\s*:\s*)(-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g, '$1"$2"'); } catch(_) { return text; }
    }

    function parseIncoming(text){
        try { return JSON.parse(normalizeGachaIdText(text)); }
        catch(_) { return JSON.parse(text); }
    }

    function ensureTsOrderInPayload(payload){
        try {
            if (!payload || !payload.data) return payload;
            const KEYS = ['Confirmed','Fortune','Weapon','Gold','Newcomer'];
            for (const k of KEYS){
                const block = payload.data[k];
                if (!block || !Array.isArray(block.records)) continue;
                for (const seg of block.records){
                    const recs = Array.isArray(seg?.record) ? seg.record : [];
                    const perTsIdx = new Map();
                    for (let i=0;i<recs.length;i++){
                        const r = recs[i] || {};
                        const t = Number(r.timestamp ?? r.time ?? r.ts ?? 0) || 0;
                        const has = (r.tsOrder != null) || (r.ts_order != null);
                        if (!t || has) continue;
                        const idx = perTsIdx.get(t) || 0;
                        perTsIdx.set(t, idx + 1);
                        r.tsOrder = idx;
                        r.ts_order = idx;
                        recs[i] = r;
                    }
                }
            }
        } catch(_) {}
        return payload;
    }

    function rerenderFromLocal(){
        try {
            const s = localStorage.getItem('pull-tracker:merged');
            if (!s) return;
            const payload = JSON.parse(s);
            if (window.renderCardsFromExample) window.renderCardsFromExample(payload);
        } catch(_) {}
    }

    function onImportClick(){
        try {
            const input = document.getElementById('importFile');
            if (input) input.click();
        } catch(_) {}
    }

    async function onImportFileChange(ev){
        try {
            const input = ev.target;
            if (!input || !input.files || input.files.length === 0) return;
            const file = input.files[0];
            const text = await file.text();
            const incoming = parseIncoming(text);
            const shaped = ensureTsOrderInPayload(incoming);

            // 기존 데이터가 있을 경우: 커스텀 다이얼로그로 병합/덮어쓰기 선택
            let merged;
            const existing = localStorage.getItem('pull-tracker:merged');
            if (existing && typeof window.pullTrackerChooseMergeMode === 'function') {
                const mode = await window.pullTrackerChooseMergeMode('file');
                if (mode === null) {
                    // 사용자가 취소한 경우 아무 것도 하지 않음
                    return;
                } else if (mode === 'merge' && typeof window.mergeWithCache === 'function') {
                    merged = window.mergeWithCache(shaped);
                } else {
                    merged = shaped;
                }
            } else if (existing && typeof window.mergeWithCache === 'function') {
                // 헬퍼가 없으면 기존 동작(병합) 유지
                merged = window.mergeWithCache(shaped);
            } else {
                merged = shaped;
            }
            localStorage.setItem('pull-tracker:merged', JSON.stringify(merged));
            if (window.renderCardsFromExample) window.renderCardsFromExample(merged);
            // 상태 메시지
            try {
                const langNow = lang();
                const msg = (langNow==='en')?'Imported from file.':(langNow==='jp'?'ファイルから読み込みました。':'파일에서 가져왔습니다.');
                const setStatus = window.__pull_setStatus || (m=>{ try{ const el=document.getElementById('status'); if (el) el.textContent=m; } catch(_){} });
                setStatus(msg);
            } catch(_) {}
        } catch(e) {
            alert((lang()==='en')?'Import failed.':(lang()==='jp'?'インポートに失敗しました。':'가져오기에 실패했습니다.'));
        } finally {
            try { ev.target.value = ''; } catch(_) {}
        }
    }

    document.addEventListener('DOMContentLoaded', function(){
        setImportButtonText();
        const ib = document.getElementById('importBtn');
        const fi = document.getElementById('importFile');
        if (ib) ib.addEventListener('click', onImportClick);
        if (fi) fi.addEventListener('change', onImportFileChange);
        // 전역 재렌더 훅 노출
        try { window.renderCardsFromExample && (window.renderCardsFromExample = window.renderCardsFromExample); } catch(_) {}
    });
})();


