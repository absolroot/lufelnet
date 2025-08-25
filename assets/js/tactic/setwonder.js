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
  clearBtn.type = "button"; // 폼 제출 방지로 스크롤 점프 예방
  clearBtn.className = "clear-input";
  clearBtn.textContent = "×";
  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 변경 없음이면 스킵
    if ((input.value || "") === "" && (wonderPersonas[idx] || "") === "") {
      input.focus();
      return;
    }
    input.value = "";
    wonderPersonas[idx] = "";
    debouncedUpdate();
    // setparty.js와 동일하게 단순 포커스만 유지
    input.focus();
  });
  inputContainer.appendChild(clearBtn);
  
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

    // 드롭다운 항목 생성 함수 (필터 적용)
    const createDropdownItems = (filter = "") => {
      customDropdown.innerHTML = "";

      // 최상단에 '-' 선택 해제 항목 추가
      const noneItem = document.createElement('div');
      noneItem.className = 'dropdown-item';
      const noneLabel = document.createElement('span');
      noneLabel.textContent = '-';
      noneItem.appendChild(noneLabel);
      noneItem.addEventListener('click', () => {
        isSelecting = true;
        input.value = '';
        customDropdown.classList.remove('active');
        input.removeAttribute('data-display-value');
        inputContainer.removeAttribute('data-display-text');
        inputContainer.classList.remove('show-translation');
        setSkillIconOnInput(input, '');
        setTimeout(() => input.blur(), 0);
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
        setTimeout(() => { isSelecting = false; }, 0);
      });
      customDropdown.appendChild(noneItem);

      // 스킬 목록 필터링
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

      // 드롭다운 항목 추가
      filteredSkills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        if (skill.icon) {
          const iconImg = document.createElement('img');
          iconImg.className = 'skill-icon';
          const lang = getCurrentLanguage();
          const iconName = (lang === 'en' || lang === 'jp') ? (skill.icon_gl || skill.icon) : skill.icon;
          iconImg.src = `${BASE_URL}/assets/img/skill-element/${iconName}.png`;
          iconImg.alt = '';
          iconImg.onerror = function() { this.style.display = 'none'; };
          item.appendChild(iconImg);
        }
        const nameSpan = document.createElement('span');
        nameSpan.textContent = getSkillDisplayName(skill.name);
        item.appendChild(nameSpan);
        item.addEventListener('click', () => {
          isSelecting = true;
          input.value = skill.name;
          customDropdown.classList.remove('active');
          const displayName = getSkillDisplayName(skill.name);
          input.setAttribute('data-display-value', displayName);
          if (getCurrentLanguage() !== 'kr') {
            inputContainer.setAttribute('data-display-text', displayName);
            inputContainer.classList.add('show-translation');
          } else {
            inputContainer.classList.remove('show-translation');
          }
          setSkillIconOnInput(input, skill.name);
          setTimeout(() => input.blur(), 0);
          const event = new Event('change', { bubbles: true });
          input.dispatchEvent(event);
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
