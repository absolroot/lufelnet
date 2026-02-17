(function(){
  'use strict';

  const BASE = (typeof BASE_URL !== 'undefined' ? BASE_URL : '');
  const IMAGES_DIR = `${BASE}/apps/gallery/images`;
  const THUMBS_DIR = `${BASE}/apps/gallery/images/thumbs`;
  const DATA_URL = `${BASE}/apps/gallery/gallery-tags.json?v=${Date.now()}`;
  // 디렉터리 나열은 사용하지 않음 (플러그인 비활성화). JSON만 사용

  const gridEl = document.getElementById('gallery-grid');
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const tagSelect = document.getElementById('tag-select');
  const sortSelect = document.getElementById('sort-select');
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const modalClose = document.getElementById('modal-close');
  const modalCaption = document.getElementById('modal-caption');

  /**
   * 현재 언어 문자열 반환
   */
  function getLang(){
    try { return (typeof LanguageRouter !== 'undefined') ? LanguageRouter.getCurrentLanguage() : (window.currentLang || 'kr'); } catch(_) { return 'kr'; }
  }

  function getI18nText(key, fallback = ''){
    try {
      if (typeof window.t === 'function') {
        return window.t(key, fallback);
      }
    } catch (_) {}
    return fallback;
  }

  async function waitForI18n(maxRetries = 50, delayMs = 100){
    while (typeof window.t !== 'function' && maxRetries > 0){
      await new Promise(resolve => setTimeout(resolve, delayMs));
      maxRetries--;
    }
  }

  /**
   * 통합 i18n 번들 적용
   */
  function applyI18n(){
    const pageTitle = getI18nText('pageTitle', '갤러리');
    const titleEl = document.getElementById('gallery-title');
    if (titleEl) titleEl.textContent = pageTitle;

    if (searchInput) searchInput.placeholder = getI18nText('searchPlaceholder', '검색...');
    // 드롭다운 기본 옵션 라벨 업데이트
    if (categorySelect && categorySelect.options.length > 0) {
      categorySelect.options[0].textContent = getI18nText('filterAllGroups', getI18nText('filterAll', '전체'));
    }
    if (tagSelect && tagSelect.options.length > 0) {
      tagSelect.options[0].textContent = getI18nText('filterAllTags', '모든 태그');
    }
    if (sortSelect && sortSelect.options.length>=4){
      sortSelect.options[0].textContent = getI18nText('sortOrderDesc', '순서 ↓');
      sortSelect.options[1].textContent = getI18nText('sortOrderAsc', '순서 ↑');
      sortSelect.options[2].textContent = getI18nText('sortNameAsc', '이름 A→Z');
      sortSelect.options[3].textContent = getI18nText('sortNameDesc', '이름 Z→A');
    }

    // SEO 타이틀/메타 업데이트
    if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
      window.SeoEngine.setContextHint({
        domain: 'gallery',
        mode: 'list'
      }, { rerun: true });
    } else if (window.SeoEngine && typeof window.SeoEngine.run === 'function') {
      window.SeoEngine.run();
    }

    // Navigation path 번역
    const navHomeEl = document.getElementById('nav-home');
    const navCurEl = document.getElementById('nav-current');
    if (navHomeEl) navHomeEl.textContent = getI18nText('nav.home', '홈');
    if (navCurEl) navCurEl.textContent = getI18nText('navCurrent', '갤러리');
  }

  /**
   * JSON 로드
   */
  async function fetchJsonList(){
    const res = await fetch(DATA_URL);
    if (!res.ok) return [];
    const list = await res.json();
    return list.map((it, idx)=>({
      filename: it.filename,
      tags: Array.isArray(it.tags) ? it.tags : [],
      category: Array.isArray(it.category) ? it.category : [],
      order: Number.isFinite(it.order) ? it.order : (idx+1),
    }));
  }

  // 디렉터리 내 파일도 모두 포함
  async function fetchDirFiles(){ return []; }

  /**
   * 유니크 값 수집
   */
  function collectUnique(list, key){
    const set = new Set();
    list.forEach(it=>{ const v = it[key]; if (Array.isArray(v)) v.forEach(x=>set.add(String(x))); else if (v) set.add(String(v)); });
    const lang = getLang();
    const arr = Array.from(set);
    // 표시 언어 기준 A→Z 정렬 (tags는 캐릭터/커스텀 매핑 포함, category는 카테고리 매핑)
    return arr.sort((a,b)=>{
      if (key === 'tags') {
        const aa = getLocalizedTagLabel(a, lang) || '';
        const bb = getLocalizedTagLabel(b, lang) || '';
        return aa.localeCompare(bb);
      } else {
        const aa = (typeof GalleryI18N !== 'undefined' && GalleryI18N) ? (GalleryI18N.translateCategory(a, lang) || a) : a;
        const bb = (typeof GalleryI18N !== 'undefined' && GalleryI18N) ? (GalleryI18N.translateCategory(b, lang) || b) : b;
        return (aa||'').localeCompare(bb||'');
      }
    });
  }

  // 캐릭터 이름 현지화 (characters.js 전역 characterData 사용)
  function localizeCharacterTag(tag, lang){
    try {
      if (typeof characterData !== 'object') return tag;
      const entry = characterData[tag];
      if (!entry) return tag;
      if (lang === 'en' && entry.name_en){
        // space바로 나뉜 텍스트 중 앞 단어만 사용
        const words = entry.name_en.split(' ');
        return words[0];
      }
      if (lang === 'jp' && entry.name_jp) return entry.name_jp;
      return tag;
    } catch(_) { return tag; }
  }

  // 태그 라벨 현지화 (캐릭터명 우선 → 커스텀 매핑 → 원문)
  function getLocalizedTagLabel(rawTag, lang){
    const byChar = localizeCharacterTag(rawTag, lang);
    if (byChar && byChar !== rawTag) return byChar;
    try {
      if (typeof GalleryI18N !== 'undefined' && GalleryI18N && typeof GalleryI18N.translateTag === 'function'){
        const byMap = GalleryI18N.translateTag(rawTag, lang);
        if (byMap && byMap !== rawTag) return byMap;
      }
    } catch(_){}
    return rawTag;
  }

  /**
   * 옵션 그리기
   */
  function populateFilters(list){
    // 카테고리
    const cats = collectUnique(list, 'category');
    cats.sort((a,b)=>{
      const lang = getLang();
      const aa = GalleryI18N ? GalleryI18N.translateCategory(a, lang) : a;
      const bb = GalleryI18N ? GalleryI18N.translateCategory(b, lang) : b;
      return (aa||'').localeCompare(bb||'');
    }).forEach(c=>{ const opt=document.createElement('option'); opt.value=c; opt.textContent=(GalleryI18N ? GalleryI18N.translateCategory(c, getLang()) : c); opt.setAttribute('data-label', opt.textContent.toLowerCase()); categorySelect.appendChild(opt); });
    // 태그
    const allTags = collectUnique(list.map(it=>({tags:it.tags})), 'tags');
    allTags.forEach(t=>{ const label=getLocalizedTagLabel(t, getLang()); const opt=document.createElement('option'); opt.value=t; opt.textContent=label; opt.setAttribute('data-label', (label||'').toLowerCase()); tagSelect.appendChild(opt); });
  }

  /**
   * 정렬
   */
  function sortList(list){
    const v = sortSelect.value;
    const byName = (a,b)=>a.filename.localeCompare(b.filename);
    const byOrder = (a,b)=>a.order-b.order;
    if (v==='order_desc') return [...list].sort((a,b)=>byOrder(b,a));
    if (v==='name_asc') return [...list].sort(byName);
    if (v==='name_desc') return [...list].sort((a,b)=>byName(b,a));
    return [...list].sort(byOrder);
  }

  /**
   * 필터
   */
  function filterList(list){
    const q = (searchInput.value||'').toLowerCase().trim();
    const cat = categorySelect.value;
    const tag = tagSelect.value;
    return list.filter(it=>{
      if (cat && !it.category.includes(cat)) return false;
      if (tag && !it.tags.map(String).includes(tag)) return false;
      if (!q) return true;
      const hay = [it.filename, it.category, ...(it.tags||[])].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  /**
   * 썸네일 URL 생성: 썸네일 별도 파일이 없으므로 브라우저 리사이즈 + lazy 로 대체
   */
  function buildImageURL(filename){
    return `${IMAGES_DIR}/${encodeURIComponent(filename)}`;
  }

  function buildThumbURL(filename){
    // filename 확장자는 모두 webp로 바꾸기
    return `${THUMBS_DIR}/${encodeURIComponent(filename.replace(/\.[^.]+$/, '.webp'))}`;
  }

  /**
   * IntersectionObserver로 지연 로드
   */
  function setupLazy(container){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src){
            img.src = src;
            img.onload = ()=> img.classList.add('loaded');
            img.removeAttribute('data-src');
          }
          io.unobserve(img);
        }
      });
    },{rootMargin:'200px'});
    container.querySelectorAll('img[data-src]').forEach(img=>io.observe(img));
  }

  /**
   * 카드 DOM 생성 (단일)
   */
  function buildCard(item){
    const card = document.createElement('div');
    card.className = 'gallery-card';
    const thumb = document.createElement('div');
    thumb.className = 'thumb-wrapper';
    const img = document.createElement('img');
    img.alt = item.filename;
    // 썸네일 있으면 우선 사용, 없으면 원본
    img.setAttribute('data-src', buildThumbURL(item.filename));
    img.onerror = function(){
      const current = img.getAttribute('data-src') || '';
      const isThumb = current.indexOf('/apps/gallery/images/thumbs/') !== -1;
      if (isThumb) {
        img.onerror = null; // 무한 루프 방지
        img.setAttribute('data-src', buildImageURL(item.filename));
      }
    };
    img.decoding = 'async';
    img.loading = 'lazy';
    thumb.appendChild(img);
    // 캡션
    const cap = document.createElement('div');
    cap.className = 'card-caption';
    const tags = document.createElement('div'); tags.className='tags';
    const lang = getLang();
    // 최대 4개(모바일 3개) 표시, 초과 시 ...
    const isMobile = window.innerWidth <= 768;
    const isJapanese = lang === 'jp';
    let tags_sliced = [];
    const mapped = (item.tags||[]).map(t=> getLocalizedTagLabel(t, lang));


    if (isJapanese && isMobile) tags_sliced = mapped.slice(0, 2);
    else tags_sliced = mapped.slice(0, isMobile || isJapanese ? 3 : 4);
    
    if (tags_sliced.length < mapped.length) tags_sliced.push('...');
    tags_sliced.forEach(t=>{
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = (t === '...') ? t : `#${t}`;
      tags.appendChild(chip);
    });
    cap.appendChild(tags);
    // 클릭으로 모달
    thumb.addEventListener('click', ()=> openModal(item));
    card.appendChild(thumb); card.appendChild(cap);
    return card;
  }

  /**
   * 카드 렌더링 (append=true면 기존 유지하고 뒤에만 추가)
   */
  function render(list, append=false){
    if (!append) gridEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    list.forEach(item=>{ frag.appendChild(buildCard(item)); });
    gridEl.appendChild(frag);
    setupLazy(gridEl);
  }

  let modalList = [];
  let modalIndex = -1;

  function refreshArrows(){
    const prev = document.getElementById('modal-prev');
    const next = document.getElementById('modal-next');
    if (!prev || !next) return;
    prev.disabled = modalIndex <= 0;
    next.disabled = modalIndex >= modalList.length - 1;
  }

  function renderModalTags(item){
    modalCaption.innerHTML = '';
    const lang = getLang();
    (item.tags||[]).map(t=> getLocalizedTagLabel(t, lang)).forEach(t=>{
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      if (t === '...') {
        chip.textContent = t;
      } else {
        chip.textContent = `#${t}`;
      }
      modalCaption.appendChild(chip);
    });
  }

  function openModalByIndex(idx){
    modalIndex = idx;
    const item = modalList[modalIndex];
    if (!item) return;
    modalImg.src = buildImageURL(item.filename);
    modalImg.alt = item.filename;
    renderModalTags(item);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    refreshArrows();
  }

  function openModal(item){
    const idx = modalList.findIndex(x=>x.filename===item.filename);
    openModalByIndex(idx >= 0 ? idx : 0);
  }

  function moveModal(step){
    const next = modalIndex + step;
    if (next < 0 || next >= modalList.length) return;
    openModalByIndex(next);
  }
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    modalImg.src = '';
  }

  function wireModal(){
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e)=>{ if (e.target===modal) closeModal(); });
    document.addEventListener('keydown', (e)=>{
      if (!modal.classList.contains('open')) return;
      if (e.key==='Escape') closeModal();
      if (e.key==='ArrowLeft') moveModal(-1);
      if (e.key==='ArrowRight') moveModal(1);
    });
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    if (prevBtn) prevBtn.addEventListener('click', ()=> moveModal(-1));
    if (nextBtn) nextBtn.addEventListener('click', ()=> moveModal(1));
  }

  async function main(){
    await waitForI18n();
    applyI18n();
    wireModal();

    Promise.all([fetchJsonList(), fetchDirFiles()]).then(([jsonList])=>{
      fullList = [...jsonList];
      modalList = [...fullList];
      populateFilters(fullList);

      // 무한 스크롤 상태값
      pageSize = 20;
      visibleCount = 20;
      filteredList = [...fullList];

      const update = ()=>{
        const out = sortList(filterList(fullList));
        filteredList = [...out];
        modalList = [...out];
        visibleCount = pageSize; // 필터/정렬 변경 시 초기화
        render(out.slice(0, visibleCount));
        // 관찰자 재설정 (필터 변경 후 즉시 하단 감지 가능)
        setupInfiniteScroll();
      };
      [searchInput, categorySelect, tagSelect, sortSelect].forEach(el=> el && el.addEventListener('input', update));
      // select 요소는 change 이벤트도 바인딩
      [categorySelect, tagSelect, sortSelect].forEach(el=> el && el.addEventListener('change', update));
      update();

      // 인피니트 스크롤 시작
      setupInfiniteScroll();
    }).catch(err=>{
      console.error(err);
      const errorBox = document.createElement('div');
      errorBox.style.color = 'rgba(255,255,255,0.7)';
      errorBox.style.padding = '12px';
      errorBox.textContent = getI18nText('loadError', 'Failed to load gallery data.');
      gridEl.innerHTML = '';
      gridEl.appendChild(errorBox);
    });
  }

  // 인피니트 스크롤 구현
  let fullList = [];
  let filteredList = [];
  let pageSize = 20;
  let visibleCount = 20;
  let ioLoadMore = null;

  function ensureSentinel(){
    let s = document.getElementById('gallery-sentinel');
    if (!s){
      s = document.createElement('div');
      s.id = 'gallery-sentinel';
      s.style.height = '1px';
      s.style.width = '100%';
      gridEl.after(s);
    }
    return s;
  }

  function setupInfiniteScroll(){
    const sentinel = ensureSentinel();
    if (ioLoadMore) ioLoadMore.disconnect();
    ioLoadMore = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (visibleCount >= filteredList.length) return;
        // 로딩 스피너 0.5초 노출 후 로드
        const loader = document.getElementById('gallery-loader');
        if (loader) loader.style.display = 'flex';
        setTimeout(() => {
          const nextCount = Math.min(visibleCount + pageSize, filteredList.length);
          const slice = filteredList.slice(visibleCount, nextCount);
          visibleCount = nextCount;
          // 기존은 유지하고, 새 항목만 append 렌더링
          render(slice, true);
          if (loader) loader.style.display = 'none';
        }, 500);
      });
    }, { rootMargin: '400px' });
    ioLoadMore.observe(sentinel);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { void main(); });
  else void main();
})();


