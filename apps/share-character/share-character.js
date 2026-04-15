(function () {
    'use strict';

    const STORAGE_KEY = 'share-character:v1:roster';
    const SHARE_PAYLOAD_VERSION = 1;
    const SHARE_QUERY_KEY = 'bin';
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzxSnf6_09q_LDRKIkmBvE2oTtQaLnK22M9ozrHMUAV0JnND9sc6CTILlnBS7_T8FIe/exec';
    const ELEMENT_ORDER = ['물리', '총격', '화염', '빙결', '전격', '질풍', '염동', '핵열', '축복', '주원', '만능'];
    const POSITION_ORDER = ['지배', '반항', '우월', '굴복', '방위', '구원', '해명', '자율'];
    const RARITY_ORDER = [5, 4];

    const state = {
        baseUrl: String(window.BASE_URL || '').replace(/\/+$/, ''),
        lang: 'kr',
        characters: [],
        characterMap: {},
        characterCaps: {},
        allNames: new Set(),
        serverVisibleNames: new Set(),
        roster: {},
        selectedCharacter: '',
        spoilerEnabled: false,
        filters: {
            search: '',
            element: [],
            position: [],
            rarity: [],
            ownership: 'all'
        },
        captureController: null,
        shareController: null,
        presetMenuOpen: false,
        loadToken: 0
    };

    const dom = {};

    function cacheDom() {
        dom.presetWrap = document.getElementById('scPresetWrap');
        dom.presetBtn = document.getElementById('scPresetBtn');
        dom.presetMenu = document.getElementById('scPresetMenu');
        dom.resetBtn = document.getElementById('scResetBtn');
        dom.copyBtn = document.getElementById('scCopyBtn');
        dom.captureBtn = document.getElementById('scCaptureBtn');
        dom.shareBtn = document.getElementById('scShareBtn');
        dom.filterToggleBtn = document.getElementById('scFilterToggleBtn');
        dom.filterResetBtn = document.getElementById('scFilterResetBtn');
        dom.filterContent = document.getElementById('scFilterContent');
        dom.searchInput = document.getElementById('characterSearch');
        dom.searchDropdown = document.getElementById('searchDropdown');
        dom.searchCount = document.querySelector('.search-count');
        dom.spoilerToggle = document.getElementById('spoilerToggle');
        dom.spoilerToggleWrap = document.getElementById('scSpoilerToggleWrap');
        dom.spoilerToggleText = document.getElementById('spoilerToggleText');
        dom.shareCharacterTab = document.getElementById('scShareCharacterTab');
        dom.shareRevelationTab = document.getElementById('scShareRevelationTab');
        dom.shareRevelationTabNote = document.getElementById('scShareRevelationTabNote');
        dom.editorPanel = document.getElementById('scEditorPanel');
        dom.cardGrid = document.getElementById('scCardGrid');
        dom.emptyState = document.getElementById('scEmptyState');
        dom.captureFrame = document.getElementById('scCaptureFrame');
        dom.toastHost = document.getElementById('scToastHost');
    }

    function normalizeLang(rawLang) {
        try {
            if (window.CharacterDataUtils && typeof window.CharacterDataUtils.normalizeLang === 'function') {
                return window.CharacterDataUtils.normalizeLang(rawLang);
            }
        } catch (_) { }
        const lang = String(rawLang || '').trim().toLowerCase();
        if (lang === 'kr' || lang === 'ko') return 'kr';
        if (lang === 'en') return 'en';
        if (lang === 'jp' || lang === 'ja') return 'jp';
        if (lang === 'cn' || lang === 'zh' || lang === 'zh-cn' || lang === 'zh-hans') return 'cn';
        return 'kr';
    }

    function detectCurrentLang() {
        if (window.__SEO_PATH_LANG__) return normalizeLang(window.__SEO_PATH_LANG__);
        try {
            if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
                return normalizeLang(window.I18nService.getCurrentLanguage());
            }
        } catch (_) { }
        try {
            if (window.LanguageRouter && typeof window.LanguageRouter.getCurrentLanguage === 'function') {
                return normalizeLang(window.LanguageRouter.getCurrentLanguage());
            }
        } catch (_) { }
        try {
            return normalizeLang(localStorage.getItem('preferredLanguage'));
        } catch (_) {
            return 'kr';
        }
    }

    function t(key, fallback, vars) {
        let message = fallback || key;
        try {
            if (window.I18nService && typeof window.I18nService.t === 'function') {
                message = window.I18nService.t(key, message);
            }
        } catch (_) { }
        if (!vars || typeof vars !== 'object') return message;
        return message.replace(/\{(\w+)\}/g, (_, token) => {
            return Object.prototype.hasOwnProperty.call(vars, token) ? String(vars[token]) : `{${token}}`;
        });
    }

    function translateTerm(value) {
        if (!value) return '';
        try {
            if (window.I18nService && typeof window.I18nService.translateTerm === 'function') {
                return window.I18nService.translateTerm(value);
            }
        } catch (_) { }
        return value;
    }

    function translateTermSafe(value) {
        return translateTerm(value) || value || '';
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function showToast(message, type) {
        if (!dom.toastHost || !message) return;
        const toast = document.createElement('div');
        toast.className = `sc-toast ${type === 'error' ? 'is-error' : 'is-success'}`;
        toast.textContent = message;
        dom.toastHost.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('is-visible'));
        window.setTimeout(() => {
            toast.classList.remove('is-visible');
            window.setTimeout(() => toast.remove(), 220);
        }, 2600);
    }

    function buildImagePath(folder, fileName) {
        return `${state.baseUrl}/assets/img/${folder}/${encodeURIComponent(fileName)}`;
    }

    function getCardImageSrc(characterKey) {
        return buildImagePath('character-cards', `${characterKey}.webp`);
    }

    function getCardFallbackSrc() {
        return `${state.baseUrl}/assets/img/character-cards/card_skeleton.webp`;
    }

    function getElementIconSrc(element) {
        return buildImagePath('character-cards', `속성_${element}.png`);
    }

    function getPositionIconSrc(position) {
        return buildImagePath('character-cards', `직업_${position}.png`);
    }

    function getAwarenessIconSrc(level) {
        return `${state.baseUrl}/assets/img/ritual/a${level}.png`;
    }

    function getWeaponRefinementIconSrc(level) {
        return `${state.baseUrl}/assets/img/character-weapon/r${level}.png`;
    }

    function applyFilterTranslations() {
        if (dom.searchInput) {
            dom.searchInput.placeholder = t('filter_search_placeholder', 'Search characters...');
        }
        if (dom.spoilerToggleText) {
            dom.spoilerToggleText.textContent = t('filter_show_spoilers', 'Show Spoilers');
        }
        if (dom.filterToggleBtn) {
            const toggleLabel = t('filter_toggle', 'Filter');
            dom.filterToggleBtn.setAttribute('aria-label', toggleLabel);
            dom.filterToggleBtn.setAttribute('title', toggleLabel);
        }
        if (dom.filterResetBtn) {
            const resetLabel = t('action_reset', 'Reset');
            dom.filterResetBtn.setAttribute('aria-label', resetLabel);
            dom.filterResetBtn.setAttribute('title', resetLabel);
            const resetImg = dom.filterResetBtn.querySelector('img');
            if (resetImg) resetImg.alt = resetLabel;
        }

        document.querySelectorAll('.filter-options input[name="element"]').forEach((input) => {
            const img = input.parentElement ? input.parentElement.querySelector('img') : null;
            if (!img) return;
            const translated = translateTermSafe(input.value);
            img.alt = translated;
            img.title = translated;
        });

        document.querySelectorAll('.filter-options input[name="position"]').forEach((input) => {
            const img = input.parentElement ? input.parentElement.querySelector('img') : null;
            if (!img) return;
            const translated = translateTermSafe(input.value);
            img.alt = translated;
            img.title = translated;
        });
    }

    function applyActionTranslations() {
        const actions = [
            { button: dom.presetBtn, key: 'action_presets', fallback: 'Presets' },
            { button: dom.resetBtn, key: 'action_reset', fallback: 'Reset' },
            { button: dom.copyBtn, key: 'action_copy_image', fallback: 'Copy Image' },
            { button: dom.captureBtn, key: 'action_capture_image', fallback: 'Capture Image' },
            { button: dom.shareBtn, key: 'action_share_url', fallback: 'Share URL' }
        ];

        actions.forEach(({ button, key, fallback }) => {
            if (!button) return;
            const label = t(key, fallback);
            button.setAttribute('aria-label', label);
            button.setAttribute('data-tooltip', label);
            button.setAttribute('title', label);
        });
    }

    function applyNavigationTabs() {
        const shareHub = window.ShareHub;
        const characterPath = shareHub && typeof shareHub.buildShareUrl === 'function'
            ? shareHub.buildShareUrl(state.lang, 'character')
            : `/${state.lang}/share/character/`;
        const revelationPath = shareHub && typeof shareHub.buildShareUrl === 'function'
            ? shareHub.buildShareUrl(state.lang, 'revelation')
            : `/${state.lang}/share/revelation/`;
        const revelationAvailable = !(shareHub && typeof shareHub.isShareTabAvailable === 'function')
            || shareHub.isShareTabAvailable(state.lang, 'revelation');

        if (dom.shareCharacterTab) {
            dom.shareCharacterTab.href = `${state.baseUrl}${characterPath}`;
        }
        if (dom.shareRevelationTab) {
            dom.shareRevelationTab.href = revelationAvailable ? `${state.baseUrl}${revelationPath}` : '#';
            dom.shareRevelationTab.classList.toggle('is-disabled', !revelationAvailable);
            dom.shareRevelationTab.setAttribute('aria-disabled', revelationAvailable ? 'false' : 'true');
            dom.shareRevelationTab.onclick = revelationAvailable
                ? () => {
                    if (shareHub && typeof shareHub.setLastShareTab === 'function') {
                        shareHub.setLastShareTab('revelation');
                    }
                }
                : (event) => event.preventDefault();
        }
        if (dom.shareCharacterTab) {
            dom.shareCharacterTab.onclick = () => {
                if (shareHub && typeof shareHub.setLastShareTab === 'function') {
                    shareHub.setLastShareTab('character');
                }
            };
        }
        if (dom.shareRevelationTabNote) {
            dom.shareRevelationTabNote.textContent = t('share_tab_unavailable', 'Soon');
            dom.shareRevelationTabNote.hidden = revelationAvailable;
        }
    }

    function consumeShareNotice() {
        const shareHub = window.ShareHub;
        if (!shareHub) return;
        const params = new URLSearchParams(window.location.search || '');
        if (params.get(shareHub.NOTICE_PARAM) !== shareHub.NOTICE_REVELATION_UNAVAILABLE) return;
        params.delete(shareHub.NOTICE_PARAM);
        const nextQuery = params.toString();
        history.replaceState(null, '', window.location.pathname + (nextQuery ? `?${nextQuery}` : ''));
        showToast(t('msg_share_revelation_unavailable', 'Revelation Share is not available in this language.'), 'error');
    }

    function parseBoundedInteger(value, min, max) {
        const parsed = Number.parseInt(String(value ?? '').trim(), 10);
        if (!Number.isFinite(parsed)) return null;
        if (parsed < min || parsed > max) return null;
        return parsed;
    }

    function normalizeRosterEntry(value, levelCap) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
        const awareness = parseBoundedInteger(value.a, 0, 6);
        if (awareness == null) return null;
        const resolvedCap = Number.isFinite(levelCap) ? levelCap : ((Number(value.lv) || 0) > 80 ? 100 : 80);
        const level = parseBoundedInteger(value.lv, 1, resolvedCap) ?? resolvedCap;
        const weapon = parseBoundedInteger(value.w, 0, 6);
        const entry = { a: awareness, lv: level };
        if (weapon != null) entry.w = weapon;
        return entry;
    }

    function normalizeRosterEntries(rawEntries, characterCaps) {
        const out = {};
        if (!rawEntries || typeof rawEntries !== 'object' || Array.isArray(rawEntries)) return out;
        Object.keys(rawEntries).forEach((key) => {
            const name = String(key || '').trim();
            if (!name) return;
            if (characterCaps && !Object.prototype.hasOwnProperty.call(characterCaps, name)) return;
            const entry = normalizeRosterEntry(rawEntries[key], characterCaps ? characterCaps[name] : undefined);
            if (entry) out[name] = entry;
        });
        return out;
    }

    function loadRoster() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return {};
            return normalizeRosterEntries(JSON.parse(raw));
        } catch (_) {
            return {};
        }
    }

    function persistRoster() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.roster));
        } catch (_) { }
    }

    function isGlobalLanguage(lang) {
        return lang === 'en' || lang === 'jp';
    }

    function buildCharacterMeta(characterKey, meta) {
        if (!characterKey || !meta || typeof meta !== 'object') return null;
        return {
            key: characterKey,
            name: String(meta.name || characterKey),
            codename: String(meta.codename || ''),
            rarity: Number(meta.rarity || 0),
            rawElement: String(meta.element || ''),
            rawPosition: String(meta.position || ''),
            element: String(meta.element_display || translateTerm(meta.element) || meta.element || ''),
            position: String(meta.position_display || translateTerm(meta.position) || meta.position || ''),
            persona3: !!meta.persona3,
            persona4: !!meta.persona4,
            persona5: !!meta.persona5,
            hasInnate: !!meta.has_innate,
            levelCap: meta.has_innate ? 100 : 80
        };
    }

    async function refreshCharacterData() {
        const loadToken = ++state.loadToken;
        const prepared = await window.CharacterDataUtils.prepareCharacterData({
            lang: state.lang,
            spoilerEnabled: state.spoilerEnabled
        });
        if (loadToken !== state.loadToken || !prepared) return;

        const renderNames = [
            ...(prepared.characterList?.mainParty || []),
            ...(prepared.characterList?.supportParty || [])
        ].filter((name) => name && name !== '원더');
        const serverNames = (prepared.originalLangCharacterList || []).filter((name) => name && name !== '원더');
        const allCaps = {};
        Object.keys(prepared.characterData || {}).forEach((key) => {
            if (!key || key === '원더') return;
            allCaps[key] = prepared.characterData[key] && prepared.characterData[key].has_innate ? 100 : 80;
        });
        const characters = renderNames
            .map((key) => buildCharacterMeta(key, prepared.characterData?.[key]))
            .filter(Boolean)
            .sort((left, right) => {
                const leftMeta = prepared.characterData?.[left.key] || {};
                const rightMeta = prepared.characterData?.[right.key] || {};
                const releaseDiff = Number(rightMeta.release_order || 0) - Number(leftMeta.release_order || 0);
                if (releaseDiff !== 0) return releaseDiff;
                const rarityDiff = Number(right.rarity || 0) - Number(left.rarity || 0);
                if (rarityDiff !== 0) return rarityDiff;
                return String(left.name || left.key).localeCompare(String(right.name || right.key));
            })
            .map((character) => {
                character.isUnreleased = isGlobalLanguage(state.lang) && serverNames.indexOf(character.key) === -1;
                return character;
            });

        state.characters = characters;
        state.characterMap = Object.fromEntries(characters.map((character) => [character.key, character]));
        state.characterCaps = allCaps;
        state.serverVisibleNames = new Set(serverNames);
        state.allNames = new Set([
            ...(prepared.krCharacterList?.mainParty || []),
            ...(prepared.krCharacterList?.supportParty || [])
        ].filter((name) => name && name !== '원더'));
        state.roster = normalizeRosterEntries(state.roster, allCaps);
        persistRoster();
        if (state.selectedCharacter && !state.characterMap[state.selectedCharacter]) {
            state.selectedCharacter = '';
        }
        renderAll();
    }

    function getRosterEntry(characterKey) {
        const character = state.characterMap[characterKey];
        if (!character) return null;
        return normalizeRosterEntry(state.roster[characterKey], character.levelCap);
    }

    function createDefaultEntry(characterKey) {
        const character = state.characterMap[characterKey];
        if (!character) return null;
        return { a: 0, lv: character.levelCap };
    }

    function setPresetMenuOpen(isOpen) {
        state.presetMenuOpen = !!isOpen;
        if (dom.presetWrap) {
            dom.presetWrap.classList.toggle('is-open', state.presetMenuOpen);
        }
        if (dom.presetBtn) {
            dom.presetBtn.setAttribute('aria-expanded', state.presetMenuOpen ? 'true' : 'false');
        }
        if (dom.presetMenu) {
            dom.presetMenu.hidden = !state.presetMenuOpen;
        }
    }

    function closePresetMenu() {
        setPresetMenuOpen(false);
    }

    function buildPresetRoster(presetId) {
        const nextRoster = presetId === 'rarity5-a6-r6'
            ? normalizeRosterEntries(state.roster, state.characterCaps)
            : {};
        const shouldIncludeCharacter = (character) => {
            if (!character) return false;
            if (presetId === 'rarity5-a6-r6') return Number(character.rarity) === 5;
            return true;
        };

        const awareness = (presetId === 'all-a6-r6' || presetId === 'rarity5-a6-r6') ? 6 : 0;
        const weaponLevel = presetId === 'all-a0'
            ? undefined
            : ((presetId === 'all-a0-r0') ? 0 : 6);

        state.characters.forEach((character) => {
            if (!shouldIncludeCharacter(character)) return;
            const entry = {
                a: awareness,
                lv: character.levelCap
            };
            if (weaponLevel != null) {
                entry.w = weaponLevel;
            }
            nextRoster[character.key] = entry;
        });

        return nextRoster;
    }

    function applyPreset(presetId, label) {
        if (!state.characters.length) return;
        const confirmMessage = t(
            'msg_preset_confirm',
            'Apply this preset? Current roster data will be overwritten.\n\n{label}',
            { label }
        );
        if (!window.confirm(confirmMessage)) return;

        state.roster = buildPresetRoster(presetId);
        state.selectedCharacter = '';
        persistRoster();
        closePresetMenu();
        renderAll();
        showToast(t('msg_preset_applied', 'Preset applied.'), 'success');
    }

    function setAwarenessLevel(characterKey, awareness) {
        const previousOwned = !!getRosterEntry(characterKey);
        if (awareness == null) {
            delete state.roster[characterKey];
        } else {
            const current = getRosterEntry(characterKey) || createDefaultEntry(characterKey);
            if (!current) return;
            current.a = awareness;
            state.roster[characterKey] = current;
        }
        persistRoster();
        const nextOwned = !!getRosterEntry(characterKey);
        const shouldRerenderGrid = previousOwned !== nextOwned && state.filters.ownership !== 'all';
        refreshCharacterViews(characterKey, { rerenderGrid: shouldRerenderGrid });
    }

    function setWeaponLevel(characterKey, weaponLevel) {
        const current = getRosterEntry(characterKey);
        if (!current) return;
        if (weaponLevel == null) {
            delete current.w;
        } else {
            current.w = weaponLevel;
        }
        state.roster[characterKey] = current;
        persistRoster();
        refreshCharacterViews(characterKey);
    }

    function setCharacterLevel(characterKey, level) {
        const current = getRosterEntry(characterKey);
        const character = state.characterMap[characterKey];
        if (!current || !character) return;
        current.lv = parseBoundedInteger(level, 1, character.levelCap) ?? character.levelCap;
        state.roster[characterKey] = current;
        persistRoster();
        refreshCharacterViews(characterKey);
    }

    function getFilteredCharacters() {
        const query = (state.filters.search || '').trim().toLowerCase();
        return state.characters.filter((character) => {
            const entry = getRosterEntry(character.key);
            const owned = !!entry;
            if (state.filters.ownership === 'owned' && !owned) return false;
            if (state.filters.ownership === 'unowned' && owned) return false;
            if (state.filters.element && state.filters.element.length > 0 && !state.filters.element.includes(character.rawElement)) return false;
            if (state.filters.position && state.filters.position.length > 0 && !state.filters.position.includes(character.rawPosition)) return false;
            if (state.filters.rarity && state.filters.rarity.length > 0 && !state.filters.rarity.includes(String(character.rarity))) return false;
            if (!query) return true;
            const haystack = [character.name, character.key, character.codename].join(' ').toLowerCase();
            return haystack.includes(query);
        });
    }

    function renderEnhancementIcons(entry) {
        if (!entry) return '';
        const icons = [`<img src="${escapeHtml(getAwarenessIconSrc(entry.a))}" alt="A${entry.a}" class="sc-enhancement-icon sc-awareness-icon" loading="lazy">`];
        if (entry.w != null) {
            icons.push(`<img src="${escapeHtml(getWeaponRefinementIconSrc(entry.w))}" alt="R${entry.w}" class="sc-enhancement-icon sc-weapon-icon" loading="lazy">`);
        }
        return icons.join('');
    }

    function renderCardStatus(entry) {
        if (!entry) return '';
        return `
            <div class="sc-card-status">
                <div class="sc-enhancement-icons">${renderEnhancementIcons(entry)}</div>
                <span class="sc-level-chip">
                    <span class="sc-level-chip-label">LV</span>
                    <span class="sc-level-chip-value">${escapeHtml(entry.lv)}</span>
                </span>
            </div>
        `;
    }

    function getCardDisplayName(character) {
        if (!character) return '';
        if (state.lang === 'en' && character.codename) {
            return character.codename;
        }
        return character.name;
    }

    function buildSearchQueries(value) {
        const base = String(value || '').normalize('NFKC').toLowerCase().trim();
        if (!base) return [];
        const queries = [base];
        if (base.includes('oracle')) {
            queries.push(base.replace(/oracle/g, 'navi'));
        }
        return Array.from(new Set(queries));
    }

    function hideSearchDropdown() {
        if (!dom.searchDropdown) return;
        dom.searchDropdown.style.display = 'none';
        dom.searchDropdown.innerHTML = '';
    }

    function renderSearchDropdown(searchValue) {
        if (!dom.searchDropdown) return;
        const queries = buildSearchQueries(searchValue);
        dom.searchDropdown.innerHTML = '';

        if (!queries.length) {
            hideSearchDropdown();
            return;
        }

        const matches = state.characters.filter((character) => {
            const indexed = [
                character.name,
                character.key,
                character.codename,
                getCardDisplayName(character)
            ].join(' ').toLowerCase();
            return queries.some((query) => indexed.includes(query));
        });

        if (!matches.length) {
            hideSearchDropdown();
            return;
        }

        dom.searchDropdown.style.display = 'block';
        matches.slice(0, 25).forEach((character) => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = getCardDisplayName(character);
            item.addEventListener('mousedown', (event) => event.preventDefault());
            item.addEventListener('click', () => {
                if (dom.searchInput) dom.searchInput.value = getCardDisplayName(character);
                state.filters.search = getCardDisplayName(character);
                renderGrid();
                hideSearchDropdown();
            });
            dom.searchDropdown.appendChild(item);
        });
    }

    function updateSearchCount(visibleCount) {
        if (!dom.searchCount) return;
        dom.searchCount.textContent = `${visibleCount} / ${state.characters.length}`;
    }

    function getSummaryMarkup() {
        const total = state.characters.length;
        const ownedCount = state.characters.reduce((count, character) => count + (getRosterEntry(character.key) ? 1 : 0), 0);
        const weaponCount = state.characters.reduce((count, character) => {
            const entry = getRosterEntry(character.key);
            return count + (entry && entry.w != null ? 1 : 0);
        }, 0);
        const awarenessSixCount = state.characters.reduce((count, character) => {
            const entry = getRosterEntry(character.key);
            return count + (entry && entry.a === 6 ? 1 : 0);
        }, 0);

        return [
            `<span class="sc-summary-chip">${escapeHtml(t('label_owned_summary', 'Owned {owned} / Total {total}', { owned: ownedCount, total }))}</span>`,
            `<span class="sc-summary-chip">${escapeHtml(t('label_weapon_summary', 'Exclusive Weapon {count}', { count: weaponCount }))}</span>`,
            `<span class="sc-summary-chip">${escapeHtml(t('label_a6_summary', 'A6 {count}', { count: awarenessSixCount }))}</span>`
        ].join('');
    }

    function renderCardMarkup(character, options) {
        const opts = options || {};
        const entry = getRosterEntry(character.key);
        const owned = !!entry;
        const selected = !!opts.selected;
        const classes = ['card', 'sc-share-card', owned ? 'is-owned' : 'is-unowned', selected ? 'is-selected' : '', opts.capture ? 'is-capture' : ''].filter(Boolean).join(' ');
        const displayName = getCardDisplayName(character);
        const imageLoading = opts.capture ? 'eager' : 'lazy';
        return `
            <button type="button" class="${classes}" data-character-key="${escapeHtml(character.key)}" aria-pressed="${selected ? 'true' : 'false'}">
                <div class="position-container">
                    <img src="${escapeHtml(getPositionIconSrc(character.rawPosition))}" alt="${escapeHtml(character.position)}" class="position-icon" loading="${imageLoading}">
                </div>
                <img src="${escapeHtml(getCardImageSrc(character.key))}" alt="${escapeHtml(character.name)}" class="character-img loaded" loading="${imageLoading}" onerror="this.onerror=null;this.src='${escapeHtml(getCardFallbackSrc())}'">
                <img src="${escapeHtml(getElementIconSrc(character.rawElement))}" alt="${escapeHtml(character.element)}" class="element-icon" loading="${imageLoading}">
                ${renderCardStatus(entry)}
                <span class="name-text"
                    data-persona3="${character.persona3 ? 'true' : 'false'}"
                    data-persona4="${character.persona4 ? 'true' : 'false'}"
                    data-persona5="${character.persona5 ? 'true' : 'false'}">${escapeHtml(displayName)}</span>
            </button>
        `;
    }

    function bindGridCardEvents() {
        dom.cardGrid.querySelectorAll('[data-character-key]').forEach((button) => {
            button.addEventListener('click', () => {
                state.selectedCharacter = String(button.getAttribute('data-character-key') || '');
                renderSelectionState();
            });
        });
    }

    function findCharacterCard(root, characterKey) {
        if (!root || !characterKey) return null;
        return Array.from(root.querySelectorAll('[data-character-key]')).find((node) => {
            return String(node.getAttribute('data-character-key') || '') === characterKey;
        }) || null;
    }

    function patchCharacterCard(root, characterKey, options) {
        const current = findCharacterCard(root, characterKey);
        const entry = getRosterEntry(characterKey);
        const isSelected = !!(options && options.selected);
        if (!current) return null;

        current.classList.toggle('is-owned', !!entry);
        current.classList.toggle('is-unowned', !entry);
        current.classList.toggle('is-selected', isSelected);
        current.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

        const existingStatus = current.querySelector('.sc-card-status');
        if (entry) {
            const template = document.createElement('template');
            template.innerHTML = renderCardStatus(entry).trim();
            const nextStatus = template.content.firstElementChild;
            if (nextStatus) {
                if (existingStatus) {
                    existingStatus.replaceWith(nextStatus);
                } else {
                    const nameText = current.querySelector('.name-text');
                    if (nameText) {
                        nameText.insertAdjacentElement('beforebegin', nextStatus);
                    } else {
                        current.appendChild(nextStatus);
                    }
                }
            }
        } else if (existingStatus) {
            existingStatus.remove();
        }

        return current;
    }

    function syncSelectedCardState() {
        if (!dom.cardGrid) return;
        dom.cardGrid.querySelectorAll('[data-character-key]').forEach((button) => {
            const isSelected = String(button.getAttribute('data-character-key') || '') === state.selectedCharacter;
            button.classList.toggle('is-selected', isSelected);
            button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });
    }

    function renderEditorPanel() {
        const character = state.characterMap[state.selectedCharacter];
        const modalContainer = document.getElementById('scModalContainer');
        if (!modalContainer) return;
        if (!character) {
            modalContainer.innerHTML = '';
            // Remove scroll lock from body if closed
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            return;
        }
        // Lock scroll on body when modal is open
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '8px'; // Prevent scrollbar jump

        const entry = getRosterEntry(character.key);
        const owned = !!entry;
        const levelValue = owned ? entry.lv : character.levelCap;
        const awarenessButtons = [{ value: 'unowned', label: t('option_unowned', 'Unowned') }]
            .concat(Array.from({ length: 7 }, (_, index) => ({ value: String(index), label: `A${index}` })));
        const weaponButtons = [{ value: 'unowned', label: t('option_unowned', 'Unowned') }]
            .concat(Array.from({ length: 7 }, (_, index) => ({ value: String(index), label: `R${index}` })));

        modalContainer.innerHTML = `
            <div class="sc-modal-overlay is-open" id="scModalOverlay">
                <section class="sc-editor-panel" role="dialog" aria-modal="true" aria-labelledby="scModalTitle">
                    <button type="button" class="sc-modal-close" id="scModalClose" aria-label="${escapeHtml(t('action_close', 'Close'))}">×</button>
                    <div class="sc-editor-shell">
                        <div class="sc-editor-identity">
                            <div class="sc-editor-portrait">
                                <img src="${escapeHtml(getCardImageSrc(character.key))}" alt="${escapeHtml(character.name)}" loading="lazy" onerror="this.onerror=null;this.src='${escapeHtml(getCardFallbackSrc())}'">
                            </div>
                            <div class="sc-editor-copy">
                                <p class="sc-editor-kicker">${escapeHtml(t('label_selected_character', 'Selected Character'))}</p>
                                <h2 id="scModalTitle">${escapeHtml(character.name)}</h2>
                                <div class="sc-editor-meta">
                                    <span>${escapeHtml(t('label_codename', 'Codename'))}: ${escapeHtml(character.codename || '-')}</span>
                                    <span>${escapeHtml(t('label_rarity', 'Rarity'))}: ${escapeHtml(`${character.rarity}★`)}</span>
                                    <span>${escapeHtml(t('label_level_cap', 'Level Cap'))}: Lv${escapeHtml(character.levelCap)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="sc-editor-controls">
                    <section class="sc-editor-block">
                        <div class="sc-editor-block-head">
                            <span>${escapeHtml(t('label_status', 'Ownership'))}</span>
                        </div>
                        <div class="sc-segmented-group sc-icon-group">
                            ${awarenessButtons.map((option) => {
                                const activeValue = owned ? String(entry.a) : 'unowned';
                                const content = option.value !== 'unowned' 
                                    ? `<img src="${escapeHtml(getAwarenessIconSrc(option.value))}" alt="A${option.value}" class="sc-choice-icon sc-choice-awareness">` 
                                    : `<span class="sc-unowned-text">${escapeHtml(option.label)}</span>`;
                                return `<button type="button" class="sc-segmented-btn sc-icon-btn${option.value === activeValue ? ' is-active' : ''}" data-awareness-value="${escapeHtml(option.value)}">${content}</button>`;
                            }).join('')}
                        </div>
                    </section>
                    <section class="sc-editor-block">
                        <div class="sc-editor-block-head">
                            <span>${escapeHtml(t('label_level', 'Current Level'))}</span>
                            <span class="sc-editor-cap">Lv${escapeHtml(character.levelCap)}</span>
                        </div>
                        <div class="sc-level-control">
                            <button type="button" class="sc-step-btn" data-level-step="-1" ${owned ? '' : 'disabled'}>-</button>
                            <input id="scLevelInput" type="number" min="1" max="${escapeHtml(character.levelCap)}" value="${escapeHtml(levelValue)}" class="sc-level-input" ${owned ? '' : 'disabled'}>
                            <button type="button" class="sc-step-btn" data-level-step="1" ${owned ? '' : 'disabled'}>+</button>
                        </div>
                    </section>
                    <section class="sc-editor-block">
                        <div class="sc-editor-block-head">
                            <span>${escapeHtml(t('label_signature_weapon', 'Exclusive Weapon'))}</span>
                        </div>
                        <div class="sc-editor-weapon-row">
                            <div class="sc-segmented-group is-compact sc-icon-group">
                                ${weaponButtons.map((option) => {
                                    const activeValue = owned && entry.w != null ? String(entry.w) : 'unowned';
                                    const content = option.value !== 'unowned' 
                                        ? `<img src="${escapeHtml(getWeaponRefinementIconSrc(option.value))}" alt="R${option.value}" class="sc-choice-icon sc-choice-weapon">` 
                                        : `<span class="sc-unowned-text">${escapeHtml(option.label)}</span>`;
                                    return `<button type="button" class="sc-segmented-btn sc-icon-btn${option.value === activeValue ? ' is-active' : ''}" data-weapon-value="${escapeHtml(option.value)}" ${owned ? '' : 'disabled'}>${content}</button>`;
                                }).join('')}
                            </div>
                        </div>
                    </section>
                        </div>
                    </div>
                </section>
            </div>
        `;

        const overlay = document.getElementById('scModalOverlay');
        const closeBtn = document.getElementById('scModalClose');
        const closeModal = () => {
            state.selectedCharacter = '';
            renderSelectionState();
        };
        if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        modalContainer.querySelectorAll('[data-awareness-value]').forEach((button) => {
            button.addEventListener('click', () => {
                const rawValue = String(button.getAttribute('data-awareness-value') || '');
                if (rawValue === 'unowned') {
                    setAwarenessLevel(character.key, null);
                    return;
                }
                const awareness = parseBoundedInteger(rawValue, 0, 6);
                if (awareness != null) setAwarenessLevel(character.key, awareness);
            });
        });

        modalContainer.querySelectorAll('[data-weapon-value]').forEach((button) => {
            button.addEventListener('click', () => {
                const rawValue = String(button.getAttribute('data-weapon-value') || '');
                if (rawValue === 'unowned') {
                    setWeaponLevel(character.key, null);
                    return;
                }
                const weaponValue = parseBoundedInteger(rawValue, 0, 6);
                if (weaponValue != null) setWeaponLevel(character.key, weaponValue);
            });
        });

        modalContainer.querySelectorAll('[data-level-step]').forEach((button) => {
            button.addEventListener('click', () => {
                const current = getRosterEntry(character.key);
                if (!current) return;
                const step = Number.parseInt(String(button.getAttribute('data-level-step') || '0'), 10);
                setCharacterLevel(character.key, current.lv + step);
            });
        });

        const levelInput = document.getElementById('scLevelInput');
        if (levelInput) {
            const commit = () => setCharacterLevel(character.key, levelInput.value);
            levelInput.addEventListener('change', commit);
            levelInput.addEventListener('blur', commit);
        }
    }

    function renderGrid() {
        const filteredCharacters = getFilteredCharacters();
        dom.cardGrid.innerHTML = filteredCharacters.map((character) => renderCardMarkup(character, {
            selected: character.key === state.selectedCharacter
        })).join('');
        bindGridCardEvents();
        updateSearchCount(filteredCharacters.length);
        const empty = filteredCharacters.length === 0;
        dom.cardGrid.hidden = empty;
        dom.emptyState.hidden = !empty;
    }

    function renderCaptureFrame() {
        const filteredCharacters = getFilteredCharacters();
        dom.captureFrame.innerHTML = `
            <div class="sc-capture-shell">
                <div class="sc-capture-grid">
                    ${filteredCharacters.map((character) => renderCardMarkup(character, { capture: true })).join('')}
                </div>
            </div>
        `;
    }

    function renderAll() {
        renderGrid();
        renderEditorPanel();
        renderCaptureFrame();
    }

    function renderSelectionState() {
        syncSelectedCardState();
        renderEditorPanel();
    }

    function refreshCharacterViews(characterKey, options) {
        const opts = options || {};
        if (opts.rerenderGrid) {
            renderGrid();
        } else {
            patchCharacterCard(dom.cardGrid, characterKey, {
                selected: characterKey === state.selectedCharacter
            });
            syncSelectedCardState();
        }

        renderEditorPanel();

        const captureGrid = dom.captureFrame ? dom.captureFrame.querySelector('.sc-capture-grid') : null;
        if (captureGrid) {
            patchCharacterCard(captureGrid, characterKey, { capture: true });
        } else {
            renderCaptureFrame();
        }
    }

    function syncSpoilerControl() {
        const showControl = !!(window.SpoilerState && typeof window.SpoilerState.shouldShowControl === 'function'
            ? window.SpoilerState.shouldShowControl(state.lang)
            : !(state.lang === 'kr' || state.lang === 'cn'));
        if (dom.spoilerToggleWrap) {
            dom.spoilerToggleWrap.style.display = showControl ? 'flex' : 'none';
        }
        if (dom.spoilerToggle) {
            dom.spoilerToggle.checked = showControl ? !!state.spoilerEnabled : false;
        }
        if (dom.spoilerToggleText) {
            dom.spoilerToggleText.textContent = t('filter_show_spoilers', 'Show Spoilers');
        }
    }

    function bindFilters() {
        if (dom.filterContent) {
            dom.filterContent.style.display = 'block';
        }
        if (dom.filterToggleBtn) {
            dom.filterToggleBtn.style.display = 'none';
        }
        if (dom.filterResetBtn) {
            dom.filterResetBtn.style.display = 'none';
            dom.filterResetBtn.addEventListener('click', () => {
                document.querySelectorAll('.filter-options input[type="checkbox"]').forEach((input) => {
                    input.checked = false;
                });
                const ownershipAll = document.querySelector('input[name="ownership"][value="all"]');
                if (ownershipAll) ownershipAll.checked = true;
                if (dom.searchInput) dom.searchInput.value = '';
                state.filters = {
                    search: '',
                    element: [],
                    position: [],
                    rarity: [],
                    ownership: 'all'
                };
                hideSearchDropdown();
                renderGrid();
            });
        }

        if (dom.searchInput) {
            dom.searchInput.addEventListener('input', (event) => {
                const value = String(event.target.value || '');
                state.filters.search = value;
                renderSearchDropdown(value);
                renderGrid();
            });
            dom.searchInput.addEventListener('blur', () => {
                window.setTimeout(() => hideSearchDropdown(), 200);
            });
        }

        const filterInputs = document.querySelectorAll('.filter-options input[type="checkbox"], .filter-options input[type="radio"]');
        filterInputs.forEach((input) => {
            input.addEventListener('change', () => {
                state.filters.element = Array.from(document.querySelectorAll('input[name="element"]:checked')).map((node) => node.value);
                state.filters.position = Array.from(document.querySelectorAll('input[name="position"]:checked')).map((node) => node.value);
                state.filters.rarity = Array.from(document.querySelectorAll('input[name="rarity"]:checked')).map((node) => node.value);

                const ownership = document.querySelector('input[name="ownership"]:checked');
                state.filters.ownership = ownership ? ownership.value : 'all';
                renderGrid();
            });
        });
    }

    function bindSpoilerToggle() {
        if (!dom.spoilerToggle || !dom.spoilerToggleText) return;

        dom.spoilerToggleText.textContent = t('filter_show_spoilers', 'Show Spoilers');

        if (window.SpoilerState && typeof window.SpoilerState.bindCheckbox === 'function') {
            window.SpoilerState.bindCheckbox({
                checkbox: dom.spoilerToggle,
                container: dom.spoilerToggleWrap,
                displayStyle: 'flex',
                lang: state.lang,
                source: 'share-character',
                onChange: async () => {
                    state.spoilerEnabled = !!(window.SpoilerState && typeof window.SpoilerState.get === 'function' && window.SpoilerState.get());
                    await refreshCharacterData();
                }
            });
            return;
        }

        const savedState = localStorage.getItem('spoilerToggle') === 'true';
        dom.spoilerToggle.checked = savedState;

        dom.spoilerToggle.addEventListener('change', async function () {
            state.spoilerEnabled = !!this.checked;
            localStorage.setItem('spoilerToggle', state.spoilerEnabled.toString());
            await refreshCharacterData();
        });

        syncSpoilerControl();
    }

    function bindSpoilerSubscription() {
        if (!window.SpoilerState || typeof window.SpoilerState.subscribe !== 'function') return;
        window.SpoilerState.subscribe(async (detail) => {
            if (!detail || detail.enabled === state.spoilerEnabled) return;
            state.spoilerEnabled = !!detail.enabled;
            syncSpoilerControl();
            await refreshCharacterData();
        });
    }

    function bindActions() {
        if (dom.presetBtn && dom.presetMenu) {
            dom.presetBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                setPresetMenuOpen(!state.presetMenuOpen);
            });

            dom.presetMenu.querySelectorAll('[data-preset-id]').forEach((button) => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const presetId = String(button.getAttribute('data-preset-id') || '').trim();
                    if (!presetId) return;
                    const label = String(button.textContent || '').trim() || presetId;
                    applyPreset(presetId, label);
                });
            });

            document.addEventListener('click', (event) => {
                if (!dom.presetWrap || !state.presetMenuOpen) return;
                if (dom.presetWrap.contains(event.target)) return;
                closePresetMenu();
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && state.presetMenuOpen) {
                    closePresetMenu();
                }
            });
        }

        dom.resetBtn.addEventListener('click', () => {
            if (!window.confirm(t('msg_reset_confirm', 'Reset all roster data?'))) return;
            state.roster = {};
            state.selectedCharacter = '';
            closePresetMenu();
            persistRoster();
            renderAll();
            showToast(t('msg_reset_success', 'Roster data has been reset.'), 'success');
        });
    }

    function getSharePayload() {
        return {
            kind: 'share-character',
            version: SHARE_PAYLOAD_VERSION,
            lang: state.lang,
            entries: state.roster
        };
    }

    async function applySharedPayload(payload) {
        const rawEntries = normalizeRosterEntries(payload && payload.entries);
        const needsSpoiler = Object.keys(rawEntries).some((name) => {
            return Object.prototype.hasOwnProperty.call(state.characterCaps, name) && !state.serverVisibleNames.has(name);
        });
        if (needsSpoiler && !state.spoilerEnabled && window.SpoilerState && typeof window.SpoilerState.shouldShowControl === 'function' && window.SpoilerState.shouldShowControl(state.lang)) {
            state.spoilerEnabled = true;
            syncSpoilerControl();
            if (typeof window.SpoilerState.set === 'function') {
                window.SpoilerState.set(true, { source: 'share-character-shared' });
            }
            await refreshCharacterData();
            showToast(t('msg_spoilers_enabled_for_shared', 'Spoilers were enabled to display the shared roster.'), 'success');
        }
        state.roster = normalizeRosterEntries(rawEntries, state.characterCaps);
        persistRoster();
        // Do not auto-select character to avoid popping up the modal on page load
        state.selectedCharacter = '';
        renderAll();
        return true;
    }

    function initControllers() {
        if (window.ShareCharacterCapture && typeof window.ShareCharacterCapture.createController === 'function') {
            state.captureController = window.ShareCharacterCapture.createController({
                state,
                dom,
                t,
                showToast,
                getCaptureNode: () => {
                    renderCaptureFrame();
                    return dom.captureFrame ? (dom.captureFrame.querySelector('.sc-capture-shell') || dom.captureFrame) : null;
                }
            });
        }
        if (window.ShareCharacterShareBackup && typeof window.ShareCharacterShareBackup.createController === 'function') {
            state.shareController = window.ShareCharacterShareBackup.createController({
                dom,
                t,
                showToast,
                getSharePayload,
                applySharedPayload,
                gasUrl: GAS_URL,
                shareQueryKey: SHARE_QUERY_KEY,
                sharePayloadVersion: SHARE_PAYLOAD_VERSION
            });
        }
        if (state.captureController) {
            dom.copyBtn.addEventListener('click', () => state.captureController.handleCopyPng());
            dom.captureBtn.addEventListener('click', () => state.captureController.handleDownloadPng());
        }
        if (state.shareController) {
            dom.shareBtn.addEventListener('click', () => state.shareController.handleShareClick());
        }
    }

    function ensureNavigationLoaded() {
        const navContainer = document.getElementById('nav-container');
        if (!navContainer) return;
        if (document.querySelector('#nav-container .main-nav') || document.querySelector('.mobile-header')) return;
        try {
            if (typeof Navigation !== 'undefined' && Navigation && typeof Navigation.load === 'function') {
                Navigation.load('share');
            } else if (window.Navigation && typeof window.Navigation.load === 'function') {
                window.Navigation.load('share');
            }
        } catch (_) { }
    }

    async function init() {
        cacheDom();
        ensureNavigationLoaded();
        state.lang = detectCurrentLang();
        try {
            if (window.I18nService && typeof window.I18nService.init === 'function') {
                await window.I18nService.init('share-character', state.lang);
            }
        } catch (_) { }
        state.lang = detectCurrentLang();
        if (window.I18nService && typeof window.I18nService.updateDOM === 'function') {
            window.I18nService.updateDOM(document);
        }
        applyFilterTranslations();
        applyActionTranslations();
        if (window.ShareHub && typeof window.ShareHub.setLastShareTab === 'function') {
            window.ShareHub.setLastShareTab('character');
        }
        applyNavigationTabs();
        state.roster = loadRoster();
        state.spoilerEnabled = !!(window.SpoilerState && typeof window.SpoilerState.get === 'function' && window.SpoilerState.get());
        syncSpoilerControl();
        ensureNavigationLoaded();
        try {
            if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
                window.SeoEngine.setContextHint({ domain: 'share-character', mode: 'list' }, { rerun: true });
            }
        } catch (_) { }
        bindFilters();
        bindSpoilerToggle();
        bindSpoilerSubscription();
        bindActions();
        initControllers();
        await refreshCharacterData();
        if (state.shareController && typeof state.shareController.tryLoadSharedFromUrl === 'function') {
            await state.shareController.tryLoadSharedFromUrl();
        }
        consumeShareNotice();
        ensureNavigationLoaded();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
