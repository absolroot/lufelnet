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

        // Wait for data to be ready
        await DataLoader.ensureData();
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
}

// Start App
document.addEventListener('DOMContentLoaded', () => {
    window.tacticMakerApp = new TacticMakerApp();
});
