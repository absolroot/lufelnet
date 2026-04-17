;(function () {
  if (typeof window === 'undefined') return;

  window.KatayamaCalc = window.KatayamaCalc || {};
  window.KatayamaCalc['카타야마'] = true;

  if (!window.CharacterCalcBase || typeof window.CharacterCalcBase.registerSimpleTotalCalculator !== 'function') return;

  var CalcBase = window.CharacterCalcBase;
  var t = CalcBase.t;
  var COPY = {
    kr: {
      title: '카타야마 속도 계산기',
      weapon3SuperLimit: '3성 무기 (초극한 보유 시)',
      weapon5: '5성 무기 개조',
      revelationSet: '계시 세트 효과 (화해+창조)'
    },
    en: {
      title: 'Katayama Speed Calculator',
      weapon3SuperLimit: '3-Star Weapon (When Super Limit is active)',
      weapon5: '5-Star Weapon Forge',
      revelationSet: 'Revelation Set Bonus (Reconciliation+Creation)'
    },
    jp: {
      title: '片山 速さ計算機',
      weapon3SuperLimit: '3★武器（超極限所持時）',
      weapon5: '5★武器 改造',
      revelationSet: '啓示セット効果（調和+創造）'
    },
    cn: {
      title: '片山速度计算器',
      weapon3SuperLimit: '3星武器（拥有超极限时）',
      weapon5: '5星武器改造',
      revelationSet: '启示套装效果（和解+创造）'
    }
  };

  function getCurrentLanguage() {
    try {
      var params = new URLSearchParams(window.location.search);
      var queryLang = params.get('lang');
      if (queryLang === 'en' || queryLang === 'jp' || queryLang === 'cn') return queryLang;
    } catch (_) {}

    try {
      var path = window.location.pathname || '';
      if (path.indexOf('/en/') !== -1) return 'en';
      if (path.indexOf('/jp/') !== -1) return 'jp';
      if (path.indexOf('/cn/') !== -1) return 'cn';
    } catch (_) {}

    return 'kr';
  }

  function getCopy(key) {
    var lang = getCurrentLanguage();
    return (COPY[lang] && COPY[lang][key]) || COPY.kr[key] || key;
  }

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
    characterName: '카타야마',
    cardClass: 'katayama-calc-card',
    storageKey: 'katayama_calc_state',
    titleIconName: '속도',
    title: function () { return t('katayamaCalcTitle', getCopy('title')); },
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
      { id: 'LV10', label: function () { return t('katayamaCalcGoalLv10', 'LV10'); }, value: 180.2 },
      { id: 'LV10+5', label: function () { return t('katayamaCalcGoalLv10M', 'LV10+Mind5'); }, value: 194.0 },
      { id: 'LV13', label: function () { return t('katayamaCalcGoalLv13', 'LV13'); }, value: 187.3 },
      { id: 'LV13+5', label: function () { return t('katayamaCalcGoalLv13M', 'LV13+Mind5'); }, value: 205.3 }
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
            label: function () { return t('katayamaCalcWeapon5', getCopy('weapon5')); },
            defaultValue: 0,
            defaultChecked: true,
            mutuallyExclusiveGroup: 'katayamaWeapon',
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
          { type: 'fixed', key: 'revelationSet', label: function () { return t('katayamaCalcRevelationSet', getCopy('revelationSet')); }, value: 6, unit: '' },
          { type: 'fixed', key: 'weapon3SuperLimit', label: function () { return t('katayamaCalcWeapon3SuperLimit', getCopy('weapon3SuperLimit')); }, value: 14, unit: '', defaultChecked: false, mutuallyExclusiveGroup: 'katayamaWeapon' },
          { type: 'input', key: 'myPalace', stateKey: 'myPalace', label: function () { return t('gameTerms.myPalace', 'Thieves Den'); }, defaultValue: 1, unit: '' },
          { type: 'input', key: 'myPalaceRating', stateKey: 'myPalaceRating', label: function () { return t('gameTerms.myPalaceRating', 'Thieves Den Rating'); }, defaultValue: 0, unit: '' }
        ]
      }
    ]
  });
})();
