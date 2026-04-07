;(function () {
  if (typeof window === 'undefined') return;

  window.KoromaruCalc = window.KoromaruCalc || {};
  window.KoromaruCalc['코로마루'] = true;

  if (!window.CharacterCalcBase || typeof window.CharacterCalcBase.registerSimpleTotalCalculator !== 'function') return;

  var CalcBase = window.CharacterCalcBase;
  var t = CalcBase.t;

  function revelationLabel(slotKey, fallback) {
    return t('gameTerms.revelation', 'Revelation') + ' ' + t('revelation.' + slotKey, fallback);
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
    characterName: '코로마루',
    cardClass: 'koro-calc-card',
    storageKey: 'koromaru_calc_state',
    titleIconName: '효과 명중',
    title: function () { return t('koromaruCalcTitle', '코로마루 효과명중 계산기'); },
    totalStatKey: 'gameTerms.ailmentAccuracy',
    totalStatFallback: 'Ailment Accuracy',
    valueUnit: '%',
    theme: {
      accent: '#6f9dff',
      cardBackground: '#393f4b',
      sectionBackground: 'rgba(0,0,0,.18)',
      goalBackground: 'rgba(0,0,0,.2)',
      valueColor: '#8ab4f8',
      shadow: '0 4px 6px rgba(0,0,0,.1)'
    },
    goals: [
      { id: 'LV10', label: function () { return t('koromaruCalcGoalLv10', 'LV10'); }, value: 170.8 },
      { id: 'LV10+5', label: function () { return t('koromaruCalcGoalLv10M', 'LV10+Mind5'); }, value: 188.3 },
      { id: 'LV13', label: function () { return t('koromaruCalcGoalLv13', 'LV13'); }, value: 181.3 },
      { id: 'LV13+5', label: function () { return t('koromaruCalcGoalLv13M', 'LV13+Mind5'); }, value: 198.8 }
    ],
    sections: [
      {
        label: function () { return t('characterCalc.sectionCharacterPage', 'Character Page'); },
        rows: [
          { type: 'fixed', key: 'baseStat', label: function () { return t('characterCalc.baseStatLv80', 'Base Stat (LV80)'); }, value: 34.9 },
          {
            type: 'select',
            key: 'mindscape',
            stateKey: 'mindscapeLevel',
            label: function () { return t('gameTerms.mindscape', 'Mindscape') + ' LV'; },
            defaultValue: 0,
            options: function () { return selectOptions([0, 4.8, 9.6, 14.4, 19.2, 24.0], function (index) { return 'LV ' + index; }); }
          },
          {
            type: 'select',
            key: 'weapon',
            stateKey: 'weaponEnhance',
            label: function () { return t('gameTerms.exclusiveWeapon', 'Exclusive Weapon') + ' ' + t('characterCalc.forge', 'Forge'); },
            defaultValue: 0,
            options: function () { return selectOptions([36, 36, 47, 47, 58, 58, 69], function (index) { return t('characterCalc.forge', 'Forge') + ' ' + index; }); }
          },
          { type: 'fixed', key: 'revelationStar', iconSlot: 'star', label: function () { return revelationLabel('star', 'Star'); }, value: 37.6 },
          { type: 'input', key: 'revSubMain', stateKey: 'revSubMain', iconSlot: 'space', label: function () { return revelationLabel('space', 'Space'); }, defaultValue: 0 },
          { type: 'input', key: 'revSubSun', stateKey: 'revSubSun', iconSlot: 'sun', label: function () { return revelationLabel('sun', 'Sun'); }, defaultValue: 0 },
          { type: 'input', key: 'revSubMoon', stateKey: 'revSubMoon', iconSlot: 'moon', label: function () { return revelationLabel('moon', 'Moon'); }, defaultValue: 0 },
          { type: 'input', key: 'revSubSky', stateKey: 'revSubSky', iconSlot: 'sky', label: function () { return revelationLabel('sky', 'Sky'); }, defaultValue: 0 }
        ]
      },
      {
        label: function () { return t('characterCalc.sectionBattleEntry', 'Battle Entry'); },
        rows: [
          { type: 'input', key: 'revelationSet', stateKey: 'revelationSet', label: function () { return t('characterCalc.revelationSetBonus', 'Revelation Set Bonus'); }, defaultValue: 20 },
          { type: 'input', key: 'myPalace', stateKey: 'myPalace', label: function () { return t('gameTerms.myPalace', 'Thieves Den'); }, defaultValue: 2.3 },
          { type: 'input', key: 'myPalaceRating', stateKey: 'myPalaceRating', label: function () { return t('gameTerms.myPalaceRating', 'Thieves Den Rating'); }, defaultValue: function () { return CalcBase.getQevelBuffStat('ailment_accuracy'); } }
        ]
      }
    ]
  });
})();
