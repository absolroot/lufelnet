class DefenseCalc {
    constructor() {
        this.tableBody = document.getElementById('defenseTableBody');
        this.penetrateTableBody = document.getElementById('penetrateTableBody');
        this.totalValue = document.querySelector('.total-value');
        this.penetrateValue = document.querySelector('.penetrate-value');
        this.finalDefenseCoefSpan = document.getElementById('finalDefenseCoef');
        this.revelationPenetrateInput = document.getElementById('revelationPenetrate');
        this.explanationPowerInput = document.getElementById('explanationPower');
        this.otherReduceInput = document.getElementById('otherReduce');
        this.baseDefenseInput = document.getElementById('baseDefenseInput');
        this.defenseCoefInput = document.getElementById('defenseCoefInput');
        this.reduceSecondLine = document.getElementById('reduceSecondLine');
        this.reduceSecondSum = document.getElementById('reduceSecondSum');
        this.reduceSecondTarget = document.getElementById('reduceSecondTarget');
        this.pierceSecondLine = document.getElementById('pierceSecondLine');
        this.pierceSecondSum = document.getElementById('pierceSecondSum');
        this.pierceSecondTarget = document.getElementById('pierceSecondTarget');
        this.orderSwitchBtn = document.getElementById('orderSwitchBtn');
        this.isPierceFirst = true; // 기본 순서: 관통 -> 방어력 감소
        this.reduceTotal = 0;
        this.penetrateTotal = 0;
        this.finalDefenseCoefValue = document.getElementById('finalDefenseCoefValue');
        this.selectedItems = new Set(); // 초기 선택 항목 설정
        this.selectedPenetrateItems = new Set(); // 관통 선택 항목
        this.buildDatasets();
        // CSV 기반 이름 매핑 프리로드
        this._csvNameMap = null; // { krName: { en, jp } }
        this._csvLoadPromise = null;
        // 원더 번역 주입을 렌더 전에 보장
        try { if (typeof DefenseI18N !== 'undefined' && DefenseI18N.enrichDefenseDataWithWonderNames) { DefenseI18N.enrichDefenseDataWithWonderNames(); } } catch(_) {}
        this.initializeBossSelect(); // 보스 선택 초기화를 먼저 실행
        this.initializeTable(); // 그 다음 테이블 초기화
        this.initializePenetrateTable(); // 관통 테이블 초기화
        this.initializeMobileHeader();
        this.initializePenetrateInputs();

        // 초기 렌더 후 UI 텍스트 번역 적용 (전용 i18n)
        try { if (typeof DefenseI18N !== 'undefined' && DefenseI18N.updateLanguageContent) { DefenseI18N.updateLanguageContent(document); } } catch(_) {}
        // 사전 매핑 단어 번역(원더/계시 등)
        try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(document); } } catch(_) {}

        // 스포일러 토글 이벤트: 목록 재렌더링
        try {
            const sp = document.getElementById('showSpoilerToggle');
            if (sp) {
                sp.addEventListener('change', async () => {
                    await this.renderAccordion(this.tableBody, false);
                    await this.renderAccordion(this.penetrateTableBody, true);
                });
            }
        } catch(_) {}

        if (this.orderSwitchBtn) {
            this.orderSwitchBtn.addEventListener('click', () => {
                this.isPierceFirst = !this.isPierceFirst;
                this.applyOrderUI();
                this.updateDamageCalculation();
            });
        }

        // 초기 표시 강제: 합계/목표 라벨/구분자/목표를 항상 보이도록 설정
        this.applyOrderUI();
        // 초기 값은 실제 계산 결과로 채워지도록 함

        // 캐릭터 이름 번역이 늦게 로드되는 경우 대비해 후처리 스케줄링
        this.scheduleTranslateCharacterNames();
    }

    getCurrentLang() {
        try {
            if (typeof I18NUtils !== 'undefined' && I18NUtils.getCurrentLanguageSafe) return I18NUtils.getCurrentLanguageSafe();
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) return LanguageRouter.getCurrentLanguage();
        } catch(_) {}
        return 'kr';
    }

    getBossDisplayName(boss) {
        const lang = this.getCurrentLang();
        const isSea = !!boss.isSea;
        let prefix = '';
        if (lang === 'en') prefix = isSea ? '[SoS] ' : '[NTMR] ';
        else if (lang === 'jp') prefix = isSea ? '[心の海] ' : '[閼兇夢] ';
        else prefix = isSea ? '[바다] ' : '[흉몽] ';

        let baseName = boss.name;
        if (lang === 'en' && boss.name_en) baseName = boss.name_en;
        else if (lang === 'jp' && boss.name_jp) baseName = boss.name_jp;

        // CSV 이름 매핑 적용 (단일/복합 모두). 제공된 name_en/name_jp를 우선 적용한 뒤, 매핑이 가능하면 매핑으로 대체
        try {
            if (lang !== 'kr' && typeof baseName === 'string') {
                const mapped = this.mapNameUsingCsv(baseName, lang);
                // 매핑 실패 시 원문과 동일 문자열이 돌아오므로, 그 경우에는 덮어쓰지 않음
                if (mapped && mapped.trim() && mapped !== baseName) baseName = mapped;
            }
        } catch(_) {}

        return `${prefix}${baseName}`;
    }

    async ensureCsvNameMapLoaded() {
        if (this._csvNameMap) return this._csvNameMap;
        if (!this._csvLoadPromise) {
            const url = `${BASE_URL}/data/kr/wonder/persona_skill_from.csv?v=${typeof APP_VERSION!== 'undefined' ? APP_VERSION : '1'}`;
            this._csvLoadPromise = fetch(url)
                .then(r => r.text())
                .then(text => {
                    const map = {};
                    const lines = text.split(/\r?\n/).filter(l => l.trim().length>0);
                    // skip header
                    for (let i=1;i<lines.length;i++) {
                        const row = lines[i].split(',');
                        if (row.length < 3) continue;
                        const kr = row[0]?.trim();
                        const en = row[1]?.trim();
                        const jp = row[2]?.trim();
                        if (kr) map[kr] = { en, jp };
                    }
                    this._csvNameMap = map;
                    return map;
                })
                .catch(_=> (this._csvNameMap = {}));
        }
        return this._csvLoadPromise;
    }

    mapNameUsingCsv(nameKr, lang) {
        if (!nameKr) return null;
        const map = this._csvNameMap;
        if (!map) return null;
        const parts = String(nameKr).split('/').map(s => s.trim()).filter(Boolean);
        const out = parts.map(part => {
            const rec = map[part];
            if (!rec) return part;
            if (lang === 'en' && rec.en) return rec.en;
            if (lang === 'jp' && rec.jp) return rec.jp;
            return part;
        });
        return out.join(' / ');
    }

    getGroupDisplayName(groupName) {
        const lang = this.getCurrentLang();
        // 우선 특수 카테고리(원더/계시/공통)는 사전으로 번역
        try {
            if (typeof DefenseI18N !== 'undefined' && DefenseI18N.translateGroupName) {
                const translated = DefenseI18N.translateGroupName(groupName);
                if (translated && translated !== groupName) return translated;
            }
        } catch(_) {}
        const excluded = groupName === '원더' || groupName === '계시' || groupName === '공통';
        if (excluded) return groupName; // 사전에 없으면 원문 유지
        try {
            if (typeof characterData !== 'undefined' && characterData[groupName]) {
                if (lang === 'en') return characterData[groupName].codename || groupName;
                if (lang === 'jp') return characterData[groupName].name_jp || groupName;
            }
        } catch(_) {}
        return groupName;
    }

    normalizeTextForLang(text) {
        const lang = this.getCurrentLang();
        if (!text || lang === 'kr') return text || '';
        // 의식3 -> 의식2 보정
        return String(text).replace(/의식\s*3/g, '의식2');
    }

    transformIconSrcForLang(src) {
        const lang = this.getCurrentLang();
        if (!src || lang === 'kr') return src;
        let out = src;
        // 디버프 → 버프, 디버프광역 → 버프광역
        out = out.replace('/skill-element/디버프광역', '/skill-element/버프광역')
                 .replace('/skill-element/디버프', '/skill-element/버프');
        // 의식3 이미지는 의식2로
        out = out.replace('item-mind_stat3', 'item-mind_stat2')
                 .replace('의식3', '의식2')
                 .replace('/character-detail/ritual3', '/character-detail/ritual2');
        return out;
    }

    adjustImagesForLang(root=document) {
        const lang = this.getCurrentLang();
        if (lang === 'kr') return;
        root.querySelectorAll('.defense-table-container img, .penetrate-table-container img').forEach(img => {
            if (img && img.src) {
                img.src = this.transformIconSrcForLang(img.src);
            }
        });
    }

    scheduleTranslateCharacterNames() {
        const lang = this.getCurrentLang();
        if (lang === 'kr') return;
        let tries = 0;
        const tryTranslate = () => {
            tries++;
            if (typeof characterData !== 'undefined') {
                document.querySelectorAll('tr.group-header').forEach(tr => {
                    const group = tr.getAttribute('data-group') || '';
                    const nameEl = tr.querySelector('.group-name');
                    if (nameEl) nameEl.textContent = this.getGroupDisplayName(group);
                });
                // 아이콘 경로도 언어에 맞춰 보정
                this.adjustImagesForLang(document);
                // 사전 매핑 단어 번역(원더/계시 등)
                try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(document); } } catch(_) {}
                return;
            }
            if (tries < 20) setTimeout(tryTranslate, 100);
        };
        tryTranslate();
    }

    // 새 데이터 포맷(객체) 지원: 그룹 오브젝트, 플랫 배열, id 인덱스 구성
    buildDatasets() {
        // 전역 상수 penetrateData / defenseCalcData 가 객체라고 가정 (키=그룹명, 값=아이템 배열)
        this.penetrateGroups = (typeof penetrateData === 'object' && !Array.isArray(penetrateData)) ? penetrateData : {};
        this.reduceGroups = (typeof defenseCalcData === 'object' && !Array.isArray(defenseCalcData)) ? defenseCalcData : {};

        this.penetrateOrder = Object.keys(this.penetrateGroups);
        this.reduceOrder = Object.keys(this.reduceGroups);

        this.penetrateFlat = [];
        this.reduceFlat = [];
        this.idToPenetrateItem = new Map();
        this.idToReduceItem = new Map();

        // Helper to push items and index by id
        const absorb = (groupsObj, flat, idMap) => {
            Object.keys(groupsObj).forEach(groupName => {
                const list = groupsObj[groupName] || [];
                list.forEach(item => {
                    if (!item) return;
                    // 주입: 그룹명 보관(행 렌더링/이미지 추론용)
                    // if (!item.charName) item.charName = groupName !== '계시' && groupName !== '원더' ? groupName : '';
                    console.log(item.charName);
                    if (!item.charImage && item.charName) item.charImage = `${item.charName}.webp`;
                    flat.push(item);
                    if (item.id !== undefined) idMap.set(item.id, item);
                });
            });
        };

        absorb(this.penetrateGroups, this.penetrateFlat, this.idToPenetrateItem);
        absorb(this.reduceGroups, this.reduceFlat, this.idToReduceItem);
    }

    initializeTable() {
        this.renderAccordion(this.tableBody, false);
        // 초기 합계 계산
        this.updateTotal();
    }

    initializePenetrateTable() {
        this.renderAccordion(this.penetrateTableBody, true);
        this.updatePenetrateTotal();
    }

    // 데이터 -> 캐릭터별 그룹(등장 순서 유지)
    groupByCharacter(dataList) {
        const groupOrder = [];
        const groups = new Map();
        dataList.forEach(item => {
            const groupKey = (item.charName && item.charName.trim()) ? item.charName.trim() : '-';
            if (!groups.has(groupKey)) {
                groups.set(groupKey, []);
                groupOrder.push(groupKey);
            }
            groups.get(groupKey).push(item);
        });
        return { groupOrder, groups };
    }

    // 아코디언 렌더링 (그룹 헤더 + 각 row)
    async renderAccordion(tbody, isPenetrate) {
        // 기존 내용 비움
        while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

        const order = isPenetrate ? this.penetrateOrder : this.reduceOrder;
        const groupsObj = isPenetrate ? this.penetrateGroups : this.reduceGroups;

        // 스포일러 토글에 따른 표시 캐릭터 목록 계산
        const showSpoiler = !!(document.getElementById('showSpoilerToggle') && document.getElementById('showSpoilerToggle').checked);
        let visibleNames = [];
        try {
            if (typeof CharacterListLoader !== 'undefined') {
                visibleNames = await CharacterListLoader.getVisibleNames(showSpoiler);
            }
        } catch(_) {}

        order.forEach(groupName => {
            const items = groupsObj[groupName] || [];

            // 그룹 필터링: 원더/계시/공통 제외하고 목록에 없는 캐릭터는 스킵
            if (!['원더','계시','공통'].includes(groupName)) {
                if (Array.isArray(visibleNames) && visibleNames.length > 0 && !visibleNames.includes(groupName)) {
                    return; // skip rendering this group
                }
            }

            // 그룹 헤더 행
            const headerTr = document.createElement('tr');
            headerTr.className = 'group-header';
            headerTr.setAttribute('data-group', groupName);

            // 단일 셀 헤더
            const fullTd = document.createElement('td');
            fullTd.className = 'group-header-cell';
            fullTd.setAttribute('colspan', '8');

            const inner = document.createElement('div');
            inner.className = 'group-header-inner';

            const caret = document.createElement('span');
            caret.className = 'accordion-caret';
            const isMobile = window.innerWidth <= 1200;
            const initiallyOpen = !isMobile || groupName === '계시' || groupName === '원더';
            caret.classList.toggle('open', initiallyOpen);
            caret.textContent = initiallyOpen ? '▾' : '▸';
            inner.appendChild(caret);

            const infoWrap = document.createElement('span');
            infoWrap.className = 'group-info';
            const img = document.createElement('img');
            img.src = `${BASE_URL}/assets/img/character-half/${groupName}.webp`;
            img.className = 'group-avatar';
            infoWrap.appendChild(img);
            const nameSpan = document.createElement('span');
            nameSpan.className = 'group-name';
            nameSpan.textContent = this.getGroupDisplayName(groupName);
            infoWrap.appendChild(nameSpan);
            inner.appendChild(infoWrap);
            fullTd.appendChild(inner);
            headerTr.appendChild(fullTd);

            // 토글 동작: 같은 그룹의 데이터 행 show/hide
            headerTr.addEventListener('click', () => {
                const isOpen = caret.classList.contains('open');
                caret.classList.toggle('open', !isOpen);
                caret.textContent = isOpen ? '▸' : '▾';
                items.forEach(it => {
                    if (it.__rowEl) it.__rowEl.style.display = isOpen ? 'none' : '';
                });
            });

            tbody.appendChild(headerTr);

            // 데이터 행들
            items.forEach(item => {
                const row = this.createTableRow(item, isPenetrate, groupName);
                // 초기 표시 상태 (모바일: '계시','원더'만 펼침, 데스크탑: 전체 펼침)
                row.style.display = initiallyOpen ? '' : 'none';
                row.classList.add('group-row');
                row.setAttribute('data-group', groupName);
                // 참조 저장해 토글에 사용
                try {
                    if (!Object.prototype.hasOwnProperty.call(item, '__rowEl')) {
                        Object.defineProperty(item, '__rowEl', { value: row, writable: true, configurable: true });
                    } else {
                        item.__rowEl = row;
                    }
                } catch(_) {
                    try { item.__rowEl = row; } catch(_) {}
                }
                tbody.appendChild(row);
            });

            // 그룹 헤더 렌더 후 텍스트 번역 보정
            try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(tbody); } } catch(_) {}
        });
    }

    createTableRow(data, isPenetrate = false, groupName = '') {
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
        
        // char-img-column / char-name-column 제거: 데이터 행에서는 표시 안 함
        
        // 목표 열
        const targetCell = document.createElement('td');
        targetCell.className = 'target-column';
        targetCell.textContent = this.normalizeTextForLang(data.target);
        targetCell.setAttribute('data-target', data.target);
        row.appendChild(targetCell);
        
        // 스킬 아이콘 열
        const skillIconCell = document.createElement('td');
        skillIconCell.className = 'skill-icon-column';
        if (data.skillIcon) {
            const skillIcon = document.createElement('img');
            skillIcon.src = this.transformIconSrcForLang(data.skillIcon);
            
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
        
        // 스킬 이름 열 (분류 + 이름 결합)
        const skillNameCell = document.createElement('td');
        skillNameCell.className = 'skill-name-column';
        const currentLang = (typeof LanguageRouter !== 'undefined') ? LanguageRouter.getCurrentLanguage() : 'kr';
        let localizedName = '';
        // 기본: 현지화된 이름 우선
        if (currentLang === 'en') {
            localizedName = (data.skillName_en && String(data.skillName_en).trim()) ? data.skillName_en : '';
        } else if (currentLang === 'jp') {
            localizedName = (data.skillName_jp && String(data.skillName_jp).trim()) ? data.skillName_jp : '';
        }
        // 폴백 규칙: EN/JP에서도 원더 그룹의 전용무기/페르소나/스킬만 KR 이름으로 폴백 허용
        if (!localizedName) {
            const isWonder = groupName === '원더';
            const typeStr = String(data.type || '');
            const isWonderDisplayType = isWonder && (typeStr === '전용무기' || typeStr === '페르소나' || typeStr === '스킬');
            if (currentLang !== 'kr' && isWonderDisplayType) {
                localizedName = data.skillName || '';
            } else if (currentLang === 'kr') {
                localizedName = data.skillName || '';
            } else {
                // 그 외 언어/그룹은 폴백하지 않음 → 타입만 표시
                localizedName = '';
            }
        }

        const typeSpan = document.createElement('span');
        typeSpan.className = 'skill-type-label';
        typeSpan.textContent = this.normalizeTextForLang(data.type);
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'skill-name-text';
        
        if (currentLang === 'kr') {
            // KR: 분류 + 이름 모두 표기
            nameSpan.textContent = localizedName;
            skillNameCell.appendChild(typeSpan);
            if (localizedName) {
                const sep = document.createTextNode(' · ');
                skillNameCell.appendChild(sep);
                skillNameCell.appendChild(nameSpan);
            }
        } else {
            // EN/JP: 번역된 이름이 존재하면 분류 + 이름, 없으면 분류만 강조
            if (localizedName && localizedName.trim()) {
                nameSpan.textContent = localizedName;
                skillNameCell.appendChild(typeSpan);
                const sep = document.createTextNode(' · ');
                skillNameCell.appendChild(sep);
                skillNameCell.appendChild(nameSpan);
            } else {
                // 분류만 강조
                typeSpan.classList.add('type-only');
                skillNameCell.appendChild(typeSpan);
            }
        }
        row.appendChild(skillNameCell);
        
        // 옵션 열
        const optionCell = document.createElement('td');
        optionCell.className = 'option-column';
        if (data.options && data.options.length > 0) {
            const select = document.createElement('select');
            data.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = this.normalizeTextForLang(option);
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
        durationCell.textContent = this.normalizeTextForLang(data.duration);
        row.appendChild(durationCell);
        
        // 비고 열
        const noteCell = document.createElement('td');
        noteCell.className = 'note-column';
        // note 다국어 지원
        let noteText = data.note || '';
        const lang = this.getCurrentLang();
        if (lang === 'en' && data.note_en) noteText = data.note_en;
        else if (lang === 'jp' && data.note_jp) noteText = data.note_jp;
        noteCell.textContent = this.normalizeTextForLang(noteText);
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
            .map(id => this.idToReduceItem.get(id))
            .filter(Boolean)
            .reduce((sum, item) => sum + (item.value || 0), 0);
        const extra = parseFloat(this.otherReduceInput && this.otherReduceInput.value) || 0;
        this.reduceTotal = Math.max(0, total + Math.max(0, extra));
        this.updateDamageCalculation();
    }

    updatePenetrateTotal() {
        // 테이블에서 선택된 항목들의 합계
        const tableTotal = Array.from(this.selectedPenetrateItems)
            .map(id => this.idToPenetrateItem.get(id))
            .filter(Boolean)
            .reduce((sum, item) => sum + (item.value || 0), 0);
        
        // 입력 필드의 값 (숫자가 아닌 경우 0으로 처리)
        const revelationValue = parseFloat(this.revelationPenetrateInput.value) || 0;
        const explanationValue = parseFloat(this.explanationPowerInput.value) || 0;
        
        // 전체 합계 계산
        const total = tableTotal + revelationValue + explanationValue;
        const capped = Math.min(100, Math.max(0, total));
        
        // 합계 표시
        this.penetrateTotal = capped;
        
        // 대미지 계산 업데이트
        this.updateDamageCalculation();
    }

    initializeBossSelect() {
        this.bossSelect = document.getElementById('bossSelect');
        this.damageIncreaseDiv = document.querySelector('.damage-increase');
        this.noDefReduceSpan = document.getElementById('noDefReduce');
        this.withDefReduceSpan = document.getElementById('withDefReduce');
        this.damageCard = document.querySelector('.top-row-2-damage');

        // 보스 선택 옵션 추가
        bossData.forEach(boss => {
            const option = document.createElement('option');
            option.value = boss.id;
            option.textContent = this.getBossDisplayName(boss);
            if (boss.id === 1) {  // id가 1인 보스를 기본 선택
                option.selected = true;
            }
            this.bossSelect.appendChild(option);
        });

        // CSV 이름 맵이 늦게 로드될 수 있으므로, 로드 완료 후 옵션 텍스트를 한 번 더 갱신
        try {
            this.ensureCsvNameMapLoaded().then(() => {
                Array.from(this.bossSelect.options).forEach(opt => {
                    const boss = bossData.find(b => b.id === parseInt(opt.value));
                    if (boss) opt.textContent = this.getBossDisplayName(boss);
                });
            });
        } catch(_) {}

        this.bossSelect.addEventListener('change', () => {
            const boss = bossData.find(b => b.id === parseInt(this.bossSelect.value));
            if (boss) {
                if (this.baseDefenseInput) {
                    this.baseDefenseInput.value = boss.baseDefense === '-' ? '' : boss.baseDefense;
                }
                if (this.defenseCoefInput) {
                    this.defenseCoefInput.value = boss.defenseCoef === '-' ? '' : boss.defenseCoef;
                }
            }
            this.updateDamageCalculation();
        });
        
        // 입력 변경 시 실시간 반영
        if (this.baseDefenseInput) {
            this.baseDefenseInput.addEventListener('input', () => this.updateDamageCalculation());
        }
        if (this.defenseCoefInput) {
            this.defenseCoefInput.addEventListener('input', () => this.updateDamageCalculation());
        }

        // 초기: CSV 이름 맵 선로딩 후 기본 선택된 보스 값으로 입력 필드 채우기
        const initBoss = bossData.find(b => b.id === parseInt(this.bossSelect.value));
        // 비동기 로딩 (백그라운드)
        try { this.ensureCsvNameMapLoaded(); } catch(_) {}
        if (initBoss) {
            if (this.baseDefenseInput) this.baseDefenseInput.value = initBoss.baseDefense === '-' ? '' : initBoss.baseDefense;
            if (this.defenseCoefInput) this.defenseCoefInput.value = initBoss.defenseCoef === '-' ? '' : initBoss.defenseCoef;
        }

        this.updateDamageCalculation();
        try { if (typeof DefenseI18N !== 'undefined' && DefenseI18N.updateLanguageContent) { DefenseI18N.updateLanguageContent(document); } } catch(_) {}
        try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(document); } } catch(_) {}
    }

    updateDamageCalculation() {
        // 입력 값 확인
        const baseDefense = parseFloat(this.baseDefenseInput && this.baseDefenseInput.value);
        const defenseCoef = parseFloat(this.defenseCoefInput && this.defenseCoefInput.value);

        if (!isFinite(baseDefense) || !isFinite(defenseCoef)) {
            this.resetDamageDisplay();
            return;
        }

        const penetrateTotal = Math.max(0, this.penetrateTotal || 0);
        const reduceTotalRaw = Math.max(0, this.reduceTotal || 0);

        // 계산은 순서와 무관하게 동일한 결과가 나오도록 정의
        // 1) 관통 적용
        const afterPierceCoef = penetrateTotal >= 100 ? 0 : defenseCoef * (100 - penetrateTotal) / 100;
        // 2) 방어력 감소 적용 (0 하한)
        const finalCoef = Math.max(0, afterPierceCoef - reduceTotalRaw);

        // UI 표기만 순서 스위치에 맞춰 라벨/목표를 변경
        const reduceLabel = document.getElementById('reduceSumTargetLabel');
        const pierceLabel = document.getElementById('pierceSumTargetLabel');
        if (reduceLabel) reduceLabel.style.visibility = 'visible';
        if (pierceLabel) pierceLabel.style.visibility = 'visible';

        if (this.isPierceFirst) {
            // 방깎 카드가 두 번째이므로 목표는 "관통 적용 후 방어계수"
            this.setSumTarget('reduce', reduceTotalRaw, afterPierceCoef);
            this.setSumTarget('pierce', penetrateTotal, Number.NaN);
        } else {
            // 관통 카드가 두 번째일 때 목표 관통치(%)
            let pierceTarget = 100;
            if (isFinite(defenseCoef) && defenseCoef > 0) {
                pierceTarget = 100 - (reduceTotalRaw / defenseCoef) * 100;
                pierceTarget = Math.max(0, Math.min(100, pierceTarget));
            }
            this.setSumTarget('pierce', penetrateTotal, pierceTarget);
            this.setSumTarget('reduce', reduceTotalRaw, Number.NaN);
        }

        // 최종 방어 계수 표기 (새 카드)
        if (this.finalDefenseCoefValue) this.finalDefenseCoefValue.textContent = `${finalCoef.toFixed(1)}%`;

        // 대미지 계산
        const noReduceDamage = 1 - this.calculateDamage(baseDefense, defenseCoef);
        const withReduceDamage = 1 - this.calculateDamage(baseDefense, finalCoef);
        const damageIncrease = ((withReduceDamage / noReduceDamage) - 1) * 100;

        // 화면 업데이트
        if (this.damageIncreaseDiv) {
            this.damageIncreaseDiv.textContent = damageIncrease >= 0
                ? `+${damageIncrease.toFixed(1)}%`
                : `${damageIncrease.toFixed(1)}%`;
        }
        if (this.noDefReduceSpan) {
            this.noDefReduceSpan.textContent = isFinite(noReduceDamage) ? noReduceDamage.toFixed(3) : '-';
        }
        if (this.withDefReduceSpan) {
            this.withDefReduceSpan.textContent = isFinite(withReduceDamage) ? withReduceDamage.toFixed(3) : '-';
        }
        if (this.damageCard) this.damageCard.style.display = '';

        // 하단 중복 표기는 제거됨 (위에서 UI표기를 이미 처리함)
    }

    calculateDamage(baseDefense, defenseCoef) {
        const numerator = baseDefense * (defenseCoef / 100);
        const denominator = numerator + 1400;
        return numerator / denominator;
    }

    resetDamageDisplay() {
        this.damageIncreaseDiv.textContent = '-';
        this.noDefReduceSpan.textContent = '-';
        this.withDefReduceSpan.textContent = '-';
        this.finalDefenseCoefSpan.textContent = '-';
        document.getElementById('finalDefenseCoef2').textContent = '-';
        if (this.reduceSecondLine) this.reduceSecondLine.style.display = 'none';
        if (this.pierceSecondLine) this.pierceSecondLine.style.display = 'none';
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
            const tableContainer = document.querySelector('.defense-table-container');
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
        if (window.innerWidth <= 1200) {
            //console.log('updateMobileCharNames');
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
        if (this.otherReduceInput) this.otherReduceInput.addEventListener('input', () => this.updateTotal());
    }

    applyOrderUI() {
        // 항상 합계/목표 라벨과 구분자/목표를 표시 상태로 유지
        const reduceLabel = document.getElementById('reduceSumTargetLabel');
        const pierceLabel = document.getElementById('pierceSumTargetLabel');
        const pierceSep = document.getElementById('pierceValueSep');
        const pierceTarget = document.getElementById('pierceValueTarget');
        const reduceSep = document.getElementById('reduceValueSep');
        const reduceTarget = document.getElementById('reduceValueTarget');

        if (reduceLabel) reduceLabel.style.visibility = 'visible';
        if (pierceLabel) pierceLabel.style.visibility = 'visible';
        if (reduceSep) reduceSep.style.display = '';
        if (reduceTarget) reduceTarget.style.display = '';
        if (pierceSep) pierceSep.style.display = '';
        if (pierceTarget) pierceTarget.style.display = '';
    }

    setSumOnly(type, sum) {
        if (type === 'pierce') {
            const vSum = document.getElementById('pierceValueSum');
            const vSep = document.getElementById('pierceValueSep');
            const vTarget = document.getElementById('pierceValueTarget');
            if (vSum) vSum.textContent = `${sum.toFixed(1)}%`;
            if (vSep) vSep.style.display = '';
            if (vTarget) { vTarget.textContent = '-'; vTarget.style.display = ''; }
        } else {
            const vSum = document.getElementById('reduceValueSum');
            const vSep = document.getElementById('reduceValueSep');
            const vTarget = document.getElementById('reduceValueTarget');
            if (vSum) vSum.textContent = `${sum.toFixed(1)}%`;
            if (vSep) vSep.style.display = '';
            if (vTarget) { vTarget.textContent = '-'; vTarget.style.display = ''; }
        }
    }

    setSumTarget(type, sum, target) {
        if (type === 'pierce') {
            const vSum = document.getElementById('pierceValueSum');
            const vSep = document.getElementById('pierceValueSep');
            const vTarget = document.getElementById('pierceValueTarget');
            if (vSum) vSum.textContent = `${sum.toFixed(1)}%`;
            if (vSep) vSep.style.display = '';
            if (vTarget) {
                if (isFinite(target)) {
                    vTarget.textContent = `${target.toFixed(1)}%`;
                } else {
                    vTarget.textContent = '-';
                }
                vTarget.style.display = '';
            }
        } else {
            const vSum = document.getElementById('reduceValueSum');
            const vSep = document.getElementById('reduceValueSep');
            const vTarget = document.getElementById('reduceValueTarget');
            if (vSum) vSum.textContent = `${sum.toFixed(1)}%`;
            if (vSep) vSep.style.display = '';
            if (vTarget) {
                if (isFinite(target)) {
                    vTarget.textContent = `${target.toFixed(1)}%`;
                } else {
                    vTarget.textContent = '-';
                }
                vTarget.style.display = '';
            }
        }
    }

}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new DefenseCalc();
}); 