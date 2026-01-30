export class TacticSettingsUI {
    constructor() {
        this.settings = {
            defaultRitual: '0',
            defaultModification: '-',
            autoWonderWeapon: true
        };
        this.STORAGE_KEY = 'tactic_maker_settings';

        this.elements = {
            btnSettings: document.getElementById('btnSettings'),
            modal: document.getElementById('settingsModal'),
            inputRitual: document.getElementById('settingDefaultRitual'),
            inputModification: document.getElementById('settingDefaultModification'),
            inputAutoWonderWeapon: document.getElementById('settingAutoWonderWeapon')
        };

        this.init();
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
    }

    saveSettings() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
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
}
