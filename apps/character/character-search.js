(function () {
    // 필터 및 검색 기능 초기화
    function initializeFiltersAndSearch(sortedCharacters) {
        const currentLang = typeof LanguageRouter !== 'undefined' ? LanguageRouter.getCurrentLanguage() : 'kr';

        // 별칭 매핑
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
            '선생': '카타야마 쿠미',
            'fuuka': '야마기시 후카'
        };

        // 검색용 속성/직업 번역 데이터 (i18n-common에서 가져옴)
        const searchTranslations = {
            en: {
                elements: {
                    "만능": "Almighty", "물리": "Physical", "총격": "Gun", "화염": "Fire",
                    "빙결": "Ice", "전격": "Electric", "질풍": "Wind", "염동": "Psychokinesis",
                    "핵열": "Nuclear", "축복": "Bless", "주원": "Curse",
                    "버프": "Buff", "디버프": "Debuff", "디버프광역": "AOE Debuff"
                },
                positions: {
                    "구원": "Medic", "굴복": "Saboteur", "반항": "Assassin", "방위": "Guardian",
                    "우월": "Strategist", "지배": "Sweeper", "해명": "Elucidator", "자율": "Virtuoso"
                }
            },
            jp: {
                elements: {
                    "만능": "万能", "물리": "物理", "총격": "銃撃", "화염": "火炎",
                    "빙결": "氷結", "전격": "電撃", "질풍": "疾風", "염동": "念動",
                    "핵열": "核熱", "축복": "祝福", "주원": "呪怨",
                    "버프": "バフ", "디버프": "デバフ", "디버프광역": "デバフ広域"
                },
                positions: {
                    "구원": "救済", "굴복": "屈服", "반항": "反抗", "방위": "防衛",
                    "우월": "優越", "지배": "支配", "해명": "解明", "자율": "自律"
                }
            }
        };

        // 검색 인덱스 생성 (성능 최적화 및 검색 범위 확장)
        const searchIndex = {};

        // 데이터 로드 확인 및 인덱스 빌드
        if (window.characterData) {
            sortedCharacters.forEach(name => {
                const char = window.characterData[name];
                if (!char) return;

                // 검색어 구성을 위한 배열
                const searchTerms = [];

                // 1. 이름 (Name)
                if (char.name) searchTerms.push(char.name);
                if (char.name_en) searchTerms.push(char.name_en);
                if (char.name_jp) searchTerms.push(char.name_jp);
                if (char.name_cn) searchTerms.push(char.name_cn);
                if (char.name_tw) searchTerms.push(char.name_tw);
                if (char.codename) searchTerms.push(char.codename);

                // 2. 페르소나 (Persona)
                if (char.persona) searchTerms.push(char.persona);
                if (char.persona_en) searchTerms.push(char.persona_en);
                if (char.persona_jp) searchTerms.push(char.persona_jp);
                if (char.persona_cn) searchTerms.push(char.persona_cn);

                // 3. 태그 (Tags)
                if (char.tag) searchTerms.push(char.tag);
                if (char.tag_en) searchTerms.push(char.tag_en);
                if (char.tag_jp) searchTerms.push(char.tag_jp);

                // 4. 역할 (Roles)
                if (char.role_en) searchTerms.push(char.role_en);
                if (char.role_jp) searchTerms.push(char.role_jp);

                // 5. 속성 및 직업 (Element & Position) + 번역어
                if (char.element) {
                    searchTerms.push(char.element);
                    if (searchTranslations.en.elements[char.element]) searchTerms.push(searchTranslations.en.elements[char.element]);
                    if (searchTranslations.jp.elements[char.element]) searchTerms.push(searchTranslations.jp.elements[char.element]);
                }
                if (char.position) {
                    searchTerms.push(char.position);
                    if (searchTranslations.en.positions[char.position]) searchTerms.push(searchTranslations.en.positions[char.position]);
                    if (searchTranslations.jp.positions[char.position]) searchTerms.push(searchTranslations.jp.positions[char.position]);
                }

                // 6. 별칭 (Nicknames)
                // 별칭 매핑 역방향 검색
                Object.entries(nicknameMap).forEach(([nick, realName]) => {
                    if (realName === char.name) {
                        searchTerms.push(nick);
                    }
                });

                // 모든 용어를 소문자로 변환하여 공백으로 연결
                searchIndex[name] = searchTerms.join(' ').toLowerCase();
                // console.log(`Indexer for ${name}: `, searchIndex[name]);
            });
        }

        // 영어/일본어일 때 태그 필터 숨기기
        /*
        if (currentLang === 'en' || currentLang === 'jp') {
            const tagFilterGroup = document.querySelector('.filter-group:last-child');
            if (tagFilterGroup) {
                tagFilterGroup.style.display = 'none';
            }
        }
        */

        // 필터 변경 이벤트 리스너
        const filterInputs = document.querySelectorAll('input[type="checkbox"]');
        filterInputs.forEach(input => {
            input.addEventListener('change', applyFilters);
        });

        const searchCount = document.querySelector('.search-count');
        const filterToggleBtn = document.querySelector('.filter-toggle-btn');
        const filterContent = document.querySelector('.filter-content');
        const filterResetBtn = document.querySelector('.filter-reset-btn');
        const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');

        if (filterContent) {
            filterContent.style.display = 'block';
        }

        // Filter toggle
        if (filterToggleBtn) {
            filterToggleBtn.addEventListener('click', () => {
                filterContent.style.display = filterContent.style.display === 'none' ? 'block' : 'none';
            });
            filterToggleBtn.style.display = 'none';
        }

        // Reset button
        if (filterResetBtn) {
            filterResetBtn.addEventListener('click', () => {
                checkboxes.forEach(cb => cb.checked = false);
                filterResetBtn.style.display = 'none';
                applyFilters();
            });
            filterResetBtn.style.display = 'none';
        }

        // Filter application function
        function applyFilters() {
            const selectedElements = Array.from(document.querySelectorAll('input[name="element"]:checked')).map(cb => cb.value);
            const selectedPositions = Array.from(document.querySelectorAll('input[name="position"]:checked')).map(cb => cb.value);
            const selectedRarities = Array.from(document.querySelectorAll('input[name="rarity"]:checked')).map(cb => parseInt(cb.value));
            const selectedTags = Array.from(document.querySelectorAll('input[name="tag"]:checked')).map(cb => cb.value);

            let visibleCount = 0;

            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const element = card.dataset.element;
                const position = card.dataset.position;
                const rarity = parseInt(card.dataset.rarity);
                const isPersona5 = card.dataset.persona5 === 'true';
                const isPersona3 = card.dataset.persona3 === 'true';
                const isLimited = card.dataset.limit === 'true';
                const characterTags = card.dataset.tags || '';

                const elementMatch = selectedElements.length === 0 ||
                    selectedElements.includes(element) ||
                    (element === "질풍빙결" && (selectedElements.includes("질풍") || selectedElements.includes("빙결")));

                const positionMatch = selectedPositions.length === 0 || selectedPositions.includes(position);
                const rarityMatch = selectedRarities.length === 0 || selectedRarities.includes(rarity);

                const tagMatch = selectedTags.every(tag => {
                    switch (tag) {
                        case '페르소나5': return isPersona5;
                        case '페르소나3': return isPersona3;
                        case '한정': return isLimited;
                        case '통상': return !isLimited;
                        case 'TECHNICAL': return characterTags.includes('TECHNICAL') || characterTags.includes('스킬마스터');
                        case '추가효과': return characterTags.includes('추가 효과') || characterTags.includes('추가효과');
                        case '지속대미지': return characterTags.includes('지속 대미지') || characterTags.includes('화상') || characterTags.includes('주원');
                        case '화상': return characterTags.includes('화상') || (characterTags.includes('원소 이상') && !characterTags.includes('원소 이상 제거'));
                        case '풍습': return characterTags.includes('풍습') || (characterTags.includes('원소 이상') && !characterTags.includes('원소 이상 제거'));
                        case '감전': return characterTags.includes('감전') || (characterTags.includes('원소 이상') && !characterTags.includes('원소 이상 제거'));
                        case '동결': return characterTags.includes('동결') || (characterTags.includes('원소 이상') && !characterTags.includes('원소 이상 제거'));
                        case 'HP 소모': return characterTags.includes('HP 소모');
                        case '실드': return characterTags.includes('실드');
                        case '효과명중': return characterTags.includes('효과 명중');
                        case '방어력감소': return characterTags.includes('방어력 감소');
                        case '관통': return characterTags.includes('관통');
                        default: return false;
                    }
                });

                const shouldShow = elementMatch && positionMatch && rarityMatch && (selectedTags.length === 0 || tagMatch);
                if (shouldShow && !card.classList.contains('hidden-by-search')) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Update search count
            updateSearchCount(visibleCount);
        }

        function updateSearchCount(count) {
            if (searchCount) {
                const countText = window.i18nFilteredCount ?? '전체';
                const countUnit = window.i18nCountUnit ?? '명';
                searchCount.textContent = `${countText} ${count}${countUnit}`;
            }
        }

        // 검색 기능 구현
        const searchInput = document.getElementById('characterSearch');
        const dropdown = document.getElementById('searchDropdown');

        if (searchInput) {
            // URL 파라미터로 초기 검색어 있으면 적용
            const urlParams = new URLSearchParams(window.location.search);
            const searchParam = urlParams.get('q') || urlParams.get('search');
            if (searchParam) {
                searchInput.value = searchParam;
                // 약간의 지연 후 검색 실행 (DOM 렌더링 확보)
                setTimeout(() => filterBySearch(searchParam.toLowerCase()), 100);
            }

            searchInput.addEventListener('input', (e) => {
                const searchValue = e.target.value.toLowerCase();
                if (dropdown) {
                    dropdown.innerHTML = '';

                    if (searchValue.length > 0) {
                        // characterData가 로드되었는지 확인
                        if (!window.characterData) {
                            console.error('Character data not loaded yet');
                            return;
                        }

                        // sortedCharacters 배열에서 검색 (이름 기반으로 드롭다운 표시)
                        const matches = sortedCharacters.filter(characterName => {
                            if (!window.characterData[characterName]) return false;

                            const charData = window.characterData[characterName];
                            const displayName = charData.name ? charData.name.toLowerCase() : '';
                            const originalName = characterName.toLowerCase();
                            const codeName = charData.codename ? charData.codename.toLowerCase() : '';

                            // 별칭 매칭도 포함
                            const nicknameMatch = Object.entries(nicknameMap).find(([nickname, realName]) =>
                                nickname.toLowerCase().includes(searchValue) && realName === characterName // realName is key here
                            );

                            // 드롭다운은 주로 이름 검색용
                            return displayName.includes(searchValue) ||
                                originalName.includes(searchValue) ||
                                codeName.includes(searchValue) ||
                                nicknameMatch !== undefined;
                        });

                        if (matches.length > 0) {
                            dropdown.style.display = 'block';
                            matches.forEach(name => {
                                if (!window.characterData[name]) return;

                                const div = document.createElement('div');
                                div.className = 'dropdown-item';
                                const currentLang = typeof LanguageRouter !== 'undefined' ? LanguageRouter.getCurrentLanguage() : 'kr';
                                const char = window.characterData[name];
                                let displayName = char.name;
                                if (currentLang === 'en') {
                                    displayName = char.codename || char.name_en || char.name;
                                } else if (currentLang === 'jp') {
                                    displayName = char.name_jp || char.name;
                                }
                                div.textContent = displayName;
                                div.addEventListener('click', () => {
                                    searchInput.value = displayName;
                                    dropdown.style.display = 'none';
                                    filterBySearch(displayName.toLowerCase());
                                });
                                dropdown.appendChild(div);
                            });
                        } else {
                            dropdown.style.display = 'none';
                        }
                    } else {
                        dropdown.style.display = 'none';
                        filterBySearch('');
                    }
                }

                filterBySearch(searchValue);
            });

            // 포커스 잃으면 드롭다운 닫기 (지연 처리로 클릭 허용)
            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (dropdown) dropdown.style.display = 'none';
                }, 200);
            });
        }

        // Search filtering function
        function filterBySearch(searchValue) {
            if (!window.characterData) {
                console.error('Character data not loaded yet');
                return;
            }

            let visibleCount = 0;
            const cards = document.querySelectorAll('.card');

            // 모든 캐릭터에 대해 검색어 매칭 여부 판단
            const matchedCharacters = new Set();
            Object.keys(searchIndex).forEach(name => {
                if (searchValue === '' || searchIndex[name].includes(searchValue)) {
                    matchedCharacters.add(name);
                }
            });

            // 카드를 돌면서 매칭 여부에 따라 클래스 토글
            cards.forEach((card, index) => {
                const img = card.querySelector('.character-img, .character-img.loaded');
                const characterName = img ? img.alt : ''; // <img> alt는 항상 characterName (key)

                if (matchedCharacters.has(characterName)) {
                    card.classList.remove('hidden-by-search');
                } else {
                    card.classList.add('hidden-by-search');
                }
            });

            // 필터 재적용 (검색 결과 내에서 필터링)
            applyFilters();
        }
    }

    // 전역 함수로 노출
    window.initCharacterSearch = initializeFiltersAndSearch;

})();
