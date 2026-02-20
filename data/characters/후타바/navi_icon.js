;(function () {
  if (typeof window === 'undefined') return;

  // 로더(loadPerCharacterResource)에서 성공 여부를 확인하기 위한 플래그
  window.NaviIcons = window.NaviIcons || {};
  window.NaviIcons['후타바'] = true;

  const TARGET_NAMES = new Set([
    '후타바',
    '사쿠라 후타바',
    'Futaba Sakura',
    '佐倉 双葉',
    'NAVI',
    'ORACLE'
  ]);

  const CODENAME_FALLBACK = 'NAVI / ORACLE';
  const TOOLTIP_FALLBACK = {
    kr: '아시아에서는 NAVI라고 불리지만 GLB에서는 ORACLE로 표기됩니다. 현 사이트에서는 공통적인 코드네임을 통해 기능하므로 NAVI로 명명합니다.',
    en: 'In Asia, she is called NAVI, but in GLB she is labeled ORACLE. This site uses shared codenames for feature compatibility, so she is named NAVI.',
    jp: 'アジアではNAVIと呼ばれますが、GLBではORACLE表記です。このサイトは共通コードネームで機能するため、NAVIで表記します。'
  };

  const INFO_ICON_SVG =
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>' +
    '<path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>' +
    '</svg>';

  function getCurrentLanguage() {
    try {
      const path = window.location.pathname || '';
      if (path.includes('/en/')) return 'en';
      if (path.includes('/jp/')) return 'jp';
      if (path.includes('/cn/')) return 'cn';

      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      if (langParam === 'en' || langParam === 'jp' || langParam === 'cn') return langParam;
    } catch (_) { }
    return 'kr';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getCharacterText(key, fallback) {
    try {
      if (typeof window.getCharacterI18nText === 'function') {
        return window.getCharacterI18nText(key, fallback);
      }
    } catch (_) { }
    try {
      if (typeof window.t === 'function') {
        return window.t(key, fallback);
      }
    } catch (_) { }
    return fallback;
  }

  function ensureNaviStyles() {
    if (document.getElementById('navi-codename-style')) return;

    const style = document.createElement('style');
    style.id = 'navi-codename-style';
    style.textContent = `
      .navi-codename-tooltip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        margin-left: 6px;
        cursor: help;
        position: relative;
        color: rgba(255, 255, 255, 0.5);
        vertical-align: middle;
      }
      .navi-codename-tooltip svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      .navi-codename-tooltip:hover,
      .navi-codename-tooltip.js-tooltip-active,
      .navi-codename-tooltip:focus-visible {
        color: rgba(255, 255, 255, 0.82);
      }
    `;
    document.head.appendChild(style);
  }

  function isTargetCharacter(name) {
    return TARGET_NAMES.has(String(name || '').trim());
  }

  function bindTooltip(el) {
    if (!el) return;
    try {
      if (typeof window.bindTooltipElement === 'function') {
        window.bindTooltipElement(el);
        return;
      }
    } catch (_) { }

    try {
      if (typeof window.addTooltips === 'function') {
        window.addTooltips();
      }
    } catch (_) { }
  }

  function applyNaviCodenameOverride() {
    try {
      let name = '';
      try {
        const params = new URLSearchParams(window.location.search);
        name = params.get('name') || window.__CHARACTER_DEFAULT || '';
      } catch (_) {
        name = window.__CHARACTER_DEFAULT || '';
      }

      if (!isTargetCharacter(name)) return;

      const codeEl = document.querySelector('.code-name');
      if (!codeEl) return;

      ensureNaviStyles();

      const lang = getCurrentLanguage();
      const codeNameLabel = getCharacterText('characterDetailCodeName', '코드네임');
      const codenameValue = getCharacterText('characterDetailNaviCodenameValue', CODENAME_FALLBACK);
      const tooltipText = getCharacterText('characterDetailNaviCodenameTooltip', TOOLTIP_FALLBACK[lang] || TOOLTIP_FALLBACK.kr);

      const escapedLabel = escapeHtml(codeNameLabel);
      const escapedCodename = escapeHtml(codenameValue);
      const escapedTooltip = escapeHtml(tooltipText);

      codeEl.innerHTML = `
        <span class="label">${escapedLabel} </span>
        <span class="value">${escapedCodename}</span>
        <span class="tooltip-icon tooltip-text navi-codename-tooltip" data-tooltip="${escapedTooltip}" aria-label="${escapedTooltip}" tabindex="0">
          ${INFO_ICON_SVG}
        </span>
      `;

      bindTooltip(codeEl.querySelector('.navi-codename-tooltip'));
    } catch (e) {
      console.warn('[navi_icon] applyNaviCodenameOverride error', e);
    }
  }

  window.applyNaviCodenameOverride = applyNaviCodenameOverride;
})();
