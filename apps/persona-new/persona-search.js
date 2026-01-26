// persona-search.js
// Handles search functionality, dropdown, and filtering for the Persona page

(function () {
    // State variables
    let isListenersBound = false;
    let personaNameMapping = {};
    let nameSource = {};
    let searchDebounceTimer;
    let suppressDropdown = false;
    let lastConfirmedSearchValue = '';

    // Initialize on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initSearch);

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

        Object.keys(nameSource).forEach(koreanName => {
            const persona = nameSource[koreanName];
            personaNameMapping[koreanName.toLowerCase()] = koreanName;
            if (persona.name_en) personaNameMapping[persona.name_en.toLowerCase()] = koreanName;
            if (persona.name_jp) personaNameMapping[persona.name_jp.toLowerCase()] = koreanName;
        });
        // console.log("[Search] Mapping built with " + Object.keys(nameSource).length + " items.");
    }

    function bindListeners(searchInput) {
        const dropdown = document.getElementById('searchDropdown');

        searchInput.addEventListener('input', (e) => handleSearchInput(e, searchInput, dropdown));
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
    }

    function handleSearchInput(e, searchInput, dropdown) {
        const searchValue = e ? e.target.value.toLowerCase() : '';
        if (searchValue !== lastConfirmedSearchValue) suppressDropdown = false;

        if (suppressDropdown) {
            if (dropdown) dropdown.style.display = 'none';
        } else {
            updateDropdown(searchValue, searchInput, dropdown);
        }

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
                        filterBySearch(matchedName.toLowerCase()); // Filter by the matched key
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
            if (searchValue === '') {
                isMatch = true;
            } else {
                const persona = nameSource[name];
                if (persona) {
                    const k = name.toLowerCase();
                    const e = (persona.name_en || '').toLowerCase();
                    const j = (persona.name_jp || '').toLowerCase();
                    if (k.includes(searchValue) || e.includes(searchValue) || j.includes(searchValue)) {
                        isMatch = true;
                    }
                }
            }

            if (isMatch) {
                container.classList.remove('hidden-by-search');
                // Only show if not hidden by other filters
                // Assuming other filters use 'hidden-by-filter' class or similar logic from applyFilters()
                // Note: applyFilters usually sets style.display = 'none'.
                // To cooperate:
                // We need to know if it's hidden by filter.
                // But applyFilters function inside index.html controls display directly.
                // This filterBySearch function should probably trigger applyFilters or coexist.
                // For now, FORCE display if match and let user reset filters if needed?
                // NO, better to respect existing display property if it was hidden by filter?
                // Complication: The user wants to search. If I search "Agathion", show it even if I filtered "Phys"?
                // Usually search overrides or intersects. 
                // Let's make it intersect: If hidden by key filter, stay hidden??
                // The user likely wants to FIND it.
                // Let's force show for now, or just remove 'hidden-by-search' class and ensure display is cleared IF NOT hidden by filter.
                // Index.html ApplyFilters:
                // if (!filterCache.elements.has(source.element)...) container.style.display = 'none';
                // It manages display directly.
                // If we change display here, applyFilters might overwrite it or vice versa.
                // Ideally we update a search state and call applyFilters.
                // But applyFilters is local in index.html.

                // Fallback: Just set display.
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
            const countText = window.i18nFilteredCount || '전체';
            const countUnit = window.i18nCountUnit !== undefined ? window.i18nCountUnit : (typeof window.currentLang !== 'undefined' && window.currentLang === 'kr' ? '개' : '');
            countEl.textContent = `${countText} ${visible}${countUnit}`;
        }
    };

    // Helper for init
    function filterBySearch(val) {
        window.filterBySearch(val);
    }

})();
