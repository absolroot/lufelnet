const MATERIAL_INFO = {
    konpaku_gem: {
      name: { kr: '영혼석', en: 'Konpaku Gem', jp: '魂魄石' },
      desc: {
        kr: '레벨업과 돌파에 사용되는 통화형 재화입니다.',
        en: 'Currency used for leveling and ascension.',
        jp: 'レベルアップと突破に使用する通貨型素材です。'
      }
    },
    lv_exp1: {
      name: { kr: '전기 조각', en: 'Thief Compendium Scrap', jp: '怪盗全書・切れ端' },
      desc: {
        kr: '괴도 경험치를 높이는 데 사용된다. 사용 시 즉시 200포인트가 증가한다.',
        en: 'Grants 200 EXP to an ally.',
        jp: '主人公以外の味方に経験値200を付与する。'
      }
    },
    lv_exp2: {
      name: { kr: '전기 단장', en: 'Thief Compendium Volume', jp: '怪盗全書・分冊' },
      desc: {
        kr: '괴도 경험치를 높이는 데 사용된다. 사용 시 즉시 1,000포인트가 증가한다.',
        en: 'Grants 1000 EXP to an ally.',
        jp: '主人公以外の味方に経験値1000を付与する。'
      }
    },
    lv_exp3: {
      name: { kr: '전기 전서', en: 'Thief Compendium Tome', jp: '怪盗全書・完成本' },
      desc: {
        kr: '괴도 경험치를 높이는 데 사용된다. 사용 시 즉시 4,000포인트가 증가한다.',
        en: 'Grants 4000 EXP to an ally.',
        jp: '主人公以外の味方に経験値4000を付与する。'
      }
    },
    lv_limit1: {
      name: { kr: '붓꽃의 향기', en: 'Whiff of Iris', jp: 'アイリスの微香水' },
      desc: {
        kr: '잠재력 레벨을 1·2로 올리는 데 사용된다. (최대 레벨 30)',
        en: 'Raises an ally’s Talent level (up to 2).',
        jp: '主人公以外の味方の潜在能力レベルを上げる(最大2まで)'
      }
    },
    lv_limit2: {
      name: { kr: '붓꽃의 진한 향기', en: 'Fragrance of Iris', jp: '濃厚なアヤメの香り' },
      desc: {
        kr: '잠재력 레벨을 3·4·5로 올리는 데 사용된다. (최대 레벨 60)',
        en: 'Raises an ally’s Talent level (up to 5).',
        jp: '仲間の潜在レベルを3、4、または5まで上げる。'
      }
    },
    lv_limit3: {
      name: { kr: '붓꽃의 깊은 향기', en: 'Essence of Iris', jp: 'アイリスの芳香水' },
      desc: {
        kr: '잠재력 레벨을 6·7로 올리는 데 사용된다. (최대 레벨 80)',
        en: 'Raises an ally’s Talent level (up to 7).',
        jp: '主人公以外の味方の潜在能力レベルを上げる（最大5まで）'
      }
    },
    wp_exp1: {
      name: { kr: '소형 범용 부품', en: 'Metal Parts', jp: 'メタルパーツ' },
      desc: {
        kr: '무기 경험치를 높이는 데 사용된다. 사용 시 즉시 100포인트가 증가한다.',
        en: 'Grants 100 EXP to a weapon.',
        jp: '武器に経験値を100付与する。'
      }
    },
    wp_exp2: {
      name: { kr: '중형 범용 부품', en: 'Silver Parts', jp: 'シルバーパーツ' },
      desc: {
        kr: '무기 경험치를 높이는 데 사용된다. 사용 시 즉시 500포인트가 증가한다.',
        en: 'Grants 500 EXP to a weapon.',
        jp: '武器に経験値を500付与する。'
      }
    },
    wp_exp3: {
      name: { kr: '대형 범용 부품', en: 'Weapon EXP 3', jp: 'ゴールドパーツ' },
      desc: {
        kr: '무기 경험치를 높이는 데 사용된다. 사용 시 즉시 2,000포인트가 증가한다.',
        en: 'Grants 2000 EXP to a weapon.',
        jp: '武器に経験値を2000付与する。'
      }
    },
    wp_limit1: {
      name: { kr: '거친 광석', en: 'Blue Crystal', jp: '青水晶' },
      desc: {
        kr: '무기 레벨을 LV2·LV3으로 올리는 데 사용된다. (최대 레벨 30)',
        en: 'Can overclock a level 10 - 20 weapon.',
        jp: 'レベル10〜20の武器の上限を突破できる。'
      }
    },
    wp_limit2: {
      name: { kr: '고급 광석', en: 'Purple Crystal', jp: '紫水晶' },
      desc: {
        kr: '무기 레벨을 LV4·LV5·LV6으로 올리는 데 사용된다. (최대 레벨 60)',
        en: 'Can overclock a level 30 - 50 weapon.',
        jp: 'レベル30~50の武器の上限を突破できる。'
      }
    },
    wp_limit3: {
      name: { kr: '최고급 광석', en: 'Yellow Crystal', jp: '黄水晶' },
      desc: {
        kr: '무기 레벨을 LV7·LV8으로 올리는 데 사용된다. (최대 레벨 80)',
        en: 'Can overclock a level 60 - 70 weapon.',
        jp: 'レベル60~70の武器の上限を突破できる。'
      }
    },
    skill_lv_1: {
      name: { kr: '향탑 S', en: 'Skill Incense S', jp: '技能の香・小' },
      desc: {
        kr: '스킬 레벨을 LV2·LV3으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 3).',
        jp: '主人公以外の味方のスキルレベルを上げる（最大3まで）'
      }
    },
    skill_lv_2: {
      name: { kr: '향탑 M', en: 'Skill Incense M', jp: '技能の香・中' },
      desc: {
        kr: '스킬 레벨을 LV4·LV5·LV6으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 6).',
        jp: '主人公以外の味方のスキルレベルを上げる（最大6まで）'
      }
    },
    skill_lv_3: {
      name: { kr: '향탑 L', en: 'Skill Incense L', jp: '技能の香・大' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '主人公以外の味方のスキルレベルを上げる（最大10まで）'
      }
    },
    skill_rose: {
      name: { kr: '욕망의 나무', en: 'Everlasting Incense', jp: '常久の香木' },
      desc: {
        kr: '스킬 레벨을 LV9·LV10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)'
      }
    },
    skill_item1: {
      name: { kr: '매혹적인 향기', en: 'Avatamsa Incense', jp: '華厳の霊香' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)'
      }
    },
    skill_item2: {
      name: { kr: '금사 향기', en: 'Hermit’s Incense', jp: '仙気の霊香' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)'
      }
    },
    skill_item3: {
      name: { kr: '노안 향기', en: 'Incense', jp: '愉悦の霊香' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)'
      }
    },
    skill_item4: {
      name: { kr: '꿈을 먹는 향', en: 'Incense', jp: '霊香（夢喰い）' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)'
      }
    },
    skill_item5: {
      name: { kr: '속박의 향기', en: 'Incense', jp: '霊香（束縛）' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)'
      }
    },
    md_mercury: {
      name: { kr: '영롱한 머큐리', en: 'Mercury', jp: '星屑の欠片' },
      desc: {
        kr: '『괴도 심상·속성 증가』 육성에 사용되는 재료다.',
        en: '',
        jp: '消費することで基本ステータスを上げるイメジャリーを解放できる。'
      }
    },
    md_bell: {
      name: { kr: '별자리 방울', en: 'Zodiac Bell', jp: '星座の鈴' },
      desc: {
        kr: '『괴도 심상·속성 강화』 육성에 사용되는 재료다.',
        en: '',
        jp: '「怪盗マインドスケープ・属性強化」の育成に使用する素材。'
      }
    },
    md_stat1: {
      name: { kr: '명성 수정구·하급', en: 'Blue Fame Crystal', jp: '星名クリスタル・下級' },
      desc: {
        kr: '『괴도 심상·진급 강화』 육성에 사용되는 재료다.',
        en: '',
        jp: '「怪盗マインドスケープ・昇級強化」の育成に使用する素材。'
      }
    },
    md_stat2: {
      name: { kr: '명성 수정구·고급', en: 'Purple Fame Crystal', jp: '星名クリスタル・上級' },
      desc: {
        kr: '『괴도 심상·진급 강화』 육성에 사용되는 재료다.',
        en: '',
        jp: '「怪盗マインドスケープ・昇級強化」の育成に使用する素材。'
      }
    },
    md_skill1: {
      name: { kr: '별가루 병·하급', en: 'Blue Star Dust Vial', jp: '星屑瓶・下級' },
      desc: {
        kr: '『괴도 심상·스킬 깨달음』 육성에 사용되는 재료다.',
        en: '',
        jp: '「怪盗マインドスケープ・スキル覚醒」の育成に使用する素材。'
      }
    },
    md_skill2: {
      name: { kr: '별가루 병·고급', en: 'Purple Star Dust Vial', jp: '星屑瓶・上級' },
      desc: {
        kr: '『괴도 심상·스킬 깨달음』 육성에 사용되는 재료다.',
        en: '',
        jp: '「怪盗マインドスケープ・スキル覚醒」の育成に使用する素材。'
      }
    }
  };
  