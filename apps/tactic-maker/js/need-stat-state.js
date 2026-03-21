/**
 * Tactic Maker V2 - Need Stat State Module
 * Global state management and utility functions for need stat card.
 */

import { DataLoader } from './data-loader.js';

// ============================================================================
// Global State
// ============================================================================

// Global elucidator bonus values (shared across all slots)
let globalElucidatorCritical = 0;
let globalElucidatorPierce = 0;

// Global boss settings (shared across all slots for pierce calculation)
let globalBossSettings = {
    bossType: 'sea', // 'sea' or 'nightmare'
    bossId: null,
    baseDefense: 855,
    defenseCoef: 263.2
};

// Global item option selections (shared across all slots)
// Key: itemId, Value: selected option value
let globalItemOptions = {};

// Global shared check states (items that sync across all character slots)
// - defense: all defense reduce items
// - pierceBuffAoe: pierce buff items with type '광역'
// - criticalBuffAoe: critical buff items with type '광역'
let globalSharedChecks = {
    defense: new Set(),
    pierceBuffAoe: new Set(),
    criticalBuffAoe: new Set()
};

// ============================================================================
// State Getters/Setters
// ============================================================================

export function getElucidatorBonuses() {
    return { critical: globalElucidatorCritical, pierce: globalElucidatorPierce };
}

export function setElucidatorBonuses(critical, pierce) {
    globalElucidatorCritical = critical;
    globalElucidatorPierce = pierce;
}

export function getGlobalBossSettings() {
    return { ...globalBossSettings };
}

export function setGlobalBossSettings(settings) {
    globalBossSettings = { ...globalBossSettings, ...settings };
}

export function getGlobalElucidatorCritical() {
    return globalElucidatorCritical;
}

export function getGlobalElucidatorPierce() {
    return globalElucidatorPierce;
}

// Global item options getters/setters
export function getGlobalItemOptions() {
    return { ...globalItemOptions };
}

export function setGlobalItemOption(itemId, optionValue) {
    globalItemOptions[String(itemId)] = optionValue;
}

export function setGlobalItemOptions(options) {
    globalItemOptions = { ...options };
}

export function getGlobalItemOption(itemId) {
    return globalItemOptions[String(itemId)];
}

// Global shared check getters/setters
export function getGlobalSharedChecks() {
    return {
        defense: new Set(globalSharedChecks.defense),
        pierceBuffAoe: new Set(globalSharedChecks.pierceBuffAoe),
        criticalBuffAoe: new Set(globalSharedChecks.criticalBuffAoe)
    };
}

export function getGlobalSharedChecksForExport() {
    return {
        defense: [...globalSharedChecks.defense],
        pierceBuffAoe: [...globalSharedChecks.pierceBuffAoe],
        criticalBuffAoe: [...globalSharedChecks.criticalBuffAoe]
    };
}

export function setGlobalSharedChecks(checks) {
    if (checks) {
        globalSharedChecks.defense = new Set(checks.defense || []);
        globalSharedChecks.pierceBuffAoe = new Set(checks.pierceBuffAoe || []);
        globalSharedChecks.criticalBuffAoe = new Set(checks.criticalBuffAoe || []);
    }
}

export function setGlobalSharedCheck(category, itemId, checked) {
    const id = String(itemId);
    if (checked) {
        globalSharedChecks[category]?.add(id);
    } else {
        globalSharedChecks[category]?.delete(id);
    }
}

export function isGlobalSharedChecked(category, itemId) {
    return globalSharedChecks[category]?.has(String(itemId)) || false;
}

// ============================================================================
// Utility Functions
// ============================================================================

export function getCurrentLang() {
    if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
        return window.I18nService.getCurrentLanguage();
    }
    return 'kr';
}

export function translateNeedStat(key, fallback = '') {
    if (typeof window.t === 'function') {
        try {
            return window.t(key, fallback);
        } catch (_) {
            // fall through
        }
    }
    if (window.I18nService && typeof window.I18nService.t === 'function') {
        const result = window.I18nService.t(key, fallback);
        if (result && result !== key) return result;
    }
    return fallback;
}

export function formatTotalPair(total) {
    const current = Number.isFinite(total) ? total : 0;
    const needed = Math.max(0, 100 - current);
    return {
        currentText: `${current.toFixed(1)}%`,
        neededText: `${needed.toFixed(1)}%`
    };
}

/**
 * Normalize text for language (e.g., 의식3 -> 의식2 for non-KR)
 */
export function normalizeTextForLang(text) {
    const lang = getCurrentLang();
    if (!text || lang === 'kr') return text || '';
    let result = String(text).replace(/의식\s*3/g, '의식2');
    const localTypeMap = lang === 'en'
        ? {
            '심상 코어': 'Mindscape Core',
            '심상코어': 'Mindscape Core',
            '스킬': 'Skill',
            '패시브': 'Passive',
            '하이라이트': 'Highlight',
            '전용무기': 'Weapon',
            '페르소나': 'Persona',
            '의식1': 'A1',
            '의식2': 'A2',
            '의식3': 'A3',
            '의식4': 'A4',
            '의식5': 'A5',
            '의식6': 'A6',
            '총기': 'Gun',
            '총격': 'Gun',
            '지원기술': 'Assist Skill',
            '광역': 'AoE',
            '단일': 'Single'
        }
        : lang === 'jp'
            ? {
                '심상 코어': 'イメジャリーコア',
                '심상코어': 'イメジャリーコア',
                '스킬': 'スキル',
                '패시브': 'パッシブ',
                '하이라이트': 'ハイライト',
                '전용무기': '専用武器',
                '페르소나': 'ペルソナ',
                '의식1': '意識1',
                '의식2': '意識2',
                '의식3': '意識3',
                '의식4': '意識4',
                '의식5': '意識5',
                '의식6': '意識6',
                '총기': '銃撃',
                '총격': '銃撃',
                '지원기술': 'サポートスキル',
                '광역': '広域',
                '단일': '単体'
            }
            : null;

    if (lang === 'en') {
        result = result.replace(/(\d+)\s*중첩/g, '$1 Stack')
                       .replace(/중첩/g, 'Stack');
    } else if (lang === 'jp') {
        result = result.replace(/(\d+)\s*중첩/g, '$1重')
                       .replace(/중첩/g, '重');
    }

    try {
        const dict = (typeof window.I18NUtils !== 'undefined' && window.I18NUtils.statTranslations && window.I18NUtils.statTranslations[lang])
            ? window.I18NUtils.statTranslations[lang]
            : null;
        if (dict && typeof dict === 'object') {
            const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            Object.keys(dict).sort((a, b) => b.length - a.length).forEach((ko) => {
                const tr = dict[ko];
                if (!tr || tr === ko) return;
                result = result.replace(new RegExp(esc(ko), 'g'), tr);
            });
        }
    } catch (_) {
        // Ignore dictionary fallback failures.
    }

    if (localTypeMap) {
        const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        Object.keys(localTypeMap).sort((a, b) => b.length - a.length).forEach((ko) => {
            result = result.replace(new RegExp(esc(ko), 'g'), localTypeMap[ko]);
        });
    }

    if (lang === 'en') {
        result = result
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
            .replace(/심상\s*코어/g, 'Mindscape Core')
            .replace(/심상/g, 'MS')
            .replace(/개조/g, 'R')
            .replace(/원소\s*이상/g, 'Elemental Ailment')
            .replace(/풍습/g, 'Windswept')
            .replace(/추가\s*효과/g, 'Additional Effect')
            .replace(/없음/g, 'None');
    } else if (lang === 'jp') {
        result = result
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
            .replace(/심상\s*코어/g, 'イメジャリーコア')
            .replace(/심상/g, 'イメジャリー')
            .replace(/개조/g, '改造')
            .replace(/원소\s*이상/g, '元素異常')
            .replace(/풍습/g, '風襲')
            .replace(/추가\s*효과/g, '追加効果')
            .replace(/없음/g, 'なし');
    }

    if (typeof window.DefenseI18N !== 'undefined' && typeof window.DefenseI18N.translateType === 'function') {
        result = window.DefenseI18N.translateType(result);
    }

    return result;
}

/**
 * Get localized source name
 */
export function getSourceDisplayName(source, baseUrl) {
    const lang = getCurrentLang();
    if (source === '공통') {
        return translateNeedStat('needStatSourceCommon', '공통');
    }
    if (source === '원더') {
        return translateNeedStat('needStatSourceWonder', '원더');
    }
    if (source === '계시') {
        return translateNeedStat('needStatSourceRevelation', '계시');
    }
    // Character name - use characterData for proper display
    const charMeta = (window.characterData || {})[source];
    if (charMeta) {
        if (lang === 'en') return charMeta.codename || source;
        if (lang === 'jp') return charMeta.name_jp || source;
        return source;
    }
    return DataLoader.getCharacterDisplayName(source) || source;
}

/**
 * Get localized skill name following critical-calc.js pattern
 */
export function getLocalizedSkillName(item, groupName = '') {
    const lang = getCurrentLang();
    const typeStr = String(item.type || '');
    const isWonder = groupName === '원더';

    // 1) 데이터에 언어별 필드가 있으면 우선 사용
    if (lang === 'en' && item.skillName_en && String(item.skillName_en).trim()) {
        return String(item.skillName_en).trim();
    }
    if (lang === 'jp' && item.skillName_jp && String(item.skillName_jp).trim()) {
        return String(item.skillName_jp).trim();
    }
    if (lang === 'kr' && item.skillName && String(item.skillName).trim()) {
        return String(item.skillName).trim();
    }

    // For 원더 전용무기, use DataLoader.getWeaponDisplayName for translation
    if (isWonder && typeStr === '전용무기' && item.skillName) {
        return DataLoader.getWeaponDisplayName(item.skillName);
    }

    // For 원더 페르소나, use DataLoader.getPersonaDisplayName for translation
    if (isWonder && typeStr === '페르소나' && item.skillName) {
        // "광목천 - 본능" 같은 형태에서 페르소나 본체 이름만 추출
        const baseName = String(item.skillName).split(/\s*-\s*/)[0].trim();
        const displayName = DataLoader.getPersonaDisplayName(baseName);
        if (item.skillName.includes('고유스킬') || item.skillName.includes('고유 스킬')) {
            const suffix = translateNeedStat('needStatUniqueSkillSuffix', ' - 고유스킬');
            return displayName + suffix;
        }
        return displayName;
    }

    // For 원더 스킬, use DataLoader.getSkillDisplayName for translation
    if (isWonder && typeStr === '스킬' && item.skillName) {
        return DataLoader.getSkillDisplayName(item.skillName);
    }

    // 3) 마지막 폴백
    if (item.skillName && String(item.skillName).trim()) {
        if (lang === 'kr') return String(item.skillName).trim();
        if (isWonder) return String(item.skillName).trim();
    }
    return '';
}

/**
 * Get localized options following defense-calc.js pattern
 */
export function getLocalizedOptions(item) {
    const lang = getCurrentLang();
    const baseOptions = Array.isArray(item.options) ? item.options : [];
    let labelOptions = baseOptions;

    if (lang === 'en' && Array.isArray(item.options_en) && item.options_en.length === baseOptions.length) {
        labelOptions = item.options_en;
    } else if (lang === 'jp' && Array.isArray(item.options_jp) && item.options_jp.length === baseOptions.length) {
        labelOptions = item.options_jp;
    }

    // Match defense/critical calc behavior: even when localized option arrays are missing
    // or still contain Korean tokens, normalize the display label for the active language.
    return labelOptions.map(option => normalizeTextForLang(option));
}

/**
 * Get all labels for UI
 */
export function getLabels() {
    return {
        labelNeedStat: translateNeedStat('needStat', '중요 스탯'),
        labelAttrImprove: translateNeedStat('needStatAttrImprove', '해명의 힘'),
        labelCritical: translateNeedStat('needStatCriticalRate', '크리티컬 확률'),
        labelPierce: translateNeedStat('needStatPierceRate', '관통'),
        labelBuff: translateNeedStat('needStatBuff', '버프'),
        labelSelf: translateNeedStat('needStatSelf', '자신'),
        labelNoItems: translateNeedStat('needStatNoItems', '해당 없음'),
        labelRevSum: translateNeedStat('revelationSum', '계시 합계'),
        labelExtraSum: translateNeedStat('extraSum', '별도 수치'),
        labelExtraPierce: translateNeedStat('extraPierce', '별도 관통 수치'),
        labelExtraDefenseReduce: translateNeedStat('extraDefenseReduce', '별도 방어력 감소'),
        labelPending: translateNeedStat('pending', '준비중'),
        labelCurrent: translateNeedStat('needStatCurrent', '현재'),
        labelNeeded: translateNeedStat('needStatNeeded', '필요'),
        labelPenetrateSelf: translateNeedStat('needStatPenetrateSelf', '관통 - 자신'),
        labelPenetrateBuff: translateNeedStat('needStatPenetrateBuff', '관통 - 버프'),
        labelDefenseReduce: translateNeedStat('needStatDefenseReduce', '방어력 감소'),
        labelRemainingDefense: translateNeedStat('needStatRemainingDefense', '남은 방어력'),
        labelRequiredPierce: translateNeedStat('needStatRequiredPierce', '필요 관통'),
        labelTarget: translateNeedStat('needStatTarget', '목표'),
        labelPersonaPerformance: translateNeedStat('needStatPersonaPerformance', '페르소나 성능')
    };
}

/**
 * Sort items by whether they match current character (current char items first)
 */
export function sortItemsByCurrentChar(items, charData) {
    if (!charData || !charData.name) return items;
    const currentCharName = charData.name;
    
    return [...items].sort((a, b) => {
        const aIsCurrentChar = a.source === currentCharName;
        const bIsCurrentChar = b.source === currentCharName;
        if (aIsCurrentChar && !bIsCurrentChar) return -1;
        if (!aIsCurrentChar && bIsCurrentChar) return 1;
        return 0;
    });
}
