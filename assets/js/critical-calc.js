class criticalCalc {
    constructor() {
        this.tableBody = document.getElementById('criticalTableBody');
        this.totalValue = document.querySelector('.total-value');
        this.selectedItems = new Set(); // 초기 선택 항목 비움
        this.initializeTable();
        this.initializeMobileHeader();
    }

    initializeTable() {
        criticalCalcData.forEach(data => {
            const row = this.createTableRow(data);
            this.tableBody.appendChild(row);
        });
        this.updateTotal();
    }

    createTableRow(data) {
        const row = document.createElement('tr');
        
        if (!data.charName && data.id !== 1) {
            row.classList.add('empty-char');
        }
        
        // 체크박스 열
        const checkCell = document.createElement('td');
        checkCell.className = 'check-column';
        const checkbox = document.createElement('img');
        checkbox.src = '{{ site.baseurl }}/assets/img/ui/check-off.png';
        checkbox.onclick = () => this.toggleCheck(checkbox, data);
        checkCell.appendChild(checkbox);
        row.appendChild(checkCell);
        
        // 캐릭터 이미지 열
        const charImgCell = document.createElement('td');
        charImgCell.className = 'char-img-column';
        if (data.charImage) {
            const charImg = document.createElement('img');
            charImg.src = `{{ site.baseurl }}/assets/img/character-half/${data.charImage}`;
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
        
        return row;
    }

    toggleCheck(checkbox, data) {
        const isChecked = checkbox.src.includes('check-on');
        checkbox.src = `{{ site.baseurl }}/assets/img/ui/check-${isChecked ? 'off' : 'on'}.png`;
        
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
        const total = Array.from(this.selectedItems)
            .map(id => criticalCalcData.find(d => d.id === id))
            .reduce((sum, item) => sum + item.value, 0);
            
        this.totalValue.textContent = `${total.toFixed(1)}%`;
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
            const tableContainer = document.querySelector('.critical-table-container');
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
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new criticalCalc();
}); 