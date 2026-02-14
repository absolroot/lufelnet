class CriticalCalc {
    constructor() {
        this.buffTableBody = document.getElementById('buffTableBody');
        this.selfTableBody = document.getElementById('selfTableBody');
        this.totalValue = document.getElementById('totalValue');
        this.buffSumValue = document.getElementById('buffSumValue');
        this.selfSumValue = document.getElementById('selfSumValue');
        this.neededValue = document.getElementById('neededValue');
        
        this.selectedBuffItems = new Set();
        this.selectedSelfItems = new Set();

        this.buildDatasets();
        
        this.initializeInputs();
        this.initializeTabs();
        
        // 초기 렌더링
        this.initializeTables();

        try {
            const sp = document.getElementById('showSpoilerToggle');
            if (sp) {
                sp.addEventListener('change', async () => {
                    await this.renderAccordion(this.buffTableBody, false);
                    await this.renderAccordion(this.selfTableBody, true);
                });
            }
        } catch(_) {}

        window.addEventListener('resize', () => {
            this.initializeTables();
        });

        // defense-i18n.js가 revelationSumLabel과 explanationPowerLabel을 처리하므로
        // applyHardcodedI18n()을 먼저 실행한 후 defense-i18n.js를 호출해야 아이콘이 보존됨
        this.applyHardcodedI18n();
        
        try { if (typeof DefenseI18N !== 'undefined' && DefenseI18N.updateLanguageContent) { DefenseI18N.updateLanguageContent(document); } } catch(_) {}
        try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(document); } } catch(_) {}
        this.scheduleTranslateCharacterNames();

        // J&C 로드 (중복 렌더링 방지 로직 적용됨)
        try { this.ensureJCCalcLoadedAndAttach(); } catch(_) {}
    }

    applyHardcodedI18n() {
        try {
            const lang = this.getCurrentLang();
            const pack = this.getCriticalPagePack(lang);
            const texts = pack ? {
                navCurrent: pack.navCurrent,
                page: pack.pageTitle,
                buff: pack.tabBuff,
                self: pack.tabSelf,
                select: pack.thSelect,
                target: pack.thTarget,
                name: pack.thName,
                option: pack.thOption,
                value: pack.thValue,
                duration: pack.thDuration,
                note: pack.thNote,
                spoiler: pack.spoiler,
                buffSum: pack.buffSum,
                selfSum: pack.selfSum,
                needed: pack.needed,
                totalLabel: pack.totalLabel
            } : undefined;
            if (texts) {
                const setText = (id, text) => { const el=document.getElementById(id); if (el) el.textContent = text; };
                setText('navCurrent', texts.navCurrent);
                setText('page-title', texts.page);
                // revelationSumLabel과 explanationPowerLabel은 defense-i18n.js에서 처리 (아이콘 보존)
                // setText('revelationSumLabel', texts.rev); // 제거: defense-i18n.js에서 처리
                // setText('explanationPowerLabel', texts.exp); // 제거: defense-i18n.js에서 처리
                setText('tabBuff', texts.buff);
                setText('tabSelf', texts.self);
                setText('thSelect1', texts.select);
                setText('thTarget1', texts.target);
                setText('thName1', texts.name);
                setText('thOption1', texts.option);
                setText('thValue1', texts.value);
                setText('thDuration1', texts.duration);
                setText('thNote1', texts.note);
                setText('thSelect2', texts.select);
                setText('thTarget2', texts.target);
                setText('thName2', texts.name);
                setText('thOption2', texts.option);
                setText('thValue2', texts.value);
                setText('thDuration2', texts.duration);
                setText('thNote2', texts.note);
                // critical-sum-label-text만 업데이트 (아이콘 보존)
                const updateLabelText = (id, text) => {
                    const el = document.getElementById(id);
                    if (el) {
                        const textSpan = el.querySelector('.critical-sum-label-text');
                        if (textSpan) {
                            textSpan.textContent = text;
                        } else {
                            // fallback: 기존 텍스트 노드만 업데이트
                            Array.from(el.childNodes).forEach(node => {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    node.remove();
                                }
                            });
                            el.appendChild(document.createTextNode(text));
                        }
                    }
                };
                // totalLabel 업데이트 (아이콘 보존)
                const totalLabelEl = document.getElementById('totalLabel');
                if (totalLabelEl) {
                    totalLabelEl.textContent = texts.totalLabel;
                }
                updateLabelText('buffSumLabel', texts.buffSum);
                updateLabelText('selfSumLabel', texts.selfSum);
                updateLabelText('neededLabel', texts.needed);
                const sp = document.getElementById('showSpoilerLabel'); if (sp) sp.textContent = texts.spoiler;
            }
        } catch(_) {}
    }

    normalizeCalcLang(rawLang) {
        const lang = String(rawLang || '').trim().toLowerCase();
        if (lang === 'kr' || lang === 'ko') return 'kr';
        if (lang === 'en') return 'en';
        if (lang === 'jp' || lang === 'ja') return 'jp';
        if (lang === 'cn' || lang === 'tw' || lang === 'sea') return 'en';
        return 'kr';
    }

    getCriticalPagePack(lang = this.getCurrentLang()) {
        const varMap = {
            kr: 'I18N_PAGE_CRITICAL_CALC_KR',
            en: 'I18N_PAGE_CRITICAL_CALC_EN',
            jp: 'I18N_PAGE_CRITICAL_CALC_JP'
        };
        const fallbackVar = varMap.kr;
        const normalizedLang = this.normalizeCalcLang(lang);
        const varName = varMap[normalizedLang] || fallbackVar;
        return window[varName] || window[fallbackVar] || null;
    }

    getCurrentLang() {
        try {
            const urlLang = new URLSearchParams(window.location.search).get('lang');
            if (urlLang) return this.normalizeCalcLang(urlLang);

            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang) return this.normalizeCalcLang(savedLang);

            if (typeof I18NUtils !== 'undefined' && I18NUtils.getCurrentLanguageSafe) {
                return this.normalizeCalcLang(I18NUtils.getCurrentLanguageSafe());
            }
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
                return this.normalizeCalcLang(LanguageRouter.getCurrentLanguage());
            }
        } catch(_) {}
        return 'kr';
    }

    // 드롭다운 옵션 저장/로드
    saveOptionSelection(itemId, selectedValue, isSelf) {
        try {
            const storageKey = isSelf ? 'criticalCalc_selfOptions' : 'criticalCalc_buffOptions';
            const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
            saved[itemId] = selectedValue;
            localStorage.setItem(storageKey, JSON.stringify(saved));
        } catch(_) {}
    }

    loadOptionSelection(itemId, isSelf) {
        try {
            const storageKey = isSelf ? 'criticalCalc_selfOptions' : 'criticalCalc_buffOptions';
            const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
            return saved[itemId] || null;
        } catch(_) {}
        return null;
    }

    getGroupDisplayName(groupName) {
        const lang = this.getCurrentLang();
        try {
            if (typeof DefenseI18N !== 'undefined' && DefenseI18N.translateGroupName) {
                const translated = DefenseI18N.translateGroupName(groupName);
                if (translated && translated !== groupName) return translated;
            }
        } catch(_) {}

        try {
            const meta = this.getCharacterMeta(groupName);
            if (meta) {
                if (lang === 'en') return meta.codename || groupName;
                if (lang === 'jp') return meta.name_jp || groupName;
            }
        } catch(_) {}
        return groupName;
    }

    getCharacterMeta(name) {
        try {
            if (typeof characterData === 'undefined' || !name) return null;
            if (characterData[name]) return characterData[name];
            const normalize = (s) => String(s).replace(/[\s·・ㆍ\-]/g, '');
            const target = normalize(name);
            const keys = Object.keys(characterData || {});
            for (let i=0;i<keys.length;i++) {
                const k = keys[i];
                if (normalize(k) === target) return characterData[k];
            }
        } catch(_) {}
        return null;
    }

    normalizeTextForLang(text) {
        const lang = this.getCurrentLang();
        if (!text || lang === 'kr') return text || '';
        let out = String(text).replace(/의식\s*3/g, '의식2');
        // 옵션/노트의 중첩 표기를 EN/JP에서 읽기 쉬운 형태로 변환
        if (lang === 'en') {
            out = out.replace(/(\d+)\s*중첩/g, '$1 Stack')
                     .replace(/중첩/g, 'Stack');
        } else if (lang === 'jp') {
            out = out.replace(/(\d+)\s*중첩/g, '$1重')
                     .replace(/중첩/g, '重');
        }
        // 공통 용어 사전 치환 (상태이상/속성/턴 등)
        try {
            const dict = (typeof I18NUtils !== 'undefined' && I18NUtils.statTranslations && I18NUtils.statTranslations[lang])
                ? I18NUtils.statTranslations[lang]
                : null;
            if (dict && typeof dict === 'object') {
                const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                Object.keys(dict).sort((a, b) => b.length - a.length).forEach((ko) => {
                    const tr = dict[ko];
                    if (!tr || tr === ko) return;
                    out = out.replace(new RegExp(esc(ko), 'g'), tr);
                });
            }
        } catch(_) {}

        if (lang === 'en') {
            out = out
                .replace(/단일\/광역/g, 'Single/Multi')
                .replace(/단일\/자신/g, 'Single/Self')
                .replace(/광역\/자신/g, 'Multi/Self')
                .replace(/자신/g, 'Self')
                .replace(/단일/g, 'Single')
                .replace(/광역/g, 'Multi')
                .replace(/의식\s*([0-9]+)/g, 'A$1')
                .replace(/(\d+)\s*턴/g, '$1T')
                .replace(/턴/g, 'T')
                .replace(/레벨/g, 'Lv')
                .replace(/심상/g, 'MS')
                .replace(/개조/g, 'Mod')
                .replace(/없음/g, 'None');
        } else if (lang === 'jp') {
            out = out
                .replace(/단일\/광역/g, '単体/複数対象')
                .replace(/단일\/자신/g, '単体/自分')
                .replace(/광역\/자신/g, '複数対象/自分')
                .replace(/자신/g, '自分')
                .replace(/단일/g, '単体')
                .replace(/광역/g, '複数対象')
                .replace(/의식\s*([0-9]+)/g, '意識$1')
                .replace(/(\d+)\s*턴/g, '$1ターン')
                .replace(/턴/g, 'ターン')
                .replace(/레벨/g, 'Lv')
                .replace(/심상/g, 'イメジャリー')
                .replace(/개조/g, '改造')
                .replace(/없음/g, 'なし');
        }

        return out;
    }

    transformIconSrcForLang(src) {
        const lang = this.getCurrentLang();
        if (!src || lang === 'kr') return src;
        let out = src;
        out = out.replace('item-mind_stat3', 'item-mind_stat2')
                 .replace('의식3', '의식2')
                 .replace('/character-detail/ritual3', '/character-detail/ritual2');
        return out;
    }

    scheduleTranslateCharacterNames() {
        const lang = this.getCurrentLang();
        if (lang === 'kr') return;
        let tries = 0;
        const tryTranslate = () => {
            tries++;
            try {
                if (typeof characterData === 'undefined') {
                    if (tries < 20) return setTimeout(tryTranslate, 100);
                    return;
                }
                document.querySelectorAll('tr.group-header').forEach(tr => {
                    const group = tr.getAttribute('data-group') || '';
                    const nameEl = tr.querySelector('.group-name');
                    if (nameEl) nameEl.textContent = this.getGroupDisplayName(group);
                });
                try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(document); } } catch(_) {}
                return;
            } catch(_) {}
            if (tries < 20) setTimeout(tryTranslate, 100);
        };
        tryTranslate();
    }

    ensureJCCalcLoadedAndAttach() {
        // [수정] 이미 로드되어 있다면, initializeTables에서 renderAccordion이 실행될 때
        // 자동으로 JCCalc를 감지하고 부착하므로 여기서 아무것도 하지 않습니다. (중복 렌더링 방지)
        if (typeof JCCalc !== 'undefined' && JCCalc && typeof JCCalc.attachDesireControl === 'function') {
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
                    // 스크립트가 로드되면 J&C 컨트롤을 부착하고 테이블을 리로드하여 아이템을 등록합니다.
                    try {
                        if (typeof JCCalc !== 'undefined' && JCCalc && typeof JCCalc.attachDesireControl === 'function') {
                            document.querySelectorAll('tr.group-header[data-group="J&C"]').forEach(tr => {
                                JCCalc.attachDesireControl(tr, this, 'crit');
                            });
                            if (typeof this.initializeTables === 'function') {
                                this.initializeTables();
                            }
                        }
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

    buildDatasets() {
        this.buffGroups = (typeof criticalBuffData === 'object' && !Array.isArray(criticalBuffData)) ? criticalBuffData : {};
        this.selfGroups = (typeof criticalSelfData === 'object' && !Array.isArray(criticalSelfData)) ? criticalSelfData : {};

        this.buffOrder = Object.keys(this.buffGroups);
        this.selfOrder = Object.keys(this.selfGroups);

        this.buffFlat = [];
        this.selfFlat = [];
        this.idToBuffItem = new Map();
        this.idToSelfItem = new Map();

        const absorb = (groupsObj, flat, idMap) => {
            Object.keys(groupsObj).forEach(group => {
                const list = groupsObj[group] || [];
                list.forEach(item => {
                    if (!item) return;
                    flat.push(item);
                    if (item.id !== undefined) idMap.set(item.id, item);
                });
            });
        };

        absorb(this.buffGroups, this.buffFlat, this.idToBuffItem);
        absorb(this.selfGroups, this.selfFlat, this.idToSelfItem);
    }

    initializeInputs() {
        this.revelationInput = document.getElementById('revelationCritical');
        this.explanationInput = document.getElementById('explanationPower');
        if (this.revelationInput) this.revelationInput.addEventListener('input', () => this.updateTotal());
        if (this.explanationInput) this.explanationInput.addEventListener('input', () => this.updateTotal());
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
                const targetContent = document.getElementById(tabId);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    }

    initializeTables() {
        if (this.buffTableBody) this.renderAccordion(this.buffTableBody, false);
        if (this.selfTableBody) this.renderAccordion(this.selfTableBody, true);

        this.autoSelectDefaults();
        this.updateTotal();
    }

    async renderAccordion(tbody, isSelf) {
        // [중요] 비동기 데이터 로딩을 먼저 수행
        const showSpoiler = !!(document.getElementById('showSpoilerToggle') && document.getElementById('showSpoilerToggle').checked);
        let visibleNames = [];
        try {
            if (typeof CharacterListLoader !== 'undefined') {
                visibleNames = await CharacterListLoader.getVisibleNames(showSpoiler);
            }
        } catch(_) {}

        // [중요] 데이터를 다 가져온 후에 테이블을 비웁니다. 
        // (이전에 비우면 비동기 대기 중에 다른 렌더링 요청이 와서 꼬일 수 있음)
        while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

        const order = isSelf ? this.selfOrder : this.buffOrder;
        const groupsObj = isSelf ? this.selfGroups : this.buffGroups;

        order.forEach(groupName => {
            const items = groupsObj[groupName] || [];
            if (!['원더','계시','공통'].includes(groupName)) {
                if (Array.isArray(visibleNames) && visibleNames.length > 0 && !visibleNames.includes(groupName)) return;
                if ((!visibleNames || visibleNames.length === 0) && !showSpoiler) return;
            }
            
            const headerTr = document.createElement('tr');
            headerTr.className = 'group-header';
            headerTr.setAttribute('data-group', groupName);
            const fullTd = document.createElement('td');
            fullTd.className = 'group-header-cell';
            fullTd.setAttribute('colspan', '8');

            const inner = document.createElement('div');
            inner.className = 'group-header-inner';

            const caret = document.createElement('span');
            caret.className = 'accordion-caret';
            const isMobile = window.innerWidth <= 1200;
            // 모바일: 버프 탭은 '공통'만, 자신 탭은 '계시/원더/공통'만 열림
            // PC: 버프 탭은 모두 열림, 자신 탭은 '계시/원더/공통'만 열림
            const initiallyOpen = !isSelf 
                ? (isMobile ? groupName === '공통' : true)
                : (groupName === '계시' || groupName === '원더' || groupName === '공통');
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
            // 공통 그룹은 아이콘을 표시하지 않음
            if (groupName !== '공통') {
                const img = document.createElement('img');
                img.src = `${BASE_URL}/assets/img/character-half/${groupName}.webp`;
                img.className = 'group-avatar';
                infoWrap.appendChild(img);
            }
            const nameSpan = document.createElement('span');
            nameSpan.className = 'group-name';
            nameSpan.textContent = this.getGroupDisplayName(groupName);
            infoWrap.appendChild(nameSpan);
            inner.appendChild(infoWrap);
            fullTd.appendChild(inner);
            headerTr.appendChild(fullTd);

            // J&C 전용 Desire 레벨 컨트롤 추가 (renderAccordion 실행 시점에 JCCalc가 있으면 자동 부착)
            if (groupName === 'J&C' && typeof JCCalc !== 'undefined' && JCCalc.attachDesireControl) {
                JCCalc.attachDesireControl(headerTr, this, 'crit');
            }

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
                const row = this.createTableRow(item, isSelf, groupName);
                // 초기 표시 상태 (모바일: 조건에 따라, 데스크탑: 조건에 따라)
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

            try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(tbody); } } catch(_) {}
        });
    }

    createTableRow(data, isSelf = false, groupName = '') {
        const row = document.createElement('tr');
        
        const checkCell = document.createElement('td');
        checkCell.className = 'check-column';
        const checkbox = document.createElement('img');
        const setChecked = (checked) => {
            checkbox.src = `${BASE_URL}/assets/img/ui/check-${checked ? 'on' : 'off'}.png`;
            if (checked) row.classList.add('selected'); else row.classList.remove('selected');
        };
        const initiallyChecked = (!isSelf && (data.id === 'default' || data.id === 'myPalace'))
            || (isSelf ? this.selectedSelfItems.has(data.id) : this.selectedBuffItems.has(data.id));
        setChecked(initiallyChecked);
        
        checkbox.onclick = () => {
            const isOn = checkbox.src.includes('check-on');
            setChecked(!isOn);
            if (isSelf) {
                if (isOn) this.selectedSelfItems.delete(data.id); else this.selectedSelfItems.add(data.id);
            } else {
                if (isOn) this.selectedBuffItems.delete(data.id); else this.selectedBuffItems.add(data.id);
            }
            this.updateTotal();
        };
        checkCell.appendChild(checkbox);
        row.appendChild(checkCell);
        
        // 목표 열
        const targetCell = document.createElement('td');
        targetCell.className = 'target-column';
        targetCell.textContent = this.normalizeTextForLang(data.target || '');
        targetCell.setAttribute('data-target', data.target || '');
        row.appendChild(targetCell);
        
        // 스킬 아이콘 열
        const skillIconCell = document.createElement('td');
        skillIconCell.className = 'skill-icon-column';
        if (data.skillIcon) {
            const skillIcon = document.createElement('img');
            skillIcon.src = this.transformIconSrcForLang(data.skillIcon);
            
            // 스킬 관련 타입인 경우 skill-icon 클래스 추가
            const t = String(data.type || '');
            if (t.includes('스킬') || t === '하이라이트' || t === '패시브' || t === '총격') {
                skillIcon.className = 'skill-icon';
            }
            
            skillIconCell.appendChild(skillIcon);
        }
        row.appendChild(skillIconCell);

        // 스킬 이름 열 (분류 + 이름 결합)
        const skillNameCell = document.createElement('td');
        skillNameCell.className = 'skill-name-column';
        const currentLang = this.getCurrentLang();
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
        typeSpan.textContent = this.normalizeTextForLang(data.type || '');
        
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
                const isSpecialGroup = (groupName === '원더' || groupName === '계시');
                if (!isSpecialGroup) {
                    // 원더/계시가 아닌 경우: 이름만 표시
                    nameSpan.textContent = localizedName;
                    skillNameCell.appendChild(nameSpan);
                } else {
                    // 원더/계시 그룹: 분류 + 이름 표시
                    nameSpan.textContent = localizedName;
                    if (!shouldHideTypeLabel) {
                        skillNameCell.appendChild(typeSpan);
                        const sep = document.createTextNode('　');
                        skillNameCell.appendChild(sep);
                    }
                    skillNameCell.appendChild(nameSpan);
                }
            } else {
                // 분류만 강조
                typeSpan.classList.add('type-only');
                skillNameCell.appendChild(typeSpan);
            }
        }
        row.appendChild(skillNameCell);

        // 값 표시 셀 생성
        const valueCell = document.createElement('td');
        valueCell.className = 'value-column';

        const optionCell = document.createElement('td');
        optionCell.className = 'option-column';

        if (data.options && data.options.length > 0) {
            const select = document.createElement('select');
            select.setAttribute('data-id', data.id);

            // 저장된 옵션 로드
            const savedOption = this.loadOptionSelection(data.id, isSelf);

            data.options.forEach(opt => {
                const el = document.createElement('option');
                el.value = opt;
                el.textContent = this.normalizeTextForLang(opt);
                // 저장된 옵션이 있으면 우선 적용, 없으면 기본값
                if (savedOption !== null && savedOption === opt) {
                    el.selected = true;
                } else if (savedOption === null && data.defaultOption && data.defaultOption === opt) {
                    el.selected = true;
                }
                select.appendChild(el);
            });

            // 저장된 옵션이 있으면 data.value도 업데이트
            if (savedOption !== null && data.values && data.values[savedOption] !== undefined) {
                data.value = data.values[savedOption];
            }

            select.onchange = () => {
                const selectedOption = select.value;

                // 옵션 저장
                this.saveOptionSelection(data.id, selectedOption, isSelf);

                if (data.values && data.values[selectedOption] != null) {
                    data.value = data.values[selectedOption];

                    const isJC = groupName === 'J&C' && typeof JCCalc !== 'undefined' && JCCalc.onOptionChanged;
                    if (isJC && data.id !== 'jc2') {
                        JCCalc.onOptionChanged(data, valueCell, false, this);
                        return;
                    }

                    valueCell.textContent = `${data.value}%`;
                    const set = isSelf ? this.selectedSelfItems : this.selectedBuffItems;
                    if (set.has(data.id)) this.updateTotal();
                }
            };
            optionCell.appendChild(select);
        }
        row.appendChild(optionCell);
        
        const isJCRegistered = groupName === 'J&C' && typeof JCCalc !== 'undefined' && JCCalc.registerItem;
        if (isJCRegistered && data.id !== 'jc2') {
            JCCalc.registerItem(data, valueCell, 'crit', this);
        } else {
            valueCell.textContent = `${data.value}%`;
        }
        row.appendChild(valueCell);
        
        const durationCell = document.createElement('td');
        durationCell.className = 'duration-column';
        durationCell.textContent = this.normalizeTextForLang(data.duration || '');
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

    autoSelectDefaults() {
        this.buffFlat.forEach(it => { 
            if (it.id === 'default' || it.id === 'myPalace') {
                this.selectedBuffItems.add(it.id);
            }
        });
    }

    sumSelected(listOfIds, idToItem) {
        return Array.from(listOfIds)
            .map(id => idToItem.get(id))
            .filter(Boolean)
            .reduce((sum, item) => sum + (item.value || 0), 0);
    }

    updateTotal() {
        const buffSum = this.sumSelected(this.selectedBuffItems, this.idToBuffItem);
        const selfSum = this.sumSelected(this.selectedSelfItems, this.idToSelfItem);
        const custom1 = parseFloat(this.revelationInput && this.revelationInput.value) || 0;
        const custom2 = parseFloat(this.explanationInput && this.explanationInput.value) || 0;
        const total = Math.max(0, buffSum + selfSum + custom1 + custom2);
        const needed = Math.max(0, 100 - total);
        
        if (this.totalValue) this.totalValue.textContent = `${total.toFixed(1)}%`;
        if (this.buffSumValue) this.buffSumValue.textContent = `${buffSum.toFixed(1)}%`;
        if (this.selfSumValue) this.selfSumValue.textContent = `${selfSum.toFixed(1)}%`;
        if (this.neededValue) this.neededValue.textContent = `${needed.toFixed(1)}%`;
    }
}
