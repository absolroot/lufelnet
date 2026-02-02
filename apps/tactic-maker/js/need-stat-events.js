/**
 * Tactic Maker V2 - Need Stat Events Module
 * Event handlers for critical, pierce, elucidator, and boss interactions.
 */

import { 
    setElucidatorBonuses, 
    getGlobalBossSettings, 
    setGlobalBossSettings,
    getGlobalElucidatorCritical,
    getGlobalElucidatorPierce,
    getCurrentLang
} from './need-stat-state.js';

import {
    calculateTotal,
    calculatePierceTotal,
    calculateDefenseReduceTotal,
    calculateDefenseStats
} from './need-stat-data.js';

// ============================================================================
// Critical Events
// ============================================================================

/**
 * Bind critical item events
 */
export function bindCriticalEvents(container, ui, buffItems, selfItems, slotIndex) {
    const allItems = [...buffItems, ...selfItems];

    // Item row click
    container.querySelectorAll('.need-stat-row:not([data-category])').forEach(row => {
        const checkEl = row.querySelector('.need-stat-check');
        if (!checkEl) return;

        const toggleCheck = (e) => {
            e.stopPropagation();
            const itemId = row.dataset.itemId;
            if (!itemId) return;

            if (ui.selectedItems.has(itemId)) {
                ui.selectedItems.delete(itemId);
                row.classList.remove('checked');
                checkEl.src = `${ui.baseUrl}/assets/img/ui/check-off.png`;
                checkEl.classList.add('check-off');
            } else {
                ui.selectedItems.add(itemId);
                row.classList.add('checked');
                checkEl.src = `${ui.baseUrl}/assets/img/ui/check-on.png`;
                checkEl.classList.remove('check-off');
            }

            const total = calculateTotal(buffItems, selfItems, ui.selectedItems) + ui.revelationSumCritical + getGlobalElucidatorCritical();
            ui.updateTotalPairDisplays(slotIndex, total, 'critical');
        };

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

                const total = calculateTotal(buffItems, selfItems, ui.selectedItems) + ui.revelationSumCritical + getGlobalElucidatorCritical();
                ui.updateTotalPairDisplays(slotIndex, total, 'critical');
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
            
            const item = allItems.find(i => String(i.id || `${i.source}_${i.skillName}`) === itemId);
            
            if (item) {
                if (item.__baseValue === undefined) {
                    item.__baseValue = item.value || 0;
                }
                
                const baseValue = item.__baseValue;
                const calculatedValue = baseValue * (50 + N / 2) / 100;
                
                item.value = calculatedValue;
                if (valueEl) valueEl.textContent = `${calculatedValue.toFixed(2)}%`;
                
                // 동일한 jc1 입력 필드들 동기화 (관통 섹션 포함)
                document.querySelectorAll('.need-stat-jc1-sync').forEach(syncInput => {
                    if (syncInput !== personaInput) {
                        syncInput.value = personaInput.value;
                        const syncRow = syncInput.closest('.need-stat-row');
                        const syncValueEl = syncRow ? syncRow.querySelector('.need-stat-value') : null;
                        if (syncValueEl) {
                            const syncCategory = syncInput.dataset.category;
                            if (syncCategory === 'pierce') {
                                syncValueEl.textContent = `${calculatedValue.toFixed(2)}%`;
                            }
                        }
                    }
                });
                
                const total = calculateTotal(buffItems, selfItems, ui.selectedItems) + ui.revelationSumCritical + getGlobalElucidatorCritical();
                ui.updateTotalPairDisplays(slotIndex, total, 'critical');
            }
        });
    });
}

// ============================================================================
// Pierce Events
// ============================================================================

/**
 * Bind pierce/defense item events
 */
export function bindPierceEvents(container, ui, penetrateSelfItems, penetrateBuffItems, defenseReduceItems, slotIndex) {
    const allPierceItems = [...penetrateSelfItems, ...penetrateBuffItems];
    const allDefenseItems = defenseReduceItems;

    // Helper to update pierce displays
    const updatePierceDisplays = () => {
        const penetrateFromItems = calculatePierceTotal(penetrateSelfItems, penetrateBuffItems, ui.selectedPierceItems);
        const defenseReduceFromItems = calculateDefenseReduceTotal(defenseReduceItems, ui.selectedDefenseItems);
        const totalDefenseReduce = defenseReduceFromItems + ui.extraDefenseReduce;
        const pierceTotal = penetrateFromItems + ui.revelationSumPierce + ui.extraSumPierce + getGlobalElucidatorPierce();
        
        const defenseStats = calculateDefenseStats(penetrateFromItems, totalDefenseReduce);
        const remainingDefense = defenseStats.remainingDefense;
        const pierceTarget = parseFloat(defenseStats.pierceTarget);
        const pierceNeeded = parseFloat(defenseStats.pierceNeeded);
        
        // Update pierce target/current/needed in container
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
        
        // Update trigger table
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

    // Item row click for pierce/defense items
    container.querySelectorAll('.need-stat-row[data-category]').forEach(row => {
        const checkEl = row.querySelector('.need-stat-check');
        if (!checkEl) return;

        const toggleCheck = (e) => {
            e.stopPropagation();
            const itemId = row.dataset.itemId;
            const category = row.dataset.category;
            if (!itemId) return;

            const selectedSet = category === 'pierce' ? ui.selectedPierceItems : ui.selectedDefenseItems;

            if (selectedSet.has(itemId)) {
                selectedSet.delete(itemId);
                row.classList.remove('checked');
                checkEl.src = `${ui.baseUrl}/assets/img/ui/check-off.png`;
                checkEl.classList.add('check-off');
            } else {
                selectedSet.add(itemId);
                row.classList.add('checked');
                checkEl.src = `${ui.baseUrl}/assets/img/ui/check-on.png`;
                checkEl.classList.remove('check-off');
            }

            updatePierceDisplays();
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
    
    // Extra Defense Reduce input
    container.querySelectorAll('.need-stat-extra-defense-input').forEach(extraDefenseInput => {
        extraDefenseInput.addEventListener('input', (e) => {
            e.stopPropagation();
            const val = parseFloat(extraDefenseInput.value) || 0;
            ui.extraDefenseReduce = val;
            updatePierceDisplays();
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
                if (item.__baseValue === undefined) {
                    item.__baseValue = item.value || 0;
                }
                
                const baseValue = item.__baseValue;
                let calculatedValue = baseValue;
                
                if (String(itemId) === 'jc1') {
                    calculatedValue = baseValue * (50 + N / 2) / 100;
                    
                    // jc1은 크리티컬 섹션과 값 동기화
                    document.querySelectorAll('.need-stat-jc1-sync').forEach(syncInput => {
                        if (syncInput !== personaInput) {
                            syncInput.value = personaInput.value;
                            const syncRow = syncInput.closest('.need-stat-row');
                            const syncValueEl = syncRow ? syncRow.querySelector('.need-stat-value') : null;
                            if (syncValueEl) {
                                syncValueEl.textContent = `${calculatedValue.toFixed(2)}%`;
                            }
                        }
                    });
                }
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

// ============================================================================
// Elucidator Events
// ============================================================================

/**
 * Bind elucidator slot events
 */
export function bindElucidatorEvents(container, ui, slotIndex) {
    container.querySelectorAll('.need-stat-elucidator-input').forEach(input => {
        input.addEventListener('input', (e) => {
            e.stopPropagation();
            const statType = input.dataset.stat;
            const val = parseFloat(input.value) || 0;
            
            if (statType === 'critical') {
                setElucidatorBonuses(val, getGlobalElucidatorPierce());
            } else if (statType === 'pierce') {
                setElucidatorBonuses(getGlobalElucidatorCritical(), val);
            }
            
            // Update header display
            const headerEl = container.querySelector(`.need-stat-column-${statType} .need-stat-current`);
            if (headerEl) headerEl.textContent = `${val.toFixed(1)}%`;
        });
        input.addEventListener('click', (e) => e.stopPropagation());
    });
}

// ============================================================================
// Boss Events
// ============================================================================

/**
 * Bind boss settings events
 */
export function bindBossEvents(container, ui) {
    // Boss type tabs
    container.querySelectorAll('.need-stat-boss-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            const bossType = tab.dataset.bossType;
            setGlobalBossSettings({ bossType });
            
            container.querySelectorAll('.need-stat-boss-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            ui.updateBossDropdownList(container);
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
        
        document.addEventListener('click', () => {
            bossDropdown?.classList.remove('open');
        });
    }

    // Boss option selection
    container.querySelectorAll('.need-stat-boss-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const bossId = parseInt(option.dataset.bossId);
            ui.selectBoss(bossId, container);
            bossDropdown?.classList.remove('open');
        });
    });

    // Boss stat inputs
    container.querySelectorAll('.need-stat-boss-input').forEach(input => {
        input.addEventListener('input', (e) => {
            e.stopPropagation();
            const statName = input.dataset.bossStat;
            const val = parseFloat(input.value) || 0;
            setGlobalBossSettings({ [statName]: val });
        });
        input.addEventListener('click', (e) => e.stopPropagation());
    });
}

// ============================================================================
// Revelation/Extra Input Events
// ============================================================================

/**
 * Bind revelation sum and extra input events
 */
export function bindRevSumEvents(container, ui, buffItems, selfItems, slotIndex) {
    // Revelation sum input (critical)
    container.querySelectorAll('.need-stat-rev-sum-input[data-stat="critical"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.stopPropagation();
            ui.revelationSumCritical = parseFloat(input.value) || 0;
            const total = calculateTotal(buffItems, selfItems, ui.selectedItems) + ui.revelationSumCritical + ui.extraSumCritical + getGlobalElucidatorCritical();
            ui.updateTotalPairDisplays(slotIndex, total, 'critical');
        });
        input.addEventListener('click', (e) => e.stopPropagation());
    });

    // Extra sum input (critical)
    container.querySelectorAll('.need-stat-extra-sum-input[data-stat="critical"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.stopPropagation();
            ui.extraSumCritical = parseFloat(input.value) || 0;
            const total = calculateTotal(buffItems, selfItems, ui.selectedItems) + ui.revelationSumCritical + ui.extraSumCritical + getGlobalElucidatorCritical();
            ui.updateTotalPairDisplays(slotIndex, total, 'critical');
        });
        input.addEventListener('click', (e) => e.stopPropagation());
    });

    // Revelation sum input (pierce)
    container.querySelectorAll('.need-stat-rev-sum-input[data-stat="pierce"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.stopPropagation();
            ui.revelationSumPierce = parseFloat(input.value) || 0;
        });
        input.addEventListener('click', (e) => e.stopPropagation());
    });

    // Extra sum input (pierce)
    container.querySelectorAll('.need-stat-extra-sum-input[data-stat="pierce"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.stopPropagation();
            ui.extraSumPierce = parseFloat(input.value) || 0;
        });
        input.addEventListener('click', (e) => e.stopPropagation());
    });
}
