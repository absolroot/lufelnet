// 언어별 페이지 라우팅 관리
class LanguageRouter {
    static async init() {
        try {
            // 즉시 리다이렉트 처리
            await this.handleImmediateRedirect();

            // 첫 방문자의 경우 IP 기반 언어 감지
            await this.initializeLanguageDetection();

            await this.handleLanguageRouting();
            await this.setupLanguageRedirection();
        } catch (error) {
            console.error('Language router initialization failed:', error);
            // 기본 언어로 폴백
            return 'kr';
        }
    }

    // 언어 감지 초기화
    static async initializeLanguageDetection() {
        // 첫 방문자이고 언어 설정이 없는 경우에만 IP 감지 실행
        const hasLanguagePreference = localStorage.getItem('preferredLanguage');
        const hasLanguageDetected = localStorage.getItem('languageDetected');
        const urlParams = new URLSearchParams(window.location.search);
        const hasUrlLang = urlParams.get('lang');

        if (!hasLanguagePreference && !hasLanguageDetected && !hasUrlLang) {
            //console.log('👋 First-time visitor detected, initializing language detection...');
            const detectedLang = await this.detectLanguageByIP();

            // 감지된 언어로 자동 리다이렉트
            if (detectedLang) {
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('lang', detectedLang);
                //console.log('🔄 Redirecting to detected language:', detectedLang);
                window.location.replace(newUrl.toString());
            }
        } else if (hasLanguagePreference && !hasUrlLang) {
            // 저장된 언어 설정이 있지만 URL에 lang 파라미터가 없는 경우 자동 적용
            const savedLang = localStorage.getItem('preferredLanguage');
            //console.log('🔄 Applying saved language preference:', savedLang);
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('lang', savedLang);
            window.location.replace(newUrl.toString());
        }
    }

    // 즉시 리다이렉트 처리 (페이지 로드 전)
    static handleImmediateRedirect() {
        const fullUrl = window.location.href;
        const path = window.location.pathname;

        // /kr/, /en/, /jp/ 경로를 즉시 리다이렉트
        const langPrefixMatch = path.match(/^\/(kr|en|jp|cn)(\/.*)?$/);
        if (langPrefixMatch) {
            const [, langPrefix, remainingPath] = langPrefixMatch;
            let newPath = remainingPath || '/';

            // 특별한 경로 매핑 처리
            const pathMappings = {
                '/character/character.html': '/character.html',
                '/tactic/tactic-share.html': '/tactic/tactic-share.html'
            };

            if (pathMappings[newPath]) {
                newPath = pathMappings[newPath];
            }

            // URL 전체를 문자열로 처리
            let newUrl = fullUrl;

            // 경로 부분 교체
            const oldPathPattern = new RegExp(`^(https?://[^/]+)/(kr|en|jp|cn)(/.*)?`);
            const match = newUrl.match(oldPathPattern);
            if (match) {
                const [, protocol, , remainingPathFromUrl] = match;
                newUrl = newUrl.replace(oldPathPattern, `${protocol}${newPath}`);

                // lang 파라미터 처리
                if (newUrl.includes('?')) {
                    if (newUrl.includes('lang=')) {
                        // 기존 lang 파라미터 교체
                        newUrl = newUrl.replace(/([?&])lang=[^&]*/, `$1lang=${langPrefix}`);
                    } else {
                        // lang 파라미터 추가
                        newUrl = newUrl + `&lang=${langPrefix}`;
                    }
                } else {
                    // 쿼리 파라미터가 없는 경우
                    newUrl = newUrl + `?lang=${langPrefix}`;
                }

                // 즉시 리다이렉트
                //console.log('Redirecting from:', fullUrl);
                //console.log('Redirecting to:', newUrl);
                window.location.replace(newUrl);
                return;
            }
        }
    }

    // 현재 언어 감지
    static getCurrentLanguage() {
        // URL 파라미터에서 언어 확인
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['kr', 'en', 'jp', 'cn'].includes(urlLang)) {
            return urlLang;
        }

        // URL 경로에서 언어 확인
        const pathLang = window.location.pathname.split('/')[1];
        if (['kr', 'en', 'jp', 'cn'].includes(pathLang)) {
            return pathLang;
        }

        // 로컬 스토리지에서 언어 확인
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && ['kr', 'en', 'jp', 'cn'].includes(savedLang)) {
            return savedLang;
        }

        // 브라우저 언어 감지
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('ko')) return 'kr';
        if (browserLang.startsWith('ja')) return 'jp';
        if (browserLang.startsWith('zh')) return 'cn';
        if (browserLang.startsWith('en')) return 'en';

        return 'kr'; // 기본값
    }

    // IP 기반 언어 자동 감지
    static async detectLanguageByIP() {
        try {
            //console.log('🌍 Detecting user location for language setting...');

            // 여러 IP 지역 감지 API를 시도 (폴백 지원)
            const apis = [
                'https://ipapi.co/json/',
                'https://ipinfo.io/json',
                'https://api.ipgeolocation.io/ipgeo?apiKey=demo'
            ];

            let locationData = null;

            for (const api of apis) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000);

                    const response = await fetch(api, {
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (response.ok) {
                        locationData = await response.json();
                        break;
                    }
                } catch (apiError) {
                    // console.log(`Failed to fetch from ${api}:`, apiError.message);
                    continue;
                }
            }

            if (!locationData) {
                throw new Error('All IP geolocation APIs failed');
            }

            // 다양한 API 응답 형식 처리
            const countryCode = locationData.country_code ||
                locationData.country ||
                locationData.countryCode;

            //console.log('🌍 Detected country:', countryCode);

            let detectedLang = 'en'; // 기본값을 영어로 변경

            // 국가 코드에 따른 언어 설정
            if (countryCode === 'KR') {
                detectedLang = 'kr';
                //console.log('🇰🇷 Korean user detected');
            } else if (countryCode === 'JP') {
                detectedLang = 'jp';
                //console.log('🇯🇵 Japanese user detected');
            } else {
                detectedLang = 'en';
                //console.log('🌎 International user detected, setting English');
            }

            // 자동 감지된 언어를 로컬 스토리지에 저장
            localStorage.setItem('preferredLanguage', detectedLang);
            localStorage.setItem('languageDetected', 'true');
            localStorage.setItem('detectedCountry', countryCode);

            //console.log('✅ Auto-detected language saved:', detectedLang);

            return detectedLang;

        } catch (error) {
            //console.log('❌ Failed to detect language by IP:', error.message);

            // IP 감지 실패 시 브라우저 언어로 폴백
            const browserLang = navigator.language.toLowerCase();
            let fallbackLang = 'en'; // 기본값을 영어로 변경

            if (browserLang.startsWith('ko')) {
                fallbackLang = 'kr';
                //console.log('🇰🇷 Fallback to Korean (browser language)');
            } else if (browserLang.startsWith('ja')) {
                fallbackLang = 'jp';
                //console.log('🇯🇵 Fallback to Japanese (browser language)');
            } else {
                fallbackLang = 'en';
                //console.log('🌎 Fallback to English (browser language)');
            }

            localStorage.setItem('preferredLanguage', fallbackLang);
            localStorage.setItem('languageDetected', 'true');
            localStorage.setItem('detectionMethod', 'browser');

            //console.log('✅ Fallback language saved:', fallbackLang);

            return fallbackLang;
        }
    }

    // 언어별 라우팅 처리
    static handleLanguageRouting() {
        // 무한 루프 방지
        if (window.routingInProgress) {
            return;
        }

        const currentLang = this.getCurrentLanguage();
        const path = window.location.pathname;
        const search = window.location.search;

        // 기존 언어 디렉토리 구조 (/kr/, /en/, /jp/)를 새로운 방식으로 리다이렉션
        const langPrefixMatch = path.match(/^\/(kr|en|jp|cn)(\/.*)?$/);
        if (langPrefixMatch) {
            const [, langPrefix, remainingPath] = langPrefixMatch;
            let newPath = remainingPath || '/';

            // 특별한 경로 매핑 처리
            const pathMappings = {
                '/character/character.html': '/character.html',
                '/tactic/tactic-share.html': '/tactic/tactic-share.html'
            };

            if (pathMappings[newPath]) {
                newPath = pathMappings[newPath];
            }

            // 쿼리 파라미터 처리 - 더 안전한 방법 사용
            let newSearch = search;
            if (search) {
                // 기존에 lang 파라미터가 있는지 확인
                if (search.includes('lang=')) {
                    // lang 파라미터를 새로운 값으로 교체
                    newSearch = search.replace(/([?&])lang=[^&]*/, `$1lang=${langPrefix}`);
                } else {
                    // lang 파라미터 추가
                    newSearch = search + (search.includes('?') ? '&' : '?') + `lang=${langPrefix}`;
                }
            } else {
                // 쿼리 파라미터가 없는 경우
                newSearch = `?lang=${langPrefix}`;
            }

            // 현재 URL이 이미 올바른 형식이 아닌 경우에만 리다이렉션
            if (path !== newPath || search !== newSearch) {
                window.routingInProgress = true;
                const newUrl = `${newPath}${newSearch}`;
                window.location.replace(newUrl);
                return;
            }
        }

        // URL 파라미터가 없는 경우 기본 언어 추가 (하지만 이미 올바른 페이지에 있다면 리다이렉션하지 않음)
        if (!search.includes('lang=') && !langPrefixMatch) {
            // 현재 페이지가 이미 올바른 페이지인지 확인
            const isCorrectPage = this.isCorrectPageForLanguage(path, currentLang);
            if (!isCorrectPage) {
                window.routingInProgress = true;
                const newSearch = search ? `${search}&lang=${currentLang}` : `?lang=${currentLang}`;
                const newUrl = `${path}${newSearch}`;
                window.location.replace(newUrl);
            }
        }
    }

    // 언어 변경 시 리다이렉션 설정
    static setupLanguageRedirection() {
        // Navigation 클래스의 언어 선택 함수 오버라이드
        window.addEventListener('DOMContentLoaded', function () {
            if (window.Navigation) {
                window.Navigation.selectLanguage = async function (lang, event) {
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                    }

                    // 드롭다운 닫기
                    const optionsContainer = document.querySelector('.options-container');
                    if (optionsContainer) {
                        optionsContainer.classList.remove('active');
                    }

                    // 로컬 스토리지에 언어 저장
                    localStorage.setItem('preferredLanguage', lang);

                    // 현재 경로 분석
                    let currentPath = window.location.pathname;
                    let currentParams = new URLSearchParams(window.location.search);

                    // 기존 언어 디렉토리 경로를 루트로 변경
                    const langPrefixMatch = currentPath.match(/^\/(kr|en|jp|cn)(\/.*)?$/);
                    if (langPrefixMatch) {
                        const [, , remainingPath] = langPrefixMatch;
                        currentPath = remainingPath || '/';
                    }

                    // 언어 파라미터 설정
                    currentParams.set('lang', lang);

                    // 새로운 URL 생성
                    const newUrl = `${currentPath}?${currentParams.toString()}`;

                    // 페이지 이동
                    window.location.href = newUrl;
                };
            }
        });
    }

    // 현재 페이지가 해당 언어에 맞는 올바른 페이지인지 확인
    static isCorrectPageForLanguage(path, lang) {
        // 이미 언어 파라미터가 있는 URL이면 올바른 페이지로 간주
        if (window.location.search.includes('lang=')) {
            return true;
        }

        // 특정 페이지들은 직접 접근 허용 (리다이렉션 없이)
        const directAccessPages = ['/persona/', '/revelations/', '/character/', '/about/'];
        const normalizedPath = path.endsWith('/') ? path : path + '/';

        if (directAccessPages.includes(normalizedPath)) {
            return true;
        }

        return false;
    }


    // 언어 설정 디버그 정보 (개발자 도구에서 확인 가능)
    static getLanguageDebugInfo() {
        return {
            currentLanguage: this.getCurrentLanguage(),
            preferredLanguage: localStorage.getItem('preferredLanguage'),
            languageDetected: localStorage.getItem('languageDetected'),
            detectedCountry: localStorage.getItem('detectedCountry'),
            detectionMethod: localStorage.getItem('detectionMethod'),
            browserLanguage: navigator.language,
            urlLanguage: new URLSearchParams(window.location.search).get('lang')
        };
    }

    // 언어 설정 초기화 (테스트용)
    static resetLanguageSettings() {
        localStorage.removeItem('preferredLanguage');
        localStorage.removeItem('languageDetected');
        localStorage.removeItem('detectedCountry');
        localStorage.removeItem('detectionMethod');
        //console.log('🔄 Language settings reset. Reload the page to detect language again.');
    }
}

// 스크립트 로드 시 즉시 실행
LanguageRouter.handleImmediateRedirect();

// 페이지 로드 시 초기화
if (typeof window !== 'undefined') {
    // 즉시 초기화 시도
    LanguageRouter.init();

    // DOMContentLoaded에서도 초기화 (이중 보장)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LanguageRouter.init());
    }

    // 페이지 완전 로드 후에도 한 번 더 확인
    window.addEventListener('load', () => {
        // 첫 방문자이고 언어 설정이 없는 경우 강제 감지
        const hasLanguagePreference = localStorage.getItem('preferredLanguage');
        const hasLanguageDetected = localStorage.getItem('languageDetected');
        const urlParams = new URLSearchParams(window.location.search);
        const hasUrlLang = urlParams.get('lang');

        if (!hasLanguagePreference && !hasLanguageDetected && !hasUrlLang) {
            //console.log('🔄 Forcing language detection on page load...');
            LanguageRouter.detectLanguageByIP().then(detectedLang => {
                if (detectedLang && detectedLang !== 'kr') {
                    //console.log(`🌍 Detected language: ${detectedLang}, redirecting...`);
                    const newUrl = new URL(window.location);
                    newUrl.searchParams.set('lang', detectedLang);
                    window.location.replace(newUrl.toString());
                }
            });
        }
    });

    // Safety Net: Ensure i18n-loading is removed even if i18n fails
    // This prevents pages from being stuck in a skeleton state
    window.addEventListener('load', () => {
        // Short timeout to allow normal loading to finish
        setTimeout(() => {
            if (document.documentElement.classList.contains('i18n-loading')) {
                console.warn('⚠️ i18n-loading class was not removed by i18n adapter. Force removing it.');
                document.documentElement.classList.remove('i18n-loading');
            }
        }, 1000); // 1 second safety timeout
    });
}

// 전역 함수로 현재 언어 제공
window.getCurrentLanguage = LanguageRouter.getCurrentLanguage.bind(LanguageRouter);

// LanguageRouter를 전역에서 접근 가능하도록 설정
window.LanguageRouter = LanguageRouter;

// 쉬운 디버깅을 위한 전역 함수들
window.debugLanguage = function () {
    //console.log('🔍 Language Debug Info:');
    //console.table(LanguageRouter.getLanguageDebugInfo());

    // IP 감지 테스트
    //console.log('🌍 Testing IP detection...');
    LanguageRouter.detectLanguageByIP().then(lang => {
        //console.log('✅ IP Detection Result:', lang);
    }).catch(err => {
        //console.log('❌ IP Detection Failed:', err);
    });
};

window.resetLanguage = function () {
    LanguageRouter.resetLanguageSettings();
};

window.testIPDetection = async function () {
    //console.log('🧪 Testing IP Detection APIs...');

    const apis = [
        'https://ipapi.co/json/',
        'https://ipinfo.io/json',
        'https://api.ipgeolocation.io/ipgeo?apiKey=demo'
    ];

    for (const api of apis) {
        try {
            //console.log(`Testing ${api}...`);
            const response = await fetch(api);
            const data = await response.json();
            //console.log(`✅ ${api}:`, data);
        } catch (error) {
            //console.log(`❌ ${api}:`, error.message);
        }
    }
}; 