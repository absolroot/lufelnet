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

    function setExportButtonText(){
        try {
            const btn = document.getElementById('exportBtn');
            if (!btn) return;
            const label = t().export;
            // clean download-tray icon
            btn.innerHTML = '<span class="help-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M12 3v9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8.5 9.5L12 12.9l3.5-3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="16" width="16" height="4" rx="1.5" stroke="currentColor" stroke-width="1.6"/></svg></span>'
                + '<span style="margin-left:6px;">' + label + '</span>';
        } catch(_) {}
    }

    function downloadText(filename, text) {
        try {
            const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename;
            document.body.appendChild(a); a.click();
            setTimeout(()=>{ try{ document.body.removeChild(a); URL.revokeObjectURL(url); } catch(_){} }, 0);
        } catch(_) {}
    }

    function onExport(){
        try {
            const s = localStorage.getItem('pull-tracker:merged');
            if (!s) { alert((lang()==='en')?'No data to export.':(lang()==='jp'?'エクスポートするデータがありません。':'내보낼 데이터가 없습니다.')); return; }
            const json = JSON.parse(s);
            const ts = new Date();
            const y = ts.getFullYear(); const m = String(ts.getMonth()+1).padStart(2,'0'); const d = String(ts.getDate()).padStart(2,'0');
            const hh = String(ts.getHours()).padStart(2,'0'); const mm = String(ts.getMinutes()).padStart(2,'0');
            const name = `p5x_pull_${y}${m}${d}_${hh}${mm}.json`;
            downloadText(name, JSON.stringify(json, null, 2));
        } catch(e) {
            alert((lang()==='en')?'Export failed.':(lang()==='jp'?'エクスポートに失敗しました。':'내보내기에 실패했습니다.'));
        }
    }

    document.addEventListener('DOMContentLoaded', function(){
        setExportButtonText();
        const btn = document.getElementById('exportBtn');
        if (btn) btn.addEventListener('click', onExport);
    });
})();


