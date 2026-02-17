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

// console.log('[I18nService] Script started loading...');

(function () {
    // 싱글톤 패턴: 이미 초기화되어 있다면 재실행 방지
    if (window.I18nService) {
        console.log('[I18nService] Service already initialized. Skipping re-initialization.');
        return;
    }

    class _I18nService {
        constructor() {
            // URL에서 언어 감지
            this.currentLang = this._detectLanguageFromURL();
            this.supportedLanguages = ['kr', 'en', 'jp'];
            this.fallbackLanguage = 'kr';

            // 캐시: { lang: { common: {...}, pages: { pageName: {...} } } }
            this.cache = {};

            // 현재 페이지 이름
            this.currentPage = null;

            // 언어 변경 리스너들
            this.languageChangeListeners = [];

            // 번역 파일 베이스 경로
            this.basePath = '/i18n'; // 기본값

            // 1. SITE_BASEURL 전역 변수 확인
            if (typeof window.SITE_BASEURL !== 'undefined') {
                this.basePath = window.SITE_BASEURL + '/i18n';
            }
            // 2. 스크립트 위치 기반 자동 감지 (권장)
            else if (document.currentScript) {
                const src = document.currentScript.src;
                // 예: .../i18n/service/i18n-service.js
                const serviceIndex = src.indexOf('/service/i18n-service.js');
                if (serviceIndex !== -1) {
                    this.basePath = src.substring(0, serviceIndex);
                    // console.log('[I18nService] Auto-detected basePath:', this.basePath);
                }
            }

            // 역조회 캐시: 한국어 값 → 영어 키
            this._reverseLookupCache = null;
            this._statTranslationCache = {};
            this._sortedStatKeysCache = {};

            // 기본은 조용한 모드, ?i18nDebug=1 에서만 상세 로그 출력
            this.debug = false;
            try {
                this.debug = new URLSearchParams(window.location.search).get('i18nDebug') === '1';
            } catch (_) { }

            // console.log('[I18nService] Detected language:', this.currentLang);
        }


        /**
         * URL에서 언어 감지
         * @private
         * @returns {string} - 감지된 언어 코드
         */
        _detectLanguageFromURL() {
            try {
                // 1. URL 쿼리 파라미터 확인 (?lang=en)
                const urlParams = new URLSearchParams(window.location.search);
                const langParam = urlParams.get('lang');
                if (langParam && ['kr', 'en', 'jp'].includes(langParam)) {
                    return langParam;
                }

                // 2. 경로 확인 (/en/, /jp/)
                const path = window.location.pathname;
                if (path.includes('/en/')) return 'en';
                if (path.includes('/jp/')) return 'jp';

                // 3. localStorage 확인
                const savedLang = localStorage.getItem('preferredLanguage');
                if (savedLang && ['kr', 'en', 'jp'].includes(savedLang)) {
                    return savedLang;
                }
            } catch (e) {
                console.warn('[I18nService] Failed to detect language:', e);
            }

            return 'kr';
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

                // 역조회를 위해 kr 번역 항상 로드
                if (this.currentLang !== 'kr') {
                    await this.loadCommonTranslations('kr');
                }

                // 공통 번역 로드
                await this.loadCommonTranslations();

                // 페이지별 번역 로드 (페이지 이름이 제공된 경우)
                if (pageName) {
                    this.currentPage = pageName;
                    await this.loadPageTranslations(pageName);
                }

                // console.log(`[I18nService] Initialized with language: ${this.currentLang}, page: ${pageName || 'none'}`);
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

            // 전역 변수 이름 (예: I18N_COMMON_KR, I18N_COMMON_EN, I18N_COMMON_JP)
            const globalVarName = `I18N_COMMON_${targetLang.toUpperCase()}`;

            // 이미 로드되어 있는지 확인
            if (window[globalVarName]) {
                const translations = window[globalVarName];
                if (!this.cache[targetLang]) {
                    this.cache[targetLang] = {};
                }
                this.cache[targetLang].common = translations;
                delete this._statTranslationCache[targetLang];
                delete this._sortedStatKeysCache[targetLang];
                return translations;
            }

            try {
                // 스크립트 태그로 로드
                await this._loadScript(`${this.basePath}/common/${targetLang}.js`);

                const translations = window[globalVarName] || {};

                // 캐시에 저장
                if (!this.cache[targetLang]) {
                    this.cache[targetLang] = {};
                }
                this.cache[targetLang].common = translations;
                delete this._statTranslationCache[targetLang];
                delete this._sortedStatKeysCache[targetLang];

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
         * 스크립트 파일 동적 로드
         * @private
         * @param {string} src - 스크립트 경로
         * @returns {Promise<void>}
         */
        _loadScript(src) {
            return new Promise((resolve, reject) => {
                // 이미 로드된 스크립트인지 확인
                // 파일명만 체크하면 common/kr.js 때문에 pages/revelation/kr.js가 로드되지 않음
                // 따라서 경로가 포함되어 있는지 확인 (src*="...")
                const existing = document.querySelector(`script[src*="${src}"]`);
                if (existing) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
                document.head.appendChild(script);
            });
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

            // 전역 변수 이름 (예: I18N_PAGE_REVELATION_EN)
            const pageVarName = pageName.toUpperCase().replace(/-/g, '_');
            const globalVarName = `I18N_PAGE_${pageVarName}_${targetLang.toUpperCase()}`;

            // 이미 로드되어 있는지 확인
            if (window[globalVarName]) {
                console.log(`[I18nService] Global variable ${globalVarName} found.`);
                const translations = window[globalVarName];
                if (!this.cache[targetLang]) {
                    this.cache[targetLang] = {};
                }
                if (!this.cache[targetLang].pages) {
                    this.cache[targetLang].pages = {};
                }
                this.cache[targetLang].pages[pageName] = translations;
                return translations;
            }

            try {
                const scriptPath = `${this.basePath}/pages/${pageName}/${targetLang}.js`;
                // console.log(`[I18nService] Loading page translations from: ${scriptPath}`);

                // 스크립트 태그로 로드
                await this._loadScript(scriptPath);

                const translations = window[globalVarName] || {};
                // console.log(`[I18nService] Loaded translations for ${pageName}/${targetLang}`, translations ? Object.keys(translations).length : 'empty');

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

            // Debug log for key lookup
            // console.log(`[I18nService] Translating '${key}' for lang '${lang}' (Page: ${this.currentPage})`);

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

            // 4. 실패 시 키 반환 (상세 로그는 debug 모드에서만 출력)
            if (this.debug) {
                console.warn(`[I18nService] Missing translation: ${key} (lang: ${lang})`);

                if (this.currentPage) {
                    const pageCache = this.cache[lang]?.pages?.[this.currentPage];
                    if (pageCache) {
                        console.log(`Cache keys for ${this.currentPage}:`, Object.keys(pageCache));
                        console.log(`Key '${key}' in cache:`, pageCache[key] !== undefined);
                    } else {
                        console.log(`Cache empty or invalid for ${this.currentPage} (lang: ${lang})`);
                        if (this.cache[lang]) console.log('Cache structure:', Object.keys(this.cache[lang]));
                    }
                }
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
            this._reverseLookupCache = null;
            this._statTranslationCache = {};
            this._sortedStatKeysCache = {};
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

            // 5. document.title 업데이트 (pageTitleFull 키 사용)
            if (rootElement === document) {
                const pageTitle = this.t('pageTitleFull');
                if ((!document.title || !document.title.trim()) && pageTitle && pageTitle !== 'pageTitleFull') {
                    document.title = pageTitle;
                }
            }
        }

        // ============================================
        // I18NUtils 호환 메서드 (backward compatibility)
        // ============================================

        /**
         * 현재 언어를 안전하게 반환 (폴백 포함)
         * I18NUtils.getCurrentLanguageSafe() 호환
         * @returns {string}
         */
        getCurrentLanguageSafe() {
            return this.currentLang || 'kr';
        }

        // ============================================
        // 역조회 기반 번역 메서드 (i18n-utils.js 대체)
        // ============================================

        /**
         * 역조회 캐시 빌드 (kr.js의 모든 섹션에서 값→키 매핑 생성)
         * @private
         */
        _buildReverseLookup() {
            if (this._reverseLookupCache) return;

            const krCommon = this.cache['kr']?.common;
            if (!krCommon) {
                console.warn('[I18nService] Korean translations not loaded for reverse lookup');
                return;
            }

            this._reverseLookupCache = {};

            // 역조회할 섹션들
            const sections = ['gameTerms', 'awarenessLevel', 'refinement', 'turns', 'elements', 'ailments', 'positions', 'revelation'];

            sections.forEach(section => {
                const sectionData = krCommon[section];
                if (sectionData && typeof sectionData === 'object') {
                    Object.entries(sectionData).forEach(([key, krValue]) => {
                        if (typeof krValue === 'string') {
                            // 한국어 값 → { section, key } 매핑
                            this._reverseLookupCache[krValue] = { section, key };
                        }
                    });
                }
            });

            if (this.debug) {
                console.log(`[I18nService] Built reverse lookup cache with ${Object.keys(this._reverseLookupCache).length} entries`);
            }
        }

        /**
         * 역조회 캐시 초기화 (언어 변경 시 호출)
         * @private
         */
        _invalidateReverseLookup() {
            this._reverseLookupCache = null;
            this._statTranslationCache = {};
            this._sortedStatKeysCache = {};
        }

        /**
         * 한국어 텍스트를 현재 언어로 번역
         * @param {string} koreanText - 한국어 텍스트
         * @returns {string} - 번역된 텍스트 또는 원본
         */
        translateTerm(koreanText) {
            if (!koreanText || this.currentLang === 'kr') return koreanText;

            this._buildReverseLookup();

            const lookup = this._reverseLookupCache?.[koreanText];
            if (!lookup) return koreanText;

            const { section, key } = lookup;
            const translated = this.cache[this.currentLang]?.common?.[section]?.[key];

            return translated || koreanText;
        }

        /**
         * 현재 언어를 안전하게 반환 (폴백 포함)
         * I18NUtils.getCurrentLanguageSafe() 호환
         * @returns {string}
         */
        getCurrentLanguageSafe() {
            return this.currentLang || 'kr';
        }

        /**
         * 스탯 번역 사전 반환 (하위 호환성)
         * 새 구조에서는 gameTerms 등을 합쳐서 반환
         * @returns {Object}
         */
        getStatTranslations() {
            this._buildReverseLookup();
            if (!this._reverseLookupCache) {
                return {};
            }
            const targetLang = this.currentLang;
            const targetCommon = this.cache[targetLang]?.common;
            if (!targetCommon) {
                // common 번역이 아직 로드되지 않았으면 빈 결과를 즉시 반환하고 캐시하지 않는다.
                return {};
            }
            if (this._statTranslationCache[targetLang]) {
                return this._statTranslationCache[targetLang];
            }

            const dict = {};

            // 역조회 캐시를 사용해 Korean→Target 사전 생성
            Object.entries(this._reverseLookupCache).forEach(([koreanText, { section, key }]) => {
                const translated = targetCommon?.[section]?.[key];
                if (translated && translated !== koreanText) {
                    dict[koreanText] = translated;
                }
            });

            this._statTranslationCache[targetLang] = dict;
            this._sortedStatKeysCache[targetLang] = Object.keys(dict).sort((a, b) => b.length - a.length);
            return dict;
        }

        /**
         * 단일 스탯 용어 번역
         * @param {string} koreanTerm - 한국어 스탯 용어
         * @returns {string} - 번역된 용어 또는 원본
         */
        getStatTranslation(koreanTerm) {
            return this.translateTerm(koreanTerm);
        }

        /**
         * DOM 요소 내 텍스트 일괄 번역
         * I18NUtils.translateStatTexts() 대체
         * @param {Element} root - 탐색할 루트 요소
         */
        translateDOM(root = document) {
            if (this.currentLang === 'kr') return;

            const dict = this.getStatTranslations();
            if (!dict || Object.keys(dict).length === 0) return;
            if (this.debug) {
                console.log(`[I18nService] translateDOM: dictionary size = ${Object.keys(dict).length}`);
            }

            // 긴 키부터 먼저 처리 (부분 매칭 방지)
            const sortedKeys = this._sortedStatKeysCache[this.currentLang] || Object.keys(dict).sort((a, b) => b.length - a.length);
            const keyRegexCache = {};
            const replaceText = (text) => {
                if (!text) return text;
                let output = text;
                for (const ko of sortedKeys) {
                    if (!output.includes(ko)) continue;
                    if (!keyRegexCache[ko]) {
                        keyRegexCache[ko] = new RegExp(ko.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                    }
                    output = output.replace(keyRegexCache[ko], dict[ko]);
                }
                return output;
            };
            const applyToElement = (el) => {
                if (!el || el.children.length !== 0) return;
                const original = el.textContent || '';
                if (!original) return;
                const replaced = replaceText(original);
                if (replaced !== original) {
                    el.textContent = replaced;
                }
            };

            const targetSelectors = [
                '.stat-label',
                '.value',
                '.option-row .value',
                '.stat-value',
                '.stat-row .label',
                '.skill-level .label',
                '.operation-label',
                '.operation-note',
                '.mind-stats .label',
                '.mind-skills .label',
                'h1',
                'h2',
                'h3',
                'h4',
                'p',
                'span',
                'li',
                'button',
                'a',
                'strong',
                'small'
            ];

            const seen = new Set();
            root.querySelectorAll(targetSelectors.join(',')).forEach((el) => {
                if (seen.has(el)) return;
                seen.add(el);
                applyToElement(el);
            });

            if (root instanceof Element) {
                applyToElement(root);
            }
        }

        /**
         * 하위 호환성 - translateStatTexts는 translateDOM으로 연결
         * @param {Element} root
         */
        translateStatTexts(root = document) {
            this.translateDOM(root);
        }

        /**
         * 심상5 텍스트 언어별 치환
         * I18NUtils.replaceMindText() 호환
         * @param {string} text - 원본 텍스트
         * @returns {string} - 치환된 텍스트
         */
        replaceMindText(text) {
            const minds5 = this.cache[this.currentLang]?.common?.gameTerms?.minds5;
            const replacement = minds5 || (this.currentLang === 'jp' ? 'イメジャリー5' : (this.currentLang === 'en' ? 'Mindscape5' : '심상5'));
            return text.replace(/심상\s?5/g, replacement);
        }
    }


    // 싱글톤 인스턴스 생성
    // console.log('[I18nService] Creating singleton instance...');
    const i18nService = new _I18nService();

    // 전역 노출
    window.I18nService = i18nService;
    // console.log('[I18nService] Script loaded successfully, window.I18nService =', typeof window.I18nService);

})();
