class CriticalCalc {
    constructor() {
        this.buffTableBody = document.getElementById('buffTableBody');
        this.selfTableBody = document.getElementById('selfTableBody');
        this.totalValue = document.querySelector('.total-value');
        // 선택 상태 분리 관리
        this.selectedBuffItems = new Set();
        this.selectedSelfItems = new Set();

        // 데이터셋 빌드 (그룹/플랫/인덱스)
        this.buildDatasets();
        
        this.initializeInputs();
        this.initializeTabs();
        this.initializeTables();

        // 스포일러 토글 재렌더
        try {
            const sp = document.getElementById('showSpoilerToggle');
            if (sp) {
                sp.addEventListener('change', async () => {
                    await this.renderAccordion(this.buffTableBody, false);
                    await this.renderAccordion(this.selfTableBody, true);
                });
            }
        } catch(_) {}

        // 리사이즈 시 재렌더
        window.addEventListener('resize', () => {
            if (this.buffTableBody) this.buffTableBody.innerHTML = '';
            if (this.selfTableBody) this.selfTableBody.innerHTML = '';
            this.initializeTables();
        });

        // i18n 적용
        try { if (typeof DefenseI18N !== 'undefined' && DefenseI18N.updateLanguageContent) { DefenseI18N.updateLanguageContent(document); } } catch(_) {}
        try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(document); } } catch(_) {}

        // 캐릭터 이름 번역(EN/JP) 보정 스케줄링
        this.scheduleTranslateCharacterNames();

        // 테이블 헤더/탭/라벨 i18n 텍스트 강제 적용
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
        // 원더/계시/공통 같은 특수 카테고리는 전용 i18n으로 우선 변환
        try {
            if (typeof DefenseI18N !== 'undefined' && DefenseI18N.translateGroupName) {
                const translated = DefenseI18N.translateGroupName(groupName);
                if (translated && translated !== groupName) return translated;
            }
        } catch(_) {}

        // 일반 캐릭터는 characters.js의 메타로 현지화
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
        // 의식3 -> 의식2 보정(아이콘/표기 통일 목적)
        return String(text).replace(/의식\s*3/g, '의식2');
    }

    transformIconSrcForLang(src) {
        const lang = this.getCurrentLang();
        if (!src || lang === 'kr') return src;
        let out = src;
        // 디펜스에서 사용한 경로 보정 규칙 재사용(디버프 → 버프 등은 크리에서 사용 안하지만 호환 유지)
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
                // characterData가 준비될 때까지 대기 (defense-calc와 동일 동작)
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

    buildDatasets() {
        // 전역 상수 criticalBuffData / criticalSelfData 가 객체라고 가정
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
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    initializeTables() {
        if (this.buffTableBody) this.renderAccordion(this.buffTableBody, false);
        if (this.selfTableBody) this.renderAccordion(this.selfTableBody, true);

        // 기본 선택: default / myPalace
        this.autoSelectDefaults();
        this.updateTotal();
    }

    async renderAccordion(tbody, isSelf) {
        while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
        const order = isSelf ? this.selfOrder : this.buffOrder;
        const groupsObj = isSelf ? this.selfGroups : this.buffGroups;

        // 스포일러 토글 상태에 따라 표시할 캐릭터 목록 계산 (계시/원더/공통은 항상 표시)
        // 스포일러 토글 기본값: 쿼리파라미터나 언어 설정 등과 연동 (defense-calc는 체크박스 상태 기준)
        const showSpoiler = !!(document.getElementById('showSpoilerToggle') && document.getElementById('showSpoilerToggle').checked);
        let visibleNames = [];
        try {
            if (typeof CharacterListLoader !== 'undefined') {
                visibleNames = await CharacterListLoader.getVisibleNames(showSpoiler);
            }
        } catch(_) {}

        order.forEach(groupName => {
            const items = groupsObj[groupName] || [];
            // 그룹 필터링 (계시/원더/공통 제외)
            if (!['원더','계시','공통'].includes(groupName)) {
                if (Array.isArray(visibleNames) && visibleNames.length > 0 && !visibleNames.includes(groupName)) return;
                // visibleNames가 비어있는 경우엔 스포일러 OFF이면 아무도 보이지 않도록 방어
                if ((!visibleNames || visibleNames.length === 0) && !showSpoiler) return;
            }
            // 그룹 헤더
            const headerTr = document.createElement('tr');
            headerTr.className = 'group-header';
            headerTr.setAttribute('data-group', groupName);
            const fullTd = document.createElement('td');
            fullTd.className = 'group-header-cell';
            fullTd.setAttribute('colspan', '8');

            const inner = document.createElement('div');
            inner.className = 'group-header-inner';

            const caret = document.createElement('span');
            // 초기 펼침 규칙
            // - 버프 탭: 모든 그룹 펼침
            // - 자신 탭: '계시','원더','공통'만 펼침, 그 외는 접음
            const initiallyOpen = !isSelf ? true : (groupName === '계시' || groupName === '원더' || groupName === '공통');
            caret.className = `accordion-caret ${initiallyOpen ? 'open' : ''}`;
            caret.textContent = initiallyOpen ? '▾' : '▸';
            inner.appendChild(caret);

            const infoWrap = document.createElement('span');
            infoWrap.className = 'group-info';
            // 아바타 이미지: 계시/원더는 고정 아이콘, 공통은 없음, 나머지는 캐릭터 반신
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

            // 토글
            headerTr.addEventListener('click', () => {
                const isOpen = caret.classList.contains('open');
                caret.classList.toggle('open', !isOpen);
                caret.textContent = isOpen ? '▸' : '▾';
                items.forEach(it => { if (it.__rowEl) it.__rowEl.style.display = isOpen ? 'none' : ''; });
            });

            tbody.appendChild(headerTr);

            // 데이터 행
            items.forEach(item => {
                const row = this.createTableRow(item, isSelf, groupName);
                row.classList.add('group-row');
                // 초기 표시 상태
                row.style.display = initiallyOpen ? '' : 'none';
                row.setAttribute('data-group', groupName);
                try { Object.defineProperty(item, '__rowEl', { value: row, writable: true, configurable: true }); } catch(_) { item.__rowEl = row; }
                tbody.appendChild(row);
            });

            // 그룹 렌더 후 텍스트 번역 보정
            try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(tbody); } } catch(_) {}
        });
    }

    createTableRow(data, isSelf = false, groupName = '') {
        const row = document.createElement('tr');
        
        // 체크박스
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
        
        // 목표
        const targetCell = document.createElement('td');
        targetCell.className = 'target-column';
        targetCell.textContent = this.normalizeTextForLang(data.target || '');
        targetCell.setAttribute('data-target', data.target || '');
        row.appendChild(targetCell);
        
        // 아이콘
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

        // 이름(분류 · 이름)
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
        // wonder 폴백 규칙 동일 적용
        if (!localizedName) {
            const isWonder = groupName === '원더';
            const typeStr = String(data.type || '');
            const isWonderDisplayType = isWonder && (typeStr === '전용무기' || typeStr === '페르소나' || typeStr === '스킬');
            if (currentLang !== 'kr' && isWonderDisplayType) localizedName = data.skillName || '';
            else if (currentLang === 'kr') localizedName = data.skillName || '';
            else localizedName = '';
        }
        const isSpecialGroup = (groupName === '원더' || groupName === '계시');
        if (currentLang === 'kr') {
            // KR: 분류 + 이름 모두 표기
            nameSpan.textContent = localizedName;
            nameCell.appendChild(typeSpan);
            if (localizedName) { nameCell.appendChild(document.createTextNode(' · ')); nameCell.appendChild(nameSpan); }
        } else {
            if (localizedName && localizedName.trim()) {
                // EN/JP: 원더/계시/공통이 아니고 현지화 이름이 있으면 type 숨김 (요청사항)
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
                // 분류만 강조
                typeSpan.classList.add('type-only');
                nameCell.appendChild(typeSpan);
            }
        }
        row.appendChild(nameCell);

        // 옵션
        const optionCell = document.createElement('td');
        optionCell.className = 'option-column';
        let valueCell;
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
                    if (valueCell) valueCell.textContent = `${data.value}%`;
                    // 선택되어 있으면 합계 즉시 반영
                    const set = isSelf ? this.selectedSelfItems : this.selectedBuffItems;
                    if (set.has(data.id)) this.updateTotal();
                }
            };
            optionCell.appendChild(select);
        }
        row.appendChild(optionCell);
        
        // 수치
        valueCell = document.createElement('td');
        valueCell.className = 'value-column';
        valueCell.textContent = `${data.value}%`;
        row.appendChild(valueCell);
        
        // 시간
        const durationCell = document.createElement('td');
        durationCell.className = 'duration-column';
        durationCell.textContent = this.normalizeTextForLang(data.duration || '');
        row.appendChild(durationCell);
        
        // 비고
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
        // buff에서만 적용: default / myPalace
        const applyDefault = (tbody) => {
            if (!tbody) return;
            tbody.querySelectorAll('tr.group-row').forEach(row => {
                const dataId = (row.querySelector('select, .value-column') && (row.querySelector('select, .value-column').closest('tr').dataset && row.dataset && row.dataset.id)) || null;
                // 안전하게 셀의 체크 이미지를 기반으로 처리
                const checkbox = row.querySelector('td.check-column img');
                const skillNameCell = row.querySelector('.skill-name-column');
                const skillName = skillNameCell ? skillNameCell.textContent.trim() : '';
                // default/myPalace는 초기화 시 이미 체크됐음(createTableRow에서 처리)
            });
        };
        applyDefault(this.buffTableBody);
        // Set에 반영
        this.buffFlat.forEach(it => { if (it.id === 'default' || it.id === 'myPalace') this.selectedBuffItems.add(it.id); });
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