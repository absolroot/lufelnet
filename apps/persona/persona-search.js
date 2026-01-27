// persona-search.js
// Handles search functionality, dropdown, and filtering for the Persona page

(function () {
    // State variables
    let isListenersBound = false;
    let personaNameMapping = {};
    let searchIndex = {}; // Stores the concatenated search text for each persona
    let nameSource = {};
    let searchDebounceTimer;
    let suppressDropdown = false;
    let lastConfirmedSearchValue = '';

    // Initialize on DOMContentLoaded
    // Initialize on DOMContentLoaded - REMOVED to prevent overwriting i18n
    // document.addEventListener('DOMContentLoaded', initSearch);

    // Make available globally for manual re-init after data load
    window.initPersonaSearch = initSearch;

    function initSearch() {
        // 1. Build Data Mapping (can be called multiple times to refresh data)
        buildMapping();

        // 2. Bind Listeners (only once)
        if (!isListenersBound) {
            const searchInput = document.getElementById('personaSearch');
            if (searchInput) {
                bindListeners(searchInput);
                isListenersBound = true;
            }
        }

        // 3. Re-run search if input has value (e.g. from URL param applied before script loaded)
        const searchInput = document.getElementById('personaSearch');
        if (searchInput && searchInput.value.trim() !== '') {
            filterBySearch(searchInput.value.trim().toLowerCase());
        }
    }

    function buildMapping() {
        nameSource = (typeof window !== 'undefined' && window.personaFiles) ? window.personaFiles : {};
        personaNameMapping = {}; // Reset
        searchIndex = {}; // Reset index

        Object.keys(nameSource).forEach(koreanName => {
            const persona = nameSource[koreanName];

            // 1. Name Mapping for Dropdown
            personaNameMapping[koreanName.toLowerCase()] = koreanName;
            if (persona.name_en) personaNameMapping[persona.name_en.toLowerCase()] = koreanName;
            if (persona.name_jp) personaNameMapping[persona.name_jp.toLowerCase()] = koreanName;

            // 2. Build Search Index (Concatenate all searchable text)
            let searchText = '';

            // Names
            searchText += (persona.name || '') + ' ';
            searchText += (persona.name_en || '') + ' ';
            searchText += (persona.name_jp || '') + ' ';

            // Unique Skill
            if (persona.uniqueSkill) {
                searchText += (persona.uniqueSkill.name || '') + ' ';
                searchText += (persona.uniqueSkill.name_en || '') + ' ';
                searchText += (persona.uniqueSkill.name_jp || '') + ' ';
                searchText += (persona.uniqueSkill.desc || '') + ' ';
                searchText += (persona.uniqueSkill.desc_en || '') + ' ';
                searchText += (persona.uniqueSkill.desc_jp || '') + ' ';
            }

            // Highlight
            if (persona.highlight) {
                searchText += (persona.highlight.name || '') + ' ';
                searchText += (persona.highlight.name_en || '') + ' ';
                searchText += (persona.highlight.name_jp || '') + ' ';
                searchText += (persona.highlight.desc || '') + ' ';
                searchText += (persona.highlight.desc_en || '') + ' ';
                searchText += (persona.highlight.desc_jp || '') + ' ';
            }

            // Innate Skills
            if (persona.innate_skill && Array.isArray(persona.innate_skill)) {
                persona.innate_skill.forEach(s => {
                    searchText += (s.name || '') + ' ';
                    searchText += (s.name_en || '') + ' ';
                    searchText += (s.name_jp || '') + ' ';
                    searchText += (s.desc || '') + ' ';
                    searchText += (s.desc_en || '') + ' ';
                    searchText += (s.desc_jp || '') + ' ';
                });
            }

            // Passive Skills
            if (persona.passive_skill && Array.isArray(persona.passive_skill)) {
                persona.passive_skill.forEach(s => {
                    searchText += (s.name || '') + ' ';
                    searchText += (s.name_en || '') + ' ';
                    searchText += (s.name_jp || '') + ' ';
                    searchText += (s.desc || '') + ' ';
                    searchText += (s.desc_en || '') + ' ';
                    searchText += (s.desc_jp || '') + ' ';
                });
            }

            // Note: Recommended Skills are EXCLUDED per user request.

            searchIndex[koreanName] = searchText.toLowerCase();
        });
        // console.log("[Search] Mapping built with " + Object.keys(nameSource).length + " items.");
    }

    function bindListeners(searchInput) {
        const dropdown = document.getElementById('searchDropdown');

        const clearBtn = document.getElementById('searchClearBtn');
        const updateClearBtn = () => {
            if (clearBtn) clearBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
        }

        searchInput.addEventListener('input', (e) => {
            handleSearchInput(e, searchInput, dropdown);
            updateClearBtn();
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                updateClearBtn();
                searchInput.focus();
                filterBySearch('');
                suppressDropdown = true;
                if (dropdown) dropdown.style.display = 'none';
            });
        }

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = searchInput.value.trim().toLowerCase();
                clearTimeout(searchDebounceTimer);
                filterBySearch(value);
                if (dropdown) dropdown.style.display = 'none';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && (!dropdown || !dropdown.contains(e.target))) {
                if (dropdown) dropdown.style.display = 'none';
            }
        });

        // Initial state check
        updateClearBtn();
    }

    function handleSearchInput(e, searchInput, dropdown) {
        const searchValue = e ? e.target.value.toLowerCase() : '';
        if (searchValue !== lastConfirmedSearchValue) suppressDropdown = false;

        if (suppressDropdown) {
            if (dropdown) dropdown.style.display = 'none';
        } else {
            updateDropdown(searchValue, searchInput, dropdown);
        }

        const clearBtn = document.getElementById('searchClearBtn');
        if (clearBtn) clearBtn.style.display = searchValue.length > 0 ? 'block' : 'none';

        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            filterBySearch(searchValue);
        }, 100);
    }

    function updateDropdown(searchValue, searchInput, dropdown) {
        if (window.isApplyingUrlSearch || suppressDropdown) {
            if (dropdown) dropdown.style.display = 'none';
            return;
        }
        if (!dropdown) return;

        dropdown.innerHTML = '';

        if (searchValue.length > 0) {
            const matches = Object.keys(personaNameMapping).filter(name =>
                name.includes(searchValue)
            ).slice(0, 10);

            if (matches.length > 0) {
                dropdown.style.display = 'block';
                const fragment = document.createDocumentFragment();

                matches.forEach(matchedName => {
                    const koreanName = personaNameMapping[matchedName];
                    const persona = nameSource[koreanName];
                    let displayName = koreanName;
                    const lang = (typeof window.LanguageRouter !== 'undefined') ? window.LanguageRouter.getCurrentLanguage() : ((typeof window.currentLang !== 'undefined') ? window.currentLang : 'kr');

                    if (lang === 'en' && persona.name_en) displayName = persona.name_en;
                    else if (lang === 'jp' && persona.name_jp) displayName = persona.name_jp;

                    const div = document.createElement('div');
                    div.className = 'dropdown-item';
                    div.textContent = displayName;
                    div.addEventListener('click', () => {
                        searchInput.value = displayName;
                        dropdown.style.display = 'none';
                        filterBySearch(displayName.toLowerCase()); // Search by the selected display name (or key)
                    });
                    fragment.appendChild(div);
                });
                dropdown.appendChild(fragment);
            } else {
                dropdown.style.display = 'none';
            }
        } else {
            dropdown.style.display = 'none';
        }
    }

    // Global filter function
    window.filterBySearch = function (searchValue) {
        // Logic to filter .persona-detail-container elements
        const containers = document.querySelectorAll('.persona-detail-container');
        searchValue = searchValue.trim().toLowerCase();

        containers.forEach(container => {
            const name = container.dataset.name;
            if (!name) return;

            let isMatch = false;

            // Check against pre-computed index
            if (searchValue === '') {
                isMatch = true;
            } else if (searchIndex[name]) {
                // Determine search terms (support space-separated?)
                // Simple 'includes' for now as typical for this scale
                if (searchIndex[name].includes(searchValue)) {
                    isMatch = true;
                }
            }

            if (isMatch) {
                container.classList.remove('hidden-by-search');
                container.style.display = '';
            } else {
                container.classList.add('hidden-by-search');
                container.style.display = 'none';
            }
        });

        // Update Filtered Count
        const visible = document.querySelectorAll('.persona-detail-container:not([style*="display: none"])').length;
        const countEl = document.getElementById('filteredCount');
        if (countEl) {
            const countText = (window.t && window.t('filteredCount', '전체')) || '전체';
            const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'kr';
            const countUnit = (window.t && window.t('countUnit', (currentLang === 'kr' ? '개' : ''))) || '';
            countEl.textContent = `${countText} ${visible}${countUnit}`;
        }
    };

    // Helper for init
    function filterBySearch(val) {
        window.filterBySearch(val);
    }

})();
