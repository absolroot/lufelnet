;(function () {
  if (typeof window === 'undefined') return;

  window.MayumiCalc = window.MayumiCalc || {};
  window.MayumiCalc['마유미'] = true;

  if (!window.CharacterCalcBase || typeof window.CharacterCalcBase.registerSimpleTotalCalculator !== 'function') return;

  var CalcBase = window.CharacterCalcBase;
  var t = CalcBase.t;

  function revelationLabel(slotKey, fallback) {
    return t('gameTerms.revelation', 'Revelation') + ' ' + t('revelation.' + slotKey, fallback);
  }

  function forgeOptions(values) {
    var options = [];
    for (var index = 0; index < values.length; index++) {
      options.push({
        value: index,
        label: t('characterCalc.forge', 'Forge') + ' ' + index,
        amount: values[index]
      });
    }
    return options;
  }

  function selectOptions(values, labelBuilder) {
    var options = [];
    for (var index = 0; index < values.length; index++) {
      options.push({
        value: index,
        label: labelBuilder(index),
        amount: values[index]
      });
    }
    return options;
  }

  CalcBase.registerSimpleTotalCalculator({
    characterName: '마유미',
    cardClass: 'mayumi-calc-card',
    storageKey: 'mayumi_calc_state',
    titleIconName: '속도',
    title: function () { return t('mayumiCalcTitle', '마유미 속도 계산기'); },
    totalStatKey: 'gameTerms.speed',
    totalStatFallback: 'Speed',
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
      { id: 'LV10', label: function () { return t('mayumiCalcGoalLv10', 'LV10'); }, value: 176, note: function () { return t('mayumiCalcGoalLv10Note', '180 Recommended'); } },
      { id: 'LV10+5', label: function () { return t('mayumiCalcGoalLv10M', 'LV10+Mind5'); }, value: 194 },
      { id: 'LV13', label: function () { return t('mayumiCalcGoalLv13', 'LV13'); }, value: 189 },
      { id: 'LV13+5', label: function () { return t('mayumiCalcGoalLv13M', 'LV13+Mind5'); }, value: 207 }
    ],
    sections: [
      {
        label: function () { return t('characterCalc.sectionCharacterPage', 'Character Page'); },
        rows: [
          { type: 'fixed', key: 'baseStat', label: function () { return t('characterCalc.baseStatLv80', 'Base Stat (LV80)'); }, value: 125.8, unit: '' },
          {
            type: 'select',
            key: 'mindscape',
            stateKey: 'mindscapeLevel',
            label: function () { return t('gameTerms.mindscape', 'Mindscape') + ' LV'; },
            defaultValue: 0,
            options: function () {
              return selectOptions([0, 2, 4, 6, 8, 10], function (index) {
                return 'LV ' + index;
              });
            },
            unit: ''
          },
          {
            type: 'select',
            key: 'weapon',
            stateKey: 'weaponEnhance',
            label: function () { return t('gameTerms.exclusiveWeapon', 'Exclusive Weapon') + ' ' + t('characterCalc.forge', 'Forge'); },
            defaultValue: 0,
            options: function () { return forgeOptions([15, 15, 20, 20, 25, 25, 30]); }
          },
          { type: 'fixed', key: 'revelationSky', iconSlot: 'sky', label: function () { return revelationLabel('sky', 'Sky'); }, value: 20.3, unit: '' },
          { type: 'input', key: 'revSubMain', stateKey: 'revSubMain', iconSlot: 'space', label: function () { return revelationLabel('space', 'Space'); }, defaultValue: 0, unit: '' },
          { type: 'input', key: 'revSubSun', stateKey: 'revSubSun', iconSlot: 'sun', label: function () { return revelationLabel('sun', 'Sun'); }, defaultValue: 0, unit: '' },
          { type: 'input', key: 'revSubMoon', stateKey: 'revSubMoon', iconSlot: 'moon', label: function () { return revelationLabel('moon', 'Moon'); }, defaultValue: 0, unit: '' },
          { type: 'input', key: 'revSubStar', stateKey: 'revSubStar', iconSlot: 'star', label: function () { return revelationLabel('star', 'Star'); }, defaultValue: 0, unit: '' }
        ]
      },
      {
        label: function () { return t('characterCalc.sectionBattleEntry', 'Battle Entry'); },
        rows: [
          { type: 'fixed', key: 'reconciliationSet', label: function () { return t('characterCalc.revelationSetBonus', 'Revelation Set Bonus'); }, value: 6, unit: '' },
          { type: 'input', key: 'myPalace', stateKey: 'myPalace', label: function () { return t('gameTerms.myPalace', 'Thieves Den'); }, defaultValue: 1, unit: '' },
          { type: 'input', key: 'myPalaceRating', stateKey: 'myPalaceRating', label: function () { return t('gameTerms.myPalaceRating', 'Thieves Den Rating'); }, defaultValue: 0, unit: '' }
        ]
      }
    ]
  });
})();
