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

  /**
   * 다국어 적용 (제목/설명/placeholder 라벨)
   */
  function applyI18n(){
    const lang = getLang();
    const map = {
      kr: { title: '갤러리', navHome:'홈', navCurrent:'갤러리', descSel: ['.korean-content'], search: '검색...', all: '전체', allGroups: '전체 그룹', allTags: '전체 태그', sort: ['Order ↑','Order ↓','이름 A→Z','이름 Z→A'] },
      en: { title: 'Gallery', navHome:'Home', navCurrent:'Gallery', descSel: ['.english-content'], search: 'Search...', all: 'All', allGroups: 'All Groups', allTags: 'All Tags', sort: ['Order ↑','Order ↓','Name A→Z','Name Z→A'] },
      jp: { title: 'ギャラリー', navHome:'ホーム', navCurrent:'ギャラリー', descSel: ['.japanese-content'], search: '検索...', all: '全て', allGroups: '全てのグループ', allTags: '全てのタグ', sort: ['順序 ↑','順序 ↓','名前 A→Z','名前 Z→A'] }
    };
    const t = map[lang] || map.kr;
    const titleEl = document.getElementById('gallery-title');
    if (titleEl) titleEl.textContent = t.title;
    // 설명 가시성 전환
    ['.korean-content','.english-content','.japanese-content'].forEach(sel=>document.querySelectorAll(sel).forEach(el=>el.style.display='none'));
    t.descSel.forEach(sel=>document.querySelectorAll(sel).forEach(el=>el.style.display='block'));
    if (searchInput) searchInput.placeholder = t.search;
    // 드롭다운 기본 옵션 라벨 업데이트
    if (categorySelect) categorySelect.options[0].textContent = t.allGroups || t.all;
    if (tagSelect) tagSelect.options[0].textContent = t.allTags;
    if (sortSelect && sortSelect.options.length>=4){
      sortSelect.options[0].textContent = t.sort[0];
      sortSelect.options[1].textContent = t.sort[1];
      sortSelect.options[2].textContent = t.sort[2];
      sortSelect.options[3].textContent = t.sort[3];
    }
    // SEO 타이틀/메타 업데이트
    const seo = {
      kr: { title: '갤러리 - P5X 루페르넷', desc: 'P5X 갤러리. 썸네일을 클릭해 원본 이미지를 크게 확인하세요.' },
      en: { title: 'Gallery - Persona 5: The Phantom X LufelNet', desc: 'P5X Gallery. Click a thumbnail to view original image in a modal.' },
      jp: { title: 'ギャラリー - ペルソナ5 ザ・ファントム X LufelNet', desc: 'P5X ギャラリー。サムネイルをクリックして原寸画像を表示します。' }
    };
    const cur = seo[lang] || seo.kr;
    document.title = cur.title;
    const metaD = document.querySelector('meta[name="description"]');
    const ogT = document.querySelector('meta[property="og:title"]');
    const ogD = document.querySelector('meta[property="og:description"]');
    if (metaD) metaD.setAttribute('content', cur.desc);
    if (ogT) ogT.setAttribute('content', cur.title);
    if (ogD) ogD.setAttribute('content', cur.desc);

    // Navigation path 번역
    const navHomeEl = document.getElementById('nav-home');
    const navCurEl = document.getElementById('nav-current');
    if (navHomeEl) navHomeEl.textContent = t.navHome;
    if (navCurEl) navCurEl.textContent = t.navCurrent;
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
      if (lang === 'jp' && entry.name_jp) {
        return name_jp;
      }
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
   * 카드 렌더링
   */
  function render(list){
    gridEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    list.forEach(item=>{
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
      // 최대 4개만 표시 4개보다 많을 경우 ... 추가
      // 모바일의 경우 3개만 표시
      const isMobile = window.innerWidth <= 768;
      let tags_sliced = [];
      if (isMobile) {
        tags_sliced = (item.tags||[]).map(t=> localizeCharacterTag(t, lang)).slice(0, 3);  
        if (tags_sliced.length < item.tags.length) {
          tags_sliced.push('...');
        }
      } else {
        tags_sliced = (item.tags||[]).map(t=> localizeCharacterTag(t, lang)).slice(0, 4);  
        if (tags_sliced.length < item.tags.length) {
          tags_sliced.push('...');
        }
      }
      
      tags_sliced.forEach(t=>{
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        if (t === '...') {
          chip.textContent = t;
        } else {
          chip.textContent = `#${t}`;
        }
        tags.appendChild(chip);
      });
      cap.appendChild(tags);
      // 클릭으로 모달
      thumb.addEventListener('click', ()=> openModal(item));
      card.appendChild(thumb); card.appendChild(cap);
      frag.appendChild(card);
    });
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
    (item.tags||[]).map(t=> localizeCharacterTag(t, lang)).forEach(t=>{
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

  function main(){
    applyI18n();
    wireModal();

    Promise.all([fetchJsonList(), fetchDirFiles()]).then(([jsonList])=>{
      const list = [...jsonList];
      modalList = [...list];
      populateFilters(list);
      const update = ()=>{ const out = sortList(filterList(list)); modalList = [...out]; render(out); };
      [searchInput, categorySelect, tagSelect, sortSelect].forEach(el=> el && el.addEventListener('input', update));
      update();
    }).catch(err=>{
      console.error(err);
      gridEl.innerHTML = '<div style="color:rgba(255,255,255,0.7); padding:12px;">Failed to load gallery data.</div>';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();


