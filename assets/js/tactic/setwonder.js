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
                    kr: '선택 또는 입력',
                    en: 'Select or type',
                    jp: '選択または入力'
                },
                weapon: {
                    kr: '선택 또는 입력',
                    en: 'Select or type',
                    jp: '選択または入力'
                },
                skill: {
                    kr: '선택 또는 입력',
                    en: 'Select or type',
                    jp: '選択または入力'
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
          // 스크롤 위치 저장
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

          // 원래 값 저장 후 입력 필드 초기화
          this.setAttribute('data-original-value', this.value);
          this.value = '';

          // 번역 표시 제거
          inputContainer.classList.remove('show-translation');

          createWeaponDropdownItems('');
          customDropdown.classList.add("active");

          // 스크롤 위치 복원
          setTimeout(() => {
            window.scrollTo(0, scrollTop);
          }, 0);
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

        weaponInput.addEventListener("input", function() {
          createWeaponDropdownItems(this.value);
          customDropdown.classList.add("active");
        });
        
        // 드롭다운 화살표 클릭 처리
        weaponInput.addEventListener("mousedown", function(e) {
          // 드롭다운 화살표 클릭 감지 (입력 필드의 오른쪽 20px 영역)
          if (e.offsetX > this.offsetWidth - 20) {
            e.preventDefault();
            
            if (customDropdown.classList.contains("active")) {
              customDropdown.classList.remove("active");
            } else {
              createWeaponDropdownItems(this.value);
              customDropdown.classList.add("active");
            }
          }
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
        
        // 업데이트 함수를 디바운스 처리
        const debouncedUpdate = debounce(() => {
          updateAutoActions();
          updatePartyImages();
          renderTurns();
        }, 300);
        
        inputs.forEach((input, idx) => {
          input.placeholder = getPlaceholderText('persona');

          // input을 컨테이너로 감싸기
          const inputContainer = document.createElement("div");
          inputContainer.className = "input-container";
          inputContainer.style.position = "relative";
          
          // 기존 input을 새 컨테이너로 이동
          input.parentNode.insertBefore(inputContainer, input);
          inputContainer.appendChild(input);
          
          // 커스텀 드롭다운 생성
          const customDropdown = document.createElement("div");
          customDropdown.className = "custom-dropdown";
          inputContainer.appendChild(customDropdown);
          
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
              
              item.addEventListener("click", () => {
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
                setTimeout(() => input.blur(), 0);
                
                // change 이벤트 발생 (고유스킬 설정을 위해)
                const event = new Event("change", { bubbles: true });
                input.dispatchEvent(event);
              });
              customDropdown.appendChild(item);
            });
          };
          
          // 페르소나 입력 필드 이벤트 처리
          input.addEventListener("focus", function() {
            // 스크롤 위치 저장
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 원래 값 저장 후 입력 필드 초기화
            this.setAttribute('data-original-value', this.value);
            this.value = '';

            // 번역 표시 제거하여 placeholder가 보이도록 함
            inputContainer.classList.remove('show-translation');

            createPersonaDropdownItems('');
            customDropdown.classList.add("active");
            
            // 스크롤 위치 복원
            setTimeout(() => {
              window.scrollTo(0, scrollTop);
            }, 0);
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

              // change 이벤트를 발생시켜, 복원된 값에 따른 후속 처리가 이루어지도록 함
              const event = new Event("change", { bubbles: true });
              this.dispatchEvent(event);

            }, 200); // 200ms delay to allow click on dropdown items
          });
          
          input.addEventListener("input", function() {
            // 스크롤 위치 저장
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            createPersonaDropdownItems(this.value);
            customDropdown.classList.add("active");
            
            // 스크롤 위치 복원
            setTimeout(() => {
              window.scrollTo(0, scrollTop);
            }, 0);
          });
          
          // 드롭다운 화살표 클릭 처리
          input.addEventListener("mousedown", function(e) {
            if (e.offsetX > this.offsetWidth - 20) {
              e.preventDefault();
              
              if (customDropdown.classList.contains("active")) {
                customDropdown.classList.remove("active");
              } else {
                createPersonaDropdownItems(this.value);
                customDropdown.classList.add("active");
              }
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

          // input 직접 입력 이벤트도 추가
          input.addEventListener("input", (e) => {
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
        });

        // 드롭다운 높이 제한을 위한 스타일 추가
        const styleElement = document.createElement('style');
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
            
            .skill-icon {
                width: 16px;
                height: 16px;
                object-fit: contain;
            }

            .persona-icon {
                width: 24px;
                height: 24px;
                object-fit: contain;
            }
            
            .weapon-icon {
                width: 24px;
                height: 24px;
                object-fit: contain;
            }
            
            /* 번역된 텍스트 표시를 위한 스타일 */
            .input-container {
                position: relative;
            }
            
            /* 번역 모드일 때 원본 텍스트 숨기기 */
            .input-container.show-translation input {
                color: transparent !important;
                text-shadow: none !important;
            }
            
            /* 포커스 시에는 원본 텍스트 보이기 */
            .input-container.show-translation input:focus {
                color: rgba(255, 255, 255, 0.9) !important;
            }
            
            /* 번역된 텍스트 오버레이 */
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
                max-width: calc(100% - 40px);
            }
            
            /* 포커스 시에는 번역 텍스트 숨기기 */
            .input-container.show-translation input:focus + *::before,
            .input-container.show-translation:has(input:focus)::before {
                display: none;
            }
        `;
        document.head.appendChild(styleElement);

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

        // personaSkillList의 모든 스킬 추가
        Object.entries(personaSkillList).forEach(([skillName, skillData]) => {
            skillsWithIcons.push({
                name: skillName,
                icon: skillData.icon || "" // 아이콘 정보가 없을 경우 빈 문자열
            });
        });


        // 페르소나 스킬 입력 필드 설정
        const skillInputs = wonderConfigDiv.querySelectorAll(".persona-skill-input");
        skillInputs.forEach((input) => {
            input.placeholder = getPlaceholderText('skill');

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
                    });
                    customDropdown.appendChild(item);
                });
            };
            
            // 드롭다운 관련 이벤트 처리
            input.addEventListener("focus", function() {
                // 스크롤 위치 저장
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // 원래 값 저장 후 입력 필드 초기화
                this.setAttribute('data-original-value', this.value);
                this.value = '';

                // 번역 표시 제거
                inputContainer.classList.remove('show-translation');

                createDropdownItems('');
                customDropdown.classList.add("active");

                // 스크롤 위치 복원
                setTimeout(() => {
                    window.scrollTo(0, scrollTop);
                }, 0);
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
                        const displayName = getSkillDisplayName(this.value);
                        inputContainer.setAttribute('data-display-text', displayName);
                        inputContainer.classList.add('show-translation');
                    } else {
                        inputContainer.classList.remove('show-translation');
                    }

                    // change 이벤트 발생
                    const event = new Event("change", { bubbles: true });
                    this.dispatchEvent(event);

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
            
            // 입력 이벤트 리스너
            input.addEventListener("change", () => {
                // 현재 스크롤 위치 저장
                const scrollY = window.scrollY;
                
                debouncedUpdate();
                updateActionMemos();
                
                // 스크롤 위치 복원
                setTimeout(() => {
                    window.scrollTo(0, scrollY);
                }, 10);
            });
            
            input.addEventListener("input", () => {
                // 현재 스크롤 위치 저장
                const scrollY = window.scrollY;
                
                debouncedUpdate();
                updateActionMemos();
                
                // 스크롤 위치 복원
                setTimeout(() => {
                    window.scrollTo(0, scrollY);
                }, 10);
            });
        });

        // 액션 메모 자동 업데이트 함수 추가
        function updateActionMemos() {
          turns.forEach(turn => {
            turn.actions.forEach(action => {
              if (action.character === "원더" && action.wonderPersona) {
                // 선택된 페르소나의 인덱스 찾기
                const personaIndex = wonderPersonas.indexOf(action.wonderPersona);
                if (personaIndex !== -1) {
                  // 해당 페르소나의 스킬 입력값 가져오기
                  const skillInputs = document.querySelectorAll(
                    `.persona-skill-input[data-persona-index="${personaIndex}"]`
                  );
                  
                  // 스킬1이 있으면 스킬1 사용, 없으면 고유스킬 사용
                  const skill1 = skillInputs[1]?.value;
                  const uniqueSkill = skillInputs[0]?.value;
                  
                  // 스킬1이 있으면 스킬1을, 없으면 고유스킬을 메모에 설정
                  action.memo = skill1 || uniqueSkill || "";
                }
              }
            });
          });
          //renderTurns();
        }
      }
      
      
