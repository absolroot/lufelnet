export class TacticSettingsUI {
    constructor() {
        const defaultShowNatureSkillInputs = this.getDefaultShowNatureSkillInputs();
        this.settings = {
            defaultRitual: '0',
            defaultModification: '-',
            autoWonderWeapon: true,
            autoActionPrompt: true,
            showNatureSkillInputs: defaultShowNatureSkillInputs
        };
        this.STORAGE_KEY = 'tactic_maker_settings';

        this.elements = {
            btnSettings: document.getElementById('btnSettings'),
            modal: document.getElementById('settingsModal'),
            inputRitual: document.getElementById('settingDefaultRitual'),
            inputModification: document.getElementById('settingDefaultModification'),
            inputAutoWonderWeapon: document.getElementById('settingAutoWonderWeapon'),
            inputAutoActionPrompt: document.getElementById('settingAutoActionPrompt'),
            inputShowNatureSkillInputs: document.getElementById('settingShowNatureSkillInputs')
        };

        this.init();
    }

    getCurrentLanguage() {
        if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
            return window.I18nService.getCurrentLanguage();
        }
        if (window.LanguageRouter && typeof window.LanguageRouter.getCurrentLanguage === 'function') {
            return window.LanguageRouter.getCurrentLanguage();
        }
        if (typeof window.getCurrentLanguage === 'function') {
            return window.getCurrentLanguage();
        }
        return 'kr';
    }

    getDefaultShowNatureSkillInputs() {
        const lang = this.getCurrentLanguage();
        return lang === 'kr' || lang === 'cn';
    }

    init() {
        this.loadSettings();
        this.bindEvents();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsed };

                if (typeof this.settings.autoWonderWeapon === 'undefined') {
                    this.settings.autoWonderWeapon = true;
                }
                if (typeof this.settings.autoActionPrompt === 'undefined') {
                    this.settings.autoActionPrompt = true;
                }
                if (typeof this.settings.showNatureSkillInputs === 'undefined') {
                    this.settings.showNatureSkillInputs = this.getDefaultShowNatureSkillInputs();
                }
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }

        // Apply to UI
        if (this.elements.inputRitual) {
            this.elements.inputRitual.value = this.settings.defaultRitual;
        }
        if (this.elements.inputModification) {
            this.elements.inputModification.value = this.settings.defaultModification;
        }
        if (this.elements.inputAutoWonderWeapon) {
            this.elements.inputAutoWonderWeapon.checked = this.settings.autoWonderWeapon;
        }
        if (this.elements.inputAutoActionPrompt) {
            this.elements.inputAutoActionPrompt.checked = this.settings.autoActionPrompt;
        }
        if (this.elements.inputShowNatureSkillInputs) {
            this.elements.inputShowNatureSkillInputs.checked = this.settings.showNatureSkillInputs;
        }
    }

    saveSettings() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    notifySettingsChange(key, value) {
        window.dispatchEvent(new CustomEvent('tactic-settings-change', {
            detail: { key, value, settings: { ...this.settings } }
        }));
    }

    bindEvents() {
        if (this.elements.btnSettings) {
            this.elements.btnSettings.addEventListener('click', () => {
                this.openModal();
            });
        }

        if (this.elements.modal) {
            this.elements.modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop') || e.target.closest('.modal-close')) {
                    this.closeModal();
                }
            });
        }

        if (this.elements.inputRitual) {
            this.elements.inputRitual.addEventListener('change', (e) => {
                this.settings.defaultRitual = e.target.value;
                this.saveSettings();
            });
        }

        if (this.elements.inputModification) {
            this.elements.inputModification.addEventListener('change', (e) => {
                this.settings.defaultModification = e.target.value;
                this.saveSettings();
            });
        }

        if (this.elements.inputAutoWonderWeapon) {
            this.elements.inputAutoWonderWeapon.addEventListener('change', (e) => {
                this.settings.autoWonderWeapon = e.target.checked;
                this.saveSettings();
                this.notifySettingsChange('autoWonderWeapon', this.settings.autoWonderWeapon);
            });
        }

        if (this.elements.inputAutoActionPrompt) {
            this.elements.inputAutoActionPrompt.addEventListener('change', (e) => {
                this.settings.autoActionPrompt = e.target.checked;
                this.saveSettings();
                this.notifySettingsChange('autoActionPrompt', this.settings.autoActionPrompt);
            });
        }

        if (this.elements.inputShowNatureSkillInputs) {
            this.elements.inputShowNatureSkillInputs.addEventListener('change', (e) => {
                this.setShowNatureSkillInputs(e.target.checked);
            });
        }
    }

    openModal() {
        if (this.elements.modal) {
            this.elements.modal.hidden = false;
            requestAnimationFrame(() => this.elements.modal.classList.add('show'));
        }
    }

    closeModal() {
        if (this.elements.modal) {
            this.elements.modal.hidden = true;
            this.elements.modal.classList.remove('show');
        }
    }

    // Public API
    getDefaultRitual() {
        return this.settings.defaultRitual;
    }

    getDefaultModification() {
        return this.settings.defaultModification;
    }

    getAutoWonderWeapon() {
        return this.settings.autoWonderWeapon;
    }

    getAutoActionPrompt() {
        return this.settings.autoActionPrompt;
    }

    getShowNatureSkillInputs() {
        return this.settings.showNatureSkillInputs;
    }

    setShowNatureSkillInputs(value, options = {}) {
        const nextValue = !!value;
        const changed = this.settings.showNatureSkillInputs !== nextValue;
        this.settings.showNatureSkillInputs = nextValue;
        if (this.elements.inputShowNatureSkillInputs) {
            this.elements.inputShowNatureSkillInputs.checked = nextValue;
        }
        if (options.persist !== false) {
            this.saveSettings();
        }
        if (changed && options.silent !== true) {
            this.notifySettingsChange('showNatureSkillInputs', nextValue);
        }
    }

    dataHasNatureSkillValues(data) {
        const party = Array.isArray(data?.party) ? data.party : [];
        return party.some(member => {
            const natureSkill = member?.natureSkill;
            return !!(natureSkill && (natureSkill.synergySn || natureSkill.combatSn));
        });
    }

    enableNatureSkillInputsForLoadedData(data) {
        if (this.dataHasNatureSkillValues(data)) {
            this.setShowNatureSkillInputs(true);
        }
    }
}
