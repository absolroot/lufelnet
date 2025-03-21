// 데이터 내보내기 함수 수정
function exportData() {
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
    const memoInput = actionItem.querySelector('.action-memo');
    
    actions.push({
        m: actionItem.classList.contains('auto-action') ? 0 : 1, // type -> m
        c: charSelect ? charSelect.value : '', // character -> c
        w: personaSelect ? personaSelect.value : '', // wonderPersona -> w
        a: skillSelect ? skillSelect.value : '', // action -> a
        mm: memoInput ? memoInput.value : '' // memo -> mm
    });
    });
    
    currentTurns[turn.turn - 1] = {
    n: turn.turn, // turn -> n
    a: actions // actions -> a
    };
});

const data = {
    title: document.querySelector('.title-input').value.slice(0, 20) || "페르소나5X 택틱 메이커",
    w: wonderPersonas,
    wp: document.querySelector(".wonder-weapon-input").value, // weapon -> wp
    ps: Array.from(document.querySelectorAll(".persona-skill-input")).map(input => input.value), // personaSkills -> ps
    p: partyMembers.map((pm, idx) => {
    const memberDiv = document.querySelector(`.party-member[data-index="${idx}"]`);
    return {
        n: pm.name,
        o: pm.order,
        r: pm.ritual,
        mr: memberDiv?.querySelector(".main-revelation")?.value || "", // mainRev -> mr
        sr: memberDiv?.querySelector(".sub-revelation")?.value || "" // subRev -> sr
    };
    }),
    t: currentTurns.filter(turn => turn !== null)
};

const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'p5x_tactic.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}

