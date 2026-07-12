export const MIKU_CHARACTER = '미쿠';

export const MIKU_MUSIC_KEYS = {
    HEAVEN: 'H',
    GHOST_RULE: '고',
    PLAY_WITH_FIRE: '불',
    SPRING_STORM: '춘'
};

const MUSIC_ICON_MAP = {
    H: 'music_HEAVEN.png',
    '고': 'music_고스트룰.png',
    '불': 'music_불장난.png',
    '춘': 'music_춘람.png'
};

const MUSIC_NAME_MAP = {
    kr: {
        H: 'Heaven',
        '고': '고스트 룰(ゴーストルール)',
        '불': '불장난(ヒアソビ)',
        '춘': '춘람(春嵐)'
    },
    en: {
        H: 'Heaven',
        '고': 'Ghost Rule',
        '불': 'Play-With-Fire',
        '춘': 'Spring Storm'
    },
    jp: {
        H: 'Ｈｅａｖｅｎ',
        '고': 'ゴーストルール',
        '불': 'ヒアソビ',
        '춘': '春嵐'
    },
    cn: {
        H: 'Heaven',
        '고': '幽灵法则',
        '불': '玩火',
        '춘': '春岚'
    }
};

const UI_LABELS = {
    kr: {
        music: '음악',
        notSelected: '선택 안함'
    },
    en: {
        music: 'Music',
        notSelected: 'Not selected'
    },
    jp: {
        music: '楽曲',
        notSelected: '選択なし'
    },
    cn: {
        music: '音乐',
        notSelected: '未选择'
    }
};

function getCurrentLang() {
    if (typeof window !== 'undefined') {
        if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
            return window.I18nService.getCurrentLanguage();
        }
        if (window.DataLoader && typeof window.DataLoader.getCurrentLang === 'function') {
            return window.DataLoader.getCurrentLang();
        }
    }
    return 'kr';
}

export function getMikuMusicUILabel(key, fallback = '') {
    const lang = getCurrentLang();
    return (UI_LABELS[lang] && UI_LABELS[lang][key]) || (UI_LABELS.kr && UI_LABELS.kr[key]) || fallback || key;
}

export function getMikuMusicName(musicKey, lang = getCurrentLang()) {
    const names = MUSIC_NAME_MAP[lang] || MUSIC_NAME_MAP.kr;
    return names[musicKey] || (MUSIC_NAME_MAP.kr && MUSIC_NAME_MAP.kr[musicKey]) || musicKey;
}

export function getMikuMusicIconUrl(musicKey, baseUrl = '') {
    const fileName = MUSIC_ICON_MAP[musicKey];
    if (!fileName) return '';
    return `${baseUrl}/data/characters/${encodeURIComponent(MIKU_CHARACTER)}/${encodeURIComponent(fileName)}`;
}

export function getMikuMusicKeyFromLegacyValue(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (MUSIC_ICON_MAP[raw]) return raw;
    const lower = raw.toLowerCase();
    if (lower === 'heaven') return 'H';
    if (lower === 'ghost rule' || lower === '고스트 룰' || lower === '고스트룰') return '고';
    if (lower === 'play-with-fire' || lower === 'play with fire' || lower === '불장난') return '불';
    if (lower === 'spring storm' || lower === '춘람') return '춘';
    return '';
}

export function getSkillNumberFromAction(actionName) {
    const raw = String(actionName || '').trim();
    const match = raw.match(/^(?:스킬|Skill|スキル)\s?([1-3])$/i);
    return match ? Number.parseInt(match[1], 10) : null;
}

export function isMikuAction(characterName, actionName) {
    return String(characterName || '') === MIKU_CHARACTER && [1, 2, 3].includes(getSkillNumberFromAction(actionName));
}

export function isFixedMikuMusicAction(characterName, actionName) {
    return String(characterName || '') === MIKU_CHARACTER && getSkillNumberFromAction(actionName) === 3;
}

export function getAllowedMikuMusicKeys(characterName, actionName) {
    if (String(characterName || '') !== MIKU_CHARACTER) return [];
    const skillNumber = getSkillNumberFromAction(actionName);
    if (skillNumber === 1 || skillNumber === 2) return ['H', '춘', '불'];
    if (skillNumber === 3) return ['고'];
    return [];
}

export function normalizeMikuMusic(characterName, actionName, value) {
    const allowed = getAllowedMikuMusicKeys(characterName, actionName);
    if (allowed.length === 0) return '';
    if (allowed.length === 1 && allowed[0] === '고') return '고';

    const key = getMikuMusicKeyFromLegacyValue(value);
    return allowed.includes(key) ? key : '';
}

export function getMikuMusicOptions(characterName, actionName, baseUrl = '', options = {}) {
    const allowed = getAllowedMikuMusicKeys(characterName, actionName);
    const includeBlank = options.includeBlank !== false && !(allowed.length === 1 && allowed[0] === '고');
    const items = [];

    if (includeBlank) {
        items.push({
            label: '-',
            title: getMikuMusicUILabel('notSelected', 'Not selected'),
            value: '',
            image: ''
        });
    }

    allowed.forEach(key => {
        items.push({
            label: getMikuMusicName(key),
            title: getMikuMusicName(key),
            value: key,
            image: getMikuMusicIconUrl(key, baseUrl)
        });
    });

    return items;
}
