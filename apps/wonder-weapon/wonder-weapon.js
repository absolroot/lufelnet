// Wonder Weapon Page JavaScript

(function () {
  'use strict';

  const BASE_URL = (typeof window !== 'undefined' && window.BASE_URL) ? window.BASE_URL : '';
  const APP_VERSION = (typeof window !== 'undefined' && window.APP_VERSION) ? window.APP_VERSION : Date.now().toString();

  // No-op: do not delete data globals; they are provided by data files

  // Load data files
  async function loadDataFiles() {
    return new Promise((resolve, reject) => {
      // Remove any previous scripts to avoid duplication
      document.querySelectorAll('script[src*="/data/kr/wonder/weapons.js"]').forEach(s => s.remove());
      document.querySelectorAll('script[src*="/data/kr/characters/characters.js"]').forEach(s => s.remove());

      const scripts = [
        '/data/kr/wonder/weapons.js',
        '/data/kr/characters/characters.js',
      ];

      let loaded = 0;
      scripts.forEach(src => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => {
          loaded++;
          if (loaded === scripts.length) {
            resolve();
          }
        };
        s.onerror = () => reject(new Error('Failed to load ' + src));
        document.head.appendChild(s);
      });
    });
  }

  // Per-character party loader (new structure)
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const exists = Array.from(document.scripts).some(s => s.src && s.src.includes(src));
      if (exists) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  async function loadJSON(src) {
    const res = await fetch(src, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function loadPerCharacterParty(name) {
    try {
      window.recommendParty = window.recommendParty || {};
      const folder = encodeURIComponent(name);
      const base = `/data/characters/${folder}/party`;
      // Try JS first
      await loadScript(`${base}.js?v=${APP_VERSION}`);
      if (window.recommendParty && window.recommendParty[name]) return;
      // Fallback to JSON
      const data = await loadJSON(`${base}.json?v=${APP_VERSION}`);
      window.recommendParty[name] = data || {};
    } catch (e) {
      // Silent: some characters might not have party data
    }
  }

  async function loadAllPartyData() {
    window.recommendParty = window.recommendParty || {};
    const list = (typeof characterList !== 'undefined' && characterList)
      ? [...(characterList.mainParty || []), ...(characterList.supportParty || [])]
      : [];
    if (!list.length) return;
    await Promise.all(list.map(loadPerCharacterParty));
  }

  // i18n helper - uses global t() function from i18n-service
  function t(key) {
    if (typeof window.t === 'function') {
      return window.t(key);
    }
    // Fallback defaults for initial load
    const fallbacks = {
      navHome: '홈',
      navCurrent: '원더 무기',
      pageTitle: '원더 무기',
      filterAll: '전체',
      filterShop: '교환',
      filterStory: '스토리',
      searchPlaceholder: '무기 검색...',
      labelSource: '획득처',
      labelEffect: '개조 설명',
      labelCharacters: '주요 괴도',
      labelShard: '수정',
      labelRelease: '출시 시점',
      labelLightningStamp: '빛의 각인',
      labelWeaponRelease: '무기',
      labelStampRelease: '빛의 각인',
      noResults: '검색 결과가 없습니다',
      loadFailed: '데이터를 불러올 수 없습니다',
      errorMessage: '데이터를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.'
    };
    return fallbacks[key] || key;
  }

  // Source map helper
  function getSourceMapValue(rawSource) {
    if (typeof window.t === 'function') {
      const sourceMap = window.t('sourceMap');
      if (sourceMap && typeof sourceMap === 'object') {
        return sourceMap[rawSource] || rawSource;
      }
    }
    // Fallback
    const defaultMap = {
      'Shop': '교환',
      'Palace 1': '팰리스 1',
      'Palace 2': '팰리스 2',
      'Palace 3': '팰리스 3',
      'Palace 3-2': '팰리스 3-2',
      'Palace 4': '팰리스 4',
      'Palace 5': '팰리스 5',
      'Palace 6': '팰리스 6',
      'Palace 7': '팰리스 7'
    };
    return defaultMap[rawSource] || rawSource;
  }

  // SEO per language (unchanged)
  function updateSEO() {
    const lang = (typeof LanguageRouter !== 'undefined' && LanguageRouter) ? LanguageRouter.getCurrentLanguage() : 'kr';
    const seo = {
      kr: {
        title: t('pageTitle') + ' - 페르소나5 더 팬텀 X 루페르넷',
        description: '페르소나5 더 팬텀 X의 원더 무기 정보. 획득처, 효과, 사용 캐릭터를 확인하세요.'
      },
      en: {
        title: t('pageTitle') + ' - Persona 5: The Phantom X LufelNet',
        description: 'Wonder weapon information for Persona 5: The Phantom X. See source, effect, and characters.'
      },
      jp: {
        title: t('pageTitle') + ' - ペルソナ5 ザ・ファントム X LufelNet',
        description: 'P5Xのワンダー武器情報。入手方法・効果・使用キャラを確認。'
      }
    }[lang] || null;

    if (!seo) return;
    document.title = seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (metaDescription) metaDescription.setAttribute('content', seo.description);
    if (ogTitle) ogTitle.setAttribute('content', seo.title);
    if (ogDescription) ogDescription.setAttribute('content', seo.description);
  }

  // Update static labels per language - now uses i18n system
  function updateStaticTexts() {
    // i18n 서비스가 data-i18n 속성으로 자동 처리하므로
    // 검색창 placeholder만 직접 처리
    const searchInput = document.getElementById('weaponSearch');
    if (searchInput) {
      searchInput.placeholder = t('searchPlaceholder');
    }
  }

  function normWeaponName(name) {
    if (!name) return '';
    return String(name).replace(/!/g, '').trim();
  }

  // Shard 체크 상태 관리 함수들
  function getShardStorageKey(weaponName) {
    return `wonder_weapon_shard_${weaponName}`;
  }

  function getShardCheckedState(weaponName) {
    try {
      const key = getShardStorageKey(weaponName);
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load shard state:', e);
    }
    return {};
  }

  function saveShardCheckedState(weaponName, state) {
    try {
      const key = getShardStorageKey(weaponName);
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save shard state:', e);
    }
  }

  function isShardChecked(weaponName, shardIndex) {
    const state = getShardCheckedState(weaponName);
    return state[shardIndex] === true;
  }

  function toggleShardChecked(weaponName, shardIndex) {
    const state = getShardCheckedState(weaponName);
    state[shardIndex] = !state[shardIndex];
    saveShardCheckedState(weaponName, state);
    return state[shardIndex];
  }

  function getCheckedShardCount(weaponName) {
    const state = getShardCheckedState(weaponName);
    let count = 0;
    for (let i = 1; i <= 6; i++) {
      if (state[i] === true) {
        count++;
      }
    }
    return count;
  }

  function updateWeaponTabShardIcon(weaponName) {
    const count = getCheckedShardCount(weaponName);
    const tab = document.querySelector(`.weapon-tab[data-weapon="${weaponName}"]`);
    if (!tab) return;

    const imgWrapper = tab.querySelector('.weapon-tab-image-wrapper');
    if (!imgWrapper) return;

    // 기존 아이콘 제거
    const existingIconWrapper = imgWrapper.querySelector('.weapon-tab-shard-icon-wrapper');
    if (existingIconWrapper) {
      existingIconWrapper.remove();
    }

    // 체크된 것이 있으면 아이콘 추가
    if (count > 0) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'weapon-tab-shard-icon-wrapper';
      const icon = document.createElement('img');
      icon.className = 'weapon-tab-shard-icon';
      icon.src = `${BASE_URL}/assets/img/ritual/r${count}.png`;
      icon.alt = `r${count}`;
      icon.loading = 'lazy';
      iconWrapper.appendChild(icon);
      imgWrapper.appendChild(iconWrapper);
    }
  }

  function getLocalizedName(koreanName, lang) {
    const data = (typeof matchWeapons !== 'undefined') && matchWeapons[koreanName];
    if (!data) return koreanName;
    if (lang === 'en' && data.name_en) return data.name_en;
    if (lang === 'jp' && data.name_jp) return data.name_jp;
    return koreanName;
  }

  function getLocalizedEffect(koreanName, lang) {
    const data = (typeof matchWeapons !== 'undefined') && matchWeapons[koreanName];
    if (!data) return '';
    if (lang === 'en' && data.effect_en) return data.effect_en;
    if (lang === 'jp' && data.effect_jp) return data.effect_jp;
    return data.effect || '';
  }

  function getLocalizedSource(koreanName, lang) {
    const data = (typeof matchWeapons !== 'undefined') && matchWeapons[koreanName];
    const raw = (data && data.where_to_get) ? data.where_to_get : '';
    return getSourceMapValue(raw);
  }

  // Character helpers
  function getCharacterLabel(koreanCharName, lang) {
    const c = (typeof characterData !== 'undefined') ? characterData[koreanCharName] : null;
    if (!c) return koreanCharName;
    if (lang === 'en' && c.codename) return c.codename;
    if (lang === 'jp' && c.name_jp) return c.name_jp;
    return koreanCharName; // default KR label
  }

  function isPriorityUser(koreanCharName, koreanWeaponName) {
    if (typeof recommendParty === 'undefined') return false;
    const cfg = recommendParty[koreanCharName];
    if (!cfg || !Array.isArray(cfg.weapon)) return false;
    const target = normWeaponName(koreanWeaponName);
    return cfg.weapon.some(w => normWeaponName(w) === target && /!/.test(w));
  }

  // Sorting state
  let sortOrder = 'desc'; // default: latest first
  let selectedWeapon = null;
  let currentSourceFilter = 'all';
  let currentSearchQuery = '';

  function getSortedWeaponKeys() {
    const keys = (typeof matchWeapons !== 'undefined') ? Object.keys(matchWeapons) : [];
    const arr = keys.map(k => {
      const w = matchWeapons[k] || {};
      const rawOrder = w.order;
      const baseOrder = Number.isFinite(Number(rawOrder)) ? Number(rawOrder) : 0;

      const stamps = Array.isArray(w.lightning_stamp) ? w.lightning_stamp : [];
      const hasStamp = stamps.length > 0;
      const stampOrder = hasStamp
        ? stamps.reduce((max, s) => {
          const so = Number(s && s.order);
          return Number.isFinite(so) ? Math.max(max, so) : max;
        }, 0)
        : 0;

      return {
        key: k,
        order: baseOrder,
        hasStamp,
        stampOrder
      };
    });

    arr.sort((a, b) => {
      // 1) lightning_stamp 보유 무기 우선
      if (a.hasStamp && !b.hasStamp) return -1;
      if (!a.hasStamp && b.hasStamp) return 1;

      // 2) 둘 다 lightning_stamp가 있으면 stamp order 내림차순
      if (a.hasStamp && b.hasStamp && a.stampOrder !== b.stampOrder) {
        return b.stampOrder - a.stampOrder;
      }

      // 3) 그 외에는 기존 출시 순 정렬 유지
      return sortOrder === 'asc' ? (a.order - b.order) : (b.order - a.order);
    });

    return arr.map(x => x.key);
  }

  function findUsersOfWeapon(koreanName) {
    const users = [];
    if (typeof recommendParty === 'undefined') return users;

    const target = normWeaponName(koreanName);
    Object.entries(recommendParty).forEach(([charName, cfg]) => {
      if (!cfg || !Array.isArray(cfg.weapon)) return;
      const has = cfg.weapon.some(w => normWeaponName(w) === target);
      if (has) users.push(charName);
    });
    return users;
  }

  // 탭 생성 함수
  async function createTabs() {
    const tabsContainer = document.getElementById('weaponTabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';

    const lang = (typeof LanguageRouter !== 'undefined' && LanguageRouter) ? LanguageRouter.getCurrentLanguage() : 'kr';
    // const t = i18n[lang] || i18n.kr;

    // 정렬된 무기 목록 가져오기
    const sortedKeys = getSortedWeaponKeys();

    sortedKeys.forEach((krName, index) => {
      const data = (typeof matchWeapons !== 'undefined') ? matchWeapons[krName] : null;
      if (!data) return;

      const displayName = getLocalizedName(krName, lang);
      const whereToGet = data.where_to_get || '';

      // 필터링: 전체, 교환(Shop), 스토리(Palace)
      let shouldShow = true;
      if (currentSourceFilter === 'Shop' && whereToGet !== 'Shop') {
        shouldShow = false;
      } else if (currentSourceFilter === 'story' && whereToGet === 'Shop') {
        shouldShow = false;
      }

      // 검색 필터링
      if (shouldShow && currentSearchQuery) {
        const query = currentSearchQuery.toLowerCase().trim();
        const nameKr = krName.toLowerCase();
        const nameEn = (data.name_en || '').toLowerCase();
        const nameJp = (data.name_jp || '').toLowerCase();
        const displayNameLower = displayName.toLowerCase();

        if (!nameKr.includes(query) &&
          !nameEn.includes(query) &&
          !nameJp.includes(query) &&
          !displayNameLower.includes(query)) {
          shouldShow = false;
        }
      }

      const tab = document.createElement('div');
      tab.className = 'weapon-tab';
      tab.dataset.weapon = krName;
      tab.dataset.weaponNameKr = krName;
      tab.dataset.weaponNameEn = data.name_en || '';
      tab.dataset.weaponNameJp = data.name_jp || '';
      tab.dataset.displayName = displayName;
      tab.dataset.whereToGet = whereToGet;

      if (!shouldShow) {
        tab.style.display = 'none';
      }

      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'weapon-tab-image-wrapper';

      const img = document.createElement('img');
      img.className = 'weapon-tab-image';
      img.src = `${BASE_URL}/assets/img/wonder-weapon/${krName}.webp`;
      img.alt = displayName;
      img.loading = 'lazy';
      img.onerror = function () {
        this.onerror = null;
        this.src = `${BASE_URL}/assets/img/placeholder.png`;
      };

      imgWrapper.appendChild(img);

      const info = document.createElement('div');
      info.className = 'weapon-tab-info';

      const name = document.createElement('div');
      name.className = 'weapon-tab-name';
      name.textContent = displayName;

      const source = document.createElement('div');
      source.className = 'weapon-tab-source';

      // 속성 아이콘 추가 (왼쪽에 배치)
      if (data.element) {
        const elementIcon = document.createElement('img');
        elementIcon.className = 'weapon-tab-element-icon';
        elementIcon.src = `${BASE_URL}/assets/img/skill-element/${data.element}.png`;
        elementIcon.alt = data.element;
        elementIcon.loading = 'lazy';
        source.appendChild(elementIcon);
      }

      const sourceText = document.createElement('span');
      sourceText.className = 'weapon-tab-source-text';
      sourceText.textContent = getLocalizedSource(krName, lang);
      source.appendChild(sourceText);

      info.appendChild(name);
      info.appendChild(source);

      tab.appendChild(imgWrapper);
      tab.appendChild(info);

      tab.addEventListener('click', () => {
        selectWeapon(krName, true); // 사용자 클릭으로 표시
      });

      tabsContainer.appendChild(tab);

      // 탭 생성 후 shard 아이콘 업데이트
      updateWeaponTabShardIcon(krName);
    });

    // 첫 번째 보이는 탭 선택 (비동기 처리로 탭이 완전히 렌더링된 후 선택)
    setTimeout(() => {
      const visibleTabs = Array.from(document.querySelectorAll('.weapon-tab:not([style*="display: none"])'));
      if (visibleTabs.length > 0 && !selectedWeapon) {
        const firstTab = visibleTabs[0];
        const firstWeapon = firstTab.dataset.weapon;
        if (firstWeapon) {
          selectedWeapon = firstWeapon;
          firstTab.classList.add('active');
          renderWeaponDetail(firstWeapon);
        }
      } else if (selectedWeapon) {
        const selectedTab = visibleTabs.find(tab => tab.dataset.weapon === selectedWeapon);
        if (selectedTab) {
          selectedTab.classList.add('active');
          renderWeaponDetail(selectedWeapon);
        } else if (visibleTabs.length > 0) {
          const firstTab = visibleTabs[0];
          const firstWeapon = firstTab.dataset.weapon;
          selectedWeapon = firstWeapon;
          firstTab.classList.add('active');
          renderWeaponDetail(firstWeapon);
        }
      }
    }, 0);
  }

  // 무기 선택 함수
  async function selectWeapon(krName, userInitiated = false) {
    if (selectedWeapon === krName) return;

    selectedWeapon = krName;

    // 탭 활성화
    document.querySelectorAll('.weapon-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.weapon === krName);
    });

    // 상세 정보 렌더링
    renderWeaponDetail(krName);

    // 모바일에서 detail까지 자동 스크롤 (사용자 클릭 시에만)
    if (userInitiated && window.innerWidth <= 768) {
      setTimeout(() => {
        const detailElement = document.getElementById('weaponDetail');
        if (detailElement) {
          detailElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100); // 렌더링 완료를 위한 약간의 지연
    }
  }

  // 필터 적용 함수
  function applyFilters() {
    const tabs = document.querySelectorAll('.weapon-tab');
    if (tabs.length === 0) return;

    tabs.forEach(tab => {
      let shouldShow = true;
      const whereToGet = tab.dataset.whereToGet || '';

      // 소스 필터
      if (currentSourceFilter === 'Shop' && whereToGet !== 'Shop') {
        shouldShow = false;
      } else if (currentSourceFilter === 'story' && whereToGet === 'Shop') {
        shouldShow = false;
      }

      // 검색 필터
      if (shouldShow && currentSearchQuery) {
        const query = currentSearchQuery.toLowerCase().trim();
        const nameKr = (tab.dataset.weaponNameKr || '').toLowerCase();
        const nameEn = (tab.dataset.weaponNameEn || '').toLowerCase();
        const nameJp = (tab.dataset.weaponNameJp || '').toLowerCase();
        const displayName = (tab.dataset.displayName || '').toLowerCase();

        if (!nameKr.includes(query) &&
          !nameEn.includes(query) &&
          !nameJp.includes(query) &&
          !displayName.includes(query)) {
          shouldShow = false;
        }
      }

      tab.style.display = shouldShow ? '' : 'none';
    });

    // 검색 결과가 없을 때 메시지 표시
    const visibleTabs = Array.from(document.querySelectorAll('.weapon-tab:not([style*="display: none"])'));
    const tabsContainer = document.getElementById('weaponTabs');
    if (visibleTabs.length === 0 && tabsContainer) {
      const noResultsDiv = document.createElement('div');
      noResultsDiv.style.cssText = 'padding: 20px; text-align: center; color: #999; grid-column: 1 / -1;';
      const lang = (typeof LanguageRouter !== 'undefined' && LanguageRouter) ? LanguageRouter.getCurrentLanguage() : 'kr';
      noResultsDiv.textContent = t('noResults');

      const existingMessage = tabsContainer.querySelector('div[style*="padding: 20px"]');
      if (existingMessage) existingMessage.remove();

      tabsContainer.appendChild(noResultsDiv);
    } else {
      const existingMessage = tabsContainer?.querySelector('div[style*="padding: 20px"]');
      if (existingMessage) existingMessage.remove();
    }

    // 필터링 후 첫 번째 보이는 탭 선택
    if (visibleTabs.length > 0) {
      const firstTab = visibleTabs[0];
      const firstWeapon = firstTab.dataset.weapon;
      if (selectedWeapon !== firstWeapon) {
        selectWeapon(firstWeapon);
      }
    }
  }

  // 무기 상세 정보 렌더링 함수 (synergy 스타일 - 완전히 HTML 문자열 방식)
  function renderWeaponDetail(krName) {
    const detailContainer = document.getElementById('weaponDetail');
    if (!detailContainer) return;

    const lang = (typeof LanguageRouter !== 'undefined' && LanguageRouter) ? LanguageRouter.getCurrentLanguage() : 'kr';
    // const t = i18n[lang] || i18n.kr;

    const data = (typeof matchWeapons !== 'undefined') ? matchWeapons[krName] : null;
    if (!data) {
      detailContainer.innerHTML = `<div style="padding: 40px; text-align: center; color: rgba(255,255,255,0.5);">${t('loadFailed')}</div>`;
      return;
    }

    const displayName = getLocalizedName(krName, lang);
    const effectText = getLocalizedEffect(krName, lang);
    const sourceText = getLocalizedSource(krName, lang);

    // 섹션 chevron SVG
    const chevronSvg = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="section-chevron"><path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    // 효과 렌더링 헬퍼 함수
    const sevenSplitReplace = /(\d+(?:\.\d+)?%?)(?:\s*\/\s*(\d+(?:\.\d+)?%?)){6}/g;
    function renderEffectHTML(src, idx) {
      const replaced = src.replace(sevenSplitReplace, (match) => {
        const parts = match.split('/').map(x => x.trim());
        return parts[Math.min(Math.max(idx, 0), 6)] || parts[0];
      });
      const numberRegex = /(\d+(?:\.\d+)?%?)/g;
      return replaced.replace(numberRegex, '<span class="num">$1</span>');
    }

    const needsLevels = /(\d+(?:\.\d+)?%?)(?:\s*\/\s*(\d+(?:\.\d+)?%?)){6}/.test(effectText || '');

    // HTML 시작: 헤더
    const elementIcon = data.element ? `<img src="${BASE_URL}/assets/img/skill-element/${data.element}.png" alt="${data.element}" class="detail-header-element-icon" loading="lazy">` : '';

    // 교환 표시 처리
    const isShop = data.where_to_get === 'Shop';
    const shopIcon = isShop ? `<img src="${BASE_URL}/assets/img/item-little-icon/item-huobi-49.png" alt="huobi" class="detail-source-icon" loading="lazy">` : '';
    const shopAmount = isShop ? '<span class="detail-source-amount">1,000</span>' : '';

    let html = `
      <div class="detail-header">
        <img src="${BASE_URL}/assets/img/wonder-weapon/${krName}.webp" alt="${displayName}" class="detail-header-image" onerror="this.onerror=null; this.style.display='none';">
        <div class="detail-header-info">
          <h2>${displayName}${elementIcon}</h2>
          <div class="detail-source-wrapper">
            <div class="detail-source">${t('labelSource')}: ${sourceText}</div>
            ${isShop ? `<div class="detail-source-shop">${shopIcon}${shopAmount}</div>` : ''}
          </div>
        </div>
      </div>
    `;

    // 1. 효과 섹션 (collapsible)
    html += `
      <div class="detail-section">
        <h3 class="detail-section-title collapsible">
          <span>${t('labelEffect')}</span>
          ${chevronSvg}
        </h3>
        <div class="section-content">
    `;

    // 레벨 컨트롤 (7레벨 분할이 있는 경우) - 상자 밖에 배치
    if (needsLevels) {
      html += `<div class="levels-controls" id="effect-levels">`;
      for (let i = 0; i < 7; i++) {
        html += `<button type="button" class="level-btn${i === 6 ? ' active' : ''}" data-level="${i}" aria-pressed="${i === 6 ? 'true' : 'false'}"><img src="${BASE_URL}/assets/img/character-weapon/r${i}.png" alt="A${i}" class="level-btn-icon" loading="lazy"></button>`;
      }
      html += `</div>`;
    }

    // 효과 텍스트 (상자 안에)
    html += `<div class="effect-text-wrapper"><div class="effect-text" id="effect-text">${renderEffectHTML(effectText || '', 6)}</div></div>`;
    html += `</div></div>`; // section-content, detail-section 닫기

    // lightning_stamp 효과 블록
    if (data && Array.isArray(data.lightning_stamp) && data.lightning_stamp.length) {
      const stamps = data.lightning_stamp.slice().sort((a, b) => {
        const ao = Number(a && a.order);
        const bo = Number(b && b.order);
        return (Number.isFinite(bo) ? bo : 0) - (Number.isFinite(ao) ? ao : 0);
      });

      const fourSplitReplace = /(\d+(?:\.\d+)?%?)(?:\s*\/\s*(\d+(?:\.\d+)?%?)){3}/g;
      function renderLightningStampHTML(src, idx) {
        const replaced = src.replace(fourSplitReplace, (match) => {
          const parts = match.split('/').map(x => x.trim());
          const i = Math.min(Math.max(idx, 0), 3);
          return parts[i] || parts[0];
        });
        const numberRegex = /(\d+(?:\.\d+)?%?)/g;
        return replaced.replace(numberRegex, '<span class="num">$1<\/span>');
      }

      const lightningStampTitle = t('labelLightningStamp');
      const lightningStampDesc = t('labelLightningStampDesc');

      html += `
        <div class="detail-section">
          <h3 class="detail-section-title collapsible">
            <span>${lightningStampTitle}</span>
            ${chevronSvg}
          </h3>
          <div class="section-content">
            ${lightningStampDesc ? `<div class="lightning-stamp-description">${lightningStampDesc}</div>` : ''}
      `;

      stamps.forEach((stamp, stampIndex) => {
        if (!stamp) return;

        const stampName =
          (lang === 'en' && stamp.name_en) ? stamp.name_en :
            (lang === 'jp' && stamp.name_jp) ? stamp.name_jp :
              stamp.name || '';
        const stampEffect =
          (lang === 'en' && stamp.effect_en) ? stamp.effect_en :
            (lang === 'jp' && stamp.effect_jp) ? stamp.effect_jp :
              stamp.effect || '';

        // 각 stamp의 stamp_icon 사용 (없으면 기본값)
        const stampIconImg = stamp.stamp_icon ? stamp.stamp_icon : 'weaponEngraving-icon-1.png';
        const stampIconPath = stamp.stamp_icon ? `${BASE_URL}/assets/img/wonder-weapon/${stampIconImg}` : `${BASE_URL}/assets/img/character-weapon/${stampIconImg}`;

        // 각 stamp의 stamp_img 사용
        const stampImgHtml = stamp.stamp_img ? `<img src="${BASE_URL}/assets/img/wonder-weapon/${stamp.stamp_img}" alt="${stampName}" class="detail-section-icon" loading="lazy">` : '';

        html += `
          <div class="lightning-stamp-block" data-stamp-index="${stampIndex}">
            <div class="lightning-stamp-header">
              <div class="lightning-stamp-name">${stampName}${stampImgHtml}</div>
            </div>
            <div class="levels-controls" data-stamp-index="${stampIndex}">
        `;

        const romanNumerals = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'];
        for (let i = 0; i < 4; i++) {
          html += `<button type="button" class="level-btn ${i === 3 ? 'active' : ''}" data-level="${i}" data-stamp-index="${stampIndex}" aria-pressed="${i === 3 ? 'true' : 'false'}"><img src="${stampIconPath}" alt="${i + 1}" class="level-btn-icon" loading="lazy"><span class="level-btn-roman">${romanNumerals[i]}</span></button>`;
        }

        html += `
            </div>
            <div class="effect-text" data-stamp-index="${stampIndex}">${renderLightningStampHTML(stampEffect || '', 3)}</div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    // 3. 주요 괴도 섹션 (collapsible)
    const users = findUsersOfWeapon(krName);
    html += `
      <div class="detail-section">
        <h3 class="detail-section-title collapsible">
          <span>${t('labelCharacters')}</span>
          ${chevronSvg}
        </h3>
        <div class="section-content">
    `;

    if (users.length) {
      html += `<div class="user-list">`;
      const sortedUsers = users.slice().sort((a, b) => {
        const pa = isPriorityUser(a, krName) ? 1 : 0;
        const pb = isPriorityUser(b, krName) ? 1 : 0;
        return pb - pa;
      });

      sortedUsers.forEach(u => {
        const isPriority = isPriorityUser(u, krName);
        const cdata = (typeof characterData !== 'undefined') ? characterData[u] : null;
        const pos = cdata && cdata.position ? cdata.position : '';
        const ele = cdata && cdata.element ? cdata.element : '';
        const charLabel = getCharacterLabel(u, lang);
        const href = u === '원더' ? '#' : `/character.html?name=${encodeURIComponent(u)}`;

        html += `
          <a href="${href}" class="character-link${isPriority ? ' priority' : ''}">
            <img src="${BASE_URL}/assets/img/tier/${u}.webp" alt="${u}" class="character-img" loading="lazy" onerror="this.onerror=null; this.src='${BASE_URL}/assets/img/character-half/${u}.webp';">
            <div class="character-info">
              <span class="character-name${isPriority ? ' priority' : ''}">${charLabel}</span>
              <span class="char-icons">
                ${pos ? `<img src="${BASE_URL}/assets/img/character-cards/직업_${pos}.png" alt="${pos}" loading="lazy" class="char-icon">` : ''}
                ${ele ? `<img src="${BASE_URL}/assets/img/character-cards/속성_${ele}.png" alt="${ele}" loading="lazy" class="char-icon">` : ''}
              </span>
            </div>
          </a>
        `;
      });

      html += `</div>`;
    } else {
      html += `-`;
    }

    html += `</div></div>`; // section-content, detail-section 닫기

    // 3.5. 수정(Shard) 섹션 (collapsible)
    if (data && Array.isArray(data.shard) && data.shard.length > 0) {
      // desc 텍스트에서 {}로 묶인 이미지 처리 및 볼드 처리 함수
      function renderShardDesc(desc) {
        if (!desc) return '';
        let result = desc;

        // 1. {item-huobi-49.png} 같은 패턴을 찾아서 이미지로 변환
        result = result.replace(/\{([^}]+\.png)\}/g, (match, imgName) => {
          return `<img src="${BASE_URL}/assets/img/item-little-icon/${imgName}" alt="${imgName}" class="shard-desc-icon" loading="lazy">`;
        });

        // 2. 볼드 처리
        // HTML 태그를 임시로 치환하여 보존
        const tagPlaceholders = [];
        let placeholderIndex = 0;
        result = result.replace(/<[^>]+>/g, (tag) => {
          const placeholder = `__TAG_${placeholderIndex}__`;
          tagPlaceholders[placeholderIndex] = tag;
          placeholderIndex++;
          return placeholder;
        });

        // 팰리스 또는 Palace로 시작하는 경우 (숫자와 하이픈 포함, 예: 팰리스3, Palace 3-2)
        const hasPalace = /(팰리스|Palace)/i.test(result);
        if (hasPalace) {
          // 팰리스/Palace와 뒤의 숫자(하이픈 포함)를 볼드 처리 (공백 보존)
          // \s+를 사용하여 공백을 명시적으로 포함하고 &nbsp;로 변환
          result = result.replace(/(팰리스|Palace)(\s+)(\d+(?:-\d+)?)(\s*)/gi, (match, prefix, spacesBefore, number, spacesAfter) => {
            const spacesBeforeHtml = spacesBefore.replace(/ /g, '&nbsp;');
            const spacesAfterHtml = spacesAfter.replace(/ /g, '&nbsp;');
            return `<strong>${prefix}${spacesBeforeHtml}${number}${spacesAfterHtml}</strong>`;
          });
          // 공백이 없는 경우도 처리 (예: 팰리스3)
          result = result.replace(/(팰리스|Palace)(\d+(?:-\d+)?)/gi, (match, prefix, number) => {
            // 이미 <strong> 태그로 감싸진 경우 스킵
            if (match.includes('<strong>')) {
              return match;
            }
            return `<strong>${prefix}${number}</strong>`;
          });
        } else {
          // '-' 이전까지 볼드 처리 (팰리스/Palace 패턴이 아닌 경우)
          // 공백을 포함하여 하이픈 이전까지 매칭
          result = result.replace(/([^-]+?)(\s*)(?=-)/g, (match, text, spaces) => {
            // HTML 태그가 포함된 경우 스킵
            if (text.includes('__TAG_') || match.includes('__TAG_')) {
              return match;
            }
            const trimmed = text.trim();
            // 공백만 있거나 빈 문자열이면 스킵
            if (!trimmed) {
              return match;
            }
            // 공백을 &nbsp;로 변환하여 strong 태그 안에 포함
            const spacesHtml = spaces.replace(/ /g, '&nbsp;');
            return `<strong>${text}${spacesHtml}</strong>`;
          });
        }

        // HTML 태그 복원
        tagPlaceholders.forEach((tag, index) => {
          result = result.replace(`__TAG_${index}__`, tag);
        });

        return result;
      }

      // shard가 1개면 6개로 복제
      let shardList = [...data.shard];
      if (shardList.length === 1) {
        shardList = Array(6).fill(null).map(() => ({ ...shardList[0] }));
      }

      html += `
        <div class="detail-section">
          <h3 class="detail-section-title collapsible">
            <span>${t('labelShard')}</span>
            ${chevronSvg}
          </h3>
          <div class="section-content">
            <div class="shard-grid">
      `;

      shardList.forEach((shardItem, index) => {
        if (!shardItem) return;

        const shardIndex = index + 1; // 1~6

        // 언어에 맞는 desc 가져오기
        const shardDesc =
          (lang === 'en' && shardItem.desc_en) ? shardItem.desc_en :
            (lang === 'jp' && (shardItem.desc_jp || shardItem.dsec_jp)) ? (shardItem.desc_jp || shardItem.dsec_jp) :
              shardItem.desc || '';

        // 체크 상태 확인
        const checked = isShardChecked(krName, shardIndex);
        const checkSvg = checked ? `
          <svg class="shard-check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#4caf50" stroke="#4caf50" stroke-width="2"/>
            <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        ` : '';

        html += `
          <div class="shard-item">
            <div class="shard-icon-cell">
              <div class="shard-icon-wrapper" data-weapon="${krName}" data-shard-index="${shardIndex}">
                <img src="${BASE_URL}/assets/img/wonder-weapon/${krName}_수정.png" alt="${displayName} 수정" class="shard-icon ${checked ? 'checked' : ''}" loading="lazy" onerror="this.onerror=null; this.style.display='none';">
                ${checkSvg}
              </div>
            </div>
            <div class="shard-desc-cell">
              ${renderShardDesc(shardDesc)}
            </div>
          </div>
        `;
      });

      html += `
            </div>
          </div>
        </div>
      `;
    }

    // 4. 출시 시점 섹션 (collapsible) - dialog-choice 스타일
    html += `
      <div class="detail-section">
        <h3 class="detail-section-title collapsible">
          <span>${t('labelRelease')}</span>
          ${chevronSvg}
        </h3>
        <div class="section-content">
          <div class="release-container">
            <div class="release-column">
              <div class="release-column-title">${t('labelWeaponRelease')}</div>
              <div class="dialog-choices">
    `;

    const releaseVal = data && data.release ? String(data.release) : '';
    if (releaseVal) {
      if (/palace/i.test(releaseVal)) {
        const mapped = getSourceMapValue(releaseVal);
        html += `
          <div class="dialog-choice">
            <div class="dialog-choice-content">${mapped}</div>
          </div>
        `;
      } else {
        const charLabel = getCharacterLabel(releaseVal, lang);
        const href = releaseVal === '원더' ? '#' : `/character.html?name=${encodeURIComponent(releaseVal)}`;

        html += `
          <a href="${href}" class="dialog-choice">
            <div class="dialog-choice-content">
              <img src="${BASE_URL}/assets/img/tier/${releaseVal}.webp" alt="${releaseVal}" class="character-img-small" loading="lazy" onerror="this.onerror=null; this.src='${BASE_URL}/assets/img/character-half/${releaseVal}.webp';">
              <span>${charLabel}</span>
            </div>
          </a>
        `;
      }
    } else {
      html += `
        <div class="dialog-choice">
          <div class="dialog-choice-content">-</div>
        </div>
      `;
    }

    html += `
              </div>
            </div>
            <div class="release-column">
              <div class="release-column-title">${t('labelStampRelease')}</div>
              <div class="dialog-choices">
    `;

    // Lightning Stamp 출시 정보
    if (data && Array.isArray(data.lightning_stamp)) {
      const stampReleases = data.lightning_stamp.filter(s => s && s.release);
      if (stampReleases.length) {
        stampReleases.forEach((stamp) => {
          const charName = String(stamp.release);
          const stampNameLabel =
            (lang === 'en' && stamp.name_en) ? stamp.name_en :
              (lang === 'jp' && stamp.name_jp) ? stamp.name_jp :
                stamp.name || '';
          const charLabel = getCharacterLabel(charName, lang);
          const href = charName === '원더' ? '#' : `/character.html?name=${encodeURIComponent(charName)}`;

          html += `
            <div class="dialog-choice-group">
              <div class="stamp-release-name">${stampNameLabel}</div>
              <a href="${href}" class="dialog-choice">
                <div class="dialog-choice-content">
                  <img src="${BASE_URL}/assets/img/tier/${charName}.webp" alt="${charName}" class="character-img-small" loading="lazy" onerror="this.onerror=null; this.src='${BASE_URL}/assets/img/character-half/${charName}.webp';">
                  <span>${charLabel}</span>
                </div>
              </a>
            </div>
          `;
        });
      } else {
        html += `
          <div class="dialog-choice">
            <div class="dialog-choice-content">-</div>
          </div>
        `;
      }
    } else {
      html += `
        <div class="dialog-choice">
          <div class="dialog-choice-content">-</div>
        </div>
      `;
    }

    html += `
              </div>
            </div>
          </div>
    `;

    html += `</div></div>`; // section-content, detail-section 닫기

    detailContainer.innerHTML = html;

    // Collapsible 섹션 초기화 (라이브러리 사용)
    if (typeof setupCollapsibleSections === 'function') {
      setupCollapsibleSections('weaponDetail');
    }

    // Lightning Stamp 레벨 버튼 이벤트 핸들러
    detailContainer.querySelectorAll('.levels-controls[data-stamp-index] button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const stampIndex = btn.dataset.stampIndex;
        const level = parseInt(btn.dataset.level);
        const stamps = data.lightning_stamp.slice().sort((a, b) => {
          const ao = Number(a && a.order);
          const bo = Number(b && b.order);
          return (Number.isFinite(bo) ? bo : 0) - (Number.isFinite(ao) ? ao : 0);
        });
        const stamp = stamps[parseInt(stampIndex)];
        if (!stamp) return;

        const stampEffect =
          (lang === 'en' && stamp.effect_en) ? stamp.effect_en :
            (lang === 'jp' && stamp.effect_jp) ? stamp.effect_jp :
              stamp.effect || '';

        const fourSplitReplace = /(\d+(?:\.\d+)?%?)(?:\s*\/\s*(\d+(?:\.\d+)?%?)){3}/g;
        function renderLightningStampHTML(src, idx) {
          const replaced = src.replace(fourSplitReplace, (match) => {
            const parts = match.split('/').map(x => x.trim());
            const i = Math.min(Math.max(idx, 0), 3);
            return parts[i] || parts[0];
          });
          const numberRegex = /(\d+(?:\.\d+)?%?)/g;
          return replaced.replace(numberRegex, '<span class="num">$1<\/span>');
        }

        // 버튼 활성화 상태 업데이트
        const controls = detailContainer.querySelector(`.levels-controls[data-stamp-index="${stampIndex}"]`);
        controls.querySelectorAll('button').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // 효과 텍스트 업데이트
        const effectTextEl = detailContainer.querySelector(`.effect-text[data-stamp-index="${stampIndex}"]`);
        if (effectTextEl) {
          effectTextEl.innerHTML = renderLightningStampHTML(stampEffect || '', level);
        }
      });
    });

    // 효과 레벨 버튼 자동 선택 함수
    function updateEffectLevelFromShard() {
      if (!needsLevels) return;
      const effectLevelsContainer = detailContainer.querySelector('#effect-levels');
      const effectTextContainer = detailContainer.querySelector('#effect-text');
      if (!effectLevelsContainer || !effectTextContainer) return;

      const shardCount = getCheckedShardCount(krName);
      // shard 개수에 따라 레벨 결정 (0~6, 최대 6)
      const targetLevel = Math.min(shardCount, 6);

      // 해당 레벨 버튼 찾기 및 활성화
      const targetBtn = effectLevelsContainer.querySelector(`.level-btn[data-level="${targetLevel}"]`);
      if (targetBtn) {
        effectLevelsContainer.querySelectorAll('.level-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        targetBtn.classList.add('active');
        targetBtn.setAttribute('aria-pressed', 'true');
        effectTextContainer.innerHTML = renderEffectHTML(effectText || '', targetLevel);
      }
    }

    // 효과 레벨 버튼 이벤트 핸들러
    if (needsLevels) {
      const effectLevelsContainer = detailContainer.querySelector('#effect-levels');
      const effectTextContainer = detailContainer.querySelector('#effect-text');
      if (effectLevelsContainer && effectTextContainer) {
        // 초기 로드 시 shard 개수에 따라 자동 선택
        updateEffectLevelFromShard();

        effectLevelsContainer.querySelectorAll('.level-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const level = parseInt(btn.dataset.level);
            effectLevelsContainer.querySelectorAll('.level-btn').forEach(b => {
              b.classList.remove('active');
              b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            effectTextContainer.innerHTML = renderEffectHTML(effectText || '', level);
          });
        });
      }
    }

    // Shard 아이콘 클릭 이벤트 핸들러
    detailContainer.querySelectorAll('.shard-icon-wrapper').forEach(wrapper => {
      wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        const weaponName = wrapper.dataset.weapon;
        const shardIndex = parseInt(wrapper.dataset.shardIndex);

        const isChecked = toggleShardChecked(weaponName, shardIndex);
        const icon = wrapper.querySelector('.shard-icon');
        const checkIcon = wrapper.querySelector('.shard-check-icon');

        if (isChecked) {
          icon.classList.add('checked');
          if (!checkIcon) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'shard-check-icon');
            svg.setAttribute('width', '24');
            svg.setAttribute('height', '24');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '12');
            circle.setAttribute('cy', '12');
            circle.setAttribute('r', '10');
            circle.setAttribute('fill', '#4caf50');
            circle.setAttribute('stroke', '#4caf50');
            circle.setAttribute('stroke-width', '2');
            svg.appendChild(circle);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M8 12L11 15L16 9');
            path.setAttribute('stroke', 'white');
            path.setAttribute('stroke-width', '2.5');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            svg.appendChild(path);

            wrapper.appendChild(svg);
          }
        } else {
          icon.classList.remove('checked');
          if (checkIcon) {
            checkIcon.remove();
          }
        }

        // 탭 아이콘 업데이트
        updateWeaponTabShardIcon(weaponName);

        // 효과 레벨 자동 업데이트 (현재 표시 중인 무기인 경우만)
        if (weaponName === krName) {
          updateEffectLevelFromShard();
        }
      });
    });
  }

  // DOMContentLoaded 이벤트 핸들러
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      // i18n 초기화
      if (typeof window.initPageI18n === 'function') {
        await window.initPageI18n('wonder-weapon');
      }

      const lang = (typeof LanguageRouter !== 'undefined' && LanguageRouter) ? LanguageRouter.getCurrentLanguage() : 'kr';

      if (typeof Navigation !== 'undefined') {
        Navigation.load('wonderweapon', 1);
      }
      if (typeof VersionChecker !== 'undefined') {
        VersionChecker.check();
      }

      updateSEO();
      await loadDataFiles();
      updateStaticTexts();
      await loadAllPartyData();

      // 필터 이벤트 핸들러
      document.querySelectorAll('.source-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.source-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentSourceFilter = btn.dataset.source;
          applyFilters();
        });
      });

      // 검색 이벤트 핸들러
      const searchInput = document.getElementById('weaponSearch');
      if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            currentSearchQuery = e.target.value.trim();
            applyFilters();
          }, 300);
        });
      }

      // 탭 생성 및 초기 선택
      await createTabs();
    } catch (e) {
      console.error(e);
      const wrapper = document.querySelector('.main-wrapper');
      const div = document.createElement('div');
      div.className = 'error-message';
      div.textContent = '데이터를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.';
      wrapper.prepend(div);
    }
  });
})();

