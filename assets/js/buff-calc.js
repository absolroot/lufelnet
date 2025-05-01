// 버프 계산기 메인 로직
class BuffCalculator {
    constructor() {
        this.selectedBuffs = new Set();
        this.init();
    }

    init() {
        this.initTabs();
        this.initTable();
        this.initEventListeners();
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
            if (character === '리코·매화' || character === '아케치' || character === '마나카' || character === '마유미') {
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
            '대미지 보너스', '방어력 감소', '관통',
            '독립 배수'
        ];

        effectColumns.forEach(effect => {
            const cell = document.createElement('td');
            cell.className = 'effect-value';
            cell.dataset.effect = effect;
            cell.textContent = '0';
            if (effect === '공격력 상수') {
                cell.textContent = '0';
            } else {
                cell.textContent = '0%';
            }
            cell.style.opacity = '0.1';
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
        row.appendChild(noteCell);

        // 한정 조건 열
        const conditionCell = document.createElement('td');
        if (targetData && targetData.condition) {
            conditionCell.textContent = targetData.condition;
        }
        row.appendChild(conditionCell);

        // 초기 효과 값 설정
        if (targetData) {
            targetData.effects.forEach(effect => {
                const cell = row.querySelector(`[data-effect="${effect.type}"]`);
                if (cell) {
                    const value = effect.value || 0;
                    cell.textContent = effect.type === '공격력 상수' ? value : `${value}%`;
                    cell.style.opacity = value === 0 ? '0.1' : '1';
                }
            });
        }

        return row;
    }

    initEventListeners() {
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
                                optionSelect.value = value;
                                this.updateEffectValues(row, buffId);
                            }
                        });
                    }
                });

                // 아케치 스킬3의 독립 배수 업데이트
                if (character === '아케치') {
                    this.updateAkechiSkill3IndependentMultiplier();
                }

                this.updateBuffValues();
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

    createConditionTabs(conditions, isTotalChecked = true) {
        const tableTabs = document.querySelector('.table-tabs');
        
        // 기존 탭 제거
        const existingTabs = document.querySelector('.condition-tabs-container');
        if (existingTabs) {
            existingTabs.remove();
        }

        // 조건 탭 컨테이너 생성
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'condition-tabs-container';
        
        // 조건 탭 생성
        const tabs = document.createElement('div');
        tabs.className = 'condition-tabs';
        tabs.innerHTML = `
            <div class="condition-checkbox">
                <input type="checkbox" class="condition-check" data-condition="전체" ${isTotalChecked ? 'checked' : ''}>
                <span>전체</span>
            </div>
            ${conditions.filter(condition => condition !== '전체').map(condition => `
                <div class="condition-checkbox">
                    <input type="checkbox" class="condition-check" data-condition="${condition}" ${isTotalChecked ? 'checked' : ''}>
                    <span>${condition}</span>
                </div>
            `).join('')}
        `;
        tabsContainer.appendChild(tabs);
        
        // 테이블 탭 앞에 삽입
        tableTabs.parentNode.insertBefore(tabsContainer, tableTabs);

        // 체크박스 이벤트 리스너
        const checkboxes = tabs.querySelectorAll('.condition-check');
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
                    const totalCheckbox = tabs.querySelector('.condition-check[data-condition="전체"]');
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
                const selectedConditions = Array.from(tabs.querySelectorAll('.condition-check:checked')).map(cb => cb.dataset.condition);
                const combinedValues = {
                    main: this.calculateCombinedValues(selectedConditions, true),
                    ally: this.calculateCombinedValues(selectedConditions, false)
                };

                // UI 업데이트
                this.updateBuffValueDisplay(combinedValues, '전체', true);  // 메인 목표
                this.updateBuffValueDisplay(combinedValues, '전체', false); // 아군 전체
            });
        });
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
            '독립 배수': 'IndependentMultiplier'
        };

        const prefix = isMain ? 'main' : 'ally';
        const currentValues = values[isMain ? 'main' : 'ally'];

        Object.entries(currentValues).forEach(([effect, value]) => {
            const element = document.getElementById(`${prefix}${idMapping[effect]}`);
            if (element) {
                const displayValue = effect === '공격력 상수' ? 
                    value.toFixed(0) : 
                    value.toFixed(1) + '%';
                element.textContent = displayValue;
                element.style.opacity = value === 0 ? '0.1' : '1';
            }
        });
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
}

// 페이지 로드 시 계산기 초기화
document.addEventListener('DOMContentLoaded', () => {
    new BuffCalculator();
}); 