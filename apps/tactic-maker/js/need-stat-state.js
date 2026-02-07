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

// ============================================================================
// Utility Functions
// ============================================================================

export function getCurrentLang() {
    if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
        return window.I18nService.getCurrentLanguage();
    }
    return 'kr';
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
        return lang === 'en' ? 'Common' : (lang === 'jp' ? '共通' : '공통');
    }
    if (source === '원더') {
        return lang === 'en' ? 'WONDER' : (lang === 'jp' ? 'ワンダー' : '원더');
    }
    if (source === '계시') {
        return lang === 'en' ? 'Revelation' : (lang === 'jp' ? '啓示' : '계시');
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
    let localizedName = '';
    const typeStr = String(item.type || '');
    const isWonder = groupName === '원더';

    // For 원더 전용무기, use DataLoader.getWeaponDisplayName for translation
    if (isWonder && typeStr === '전용무기' && item.skillName) {
        return DataLoader.getWeaponDisplayName(item.skillName);
    }

    // For 원더 페르소나, use DataLoader.getPersonaDisplayName for translation
    if (isWonder && typeStr === '페르소나' && item.skillName) {
        const baseName = item.skillName.replace(/\s*-\s*고유\s?스킬/g, '').trim();
        const displayName = DataLoader.getPersonaDisplayName(baseName);
        if (item.skillName.includes('고유스킬') || item.skillName.includes('고유 스킬')) {
            const suffix = lang === 'en' ? ' - Unique Skill' : (lang === 'jp' ? ' - 固有スキル' : ' - 고유스킬');
            return displayName + suffix;
        }
        return displayName;
    }

    // For 원더 스킬, use DataLoader.getSkillDisplayName for translation
    if (isWonder && typeStr === '스킬' && item.skillName) {
        return DataLoader.getSkillDisplayName(item.skillName);
    }

    if (lang === 'en') {
        localizedName = (item.skillName_en && String(item.skillName_en).trim()) ? item.skillName_en : '';
    } else if (lang === 'jp') {
        localizedName = (item.skillName_jp && String(item.skillName_jp).trim()) ? item.skillName_jp : '';
    }

    // Fallback rules
    if (!localizedName) {
        const isRevelation = groupName === '계시';
        const isWonderDisplayType = isWonder && (typeStr === '전용무기' || typeStr === '페르소나' || typeStr === '스킬');
        
        if (lang !== 'kr' && isWonderDisplayType) {
            localizedName = item.skillName || '';
        } else if (lang === 'kr') {
            localizedName = item.skillName || '';
        } else {
            localizedName = '';
        }
    }

    return localizedName;
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
    const lang = getCurrentLang();
    const t = (key, fallback) => {
        if (window.I18nService && typeof window.I18nService.t === 'function') {
            const result = window.I18nService.t(key);
            if (result && result !== key) return result;
        }
        return fallback;
    };

    return {
        labelNeedStat: t('needStat', lang === 'en' ? 'Key Stat' : (lang === 'jp' ? '重要ステ' : '중요 스탯')),
        labelAttrImprove: lang === 'en' ? 'Attribute Improvement' : (lang === 'jp' ? 'ステータス強化' : '속성 강화'),
        labelCritical: t('needStatCriticalRate', t('criticalRate', lang === 'en' ? 'Critical Rate' : (lang === 'jp' ? 'クリ率' : '크리티컬 확률'))),
        labelPierce: t('needStatPierceRate', lang === 'en' ? 'Pierce' : (lang === 'jp' ? '貫通' : '관통')),
        labelBuff: t('needStatBuff', t('criticalBuff', lang === 'en' ? 'Buff' : (lang === 'jp' ? 'バフ' : '버프'))),
        labelSelf: t('needStatSelf', t('criticalSelf', lang === 'en' ? 'Self' : (lang === 'jp' ? '自分' : '자신'))),
        labelNoItems: t('needStatNoItems', t('criticalNoItems', lang === 'en' ? 'No applicable items' : (lang === 'jp' ? '該当なし' : '해당 없음'))),
        labelRevSum: t('revelationSum', lang === 'en' ? 'Card Sum' : (lang === 'jp' ? '啓示合計' : '계시 합계')),
        labelExtraSum: t('extraSum', lang === 'en' ? 'Extra' : (lang === 'jp' ? '別途' : '별도 수치')),
        labelExtraPierce: t('extraPierce', lang === 'en' ? 'Extra Pierce' : (lang === 'jp' ? '別途貫通' : '별도 관통 수치')),
        labelExtraDefenseReduce: t('extraDefenseReduce', lang === 'en' ? 'Extra Def Reduce' : (lang === 'jp' ? '別途防御減少' : '별도 방어력 감소')),
        labelPending: t('pending', lang === 'en' ? 'Pending' : (lang === 'jp' ? '準備中' : '준비중')),
        labelCurrent: lang === 'en' ? 'current' : (lang === 'jp' ? '現在' : '현재'),
        labelNeeded: lang === 'en' ? 'needed' : (lang === 'jp' ? '必要' : '필요'),
        labelPenetrateSelf: lang === 'en' ? 'Penetrate - Self' : (lang === 'jp' ? '貫通 - 自分' : '관통 - 자신'),
        labelPenetrateBuff: lang === 'en' ? 'Penetrate - Buff' : (lang === 'jp' ? '貫通 - バフ' : '관통 - 버프'),
        labelDefenseReduce: lang === 'en' ? 'Defense Reduce' : (lang === 'jp' ? '防御減少' : '방어력 감소'),
        labelRemainingDefense: lang === 'en' ? 'Remaining Def' : (lang === 'jp' ? '残り防御' : '남은 방어력'),
        labelRequiredPierce: lang === 'en' ? 'Required Pierce' : (lang === 'jp' ? '必要貫通' : '필요 관통'),
        labelTarget: lang === 'en' ? 'target' : (lang === 'jp' ? '目標' : '목표')
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
