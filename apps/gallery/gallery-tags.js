(function () {
  'use strict';

  const BASE = typeof BASE_URL !== 'undefined' ? BASE_URL : '';
  const IMAGES_DIR = `${BASE}/assets/img/gallery`;
  const THUMBS_DIR = `${BASE}/assets/img/gallery/thumbs`;
  const ILLUSTRATIONS_URL = `${BASE}/apps/gallery/gallery-tags.json?v=${Date.now()}`;
  const ALL_OUT_URL = `${BASE}/apps/gallery/allout-manifest.json?v=${Date.now()}`;
  const PAGE_SIZE = 20;

  const gridEl = document.getElementById('gallery-grid');
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const tagSelect = document.getElementById('tag-select');
  const sortSelect = document.getElementById('sort-select');
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const modalClose = document.getElementById('modal-close');
  const modalCaption = document.getElementById('modal-caption');
  const tabButtons = Array.from(document.querySelectorAll('[data-gallery-tab]'));
  const tabPanel = document.getElementById('gallery-content');

  let activeTab = 'illustrations';
  let lists = { illustrations: [], allout: [] };
  let filteredList = [];
  let modalList = [];
  let modalIndex = -1;
  let visibleCount = PAGE_SIZE;
  let ioLoadMore = null;

  function getLang() {
    try {
      return typeof LanguageRouter !== 'undefined'
        ? LanguageRouter.getCurrentLanguage()
        : (window.currentLang || 'kr');
    } catch (_) {
      return 'kr';
    }
  }

  function t(key, fallback = '') {
    try {
      return typeof window.t === 'function' ? window.t(key, fallback) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  async function waitForI18n(maxRetries = 50, delayMs = 100) {
    while (typeof window.t !== 'function' && maxRetries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      maxRetries -= 1;
    }
  }

  function applyI18n() {
    const titleEl = document.getElementById('gallery-title');
    if (titleEl) titleEl.textContent = t('pageTitle', '갤러리');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder', '검색...');
    if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
      window.SeoEngine.setContextHint({ domain: 'gallery', mode: 'list' }, { rerun: true });
    }
    const navHomeEl = document.getElementById('nav-home');
    const navCurrentEl = document.getElementById('nav-current');
    if (navHomeEl) navHomeEl.textContent = t('nav.home', '홈');
    if (navCurrentEl) navCurrentEl.textContent = t('navCurrent', '갤러리');
  }

  async function fetchList(url, mediaType) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load ${mediaType} gallery data.`);
    const list = await response.json();
    return list.map((item, index) => ({
      filename: item.filename,
      thumbnail: item.thumbnail || '',
      tags: Array.isArray(item.tags) ? item.tags : [],
      category: Array.isArray(item.category) ? item.category : [],
      order: Number.isFinite(item.order) ? item.order : index + 1,
      mediaType
    }));
  }

  function localizeCharacterTag(tag, lang, fullName = false) {
    try {
      const data = window.characterData && typeof window.characterData === 'object'
        ? window.characterData
        : (typeof characterData === 'object' ? characterData : null);
      const entry = data && data[tag];
      if (!entry) return tag;
      if (lang === 'en' && entry.name_en) return fullName ? entry.name_en : entry.name_en.split(' ')[0];
      if (lang === 'jp' && entry.name_jp) return entry.name_jp;
      if (lang === 'cn' && entry.name_cn) return entry.name_cn;
      return tag;
    } catch (_) {
      return tag;
    }
  }

  function getLocalizedTagLabel(rawTag, item) {
    const lang = getLang();
    const byCharacter = localizeCharacterTag(rawTag, lang, item && item.mediaType === 'allout');
    if (byCharacter && byCharacter !== rawTag) return byCharacter;
    try {
      const translated = window.GalleryI18N && window.GalleryI18N.translateTag(rawTag, lang);
      return translated || rawTag;
    } catch (_) {
      return rawTag;
    }
  }

  function getLocalizedCategoryLabel(rawCategory) {
    try {
      return window.GalleryI18N && window.GalleryI18N.translateCategory(rawCategory, getLang()) || rawCategory;
    } catch (_) {
      return rawCategory;
    }
  }

  function collectUnique(list, key) {
    return Array.from(new Set(list.flatMap((item) => Array.isArray(item[key]) ? item[key].map(String) : [])));
  }

  function resetSelect(select, label) {
    select.replaceChildren();
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = label;
    select.appendChild(allOption);
  }

  function populateFilters(list) {
    resetSelect(categorySelect, t('filterAllGroups', t('filterAll', '전체')));
    resetSelect(tagSelect, t('filterAllTags', '모든 태그'));
    const isAllOut = activeTab === 'allout';
    categorySelect.hidden = isAllOut;

    if (!isAllOut) {
      collectUnique(list, 'category')
        .sort((a, b) => getLocalizedCategoryLabel(a).localeCompare(getLocalizedCategoryLabel(b)))
        .forEach((category) => {
          const option = document.createElement('option');
          option.value = category;
          option.textContent = getLocalizedCategoryLabel(category);
          categorySelect.appendChild(option);
        });
    }

    const tagItems = new Map();
    list.forEach((item) => item.tags.forEach((tag) => tagItems.set(String(tag), item)));
    Array.from(tagItems.entries())
      .sort(([a, itemA], [b, itemB]) => getLocalizedTagLabel(a, itemA).localeCompare(getLocalizedTagLabel(b, itemB)))
      .forEach(([tag, item]) => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = getLocalizedTagLabel(tag, item);
        tagSelect.appendChild(option);
      });
  }

  function sortList(list) {
    const byOrder = (a, b) => a.order - b.order || a.filename.localeCompare(b.filename);
    const byName = (a, b) => a.filename.localeCompare(b.filename);
    if (sortSelect.value === 'order_desc') return [...list].sort((a, b) => byOrder(b, a));
    if (sortSelect.value === 'name_asc') return [...list].sort(byName);
    if (sortSelect.value === 'name_desc') return [...list].sort((a, b) => byName(b, a));
    return [...list].sort(byOrder);
  }

  function filterList(list) {
    const query = (searchInput.value || '').toLowerCase().trim();
    const category = categorySelect.value;
    const tag = tagSelect.value;
    return list.filter((item) => {
      if (category && !item.category.includes(category)) return false;
      if (tag && !item.tags.map(String).includes(tag)) return false;
      if (!query) return true;
      return [item.filename, ...item.category, ...item.tags].join(' ').toLowerCase().includes(query);
    });
  }

  function buildImageUrl(item) {
    const relativePath = item.mediaType === 'allout' ? `allout/${item.filename}` : item.filename;
    const parts = relativePath.split('/').map((part) => encodeURIComponent(part));
    return `${IMAGES_DIR}/${parts.join('/')}`;
  }

  function buildThumbUrl(item) {
    const thumbnail = item.thumbnail || item.filename.replace(/\.[^.]+$/, '.webp');
    const parts = thumbnail.split('/').map((part) => encodeURIComponent(part));
    return `${THUMBS_DIR}/${parts.join('/')}`;
  }

  function setupLazy(container) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const image = entry.target;
        const source = image.dataset.src;
        if (source) image.src = source;
        delete image.dataset.src;
        observer.unobserve(image);
      });
    }, { rootMargin: '200px' });
    container.querySelectorAll('img[data-src]').forEach((image) => observer.observe(image));
  }

  function buildCard(item) {
    const card = document.createElement('article');
    card.className = `gallery-card${item.mediaType === 'allout' ? ' is-allout' : ''}`;
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'thumb-wrapper';
    thumb.setAttribute('aria-label', `${getLocalizedTagLabel(item.tags[0], item)} ${t('openImage', '이미지 열기')}`);
    const image = document.createElement('img');
    image.alt = item.filename;
    image.dataset.src = buildThumbUrl(item);
    image.addEventListener('load', () => image.classList.add('loaded'), { once: true });
    image.addEventListener('error', () => {
      if (image.dataset.fallbackLoaded === 'true') return;
      image.dataset.fallbackLoaded = 'true';
      image.src = buildImageUrl(item);
    }, { once: true });
    image.decoding = 'async';
    image.loading = 'lazy';
    thumb.appendChild(image);
    thumb.addEventListener('click', () => openModal(item));

    const caption = document.createElement('div');
    caption.className = 'card-caption';
    const tags = document.createElement('div');
    tags.className = 'tags';
    const maxTags = getLang() === 'jp' && window.innerWidth <= 768 ? 2 : (window.innerWidth <= 768 || getLang() === 'jp' ? 3 : 4);
    item.tags.slice(0, maxTags).forEach((tag) => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = `#${getLocalizedTagLabel(tag, item)}`;
      tags.appendChild(chip);
    });
    caption.appendChild(tags);
    card.append(thumb, caption);
    return card;
  }

  function render(list, append = false) {
    if (!append) gridEl.replaceChildren();
    const fragment = document.createDocumentFragment();
    list.forEach((item) => fragment.appendChild(buildCard(item)));
    gridEl.appendChild(fragment);
    setupLazy(gridEl);
  }

  function refreshArrows() {
    const previous = document.getElementById('modal-prev');
    const next = document.getElementById('modal-next');
    if (previous) previous.disabled = modalIndex <= 0;
    if (next) next.disabled = modalIndex >= modalList.length - 1;
  }

  function openModalByIndex(index) {
    modalIndex = index;
    const item = modalList[modalIndex];
    if (!item) return;
    modal.classList.toggle('is-allout', item.mediaType === 'allout');
    modalImg.src = buildImageUrl(item);
    modalImg.alt = item.filename;
    modalCaption.replaceChildren();
    item.tags.forEach((tag) => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = `#${getLocalizedTagLabel(tag, item)}`;
      modalCaption.appendChild(chip);
    });
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    refreshArrows();
  }

  function openModal(item) {
    const index = modalList.findIndex((entry) => entry.filename === item.filename);
    openModalByIndex(index >= 0 ? index : 0);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.classList.remove('is-allout');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    modalIndex = -1;
  }

  function moveModal(step) {
    const nextIndex = modalIndex + step;
    if (nextIndex >= 0 && nextIndex < modalList.length) openModalByIndex(nextIndex);
  }

  function wireModal() {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', (event) => {
      if (!modal.classList.contains('open')) return;
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowLeft') moveModal(-1);
      if (event.key === 'ArrowRight') moveModal(1);
    });
    document.getElementById('modal-prev').addEventListener('click', () => moveModal(-1));
    document.getElementById('modal-next').addEventListener('click', () => moveModal(1));
  }

  function ensureSentinel() {
    let sentinel = document.getElementById('gallery-sentinel');
    if (!sentinel) {
      sentinel = document.createElement('div');
      sentinel.id = 'gallery-sentinel';
      sentinel.style.height = '1px';
      gridEl.after(sentinel);
    }
    return sentinel;
  }

  function setupInfiniteScroll() {
    const sentinel = ensureSentinel();
    if (ioLoadMore) ioLoadMore.disconnect();
    ioLoadMore = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting) || visibleCount >= filteredList.length) return;
      const loader = document.getElementById('gallery-loader');
      if (loader) loader.style.display = 'flex';
      window.setTimeout(() => {
        const nextCount = Math.min(visibleCount + PAGE_SIZE, filteredList.length);
        render(filteredList.slice(visibleCount, nextCount), true);
        visibleCount = nextCount;
        if (loader) loader.style.display = 'none';
      }, 250);
    }, { rootMargin: '400px' });
    ioLoadMore.observe(sentinel);
  }

  function update() {
    filteredList = sortList(filterList(lists[activeTab]));
    modalList = [...filteredList];
    visibleCount = PAGE_SIZE;
    render(filteredList.slice(0, visibleCount));
    setupInfiniteScroll();
  }

  function setActiveTab(nextTab) {
    if (!lists[nextTab]) return;
    activeTab = nextTab;
    closeModal();
    categorySelect.value = '';
    tagSelect.value = '';
    tabButtons.forEach((button) => {
      const selected = button.dataset.galleryTab === activeTab;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && tabPanel) tabPanel.setAttribute('aria-labelledby', button.id);
    });
    populateFilters(lists[activeTab]);
    update();
  }

  function wireTabs() {
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => setActiveTab(button.dataset.galleryTab));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const targetIndex = event.key === 'Home' ? 0
          : event.key === 'End' ? tabButtons.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabButtons.length) % tabButtons.length;
        tabButtons[targetIndex].focus();
        setActiveTab(tabButtons[targetIndex].dataset.galleryTab);
      });
    });
  }

  async function main() {
    await waitForI18n();
    applyI18n();
    wireModal();
    wireTabs();
    try {
      const [illustrations, allout] = await Promise.all([
        fetchList(ILLUSTRATIONS_URL, 'illustrations'),
        fetchList(ALL_OUT_URL, 'allout')
      ]);
      lists = { illustrations, allout };
      [searchInput, categorySelect, tagSelect, sortSelect].forEach((element) => {
        element.addEventListener('input', update);
        element.addEventListener('change', update);
      });
      setActiveTab('illustrations');
    } catch (error) {
      console.error(error);
      gridEl.textContent = t('loadError', '갤러리 데이터를 불러오지 못했습니다.');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { void main(); });
  else void main();
})();
