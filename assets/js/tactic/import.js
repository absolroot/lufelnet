// 공통 적용 함수: 파일이든 외부 데이터든 동일 로직으로 UI에 주입
window.applyImportedData = function(payload, options = {}) {
  try {
    // 임포트 중에는 각종 입력 핸들러(debouncedUpdate 등)로 인한 재렌더를 억제
    // 이벤트 측에서는 window.__IS_APPLYING_IMPORT 플래그를 확인해 불필요한 처리 방지
    window.__IS_APPLYING_IMPORT = true;
    const { keepUrl = false, titleOverride } = options;
    const data = typeof payload === 'string' ? JSON.parse(payload) : payload;

    // raw/압축 포맷 감지
    const isRaw = Array.isArray(data.turns) && Array.isArray(data.party);
    const isCompressed = Array.isArray(data.t) && Array.isArray(data.p);

    // 제목 설정 (library 로더에서 전달된 제목이 우선)
    const titleInput = document.querySelector('.title-input');
    if (titleInput) {
      if (titleOverride) titleInput.value = titleOverride;
      else titleInput.value = data.title || "페르소나5X 택틱 메이커";
    }

    // 원더 페르소나 데이터 설정
    wonderPersonas = isRaw ? (data.wonderPersonas || ["","",""]) : (data.w || ["","",""]);

    // 원더 설정 UI 업데이트
    const wonderInputs = document.querySelectorAll('.wonder-persona-input');
    wonderInputs.forEach((input, idx) => {
      input.value = wonderPersonas[idx] || '';
    });

    // 무기 설정
    const weaponInput = document.querySelector('.wonder-weapon-input');
    const weaponValue = isRaw ? data.weapon : data.wp;
    if (weaponInput && weaponValue) weaponInput.value = weaponValue;

    // 페르소나 스킬 설정
    const skillInputs = document.querySelectorAll('.persona-skill-input');
    const personaSkills = isRaw ? data.personaSkills : data.ps;
    if (personaSkills) {
      skillInputs.forEach((input, idx) => {
        input.value = personaSkills[idx] || '';
        // 고유스킬 슬롯 비활성화
        if (idx % 3 === 0) {
          const personaIndex = Math.floor(idx / 3);
          const selectedPersona = wonderPersonas[personaIndex];
          if (selectedPersona && personaData[selectedPersona]) {
            input.disabled = true;
            input.classList.add('unique-skill');
          }
        }
      });
    }

    // 턴 데이터 설정
    if (isRaw) {
      turns = data.turns.map(turn => ({
        turn: turn.turn,
        actions: (turn.actions || []).map(action => {
          const personaName = action.wonderPersona;
          const providedIndex = (typeof action.wonderPersonaIndex === 'number') ? action.wonderPersonaIndex : -1;
          const resolvedIndex = (personaName ? wonderPersonas.indexOf(personaName) : -1);
          return {
            type: action.type === 0 || action.type === 'auto' ? 'auto' : 'manual',
            character: action.character,
            wonderPersona: personaName,
            wonderPersonaIndex: providedIndex !== -1 ? providedIndex : resolvedIndex,
            action: action.action,
            memo: action.memo || ''
          };
        })
      }));
    } else if (isCompressed) {
      turns = data.t.map(turn => ({
        turn: turn.n,
        actions: (turn.a || []).map(action => {
          const personaName = action.w;
          const providedIndex = (typeof action.wi === 'number') ? action.wi : -1; // 압축 포맷의 인덱스 키 가정: wi
          const resolvedIndex = (personaName ? wonderPersonas.indexOf(personaName) : -1);
          return {
            type: action.m ? 'manual' : 'auto',
            character: action.c,
            wonderPersona: personaName,
            wonderPersonaIndex: providedIndex !== -1 ? providedIndex : resolvedIndex,
            action: action.a,
            memo: action.mm || ''
          };
        })
      }));
    } else {
      throw new Error('Unrecognized file format');
    }

    // partyMembers 데이터 복원
    const partyArray = isRaw ? data.party : data.p;
    partyArray.forEach((p, idx) => {
      const name = isRaw ? p.name : p.n;
      const order = isRaw ? p.order : p.o;
      const ritual = isRaw ? p.ritual : p.r;
      const mainRev = isRaw ? p.mainRev : p.mr;
      const subRev = isRaw ? p.subRev : p.sr;

      partyMembers[idx] = { index: idx, name, order, ritual };

      const partyDiv = document.querySelector(`.party-member[data-index="${idx}"]`);
      if (partyDiv) {
        // 최신 마크업은 select.party-name 사용
        const nameSelect = partyDiv.querySelector('.party-name');
        if (nameSelect) {
          nameSelect.value = name || '';
        }
        const orderSelect = partyDiv.querySelector('.party-order');
        if (orderSelect) orderSelect.value = order || '';
        const ritualSelect = partyDiv.querySelector('.party-ritual');
        if (ritualSelect) {
          ritualSelect.value = ritual || '0';
          ritualSelect.disabled = name === '원더';
        }

        const mainRevSelect = partyDiv.querySelector('.main-revelation');
        const subRevSelect = partyDiv.querySelector('.sub-revelation');
        if (mainRevSelect) {
          mainRevSelect.innerHTML = '<option value="">-</option>';
          Object.keys(revelationData.main).forEach(rev => {
            const opt = document.createElement('option');
            opt.value = rev; opt.textContent = rev; mainRevSelect.appendChild(opt);
          });
          mainRevSelect.value = mainRev || '';
          if (name === '원더') {
            mainRevSelect.disabled = true;
            if (subRevSelect) { subRevSelect.disabled = true; subRevSelect.value = ''; }
          } else if (mainRev && revelationData.main[mainRev]) {
            if (subRevSelect) {
              subRevSelect.disabled = false;
              subRevSelect.innerHTML = '<option value="">-</option>';
              revelationData.main[mainRev].forEach(sr => {
                const opt = document.createElement('option');
                opt.value = sr; opt.textContent = sr; subRevSelect.appendChild(opt);
              });
              if (subRev) subRevSelect.value = subRev;
            }
          } else if (subRevSelect) {
            subRevSelect.disabled = true;
            subRevSelect.innerHTML = '<option value="">-</option>';
          }
        }
      }
    });

    // UI 기본 설정
    setupWonderConfig();
    setupPartySelection();

    // setparty가 이미 input 기반 UI를 구성한 경우, 입력 값 강제 주입
    try {
      const currentLangForParty = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'kr';
      partyMembers.forEach(member => {
        const container = document.querySelector(`.party-member[data-index="${member.index}"] .input-container`);
        const input = document.querySelector(`.party-member[data-index="${member.index}"] .party-name-input`);
        if (input) {
          input.value = member.name || '';
          // 번역 표시 보정
          if (input.value && currentLangForParty !== 'kr') {
            if (typeof characterData !== 'undefined' && characterData[input.value]) {
              const ch = characterData[input.value];
              let display = input.value;
              if (currentLangForParty === 'en' && ch.name_en) display = ch.name_en;
              else if (currentLangForParty === 'jp' && ch.name_jp) display = ch.name_jp;
              if (container) {
                container.setAttribute('data-display-text', display);
                container.classList.add('show-translation');
              }
            }
          } else if (container) {
            container.classList.remove('show-translation');
          }
          // 아이콘 및 관련 상태 갱신을 위해 change 이벤트 발생 (setparty.js의 핸들러 이용)
          try {
            const evt = new Event('change', { bubbles: true });
            input.dispatchEvent(evt);
          } catch (_) {}
        }
      });
    } catch(_) {}

    // 계시 값 재설정 (setupPartySelection 이후에 실행) + 파티 이름 보정
    const postPartyArray = isRaw ? (data.party || []) : (data.p || []);
    postPartyArray.forEach((p, idx) => {
      const partyDiv = document.querySelector(`.party-member[data-index="${idx}"]`);
      const name = isRaw ? p.name : p.n;
      const mainRev = isRaw ? p.mainRev : p.mr;
      const subRev = isRaw ? p.subRev : p.sr;
      if (!partyDiv) return;
      // 파티 이름 select 보정: 옵션이 없으면 추가 후 선택
      const nameSelect = partyDiv.querySelector('.party-name');
      if (nameSelect) {
        if (name) {
          const has = Array.from(nameSelect.options).some(o => o.value === name);
          if (!has) {
            const opt = document.createElement('option');
            opt.value = name; opt.textContent = name; nameSelect.appendChild(opt);
          }
        }
        nameSelect.value = name || '';
      }
      // 계시 값 적용
      if (mainRev) {
        const mainRevSelect = partyDiv.querySelector('.main-revelation');
        const subRevSelect = partyDiv.querySelector('.sub-revelation');
        if (mainRevSelect) {
          mainRevSelect.value = mainRev;
          if (revelationData.main[mainRev] && subRevSelect) {
            subRevSelect.disabled = false;
            subRevSelect.innerHTML = '<option value="">-</option>';
            revelationData.main[mainRev].forEach(sr => {
              const opt = document.createElement('option');
              opt.value = sr; opt.textContent = sr; subRevSelect.appendChild(opt);
            });
            if (subRev) subRevSelect.value = subRev;
          }
        }
      }
    });

    updatePartyImages();
    renderTurns();

    // characterData가 늦게 로드되는 경우를 대비해 짧게 재시도하여 아이콘을 보정
    try {
      setTimeout(() => {
        document.querySelectorAll('.party-member .party-name-input').forEach(input => {
          const evt = new Event('change', { bubbles: true });
          input.dispatchEvent(evt);
        });
      }, 300);
    } catch (_) {}

    // 다국어 적용 (무기/고유스킬/파티명/계시 표시 텍스트) - 로딩 후에도 재시도
    (function applyI18nAfterLoad() {
      try {
        const currentLang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : ((typeof LanguageRouter !== 'undefined') ? LanguageRouter.getCurrentLanguage() : 'kr');
        if (currentLang !== 'kr') {
          // 무기 표시 (입력값은 KR 유지, 표시 텍스트만 번역)
          const weaponInput = document.querySelector('.wonder-weapon-input');
          if (weaponInput && weaponInput.value && typeof matchWeapons !== 'undefined') {
            const weaponName = weaponInput.value;
            const meta = matchWeapons[weaponName];
            if (meta) {
              let displayName = weaponName;
              if (currentLang === 'en' && meta.name_en) displayName = meta.name_en;
              else if (currentLang === 'jp' && meta.name_jp) displayName = meta.name_jp;
              const inputContainer = weaponInput.closest('.input-container') || weaponInput.parentElement;
              if (inputContainer) {
                inputContainer.setAttribute('data-display-text', displayName);
                inputContainer.classList.add('show-translation');
              }
            }
          }

          // 페르소나 고유스킬 표시 (입력값은 KR 유지, 표시 텍스트만 번역)
          const skillInputs = document.querySelectorAll('.persona-skill-input');
          skillInputs.forEach((input, index) => {
            if (index % 3 !== 0) return; // 고유 스킬 슬롯만
            const personaIndex = Math.floor(index / 3);
            const selectedPersona = wonderPersonas[personaIndex];
            if (selectedPersona && typeof personaData !== 'undefined' && personaData[selectedPersona]) {
              const unique = personaData[selectedPersona].uniqueSkill || {};
              let displayName = input.value;
              if (currentLang === 'en' && unique.name_en) displayName = unique.name_en;
              else if (currentLang === 'jp' && unique.name_jp) displayName = unique.name_jp;
              const inputContainer = input.closest('.input-container') || input.parentElement;
              if (inputContainer) {
                inputContainer.setAttribute('data-display-text', displayName);
                inputContainer.classList.add('show-translation');
              }
            }
          });

          // 파티원 이름 표시: 선택된 옵션의 텍스트만 번역 적용 (값은 KR 유지)
          document.querySelectorAll('.party-member').forEach(member => {
            const sel = member.querySelector('.party-name');
            if (!sel || !sel.value) return;
            const origin = sel.value;
            if (typeof characterData !== 'undefined' && characterData[origin]) {
              const ch = characterData[origin];
              let display = origin;
              if (currentLang === 'en' && ch.name_en) display = ch.name_en;
              else if (currentLang === 'jp' && ch.name_jp) display = ch.name_jp;
              const opt = sel.querySelector(`option[value="${CSS.escape(origin)}"]`);
              if (opt) opt.textContent = display;
            }
          });

          // 계시 옵션 텍스트 번역
          const langData = (window.languageData && window.languageData[currentLang]) ? window.languageData[currentLang] : null;
          const revMap = langData && langData.revelationMapping ? langData.revelationMapping : null;
          if (revMap) {
            document.querySelectorAll('.main-revelation, .sub-revelation').forEach(select => {
              for (const option of select.options) {
                if (!option.value) continue;
                option.textContent = revMap[option.value] || option.value;
              }
            });
          }
        }
      } catch (_) {}

      // languageData가 아직 준비 전일 수 있으므로 짧게 재시도
      if (!window.__APPLY_I18N_TRIED__) {
        window.__APPLY_I18N_TRIED__ = 1;
        setTimeout(applyI18nAfterLoad, 400);
      }
    })();

    // URL 파라미터 정리
    if (!keepUrl && typeof getBaseUrl === 'function') {
      window.history.replaceState({}, document.title, getBaseUrl());
    }

    // 임포트 후 액션 메모를 현재 원더 페르소나/스킬 입력값 기준으로 동기화
    try {
      if (typeof updateActionMemos === 'function') updateActionMemos();
    } catch(_) {}
  } catch (error) {
    console.error('Invalid file data:', error);
    alert('파일 형식이 올바르지 않습니다.');
  } finally {
    // 임포트 완료
    window.__IS_APPLYING_IMPORT = false;
  }
};

// 데이터 가져오기 함수 수정 (파일 업로드 경로)
function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      window.applyImportedData(text);
    } catch (error) {
      console.error('Invalid file data:', error);
      alert('파일 형식이 올바르지 않습니다.');
    }
  };

  input.click();
}