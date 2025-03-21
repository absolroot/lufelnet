      /* ========== 원더 설정 ========== */
      function setupWonderConfig() {
        const wonderConfigDiv = document.getElementById("wonder-config");
        
        // 무기 입력 필드 수정
        const weaponInput = wonderConfigDiv.querySelector(".wonder-weapon-input");
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
          let filteredWeapons = wonderWeapons;
          if (filter) {
            filteredWeapons = wonderWeapons.filter(weapon => 
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
            iconImg.src = `/assets/img/wonder-weapon/${weapon}.webp`;
            iconImg.alt = "";
            iconImg.onerror = function() {
              // 이미지 로드 실패 시 아이콘 제거
              this.style.display = 'none';
            };
            item.appendChild(iconImg);
            
            // 무기 이름 추가
            const nameSpan = document.createElement("span");
            nameSpan.textContent = weapon;
            item.appendChild(nameSpan);
            
            item.addEventListener("click", () => {
              weaponInput.value = weapon;
              customDropdown.classList.remove("active");
              
              // change 이벤트 발생
              const event = new Event("change", { bubbles: true });
              weaponInput.dispatchEvent(event);
            });
            customDropdown.appendChild(item);
          });
        };
        
        // 드롭다운 관련 이벤트 처리
        weaponInput.addEventListener("focus", function() {
          createWeaponDropdownItems(this.value);
          customDropdown.classList.add("active");
          
          // 현재 스크롤 위치 저장
          window.lastScrollY = window.scrollY;
        });
        
        weaponInput.addEventListener("blur", function() {
          // 약간의 지연 후 드롭다운 닫기 (항목 클릭 이벤트가 발생할 시간 확보)
          setTimeout(() => {
            customDropdown.classList.remove("active");
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
          // input을 컨테이너로 감싸기
          const inputContainer = document.createElement("div");
          inputContainer.className = "input-container";
          
          // datalist 생성
          const datalistId = `persona-list-${idx}`;
          input.setAttribute("list", datalistId);
          input.placeholder = "선택 또는 입력";
          
          const datalist = document.createElement("datalist");
          datalist.id = datalistId;
          
          // 페르소나 옵션 추가
          Object.keys(personaData).forEach(persona => {
            const option = document.createElement("option");
            option.value = persona;
            datalist.appendChild(option);
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
          
          // 요소들을 컨테이너에 추가
          input.parentNode.insertBefore(inputContainer, input);
          inputContainer.appendChild(input);
          inputContainer.appendChild(clearBtn);
          inputContainer.parentNode.appendChild(datalist);
          
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
                // 고유 스킬 설정 및 비활성화
                uniqueSkillInput.value = personaData[newPersona].uniqueSkill.name;
                uniqueSkillInput.disabled = true;
                uniqueSkillInput.classList.add('unique-skill');
                
                // 턴 데이터에서 해당 페르소나 업데이트 및 액션 메모 설정
                turns.forEach(turn => {
                    turn.actions.forEach(action => {
                        if (action.character === "원더" && action.wonderPersona === oldPersona) {
                            action.wonderPersona = newPersona;
                            // 스킬1이 있으면 스킬1을, 없으면 고유스킬을 메모에 설정
                            const skill1Input = wonderConfigDiv.querySelector(
                                `.persona-skill-input[data-persona-index="${idx}"][data-skill-slot="1"]`
                            );
                            action.memo = skill1Input?.value || uniqueSkillInput.value || "";
                        }
                    });
                });
            } else {
                // 페르소나가 선택되지 않은 경우 초기화
                uniqueSkillInput.value = '';
                uniqueSkillInput.disabled = false;
                uniqueSkillInput.classList.remove('unique-skill');
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
                // 고유 스킬 설정 및 비활성화
                uniqueSkillInput.value = personaData[newPersona].uniqueSkill.name;
                uniqueSkillInput.disabled = true;
                uniqueSkillInput.classList.add('unique-skill');
                
                // 턴 데이터에서 해당 페르소나 업데이트 및 액션 메모 설정
                turns.forEach(turn => {
                    turn.actions.forEach(action => {
                        if (action.character === "원더" && action.wonderPersona === oldPersona) {
                            action.wonderPersona = newPersona;
                            // 스킬1이 있으면 스킬1을, 없으면 고유스킬을 메모에 설정
                            const skill1Input = wonderConfigDiv.querySelector(
                                `.persona-skill-input[data-persona-index="${idx}"][data-skill-slot="1"]`
                            );
                            action.memo = skill1Input?.value || uniqueSkillInput.value || "";
                        }
                    });
                });
            } else {
                // 페르소나가 선택되지 않은 경우 초기화
                uniqueSkillInput.value = '';
                uniqueSkillInput.disabled = false;
                uniqueSkillInput.classList.remove('unique-skill');
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
        `;
        document.head.appendChild(styleElement);

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
                    filteredSkills = skillsWithIcons.filter(skill => 
                        skill.name.toLowerCase().includes(filter.toLowerCase())
                    );
                }
                
                // 드롭다운 항목 추가 (모든 스킬 표시)
                filteredSkills.forEach(skill => {
                    const item = document.createElement("div");
                    item.className = "dropdown-item";
                    
                    // 아이콘이 있으면 이미지 추가
                    if (skill.icon) {
                        const iconImg = document.createElement("img");
                        iconImg.className = "skill-icon";
                        iconImg.src = `/assets/img/skill-element/${skill.icon}.png`;
                        iconImg.alt = "";
                        iconImg.onerror = function() {
                            // 이미지 로드 실패 시 아이콘 제거
                            this.style.display = 'none';
                        };
                        item.appendChild(iconImg);
                    }
                    
                    // 스킬 이름 추가
                    const nameSpan = document.createElement("span");
                    nameSpan.textContent = skill.name;
                    item.appendChild(nameSpan);
                    
                    item.addEventListener("click", () => {
                        input.value = skill.name;
                        customDropdown.classList.remove("active");
                        
                        // change 이벤트 발생
                        const event = new Event("change", { bubbles: true });
                        input.dispatchEvent(event);
                    });
                    customDropdown.appendChild(item);
                });
            };
            
            // 드롭다운 관련 이벤트 처리
            input.addEventListener("focus", function() {
                createDropdownItems(this.value);
                customDropdown.classList.add("active");
                
                // 현재 스크롤 위치 저장
                window.lastScrollY = window.scrollY;
            });
            
            input.addEventListener("blur", function() {
                // 약간의 지연 후 드롭다운 닫기 (항목 클릭 이벤트가 발생할 시간 확보)
                setTimeout(() => {
                    customDropdown.classList.remove("active");
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

        // 페르소나 입력 필드에도 동일한 커스텀 드롭다운 적용
        inputs.forEach((input, idx) => {
            // datalist 속성 제거 (커스텀 드롭다운 사용)
            input.removeAttribute("list");
            
            // 커스텀 드롭다운 생성
            const customDropdown = document.createElement("div");
            customDropdown.className = "custom-dropdown";
            input.parentNode.appendChild(customDropdown);
            
            // 드롭다운 항목 생성 함수
            const createDropdownItems = (filter = "") => {
                customDropdown.innerHTML = "";
                
                // 페르소나 목록 필터링
                let filteredPersonas = Object.keys(personaData);
                if (filter) {
                    filteredPersonas = filteredPersonas.filter(persona => 
                        persona.toLowerCase().includes(filter.toLowerCase())
                    );
                }
                
                // 드롭다운 항목 추가
                filteredPersonas.forEach(persona => {
                    const item = document.createElement("div");
                    item.className = "dropdown-item";
                    
                    // 페르소나 아이콘 추가
                    const iconImg = document.createElement("img");
                    iconImg.className = "persona-icon";
                    iconImg.src = `/assets/img/persona/${persona}.webp`;
                    iconImg.alt = "";
                    iconImg.onerror = function() {
                        // 이미지 로드 실패 시 아이콘 제거
                        this.style.display = 'none';
                    };
                    item.appendChild(iconImg);
                    
                    // 페르소나 이름 추가
                    const nameSpan = document.createElement("span");
                    nameSpan.textContent = persona;
                    item.appendChild(nameSpan);
                    
                    item.addEventListener("click", () => {
                        input.value = persona;
                        customDropdown.classList.remove("active");
                        
                        // change 이벤트 발생
                        const event = new Event("change", { bubbles: true });
                        input.dispatchEvent(event);
                    });
                    customDropdown.appendChild(item);
                });
            };
            
            // 드롭다운 관련 이벤트 처리
            input.addEventListener("focus", function() {
                createDropdownItems(this.value);
                customDropdown.classList.add("active");
                
                // 현재 스크롤 위치 저장
                window.lastScrollY = window.scrollY;
            });
            
            input.addEventListener("blur", function() {
                // 약간의 지연 후 드롭다운 닫기 (항목 클릭 이벤트가 발생할 시간 확보)
                setTimeout(() => {
                    customDropdown.classList.remove("active");
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
        });
      }
      
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
      
      
