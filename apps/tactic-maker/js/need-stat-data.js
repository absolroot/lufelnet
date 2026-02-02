/**
 * Tactic Maker V2 - Need Stat Data Module
 * Data getters, calculators, and auto-selection logic.
 */

import { getGlobalBossSettings, getCurrentLang } from './need-stat-state.js';

// ============================================================================
// Data Getters - Critical
// ============================================================================

/**
 * Get critical buff data items that apply to this party setup
 */
export function getApplicableBuffItems(store) {
    const items = [];
    const buffData = window.criticalBuffData || {};
    const wonderState = store.state.wonder || {};
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
    const party = store.state.party || [];
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
export function getApplicableSelfItems(charData, store) {
    const items = [];
    const selfData = window.criticalSelfData || {};

    if (!charData || !charData.name) return items;

    const mainRev = charData.mainRev || '';
    const subRev = charData.subRev || '';
    const charName = charData.name;

    // 1. Revelation items matching current character's revelation
    const mainRevParts = mainRev ? mainRev.split('+').map(s => s.trim()) : [];
    const subRevParts = subRev ? subRev.split('+').map(s => s.trim()) : [];
    
    if (selfData['계시']) {
        selfData['계시'].forEach(item => {
            const skillName = item.skillName || '';

            if (skillName.includes('-')) {
                const [mainPart, subPart] = skillName.split('-');
                const mainMatches = mainRevParts.some(p => p === mainPart);
                const subMatches = subRevParts.some(p => p === subPart);
                if (mainMatches && subMatches) {
                    items.push({ ...item, source: '계시' });
                }
            } else {
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

// ============================================================================
// Data Getters - Penetrate (관통)
// ============================================================================

/**
 * Get penetrate (관통) items for pierce column
 */
export function getApplicablePenetrateItems(charData, store) {
    const selfItems = [];
    const buffItems = [];
    const penetrateData = window.penetrateData || {};
    
    if (!charData || !charData.name) return { selfItems, buffItems };
    
    const charName = charData.name;
    const mainRev = charData.mainRev || '';
    const subRev = charData.subRev || '';
    
    const wonderConfig = store.state.wonder || {};
    const wonderWeapon = wonderConfig.weapon || '';
    const wonderPersonas = wonderConfig.personas || [];
    const personaNames = wonderPersonas.map(p => p?.name).filter(Boolean);
    const personaSkills = wonderPersonas.flatMap(p => [p?.skill1, p?.skill2, p?.skill3].filter(Boolean));
    
    const party = store.state.party || [];
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
    
    // 4-1. 계시
    if (penetrateData['계시']) {
        penetrateData['계시'].forEach(item => {
            const skillName = item.skillName || '';
            const itemTarget = item.target || '';
            
            const separator = skillName.includes(' + ') ? ' + ' : (skillName.includes('-') ? '-' : null);
            if (separator) {
                const [partA, partB] = skillName.split(separator).map(s => s.trim());
                
                let matched = false;
                if (itemTarget === '자신') {
                    const charMainRevParts = mainRev ? mainRev.split('+').map(s => s.trim()) : [];
                    const charSubRevParts = subRev ? subRev.split('+').map(s => s.trim()) : [];
                    const hasPartA = charMainRevParts.includes(partA) || charSubRevParts.includes(partA);
                    const hasPartB = charMainRevParts.includes(partB) || charSubRevParts.includes(partB);
                    matched = hasPartA && hasPartB;
                } else {
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
    
    // 4-2. 현재 캐릭터 요소들
    if (penetrateData[charName]) {
        penetrateData[charName].forEach(item => {
            addItem(item, charName);
        });
    }
    
    // 4-3. 다른 캐릭터 슬롯의 버프
    partyCharNames.forEach(memberName => {
        if (memberName === charName) return;
        if (penetrateData[memberName]) {
            penetrateData[memberName].forEach(item => {
                if (item.target !== '자신') {
                    addItem(item, memberName);
                }
            });
        }
    });
    
    // 4-5~7. 원더
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

// ============================================================================
// Data Getters - Defense Reduce (방어력 감소)
// ============================================================================

/**
 * Get defense reduce (방어력 감소) items for pierce column
 */
export function getApplicableDefenseReduceItems(charData, store) {
    const items = [];
    const defenseData = window.defenseCalcData || {};
    
    if (!charData || !charData.name) return items;
    
    const charName = charData.name;
    
    const wonderConfig = store.state.wonder || {};
    const wonderWeapon = wonderConfig.weapon || '';
    const wonderPersonas = wonderConfig.personas || [];
    const personaNames = wonderPersonas.map(p => p?.name).filter(Boolean);
    const personaSkills = wonderPersonas.flatMap(p => [p?.skill1, p?.skill2, p?.skill3].filter(Boolean));
    
    const party = store.state.party || [];
    const partyCharNames = party.map(m => m?.name).filter(Boolean);
    
    const allMainRevParts = party.flatMap(m => m?.mainRev ? m.mainRev.split('+').map(s => s.trim()) : []);
    const allSubRevParts = party.flatMap(m => m?.subRev ? m.subRev.split('+').map(s => s.trim()) : []);
    
    // 4-4. 계시
    if (defenseData['계시']) {
        defenseData['계시'].forEach(item => {
            const skillName = item.skillName || '';
            const separator = skillName.includes(' + ') ? ' + ' : (skillName.includes('-') ? '-' : null);
            if (separator) {
                const [partA, partB] = skillName.split(separator).map(s => s.trim());
                const allRevParts = [...allMainRevParts, ...allSubRevParts];
                const partAMatches = allRevParts.some(p => p === partA);
                const partBMatches = allRevParts.some(p => p === partB);
                if (partAMatches && partBMatches) {
                    items.push({ ...item, source: '계시' });
                }
            } else {
                const matchesMain = allMainRevParts.some(p => p === skillName);
                const matchesSub = allSubRevParts.some(p => p === skillName);
                if (matchesMain || matchesSub) {
                    items.push({ ...item, source: '계시' });
                }
            }
        });
    }
    
    // 4-8. 모든 캐릭터 슬롯의 방어력 감소
    partyCharNames.forEach(memberName => {
        if (defenseData[memberName]) {
            defenseData[memberName].forEach(item => {
                items.push({ ...item, source: memberName });
            });
        }
    });
    
    // 4-5~7. 원더
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

// ============================================================================
// Calculators
// ============================================================================

/**
 * Calculate total critical rate from selected items
 */
export function calculateTotal(buffItems, selfItems, selectedItems) {
    let total = 0;
    const allItems = [...buffItems, ...selfItems];
    allItems.forEach(item => {
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        if (selectedItems.has(itemId)) {
            total += item.value || 0;
        }
    });
    return total;
}

/**
 * Calculate total penetrate rate from selected pierce items
 */
export function calculatePierceTotal(penetrateSelfItems, penetrateBuffItems, selectedPierceItems) {
    let total = 0;
    const allItems = [...penetrateSelfItems, ...penetrateBuffItems];
    allItems.forEach(item => {
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        if (selectedPierceItems.has(itemId)) {
            total += item.value || 0;
        }
    });
    return total;
}

/**
 * Calculate total defense reduce rate from selected defense items
 */
export function calculateDefenseReduceTotal(defenseReduceItems, selectedDefenseItems) {
    let total = 0;
    defenseReduceItems.forEach(item => {
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        if (selectedDefenseItems.has(itemId)) {
            total += item.value || 0;
        }
    });
    return total;
}

/**
 * Calculate remaining defense coefficient and target pierce rate
 */
export function calculateDefenseStats(penetrateTotal, defenseReduceTotal) {
    const { defenseCoef } = getGlobalBossSettings();
    
    const remainingDefenseCoef = Math.max(0, defenseCoef - defenseReduceTotal);
    const pierceTarget = defenseCoef > 0 ? (remainingDefenseCoef / (defenseCoef / 100)) : 0;
    const pierceNeeded = Math.max(0, pierceTarget - penetrateTotal);
    
    return {
        remainingDefense: remainingDefenseCoef.toFixed(1),
        pierceTarget: pierceTarget.toFixed(1),
        pierceNeeded: pierceNeeded.toFixed(1)
    };
}

// ============================================================================
// Auto Selection Logic
// ============================================================================

/**
 * Ensure default items are selected
 */
export function ensureDefaultSelected(buffItems, selectedItems) {
    buffItems.forEach(item => {
        if (item.id === 'default' || item.id === 'myPalace') {
            selectedItems.add(item.id);
        }
    });
}

/**
 * Auto-select items based on slot settings
 */
export function autoSelectBySlotSettings(charData, allItems, selectedItems, store) {
    if (!charData) return;
    
    const weaponMod = parseInt(charData.weaponMod, 10) || 0;
    
    allItems.forEach(item => {
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        const typeStr = String(item.type || '');

        // 1. 전용무기 타입
        if (typeStr === '전용무기') {
            const modNum = weaponMod;
            const options = Array.isArray(item.options) ? item.options : [];
            
            const targetOption = options.find(opt => {
                const singleMatch = opt.match(/(\d+)/);
                if (singleMatch) {
                    const nums = opt.match(/\d+/g);
                    if (nums && nums.length > 1) {
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
                selectedItems.add(itemId);
            }
        }

        // 2. 의식N 타입
        const ritualMatch = typeStr.match(/의식(\d+)/);
        if (ritualMatch) {
            const requiredRitual = parseInt(ritualMatch[1], 10);
            const itemSource = item.source || '';
            
            const party = store.state.party || [];
            const sourceMember = party.find(m => m && m.name === itemSource);
            
            if (sourceMember) {
                const sourceRitual = parseInt(sourceMember.ritual, 10) || 0;
                if (requiredRitual === 0 || sourceRitual >= requiredRitual) {
                    selectedItems.add(itemId);
                }
            }
        }
        
        // 3. 계시 타입 (자신 아이템)
        if (typeStr === '계시' && item.source && item.source !== '공통' && item.source !== '원더') {
            selectedItems.add(itemId);
        }
    });
}

/**
 * Auto-select pierce/defense items based on slot settings
 */
export function autoSelectPierceBySlotSettings(charData, allItems, category, selectedPierceItems, selectedDefenseItems, store) {
    if (!charData) return;
    
    const selectedSet = category === 'pierce' ? selectedPierceItems : selectedDefenseItems;
    const weaponMod = parseInt(charData.weaponMod, 10) || 0;
    
    allItems.forEach(item => {
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        const typeStr = String(item.type || '');

        // 1. 전용무기 타입
        if (typeStr === '전용무기') {
            const modNum = weaponMod;
            const options = Array.isArray(item.options) ? item.options : [];
            
            const targetOption = options.find(opt => {
                const singleMatch = opt.match(/(\d+)/);
                if (singleMatch) {
                    const nums = opt.match(/\d+/g);
                    if (nums && nums.length > 1) {
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
                selectedSet.add(itemId);
            }
        }

        // 2. 의식N 타입
        const ritualMatch = typeStr.match(/의식(\d+)/);
        if (ritualMatch) {
            const requiredRitual = parseInt(ritualMatch[1], 10);
            const itemSource = item.source || '';
            
            const party = store.state.party || [];
            const sourceMember = party.find(m => m && m.name === itemSource);
            
            if (sourceMember) {
                const sourceRitual = parseInt(sourceMember.ritual, 10) || 0;
                if (requiredRitual === 0 || sourceRitual >= requiredRitual) {
                    selectedSet.add(itemId);
                }
            }
        }
        
        // 3. 계시 타입
        if (typeStr === '계시' && item.source && item.source !== '공통' && item.source !== '원더') {
            selectedSet.add(itemId);
        }
    });
}

/**
 * Refresh auto-selection for critical items
 */
export function refreshAutoSelection(charData, store, selectedItems, getBuffItemsFn, getSelfItemsFn, refreshPierceFn) {
    if (!charData) return;
    
    const buffItems = getBuffItemsFn(store);
    const selfItems = getSelfItemsFn(charData, store);
    const allItems = [...buffItems, ...selfItems];
    
    allItems.forEach(item => {
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        const typeStr = String(item.type || '');
        if (typeStr === '전용무기' || typeStr.match(/의식\d+/)) {
            selectedItems.delete(itemId);
            delete item._selectedOption;
        }
    });
    
    autoSelectBySlotSettings(charData, allItems, selectedItems, store);
    
    if (refreshPierceFn) {
        refreshPierceFn(charData);
    }
}

/**
 * Refresh auto-selection for pierce/defense items
 */
export function refreshPierceAutoSelection(charData, store, selectedPierceItems, selectedDefenseItems, getPenetrateItemsFn, getDefenseReduceItemsFn) {
    if (!charData) return;
    
    const { selfItems: penetrateSelfItems, buffItems: penetrateBuffItems } = getPenetrateItemsFn(charData, store);
    const defenseReduceItems = getDefenseReduceItemsFn(charData, store);
    const allPierceItems = [...penetrateSelfItems, ...penetrateBuffItems];
    
    // Clear previous auto-selections
    allPierceItems.forEach(item => {
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        const typeStr = String(item.type || '');
        if (typeStr === '전용무기' || typeStr.match(/의식\d+/)) {
            selectedPierceItems.delete(itemId);
            delete item._selectedOption;
        }
    });
    
    defenseReduceItems.forEach(item => {
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        const typeStr = String(item.type || '');
        if (typeStr === '전용무기' || typeStr.match(/의식\d+/)) {
            selectedDefenseItems.delete(itemId);
            delete item._selectedOption;
        }
    });
    
    // Re-apply auto-selection
    autoSelectPierceBySlotSettings(charData, allPierceItems, 'pierce', selectedPierceItems, selectedDefenseItems, store);
    autoSelectPierceBySlotSettings(charData, defenseReduceItems, 'defense', selectedPierceItems, selectedDefenseItems, store);
}
