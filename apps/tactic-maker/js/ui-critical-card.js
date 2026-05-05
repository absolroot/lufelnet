/**
 * Tactic Maker V2 - Need Stat Card UI Module
 * Renders a collapsible critical/pierce rate checklist panel.
 * 
 * Refactored into modules:
 * - need-stat-state.js: Global state and utility functions
 * - need-stat-data.js: Data getters, calculators, auto-selection
 * - need-stat-events.js: Event handlers
 */

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
    getLocalizedOptionData,
    getLabels,
    translateNeedStat,
    sortItemsByCurrentChar,
    getGlobalItemOptions,
    setGlobalItemOptions,
    getGlobalItemOption,
    setGlobalItemOption,
    getGlobalSharedChecks,
    getGlobalSharedChecksForExport,
    setGlobalSharedChecks,
    setGlobalSharedCheck,
    isGlobalSharedChecked,
    getDefaultGlobalSkillEffectAmpState,
    getGlobalSkillEffectAmpState,
    setGlobalSkillEffectAmpState
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
        this.currentPanelContainer = null;
        this.currentCriticalItems = [];
        this.currentPierceItems = [];
        this.currentDefenseItems = [];

        // Shared rule table from data/kr/calc/defense-mutually-exclusive-rules.js
        this.mutuallyExclusiveRules = this.getSharedMutuallyExclusiveRules();
    }

    /**
     * Get mutually exclusive rules from shared data file.
     * Rules are normalized to string ids for safe comparison.
     */
    getSharedMutuallyExclusiveRules() {
        let rules = null;

        if (Array.isArray(window.defenseMutuallyExclusiveRules)) {
            rules = window.defenseMutuallyExclusiveRules;
        } else if (typeof defenseMutuallyExclusiveRules !== 'undefined' && Array.isArray(defenseMutuallyExclusiveRules)) {
            rules = defenseMutuallyExclusiveRules;
        }

        if (!Array.isArray(rules)) {
            console.warn('[NeedStatCardUI] defenseMutuallyExclusiveRules not loaded; using empty rule set.');
            return [];
        }

        return rules
            .map(rule => ({
                ids: Array.isArray(rule.ids) ? rule.ids.map(id => String(id)) : [],
                priority: String(rule.priority || ''),
                category: String(rule.category || '')
            }))
            .filter(rule => rule.ids.length >= 2 && (rule.category === 'defense' || rule.category === 'pierce'));
    }

    /**
     * Get the mutually exclusive rule for an item
     */
    getMutuallyExclusiveRule(itemId, category) {
        const id = String(itemId);
        return this.mutuallyExclusiveRules.find(rule =>
            rule.category === category && rule.ids.includes(id)
        );
    }

    /**
     * Handle mutually exclusive check: uncheck every other checked item in the same rule group.
     * @returns {string[]} The list of unchecked item ids
     */
    handleMutuallyExclusiveCheck(itemId, category, container) {
        const id = String(itemId);
        const rule = this.getMutuallyExclusiveRule(id, category);
        if (!rule) return [];

        const otherIds = rule.ids.filter(ruleId => ruleId !== id);
        if (otherIds.length === 0) return [];

        const selectedSet = category === 'pierce' ? this.selectedPierceItems : this.selectedDefenseItems;
        const uncheckedIds = [];
        const sharedCategory = category === 'defense' ? 'defense' : null;

        otherIds.forEach(otherId => {
            if (!selectedSet.has(otherId)) return;
            selectedSet.delete(otherId);
            uncheckedIds.push(otherId);

            // Update UI if container is provided
            if (container) {
                const otherRow = container.querySelector(`.need-stat-row[data-item-id="${otherId}"][data-category="${category}"]`);
                if (otherRow) {
                    otherRow.classList.remove('checked');
                    const checkEl = otherRow.querySelector('.need-stat-check');
                    if (checkEl) {
                        checkEl.src = `${this.baseUrl}/assets/img/ui/check-off.png`;
                        checkEl.classList.add('check-off');
                    }
                }
            }

            // Also update global shared state if it's a shared item
            if (sharedCategory) {
                setGlobalSharedCheck(sharedCategory, otherId, false);
            }
        });

        return uncheckedIds;
    }

    /**
     * Resolve mutually exclusive conflicts on load: keep only priority item checked
     */
    resolveMutuallyExclusiveOnLoad() {
        this.mutuallyExclusiveRules.forEach(rule => {
            const selectedSet = rule.category === 'pierce' ? this.selectedPierceItems : this.selectedDefenseItems;
            const checkedIds = rule.ids.filter(id => selectedSet.has(id));

            if (checkedIds.length > 1) {
                // Multiple items checked, keep only priority
                checkedIds.forEach(id => {
                    if (id !== rule.priority) {
                        selectedSet.delete(id);
                        // Also update global shared state
                        if (rule.category === 'defense') {
                            setGlobalSharedCheck('defense', id, false);
                        }
                    }
                });
            }
        });
    }

    /**
     * Check if an item is a shared item that syncs across all character slots
     * @param {Object} item - The item object
     * @param {string} category - 'critical', 'pierce', or 'defense'
     * @param {boolean} isBuff - Whether the item is from buff section
     * @returns {string|null} - The shared category key or null if not shared
     */
    getSharedCategory(item, category, isBuff) {
        const itemTarget = String(item.target || '');

        // Defense reduce items - all are shared
        if (category === 'defense') {
            return 'defense';
        }

        // Pierce buff items with target '광역' - shared
        if (category === 'pierce' && isBuff && itemTarget === '광역') {
            return 'pierceBuffAoe';
        }

        // Critical buff items with target '광역' - shared
        if (category === 'critical' && isBuff && itemTarget === '광역') {
            return 'criticalBuffAoe';
        }

        return null;
    }

    /**
     * Sync local slot selections to global shared checks
     * This handles legacy data where shared items were stored per-slot
     */
    _syncLocalSelectionsToGlobalShared(buffItems, penetrateBuffItems, defenseReduceItems) {
        // Critical buff items with type '광역'
        buffItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            const sharedCategory = this.getSharedCategory(item, 'critical', true);
            if (sharedCategory && this.selectedItems.has(itemId)) {
                setGlobalSharedCheck(sharedCategory, itemId, true);
            }
        });

        // Pierce buff items with type '광역'
        penetrateBuffItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            const sharedCategory = this.getSharedCategory(item, 'pierce', true);
            if (sharedCategory && this.selectedPierceItems.has(itemId)) {
                setGlobalSharedCheck(sharedCategory, itemId, true);
            }
        });

        // Defense reduce items (all are shared)
        defenseReduceItems.forEach(item => {
            const itemId = String(item.id || `${item.source}_${item.skillName}`);
            if (this.selectedDefenseItems.has(itemId)) {
                setGlobalSharedCheck('defense', itemId, true);
            }
        });
    }

    /**
     * Save current selections to store for persistence
     */
    saveSelectionsToStore(slotIndex) {
        if (slotIndex === undefined || slotIndex === null) return;

        if (!this.store.state.needStatSelections) {
            this.store.state.needStatSelections = {};
        }

        // Collect persona performance values from current container
        const personaPerformanceValues = {};
        const container = document.querySelector('.need-stat-container');
        if (container) {
            container.querySelectorAll('.need-stat-persona-input').forEach(input => {
                const itemId = input.dataset.itemId;
                const category = input.dataset.category;
                if (itemId) {
                    const key = `${category}_${itemId}`;
                    personaPerformanceValues[key] = parseFloat(input.value) || 100;
                }
            });
        }

        this.store.state.needStatSelections[slotIndex] = {
            critical: [...this.selectedItems],
            pierce: [...this.selectedPierceItems],
            defense: [...this.selectedDefenseItems],
            revSumCritical: this.revelationSumCritical,
            revSumPierce: this.revelationSumPierce,
            extraSumCritical: this.extraSumCritical,
            extraSumPierce: this.extraSumPierce,
            extraDefenseReduce: this.extraDefenseReduce,
            personaPerformance: personaPerformanceValues
        };

        // Save global item options (shared across all slots)
        this.store.state.needStatSelections.globalItemOptions = getGlobalItemOptions();

        // Save global shared checks (synced across all slots)
        this.store.state.needStatSelections.globalSharedChecks = getGlobalSharedChecksForExport();

        // Save global skill effect amp state (shared across all slots)
        this.store.state.needStatSelections.globalSkillEffectAmp = getGlobalSkillEffectAmpState();

        // Save global boss settings (shared across all slots)
        this.store.state.needStatSelections.globalBossSettings = _getGlobalBossSettings();

        // Trigger auto-save
        this.store.notify('needStatChange', { slotIndex });
    }

    /**
     * Load saved selections from store
     */
    loadSelectionsFromStore(slotIndex) {
        if (slotIndex === undefined || slotIndex === null) return false;

        // Load global item options (shared across all slots)
        const globalOptions = this.store.state.needStatSelections?.globalItemOptions;
        if (globalOptions) {
            setGlobalItemOptions(globalOptions);
        }

        // Load global shared checks (synced across all slots)
        const globalChecks = this.store.state.needStatSelections?.globalSharedChecks;
        if (globalChecks) {
            setGlobalSharedChecks(globalChecks);
        }

        const globalSkillEffectAmp = this.store.state.needStatSelections?.globalSkillEffectAmp;
        setGlobalSkillEffectAmpState(globalSkillEffectAmp || getDefaultGlobalSkillEffectAmpState(), { silent: true });

        const globalBossSettings = this.store.state.needStatSelections?.globalBossSettings;
        if (globalBossSettings) {
            _setGlobalBossSettings(globalBossSettings);
        }

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
        this.savedPersonaPerformance = saved.personaPerformance || {};

        // Resolve mutually exclusive conflicts
        this.resolveMutuallyExclusiveOnLoad();

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

    setItemBaseValue(item, value) {
        if (!item) return 0;
        const safeValue = isFinite(Number(value)) ? Number(value) : 0;
        item.__baseValue = safeValue;
        item.value = safeValue;
        return safeValue;
    }

    getBaseItemValue(item) {
        if (!item) return 0;

        const baseValue = Number(item.__baseValue);
        if (isFinite(baseValue)) return baseValue;

        const rawValue = Number(item.value);
        return isFinite(rawValue) ? rawValue : 0;
    }

    setItemFormulaSourceValue(item, value) {
        if (!item) return 0;
        const safeValue = isFinite(Number(value)) ? Number(value) : 0;
        item.__formulaSourceValue = safeValue;
        return safeValue;
    }

    getItemFormulaSourceValue(item) {
        if (!item) return 0;

        const formulaValue = Number(item.__formulaSourceValue);
        if (isFinite(formulaValue)) return formulaValue;

        return this.getBaseItemValue(item);
    }

    hasJandCInParty() {
        const party = this.store?.state?.party || [];
        return party.some(member => {
            const name = member?.name;
            return name === 'J&C' || name === 'J&amp;C' || String(name || '').toLowerCase() === 'j&c';
        });
    }

    getSkillEffectAmpMultiplier(item) {
        if (!this.hasJandCInParty()) return 1;
        const state = getGlobalSkillEffectAmpState();
        if (!state.enabled) return 1;
        if (!item || item.skillEffectAmpAffected !== true) return 1;
        return 1 + (state.value / 100);
    }

    getEffectiveItemValue(item) {
        return this.getBaseItemValue(item) * this.getSkillEffectAmpMultiplier(item);
    }

    formatDisplayValue(value) {
        const safeValue = isFinite(Number(value)) ? Number(value) : 0;
        return `${safeValue.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}%`;
    }

    getItemRowSelector(itemId, category = null) {
        const selector = `.need-stat-row[data-item-id="${itemId}"]`;
        return category ? `${selector}[data-category="${category}"]` : `${selector}:not([data-category])`;
    }

    getItemValueCell(container, itemId, category = null) {
        const row = container?.querySelector(this.getItemRowSelector(itemId, category));
        return row ? row.querySelector('.need-stat-value') : null;
    }

    renderItemValue(item, valueCell = item && item.__valueCell) {
        if (!item || !valueCell) return;
        item.__valueCell = valueCell;
        valueCell.textContent = this.formatDisplayValue(this.getEffectiveItemValue(item));
    }

    refreshDisplayedValues(container = this.currentPanelContainer) {
        if (!container) return;

        [
            { items: this.currentCriticalItems, category: null },
            { items: this.currentPierceItems, category: 'pierce' },
            { items: this.currentDefenseItems, category: 'defense' }
        ].forEach(group => {
            group.items.forEach(item => {
                const itemId = String(item.id || `${item.source}_${item.skillName}`);
                const valueCell = this.getItemValueCell(container, itemId, group.category);
                if (valueCell) {
                    this.renderItemValue(item, valueCell);
                }
            });
        });
    }

    getItemsByCategory(category) {
        if (category === 'critical') return this.currentCriticalItems;
        if (category === 'pierce') return this.currentPierceItems;
        if (category === 'defense') return this.currentDefenseItems;
        return [];
    }

    findItemById(itemId, category) {
        return this.getItemsByCategory(category).find(item => String(item.id || `${item.source}_${item.skillName}`) === String(itemId)) || null;
    }

    applyPersonaPerformanceValue(baseValue, personaValue) {
        const safeBaseValue = isFinite(Number(baseValue)) ? Number(baseValue) : 0;
        const safePersonaValue = isFinite(Number(personaValue)) ? Number(personaValue) : 100;
        return safeBaseValue * (50 + safePersonaValue / 2) / 100;
    }

    applyPersonaPerformanceToItem(item, personaValue) {
        const rawBaseValue = this.getItemFormulaSourceValue(item);
        const nextValue = this.applyPersonaPerformanceValue(rawBaseValue, personaValue);
        this.setItemBaseValue(item, nextValue);
        return nextValue;
    }

    syncPersonaPerformanceInputs(container, itemId, personaValue) {
        if (!container) return;

        container.querySelectorAll(`.need-stat-persona-input[data-item-id="${itemId}"]`).forEach(input => {
            if (input.value !== String(personaValue)) {
                input.value = String(personaValue);
            }
        });
    }

    renderSkillEffectAmpControls() {
        if (!this.hasJandCInParty()) return '';
        const { labelSkillEffectAmp } = this.getLabels();
        const state = getGlobalSkillEffectAmpState();

        return `
            <div class="need-stat-skill-effect-amp-group">
                <label class="skill-effect-amp-toggle-wrap">
                    <input type="checkbox" data-skill-effect-amp-toggle ${state.enabled ? 'checked' : ''}>
                    <span class="skill-effect-amp-checkbox-frame" aria-hidden="true">
                        <img class="skill-effect-amp-checkbox-icon" src="${this.baseUrl}/assets/img/ui/check-${state.enabled ? 'on' : 'off'}.png" alt="">
                    </span>
                    <span class="need-stat-rev-sum-label skill-effect-amp-label">${labelSkillEffectAmp}</span>
                </label>
                <input type="number" class="need-stat-skill-effect-amp-input" data-skill-effect-amp-value value="${state.value}" min="0" step="0.1">
                <span class="need-stat-skill-effect-amp-unit">%</span>
            </div>
        `;
    }

    syncSkillEffectAmpControls(container = this.currentPanelContainer, options = {}) {
        if (!container) return;

        const state = getGlobalSkillEffectAmpState();
        const preserveInput = options && options.preserveInput ? options.preserveInput : null;
        const rawValue = options && Object.prototype.hasOwnProperty.call(options, 'rawValue')
            ? String(options.rawValue)
            : String(state.value);
        container.querySelectorAll('[data-skill-effect-amp-toggle]').forEach(toggle => {
            toggle.checked = !!state.enabled;
        });
        container.querySelectorAll('[data-skill-effect-amp-value]').forEach(input => {
            if (input === preserveInput) {
                if (input.value !== rawValue) input.value = rawValue;
                return;
            }
            input.value = String(state.value);
        });
        container.querySelectorAll('.skill-effect-amp-checkbox-icon').forEach(icon => {
            icon.src = `${this.baseUrl}/assets/img/ui/check-${state.enabled ? 'on' : 'off'}.png`;
        });
    }

    getCriticalTotal(buffItems, selfItems) {
        return this.calculateTotal(buffItems, selfItems) + this.revelationSumCritical + this.extraSumCritical + getGlobalElucidatorCritical();
    }

    getPierceSummary(penetrateSelfItems, penetrateBuffItems, defenseReduceItems) {
        const penetrateFromItems = this.calculatePierceTotal(penetrateSelfItems, penetrateBuffItems);
        const defenseReduceFromItems = this.calculateDefenseReduceTotal(defenseReduceItems);
        const totalDefenseReduce = defenseReduceFromItems + this.extraDefenseReduce;
        const pierceTotal = penetrateFromItems + this.revelationSumPierce + this.extraSumPierce + getGlobalElucidatorPierce();
        const defenseStats = this.calculateDefenseStats(pierceTotal, totalDefenseReduce);

        return {
            penetrateFromItems,
            defenseReduceFromItems,
            totalDefenseReduce,
            pierceTotal,
            remainingDefense: parseFloat(defenseStats.remainingDefense) || 0,
            pierceTarget: parseFloat(defenseStats.pierceTarget) || 0,
            pierceNeeded: parseFloat(defenseStats.pierceNeeded) || 0
        };
    }

    updatePierceDisplays(container, slotIndex, penetrateSelfItems, penetrateBuffItems, defenseReduceItems) {
        const summary = this.getPierceSummary(penetrateSelfItems, penetrateBuffItems, defenseReduceItems);

        const pierceTargetEl = container.querySelector('.need-stat-column-pierce .need-stat-target');
        const pierceCurrentEl = container.querySelector('.need-stat-column-pierce .need-stat-current');
        const pierceNeededEl = container.querySelector('.need-stat-column-pierce .need-stat-needed');
        if (pierceTargetEl) pierceTargetEl.textContent = `${summary.pierceTarget.toFixed(1)}%`;
        if (pierceCurrentEl) pierceCurrentEl.textContent = `${summary.pierceTotal.toFixed(1)}%`;
        if (pierceNeededEl) pierceNeededEl.textContent = `${summary.pierceNeeded.toFixed(1)}%`;

        const defenseValueEl = container.querySelector('.need-stat-defense-value');
        const defenseRequiredEl = container.querySelector('.need-stat-defense-required');
        if (defenseValueEl) defenseValueEl.textContent = `${summary.remainingDefense.toFixed(1)}%`;
        if (defenseRequiredEl) defenseRequiredEl.textContent = `${summary.pierceNeeded.toFixed(1)}%`;

        const triggerEl = document.querySelector(`.need-stat-trigger[data-slot-index="${slotIndex}"]`);
        const triggerTable = triggerEl?.querySelector('.need-stat-trigger-table');
        if (triggerTable) {
            const triggerPierceTargetEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-target');
            const triggerPierceCurrentEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-current');
            const triggerPierceNeededEl = triggerTable.querySelector('.need-stat-trigger-row[data-stat-type="pierce"] .need-stat-needed');
            if (triggerPierceTargetEl) triggerPierceTargetEl.textContent = `${summary.pierceTarget.toFixed(1)}%`;
            if (triggerPierceCurrentEl) triggerPierceCurrentEl.textContent = `${summary.pierceTotal.toFixed(1)}%`;
            if (triggerPierceNeededEl) triggerPierceNeededEl.textContent = `${summary.pierceNeeded.toFixed(1)}%`;
        }

        return summary;
    }

    refreshCurrentPanelDisplays(container, slotIndex, buffItems, selfItems, penetrateSelfItems, penetrateBuffItems, defenseReduceItems) {
        this.refreshDisplayedValues(container);
        this.updateTotalPairDisplays(slotIndex, this.getCriticalTotal(buffItems, selfItems), 'critical');
        this.updatePierceDisplays(container, slotIndex, penetrateSelfItems, penetrateBuffItems, defenseReduceItems);
    }

    getCurrentLang() {
        return getCurrentLang();
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
        const personaSkills = wonderPersonas.flatMap(p => Array.isArray(p?.skills) ? p.skills.filter(Boolean) : []);

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
        const personaSkills = wonderPersonas.flatMap(p => Array.isArray(p?.skills) ? p.skills.filter(Boolean) : []);

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
        return getSourceDisplayName(source, this.baseUrl);
    }

    /**
     * Get localized skill name following critical-calc.js pattern
     */
    getLocalizedSkillName(item, groupName = '') {
        return getLocalizedSkillName(item, groupName);
    }

    /**
     * Get localized options following defense-calc.js pattern
     */
    getLocalizedOptions(item) {
        return getLocalizedOptions(item);
    }

    getLocalizedOptionData(item) {
        return getLocalizedOptionData(item);
    }

    /**
     * Normalize text for language (e.g., 의식3 -> 의식2 for non-KR)
     */
    normalizeTextForLang(text) {
        return normalizeTextForLang(text);
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
        if (lang === 'cn' && item.type_cn) typeName = item.type_cn;

        const target = (lang === 'cn' && item.target_cn) ? item.target_cn : (item.target || '');
        let rawBaseValue = Number(item.value) || 0;

        const skillIcon = item.skillIcon ? `${this.baseUrl}${item.skillIcon}` : '';

        // Check if this item is a shared item (critical buff with type '광역')
        const sharedCategory = this.getSharedCategory(item, 'critical', !isSelf);
        let isChecked;
        if (sharedCategory) {
            // Use global shared state
            isChecked = isGlobalSharedChecked(sharedCategory, itemId);
            // Sync to local selectedItems
            if (isChecked) {
                this.selectedItems.add(itemId);
            } else {
                this.selectedItems.delete(itemId);
            }
        } else {
            isChecked = this.selectedItems.has(itemId);
        }

        const sourceName = this.getSourceDisplayName(item.source);

        // Build display name following critical-calc.js pattern
        let displayName = '';
        const isSpecialGroup = (groupName === '원더' || groupName === '계시');
        if ((window.isKrLikeLanguage && window.isKrLikeLanguage(lang)) || lang === 'kr') {
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

        let optionsHtml = '';
        if (item.options && item.options.length > 0) {
            const optionData = this.getLocalizedOptionData(item);
            const baseOptions = optionData.options;
            const labelOptions = optionData.labels;
            const savedOption = getGlobalItemOption(itemId);
            const selectedOpt = (savedOption && optionData.values && optionData.values[savedOption] !== undefined)
                ? savedOption
                : (item._selectedOption || optionData.defaultOption || baseOptions[0]);
            item._selectedOption = selectedOpt;
            if (optionData.values && optionData.values[selectedOpt] !== undefined) {
                rawBaseValue = Number(optionData.values[selectedOpt]) || 0;
            }
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
        let finalBaseValue = rawBaseValue;

        if (isJC1Critical) {
            const savedKey = `critical_${itemId}`;
            const savedValue = this.savedPersonaPerformance?.[savedKey];
            const defaultValue = savedValue !== undefined ? savedValue : 100;
            const label = this.getLabels().labelPersonaPerformance;
            this.setItemFormulaSourceValue(item, rawBaseValue);
            finalBaseValue = this.applyPersonaPerformanceValue(rawBaseValue, defaultValue);
            personaPerformanceHtml = `
                <span class="need-stat-persona-performance">
                    <label class="need-stat-persona-label">${label}</label>
                    <input type="number" class="need-stat-persona-input need-stat-jc1-sync" data-item-id="${itemId}" data-category="critical" value="${defaultValue}" min="0" max="300" step="0.1">
                </span>
            `;
        }

        this.setItemBaseValue(item, finalBaseValue);
        const displayValue = this.formatDisplayValue(this.getEffectiveItemValue(item));

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
                <span class="need-stat-value">${displayValue}</span>
            </div>
        `;
    }

    /**
     * Render a pierce/defense item row (similar to critical item row)
     */
    renderPierceItemRow(item, category = 'pierce', isBuff = false) {
        const lang = this.getCurrentLang();
        const itemId = String(item.id || `${item.source}_${item.skillName}`);
        const groupName = item.source || '';

        const skillName = this.getLocalizedSkillName(item, groupName);

        let typeName = this.normalizeTextForLang(item.type || '');
        if (lang === 'en' && item.type_en) typeName = item.type_en;
        if (lang === 'jp' && item.type_jp) typeName = item.type_jp;
        if (lang === 'cn' && item.type_cn) typeName = item.type_cn;

        const target = (lang === 'cn' && item.target_cn) ? item.target_cn : (item.target || '');
        let rawBaseValue = Number(item.value) || 0;

        const skillIcon = item.skillIcon || '';
        const selectedSet = category === 'pierce' ? this.selectedPierceItems : this.selectedDefenseItems;

        // Check if this item is a shared item
        const sharedCategory = this.getSharedCategory(item, category, isBuff);
        let isChecked;
        if (sharedCategory) {
            // Use global shared state
            isChecked = isGlobalSharedChecked(sharedCategory, itemId);
            // Sync to local selectedSet
            if (isChecked) {
                selectedSet.add(itemId);
            } else {
                selectedSet.delete(itemId);
            }
        } else {
            isChecked = selectedSet.has(itemId);
        }

        const sourceName = this.getSourceDisplayName(item.source);

        // Build display name following defense-calc.js pattern
        let displayName = '';
        const isSpecialGroup = (groupName === '원더' || groupName === '계시');
        if ((window.isKrLikeLanguage && window.isKrLikeLanguage(lang)) || lang === 'kr') {
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

        let optionsHtml = '';
        if (item.options && item.options.length > 0) {
            const optionData = this.getLocalizedOptionData(item);
            const baseOptions = optionData.options;
            const labelOptions = optionData.labels;
            const optionKey = `${category}_${itemId}`;
            const savedOption = getGlobalItemOption(optionKey);
            const selectedOpt = (savedOption && optionData.values && optionData.values[savedOption] !== undefined)
                ? savedOption
                : (item._selectedOption || optionData.defaultOption || baseOptions[0]);
            item._selectedOption = selectedOpt;
            if (optionData.values && optionData.values[selectedOpt] !== undefined) {
                rawBaseValue = Number(optionData.values[selectedOpt]) || 0;
            }
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
        let finalBaseValue = rawBaseValue;

        if (isJC1 || isJC2) {
            const savedKey = `${category}_${itemId}`;
            const savedValue = this.savedPersonaPerformance?.[savedKey];
            const defaultValue = savedValue !== undefined ? savedValue : 100;
            const label = this.getLabels().labelPersonaPerformance;
            // jc1은 크리티컬 섹션과 값 동기화를 위해 need-stat-jc1-sync 클래스 추가
            const syncClass = isJC1 ? 'need-stat-jc1-sync' : '';
            this.setItemFormulaSourceValue(item, rawBaseValue);
            finalBaseValue = this.applyPersonaPerformanceValue(rawBaseValue, defaultValue);
            personaPerformanceHtml = `
                <span class="need-stat-persona-performance">
                    <label class="need-stat-persona-label">${label}</label>
                    <input type="number" class="need-stat-persona-input ${syncClass}" data-item-id="${itemId}" data-category="${category}" value="${defaultValue}" min="0" max="300" step="0.1">
                </span>
            `;
        }

        this.setItemBaseValue(item, finalBaseValue);
        const displayValue = this.formatDisplayValue(this.getEffectiveItemValue(item));

        return `
            <div class="need-stat-row ${isChecked ? 'checked' : ''}" data-item-id="${itemId}" data-item-type="${item.type || ''}" data-category="${category}">
                <img src="${this.baseUrl}/assets/img/ui/check-${isChecked ? 'on' : 'off'}.png" class="need-stat-check ${isChecked ? '' : 'check-off'}">
                <span class="need-stat-target-type" data-target="${target}">${target}</span>
                ${skillIcon ? `<img src="${skillIcon}" class="need-stat-icon" onerror="this.style.display='none'">` : '<span class="need-stat-icon"></span>'}
                <span class="need-stat-source">${sourceName}</span>
                <span class="need-stat-name">${displayName}</span>
                ${personaPerformanceHtml}
                ${optionsHtml}
                <span class="need-stat-value">${displayValue}</span>
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
                total += this.getEffectiveItemValue(item);
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
                total += this.getEffectiveItemValue(item);
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
                total += this.getEffectiveItemValue(item);
            }
        });
        return total;
    }

    /**
     * Calculate remaining defense coefficient and target/needed pierce.
     */
    calculateDefenseStats(penetrateTotal, defenseReduceTotal) {
        const { defenseCoef } = _getGlobalBossSettings();

        const afterPierceCoef = penetrateTotal >= 100 ? 0 : defenseCoef * (100 - penetrateTotal) / 100;
        const remainingDefenseCoef = Math.max(0, afterPierceCoef - defenseReduceTotal);

        const pierceTarget = defenseCoef > 0
            ? Math.max(0, Math.min(100, 100 - (defenseReduceTotal / defenseCoef) * 100))
            : 0;

        const pierceNeeded = Math.max(0, pierceTarget - penetrateTotal);

        return {
            remainingDefense: remainingDefenseCoef.toFixed(1),
            pierceTarget: pierceTarget.toFixed(1),
            pierceNeeded: pierceNeeded.toFixed(1)
        };
    }

    getLabels() {
        return getLabels();
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
            const defenseStats = this.calculateDefenseStats(pierceTotal, totalDefenseReduce);
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
        const criticalCalcTooltip = window.I18nService
            ? window.I18nService.t('criticalCalcTooltip', 'Critical Calculator')
            : 'Critical Calculator';
        const defenseCalcTooltip = window.I18nService
            ? window.I18nService.t('defenseCalcTooltip', 'Defense Calculator')
            : 'Defense Calculator';

        // Elucidator slot: show only custom inputs for critical/pierce that affect all other slots
        if (this.isElucidator) {
            container.innerHTML = `
                <div class="need-stat-columns">
                    <div class="need-stat-column need-stat-column-critical">
                        <div class="need-stat-column-header">
                            <span>${labelCritical}<a href="${this.baseUrl}/critical-calc/" target="_blank" class="need-stat-external-link" title="${criticalCalcTooltip}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
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
                            <span>${labelPierce}<a href="${this.baseUrl}/defense-calc/" target="_blank" class="need-stat-external-link" title="${defenseCalcTooltip}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
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
        } else if (!this.store.state.needStatSelections?.globalSharedChecks) {
            // Merge local selections to global shared checks only once (for legacy data compatibility)
            this._syncLocalSelectionsToGlobalShared(buffItems, penetrateBuffItems, defenseReduceItems);
        }

        const { labelExtraPierce, labelExtraDefenseReduce, labelPenetrateSelf, labelPenetrateBuff, labelDefenseReduce, labelRemainingDefense, labelRequiredPierce } = labels;
        this.currentPanelContainer = container;
        this.currentCriticalItems = [...buffItems, ...selfItems];
        this.currentPierceItems = [...penetrateSelfItems, ...penetrateBuffItems];
        this.currentDefenseItems = [...defenseReduceItems];

        const critTotal = this.getCriticalTotal(buffItems, selfItems);
        const pierceSummary = this.getPierceSummary(penetrateSelfItems, penetrateBuffItems, defenseReduceItems);
        const remainingDefense = pierceSummary.remainingDefense.toFixed(1);
        const pierceTarget = pierceSummary.pierceTarget;
        const pierceNeeded = pierceSummary.pierceNeeded;
        const pierceTotal = pierceSummary.pierceTotal;

        container.innerHTML = `
            <div class="need-stat-columns">
                <div class="need-stat-column need-stat-column-critical">
                    <div class="need-stat-column-header">
                        <span>${labelCritical}<a href="${this.baseUrl}/critical-calc/" target="_blank" class="need-stat-external-link" title="${criticalCalcTooltip}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
                        ${this.renderTotalPairHtml(slotIndex, critTotal, 'critical')}
                    </div>
                    <div class="need-stat-rev-sum-row">
                        <div class="need-stat-rev-sum-field">
                            <label class="need-stat-rev-sum-label"><img src="${this.baseUrl}/assets/img/nav/qishi.png" alt="" class="need-stat-rev-icon">${labelRevSum}</label>
                            <input type="number" class="need-stat-rev-sum-input" data-stat="critical" value="${this.revelationSumCritical}" min="0" max="100" step="0.1">
                        </div>
                        <div class="need-stat-rev-sum-field">
                            <label class="need-stat-rev-sum-label">${labelExtraSum}</label>
                            <input type="number" class="need-stat-extra-sum-input" data-stat="critical" value="${this.extraSumCritical}" min="0" max="100" step="0.1">
                        </div>
                        <div class="need-stat-rev-sum-field need-stat-rev-sum-field-skill-effect-amp">
                            ${this.renderSkillEffectAmpControls()}
                        </div>
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
                        <span>${labelPierce}<a href="${this.baseUrl}/defense-calc/" target="_blank" class="need-stat-external-link" title="${defenseCalcTooltip}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
                        <span class="need-stat-defense-info-inline">
                            <span class="need-stat-defense-label">${labelRemainingDefense}</span>
                            <span class="need-stat-defense-value" data-slot-index="${slotIndex}">${remainingDefense}%</span>
                            <span class="need-stat-defense-sep">/</span>
                            <span class="need-stat-defense-label">${labelRequiredPierce}</span>
                            <span class="need-stat-defense-required">${pierceNeeded.toFixed(1)}%</span>
                        </span>
                        <span class="need-stat-total need-stat-total-inline" data-slot-index="${slotIndex}" data-stat-type="pierce">
                            <span class="need-stat-current">${pierceTotal.toFixed(1)}%</span>
                        </span>
                    </div>
                    <div class="need-stat-rev-sum-row">
                        <div class="need-stat-rev-sum-field">
                            <label class="need-stat-rev-sum-label"><img src="${this.baseUrl}/assets/img/nav/qishi.png" alt="" class="need-stat-rev-icon">${labelRevSum}</label>
                            <input type="number" class="need-stat-rev-sum-input" data-stat="pierce" value="${this.revelationSumPierce}" min="0" max="100" step="0.1">
                        </div>
                        <div class="need-stat-rev-sum-field">
                            <label class="need-stat-rev-sum-label">${labelExtraPierce}</label>
                            <input type="number" class="need-stat-extra-sum-input" data-stat="pierce" value="${this.extraSumPierce}" min="0" max="100" step="0.1">
                        </div>
                        <div class="need-stat-rev-sum-field">
                            <label class="need-stat-rev-sum-label">${labelExtraDefenseReduce}</label>
                            <input type="number" class="need-stat-extra-defense-input" value="${this.extraDefenseReduce}" min="0" max="100" step="0.1">
                        </div>
                        <div class="need-stat-rev-sum-field need-stat-rev-sum-field-skill-effect-amp">
                            ${this.renderSkillEffectAmpControls()}
                        </div>
                    </div>
                    ${this.renderBossSettingsRow()}
                    <div class="need-stat-body open">
                        ${penetrateSelfItems.length > 0 ? `
                        <div class="need-stat-section">
                            <div class="need-stat-section-title">${labelPenetrateSelf}</div>
                            ${penetrateSelfItems.map(item => this.renderPierceItemRow(item, 'pierce', false)).join('')}
                        </div>
                        ` : ''}
                        ${penetrateBuffItems.length > 0 ? `
                        <div class="need-stat-section">
                            <div class="need-stat-section-title">${labelPenetrateBuff}</div>
                            ${this.sortItemsByCurrentChar(penetrateBuffItems, charData).map(item => this.renderPierceItemRow(item, 'pierce', true)).join('')}
                        </div>
                        ` : ''}
                        ${defenseReduceItems.length > 0 ? `
                        <div class="need-stat-section">
                            <div class="need-stat-section-title">${labelDefenseReduce}</div>
                            ${this.sortItemsByCurrentChar(defenseReduceItems, charData).map(item => this.renderPierceItemRow(item, 'defense', true)).join('')}
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        this.syncSkillEffectAmpControls(container);
        this.refreshDisplayedValues(container);

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
        } catch (_) { }

        // Apply i18n translations (same as defense-calc.js and critical-calc.js)
        try { if (typeof window.DefenseI18N !== 'undefined' && window.DefenseI18N.enrichDefenseDataWithWonderNames) { window.DefenseI18N.enrichDefenseDataWithWonderNames(); } } catch (_) { }
        try { if (typeof window.I18NUtils !== 'undefined' && window.I18NUtils.translateStatTexts) { window.I18NUtils.translateStatTexts(container); } } catch (_) { }

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
        return {
            labelBoss: translateNeedStat('needStatBoss', '보스'),
            labelSea: translateNeedStat('needStatBossSea', '바다'),
            labelNightmare: translateNeedStat('needStatBossNightmare', '흉몽'),
            labelDefenseCoef: translateNeedStat('needStatBossDefenseCoef', '방어 계수'),
            labelBaseDefense: translateNeedStat('needStatBossBaseDefense', '기본 방어')
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
            } catch (_) { }
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
    bindBossEvents(container, slotIndex = this.currentSlotIndex) {
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
                this.saveSelectionsToStore(slotIndex);
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
                this.saveSelectionsToStore(slotIndex);
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
                this.saveSelectionsToStore(slotIndex);
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

        const currentBoss = bossData.find(b => b.id === _getGlobalBossSettings().bossId);
        const currentBossInvalid = !currentBoss || (currentType === 'sea' ? !currentBoss.isSea : currentBoss.isSea);

        if (currentBossInvalid && filteredBosses.length > 0) {
            const firstBoss = filteredBosses[0];
            this.selectBoss(firstBoss.id, container);
        } else if (currentBoss) {
            const nameEl = container.querySelector('.need-stat-boss-name');
            if (nameEl) nameEl.textContent = this.getBossDisplayName(currentBoss);
        }

        bossMenu.innerHTML = filteredBosses.map(boss => `
            <div class="revelation-option need-stat-boss-option ${boss.id === _getGlobalBossSettings().bossId ? 'selected' : ''}" data-boss-id="${boss.id}">
                ${boss.img ? `<img src="${this.baseUrl}/assets/img/enemy/${boss.img}" class="need-stat-boss-option-icon" onerror="this.style.display='none'">` : ''}
                <span class="need-stat-boss-option-name">${this.getBossDisplayName(boss)}</span>
            </div>
        `).join('');

        // Apply i18n translations to boss menu
        try { if (typeof window.I18NUtils !== 'undefined' && window.I18NUtils.translateStatTexts) { window.I18NUtils.translateStatTexts(bossMenu); } } catch (_) { }

        // Re-bind option events
        bossMenu.querySelectorAll('.need-stat-boss-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const bossId = parseInt(option.dataset.bossId);
                this.selectBoss(bossId, container);
                container.querySelector('.need-stat-boss-dropdown')?.classList.remove('open');
                this.saveSelectionsToStore(this.currentSlotIndex);
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
                    iconEl.onerror = function () { this.style.display = 'none'; };
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

        try {
            window.dispatchEvent(new CustomEvent('boss-settings-changed', {
                detail: _getGlobalBossSettings()
            }));
        } catch (_) { }

        this.saveSelectionsToStore(this.currentSlotIndex);
    }

    /**
     * Bind critical card events
     */
    bindEvents(container, buffItems, selfItems, slotIndex) {
        // Bind boss settings events
        this.bindBossEvents(container, slotIndex);

        const updateCriticalDisplays = () => {
            this.updateTotalPairDisplays(slotIndex, this.getCriticalTotal(buffItems, selfItems), 'critical');
        };

        const updatePierceDisplays = () => {
            this.updatePierceDisplays(container, slotIndex, this.currentPierceItems, [], this.currentDefenseItems);
        };

        const applySkillEffectAmpState = (partialState, options = {}) => {
            const currentState = getGlobalSkillEffectAmpState();
            const nextState = {
                enabled: partialState.enabled !== undefined ? !!partialState.enabled : currentState.enabled,
                value: partialState.value !== undefined ? partialState.value : currentState.value
            };

            setGlobalSkillEffectAmpState(nextState, { silent: true });
            this.syncSkillEffectAmpControls(container, options);
            this.refreshDisplayedValues(container);
            updateCriticalDisplays();
            updatePierceDisplays();
            this.saveSelectionsToStore(slotIndex);

            try {
                window.dispatchEvent(new CustomEvent('need-stat-skill-effect-amp-changed', {
                    detail: getGlobalSkillEffectAmpState()
                }));
            } catch (_) { }
        };

        // Revelation Sum inputs (one per column)
        container.querySelectorAll('.need-stat-rev-sum-input').forEach(revSumInput => {
            revSumInput.addEventListener('input', (e) => {
                e.stopPropagation();
                const statType = revSumInput.dataset.stat;
                const val = parseFloat(revSumInput.value) || 0;

                if (statType === 'critical') {
                    this.revelationSumCritical = val;
                    updateCriticalDisplays();
                    this.saveSelectionsToStore(slotIndex);
                } else if (statType === 'pierce') {
                    this.revelationSumPierce = val;
                    updatePierceDisplays();
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
                    updateCriticalDisplays();
                    this.saveSelectionsToStore(slotIndex);
                } else if (statType === 'pierce') {
                    this.extraSumPierce = val;
                    updatePierceDisplays();
                    this.saveSelectionsToStore(slotIndex);
                }
            });
            extraSumInput.addEventListener('click', (e) => e.stopPropagation());
        });

        container.querySelectorAll('[data-skill-effect-amp-toggle]').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                e.stopPropagation();
                applySkillEffectAmpState({ enabled: !!toggle.checked });
            });
            toggle.addEventListener('click', (e) => e.stopPropagation());
        });

        container.querySelectorAll('[data-skill-effect-amp-value]').forEach(input => {
            input.addEventListener('input', (e) => {
                e.stopPropagation();
                const rawValue = input.value;
                const nextValue = parseFloat(rawValue);
                applySkillEffectAmpState(
                    { value: isFinite(nextValue) ? Math.max(0, nextValue) : 0 },
                    { preserveInput: input, rawValue }
                );
            });
            input.addEventListener('click', (e) => e.stopPropagation());
            input.addEventListener('blur', () => {
                this.syncSkillEffectAmpControls(container);
            });
        });

        // Item row click (whole row toggles check) - ONLY for critical items (no data-category)
        container.querySelectorAll('.need-stat-row:not([data-category])').forEach(row => {
            const checkEl = row.querySelector('.need-stat-check');
            if (!checkEl) return;

            const toggleCheck = (e) => {
                e.stopPropagation();
                const itemId = row.dataset.itemId;
                if (!itemId) return;

                const newChecked = !this.selectedItems.has(itemId);

                if (newChecked) {
                    this.selectedItems.add(itemId);
                    row.classList.add('checked');
                    checkEl.src = `${this.baseUrl}/assets/img/ui/check-on.png`;
                    checkEl.classList.remove('check-off');
                } else {
                    this.selectedItems.delete(itemId);
                    row.classList.remove('checked');
                    checkEl.src = `${this.baseUrl}/assets/img/ui/check-off.png`;
                    checkEl.classList.add('check-off');
                }

                // Check if this is a shared item (buff with type '광역')
                const buffItem = buffItems.find(i => String(i.id || `${i.source}_${i.skillName}`) === itemId);
                if (buffItem) {
                    const sharedCategory = this.getSharedCategory(buffItem, 'critical', true);
                    if (sharedCategory) {
                        setGlobalSharedCheck(sharedCategory, itemId, newChecked);
                    }
                }

                updateCriticalDisplays();

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

                const item = this.findItemById(itemId, 'critical');

                const optionData = item ? this.getLocalizedOptionData(item) : null;

                if (item && optionData && optionData.values && optionData.values[selectedOption] !== undefined) {
                    const newBaseValue = Number(optionData.values[selectedOption]) || 0;
                    item._selectedOption = selectedOption;

                    // Save to global state for persistence
                    setGlobalItemOption(itemId, selectedOption);

                    // J&C jc1인 경우 페르소나 성능 적용
                    if (String(itemId) === 'jc1') {
                        this.setItemFormulaSourceValue(item, newBaseValue);
                        const personaInput = row ? row.querySelector('.need-stat-persona-input') : null;
                        const N = personaInput ? (parseFloat(personaInput.value) || 100) : 100;
                        this.setItemBaseValue(item, this.applyPersonaPerformanceValue(newBaseValue, N));
                    } else {
                        this.setItemBaseValue(item, newBaseValue);
                    }

                    if (valueEl) this.renderItemValue(item, valueEl);
                    updateCriticalDisplays();

                    // Save selections to store
                    this.saveSelectionsToStore(slotIndex);
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

                const item = this.findItemById(itemId, 'critical');

                if (item) {
                    this.syncPersonaPerformanceInputs(container, itemId, N);
                    this.applyPersonaPerformanceToItem(item, N);
                    if (valueEl) this.renderItemValue(item, valueEl);

                    const syncedPierceItem = this.findItemById(itemId, 'pierce');
                    if (syncedPierceItem) {
                        this.applyPersonaPerformanceToItem(syncedPierceItem, N);
                        const syncedPierceValueEl = this.getItemValueCell(container, itemId, 'pierce');
                        if (syncedPierceValueEl) {
                            this.renderItemValue(syncedPierceItem, syncedPierceValueEl);
                        }
                    }

                    updateCriticalDisplays();
                    updatePierceDisplays();
                    this.saveSelectionsToStore(this.currentSlotIndex);
                    return;
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

                    // Save persona performance value to store
                    this.saveSelectionsToStore(this.currentSlotIndex);
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
        const updateCriticalDisplays = () => {
            this.updateTotalPairDisplays(slotIndex, this.getCriticalTotal(this.currentCriticalItems, []), 'critical');
        };

        // Helper to update pierce displays (target/current/needed)
        const updatePierceDisplays = () => {
            const penetrateFromItems = this.calculatePierceTotal(penetrateSelfItems, penetrateBuffItems);
            const defenseReduceFromItems = this.calculateDefenseReduceTotal(defenseReduceItems);
            const totalDefenseReduce = defenseReduceFromItems + this.extraDefenseReduce;
            const pierceTotal = penetrateFromItems + this.revelationSumPierce + this.extraSumPierce + getGlobalElucidatorPierce();

            const defenseStats = this.calculateDefenseStats(pierceTotal, totalDefenseReduce);
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
            if (defenseRequiredEl) defenseRequiredEl.textContent = `${pierceNeeded.toFixed(1)}%`;

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
                const newChecked = !selectedSet.has(itemId);

                if (newChecked) {
                    selectedSet.add(itemId);
                    row.classList.add('checked');
                    checkEl.src = `${this.baseUrl}/assets/img/ui/check-on.png`;
                    checkEl.classList.remove('check-off');

                    // Handle mutually exclusive items
                    this.handleMutuallyExclusiveCheck(itemId, category, container);
                } else {
                    selectedSet.delete(itemId);
                    row.classList.remove('checked');
                    checkEl.src = `${this.baseUrl}/assets/img/ui/check-off.png`;
                    checkEl.classList.add('check-off');
                }

                // Check if this is a shared item
                let item = null;
                let isBuff = false;

                if (category === 'defense') {
                    // All defense items are shared
                    item = allDefenseItems.find(i => String(i.id || `${i.source}_${i.skillName}`) === itemId);
                    isBuff = true; // defense items are always shared
                } else if (category === 'pierce') {
                    // Check if it's a buff item with type '광역'
                    item = penetrateBuffItems.find(i => String(i.id || `${i.source}_${i.skillName}`) === itemId);
                    if (item) {
                        isBuff = true;
                    } else {
                        item = penetrateSelfItems.find(i => String(i.id || `${i.source}_${i.skillName}`) === itemId);
                    }
                }

                if (item) {
                    const sharedCategory = this.getSharedCategory(item, category, isBuff);
                    if (sharedCategory) {
                        setGlobalSharedCheck(sharedCategory, itemId, newChecked);
                    }
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
                const item = allItems.find(i => String(i.id || `${i.source}_${i.skillName}`) === itemId);

                const optionData = item ? this.getLocalizedOptionData(item) : null;

                if (item && optionData && optionData.values && optionData.values[selectedOption] !== undefined) {
                    const newBaseValue = Number(optionData.values[selectedOption]) || 0;
                    item._selectedOption = selectedOption;

                    // Save to global state for persistence (with category prefix)
                    const optionKey = `${category}_${itemId}`;
                    setGlobalItemOption(optionKey, selectedOption);

                    // J&C 아이템인 경우 페르소나 성능 적용
                    const isJC = (String(itemId) === 'jc1' || String(itemId) === 'jc2');
                    if (isJC) {
                        this.setItemFormulaSourceValue(item, newBaseValue);
                        const personaInput = row ? row.querySelector('.need-stat-persona-input') : null;
                        const N = personaInput ? (parseFloat(personaInput.value) || 100) : 100;
                        this.setItemBaseValue(item, this.applyPersonaPerformanceValue(newBaseValue, N));
                    } else {
                        this.setItemBaseValue(item, newBaseValue);
                    }

                    if (valueEl) this.renderItemValue(item, valueEl);
                    updatePierceDisplays();

                    // Save selections to store
                    this.saveSelectionsToStore(slotIndex);
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
                    this.syncPersonaPerformanceInputs(container, itemId, N);
                    this.applyPersonaPerformanceToItem(item, N);
                    if (valueEl) this.renderItemValue(item, valueEl);

                    if (String(itemId) === 'jc1' && category === 'pierce') {
                        const syncedCriticalItem = this.findItemById(itemId, 'critical');
                        if (syncedCriticalItem) {
                            this.applyPersonaPerformanceToItem(syncedCriticalItem, N);
                            const syncedCriticalValueEl = this.getItemValueCell(container, itemId, null);
                            if (syncedCriticalValueEl) {
                                this.renderItemValue(syncedCriticalItem, syncedCriticalValueEl);
                            }
                        }
                        updateCriticalDisplays();
                    }

                    updatePierceDisplays();
                    this.saveSelectionsToStore(this.currentSlotIndex);
                    return;
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
                    // jc2: value/2 + value/2 * N/100 = value * (50 + N/2) / 100
                    else if (String(itemId) === 'jc2') {
                        calculatedValue = baseValue * (50 + N / 2) / 100;
                    }

                    item.value = calculatedValue;
                    if (valueEl) valueEl.textContent = `${calculatedValue.toFixed(2)}%`;

                    updatePierceDisplays();

                    // Save persona performance value to store
                    this.saveSelectionsToStore(this.currentSlotIndex);
                }
            });
        });
    }

}
