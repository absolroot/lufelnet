      /* ========== 액션 행 생성 ========== */
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

      // 캐릭터 이름 번역 함수
      function getCharacterDisplayName(charName) {
        const currentLang = getCurrentLanguage();
        if (currentLang === 'kr' || !characterData[charName]) {
          return charName;
        }

        const char = characterData[charName];
        if (currentLang === 'en' && char.name_en) {
          return char.codename;
        } else if (currentLang === 'jp' && char.name_jp) {
          return char.name_jp;
        }
        return charName;
      }

      // 공통 페르소나 데이터 소스 (window.personaFiles 우선)
      function getPersonaStore() {
        const w = (typeof window !== 'undefined') ? window : globalThis;
        if (w.personaFiles && Object.keys(w.personaFiles).length) return w.personaFiles;
        if (typeof personaData !== 'undefined' && personaData) return personaData;
        if (w.persona && w.persona.personaData) return w.persona.personaData;
        return {};
      }
      const personaStore = getPersonaStore();

      // 페르소나 이름 번역 함수
      function getPersonaDisplayName(personaName) {
        const currentLang = getCurrentLanguage();
        const store = personaStore || {};
        if (currentLang === 'kr' || !store[personaName]) {
          return personaName;
        }
        
        const persona = store[personaName];
        if (currentLang === 'en' && persona.name_en) {
          return persona.name_en;
        } else if (currentLang === 'jp' && persona.name_jp) {
          return persona.name_jp;
        }
        return personaName;
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

      // 액션(행동) 이름 번역 함수 (skillList 기반)
      function getActionDisplayName(actionName) {
        const currentLang = getCurrentLanguage();
        if (currentLang === 'kr') {
          return actionName;
        }
        
        // skillList에서 인덱스 찾기
        const index = skillList.indexOf(actionName);
        if (index === -1) {
          return actionName; // 찾지 못하면 원본 반환
        }
        
        // 언어별 배열에서 같은 인덱스의 값 반환
        if (currentLang === 'en' && typeof skillList_en !== 'undefined' && skillList_en[index]) {
          return skillList_en[index];
        } else if (currentLang === 'jp' && typeof skillList_jp !== 'undefined' && skillList_jp[index]) {
          return skillList_jp[index];
        }
        
        return actionName; // 번역이 없으면 원본 반환
      }

      // 고유스킬 이름 번역 함수 (페르소나 데이터에서)
      function getUniqueSkillDisplayName(personaName, skillName) {
        const currentLang = getCurrentLanguage();
        const store = personaStore || {};
        if (currentLang === 'kr' || !store[personaName]) {
          return skillName;
        }
        
        const persona = store[personaName];
        if (persona.uniqueSkill) {
          if (currentLang === 'en' && persona.uniqueSkill.name_en) {
            return persona.uniqueSkill.name_en;
          } else if (currentLang === 'jp' && persona.uniqueSkill.name_jp) {
            return persona.uniqueSkill.name_jp;
          }
        }
        
        return skillName;
      }

      // UI 텍스트 번역 함수
      function getUIText(key) {
        const currentLang = getCurrentLanguage();
        const translations = {
          reference: {
            kr: '참고사항',
            en: 'Reference',
            jp: '参考事項'
          },
          persona: {
            kr: '페르소나',
            en: 'Persona',
            jp: 'ペルソナ'
          },
          details: {
            kr: '세부사항',
            en: 'Details',
            jp: '詳細'
          },
          enterDetails: {
            kr: '세부사항 입력',
            en: 'Enter details',
            jp: '詳細を入力'
          },
          confirm: {
            kr: '확인',
            en: 'Confirm',
            jp: '確認'
          },
          select: {
            kr: '선택',
            en: 'Select',
            jp: '選択'
          }
        };
        
        return translations[key] ? translations[key][currentLang] : key;
      }

      // 메모 텍스트 번역 함수 (스킬 이름인 경우 번역)
      function getTranslatedMemoText(memoText) {
        if (!memoText) return getUIText('details');
        
        // skillList에서 액션인지 확인 (우선순위 높음)
        if (skillList.includes(memoText)) {
          return getActionDisplayName(memoText);
        }
        
        // personaSkillList에서 스킬인지 확인
        if (personaSkillList[memoText]) {
          return getSkillDisplayName(memoText);
        }
        
        // 페르소나별 고유스킬인지 확인
        const store = personaStore || {};
        for (const personaName in store) {
          const persona = store[personaName];
          if (persona.uniqueSkill && persona.uniqueSkill.name === memoText) {
            return getUniqueSkillDisplayName(personaName, memoText);
          }
        }
        
        // 일반 텍스트면 그대로 반환
        return memoText;
      }

      function createActionRow(turnIndex, actionIndex) {
        const action = turns[turnIndex].actions[actionIndex];
        const li = document.createElement("li");
        li.className = "action-item";
        li.setAttribute("data-action-index", actionIndex);
        
        // 캐릭터에 해당하는 배경색 적용
        if (action.character && characterData[action.character]) {
          li.style.backgroundColor = characterData[action.character].color + "30"; // 20은 투명도
        }
        
        // (1) 캐릭터 드롭다운
        const charSelect = document.createElement("select");
        charSelect.className = "action-character";
        
        // 드롭다운 옵션 채우기 - 현재 선택된 파티원들만 표시
        charSelect.innerHTML = `<option value="">${getUIText('reference')}</option>`; // 번역된 참고사항
        const activePartyMembers = partyMembers
          .filter(member => member.name !== "") // 선택된 멤버만 필터링
          .map(member => member.name); // 이름만 추출
        
        activePartyMembers.forEach(char => {
          const opt = document.createElement("option");
          opt.value = char;
          opt.textContent = getCharacterDisplayName(char); // 번역된 캐릭터 이름
          if (action.character === char) opt.selected = true;
          charSelect.appendChild(opt);
        });
        
        charSelect.addEventListener("change", e => {
          action.character = e.target.value;
          action.wonderPersona = ""; // 캐릭터 변경시 페르소나 초기화
          action.action = ""; // 액션 초기화
          renderTurns();
        });
        li.appendChild(charSelect);
        
        // (2) 원더일 경우 페르소나 선택, 아닐 경우 스킬 드롭다운으로 변경
        if (action.character === "원더") {
          const personaSelect = document.createElement("select");
          personaSelect.className = "wonder-persona-select";
          const specialActions = ['HIGHLIGHT','ONE MORE','총격','근접','방어','아이템'];
          const isSpecialSelected = specialActions.includes(action.action);
          // wonderPersonas 슬롯 인덱스를 값으로 사용하여 안정성 확보
          wonderPersonas.forEach((p, idx) => {
            const opt = document.createElement("option");
            opt.value = String(idx);
            opt.textContent = p ? getPersonaDisplayName(p) : `${getUIText('persona')}${idx + 1}`; // 번역된 페르소나 이름
            // 기존 데이터 호환: wonderPersonaIndex 우선, 없으면 이름 비교로 선택 처리
            const isSelectedByIndex = (typeof action.wonderPersonaIndex === 'number') && (action.wonderPersonaIndex === idx);
            const isSelectedByName  = (action.character === '원더' && action.wonderPersona === p);
            // 이미 특수 액션이 선택된 경우, 페르소나 옵션은 선택하지 않음
            if (!isSpecialSelected && (isSelectedByIndex || isSelectedByName)) {
                opt.selected = true;
            }
            personaSelect.appendChild(opt);
          });
          
          // 추가 특수 액션 옵션 (데이터 기준: HIGHLIGHT, ONE MORE, 총격, 근접, 방어, 아이템)
          const sep = document.createElement('option');
          sep.disabled = true; sep.value = '';
          sep.textContent = '──────────';
          personaSelect.appendChild(sep);
          specialActions.forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = getActionDisplayName(key);
            if (action.action === key) opt.selected = true;
            personaSelect.appendChild(opt);
          });
          
          personaSelect.addEventListener("change", e => {
            const val = e.target.value;
            const specialActions = ['HIGHLIGHT','ONE MORE','총격','근접','방어','아이템'];
            // 특수 액션 선택 시: action.action 설정, wonderPersona 초기화
            if (specialActions.includes(val)) {
              action.action = val;
              action.wonderPersona = "";
              action.wonderPersonaIndex = undefined;
              renderTurns();
              return;
            }
            // 페르소나 슬롯 선택 시: index 기반으로 설정
            const personaIndex = parseInt(val, 10);
            const newPersona = wonderPersonas[personaIndex] || "";
            action.wonderPersonaIndex = personaIndex;
            action.wonderPersona = newPersona;
            action.action = "";
    
            if (personaIndex >= 0) {
              // 해당 페르소나의 스킬 입력값 가져오기
              const skillInputs = document.querySelectorAll(
                `.persona-skill-input[data-persona-index="${personaIndex}"]`
              );
              
              // 스킬1이 있으면 스킬1 사용, 없으면 고유스킬 사용
              const skill1Input = skillInputs[1];
              const uniqueSkillInput = skillInputs[0];
              
              // 스킬1이 있으면 스킬1을, 없으면 고유스킬을 메모에 설정
              action.memo = (skill1Input?.value || uniqueSkillInput?.value || "");
              
              // 메모 입력 필드 업데이트
              const memoInput = li.querySelector(".action-memo");
              if (memoInput) memoInput.value = action.memo;
            }
            renderTurns();
          });
          li.appendChild(personaSelect);
          
        } else if (action.character) {
          // 스킬 드롭다운으로 변경
          const skillSelect = document.createElement("select");
          skillSelect.className = "action-skill";
          
          // 기본 옵션 추가
          skillSelect.innerHTML = `<option value="">${getUIText('select')}</option>`; // 번역된 선택
          
          // 스킬 옵션 추가
          skillList.forEach(skill => {
            const option = document.createElement("option");
            option.value = skill;
            option.textContent = getActionDisplayName(skill); // 액션 이름 번역 함수 사용
            if (action.action === skill) option.selected = true;
            skillSelect.appendChild(option);
          });
          
          skillSelect.addEventListener("change", e => {
            action.action = e.target.value;
          });
          
          li.appendChild(skillSelect);
        }
        
        // (3) 메모 입력 필드 추가 - 모달 방식으로 변경
        const memoWrapper = document.createElement("div");
        memoWrapper.className = "memo-wrapper";
        
        // 실제 데이터를 저장할 hidden input
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.value = action.memo || "";
        hiddenInput.className = "hidden-memo-input";
        
        // 표시용 div (클릭 가능)
        const memoDisplay = document.createElement("div");
        memoDisplay.className = "action-memo-display";
        memoDisplay.textContent = getTranslatedMemoText(action.memo); // 번역된 메모 텍스트
        if (!action.memo) {
          memoDisplay.classList.add("placeholder");
        }
        
        // 클릭 시 별도의 입력 모달 표시
        memoDisplay.addEventListener("click", function(e) {
          e.stopPropagation();
          
          // 기존 모달 제거
          const existingModal = document.querySelector(".memo-edit-modal");
          if (existingModal) {
            document.body.removeChild(existingModal);
          }
          
          // 모달 생성
          const modal = document.createElement("div");
          modal.className = "memo-edit-modal";
          
          // 모달 내부 입력 필드
          const modalInput = document.createElement("input");
          modalInput.type = "text";
          modalInput.className = "modal-memo-input";
          // 영어나 일본어 모드에서는 메모 수정 시 내용 초기화
          const currentLang = getCurrentLanguage();
          modalInput.value = currentLang === 'kr' ? hiddenInput.value : '';
          modalInput.placeholder = getUIText('enterDetails'); // 번역된 세부사항 입력
          
          // 확인 버튼
          const confirmBtn = document.createElement("button");
          confirmBtn.className = "modal-confirm-btn";
          confirmBtn.textContent = getUIText('confirm'); // 번역된 확인
          
          // 확인 버튼 클릭 시 값 저장 및 모달 닫기
          confirmBtn.addEventListener("click", function() {
            const newValue = modalInput.value;
            hiddenInput.value = newValue;
            action.memo = newValue;
            memoDisplay.textContent = getTranslatedMemoText(newValue); // 번역된 메모 텍스트
            memoDisplay.classList.toggle("placeholder", !newValue);
            document.body.removeChild(modal);
          });
          
          // 모달에 요소 추가
          modal.appendChild(modalInput);
          modal.appendChild(confirmBtn);
          
          // 모달을 body에 추가
          document.body.appendChild(modal);
          
          // 입력 필드에 포커스
          setTimeout(() => {
            modalInput.focus();
          }, 50);
        });
        
        memoWrapper.appendChild(hiddenInput);
        memoWrapper.appendChild(memoDisplay);
        li.appendChild(memoWrapper);
        
        // 복제 버튼 추가
        const cloneBtn = document.createElement("button");
        cloneBtn.className = "clone-action";
        cloneBtn.innerHTML = ""; // 또는 "복제" 텍스트 사용
        cloneBtn.addEventListener("click", () => {
          const clonedAction = JSON.parse(JSON.stringify(action)); // 깊은 복사
          clonedAction.type = 'manual'; // 복제된 액션은 항상 manual로 설정
          turns[turnIndex].actions.splice(actionIndex + 1, 0, clonedAction);
          renderTurns();
        });
        
        // 삭제 버튼
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-action";
        deleteBtn.textContent = "×";
        deleteBtn.addEventListener("click", () => {
          turns[turnIndex].actions.splice(actionIndex, 1);
          renderTurns();
        });
        
        // 버튼 컨테이너 (복제 + 삭제)
        const btnContainer = document.createElement("div");
        btnContainer.className = "action-buttons";
        btnContainer.appendChild(cloneBtn);
        btnContainer.appendChild(deleteBtn);
        li.appendChild(btnContainer);
        
        return li;
      }
