// 지역별 메타태그 동적 생성
(function() {
    'use strict';
    
    // 언어별 메타데이터
    const i18nMetaData = {
        kr: {
            title: 'P5X 루페르넷',
            description: '페르소나 5X 공략 및 정보 사이트 - 괴도, 페르소나, 계시, 택틱 정보 제공',
            keywords: 'P5X, 페르소나5X, 공략, 괴도, 페르소나, 계시, 택틱, 루페르넷',
            author: 'LufelNet',
            locale: 'ko_KR',
            image: '/assets/img/home/seo_kr.png'
        },
        en: {
            title: 'P5X Lufelnet - Persona 5X Guide',
            description: 'Persona 5X Strategy and Information Site - Phantom Thieves, Personas, Revelations, Tactics Guide',
            keywords: 'P5X, Persona5X, Guide, Phantom Thieves, Persona, Revelations, Tactics, Strategy',
            author: 'LufelNet',
            locale: 'en_US',
            image: '/assets/img/home/seo_en.png'
        },
        jp: {
            title: 'P5X Lufelnet - ペルソナ5X攻略',
            description: 'ペルソナ5X攻略・情報サイト - 怪盗、ペルソナ、啓示、タクティクス攻略',
            keywords: 'P5X, ペルソナ5X, 攻略, 怪盗, ペルソナ, 啓示, タクティクス, 戦略',
            author: 'LufelNet',
            locale: 'ja_JP',
            image: '/assets/img/home/seo_jp.png'
        }
    };
    
    // IP 기반 지역 감지
    function detectRegionByIP() {
        return new Promise((resolve) => {
            // 외부 IP 감지 서비스 사용
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    const countryCode = data.country_code;
                    let detectedLang = 'kr'; // 기본값
                    
                    if (countryCode === 'JP') {
                        detectedLang = 'jp';
                    } else if (countryCode === 'US' || countryCode === 'GB' || countryCode === 'AU' || countryCode === 'CA') {
                        detectedLang = 'en';
                    } else if (countryCode === 'KR') {
                        detectedLang = 'kr';
                    } else {
                        // 기타 국가는 브라우저 언어로 판단
                        const browserLang = navigator.language || navigator.userLanguage;
                        if (browserLang.startsWith('ja')) {
                            detectedLang = 'jp';
                        } else if (browserLang.startsWith('en')) {
                            detectedLang = 'en';
                        }
                    }
                    
                    resolve(detectedLang);
                })
                .catch(() => {
                    // IP 감지 실패시 브라우저 언어로 폴백
                    const browserLang = navigator.language || navigator.userLanguage;
                    let detectedLang = 'kr';
                    
                    if (browserLang.startsWith('ja')) {
                        detectedLang = 'jp';
                    } else if (browserLang.startsWith('en')) {
                        detectedLang = 'en';
                    }
                    
                    resolve(detectedLang);
                });
        });
    }
    
    // 최종 언어 결정
    function getFinalLanguage() {
        // 1. URL 파라미터 우선 체크
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) {
            return urlLang;
        }
        
        // 2. localStorage에 저장된 언어 설정 체크
        const savedLang = localStorage.getItem('preferred_language');
        if (savedLang && ['kr', 'en', 'jp'].includes(savedLang)) {
            return savedLang;
        }
        
        // 3. IP 기반 지역 감지
        try {
            const ipBasedLang = detectRegionByIP();
            if (ipBasedLang) {
                return ipBasedLang;
            }
        } catch (error) {
            console.error('IP 기반 언어 감지 실패:', error);
        }
        
        // 4. 기본값
        return 'kr';
    }
    
    // 이미지 존재 여부 확인 함수
    function checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    
    // 메타태그 업데이트
    async function updateMetaTags(lang) {
        const data = i18nMetaData[lang] || i18nMetaData.kr;
        const baseUrl = window.location.origin;
        let imageUrl = baseUrl + data.image;
        
        // 언어별 이미지가 존재하지 않으면 기본 이미지로 폴백
        const imageExists = await checkImageExists(imageUrl);
        if (!imageExists) {
            console.warn(`Language-specific image not found: ${imageUrl}`);
            imageUrl = baseUrl + '/assets/img/home/seo.png'; // 기본 이미지로 폴백
            //console.log(`Fallback to default image: ${imageUrl}`);
        }
        
        // 기본 메타태그 업데이트
        updateOrCreateMeta('description', data.description);
        updateOrCreateMeta('keywords', data.keywords);
        updateOrCreateMeta('author', data.author);
        
        // Open Graph 메타태그 업데이트
        updateOrCreateMeta('og:title', data.title, 'property');
        updateOrCreateMeta('og:description', data.description, 'property');
        updateOrCreateMeta('og:site_name', data.title, 'property');
        updateOrCreateMeta('og:locale', data.locale, 'property');
        updateOrCreateMeta('og:image', imageUrl, 'property');
        
        // Twitter 카드 메타태그 업데이트
        updateOrCreateMeta('twitter:title', data.title, 'name');
        updateOrCreateMeta('twitter:description', data.description, 'name');
        updateOrCreateMeta('twitter:image', imageUrl, 'name');
        
        // 페이지 타이틀 업데이트 (페이지별 타이틀이 없는 경우만)
        const currentTitle = document.title;
        if (!currentTitle.includes('|') && currentTitle === 'P5X 루페르넷') {
            document.title = data.title;
        }
        
        // HTML lang 속성 업데이트
        document.documentElement.lang = lang;
        
        // 전역 변수로 현재 언어 설정
        window.currentLang = lang;
        
        // 언어 설정 저장
        localStorage.setItem('preferred_language', lang);
        
        //console.log(`Meta tags updated for language: ${lang}`);
        //console.log(`Thumbnail image set to: ${imageUrl}`);
    }
    
    // 메타태그 생성/업데이트 헬퍼 함수
    function updateOrCreateMeta(name, content, attribute = 'name') {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }
    
    // 언어별 데이터 파일 동적 로딩
    function loadLanguageData(lang) {
        // 현재 페이지에 필요한 데이터 파일들 체크
        const currentPath = window.location.pathname;
        let dataFiles = [];
        
        if (currentPath.includes('/character') || currentPath === '/' || currentPath.includes('/index')) {
            dataFiles.push('/characters/characters.js');
        }
        if (currentPath.includes('/revelations') || currentPath === '/' || currentPath.includes('/index')) {
            dataFiles.push('/revelations/revelations.js');
        }
        
        // 언어별 데이터 파일 로딩
        dataFiles.forEach(dataFile => {
            const script = document.createElement('script');
            script.src = `${window.BASE_URL || ''}/data/${lang}${dataFile}?v=${window.APP_VERSION || Date.now()}`;
            script.onerror = () => {
                console.warn(`Failed to load ${lang} data file: ${dataFile}`);
                // 폴백으로 한국어 데이터 로딩
                if (lang !== 'kr') {
                    const fallbackScript = document.createElement('script');
                    fallbackScript.src = `${window.BASE_URL || ''}/data/kr${dataFile}?v=${window.APP_VERSION || Date.now()}`;
                    document.head.appendChild(fallbackScript);
                }
            };
            document.head.appendChild(script);
        });
    }
    
    // 초기화
    async function init() {
        try {
            const finalLang = await getFinalLanguage();
            await updateMetaTags(finalLang);
            loadLanguageData(finalLang);
            
            // 커스텀 이벤트 발생 (다른 스크립트에서 언어 변경을 감지할 수 있도록)
            window.dispatchEvent(new CustomEvent('languageDetected', { 
                detail: { language: finalLang } 
            }));
            
        } catch (error) {
            console.error('Language detection failed:', error);
            // 에러 발생시 기본값으로 설정
            await updateMetaTags('kr');
            loadLanguageData('kr');
        }
    }
    
    // DOM 로드 완료 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 전역 함수로 노출 (다른 스크립트에서 사용할 수 있도록)
    window.updateMetaTags = updateMetaTags; // async function
    window.getFinalLanguage = getFinalLanguage;
    
})(); 