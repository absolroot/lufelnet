(function(){
  async function ensureHtmlToImage(){
    if (window.htmlToImage) return;
    await new Promise((resolve, reject)=>{
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function capturePositionTiers(){
    const el = document.querySelector('.position-tiers-container');
    if (!el) return;
    await ensureHtmlToImage();

    const bodyBg = getComputedStyle(document.body).backgroundColor || '#000';
    const pixelRatio = Math.min(3, (window.devicePixelRatio || 1) * 2);

    try {
      const dataUrl = await htmlToImage.toPng(el, {
        backgroundColor: bodyBg,
        pixelRatio
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `position-tiers-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('[position-tiers capture] failed:', err);
    }
  }

  // JSON 내보내기 함수
  function exportTierJSON(){
    if (typeof window.exportTierListAsJSON !== 'function') {
      console.error('exportTierListAsJSON not available');
      return;
    }
    const jsonData = window.exportTierListAsJSON();
    if (!jsonData) return;

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tier-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // JSON 가져오기 함수
  function importTierJSON(file){
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      try {
        const tierData = JSON.parse(e.target.result);
        if (Array.isArray(tierData)) {
          // position-tiers.js의 loadTierDataFromURL 함수 호출
          if (typeof window.loadTierDataFromURL === 'function') {
            // 기존 티어 초기화 후 로드
            clearAllTiers();
            window.loadTierDataFromURL(tierData);
          } else {
            alert('Tier loading function not available');
          }
        } else {
          alert('Invalid tier data format');
        }
      } catch (err) {
        console.error('Failed to parse JSON:', err);
        alert('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  }

  // 모든 티어 초기화 함수
  function clearAllTiers(){
    const positionCells = document.querySelectorAll('.position-cell');
    const cardsContainer = document.querySelector('.cards');
    positionCells.forEach(cell => {
      const wrappers = cell.querySelectorAll('.character-wrapper');
      const images = cell.querySelectorAll('img:not(.character-ritual-icon):not(.character-core-icon)');
      wrappers.forEach(w => {
        if (cardsContainer) cardsContainer.appendChild(w);
      });
      images.forEach(img => {
        if (!img.closest('.character-wrapper') && cardsContainer) {
          cardsContainer.appendChild(img);
        }
      });
    });
  }

  // 버튼 스타일 공통 함수
  function applyButtonStyle(btn, width = '36px'){
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.gap = '6px';
    btn.style.width = width;
    btn.style.height = '32px';
    btn.style.padding = '6px 10px';
    btn.style.borderRadius = '6px';
    btn.style.border = '1px solid rgba(255,255,255,0.2)';
    btn.style.background = 'rgba(255,255,255,0.08)';
    btn.style.color = 'rgba(255,255,255,0.9)';
    btn.style.cursor = 'pointer';
    btn.addEventListener('mouseenter', () => { btn.style.filter = 'brightness(1.1)'; });
    btn.addEventListener('mouseleave', () => { btn.style.filter = ''; });
  }

  // 캡처 버튼 생성 (카메라 아이콘)
  function createCaptureButton(){
    let btn = document.querySelector('.tier-capture-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'tier-capture-btn';
      // 카메라 아이콘
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path fill-rule="evenodd" d="M8.293 5.293A1 1 0 019 5h6a1 1 0 01.707.293l1.414 1.414A1 1 0 0017.828 7H20a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2h2.172a1 1 0 00.707-.293l1.414-1.414zM12 17a5 5 0 100-10 5 5 0 000 10z" clip-rule="evenodd"/></svg>';
      btn.title = 'Capture Image';
      applyButtonStyle(btn);
      btn.addEventListener('click', capturePositionTiers);
    }
    return btn;
  }

  // JSON 내보내기 버튼 생성
  function createExportButton(){
    let btn = document.querySelector('.tier-export-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'tier-export-btn';
      // 내보내기 아이콘 (다운로드 화살표 + 파일)
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4.007 4.007a1 1 0 0 1-1.414 0L7.279 11.707a1 1 0 1 1 1.414-1.414L11 12.586V4a1 1 0 0 1 1-1z"/><path d="M5 18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a1 1 0 1 1 2 0v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a1 1 0 1 1 2 0v2z"/></svg>';
      btn.title = 'Export JSON';
      applyButtonStyle(btn);
      btn.addEventListener('click', exportTierJSON);
    }
    return btn;
  }

  // JSON 가져오기 버튼 생성
  function createImportButton(){
    let btn = document.querySelector('.tier-import-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'tier-import-btn';
      // 가져오기 아이콘 (업로드 화살표 + 파일)
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16a1 1 0 0 0 1-1V6.414l2.293 2.293a1 1 0 0 0 1.414-1.414l-4.007-4.007a1 1 0 0 0-1.414 0L7.279 7.293a1 1 0 1 0 1.414 1.414L11 6.414V15a1 1 0 0 0 1 1z"/><path d="M5 18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a1 1 0 1 1 2 0v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a1 1 0 1 1 2 0v2z"/></svg>';
      btn.title = 'Import JSON';
      applyButtonStyle(btn);

      // 숨겨진 파일 입력 생성
      let fileInput = document.querySelector('.tier-import-input');
      if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,application/json';
        fileInput.className = 'tier-import-input';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            importTierJSON(e.target.files[0]);
            e.target.value = ''; // 같은 파일 다시 선택 가능하도록 초기화
          }
        });
        document.body.appendChild(fileInput);
      }

      btn.addEventListener('click', () => fileInput.click());
    }
    return btn;
  }

  function injectToolbarButtons(){
    const container = document.querySelector('.position-tiers-container');
    if (!container) return;

    // list=false (티어 메이커 모드)인지 확인
    const urlParams = new URLSearchParams(window.location.search);
    const isListMode = urlParams.get('list') !== 'false';

    // 티어 리스트 모드에서는 툴바 표시하지 않음
    if (isListMode) {
      // 기존 툴바가 있으면 숨김
      const existingToolbar = document.querySelector('.position-tiers-toolbar');
      if (existingToolbar) {
        existingToolbar.style.display = 'none';
      }
      return;
    }

    const captureBtn = createCaptureButton();
    const exportBtn = createExportButton();
    const importBtn = createImportButton();

    // 티어 메이커 모드: 툴바 생성
    let toolbar = document.querySelector('.position-tiers-toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'position-tiers-toolbar';
      toolbar.style.width = 'min(1400px, 100%)';
      toolbar.style.margin = '0 auto';
      toolbar.style.display = 'flex';
      toolbar.style.justifyContent = 'flex-end';
      toolbar.style.alignItems = 'center';
      toolbar.style.gap = '8px';
      toolbar.style.marginTop = '8px';
      container.parentNode.insertBefore(toolbar, container);
    }

    // 버튼 추가
    if (captureBtn.parentElement !== toolbar) {
      if (captureBtn.parentElement) captureBtn.parentElement.removeChild(captureBtn);
      toolbar.appendChild(captureBtn);
    }
    if (exportBtn.parentElement !== toolbar) {
      if (exportBtn.parentElement) exportBtn.parentElement.removeChild(exportBtn);
      toolbar.appendChild(exportBtn);
    }
    if (importBtn.parentElement !== toolbar) {
      if (importBtn.parentElement) importBtn.parentElement.removeChild(importBtn);
      toolbar.appendChild(importBtn);
    }
  }

  function init(){
    injectToolbarButtons();
  }

  // loadTierDataFromURL를 전역에 노출 (position-tiers.js에서 정의됨)
  // 여기서는 wrapper 함수만 제공
  window.loadTierDataFromURL = window.loadTierDataFromURL || function(tierData) {
    console.warn('loadTierDataFromURL not yet available, retrying...');
    setTimeout(() => {
      if (typeof window.loadTierDataFromURL === 'function') {
        window.loadTierDataFromURL(tierData);
      }
    }, 500);
  };

  document.addEventListener('DOMContentLoaded', init);
  window.capturePositionTiers = capturePositionTiers;
  window.exportTierJSON = exportTierJSON;
  window.importTierJSON = importTierJSON;
})();
