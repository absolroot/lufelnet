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
            kr: '선택',
            en: 'Select',
            jp: '選択'
        },
        weapon: {
            kr: '선택',
            en: 'Select',
            jp: '選択'
        },
        skill: {
            kr: '선택',
            en: 'Select',
            jp: '選択'
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
  // 현재 턴 순서(번호) 스냅샷
  const prevOrder = Array.isArray(turns) ? turns.map(t => t.turn) : [];

  updateAutoActions(); // 내부에서 renderTurns() 호출됨
  updatePartyImages();
  updateActionMemos(); // 메모만 갱신 (턴 재정렬 방지)

  // 혹시라도 외부 요인으로 turns 순서가 바뀌었을 경우, 기존 순서로 복원
  if (Array.isArray(turns) && prevOrder.length === turns.length) {
    turns.sort((a, b) => prevOrder.indexOf(a.turn) - prevOrder.indexOf(b.turn));
  }
}, 300);

inputs.forEach((input, idx) => {
  input.placeholder = getPlaceholderText('persona');
  // Make persona input non-editable; open dropdown only
  input.setAttribute('readonly', 'readonly');

  // input을 컨테이너로 감싸기
  const inputContainer = document.createElement("div");
  inputContainer.className = "input-container";
  // 스타일은 CSS에서 정의됨 (position, overflow-anchor)
  
  // 기존 input을 새 컨테이너로 이동
  input.parentNode.insertBefore(inputContainer, input);
  inputContainer.appendChild(input);
  
  // 커스텀 드롭다운 생성
  const customDropdown = document.createElement("div");
  customDropdown.className = "custom-dropdown";
  // 스크롤 앵커링 스타일은 CSS에서 처리
  inputContainer.appendChild(customDropdown);
  
  // 드롭다운 선택 중인지 여부 플래그 (중복 change 방지)
  let isSelecting = false;
  
  // datalist 속성 제거 (커스텀 드롭다운 사용)
  input.removeAttribute("list");
  
  // 페르소나 드롭다운 항목 생성 함수
  const createPersonaDropdownItems = (filter = "") => {
    customDropdown.innerHTML = "";
    
    // 페르소나 목록 필터링
    let filteredPersonas = Object.keys(personaData);
    if (filter) {
      filteredPersonas = Object.keys(personaData).filter(persona => {
        const displayName = getPersonaDisplayName(persona);
        return displayName.toLowerCase().includes(filter.toLowerCase()) ||
                persona.toLowerCase().includes(filter.toLowerCase());
      });
    }
    // 언어별 표시 이름으로 정렬
    try {
      const lang = getCurrentLanguage();
      const locale = lang === 'kr' ? 'ko-KR' : (lang === 'jp' ? 'ja-JP' : 'en');
      filteredPersonas.sort((a, b) => getPersonaDisplayName(a).localeCompare(getPersonaDisplayName(b), locale, { sensitivity: 'base' }));
    } catch (_) { /* no-op */ }
    
    // 드롭다운 항목 추가
    filteredPersonas.forEach(persona => {
      const item = document.createElement("div");
      item.className = "dropdown-item";
      
      // 페르소나 아이콘 추가
      const iconImg = document.createElement("img");
      iconImg.className = "persona-icon";
      iconImg.src = `${BASE_URL}/assets/img/tactic-persona/${persona}.webp`;
      iconImg.alt = "";
      iconImg.onerror = function() {
        this.style.display = 'none';
      };
      item.appendChild(iconImg);
      
      // 페르소나 이름 추가 (번역된 이름으로 표시)
      const nameSpan = document.createElement("span");
      nameSpan.textContent = getPersonaDisplayName(persona);
      item.appendChild(nameSpan);
      
      // 파티 드롭다운과 동일하게 mousedown 억제 제거

      item.addEventListener("click", () => {
        // 선택 중 플래그 설정 (blur에서 중복 처리 방지)
        isSelecting = true;

        // 실제 값은 한국어 이름으로 저장
        input.value = persona;
        customDropdown.classList.remove("active");
        
        // 표시는 번역된 이름으로 업데이트
        const displayName = getPersonaDisplayName(persona);
        input.setAttribute('data-display-value', displayName);
        if (getCurrentLanguage() !== 'kr') {
          inputContainer.setAttribute('data-display-text', displayName);
          inputContainer.classList.add('show-translation');
        } else {
          inputContainer.classList.remove('show-translation');
        }

        // 포커스를 잃게 하여 번역된 텍스트가 바로 보이도록 함
        setTimeout(() => { input.blur(); }, 0);
        
        // change 이벤트는 한 번만 발생시키기
        if (!window.__IS_APPLYING_IMPORT) {
          const event = new Event("change", { bubbles: true });
          input.dispatchEvent(event);
        }

        // 다음 틱에서 플래그 해제
        setTimeout(() => { isSelecting = false; }, 0);
      });
      customDropdown.appendChild(item);
    });
  };
  
  // 페르소나 입력 필드 이벤트 처리
  input.addEventListener("focus", function() {
    // 원래 값 저장만; 값은 유지 (비편집형)
    this.setAttribute('data-original-value', this.value);
    // 번역 표시 제거하여 placeholder가 보이도록 함
    inputContainer.classList.remove('show-translation');
    // 전체 목록 표시
    createPersonaDropdownItems('');
    customDropdown.classList.add("active");
  });
  
  input.addEventListener("blur", function() {
    setTimeout(() => {
      customDropdown.classList.remove("active");

      // 새로운 값이 선택되지 않았다면 원래 값으로 복원
      if (this.value.trim() === '') {
          this.value = this.getAttribute('data-original-value') || '';
      }
      
      // 값에 따른 번역 표시 적용
      if (this.value && getCurrentLanguage() !== 'kr') {
        const displayName = getPersonaDisplayName(this.value);
        inputContainer.setAttribute('data-display-text', displayName);
        inputContainer.classList.add('show-translation');
      } else {
        inputContainer.classList.remove('show-translation');
      }

      // 값이 실제로 변경되었고, 드롭다운 선택 중이 아니며, import 중이 아닐 때만 change 발생
      const prev = this.getAttribute('data-original-value') || '';
      const changed = this.value.trim() !== '' && this.value !== prev;
      if (!isSelecting && changed && !window.__IS_APPLYING_IMPORT) {
        const event = new Event("change", { bubbles: true });
        this.dispatchEvent(event);
      }
    }, 200); // 200ms delay to allow click on dropdown items
  });
  
  // Disable typing-based filtering
  
  // Toggle dropdown on any click
  input.addEventListener("mousedown", function(e) {
    e.preventDefault();
    if (customDropdown.classList.contains("active")) {
      customDropdown.classList.remove("active");
    } else {
      createPersonaDropdownItems('');
      customDropdown.classList.add("active");
    }
  });
  
  // clear 버튼 추가
  const clearBtn = document.createElement("button");
  clearBtn.className = "clear-input";
  clearBtn.textContent = "×";
  clearBtn.addEventListener("click", () => {
    input.value = "";
    wonderPersonas[idx] = "";
    debouncedUpdate();
    input.focus();
  });
  inputContainer.appendChild(clearBtn);
  
  // input 이벤트 리스너 수정
  input.addEventListener("change", (e) => {
    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;
    const oldPersona = wonderPersonas[idx];
    const newPersona = e.target.value;
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
        
        // 번역된 스킬 이름으로 표시
        if (getCurrentLanguage() !== 'kr') {
          const displaySkillName = getUniqueSkillDisplayName(newPersona, uniqueSkillName);
          uniqueSkillInput.setAttribute('data-display-value', displaySkillName);
          
          // 고유스킬 입력 필드가 .input-container로 감싸져 있지 않은 경우 처리
          let skillInputContainer = uniqueSkillInput.closest('.input-container');
          if (!skillInputContainer) {
            // .input-container로 감싸기
            skillInputContainer = document.createElement('div');
            skillInputContainer.className = 'input-container';
            skillInputContainer.style.position = 'relative';
            
            uniqueSkillInput.parentNode.insertBefore(skillInputContainer, uniqueSkillInput);
            skillInputContainer.appendChild(uniqueSkillInput);
          }
          
          skillInputContainer.setAttribute('data-display-text', displaySkillName);
          skillInputContainer.classList.add('show-translation');
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
    }
    
    debouncedUpdate();
  });

  // 상태 업데이트는 change 또는 드롭다운 선택 시에만 처리 (중복/과도한 리플로 방지)
});

// 스타일은 외부 CSS(assets/css/tactic.css)로 이동됨

// 기존 입력값들 번역 표시 초기화
function initializeTranslations() {
  const currentLang = getCurrentLanguage();
  if (currentLang === 'kr') return;
  
  // 페르소나 입력 필드들
  inputs.forEach((input) => {
    if (input.value && personaData[input.value]) {
      const displayName = getPersonaDisplayName(input.value);
      input.setAttribute('data-display-value', displayName);
      const inputContainer = input.closest('.input-container');
      if (inputContainer) {
        inputContainer.setAttribute('data-display-text', displayName);
        inputContainer.classList.add('show-translation');
      }
    }
  });
  
  // 스킬 입력 필드들
  skillInputs.forEach((input) => {
    if (input.value && personaSkillList[input.value]) {
      const displayName = getSkillDisplayName(input.value);
      input.setAttribute('data-display-value', displayName);
      const inputContainer = input.closest('.input-container');
      if (inputContainer) {
        inputContainer.setAttribute('data-display-text', displayName);
        inputContainer.classList.add('show-translation');
      }
    }
  });
}

// 초기화 실행 (여러 번 실행하여 확실히 적용)
setTimeout(initializeTranslations, 100);
setTimeout(initializeTranslations, 500);
setTimeout(initializeTranslations, 1000);

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

// 페르소나 스킬 입력 필드 설정
const skillInputs = wonderConfigDiv.querySelectorAll(".persona-skill-input");
skillInputs.forEach((input) => {
    input.placeholder = getPlaceholderText('skill');
    // Make skill input non-editable; open dropdown only
    input.setAttribute('readonly', 'readonly');

    // datalist 속성 제거 (커스텀 드롭다운 사용)
    input.removeAttribute("list");
    
    const inputContainer = document.createElement("div");
    inputContainer.className = "input-container";
    inputContainer.style.position = "relative";
    
    input.parentNode.insertBefore(inputContainer, input);
    inputContainer.appendChild(input);
    
    // 커스텀 드롭다운 생성
    const customDropdown = document.createElement("div");
    customDropdown.className = "custom-dropdown";
    inputContainer.appendChild(customDropdown);
    
    // 드롭다운 항목 생성 함수
    const createDropdownItems = (filter = "") => {
        customDropdown.innerHTML = "";
        
        // 스킬 목록 필터링 (필터가 있을 경우만 필터링)
        let filteredSkills = skillsWithIcons;
        if (filter) {
            filteredSkills = skillsWithIcons.filter(skill => {
                const displayName = getSkillDisplayName(skill.name);
                return displayName.toLowerCase().includes(filter.toLowerCase()) ||
                        skill.name.toLowerCase().includes(filter.toLowerCase());
            });
        }
        // 아이콘 기준 그룹화: 디버프 -> 버프 -> 기타, 각 그룹 내에서는 원래 선언 순서 유지
        try {
            filteredSkills.sort((a, b) => {
                const pa = getSkillPriority(a.name);
                const pb = getSkillPriority(b.name);
                if (pa !== pb) return pa - pb;
                const ia = (a.__index ?? 0);
                const ib = (b.__index ?? 0);
                return ia - ib;
            });
        } catch (_) { /* no-op */ }
        
        // 드롭다운 항목 추가 (모든 스킬 표시)
        filteredSkills.forEach(skill => {
            const item = document.createElement("div");
            item.className = "dropdown-item";
            
            // 아이콘이 있으면 이미지 추가
            if (skill.icon) {
                const iconImg = document.createElement("img");
                iconImg.className = "skill-icon";
                iconImg.src = `${BASE_URL}/assets/img/skill-element/${skill.icon}.png`;
                iconImg.alt = "";
                iconImg.onerror = function() {
                    // 이미지 로드 실패 시 아이콘 제거
                    this.style.display = 'none';
                };
                item.appendChild(iconImg);
            }
            
            // 스킬 이름 추가 (번역된 이름으로 표시)
            const nameSpan = document.createElement("span");
            nameSpan.textContent = getSkillDisplayName(skill.name);
            item.appendChild(nameSpan);
            
            item.addEventListener("click", () => {
                isSelecting = true;
                // 실제 값은 한국어 이름으로 저장
                input.value = skill.name;
                customDropdown.classList.remove("active");
                
                // 표시는 번역된 이름으로 업데이트
                const displayName = getSkillDisplayName(skill.name);
                input.setAttribute('data-display-value', displayName);
                if (getCurrentLanguage() !== 'kr') {
                  inputContainer.setAttribute('data-display-text', displayName);
                  inputContainer.classList.add('show-translation');
                } else {
                  inputContainer.classList.remove('show-translation');
                }
                
                // 포커스를 잃게 하여 번역된 텍스트가 바로 보이도록 함
                setTimeout(() => input.blur(), 0);
                
                // change 이벤트 강제 발생
                const event = new Event("change", { bubbles: true });
                input.dispatchEvent(event);

                // 다음 틱에서 선택 상태 해제
                setTimeout(() => { isSelecting = false; }, 0);
            });
            customDropdown.appendChild(item);
        });
    };
    
    // 드롭다운 관련 이벤트 처리
    input.addEventListener("focus", function() {
        // 원래 값만 저장 (값은 비우지 않음)
        this.setAttribute('data-original-value', this.value);

        // 번역 표시 제거
        inputContainer.classList.remove('show-translation');

        createDropdownItems('');
        customDropdown.classList.add("active");
        // do not lock page scroll or force scroll restoration
    });
    
    input.addEventListener("blur", function() {
        setTimeout(() => {
            customDropdown.classList.remove("active");

            // 값에 따른 번역 표시 적용
            if (this.value && getCurrentLanguage() !== 'kr') {
                const displayName = getSkillDisplayName(this.value);
                inputContainer.setAttribute('data-display-text', displayName);
                inputContainer.classList.add('show-translation');
            } else {
                inputContainer.classList.remove('show-translation');
            }

            // change 이벤트는 드롭다운 선택이 아닌 경우이면서, 값이 실제로 변경된 경우에만 발생
            const prev = this.getAttribute('data-original-value') || '';
            const changed = this.value.trim() !== '' && this.value !== prev;
            if (!isSelecting && changed && !window.__IS_APPLYING_IMPORT) {
                const event = new Event("change", { bubbles: true });
                this.dispatchEvent(event);
            }

        }, 200);
    });
  
    // Disable typing-based filtering (readonly prevents typing anyway)
    
    // Toggle dropdown on any click
    input.addEventListener("mousedown", function(e) {
        e.preventDefault();
        if (customDropdown.classList.contains("active")) {
            customDropdown.classList.remove("active");
        } else {
            createDropdownItems('');
            customDropdown.classList.add("active");
        }
    });
    
    // 입력 이벤트 리스너
    input.addEventListener("change", () => {
        if (window.__IS_APPLYING_IMPORT) return;
        debouncedUpdate();
        updateActionMemos();
        // no forced scroll restoration
    });
    
    // Removed duplicate input listener (updates now handled in the first input handler above)

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
