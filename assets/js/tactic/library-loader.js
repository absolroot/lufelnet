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
      // personaFiles(신규) 또는 personaData(레거시) 둘 중 하나만 있어도 진행
      ( (typeof window.personaFiles !== 'undefined' && window.personaFiles && Object.keys(window.personaFiles).length) ||
        (typeof personaData !== 'undefined') ) &&
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

    // 모바일 기본 잠금 적용 (library 파라미터로 진입 시)
    try {
      if (window.innerWidth < 1200) {
        const lockBtn = document.querySelector('.mobile-lock-btn');
        const turnsContainer = document.getElementById('turns');
        if (lockBtn && turnsContainer) {
          lockBtn.classList.add('active');
          turnsContainer.classList.add('turns-locked');
          localStorage.setItem('turnsLocked', true);
        }
      }
    } catch (_) {}

    // 아코디언: 라이브러리 경유 진입 시 PC/모바일 모두 접힌 상태로 시작
    try {
      window.__forceAccordionCollapse = true;
      if (typeof window.setAccordionCollapsed === 'function') {
        window.setAccordionCollapsed(true);
      } else {
        document.addEventListener('DOMContentLoaded', function(){
          if (typeof window.setAccordionCollapsed === 'function') {
            window.setAccordionCollapsed(true);
          }
        });
      }
    } catch (_) {}

    // 기본값으로 편집 UI 숨김 처리 (모바일/데스크톱 모두 적용)
    try {
      const container = document.querySelector('.container');
      if (container) {
        container.classList.add('hide-ui');
        const desktopToggleBtn = document.querySelector('.header-container .toggle-ui-btn');
        const mobileToggleBtn = document.querySelector('.mobile-buttons .toggle-ui-btn');
        if (desktopToggleBtn) desktopToggleBtn.classList.add('active');
        if (mobileToggleBtn) mobileToggleBtn.classList.add('active');
        try { localStorage.setItem('uiHidden', true); } catch(_) {}
      }
    } catch(_) {}

    // 다국어 토글 버튼 라벨 갱신
    setTimeout(() => {
      try { if (typeof translateUI === 'function') translateUI(); } catch(_) {}
      try {
        const getLang = () => {
          if (typeof getCurrentLanguage === 'function') return getCurrentLanguage();
          const urlLang = new URLSearchParams(window.location.search).get('lang');
          if (urlLang && ['kr','en','jp'].includes(urlLang)) return urlLang;
          const saved = localStorage.getItem('preferredLanguage');
          if (saved && ['kr','en','jp'].includes(saved)) return saved;
          return 'kr';
        };
        const currentLang = getLang();
        const labelMap = {
          kr: { off: '🕶️ 편집 UI 숨김', on: '🔍 편집 UI 표시' },
          en: { off: '🕶️ Hide Edit UI', on: '🔍 Show Edit UI' },
          jp: { off: '🕶️ 編集UIを非表示', on: '🔍 編集UIを表示' }
        };
        const t = labelMap[currentLang] || labelMap.kr;
        const mobileToggleBtn = document.querySelector('.mobile-buttons .toggle-ui-btn');
        if (mobileToggleBtn) {
          mobileToggleBtn.setAttribute('data-label', t.off);
          mobileToggleBtn.setAttribute('data-label-active', t.on);
        }
      } catch(_) {}
    }, 200);
  }

  document.addEventListener('DOMContentLoaded', loadFromLibraryParam);
})();

