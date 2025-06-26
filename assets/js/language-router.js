// 언어별 페이지 라우팅 관리
class LanguageRouter {
    static init() {
        // 즉시 리다이렉트 처리
        this.handleImmediateRedirect();
        this.handleLanguageRouting();
        this.setupLanguageRedirection();
        return Promise.resolve(); // Promise 반환
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
                console.log('Redirecting from:', fullUrl);
                console.log('Redirecting to:', newUrl);
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
        window.addEventListener('DOMContentLoaded', function() {
            if (window.Navigation) {
                window.Navigation.selectLanguage = async function(lang, event) {
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

    // 페이지별 언어 가용성 확인
    static checkPageAvailability() {
        const currentLang = this.getCurrentLanguage();
        const path = window.location.pathname;
        
        // 각 언어별 사용 가능한 페이지 정의
        const availablePages = {
            kr: ['/', '/character', '/persona', '/revelations', '/tactic', '/tier', '/about', '/pay-calc', '/defense-calc', '/critical-calc'],
            en: ['/', '/character', '/character.html', '/about'], // 캐릭터 목록과 상세, 어바웃만 허용
            jp: ['/', '/character', '/character.html', '/about'], // 캐릭터 목록과 상세, 어바웃만 허용
            cn: ['/', '/character', '/character.html', '/about']  // 캐릭터 목록과 상세, 어바웃만 허용
        };

        const currentPages = availablePages[currentLang] || availablePages.kr;
        const basePath = path.split('?')[0].replace(/\/$/, '') || '/';
        
        // 현재 페이지가 해당 언어에서 사용 가능한지 확인
        if (!currentPages.includes(basePath) && currentLang !== 'kr') {
            // 사용할 수 없는 페이지인 경우 메인 페이지로 리다이렉션 (무한 루프 방지)
            if (basePath !== '/') {
                window.location.href = `/?lang=${currentLang}`;
                return false;
            }
        }
        
        return true;
    }

    // 언어별 콘텐츠 로드
    static loadLanguageContent(contentId, langTexts) {
        const currentLang = this.getCurrentLanguage();
        const texts = langTexts[currentLang] || langTexts.kr;
        
        const element = document.getElementById(contentId);
        if (element && texts) {
            // 텍스트 내용 업데이트
            Object.keys(texts).forEach(key => {
                const targetElement = element.querySelector(`[data-lang-key="${key}"]`);
                if (targetElement) {
                    targetElement.textContent = texts[key];
                }
            });
        }
    }
}

// 스크립트 로드 시 즉시 실행
LanguageRouter.handleImmediateRedirect();

// 페이지 로드 시 초기화
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LanguageRouter.init());
    } else {
        LanguageRouter.init();
    }
}

// 전역 함수로 현재 언어 제공
window.getCurrentLanguage = LanguageRouter.getCurrentLanguage.bind(LanguageRouter); 