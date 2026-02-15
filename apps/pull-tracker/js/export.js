(() => {
    function tr(key, fallback) {
        try {
            if (window.PullTrackerI18n && typeof window.PullTrackerI18n.t === 'function') {
                return window.PullTrackerI18n.t(key, fallback);
            }
        } catch (_) { }
        return fallback || key;
    }

    function setExportButtonText(){
        try {
            const btn = document.getElementById('exportBtn');
            if (!btn) return;
            const label = tr('io.export.label', '내보내기');
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
            if (!s) {
                alert(tr('io.export.noData', '내보낼 데이터가 없습니다.'));
                return;
            }
            const json = JSON.parse(s);
            const ts = new Date();
            const y = ts.getFullYear(); const m = String(ts.getMonth()+1).padStart(2,'0'); const d = String(ts.getDate()).padStart(2,'0');
            const hh = String(ts.getHours()).padStart(2,'0'); const mm = String(ts.getMinutes()).padStart(2,'0');
            const name = `p5x_pull_${y}${m}${d}_${hh}${mm}.json`;
            downloadText(name, JSON.stringify(json, null, 2));
        } catch(e) {
            alert(tr('io.export.failed', '내보내기에 실패했습니다.'));
        }
    }

    document.addEventListener('DOMContentLoaded', async function(){
        try { await (window.__pullI18nReady || Promise.resolve()); } catch (_) { }
        setExportButtonText();
        const btn = document.getElementById('exportBtn');
        if (btn) btn.addEventListener('click', onExport);
    });
})();


