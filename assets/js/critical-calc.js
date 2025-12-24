class CriticalCalc {
    constructor() {
        this.buffTableBody = document.getElementById('buffTableBody');
        this.selfTableBody = document.getElementById('selfTableBody');
        this.totalValue = document.querySelector('.total-value');
        
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

        try { if (typeof DefenseI18N !== 'undefined' && DefenseI18N.updateLanguageContent) { DefenseI18N.updateLanguageContent(document); } } catch(_) {}
        try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(document); } } catch(_) {}
        this.scheduleTranslateCharacterNames();

        // J&C 로드 (중복 렌더링 방지 로직 적용됨)
        try { this.ensureJCCalcLoadedAndAttach(); } catch(_) {}

        this.applyHardcodedI18n();
    }

    applyHardcodedI18n() {
        try {
            const lang = this.getCurrentLang();
            const texts = {
                kr: { navCurrent:'크리티컬 확률 계산기', page:'크리티컬 확률 계산기', total:'크리티컬 확률 합계', custom:'커스텀 크리티컬 확률', rev:'계시 합계', exp:'해명의 힘', buff:'버프', self:'자신', select:'선택', target:'목표', name:'이름', option:'옵션', value:'수치', duration:'지속시간', note:'비고', spoiler:'Show Spoilers' },
                en: { navCurrent:'Critical Rate Calculator', page:'Critical Rate Calculator', total:'Total Critical Rate', custom:'Custom Critical Rate', rev:'Card Sum', exp:'Navi Power', buff:'Buff', self:'Self', select:'Select', target:'Target', name:'Name', option:'Option', value:'Value', duration:'Duration', note:'Note', spoiler:'Show Spoilers' },
                jp: { navCurrent:'クリ率計算機', page:'クリ率計算機', total:'クリ率合計', custom:'カスタム クリ率', rev:'啓示 合計', exp:'ナビ力', buff:'バフ', self:'自分', select:'選択', target:'目標', name:'名前', option:'オプション', value:'数値', duration:'持続時間', note:'備考', spoiler:'ネタバレ表示' }
            }[lang] || undefined;
            if (texts) {
                const setText = (id, text) => { const el=document.getElementById(id); if (el) el.textContent = text; };
                setText('navCurrent', texts.navCurrent);
                setText('page-title', texts.page);
                setText('total-title', texts.total);
                setText('custom-title', texts.custom);
                setText('revelationSumLabel', texts.rev);
                setText('explanationPowerLabel', texts.exp);
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
                const sp = document.getElementById('showSpoilerLabel'); if (sp) sp.textContent = texts.spoiler;
            }
        } catch(_) {}
    }

    getCurrentLang() {
        try {
            if (typeof I18NUtils !== 'undefined' && I18NUtils.getCurrentLanguageSafe) return I18NUtils.getCurrentLanguageSafe();
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) return LanguageRouter.getCurrentLanguage();
        } catch(_) {}
        return 'kr';
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
        return String(text).replace(/의식\s*3/g, '의식2');
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
                                JCCalc.attachDesireControl(tr, this);
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
            const initiallyOpen = !isSelf ? true : (groupName === '계시' || groupName === '원더' || groupName === '공통');
            caret.className = `accordion-caret ${initiallyOpen ? 'open' : ''}`;
            caret.textContent = initiallyOpen ? '▾' : '▸';
            inner.appendChild(caret);

            const infoWrap = document.createElement('span');
            infoWrap.className = 'group-info';
            if (groupName === '계시') {
                const img = document.createElement('img');
                img.src = `${BASE_URL}/assets/img/character-half/계시.webp`;
                img.className = 'group-avatar';
                infoWrap.appendChild(img);
            } else if (groupName === '원더') {
                const img = document.createElement('img');
                img.src = `${BASE_URL}/assets/img/character-half/원더.webp`;
                img.className = 'group-avatar';
                infoWrap.appendChild(img);
            } else if (groupName !== '공통') {
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
                JCCalc.attachDesireControl(headerTr, this);
            }

            headerTr.addEventListener('click', () => {
                const isOpen = caret.classList.contains('open');
                caret.classList.toggle('open', !isOpen);
                caret.textContent = isOpen ? '▸' : '▾';
                items.forEach(it => { if (it.__rowEl) it.__rowEl.style.display = isOpen ? 'none' : ''; });
            });

            tbody.appendChild(headerTr);

            items.forEach(item => {
                const row = this.createTableRow(item, isSelf, groupName);
                row.classList.add('group-row');
                row.style.display = initiallyOpen ? '' : 'none';
                row.setAttribute('data-group', groupName);
                try { Object.defineProperty(item, '__rowEl', { value: row, writable: true, configurable: true }); } catch(_) { item.__rowEl = row; }
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
        
        const targetCell = document.createElement('td');
        targetCell.className = 'target-column';
        targetCell.textContent = this.normalizeTextForLang(data.target || '');
        targetCell.setAttribute('data-target', data.target || '');
        row.appendChild(targetCell);
        
        const iconCell = document.createElement('td');
        iconCell.className = 'skill-icon-column';
        if (data.skillIcon) {
            const icon = document.createElement('img');
            icon.src = this.transformIconSrcForLang(data.skillIcon);
            const t = String(data.type || '');
            if (t.includes('스킬') || t === '하이라이트' || t === '패시브' || t === '총격') icon.className = 'skill-icon';
            iconCell.appendChild(icon);
        }
        row.appendChild(iconCell);

        const nameCell = document.createElement('td');
        nameCell.className = 'skill-name-column';
        const typeSpan = document.createElement('span');
        typeSpan.className = 'skill-type-label';
        typeSpan.textContent = this.normalizeTextForLang(data.type || '');
        const nameSpan = document.createElement('span');
        nameSpan.className = 'skill-name-text';
        const currentLang = this.getCurrentLang();
        let localizedName = '';
        if (currentLang === 'en') localizedName = (data.skillName_en && String(data.skillName_en).trim()) || '';
        else if (currentLang === 'jp') localizedName = (data.skillName_jp && String(data.skillName_jp).trim()) || '';
        if (!localizedName) {
            const isWonder = groupName === '원더';
            const typeStr = String(data.type || '');
            const isWonderDisplayType = isWonder && (typeStr === '전용무기' || typeStr === '페르소나' || typeStr === '스킬');
            if (currentLang !== 'kr' && isWonderDisplayType) localizedName = data.skillName || '';
            else if (currentLang === 'kr') localizedName = data.skillName || '';
            else localizedName = '';
        }
        if (currentLang === 'kr') {
            nameSpan.textContent = localizedName;
            nameCell.appendChild(typeSpan);
            if (localizedName) { nameCell.appendChild(document.createTextNode(' · ')); nameCell.appendChild(nameSpan); }
        } else {
            if (localizedName && localizedName.trim()) {
                const isSpecialGroup = (groupName === '원더' || groupName === '계시');
                if (!isSpecialGroup) {
                    nameSpan.textContent = localizedName;
                    nameCell.appendChild(nameSpan);
                } else {
                    nameSpan.textContent = localizedName;
                    nameCell.appendChild(typeSpan);
                    nameCell.appendChild(document.createTextNode(' · '));
                    nameCell.appendChild(nameSpan);
                }
            } else {
                typeSpan.classList.add('type-only');
                nameCell.appendChild(typeSpan);
            }
        }
        row.appendChild(nameCell);

        // 값 표시 셀 생성
        const valueCell = document.createElement('td');
        valueCell.className = 'value-column';

        const optionCell = document.createElement('td');
        optionCell.className = 'option-column';

        if (data.options && data.options.length > 0) {
            const select = document.createElement('select');
            select.setAttribute('data-id', data.id);
            data.options.forEach(opt => {
                const el = document.createElement('option');
                el.value = opt;
                el.textContent = this.normalizeTextForLang(opt);
                if (data.defaultOption && data.defaultOption === opt) el.selected = true;
                select.appendChild(el);
            });
            
            select.onchange = () => {
                const selectedOption = select.value;
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
            JCCalc.registerItem(data, valueCell, false, this);
        } else {
            valueCell.textContent = `${data.value}%`;
        }
        row.appendChild(valueCell);
        
        const durationCell = document.createElement('td');
        durationCell.className = 'duration-column';
        durationCell.textContent = this.normalizeTextForLang(data.duration || '');
        row.appendChild(durationCell);
        
        const noteCell = document.createElement('td');
        noteCell.className = 'note-column';
        let noteText = data.note || '';
        const lang = this.getCurrentLang();
        if (lang === 'en' && data.note_en) noteText = data.note_en;
        else if (lang === 'jp' && data.note_jp) noteText = data.note_jp;
        noteCell.textContent = this.normalizeTextForLang(noteText);
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
        if (this.totalValue) this.totalValue.textContent = `${total.toFixed(1)}%`;
    }
}