// Capture utilities for tactic page
// Requires html-to-image (loaded via CDN in apps/tactic/index.html)
(function(){
  function showLoading(text){
    const el = document.createElement('div');
    el.className = 'capture-loading-overlay';
    el.style.position = 'fixed';
    el.style.top = '50%';
    el.style.left = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.background = 'rgba(0,0,0,0.7)';
    el.style.color = 'white';
    el.style.padding = '14px 18px';
    el.style.borderRadius = '6px';
    el.style.zIndex = '99999';
    el.style.fontSize = '14px';
    el.textContent = text || 'Generating image...';
    document.body.appendChild(el);
    return el;
  }

  function downloadDataUrl(dataUrl, filename){
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename || `tactic-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function captureAndDownload(){
    const mainWrapper = document.querySelector('.main-wrapper');
    if (!mainWrapper) return;

    const loading = showLoading('Capturing...');

    // Hide edit UI via hide-ui class (same behavior as existing flow)
    const container = document.querySelector('.container');
    const wasUIHidden = container ? container.classList.contains('hide-ui') : false;
    if (container) container.classList.add('hide-ui');

    // navigation-path 텍스트를 임시 교체 후 복원
    const navigationPath = document.querySelector('.navigation-path');
    const originalNavigationContent = navigationPath ? navigationPath.innerHTML : null;
    if (navigationPath) navigationPath.innerHTML = 'lufel.net';

    // Temporarily hide elements we don't want in the capture (if they exist inside main-wrapper)
    const toHide = [];
    const mobileButtons = mainWrapper.querySelector('.mobile-buttons');
    const topButtons = mainWrapper.querySelector('.top-buttons');
    if (mobileButtons && mobileButtons.style.display !== 'none') { toHide.push(mobileButtons); }
    if (topButtons && topButtons.style.display !== 'none') { toHide.push(topButtons); }

    const prevDisplay = new Map();
    toHide.forEach(el => { prevDisplay.set(el, el.style.display); el.style.display = 'none'; });

    // placeholder 텍스트 숨김 (레이아웃 유지 위해 visibility 사용)
    // 1) 명시적으로 .placeholder 클래스가 붙은 경우
    // 2) .action-memo-display가 실제 텍스트는 없고 ::before/::after에 content가 있는 경우(언어에 따라 'Details/상세/詳細' 등)
    const placeholderNodes = new Set();
    const explicitPlaceholders = mainWrapper.querySelectorAll('.action-memo-display.placeholder, .action-memo-display .placeholder');
    explicitPlaceholders.forEach(el => placeholderNodes.add(el));

    const memoDisplays = mainWrapper.querySelectorAll('.action-memo-display');
    memoDisplays.forEach(el => {
      const text = (el.textContent || '').trim();
      const before = getComputedStyle(el, '::before').content;
      const after = getComputedStyle(el, '::after').content;
      const hasPseudo = (before && before !== 'none' && before !== 'normal') || (after && after !== 'none' && after !== 'normal');
      if (text === '' && hasPseudo) placeholderNodes.add(el);
    });

    const prevPlaceholderStyles = new Map();
    const prevPlaceholderText = new Map();
    placeholderNodes.forEach(el => {
      prevPlaceholderStyles.set(el, { visibility: el.style.visibility });
      prevPlaceholderText.set(el, el.textContent);
      el.style.visibility = 'hidden';
      // 안전빵: 실제 텍스트도 비움
      el.textContent = '';
    });

    // 의사요소로 표시되는 플레이스홀더를 강제로 숨기는 임시 스타일 삽입
    const placeholderStyle = document.createElement('style');
    placeholderStyle.id = 'capture-hide-placeholder-style';
    placeholderStyle.textContent = `
      .action-memo-display.placeholder::before,
      .action-memo-display.placeholder::after,
      .action-memo-display::before,
      .action-memo-display::after {
        content: '' !important;
      }
    `;
    document.head.appendChild(placeholderStyle);

    // Preserve left gutter: convert absolute left offset to padding-left during capture
    const prev = {
      left: mainWrapper.style.left,
      right: mainWrapper.style.right,
      paddingLeft: mainWrapper.style.paddingLeft,
      paddingRight: mainWrapper.style.paddingRight,
      marginLeft: mainWrapper.style.marginLeft,
      marginRight: mainWrapper.style.marginRight,
      background: mainWrapper.style.backgroundColor
    };
    const cs = getComputedStyle(mainWrapper);
    const bodyBg = getComputedStyle(document.body).backgroundColor || '#000';
    const currentPadL = parseInt(cs.paddingLeft, 10) || 0;
    const currentPadR = parseInt(cs.paddingRight, 10) || 0;
    // 뷰포트 기준 좌측 거리 측정
    const rect = mainWrapper.getBoundingClientRect();
    const viewportLeft = Math.max(0, Math.round(rect.left));
    // neutralize positioning and inject padding to keep visual width
    mainWrapper.style.left = '0px';
    mainWrapper.style.right = 'auto';
    mainWrapper.style.marginLeft = '0';
    mainWrapper.style.marginRight = '0';
    // hide-ui 상태에서는 좌/우 여백을 대칭으로(우측 padding과 동일) 적용
    // hide-ui가 아니면 내비 여백 보존: min(120, viewportLeft)
    const isHideUI = container && container.classList.contains('hide-ui');
    const leftPadding = isHideUI ? currentPadR : Math.min(120, viewportLeft);
    mainWrapper.style.paddingLeft = leftPadding + 'px';
    mainWrapper.style.paddingRight = currentPadR + 'px';
    // ensure solid background for transparent areas
    mainWrapper.style.backgroundColor = cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
      ? cs.backgroundColor
      : bodyBg;

    try {
      // 스타일 적용 대기
      await new Promise(r => setTimeout(r, 100));
      const opts = {
        backgroundColor: bodyBg,
        pixelRatio: Math.min(3, (window.devicePixelRatio || 1) * 2),
        filter: (node) => {
          try {
            if (!(node instanceof Element)) return true;
            if (node.classList.contains('action-memo-display') && node.classList.contains('placeholder')) return false;
            if (node.classList.contains('placeholder') && node.closest('.action-memo-display')) return false;
          } catch (_) {}
          return true;
        }
      };
      const dataUrl = await htmlToImage.toPng(mainWrapper, opts);
      loading.textContent = 'Downloading...';
      downloadDataUrl(dataUrl);
      loading.textContent = 'Done!';
    } catch (err) {
      console.error('[capture] failed:', err);
      loading.textContent = 'Failed to capture';
    } finally {
      // Restore hidden elements
      toHide.forEach(el => { el.style.display = prevDisplay.get(el) || ''; });
      // Restore placeholder visibility and text
      prevPlaceholderStyles.forEach((v, el) => { el.style.visibility = v.visibility; });
      prevPlaceholderText.forEach((t, el) => { el.textContent = t; });
      // Restore styles
      mainWrapper.style.left = prev.left;
      mainWrapper.style.right = prev.right;
      mainWrapper.style.paddingLeft = prev.paddingLeft;
      mainWrapper.style.paddingRight = prev.paddingRight;
      mainWrapper.style.marginLeft = prev.marginLeft;
      mainWrapper.style.marginRight = prev.marginRight;
      mainWrapper.style.backgroundColor = prev.background;
      // Restore hide-ui state
      if (container && !wasUIHidden) container.classList.remove('hide-ui');
      // Restore navigation-path
      if (navigationPath && originalNavigationContent != null) navigationPath.innerHTML = originalNavigationContent;
      // Remove temporary placeholder-hiding style
      if (placeholderStyle && placeholderStyle.parentNode) placeholderStyle.parentNode.removeChild(placeholderStyle);
      setTimeout(() => { if (loading && loading.parentNode) loading.remove(); }, 800);
    }
  }

  // expose global
  window.captureAndDownload = captureAndDownload;
})();
