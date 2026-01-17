// Maps I18n - 다국어 지원

(function() {
    'use strict';

    const i18n = {
        kr: {
            loading: '지도를 불러오는 중...',
            loadingTiles: '타일 로드 중...',
            loadingObjects: '오브젝트 로드 중...',
            objectFilter: '오브젝트 필터',
            zoom: '줌',
            reset: '리셋',
            dragMove: '마우스 드래그: 이동',
            wheelZoom: '마우스 휠: 줌',
            selectCategory: '카테고리를 선택하세요...',
            palace: '팰리스',
            mementoes: '메멘토스',
            selectAll: '전체 선택',
            resetFilter: '초기화',
            mapSelect: '맵 선택',
            map: '맵',
            filter: '필터'
        },
        en: {
            loading: 'Loading map...',
            loadingTiles: 'Loading tiles...',
            loadingObjects: 'Loading objects...',
            objectFilter: 'Object Filter',
            zoom: 'Zoom',
            reset: 'Reset',
            dragMove: 'Mouse drag: Move',
            wheelZoom: 'Mouse wheel: Zoom',
            selectCategory: 'Select a category...',
            palace: 'Palace',
            mementoes: 'Mementos',
            selectAll: 'Select All',
            resetFilter: 'Reset',
            mapSelect: 'Map Select',
            map: 'Map',
            filter: 'Filter'
        },
        jp: {
            loading: 'マップを読み込み中...',
            loadingTiles: 'タイルを読み込み中...',
            loadingObjects: 'オブジェクトを読み込み中...',
            objectFilter: 'オブジェクトフィルター',
            zoom: 'ズーム',
            reset: 'リセット',
            dragMove: 'マウスドラッグ: 移動',
            wheelZoom: 'マウスホイール: ズーム',
            selectCategory: 'カテゴリーを選択してください...',
            palace: 'パレス',
            mementoes: 'メメントス',
            selectAll: 'すべて選択',
            resetFilter: 'リセット',
            mapSelect: 'マップ選択',
            map: 'マップ',
            filter: 'フィルター'
        }
    };

    function getCurrentLanguage() {
        if (window.MapsCore && window.MapsCore.getCurrentLanguage) {
            return window.MapsCore.getCurrentLanguage();
        }
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
        } catch (e) {}
        return 'kr';
    }

    function getMapName(mapItem, lang) {
        if (lang === 'en' && mapItem.name_en) return mapItem.name_en;
        if (lang === 'jp' && mapItem.name_jp) return mapItem.name_jp;
        return mapItem.name;
    }

    window.MapsI18n = {
        getText: (lang, key) => {
            return (i18n[lang] && i18n[lang][key]) || i18n.kr[key] || key;
        },
        getCurrentLanguage: getCurrentLanguage,
        getMapName: getMapName
    };
})();
