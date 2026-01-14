// Synergy Search and Filter Functions

(function() {
    'use strict';

    const BASE_URL = (typeof window !== 'undefined' && window.BASE_URL) ? window.BASE_URL : '';
    const APP_VERSION = (typeof window !== 'undefined' && window.APP_VERSION) ? window.APP_VERSION : Date.now().toString();

    // 필터 상태 변수
    let currentTimeFilter = 'all';
    let currentSearchQuery = '';
    let showSpoiler = false;

    // 현재 언어 가져오기 (synergy.js에서 사용)
    function getCurrentLanguage() {
        if (window.getCurrentLanguage && typeof window.getCurrentLanguage === 'function') {
            return window.getCurrentLanguage();
        }
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) {
            return urlLang;
        }
        try {
            const htmlLang = document.documentElement.lang || document.querySelector('html')?.getAttribute('lang');
            if (htmlLang) {
                if (htmlLang.startsWith('ko') || htmlLang.startsWith('kr')) return 'kr';
                if (htmlLang.startsWith('en')) return 'en';
                if (htmlLang.startsWith('ja') || htmlLang.startsWith('jp')) return 'jp';
            }
        } catch (e) {}
        return 'kr';
    }

    // characterList 가져오기 (synergy.js에서 설정)
    function getCharacterList() {
        return window.characterList || {};
    }

    // 시간대 필터링 (비동기 - 캐릭터 JSON 파일의 time 사용)
    async function filterByTime(characterName, characterTime = null) {
        const characterList = getCharacterList();
        const char = characterList[characterName];
        if (!char) return false;
        // inactive가 true인 경우 필터링 (탭에 표시하지 않음)
        if (char.inactive === true) return false;
        if (currentTimeFilter === 'all') return true;
        
        // characterTime이 제공된 경우 우선 사용 (캐릭터 JSON 파일의 time)
        // 없으면 friend_num.json의 time/appear로 폴백
        const time = characterTime || char.time || char.appear;
        if (!time) return false;
        
        const currentLanguage = getCurrentLanguage();
        
        // 언어별 time 값을 영어 값으로 변환하여 비교
        const timeMapping = {
            'kr': {
                '방과 후': 'After School',
                '저녁': 'Evening',
                '밤': 'Night',
                '오후': 'Afternoon'
            },
            'en': {
                'After School': 'After School',
                'Evening': 'Evening',
                'Night': 'Night',
                'Afternoon': 'Afternoon'
            },
            'jp': {
                '放課後': 'After School',
                '夕方': 'Evening',
                '夜': 'Night',
                '午後': 'Afternoon'
            }
        };
        
        // 현재 언어에 맞는 매핑 사용
        const mapping = timeMapping[currentLanguage] || timeMapping['en'];
        const normalizedTime = mapping[time] || time;
        
        return normalizedTime === currentTimeFilter;
    }

    // 검색 필터링 (비동기 - 영어/일본어 이름도 검색)
    async function filterBySearch(characterName, characterNamesMap = null) {
        if (!currentSearchQuery) return true;
        const query = currentSearchQuery.toLowerCase().trim();
        if (!query) return true;
        
        const characterList = getCharacterList();
        
        // 한국어 이름으로 검색
        if (characterName.toLowerCase().includes(query)) {
            return true;
        }
        
        // characterNamesMap이 제공된 경우 영어/일본어 이름도 검색
        if (characterNamesMap && characterNamesMap[characterName]) {
            const names = characterNamesMap[characterName];
            // 영어 이름 검색
            if (names.nameEn && names.nameEn.toLowerCase().includes(query)) {
                return true;
            }
            // 일본어 이름 검색
            if (names.nameJp && names.nameJp.toLowerCase().includes(query)) {
                return true;
            }
            // 표시 이름 검색 (현재 언어에 맞는 이름)
            if (names.displayName && names.displayName.toLowerCase().includes(query)) {
                return true;
            }
        }
        
        // characterNamesMap이 없으면 friend_num.json과 characters.js에서 직접 확인
        const char = characterList[characterName];
        if (char) {
            // friend_num.json의 name_en, name_jp 검색
            if (char.name_en && char.name_en.toLowerCase().includes(query)) {
                return true;
            }
            if (char.name_jp && char.name_jp.toLowerCase().includes(query)) {
                return true;
            }
        }
        
        // characters.js의 name_en, name_jp 검색
        if (window.characterData && window.characterData[characterName]) {
            const charData = window.characterData[characterName];
            if (charData.name_en && charData.name_en.toLowerCase().includes(query)) {
                return true;
            }
            if (charData.name_jp && charData.name_jp.toLowerCase().includes(query)) {
                return true;
            }
        }
        
        return false;
    }

    // 언어 파일 존재 여부 확인
    async function hasLanguageFile(characterName, lang) {
        if (lang === 'kr') return true; // 한국어는 항상 true
        try {
            const fileName = encodeURIComponent(characterName);
            const response = await fetch(`${BASE_URL}/apps/synergy/friends/${lang}/${fileName}.json?v=${APP_VERSION}`, { method: 'HEAD' });
            return response.ok;
        } catch (e) {
            return false;
        }
    }

    // 언어 필터링
    async function filterByLanguage(characterName) {
        const currentLanguage = getCurrentLanguage();
        if (currentLanguage === 'kr') return true; // 한국어는 모든 캐릭터 표시
        if (showSpoiler) return true; // spoiler 체크 시 모든 캐릭터 표시
        // 해당 언어 파일이 있는지 확인
        return await hasLanguageFile(characterName, currentLanguage);
    }

    // 필터 이벤트 핸들러
    function setupFilters() {
        // applyFilters 함수 가져오기 (synergy.js에서 설정)
        const applyFilters = window.applyFilters;
        if (!applyFilters) {
            console.warn('applyFilters function not found');
            return;
        }

        // 시간대 필터
        document.querySelectorAll('.time-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.time-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTimeFilter = btn.dataset.time;
                applyFilters();
                
                // 필터링 후 첫 번째 보이는 탭 선택
                const visibleTabs = Array.from(document.querySelectorAll('.character-tab:not([style*="display: none"])'));
                if (visibleTabs.length > 0) {
                    const firstTab = visibleTabs[0];
                    const firstCharacter = firstTab.dataset.character;
                    if (window.selectCharacter) {
                        window.selectCharacter(firstCharacter, true);
                    }
                }
            });
        });

        // 검색 필터
        const searchInput = document.getElementById('characterSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentSearchQuery = e.target.value.trim();
                    applyFilters();
                    
                    // 검색 후 첫 번째 보이는 탭 선택
                    const visibleTabs = Array.from(document.querySelectorAll('.character-tab:not([style*="display: none"])'));
                    if (visibleTabs.length > 0) {
                        const firstTab = visibleTabs[0];
                        const firstCharacter = firstTab.dataset.character;
                        if (window.selectCharacter) {
                            window.selectCharacter(firstCharacter, true);
                        }
                    }
                }, 300);
            });
        }

        // Spoiler 체크박스
        const spoilerCheckbox = document.getElementById('showSpoiler');
        if (spoilerCheckbox) {
            spoilerCheckbox.addEventListener('change', (e) => {
                showSpoiler = e.target.checked;
                applyFilters();
                
                // Spoiler 체크 후 첫 번째 보이는 탭 선택
                const visibleTabs = Array.from(document.querySelectorAll('.character-tab:not([style*="display: none"])'));
                if (visibleTabs.length > 0) {
                    const firstTab = visibleTabs[0];
                    const firstCharacter = firstTab.dataset.character;
                    if (window.selectCharacter) {
                        window.selectCharacter(firstCharacter, true);
                    }
                }
            });
        }
    }

    // 전역으로 노출
    window.synergySearch = {
        filterByTime: filterByTime,
        filterBySearch: filterBySearch,
        filterByLanguage: filterByLanguage,
        hasLanguageFile: hasLanguageFile,
        setupFilters: setupFilters,
        getCurrentTimeFilter: () => currentTimeFilter,
        getCurrentSearchQuery: () => currentSearchQuery,
        getShowSpoiler: () => showSpoiler,
        setCurrentTimeFilter: (value) => { currentTimeFilter = value; },
        setCurrentSearchQuery: (value) => { currentSearchQuery = value; },
        setShowSpoiler: (value) => { showSpoiler = value; }
    };
})();

