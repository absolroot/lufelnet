;(function () {
  if (typeof window === 'undefined') return;

  window.IchigoSummerCalc = window.IchigoSummerCalc || {};
  window.IchigoSummerCalc['이치고·여름'] = true;

  if (!window.CharacterCalcBase || typeof window.CharacterCalcBase.registerSimpleTotalCalculator !== 'function') return;

  var CalcBase = window.CharacterCalcBase;
  var t = CalcBase.t;

  function revelationLabel(slotKey, fallback) {
    return t('gameTerms.revelation', 'Revelation') + ' ' + t('revelation.' + slotKey, fallback);
  }

  function selectOptions(values, labelBuilder) {
    var options = [];
    for (var index = 0; index < values.length; index++) {
      options.push({ value: index, label: labelBuilder(index), amount: values[index] });
    }
    return options;
  }

  function getRowValue(context, key) {
    for (var index = 0; index < context.rows.length; index++) {
      if (context.rows[index].key === key) return context.getRowValue(context.rows[index]);
    }
    return 0;
  }

  function getIncludedValue(context, key) {
    for (var index = 0; index < context.rows.length; index++) {
      if (context.rows[index].key === key) return context.includeRowValue(context.rows[index]);
    }
    return 0;
  }

  CalcBase.registerSimpleTotalCalculator({
    characterName: '이치고·여름',
    cardClass: 'ichigo-summer-calc-card',
    storageKey: 'ichigo_summer_calc_state',
    collapsible: true,
    titleIconName: '생명',
    title: function () { return t('ichigoSummerCalcTitle', 'Ichigo Summer Max HP Calculator'); },
    totalStatKey: 'gameTerms.hp',
    totalStatFallback: 'HP',
    valueUnit: '',
    theme: {
      accent: '#d11f1f',
      cardBackground: 'var(--card-background)',
      borderColor: 'var(--border-red, rgba(115, 0, 0))',
      sectionBackground: 'rgba(0,0,0,.18)',
      goalBackground: 'rgba(0,0,0,.2)',
      goalActiveBackground: 'rgba(209,31,31,.18)',
      goalActiveBorder: 'rgba(209,31,31,.5)',
      goalActiveShadow: 'rgba(209,31,31,.15)',
      hoverBorder: 'rgba(255,255,255,.25)',
      inputFocusBorder: 'rgba(209,31,31,.6)',
      noteColor: 'var(--label-red, #ff7777)',
      valueColor: '#b39ddb',
      shadow: '0 4px 6px rgba(0,0,0,.1)'
    },
    goals: [
      { id: 'LV10', label: function () { return t('ichigoSummerCalcGoalLv10', 'LV10'); }, value: 17080 },
      { id: 'LV10+5', label: function () { return t('ichigoSummerCalcGoalLv10M', 'LV10+Mind5'); }, value: 18830 },
      { id: 'LV13', label: function () { return t('ichigoSummerCalcGoalLv13', 'LV13'); }, value: 18130 },
      { id: 'LV13+5', label: function () { return t('ichigoSummerCalcGoalLv13M', 'LV13+Mind5'); }, value: 19880 }
    ],
    calculateTotal: function (context) {
      var baseHp = getRowValue(context, 'awareness') + getRowValue(context, 'weapon');
      var percentHp = getIncludedValue(context, 'revelationMoon')
        + getIncludedValue(context, 'revelationStar')
        + getIncludedValue(context, 'revelationSky')
        + getIncludedValue(context, 'subHpPercent')
        + getIncludedValue(context, 'potentialHpPercent')
        + getIncludedValue(context, 'mindscapeHp')
        + getIncludedValue(context, 'attributeMindscapeHp')
        + getIncludedValue(context, 'weaponForge')
        + getIncludedValue(context, 'laborHpPercent');
      var flatHp = getIncludedValue(context, 'revelationSun')
        + getIncludedValue(context, 'subHpFlat')
        + getIncludedValue(context, 'naviHpFlat')
        + getIncludedValue(context, 'myPalaceHp')
        + getIncludedValue(context, 'myPalaceRating');

      return baseHp * (1 + percentHp / 100) + flatHp;
    },
    sections: [
      {
        label: function () { return t('characterStatsBaseTitle', 'Base Stats'); },
        rows: [
          {
            type: 'select',
            key: 'awareness',
            stateKey: 'awarenessLevel',
            label: function () { return t('ichigoSummerCalcAwareness', 'Awareness'); },
            defaultValue: 0,
            checkable: false,
            options: function () {
              return selectOptions([4320.01, 4397.61, 4475.21, 4553.61, 4631.21, 4708.81, 4786.41], function (index) {
                return t('ichigoSummerCalcAwarenessLevel', 'Awareness') + ' ' + index;
              });
            },
            unit: ''
          },
          {
            type: 'select',
            key: 'weapon',
            stateKey: 'weaponStar',
            label: function () { return t('ichigoSummerCalcWeapon', 'Weapon'); },
            defaultValue: 4,
            checkable: false,
            presentation: 'segmented',
            options: function () {
              return [
                { value: 4, label: t('ichigoSummerCalcWeapon4', '4-Star Weapon'), amount: 2283.59 },
                { value: 5, label: t('ichigoSummerCalcWeapon5', '5-Star Weapon'), amount: 2854.11 }
              ];
            },
            unit: ''
          },
          {
            type: 'select',
            key: 'weaponForge',
            stateKey: 'weaponForgeLevel',
            label: function () { return t('ichigoSummerCalcWeaponForge', '5-Star Weapon Forge'); },
            defaultValue: 0,
            visibleWhen: function (context) { return Number(context.state.weaponStar) === 5; },
            options: function () {
              return selectOptions([30, 30, 39, 39, 48, 48, 57], function (index) {
                return t('characterCalc.forge', 'Forge') + ' ' + index;
              });
            },
            unit: '%'
          },
        ]
      },
      {
        label: function () { return t('characterCalc.sectionCharacterPage', 'Character Page'); },
        rows: [
          { type: 'fixed', key: 'revelationSun', iconSlot: 'sun', label: function () { return revelationLabel('sun', 'Sun'); }, value: 1080, defaultChecked: true, unit: '' },
          { type: 'fixed', key: 'revelationMoon', iconSlot: 'moon', label: function () { return revelationLabel('moon', 'Moon'); }, value: 31.5, defaultChecked: true, unit: '%' },
          { type: 'fixed', key: 'revelationStar', iconSlot: 'star', label: function () { return revelationLabel('star', 'Star'); }, value: 31.5, defaultChecked: true, unit: '%' },
          { type: 'fixed', key: 'revelationSky', iconSlot: 'sky', label: function () { return revelationLabel('sky', 'Sky'); }, value: 31.5, defaultChecked: true, unit: '%' },
          { type: 'input', key: 'subHpPercent', stateKey: 'subHpPercent', label: function () { return t('ichigoSummerCalcSubHpPercent', 'HP % Sub Stats'); }, defaultValue: 0, defaultChecked: false, unit: '%' },
          { type: 'input', key: 'subHpFlat', stateKey: 'subHpFlat', label: function () { return t('ichigoSummerCalcSubHpFlat', 'HP Sub Stats'); }, defaultValue: 0, defaultChecked: false, step: 1, unit: '' },
          {
            type: 'fixed',
            key: 'potentialHpPercent',
            label: function () { return t('characterStatsAwakeTitle', 'Hidden Ability LV7') + ' - ' + t('gameTerms.hp', 'HP'); },
            value: 29,
            defaultChecked: true,
            unit: '%'
          },
          {
            type: 'select',
            key: 'mindscapeHp',
            stateKey: 'mindscapeLevel',
            label: function () { return t('characterDetailMindStat1', 'Rank Strengthening 1') + ' - ' + t('gameTerms.hp', 'HP'); },
            defaultValue: 0,
            defaultChecked: false,
            options: function () {
              return selectOptions([0, 4, 8, 12, 16, 20], function (index) {
                return 'LV ' + index;
              });
            },
            unit: '%'
          },
          {
            type: 'select',
            key: 'attributeMindscapeHp',
            stateKey: 'attributeMindscapeLevel',
            label: function () { return t('gameTerms.mindscapeNature', 'Attribute Mindscape') + ' - ' + t('gameTerms.hp', 'HP'); },
            defaultValue: 1,
            defaultChecked: false,
            options: function () {
              return [
                { value: 1, label: 'LV 1', amount: 10 },
                { value: 2, label: 'LV 2', amount: 20 }
              ];
            },
            unit: '%'
          }
        ]
      },
      {
        label: function () { return t('characterCalc.sectionBattleEntry', 'Battle Entry'); },
        rows: [
          { type: 'input', key: 'naviHpFlat', stateKey: 'naviHpFlat', label: function () { return t('ichigoSummerCalcNaviHpFlat', 'Elucidator HP'); }, defaultValue: 0, defaultChecked: false, step: 1, unit: '' },
          { type: 'fixed', key: 'laborHpPercent', label: function () { return t('ichigoSummerCalcLaborHpPercent', 'Labor HP'); }, value: 8, defaultChecked: true, unit: '%' },
          { type: 'input', key: 'myPalaceHp', stateKey: 'myPalaceHp', label: function () { return t('gameTerms.myPalace', 'Thieves Den'); }, defaultValue: function () { return CalcBase.getQevelBuffStat('HP'); }, defaultChecked: false, step: 1, unit: '' },
          { type: 'input', key: 'myPalaceRating', stateKey: 'myPalaceRating', label: function () { return t('ichigoSummerCalcMyPalaceRating', 'Thieves Den Rating'); }, defaultValue: 0, defaultChecked: false, step: 1, unit: '' }
        ]
      }
    ]
  });
})();
