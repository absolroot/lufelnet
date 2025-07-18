  /* ========== 파티 선택 ========== */
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

  function getCharacterDisplayName(charName) {
    const currentLang = getCurrentLanguage();
    if (currentLang === 'kr' || !characterData[charName]) {
      return charName;
    }

    const char = characterData[charName];
    if (currentLang === 'en' && char.name_en) {
      return char.name_en;
    } else if (currentLang === 'jp' && char.name_jp) {
      return char.name_jp;
    }
    return charName;
  }

  function getRevelationDisplayName(revName) {
    const currentLang = getCurrentLanguage();
    if (currentLang === 'kr' || !revName) {
        return revName;
    }
    // 데이터 로딩 전일 수 있으므로 revelationData 자체는 확인하지 않음
    
    let mapping;
    const langData = window.languageData ? window.languageData[currentLang] : null;

    if (langData && langData.revelationMapping) {
        mapping = langData.revelationMapping;
    }

    return mapping && mapping[revName] ? mapping[revName] : revName;
  }

  function translateSelectOptions(selectElement) {
    const currentLang = getCurrentLanguage();
    if (currentLang === 'kr') {
        const options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (option.value) {
                option.textContent = option.value;
            }
        }
        return;
    }
    
    const options = selectElement.options;
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option.value) {
            option.textContent = getRevelationDisplayName(option.value);
        }
    }
  }

  function setupPartySelection() {
    const partyDivs = document.querySelectorAll(".party-member");
    
    // 드롭다운 스타일이 아직 추가되지 않았다면 추가
    if (!document.querySelector('style[data-custom-dropdown]')) {
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-custom-dropdown', 'true');
      styleElement.textContent = `
        /* 커스텀 드롭다운 스타일 */
        .custom-dropdown {
            display: none;
            position: absolute;
            max-height: 300px; /* 약 20개 항목 표시 가능한 높이 */
            overflow-y: auto;
            background: #3d3030;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            z-index: 1000;
            width: 100%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            left: 0;
            top: 100%;
        }
        
        .custom-dropdown.active {
            display: block;
        }
        
        .dropdown-item {
            padding: 8px 12px;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .dropdown-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .character-icon {
            width: 24px;
            height: 24px;
            object-fit: cover;
            border-radius: 50%;
        }

        /* 번역된 텍스트 표시를 위한 스타일 */
        .input-container {
            position: relative;
        }
        
        .input-container.show-translation input {
            color: transparent !important;
            text-shadow: none !important;
        }
        
        .input-container.show-translation input:focus {
            color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .input-container.show-translation::before {
            content: attr(data-display-text);
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.9);
            pointer-events: none;
            z-index: 1;
            font-size: 12px;
            font-family: inherit;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: calc(100% - 40px); /* clear 버튼 고려 */
        }
        
        .input-container.show-translation:has(input:focus)::before {
            display: none;
        }
      `;
      document.head.appendChild(styleElement);
    }
    
    partyDivs.forEach(div => {
      const index = parseInt(div.getAttribute("data-index"), 10);
      const nameSelect = div.querySelector(".party-name");
      const mainRevSelect = div.querySelector(".main-revelation");
      const subRevSelect = div.querySelector(".sub-revelation");
      const orderSelect = div.querySelector(".party-order");
      const ritualSelect = div.querySelector(".party-ritual");
      
      // 초기 원더 설정에 대한 비활성화 처리
      if (partyMembers[index].name === "원더") {
        ritualSelect.disabled = true;
        ritualSelect.value = "0";
        mainRevSelect.disabled = true;
        mainRevSelect.value = "";
        subRevSelect.disabled = true;
        subRevSelect.value = "";
        
        partyMembers[index].ritual = "0";
      }
      
      // 주 계시 옵션 설정
      if (mainRevSelect) {
        // 기존 옵션 초기화
        mainRevSelect.innerHTML = '<option value="">-</option>';
        
        // 주 계시 옵션 추가 (한국어 기준)
        if (typeof revelationData !== 'undefined' && revelationData.main) {
            Object.keys(revelationData.main).forEach(rev => {
                const opt = document.createElement("option");
                opt.value = rev;
                opt.textContent = getRevelationDisplayName(rev); // 생성 시 바로 번역
                mainRevSelect.appendChild(opt);
            });
        }
        
        // 주 계시 변경 이벤트
        mainRevSelect.addEventListener("change", (e) => {
          const selectedMain = e.target.value;
          
          // 일월성진 드롭다운 활성화/비활성화
          if (selectedMain && revelationData && revelationData.main[selectedMain]) {
            subRevSelect.disabled = false;
            
            // 일월성진 옵션 설정
            subRevSelect.innerHTML = '<option value="">-</option>';
            revelationData.main[selectedMain].forEach(subRev => {
              const opt = document.createElement("option");
              opt.value = subRev;
              opt.textContent = getRevelationDisplayName(subRev); // 생성 시 바로 번역
              subRevSelect.appendChild(opt);
            });
          } else {
            subRevSelect.disabled = true;
            subRevSelect.innerHTML = '<option value="">-</option>';
          }
          
          // 파티 이미지 업데이트 추가
          updatePartyImages();
        });
        //일월성진 변경 시 
        subRevSelect.addEventListener("change", (e) => {
          // 파티 이미지 업데이트 추가
          updatePartyImages();
        });
      }

      if (nameSelect) {
        // input container 생성
        const inputContainer = document.createElement("div");
        inputContainer.className = "input-container";
        inputContainer.style.position = "relative";
        
        // input 요소 생성
        const input = document.createElement("input");
        input.className = "party-name-input";
        input.value = partyMembers[index].name;
        input.placeholder = "";
        input.setAttribute("autocomplete", "off");
        
        // 커스텀 드롭다운 생성
        const customDropdown = document.createElement("div");
        customDropdown.className = "custom-dropdown";
        
        // clear 버튼 생성
        const clearBtn = document.createElement("button");
        clearBtn.className = "clear-input";
        clearBtn.textContent = "×";
        clearBtn.addEventListener("click", () => {
          input.value = "";
          const oldName = partyMembers[index].name;
          partyMembers[index].name = "";
          
          // 해당 캐릭터의 자동 액션 삭제
          turns.forEach(turn => {
            turn.actions = turn.actions.filter(action => 
              action.type === 'manual' || action.character !== oldName
            );
          });
          
          updateAutoActions();
          updatePartyImages();
          renderTurns();
          input.focus();
        });
        
        // 요소들을 컨테이너에 추가
        inputContainer.appendChild(input);
        inputContainer.appendChild(clearBtn);
        inputContainer.appendChild(customDropdown);
        
        // select를 새로운 input container로 교체
        nameSelect.parentNode.replaceChild(inputContainer, nameSelect);
        
        // 드롭다운 항목 생성 함수
        const createDropdownItems = (filter = "") => {
          customDropdown.innerHTML = "";
          
          // 현재 언어에 맞는 캐릭터 목록 사용
          const currentLang = getCurrentLanguage();
          let characterOptions = [];
          if (currentLang !== 'kr' && window.languageData && window.languageData[currentLang] && window.languageData[currentLang].characterList) {
              characterOptions = index === 4 
                  ? window.languageData[currentLang].characterList.supportParty 
                  : window.languageData[currentLang].characterList.mainParty;
          } else if (typeof characterList !== 'undefined') { // Fallback to Korean list (window.characterList -> characterList)
              characterOptions = index === 4 ? characterList.supportParty : characterList.mainParty;
          }
          
          // 캐릭터 목록 필터링 (필터가 있을 경우만 필터링)
          let filteredCharacters = characterOptions;
          if (filter) {
            const lowerCaseFilter = filter.toLowerCase();
            filteredCharacters = characterOptions.filter(char => {
              const displayName = getCharacterDisplayName(char);
              return char.toLowerCase().includes(lowerCaseFilter) ||
                     displayName.toLowerCase().includes(lowerCaseFilter);
            });
          }
          
          // 드롭다운 항목 추가
          filteredCharacters.forEach(char => {
            const item = document.createElement("div");
            item.className = "dropdown-item";
            
            // 캐릭터 아이콘 추가
            const iconImg = document.createElement("img");
            iconImg.className = "character-icon";
            iconImg.src = `${BASE_URL}/assets/img/character-half/${char}.webp`;
            iconImg.alt = "";
            iconImg.onerror = function() {
              // 이미지 로드 실패 시 아이콘 제거
              this.style.display = 'none';
            };
            item.appendChild(iconImg);
            
            // 캐릭터 이름 추가 (번역된 이름으로 표시)
            const nameSpan = document.createElement("span");
            nameSpan.textContent = getCharacterDisplayName(char);
            item.appendChild(nameSpan);
            
            item.addEventListener("click", () => {
              // 실제 값은 한국어로 설정
              input.value = char;
              customDropdown.classList.remove("active");

              // 번역 표시 적용
              if (getCurrentLanguage() !== 'kr') {
                  const displayName = getCharacterDisplayName(char);
                  inputContainer.setAttribute('data-display-text', displayName);
                  inputContainer.classList.add('show-translation');
              } else {
                  inputContainer.classList.remove('show-translation');
              }

              // 포커스 즉시 해제하여 번역된 값이 보이도록 함
              setTimeout(() => input.blur(), 0);
              
              // change 이벤트 발생
              const event = new Event("change", { bubbles: true });
              input.dispatchEvent(event);
            });
            customDropdown.appendChild(item);
          });
        };
        
        // 드롭다운 관련 이벤트 처리
        input.addEventListener("focus", function() {
          // 원래 값 저장 후 입력 필드 초기화 (편집 용이성)
          this.setAttribute('data-original-value', this.value);
          this.value = '';

          // 번역 표시 제거
          inputContainer.classList.remove('show-translation');
          
          createDropdownItems('');
          customDropdown.classList.add("active");
          
          // 현재 스크롤 위치 저장
          window.lastScrollY = window.scrollY;
        });
        
        input.addEventListener("blur", function() {
          // 약간의 지연 후 드롭다운 닫기 (항목 클릭 이벤트가 발생할 시간 확보)
          setTimeout(() => {
            customDropdown.classList.remove("active");

            // 새로운 값이 선택되지 않았으면 원래 값으로 복원
            if (this.value.trim() === '') {
                this.value = this.getAttribute('data-original-value') || '';
            }
            
            // 값에 따른 번역 표시 적용
            if (this.value && getCurrentLanguage() !== 'kr') {
                const displayName = getCharacterDisplayName(this.value);
                inputContainer.setAttribute('data-display-text', displayName);
                inputContainer.classList.add('show-translation');
            } else {
                inputContainer.classList.remove('show-translation');
            }
          }, 200);
        });
        
        input.addEventListener("input", function() {
          createDropdownItems(this.value);
          customDropdown.classList.add("active");
        });
        
        // 드롭다운 화살표 클릭 처리
        input.addEventListener("mousedown", function(e) {
          // 드롭다운 화살표 클릭 감지 (입력 필드의 오른쪽 20px 영역)
          if (e.offsetX > this.offsetWidth - 20) {
            e.preventDefault();
            
            if (customDropdown.classList.contains("active")) {
              customDropdown.classList.remove("active");
            } else {
              createDropdownItems(this.value);
              customDropdown.classList.add("active");
            }
          }
        });
        
        // input 이벤트 리스너 수정
        input.addEventListener("change", (e) => {
          const oldName = partyMembers[index].name;
          const selectedName = e.target.value;
          const currentRitual = ritualSelect.value;
          partyMembers[index].name = selectedName;
          
          // 턴 데이터에서 해당 캐릭터 업데이트
          turns.forEach(turn => {
            turn.actions.forEach(action => {
              if (action.character === oldName) {
                action.character = selectedName || "";
              }
            });
          });
          
          // 원더일 경우 의식과 주 계시 비활성화
          if (selectedName === "원더") {
            ritualSelect.disabled = true;
            ritualSelect.value = "0";
            mainRevSelect.disabled = true;
            mainRevSelect.value = "";
            subRevSelect.disabled = true;
            subRevSelect.value = "";
            
            partyMembers[index].ritual = "0";
          } else {
            ritualSelect.disabled = false;
            mainRevSelect.disabled = false;
            
            // 캐릭터의 기본 계시 값 설정
            if (characterData[selectedName] && typeof revelationData !== 'undefined') {
              const charData = characterData[selectedName];
              
              // 주 계시 설정
              if (charData.main_revelation) {
                mainRevSelect.value = charData.main_revelation[0];
                
                // 일월성진 옵션 설정
                if (revelationData.main[charData.main_revelation[0]]) {
                  subRevSelect.disabled = false;
                  subRevSelect.innerHTML = '<option value="">-</option>';
                  revelationData.main[charData.main_revelation[0]].forEach(subRev => {
                    const opt = document.createElement("option");
                    opt.value = subRev;
                    opt.textContent = getRevelationDisplayName(subRev); // 생성 시 바로 번역
                    subRevSelect.appendChild(opt);
                  });
                  
                  // 일월성진 값 설정
                  if (charData.sub_revelation) {
                    subRevSelect.value = charData.sub_revelation[0];
                  }
                }
              }
            }
            
            // 새로 선택된 캐릭터의 의식 패턴이 있는지 확인
            if (ritualPatterns[selectedName]) {
              const pattern = findPatternForLevel(selectedName, currentRitual);
              if (pattern) {
                turns.forEach((turn, turnIndex) => {
                    // 해당 캐릭터의 기존 자동 액션 제거
                    turn.actions = turn.actions.filter(action => 
                      !(action.type === 'auto' && action.character === selectedName)
                    );
                    
                    // 해당 턴의 패턴이 있고 빈 배열이 아닌 경우에만 액션 추가
                    if (pattern[turnIndex] && pattern[turnIndex].length > 0) {
                      pattern[turnIndex].forEach(actionData => {
                        if (actionData.order === 0) {
                          turn.actions.unshift({
                            type: 'auto',
                            character: selectedName,
                            action: actionData.type,
                            wonderPersona: "",
                            memo: ""
                          });
                        } else {
                          turn.actions.push({
                            type: 'auto',
                            character: selectedName,
                            action: actionData.type,
                            wonderPersona: "",
                            memo: ""
                          });
                        }
                    });
                  }
                });
              }
            }
            else{
              updateAutoActions();
            }
          }
          //updateAutoActions();
          updatePartyImages();
          renderTurns();
        });

        // input 직접 입력 이벤트도 추가
        input.addEventListener("input", (e) => {
          const selectedName = e.target.value;
          const currentRitual = ritualSelect.value;
          partyMembers[index].name = selectedName;
          
          // 원더일 경우 의식과 계시 비활성화
          if (selectedName === "원더") {
            ritualSelect.disabled = true;
            ritualSelect.value = "0";
            mainRevSelect.disabled = true;
            mainRevSelect.value = "";
            subRevSelect.disabled = true;
            subRevSelect.value = "";
            
            partyMembers[index].ritual = "0";
          } else {
            ritualSelect.disabled = false;
            mainRevSelect.disabled = false;
            
            // 새로 선택된 캐릭터의 의식 패턴이 있는지 확인
            if (ritualPatterns[selectedName]) {
              const pattern = findPatternForLevel(selectedName, currentRitual);
              if (pattern) {
                turns.forEach((turn, turnIndex) => {
                    // 해당 캐릭터의 기존 자동 액션 제거
                    turn.actions = turn.actions.filter(action => 
                      !(action.type === 'auto' && action.character === selectedName)
                    );
                    
                    // 해당 턴의 패턴이 있고 빈 배열이 아닌 경우에만 액션 추가
                    if (pattern[turnIndex] && pattern[turnIndex].length > 0) {
                      pattern[turnIndex].forEach(actionData => {
                        if (actionData.order === 0) {
                          turn.actions.unshift({
                            type: 'auto',
                            character: selectedName,
                            action: actionData.type,
                            wonderPersona: "",
                            memo: ""
                          });
                        } else {
                          turn.actions.push({
                            type: 'auto',
                            character: selectedName,
                            action: actionData.type,
                            wonderPersona: "",
                            memo: ""
                          });
                        }
                    });
                  }
                });
              }
            }
          }
          
          updateAutoActions();
          updatePartyImages();
          renderTurns();
        });
      }

      // 순서 변경 시 이벤트
      orderSelect.addEventListener("change", (e) => {
        const newOrder = e.target.value;
        const oldOrder = partyMembers[index].order;
        
        // 다른 멤버의 순서 조정
        if (newOrder !== "-") {
          const swappedMember = partyMembers.find(pm => pm.index !== index && pm.order === newOrder);
          if (swappedMember) {
            swappedMember.order = oldOrder;
            const otherSelect = document.querySelector(
              `.party-member[data-index="${swappedMember.index}"] .party-order`
            );
            if (otherSelect) otherSelect.value = oldOrder;
          }
        }
        
        partyMembers[index].order = newOrder;
        
        // 턴 데이터의 순서 업데이트
        turns.forEach(turn => {
          // 1. 순서 변경이 불가한 액션들 분리
          const fixedActions = turn.actions.filter(action => 
            action.action === 'HIGHLIGHT' || 
            action.action === 'ONE MORE' ||
            partyMembers.find(pm => pm.name === action.character)?.index === 4
          );
          
          // 2. 순서 변경이 가능한 액션들 분리
          const sortableActions = turn.actions.filter(action => 
            !fixedActions.includes(action)
          );
          
          // 3. 파티 순서대로 정렬
          const sortedParty = partyMembers
            .filter(pm => pm.name !== "" && pm.index !== 4)  // 해명 괴도 제외
            .sort((a, b) => {
              if (a.order === "-") return 1;
              if (b.order === "-") return -1;
              return parseInt(a.order, 10) - parseInt(b.order, 10);
            });
          
          // 4. 순서 변경이 가능한 액션들을 파티 순서대로 재정렬
          const sortedActions = [];
          sortedParty.forEach(member => {
            // 해당 캐릭터의 모든 액션을 순서대로 가져옴
            const characterActions = sortableActions.filter(a => a.character === member.name);
            sortedActions.push(...characterActions);  // 연속된 행동 순서 유지
          });
          
          // 5. 최종 액션 배열 구성
          // 고정 액션들은 원래 위치 유지, 정렬된 액션들 추가
          const finalActions = [];
          turn.actions.forEach(action => {
            if (fixedActions.includes(action)) {
              finalActions.push(action);
            }
          });
          finalActions.push(...sortedActions);
          
          turn.actions = finalActions;
        });
        
        updatePartyImages();
        renderTurns();
      });

      // 의식 변경 이벤트 리스너 수정
      ritualSelect.addEventListener("change", (e) => {
        const newRitual = e.target.value;
        const characterName = partyMembers[index].name;
        partyMembers[index].ritual = newRitual;
        
        if (ritualPatterns[characterName]) {
          const pattern = findPatternForLevel(characterName, newRitual);
          if (pattern) {
            turns.forEach((turn, turnIndex) => {
              // 해당 캐릭터의 기존 자동 액션 제거
              turn.actions = turn.actions.filter(action => 
                !(action.type === 'auto' && action.character === characterName)
              );
              
              // 해당 턴의 패턴이 있고 빈 배열이 아닌 경우에만 액션 추가
              if (pattern[turnIndex] && pattern[turnIndex].length > 0) {
                pattern[turnIndex].forEach(actionData => {
                  if (actionData.order === 0) {
                    turn.actions.unshift({
                      type: 'auto',
                      character: characterName,
                      action: actionData.type,
                      wonderPersona: "",
                      memo: ""
                    });
                  } else {
                    turn.actions.push({
                      type: 'auto',
                      character: characterName,
                      action: actionData.type,
                      wonderPersona: "",
                      memo: ""
                    });
                  }
                });
              }
            });
            
            renderTurns();
          }
        }
        
        updatePartyImages();
      });
    });
  }
  
  // Helper to fetch a JS object literal from a script file using regex
  async function fetchObjectFromScript(src, objectName) {
      try {
          const text = await fetch(src).then(res => {
              if (!res.ok) {
                  if (res.status === 404) return null;
                  throw new Error(`Failed to fetch script: ${res.statusText}`);
              }
              return res.text();
          });

          if (!text) return null;

          // Regex to find "const objectName = { ... };"
          const regex = new RegExp(`const ${objectName} = (\\{[\\s\\S]*?\\});`);
          const match = text.match(regex);

          if (match && match[1]) {
              // Safely parse the matched object string
              return new Function(`return ${match[1]}`)();
          }
          return null;
      } catch (error) {
          console.error(`Error loading object "${objectName}" from ${src}:`, error);
          return null;
      }
  }

  // 페이지 로드 시 필요한 데이터와 번역을 설정하는 함수
  async function setupTranslations() {
      const lang = getCurrentLanguage();

      if (typeof characterData === 'undefined' || typeof revelationData === 'undefined') {
          console.warn("Base Korean data not found. Retrying...");
          setTimeout(setupTranslations, 200);
          return;
      }

      if (lang !== 'kr') {
          // 언어별 캐릭터 리스트 가져오기
          const charList = await fetchObjectFromScript(`${BASE_URL}/data/${lang}/characters/characters.js`, 'characterList');
          if (charList) {
              if (!window.languageData) window.languageData = {};
              window.languageData[lang] = { characterList: charList };
          }

          // 언어별 계시 매핑 가져오기
          const mapping = await fetchObjectFromScript(`${BASE_URL}/data/${lang}/revelations/revelations.js`, `mapping_${lang}`);
          if (mapping) {
              if (!window.languageData[lang]) window.languageData[lang] = {};
              window.languageData[lang].revelationMapping = mapping;
          }
      }

      // 모든 데이터 준비 후 UI 번역 적용 및 UI 재생성
      setupPartySelection();
      initializePartyTranslations();
  }

  // 현재 언어 감지 함수
  function initializePartyTranslations() {
      const currentLang = getCurrentLanguage();
      
      // 한국어 모드일 경우, 번역 표시 제거 및 원본 값으로 복원
      if (currentLang === 'kr') {
        document.querySelectorAll('.input-container.show-translation').forEach(container => {
            container.classList.remove('show-translation');
        });
        document.querySelectorAll('select.main-revelation, select.sub-revelation').forEach(select => {
            // 옵션 텍스트를 다시 한국어로
            for (const option of select.options) {
                if (option.value) {
                    option.textContent = option.value;
                }
            }
        });
        return;
      }

      document.querySelectorAll(".party-member").forEach(div => {
          const index = parseInt(div.getAttribute("data-index"), 10);
          
          // 캐릭터 이름 번역
          const nameInput = div.querySelector(".party-name-input");
          if (nameInput && nameInput.value) {
              const displayName = getCharacterDisplayName(nameInput.value);
              const inputContainer = nameInput.closest('.input-container');
              if (inputContainer) {
                  inputContainer.setAttribute('data-display-text', displayName);
                  inputContainer.classList.add('show-translation');
              }
          }

          // 계시 번역
          const mainRevSelect = div.querySelector(".main-revelation");
          const subRevSelect = div.querySelector(".sub-revelation");
          if (mainRevSelect) {
            // 주 계시 옵션의 텍스트만 번역
            for (const option of mainRevSelect.options) {
                if(option.value) {
                    option.textContent = getRevelationDisplayName(option.value);
                }
            }
          }
          if (subRevSelect) {
            // 하위 계시 옵션의 텍스트만 번역
            for (const option of subRevSelect.options) {
                if(option.value) {
                    option.textContent = getRevelationDisplayName(option.value);
                }
            }
          }
      });
  }

  // DOMContentLoaded 이후에 번역 초기화 함수를 호출
  document.addEventListener('DOMContentLoaded', () => {
      // 데이터 로드 및 번역 적용 시작
      setupTranslations();
  });
  