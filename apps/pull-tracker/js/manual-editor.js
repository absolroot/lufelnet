/**
 * manual-editor.js
 * 수동 레코드 추가/수정 모달 및 관련 로직
 */
(() => {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // 유틸리티
    // ─────────────────────────────────────────────────────────────
    function lang() {
        try { return (new URLSearchParams(location.search).get('lang') || 'kr').toLowerCase(); }
        catch (_) { return 'kr'; }
    }

    const i18n = {
        kr: {
            addRecord: '기록 추가',
            editRecord: '기록 수정',
            get5Star: '5★ 추가',
            get4Star: '4★ 추가',
            character: '캐릭터',
            weapon: '무기',
            dateTime: '날짜/시간',
            atPity: 'At pity',
            atPityUnit: '회',
            grade: '등급',
            save: '저장',
            cancel: '취소',
            delete: '삭제',
            close: '닫기',
            search: '검색...',
            maxPity: '최대',
            originalReadonly: '자동으로 가져온 데이터는 삭제만 가능합니다',
            confirmDelete: '이 기록을 삭제하시겠습니까?',
            selectCharacter: '캐릭터 선택',
            selectWeapon: '무기 선택',
            noResults: '검색 결과 없음',
            historyTitle: '획득 기록',
            manualTag: '수동',
            autoTag: '자동'
        },
        en: {
            addRecord: 'Add Record',
            editRecord: 'Edit Record',
            get5Star: 'Add 5★',
            get4Star: 'Add 4★',
            character: 'Character',
            weapon: 'Weapon',
            dateTime: 'Date/Time',
            atPity: 'At pity',
            atPityUnit: 'pulls',
            grade: 'Grade',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            close: 'Close',
            search: 'Search...',
            maxPity: 'max',
            originalReadonly: 'Auto-imported data can only be deleted',
            confirmDelete: 'Delete this record?',
            selectCharacter: 'Select Character',
            selectWeapon: 'Select Weapon',
            noResults: 'No results',
            historyTitle: 'History',
            manualTag: 'Manual',
            autoTag: 'Auto'
        },
        jp: {
            addRecord: '記録追加',
            editRecord: '記録編集',
            get5Star: '5★ 追加',
            get4Star: '4★ 追加',
            character: 'キャラクター',
            weapon: '武器',
            dateTime: '日時',
            atPity: '天井',
            atPityUnit: '回',
            grade: 'レア度',
            save: '保存',
            cancel: 'キャンセル',
            delete: '削除',
            close: '閉じる',
            search: '検索...',
            maxPity: '最大',
            originalReadonly: '自動取得データは削除のみ可能です',
            confirmDelete: 'この記録を削除しますか？',
            selectCharacter: 'キャラクター選択',
            selectWeapon: '武器選択',
            noResults: '結果なし',
            historyTitle: '獲得履歴',
            manualTag: '手動',
            autoTag: '自動'
        }
    };

    function t(key) {
        const l = lang();
        return (i18n[l] || i18n.kr)[key] || key;
    }

    // 패널별 최대 pity
    const MAX_PITY = {
        Confirmed: 110,
        Fortune: 80,
        Weapon: 70,
        Gold: 80,
        Newcomer: 50
    };

    // 수동 레코드 판별
    function isManualRecord(record) {
        return String(record?.gachaId || '').startsWith('manual-');
    }

    // 수동 gachaId 생성
    function generateManualGachaId() {
        const ts = Date.now();
        const rand = Math.random().toString(36).substring(2, 6);
        return `manual-${ts}-${rand}`;
    }

    // timestamp <-> datetime-local 변환
    function timestampToInputValue(ts) {
        const d = new Date(ts);
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    function inputValueToTimestamp(val) {
        return new Date(val).getTime();
    }

    // 현재 datetime-local 값
    function nowInputValue() {
        return timestampToInputValue(Date.now());
    }

    // 날짜/시간 포맷 (초 제거, 년도 2자리)
    function formatDateTime(ts) {
        const d = new Date(ts);
        const pad = n => String(n).padStart(2, '0');
        const yy = String(d.getFullYear()).slice(-2); // 25
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        return `${yy}-${mm}-${dd} ${hh}:${mi}`;
    }

    // ─────────────────────────────────────────────────────────────
    // 캐릭터/무기 데이터 접근
    // ─────────────────────────────────────────────────────────────
    function getCharData() {
        try {
            if (typeof characterData !== 'undefined') return characterData;
        } catch (_) { }
        return window.characterData || {};
    }

    function getWeaponData() {
        return window.WeaponData || {};
    }

    // 이름 번역 (record.name → 현재 언어에 맞는 이름)
    function translateRecordName(name, isWeapon) {
        const l = lang();
        if (l === 'kr') return name; // 한국어면 그대로

        if (isWeapon) {
            // 무기 이름 번역
            const enData = window.enCharacterWeaponData || {};
            const jpData = window.jpCharacterWeaponData || {};
            const krData = getWeaponData();
            for (const [ownerKey, weapons] of Object.entries(krData)) {
                if (!weapons) continue;
                for (const [wKey, wInfo] of Object.entries(weapons)) {
                    if (!wKey.startsWith('weapon')) continue;
                    if (wInfo && wInfo.name === name) {
                        if (l === 'en' && enData[ownerKey] && enData[ownerKey][wKey]) {
                            return enData[ownerKey][wKey].name || name;
                        } else if (l === 'jp' && jpData[ownerKey] && jpData[ownerKey][wKey]) {
                            return jpData[ownerKey][wKey].name || name;
                        }
                    }
                }
            }
            return name;
        } else {
            // 캐릭터 이름 번역
            const data = getCharData();
            for (const [key, info] of Object.entries(data)) {
                if (!info) continue;
                if (info.name === name) {
                    if (l === 'en') return info.name_en || info.codename || name;
                    if (l === 'jp') return info.name_jp || name;
                }
            }
            return name;
        }
    }

    // 캐릭터 목록 (5성만 또는 4성만)
    function getCharacterList(grade) {
        const data = getCharData();
        const list = [];
        for (const [key, info] of Object.entries(data)) {
            if (!info) continue;
            const rarity = Number(info.rarity || 0);
            if (grade === 5 && rarity !== 5) continue;
            if (grade === 4 && rarity !== 4) continue;
            const l = lang();
            const displayName = (l === 'en') ? (info.name_en || info.codename || info.name || key)
                : (l === 'jp') ? (info.name_jp || info.name || key)
                    : (info.name || key);
            list.push({
                key,
                name: displayName,
                id: info.id || null,
                rarity
            });
        }
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }

    // 무기 목록 (5성만 또는 4성만)
    function getWeaponList(grade) {
        const data = getWeaponData();
        const list = [];
        const l = lang();
        const enWeaponData = window.enCharacterWeaponData || {};
        const jpWeaponData = window.jpCharacterWeaponData || {};
        for (const [ownerKey, weapons] of Object.entries(data)) {
            if (!weapons) continue;
            for (const [wKey, wInfo] of Object.entries(weapons)) {
                if (!wKey.startsWith('weapon')) continue;
                if (!wInfo) continue;
                const rarity = Number(wInfo.rarity || wInfo.grade || 0);
                if (grade === 5 && rarity !== 5) continue;
                if (grade === 4 && rarity !== 4) continue;
                // 언어별 무기 이름
                let displayName = wInfo.name || wKey;
                if (l === 'en' && enWeaponData[ownerKey] && enWeaponData[ownerKey][wKey]) {
                    displayName = enWeaponData[ownerKey][wKey].name || displayName;
                } else if (l === 'jp' && jpWeaponData[ownerKey] && jpWeaponData[ownerKey][wKey]) {
                    displayName = jpWeaponData[ownerKey][wKey].name || displayName;
                }
                list.push({
                    key: `${ownerKey}/${wKey}`,
                    ownerKey,
                    weaponKey: wKey,
                    name: displayName,
                    krName: wInfo.name || wKey, // 원본 한국어 이름 (데이터 저장용)
                    id: wInfo.id || null,
                    rarity
                });
            }
        }
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }

    // ─────────────────────────────────────────────────────────────
    // 모달 스타일 (동적 삽입)
    // ─────────────────────────────────────────────────────────────
    function ensureStyles() {
        if (document.getElementById('manual-editor-styles')) return;
        const style = document.createElement('style');
        style.id = 'manual-editor-styles';
        style.textContent = `
.me-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: me-fadeIn 0.15s ease;
}
@keyframes me-fadeIn { from { opacity: 0; } to { opacity: 1; } }

.me-modal {
    background: #1a1a1a;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    width: 90%;
    max-width: 420px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.me-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.me-header h3 { margin: 0; font-size: 16px; color: #fff; }
.me-close {
    background: none;
    border: none;
    color: rgba(255,255,255,0.6);
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    line-height: 1;
}
.me-close:hover { color: #fff; }

.me-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
}

.me-field {
    margin-bottom: 16px;
}
.me-field label {
    display: block;
    font-size: 12px;
    color: rgba(255,255,255,0.7);
    margin-bottom: 6px;
}
.me-field input, .me-field select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.15);
    background: #252525;
    color: #fff;
    font-size: 14px;
    box-sizing: border-box;
}
.me-field input:disabled, .me-field select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.me-field input:focus, .me-field select:focus {
    outline: none;
    border-color: rgba(255,255,255,0.4);
}
.me-field .me-hint {
    font-size: 11px;
    color: rgba(255,255,255,0.4);
    margin-top: 4px;
}

.me-pity-row {
    display: flex;
    align-items: center;
    gap: 8px;
}
.me-pity-row input {
    width: 80px;
    text-align: center;
}
.me-pity-row .me-pity-unit {
    color: rgba(255,255,255,0.6);
    font-size: 14px;
}
.me-pity-row .me-pity-max {
    color: rgba(255,255,255,0.4);
    font-size: 12px;
}

.me-grade-display {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #252525;
    border-radius: 8px;
    font-size: 14px;
}
.me-grade-5 { color: #8fd9ff; }
.me-grade-4 { color: #ffc17c; }

.me-readonly-notice {
    background: rgba(255,200,100,0.1);
    border: 1px solid rgba(255,200,100,0.2);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 12px;
    color: #ffc17c;
    margin-bottom: 16px;
}

.me-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-top: 1px solid rgba(255,255,255,0.08);
    gap: 8px;
}
.me-footer-left { display: flex; gap: 8px; }
.me-footer-right { display: flex; gap: 8px; }

.me-btn {
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.2);
    background: transparent;
    color: #fff;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
}
.me-btn:hover { background: rgba(255,255,255,0.08); }
.me-btn-primary {
    background: #6d4a37;
    border-color: #6d4a37;
}
.me-btn-primary:hover { background: #7d5a47; }
.me-btn-danger {
    color: #ff6b6b;
    border-color: rgba(255,107,107,0.3);
}
.me-btn-danger:hover { background: rgba(255,107,107,0.1); }

/* 선택기 드롭다운 */
.me-selector {
    position: relative;
}
.me-selector-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.15);
    background: #252525;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    min-height: 42px;
}
.me-selector-trigger:hover { border-color: rgba(255,255,255,0.3); }
.me-selector-trigger.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.me-selector-arrow { opacity: 0.5; }

.me-selector-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: #252525;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    max-height: 240px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: 10001;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.me-selector-search {
    padding: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.me-selector-search input {
    width: 100%;
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.1);
    background: #1a1a1a;
    color: #fff;
    font-size: 13px;
    box-sizing: border-box;
}
.me-selector-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
}
.me-selector-item {
    padding: 10px 12px;
    cursor: pointer;
    font-size: 13px;
    color: rgba(255,255,255,0.9);
    display: flex;
    align-items: center;
    gap: 10px;
}
.me-selector-item:hover { background: rgba(255,255,255,0.08); }
.me-selector-item.selected { background: rgba(109,74,55,0.3); }
.me-selector-item img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
}
.me-selector-empty {
    padding: 20px;
    text-align: center;
    color: rgba(255,255,255,0.4);
    font-size: 13px;
}

/* + 버튼 및 드롭다운 */
.me-add-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.2);
    background: transparent;
    color: rgba(255,255,255,0.7);
    font-size: 16px;
    cursor: pointer;
    margin-left: auto;
    position: relative;
}
.me-add-btn:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
}

.me-add-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    background: #252525;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    overflow: hidden;
    z-index: 100;
    min-width: 120px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.me-add-dropdown-item {
    padding: 10px 14px;
    font-size: 13px;
    color: #fff;
    cursor: pointer;
    white-space: nowrap;
}
.me-add-dropdown-item:hover { background: rgba(255,255,255,0.08); }
.me-add-dropdown-item.five { color: #8fd9ff; }
.me-add-dropdown-item.four { color: #ffc17c; }

/* 히스토리 패널 */
.me-history-panel {
    background: #1a1a1a;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.me-history-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
}
.me-history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 4px;
    background: #252525;
    border: 1px solid rgba(255,255,255,0.06);
}
.me-history-item:hover { background: #303030; }
.me-history-left {
    display: flex;
    align-items: center;
    gap: 10px;
}
.me-history-grade {
    font-weight: 600;
    font-size: 13px;
}
.me-history-grade.five { color: #8fd9ff; }
.me-history-grade.four { color: #ffc17c; }
.me-history-right {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: rgba(255,255,255,0.6);
}
.me-history-tag {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(255,255,255,0.1);
}
.me-history-tag.manual { background: rgba(100,200,100,0.2); color: #8f8; }
.me-history-tag.auto { background: rgba(100,150,255,0.2); color: #8af; }
`;
        document.head.appendChild(style);
    }

    // ─────────────────────────────────────────────────────────────
    // 모달 생성
    // ─────────────────────────────────────────────────────────────
    let currentModal = null;
    let currentDropdown = null;

    function closeModal() {
        if (currentModal) {
            currentModal.remove();
            currentModal = null;
        }
    }

    function closeDropdown() {
        if (currentDropdown) {
            currentDropdown.remove();
            currentDropdown = null;
        }
    }

    // 클릭 외부 감지로 드롭다운 닫기
    document.addEventListener('click', (e) => {
        if (currentDropdown && !currentDropdown.contains(e.target)) {
            const btn = currentDropdown._triggerBtn;
            if (!btn || !btn.contains(e.target)) {
                closeDropdown();
            }
        }
    });

    // ─────────────────────────────────────────────────────────────
    // 캐릭터/무기 선택기 컴포넌트
    // ─────────────────────────────────────────────────────────────
    function createSelector(options) {
        const { items, selected, onSelect, placeholder, disabled, isWeapon } = options;
        const container = document.createElement('div');
        container.className = 'me-selector';

        const trigger = document.createElement('div');
        trigger.className = 'me-selector-trigger' + (disabled ? ' disabled' : '');

        const selectedItem = items.find(it => it.key === selected || it.name === selected);
        trigger.innerHTML = `
            <span>${selectedItem ? selectedItem.name : placeholder}</span>
            <span class="me-selector-arrow">▼</span>
        `;

        let dropdown = null;

        function showDropdown() {
            if (disabled) return;
            if (dropdown) {
                dropdown.remove();
                dropdown = null;
                return;
            }

            dropdown = document.createElement('div');
            dropdown.className = 'me-selector-dropdown';

            const searchBox = document.createElement('div');
            searchBox.className = 'me-selector-search';
            searchBox.innerHTML = `<input type="text" placeholder="${t('search')}">`;
            dropdown.appendChild(searchBox);

            const list = document.createElement('div');
            list.className = 'me-selector-list';
            dropdown.appendChild(list);

            const searchInput = searchBox.querySelector('input');

            function renderList(filter = '') {
                list.innerHTML = '';
                const filtered = items.filter(it =>
                    it.name.toLowerCase().includes(filter.toLowerCase())
                );
                if (filtered.length === 0) {
                    list.innerHTML = `<div class="me-selector-empty">${t('noResults')}</div>`;
                    return;
                }
                for (const item of filtered) {
                    const el = document.createElement('div');
                    el.className = 'me-selector-item' + (item.key === selected ? ' selected' : '');

                    // 이미지
                    const base = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
                    let imgSrc = '';
                    if (isWeapon && item.ownerKey && item.weaponKey) {
                        const m = item.weaponKey.match(/^weapon(\d+)-(\d+)$/);
                        if (m) {
                            const num1 = m[1];
                            const num2 = String(m[2]).padStart(2, '0');
                            imgSrc = `${base}/assets/img/character-weapon/${item.ownerKey}-${num1}-${num2}.png`;
                        }
                    } else {
                        imgSrc = `${base}/assets/img/tier/${item.key}.webp`;
                    }

                    el.innerHTML = `
                        <img src="${imgSrc}" alt="" onerror="this.style.display='none'">
                        <span>${item.name}</span>
                    `;

                    el.addEventListener('click', () => {
                        onSelect(item);
                        trigger.innerHTML = `
                            <span>${item.name}</span>
                            <span class="me-selector-arrow">▼</span>
                        `;
                        dropdown.remove();
                        dropdown = null;
                    });

                    list.appendChild(el);
                }
            }

            renderList();
            searchInput.addEventListener('input', () => renderList(searchInput.value));

            container.appendChild(dropdown);
            setTimeout(() => searchInput.focus(), 50);
        }

        trigger.addEventListener('click', showDropdown);
        container.appendChild(trigger);

        return container;
    }

    // ─────────────────────────────────────────────────────────────
    // 추가 모달
    // ─────────────────────────────────────────────────────────────
    function openAddModal(panelKey, grade, onSave) {
        ensureStyles();
        closeModal();

        const isWeapon = panelKey === 'Weapon';
        const items = isWeapon ? getWeaponList(grade) : getCharacterList(grade);
        const maxPity = MAX_PITY[panelKey] || 80;

        let selectedItem = null;
        let selectedDateTime = nowInputValue();
        let selectedPity = 1;

        const backdrop = document.createElement('div');
        backdrop.className = 'me-backdrop';

        const modal = document.createElement('div');
        modal.className = 'me-modal';

        // Header
        const header = document.createElement('div');
        header.className = 'me-header';
        header.innerHTML = `
            <h3>${t('addRecord')} - ${grade}★</h3>
            <button class="me-close">&times;</button>
        `;
        header.querySelector('.me-close').onclick = closeModal;
        modal.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.className = 'me-body';

        // 캐릭터/무기 선택
        const selectorField = document.createElement('div');
        selectorField.className = 'me-field';
        selectorField.innerHTML = `<label>${isWeapon ? t('weapon') : t('character')}</label>`;
        const selector = createSelector({
            items,
            selected: null,
            placeholder: isWeapon ? t('selectWeapon') : t('selectCharacter'),
            onSelect: (item) => { selectedItem = item; },
            isWeapon
        });
        selectorField.appendChild(selector);
        body.appendChild(selectorField);

        // 날짜/시간
        const dateField = document.createElement('div');
        dateField.className = 'me-field';
        dateField.innerHTML = `
            <label>${t('dateTime')}</label>
            <input type="datetime-local" step="60" value="${selectedDateTime}">
        `;
        const dateInput = dateField.querySelector('input');
        dateInput.addEventListener('change', () => { selectedDateTime = dateInput.value; });
        body.appendChild(dateField);

        // At pity
        const pityField = document.createElement('div');
        pityField.className = 'me-field';
        pityField.innerHTML = `<label>${t('atPity')}</label>`;
        const pityRow = document.createElement('div');
        pityRow.className = 'me-pity-row';
        pityRow.innerHTML = `
            <input type="number" min="1" max="${maxPity}" value="1">
            <span class="me-pity-unit">${t('atPityUnit')}</span>
            <span class="me-pity-max">(${t('maxPity')}: ${maxPity})</span>
        `;
        const pityInput = pityRow.querySelector('input');
        pityInput.addEventListener('change', () => {
            let val = parseInt(pityInput.value) || 1;
            if (val < 1) val = 1;
            if (val > maxPity) val = maxPity;
            pityInput.value = val;
            selectedPity = val;
        });
        pityField.appendChild(pityRow);
        body.appendChild(pityField);

        // 등급 표시
        const gradeField = document.createElement('div');
        gradeField.className = 'me-field';
        gradeField.innerHTML = `
            <label>${t('grade')}</label>
            <div class="me-grade-display me-grade-${grade}">${grade}★</div>
        `;
        body.appendChild(gradeField);

        modal.appendChild(body);

        // Footer
        const footer = document.createElement('div');
        footer.className = 'me-footer';
        footer.innerHTML = `
            <div class="me-footer-left"></div>
            <div class="me-footer-right">
                <button class="me-btn me-btn-cancel">${t('cancel')}</button>
                <button class="me-btn me-btn-primary me-btn-save">${t('save')}</button>
            </div>
        `;
        footer.querySelector('.me-btn-cancel').onclick = closeModal;
        footer.querySelector('.me-btn-save').onclick = () => {
            if (!selectedItem) {
                alert(isWeapon ? t('selectWeapon') : t('selectCharacter'));
                return;
            }
            const timestamp = inputValueToTimestamp(selectedDateTime);
            const record = {
                gachaId: generateManualGachaId(),
                gachaType: getGachaTypeForPanel(panelKey),
                grade: grade,
                id: selectedItem.id || 0,
                name: selectedItem.name,
                timestamp: timestamp,
                tsOrder: 0,
                ts_order: 0,
                manualPity: selectedPity
            };
            closeModal();
            if (onSave) onSave(record, panelKey);
        };
        modal.appendChild(footer);

        backdrop.appendChild(modal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
        document.body.appendChild(backdrop);
        currentModal = backdrop;
    }

    // 패널 키 → gachaType 매핑
    function getGachaTypeForPanel(panelKey) {
        const map = {
            Confirmed: 7,
            Fortune: 2,
            Weapon: 5,
            Gold: 1,
            Newcomer: 6
        };
        return map[panelKey] || 1;
    }

    // ─────────────────────────────────────────────────────────────
    // 수정 모달
    // ─────────────────────────────────────────────────────────────
    function openEditModal(record, panelKey, onSave, onDelete) {
        ensureStyles();
        closeModal();

        const isManual = isManualRecord(record);
        const isWeapon = panelKey === 'Weapon';
        const grade = Number(record.grade || 5);
        const items = isWeapon ? getWeaponList(grade) : getCharacterList(grade);
        const maxPity = MAX_PITY[panelKey] || 80;

        let selectedItem = items.find(it => it.name === record.name) || { name: record.name };
        let selectedDateTime = timestampToInputValue(record.timestamp);
        let selectedPity = record.manualPity || 1;

        const backdrop = document.createElement('div');
        backdrop.className = 'me-backdrop';

        const modal = document.createElement('div');
        modal.className = 'me-modal';

        // Header
        const header = document.createElement('div');
        header.className = 'me-header';
        header.innerHTML = `
            <h3>${t('editRecord')}</h3>
            <button class="me-close">&times;</button>
        `;
        header.querySelector('.me-close').onclick = closeModal;
        modal.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.className = 'me-body';

        // 원본 데이터 경고
        if (!isManual) {
            const notice = document.createElement('div');
            notice.className = 'me-readonly-notice';
            notice.textContent = t('originalReadonly');
            body.appendChild(notice);
        }

        // 캐릭터/무기 선택
        const selectorField = document.createElement('div');
        selectorField.className = 'me-field';
        selectorField.innerHTML = `<label>${isWeapon ? t('weapon') : t('character')}</label>`;
        if (isManual) {
            const selector = createSelector({
                items,
                selected: record.name,
                placeholder: isWeapon ? t('selectWeapon') : t('selectCharacter'),
                onSelect: (item) => { selectedItem = item; },
                isWeapon
            });
            selectorField.appendChild(selector);
        } else {
            const display = document.createElement('div');
            display.className = 'me-grade-display';
            display.textContent = translateRecordName(record.name, isWeapon);
            selectorField.appendChild(display);
        }
        body.appendChild(selectorField);

        // 날짜/시간
        const dateField = document.createElement('div');
        dateField.className = 'me-field';
        dateField.innerHTML = `<label>${t('dateTime')}</label>`;
        if (isManual) {
            const input = document.createElement('input');
            input.type = 'datetime-local';
            input.step = '60';
            input.value = selectedDateTime;
            input.addEventListener('change', () => { selectedDateTime = input.value; });
            dateField.appendChild(input);
        } else {
            const display = document.createElement('div');
            display.className = 'me-grade-display';
            display.textContent = new Date(record.timestamp).toLocaleString();
            dateField.appendChild(display);
        }
        body.appendChild(dateField);

        // At pity
        const pityField = document.createElement('div');
        pityField.className = 'me-field';
        pityField.innerHTML = `<label>${t('atPity')}</label>`;
        if (isManual) {
            const pityRow = document.createElement('div');
            pityRow.className = 'me-pity-row';
            pityRow.innerHTML = `
                <input type="number" min="1" max="${maxPity}" value="${selectedPity}">
                <span class="me-pity-unit">${t('atPityUnit')}</span>
                <span class="me-pity-max">(${t('maxPity')}: ${maxPity})</span>
            `;
            const pityInput = pityRow.querySelector('input');
            pityInput.addEventListener('change', () => {
                let val = parseInt(pityInput.value) || 1;
                if (val < 1) val = 1;
                if (val > maxPity) val = maxPity;
                pityInput.value = val;
                selectedPity = val;
            });
            pityField.appendChild(pityRow);
        } else {
            const display = document.createElement('div');
            display.className = 'me-grade-display';
            // 원본은 계산된 pity 표시 (record에 저장되어 있지 않으므로 placeholder)
            display.textContent = `${record._displayPity || '-'} ${t('atPityUnit')}`;
            pityField.appendChild(display);
        }
        body.appendChild(pityField);

        // 등급 표시
        const gradeField = document.createElement('div');
        gradeField.className = 'me-field';
        gradeField.innerHTML = `
            <label>${t('grade')}</label>
            <div class="me-grade-display me-grade-${grade}">${grade}★</div>
        `;
        body.appendChild(gradeField);

        modal.appendChild(body);

        // Footer
        const footer = document.createElement('div');
        footer.className = 'me-footer';
        const footerLeft = document.createElement('div');
        footerLeft.className = 'me-footer-left';
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'me-btn me-btn-danger';
        deleteBtn.textContent = t('delete');
        deleteBtn.onclick = () => {
            if (confirm(t('confirmDelete'))) {
                closeModal();
                if (onDelete) onDelete(record, panelKey);
            }
        };
        footerLeft.appendChild(deleteBtn);

        const footerRight = document.createElement('div');
        footerRight.className = 'me-footer-right';

        if (isManual) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'me-btn me-btn-cancel';
            cancelBtn.textContent = t('cancel');
            cancelBtn.onclick = closeModal;
            footerRight.appendChild(cancelBtn);

            const saveBtn = document.createElement('button');
            saveBtn.className = 'me-btn me-btn-primary';
            saveBtn.textContent = t('save');
            saveBtn.onclick = () => {
                const updated = {
                    ...record,
                    name: selectedItem.name,
                    id: selectedItem.id || record.id,
                    timestamp: inputValueToTimestamp(selectedDateTime),
                    manualPity: selectedPity
                };
                closeModal();
                if (onSave) onSave(updated, panelKey);
            };
            footerRight.appendChild(saveBtn);
        } else {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'me-btn';
            closeBtn.textContent = t('close');
            closeBtn.onclick = closeModal;
            footerRight.appendChild(closeBtn);
        }

        footer.appendChild(footerLeft);
        footer.appendChild(footerRight);
        modal.appendChild(footer);

        backdrop.appendChild(modal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
        document.body.appendChild(backdrop);
        currentModal = backdrop;
    }

    // ─────────────────────────────────────────────────────────────
    // 히스토리 패널 (Pills 클릭 시)
    // ─────────────────────────────────────────────────────────────
    function openHistoryPanel(name, records, panelKey, onEdit) {
        ensureStyles();
        closeModal();

        const backdrop = document.createElement('div');
        backdrop.className = 'me-backdrop';

        const panel = document.createElement('div');
        panel.className = 'me-history-panel';

        // Header
        const header = document.createElement('div');
        header.className = 'me-header';
        header.innerHTML = `
            <h3>${name} - ${t('historyTitle')}</h3>
            <button class="me-close">&times;</button>
        `;
        header.querySelector('.me-close').onclick = closeModal;
        panel.appendChild(header);

        // List
        const list = document.createElement('div');
        list.className = 'me-history-list';

        // 시간 역순 정렬
        const sorted = records.slice().sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));

        for (const rec of sorted) {
            const item = document.createElement('div');
            item.className = 'me-history-item';

            const isManual = isManualRecord(rec);
            const grade = Number(rec.grade || 5);
            const dateStr = formatDateTime(rec.timestamp);
            const pityStr = rec._displayPity || rec.manualPity || '-';

            item.innerHTML = `
                <div class="me-history-left">
                    <span class="me-history-grade ${grade === 5 ? 'five' : 'four'}">${grade}★</span>
                    <span class="me-history-tag ${isManual ? 'manual' : 'auto'}">${isManual ? t('manualTag') : t('autoTag')}</span>
                </div>
                <div class="me-history-right">
                    <span>${dateStr}</span>
                    <span>${pityStr} ${t('atPityUnit')}</span>
                </div>
            `;

            item.addEventListener('click', () => {
                closeModal();
                if (onEdit) onEdit(rec);
            });

            list.appendChild(item);
        }

        if (sorted.length === 0) {
            list.innerHTML = `<div class="me-selector-empty">${t('noResults')}</div>`;
        }

        panel.appendChild(list);
        backdrop.appendChild(panel);

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
        document.body.appendChild(backdrop);
        currentModal = backdrop;
    }

    // ─────────────────────────────────────────────────────────────
    // + 버튼 드롭다운
    // ─────────────────────────────────────────────────────────────
    function createAddButton(panelKey, onAdd) {
        ensureStyles(); // 스타일 보장
        const btn = document.createElement('button');
        btn.className = 'me-add-btn';
        btn.innerHTML = '+';
        btn.title = t('addRecord');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeDropdown();

            const dropdown = document.createElement('div');
            dropdown.className = 'me-add-dropdown';
            dropdown._triggerBtn = btn;

            const item5 = document.createElement('div');
            item5.className = 'me-add-dropdown-item five';
            item5.textContent = t('get5Star');
            item5.addEventListener('click', (ev) => {
                ev.stopPropagation();
                closeDropdown();
                if (onAdd) onAdd(5);
            });

            const item4 = document.createElement('div');
            item4.className = 'me-add-dropdown-item four';
            item4.textContent = t('get4Star');
            item4.addEventListener('click', (ev) => {
                ev.stopPropagation();
                closeDropdown();
                if (onAdd) onAdd(4);
            });

            dropdown.appendChild(item5);
            dropdown.appendChild(item4);
            btn.appendChild(dropdown);
            currentDropdown = dropdown;
        });

        return btn;
    }

    // ─────────────────────────────────────────────────────────────
    // 보정 모달 (총 뽑기/진행 중 조정)
    // ─────────────────────────────────────────────────────────────

    const adjustI18n = {
        kr: {
            title: '횟수 보정',
            originalTotal: '기존 총 뽑기',
            additionalPulls: '추가 횟수',
            displayTotal: '표시될 총 뽑기',
            originalProgress: '기존 진행 중',
            progressAdjust: '진행 중 조정',
            displayProgress: '표시될 진행 중',
            note: '※ 기존 데이터는 유지되며, 표시만 조정됩니다.',
            reset: '초기화'
        },
        en: {
            title: 'Adjust Counts',
            originalTotal: 'Original Total',
            additionalPulls: 'Additional Pulls',
            displayTotal: 'Displayed Total',
            originalProgress: 'Original In Progress',
            progressAdjust: 'Progress Adjust',
            displayProgress: 'Displayed Progress',
            note: '※ Original data is preserved; only display is adjusted.',
            reset: 'Reset'
        },
        jp: {
            title: '回数補正',
            originalTotal: '元の総数',
            additionalPulls: '追加回数',
            displayTotal: '表示される総数',
            originalProgress: '元の進行中',
            progressAdjust: '進行中調整',
            displayProgress: '表示される進行中',
            note: '※ 元データは保持され、表示のみ調整されます。',
            reset: 'リセット'
        }
    };

    function ta(key) {
        const l = lang();
        return (adjustI18n[l] || adjustI18n.kr)[key] || key;
    }

    function openAdjustModal(panelKey, originalTotal, originalProgress, onSave) {
        ensureStyles();
        closeModal();

        // 현재 보정값 로드
        let adj = { additionalPulls: 0, progressAdjust: 0 };
        if (window.RecordManager && window.RecordManager.getAdjustment) {
            adj = window.RecordManager.getAdjustment(panelKey);
        }

        let additionalPulls = adj.additionalPulls || 0;
        let progressAdjust = adj.progressAdjust || 0;

        const backdrop = document.createElement('div');
        backdrop.className = 'me-backdrop';

        const modal = document.createElement('div');
        modal.className = 'me-modal';

        // Header
        const header = document.createElement('div');
        header.className = 'me-header';
        header.innerHTML = `
            <h3>${ta('title')}</h3>
            <button class="me-close">&times;</button>
        `;
        header.querySelector('.me-close').onclick = closeModal;
        modal.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.className = 'me-body';

        // 안내 문구
        const notice = document.createElement('div');
        notice.className = 'me-readonly-notice';
        notice.style.background = 'rgba(100,150,255,0.1)';
        notice.style.borderColor = 'rgba(100,150,255,0.2)';
        notice.style.color = '#8af';
        notice.textContent = ta('note');
        body.appendChild(notice);

        // 총 뽑기 섹션
        const totalSection = document.createElement('div');
        totalSection.style.cssText = 'background:#252525; border-radius:8px; padding:12px; margin-bottom:12px;';

        // 기존 총 뽑기
        const origTotalRow = document.createElement('div');
        origTotalRow.className = 'me-field';
        origTotalRow.style.marginBottom = '8px';
        origTotalRow.innerHTML = `
            <label style="display:flex;justify-content:space-between;">
                <span>${ta('originalTotal')}</span>
                <strong>${numberFormat(originalTotal)}</strong>
            </label>
        `;
        totalSection.appendChild(origTotalRow);

        // 추가 횟수 입력
        const addPullsRow = document.createElement('div');
        addPullsRow.className = 'me-field';
        addPullsRow.style.marginBottom = '8px';
        addPullsRow.innerHTML = `<label>${ta('additionalPulls')}</label>`;
        
        const addPullsControl = document.createElement('div');
        addPullsControl.style.cssText = 'display:flex; align-items:center; gap:8px;';
        
        const addPullsInput = document.createElement('input');
        addPullsInput.type = 'number';
        addPullsInput.min = '0';
        addPullsInput.value = additionalPulls;
        addPullsInput.style.cssText = 'width:80px; text-align:center;';
        
        const btn1 = document.createElement('button');
        btn1.className = 'me-btn';
        btn1.textContent = '+1';
        btn1.style.padding = '6px 12px';
        btn1.onclick = () => {
            additionalPulls = Math.max(0, additionalPulls + 1);
            addPullsInput.value = additionalPulls;
            updateDisplayTotal();
        };
        
        const btn10 = document.createElement('button');
        btn10.className = 'me-btn';
        btn10.textContent = '+10';
        btn10.style.padding = '6px 12px';
        btn10.onclick = () => {
            additionalPulls = Math.max(0, additionalPulls + 10);
            addPullsInput.value = additionalPulls;
            updateDisplayTotal();
        };

        const btnMinus = document.createElement('button');
        btnMinus.className = 'me-btn';
        btnMinus.textContent = '-1';
        btnMinus.style.padding = '6px 12px';
        btnMinus.onclick = () => {
            additionalPulls = Math.max(0, additionalPulls - 1);
            addPullsInput.value = additionalPulls;
            updateDisplayTotal();
        };

        addPullsInput.addEventListener('input', () => {
            additionalPulls = Math.max(0, parseInt(addPullsInput.value) || 0);
            updateDisplayTotal();
        });

        addPullsControl.appendChild(addPullsInput);
        addPullsControl.appendChild(btnMinus);
        addPullsControl.appendChild(btn1);
        addPullsControl.appendChild(btn10);
        addPullsRow.appendChild(addPullsControl);
        totalSection.appendChild(addPullsRow);

        // 표시될 총 뽑기
        const displayTotalRow = document.createElement('div');
        displayTotalRow.innerHTML = `
            <label style="display:flex;justify-content:space-between;color:#8fd9ff;">
                <span>${ta('displayTotal')}</span>
                <strong id="displayTotalValue">${numberFormat(originalTotal + additionalPulls)}</strong>
            </label>
        `;
        totalSection.appendChild(displayTotalRow);
        body.appendChild(totalSection);

        // 진행 중 섹션
        const progressSection = document.createElement('div');
        progressSection.style.cssText = 'background:#252525; border-radius:8px; padding:12px;';

        // 기존 진행 중
        const origProgressRow = document.createElement('div');
        origProgressRow.className = 'me-field';
        origProgressRow.style.marginBottom = '8px';
        origProgressRow.innerHTML = `
            <label style="display:flex;justify-content:space-between;">
                <span>${ta('originalProgress')}</span>
                <strong>${numberFormat(originalProgress)}</strong>
            </label>
        `;
        progressSection.appendChild(origProgressRow);

        // 진행 중 조정
        const progressAdjustRow = document.createElement('div');
        progressAdjustRow.className = 'me-field';
        progressAdjustRow.style.marginBottom = '8px';
        progressAdjustRow.innerHTML = `<label>${ta('progressAdjust')}</label>`;
        
        const progressControl = document.createElement('div');
        progressControl.style.cssText = 'display:flex; align-items:center; gap:8px;';
        
        const progressInput = document.createElement('input');
        progressInput.type = 'number';
        progressInput.value = progressAdjust;
        progressInput.style.cssText = 'width:80px; text-align:center;';
        
        const pBtn1 = document.createElement('button');
        pBtn1.className = 'me-btn';
        pBtn1.textContent = '+1';
        pBtn1.style.padding = '6px 12px';
        pBtn1.onclick = () => {
            progressAdjust++;
            progressInput.value = progressAdjust;
            updateDisplayProgress();
        };
        
        const pBtn10 = document.createElement('button');
        pBtn10.className = 'me-btn';
        pBtn10.textContent = '+10';
        pBtn10.style.padding = '6px 12px';
        pBtn10.onclick = () => {
            progressAdjust += 10;
            progressInput.value = progressAdjust;
            updateDisplayProgress();
        };

        const pBtnMinus = document.createElement('button');
        pBtnMinus.className = 'me-btn';
        pBtnMinus.textContent = '-1';
        pBtnMinus.style.padding = '6px 12px';
        pBtnMinus.onclick = () => {
            progressAdjust--;
            progressInput.value = progressAdjust;
            updateDisplayProgress();
        };

        progressInput.addEventListener('input', () => {
            progressAdjust = parseInt(progressInput.value) || 0;
            updateDisplayProgress();
        });

        progressControl.appendChild(progressInput);
        progressControl.appendChild(pBtnMinus);
        progressControl.appendChild(pBtn1);
        progressControl.appendChild(pBtn10);
        progressAdjustRow.appendChild(progressControl);
        progressSection.appendChild(progressAdjustRow);

        // 표시될 진행 중
        const displayProgressRow = document.createElement('div');
        displayProgressRow.innerHTML = `
            <label style="display:flex;justify-content:space-between;color:#ffc17c;">
                <span>${ta('displayProgress')}</span>
                <strong id="displayProgressValue">${numberFormat(Math.max(0, originalProgress + progressAdjust))}</strong>
            </label>
        `;
        progressSection.appendChild(displayProgressRow);
        body.appendChild(progressSection);

        modal.appendChild(body);

        // 업데이트 함수
        function updateDisplayTotal() {
            const el = modal.querySelector('#displayTotalValue');
            if (el) el.textContent = numberFormat(originalTotal + additionalPulls);
        }
        function updateDisplayProgress() {
            const el = modal.querySelector('#displayProgressValue');
            if (el) el.textContent = numberFormat(Math.max(0, originalProgress + progressAdjust));
        }

        // Footer
        const footer = document.createElement('div');
        footer.className = 'me-footer';
        
        const footerLeft = document.createElement('div');
        footerLeft.className = 'me-footer-left';
        const resetBtn = document.createElement('button');
        resetBtn.className = 'me-btn me-btn-danger';
        resetBtn.textContent = ta('reset');
        resetBtn.onclick = () => {
            additionalPulls = 0;
            progressAdjust = 0;
            addPullsInput.value = 0;
            progressInput.value = 0;
            updateDisplayTotal();
            updateDisplayProgress();
        };
        footerLeft.appendChild(resetBtn);

        const footerRight = document.createElement('div');
        footerRight.className = 'me-footer-right';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'me-btn';
        cancelBtn.textContent = t('cancel');
        cancelBtn.onclick = closeModal;
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'me-btn me-btn-primary';
        saveBtn.textContent = t('save');
        saveBtn.onclick = () => {
            closeModal();
            if (onSave) onSave(additionalPulls, progressAdjust);
        };

        footerRight.appendChild(cancelBtn);
        footerRight.appendChild(saveBtn);
        footer.appendChild(footerLeft);
        footer.appendChild(footerRight);
        modal.appendChild(footer);

        backdrop.appendChild(modal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
        document.body.appendChild(backdrop);
        currentModal = backdrop;
    }

    function numberFormat(n) {
        try { return new Intl.NumberFormat().format(n); }
        catch (_) { return String(n); }
    }

    // 수정 아이콘 생성 (연필 아이콘)
    function createEditIcon(onClick) {
        const icon = document.createElement('span');
        icon.className = 'me-edit-icon';
        icon.innerHTML = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        icon.style.cssText = 'display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; cursor:pointer; opacity:0.5; transition:opacity 0.15s; margin-left:6px; vertical-align:middle;';
        icon.addEventListener('mouseenter', () => { icon.style.opacity = '1'; });
        icon.addEventListener('mouseleave', () => { icon.style.opacity = '0.5'; });
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onClick) onClick();
        });
        return icon;
    }

    // ─────────────────────────────────────────────────────────────
    // 전역 노출
    // ─────────────────────────────────────────────────────────────
    window.ManualEditor = {
        openAddModal,
        openEditModal,
        openHistoryPanel,
        openAdjustModal,
        createAddButton,
        createEditIcon,
        isManualRecord,
        generateManualGachaId,
        MAX_PITY
    };

})();

