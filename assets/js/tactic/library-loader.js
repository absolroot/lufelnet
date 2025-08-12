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

    // 번역 리소스와 applyImportedData 둘 다 준비될 때까지 대기
    const ready = await waitFor(() => (
      typeof supabase !== 'undefined' &&
      typeof window.applyImportedData === 'function' &&
      typeof characterData !== 'undefined' &&
      typeof personaData !== 'undefined' &&
      typeof matchWeapons !== 'undefined' &&
      typeof revelationData !== 'undefined'
    ), 8000, 50);
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

    // 공통 적용 함수 호출 (URL은 유지). 번역 표시가 즉시 적용되도록 약간 딜레이 후 한 번 더 번역 적용을 트리거
    window.applyImportedData(payload, { keepUrl: true, titleOverride: data.title });
    setTimeout(() => {
      try { if (typeof translateUI === 'function') translateUI(); } catch(_) {}
    }, 200);
  }

  document.addEventListener('DOMContentLoaded', loadFromLibraryParam);
})();

