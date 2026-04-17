;(function () {
  if (typeof window === 'undefined') return;

  var BASE = typeof window.BASE_URL !== 'undefined' ? window.BASE_URL : '';
  var SLOT_ICON_MAP = {
    space: '주',
    sun: '일',
    moon: '월',
    star: '성',
    sky: '진'
  };

  function t(key, fallback) {
    if (typeof window.t === 'function') {
      try {
        return window.t(key, fallback);
      } catch (_) {}
    }
    if (window.I18nService && typeof window.I18nService.t === 'function') {
      var result = window.I18nService.t(key, fallback);
      if (result && result !== key) return result;
    }
    return typeof fallback === 'undefined' ? key : fallback;
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (typeof text !== 'undefined') node.textContent = text;
    return node;
  }

  function num(value) {
    var parsed = parseFloat(value);
    return isFinite(parsed) ? parsed : 0;
  }

  function formatValue(value, unit) {
    return num(value).toFixed(1) + (unit || '');
  }

  function resolveValue(value, context) {
    return typeof value === 'function' ? value(context) : value;
  }

  function getCurrentCharacterName() {
    try {
      var params = new URLSearchParams(window.location.search);
      var queryName = params.get('name');
      if (queryName) return queryName;
    } catch (_) {}

    if (window.__CHARACTER_DEFAULT) return window.__CHARACTER_DEFAULT;

    try {
      var path = window.location.pathname || '';
      var match = path.match(/^\/(?:kr|en|jp|cn)\/character\/([^/]+)\/?$/);
      var slug = match && match[1] ? decodeURIComponent(match[1]) : '';
      var map = window.__CHARACTER_SLUG_MAP;
      if (slug && map && typeof map === 'object') {
        for (var name in map) {
          if (!Object.prototype.hasOwnProperty.call(map, name)) continue;
          if (map[name] && map[name].slug === slug) return name;
        }
      }
    } catch (_) {}

    return '';
  }

  function ensureStyles() {
    if (document.getElementById('character-calc-base-style')) return;

    var style = document.createElement('style');
    style.id = 'character-calc-base-style';
    style.textContent = [
      '.character-calc-card{background:var(--calc-card-bg,var(--card-background));border-bottom:3px solid var(--calc-border-color,var(--calc-accent,#d11f1f));border-radius:16px;padding:20px 32px 24px;margin:20px 0;box-shadow:var(--calc-shadow,0 4px 6px rgba(0,0,0,.2))}',
      '.character-calc-title{font-size:20px;color:#fff;margin:0px 0 14px;font-weight:600;letter-spacing:.5px;display:flex;align-items:center;gap:8px}',
      '.character-calc-title-icon{width:22px;height:22px;object-fit:contain;opacity:.95}',
      '.character-calc-goal-section{margin-bottom:20px}',
      '.character-calc-goal-label{font-size:11px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}',
      '.character-calc-goal-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px}',
      '.character-calc-goal-btn{background:var(--calc-goal-bg,rgba(0,0,0,.25));border:1px solid rgba(255,255,255,.12);border-radius:8px;color:rgba(255,255,255,.75);cursor:pointer;padding:10px 8px;font-size:13px;font-weight:500;text-align:center;transition:all .2s ease-out;user-select:none}',
      '.character-calc-goal-btn:hover{background:rgba(255,255,255,.06);border-color:var(--calc-hover-border,rgba(255,255,255,.25))}',
      '.character-calc-goal-btn.active{box-shadow:0 0 0 .5px var(--calc-active-border,rgba(209,31,31,.5)) inset,0 0 12px var(--calc-active-shadow,rgba(209,31,31,.15));background:var(--calc-active-bg,rgba(209,31,31,.18));border-color:var(--calc-active-border,rgba(209,31,31,.5));color:#fff;font-weight:600}',
      '.character-calc-content{display:flex;flex-direction:column;gap:16px}',
      '.character-calc-section{background:var(--calc-section-bg,rgba(0,0,0,.18));border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:16px 20px}',
      '.character-calc-section-header{display:flex;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.12)}',
      '.character-calc-section-label{font-size:14px;font-weight:600;color:#fff;letter-spacing:.4px}',
      '.character-calc-grid{display:grid;grid-template-columns:1fr 1fr;column-gap:28px;row-gap:6px}',
      '.character-calc-row{display:flex;align-items:center;justify-content:space-between;padding:4px 6px;margin:0 -6px;border-radius:6px;min-height:30px;transition:all .2s}',
      '.character-calc-row.is-disabled{opacity:.4;filter:grayscale(60%)}',
      '.character-calc-row:hover{background:rgba(255,255,255,.03)}',
      '.character-calc-check-wrap{display:flex;align-items:center;gap:8px;flex:1;min-width:0}',
      '.character-calc-check{margin:0;accent-color:var(--calc-accent,#d11f1f);cursor:pointer;flex-shrink:0}',
      '.character-calc-rev-icon{width:16px;height:16px;object-fit:contain;opacity:.85;flex-shrink:0}',
      '.character-calc-label{font-size:12px;color:rgba(255,255,255,.86);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}',
      '.character-calc-value{font-size:13px;color:var(--calc-muted-value-color,rgba(255,255,255,.45));font-variant-numeric:tabular-nums;white-space:nowrap;min-width:48px;text-align:right;font-weight:500}',
      '.character-calc-value.accent{color:var(--calc-value-color,#b39ddb);font-style:italic}',
      '.character-calc-input-wrap,.character-calc-select-wrap{display:flex;align-items:center;gap:6px;flex-shrink:0}',
      '.character-calc-input,.character-calc-select{background:rgba(0,0,0,.42);border:1px solid rgba(255,255,255,.15);border-radius:6px;color:#fff;font-size:12px;padding:3px 6px;min-width:50px;width:60px;text-align:right;transition:all .2s}',
      '.character-calc-select{text-align:left;min-width:78px;width:auto;cursor:pointer}',
      '.character-calc-input:focus,.character-calc-select:focus{outline:none;border-color:var(--calc-input-focus-border,var(--calc-active-border,rgba(209,31,31,.5)));background:rgba(255,255,255,.09);box-shadow:none}',
      '.character-calc-select option{background:#1f1f1f;color:#fff}',
      '.character-calc-unit{font-size:11px;color:rgba(255,255,255,.45)}',
      '.character-calc-summary{margin-top:20px;padding-top:16px;border-top:2px solid rgba(255,255,255,.15);display:flex;justify-content:space-between;align-items:center;gap:16px}',
      '.character-calc-target{font-size:13px;color:rgba(255,255,255,.7);font-weight:500;display:flex;align-items:center;gap:6px}',
      '.character-calc-target-value{color:#fff;font-weight:600}',
      '.character-calc-target-note{font-size:12px;color:var(--calc-note-color,var(--calc-accent,#d11f1f));font-weight:600;margin-left:2px;white-space:nowrap}',
      '.character-calc-total-wrap{display:flex;align-items:center;gap:14px}',
      '.character-calc-total-label{font-size:14px;color:#fff;font-weight:600}',
      '.character-calc-total-right{display:flex;align-items:center;gap:6px}',
      '.character-calc-total-value{font-size:16px;color:#fff;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.5px}',
      '.character-calc-diff{font-size:12px;font-weight:700;padding:4px 8px;border-radius:6px;margin-left:2px}',
      '.character-calc-diff.deficit{color:#ff6b6b;background:rgba(255,107,107,.15)}',
      '.character-calc-diff.surplus{color:#51cf66;background:rgba(81,207,102,.15)}',
      '.character-calc-diff.match{color:rgba(255,255,255,.7);background:rgba(255,255,255,.1);font-weight:500}',
      '@media(max-width:768px){',
      '  .character-calc-card{padding:16px 20px}',
      '  .character-calc-grid{grid-template-columns:1fr;row-gap:8px}',
      '  .character-calc-summary{flex-direction:column;align-items:flex-start}',
      '  .character-calc-target{flex-wrap:wrap}',
      '  .character-calc-total-wrap{width:100%;justify-content:space-between}',
      '}'
    ].join('\n');

    document.head.appendChild(style);
  }

  function makeRevelationIcon(slot, className) {
    var suffix = SLOT_ICON_MAP[slot];
    if (!suffix) return null;

    var img = document.createElement('img');
    img.src = BASE + '/assets/img/revelation/icon-' + suffix + '.png';
    img.alt = suffix;
    img.className = className || 'character-calc-rev-icon';
    return img;
  }

  function makeStatIcon(name, className) {
    var img = document.createElement('img');
    img.src = BASE + '/assets/img/stat-icon/' + name + '.png';
    img.alt = name;
    img.className = className || 'character-calc-title-icon';
    return img;
  }

  function mountCard(options) {
    var cardClass = options && options.cardClass;
    if (cardClass && document.querySelector('.' + cardClass)) return false;

    var skillsCard = document.querySelector((options && options.anchorSelector) || '.skills-card.card-style');
    if (!skillsCard || !skillsCard.parentNode) return false;

    skillsCard.parentNode.insertBefore(options.card, skillsCard);
    return true;
  }

  function mountCardWhenReady(options, onMounted) {
    if (!options || !options.card) return;

    var finished = false;
    var intervalId = null;
    var observer = null;
    var attempts = 0;
    var maxAttempts = typeof options.maxAttempts === 'number' ? options.maxAttempts : 120;
    var retryDelay = typeof options.retryDelay === 'number' ? options.retryDelay : 50;

    function cleanup() {
      if (intervalId) clearInterval(intervalId);
      if (observer) observer.disconnect();
    }

    function finish(mounted) {
      if (finished) return;
      finished = true;
      cleanup();
      if (mounted && typeof onMounted === 'function') onMounted();
    }

    function tryMount() {
      var mounted = mountCard(options);
      if (mounted) {
        finish(true);
        return true;
      }

      if (options.cardClass && document.querySelector('.' + options.cardClass)) {
        finish(false);
        return true;
      }

      return false;
    }

    if (tryMount()) return;

    intervalId = window.setInterval(function () {
      attempts += 1;
      if (tryMount()) return;
      if (attempts >= maxAttempts) finish(false);
    }, retryDelay);

    if (typeof MutationObserver === 'function' && document.body) {
      observer = new MutationObserver(function () {
        tryMount();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        tryMount();
      }, { once: true });
    }
  }

  function applyTheme(card, theme) {
    if (!card || !theme) return;

    if (theme.accent) card.style.setProperty('--calc-accent', theme.accent);
    if (theme.cardBackground) card.style.setProperty('--calc-card-bg', theme.cardBackground);
    if (theme.borderColor) card.style.setProperty('--calc-border-color', theme.borderColor);
    if (theme.sectionBackground) card.style.setProperty('--calc-section-bg', theme.sectionBackground);
    if (theme.goalBackground) card.style.setProperty('--calc-goal-bg', theme.goalBackground);
    if (theme.mutedValueColor) card.style.setProperty('--calc-muted-value-color', theme.mutedValueColor);
    if (theme.valueColor) card.style.setProperty('--calc-value-color', theme.valueColor);
    if (theme.shadow) card.style.setProperty('--calc-shadow', theme.shadow);
    if (theme.goalActiveBackground) card.style.setProperty('--calc-active-bg', theme.goalActiveBackground);
    if (theme.goalActiveBorder) card.style.setProperty('--calc-active-border', theme.goalActiveBorder);
    if (theme.goalActiveShadow) card.style.setProperty('--calc-active-shadow', theme.goalActiveShadow);
    if (theme.hoverBorder) card.style.setProperty('--calc-hover-border', theme.hoverBorder);
    if (theme.inputFocusBorder) card.style.setProperty('--calc-input-focus-border', theme.inputFocusBorder);
    if (theme.noteColor) card.style.setProperty('--calc-note-color', theme.noteColor);
  }

  function getQevelBuffStat(statKey) {
    try {
      var raw = localStorage.getItem('qevel-value');
      if (!raw) return 0;

      var qevel = parseInt(raw, 10);
      if (!isFinite(qevel) || qevel <= 0) return 0;

      if (typeof window.calculateQEVELBuffs === 'function') {
        var buffs = window.calculateQEVELBuffs(qevel);
        if (buffs && buffs.stats && Object.prototype.hasOwnProperty.call(buffs.stats, statKey)) {
          return num(buffs.stats[statKey]);
        }
      }

      if (statKey === 'ailment_accuracy') {
        var fullSets = Math.floor(qevel / 20);
        var remainder = qevel % 20;
        var stackCount = fullSets + (remainder >= 1 ? 1 : 0);
        return num((stackCount * 0.1).toFixed(1));
      }
    } catch (_) {}

    return 0;
  }

  function registerSimpleTotalCalculator(config) {
    if (!config || !config.characterName || !config.goals || !config.goals.length) return;
    if (getCurrentCharacterName() !== config.characterName) return;

    ensureStyles();

    var sections = config.sections || [];
    var rows = [];
    var index;

    for (index = 0; index < sections.length; index++) {
      if (sections[index] && sections[index].rows) {
        rows = rows.concat(sections[index].rows);
      }
    }

    var state = {
      selectedGoal: config.goals[0].id,
      checks: {}
    };

    for (index = 0; index < rows.length; index++) {
      var row = rows[index];
      var checkKey = row.checkKey || row.key;
      if (checkKey) state.checks[checkKey] = row.defaultChecked !== false;
      if (row.stateKey) state[row.stateKey] = resolveValue(row.defaultValue, { state: state, row: row });
    }

    var refs = {
      goalNote: null,
      target: null,
      targetNote: null,
      total: null,
      diff: null,
      dynamicValues: {},
      checkboxes: {}
    };

    function hasGoal(goalId) {
      for (var goalIndex = 0; goalIndex < config.goals.length; goalIndex++) {
        if (config.goals[goalIndex].id === goalId) return true;
      }
      return false;
    }

    function getGoal() {
      for (var goalIndex = 0; goalIndex < config.goals.length; goalIndex++) {
        if (config.goals[goalIndex].id === state.selectedGoal) return config.goals[goalIndex];
      }
      return config.goals[0];
    }

    function getRowUnit(row) {
      if (typeof row.unit !== 'undefined') return row.unit;
      return typeof config.valueUnit !== 'undefined' ? config.valueUnit : '%';
    }

    function getRowOptions(row) {
      var options = resolveValue(row.options, { state: state, row: row });
      return Array.isArray(options) ? options : [];
    }

    function getRowValue(row) {
      if (typeof row.getValue === 'function') return num(row.getValue(state));
      if (row.type === 'fixed') return num(resolveValue(row.value, { state: state, row: row }));
      if (row.type === 'input') return num(state[row.stateKey]);
      if (row.type === 'select') {
        var options = getRowOptions(row);
        for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
          if (String(options[optionIndex].value) === String(state[row.stateKey])) {
            return num(resolveValue(options[optionIndex].amount, { state: state, row: row, option: options[optionIndex] }));
          }
        }
      }
      return 0;
    }

    function includeRowValue(row) {
      var checkKey = row.checkKey || row.key;
      if (checkKey && !state.checks[checkKey]) return 0;
      return getRowValue(row);
    }

    function calcTotal() {
      var total = 0;
      for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        total += includeRowValue(rows[rowIndex]);
      }
      return total;
    }

    function saveState() {
      try {
        localStorage.setItem(config.storageKey, JSON.stringify(state));
      } catch (_) {}
    }

    function loadState() {
      var parsed = null;
      try {
        var raw = localStorage.getItem(config.storageKey);
        if (raw) parsed = JSON.parse(raw);
      } catch (_) {}
      if (!parsed || typeof parsed !== 'object') return;

      if (parsed.selectedGoal && hasGoal(parsed.selectedGoal)) state.selectedGoal = parsed.selectedGoal;

      for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        var checkKey = row.checkKey || row.key;

        if (checkKey && parsed.checks && typeof parsed.checks[checkKey] === 'boolean') {
          state.checks[checkKey] = parsed.checks[checkKey];
        }

        if (!row.stateKey || !Object.prototype.hasOwnProperty.call(parsed, row.stateKey)) continue;

        if (row.type === 'input') {
          state[row.stateKey] = num(parsed[row.stateKey]);
          continue;
        }

        if (row.type === 'select') {
          var options = getRowOptions(row);
          for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
            if (String(options[optionIndex].value) === String(parsed[row.stateKey])) {
              state[row.stateKey] = options[optionIndex].value;
              break;
            }
          }
        }
      }
    }

    function setRowEnabled(rowEl, enabled) {
      rowEl.classList.toggle('is-disabled', !enabled);
    }

    function applyMutuallyExclusiveGroup(row, currentCheckKey) {
      if (!row || !row.mutuallyExclusiveGroup || !state.checks[currentCheckKey]) return;

      for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var candidate = rows[rowIndex];
        var candidateCheckKey = candidate.checkKey || candidate.key;
        if (!candidateCheckKey || candidateCheckKey === currentCheckKey) continue;
        if (candidate.mutuallyExclusiveGroup !== row.mutuallyExclusiveGroup) continue;

        state.checks[candidateCheckKey] = false;

        if (refs.checkboxes[candidateCheckKey]) {
          refs.checkboxes[candidateCheckKey].checked = false;
        }

        if (refs.checkboxes[candidateCheckKey] && refs.checkboxes[candidateCheckKey].__rowEl) {
          setRowEnabled(refs.checkboxes[candidateCheckKey].__rowEl, false);
        }
      }
    }

    function normalizeMutuallyExclusiveState() {
      var seenGroups = {};

      for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        if (!row || !row.mutuallyExclusiveGroup) continue;

        var checkKey = row.checkKey || row.key;
        if (!checkKey || !state.checks[checkKey]) continue;

        if (seenGroups[row.mutuallyExclusiveGroup]) {
          state.checks[checkKey] = false;
          continue;
        }

        seenGroups[row.mutuallyExclusiveGroup] = checkKey;
      }
    }

    function createCheckLabel(row, rowEl) {
      var wrap = el('label', 'character-calc-check-wrap');
      var checkKey = row.checkKey || row.key;
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'character-calc-check';
      checkbox.checked = !!state.checks[checkKey];
      checkbox.__rowEl = rowEl;
      refs.checkboxes[checkKey] = checkbox;
      checkbox.addEventListener('change', function () {
        state.checks[checkKey] = checkbox.checked;
        applyMutuallyExclusiveGroup(row, checkKey);
        setRowEnabled(rowEl, checkbox.checked);
        saveState();
        recalculate();
      });
      wrap.appendChild(checkbox);

      if (row.iconSlot) {
        var icon = makeRevelationIcon(row.iconSlot);
        if (icon) wrap.appendChild(icon);
      }

      wrap.appendChild(el('span', 'character-calc-label', resolveValue(row.label, { state: state, row: row })));
      return wrap;
    }

    function createFixedRow(row) {
      var rowEl = el('div', 'character-calc-row');
      rowEl.appendChild(createCheckLabel(row, rowEl));
      rowEl.appendChild(el('span', 'character-calc-value' + (row.valueClass ? ' ' + row.valueClass : ''), formatValue(getRowValue(row), getRowUnit(row))));
      setRowEnabled(rowEl, !!state.checks[row.checkKey || row.key]);
      return rowEl;
    }

    function createInputRow(row) {
      var rowEl = el('div', 'character-calc-row');
      rowEl.appendChild(createCheckLabel(row, rowEl));

      var control = el('div', 'character-calc-input-wrap');
      var input = document.createElement('input');
      input.type = 'number';
      input.className = 'character-calc-input';
      input.step = typeof row.step !== 'undefined' ? String(row.step) : '0.1';
      input.value = num(state[row.stateKey]).toFixed(1);
      input.addEventListener('input', function () {
        state[row.stateKey] = num(input.value);
        saveState();
        recalculate();
      });
      control.appendChild(input);

      if (getRowUnit(row)) control.appendChild(el('span', 'character-calc-unit', getRowUnit(row)));
      rowEl.appendChild(control);
      setRowEnabled(rowEl, !!state.checks[row.checkKey || row.key]);
      return rowEl;
    }

    function createSelectRow(row) {
      var rowEl = el('div', 'character-calc-row');
      rowEl.appendChild(createCheckLabel(row, rowEl));

      var control = el('div', 'character-calc-select-wrap');
      var select = document.createElement('select');
      select.className = 'character-calc-select';

      var options = getRowOptions(row);
      for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
        var optionData = options[optionIndex];
        var option = document.createElement('option');
        option.value = optionData.value;
        option.textContent = resolveValue(optionData.label, { state: state, row: row, option: optionData });
        if (String(optionData.value) === String(state[row.stateKey])) option.selected = true;
        select.appendChild(option);
      }

      select.addEventListener('change', function () {
        state[row.stateKey] = select.value;
        saveState();
        recalculate();
      });

      control.appendChild(select);
      refs.dynamicValues[row.key] = el('span', 'character-calc-value accent');
      control.appendChild(refs.dynamicValues[row.key]);
      rowEl.appendChild(control);

      setRowEnabled(rowEl, !!state.checks[row.checkKey || row.key]);
      return rowEl;
    }

    function buildCard() {
      var card = el('div', 'character-calc-card card-style ' + (config.cardClass || ''));
      applyTheme(card, config.theme);

      var title = el('h2', 'character-calc-title');
      if (config.titleIconName) title.appendChild(makeStatIcon(config.titleIconName));
      title.appendChild(document.createTextNode(resolveValue(config.title, { state: state })));
      card.appendChild(title);

      var goalSection = el('div', 'character-calc-goal-section');
      goalSection.appendChild(el('div', 'character-calc-goal-label', t('characterCalc.goalLabel', 'Goal Selection')));

      var goalGrid = el('div', 'character-calc-goal-grid');
      for (var goalIndex = 0; goalIndex < config.goals.length; goalIndex++) {
        var goal = config.goals[goalIndex];
        var button = el('button', 'character-calc-goal-btn' + (state.selectedGoal === goal.id ? ' active' : ''), resolveValue(goal.label, { state: state, goal: goal }));
        button.type = 'button';
        button.dataset.goalId = goal.id;
        button.addEventListener('click', function () {
          state.selectedGoal = this.dataset.goalId;
          var buttons = goalGrid.querySelectorAll('.character-calc-goal-btn');
          for (var buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
            buttons[buttonIndex].classList.toggle('active', buttons[buttonIndex].dataset.goalId === state.selectedGoal);
          }
          saveState();
          recalculate();
        });
        goalGrid.appendChild(button);
      }
      goalSection.appendChild(goalGrid);
      card.appendChild(goalSection);

      var content = el('div', 'character-calc-content');
      for (var sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        var section = sections[sectionIndex];
        var sectionEl = el('div', 'character-calc-section');
        var header = el('div', 'character-calc-section-header');
        header.appendChild(el('div', 'character-calc-section-label', resolveValue(section.label, { state: state, section: section })));
        sectionEl.appendChild(header);

        var grid = el('div', 'character-calc-grid');
        for (var rowIndex = 0; rowIndex < section.rows.length; rowIndex++) {
          var row = section.rows[rowIndex];
          if (row.type === 'fixed') grid.appendChild(createFixedRow(row));
          if (row.type === 'input') grid.appendChild(createInputRow(row));
          if (row.type === 'select') grid.appendChild(createSelectRow(row));
        }
        sectionEl.appendChild(grid);
        content.appendChild(sectionEl);
      }
      card.appendChild(content);

      var summary = el('div', 'character-calc-summary');
      var targetWrap = el('div', 'character-calc-target');
      targetWrap.appendChild(document.createTextNode(t('characterCalc.target', 'Target') + ' : '));
      refs.target = el('span', 'character-calc-target-value');
      targetWrap.appendChild(refs.target);
      refs.targetNote = el('span', 'character-calc-target-note');
      targetWrap.appendChild(refs.targetNote);
      summary.appendChild(targetWrap);

      var totalWrap = el('div', 'character-calc-total-wrap');
      totalWrap.appendChild(el('span', 'character-calc-total-label', t(config.totalStatKey, config.totalStatFallback) + ' ' + t('characterCalc.total', 'Total')));
      var totalRight = el('div', 'character-calc-total-right');
      refs.total = el('span', 'character-calc-total-value');
      refs.diff = el('span', 'character-calc-diff');
      totalRight.appendChild(refs.total);
      totalRight.appendChild(refs.diff);
      totalWrap.appendChild(totalRight);
      summary.appendChild(totalWrap);

      card.appendChild(summary);
      return card;
    }

    function recalculate() {
      var goal = getGoal();
      var total = calcTotal();
      var diff = total - goal.value;
      var unit = typeof config.valueUnit !== 'undefined' ? config.valueUnit : '%';

      if (refs.target) refs.target.textContent = formatValue(goal.value, unit);
      if (refs.total) refs.total.textContent = formatValue(total, unit);

      if (refs.diff) {
        if (Math.abs(diff) < 0.05) {
          refs.diff.textContent = t('characterCalc.differenceMatch', '(Match)');
          refs.diff.className = 'character-calc-diff match';
        } else if (diff > 0) {
          refs.diff.textContent = '(+' + num(diff).toFixed(1) + (unit || '') + ')';
          refs.diff.className = 'character-calc-diff surplus';
        } else {
          refs.diff.textContent = '(' + num(diff).toFixed(1) + (unit || '') + ')';
          refs.diff.className = 'character-calc-diff deficit';
        }
      }

      for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        if (refs.dynamicValues[row.key]) refs.dynamicValues[row.key].textContent = formatValue(getRowValue(row), getRowUnit(row));
      }

      if (refs.targetNote) refs.targetNote.textContent = goal.note ? resolveValue(goal.note, { state: state, goal: goal }) : '';
    }

    loadState();
    normalizeMutuallyExclusiveState();
    if (!hasGoal(state.selectedGoal)) state.selectedGoal = config.goals[0].id;
    var card = buildCard();
    mountCardWhenReady({ card: card, cardClass: config.cardClass, anchorSelector: config.anchorSelector }, recalculate);
  }

  window.CharacterCalcBase = {
    t: t,
    el: el,
    num: num,
    formatValue: formatValue,
    getCurrentCharacterName: getCurrentCharacterName,
    ensureStyles: ensureStyles,
    makeRevelationIcon: makeRevelationIcon,
    makeStatIcon: makeStatIcon,
    mountCard: mountCard,
    mountCardWhenReady: mountCardWhenReady,
    getQevelBuffStat: getQevelBuffStat,
    registerSimpleTotalCalculator: registerSimpleTotalCalculator
  };
})();
