class DefenseCalc {
    constructor() {
        this.tableBody = document.getElementById('defenseTableBody');
        this.penetrateTableBody = document.getElementById('penetrateTableBody');
        this.totalValue = document.querySelector('.total-value');
        this.penetrateValue = document.querySelector('.penetrate-value');
        this.finalDefenseCoefSpan = document.getElementById('finalDefenseCoef');
        this.revelationPenetrateInput = document.getElementById('revelationPenetrate');
        this.explanationPowerInput = document.getElementById('explanationPower');
        this.selectedItems = new Set(); // 초기 선택 항목 설정
        this.selectedPenetrateItems = new Set(); // 관통 선택 항목
        this.initializeBossSelect(); // 보스 선택 초기화를 먼저 실행
        this.initializeTable(); // 그 다음 테이블 초기화
        this.initializePenetrateTable(); // 관통 테이블 초기화
        this.initializeMobileHeader();
        this.initializePenetrateInputs();
    }

    initializeTable() {
        defenseCalcData.forEach(data => {
            const row = this.createTableRow(data);
            this.tableBody.appendChild(row);
        });
        // 초기 합계 계산
        this.updateTotal();
    }

    initializePenetrateTable() {
        penetrateData.forEach(data => {
            const row = this.createTableRow(data, true);
            this.penetrateTableBody.appendChild(row);
        });
        this.updatePenetrateTotal();
    }

    createTableRow(data, isPenetrate = false) {
        const row = document.createElement('tr');
        
        // 초기 선택된 항목에 대해 selected 클래스 추가
        if (isPenetrate) {
            if (this.selectedPenetrateItems.has(data.id)) {
                row.classList.add('selected');
            }
        } else {
            if (this.selectedItems.has(data.id)) {
                row.classList.add('selected');
            }
        }
        
        // 괴도 이름이 비어있는 경우 클래스 추가
        if (!data.charName && data.id !== 1) {
            row.classList.add('empty-char');
        }
        
        // 체크박스 열
        const checkCell = document.createElement('td');
        checkCell.className = 'check-column';
        const checkbox = document.createElement('img');
        checkbox.src = isPenetrate 
            ? (this.selectedPenetrateItems.has(data.id) ? `${BASE_URL}/assets/img/ui/check-on.png` : `${BASE_URL}/assets/img/ui/check-off.png`)
            : (this.selectedItems.has(data.id) ? `${BASE_URL}/assets/img/ui/check-on.png` : `${BASE_URL}/assets/img/ui/check-off.png`);
        checkbox.onclick = () => {
            if (isPenetrate) {
                this.togglePenetrateCheck(checkbox, data);
            } else {
                this.toggleCheck(checkbox, data);
            }
        };
        checkCell.appendChild(checkbox);
        row.appendChild(checkCell);
        
        // 캐릭터 이미지 열
        const charImgCell = document.createElement('td');
        charImgCell.className = 'char-img-column';
        if (data.charImage) {
            const charImg = document.createElement('img');
            charImg.src = `${BASE_URL}/assets/img/character-half/${data.charImage}`;
            charImgCell.appendChild(charImg);
        }
        row.appendChild(charImgCell);
        
        // 괴도 이름 열
        const charNameCell = document.createElement('td');
        charNameCell.className = 'char-name-column';
        charNameCell.textContent = data.charName;
        row.appendChild(charNameCell);
        
        // 분류 열
        const typeCell = document.createElement('td');
        typeCell.className = 'type-column';
        typeCell.textContent = data.type;
        row.appendChild(typeCell);
        
        // 목표 열
        const targetCell = document.createElement('td');
        targetCell.className = 'target-column';
        targetCell.textContent = data.target;
        targetCell.setAttribute('data-target', data.target);
        row.appendChild(targetCell);
        
        // 스킬 아이콘 열
        const skillIconCell = document.createElement('td');
        skillIconCell.className = 'skill-icon-column';
        if (data.skillIcon) {
            const skillIcon = document.createElement('img');
            skillIcon.src = data.skillIcon;
            
            // 스킬 관련 타입인 경우 skill-icon 클래스 추가
            if (data.type.includes('스킬') || 
                data.type === '하이라이트' || 
                data.type === '패시브' ||
                data.type === '총격') {
                skillIcon.className = 'skill-icon';
            }
            
            skillIconCell.appendChild(skillIcon);
        }
        row.appendChild(skillIconCell);
        
        // 스킬 이름 열
        const skillNameCell = document.createElement('td');
        skillNameCell.className = 'skill-name-column';
        skillNameCell.textContent = data.skillName;
        row.appendChild(skillNameCell);
        
        // 옵션 열
        const optionCell = document.createElement('td');
        optionCell.className = 'option-column';
        if (data.options && data.options.length > 0) {
            const select = document.createElement('select');
            data.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                if (data.defaultOption && option === data.defaultOption) {
                    optionElement.selected = true;
                }
                select.appendChild(optionElement);
            });
            // 옵션 변경 시 수치 업데이트
            select.onchange = () => {
                const selectedOption = select.value;
                if (data.values && data.values[selectedOption]) {
                    data.value = data.values[selectedOption];
                    valueCell.textContent = `${data.value}%`;
                    if (isPenetrate) {
                        this.updatePenetrateTotal();
                    } else {
                        if (this.selectedItems.has(data.id)) {
                            this.updateTotal();
                        }
                    }
                }
            };
            optionCell.appendChild(select);
        }
        row.appendChild(optionCell);
        
        // 수치 열
        const valueCell = document.createElement('td');
        valueCell.className = 'value-column';
        valueCell.textContent = `${data.value}%`;
        row.appendChild(valueCell);
        
        // 지속시간 열
        const durationCell = document.createElement('td');
        durationCell.className = 'duration-column';
        durationCell.textContent = data.duration;
        row.appendChild(durationCell);
        
        // 비고 열
        const noteCell = document.createElement('td');
        noteCell.className = 'note-column';
        noteCell.textContent = data.note;
        row.appendChild(noteCell);
        
        return row;
    }

    toggleCheck(checkbox, data) {
        const isChecked = checkbox.src.includes('check-on');
        checkbox.src = `${BASE_URL}/assets/img/ui/check-${isChecked ? 'off' : 'on'}.png`;
        
        const row = checkbox.closest('tr');
        
        if (isChecked) {
            this.selectedItems.delete(data.id);
            row.classList.remove('selected');
        } else {
            this.selectedItems.add(data.id);
            row.classList.add('selected');
        }
        
        this.updateTotal();
    }

    togglePenetrateCheck(checkbox, data) {
        const isChecked = checkbox.src.includes('check-on');
        checkbox.src = `${BASE_URL}/assets/img/ui/check-${isChecked ? 'off' : 'on'}.png`;
        
        const row = checkbox.closest('tr');
        
        if (isChecked) {
            this.selectedPenetrateItems.delete(data.id);
            row.classList.remove('selected');
        } else {
            this.selectedPenetrateItems.add(data.id);
            row.classList.add('selected');
        }
        
        this.updatePenetrateTotal();
        this.updateDamageCalculation();
    }

    updateTotal() {
        const total = Array.from(this.selectedItems)
            .map(id => defenseCalcData.find(d => d.id === id))
            .reduce((sum, item) => sum + item.value, 0);
            
        this.totalValue.textContent = `${total.toFixed(1)}%`;
        this.updateDamageCalculation();
    }

    updatePenetrateTotal() {
        // 테이블에서 선택된 항목들의 합계
        const tableTotal = Array.from(this.selectedPenetrateItems)
            .map(id => penetrateData.find(d => d.id === id))
            .reduce((sum, item) => sum + item.value, 0);
        
        // 입력 필드의 값 (숫자가 아닌 경우 0으로 처리)
        const revelationValue = parseFloat(this.revelationPenetrateInput.value) || 0;
        const explanationValue = parseFloat(this.explanationPowerInput.value) || 0;
        
        // 전체 합계 계산
        const total = tableTotal + revelationValue + explanationValue;
        
        // 합계 표시
        this.penetrateValue.textContent = `${total.toFixed(1)}%`;
        
        // 대미지 계산 업데이트
        this.updateDamageCalculation();
    }

    initializeBossSelect() {
        this.bossSelect = document.getElementById('bossSelect');
        this.baseDefenseSpan = document.getElementById('baseDefense');
        this.defenseCoefSpan = document.getElementById('defenseCoef');
        this.damageIncreaseDiv = document.querySelector('.damage-increase');
        this.noDefReduceSpan = document.getElementById('noDefReduce');
        this.withDefReduceSpan = document.getElementById('withDefReduce');

        // 보스 선택 옵션 추가
        bossData.forEach(boss => {
            const option = document.createElement('option');
            option.value = boss.id;
            option.textContent = boss.name;
            if (boss.id === 1) {  // id가 1인 보스를 기본 선택
                option.selected = true;
            }
            this.bossSelect.appendChild(option);
        });

        this.bossSelect.addEventListener('change', () => this.updateDamageCalculation());
        
        // 초기 계산 실행
        this.updateDamageCalculation();
    }

    updateDamageCalculation() {
        const selectedBossId = this.bossSelect.value;
        if (!selectedBossId) {
            this.resetDamageDisplay();
            return;
        }

        const boss = bossData.find(b => b.id === parseInt(selectedBossId));
        if (!boss) {
            this.resetDamageDisplay();
            return;
        }

        // 기본 방어력과 방어 계수 표시 처리
        this.baseDefenseSpan.textContent = boss.baseDefense === '-' ? '미확인' : boss.baseDefense;
        this.defenseCoefSpan.textContent = boss.defenseCoef === '-' ? '미확인' : `${boss.defenseCoef}%`;

        // 기본 방어력이 미확인인 경우 계산 중단
        if (boss.baseDefense === '-') {
            this.damageIncreaseDiv.textContent = '-';
            this.noDefReduceSpan.textContent = '-';
            this.withDefReduceSpan.textContent = '-';
            this.finalDefenseCoefSpan.textContent = '-';
            document.getElementById('finalDefenseCoef2').textContent = '-';
            return;
        }

        const baseDefense = parseFloat(boss.baseDefense);
        const defenseCoef = parseFloat(boss.defenseCoef);
        const defenseReduce = Math.min(parseFloat(this.totalValue.textContent), defenseCoef);
        
        // 관통 효과 적용
        const penetrateTotal = parseFloat(this.penetrateValue.textContent);
        const modifiedDefenseCoef = penetrateTotal >= 100 ? 0 : defenseCoef * (100 - penetrateTotal) / 100;
        
        // 최종 방어 계수 표시
        this.finalDefenseCoefSpan.textContent = `${modifiedDefenseCoef.toFixed(1)}%`;
        
        // 방어력 감소 적용 방어 계수 계산 및 표시
        const finalDefenseCoef2 = Math.max(0, modifiedDefenseCoef - defenseReduce);
        document.getElementById('finalDefenseCoef2').textContent = `${finalDefenseCoef2.toFixed(1)}%`;
        
        // 방어력 감소 미적용
        const noReduceDamage = 1-this.calculateDamage(baseDefense, defenseCoef);
        
        // 방어력 감소 적용 (최소값은 0으로 제한)
        const finalDefenseCoef = Math.max(0, modifiedDefenseCoef - defenseReduce);
        const withReduceDamage = 1-this.calculateDamage(baseDefense, finalDefenseCoef);
        
        // 최종 대미지 증가율
        const damageIncrease = ((withReduceDamage / noReduceDamage)-1) * 100;

        // 화면 업데이트
        this.damageIncreaseDiv.textContent = damageIncrease >= 0 
            ? `+${damageIncrease.toFixed(1)}%`
            : `${damageIncrease.toFixed(1)}%`;
        this.noDefReduceSpan.textContent = noReduceDamage.toFixed(3);
        this.withDefReduceSpan.textContent = withReduceDamage.toFixed(3);
    }

    calculateDamage(baseDefense, defenseCoef) {
        const numerator = baseDefense * (defenseCoef / 100);
        const denominator = numerator + 1400;
        return numerator / denominator;
    }

    resetDamageDisplay() {
        this.baseDefenseSpan.textContent = '-';
        this.defenseCoefSpan.textContent = '-';
        this.damageIncreaseDiv.textContent = '-';
        this.noDefReduceSpan.textContent = '-';
        this.withDefReduceSpan.textContent = '-';
        this.finalDefenseCoefSpan.textContent = '-';
        document.getElementById('finalDefenseCoef2').textContent = '-';
    }

    initializeMobileHeader() {
        if (window.innerWidth <= 768) {
            const headerContainer = document.createElement('div');
            headerContainer.className = 'mobile-table-header';

            // 첫 번째 그룹 (캐릭터 정보)
            const charGroup = document.createElement('div');
            charGroup.className = 'mobile-header-group';
            charGroup.innerHTML = `
                <span>선택</span>
                <span>괴도</span>
            `;

            // 두 번째 그룹 (스킬 정보)
            const skillGroup = document.createElement('div');
            skillGroup.className = 'mobile-header-group';
            skillGroup.innerHTML = `
                <span>스킬</span>
                <span>분류/목표</span>
            `;

            // 세 번째 그룹 (옵션/수치)
            const valueGroup = document.createElement('div');
            valueGroup.className = 'mobile-header-group';
            valueGroup.innerHTML = `
                <span>옵션</span>
                <span>수치/시간</span>
            `;

            headerContainer.appendChild(charGroup);
            headerContainer.appendChild(skillGroup);
            headerContainer.appendChild(valueGroup);

            // 테이블 컨테이너의 맨 앞에 헤더 추가
            const tableContainer = document.querySelector('.defense-table-container');
            tableContainer.insertBefore(headerContainer, tableContainer.firstChild);

            // 모바일에서 빈 캐릭터 이름 처리
            this.updateMobileCharNames();

            // 화면 크기 변경 시 캐릭터 이름 업데이트
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 768) {
                    this.updateMobileCharNames();
                }
            });
        }
    }

    updateMobileCharNames() {
        if (window.innerWidth <= 768) {
            console.log('updateMobileCharNames');
            const rows = this.tableBody.querySelectorAll('tr');
            let lastValidCharName = '';

            rows.forEach(row => {
                const charNameCell = row.querySelector('.char-name-column');
                if (charNameCell) {
                    if (charNameCell.textContent.trim()) {
                        lastValidCharName = charNameCell.textContent;
                        charNameCell.dataset.originalName = lastValidCharName;
                    } else if (lastValidCharName) {
                        charNameCell.textContent = lastValidCharName;
                        charNameCell.dataset.isInherited = 'true';
                    }
                }
            });
        } else {
            // 모바일 모드가 아닐 때는 원래 이름으로 복원
            const inheritedCells = this.tableBody.querySelectorAll('.char-name-column[data-is-inherited="true"]');
            inheritedCells.forEach(cell => {
                cell.textContent = '';
                delete cell.dataset.isInherited;
            });
        }
    }

    initializePenetrateInputs() {
        // 입력 필드 이벤트 리스너 추가
        this.revelationPenetrateInput.addEventListener('input', () => this.updatePenetrateTotal());
        this.explanationPowerInput.addEventListener('input', () => this.updatePenetrateTotal());
    }

}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new DefenseCalc();
}); 