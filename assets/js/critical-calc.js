class CriticalCalc {
    constructor() {
        console.log('CriticalCalc constructor');
        this.buffTableBody = document.getElementById('buffTableBody');
        this.selfTableBody = document.getElementById('selfTableBody');
        this.totalValue = document.querySelector('.total-value');
        this.selectedItems = new Set();
        
        this.initializeInputs();
        this.initializeTabs();
        this.initializeTables();
        this.initializeMobileHeader();

        // 화면 크기 변경 시 테이블 다시 그리기
        window.addEventListener('resize', () => {
            console.log('resize event');
            this.buffTableBody.innerHTML = '';
            this.selfTableBody.innerHTML = '';
            this.initializeTables();
            this.updateMobileCharNames();
        });
    }

    initializeInputs() {
        this.revelationInput = document.getElementById('revelationCritical');
        this.explanationInput = document.getElementById('explanationPower');
        
        if (this.revelationInput && this.explanationInput) {
            this.revelationInput.addEventListener('input', () => this.updateTotal());
            this.explanationInput.addEventListener('input', () => this.updateTotal());
        } else {
            console.error('입력 필드를 찾을 수 없습니다.');
        }
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    initializeTables() {
        console.log('initializeTables');
        // 데이터를 버프와 자신으로 분리
        const buffData = criticalCalcData.filter(data => data.target !== '자신');
        const selfData = criticalCalcData.filter(data => data.target === '자신');

        // 각각의 테이블에 데이터 추가
        buffData.forEach(data => {
            const row = this.createTableRow(data);
            this.buffTableBody.appendChild(row);
        });

        selfData.forEach(data => {
            const row = this.createTableRow(data);
            this.selfTableBody.appendChild(row);
        });

        // default와 myPalace 항목을, 이미 내부적으로 선택된 것으로 표시합니다
        this.selectDefaultItems();
        
        this.updateTotal();
        this.updateMobileCharNames();
    }

    selectDefaultItems() {
        // default와 myPalace 항목 자동 선택
        criticalCalcData.forEach(data => {
            if (data.id === "default" || data.id === "myPalace") {
                this.selectedItems.add(data.id);
                
                // 테이블에서 해당 항목의 체크박스를 찾아 선택 상태로 변경
                const rows = document.querySelectorAll(`tr`);
                rows.forEach(row => {
                    const checkbox = row.querySelector('td.check-column img');
                    if (checkbox) {
                        const itemData = this.getDataFromRow(row);
                        if (itemData && (itemData.id === "default" || itemData.id === "myPalace")) {
                            checkbox.src = `${BASE_URL}/assets/img/ui/check-on.png`;
                            row.classList.add('selected');
                        }
                    }
                });
            }
        });
    }
    
    // 행에서 데이터를 추출하는 헬퍼 메서드
    getDataFromRow(row) {
        if (!row) return null;
        
        const skillNameCell = row.querySelector('.skill-name-column');
        if (!skillNameCell) return null;
        
        const skillName = skillNameCell.textContent.trim();
        return criticalCalcData.find(data => data.skillName === skillName);
    }

    createTableRow(data) {
        const row = document.createElement('tr');
        
        if (!data.charName && data.id !== 1) {
            row.classList.add('empty-char');
        }
        
        // 데이터 ID를 행에 저장 (선택 처리를 위해)
        if (data.id) {
            row.dataset.id = data.id;
        }
        
        // 체크박스 열
        const checkCell = document.createElement('td');
        checkCell.className = 'check-column';
        const checkbox = document.createElement('img');
        
        // default와 myPalace 항목은 처음부터 체크된 상태로 표시
        const isDefaultSelected = data.id === "default" || data.id === "myPalace";
        checkbox.src = `${BASE_URL}/assets/img/ui/check-${isDefaultSelected ? 'on' : 'off'}.png`;
        
        checkbox.onclick = () => this.toggleCheck(checkbox, data);
        checkCell.appendChild(checkbox);
        row.appendChild(checkCell);
        
        // 기본 선택 항목에 selected 클래스 추가
        if (isDefaultSelected) {
            row.classList.add('selected');
            this.selectedItems.add(data.id);
        }
        
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
            select.className = 'option-select';
            select.setAttribute('data-id', data.id);
            data.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                if (data.defaultOption && option === data.defaultOption) {
                    optionElement.selected = true;
                }
                select.appendChild(optionElement);
            });
            select.onchange = () => {
                const selectedOption = select.value;
                if (data.values && data.values[selectedOption]) {
                    data.value = data.values[selectedOption];
                    valueCell.textContent = `${data.value}%`;
                    if (this.selectedItems.has(data.id)) {
                        this.updateTotal();
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

        // 모바일용 추가 정보
        if (window.innerWidth <= 1200) {
            const mobileInfo = document.createElement('td');
            mobileInfo.className = 'mobile-info';
            mobileInfo.innerHTML = `
                <div class="mobile-skill-info">
                    <span class="mobile-skill-name">${data.skillName}</span>
                    <span class="mobile-skill-value">${data.value}%</span>
                </div>
                <div class="mobile-details">
                    ${data.target ? `<span class="mobile-target">${data.target}</span>` : ''}
                    ${data.duration ? `<span class="mobile-duration">${data.duration}</span>` : ''}
                    ${data.note ? `<span class="mobile-note">${data.note}</span>` : ''}
                </div>
            `;
            row.appendChild(mobileInfo);
        }
        
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

    updateTotal() {
        // 선택된 항목들의 값 계산 (버프 테이블)
        const buffTotal = Array.from(this.selectedItems)
            .map(id => criticalCalcData.find(d => d.id === id))
            .filter(item => item && item.target !== '자신')
            .reduce((sum, item) => {
                if (item.options && item.options.length > 0) {
                    const select = document.querySelector(`select[data-id="${item.id}"]`);
                    if (select && item.values) {
                        const selectedOption = select.value;
                        return sum + (item.values[selectedOption] || item.value);
                    }
                }
                return sum + item.value;
            }, 0);

        // 선택된 항목들의 값 계산 (자신 테이블)
        const selfTotal = Array.from(this.selectedItems)
            .map(id => criticalCalcData.find(d => d.id === id))
            .filter(item => item && item.target === '자신')
            .reduce((sum, item) => {
                if (item.options && item.options.length > 0) {
                    const select = document.querySelector(`select[data-id="${item.id}"]`);
                    if (select && item.values) {
                        const selectedOption = select.value;
                        return sum + (item.values[selectedOption] || item.value);
                    }
                }
                return sum + item.value;
            }, 0);
        
        // 계시 합계와 해명의 힘 값 가져오기
        const revelationValue = parseFloat(this.revelationInput.value) || 0;
        const explanationValue = parseFloat(this.explanationInput.value) || 0;
        
        // 총합 계산
        const total = buffTotal + selfTotal + revelationValue + explanationValue;
        
        // 결과 표시
        this.totalValue.textContent = `${total.toFixed(1)}%`;
    }

    initializeMobileHeader() {
        if (window.innerWidth <= 1200) {
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
            const tableContainer = document.querySelector('.critical-table-container');
            tableContainer.insertBefore(headerContainer, tableContainer.firstChild);

            // 모바일에서 빈 캐릭터 이름 처리
            this.updateMobileCharNames();

            // 화면 크기 변경 시 캐릭터 이름 업데이트
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 1200) {
                    this.updateMobileCharNames();
                }
            });
        }
    }

    updateMobileCharNames() {
        console.log('updateMobileCharNames called');
        if (window.innerWidth <= 1200) {
            console.log('mobile width detected:', window.innerWidth);
            // 버프 테이블 처리
            const processTable = (tableBody) => {
                if (!tableBody) {
                    console.log('tableBody is null');
                    return;
                }
                const rows = tableBody.querySelectorAll('tr');
                console.log('processing rows:', rows.length);
                let lastValidCharName = '';

                rows.forEach(row => {
                    const charNameCell = row.querySelector('.char-name-column');
                    if (charNameCell) {
                        const currentName = charNameCell.textContent.trim();
                        if (currentName) {
                            lastValidCharName = currentName;
                            charNameCell.dataset.originalName = lastValidCharName;
                            console.log('found valid name:', lastValidCharName);
                        } else if (lastValidCharName) {
                            charNameCell.textContent = lastValidCharName;
                            charNameCell.dataset.isInherited = 'true';
                            console.log('inherited name:', lastValidCharName);
                        }
                    }
                });
            };

            // 버프 테이블과 자신 테이블 모두 처리
            processTable(this.buffTableBody);
            processTable(this.selfTableBody);
        } else {
            console.log('desktop width detected:', window.innerWidth);
            // 모바일 모드가 아닐 때는 원래 이름으로 복원
            const restoreTable = (tableBody) => {
                if (!tableBody) {
                    console.log('tableBody is null');
                    return;
                }
                const inheritedCells = tableBody.querySelectorAll('.char-name-column[data-is-inherited="true"]');
                inheritedCells.forEach(cell => {
                    cell.textContent = '';
                    delete cell.dataset.isInherited;
                });
            };

            restoreTable(this.buffTableBody);
            restoreTable(this.selfTableBody);
        }
    }
} 