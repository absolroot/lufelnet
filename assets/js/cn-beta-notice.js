(function () {
    'use strict';

    const VERSION = '2026-04-v1';
    const STYLE_ID = 'cnBetaNoticeStyle';
    const OVERLAY_ID = 'cnBetaNoticeOverlay';
    const STORAGE_HIDE_FOREVER = 'cn_beta_notice_hide_forever_' + VERSION;
    const STORAGE_SEEN_SESSION = 'cn_beta_notice_seen_session_' + VERSION;

    function normalizeLang(raw) {
        const value = String(raw || '').trim().toLowerCase();
        if (value === 'ko') return 'kr';
        if (value === 'ja') return 'jp';
        if (value === 'zh' || value === 'zh-cn' || value === 'zh-hans') return 'cn';
        return value;
    }

    function isSupportedLang(value) {
        return value === 'kr' || value === 'en' || value === 'jp' || value === 'cn';
    }

    function detectCurrentLanguage() {
        try {
            if (window.LanguageRouter && typeof window.LanguageRouter.getCurrentLanguage === 'function') {
                const lang = normalizeLang(window.LanguageRouter.getCurrentLanguage());
                if (isSupportedLang(lang)) return lang;
            }
        } catch (_) { }

        try {
            if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
                const lang = normalizeLang(window.I18nService.getCurrentLanguage());
                if (isSupportedLang(lang)) return lang;
            }
        } catch (_) { }

        try {
            const queryLang = normalizeLang(new URLSearchParams(window.location.search).get('lang'));
            if (isSupportedLang(queryLang)) return queryLang;
        } catch (_) { }

        try {
            const pathLang = normalizeLang((window.location.pathname || '').split('/')[1]);
            if (isSupportedLang(pathLang)) return pathLang;
        } catch (_) { }

        try {
            const savedLang = normalizeLang(localStorage.getItem('preferredLanguage'));
            if (isSupportedLang(savedLang)) return savedLang;
        } catch (_) { }

        try {
            const savedLegacyLang = normalizeLang(localStorage.getItem('preferred_language'));
            if (isSupportedLang(savedLegacyLang)) return savedLegacyLang;
        } catch (_) { }

        try {
            const browserLang = normalizeLang(navigator.language || navigator.userLanguage || '');
            if (browserLang.startsWith('zh')) return 'cn';
            if (browserLang.startsWith('ja')) return 'jp';
            if (browserLang.startsWith('en')) return 'en';
        } catch (_) { }

        return 'kr';
    }

    function getNestedValue(obj, path) {
        if (!obj || typeof obj !== 'object') return undefined;
        const parts = String(path || '').split('.');
        let current = obj;
        for (let i = 0; i < parts.length; i += 1) {
            const part = parts[i];
            if (!part || current[part] === undefined) return undefined;
            current = current[part];
        }
        return current;
    }

    function getFallbackTranslations() {
        return {
            kr: {
                cnBetaNotice: {
                    title: '중국어 베타 서비스 안내',
                    bodyPrimary: '현재 중국어 페이지는 베타 서비스로 제공되며, 번역기를 통해 번역되어 일부 내용에 오역 또는 의역이 포함될 수 있습니다.',
                    bodySecondary: '또한 일부 콘텐츠는 번역이 제공되지 않아 한국어로 표기될 수 있습니다.',
                    dismissForever: '다시 보지 않기',
                    close: '확인'
                }
            },
            en: {
                cnBetaNotice: {
                    title: 'Chinese Localization Beta',
                    bodyPrimary: 'Chinese pages are currently provided through translation, so some sentences may sound awkward and some game terms may be inaccurate.',
                    bodySecondary: 'Some pages or UI strings may also remain untranslated or still appear in Korean. Thank you for your understanding.',
                    dismissForever: 'Do not show again',
                    close: 'OK'
                }
            },
            jp: {
                cnBetaNotice: {
                    title: '中国語ローカライズ Beta',
                    bodyPrimary: '中国語ページは翻訳ベースで提供されているため、一部の文章が不自然だったり、ゲーム用語が正確でない場合があります。',
                    bodySecondary: 'また、一部のページや文言は未翻訳のまま、または韓国語のまま表示される場合があります。ご了承ください。',
                    dismissForever: '今後表示しない',
                    close: '確認'
                }
            },
            cn: {
                cnBetaNotice: {
                    title: '中文 Beta 服务说明',
                    bodyPrimary: '当前中文页面以 Beta 服务形式提供，并通过翻译工具生成，因此部分内容可能存在误译或意译。',
                    bodySecondary: '另外，部分内容暂未提供中文翻译，因此可能仍会以韩文显示。',
                    dismissForever: '不再显示',
                    close: '确认'
                }
            }
        };
    }

    async function loadCommonTranslations(lang) {
        const globalVarName = 'I18N_COMMON_' + String(lang || '').toUpperCase();
        if (window[globalVarName]) return window[globalVarName];

        const service = window.I18nService || window.__I18nService__;
        if (!service || typeof service.loadCommonTranslations !== 'function') {
            return null;
        }

        try {
            await service.loadCommonTranslations(lang);
        } catch (_) { }

        return service.cache?.[lang]?.common || window[globalVarName] || null;
    }

    async function getText(lang, key, fallback) {
        const commonPack = await loadCommonTranslations(lang);
        const commonValue = getNestedValue(commonPack, key);
        if (commonValue !== undefined) return commonValue;

        const fallbackPack = getFallbackTranslations()[lang] || getFallbackTranslations().kr;
        const fallbackValue = getNestedValue(fallbackPack, key);
        if (fallbackValue !== undefined) return fallbackValue;

        return fallback;
    }

    function shouldSkip(lang) {
        if (lang !== 'cn') return true;
        try {
            if (localStorage.getItem(STORAGE_HIDE_FOREVER) === '1') return true;
        } catch (_) { }
        try {
            if (sessionStorage.getItem(STORAGE_SEEN_SESSION) === '1') return true;
        } catch (_) { }
        return false;
    }

    function markSeenForSession() {
        try {
            sessionStorage.setItem(STORAGE_SEEN_SESSION, '1');
        } catch (_) { }
    }

    function ensureStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '#' + OVERLAY_ID + ' {',
            '  position: fixed;',
            '  inset: 0;',
            '  display: flex;',
            '  align-items: center;',
            '  justify-content: center;',
            '  padding: 18px;',
            '  background: rgba(0, 0, 0, 0.72);',
            '  z-index: 10060;',
            '}',
            '#' + OVERLAY_ID + ' .cn-beta-notice-modal {',
            '  width: min(560px, 100%);',
            '  background: #171717;',
            '  color: #f6f6f6;',
            '  border: 1px solid rgba(255, 255, 255, 0.14);',
            '  border-radius: 14px;',
            '  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.48);',
            '  overflow: hidden;',
            '}',
            '#' + OVERLAY_ID + ' .cn-beta-notice-header {',
            '  padding: 18px 20px 10px;',
            '}',
            '#' + OVERLAY_ID + ' .cn-beta-notice-title {',
            '  margin: 0;',
            '  font-size: 20px;',
            '  line-height: 1.35;',
            '  color: #ffd36a;',
            '}',
            '#' + OVERLAY_ID + ' .cn-beta-notice-body {',
            '  padding: 0 20px 16px;',
            '  font-size: 14px;',
            '  line-height: 1.7;',
            '}',
            '#' + OVERLAY_ID + ' .cn-beta-notice-body p {',
            '  margin: 0 0 10px;',
            '}',
            '#' + OVERLAY_ID + ' .cn-beta-notice-footer {',
            '  display: flex;',
            '  align-items: center;',
            '  justify-content: space-between;',
            '  gap: 12px;',
            '  padding: 14px 20px 18px;',
            '  border-top: 1px solid rgba(255, 255, 255, 0.10);',
            '  flex-wrap: wrap;',
            '}',
            '#' + OVERLAY_ID + ' .cn-beta-notice-check {',
            '  display: inline-flex;',
            '  align-items: center;',
            '  gap: 8px;',
            '  font-size: 13px;',
            '}',
            '#' + OVERLAY_ID + ' .cn-beta-notice-close {',
            '  border: 0;',
            '  border-radius: 8px;',
            '  padding: 10px 14px;',
            '  background: #f04f43;',
            '  color: #fff;',
            '  font-weight: 700;',
            '  cursor: pointer;',
            '}',
            '@media (max-width: 640px) {',
            '  #' + OVERLAY_ID + ' { padding: 12px; }',
            '  #' + OVERLAY_ID + ' .cn-beta-notice-header { padding: 16px 16px 8px; }',
            '  #' + OVERLAY_ID + ' .cn-beta-notice-body { padding: 0 16px 14px; }',
            '  #' + OVERLAY_ID + ' .cn-beta-notice-footer { padding: 12px 16px 16px; }',
            '  #' + OVERLAY_ID + ' .cn-beta-notice-title { font-size: 18px; }',
            '}'
        ].join('\n');

        document.head.appendChild(style);
    }

    function removeExistingModal() {
        const existing = document.getElementById(OVERLAY_ID);
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }
    }

    async function showNotice(lang) {
        markSeenForSession();
        ensureStyle();
        removeExistingModal();

        const titleText = await getText(lang, 'cnBetaNotice.title', 'Chinese Localization Beta');
        const primaryText = await getText(lang, 'cnBetaNotice.bodyPrimary', 'Chinese pages are currently provided through translation.');
        const secondaryText = await getText(lang, 'cnBetaNotice.bodySecondary', 'Some pages or UI strings may remain untranslated.');
        const dismissText = await getText(lang, 'cnBetaNotice.dismissForever', 'Do not show again');
        const closeText = await getText(lang, 'cnBetaNotice.close', 'OK');

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;

        const modal = document.createElement('div');
        modal.className = 'cn-beta-notice-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', titleText);

        const header = document.createElement('div');
        header.className = 'cn-beta-notice-header';

        const title = document.createElement('h3');
        title.className = 'cn-beta-notice-title';
        title.textContent = titleText;
        header.appendChild(title);

        const body = document.createElement('div');
        body.className = 'cn-beta-notice-body';

        const primary = document.createElement('p');
        primary.textContent = primaryText;
        body.appendChild(primary);

        const secondary = document.createElement('p');
        secondary.textContent = secondaryText;
        body.appendChild(secondary);

        const footer = document.createElement('div');
        footer.className = 'cn-beta-notice-footer';

        const checkboxWrap = document.createElement('label');
        checkboxWrap.className = 'cn-beta-notice-check';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'cnBetaNoticeDismissForever';

        const checkboxText = document.createElement('span');
        checkboxText.textContent = dismissText;

        checkboxWrap.appendChild(checkbox);
        checkboxWrap.appendChild(checkboxText);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'cn-beta-notice-close';
        closeBtn.textContent = closeText;

        footer.appendChild(checkboxWrap);
        footer.appendChild(closeBtn);

        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        function closeModal() {
            if (checkbox.checked) {
                try {
                    localStorage.setItem(STORAGE_HIDE_FOREVER, '1');
                } catch (_) { }
            }
            removeExistingModal();
            document.removeEventListener('keydown', onKeydown);
        }

        function onKeydown(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        }

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) {
                closeModal();
            }
        });
        document.addEventListener('keydown', onKeydown);
    }

    async function init() {
        const lang = detectCurrentLanguage();
        if (shouldSkip(lang)) return;
        if (!document.body) return;
        await showNotice(lang);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            init().catch(function (error) {
                console.warn('[cn-beta-notice] failed to initialize:', error);
            });
        });
    } else {
        init().catch(function (error) {
            console.warn('[cn-beta-notice] failed to initialize:', error);
        });
    }
})();
