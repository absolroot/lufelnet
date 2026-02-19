(function () {
    'use strict';

    function normalizeDependencies(deps) {
        const raw = (deps && typeof deps === 'object') ? deps : {};
        return {
            state: raw.state || {},
            dom: raw.dom || {},
            t: (typeof raw.t === 'function') ? raw.t : ((key, fallback) => fallback || key),
            escapeHtml: (typeof raw.escapeHtml === 'function') ? raw.escapeHtml : ((value) => String(value == null ? '' : value)),
            elementOrder: Array.isArray(raw.elementOrder) ? raw.elementOrder : [],
            positionOrder: Array.isArray(raw.positionOrder) ? raw.positionOrder : [],
            getCharacterLabel: (typeof raw.getCharacterLabel === 'function') ? raw.getCharacterLabel : ((name) => String(name || '')),
            getCharacterImagePath: (typeof raw.getCharacterImagePath === 'function') ? raw.getCharacterImagePath : (() => ''),
            getSlotIconPath: (typeof raw.getSlotIconPath === 'function') ? raw.getSlotIconPath : (() => ''),
            getSubSlotIds: (typeof raw.getSubSlotIds === 'function') ? raw.getSubSlotIds : (() => []),
            hasCharacterModifiedSetting: (typeof raw.hasCharacterModifiedSetting === 'function') ? raw.hasCharacterModifiedSetting : (() => false),
            handleCharacterSelection: (typeof raw.handleCharacterSelection === 'function') ? raw.handleCharacterSelection : (async () => { }),
            setCharacterPanelOpen: (typeof raw.setCharacterPanelOpen === 'function') ? raw.setCharacterPanelOpen : (() => { }),
            loadCharacterNames: (typeof raw.loadCharacterNames === 'function') ? raw.loadCharacterNames : (async () => { })
        };
    }

    function createController(deps) {
        const d = normalizeDependencies(deps);
        let disposeCharacterSpoilerBinding = null;

        function getCharacterMeta(name) {
            return (window.characterData || {})[name] || {};
        }

        function translateGameTerm(value) {
            const text = String(value || '').trim();
            if (!text) return '';
            if (window.I18nService && typeof window.I18nService.translateTerm === 'function') {
                const translated = window.I18nService.translateTerm(text);
                return translated || text;
            }
            return text;
        }

        function getCharacterElementIconPath(element) {
            const key = String(element || '').trim();
            if (!key) return '';
            return `${d.state.baseUrl}/assets/img/character-cards/${encodeURIComponent(`속성_${key}`)}.png`;
        }

        function getCharacterPositionIconPath(position) {
            const key = String(position || '').trim();
            if (!key) return '';
            return `${d.state.baseUrl}/assets/img/character-cards/${encodeURIComponent(`직업_${key}`)}.png`;
        }

        function getCharacterStarIconPath(rarity) {
            const count = Number(rarity || 0);
            if (!count) return '';
            const starType = count === 4 ? 'star4.png' : 'star5.png';
            return `${d.state.baseUrl}/assets/img/character-detail/${starType}`;
        }

        function buildSelectedCharacterNameHtml(characterLabel, meta) {
            const safeName = d.escapeHtml(characterLabel || '');
            const element = String((meta && meta.element) || '').trim();
            const position = String((meta && meta.position) || '').trim();
            const rarity = Number((meta && meta.rarity) || 0);

            const elementIcon = getCharacterElementIconPath(element);
            const positionIcon = getCharacterPositionIconPath(position);
            const starIcon = getCharacterStarIconPath(rarity);
            const translatedElement = translateGameTerm(element);
            const translatedPosition = translateGameTerm(position);
            const safeStarLabel = d.escapeHtml(d.t('common_star', 'Star'));

            const metaItems = [];
            if (positionIcon) {
                metaItems.push(`
                    <img
                        class="rs-character-meta-icon rs-character-meta-position"
                        src="${d.escapeHtml(positionIcon)}"
                        alt="${d.escapeHtml(translatedPosition || position)}"
                        title="${d.escapeHtml(translatedPosition || position)}"
                    >
                `);
            }
            if (elementIcon) {
                metaItems.push(`
                    <img
                        class="rs-character-meta-icon rs-character-meta-element"
                        src="${d.escapeHtml(elementIcon)}"
                        alt="${d.escapeHtml(translatedElement || element)}"
                        title="${d.escapeHtml(translatedElement || element)}"
                    >
                `);
            }
            if (starIcon && rarity > 0) {
                const stars = Array.from({ length: rarity }, () => `
                    <img class="rs-character-meta-star" src="${d.escapeHtml(starIcon)}" alt="${safeStarLabel}">
                `).join('');
                metaItems.push(`<span class="rs-character-meta-stars" title="${d.escapeHtml(`${rarity}${d.t('common_star', 'Star')}`)}">${stars}</span>`);
            }

            return `
                <span class="rs-selected-character-label">${safeName}</span>
                <span class="rs-selected-character-meta">${metaItems.join('')}</span>
            `;
        }

        function getAvailableCharacterFilters() {
            const elements = new Set();
            const positions = new Set();
            d.state.characterList.forEach((name) => {
                const meta = getCharacterMeta(name);
                if (meta.element) elements.add(meta.element);
                if (meta.position) positions.add(meta.position);
            });

            const sortedElements = Array.from(elements).sort((a, b) => {
                const ai = d.elementOrder.indexOf(a);
                const bi = d.elementOrder.indexOf(b);
                if (ai === -1 && bi === -1) return String(a).localeCompare(String(b), 'ko');
                if (ai === -1) return 1;
                if (bi === -1) return -1;
                return ai - bi;
            });

            const sortedPositions = Array.from(positions).sort((a, b) => {
                const ai = d.positionOrder.indexOf(a);
                const bi = d.positionOrder.indexOf(b);
                if (ai === -1 && bi === -1) return String(a).localeCompare(String(b), 'ko');
                if (ai === -1) return 1;
                if (bi === -1) return -1;
                return ai - bi;
            });

            return { elements: sortedElements, positions: sortedPositions };
        }

        function updateCharacterFilterResetState() {
            if (!d.dom.characterFilterReset) return;
            const hasFilter = d.state.characterFilters.query.length > 0
                || d.state.characterFilters.elements.size > 0
                || d.state.characterFilters.positions.size > 0;
            d.dom.characterFilterReset.classList.toggle('active', hasFilter);
        }

        async function handleCharacterSpoilerToggleChanged() {
            await d.loadCharacterNames();
            renderCharacterFilterUI();
            renderCharacterList();
        }

        function renderCharacterFilterUI() {
            const available = getAvailableCharacterFilters();

            if (d.dom.elementFilters) {
                d.dom.elementFilters.innerHTML = available.elements.map((value) => `
                    <label class="rs-filter-chip">
                        <input type="checkbox" data-kind="element" value="${d.escapeHtml(value)}" ${d.state.characterFilters.elements.has(value) ? 'checked' : ''}>
                        <img src="${d.escapeHtml(d.state.baseUrl)}/assets/img/character-cards/${encodeURIComponent(`속성_${value}`)}.png" alt="${d.escapeHtml(value)}">
                    </label>
                `).join('');
            }

            if (d.dom.positionFilters) {
                const showSpoilerToggle = d.state.lang !== 'kr';
                const spoilerToggleHtml = showSpoilerToggle
                    ? `
                        <div class="rs-spoiler-toggle">
                            <label class="rs-spoiler-toggle-label">
                                <input type="checkbox" id="rsCharacterSpoilerToggle" class="rs-spoiler-toggle-checkbox">
                                <span class="rs-spoiler-toggle-text">${d.escapeHtml(d.t('show_spoilers_label', 'Show Spoilers'))}</span>
                            </label>
                        </div>
                    `
                    : '';

                const resetButtonHtml = `
                    <button id="rsCharacterFilterReset" type="button" class="rs-filter-reset" title="${d.escapeHtml(d.t('label_reset_filter', 'Reset filters'))}" aria-label="${d.escapeHtml(d.t('label_reset_filter', 'Reset filters'))}">
                        &#10227;
                    </button>
                `;

                const chipHtml = available.positions.map((value) => `
                    <label class="rs-filter-chip">
                        <input type="checkbox" data-kind="position" value="${d.escapeHtml(value)}" ${d.state.characterFilters.positions.has(value) ? 'checked' : ''}>
                        <img src="${d.escapeHtml(d.state.baseUrl)}/assets/img/character-cards/${encodeURIComponent(`직업_${value}`)}.png" alt="${d.escapeHtml(value)}">
                    </label>
                `).join('');

                d.dom.positionFilters.innerHTML = `${chipHtml}${resetButtonHtml}${spoilerToggleHtml}`;
                d.dom.characterFilterReset = document.getElementById('rsCharacterFilterReset');
            }

            document.querySelectorAll('#rsCharacterPanel input[type="checkbox"][data-kind]').forEach((checkbox) => {
                checkbox.addEventListener('change', () => {
                    const kind = checkbox.getAttribute('data-kind');
                    const val = checkbox.value;
                    const targetSet = kind === 'element'
                        ? d.state.characterFilters.elements
                        : d.state.characterFilters.positions;
                    if (checkbox.checked) targetSet.add(val);
                    else targetSet.delete(val);
                    updateCharacterFilterResetState();
                    renderCharacterList();
                });
            });

            if (d.dom.characterFilterReset) {
                d.dom.characterFilterReset.addEventListener('click', () => {
                    d.state.characterFilters.query = '';
                    d.state.characterFilters.elements.clear();
                    d.state.characterFilters.positions.clear();
                    if (d.dom.characterSearchInput) {
                        d.dom.characterSearchInput.value = '';
                    }
                    updateCharacterFilterResetState();
                    renderCharacterFilterUI();
                    renderCharacterList();
                });
            }

            const spoilerToggle = document.getElementById('rsCharacterSpoilerToggle');
            if (disposeCharacterSpoilerBinding) {
                try { disposeCharacterSpoilerBinding(); } catch (_) { }
                disposeCharacterSpoilerBinding = null;
            }
            if (spoilerToggle) {
                if (window.SpoilerState && typeof window.SpoilerState.bindCheckbox === 'function') {
                    disposeCharacterSpoilerBinding = window.SpoilerState.bindCheckbox({
                        checkbox: spoilerToggle,
                        lang: d.state.lang,
                        source: 'revelation-setting-character-panel',
                        onChange: () => {
                            handleCharacterSpoilerToggleChanged();
                        }
                    });
                } else {
                    let savedState = false;
                    try {
                        savedState = window.localStorage && window.localStorage.getItem('spoilerToggle') === 'true';
                    } catch (_) { }
                    spoilerToggle.checked = savedState;
                    spoilerToggle.onchange = () => {
                        const enabled = !!spoilerToggle.checked;
                        try {
                            if (window.localStorage) {
                                window.localStorage.setItem('spoilerToggle', enabled ? 'true' : 'false');
                            }
                        } catch (_) { }
                        handleCharacterSpoilerToggleChanged();
                    };
                }
            }

            updateCharacterFilterResetState();
        }

        function getFilteredCharacters() {
            const query = String(d.state.characterFilters.query || '').toLowerCase();
            const activeElements = d.state.characterFilters.elements;
            const activePositions = d.state.characterFilters.positions;

            return d.state.characterList.filter((name) => {
                const meta = getCharacterMeta(name);
                if (activeElements.size > 0 && !activeElements.has(meta.element)) return false;
                if (activePositions.size > 0 && !activePositions.has(meta.position)) return false;
                if (!query) return true;

                const searchText = [
                    name,
                    meta.name || '',
                    meta.name_en || '',
                    meta.name_jp || '',
                    meta.codename || ''
                ].join(' ').toLowerCase();
                return searchText.includes(query);
            });
        }

        function renderCharacterList() {
            if (!d.dom.characterList) return;
            const names = getFilteredCharacters();
            d.dom.characterList.innerHTML = '';
            names.forEach((name) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'rs-character-item';
                button.setAttribute('data-character', name);
                if (name === d.state.selectedCharacter) {
                    button.classList.add('active');
                }

                const img = document.createElement('img');
                img.src = d.getCharacterImagePath(name);
                img.alt = d.getCharacterLabel(name);
                img.onerror = function onCharacterItemIconError() {
                    this.hidden = true;
                };

                const label = document.createElement('span');
                label.className = 'rs-character-item-label';
                label.textContent = d.getCharacterLabel(name);

                button.appendChild(img);
                button.appendChild(label);

                if (d.hasCharacterModifiedSetting(name)) {
                    const modifiedDot = document.createElement('span');
                    modifiedDot.className = 'rs-character-modified-dot';
                    modifiedDot.setAttribute('aria-hidden', 'true');
                    button.appendChild(modifiedDot);
                }

                button.addEventListener('click', async () => {
                    await d.handleCharacterSelection(name);
                    d.setCharacterPanelOpen(false);
                });

                d.dom.characterList.appendChild(button);
            });
        }

        function renderCharacterSelector() {
            if (!d.dom.characterList) return;

            if (d.state.selectedCharacter) {
                const characterLabel = d.getCharacterLabel(d.state.selectedCharacter);
                const characterMeta = getCharacterMeta(d.state.selectedCharacter);
                if (d.dom.selectedCharacterName) {
                    d.dom.selectedCharacterName.innerHTML = buildSelectedCharacterNameHtml(characterLabel, characterMeta);
                    d.dom.selectedCharacterName.querySelectorAll('img').forEach((img) => {
                        img.onerror = function onCharacterMetaIconError() {
                            this.hidden = true;
                        };
                    });
                }
                if (d.dom.characterPill) {
                    d.dom.characterPill.setAttribute('aria-label', characterLabel);
                }
                if (d.dom.characterPillIcon) {
                    d.dom.characterPillIcon.src = d.getCharacterImagePath(d.state.selectedCharacter);
                    d.dom.characterPillIcon.hidden = false;
                    d.dom.characterPillIcon.onerror = function onCharacterIconError() {
                        this.hidden = true;
                    };
                }
                if (d.dom.characterPillEmpty) {
                    d.dom.characterPillEmpty.hidden = true;
                }
            } else {
                const fallback = d.t('placeholder_select_character', 'Select character');
                if (d.dom.selectedCharacterName) {
                    d.dom.selectedCharacterName.textContent = fallback;
                }
                if (d.dom.characterPill) {
                    d.dom.characterPill.setAttribute('aria-label', fallback);
                }
                if (d.dom.characterPillIcon) {
                    d.dom.characterPillIcon.removeAttribute('src');
                    d.dom.characterPillIcon.hidden = true;
                }
                if (d.dom.characterPillEmpty) {
                    d.dom.characterPillEmpty.hidden = false;
                }
            }

            if (d.dom.characterSearchInput) {
                d.dom.characterSearchInput.value = d.state.characterFilters.query;
            }

            renderCharacterFilterUI();
            renderCharacterList();
        }

        function renderTopSelectorIcons() {
            if (d.dom.mainRevSlotIcon) {
                d.dom.mainRevSlotIcon.src = d.getSlotIconPath('uni');
                d.dom.mainRevSlotIcon.hidden = false;
                d.dom.mainRevSlotIcon.onerror = function onMainSlotIconError() {
                    this.hidden = true;
                };
            }

            if (d.dom.subRevSlotIcons) {
                d.dom.subRevSlotIcons.innerHTML = '';
                d.getSubSlotIds().forEach((slotId) => {
                    const img = document.createElement('img');
                    img.src = d.getSlotIconPath(slotId);
                    img.alt = d.t(`slot_${slotId}`, slotId.toUpperCase());
                    img.onerror = function onSubSlotIconError() {
                        this.hidden = true;
                    };
                    d.dom.subRevSlotIcons.appendChild(img);
                });
            }
        }

        return {
            updateCharacterFilterResetState,
            renderCharacterFilterUI,
            renderCharacterList,
            renderCharacterSelector,
            renderTopSelectorIcons
        };
    }

    window.RevelationSettingCharacterUI = {
        createController
    };
})();
