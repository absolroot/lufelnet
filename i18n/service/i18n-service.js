/**
 * 통합 i18n 서비스
 * 
 * 모든 페이지에서 일관된 방식으로 다국어를 처리하는 중앙 집중식 서비스입니다.
 * 
 * 특징:
 * - 공통 번역 + 페이지별 번역 자동 로딩
 * - 메모리 캐싱으로 성능 최적화
 * - 언어 추가가 용이한 확장 가능한 구조
 * - 폴백 메커니즘 (요청 언어 → kr → 기본값)
 * 
 * 사용 예시:
 * ```javascript
 * // 서비스 초기화
 * await I18nService.init('pull-calc');
 * 
 * // 번역 가져오기
 * const text = I18nService.t('pageTitle');
 * 
 * // 중첩 키 지원
 * const tooltip = I18nService.t('tooltips.charPity');
 * 
 * // 기본값 지정
 * const text = I18nService.t('unknownKey', 'Default Value');
 * 
 * // 언어 변경
 * await I18nService.setLanguage('en');
 * ```
 */

class I18nService {
    constructor() {
        this.currentLang = 'kr';
        this.supportedLanguages = ['kr', 'en', 'jp'];
        this.fallbackLanguage = 'kr';

        // 캐시: { lang: { common: {...}, pages: { pageName: {...} } } }
        this.cache = {};

        // 현재 페이지 이름
        this.currentPage = null;

        // 언어 변경 리스너들
        this.languageChangeListeners = [];

        // 번역 파일 베이스 경로
        this.basePath = '/i18n';
    }

    /**
     * 서비스 초기화
     * @param {string} pageName - 페이지 이름 (예: 'pull-calc', 'character')
     * @param {string} customLang - 강제로 지정할 언어 (선택사항)
     * @returns {Promise<void>}
     */
    async init(pageName = null, customLang = null) {
        try {
            // 현재 언어 감지
            this.currentLang = customLang || this._detectLanguage();

            // 공통 번역 로드
            await this.loadCommonTranslations();

            // 페이지별 번역 로드 (페이지 이름이 제공된 경우)
            if (pageName) {
                this.currentPage = pageName;
                await this.loadPageTranslations(pageName);
            }

            console.log(`[I18nService] Initialized with language: ${this.currentLang}, page: ${pageName || 'none'}`);
        } catch (error) {
            console.error('[I18nService] Initialization failed:', error);
            // 초기화 실패해도 기본 동작은 가능하도록
        }
    }

    /**
     * 현재 언어 감지
     * language-router.js와 호환되도록 구현
     * @private
     */
    _detectLanguage() {
        // 1. URL 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.supportedLanguages.includes(urlLang)) {
            return urlLang;
        }

        // 2. URL 경로 확인 (레거시 지원)
        const pathLang = window.location.pathname.split('/')[1];
        if (this.supportedLanguages.includes(pathLang)) {
            return pathLang;
        }

        // 3. 로컬 스토리지 확인
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            return savedLang;
        }

        // 4. getCurrentLanguage 함수 사용 (language-router.js에서 제공)
        if (typeof window.getCurrentLanguage === 'function') {
            const detectedLang = window.getCurrentLanguage();
            if (this.supportedLanguages.includes(detectedLang)) {
                return detectedLang;
            }
        }

        // 5. 브라우저 언어 감지
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('ko')) return 'kr';
        if (browserLang.startsWith('ja')) return 'jp';
        if (browserLang.startsWith('en')) return 'en';

        // 기본값
        return this.fallbackLanguage;
    }

    /**
     * 공통 번역 파일 로드
     * @param {string} lang - 언어 코드
     * @returns {Promise<Object>}
     */
    async loadCommonTranslations(lang = null) {
        const targetLang = lang || this.currentLang;

        // 캐시 확인
        if (this.cache[targetLang]?.common) {
            return this.cache[targetLang].common;
        }

        try {
            const module = await import(`${this.basePath}/common/${targetLang}.js`);
            const translations = module.default;

            // 캐시에 저장
            if (!this.cache[targetLang]) {
                this.cache[targetLang] = {};
            }
            this.cache[targetLang].common = translations;

            return translations;
        } catch (error) {
            console.warn(`[I18nService] Failed to load common translations for ${targetLang}:`, error);

            // 폴백: kr 시도
            if (targetLang !== this.fallbackLanguage) {
                console.log(`[I18nService] Falling back to ${this.fallbackLanguage} for common translations`);
                return await this.loadCommonTranslations(this.fallbackLanguage);
            }

            return {};
        }
    }

    /**
     * 페이지별 번역 파일 로드
     * @param {string} pageName - 페이지 이름
     * @param {string} lang - 언어 코드
     * @returns {Promise<Object>}
     */
    async loadPageTranslations(pageName, lang = null) {
        const targetLang = lang || this.currentLang;

        // 캐시 확인
        if (this.cache[targetLang]?.pages?.[pageName]) {
            return this.cache[targetLang].pages[pageName];
        }

        try {
            const module = await import(`${this.basePath}/pages/${pageName}/${targetLang}.js`);
            const translations = module.default;

            // 캐시에 저장
            if (!this.cache[targetLang]) {
                this.cache[targetLang] = {};
            }
            if (!this.cache[targetLang].pages) {
                this.cache[targetLang].pages = {};
            }
            this.cache[targetLang].pages[pageName] = translations;

            return translations;
        } catch (error) {
            console.warn(`[I18nService] Failed to load page translations for ${pageName}/${targetLang}:`, error);

            // 빈 객체를 캐시에 저장하여 반복 시도 방지
            if (!this.cache[targetLang]) {
                this.cache[targetLang] = {};
            }
            if (!this.cache[targetLang].pages) {
                this.cache[targetLang].pages = {};
            }
            this.cache[targetLang].pages[pageName] = {};

            // 폴백: kr 시도 (단, kr이 아닌 경우만)
            if (targetLang !== this.fallbackLanguage) {
                console.log(`[I18nService] Falling back to ${this.fallbackLanguage} for ${pageName} translations`);
                try {
                    const fallbackTranslations = await this.loadPageTranslations(pageName, this.fallbackLanguage);
                    // 폴백 성공 시 해당 번역을 현재 언어의 폴백으로도 병합
                    if (fallbackTranslations && Object.keys(fallbackTranslations).length > 0) {
                        this.cache[targetLang].pages[pageName] = { ...fallbackTranslations };
                    }
                    return fallbackTranslations;
                } catch (fallbackError) {
                    console.warn(`[I18nService] Fallback also failed for ${pageName}/${this.fallbackLanguage}`);
                }
            }

            return {};
        }
    }

    /**
     * 번역 텍스트 가져오기
     * @param {string} key - 번역 키 (점 표기법 지원: 'tooltips.charPity')
     * @param {string} defaultValue - 키를 찾지 못했을 때 반환할 기본값
     * @returns {string}
     */
    t(key, defaultValue = '') {
        if (!key) return defaultValue;

        const lang = this.currentLang;

        // 1. 페이지별 번역에서 찾기
        if (this.currentPage) {
            const pageTranslation = this._getNestedValue(
                this.cache[lang]?.pages?.[this.currentPage],
                key
            );
            if (pageTranslation !== undefined) {
                return pageTranslation;
            }
        }

        // 2. 공통 번역에서 찾기
        const commonTranslation = this._getNestedValue(
            this.cache[lang]?.common,
            key
        );
        if (commonTranslation !== undefined) {
            return commonTranslation;
        }

        // 3. 폴백 언어에서 찾기
        if (lang !== this.fallbackLanguage) {
            const fallbackPageTranslation = this.currentPage
                ? this._getNestedValue(
                    this.cache[this.fallbackLanguage]?.pages?.[this.currentPage],
                    key
                )
                : undefined;

            if (fallbackPageTranslation !== undefined) {
                return fallbackPageTranslation;
            }

            const fallbackCommonTranslation = this._getNestedValue(
                this.cache[this.fallbackLanguage]?.common,
                key
            );
            if (fallbackCommonTranslation !== undefined) {
                return fallbackCommonTranslation;
            }
        }

        // 4. 기본값 반환
        if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
            console.warn(`[I18nService] Missing translation: ${key} (lang: ${lang})`);
        }
        return defaultValue || key;
    }

    /**
     * 중첩된 객체에서 점 표기법으로 값 가져오기
     * @private
     * @param {Object} obj - 대상 객체
     * @param {string} path - 경로 (예: 'tooltips.charPity')
     * @returns {*}
     */
    _getNestedValue(obj, path) {
        if (!obj || typeof obj !== 'object') return undefined;

        const keys = path.split('.');
        let current = obj;

        for (const key of keys) {
            if (current[key] === undefined) {
                return undefined;
            }
            current = current[key];
        }

        return current;
    }

    /**
     * 언어 변경
     * @param {string} newLang - 새 언어 코드
     * @returns {Promise<void>}
     */
    async setLanguage(newLang) {
        if (!this.supportedLanguages.includes(newLang)) {
            console.warn(`[I18nService] Unsupported language: ${newLang}`);
            return;
        }

        if (this.currentLang === newLang) {
            return; // 이미 같은 언어
        }

        const oldLang = this.currentLang;
        this.currentLang = newLang;

        // 공통 번역 로드
        await this.loadCommonTranslations(newLang);

        // 현재 페이지 번역 로드
        if (this.currentPage) {
            await this.loadPageTranslations(this.currentPage, newLang);
        }

        // 리스너들에게 알림
        this._notifyLanguageChange(oldLang, newLang);

        // DOM 업데이트 (data-i18n 속성 기반)
        this.updateDOM();

        console.log(`[I18nService] Language changed from ${oldLang} to ${newLang}`);
    }

    /**
     * 언어 변경 리스너 등록
     * @param {Function} callback - 콜백 함수 (oldLang, newLang) => void
     */
    onLanguageChange(callback) {
        if (typeof callback === 'function') {
            this.languageChangeListeners.push(callback);
        }
    }

    /**
     * 언어 변경 리스너들에게 알림
     * @private
     */
    _notifyLanguageChange(oldLang, newLang) {
        this.languageChangeListeners.forEach(callback => {
            try {
                callback(oldLang, newLang);
            } catch (error) {
                console.error('[I18nService] Language change listener error:', error);
            }
        });
    }

    /**
     * 현재 언어 코드 반환
     * @returns {string}
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * 지원하는 언어 목록 반환
     * @returns {string[]}
     */
    getSupportedLanguages() {
        return [...this.supportedLanguages];
    }

    /**
     * 새로운 언어 추가 (확장성)
     * @param {string} langCode - 언어 코드
     */
    addSupportedLanguage(langCode) {
        if (!this.supportedLanguages.includes(langCode)) {
            this.supportedLanguages.push(langCode);
            console.log(`[I18nService] Added new language: ${langCode}`);
        }
    }

    /**
     * 캐시 초기화 (디버깅/테스트용)
     */
    clearCache() {
        this.cache = {};
        console.log('[I18nService] Cache cleared');
    }

    /**
     * DOM 요소 업데이트 - data-i18n 속성 기반
     * @param {Element} rootElement - 업데이트할 루트 요소 (기본값: document)
     */
    updateDOM(rootElement = document) {
        // 1. data-i18n 속성 처리 (textContent)
        rootElement.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                const translation = this.t(key);
                if (translation) {
                    el.textContent = translation;
                    // 번역이 있으면 표시
                    if (el.style.display === 'none') {
                        el.style.display = '';
                    }
                } else {
                    // 번역이 없으면 (빈 문자열) 숨김
                    el.style.display = 'none';
                }
            }
        });

        // 2. data-i18n-html 속성 처리 (innerHTML - HTML 콘텐츠용)
        rootElement.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (key) {
                const translation = this.t(key);
                if (translation) {
                    el.innerHTML = translation;
                    // 번역이 있으면 표시
                    if (el.style.display === 'none') {
                        el.style.display = '';
                    }
                } else {
                    // 번역이 없으면 (빈 문자열) 숨김
                    el.style.display = 'none';
                }
            }
        });

        // 3. data-i18n-aria 속성 처리 (aria-label)
        rootElement.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            if (key) {
                const translation = this.t(key);
                if (translation) {
                    el.setAttribute('aria-label', translation);
                }
            }
        });

        // 4. data-i18n-placeholder 속성 처리 (placeholder)
        rootElement.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                const translation = this.t(key);
                if (translation) {
                    el.setAttribute('placeholder', translation);
                }
            }
        });
    }
}


// 싱글톤 인스턴스 생성
const i18nService = new I18nService();

// 전역 노출
window.I18nService = i18nService;
