; (function () {
  if (typeof window === 'undefined') return;

  window.KoromaruCalc = window.KoromaruCalc || {};
  window.KoromaruCalc['코로마루'] = true;

  var STORAGE_KEY = 'koromaru_calc_state';
  var BASE = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';

  var GOALS = [
    { id: 'LV10', labelKey: 'koromaruCalcGoalLv10', value: 170.8 },
    { id: 'LV10+5', labelKey: 'koromaruCalcGoalLv10M', value: 188.3 },
    { id: 'LV13', labelKey: 'koromaruCalcGoalLv13', value: 181.3 },
    { id: 'LV13+5', labelKey: 'koromaruCalcGoalLv13M', value: 198.8 }
  ];

  var MINDSCAPE_VALUES = [0, 4.8, 9.6, 14.4, 19.2, 24.0];
  var WEAPON_VALUES = [36, 36, 47, 47, 58, 58, 69];
  var REV_ICON_MAP = {
    revelationStar: '성',
    revSubMain: '주',
    revSubSun: '일',
    revSubMoon: '월',
    revSubSky: '진'
  };

  var CHECK_KEYS = [
    'baseStat',
    'mindscape',
    'weapon',
    'revelationStar',
    'revSubMain',
    'revSubSun',
    'revSubMoon',
    'revSubSky',
    'revelationSet',
    'myPalace',
    'myPalaceRating'
  ];

  var state = {
    selectedGoal: 'LV10',
    checks: {
      baseStat: true,
      mindscape: true,
      weapon: true,
      revelationStar: true,
      revSubMain: true,
      revSubSun: true,
      revSubMoon: true,
      revSubSky: true,
      revelationSet: true,
      myPalace: true,
      myPalaceRating: true
    },
    mindscapeLevel: 0,
    weaponEnhance: 0,
    revSubMain: 0,
    revSubSun: 0,
    revSubMoon: 0,
    revSubSky: 0,
    revelationSet: 20,
    myPalace: 2.3,
    myPalaceRating: 0
  };

  var refs = {
    target: null,
    total: null,
    diff: null,
    mindscapeValue: null,
    weaponValue: null
  };

  function t(key, fallback) {
    if (typeof window.t === 'function') {
      try {
        return window.t(key, fallback);
      } catch (_) { }
    }
    if (window.I18nService && typeof window.I18nService.t === 'function') {
      var result = window.I18nService.t(key, fallback);
      if (result && result !== key) return result;
    }
    return fallback || key;
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (typeof text !== 'undefined') node.textContent = text;
    return node;
  }

  function makeRevIcon(suffix) {
    var img = document.createElement('img');
    img.src = BASE + '/assets/img/revelation/icon-' + suffix + '.png';
    img.alt = suffix;
    img.className = 'koro-calc-rev-icon';
    return img;
  }

  function num(value) {
    var parsed = parseFloat(value);
    return isFinite(parsed) ? parsed : 0;
  }

  function clampInt(value, min, max) {
    var n = parseInt(value, 10);
    if (!isFinite(n)) n = min;
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  function formatPercent(value) {
    return num(value).toFixed(1) + '%';
  }

  function getGoal() {
    for (var i = 0; i < GOALS.length; i++) {
      if (GOALS[i].id === state.selectedGoal) return GOALS[i];
    }
    return GOALS[0];
  }

  function getMindscapeValue() {
    return MINDSCAPE_VALUES[clampInt(state.mindscapeLevel, 0, 5)] || 0;
  }

  function getWeaponValue() {
    return WEAPON_VALUES[clampInt(state.weaponEnhance, 0, 6)] || 0;
  }

  function includeValue(checkKey, value) {
    return state.checks[checkKey] ? value : 0;
  }

  function calcTotal() {
    return includeValue('baseStat', 34.9)
      + includeValue('mindscape', getMindscapeValue())
      + includeValue('weapon', getWeaponValue())
      + includeValue('revelationStar', 37.6)
      + includeValue('revSubMain', num(state.revSubMain))
      + includeValue('revSubSun', num(state.revSubSun))
      + includeValue('revSubMoon', num(state.revSubMoon))
      + includeValue('revSubSky', num(state.revSubSky))
      + includeValue('revelationSet', num(state.revelationSet))
      + includeValue('myPalace', num(state.myPalace))
      + includeValue('myPalaceRating', num(state.myPalaceRating));
  }

  function getQevelAilmentAccuracy() {
    try {
      var raw = localStorage.getItem('qevel-value');
      if (!raw) return 0;
      var qevel = parseInt(raw, 10);
      if (!isFinite(qevel) || qevel <= 0) return 0;
      if (typeof window.calculateQEVELBuffs === 'function') {
        var buffs = window.calculateQEVELBuffs(qevel);
        var value = buffs && buffs.stats ? buffs.stats.ailment_accuracy : 0;
        return num(value);
      }

      var fullSets = Math.floor(qevel / 20);
      var remainder = qevel % 20;
      var stackCount = fullSets + (remainder >= 1 ? 1 : 0);
      return num((stackCount * 0.1).toFixed(1));
    } catch (_) {
      return 0;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { }
  }

  function loadState() {
    var parsed = null;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) parsed = JSON.parse(raw);
    } catch (_) { }

    if (parsed && typeof parsed === 'object') {
      if (parsed.selectedGoal) {
        state.selectedGoal = parsed.selectedGoal;
      }

      if (parsed.checks && typeof parsed.checks === 'object') {
        CHECK_KEYS.forEach(function (key) {
          if (typeof parsed.checks[key] === 'boolean') {
            state.checks[key] = parsed.checks[key];
          }
        });
      }

      state.mindscapeLevel = clampInt(parsed.mindscapeLevel, 0, 5);
      state.weaponEnhance = clampInt(parsed.weaponEnhance, 0, 6);
      state.revSubMain = num(parsed.revSubMain);
      state.revSubSun = num(parsed.revSubSun);
      state.revSubMoon = num(parsed.revSubMoon);
      state.revSubSky = num(parsed.revSubSky);
      state.revelationSet = num(parsed.revelationSet);
      state.myPalace = num(parsed.myPalace);

      if (Object.prototype.hasOwnProperty.call(parsed, 'myPalaceRating')) {
        state.myPalaceRating = num(parsed.myPalaceRating);
      } else {
        state.myPalaceRating = getQevelAilmentAccuracy();
      }
    } else {
      state.myPalaceRating = getQevelAilmentAccuracy();
    }

    if (!GOALS.some(function (goal) { return goal.id === state.selectedGoal; })) {
      state.selectedGoal = GOALS[0].id;
    }
  }

  function setRowEnabled(row, enabled) {
    row.classList.toggle('is-disabled', !enabled);
  }

  function createCheckLabel(checkKey, text, opts) {
    var wrap = el('label', 'koro-calc-check-wrap');
    var check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'koro-calc-check';
    check.checked = !!state.checks[checkKey];
    check.addEventListener('change', function () {
      state.checks[checkKey] = check.checked;
      setRowEnabled(wrap.parentNode, check.checked);
      saveState();
      recalculate();
    });
    wrap.appendChild(check);
    if (opts && opts.iconKey && REV_ICON_MAP[opts.iconKey]) {
      wrap.appendChild(makeRevIcon(REV_ICON_MAP[opts.iconKey]));
    }
    var labelText = el('span', 'koro-calc-label', text);
    wrap.appendChild(labelText);
    return wrap;
  }

  function createFixedRow(checkKey, labelText, value, opts) {
    var row = el('div', 'koro-calc-row');
    row.appendChild(createCheckLabel(checkKey, labelText, opts));
    row.appendChild(el('span', 'koro-calc-value', formatPercent(value)));
    setRowEnabled(row, !!state.checks[checkKey]);
    return row;
  }

  function createInputRow(checkKey, labelText, stateKey, opts) {
    var row = el('div', 'koro-calc-row');
    row.appendChild(createCheckLabel(checkKey, labelText, opts));

    var control = el('div', 'koro-calc-input-wrap');
    var input = document.createElement('input');
    input.type = 'number';
    input.className = 'koro-calc-input';
    input.step = '0.1';
    input.value = num(state[stateKey]).toFixed(1);
    input.addEventListener('input', function () {
      state[stateKey] = num(input.value);
      saveState();
      recalculate();
    });
    control.appendChild(input);
    control.appendChild(el('span', 'koro-calc-unit', '%'));
    row.appendChild(control);

    setRowEnabled(row, !!state.checks[checkKey]);
    return row;
  }

  function createMindscapeRow() {
    var row = el('div', 'koro-calc-row');
    row.appendChild(createCheckLabel('mindscape', t('gameTerms.mindscape', '심상') + ' LV'));

    var control = el('div', 'koro-calc-select-wrap');
    var select = document.createElement('select');
    select.className = 'koro-calc-select';
    for (var i = 0; i <= 5; i++) {
      var option = document.createElement('option');
      option.value = i;
      option.textContent = 'LV ' + i;
      if (i === clampInt(state.mindscapeLevel, 0, 5)) option.selected = true;
      select.appendChild(option);
    }
    select.addEventListener('change', function () {
      state.mindscapeLevel = clampInt(select.value, 0, 5);
      saveState();
      recalculate();
    });
    refs.mindscapeValue = el('span', 'koro-calc-value');
    control.appendChild(select);
    control.appendChild(refs.mindscapeValue);
    row.appendChild(control);

    setRowEnabled(row, !!state.checks.mindscape);
    return row;
  }

  function createWeaponRow() {
    var row = el('div', 'koro-calc-row');
    row.appendChild(createCheckLabel('weapon', t('gameTerms.exclusiveWeapon', '전용 무기') + ' ' + t('koromaruCalcWeaponEnhance', '개조')));

    var control = el('div', 'koro-calc-select-wrap');
    var select = document.createElement('select');
    select.className = 'koro-calc-select';
    for (var i = 0; i <= 6; i++) {
      var option = document.createElement('option');
      option.value = i;
      option.textContent = t('koromaruCalcForge', '개조') + ' ' + i;
      if (i === clampInt(state.weaponEnhance, 0, 6)) option.selected = true;
      select.appendChild(option);
    }
    select.addEventListener('change', function () {
      state.weaponEnhance = clampInt(select.value, 0, 6);
      saveState();
      recalculate();
    });
    refs.weaponValue = el('span', 'koro-calc-value');
    control.appendChild(select);
    control.appendChild(refs.weaponValue);
    row.appendChild(control);

    setRowEnabled(row, !!state.checks.weapon);
    return row;
  }

  function ensureStyles() {
    if (document.getElementById('koro-calc-style')) return;
    var style = document.createElement('style');
    style.id = 'koro-calc-style';
    style.textContent = [
      '.koro-calc-card{background:#393f4b;border-bottom:3px solid rgb(40 48 77);border-radius:16px;padding:20px 32px 24px 32px;margin:20px 0;box-shadow:0 4px 6px rgba(0,0,0,.1)}',
      '.koro-calc-card h2{font-size:20px;color:#fff;margin:0 0 16px 0;font-weight:600;letter-spacing:.5px;display:flex;align-items:center;gap:8px}',
      '.koro-calc-title-icon{width:22px;height:22px;object-fit:contain;opacity:.95}',
      '.koro-calc-goal-section{margin-bottom:20px}',
      '.koro-calc-goal-label{font-size:11px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}',
      '.koro-calc-goal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}',
      '.koro-calc-goal-btn{background:rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:rgba(255,255,255,.75);cursor:pointer;padding:10px 4px;font-size:13px;font-weight:500;text-align:center;transition:all .2s ease-out;user-select:none}',
      '.koro-calc-goal-btn:hover{background:rgba(255,255,255,.05);border-color:rgba(111,157,255,.4)}',
      '.koro-calc-goal-btn.active{box-shadow:0 0 0 0.5px rgba(111,157,255,.6) inset,0 0 12px rgba(111,157,255,.15);background:rgba(111,157,255,.18);border-color:rgba(111,157,255,.5);color:#fff;font-weight:600}',
      '.koro-calc-content{display:flex;flex-direction:column;gap:16px}',
      '.koro-calc-section{background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:16px 20px}',
      '.koro-calc-section-header{display:flex;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.12)}',
      '.koro-calc-section-label{font-size:14px;font-weight:600;color:#fff;letter-spacing:.4px}',
      '.koro-calc-grid{display:grid;grid-template-columns:1fr 1fr;column-gap:28px;row-gap:6px}',
      '.koro-calc-row{display:flex;align-items:center;justify-content:space-between;padding:4px 6px;margin:0 -6px;border-radius:6px;min-height:30px;transition:all .2s}',
      '.koro-calc-row.is-disabled{opacity:.4;filter:grayscale(60%)}',
      '.koro-calc-row:hover{background:rgba(255,255,255,.03)}',
      '.koro-calc-check-wrap{display:flex;align-items:center;gap:8px;flex:1;min-width:0}',
      '.koro-calc-check{margin:0;accent-color:#6f9dff;cursor:pointer;flex-shrink:0}',
      '.koro-calc-rev-icon{width:16px;height:16px;object-fit:contain;opacity:.85;flex-shrink:0}',
      '.koro-calc-label{font-size:12px;color:rgba(255,255,255,.86);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}',
      '.koro-calc-value{font-size:13px;color:#8ab4f8;font-variant-numeric:tabular-nums;white-space:nowrap;min-width:48px;text-align:right;font-weight:500}',
      '.koro-calc-input-wrap,.koro-calc-select-wrap{display:flex;align-items:center;gap:6px;flex-shrink:0}',
      '.koro-calc-input,.koro-calc-select{background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.15);border-radius:6px;color:#fff;font-size:12px;padding:3px 6px;min-width:50px;width:55px;text-align:right;transition:all .2s}',
      '.koro-calc-select{text-align:left;min-width:70px;width:75px;cursor:pointer}',
      '.koro-calc-input:focus,.koro-calc-select:focus{outline:none;border-color:#6f9dff;background:rgba(111,157,255,.08);box-shadow:0 0 0 2px rgba(111,157,255,.15)}',
      '.koro-calc-select option{background:#2a2a2a;color:#fff}',
      '.koro-calc-unit{font-size:11px;color:rgba(255,255,255,.45)}',
      '.koro-calc-summary{margin-top:20px;padding:16px 0px;border-top:2px solid rgba(255,255,255,.15);display:flex;justify-content:space-between;align-items:center}',
      '.koro-calc-target{font-size:13px;color:rgba(255,255,255,.7);font-weight:500;display:flex;align-items:center;gap:6px}',
      '.koro-calc-target-value{color:#fff;font-weight:600}',
      '.koro-calc-total-wrap{display:flex;align-items:center;gap:14px}',
      '.koro-calc-total-label{font-size:14px;color:#fff;font-weight:600}',
      '.koro-calc-total-right{display:flex;align-items:center;gap:6px}',
      '.koro-calc-total-value{font-size:16px;color:#fff;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.5px}',
      '.koro-calc-diff{font-size:12px;font-weight:700;padding:4px 8px;border-radius:6px;margin-left:2px}',
      '.koro-calc-diff.deficit{color:#ff6b6b;background:rgba(255,107,107,.15)}',
      '.koro-calc-diff.surplus{color:#51cf66;background:rgba(81,207,102,.15)}',
      '.koro-calc-diff.match{color:rgba(255,255,255,.7);background:rgba(255,255,255,.1);font-weight:500}',
      '@media(max-width:768px){',
      '  .koro-calc-card{padding:16px 20px}',
      '  .koro-calc-goal-grid{grid-template-columns:repeat(2,1fr)}',
      '  .koro-calc-grid{grid-template-columns:1fr;row-gap:8px}',
      '  .koro-calc-summary{flex-direction:column;align-items:flex-start;gap:12px}',
      '  .koro-calc-total-wrap{width:100%;justify-content:space-between}',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function recalculate() {
    var goal = getGoal();
    var total = calcTotal();
    var diff = total - goal.value;

    if (refs.target) {
      refs.target.textContent = formatPercent(goal.value);
    }
    if (refs.total) {
      refs.total.textContent = formatPercent(total);
    }
    if (refs.diff) {
      if (Math.abs(diff) < 0.05) {
        refs.diff.textContent = t('koromaruCalcDifferenceMatch', '(일치)');
        refs.diff.className = 'koro-calc-diff match';
      } else if (diff > 0) {
        refs.diff.textContent = '(+' + num(diff).toFixed(1) + '%)';
        refs.diff.className = 'koro-calc-diff surplus';
      } else {
        refs.diff.textContent = '(' + num(diff).toFixed(1) + '%)';
        refs.diff.className = 'koro-calc-diff deficit';
      }
    }
    if (refs.mindscapeValue) refs.mindscapeValue.textContent = formatPercent(getMindscapeValue());
    if (refs.weaponValue) refs.weaponValue.textContent = formatPercent(getWeaponValue());
  }

  function buildCard() {
    var card = el('div', 'koro-calc-card card-style');
    var title = el('h2');
    var titleIcon = document.createElement('img');
    titleIcon.src = BASE + '/assets/img/stat-icon/효과 명중.png';
    titleIcon.alt = 'Ailment Accuracy';
    titleIcon.className = 'koro-calc-title-icon';
    title.appendChild(titleIcon);
    title.appendChild(document.createTextNode(t('koromaruCalcTitle', '코로마루 효과명중 계산기')));
    card.appendChild(title);

    var goalSec = el('div', 'koro-calc-goal-section');
    var goalLabel = el('div', 'koro-calc-goal-label', t('koromaruCalcGoalLabel', '목표 선택'));
    goalSec.appendChild(goalLabel);

    var goalGrid = el('div', 'koro-calc-goal-grid');
    GOALS.forEach(function (goal) {
      var btn = el(
        'button',
        'koro-calc-goal-btn' + (state.selectedGoal === goal.id ? ' active' : ''),
        t(goal.labelKey, goal.id)
      );
      btn.type = 'button';
      btn.dataset.goalId = goal.id;
      btn.addEventListener('click', function () {
        state.selectedGoal = goal.id;
        goalGrid.querySelectorAll('.koro-calc-goal-btn').forEach(function (item) {
          item.classList.toggle('active', item.dataset.goalId === goal.id);
        });
        saveState();
        recalculate();
      });
      goalGrid.appendChild(btn);
    });
    goalSec.appendChild(goalGrid);
    card.appendChild(goalSec);

    var contentWrap = el('div', 'koro-calc-content');

    var charSection = el('div', 'koro-calc-section');
    var charHeader = el('div', 'koro-calc-section-header');
    charHeader.appendChild(el('div', 'koro-calc-section-label', t('koromaruCalcSectionCharacter', '캐릭터 페이지')));
    charSection.appendChild(charHeader);

    var charGrid = el('div', 'koro-calc-grid');
    charGrid.appendChild(createFixedRow('baseStat', t('koromaruCalcBaseStatLv80', '기본 스탯 (LV80)'), 34.9));
    charGrid.appendChild(createMindscapeRow());
    charGrid.appendChild(createWeaponRow());
    charGrid.appendChild(createFixedRow('revelationStar', t('koromaruCalcRevelationStar', '계시 성'), 37.6, { iconKey: 'revelationStar' }));
    charGrid.appendChild(createInputRow('revSubMain', t('koromaruCalcRevSubMain', '계시 부가 옵션 - 주'), 'revSubMain', { iconKey: 'revSubMain' }));
    charGrid.appendChild(createInputRow('revSubSun', t('koromaruCalcRevSubSun', '계시 부가 옵션 - 일'), 'revSubSun', { iconKey: 'revSubSun' }));
    charGrid.appendChild(createInputRow('revSubMoon', t('koromaruCalcRevSubMoon', '계시 부가 옵션 - 월'), 'revSubMoon', { iconKey: 'revSubMoon' }));
    charGrid.appendChild(createInputRow('revSubSky', t('koromaruCalcRevSubSky', '계시 부가 옵션 - 진'), 'revSubSky', { iconKey: 'revSubSky' }));
    charSection.appendChild(charGrid);
    contentWrap.appendChild(charSection);

    var battleSection = el('div', 'koro-calc-section');
    var battleHeader = el('div', 'koro-calc-section-header');
    battleHeader.appendChild(el('div', 'koro-calc-section-label', t('characterDetailBattleEntry', '전투 진입 시 +')));
    battleSection.appendChild(battleHeader);

    var battleGrid = el('div', 'koro-calc-grid');
    battleGrid.appendChild(createInputRow('revelationSet', t('koromaruCalcRevelationSetBonus', '계시 세트 효과'), 'revelationSet'));
    battleGrid.appendChild(createInputRow('myPalace', t('gameTerms.myPalace', '마이팰리스'), 'myPalace'));
    battleGrid.appendChild(createInputRow('myPalaceRating', t('gameTerms.myPalaceRating', '마이팰리스 평점'), 'myPalaceRating'));
    battleSection.appendChild(battleGrid);
    contentWrap.appendChild(battleSection);

    card.appendChild(contentWrap);

    var summary = el('div', 'koro-calc-summary');

    var targetWrap = el('div', 'koro-calc-target');
    targetWrap.appendChild(document.createTextNode(t('koromaruCalcTarget', '목표') + ' : '));
    refs.target = el('span', 'koro-calc-target-value');
    targetWrap.appendChild(refs.target);
    summary.appendChild(targetWrap);

    var totalWrap = el('div', 'koro-calc-total-wrap');
    totalWrap.appendChild(el('span', 'koro-calc-total-label', t('gameTerms.ailmentAccuracy', '효과 명중') + ' ' + t('koromaruCalcTotal', '합산')));

    var totalRight = el('div', 'koro-calc-total-right');

    refs.total = el('span', 'koro-calc-total-value');
    refs.diff = el('span', 'koro-calc-diff');
    totalRight.appendChild(refs.total);
    totalRight.appendChild(refs.diff);
    totalWrap.appendChild(totalRight);

    summary.appendChild(totalWrap);

    card.appendChild(summary);

    return card;
  }

  function init() {
    var name = '';
    try {
      var params = new URLSearchParams(window.location.search);
      name = params.get('name') || window.__CHARACTER_DEFAULT || '';
    } catch (_) {
      name = window.__CHARACTER_DEFAULT || '';
    }
    if (name !== '코로마루') return;

    loadState();
    ensureStyles();

    if (document.querySelector('.koro-calc-card')) return;

    var skillsCard = document.querySelector('.skills-card.card-style');
    if (!skillsCard || !skillsCard.parentNode) return;

    var card = buildCard();
    skillsCard.parentNode.insertBefore(card, skillsCard);
    recalculate();
  }

  init();
})();
