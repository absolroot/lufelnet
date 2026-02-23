(function () {
    'use strict';

    const STORAGE_KEY_HIDE_UNTIL = 'home_account_notice_hide_until_v1';
    const STORAGE_KEY_HIDE_FOREVER = 'home_account_notice_hide_forever_v1';
    const HIDE_DURATION_MS = 24 * 60 * 60 * 1000;

    // KST 기준 수동 운영 날짜
    const NOTICE_START_AT = '2026-02-21T00:00:00+09:00';
    const NOTICE_END_AT = '2026-02-28T23:59:59+09:00';

    const OVERLAY_ID = 'homeAccountNoticeOverlay';
    const STYLE_ID = 'homeAccountNoticeStyle';

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

    function resolveUiLang(rawLang) {
        if (window.HomeI18n && typeof window.HomeI18n.resolveUiLang === 'function') {
            return window.HomeI18n.resolveUiLang(rawLang);
        }
        return rawLang === 'en' || rawLang === 'jp' ? rawLang : 'kr';
    }

    function t(key, fallback, rawLang) {
        if (window.HomeI18n && typeof window.HomeI18n.t === 'function') {
            return window.HomeI18n.t(key, fallback, rawLang);
        }
        return fallback;
    }

    function formatDeadline(date, uiLang) {
        const localeMap = {
            kr: 'ko-KR',
            en: 'en-US',
            jp: 'ja-JP'
        };
        const locale = localeMap[uiLang] || 'en-US';
        try {
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } catch (_) {
            return date.toISOString().slice(0, 10);
        }
    }

    function getHideUntil() {
        try {
            const v = Number(localStorage.getItem(STORAGE_KEY_HIDE_UNTIL) || '0');
            return Number.isFinite(v) ? v : 0;
        } catch (_) {
            return 0;
        }
    }

    function setHideUntil(ts) {
        try {
            if (!ts || ts <= 0) {
                localStorage.removeItem(STORAGE_KEY_HIDE_UNTIL);
                return;
            }
            localStorage.setItem(STORAGE_KEY_HIDE_UNTIL, String(ts));
        } catch (_) { }
    }

    function getHideForever() {
        try {
            return localStorage.getItem(STORAGE_KEY_HIDE_FOREVER) === '1';
        } catch (_) {
            return false;
        }
    }

    function setHideForever(enabled) {
        try {
            if (enabled) {
                localStorage.setItem(STORAGE_KEY_HIDE_FOREVER, '1');
                return;
            }
            localStorage.removeItem(STORAGE_KEY_HIDE_FOREVER);
        } catch (_) { }
    }

    function removeExistingModal() {
        const existing = document.getElementById(OVERLAY_ID);
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }
    }

    function ensureStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '#' + OVERLAY_ID + ' {',
            '  position: fixed;',
            '  inset: 0;',
            '  background: rgba(0, 0, 0, 0.68);',
            '  z-index: 10050;',
            '  display: flex;',
            '  align-items: center;',
            '  justify-content: center;',
            '  padding: 16px;',
            '}',
            '#' + OVERLAY_ID + ' .home-account-notice-modal {',
            '  width: min(680px, 100%);',
            '  max-height: 92vh;',
            '  overflow-y: auto;',
            '  background: #1f1f1f;',
            '  color: #f0f0f0;',
            '  border: 1px solid rgba(255, 255, 255, 0.18);',
            '  border-radius: 14px;',
            '  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);',
            '}',
            '#' + OVERLAY_ID + ' .notice-header {',
            '  display: flex;',
            '  align-items: center;',
            '  justify-content: space-between;',
            '  gap: 12px;',
            '  padding: 18px 20px 12px;',
            '}',
            '#' + OVERLAY_ID + ' .notice-title {',
            '  margin: 0;',
            '  font-size: 20px;',
            '  line-height: 1.3;',
            '  color: #ffd67d;',
            '}',
            '#' + OVERLAY_ID + ' .notice-body {',
            '  padding: 0 20px 10px;',
            '  line-height: 1.6;',
            '  font-size: 14px;',
            '}',
            '#' + OVERLAY_ID + ' .notice-list-title {',
            '  margin: 14px 0 8px;',
            '  font-size: 14px;',
            '  font-weight: 700;',
            '  color: #f8f8f8;',
            '}',
            '#' + OVERLAY_ID + ' .notice-list {',
            '  margin: 0;',
            '  padding-left: 20px;',
            '}',
            '#' + OVERLAY_ID + ' .notice-list li {',
            '  margin: 4px 0;',
            '}',
            '#' + OVERLAY_ID + ' .notice-footer {',
            '  border-top: 1px solid rgba(255, 255, 255, 0.14);',
            '  padding: 12px 20px 16px;',
            '  display: flex;',
            '  align-items: center;',
            '  justify-content: space-between;',
            '  gap: 10px;',
            '  flex-wrap: wrap;',
            '}',
            '#' + OVERLAY_ID + ' .notice-btn {',
            '  border: none;',
            '  border-radius: 8px;',
            '  padding: 9px 14px;',
            '  font-weight: 700;',
            '  cursor: pointer;',
            '}',
            '#' + OVERLAY_ID + ' .notice-btn-close {',
            '  background: rgba(255, 255, 255, 0.14);',
            '  color: #fff;',
            '}',
            '#' + OVERLAY_ID + ' .notice-check {',
            '  display: inline-flex;',
            '  align-items: center;',
            '  gap: 7px;',
            '  font-size: 13px;',
            '}',
            '#' + OVERLAY_ID + ' .notice-checks {',
            '  display: flex;',
            '  flex-direction: column;',
            '  gap: 6px;',
            '}',
            '@media (max-width: 640px) {',
            '  #' + OVERLAY_ID + ' .notice-header { padding: 14px 14px 10px; }',
            '  #' + OVERLAY_ID + ' .notice-body { padding: 0 14px 8px; }',
            '  #' + OVERLAY_ID + ' .notice-footer { padding: 12px 14px 14px; }',
            '  #' + OVERLAY_ID + ' .notice-title { font-size: 18px; }',
            '}'
        ].join('\n');

        document.head.appendChild(style);
    }

    function buildBodyText(rawLang, inGrace, deadlineText) {
        const template = inGrace
            ? t(
                'notice_modal_body_grace',
                'Lufelnet plans to test storage-related features. Existing local data may be lost when browser data is cleared. Please back up important data using each page backup/export feature. After {date}, local data retention may not be guaranteed.',
                rawLang
            )
            : t(
                'notice_modal_body_expired',
                'Lufelnet plans to test storage-related features. Local data retention may not be guaranteed. Please back up important data using available backup/export features.',
                rawLang
            );

        return String(template || '').replace('{date}', deadlineText);
    }

    function createList(items) {
        const ul = document.createElement('ul');
        ul.className = 'notice-list';
        items.forEach(function (txt) {
            const li = document.createElement('li');
            li.textContent = txt;
            ul.appendChild(li);
        });
        return ul;
    }

    function showNotice(rawLang, uiLang, inGrace, deadlineText) {
        removeExistingModal();
        ensureStyle();

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;

        const modal = document.createElement('div');
        modal.className = 'home-account-notice-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', t('notice_modal_title', 'Data Storage Notice', rawLang));

        const header = document.createElement('div');
        header.className = 'notice-header';

        const title = document.createElement('h3');
        title.className = 'notice-title';
        title.textContent = t('notice_modal_title', 'Data Storage Notice', rawLang);
        header.appendChild(title);

        const body = document.createElement('div');
        body.className = 'notice-body';

        const bodyP = document.createElement('p');
        bodyP.textContent = buildBodyText(rawLang, inGrace, deadlineText);
        body.appendChild(bodyP);

        const listTitle = document.createElement('div');
        listTitle.className = 'notice-list-title';
        listTitle.textContent = t('notice_modal_export_title', 'Pages with backup/export', rawLang);
        body.appendChild(listTitle);

        body.appendChild(createList([
            t('notice_modal_export_maps', 'Maps: Backup / Restore (Desktop only)', rawLang),
            t('notice_modal_export_material', 'Progression Calc: Backup / Load', rawLang),
            t('notice_modal_export_revelation_share', 'Revelation Share: Backup / Load (Desktop only)', rawLang),
            t('notice_modal_export_tactic_maker', 'Tactic Maker: Export / Import', rawLang),
            t('notice_modal_export_pull_tracker', 'Pull Tracker: Export / Import', rawLang)
        ]));

        const footer = document.createElement('div');
        footer.className = 'notice-footer';

        const checksWrap = document.createElement('div');
        checksWrap.className = 'notice-checks';

        const dayCheckWrap = document.createElement('label');
        dayCheckWrap.className = 'notice-check';
        const dayCheck = document.createElement('input');
        dayCheck.type = 'checkbox';
        dayCheck.id = 'homeAccountNoticeHideDay';
        const dayCheckText = document.createElement('span');
        dayCheckText.textContent = t('notice_modal_hide_day', 'Do not show again for 1 day', rawLang);
        dayCheckWrap.appendChild(dayCheck);
        dayCheckWrap.appendChild(dayCheckText);

        const foreverCheckWrap = document.createElement('label');
        foreverCheckWrap.className = 'notice-check';
        const foreverCheck = document.createElement('input');
        foreverCheck.type = 'checkbox';
        foreverCheck.id = 'homeAccountNoticeHideForever';
        const foreverCheckText = document.createElement('span');
        foreverCheckText.textContent = t('notice_modal_hide_forever', 'Do not show again', rawLang);
        foreverCheckWrap.appendChild(foreverCheck);
        foreverCheckWrap.appendChild(foreverCheckText);

        checksWrap.appendChild(dayCheckWrap);
        checksWrap.appendChild(foreverCheckWrap);
        footer.appendChild(checksWrap);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'notice-btn notice-btn-close';
        closeBtn.textContent = t('notice_modal_close', 'Close', rawLang);
        footer.appendChild(closeBtn);

        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        function onEsc(ev) {
            if (ev.key === 'Escape') {
                closeModal();
            }
        }

        function closeModal() {
            document.removeEventListener('keydown', onEsc);
            if (foreverCheck.checked) {
                setHideForever(true);
                setHideUntil(0);
            } else if (dayCheck.checked) {
                setHideForever(false);
                setHideUntil(Date.now() + HIDE_DURATION_MS);
            }
            removeExistingModal();
        }

        dayCheck.addEventListener('change', function () {
            if (dayCheck.checked) {
                foreverCheck.checked = false;
            }
        });

        foreverCheck.addEventListener('change', function () {
            if (foreverCheck.checked) {
                dayCheck.checked = false;
            }
        });

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) closeModal();
        });
        document.addEventListener('keydown', onEsc);

    }

    async function init() {
        await waitHomeI18nReady();

        const now = new Date();
        const startAt = new Date(NOTICE_START_AT);
        const endAt = new Date(NOTICE_END_AT);

        if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) return;
        if (now < startAt) return;
        if (getHideForever()) return;
        if (getHideUntil() > Date.now()) return;

        const rawLang = detectRawLang();
        const uiLang = resolveUiLang(rawLang);
        const inGrace = now <= endAt;
        const deadlineText = formatDeadline(endAt, uiLang);

        showNotice(rawLang, uiLang, inGrace, deadlineText);
    }

    document.addEventListener('DOMContentLoaded', function () {
        init().catch(function (error) {
            console.warn('[home-account-notice] failed to initialize:', error);
        });
    });
})();
