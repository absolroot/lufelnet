// Collapsible Sections Library
// 재사용 가능한 섹션 접기/펼치기 기능

(function() {
  'use strict';

  /**
   * Collapsible 섹션 초기화
   * @param {string|HTMLElement} container - 컨테이너 ID 또는 요소
   * @param {Object} options - 옵션 객체
   * @param {string} options.selector - 섹션 제목 셀렉터 (기본: '.detail-section-title.collapsible')
   * @param {string} options.sectionSelector - 섹션 셀렉터 (기본: '.detail-section')
   * @param {string} options.contentSelector - 콘텐츠 셀렉터 (기본: '.section-content')
   * @param {string} options.chevronSelector - Chevron 셀렉터 (기본: '.section-chevron')
   */
  function setupCollapsibleSections(container, options = {}) {
    const containerEl = typeof container === 'string' 
      ? document.getElementById(container) 
      : container;
    
    if (!containerEl) return;

    const opts = {
      selector: '.detail-section-title.collapsible',
      sectionSelector: '.detail-section',
      contentSelector: '.section-content',
      chevronSelector: '.section-chevron',
      ...options
    };

    // 이미 리스너가 추가되었는지 확인
    const listenerKey = 'collapseListenerAdded';
    if (containerEl.dataset[listenerKey] === 'true') {
      // 리스너는 이미 추가되어 있으므로, 새로 생성된 제목들에만 커서 스타일 적용
      const collapsibleTitles = containerEl.querySelectorAll(opts.selector);
      collapsibleTitles.forEach(title => {
        title.style.cursor = 'pointer';
      });
      return;
    }

    containerEl.dataset[listenerKey] = 'true';

    // 이벤트 위임 사용: container에 한 번만 리스너 추가
    containerEl.addEventListener('click', (e) => {
      // 클릭된 요소가 collapsible 제목이나 그 자식 요소인지 확인
      let title = e.target.closest(opts.selector);

      // chevron SVG나 path를 클릭한 경우도 처리
      if (!title && (e.target.classList.contains('section-chevron') || e.target.closest('.section-chevron'))) {
        title = e.target.closest('.section-chevron')?.closest(opts.selector);
      }

      if (!title) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // 해당 제목이 속한 섹션 찾기
      const section = title.closest(opts.sectionSelector);
      if (!section) return;

      toggleSection(section, title, opts);
    });

    // 섹션 토글 함수
    function toggleSection(section, title, opts) {
      const content = section.querySelector(`:scope > ${opts.contentSelector}`);
      if (!content) return;

      const chevron = title.querySelector(opts.chevronSelector);
      const isCollapsed = section.classList.contains('collapsed');

      if (isCollapsed) {
        section.classList.remove('collapsed');
        if (chevron) {
          chevron.style.transform = 'rotate(90deg)'; // 아래 방향 (펼침)
        }
      } else {
        section.classList.add('collapsed');
        if (chevron) {
          chevron.style.transform = 'rotate(-90deg)'; // 위 방향 (접힘)
        }
      }
    }

    // 모든 collapsible 제목에 커서 스타일 적용
    const collapsibleTitles = containerEl.querySelectorAll(opts.selector);
    collapsibleTitles.forEach(title => {
      title.style.cursor = 'pointer';
    });
  }

  // 전역으로 노출
  window.setupCollapsibleSections = setupCollapsibleSections;
})();

