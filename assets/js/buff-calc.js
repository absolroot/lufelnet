// 버프 계산기 메인 로직
class BuffCalculator {
    constructor() {
        this.selectedBuffs = new Set();
        this.selectedDealerBuffs = new Set();
        this.init();
    }

    init() {
        this.initTabs();
        this.initDealerTabs();
        this.initTable();
        this.initDealerTable();
        this.initEventListeners();
        this.initDamageCalculator();
        
        // 초기 상태에서 딜러 조건 탭 즉시 숨김
        const dealerConditionTabs = document.querySelector('.dealer-condition-tabs-container');
        if (dealerConditionTabs) {
            dealerConditionTabs.style.display = 'none';
        }
        
        // 총합 값 초기화
        this.updateTotalValues();
        
        // 캐릭터 탭 체크 표시 초기화
        this.updateCharacterTabCheckmarks();
        this.updateDealerCharacterTabCheckmarks();
    }

    initTabs() {
        const tabButtons = document.querySelector('.tab-buttons');
        tabButtons.innerHTML = '';

        // 캐릭터별 탭 버튼 추가
        Object.keys(BUFF_DATA).forEach(character => {
            const button = document.createElement('button');
            button.className = 'tab-button';
            button.dataset.tab = character;

            // 괴도 이미지 추가
            const charImg = document.createElement('img');
            charImg.src = `${BASE_URL}/assets/img/character-half/${character}.webp`;
            charImg.alt = character;
            charImg.className = 'tab-char-img';
            button.appendChild(charImg);

            // 캐릭터 이름 추가
            const charName = document.createElement('span');
            charName.textContent = character;
            button.appendChild(charName);

            if (character === Object.keys(BUFF_DATA)[0]) {
                button.classList.add('active');
            }
            tabButtons.appendChild(button);
        });

        // 탭 컨텐츠 컨테이너 초기화
        const tabContents = document.querySelector('.table-tabs');
        const existingContents = tabContents.querySelectorAll('.tab-content');
        existingContents.forEach(content => content.remove());

        // 캐릭터별 탭 컨텐츠 추가
        Object.keys(BUFF_DATA).forEach((character, index) => {
            const content = document.createElement('div');
            content.className = 'tab-content';
            content.id = `${character}-tab`;
            if (index === 0) {
                content.classList.add('active');
            }

            // 캐릭터별 그룹 선택 체크박스 추가
            let groupCheckbox = '';
            if (character != '원더') {
                const ritualData = RITUAL_DATA[character]?.rituals || {};
                const modData = RITUAL_DATA[character]?.modifications || {};
                
                groupCheckbox = `
                    <div class="ritual-mod-container">
                        <div class="ritual-select">
                            <span>의식</span>
                            <div class="radio-group">
                                ${[0, 1, 2, 3, 4, 5, 6].map(num => `
                                    <label>
                                        <input type="checkbox" class="ritual-mod-checkbox" name="ritual-${character}" value="${num}" ${ritualData[num] ? '' : 'disabled'}>
                                        <span>${num}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="mod-select">
                            <span>개조</span>
                            <div class="radio-group">
                                ${[0, 1, 2, 3, 4, 5, 6].map(num => `
                                    <label>
                                        <input type="checkbox" class="ritual-mod-checkbox" name="mod-${character}" value="${num}" ${modData[num] ? '' : 'disabled'}>
                                        <span>${num}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;

                // 아케치의 경우 단일/광역 선택 라디오박스 추가
                if (character === '아케치') {
                    groupCheckbox += `
                        <div class="skill-type-select">
                            <span>메인 딜러 스킬 타입</span>
                            <div class="radio-group">
                                <label>
                                    <input type="radio" name="skill-type-${character}" value="aoe" checked>
                                    <span>광역</span>
                                </label>
                                <label>
                                    <input type="radio" name="skill-type-${character}" value="single">
                                    <span>단일</span>
                                </label>
                            </div>
                        </div>
                    `;
                }
            }
            if (character === '리코·매화') {
                groupCheckbox += `
                    <div class="crit-input-container">
                        <span>전투 중 크리티컬 효과(만개)</span>
                        <input type="number" class="crit-input" data-character="${character}" value="448" min="388" step="1">
                        <span>%</span>
                    </div>
                `;
            }

            content.innerHTML = `
                <div class="tab-header" ${character === '원더' ? 'style="display: none;"' : ''}>
                    ${groupCheckbox}
                </div>
                <div class="buff-table-container">
                    <table class="buff-table">
                        <thead>
                            <tr>
                                <th class="check-column">선택</th>
                                <th class="skill-icon-column"></th>
                                <th class="skill-name-column">이름</th>
                                <th class="type-column">타입</th>
                                <th class="option-column">옵션</th>
                                <th class="target-column">대상</th>
                                <th class="value-column">공격력 %</th>
                                <th class="value-column">공격력 상수</th>
                                <th class="value-column">크리티컬 확률</th>
                                <th class="value-column">크리티컬 효과</th>
                                <th class="value-column">대미지 보너스</th>
                                <th class="value-column">방어력 감소</th>
                                <th class="value-column">관통</th>
                                <th class="value-column">스킬 마스터</th>
                                <th class="value-column">독립 배수</th>
                                <th class="duration-column">지속시간</th>
                                <th class="note-column">비고</th>
                                <th class="condition-column">한정 조건</th>
                            </tr>
                        </thead>
                        <tbody id="${character}TableBody"></tbody>
                    </table>
                </div>
            `;
            tabContents.appendChild(content);
        });
    }

    initDealerTabs() {
        const tabButtons = document.querySelector('.dealer-table-tabs .tab-buttons');
        tabButtons.innerHTML = '';

        // 캐릭터별 탭 버튼 추가
        Object.keys(BUFF_DATA_DEALER).forEach(character => {
            const button = document.createElement('button');
            button.className = 'tab-button';
            button.dataset.tab = character;

            // 괴도 이미지 추가
            const charImg = document.createElement('img');
            charImg.src = `${BASE_URL}/assets/img/character-half/${character}.webp`;
            charImg.alt = character;
            charImg.className = 'tab-char-img';
            button.appendChild(charImg);

            // 캐릭터 이름 추가
            const charName = document.createElement('span');
            charName.textContent = character;
            button.appendChild(charName);

            if (character === Object.keys(BUFF_DATA_DEALER)[0]) {
                button.classList.add('active');
            }
            tabButtons.appendChild(button);
        });

        // 탭 컨텐츠 컨테이너 초기화
        const tabContents = document.querySelector('.dealer-table-tabs');
        const existingContents = tabContents.querySelectorAll('.tab-content');
        existingContents.forEach(content => content.remove());

        // 캐릭터별 탭 컨텐츠 추가
        Object.keys(BUFF_DATA_DEALER).forEach((character, index) => {
            const content = document.createElement('div');
            content.className = 'tab-content';
            content.id = `dealer-${character}-tab`;
            if (index === 0) {
                content.classList.add('active');
            }

            // 캐릭터별 그룹 선택 체크박스 추가
            let groupCheckbox = '';
            if (character != '원더') {
                const ritualData = RITUAL_DATA[character]?.rituals || {};
                const modData = RITUAL_DATA[character]?.modifications || {};
                
                groupCheckbox = `
                    <div class="ritual-mod-container">
                        <div class="ritual-select">
                            <span>의식</span>
                            <div class="radio-group">
                                ${[0, 1, 2, 3, 4, 5, 6].map(num => `
                                    <label>
                                        <input type="checkbox" class="ritual-mod-checkbox dealer-ritual-mod-checkbox" name="dealer-ritual-${character}" value="${num}" ${ritualData[num] ? '' : 'disabled'}>
                                        <span>${num}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="mod-select">
                            <span>개조</span>
                            <div class="radio-group">
                                ${[0, 1, 2, 3, 4, 5, 6].map(num => `
                                    <label>
                                        <input type="checkbox" class="ritual-mod-checkbox dealer-ritual-mod-checkbox" name="dealer-mod-${character}" value="${num}" ${modData[num] ? '' : 'disabled'}>
                                        <span>${num}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;

                // 아케치의 경우 단일/광역 선택 라디오박스 추가
                if (character === '아케치') {
                    groupCheckbox += `
                        <div class="skill-type-select">
                            <span>메인 딜러 스킬 타입</span>
                            <div class="radio-group">
                                <label>
                                    <input type="radio" name="dealer-skill-type-${character}" value="aoe" checked>
                                    <span>광역</span>
                                </label>
                                <label>
                                    <input type="radio" name="dealer-skill-type-${character}" value="single">
                                    <span>단일</span>
                                </label>
                            </div>
                        </div>
                    `;
                }
            }
            if (character === '리코·매화') {
                groupCheckbox += `
                    <div class="crit-input-container">
                        <span>전투 중 크리티컬 효과(만개)</span>
                        <input type="number" class="crit-input dealer-crit-input" data-character="${character}" value="448" min="388" step="1">
                        <span>%</span>
                    </div>
                `;
            }

            content.innerHTML = `
                <div class="tab-header" ${character === '원더' ? 'style="display: none;"' : ''}>
                    ${groupCheckbox}
                </div>
                <div class="buff-table-container">
                    <table class="buff-table">
                        <thead>
                            <tr>
                                <th class="check-column">선택</th>
                                <th class="skill-icon-column"></th>
                                <th class="skill-name-column">이름</th>
                                <th class="type-column">타입</th>
                                <th class="option-column">옵션</th>
                                <th class="target-column">대상</th>
                                <th class="value-column">공격력 %</th>
                                <th class="value-column">공격력 상수</th>
                                <th class="value-column">크리티컬 확률</th>
                                <th class="value-column">크리티컬 효과</th>
                                <th class="value-column">대미지 보너스</th>
                                <th class="value-column">방어력 감소</th>
                                <th class="value-column">관통</th>
                                <th class="value-column">스킬 마스터</th>
                                <th class="value-column">독립 배수</th>
                                <th class="duration-column">지속시간</th>
                                <th class="note-column">비고</th>
                                <th class="condition-column">한정 조건</th>
                            </tr>
                        </thead>
                        <tbody id="dealer-${character}TableBody"></tbody>
                    </table>
                </div>
            `;
            tabContents.appendChild(content);
        });
    }

    initTable() {
        // 캐릭터별 테이블 초기화
        Object.entries(BUFF_DATA).forEach(([character, buffs]) => {
            const tableBody = document.getElementById(`${character}TableBody`);
            if (tableBody) {
                tableBody.innerHTML = '';
                buffs.forEach(buff => {
                    // targets가 있는 경우 각 대상별로 행을 생성
                    if (buff.targets) {
                        buff.targets.forEach((targetData, index) => {
                            const row = this.createBuffRow(buff, character, targetData, index === 0);
                            tableBody.appendChild(row);
                        });
                    } else {
                        const row = this.createBuffRow(buff, character, null, true);
                        tableBody.appendChild(row);
                    }
                });
            }
        });

        // 초기 버프 값 업데이트
        this.updateBuffValues();
    }

    initDealerTable() {
        // 캐릭터별 테이블 초기화
        Object.entries(BUFF_DATA_DEALER).forEach(([character, buffs]) => {
            const tableBody = document.getElementById(`dealer-${character}TableBody`);
            if (tableBody) {
                tableBody.innerHTML = '';
                buffs.forEach(buff => {
                    // targets가 있는 경우 각 대상별로 행을 생성
                    if (buff.targets) {
                        buff.targets.forEach((targetData, index) => {
                            const row = this.createDealerBuffRow(buff, character, targetData, index === 0);
                            tableBody.appendChild(row);
                            
                            // 커스텀 버프이고 옵션이 있는 경우 첫 번째 옵션의 값을 적용
                            if (buff.isCustom && buff.options && Object.keys(buff.options).length > 0 && index === 0) {
                                const optionSelect = row.querySelector('.dealer-buff-option');
                                if (optionSelect) {
                                    const selectedOption = optionSelect.value;
                                    // 선택된 옵션을 이전 옵션으로 저장 (나중에 옵션 변경 시 기준점으로 사용)
                                    optionSelect.dataset.previousOption = selectedOption;
                                    
                                    const target = targetData.target || '자신';
                                    
                                    if (buff.options[selectedOption] && buff.options[selectedOption][target]) {
                                        const optionEffects = buff.options[selectedOption][target];
                                        Object.entries(optionEffects).forEach(([effectType, value]) => {
                                            const input = row.querySelector(`.custom-buff-input[data-effect="${effectType}"]`);
                                            if (input) {
                                                input.value = value;
                                                
                                                // 효과 데이터에도 값 업데이트
                                                const effectData = targetData.effects.find(e => e.type === effectType);
                                                if (effectData) {
                                                    effectData.value = value;
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        const row = this.createDealerBuffRow(buff, character, null, true);
                        tableBody.appendChild(row);
                    }
                });
            }
        });

        // 초기 버프 값 업데이트
        this.updateDealerBuffValues();
    }

    createBuffRow(buff, character, targetData = null, isFirstRow = true) {
        const row = document.createElement('tr');
        row.dataset.buffId = buff.id;
        row.dataset.character = character;
        if (targetData) {
            row.dataset.target = targetData.target;
        }

        // 체크박스 열
        const checkCell = document.createElement('td');
        if (isFirstRow) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'buff-checkbox';
            checkbox.dataset.buffId = buff.id;
            checkbox.dataset.character = character;
            checkCell.appendChild(checkbox);
        }
        row.appendChild(checkCell);

        // 스킬 아이콘 열
        const iconCell = document.createElement('td');
        if (isFirstRow) {
            const icon = document.createElement('img');
            icon.src = buff.skillIcon || '';
            icon.alt = buff.skillName;
            icon.className = 'skill-icon';
            iconCell.appendChild(icon);
        }
        row.appendChild(iconCell);

        // 스킬명 열
        const nameCell = document.createElement('td');
        if (isFirstRow) {
            nameCell.textContent = buff.skillName;
        }
        row.appendChild(nameCell);

        // 타입 열
        const typeCell = document.createElement('td');
        if (isFirstRow) {
            typeCell.textContent = buff.type;
        }
        row.appendChild(typeCell);

        // 옵션 열
        const optionCell = document.createElement('td');
        if (isFirstRow) {
            if (buff.options && Object.keys(buff.options).length > 0) {
                const select = document.createElement('select');
                select.className = 'buff-option';
                select.dataset.buffId = buff.id;
                select.dataset.character = character;

                Object.keys(buff.options).forEach(key => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = key;
                    select.appendChild(option);
                });

                optionCell.appendChild(select);
            } else {
                optionCell.textContent = '-';
            }
        }
        row.appendChild(optionCell);

        // 대상 열
        const targetCell = document.createElement('td');
        if (targetData) {
            targetCell.textContent = targetData.target;
            if (targetData.target === '메인 목표') {
                targetCell.style.color = '#d15252';
            } else if (targetData.target === '아군 전체') {
                targetCell.style.color = '#636be0';
            }
        }
        row.appendChild(targetCell);

        // 효과 값 열들
        const effectColumns = [
            '공격력 %', '공격력 상수', '크리티컬 확률', '크리티컬 효과',
            '대미지 보너스', '방어력 감소', '관통', '스킬 마스터',
            '독립 배수'
        ];

        effectColumns.forEach(effect => {
            const cell = document.createElement('td');
            cell.className = 'effect-value';
            cell.dataset.effect = effect;
            
            // 커스텀 버프인 경우 텍스트 입력 필드 추가
            if (buff.isCustom && targetData) {
                const effectData = targetData.effects.find(e => e.type === effect);
                if (effectData) {
                    const inputContainer = document.createElement('div');
                    inputContainer.className = 'custom-input-container';
                    
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.className = 'custom-buff-input';
                    input.value = effectData.value;
                    input.min = "0";
                    input.step = effect === '공격력 상수' || effect === '스킬 마스터' ? "1" : "0.1";
                    input.dataset.effect = effect;
                    input.dataset.buffId = buff.id;
                    input.dataset.character = character;
                    
                    // 입력 이벤트 리스너 추가
                    input.addEventListener('input', (e) => {
                        const value = parseFloat(e.target.value) || 0;
                        effectData.value = value;
                        
                        // 체크박스가 선택된 경우 버프 값 업데이트
                        const checkbox = document.querySelector(`.buff-checkbox[data-buff-id="${buff.id}"][data-character="${character}"]`);
                        if (checkbox && checkbox.checked) {
                            this.updateBuffValues();
                        }
                    });
                    
                    inputContainer.appendChild(input);
                    
                    // 첫 번째 셀에 초기화 버튼 추가 코드 제거
                    
                    cell.appendChild(inputContainer);
                    cell.style.opacity = '1';
                }
            } else {
                // 기존 로직
                if (targetData && targetData.effects) {
                    const effectData = targetData.effects.find(e => e.type === effect);
                    if (effectData) {
                        if (effect === '공격력 상수' || effect === '스킬 마스터') {
                            cell.textContent = effectData.value;
                        } else {
                            cell.textContent = effectData.value + '%';
                        }
                        cell.style.opacity = '1';
                    } else {
            if (effect === '공격력 상수' || effect === '스킬 마스터') {
                cell.textContent = '0';
            } else {
                cell.textContent = '0%';
            }
            cell.style.opacity = '0.1';
                    }
                } else {
                    if (effect === '공격력 상수' || effect === '스킬 마스터') {
                        cell.textContent = '0';
                    } else {
                        cell.textContent = '0%';
                    }
                    cell.style.opacity = '0.1';
                }
            }
            
            row.appendChild(cell);
        });

        // 지속시간 열
        const durationCell = document.createElement('td');
        if (targetData) {
            durationCell.textContent = targetData.duration || '';
        }
        row.appendChild(durationCell);

        // 비고 열
        const noteCell = document.createElement('td');
        if (targetData && targetData.note) {
            noteCell.textContent = targetData.note;
        } else if (isFirstRow && buff.note) {
            // 이전 버전과의 호환성을 위해 buff.note도 체크
            noteCell.textContent = buff.note;
        }
        
        // 커스텀 버프인 경우 비고 칸에 초기화 버튼 추가
        if (buff.isCustom && isFirstRow) {
            const resetButton = document.createElement('button');
            resetButton.className = 'custom-buff-reset';
            resetButton.textContent = '초기화';
            resetButton.dataset.buffId = buff.id;
            resetButton.dataset.character = character;
            
            resetButton.addEventListener('click', () => {
                // 모든 커스텀 입력 필드 초기화
                const inputs = document.querySelectorAll(`.custom-buff-input[data-buff-id="${buff.id}"][data-character="${character}"]`);
                inputs.forEach(input => {
                    input.value = 0;
                    // 해당 효과 데이터 업데이트
                    const effectType = input.dataset.effect;
                    const effectData = targetData.effects.find(e => e.type === effectType);
                    if (effectData) {
                        effectData.value = 0;
                    }
                });
                
                // 체크박스가 선택된 경우 버프 값 업데이트
                const checkbox = document.querySelector(`.buff-checkbox[data-buff-id="${buff.id}"][data-character="${character}"]`);
                if (checkbox && checkbox.checked) {
                    this.updateBuffValues();
                }
            });
            
            noteCell.appendChild(resetButton);
        }
        
        row.appendChild(noteCell);

        // 한정 조건 열
        const conditionCell = document.createElement('td');
        if (targetData && targetData.condition) {
            conditionCell.textContent = targetData.condition;
        }
        row.appendChild(conditionCell);

        return row;
    }

    createDealerBuffRow(buff, character, targetData = null, isFirstRow = true) {
        const row = document.createElement('tr');
        row.dataset.buffId = buff.id;
        row.dataset.character = character;
        if (targetData) {
            row.dataset.target = targetData.target;
        }

        // 체크박스 열
        const checkCell = document.createElement('td');
        if (isFirstRow) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'dealer-buff-checkbox';
            checkbox.dataset.buffId = buff.id;
            checkbox.dataset.character = character;
            checkCell.appendChild(checkbox);
        }
        row.appendChild(checkCell);

        // 스킬 아이콘 열
        const iconCell = document.createElement('td');
        if (isFirstRow) {
            const icon = document.createElement('img');
            icon.src = buff.skillIcon || '';
            icon.alt = buff.skillName;
            icon.className = 'skill-icon';
            iconCell.appendChild(icon);
        }
        row.appendChild(iconCell);

        // 스킬명 열
        const nameCell = document.createElement('td');
        if (isFirstRow) {
            nameCell.textContent = buff.skillName;
        }
        row.appendChild(nameCell);

        // 타입 열
        const typeCell = document.createElement('td');
        if (isFirstRow) {
            typeCell.textContent = buff.type;
        }
        row.appendChild(typeCell);

        // 옵션 열
        const optionCell = document.createElement('td');
        if (isFirstRow) {
            if (buff.options && Object.keys(buff.options).length > 0) {
                const select = document.createElement('select');
                select.className = 'dealer-buff-option';
                select.dataset.buffId = buff.id;
                select.dataset.character = character;

                Object.keys(buff.options).forEach(key => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = key;
                    select.appendChild(option);
                });

                // 커스텀 버프의 경우 옵션 변경 시 input 필드 값도 업데이트하는 이벤트 리스너 추가
                if (buff.isCustom) {
                    select.addEventListener('change', (e) => {
                        const selectedOption = e.target.value;
                        const previousOption = e.target.dataset.previousOption || selectedOption;
                        const buffId = e.target.dataset.buffId;
                        const character = e.target.dataset.character;
                        
                        // 현재 셀렉트된 타겟 가져오기
                        const target = 'target' in targetData ? targetData.target : '자신';
                        
                        // 입력 필드와 이전/현재 옵션 효과 가져오기
                        const inputs = document.querySelectorAll(`.custom-buff-input[data-buff-id="${buffId}"][data-character="${character}"]`);
                        const previousOptionEffects = buff.options[previousOption] && buff.options[previousOption][target] ? buff.options[previousOption][target] : {};
                        const newOptionEffects = buff.options[selectedOption] && buff.options[selectedOption][target] ? buff.options[selectedOption][target] : {};
                        
                        // 모든 효과 타입에 대해 처리
                        inputs.forEach(input => {
                            const effectType = input.dataset.effect;
                            const currentValue = parseFloat(input.value) || 0;
                            const previousOptionValue = previousOptionEffects[effectType] || 0;
                            const newOptionValue = newOptionEffects[effectType] || 0;
                            
                            // 이전 옵션 값을 빼고, 새 옵션 값을 더함
                            // 입력 값이 이전 옵션 값과 다른 경우는 사용자가 수동으로 값을 변경한 것으로 취급
                            if (Math.abs(currentValue - previousOptionValue) < 0.001) {
                                // 기존 값이 이전 옵션 값과 같다면 (사용자가 수정하지 않았다면) 새 옵션 값으로 바로 설정
                                input.value = newOptionValue;
                            } else {
                                // 사용자가 수정한 값에서 차이를 적용
                                input.value = Math.max(0, (currentValue - previousOptionValue + newOptionValue).toFixed(1));
                            }
                            
                            // 효과 데이터에도 값 업데이트
                            const effectData = targetData.effects.find(e => e.type === effectType);
                            if (effectData) {
                                effectData.value = parseFloat(input.value) || 0;
                            }
                        });
                        
                        // 현재 선택을 이전 선택으로 저장
                        e.target.dataset.previousOption = selectedOption;
                        
                        // 체크박스가 선택된 경우 버프 값 업데이트
                        const checkbox = document.querySelector(`.dealer-buff-checkbox[data-buff-id="${buff.id}"][data-character="${character}"]`);
                        if (checkbox && checkbox.checked) {
                            this.updateDealerBuffValues();
                        }
                    });
                    
                    // 초기 옵션 값 저장
                    select.dataset.previousOption = select.value;
                }

                optionCell.appendChild(select);
            } else {
                optionCell.textContent = '-';
            }
        }
        row.appendChild(optionCell);

        // 대상 열
        const targetCell = document.createElement('td');
        if (targetData) {
            targetCell.textContent = targetData.target;
            if (targetData.target === '메인 목표') {
                targetCell.style.color = '#d15252';
            } else if (targetData.target === '아군 전체') {
                targetCell.style.color = '#636be0';
            } else if (targetData.target === '자신') {
                targetCell.style.color = '#55ad3f';
            }
        }
        row.appendChild(targetCell);

        // 효과 값 열들
        const effectColumns = [
            '공격력 %', '공격력 상수', '크리티컬 확률', '크리티컬 효과',
            '대미지 보너스', '방어력 감소', '관통', '스킬 마스터',
            '독립 배수'
        ];

        effectColumns.forEach(effect => {
            const cell = document.createElement('td');
            cell.className = 'effect-value';
            cell.dataset.effect = effect;
            
            // 커스텀 버프인 경우 텍스트 입력 필드 추가
            if (buff.isCustom && targetData) {
                const effectData = targetData.effects.find(e => e.type === effect);
                if (effectData) {
                    const inputContainer = document.createElement('div');
                    inputContainer.className = 'custom-input-container';
                    
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.className = 'custom-buff-input';
                    input.value = effectData.value;
                    input.min = "0";
                    input.step = effect === '공격력 상수' || effect === '스킬 마스터' ? "1" : "0.1";
                    input.dataset.effect = effect;
                    input.dataset.buffId = buff.id;
                    input.dataset.character = character;
                    
                    // 입력 이벤트 리스너 추가
                    input.addEventListener('input', (e) => {
                        const value = parseFloat(e.target.value) || 0;
                        effectData.value = value;
                        
                        // 체크박스가 선택된 경우 버프 값 업데이트
                        const checkbox = document.querySelector(`.dealer-buff-checkbox[data-buff-id="${buff.id}"][data-character="${character}"]`);
                        if (checkbox && checkbox.checked) {
                            this.updateDealerBuffValues();
                        }
                    });
                    
                    inputContainer.appendChild(input);
                    cell.appendChild(inputContainer);
                    cell.style.opacity = '1';
                }
            } else {
                // 기존 로직
                if (targetData && targetData.effects) {
                    const effectData = targetData.effects.find(e => e.type === effect);
                    if (effectData) {
                        if (effect === '공격력 상수' || effect === '스킬 마스터') {
                            cell.textContent = effectData.value;
                        } else {
                            cell.textContent = effectData.value + '%';
                        }
                        cell.style.opacity = '1';
                    } else {
                        if (effect === '공격력 상수' || effect === '스킬 마스터') {
                            cell.textContent = '0';
                        } else {
                            cell.textContent = '0%';
                        }
                        cell.style.opacity = '0.1';
                    }
                } else {
                    if (effect === '공격력 상수' || effect === '스킬 마스터') {
                        cell.textContent = '0';
                    } else {
                        cell.textContent = '0%';
                    }
                    cell.style.opacity = '0.1';
                }
            }
            
            row.appendChild(cell);
        });

        // 지속시간 열
        const durationCell = document.createElement('td');
        if (targetData) {
            durationCell.textContent = targetData.duration || '';
        }
        row.appendChild(durationCell);

        // 비고 열
        const noteCell = document.createElement('td');
        if (targetData && targetData.note) {
            noteCell.textContent = targetData.note;
        } else if (isFirstRow && buff.note) {
            // 이전 버전과의 호환성을 위해 buff.note도 체크
            noteCell.textContent = buff.note;
        }
        
        // 커스텀 버프인 경우 비고 칸에 초기화 버튼 추가
        if (buff.isCustom && isFirstRow) {
            const resetButton = document.createElement('button');
            resetButton.className = 'custom-buff-reset';
            resetButton.textContent = '초기화';
            resetButton.dataset.buffId = buff.id;
            resetButton.dataset.character = character;
            
            resetButton.addEventListener('click', () => {
                // 모든 커스텀 입력 필드 초기화
                const inputs = document.querySelectorAll(`.custom-buff-input[data-buff-id="${buff.id}"][data-character="${character}"]`);
                inputs.forEach(input => {
                    input.value = 0;
                    // 해당 효과 데이터 업데이트
                    const effectType = input.dataset.effect;
                    const effectData = targetData.effects.find(e => e.type === effectType);
                    if (effectData) {
                        effectData.value = 0;
                    }
                });
                
                // 체크박스가 선택된 경우 버프 값 업데이트
                const checkbox = document.querySelector(`.dealer-buff-checkbox[data-buff-id="${buff.id}"][data-character="${character}"]`);
                if (checkbox && checkbox.checked) {
                    this.updateDealerBuffValues();
                }
            });
            
            noteCell.appendChild(resetButton);
        }
        
        row.appendChild(noteCell);

        // 한정 조건 열
        const conditionCell = document.createElement('td');
        if (targetData && targetData.condition) {
            conditionCell.textContent = targetData.condition;
        }
        row.appendChild(conditionCell);

        return row;
    }

    initEventListeners() {
        // 메인 탭 전환 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('main-tab-button')) {
                const tabType = e.target.dataset.tab;
                
                // 모든 메인 탭 버튼에서 active 클래스 제거
                document.querySelectorAll('.main-tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 클릭한 메인 탭 버튼에 active 클래스 추가
                e.target.classList.add('active');
                
                // 모든 메인 탭 컨텐츠에서 active 클래스 제거
                document.querySelectorAll('.main-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 해당 메인 탭 컨텐츠에 active 클래스 추가
                document.getElementById(`${tabType}-tab-content`).classList.add('active');
                
                // 조건 탭 표시/숨김 처리
                const buffConditionTabs = document.querySelector('.buff-condition-tabs-container');
                const dealerConditionTabs = document.querySelector('.dealer-condition-tabs-container');
                
                if (tabType === 'buff') {
                    // 버퍼 탭이 선택된 경우
                    if (buffConditionTabs) buffConditionTabs.style.display = 'block';
                    if (dealerConditionTabs) dealerConditionTabs.style.display = 'none';
                    
                    // 버퍼 탭의 첫 번째 캐릭터 선택
                    const firstBufferTab = document.querySelector('.table-tabs .tab-buttons .tab-button');
                    if (firstBufferTab) {
                        firstBufferTab.click();
                    }
                } else if (tabType === 'dealer') {
                    // 딜러 탭이 선택된 경우
                    if (buffConditionTabs) buffConditionTabs.style.display = 'none';
                    if (dealerConditionTabs) dealerConditionTabs.style.display = 'block';
                    
                    // 딜러 탭의 첫 번째 캐릭터 선택
                    const firstDealerTab = document.querySelector('.dealer-table-tabs .tab-buttons .tab-button');
                    if (firstDealerTab) {
                        firstDealerTab.click();
                    }
                }
            }
        });

        // 탭 버튼 이벤트 리스너
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                // 활성화된 탭 버튼 변경
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                // 활성화된 탭 컨텐츠 변경
                const tabId = button.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });

        // 체크박스 이벤트 리스너
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('condition-check')) {
                // buff-condition-check와 dealer-condition-check 처리는 해당 createConditionTabs 함수 내에서 처리됨
                return;
            }
            
            if (e.target.classList.contains('buff-checkbox')) {
                const buffId = e.target.dataset.buffId;
                const character = e.target.dataset.character;
                const rows = document.querySelectorAll(`tr[data-buff-id="${buffId}"][data-character="${character}"]`);
                
                if (e.target.checked) {
                    this.selectedBuffs.add(buffId);
                    rows.forEach(row => row.classList.add('selected'));
                } else {
                    this.selectedBuffs.delete(buffId);
                    rows.forEach(row => row.classList.remove('selected'));
                }
                this.updateBuffValues();
                
                // 캐릭터 탭 버튼 체크 표시 업데이트
                this.updateCharacterTabCheckmarks();
            }
        });

        // 옵션 선택 이벤트 리스너
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('buff-option')) {
                const buffId = e.target.dataset.buffId;
                const character = e.target.dataset.character;
                const rows = document.querySelectorAll(`tr[data-buff-id="${buffId}"][data-character="${character}"]`);
                rows.forEach(row => {
                    this.updateEffectValues(row, buffId);
                });
            }
        });

        // 전체 선택 체크박스 이벤트
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('select-all-checkbox')) {
                const character = e.target.dataset.character;
                const isChecked = e.target.checked;
                const checkboxes = document.querySelectorAll(`tr[data-character="${character}"] .buff-checkbox`);
                
                checkboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                    const buffId = checkbox.dataset.buffId;
                    const rows = document.querySelectorAll(`tr[data-buff-id="${buffId}"][data-character="${character}"]`);
                    
                    if (isChecked) {
                        this.selectedBuffs.add(buffId);
                        rows.forEach(row => row.classList.add('selected'));
                    } else {
                        this.selectedBuffs.delete(buffId);
                        rows.forEach(row => row.classList.remove('selected'));
                    }
                });
                
                this.updateBuffValues();
            }
        });

        // 리코 매화 크리티컬 효과 입력 이벤트 리스너
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('crit-input')) {
                const character = e.target.dataset.character;
                const critValue = parseFloat(e.target.value) || 100;
                
                // 만개 버프 효과 업데이트
                const mankaeBuff = BUFF_DATA[character].find(buff => buff.id === '리코·매화 만개');
                if (mankaeBuff) {
                    const attackPercent = (critValue - 100) * 0.08;
                    const critEffect = (critValue - 100) * 0.10;
                    
                    mankaeBuff.targets[0].effects = [
                        { type: '공격력 상수', value: 300 },
                        { type: '공격력 %', value: attackPercent },
                        { type: '크리티컬 효과', value: critEffect }
                    ];

                    // 의식2의 만개 크효 2배 효과도 업데이트
                    const ritual2Buff = BUFF_DATA[character].find(buff => buff.id === '리코·매화 의식2');
                    if (ritual2Buff) {
                        const targetWithMankaeEffect = ritual2Buff.targets.find(t => t.note === '만개 크효 2배');
                        if (targetWithMankaeEffect) {
                            targetWithMankaeEffect.effects = [
                                { type: '크리티컬 효과', value: critEffect }
                            ];
                        }
                    }

                    const ritual2Buff2 = BUFF_DATA[character].find(buff => buff.id === '리코·매화 의식2 (의식6)');
                    if (ritual2Buff2) {
                        const targetWithMankaeEffect = ritual2Buff2.targets.find(t => t.note === '만개 크효 2배');
                        if (targetWithMankaeEffect) {
                            targetWithMankaeEffect.effects = [
                                { type: '크리티컬 효과', value: critEffect }
                            ];
                        }
                    }

                    // 테이블의 값 업데이트
                    const rows = document.querySelectorAll(`tr[data-buff-id="리코·매화 만개"][data-character="${character}"]`);
                    rows.forEach(row => {
                        const attackCell = row.querySelector('[data-effect="공격력 %"]');
                        const critCell = row.querySelector('[data-effect="크리티컬 효과"]');
                        if (attackCell) {
                            attackCell.textContent = `${attackPercent.toFixed(1)}%`;
                            attackCell.style.opacity = attackPercent === 0 ? '0.1' : '1';
                        }
                        if (critCell) {
                            critCell.textContent = `${critEffect.toFixed(1)}%`;
                            critCell.style.opacity = critEffect === 0 ? '0.1' : '1';
                        }
                    });

                    // 의식2의 만개 크효 2배 행도 업데이트
                    const ritual2Rows = document.querySelectorAll(`tr[data-buff-id="리코·매화 의식2"][data-character="${character}"], tr[data-buff-id="리코·매화 의식2 (의식6)"][data-character="${character}"]`);
                    ritual2Rows.forEach(row => {
                        const noteCell = row.querySelector('td:nth-last-child(2)');
                        if (noteCell && noteCell.textContent === '만개 크효 2배') {
                            const critCell = row.querySelector('[data-effect="크리티컬 효과"]');
                            if (critCell) {
                                critCell.textContent = `${critEffect.toFixed(1)}%`;
                                critCell.style.opacity = critEffect === 0 ? '0.1' : '1';
                            }
                        }
                    });

                    // 선택된 상태라면 버프 값 업데이트
                    if (this.selectedBuffs.has('리코·매화 만개') || 
                        this.selectedBuffs.has('리코·매화 의식2') || 
                        this.selectedBuffs.has('리코·매화 의식2 (의식6)')) {
                        this.updateBuffValues();
                    }
                }
            }
        });

        // 아케치 스킬 타입 선택 이벤트 리스너
        document.addEventListener('change', (e) => {
            if (e.target.name && e.target.name.startsWith('skill-type-아케치')) {
                this.updateAkechiSkill3IndependentMultiplier();
            }
        });

        // 의식/개조 체크박스 이벤트 리스너 수정
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('ritual-mod-checkbox')) {
                // 딜러 탭의 의식/개조 체크박스는 별도 처리
                if (e.target.classList.contains('dealer-ritual-mod-checkbox')) {
                    return;
                }
                
                const character = e.target.name.split('-')[1];
                const type = e.target.name.startsWith('ritual-') ? 'ritual' : 'mod';
                const level = parseInt(e.target.value);

                // 같은 그룹의 다른 체크박스들 해제
                const otherCheckboxes = document.querySelectorAll(`.ritual-mod-checkbox[name="${e.target.name}"]`);
                otherCheckboxes.forEach(checkbox => {
                    if (checkbox !== e.target) {
                        checkbox.checked = false;
                    }
                });

                // 체크 해제된 경우
                if (!e.target.checked) {
                    // 이전에 선택된 버프들 해제
                    const prevBuffs = RITUAL_DATA[character][type === 'ritual' ? 'rituals' : 'modifications'][level];
                    Object.entries(prevBuffs).forEach(([buffId, value]) => {
                        const checkbox = document.querySelector(`.buff-checkbox[data-buff-id="${buffId}"][data-character="${character}"]`);
                        if (checkbox) {
                            checkbox.checked = false;
                            this.selectedBuffs.delete(buffId);
                            const rows = document.querySelectorAll(`tr[data-buff-id="${buffId}"][data-character="${character}"]`);
                            rows.forEach(row => row.classList.remove('selected'));
                        }
                    });

                    // 아케치 스킬3의 독립 배수 업데이트
                    if (character === '아케치') {
                        this.updateAkechiSkill3IndependentMultiplier();
                    }

                    this.updateBuffValues();
                    
                    // 캐릭터 탭 체크 표시 업데이트
                    this.updateCharacterTabCheckmarks();
                    return;
                }

                // 새로운 버프들 선택
                const newBuffs = RITUAL_DATA[character][type === 'ritual' ? 'rituals' : 'modifications'][level];
                Object.entries(newBuffs).forEach(([buffId, value]) => {
                    const checkbox = document.querySelector(`.buff-checkbox[data-buff-id="${buffId}"][data-character="${character}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        this.selectedBuffs.add(buffId);
                        const rows = document.querySelectorAll(`tr[data-buff-id="${buffId}"][data-character="${character}"]`);
                        rows.forEach(row => {
                            row.classList.add('selected');
                            // 옵션 업데이트
                            const optionSelect = row.querySelector('.buff-option');
                            if (optionSelect) {
                                // 이전 옵션 값 저장
                                const prevValue = optionSelect.value;
                                // 새 옵션 값 설정
                                optionSelect.value = value || optionSelect.value;
                                
                                // 값이 변경되었다면 change 이벤트 발생
                                if (prevValue !== optionSelect.value) {
                                    // 변경 이벤트 발생시켜 옵션 변경 로직 실행
                                    const changeEvent = new Event('change', { bubbles: true });
                                    optionSelect.dispatchEvent(changeEvent);
                                } else {
                                    // 값이 변경되지 않았더라도 효과 값 업데이트
                                    this.updateEffectValues(row, buffId);
                                }
                            }
                        });
                    }
                });

                // 아케치 스킬3의 독립 배수 업데이트
                if (character === '아케치') {
                    this.updateAkechiSkill3IndependentMultiplier();
                }

                this.updateBuffValues();
                
                // 캐릭터 탭 체크 표시 업데이트
                this.updateCharacterTabCheckmarks();
            }
        });

        // 딜러 탭 의식/개조 체크박스 이벤트 리스너
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('dealer-ritual-mod-checkbox')) {
                // dealer-ritual-아케치 또는 dealer-mod-아케치 같은 형식에서 이름 추출
                const nameParts = e.target.name.split('-');
                const character = nameParts[2]; // dealer-ritual-CHARACTER 또는 dealer-mod-CHARACTER
                const type = nameParts[1] === 'ritual' ? 'ritual' : 'mod';
                const level = parseInt(e.target.value);

                // 같은 그룹의 다른 체크박스들 해제
                const otherCheckboxes = document.querySelectorAll(`.dealer-ritual-mod-checkbox[name="${e.target.name}"]`);
                otherCheckboxes.forEach(checkbox => {
                    if (checkbox !== e.target) {
                        checkbox.checked = false;
                    }
                });

                // 체크 해제된 경우
                if (!e.target.checked) {
                    // 이전에 선택된 버프들 해제
                    const prevBuffs = RITUAL_DATA[character][type === 'ritual' ? 'rituals' : 'modifications'][level];
                    Object.entries(prevBuffs).forEach(([buffId, value]) => {
                        const checkbox = document.querySelector(`.dealer-buff-checkbox[data-buff-id="${buffId}"][data-character="${character}"]`);
                        if (checkbox) {
                            checkbox.checked = false;
                            this.selectedDealerBuffs.delete(buffId);
                            const rows = document.querySelectorAll(`tr[data-buff-id="${buffId}"][data-character="${character}"]`);
                            rows.forEach(row => row.classList.remove('selected'));
                        }
                    });

                    this.updateDealerBuffValues();
                    return;
                }

                // 새로운 버프들 선택
                const newBuffs = RITUAL_DATA[character][type === 'ritual' ? 'rituals' : 'modifications'][level];
                Object.entries(newBuffs).forEach(([buffId, value]) => {
                    // BUFF_DATA_DEALER에서 해당 캐릭터와 buffId에 매칭되는 버프가 있는지 확인
                    if (BUFF_DATA_DEALER[character] && BUFF_DATA_DEALER[character].some(buff => buff.id === buffId)) {
                        const checkbox = document.querySelector(`.dealer-buff-checkbox[data-buff-id="${buffId}"][data-character="${character}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                            this.selectedDealerBuffs.add(buffId);
                            const rows = document.querySelectorAll(`tr[data-buff-id="${buffId}"][data-character="${character}"]`);
                            rows.forEach(row => {
                                row.classList.add('selected');
                                // 옵션 업데이트
                                const optionSelect = row.querySelector('.dealer-buff-option');
                                if (optionSelect) {
                                    // 이전 옵션 값 저장
                                    const prevValue = optionSelect.value;
                                    // 새 옵션 값 설정
                                    optionSelect.value = value || optionSelect.value;
                                    
                                    // 값이 변경되었다면 change 이벤트 발생
                                    if (prevValue !== optionSelect.value) {
                                        // 변경 이벤트 발생시켜 옵션 변경 로직 실행
                                        const changeEvent = new Event('change', { bubbles: true });
                                        optionSelect.dispatchEvent(changeEvent);
                                    } else {
                                        // 값이 변경되지 않았더라도 효과 값 업데이트
                                        this.updateDealerEffectValues(row, buffId);
                                    }
                                }
                            });
                        }
                    }
                });

                this.updateDealerBuffValues();
                
                // 딜러 캐릭터 탭 체크 표시 업데이트
                this.updateDealerCharacterTabCheckmarks();
            }
        });

        // 딜러 버프 체크박스 이벤트 리스너
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('dealer-buff-checkbox')) {
                const buffId = e.target.dataset.buffId;
                const character = e.target.dataset.character;
                const rows = document.querySelectorAll(`tr[data-buff-id="${buffId}"][data-character="${character}"]`);
                
                if (e.target.checked) {
                    this.selectedDealerBuffs.add(buffId);
                    rows.forEach(row => row.classList.add('selected'));
                } else {
                    this.selectedDealerBuffs.delete(buffId);
                    rows.forEach(row => row.classList.remove('selected'));
                }
                this.updateDealerBuffValues();
                
                // 딜러 캐릭터 탭 체크 표시 업데이트
                this.updateDealerCharacterTabCheckmarks();
            }
        });

        // 딜러 버프 옵션 선택 이벤트 리스너
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('dealer-buff-option')) {
                const buffId = e.target.dataset.buffId;
                const character = e.target.dataset.character;
                const rows = document.querySelectorAll(`tr[data-buff-id="${buffId}"][data-character="${character}"]`);
                rows.forEach(row => {
                    this.updateDealerEffectValues(row, buffId);
                });
                this.updateDealerBuffValues();
            }
        });

        // 딜러 탭 전환 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dealer-table-tabs .tab-buttons .tab-button')) {
                const button = e.target.closest('.tab-button');
                const tabName = button.dataset.tab;
                
                // 모든 탭 버튼에서 active 클래스 제거
                document.querySelectorAll('.dealer-table-tabs .tab-buttons .tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 클릭한 탭 버튼에 active 클래스 추가
                button.classList.add('active');
                
                // 모든 탭 컨텐츠에서 active 클래스 제거
                document.querySelectorAll('.dealer-table-tabs .tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 해당 탭 컨텐츠에 active 클래스 추가
                document.getElementById(`dealer-${tabName}-tab`).classList.add('active');
            }
        });

        // 기존 탭 전환 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.closest('.table-tabs .tab-buttons .tab-button')) {
                const button = e.target.closest('.tab-button');
                const tabName = button.dataset.tab;
                
                // 모든 탭 버튼에서 active 클래스 제거
                document.querySelectorAll('.table-tabs .tab-buttons .tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 클릭한 탭 버튼에 active 클래스 추가
                button.classList.add('active');
                
                // 모든 탭 컨텐츠에서 active 클래스 제거
                document.querySelectorAll('.table-tabs .tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 해당 탭 컨텐츠에 active 클래스 추가
                document.getElementById(`${tabName}-tab`).classList.add('active');
            }
        });
    }

    updateEffectValues(row, buffId) {
        const character = row.dataset.character;
        const target = row.dataset.target;
        const buff = BUFF_DATA[character].find(b => b.id === buffId);
        if (!buff) return;

        const optionSelect = row.querySelector('.buff-option');
        if (!optionSelect) return;  // 옵션이 없는 경우 처리하지 않음

        const selectedOptionKey = optionSelect.value;
        const selectedOption = buff.options[selectedOptionKey];
        
        if (selectedOption && target && selectedOption[target]) {
            // 버프 데이터 업데이트
            const targetData = buff.targets.find(t => t.target === target);
            if (targetData) {
                targetData.effects = Object.entries(selectedOption[target]).map(([type, value]) => ({
                    type,
                    value
                }));
            }

            // 모든 효과 값을 0으로 초기화
            const effectCells = row.querySelectorAll('[data-effect]');
            effectCells.forEach(cell => {
                cell.textContent = cell.dataset.effect === '공격력 상수' ? '0' : '0%';
                cell.style.opacity = '0.1';
            });

            // 선택된 옵션의 효과 값으로 업데이트
            Object.entries(selectedOption[target]).forEach(([effectType, value]) => {
                const cell = row.querySelector(`[data-effect="${effectType}"]`);
                if (cell) {
                    const displayValue = effectType === '공격력 상수' ? value : `${value}%`;
                    cell.textContent = displayValue;
                    cell.style.opacity = value === 0 ? '0.1' : '1';
                }
            });

            // 같은 버프 ID를 가진 다른 행들도 업데이트
            const otherRows = document.querySelectorAll(`tr[data-buff-id="${buffId}"][data-character="${character}"]`);
            otherRows.forEach(otherRow => {
                if (otherRow !== row) {
                    const otherTarget = otherRow.dataset.target;
                    if (otherTarget && selectedOption[otherTarget]) {
                        const otherTargetData = buff.targets.find(t => t.target === otherTarget);
                        if (otherTargetData) {
                            otherTargetData.effects = Object.entries(selectedOption[otherTarget]).map(([type, value]) => ({
                                type,
                                value
                            }));
                        }

                        // 다른 행의 효과 값도 업데이트
                        const otherEffectCells = otherRow.querySelectorAll('[data-effect]');
                        otherEffectCells.forEach(cell => {
                            cell.textContent = cell.dataset.effect === '공격력 상수' ? '0' : '0%';
                            cell.style.opacity = '0.1';
                        });

                        Object.entries(selectedOption[otherTarget]).forEach(([effectType, value]) => {
                            const cell = otherRow.querySelector(`[data-effect="${effectType}"]`);
                            if (cell) {
                                const displayValue = effectType === '공격력 상수' ? value : `${value}%`;
                                cell.textContent = displayValue;
                                cell.style.opacity = value === 0 ? '0.1' : '1';
                            }
                        });
                    }
                }
            });
        }

        // 버프 값 업데이트
        this.updateBuffValues();
    }

    updateDealerEffectValues(row, buffId) {
        const character = row.dataset.character;
        const target = row.dataset.target;
        const buffs = BUFF_DATA_DEALER[character] || [];
        const buff = buffs.find(b => b.id === buffId);
        
        if (!buff || !buff.targets) return;
        
        // 해당 target과 일치하는 targetData 찾기
        const targetData = buff.targets.find(t => t.target === target);
        if (!targetData) return;
        
        // 커스텀 버프인 경우 입력 필드는 수정하지 않음
        if (buff.isCustom) {
            return;
        }
        
        // 이 아래 로직은 일반 버프에만 적용됨
        
        // 옵션 선택 확인
        let effectValues = {};
        if (buff.options && Object.keys(buff.options).length > 0) {
            const select = document.querySelector(`.dealer-buff-option[data-buff-id="${buffId}"][data-character="${character}"]`);
            const selectedOption = select ? select.value : Object.keys(buff.options)[0];
            
            // 해당 옵션에서 대상과 일치하는 효과 값 찾기
            const optionTargets = buff.options[selectedOption];
            if (optionTargets && optionTargets[target]) {
                effectValues = optionTargets[target];
            }
        } else {
            // 옵션이 없는 경우 targetData의 effects 사용
            if (targetData.effects) {
                targetData.effects.forEach(effect => {
                    effectValues[effect.type] = effect.value;
                });
            }
        }
        
        // 효과 값을 화면에 표시 (일반 버프만 처리)
        const effectCells = row.querySelectorAll('.effect-value');
        effectCells.forEach(cell => {
            const effectType = cell.dataset.effect;
            const value = effectValues[effectType];
            
            if (value !== undefined) {
                if (effectType === '공격력 상수' || effectType === '스킬 마스터') {
                    cell.textContent = value;
                } else {
                    cell.textContent = value + '%';
                }
                cell.style.opacity = '1';
            } else {
                if (effectType === '공격력 상수' || effectType === '스킬 마스터') {
                    cell.textContent = '0';
                } else {
                    cell.textContent = '0%';
                }
                cell.style.opacity = '0.1';
            }
        });
    }

    updateBuffValues() {
        // 모든 한정 조건 수집
        const conditions = new Set(['전체', '공용']);
        this.selectedBuffs.forEach(buffId => {
            Object.entries(BUFF_DATA).forEach(([character, buffs]) => {
                const buff = buffs.find(b => b.id === buffId);
                if (buff && buff.targets) {
                    buff.targets.forEach(target => {
                        if (target.condition) {
                            conditions.add(target.condition);
                        }
                    });
                }
            });
        });

        // 각 조건별로 버프 값 계산
        const allValues = {};
        conditions.forEach(condition => {
            allValues[condition] = {
                main: this.calculateBuffValues(condition, true),
                ally: this.calculateBuffValues(condition, false)
            };
        });

        // 현재 값 저장
        this.currentValues = allValues;

        // 전체 체크박스 상태 확인
        const isTotalChecked = document.querySelector('.condition-check[data-condition="전체"]')?.checked;

        // 조건별 탭 생성
        this.createConditionTabs(Array.from(conditions), isTotalChecked);

        // 초기값 설정 - 전체 선택된 상태로 시작
        const initialValues = {
            main: this.calculateCombinedValues(['전체'], true),
            ally: this.calculateCombinedValues(['전체'], false)
        };

        // UI 업데이트 - 메인 목표와 아군 전체 모두 업데이트
        this.updateBuffValueDisplay(initialValues, '전체', true);  // 메인 목표
        this.updateBuffValueDisplay(initialValues, '전체', false); // 아군 전체
    }

    calculateCombinedValues(selectedConditions, isMain) {
        const values = {
            '공격력 %': 0,
            '공격력 상수': 0,
            '크리티컬 확률': 0,
            '크리티컬 효과': 0,
            '대미지 보너스': 0,
            '방어력 감소': 0,
            '관통': 0,
            '스킬 마스터': 0,
            '독립 배수': 1  // 초기값을 1로 설정
        };

        // 전체가 선택된 경우 모든 버프의 값을 합산
        if (selectedConditions.includes('전체')) {
            this.selectedBuffs.forEach(buffId => {
                Object.entries(BUFF_DATA).forEach(([character, buffs]) => {
                    const buff = buffs.find(b => b.id === buffId);
                    if (buff && buff.targets) {
                        buff.targets.forEach(target => {
                            if (isMain && (target.target === '메인 목표' || target.target === '아군 전체')) {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        if (effect.type === '독립 배수') {
                                            values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                        } else {
                                            values[effect.type] += parseFloat(effect.value);
                                        }
                                    }
                                });
                            } else if (!isMain && target.target === '아군 전체') {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        if (effect.type === '독립 배수') {
                                            values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                        } else {
                                            values[effect.type] += parseFloat(effect.value);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } else {
            // 선택된 조건들에 대해서만 버프 값을 합산
            this.selectedBuffs.forEach(buffId => {
                Object.entries(BUFF_DATA).forEach(([character, buffs]) => {
                    const buff = buffs.find(b => b.id === buffId);
                    if (buff && buff.targets) {
                        buff.targets.forEach(target => {
                            // 공용 버프는 공용 조건이 선택된 경우에만 포함
                            if (selectedConditions.includes('공용') && !target.condition) {
                                if (isMain && (target.target === '메인 목표' || target.target === '아군 전체')) {
                                    target.effects.forEach(effect => {
                                        if (values.hasOwnProperty(effect.type)) {
                                            if (effect.type === '독립 배수') {
                                                values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                            } else {
                                                values[effect.type] += parseFloat(effect.value);
                                            }
                                        }
                                    });
                                } else if (!isMain && target.target === '아군 전체') {
                                    target.effects.forEach(effect => {
                                        if (values.hasOwnProperty(effect.type)) {
                                            if (effect.type === '독립 배수') {
                                                values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                            } else {
                                                values[effect.type] += parseFloat(effect.value);
                                            }
                                        }
                                    });
                                }
                            }
                            // 특정 조건의 버프는 해당 조건이 선택된 경우에만 포함
                            else if (target.condition && selectedConditions.includes(target.condition)) {
                                if (isMain && (target.target === '메인 목표' || target.target === '아군 전체')) {
                                    target.effects.forEach(effect => {
                                        if (values.hasOwnProperty(effect.type)) {
                                            if (effect.type === '독립 배수') {
                                                values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                            } else {
                                                values[effect.type] += parseFloat(effect.value);
                                            }
                                        }
                                    });
                                } else if (!isMain && target.target === '아군 전체') {
                                    target.effects.forEach(effect => {
                                        if (values.hasOwnProperty(effect.type)) {
                                            if (effect.type === '독립 배수') {
                                                values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                            } else {
                                                values[effect.type] += parseFloat(effect.value);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
        }

        // 독립 배수를 퍼센트로 변환
        values['독립 배수'] = (values['독립 배수'] - 1) * 100;

        return values;
    }

    calculateBuffValues(condition, isMain) {
        const values = {
            '공격력 %': 0,
            '공격력 상수': 0,
            '크리티컬 확률': 0,
            '크리티컬 효과': 0,
            '대미지 보너스': 0,
            '방어력 감소': 0,
            '관통': 0,
            '스킬 마스터': 0,
            '독립 배수': 0
        };

        this.selectedBuffs.forEach(buffId => {
            Object.entries(BUFF_DATA).forEach(([character, buffs]) => {
                const buff = buffs.find(b => b.id === buffId);
                if (buff && buff.targets) {
                    buff.targets.forEach(target => {
                        // 메인 목표인 경우 (아군 전체 버프 포함)
                        if (isMain) {
                            // 전체 탭인 경우 모든 버프 포함
                            if (condition === '전체' && (target.target === '메인 목표' || target.target === '아군 전체')) {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                            // 공용 버프는 공용 탭에서만 포함
                            else if (condition === '공용' && !target.condition && (target.target === '메인 목표' || target.target === '아군 전체')) {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                            // 한정 조건이 있는 경우, 해당 조건의 버프만 포함
                            else if (condition && target.condition === condition && (target.target === '메인 목표' || target.target === '아군 전체')) {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                        }
                        // 아군 전체인 경우
                        else {
                            // 전체 탭인 경우 모든 버프 포함
                            if (condition === '전체' && target.target === '아군 전체') {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                            // 공용 버프는 공용 탭에서만 포함
                            else if (condition === '공용' && !target.condition && target.target === '아군 전체') {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                            // 한정 조건이 있는 경우, 해당 조건의 버프만 포함
                            else if (condition && target.condition === condition && target.target === '아군 전체') {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });

        return values;
    }

    updateBuffValueDisplay(values, selectedCondition = '전체', isMain = true) {
        const idMapping = {
            '공격력 %': 'AttackPercent',
            '공격력 상수': 'AttackFlat',
            '크리티컬 확률': 'CritRate',
            '크리티컬 효과': 'CritDamage',
            '대미지 보너스': 'DamageBonus',
            '방어력 감소': 'DefenseReduce',
            '관통': 'Penetrate',
            '스킬 마스터': 'SkillMaster',
            '독립 배수': 'IndependentMultiplier'
        };

        const prefix = isMain ? 'main' : 'ally';
        const currentValues = values[isMain ? 'main' : 'ally'];

        Object.entries(currentValues).forEach(([effect, value]) => {
            const element = document.getElementById(`${prefix}${idMapping[effect]}`);
            if (element) {
                let displayValue;
                if (effect === '공격력 상수' || effect === '스킬 마스터') {
                    displayValue = value.toFixed(0);
                } else {
                    displayValue = value.toFixed(1) + '%';
                }
                element.textContent = displayValue;
                element.style.opacity = value === 0 ? '0.1' : '1';
            }
        });
        
        // 딜러 총합 값 업데이트
        this.updateTotalValues();
    }

    // 아케치 스킬3의 독립 배수 업데이트 함수 추가
    updateAkechiSkill3IndependentMultiplier() {
        const skill3Buff = BUFF_DATA['아케치'].find(buff => buff.id === '아케치 스킬3');
        if (!skill3Buff) return;

        const isSingle = document.querySelector('input[name="skill-type-아케치"][value="single"]')?.checked;
        const ritual6Checked = document.querySelector('input[name="ritual-아케치"][value="6"]')?.checked;

        // 모든 옵션에 대해 독립 배수 업데이트
        Object.keys(skill3Buff.options).forEach(optionKey => {
            const option = skill3Buff.options[optionKey];
            Object.keys(option).forEach(targetKey => {
                const effects = option[targetKey];
                const independentEffect = effects['독립 배수'];
                if (independentEffect) {
                    // 기본값 저장 (아직 저장되지 않은 경우)
                    if (!effects._originalIndependent) {
                        effects._originalIndependent = independentEffect;
                    }

                    // 독립 배수 계산
                    let newValue = effects._originalIndependent;
                    if (isSingle) {
                        newValue *= 0.4;
                    }
                    if (ritual6Checked) {
                        newValue *= 1.5;
                    }

                    effects['독립 배수'] = Math.round(newValue * 10) / 10; // 소수점 1자리까지 반올림
                }
            });
        });

        // 테이블의 값 즉시 업데이트
        const rows = document.querySelectorAll(`tr[data-buff-id="아케치 스킬3"][data-character="아케치"]`);
        rows.forEach(row => {
            const optionSelect = row.querySelector('.buff-option');
            if (optionSelect) {
                this.updateEffectValues(row, '아케치 스킬3');
            }
        });

        // 선택된 버프라면 전체 값 업데이트
        if (this.selectedBuffs.has('아케치 스킬3')) {
            this.updateBuffValues();
        }
    }

    updateDealerBuffValues() {
        const conditions = new Set(['전체', '공용']); // 기본 조건 추가
        const allValues = {};

        // 선택된 버프에서 조건 수집
        this.selectedDealerBuffs.forEach(buffId => {
            Object.entries(BUFF_DATA_DEALER).forEach(([character, buffs]) => {
                const buff = buffs.find(b => b.id === buffId);
                if (buff && buff.targets) {
                    buff.targets.forEach(target => {
                        if (target.condition) {
                            conditions.add(target.condition);
                        }
                    });
                }
            });
        });

        // 각 조건에 대한 버프 값 계산
        Array.from(conditions).forEach(condition => {
            allValues[condition] = {
                dealer: this.calculateDealerBuffValues(condition),
                // 아군 전체에도 영향을 주는 딜러 버프 계산
                ally: this.calculateDealerAllyBuffValues(condition)
            };
        });

        // 현재 값 저장
        this.currentDealerValues = allValues;

        // 전체 체크박스 상태 확인
        const isTotalChecked = document.querySelector('.dealer-condition-check[data-condition="전체"]')?.checked;

        // 조건별 탭 생성 (딜러용 조건 탭 생성)
        this.createDealerConditionTabs(Array.from(conditions), isTotalChecked);

        // 초기값 설정 - 전체 선택된 상태로 시작
        const initialValues = {
            dealer: this.calculateDealerCombinedValues(['전체']),
            ally: this.calculateDealerAllyCombinedValues(['전체'])
        };

        // UI 업데이트 - 딜러 값 업데이트
        this.updateDealerBuffValueDisplay(initialValues, '전체');
        // 아군 전체 카드에도 딜러 버프 값 업데이트
        this.updateDealerAllyBuffValueDisplay(initialValues, '전체');
    }

    calculateDealerCombinedValues(selectedConditions) {
        // 기본 버프 값 초기화
        const values = {
            '공격력 %': 0,
            '공격력 상수': 0,
            '크리티컬 확률': 0,
            '크리티컬 효과': 0,
            '대미지 보너스': 0,
            '방어력 감소': 0,
            '관통': 0,
            '스킬 마스터': 0,
            '독립 배수': 1
        };

        // 전체 조건이 선택된 경우
        if (selectedConditions.includes('전체')) {
            // 모든 버프의 효과 합산
            this.selectedDealerBuffs.forEach(buffId => {
                Object.entries(BUFF_DATA_DEALER).forEach(([character, buffs]) => {
                    const buff = buffs.find(b => b.id === buffId);
                    if (buff && buff.targets) {
                        buff.targets.forEach(target => {
                            // '자신' 또는 '아군 전체' 대상의 버프만 적용
                            if (target.target === '자신' || target.target === '아군 전체') {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        if (effect.type === '독립 배수') {
                                            values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                        } else {
                                            values[effect.type] += parseFloat(effect.value);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } else {
            // 선택된 조건들에 대해서만 버프 값을 합산
            this.selectedDealerBuffs.forEach(buffId => {
                Object.entries(BUFF_DATA_DEALER).forEach(([character, buffs]) => {
                    const buff = buffs.find(b => b.id === buffId);
                    if (buff && buff.targets) {
                        buff.targets.forEach(target => {
                            // '자신' 또는 '아군 전체' 대상의 버프만 적용
                            if (target.target === '자신' || target.target === '아군 전체') {
                                // 공용 버프는 공용 조건이 선택된 경우에만 포함
                                if (selectedConditions.includes('공용') && !target.condition) {
                                    target.effects.forEach(effect => {
                                        if (values.hasOwnProperty(effect.type)) {
                                            if (effect.type === '독립 배수') {
                                                values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                            } else {
                                                values[effect.type] += parseFloat(effect.value);
                                            }
                                        }
                                    });
                                }
                                // 특정 조건의 버프는 해당 조건이 선택된 경우에만 포함
                                else if (target.condition && selectedConditions.includes(target.condition)) {
                                    target.effects.forEach(effect => {
                                        if (values.hasOwnProperty(effect.type)) {
                                            if (effect.type === '독립 배수') {
                                                values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                            } else {
                                                values[effect.type] += parseFloat(effect.value);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
        }

        // 독립 배수를 퍼센트로 변환
        values['독립 배수'] = (values['독립 배수'] - 1) * 100;

        return values;
    }

    calculateDealerBuffValues(condition) {
        const values = {
            '공격력 %': 0,
            '공격력 상수': 0,
            '크리티컬 확률': 0,
            '크리티컬 효과': 0,
            '대미지 보너스': 0,
            '방어력 감소': 0,
            '관통': 0,
            '스킬 마스터': 0,
            '독립 배수': 0
        };

        this.selectedDealerBuffs.forEach(buffId => {
            Object.entries(BUFF_DATA_DEALER).forEach(([character, buffs]) => {
                const buff = buffs.find(b => b.id === buffId);
                if (buff && buff.targets) {
                    buff.targets.forEach(target => {
                        // '자신' 또는 '아군 전체' 대상의 버프만 적용
                        if (target.target === '자신' || target.target === '아군 전체') {
                            // 전체 탭인 경우 모든 버프 포함
                            if (condition === '전체') {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                            // 공용 버프는 공용 탭에서만 포함
                            else if (condition === '공용' && !target.condition) {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                            // 한정 조건이 있는 경우, 해당 조건의 버프만 포함
                            else if (condition && target.condition === condition) {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });

        return values;
    }

    calculateDealerAllyCombinedValues(selectedConditions) {
        // 기본 버프 값 초기화
        const values = {
            '공격력 %': 0,
            '공격력 상수': 0,
            '크리티컬 확률': 0,
            '크리티컬 효과': 0,
            '대미지 보너스': 0,
            '방어력 감소': 0,
            '관통': 0,
            '스킬 마스터': 0,
            '독립 배수': 1
        };

        // 전체 조건이 선택된 경우
        if (selectedConditions.includes('전체')) {
            // 모든 버프의 효과 합산
            this.selectedDealerBuffs.forEach(buffId => {
                Object.entries(BUFF_DATA_DEALER).forEach(([character, buffs]) => {
                    const buff = buffs.find(b => b.id === buffId);
                    if (buff && buff.targets) {
                        buff.targets.forEach(target => {
                            // '아군 전체' 대상의 버프만 적용
                            if (target.target === '아군 전체') {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        if (effect.type === '독립 배수') {
                                            values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                        } else {
                                            values[effect.type] += parseFloat(effect.value);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } else {
            // 선택된 조건들에 대해서만 버프 값을 합산
            this.selectedDealerBuffs.forEach(buffId => {
                Object.entries(BUFF_DATA_DEALER).forEach(([character, buffs]) => {
                    const buff = buffs.find(b => b.id === buffId);
                    if (buff && buff.targets) {
                        buff.targets.forEach(target => {
                            // '아군 전체' 대상의 버프만 적용
                            if (target.target === '아군 전체') {
                                // 공용 버프는 공용 조건이 선택된 경우에만 포함
                                if (selectedConditions.includes('공용') && !target.condition) {
                                    target.effects.forEach(effect => {
                                        if (values.hasOwnProperty(effect.type)) {
                                            if (effect.type === '독립 배수') {
                                                values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                            } else {
                                                values[effect.type] += parseFloat(effect.value);
                                            }
                                        }
                                    });
                                }
                                // 특정 조건의 버프는 해당 조건이 선택된 경우에만 포함
                                else if (target.condition && selectedConditions.includes(target.condition)) {
                                    target.effects.forEach(effect => {
                                        if (values.hasOwnProperty(effect.type)) {
                                            if (effect.type === '독립 배수') {
                                                values[effect.type] *= (1 + parseFloat(effect.value) / 100);
                                            } else {
                                                values[effect.type] += parseFloat(effect.value);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
        }

        // 독립 배수를 퍼센트로 변환
        values['독립 배수'] = (values['독립 배수'] - 1) * 100;

        return values;
    }

    calculateDealerAllyBuffValues(condition) {
        const values = {
            '공격력 %': 0,
            '공격력 상수': 0,
            '크리티컬 확률': 0,
            '크리티컬 효과': 0,
            '대미지 보너스': 0,
            '방어력 감소': 0,
            '관통': 0,
            '스킬 마스터': 0,
            '독립 배수': 0
        };

        this.selectedDealerBuffs.forEach(buffId => {
            Object.entries(BUFF_DATA_DEALER).forEach(([character, buffs]) => {
                const buff = buffs.find(b => b.id === buffId);
                if (buff && buff.targets) {
                    buff.targets.forEach(target => {
                        // '아군 전체' 대상의 버프만 적용
                        if (target.target === '아군 전체') {
                            // 전체 탭인 경우 모든 버프 포함
                            if (condition === '전체') {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                            // 공용 버프는 공용 탭에서만 포함
                            else if (condition === '공용' && !target.condition) {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                            // 한정 조건이 있는 경우, 해당 조건의 버프만 포함
                            else if (condition && target.condition === condition) {
                                target.effects.forEach(effect => {
                                    if (values.hasOwnProperty(effect.type)) {
                                        values[effect.type] += parseFloat(effect.value);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });

        return values;
    }

    updateDealerBuffValueDisplay(values, selectedCondition = '전체') {
        const idMapping = {
            '공격력 %': 'AttackPercent',
            '공격력 상수': 'AttackFlat',
            '크리티컬 확률': 'CritRate',
            '크리티컬 효과': 'CritDamage',
            '대미지 보너스': 'DamageBonus',
            '방어력 감소': 'DefenseReduce',
            '관통': 'Penetrate',
            '스킬 마스터': 'SkillMaster',
            '독립 배수': 'IndependentMultiplier'
        };

        const prefix = 'dealer';
        const currentValues = values[prefix];

        Object.entries(currentValues).forEach(([effect, value]) => {
            const element = document.getElementById(`${prefix}${idMapping[effect]}`);
            if (element) {
                let displayValue;
                // 딜러 자체 초기값 적용 - 크리티컬 확률 5%, 크리티컬 효과 150%
                if (effect === '크리티컬 확률') {
                    value += 5; // 기본 크리티컬 확률 5% 추가
                } else if (effect === '크리티컬 효과') {
                    value += 150; // 기본 크리티컬 효과 150% 추가
                }
                
                if (effect === '공격력 상수' || effect === '스킬 마스터') {
                    displayValue = value.toFixed(0);
                } else {
                    displayValue = value.toFixed(1) + '%';
                }
                element.textContent = displayValue;
                element.style.opacity = value === 0 ? '0.1' : '1';
            }
        });
        
        // 딜러 총합 값 업데이트
        this.updateTotalValues();
    }

    // 아군 전체에 영향을 주는 딜러 버프 표시 업데이트
    updateDealerAllyBuffValueDisplay(values, selectedCondition = '전체') {
        const idMapping = {
            '공격력 %': 'AttackPercent',
            '공격력 상수': 'AttackFlat',
            '크리티컬 확률': 'CritRate',
            '크리티컬 효과': 'CritDamage',
            '대미지 보너스': 'DamageBonus',
            '방어력 감소': 'DefenseReduce',
            '관통': 'Penetrate',
            '스킬 마스터': 'SkillMaster',
            '독립 배수': 'IndependentMultiplier'
        };

        const allyValues = values['ally'];
        
        // 기존 버프 값 가져오기
        const existingValues = {};
        Object.keys(idMapping).forEach(effect => {
            const element = document.getElementById(`ally${idMapping[effect]}`);
            if (element) {
                let value = element.textContent;
                // 퍼센트 제거하고 숫자값으로 변환
                if (effect === '공격력 상수' || effect === '스킬 마스터') {
                    existingValues[effect] = parseFloat(value) || 0;
                } else {
                    existingValues[effect] = parseFloat(value.replace('%', '')) || 0;
                }
            }
        });

        // 딜러 버프 값을 기존 버프 값에 합산하여 표시
        Object.entries(allyValues).forEach(([effect, value]) => {
            const element = document.getElementById(`ally${idMapping[effect]}`);
            if (element) {
                // 기존 버프 값과 딜러 버프 값을 합산
                let combinedValue = 0;
                
                // 기존 버프 값이 있다면 합산
                if (this.currentValues && this.currentValues['전체'] && this.currentValues['전체']['ally']) {
                    const existingValue = this.currentValues['전체']['ally'][effect] || 0;
                    combinedValue = existingValue + value;
                } else {
                    combinedValue = value;
                }
                
                let displayValue;
                if (effect === '공격력 상수' || effect === '스킬 마스터') {
                    displayValue = combinedValue.toFixed(0);
                } else {
                    displayValue = combinedValue.toFixed(1) + '%';
                }
                element.textContent = displayValue;
                element.style.opacity = combinedValue === 0 ? '0.1' : '1';
            }
        });
        
        // 딜러 총합 값 업데이트
        this.updateTotalValues();
    }

    // 딜러 총합 값을 계산하고 표시하는 함수
    updateTotalValues() {
        const idMapping = {
            '공격력 %': 'AttackPercent',
            '공격력 상수': 'AttackFlat',
            '크리티컬 확률': 'CritRate',
            '크리티컬 효과': 'CritDamage',
            '대미지 보너스': 'DamageBonus',
            '방어력 감소': 'DefenseReduce',
            '관통': 'Penetrate',
            '스킬 마스터': 'SkillMaster',
            '독립 배수': 'IndependentMultiplier'
        };
        
        // 메인 목표와 딜러의 값을 가져옴
        const totalValues = {};
        
        Object.keys(idMapping).forEach(effect => {
            const mainElement = document.getElementById(`main${idMapping[effect]}`);
            const dealerElement = document.getElementById(`dealer${idMapping[effect]}`);
            
            if (mainElement && dealerElement) {
                let mainValue, dealerValue;
                
                // 값 추출
                if (effect === '공격력 상수' || effect === '스킬 마스터') {
                    mainValue = parseFloat(mainElement.textContent) || 0;
                    dealerValue = parseFloat(dealerElement.textContent) || 0;
                    totalValues[effect] = mainValue + dealerValue;
                } else {
                    mainValue = parseFloat(mainElement.textContent.replace('%', '')) || 0;
                    dealerValue = parseFloat(dealerElement.textContent.replace('%', '')) || 0;
                    
                    // 독립 배수는 다르게 계산
                    if (effect === '독립 배수') {
                        totalValues[effect] = (1 + mainValue/100) * (1 + dealerValue/100) * 100 - 100;
                    } else {
                        totalValues[effect] = mainValue + dealerValue;
                    }
                }
            }
        });
        
        // 총합 값 표시
        Object.entries(totalValues).forEach(([effect, value]) => {
            const element = document.getElementById(`total${idMapping[effect]}`);
            if (element) {
                let displayValue;
                if (effect === '공격력 상수' || effect === '스킬 마스터') {
                    displayValue = value.toFixed(0);
                } else {
                    displayValue = value.toFixed(1) + '%';
                }
                element.textContent = displayValue;
                element.style.opacity = value === 0 ? '0.1' : '1';
            }
        });
        
        // 대미지 계산 업데이트
        this.calculateDamage();
    }

    createConditionTabs(conditions, isTotalChecked = true) {
        const tableTabs = document.querySelector('.table-tabs');
        
        // 기존 탭 제거
        const existingTabs = document.querySelector('.buff-condition-tabs-container');
        if (existingTabs) {
            existingTabs.remove();
        }

        // 조건 탭 컨테이너 생성
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'condition-tabs-container buff-condition-tabs-container';
        
        // 조건 탭 생성
        const tabs = document.createElement('div');
        tabs.className = 'condition-tabs';
        
        // '버프 조건' 라벨 추가
        const labelDiv = document.createElement('div');
        labelDiv.className = 'condition-label';
        labelDiv.textContent = '버프 조건';
        tabs.appendChild(labelDiv);
        
        tabs.innerHTML += `
            <div class="condition-checkbox">
                <input type="checkbox" class="condition-check buff-condition-check" data-condition="전체" ${isTotalChecked ? 'checked' : ''}>
                <span>전체</span>
            </div>
            ${conditions.filter(condition => condition !== '전체').map(condition => `
                <div class="condition-checkbox">
                    <input type="checkbox" class="condition-check buff-condition-check" data-condition="${condition}" ${isTotalChecked ? 'checked' : ''}>
                    <span>${condition}</span>
                </div>
            `).join('')}
        `;
        tabsContainer.appendChild(tabs);
        
        // 테이블 탭 앞에 삽입
        tableTabs.parentNode.insertBefore(tabsContainer, tableTabs);

        // 체크박스 이벤트 리스너
        const checkboxes = tabs.querySelectorAll('.buff-condition-check');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const condition = e.target.dataset.condition;
                const isChecked = e.target.checked;

                // 전체 체크박스 처리
                if (condition === '전체') {
                    // 모든 체크박스 상태를 전체 체크박스와 동일하게 설정
                    checkboxes.forEach(cb => {
                        cb.checked = isChecked;
                    });
                } else {
                    // 전체 체크박스 해제
                    const totalCheckbox = tabs.querySelector('.buff-condition-check[data-condition="전체"]');
                    if (totalCheckbox) {
                        totalCheckbox.checked = false;
                    }

                    // 모든 개별 체크박스가 체크되었는지 확인
                    const allChecked = Array.from(checkboxes)
                        .filter(cb => cb.dataset.condition !== '전체')
                        .every(cb => cb.checked);

                    // 모든 개별 체크박스가 체크되었다면 전체 체크박스도 체크
                    if (allChecked) {
                        totalCheckbox.checked = true;
                    }
                }

                // 선택된 조건들의 값 합산
                const selectedConditions = Array.from(tabs.querySelectorAll('.buff-condition-check:checked')).map(cb => cb.dataset.condition);
                
                // 버프 값 업데이트
                const buffValues = {
                    main: this.calculateCombinedValues(selectedConditions, true),
                    ally: this.calculateCombinedValues(selectedConditions, false)
                };

                // UI 업데이트
                this.updateBuffValueDisplay(buffValues, 'selected', true);
                this.updateBuffValueDisplay(buffValues, 'selected', false);
            });
        });
    }

    createDealerConditionTabs(conditions, isTotalChecked = true) {
        const dealerTableTabs = document.querySelector('.dealer-table-tabs');
        
        // 기존 탭 제거
        const existingTabs = document.querySelector('.dealer-condition-tabs-container');
        if (existingTabs) {
            existingTabs.remove();
        }

        // 조건 탭 컨테이너 생성
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'condition-tabs-container dealer-condition-tabs-container';
        
        // 조건 탭 생성
        const tabs = document.createElement('div');
        tabs.className = 'condition-tabs';
        
        // '딜러 조건' 라벨 추가
        const labelDiv = document.createElement('div');
        labelDiv.className = 'condition-label';
        labelDiv.textContent = '딜러 조건';
        tabs.appendChild(labelDiv);
        
        tabs.innerHTML += `
            <div class="condition-checkbox">
                <input type="checkbox" class="condition-check dealer-condition-check" data-condition="전체" ${isTotalChecked ? 'checked' : ''}>
                <span>전체</span>
            </div>
            ${conditions.filter(condition => condition !== '전체').map(condition => `
                <div class="condition-checkbox">
                    <input type="checkbox" class="condition-check dealer-condition-check" data-condition="${condition}" ${isTotalChecked ? 'checked' : ''}>
                    <span>${condition}</span>
                </div>
            `).join('')}
        `;
        tabsContainer.appendChild(tabs);
        
        // 테이블 탭 앞에 삽입
        dealerTableTabs.parentNode.insertBefore(tabsContainer, dealerTableTabs);

        // 체크박스 이벤트 리스너
        const checkboxes = tabs.querySelectorAll('.dealer-condition-check');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const condition = e.target.dataset.condition;
                const isChecked = e.target.checked;

                // 전체 체크박스 처리
                if (condition === '전체') {
                    // 모든 체크박스 상태를 전체 체크박스와 동일하게 설정
                    checkboxes.forEach(cb => {
                        cb.checked = isChecked;
                    });
                } else {
                    // 전체 체크박스 해제
                    const totalCheckbox = tabs.querySelector('.dealer-condition-check[data-condition="전체"]');
                    if (totalCheckbox) {
                        totalCheckbox.checked = false;
                    }

                    // 모든 개별 체크박스가 체크되었는지 확인
                    const allChecked = Array.from(checkboxes)
                        .filter(cb => cb.dataset.condition !== '전체')
                        .every(cb => cb.checked);

                    // 모든 개별 체크박스가 체크되었다면 전체 체크박스도 체크
                    if (allChecked) {
                        totalCheckbox.checked = true;
                    }
                }

                // 선택된 조건들의 값 합산
                const selectedConditions = Array.from(tabs.querySelectorAll('.dealer-condition-check:checked')).map(cb => cb.dataset.condition);
                
                // 딜러 버프 값 업데이트
                const dealerValues = {
                    dealer: this.calculateDealerCombinedValues(selectedConditions),
                    ally: this.calculateDealerAllyCombinedValues(selectedConditions)
                };

                // UI 업데이트
                this.updateDealerBuffValueDisplay(dealerValues, 'selected');
                this.updateDealerAllyBuffValueDisplay(dealerValues, 'selected');
            });
        });
    }

    // 새로운 메서드 추가 - 버퍼 탭 캐릭터 체크 표시 업데이트
    updateCharacterTabCheckmarks() {
        // 각 캐릭터별로 선택된 버프가 있는지 확인
        Object.keys(BUFF_DATA).forEach(character => {
            const hasSelectedBuffs = BUFF_DATA[character].some(buff => this.selectedBuffs.has(buff.id));
            
            // 해당 캐릭터 탭 버튼 찾기
            const tabButton = document.querySelector(`.table-tabs .tab-buttons .tab-button[data-tab="${character}"]`);
            if (tabButton) {
                // 기존 체크 표시 제거
                const existingCheckmark = tabButton.querySelector('.tab-checkmark');
                if (existingCheckmark) {
                    existingCheckmark.remove();
                }
                
                // 선택된 버프가 있는 경우 체크 표시 추가
                if (hasSelectedBuffs) {
                    const checkmark = document.createElement('span');
                    checkmark.className = 'tab-checkmark';
                    checkmark.textContent = '✅';
                    checkmark.style.marginLeft = '0px';
                    tabButton.appendChild(checkmark);
                }
            }
        });

        // 모든 값이 업데이트된 후 대미지 계산 업데이트
        this.calculateDamage();
    }
    
    // 새로운 메서드 추가 - 딜러 탭 캐릭터 체크 표시 업데이트
    updateDealerCharacterTabCheckmarks() {
        // 각 캐릭터별로 선택된 버프가 있는지 확인
        Object.keys(BUFF_DATA_DEALER).forEach(character => {
            const hasSelectedBuffs = BUFF_DATA_DEALER[character].some(buff => this.selectedDealerBuffs.has(buff.id));
            
            // 해당 캐릭터 탭 버튼 찾기
            const tabButton = document.querySelector(`.dealer-table-tabs .tab-buttons .tab-button[data-tab="${character}"]`);
            if (tabButton) {
                // 기존 체크 표시 제거
                const existingCheckmark = tabButton.querySelector('.tab-checkmark');
                if (existingCheckmark) {
                    existingCheckmark.remove();
                }
                
                // 선택된 버프가 있는 경우 체크 표시 추가
                if (hasSelectedBuffs) {
                    const checkmark = document.createElement('span');
                    checkmark.className = 'tab-checkmark';
                    checkmark.textContent = '✅';
                    checkmark.style.marginLeft = '5px';
                    tabButton.appendChild(checkmark);
                }
            }
        });

        // 모든 값이 업데이트된 후 대미지 계산 업데이트
        this.calculateDamage();
    }

    // 대미지 계산기 초기화
    initDamageCalculator() {
        // 메인 탭 버튼 위에 대미지 계산기 추가
        const mainTabs = document.querySelector('.main-tabs');
        const damageCalculator = document.createElement('div');
        damageCalculator.className = 'damage-calculator card-style';
        
        // 타이틀과 계산식 결과 영역
        damageCalculator.innerHTML = `
            <!--<h3>대미지 계산</h3>-->
            <div class="damage-formula">
                <div class="formula-inputs">
                    <div class="input-group">
                        <label>기본 공격력 (바닐라 공격력 + 무기 공격력)</label>
                        <input type="number" id="baseAttack" value="2000" min="0" step="1">
                    </div>
                    <div class="input-group">
                        <label>스킬 계수(%)</label>
                        <input type="number" id="skillRatio" value="100" min="0" step="0.1">
                    </div>
                    <div class="input-group">
                        <label>적 기본 방어력</label>
                        <input type="number" id="baseDefense" value="1280" min="0" step="1">
                    </div>
                    <div class="input-group">
                        <label>적 방어 계수(%)</label>
                        <input type="number" id="defenseRatio" value="263.2" min="0" step="0.1">
                    </div>
                </div>
                <div class="formula-result">
                    <span>계산 결과 :</span>
                    <div id="damageResult">0</div>
                </div>
            </div>
            <div class="formula-details">
                <div class="formula-step">
                    <span>공격력:</span>
                    <span id="attackResult">0</span>
                </div>
                <div class="formula-step">
                    <span>크리티컬(안정 영역):</span>
                    <span id="critResult">0</span>
                </div>
                <div class="formula-step">
                    <span>대미지 보너스:</span>
                    <span id="damageBonusResult">0%</span>
                </div>
                <div class="formula-step">
                    <span>방어력 적용 배수:</span>
                    <span id="defenseResult">0</span>
                </div>
                <div class="formula-step">
                    <span>독립 배수:</span>
                    <span id="independentResult">0</span>
                </div>
            </div>
        `;
        
        // 메인 탭 앞에 삽입
        mainTabs.parentNode.insertBefore(damageCalculator, mainTabs);
        
        // 입력 필드 이벤트 리스너 추가
        const inputs = damageCalculator.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculateDamage();
            });
        });
        
        // 버프 카드 관련 요소들에 변경 감지 이벤트 추가
        const observeElements = [
            'totalAttackPercent', 'totalAttackFlat', 'totalCritRate', 'totalCritDamage',
            'totalDamageBonus', 'totalDefenseReduce', 'totalPenetrate', 'totalIndependentMultiplier'
        ];
        
        // MutationObserver 생성
        const observer = new MutationObserver(() => {
            this.calculateDamage();
        });
        
        // 관찰할 옵션 설정
        const config = { childList: true, subtree: true, characterData: true, characterDataOldValue: true };
        
        // 모든 관찰 대상 요소에 옵저버 연결
        observeElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element, config);
            }
        });
        
        // 초기 계산
        this.calculateDamage();
    }
    
    // 대미지 계산 함수
    calculateDamage() {
        // 입력값 가져오기
        const baseAttack = parseFloat(document.getElementById('baseAttack')?.value) || 0;
        const skillRatio = parseFloat(document.getElementById('skillRatio')?.value) || 0;
        const baseDefense = parseFloat(document.getElementById('baseDefense')?.value) || 0;
        const defenseRatio = parseFloat(document.getElementById('defenseRatio')?.value) || 0;
        
        // 버프 값 가져오기
        const totalAttackPercentElem = document.getElementById('totalAttackPercent');
        const totalAttackFlatElem = document.getElementById('totalAttackFlat');
        const totalCritRateElem = document.getElementById('totalCritRate');
        const totalCritDamageElem = document.getElementById('totalCritDamage');
        const totalDamageBonusElem = document.getElementById('totalDamageBonus');
        const totalDefenseReduceElem = document.getElementById('totalDefenseReduce');
        const totalPenetrateElem = document.getElementById('totalPenetrate');
        const totalIndependentMultiplierElem = document.getElementById('totalIndependentMultiplier');
        
        // '%' 문자 제거하고 파싱
        const attackPercent = totalAttackPercentElem ? parseFloat(totalAttackPercentElem.textContent.replace('%', '')) || 0 : 0;
        const attackFlat = totalAttackFlatElem ? parseFloat(totalAttackFlatElem.textContent) || 0 : 0;
        const critRate = totalCritRateElem ? parseFloat(totalCritRateElem.textContent.replace('%', '')) || 0 : 0;
        const critDamage = totalCritDamageElem ? parseFloat(totalCritDamageElem.textContent.replace('%', '')) || 0 : 0;
        const damageBonus = totalDamageBonusElem ? parseFloat(totalDamageBonusElem.textContent.replace('%', '')) || 0 : 0;
        const defenseReduce = totalDefenseReduceElem ? parseFloat(totalDefenseReduceElem.textContent.replace('%', '')) || 0 : 0;
        const penetrate = totalPenetrateElem ? Math.min(parseFloat(totalPenetrateElem.textContent.replace('%', '')) || 0, 100) : 0;
        const independentMultiplier = totalIndependentMultiplierElem ? parseFloat(totalIndependentMultiplierElem.textContent.replace('%', '')) || 0 : 0;
        
        // 1. 공격력 계산: (기본 공격력 * 공격력 %) + 공격력 상수
        const attackValue = (baseAttack * (1 + attackPercent / 100)) + attackFlat;
        
        // 2. 크리티컬 계산
        let effectiveCritRate = Math.min(critRate, 100);
        let effectiveCritDamage = critDamage;
        
        // 리코·매화 의식6 체크 여부 확인
        const ricoRitual6Checked = document.querySelector('input[name="ritual-리코·매화"][value="6"]')?.checked;
        
        // 의식6이 체크되어 있고 크리티컬 확률이 100%를 초과하는 경우
        if (ricoRitual6Checked && critRate > 100) {
            // 초과 크리티컬 확률을 2배로 곱해서 크리티컬 효과에 추가
            const excessCritRate = critRate - 100;
            effectiveCritDamage += excessCritRate * 2;
        }
        
        // 크리티컬 배수 계산: (크리티컬 효과 - 100) * 크리티컬 확률 / 100 + 1
        const critMultiplier = ((effectiveCritDamage - 100) * effectiveCritRate / 100) / 100 + 1;
        
        // 3. 방어 계수 적용
        const defenseCoef = defenseRatio / 100;
        const defensePenetration = Math.max(0, (defenseCoef * (100 - penetrate) / 100 - defenseReduce / 100));
        const defenseMultiplier = 1 - (baseDefense * defensePenetration) / (baseDefense * defensePenetration + 1400);
        
        // 4. 독립 배수
        const independentMultiplierValue = 1 + independentMultiplier / 100;
        
        // 5. 최종 대미지 계산
        const finalDamage = attackValue * (skillRatio / 100) * critMultiplier * (1 + damageBonus / 100) * defenseMultiplier * independentMultiplierValue;
        
        // 결과 표시
        const damageResultElem = document.getElementById('damageResult');
        const attackResultElem = document.getElementById('attackResult');
        const critResultElem = document.getElementById('critResult');
        const damageBonusResultElem = document.getElementById('damageBonusResult');
        const defenseResultElem = document.getElementById('defenseResult');
        const independentResultElem = document.getElementById('independentResult');
        
        if (damageResultElem) damageResultElem.textContent = Math.round(finalDamage).toLocaleString();
        if (attackResultElem) attackResultElem.textContent = Math.round(attackValue).toLocaleString();
        if (critResultElem) critResultElem.textContent = (critMultiplier * 100).toFixed(2) + '%';
        if (damageBonusResultElem) damageBonusResultElem.textContent = (damageBonus).toFixed(1) + '%';
        if (defenseResultElem) defenseResultElem.textContent = (defenseMultiplier * 100).toFixed(2) + '%';
        if (independentResultElem) independentResultElem.textContent = (independentMultiplierValue * 100).toFixed(2) + '%';
    }
}

// 페이지 로드 시 버프 계산기 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    const buffCalculator = new BuffCalculator();
}); 