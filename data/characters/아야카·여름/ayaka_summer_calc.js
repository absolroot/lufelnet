;(function () {
  if (typeof window === 'undefined') return;

  var CHARACTER_NAME = '아야카·여름';
  var STORAGE_KEY = 'ayaka_summer_operation_sim_v2';
  var DEFAULT_TURN_COUNT = 6;
  var DEFAULT_AYAKA_ORDER = 4;
  var MAX_TURNS = 20;
  var SLOT_COUNT = 4;
  var MAX_ACTIONS_PER_SLOT = 6;
  var MAX_HIGHLIGHT_REPEATS = 6;
  var MODE_IDS = ['r0', 'r1', 'r2', 'r6'];
  var STARWISH_ICON_SRC = '/data/characters/아야카·여름/PC077_01_12_27_05.png';
  var TIME_CONCERTO_ICON_SRC = '/data/characters/아야카·여름/PC077_01_12_29_06.png';

  var ACTION_TYPES = [
    'skill1',
    'skill2',
    'skill3',
    'basic',
    'highlight'
  ];

  var DEFAULT_ACTIONS = {
    basic: { baseMode: '21', customGain: 21 },
    skill1: { baseMode: '21', customGain: 21 },
    skill2: { baseMode: '21', customGain: 21 },
    skill3: { baseMode: '21', customGain: 21 },
    highlight: { baseMode: '21', customGain: 21 }
  };

  var DAMAGE_COEFFICIENTS = {
    r0: {
      skill1: 351.2,
      skill2: 184.4,
      skill3: 111.6 * 2,
      curtain: 43.9
    },
    r6: {
      skill1: 385.1,
      skill2: 202.2,
      skill3: 122.3 * 2,
      curtain: 48.2
    }
  };

  var I18N = {
    kr: {
      title: '아야카·여름 운영 시뮬레이터',
      awareness: '의식',
      awareness0: '의식 0',
      awareness1: '의식 1',
      awareness2: '의식 2',
      awareness6: '의식 6',
      turnCount: '턴 수',
      ayakaOrder: '아야카 순서',
      reset: '초기화',
      expand: '펼치기',
      collapse: '접기',
      turn: '턴',
      slot: '행동',
      ayaka: '아야카',
      hl: 'HL',
      starwish: '별의 소원',
      curtain: '별장막',
      notes: '음을 모아 선율로',
      noActions: '액션 없음',
      add: '+',
      edit: '수정',
      remove: '삭제',
      moveAction: '이동',
      baseGain: '기본',
      weaknessGain: '약점',
      custom: '커스텀',
      spend: '소모',
      invalid: '불가',
      start: '시작',
      end: '종료',
      eventLog: '이벤트',
      summary: '요약',
      baseAction: '기본',
      skillDamage: '스킬',
      skill1: '스킬 1',
      skill2: '스킬 2',
      skill3: '스킬 3',
      highlight: '아야카 HL',
      highlightTimes: '횟수',
      timeConcerto: '시간의 협주곡',
      starCurtain: '여름밤의 별장막',
      gatheredNotes: '음을 모아 선율로',
      firstSkill2: 'S2 첫 시전',
      skill1Once: 'S1은 1회만 사용 가능',
      notEnoughHl: 'HL 부족',
      maxActions: '슬롯당 최대 6개',
      skill1Gain: 'S1',
      skill2ImmediateGain: 'S2 첫 시전',
      skill2EndGain: '아야카 턴 종료',
      r6CurtainGain: '의식6 별장막',
      highlightGain: '별의 소원 획득',
      skill3Spend: 'S3 별의 소원 소비',
      skill3Boosted: '3중첩 강화',
      turnEndCurtain: '턴 종료 별장막',
      cap: '상한',
      deployed: '전개',
      active: '활성',
      inactive: '없음',
      use: '사용'
    },
    en: {
      title: 'Ayaka·Summer Operation Simulator',
      awareness: 'Awareness',
      awareness0: 'Awareness 0',
      awareness1: 'Awareness 1',
      awareness2: 'Awareness 2',
      awareness6: 'Awareness 6',
      turnCount: 'Turns',
      ayakaOrder: 'Ayaka Order',
      reset: 'Reset',
      expand: 'Expand',
      collapse: 'Collapse',
      turn: 'Turn',
      slot: 'Action',
      ayaka: 'Ayaka',
      hl: 'HL',
      starwish: 'Starwish',
      curtain: 'Curtain',
      notes: 'Gathered Notes',
      noActions: 'No actions',
      add: '+',
      edit: 'Edit',
      remove: 'Remove',
      moveAction: 'Move',
      baseGain: 'Base',
      weaknessGain: 'Weakness',
      custom: 'Custom',
      spend: 'Spend',
      invalid: 'Invalid',
      start: 'Start',
      end: 'End',
      eventLog: 'Events',
      summary: 'Summary',
      baseAction: 'Basic',
      skillDamage: 'Skill',
      skill1: 'Skill 1',
      skill2: 'Skill 2',
      skill3: 'Skill 3',
      highlight: 'Ayaka HL',
      highlightTimes: 'Times',
      timeConcerto: 'Time Concerto',
      starCurtain: 'Summer Night Star Curtain',
      gatheredNotes: 'Gathered Notes',
      firstSkill2: 'First Skill 2',
      skill1Once: 'Skill 1 can only be used once',
      notEnoughHl: 'Not enough HL',
      maxActions: 'Max 6 per slot',
      skill1Gain: 'Skill 1',
      skill2ImmediateGain: 'First Skill 2',
      skill2EndGain: 'Ayaka turn end',
      r6CurtainGain: 'Awareness 6 curtain',
      highlightGain: 'Starwish gained',
      skill3Spend: 'Skill 3 spent Starwish',
      skill3Boosted: '3-stack boost',
      turnEndCurtain: 'Turn-end curtain',
      cap: 'Cap',
      deployed: 'Deployed',
      active: 'Active',
      inactive: 'None',
      use: 'Use'
    },
    jp: {
      title: '坂井 綾香 夏 操作シミュレーター',
      awareness: '意識',
      awareness0: '意識 0',
      awareness1: '意識 1',
      awareness2: '意識 2',
      awareness6: '意識 6',
      turnCount: 'ターン数',
      ayakaOrder: '綾香の順番',
      reset: 'リセット',
      expand: '展開',
      collapse: '折りたたむ',
      turn: 'ターン',
      slot: '行動',
      ayaka: '綾香',
      hl: 'HL',
      starwish: '星の願い',
      curtain: '星幕',
      notes: '音を集めて曲に',
      noActions: '行動なし',
      add: '+',
      edit: '編集',
      remove: '削除',
      moveAction: '移動',
      baseGain: '基本',
      weaknessGain: '弱点',
      custom: 'カスタム',
      spend: '消費',
      invalid: '不可',
      start: '開始',
      end: '終了',
      eventLog: 'イベント',
      summary: '概要',
      baseAction: '基本',
      skillDamage: 'スキル',
      skill1: 'スキル 1',
      skill2: 'スキル 2',
      skill3: 'スキル 3',
      highlight: '綾香 HL',
      highlightTimes: '回数',
      timeConcerto: '時間の協奏曲',
      starCurtain: '夏夜の星幕',
      gatheredNotes: '音を集めて曲に',
      firstSkill2: '初回スキル2',
      skill1Once: 'スキル1は1回のみ使用可能',
      notEnoughHl: 'HL不足',
      maxActions: '1枠最大6個',
      skill1Gain: 'スキル1',
      skill2ImmediateGain: '初回スキル2',
      skill2EndGain: '綾香ターン終了',
      r6CurtainGain: '意識6 星幕',
      highlightGain: '星の願い獲得',
      skill3Spend: 'スキル3 星の願い消費',
      skill3Boosted: '3重強化',
      turnEndCurtain: 'ターン終了星幕',
      cap: '上限',
      deployed: '展開済み',
      active: '有効',
      inactive: 'なし',
      use: '使用'
    },
    cn: {
      title: '坂井绫香·夏日操作模拟器',
      awareness: '意识',
      awareness0: '意识 0',
      awareness1: '意识 1',
      awareness2: '意识 2',
      awareness6: '意识 6',
      turnCount: '回合数',
      ayakaOrder: '绫香顺位',
      reset: '重置',
      expand: '展开',
      collapse: '收起',
      turn: '回合',
      slot: '行动',
      ayaka: '绫香',
      hl: 'HL',
      starwish: '星之愿',
      curtain: '星幕',
      notes: '拾音成曲',
      noActions: '无行动',
      add: '+',
      edit: '编辑',
      remove: '删除',
      moveAction: '移动',
      baseGain: '基础',
      weaknessGain: '弱点',
      custom: '自定义',
      spend: '消耗',
      invalid: '不可用',
      start: '开始',
      end: '结束',
      eventLog: '事件',
      summary: '汇总',
      baseAction: '普通',
      skillDamage: '技能',
      skill1: '技能 1',
      skill2: '技能 2',
      skill3: '技能 3',
      highlight: '绫香 HL',
      highlightTimes: '次数',
      timeConcerto: '时间协奏曲',
      starCurtain: '夏夜星幕',
      gatheredNotes: '拾音成曲',
      firstSkill2: '首次技能2',
      skill1Once: '技能1只能使用1次',
      notEnoughHl: 'HL不足',
      maxActions: '每格最多6个',
      skill1Gain: '技能1',
      skill2ImmediateGain: '首次技能2',
      skill2EndGain: '绫香回合结束',
      r6CurtainGain: '意识6 星幕',
      highlightGain: '获得星之愿',
      skill3Spend: '技能3消耗星之愿',
      skill3Boosted: '3层强化',
      turnEndCurtain: '回合结束星幕',
      cap: '上限',
      deployed: '已展开',
      active: '有效',
      inactive: '无',
      use: '使用'
    }
  };

  var state = {
    awareness: 'r0',
    turnCount: DEFAULT_TURN_COUNT,
    ayakaOrder: DEFAULT_AYAKA_ORDER,
    openTurn: -1,
    openSlot: -1,
    dirty: false,
    turns: createDefaultTurns()
  };
  var dragState = null;
  var storageProfiles = {};
  var simCollapsed = true;

  window.AyakaSummerCalc = window.AyakaSummerCalc || {};
  window.AyakaSummerCalc[CHARACTER_NAME] = true;

  function getDefaultAyakaType(turnIndex, awareness) {
    if (turnIndex === 0) return 'skill1';
    if (awareness === 'r6') return 'skill3';
    return turnIndex % 2 === 1 ? 'skill2' : 'skill3';
  }

  function createDefaultTurns(awareness, ayakaOrder) {
    var turns = [];
    var mode = awareness || 'r0';
    var ayakaSlot = Math.max(0, Math.min(SLOT_COUNT - 1, (parseInt(ayakaOrder, 10) || DEFAULT_AYAKA_ORDER) - 1));
    for (var turn = 0; turn < MAX_TURNS; turn += 1) {
      var slots = [];
      for (var slot = 0; slot < SLOT_COUNT; slot += 1) {
        slots.push([createAction(slot === ayakaSlot ? getDefaultAyakaType(turn, mode) : 'basic')]);
      }
      turns.push(slots);
    }
    return turns;
  }

  function createAction(type) {
    var base = DEFAULT_ACTIONS[type] || DEFAULT_ACTIONS.basic;
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      type: type,
      baseMode: base.baseMode,
      customGain: base.customGain,
      hlCost: 100,
      highlightCount: 1
    };
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

  function isAyakaPage() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      return params.get('name') === CHARACTER_NAME || window.__CHARACTER_DEFAULT === CHARACTER_NAME;
    } catch (_) {
      return window.__CHARACTER_DEFAULT === CHARACTER_NAME;
    }
  }

  function isLocalDevelopmentHost() {
    try {
      var host = window.location.hostname;
      return host === '127.0.0.1' || host === 'localhost' || host === '::1';
    } catch (_) {
      return false;
    }
  }

  function getSkillBucket() {
    var lang = getCurrentLanguage();
    if (lang === 'en') return window.enCharacterSkillsData;
    if (lang === 'jp') return window.jpCharacterSkillsData;
    if (lang === 'cn') return window.cnCharacterSkillsData;
    return window.characterSkillsData;
  }

  function getSkillName(type) {
    var bucket = getSkillBucket() || {};
    var data = bucket[CHARACTER_NAME] || {};
    if (type === 'skill1') return (data.skill1 && data.skill1.name) || t('skill1');
    if (type === 'skill2') return (data.skill2 && data.skill2.name) || t('skill2');
    if (type === 'skill3') return (data.skill3 && data.skill3.name) || t('skill3');
    if (type === 'highlight') return (data.skill_highlight && data.skill_highlight.name) || t('highlight');
    if (type === 'timeConcerto') return t('timeConcerto');
    return t('baseAction');
  }

  function getActionShortLabel(type) {
    if (type === 'basic') return t('baseAction');
    if (type === 'skill1') return 'S1';
    if (type === 'skill2') return 'S2';
    if (type === 'skill3') return 'S3';
    if (type === 'highlight') return 'HL';
    return type;
  }

  function getHlCap() {
    return state.awareness === 'r2' || state.awareness === 'r6' ? 300 : 250;
  }

  function hasTimeConcerto() {
    return true;
  }

  function getDamageData() {
    return state.awareness === 'r6' ? DAMAGE_COEFFICIENTS.r6 : DAMAGE_COEFFICIENTS.r0;
  }

  function addSkillDamage(ctx, baseValue, isCurtain, multiplier) {
    if (!baseValue) return;
    var damage = baseValue;
    damage *= multiplier || 1;
    ctx.turnSkillDamage += damage;
  }

  function clampNumber(value, min, max) {
    var parsed = parseFloat(value);
    if (!isFinite(parsed)) parsed = min;
    if (parsed < min) return min;
    if (parsed > max) return max;
    return parsed;
  }

  function clampInteger(value, min, max) {
    return Math.round(clampNumber(value, min, max));
  }

  function fmt(value) {
    var rounded = Math.round(value * 10) / 10;
    if (Math.abs(rounded - Math.round(rounded)) < 0.01) return String(Math.round(rounded));
    return rounded.toFixed(1);
  }

  function getBaseGain(action) {
    if (!action) return 0;
    if (action.baseMode === '21') return 21;
    if (action.baseMode === 'custom') return clampNumber(action.customGain, 0, 300);
    return 17;
  }

  function getTotalActionGain(action) {
    return getBaseGain(action);
  }

  function getActionGainLabel(action) {
    if (!action) return t('baseGain');
    if (action.baseMode === '21') return t('weaknessGain');
    if (action.baseMode === 'custom') return t('custom');
    return t('baseGain');
  }

  function addHl(ctx, amount, events, label) {
    if (!amount) return;
    var before = ctx.hl;
    ctx.hl = Math.min(ctx.cap, Math.max(0, ctx.hl + amount));
    if (events) events.push(label + ' +' + fmt(amount) + ' (' + fmt(before) + ' → ' + fmt(ctx.hl) + ')');
  }

  function spendHl(ctx, amount, events, label) {
    var before = ctx.hl;
    ctx.hl = Math.max(0, ctx.hl - amount);
    if (events) events.push(label + ' -' + fmt(amount) + ' (' + fmt(before) + ' → ' + fmt(ctx.hl) + ')');
  }

  function applyTimeConcerto(ctx) {
    var events = [];
    if (state.awareness === 'r2' || state.awareness === 'r6') addHl(ctx, 25, events, t('timeConcerto'));
    if (state.awareness !== 'r0' && ctx.curtainDeployed) triggerCurtain(ctx, events, t('curtain'), 1, { boosted: true });
    return {
      type: 'timeConcerto',
      name: getSkillName('timeConcerto'),
      valid: true,
      reason: '',
      hlAfter: ctx.hl,
      starwishAfter: ctx.starwish,
      events: events,
      isAyakaSlot: true,
      automatic: true,
      triggersTurnEnd: false
    };
  }

  function triggerCurtain(ctx, events, label, count, options) {
    var total = count || 1;
    if (!ctx.curtainDeployed || total <= 0) return;
    var damageMultiplier = options && options.boosted ? 2 : 1;
    addSkillDamage(ctx, getDamageData().curtain * total, true, damageMultiplier);
    ctx.curtainCount += total;
    events.push(label + ' x' + total);
    if (state.awareness === 'r6') {
      addHl(ctx, 25 * total, events, t('r6CurtainGain'));
    }
  }

  function applyAction(ctx, action, isAyakaSlot) {
    var events = [];
    var valid = true;
    var reason = '';
    var type = action.type;

    if (type === 'skill1') {
      if (ctx.skill1Used) {
        valid = false;
        reason = t('skill1Once');
      } else {
        addSkillDamage(ctx, getDamageData().skill1, false, 1);
        ctx.skill1Used = true;
        ctx.curtainDeployed = true;
        addHl(ctx, 100, events, t('skill1Gain'));
      }
    }

    if (type === 'skill2') {
      addSkillDamage(ctx, getDamageData().skill2, false, 1);
      ctx.skill2Uses += 1;
      if (!ctx.skill2FirstUsed) {
        ctx.skill2FirstUsed = true;
        addHl(ctx, 32, events, t('skill2ImmediateGain'));
      }
      ctx.gatheredEndTicks = 2;
      ctx.gatheredKnown = true;
      events.push(t('gatheredNotes') + ' ' + t('active'));
    }

    if (type === 'highlight') {
      var cost = 100;
      var highlightCount = clampInteger(action.highlightCount || 1, 1, MAX_HIGHLIGHT_REPEATS);
      var totalCost = cost * highlightCount;
      if (ctx.hl < totalCost) {
        valid = false;
        reason = t('notEnoughHl');
      } else {
        spendHl(ctx, totalCost, events, t('highlight') + (highlightCount > 1 ? ' x' + highlightCount : ''));
        var starwishGain = 0;
        for (var highlightIndex = 0; highlightIndex < highlightCount; highlightIndex += 1) {
          ctx.turnHighlightUses += 1;
          starwishGain += ctx.turnHighlightUses === 1 ? 1 : 3;
        }
        ctx.starwish += starwishGain;
        ctx.highlightUses += highlightCount;
        events.push(t('highlightGain') + ' +' + starwishGain);
      }
    }

    if (type === 'skill3') {
      addSkillDamage(ctx, getDamageData().skill3, false, 1);
      var spent = ctx.starwish;
      ctx.starwish = 0;
      ctx.skill3Uses += 1;
      if (spent > 0) {
        events.push(t('skill3Spend') + ' ' + spent);
        triggerCurtain(ctx, events, t('curtain'), spent, { boosted: spent >= 3 });
        if (spent >= 3) events.push(t('skill3Boosted'));
      }
    }

    var gain = type === 'highlight' ? 0 : getTotalActionGain(action);
    addHl(ctx, gain, isAyakaSlot ? events : null, getActionGainLabel(action));

    return {
      type: type,
      label: getActionShortLabel(type),
      name: getSkillName(type),
      valid: valid,
      reason: reason,
      hlAfter: ctx.hl,
      starwishAfter: ctx.starwish,
      events: events,
      isAyakaSlot: isAyakaSlot,
      triggersTurnEnd: isAyakaSlot && type !== 'highlight'
    };
  }

  function applyAyakaTurnEnd(ctx, events) {
    if (ctx.curtainDeployed) triggerCurtain(ctx, events, t('turnEndCurtain'), 1);

    var hasR6Notes = state.awareness === 'r6' && ctx.curtainDeployed;
    var hasTimedNotes = ctx.gatheredEndTicks > 0;
    if (hasR6Notes || hasTimedNotes) {
      addHl(ctx, 32, events, t('skill2EndGain'));
      ctx.gatheredKnown = true;
    }

    if (ctx.gatheredEndTicks > 0) ctx.gatheredEndTicks -= 1;
  }

  function createInitialContext() {
    return {
      cap: getHlCap(),
      hl: 0,
      starwish: 0,
      curtainDeployed: false,
      turnSkillDamage: 0,
      skill1Used: false,
      skill2FirstUsed: false,
      skill2Uses: 0,
      skill3Uses: 0,
      highlightUses: 0,
      turnHighlightUses: 0,
      curtainCount: 0,
      gatheredEndTicks: 0,
      gatheredKnown: false
    };
  }

  function cloneContext(ctx) {
    var copy = {};
    Object.keys(ctx).forEach(function (key) {
      copy[key] = ctx[key];
    });
    return copy;
  }

  function compute() {
    var ctx = createInitialContext();
    var turns = [];
    var visibleTurns = Math.max(1, Math.min(MAX_TURNS, parseInt(state.turnCount, 10) || DEFAULT_TURN_COUNT));
    var ayakaSlot = Math.max(0, Math.min(SLOT_COUNT - 1, (parseInt(state.ayakaOrder, 10) || DEFAULT_AYAKA_ORDER) - 1));

    for (var turnIndex = 0; turnIndex < visibleTurns; turnIndex += 1) {
      ctx.turnHighlightUses = 0;
      ctx.turnSkillDamage = 0;
      var turnResult = {
        index: turnIndex,
        start: cloneContext(ctx),
        slots: [],
        end: null,
        skillDamage: 0
      };

      for (var slotIndex = 0; slotIndex < SLOT_COUNT; slotIndex += 1) {
        var slotEvents = [];
        var slotResult = {
          index: slotIndex,
          start: cloneContext(ctx),
          autoActions: [],
          actions: [],
          endEvents: slotEvents,
          end: null,
          isAyakaSlot: slotIndex === ayakaSlot
        };

        if (slotIndex === ayakaSlot && hasTimeConcerto()) {
          slotResult.autoActions.push(applyTimeConcerto(ctx));
        }

        var actions = getSlotActions(turnIndex, slotIndex);
        for (var actionIndex = 0; actionIndex < actions.length; actionIndex += 1) {
          slotResult.actions.push(applyAction(ctx, actions[actionIndex], slotIndex === ayakaSlot));
        }

        var hasAyakaTurnAction = slotResult.actions.some(function (result) {
          return result.triggersTurnEnd;
        });
        if (slotIndex === ayakaSlot && hasAyakaTurnAction) applyAyakaTurnEnd(ctx, slotEvents);

        slotResult.end = cloneContext(ctx);
        turnResult.slots.push(slotResult);
      }

      turnResult.end = cloneContext(ctx);
      turnResult.skillDamage = ctx.turnSkillDamage;
      turns.push(turnResult);
    }

    return { turns: turns, end: cloneContext(ctx) };
  }

  function getSlotActions(turnIndex, slotIndex) {
    ensureStateShape();
    return state.turns[turnIndex][slotIndex];
  }

  function moveAyakaOrder(nextOrder) {
    var previousSlot = Math.max(0, Math.min(SLOT_COUNT - 1, (parseInt(state.ayakaOrder, 10) || DEFAULT_AYAKA_ORDER) - 1));
    var nextSlot = Math.max(0, Math.min(SLOT_COUNT - 1, (parseInt(nextOrder, 10) || DEFAULT_AYAKA_ORDER) - 1));
    if (previousSlot === nextSlot) {
      state.ayakaOrder = nextSlot + 1;
      return;
    }
    if (!Array.isArray(state.turns)) state.turns = createDefaultTurns(state.awareness, state.ayakaOrder);
    for (var turn = 0; turn < MAX_TURNS; turn += 1) {
      if (!Array.isArray(state.turns[turn])) state.turns[turn] = [];
      while (state.turns[turn].length < SLOT_COUNT) state.turns[turn].push([createAction('basic')]);
      var moved = state.turns[turn].splice(previousSlot, 1)[0];
      state.turns[turn].splice(nextSlot, 0, moved);
      state.turns[turn] = state.turns[turn].slice(0, SLOT_COUNT);
    }
    state.ayakaOrder = nextSlot + 1;
  }

  function compactHighlightActions(actions) {
    var compacted = [];
    actions.forEach(function (action) {
      if (action.type === 'highlight' && compacted.length) {
        var previous = compacted[compacted.length - 1];
        if (previous.type === 'highlight') {
          previous.highlightCount = clampInteger((previous.highlightCount || 1) + (action.highlightCount || 1), 1, MAX_HIGHLIGHT_REPEATS);
          return;
        }
      }
      compacted.push(action);
    });
    return compacted;
  }

  function ensureStateShape() {
    state.turnCount = Math.max(1, Math.min(MAX_TURNS, parseInt(state.turnCount, 10) || DEFAULT_TURN_COUNT));
    state.ayakaOrder = Math.max(1, Math.min(SLOT_COUNT, parseInt(state.ayakaOrder, 10) || DEFAULT_AYAKA_ORDER));
    if (MODE_IDS.indexOf(state.awareness) === -1) state.awareness = 'r0';
    if (typeof state.dirty !== 'boolean') state.dirty = true;
    if (!Number.isFinite(Number(state.openTurn))) state.openTurn = -1;
    if (!Number.isFinite(Number(state.openSlot))) state.openSlot = -1;

    if (!Array.isArray(state.turns)) state.turns = createDefaultTurns(state.awareness, state.ayakaOrder);
    var ayakaSlot = state.ayakaOrder - 1;
    for (var turn = 0; turn < MAX_TURNS; turn += 1) {
      if (!Array.isArray(state.turns[turn])) state.turns[turn] = [];
      for (var slot = 0; slot < SLOT_COUNT; slot += 1) {
        if (!Array.isArray(state.turns[turn][slot])) state.turns[turn][slot] = [];
        var normalizedActions = state.turns[turn][slot].filter(function (action) {
          return action && ACTION_TYPES.indexOf(action.type) !== -1;
        }).map(function (action) {
          var base = DEFAULT_ACTIONS[action.type] || DEFAULT_ACTIONS.basic;
          return {
            id: action.id || Date.now().toString(36) + Math.random().toString(36).slice(2),
            type: action.type,
            baseMode: action.baseMode === '17' || action.baseMode === '21' || action.baseMode === 'custom' ? action.baseMode : base.baseMode,
            customGain: clampNumber(action.customGain, 0, 300),
            hlCost: 100,
            highlightCount: clampInteger(action.highlightCount || 1, 1, MAX_HIGHLIGHT_REPEATS)
          };
        });
        if (!normalizedActions.length) normalizedActions = [createAction('basic')];
        if (slot !== ayakaSlot) {
          state.turns[turn][slot] = compactHighlightActions(normalizedActions.map(function (action) {
            var type = action.type === 'highlight' ? 'highlight' : 'basic';
            var base = DEFAULT_ACTIONS[type] || DEFAULT_ACTIONS.basic;
            return {
              id: action.id || Date.now().toString(36) + Math.random().toString(36).slice(2),
              type: type,
              baseMode: action.baseMode === '17' || action.baseMode === '21' || action.baseMode === 'custom' ? action.baseMode : base.baseMode,
              customGain: clampNumber(action.customGain, 0, 300),
              hlCost: 100,
              highlightCount: clampInteger(action.highlightCount || 1, 1, MAX_HIGHLIGHT_REPEATS)
            };
          }));
        } else {
          state.turns[turn][slot] = compactHighlightActions(normalizedActions);
        }
      }
    }
  }

  function applyDefaultPattern() {
    state.turns = createDefaultTurns(state.awareness, state.ayakaOrder);
    state.openTurn = -1;
    state.openSlot = -1;
    state.dirty = false;
    ensureStateShape();
  }

  function cloneTurns(turns) {
    try {
      return JSON.parse(JSON.stringify(turns || []));
    } catch (_) {
      return createDefaultTurns(state.awareness, state.ayakaOrder);
    }
  }

  function createDefaultProfile(awareness) {
    return {
      turnCount: DEFAULT_TURN_COUNT,
      ayakaOrder: DEFAULT_AYAKA_ORDER,
      dirty: false,
      turns: createDefaultTurns(awareness, DEFAULT_AYAKA_ORDER)
    };
  }

  function hasConfiguredProfile(profiles) {
    if (!profiles || typeof profiles !== 'object') return false;
    return MODE_IDS.some(function (mode) {
      return profiles[mode] && profiles[mode].dirty === true;
    });
  }

  function snapshotProfile() {
    ensureStateShape();
    return {
      turnCount: state.turnCount,
      ayakaOrder: state.ayakaOrder,
      dirty: state.dirty,
      turns: cloneTurns(state.turns)
    };
  }

  function applyProfile(awareness, profile) {
    var nextAwareness = MODE_IDS.indexOf(awareness) === -1 ? 'r0' : awareness;
    var nextProfile = profile && typeof profile === 'object' ? profile : createDefaultProfile(nextAwareness);
    state.awareness = nextAwareness;
    state.turnCount = nextProfile.turnCount || DEFAULT_TURN_COUNT;
    state.ayakaOrder = nextProfile.ayakaOrder || DEFAULT_AYAKA_ORDER;
    state.dirty = typeof nextProfile.dirty === 'boolean' ? nextProfile.dirty : false;
    state.turns = Array.isArray(nextProfile.turns) ? cloneTurns(nextProfile.turns) : createDefaultTurns(nextAwareness, state.ayakaOrder);
    if (!state.dirty) state.turns = createDefaultTurns(state.awareness, state.ayakaOrder);
    state.openTurn = -1;
    state.openSlot = -1;
    ensureStateShape();
  }

  function normalizeStoragePayload(payload) {
    if (!payload || typeof payload !== 'object') return { currentAwareness: 'r0', profiles: {}, collapsed: true };
    if (payload.profiles && typeof payload.profiles === 'object') {
      var profiles = payload.profiles;
      return {
        currentAwareness: MODE_IDS.indexOf(payload.currentAwareness) === -1 ? (payload.awareness || 'r0') : payload.currentAwareness,
        profiles: profiles,
        collapsed: typeof payload.collapsed === 'boolean' ? payload.collapsed : !hasConfiguredProfile(profiles)
      };
    }
    var legacyAwareness = MODE_IDS.indexOf(payload.awareness) === -1 ? 'r0' : payload.awareness;
    var legacyProfile = {
      turnCount: payload.turnCount || DEFAULT_TURN_COUNT,
      ayakaOrder: payload.ayakaOrder || DEFAULT_AYAKA_ORDER,
      dirty: typeof payload.dirty === 'boolean' ? payload.dirty : false,
      turns: Array.isArray(payload.turns) ? payload.turns : createDefaultTurns(legacyAwareness, payload.ayakaOrder || DEFAULT_AYAKA_ORDER)
    };
    var profiles = {};
    profiles[legacyAwareness] = legacyProfile;
    return { currentAwareness: legacyAwareness, profiles: profiles, collapsed: !legacyProfile.dirty };
  }

  function saveState() {
    try {
      storageProfiles[state.awareness] = snapshotProfile();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 3,
        currentAwareness: state.awareness,
        collapsed: simCollapsed,
        profiles: storageProfiles
      }));
    } catch (_) {}
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = normalizeStoragePayload(JSON.parse(raw));
      storageProfiles = saved.profiles || {};
      simCollapsed = saved.collapsed === true;
      var awareness = MODE_IDS.indexOf(saved.currentAwareness) === -1 ? 'r0' : saved.currentAwareness;
      applyProfile(awareness, storageProfiles[awareness]);
    } catch (_) {}
  }

  function resetState() {
    var awareness = MODE_IDS.indexOf(state.awareness) === -1 ? 'r0' : state.awareness;
    state.awareness = awareness;
    state.turnCount = DEFAULT_TURN_COUNT;
    state.ayakaOrder = DEFAULT_AYAKA_ORDER;
    state.openTurn = -1;
    state.openSlot = -1;
    state.dirty = false;
    state.turns = createDefaultTurns(awareness, state.ayakaOrder);
    saveState();
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function option(value, text, selected) {
    var node = document.createElement('option');
    node.value = value;
    node.textContent = text;
    if (selected) node.selected = true;
    return node;
  }

  function createRemoveIcon() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '14');
    svg.setAttribute('height', '14');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    ['M18 6 6 18', 'M6 6l12 12'].forEach(function (d) {
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '2.4');
      path.setAttribute('stroke-linecap', 'round');
      svg.appendChild(path);
    });
    return svg;
  }

  function createChevronIcon() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M9 18l6-6-6-6');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2.3');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    return svg;
  }

  function createStarwishIcon() {
    var img = document.createElement('img');
    img.className = 'ayaka-starwish-icon';
    img.src = STARWISH_ICON_SRC;
    img.alt = t('starwish');
    img.title = t('starwish');
    return img;
  }

  function createTimeConcertoIcon() {
    var img = document.createElement('img');
    img.className = 'ayaka-time-concerto-icon';
    img.src = TIME_CONCERTO_ICON_SRC;
    img.alt = t('timeConcerto');
    img.title = t('timeConcerto');
    return img;
  }

  function createOperationConcertoIcon() {
    var img = document.createElement('img');
    img.className = 'ayaka-operation-concerto-icon';
    img.src = TIME_CONCERTO_ICON_SRC;
    img.alt = t('timeConcerto');
    img.title = t('timeConcerto');
    return img;
  }

  function getStarwishEventParts(eventText) {
    var text = String(eventText || '');
    var starwish = t('starwish');
    var keys = ['highlightGain', 'skill3Spend'];
    for (var index = 0; index < keys.length; index += 1) {
      var label = t(keys[index]);
      var starwishIndex = label.indexOf(starwish);
      if (starwishIndex === -1 || text.indexOf(label) !== 0) continue;
      return {
        before: label.slice(0, starwishIndex).trim(),
        after: label.slice(starwishIndex + starwish.length).trim(),
        amount: text.slice(label.length).trim()
      };
    }
    return null;
  }

  function renderEventChip(eventText) {
    var starwishParts = getStarwishEventParts(eventText);
    if (starwishParts !== null) {
      var starwishChip = el('span', 'ayaka-event-starwish');
      if (starwishParts.before) starwishChip.appendChild(document.createTextNode(starwishParts.before + ' '));
      starwishChip.appendChild(createStarwishIcon());
      var suffix = [starwishParts.after, starwishParts.amount].filter(Boolean).join(' ');
      if (suffix) starwishChip.appendChild(document.createTextNode(suffix));
      return starwishChip;
    }
    return el('span', null, eventText);
  }

  function replaceConcertoTextNode(textNode) {
    var text = textNode && textNode.nodeValue ? textNode.nodeValue : '';
    if (text.indexOf('[협주]') === -1 || !textNode.parentNode) return false;
    var fragment = document.createDocumentFragment();
    text.split('[협주]').forEach(function (part, index) {
      if (part) fragment.appendChild(document.createTextNode(part));
      if (index < text.split('[협주]').length - 1) fragment.appendChild(createOperationConcertoIcon());
    });
    textNode.parentNode.replaceChild(fragment, textNode);
    return true;
  }

  function replaceOperationConcertoMarkers() {
    var root = document.querySelector('.operation-settings');
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || node.nodeValue.indexOf('[협주]') === -1) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(replaceConcertoTextNode);
  }

  function observeOperationConcertoMarkers() {
    var root = document.querySelector('.operation-settings');
    if (!root || root.__ayakaConcertoObserver) return;
    root.__ayakaConcertoObserver = true;
    replaceOperationConcertoMarkers();
    if (typeof MutationObserver !== 'function') return;
    var observer = new MutationObserver(function () {
      replaceOperationConcertoMarkers();
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    root.__ayakaConcertoMutationObserver = observer;
  }

  function startsWithEventLabel(eventText, label) {
    var text = String(eventText || '');
    return text === label || text.indexOf(label + ' ') === 0;
  }

  function renderEventChevron() {
    return el('span', 'ayaka-event-chevron', '›');
  }

  function renderCurtainFlowChip(eventText, boosted) {
    var text = String(eventText || '');
    if (boosted) text += ' (' + t('skill3Boosted') + ')';
    return el('span', 'ayaka-event-flow', text);
  }

  function getSkill3Flow(eventTexts, startIndex) {
    var spendText = String(eventTexts[startIndex] || '');
    if (!startsWithEventLabel(spendText, t('skill3Spend'))) return null;

    var cursor = startIndex + 1;
    var curtainText = String(eventTexts[cursor] || '');
    if (!startsWithEventLabel(curtainText, t('curtain'))) return null;
    cursor += 1;

    var r6Text = '';
    var boosted = false;
    while (cursor < eventTexts.length) {
      var text = String(eventTexts[cursor] || '');
      if (startsWithEventLabel(text, t('r6CurtainGain'))) {
        r6Text = text;
        cursor += 1;
        continue;
      }
      if (text === t('skill3Boosted')) {
        boosted = true;
        cursor += 1;
        continue;
      }
      break;
    }

    var nodes = [renderEventChip(spendText), renderEventChevron(), renderCurtainFlowChip(curtainText, boosted)];
    if (r6Text) {
      nodes.push(renderEventChevron());
      nodes.push(renderEventChip(r6Text));
    }
    return { nodes: nodes, nextIndex: cursor };
  }

  function getCurtainGainFlow(eventTexts, startIndex) {
    var curtainText = String(eventTexts[startIndex] || '');
    var isCurtain = startsWithEventLabel(curtainText, t('curtain')) || startsWithEventLabel(curtainText, t('turnEndCurtain'));
    if (!isCurtain) return null;

    var nextText = String(eventTexts[startIndex + 1] || '');
    if (!startsWithEventLabel(nextText, t('r6CurtainGain'))) return null;

    return {
      nodes: [renderCurtainFlowChip(curtainText, false), renderEventChevron(), renderEventChip(nextText)],
      nextIndex: startIndex + 2
    };
  }

  function appendEventNodes(container, eventTexts) {
    for (var index = 0; index < eventTexts.length; index += 1) {
      var flow = getSkill3Flow(eventTexts, index) || getCurtainGainFlow(eventTexts, index);
      if (flow) {
        flow.nodes.forEach(function (node) {
          container.appendChild(node);
        });
        index = flow.nextIndex - 1;
      } else {
        container.appendChild(renderEventChip(eventTexts[index]));
      }
    }
  }

  function renderCard(card) {
    ensureStateShape();
    var result = compute();
    card.innerHTML = '';
    card.classList.toggle('is-collapsed', simCollapsed);

    var header = el('div', 'ayaka-sim-header');
    header.appendChild(el('h2', 'ayaka-sim-title', t('title')));
    var toggle = el('button', 'ayaka-collapse-toggle');
    toggle.type = 'button';
    toggle.title = simCollapsed ? t('expand') : t('collapse');
    toggle.setAttribute('aria-label', simCollapsed ? t('expand') : t('collapse'));
    toggle.setAttribute('aria-expanded', simCollapsed ? 'false' : 'true');
    toggle.setAttribute('data-ayaka-collapse', '1');
    toggle.appendChild(createChevronIcon());
    header.appendChild(toggle);
    card.appendChild(header);

    if (simCollapsed) return;

    card.appendChild(renderControls());

    var grid = el('div', 'ayaka-turn-grid');
    result.turns.forEach(function (turn) {
      grid.appendChild(renderTurn(turn));
    });
    card.appendChild(grid);
  }

  function renderControls() {
    var controls = el('div', 'ayaka-sim-controls');
    var turnOptions = [];
    for (var i = 1; i <= MAX_TURNS; i += 1) turnOptions.push([String(i), String(i)]);
    controls.appendChild(renderSelectControl('awareness', t('awareness'), [
      ['r0', t('awareness0')],
      ['r1', t('awareness1')],
      ['r2', t('awareness2')],
      ['r6', t('awareness6')]
    ], state.awareness));

    controls.appendChild(renderSelectControl('turn-count', t('turnCount'), turnOptions, String(state.turnCount)));

    controls.appendChild(renderSelectControl('ayaka-order', t('ayakaOrder'), [
      ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']
    ], String(state.ayakaOrder)));

    var reset = el('button', 'ayaka-sim-reset ayaka-control-reset', t('reset'));
    reset.type = 'button';
    reset.setAttribute('data-ayaka-reset', '1');
    controls.appendChild(reset);

    return controls;
  }

  function renderSelectControl(key, label, options, selected) {
    var wrap = el('label', 'ayaka-control');
    wrap.appendChild(el('span', null, label));
    var select = document.createElement('select');
    select.setAttribute('data-ayaka-control', key);
    options.forEach(function (item) {
      select.appendChild(option(item[0], item[1], item[0] === selected));
    });
    wrap.appendChild(select);
    return wrap;
  }

  function renderTurn(turn) {
    var turnEl = el('section', 'ayaka-turn');
    var title = el('div', 'ayaka-turn-title');
    title.appendChild(el('span', null, (turn.index + 1) + t('turn')));
    var stateText = t('start') + ' HL ' + fmt(turn.start.hl) + ' → ' + t('end') + ' HL ' + fmt(turn.end.hl);
    if (turn.skillDamage > 0) stateText += ' · ' + t('skillDamage') + ' ' + fmt(turn.skillDamage) + '%';
    title.appendChild(el('span', 'ayaka-turn-state', stateText));
    turnEl.appendChild(title);

    var slots = el('div', 'ayaka-slot-grid');
    slots.style.gridTemplateColumns = turn.slots.map(function (slot) {
      return slot.isAyakaSlot ? 'minmax(360px,1.55fr)' : 'minmax(132px,.82fr)';
    }).join(' ');
    turn.slots.forEach(function (slot) {
      slots.appendChild(renderSlot(turn.index, slot));
    });
    turnEl.appendChild(slots);
    return turnEl;
  }

  function renderSlot(turnIndex, slot) {
    var slotEl = el('div', 'ayaka-slot' + (slot.isAyakaSlot ? ' ayaka-slot-own' : ''));
    var actions = getSlotActions(turnIndex, slot.index);

    var header = el('div', 'ayaka-slot-header');
    header.appendChild(el('span', 'ayaka-slot-label', slot.isAyakaSlot ? t('ayaka') : t('slot') + ' ' + (slot.index + 1)));
    header.appendChild(el('span', 'ayaka-slot-hl', 'HL ' + fmt(slot.start.hl) + ' → ' + fmt(slot.end.hl)));

    var headerActions = el('div', 'ayaka-slot-actions');
    if (actions.length < MAX_ACTIONS_PER_SLOT) {
      var add = el('button', 'ayaka-slot-tool ayaka-slot-add', t('add'));
      add.type = 'button';
      add.title = t('add');
      add.setAttribute('data-ayaka-quick-add-turn', String(turnIndex));
      add.setAttribute('data-ayaka-quick-add-slot', String(slot.index));
      headerActions.appendChild(add);
    }
    header.appendChild(headerActions);
    slotEl.appendChild(header);

    var list = el('div', 'ayaka-action-list');
    if (!actions.length) list.appendChild(el('div', 'ayaka-empty', t('noActions')));
    if (slot.autoActions && slot.autoActions.length) {
      slot.autoActions.forEach(function (actionResult) {
        list.appendChild(renderAutomaticAction(actionResult));
      });
    }
    actions.forEach(function (action, actionIndex) {
      var actionResult = slot.actions[actionIndex] || {};
      list.appendChild(renderAction(turnIndex, slot.index, actionIndex, action, actionResult, actions.length));
    });
    slotEl.appendChild(list);

    if (slot.endEvents && slot.endEvents.length) {
      var events = el('div', 'ayaka-slot-events');
      appendEventNodes(events, slot.endEvents);
      slotEl.appendChild(events);
    }

    return slotEl;
  }

  function renderAutomaticAction(result) {
    var row = el('div', 'ayaka-action ayaka-action-auto');
    var name = result.name || t('timeConcerto');
    var title = el('span', 'ayaka-auto-title');
    if (result.type === 'timeConcerto') title.appendChild(createTimeConcertoIcon());
    title.appendChild(document.createTextNode(name));
    row.appendChild(title);
    if (result.events && result.events.length) {
      result.events.forEach(function (eventText) {
        var text = String(eventText || '');
        if (text.indexOf(name + ' ') === 0) text = text.slice(name.length + 1);
        row.appendChild(el('span', 'ayaka-auto-event', text));
      });
    }
    return row;
  }

  function renderAction(turnIndex, slotIndex, actionIndex, action, result, actionCount) {
    var row = el('div', 'ayaka-action' + (result.valid === false ? ' is-invalid' : ''));
    if (actionCount > 1) {
      row.setAttribute('data-ayaka-drop-turn', String(turnIndex));
      row.setAttribute('data-ayaka-drop-slot', String(slotIndex));
      row.setAttribute('data-ayaka-drop-index', String(actionIndex));
    }

    if (actionCount > 1) {
      var dragHandle = el('span', 'ayaka-drag-handle', '::');
      dragHandle.title = t('moveAction');
      dragHandle.setAttribute('aria-label', t('moveAction'));
      dragHandle.setAttribute('role', 'button');
      dragHandle.setAttribute('tabindex', '0');
      dragHandle.setAttribute('draggable', 'true');
      dragHandle.setAttribute('data-ayaka-drag-turn', String(turnIndex));
      dragHandle.setAttribute('data-ayaka-drag-slot', String(slotIndex));
      dragHandle.setAttribute('data-ayaka-drag-index', String(actionIndex));
      row.appendChild(dragHandle);
    }

    var main = el('div', 'ayaka-action-main');
    if (result.isAyakaSlot) {
      main.appendChild(renderActionTypeSelect(turnIndex, slotIndex, actionIndex, action, ACTION_TYPES));
    } else {
      main.appendChild(renderActionTypeSelect(turnIndex, slotIndex, actionIndex, action, ['basic', 'highlight']));
    }
    if (result.valid === false) main.appendChild(el('span', 'ayaka-invalid', result.reason || t('invalid')));
    row.appendChild(main);

    var controls = el('div', 'ayaka-action-controls');
    if (action.type !== 'highlight') controls.appendChild(renderBaseSelect(turnIndex, slotIndex, actionIndex, action));
    if (action.type === 'highlight') {
      controls.appendChild(renderNumberInput(turnIndex, slotIndex, actionIndex, 'highlightCount', action.highlightCount || 1, t('highlightTimes'), 1, MAX_HIGHLIGHT_REPEATS));
    }
    if (action.type !== 'highlight' && action.baseMode === 'custom') {
      controls.appendChild(renderNumberInput(turnIndex, slotIndex, actionIndex, 'customGain', action.customGain, t('custom')));
    }
    if (result.isAyakaSlot || actionCount > 1) {
      var remove = el('button', 'ayaka-remove');
      remove.type = 'button';
      remove.title = t('remove');
      remove.setAttribute('aria-label', t('remove'));
      remove.setAttribute('data-ayaka-remove-turn', String(turnIndex));
      remove.setAttribute('data-ayaka-remove-slot', String(slotIndex));
      remove.setAttribute('data-ayaka-remove-index', String(actionIndex));
      remove.appendChild(createRemoveIcon());
      controls.appendChild(remove);
    }
    row.appendChild(controls);

    if (result.events && result.events.length) {
      var events = el('div', 'ayaka-action-events');
      appendEventNodes(events, result.events);
      row.appendChild(events);
    }

    return row;
  }

  function renderInlineEvents(eventTexts) {
    var events = el('div', 'ayaka-action-events ayaka-action-events-inline');
    appendEventNodes(events, eventTexts);
    return events;
  }

  function renderBaseSelect(turnIndex, slotIndex, actionIndex, action) {
    var wrap = el('label', 'ayaka-mini-control');
    var select = document.createElement('select');
    select.setAttribute('data-ayaka-action-field', 'baseMode');
    select.title = t('baseGain');
    setActionDataset(select, turnIndex, slotIndex, actionIndex);
    select.appendChild(option('17', t('baseGain') + ' 17', action.baseMode === '17'));
    select.appendChild(option('21', t('weaknessGain') + ' 21', action.baseMode === '21'));
    select.appendChild(option('custom', t('custom'), action.baseMode === 'custom'));
    wrap.appendChild(select);
    return wrap;
  }

  function renderActionTypeSelect(turnIndex, slotIndex, actionIndex, action, types) {
    var wrap = el('label', 'ayaka-mini-control ayaka-type-control');
    var select = document.createElement('select');
    select.setAttribute('data-ayaka-action-field', 'type');
    select.title = getSkillName(action.type);
    setActionDataset(select, turnIndex, slotIndex, actionIndex);
    (types || ACTION_TYPES).forEach(function (type) {
      select.appendChild(option(type, getActionShortLabel(type), action.type === type));
    });
    wrap.appendChild(select);
    return wrap;
  }

  function updateActionType(action, type) {
    if (!action || ACTION_TYPES.indexOf(type) === -1 || action.type === type) return;
    var next = createAction(type);
    action.type = type;
    action.baseMode = action.baseMode || next.baseMode;
    action.customGain = Number.isFinite(Number(action.customGain)) ? action.customGain : next.customGain;
    action.hlCost = 100;
    action.highlightCount = type === 'highlight' ? clampInteger(action.highlightCount || next.highlightCount, 1, MAX_HIGHLIGHT_REPEATS) : 1;
  }

  function renderNumberInput(turnIndex, slotIndex, actionIndex, field, value, label, min, max) {
    var wrap = el('label', 'ayaka-mini-control' + (field === 'highlightCount' ? ' ayaka-repeat-control' : ''));
    wrap.appendChild(el('span', null, label));
    var input = document.createElement('input');
    input.type = 'number';
    input.min = String(min === undefined ? 0 : min);
    input.max = String(max === undefined ? 300 : max);
    input.step = '1';
    input.value = fmt(value || 0);
    input.setAttribute('data-ayaka-action-field', field);
    setActionDataset(input, turnIndex, slotIndex, actionIndex);
    wrap.appendChild(input);
    return wrap;
  }

  function setActionDataset(node, turnIndex, slotIndex, actionIndex) {
    node.setAttribute('data-ayaka-turn', String(turnIndex));
    node.setAttribute('data-ayaka-slot', String(slotIndex));
    node.setAttribute('data-ayaka-index', String(actionIndex));
  }

  function clearDragMarkers(card) {
    if (!card) return;
    card.querySelectorAll('.ayaka-action.is-drag-over').forEach(function (node) {
      node.classList.remove('is-drag-over');
    });
  }

  function swapActions(turnIndex, slotIndex, fromIndex, toIndex) {
    if (fromIndex === toIndex) return false;
    var actions = getSlotActions(turnIndex, slotIndex);
    if (!actions[fromIndex] || !actions[toIndex]) return false;
    var temp = actions[fromIndex];
    actions[fromIndex] = actions[toIndex];
    actions[toIndex] = temp;
    return true;
  }

  function bindEvents(card) {
    if (!card || card.__ayakaEventsBound) return;
    card.__ayakaEventsBound = true;
    card.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== 'function') return;

      var collapseBtn = target.closest('[data-ayaka-collapse]');
      if (collapseBtn && card.contains(collapseBtn)) {
        event.preventDefault();
        simCollapsed = !simCollapsed;
        saveState();
        renderCard(card);
        return;
      }

      var resetBtn = target.closest('[data-ayaka-reset]');
      if (resetBtn && card.contains(resetBtn)) {
        event.preventDefault();
        resetState();
        renderCard(card);
        return;
      }

      var removeBtn = target.closest('[data-ayaka-remove-index]');
      if (removeBtn && card.contains(removeBtn)) {
        event.preventDefault();
        var removeTurn = Number(removeBtn.getAttribute('data-ayaka-remove-turn'));
        var removeSlot = Number(removeBtn.getAttribute('data-ayaka-remove-slot'));
        var removeIndex = Number(removeBtn.getAttribute('data-ayaka-remove-index'));
        var actions = getSlotActions(removeTurn, removeSlot);
        actions.splice(removeIndex, 1);
        state.dirty = true;
        saveState();
        renderCard(card);
        return;
      }

      var quickAddBtn = target.closest('[data-ayaka-quick-add-turn][data-ayaka-quick-add-slot]');
      if (quickAddBtn && card.contains(quickAddBtn)) {
        event.preventDefault();
        var quickTurn = Number(quickAddBtn.getAttribute('data-ayaka-quick-add-turn'));
        var quickSlot = Number(quickAddBtn.getAttribute('data-ayaka-quick-add-slot'));
        var quickActions = getSlotActions(quickTurn, quickSlot);
        if (quickActions.length >= MAX_ACTIONS_PER_SLOT) return;
        quickActions.push(createAction('basic'));
        state.dirty = true;
        saveState();
        renderCard(card);
        return;
      }
    });

    card.addEventListener('change', function (event) {
      handleChange(event, card);
    });

    card.addEventListener('dragstart', function (event) {
      var handle = event.target && event.target.closest ? event.target.closest('[data-ayaka-drag-index]') : null;
      if (!handle || !card.contains(handle)) return;
      dragState = {
        turn: Number(handle.getAttribute('data-ayaka-drag-turn')),
        slot: Number(handle.getAttribute('data-ayaka-drag-slot')),
        index: Number(handle.getAttribute('data-ayaka-drag-index'))
      };
      var row = handle.closest('.ayaka-action');
      if (row) row.classList.add('is-dragging');
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', [dragState.turn, dragState.slot, dragState.index].join(':'));
      }
    });

    card.addEventListener('dragover', function (event) {
      var row = event.target && event.target.closest ? event.target.closest('[data-ayaka-drop-index]') : null;
      if (!row || !card.contains(row) || !dragState) return;
      var turn = Number(row.getAttribute('data-ayaka-drop-turn'));
      var slot = Number(row.getAttribute('data-ayaka-drop-slot'));
      var index = Number(row.getAttribute('data-ayaka-drop-index'));
      if (turn !== dragState.turn || slot !== dragState.slot || index === dragState.index) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
      clearDragMarkers(card);
      row.classList.add('is-drag-over');
    });

    card.addEventListener('dragleave', function (event) {
      var row = event.target && event.target.closest ? event.target.closest('[data-ayaka-drop-index]') : null;
      if (row && card.contains(row)) row.classList.remove('is-drag-over');
    });

    card.addEventListener('drop', function (event) {
      var row = event.target && event.target.closest ? event.target.closest('[data-ayaka-drop-index]') : null;
      if (!row || !card.contains(row) || !dragState) return;
      var turn = Number(row.getAttribute('data-ayaka-drop-turn'));
      var slot = Number(row.getAttribute('data-ayaka-drop-slot'));
      var index = Number(row.getAttribute('data-ayaka-drop-index'));
      if (turn !== dragState.turn || slot !== dragState.slot) return;
      event.preventDefault();
      if (swapActions(turn, slot, dragState.index, index)) {
        state.dirty = true;
        saveState();
      }
      dragState = null;
      clearDragMarkers(card);
      renderCard(card);
    });

    card.addEventListener('dragend', function () {
      dragState = null;
      clearDragMarkers(card);
      card.querySelectorAll('.ayaka-action.is-dragging').forEach(function (node) {
        node.classList.remove('is-dragging');
      });
    });
  }

  function handleChange(event, card) {
    var target = event.target;
    if (!target) return;

    var control = target.getAttribute('data-ayaka-control');
    if (control) {
      if (control === 'awareness') {
        var nextAwareness = MODE_IDS.indexOf(target.value) === -1 ? state.awareness : target.value;
        if (nextAwareness !== state.awareness) {
          saveState();
          applyProfile(nextAwareness, storageProfiles[nextAwareness]);
          saveState();
        }
        renderCard(card);
        return;
      }
      if (control === 'turn-count') state.turnCount = clampNumber(target.value, 1, MAX_TURNS);
      if (control === 'ayaka-order') {
        if (!state.dirty) {
          state.turns = createDefaultTurns(state.awareness, state.ayakaOrder);
          state.dirty = true;
        }
        moveAyakaOrder(clampNumber(target.value, 1, SLOT_COUNT));
      } else if (!state.dirty) {
        applyDefaultPattern();
      }
      saveState();
      renderCard(card);
      return;
    }

    var field = target.getAttribute('data-ayaka-action-field');
    if (!field) return;
    var turn = Number(target.getAttribute('data-ayaka-turn'));
    var slot = Number(target.getAttribute('data-ayaka-slot'));
    var index = Number(target.getAttribute('data-ayaka-index'));
    var actions = getSlotActions(turn, slot);
    var action = actions[index];
    if (!action) return;

    if (field === 'type') {
      var ayakaSlot = Math.max(0, Math.min(SLOT_COUNT - 1, (parseInt(state.ayakaOrder, 10) || DEFAULT_AYAKA_ORDER) - 1));
      var nextType = slot === ayakaSlot || target.value === 'highlight' ? target.value : 'basic';
      updateActionType(action, nextType);
    }
    if (field === 'baseMode') action.baseMode = target.value;
    if (field === 'customGain') action[field] = clampNumber(target.value, 0, 300);
    if (field === 'highlightCount') action[field] = clampInteger(target.value, 1, MAX_HIGHLIGHT_REPEATS);
    state.dirty = true;
    saveState();
    renderCard(card);
  }

  function ensureStyles() {
    if (document.getElementById('ayaka-summer-operation-style')) return;
    var style = document.createElement('style');
    style.id = 'ayaka-summer-operation-style';
    style.textContent = [
      '.ayaka-sim-card{display:none;background:var(--card-background);border-bottom:3px solid var(--border-red,#d11f1f);border-radius:16px;padding:20px 28px 24px;margin:20px 0;box-shadow:0 4px 6px rgba(0,0,0,.2)}',
      '.ayaka-sim-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 14px;padding:0 0 14px;border-bottom:1px solid rgba(255,255,255,.14)}',
      '.ayaka-sim-card.is-collapsed .ayaka-sim-header{margin-bottom:0;padding-bottom:0;border-bottom:0}',
      '.ayaka-sim-title{font-size:20px;color:#fff;margin:0;font-weight:650;border:0!important;padding:0!important;width:auto!important;line-height:1.35}',
      '.ayaka-sim-reset,.ayaka-remove,.ayaka-slot-tool,.ayaka-collapse-toggle{border:1px solid rgba(255,255,255,0);background:rgba(0,0,0,.24);color:rgba(255,255,255,.78);border-radius:8px;cursor:pointer;transition:background .16s,border-color .16s,color .16s}',
      '.ayaka-sim-reset{padding:7px 12px;font-size:12px;white-space:nowrap}',
      '.ayaka-control-reset{height:100%;min-height:36px;align-self:stretch}',
      '.ayaka-collapse-toggle{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;padding:0;flex:0 0 auto}',
      '.ayaka-collapse-toggle svg{display:block;transition:transform .16s;transform:rotate(90deg)}',
      '.ayaka-sim-card.is-collapsed .ayaka-collapse-toggle svg{transform:rotate(0deg)}',
      '.ayaka-sim-reset:hover,.ayaka-remove:hover,.ayaka-slot-tool:hover,.ayaka-collapse-toggle:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.24);color:#fff}',
      '.ayaka-sim-controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) auto;gap:10px;margin-bottom:12px}',
      '.ayaka-control{display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,0);border-radius:8px;padding:8px 10px;min-width:0}',
      '.ayaka-control span{font-size:12px;color:rgba(255,255,255,.68);white-space:nowrap}',
      '.ayaka-control select,.ayaka-mini-control select,.ayaka-mini-control input{background:rgba(0,0,0,.36);border:1px solid rgba(255,255,255,0);border-radius:6px;color:#fff;font-size:12px;padding:4px 6px;min-width:58px}',
      '.ayaka-mini-control input{width:58px;text-align:right}',
      '.ayaka-repeat-control input{width:42px;min-width:42px}',
      '.ayaka-turn-grid{display:flex;flex-direction:column;gap:10px}',
      '.ayaka-turn{background:rgba(0,0,0,.14);border:1px solid rgba(255,255,255,0);border-radius:10px;padding:10px}',
      '.ayaka-turn-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;color:#fff;font-size:13px;font-weight:700}',
      '.ayaka-turn-state{font-size:12px;color:rgba(255,255,255,.5);font-weight:600;font-variant-numeric:tabular-nums}',
      '.ayaka-slot-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}',
      '.ayaka-slot{min-width:0;background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,0);border-radius:8px;padding:8px}',
      '.ayaka-slot-own{box-shadow:0 0 0 1px rgba(54,178,216,.18) inset}',
      '.ayaka-slot-header{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:6px;width:100%;border:0;background:transparent;color:#fff;padding:0;margin:0 0 7px;text-align:left;font-size:12px;font-weight:700}',
      '.ayaka-slot-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.ayaka-slot-hl{color:rgba(255,255,255,.48);font-size:11px;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}',
      '.ayaka-slot-actions{display:flex;align-items:center;justify-content:flex-end;gap:4px}',
      '.ayaka-slot-tool{display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:24px;padding:0 6px;font-size:11px;font-weight:800;line-height:1}',
      '.ayaka-action-list{display:flex;flex-direction:column;gap:6px}',
      '.ayaka-empty{color:rgba(255,255,255,.36);font-size:12px;min-height:26px;display:flex;align-items:center}',
      '.ayaka-action{display:flex;align-items:center;gap:4px;flex-wrap:wrap;border:1px solid rgba(255,255,255,0);border-radius:7px;background:rgba(0,0,0,.2);padding:6px;min-width:0}',
      '.ayaka-action.is-invalid{border-color:rgba(255,107,107,.45);background:rgba(255,107,107,.07)}',
      '.ayaka-action-auto{border-color:rgba(54,178,216,.25);background:rgba(54,178,216,.08);gap:8px}',
      '.ayaka-action.is-dragging{opacity:.55}',
      '.ayaka-action.is-drag-over{border-color:rgba(54,178,216,.65);background:rgba(54,178,216,.1)}',
      '.ayaka-drag-handle{display:inline-flex;align-items:center;justify-content:center;width:14px;height:20px;border-radius:5px;color:rgba(255,255,255,.38);font-size:10px;font-weight:900;line-height:1;cursor:grab;user-select:none;flex:0 0 auto}',
      '.ayaka-drag-handle:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.78)}',
      '.ayaka-drag-handle:active{cursor:grabbing}',
      '.ayaka-action-main{display:flex;align-items:center;gap:6px;min-width:0}',
      '.ayaka-action-name{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:22px;border-radius:6px;background:rgba(255,255,255,.08);color:#fff;font-size:11px;font-weight:800;white-space:nowrap}',
      '.ayaka-invalid{color:#ff8c8c;font-size:11px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.ayaka-action-controls{display:flex;flex:1 1 auto;flex-wrap:wrap;align-items:center;gap:4px;min-width:0}',
      '.ayaka-mini-control{display:flex;align-items:center;gap:4px;color:rgba(255,255,255,.5);font-size:10px;white-space:nowrap}',
      '.ayaka-auto-title{display:inline-flex;align-items:center;gap:4px;color:#fff;font-size:11px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.ayaka-auto-event{color:rgba(255,255,255,.58);font-size:10px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.ayaka-remove{display:inline-flex;align-items:center;justify-content:center;flex:0 0 20px;width:20px;height:20px;padding:0;font-size:11px;line-height:1;margin-left:auto;border-radius:6px}',
      '.ayaka-remove svg{display:block;width:11px;height:11px}',
      '.ayaka-action-events,.ayaka-slot-events{display:flex;flex:0 0 100%;flex-wrap:wrap;gap:4px;margin-top:5px}',
      '.ayaka-slot-events{margin-left:6px;width:calc(100% - 6px)}',
      '.ayaka-action-events-inline{flex:1 1 180px;margin-top:0;min-width:120px}',
      '.ayaka-action-events span,.ayaka-slot-events span{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:rgba(255,255,255,.56);background:rgba(255,255,255,.05);border-radius:5px;padding:2px 5px}',
      '.ayaka-event-chevron{background:transparent!important;border-radius:0!important;padding:0!important;color:rgba(255,255,255,.34)!important;font-size:12px!important;font-weight:800}',
      '.ayaka-starwish-icon{display:inline-block;width:13px;height:13px;object-fit:contain;flex:0 0 auto}',
      '.ayaka-time-concerto-icon{display:inline-block;width:16px;height:16px;object-fit:contain;flex:0 0 auto}',
      '.ayaka-operation-concerto-icon{display:inline-block;width:12px;height:16px;object-fit:contain;vertical-align:-4px;margin:0 1px}',
      '@media(min-width:1280px){.ayaka-sim-card{display:block}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function mountSimulator() {
    if (!isAyakaPage() || !isLocalDevelopmentHost() || document.querySelector('.ayaka-sim-card')) return;
    ensureStyles();
    loadState();

    var card = el('div', 'ayaka-sim-card card-style');
    bindEvents(card);

    function mounted() {
      renderCard(card);
    }

    var CalcBase = window.CharacterCalcBase || null;
    if (CalcBase && typeof CalcBase.mountCardWhenReady === 'function') {
      CalcBase.mountCardWhenReady({
        card: card,
        cardClass: 'ayaka-sim-card',
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

  function apply() {
    if (!isAyakaPage()) return;
    ensureStyles();
    observeOperationConcertoMarkers();
    mountSimulator();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () {
        observeOperationConcertoMarkers();
        mountSimulator();
      });
    }
    setTimeout(function () {
      observeOperationConcertoMarkers();
      mountSimulator();
    }, 250);
    setTimeout(observeOperationConcertoMarkers, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
