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

  // 번역 데이터(계시 맵) 보장 로더
  // - window.languageData[currentLang].revelationMapping 을 채워 드롭다운 생성 전에 번역 가능하게 함
  // - 여러 번 호출되어도 1회만 네트워크 로드
  let __translationsLoadingPromise = null;
  async function setupTranslations() {
    try {
      const lang = getCurrentLanguage();
      if (lang === 'kr') return; // 한국어는 원본 사용

      // languageData 구조 준비
      if (!window.languageData) window.languageData = {};
      if (!window.languageData[lang]) window.languageData[lang] = {};

      // 이미 필요한 데이터가 준비됐다면 종료
      if (window.languageData[lang].revelationMapping && window.languageData[lang].characterList) return;

      // 동시 호출 방지
      if (__translationsLoadingPromise) {
        return await __translationsLoadingPromise;
      }

      __translationsLoadingPromise = (async () => {
        const base = (typeof BASE_URL !== 'undefined' && BASE_URL) ? BASE_URL : '';
        const ver = (typeof APP_VERSION !== 'undefined' && APP_VERSION) ? `?v=${APP_VERSION}` : '';

        // 1) 계시(revelations) 매핑 로드
        try {
          const revUrl = `${base}/data/${lang}/revelations/revelations.js${ver}`;
          const revRes = await fetch(revUrl);
          if (!revRes.ok) throw new Error(`Failed to load revelations for ${lang}`);
          const revTxt = await revRes.text();

          // en/jp 각각 전역 공개로 변경 후 실행
          let patchedRev = revTxt;
          if (lang === 'en') {
            patchedRev = patchedRev.replace('const enRevelationData', 'window.enRevelationData');
          } else if (lang === 'jp') {
            patchedRev = patchedRev.replace('const jpRevelationData', 'window.jpRevelationData');
          }
          // eslint-disable-next-line no-eval
          eval(patchedRev);

          // 매핑 추출 및 주입
          let revMap = null;
          if (lang === 'en' && window.enRevelationData) {
            revMap = window.enRevelationData.mapping_en || null;
          } else if (lang === 'jp' && window.jpRevelationData) {
            revMap = window.jpRevelationData.mapping_jp || null;
          }
          if (revMap) {
            window.languageData[lang].revelationMapping = revMap;
          }
        } catch (_) { /* 실패해도 계속 진행 */ }

        // 2) 언어별 캐릭터 목록 로드 (dropdown용)
        try {
          if (!window.languageData[lang].characterList) {
            const chUrl = `${base}/data/${lang}/characters/characters.js${ver}`;
            const chRes = await fetch(chUrl);
            if (!chRes.ok) throw new Error(`Failed to load characters for ${lang}`);
            let chTxt = await chRes.text();

            // 전역 오염/충돌 방지를 위해 임시 전역으로 바꿔서 주입
            chTxt = chTxt.replace(/const\s+characterList\s*=\s*/g, 'window.__tmpCharacterList = ');
            // characterData는 글로벌(KR) 데이터 사용을 유지하므로 별도 병합/치환 없이 무시 가능
            // 단, 일부 언어 파일이 const characterData 를 정의하므로 충돌 방지용으로 임시 주입
            chTxt = chTxt.replace(/const\s+characterData\s*=\s*/g, 'window.__tmpCharacterData = ');

            // eslint-disable-next-line no-eval
            eval(chTxt);
            if (window.__tmpCharacterList) {
              window.languageData[lang].characterList = window.__tmpCharacterList;
            }
            // cleanup
            try { delete window.__tmpCharacterList; } catch(_) {}
            try { delete window.__tmpCharacterData; } catch(_) {}
          }
        } catch (_) { /* 실패해도 기능은 KR 폴백으로 동작 */ }
      })();

      await __translationsLoadingPromise;
    } catch (_) {
      // 실패해도 기능은 KR 폴백으로 동작
    }
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
            /* 아이콘 예약 공간(좌측 36px)만 고려 */
            max-width: calc(100% - 36px);
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
        // 원더가 초기 기본값인 경우에도 자동 액션을 기본 추가 (임포트 중에는 스킵)
        if (!window.__IS_APPLYING_IMPORT && typeof turns !== 'undefined' && Array.isArray(turns)) {
          turns.forEach(turn => {
            // 기존 원더 자동 액션 제거
            turn.actions = (turn.actions || []).filter(a => !(a.type === 'auto' && a.character === '원더'));
            // 기본 빈 자동 액션 추가
            turn.actions.push({
              type: 'auto',
              character: '원더',
              action: '',
              wonderPersona: '',
              memo: ''
            });
          });
          if (typeof updateAutoActions === 'function') updateAutoActions();
          if (typeof updatePartyImages === 'function') updatePartyImages();
          if (typeof renderTurns === 'function') renderTurns();
        }
      }

      // 의식(ritual) 변경 시 상태 반영 및 자동 패턴/UI 갱신
      if (ritualSelect) {
        ritualSelect.addEventListener("change", (e) => {
          const newLevel = e.target.value;
          partyMembers[index].ritual = newLevel;
          const selectedName = partyMembers[index].name;

          // 원더는 의식 고정 0
          if (selectedName === "원더") {
            partyMembers[index].ritual = "0";
            return;
          }

          if (!window.__IS_APPLYING_IMPORT) {
            // 캐릭터 의식 패턴 재적용
            const hasPattern = typeof ritualPatterns !== 'undefined' && ritualPatterns[selectedName];
            const pattern = hasPattern && (typeof findPatternForLevel === 'function') ? findPatternForLevel(selectedName, newLevel) : null;
            turns.forEach((turn, turnIndex) => {
              // 기존 자동 액션 제거
              turn.actions = turn.actions.filter(action => !(action.type === 'auto' && action.character === selectedName));
              // 새 패턴 삽입 또는 기본 빈 액션 삽입
              if (pattern && pattern[turnIndex] && pattern[turnIndex].length > 0) {
                pattern[turnIndex].forEach(actionData => {
                  const newAction = {
                    type: 'auto',
                    character: selectedName,
                    action: actionData.type,
                    wonderPersona: "",
                    memo: ""
                  };
                  if (actionData.order === 0) {
                    turn.actions.unshift(newAction);
                  } else {
                    turn.actions.push(newAction);
                  }
                });
              } else {
                // 드롭다운의 기본값 노출을 위한 빈 자동 액션
                turn.actions.push({
                  type: 'auto',
                  character: selectedName,
                  action: "",
                  wonderPersona: "",
                  memo: ""
                });
              }
            });

            // 자동 액션 정합성 보정 및 UI 갱신
            if (typeof updateAutoActions === 'function') updateAutoActions();
            if (typeof updatePartyImages === 'function') updatePartyImages();
            if (typeof renderTurns === 'function') renderTurns();
          }
        });
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

        // 포탈 연결: 주/일월성진 select를 포탈로 대체(네이티브 select 방지)
        const openMainRevPortal = (evt) => {
          try { if (evt) { evt.preventDefault(); evt.stopPropagation(); if (evt.stopImmediatePropagation) evt.stopImmediatePropagation(); } } catch(_){ }
          // WONDER(원더)거나 비활성화 상태면 열지 않음
          try {
            if (partyMembers[index]?.name === '원더' || mainRevSelect.disabled) return;
          } catch(_){ }
          try { mainRevSelect.blur(); } catch(_){ }
          if (typeof openPortal === 'function') {
            openPortal('rev-main', mainRevSelect, {
              onSelect: (value /* KR */, display) => {
                mainRevSelect.value = value;
                const ev = new Event('change', { bubbles: true });
                mainRevSelect.dispatchEvent(ev);
              }
            });
          }
        };
        const openSubRevPortal = (evt) => {
          try { if (evt) { evt.preventDefault(); evt.stopPropagation(); if (evt.stopImmediatePropagation) evt.stopImmediatePropagation(); } } catch(_){ }
          // WONDER(원더)거나 비활성화 상태면 열지 않음
          try {
            if (partyMembers[index]?.name === '원더' || subRevSelect.disabled) return;
          } catch(_){ }
          try { subRevSelect.blur(); } catch(_){ }
          if (typeof openPortal === 'function') {
            openPortal('rev-sub', subRevSelect, {
              mainForSub: mainRevSelect.value,
              onSelect: (value /* KR */, display) => {
                subRevSelect.value = value;
                const ev = new Event('change', { bubbles: true });
                subRevSelect.dispatchEvent(ev);
              }
            });
          }
        };

        // 다양한 입력에 대응: mousedown/click/keydown
        ['pointerdown','mousedown','click','touchstart'].forEach(ev => {
          mainRevSelect.addEventListener(ev, openMainRevPortal);
          subRevSelect.addEventListener(ev, openSubRevPortal);
        });
        // 네이티브 select 열림을 확실히 차단하기 위해 capture 단계에서도 차단
        mainRevSelect.addEventListener('pointerdown', (e)=>openMainRevPortal(e), { capture: true });
        subRevSelect.addEventListener('pointerdown', (e)=>openSubRevPortal(e), { capture: true });
        mainRevSelect.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            openMainRevPortal(e);
          }
        });
        subRevSelect.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            openSubRevPortal(e);
          }
        });

        // disabled인 sub select는 이벤트가 막히므로 부모 컨테이너에도 핸들러 부착
        const mainGroup = mainRevSelect.closest('.input-group') || mainRevSelect.parentElement;
        const subGroup = subRevSelect.closest('.input-group') || subRevSelect.parentElement;
        if (mainGroup) {
          ['pointerdown','mousedown','click','touchstart'].forEach(ev => mainGroup.addEventListener(ev, (e) => {
            // select 외 영역 클릭도 포탈 오픈 (레이블/컨테이너)
            if (e.target !== mainRevSelect) {
              openMainRevPortal(e);
            }
          }));
        }
        if (subGroup) {
          ['pointerdown','mousedown','click','touchstart'].forEach(ev => subGroup.addEventListener(ev, (e) => {
            if (e.target !== subRevSelect) {
              openSubRevPortal(e);
            }
          }));
        }
      }

      if (nameSelect) {
        // input container 생성
        const inputContainer = document.createElement("div");
        inputContainer.className = "input-container party-name-container";
        inputContainer.style.position = "relative";
        inputContainer.setAttribute('tabindex', '0');
        
        // input 요소 생성
        const input = document.createElement("input");
        input.classList.add('party-name-input');
        input.className = "party-name-input";
        input.value = partyMembers[index].name;
        input.placeholder = "";
        input.setAttribute("autocomplete", "off");
        
        // (로컬 드롭다운 제거: 전역 포탈 사용)
        
        // 요소들을 컨테이너에 추가
        inputContainer.appendChild(input);
        // customDropdown 제거
        
        // select를 새로운 input container로 교체
        nameSelect.parentNode.replaceChild(inputContainer, nameSelect);
        // 초기 값 기준으로 아이콘 표시
        setCharacterIconOnInputWithElement(input, partyMembers[index].name);
        // 초기 표시 시 EN/JP에서는 번역된 표시명을 보여주도록 처리 (값은 KR 고정)
        if (getCurrentLanguage() !== 'kr' && input.value) {
          const displayName = getCharacterDisplayName(input.value);
          inputContainer.setAttribute('data-display-text', displayName);
          inputContainer.classList.add('show-translation');
        }
        
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

        // 전역 포탈 방식: 입력은 readonly, 클릭 시 포탈 열기
        input.setAttribute('readonly', 'readonly');
        const openCharacterPortal = (e) => {
          try { if (e) { e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); } } catch(_){ }
          if (typeof openPortal === 'function') {
            openPortal('character', input, {
              partyIndex: index,
              onSelect: (charKR, displayName) => {
                input.value = charKR;
                // 번역 표시
                if (getCurrentLanguage() !== 'kr') {
                  inputContainer.setAttribute('data-display-text', displayName || getCharacterDisplayName(charKR));
                  inputContainer.classList.add('show-translation');
                } else {
                  inputContainer.classList.remove('show-translation');
                }
                // 아이콘 적용
                setCharacterIconOnInputWithElement(input, charKR);
                // change 이벤트 발생 (기존 로직 실행)
                const event = new Event('change', { bubbles: true });
                input.dispatchEvent(event);
              }
            });
          }
        };
        ['pointerdown','mousedown','click','touchstart'].forEach(ev => input.addEventListener(ev, openCharacterPortal));
        // 컨테이너/라벨에서도 포탈 오픈
        const containerOpenHandler = (e) => {
          openCharacterPortal(e);
        };
        ['pointerdown','mousedown','click','touchstart'].forEach(ev => inputContainer.addEventListener(ev, containerOpenHandler));
        // 같은 input-group 내 라벨도 클릭 시 포탈 오픈
        const group = inputContainer.closest('.input-group');
        const labelEl = group ? group.querySelector('label') : null;
        if (labelEl) {
          ['pointerdown','mousedown','click','touchstart'].forEach(ev => labelEl.addEventListener(ev, (e)=>{
            // 라벨 클릭으로 포커스가 입력에 가지 전에 포탈 열기
            containerOpenHandler(e);
          }));
        }
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            openCharacterPortal(e);
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
            // 원더 선택 시에도 기본 자동 액션을 턴마다 1개씩 추가 (임포트 중에는 스킵)
            if (!window.__IS_APPLYING_IMPORT) {
              turns.forEach(turn => {
                // 기존 원더 자동 액션 제거
                turn.actions = (turn.actions || []).filter(a => !(a.type === 'auto' && a.character === '원더'));
                // 기본 빈 자동 액션 추가
                turn.actions.push({
                  type: 'auto',
                  character: '원더',
                  action: '',
                  wonderPersona: '',
                  memo: ''
                });
              });
            }
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
            if (!window.__IS_APPLYING_IMPORT) {
              const hasPattern = typeof ritualPatterns !== 'undefined' && ritualPatterns[selectedName];
              const pattern = hasPattern && typeof findPatternForLevel === 'function' ? findPatternForLevel(selectedName, currentRitual) : null;
              turns.forEach((turn, turnIndex) => {
                // 기존 자동 액션 제거
                turn.actions = turn.actions.filter(action => 
                  !(action.type === 'auto' && action.character === selectedName)
                );
                // 패턴이 있으면 적용, 없거나 비어있으면 기본 빈 액션 1개 추가
                if (pattern && pattern[turnIndex] && pattern[turnIndex].length > 0) {
                  pattern[turnIndex].forEach(actionData => {
                    const newAction = {
                      type: 'auto',
                      character: selectedName,
                      action: actionData.type,
                      wonderPersona: "",
                      memo: ""
                    };
                    if (actionData.order === 0) {
                      turn.actions.unshift(newAction);
                    } else {
                      turn.actions.push(newAction);
                    }
                  });
                } else {
                  // 드롭다운의 기본값(맨 위 옵션)이 선택되도록 빈 액션 추가
                  turn.actions.push({
                    type: 'auto',
                    character: selectedName,
                    action: "",
                    wonderPersona: "",
                    memo: ""
                  });
                }
              });
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
            // 원더 입력 시에도 기본 자동 액션 추가 (임포트 중에는 스킵)
            if (!window.__IS_APPLYING_IMPORT) {
              turns.forEach(turn => {
                // 기존 원더 자동 액션 제거
                turn.actions = (turn.actions || []).filter(a => !(a.type === 'auto' && a.character === '원더'));
                // 기본 빈 자동 액션 추가
                turn.actions.push({
                  type: 'auto',
                  character: '원더',
                  action: '',
                  wonderPersona: '',
                  memo: ''
                });
              });
            }
          } else {
            ritualSelect.disabled = false;
            mainRevSelect.disabled = false;
            
            // 새로 선택된 캐릭터의 의식 패턴이 있는지 확인
            {
              const hasPattern = typeof ritualPatterns !== 'undefined' && ritualPatterns[selectedName];
              const pattern = hasPattern && typeof findPatternForLevel === 'function' ? findPatternForLevel(selectedName, currentRitual) : null;
              turns.forEach((turn, turnIndex) => {
                // 기존 자동 액션 제거
                turn.actions = turn.actions.filter(action => 
                  !(action.type === 'auto' && action.character === selectedName)
                );
                // 패턴이 있으면 적용, 없거나 비어있으면 기본 빈 액션 1개 추가
                if (pattern && pattern[turnIndex] && pattern[turnIndex].length > 0) {
                  pattern[turnIndex].forEach(actionData => {
                    const newAction = {
                      type: 'auto',
                      character: selectedName,
                      action: actionData.type,
                      wonderPersona: "",
                      memo: ""
                    };
                    if (actionData.order === 0) {
                      turn.actions.unshift(newAction);
                    } else {
                      turn.actions.push(newAction);
                    }
                  });
                } else {
                  // 드롭다운의 기본값(맨 위 옵션)이 선택되도록 빈 액션 추가
                  turn.actions.push({
                    type: 'auto',
                    character: selectedName,
                    action: "",
                    wonderPersona: "",
                    memo: ""
                  });
                }
              });
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
  document.addEventListener('DOMContentLoaded', async () => {
    try { await setupTranslations(); } catch(_) {}
    initializePartyTranslations();
  });