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

class TacticMakerApp {
    constructor() {
        this.init();
    }

    async init() {
        console.log('[TacticMaker] Initializing...');

        // Initialize Internationalization
        await I18nService.init('tactic-maker');

        // Wait for data to be ready
        await DataLoader.ensureData();

        // Initialize Store
        this.store = new TacticStore();

        // Initialize Settings
        this.settingsUI = new TacticSettingsUI();

        // Initialize UI Modules
        this.personaModal = new PersonaModal(this.store);
        this.wonderUI = new WonderUI(this.store, this.personaModal);
        // Pass wonderUI and settingsUI to PartyUI
        this.partyUI = new PartyUI(this.store, this.wonderUI, this.settingsUI);
        // Connect partyUI back to wonderUI for order updates
        this.wonderUI.setPartyUI(this.partyUI);
        this.tacticUI = new TacticUI(this.store);

        // Initialize Import/Export
        this.importExport = new ImportExport(this.store);

        // Wire title input to store
        this.initTitleInput();

        // Expose for debugging
        window.tacticStore = this.store;
        window.tacticApp = this;

        // Force initial render
        this.store.notify('fullReload', this.store.state);
        // Also render Wonder Config (hidden) to ensure it's built
        if (this.wonderUI) this.wonderUI.render();

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
