;(function () {
  if (typeof window === 'undefined') return;

  window.RikoCalc = window.RikoCalc || {};
  window.RikoCalc['리코·매화'] = true;

  /* ── i18n ────────────────────────────────────────── */
  function getCurrentLanguage() {
    try {
      var u = new URLSearchParams(window.location.search);
      var p = u.get('lang');
      if (p === 'en') return 'en';
      if (p === 'jp') return 'jp';
      var path = window.location.pathname || '';
      if (path.includes('/en/')) return 'en';
      if (path.includes('/jp/')) return 'jp';
      return 'kr';
    } catch (_) { return 'kr'; }
  }

  var BASE = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';

  var I18N = {
    kr: {
      cardTitle: '리코 권장 스탯 계산기',
      goalLabel: '목표 선택',
      spRecovery: 'SP회복',
      critEffect: '크리티컬 효과',
      charPage: '캐릭터 페이지',
      baseStat: '기본 스탯',
      awareness0: '의식 0',
      revelationSet: '계시 세트',
      revelationJin: '계시 진',
      revSubMain: '계시 부가 옵션 - 주',
      revSubSun: '계시 부가 옵션 - 일',
      revSubMoon: '계시 부가 옵션 - 월',
      revSubStar: '계시 부가 옵션 - 성',
      revSubJin: '계시 부가 옵션 - 진',
      passive: '패시브',
      revelationStar: '계시 성',
      myPalace: '마이팰리스',
      naviPower: '해명의 힘',
      total: '합산',
      goal: '목표',
      battleEntry: '전투 진입 시',
      inBattle: '전투 중',
      weapon: '전용 무기',
      cycle: '사이클',
      enhance: '개조',
      goalBtnLV10: 'LV10',
      goalBtnLV10M: 'LV10+심상5',
      goalBtnLV13: 'LV13',
      goalBtnLV13M: 'LV13+심상5',
      spOverWarn: '스킬3을 연속으로 사용하는 경우 외에는 450.1%를 초과해도 얻는 이득이 없습니다. 크리티컬 효과에 보다 집중하세요.'
    },
    en: {
      cardTitle: 'Riko Recommended Stats Calculator',
      goalLabel: 'Goal Selection',
      spRecovery: 'SP Recovery',
      critEffect: 'Crit Effect',
      charPage: 'Character Page',
      baseStat: 'Base Stat',
      awareness0: 'Awareness 0',
      revelationSet: 'Revelation Set',
      revelationJin: 'Revelation Sky',
      revSubMain: 'Rev. Sub - Space',
      revSubSun: 'Rev. Sub - Sun',
      revSubMoon: 'Rev. Sub - Moon',
      revSubStar: 'Rev. Sub - Star',
      revSubJin: 'Rev. Sub - Sky',
      passive: 'Passive',
      revelationStar: 'Revelation Star',
      myPalace: 'Thieves Den',
      naviPower: 'Navi Power',
      total: 'Total',
      goal: 'Goal',
      battleEntry: 'Battle Entry',
      inBattle: 'In Battle',
      weapon: 'Signature Weapon',
      cycle: 'Cycle',
      enhance: 'Enh.',
      goalBtnLV10: 'LV10',
      goalBtnLV10M: 'LV10+Mind5',
      goalBtnLV13: 'LV13',
      goalBtnLV13M: 'LV13+Mind5',
      spOverWarn: 'Exceeding 450.1% provides no benefit unless you are spamming Skill 3. Focus more on Crit DMG instead.'
    },
    jp: {
      cardTitle: 'リコ推奨ステータス計算機',
      goalLabel: '目標選択',
      spRecovery: 'SP回復',
      critEffect: 'CRT倍率',
      charPage: 'キャラクターページ',
      baseStat: '基本スタット',
      awareness0: '意識 0',
      revelationSet: '啓示セット',
      revelationJin: '啓示 天',
      revSubMain: '啓示サブ - 宙',
      revSubSun: '啓示サブ - 旭',
      revSubMoon: '啓示サブ - 月',
      revSubStar: '啓示サブ - 星',
      revSubJin: '啓示サブ - 天',
      passive: 'パッシブ',
      revelationStar: '啓示 星',
      myPalace: 'マイパレス',
      naviPower: '解明の力',
      total: '合計',
      goal: '目標',
      battleEntry: '戦闘開始時',
      inBattle: '戦闘中',
      weapon: '専用武器',
      cycle: 'サイクル',
      enhance: '改造',
      goalBtnLV10: 'LV10',
      goalBtnLV10M: 'LV10+イメジャリー5',
      goalBtnLV13: 'LV13',
      goalBtnLV13M: 'LV13+イメジャリー5',
      spOverWarn: 'スキル3を連発する場合を除き、450.1%を超えてもメリットはありません。CRT倍率により集中してください。'
    }
  };

  function t(key) {
    var lang = getCurrentLanguage();
    return (I18N[lang] && I18N[lang][key]) || I18N.kr[key] || key;
  }

  /* ── Revelation icon map ── */
  var REV_ICON = {
    revelationJin: '진', revSubMain: '주', revSubSun: '일', revSubMoon: '월',
    revSubStar: '성', revSubJin: '진', revelationStar: '성'
  };

  /* ── Goal presets ───────────────────────────────── */
  var GOALS = [
    { id: 'LV10',   labelKey: 'goalBtnLV10',  sp: 450.1, crit: 388 },
    { id: 'LV10+5', labelKey: 'goalBtnLV10M', sp: 450.1, crit: 418 },
    { id: 'LV13',   labelKey: 'goalBtnLV13',  sp: 450.1, crit: 418 },
    { id: 'LV13+5', labelKey: 'goalBtnLV13M', sp: 450.1, crit: 448 }
  ];

  /* ── Fixed values ───────────────────────────────── */
  var SP_FIXED = { baseStat: 188.5, awareness0: 60, revelationSet: 80, revelationJin: 90.4 };
  var CRIT_FIXED = { baseStat: 150, revelationStar: 37.6, revelationSet_battle: 45 };

  /* ── Weapon enhancement values ──────────────────── */
  var WEAPON_4STAR = [8.7, 11.3, 11.3, 13.9, 13.9, 16.5, 16.5];
  var WEAPON_5STAR = [36.3, 36.3, 47.2, 47.2, 58.1, 58.1, 69.0];

  /* ── State ──────────────────────────────────────── */
  var STORAGE_KEY = 'riko_calc_state';
  var state = {
    selectedGoal: 'LV10',
    sp_sub_main: 0, sp_sub_sun: 0, sp_sub_moon: 0, sp_sub_star: 0,
    sp_mypalace: 5,
    crit_sub_main: 0, crit_sub_sun: 0, crit_sub_moon: 0, crit_sub_jin: 0,
    crit_navi: 0, crit_mypalace: 2,
    weapon_star: 4, weapon_4_enhance: 6, weapon_4_cycle: '3-1', weapon_5_enhance: 0
  };

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }
  function loadState() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s) { var p = JSON.parse(s); Object.keys(state).forEach(function (k) { if (p[k] !== undefined) state[k] = p[k]; }); }
    } catch (_) {}
  }

  /* ── Calculation ────────────────────────────────── */
  function calcSPTotal() {
    return SP_FIXED.baseStat + SP_FIXED.awareness0 + SP_FIXED.revelationSet + SP_FIXED.revelationJin
      + state.sp_sub_main + state.sp_sub_sun + state.sp_sub_moon + state.sp_sub_star
      + state.sp_mypalace;
  }
  function calcPassive(spTotal) {
    return Math.min(spTotal / 450, 1) * 84;
  }
  function calcWeaponCritBonus() {
    if (state.weapon_star === 5) {
      return WEAPON_5STAR[state.weapon_5_enhance] || 0;
    }
    var base = WEAPON_4STAR[state.weapon_4_enhance] || 0;
    return state.weapon_4_cycle === '3-2' ? base * 2 : base;
  }
  function calcCritTotal() {
    var spT = calcSPTotal();
    var passive = calcPassive(spT);
    return CRIT_FIXED.baseStat + passive + CRIT_FIXED.revelationStar
      + state.crit_sub_main + state.crit_sub_sun + state.crit_sub_moon + state.crit_sub_jin
      + CRIT_FIXED.revelationSet_battle + state.crit_navi + state.crit_mypalace
      + calcWeaponCritBonus();
  }
  function getGoal() {
    for (var i = 0; i < GOALS.length; i++) { if (GOALS[i].id === state.selectedGoal) return GOALS[i]; }
    return GOALS[0];
  }

  /* ── DOM refs ───────────────────────────────────── */
  var elSpTotal, elCritTotal, elSpDiff, elCritDiff;
  var elPassiveVal, elPassiveFormula;
  var elSpGoal, elCritGoal, elSpWarn;
  var elWeapon4Row, elWeapon5Row, elWeapon4Val, elWeapon5Val;
  var elInBattleLabel;

  function recalculate() {
    var spT = calcSPTotal();
    var passive = calcPassive(spT);
    var critT = calcCritTotal();
    var goal = getGoal();
    var weaponBonus = calcWeaponCritBonus();

    if (elPassiveVal) elPassiveVal.textContent = passive.toFixed(1) + '%';
    if (elPassiveFormula) {
      elPassiveFormula.textContent = '(' + t('spRecovery') + ' ' + spT.toFixed(1) + '% \u2192 ' + passive.toFixed(1) + '%)';
    }
    if (elSpTotal) elSpTotal.textContent = spT.toFixed(1) + '%';
    if (elCritTotal) elCritTotal.textContent = critT.toFixed(1) + '%';

    /* header goal targets */
    if (elSpGoal) elSpGoal.textContent = t('goal') + ' : ' + goal.sp + '%';
    if (elCritGoal) elCritGoal.textContent = t('goal') + ' : ' + goal.crit + '%';

    updateDiff(elSpDiff, spT - goal.sp, 'sp');
    updateDiff(elCritDiff, critT - goal.crit, 'crit');

    /* SP over-cap warning */
    if (elSpWarn) {
      elSpWarn.style.display = (spT > 450.1) ? 'block' : 'none';
    }

    /* weapon value display */
    if (elWeapon4Val) elWeapon4Val.textContent = weaponBonus.toFixed(1) + '%';
    if (elWeapon5Val) elWeapon5Val.textContent = weaponBonus.toFixed(1) + '%';
  }

  function updateDiff(el, diff, type) {
    if (!el) return;
    if (Math.abs(diff) < 0.05) {
      el.textContent = '';
      el.className = 'riko-diff';
      return;
    }
    if (diff < 0) {
      el.textContent = '(' + diff.toFixed(1) + '%)';
      el.className = 'riko-diff deficit';
    } else {
      el.textContent = '(+' + diff.toFixed(1) + '%)';
      el.className = type === 'sp' ? 'riko-diff surplus-sp' : 'riko-diff surplus-crit';
    }
  }

  /* ── Weapon star toggle ─────────────────────────── */
  function updateWeaponVisibility() {
    if (elWeapon4Row) elWeapon4Row.style.display = state.weapon_star === 4 ? '' : 'none';
    if (elWeapon5Row) elWeapon5Row.style.display = state.weapon_star === 5 ? '' : 'none';
    if (elInBattleLabel) elInBattleLabel.style.display = state.weapon_star === 4 ? '' : 'none';
  }

  /* ── CSS ────────────────────────────────────────── */
  function ensureStyles() {
    if (document.getElementById('riko-calc-style')) return;
    var s = document.createElement('style');
    s.id = 'riko-calc-style';
    s.textContent = [
      '.riko-calc-card{background:var(--card-background,#1f1f1f);border-bottom:3px solid var(--border-red,#d11f1f);border-radius:16px;padding:10px 35px 20px 35px;margin:20px 0;box-shadow:0 4px 6px rgba(0,0,0,.1)}',
      '.riko-calc-card h2{font-size:20px;color:#fff;margin:10px 0 14px 0;font-weight:600;letter-spacing:.5px}',

      /* goal section */
      '.riko-goal-section{margin-bottom:16px}',
      '.riko-goal-label{font-size:11px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}',
      '.riko-goal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}',
      '.riko-goal-btn{background:rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:rgba(255,255,255,.75);cursor:pointer;padding:10px 4px;font-size:12px;font-weight:500;text-align:center;transition:all .18s ease-out;user-select:none}',
      '.riko-goal-btn:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.25)}',
      '.riko-goal-btn.active{box-shadow:0 0 0 0.5px rgba(209,31,31,.6) inset,0 0 12px rgba(209,31,31,.15);background:rgba(209,31,31,.18);border-color:rgba(209,31,31,.5);color:#fff;font-weight:600}',

      /* weapon star selector — under crit column header */
      '.riko-star-selector{display:grid;grid-template-columns: repeat(2, 1fr);gap:6px;margin-bottom:10px}',
      '.riko-star-btn{display:flex;align-items:center;justify-content: center;gap:1px;background:rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.12);border-radius:6px;cursor:pointer;padding:8px 8px;transition:all .18s ease-out;user-select:none}',
      '.riko-star-btn:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.25)}',
      '.riko-star-btn.active{box-shadow:0 0 0 0.5px rgba(209,31,31,.6) inset,0 0 12px rgba(209,31,31,.15);background:rgba(209,31,31,.18);border-color:rgba(209,31,31,.5)}',
      '.riko-star-btn img{width:14px;height:14px;object-fit:contain}',

      /* weapon dropdown selects */
      '.riko-weapon-select-wrap{display:flex;align-items:center;gap:4px;flex-shrink:0}',
      '.riko-weapon-select-label{color:rgba(255,255,255,.45);font-size:10px;white-space:nowrap}',
      '.riko-weapon-select{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:5px;color:#fff;padding:2px 4px;font-size:11px;cursor:pointer;transition:border-color .15s}',
      '.riko-weapon-select:focus{border-color:rgba(209,31,31,.6);outline:none;background:rgba(255,255,255,.09)}',
      '.riko-weapon-select option{background:#2a2a2a;color:#fff}',

      /* weapon stat row */
      '.riko-weapon-row{display:flex;align-items:center;padding:3px 0;font-size:12px;min-height:26px;gap:6px;flex-wrap:wrap}',
      '.riko-weapon-label{color:rgba(255,255,255,.6);white-space:nowrap;margin-right:4px}',
      '.riko-weapon-value{color:#b39ddb;font-weight:500;font-style:italic;min-width:50px;text-align:right;font-size:12px;font-variant-numeric:tabular-nums;margin-left:auto}',

      /* stat icons */
      '.riko-stat-icon{width:16px;height:16px;object-fit:contain;vertical-align:middle;flex-shrink:0}',
      '.riko-col-header .riko-stat-icon{width:18px;height:18px}',

      /* two columns */
      '.riko-calc-columns{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:4px}',
      '.riko-calc-column{background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px 14px 10px 14px}',
      '.riko-col-header{font-size:14px;font-weight:600;color:#fff;margin:0 0 10px 0;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;align-items:center;gap:6px}',
      '.riko-col-header-goal{margin-left:auto;font-size:12px;font-weight:600;color:rgba(255,255,0,.8);white-space:nowrap;letter-spacing:.3px}',

      /* section labels */
      '.riko-section-label{font-size:10px;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.8px;margin:10px 0 6px 0;padding-top:8px;border-top:1px dashed rgba(255,255,255,.1)}',
      '.riko-section-label:first-child{border-top:none;margin-top:0;padding-top:0}',

      /* revelation icons */
      '.riko-rev-icon{width:14px;height:14px;object-fit:contain;vertical-align:middle;margin-right:4px;flex-shrink:0;opacity:.7}',

      /* stat rows */
      '.riko-stat-row{display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:12px;min-height:26px}',
      '.riko-stat-label{color:rgba(255,255,255,.6);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:8px;display:flex;align-items:center}',
      '.riko-stat-value{color:rgba(255,255,255,.45);font-weight:500;min-width:60px;text-align:right;font-size:12px;font-variant-numeric:tabular-nums}',
      '.riko-stat-value.calculated{color:#b39ddb;font-style:italic}',

      /* passive formula - sits inside label area */
      '.riko-passive-formula{font-size:10px;color:rgba(179,157,219,.55);font-style:italic;margin-left:4px;white-space:nowrap}',

      /* inputs */
      '.riko-input-wrap{display:flex;align-items:center;gap:2px}',
      '.riko-stat-input{width:62px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:5px;color:#fff;text-align:right;padding:3px 6px;font-size:12px;font-variant-numeric:tabular-nums;transition:border-color .15s}',
      '.riko-stat-input:focus{border-color:rgba(209,31,31,.6);outline:none;background:rgba(255,255,255,.09)}',
      '.riko-stat-input::-webkit-inner-spin-button,.riko-stat-input::-webkit-outer-spin-button{opacity:1;height:16px}',
      '.riko-input-unit{color:rgba(255,255,255,.35);font-size:11px}',

      /* total row */
      '.riko-total-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0 4px 0;margin-top:8px;border-top:2px solid rgba(255,255,255,.15);font-size:13px;font-weight:600}',
      '.riko-total-label{color:#fff}',
      '.riko-total-right{display:flex;align-items:center;gap:6px}',
      '.riko-total-value{color:#fff;font-size:14px;font-variant-numeric:tabular-nums}',

      /* diff badges */
      '.riko-diff{font-size:11px;font-weight:700;padding:2px 6px;border-radius:4px}',
      '.riko-diff.deficit{color:#ff5252;background:rgba(255,82,82,.12)}',
      '.riko-diff.surplus-sp{color:#ff9800;background:rgba(255,152,0,.12)}',
      '.riko-diff.surplus-crit{color:#4caf50;background:rgba(76,175,80,.12)}',

      /* sp over-cap warning */
      '.riko-sp-warn{margin-top:6px;padding:4px 0;font-size:11px;color:rgba(255,152,0,.65);line-height:1.4}',

      /* responsive */
      '@media(max-width:768px){',
      '  .riko-calc-card{padding:8px 15px 16px 15px;border-radius:10px}',
      '  .riko-goal-grid{grid-template-columns:repeat(2,1fr)}',
      '  .riko-calc-columns{grid-template-columns:1fr}',
      '  .riko-calc-card h2{font-size:18px}',
      '  .riko-passive-formula{display:none}',
      '  .riko-weapon-row{flex-wrap:wrap}',
      '}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ── DOM builders ───────────────────────────────── */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function makeRevIcon(suffix) {
    var img = document.createElement('img');
    img.src = BASE + '/assets/img/revelation/icon-' + suffix + '.png';
    img.alt = suffix;
    img.className = 'riko-rev-icon';
    return img;
  }

  function makeStatIcon(name) {
    var img = document.createElement('img');
    img.src = BASE + '/assets/img/stat-icon/' + name + '.png';
    img.alt = name;
    img.className = 'riko-stat-icon';
    return img;
  }

  function createStatRow(label, value, opts) {
    var row = el('div', 'riko-stat-row');
    var lbl = el('span', 'riko-stat-label');

    var iconKey = opts && opts.iconKey;
    if (iconKey && REV_ICON[iconKey]) {
      lbl.appendChild(makeRevIcon(REV_ICON[iconKey]));
    }

    lbl.appendChild(document.createTextNode(label));

    /* passive formula hint — inside the label, right after text */
    if (opts && opts.formulaRef) {
      var fm = el('span', 'riko-passive-formula');
      opts.formulaRef(fm);
      lbl.appendChild(fm);
    }

    row.appendChild(lbl);

    if (opts && opts.inputKey) {
      var wrap = el('span', 'riko-input-wrap');
      var input = document.createElement('input');
      input.type = 'number';
      input.className = 'riko-stat-input';
      input.step = '0.1';
      input.value = state[opts.inputKey];
      input.addEventListener('input', function () {
        state[opts.inputKey] = parseFloat(input.value) || 0;
        saveState();
        recalculate();
      });
      wrap.appendChild(input);
      wrap.appendChild(el('span', 'riko-input-unit', '%'));
      row.appendChild(wrap);
      return row;
    }

    var valSpan = el('span', 'riko-stat-value' + (opts && opts.calculated ? ' calculated' : ''), value);
    if (opts && opts.ref) opts.ref(valSpan);
    row.appendChild(valSpan);

    return row;
  }

  /* ── Dropdown builder ───────────────────────────── */
  function createLabeledSelect(labelText, options, activeValue, onChange) {
    var wrap = el('div', 'riko-weapon-select-wrap');
    wrap.appendChild(el('span', 'riko-weapon-select-label', labelText));
    var select = document.createElement('select');
    select.className = 'riko-weapon-select';
    options.forEach(function (opt) {
      var option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (String(opt.value) === String(activeValue)) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener('change', function () {
      onChange(select.value);
    });
    wrap.appendChild(select);
    return wrap;
  }

  /* ── Weapon row builders ────────────────────────── */
  function buildWeapon4Row() {
    var row = el('div', 'riko-weapon-row');
    row.appendChild(el('span', 'riko-weapon-label', t('weapon')));

    /* cycle dropdown */
    var cycleSel = createLabeledSelect(
      t('cycle'),
      [{ label: '3-1', value: '3-1' }, { label: '3-2', value: '3-2' }],
      state.weapon_4_cycle,
      function (val) {
        state.weapon_4_cycle = val;
        saveState();
        recalculate();
      }
    );
    row.appendChild(cycleSel);

    /* enhance dropdown */
    var enhOpts = [];
    for (var i = 0; i <= 6; i++) enhOpts.push({ label: String(i), value: i });
    var enhSel = createLabeledSelect(t('enhance'), enhOpts, state.weapon_4_enhance, function (val) {
      state.weapon_4_enhance = Number(val);
      saveState();
      recalculate();
    });
    row.appendChild(enhSel);

    elWeapon4Val = el('span', 'riko-weapon-value');
    row.appendChild(elWeapon4Val);

    elWeapon4Row = row;
    return row;
  }

  function buildWeapon5Row() {
    var row = el('div', 'riko-weapon-row');
    row.appendChild(el('span', 'riko-weapon-label', t('weapon')));

    /* enhance dropdown only */
    var enhOpts = [];
    for (var i = 0; i <= 6; i++) enhOpts.push({ label: String(i), value: i });
    var enhSel = createLabeledSelect(t('enhance'), enhOpts, state.weapon_5_enhance, function (val) {
      state.weapon_5_enhance = Number(val);
      saveState();
      recalculate();
    });
    row.appendChild(enhSel);

    elWeapon5Val = el('span', 'riko-weapon-value');
    row.appendChild(elWeapon5Val);

    elWeapon5Row = row;
    return row;
  }

  /* ── Star selector builder ──────────────────────── */
  function buildStarSelector() {
    var wrap = el('div', 'riko-star-selector');

    [4, 5].forEach(function (star) {
      var btn = el('div', 'riko-star-btn' + (state.weapon_star === star ? ' active' : ''));
      for (var i = 0; i < star; i++) {
        var img = document.createElement('img');
        img.src = BASE + '/assets/img/character-detail/star' + star + '.png';
        img.alt = '\u2605';
        btn.appendChild(img);
      }
      btn.dataset.star = star;
      btn.addEventListener('click', function () {
        state.weapon_star = star;
        saveState();
        wrap.querySelectorAll('.riko-star-btn').forEach(function (b) {
          b.classList.toggle('active', Number(b.dataset.star) === star);
        });
        updateWeaponVisibility();
        recalculate();
      });
      wrap.appendChild(btn);
    });

    return wrap;
  }

  function buildCard() {
    var card = el('div', 'riko-calc-card');

    /* title */
    card.appendChild(el('h2', null, t('cardTitle')));

    /* goal section */
    var goalSec = el('div', 'riko-goal-section');
    goalSec.appendChild(el('div', 'riko-goal-label', t('goalLabel')));

    var goalGrid = el('div', 'riko-goal-grid');
    GOALS.forEach(function (g) {
      var btn = el('button', 'riko-goal-btn' + (state.selectedGoal === g.id ? ' active' : ''), t(g.labelKey));
      btn.type = 'button';
      btn.dataset.goalId = g.id;
      btn.addEventListener('click', function () {
        state.selectedGoal = g.id;
        saveState();
        document.querySelectorAll('.riko-goal-btn').forEach(function (b) {
          b.classList.toggle('active', b.dataset.goalId === g.id);
        });
        recalculate();
      });
      goalGrid.appendChild(btn);
    });
    goalSec.appendChild(goalGrid);
    card.appendChild(goalSec);

    /* two columns */
    var cols = el('div', 'riko-calc-columns');

    /* ── SP Recovery column ── */
    var spCol = el('div', 'riko-calc-column');
    var spHeader = el('div', 'riko-col-header');
    spHeader.appendChild(makeStatIcon('SP 회복'));
    spHeader.appendChild(document.createTextNode(t('spRecovery')));
    elSpGoal = el('span', 'riko-col-header-goal');
    spHeader.appendChild(elSpGoal);
    spCol.appendChild(spHeader);

    spCol.appendChild(el('div', 'riko-section-label', t('charPage')));
    spCol.appendChild(createStatRow(t('baseStat'), SP_FIXED.baseStat + '%'));
    spCol.appendChild(createStatRow(t('awareness0'), SP_FIXED.awareness0 + '%'));
    spCol.appendChild(createStatRow(t('revelationSet'), SP_FIXED.revelationSet + '%'));
    spCol.appendChild(createStatRow(t('revelationJin'), SP_FIXED.revelationJin + '%', { iconKey: 'revelationJin' }));

    spCol.appendChild(createStatRow(t('revSubMain'), null, { inputKey: 'sp_sub_main', iconKey: 'revSubMain' }));
    spCol.appendChild(createStatRow(t('revSubSun'), null, { inputKey: 'sp_sub_sun', iconKey: 'revSubSun' }));
    spCol.appendChild(createStatRow(t('revSubMoon'), null, { inputKey: 'sp_sub_moon', iconKey: 'revSubMoon' }));
    spCol.appendChild(createStatRow(t('revSubStar'), null, { inputKey: 'sp_sub_star', iconKey: 'revSubStar' }));

    spCol.appendChild(el('div', 'riko-section-label', t('battleEntry')));
    spCol.appendChild(createStatRow(t('myPalace'), null, { inputKey: 'sp_mypalace' }));

    /* SP total */
    var spTotalRow = el('div', 'riko-total-row');
    spTotalRow.appendChild(el('span', 'riko-total-label', t('spRecovery') + ' ' + t('total')));
    var spRight = el('span', 'riko-total-right');
    elSpTotal = el('span', 'riko-total-value');
    elSpDiff = el('span', 'riko-diff');
    spRight.appendChild(elSpTotal);
    spRight.appendChild(elSpDiff);
    spTotalRow.appendChild(spRight);
    spCol.appendChild(spTotalRow);

    /* SP over-cap warning — hidden by default via JS */
    elSpWarn = el('div', 'riko-sp-warn', t('spOverWarn'));
    elSpWarn.style.display = 'none';
    spCol.appendChild(elSpWarn);

    cols.appendChild(spCol);

    /* ── Critical Effect column ── */
    var critCol = el('div', 'riko-calc-column');
    var critHeader = el('div', 'riko-col-header');
    critHeader.appendChild(makeStatIcon('크리티컬 효과'));
    critHeader.appendChild(document.createTextNode(t('critEffect')));
    elCritGoal = el('span', 'riko-col-header-goal');
    critHeader.appendChild(elCritGoal);
    critCol.appendChild(critHeader);

    /* star selector — right under crit column header */
    critCol.appendChild(buildStarSelector());

    critCol.appendChild(el('div', 'riko-section-label', t('charPage')));
    critCol.appendChild(createStatRow(t('baseStat'), CRIT_FIXED.baseStat + '%'));
    critCol.appendChild(createStatRow(t('revelationStar'), CRIT_FIXED.revelationStar + '%', { iconKey: 'revelationStar' }));

    /* 5★ weapon row — in char page section */
    critCol.appendChild(buildWeapon5Row());

    critCol.appendChild(createStatRow(t('revSubMain'), null, { inputKey: 'crit_sub_main', iconKey: 'revSubMain' }));
    critCol.appendChild(createStatRow(t('revSubSun'), null, { inputKey: 'crit_sub_sun', iconKey: 'revSubSun' }));
    critCol.appendChild(createStatRow(t('revSubMoon'), null, { inputKey: 'crit_sub_moon', iconKey: 'revSubMoon' }));
    critCol.appendChild(createStatRow(t('revSubJin'), null, { inputKey: 'crit_sub_jin', iconKey: 'revSubJin' }));

    critCol.appendChild(el('div', 'riko-section-label', t('battleEntry')));
    critCol.appendChild(createStatRow(t('passive'), '0%', {
      calculated: true,
      ref: function (span) { elPassiveVal = span; },
      formulaRef: function (span) { elPassiveFormula = span; }
    }));
    critCol.appendChild(createStatRow(t('revelationSet'), CRIT_FIXED.revelationSet_battle + '%'));
    critCol.appendChild(createStatRow(t('naviPower'), null, { inputKey: 'crit_navi' }));
    critCol.appendChild(createStatRow(t('myPalace'), null, { inputKey: 'crit_mypalace' }));

    /* 전투 중 section — only visible with 4★ */
    elInBattleLabel = el('div', 'riko-section-label', t('inBattle'));
    critCol.appendChild(elInBattleLabel);
    critCol.appendChild(buildWeapon4Row());

    /* Crit total */
    var critTotalRow = el('div', 'riko-total-row');
    critTotalRow.appendChild(el('span', 'riko-total-label', t('critEffect') + ' ' + t('total')));
    var critRight = el('span', 'riko-total-right');
    elCritTotal = el('span', 'riko-total-value');
    elCritDiff = el('span', 'riko-diff');
    critRight.appendChild(elCritTotal);
    critRight.appendChild(elCritDiff);
    critTotalRow.appendChild(critRight);
    critCol.appendChild(critTotalRow);

    cols.appendChild(critCol);
    card.appendChild(cols);

    return card;
  }

  /* ── Init ───────────────────────────────────────── */
  function init() {
    var params = new URLSearchParams(window.location.search);
    var name = params.get('name');
    if (name !== '리코·매화') return;

    loadState();
    ensureStyles();

    if (document.querySelector('.riko-calc-card')) return;

    var skillsCard = document.querySelector('.skills-card.card-style');
    if (!skillsCard) return;

    var card = buildCard();
    skillsCard.parentNode.insertBefore(card, skillsCard);

    updateWeaponVisibility();
    recalculate();
  }

  init();
})();
