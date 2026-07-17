;(function () {
  if (typeof window === 'undefined') return;

  var CHARACTER_NAME = '안·댄싱 스타';
  var STORAGE_KEY = 'ann_operation_sim_v1';
  var DEFAULT_TURN_COUNT = 6;
  var MAX_ACTIONS_PER_TURN = 10;
  var CHEER_MAX = 12;
  var MODE_RULES = {
    r0: { cap: 300, regen: 100, start: 200 },
    r1: { cap: 400, regen: 125, start: 200 }
  };
  var SKILLS = {
    1: { cost: 25, cheer: 1, icon: 'PC073_01_12_30_07.png' },
    2: { cost: 50, cheer: 2, icon: 'PC073_01_12_30_08.png' },
    3: { cost: 50, cheer: -4, icon: 'PC073_01_12_30_09.png' }
  };

  var I18N = {
    kr: {
      title: '운영 시뮬레이터',
      mode0: '의식 0',
      mode1: '의식 1+',
      turn: '턴',
      startSp: '시작 SP',
      usedSp: '소모 SP',
      endSp: '종료 SP',
      cheer: '환호',
      startCheer: '시작 환호',
      endCheer: '종료 환호',
      addSkill: '스킬 추가',
      addTurn: '턴 추가',
      reset: '초기화',
      noSkills: '스킬을 추가하세요',
      spShort: 'SP 부족',
      cheerShort: '환호 부족',
      actionLimit: '최대 10개',
      remove: '클릭해서 삭제',
      skill1: '스킬 1',
      skill2: '스킬 2',
      skill3: '스킬 3',
      turnLabel: 'T'
    },
    en: {
      title: 'Operation Simulator',
      mode0: 'Awareness 0',
      mode1: 'Awareness 1+',
      turn: 'Turn',
      startSp: 'Start SP',
      usedSp: 'SP Used',
      endSp: 'End SP',
      cheer: 'Cheers',
      startCheer: 'Start Cheers',
      endCheer: 'End Cheers',
      addSkill: 'Add Skill',
      addTurn: 'Add Turn',
      reset: 'Reset',
      noSkills: 'Add skills',
      spShort: 'Not enough SP',
      cheerShort: 'Not enough Cheers',
      actionLimit: 'Max 10 actions',
      remove: 'Click to remove',
      skill1: 'Skill 1',
      skill2: 'Skill 2',
      skill3: 'Skill 3',
      turnLabel: 'T'
    },
    jp: {
      title: '運用シミュレーター',
      mode0: '意識 0',
      mode1: '意識 1+',
      turn: 'ターン',
      startSp: '開始SP',
      usedSp: '消費SP',
      endSp: '終了SP',
      cheer: '歓声',
      startCheer: '開始歓声',
      endCheer: '終了歓声',
      addSkill: 'スキル追加',
      addTurn: 'ターン追加',
      reset: 'リセット',
      noSkills: 'スキルを追加',
      spShort: 'SP不足',
      cheerShort: '歓声不足',
      actionLimit: '最大10個',
      remove: 'クリックで削除',
      skill1: 'スキル1',
      skill2: 'スキル2',
      skill3: 'スキル3',
      turnLabel: 'T'
    },
    cn: {
      title: '操作模拟器',
      mode0: '意识 0',
      mode1: '意识 1+',
      turn: '回合',
      startSp: '开始精力',
      usedSp: '消耗精力',
      endSp: '结束精力',
      cheer: '欢呼',
      startCheer: '开始欢呼',
      endCheer: '结束欢呼',
      addSkill: '添加技能',
      addTurn: '添加回合',
      reset: '重置',
      noSkills: '添加技能',
      spShort: '精力不足',
      cheerShort: '欢呼不足',
      actionLimit: '最多10个',
      remove: '点击删除',
      skill1: '技能1',
      skill2: '技能2',
      skill3: '技能3',
      turnLabel: 'T'
    }
  };

  var state = {
    activeMode: 'r0',
    openTurn: 0,
    modes: {
      r0: createEmptyTurns(),
      r1: createEmptyTurns()
    }
  };

  var observerStarted = false;

  window.AnnCalc = window.AnnCalc || {};
  window.AnnCalc[CHARACTER_NAME] = true;

  function createEmptyTurns(count) {
    var turns = [];
    var total = count || DEFAULT_TURN_COUNT;
    for (var i = 0; i < total; i += 1) turns.push([]);
    return turns;
  }

  function getTurnCount() {
    return Math.max(
      DEFAULT_TURN_COUNT,
      state.modes.r0.length,
      state.modes.r1.length
    );
  }

  function clampOpenTurn() {
    var openTurn = Number(state.openTurn);
    if (!Number.isFinite(openTurn) || openTurn < 0) {
      state.openTurn = -1;
      return;
    }
    state.openTurn = Math.min(getTurnCount() - 1, openTurn);
  }

  function isAnnPage() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      return params.get('name') === CHARACTER_NAME || window.__CHARACTER_DEFAULT === CHARACTER_NAME;
    } catch (_) {
      return window.__CHARACTER_DEFAULT === CHARACTER_NAME;
    }
  }

  function getBaseUrl() {
    return (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
  }

  function getCurrentLanguage() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var langParam = params.get('lang');
      if (I18N[langParam]) return langParam;
      var path = window.location.pathname || '';
      if (path.indexOf('/en/') !== -1) return 'en';
      if (path.indexOf('/jp/') !== -1) return 'jp';
      if (path.indexOf('/cn/') !== -1) return 'cn';
      return 'kr';
    } catch (_) {
      return 'kr';
    }
  }

  function t(key) {
    var lang = getCurrentLanguage();
    return (I18N[lang] && I18N[lang][key]) || I18N.kr[key] || key;
  }

  function getSkillDataBucket() {
    var lang = getCurrentLanguage();
    if (lang === 'en') return window.enCharacterSkillsData;
    if (lang === 'jp') return window.jpCharacterSkillsData;
    if (lang === 'cn') return window.cnCharacterSkillsData;
    return window.characterSkillsData;
  }

  function getSkillName(skillNo) {
    var bucket = getSkillDataBucket() || {};
    var data = bucket[CHARACTER_NAME] || {};
    var skill = data['skill' + skillNo];
    return (skill && skill.name) || t('skill' + skillNo);
  }

  function getSkillButtonLabel(skillNo) {
    return t('skill' + skillNo);
  }

  function getIconUrl(skillNo) {
    return getBaseUrl() + '/data/characters/' + encodeURIComponent(CHARACTER_NAME) + '/' + SKILLS[skillNo].icon;
  }

  function bindTooltip(el) {
    if (!el) return;
    if (typeof window.bindTooltipElement === 'function') {
      window.bindTooltipElement(el);
    } else if (typeof bindTooltipElement === 'function') {
      bindTooltipElement(el);
    }
  }

  function ensureStyles() {
    if (document.getElementById('ann-operation-style')) return;
    var style = document.createElement('style');
    style.id = 'ann-operation-style';
    style.textContent = [
      '.operation-settings.ann-operation-settings{display:flex!important;flex-direction:column!important;gap:20px!important;grid-template-columns:1fr!important}',
      '.operation-settings.ann-operation-settings>.setting-section{width:100%;min-width:0}',
      '.operation-settings.ann-operation-settings .operation-row{align-items:flex-start}',
      '.operation-settings.ann-operation-settings .operation-label{margin-top:4px}',
      '.ann-turn-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 18px;width:100%}',
      '.ann-turn-cell{position:relative;display:flex;align-items:center;gap:8px;min-width:0;padding:4px 10px;border:0;border-radius:8px;background:rgba(0,0,0,.18)}',
      '.ann-turn-cell.ann-has-chevron::after{content:"›";position:absolute;right:-18px;top:50%;transform:translateY(-50%);width:18px;text-align:center;font-size:14px;line-height:1;color:rgba(255,255,255,.34);pointer-events:none}',
      '.ann-turn-cell.ann-indented-row{margin-left:18px;width:100%;box-sizing:border-box}',
      '.ann-turn-cell.ann-indented-row.ann-row-end{width:calc(100% - 18px)}',
      '.ann-turn-cell.ann-row-start-chevron::before{content:"›";position:absolute;left:-18px;top:50%;transform:translateY(-50%);width:18px;text-align:center;font-size:14px;line-height:1;color:rgba(255,255,255,.34);pointer-events:none}',
      '.ann-turn-label{flex:0 0 auto;font-size:11px;color:rgba(255,255,255,.48);font-weight:700;letter-spacing:.4px}',
      '.ann-turn-icons{display:flex;align-items:center;gap:0;min-width:0;flex-wrap:wrap}',
      '.skill-arrow.ann-hidden-arrow{display:none}',
      '.skill-step.ann-original-step{display:none}',
      '.ann-skill-icon-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex:0 0 22px;vertical-align:middle}',
      '.ann-skill-icon{width:100%;height:100%;object-fit:contain;vertical-align:middle;flex:0 0 auto}',
      '.ann-skill-number{position:absolute;right:-4px;bottom:-4px;display:flex;align-items:center;justify-content:center;min-width:13px;height:13px;padding:0 3px;box-sizing:border-box;border-radius:7px;background:rgba(8,8,10,.92);color:#bbb;font-size:9px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;pointer-events:none}',
      '.ann-icon-chip{display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;border-radius:6px;width:30px;flex:0 0 30px}',
      '.operation-settings.ann-operation-settings .ann-turn-cell .ann-skill-icon-wrap{width:16px;height:16px;flex-basis:16px}',
      '.operation-settings.ann-operation-settings .ann-turn-cell .ann-skill-number{right:-4px;bottom:-4px;min-width:11px;height:11px;padding:0 2px;font-size:8px}',
      '.operation-settings.ann-operation-settings .ann-turn-cell .ann-icon-chip{width:24px;height:20px;flex-basis:24px;border-radius:5px}',
      '.ann-sim-card{background:var(--card-background,#1f1f1f);border-bottom:3px solid var(--border-red,#d11f1f);border-radius:16px;padding:10px 35px 20px 35px;margin:20px 0;box-shadow:0 4px 6px rgba(0,0,0,.1)}',
      '.ann-sim-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:16.6px 0 20px;padding:10px 0 20px;border-bottom:1px solid rgba(255,255,255,.14)}',
      '.ann-sim-card h2{font-size:20px;color:#fff;margin:0;font-weight:600;letter-spacing:.3px;border:0;padding:0;width:auto;line-height:1.35}',
      '.ann-header-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex:0 0 auto}',
      '.ann-reset-btn,.ann-add-turn-btn,.ann-tab,.ann-skill-btn{border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.2);color:rgba(255,255,255,.78);border-radius:8px;cursor:pointer;transition:all .16s ease-out}',
      '.ann-reset-btn,.ann-add-turn-btn{padding:7px 12px;font-size:12px;white-space:nowrap}',
      '.ann-tabs{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px}',
      '.ann-tab{padding:10px 8px;font-size:13px;font-weight:600}',
      '.ann-tab.active{background:rgba(209,31,31,.18);border-color:rgba(209,31,31,.5);color:#fff;box-shadow:0 0 0 .5px rgba(209,31,31,.5) inset}',
      '.ann-turn-list{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:20px}',
      '.ann-sim-turn{border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.16);border-radius:10px;padding:10px;min-width:0}',
      '.ann-sim-turn.active{border-color:rgba(209,31,31,.45);box-shadow:0 0 0 .5px rgba(209,31,31,.35) inset}',
      '.ann-turn-button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;background:transparent;border:0;color:#fff;padding:0;margin:0;cursor:pointer;text-align:left;flex-wrap:wrap}',
      '.ann-turn-main{display:flex;align-items:center;gap:8px;min-width:0;flex:1 1 180px}',
      '.ann-turn-title{font-weight:700;font-size:14px;flex:0 0 auto}',
      '.ann-turn-selected{display:flex;align-items:center;gap:0;min-width:0;flex-wrap:wrap}',
      '.ann-turn-summary{font-size:12px;color:rgba(255,255,255,.68);font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap;margin-left:auto}',
      '.ann-turn-sp-gain{color:rgba(255,255,255,.38);font-size:10px;font-weight:400}',
      '.ann-selected-skill{padding:0}',
      '.ann-selected-skill:hover,.ann-reset-btn:hover,.ann-add-turn-btn:hover,.ann-tab:hover,.ann-skill-btn:hover:not(:disabled){background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.24)}',
      '.ann-editor{border-top:1px dashed rgba(255,255,255,.1);padding-top:8px;margin-top:8px}',
      '.ann-skill-buttons{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}',
      '.ann-skill-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 8px;font-size:12px;min-width:0;white-space:nowrap}',
      '.ann-skill-btn:disabled{opacity:.38;cursor:not-allowed}',
      '.ann-skill-btn .ann-skill-icon-wrap{width:22px;height:22px;flex-basis:22px}',
      '.skill-card.ann-skill-card{position:relative}',
      '.ann-skill-element-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;flex:0 0 32px}',
      '.ann-skill-element-wrap>.skill-icon{display:block;flex:0 0 auto}',
      '.ann-step-badge{position:absolute;right:-5px;bottom:-5px;width:20px;height:20px;object-fit:contain;padding:0;box-sizing:border-box}',
      '.ann-invalid{color:#ff6b6b}',
      '@media(max-width:900px){.ann-turn-grid{grid-template-columns:1fr;gap:8px}.ann-turn-cell.ann-indented-row{margin-left:0}.ann-turn-cell.ann-has-chevron::after,.ann-turn-cell.ann-row-start-chevron::before{display:none}.ann-sim-card{padding:10px 20px 20px 20px}.ann-turn-summary{white-space:normal;margin-left:0}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function createSkillIcon(skillNo, extraClass) {
    var img = document.createElement('img');
    img.className = 'ann-skill-icon' + (extraClass ? ' ' + extraClass : '');
    img.src = getIconUrl(skillNo);
    img.alt = getSkillName(skillNo);
    img.loading = 'lazy';
    img.decoding = 'async';
    return img;
  }

  function createSkillIconBadge(skillNo, extraClass) {
    var wrap = document.createElement('span');
    wrap.className = 'ann-skill-icon-wrap';
    wrap.appendChild(createSkillIcon(skillNo, extraClass));

    var number = document.createElement('span');
    number.className = 'ann-skill-number';
    number.textContent = skillNo;
    number.setAttribute('aria-hidden', 'true');
    wrap.appendChild(number);
    return wrap;
  }

  function makeIconChip(skillNo, label, asButton, mobileTooltipBehavior) {
    var el = document.createElement(asButton ? 'button' : 'span');
    el.className = 'ann-icon-chip tooltip-text';
    if (asButton) el.type = 'button';
    el.setAttribute('data-tooltip', label || getSkillName(skillNo));
    if (mobileTooltipBehavior) el.setAttribute('data-tooltip-mobile', mobileTooltipBehavior);
    el.setAttribute('aria-label', label || getSkillName(skillNo));
    el.setAttribute('tabindex', '0');
    el.appendChild(createSkillIconBadge(skillNo));
    bindTooltip(el);
    return el;
  }

  function applyOperationIcons() {
    if (!isAnnPage()) return;
    ensureStyles();

    var operationSettings = document.querySelector('.operation-settings');
    if (operationSettings) operationSettings.classList.add('ann-operation-settings');

    document.querySelectorAll('.operation-settings .operation-row').forEach(function (row) {
      var sequence = row.querySelector('.skill-sequence');
      if (!sequence || sequence.getAttribute('data-ann-rendered') === '1') return;

      var steps = Array.prototype.slice.call(sequence.querySelectorAll(':scope > .skill-step'));
      if (!steps.length) return;
      var tokens = steps.map(function (step) {
        return (step.textContent || '').trim();
      }).filter(function (token) {
        return /^[123]+$/.test(token);
      });
      if (!tokens.length || tokens.length !== steps.length) return;

      sequence.setAttribute('data-ann-rendered', '1');
      sequence.classList.add('ann-turn-grid');
      sequence.querySelectorAll(':scope > .skill-arrow').forEach(function (arrow) {
        arrow.classList.add('ann-hidden-arrow');
      });
      steps.forEach(function (step) {
        step.classList.add('ann-original-step');
      });

      tokens.forEach(function (token, index) {
        var cell = document.createElement('div');
        cell.className = 'ann-turn-cell';
        if (index < tokens.length - 1 && (index + 1) % 3 !== 0) {
          cell.classList.add('ann-has-chevron');
        }
        if (Math.floor(index / 3) % 2 === 1) {
          cell.classList.add('ann-indented-row');
        }
        if ((index + 1) % 3 === 0) {
          cell.classList.add('ann-row-end');
        }
        if (index > 0 && index % 3 === 0) {
          cell.classList.add('ann-row-start-chevron');
        }

        var label = document.createElement('span');
        label.className = 'ann-turn-label';
        label.textContent = t('turnLabel') + (index + 1);
        cell.appendChild(label);

        var icons = document.createElement('span');
        icons.className = 'ann-turn-icons';
        token.split('').forEach(function (skillNo) {
          icons.appendChild(makeIconChip(skillNo, getSkillName(skillNo), false));
        });
        cell.appendChild(icons);
        sequence.appendChild(cell);
      });
    });
  }

  function applySkillCardBadges() {
    if (!isAnnPage()) return;
    ensureStyles();

    var cards = Array.prototype.slice.call(document.querySelectorAll('.skills-card .skill-card')).slice(0, 3);
    cards.forEach(function (card, index) {
      var skillNo = String(index + 1);
      if (card.getAttribute('data-ann-skill-badge') === skillNo) return;

      var icon = card.querySelector(':scope > img.skill-icon');
      if (!icon) return;

      card.classList.add('ann-skill-card');
      card.setAttribute('data-ann-skill-badge', skillNo);

      var wrap = document.createElement('span');
      wrap.className = 'ann-skill-element-wrap';
      icon.parentNode.insertBefore(wrap, icon);
      wrap.appendChild(icon);

      var badge = document.createElement('img');
      badge.className = 'ann-step-badge';
      badge.src = getIconUrl(skillNo);
      badge.alt = getSkillButtonLabel(skillNo);
      badge.loading = 'lazy';
      badge.decoding = 'async';
      wrap.appendChild(badge);
    });
  }

  function normalizeTurns(turns) {
    var count = Math.max(DEFAULT_TURN_COUNT, Array.isArray(turns) ? turns.length : 0);
    var result = createEmptyTurns(count);
    if (!Array.isArray(turns)) return result;
    for (var i = 0; i < count; i += 1) {
      if (!Array.isArray(turns[i])) continue;
      result[i] = turns[i].map(function (v) { return String(v); }).filter(function (v) {
        return v === '1' || v === '2' || v === '3';
      });
    }
    return result;
  }

  function hasAnyPlannedSkill() {
    return Object.keys(state.modes).some(function (mode) {
      return (state.modes[mode] || []).some(function (turn) {
        return Array.isArray(turn) && turn.length > 0;
      });
    });
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved && (saved.activeMode === 'r0' || saved.activeMode === 'r1')) state.activeMode = saved.activeMode;
      if (saved && typeof saved.openTurn === 'number') state.openTurn = saved.openTurn;
      if (saved && saved.modes) {
        state.modes.r0 = normalizeTurns(saved.modes.r0);
        state.modes.r1 = normalizeTurns(saved.modes.r1);
      }
      clampOpenTurn();
      if (!hasAnyPlannedSkill()) state.openTurn = 0;
    } catch (_) {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function resetState() {
    state.modes.r0 = createEmptyTurns();
    state.modes.r1 = createEmptyTurns();
    state.openTurn = 0;
    saveState();
  }

  function addTurn() {
    state.modes.r0.push([]);
    state.modes.r1.push([]);
    saveState();
  }

  function hideActiveTooltips() {
    document.querySelectorAll('.js-tooltip-active').forEach(function (node) {
      node.classList.remove('js-tooltip-active');
    });
    var floating = document.getElementById('cursor-tooltip');
    if (floating) floating.style.display = 'none';
    var banner = document.querySelector('.tooltip-mobile-banner');
    if (banner) banner.remove();
  }

  function clearOpenTurn(card) {
    if (state.openTurn < 0) return;
    hideActiveTooltips();
    state.openTurn = -1;
    saveState();
    if (card) renderCard(card);
  }

  function pruneInvalidSkill3(mode) {
    var rules = MODE_RULES[mode] || MODE_RULES.r0;
    var turns = state.modes[mode] || createEmptyTurns();
    var sp = rules.start;
    var cheer = 0;
    var changed = false;

    for (var i = 0; i < turns.length; i += 1) {
      var currentSp = Math.min(rules.cap, sp + rules.regen);
      var currentCheer = cheer;
      var filtered = [];

      (turns[i] || []).forEach(function (skillNo) {
        var skill = SKILLS[skillNo];
        if (!skill) return;
        if (skillNo === '3' && currentCheer < 4) {
          changed = true;
          return;
        }
        filtered.push(skillNo);
        if (currentSp < skill.cost) return;
        currentSp -= skill.cost;
        currentCheer = Math.max(0, Math.min(CHEER_MAX, currentCheer + skill.cheer));
      });

      if (filtered.length !== turns[i].length) turns[i] = filtered;
      sp = currentSp;
      cheer = currentCheer;
    }

    return changed;
  }

  function compute(mode) {
    var rules = MODE_RULES[mode] || MODE_RULES.r0;
    var turns = state.modes[mode] || createEmptyTurns();
    var sp = rules.start;
    var cheer = 0;
    var results = [];

    for (var i = 0; i < getTurnCount(); i += 1) {
      var startSp = Math.min(rules.cap, sp + rules.regen);
      var startCheer = cheer;
      var currentSp = startSp;
      var currentCheer = startCheer;
      var usedSp = 0;
      var entries = [];

      (turns[i] || []).forEach(function (skillNo) {
        var skill = SKILLS[skillNo];
        if (!skill) return;
        var reason = '';
        if (currentSp < skill.cost) reason = t('spShort');
        if (skillNo === '3' && currentCheer < 4) reason = t('cheerShort');
        if (reason) {
          entries.push({ skill: skillNo, valid: false, reason: reason });
          return;
        }
        currentSp -= skill.cost;
        usedSp += skill.cost;
        currentCheer = Math.max(0, Math.min(CHEER_MAX, currentCheer + skill.cheer));
        entries.push({ skill: skillNo, valid: true, reason: '' });
      });

      results.push({
        index: i,
        startSp: startSp,
        spGain: rules.regen,
        usedSp: usedSp,
        endSp: currentSp,
        startCheer: startCheer,
        endCheer: currentCheer,
        entries: entries
      });

      sp = currentSp;
      cheer = currentCheer;
    }

    return results;
  }

  function canUseSkill(turnResult, skillNo) {
    var skill = SKILLS[skillNo];
    if (!skill) return { ok: false, reason: '' };
    if (turnResult.entries.length >= MAX_ACTIONS_PER_TURN) return { ok: false, reason: t('actionLimit') };
    if (turnResult.endSp < skill.cost) return { ok: false, reason: t('spShort') };
    if (skillNo === '3' && turnResult.endCheer < 4) return { ok: false, reason: t('cheerShort') };
    return { ok: true, reason: '' };
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderCard(card) {
    if (pruneInvalidSkill3(state.activeMode)) saveState();
    var results = compute(state.activeMode);
    card.innerHTML = '';

    var header = el('div', 'ann-sim-header');
    header.appendChild(el('h2', null, t('title')));
    var actions = el('div', 'ann-header-actions');
    var reset = el('button', 'ann-reset-btn', t('reset'));
    reset.type = 'button';
    reset.setAttribute('data-ann-action', 'reset');
    actions.appendChild(reset);
    var addTurnBtn = el('button', 'ann-add-turn-btn', t('addTurn'));
    addTurnBtn.type = 'button';
    addTurnBtn.setAttribute('data-ann-action', 'add-turn');
    actions.appendChild(addTurnBtn);
    header.appendChild(actions);
    card.appendChild(header);

    var tabs = el('div', 'ann-tabs');
    [
      { id: 'r0', label: t('mode0') },
      { id: 'r1', label: t('mode1') }
    ].forEach(function (tab) {
      var btn = el('button', 'ann-tab' + (state.activeMode === tab.id ? ' active' : ''), tab.label);
      btn.type = 'button';
      btn.setAttribute('data-ann-mode', tab.id);
      tabs.appendChild(btn);
    });
    card.appendChild(tabs);

    var list = el('div', 'ann-turn-list');
    results.forEach(function (turn) {
      list.appendChild(renderTurn(card, turn, results));
    });
    card.appendChild(list);
  }

  function renderTurn(card, turn, results) {
    var turnBox = el('div', 'ann-sim-turn' + (state.openTurn === turn.index ? ' active' : ''));
    var headerBtn = el('button', 'ann-turn-button');
    headerBtn.type = 'button';
    headerBtn.setAttribute('data-ann-turn', String(turn.index));

    var turnMain = el('span', 'ann-turn-main');
    turnMain.appendChild(el('span', 'ann-turn-title', (turn.index + 1) + t('turn')));
    var selected = el('span', 'ann-turn-selected');
    turn.entries.forEach(function (entry, index) {
      var label = getSkillName(entry.skill) + ' - ' + t('remove');
      if (!entry.valid) label = label + ' (' + entry.reason + ')';
      var chip = makeIconChip(entry.skill, label, false, 'longpress');
      chip.classList.add('ann-selected-skill');
      chip.setAttribute('role', 'button');
      chip.setAttribute('data-ann-remove-turn', String(turn.index));
      chip.setAttribute('data-ann-remove-index', String(index));
      if (!entry.valid) chip.classList.add('ann-invalid');
      selected.appendChild(chip);
    });
    turnMain.appendChild(selected);
    headerBtn.appendChild(turnMain);

    var summary = el('span', 'ann-turn-summary');
    summary.appendChild(document.createTextNode('SP ' + turn.startSp));
    summary.appendChild(el('span', 'ann-turn-sp-gain', '(+' + turn.spGain + ')'));
    summary.appendChild(document.createTextNode(' → ' + turn.endSp + ' / ' + t('cheer') + ' ' + turn.endCheer));
    headerBtn.appendChild(summary);
    turnBox.appendChild(headerBtn);

    if (state.openTurn === turn.index) {
      turnBox.appendChild(renderEditor(card, turn, results));
    }

    return turnBox;
  }

  function renderEditor(card, turn) {
    var editor = el('div', 'ann-editor');
    var buttons = el('div', 'ann-skill-buttons');

    ['1', '2', '3'].forEach(function (skillNo) {
      var availability = canUseSkill(turn, skillNo);
      var btn = el('button', 'ann-skill-btn');
      btn.type = 'button';
      btn.disabled = !availability.ok;
      btn.setAttribute('data-ann-add-turn', String(turn.index));
      btn.setAttribute('data-ann-add-skill', skillNo);
      btn.appendChild(createSkillIconBadge(skillNo));
      btn.appendChild(document.createTextNode(getSkillButtonLabel(skillNo)));
      btn.setAttribute('data-tooltip', availability.ok ? getSkillName(skillNo) : availability.reason);
      btn.setAttribute('data-tooltip-mobile', 'longpress');
      btn.classList.add('tooltip-text');
      bindTooltip(btn);
      buttons.appendChild(btn);
    });

    editor.appendChild(buttons);
    return editor;
  }

  function bindCardEvents(card) {
    if (!card || card.__annEventsBound) return;
    card.__annEventsBound = true;
    card.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== 'function') return;

      var resetBtn = target.closest('[data-ann-action="reset"]');
      if (resetBtn && card.contains(resetBtn)) {
        event.preventDefault();
        hideActiveTooltips();
        resetState();
        renderCard(card);
        return;
      }

      var addTurnBtn = target.closest('[data-ann-action="add-turn"]');
      if (addTurnBtn && card.contains(addTurnBtn)) {
        event.preventDefault();
        hideActiveTooltips();
        addTurn();
        renderCard(card);
        return;
      }

      var tabBtn = target.closest('[data-ann-mode]');
      if (tabBtn && card.contains(tabBtn)) {
        event.preventDefault();
        hideActiveTooltips();
        var mode = tabBtn.getAttribute('data-ann-mode');
        if (mode === 'r0' || mode === 'r1') {
          state.activeMode = mode;
          clampOpenTurn();
          saveState();
          renderCard(card);
        }
        return;
      }

      var removeBtn = target.closest('[data-ann-remove-index]');
      if (removeBtn && card.contains(removeBtn)) {
        event.preventDefault();
        hideActiveTooltips();
        var removeTurn = Number(removeBtn.getAttribute('data-ann-remove-turn'));
        var removeIndex = Number(removeBtn.getAttribute('data-ann-remove-index'));
        if (state.modes[state.activeMode] && state.modes[state.activeMode][removeTurn]) {
          state.modes[state.activeMode][removeTurn].splice(removeIndex, 1);
          pruneInvalidSkill3(state.activeMode);
          saveState();
          renderCard(card);
        }
        return;
      }

      var addBtn = target.closest('[data-ann-add-skill]');
      if (addBtn && card.contains(addBtn)) {
        event.preventDefault();
        hideActiveTooltips();
        if (addBtn.disabled) return;
        var addTurnIndex = Number(addBtn.getAttribute('data-ann-add-turn'));
        var skillNo = addBtn.getAttribute('data-ann-add-skill');
        if (state.modes[state.activeMode] && state.modes[state.activeMode][addTurnIndex] && SKILLS[skillNo]) {
          if (state.modes[state.activeMode][addTurnIndex].length >= MAX_ACTIONS_PER_TURN) return;
          state.modes[state.activeMode][addTurnIndex].push(skillNo);
          saveState();
          renderCard(card);
        }
        return;
      }

      var turnBtn = target.closest('[data-ann-turn]');
      if (turnBtn && card.contains(turnBtn)) {
        event.preventDefault();
        hideActiveTooltips();
        state.openTurn = Math.max(0, Math.min(getTurnCount() - 1, Number(turnBtn.getAttribute('data-ann-turn')) || 0));
        saveState();
        renderCard(card);
        return;
      }

      if (!target.closest('.ann-sim-turn')) {
        clearOpenTurn(card);
      }
    });

    document.addEventListener('click', function (event) {
      if (event.defaultPrevented) return;
      var target = event.target;
      if (!target || typeof target.closest !== 'function') return;
      if (target.closest('.ann-sim-card')) return;
      clearOpenTurn(card);
    });
  }

  function mountSimulator() {
    if (!isAnnPage() || document.querySelector('.ann-sim-card')) return;
    ensureStyles();
    loadState();

    var card = el('div', 'ann-sim-card');
    bindCardEvents(card);

    function mounted() {
      renderCard(card);
    }

    var CalcBase = window.CharacterCalcBase || null;
    if (CalcBase && typeof CalcBase.mountCardWhenReady === 'function') {
      CalcBase.mountCardWhenReady({
        card: card,
        cardClass: 'ann-sim-card',
        anchorSelector: '.ritual-card.card-style'
      }, mounted);
      return;
    }

    var ritualCard = document.querySelector('.ritual-card.card-style');
    if (ritualCard && ritualCard.parentNode) {
      ritualCard.parentNode.insertBefore(card, ritualCard);
      mounted();
    }
  }

  function observeOperationRerenders() {
    if (observerStarted || !isAnnPage() || typeof MutationObserver === 'undefined') return;
    var target = document.querySelector('.operation-levels');
    if (!target) {
      setTimeout(observeOperationRerenders, 100);
      return;
    }
    observerStarted = true;
    var pending = false;
    var observer = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      setTimeout(function () {
        pending = false;
        applyOperationIcons();
      }, 0);
    });
    observer.observe(target, { childList: true, subtree: true });
  }

  function apply() {
    if (!isAnnPage()) return;
    ensureStyles();
    applyOperationIcons();
    applySkillCardBadges();
    mountSimulator();
    observeOperationRerenders();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () {
        applyOperationIcons();
        applySkillCardBadges();
        mountSimulator();
      });
    }
    setTimeout(function () {
      applyOperationIcons();
      applySkillCardBadges();
      mountSimulator();
      observeOperationRerenders();
    }, 100);
    setTimeout(function () {
      applyOperationIcons();
      applySkillCardBadges();
      mountSimulator();
      observeOperationRerenders();
    }, 500);
  }

  window.AnnCalc.apply = apply;
  window.AnnCalc.applyOperationIcons = applyOperationIcons;
  window.AnnCalc.applySkillCardBadges = applySkillCardBadges;
  window.AnnCalc.compute = function (mode) {
    return compute(mode || state.activeMode);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
