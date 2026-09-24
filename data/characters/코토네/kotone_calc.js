;(function () {
  if (typeof window === 'undefined') return;

  var CHARACTER_NAME = '코토네';
  var MODE_IDS = ['r0', 'r1', 'r2', 'r6'];
  var MODE_LABELS = {
    kr: { r0: '의식 0', r1: '의식 1', r2: '의식 2', r6: '의식 6' },
    en: { r0: 'Awareness 0', r1: 'Awareness 1', r2: 'Awareness 2', r6: 'Awareness 6' },
    jp: { r0: '意識 0', r1: '意識 1', r2: '意識 2', r6: '意識 6' },
    cn: { r0: '意识 0', r1: '意识 1', r2: '意识 2', r6: '意识 6' }
  };
  var activeMode = 'r0';
  var showActiveBuffs = window.innerWidth > 767;
  var observerStarted = false;

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
      '.kotone-operation-tabs{display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 1.25rem}',
      '.kotone-operation-tab{border:0;border-radius:999px;padding:.5rem 1rem;background:rgba(255,255,255,.1);color:rgba(255,255,255,.58);font-size:13px;font-weight:600;cursor:pointer;transition:background .16s ease,color .16s ease,box-shadow .16s ease}',
      '.kotone-operation-tab:hover{background:rgba(255,255,255,.16);color:#fff}',
      '.kotone-operation-tab.active{background:rgba(0,0,0,.1);color:#fff;box-shadow:inset 0 0 0 1px rgba(64,160,255,.72)}',
      '.kotone-buff-toggle{display:inline-flex;align-items:center;gap:.45rem;margin-left:auto;color:rgba(255,255,255,.7);font-size:13px;font-weight:600;cursor:pointer;user-select:none}',
      '.kotone-buff-toggle input{appearance:none;position:relative;width:34px;height:18px;margin:0;border:0;border-radius:999px;background:rgba(255,255,255,.18);cursor:pointer;transition:background .16s ease}',
      '.kotone-buff-toggle input::after{content:"";position:absolute;top:3px;left:3px;width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.72);transition:transform .16s ease,background .16s ease}',
      '.kotone-buff-toggle input:checked{background:rgba(231,58,137,.72)}',
      '.kotone-buff-toggle input:checked::after{transform:translateX(16px);background:#fff}',
      '.kotone-buff-toggle:hover{color:#fff}',
      '.operation-settings.kotone-operation-buffs-hidden .operation-timeline-row--buffs,.operation-settings.kotone-operation-buffs-hidden .operation-timeline-row--lunar-bond,.operation-settings.kotone-operation-buffs-hidden .operation-timeline-row--powerful-bond{display:none}',
      '.operation-settings .operation-row.kotone-operation-hidden{display:none!important}',
      '.operation-row--timeline{align-items:flex-start}.operation-row--timeline .operation-label{flex:0 0 140px;width:140px}.operation-timeline-scroll{overflow-x:auto;padding-bottom:9px;box-sizing:border-box;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.32) transparent}',
      '.kotone-operation-lang-kr .operation-row--timeline .operation-label{flex-basis:96px;width:96px}.kotone-operation-lang-jp .operation-row--timeline .operation-label,.kotone-operation-lang-cn .operation-row--timeline .operation-label{flex-basis:120px;width:120px}',
      '.kotone-operation-timeline{width:724px;min-width:724px;border-collapse:collapse;table-layout:fixed;border:1px solid rgba(255,255,255,.13)}.kotone-operation-timeline.operation-timeline--6-turns{width:564px;min-width:564px}.kotone-operation-timeline.operation-timeline--english{width:770px;min-width:770px}.kotone-operation-timeline.operation-timeline--english.operation-timeline--6-turns{width:610px;min-width:610px}.kotone-operation-timeline th,.kotone-operation-timeline td{padding:7px 5px;text-align:center;vertical-align:middle;font-size:12px;line-height:1.35;border-top:1px solid rgba(255,255,255,.11);border-bottom:1px solid rgba(255,255,255,.11)}.kotone-operation-timeline tr:first-child th,.kotone-operation-timeline tr:first-child td{border-top:0}.kotone-operation-timeline tr:last-child th,.kotone-operation-timeline tr:last-child td{border-bottom:0}.kotone-operation-timeline th{width:84px;color:#aaa;font-weight:600;background:rgba(255,255,255,.05);white-space:nowrap}.kotone-operation-timeline.operation-timeline--english th{width:130px}.kotone-operation-timeline td{width:80px;max-width:80px;color:rgba(255,255,255,.88);background:rgba(255,255,255,.02)}',
      '.kotone-operation-timeline .operation-timeline-row--turns td{position:relative}.kotone-operation-timeline .operation-timeline-row--turns td:not(:last-child)::after{content:"›";position:absolute;z-index:2;top:50%;right:-9px;width:18px;text-align:center;transform:translateY(-50%);color:rgba(255,255,255,.42);font-size:17px;font-weight:700;pointer-events:none}.kotone-operation-timeline .operation-timeline-row--buffs td{vertical-align:top;font-size:11px}.kotone-operation-timeline .operation-timeline-row--lunar-bond td{font-size:11px}.kotone-operation-timeline .kotone-lunar-bond-low{color:rgba(255,255,255,.3)}.kotone-operation-timeline .kotone-reserved{display:none}.kotone-operation-timeline .operation-timeline-row--turns td:has(+ .kotone-reserved)::after{display:none}.kotone-operation-timeline .kotone-fatigue{color:rgba(255,255,255,.48);background:rgba(0,0,0,.16)}.kotone-operation-timeline .kotone-low-stack{color:rgba(255,255,255,.3)}.kotone-operation-timeline .kotone-stacked-buffs{line-height:1.65}.kotone-operation-timeline .kotone-skill-three{font-weight:600}.kotone-operation-timeline .kotone-full-power{color:#ffd9ea;font-weight:700;background:rgba(231,58,137,1);border-color:rgba(255,166,210,.52);border-bottom-color:transparent}',
      '.operation-settings:not(.kotone-operation-buffs-hidden) .kotone-operation-timeline .operation-timeline-row--buffs th,.operation-settings:not(.kotone-operation-buffs-hidden) .kotone-operation-timeline .operation-timeline-row--buffs td{border-top:2px solid rgba(255,255,255,.28)}',
      '.operation-timeline-scroll::-webkit-scrollbar{height:5px}.operation-timeline-scroll::-webkit-scrollbar-track{background:transparent}.operation-timeline-scroll::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.28)}',
      '.kotone-operation-mobile-legend{display:none}',
      '@media (max-width:767px){.kotone-operation-tab{font-size:0}.kotone-operation-tab::after{content:attr(data-kotone-mobile-label);font-size:13px}.kotone-buff-toggle{flex-basis:100%;margin:8px 0 0;padding-top:10px;border-top:1px solid rgba(255,255,255,.12)}.operation-settings .operation-note--mobile-hidden{display:none}.operation-row--timeline{display:block}.operation-row--timeline .operation-label{display:block;width:auto;margin:0 0 8px;font-size:13px}.operation-row--timeline .operation-value{min-width:0;margin-left:0}.kotone-operation-mobile-legend{display:flex;flex-wrap:wrap;gap:6px 12px;margin:0 0 6px;color:#aaa;font-size:11px}.kotone-operation-mobile-legend-item{display:inline-flex;align-items:center;white-space:nowrap}.kotone-operation-mobile-legend .operation-timeline-row-icon{width:15px;height:15px;margin-right:3px;vertical-align:0}.operation-timeline-scroll{-webkit-overflow-scrolling:touch}.kotone-operation-timeline,.kotone-operation-timeline.operation-timeline--english{width:430px;min-width:430px}.kotone-operation-timeline.operation-timeline--6-turns,.kotone-operation-timeline.operation-timeline--english.operation-timeline--6-turns{width:334px;min-width:334px}.kotone-operation-timeline th,.kotone-operation-timeline.operation-timeline--english th{display:table-cell;width:40px;white-space:nowrap;font-size:11px}.kotone-operation-timeline .operation-timeline-row--powerful-bond th,.kotone-operation-timeline .operation-timeline-row--lunar-bond th{font-size:0}.kotone-operation-timeline .operation-timeline-row--powerful-bond th .operation-timeline-row-icon,.kotone-operation-timeline .operation-timeline-row--lunar-bond th .operation-timeline-row-icon{width:18px;height:18px;margin:0;vertical-align:middle}.kotone-operation-timeline td{width:auto;max-width:none;padding:5px 1px;font-size:11px}.kotone-operation-timeline .operation-timeline-row--turns td:not(:last-child)::after{right:-8px;font-size:15px}}'
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
    operationSettings.querySelectorAll('.operation-row[data-operation-group]').forEach(function (row) {
      row.classList.toggle('kotone-operation-hidden', row.getAttribute('data-operation-group') !== activeMode);
    });
    operationSettings.querySelectorAll('[data-kotone-operation-mode]').forEach(function (button) {
      var selected = button.getAttribute('data-kotone-operation-mode') === activeMode;
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
      tabs.setAttribute('role', 'tablist');
      var labels = MODE_LABELS[getLanguage()] || MODE_LABELS.kr;
      MODE_IDS.forEach(function (mode) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'kotone-operation-tab';
        button.textContent = labels[mode];
        button.setAttribute('data-kotone-operation-mode', mode);
        button.setAttribute('data-kotone-mobile-label', `A${mode.slice(1)}`);
        button.setAttribute('role', 'tab');
        tabs.appendChild(button);
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
      tabs.appendChild(buffToggle);
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
        if (!button || !operationSettings.contains(button)) return;
        event.preventDefault();
        var mode = button.getAttribute('data-kotone-operation-mode');
        if (MODE_IDS.indexOf(mode) === -1) return;
        activeMode = mode;
        updateRows(operationSettings);
      });
      operationSettings.addEventListener('change', function (event) {
        var input = event.target;
        if (!input || !input.matches || !input.matches('[data-kotone-buff-visibility]')) return;
        showActiveBuffs = !!input.checked;
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
