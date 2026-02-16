;(function () {
  if (typeof window === 'undefined') return;

  // 로더(loadPerCharacterResource)에서 성공 여부를 확인하기 위한 플래그
  window.MONT2Icons = window.MONT2Icons || {};
  window.MONT2Icons['몽타뉴·백조'] = true;

  // 모드 정의
  const MONT2_MODES = [
    {
      id: 'spring',
      label: '봄',
      label_en: 'Spring',
      label_jp: '旋風',
      icon: '🌸',
      color: '#7cc576' // 연한 녹색 (질풍)
    },
    {
      id: 'winter',
      label: '겨울',
      label_en: 'Winter',
      label_jp: '銀盤',
      icon: '❄️',
      color: '#6bb3d9' // 연한 파랑 (빙결)
    }
  ];

  // 각 언어별 모드 구분 패턴 (skill1, skill2, skill3, highlight, passive2, ritual)
  const MODE_PATTERNS = {
    kr: {
      spring: ['『봄 형태』:', '『봄 형태』에서는', '『봄 형태』 :'],
      winter: ['『겨울 형태』:', '『겨울밤 형태』에서는', '『겨울밤 형태』:', '『겨울밤 형태』 :']
    },
    en: {
      spring: ['Spring mode:', 'While in Spring mode,'],
      winter: ['Winter mode:', 'While in Winter mode,']
    },
    jp: {
      spring: ['『旋風』状態：', '『旋風』状態:', '『旋風』状態の時'],
      winter: ['『銀盤』状態：', '『銀盤』状態:', '『銀盤』状態の時']
    }
  };

  // 패시브1 전용 패턴 (문장 단위 분리)
  const PASSIVE1_PATTERNS = {
    kr: {
      spring: ['질풍 속성 괴도를 편성하면', '질풍 대미지가'],
      winter: ['빙결 속성 괴도를 편성하면', '빙결 대미지가']
    },
    en: {
      spring: ['Wind ally', 'Wind damage', 'Frostgale Kotone\'s Wind damage'],
      winter: ['Ice ally', 'Ice damage', 'Frostgale Kotone\'s Ice damage']
    },
    jp: {
      spring: ['疾風属性の味方', '疾風属性ダメージ'],
      winter: ['氷結属性の味方', '氷結属性ダメージ']
    }
  };

  // 원본 속성 및 모드별 속성 매핑
  const ELEMENT_MAP = {
    spring: {
      single: '질풍',      // 스킬1, 스킬3, 하이라이트
      aoe: '질풍광역'       // 스킬2
    },
    winter: {
      single: '빙결',
      aoe: '빙결광역'
    },
    original: {
      single: '질풍빙결',
      aoe: '질풍빙결광역'
    }
  };

  // 선택된 모드 상태 (null = 전체 표시, 'spring' or 'winter')
  let selectedMode = null;

  function getCurrentLanguage() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      if (langParam === 'en') return 'en';
      if (langParam === 'jp') return 'jp';

      const path = window.location.pathname || '';
      if (path.includes('/en/')) return 'en';
      if (path.includes('/jp/')) return 'jp';
      return 'kr';
    } catch (_) {
      return 'kr';
    }
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function ensureMONT2Styles() {
    if (document.getElementById('mont2-mode-style')) return;
    const style = document.createElement('style');
    style.id = 'mont2-mode-style';
    style.textContent = `
      .mont2-mode-card {
        margin-bottom: 16px;
      }
      .mont2-mode-grid {
        margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-bottom: 10px;
      }
      .mont2-mode-button {
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.15);
        cursor: pointer;
        padding: 12px 8px;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease-out;
        color: #eee;
        font-size: 14px;
        font-weight: 500;
      }
      .mont2-mode-button:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-1px);
      }
      .mont2-mode-button .mont2-mode-icon {
        font-size: 20px;
      }
      .mont2-mode-button .mont2-mode-label {
        text-align: center;
        line-height: 1.2;
      }
      .mont2-mode-button.selected {
        transform: translateY(-2px);
      }
      .mont2-mode-button[data-mode="spring"].selected {
        box-shadow: 0 0 6px rgba(124, 197, 118, 0.35);
        background: rgba(124, 197, 118, 0.2);
        border-color: rgba(124, 197, 118, 0.5);
      }
      .mont2-mode-button[data-mode="winter"].selected {
        box-shadow: 0 0 6px rgba(107, 179, 217, 0.35);
        background: rgba(107, 179, 217, 0.2);
        border-color: rgba(107, 179, 217, 0.5);
      }
      .mont2-mode-button.dim {
        opacity: 0.4;
      }

      /* 의식 카드용 버튼 */
      .mont2-ritual-mode-card {
        margin-bottom: 16px;
      }

      @media (max-width: 768px) {
        .mont2-mode-button {
          padding: 10px 6px;
          font-size: 13px;
        }
        .mont2-mode-button .mont2-mode-icon {
          font-size: 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getLocalizedModeLabel(mode) {
    const lang = getCurrentLanguage();
    if (lang === 'en' && mode.label_en) return mode.label_en;
    if (lang === 'jp' && mode.label_jp) return mode.label_jp;
    return mode.label;
  }

  // 버튼 그리드 생성 함수 (공통)
  function createModeButtonGrid(gridClass) {
    const grid = document.createElement('div');
    grid.className = 'mont2-mode-grid';
    grid.setAttribute('data-mont2-mode-grid', 'true');

    MONT2_MODES.forEach(m => {
      const uiLabel = getLocalizedModeLabel(m);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mont2-mode-button';
      btn.dataset.mode = m.id;
      btn.title = uiLabel;

      const icon = document.createElement('span');
      icon.className = 'mont2-mode-icon';
      icon.textContent = m.icon;

      const label = document.createElement('span');
      label.className = 'mont2-mode-label';
      label.textContent = uiLabel;

      btn.appendChild(icon);
      btn.appendChild(label);

      btn.addEventListener('click', () => {
        const modeId = btn.dataset.mode;
        if (selectedMode === modeId) {
          selectedMode = null;
        } else {
          selectedMode = modeId;
        }
        triggerUpdate();
      });

      grid.appendChild(btn);
    });

    return grid;
  }

  function ensureMONT2SelectorCard() {
    ensureMONT2Styles();

    // 스킬 카드에 버튼 추가
    const skillsCard = document.querySelector('.skills-card.card-style');
    if (skillsCard && !document.querySelector('.mont2-mode-card')) {
      const card = document.createElement('div');
      card.className = 'mont2-mode-card';
      card.appendChild(createModeButtonGrid('skill'));

      const levelButtons = skillsCard.querySelector('.skill-level-buttons');
      const skillsGrid = skillsCard.querySelector('.skills-grid');
      if (levelButtons) {
        skillsCard.insertBefore(card, levelButtons);
      } else if (skillsGrid) {
        skillsCard.insertBefore(card, skillsGrid);
      } else {
        skillsCard.appendChild(card);
      }
    }

    // 의식 카드에 버튼 추가
    const ritualCard = document.querySelector('.ritual-card.card-style');
    if (ritualCard && !document.querySelector('.mont2-ritual-mode-card')) {
      const ritualModeCard = document.createElement('div');
      ritualModeCard.className = 'mont2-ritual-mode-card';
      ritualModeCard.appendChild(createModeButtonGrid('ritual'));

      const ritualHeader = ritualCard.querySelector('.ritual-header');
      const ritualGrid = ritualCard.querySelector('.ritual-grid');
      if (ritualHeader && ritualHeader.nextSibling) {
        ritualCard.insertBefore(ritualModeCard, ritualHeader.nextSibling);
      } else if (ritualGrid) {
        ritualCard.insertBefore(ritualModeCard, ritualGrid);
      } else {
        ritualCard.appendChild(ritualModeCard);
      }
    }

    updateMONT2Visuals();
  }

  function triggerUpdate() {
    updateMONT2Visuals();
    try {
      if (typeof window.applyMONT2Filter === 'function') {
        window.applyMONT2Filter();
      }
    } catch (e) {
      console.warn('[MONT2_icons] applyMONT2Filter error', e);
    }
  }

  function updateMONT2Visuals() {
    // 모든 모드 그리드의 버튼 상태 업데이트 (스킬 + 의식)
    const grids = document.querySelectorAll('[data-mont2-mode-grid="true"]');
    grids.forEach(grid => {
      const buttons = Array.from(grid.querySelectorAll('.mont2-mode-button'));
      buttons.forEach(btn => {
        const modeId = btn.dataset.mode;
        if (selectedMode === null) {
          btn.classList.remove('selected');
          btn.classList.remove('dim');
        } else if (selectedMode === modeId) {
          btn.classList.add('selected');
          btn.classList.remove('dim');
        } else {
          btn.classList.remove('selected');
          btn.classList.add('dim');
        }
      });
    });
  }

  // 일반 스킬/의식 설명 필터링 (skill1, skill2, skill3, highlight, passive2, ritual)
  function filterModeDescription(baseHtml, mode) {
    if (!baseHtml || !mode) return baseHtml;

    const lang = getCurrentLanguage();
    const patterns = MODE_PATTERNS[lang] || MODE_PATTERNS.kr;

    const keepMode = mode;
    const removeMode = mode === 'spring' ? 'winter' : 'spring';

    const keepPatterns = patterns[keepMode] || [];
    const removePatterns = patterns[removeMode] || [];

    const allPatterns = [...keepPatterns, ...removePatterns];
    const allHeadersPattern = allPatterns.map(h => escapeRegex(h)).join('|');

    let html = baseHtml;

    removePatterns.forEach(header => {
      const patternWithNewline = new RegExp(
        '\\n*' + escapeRegex(header) + '[\\s\\S]*?(?=(' + allHeadersPattern + '|$))',
        'g'
      );
      html = html.replace(patternWithNewline, '');
    });

    return html.trim();
  }

  // 패시브1 전용 필터링 (문장 단위로 분리)
  function filterPassive1Description(baseHtml, mode) {
    if (!baseHtml || !mode) return baseHtml;

    const lang = getCurrentLanguage();
    const patterns = PASSIVE1_PATTERNS[lang] || PASSIVE1_PATTERNS.kr;

    const keepPatterns = patterns[mode] || [];

    let sentences;
    let joinChar;
    
    if (lang === 'jp') {
      sentences = baseHtml.split(/\n/);
      joinChar = '\n';
    } else if (lang === 'en') {
      sentences = baseHtml.split(/\n/);
      joinChar = '\n';
    } else {
      sentences = baseHtml.split(/(?<=다)\.\s*/);
      joinChar = '. ';
    }

    const filteredSentences = sentences.filter(sentence => {
      if (!sentence.trim()) return false;
      for (const pattern of keepPatterns) {
        if (sentence.includes(pattern)) {
          return true;
        }
      }
      return false;
    });

    let result = filteredSentences.join(joinChar).trim();
    if (lang === 'kr' && result && !result.endsWith('.') && !result.endsWith('다')) {
      result += '.';
    }
    
    return result;
  }

  // 스킬 아이콘 변경
  function updateSkillIcons(mode) {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;

    const skillCards = skillsGrid.querySelectorAll('.skill-card');
    const baseUrl = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';

    const skillIconMapping = [
      { index: 0, type: 'single' },
      { index: 1, type: 'aoe' },
      { index: 2, type: 'single' },
      { index: 3, type: 'single' }
    ];

    skillIconMapping.forEach(({ index, type }) => {
      const card = skillCards[index];
      if (!card) return;

      const iconImg = card.querySelector('.skill-icon');
      if (!iconImg) return;

      if (!iconImg.dataset.originalSrc) {
        iconImg.dataset.originalSrc = iconImg.src;
      }

      let newElement;
      if (mode === null) {
        newElement = ELEMENT_MAP.original[type];
      } else {
        newElement = ELEMENT_MAP[mode][type];
      }

      iconImg.src = `${baseUrl}/assets/img/skill-element/${newElement}.png`;
    });
  }

  // 의식 설명 필터링
  function applyRitualFilter() {
    const ritualIndices = [1, 2, 4, 6]; // r1, r2, r4, r6만 필터링

    ritualIndices.forEach(index => {
      const ritualItem = document.querySelector(`.ritual-item[data-ritual="${index}"]`);
      if (!ritualItem) return;

      const descEl = ritualItem.querySelector('.ritual-description');
      if (!descEl) return;

      const baseAttr = 'mont2RitualBaseHtml_' + index;

      // 원본 저장
      if (!descEl.getAttribute('data-' + baseAttr)) {
        descEl.setAttribute('data-' + baseAttr, descEl.innerHTML);
      }

      const baseHtml = descEl.getAttribute('data-' + baseAttr) || '';

      if (selectedMode === null) {
        // 모드 미선택 시 원본 복원
        descEl.innerHTML = baseHtml;
      } else {
        // 모드 선택 시 필터링 적용
        const filtered = filterModeDescription(baseHtml, selectedMode);
        descEl.innerHTML = filtered;
      }
    });
  }

  function applyMONT2Filter() {
    try {
      let name = '';
      try {
        const params = new URLSearchParams(window.location.search);
        name = params.get('name') || window.__CHARACTER_DEFAULT || '';
      } catch (_) {
        name = window.__CHARACTER_DEFAULT || '';
      }

      if (name !== '몽타뉴·백조' && name !== '코토네 몽타뉴·백조') return;

      ensureMONT2SelectorCard();

      let currentLevelIndex = '-1';
      try {
        const activeBtn = document.querySelector('.skill-level-btn.active');
        if (activeBtn && typeof activeBtn.dataset.level !== 'undefined') {
          currentLevelIndex = String(activeBtn.dataset.level);
        }
      } catch (_) { }

      const skillsGrid = document.querySelector('.skills-grid');
      
      // 아이콘 업데이트
      updateSkillIcons(selectedMode);

      // 의식 필터링 적용
      applyRitualFilter();

      if (!skillsGrid) return;

      // 모드가 선택되지 않으면 원본 표시
      if (selectedMode === null) {
        restoreOriginalDescriptions();
        return;
      }

      const descElements = skillsGrid.querySelectorAll('.skill-description');

      const generalIndices = [0, 1, 2, 3, 5];
      const passive1Index = 4;

      // 일반 스킬 필터링
      generalIndices.forEach(index => {
        const el = descElements[index];
        if (!el) return;

        const baseAttr = 'mont2BaseHtml_' + index;
        const levelAttr = 'mont2BaseLevel_' + index;

        const prevLevel = el.getAttribute('data-' + levelAttr);
        if (!prevLevel || prevLevel !== currentLevelIndex || !el.getAttribute('data-' + baseAttr)) {
          el.setAttribute('data-' + baseAttr, el.innerHTML);
          el.setAttribute('data-' + levelAttr, currentLevelIndex);
        }

        const baseHtml = el.getAttribute('data-' + baseAttr) || '';
        const filtered = filterModeDescription(baseHtml, selectedMode);
        el.innerHTML = filtered;
      });

      // 패시브1 전용 필터링
      const passive1El = descElements[passive1Index];
      if (passive1El) {
        const baseAttr = 'mont2BaseHtml_' + passive1Index;
        const levelAttr = 'mont2BaseLevel_' + passive1Index;

        const prevLevel = passive1El.getAttribute('data-' + levelAttr);
        if (!prevLevel || prevLevel !== currentLevelIndex || !passive1El.getAttribute('data-' + baseAttr)) {
          passive1El.setAttribute('data-' + baseAttr, passive1El.innerHTML);
          passive1El.setAttribute('data-' + levelAttr, currentLevelIndex);
        }

        const baseHtml = passive1El.getAttribute('data-' + baseAttr) || '';
        const filtered = filterPassive1Description(baseHtml, selectedMode);
        passive1El.innerHTML = filtered;
      }

    } catch (e) {
      console.warn('[MONT2_icons] applyMONT2Filter error', e);
    }
  }

  function restoreOriginalDescriptions() {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;

    const descElements = skillsGrid.querySelectorAll('.skill-description');
    const targetIndices = [0, 1, 2, 3, 4, 5];

    targetIndices.forEach(index => {
      const el = descElements[index];
      if (!el) return;

      const baseAttr = 'mont2BaseHtml_' + index;
      const baseHtml = el.getAttribute('data-' + baseAttr);
      if (baseHtml) {
        el.innerHTML = baseHtml;
      }
    });

    // 아이콘도 원본으로 복원
    updateSkillIcons(null);
  }

  // 전역에서 호출 가능하도록 노출
  window.applyMONT2Filter = applyMONT2Filter;

  // 스킬 레벨 버튼 클릭 시 재적용을 위한 이벤트 리스너
  document.addEventListener('click', (e) => {
    if (e.target.closest('.skill-level-btn')) {
      setTimeout(() => {
        if (typeof window.applyMONT2Filter === 'function') {
          window.applyMONT2Filter();
        }
      }, 100);
    }
  });

})();
