// Synergy Page JavaScript

(function () {
    'use strict';

    const BASE_URL = (typeof window !== 'undefined' && window.BASE_URL) ? window.BASE_URL : '';
    const APP_VERSION = (typeof window !== 'undefined' && window.APP_VERSION) ? window.APP_VERSION : Date.now().toString();

    let characterList = {};
    let characterData = {};
    let mapNameTranslations = {};
    let currentLanguage = 'kr';
    let selectedCharacter = null;
    // 필터 변수는 synergy_search.js로 이동
    let hasKrFallback = false; // 한국어 폴백 사용 여부

    // characterList를 전역으로 노출 (synergy_search.js에서 사용)
    window.characterList = characterList;

    // 현재 언어 감지 (전역으로 노출 - synergy_search.js에서 사용)
    function getCurrentLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) {
            return urlLang;
        }
        try {
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && ['kr', 'en', 'jp'].includes(savedLang)) {
                return savedLang;
            }
        } catch (e) { }
        return 'kr';
    }

    // 전역으로 노출
    window.getCurrentLanguage = getCurrentLanguage;

    /* === CONSTANTS === */
    const CURRENCY_MAPPING = [
        { icon: 'item-huobi-1038.png', keywordKey: 'currencyArcadeKeywords' },
        { icon: 'item-huobi-22.png', keywordKey: 'currencyCashKeywords' },
        { icon: 'item-huobi-16.png', keywordKey: 'currencyBattingKeywords' },
        { icon: 'item-huobi-53.png', keywordKey: 'currencySoccerBadgeKeywords' }
    ];

    const TIME_FILTER_KEY_BY_CANONICAL = {
        'After School': 'filterAfterSchool',
        'Evening': 'filterEvening',
        'Night': 'filterNight',
        'Afternoon': 'filterAfternoon'
    };

    function addStringToSet(set, value) {
        if (typeof value === 'string' && value.trim()) {
            set.add(value);
        }
    }

    function getI18nServiceInstance() {
        if (window.__I18nService__) return window.__I18nService__;
        if (window.I18nService) return window.I18nService;
        return null;
    }

    function getNestedValue(obj, key) {
        if (!obj || !key) return undefined;

        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return obj[key];
        }

        if (typeof key !== 'string' || !key.includes('.')) {
            return undefined;
        }

        return key.split('.').reduce((current, part) => {
            if (current && Object.prototype.hasOwnProperty.call(current, part)) {
                return current[part];
            }
            return undefined;
        }, obj);
    }

    function getTranslationByLang(lang, key) {
        const service = getI18nServiceInstance();
        if (!service || !service.cache || !lang) return undefined;

        const pageValue = getNestedValue(service.cache[lang]?.pages?.synergy, key);
        if (pageValue !== undefined) return pageValue;

        const commonValue = getNestedValue(service.cache[lang]?.common, key);
        if (commonValue !== undefined) return commonValue;

        return undefined;
    }

    function getI18nText(key, fallback) {
        if (window.t && typeof window.t === 'function') {
            const translated = window.t(key, key);
            if (translated !== key) {
                return translated;
            }
        }

        const service = getI18nServiceInstance();
        if (service && typeof service.t === 'function') {
            const translated = service.t(key, key);
            if (translated !== key) {
                return translated;
            }
        }

        const fallbackKr = getTranslationByLang('kr', key);
        if (fallbackKr !== undefined) return fallbackKr;
        return fallback !== undefined ? fallback : key;
    }

    function getI18nValuesAllLanguages(key, fallback = []) {
        const values = new Set();
        const langs = ['kr', 'en', 'jp'];

        langs.forEach(lang => {
            const value = getTranslationByLang(lang, key);
            if (Array.isArray(value)) {
                value.forEach(v => addStringToSet(values, v));
            } else {
                addStringToSet(values, value);
            }
        });

        let currentValue = fallback;
        if (window.t && typeof window.t === 'function') {
            const translated = window.t(key, key);
            if (translated !== key) {
                currentValue = translated;
            }
        } else {
            const service = getI18nServiceInstance();
            if (service && typeof service.t === 'function') {
                const translated = service.t(key, key);
                if (translated !== key) {
                    currentValue = translated;
                }
            }
        }

        if (Array.isArray(currentValue)) {
            currentValue.forEach(v => addStringToSet(values, v));
        } else {
            addStringToSet(values, currentValue);
        }

        if (values.size === 0) {
            if (Array.isArray(fallback)) {
                fallback.forEach(v => addStringToSet(values, v));
            } else {
                addStringToSet(values, fallback);
            }
        }

        return Array.from(values);
    }

    function normalizeTimeValue(timeValue) {
        if (!timeValue) return '';
        if (Object.prototype.hasOwnProperty.call(TIME_FILTER_KEY_BY_CANONICAL, timeValue)) {
            return timeValue;
        }

        for (const [canonical, key] of Object.entries(TIME_FILTER_KEY_BY_CANONICAL)) {
            const candidates = getI18nValuesAllLanguages(key, []);
            if (candidates.some(candidate => candidate === timeValue)) {
                return canonical;
            }
        }

        return timeValue;
    }

    function getTimeLabel(timeValue) {
        const normalized = normalizeTimeValue(timeValue);
        const key = TIME_FILTER_KEY_BY_CANONICAL[normalized];
        if (!key) return timeValue;
        return getI18nText(key, timeValue);
    }

    function isArcadeCurrency(moneyName) {
        if (!moneyName) return false;
        const keywords = getI18nValuesAllLanguages('currencyArcadeKeywords', []);
        return keywords.some(keyword => moneyName.includes(keyword) || moneyName === keyword);
    }

    function isCashCurrency(moneyName) {
        if (!moneyName) return false;
        const keywords = getI18nValuesAllLanguages('currencyCashKeywords', []);
        return keywords.some(keyword => moneyName === keyword);
    }

    // 외부 모듈(synergy_search.js)에서 시간 정규화 재사용
    window.normalizeSynergyTime = normalizeTimeValue;

    // 화폐 아이콘 가져오기 헬퍼 함수
    function getMoneyIcon(moneyName, shop) {
        if (!moneyName) {
            moneyName = shop?.moneyName || '';
        }
        if (!moneyName) return '';

        for (const currency of CURRENCY_MAPPING) {
            const keywords = getI18nValuesAllLanguages(currency.keywordKey, []);
            if (keywords.some(keyword => moneyName.includes(keyword) || moneyName === keyword)) {
                return `<img src="${BASE_URL}/assets/img/item-little-icon/${currency.icon}" alt="${moneyName}" class="money-icon" style="height: 16px; width: auto; vertical-align: middle;" onerror="this.onerror=null; this.style.display='none';">`;
            }
        }
        return '';
    }

    // UI 번역 함수 (i18n 서비스로 대체됨)
    // function translateUI() { ... } - Removed


    // friend_num.json 로드
    async function loadCharacterList() {
        try {
            const response = await fetch(`${BASE_URL}/apps/synergy/friends/friend_num.json?v=${APP_VERSION}`);
            if (!response.ok) throw new Error('Failed to load character list');
            characterList = await response.json();
            // 전역으로 업데이트 (synergy_search.js에서 사용)
            window.characterList = characterList;
            return true;
        } catch (error) {
            console.error('Error loading character list:', error);
            return false;
        }
    }

    // map_name.json 로드
    async function loadMapNameTranslations() {
        try {
            const response = await fetch(`${BASE_URL}/apps/synergy/friends/map_name.json?v=${APP_VERSION}`);
            if (!response.ok) throw new Error('Failed to load map name translations');
            mapNameTranslations = await response.json();
            return true;
        } catch (error) {
            console.error('Error loading map name translations:', error);
            return false;
        }
    }

    // mapName 번역
    function translateMapName(mapNameKr) {
        if (!mapNameKr || currentLanguage === 'kr') return mapNameKr;
        const translation = mapNameTranslations[mapNameKr];
        if (!translation) return mapNameKr;
        return translation[currentLanguage] || mapNameKr;
    }

    // mapName의 이미지 경로 가져오기
    function getMapImage(mapName) {
        if (!mapName) return null;

        // 한국어인 경우 직접 키로 찾기
        if (currentLanguage === 'kr') {
            const translation = mapNameTranslations[mapName];
            if (!translation || !translation.img) return null;
            return `${BASE_URL}/assets/img/synergy/place/${translation.img}`;
        }

        // 영어/일본어인 경우 역으로 검색 (번역된 값으로 한국어 키 찾기)
        for (const [krKey, translation] of Object.entries(mapNameTranslations)) {
            if (translation && translation[currentLanguage] === mapName) {
                if (translation.img) {
                    return `${BASE_URL}/assets/img/synergy/place/${translation.img}`;
                }
            }
        }

        // 역 검색 실패 시 한국어 키로도 시도 (폴백)
        const translation = mapNameTranslations[mapName];
        if (translation && translation.img) {
            return `${BASE_URL}/assets/img/synergy/place/${translation.img}`;
        }

        return null;
    }

    // resetType 번역
    // resetType 번역
    function translateResetType(resetType) {
        const noneValues = getI18nValuesAllLanguages('resetTypeNoneValues', []);
        if (!resetType || noneValues.includes(resetType)) {
            return getI18nText('labelNone', '-');
        }

        const resetTypeMappings = [
            { valueKey: 'resetTypeWeeklyValues', textKey: 'resetWeekly' },
            { valueKey: 'resetTypeMonthlyValues', textKey: 'resetMonthly' },
            { valueKey: 'resetTypeDailyValues', textKey: 'resetDaily' }
        ];

        for (const mapping of resetTypeMappings) {
            const values = getI18nValuesAllLanguages(mapping.valueKey, []);
            if (values.includes(resetType)) {
                return getI18nText(mapping.textKey, resetType);
            }
        }
        return resetType;
    }

    // 전역으로 노출 (item_from.js에서 사용)
    window.translateResetType = translateResetType;

    // 개별 캐릭터 데이터 로드
    async function loadCharacterData(characterName) {
        const cacheKey = `${characterName}_${currentLanguage}`;
        if (characterData[cacheKey]) {
            return characterData[cacheKey];
        }

        try {
            const lang = currentLanguage;
            const fileName = encodeURIComponent(characterName);
            let response = await fetch(`${BASE_URL}/apps/synergy/friends/${lang}/${fileName}.json?v=${APP_VERSION}`);
            let data = null;
            let krData = null;

            if (response.ok) {
                const jsonData = await response.json();
                data = jsonData.data || jsonData;
            }

            // mapName이 없으면 kr 데이터를 폴백으로 로드
            if (lang !== 'kr' && (!data || !hasMapName(data))) {
                const krResponse = await fetch(`${BASE_URL}/apps/synergy/friends/kr/${fileName}.json?v=${APP_VERSION}`);
                if (krResponse.ok) {
                    const krJsonData = await krResponse.json();
                    krData = krJsonData.data || krJsonData;
                    // kr 데이터의 mapName을 현재 데이터에 병합
                    if (data && krData) {
                        mergeMapNames(data, krData);
                    } else if (krData) {
                        data = krData;
                        hasKrFallback = true; // 한국어 폴백 사용
                    }
                }
            }

            if (!data) {
                // 언어별 파일이 없으면 kr로 폴백
                if (lang !== 'kr') {
                    const krResponse = await fetch(`${BASE_URL}/apps/synergy/friends/kr/${fileName}.json?v=${APP_VERSION}`);
                    if (krResponse.ok) {
                        const krJsonData = await krResponse.json();
                        data = krJsonData.data || krJsonData;
                        hasKrFallback = true; // 한국어 폴백 사용
                    }
                }
                if (!data) return null;
            }

            // en/jp인 경우 kr 데이터를 로드하여 병합
            if (lang !== 'kr' && data) {
                if (!krData) {
                    const krResponse = await fetch(`${BASE_URL}/apps/synergy/friends/kr/${fileName}.json?v=${APP_VERSION}`);
                    if (krResponse.ok) {
                        const krJsonData = await krResponse.json();
                        krData = krJsonData.data || krJsonData;
                    }
                }

                // kr 데이터가 있으면 dialog 병합
                if (krData) {
                    mergeKrFallbackDialogs(data, krData, lang);
                }
            }

            characterData[cacheKey] = data;
            return characterData[cacheKey];
        } catch (error) {
            console.error(`Error loading data for ${characterName}:`, error);
            return null;
        }
    }

    // item에 mapName이 있는지 확인
    function hasMapName(data) {
        if (!data || !data.item) return false;
        return data.item.some(item => item.shop && item.shop.mapName);
    }

    // kr 데이터의 mapName을 현재 데이터에 병합
    function mergeMapNames(data, krData) {
        if (!data.item || !krData.item) return;
        data.item.forEach((item, index) => {
            if (item.shop && krData.item[index] && krData.item[index].shop && krData.item[index].shop.mapName) {
                if (!item.shop.mapName) {
                    item.shop.mapName = krData.item[index].shop.mapName;
                }
            }
        });
    }

    // kr 데이터의 dialog를 en/jp 데이터에 병합하고 "(패치 예정)" 추가
    function mergeKrFallbackDialogs(data, krData, lang) {
        if (!data || !krData) return;

        const patchPendingText = getI18nText('patchPendingSuffix');

        // 1. advance_dialog 병합
        if (krData.advance_dialog && Array.isArray(krData.advance_dialog)) {
            if (!data.advance_dialog || !Array.isArray(data.advance_dialog)) {
                // advance_dialog가 없으면 kr 데이터 복사
                data.advance_dialog = JSON.parse(JSON.stringify(krData.advance_dialog));
                addPatchPendingToDialog(data.advance_dialog, patchPendingText);
            } else {
                // 일부만 있는 경우, kr에서 추가
                krData.advance_dialog.forEach((krDialog, index) => {
                    if (!data.advance_dialog[index]) {
                        // 해당 인덱스의 dialog가 없으면 kr에서 복사
                        data.advance_dialog[index] = JSON.parse(JSON.stringify(krDialog));
                        addPatchPendingToDialog([data.advance_dialog[index]], patchPendingText);
                    } else if (!data.advance_dialog[index].good_answers ||
                        !Array.isArray(data.advance_dialog[index].good_answers) ||
                        data.advance_dialog[index].good_answers.length === 0) {
                        // good_answers가 없거나 비어있으면 kr에서 복사
                        if (krDialog.good_answers && Array.isArray(krDialog.good_answers)) {
                            data.advance_dialog[index].good_answers = JSON.parse(JSON.stringify(krDialog.good_answers));
                            addPatchPendingToDialog([data.advance_dialog[index]], patchPendingText);
                        }
                    } else {
                        // good_answers가 있지만 일부 choiceGroup이 비어있을 수 있음
                        if (krDialog.good_answers && Array.isArray(krDialog.good_answers)) {
                            krDialog.good_answers.forEach((krChoiceGroup, groupIndex) => {
                                if (!data.advance_dialog[index].good_answers[groupIndex] ||
                                    !Array.isArray(data.advance_dialog[index].good_answers[groupIndex]) ||
                                    data.advance_dialog[index].good_answers[groupIndex].length === 0) {
                                    // 해당 choiceGroup이 없거나 비어있으면 kr에서 복사
                                    if (!data.advance_dialog[index].good_answers[groupIndex]) {
                                        data.advance_dialog[index].good_answers[groupIndex] = [];
                                    }
                                    data.advance_dialog[index].good_answers[groupIndex] = JSON.parse(JSON.stringify(krChoiceGroup));
                                    addPatchPendingToChoices(data.advance_dialog[index].good_answers[groupIndex], patchPendingText);
                                }
                            });
                        }
                    }
                });
            }
        }

        // 2. visit_dialog 병합
        if (krData.visit_dialog && Array.isArray(krData.visit_dialog)) {
            if (!data.visit_dialog || !Array.isArray(data.visit_dialog)) {
                // visit_dialog가 없으면 kr 데이터 복사
                data.visit_dialog = JSON.parse(JSON.stringify(krData.visit_dialog));
                addPatchPendingToVisitDialog(data.visit_dialog, patchPendingText);
            } else {
                // 일부만 있는 경우, kr에서 추가
                krData.visit_dialog.forEach((krVisit, index) => {
                    if (!data.visit_dialog[index]) {
                        // 해당 인덱스의 visit이 없으면 kr에서 복사
                        data.visit_dialog[index] = JSON.parse(JSON.stringify(krVisit));
                        addPatchPendingToVisitDialog([data.visit_dialog[index]], patchPendingText);
                    } else if (!data.visit_dialog[index].good_answers ||
                        !Array.isArray(data.visit_dialog[index].good_answers) ||
                        data.visit_dialog[index].good_answers.length === 0) {
                        // good_answers가 없거나 비어있으면 kr에서 복사
                        if (krVisit.good_answers && Array.isArray(krVisit.good_answers)) {
                            data.visit_dialog[index].good_answers = JSON.parse(JSON.stringify(krVisit.good_answers));
                            addPatchPendingToVisitDialog([data.visit_dialog[index]], patchPendingText);
                        }
                    } else {
                        // good_answers가 있지만 일부 choiceGroup이 비어있을 수 있음
                        if (krVisit.good_answers && Array.isArray(krVisit.good_answers)) {
                            krVisit.good_answers.forEach((krChoiceGroup, groupIndex) => {
                                if (!data.visit_dialog[index].good_answers[groupIndex] ||
                                    !Array.isArray(data.visit_dialog[index].good_answers[groupIndex]) ||
                                    data.visit_dialog[index].good_answers[groupIndex].length === 0) {
                                    // 해당 choiceGroup이 없거나 비어있으면 kr에서 복사
                                    if (!data.visit_dialog[index].good_answers[groupIndex]) {
                                        data.visit_dialog[index].good_answers[groupIndex] = [];
                                    }
                                    data.visit_dialog[index].good_answers[groupIndex] = JSON.parse(JSON.stringify(krChoiceGroup));
                                    addPatchPendingToChoices(data.visit_dialog[index].good_answers[groupIndex], patchPendingText);
                                }
                            });
                        }
                    }
                });
            }
        }

        // 3. romance_dialog 병합
        if (krData.romance_dialog && Array.isArray(krData.romance_dialog)) {
            if (!data.romance_dialog || !Array.isArray(data.romance_dialog)) {
                // romance_dialog가 없으면 kr 데이터 복사
                data.romance_dialog = JSON.parse(JSON.stringify(krData.romance_dialog));
                addPatchPendingToDialog(data.romance_dialog, patchPendingText);
            } else {
                // 일부만 있는 경우, kr에서 추가
                krData.romance_dialog.forEach((krDialog, index) => {
                    if (!data.romance_dialog[index]) {
                        // 해당 인덱스의 dialog가 없으면 kr에서 복사
                        data.romance_dialog[index] = JSON.parse(JSON.stringify(krDialog));
                        addPatchPendingToDialog([data.romance_dialog[index]], patchPendingText);
                    } else if (!data.romance_dialog[index].good_answers ||
                        !Array.isArray(data.romance_dialog[index].good_answers) ||
                        data.romance_dialog[index].good_answers.length === 0) {
                        // good_answers가 없거나 비어있으면 kr에서 복사
                        if (krDialog.good_answers && Array.isArray(krDialog.good_answers)) {
                            data.romance_dialog[index].good_answers = JSON.parse(JSON.stringify(krDialog.good_answers));
                            addPatchPendingToDialog([data.romance_dialog[index]], patchPendingText);
                        }
                    } else {
                        // good_answers가 있지만 일부 choiceGroup이 비어있을 수 있음
                        if (krDialog.good_answers && Array.isArray(krDialog.good_answers)) {
                            krDialog.good_answers.forEach((krChoiceGroup, groupIndex) => {
                                if (!data.romance_dialog[index].good_answers[groupIndex] ||
                                    !Array.isArray(data.romance_dialog[index].good_answers[groupIndex]) ||
                                    data.romance_dialog[index].good_answers[groupIndex].length === 0) {
                                    // 해당 choiceGroup이 없거나 비어있으면 kr에서 복사
                                    if (!data.romance_dialog[index].good_answers[groupIndex]) {
                                        data.romance_dialog[index].good_answers[groupIndex] = [];
                                    }
                                    data.romance_dialog[index].good_answers[groupIndex] = JSON.parse(JSON.stringify(krChoiceGroup));
                                    addPatchPendingToChoices(data.romance_dialog[index].good_answers[groupIndex], patchPendingText);
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    // dialog의 모든 선택지에 "(패치 예정)" 추가
    function addPatchPendingToDialog(dialogs, patchPendingText) {
        if (!dialogs || !Array.isArray(dialogs)) return;
        dialogs.forEach(dialog => {
            if (dialog.good_answers && Array.isArray(dialog.good_answers)) {
                dialog.good_answers.forEach(choiceGroup => {
                    if (Array.isArray(choiceGroup)) {
                        addPatchPendingToChoices(choiceGroup, patchPendingText);
                    }
                });
            }
        });
    }

    // visit_dialog의 모든 선택지에 "(패치 예정)" 추가
    function addPatchPendingToVisitDialog(visits, patchPendingText) {
        if (!visits || !Array.isArray(visits)) return;
        visits.forEach(visit => {
            if (visit.good_answers && Array.isArray(visit.good_answers)) {
                visit.good_answers.forEach(choiceGroup => {
                    if (Array.isArray(choiceGroup)) {
                        addPatchPendingToChoices(choiceGroup, patchPendingText);
                    }
                });
            }
        });
    }

    // 선택지 배열에 "(패치 예정)" 추가
    function addPatchPendingToChoices(choices, patchPendingText) {
        if (!choices || !Array.isArray(choices)) return;
        choices.forEach(choice => {
            if (choice.content) {
                choice.content = choice.content + ' ' + patchPendingText;
            }
        });
    }

    // 필터 함수들은 synergy_search.js로 이동
    // window.synergySearch를 통해 접근

    // 탭 생성 (전역으로 노출 - synergy_search.js에서 사용)
    async function createTabs() {
        const tabsContainer = document.getElementById('characterTabs');
        if (!tabsContainer) return;

        tabsContainer.innerHTML = '';

        // 먼저 각 캐릭터의 time 값을 가져오기
        const characterTimeMap = {};
        const timePromises = Object.keys(characterList).map(async (characterName) => {
            const char = characterList[characterName];
            let characterTime = null;

            try {
                const fileName = encodeURIComponent(characterName);
                // 현재 언어 파일에서 time 가져오기
                const response = await fetch(`${BASE_URL}/apps/synergy/friends/${currentLanguage}/${fileName}.json?v=${APP_VERSION}`);
                if (response.ok) {
                    const jsonData = await response.json();
                    const data = jsonData.data || jsonData;
                    if (data.time) {
                        characterTime = data.time;
                    }
                } else if (currentLanguage !== 'kr') {
                    // 현재 언어 파일이 없으면 kr로 폴백
                    const krResponse = await fetch(`${BASE_URL}/apps/synergy/friends/kr/${fileName}.json?v=${APP_VERSION}`);
                    if (krResponse.ok) {
                        const krJsonData = await krResponse.json();
                        const krData = krJsonData.data || krJsonData;
                        if (krData.time) {
                            characterTime = krData.time;
                        }
                    }
                }
            } catch (e) {
                // 에러 발생 시 무시
            }

            // 캐릭터 JSON 파일의 time이 없으면 friend_num.json의 time/appear로 폴백
            characterTimeMap[characterName] = characterTime || char.time || char.appear || null;
        });

        await Promise.all(timePromises);

        // 각 캐릭터의 이름 정보 수집 (검색용)
        const characterNamesMap = {};
        const namePromises = Object.keys(characterList).map(async (characterName) => {
            const char = characterList[characterName];
            let nameEn = null;
            let nameJp = null;
            let displayName = characterName;

            // friend_num.json에서 가져오기
            if (char) {
                if (char.name_en) nameEn = char.name_en;
                if (char.name_jp) nameJp = char.name_jp;
            }

            // characters.js에서 가져오기
            if (window.characterData && window.characterData[characterName]) {
                const charData = window.characterData[characterName];
                if (!nameEn && charData.name_en) nameEn = charData.name_en;
                if (!nameJp && charData.name_jp) nameJp = charData.name_jp;
            }

            // JSON 파일에서 가져오기 (현재 언어)
            try {
                const fileName = encodeURIComponent(characterName);
                const response = await fetch(`${BASE_URL}/apps/synergy/friends/${currentLanguage}/${fileName}.json?v=${APP_VERSION}`);
                if (response.ok) {
                    const jsonData = await response.json();
                    const data = jsonData.data || jsonData;
                    if (data.name) {
                        displayName = data.name;
                    }
                } else if (currentLanguage !== 'kr') {
                    const krResponse = await fetch(`${BASE_URL}/apps/synergy/friends/kr/${fileName}.json?v=${APP_VERSION}`);
                    if (krResponse.ok) {
                        const krJsonData = await krResponse.json();
                        const krData = krJsonData.data || krJsonData;
                        if (krData.name && !displayName) {
                            displayName = krData.name;
                        }
                    }
                }
            } catch (e) {
                // 에러 무시
            }

            characterNamesMap[characterName] = {
                nameEn: nameEn,
                nameJp: nameJp,
                displayName: displayName
            };
        });

        await Promise.all(namePromises);

        // 처음 로드 시에는 모든 캐릭터를 생성 (필터링 없이)
        // 필터는 나중에 applyFilters()로 적용
        const allCharacters = Object.keys(characterList).filter(name => {
            const char = characterList[name];
            // inactive만 제외
            return !char.inactive;
        });

        const sortedCharacters = allCharacters.sort((a, b) => {
            // num 기준 내림차순, 같으면 이름순
            const numA = characterList[a].num || 0;
            const numB = characterList[b].num || 0;
            if (numB !== numA) return numB - numA;
            return a.localeCompare(b);
        });

        if (sortedCharacters.length === 0) {
            const noResultsText = getI18nText('noResults');
            tabsContainer.innerHTML = `<div style="padding: 20px; text-align: center; color: #999;">${noResultsText}</div>`;
            // 검색 결과가 없으면 선택된 캐릭터도 초기화
            selectedCharacter = null;
            return;
        }

        const wasFirstLoad = !selectedCharacter;
        const previousSelected = selectedCharacter;

        // 각 캐릭터의 JSON을 로드해서 name 가져오기
        const characterNamesPromises = sortedCharacters.map(async (characterName) => {
            const char = characterList[characterName];
            let displayName = characterName;
            let nameAlreadySet = false; // 이름이 이미 설정되었는지 추적

            // friend_num.json에 name_en, name_jp가 있는 경우 예외처리 (최우선)
            if (char) {
                if (currentLanguage === 'en' && char.name_en) {
                    displayName = char.name_en;
                    nameAlreadySet = true;
                } else if (currentLanguage === 'jp' && char.name_jp) {
                    displayName = char.name_jp;
                    nameAlreadySet = true;
                }
            }

            // friend_num.json에 없으면 characters.js에서 name_en, name_jp 사용
            if (!nameAlreadySet && window.characterData && window.characterData[characterName]) {
                const charData = window.characterData[characterName];
                if (currentLanguage === 'en' && charData.name_en) {
                    displayName = charData.name_en;
                    nameAlreadySet = true;
                } else if (currentLanguage === 'jp' && charData.name_jp) {
                    displayName = charData.name_jp;
                    nameAlreadySet = true;
                }
            }

            let characterTime = null;

            try {
                const fileName = encodeURIComponent(characterName);
                // 이름이 아직 설정되지 않았으면 JSON 파일에서 가져오기
                if (!nameAlreadySet) {
                    const response = await fetch(`${BASE_URL}/apps/synergy/friends/${currentLanguage}/${fileName}.json?v=${APP_VERSION}`);
                    if (response.ok) {
                        const jsonData = await response.json();
                        const data = jsonData.data || jsonData;
                        if (data.name) {
                            displayName = data.name;
                        }
                        if (data.time) {
                            characterTime = data.time;
                        }
                    } else if (currentLanguage !== 'kr') {
                        // 현재 언어 파일이 없으면 kr로 폴백 (하지만 name은 가져오지 않음, friend_num.json 우선)
                        const krResponse = await fetch(`${BASE_URL}/apps/synergy/friends/kr/${fileName}.json?v=${APP_VERSION}`);
                        if (krResponse.ok) {
                            const krJsonData = await krResponse.json();
                            const krData = krJsonData.data || krJsonData;
                            // name은 가져오지 않음 (friend_num.json의 name_en/name_jp 우선)
                            if (krData.time) {
                                characterTime = krData.time;
                            }
                        }
                    }
                } else {
                    // 이름은 이미 설정되었으니 time만 JSON에서 가져오기
                    const response = await fetch(`${BASE_URL}/apps/synergy/friends/${currentLanguage}/${fileName}.json?v=${APP_VERSION}`);
                    if (response.ok) {
                        const jsonData = await response.json();
                        const data = jsonData.data || jsonData;
                        if (data.time) {
                            characterTime = data.time;
                        }
                    } else if (currentLanguage !== 'kr') {
                        const krResponse = await fetch(`${BASE_URL}/apps/synergy/friends/kr/${fileName}.json?v=${APP_VERSION}`);
                        if (krResponse.ok) {
                            const krJsonData = await krResponse.json();
                            const krData = krJsonData.data || krJsonData;
                            if (krData.time) {
                                characterTime = krData.time;
                            }
                        }
                    }
                }
            } catch (e) {
                // 에러 발생 시 기본 이름 사용
            }

            // 영어일 경우 띄어쓰기 기준 앞 단어만 표시
            if (currentLanguage === 'en' && displayName.includes(' ')) {
                displayName = displayName.split(' ')[0];
            }
            // 한국어일 경우 띄어쓰기 기준 뒤 단어만 표시
            if (currentLanguage === 'kr' && displayName.includes(' ')) {
                const parts = displayName.split(' ');
                displayName = parts[parts.length - 1];
            }

            return { characterName, displayName, char, characterTime };
        });

        const characterNamesData = await Promise.all(characterNamesPromises);

        characterNamesData.forEach(({ characterName, displayName, char, characterTime }, index) => {
            const tab = document.createElement('div');
            tab.className = 'character-tab';
            tab.dataset.character = characterName;

            // 필터링용 데이터 속성 추가
            const timeValue = characterTime || char.time || char.appear || '';
            tab.dataset.characterTime = timeValue;
            tab.dataset.characterNameKr = characterName;
            // characterNamesMap에서 이름 정보 가져오기
            const nameInfo = characterNamesMap[characterName] || {};
            tab.dataset.characterNameEn = nameInfo.nameEn || '';
            tab.dataset.characterNameJp = nameInfo.nameJp || '';
            tab.dataset.displayName = displayName;

            // 언어 파일 존재 여부 저장 (나중에 사용)
            tab.dataset.hasLanguageFile = 'pending'; // 나중에 확인

            if (index === 0 && wasFirstLoad) {
                tab.classList.add('active');
            } else if (previousSelected === characterName) {
                tab.classList.add('active');
            }

            // img_color가 있으면 face 경로, 없으면 face_black 경로
            const imgFileName = char.img_color || char.img;
            const imgPath = char.img_color ? 'face' : 'face_black';
            const imgSrc = `${BASE_URL}/assets/img/synergy/${imgPath}/${imgFileName}`;

            // time 필드 사용 (캐릭터 JSON 파일의 time 우선, 없으면 friend_num.json의 time/appear로 폴백)
            // timeValue는 위에서 이미 선언됨
            const timeLabel = getTimeLabel(timeValue);

            // recommend 아이콘 추가
            const recommendIconSvg = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="recommend-icon"><path d="M7 0L8.618 4.764L14 5.528L10 9.236L11.236 14L7 11.236L2.764 14L4 9.236L0 5.528L5.382 4.764L7 0Z" fill="currentColor"/></svg>`;
            const recommendTitle = getI18nText('labelRecommend');

            tab.innerHTML = `
                <div class="character-tab-image-wrapper">
                    <img src="${imgSrc}" alt="${characterName}" class="character-tab-image" onerror="this.onerror=null; this.style.display='none';">
                    ${char.recommend ? `<span class="character-tab-recommend character-tab-recommend-mobile" title="${recommendTitle}">${recommendIconSvg}</span>` : ''}
                </div>
                <div class="character-tab-info">
                    <div class="character-tab-name" title="${displayName}">${displayName}</div>
                    <div class="character-tab-time-wrapper">
                        <div class="character-tab-time">${timeLabel}</div>
                        ${char.recommend ? `<span class="character-tab-recommend character-tab-recommend-desktop" title="${recommendTitle}">${recommendIconSvg}</span>` : ''}
                    </div>
                </div>
            `;

            tab.addEventListener('click', () => {
                selectCharacter(characterName, false); // 사용자 클릭 (forceLoad = false)
            });

            tabsContainer.appendChild(tab);
        });

        // 언어 파일 존재 여부 확인 (비동기, 필터링에 사용)
        const languageCheckPromises = sortedCharacters.map(async (characterName) => {
            const tab = document.querySelector(`.character-tab[data-character="${characterName}"]`);
            if (!tab) return;

            const currentLanguage = getCurrentLanguage();
            if (currentLanguage === 'kr') {
                tab.dataset.hasLanguageFile = 'true';
            } else {
                const hasFile = await window.synergySearch?.hasLanguageFile(characterName, currentLanguage) || false;
                tab.dataset.hasLanguageFile = hasFile ? 'true' : 'false';
            }
        });
        await Promise.all(languageCheckPromises);

        // 필터 적용
        applyFilters();

        // 첫 번째 탭이 있고, 이전에 선택된 캐릭터가 없거나 필터링으로 사라진 경우 자동 선택
        const visibleTabs = Array.from(document.querySelectorAll('.character-tab:not([style*="display: none"])'));
        if (visibleTabs.length > 0) {
            if (wasFirstLoad || !previousSelected) {
                const firstTab = visibleTabs[0];
                const firstCharacter = firstTab.dataset.character;
                // 탭이 모두 DOM에 추가된 후에 데이터 로드 (여러 단계로 확실하게)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        selectCharacter(firstCharacter, true); // forceLoad = true로 강제 로드
                    });
                });
            } else if (previousSelected) {
                const previousTab = document.querySelector(`.character-tab[data-character="${previousSelected}"]`);
                if (previousTab && (!previousTab.style.display || previousTab.style.display !== 'none')) {
                    // 이전에 선택된 캐릭터가 여전히 보이면 다시 렌더링
                    requestAnimationFrame(() => {
                        selectCharacter(previousSelected, true);
                    });
                } else {
                    // 이전 선택이 필터링으로 사라졌으면 첫 번째로
                    const firstTab = visibleTabs[0];
                    const firstCharacter = firstTab.dataset.character;
                    requestAnimationFrame(() => {
                        selectCharacter(firstCharacter, true);
                    });
                }
            }
        }
    }

    // 필터 적용 (DOM에서 숨기기/보이기만)
    function applyFilters() {
        const tabs = document.querySelectorAll('.character-tab');
        if (tabs.length === 0) return;

        const currentLanguage = getCurrentLanguage();
        const timeFilter = window.synergySearch?.getCurrentTimeFilter() || 'all';
        const searchQuery = (window.synergySearch?.getCurrentSearchQuery() || '').toLowerCase().trim();
        const showSpoiler = window.synergySearch?.getShowSpoiler() || false;

        tabs.forEach(tab => {
            let shouldShow = true;
            const isSelectedTab = !!selectedCharacter && tab.dataset.character === selectedCharacter;

            // 1. 시간 필터
            if (timeFilter !== 'all') {
                const tabTime = tab.dataset.characterTime || '';
                const normalizedTime = normalizeTimeValue(tabTime);
                if (normalizedTime !== timeFilter) {
                    shouldShow = false;
                }
            }

            // 2. 검색 필터
            if (shouldShow && searchQuery) {
                const nameKr = (tab.dataset.characterNameKr || '').toLowerCase();
                const nameEn = (tab.dataset.characterNameEn || '').toLowerCase();
                const nameJp = (tab.dataset.characterNameJp || '').toLowerCase();
                const displayName = (tab.dataset.displayName || '').toLowerCase();

                if (!nameKr.includes(searchQuery) &&
                    !nameEn.includes(searchQuery) &&
                    !nameJp.includes(searchQuery) &&
                    !displayName.includes(searchQuery)) {
                    shouldShow = false;
                }
            }

            // 3. 언어 필터
            if (shouldShow && currentLanguage !== 'kr' && !showSpoiler) {
                const hasLanguageFile = tab.dataset.hasLanguageFile === 'true';
                // URL로 직접 진입해 선택된 캐릭터는 언어 파일이 없어도 KR 폴백 렌더링을 위해 유지
                if (!hasLanguageFile && !isSelectedTab) {
                    shouldShow = false;
                }
            }

            // 표시/숨김 적용
            tab.style.display = shouldShow ? '' : 'none';
        });

        // 검색 결과가 없을 때 메시지 표시
        const visibleTabs = Array.from(document.querySelectorAll('.character-tab:not([style*="display: none"])'));
        const tabsContainer = document.getElementById('characterTabs');
        if (visibleTabs.length === 0 && tabsContainer) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.style.cssText = 'padding: 20px; text-align: center; color: #999; grid-column: 1 / -1;';
            noResultsDiv.textContent = getI18nText('noResults');

            // 기존 메시지 제거
            const existingMessage = tabsContainer.querySelector('div[style*="padding: 20px"]');
            if (existingMessage) existingMessage.remove();

            tabsContainer.appendChild(noResultsDiv);
        } else {
            // 메시지 제거
            const existingMessage = tabsContainer?.querySelector('div[style*="padding: 20px"]');
            if (existingMessage) existingMessage.remove();
        }
    }

    // applyFilters를 전역으로 노출
    window.applyFilters = applyFilters;

    // 캐릭터 선택 (전역으로 노출)
    async function selectCharacter(characterName, forceLoad = false) {
        if (!forceLoad && selectedCharacter === characterName) return;

        selectedCharacter = characterName;
        hasKrFallback = false; // 초기화

        // 탭 활성화
        document.querySelectorAll('.character-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.character === characterName);
        });

        // URL 파라미터 및 타이틀 업데이트
        await updateURLAndTitle(characterName);

        // 상세 정보 로드 및 표시
        const detailContainer = document.getElementById('characterDetail');
        if (!detailContainer) return;

        const t = window.t || ((k) => k);
        const loadingText = t('msgLoading');
        detailContainer.innerHTML = `<div style="padding: 40px; text-align: center; color: rgba(255,255,255,0.5);">${loadingText}</div>`;

        const data = await loadCharacterData(characterName);
        if (!data) {
            const errorText = t('msgLoadError');
            detailContainer.innerHTML = `<div style="padding: 40px; text-align: center; color: rgba(255,255,255,0.5);">${errorText}</div>`;
            return;
        }

        renderCharacterDetail(characterName, data);

        // 모바일에서 detail까지 자동 스크롤 (초기 로드가 아닐 때만, 즉 사용자 클릭 시에만)
        if (!forceLoad && window.innerWidth <= 768) {
            setTimeout(() => {
                const detailElement = document.getElementById('characterDetail');
                if (detailElement) {
                    detailElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }, 100); // 렌더링 완료를 위한 약간의 지연
        }
    }

    // selectCharacter를 전역으로 노출
    window.selectCharacter = selectCharacter;

    // URL 파라미터 및 타이틀 업데이트
    async function updateURLAndTitle(characterName) {
        // 캐릭터의 코드네임 가져오기 (characters.js에서)
        let charCodeName = characterName.toLowerCase();
        if (characterName === '메로페') {
            charCodeName = 'merope';
        } else if (window.characterData && window.characterData[characterName] && window.characterData[characterName].codename) {
            charCodeName = window.characterData[characterName].codename.toLowerCase();
        }

        // 캐릭터의 표시 이름 가져오기 (타이틀용, JSON 파일에서)
        let displayCharName = characterName;

        if (currentLanguage !== 'kr') {
            try {
                const fileName = encodeURIComponent(characterName);
                // 현재 언어에 맞는 파일 로드
                const response = await fetch(`${BASE_URL}/apps/synergy/friends/${currentLanguage}/${fileName}.json?v=${APP_VERSION}`);
                if (response.ok) {
                    const jsonData = await response.json();
                    const data = jsonData.data || jsonData;
                    if (data.name) {
                        displayCharName = data.name;
                    }
                } else if (currentLanguage === 'jp') {
                    // 일본어 파일이 없을 경우 영어 파일 시도
                    const enResponse = await fetch(`${BASE_URL}/apps/synergy/friends/en/${fileName}.json?v=${APP_VERSION}`);
                    if (enResponse.ok) {
                        const enJson = await enResponse.json();
                        const enData = enJson.data || enJson;
                        if (enData.name) displayCharName = enData.name;
                    }
                }
            } catch (e) {
                // 에러 발생 시 기본 이름(kr) 사용
            }
        }

        // 경로 기반 URL 업데이트 (코드네임 사용)
        const langPrefix = currentLanguage === 'kr' ? '' : `/${currentLanguage}`;
        const newPath = `${langPrefix}/synergy/${charCodeName}/`;
        window.history.pushState({ character: characterName }, '', newPath);

        // 타이틀 업데이트
        const titlePrefix = getI18nText('pageTitleGuidePrefix');
        const titleSuffix = getI18nText('pageTitleSiteSuffix');
        document.title = `${titlePrefix} ${displayCharName} | ${titleSuffix}`;
    }

    // 상세 정보 렌더링
    function renderCharacterDetail(characterName, data) {
        const detailContainer = document.getElementById('characterDetail');
        if (!detailContainer) return;

        const char = characterList[characterName];
        // img_color가 있으면 face 경로, 없으면 face_black 경로
        const imgFileName = char.img_color || char.img;
        const imgPath = char.img_color ? 'face' : 'face_black';
        const imgSrc = `${BASE_URL}/assets/img/synergy/${imgPath}/${imgFileName}`;

        // time 필드 사용 (캐릭터 JSON 파일의 time 우선, 없으면 friend_num.json의 time/appear로 폴백)
        const timeValue = data.time || char.time || char.appear || '';
        const timeLabel = getTimeLabel(timeValue);

        // can_romance 아이콘
        let romanceIcons = '';
        // 쇼키와 카타야마는 can_romance가 true여도 false로 취급
        let canRomance = data.can_romance;
        if (characterName === '쇼키' || characterName === '카타야마') {
            canRomance = false;
        }
        if (canRomance !== undefined) {
            if (characterName === '메로페') {
                romanceIcons = `<img src="${BASE_URL}/assets/img/synergy/dushi-jiangli-coop-MLP.png" alt="romance" class="romance-icon" onerror="this.onerror=null; this.style.display='none';">`;
            } else if (canRomance === true) {
                romanceIcons = `<img src="${BASE_URL}/assets/img/synergy/dushi-jiangli-coop-GF.png" alt="romance" class="romance-icon" onerror="this.onerror=null; this.style.display='none';">
                                <img src="${BASE_URL}/assets/img/synergy/dushi-jiangli-coop-BF.png" alt="romance" class="romance-icon" onerror="this.onerror=null; this.style.display='none';">`;
            } else {
                romanceIcons = `<img src="${BASE_URL}/assets/img/synergy/dushi-jiangli-coop-BF.png" alt="romance" class="romance-icon" onerror="this.onerror=null; this.style.display='none';">`;
            }
        }

        // 한국어 폴백 안내문
        const fallbackNoticeText = getI18nText('msgKrFallbackNotice', '');
        const fallbackNotice = (currentLanguage !== 'kr' && hasKrFallback && fallbackNoticeText) ? `
            <div class="fallback-notice" style="padding: 12px; background: #1e1b1b; border-left: 3px solid #730000; margin-bottom: 20px; border-radius: 4px; user-select: text;">
                ${fallbackNoticeText}
            </div>
        ` : '';

        // 팁 가져오기 (현재 언어에 맞는 팁만, Show Spoiler로 kr 불러올 때도 현재 언어 팁 우선)
        let tipHtml = '';
        if (char) {
            // 현재 언어에 맞는 팁 키
            const tipKey = currentLanguage === 'kr' ? 'tip_kr' :
                currentLanguage === 'en' ? 'tip_en' : 'tip_jp';
            const tip = char[tipKey];
            if (tip) {
                // \n과 줄 맨 앞 -를 리스트로 변환
                let processedTip = tip;
                // 실제 줄바꿈 문자와 \n 문자열 모두 처리
                const lines = tip.split(/\n|\\n/).filter(line => line.trim());
                if (lines.length > 0 && lines.some(line => line.trim().startsWith('-'))) {
                    // 리스트 형식으로 변환
                    const listItems = lines
                        .map(line => {
                            const trimmed = line.trim();
                            if (trimmed.startsWith('-')) {
                                return trimmed.substring(1).trim(); // - 제거
                            }
                            return trimmed;
                        })
                        .filter(item => item.length > 0)
                        .map(item => `<li style="margin-bottom: 4px;">${item}</li>`)
                        .join('');

                    processedTip = `<ul style="margin: 0; padding-left: 20px; list-style-type: disc; color: rgba(255, 255, 255, 0.7);">${listItems}</ul>`;
                } else {
                    // 리스트 형식이 아니면 그대로 표시 (기존 \n을 <br>로 변환)
                    processedTip = tip.replace(/\n|\\n/g, '<br>');
                }

                tipHtml = `
                    <div class="character-tip" style="padding: 12px 16px; background: rgba(0, 0, 0, 0.2); border-left: 3px solid #730000; margin: 0px 0 32px 0; border-radius: 4px; line-height: 1.6; font-size:13px; color: rgba(255, 255, 255, 0.7);">
                        ${processedTip}
                    </div>
                `;
            }
        }

        let html = `
            ${fallbackNotice}
            <div class="detail-header">
                <img src="${imgSrc}" alt="${characterName}" class="detail-header-image" onerror="this.onerror=null; this.style.display='none';">
                <div class="detail-header-info">
                    <h2>${data.name || characterName}</h2>
                    <div class="detail-time-wrapper">
                        <div class="detail-time">${timeLabel}</div>
                        ${romanceIcons}
                    </div>
                </div>
            </div>
        `;

        // 번역 함수
        const t = (key) => window.t ? window.t(key) : key;

        // unlock_cond에 아이콘 추가하는 함수 (텍스트를 아이콘으로 치환)
        function processUnlockCond(unlockCond) {
            if (!unlockCond) return '';

            // 능력치 아이콘 매핑
            const statIcons = [
                { key: 'socialStatProficiency', icon: 'wuwei2-lingqiao.png' },
                { key: 'socialStatKindness', icon: 'wuwei2-titie.png' },
                { key: 'socialStatGuts', icon: 'wuwei2-yongqi.png' },
                { key: 'socialStatCharm', icon: 'wuwei2-meili.png' },
                { key: 'socialStatKnowledge', icon: 'wuwei2-zhishi.png' }
            ];

            let processedText = unlockCond;

            // 각 능력치에 대해 텍스트를 아이콘으로 치환
            for (const statData of statIcons) {
                const altText = getI18nText(statData.key, '');
                const searchTexts = getI18nValuesAllLanguages(statData.key, altText ? [altText] : []);
                const iconHtml = `<img src="${BASE_URL}/assets/img/synergy/${statData.icon}" alt="${altText}" title="${altText}" class="unlock-stat-icon" onerror="this.onerror=null; this.style.display='none';">`;

                searchTexts.forEach(searchText => {
                    const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(^|\\s|>)${escapedText}(?=\\s|$|<)`, 'g');
                    processedText = processedText.replace(regex, `$1${iconHtml}`);
                });
            }

            return processedText;
        }

        // 섹션 chevron SVG
        const chevronSvg = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="section-chevron"><path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        // 0. 사전 퀘스트 (Unlock Quest) - 협력 보상 위에 표시
        if (data.unlock_quest) {
            // localStorage에서 스포일러 해제 여부 확인
            const spoilerKey = `unlockQuestSpoiler_${characterName}`;
            const isSpoilerRevealed = localStorage.getItem(spoilerKey) === '1';
            const spoilerClass = isSpoilerRevealed ? '' : 'spoiler';

            html += `
                <div class="detail-section">
                    <h3 class="detail-section-title">
                        <span>${t('labelUnlockQuest')}</span>
                    </h3>
                    <div class="section-content">
                        <div class="unlock-quest-content ${spoilerClass}" data-character="${characterName}" style="display: flex; flex-direction: column; gap: 8px; padding: 12px 16px; background: rgba(0, 0, 0, 0.2); border-radius: 4px; margin-bottom: 12px; position: relative; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <div class="unlock-quest-name" style="font-weight: 600; color: rgb(255 245 181 / 95%); font-size:14px;">${data.unlock_quest.name || ''}</div>
                                <div class="unlock-quest-details" style="color: rgba(255, 255, 255, 0.8); font-size: 13px; line-height: 1.6;">${data.unlock_quest.details || ''}</div>
                            </div>
                            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); font-style: italic;">${t('labelQuestUnlockNotice')}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // 1. 협력 보상 (Special Award)
        if (data.special_award && data.special_award.length > 0) {
            // recommend_num 가져오기
            const char = characterList[characterName];
            const recommendNums = char && char.recommend_num ? char.recommend_num : [];

            html += `
                <div class="detail-section">
                    <h3 class="detail-section-title collapsible">
                        <span>${t('labelSpecialAward')}</span>
                        ${chevronSvg}
                    </h3>
                    <div class="section-content">
                        <table class="award-table">
                        <thead>
                            <tr>
                                <th>${t('labelRank')}</th>
                                <th class="award-name-header">${t('labelName')}</th>
                                <th class="award-reward-header">${t('labelReward')}</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            data.special_award.forEach(award => {
                // recommend_num에 해당하는 랭크인지 확인
                const isRecommended = recommendNums.includes(award.rank);
                const nameClass = isRecommended ? 'award-name-recommended' : '';

                // 아이콘 이미지 추가
                let nameHtml = award.name;
                if (award.icon) {
                    const iconSrc = `${BASE_URL}/assets/img/synergy/reward/${award.icon}`;
                    nameHtml = `<img src="${iconSrc}" alt="${award.name}" class="award-icon" onerror="this.onerror=null; this.style.display='none';">${award.name}`;
                }

                html += `
                    <tr>
                        <td>${award.rank}</td>
                        <td>
                            <div class="award-name-desktop ${nameClass}">${nameHtml}</div>
                            <div class="award-name-cell">
                                <div class="award-name ${nameClass}">${nameHtml}</div>
                                <div class="award-description">${award.description || '-'}</div>
                            </div>
                        </td>
                        <td class="award-description-desktop">${award.description || '-'}</td>
                    </tr>
                `;
            });
            html += `
                        </tbody>
                    </table>
                    </div>
                </div>
            `;
        }

        // 팁 표시 (협력 보상 아래, 협력 이벤트 위)
        if (tipHtml) {
            html += tipHtml;
        }

        // 2. 협력 이벤트 (Advance Dialog)
        if (data.advance_dialog && data.advance_dialog.length > 0) {
            html += `
                <div class="detail-section">
                    <h3 class="detail-section-title collapsible">
                        <span>${t('labelAdvanceDialog')}</span>
                        ${chevronSvg}
                    </h3>
                    <div class="section-content">
                        <div class="dialog-events-container">
            `;
            data.advance_dialog.forEach(dialog => {
                const rankFrom = dialog.rank_up?.from || 0;
                const rankTo = dialog.rank_up?.to || 0;
                const chevronSvg = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="rank-chevron"><path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                const rankText = rankFrom > 0 && rankTo > 0 ? `<span class="rank-label">Rank ${rankFrom}</span>${chevronSvg}<span class="rank-target">${rankTo}</span>` : '';
                const unlockCond = dialog.unlock_cond ? `<div class="dialog-unlock">${t('labelUnlock')} ${processUnlockCond(dialog.unlock_cond)}</div>` : '';
                const hasChoices = dialog.good_answers && Array.isArray(dialog.good_answers) && dialog.good_answers.length > 0;
                const noChoicesClass = !hasChoices ? 'no-choices' : '';
                html += `
                    <div class="dialog-event">
                        <div class="dialog-rank-header ${noChoicesClass}">
                            ${rankText ? `<div class="dialog-rank">${rankText}</div>` : ''}
                            ${unlockCond}
                        </div>
                        <div class="dialog-choices">
                `;
                if (hasChoices) {
                    dialog.good_answers.forEach((choiceGroup, groupIndex) => {
                        // 해당 그룹의 최대 reward 값 찾기
                        const rewards = choiceGroup.map(choice => choice.reward || 0);
                        const maxReward = Math.max(...rewards);
                        // 최대값이 유일한지 확인 (모든 값이 같으면 노란색 표시 안함)
                        // 단일 선택지인 경우(choiceGroup.length === 1) 노란색 표시 안함
                        const maxRewardCount = rewards.filter(r => r === maxReward).length;
                        const hasUniqueMax = maxRewardCount === 1 && choiceGroup.length > 1;

                        if (dialog.good_answers.length > 1) {
                            html += `<div class="dialog-choice-group" style="margin-bottom: 8px;">`;
                            html += `<div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px;">${t('labelSelect')} ${groupIndex + 1}</div>`;
                        }
                        choiceGroup.forEach((choice, choiceIndex) => {
                            const reward = choice.reward || 0;
                            const isMaxReward = hasUniqueMax && reward === maxReward;
                            const choiceClass = isMaxReward ? 'dialog-choice' : 'dialog-choice low-reward';
                            const choiceNumber = choiceIndex + 1;
                            html += `
                                <div class="${choiceClass}">
                                    <div class="dialog-choice-number ${isMaxReward ? 'max-reward' : ''}">${choiceNumber}.</div>
                                    <div class="dialog-choice-content ${isMaxReward ? 'max-reward' : ''}">${choice.content.replace(/\n/g, '<br>')}</div>
                                    <div class="dialog-choice-reward ${isMaxReward ? 'max-reward' : ''}">${reward}</div>
                                </div>
                            `;
                        });
                        if (dialog.good_answers.length > 1) {
                            html += `</div>`;
                        }
                    });
                }

                // RANK 14→15이고 can_romance가 true인 경우 소울 메이트/절친 표시 추가 (메로페 제외)
                if (rankFrom === 14 && rankTo === 15 && data.can_romance === true && characterName !== '메로페') {
                    html += `<div class="soulmate-indicator-placeholder" data-rank="14-15" data-character="${characterName}"></div>`;
                }

                html += `
                        </div>
                    </div>
                `;
            });
            html += `</div></div></div>`;
        }

        // 3. 도시 이벤트 (Visit Dialog)
        if (data.visit_dialog && data.visit_dialog.length > 0) {
            html += `
                <div class="detail-section">
                    <h3 class="detail-section-title collapsible">
                        <span>${t('labelVisitDialog')}</span>
                        ${chevronSvg}
                    </h3>
                    <div class="section-content">
                        <div class="dialog-events-container">
            `;
            data.visit_dialog.forEach(visit => {
                // destination 번역
                const destinationText = translateMapName(visit.destination);
                // destination 이미지 가져오기
                const destinationImage = getMapImage(visit.destination);
                const destinationImageHtml = destinationImage ?
                    `<img src="${destinationImage}" alt="${destinationText}" class="visit-destination-image" onerror="this.onerror=null; this.style.display='none';">` : '';

                html += `
                    <div class="visit-dialog">
                        <div class="visit-destination">
                            ${destinationImageHtml}
                            <span>${destinationText}</span>
                        </div>
                        <div class="dialog-choices">
                `;
                if (visit.good_answers && Array.isArray(visit.good_answers)) {
                    visit.good_answers.forEach(choiceGroup => {
                        // 해당 그룹의 최대 reward 값 찾기
                        const rewards = choiceGroup.map(choice => choice.reward || 0);
                        const maxReward = Math.max(...rewards);
                        // 최대값이 유일한지 확인 (모든 값이 같으면 노란색 표시 안함)
                        // 단일 선택지인 경우(choiceGroup.length === 1) 노란색 표시 안함
                        const maxRewardCount = rewards.filter(r => r === maxReward).length;
                        const hasUniqueMax = maxRewardCount === 1 && choiceGroup.length > 1;

                        choiceGroup.forEach((choice, choiceIndex) => {
                            const reward = choice.reward || 0;
                            const isMaxReward = hasUniqueMax && reward === maxReward;
                            const choiceClass = isMaxReward ? 'dialog-choice' : 'dialog-choice low-reward';
                            const choiceNumber = choiceIndex + 1;
                            html += `
                                <div class="${choiceClass}">
                                    <div class="dialog-choice-number ${isMaxReward ? 'max-reward' : ''}">${choiceNumber}.</div>
                                    <div class="dialog-choice-content ${isMaxReward ? 'max-reward' : ''}">${choice.content.replace(/\n/g, '<br>')}</div>
                                    <div class="dialog-choice-reward ${isMaxReward ? 'max-reward' : ''}">${reward}</div>
                                </div>
                            `;
                        });
                    });
                }
                html += `
                        </div>
                    </div>
                `;
            });
            html += `</div></div></div>`;
        }

        // 4. 기타 이벤트 (Romance Dialog)
        if (data.romance_dialog && data.romance_dialog.length > 0) {
            html += `
                <div class="detail-section">
                    <h3 class="detail-section-title collapsible">
                        <span>${t('labelRomanceDialog')}</span>
                        ${chevronSvg}
                    </h3>
                    <div class="section-content">
                        <div class="dialog-events-container">
            `;
            data.romance_dialog.forEach(dialog => {
                html += `
                    <div class="dialog-event">
                        <div class="dialog-choices">
                `;
                if (dialog.good_answers && Array.isArray(dialog.good_answers)) {
                    dialog.good_answers.forEach((choiceGroup, groupIndex) => {
                        // 해당 그룹의 최대 reward 값 찾기
                        const rewards = choiceGroup.map(choice => choice.reward || 0);
                        const maxReward = Math.max(...rewards);
                        // 최대값이 유일한지 확인 (모든 값이 같으면 노란색 표시 안함)
                        // 단일 선택지인 경우(choiceGroup.length === 1) 노란색 표시 안함
                        const maxRewardCount = rewards.filter(r => r === maxReward).length;
                        const hasUniqueMax = maxRewardCount === 1 && choiceGroup.length > 1;

                        if (dialog.good_answers.length > 1) {
                            html += `<div class="dialog-choice-group" style="margin-bottom: 8px;">`;
                            html += `<div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px;">${t('labelSelect')} ${groupIndex + 1}</div>`;
                        }
                        choiceGroup.forEach((choice, choiceIndex) => {
                            const reward = choice.reward || 0;
                            const isMaxReward = hasUniqueMax && reward === maxReward;
                            const choiceClass = isMaxReward ? 'dialog-choice' : 'dialog-choice low-reward';
                            const choiceNumber = choiceIndex + 1;
                            html += `
                                <div class="${choiceClass}">
                                    <div class="dialog-choice-number ${isMaxReward ? 'max-reward' : ''}">${choiceNumber}.</div>
                                    <div class="dialog-choice-content ${isMaxReward ? 'max-reward' : ''}">${choice.content.replace(/\n/g, '<br>')}</div>
                                    <div class="dialog-choice-reward ${isMaxReward ? 'max-reward' : ''}">${reward}</div>
                                </div>
                            `;
                        });
                        if (dialog.good_answers.length > 1) {
                            html += `</div>`;
                        }
                    });
                }
                html += `
                        </div>
                    </div>
                `;
            });
            html += `</div></div></div>`;
        }

        // 5. 선호 선물 (Item)
        if (data.item && data.item.length > 0) {
            // 원본 데이터 저장 (정렬 전)
            const originalItems = [...data.item];

            // shop이 배열인 경우 각 shop을 별도 항목으로 확장
            const expandedItems = [];
            data.item.forEach((item, index) => {
                const synergy = item.synergy || 0;
                const bonusSynergy = item.bonus_synergy || 0;
                const totalSynergy = synergy + bonusSynergy;

                // shop이 배열인지 확인
                if (Array.isArray(item.shop) && item.shop.length > 0) {
                    // shop 배열의 각 항목에 대해 별도 항목 생성
                    item.shop.forEach((shop, shopIndex) => {
                        const price = shop.price || 0;
                        const moneyName = shop.moneyName || '';
                        const isCash = isCashCurrency(moneyName);
                        const efficiency = (isCash && totalSynergy > 0) ? Math.round(price / totalSynergy) : null;

                        expandedItems.push({
                            ...item,
                            shop: shop, // 단일 shop 객체로 교체
                            _originalIndex: index,
                            _shopIndex: shopIndex,
                            _totalSynergy: totalSynergy,
                            _price: price,
                            _discountPrice: shop.discountPrice || price,
                            _efficiency: efficiency
                        });
                    });
                } else {
                    // shop이 객체이거나 없는 경우 기존 로직
                    const shop = item.shop || {};
                    const price = shop.price || 0;
                    const moneyName = shop.moneyName || '';
                    const isCash = isCashCurrency(moneyName);
                    const efficiency = (isCash && totalSynergy > 0) ? Math.round(price / totalSynergy) : null;

                    expandedItems.push({
                        ...item,
                        _originalIndex: index,
                        _shopIndex: 0,
                        _totalSynergy: totalSynergy,
                        _price: price,
                        _discountPrice: shop.discountPrice || price,
                        _efficiency: efficiency
                    });
                }
            });

            // 재귀적으로 계산한 가격으로 효율 재계산
            if (window.buildItemTree && window.calculateItemPrice) {
                expandedItems.forEach((item) => {
                    try {
                        const itemTree = window.buildItemTree(item);
                        const calculatedPrice = window.calculateItemPrice(itemTree);

                        // 계산된 가격이 있고 호감도가 있으면 효율 재계산
                        if (calculatedPrice !== null && calculatedPrice > 0) {
                            const synergy = item.synergy || 0;
                            const bonusSynergy = item.bonus_synergy || 0;
                            const totalSynergy = item._totalSynergy || synergy + bonusSynergy;
                            if (totalSynergy > 0) {
                                item._efficiency = Math.round(calculatedPrice / totalSynergy);
                            }
                        }
                    } catch (e) {
                        console.warn('효율 재계산 중 오류:', e);
                    }
                });
            }

            // 호감도 기준 내림차순 정렬 (기본 정렬)
            const itemsWithEfficiency = expandedItems.sort((a, b) => {
                return b._totalSynergy - a._totalSynergy;
            });

            // 효율과 호감도 값 수집 (색상 계산용)
            const efficiencyValues = [];
            const synergyValues = [];

            itemsWithEfficiency.forEach((item) => {
                if (item._efficiency !== null && item._efficiency !== -1) {
                    efficiencyValues.push(item._efficiency);
                }
                const synergy = item.synergy || 0;
                const bonusSynergy = item.bonus_synergy || 0;
                const totalSynergy = synergy + bonusSynergy;
                if (totalSynergy > 0) {
                    synergyValues.push(totalSynergy);
                }
            });

            // 사분위수 계산 함수
            function getQuartiles(values) {
                if (values.length === 0) return { q1: 0, q3: 0, min: 0, max: 0 };

                const sorted = [...values].sort((a, b) => a - b);
                const min = sorted[0];
                const max = sorted[sorted.length - 1];

                const q1Index = Math.floor(sorted.length * 0.25);
                const q3Index = Math.floor(sorted.length * 0.75);
                const q1 = sorted[q1Index] || min;
                const q3 = sorted[q3Index] || max;

                return { q1, q3, min, max };
            }

            const efficiencyQuartiles = getQuartiles(efficiencyValues);
            const synergyQuartiles = getQuartiles(synergyValues);

            // 효율 색상 계산 함수 (낮을수록 진하게, 사분위수 기반)
            function getEfficiencyColor(efficiency, quartiles) {
                if (efficiency === null || efficiency === -1) {
                    return '#999'; // 기본 회색
                }

                const { q1, q3, min, max } = quartiles;
                if (min === max) return '#4caf50'; // 모두 같으면 초록

                let normalized;
                if (efficiency <= q1) {
                    // 하위 25%: 0.75 ~ 1.0 (진한 초록)
                    normalized = 0.75 + 0.25 * (1 - (efficiency - min) / (q1 - min || 1));
                } else if (efficiency <= q3) {
                    // 중간 50%: 0.25 ~ 0.75 (중간 색)
                    normalized = 0.25 + 0.5 * (1 - (efficiency - q1) / (q3 - q1 || 1));
                } else {
                    // 상위 25%: 0.0 ~ 0.25 (연한 회색)
                    normalized = 0.25 * (1 - (efficiency - q3) / (max - q3 || 1));
                }

                // 초록색(#4caf50)에서 회색(#999)으로 그라데이션
                const r1 = 0x4c, g1 = 0xaf, b1 = 0x50; // 초록
                const r2 = 0x99, g2 = 0x99, b2 = 0x99; // 회색

                const r = Math.round(r1 + (r2 - r1) * (1 - normalized));
                const g = Math.round(g1 + (g2 - g1) * (1 - normalized));
                const b = Math.round(b1 + (b2 - b1) * (1 - normalized));

                return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            }

            // 호감도 색상 계산 함수 (높을수록 진하게, 사분위수 기반)
            function getSynergyColor(synergy, quartiles) {
                if (synergy <= 0) {
                    return '#999'; // 기본 회색
                }

                const { q1, q3, min, max } = quartiles;
                if (min === max) return '#4caf50'; // 모두 같으면 초록

                let normalized;
                if (synergy >= q3) {
                    // 상위 25%: 0.75 ~ 1.0 (진한 초록)
                    normalized = 0.75 + 0.25 * ((synergy - q3) / (max - q3 || 1));
                } else if (synergy >= q1) {
                    // 중간 50%: 0.25 ~ 0.75 (중간 색)
                    normalized = 0.25 + 0.5 * ((synergy - q1) / (q3 - q1 || 1));
                } else {
                    // 하위 25%: 0.0 ~ 0.25 (연한 회색)
                    normalized = 0.25 * ((synergy - min) / (q1 - min || 1));
                }

                // 회색(#999)에서 초록색(#4caf50)으로 그라데이션
                const r1 = 0x99, g1 = 0x99, b1 = 0x99; // 회색
                const r2 = 0x4c, g2 = 0xaf, b2 = 0x50; // 초록

                const r = Math.round(r1 + (r2 - r1) * normalized);
                const g = Math.round(g1 + (g2 - g1) * normalized);
                const b = Math.round(b1 + (b2 - b1) * normalized);

                return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            }

            html += `
                <div class="detail-section">
                    <h3 class="detail-section-title collapsible">
                        <span>${t('labelItem')}</span>
                        ${chevronSvg}
                    </h3>
                    <div class="section-content">
                        <table class="item-table">
                        <thead>
                            <tr>
                                <th class="item-name-header">${t('labelName')}</th>
                                <th>${t('labelSynergy')}</th>
                                <th>${t('labelFirstGift')}</th>
                                <th class="item-price-header">${t('labelPrice')}</th>
                                <th>${t('labelEfficiency')}</th>
                                <th>${t('labelDiscount')}</th>
                                <th class="item-source-header">${t('labelSource')}</th>
                                <th>${t('labelMax')}</th>
                                <th>${t('labelReset')}</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            itemsWithEfficiency.forEach((item) => {
                const synergy = item.synergy || 0;
                const bonusSynergy = item.bonus_synergy || 0;
                const newGiftSynergy = item.new_gift_synergy || 0;
                const totalSynergy = item._totalSynergy || synergy + bonusSynergy;
                const firstGiftSynergy = synergy + bonusSynergy + newGiftSynergy;

                // shop 정보 처리
                const shop = item.shop || {};
                let price = item._price !== undefined ? item._price : (shop.price || 0);
                const discountPrice = item._discountPrice !== undefined ? item._discountPrice : (shop.discountPrice || price);
                const moneyName = shop.moneyName || '';
                const isCash = isCashCurrency(moneyName);

                // 재귀적으로 계산한 가격 (현금 가치)
                let calculatedPrice = null;
                if (window.buildItemTree && window.calculateItemPrice) {
                    try {
                        const itemTree = window.buildItemTree(item);
                        calculatedPrice = window.calculateItemPrice(itemTree);
                        // 계산된 가격이 있으면 그 가격 사용
                        if (calculatedPrice !== null && calculatedPrice > 0) {
                            price = calculatedPrice;
                        }
                    } catch (e) {
                        console.warn('가격 계산 중 오류:', e);
                    }
                }

                // 효율 계산 (계산된 가격이 있으면 그 가격으로, 없으면 기존 로직)
                let efficiency = item._efficiency !== null ? item._efficiency : null;
                if (efficiency === null) {
                    if (calculatedPrice !== null && calculatedPrice > 0 && totalSynergy > 0) {
                        // 재귀적으로 계산한 가격으로 효율 계산
                        efficiency = Math.round(calculatedPrice / totalSynergy);
                    } else if (isCash && totalSynergy > 0) {
                        // 기존 로직: 현금이고 호감도가 있으면 효율 계산
                        efficiency = Math.round(price / totalSynergy);
                    }
                }

                const efficiencyText = efficiency !== null ? efficiency : '-';
                const efficiencyColor = getEfficiencyColor(efficiency !== null ? efficiency : -1, efficiencyQuartiles);
                const synergyColor = getSynergyColor(totalSynergy, synergyQuartiles);

                // moneyName 아이콘 가져오기
                const moneyIcon = getMoneyIcon(moneyName, shop);

                // 가격 표시 (moneyName을 아이콘으로 대체, 아이콘을 숫자 앞에)
                // 계산된 가격이 있으면 그 가격 표시, 없으면 shop 가격 표시
                let priceText = '-';
                let displayPrice = calculatedPrice !== null && calculatedPrice > 0 ? calculatedPrice : price;
                if (displayPrice > 0) {
                    // 계산된 가격인 경우 현금 아이콘 사용
                    if (calculatedPrice !== null && calculatedPrice > 0) {
                        const cashAlt = getI18nText('moneyCash');
                        const cashIcon = `<img src="${BASE_URL}/assets/img/item-little-icon/item-huobi-22.png" alt="${cashAlt}" class="money-icon" style="height: 16px; width: auto; vertical-align: middle;" onerror="this.onerror=null; this.style.display='none';">`;
                        priceText = `${cashIcon} ${Math.round(displayPrice).toLocaleString()}`;
                    } else if (moneyIcon) {
                        priceText = `${moneyIcon} ${displayPrice.toLocaleString()}`;
                    } else {
                        priceText = `${displayPrice.toLocaleString()} ${moneyName}`;
                    }
                }

                // 할인가 표시 (moneyName을 아이콘으로 대체, 아이콘을 숫자 앞에)
                let discountText = '-';
                let discountTooltipHtml = null; // 할인 조건 툴팁 HTML (아이콘 포함)
                if (discountPrice < price && discountPrice > 0) {
                    if (moneyIcon) {
                        discountText = `${moneyIcon} ${discountPrice.toLocaleString()}`;
                    } else {
                        discountText = `${discountPrice.toLocaleString()} ${moneyName}`;
                    }

                    // 할인 조건이 있으면 툴팁 HTML 생성 (아이콘 포함)
                    if (shop.reducePriceCond) {
                        // "도겐자카 루우나 LV.1" 같은 형식에서 LV 부분만 추출
                        const lvMatch = shop.reducePriceCond.match(/LV\.?\s*\d+/i);
                        const lvText = lvMatch ? lvMatch[0] : shop.reducePriceCond;
                        discountTooltipHtml = `<span class="item-condition-wrapper"><img src="${BASE_URL}/assets/img/synergy/item-500218.png" alt="할인 조건" class="item-condition-icon" onerror="this.onerror=null; this.style.display='none';">${lvText}</span>`;
                    }
                }

                // 할인가 옆에 ? 아이콘 추가 (할인 조건이 있을 때만)
                let discountIconHtml = '';
                if (discountTooltipHtml) {
                    discountIconHtml = `
                        <span class="discount-tooltip-icon" data-discount-tooltip-html="${discountTooltipHtml.replace(/"/g, '&quot;').replace(/'/g, '&#39;')}">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="6" cy="6" r="5.5" stroke="rgba(255, 255, 255, 0.3)" stroke-width="1.2" fill="none"/>
                                <text x="6" y="8.5" text-anchor="middle" font-size="8" font-weight="bold" fill="rgba(255, 255, 255, 0.3)">?</text>
                            </svg>
                        </span>
                    `;
                }

                // 획득처 (item_from.js 사용, compound 우선)
                let sourceText = '-';
                let sourceIconHtml = '';

                // item_from.js의 generateSourceText 함수 사용
                if (window.generateSourceText) {
                    const generatedText = window.generateSourceText(item);
                    if (generatedText && generatedText !== '-') {
                        sourceText = generatedText;
                        // compound나 seed인 경우 아이콘 추가 및 클릭 가능하게 설정
                        if (item.source && (item.source.includes('compound') || item.source.includes('seed'))) {
                            const itemDataAttr = JSON.stringify(item).replace(/'/g, '&#39;');
                            sourceIconHtml = `
                                <span class="item-source-icon" data-item-source='${itemDataAttr}'>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 1L9 5L13 6L9 7L7 11L5 7L1 6L5 5L7 1Z" stroke="rgba(255, 255, 255, 0.5)" stroke-width="1.2" fill="none"/>
                                    </svg>
                                </span>
                            `;
                            // 조합식 텍스트도 클릭 가능하게 설정
                            sourceText = `<span class="item-source-text-clickable" data-item-source='${itemDataAttr}'>${sourceText}</span>`;
                        }
                    } else if (generatedText === null) {
                        // null이면 기존 shop 로직 사용
                        if (shop.mapName || shop.shopName) {
                            const parts = [];
                            // 게임 센터 관련 moneyName인 경우 mapName 오버라이드
                            if (isArcadeCurrency(moneyName)) {
                                parts.push(t('labelMapAkihabaraArcade'));
                            } else if (shop.mapName) {
                                parts.push(translateMapName(shop.mapName));
                            }
                            if (shop.shopName) {
                                // 'AAAAAA==' 제거
                                let shopName = shop.shopName.replace(/AAAAAA==/g, '').trim();
                                if (shopName) {
                                    parts.push(shopName);
                                }
                            }
                            sourceText = parts.join(' ').trim();
                            if (!sourceText) sourceText = '-';
                        }
                    }
                } else {
                    // item_from.js가 로드되지 않은 경우 기존 로직 사용
                    if (shop.mapName || shop.shopName) {
                        const parts = [];
                        // 게임 센터 관련 moneyName인 경우 mapName 오버라이드
                        if (isArcadeCurrency(moneyName)) {
                            parts.push(t('labelMapAkihabaraArcade'));
                        } else if (shop.mapName) {
                            parts.push(translateMapName(shop.mapName));
                        }
                        if (shop.shopName) {
                            // 'AAAAAA==' 제거
                            let shopName = shop.shopName.replace(/AAAAAA==/g, '').trim();
                            if (shopName) {
                                parts.push(shopName);
                            }
                        }
                        sourceText = parts.join(' ').trim();
                        if (!sourceText) sourceText = '-';
                    }
                }

                // 최대 개수 (-1이면 '-'로 표시)
                const maxBuyText = (shop.maxBuy !== undefined && shop.maxBuy !== null && shop.maxBuy !== -1) ? shop.maxBuy : '-';

                // 갱신 (resetType 번역)
                const resetTypeText = translateResetType(shop.resetType);

                // 아이템 이미지
                const itemImage = item.image ? `<img src="${BASE_URL}/assets/img/synergy/item/${item.image}" alt="${item.name}" class="item-image" onerror="this.onerror=null; this.style.display='none';">` : '';

                // 모바일용 이름 셀 (이름 + 가격 · 획득처)
                const itemNameMobileHtml = `
                    <div class="item-name-cell">
                        <div class="item-name-row">${itemImage}${item.name}</div>
                        <div class="item-meta-row">
                            <span class="item-price-meta">${priceText}</span>
                            <span class="item-meta-separator">·</span>
                            <span class="item-source-meta">${sourceText}${sourceIconHtml}</span>
                        </div>
                    </div>
                `;

                html += `
                    <tr data-original-index="${item._originalIndex}" data-shop-index="${item._shopIndex || 0}">
                        <td>
                            <div class="item-name-desktop">${itemImage}${item.name}</div>
                            ${itemNameMobileHtml}
                        </td>
                        <td style="color: ${synergyColor};">${totalSynergy}</td>
                        <td style="color: ${synergyColor};">${firstGiftSynergy}</td>
                        <td class="item-price-desktop">${priceText}</td>
                        <td class="item-efficiency" style="color: ${efficiencyColor};">${efficiencyText}</td>
                        <td>
                            <div class="discount-cell">${discountText}${discountIconHtml}</div>
                        </td>
                        <td class="item-source-desktop">
                            <span class="item-source-text">${sourceText}</span>${sourceIconHtml}
                        </td>
                        <td>${maxBuyText}</td>
                        <td>${resetTypeText}</td>
                    </tr>
                `;
            });
            html += `
                        </tbody>
                    </table>
                    </div>
                </div>
            `;

            // 할인 조건 툴팁 초기화
            if (window.initDiscountTooltips) {
                setTimeout(() => {
                    window.initDiscountTooltips();
                }, 0);
            }

            // 획득처 아이콘 클릭 이벤트 초기화
            setTimeout(() => {
                setupItemSourceIcons();
            }, 0);
        }

        detailContainer.innerHTML = html;

        // 소울 메이트 표시 추가 (soulmate.js가 로드된 경우)
        if (window.addSoulmateIndicator) {
            setTimeout(() => {
                window.addSoulmateIndicator();
            }, 0);
        }

        // 섹션 접기/펼치기 기능 초기화
        setupSectionCollapse();

        // 사전 퀘스트 스포일러 클릭 이벤트 설정
        setupUnlockQuestSpoiler();

        // 모바일에서 헤더 텍스트 변경
        if (window.innerWidth <= 768) {
            const awardNameHeader = detailContainer.querySelector('.award-name-header');
            if (awardNameHeader) {
                awardNameHeader.textContent = t('mobileHeaderNameReward');
            }

            const itemNameHeader = detailContainer.querySelector('.item-name-header');
            if (itemNameHeader) {
                itemNameHeader.textContent = t('mobileHeaderNamePriceSource');
            }
        }
    }

    // 전역으로 노출 (synergy_search.js에서 사용)
    window.createTabs = createTabs;

    // 획득처 아이콘 및 텍스트 클릭 이벤트 설정
    function setupItemSourceIcons() {
        const detailContainer = document.getElementById('characterDetail');
        if (!detailContainer) return;

        // 이벤트 위임 사용 (아이콘과 텍스트 모두 처리)
        detailContainer.addEventListener('click', (e) => {
            const icon = e.target.closest('.item-source-icon');
            const text = e.target.closest('.item-source-text-clickable');
            const clickableElement = icon || text;

            if (!clickableElement) return;

            try {
                const itemDataStr = clickableElement.getAttribute('data-item-source');
                if (!itemDataStr) return;

                // HTML 엔티티 디코딩
                const decodedStr = itemDataStr.replace(/&#39;/g, "'");
                const item = JSON.parse(decodedStr);

                if (window.showItemFromModal) {
                    window.showItemFromModal(item);
                }
            } catch (error) {
                console.error('획득처 모달 표시 중 오류:', error);
            }
        });
    }

    // 사전 퀘스트 스포일러 클릭 이벤트
    function setupUnlockQuestSpoiler() {
        const unlockQuestContent = document.querySelector('.unlock-quest-content.spoiler');
        if (!unlockQuestContent) return;

        unlockQuestContent.addEventListener('click', function (e) {
            if (this.classList.contains('spoiler')) {
                e.preventDefault();
                e.stopPropagation();
                const characterName = this.dataset.character;
                if (characterName) {
                    // localStorage에 해제 상태 저장
                    const spoilerKey = `unlockQuestSpoiler_${characterName}`;
                    localStorage.setItem(spoilerKey, '1');
                }
                this.classList.remove('spoiler');
                this.dataset.spoilerRevealed = '1';
            }
        });
    }

    // 섹션 접기/펼치기 기능
    function setupSectionCollapse() {
        const detailContainer = document.getElementById('characterDetail');
        if (!detailContainer) return;

        // 이미 리스너가 추가되었는지 확인
        if (detailContainer.dataset.collapseListenerAdded === 'true') {
            // 리스너는 이미 추가되어 있으므로, 새로 생성된 제목들에만 커서 스타일 적용
            const collapsibleTitles = detailContainer.querySelectorAll('.detail-section-title.collapsible');
            collapsibleTitles.forEach(title => {
                title.style.cursor = 'pointer';
            });
            return;
        }

        detailContainer.dataset.collapseListenerAdded = 'true';

        // 이벤트 위임 사용: detailContainer에 한 번만 리스너 추가
        detailContainer.addEventListener('click', (e) => {
            // 사전 퀘스트 스포일러 클릭 처리 (먼저 처리)
            const spoilerContent = e.target.closest('.unlock-quest-content.spoiler');
            if (spoilerContent) {
                e.preventDefault();
                e.stopPropagation();
                const characterName = spoilerContent.dataset.character;
                if (characterName) {
                    // localStorage에 해제 상태 저장
                    const spoilerKey = `unlockQuestSpoiler_${characterName}`;
                    localStorage.setItem(spoilerKey, '1');
                }
                spoilerContent.classList.remove('spoiler');
                spoilerContent.dataset.spoilerRevealed = '1';
                return;
            }

            // 클릭된 요소가 collapsible 제목이나 그 자식 요소인지 확인
            let title = e.target.closest('.detail-section-title.collapsible');

            // chevron SVG나 span을 클릭한 경우도 처리
            if (!title && (e.target.classList.contains('section-chevron') || e.target.closest('.section-chevron'))) {
                title = e.target.closest('.section-chevron')?.closest('.detail-section-title.collapsible');
            }

            if (!title) return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // 해당 제목이 속한 섹션만 찾기 (직접 부모만)
            const section = title.parentElement;
            if (!section || !section.classList.contains('detail-section')) {
                // parentElement가 detail-section이 아니면 closest 사용
                const foundSection = title.closest('.detail-section');
                if (!foundSection) return;
                toggleSection(foundSection, title);
                return;
            }

            toggleSection(section, title);
        });

        // 섹션 토글 함수 (재사용)
        function toggleSection(section, title) {
            const content = section.querySelector(':scope > .section-content');
            if (!content) return;

            const chevron = title.querySelector('.section-chevron');
            const isCollapsed = section.classList.contains('collapsed');

            if (isCollapsed) {
                section.classList.remove('collapsed');
                if (chevron) {
                    chevron.style.transform = 'rotate(90deg)'; // 아래 방향 (펼침)
                }
            } else {
                section.classList.add('collapsed');
                if (chevron) {
                    chevron.style.transform = 'rotate(-90deg)'; // 위 방향 (접힘)
                }
            }
        }

        // 모든 collapsible 제목에 커서 스타일 적용
        const collapsibleTitles = detailContainer.querySelectorAll('.detail-section-title.collapsible');
        collapsibleTitles.forEach(title => {
            title.style.cursor = 'pointer';
        });
    }

    // 아이템 테이블 정렬 기능
    function setupItemTableSorting() {
        const table = document.querySelector('.item-table');
        if (!table) return;

        const sortableHeaders = table.querySelectorAll('th.sortable');
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        let currentSort = {
            column: 'synergy',
            direction: 'desc' // 기본값: 호감도 내림차순 (인디케이터 표시 안 함)
        };

        // 정렬 인디케이터 업데이트
        function updateSortIndicators() {
            sortableHeaders.forEach(header => {
                const indicator = header.querySelector('.sort-indicator');
                const sortType = header.dataset.sort;
                if (sortType === currentSort.column) {
                    indicator.textContent = currentSort.direction === 'asc' ? ' ↑' : ' ↓';
                    header.classList.add('sorted');
                } else {
                    indicator.textContent = '';
                    header.classList.remove('sorted');
                }
            });
        }

        // 초기 정렬 인디케이터 설정 (기본 정렬은 표시 안 함)
        // updateSortIndicators(); // 기본 정렬이므로 인디케이터 표시 안 함

        // 정렬 함수
        function sortTable(sortType) {
            const rows = Array.from(tbody.querySelectorAll('tr'));

            // 같은 컬럼 클릭 시 방향 토글, 다른 컬럼 클릭 시 내림차순으로 시작
            if (currentSort.column === sortType) {
                if (currentSort.direction === 'desc') {
                    currentSort.direction = 'asc';
                } else if (currentSort.direction === 'asc') {
                    currentSort.direction = 'original';
                } else {
                    currentSort.direction = 'desc';
                }
            } else {
                currentSort.column = sortType;
                currentSort.direction = 'desc';
            }

            if (currentSort.direction === 'original') {
                // 원래 순서로 복원 (data-original-index와 data-shop-index 기준)
                rows.sort((a, b) => {
                    const aOriginalIdx = parseInt(a.dataset.originalIndex || '0');
                    const bOriginalIdx = parseInt(b.dataset.originalIndex || '0');
                    if (aOriginalIdx !== bOriginalIdx) {
                        return aOriginalIdx - bOriginalIdx;
                    }
                    const aShopIdx = parseInt(a.dataset.shopIndex || '0');
                    const bShopIdx = parseInt(b.dataset.shopIndex || '0');
                    return aShopIdx - bShopIdx;
                });
                rows.forEach(row => tbody.appendChild(row));
            } else {
                // 정렬 수행 (rowspan이 있는 경우를 고려)
                rows.sort((a, b) => {
                    let aVal, bVal;

                    // rowspan이 있는 경우 첫 번째 셀의 값을 사용
                    const getCellValue = (row, cellIndex) => {
                        const cell = row.cells[cellIndex];
                        if (!cell) return '';
                        // rowspan이 있는 경우 해당 셀의 값을 반환
                        return cell.textContent?.trim() || '';
                    };

                    if (sortType === 'synergy') {
                        const aText = getCellValue(a, 1);
                        const bText = getCellValue(b, 1);
                        aVal = aText === '-' ? -1 : parseFloat(aText) || -1;
                        bVal = bText === '-' ? -1 : parseFloat(bText) || -1;
                    } else if (sortType === 'efficiency') {
                        const aCell = a.querySelector('.item-efficiency');
                        const bCell = b.querySelector('.item-efficiency');
                        const aText = aCell?.textContent?.trim() || '';
                        const bText = bCell?.textContent?.trim() || '';
                        aVal = aText === '-' ? -1 : parseFloat(aText) || -1;
                        bVal = bText === '-' ? -1 : parseFloat(bText) || -1;
                    } else if (sortType === 'price') {
                        const aText = getCellValue(a, 2);
                        const bText = getCellValue(b, 2);
                        aVal = aText === '-' ? -1 : parseFloat(aText.replace(/[^\d.]/g, '')) || -1;
                        bVal = bText === '-' ? -1 : parseFloat(bText.replace(/[^\d.]/g, '')) || -1;
                    } else if (sortType === 'discount') {
                        // 할인가 셀의 .discount-cell 내부 텍스트를 가져옴 (아이콘 제외)
                        const aCell = a.querySelector('.discount-cell');
                        const bCell = b.querySelector('.discount-cell');
                        let aText = aCell?.textContent?.trim() || '';
                        let bText = bCell?.textContent?.trim() || '';
                        // 툴팁 아이콘이 있으면 제거
                        aText = aText.replace(/\?/g, '').trim();
                        bText = bText.replace(/\?/g, '').trim();
                        aVal = aText === '-' ? -1 : parseFloat(aText.replace(/[^\d.]/g, '')) || -1;
                        bVal = bText === '-' ? -1 : parseFloat(bText.replace(/[^\d.]/g, '')) || -1;
                    }

                    if (currentSort.direction === 'asc') {
                        return aVal - bVal;
                    } else {
                        return bVal - aVal;
                    }
                });

                rows.forEach(row => tbody.appendChild(row));
            }

            updateSortIndicators();
        }

        // 헤더 클릭 이벤트
        sortableHeaders.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const sortType = header.dataset.sort;
                sortTable(sortType);
            });
        });
    }

    // 필터 이벤트 핸들러는 synergy_search.js로 이동
    function setupFilters() {
        if (window.synergySearch && window.synergySearch.setupFilters) {
            window.synergySearch.setupFilters();
        }
    }

    // 초기화
    async function init() {
        // i18n 초기화
        if (typeof window.initPageI18n === 'function') {
            await window.initPageI18n('synergy');
        }

        currentLanguage = (typeof window.I18nService !== 'undefined')
            ? window.I18nService.getCurrentLanguage()
            : getCurrentLanguage();

        // Navigation 초기화
        try {
            if (typeof Navigation !== 'undefined' && Navigation.load) {
                Navigation.load('synergy');
            }
        } catch (e) { }

        // Version 체크
        try {
            if (typeof VersionChecker !== 'undefined' && VersionChecker.check) {
                VersionChecker.check();
            }
        } catch (e) { }

        // 캐릭터 목록 로드
        const loaded = await loadCharacterList();
        if (!loaded) {
            const loadErrorText = getI18nText('msgLoadError');
            document.getElementById('characterDetail').innerHTML =
                `<div style="padding: 40px; text-align: center; color: rgba(255,255,255,0.5);">${loadErrorText}</div>`;
            return;
        }

        // mapName 번역 데이터 로드
        await loadMapNameTranslations();

        // 필터 설정
        setupFilters();

        // UI 번역
        // UI 번역 (i18n 서비스가 자동 처리)
        // translateUI();
        if (window.I18nService && window.I18nService.updateDOM) {
            window.I18nService.updateDOM();
        }

        // URL 경로 또는 파라미터에서 캐릭터 읽기 (코드네임으로 찾기)
        const pathMatch = window.location.pathname.match(/\/synergy\/([^/?#]+)/);
        const urlCharacterFromPath = pathMatch ? pathMatch[1].toLowerCase() : null;
        const urlParams = new URLSearchParams(window.location.search);
        const urlCharacter = urlParams.get('character');
        const targetCodename = urlCharacter || urlCharacterFromPath;
        if (targetCodename) {
            const decodedChar = targetCodename.toLowerCase();
            let foundCharacter = null;

            // 각 캐릭터의 코드네임과 비교
            for (const name of Object.keys(characterList)) {
                let codeName = null;

                // 메로페 예외 처리
                if (name === '메로페') {
                    codeName = 'merope';
                } else if (window.characterData && window.characterData[name] && window.characterData[name].codename) {
                    codeName = window.characterData[name].codename.toLowerCase();
                }

                if (codeName && codeName === decodedChar) {
                    foundCharacter = name;
                    break;
                }
            }

            if (foundCharacter && characterList[foundCharacter]) {
                selectedCharacter = foundCharacter;
            }
        }

        // 탭 생성
        await createTabs();
    }

    // DOM 로드 완료 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
