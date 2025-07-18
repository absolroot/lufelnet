// 데이터 가져오기 함수 수정
function importData() {
const input = document.createElement('input');
input.type = 'file';
input.accept = '.json';

input.onchange = function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
    try {
        const data = JSON.parse(e.target.result);
        
        // 제목 설정
        const titleInput = document.querySelector('.title-input');
        titleInput.value = data.title || "페르소나5X 택틱 메이커";
        
        // 원더 페르소나 데이터 설정
        wonderPersonas = data.w;
        
        // 원더 설정 UI 업데이트
        const wonderInputs = document.querySelectorAll(".wonder-persona-input");
        wonderInputs.forEach((input, idx) => {
        input.value = wonderPersonas[idx] || "";
        });

        // 원더 무기 설정 (wp -> weapon)
        const weaponInput = document.querySelector(".wonder-weapon-input");
        if (data.wp) {
        weaponInput.value = data.wp;
        }

        // 페르소나 스킬 설정
        const skillInputs = document.querySelectorAll(".persona-skill-input");
        if (data.ps) {
            skillInputs.forEach((input, idx) => {
                input.value = data.ps[idx] || "";
                // 첫 번째 슬롯(고유스킬)이면서 페르소나가 선택된 경우
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
        
        // 턴 데이터 설정 - 압축된 형식을 원래 형식으로 변환
        turns = data.t.map(turn => ({
        turn: turn.n,
        actions: turn.a.map(action => ({
            type: action.m ? 'manual' : 'auto',
            character: action.c,
            wonderPersona: action.w,
            action: action.a,
            memo: action.mm || ""
        }))
        }));
        
        // partyMembers 데이터 복원
        data.p.forEach((p, idx) => {
        partyMembers[idx] = {
            index: idx,
            name: p.n,
            order: p.o,
            ritual: p.r
        };
        
        // 파티원 UI 업데이트
        const partyDiv = document.querySelector(`.party-member[data-index="${idx}"]`);
        if (partyDiv) {
            // 이름 입력 필드 업데이트
            const nameInput = partyDiv.querySelector(".party-name-input");
            if (nameInput) {
            nameInput.value = p.n || "";
            }
            
            // 순서 선택 업데이트
            const orderSelect = partyDiv.querySelector(".party-order");
            if (orderSelect) {
            orderSelect.value = p.o || "";
            }
            
            // 의식 선택 업데이트
            const ritualSelect = partyDiv.querySelector(".party-ritual");
            if (ritualSelect) {
            ritualSelect.value = p.r || "0";
            
            // 원더일 경우 의식 비활성화
            if (p.n === "원더") {
                ritualSelect.disabled = true;
            } else {
                ritualSelect.disabled = false;
            }
            }
            
            // 계시 설정 수정
            const mainRevSelect = partyDiv.querySelector(".main-revelation");
            const subRevSelect = partyDiv.querySelector(".sub-revelation");
            
            if (mainRevSelect) {
            // 주 계시 옵션 초기화 및 설정
            mainRevSelect.innerHTML = '<option value="">-</option>';
            Object.keys(revelationData.main).forEach(rev => {
                const opt = document.createElement("option");
                opt.value = rev;
                opt.textContent = rev;
                mainRevSelect.appendChild(opt);
            });
            
            // 주 계시 값 설정
            mainRevSelect.value = p.mr || "";
            
            // 원더일 경우 계시 비활성화
            if (p.n === "원더") {
                mainRevSelect.disabled = true;
                subRevSelect.disabled = true;
                subRevSelect.value = "";
            } else {
                mainRevSelect.disabled = false;
                
                // 주 계시가 있는 경우 일월성진 옵션 설정
                if (p.mr && revelationData.main[p.mr]) {
                subRevSelect.disabled = false;
                
                // 일월성진 옵션 초기화 및 재설정
                subRevSelect.innerHTML = '<option value="">-</option>';
                revelationData.main[p.mr].forEach(subRev => {
                    const opt = document.createElement("option");
                    opt.value = subRev;
                    opt.textContent = subRev;
                    subRevSelect.appendChild(opt);
                });
                
                // 저장된 일월성진 값 설정
                if (p.sr) {
                    subRevSelect.value = p.sr;
                }
                } else {
                subRevSelect.disabled = true;
                subRevSelect.innerHTML = '<option value="">-</option>';
                }
            }
            }
        }
        });
        
        // UI 기본 설정
        setupWonderConfig();
        setupPartySelection();
        
        // 계시 값 재설정 (setupPartySelection 이후에 실행)
        data.p.forEach((p, idx) => {
        const partyDiv = document.querySelector(`.party-member[data-index="${idx}"]`);
        if (partyDiv && p.mr) {
            const mainRevSelect = partyDiv.querySelector(".main-revelation");
            const subRevSelect = partyDiv.querySelector(".sub-revelation");
            
            if (mainRevSelect) {
            mainRevSelect.value = p.mr;
            
            if (revelationData.main[p.mr]) {
                subRevSelect.disabled = false;
                subRevSelect.innerHTML = '<option value="">-</option>';
                revelationData.main[p.mr].forEach(subRev => {
                const opt = document.createElement("option");
                opt.value = subRev;
                opt.textContent = subRev;
                subRevSelect.appendChild(opt);
                });
                
                // 저장된 일월성진 값 설정
                if (p.sr) {
                subRevSelect.value = p.sr;
                }
            }
            }
        }
        });
        
        updatePartyImages();
        renderTurns();
        
        // URL 파라미터 제거하여 이후 자동 업데이트 활성화
        window.history.replaceState({}, document.title, getBaseUrl());
        
    } catch (error) {
        console.error('Invalid file data:', error);
        alert('파일 형식이 올바르지 않습니다.');
    }
    };
    
    reader.readAsText(file);
    };

    input.click();
}