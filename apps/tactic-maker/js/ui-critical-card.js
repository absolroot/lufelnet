/**
 * Tactic Maker V2 - Need Stat Card UI Module
 * Renders a collapsible critical/pierce rate checklist panel.
 * 
 * Refactored into modules:
 * - need-stat-state.js: Global state and utility functions
 * - need-stat-data.js: Data getters, calculators, auto-selection
 * - need-stat-events.js: Event handlers
 */

import { DataLoader } from './data-loader.js';

// Import from state module
import {
    getElucidatorBonuses as _getElucidatorBonuses,
    setElucidatorBonuses as _setElucidatorBonuses,
    getGlobalBossSettings as _getGlobalBossSettings,
    setGlobalBossSettings as _setGlobalBossSettings,
    getGlobalElucidatorCritical,
    getGlobalElucidatorPierce,
    getCurrentLang,
    formatTotalPair,
    normalizeTextForLang,
    getSourceDisplayName,
    getLocalizedSkillName,
    getLocalizedOptions,
    getLabels,
    sortItemsByCurrentChar
} from './need-stat-state.js';

// Data and events modules are available for future use
// Currently, the class methods handle data fetching and event binding internally
// These modules can be used for gradual migration to a more modular architecture
// import { ... } from './need-stat-data.js';
// import { ... } from './need-stat-events.js';

// Re-export for external use
export function getElucidatorBonuses() {
    return _getElucidatorBonuses();
}

export function setElucidatorBonuses(critical, pierce) {
    _setElucidatorBonuses(critical, pierce);
}

export function getGlobalBossSettings() {
    return _getGlobalBossSettings();
}

export function setGlobalBossSettings(settings) {
    _setGlobalBossSettings(settings);
}

export class NeedStatCardUI {
    constructor(store, baseUrl) {
        this.store = store;
        this.baseUrl = baseUrl || window.BASE_URL || '';
        this.selectedItems = new Set();          // Critical items
        this.selectedPierceItems = new Set();    // Pierce items (관통)
        this.selectedDefenseItems = new Set();   // Defense reduce items (방어력 감소)
        this.revelationSumCritical = 0;
        this.revelationSumPierce = 0;
        this.extraSumCritical = 0;               // 별도 수치 (크리티컬)
        this.extraSumPierce = 0;                 // 별도 관통 수치
        this.extraDefenseReduce = 0;             // 별도 방어력 감소
        this.slotCharData = null;
        this.isElucidator = false;
        this.currentSlotIndex = null;
    }
    
    /**
     * Save current selections to store for persistence
     */
    saveSelectionsToStore(slotIndex) {
        if (slotIndex === undefined || slotIndex === null) return;
        
        if (!this.store.state.needStatSelections) {
            this.store.state.needStatSelections = {};
        }
        
        this.store.state.needStatSelections[slotIndex] = {
            critical: [...this.selectedItems],
            pierce: [...this.selectedPierceItems],
            defense: [...this.selectedDefenseItems],
            revSumCritical: this.revelationSumCritical,
            revSumPierce: this.revelationSumPierce,
            extraSumCritical: this.extraSumCritical,
            extraSumPierce: this.extraSumPierce,
            extraDefenseReduce: this.extraDefenseReduce
        };
        
        // Trigger auto-save
        this.store.notify('needStatChange', { slotIndex });
    }
    
    /**
     * Load saved selections from store
     */
    loadSelectionsFromStore(slotIndex) {
        if (slotIndex === undefined || slotIndex === null) return false;
        
        const saved = this.store.state.needStatSelections?.[slotIndex];
        if (!saved) return false;
        
        this.selectedItems = new Set(saved.critical || []);
        this.selectedPierceItems = new Set(saved.pierce || []);
        this.selectedDefenseItems = new Set(saved.defense || []);
        this.revelationSumCritical = saved.revSumCritical || 0;
        this.revelationSumPierce = saved.revSumPierce || 0;
        this.extraSumCritical = saved.extraSumCritical || 0;
        this.extraSumPierce = saved.extraSumPierce || 0;
        this.extraDefenseReduce = saved.extraDefenseReduce || 0;
        
        return true;
    }

    formatTotalPair(total) {
        const current = Number.isFinite(total) ? total : 0;
        const needed = Math.max(0, 100 - current);
        return {
            currentText: `${current.toFixed(1)}%`,
            neededText: `${needed.toFixed(1)}%`
        };
    }

    renderTotalPairHtml(slotIndex, total, statType = 'critical', isElucidatorEditable = false) {
        // Critical: target is always 100%
        const target = 100;
        const current = total;
        const needed = Math.max(0, target - current);
        
        const targetText = `${target.toFixed(1)}%`;
        const currentText = `${current.toFixed(1)}%`;
        const neededText = `${needed.toFixed(1)}%`;
        
        // For elucidator slot, render editable inputs instead of static text (no label needed)
        if (isElucidatorEditable) {
            const currentVal = Number.isFinite(total) ? total : 0;
            return `
                <span class="need-stat-total need-stat-total-editable" data-slot-index="${slotIndex}" data-stat-type="${statType}">
                    <input type="number" class="need-stat-elucidator-inline-input" data-stat="${statType}" value="${currentVal}" min="0" max="100" step="0.1">
                </span>
            `;
        }
        
        // Inline layout with current only for column header
        return `
            <span class="need-stat-total need-stat-total-inline" data-slot-index="${slotIndex}" data-stat-type="${statType}">
                <span class="need-stat-current">${currentText}</span>
            </span>
        `;
    }

    updateTotalPairDisplays(slotIndex, total, statType = 'critical') {
        // Critical: target is always 100%
        const target = 100;
        const current = total;
        const needed = Math.max(0, target - current);
        
        const targetText = `${target.toFixed(1)}%`;
        const currentText = `${current.toFixed(1)}%`;
        const neededText = `${needed.toFixed(1)}%`;
        
        // Update panel displays (target/current/needed)
        document
            .querySelectorAll(`.need-stat-total[data-slot-index="${slotIndex}"][data-stat-type="${statType}"]`)
            .forEach(el => {
                const tgt = el.querySelector('.need-stat-target');
                const cur = el.querySelector('.need-stat-current');
                const need = el.querySelector('.need-stat-needed');
                if (tgt) tgt.textContent = targetText;
                if (cur) cur.textContent = currentText;
                if (need) need.textContent = neededText;
            });
        // Update trigger table displays (target/current/needed)
        document
            .querySelectorAll(`.need-stat-trigger-row[data-stat-type="${statType}"] .need-stat-target[data-slot-index="${slotIndex}"]`)
            .forEach(el => { el.textContent = targetText; });
        document
            .querySelectorAll(`.need-stat-trigger-row[data-stat-type="${statType}"] .need-stat-current[data-slot-index="${slotIndex}"]`)
            .forEach(el => { el.textContent = currentText; });
        document
            .querySelectorAll(`.need-stat-trigger-row[data-stat-type="${statType}"] .need-stat-needed[data-slot-index="${slotIndex}"]`)
            .forEach(el => { el.textContent = neededText; });
    }

    getCurrentLang() {
        if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
            return window.I18nService.getCurrentLanguage();
        }
        return 'kr';
    }

    /**
     * Get critical buff data items that apply to this party setup
     */
    getApplicableBuffItems() {
        const items = [];
        const buffData = window.criticalBuffData || {};
        const wonderState = this.store.state.wonder || {};
        const personas = wonderState.personas || [];

        // 1. Common buffs (always available)
        if (buffData['공통']) {
            buffData['공통'].forEach(item => {
                items.push({ ...item, source: '공통' });
            });
        }

        // 2. Wonder persona skills: 리벨리온, 레볼루션 - only if in persona skill list
        const personaNames = personas.map(p => p?.name || '').filter(Boolean);
        const personaSkills = personas.flatMap(p => p?.skills || []).filter(Boolean);
        if (buffData['원더']) {
            buffData['원더'].forEach(item => {
                const skillName = item.skillName || '';
                // Only add 리벨리온/레볼루션 if they exist in the persona skill list
                if (skillName === '리벨리온' || skillName === '레볼루션') {
                    if (personaSkills.includes(skillName)) {
                        items.push({ ...item, source: '원더' });
                    }
                }
            });
        }

        // 3. Wonder items: type === '페르소나' and skillName contains selected persona name
        if (buffData['원더']) {
            buffData['원더'].forEach(item => {
                if (item.type === '페르소나') {
                    const matchesPersona = personaNames.some(pName => {
                        return item.skillName && item.skillName.includes(pName);
                    });
                    if (matchesPersona) {
                        items.push({ ...item, source: '원더' });
                    }
                }
            });
        }

        // 4. Party member buffs
        const party = this.store.state.party || [];
        party.forEach((member) => {
            if (!member || !member.name) return;
            const charName = member.name;
            if (buffData[charName]) {
                buffData[charName].forEach(item => {
                    items.push({ ...item, source: charName });
                });
            }
        });

        return items;
    }

    /**
     * Get critical self data items for a specific character
     */
    getApplicableSelfItems(charData) {
        const items = [];
        const selfData = window.criticalSelfData || {};

        if (!charData || !charData.name) return items;

        const mainRev = charData.mainRev || '';
        const subRev = charData.subRev || '';
        const charName = charData.name;

        // 1. Revelation items matching current character's revelation
        // Handle '+' in revelation names (e.g., "아르카나+태양" means both must match)
        const mainRevParts = mainRev ? mainRev.split('+').map(s => s.trim()) : [];
        const subRevParts = subRev ? subRev.split('+').map(s => s.trim()) : [];
        
        if (selfData['계시']) {
            selfData['계시'].forEach(item => {
                const skillName = item.skillName || '';

                if (skillName.includes('-')) {
                    // Set format: "main-sub"
                    const [mainPart, subPart] = skillName.split('-');
                    const mainMatches = mainRevParts.some(p => p === mainPart);
                    const subMatches = subRevParts.some(p => p === subPart);
                    if (mainMatches && subMatches) {
                        items.push({ ...item, source: '계시' });
                    }
                } else {
                    // Single revelation: exact match required
                    const matchesMain = mainRevParts.some(p => p === skillName);
                    const matchesSub = subRevParts.some(p => p === skillName);
                    if (matchesMain || matchesSub) {
                        items.push({ ...item, source: '계시' });
                    }
                }
            });
        }

        // 2. Character-specific self items
        if (selfData[charName]) {
            selfData[charName].forEach(item => {
                items.push({ ...item, source: charName });
            });
        }

        return items;
    }

    /**
     * Get penetrate (관통) items for pierce column
     * 4-1~4-3: 관통 - 자신 (target='자신') / 관통 - 버프 (target='단일','광역','단일/광역')
     */
    getApplicablePenetrateItems(charData) {
        const selfItems = [];  // target = '자신'
        const buffItems = [];  // target = '단일', '광역', '단일/광역'
        const penetrateData = window.penetrateData || {};
        
        if (!charData || !charData.name) return { selfItems, buffItems };
        
        const charName = charData.name;
        const mainRev = charData.mainRev || '';
        const subRev = charData.subRev || '';
        
        // Get wonder config for weapon/persona/skill matching
        const wonderConfig = this.store.state.wonder || {};
        const wonderWeapon = wonderConfig.weapon || '';
        const wonderPersonas = wonderConfig.personas || [];
        const personaNames = wonderPersonas.map(p => p?.name).filter(Boolean);
        const personaSkills = wonderPersonas.flatMap(p => [p?.skill1, p?.skill2, p?.skill3].filter(Boolean));
        
        // Get all party members and their revelations (including all slots)
        const party = this.store.state.party || [];
        const partyCharNames = party.map(m => m?.name).filter(Boolean);
        
        const addItem = (item, source) => {
            const target = item.target || '';
            const newItem = { ...item, source };
            if (target === '자신') {
                selfItems.push(newItem);
            } else {
                buffItems.push(newItem);
            }
        };
        
        // 4-1. 계시: 파티 멤버 중 정확히 메인+서브가 일치하는 경우만 매칭
        if (penetrateData['계시']) {
            penetrateData['계시'].forEach(item => {
                const skillName = item.skillName || '';
                const itemTarget = item.target || '';
                
                // Handle both "main + sub" and "main-sub" formats
                const separator = skillName.includes(' + ') ? ' + ' : (skillName.includes('-') ? '-' : null);
                if (separator) {
                    // Set format: "A + B" - check if any party member has exactly this combination
                    const [partA, partB] = skillName.split(separator).map(s => s.trim());
                    
                    let matched = false;
                    if (itemTarget === '자신') {
                        // Check only current character
                        const charMainRevParts = mainRev ? mainRev.split('+').map(s => s.trim()) : [];
                        const charSubRevParts = subRev ? subRev.split('+').map(s => s.trim()) : [];
                        const hasPartA = charMainRevParts.includes(partA) || charSubRevParts.includes(partA);
                        const hasPartB = charMainRevParts.includes(partB) || charSubRevParts.includes(partB);
                        matched = hasPartA && hasPartB;
                    } else {
                        // Check all party members - at least one must have both parts
                        matched = party.some(member => {
                            const memberMainRevParts = member?.mainRev ? member.mainRev.split('+').map(s => s.trim()) : [];
                            const memberSubRevParts = member?.subRev ? member.subRev.split('+').map(s => s.trim()) : [];
                            const hasPartA = memberMainRevParts.includes(partA) || memberSubRevParts.includes(partA);
                            const hasPartB = memberMainRevParts.includes(partB) || memberSubRevParts.includes(partB);
                            return hasPartA && hasPartB;
                        });
                    }
                    
                    if (matched) {
                        addItem(item, '계시');
                    }
                } else {
                    // Single revelation: exact match required
                    let matched = false;
                    if (itemTarget === '자신') {
                        const charMainRevParts = mainRev ? mainRev.split('+').map(s => s.trim()) : [];
                        const charSubRevParts = subRev ? subRev.split('+').map(s => s.trim()) : [];
                        matched = charMainRevParts.includes(skillName) || charSubRevParts.includes(skillName);
                    } else {
                        matched = party.some(member => {
                            const memberMainRevParts = member?.mainRev ? member.mainRev.split('+').map(s => s.trim()) : [];
                            const memberSubRevParts = member?.subRev ? member.subRev.split('+').map(s => s.trim()) : [];
                            return memberMainRevParts.includes(skillName) || memberSubRevParts.includes(skillName);
                        });
                    }
                    
                    if (matched) {
                        addItem(item, '계시');
                    }
                }
            });
        }
        
        // 4-2. 현재 캐릭터와 이름이 같은 캐릭터의 요소들 전부
        if (penetrateData[charName]) {
            penetrateData[charName].forEach(item => {
                addItem(item, charName);
            });
        }
        
        // 4-3. 다른 캐릭터 슬롯에 있는 캐릭터들 중 '자신'이 아닌 요소들
        partyCharNames.forEach(memberName => {
            if (memberName === charName) return; // Skip current character
            if (penetrateData[memberName]) {
                penetrateData[memberName].forEach(item => {
                    if (item.target !== '자신') {
                        addItem(item, memberName);
                    }
                });
            }
        });
        
        // 4-5. 원더: 전용무기 - 현재 선택된 무기와 이름이 같은 경우
        // 4-6. 원더: 스킬 - 페르소나 스킬에 해당 스킬이 있을 때
        // 4-7. 원더: 페르소나 - 이름에 현재 페르소나 이름이 포함될 때
        if (penetrateData['원더']) {
            penetrateData['원더'].forEach(item => {
                const typeStr = item.type || '';
                const skillName = item.skillName || '';
                
                if (typeStr === '전용무기') {
                    if (wonderWeapon && skillName === wonderWeapon) {
                        addItem(item, '원더');
                    }
                } else if (typeStr === '스킬') {
                    if (personaSkills.some(s => s && skillName.includes(s))) {
                        addItem(item, '원더');
                    }
                } else if (typeStr === '페르소나') {
                    if (personaNames.some(pName => pName && skillName.includes(pName))) {
                        addItem(item, '원더');
                    }
                }
            });
        }
        
        return { selfItems, buffItems };
    }

    /**
     * Get defense reduce (방어력 감소) items for pierce column
     * 4-4, 4-5, 4-6, 4-7, 4-8
     */
    getApplicableDefenseReduceItems(charData) {
        const items = [];
        const defenseData = window.defenseCalcData || {};
        
        if (!charData || !charData.name) return items;
        
        const charName = charData.name;
        
        // Get wonder config
        const wonderConfig = this.store.state.wonder || {};
        const wonderWeapon = wonderConfig.weapon || '';
        const wonderPersonas = wonderConfig.personas || [];
        const personaNames = wonderPersonas.map(p => p?.name).filter(Boolean);
        const personaSkills = wonderPersonas.flatMap(p => [p?.skill1, p?.skill2, p?.skill3].filter(Boolean));
        
        // Get all party members and their revelations
        const party = this.store.state.party || [];
        const partyCharNames = party.map(m => m?.name).filter(Boolean);
        
        // Handle '+' in revelation names for all party members
        const allMainRevParts = party.flatMap(m => m?.mainRev ? m.mainRev.split('+').map(s => s.trim()) : []);
        const allSubRevParts = party.flatMap(m => m?.subRev ? m.subRev.split('+').map(s => s.trim()) : []);
        
        // 4-4. 계시: 모든 캐릭터 슬롯에서 계시 이름/세트가 포함된 경우
        if (defenseData['계시']) {
            defenseData['계시'].forEach(item => {
                const skillName = item.skillName || '';
                // Check if any party member's revelation matches
                // Handle both "main + sub" and "main-sub" formats
                const separator = skillName.includes(' + ') ? ' + ' : (skillName.includes('-') ? '-' : null);
                if (separator) {
                    // Set format: "A + B" - check both directions (A in main & B in sub, OR A in sub & B in main)
                    const [partA, partB] = skillName.split(separator).map(s => s.trim());
                    const allRevParts = [...allMainRevParts, ...allSubRevParts];
                    const partAMatches = allRevParts.some(p => p === partA);
                    const partBMatches = allRevParts.some(p => p === partB);
                    if (partAMatches && partBMatches) {
                        items.push({ ...item, source: '계시' });
                    }
                } else {
                    // Single revelation: exact match required
                    const matchesMain = allMainRevParts.some(p => p === skillName);
                    const matchesSub = allSubRevParts.some(p => p === skillName);
                    if (matchesMain || matchesSub) {
                        items.push({ ...item, source: '계시' });
                    }
                }
            });
        }
        
        // 4-8. 모든 캐릭터 슬롯에서 선택된 캐릭터들의 방어력 감소 요소 전부
        partyCharNames.forEach(memberName => {
            if (defenseData[memberName]) {
                defenseData[memberName].forEach(item => {
                    items.push({ ...item, source: memberName });
                });
            }
        });
        
        // 4-5. 원더: 전용무기 - 현재 선택된 무기와 이름이 같은 경우
        // 4-6. 원더: 스킬 - 페르소나 스킬에 해당 스킬이 있을 때
        // 4-7. 원더: 페르소나 - 이름에 현재 페르소나 이름이 포함될 때
        if (defenseData['원더']) {
            defenseData['원더'].forEach(item => {
                const typeStr = item.type || '';
                const skillName = item.skillName || '';
                
                if (typeStr === '전용무기') {
                    if (wonderWeapon && skillName === wonderWeapon) {
                        items.push({ ...item, source: '원더' });
                    }
                } else if (typeStr === '스킬') {
                    if (personaSkills.some(s => s && skillName.includes(s))) {
                        items.push({ ...item, source: '원더' });
                    }
                } else if (typeStr === '페르소나') {
                    if (personaNames.some(pName => pName && skillName.includes(pName))) {
                        items.push({ ...item, source: '원더' });
                    }
                }
            });
        }
        
        return items;
    }

    /**
     * Get localized source name
     * For Korean: use slot item name (codename style) instead of character name
     */
    getSourceDisplayName(source) {
        const lang = this.getCurrentLang();
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
            // Korean: use the source name directly (character name from data)
            return source;
        }
        return DataLoader.getCharacterDisplayName(source) || source;
    }

    /**
     * Get localized skill name following critical-calc.js pattern
     */
    getLocalizedSkillName(item, groupName = '') {
        const lang = this.getCurrentLang();
        let localizedName = '';
        const typeStr = String(item.type || '');
        const isWonder = groupName === '원더';

        // For 원더 전용무기, use DataLoader.getWeaponDisplayName for translation
        if (isWonder && typeStr === '전용무기' && item.skillName) {
            return DataLoader.getWeaponDisplayName(item.skillName);
        }

        // For 원더 페르소나, use DataLoader.getPersonaDisplayName for translation
        if (isWonder && typeStr === '페르소나' && item.skillName) {
            // Extract persona name (remove " - 고유스킬" suffix if present)
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

        // Fallback rules following critical-calc.js / defense-calc.js pattern
        if (!localizedName) {
            const isWonder = groupName === '원더';
            const isRevelation = groupName === '계시';
            const typeStr = String(item.type || '');
            const isWonderDisplayType = isWonder && (typeStr === '전용무기' || typeStr === '페르소나' || typeStr === '스킬');
            
            // EN/JP: only allow KR fallback for 원더 group's 전용무기/페르소나/스킬
            if (lang !== 'kr' && isWonderDisplayType) {
                localizedName = item.skillName || '';
            } else if (lang === 'kr') {
                localizedName = item.skillName || '';
            } else {
                // EN/JP for non-원더/계시 groups: no fallback → type only will be shown
                localizedName = '';
            }
        }

        return localizedName;
    }

    /**
     * Get localized options following defense-calc.js pattern
     */
    getLocalizedOptions(item) {
        const lang = this.getCurrentLang();
        const baseOptions = Array.isArray(item.options) ? item.options : [];
        
        if (lang === 'kr') return baseOptions;
        
        // Check for language-specific options
        if (lang === 'en' && Array.isArray(item.options_en) && item.options_en.length === baseOptions.length) {
            return item.options_en;
        }
        if (lang === 'jp' && Array.isArray(item.options_jp) && item.options_jp.length === baseOptions.length) {
            return item.options_jp;
        }
        
        return baseOptions;
    }

    /**
     * Normalize text for language (e.g., 의식3 -> 의식2 for non-KR)
     */
    normalizeTextForLang(text) {
        const lang = this.getCurrentLang();
        if (!text || lang === 'kr') return text || '';
        return String(text).replace(/의식\s*3/g, '의식2');
    }

    /**
     * Render a critical item row with Target column
     */
    renderItemRow(item, isSelf = false) {
        const lang = this.getCurrentLang();
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        const groupName = item.source || '';

        const skillName = this.getLocalizedSkillName(item, groupName);

        let typeName = this.normalizeTextForLang(item.type || '');
        if (lang === 'en' && item.type_en) typeName = item.type_en;
        if (lang === 'jp' && item.type_jp) typeName = item.type_jp;

        const target = item.target || '';
        const value = item.value || 0;
        const skillIcon = item.skillIcon ? `${this.baseUrl}${item.skillIcon}` : '';
        const isChecked = this.selectedItems.has(itemId);
        const sourceName = this.getSourceDisplayName(item.source);

        // Build display name following critical-calc.js pattern
        let displayName = '';
        const isSpecialGroup = (groupName === '원더' || groupName === '계시');
        if (lang === 'kr') {
            displayName = typeName + (skillName ? ' ' + skillName : '');
        } else {
            // EN/JP: show only name if available for non-special groups
            if (skillName && skillName.trim()) {
                if (!isSpecialGroup) {
                    displayName = skillName;
                } else {
                    displayName = typeName + (skillName ? ' ' + skillName : '');
                }
            } else {
                displayName = typeName;
            }
        }

        // Options dropdown if item has options - use localized options
        let optionsHtml = '';
        if (item.options && item.options.length > 0) {
            const baseOptions = item.options;
            const labelOptions = this.getLocalizedOptions(item);
            const selectedOpt = item._selectedOption || item.defaultOption || baseOptions[0];
            optionsHtml = `
                <select class="need-stat-select" data-item-id="${itemId}">
                    ${baseOptions.map((opt, idx) => {
                        const label = labelOptions[idx] !== undefined ? labelOptions[idx] : opt;
                        const selected = (selectedOpt === opt) ? 'selected' : '';
                        return `<option value="${opt}" ${selected}>${label}</option>`;
                    }).join('')}
                </select>
            `;
        }

        // J&C 크리티컬 섹션 jc1 페르소나 성능 입력 필드
        // 관통 섹션의 jc1과 동일한 공식 및 값 공유
        let personaPerformanceHtml = '';
        const isJC1Critical = (String(item.id) === 'jc1');
        
        if (isJC1Critical) {
            const defaultValue = 100;
            const label = lang === 'en' ? 'Desire' : (lang === 'jp' ? 'デザイア' : '페르소나 성능');
            personaPerformanceHtml = `
                <span class="need-stat-persona-performance">
                    <label class="need-stat-persona-label">${label}</label>
                    <input type="number" class="need-stat-persona-input need-stat-jc1-sync" data-item-id="${itemId}" data-category="critical" value="${defaultValue}" min="0" max="300" step="0.1">
                </span>
            `;
        }

        // Display: [check] [target] [icon] [source] name [persona-performance] [options] value%
        const checkClass = isChecked ? '' : 'check-off';
        return `
            <div class="need-stat-row ${isChecked ? 'checked' : ''}" data-item-id="${itemId}" data-item-type="${item.type || ''}">
                <img src="${this.baseUrl}/assets/img/ui/check-${isChecked ? 'on' : 'off'}.png" class="need-stat-check ${checkClass}">
                <span class="need-stat-target-type" data-target="${target}">${target}</span>
                ${skillIcon ? `<img src="${skillIcon}" class="need-stat-icon" onerror="this.style.display='none'">` : '<span class="need-stat-icon"></span>'}
                <span class="need-stat-source">${sourceName}</span>
                <span class="need-stat-name">${displayName}</span>
                ${personaPerformanceHtml}
                ${optionsHtml}
                <span class="need-stat-value">${value}%</span>
            </div>
        `;
    }

    /**
     * Render a pierce/defense item row (similar to critical item row)
     */
    renderPierceItemRow(item, category = 'pierce') {
        const lang = this.getCurrentLang();
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        const groupName = item.source || '';

        const skillName = this.getLocalizedSkillName(item, groupName);

        let typeName = this.normalizeTextForLang(item.type || '');
        if (lang === 'en' && item.type_en) typeName = item.type_en;
        if (lang === 'jp' && item.type_jp) typeName = item.type_jp;

        const target = item.target || '';
        const value = item.value || 0;
        const skillIcon = item.skillIcon || '';
        const selectedSet = category === 'pierce' ? this.selectedPierceItems : this.selectedDefenseItems;
        const isChecked = selectedSet.has(itemId);
        const sourceName = this.getSourceDisplayName(item.source);

        // Build display name following defense-calc.js pattern
        let displayName = '';
        const isSpecialGroup = (groupName === '원더' || groupName === '계시');
        if (lang === 'kr') {
            displayName = typeName + (skillName ? ' ' + skillName : '');
        } else {
            // EN/JP: show only name if available for non-special groups
            if (skillName && skillName.trim()) {
                if (!isSpecialGroup) {
                    displayName = skillName;
                } else {
                    displayName = typeName + (skillName ? ' ' + skillName : '');
                }
            } else {
                displayName = typeName;
            }
        }

        // Options dropdown - use localized options
        let optionsHtml = '';
        if (item.options && item.options.length > 0) {
            const baseOptions = item.options;
            const labelOptions = this.getLocalizedOptions(item);
            const selectedOpt = item._selectedOption || item.defaultOption || baseOptions[0];
            optionsHtml = `
                <select class="need-stat-options" data-item-id="${itemId}" data-category="${category}">
                    ${baseOptions.map((opt, idx) => {
                        const label = labelOptions[idx] !== undefined ? labelOptions[idx] : opt;
                        const selected = (selectedOpt === opt) ? 'selected' : '';
                        return `<option value="${opt}" ${selected}>${label}</option>`;
                    }).join('')}
                </select>
            `;
        }

        // J&C 페르소나 성능 입력 필드 (jc1, jc2에만 적용)
        // jc1: 관통 테이블, jc2: 방어력 감소 테이블
        let personaPerformanceHtml = '';
        const isJC1 = (String(item.id) === 'jc1' && category === 'pierce');
        const isJC2 = (String(item.id) === 'jc2' && category === 'defense');
        
        if (isJC1 || isJC2) {
            const defaultValue = 100;
            const label = lang === 'en' ? 'Desire' : (lang === 'jp' ? 'デザイア' : '페르소나 성능');
            // jc1은 크리티컬 섹션과 값 동기화를 위해 need-stat-jc1-sync 클래스 추가
            const syncClass = isJC1 ? 'need-stat-jc1-sync' : '';
            personaPerformanceHtml = `
                <span class="need-stat-persona-performance">
                    <label class="need-stat-persona-label">${label}</label>
                    <input type="number" class="need-stat-persona-input ${syncClass}" data-item-id="${itemId}" data-category="${category}" value="${defaultValue}" min="0" max="300" step="0.1">
                </span>
            `;
        }

        return `
            <div class="need-stat-row ${isChecked ? 'checked' : ''}" data-item-id="${itemId}" data-item-type="${item.type || ''}" data-category="${category}">
                <img src="${this.baseUrl}/assets/img/ui/check-${isChecked ? 'on' : 'off'}.png" class="need-stat-check ${isChecked ? '' : 'check-off'}">
                <span class="need-stat-target-type" data-target="${target}">${target}</span>
                ${skillIcon ? `<img src="${skillIcon}" class="need-stat-icon" onerror="this.style.display='none'">` : '<span class="need-stat-icon"></span>'}
                <span class="need-stat-source">${sourceName}</span>
                <span class="need-stat-name">${displayName}</span>
                ${personaPerformanceHtml}
                ${optionsHtml}
                <span class="need-stat-value">${value}%</span>
            </div>
        `;
    }

    /**
     * Calculate total critical rate from selected items
     */
    calculateTotal(buffItems, selfItems) {
        let total = 0;
        const allItems = [...buffItems, ...selfItems];
        allItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            if (this.selectedItems.has(itemId)) {
                total += item.value || 0;
            }
        });
        return total;
    }

    /**
     * Calculate total penetrate rate from selected pierce items
     */
    calculatePierceTotal(penetrateSelfItems, penetrateBuffItems) {
        let total = 0;
        const allItems = [...penetrateSelfItems, ...penetrateBuffItems];
        allItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            if (this.selectedPierceItems.has(itemId)) {
                total += item.value || 0;
            }
        });
        return total;
    }

    /**
     * Calculate total defense reduce rate from selected defense items
     */
    calculateDefenseReduceTotal(defenseReduceItems) {
        let total = 0;
        defenseReduceItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            if (this.selectedDefenseItems.has(itemId)) {
                total += item.value || 0;
            }
        });
        return total;
    }

    /**
     * Calculate remaining defense coefficient and target pierce rate
     * Formula:
     * - 방어력 감소만 적용하여 남은 방어력 계산 (관통은 별도로 표시)
     * - 남은 방어 계수 = 방어 계수 - 방어력 감소%
     * - 관통 목표 = 남은 방어 계수 / (최초 방어 계수 / 100)
     * - 필요 관통 = 목표 - 현재
     */
    calculateDefenseStats(penetrateTotal, defenseReduceTotal) {
        const { defenseCoef } = _getGlobalBossSettings();
        
        // 방어력 감소만 적용 (관통은 적용하지 않음)
        const remainingDefenseCoef = Math.max(0, defenseCoef - defenseReduceTotal);
        
        // 관통 목표 = 남은 방어 계수 / (최초 방어 계수 / 100)
        const pierceTarget = defenseCoef > 0 ? (remainingDefenseCoef / (defenseCoef / 100)) : 0;
        
        // 필요 관통 = 목표 - 현재
        const pierceNeeded = Math.max(0, pierceTarget - penetrateTotal);
        
        return {
            remainingDefense: remainingDefenseCoef.toFixed(1),
            pierceTarget: pierceTarget.toFixed(1),
            pierceNeeded: pierceNeeded.toFixed(1)
        };
    }

    getLabels() {
        const lang = this.getCurrentLang();
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
            // Pierce section labels
            labelPenetrateSelf: lang === 'en' ? 'Penetrate - Self' : (lang === 'jp' ? '貫通 - 自分' : '관통 - 자신'),
            labelPenetrateBuff: lang === 'en' ? 'Penetrate - Buff' : (lang === 'jp' ? '貫通 - バフ' : '관통 - 버프'),
            labelDefenseReduce: lang === 'en' ? 'Defense Reduce' : (lang === 'jp' ? '防御減少' : '방어력 감소'),
            labelRemainingDefense: lang === 'en' ? 'Remaining Def' : (lang === 'jp' ? '残り防御' : '남은 방어력'),
            labelRequiredPierce: lang === 'en' ? 'Required Pierce' : (lang === 'jp' ? '必要貫通' : '필요 관통'),
            labelTarget: lang === 'en' ? 'target' : (lang === 'jp' ? '目標' : '목표')
        };
    }

    ensureDefaultSelected(buffItems) {
        buffItems.forEach(item => {
            if (item.id === 'default' || item.id === 'myPalace') {
                this.selectedItems.add(item.id);
            }
        });
    }

    /**
     * Sort items so that current character's items appear first
     */
    sortItemsByCurrentChar(items, charData) {
        if (!charData || !charData.name) return items;
        const charName = charData.name;
        
        return [...items].sort((a, b) => {
            const aIsCurrentChar = a.source === charName ? 0 : 1;
            const bIsCurrentChar = b.source === charName ? 0 : 1;
            return aIsCurrentChar - bIsCurrentChar;
        });
    }

    renderTrigger(charData, slotIndex, isOpen = false) {
        this.slotCharData = charData;
        this.isElucidator = (slotIndex === 3);
        const container = document.createElement('div');
        container.className = `need-stat-trigger ${isOpen ? 'open' : ''}`;
        container.dataset.slotIndex = slotIndex;

        const { labelNeedStat, labelAttrImprove, labelCritical, labelPierce, labelCurrent, labelNeeded, labelTarget } = this.getLabels();
        const triggerTitle = this.isElucidator ? labelAttrImprove : labelNeedStat;

        // Load saved selections first to get revelationSum and extraSum values
        const hasStoredSelections = this.loadSelectionsFromStore(slotIndex);

        // For elucidator, show global bonuses; for others, calculate from items
        let critTotal = 0;
        let pierceTotal = 0;
        let pierceTarget = 0;
        let pierceNeeded = 0;
        if (this.isElucidator) {
            critTotal = getGlobalElucidatorCritical();
            pierceTotal = getGlobalElucidatorPierce();
        } else {
            const buffItems = this.getApplicableBuffItems();
            const selfItems = this.getApplicableSelfItems(charData);
            
            // Only run auto-select if no stored selections exist
            if (!hasStoredSelections) {
                this.autoSelectBySlotSettings(charData, [...buffItems, ...selfItems]);
                this.ensureDefaultSelected(buffItems);
            }
            
            critTotal = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + this.extraSumCritical + getGlobalElucidatorCritical();
            
            // Calculate pierce total from pierce items
            const { selfItems: penetrateSelfItems, buffItems: penetrateBuffItems } = this.getApplicablePenetrateItems(charData);
            const defenseReduceItems = this.getApplicableDefenseReduceItems(charData);
            
            // Only run auto-select for pierce if no stored selections exist
            if (!hasStoredSelections) {
                this.autoSelectPierceBySlotSettings(charData, [...penetrateSelfItems, ...penetrateBuffItems], 'pierce');
                this.autoSelectPierceBySlotSettings(charData, defenseReduceItems, 'defense');
            }
            
            const penetrateFromItems = this.calculatePierceTotal(penetrateSelfItems, penetrateBuffItems);
            const defenseReduceFromItems = this.calculateDefenseReduceTotal(defenseReduceItems);
            const totalDefenseReduce = defenseReduceFromItems + this.extraDefenseReduce;
            pierceTotal = penetrateFromItems + this.revelationSumPierce + this.extraSumPierce + getGlobalElucidatorPierce();
            
            // Calculate target and needed pierce based on defense stats
            const defenseStats = this.calculateDefenseStats(penetrateFromItems, totalDefenseReduce);
            pierceTarget = parseFloat(defenseStats.pierceTarget);
            pierceNeeded = parseFloat(defenseStats.pierceNeeded);
        }

        // Elucidator: editable inputs in trigger rows instead of accordion
        const isElucidatorEditable = this.isElucidator;
        
        // Critical: target is always 100%
        const critTarget = 100;
        const critNeeded = Math.max(0, critTarget - critTotal);
        const critTargetText = `${critTarget.toFixed(1)}%`;
        const critCurrentText = `${critTotal.toFixed(1)}%`;
        const critNeededText = `${critNeeded.toFixed(1)}%`;
        
        // Pierce: target/current/needed
        const pierceTargetText = `${pierceTarget.toFixed(1)}%`;
        const pierceCurrentText = `${pierceTotal.toFixed(1)}%`;
        const pierceNeededText = `${pierceNeeded.toFixed(1)}%`;

        // Table layout:
        //                  목표    현재    필요
        // 크리티컬 확률    100%    10%     90%
        // 관통 확률        50%     15%     35%
        if (isElucidatorEditable) {
            container.innerHTML = `
                <div class="need-stat-trigger-header">
                    <div class="need-stat-toggle">
                        <span>${triggerTitle}</span>
                    </div>
                </div>
                <div class="need-stat-trigger-table">
                    <div class="need-stat-trigger-row">
                        <span class="need-stat-trigger-label">${labelCritical}</span>
                        <span class="need-stat-elucidator-input-wrap"><input type="number" class="need-stat-elucidator-inline-input" data-stat="critical" data-slot-index="${slotIndex}" value="${critTotal}" min="0" max="100" step="0.1">%</span>
                    </div>
                    <div class="need-stat-trigger-row">
                        <span class="need-stat-trigger-label">${labelPierce}</span>
                        <span class="need-stat-elucidator-input-wrap"><input type="number" class="need-stat-elucidator-inline-input" data-stat="pierce" data-slot-index="${slotIndex}" value="${pierceTotal}" min="0" max="100" step="0.1">%</span>
                    </div>
                </div>
            `;
            this.bindElucidatorTriggerEvents(container, slotIndex);
        } else {
            container.innerHTML = `
                <div class="need-stat-trigger-header">
                    <div class="need-stat-toggle">
                        <svg class="need-stat-caret ${isOpen ? 'open' : ''}" width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>${triggerTitle}</span>
                    </div>
                </div>
                <div class="need-stat-trigger-table">
                    <div class="need-stat-trigger-row need-stat-trigger-header-row">
                        <span class="need-stat-trigger-label"></span>
                        <span class="need-stat-trigger-col-header">${labelTarget}</span>
                        <span class="need-stat-trigger-col-header">${labelCurrent}</span>
                        <span class="need-stat-trigger-col-header">${labelNeeded}</span>
                    </div>
                    <div class="need-stat-trigger-row" data-stat-type="critical">
                        <span class="need-stat-trigger-label">${labelCritical}</span>
                        <span class="need-stat-target" data-slot-index="${slotIndex}" data-stat-type="critical">${critTargetText}</span>
                        <span class="need-stat-current" data-slot-index="${slotIndex}" data-stat-type="critical">${critCurrentText}</span>
                        <span class="need-stat-needed" data-slot-index="${slotIndex}" data-stat-type="critical">${critNeededText}</span>
                    </div>
                    <div class="need-stat-trigger-row" data-stat-type="pierce">
                        <span class="need-stat-trigger-label">${labelPierce}</span>
                        <span class="need-stat-target" data-slot-index="${slotIndex}" data-stat-type="pierce">${pierceTargetText}</span>
                        <span class="need-stat-current" data-slot-index="${slotIndex}" data-stat-type="pierce">${pierceCurrentText}</span>
                        <span class="need-stat-needed" data-slot-index="${slotIndex}" data-stat-type="pierce">${pierceNeededText}</span>
                    </div>
                </div>
            `;
        }

        return container;
    }

    /**
     * Bind events for elucidator inline inputs in trigger
     */
    bindElucidatorTriggerEvents(container, slotIndex) {
        container.querySelectorAll('.need-stat-elucidator-inline-input').forEach(input => {
            input.addEventListener('input', (e) => {
                e.stopPropagation();
                const statType = input.dataset.stat;
                const val = parseFloat(input.value) || 0;
                
                if (statType === 'critical') {
                    _setElucidatorBonuses(val, getGlobalElucidatorPierce());
                } else if (statType === 'pierce') {
                    _setElucidatorBonuses(getGlobalElucidatorCritical(), val);
                }
                
                // Trigger update for all other slots
                this.notifyAllSlotsUpdate();
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        });
    }

    /**
     * Auto-select pierce/defense items based on slot settings
     * - 방어력 감소: 전부 체크
     * - 관통 버프 (단일 제외): 의식n/전용무기 제외하고 전부 체크
     * - 관통 자신: 현재 캐릭터 것만 체크 (의식n/전용무기 제외)
     */
    autoSelectPierceBySlotSettings(charData, allItems, category = 'pierce') {
        if (!charData) return;

        const selectedSet = category === 'pierce' ? this.selectedPierceItems : this.selectedDefenseItems;
        const charName = charData.name || charData.character;

        allItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            const typeStr = String(item.type || '');
            const itemSource = item.source || '';
            const itemTarget = item.target || '';
            const isRitualType = typeStr.match(/의식\d+/);
            const isWeaponType = typeStr === '전용무기';
            
            // 방어력 감소: 전부 체크
            if (category === 'defense') {
                selectedSet.add(itemId);
                return;
            }

            // 관통 - 자신: 현재 캐릭터 것만 체크 (의식n/전용무기 제외)
            if (itemTarget === '자신') {
                if (itemSource === charName && !isRitualType && !isWeaponType) {
                    selectedSet.add(itemId);
                }
                return;
            }

            // 관통 - 버프 (단일 제외한 광역 등): 의식n/전용무기 제외하고 전부 체크
            if (itemTarget !== '단일') {
                if (!isRitualType && !isWeaponType) {
                    selectedSet.add(itemId);
                }
            }
        });
    }

    /**
     * Auto-select items based on slot settings (ritual level, weapon refinement)
     * Called when slot ritual/modification changes
     */
    autoSelectBySlotSettings(charData, allItems) {
        if (!charData) return;

        const ritual = parseInt(charData.ritual, 10) || 0;
        const modification = charData.modification;
        const modNum = (modification && modification !== '-') ? parseInt(modification, 10) : -1;

        allItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            const typeStr = String(item.type || '');

            // 1. 전용무기 타입: 개조 드롭다운 값에 따라 해당 옵션 자동 선택
            // Support for 개조5&6 style options (& grouped)
            if (typeStr === '전용무기' && item.options && item.options.length > 0 && modNum >= 0) {
                // Find option that matches: 개조N or 개조X&Y where modNum is in range
                const targetOption = item.options.find(opt => {
                    // Check for exact match like 개조6
                    if (opt === `개조${modNum}`) return true;
                    // Check for range match like 개조5&6
                    const rangeMatch = opt.match(/개조(\d+)&(\d+)/);
                    if (rangeMatch) {
                        const low = parseInt(rangeMatch[1], 10);
                        const high = parseInt(rangeMatch[2], 10);
                        if (modNum >= low && modNum <= high) return true;
                    }
                    // Check for single match within text like 개조0&1 → modNum 0 or 1
                    const singleMatch = opt.match(/개조(\d+)/);
                    if (singleMatch && !rangeMatch) {
                        // Also check if it's part of a range pattern
                        const nums = opt.match(/\d+/g);
                        if (nums && nums.length > 1) {
                            // Multiple numbers like 개조0&1
                            return nums.some(n => parseInt(n, 10) === modNum);
                        }
                        return parseInt(singleMatch[1], 10) === modNum;
                    }
                    return false;
                });
                if (targetOption) {
                    item._selectedOption = targetOption;
                    if (item.values && item.values[targetOption] !== undefined) {
                        item.value = item.values[targetOption];
                    }
                    this.selectedItems.add(itemId);
                }
            }

            // 2. 의식N 타입: 해당 캐릭터의 의식 값이 해당 타입 이상이면 자동 체크
            const ritualMatch = typeStr.match(/의식(\d+)/);
            if (ritualMatch) {
                const requiredRitual = parseInt(ritualMatch[1], 10);
                const itemSource = item.source || '';
                
                // Find the party member that matches this item's source
                const party = this.store.state.party || [];
                const sourceMember = party.find(m => m && m.name === itemSource);
                
                if (sourceMember) {
                    const sourceRitual = parseInt(sourceMember.ritual, 10) || 0;
                    // Auto-select if source character's ritual level is >= required ritual level
                    if (requiredRitual === 0 || sourceRitual >= requiredRitual) {
                        this.selectedItems.add(itemId);
                    }
                }
            }
            
            // 3. 계시 타입 (자신 아이템): 자동 선택
            if (typeStr === '계시' && item.source && item.source !== '공통' && item.source !== '원더') {
                this.selectedItems.add(itemId);
            }
        });
    }

    /**
     * Initial auto-selection for a slot (called only once when no saved selections exist)
     */
    _initialAutoSelect(charData, buffItems, selfItems, penetrateSelfItems, penetrateBuffItems, defenseReduceItems) {
        if (!charData) return;
        
        // Critical items
        this.autoSelectBySlotSettings(charData, [...buffItems, ...selfItems]);
        this.ensureDefaultSelected(buffItems);
        
        // Pierce/Defense items
        this.autoSelectPierceBySlotSettings(charData, [...penetrateSelfItems, ...penetrateBuffItems], 'pierce');
        this.autoSelectPierceBySlotSettings(charData, defenseReduceItems, 'defense');
    }
    
    /**
     * Handle character change - auto-select items where the new character is the source
     * @param {string} newCharName - The new character's name
     * @param {string} oldCharName - The old character's name (optional)
     */
    onCharacterChange(newCharName, oldCharName = null) {
        if (!newCharName) return;
        
        const buffItems = this.getApplicableBuffItems();
        const selfItems = this.getApplicableSelfItems({ name: newCharName });
        const allItems = [...buffItems, ...selfItems];
        
        // Remove items from old character
        if (oldCharName) {
            allItems.forEach(item => {
                const itemId = String(item.id || `${item.source}_${item.skillName}`);
                if (item.source === oldCharName) {
                    this.selectedItems.delete(itemId);
                }
            });
        }
        
        // Auto-select items from new character (except 의식/전용무기 types)
        allItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            const typeStr = String(item.type || '');
            const isRitualType = typeStr.match(/의식\d+/);
            const isWeaponType = typeStr === '전용무기';
            
            if (item.source === newCharName && !isRitualType && !isWeaponType) {
                this.selectedItems.add(itemId);
            }
        });
        
        // Same for pierce items
        const { selfItems: penetrateSelfItems, buffItems: penetrateBuffItems } = this.getApplicablePenetrateItems({ name: newCharName });
        const allPierceItems = [...penetrateSelfItems, ...penetrateBuffItems];
        
        if (oldCharName) {
            allPierceItems.forEach(item => {
                const itemId = String(item.id || `${item.source}_${item.skillName}`);
                if (item.source === oldCharName) {
                    this.selectedPierceItems.delete(itemId);
                }
            });
        }
        
        allPierceItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            const typeStr = String(item.type || '');
            const isRitualType = typeStr.match(/의식\d+/);
            const isWeaponType = typeStr === '전용무기';
            
            if (item.source === newCharName && item.target === '자신' && !isRitualType && !isWeaponType) {
                this.selectedPierceItems.add(itemId);
            }
        });
    }
    
    /**
     * Handle ritual level change - auto-select/deselect 의식N type items for the changed character
     * @param {string} charName - The character whose ritual level changed
     * @param {number} newRitual - The new ritual level
     */
    onRitualChange(charName, newRitual) {
        if (!charName) return;
        
        const buffItems = this.getApplicableBuffItems();
        const selfItems = this.getApplicableSelfItems({ name: charName });
        const allItems = [...buffItems, ...selfItems];
        
        allItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            const typeStr = String(item.type || '');
            const ritualMatch = typeStr.match(/의식(\d+)/);
            
            if (ritualMatch && item.source === charName) {
                const requiredRitual = parseInt(ritualMatch[1], 10);
                if (newRitual >= requiredRitual) {
                    this.selectedItems.add(itemId);
                } else {
                    this.selectedItems.delete(itemId);
                }
            }
        });
        
        // Same for pierce items
        const { selfItems: penetrateSelfItems, buffItems: penetrateBuffItems } = this.getApplicablePenetrateItems({ name: charName });
        const allPierceItems = [...penetrateSelfItems, ...penetrateBuffItems];
        
        allPierceItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            const typeStr = String(item.type || '');
            const ritualMatch = typeStr.match(/의식(\d+)/);
            
            if (ritualMatch && item.source === charName) {
                const requiredRitual = parseInt(ritualMatch[1], 10);
                if (newRitual >= requiredRitual) {
                    this.selectedPierceItems.add(itemId);
                } else {
                    this.selectedPierceItems.delete(itemId);
                }
            }
        });
    }
    
    /**
     * Handle modification change - auto-select/deselect 전용무기 type items for the slot character
     * @param {object} charData - The character data for the slot
     * @param {number} newMod - The new modification level
     */
    onModificationChange(charData, newMod) {
        if (!charData || !charData.name) return;
        
        const buffItems = this.getApplicableBuffItems();
        const selfItems = this.getApplicableSelfItems(charData);
        const allItems = [...buffItems, ...selfItems];
        
        allItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            const typeStr = String(item.type || '');
            
            if (typeStr === '전용무기' && item.source === charData.name) {
                if (newMod >= 0 && item.options && item.options.length > 0) {
                    // Find matching option
                    const targetOption = item.options.find(opt => {
                        if (opt === `개조${newMod}`) return true;
                        const rangeMatch = opt.match(/개조(\d+)&(\d+)/);
                        if (rangeMatch) {
                            const low = parseInt(rangeMatch[1], 10);
                            const high = parseInt(rangeMatch[2], 10);
                            return newMod >= low && newMod <= high;
                        }
                        const nums = opt.match(/\d+/g);
                        if (nums && nums.length > 1) {
                            return nums.some(n => parseInt(n, 10) === newMod);
                        }
                        const singleMatch = opt.match(/개조(\d+)/);
                        if (singleMatch) {
                            return parseInt(singleMatch[1], 10) === newMod;
                        }
                        return false;
                    });
                    
                    if (targetOption) {
                        item._selectedOption = targetOption;
                        if (item.values && item.values[targetOption] !== undefined) {
                            item.value = item.values[targetOption];
                        }
                        this.selectedItems.add(itemId);
                    } else {
                        this.selectedItems.delete(itemId);
                        delete item._selectedOption;
                    }
                } else {
                    this.selectedItems.delete(itemId);
                    delete item._selectedOption;
                }
            }
        });
    }

    renderPanel(charData, slotIndex) {
        this.slotCharData = charData;
        this.isElucidator = (slotIndex === 3);
        this.currentSlotIndex = slotIndex;
        const container = document.createElement('div');
        container.className = 'need-stat-card-accordion';
        container.dataset.slotIndex = slotIndex;

        const labels = this.getLabels();
        const { labelCritical, labelPierce, labelBuff, labelSelf, labelNoItems, labelRevSum, labelExtraSum, labelPending } = labels;

        // Elucidator slot: show only custom inputs for critical/pierce that affect all other slots
        if (this.isElucidator) {
            container.innerHTML = `
                <div class="need-stat-columns">
                    <div class="need-stat-column need-stat-column-critical">
                        <div class="need-stat-column-header">
                            <span>${labelCritical}</span>
                            ${this.renderTotalPairHtml(slotIndex, getGlobalElucidatorCritical(), 'critical')}
                        </div>
                        <div class="need-stat-body open">
                            <div class="need-stat-elucidator-input-row">
                                <input type="number" class="need-stat-elucidator-input" data-stat="critical" value="${getGlobalElucidatorCritical()}" min="0" max="100" step="0.1">
                            </div>
                        </div>
                    </div>
                    <div class="need-stat-column need-stat-column-pierce">
                        <div class="need-stat-column-header">
                            <span>${labelPierce}</span>
                            ${this.renderTotalPairHtml(slotIndex, getGlobalElucidatorPierce(), 'pierce')}
                        </div>
                        <div class="need-stat-body open">
                            <div class="need-stat-elucidator-input-row">
                                <input type="number" class="need-stat-elucidator-input" data-stat="pierce" value="${getGlobalElucidatorPierce()}" min="0" max="100" step="0.1">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.bindElucidatorEvents(container, slotIndex);
            return container;
        }

        // 저장된 선택 상태 로드 시도
        const hasStoredSelections = this.loadSelectionsFromStore(slotIndex);
        
        // Normal slot: show buff/self items with revelation sum per column
        const buffItems = this.getApplicableBuffItems();
        const selfItems = this.getApplicableSelfItems(charData);

        // Get pierce items (penetrate + defense reduce)
        const { selfItems: penetrateSelfItems, buffItems: penetrateBuffItems } = this.getApplicablePenetrateItems(charData);
        const defenseReduceItems = this.getApplicableDefenseReduceItems(charData);
        
        // 저장된 선택이 없을 때만 초기 자동 선택 적용 (최초 1회)
        if (!hasStoredSelections) {
            this._initialAutoSelect(charData, buffItems, selfItems, penetrateSelfItems, penetrateBuffItems, defenseReduceItems);
            // 초기 선택 후 즉시 저장
            this.saveSelectionsToStore(slotIndex);
        }

        const { labelExtraPierce, labelExtraDefenseReduce, labelPenetrateSelf, labelPenetrateBuff, labelDefenseReduce, labelRemainingDefense, labelRequiredPierce } = labels;

        const critTotal = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + this.extraSumCritical + getGlobalElucidatorCritical();
        
        // Calculate pierce totals
        const penetrateFromItems = this.calculatePierceTotal(penetrateSelfItems, penetrateBuffItems);
        const defenseReduceFromItems = this.calculateDefenseReduceTotal(defenseReduceItems);
        const totalDefenseReduce = defenseReduceFromItems + this.extraDefenseReduce;
        const pierceTotal = penetrateFromItems + this.revelationSumPierce + this.extraSumPierce + getGlobalElucidatorPierce();
        
        // Calculate remaining defense and pierce target/needed
        const defenseStats = this.calculateDefenseStats(penetrateFromItems, totalDefenseReduce);
        const remainingDefense = defenseStats.remainingDefense;
        const pierceTarget = parseFloat(defenseStats.pierceTarget);
        const pierceNeeded = parseFloat(defenseStats.pierceNeeded);

        container.innerHTML = `
            <div class="need-stat-columns">
                <div class="need-stat-column need-stat-column-critical">
                    <div class="need-stat-column-header">
                        <span>${labelCritical}</span>
                        ${this.renderTotalPairHtml(slotIndex, critTotal, 'critical')}
                    </div>
                    <div class="need-stat-rev-sum-row">
                        <label class="need-stat-rev-sum-label"><img src="${this.baseUrl}/assets/img/nav/qishi.png" alt="" class="need-stat-rev-icon">${labelRevSum}</label>
                        <input type="number" class="need-stat-rev-sum-input" data-stat="critical" value="${this.revelationSumCritical}" min="0" max="100" step="0.1">
                        <label class="need-stat-rev-sum-label need-stat-extra-label">${labelExtraSum}</label>
                        <input type="number" class="need-stat-extra-sum-input" data-stat="critical" value="${this.extraSumCritical}" min="0" max="100" step="0.1">
                    </div>
                    <div class="need-stat-body open">
                        ${selfItems.length > 0 ? `
                        <div class="need-stat-section">
                            <div class="need-stat-section-title">${labelSelf}</div>
                            ${selfItems.map(item => this.renderItemRow(item, true)).join('')}
                        </div>
                        ` : ''}
                        <div class="need-stat-section">
                            <div class="need-stat-section-title">${labelBuff}</div>
                            ${buffItems.map(item => this.renderItemRow(item, false)).join('')}
                        </div>
                    </div>
                </div>
                <div class="need-stat-column need-stat-column-pierce">
                    <div class="need-stat-column-header">
                        <span>${labelPierce}</span>
                        <span class="need-stat-defense-info-inline">
                            <span class="need-stat-defense-label">${labelRemainingDefense}</span>
                            <span class="need-stat-defense-value" data-slot-index="${slotIndex}">${remainingDefense}%</span>
                            <span class="need-stat-defense-sep">/</span>
                            <span class="need-stat-defense-label">${labelRequiredPierce}</span>
                            <span class="need-stat-defense-required">${pierceTarget.toFixed(1)}%</span>
                        </span>
                        <span class="need-stat-total need-stat-total-inline" data-slot-index="${slotIndex}" data-stat-type="pierce">
                            <span class="need-stat-current">${pierceTotal.toFixed(1)}%</span>
                        </span>
                    </div>
                    <div class="need-stat-rev-sum-row">
                        <label class="need-stat-rev-sum-label"><img src="${this.baseUrl}/assets/img/nav/qishi.png" alt="" class="need-stat-rev-icon">${labelRevSum}</label>
                        <input type="number" class="need-stat-rev-sum-input" data-stat="pierce" value="${this.revelationSumPierce}" min="0" max="100" step="0.1">
                        <label class="need-stat-rev-sum-label need-stat-extra-label">${labelExtraPierce}</label>
                        <input type="number" class="need-stat-extra-sum-input" data-stat="pierce" value="${this.extraSumPierce}" min="0" max="100" step="0.1">
                        <label class="need-stat-rev-sum-label need-stat-extra-label">${labelExtraDefenseReduce}</label>
                        <input type="number" class="need-stat-extra-defense-input" value="${this.extraDefenseReduce}" min="0" max="100" step="0.1">
                    </div>
                    ${this.renderBossSettingsRow()}
                    <div class="need-stat-body open">
                        ${penetrateSelfItems.length > 0 ? `
                        <div class="need-stat-section">
                            <div class="need-stat-section-title">${labelPenetrateSelf}</div>
                            ${penetrateSelfItems.map(item => this.renderPierceItemRow(item, 'pierce')).join('')}
                        </div>
                        ` : ''}
                        ${penetrateBuffItems.length > 0 ? `
                        <div class="need-stat-section">
                            <div class="need-stat-section-title">${labelPenetrateBuff}</div>
                            ${this.sortItemsByCurrentChar(penetrateBuffItems, charData).map(item => this.renderPierceItemRow(item, 'pierce')).join('')}
                        </div>
                        ` : ''}
                        ${defenseReduceItems.length > 0 ? `
                        <div class="need-stat-section">
                            <div class="need-stat-section-title">${labelDefenseReduce}</div>
                            ${this.sortItemsByCurrentChar(defenseReduceItems, charData).map(item => this.renderPierceItemRow(item, 'defense')).join('')}
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        this.bindEvents(container, buffItems, selfItems, slotIndex);
        this.bindPierceEvents(container, penetrateSelfItems, penetrateBuffItems, defenseReduceItems, slotIndex);
        
        // Load CSV name map for boss name translation, then re-render boss dropdown
        try {
            this.ensureCsvNameMapLoaded().then(() => {
                // Re-render boss dropdown with translated names
                this.updateBossDropdownList(container);
                // Update boss button name
                const bossNameEl = container.querySelector('.need-stat-boss-name');
                const bossData = window.bossData || [];
                const currentBoss = bossData.find(b => b.id === _getGlobalBossSettings().bossId);
                if (bossNameEl && currentBoss) {
                    bossNameEl.textContent = this.getBossDisplayName(currentBoss);
                }
            });
        } catch(_) {}
        
        // Apply i18n translations (same as defense-calc.js and critical-calc.js)
        try { if (typeof window.DefenseI18N !== 'undefined' && window.DefenseI18N.enrichDefenseDataWithWonderNames) { window.DefenseI18N.enrichDefenseDataWithWonderNames(); } } catch(_) {}
        try { if (typeof window.I18NUtils !== 'undefined' && window.I18NUtils.translateStatTexts) { window.I18NUtils.translateStatTexts(container); } } catch(_) {}
        
        return container;
    }

    /**
     * Bind events for elucidator slot (custom inputs that affect all slots)
     */
    bindElucidatorEvents(container, slotIndex) {
        container.querySelectorAll('.need-stat-elucidator-input').forEach(input => {
            input.addEventListener('input', (e) => {
                e.stopPropagation();
                const statType = input.dataset.stat;
                const val = parseFloat(input.value) || 0;
                
                if (statType === 'critical') {
                    _setElucidatorBonuses(val, getGlobalElucidatorPierce());
                } else if (statType === 'pierce') {
                    _setElucidatorBonuses(getGlobalElucidatorCritical(), val);
                }
                
                // Update this slot's display
                this.updateTotalPairDisplays(slotIndex, val, statType);
                
                // Trigger update for all other slots
                this.notifyAllSlotsUpdate();
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        });
    }

    /**
     * Notify all slots to update their totals (called when elucidator values change or shared items change)
     */
    notifyAllSlotsUpdate() {
        // Dispatch custom event that PartyUI can listen to
        window.dispatchEvent(new CustomEvent('elucidator-bonus-changed', {
            detail: { critical: getGlobalElucidatorCritical(), pierce: getGlobalElucidatorPierce() }
        }));
        // Also dispatch event for shared item changes
        window.dispatchEvent(new CustomEvent('shared-item-changed', {
            detail: { 
                sharedDefenseItems: [...globalSharedDefenseItems],
                sharedPierceBuffItems: [...globalSharedPierceBuffItems]
            }
        }));
    }

    /**
     * Get boss-related labels
     */
    getBossLabels() {
        const lang = this.getCurrentLang();
        return {
            labelBoss: lang === 'en' ? 'Boss' : (lang === 'jp' ? 'ボス' : '보스'),
            labelSea: lang === 'en' ? 'Sea' : (lang === 'jp' ? '海' : '바다'),
            labelNightmare: lang === 'en' ? 'Nightmare' : (lang === 'jp' ? '凶夢' : '흉몽'),
            labelDefenseCoef: lang === 'en' ? 'Def Coef' : (lang === 'jp' ? '防御係数' : '방어 계수'),
            labelBaseDefense: lang === 'en' ? 'Base Def' : (lang === 'jp' ? '基本防御' : '기본 방어')
        };
    }

    /**
     * Render boss settings row for pierce column
     */
    renderBossSettingsRow() {
        const { labelBoss, labelSea, labelNightmare, labelDefenseCoef, labelBaseDefense } = this.getBossLabels();
        const bossData = window.bossData || [];
        
        // Filter bosses by current type
        const currentType = _getGlobalBossSettings().bossType;
        const filteredBosses = bossData.filter(b => currentType === 'sea' ? !!b.isSea : !b.isSea);
        
        // If no boss selected or current boss doesn't match type, select first boss
        let currentBoss = bossData.find(b => b.id === _getGlobalBossSettings().bossId);
        if (!currentBoss || (currentType === 'sea' ? !currentBoss.isSea : currentBoss.isSea)) {
            if (filteredBosses.length > 0) {
                currentBoss = filteredBosses[0];
                _setGlobalBossSettings({ bossId: currentBoss.id, defenseCoef: parseFloat(currentBoss.defenseCoef) || 0, baseDefense: parseFloat(currentBoss.baseDefense) || 0 });
            }
        }
        const currentBossName = currentBoss ? this.getBossDisplayName(currentBoss) : '-';
        const currentBossIcon = currentBoss?.img ? `<img src="${this.baseUrl}/assets/img/enemy/${currentBoss.img}" class="need-stat-boss-btn-icon" onerror="this.style.display='none'">` : '';
        
        return `
            <div class="need-stat-boss-row">
                <div class="need-stat-boss-header">
                    <button type="button" class="need-stat-boss-tab ${currentType === 'sea' ? 'active' : ''}" data-boss-type="sea">
                        <img src="${this.baseUrl}/assets/img/ui/바다.png" alt="" class="need-stat-boss-type-icon">
                        <span>${labelSea}</span>
                    </button>
                    <button type="button" class="need-stat-boss-tab ${currentType === 'nightmare' ? 'active' : ''}" data-boss-type="nightmare">
                        <img src="${this.baseUrl}/assets/img/ui/흉몽.png" alt="" class="need-stat-boss-type-icon">
                        <span>${labelNightmare}</span>
                    </button>
                </div>
                <div class="need-stat-boss-content need-stat-boss-content-2col">
                    <div class="need-stat-boss-select-wrapper">
                        <div class="revelation-dropdown need-stat-boss-dropdown">
                            <button type="button" class="revelation-button need-stat-boss-button">
                                ${currentBossIcon}
                                <span class="need-stat-boss-name">${currentBossName}</span>
                            </button>
                            <div class="revelation-menu need-stat-boss-menu">
                                ${filteredBosses.map(boss => `
                                    <div class="revelation-option need-stat-boss-option ${boss.id === _getGlobalBossSettings().bossId ? 'selected' : ''}" data-boss-id="${boss.id}">
                                        ${boss.img ? `<img src="${this.baseUrl}/assets/img/enemy/${boss.img}" class="need-stat-boss-option-icon" onerror="this.style.display='none'">` : ''}
                                        <span>${this.getBossDisplayName(boss)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="need-stat-boss-stat">
                        <label>${labelDefenseCoef}</label>
                        <input type="number" class="need-stat-boss-input" data-boss-stat="defenseCoef" value="${_getGlobalBossSettings().defenseCoef}" step="0.1">
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get boss display name based on current language (following defense-calc.js pattern)
     */
    getBossDisplayName(boss) {
        const lang = this.getCurrentLang();
        let baseName = boss.name || '';
        
        // Use name_en/name_jp if available
        if (lang === 'en' && boss.name_en) baseName = boss.name_en;
        else if (lang === 'jp' && boss.name_jp) baseName = boss.name_jp;
        
        // Apply CSV name mapping (for names like "비슈누 / 화신" -> "Vishnu / Mini")
        if (lang !== 'kr' && baseName) {
            try {
                const mapped = this.mapNameUsingCsv(baseName, lang);
                if (mapped && mapped.trim() && mapped !== baseName) baseName = mapped;
            } catch(_) {}
        }
        
        return baseName;
    }

    /**
     * Ensure CSV name map is loaded (following defense-calc.js pattern)
     */
    async ensureCsvNameMapLoaded() {
        if (this._csvNameMap) return this._csvNameMap;
        if (!this._csvLoadPromise) {
            const url = `${this.baseUrl}/data/kr/wonder/persona_skill_from.csv?v=${typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1'}`;
            this._csvLoadPromise = fetch(url)
                .then(r => r.text())
                .then(text => {
                    const map = {};
                    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
                    // skip header
                    for (let i = 1; i < lines.length; i++) {
                        const row = lines[i].split(',');
                        if (row.length < 3) continue;
                        const kr = row[0]?.trim();
                        const en = row[1]?.trim();
                        const jp = row[2]?.trim();
                        if (kr) map[kr] = { en, jp };
                    }
                    this._csvNameMap = map;
                    return map;
                })
                .catch(_ => (this._csvNameMap = {}));
        }
        return this._csvLoadPromise;
    }

    /**
     * Map name using CSV (following defense-calc.js pattern)
     */
    mapNameUsingCsv(nameKr, lang) {
        if (!nameKr) return null;
        const map = this._csvNameMap;
        if (!map) return null;
        const parts = String(nameKr).split('/').map(s => s.trim()).filter(Boolean);
        const out = parts.map(part => {
            const rec = map[part];
            if (!rec) return part;
            if (lang === 'en' && rec.en) return rec.en;
            if (lang === 'jp' && rec.jp) return rec.jp;
            return part;
        });
        return out.join(' / ');
    }

    /**
     * Bind boss settings events
     */
    bindBossEvents(container) {
        // Boss type tabs
        container.querySelectorAll('.need-stat-boss-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.stopPropagation();
                const bossType = tab.dataset.bossType;
                _setGlobalBossSettings({ bossType });
                
                // Update tab active state
                container.querySelectorAll('.need-stat-boss-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Re-render boss list
                this.updateBossDropdownList(container);
            });
        });

        // Boss dropdown toggle
        const bossDropdown = container.querySelector('.need-stat-boss-dropdown');
        const bossButton = container.querySelector('.need-stat-boss-button');
        const bossMenu = container.querySelector('.need-stat-boss-menu');
        
        if (bossButton && bossMenu) {
            bossButton.addEventListener('click', (e) => {
                e.stopPropagation();
                bossDropdown.classList.toggle('open');
            });
            
            // Close on outside click
            document.addEventListener('click', () => {
                bossDropdown?.classList.remove('open');
            });
        }

        // Boss option selection
        container.querySelectorAll('.need-stat-boss-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const bossId = parseInt(option.dataset.bossId);
                this.selectBoss(bossId, container);
                bossDropdown?.classList.remove('open');
            });
        });

        // Boss stat inputs
        container.querySelectorAll('.need-stat-boss-input').forEach(input => {
            input.addEventListener('input', (e) => {
                e.stopPropagation();
                const statName = input.dataset.bossStat;
                const val = parseFloat(input.value) || 0;
                _setGlobalBossSettings({ [statName]: val });
                
                // defenseCoef 변경 시 pierce 계산 업데이트 트리거
                if (statName === 'defenseCoef' || statName === 'baseDefense') {
                    window.dispatchEvent(new CustomEvent('boss-settings-changed', {
                        detail: { [statName]: val }
                    }));
                }
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        });
    }

    /**
     * Update boss dropdown list based on current type
     */
    updateBossDropdownList(container) {
        const bossMenu = container.querySelector('.need-stat-boss-menu');
        if (!bossMenu) return;
        
        const bossData = window.bossData || [];
        const currentType = _getGlobalBossSettings().bossType;
        const filteredBosses = bossData.filter(b => currentType === 'sea' ? !!b.isSea : !b.isSea);
        
        // Auto-select first boss of the new type
        if (filteredBosses.length > 0) {
            const firstBoss = filteredBosses[0];
            this.selectBoss(firstBoss.id, container);
        }
        
        bossMenu.innerHTML = filteredBosses.map(boss => `
            <div class="revelation-option need-stat-boss-option ${boss.id === _getGlobalBossSettings().bossId ? 'selected' : ''}" data-boss-id="${boss.id}">
                ${boss.img ? `<img src="${this.baseUrl}/assets/img/enemy/${boss.img}" class="need-stat-boss-option-icon" onerror="this.style.display='none'">` : ''}
                <span class="need-stat-boss-option-name">${this.getBossDisplayName(boss)}</span>
            </div>
        `).join('');
        
        // Apply i18n translations to boss menu
        try { if (typeof window.I18NUtils !== 'undefined' && window.I18NUtils.translateStatTexts) { window.I18NUtils.translateStatTexts(bossMenu); } } catch(_) {}
        
        // Re-bind option events
        bossMenu.querySelectorAll('.need-stat-boss-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const bossId = parseInt(option.dataset.bossId);
                this.selectBoss(bossId, container);
                container.querySelector('.need-stat-boss-dropdown')?.classList.remove('open');
            });
        });
    }

    /**
     * Select a boss and update inputs
     */
    selectBoss(bossId, container) {
        const bossData = window.bossData || [];
        const boss = bossData.find(b => b.id === bossId);
        if (!boss) return;
        
        _setGlobalBossSettings({ bossId, baseDefense: parseFloat(boss.baseDefense) || 0, defenseCoef: parseFloat(boss.defenseCoef) || 0 });
        
        // Update UI - name
        const nameEl = container.querySelector('.need-stat-boss-name');
        if (nameEl) nameEl.textContent = this.getBossDisplayName(boss);
        
        // Update UI - button icon
        const bossButton = container.querySelector('.need-stat-boss-button');
        if (bossButton) {
            let iconEl = bossButton.querySelector('.need-stat-boss-btn-icon');
            if (boss.img) {
                if (!iconEl) {
                    iconEl = document.createElement('img');
                    iconEl.className = 'need-stat-boss-btn-icon';
                    iconEl.onerror = function() { this.style.display = 'none'; };
                    bossButton.insertBefore(iconEl, bossButton.firstChild);
                }
                iconEl.src = `${this.baseUrl}/assets/img/enemy/${boss.img}`;
                iconEl.style.display = '';
            } else if (iconEl) {
                iconEl.style.display = 'none';
            }
        }
        
        const baseDefInput = container.querySelector('.need-stat-boss-input[data-boss-stat="baseDefense"]');
        const defCoefInput = container.querySelector('.need-stat-boss-input[data-boss-stat="defenseCoef"]');
        if (baseDefInput) baseDefInput.value = _getGlobalBossSettings().baseDefense;
        if (defCoefInput) defCoefInput.value = _getGlobalBossSettings().defenseCoef;
        
        // Update selected state in dropdown
        container.querySelectorAll('.need-stat-boss-option').forEach(opt => {
            opt.classList.toggle('selected', parseInt(opt.dataset.bossId) === bossId);
        });
    }

    /**
     * Bind critical card events
     */
    bindEvents(container, buffItems, selfItems, slotIndex) {
        // Bind boss settings events
        this.bindBossEvents(container);
        
        // Revelation Sum inputs (one per column)
        container.querySelectorAll('.need-stat-rev-sum-input').forEach(revSumInput => {
            revSumInput.addEventListener('input', (e) => {
                e.stopPropagation();
                const statType = revSumInput.dataset.stat;
                const val = parseFloat(revSumInput.value) || 0;
                
                if (statType === 'critical') {
                    this.revelationSumCritical = val;
                    const total = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + this.extraSumCritical + getGlobalElucidatorCritical();
                    this.updateTotalPairDisplays(slotIndex, total, 'critical');
                    this.saveSelectionsToStore(slotIndex);
                } else if (statType === 'pierce') {
                    this.revelationSumPierce = val;
                    // Recalculate pierce total including items
                    const { selfItems: penetrateSelfItems, buffItems: penetrateBuffItems } = this.getApplicablePenetrateItems(this.slotCharData);
                    const penetrateFromItems = this.calculatePierceTotal(penetrateSelfItems, penetrateBuffItems);
                    const total = penetrateFromItems + this.revelationSumPierce + this.extraSumPierce + getGlobalElucidatorPierce();
                    this.updateTotalPairDisplays(slotIndex, total, 'pierce');
                    
                    // Update defense info display
                    const defenseReduceItems = this.getApplicableDefenseReduceItems(this.slotCharData);
                    const defenseReduceFromItems = this.calculateDefenseReduceTotal(defenseReduceItems);
                    const { remainingDefense, pierceTarget } = this.calculateDefenseStats(penetrateFromItems, defenseReduceFromItems);
                    const neededPierce = Math.max(0, parseFloat(pierceTarget) - total);
                    
                    // Update header displays
                    const defenseValueEl = container.querySelector('.need-stat-defense-value');
                    const defenseRequiredEl = container.querySelector('.need-stat-defense-required');
                    const currentEl = container.querySelector('.need-stat-total-inline[data-stat-type="pierce"] .need-stat-current');
                    if (defenseValueEl) defenseValueEl.textContent = `${remainingDefense}%`;
                    if (defenseRequiredEl) defenseRequiredEl.textContent = `${pierceTarget}%`;
                    if (currentEl) currentEl.textContent = `${total.toFixed(1)}%`;
                    
                    // Update trigger table
                    const triggerEl = document.querySelector(`.need-stat-trigger[data-slot-index="${slotIndex}"]`);
                    const triggerTable = triggerEl?.querySelector('.need-stat-trigger-table');
                    if (triggerTable) {
                        const triggerPierceTargetEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-target');
                        const triggerPierceCurrentEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-current');
                        const triggerPierceNeededEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-needed');
                        if (triggerPierceTargetEl) triggerPierceTargetEl.textContent = `${pierceTarget}%`;
                        if (triggerPierceCurrentEl) triggerPierceCurrentEl.textContent = `${total.toFixed(1)}%`;
                        if (triggerPierceNeededEl) triggerPierceNeededEl.textContent = `${neededPierce.toFixed(1)}%`;
                    }
                    this.saveSelectionsToStore(slotIndex);
                }
            });
            revSumInput.addEventListener('click', (e) => e.stopPropagation());
        });

        // Extra Sum inputs (별도 수치)
        container.querySelectorAll('.need-stat-extra-sum-input').forEach(extraSumInput => {
            extraSumInput.addEventListener('input', (e) => {
                e.stopPropagation();
                const statType = extraSumInput.dataset.stat;
                const val = parseFloat(extraSumInput.value) || 0;
                
                if (statType === 'critical') {
                    this.extraSumCritical = val;
                    const total = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + this.extraSumCritical + getGlobalElucidatorCritical();
                    this.updateTotalPairDisplays(slotIndex, total, 'critical');
                    this.saveSelectionsToStore(slotIndex);
                } else if (statType === 'pierce') {
                    this.extraSumPierce = val;
                    // Recalculate pierce total including items
                    const { selfItems: penetrateSelfItems, buffItems: penetrateBuffItems } = this.getApplicablePenetrateItems(this.slotCharData);
                    const penetrateFromItems = this.calculatePierceTotal(penetrateSelfItems, penetrateBuffItems);
                    const total = penetrateFromItems + this.revelationSumPierce + this.extraSumPierce + getGlobalElucidatorPierce();
                    this.updateTotalPairDisplays(slotIndex, total, 'pierce');
                    
                    // Update defense info display
                    const defenseReduceItems = this.getApplicableDefenseReduceItems(this.slotCharData);
                    const defenseReduceFromItems = this.calculateDefenseReduceTotal(defenseReduceItems);
                    const { remainingDefense, pierceTarget: extraPierceTarget } = this.calculateDefenseStats(penetrateFromItems, defenseReduceFromItems);
                    const neededPierce = Math.max(0, parseFloat(extraPierceTarget) - total);
                    
                    // Update header displays
                    const defenseValueEl = container.querySelector('.need-stat-defense-value');
                    const defenseRequiredEl = container.querySelector('.need-stat-defense-required');
                    const currentEl = container.querySelector('.need-stat-total-inline[data-stat-type="pierce"] .need-stat-current');
                    if (defenseValueEl) defenseValueEl.textContent = `${remainingDefense}%`;
                    if (defenseRequiredEl) defenseRequiredEl.textContent = `${extraPierceTarget}%`;
                    if (currentEl) currentEl.textContent = `${total.toFixed(1)}%`;
                    
                    // Update trigger table
                    const triggerEl = document.querySelector(`.need-stat-trigger[data-slot-index="${slotIndex}"]`);
                    const triggerTable = triggerEl?.querySelector('.need-stat-trigger-table');
                    if (triggerTable) {
                        const triggerPierceTargetEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-target');
                        const triggerPierceCurrentEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-current');
                        const triggerPierceNeededEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-needed');
                        if (triggerPierceTargetEl) triggerPierceTargetEl.textContent = `${extraPierceTarget}%`;
                        if (triggerPierceCurrentEl) triggerPierceCurrentEl.textContent = `${total.toFixed(1)}%`;
                        if (triggerPierceNeededEl) triggerPierceNeededEl.textContent = `${neededPierce.toFixed(1)}%`;
                    }
                }
            });
            extraSumInput.addEventListener('click', (e) => e.stopPropagation());
        });

        // Item row click (whole row toggles check) - ONLY for critical items (no data-category)
        container.querySelectorAll('.need-stat-row:not([data-category])').forEach(row => {
            const checkEl = row.querySelector('.need-stat-check');
            if (!checkEl) return;

            const toggleCheck = (e) => {
                e.stopPropagation();
                const itemId = row.dataset.itemId;
                if (!itemId) return;

                if (this.selectedItems.has(itemId)) {
                    this.selectedItems.delete(itemId);
                    row.classList.remove('checked');
                    checkEl.src = `${this.baseUrl}/assets/img/ui/check-off.png`;
                    checkEl.classList.add('check-off');
                } else {
                    this.selectedItems.add(itemId);
                    row.classList.add('checked');
                    checkEl.src = `${this.baseUrl}/assets/img/ui/check-on.png`;
                    checkEl.classList.remove('check-off');
                }

                const total = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + this.extraSumCritical + getGlobalElucidatorCritical();
                this.updateTotalPairDisplays(slotIndex, total, 'critical');
                
                // 선택 상태 저장
                this.saveSelectionsToStore(slotIndex);
            };

            // Click on row or check icon both toggle
            row.addEventListener('click', toggleCheck);
        });

        // Option select change
        container.querySelectorAll('.need-stat-select').forEach(select => {
            select.addEventListener('click', (e) => e.stopPropagation());
            select.addEventListener('change', (e) => {
                e.stopPropagation();
                const itemId = select.dataset.itemId;
                const selectedOption = select.value;
                const row = select.closest('.need-stat-row');
                const valueEl = row ? row.querySelector('.need-stat-value') : null;

                const allItems = [...buffItems, ...selfItems];
                const item = allItems.find(i => (i.id || `${i.source}_${i.skillName}`) === itemId);

                if (item && item.values && item.values[selectedOption] !== undefined) {
                    const newBaseValue = item.values[selectedOption];
                    item._selectedOption = selectedOption;
                    
                    // J&C jc1인 경우 페르소나 성능 적용
                    if (String(itemId) === 'jc1') {
                        item.__baseValue = newBaseValue;
                        const personaInput = row ? row.querySelector('.need-stat-persona-input') : null;
                        const N = personaInput ? (parseFloat(personaInput.value) || 100) : 100;
                        const calculatedValue = newBaseValue * (50 + N / 2) / 100;
                        item.value = calculatedValue;
                        if (valueEl) valueEl.textContent = `${calculatedValue.toFixed(2)}%`;
                    } else {
                        item.value = newBaseValue;
                        if (valueEl) valueEl.textContent = `${item.value}%`;
                    }

                    const total = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + this.extraSumCritical + getGlobalElucidatorCritical();
                    this.updateTotalPairDisplays(slotIndex, total, 'critical');
                }
            });
        });
        
        // J&C jc1 크리티컬 섹션 페르소나 성능 입력 필드 이벤트
        container.querySelectorAll('.need-stat-persona-input[data-category="critical"]').forEach(personaInput => {
            personaInput.addEventListener('click', (e) => e.stopPropagation());
            personaInput.addEventListener('input', (e) => {
                e.stopPropagation();
                const itemId = personaInput.dataset.itemId;
                const N = parseFloat(personaInput.value) || 100;
                const row = personaInput.closest('.need-stat-row');
                const valueEl = row ? row.querySelector('.need-stat-value') : null;
                
                const allItems = [...buffItems, ...selfItems];
                const item = allItems.find(i => String(i.id || `${i.source}_${i.skillName}`) === itemId);
                
                if (item) {
                    // 기본값 저장 (처음 한 번만)
                    if (item.__baseValue === undefined) {
                        item.__baseValue = item.value || 0;
                    }
                    
                    const baseValue = item.__baseValue;
                    // jc1: value * (50 + N/2) / 100
                    const calculatedValue = baseValue * (50 + N / 2) / 100;
                    
                    item.value = calculatedValue;
                    if (valueEl) valueEl.textContent = `${calculatedValue.toFixed(2)}%`;
                    
                    // 동일한 jc1 입력 필드들 동기화 (관통 섹션 포함)
                    document.querySelectorAll('.need-stat-jc1-sync').forEach(syncInput => {
                        if (syncInput !== personaInput) {
                            syncInput.value = personaInput.value;
                            // 해당 row의 값도 업데이트
                            const syncRow = syncInput.closest('.need-stat-row');
                            const syncValueEl = syncRow ? syncRow.querySelector('.need-stat-value') : null;
                            if (syncValueEl) {
                                // 해당 아이템의 기본값으로 계산
                                const syncCategory = syncInput.dataset.category;
                                if (syncCategory === 'pierce') {
                                    // 관통 섹션의 jc1도 동일한 공식 적용
                                    syncValueEl.textContent = `${calculatedValue.toFixed(2)}%`;
                                }
                            }
                        }
                    });
                    
                    const total = this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + this.extraSumCritical + getGlobalElucidatorCritical();
                    this.updateTotalPairDisplays(slotIndex, total, 'critical');
                }
            });
        });
    }

    /**
     * Bind pierce/defense item events
     */
    bindPierceEvents(container, penetrateSelfItems, penetrateBuffItems, defenseReduceItems, slotIndex) {
        const allPierceItems = [...penetrateSelfItems, ...penetrateBuffItems];
        const allDefenseItems = defenseReduceItems;

        // Helper to update pierce displays (target/current/needed)
        const updatePierceDisplays = () => {
            const penetrateFromItems = this.calculatePierceTotal(penetrateSelfItems, penetrateBuffItems);
            const defenseReduceFromItems = this.calculateDefenseReduceTotal(defenseReduceItems);
            const totalDefenseReduce = defenseReduceFromItems + this.extraDefenseReduce;
            const pierceTotal = penetrateFromItems + this.revelationSumPierce + this.extraSumPierce + getGlobalElucidatorPierce();
            
            const defenseStats = this.calculateDefenseStats(penetrateFromItems, totalDefenseReduce);
            const remainingDefense = defenseStats.remainingDefense;
            const pierceTarget = parseFloat(defenseStats.pierceTarget);
            const pierceNeeded = parseFloat(defenseStats.pierceNeeded);
            
            // Update pierce target/current/needed in need-stat-container
            const pierceTargetEl = container.querySelector('.need-stat-column-pierce .need-stat-target');
            const pierceCurrentEl = container.querySelector('.need-stat-column-pierce .need-stat-current');
            const pierceNeededEl = container.querySelector('.need-stat-column-pierce .need-stat-needed');
            if (pierceTargetEl) pierceTargetEl.textContent = `${pierceTarget.toFixed(1)}%`;
            if (pierceCurrentEl) pierceCurrentEl.textContent = `${pierceTotal.toFixed(1)}%`;
            if (pierceNeededEl) pierceNeededEl.textContent = `${pierceNeeded.toFixed(1)}%`;
            
            // Update defense info
            const defenseValueEl = container.querySelector('.need-stat-defense-value');
            const defenseRequiredEl = container.querySelector('.need-stat-defense-required');
            if (defenseValueEl) defenseValueEl.textContent = `${remainingDefense}%`;
            if (defenseRequiredEl) defenseRequiredEl.textContent = `${pierceTarget.toFixed(1)}%`;
            
            // Update pierce in need-stat-trigger-table (target/current/needed)
            // Trigger is rendered separately, so search globally by slotIndex
            const triggerEl = document.querySelector(`.need-stat-trigger[data-slot-index="${slotIndex}"]`);
            const triggerTable = triggerEl?.querySelector('.need-stat-trigger-table');
            if (triggerTable) {
                const triggerPierceTargetEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-target');
                const triggerPierceCurrentEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-current');
                const triggerPierceNeededEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-needed');
                if (triggerPierceTargetEl) triggerPierceTargetEl.textContent = `${pierceTarget.toFixed(1)}%`;
                if (triggerPierceCurrentEl) triggerPierceCurrentEl.textContent = `${pierceTotal.toFixed(1)}%`;
                if (triggerPierceNeededEl) triggerPierceNeededEl.textContent = `${pierceNeeded.toFixed(1)}%`;
            }
        };
        
        // boss-settings-changed 이벤트 수신하여 pierce 계산 업데이트
        window.addEventListener('boss-settings-changed', updatePierceDisplays);

        // Item row click for pierce/defense items
        container.querySelectorAll('.need-stat-row[data-category]').forEach(row => {
            const checkEl = row.querySelector('.need-stat-check');
            if (!checkEl) return;

            const toggleCheck = (e) => {
                e.stopPropagation();
                const itemId = row.dataset.itemId;
                const category = row.dataset.category;
                if (!itemId) return;

                const selectedSet = category === 'pierce' ? this.selectedPierceItems : this.selectedDefenseItems;

                if (selectedSet.has(itemId)) {
                    selectedSet.delete(itemId);
                    row.classList.remove('checked');
                    checkEl.src = `${this.baseUrl}/assets/img/ui/check-off.png`;
                    checkEl.classList.add('check-off');
                } else {
                    selectedSet.add(itemId);
                    row.classList.add('checked');
                    checkEl.src = `${this.baseUrl}/assets/img/ui/check-on.png`;
                    checkEl.classList.remove('check-off');
                }

                updatePierceDisplays();
                
                // 선택 상태 저장
                this.saveSelectionsToStore(slotIndex);
            };

            row.addEventListener('click', toggleCheck);
        });

        // Option select change for pierce/defense items
        container.querySelectorAll('.need-stat-options[data-category]').forEach(select => {
            select.addEventListener('click', (e) => e.stopPropagation());
            select.addEventListener('change', (e) => {
                e.stopPropagation();
                const itemId = select.dataset.itemId;
                const category = select.dataset.category;
                const selectedOption = select.value;
                const row = select.closest('.need-stat-row');
                const valueEl = row ? row.querySelector('.need-stat-value') : null;

                const allItems = category === 'pierce' ? allPierceItems : allDefenseItems;
                const item = allItems.find(i => (i.id || `${i.source}_${i.skillName}`) === itemId);

                if (item && item.values && item.values[selectedOption] !== undefined) {
                    const newBaseValue = item.values[selectedOption];
                    item._selectedOption = selectedOption;
                    
                    // J&C 아이템인 경우 페르소나 성능 적용
                    const isJC = (String(itemId) === 'jc1' || String(itemId) === 'jc2');
                    if (isJC) {
                        item.__baseValue = newBaseValue;
                        const personaInput = row ? row.querySelector('.need-stat-persona-input') : null;
                        const N = personaInput ? (parseFloat(personaInput.value) || 100) : 100;
                        
                        let calculatedValue = newBaseValue;
                        if (String(itemId) === 'jc1') {
                            calculatedValue = newBaseValue * (50 + N / 2) / 100;
                        } else if (String(itemId) === 'jc2') {
                            calculatedValue = newBaseValue * N / 100;
                        }
                        
                        item.value = calculatedValue;
                        if (valueEl) valueEl.textContent = `${calculatedValue.toFixed(2)}%`;
                    } else {
                        item.value = newBaseValue;
                        if (valueEl) valueEl.textContent = `${item.value}%`;
                    }

                    updatePierceDisplays();
                }
            });
        });
        
        // Extra Defense Reduce input (별도 방어력 감소)
        container.querySelectorAll('.need-stat-extra-defense-input').forEach(extraDefenseInput => {
            extraDefenseInput.addEventListener('input', (e) => {
                e.stopPropagation();
                const val = parseFloat(extraDefenseInput.value) || 0;
                this.extraDefenseReduce = val;
                updatePierceDisplays();
                this.saveSelectionsToStore(slotIndex);
            });
            extraDefenseInput.addEventListener('click', (e) => e.stopPropagation());
        });
        
        // J&C 페르소나 성능 입력 필드 이벤트 (jc1, jc2)
        container.querySelectorAll('.need-stat-persona-input').forEach(personaInput => {
            personaInput.addEventListener('click', (e) => e.stopPropagation());
            personaInput.addEventListener('input', (e) => {
                e.stopPropagation();
                const itemId = personaInput.dataset.itemId;
                const category = personaInput.dataset.category;
                const N = parseFloat(personaInput.value) || 100;
                const row = personaInput.closest('.need-stat-row');
                const valueEl = row ? row.querySelector('.need-stat-value') : null;
                
                const allItems = category === 'pierce' ? allPierceItems : allDefenseItems;
                const item = allItems.find(i => String(i.id || `${i.source}_${i.skillName}`) === itemId);
                
                if (item) {
                    // 기본값 저장 (처음 한 번만)
                    if (item.__baseValue === undefined) {
                        item.__baseValue = item.value || 0;
                    }
                    
                    const baseValue = item.__baseValue;
                    let calculatedValue = baseValue;
                    
                    // jc1: value/2 + value/2 * N/100 = value * (50 + N/2) / 100
                    if (String(itemId) === 'jc1') {
                        calculatedValue = baseValue * (50 + N / 2) / 100;
                        
                        // jc1은 크리티컬 섹션과 값 동기화
                        document.querySelectorAll('.need-stat-jc1-sync').forEach(syncInput => {
                            if (syncInput !== personaInput) {
                                syncInput.value = personaInput.value;
                                // 해당 row의 값도 업데이트
                                const syncRow = syncInput.closest('.need-stat-row');
                                const syncValueEl = syncRow ? syncRow.querySelector('.need-stat-value') : null;
                                if (syncValueEl) {
                                    syncValueEl.textContent = `${calculatedValue.toFixed(2)}%`;
                                }
                            }
                        });
                    }
                    // jc2: value * N/100
                    else if (String(itemId) === 'jc2') {
                        calculatedValue = baseValue * N / 100;
                    }
                    
                    item.value = calculatedValue;
                    if (valueEl) valueEl.textContent = `${calculatedValue.toFixed(2)}%`;
                    
                    updatePierceDisplays();
                }
            });
        });
    }

}
