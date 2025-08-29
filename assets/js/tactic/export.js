// 기본 내보내기: raw 포맷 사용
function exportData() {
  return exportData_raw();
}

// 데이터 내보내기 함수 (약어 없이 전체 이름 사용)
function exportData_raw() {
const turnContainers = document.querySelectorAll('.turn-container');
const currentTurns = new Array(6).fill(null);

turnContainers.forEach(container => {
    const turnIndex = parseInt(container.getAttribute('data-turn-index'), 10);
    const turn = turns[turnIndex];
    const actionsList = container.querySelector('.actions');
    const actions = [];
    
    actionsList.querySelectorAll('li').forEach(actionItem => {
    const charSelect = actionItem.querySelector('.action-character');
    const personaSelect = actionItem.querySelector('.wonder-persona-select');
    const skillSelect = actionItem.querySelector('.action-skill');
    const memoInput = actionItem.querySelector('.hidden-memo-input');
    
    actions.push({
        type: actionItem.classList.contains('auto-action') ? 0 : 1,
        character: charSelect ? charSelect.value : '',
        wonderPersona: personaSelect ? personaSelect.value : '',
        action: skillSelect ? skillSelect.value : '',
        memo: memoInput ? memoInput.value : ''
    });
    });
    
    const turnPayload = {
      turn: turn.turn,
      actions: actions
    };
    if (turn.customName) {
      turnPayload.customName = turn.customName;
    }
    currentTurns[turn.turn - 1] = turnPayload;
});

const data = {
    title: document.querySelector('.title-input').value.slice(0, 20) || "페르소나5X 택틱 메이커",
    wonderPersonas: wonderPersonas,
    weapon: document.querySelector(".wonder-weapon-input").value,
    personaSkills: Array.from(document.querySelectorAll(".persona-skill-input")).map(input => input.value),
    party: partyMembers.map((pm, idx) => {
    const memberDiv = document.querySelector(`.party-member[data-index="${idx}"]`);
    return {
        name: pm.name,
        order: pm.order,
        ritual: pm.ritual,
        mainRev: memberDiv?.querySelector(".main-revelation")?.value || "",
        subRev: memberDiv?.querySelector(".sub-revelation")?.value || ""
    };
    }),
    turns: currentTurns.filter(turn => turn !== null)
};

const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'p5x_tactic_raw.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}

