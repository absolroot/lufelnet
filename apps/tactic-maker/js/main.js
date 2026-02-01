/**
 * Tactic Maker V2 Main Entry Point
 */

// I18nService is globally loaded via default.html
import { TacticStore } from './store.js';
import { DataLoader } from './data-loader.js';
import { PartyUI } from './ui-party.js';
import { TacticUI } from './ui-tactic.js';
import { WonderUI } from './ui-wonder.js';
import { PersonaModal } from './ui-persona-modal.js';
import { ImportExport } from './import-export.js';
import { TacticSettingsUI } from './ui-settings.js';
import { CaptureUI } from './capture.js';

class TacticMakerApp {
    constructor() {
        this.init();
    }

    updateLoadingProgress(percent) {
        const bar = document.getElementById('tacticLoadingBar');
        const text = document.getElementById('tacticLoadingPercent');
        if (bar) bar.style.width = `${percent}%`;
        if (text) text.textContent = `${Math.round(percent)}%`;
    }

    async init() {
        console.log('[TacticMaker] Initializing...');

        this.updateLoadingProgress(5);

        // Initialize Internationalization
        await I18nService.init('tactic-maker');
        I18nService.updateDOM();
        this.updateLoadingProgress(15);

        // Wait for data to be ready (with progress callback)
        await DataLoader.ensureData((progress) => this.updateLoadingProgress(progress));
        this.updateLoadingProgress(40);

        // Load revelation translations for non-Korean languages
        await DataLoader.loadRevelationMapping();
        this.updateLoadingProgress(50);

        // Initialize Store
        this.store = new TacticStore();
        this.updateLoadingProgress(55);

        // Initialize Settings
        this.settingsUI = new TacticSettingsUI();
        this.updateLoadingProgress(60);

        // Initialize UI Modules
        this.personaModal = new PersonaModal(this.store);
        this.updateLoadingProgress(65);

        this.wonderUI = new WonderUI(this.store, this.personaModal);
        this.updateLoadingProgress(70);

        // Pass wonderUI and settingsUI to PartyUI
        this.partyUI = new PartyUI(this.store, this.wonderUI, this.settingsUI);
        this.updateLoadingProgress(80);

        // Connect partyUI back to wonderUI for order updates
        this.wonderUI.setPartyUI(this.partyUI);
        this.tacticUI = new TacticUI(this.store, this.settingsUI);
        this.updateLoadingProgress(85);

        // Initialize Import/Export
        this.importExport = new ImportExport(this.store);
        this.updateLoadingProgress(90);

        // Initialize Capture
        this.captureUI = new CaptureUI(this.store);
        this.updateLoadingProgress(95);

        // Wire title input to store
        this.initTitleInput();

        // Wire memo input to store
        this.initMemoInput();

        // Initialize auto-save
        this.initAutoSave();

        // Initialize reset button
        this.initResetButton();

        // Load auto-saved data if exists
        this.loadAutoSavedData();

        // Expose for debugging
        window.tacticStore = this.store;
        window.tacticApp = this;

        // Force initial render
        this.store.notify('fullReload', this.store.state);
        // Also render Wonder Config (hidden) to ensure it's built
        if (this.wonderUI) this.wonderUI.render();

        this.updateLoadingProgress(100);

        // Hide loading overlay after reaching 100%
        const loadingOverlay = document.getElementById('tacticLoadingOverlay');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 300);
            }, 200);
        }

        console.log('[TacticMaker] Ready');
    }

    initTitleInput() {
        const titleInput = document.getElementById('tacticTitle');
        if (titleInput) {
            // Load from store
            titleInput.value = this.store.state.title || '';

            // Listen for changes
            titleInput.addEventListener('input', (e) => {
                this.store.setTitle(e.target.value.slice(0, 50));
            });

            // Listen for store updates
            this.store.subscribe((event, data) => {
                if (event === 'titleChange' || event === 'fullReload') {
                    const newTitle = event === 'fullReload' ? data.title : data;
                    if (titleInput.value !== newTitle) {
                        titleInput.value = newTitle || '';
                    }
                }
            });
        }
    }

    initMemoInput() {
        const memoInput = document.getElementById('tacticMemo');
        if (memoInput) {
            // Load from store
            memoInput.value = this.store.state.memo || '';

            // Listen for changes
            memoInput.addEventListener('input', (e) => {
                this.store.setMemo(e.target.value);
            });

            // Listen for store updates
            this.store.subscribe((event, data) => {
                if (event === 'memoChange' || event === 'fullReload') {
                    const newMemo = event === 'fullReload' ? data.memo : data;
                    if (memoInput.value !== newMemo) {
                        memoInput.value = newMemo || '';
                    }
                }
            });
        }
    }

    initAutoSave() {
        const btnAutoSave = document.getElementById('btnAutoSave');
        const autoSaveStatusEl = document.getElementById('autoSaveStatus');

        // Update time display
        const updateTimeDisplay = (time) => {
            if (autoSaveStatusEl && time) {
                autoSaveStatusEl.textContent = time;
                autoSaveStatusEl.classList.remove('hidden');
            }
        };

        // Manual save button
        if (btnAutoSave) {
            btnAutoSave.addEventListener('click', () => {
                const time = this.store.saveToLocalStorage();
                if (time) {
                    updateTimeDisplay(time);
                }
            });
        }

        // Listen for auto-save events
        this.store.subscribe((event, data) => {
            if (event === 'autoSave' && data.time) {
                updateTimeDisplay(data.time);
            }
        });

        // Auto-save every 60 seconds
        this.autoSaveInterval = setInterval(() => {
            const time = this.store.saveToLocalStorage();
            if (time) {
                updateTimeDisplay(time);
            }
        }, 60000); // 1 minute

        // Show last save time on load
        const lastTime = this.store.getLastSaveTime();
        if (lastTime) {
            updateTimeDisplay(lastTime);
        }

        // Update tooltips with i18n
        this.updateTooltips();
    }

    updateTooltips() {
        const t = (key, fallback) => window.I18nService ? window.I18nService.t(key, fallback) : fallback;
        document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
            const key = el.getAttribute('data-i18n-tooltip');
            el.setAttribute('data-tooltip', t(key, el.getAttribute('data-tooltip')));
        });
    }

    loadAutoSavedData() {
        // Check if there's auto-saved data
        const savedTime = this.store.getLastSaveTime();
        if (savedTime) {
            // Load auto-saved data
            this.store.loadFromLocalStorage();

            // Update UI
            const titleInput = document.getElementById('tacticTitle');
            if (titleInput) {
                titleInput.value = this.store.state.title || '';
            }
            const memoInput = document.getElementById('tacticMemo');
            if (memoInput) {
                memoInput.value = this.store.state.memo || '';
            }
        }
    }

    initResetButton() {
        const btnReset = document.getElementById('btnReset');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                const t = (key, fallback) => window.I18nService ? window.I18nService.t(key, fallback) : fallback;
                if (confirm(t('resetConfirm', '모든 데이터를 초기화하시겠습니까?'))) {
                    this.store.clearAll();

                    // Reset UI inputs
                    const titleInput = document.getElementById('tacticTitle');
                    if (titleInput) titleInput.value = '';
                    const memoInput = document.getElementById('tacticMemo');
                    if (memoInput) memoInput.value = '';

                    // Clear auto-save time display
                    const autoSaveStatusEl = document.getElementById('autoSaveStatus');
                    if (autoSaveStatusEl) {
                        autoSaveStatusEl.textContent = '';
                        autoSaveStatusEl.classList.add('hidden');
                    }
                }
            });
        }
    }
}

// Start App
document.addEventListener('DOMContentLoaded', () => {
    window.tacticMakerApp = new TacticMakerApp();
});
