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
            moveControl: '드래그 / WASD / 방향키: 이동',
            zoomControl: '휠 / +/-: 줌',
            selectCategory: '카테고리를 선택하세요...',
            palace: '팰리스',
            mementoes: '메멘토스',
            selectAll: '전체 선택',
            resetFilter: '초기화',
            mapSelect: '맵 선택',
            map: '맵',
            filter: '필터',
            dataManagement: '데이터 관리',
            backup: '백업',
            restore: '복원',
            mapLoadError: '맵을 불러오는데 실패했습니다.',
            localizationNotice: ''
        },
        en: {
            loading: 'Loading map...',
            loadingTiles: 'Loading tiles...',
            loadingObjects: 'Loading objects...',
            objectFilter: 'Object Filter',
            zoom: 'Zoom',
            reset: 'Reset',
            moveControl: 'Drag / WASD / Arrow: Move',
            zoomControl: 'Wheel / +/-: Zoom',
            selectCategory: 'Select a category...',
            palace: 'Palace',
            mementoes: 'Mementos',
            selectAll: 'Select All',
            resetFilter: 'Reset',
            mapSelect: 'Map Select',
            map: 'Map',
            filter: 'Filter',
            dataManagement: 'Data Management',
            backup: 'Backup',
            restore: 'Restore',
            mapLoadError: 'Failed to load the map.',
            localizationNotice: 'Some unreleased content may be displayed in Korean. Manual updates may be delayed.'
        },
        jp: {
            loading: 'マップを読み込み中...',
            loadingTiles: 'タイルを読み込み中...',
            loadingObjects: 'オブジェクトを読み込み中...',
            objectFilter: 'オブジェクトフィルター',
            zoom: 'ズーム',
            reset: 'リセット',
            moveControl: 'ドラッグ / WASD / 矢印: 移動',
            zoomControl: 'ホイール / +/-: ズーム',
            selectCategory: 'カテゴリーを選択してください...',
            palace: 'パレス',
            mementoes: 'メメントス',
            selectAll: 'すべて選択',
            resetFilter: 'リセット',
            mapSelect: 'マップ選択',
            map: 'マップ',
            filter: 'フィルター',
            dataManagement: 'データ管理',
            backup: 'バックアップ',
            restore: '復元',
            mapLoadError: 'マップの読み込みに失敗しました。',
            localizationNotice: '一部の未公開コンテンツは韓国語で表示される場合があります。手動更新が遅れる場合があります。'
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
