(function () {
    'use strict';

    const state = window.__characterSearchState || (window.__characterSearchState = {
        initialized: false,
        bound: false,
        sortedCharacters: [],
        searchIndex: {},
        setDataset: null,
        refresh: null
    });

    const nicknameMap = {
        '유이': 'YUI',
        '라멘': '카노 슌',
        '욧샤': '사카모토 류지',
        '수모코': '노게 토모코·여름',
        '수토하': '아라이 모토하·여름',
        '왕왕루': '도겐자카 루우나',
        '얼탱': '아시야 마사키',
        '조커': '아마미야 렌',
        '의사': '키타자토 키라',
        '와가하이': '모르가나',
        '수나미': '미나미·여름',
        '수미유': '미유·여름',
        '수유': '미유·여름',
        '그새끼': '아케치 고로',
        '선생': '카타야마 쿠미',
        '에우떼르빼': '나가오 마나카',
        '화오링': '리 야오링·사자무',
        '불오링': '리 야오링·사자무',
        '5리코': '타네무라 리코·매화',
        '풍리코': '타네무라 리코·매화',
        '풍타뉴': '코토네 몽타뉴·백조',
        '백타뉴': '코토네 몽타뉴·백조',
        '3주': '유키 마코토',
        '센세': '카타야마 쿠미',
        'fuuka': '야마기시 후카'
    };

    const searchTranslations = {
        en: {
            elements: {
                '만능': 'Almighty', '물리': 'Physical', '총격': 'Gun', '화염': 'Fire',
                '빙결': 'Ice', '전격': 'Electric', '질풍': 'Wind', '염동': 'Psychokinesis',
                '핵열': 'Nuclear', '축복': 'Bless', '주원': 'Curse',
                '버프': 'Buff', '디버프': 'Debuff', '디버프광역': 'AOE Debuff'
            },
            positions: {
                '구원': 'Medic', '굴복': 'Saboteur', '반항': 'Assassin', '방위': 'Guardian',
                '우월': 'Strategist', '지배': 'Sweeper', '해명': 'Elucidator', '자율': 'Virtuoso'
            }
        },
        jp: {
            elements: {
                '만능': '万能', '물리': '物理', '총격': '銃撃', '화염': '火炎',
                '빙결': '氷結', '전격': '電撃', '질풍': '疾風', '염동': '念動',
                '핵열': '核熱', '축복': '祝福', '주원': '呪怨',
                '버프': 'バフ', '디버프': 'デバフ', '디버프광역': 'デバフ広域'
            },
            positions: {
                '구원': '救済', '굴복': '屈服', '반항': '反抗', '방위': '防衛',
                '우월': '優越', '지배': '支配', '해명': '解明', '자율': '自律'
            }
        }
    };

    function getCurrentLang() {
        try {
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
                return LanguageRouter.getCurrentLanguage();
            }
        } catch (_) { }
        return 'kr';
    }

    function normalizeToken(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function getDisplayName(characterName) {
        const charData = (window.characterData && window.characterData[characterName]) || {};
        const lang = getCurrentLang();

        if (lang === 'en') {
            return charData.codename || charData.name_en || charData.name || characterName;
        }
        if (lang === 'jp') {
            return charData.name_jp || charData.name || characterName;
        }
        return charData.name || characterName;
    }

    function buildSearchIndex() {
        const nextIndex = {};
        const data = window.characterData || {};

        state.sortedCharacters.forEach((name) => {
            const char = data[name];
            if (!char) return;

            const terms = [
                name,
                char.name,
                char.name_en,
                char.name_jp,
                char.name_cn,
                char.name_tw,
                char.codename,
                char.persona,
                char.persona_en,
                char.persona_jp,
                char.persona_cn,
                char.tag,
                char.tag_en,
                char.tag_jp,
                char.role_en,
                char.role_jp,
                char.element,
                char.position
            ].filter(Boolean);

            if (char.element) {
                const enElement = searchTranslations.en.elements[char.element];
                const jpElement = searchTranslations.jp.elements[char.element];
                if (enElement) terms.push(enElement);
                if (jpElement) terms.push(jpElement);
            }

            if (char.position) {
                const enPosition = searchTranslations.en.positions[char.position];
                const jpPosition = searchTranslations.jp.positions[char.position];
                if (enPosition) terms.push(enPosition);
                if (jpPosition) terms.push(jpPosition);
            }

            Object.entries(nicknameMap).forEach(([nickname, realName]) => {
                if (realName === char.name) {
                    terms.push(nickname);
                }
            });

            nextIndex[name] = terms.join(' ').toLowerCase();
        });

        state.searchIndex = nextIndex;
    }

    function updateSearchCount(count) {
        const searchCount = document.querySelector('.search-count');
        if (!searchCount) return;

        const countText = window.i18nFilteredCount || '전체';
        const countUnit = window.i18nCountUnit ?? '';
        searchCount.textContent = `${countText} ${count}${countUnit}`;
    }

    function hasElementalAilment(tagsRaw) {
        return tagsRaw.includes('원소 이상') && !tagsRaw.includes('원소 이상 제거');
    }

    function hasTag(characterTags, wantedTag, isPersona3, isPersona5, isLimited) {
        const wantedNorm = normalizeToken(wantedTag);
        const tagsRaw = String(characterTags || '');

        if (wantedNorm === 'persona5' || wantedNorm === '페르소나5') return isPersona5;
        if (wantedNorm === 'persona3' || wantedNorm === '페르소나3') return isPersona3;
        if (wantedNorm === '한정' || wantedNorm === 'limited') return isLimited;
        if (wantedNorm === '통상' || wantedNorm === 'normal') return !isLimited;

        switch (wantedNorm) {
            case 'technical':
                return tagsRaw.includes('TECHNICAL') || tagsRaw.includes('스킬마스터');
            case '추가효과':
                return tagsRaw.includes('추가 효과') || tagsRaw.includes('추가효과');
            case '지속대미지':
                return tagsRaw.includes('지속 대미지') || tagsRaw.includes('화상') || tagsRaw.includes('주원');
            case '화상':
                return tagsRaw.includes('화상') || hasElementalAilment(tagsRaw);
            case '풍습':
                return tagsRaw.includes('풍습') || hasElementalAilment(tagsRaw);
            case '감전':
                return tagsRaw.includes('감전') || hasElementalAilment(tagsRaw);
            case '동결':
                return tagsRaw.includes('동결') || hasElementalAilment(tagsRaw);
            case 'hp소모':
                return tagsRaw.includes('HP 소모');
            case '실드':
                return tagsRaw.includes('실드');
            case '효과명중':
                return tagsRaw.includes('효과 명중') || tagsRaw.includes('효과명중');
            case '방어력감소':
                return tagsRaw.includes('방어력 감소') || tagsRaw.includes('방어력감소');
            case '관통':
                return tagsRaw.includes('관통');
            default:
                return false;
        }
    }

    function applyFilters() {
        const selectedElements = Array.from(document.querySelectorAll('input[name="element"]:checked')).map((cb) => cb.value);
        const selectedPositions = Array.from(document.querySelectorAll('input[name="position"]:checked')).map((cb) => cb.value);
        const selectedRarities = Array.from(document.querySelectorAll('input[name="rarity"]:checked')).map((cb) => Number(cb.value));
        const selectedTags = Array.from(document.querySelectorAll('input[name="tag"]:checked')).map((cb) => cb.value);

        let visibleCount = 0;
        const cards = document.querySelectorAll('.card');

        cards.forEach((card) => {
            const element = card.dataset.element;
            const position = card.dataset.position;
            const rarity = Number(card.dataset.rarity);
            const isPersona5 = card.dataset.persona5 === 'true';
            const isPersona3 = card.dataset.persona3 === 'true';
            const isLimited = card.dataset.limit === 'true';
            const characterTags = card.dataset.tags || '';

            const elementMatch = selectedElements.length === 0
                || selectedElements.includes(element)
                || (element === '질풍빙결' && (selectedElements.includes('질풍') || selectedElements.includes('빙결')));
            const positionMatch = selectedPositions.length === 0 || selectedPositions.includes(position);
            const rarityMatch = selectedRarities.length === 0 || selectedRarities.includes(rarity);
            const tagMatch = selectedTags.length === 0 || selectedTags.every((tag) => hasTag(characterTags, tag, isPersona3, isPersona5, isLimited));

            const shouldShow = elementMatch && positionMatch && rarityMatch && tagMatch && !card.classList.contains('hidden-by-search');
            card.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) visibleCount += 1;
        });

        updateSearchCount(visibleCount);
    }

    function filterBySearch(searchValue) {
        const query = String(searchValue || '').toLowerCase().trim();
        const cards = document.querySelectorAll('.card');

        if (!query) {
            cards.forEach((card) => card.classList.remove('hidden-by-search'));
            applyFilters();
            return;
        }

        const matched = new Set();
        Object.keys(state.searchIndex).forEach((name) => {
            if (state.searchIndex[name].includes(query)) {
                matched.add(name);
            }
        });

        cards.forEach((card) => {
            const img = card.querySelector('.character-img, .character-img.loaded');
            const characterName = img ? img.alt : '';
            if (matched.has(characterName)) {
                card.classList.remove('hidden-by-search');
            } else {
                card.classList.add('hidden-by-search');
            }
        });

        applyFilters();
    }

    function renderDropdown(searchValue) {
        const dropdown = document.getElementById('searchDropdown');
        if (!dropdown) return;

        const query = String(searchValue || '').toLowerCase();
        dropdown.innerHTML = '';

        if (!query) {
            dropdown.style.display = 'none';
            return;
        }

        const matches = state.sortedCharacters.filter((characterName) => {
            const charData = window.characterData && window.characterData[characterName];
            if (!charData) return false;

            const displayName = String(getDisplayName(characterName)).toLowerCase();
            const codename = String(charData.codename || '').toLowerCase();
            const key = String(characterName || '').toLowerCase();
            const indexed = String(state.searchIndex[characterName] || '');
            const nicknameMatch = Object.entries(nicknameMap).some(([nickname, realName]) => {
                return nickname.toLowerCase().includes(query) && realName === characterName;
            });
            return displayName.includes(query) || codename.includes(query) || key.includes(query) || indexed.includes(query) || nicknameMatch;
        });

        if (!matches.length) {
            dropdown.style.display = 'none';
            return;
        }

        dropdown.style.display = 'block';
        matches.slice(0, 25).forEach((name) => {
            const div = document.createElement('div');
            div.className = 'dropdown-item';
            const displayName = getDisplayName(name);
            div.textContent = displayName;
            div.addEventListener('click', () => {
                const searchInput = document.getElementById('characterSearch');
                if (searchInput) searchInput.value = displayName;
                dropdown.style.display = 'none';
                filterBySearch(String(displayName).toLowerCase());
            });
            dropdown.appendChild(div);
        });
    }

    function bindOnce() {
        if (state.bound) return;
        state.bound = true;

        const filterInputs = document.querySelectorAll('input[type="checkbox"]');
        filterInputs.forEach((input) => {
            input.addEventListener('change', () => {
                applyFilters();
            });
        });

        const filterToggleBtn = document.querySelector('.filter-toggle-btn');
        const filterContent = document.querySelector('.filter-content');
        const filterResetBtn = document.querySelector('.filter-reset-btn');
        const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');

        if (filterContent) {
            filterContent.style.display = 'block';
        }

        if (filterToggleBtn && filterContent) {
            filterToggleBtn.addEventListener('click', () => {
                filterContent.style.display = filterContent.style.display === 'none' ? 'block' : 'none';
            });
            filterToggleBtn.style.display = 'none';
        }

        if (filterResetBtn) {
            filterResetBtn.addEventListener('click', () => {
                checkboxes.forEach((cb) => { cb.checked = false; });
                filterResetBtn.style.display = 'none';
                applyFilters();
            });
            filterResetBtn.style.display = 'none';
        }

        const searchInput = document.getElementById('characterSearch');
        const dropdown = document.getElementById('searchDropdown');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                const value = String(event.target.value || '');
                renderDropdown(value);
                filterBySearch(value.toLowerCase());
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (dropdown) dropdown.style.display = 'none';
                }, 200);
            });
        }
    }

    function initializeFiltersAndSearch(sortedCharacters) {
        state.sortedCharacters = Array.isArray(sortedCharacters) ? sortedCharacters : [];
        buildSearchIndex();
        bindOnce();

        const searchInput = document.getElementById('characterSearch');
        if (!state.initialized && searchInput) {
            const urlParams = new URLSearchParams(window.location.search);
            const searchParam = urlParams.get('q') || urlParams.get('search');
            if (searchParam) {
                searchInput.value = searchParam;
            }
        }

        state.setDataset = function setDataset(nextSortedCharacters) {
            state.sortedCharacters = Array.isArray(nextSortedCharacters) ? nextSortedCharacters : [];
            buildSearchIndex();
        };

        state.refresh = function refresh() {
            const input = document.getElementById('characterSearch');
            const value = input ? String(input.value || '').toLowerCase() : '';
            filterBySearch(value);
            applyFilters();
        };

        state.refresh();
        state.initialized = true;
    }

    window.CharacterSearch = {
        initOnce: initializeFiltersAndSearch,
        setSearchDataset(sortedCharacters) {
            if (typeof state.setDataset === 'function') {
                state.setDataset(sortedCharacters);
            } else {
                state.sortedCharacters = Array.isArray(sortedCharacters) ? sortedCharacters : [];
                buildSearchIndex();
            }
            if (typeof state.refresh === 'function') {
                state.refresh();
            }
        }
    };

    // Backward-compatible API
    window.initCharacterSearch = initializeFiltersAndSearch;
})();
