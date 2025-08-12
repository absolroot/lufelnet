// 공통 적용 함수: 파일이든 외부 데이터든 동일 로직으로 UI에 주입
window.applyImportedData = function(payload, options = {}) {
  try {
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
        actions: (turn.actions || []).map(action => ({
          type: action.type === 0 || action.type === 'auto' ? 'auto' : 'manual',
          character: action.character,
          wonderPersona: action.wonderPersona,
          action: action.action,
          memo: action.memo || ''
        }))
      }));
    } else if (isCompressed) {
      turns = data.t.map(turn => ({
        turn: turn.n,
        actions: (turn.a || []).map(action => ({
          type: action.m ? 'manual' : 'auto',
          character: action.c,
          wonderPersona: action.w,
          action: action.a,
          memo: action.mm || ''
        }))
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
        const nameInput = partyDiv.querySelector('.party-name-input');
        if (nameInput) nameInput.value = name || '';
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

    // 계시 값 재설정 (setupPartySelection 이후에 실행)
    const postPartyArray = isRaw ? (data.party || []) : (data.p || []);
    postPartyArray.forEach((p, idx) => {
      const partyDiv = document.querySelector(`.party-member[data-index="${idx}"]`);
      const mainRev = isRaw ? p.mainRev : p.mr;
      const subRev = isRaw ? p.subRev : p.sr;
      if (partyDiv && mainRev) {
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

    // URL 파라미터 정리
    if (!keepUrl && typeof getBaseUrl === 'function') {
      window.history.replaceState({}, document.title, getBaseUrl());
    }
  } catch (error) {
    console.error('Invalid file data:', error);
    alert('파일 형식이 올바르지 않습니다.');
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