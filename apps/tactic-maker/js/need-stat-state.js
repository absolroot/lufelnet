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
    return String(text).replace(/의식\s*3/g, '의식2');
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
    
    if (lang === 'kr') return baseOptions;
    
    if (lang === 'en' && Array.isArray(item.options_en) && item.options_en.length === baseOptions.length) {
        return item.options_en;
    }
    if (lang === 'jp' && Array.isArray(item.options_jp) && item.options_jp.length === baseOptions.length) {
        return item.options_jp;
    }
    
    return baseOptions;
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
