;(function () {
  if (typeof window === 'undefined') return;

  // 로더(loadPerCharacterResource)에서 성공 여부를 확인하기 위한 플래그
  window.JCIcons = window.JCIcons || {};
  window.JCIcons['J&C'] = true;

  const LABEL_ICON_MAP = {
    // KR
    '장난과 천진': 'J&C 잭프로스트&잭오랜턴.png',
    '헌신과 경고': 'J&C 아가시온&스다마.png',
    '부조리와 비합리': 'J&C 시사&벅스.png',
    '복과와 화근': 'J&C 맨드레이크&온모라키.png',
    // KR (최신 Facade/모습 라벨)
    '어설픔': 'J&C 잭프로스트&잭오랜턴.png',
    '가르침': 'J&C 아가시온&스다마.png',
    '무질서': 'J&C 시사&벅스.png',
    '인과': 'J&C 맨드레이크&온모라키.png',

    // EN (skill.js / 외부 JSON 기준)
    'Mask of Mischief & Innocence': 'J&C 잭프로스트&잭오랜턴.png',
    'Mask of Service & Admonition': 'J&C 아가시온&스다마.png',
    'Mask of Absurdity & Nonsense': 'J&C 시사&벅스.png',
    'Mask of Luck & Loss': 'J&C 맨드레이크&온모라키.png',
    // EN Facade 라인 전용 (조합 설명부에서만 사용)
    'Facade of Mischief & Innocence': 'J&C 잭프로스트&잭오랜턴.png',
    'Facade of Service & Admonition': 'J&C 아가시온&스다마.png',
    'Facade of Absurdity & Nonsense': 'J&C 시사&벅스.png',
    'Facade of Luck & Loss': 'J&C 맨드레이크&온모라키.png',

    // JP (skill.js / 외부 JSON 기준)
    '悪戯と無邪気の仮面': 'J&C 잭프로스트&잭오랜턴.png',
    '奉仕と警告の仮面': 'J&C 아가시온&스다마.png',
    '不条理と非合理の仮面': 'J&C 시사&벅스.png',
    '福果と禍因の仮面': 'J&C 맨드레이크&온모라키.png',
    // JP 조합/Facade 라인 전용
    '相貌・悪戯と無邪気': 'J&C 잭프로스트&잭오랜턴.png',
    '相貌・奉仕と警告': 'J&C 아가시온&스다마.png',
    '相貌・不条理と非合理': 'J&C 시사&벅스.png',
    '相貌・福果と禍因': 'J&C 맨드레이크&온모라키.png'
  };

  // J&C 전용 페르소나(가면) 정의
  const JC_PERSONAS = [
    {
      id: 'TRICK_PURE',
      label: '장난과 천진',
      label_en: 'Mischief & Innocence',
      label_jp: '悪戯と無邪気',
      iconFile: 'J&C 잭프로스트&잭오랜턴.png',
      maskLabel: '장난과 천진의 페르소나',
      facadeLabel: '어설픔',
      maskLabel_en: 'Mask of Mischief & Innocence',
      maskLabel_jp: '悪戯と無邪気の仮面'
    },
    {
      id: 'SERV_WARN',
      label: '헌신과 경고',
      label_en: 'Service & Admonition',
      label_jp: '奉仕と警告',
      iconFile: 'J&C 아가시온&스다마.png',
      maskLabel: '헌신과 경고의 페르소나',
      facadeLabel: '가르침',
      maskLabel_en: 'Mask of Service & Admonition',
      maskLabel_jp: '奉仕と警告の仮面'
    },
    {
      id: 'ABSURD_ILLOGIC',
      label: '부조리와 비합리',
      label_en: 'Absurdity & Nonsense',
      label_jp: '不条理と非合理',
      iconFile: 'J&C 시사&벅스.png',
      maskLabel: '부조리와 비합리의 페르소나',
      facadeLabel: '무질서',
      maskLabel_en: 'Mask of Absurdity & Nonsense',
      maskLabel_jp: '不条理と非合理の仮面'
    },
    {
      id: 'FORTUNE_CALAMITY',
      label: '복과와 화근',
      label_en: 'Luck & Loss',
      label_jp: '福果と禍因',
      iconFile: 'J&C 맨드레이크&온모라키.png',
      maskLabel: '복과와 화근의 페르소나',
      facadeLabel: '인과',
      maskLabel_en: 'Mask of Luck & Loss',
      maskLabel_jp: '福果と禍因の仮面'
    }
  ];

  // 직업 목록 순서 정의 (표시용)
  const JC_ROLES_ORDER = ['반항', '지배', '우월', '굴복', '방위', '구원'];

  // J&C는 특정 스타일 변경
  (function changeJCStyle() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    document.querySelector('.container').classList.add('is-jc');
    document.querySelector('.character-name').classList.add('is-jc');
    // 모든 카드 스타일에 is-jc 클래스 추가
    document.querySelectorAll('.card-style').forEach(card => {
      card.classList.add('is-jc');
    });
    document.querySelectorAll('.dot').forEach(dot => {
      dot.classList.add('is-jc');
    });
    if (window.innerWidth >= 1200) {
      carousel.classList.add('is-jc');
    }


  })();


  // 조합 텍스트 필터링용 유틸
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // skill5 / passive2 / highlight 에서 사용할 조합 헤더 미리 생성
  const JC_SKILL5_COMBOS = [];
  const JC_PASSIVE2_COMBOS = [];
  const JC_HIGHLIGHT_HEADERS = [];

  (function initJCCombos() {
    // 하이라이트 개별 가면 헤더
    JC_PERSONAS.forEach(p => {
      JC_HIGHLIGHT_HEADERS.push(`『${p.maskLabel}』:`);
    });

    // 4개 가면에서 2개씩 조합 (C(4,2)=6)
    for (let i = 0; i < JC_PERSONAS.length; i++) {
      for (let j = i + 1; j < JC_PERSONAS.length; j++) {
        const a = JC_PERSONAS[i];
        const b = JC_PERSONAS[j];
        const id = [a.id, b.id].sort().join('+');

        JC_SKILL5_COMBOS.push({
          id,
          personaIds: [a.id, b.id],
          header: `『상·${a.maskLabel}』＋『상·${b.maskLabel}』:`
        });

        JC_PASSIVE2_COMBOS.push({
          id,
          personaIds: [a.id, b.id],
          header: `『${a.maskLabel}』＋『${b.maskLabel}』:`
        });
      }
    }
  })();

  const JC_SKILL5_HEADERS_PATTERN = JC_SKILL5_COMBOS.map(c => escapeRegex(c.header)).join('|');
  const JC_PASSIVE2_HEADERS_PATTERN = JC_PASSIVE2_COMBOS.map(c => escapeRegex(c.header)).join('|');
  const JC_HIGHLIGHT_HEADERS_PATTERN = JC_HIGHLIGHT_HEADERS.map(h => escapeRegex(h)).join('|');

  // 페르소나 쌍 → 직업 매핑
  const JC_PAIR_ROLE_MAP = {
    'ABSURD_ILLOGIC+FORTUNE_CALAMITY': '반항',
    'ABSURD_ILLOGIC+SERV_WARN': '방위',
    'FORTUNE_CALAMITY+SERV_WARN': '굴복',
    'TRICK_PURE+ABSURD_ILLOGIC': '우월',
    'TRICK_PURE+FORTUNE_CALAMITY': '지배',
    'TRICK_PURE+SERV_WARN': '구원'
  };

  // 롤 이름 로컬 폴백 번역 (TranslationLoader 미존재 시 사용)
  const JC_ROLE_TRANSLATIONS = {
    en: {
      '구원': 'Medic',
      '굴복': 'Saboteur',
      '반항': 'Assassin',
      '방위': 'Defense',
      '우월': 'Strategist',
      '지배': 'Sweeper',
      '해명': 'Elucidator'
    },
    jp: {
      '구원': '救済',
      '굴복': '屈服',
      '반항': '反抗',
      '방위': '防衛',
      '우월': '優越',
      '지배': '支配',
      '해명': '解明'
    }
  };

  // 선택된 페르소나 상태 (선택 모드: all / pair)
  // 초기값은 pair + 선택 0개(아이콘은 전부 비활성화, 스킬/조합은 전체 표시)
  let jcSelectedOrder = [];    // 최근 선택 순서 (pair 모드일 때 최대 2개)

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

  function ensureJCStyles() {
    if (document.getElementById('jc-persona-style')) return;
    const style = document.createElement('style');
    style.id = 'jc-persona-style';
    style.textContent = `
      .jc-persona-card {
        margin-bottom: 16px;
      }
      .jc-persona-card h2 {
        font-size: 20px;
      }
      .jc-persona-grid {
        margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 10px; /* 아래 직업 그리드와 간격 */
      }
      .jc-persona-button {
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.15);
        cursor: pointer;
        padding: 6px 4px 6px;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        transition: all 0.15s ease-out;
        color: #eee;
        font-size: 11px;
      }
      .jc-persona-button .jc-persona-img-wrap {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .jc-persona-button img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .jc-persona-button .jc-persona-label {
        text-align: center;
        line-height: 1.2;
        word-break: keep-all;
      }
      .jc-persona-button.selected {
        box-shadow: 0 0 0 1px rgba(255, 0, 0, 0.5) inset;
        background: rgba(255, 64, 64, 0.2);
        border-color: rgba(255, 64, 64, 0.4);
      }
      .jc-persona-button.dim {
        opacity: 0.35;
      }

      /* 직업 아이콘 그리드 스타일 */
      .jc-role-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 6px;
        padding-top: 10px;
        border-top: 1px dashed rgba(255,255,255,0.15);
        margin-bottom: 20px;
      }
      .jc-role-button {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid transparent;
        border-radius: 6px;
        cursor: pointer;
        padding: 6px 2px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: all 0.2s;
        opacity: 0.5; /* 기본 비활성 상태 */
      }
      .jc-role-button:hover {
        background: rgba(255,255,255,0.05);
        opacity: 0.8;
      }
      .jc-role-button.active {
        opacity: 1;
        background: rgba(255, 215, 0, 0.15); /* 골드 틴트 */
        border-color: rgba(255, 215, 0, 0.5);
        box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
        transform: translateY(-2px);
      }
      .jc-role-button img {
        width: 28px;
        height: 28px;
        object-fit: contain;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
      }
      .jc-role-label {
        font-size: 10px;
        color: #ccc;
        text-align: center;
        white-space: nowrap;
      }
      .jc-role-button.active .jc-role-label {
        color: #fff;
        font-weight: bold;
      }

      .jc-role-container {
         /* 기존 헤더용 스타일 - 이제 사용 안 할 수도 있지만 호환성 위해 남김 */
        display: none; 
      }
      .jc-ritual-role-extra {
        display: block;
        margin-top: 4px;
        font-size: 12px;
        color: rgb(255 64 64 / 70%);
      }

      @media (max-width: 768px) {
        .jc-persona-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .jc-role-grid {
          grid-template-columns: repeat(3, 1fr); /* 모바일은 3열 2행 */
        }
        .jc-persona-card h2 {
          font-size: 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getLocalizedPersonaLabel(p) {
    const lang = getCurrentLanguage();
    if (lang === 'en' && p.label_en) return p.label_en;
    if (lang === 'jp' && p.label_jp) return p.label_jp;
    return p.label;
  }

  // 직업 키(예: '반항')를 통해 구성하는 페르소나 ID 2개를 찾는 함수
  function getIdsFromRoleKey(roleKey) {
    for (const [pairKey, roleName] of Object.entries(JC_PAIR_ROLE_MAP)) {
      if (roleName === roleKey) {
        return pairKey.split('+');
      }
    }
    return null;
  }

  function ensureJCSelectorCard() {
    ensureJCStyles();

    const skillsCard = document.querySelector('.skills-card.card-style');
    if (!skillsCard) return null;

    let card = document.querySelector('.jc-persona-card');
    if (!card) {
      card = document.createElement('div');
      card.className = 'jc-persona-card';

      // 1. 페르소나(가면) 선택 그리드
      const grid = document.createElement('div');
      grid.className = 'jc-persona-grid';
      grid.setAttribute('data-jc-persona-grid', 'true');

      const baseUrl = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';

      JC_PERSONAS.forEach(p => {
        const uiLabel = getLocalizedPersonaLabel(p);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'jc-persona-button';
        btn.dataset.personaId = p.id;
        btn.title = uiLabel;

        const imgWrap = document.createElement('div');
        imgWrap.className = 'jc-persona-img-wrap';

        const img = document.createElement('img');
        img.src = `${baseUrl}/assets/img/character-detail/J&C/${p.iconFile}`;
        img.alt = uiLabel;

        const label = document.createElement('div');
        label.className = 'jc-persona-label';
        label.textContent = uiLabel;

        imgWrap.appendChild(img);
        btn.appendChild(imgWrap);
        btn.appendChild(label);

        // 가면 클릭 이벤트
        btn.addEventListener('click', () => {
          const id = btn.dataset.personaId;
          const idx = jcSelectedOrder.indexOf(id);

          if (idx !== -1) {
            // 이미 선택된 거면 해제
            jcSelectedOrder.splice(idx, 1);
          } else {
            // 새로 선택
            if (jcSelectedOrder.length >= 2) {
              // 2개가 꽉 찼으면, 가장 오래된거(0번) 버리고 [이전최신, 새거]로 갱신
              jcSelectedOrder = [jcSelectedOrder[jcSelectedOrder.length - 1], id];
            } else {
              jcSelectedOrder.push(id);
            }
          }
          triggerUpdate();
        });

        grid.appendChild(btn);
      });

      card.appendChild(grid);

      // 2. 직업(Role) 선택 그리드 추가
      const roleGrid = document.createElement('div');
      roleGrid.className = 'jc-role-grid';
      
      JC_ROLES_ORDER.forEach(roleKey => {
         const roleBtn = document.createElement('div');
         roleBtn.className = 'jc-role-button';
         roleBtn.dataset.roleKey = roleKey;
         
         const roleLabel = getLocalizedRoleLabel(roleKey);
         roleBtn.title = roleLabel || roleKey;

         const icon = document.createElement('img');
         icon.src = `${baseUrl}/assets/img/persona/직업_${roleKey}.png`;
         icon.alt = roleKey;

         const labelSpan = document.createElement('span');
         labelSpan.className = 'jc-role-label';
         labelSpan.textContent = roleLabel;

         roleBtn.appendChild(icon);
         roleBtn.appendChild(labelSpan);

         // 직업 아이콘 클릭 이벤트
         roleBtn.addEventListener('click', () => {
             const pairIds = getIdsFromRoleKey(roleKey);
             if (pairIds && pairIds.length === 2) {
                 // 해당 직업의 페르소나 2개로 즉시 교체
                 jcSelectedOrder = [...pairIds];
                 triggerUpdate();
             }
         });

         roleGrid.appendChild(roleBtn);
      });

      card.appendChild(roleGrid);

      // DOM 삽입 위치 결정
      const levelButtons = skillsCard.querySelector('.skill-level-buttons');
      const skillsGrid = skillsCard.querySelector('.skills-grid');
      if (levelButtons) {
        skillsCard.insertBefore(card, levelButtons);
      } else if (skillsGrid) {
        skillsCard.insertBefore(card, skillsGrid);
      } else {
        skillsCard.appendChild(card);
      }

      // 초기화
      jcSelectionMode = 'pair';
      jcSelectedOrder = [];
    }

    updateJCVisuals();
    return card;
  }

  function triggerUpdate() {
      updateJCVisuals();
      try {
        if (typeof window.applyJCIcons === 'function') {
          window.applyJCIcons();
        }
      } catch (e) {
        console.warn('[JC_icons] applyJCIcons error', e);
      }
  }

  function updateJCVisuals() {
    // 1. 가면 버튼 상태 업데이트
    const grid = document.querySelector('[data-jc-persona-grid="true"]');
    if (grid) {
        const buttons = Array.from(grid.querySelectorAll('.jc-persona-button'));
        const selectedSet = new Set(jcSelectedOrder);
        buttons.forEach(btn => {
          const id = btn.dataset.personaId;
          if (selectedSet.has(id)) {
            btn.classList.add('selected');
            btn.classList.remove('dim');
          } else {
            btn.classList.remove('selected');
            btn.classList.add('dim');
          }
        });
    }

    // 2. 직업 아이콘 상태 업데이트
    const currentRoleKey = getSelectedRoleKeyFromIds(jcSelectedOrder);
    const roleGrid = document.querySelector('.jc-role-grid');
    if (roleGrid) {
        const roleBtns = Array.from(roleGrid.querySelectorAll('.jc-role-button'));
        roleBtns.forEach(btn => {
            if (btn.dataset.roleKey === currentRoleKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
  }

  function getSelectedPersonaIds() {
    const uniq = [];
    jcSelectedOrder.forEach(id => {
      if (!uniq.includes(id)) uniq.push(id);
    });
    return uniq;
  }

  function filterHighlightDescription(baseHtml, selectedIds) {
    if (!baseHtml) return baseHtml;
    const total = JC_PERSONAS.length;
    const uniq = Array.from(new Set(selectedIds || []));

    if (uniq.length === 0 || uniq.length >= total) return baseHtml;

    let idsToKeep;
    if (uniq.length === 1) {
      idsToKeep = new Set(uniq);
    } else {
      idsToKeep = new Set(uniq.slice(0, 2));
    }

    const lang = getCurrentLanguage();
    let headers;
    if (lang === 'en') {
      headers = JC_PERSONAS.map(p => {
        const maskLabel = p.maskLabel_en || ('Mask of ' + p.label_en);
        return [
          `${maskLabel}:`,
          `${maskLabel.replace(/&/g, '&amp;')}:`
        ];
      }).flat();
    } else if (lang === 'jp') {
      headers = JC_PERSONAS.map(p => `『${p.maskLabel_jp}』：`);
    } else {
      headers = JC_PERSONAS.map(p => `『${p.maskLabel}』:`);
    }
    const allHeadersPattern = headers.map(h => escapeRegex(h)).join('|');

    let html = baseHtml;
    JC_PERSONAS.forEach((p, idx) => {
      if (idsToKeep.has(p.id)) return;
      const maskLabel = lang === 'en' 
        ? (p.maskLabel_en || ('Mask of ' + p.label_en))
        : (lang === 'jp' ? p.maskLabel_jp : p.maskLabel);
      
      const headerVariants = lang === 'en' 
        ? [ `${maskLabel}:`, `${maskLabel.replace(/&/g, '&amp;')}:` ]
        : lang === 'jp'
        ? [`『${maskLabel}』：`]
        : [`『${maskLabel}』:`];

      headerVariants.forEach(header => {
        const pattern = new RegExp(
          escapeRegex(header) + '[\\s\\S]*?(?=(' + allHeadersPattern + '|$))',
          'g'
        );
        html = html.replace(pattern, '');
      });
    });

    return html;
  }

  function filterComboDescription(baseHtml, combos, type, selectedIds) {
    if (!baseHtml) return baseHtml;
    const total = JC_PERSONAS.length;
    const uniq = Array.from(new Set(selectedIds || []));

    let combosToKeep;
    if (uniq.length === 0 || uniq.length >= total) {
      combosToKeep = combos;
    } else if (uniq.length === 1) {
      const id = uniq[0];
      combosToKeep = combos.filter(c => c.personaIds.includes(id));
    } else {
      const pairId = uniq.slice(0, 2).sort().join('+');
      combosToKeep = combos.filter(c => {
        const comboId = c.personaIds.slice().sort().join('+');
        return comboId === pairId;
      });
    }

    const lang = getCurrentLanguage();
    const personaMap = {};
    JC_PERSONAS.forEach(p => { personaMap[p.id] = p; });

    function makeHeader(a, b) {
      if (!a || !b) return '';
      if (type === 'skill5') {
        if (lang === 'en') {
          const labelA = a.label_en;
          const labelB = b.label_en;
          return [
            `Facade of ${labelA} + Facade of ${labelB}:`,
            `Facade of ${labelB} + Facade of ${labelA}:`,
            `Facade of ${labelA.replace(/&/g, '&amp;')} + Facade of ${labelB.replace(/&/g, '&amp;')}:`,
            `Facade of ${labelB.replace(/&/g, '&amp;')} + Facade of ${labelA.replace(/&/g, '&amp;')}:`
          ];
        } else if (lang === 'jp') {
          return `『相貌・${a.label_jp}』＋『相貌・${b.label_jp}』：`;
        } else {
          const fa = a.facadeLabel || a.maskLabel;
          const fb = b.facadeLabel || b.maskLabel;
          return [
            `『${fa}』+『${fb}』:`,
            `『${fb}』+『${fa}』:`,
            `『${fa}』＋『${fb}』:`,
            `『${fb}』＋『${fa}』:`
          ];
        }
      } else {
        if (lang === 'en') {
          const ma = a.maskLabel_en || `Mask of ${a.label_en}`;
          const mb = b.maskLabel_en || `Mask of ${b.label_en}`;
          return [
            `${ma} + ${mb}:`,
            `${mb} + ${ma}:`,
            `${ma.replace(/&/g, '&amp;')} + ${mb.replace(/&/g, '&amp;')}:`,
            `${mb.replace(/&/g, '&amp;')} + ${ma.replace(/&/g, '&amp;')}:`
          ];
        } else if (lang === 'jp') {
          return `『${a.maskLabel_jp}』＋『${b.maskLabel_jp}』：`;
        } else {
          return [`『${a.maskLabel}』＋『${b.maskLabel}』:`, `『${b.maskLabel}』＋『${a.maskLabel}』:`, `『${a.maskLabel}』+『${b.maskLabel}』:`, `『${b.maskLabel}』+『${a.maskLabel}』:`];
        }
      }
    }

    const comboInfo = combos.map(c => {
      const a = personaMap[c.personaIds[0]];
      const b = personaMap[c.personaIds[1]];
      const header = makeHeader(a, b);
      const headers = Array.isArray(header) ? header : [header];
      return {
        combo: c,
        headers
      };
    });

    const headersPattern = comboInfo
      .flatMap(ci => ci.headers)
      .filter(Boolean)
      .map(h => escapeRegex(h))
      .join('|');

    const keepIdSet = new Set(combosToKeep.map(c => c.id));
    let html = baseHtml;

    comboInfo.forEach(ci => {
      if (keepIdSet.has(ci.combo.id)) return;
      if (!ci.headers || !ci.headers.length) return;
      ci.headers.forEach(h => {
        if (!h) return;
        const pattern = new RegExp(
          escapeRegex(h) + '[\\s\\S]*?(?=(' + headersPattern + '|$))',
          'g'
        );
        html = html.replace(pattern, '');
      });
    });

    return html;
  }

  function getSelectedRoleKeyFromIds(selectedIds) {
    const uniq = Array.from(new Set(selectedIds || []));
    if (uniq.length !== 2) return null;
    const [a, b] = uniq;
    const directKey = `${a}+${b}`;
    const reverseKey = `${b}+${a}`;
    const sortedKey = uniq.slice().sort().join('+');
    return JC_PAIR_ROLE_MAP[directKey] ||
           JC_PAIR_ROLE_MAP[reverseKey] ||
           JC_PAIR_ROLE_MAP[sortedKey] ||
           null;
  }

  function getLocalizedRoleLabel(roleKey) {
    if (!roleKey) return null;
    const lang = getCurrentLanguage();
    if (lang === 'kr') return roleKey;

    try {
      if (window.TranslationLoader && TranslationLoader.translationCache) {
        const cacheKey = `characters_${lang}`;
        const tr = TranslationLoader.translationCache[cacheKey];
        if (tr && tr.positions && tr.positions[roleKey]) {
          return tr.positions[roleKey];
        }
      }
    } catch (_) { }

    const local = JC_ROLE_TRANSLATIONS[lang];
    if (local && local[roleKey]) {
      return local[roleKey];
    }
    return roleKey;
  }

  // 기존 헤더에 텍스트 넣는 로직을 제거함
  function updateJCSkillRoleDisplay(roleKey) {
     // 헤더에 표시하지 않음 (빈 함수로 둠)
  }

  function updateJCRitualDetails(selectedIds, roleKey) {
    try {
      const lang = getCurrentLanguage();
      const ritual0 = document.querySelector('.ritual-item[data-ritual="0"] .ritual-description');
      const ritual2 = document.querySelector('.ritual-item[data-ritual="2"] .ritual-description');

      const hasValidPair = !!(roleKey && selectedIds && selectedIds.length === 2);

      if (ritual0) {
        const baseAttr = 'jcBaseRitual0';
        if (!ritual0.getAttribute('data-' + baseAttr)) {
          ritual0.setAttribute('data-' + baseAttr, ritual0.innerHTML);
        }
        const base = ritual0.getAttribute('data-' + baseAttr) || '';
        if (!hasValidPair) {
          ritual0.innerHTML = base;
        } else {
          const a = JC_PERSONAS.find(p => p.id === selectedIds[0]);
          const b = JC_PERSONAS.find(p => p.id === selectedIds[1]);
          const roleLabel = getLocalizedRoleLabel(roleKey) || roleKey;
          let pairText;
          if (lang === 'en') {
            if (a && b) {
              const comboLabel = `${a.maskLabel_en} + ${b.maskLabel_en}`;
              pairText = `Current combo: ${comboLabel} (${roleLabel})`;
            } else {
              pairText = `Current role: ${roleLabel}`;
            }
          } else if (lang === 'jp') {
            if (a && b) {
              const comboLabel = `『${a.maskLabel_jp}』＋『${b.maskLabel_jp}』`;
              pairText = `現在の組み合わせ: ${comboLabel}（${roleLabel}）`;
            } else {
              pairText = `現在のロール: ${roleLabel}`;
            }
          } else {
            if (a && b) {
              pairText = `현재 선택 조합: 『${a.maskLabel}』＋『${b.maskLabel}』 (${roleLabel})`;
            } else {
              pairText = `현재 선택 롤: ${roleLabel}`;
            }
          }
          ritual0.innerHTML = `${base}<span class="jc-ritual-role-extra">${pairText}</span>`;
        }
      }

      if (ritual2) {
        const baseAttr = 'jcBaseRitual2';
        if (!ritual2.getAttribute('data-' + baseAttr)) {
          ritual2.setAttribute('data-' + baseAttr, ritual2.innerHTML);
        }
        const base = ritual2.getAttribute('data-' + baseAttr) || '';
        if (!hasValidPair) {
          ritual2.innerHTML = base;
        } else {
          const a = JC_PERSONAS.find(p => p.id === selectedIds[0]);
          const b = JC_PERSONAS.find(p => p.id === selectedIds[1]);
          const roleLabel = getLocalizedRoleLabel(roleKey) || roleKey;
          let pairText;
          if (lang === 'en') {
            if (a && b) {
              const comboLabel = `${a.maskLabel_en} + ${b.maskLabel_en}`;
              pairText = `Current combo: ${comboLabel}`;
            } else {
              pairText = `Current role: ${roleLabel}`;
            }
          } else if (lang === 'jp') {
            if (a && b) {
              const comboLabel = `『${a.maskLabel_jp}』＋『${b.maskLabel_jp}』`;
              pairText = `現在の組み合わせ: ${comboLabel}`;
            } else {
              pairText = `現在のロール: ${roleLabel}`;
            }
          } else {
            if (a && b) {
              const fa = a.facadeLabel || a.maskLabel;
              const fb = b.facadeLabel || b.maskLabel;
              pairText = `현재 선택 조합: 『${fa}』＋『${fb}』`;
            } else {
              pairText = `현재 선택 롤: ${roleLabel}`;
            }
          }
          ritual2.innerHTML = `${base}<span class="jc-ritual-role-extra">${pairText}</span>`;
        }
      }
    } catch (e) {
      console.warn('[JC_icons] updateJCRitualDetails error', e);
    }
  }

  function applyJCIcons() {
    try {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name');

      if (name !== 'J&C' && name !== '쥐스틴 & 카롤린' && name !== '쥐스틴&카롤린') return;

      ensureJCSelectorCard();

      let currentLevelIndex = '-1';
      try {
        const activeBtn = document.querySelector('.skill-level-btn.active');
        if (activeBtn && typeof activeBtn.dataset.level !== 'undefined') {
          currentLevelIndex = String(activeBtn.dataset.level);
        }
      } catch (_) { }

      const skillsGrid = document.querySelector('.skills-grid');
      const selectedIds = getSelectedPersonaIds();

      // 스킬 1~4 가시성 제어
      (function updateJCMainSkillVisibility(ids) {
        if (!skillsGrid) return;
        const cards = skillsGrid.querySelectorAll('.skill-card');
        if (!cards || !cards.length) return;

        const indexByPersonaId = {
          'TRICK_PURE': 0,        // skill1
          'SERV_WARN': 1,         // skill2
          'ABSURD_ILLOGIC': 2,    // skill3
          'FORTUNE_CALAMITY': 3   // skill4
        };

        const uniq = Array.from(new Set(ids || []));
        const showAll = uniq.length === 0;

        Object.entries(indexByPersonaId).forEach(([pid, idx]) => {
          const card = cards[idx];
          if (!card) return;
          if (showAll || uniq.includes(pid)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      })(selectedIds);

      const roleKey = getSelectedRoleKeyFromIds(selectedIds);
      updateJCRitualDetails(selectedIds, roleKey);
      
      // 여기에서만 Visual 업데이트 한 번 더 확실히
      updateJCVisuals();

      if (skillsGrid) {
        const descElements = skillsGrid.querySelectorAll('.skill-description');

        const targetMap = [
          { index: 4, type: 'skill5' },
          { index: 5, type: 'highlight' },
          { index: 7, type: 'passive2' }
        ];

        targetMap.forEach(({ index, type }) => {
          const el = descElements[index];
          if (!el) return;

          const baseAttr = 'jcBaseHtml_' + type;
          const levelAttr = 'jcBaseLevel_' + type;

          const prevLevel = el.getAttribute('data-' + levelAttr);
          if (!prevLevel || prevLevel !== currentLevelIndex || !el.getAttribute('data-' + baseAttr)) {
            el.setAttribute('data-' + baseAttr, el.innerHTML);
            el.setAttribute('data-' + levelAttr, currentLevelIndex);
          }

          const baseHtml = el.getAttribute('data-' + baseAttr) || '';
          let filtered = baseHtml;
          if (type === 'highlight') {
            filtered = filterHighlightDescription(baseHtml, selectedIds);
          } else if (type === 'skill5') {
            filtered = filterComboDescription(baseHtml, JC_SKILL5_COMBOS, 'skill5', selectedIds);
          } else if (type === 'passive2') {
            filtered = filterComboDescription(baseHtml, JC_PASSIVE2_COMBOS, 'passive2', selectedIds);
          }

          el.innerHTML = filtered;
        });
      }

      const baseUrl = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
      const elements = document.querySelectorAll('.skill-name, .skill-description, .ritual-description');
      if (!elements || !elements.length) return;

      (function addSkill5AlderIcon() {
        if (!skillsGrid) return;
        const cards = skillsGrid.querySelectorAll('.skill-card');
        const skill5Card = cards && cards.length > 4 ? cards[4] : null;
        if (!skill5Card) return;

        const nameEl = skill5Card.querySelector('.skill-name');
        if (!nameEl) return;
        if (nameEl.querySelector('.jc-skill5-alder-icon')) return;

        const img = document.createElement('img');
        img.src = `${baseUrl}/assets/img/character-detail/J&C/J&C 알더.png`;
        img.alt = 'Ardha';
        img.className = 'jc-persona-icon jc-skill5-alder-icon';
        img.style.width = '24px';
        img.style.height = '24px';
        img.style.objectFit = 'contain';
        img.style.verticalAlign = 'middle';
        img.style.marginRight = '4px';

        nameEl.insertBefore(img, nameEl.firstChild);
      })();

      elements.forEach(el => {
        if (!el || !el.innerHTML) return;
        if (el.querySelector('.jc-persona-icon')) return;

        let html = el.innerHTML;
        let changed = false;

        Object.entries(LABEL_ICON_MAP).forEach(([label, fileName]) => {
          const imgHtml =
            `<span class="jc-icon-label">` +
            `<img src="${baseUrl}/assets/img/character-detail/J&C/${fileName}" ` +
            `alt="${label}" class="jc-persona-icon" ` +
            `style="width:24px;height:24px;object-fit:contain;vertical-align:middle;margin-right:4px;">` +
            `${label}</span>`;

          const rawRe = new RegExp(escapeRegex(label), 'g');
          if (rawRe.test(html)) {
            html = html.replace(rawRe, imgHtml);
            changed = true;
            return;
          }

          const encodedLabel = label.replace(/&/g, '&amp;');
          if (encodedLabel !== label) {
            const encodedRe = new RegExp(escapeRegex(encodedLabel), 'g');
            if (encodedRe.test(html)) {
              html = html.replace(encodedRe, imgHtml);
              changed = true;
            }
          }
        });

        if (changed) {
          el.innerHTML = html;
        }
      });
    } catch (e) {
      console.warn('[JC_icons] applyJCIcons error', e);
    }
  }

 


// =========================================================
  // J&C 전용 배경음악 (BGM) 플레이어 기능 추가
  // =========================================================
  (function initJCBGM() {
    const BASE = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
    
    const BGM_PLAYLIST = [
        `${BASE}/assets/music/JC_login.mp3`,
    ];

    const ICON_ON = `${BASE}/assets/img/music/btn_music_on.png`;
    const ICON_OFF = `${BASE}/assets/img/music/btn_music_off.png`;

    const nameRow2 = document.querySelector('.name-row2');
    if (!nameRow2 || BGM_PLAYLIST.length === 0) return;

    const audio = new Audio();
    audio.volume = 1;
    let currentTrackIndex = 0;
    let isPlaying = false;
    let userInteracted = false; 

    const musicBtnContainer = document.createElement('div');
    musicBtnContainer.className = 'jc-music-btn-container';
    musicBtnContainer.style.cssText = `
        display: inline-flex;
        align-items: center;
        margin-left: 0px;
        cursor: pointer;
        vertical-align: middle;
    `;

    const musicIcon = document.createElement('img');
    musicIcon.src = ICON_OFF;
    musicIcon.alt = 'BGM Toggle';
    musicIcon.style.cssText = `
        width: 24px;
        height: 24px;
        object-fit: contain;
        transition: transform 0.1s ease;
    `;
    
    musicBtnContainer.onmouseenter = () => musicIcon.style.transform = 'scale(1.1)';
    musicBtnContainer.onmouseleave = () => musicIcon.style.transform = 'scale(1.0)';

    musicBtnContainer.appendChild(musicIcon);
    nameRow2.appendChild(musicBtnContainer);

    function loadAndPlayTrack(index) {
        if (index >= BGM_PLAYLIST.length) index = 0; 
        currentTrackIndex = index;
        
        audio.src = BGM_PLAYLIST[currentTrackIndex];
        audio.load();
        
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updateIconState();
            }).catch(error => {
                console.log('J&C BGM Autoplay blocked. Waiting for interaction.');
                isPlaying = false;
                updateIconState();
                
                if (!userInteracted) {
                    addInteractionFallback();
                }
            });
        }
    }

    function updateIconState() {
        musicIcon.src = isPlaying ? ICON_ON : ICON_OFF;
    }

    function addInteractionFallback() {
        const fallbackHandler = () => {
            if (!isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                    userInteracted = true;
                    updateIconState();
                }).catch(e => console.warn('Interaction play failed', e));
            }
            document.removeEventListener('click', fallbackHandler);
            document.removeEventListener('keydown', fallbackHandler);
            document.removeEventListener('touchstart', fallbackHandler);
        };

        document.addEventListener('click', fallbackHandler, { once: true });
        document.addEventListener('keydown', fallbackHandler, { once: true });
        document.addEventListener('touchstart', fallbackHandler, { once: true });
    }

    audio.addEventListener('ended', () => {
        loadAndPlayTrack(currentTrackIndex + 1);
    });

    musicBtnContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        userInteracted = true;

        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            if (!audio.src) {
                loadAndPlayTrack(currentTrackIndex);
            } else {
                audio.play();
                isPlaying = true;
            }
        }
        updateIconState();
    });

    setTimeout(() => {
        loadAndPlayTrack(0);
    }, 500);

  })();

  // 전역에서 호출 가능하도록 노출
  window.applyJCIcons = applyJCIcons;
})();