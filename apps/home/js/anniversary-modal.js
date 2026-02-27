(function () {
    'use strict';

    const DEFAULT_CONFIG = {
        enabled: true,
        modalVersion: '2026-1st-anniversary-v1',
        showOncePerVersion: true,
        startAt: null,
        endAt: null,
        imageSrc: '/assets/img/home/Texture-huigui-qiribg03.png'
    };

    const STYLE_ID = 'homeAnniversaryModalStyle';
    const OVERLAY_ID = 'homeAnniversaryModalOverlay';
    const STORAGE_PREFIX = 'home_anniversary_modal_hidden_';

    function waitHomeI18nReady() {
        if (!window.__HOME_I18N_READY__) return Promise.resolve();
        return Promise.resolve(window.__HOME_I18N_READY__).catch(function () { });
    }

    function detectRawLang() {
        if (window.HomeI18n && typeof window.HomeI18n.detectRawLang === 'function') {
            return window.HomeI18n.detectRawLang();
        }
        return 'kr';
    }

    function t(key, fallback, rawLang) {
        if (window.HomeI18n && typeof window.HomeI18n.t === 'function') {
            return window.HomeI18n.t(key, fallback, rawLang);
        }
        return fallback;
    }

    function getConfig() {
        const runtimeConfig = (window.HOME_ANNIVERSARY_MODAL_CONFIG && typeof window.HOME_ANNIVERSARY_MODAL_CONFIG === 'object')
            ? window.HOME_ANNIVERSARY_MODAL_CONFIG
            : {};

        return Object.assign({}, DEFAULT_CONFIG, runtimeConfig);
    }

    function parseDateOrNull(value) {
        if (!value) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    function isInActiveWindow(config) {
        const now = new Date();
        const startAt = parseDateOrNull(config.startAt);
        const endAt = parseDateOrNull(config.endAt);

        if (startAt && now < startAt) return false;
        if (endAt && now > endAt) return false;
        return true;
    }

    function getStorageKey(config) {
        return STORAGE_PREFIX + String(config.modalVersion || 'default');
    }

    function isDismissed(config) {
        if (!config.showOncePerVersion) return false;
        try {
            return localStorage.getItem(getStorageKey(config)) === '1';
        } catch (_) {
            return false;
        }
    }

    function setDismissed(config) {
        if (!config.showOncePerVersion) return;
        try {
            localStorage.setItem(getStorageKey(config), '1');
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
            '  z-index: 10060;',
            '  display: flex;',
            '  align-items: center;',
            '  justify-content: center;',
            '  padding: 16px;',
            '  background: rgba(0, 0, 0, 0.72);',
            '}',
            '#' + OVERLAY_ID + ' .anniversary-modal {',
            '  width: min(560px, 100%);',
            '  border-radius: 16px;',
            '  border: 1px solid rgba(255, 255, 255, 0.2);',
            '  background: linear-gradient(180deg, #2b2b2b 0%, #1e1e1e 100%);',
            '  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);',
            '  color: #f7f7f7;',
            '  padding: 20px;',
            '}',
            '#' + OVERLAY_ID + ' .anniversary-image-wrap {',
            '  display: flex;',
            '  justify-content: center;',
            '  margin-bottom: 14px;',
            '}',
            '#' + OVERLAY_ID + ' .anniversary-image {',
            '  width: min(100%, 420px);',
            '  max-height: 320px;',
            '  height: auto;',
            '  object-fit: contain;',
            '  border-radius: 10px;',
            '  display: block;',
            '}',
            '#' + OVERLAY_ID + ' .anniversary-title {',
            '  margin: 0 0 10px;',
            '  font-size: 24px;',
            '  line-height: 1.3;',
            '  text-align: center;',
            '  color: #ffe4a0;',
            '}',
            '#' + OVERLAY_ID + ' .anniversary-message {',
            '  margin: 0;',
            '  text-align: center;',
            '  font-size: 15px;',
            '  line-height: 1.6;',
            '  color: rgba(255, 255, 255, 0.92);',
            '}',
            '#' + OVERLAY_ID + ' .anniversary-message + .anniversary-message {',
            '  margin-top: 6px;',
            '}',
            '#' + OVERLAY_ID + ' .anniversary-footer {',
            '  margin-top: 16px;',
            '  display: flex;',
            '  flex-direction: column;',
            '  align-items: center;',
            '  gap: 10px;',
            '}',
            '#' + OVERLAY_ID + ' .anniversary-option {',
            '  display: inline-flex;',
            '  align-items: center;',
            '  gap: 8px;',
            '  font-size: 13px;',
            '  line-height: 1.4;',
            '  color: rgba(255, 255, 255, 0.88);',
            '  cursor: pointer;',
            '  user-select: none;',
            '}',
            '#' + OVERLAY_ID + ' .anniversary-option input {',
            '  width: 16px;',
            '  height: 16px;',
            '  cursor: pointer;',
            '  accent-color: #ffd67d;',
            '}',
            '#' + OVERLAY_ID + ' .anniversary-close {',
            '  border: none;',
            '  border-radius: 10px;',
            '  padding: 10px 20px;',
            '  font-size: 14px;',
            '  font-weight: 700;',
            '  color: #121212;',
            '  background: #ffd67d;',
            '  cursor: pointer;',
            '}',
            '@media (max-width: 520px) {',
            '  #' + OVERLAY_ID + ' .anniversary-modal {',
            '    padding: 16px 14px;',
            '    border-radius: 14px;',
            '  }',
            '  #' + OVERLAY_ID + ' .anniversary-title {',
            '    font-size: 20px;',
            '  }',
            '}'
        ].join('\n');

        document.head.appendChild(style);
    }

    function removeModal() {
        const existing = document.getElementById(OVERLAY_ID);
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }
    }

    function showModal(config, rawLang) {
        ensureStyle();
        removeModal();

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;

        const modal = document.createElement('div');
        modal.className = 'anniversary-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', t('anniversary_modal_title', 'Lufelnet 1st Anniversary', rawLang));

        const imageWrap = document.createElement('div');
        imageWrap.className = 'anniversary-image-wrap';
        const image = document.createElement('img');
        image.className = 'anniversary-image';
        image.src = String(config.imageSrc || DEFAULT_CONFIG.imageSrc);
        image.alt = t('anniversary_modal_image_alt', 'Lufelnet 1st anniversary image', rawLang);
        imageWrap.appendChild(image);

        const title = document.createElement('h3');
        title.className = 'anniversary-title';
        title.textContent = t('anniversary_modal_title', 'Lufelnet 1st Anniversary', rawLang);

        const line1 = document.createElement('p');
        line1.className = 'anniversary-message';
        line1.textContent = t('anniversary_modal_line1', 'On 26.02.27, Lufelnet reached its 1st anniversary.', rawLang);

        const line2 = document.createElement('p');
        line2.className = 'anniversary-message';
        line2.textContent = t('anniversary_modal_line2', 'Thank you sincerely for using Lufelnet.', rawLang);

        const footer = document.createElement('div');
        footer.className = 'anniversary-footer';

        const hideOptionLabel = document.createElement('label');
        hideOptionLabel.className = 'anniversary-option';
        const hideOptionCheck = document.createElement('input');
        hideOptionCheck.type = 'checkbox';
        hideOptionCheck.id = 'homeAnniversaryHideForever';
        const hideOptionText = document.createElement('span');
        hideOptionText.textContent = t('anniversary_modal_hide_forever', 'Do not show again', rawLang);
        hideOptionLabel.appendChild(hideOptionCheck);
        hideOptionLabel.appendChild(hideOptionText);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'anniversary-close';
        closeBtn.textContent = t('anniversary_modal_close', 'Close', rawLang);
        footer.appendChild(hideOptionLabel);
        footer.appendChild(closeBtn);

        modal.appendChild(imageWrap);
        modal.appendChild(title);
        modal.appendChild(line1);
        modal.appendChild(line2);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        function close(shouldPersistDismiss) {
            document.removeEventListener('keydown', onEsc);
            hideOptionCheck.removeEventListener('change', onHideOptionChange);
            if (shouldPersistDismiss) {
                setDismissed(config);
            }
            removeModal();
        }

        function onEsc(event) {
            if (event.key === 'Escape') close(false);
        }

        function onHideOptionChange() {
            if (hideOptionCheck.checked) {
                close(true);
            }
        }

        hideOptionCheck.addEventListener('change', onHideOptionChange);
        closeBtn.addEventListener('click', function () {
            close(false);
        });
        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) close(false);
        });
        document.addEventListener('keydown', onEsc);
    }

    async function init() {
        await waitHomeI18nReady();

        const config = getConfig();
        if (!config.enabled) return;
        if (!isInActiveWindow(config)) return;
        if (isDismissed(config)) return;

        const rawLang = detectRawLang();
        showModal(config, rawLang);
    }

    document.addEventListener('DOMContentLoaded', function () {
        init().catch(function (error) {
            console.warn('[home-anniversary-modal] failed to initialize:', error);
        });
    });
})();
