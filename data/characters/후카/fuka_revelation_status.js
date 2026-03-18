;(function () {
  if (typeof window === 'undefined') return;

  var TARGET_NAME = '후카';
  var CARD_ID = 'fuka-revelation-status-card';
  var STYLE_ID = 'fuka-revelation-status-style';
  var ACCORDION_STORAGE_KEY = 'fukaRevelationStatusAccordionExpanded';
  var BASE = typeof window.BASE_URL !== 'undefined' ? window.BASE_URL : '';

  window.FukaRevelationStatus = window.FukaRevelationStatus || {};
  window.FukaRevelationStatus[TARGET_NAME] = true;

  var ROWS = [
    {
      main: '창조',
      sub: '화해',
      effectStatus: { main: 'O', set2: 'O', set4: 'O' },
      note: '전투 시작 효과는 교체 진입 시에 발동된다.',
      note_en: 'Battle start effects activate when entering through a switch.',
      note_jp: '戦闘開始効果は交代で出場した際に発動する。'
    },
    {
      main: '신뢰',
      sub: '풍요',
      effectStatus: { main: 'O', set2: 'O', set4: 'O' },
      note: 'HIGHLIGHT 에너지 회복 효과는 교체와 동시에 발동되며, 동일한 효과를 가진 캐릭터와 교체 시 중복 발동 가능하다.',
      note_en: 'The HIGHLIGHT Energy recovery effect activates immediately upon switching, and can stack when switching with a character that has the same effect.',
      note_jp: 'HIGHLIGHTのエネルギー回復効果は交代と同時に発動し、同じ効果を持つキャラクターと交代した場合は重複発動が可能。'
    },
    {
      main: '여정',
      sub: '풍요',
      effectStatus: { main: 'O', set2: 'O', set4: 'O' },
      note: 'HIGHLIGHT 에너지 회복 효과는 교체와 동시에 발동되며, 동일한 효과를 가진 캐릭터와 교체 시 중복 발동 가능하다.',
      note_en: 'The HIGHLIGHT Energy recovery effect activates immediately upon switching, and can stack when switching with a character that has the same effect.',
      note_jp: 'HIGHLIGHTのエネルギー回復効果は交代と同時に発動し、同じ効果を持つキャラクターと交代した場合は重複発動が可能。'
    },
    {
      main: '신뢰',
      sub: '힘',
      effectStatus: { main: 'O', set2: 'O', set4: 'X' },
      note: '전투 시작 효과는 교체 진입 시에 발동된다. 4세트 효과는 6번 교체가 이루어져야하므로 실질적으로 불가능하다.',
      note_en: 'Battle start effects activate when entering through a switch. The 4-set effect requires 6 switches, so it is effectively impossible.',
      note_jp: '戦闘開始効果は交代で出場した際に発動する。4セット効果は6回の交代が必要なため、実質的に不可能。'
    },
    {
      main: '예리',
      sub: '방해',
      effectStatus: { main: 'X', set2: 'O', set4: 'O' },
      note: '',
      note_en: '',
      note_jp: ''
    },
    {
      main: '진정성',
      sub: '고집',
      effectStatus: { main: 'O', set2: 'O', set4: 'O' },
      note: '',
      note_en: '',
      note_jp: ''
    },
    {
      main: '자유',
      sub: '좌절',
      effectStatus: { main: 'X', set2: 'O', set4: 'O' },
      note: '',
      note_en: '',
      note_jp: ''
    }
  ];

  function t(key, fallback) {
    if (typeof window.t === 'function') {
      try {
        return window.t(key, fallback);
      } catch (_) {}
    }
    if (window.I18nService && typeof window.I18nService.t === 'function') {
      var translated = window.I18nService.t(key, fallback);
      if (translated && translated !== key) return translated;
    }
    return fallback || key;
  }

  function getCurrentLanguage() {
    try {
      if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
        var current = window.I18nService.getCurrentLanguage();
        if (current === 'en' || current === 'jp') return current;
      }
    } catch (_) {}

    try {
      var path = String(window.location.pathname || '');
      if (/^\/en(\/|$)/.test(path)) return 'en';
      if (/^\/jp(\/|$)/.test(path)) return 'jp';
    } catch (_) {}

    return 'kr';
  }

  function getCurrentCharacterName() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get('name') || window.__CHARACTER_DEFAULT || '';
    } catch (_) {
      return window.__CHARACTER_DEFAULT || '';
    }
  }

  function createElement(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text !== 'undefined') node.textContent = text;
    return node;
  }

  function getLocalizedRevelationData(lang) {
    if (lang === 'en' && window.enRevelationData) return window.enRevelationData;
    if (lang === 'jp' && window.jpRevelationData) return window.jpRevelationData;
    return window.revelationData || null;
  }

  function ensureLocalizedRevelationData(lang) {
    if (lang === 'kr') return Promise.resolve();
    if (lang === 'en' && window.enRevelationData) return Promise.resolve();
    if (lang === 'jp' && window.jpRevelationData) return Promise.resolve();

    window.__FukaRevelationStatusLoaders__ = window.__FukaRevelationStatusLoaders__ || {};
    if (window.__FukaRevelationStatusLoaders__[lang]) {
      return window.__FukaRevelationStatusLoaders__[lang];
    }

    var version = typeof APP_VERSION !== 'undefined' ? APP_VERSION : Date.now();
    var targets = {
      en: {
        url: BASE + '/data/en/revelations/revelations.js?v=' + version,
        from: 'const enRevelationData',
        to: 'window.enRevelationData'
      },
      jp: {
        url: BASE + '/data/jp/revelations/revelations.js?v=' + version,
        from: 'const jpRevelationData',
        to: 'window.jpRevelationData'
      }
    };
    var target = targets[lang];
    if (!target) return Promise.resolve();

    var loader = fetch(target.url)
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to load revelation data: ' + lang);
        return response.text();
      })
      .then(function (scriptContent) {
        var modifiedScript = scriptContent.replace(target.from, target.to);
        (0, eval)(modifiedScript);
      })
      .catch(function (error) {
        console.warn('[fuka_revelation_status] localized revelation load failed:', lang, error);
      });

    window.__FukaRevelationStatusLoaders__[lang] = loader;
    return loader;
  }

  function getTranslatedNameFallback(krName, isMain, lang) {
    var data = getLocalizedRevelationData(lang);
    if (!data) return krName;

    var translated = null;
    if (isMain && data.mainTranslated) translated = data.mainTranslated[krName];
    if (!isMain && data.subTranslated) translated = data.subTranslated[krName];

    if (!translated) {
      if (lang === 'en' && data.mapping_en) translated = data.mapping_en[krName];
      if (lang === 'jp' && data.mapping_jp) translated = data.mapping_jp[krName];
    }

    return translated || krName;
  }

  function getLocalizedName(krName, isMain, lang) {
    if (lang === 'kr') return krName;

    if (typeof window.translateRevelationName === 'function') {
      try {
        var translated = window.translateRevelationName(krName, isMain);
        if (translated) return translated;
      } catch (_) {}
    }

    return getTranslatedNameFallback(krName, isMain, lang);
  }

  function getSetEffectText(row, lang) {
    var keys = {
      main: lang === 'kr' ? row.main : getLocalizedName(row.main, true, lang),
      sub: lang === 'kr' ? row.sub : getLocalizedName(row.sub, false, lang)
    };
    var data = getLocalizedRevelationData(lang);
    var effect = data && data.set_effects && data.set_effects[keys.main] && data.set_effects[keys.main][keys.sub];

    if (!effect) {
      console.warn('[fuka_revelation_status] missing set effect:', row.main, row.sub, lang);
      return '-';
    }

    return effect;
  }

  function getSubEffectText(row, lang, setKey) {
    var subName = lang === 'kr' ? row.sub : getLocalizedName(row.sub, false, lang);
    var data = getLocalizedRevelationData(lang);
    var text = data && data.sub_effects && data.sub_effects[subName] && data.sub_effects[subName][setKey];

    if (!text) {
      console.warn('[fuka_revelation_status] missing sub effect:', row.sub, setKey, lang);
      return '-';
    }

    return text;
  }

  function getLocalizedNote(row, lang) {
    if (lang === 'en' && row.note_en) return row.note_en;
    if (lang === 'jp' && row.note_jp) return row.note_jp;
    return row.note || '';
  }

  function normalizeEffectStatus(row) {
    var status = row.effectStatus || {};
    return {
      main: status.main === 'X' ? 'X' : 'O',
      set2: status.set2 === 'X' ? 'X' : 'O',
      set4: status.set4 === 'X' ? 'X' : 'O'
    };
  }

  function getRowSortScore(row) {
    var status = normalizeEffectStatus(row);
    var score = 0;
    if (status.main === 'O') score += 1;
    if (status.set2 === 'O') score += 1;
    if (status.set4 === 'O') score += 1;
    return score;
  }

  function getSortedRows() {
    return ROWS.map(function (row, index) {
      return {
        main: row.main,
        sub: row.sub,
        effectStatus: normalizeEffectStatus(row),
        note: row.note,
        note_en: row.note_en,
        note_jp: row.note_jp,
        _index: index
      };
    }).sort(function (left, right) {
      var scoreDiff = getRowSortScore(right) - getRowSortScore(left);
      if (scoreDiff !== 0) return scoreDiff;
      return left._index - right._index;
    });
  }

  function createRevelationCell(row, isMain, lang) {
    var labelKey = isMain ? 'fukaRevelationStatusColMain' : 'fukaRevelationStatusColSub';
    var fallbackLabel = isMain ? '주 카드' : (lang === 'jp' ? '旭月星天' : (lang === 'en' ? 'S/M/S/S' : '일월성진'));
    var krName = isMain ? row.main : row.sub;
    var translated = getLocalizedName(krName, isMain, lang);

    var td = createElement('td', 'fuka-rs-cell');
    td.setAttribute('data-label', t(labelKey, fallbackLabel));

    var wrap = createElement('div', 'fuka-rs-revelation');
    var img = document.createElement('img');
    img.src = BASE + '/assets/img/revelation/' + krName + '.webp';
    img.alt = translated;
    img.className = 'fuka-rs-revelation-icon';
    wrap.appendChild(img);
    wrap.appendChild(createElement('span', 'fuka-rs-revelation-name', translated));
    td.appendChild(wrap);
    return td;
  }

  function createEffectBlock(label, value, options) {
    var block = createElement('div', 'fuka-rs-effect-block');
    var extraClass = options && options.extraClass;
    var status = options && options.status;
    var hideLabel = options && options.hideLabel;
    if (extraClass) block.classList.add(extraClass);

    var line = createElement('div', 'fuka-rs-effect-line');
    if (!hideLabel || status) {
      var header = createElement('div', 'fuka-rs-effect-header');
      if (status) {
        header.appendChild(createElement(
          'span',
          'fuka-rs-effect-status' + (status === 'O' ? ' is-active' : ' is-inactive'),
          status
        ));
      }
      if (!hideLabel) {
        header.appendChild(createElement('span', 'fuka-rs-effect-title', label));
      }
      line.appendChild(header);
    }
    line.appendChild(createElement('span', 'fuka-rs-effect-text', value || '-'));
    block.appendChild(line);
    return block;
  }

  function createEffectCell(row, lang) {
    var td = createElement('td', 'fuka-rs-cell');
    td.setAttribute('data-label', t('fukaRevelationStatusColEffects', '효과'));

    var blocks = createElement('div', 'fuka-rs-effect-blocks');
    blocks.appendChild(createEffectBlock(
      t('fukaRevelationStatusMainEffect', '주 세트효과'),
      getSetEffectText(row, lang),
      { status: row.effectStatus.main }
    ));
    blocks.appendChild(createEffectBlock(
      t('fukaRevelationStatusSubSet2', '2세트'),
      getSubEffectText(row, lang, 'set2'),
      { status: row.effectStatus.set2 }
    ));
    blocks.appendChild(createEffectBlock(
      t('fukaRevelationStatusSubSet4', '4세트'),
      getSubEffectText(row, lang, 'set4'),
      { status: row.effectStatus.set4 }
    ));

    var note = getLocalizedNote(row, lang);
    if (note) {
      blocks.appendChild(createEffectBlock(
        t('fukaRevelationStatusNote', '비고'),
        note,
        { extraClass: 'is-note', hideLabel: true }
      ));
    }

    td.appendChild(blocks);
    return td;
  }

  function getStoredAccordionExpanded() {
    try {
      var stored = window.localStorage && window.localStorage.getItem(ACCORDION_STORAGE_KEY);
      if (stored === '0') return false;
      if (stored === '1') return true;
    } catch (_) {}
    return false;
  }

  function setStoredAccordionExpanded(expanded) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(ACCORDION_STORAGE_KEY, expanded ? '1' : '0');
      }
    } catch (_) {}
  }

  function applyAccordionState(accordion, header, content, expanded) {
    accordion.classList.toggle('is-collapsed', !expanded);
    header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    content.hidden = !expanded;
  }

  function buildCard() {
    var lang = getCurrentLanguage();
    var card = createElement('div', 'fuka-rs-card card-style');
    card.id = CARD_ID;

    var accordion = createElement('div', 'fuka-rs-accordion');
    var header = createElement('button', 'fuka-rs-accordion-header');
    header.type = 'button';
    header.setAttribute('aria-controls', CARD_ID + '-content');
    header.appendChild(createElement('h2', 'fuka-rs-accordion-title', t('fukaRevelationStatusTitle', '후보 캐릭터 계시 효과 발동 여부')));

    var icon = createElement('span', 'fuka-rs-accordion-icon');
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = [
      '<svg viewBox="0 0 20 20" focusable="false">',
      '  <path class="fuka-rs-icon-line fuka-rs-icon-line-h" d="M4 10H16"></path>',
      '  <path class="fuka-rs-icon-line fuka-rs-icon-line-v" d="M10 4V16"></path>',
      '</svg>'
    ].join('');
    header.appendChild(icon);

    var content = createElement('div', 'fuka-rs-accordion-content');
    content.id = CARD_ID + '-content';

    var tableWrap = createElement('div', 'fuka-rs-table-wrap');
    var table = createElement('table', 'fuka-rs-table');
    var thead = document.createElement('thead');
    var headRow = document.createElement('tr');
    [
      t('fukaRevelationStatusColMain', '주 카드'),
      t('fukaRevelationStatusColSub', lang === 'jp' ? '旭月星天' : (lang === 'en' ? 'S/M/S/S' : '일월성진')),
      t('fukaRevelationStatusColEffects', '효과')
    ].forEach(function (label) {
      headRow.appendChild(createElement('th', '', label));
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    getSortedRows().forEach(function (row) {
      var tr = document.createElement('tr');
      tr.appendChild(createRevelationCell(row, true, lang));
      tr.appendChild(createRevelationCell(row, false, lang));
      tr.appendChild(createEffectCell(row, lang));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    tableWrap.appendChild(table);
    content.appendChild(tableWrap);
    accordion.appendChild(header);
    accordion.appendChild(content);
    card.appendChild(accordion);

    applyAccordionState(accordion, header, content, getStoredAccordionExpanded());

    header.addEventListener('click', function () {
      var nextExpanded = accordion.classList.contains('is-collapsed');
      applyAccordionState(accordion, header, content, nextExpanded);
      setStoredAccordionExpanded(nextExpanded);
    });

    return card;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.fuka-rs-card{padding-bottom:24px}',
      '.fuka-rs-accordion{display:flex;flex-direction:column}',
      '.fuka-rs-accordion-header{position:relative;display:block;width:100%;padding:0;border:none;background:transparent;color:inherit;text-align:left;cursor:pointer;font:inherit}',
      '.fuka-rs-accordion-title{display:block;width:100%;box-sizing:border-box;margin:14.94px 0;padding:10px 36px 20px 0;border-bottom:.571429px solid rgba(255,255,255,.1);color:rgba(255,255,255,.8);font-family:EnglishFont, JapaneseFont, "Noto Sans", "Apple SD Gothic Neo", "Open Sans", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;font-size:18px;font-weight:600;line-height:27px;letter-spacing:-.32px}',
      '.fuka-rs-accordion-icon{position:absolute;top:50%;right:0;transform:translateY(-50%);display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:999px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}',
      '.fuka-rs-accordion-icon svg{width:14px;height:14px;stroke:rgba(255,255,255,.72);stroke-width:1.8;stroke-linecap:round;fill:none}',
      '.fuka-rs-icon-line{transition:opacity .16s ease, transform .16s ease}',
      '.fuka-rs-accordion:not(.is-collapsed) .fuka-rs-icon-line-v{opacity:0}',
      '.fuka-rs-accordion-content{padding-top:16px}',
      '.fuka-rs-table-wrap{margin-top:4px}',
      '.fuka-rs-table{width:100%;border-collapse:collapse;table-layout:fixed}',
      '.fuka-rs-table th,.fuka-rs-table td{padding:14px 12px;border-bottom:1px solid rgba(255,255,255,.1);text-align:left;vertical-align:top}',
      '.fuka-rs-table th{font-size:13px;color:rgba(255,255,255,.55);font-weight:600;background:rgba(255,255,255,.03)}',
      '.fuka-rs-table tbody tr:hover{background:rgba(255,255,255,.025)}',
      '.fuka-rs-table th:nth-child(1),.fuka-rs-table td:nth-child(1),.fuka-rs-table th:nth-child(2),.fuka-rs-table td:nth-child(2){width:160px}',
      '.fuka-rs-cell::before{display:none}',
      '.fuka-rs-revelation{display:flex;align-items:center;gap:10px;min-width:0}',
      '.fuka-rs-revelation-icon{width:34px;height:34px;object-fit:contain;flex-shrink:0}',
      '.fuka-rs-revelation-name{color:rgba(255,255,255,.92);font-size:14px;font-weight:600;word-break:keep-all;min-width:0;flex:1 1 auto}',
      '.fuka-rs-effect-blocks{display:flex;flex-direction:column;gap:4px}',
      '.fuka-rs-effect-block{padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.14);border:1px solid rgba(255,255,255,.06);min-width:0;box-sizing:border-box}',
      '.fuka-rs-effect-block.is-note{background:rgba(255,255,255,.04)}',
      '.fuka-rs-effect-line{display:flex;flex-wrap:wrap;gap:8px;align-items:center;min-width:0}',
      '.fuka-rs-effect-header{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto;min-width:0}',
      '.fuka-rs-effect-title{font-size:12px;font-weight:700;color:#ffdb70;flex:0 0 auto}',
      '.fuka-rs-effect-status{display:inline-flex;min-width:20px;height:20px;padding:0 6px;align-items:center;justify-content:center;border-radius:999px;font-size:11px;font-weight:700;line-height:1}',
      '.fuka-rs-effect-status.is-active{background:rgba(81,207,102,.18);color:#7ce492}',
      '.fuka-rs-effect-status.is-inactive{background:rgba(255,107,107,.16);color:#ff8f8f}',
      '.fuka-rs-effect-text{font-size:13px;line-height:1.6;color:rgba(255,255,255,.82);word-break:break-word;overflow-wrap:anywhere;flex:1 1 260px;min-width:0}',
      '@media (max-width:768px){',
      '  .fuka-rs-accordion-content{padding-top:12px}',
      '  .fuka-rs-accordion-title{margin:14.94px 0;padding:10px 36px 20px 0}',
      '  .fuka-rs-table,.fuka-rs-table tbody,.fuka-rs-table tr,.fuka-rs-table td{display:block;width:100%}',
      '  .fuka-rs-table thead{display:none}',
      '  .fuka-rs-table tbody{display:flex;flex-direction:column;gap:12px}',
      '  .fuka-rs-table tbody tr{display:grid;width:100%;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;padding:14px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.03);box-sizing:border-box;overflow:hidden}',
      '  .fuka-rs-table tbody tr:hover{background:rgba(255,255,255,.03)}',
      '  .fuka-rs-table td{border-bottom:none;padding:0;margin:0;min-width:0;box-sizing:border-box}',
      '  .fuka-rs-table td:nth-child(3){grid-column:1 / -1}',
      '  .fuka-rs-cell::before{display:none}',
      '  .fuka-rs-revelation{min-width:0}',
      '  .fuka-rs-revelation-name{padding-top:6px;word-break:keep-all;overflow-wrap:break-word}',
      '  .fuka-rs-effect-blocks{gap:4px}',
      '  .fuka-rs-effect-block{padding:9px 10px;width:100%}',
      '  .fuka-rs-effect-line{display:flex;flex-wrap:wrap;align-items:center;min-width:0;width:100%}',
      '  .fuka-rs-effect-header{display:inline-flex;align-items:center;gap:6px;min-width:0}',
      '  .fuka-rs-effect-title{display:inline;margin-right:0}',
      '  .fuka-rs-effect-text{display:inline;white-space:normal;flex-basis:100%}',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function removeCard() {
    var card = document.getElementById(CARD_ID);
    if (card && card.parentNode) card.parentNode.removeChild(card);
  }

  function mountCard() {
    if (getCurrentCharacterName() !== TARGET_NAME) {
      removeCard();
      return;
    }

    ensureStyles();

    var reviewCard = document.querySelector('.review-card.card-style');
    if (!reviewCard || !reviewCard.parentNode) return;

    var card = buildCard();
    var current = document.getElementById(CARD_ID);
    if (current && current.parentNode) {
      current.parentNode.replaceChild(card, current);
      return;
    }

    var settingsCard = document.querySelector('.settings-card.card-style');
    if (settingsCard && settingsCard.parentNode === reviewCard.parentNode) {
      reviewCard.parentNode.insertBefore(card, settingsCard);
      return;
    }

    reviewCard.insertAdjacentElement('afterend', card);
  }

  function registerLanguageHook() {
    if (window.__FukaRevelationStatusHookRegistered__) return;
    if (!window.I18nService || typeof window.I18nService.onLanguageChange !== 'function') return;

    window.__FukaRevelationStatusHookRegistered__ = true;
    window.I18nService.onLanguageChange(function () {
      render();
    });
  }

  function render() {
    ensureLocalizedRevelationData(getCurrentLanguage()).then(function () {
      mountCard();
    });
  }

  function init() {
    render();
    registerLanguageHook();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
