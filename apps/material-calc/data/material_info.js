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
      name: { kr: '전기 조각', en: 'Thief Compendium Scrap', jp: '泥棒事典の破片' },
      desc: {
        kr: '괴도 경험치를 높이는 데 사용된다. 사용 시 즉시 200포인트가 증가한다.',
        en: 'Grants 200 EXP to an ally.',
        jp: '仲間の怪盗経験値が200ポイント増加する。'
      }
    },
    lv_exp2: {
      name: { kr: '전기 단장', en: 'Thief Compendium Volume', jp: '泥棒事典の巻物' },
      desc: {
        kr: '괴도 경험치를 높이는 데 사용된다. 사용 시 즉시 1,000포인트가 증가한다.',
        en: 'Grants 1000 EXP to an ally.',
        jp: '仲間の怪盗経験値が1000ポイント増加する。'
      }
    },
    lv_exp3: {
      name: { kr: '전기 전서', en: 'Thief Compendium Tome', jp: '泥棒事典の書' },
      desc: {
        kr: '괴도 경험치를 높이는 데 사용된다. 사용 시 즉시 4,000포인트가 증가한다.',
        en: 'Grants 4000 EXP to an ally.',
        jp: '仲間の怪盗経験値が4000ポイント増加する。'
      }
    },
    lv_limit1: {
      name: { kr: '붓꽃의 향기', en: 'Whiff of Iris', jp: 'アヤメの香り' },
      desc: {
        kr: '잠재력 레벨을 1·2로 올리는 데 사용된다.',
        en: 'Raises an ally’s Talent level (up to 2).',
        jp: '仲間の潜在レベルを1または2まで上げる。'
      }
    },
    lv_limit2: {
      name: { kr: '붓꽃의 진한 향기', en: 'Fragrance of Iris', jp: '濃厚なアヤメの香り' },
      desc: {
        kr: '잠재력 레벨을 3·4·5로 올리는 데 사용된다.',
        en: 'Raises an ally’s Talent level (up to 5).',
        jp: '仲間の潜在レベルを3、4、または5まで上げる。'
      }
    },
    lv_limit3: {
      name: { kr: '붓꽃의 깊은 향기', en: 'Essence of Iris', jp: '深いアヤメの香り' },
      desc: {
        kr: '잠재력 레벨을 6·7로 올리는 데 사용된다.',
        en: 'Raises an ally’s Talent level (up to 7).',
        jp: '仲間の潜在レベルを6または7まで上げる。'
      }
    },
    wp_exp1: {
      name: { kr: '소형 범용 부품', en: 'Metal Parts', jp: '小型汎用部品' },
      desc: {
        kr: '무기 경험치를 높이는 데 사용된다. 사용 시 즉시 100포인트가 증가한다.',
        en: 'Grants 100 EXP to a weapon.',
        jp: '武器の経験値が100ポイント増加する。'
      }
    },
    wp_exp2: {
      name: { kr: '중형 범용 부품', en: 'Silver Parts', jp: '中型汎用部品' },
      desc: {
        kr: '무기 경험치를 높이는 데 사용된다. 사용 시 즉시 500포인트가 증가한다.',
        en: 'Grants 500 EXP to a weapon.',
        jp: '武器の経験値が500ポイント増加する。'
      }
    },
    wp_exp3: {
      name: { kr: '대형 범용 부품', en: 'Weapon EXP 3', jp: '大型汎用部品' },
      desc: {
        kr: '무기 경험치를 높이는 데 사용된다. 사용 시 즉시 2,000포인트가 증가한다.',
        en: 'Grants 2000 EXP to a weapon.',
        jp: '武器の経験値が2000ポイント増加する。'
      }
    },
    wp_limit1: {
      name: { kr: '거친 광석', en: 'Blue Crystal', jp: 'ブルークリスタル' },
      desc: {
        kr: '무기 레벨을 LV2·LV3으로 올리는 데 사용된다.',
        en: 'Can overclock a level 10 - 20 weapon.',
        jp: 'レベル10～20の武器をブーストできる。'
      }
    },
    wp_limit2: {
      name: { kr: '고급 광석', en: 'Purple Crystal', jp: 'パープルクリスタル' },
      desc: {
        kr: '무기 레벨을 LV4·LV5·LV6으로 올리는 데 사용된다.',
        en: 'Can overclock a level 30 - 50 weapon.',
        jp: 'レベル30～50の武器をブーストできる。'
      }
    },
    wp_limit3: {
      name: { kr: '최고급 광석', en: 'Yellow Crystal', jp: 'イエロークリスタル' },
      desc: {
        kr: '무기 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Can overclock a level 60 - 70 weapon.',
        jp: 'レベル60～70の武器をブーストできる。'
      }
    },
    skill_lv_1: {
      name: { kr: '향탑 S', en: 'Skill Incense S', jp: 'スキル線香S' },
      desc: {
        kr: '스킬 레벨을 LV2·LV3으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 3).',
        jp: '仲間のスキルレベルを最大3まで上げる。'
      }
    },
    skill_lv_2: {
      name: { kr: '향탑 M', en: 'Skill Incense M', jp: 'スキル線香M' },
      desc: {
        kr: '스킬 레벨을 LV4·LV5·LV6으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 6).',
        jp: '仲間のスキルレベルを最大6まで上げる。'
      }
    },
    skill_lv_3: {
      name: { kr: '향탑 L', en: 'Skill Incense L', jp: 'スキル線香L' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '仲間のスキルレベルを最大10まで上げる。'
      }
    },
    skill_rose: {
      name: { kr: '욕망의 나무', en: 'Everlasting Incense', jp: '永遠の線香' },
      desc: {
        kr: '스킬 레벨을 LV9·LV10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '仲間のスキルレベルを最大10まで上げる（特定タレント向け）。'
      }
    },
    skill_item1: {
      name: { kr: '매혹적인 향기', en: 'Avatamsa Incense', jp: 'アヴァタムサ線香' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '仲間のスキルレベルを最大10まで上げる。'
      }
    },
    skill_item2: {
      name: { kr: '금사 향기', en: 'Hermit’s Incense', jp: '隠者の線香' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '仲間のスキルレベルを最大10まで上げる。'
      }
    },
    skill_item3: {
      name: { kr: '노안 향기', en: 'Incense', jp: '線香（老眼）' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '仲間のスキルレベルを最大10まで上げる。'
      }
    },
    skill_item4: {
      name: { kr: '꿈을 먹는 향', en: 'Incense', jp: '線香（夢喰い）' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '仲間のスキルレベルを最大10まで上げる。'
      }
    },
    skill_item5: {
      name: { kr: '속박의 향기', en: 'Incense', jp: '線香（束縛）' },
      desc: {
        kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
        en: 'Raises an ally’s skill level (up to 10).',
        jp: '仲間のスキルレベルを最大10まで上げる。'
      }
    },
    md_mercury: {
      name: { kr: '영롱한 머큐리', en: 'Mercury', jp: '輝く水銀の粒' },
      desc: {
        kr: '『괴도 심상·속성 증가』 육성에 사용되는 재료다.',
        en: '',
        jp: '「怪盗マインドスケープ・属性強化」の育成に使用する素材。'
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
      name: { kr: '명성 수정구·하급', en: 'Fame Crystal (L)', jp: '星名クリスタル・下級' },
      desc: {
        kr: '『괴도 심상·진급 강화』 육성에 사용되는 재료다.',
        en: '',
        jp: '「怪盗マインドスケープ・昇級強化」の育成に使用する素材。'
      }
    },
    md_stat2: {
      name: { kr: '명성 수정구·고급', en: 'Fame Crystal (H)', jp: '星名クリスタル・上級' },
      desc: {
        kr: '『괴도 심상·진급 강화』 육성에 사용되는 재료다.',
        en: '',
        jp: '「怪盗マインドスケープ・昇級強化」の育成に使用する素材。'
      }
    },
    md_skill1: {
      name: { kr: '별가루 병·하급', en: 'Star Dust Vial (L)', jp: '星屑瓶・下級' },
      desc: {
        kr: '『괴도 심상·스킬 깨달음』 육성에 사용되는 재료다.',
        en: '',
        jp: '「怪盗マインドスケープ・スキル覚醒」の育成に使用する素材。'
      }
    },
    md_skill2: {
      name: { kr: '별가루 병·고급', en: 'Star Dust Vial (H)', jp: '星屑瓶・上級' },
      desc: {
        kr: '『괴도 심상·스킬 깨달음』 육성에 사용되는 재료다.',
        en: '',
        jp: '「怪盗マインドスケープ・スキル覚醒」の育成に使用する素材。'
      }
    }
  };
  