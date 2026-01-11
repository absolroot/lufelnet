      /* ========== 전체 렌더링 ========== */
function renderTurns() {
  const turnsContainer = document.getElementById("turns");
  if (!turnsContainer) return;
  const isLocked = turnsContainer.classList.contains('turns-locked');
  turnsContainer.innerHTML = "";

  /*
  // (외부) 상단 컨트롤 영역 (턴 추가 버튼) - #turns 밖에 배치하여 그리드/드래그에 포함되지 않도록 함
  const existingControls = document.getElementById('turns-controls');
  let controls = existingControls;
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'turns-controls';
    controls.className = 'turns-controls';
    // #turns 앞에 삽입
    if (turnsContainer.parentNode) {
      turnsContainer.parentNode.insertBefore(controls, turnsContainer);
    }
  }
  // 컨트롤 내용/리스너 초기화
  controls.innerHTML = '';
  const addTurnBtn = document.createElement('button');
  addTurnBtn.className = 'add-turn-btn';
  // 간단 다국어 처리
  try {
    const lang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'kr';
    addTurnBtn.textContent = lang === 'en' ? '+ Turn' : (lang === 'jp' ? '＋ ターン追加' : '＋ 턴 추가');
    addTurnBtn.title = lang === 'en' ? 'Add a new turn' : (lang === 'jp' ? '新しいターンを追加' : '새 턴 추가');
  } catch(_) {
    addTurnBtn.textContent = '＋ 턴 추가';
  }
  addTurnBtn.addEventListener('click', () => {
    const newIndex = turns.length + 1;
    turns.push({ turn: newIndex, actions: [] });
    renderTurns();
  });
  controls.appendChild(addTurnBtn);*/

  // 화면 너비에 따라 턴 표시 순서 결정 (동적 길이 지원)
  let orderedIndices = [];
  if (window.innerWidth < 1200) {
    // 모바일: 1,2,3,... 순서
    for (let i = 0; i < turns.length; i++) orderedIndices.push(i);
  } else {
    // 데스크톱: 2열 인터리브 (예: 1,5,2,6,3,7,4,8...)
    const mid = Math.ceil(turns.length / 2);
    const left = Array.from({length: mid}, (_, i) => i);
    const right = Array.from({length: turns.length - mid}, (_, i) => mid + i);
    const maxLen = Math.max(left.length, right.length);
    for (let r = 0; r < maxLen; r++) {
      if (r < left.length) orderedIndices.push(left[r]);
      if (r < right.length) orderedIndices.push(right[r]);
    }
  }

  orderedIndices.forEach((tIndex) => {
    const turn = turns[tIndex];
    const turnDiv = document.createElement("div");
    turnDiv.className = "turn-container";
    turnDiv.setAttribute("data-turn-index", String(tIndex));

    // 턴 헤더 컨테이너
    const headerContainer = document.createElement("div");
    headerContainer.className = "turn-header-container";

    // 턴 헤더
    const header = document.createElement("div");
    header.className = "turn-header";
    header.textContent = turn.customName ? String(turn.customName) : `${turn.turn}Turn`;
    headerContainer.appendChild(header);

    // + 버튼 (해당 턴에 액션 추가)
    const addBtn = document.createElement("button");
    addBtn.className = "add-action";
    addBtn.textContent = "+";
    addBtn.addEventListener("click", () => {
      // 해명 괴도가 설정되어 있는지 확인
      const supportMember = partyMembers.find(pm => pm.index === 4 && pm.name !== "");

      turn.actions.push({
        type: 'manual',
        character: supportMember ? supportMember.name : "",  // 해명 괴도가 있으면 자동으로 설정
        wonderPersona: "",
        action: "",
        memo: ""
      });
      renderTurns();
    });
    headerContainer.appendChild(addBtn);

    // 메뉴 버튼 및 메뉴 (material-planner 스타일)
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>';
    const menu = document.createElement('div');
    menu.className = 'menu';
    const styleButton = (btn)=>{ btn.style.width='100%'; btn.style.maxWidth='120px'; btn.style.textAlign='left'; btn.style.padding='8px 10px'; btn.style.background='transparent'; btn.style.border='none'; btn.style.cursor='pointer'; };

    // 다국어 라벨
    const _lang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'kr';
    const L = (ko, en, jp) => (_lang === 'en' ? en : (_lang === 'jp' ? jp : ko));

    const renameBtn = document.createElement('button');
    renameBtn.textContent = L('턴 이름 수정', 'Rename turn', 'ターン名を変更');
    styleButton(renameBtn);

    const addTurnMenuBtn = document.createElement('button');
    addTurnMenuBtn.textContent = L('턴 추가', 'Add turn', 'ターン追加');
    styleButton(addTurnMenuBtn);

    const duplicateBtn = document.createElement('button');
    duplicateBtn.textContent = L('턴 복제', 'Duplicate turn', 'ターン複製');
    styleButton(duplicateBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = L('턴 삭제', 'Delete turn', 'ターン削除');
    deleteBtn.style.color = 'tomato';
    styleButton(deleteBtn);

    menu.appendChild(renameBtn);
    menu.appendChild(addTurnMenuBtn);
    menu.appendChild(duplicateBtn);
    menu.appendChild(deleteBtn);

    // 메뉴 동작
    menu.addEventListener('click', (e)=> e.stopPropagation());
    menuBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      // 다른 메뉴 닫기 및 display 반영
      document.querySelectorAll('.turn-header-container .menu').forEach(m=>{
        if(m!==menu) m.style.display='none';
      });
      menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
    });

    // 바깥 클릭 시 닫기 - 한 번만 바인딩
    if(!window.__turnHeaderMenuBound){
      window.__turnHeaderMenuBound = true;
      document.addEventListener('click', ()=>{
        document.querySelectorAll('.turn-header-container .menu').forEach(m=> m.style.display='none');
      });
    }

    // 메뉴 핸들러
    renameBtn.onclick = ()=>{
      const currentLabel = turn.customName || `${turn.turn}Turn`;
      const next = prompt(L('새 턴 이름을 입력하세요', 'Enter new turn name', '新しいターン名を入力してください'), currentLabel);
      if(next === null) return; // cancel
      const trimmed = String(next).trim();
      if(trimmed) {
        turn.customName = trimmed;
      } else {
        delete turn.customName;
      }
      renderTurns();
    };

    addTurnMenuBtn.onclick = ()=>{
      // 상단 버튼과 동일하게 마지막에 추가
      const newIndex = turns.length + 1;
      turns.push({ turn: newIndex, actions: [] });
      renderTurns();
    };

    duplicateBtn.onclick = ()=>{
      // 현재 턴 깊은 복제 후, 바로 뒤에 삽입
      const clone = JSON.parse(JSON.stringify(turn));
      // turn 번호는 나중에 재할당
      turns.splice(tIndex + 1, 0, clone);
      // 재번호 매기기
      turns.forEach((t, i)=>{ t.turn = i + 1; });
      renderTurns();
    };

    deleteBtn.onclick = ()=>{
      // 현재 턴 삭제
      turns.splice(tIndex, 1);
      // 재번호 매기기
      turns.forEach((t, i)=>{ t.turn = i + 1; });
      renderTurns();
    };

    headerContainer.appendChild(menuBtn);
    headerContainer.appendChild(menu);

    turnDiv.appendChild(headerContainer);

    // 액션 리스트
    const actionsList = document.createElement("ul");
    actionsList.className = "actions";

    turn.actions.forEach((action, aIndex) => {
      const li = createActionRow(tIndex, aIndex);
      actionsList.appendChild(li);
    });

    turnDiv.appendChild(actionsList);

    turnsContainer.appendChild(turnDiv);
  });

  // (A) 턴 자체의 드래그앤드롭 (턴 순서 변경) 
  /*
  if (!isLocked) {  // 잠금 상태가 아닐 때만 Sortable 활성화
      Sortable.create(turnsContainer, {
          animation: 150,
          handle: ".turn-header",
          onEnd: function() {
              // 현재 화면 순서에 맞춰 turns 배열 재정렬
              const newTurnArr = [];
              const turnDivs = turnsContainer.querySelectorAll(".turn-container");
              turnDivs.forEach(div => {
                const idx = parseInt(div.getAttribute("data-turn-index"), 10);
                newTurnArr.push(turns[idx]);
              });
              // 새 순서에 맞춰 턴 번호 재할당
              newTurnArr.forEach((turn, i) => {
                turn.turn = i + 1;
              });
              turns = newTurnArr;
              renderTurns();
          }
      });
  }*/

  // (B) 각 턴 내부 액션 리스트의 드래그앤드롭
  const actionLists = document.querySelectorAll(".actions");
  actionLists.forEach(list => {
      if (!isLocked) {  // 잠금 상태가 아닐 때만 Sortable 활성화
          Sortable.create(list, {
              animation: 150,
              group: 'actions',
              // 입력 필드는 드래그 시작점에서 제외
              filter: '.action-memo-display, .action-memo',
              // 필터링된 요소에서는 드래그 시작 방지
              preventOnFilter: true,
              // 스크롤 관련 설정 추가
              scrollSensitivity: 80,
              scrollSpeed: 10,
              // 드래그 시작 시 스크롤 위치 저장
              onStart: function() {
                  window.sortableScrollY = window.scrollY;
              },
              // 드래그 종료 시 저장된 스크롤 위치로 복원
              onEnd: function(evt) {
                  // 스크롤 위치 복원 (약간의 지연 추가)
                  setTimeout(() => {
                      if (window.sortableScrollY !== undefined) {
                          window.scrollTo(0, window.sortableScrollY);
                          window.sortableScrollY = undefined;
                      }
                  }, 10);

                  const fromTurnIndex = parseInt(evt.from.closest('.turn-container').dataset.turnIndex, 10);
                  const toTurnIndex = parseInt(evt.to.closest('.turn-container').dataset.turnIndex, 10);

                  const readActions = (ul, turnIndex) => Array.from(ul.children).map(item => {
                    const index = parseInt(item.dataset.actionIndex, 10);
                    return turns[turnIndex].actions[index];
                  });

                  if (fromTurnIndex === toTurnIndex) {
                    turns[fromTurnIndex].actions = readActions(evt.to, toTurnIndex);
                  } else {
                    turns[fromTurnIndex].actions = readActions(evt.from, fromTurnIndex);
                    turns[toTurnIndex].actions = readActions(evt.to, toTurnIndex);
                  }

                  renderTurns();
              }
          });
      }
  });
}
      
      // 화면 크기 변경 시 턴 재렌더링
      window.addEventListener('resize', () => {
        renderTurns();
      });