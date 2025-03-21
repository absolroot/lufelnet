// 시뮬레이터 관련 함수
function initSimulator() {
  renderTurnList();
  setupRadioListeners();
}

function renderTurnList() {
  const turnList = document.querySelector('.turn-list');
  turnList.innerHTML = '';

  turns.forEach((turn, turnIndex) => {
    const turnDiv = document.createElement('div');
    turnDiv.className = 'turn-group';
    turnDiv.innerHTML = `<h3>턴 ${turn.turn}</h3>`;

    turn.actions.forEach((action, actionIndex) => {
      const actionDiv = document.createElement('div');
      actionDiv.className = 'turn-action';
      actionDiv.innerHTML = `
        <input type="radio" name="turn${turn.turn}" data-turn="${turnIndex}" data-action="${actionIndex}">
        <span>${action.character} - ${action.action || action.wonderPersona || '행동 없음'}</span>
      `;
      turnDiv.appendChild(actionDiv);
    });

    turnList.appendChild(turnDiv);
  });
}

function setupRadioListeners() {
  document.querySelectorAll('.turn-action input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        const turnIndex = e.target.dataset.turn;
        const actionIndex = e.target.dataset.action;
        simulateEffects(turnIndex, actionIndex);
      }
    });
  });
}

function simulateEffects(turnIndex, actionIndex) {
  // 버프/디버프 시뮬레이션 로직 구현
  // TODO: 실제 시뮬레이션 로직 추가
}

// 탭 전환 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 활성 탭 변경
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // 탭 컨텐츠 변경
      const tabId = button.dataset.tab;
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      
      // 시뮬레이터 탭인 경우 초기화
      if (tabId === 'simulator') {
        initSimulator();
      }
    });
  });
}); 