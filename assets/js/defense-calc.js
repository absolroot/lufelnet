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
        this.windsweptCheckbox = document.getElementById('windsweptCheckbox');
        this.baseDefenseInput = document.getElementById('baseDefenseInput');
        this.defenseCoefInput = document.getElementById('defenseCoefInput');
        this.reduceSecondLine = document.getElementById('reduceSecondLine');
        this.reduceSecondSum = document.getElementById('reduceSecondSum');
        this.reduceSecondTarget = document.getElementById('reduceSecondTarget');
        this.pierceSecondLine = document.getElementById('pierceSecondLine');
        this.pierceSecondSum = document.getElementById('pierceSecondSum');
        this.pierceSecondTarget = document.getElementById('pierceSecondTarget');
        // order-switch 제거됨
        this.isPierceFirst = true; // 기본 순서: 관통 -> 방어력 감소 (계산용으로만 사용)
        this.reduceTotal = 0;
        this.penetrateTotal = 0;
        this.finalDefenseCoefValue = document.getElementById('finalDefenseCoefValue');
        this.selectedItems = new Set(); // 초기 선택 항목 설정
        this.selectedPenetrateItems = new Set(); // 관통 선택 항목
        this.buildDatasets();
        // CSV 기반 이름 매핑 프리로드
        this._csvNameMap = null; // { krName: { en, jp } }
        this._csvLoadPromise = null;
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

        // order-switch 제거됨

        // 초기 표시 강제: 합계/목표 라벨/구분자/목표를 항상 보이도록 설정
        this.applyOrderUI();
        // 초기 값은 실제 계산 결과로 채워지도록 함

        // 캐릭터 이름 번역이 늦게 로드되는 경우 대비해 후처리 스케줄링
        this.scheduleTranslateCharacterNames();

        // J&C 전용 추가 계산 스크립트가 분리되어 있으므로, 동적으로 로드 후 헤더에 컨트롤 부착
        try { this.ensureJCCalcLoadedAndAttach(); } catch(_) {}
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
        // 접두사 제거 (탭으로 분리하므로)
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

        return baseName;
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

    ensureJCCalcLoadedAndAttach() {
        // 이미 로드된 경우 바로 부착
        if (typeof JCCalc !== 'undefined' && JCCalc && typeof JCCalc.attachDesireControl === 'function') {
            // 이미 로드되어 있다면 initializeTable 등은 생성자에서 실행되었을 것이므로 헤더만 붙이면 됨 (renderAccordion 내부에서 자동 수행됨)
            // 중복 렌더링 방지: 이미 렌더링된 경우 재렌더링하지 않음
            return;
        }
    
        if (this._jcCalcLoadPromise) return this._jcCalcLoadPromise;
        
        const url = `${BASE_URL}/data/characters/J&C/JC_calc.js?v=${typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1'}`;
        this._jcCalcLoadPromise = new Promise((resolve) => {
            try {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.onload = () => {
                    // [중요] 스크립트 로드 완료 시 테이블을 강제로 다시 그려야
                    // J&C 아이템들이 registerItem을 통해 등록됩니다.
                    try { 
                        // 중복 렌더링 방지: 이미 초기화된 경우 재렌더링하지 않음
                        // initializeTable과 initializePenetrateTable은 생성자에서 이미 호출되었으므로 여기서는 호출하지 않음
                    } catch(_) {}
                    resolve();
                };
                script.onerror = () => resolve();
                document.head.appendChild(script);
            } catch(_) {
                resolve();
            }
        });
        return this._jcCalcLoadPromise;
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
            
            // SVG chevron 생성
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '16');
            svg.setAttribute('height', '16');
            svg.setAttribute('viewBox', '0 0 16 16');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (initiallyOpen) {
                // 아래를 보는 chevron (열림)
                path.setAttribute('d', 'M4 6L8 10L12 6');
            } else {
                // 오른쪽을 보는 chevron (닫힘)
                path.setAttribute('d', 'M6 4L10 8L6 12');
            }
            path.setAttribute('stroke', 'currentColor');
            path.setAttribute('stroke-width', '1.5');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            svg.appendChild(path);
            caret.appendChild(svg);
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

            // J&C 전용 Desire 레벨 입력 컨트롤 추가 (DOM 구조 구성 후)
            try {
                if (groupName === 'J&C' && typeof JCCalc !== 'undefined' && JCCalc.attachDesireControl) {
                    // isPenetrate가 true면 'penetrate', 아니면 'def' 타입을 전달
                    const type = isPenetrate ? 'penetrate' : 'def'; 
                    JCCalc.attachDesireControl(headerTr, this, type);
                }
            } catch(_) {}

            // 토글 동작: 같은 그룹의 데이터 행 show/hide
            headerTr.addEventListener('click', () => {
                const isOpen = caret.classList.contains('open');
                const newIsOpen = !isOpen;
                caret.classList.toggle('open', newIsOpen);
                
                // 그룹 헤더의 열림/닫힘 상태 클래스 업데이트
                if (newIsOpen) {
                    headerTr.classList.add('group-open');
                    headerTr.classList.remove('group-closed');
                } else {
                    headerTr.classList.add('group-closed');
                    headerTr.classList.remove('group-open');
                }
                
                // SVG chevron 업데이트
                const svg = caret.querySelector('svg');
                if (svg) {
                    const path = svg.querySelector('path');
                    if (path) {
                        if (newIsOpen) {
                            // 열림: 아래를 보는 chevron
                            path.setAttribute('d', 'M4 6L8 10L12 6');
                        } else {
                            // 닫힘: 오른쪽을 보는 chevron
                            path.setAttribute('d', 'M6 4L10 8L6 12');
                        }
                    }
                }
                
                items.forEach(it => {
                    if (it.__rowEl) {
                        if (newIsOpen) {
                            // 모바일에서는 grid, 데스크탑에서는 인라인 스타일 제거하여 CSS 적용
                            const isMobile = window.innerWidth <= 1200;
                            if (isMobile) {
                                it.__rowEl.style.setProperty('display', 'grid', 'important');
                            } else {
                                // 데스크탑에서는 인라인 스타일 제거
                                it.__rowEl.style.removeProperty('display');
                            }
                        } else {
                            // 모바일 CSS의 !important를 덮어쓰기 위해 !important 사용
                            it.__rowEl.style.setProperty('display', 'none', 'important');
                        }
                    }
                });
            });
            
            // 초기 상태 클래스 설정
            if (initiallyOpen) {
                headerTr.classList.add('group-open');
            } else {
                headerTr.classList.add('group-closed');
            }

            tbody.appendChild(headerTr);

            // 데이터 행들
            items.forEach((item, index) => {
                const row = this.createTableRow(item, isPenetrate, groupName);
                // 초기 표시 상태 (모바일: '계시','원더'만 펼침, 데스크탑: 전체 펼침)
                if (initiallyOpen) {
                    const isMobile = window.innerWidth <= 1200;
                    if (isMobile) {
                        row.style.setProperty('display', 'grid', 'important');
                    } else {
                        // 데스크탑에서는 인라인 스타일 제거
                        row.style.removeProperty('display');
                    }
                } else {
                    // 모바일 CSS의 !important를 덮어쓰기 위해 !important 사용
                    row.style.setProperty('display', 'none', 'important');
                }
                row.classList.add('group-row');
                row.setAttribute('data-group', groupName);
                
                // 각 그룹의 마지막 row에 클래스 추가
                if (index === items.length - 1) {
                    row.classList.add('group-last-row');
                }
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
        
        // 모바일에서 원더/계시 그룹이고 skill-name-text가 있을 경우 type-label과 구분자 제거
        const isMobile = window.innerWidth <= 1200;
        const isWonder = groupName === '원더';
        const isRevelation = groupName === '계시';
        const hasNameText = localizedName && localizedName.trim();
        const shouldHideTypeLabel = isMobile && (isWonder || isRevelation) && hasNameText;
        
        if (currentLang === 'kr') {
            // KR: 분류 + 이름 모두 표기
            nameSpan.textContent = localizedName;
            if (!shouldHideTypeLabel) {
                skillNameCell.appendChild(typeSpan);
            }
            if (localizedName) {
                if (!shouldHideTypeLabel) {
                    const sep = document.createTextNode('　');
                    skillNameCell.appendChild(sep);
                }
                skillNameCell.appendChild(nameSpan);
            }
        } else {
            // EN/JP: 번역된 이름이 존재하면 분류 + 이름, 없으면 분류만 강조
            if (localizedName && localizedName.trim()) {
                nameSpan.textContent = localizedName;
                if (!shouldHideTypeLabel) {
                    skillNameCell.appendChild(typeSpan);
                    const sep = document.createTextNode('　');
                    skillNameCell.appendChild(sep);
                }
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

            // 표시 라벨/값/기본값/수치 매핑의 언어별 동작
            const lang = this.getCurrentLang();
            const baseOptions = Array.isArray(data.options) ? data.options : [];
            let labelOptions = baseOptions;
            if (lang === 'en' && Array.isArray(data.options_en) && data.options_en.length === baseOptions.length) {
                labelOptions = data.options_en;
            } else if (lang === 'jp' && Array.isArray(data.options_jp) && data.options_jp.length === baseOptions.length) {
                labelOptions = data.options_jp;
            }

            // values 매핑: 언어 우선, 폴백 KR
            const valuesLang = (lang === 'en' && data.values_en) ? data.values_en
                              : (lang === 'jp' && data.values_jp) ? data.values_jp
                              : null;
            const valuesBase = data.values || null;

            // 기본 선택 옵션: 언어 우선, 폴백 KR
            const defaultLangOption = (lang === 'en' && data.defaultOption_en) ? data.defaultOption_en
                                   : (lang === 'jp' && data.defaultOption_jp) ? data.defaultOption_jp
                                   : null;

            baseOptions.forEach((baseOpt, idx) => {
                const label = labelOptions[idx] !== undefined ? labelOptions[idx] : baseOpt;
                const optionElement = document.createElement('option');
                // value는 표시되는 언어 라벨로 설정하고, KR 키는 data-base로 보관 (폴백용)
                optionElement.value = label;
                optionElement.setAttribute('data-base', baseOpt);
                optionElement.textContent = this.normalizeTextForLang(label);
                // 기본 선택: 언어 기본값 → KR 기본값 순
                if ((defaultLangOption && label === defaultLangOption) || (data.defaultOption && baseOpt === data.defaultOption)) {
                    optionElement.selected = true;
                }
                select.appendChild(optionElement);
            });
            // 옵션 변경 시 수치 업데이트
            select.onchange = () => {
                const selectedLabel = select.value;
                const selectedBase = select.options[select.selectedIndex]?.getAttribute('data-base');
                let nextValue = null;
                if (valuesLang && Object.prototype.hasOwnProperty.call(valuesLang, selectedLabel)) {
                    nextValue = valuesLang[selectedLabel];
                } else if (valuesBase && selectedBase && Object.prototype.hasOwnProperty.call(valuesBase, selectedBase)) {
                    nextValue = valuesBase[selectedBase];
                }
                if (nextValue !== null && nextValue !== undefined) {
                    // J&C 전용: 기본값을 갱신한 뒤 Desire 보정 적용
                    // 예외 아이템은 Desire 보정 제외
                    const isExcluded = (String(data.id) === 'jc3');
                    
                    if (!isExcluded && groupName === 'J&C' && typeof JCCalc !== 'undefined' && JCCalc.onOptionChanged) {
                        try {
                            data.__jcBaseValue = nextValue;
                            data.value = nextValue;
                            JCCalc.onOptionChanged(data, valueCell, isPenetrate, this);
                            return;
                        } catch(_) {}
                    }
                    data.value = nextValue;
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
        
        // J&C 전용 페르소나 성능 보정
        // id가 'jc3' 인 경우는 보정 제외 
        const isExcluded = (String(data.id) === 'jc3');
        
        if (!isExcluded && groupName === 'J&C' && typeof JCCalc !== 'undefined' && JCCalc.registerItem) {
            try {
                // 타입 명시: isPenetrate가 true면 'penetrate', 아니면 'def'
                const type = isPenetrate ? 'penetrate' : 'def';
                JCCalc.registerItem(data, valueCell, type, this);
            } catch(_) {
                valueCell.textContent = `${data.value}%`;
            }
        } else {
            valueCell.textContent = `${data.value}%`;
        }
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
        
        // note가 비어있으면 행에 클래스 추가 (모바일에서 3행 제거용)
        if (!noteText || !noteText.trim()) {
            row.classList.add('no-note');
        }
        
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
        this.bossList = document.getElementById('bossList');
        this.bossTypeSea = document.getElementById('bossTypeSea');
        this.bossTypeNightmare = document.getElementById('bossTypeNightmare');
        this.currentBossType = 'sea'; // 기본값
        this.selectedBossId = null;
        this.damageIncreaseDiv = document.querySelector('.damage-increase');
        this.noDefReduceSpan = document.getElementById('noDefReduce');
        this.withDefReduceSpan = document.getElementById('withDefReduce');

        // 바다/흉몽 탭 이벤트
        if (this.bossTypeSea) {
            this.bossTypeSea.addEventListener('click', () => {
                this.currentBossType = 'sea';
                this.bossTypeSea.classList.add('active');
                this.bossTypeNightmare.classList.remove('active');
                this.renderBossList();
            });
        }
        if (this.bossTypeNightmare) {
            this.bossTypeNightmare.addEventListener('click', () => {
                this.currentBossType = 'nightmare';
                this.bossTypeNightmare.classList.add('active');
                this.bossTypeSea.classList.remove('active');
                this.renderBossList();
            });
        }

        // 초기: 기본 선택된 보스 확인 및 탭 설정
        const initBoss = bossData.find(b => b.id === 1);
        if (initBoss) {
            const isSea = !!initBoss.isSea;
            this.currentBossType = isSea ? 'sea' : 'nightmare';
            if (this.bossTypeSea && this.bossTypeNightmare) {
                if (isSea) {
                    this.bossTypeSea.classList.add('active');
                    this.bossTypeNightmare.classList.remove('active');
                } else {
                    this.bossTypeNightmare.classList.add('active');
                    this.bossTypeSea.classList.remove('active');
                }
            }
        }

        // 리스트 컨테이너에 드래그 스크롤 기능 추가
        const bossListContainer = document.querySelector('.boss-list-container');
        if (bossListContainer) {
            let isDragging = false;
            let startY = 0;
            let scrollTop = 0;
            let startTime = 0;
            let startTarget = null;
            
            bossListContainer.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('boss-list-item') || e.target.closest('.boss-list-item')) {
                    startTarget = e.target.closest('.boss-list-item');
                    startTime = Date.now();
                    startY = e.clientY;
                    scrollTop = bossListContainer.scrollTop;
                    return;
                }
                isDragging = true;
                startY = e.clientY;
                scrollTop = bossListContainer.scrollTop;
                bossListContainer.style.cursor = 'grabbing';
                e.preventDefault();
            });
            
            bossListContainer.addEventListener('touchstart', (e) => {
                if (e.target.classList.contains('boss-list-item') || e.target.closest('.boss-list-item')) {
                    startTarget = e.target.closest('.boss-list-item');
                    startTime = Date.now();
                    startY = e.touches[0].clientY;
                    scrollTop = bossListContainer.scrollTop;
                    return;
                }
                isDragging = true;
                startY = e.touches[0].clientY;
                scrollTop = bossListContainer.scrollTop;
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (startTarget && Math.abs(e.clientY - startY) > 5) {
                    // 드래그로 판단
                    isDragging = true;
                    startTarget = null;
                }
                if (isDragging && bossListContainer) {
                    const deltaY = e.clientY - startY;
                    bossListContainer.scrollTop = scrollTop - deltaY;
                }
            });
            
            document.addEventListener('touchmove', (e) => {
                if (startTarget && Math.abs(e.touches[0].clientY - startY) > 5) {
                    // 드래그로 판단
                    isDragging = true;
                    startTarget = null;
                }
                if (isDragging && bossListContainer) {
                    const deltaY = e.touches[0].clientY - startY;
                    bossListContainer.scrollTop = scrollTop - deltaY;
                    e.preventDefault();
                }
            });
            
            document.addEventListener('mouseup', (e) => {
                if (startTarget && !isDragging && Date.now() - startTime < 300) {
                    // 클릭으로 판단
                    const bossId = parseInt(startTarget.getAttribute('data-boss-id'));
                    if (bossId) this.selectBoss(bossId);
                }
                if (isDragging) {
                    isDragging = false;
                    if (bossListContainer) bossListContainer.style.cursor = '';
                }
                startTarget = null;
            });
            
            document.addEventListener('touchend', (e) => {
                if (startTarget && !isDragging && Date.now() - startTime < 300) {
                    // 클릭으로 판단
                    const bossId = parseInt(startTarget.getAttribute('data-boss-id'));
                    if (bossId) this.selectBoss(bossId);
                }
                if (isDragging) {
                    isDragging = false;
                }
                startTarget = null;
            });
        }

        // 초기 리스트 렌더링
        this.renderBossList();

        // CSV 이름 맵이 늦게 로드될 수 있으므로, 로드 완료 후 리스트를 다시 렌더링
        try {
            this.ensureCsvNameMapLoaded().then(() => {
                this.renderBossList();
            });
        } catch(_) {}
        
        // 입력 변경 시 실시간 반영
        if (this.baseDefenseInput) {
            this.baseDefenseInput.addEventListener('input', () => this.updateDamageCalculation());
        }
        if (this.defenseCoefInput) {
            this.defenseCoefInput.addEventListener('input', () => this.updateDamageCalculation());
        }

        // 초기: 기본 선택된 보스 값으로 입력 필드 채우기
        // 비동기 로딩 (백그라운드)
        try { this.ensureCsvNameMapLoaded(); } catch(_) {}
        if (initBoss) {
            this.selectBoss(initBoss.id);
        }

        this.updateDamageCalculation();
        try { if (typeof DefenseI18N !== 'undefined' && DefenseI18N.updateLanguageContent) { DefenseI18N.updateLanguageContent(document); } } catch(_) {}
        try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(document); } } catch(_) {}
    }

    renderBossList() {
        if (!this.bossList) return;
        
        // 기존 리스트 비우기
        this.bossList.innerHTML = '';

        // 현재 타입에 맞는 보스 필터링
        const filteredBosses = bossData.filter(boss => {
            const isSea = !!boss.isSea;
            return this.currentBossType === 'sea' ? isSea : !isSea;
        });

        // 리스트 아이템 생성
        filteredBosses.forEach(boss => {
            const listItem = document.createElement('div');
            listItem.className = 'boss-list-item';
            listItem.setAttribute('data-boss-id', boss.id);
            if (this.selectedBossId === boss.id) {
                listItem.classList.add('selected');
            }
            
            // 보스 아이콘 추가
            if (boss.img) {
                const icon = document.createElement('img');
                icon.src = `${BASE_URL}/assets/img/enemy/${boss.img}`;
                icon.alt = this.getBossDisplayName(boss);
                icon.className = 'boss-list-icon';
                icon.onerror = function() {
                    this.style.display = 'none';
                };
                listItem.appendChild(icon);
            }
            
            // 보스 이름 추가
            const nameSpan = document.createElement('span');
            nameSpan.className = 'boss-list-name';
            nameSpan.textContent = this.getBossDisplayName(boss);
            listItem.appendChild(nameSpan);
            
            this.bossList.appendChild(listItem);
        });
    }

    selectBoss(bossId) {
        this.selectedBossId = bossId;
        const boss = bossData.find(b => b.id === bossId);
        if (!boss) return;

        // 보스 타입에 맞는 탭으로 전환
        const isSea = !!boss.isSea;
        const bossType = isSea ? 'sea' : 'nightmare';
        if (this.currentBossType !== bossType) {
            this.currentBossType = bossType;
            if (this.bossTypeSea && this.bossTypeNightmare) {
                if (isSea) {
                    this.bossTypeSea.classList.add('active');
                    this.bossTypeNightmare.classList.remove('active');
                } else {
                    this.bossTypeNightmare.classList.add('active');
                    this.bossTypeSea.classList.remove('active');
                }
            }
            this.renderBossList();
        }

        // 선택 상태 업데이트
        if (this.bossList) {
            this.bossList.querySelectorAll('.boss-list-item').forEach(item => {
                item.classList.remove('selected');
                if (parseInt(item.getAttribute('data-boss-id')) === bossId) {
                    item.classList.add('selected');
                    // 선택된 항목이 보이도록 스크롤
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }

        // 입력 필드 업데이트
        if (this.baseDefenseInput) {
            this.baseDefenseInput.value = boss.baseDefense === '-' ? '' : boss.baseDefense;
        }
        if (this.defenseCoefInput) {
            this.defenseCoefInput.value = boss.defenseCoef === '-' ? '' : boss.defenseCoef;
        }

        this.updateDamageCalculation();
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

        /**
         * DEFENSE CALCULATION FORMULA EXPLANATION
         * 
         * The defense calculation follows a specific order to determine the final defense coefficient,
         * which is then used to calculate the damage multiplier. The order of operations ensures
         * consistent results regardless of the order in which penetration and defense reduction are applied.
         * 
         * STEP 1: Apply Penetration (Pierce)
         * ------------------------------------
         * Penetration reduces the defense coefficient multiplicatively.
         * Formula: afterPierceCoef = defenseCoef × (100 - penetrateTotal) / 100
         * 
         * - If penetration is 100% or higher, the defense coefficient becomes 0 (complete penetration)
         * - Otherwise, the defense coefficient is reduced proportionally
         * - Example: If defenseCoef = 200% and penetrateTotal = 50%, then afterPierceCoef = 200% × 50% = 100%
         * 
         * STEP 2: Apply Defense Reduction
         * ---------------------------------
         * Defense reduction subtracts a flat percentage from the defense coefficient.
         * Formula: finalCoef = max(0, afterPierceCoef - reduceTotalRaw)
         * 
         * - This is a flat subtraction, not multiplicative
         * - The result cannot go below 0 (floor at 0)
         * - Example: If afterPierceCoef = 100% and reduceTotalRaw = 30%, then finalCoef = 70%
         * 
         * STEP 3: Apply Windswept (Optional)
         * -----------------------------------
         * Windswept is a special debuff that further reduces defense by 12%.
         * Formula: displayFinalCoef = finalCoef × 0.88 (if Windswept is active)
         * 
         * - This is applied multiplicatively after all other calculations
         * - Example: If finalCoef = 70% and Windswept is active, then displayFinalCoef = 70% × 0.88 = 61.6%
         * 
         * STEP 4: Calculate Damage Multiplier
         * -------------------------------------
         * The damage multiplier is calculated using the following formula:
         * Formula: damageMultiplier = 1 - (baseDefense × defenseCoef / 100) / (baseDefense × defenseCoef / 100 + 1400)
         * 
         * - This formula uses a hyperbolic curve where 1400 is a constant divisor
         * - Lower defense coefficient results in higher damage multiplier
         * - The damage multiplier represents what percentage of damage actually goes through
         * 
         * IMPORTANT NOTES:
         * - The order of penetration and defense reduction application does not affect the final result
         * - The UI may display different intermediate values based on the selected order, but the final calculation is the same
         * - All percentages are stored as whole numbers (e.g., 200 means 200%, not 2.0)
         */

        // 계산은 순서와 무관하게 동일한 결과가 나오도록 정의
        // 1) 관통 적용
        const afterPierceCoef = penetrateTotal >= 100 ? 0 : defenseCoef * (100 - penetrateTotal) / 100;
        // 2) 방어력 감소 적용 (0 하한)
        const finalCoef = Math.max(0, afterPierceCoef - reduceTotalRaw);

        // 항상 목표치 표시 (order-switch 없이)
        // 관통 목표: 방어력 감소를 고려한 관통 필요치
        let pierceTarget = 100;
        if (isFinite(defenseCoef) && defenseCoef > 0) {
            pierceTarget = 100 - (reduceTotalRaw / defenseCoef) * 100;
            pierceTarget = Math.max(0, Math.min(100, pierceTarget));
        }
        this.setSumTarget('pierce', penetrateTotal, pierceTarget);
        
        // 관통 남은 수치 계산
        const pierceRemaining = isFinite(pierceTarget) ? Math.max(0, pierceTarget - penetrateTotal) : 0;
        const pierceRemainingEl = document.getElementById('pierceValueRemaining');
        if (pierceRemainingEl) {
            pierceRemainingEl.textContent = isFinite(pierceRemaining) ? `${pierceRemaining.toFixed(1)}%` : '-';
        }
        
        // 방어력 감소 목표: 관통 적용 후 방어계수
        this.setSumTarget('reduce', reduceTotalRaw, afterPierceCoef);
        
        // 방어력 감소 남은 수치 계산
        const reduceRemaining = isFinite(afterPierceCoef) ? Math.max(0, afterPierceCoef - reduceTotalRaw) : 0;
        const reduceRemainingEl = document.getElementById('reduceValueRemaining');
        if (reduceRemainingEl) {
            reduceRemainingEl.textContent = isFinite(reduceRemaining) ? `${reduceRemaining.toFixed(1)}%` : '-';
        }

        // 최종 방어 계수 표기 (새 카드)
        let displayFinalCoef = finalCoef;
        if (this.windsweptCheckbox && this.windsweptCheckbox.checked) {
            displayFinalCoef = finalCoef * 0.88;
        }
        if (this.finalDefenseCoefValue) this.finalDefenseCoefValue.textContent = `${displayFinalCoef.toFixed(1)}%`;

        // 대미지 계산 (windswept 적용)
        const noReduceDamage = 1 - this.calculateDamage(baseDefense, defenseCoef);
        const withReduceDamage = 1 - this.calculateDamage(baseDefense, displayFinalCoef);
        const damageIncrease = ((withReduceDamage / noReduceDamage) - 1) * 100;

        // 화면 업데이트 (4행: 최종 대미지 증가)
        const damageText = damageIncrease >= 0
            ? `+${damageIncrease.toFixed(1)}%`
            : `${damageIncrease.toFixed(1)}%`;
        if (this.damageIncreaseDiv) {
            this.damageIncreaseDiv.textContent = damageText;
        }
        if (this.noDefReduceSpan) {
            this.noDefReduceSpan.textContent = isFinite(noReduceDamage) ? noReduceDamage.toFixed(3) : '-';
        }
        if (this.withDefReduceSpan) {
            this.withDefReduceSpan.textContent = isFinite(withReduceDamage) ? withReduceDamage.toFixed(3) : '-';
        }
        // 통합 카드는 항상 표시

        // 하단 중복 표기는 제거됨 (위에서 UI표기를 이미 처리함)
    }

    /**
     * Calculates the damage reduction factor based on base defense and defense coefficient.
     * 
     * This function implements the core damage reduction formula used in Persona 5X:
     * 
     * Formula: damageReduction = (baseDefense × defenseCoef / 100) / (baseDefense × defenseCoef / 100 + 1400)
     * 
     * Where:
     * - baseDefense: The enemy's base defense stat (raw number)
     * - defenseCoef: The defense coefficient as a percentage (e.g., 200 means 200%)
     * - 1400: A constant divisor that determines the curve of damage reduction
     * 
     * The result represents what percentage of damage is REDUCED (blocked).
     * To get the damage multiplier (what percentage goes through), use: 1 - damageReduction
     * 
     * Examples:
     * - If baseDefense = 1000, defenseCoef = 200%:
     *   numerator = 1000 × 2.0 = 2000
     *   denominator = 2000 + 1400 = 3400
     *   damageReduction = 2000 / 3400 ≈ 0.588 (58.8% damage reduction)
     *   damageMultiplier = 1 - 0.588 = 0.412 (41.2% damage goes through)
     * 
     * - If baseDefense = 1000, defenseCoef = 0% (fully penetrated/reduced):
     *   numerator = 1000 × 0 = 0
     *   denominator = 0 + 1400 = 1400
     *   damageReduction = 0 / 1400 = 0 (0% damage reduction)
     *   damageMultiplier = 1 - 0 = 1.0 (100% damage goes through)
     * 
     * @param {number} baseDefense - The enemy's base defense value
     * @param {number} defenseCoef - The defense coefficient as a percentage (e.g., 200 for 200%)
     * @returns {number} The damage reduction factor (0 to 1, where 1 means 100% reduction)
     */
    calculateDamage(baseDefense, defenseCoef) {
        const numerator = baseDefense * (defenseCoef / 100);
        const denominator = numerator + 1400;
        return numerator / denominator;
    }

    resetDamageDisplay() {
        if (this.damageIncreaseDiv) this.damageIncreaseDiv.textContent = '-';
        if (this.noDefReduceSpan) this.noDefReduceSpan.textContent = '-';
        if (this.withDefReduceSpan) {
            this.withDefReduceSpan.textContent = '-';
        }
        if (this.finalDefenseCoefValue) this.finalDefenseCoefValue.textContent = '-';
        const coef2 = document.getElementById('finalDefenseCoef2');
        if (coef2) coef2.textContent = '-';
        if (this.reduceSecondLine) this.reduceSecondLine.style.display = 'none';
        if (this.pierceSecondLine) this.pierceSecondLine.style.display = 'none';
        const pierceRemainingEl = document.getElementById('pierceValueRemaining');
        if (pierceRemainingEl) pierceRemainingEl.textContent = '-';
        const reduceRemainingEl = document.getElementById('reduceValueRemaining');
        if (reduceRemainingEl) reduceRemainingEl.textContent = '-';
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
        if (this.windsweptCheckbox) this.windsweptCheckbox.addEventListener('change', () => this.updateDamageCalculation());
    }

    applyOrderUI() {
        // 항상 목표를 표시 상태로 유지 (구조 변경으로 라벨/구분자 불필요)
        const pierceTarget = document.getElementById('pierceValueTarget');
        const reduceTarget = document.getElementById('reduceValueTarget');

        if (pierceTarget) pierceTarget.style.display = '';
        if (reduceTarget) reduceTarget.style.display = '';
    }

    setSumOnly(type, sum) {
        if (type === 'pierce') {
            const vSum = document.getElementById('pierceValueSum');
            const vTarget = document.getElementById('pierceValueTarget');
            if (vSum) vSum.textContent = `${sum.toFixed(1)}%`;
            if (vTarget) { vTarget.textContent = '-'; }
        } else {
            const vSum = document.getElementById('reduceValueSum');
            const vTarget = document.getElementById('reduceValueTarget');
            if (vSum) vSum.textContent = `${sum.toFixed(1)}%`;
            if (vTarget) { vTarget.textContent = '-'; }
        }
    }

    setSumTarget(type, sum, target) {
        if (type === 'pierce') {
            const vSum = document.getElementById('pierceValueSum');
            const vTarget = document.getElementById('pierceValueTarget');
            if (vSum) vSum.textContent = `${sum.toFixed(1)}%`;
            if (vTarget) {
                if (isFinite(target)) {
                    vTarget.textContent = `${target.toFixed(1)}%`;
                } else {
                    vTarget.textContent = '-';
                }
            }
        } else {
            const vSum = document.getElementById('reduceValueSum');
            const vTarget = document.getElementById('reduceValueTarget');
            if (vSum) vSum.textContent = `${sum.toFixed(1)}%`;
            if (vTarget) {
                if (isFinite(target)) {
                    vTarget.textContent = `${target.toFixed(1)}%`;
                } else {
                    vTarget.textContent = '-';
                }
            }
        }
    }

}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 이미 초기화되었는지 확인
    if (window.defenseCalcInstance) {
        return;
    }
    
    const start = () => {
        // 원더 번역 주입을 페르소나 데이터 로드 이후에 보장
        try {
            if (typeof DefenseI18N !== 'undefined' &&
                DefenseI18N.enrichDefenseDataWithWonderNames) {
                DefenseI18N.enrichDefenseDataWithWonderNames();
            }
        } catch (_) {}
        window.defenseCalcInstance = new DefenseCalc();
    };

    if (typeof ensurePersonaFilesLoaded === 'function') {
        ensurePersonaFilesLoaded(start);
    } else {
        start();
    }
});