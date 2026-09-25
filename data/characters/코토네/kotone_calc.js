;(function () {
  if (typeof window === 'undefined') return;

  var CHARACTER_NAME = '코토네';
  var MODE_IDS = ['r0', 'r1', 'r2', 'r6'];
  var VARIANT_IDS = ['standard', 'miku'];
  var MODE_LABELS = {
    kr: { r0: '의식 0', r1: '의식 1', r2: '의식 2', r6: '의식 6' },
    en: { r0: 'Awareness 0', r1: 'Awareness 1', r2: 'Awareness 2', r6: 'Awareness 6' },
    jp: { r0: '意識 0', r1: '意識 1', r2: '意識 2', r6: '意識 6' },
    cn: { r0: '意识 0', r1: '意识 1', r2: '意识 2', r6: '意识 6' }
  };
  var VARIANT_LABELS = {
    kr: { standard: '일반(6턴)', miku: '미쿠(8턴)' },
    en: { standard: 'Standard (6 turns)', miku: 'Miku (8 turns)' },
    jp: { standard: '通常（6ターン）', miku: '初音ミク（8ターン）' },
    cn: { standard: '普通（6回合）', miku: '初音未来（8回合）' }
  };
  var VARIANT_MOBILE_LABELS = {
    kr: { standard: '일반(6턴)', miku: '미쿠(8턴)' },
    en: { standard: 'Standard (6 turns)', miku: 'Miku (8 turns)' },
    jp: { standard: '通常(6T)', miku: 'ミク(8T)' },
    cn: { standard: '普通（6回合）', miku: '初音未来（8回合）' }
  };
  var BUFF_VISIBILITY_STORAGE_KEY = 'kotone-operation-buffs-visible';
  var activeMode = 'r0';
  var activeVariant = 'standard';
  var showActiveBuffs = readBuffVisibility();
  var observerStarted = false;

  function readBuffVisibility() {
    try {
      return window.localStorage.getItem(BUFF_VISIBILITY_STORAGE_KEY) === 'true';
    } catch (_) {
      return false;
    }
  }

  window.KotoneCalc = window.KotoneCalc || {};
  window.KotoneCalc[CHARACTER_NAME] = true;

  function isKotonePage() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      return params.get('name') === CHARACTER_NAME || window.__CHARACTER_DEFAULT === CHARACTER_NAME;
    } catch (_) {
      return window.__CHARACTER_DEFAULT === CHARACTER_NAME;
    }
  }

  function getLanguage() {
    try {
      var path = window.location.pathname || '';
      if (path.indexOf('/en/') !== -1) return 'en';
      if (path.indexOf('/jp/') !== -1) return 'jp';
      if (path.indexOf('/cn/') !== -1) return 'cn';
    } catch (_) {}
    return 'kr';
  }

  function ensureStyles() {
    if (document.getElementById('kotone-operation-style')) return;
    var style = document.createElement('style');
    style.id = 'kotone-operation-style';
    style.textContent = [
      '.kotone-operation-tabs{display:flex;flex-direction:column;gap:.6rem;margin:0 0 1.25rem}.kotone-operation-mode-tabs{display:flex;flex-wrap:wrap;gap:.5rem}.kotone-operation-variant-row{display:flex;align-items:center;gap:.5rem;min-width:0}.kotone-operation-variant-tabs{display:flex;flex-wrap:wrap;gap:.375rem;min-width:0}.kotone-operation-variant-row[hidden],.kotone-operation-variant-tab[hidden]{display:none}',
      '.kotone-operation-tab{border:0;border-radius:999px;padding:.5rem 1rem;background:rgba(255,255,255,.1);color:rgba(255,255,255,.58);font-size:13px;font-weight:600;cursor:pointer;transition:background .16s ease,color .16s ease,box-shadow .16s ease}',
      '.kotone-operation-tab:hover{background:rgba(255,255,255,.16);color:#fff}',
      '.kotone-operation-tab.active{background:rgba(0,0,0,.1);color:#fff;box-shadow:inset 0 0 0 1px rgba(64,160,255,.72)}',
      '.kotone-operation-variant-tab{border:0;border-bottom:2px solid transparent;border-radius:0;padding:.4rem .25rem .3rem;background:transparent;color:rgba(255,255,255,.58);font-size:12px;font-weight:600;white-space:nowrap;cursor:pointer}.kotone-operation-variant-tab:hover{color:#fff}.kotone-operation-variant-tab.active{color:#fff;border-bottom-color:#ffb7d2}',
      '.kotone-buff-toggle{display:inline-flex;align-items:center;flex:none;gap:.45rem;margin-left:0;color:rgba(255,255,255,.7);font-size:13px;font-weight:600;cursor:pointer;user-select:none}',
      '.kotone-buff-toggle input{appearance:none;position:relative;width:34px;height:18px;margin:0;border:0;border-radius:999px;background:rgba(255,255,255,.18);cursor:pointer;transition:background .16s ease}',
      '.kotone-buff-toggle input::after{content:"";position:absolute;top:3px;left:3px;width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.72);transition:transform .16s ease,background .16s ease}',
      '.kotone-buff-toggle input:checked{background:rgba(231,58,137,.72)}',
      '.kotone-buff-toggle input:checked::after{transform:translateX(16px);background:#fff}',
      '.kotone-buff-toggle:hover{color:#fff}',
      '@media (min-width:768px){.kotone-operation-variant-row .kotone-buff-toggle{margin-left:.5rem}}',
      '.operation-settings.kotone-operation-buffs-hidden .operation-timeline-row--buffs,.operation-settings.kotone-operation-buffs-hidden .operation-timeline-row--lunar-bond,.operation-settings.kotone-operation-buffs-hidden .operation-timeline-row--powerful-bond{display:none}',
      '.operation-settings .operation-row.kotone-operation-hidden{display:none!important}',
      '.operation-row--timeline[data-operation-variant]{display:block}.operation-row--timeline[data-operation-variant] .operation-value{min-width:0;margin-left:0}.operation-timeline-scroll{overflow-x:auto;padding-bottom:9px;box-sizing:border-box;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.32) transparent}',
      '.kotone-operation-timeline{width:724px;min-width:724px;border-collapse:collapse;table-layout:fixed;border:1px solid rgba(255,255,255,.13)}.kotone-operation-timeline.operation-timeline--6-turns{width:564px;min-width:564px}.kotone-operation-timeline.operation-timeline--english{width:770px;min-width:770px}.kotone-operation-timeline.operation-timeline--english.operation-timeline--6-turns{width:610px;min-width:610px}.kotone-operation-timeline th,.kotone-operation-timeline td{padding:7px 5px;text-align:center;vertical-align:middle;font-size:12px;line-height:1.35;border-top:1px solid rgba(255,255,255,.11);border-bottom:1px solid rgba(255,255,255,.11)}.kotone-operation-timeline tr:first-child th,.kotone-operation-timeline tr:first-child td{border-top:0}.kotone-operation-timeline tr:last-child th,.kotone-operation-timeline tr:last-child td{border-bottom:0}.kotone-operation-timeline th{width:84px;color:#aaa;font-weight:600;background:rgba(255,255,255,.05);white-space:nowrap}.kotone-operation-timeline.operation-timeline--english th{width:130px}.kotone-operation-timeline td{width:80px;max-width:80px;color:rgba(255,255,255,.88);background:rgba(255,255,255,.02)}',
      '.kotone-operation-timeline .operation-timeline-row--turns td{position:relative}.kotone-operation-timeline .operation-timeline-row--turns td:not(:last-child)::after{content:"›";position:absolute;z-index:2;top:50%;right:-9px;width:18px;text-align:center;transform:translateY(-50%);color:rgba(255,255,255,.42);font-size:17px;font-weight:700;pointer-events:none}.kotone-operation-timeline .operation-timeline-row--buffs td{vertical-align:top;font-size:11px}.kotone-operation-timeline .operation-timeline-row--lunar-bond td{font-size:11px}.kotone-operation-timeline .kotone-lunar-bond-low{color:rgba(255,255,255,.3)}.kotone-operation-timeline .kotone-reserved{display:none}.kotone-operation-timeline .operation-timeline-row--turns td:has(+ .kotone-reserved)::after{display:none}.kotone-operation-timeline .kotone-fatigue{color:rgba(255,255,255,.48);background:rgba(0,0,0,.16)}.kotone-operation-timeline .kotone-low-stack{color:rgba(255,255,255,.3)}.kotone-operation-timeline .kotone-stacked-buffs{line-height:1.65}.kotone-operation-timeline .kotone-skill-three{font-weight:600}.kotone-operation-timeline .kotone-full-power{color:#ffd9ea;font-weight:700;background:rgba(231,58,137,1);border-color:rgba(255,166,210,.52);border-bottom-color:transparent}',
      '.kotone-operation-timeline .operation-buff-slots{vertical-align:top!important;padding:7px 2px!important}.kotone-operation-timeline .operation-buff-slots-inner{display:grid;grid-template-columns:max-content;width:max-content;max-width:100%;margin-inline:auto;text-align:left}.kotone-operation-timeline .operation-buff-slot{display:block;min-height:1.65em;line-height:1.65;text-align:left;white-space:nowrap}.kotone-operation-timeline .operation-buff-slot:empty::before{content:attr(data-slot-label);opacity:.15}.kotone-operation-timeline .operation-stack-dots{display:inline-flex;gap:2px;margin-left:3px;vertical-align:middle;opacity:.9}.kotone-operation-timeline .operation-stack-dots--full{opacity:1}.kotone-operation-timeline .operation-stack-dots i{display:block;width:3px;height:3px;border-radius:50%;background:currentColor}.kotone-operation-timeline.operation-timeline--english .operation-buff-slot{font-size:10px}',
      '.operation-settings:not(.kotone-operation-buffs-hidden) .kotone-operation-timeline .operation-timeline-row--buffs th,.operation-settings:not(.kotone-operation-buffs-hidden) .kotone-operation-timeline .operation-timeline-row--buffs td{border-top:2px solid rgba(255,255,255,.28)}',
      '.operation-timeline-scroll::-webkit-scrollbar{height:5px}.operation-timeline-scroll::-webkit-scrollbar-track{background:transparent}.operation-timeline-scroll::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.28)}',
      '.kotone-operation-mobile-legend{display:none}',
      '@media (max-width:767px){.kotone-operation-tab{font-size:0}.kotone-operation-tab::after{content:attr(data-kotone-mobile-label);font-size:13px}.kotone-operation-variant-tabs{flex-wrap:nowrap;flex:1;overflow-x:auto;scrollbar-width:none}.kotone-operation-variant-tabs::-webkit-scrollbar{display:none}.kotone-operation-variant-tab{font-size:0;padding:.35rem .25rem}.kotone-operation-variant-tab::after{content:attr(data-kotone-mobile-label);font-size:11px}.kotone-buff-toggle{font-size:12px}.operation-settings .operation-note--mobile-hidden{display:none}.kotone-operation-mobile-legend{display:flex;flex-wrap:wrap;gap:6px 12px;margin:0 0 6px;color:#aaa;font-size:11px}.kotone-operation-mobile-legend-item{display:inline-flex;align-items:center;white-space:nowrap}.kotone-operation-mobile-legend .operation-timeline-row-icon{width:15px;height:15px;margin-right:3px;vertical-align:0}.operation-timeline-scroll{-webkit-overflow-scrolling:touch}.kotone-operation-timeline,.kotone-operation-timeline.operation-timeline--english{width:430px;min-width:430px}.kotone-operation-timeline.operation-timeline--6-turns,.kotone-operation-timeline.operation-timeline--english.operation-timeline--6-turns{width:334px;min-width:334px}.kotone-operation-timeline th,.kotone-operation-timeline.operation-timeline--english th{display:table-cell;width:40px;white-space:nowrap;font-size:11px}.kotone-operation-timeline .operation-timeline-row--powerful-bond th,.kotone-operation-timeline .operation-timeline-row--lunar-bond th{font-size:0}.kotone-operation-timeline .operation-timeline-row--powerful-bond th .operation-timeline-row-icon,.kotone-operation-timeline .operation-timeline-row--lunar-bond th .operation-timeline-row-icon{width:18px;height:18px;margin:0;vertical-align:middle}.kotone-operation-timeline td{width:auto;max-width:none;padding:5px 1px;font-size:11px}.kotone-operation-timeline .operation-timeline-row--turns td:not(:last-child)::after{right:-8px;font-size:15px}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function emphasizeStandaloneSkillThree(cell) {
    var text = cell.textContent || '';
    if (text.trim() !== '3') return;
    cell.textContent = '';
    var three = document.createElement('span');
    three.className = 'kotone-skill-three';
    three.textContent = '3';
    cell.appendChild(three);
  }

  function stackBuffLines(cell) {
    var text = cell.textContent || '';
    var parts = text.split(' · ');
    if (parts.length < 2) return;
    cell.textContent = '';
    parts.forEach(function (part, index) {
      if (index) cell.appendChild(document.createElement('br'));
      cell.appendChild(document.createTextNode(part));
    });
    cell.classList.add('kotone-stacked-buffs');
  }

  function decorateTimelines(operationSettings) {
    if (!operationSettings) return;
    operationSettings.querySelectorAll('.operation-timeline').forEach(function (table) {
      if (table.getAttribute('data-kotone-timeline-presented') === 'true') return;
      table.setAttribute('data-kotone-timeline-presented', 'true');
      table.classList.add('kotone-operation-timeline');

      var turnCells = table.querySelectorAll('.operation-timeline-row--turns td');
      var skillRow = table.querySelector('.operation-timeline-row--skills');
      var skillCells = skillRow ? skillRow.querySelectorAll('td') : [];
      var buffCells = table.querySelectorAll('.operation-timeline-row--buffs td');
      var lunarBondCells = table.querySelectorAll('.operation-timeline-row--lunar-bond td');
      var powerfulBondCells = table.querySelectorAll('.operation-timeline-row--powerful-bond td');

      turnCells.forEach(function (turnCell, index) {
        if ((turnCell.textContent || '').trim() !== '') return;
        [turnCell, skillCells[index], buffCells[index], lunarBondCells[index], powerfulBondCells[index]].forEach(function (cell) {
          if (cell) cell.classList.add('kotone-reserved');
        });
      });

      skillCells.forEach(function (cell) {
        var skill = (cell.textContent || '').trim();
        if (cell.getAttribute('data-operation-fatigue') === 'true' || skill === '감기' || skill === 'Fatigue' || skill === '疲労' || skill === '疲劳') {
          cell.classList.add('kotone-fatigue');
        }
        if (cell.getAttribute('data-operation-full-power') === 'true' || skill.split('+').filter(Boolean).length >= 3) cell.classList.add('kotone-full-power');
        emphasizeStandaloneSkillThree(cell);
      });

      buffCells.forEach(function (cell) {
        if (cell.classList.contains('operation-buff-slots')) return;
        stackBuffLines(cell);
      });

      lunarBondCells.forEach(function (cell) {
        var lunarBond = (cell.textContent || '').trim();
        if (/^\d+$/.test(lunarBond) && lunarBond !== '10') cell.classList.add('kotone-lunar-bond-low');
      });

      powerfulBondCells.forEach(function (cell) {
        var powerfulBond = (cell.textContent || '').trim();
        if (/^\d+$/.test(powerfulBond) && powerfulBond !== '3') cell.classList.add('kotone-low-stack');
      });
    });
  }

  function updateRows(operationSettings) {
    if (!operationSettings) return;
    decorateTimelines(operationSettings);
    var rows = Array.from(operationSettings.querySelectorAll('.operation-row[data-operation-group]'));
    var availableVariants = VARIANT_IDS.filter(function (variant) {
      return rows.some(function (row) {
        return row.getAttribute('data-operation-group') === activeMode && row.getAttribute('data-operation-variant') === variant;
      });
    });
    if (availableVariants.length && availableVariants.indexOf(activeVariant) === -1) activeVariant = availableVariants[0];
    rows.forEach(function (row) {
      var visible = row.getAttribute('data-operation-group') === activeMode && row.getAttribute('data-operation-variant') === activeVariant;
      row.classList.toggle('kotone-operation-hidden', !visible);
    });
    operationSettings.querySelectorAll('[data-kotone-operation-mode]').forEach(function (button) {
      var selected = button.getAttribute('data-kotone-operation-mode') === activeMode;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
    var variantRow = operationSettings.querySelector('.kotone-operation-variant-row');
    if (variantRow) variantRow.hidden = !availableVariants.length;
    operationSettings.querySelectorAll('.kotone-operation-variant-tab').forEach(function (button) {
      var variant = button.getAttribute('data-kotone-operation-variant');
      var selected = variant === activeVariant;
      button.hidden = availableVariants.indexOf(variant) === -1;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
    operationSettings.classList.toggle('kotone-operation-buffs-hidden', !showActiveBuffs);
    operationSettings.querySelectorAll('[data-kotone-buff-visibility]').forEach(function (input) {
      input.checked = showActiveBuffs;
      input.setAttribute('aria-checked', showActiveBuffs ? 'true' : 'false');
    });
  }

  function ensureTabs(operationSettings) {
    if (!operationSettings) return;
    operationSettings.classList.remove('kotone-operation-lang-kr', 'kotone-operation-lang-en', 'kotone-operation-lang-jp', 'kotone-operation-lang-cn');
    operationSettings.classList.add(`kotone-operation-lang-${getLanguage()}`);
    var levels = operationSettings.querySelector('.operation-levels');
    if (!levels || !levels.querySelector('.operation-row[data-operation-group]')) return;
    var tabs = operationSettings.querySelector('.kotone-operation-tabs');
    if (!tabs) {
      tabs = document.createElement('div');
      tabs.className = 'kotone-operation-tabs';
      var modeTabs = document.createElement('div');
      modeTabs.className = 'kotone-operation-mode-tabs';
      var labels = MODE_LABELS[getLanguage()] || MODE_LABELS.kr;
      MODE_IDS.forEach(function (mode) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'kotone-operation-tab';
        button.textContent = getLanguage() === 'en' ? `A${mode.slice(1)}` : labels[mode];
        button.setAttribute('data-kotone-operation-mode', mode);
        button.setAttribute('aria-label', labels[mode]);
        button.setAttribute('data-kotone-mobile-label', `A${mode.slice(1)}`);
        modeTabs.appendChild(button);
      });
      var variantTabs = document.createElement('div');
      variantTabs.className = 'kotone-operation-variant-tabs';
      var variantRow = document.createElement('div');
      variantRow.className = 'kotone-operation-variant-row';
      var variantLabels = VARIANT_LABELS[getLanguage()] || VARIANT_LABELS.kr;
      var mobileVariantLabels = VARIANT_MOBILE_LABELS[getLanguage()] || VARIANT_MOBILE_LABELS.kr;
      VARIANT_IDS.forEach(function (variant) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'kotone-operation-variant-tab';
        button.textContent = variantLabels[variant];
        button.setAttribute('data-kotone-operation-variant', variant);
        button.setAttribute('data-kotone-mobile-label', mobileVariantLabels[variant]);
        button.setAttribute('aria-label', variantLabels[variant]);
        variantTabs.appendChild(button);
      });
      var buffToggle = document.createElement('label');
      buffToggle.className = 'kotone-buff-toggle';
      var buffInput = document.createElement('input');
      buffInput.type = 'checkbox';
      buffInput.checked = showActiveBuffs;
      buffInput.setAttribute('role', 'switch');
      buffInput.setAttribute('aria-checked', showActiveBuffs ? 'true' : 'false');
      buffInput.setAttribute('data-kotone-buff-visibility', 'true');
      var buffText = document.createElement('span');
      buffText.textContent = ({
        kr: '활성 버프',
        en: 'Active buffs',
        jp: '有効な強化効果',
        cn: '生效增益'
      })[getLanguage()] || '활성 버프';
      buffToggle.appendChild(buffInput);
      buffToggle.appendChild(buffText);
      tabs.appendChild(modeTabs);
      variantRow.appendChild(variantTabs);
      variantRow.appendChild(buffToggle);
      tabs.appendChild(variantRow);
      levels.parentNode.insertBefore(tabs, levels);
    }
    if (!operationSettings.querySelector('.kotone-operation-mobile-legend')) {
      var firstTimeline = operationSettings.querySelector('.operation-timeline');
      if (firstTimeline) {
        var legend = document.createElement('div');
        legend.className = 'kotone-operation-mobile-legend';
        ['powerful-bond', 'lunar-bond'].forEach(function (rowName) {
          var heading = firstTimeline.querySelector('.operation-timeline-row--' + rowName + ' th');
          if (!heading) return;
          var item = document.createElement('span');
          item.className = 'kotone-operation-mobile-legend-item';
          var icon = heading.querySelector('img');
          if (icon) {
            var legendIcon = icon.cloneNode(false);
            legendIcon.removeAttribute('aria-hidden');
            legendIcon.alt = '';
            item.appendChild(legendIcon);
          }
          item.appendChild(document.createTextNode((heading.textContent || '').trim()));
          legend.appendChild(item);
        });
        if (legend.childNodes.length) tabs.insertAdjacentElement('afterend', legend);
      }
    }
    if (!operationSettings.__kotoneOperationEventsBound) {
      operationSettings.__kotoneOperationEventsBound = true;
      operationSettings.addEventListener('click', function (event) {
        var target = event.target;
        if (!target || typeof target.closest !== 'function') return;
        var button = target.closest('[data-kotone-operation-mode]');
        if (button && operationSettings.contains(button)) {
          var mode = button.getAttribute('data-kotone-operation-mode');
          if (MODE_IDS.indexOf(mode) === -1) return;
          activeMode = mode;
          updateRows(operationSettings);
          return;
        }
        button = target.closest('.kotone-operation-variant-tab');
        if (!button || !operationSettings.contains(button)) return;
        var variant = button.getAttribute('data-kotone-operation-variant');
        if (VARIANT_IDS.indexOf(variant) === -1) return;
        activeVariant = variant;
        updateRows(operationSettings);
      });
      operationSettings.addEventListener('change', function (event) {
        var input = event.target;
        if (!input || !input.matches || !input.matches('[data-kotone-buff-visibility]')) return;
        showActiveBuffs = !!input.checked;
        try {
          window.localStorage.setItem(BUFF_VISIBILITY_STORAGE_KEY, String(showActiveBuffs));
        } catch (_) {}
        updateRows(operationSettings);
      });
    }
    updateRows(operationSettings);
  }

  function apply() {
    if (!isKotonePage()) return;
    ensureStyles();
    var operationSettings = document.querySelector('.operation-settings');
    decorateTimelines(operationSettings);
    ensureTabs(operationSettings);
  }

  function observeOperationRenders() {
    if (observerStarted || !isKotonePage() || typeof MutationObserver === 'undefined') return;
    var levels = document.querySelector('.operation-levels');
    if (!levels) {
      setTimeout(observeOperationRenders, 100);
      return;
    }
    observerStarted = true;
    var queued = false;
    new MutationObserver(function () {
      if (queued) return;
      queued = true;
      setTimeout(function () {
        queued = false;
        apply();
      }, 0);
    }).observe(levels, { childList: true, subtree: true });
  }

  window.KotoneCalc.apply = apply;
  window.KotoneCalc.selectAwareness = function (mode) {
    if (MODE_IDS.indexOf(mode) === -1) return;
    activeMode = mode;
    apply();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      apply();
      observeOperationRenders();
    });
  } else {
    apply();
    observeOperationRenders();
  }
})();
