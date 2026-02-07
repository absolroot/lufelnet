// I18NUtils 호환 레이어 - I18nService로 위임
// 기존 코드 호환성 유지용. 새 코드는 I18nService를 직접 사용하세요.

(function () {
    'use strict';

    let _isReady = false;
    const _pendingCalls = [];

    // I18nService 준비될 때까지 대기
    const waitForService = (callback, maxWait = 10000) => {
        const start = Date.now();
        const check = () => {
            if (window.I18nService) {
                callback();
            } else if (Date.now() - start < maxWait) {
                setTimeout(check, 50);
            }
        };
        check();
    };

    // 보류된 번역 호출 실행
    const flushPendingCalls = () => {
        _isReady = true;
        while (_pendingCalls.length > 0) {
            const { root } = _pendingCalls.shift();
            try {
                window.I18nService.translateDOM(root);
            } catch (e) {
                console.warn('[I18NUtils] Deferred translateDOM failed:', e);
            }
        }
    };

    // I18NUtils 호환 인터페이스
    const I18NUtils = {
        getCurrentLanguageSafe() {
            if (window.I18nService) {
                return window.I18nService.getCurrentLanguageSafe();
            }
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const urlLang = urlParams.get('lang');
                if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) return urlLang;
                const savedLang = localStorage.getItem('preferredLanguage');
                if (savedLang && ['kr', 'en', 'jp'].includes(savedLang)) return savedLang;
            } catch (_) { }
            return 'kr';
        },

        get statTranslations() {
            if (window.I18nService && _isReady) {
                const dict = window.I18nService.getStatTranslations();
                return { kr: {}, en: dict, jp: dict };
            }
            return { kr: {}, en: {}, jp: {} };
        },

        translateStatTexts(root = document) {
            if (_isReady && window.I18nService) {
                window.I18nService.translateDOM(root);
            } else {
                // 아직 준비 안됨 - 보류 큐에 추가
                _pendingCalls.push({ root });
            }
        },

        replaceMindText(text) {
            if (window.I18nService) {
                return window.I18nService.replaceMindText(text);
            }
            return text;
        }
    };

    window.I18NUtils = I18NUtils;

    // window.translateStatTexts도 대기 큐를 타도록 오버라이드
    const originalTranslateStatTexts = window.translateStatTexts;
    window.translateStatTexts = function (root) {
        if (!window.I18nService || window.I18nService.currentLang === 'kr') {
            // kr이거나 서비스가 없으면 그냥 실행 (혹은 원본 실행)
            if (typeof originalTranslateStatTexts === 'function') originalTranslateStatTexts(root);
            return;
        }

        // 번역 로딩 대기 후 실행
        waitForService(() => {
            if (window.I18nService) window.I18nService.translateStatTexts(root);
        });
    };

    // 초기화 시 kr 번역 미리 로드 후 보류 호출 실행
    waitForService(async () => {
        try {
            // kr 번역 먼저 로드 (역조회용)
            await window.I18nService.loadCommonTranslations('kr');
            // 현재 언어 번역 로드
            const lang = window.I18nService.currentLang || 'kr';
            if (lang !== 'kr') {
                await window.I18nService.loadCommonTranslations(lang);
            }
            // 준비 완료 - 보류된 호출 실행
            flushPendingCalls();
        } catch (e) {
            console.warn('[I18NUtils] Failed to preload translations:', e);
            _isReady = true; // 에러 발생해도 계속 진행
        }
    });
})();
