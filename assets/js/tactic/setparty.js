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

        /* 선택된 캐릭터 아이콘 공간을 항상 예약하여 가로크기 변동 방지 (파티 이름 입력칸에만 적용) */
        .input-container.party-name-container input.party-name-input {
            padding-left: 36px;
        }
        .selected-character-icon {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 24px;
            object-fit: cover;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
        }

        /* 번역된 텍스트 표시를 위한 스타일 */
        .input-container {
            position: relative;
        }
        
        .input-container.party-name-container.show-translation input {
            color: transparent !important;
            text-shadow: none !important;
        }
        
        .input-container.party-name-container.show-translation input:focus {
            color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .input-container.party-name-container.show-translation::before {
            content: attr(data-display-text);
            position: absolute;
            /* 아이콘 영역만큼 띄워 텍스트가 겹치지 않도록 함 */
            left: 36px;
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
            /* clear 버튼(우측 40px) + 아이콘 예약 공간(좌측 36px) 고려 */
            max-width: calc(100% - 76px);
        }
        
        .input-container.party-name-container.show-translation:has(input:focus)::before {
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
        // 기존 옵션 초기화 (기존 로직과 동일하게 빈 값 유지)
        mainRevSelect.innerHTML = '<option value="">-</option>';
        
        // 주 계시 옵션 추가 (언어별 A-Z 정렬)
        if (typeof revelationData !== 'undefined' && revelationData.main) {
            const lang = getCurrentLanguage();
            const locale = lang === 'kr' ? 'ko' : (lang === 'jp' ? 'ja' : 'en');
            const mains = Object.keys(revelationData.main).sort((a, b) =>
              getRevelationDisplayName(a).localeCompare(getRevelationDisplayName(b), locale, { sensitivity: 'base' })
            );
            mains.forEach(rev => {
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
            
            // 일월성진 옵션 설정 (언어별 A-Z 정렬, 빈 값 유지)
          subRevSelect.innerHTML = '<option value="">-</option>';
          const lang = getCurrentLanguage();
          const locale = lang === 'kr' ? 'ko' : (lang === 'jp' ? 'ja' : 'en');
          const subs = [...revelationData.main[selectedMain]].sort((a, b) =>
            getRevelationDisplayName(a).localeCompare(getRevelationDisplayName(b), locale, { sensitivity: 'base' })
          );
          subs.forEach(subRev => {
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
        inputContainer.className = "input-container party-name-container";
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
          
          if (!window.__IS_APPLYING_IMPORT) {
            // 해당 캐릭터의 자동 액션 삭제
            turns.forEach(turn => {
              turn.actions = turn.actions.filter(action => 
                action.type === 'manual' || action.character !== oldName
              );
            });
            
            updateAutoActions();
            updatePartyImages();
            renderTurns();
          }
          // 선택 아이콘 제거
          setCharacterIconOnInputWithElement(input, "");
          input.focus();
        });
        
        // 요소들을 컨테이너에 추가
        inputContainer.appendChild(input);
        inputContainer.appendChild(clearBtn);
        inputContainer.appendChild(customDropdown);
        
        // select를 새로운 input container로 교체
        nameSelect.parentNode.replaceChild(inputContainer, nameSelect);
        // 초기 값 기준으로 아이콘 표시
        setCharacterIconOnInputWithElement(input, partyMembers[index].name);
        
        // 선택된 캐릭터 아이콘을 입력창에 표시/제거
        function setCharacterIconOnInputWithElement(inputEl, charName) {
          const container = inputEl.closest('.input-container');
          if (!container) return;
          let img = container.querySelector('.selected-character-icon');
          const valid = charName && typeof characterData !== 'undefined' && characterData[charName];
          if (valid) {
            if (!img) {
              img = document.createElement('img');
              img.className = 'selected-character-icon';
              img.alt = '';
              container.appendChild(img);
            }
            img.src = `${BASE_URL}/assets/img/character-half/${charName}.webp`;
            img.onerror = function() { this.style.display = 'none'; };
            img.onload = function() { this.style.display = ''; };
            container.classList.add('has-char-icon');
          } else {
            if (img) img.remove();
            container.classList.remove('has-char-icon');
          }
        }

        // 드롭다운 항목 생성 함수
        const createDropdownItems = (filter = "") => {
          customDropdown.innerHTML = "";
          
          // 현재 언어에 맞는 캐릭터 목록 사용
          const currentLang = getCurrentLanguage();
          const locale = currentLang === 'kr' ? 'ko' : (currentLang === 'jp' ? 'ja' : 'en');
          // KR 리스트 강제 사용 플래그 (localStorage)
          let forceKR = false;
          try {
              forceKR = localStorage.getItem('forceKRList') === 'true';
          } catch (_) { forceKR = false; }
          let characterOptions = [];
          if (!forceKR && currentLang !== 'kr' && window.languageData && window.languageData[currentLang] && window.languageData[currentLang].characterList) {
              characterOptions = index === 4 
                  ? window.languageData[currentLang].characterList.supportParty 
                  : window.languageData[currentLang].characterList.mainParty;
          } else if (typeof characterList !== 'undefined') { // Fallback or forced to Korean list
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
          // 언어별 표시명 기준 A-Z 정렬
          filteredCharacters = [...filteredCharacters].sort((a, b) =>
            getCharacterDisplayName(a).localeCompare(getCharacterDisplayName(b), locale, { sensitivity: 'base' })
          );
          
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

              // 선택된 캐릭터 아이콘 적용
              setCharacterIconOnInputWithElement(input, char);

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

            // 블러 시 현재 값 기준으로 아이콘 갱신
            setCharacterIconOnInputWithElement(this, this.value);
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

          // 입력 변경 시 아이콘 갱신
          setCharacterIconOnInputWithElement(input, selectedName);
          
          // 임포트 중에는 턴 데이터 변형 스킵
          if (!window.__IS_APPLYING_IMPORT) {
            // 턴 데이터에서 해당 캐릭터 업데이트
            turns.forEach(turn => {
              turn.actions.forEach(action => {
                if (action.character === oldName) {
                  action.character = selectedName || "";
                }
              });
            });
          }
          
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
                
                // 일월성진 옵션 설정 (언어별 A-Z 정렬, 빈 값 유지)
                if (revelationData.main[charData.main_revelation[0]]) {
                  subRevSelect.disabled = false;
                  subRevSelect.innerHTML = '<option value="">-</option>';
                  const lang = getCurrentLanguage();
                  const locale = lang === 'kr' ? 'ko' : (lang === 'jp' ? 'ja' : 'en');
                  const subs = [...revelationData.main[charData.main_revelation[0]]].sort((a, b) =>
                    getRevelationDisplayName(a).localeCompare(getRevelationDisplayName(b), locale, { sensitivity: 'base' })
                  );
                  subs.forEach(subRev => {
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
            
            // 임포트 중에는 자동 패턴 주입 스킵
            if (!window.__IS_APPLYING_IMPORT && ritualPatterns[selectedName]) {
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
              if (!window.__IS_APPLYING_IMPORT) {
                updateAutoActions();
              }
            }
          }
          // 임포트 중에는 렌더/이미지 갱신 스킵 (import.js에서 수행)
          if (!window.__IS_APPLYING_IMPORT) {
            updatePartyImages();
            renderTurns();
          }
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
          
          if (!window.__IS_APPLYING_IMPORT) {
            updateAutoActions();
            updatePartyImages();
            renderTurns();
          }
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
        
        // 임포트 중에는 턴 재정렬과 렌더를 스킵
        if (!window.__IS_APPLYING_IMPORT) {
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
              .filter(pm => pm.name !== "" && pm.index !== 4)  
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
              sortedActions.push(...characterActions);  
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
        }
      });
    }); // end of partyDivs.forEach
  } // end of setupPartySelection

  // 번역 초기화 최상위 함수
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
        for (const option of mainRevSelect.options) {
          if (option.value) {
            option.textContent = getRevelationDisplayName(option.value);
          }
        }
      }
      if (subRevSelect) {
        for (const option of subRevSelect.options) {
          if (option.value) {
            option.textContent = getRevelationDisplayName(option.value);
          }
        }
      }
    });
  }

  // DOMContentLoaded 이후에 번역 초기화 함수를 호출
  document.addEventListener('DOMContentLoaded', () => {
    initializePartyTranslations();
  });