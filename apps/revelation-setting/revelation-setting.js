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
        'Attack Mult': 'sub_attack_mult',
        'Damage Mult.': 'sub_attack_mult',
        'Damage Mult': 'sub_attack_mult',
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
        '생명 %': '생명',
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
    const STORAGE_PREFIX_MODIFIED_FALLBACK = 'revelation-setting:modified:v2:';
    const STORAGE_PREFIX_MODIFIED_LEGACY = 'revelation-setting:modified:';
    const GLOBAL_PRESET_ID_PREFIX = 'lufel-global-';
    const GLOBAL_PRESET_SOURCE_PATH = '/apps/revelation-setting/global-preset.json';
    const GLOBAL_PRESET_NAME_KEYWORD = 'lufel.net';
    const DEFAULT_PRESET_ID = 'default';
    const PRESET_ID_PREFIX = 'preset-';
    const PRESET_ADD_ACTION = '__add_preset__';
    const PRESET_MAX_COUNT = 20;
    const PRESET_NAME_MAX_LENGTH = 24;
    const SHARE_PAYLOAD_VERSION = 1;
    const SHARE_QUERY_KEY = 'bin';
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzxSnf6_09q_LDRKIkmBvE2oTtQaLnK22M9ozrHMUAV0JnND9sc6CTILlnBS7_T8FIe/exec';

    function resolveBaseUrl() {
        const fromWindow = (typeof window !== 'undefined' && typeof window.BASE_URL !== 'undefined')
            ? window.BASE_URL
            : '';
        const fromGlobalConst = (typeof BASE_URL !== 'undefined') ? BASE_URL : '';
        return String(fromWindow || fromGlobalConst || '').trim().replace(/\/+$/, '');
    }

    const state = {
        lang: 'kr',
        baseUrl: resolveBaseUrl(),
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
        activePresetId: DEFAULT_PRESET_ID,
        characterModificationCache: new Map(),
        globalPresetMap: {},
        minimumStatsTargetSet: new Set(),
        readonlyBySharedLink: false
    };

    const dom = {};
    let globalEventsBound = false;
    let dropdownManager = null;
    let toastTimerId = null;
    let characterUiController = null;
    let activePresetRenameDialog = null;
    let captureController = null;
    let shareBackupController = null;
    let tierEstimatorController = null;
    let minimumStatsHighlightController = null;

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

    function isSharedReadonlyMode() {
        return state.readonlyBySharedLink === true;
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

    function getMinimumStatsHighlightController() {
        if (minimumStatsHighlightController) return minimumStatsHighlightController;

        const helper = window.RevelationSettingMinimumStatsHighlight;
        if (!helper || typeof helper.createController !== 'function') {
            minimumStatsHighlightController = {};
            return minimumStatsHighlightController;
        }

        minimumStatsHighlightController = helper.createController({
            toCanonicalStatKey
        }) || {};

        return minimumStatsHighlightController;
    }

    function updateMinimumStatsTargetSet(characterName) {
        const name = String(characterName || '').trim();
        state.minimumStatsTargetSet = new Set();
        if (!name) return;

        const controller = getMinimumStatsHighlightController();
        if (!controller || typeof controller.buildTargetSet !== 'function') return;

        const targetSet = controller.buildTargetSet(name);
        if (targetSet && typeof targetSet.forEach === 'function') {
            state.minimumStatsTargetSet = new Set(Array.from(targetSet));
        }
    }

    function isMinimumTargetStatLabel(statLabel) {
        const canonical = toCanonicalStatKey(statLabel);
        if (!canonical) return false;
        return state.minimumStatsTargetSet.has(canonical) || state.minimumStatsTargetSet.has(String(statLabel || '').trim());
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

    function getUpgradeArrowIconPath() {
        return `${state.baseUrl}/apps/revelation-setting/tianfu-new-jiantou.png`;
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

    function normalizeMainOptionForSlot(slotId, optionLabel) {
        const raw = String(optionLabel || '').trim();
        if (!raw) return '';

        const rows = getMainStatRows(slotId);
        if (!rows.length) return '';

        const exact = rows.find((row) => String((row && row[0]) || '').trim() === raw);
        if (exact && exact[0]) return String(exact[0]).trim();

        const canonicalRaw = toCanonicalStatKey(raw);
        if (!canonicalRaw) return '';

        const byCanonical = rows.find((row) => {
            const label = String((row && row[0]) || '').trim();
            return label && toCanonicalStatKey(label) === canonicalRaw;
        });
        if (byCanonical && byCanonical[0]) return String(byCanonical[0]).trim();

        return '';
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
            if (slot.id !== 'uni') {
                slotState.mainOption = normalizeMainOptionForSlot(slot.id, slotState.mainOption);
            }
            if (slot.id !== 'uni' && !slotState.mainOption && mainRows.length > 0) {
                let defaultMainOption = mainRows[0][0];

                // For 일월성진, prefer Attack % on the 진(sky) slot.
                if (slot.id === 'sky' && state.subRev === '\uC77C\uC6D4\uC131\uC9C4') {
                    const attackPercentRow = mainRows.find((row) => toCanonicalStatKey(row && row[0]) === 'Attack %');
                    if (attackPercentRow && attackPercentRow[0]) {
                        defaultMainOption = attackPercentRow[0];
                    }
                }

                slotState.mainOption = defaultMainOption;
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

    function getDropdownManager() {
        if (dropdownManager) return dropdownManager;

        const helper = window.RevelationSettingDropdown;
        if (!helper || typeof helper.createManager !== 'function') {
            dropdownManager = {
                closeOpenDropdown: () => { },
                buildCustomDropdown: () => { }
            };
            return dropdownManager;
        }

        dropdownManager = helper.createManager({
            derivePngFromWebp
        }) || {
            closeOpenDropdown: () => { },
            buildCustomDropdown: () => { }
        };

        return dropdownManager;
    }

    function closeOpenDropdown() {
        const manager = getDropdownManager();
        manager.closeOpenDropdown();
    }

    function buildCustomDropdown(config) {
        const manager = getDropdownManager();
        manager.buildCustomDropdown(config);
    }

    function setCharacterPanelOpen(isOpen) {
        if (!dom.characterPanel || !dom.characterPill) return;
        const nextOpen = !state.selectedCharacter ? true : !!isOpen;
        dom.characterPanel.hidden = !nextOpen;
        if (dom.editorPanel) {
            dom.editorPanel.hidden = nextOpen;
        }
        if (dom.statsSummary) {
            if (nextOpen) {
                dom.statsSummary.hidden = true;
                if (dom.tierSummaryCard) dom.tierSummaryCard.hidden = true;
            } else {
                renderStatsSummary();
            }
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

    function getCharacterUiController() {
        if (characterUiController) return characterUiController;

        const helper = window.RevelationSettingCharacterUI;
        if (!helper || typeof helper.createController !== 'function') {
            characterUiController = {
                updateCharacterFilterResetState: () => { },
                renderCharacterFilterUI: () => { },
                renderCharacterList: () => { },
                renderCharacterSelector: () => { },
                renderTopSelectorIcons: () => { }
            };
            return characterUiController;
        }

        characterUiController = helper.createController({
            state,
            dom,
            t,
            escapeHtml,
            elementOrder: ELEMENT_ORDER,
            positionOrder: POSITION_ORDER,
            getCharacterLabel,
            getCharacterImagePath,
            getSlotIconPath,
            getSubSlotIds,
            hasCharacterModifiedSetting,
            handleCharacterSelection,
            setCharacterPanelOpen,
            loadCharacterNames
        }) || {
            updateCharacterFilterResetState: () => { },
            renderCharacterFilterUI: () => { },
            renderCharacterList: () => { },
            renderCharacterSelector: () => { },
            renderTopSelectorIcons: () => { }
        };

        return characterUiController;
    }

    function updateCharacterFilterResetState() {
        const controller = getCharacterUiController();
        controller.updateCharacterFilterResetState();
    }

    function renderCharacterFilterUI() {
        const controller = getCharacterUiController();
        controller.renderCharacterFilterUI();
    }

    function renderCharacterList() {
        const controller = getCharacterUiController();
        controller.renderCharacterList();
    }

    function renderCharacterSelector() {
        const controller = getCharacterUiController();
        controller.renderCharacterSelector();
    }

    function renderTopSelectorIcons() {
        const controller = getCharacterUiController();
        controller.renderTopSelectorIcons();
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

    function isGlobalPresetId(presetId) {
        const id = String(presetId || '').trim();
        return id.indexOf(GLOBAL_PRESET_ID_PREFIX) === 0;
    }

    function buildGlobalPresetId(sourcePresetId) {
        const sourceId = String(sourcePresetId || '').trim();
        if (!sourceId) return '';
        return `${GLOBAL_PRESET_ID_PREFIX}${encodeURIComponent(sourceId)}`;
    }

    function normalizePresetLabelForCompare(value) {
        return String(value || '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    function buildDuplicatePresetName(sourcePresetId) {
        const sourceId = String(sourcePresetId || '').trim();
        const baseLabel = sanitizePresetName(getPresetLabel(sourceId) || getDefaultPresetLabel(sourceId))
            || t('preset_default', 'Default');
        const copySuffix = sanitizePresetName(t('preset_copy_suffix', 'copy')) || 'copy';

        const existingLabels = new Set(
            state.presetOrder
                .filter((presetId) => presetId !== sourceId)
                .map((presetId) => normalizePresetLabelForCompare(getPresetLabel(presetId)))
                .filter(Boolean)
        );

        let candidate = sanitizePresetName(`${baseLabel} ${copySuffix}`);
        if (candidate && !existingLabels.has(normalizePresetLabelForCompare(candidate))) {
            return candidate;
        }

        for (let n = 2; n < 1000; n += 1) {
            candidate = sanitizePresetName(`${baseLabel} ${copySuffix} ${n}`);
            if (!candidate) continue;
            if (!existingLabels.has(normalizePresetLabelForCompare(candidate))) {
                return candidate;
            }
        }

        return sanitizePresetName(`${baseLabel} ${copySuffix} ${Date.now()}`) || baseLabel;
    }

    function createPresetFromBuild(sourceBuild, customName) {
        if (isSharedReadonlyMode()) return false;
        if (!state.selectedCharacter) return false;

        ensurePresetState();

        if (state.presetOrder.length >= PRESET_MAX_COUNT) {
            showToast(t('msg_preset_limit_reached', 'You can add up to 20 presets per character.'), 'error');
            return false;
        }

        syncActivePresetFromEditorState();

        const nextId = getNextPresetId();
        state.presetMap[nextId] = clonePackedBuild(sourceBuild || createEmptyPackedBuild());
        state.presetOrder.push(nextId);

        const nextName = sanitizePresetName(customName);
        if (nextName && nextName !== getDefaultPresetLabel(nextId)) {
            state.presetNameMap[nextId] = nextName;
        } else {
            delete state.presetNameMap[nextId];
        }

        state.activePresetId = nextId;

        applyPackedBuildToEditorState(state.presetMap[nextId]);
        persistSelectedCharacterSetting();

        renderPresetDropdown();
        renderMainRevelationDropdown();
        renderSubRevelationDropdown();
        renderSlotCards();
        renderPreview();
        return true;
    }

    function deletePreset(targetPresetId) {
        if (isSharedReadonlyMode()) return false;
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
        if (isSharedReadonlyMode()) return;
        const targetPresetId = String(presetId || '').trim();
        if (!targetPresetId || !state.presetMap[targetPresetId]) return;
        if (isGlobalPresetId(targetPresetId)) return;

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
        if (isSharedReadonlyMode()) return;
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

    async function buildRecommendedPackedBuild(characterName) {
        const selectedName = String(characterName || '').trim();
        if (!selectedName) return createEmptyPackedBuild();

        const snapshot = serializeCurrentCharacterSetting();

        try {
            state.mainRev = '';
            state.subRev = '';
            state.slots = createInitialSlotState();
            await applyAutoRevelation(selectedName);
            ensureSlotDefaults();
            return sanitizePackedBuild(serializeCurrentCharacterSetting());
        } catch (error) {
            console.warn('[revelation-setting] failed to build recommended preset:', error);
            return createEmptyPackedBuild();
        } finally {
            applyPackedBuildToEditorState(snapshot);
        }
    }

    async function handleAddPreset() {
        if (isSharedReadonlyMode()) return;
        if (!state.selectedCharacter) return;

        closeOpenDropdown();
        const recommendedBuild = await buildRecommendedPackedBuild(state.selectedCharacter);
        createPresetFromBuild(recommendedBuild, '');
    }

    function handleDuplicatePreset(presetId) {
        if (isSharedReadonlyMode()) return;
        const sourceId = String(presetId || '').trim();
        if (!sourceId || !state.presetMap[sourceId]) return;

        closeOpenDropdown();
        ensurePresetState();
        syncActivePresetFromEditorState();

        const sourceBuild = state.presetMap[sourceId] || createEmptyPackedBuild();
        const duplicateName = buildDuplicatePresetName(sourceId);
        createPresetFromBuild(sourceBuild, duplicateName);
    }

    function renderPresetDropdown() {
        if (!dom.presetHost) return;

        ensurePresetState();

        const renameLabel = t('button_preset_rename', 'Rename');
        const duplicateLabel = t('button_preset_duplicate', 'Duplicate');
        const items = state.presetOrder.map((presetId) => ({
            value: presetId,
            label: getPresetLabel(presetId),
            icon: '',
            actions: [
                {
                    type: 'rename',
                    label: renameLabel,
                    iconText: '✎'
                },
                {
                    type: 'duplicate',
                    label: duplicateLabel,
                    iconText: '⧉'
                }
            ]
        }));

        items.forEach((item) => {
            if (!isGlobalPresetId(item.value)) return;
            const actions = Array.isArray(item.actions) ? item.actions : [];
            item.actions = actions.filter((action) => String((action && action.type) || '') !== 'rename');
        });

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
            disabled: !state.selectedCharacter || isSharedReadonlyMode(),
            onChange: (value) => {
                if (isSharedReadonlyMode()) return;
                if (value === PRESET_ADD_ACTION) {
                    handleAddPreset();
                    return;
                }
                handlePresetSelection(value);
            },
            onItemAction: (value, actionType) => {
                if (isSharedReadonlyMode()) return;
                if (actionType === 'rename' && value && value !== PRESET_ADD_ACTION) {
                    if (isGlobalPresetId(value)) return;
                    openPresetRenameModal(value);
                    return;
                }
                if (actionType === 'duplicate' && value && value !== PRESET_ADD_ACTION) {
                    handleDuplicatePreset(value);
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
            disabled: !state.selectedCharacter || options.length === 0 || isSharedReadonlyMode(),
            onChange: (value) => {
                if (isSharedReadonlyMode()) return;
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
            disabled: !state.selectedCharacter || !state.mainRev || options.length === 0 || isSharedReadonlyMode(),
            onChange: (value) => {
                if (isSharedReadonlyMode()) return;
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

    function getStorageKeyModified(characterName) {
        const helper = window.RevelationSettingModifiedStore;
        if (helper && typeof helper.buildKey === 'function') {
            return helper.buildKey(characterName);
        }
        return `${STORAGE_PREFIX_MODIFIED_FALLBACK}${encodeURIComponent(String(characterName || '').trim())}`;
    }

    function setCharacterModifiedFlag(characterName, modified) {
        const name = String(characterName || '').trim();
        if (!name) return;

        const isModified = !!modified;
        state.characterModificationCache.set(name, isModified);
        updateCharacterModifiedDotInList(name, isModified);

        const helper = window.RevelationSettingModifiedStore;
        if (helper && typeof helper.setFlag === 'function') {
            helper.setFlag(name, isModified);
            return;
        }

        if (typeof window.localStorage === 'undefined') return;
        try {
            const key = getStorageKeyModified(name);
            if (isModified) window.localStorage.setItem(key, '1');
            else window.localStorage.removeItem(key);
            window.localStorage.removeItem(`${STORAGE_PREFIX_MODIFIED_LEGACY}${encodeURIComponent(name)}`);
        } catch (_) { }
    }

    function hasCharacterModifiedSetting(characterName) {
        const name = String(characterName || '').trim();
        if (!name) return false;

        if (state.characterModificationCache.has(name)) {
            return !!state.characterModificationCache.get(name);
        }

        let isModified = false;

        const helper = window.RevelationSettingModifiedStore;
        if (helper && typeof helper.getFlag === 'function') {
            isModified = !!helper.getFlag(name);
        } else if (typeof window.localStorage !== 'undefined') {
            try {
                const modifiedFlag = window.localStorage.getItem(getStorageKeyModified(name));
                isModified = modifiedFlag === '1';
            } catch (_) {
                isModified = false;
            }
        }

        state.characterModificationCache.set(name, isModified);
        return isModified;
    }

    function updateCharacterModifiedDotInList(characterName, isModified) {
        if (!dom.characterList) return;
        const name = String(characterName || '').trim();
        if (!name) return;

        const items = dom.characterList.querySelectorAll('.rs-character-item');
        items.forEach((item) => {
            if (String(item.getAttribute('data-character') || '') !== name) return;
            const existingDot = item.querySelector('.rs-character-modified-dot');

            if (isModified) {
                if (!existingDot) {
                    const modifiedDot = document.createElement('span');
                    modifiedDot.className = 'rs-character-modified-dot';
                    modifiedDot.setAttribute('aria-hidden', 'true');
                    item.appendChild(modifiedDot);
                }
            } else if (existingDot) {
                existingDot.remove();
            }
        });
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

            slotState.mainOption = normalizeMainOptionForSlot(slot.id, slotPacked[0]);
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

    function persistSelectedCharacterSetting(options) {
        if (isSharedReadonlyMode()) return;
        const name = String(state.selectedCharacter || '').trim();
        if (!name || typeof window.localStorage === 'undefined') return;

        const opts = (options && typeof options === 'object') ? options : {};
        const shouldMarkModified = opts.markModified !== false;

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
            if (shouldMarkModified) {
                setCharacterModifiedFlag(name, true);
            } else {
                state.characterModificationCache.delete(name);
            }
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
        label.textContent = optionLabel
            ? translateSubStatOption(optionLabel)
            : t('label_none', '-');
        labelWrap.appendChild(label);

        const value = document.createElement('strong');
        value.className = 'rs-main-value-row-value';
        value.textContent = valueLabel || t('label_none', '-');

        row.appendChild(labelWrap);
        row.appendChild(value);
        return row;
    }

    function createMainPairValueRow(primaryOption, primaryValue, secondaryOption, secondaryValue, primaryHighlighted, secondaryHighlighted) {
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

        const primaryLabel = document.createElement('span');
        primaryLabel.className = 'rs-main-pair-token' + (primaryHighlighted ? ' is-highlight' : '');
        primaryLabel.textContent = primaryOption
            ? translateSubStatOption(primaryOption)
            : t('label_none', '-');

        const divider = document.createElement('span');
        divider.className = 'rs-main-pair-divider';
        divider.textContent = ' / ';

        const secondaryLabel = document.createElement('span');
        secondaryLabel.className = 'rs-main-pair-token' + (secondaryHighlighted ? ' is-highlight' : '');
        secondaryLabel.textContent = secondaryOption
            ? translateSubStatOption(secondaryOption)
            : t('label_none', '-');

        labelWrap.appendChild(primaryLabel);
        labelWrap.appendChild(divider);
        labelWrap.appendChild(secondaryLabel);

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
            const firstHighlighted = isMinimumTargetStatLabel(first.option);
            const secondHighlighted = isMinimumTargetStatLabel(second.option);
            const pairRow = createMainPairValueRow(first.option, first.value, second.option, second.value, firstHighlighted, secondHighlighted);
            if (isMinimumTargetStatLabel(first.option) || isMinimumTargetStatLabel(second.option)) {
                pairRow.classList.add('rs-minstat-highlight');
            }
            card.appendChild(pairRow);
        } else if (slot.id === 'sun') {
            const mainFixedList = document.createElement('div');
            mainFixedList.className = 'rs-main-fixed-list';
            mainDisplayRows.forEach((row) => {
                const mainRow = createMainValueRow(row.option, row.value);
                if (isMinimumTargetStatLabel(row.option)) {
                    mainRow.classList.add('rs-minstat-highlight');
                }
                mainFixedList.appendChild(mainRow);
            });
            card.appendChild(mainFixedList);
        } else {
            const mainInlineRow = document.createElement('div');
            mainInlineRow.className = 'rs-main-inline-row';
            if (isMinimumTargetStatLabel(mainDisplayRows[0] && mainDisplayRows[0].option)) {
                mainInlineRow.classList.add('rs-minstat-highlight');
            }

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
                label: translateSubStatOption(row[0]),
                icon: getStatIconPath(row[0])
            }));

            buildCustomDropdown({
                host: mainDropdownHost,
                items: mainItems,
                value: slotState.mainOption,
                placeholder: t('placeholder_select_main_option', 'Select main option'),
                includeEmptyOption: false,
                disabled: mainItems.length === 0 || isSharedReadonlyMode(),
                onChange: (value) => {
                    if (isSharedReadonlyMode()) return;
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
            if (isMinimumTargetStatLabel(subRowState.option)) {
                rowEl.classList.add('rs-minstat-highlight');
            }

            const subDropdownHost = document.createElement('div');
            subDropdownHost.className = 'rs-dropdown-host';

            buildCustomDropdown({
                host: subDropdownHost,
                items: subOptions,
                value: subRowState.option,
                placeholder: t('label_none', '-'),
                includeEmptyOption: true,
                disabled: subOptions.length === 0 || isSharedReadonlyMode(),
                onChange: (value) => {
                    if (isSharedReadonlyMode()) return;
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
            valueInput.disabled = isSharedReadonlyMode();
            valueInput.addEventListener('input', (event) => {
                if (isSharedReadonlyMode()) return;
                subRowState.value = String(event.target.value || '');
                persistSelectedCharacterSetting();
                renderPreview();
            });
            valueInput.addEventListener('blur', (event) => {
                if (isSharedReadonlyMode()) return;
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
            upgradeInput.disabled = isSharedReadonlyMode();

            const upgradeWrap = document.createElement('div');
            upgradeWrap.className = 'rs-sub-upgrade-wrap';

            const upgradeBadge = document.createElement('span');
            upgradeBadge.className = 'rs-sub-upgrade-badge';

            const upgradeBadgeIcon = document.createElement('img');
            upgradeBadgeIcon.className = 'rs-sub-upgrade-badge-icon';
            upgradeBadgeIcon.src = getUpgradeArrowIconPath();
            upgradeBadgeIcon.alt = '';

            const upgradeBadgeValue = document.createElement('span');
            upgradeBadgeValue.className = 'rs-sub-upgrade-badge-value';

            upgradeBadge.appendChild(upgradeBadgeIcon);
            upgradeBadge.appendChild(upgradeBadgeValue);

            function syncUpgradeBadge() {
                const upgradeNum = parseUpgradeValue(subRowState.upgrades);
                upgradeWrap.classList.toggle('has-upgrade', upgradeNum > 0);
                upgradeWrap.classList.toggle('is-zero', upgradeNum === 0);
                upgradeBadgeValue.textContent = upgradeNum > 0 ? String(upgradeNum) : '';
            }

            upgradeInput.addEventListener('input', (event) => {
                if (isSharedReadonlyMode()) return;
                const normalized = normalizeUpgradeInput(event.target.value);
                subRowState.upgrades = normalized;
                event.target.value = normalized;
                syncUpgradeBadge();
                persistSelectedCharacterSetting();
                renderPreview();
            });

            upgradeWrap.appendChild(upgradeInput);
            upgradeWrap.appendChild(upgradeBadge);
            syncUpgradeBadge();

            rowEl.appendChild(subDropdownHost);
            rowEl.appendChild(upgradeWrap);
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
                        const attackOption = attackRow.option || '';
                        const defenseOption = defenseRow.option || '';
                        const attackLabel = attackOption
                            ? translateSubStatOption(attackOption)
                            : t('sub_attack', 'Attack');
                        const defenseLabel = defenseOption
                            ? translateSubStatOption(defenseOption)
                            : t('sub_defense', 'Defense');
                        const attackValue = attackRow.value || labelNone;
                        const defenseValue = defenseRow.value || labelNone;
                        const attackIcon = getStatIconPath(attackOption);
                        const defenseIcon = getStatIconPath(defenseOption);

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
                        const optionLabel = row.option ? translateSubStatOption(row.option) : labelNone;
                        return `
                            <div class="rs-preview-main-option">
                                <span class="rs-preview-sub-option">
                                    ${icon ? `<img src="${escapeHtml(icon)}" alt="">` : ''}
                                    <span>${escapeHtml(optionLabel)}</span>
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
                const upgradeIconPath = getUpgradeArrowIconPath();
                const upgradeBadgeHtml = upgradeNum > 0
                    ? `
                        <span class="rs-preview-sub-upgrade rs-preview-sub-upgrade-badge">
                            <img class="rs-preview-sub-upgrade-icon" src="${escapeHtml(upgradeIconPath)}" alt="">
                            <span class="rs-preview-sub-upgrade-value">${escapeHtml(String(upgradeNum))}</span>
                        </span>
                    `
                    : '<span class="rs-preview-sub-upgrade rs-preview-sub-upgrade-empty" aria-hidden="true"></span>';
                const optionIcon = row.option ? getStatIconPath(row.option) : '';

                return `
                    <div class="rs-preview-sub-item">
                        <span class="rs-preview-sub-option">
                            ${optionIcon ? `<img src="${escapeHtml(optionIcon)}" alt="">` : ''}
                            <span>${escapeHtml(optionLabel)}</span>
                        </span>
                        ${upgradeBadgeHtml}
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
            const tierController = getTierEstimatorController();
            if (tierController && typeof tierController.renderInto === 'function') {
                tierController.renderInto(dom.tierSummaryCard, null, {});
            }
            dom.statsSummary.hidden = true;
            if (dom.tierSummaryCard) dom.tierSummaryCard.hidden = true;
            return;
        }

        var totals = {};
        var mainTotals = {};
        var subTotals = {};
        function addToMap(targetMap, name, value) {
            var key = toCanonicalStatKey(name);
            if (!key) return;

            var valueText = String(value || '');
            var num = parseFloat(valueText.replace(/[^0-9.\-]/g, ''));
            if (!Number.isFinite(num) || num === 0) return;

            if (!targetMap[key]) {
                targetMap[key] = { value: 0, isPercent: false };
            }
            if (valueText.indexOf('%') !== -1 || PERCENT_STAT_CANONICAL.has(key)) {
                targetMap[key].isPercent = true;
            }
            targetMap[key].value += num;
        }

        function addStat(name, value) {
            addToMap(totals, name, value);
        }

        SLOT_CONFIG.forEach(function (slot) {
            var slotState = state.slots[slot.id];
            if (!slotState) return;

            var mainRows = getMainDisplayRows(slot.id, slotState.mainOption);
            mainRows.forEach(function (row) {
                addStat(row.option, row.value);
                addToMap(mainTotals, row.option, row.value);
            });

            slotState.subs.forEach(function (sub) {
                addStat(sub.option, sub.value);
                addToMap(subTotals, sub.option, sub.value);
            });
        });

        const tierController = getTierEstimatorController();
        if (tierController && typeof tierController.buildSummaryEstimate === 'function' && typeof tierController.renderInto === 'function') {
            const estimateData = tierController.buildSummaryEstimate(state);
            tierController.renderInto(dom.tierSummaryCard, estimateData, {
                t,
                escapeHtml,
                getStatIconPath,
                translateSubStatOption,
                minimumStatTargetSet: state.minimumStatsTargetSet,
                isMinimumTargetStat: (key) => state.minimumStatsTargetSet.has(toCanonicalStatKey(key)),
                statTotals: totals,
                mainTotals,
                subTotals
            });
        }

        dom.statsSummary.hidden = true;
        if (dom.tierSummaryCard) {
            dom.tierSummaryCard.hidden = false;
        }
    }

    function getCaptureController() {
        if (captureController) return captureController;

        const helper = window.RevelationSettingCapture;
        if (!helper || typeof helper.createController !== 'function') {
            captureController = {};
            return captureController;
        }

        captureController = helper.createController({
            state,
            dom,
            t,
            showToast,
            parseUpgradeValue
        }) || {};

        return captureController;
    }

    function getTierEstimatorController() {
        if (tierEstimatorController) return tierEstimatorController;

        const helper = window.RevelationSettingTierEstimator;
        if (!helper || typeof helper.createController !== 'function') {
            tierEstimatorController = {};
            return tierEstimatorController;
        }

        tierEstimatorController = helper.createController({
            baseUrl: state.baseUrl,
            version: state.version,
            getStatsData: () => state.statsData,
            toCanonicalStatKey,
            parseUpgradeValue
        }) || {};

        return tierEstimatorController;
    }

    async function handleDownloadPng() {
        const controller = getCaptureController();
        if (!controller || typeof controller.handleDownloadPng !== 'function') return;
        await controller.handleDownloadPng();
    }

    async function handleCopyPng() {
        const controller = getCaptureController();
        if (!controller || typeof controller.handleCopyPng !== 'function') return;
        await controller.handleCopyPng();
    }

    function getStorageUtilsHelper() {
        const helper = window.RevelationSettingStorageUtils;
        return (helper && typeof helper === 'object') ? helper : null;
    }

    function isRevelationSettingStorageKey(key) {
        const helper = getStorageUtilsHelper();
        if (helper && typeof helper.isStorageKey === 'function') {
            return helper.isStorageKey(key, {
                storagePrefixV1: STORAGE_PREFIX_V1,
                storagePrefixV2: STORAGE_PREFIX_V2,
                storagePrefixModifiedFallback: STORAGE_PREFIX_MODIFIED_FALLBACK,
                storagePrefixModifiedLegacy: STORAGE_PREFIX_MODIFIED_LEGACY,
                modifiedHelper: window.RevelationSettingModifiedStore
            });
        }

        const text = String(key || '');
        const modifiedHelper = window.RevelationSettingModifiedStore;
        const isModifiedKey = modifiedHelper && typeof modifiedHelper.isModifiedKey === 'function'
            ? !!modifiedHelper.isModifiedKey(text)
            : (text.indexOf(STORAGE_PREFIX_MODIFIED_FALLBACK) === 0 || text.indexOf(STORAGE_PREFIX_MODIFIED_LEGACY) === 0);

        return text.indexOf(STORAGE_PREFIX_V1) === 0
            || text.indexOf(STORAGE_PREFIX_V2) === 0
            || isModifiedKey;
    }

    function collectRevelationSettingStorageEntries() {
        if (typeof window.localStorage === 'undefined') return {};

        const helper = getStorageUtilsHelper();
        if (helper && typeof helper.collectEntries === 'function') {
            return helper.collectEntries({
                storage: window.localStorage,
                isStorageKeyFn: isRevelationSettingStorageKey
            });
        }

        const entries = {};
        for (let i = 0; i < window.localStorage.length; i += 1) {
            const key = window.localStorage.key(i);
            if (!isRevelationSettingStorageKey(key)) continue;
            entries[key] = String(window.localStorage.getItem(key) || '');
        }
        return entries;
    }

    function clearRevelationSettingStorageEntries() {
        if (typeof window.localStorage === 'undefined') return;

        const helper = getStorageUtilsHelper();
        if (helper && typeof helper.clearEntries === 'function') {
            helper.clearEntries({
                storage: window.localStorage,
                isStorageKeyFn: isRevelationSettingStorageKey
            });
            state.characterModificationCache.clear();
            return;
        }

        const removeKeys = [];
        for (let i = 0; i < window.localStorage.length; i += 1) {
            const key = window.localStorage.key(i);
            if (!isRevelationSettingStorageKey(key)) continue;
            removeKeys.push(key);
        }
        removeKeys.forEach((key) => {
            window.localStorage.removeItem(key);
        });
        state.characterModificationCache.clear();
    }

    function normalizeBackupEntries(payload) {
        const helper = getStorageUtilsHelper();
        if (helper && typeof helper.normalizeBackupEntries === 'function') {
            return helper.normalizeBackupEntries(payload, {
                isStorageKeyFn: isRevelationSettingStorageKey
            });
        }

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

    async function loadGlobalPresetMap() {
        state.globalPresetMap = {};

        const helper = window.RevelationSettingGlobalPresets;
        if (!helper || typeof helper.loadGlobalPresetMap !== 'function') {
            return;
        }

        state.globalPresetMap = await helper.loadGlobalPresetMap({
            baseUrl: state.baseUrl || '',
            sourcePath: GLOBAL_PRESET_SOURCE_PATH,
            version: state.version || '',
            keyword: GLOBAL_PRESET_NAME_KEYWORD,
            storagePrefixV2: STORAGE_PREFIX_V2,
            defaultPresetId: DEFAULT_PRESET_ID,
            presetAddAction: PRESET_ADD_ACTION,
            decodeStoragePayload,
            normalizePresetStorePayload,
            sanitizePresetName,
            clonePackedBuild,
            buildGlobalPresetId,
            isGlobalPresetId,
            normalizeBackupEntries,
            onStatus: (status) => {
                if (status !== 404) {
                    console.warn('[revelation-setting] global preset load failed:', status);
                }
            },
            onError: (error) => {
                console.warn('[revelation-setting] global preset load failed:', error);
            }
        });
    }

    function mergeGlobalPresetsForCharacter(characterName) {
        const name = String(characterName || '').trim();
        if (!name) return false;

        const globalPresets = state.globalPresetMap && Array.isArray(state.globalPresetMap[name])
            ? state.globalPresetMap[name]
            : [];
        if (!globalPresets.length) return false;

        ensurePresetState();

        const usedIds = new Set();
        const usedNames = new Set();

        // Rebuild global presets from source so legacy duplicates do not accumulate.
        const retainedOrder = [];
        state.presetOrder.forEach((presetId) => {
            const id = String(presetId || '').trim();
            if (!isGlobalPresetId(id)) {
                retainedOrder.push(id);
                return;
            }
            delete state.presetMap[id];
            delete state.presetNameMap[id];
        });
        state.presetOrder = retainedOrder.length ? retainedOrder : [DEFAULT_PRESET_ID];

        // Reserve existing local names to avoid local/global duplicate labels.
        state.presetOrder.forEach((presetId) => {
            const id = String(presetId || '').trim();
            if (!id) return;
            const existingName = sanitizePresetName(state.presetNameMap[id]);
            const normalizedExistingName = normalizePresetLabelForCompare(existingName);
            if (normalizedExistingName) {
                usedNames.add(normalizedExistingName);
            }
        });

        globalPresets.forEach((item) => {
            if (!item || typeof item !== 'object') return;

            const presetId = String(item.id || '').trim();
            if (!presetId || presetId === DEFAULT_PRESET_ID || presetId === PRESET_ADD_ACTION) return;
            if (usedIds.has(presetId)) return;

            const packedBuild = clonePackedBuild(item.build);
            const customName = sanitizePresetName(item.name);
            const normalizedName = normalizePresetLabelForCompare(customName);
            if (!customName || !normalizedName || usedNames.has(normalizedName)) return;

            if (state.presetOrder.length >= PRESET_MAX_COUNT) return;
            state.presetOrder.push(presetId);
            usedIds.add(presetId);
            usedNames.add(normalizedName);

            state.presetMap[presetId] = packedBuild;
            state.presetNameMap[presetId] = customName;
        });

        const normalized = normalizePresetStorePayload({
            v: 2,
            active: state.activePresetId,
            order: state.presetOrder,
            map: state.presetMap,
            names: state.presetNameMap
        });

        if (!normalized) return false;
        applyPresetStoreToState(normalized);
        return true;
    }

    function getShareBackupController() {
        if (shareBackupController) return shareBackupController;

        const helper = window.RevelationSettingShareBackup;
        if (!helper || typeof helper.createController !== 'function') {
            shareBackupController = {};
            return shareBackupController;
        }

        shareBackupController = helper.createController({
            state,
            dom,
            t,
            showToast,
            clearError,
            collectRevelationSettingStorageEntries,
            clearRevelationSettingStorageEntries,
            normalizeBackupEntries,
            handleCharacterSelection,
            renderPresetDropdown,
            renderMainRevelationDropdown,
            renderSubRevelationDropdown,
            renderSlotCards,
            renderPreview,
            renderCharacterSelector,
            syncActivePresetFromEditorState,
            clonePackedBuild,
            createEmptyPackedBuild,
            normalizePresetStorePayload,
            applyPresetStoreToState,
            applyPackedBuildToEditorState,
            ensureSlotDefaults,
            createInitialSlotState,
            setCharacterPanelOpen,
            defaultPresetId: DEFAULT_PRESET_ID,
            sharePayloadVersion: SHARE_PAYLOAD_VERSION,
            shareQueryKey: SHARE_QUERY_KEY,
            gasUrl: GAS_URL
        }) || {};

        return shareBackupController;
    }

    async function handleBackupExport() {
        const controller = getShareBackupController();
        if (!controller || typeof controller.handleBackupExport !== 'function') return;
        await controller.handleBackupExport();
    }

    async function handleBackupImportFromFile(file) {
        const controller = getShareBackupController();
        if (!controller || typeof controller.handleBackupImportFromFile !== 'function') return;
        await controller.handleBackupImportFromFile(file);
    }

    function handleBackupImportClick() {
        const controller = getShareBackupController();
        if (!controller || typeof controller.handleBackupImportClick !== 'function') return;
        controller.handleBackupImportClick();
    }

    async function tryLoadSharedFromUrl() {
        const controller = getShareBackupController();
        if (!controller || typeof controller.tryLoadSharedFromUrl !== 'function') return false;
        return controller.tryLoadSharedFromUrl();
    }

    async function handleShareClick() {
        const controller = getShareBackupController();
        if (!controller || typeof controller.handleShareClick !== 'function') return;
        await controller.handleShareClick();
    }

    async function handleCharacterSelection(characterName) {
        const selected = String(characterName || '').trim();
        state.selectedCharacter = selected;
        clearError();

        if (!selected) {
            state.mainRev = '';
            state.subRev = '';
            state.slots = createInitialSlotState();
            state.minimumStatsTargetSet = new Set();
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

        try {
            await loadCharacterSetting(selected);
        } catch (_) { }
        updateMinimumStatsTargetSet(selected);

        const modifiedBeforeSelect = hasCharacterModifiedSetting(selected);
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
        mergeGlobalPresetsForCharacter(selected);

        persistSelectedCharacterSetting({ markModified: false });
        setCharacterModifiedFlag(selected, restored ? modifiedBeforeSelect : false);

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
                if (isSharedReadonlyMode()) return;
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
                if (isSharedReadonlyMode()) return;
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
            dom.loadBtn.addEventListener('click', () => {
                if (isSharedReadonlyMode()) return;
                handleBackupImportClick();
            });
        }
        if (dom.backupFileInput) {
            dom.backupFileInput.addEventListener('change', (event) => {
                if (isSharedReadonlyMode()) return;
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
            window.Navigation.load('revelation-setting');
        } else if (typeof Navigation !== 'undefined' && Navigation && typeof Navigation.load === 'function') {
            Navigation.load('revelation-setting');
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
        dom.tierSummaryCard = document.getElementById('rsTierSummaryCard');
    }

    function applySharedReadonlyUi() {
        const readonly = isSharedReadonlyMode();
        if (dom.characterPill) {
            dom.characterPill.classList.toggle('is-disabled', readonly);
            dom.characterPill.setAttribute('aria-disabled', readonly ? 'true' : 'false');
        }
        if (dom.characterSearchInput) {
            dom.characterSearchInput.disabled = readonly;
        }
        if (dom.loadBtn) {
            dom.loadBtn.disabled = readonly;
            dom.loadBtn.style.opacity = readonly ? '0.6' : '';
        }
        if (dom.backupFileInput && readonly) {
            dom.backupFileInput.value = '';
        }
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
            const tierController = getTierEstimatorController();
            if (tierController && typeof tierController.load === 'function') {
                await tierController.load();
            }
            await loadRevelationData();
            await loadCharacterNames();
            await loadGlobalPresetMap();

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
            state.readonlyBySharedLink = !!sharedLoaded;
            applySharedReadonlyUi();
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
