// 라이브러리 URL 파라미터로 택틱 불러오기 (Supabase tactics.url)
(function() {
  async function waitFor(fnCheck, timeoutMs = 5000, intervalMs = 50) {
    const start = Date.now();
    return new Promise(resolve => {
      const tick = () => {
        if (fnCheck()) return resolve(true);
        if (Date.now() - start > timeoutMs) return resolve(false);
        setTimeout(tick, intervalMs);
      };
      tick();
    });
  }

  async function loadFromLibraryParam() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('library');
    if (!code) return;

    const ready = await waitFor(() => (typeof supabase !== 'undefined') && (typeof window.applyImportedData === 'function'));
    if (!ready) return;

    const { data, error } = await supabase
      .from('tactics')
      .select('title, query')
      .eq('url', code)
      .maybeSingle();

    if (error || !data) return;

    let payload = data.query;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch (e) { return; }
    }
    if (!payload || typeof payload !== 'object') return;

    // 공통 적용 함수 호출 (URL은 유지)
    window.applyImportedData(payload, { keepUrl: true, titleOverride: data.title });
  }

  document.addEventListener('DOMContentLoaded', loadFromLibraryParam);
})();

