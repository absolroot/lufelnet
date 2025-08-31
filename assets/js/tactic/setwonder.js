/* ========== 원더 설정 ========== */
function setupWonderConfig() {
const wonderConfigDiv = document.getElementById("wonder-config");

// 현재 언어 감지 함수
function getCurrentLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) {
    return urlLang;
  }
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang && ['kr', 'en', 'jp'].includes(savedLang)) {
    return savedLang;
  }
  return 'kr';
}

// 페이지 스크롤 잠금/해제 유틸
// (removed) scroll lock utilities were causing delayed scroll jumps

// 페르소나 이름 번역 함수
function getPersonaDisplayName(personaName) {
  const currentLang = getCurrentLanguage();
  if (currentLang === 'kr' || !personaData[personaName]) {
    return personaName;
  }
  
  const persona = personaData[personaName];
  if (currentLang === 'en' && persona.name_en) {
    return persona.name_en;
  } else if (currentLang === 'jp' && persona.name_jp) {
    return persona.name_jp;
  }
  return personaName;
}

// 무기 이름 번역 함수
function getWeaponDisplayName(weaponName) {
  const currentLang = getCurrentLanguage();
  if (currentLang === 'kr' || !matchWeapons[weaponName]) {
    return weaponName;
  }

  const weapon = matchWeapons[weaponName];
  if (currentLang === 'en' && weapon.name_en) {
    return weapon.name_en;
  } else if (currentLang === 'jp' && weapon.name_jp) {
    return weapon.name_jp;
  }
  return weaponName;
}

// 스킬 이름 번역 함수
function getSkillDisplayName(skillName) {
  const currentLang = getCurrentLanguage();
  if (currentLang === 'kr') {
    return skillName;
  }
  
  // personaSkillList에서 찾기
  if (personaSkillList[skillName]) {
    const skill = personaSkillList[skillName];
    if (currentLang === 'en' && skill.name_en) {
      return skill.name_en;
    } else if (currentLang === 'jp' && skill.name_jp) {
      return skill.name_jp;
    }
  }
  
  return skillName;
}

// 플레이스홀더 텍스트 번역 함수
function getPlaceholderText(type) {
    const lang = getCurrentLanguage();
    const placeholders = {
        persona: {
            kr: '-',
            en: '-',
            jp: '-'
        },
        weapon: {
            kr: '-',
            en: '-',
            jp: '-'
        },
        skill: {
            kr: '-',
            en: '-',
            jp: '-'
        }
    };
    return placeholders[type]?.[lang] || '';
}

// 고유스킬 이름 번역 함수 (페르소나 데이터에서)
function getUniqueSkillDisplayName(personaName, skillName) {
  const currentLang = getCurrentLanguage();
  if (currentLang === 'kr' || !personaData[personaName]) {
    return skillName;
  }
  
  const persona = personaData[personaName];
  if (persona.uniqueSkill) {
    if (currentLang === 'en' && persona.uniqueSkill.name_en) {
      return persona.uniqueSkill.name_en;
    } else if (currentLang === 'jp' && persona.uniqueSkill.name_jp) {
      return persona.uniqueSkill.name_jp;
    }
  }
  
  return skillName;
}

// 무기 입력 필드 수정
const weaponInput = wonderConfigDiv.querySelector(".wonder-weapon-input");
weaponInput.placeholder = getPlaceholderText('weapon');
// Make weapon input non-editable; open dropdown only
weaponInput.setAttribute('readonly', 'readonly');
const weaponContainer = weaponInput.parentElement;

// input을 컨테이너로 감싸기
const inputContainer = document.createElement("div");
inputContainer.className = "input-container";
inputContainer.style.position = "relative";

// 기존 input을 새 컨테이너로 이동
weaponInput.parentNode.insertBefore(inputContainer, weaponInput);
inputContainer.appendChild(weaponInput);

// clear 버튼 추가
const clearBtn = document.createElement("button");
clearBtn.className = "clear-input";
clearBtn.textContent = "×";
clearBtn.addEventListener("click", () => {
  weaponInput.value = "";
  weaponInput.focus();
});
inputContainer.appendChild(clearBtn);

// 커스텀 드롭다운 생성
const customDropdown = document.createElement("div");
customDropdown.className = "custom-dropdown";
inputContainer.appendChild(customDropdown);

// datalist 속성 제거 (커스텀 드롭다운 사용)
weaponInput.removeAttribute("list");

// 드롭다운 항목 생성 함수
const createWeaponDropdownItems = (filter = "") => {
  customDropdown.innerHTML = "";
  
  // 무기 목록 필터링 (필터가 있을 경우만 필터링)
  let filteredWeapons = getWonderWeaponOptions();
  if (filter) {
    filteredWeapons = getWonderWeaponOptions().filter(weapon => 
      weapon.toLowerCase().includes(filter.toLowerCase())
    );
  }
  // 언어별 표시 이름으로 정렬
  try {
    const lang = getCurrentLanguage();
    const locale = lang === 'kr' ? 'ko-KR' : (lang === 'jp' ? 'ja-JP' : 'en');
    filteredWeapons.sort((a, b) => getWeaponDisplayName(a).localeCompare(getWeaponDisplayName(b), locale, { sensitivity: 'base' }));
  } catch (_) { /* no-op */ }
  
  // 드롭다운 항목 추가
  filteredWeapons.forEach(weapon => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    
    // 무기 아이콘 추가
    const iconImg = document.createElement("img");
    iconImg.className = "weapon-icon";
    iconImg.src = `${BASE_URL}/assets/img/wonder-weapon/${weapon}.webp`;
    iconImg.alt = "";
    iconImg.onerror = function() {
      // 이미지 로드 실패 시 아이콘 제거
      this.style.display = 'none';
    };
    item.appendChild(iconImg);
    
    // 무기 이름 추가
    const nameSpan = document.createElement("span");
    nameSpan.textContent = getWeaponDisplayName(weapon);
    item.appendChild(nameSpan);
    
    // 파티 드롭다운과 동일하게 mousedown 억제 제거
    item.addEventListener("click", () => {
      weaponInput.value = weapon;
      customDropdown.classList.remove("active");
      
      // 표시는 번역된 이름으로 업데이트
      const displayName = getWeaponDisplayName(weapon);
      weaponInput.setAttribute('data-display-value', displayName);
      const inputContainer = weaponInput.closest('.input-container');
      if (getCurrentLanguage() !== 'kr') {
        inputContainer.setAttribute('data-display-text', displayName);
        inputContainer.classList.add('show-translation');
      } else {
        inputContainer.classList.remove('show-translation');
      }

      // 포커스를 잃게 하여 번역된 텍스트가 바로 보이도록 함
      setTimeout(() => weaponInput.blur(), 0);
      
      // change 이벤트 강제 발생
      const event = new Event("change", { bubbles: true });
      weaponInput.dispatchEvent(event);
    });
    customDropdown.appendChild(item);
  });
};

// 무기 입력 필드 이벤트 처리
weaponInput.addEventListener("focus", function() {
  // 원래 값 저장만; 값은 유지 (비편집형)
  this.setAttribute('data-original-value', this.value);
  // 번역 표시 제거
  inputContainer.classList.remove('show-translation');
  // 항상 전체 목록 표시
  createWeaponDropdownItems('');
  customDropdown.classList.add("active");
});

weaponInput.addEventListener("blur", function() {
  setTimeout(() => {
    customDropdown.classList.remove("active");

    // 새로운 값이 선택되지 않았다면 원래 값으로 복원
    if (this.value.trim() === '') {
      this.value = this.getAttribute('data-original-value') || '';
    }

    // 값에 따른 번역 표시 적용
    if (this.value && getCurrentLanguage() !== 'kr') {
      const displayName = getWeaponDisplayName(this.value);
      inputContainer.setAttribute('data-display-text', displayName);
      inputContainer.classList.add('show-translation');
    } else {
      inputContainer.classList.remove('show-translation');
    }
  }, 200);
});

// Disable typing-based filtering (readonly prevents typing anyway)
// Keep dropdown behavior driven by click/focus only

// Toggle dropdown on any click
weaponInput.addEventListener("mousedown", function(e) {
  e.preventDefault();
  if (customDropdown.classList.contains("active")) {
    customDropdown.classList.remove("active");
  } else {
    createWeaponDropdownItems('');
    customDropdown.classList.add("active");
  }
});

// 무기 변경 시 스크롤 보존하며 상태 업데이트
weaponInput.addEventListener("change", () => {
  debouncedUpdate();
});

const inputs = wonderConfigDiv.querySelectorAll(".wonder-persona-input");

const weaponList = document.getElementById("weapon-list");
const wonderWeapons = getWonderWeaponOptions();
wonderWeapons.forEach(weapon => {
  const option = document.createElement("option");
  option.value = weapon;
  weaponList.appendChild(option);
});

// 디바운스 함수
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// (파티 입력 로직과 동일하게) 별도 스크롤 스냅샷/로깅 사용하지 않음

// 액션 메모 자동 업데이트 함수 (인덱스 우선)
function updateActionMemos() {
  turns.forEach(turn => {
    turn.actions.forEach(action => {
      if (action.character === "원더") {
        // wonderPersonaIndex를 우선 사용, 없으면 이름으로 검색
        let personaIndex = (typeof action.wonderPersonaIndex === 'number')
          ? action.wonderPersonaIndex
          : wonderPersonas.indexOf(action.wonderPersona);
        if (personaIndex != null && personaIndex !== -1) {
          const skillInputs = document.querySelectorAll(
            `.persona-skill-input[data-persona-index="${personaIndex}"]`
          );
          const skill1 = skillInputs[1]?.value;
          const uniqueSkill = skillInputs[0]?.value;
          action.memo = skill1 || uniqueSkill || "";
        }
      }
    });
  });
  // 필요 시 렌더 호출은 debouncedUpdate가 담당
}

// 업데이트 함수를 디바운스 처리
const debouncedUpdate = debounce(() => {
  // 현재 turns 배열의 순서를 저장해 둔다 (재렌더 후에도 동일 순서 유지)
  const prevOrder = Array.isArray(turns) ? turns.map(t => t.turn) : [];

  updateAutoActions(); // 내부에서 renderTurns() 호출됨
  updatePartyImages();
  updateActionMemos(); // 메모만 갱신 (턴 재정렬 방지)

  // 혹시라도 외부 요인으로 turns 순서가 바뀌었을 경우, 기존 순서로 복원
  if (Array.isArray(turns) && prevOrder.length === turns.length) {
    turns.sort((a, b) => prevOrder.indexOf(a.turn) - prevOrder.indexOf(b.turn));
  }
  // UI가 갱신된 후 스킬 아이콘/오버레이 재적용 (임포트/라이브러리 적용 이후 포함)
  if (window.wonderApplySkillInputDecor) {
    window.wonderApplySkillInputDecor();
  }

}, 300);

// 전역 포탈(고정 패널) 구현: 필요 시 1회 생성하여 재사용
let __globalDropdownPortal = null;
let __globalDropdownBackdrop = null;
let __globalDropdownHeader = null;
let __globalDropdownTitle = null;
let __globalDropdownClose = null;
let __globalDropdownCtx = null; // { type: 'persona'|'skill', input, personaIndex?, skillSlot? }
let __bodyOverflowPrev = '';
let __lastOpenTs = 0; // 포탈이 열린 시각 (즉시 닫힘 방지)

function ensureGlobalPortal() {
  if (__globalDropdownPortal) return __globalDropdownPortal;
  // 반투명 백드롭
  const backdrop = document.createElement('div');
  backdrop.id = 'global-dropdown-backdrop';
  backdrop.style.position = 'fixed';
  backdrop.style.left = '0';
  backdrop.style.top = '0';
  backdrop.style.width = '100vw';
  backdrop.style.height = '100vh';
  backdrop.style.background = 'rgba(0,0,0,0.45)';
  backdrop.style.zIndex = '9998';
  backdrop.style.display = 'none';
  // 모바일에서 배경 스크롤 방지
  backdrop.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });

  const portal = document.createElement('div');
  portal.id = 'global-dropdown-portal';
  portal.style.position = 'fixed';
  portal.style.zIndex = '9999';
  portal.style.minWidth = '220px';
  portal.style.maxHeight = '50vh';
  portal.style.overflowY = 'auto';
  portal.style.background = '#1f1f1f';
  portal.style.border = '1px solid rgba(255,255,255,0.15)';
  portal.style.borderRadius = '8px';
  portal.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
  portal.style.display = 'none';
  portal.style.padding = '8px';

  // 헤더 (타이틀 + 닫기 버튼)
  const header = document.createElement('div');
  header.className = 'portal-header';
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.style.gap = '8px';
  header.style.marginBottom = '6px';
  const title = document.createElement('div');
  title.className = 'portal-title';
  title.style.color = '#fff';
  title.style.fontSize = '14px';
  title.style.fontWeight = '600';
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'portal-close';
  closeBtn.textContent = '✕';
  closeBtn.style.background = 'transparent';
  closeBtn.style.color = '#fff';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '18px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.lineHeight = '1';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.addEventListener('click', () => closePortal());
  header.appendChild(title);
  header.appendChild(closeBtn);
  portal.appendChild(header);

  // 검색 입력
  const search = document.createElement('input');
  search.type = 'text';
  search.className = 'portal-search-input';
  search.style.width = '100%';
  search.style.boxSizing = 'border-box';
  search.style.marginBottom = '6px';
  search.style.padding = '6px 8px';
  search.style.borderRadius = '6px';
  search.style.border = '1px solid rgba(255,255,255,0.2)';
  search.style.background = '#2a2a2a';
  search.style.color = '#fff';
  portal.appendChild(search);

  const list = document.createElement('div');
  list.className = 'portal-list';
  portal.appendChild(list);

  document.body.appendChild(backdrop);
  document.body.appendChild(portal);

  // 이벤트: 타이핑 시 필터링
  search.addEventListener('input', () => renderPortalList(search.value));

  // ESC 닫기
  document.addEventListener('keydown', (e) => {
    if (portal.style.display !== 'none' && e.key === 'Escape') closePortal();
  }, true);

  // 외부 클릭 닫기
  document.addEventListener('mousedown', (e) => {
    if (portal.style.display === 'none') return;
    if (!portal.contains(e.target)) closePortal();
  }, true);

  __globalDropdownPortal = portal;
  __globalDropdownBackdrop = backdrop;
  __globalDropdownHeader = header;
  __globalDropdownTitle = title;
  __globalDropdownClose = closeBtn;
  return portal;
}

function openPortal(type, inputEl, ctx = {}) {
  const portal = ensureGlobalPortal();
  __globalDropdownCtx = { type, input: inputEl, ...ctx };
  const rect = inputEl.getBoundingClientRect();
  // 모바일 여부를 가로 폭 기준으로만 판정해야 데스크탑(높이 1080 등)이 잘못 모바일로 분류되지 않음
  const isMobile = window.innerWidth < 1440;
  __lastOpenTs = Date.now();
  portal.style.display = 'block';
  if (__globalDropdownBackdrop) __globalDropdownBackdrop.style.display = isMobile ? 'block' : 'none';
  if (__globalDropdownHeader) __globalDropdownHeader.style.display = isMobile ? 'flex' : 'none';
  // 배경 스크롤 잠금
  __bodyOverflowPrev = document.body.style.overflow || '';
  document.body.style.overflow = isMobile ? 'hidden' : __bodyOverflowPrev;

  // 헤더 타이틀 설정
  if (__globalDropdownTitle) {
    const currentLang = getCurrentLanguage();
    const tPersona = currentLang === 'jp' ? 'ペルソナ選択' : (currentLang === 'en' ? 'Select Persona' : '페르소나 선택');
    const tSkill = currentLang === 'jp' ? 'スキル選択' : (currentLang === 'en' ? 'Select Skill' : '스킬 선택');
    const tCharacter = currentLang === 'jp' ? 'キャラクター選択' : (currentLang === 'en' ? 'Select Character' : '캐릭터 선택');
    const tRevMain = currentLang === 'jp' ? '主の啓示を選択' : (currentLang === 'en' ? 'Select Main Revelation' : '주 계시 선택');
    const tRevSub = currentLang === 'jp' ? '日月星辰を選択' : (currentLang === 'en' ? 'Select Sub Revelation' : '일월성진 선택');
    let title = tSkill;
    if (type === 'persona') title = tPersona;
    else if (type === 'skill') title = tSkill;
    else if (type === 'character') title = tCharacter;
    else if (type === 'rev-main') title = tRevMain;
    else if (type === 'rev-sub') title = tRevSub;
    __globalDropdownTitle.textContent = title;
  }

  if (isMobile) {
    // 모바일: 화면 중앙 모달
    portal.style.width = 'min(92vw, 420px)';
    portal.style.maxWidth = '92vw';
    portal.style.maxHeight = '75vh';
    portal.style.left = '50%';
    portal.style.top = '50%';
    portal.style.transform = 'translate(-50%, -50%)';
  } else {
    // 데스크탑: 입력 옆에 표시
    portal.style.transform = 'none';
    portal.style.width = 'auto';
    portal.style.maxWidth = '420px';
    portal.style.maxHeight = '50vh';
    portal.style.left = `${Math.round(rect.left)}px`;
    portal.style.top = `${Math.round(rect.bottom + 4)}px`;
  }

  const search = portal.querySelector('.portal-search-input');
  const currentLang = getCurrentLanguage();
  search.placeholder = currentLang === 'jp' ? '検索' : (currentLang === 'en' ? 'Search' : '검색');
  search.value = '';
  renderPortalList('');
  // 패널 내부 검색창에만 포커스 이동 (메인 입력은 readonly 유지)
  setTimeout(() => search.focus(), 0);
}

// 전역 접근을 위해 노출 (setparty.js, index.html 등에서 사용)
try { window.openPortal = openPortal; } catch(_) {}

function closePortal() {
  if (!__globalDropdownPortal) return;
  __globalDropdownPortal.style.display = 'none';
  if (__globalDropdownBackdrop) __globalDropdownBackdrop.style.display = 'none';
  // 배경 스크롤 복원
  document.body.style.overflow = __bodyOverflowPrev || '';
  __globalDropdownCtx = null;
}

function renderPortalList(filter) {
  if (!__globalDropdownPortal || !__globalDropdownCtx) return;
  const list = __globalDropdownPortal.querySelector('.portal-list');
  list.innerHTML = '';
  const { type, input, personaIndex, skillSlot } = __globalDropdownCtx;

  if (type === 'persona') {
    // 페르소나 목록
    let items = Object.keys(personaData);
    if (filter) {
      const f = filter.toLowerCase();
      items = items.filter(p => {
        const dn = getPersonaDisplayName(p);
        return dn.toLowerCase().includes(f) || p.toLowerCase().includes(f);
      });
    }
    try {
      const lang = getCurrentLanguage();
      const locale = lang === 'kr' ? 'ko-KR' : (lang === 'jp' ? 'ja-JP' : 'en');
      items.sort((a, b) => getPersonaDisplayName(a).localeCompare(getPersonaDisplayName(b), locale, { sensitivity: 'base' }));
    } catch(_){}

    // '-' 선택 해제 옵션
    const none = document.createElement('div');
    none.className = 'dropdown-item';
    none.style.display = 'flex';
    none.style.alignItems = 'center';
    none.style.gap = '8px';
    none.style.padding = '6px 8px';
    none.style.cursor = 'pointer';
    none.textContent = '-';
    none.addEventListener('click', () => {
      input.value = '';
      input.removeAttribute('data-display-value');
      const container = input.closest('.input-container');
      if (container) {
        container.removeAttribute('data-display-text');
        container.classList.remove('show-translation');
      }
      if (!window.__IS_APPLYING_IMPORT) {
        const ev = new Event('change', { bubbles: true });
        input.dispatchEvent(ev);
      }
      closePortal();
    });
    list.appendChild(none);

    items.forEach(persona => {
      const row = document.createElement('div');
      row.className = 'dropdown-item';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      row.style.padding = '6px 8px';
      row.style.cursor = 'pointer';
      const img = document.createElement('img');
      img.className = 'persona-icon';
      img.src = `${BASE_URL}/assets/img/tactic-persona/${persona}.webp`;
      img.alt = '';
      img.style.width = '22px';
      img.style.height = '22px';
      img.onerror = function(){ this.style.display = 'none'; };
      row.appendChild(img);
      const span = document.createElement('span');
      span.textContent = getPersonaDisplayName(persona);
      row.appendChild(span);
      row.addEventListener('click', () => {
        // 값 설정 및 오버레이/체인지 처리
        input.value = persona;
        const displayName = getPersonaDisplayName(persona);
        input.setAttribute('data-display-value', displayName);
        const container = input.closest('.input-container');
        if (container) {
          if (getCurrentLanguage() !== 'kr') {
            container.setAttribute('data-display-text', displayName);
            container.classList.add('show-translation');
          } else {
            container.classList.remove('show-translation');
          }
        }
        // change 디스패치
        if (!window.__IS_APPLYING_IMPORT) {
          const ev = new Event('change', { bubbles: true });
          input.dispatchEvent(ev);
        }
        closePortal();
      });
      list.appendChild(row);
    });
  } else if (type === 'skill') {
    // 스킬 목록 ('-' 항목 포함)
    const addRow = (label, opt) => {
      const row = document.createElement('div');
      row.className = 'dropdown-item';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      row.style.padding = '6px 8px';
      row.style.cursor = 'pointer';
      if (opt && opt.iconName) {
        const img = document.createElement('img');
        img.className = 'skill-icon';
        img.src = `${BASE_URL}/assets/img/skill-element/${opt.iconName}.png`;
        img.alt = '';
        img.style.width = '22px';
        img.style.height = '22px';
        img.onerror = function(){ this.style.display = 'none'; };
        row.appendChild(img);
      }
      const span = document.createElement('span');
      span.textContent = label;
      row.appendChild(span);
      row.addEventListener('click', () => {
        const val = opt && opt.value ? opt.value : '';
        input.value = val;
        const container = input.closest('.input-container');
        if (container) {
          if (val) {
            const displayName = getSkillDisplayName(val);
            input.setAttribute('data-display-value', displayName);
            if (getCurrentLanguage() !== 'kr') {
              container.setAttribute('data-display-text', displayName);
              container.classList.add('show-translation');
            } else {
              container.classList.remove('show-translation');
            }
          } else {
            input.removeAttribute('data-display-value');
            container.removeAttribute('data-display-text');
            container.classList.remove('show-translation');
          }
        }
        // 아이콘 적용
        setSkillIconOnInput(input, val || '');
        // change 디스패치
        const ev = new Event('change', { bubbles: true });
        input.dispatchEvent(ev);
        closePortal();
      });
      list.appendChild(row);
    };

    addRow('-', { value: '' });

    let skills = Object.keys(personaSkillList).map((name, idx) => ({ name, __index: idx }));
    if (filter) {
      const f = filter.toLowerCase();
      skills = skills.filter(s => {
        const dn = getSkillDisplayName(s.name);
        return dn.toLowerCase().includes(f) || s.name.toLowerCase().includes(f);
      });
    }
    try {
      skills.sort((a, b) => {
        const pa = getSkillPriority(a.name);
        const pb = getSkillPriority(b.name);
        if (pa !== pb) return pa - pb;
        return (a.__index ?? 0) - (b.__index ?? 0);
      });
    } catch(_){}
    skills.forEach(s => {
      const lang = getCurrentLanguage();
      const data = personaSkillList[s.name] || {};
      const iconName = (lang === 'en' || lang === 'jp') ? (data.icon_gl || data.icon || '') : (data.icon || '');
      addRow(getSkillDisplayName(s.name), { value: s.name, iconName });
    });
  } else if (type === 'character') {
    // 캐릭터 목록 (setparty.js와 동일 로직 기반)
    let items = [];
    const currentLang = getCurrentLanguage();
    const locale = currentLang === 'kr' ? 'ko' : (currentLang === 'jp' ? 'ja' : 'en');
    let forceKR = false;
    try { forceKR = localStorage.getItem('forceKRList') === 'true'; } catch(_) { forceKR = false; }
    const partyIndex = __globalDropdownCtx.partyIndex;
    if (!forceKR && currentLang !== 'kr' && window.languageData && window.languageData[currentLang] && window.languageData[currentLang].characterList) {
      items = partyIndex === 4 ? window.languageData[currentLang].characterList.supportParty : window.languageData[currentLang].characterList.mainParty;
    } else if (typeof characterList !== 'undefined') {
      items = partyIndex === 4 ? characterList.supportParty : characterList.mainParty;
    }

    // 필터 및 정렬
    let filtered = items;
    if (filter) {
      const f = String(filter).toLowerCase();
      filtered = items.filter(char => {
        const ch = (typeof characterData !== 'undefined') ? characterData[char] : null;
        const names = [
          String(char || '').toLowerCase(), // KR 키(코드키)
          ch && ch.codename ? String(ch.codename).toLowerCase() : '', // codename
          ch && ch.name ? String(ch.name).toLowerCase() : '', // KR 이름
          ch && ch.name_kr ? String(ch.name_kr).toLowerCase() : '',
          ch && ch.name_en ? String(ch.name_en).toLowerCase() : '',
          ch && ch.name_jp ? String(ch.name_jp).toLowerCase() : ''
        ].filter(Boolean);
        return names.some(n => n.includes(f));
      });
    }
    filtered = [...filtered].sort((a,b)=>{
      const da = (function(c){
        const lang = getCurrentLanguage();
        if (!characterData[c]) return c;
        const ch = characterData[c];
        if (lang === 'en') return ch.codename || ch.name_en || c;
        if (lang === 'jp') return ch.name_jp || c;
        return c; // KR은 KR 키(표시용)
      })(a);
      const db = (function(c){
        const lang = getCurrentLanguage();
        if (!characterData[c]) return c;
        const ch = characterData[c];
        if (lang === 'en') return ch.codename || ch.name_en || c;
        if (lang === 'jp') return ch.name_jp || c;
        return c;
      })(b);
      return da.localeCompare(db, locale, { sensitivity: 'base' });
    });

    // '-' 선택 해제 옵션
    const none = document.createElement('div');
    none.className = 'dropdown-item';
    none.textContent = '-';
    none.addEventListener('click', () => {
      if (__globalDropdownCtx.onSelect) {
        __globalDropdownCtx.onSelect('', '');
      } else if (input) {
        input.value = '';
        const ev = new Event('change', { bubbles: true });
        input.dispatchEvent(ev);
      }
      closePortal();
    });
    list.appendChild(none);

    filtered.forEach(char => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      const iconImg = document.createElement('img');
      iconImg.className = 'character-icon';
      iconImg.src = `${BASE_URL}/assets/img/character-half/${char}.webp`;
      iconImg.alt = '';
      iconImg.onerror = function(){ this.style.display='none'; };
      item.appendChild(iconImg);
      const nameSpan = document.createElement('span');
      const disp = (function(c){
        const lang = getCurrentLanguage();
        if (!characterData[c]) return c;
        const ch = characterData[c];
        if (lang === 'en') return ch.codename || ch.name_en || c;
        if (lang === 'jp') return ch.name_jp || c;
        return c; // KR은 KR 키 표시
      })(char);
      nameSpan.textContent = disp;
      item.appendChild(nameSpan);
      item.addEventListener('click', () => {
        // 내부 값은 KR 키 유지, 표시만 현지화(EN은 codename)
        const valueToSet = char;
        if (__globalDropdownCtx.onSelect) {
          __globalDropdownCtx.onSelect(valueToSet, disp);
        } else if (input) {
          input.value = valueToSet;
          const ev = new Event('change', { bubbles: true });
          input.dispatchEvent(ev);
        }
        closePortal();
      });
      list.appendChild(item);
    });

  } else if (type === 'rev-main') {
    if (typeof revelationData === 'undefined' || !revelationData.main) return;
    const mains = Object.keys(revelationData.main);
    const currentLang = getCurrentLanguage();
    const locale = currentLang === 'kr' ? 'ko' : (currentLang === 'jp' ? 'ja' : 'en');
    let filtered = mains;
    if (filter) {
      const f = filter.toLowerCase();
      filtered = mains.filter(n => {
        const disp = (typeof getRevelationDisplayName === 'function') ? getRevelationDisplayName(n) : n;
        return n.toLowerCase().includes(f) || disp.toLowerCase().includes(f);
      });
    }
    filtered = [...filtered].sort((a,b)=>{
      const da = (typeof getRevelationDisplayName === 'function') ? getRevelationDisplayName(a) : a;
      const db = (typeof getRevelationDisplayName === 'function') ? getRevelationDisplayName(b) : b;
      return da.localeCompare(db, locale, { sensitivity: 'base' });
    });
    // '-' 선택 해제 옵션
    const none = document.createElement('div');
    none.className = 'dropdown-item';
    none.style.display = 'flex';
    none.style.alignItems = 'center';
    none.style.gap = '8px';
    none.style.padding = '6px 8px';
    none.style.cursor = 'pointer';
    none.textContent = '-';
    none.addEventListener('click', ()=>{
      if (__globalDropdownCtx.onSelect) __globalDropdownCtx.onSelect('', '');
      closePortal();
    });
    list.appendChild(none);
    filtered.forEach(n => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '8px';
      item.style.padding = '6px 8px';
      item.style.cursor = 'pointer';
      // 아이콘
      const img = document.createElement('img');
      img.className = 'revelation-icon';
      img.src = `${BASE_URL}/assets/img/revelation/${n}.webp`;
      img.alt = '';
      img.style.width = 'none';
      img.style.height = '24px';
      img.onerror = function(){ this.style.display = 'none'; };
      item.appendChild(img);
      // 텍스트
      const disp = (typeof getRevelationDisplayName === 'function') ? getRevelationDisplayName(n) : n;
      const span = document.createElement('span');
      span.textContent = disp;
      item.appendChild(span);
      item.addEventListener('click', ()=>{
        if (__globalDropdownCtx.onSelect) __globalDropdownCtx.onSelect(n, disp);
        closePortal();
      });
      list.appendChild(item);
    });

  } else if (type === 'rev-sub') {
    if (typeof revelationData === 'undefined' || !revelationData.main) return;
    // 1) 우선 컨텍스트(mainForSub)
    let main = __globalDropdownCtx.mainForSub;
    // 2) 컨텍스트가 없거나 유효하지 않으면, 현재 입력(sub select)로부터 같은 파티 블록의 주 계시 값을 동적으로 재조회
    if (!main || !revelationData.main[main]) {
      try {
        const subEl = __globalDropdownCtx.input;
        const partyDiv = subEl ? subEl.closest('[data-index]') : null;
        const mainEl = partyDiv ? partyDiv.querySelector('.main-revelation') : null;
        const domVal = mainEl ? mainEl.value : '';
        if (domVal) main = domVal;
      } catch(_) {}
    }
    const currentLang = getCurrentLanguage();
    const locale = currentLang === 'kr' ? 'ko' : (currentLang === 'jp' ? 'ja' : 'en');
    // 주 계시가 표시명으로 들어온 경우 KR 키로 역매핑 시도
    if (main && !revelationData.main[main]) {
      try {
        const entries = Object.keys(revelationData.main);
        const match = entries.find(k => {
          const disp = (typeof getRevelationDisplayName === 'function') ? getRevelationDisplayName(k) : k;
          return String(disp).trim() === String(main).trim();
        });
        if (match) main = match;
      } catch(_) {}
    }
    if (!main || !revelationData.main[main]) {
      const warn = document.createElement('div');
      warn.className = 'dropdown-item';
      warn.textContent = currentLang === 'jp' ? '先にメインを選択' : (currentLang === 'en' ? 'Select main first' : '먼저 주 계시를 선택');
      list.appendChild(warn);
      return;
    }
    let subs = [...revelationData.main[main]];
    if (filter) {
      const f = filter.toLowerCase();
      subs = subs.filter(n => {
        const disp = (typeof getRevelationDisplayName === 'function') ? getRevelationDisplayName(n) : n;
        return n.toLowerCase().includes(f) || disp.toLowerCase().includes(f);
      });
    }
    subs = subs.sort((a,b)=>{
      const da = (typeof getRevelationDisplayName === 'function') ? getRevelationDisplayName(a) : a;
      const db = (typeof getRevelationDisplayName === 'function') ? getRevelationDisplayName(b) : b;
      return da.localeCompare(db, locale, { sensitivity: 'base' });
    });
    // '-' 선택 해제 옵션
    const none = document.createElement('div');
    none.className = 'dropdown-item';
    none.style.display = 'flex';
    none.style.alignItems = 'center';
    none.style.gap = '8px';
    none.style.padding = '6px 8px';
    none.style.cursor = 'pointer';
    none.textContent = '-';
    none.addEventListener('click', ()=>{
      if (__globalDropdownCtx.onSelect) __globalDropdownCtx.onSelect('', '');
      closePortal();
    });
    list.appendChild(none);
    subs.forEach(n => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '8px';
      item.style.padding = '6px 8px';
      item.style.cursor = 'pointer';
      // 아이콘
      const img = document.createElement('img');
      img.className = 'revelation-icon';
      img.src = `${BASE_URL}/assets/img/revelation/${n}.webp`;
      img.alt = '';
      img.style.width = 'none';
      img.style.height = '24px';
      img.onerror = function(){ this.style.display = 'none'; };
      item.appendChild(img);
      // 텍스트
      const disp = (typeof getRevelationDisplayName === 'function') ? getRevelationDisplayName(n) : n;
      const span = document.createElement('span');
      span.textContent = disp;
      item.appendChild(span);
      item.addEventListener('click', ()=>{
        if (__globalDropdownCtx.onSelect) __globalDropdownCtx.onSelect(n, disp);
        closePortal();
      });
      list.appendChild(item);
    });
  }
}

inputs.forEach((input, idx) => {
  input.placeholder = getPlaceholderText('persona');
  // 포탈 방식: 메인 인풋은 readonly 유지
  input.setAttribute('readonly', 'readonly');

  // input을 컨테이너로 감싸기
  const inputContainer = document.createElement("div");
  inputContainer.className = "input-container";
  // 스타일은 CSS에서 정의됨 (position, overflow-anchor)
  
  // 기존 input을 새 컨테이너로 이동
  input.parentNode.insertBefore(inputContainer, input);
  inputContainer.appendChild(input);
  
  // per-input 드롭다운 대신 전역 포탈을 사용
  
  // 드롭다운 선택 중인지 여부 플래그 (중복 change 방지)
  let isSelecting = false;
  
  // datalist 속성 제거 (커스텀 드롭다운 사용)
  input.removeAttribute("list");
  
  // per-input 드롭다운 생성/아이템 로직 제거 (전역 포탈 사용)
  
  // 포커스 이벤트에서는 아무 것도 하지 않음 (메인 입력 포커스/캐럿 미이동)
  input.addEventListener("focus", function() {});
  
  // blur 시 별도 처리 없음 (포탈 내부에서 선택/닫기 처리)
  input.addEventListener("blur", function() {});
  
  // 어떤 위치를 클릭하든 포탈 열기 (포커스 방지로 스크롤 점프 차단)
  input.addEventListener("mousedown", function(e) {
    e.preventDefault();
    openPortal('persona', this, { personaIndex: idx });
  });
  
  // input 이벤트 리스너 수정
  input.addEventListener("change", (e) => {
    const oldPersona = wonderPersonas[idx];
    const newPersona = e.target.value;
    // 변경 없음이면 스킵
    if ((oldPersona || '') === (newPersona || '')) {
      return;
    }
    wonderPersonas[idx] = newPersona;
    
    // 고유 스킬 설정
    const uniqueSkillInput = wonderConfigDiv.querySelector(
        `.persona-skill-input[data-persona-index="${idx}"][data-skill-slot="0"]`
    );
    
    if (newPersona && personaData[newPersona]) {
        // 고유 스킬 설정 및 비활성화 (번역된 이름으로 표시)
        const uniqueSkillName = personaData[newPersona].uniqueSkill.name;
        uniqueSkillInput.value = uniqueSkillName;
        uniqueSkillInput.disabled = true;
        uniqueSkillInput.classList.add('unique-skill');
        // 고유 스킬 아이콘 표시 (언어에 따라 icon_gl 우선)
        const lang = getCurrentLanguage();
        const u = personaData[newPersona]?.uniqueSkill || {};
        const uniqueIconKey = (lang === 'en' || lang === 'jp') ? (u.icon_gl || u.icon || '') : (u.icon || '');
        setSkillIconOnInputWithElement(uniqueSkillInput, uniqueIconKey);
        
        // 번역된 스킬 이름으로 표시
        if (getCurrentLanguage() !== 'kr') {
          const displaySkillName = getUniqueSkillDisplayName(newPersona, uniqueSkillName);
          uniqueSkillInput.setAttribute('data-display-value', displaySkillName);
          const skillInputContainer = uniqueSkillInput.closest('.input-container');
          if (skillInputContainer) {
            skillInputContainer.setAttribute('data-display-text', displaySkillName);
            skillInputContainer.classList.add('show-translation');
          }
        } else {
          // 한국어 모드일 때는 번역 표시 제거
          let skillInputContainer = uniqueSkillInput.closest('.input-container');
          if (skillInputContainer) {
            skillInputContainer.classList.remove('show-translation');
          }
        }
        
        // 턴 데이터에서 해당 페르소나 업데이트 및 액션 메모 설정
        turns.forEach(turn => {
            turn.actions.forEach(action => {
                if (action.character === "원더" && action.wonderPersona === oldPersona) {
                    action.wonderPersona = newPersona;
                    // 스킬1이 있으면 스킬1을, 없으면 고유스킬을 메모에 설정
                    const skill1Input = wonderConfigDiv.querySelector(
                        `.persona-skill-input[data-persona-index="${idx}"][data-skill-slot="1"]`
                    );
                    action.memo = skill1Input?.value || uniqueSkillName || "";
                }
            });
        });
    } else {
        // 페르소나가 선택되지 않은 경우 초기화
        uniqueSkillInput.value = '';
        uniqueSkillInput.disabled = false;
        uniqueSkillInput.classList.remove('unique-skill');
        
        // 번역 표시 제거
        let skillInputContainer = uniqueSkillInput.closest('.input-container');
        if (skillInputContainer) {
          skillInputContainer.classList.remove('show-translation');
        }
        // 고유 스킬 아이콘 제거
        setSkillIconOnInputWithElement(uniqueSkillInput, '');
    }
    
    debouncedUpdate();
  });

  // 상태 업데이트는 change 또는 드롭다운 선택 시에만 처리 (중복/과도한 리플로 방지)
});

// 스타일은 외부 CSS(assets/css/tactic.css)로 이동됨

// 기존 입력값들 번역 표시 초기화
function initializeTranslations() {
  const currentLang = getCurrentLanguage();
  
  // 페르소나 입력 필드들: 번역 오버레이는 비-KR만
  inputs.forEach((input) => {
    const inputContainer = input.closest('.input-container');
    if (!inputContainer) return;
    if (input.value && personaData[input.value]) {
      const displayName = getPersonaDisplayName(input.value);
      input.setAttribute('data-display-value', displayName);
      if (currentLang !== 'kr') {
        inputContainer.setAttribute('data-display-text', displayName);
        inputContainer.classList.add('show-translation');
      } else {
        inputContainer.classList.remove('show-translation');
      }
    } else {
      inputContainer.classList.remove('show-translation');
    }
  });
  
  // 스킬 입력 필드들: 아이콘은 항상, 오버레이는 비-KR만
  skillInputs.forEach((input) => {
    const val = input.value;
    const inputContainer = input.closest('.input-container');
    if (!inputContainer) return;
    const isUnique = input.getAttribute('data-skill-slot') === '0';
    const baseKey = resolveSkillKey(val);
    if (!isUnique) {
      if (baseKey && personaSkillList[baseKey]) {
        const displayName = getSkillDisplayName(baseKey);
        input.setAttribute('data-display-value', displayName);
        if (currentLang !== 'kr') {
          inputContainer.setAttribute('data-display-text', displayName);
          inputContainer.classList.add('show-translation');
        } else {
          inputContainer.classList.remove('show-translation');
        }
      } else {
        inputContainer.classList.remove('show-translation');
      }
    }
    // 선택 스킬 아이콘 적용 (값이 없으면 제거)
    setSkillIconOnInput(input, baseKey || '');
  });
}

// 아이콘/오버레이 적용을 외부에서도 호출할 수 있게 전역 노출
window.wonderApplySkillInputDecor = function() {
  const currentLang = getCurrentLanguage();
  const skillInputs = document.querySelectorAll('.persona-skill-input');
  skillInputs.forEach((input) => {
    const val = input.value;
    const baseKey = resolveSkillKey(val);
    // 아이콘 적용
    const isUnique = input.getAttribute('data-skill-slot') === '0';
    if (isUnique) {
      const personaIndex = input.getAttribute('data-persona-index');
      let personaKey = undefined;
      if (typeof personaIndex !== 'undefined' && personaIndex !== null) {
        const pi = Number(personaIndex);
        if (!Number.isNaN(pi) && Array.isArray(wonderPersonas)) {
          personaKey = wonderPersonas[pi];
        }
      }
      const uData = personaKey ? (personaData[personaKey]?.uniqueSkill || {}) : {};
      const uIcon = (currentLang === 'en' || currentLang === 'jp') ? (uData.icon_gl || uData.icon || '') : (uData.icon || '');
      setSkillIconOnInputWithElement(input, uIcon || '');
    } else {
      // Pass the resolved skill key; setSkillIconOnInput will choose icon (icon_gl for en/jp) internally
      setSkillIconOnInput(input, baseKey || '');
    }
    // 번역 오버레이 적용은 비-KR만
    const container = input.closest('.input-container');
    if (!container) return;
    if (!isUnique && baseKey && currentLang !== 'kr') {
      const displayName = getSkillDisplayName(baseKey);
      container.setAttribute('data-display-text', displayName);
      container.classList.add('show-translation');
    } else if (!isUnique) {
      container.classList.remove('show-translation');
    }
  });
};

// 초기화 실행: 1회만 호출하여 불필요한 리플로우 방지
setTimeout(initializeTranslations, 100);
setTimeout(() => {
  if (window.wonderApplySkillInputDecor) window.wonderApplySkillInputDecor();
}, 150);

// 임포트 플래그 해제 대기 후 한 번 적용
// 임포트가 실제 사용되는 경우에만 1회 후처리
(function waitImportThenDecor() {
  if (typeof window.__IS_APPLYING_IMPORT === 'undefined') return;
  const iv = setInterval(() => {
    if (!window.__IS_APPLYING_IMPORT) {
      clearInterval(iv);
      if (window.wonderApplySkillInputDecor) window.wonderApplySkillInputDecor();
    }
  }, 200);
})();

// 짧은 폴링: 늦게 채워지는 값에 대해서도 아이콘/오버레이 적용 보장 (최대 ~10초)
// 지속 폴링 제거: 상시 리플로우 방지

// 페르소나 스킬 datalist 생성
const skillsDatalist = document.createElement("datalist");
skillsDatalist.id = "persona-skills-list";

// personaSkillList에서 모든 스킬 수집
const skillsWithIcons = [];

// personaSkillList의 모든 스킬 추가 (원래 선언 순서를 보존하기 위해 인덱스 기록)
Object.keys(personaSkillList).forEach((skillName, idx) => {
    const skillData = personaSkillList[skillName] || {};
    skillsWithIcons.push({
        name: skillName,
        icon: skillData.icon || "", // 아이콘 정보가 없을 경우 빈 문자열
        icon_gl: skillData.icon_gl || "",
        __index: idx
    });
});

// 스킬 우선순위 (아이콘 기준): 디버프(0) > 버프(1) > 기타(2)
function getSkillPriority(skillName) {
  const data = personaSkillList[skillName];
  const icon = data && typeof data.icon === 'string' ? data.icon : '';
  if (icon.includes('디버프')) return 0;
  if (icon.includes('버프')) return 1;
  return 2;
}

// (임포트 대응) 로컬라이즈된 스킬명 -> 기준(KR) 키로 역매핑
function resolveSkillKey(name) {
  if (!name) return '';
  if (personaSkillList[name]) return name; // 이미 KR 키
  const lang = getCurrentLanguage();
  // EN/JP로 들어왔을 가능성: 전체 검색
  for (const [kr, data] of Object.entries(personaSkillList)) {
    if (!data) continue;
    if (data.name_en && data.name_en === name) return kr;
    if (data.name_jp && data.name_jp === name) return kr;
  }
  // 현재 언어와 무관하게 마지막 시도: 대소문자 무시 비교
  const lower = String(name).toLowerCase();
  for (const [kr, data] of Object.entries(personaSkillList)) {
    if (!data) continue;
    if (kr.toLowerCase() === lower) return kr;
    if (data.name_en && data.name_en.toLowerCase() === lower) return kr;
    if (data.name_jp && data.name_jp.toLowerCase() === lower) return kr;
  }
  return '';
}

// 선택된 스킬 아이콘을 인풋에 표시/제거 (컨테이너에 이미지 엘리먼트로 표시)
function setSkillIconOnInput(inputEl, skillName) {
  const baseKey = resolveSkillKey(skillName);
  const data = personaSkillList[baseKey];
  const lang = getCurrentLanguage();
  let icon = '';
  if (data) {
    if (lang === 'en' || lang === 'jp') {
      icon = (typeof data.icon_gl === 'string' && data.icon_gl) ? data.icon_gl : (typeof data.icon === 'string' ? data.icon : '');
    } else {
      icon = (typeof data.icon === 'string') ? data.icon : '';
    }
  }
  const container = inputEl.closest('.input-container');
  if (!container) return;
  let iconEl = container.querySelector('.skill-selected-icon');
  if (icon) {
    if (!iconEl) {
      iconEl = document.createElement('img');
      iconEl.className = 'skill-selected-icon';
      iconEl.alt = '';
      container.appendChild(iconEl);
    }
    iconEl.src = `${BASE_URL}/assets/img/skill-element/${icon}.png`;
    inputEl.classList.add('has-icon');
    container.classList.add('has-skill-icon');
  } else {
    if (iconEl) {
      iconEl.remove();
    }
    inputEl.classList.remove('has-icon');
    const ic = inputEl.closest('.input-container');
    if (ic) ic.classList.remove('has-skill-icon');
  }
}

// 요소(속성) 키로 바로 아이콘을 설정하는 헬퍼 (예: uniqueSkill.icon)
function setSkillIconOnInputWithElement(inputEl, elementKey) {
  const icon = elementKey ? String(elementKey) : '';
  const container = inputEl.closest('.input-container');
  if (!container) return;
  let iconEl = container.querySelector('.skill-selected-icon');
  if (icon) {
    if (!iconEl) {
      iconEl = document.createElement('img');
      iconEl.className = 'skill-selected-icon';
      iconEl.alt = '';
      container.appendChild(iconEl);
    }
    iconEl.src = `${BASE_URL}/assets/img/skill-element/${icon}.png`;
    iconEl.onerror = function() { this.style.display = 'none'; };
    inputEl.classList.add('has-icon');
    container.classList.add('has-skill-icon');
  } else {
    if (iconEl) {
      iconEl.remove();
    }
    inputEl.classList.remove('has-icon');
    container.classList.remove('has-skill-icon');
  }
}

// 페르소나 스킬 입력 필드 설정 (전역 포탈 사용)
const skillInputs = wonderConfigDiv.querySelectorAll(".persona-skill-input");
skillInputs.forEach((input) => {
    input.placeholder = getPlaceholderText('skill');
    // 포탈 방식: 메인 인풋은 readonly 유지
    input.setAttribute('readonly', 'readonly');

    // datalist 속성 제거 (커스텀 드롭다운 비사용)
    input.removeAttribute("list");
    
    const inputContainer = document.createElement("div");
    inputContainer.className = "input-container";
    inputContainer.style.position = "relative";
    
    input.parentNode.insertBefore(inputContainer, input);
    inputContainer.appendChild(input);

    // 포커스/블러는 별도 처리 없음 (포탈 내부에서만 상호작용)
    input.addEventListener('focus', function() {});
    input.addEventListener('blur', function() {});

    // 클릭 시 포탈 열기 (포커스 방지로 스크롤 점프 차단)
    input.addEventListener('mousedown', function(e) {
      e.preventDefault();
      const personaIndex = this.getAttribute('data-persona-index');
      const skillSlot = this.getAttribute('data-skill-slot');
      openPortal('skill', this, { personaIndex, skillSlot });
    });

    // 값 변경 시 상태 업데이트(기존 로직 유지)
    input.addEventListener("change", () => {
        if (window.__IS_APPLYING_IMPORT) return;
        debouncedUpdate();
        updateActionMemos();
    });
});
  // 닫기: 드롭다운 바깥 클릭 시 모두 닫기 (한 번만 바인딩)
  if (!wonderConfigDiv.__outsideCloseBound) {
    const closeIfOutside = (evt) => {
      const target = evt.target;
      const openDropdowns = wonderConfigDiv.querySelectorAll('.custom-dropdown.active');
      if (!openDropdowns.length) return;

      openDropdowns.forEach(dd => {
        const container = dd.closest('.input-container');
        // 컨테이너나 드롭다운 내부를 클릭한 경우는 제외
        if (container && (container.contains(target) || dd.contains(target))) return;
        dd.classList.remove('active');
      });
    };

    document.addEventListener('mousedown', closeIfOutside, true);
    document.addEventListener('touchstart', closeIfOutside, true);
    // 포커스가 다른 요소로 이동했을 때 닫기
    document.addEventListener('focusin', (evt) => closeIfOutside(evt), true);
    // ESC 키로 닫기
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        const openDropdowns = wonderConfigDiv.querySelectorAll('.custom-dropdown.active');
        openDropdowns.forEach(dd => dd.classList.remove('active'));
      }
    }, true);
    Object.defineProperty(wonderConfigDiv, '__outsideCloseBound', { value: true, writable: false });
  }

  //renderTurns();
}
