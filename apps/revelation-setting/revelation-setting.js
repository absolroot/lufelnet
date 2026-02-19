(function () {
    'use strict';

    const SLOT_CONFIG = [
        { id: 'uni', titleKey: 'slot_uni', mainStatsKey: 'uni', subStatsGroup: 'universe', icon: 'icon-주.png' },
        { id: 'sun', titleKey: 'slot_sun', mainStatsKey: 'sun', subStatsGroup: 'universal', icon: 'icon-일.png' },
        { id: 'moon', titleKey: 'slot_moon', mainStatsKey: 'moon', subStatsGroup: 'universal', icon: 'icon-월.png' },
        { id: 'star', titleKey: 'slot_star', mainStatsKey: 'star', subStatsGroup: 'universal', icon: 'icon-성.png' },
        { id: 'sky', titleKey: 'slot_sky', mainStatsKey: 'sky', subStatsGroup: 'universal', icon: 'icon-진.png' }
    ];

    const SUB_STAT_KEY_MAP = {
        'Crit Rate': 'sub_crit_rate',
        'Crit Mult.': 'sub_crit_mult',
        'Pierce Rate': 'sub_pierce_rate',
        'Attack Mult.': 'sub_attack_mult',
        'Attack %': 'sub_attack_percent',
        'Attack': 'sub_attack',
        'HP %': 'sub_hp_percent',
        'HP': 'sub_hp',
        'Defense %': 'sub_defense_percent',
        'Defense': 'sub_defense',
        'Ailment Accuracy': 'sub_ailment_accuracy',
        'SP Recovery': 'sub_sp_recovery',
        'Speed': 'sub_speed',
        'Healing Effect': 'sub_healing_effect'
    };

    const PERCENT_STAT_CANONICAL = new Set([
        'Crit Rate',
        'Crit Mult.',
        'Pierce Rate',
        'Attack Mult.',
        'Attack %',
        'HP %',
        'Defense %',
        'Ailment Accuracy',
        'SP Recovery',
        'Healing Effect'
    ]);

    const STAT_ICON_ALIAS = {
        '공격력': '공격력',
        '공격력%': '공격력',
        'Attack': '공격력',
        'Attack %': '공격력',
        '\uACF5\uACA9\uB825 %': '\uACF5\uACA9\uB825',
        '\uACF5\uACA9\uB825%': '\uACF5\uACA9\uB825',
        '攻撃力': '공격력',
        '攻撃力%': '공격력',

        '방어력': '방어력',
        '방어력%': '방어력',
        'Defense': '방어력',
        'Defense %': '방어력',
        '\uBC29\uC5B4\uB825 %': '\uBC29\uC5B4\uB825',
        '\uBC29\uC5B4\uB825%': '\uBC29\uC5B4\uB825',
        '防御力': '방어력',
        '防御力%': '방어력',

        '생명': '생명',
        '생명%': '생명',
        'HP': '생명',
        'HP %': '생명',

        '대미지 보너스': '대미지 보너스',
        'Attack Mult.': '대미지 보너스',
        '攻撃倍率+': '대미지 보너스',

        '치료 효과': '치료 효과',
        'Healing Effect': '치료 효과',
        'HP回復量': '치료 효과',

        '크리티컬 확률': '크리티컬 확률',
        'Crit Rate': '크리티컬 확률',
        'CRT発生率': '크리티컬 확률',

        '크리티컬 효과': '크리티컬 효과',
        'Crit Mult.': '크리티컬 효과',
        'CRT倍率': '크리티컬 효과',

        '효과 명중': '효과 명중',
        '효과명중': '효과 명중',
        'Ailment Accuracy': '효과 명중',
        '状態異常命中': '효과 명중',

        'SP 회복': 'SP 회복',
        'SP회복': 'SP 회복',
        'SP Recovery': 'SP 회복',
        'SP回復': 'SP 회복',

        '속도': '속도',
        'Speed': '속도',
        '速さ': '속도',

        '관통': '관통',
        'Pierce Rate': '관통',
        '貫通': '관통'
    };

    const ELEMENT_ORDER = ['물리', '총격', '화염', '빙결', '전격', '질풍', '염동', '핵열', '축복', '주원', '만능'];
    const POSITION_ORDER = ['지배', '반항', '우월', '굴복', '방위', '구원', '해명', '자율'];

    const scriptPromiseCache = new Map();
    const settingPromiseCache = new Map();
    const STORAGE_PREFIX_V1 = 'revelation-setting:v1:';
    const STORAGE_PREFIX_V2 = 'revelation-setting:v2:';
    const DEFAULT_PRESET_ID = 'default';
    const PRESET_ID_PREFIX = 'preset-';
    const PRESET_ADD_ACTION = '__add_preset__';
    const PRESET_MAX_COUNT = 20;
    const PRESET_NAME_MAX_LENGTH = 24;
    const SHARE_PAYLOAD_VERSION = 1;
    const SHARE_QUERY_KEY = 'bin';
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzxSnf6_09q_LDRKIkmBvE2oTtQaLnK22M9ozrHMUAV0JnND9sc6CTILlnBS7_T8FIe/exec';

    const state = {
        lang: 'kr',
        baseUrl: window.BASE_URL || '',
        version: (typeof window.APP_VERSION !== 'undefined' && window.APP_VERSION)
            ? `?v=${encodeURIComponent(String(window.APP_VERSION))}`
            : '',
        statsData: null,
        revelationDataKr: null,
        revelationDataLocalized: null,
        revelationMapping: {},
        characterList: [],
        characterFilters: {
            query: '',
            elements: new Set(),
            positions: new Set()
        },
        statCanonicalLookup: null,
        selectedCharacter: '',
        mainRev: '',
        subRev: '',
        slots: createInitialSlotState(),
        presetOrder: [DEFAULT_PRESET_ID],
        presetMap: {},
        presetNameMap: {},
        activePresetId: DEFAULT_PRESET_ID
    };

    const dom = {};
    let globalEventsBound = false;
    let openDropdownRoot = null;
    let toastTimerId = null;
    let disposeCharacterSpoilerBinding = null;
    let activePresetRenameDialog = null;

    function createInitialSlotState() {
        const out = {};
        SLOT_CONFIG.forEach((slot) => {
            out[slot.id] = {
                mainOption: '',
                subs: Array.from({ length: 4 }, () => ({ option: '', value: '', upgrades: '' }))
            };
        });
        return out;
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function t(key, fallback) {
        if (window.I18nService && typeof window.I18nService.t === 'function') {
            return window.I18nService.t(key, fallback);
        }
        return fallback || key;
    }

    function getCurrentLang() {
        if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
            return window.I18nService.getCurrentLanguage();
        }
        if (window.LanguageRouter && typeof window.LanguageRouter.getCurrentLanguage === 'function') {
            return window.LanguageRouter.getCurrentLanguage();
        }
        return 'kr';
    }

    function showError(message) {
        const target = document.querySelector('.revelation-setting-page');
        if (!target) return;

        let errorEl = document.getElementById('rsErrorMessage');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'rsErrorMessage';
            errorEl.style.margin = '8px 0 12px';
            errorEl.style.padding = '10px 12px';
            errorEl.style.borderRadius = '8px';
            errorEl.style.background = '#3b161b';
            errorEl.style.border = '1px solid #8f2f3a';
            errorEl.style.color = '#ffe5e8';
            target.insertBefore(errorEl, target.querySelector('.rs-top-panel'));
        }
        errorEl.textContent = message;
    }

    function clearError() {
        const errorEl = document.getElementById('rsErrorMessage');
        if (errorEl) errorEl.remove();
    }

    function showToast(message, type) {
        const text = String(message || '').trim();
        if (!text) return;

        let toast = document.getElementById('rsToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'rsToast';
            toast.className = 'rs-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = text;
        toast.classList.remove('is-success', 'is-error', 'is-show');
        toast.classList.add(type === 'error' ? 'is-error' : 'is-success');

        // Force reflow so repeated same-message toast also animates.
        void toast.offsetWidth;
        toast.classList.add('is-show');

        if (toastTimerId) {
            window.clearTimeout(toastTimerId);
        }
        toastTimerId = window.setTimeout(() => {
            toast.classList.remove('is-show');
        }, 2200);
    }

    function loadScript(src) {
        if (scriptPromiseCache.has(src)) {
            return scriptPromiseCache.get(src);
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });

        scriptPromiseCache.set(src, promise);
        return promise;
    }

    async function loadStatsData() {
        const statsUrl = `${state.baseUrl}/apps/revelations/revelation_stats.json`;
        const response = await fetch(statsUrl, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`Failed to load stats data: ${response.status}`);
        }
        state.statsData = await response.json();
        state.statCanonicalLookup = null;
    }

    function getLocalizedRevelationData() {
        if (state.lang === 'en') {
            if (typeof enRevelationData !== 'undefined') return enRevelationData;
            if (window.enRevelationData) return window.enRevelationData;
        }
        if (state.lang === 'jp') {
            if (typeof jpRevelationData !== 'undefined') return jpRevelationData;
            if (window.jpRevelationData) return window.jpRevelationData;
        }
        return null;
    }

    async function loadRevelationData() {
        await loadScript(`${state.baseUrl}/data/kr/revelations/revelations.js${state.version}`);
        state.revelationDataKr = window.revelationData || null;
        state.revelationDataLocalized = null;

        if (!state.revelationDataKr || !state.revelationDataKr.main) {
            throw new Error('Korean revelation data is missing.');
        }

        state.revelationMapping = {};

        if (state.lang === 'en' || state.lang === 'jp') {
            await loadScript(`${state.baseUrl}/data/${state.lang}/revelations/revelations.js${state.version}`);
            const localized = getLocalizedRevelationData();
            if (localized) {
                state.revelationDataLocalized = localized;
                state.revelationMapping = (state.lang === 'en')
                    ? (localized.mapping_en || {})
                    : (localized.mapping_jp || {});
            }
        }
    }

    function getCharacterLabel(krName) {
        const data = (window.characterData || {})[krName] || null;
        if (!data) return krName;

        if (state.lang === 'en') {
            return data.codename || data.name_en || data.name || krName;
        }
        if (state.lang === 'jp') {
            return data.name_jp || data.name || krName;
        }
        return krName;
    }

    function getCharacterImagePath(krName) {
        const safeName = encodeURIComponent(String(krName || ''));
        if (!safeName) return '';
        return `${state.baseUrl}/assets/img/character-half/${safeName}.webp`;
    }

    function getRevelationImagePath(krName) {
        const safeName = encodeURIComponent(String(krName || ''));
        if (!safeName) return '';
        return `${state.baseUrl}/assets/img/revelation/${safeName}.webp`;
    }

    function getRevelationTitleIconPath(krName) {
        const safeName = encodeURIComponent(String(krName || ''));
        if (!safeName) return '';
        return `${state.baseUrl}/assets/img/character-detail/revel/${safeName}.webp`;
    }

    function getSlotIconPath(slotId) {
        const slot = SLOT_CONFIG.find((item) => item.id === slotId);
        if (!slot) return '';
        return `${state.baseUrl}/assets/img/revelation/${slot.icon}`;
    }

    function getSubSlotIds() {
        return ['sun', 'moon', 'star', 'sky'];
    }

    function getStatIconPath(label) {
        const normalized = String(label || '').trim();
        if (!normalized) return '';
        const iconName = STAT_ICON_ALIAS[normalized];
        if (!iconName) return '';
        return `${state.baseUrl}/assets/img/stat-icon/${encodeURIComponent(iconName)}.png`;
    }

    function derivePngFromWebp(src) {
        const text = String(src || '');
        if (!text || !text.endsWith('.webp')) return '';
        return text.slice(0, -5) + '.png';
    }

    function toRevelationLabel(krName) {
        if (!krName) return '';
        if (state.lang === 'kr') return krName;
        return state.revelationMapping[krName] || krName;
    }

    function translateSubStatOption(rawLabel) {
        const key = SUB_STAT_KEY_MAP[rawLabel];
        if (!key) return rawLabel;
        return t(key, rawLabel);
    }

    function getTextWithFallback(localizedText, koreanText) {
        const localized = String(localizedText || '').trim();
        if (localized) return localized;
        return String(koreanText || '').trim();
    }

    function getSubSetEffects(subKrName) {
        const empty = { set2: '', set4: '' };
        const subName = String(subKrName || '').trim();
        if (!subName) return empty;

        const krSubEffects = (state.revelationDataKr && state.revelationDataKr.sub_effects) || {};
        const krEffect = krSubEffects[subName] || {};

        if (state.lang === 'kr') {
            return {
                set2: String(krEffect.set2 || ''),
                set4: String(krEffect.set4 || '')
            };
        }

        const localizedData = state.revelationDataLocalized || {};
        const localizedSubEffects = localizedData.sub_effects || {};
        const localizedSubName = toRevelationLabel(subName);
        const localizedEffect = localizedSubEffects[localizedSubName] || {};

        return {
            set2: getTextWithFallback(localizedEffect.set2, krEffect.set2),
            set4: getTextWithFallback(localizedEffect.set4, krEffect.set4)
        };
    }

    function getMainSubSetEffect(mainKrName, subKrName) {
        const mainName = String(mainKrName || '').trim();
        const subName = String(subKrName || '').trim();
        if (!mainName || !subName) return '';

        const krSetEffects = (state.revelationDataKr && state.revelationDataKr.set_effects) || {};
        const krText = ((krSetEffects[mainName] || {})[subName]) || '';

        if (state.lang === 'kr') {
            return String(krText || '');
        }

        const localizedData = state.revelationDataLocalized || {};
        const localizedSetEffects = localizedData.set_effects || {};
        const localizedMain = toRevelationLabel(mainName);
        const localizedSub = toRevelationLabel(subName);
        const localizedText = ((localizedSetEffects[localizedMain] || {})[localizedSub]) || '';

        return getTextWithFallback(localizedText, krText);
    }

    function renderEffectText(effectText, emptyText) {
        const safeEmpty = escapeHtml(emptyText || '-');
        const raw = String(effectText || '').trim();
        if (!raw) return safeEmpty;
        return escapeHtml(raw).replace(/\r\n|\r|\n/g, '<br>');
    }

    function isSelectableCharacterName(name) {
        const text = String(name || '').trim();
        if (!text) return false;
        return text !== '원더';
    }

    async function loadCharacterNames() {
        const unique = new Set();

        if (window.CharacterListLoader && typeof window.CharacterListLoader.getVisibleNames === 'function') {
            const visibleNames = await window.CharacterListLoader.getVisibleNames();
            (visibleNames || []).forEach((name) => {
                if (isSelectableCharacterName(name)) unique.add(name);
            });
        } else {
            const list = window.characterList || { mainParty: [], supportParty: [] };
            (list.mainParty || []).forEach((name) => isSelectableCharacterName(name) && unique.add(name));
            (list.supportParty || []).forEach((name) => isSelectableCharacterName(name) && unique.add(name));
        }

        state.characterList = Array.from(unique)
            .filter((name) => isSelectableCharacterName(name))
            .sort((a, b) => {
                const aOrder = Number(((window.characterData || {})[a] || {}).release_order) || 0;
                const bOrder = Number(((window.characterData || {})[b] || {}).release_order) || 0;
                if (aOrder !== bOrder) return bOrder - aOrder;
                return String(a).localeCompare(String(b), 'ko');
            });
    }

    function normalizePrefList(value) {
        if (!value) return [];
        if (Array.isArray(value)) return value.filter(Boolean);
        if (typeof value === 'string') return [value];
        return [];
    }

    async function loadCharacterSetting(characterName) {
        const name = String(characterName || '').trim();
        if (!name) return false;

        if (window.characterSetting && window.characterSetting[name]) {
            return true;
        }

        if (settingPromiseCache.has(name)) {
            return settingPromiseCache.get(name);
        }

        const src = `${state.baseUrl}/data/characters/${encodeURIComponent(name)}/setting.js${state.version}`;
        const promise = new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve(!!(window.characterSetting && window.characterSetting[name]));
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });

        settingPromiseCache.set(name, promise);
        return promise;
    }

    function getMainRevelationOptions() {
        return Object.keys((state.revelationDataKr && state.revelationDataKr.main) || {});
    }

    function getSubRevelationOptions(mainRev) {
        const options = (state.revelationDataKr && state.revelationDataKr.main && state.revelationDataKr.main[mainRev]) || [];
        return Array.isArray(options) ? options : [];
    }

    function getMainStatRows(slotId) {
        const langStats = (state.statsData && state.statsData.main_stats && state.statsData.main_stats[state.lang])
            || (state.statsData && state.statsData.main_stats && state.statsData.main_stats.kr)
            || {};
        const config = SLOT_CONFIG.find((slot) => slot.id === slotId);
        if (!config) return [];
        return langStats[config.mainStatsKey] || [];
    }

    function getSubStatRows(slotId) {
        const config = SLOT_CONFIG.find((slot) => slot.id === slotId);
        if (!config) return [];
        const groups = (state.statsData && state.statsData.sub_stats) || {};
        return groups[config.subStatsGroup] || [];
    }

    function getSubStatMaxValue(slotId, optionLabel) {
        const match = getSubStatRows(slotId).find((row) => row && row[0] === optionLabel);
        if (!match) return '';
        return String(match[1] || '');
    }

    function normalizeStatKey(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '');
    }

    function buildStatCanonicalLookup() {
        const lookup = {};
        const statsData = state.statsData || {};

        function register(label, canonical) {
            const raw = String(label || '').trim();
            const target = String(canonical || '').trim();
            if (!raw || !target) return;
            lookup[raw] = target;
            lookup[normalizeStatKey(raw)] = target;
        }

        const mainStats = statsData.main_stats || {};
        const enMain = mainStats.en || {};
        const krMain = mainStats.kr || {};
        const jpMain = mainStats.jp || {};

        ['uni', 'sun', 'moon', 'star', 'sky'].forEach((slotId) => {
            const enRows = enMain[slotId] || [];
            const krRows = krMain[slotId] || [];
            const jpRows = jpMain[slotId] || [];

            enRows.forEach((row, index) => {
                const canonical = String((row && row[0]) || '').trim();
                if (!canonical) return;

                register(canonical, canonical);
                register(krRows[index] && krRows[index][0], canonical);
                register(jpRows[index] && jpRows[index][0], canonical);
            });
        });

        const subStats = statsData.sub_stats || {};
        Object.keys(subStats).forEach((groupKey) => {
            const rows = subStats[groupKey] || [];
            rows.forEach((row) => {
                const canonical = String((row && row[0]) || '').trim();
                if (!canonical) return;
                register(canonical, canonical);
            });
        });

        return lookup;
    }

    function toCanonicalStatKey(name) {
        const raw = String(name || '').trim();
        if (!raw) return '';

        if (!state.statCanonicalLookup) {
            state.statCanonicalLookup = buildStatCanonicalLookup();
        }
        return state.statCanonicalLookup[raw]
            || state.statCanonicalLookup[normalizeStatKey(raw)]
            || raw;
    }

    function getMainDisplayRows(slotId, selectedOption) {
        const rows = getMainStatRows(slotId);
        if (!rows.length) return [];

        if (slotId === 'uni') {
            return rows.slice(0, 2).map((row) => ({
                option: row[0],
                value: String(row[2] || row[1] || '')
            }));
        }

        if (slotId === 'sun') {
            const row = rows[0];
            return [{
                option: row[0],
                value: String(row[2] || row[1] || '')
            }];
        }

        const selected = rows.find((row) => row[0] === selectedOption) || rows[0];
        if (!selected) return [];
        return [{
            option: selected[0],
            value: String(selected[2] || selected[1] || '')
        }];
    }

    function getMainBlockedSubOptions(slotId) {
        const slotState = state.slots[slotId];
        if (!slotState) return new Set();
        const blockedRows = getMainDisplayRows(slotId, slotState.mainOption);
        return new Set(
            blockedRows
                .map((row) => toCanonicalStatKey(row.option))
                .filter(Boolean)
        );
    }

    function getBlockedSubOptions(slotId, rowIndex) {
        const slotState = state.slots[slotId];
        if (!slotState) return new Set();

        const blocked = getMainBlockedSubOptions(slotId);
        const currentIndex = Number.isInteger(rowIndex) ? rowIndex : -1;

        slotState.subs.forEach((row, idx) => {
            if (idx === currentIndex) return;
            const selected = toCanonicalStatKey(row.option);
            if (selected) {
                blocked.add(selected);
            }
        });

        return blocked;
    }

    function enforceSubOptionRestrictions(slotId) {
        const slotState = state.slots[slotId];
        if (!slotState) return;

        const blockedByMain = getMainBlockedSubOptions(slotId);
        const seen = new Set();

        slotState.subs.forEach((row) => {
            const selected = String(row.option || '').trim();
            if (!selected) return;
            const canonicalSelected = toCanonicalStatKey(selected);

            if (blockedByMain.has(canonicalSelected) || seen.has(canonicalSelected)) {
                row.option = '';
                row.value = '';
                return;
            }

            seen.add(canonicalSelected);
        });
    }

    function applyDefaultSubOptions(slotId) {
        const slotState = state.slots[slotId];
        if (!slotState) return;

        const candidates = getSubStatRows(slotId)
            .map((row) => String((row && row[0]) || '').trim())
            .filter(Boolean);

        if (!candidates.length) return;

        const blockedByMain = getMainBlockedSubOptions(slotId);
        const used = new Set(
            slotState.subs
                .map((row) => toCanonicalStatKey(row.option))
                .filter(Boolean)
        );

        slotState.subs.forEach((row) => {
            const selected = String(row.option || '').trim();
            if (selected) return;

            const next = candidates.find((option) => {
                const canonicalOption = toCanonicalStatKey(option);
                return canonicalOption && !blockedByMain.has(canonicalOption) && !used.has(canonicalOption);
            });
            if (!next) return;

            row.option = next;
            if (!String(row.value || '').trim()) {
                row.value = getSubStatMaxValue(slotId, next);
            }
            used.add(toCanonicalStatKey(next));
        });
    }

    function ensureSlotSubValueDefaults(slotId) {
        const slotState = state.slots[slotId];
        if (!slotState) return;
        slotState.subs.forEach((row) => {
            if (!row.option) return;
            if (String(row.value || '').trim()) return;
            row.value = getSubStatMaxValue(slotId, row.option);
        });
    }

    function ensureSlotDefaults() {
        SLOT_CONFIG.forEach((slot) => {
            const slotState = state.slots[slot.id];
            const mainRows = getMainStatRows(slot.id);
            if (slot.id !== 'uni' && !mainRows.some((row) => row[0] === slotState.mainOption)) {
                slotState.mainOption = '';
            }
            if (slot.id !== 'uni' && !slotState.mainOption && mainRows.length > 0) {
                slotState.mainOption = mainRows[0][0];
            }
            enforceSubOptionRestrictions(slot.id);
            applyDefaultSubOptions(slot.id);
            ensureSlotSubValueDefaults(slot.id);
        });
    }

    async function applyAutoRevelation(characterName) {
        const name = String(characterName || '').trim();
        if (!name) {
            state.mainRev = '';
            state.subRev = '';
            return;
        }

        await loadCharacterSetting(name);

        const setting = (window.characterSetting || {})[name] || {};
        const cData = (window.characterData || {})[name] || {};

        const mainOptions = getMainRevelationOptions();
        const mainPrefs = normalizePrefList(setting.main_revelation || cData.main_revelation);
        let mainRev = mainPrefs.find((item) => mainOptions.includes(item)) || '';
        if (!mainRev && mainOptions.length > 0) {
            mainRev = mainOptions[0];
        }

        const subOptions = getSubRevelationOptions(mainRev);
        const subPrefs = normalizePrefList(setting.sub_revelation || cData.sub_revelation);
        let subRev = subPrefs.find((item) => subOptions.includes(item)) || '';
        if (!subRev && subOptions.length > 0) {
            subRev = subOptions[0];
        }

        state.mainRev = mainRev;
        state.subRev = subRev;
    }

    function closeOpenDropdown() {
        if (openDropdownRoot) {
            openDropdownRoot.classList.remove('open');
            openDropdownRoot = null;
        }
    }

    function setCharacterPanelOpen(isOpen) {
        if (!dom.characterPanel || !dom.characterPill) return;
        const nextOpen = !state.selectedCharacter ? true : !!isOpen;
        dom.characterPanel.hidden = !nextOpen;
        if (dom.editorPanel) {
            dom.editorPanel.hidden = nextOpen;
        }
        if (dom.characterField) {
            dom.characterField.classList.toggle('open', nextOpen);
        }
        dom.characterPill.classList.toggle('is-open', nextOpen);
        if (nextOpen && dom.characterSearchInput) {
            window.setTimeout(() => {
                dom.characterSearchInput.focus();
            }, 0);
        }
    }

    function toggleCharacterPanel() {
        if (!dom.characterPanel) return;
        closeOpenDropdown();
        setCharacterPanelOpen(dom.characterPanel.hidden);
    }

    function bindGlobalEvents() {
        if (globalEventsBound) return;
        globalEventsBound = true;

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.rs-custom-dropdown')) {
                closeOpenDropdown();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            closeOpenDropdown();
            setCharacterPanelOpen(false);
        });
    }

    function buildCustomDropdown(config) {
        const host = config.host;
        if (!host) return;

        host.innerHTML = '';

        const items = Array.isArray(config.items) ? config.items : [];
        const includeEmpty = !!config.includeEmptyOption;
        const disabled = !!config.disabled;
        const currentValue = String(config.value || '');
        const placeholder = config.placeholder || '';

        const allItems = includeEmpty
            ? [{ value: '', label: placeholder, icon: '' }, ...items]
            : items;

        const root = document.createElement('div');
        root.className = 'rs-custom-dropdown';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'rs-dropdown-button';
        if (disabled) {
            button.disabled = true;
            button.classList.add('is-disabled');
        }

        const icon = document.createElement('img');
        icon.className = 'rs-dropdown-icon';
        icon.alt = '';
        icon.hidden = true;

        const text = document.createElement('span');
        text.className = 'rs-dropdown-text';

        const arrow = document.createElement('span');
        arrow.className = 'rs-dropdown-arrow';
        arrow.setAttribute('aria-hidden', 'true');

        button.appendChild(icon);
        button.appendChild(text);
        button.appendChild(arrow);

        const menu = document.createElement('div');
        menu.className = 'rs-dropdown-menu';

        function setButtonView(value) {
            const selected = allItems.find((item) => String(item.value) === String(value));
            const isPlaceholder = !selected || String(selected.value) === '';
            const label = selected ? selected.label : placeholder;
            const iconPath = selected ? (selected.icon || '') : '';

            button.classList.toggle('is-placeholder', isPlaceholder);
            text.textContent = label || placeholder;

            if (iconPath) {
                icon.src = iconPath;
                icon.hidden = false;
                icon.onerror = function onIconError() {
                    const fallback = derivePngFromWebp(this.src);
                    if (fallback && this.src !== fallback) {
                        this.src = fallback;
                        return;
                    }
                    this.hidden = true;
                };
            } else {
                icon.removeAttribute('src');
                icon.hidden = true;
            }
        }

        allItems.forEach((item) => {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = 'rs-dropdown-option';
            const optionDisabled = !!item.disabled;
            if (String(item.value) === currentValue) {
                option.classList.add('active');
            }
            if (optionDisabled) {
                option.classList.add('is-disabled');
                option.disabled = true;
                option.setAttribute('aria-disabled', 'true');
            }

            const optionIcon = document.createElement('img');
            optionIcon.className = 'rs-dropdown-icon';
            optionIcon.alt = '';
            if (item.icon) {
                optionIcon.src = item.icon;
                optionIcon.hidden = false;
                optionIcon.onerror = function onIconError() {
                    const fallback = derivePngFromWebp(this.src);
                    if (fallback && this.src !== fallback) {
                        this.src = fallback;
                        return;
                    }
                    this.hidden = true;
                };
            } else {
                optionIcon.hidden = true;
            }

            const optionLabel = document.createElement('span');
            optionLabel.className = 'rs-dropdown-option-label';
            optionLabel.textContent = item.label || '';

            option.appendChild(optionIcon);
            option.appendChild(optionLabel);

            const itemAction = item && typeof item.action === 'object' ? item.action : null;
            if (itemAction && itemAction.type && !optionDisabled) {
                option.classList.add('has-action');

                const actionButton = document.createElement('span');
                actionButton.className = 'rs-dropdown-option-action';
                actionButton.setAttribute('role', 'button');
                actionButton.setAttribute('tabindex', '0');
                actionButton.setAttribute('aria-label', String(itemAction.label || ''));
                actionButton.title = String(itemAction.label || '');
                actionButton.textContent = String(itemAction.iconText || '✎');

                const triggerAction = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (typeof config.onItemAction === 'function') {
                        config.onItemAction(String(item.value || ''), String(itemAction.type || ''), item);
                    }
                };

                actionButton.addEventListener('click', triggerAction);
                actionButton.addEventListener('keydown', (event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    triggerAction(event);
                });

                option.appendChild(actionButton);
            }

            option.addEventListener('click', (event) => {
                event.preventDefault();
                if (optionDisabled) return;
                if (typeof config.onChange === 'function') {
                    config.onChange(String(item.value || ''));
                }
                closeOpenDropdown();
            });

            menu.appendChild(option);
        });

        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (disabled) return;

            if (openDropdownRoot && openDropdownRoot !== root) {
                openDropdownRoot.classList.remove('open');
            }

            const nextOpen = !root.classList.contains('open');
            root.classList.toggle('open', nextOpen);
            openDropdownRoot = nextOpen ? root : null;
        });

        setButtonView(currentValue);

        root.appendChild(button);
        root.appendChild(menu);
        host.appendChild(root);
    }

    function getCharacterMeta(name) {
        return (window.characterData || {})[name] || {};
    }

    function translateGameTerm(value) {
        const text = String(value || '').trim();
        if (!text) return '';
        if (window.I18nService && typeof window.I18nService.translateTerm === 'function') {
            const translated = window.I18nService.translateTerm(text);
            return translated || text;
        }
        return text;
    }

    function getCharacterElementIconPath(element) {
        const key = String(element || '').trim();
        if (!key) return '';
        return `${state.baseUrl}/assets/img/character-cards/${encodeURIComponent(`속성_${key}`)}.png`;
    }

    function getCharacterPositionIconPath(position) {
        const key = String(position || '').trim();
        if (!key) return '';
        return `${state.baseUrl}/assets/img/character-cards/${encodeURIComponent(`직업_${key}`)}.png`;
    }

    function getCharacterStarIconPath(rarity) {
        const count = Number(rarity || 0);
        if (!count) return '';
        const starType = count === 4 ? 'star4.png' : 'star5.png';
        return `${state.baseUrl}/assets/img/character-detail/${starType}`;
    }

    function buildSelectedCharacterNameHtml(characterLabel, meta) {
        const safeName = escapeHtml(characterLabel || '');
        const element = String((meta && meta.element) || '').trim();
        const position = String((meta && meta.position) || '').trim();
        const rarity = Number((meta && meta.rarity) || 0);

        const elementIcon = getCharacterElementIconPath(element);
        const positionIcon = getCharacterPositionIconPath(position);
        const starIcon = getCharacterStarIconPath(rarity);
        const translatedElement = translateGameTerm(element);
        const translatedPosition = translateGameTerm(position);
        const safeStarLabel = escapeHtml(t('common_star', 'Star'));

        const metaItems = [];
        if (positionIcon) {
            metaItems.push(`
                <img
                    class="rs-character-meta-icon rs-character-meta-position"
                    src="${escapeHtml(positionIcon)}"
                    alt="${escapeHtml(translatedPosition || position)}"
                    title="${escapeHtml(translatedPosition || position)}"
                >
            `);
        }
        if (elementIcon) {
            metaItems.push(`
                <img
                    class="rs-character-meta-icon rs-character-meta-element"
                    src="${escapeHtml(elementIcon)}"
                    alt="${escapeHtml(translatedElement || element)}"
                    title="${escapeHtml(translatedElement || element)}"
                >
            `);
        }
        if (starIcon && rarity > 0) {
            const stars = Array.from({ length: rarity }, () => `
                <img class="rs-character-meta-star" src="${escapeHtml(starIcon)}" alt="${safeStarLabel}">
            `).join('');
            metaItems.push(`<span class="rs-character-meta-stars" title="${escapeHtml(`${rarity}${t('common_star', 'Star')}`)}">${stars}</span>`);
        }

        return `
            <span class="rs-selected-character-label">${safeName}</span>
            <span class="rs-selected-character-meta">${metaItems.join('')}</span>
        `;
    }

    function getAvailableCharacterFilters() {
        const elements = new Set();
        const positions = new Set();
        state.characterList.forEach((name) => {
            const meta = getCharacterMeta(name);
            if (meta.element) elements.add(meta.element);
            if (meta.position) positions.add(meta.position);
        });

        const sortedElements = Array.from(elements).sort((a, b) => {
            const ai = ELEMENT_ORDER.indexOf(a);
            const bi = ELEMENT_ORDER.indexOf(b);
            if (ai === -1 && bi === -1) return String(a).localeCompare(String(b), 'ko');
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
        });

        const sortedPositions = Array.from(positions).sort((a, b) => {
            const ai = POSITION_ORDER.indexOf(a);
            const bi = POSITION_ORDER.indexOf(b);
            if (ai === -1 && bi === -1) return String(a).localeCompare(String(b), 'ko');
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
        });

        return { elements: sortedElements, positions: sortedPositions };
    }

    function updateCharacterFilterResetState() {
        if (!dom.characterFilterReset) return;
        const hasFilter = state.characterFilters.query.length > 0
            || state.characterFilters.elements.size > 0
            || state.characterFilters.positions.size > 0;
        dom.characterFilterReset.classList.toggle('active', hasFilter);
    }

    async function handleCharacterSpoilerToggleChanged() {
        await loadCharacterNames();
        renderCharacterFilterUI();
        renderCharacterList();
    }

    function renderCharacterFilterUI() {
        const available = getAvailableCharacterFilters();

        if (dom.elementFilters) {
            dom.elementFilters.innerHTML = available.elements.map((value) => `
                <label class="rs-filter-chip">
                    <input type="checkbox" data-kind="element" value="${escapeHtml(value)}" ${state.characterFilters.elements.has(value) ? 'checked' : ''}>
                    <img src="${escapeHtml(state.baseUrl)}/assets/img/character-cards/${encodeURIComponent(`속성_${value}`)}.png" alt="${escapeHtml(value)}">
                </label>
            `).join('');
        }

        if (dom.positionFilters) {
            const showSpoilerToggle = state.lang !== 'kr';
            const spoilerToggleHtml = showSpoilerToggle
                ? `
                    <div class="rs-spoiler-toggle">
                        <label class="rs-spoiler-toggle-label">
                            <input type="checkbox" id="rsCharacterSpoilerToggle" class="rs-spoiler-toggle-checkbox">
                            <span class="rs-spoiler-toggle-text">${escapeHtml(t('show_spoilers_label', 'Show Spoilers'))}</span>
                        </label>
                    </div>
                `
                : '';

            const resetButtonHtml = `
                <button id="rsCharacterFilterReset" type="button" class="rs-filter-reset" title="${escapeHtml(t('label_reset_filter', '필터 초기화'))}" aria-label="${escapeHtml(t('label_reset_filter', '필터 초기화'))}">
                    &#10227;
                </button>
            `;

            const chipHtml = available.positions.map((value) => `
                <label class="rs-filter-chip">
                    <input type="checkbox" data-kind="position" value="${escapeHtml(value)}" ${state.characterFilters.positions.has(value) ? 'checked' : ''}>
                    <img src="${escapeHtml(state.baseUrl)}/assets/img/character-cards/${encodeURIComponent(`직업_${value}`)}.png" alt="${escapeHtml(value)}">
                </label>
            `).join('');

            dom.positionFilters.innerHTML = `${chipHtml}${resetButtonHtml}${spoilerToggleHtml}`;
            dom.characterFilterReset = document.getElementById('rsCharacterFilterReset');
        }

        document.querySelectorAll('#rsCharacterPanel input[type="checkbox"][data-kind]').forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                const kind = checkbox.getAttribute('data-kind');
                const val = checkbox.value;
                const targetSet = kind === 'element'
                    ? state.characterFilters.elements
                    : state.characterFilters.positions;
                if (checkbox.checked) targetSet.add(val);
                else targetSet.delete(val);
                updateCharacterFilterResetState();
                renderCharacterList();
            });
        });

        if (dom.characterFilterReset) {
            dom.characterFilterReset.addEventListener('click', () => {
                state.characterFilters.query = '';
                state.characterFilters.elements.clear();
                state.characterFilters.positions.clear();
                if (dom.characterSearchInput) {
                    dom.characterSearchInput.value = '';
                }
                updateCharacterFilterResetState();
                renderCharacterFilterUI();
                renderCharacterList();
            });
        }

        const spoilerToggle = document.getElementById('rsCharacterSpoilerToggle');
        if (disposeCharacterSpoilerBinding) {
            try { disposeCharacterSpoilerBinding(); } catch (_) { }
            disposeCharacterSpoilerBinding = null;
        }
        if (spoilerToggle) {
            if (window.SpoilerState && typeof window.SpoilerState.bindCheckbox === 'function') {
                disposeCharacterSpoilerBinding = window.SpoilerState.bindCheckbox({
                    checkbox: spoilerToggle,
                    lang: state.lang,
                    source: 'revelation-setting-character-panel',
                    onChange: () => {
                        handleCharacterSpoilerToggleChanged();
                    }
                });
            } else {
                let savedState = false;
                try {
                    savedState = window.localStorage && window.localStorage.getItem('spoilerToggle') === 'true';
                } catch (_) { }
                spoilerToggle.checked = savedState;
                spoilerToggle.onchange = () => {
                    const enabled = !!spoilerToggle.checked;
                    try {
                        if (window.localStorage) {
                            window.localStorage.setItem('spoilerToggle', enabled ? 'true' : 'false');
                        }
                    } catch (_) { }
                    handleCharacterSpoilerToggleChanged();
                };
            }
        }

        updateCharacterFilterResetState();
    }

    function getFilteredCharacters() {
        const query = String(state.characterFilters.query || '').toLowerCase();
        const activeElements = state.characterFilters.elements;
        const activePositions = state.characterFilters.positions;

        return state.characterList.filter((name) => {
            const meta = getCharacterMeta(name);
            if (activeElements.size > 0 && !activeElements.has(meta.element)) return false;
            if (activePositions.size > 0 && !activePositions.has(meta.position)) return false;
            if (!query) return true;

            const searchText = [
                name,
                meta.name || '',
                meta.name_en || '',
                meta.name_jp || '',
                meta.codename || ''
            ].join(' ').toLowerCase();
            return searchText.includes(query);
        });
    }

    function renderCharacterList() {
        if (!dom.characterList) return;
        const names = getFilteredCharacters();
        dom.characterList.innerHTML = '';
        names.forEach((name) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'rs-character-item';
            if (name === state.selectedCharacter) {
                button.classList.add('active');
            }

            const img = document.createElement('img');
            img.src = getCharacterImagePath(name);
            img.alt = getCharacterLabel(name);
            img.onerror = function onCharacterItemIconError() {
                this.hidden = true;
            };

            const label = document.createElement('span');
            label.textContent = getCharacterLabel(name);

            button.appendChild(img);
            button.appendChild(label);
            button.addEventListener('click', async () => {
                await handleCharacterSelection(name);
                setCharacterPanelOpen(false);
            });

            dom.characterList.appendChild(button);
        });
    }

    function renderCharacterSelector() {
        if (!dom.characterList) return;

        if (state.selectedCharacter) {
            const characterLabel = getCharacterLabel(state.selectedCharacter);
            const characterMeta = getCharacterMeta(state.selectedCharacter);
            if (dom.selectedCharacterName) {
                dom.selectedCharacterName.innerHTML = buildSelectedCharacterNameHtml(characterLabel, characterMeta);
                dom.selectedCharacterName.querySelectorAll('img').forEach((img) => {
                    img.onerror = function onCharacterMetaIconError() {
                        this.hidden = true;
                    };
                });
            }
            if (dom.characterPill) {
                dom.characterPill.setAttribute('aria-label', characterLabel);
            }
            if (dom.characterPillIcon) {
                dom.characterPillIcon.src = getCharacterImagePath(state.selectedCharacter);
                dom.characterPillIcon.hidden = false;
                dom.characterPillIcon.onerror = function onCharacterIconError() {
                    this.hidden = true;
                };
            }
            if (dom.characterPillEmpty) {
                dom.characterPillEmpty.hidden = true;
            }
        } else {
            const fallback = t('placeholder_select_character', 'Select character');
            if (dom.selectedCharacterName) {
                dom.selectedCharacterName.textContent = fallback;
            }
            if (dom.characterPill) {
                dom.characterPill.setAttribute('aria-label', fallback);
            }
            if (dom.characterPillIcon) {
                dom.characterPillIcon.removeAttribute('src');
                dom.characterPillIcon.hidden = true;
            }
            if (dom.characterPillEmpty) {
                dom.characterPillEmpty.hidden = false;
            }
        }

        if (dom.characterSearchInput) {
            dom.characterSearchInput.value = state.characterFilters.query;
        }

        renderCharacterFilterUI();
        renderCharacterList();
    }

    function renderTopSelectorIcons() {
        if (dom.mainRevSlotIcon) {
            dom.mainRevSlotIcon.src = getSlotIconPath('uni');
            dom.mainRevSlotIcon.hidden = false;
            dom.mainRevSlotIcon.onerror = function onMainSlotIconError() {
                this.hidden = true;
            };
        }

        if (dom.subRevSlotIcons) {
            dom.subRevSlotIcons.innerHTML = '';
            getSubSlotIds().forEach((slotId) => {
                const img = document.createElement('img');
                img.src = getSlotIconPath(slotId);
                img.alt = t(`slot_${slotId}`, slotId.toUpperCase());
                img.onerror = function onSubSlotIconError() {
                    this.hidden = true;
                };
                dom.subRevSlotIcons.appendChild(img);
            });
        }
    }

    function sanitizePresetName(value) {
        const trimmed = String(value || '').replace(/\s+/g, ' ').trim();
        if (!trimmed) return '';
        return trimmed.slice(0, PRESET_NAME_MAX_LENGTH);
    }

    function getDefaultPresetLabel(presetId) {
        const id = String(presetId || '').trim();
        if (!id || id === DEFAULT_PRESET_ID) {
            return t('preset_default', 'Default');
        }

        const numberedMatch = id.match(/^preset-(\d+)$/);
        if (numberedMatch) {
            const n = Number.parseInt(numberedMatch[1], 10);
            const template = t('preset_numbered', 'Preset {n}');
            return template.replace('{n}', String(Number.isFinite(n) ? n : numberedMatch[1]));
        }

        return id;
    }

    function getPresetLabel(presetId) {
        const id = String(presetId || '').trim();
        if (!id) return getDefaultPresetLabel(id);
        const customName = sanitizePresetName(state.presetNameMap[id]);
        return customName || getDefaultPresetLabel(id);
    }

    function deletePreset(targetPresetId) {
        const id = String(targetPresetId || '').trim();
        if (!id || !state.presetMap[id]) return false;

        ensurePresetState();
        syncActivePresetFromEditorState();

        if (state.presetOrder.length <= 1) {
            showToast(t('msg_preset_delete_min', 'At least one preset must remain.'), 'error');
            return false;
        }

        const deletedIndex = state.presetOrder.indexOf(id);

        state.presetOrder = state.presetOrder.filter((presetId) => presetId !== id);
        delete state.presetMap[id];
        delete state.presetNameMap[id];

        if (!state.presetOrder.length) {
            state.presetOrder = [DEFAULT_PRESET_ID];
            state.presetMap[DEFAULT_PRESET_ID] = sanitizePackedBuild(serializeCurrentCharacterSetting());
            delete state.presetNameMap[DEFAULT_PRESET_ID];
            state.activePresetId = DEFAULT_PRESET_ID;
        } else if (state.activePresetId === id || !state.presetMap[state.activePresetId]) {
            const fallbackIndex = Math.min(
                Math.max(deletedIndex, 0),
                state.presetOrder.length - 1
            );
            state.activePresetId = state.presetOrder[fallbackIndex] || state.presetOrder[0];
        }

        const activeBuild = state.presetMap[state.activePresetId]
            || state.presetMap[state.presetOrder[0]]
            || createEmptyPackedBuild();
        applyPackedBuildToEditorState(activeBuild);
        persistSelectedCharacterSetting();

        renderPresetDropdown();
        renderMainRevelationDropdown();
        renderSubRevelationDropdown();
        renderSlotCards();
        renderPreview();
        return true;
    }

    function openPresetRenameModal(presetId) {
        const targetPresetId = String(presetId || '').trim();
        if (!targetPresetId || !state.presetMap[targetPresetId]) return;

        closeOpenDropdown();

        const overlay = document.createElement('div');
        overlay.className = 'rs-preset-rename-modal-overlay';
        overlay.innerHTML = `
            <div class="rs-preset-rename-modal" role="dialog" aria-modal="true" aria-labelledby="rsPresetRenameTitle">
                <h3 id="rsPresetRenameTitle" class="rs-preset-rename-modal-title"></h3>
                <input id="rsPresetRenameInput" type="text" class="rs-preset-rename-modal-input" maxlength="${PRESET_NAME_MAX_LENGTH}">
                <div class="rs-preset-rename-modal-actions">
                    <button type="button" class="rs-preset-rename-modal-btn rs-preset-rename-modal-btn-delete"></button>
                    <button type="button" class="rs-preset-rename-modal-btn rs-preset-rename-modal-btn-cancel"></button>
                    <button type="button" class="rs-preset-rename-modal-btn rs-preset-rename-modal-btn-save"></button>
                </div>
            </div>
        `;

        const titleEl = overlay.querySelector('#rsPresetRenameTitle');
        const inputEl = overlay.querySelector('#rsPresetRenameInput');
        const deleteBtn = overlay.querySelector('.rs-preset-rename-modal-btn-delete');
        const cancelBtn = overlay.querySelector('.rs-preset-rename-modal-btn-cancel');
        const saveBtn = overlay.querySelector('.rs-preset-rename-modal-btn-save');
        if (!titleEl || !inputEl || !deleteBtn || !cancelBtn || !saveBtn) return;

        const closeDialog = () => {
            if (activePresetRenameDialog !== overlay) return;
            activePresetRenameDialog = null;
            overlay.remove();
        };

        const submitRename = () => {
            const nextName = sanitizePresetName(inputEl.value);
            if (!nextName) {
                showToast(t('msg_preset_name_empty', 'Preset name cannot be empty.'), 'error');
                inputEl.focus();
                return;
            }

            const baseLabel = getDefaultPresetLabel(targetPresetId);
            if (nextName === baseLabel) {
                delete state.presetNameMap[targetPresetId];
            } else {
                state.presetNameMap[targetPresetId] = nextName;
            }

            persistSelectedCharacterSetting();
            renderPresetDropdown();
            closeDialog();
        };

        const canDeletePreset = state.presetOrder.length > 1;
        const submitDelete = () => {
            if (!canDeletePreset) {
                showToast(t('msg_preset_delete_min', 'At least one preset must remain.'), 'error');
                return;
            }
            const confirmTemplate = t('msg_preset_delete_confirm', 'Are you sure you want to delete "{name}" preset?');
            const confirmMessage = String(confirmTemplate).replace('{name}', getPresetLabel(targetPresetId));
            if (!window.confirm(confirmMessage)) {
                return;
            }
            closeDialog();
            deletePreset(targetPresetId);
        };

        titleEl.textContent = t('modal_preset_rename_title', 'Rename Preset');
        inputEl.placeholder = t('placeholder_preset_name', 'Enter preset name');
        inputEl.value = getPresetLabel(targetPresetId);
        deleteBtn.textContent = t('button_preset_delete', 'Delete');
        deleteBtn.disabled = !canDeletePreset;
        cancelBtn.textContent = t('button_cancel', 'Cancel');
        saveBtn.textContent = t('button_save', 'Save');

        deleteBtn.addEventListener('click', submitDelete);
        cancelBtn.addEventListener('click', closeDialog);
        saveBtn.addEventListener('click', submitRename);

        inputEl.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                submitRename();
                return;
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                closeDialog();
            }
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeDialog();
            }
        });
        overlay.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                closeDialog();
            }
        });

        if (activePresetRenameDialog) {
            activePresetRenameDialog.remove();
            activePresetRenameDialog = null;
        }

        document.body.appendChild(overlay);
        activePresetRenameDialog = overlay;

        window.setTimeout(() => {
            inputEl.focus();
            inputEl.select();
        }, 0);
    }

    function getNextPresetId() {
        let n = 2;
        while (n < 1000) {
            const nextId = `${PRESET_ID_PREFIX}${n}`;
            if (!state.presetMap[nextId]) {
                return nextId;
            }
            n += 1;
        }
        return `${PRESET_ID_PREFIX}${Date.now()}`;
    }

    function handlePresetSelection(presetId) {
        const nextId = String(presetId || '').trim();
        if (!nextId || !state.presetMap[nextId]) return;

        syncActivePresetFromEditorState();
        state.activePresetId = nextId;
        applyPackedBuildToEditorState(state.presetMap[nextId]);
        persistSelectedCharacterSetting();

        renderPresetDropdown();
        renderMainRevelationDropdown();
        renderSubRevelationDropdown();
        renderSlotCards();
        renderPreview();
    }

    function handleAddPreset() {
        if (!state.selectedCharacter) return;

        ensurePresetState();

        if (state.presetOrder.length >= PRESET_MAX_COUNT) {
            showToast(t('msg_preset_limit_reached', 'You can add up to 20 presets per character.'), 'error');
            return;
        }

        syncActivePresetFromEditorState();

        const nextId = getNextPresetId();
        const sourceId = state.presetMap[state.activePresetId] ? state.activePresetId : DEFAULT_PRESET_ID;
        const sourceBuild = state.presetMap[sourceId] || serializeCurrentCharacterSetting();

        state.presetMap[nextId] = clonePackedBuild(sourceBuild);
        state.presetOrder.push(nextId);
        delete state.presetNameMap[nextId];
        state.activePresetId = nextId;

        applyPackedBuildToEditorState(state.presetMap[nextId]);
        persistSelectedCharacterSetting();

        renderPresetDropdown();
        renderMainRevelationDropdown();
        renderSubRevelationDropdown();
        renderSlotCards();
        renderPreview();
    }

    function renderPresetDropdown() {
        if (!dom.presetHost) return;

        ensurePresetState();

        const renameLabel = t('button_preset_rename', 'Rename');
        const items = state.presetOrder.map((presetId) => ({
            value: presetId,
            label: getPresetLabel(presetId),
            icon: '',
            action: {
                type: 'rename',
                label: renameLabel,
                iconText: '✎'
            }
        }));

        items.push({
            value: PRESET_ADD_ACTION,
            label: t('preset_add', '+ Add Preset'),
            icon: ''
        });

        buildCustomDropdown({
            host: dom.presetHost,
            items,
            value: state.activePresetId,
            placeholder: t('preset_default', 'Default'),
            includeEmptyOption: false,
            disabled: !state.selectedCharacter,
            onChange: (value) => {
                if (value === PRESET_ADD_ACTION) {
                    handleAddPreset();
                    return;
                }
                handlePresetSelection(value);
            },
            onItemAction: (value, actionType) => {
                if (actionType === 'rename' && value && value !== PRESET_ADD_ACTION) {
                    openPresetRenameModal(value);
                }
            }
        });
    }

    function renderMainRevelationDropdown() {
        const options = getMainRevelationOptions().map((value) => ({
            value,
            label: toRevelationLabel(value),
            icon: getRevelationImagePath(value)
        }));

        buildCustomDropdown({
            host: dom.mainRevHost,
            items: options,
            value: state.mainRev,
            placeholder: t('placeholder_select_main_revelation', '주 계시를 선택하세요'),
            includeEmptyOption: false,
            disabled: !state.selectedCharacter || options.length === 0,
            onChange: (value) => {
                state.mainRev = value;
                const subOptions = getSubRevelationOptions(state.mainRev);
                if (!subOptions.includes(state.subRev)) {
                    state.subRev = subOptions[0] || '';
                }
                persistSelectedCharacterSetting();
                renderMainRevelationDropdown();
                renderSubRevelationDropdown();
                renderSlotCards();
                renderPreview();
            }
        });
        renderSideSetEffects();
    }

    function renderSubRevelationDropdown() {
        const options = getSubRevelationOptions(state.mainRev).map((value) => ({
            value,
            label: toRevelationLabel(value),
            icon: getRevelationImagePath(value)
        }));

        buildCustomDropdown({
            host: dom.subRevHost,
            items: options,
            value: state.subRev,
            placeholder: t('placeholder_select_sub_revelation', '서브 계시를 선택하세요'),
            includeEmptyOption: false,
            disabled: !state.selectedCharacter || !state.mainRev || options.length === 0,
            onChange: (value) => {
                state.subRev = value;
                persistSelectedCharacterSetting();
                renderSubRevelationDropdown();
                renderSlotCards();
                renderPreview();
            }
        });
        renderSideSetEffects();
    }

    function renderSideSetEffects() {
        if (!dom.subRevEffect) return;
        const subSetEffects = getSubSetEffects(state.subRev);
        const comboSetEffect = getMainSubSetEffect(state.mainRev, state.subRev);
        const effectNoneLabel = t('preview_effect_none', '-');

        dom.subRevEffect.innerHTML = `
            <div class="rs-set-effect-line">
                <strong>${escapeHtml(t('preview_set2_short', '\u0032\uC138\uD2B8'))}</strong>
                <span>${renderEffectText(subSetEffects.set2, effectNoneLabel)}</span>
            </div>
            <div class="rs-set-effect-line">
                <strong>${escapeHtml(t('preview_set4_short', '\u0034\uC138\uD2B8'))}</strong>
                <span>${renderEffectText(subSetEffects.set4, effectNoneLabel)}</span>
            </div>
            <div class="rs-set-effect-line">
                <strong>${escapeHtml(t('preview_combo_set_short', '\uC138\uD2B8 \uD6A8\uACFC'))}</strong>
                <span>${renderEffectText(comboSetEffect, effectNoneLabel)}</span>
            </div>
        `;
    }

    function parseUpgradeValue(raw) {
        const num = Number.parseInt(String(raw || '').replace(/[^\d]/g, ''), 10);
        if (!Number.isFinite(num) || num < 0) return 0;
        return Math.min(5, num);
    }

    function normalizeUpgradeInput(raw) {
        const text = String(raw || '').trim();
        if (!text) return '';
        return String(parseUpgradeValue(text));
    }

    function normalizePercentValue(optionName, rawValue) {
        const valueText = String(rawValue || '').trim();
        if (!valueText) return '';

        const canonical = toCanonicalStatKey(optionName);
        if (!PERCENT_STAT_CANONICAL.has(canonical)) {
            return valueText;
        }
        if (valueText.indexOf('%') !== -1) {
            return valueText;
        }

        const numeric = valueText.replace(/,/g, '').trim();
        if (!/^-?\d*\.?\d+$/.test(numeric)) {
            return valueText;
        }
        return `${valueText}%`;
    }

    function getStorageKeyV1(characterName) {
        return `${STORAGE_PREFIX_V1}${encodeURIComponent(String(characterName || '').trim())}`;
    }

    function getStorageKeyV2(characterName) {
        return `${STORAGE_PREFIX_V2}${encodeURIComponent(String(characterName || '').trim())}`;
    }

    function encodeStoragePayload(payload) {
        try {
            return window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
        } catch (error) {
            console.warn('[revelation-setting] encode storage payload failed:', error);
            return '';
        }
    }

    function decodeStoragePayload(encoded) {
        try {
            const json = decodeURIComponent(escape(window.atob(String(encoded || ''))));
            return JSON.parse(json);
        } catch (error) {
            return null;
        }
    }

    function createEmptyPackedBuild() {
        return {
            m: '',
            s: '',
            a: SLOT_CONFIG.map(() => [
                '',
                Array.from({ length: 4 }, () => ['', '', ''])
            ])
        };
    }

    function sanitizePackedBuild(payload) {
        const safe = createEmptyPackedBuild();
        if (!payload || typeof payload !== 'object') return safe;

        safe.m = String(payload.m || '').trim();
        safe.s = String(payload.s || '').trim();

        const slotPayloads = Array.isArray(payload.a) ? payload.a : [];
        SLOT_CONFIG.forEach((slot, slotIndex) => {
            const packed = slotPayloads[slotIndex];
            if (!Array.isArray(packed)) return;

            safe.a[slotIndex][0] = String(packed[0] || '').trim();
            const packedSubs = Array.isArray(packed[1]) ? packed[1] : [];
            for (let i = 0; i < 4; i += 1) {
                const subPacked = packedSubs[i];
                if (!Array.isArray(subPacked)) continue;
                safe.a[slotIndex][1][i] = [
                    String(subPacked[0] || '').trim(),
                    String(subPacked[1] || '').trim(),
                    normalizeUpgradeInput(subPacked[2] || '')
                ];
            }
        });

        return safe;
    }

    function clonePackedBuild(payload) {
        return sanitizePackedBuild(payload);
    }

    function createDefaultPresetStore(initialBuild) {
        return {
            v: 2,
            active: DEFAULT_PRESET_ID,
            order: [DEFAULT_PRESET_ID],
            map: {
                [DEFAULT_PRESET_ID]: sanitizePackedBuild(initialBuild || createEmptyPackedBuild())
            },
            names: {}
        };
    }

    function normalizePresetStorePayload(payload) {
        if (!payload || typeof payload !== 'object') return null;
        const hasPresetShape = payload.v === 2
            || Array.isArray(payload.order)
            || (payload.map && typeof payload.map === 'object');
        if (!hasPresetShape) return null;

        const rawMap = (payload.map && typeof payload.map === 'object') ? payload.map : {};
        const map = {};
        Object.keys(rawMap).forEach((rawId) => {
            const id = String(rawId || '').trim();
            if (!id || id === PRESET_ADD_ACTION || map[id]) return;
            if (Object.keys(map).length >= PRESET_MAX_COUNT) return;
            map[id] = sanitizePackedBuild(rawMap[rawId]);
        });

        if (!map[DEFAULT_PRESET_ID]) {
            const firstId = Object.keys(map)[0] || '';
            map[DEFAULT_PRESET_ID] = firstId
                ? clonePackedBuild(map[firstId])
                : createEmptyPackedBuild();
        }

        const order = [DEFAULT_PRESET_ID];
        const rawOrder = Array.isArray(payload.order) ? payload.order : [];
        rawOrder.forEach((rawId) => {
            const id = String(rawId || '').trim();
            if (!id || id === DEFAULT_PRESET_ID || id === PRESET_ADD_ACTION) return;
            if (!map[id] || order.includes(id)) return;
            if (order.length >= PRESET_MAX_COUNT) return;
            order.push(id);
        });

        Object.keys(map).forEach((id) => {
            if (order.length >= PRESET_MAX_COUNT) return;
            if (!order.includes(id)) {
                order.push(id);
            }
        });

        const trimmedMap = {};
        order.forEach((id) => {
            trimmedMap[id] = clonePackedBuild(map[id]);
        });

        const rawNames = (payload.names && typeof payload.names === 'object') ? payload.names : {};
        const names = {};
        order.forEach((id) => {
            const sanitizedName = sanitizePresetName(rawNames[id]);
            if (sanitizedName) {
                names[id] = sanitizedName;
            }
        });

        const activeCandidate = String(payload.active || '').trim();
        const active = order.includes(activeCandidate) ? activeCandidate : DEFAULT_PRESET_ID;

        return {
            v: 2,
            active,
            order,
            map: trimmedMap,
            names
        };
    }

    function applyPresetStoreToState(storePayload) {
        const normalized = normalizePresetStorePayload(storePayload) || createDefaultPresetStore();
        state.presetOrder = normalized.order.slice();
        state.presetMap = {};
        state.presetNameMap = {};
        normalized.order.forEach((presetId) => {
            state.presetMap[presetId] = clonePackedBuild(normalized.map[presetId]);
            const customName = sanitizePresetName((normalized.names || {})[presetId]);
            if (customName) {
                state.presetNameMap[presetId] = customName;
            }
        });
        state.activePresetId = normalized.active;
        if (!state.presetMap[state.activePresetId]) {
            state.activePresetId = DEFAULT_PRESET_ID;
        }
        if (!state.presetMap[state.activePresetId]) {
            state.activePresetId = state.presetOrder[0] || DEFAULT_PRESET_ID;
        }
    }

    function ensurePresetState() {
        const normalized = normalizePresetStorePayload({
            v: 2,
            active: state.activePresetId,
            order: state.presetOrder,
            map: state.presetMap,
            names: state.presetNameMap
        });

        if (normalized) {
            applyPresetStoreToState(normalized);
            return;
        }

        applyPresetStoreToState(createDefaultPresetStore(serializeCurrentCharacterSetting()));
    }

    function resetPresetState() {
        applyPresetStoreToState(createDefaultPresetStore(createEmptyPackedBuild()));
    }

    function initializePresetStateFromCurrentEditor() {
        applyPresetStoreToState(createDefaultPresetStore(serializeCurrentCharacterSetting()));
    }

    function applyPackedBuildToEditorState(payload) {
        const packed = sanitizePackedBuild(payload);
        state.slots = createInitialSlotState();

        const mainOptions = getMainRevelationOptions();
        const savedMain = String(packed.m || '').trim();
        state.mainRev = mainOptions.includes(savedMain) ? savedMain : (mainOptions[0] || '');

        const subOptions = getSubRevelationOptions(state.mainRev);
        const savedSub = String(packed.s || '').trim();
        state.subRev = subOptions.includes(savedSub) ? savedSub : (subOptions[0] || '');

        const slotPayloads = Array.isArray(packed.a) ? packed.a : [];
        SLOT_CONFIG.forEach((slot, slotIndex) => {
            const slotState = state.slots[slot.id];
            if (!slotState) return;
            const slotPacked = slotPayloads[slotIndex];
            if (!Array.isArray(slotPacked)) return;

            slotState.mainOption = String(slotPacked[0] || '').trim();

            const packedSubs = Array.isArray(slotPacked[1]) ? slotPacked[1] : [];
            for (let i = 0; i < slotState.subs.length; i += 1) {
                const subPacked = packedSubs[i];
                if (!Array.isArray(subPacked)) continue;
                slotState.subs[i].option = String(subPacked[0] || '').trim();
                slotState.subs[i].value = String(subPacked[1] || '').trim();
                slotState.subs[i].upgrades = normalizeUpgradeInput(subPacked[2] || '');
            }
        });

        ensureSlotDefaults();
    }

    function serializeCurrentCharacterSetting() {
        return {
            m: state.mainRev || '',
            s: state.subRev || '',
            a: SLOT_CONFIG.map((slot) => {
                const slotState = state.slots[slot.id] || { mainOption: '', subs: [] };
                return [
                    slotState.mainOption || '',
                    Array.from({ length: 4 }, (_, idx) => {
                        const row = slotState.subs[idx] || {};
                        return [
                            row.option || '',
                            row.value || '',
                            normalizeUpgradeInput(row.upgrades || '')
                        ];
                    })
                ];
            })
        };
    }

    function syncActivePresetFromEditorState() {
        ensurePresetState();

        let activeId = String(state.activePresetId || '').trim();
        if (!activeId) {
            activeId = DEFAULT_PRESET_ID;
        }
        if (!state.presetOrder.includes(activeId)) {
            state.presetOrder.push(activeId);
        }

        state.activePresetId = activeId;
        state.presetMap[activeId] = sanitizePackedBuild(serializeCurrentCharacterSetting());
    }

    function persistPresetStorePayload(characterName, storePayload) {
        const name = String(characterName || '').trim();
        if (!name || typeof window.localStorage === 'undefined') return false;

        const normalized = normalizePresetStorePayload(storePayload);
        if (!normalized) return false;

        const encoded = encodeStoragePayload(normalized);
        if (!encoded) return false;

        window.localStorage.setItem(getStorageKeyV2(name), encoded);
        return true;
    }

    function persistSelectedCharacterSetting() {
        const name = String(state.selectedCharacter || '').trim();
        if (!name || typeof window.localStorage === 'undefined') return;
        try {
            syncActivePresetFromEditorState();
            const payload = normalizePresetStorePayload({
                v: 2,
                active: state.activePresetId,
                order: state.presetOrder,
                map: state.presetMap,
                names: state.presetNameMap
            });
            if (!payload) return;
            applyPresetStoreToState(payload);
            const encoded = encodeStoragePayload(payload);
            if (!encoded) return;
            window.localStorage.setItem(getStorageKeyV2(name), encoded);
        } catch (error) {
            console.warn('[revelation-setting] persist setting failed:', error);
        }
    }

    function restoreCharacterSetting(characterName) {
        const name = String(characterName || '').trim();
        if (!name || typeof window.localStorage === 'undefined') return false;

        let storePayload = null;
        try {
            const encodedV2 = window.localStorage.getItem(getStorageKeyV2(name));
            if (encodedV2) {
                const decodedV2 = decodeStoragePayload(encodedV2);
                storePayload = normalizePresetStorePayload(decodedV2);
            }

            if (!storePayload) {
                const encodedV1 = window.localStorage.getItem(getStorageKeyV1(name));
                if (encodedV1) {
                    const decodedV1 = decodeStoragePayload(encodedV1);
                    if (decodedV1 && typeof decodedV1 === 'object') {
                        storePayload = createDefaultPresetStore(decodedV1);
                        persistPresetStorePayload(name, storePayload);
                    }
                }
            }
        } catch (error) {
            return false;
        }

        if (!storePayload) return false;

        applyPresetStoreToState(storePayload);
        const activeBuild = state.presetMap[state.activePresetId]
            || state.presetMap[DEFAULT_PRESET_ID]
            || createEmptyPackedBuild();
        applyPackedBuildToEditorState(activeBuild);
        return true;
    }

    function createMainValueRow(optionLabel, valueLabel) {
        const row = document.createElement('div');
        row.className = 'rs-main-value-row';

        const labelWrap = document.createElement('span');
        labelWrap.className = 'rs-main-value-row-label';

        const iconPath = getStatIconPath(optionLabel);
        if (iconPath) {
            const icon = document.createElement('img');
            icon.src = iconPath;
            icon.alt = '';
            icon.onerror = function onMainStatIconError() {
                this.hidden = true;
            };
            labelWrap.appendChild(icon);
        }

        const label = document.createElement('span');
        label.textContent = optionLabel || t('label_none', '-');
        labelWrap.appendChild(label);

        const value = document.createElement('strong');
        value.className = 'rs-main-value-row-value';
        value.textContent = valueLabel || t('label_none', '-');

        row.appendChild(labelWrap);
        row.appendChild(value);
        return row;
    }

    function createMainPairValueRow(primaryOption, primaryValue, secondaryOption, secondaryValue) {
        const row = document.createElement('div');
        row.className = 'rs-main-pair-row';

        const labelWrap = document.createElement('span');
        labelWrap.className = 'rs-main-pair-row-label';

        const primaryIconPath = getStatIconPath(primaryOption);
        if (primaryIconPath) {
            const icon = document.createElement('img');
            icon.src = primaryIconPath;
            icon.alt = '';
            icon.onerror = function onMainPairIconError() {
                this.hidden = true;
            };
            labelWrap.appendChild(icon);
        }

        const secondaryIconPath = getStatIconPath(secondaryOption);
        if (secondaryIconPath) {
            const icon = document.createElement('img');
            icon.src = secondaryIconPath;
            icon.alt = '';
            icon.onerror = function onMainPairIconError() {
                this.hidden = true;
            };
            labelWrap.appendChild(icon);
        }

        const label = document.createElement('span');
        label.textContent = `${primaryOption || t('label_none', '-')} / ${secondaryOption || t('label_none', '-')}`;
        labelWrap.appendChild(label);

        const value = document.createElement('strong');
        value.className = 'rs-main-pair-row-value';
        value.textContent = `${primaryValue || t('label_none', '-')} / ${secondaryValue || t('label_none', '-')}`;

        row.appendChild(labelWrap);
        row.appendChild(value);
        return row;
    }

    function createSlotCardElement(slot) {
        const slotState = state.slots[slot.id];
        enforceSubOptionRestrictions(slot.id);
        applyDefaultSubOptions(slot.id);
        ensureSlotSubValueDefaults(slot.id);
        const cardRevelationName = slot.id === 'uni' ? state.mainRev : state.subRev;
        const cardRevelationLabel = cardRevelationName
            ? toRevelationLabel(cardRevelationName)
            : t('label_none', '-');

        const card = document.createElement('div');
        card.className = 'rs-slot-card';
        card.dataset.slot = slot.id;

        const header = document.createElement('div');
        header.className = 'rs-slot-card-header';

        const titleWrap = document.createElement('div');
        titleWrap.className = 'rs-slot-title';

        const titleRevIcon = document.createElement('img');
        titleRevIcon.className = 'rs-slot-title-rev-icon';
        if (cardRevelationName) {
            titleRevIcon.src = getRevelationTitleIconPath(cardRevelationName);
            titleRevIcon.alt = cardRevelationLabel;
            titleRevIcon.hidden = false;
            titleRevIcon.onerror = function onSlotRevIconError() {
                const fallback = derivePngFromWebp(this.src);
                if (fallback && this.src !== fallback) {
                    this.src = fallback;
                    return;
                }
                this.hidden = true;
            };
        } else {
            titleRevIcon.hidden = true;
        }

        const slotIcon = document.createElement('img');
        slotIcon.className = 'rs-slot-title-icon';
        slotIcon.src = getSlotIconPath(slot.id);
        slotIcon.alt = t(slot.titleKey, slot.id.toUpperCase());
        slotIcon.onerror = function onSlotIconError() {
            this.hidden = true;
        };

        const titleText = document.createElement('span');
        titleText.className = 'rs-slot-title-text';
        titleText.textContent = t(slot.titleKey, slot.id.toUpperCase());

        titleWrap.appendChild(titleRevIcon);
        titleWrap.appendChild(slotIcon);
        titleWrap.appendChild(titleText);

        header.appendChild(titleWrap);
        card.appendChild(header);

        const mainDisplayRows = getMainDisplayRows(slot.id, slotState.mainOption);

        if (slot.id === 'uni') {
            const first = mainDisplayRows[0] || {};
            const second = mainDisplayRows[1] || {};
            card.appendChild(createMainPairValueRow(first.option, first.value, second.option, second.value));
        } else if (slot.id === 'sun') {
            const mainFixedList = document.createElement('div');
            mainFixedList.className = 'rs-main-fixed-list';
            mainDisplayRows.forEach((row) => {
                mainFixedList.appendChild(createMainValueRow(row.option, row.value));
            });
            card.appendChild(mainFixedList);
        } else {
            const mainInlineRow = document.createElement('div');
            mainInlineRow.className = 'rs-main-inline-row';

            const mainDropdownHost = document.createElement('div');
            mainDropdownHost.className = 'rs-dropdown-host';

            const mainValue = document.createElement('strong');
            mainValue.className = 'rs-main-inline-value';
            mainValue.textContent = (mainDisplayRows[0] && mainDisplayRows[0].value)
                ? mainDisplayRows[0].value
                : t('label_none', '-');

            mainInlineRow.appendChild(mainDropdownHost);
            mainInlineRow.appendChild(mainValue);
            card.appendChild(mainInlineRow);

            const mainItems = getMainStatRows(slot.id).map((row) => ({
                value: row[0],
                label: row[0],
                icon: getStatIconPath(row[0])
            }));

            buildCustomDropdown({
                host: mainDropdownHost,
                items: mainItems,
                value: slotState.mainOption,
                placeholder: t('placeholder_select_main_option', 'Select main option'),
                includeEmptyOption: false,
                disabled: mainItems.length === 0,
                onChange: (value) => {
                    slotState.mainOption = value;
                    enforceSubOptionRestrictions(slot.id);
                    applyDefaultSubOptions(slot.id);
                    ensureSlotSubValueDefaults(slot.id);
                    persistSelectedCharacterSetting();
                    renderPreview();
                    renderSlotCards();
                }
            });
        }

        const subStatRows = getSubStatRows(slot.id);

        for (let idx = 0; idx < slotState.subs.length; idx += 1) {
            const subRowState = slotState.subs[idx];
            const blockedByMain = getMainBlockedSubOptions(slot.id);
            const subOptions = subStatRows.map((row) => ({
                value: row[0],
                label: translateSubStatOption(row[0]),
                icon: getStatIconPath(row[0]),
                disabled: blockedByMain.has(toCanonicalStatKey(row[0]))
            }));

            const rowEl = document.createElement('div');
            rowEl.className = 'rs-sub-row';

            const subDropdownHost = document.createElement('div');
            subDropdownHost.className = 'rs-dropdown-host';

            buildCustomDropdown({
                host: subDropdownHost,
                items: subOptions,
                value: subRowState.option,
                placeholder: t('label_none', '-'),
                includeEmptyOption: true,
                disabled: subOptions.length === 0,
                onChange: (value) => {
                    const nextOption = String(value || '').trim();
                    const canonicalNext = toCanonicalStatKey(nextOption);
                    const canonicalMainBlocked = getMainBlockedSubOptions(slot.id);

                    if (canonicalNext && canonicalMainBlocked.has(canonicalNext)) {
                        showToast(t('msg_sub_option_conflict_main', 'Main option cannot be selected as sub option.'), 'error');
                        return;
                    }

                    if (!nextOption) {
                        slotState.subs[idx].option = '';
                        slotState.subs[idx].value = '';
                    } else {
                        const swapIndex = slotState.subs.findIndex((row, rowIndex) => {
                            if (rowIndex === idx) return false;
                            return toCanonicalStatKey(row.option) === canonicalNext;
                        });

                        if (swapIndex !== -1) {
                            const currentSnapshot = {
                                option: slotState.subs[idx].option || '',
                                value: slotState.subs[idx].value || '',
                                upgrades: normalizeUpgradeInput(slotState.subs[idx].upgrades || '')
                            };
                            const targetSnapshot = {
                                option: slotState.subs[swapIndex].option || '',
                                value: slotState.subs[swapIndex].value || '',
                                upgrades: normalizeUpgradeInput(slotState.subs[swapIndex].upgrades || '')
                            };
                            slotState.subs[idx] = targetSnapshot;
                            slotState.subs[swapIndex] = currentSnapshot;
                        } else {
                            slotState.subs[idx].option = nextOption;
                            slotState.subs[idx].value = getSubStatMaxValue(slot.id, nextOption);
                        }
                    }

                    enforceSubOptionRestrictions(slot.id);
                    applyDefaultSubOptions(slot.id);
                    ensureSlotSubValueDefaults(slot.id);
                    persistSelectedCharacterSetting();
                    renderPreview();
                    renderSlotCards();
                }
            });

            const valueInput = document.createElement('input');
            valueInput.className = 'rs-sub-value-input';
            valueInput.type = 'text';
            valueInput.placeholder = t('placeholder_value', 'Value');
            valueInput.value = subRowState.value || '';
            valueInput.addEventListener('input', (event) => {
                subRowState.value = String(event.target.value || '');
                persistSelectedCharacterSetting();
                renderPreview();
            });
            valueInput.addEventListener('blur', (event) => {
                const formatted = normalizePercentValue(subRowState.option, event.target.value);
                subRowState.value = formatted;
                event.target.value = formatted;
                persistSelectedCharacterSetting();
                renderPreview();
            });

            const upgradeInput = document.createElement('input');
            upgradeInput.className = 'rs-sub-upgrade-input';
            upgradeInput.type = 'number';
            upgradeInput.min = '0';
            upgradeInput.max = '5';
            upgradeInput.step = '1';
            upgradeInput.inputMode = 'numeric';
            upgradeInput.placeholder = '0';
            upgradeInput.value = subRowState.upgrades || '';
            upgradeInput.addEventListener('input', (event) => {
                const normalized = normalizeUpgradeInput(event.target.value);
                subRowState.upgrades = normalized;
                event.target.value = normalized;
                persistSelectedCharacterSetting();
                renderPreview();
            });

            rowEl.appendChild(subDropdownHost);
            rowEl.appendChild(upgradeInput);
            rowEl.appendChild(valueInput);
            card.appendChild(rowEl);
        }

        return card;
    }

    function renderSlotCards() {
        if (!dom.slotCardsContainer) return;
        ensureSlotDefaults();
        dom.slotCardsContainer.innerHTML = '';

        const uniSlot = SLOT_CONFIG.find((slot) => slot.id === 'uni');
        if (uniSlot) {
            dom.slotCardsContainer.appendChild(createSlotCardElement(uniSlot));
        }

        getSubSlotIds().forEach((slotId) => {
            const slot = SLOT_CONFIG.find((item) => item.id === slotId);
            if (!slot) return;
            dom.slotCardsContainer.appendChild(createSlotCardElement(slot));
        });
    }

    function renderPreview() {
        renderStatsSummary();
        if (!dom.previewRoot) return;

        if (!state.selectedCharacter) {
            dom.previewRoot.innerHTML = `
                <div class="rs-preview-empty">
                    ${escapeHtml(t('preview_empty', 'Select a character to see the share preview.'))}
                </div>
            `;
            return;
        }

        const labelNone = t('label_none', '-');
        const characterName = getCharacterLabel(state.selectedCharacter);
        const mainRevLabel = state.mainRev ? toRevelationLabel(state.mainRev) : labelNone;
        const subRevLabel = state.subRev ? toRevelationLabel(state.subRev) : labelNone;
        const mainRevIcon = state.mainRev ? getRevelationTitleIconPath(state.mainRev) : '';
        const subRevIcon = state.subRev ? getRevelationTitleIconPath(state.subRev) : '';
        const avatarPath = getCharacterImagePath(state.selectedCharacter);
        const subSetEffects = getSubSetEffects(state.subRev);
        const comboSetEffect = getMainSubSetEffect(state.mainRev, state.subRev);
        const effectNoneLabel = t('preview_effect_none', '-');

        const slotHtml = SLOT_CONFIG.map((slot) => {
            const slotState = state.slots[slot.id];
            const slotIconPath = getSlotIconPath(slot.id);
            const slotRevelationName = slot.id === 'uni' ? state.mainRev : state.subRev;
            const slotRevelationLabel = slotRevelationName ? toRevelationLabel(slotRevelationName) : labelNone;
            const slotRevelationIcon = slotRevelationName ? getRevelationTitleIconPath(slotRevelationName) : '';
            const mainRows = getMainDisplayRows(slot.id, slotState.mainOption);

            const mainRowsHtml = mainRows.length > 0
                ? (slot.id === 'uni'
                    ? (() => {
                        const attackRow = mainRows[0] || {};
                        const defenseRow = mainRows[1] || {};
                        const attackLabel = attackRow.option || t('sub_attack', 'Attack');
                        const defenseLabel = defenseRow.option || t('sub_defense', 'Defense');
                        const attackValue = attackRow.value || labelNone;
                        const defenseValue = defenseRow.value || labelNone;
                        const attackIcon = getStatIconPath(attackLabel);
                        const defenseIcon = getStatIconPath(defenseLabel);

                        return `
                            <div class="rs-preview-main-option rs-preview-main-option-combined">
                                <span class="rs-preview-main-combined-label">
                                    ${attackIcon ? `<img src="${escapeHtml(attackIcon)}" alt="">` : ''}
                                    ${defenseIcon ? `<img src="${escapeHtml(defenseIcon)}" alt="">` : ''}
                                    <span>${escapeHtml(attackLabel)} / ${escapeHtml(defenseLabel)}</span>
                                </span>
                                <span class="rs-preview-sub-value">${escapeHtml(attackValue)} / ${escapeHtml(defenseValue)}</span>
                            </div>
                        `;
                    })()
                    : mainRows.map((row) => {
                        const icon = getStatIconPath(row.option);
                        const value = row.value || labelNone;
                        return `
                            <div class="rs-preview-main-option">
                                <span class="rs-preview-sub-option">
                                    ${icon ? `<img src="${escapeHtml(icon)}" alt="">` : ''}
                                    <span>${escapeHtml(row.option || labelNone)}</span>
                                </span>
                                <span class="rs-preview-sub-value">${escapeHtml(value)}</span>
                            </div>
                        `;
                    }).join(''))
                : `<div class="rs-preview-main-option"><span>${escapeHtml(labelNone)}</span></div>`;

            const subItems = slotState.subs.map((row) => {
                const optionLabel = row.option ? translateSubStatOption(row.option) : labelNone;
                const valueLabel = row.value || labelNone;
                const upgradeNum = parseUpgradeValue(row.upgrades);
                const upgradeLabel = upgradeNum > 0 ? `+${upgradeNum}` : labelNone;
                const optionIcon = row.option ? getStatIconPath(row.option) : '';

                return `
                    <div class="rs-preview-sub-item">
                        <span class="rs-preview-sub-option">
                            ${optionIcon ? `<img src="${escapeHtml(optionIcon)}" alt="">` : ''}
                            <span>${escapeHtml(optionLabel)}</span>
                        </span>
                        <span class="rs-preview-sub-upgrade">${escapeHtml(upgradeLabel)}</span>
                        <span class="rs-preview-sub-value">${escapeHtml(valueLabel)}</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="rs-preview-slot">
                    <div class="rs-preview-slot-title-wrap">
                        ${slotRevelationIcon ? `<img class="rs-preview-slot-title-rev-icon" src="${escapeHtml(slotRevelationIcon)}" alt="${escapeHtml(slotRevelationLabel)}">` : ''}
                        <img class="rs-slot-title-icon" src="${escapeHtml(slotIconPath)}" alt="${escapeHtml(t(slot.titleKey, slot.id.toUpperCase()))}">
                        <h3 class="rs-preview-slot-title">${escapeHtml(t(slot.titleKey, slot.id.toUpperCase()))}</h3>
                    </div>
                    <div class="rs-preview-main-options">${mainRowsHtml}</div>
                    ${subItems}
                </div>
            `;
        }).join('');

        dom.previewRoot.innerHTML = `
            <div class="rs-preview-capture">
                <div class="rs-preview-top-grid">
                    <div class="rs-preview-config">
                        <div class="rs-preview-head">
                            <img class="rs-preview-avatar" src="${escapeHtml(avatarPath)}" alt="${escapeHtml(characterName)}">
                            <div class="rs-preview-head-meta">
                                <h2 class="rs-preview-character">${escapeHtml(characterName)}</h2>
                                <div class="rs-preview-revelations">
                                    <div class="rs-preview-revelation-item">
                                        <img class="rs-slot-title-icon" src="${escapeHtml(getSlotIconPath('uni'))}" alt="${escapeHtml(t('slot_uni', 'UNI'))}">
                                        ${mainRevIcon ? `<img class="rs-preview-revelation-icon" src="${escapeHtml(mainRevIcon)}" alt="${escapeHtml(mainRevLabel)}">` : '<span class="rs-preview-revelation-icon"></span>'}
                                        <span class="rs-preview-revelation-name">${escapeHtml(mainRevLabel)}</span>
                                    </div>
                                    <div class="rs-preview-revelation-item">
                                        <img class="rs-slot-title-icon" src="${escapeHtml(getSlotIconPath('sun'))}" alt="${escapeHtml(t('label_sub_slots', 'SUB'))}">
                                        ${subRevIcon ? `<img class="rs-preview-revelation-icon" src="${escapeHtml(subRevIcon)}" alt="${escapeHtml(subRevLabel)}">` : '<span class="rs-preview-revelation-icon"></span>'}
                                        <span class="rs-preview-revelation-name">${escapeHtml(subRevLabel)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rs-preview-effects">
                        <h3 class="rs-preview-effects-title">${escapeHtml(t('preview_effects_title', '\uC138\uD2B8 \uD6A8\uACFC'))}</h3>
                        <div class="rs-preview-effect-row">
                            <span class="rs-preview-effect-label">${escapeHtml(t('preview_set2_short', '\u0032\uC138\uD2B8'))}</span>
                            <span class="rs-preview-effect-text">${renderEffectText(subSetEffects.set2, effectNoneLabel)}</span>
                        </div>
                        <div class="rs-preview-effect-row">
                            <span class="rs-preview-effect-label">${escapeHtml(t('preview_set4_short', '\u0034\uC138\uD2B8'))}</span>
                            <span class="rs-preview-effect-text">${renderEffectText(subSetEffects.set4, effectNoneLabel)}</span>
                        </div>
                        <div class="rs-preview-effect-row">
                            <span class="rs-preview-effect-label">${escapeHtml(t('preview_combo_set_short', '\uC138\uD2B8 \uD6A8\uACFC'))}</span>
                            <span class="rs-preview-effect-text">${renderEffectText(comboSetEffect, effectNoneLabel)}</span>
                        </div>
                    </div>
                </div>
                <div class="rs-preview-slots">${slotHtml}</div>
            </div>
        `;

        const previewAvatar = dom.previewRoot.querySelector('.rs-preview-avatar');
        if (previewAvatar) {
            previewAvatar.onerror = function onPreviewAvatarError() {
                this.hidden = true;
            };
        }

        dom.previewRoot.querySelectorAll('.rs-preview-slot img').forEach((img) => {
            img.onerror = function onPreviewIconError() {
                this.hidden = true;
            };
        });
    }

    function renderStatsSummary() {
        if (!dom.statsSummary) return;
        if (!state.selectedCharacter) {
            dom.statsSummary.hidden = true;
            return;
        }

        var totals = {};
        var summaryGroups = [
            ['Attack', 'Attack %', 'Defense', 'Defense %', 'HP', 'HP %', 'Speed'],
            ['Crit Rate', 'Crit Mult.', 'Attack Mult.', 'Pierce Rate', 'SP Recovery', 'Ailment Accuracy', 'Healing Effect']
        ];

        function addStat(name, value) {
            var key = toCanonicalStatKey(name);
            if (!key) return;

            var valueText = String(value || '');
            var num = parseFloat(valueText.replace(/[^0-9.\-]/g, ''));
            if (!Number.isFinite(num) || num === 0) return;

            if (!totals[key]) {
                totals[key] = { value: 0, isPercent: false };
            }
            if (valueText.indexOf('%') !== -1 || PERCENT_STAT_CANONICAL.has(key)) {
                totals[key].isPercent = true;
            }
            totals[key].value += num;
        }

        SLOT_CONFIG.forEach(function (slot) {
            var slotState = state.slots[slot.id];
            if (!slotState) return;

            var mainRows = getMainDisplayRows(slot.id, slotState.mainOption);
            mainRows.forEach(function (row) {
                addStat(row.option, row.value);
            });

            slotState.subs.forEach(function (sub) {
                addStat(sub.option, sub.value);
            });
        });

        var groupsHtml = summaryGroups.map(function (groupKeys, groupIndex) {
            var rowsHtml = groupKeys.map(function (key) {
                var icon = getStatIconPath(key);
                var label = translateSubStatOption(key);
                var statInfo = totals[key] || { value: 0, isPercent: PERCENT_STAT_CANONICAL.has(key) };
                var val = Number(statInfo.value || 0);
                var isPercent = !!statInfo.isPercent;
                var isDisabled = Math.abs(val) < 0.000001;
                var display = isPercent
                    ? (isDisabled ? '0%' : (Math.round(val * 100) / 100) + '%')
                    : (isDisabled ? '0' : String(Math.round(val)));

                return '<div class="rs-summary-row' + (isDisabled ? ' is-disabled' : '') + '">'
                    + '<span class="rs-summary-label">'
                    + (icon ? '<img class="rs-summary-icon" src="' + escapeHtml(icon) + '" alt="">' : '')
                    + '<span>' + escapeHtml(label) + '</span>'
                    + '</span>'
                    + '<span class="rs-summary-value">' + escapeHtml(display) + '</span>'
                    + '</div>';
            }).join('');

            return '<div class="rs-summary-group' + (groupIndex > 0 ? ' is-secondary' : '') + '">'
                + '<div class="rs-summary-grid">' + rowsHtml + '</div>'
                + '</div>';
        }).join('');

        dom.statsSummary.innerHTML = '<div class="rs-summary-groups">' + groupsHtml + '</div>';
        dom.statsSummary.hidden = false;
    }

    function sanitizeFileToken(value) {
        return String(value || '')
            .trim()
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
            .replace(/\s+/g, '_')
            .slice(0, 40) || 'unknown';
    }

    async function ensureHtmlToImage() {
        if (window.htmlToImage) return;
        await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js';
            s.onload = resolve;
            s.onerror = () => {
                const s2 = document.createElement('script');
                s2.src = 'https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js';
                s2.onload = resolve;
                s2.onerror = reject;
                document.head.appendChild(s2);
            };
            document.head.appendChild(s);
        });
    }

    function loadImageAsCanvas(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }

    async function withZeroUpgradeHiddenForCapture(captureNode, task) {
        if (!captureNode || typeof task !== 'function') {
            return task ? task() : null;
        }

        const zeroUpgradeInputs = Array.from(
            captureNode.querySelectorAll('.rs-sub-upgrade-input')
        ).filter((input) => {
            const text = String(input.value || '').trim();
            if (!text) return true;
            return parseUpgradeValue(text) === 0;
        });

        zeroUpgradeInputs.forEach((input) => {
            input.classList.add('rs-capture-zero-hidden');
        });

        try {
            return await task();
        } finally {
            zeroUpgradeInputs.forEach((input) => {
                input.classList.remove('rs-capture-zero-hidden');
            });
        }
    }

    async function captureToCanvas(captureNode) {
        await ensureHtmlToImage();
        if (!window.htmlToImage || typeof window.htmlToImage.toPng !== 'function') {
            throw new Error('Capture library missing');
        }

        const bodyBg = getComputedStyle(document.body).backgroundColor || '#222222';
        const pixelRatio = Math.min(3, (window.devicePixelRatio || 1) * 2);
        const pad = 16;
        const watermarkH = 28;

        let dataUrl = '';
        captureNode.classList.add('rs-capture-mode');
        try {
            dataUrl = await window.htmlToImage.toPng(captureNode, {
                backgroundColor: bodyBg,
                pixelRatio,
                cacheBust: true,
                skipFonts: true,
                filter: (node) => {
                    if (!(node instanceof HTMLElement)) return true;
                    if (node.hidden) return false;
                    if (node.classList && node.classList.contains('rs-character-panel')) return false;
                    if (node.classList && node.classList.contains('rs-dropdown-menu')) return false;
                    if (node.classList && node.classList.contains('rs-dropdown-arrow')) return false;
                    if (node.tagName === 'LINK' && node.rel === 'stylesheet' && node.href && !node.href.startsWith(window.location.origin)) return false;
                    return true;
                }
            });
        } finally {
            captureNode.classList.remove('rs-capture-mode');
        }

        const srcImg = await loadImageAsCanvas(dataUrl);
        if (!srcImg) throw new Error('Failed to load captured image');

        const cw = srcImg.width + pad * 2 * pixelRatio;
        const ch = srcImg.height + (pad * 2 + watermarkH) * pixelRatio;

        const canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = bodyBg;
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(srcImg, pad * pixelRatio, pad * pixelRatio);

        const logoSrc = (state.baseUrl || '') + '/assets/img/logo/lufel.webp';
        const logoImg = await loadImageAsCanvas(logoSrc);
        const logoSize = 16 * pixelRatio;
        const textSize = 11 * pixelRatio;
        const wmY = srcImg.height + (pad * 1.5) * pixelRatio;

        ctx.font = `500 ${textSize}px "Noto Sans", sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        const label = 'lufel.net';
        const textW = ctx.measureText(label).width;
        const wmX = cw - pad * pixelRatio - textW;

        ctx.fillText(label, wmX, wmY + logoSize * 0.75);

        if (logoImg) {
            const logoX = wmX - logoSize - 5 * pixelRatio;
            ctx.drawImage(logoImg, logoX, wmY, logoSize, logoSize);
        }

        return canvas;
    }

    async function handleDownloadPng() {
        if (!state.selectedCharacter) {
            alert(t('msg_preview_empty', 'Please select a character first.'));
            return;
        }

        const captureNode = dom.configLayout || document.querySelector('.rs-config-layout');
        if (!captureNode) return;

        if (dom.downloadBtn) dom.downloadBtn.disabled = true;

        try {
            const canvas = await withZeroUpgradeHiddenForCapture(
                captureNode,
                () => captureToCanvas(captureNode)
            );
            const dataUrl = canvas.toDataURL('image/png');

            const characterToken = sanitizeFileToken(state.selectedCharacter || 'unknown');
            const fileName = `revelation-share_${characterToken}_${Date.now()}.png`;

            const anchor = document.createElement('a');
            anchor.href = dataUrl;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            showToast(t('msg_capture_success', 'PNG downloaded.'));
        } catch (error) {
            console.error('[revelation-setting] capture failed:', error);
            alert(t('msg_capture_failed', 'Failed to capture image. (' + (error.message || error) + ')'));
        } finally {
            if (dom.downloadBtn) dom.downloadBtn.disabled = false;
        }
    }

    async function handleCopyPng() {
        if (!state.selectedCharacter) {
            alert(t('msg_preview_empty', 'Please select a character first.'));
            return;
        }

        const captureNode = dom.configLayout || document.querySelector('.rs-config-layout');
        if (!captureNode) return;

        if (dom.copyBtn) dom.copyBtn.disabled = true;

        try {
            const canvas = await withZeroUpgradeHiddenForCapture(
                captureNode,
                () => captureToCanvas(captureNode)
            );
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error('Failed to create blob');

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            showToast(t('msg_copy_success', 'Image copied to clipboard.'));
        } catch (error) {
            console.error('[revelation-setting] copy failed:', error);
            alert(t('msg_copy_failed', 'Failed to copy image. (' + (error.message || error) + ')'));
        } finally {
            if (dom.copyBtn) dom.copyBtn.disabled = false;
        }
    }

    function isRevelationSettingStorageKey(key) {
        const text = String(key || '');
        return text.indexOf(STORAGE_PREFIX_V1) === 0 || text.indexOf(STORAGE_PREFIX_V2) === 0;
    }

    function collectRevelationSettingStorageEntries() {
        const entries = {};
        if (typeof window.localStorage === 'undefined') return entries;

        for (let i = 0; i < window.localStorage.length; i += 1) {
            const key = window.localStorage.key(i);
            if (!isRevelationSettingStorageKey(key)) continue;
            entries[key] = String(window.localStorage.getItem(key) || '');
        }
        return entries;
    }

    function clearRevelationSettingStorageEntries() {
        if (typeof window.localStorage === 'undefined') return;
        const removeKeys = [];
        for (let i = 0; i < window.localStorage.length; i += 1) {
            const key = window.localStorage.key(i);
            if (!isRevelationSettingStorageKey(key)) continue;
            removeKeys.push(key);
        }
        removeKeys.forEach((key) => {
            window.localStorage.removeItem(key);
        });
    }

    function normalizeBackupEntries(payload) {
        if (!payload || typeof payload !== 'object') return null;
        if (String(payload.format || '') !== 'revelation-setting-backup') return null;
        if (!payload.entries || typeof payload.entries !== 'object') return null;

        const out = {};
        Object.keys(payload.entries).forEach((key) => {
            if (!isRevelationSettingStorageKey(key)) return;
            const value = payload.entries[key];
            if (typeof value !== 'string') return;
            out[key] = value;
        });
        return out;
    }

    async function handleBackupExport() {
        if (typeof window.localStorage === 'undefined') {
            showToast(t('msg_backup_failed', 'Backup failed.'), 'error');
            return;
        }
        if (dom.backupBtn) dom.backupBtn.disabled = true;

        try {
            const payload = {
                format: 'revelation-setting-backup',
                version: 1,
                exported_at: new Date().toISOString(),
                entries: collectRevelationSettingStorageEntries()
            };

            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = objectUrl;
            anchor.download = `revelation-setting-backup_${Date.now()}.json`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(objectUrl);

            showToast(t('msg_backup_success', 'Backup downloaded.'));
        } catch (error) {
            console.error('[revelation-setting] backup export failed:', error);
            showToast(t('msg_backup_failed', 'Backup failed.'), 'error');
        } finally {
            if (dom.backupBtn) dom.backupBtn.disabled = false;
        }
    }

    async function handleBackupImportFromFile(file) {
        if (!file) return;
        if (typeof window.localStorage === 'undefined') {
            showToast(t('msg_load_backup_failed', 'Failed to load backup.'), 'error');
            return;
        }
        if (dom.loadBtn) dom.loadBtn.disabled = true;

        try {
            const fileText = await file.text();
            const parsed = JSON.parse(fileText);
            const entries = normalizeBackupEntries(parsed);
            if (!entries) {
                showToast(t('msg_load_backup_invalid', 'Invalid backup file format.'), 'error');
                return;
            }

            clearRevelationSettingStorageEntries();
            Object.keys(entries).forEach((key) => {
                window.localStorage.setItem(key, entries[key]);
            });

            if (state.selectedCharacter) {
                await handleCharacterSelection(state.selectedCharacter);
            } else {
                renderPresetDropdown();
                renderMainRevelationDropdown();
                renderSubRevelationDropdown();
                renderSlotCards();
                renderPreview();
            }

            showToast(t('msg_load_backup_success', 'Backup loaded.'));
        } catch (error) {
            console.error('[revelation-setting] backup import failed:', error);
            showToast(t('msg_load_backup_failed', 'Failed to load backup.'), 'error');
        } finally {
            if (dom.backupFileInput) {
                dom.backupFileInput.value = '';
            }
            if (dom.loadBtn) dom.loadBtn.disabled = false;
        }
    }

    function handleBackupImportClick() {
        if (!dom.backupFileInput) return;
        dom.backupFileInput.click();
    }

    function buildSharePresetStoreFromActivePreset() {
        syncActivePresetFromEditorState();
        const activePresetId = String(state.activePresetId || '').trim();
        const sourceBuild = state.presetMap[activePresetId]
            || state.presetMap[DEFAULT_PRESET_ID]
            || createEmptyPackedBuild();

        return {
            v: 2,
            active: DEFAULT_PRESET_ID,
            order: [DEFAULT_PRESET_ID],
            map: {
                [DEFAULT_PRESET_ID]: clonePackedBuild(sourceBuild)
            },
            names: {}
        };
    }

    function createSharePayload() {
        const characterName = String(state.selectedCharacter || '').trim();
        if (!characterName) return null;

        return {
            'revelation-setting-share-ver': SHARE_PAYLOAD_VERSION,
            character: characterName,
            store: buildSharePresetStoreFromActivePreset()
        };
    }

    function parseSharePayload(rawData) {
        let jsonString = String(rawData || '').trim();
        if (!jsonString) return null;

        if (typeof LZString !== 'undefined') {
            const decompressed = LZString.decompressFromEncodedURIComponent(jsonString);
            if (decompressed) {
                jsonString = decompressed;
            }
        }

        let payload = null;
        try {
            payload = JSON.parse(jsonString);
        } catch (error) {
            return null;
        }

        if (!payload || typeof payload !== 'object') return null;
        const payloadVersion = Number(payload['revelation-setting-share-ver']);
        if (!Number.isFinite(payloadVersion) || payloadVersion < 1) return null;

        const characterName = String(payload.character || '').trim();
        if (!characterName) return null;

        const normalizedStore = normalizePresetStorePayload(payload.store);
        if (!normalizedStore) return null;

        return {
            character: characterName,
            store: normalizedStore
        };
    }

    function applySharedPayload(sharedPayload) {
        if (!sharedPayload || typeof sharedPayload !== 'object') return false;

        const characterName = String(sharedPayload.character || '').trim();
        if (!characterName) return false;

        const normalizedStore = normalizePresetStorePayload(sharedPayload.store);
        if (!normalizedStore) return false;

        state.selectedCharacter = characterName;
        state.mainRev = '';
        state.subRev = '';
        state.slots = createInitialSlotState();

        applyPresetStoreToState(normalizedStore);
        const activeBuild = state.presetMap[state.activePresetId]
            || state.presetMap[DEFAULT_PRESET_ID]
            || createEmptyPackedBuild();
        applyPackedBuildToEditorState(activeBuild);
        ensureSlotDefaults();

        renderCharacterSelector();
        renderPresetDropdown();
        renderMainRevelationDropdown();
        renderSubRevelationDropdown();
        renderSlotCards();
        renderPreview();
        setCharacterPanelOpen(false);
        clearError();
        return true;
    }

    async function tryLoadSharedFromUrl() {
        let binId = '';
        try {
            const params = new URLSearchParams(window.location.search || '');
            binId = String(params.get(SHARE_QUERY_KEY) || '').trim();
        } catch (_) {
            return false;
        }

        if (!binId) return false;

        try {
            const response = await fetch(`${GAS_URL}?id=${encodeURIComponent(binId)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch shared payload: ${response.status}`);
            }

            const result = await response.json();
            const encodedData = result && typeof result === 'object'
                ? String(result.data || '').trim()
                : '';
            if (!encodedData) {
                throw new Error('Shared payload not found');
            }

            const sharedPayload = parseSharePayload(encodedData);
            if (!sharedPayload) {
                throw new Error('Invalid shared payload');
            }

            return applySharedPayload(sharedPayload);
        } catch (error) {
            console.error('[revelation-setting] shared payload load failed:', error);
            showToast(t('msg_share_load_failed', 'Failed to load shared link.'), 'error');
            return false;
        }
    }

    function hideShareLoadingModal() {
        const modal = document.getElementById('rsShareLoadingModal');
        if (modal) {
            modal.remove();
        }
    }

    function showShareLoadingModal() {
        hideShareLoadingModal();

        const modal = document.createElement('div');
        modal.id = 'rsShareLoadingModal';
        modal.style.cssText = [
            'position:fixed',
            'inset:0',
            'background:rgba(0,0,0,0.7)',
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'z-index:10000'
        ].join(';');

        const content = document.createElement('div');
        content.style.cssText = [
            'background:#2a2a2a',
            'padding:32px',
            'border-radius:12px',
            'text-align:center',
            'max-width:400px',
            'box-shadow:0 4px 20px rgba(0, 0, 0, 0.5)'
        ].join(';');

        content.innerHTML = `
            <div style="margin-bottom:20px;">
                <div class="rs-share-loading-spinner" style="
                    border:3px solid rgba(255, 255, 255, 0.1);
                    border-top:3px solid #fff;
                    border-radius:50%;
                    width:40px;
                    height:40px;
                    margin:0 auto;
                "></div>
            </div>
            <div style="color:#fff;font-size:16px;margin-bottom:16px;">
                ${t('msg_share_generating', 'Generating share link...')}
            </div>
            <div style="color:rgba(255, 255, 255, 0.6);font-size:13px;line-height:1.6;">
                ${t('msg_share_warning', 'This URL is a convenience feature and may be corrupted.<br>For safe backup, please use the backup feature.')}
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        if (!document.getElementById('rsShareLoadingSpinnerStyle')) {
            const style = document.createElement('style');
            style.id = 'rsShareLoadingSpinnerStyle';
            style.textContent = `
                @keyframes rs-share-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .rs-share-loading-spinner {
                    animation: rs-share-spin 1s linear infinite;
                }
            `;
            document.head.appendChild(style);
        }
    }

    async function handleShareClick() {
        if (!state.selectedCharacter) {
            showToast(t('msg_preview_empty', 'Please select a character first.'), 'error');
            return;
        }

        const payload = createSharePayload();
        if (!payload) {
            showToast(t('msg_preview_empty', 'Please select a character first.'), 'error');
            return;
        }

        showShareLoadingModal();
        if (dom.shareBtn) {
            dom.shareBtn.disabled = true;
            dom.shareBtn.style.opacity = '0.6';
        }

        try {
            let jsonString = JSON.stringify(payload);
            if (typeof LZString !== 'undefined') {
                jsonString = LZString.compressToEncodedURIComponent(jsonString);
            }

            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify({ data: jsonString })
            });
            if (!response.ok) {
                throw new Error(`Failed to share payload: ${response.status}`);
            }

            const result = await response.json();
            const binId = String((result && result.id) || '').trim();
            if (!binId) {
                throw new Error('No bin id returned from GAS');
            }

            const shareUrl = `${window.location.origin}${window.location.pathname}?${SHARE_QUERY_KEY}=${encodeURIComponent(binId)}`;
            await navigator.clipboard.writeText(shareUrl);
            showToast(t('msg_share_success', 'Link copied to clipboard!'));
        } catch (error) {
            console.error('[revelation-setting] share failed:', error);
            showToast(t('msg_share_failed', 'Failed to share.'), 'error');
        } finally {
            hideShareLoadingModal();
            if (dom.shareBtn) {
                dom.shareBtn.disabled = false;
                dom.shareBtn.style.opacity = '1';
            }
        }
    }

    async function handleCharacterSelection(characterName) {
        const selected = String(characterName || '').trim();
        state.selectedCharacter = selected;
        clearError();

        if (!selected) {
            state.mainRev = '';
            state.subRev = '';
            state.slots = createInitialSlotState();
            resetPresetState();
            renderCharacterSelector();
            renderPresetDropdown();
            renderMainRevelationDropdown();
            renderSubRevelationDropdown();
            renderSlotCards();
            renderPreview();
            setCharacterPanelOpen(true);
            return;
        }

        state.mainRev = '';
        state.subRev = '';
        state.slots = createInitialSlotState();
        resetPresetState();

        const restored = restoreCharacterSetting(selected);

        try {
            if (!restored) {
                await applyAutoRevelation(selected);
            }
        } catch (error) {
            console.error('[revelation-setting] auto revelation failed:', error);
            showError(t('msg_load_error_character_setting', 'Character recommended revelation data failed to load.'));
        }

        ensureSlotDefaults();
        if (restored) {
            ensurePresetState();
        } else {
            initializePresetStateFromCurrentEditor();
        }
        persistSelectedCharacterSetting();

        renderCharacterSelector();
        renderPresetDropdown();
        renderMainRevelationDropdown();
        renderSubRevelationDropdown();
        renderSlotCards();
        renderPreview();
    }

    function bindTopEvents() {
        if (dom.characterPill) {
            dom.characterPill.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleCharacterPanel();
            });
        }
        if (dom.characterPanelClose) {
            dom.characterPanelClose.addEventListener('click', () => {
                setCharacterPanelOpen(false);
            });
        }
        if (dom.characterSearchInput) {
            dom.characterSearchInput.addEventListener('input', () => {
                state.characterFilters.query = String(dom.characterSearchInput.value || '').trim();
                updateCharacterFilterResetState();
                renderCharacterList();
            });
        }
        if (dom.backupBtn) {
            const backupLabel = t('button_backup', 'Backup');
            dom.backupBtn.setAttribute('aria-label', backupLabel);
            dom.backupBtn.setAttribute('data-tooltip', backupLabel);
            dom.backupBtn.addEventListener('click', handleBackupExport);
        }
        if (dom.loadBtn) {
            const loadLabel = t('button_load', 'Load');
            dom.loadBtn.setAttribute('aria-label', loadLabel);
            dom.loadBtn.setAttribute('data-tooltip', loadLabel);
            dom.loadBtn.addEventListener('click', handleBackupImportClick);
        }
        if (dom.backupFileInput) {
            dom.backupFileInput.addEventListener('change', (event) => {
                const target = event.target;
                const file = target && target.files && target.files[0] ? target.files[0] : null;
                if (!file) return;
                handleBackupImportFromFile(file);
            });
        }
        if (dom.downloadBtn) {
            const downloadLabel = t('button_capture_image', 'Capture Image');
            dom.downloadBtn.setAttribute('aria-label', downloadLabel);
            dom.downloadBtn.setAttribute('data-tooltip', downloadLabel);
            dom.downloadBtn.addEventListener('click', handleDownloadPng);
        }
        if (dom.copyBtn) {
            const copyLabel = t('button_copy_png', 'Copy Image');
            dom.copyBtn.setAttribute('aria-label', copyLabel);
            dom.copyBtn.setAttribute('data-tooltip', copyLabel);
            dom.copyBtn.addEventListener('click', handleCopyPng);
        }
        if (dom.shareBtn) {
            const shareLabel = t('button_share', 'Share');
            dom.shareBtn.setAttribute('aria-label', shareLabel);
            dom.shareBtn.setAttribute('data-tooltip', shareLabel);
            dom.shareBtn.addEventListener('click', handleShareClick);
        }
    }

    async function initSeo() {
        if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
            await window.SeoEngine.setContextHint({ domain: 'revelation-setting', mode: 'list' }, { rerun: true });
            return;
        }
        if (window.SeoEngine && typeof window.SeoEngine.run === 'function') {
            window.SeoEngine.run();
        }
    }

    function initNavigation() {
        if (window.Navigation && typeof window.Navigation.load === 'function') {
            window.Navigation.load('revelations');
        } else if (typeof Navigation !== 'undefined' && Navigation && typeof Navigation.load === 'function') {
            Navigation.load('revelations');
        }
    }

    async function initI18n() {
        if (window.I18nService && typeof window.I18nService.init === 'function') {
            await window.I18nService.init('revelation-setting');
            if (typeof window.I18nService.updateDOM === 'function') {
                window.I18nService.updateDOM();
            }
        }
        state.lang = getCurrentLang();
    }

    function bindDom() {
        dom.configLayout = document.querySelector('.rs-config-layout');
        dom.characterField = document.querySelector('.rs-character-field');
        dom.characterPill = document.getElementById('rsCharacterPill');
        dom.selectedCharacterName = document.getElementById('rsSelectedCharacterName');
        dom.characterPillIcon = document.getElementById('rsCharacterPillIcon');
        dom.characterPillEmpty = document.getElementById('rsCharacterPillEmpty');
        dom.characterPanel = document.getElementById('rsCharacterPanel');
        dom.characterPanelClose = document.getElementById('rsCharacterPanelClose');
        dom.editorPanel = document.getElementById('rsEditorPanel');
        dom.characterSearchInput = document.getElementById('rsCharacterSearch');
        dom.elementFilters = document.getElementById('rsElementFilters');
        dom.positionFilters = document.getElementById('rsPositionFilters');
        dom.characterFilterReset = document.getElementById('rsCharacterFilterReset');
        dom.characterList = document.getElementById('rsCharacterList');
        dom.presetHost = document.getElementById('rsPresetDropdown');
        dom.mainRevHost = document.getElementById('rsMainRevDropdown');
        dom.mainRevSlotIcon = document.getElementById('rsMainRevSlotIcon');
        dom.subRevHost = document.getElementById('rsSubRevDropdown');
        dom.subRevEffect = document.getElementById('rsSubRevEffect');
        dom.subRevSlotIcons = document.getElementById('rsSubRevSlotIcons');
        dom.slotCardsContainer = document.getElementById('rsSlotCards');
        dom.previewRoot = document.getElementById('rsPreviewRoot');
        dom.backupBtn = document.getElementById('rsBackupBtn');
        dom.loadBtn = document.getElementById('rsLoadBtn');
        dom.downloadBtn = document.getElementById('rsDownloadBtn');
        dom.copyBtn = document.getElementById('rsCopyBtn');
        dom.shareBtn = document.getElementById('rsShareBtn');
        dom.backupFileInput = document.getElementById('rsBackupFileInput');
        dom.statsSummary = document.getElementById('rsStatsSummary');
    }

    async function init() {
        bindDom();
        initNavigation();

        if (!dom.slotCardsContainer || !dom.presetHost || !dom.mainRevHost || !dom.subRevHost) {
            return;
        }

        try {
            if (window.VersionChecker && typeof window.VersionChecker.check === 'function') {
                window.VersionChecker.check();
            }

            await initI18n();
            await initSeo();

            await loadStatsData();
            await loadRevelationData();
            await loadCharacterNames();

            ensureSlotDefaults();
            bindGlobalEvents();
            bindTopEvents();
            renderTopSelectorIcons();

            renderCharacterSelector();
            renderPresetDropdown();
            renderMainRevelationDropdown();
            renderSubRevelationDropdown();
            renderSlotCards();
            renderPreview();
            const sharedLoaded = await tryLoadSharedFromUrl();
            setCharacterPanelOpen(sharedLoaded ? false : !state.selectedCharacter);
            clearError();
        } catch (error) {
            console.error('[revelation-setting] init failed:', error);
            showError(t('msg_load_error_general', '데이터를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.'));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
