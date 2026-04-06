const MATERIAL_INFO = {
  konpaku_gem: {
    name: { kr: '영혼석', en: 'Konpaku Gem', jp: '魂魄石', cn: '魂石' },
    desc: {
      kr: '레벨업과 돌파에 사용되는 통화형 재화입니다.',
      en: 'Currency used for leveling and ascension.',
      jp: 'レベルアップと突破に使用する通貨型素材です。',
      cn: '异世界探索获得的神秘石头，可用于角色与人格面具养成。'
    }
  },
  lv_exp1: {
    name: { kr: '전기 조각', en: 'Thief Compendium Scrap', jp: '怪盗全書・切れ端', cn: '怪盗全书残页' },
    desc: {
      kr: '괴도 경험치를 높이는 데 사용된다. 사용 시 즉시 200포인트가 증가한다.',
      en: 'Grants 200 EXP to an ally.',
      jp: '主人公以外の味方に経験値200を付与する。',
      cn: '为同伴提供 200 经验值。'
    }
  },
  lv_exp2: {
    name: { kr: '전기 단장', en: 'Thief Compendium Volume', jp: '怪盗全書・分冊', cn: '怪盗全书分册' },
    desc: {
      kr: '괴도 경험치를 높이는 데 사용된다. 사용 시 즉시 1,000포인트가 증가한다.',
      en: 'Grants 1000 EXP to an ally.',
      jp: '主人公以外の味方に経験値1000を付与する。',
      cn: '为同伴提供 1000 经验值。'
    }
  },
  lv_exp3: {
    name: { kr: '전기 전서', en: 'Thief Compendium Tome', jp: '怪盗全書・完成本', cn: '怪盗全书完成本' },
    desc: {
      kr: '괴도 경험치를 높이는 데 사용된다. 사용 시 즉시 4,000포인트가 증가한다.',
      en: 'Grants 4000 EXP to an ally.',
      jp: '主人公以外の味方に経験値4000を付与する。',
      cn: '为同伴提供 4000 经验值。'
    }
  },
  lv_limit1: {
    name: { kr: '붓꽃의 향기', en: 'Whiff of Iris', jp: 'アイリスの微香水', cn: '鸢尾花之香' },
    desc: {
      kr: '잠재력 레벨을 1·2로 올리는 데 사용된다. (최대 레벨 30)',
      en: 'Raises an ally’s Talent level (up to 2).',
      jp: '主人公以外の味方の潜在能力レベルを上げる(最大2まで)',
      cn: '鸢尾香调的香水，可用于提升潜能等级至潜能1·潜能2。'
    }
  },
  lv_limit2: {
    name: { kr: '붓꽃의 진한 향기', en: 'Fragrance of Iris', jp: '濃厚なアヤメの香り', cn: '鸢尾花浓香' },
    desc: {
      kr: '잠재력 레벨을 3·4·5로 올리는 데 사용된다. (최대 레벨 60)',
      en: 'Raises an ally’s Talent level (up to 5).',
      jp: '仲間の潜在レベルを3、4、または5まで上げる。',
      cn: '鸢尾香调的高级香水，可用于提升潜能等级至潜能3·潜能4·潜能5。'
    }
  },
  lv_limit3: {
    name: { kr: '붓꽃의 깊은 향기', en: 'Essence of Iris', jp: 'アイリスの芳香水', cn: '鸢尾花醇香' },
    desc: {
      kr: '잠재력 레벨을 6·7로 올리는 데 사용된다. (최대 레벨 80)',
      en: 'Raises an ally’s Talent level (up to 7).',
      jp: '主人公以外の味方の潜在能力レベルを上げる（最大5まで）',
      cn: '鸢尾香调的顶级香水，可用于提升潜能等级至潜能6·潜能7。'
    }
  },
  wp_exp1: {
    name: { kr: '소형 범용 부품', en: 'Metal Parts', jp: 'メタルパーツ', cn: '万用零件·小' },
    desc: {
      kr: '무기 경험치를 높이는 데 사용된다. 사용 시 즉시 100포인트가 증가한다.',
      en: 'Grants 100 EXP to a weapon.',
      jp: '武器に経験値を100付与する。',
      cn: '普通的金属零件，可用于提升武器经验，使用后立即提升100点。'
    }
  },
  wp_exp2: {
    name: { kr: '중형 범용 부품', en: 'Silver Parts', jp: 'シルバーパーツ', cn: '万用零件·中' },
    desc: {
      kr: '무기 경험치를 높이는 데 사용된다. 사용 시 즉시 500포인트가 증가한다.',
      en: 'Grants 500 EXP to a weapon.',
      jp: '武器に経験値を500付与する。',
      cn: '优质的金属零件，可用于提升武器经验，使用后立即提升500点。'
    }
  },
  wp_exp3: {
    name: { kr: '대형 범용 부품', en: 'Gold Parts', jp: 'ゴールドパーツ', cn: '万用零件·大' },
    desc: {
      kr: '무기 경험치를 높이는 데 사용된다. 사용 시 즉시 2,000포인트가 증가한다.',
      en: 'Grants 2000 EXP to a weapon.',
      jp: '武器に経験値を2000付与する。',
      cn: '精良的金属零件，可用于提升武器经验，使用后立即提升2000点。'
    }
  },
  wp_limit1: {
    name: { kr: '거친 광석', en: 'Blue Crystal', jp: '青水晶', cn: '粗制矿石' },
    desc: {
      kr: '무기 레벨을 LV2·LV3으로 올리는 데 사용된다. (최대 레벨 30)',
      en: 'Can overclock a level 10 - 20 weapon.',
      jp: 'レベル10〜20の武器の上限を突破できる。',
      cn: '制成装备整体结构的粗制矿石，可用于在武器等级为10·20时突破。'
    }
  },
  wp_limit2: {
    name: { kr: '고급 광석', en: 'Purple Crystal', jp: '紫水晶', cn: '优质矿石' },
    desc: {
      kr: '무기 레벨을 LV4·LV5·LV6으로 올리는 데 사용된다. (최대 레벨 60)',
      en: 'Can overclock a level 30 - 50 weapon.',
      jp: 'レベル30~50の武器の上限を突破できる。',
      cn: '制成装备整体结构的优质矿石，可用于在武器等级为30·40·50时突破。'
    }
  },
  wp_limit3: {
    name: { kr: '최고급 광석', en: 'Yellow Crystal', jp: '黄水晶', cn: '顶尖矿石' },
    desc: {
      kr: '무기 레벨을 LV7·LV8으로 올리는 데 사용된다. (최대 레벨 80)',
      en: 'Can overclock a level 60 - 70 weapon.',
      jp: 'レベル60~70の武器の上限を突破できる。',
      cn: '制成装备整体结构的顶尖矿石，可用于在武器等级为60·70时突破。'
    }
  },
  skill_lv_1: {
    name: { kr: '향탑 S', en: 'Skill Incense S', jp: '技能の香・小', cn: '香塔S' },
    desc: {
      kr: '스킬 레벨을 LV2·LV3으로 올리는 데 사용된다.',
      en: 'Raises an ally’s skill level (up to 3).',
      jp: '主人公以外の味方のスキルレベルを上げる（最大3まで）',
      cn: '沉香木气味的S型香塔，可用于提升技能等级至Lv.2·Lv.3。'
    }
  },
  skill_lv_2: {
    name: { kr: '향탑 M', en: 'Skill Incense M', jp: '技能の香・中', cn: '香塔M' },
    desc: {
      kr: '스킬 레벨을 LV4·LV5·LV6으로 올리는 데 사용된다.',
      en: 'Raises an ally’s skill level (up to 6).',
      jp: '主人公以外の味方のスキルレベルを上げる（最大6まで）',
      cn: '沉香木气味的M型香塔，可用于提升技能等级至Lv.4·Lv.5·Lv.6。'
    }
  },
  skill_lv_3: {
    name: { kr: '향탑 L', en: 'Skill Incense L', jp: '技能の香・大', cn: '香塔L' },
    desc: {
      kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
      en: 'Raises an ally’s skill level (up to 10).',
      jp: '主人公以外の味方のスキルレベルを上げる（最大10まで）',
      cn: '沉香木气味的L型香塔，可用于提升技能等级至Lv.7-Lv.10。'
    }
  },
  skill_rose: {
    name: { kr: '욕망의 나무', en: 'Everlasting Incense', jp: '常久の香木', cn: '欲望之木' },
    desc: {
      kr: '스킬 레벨을 LV9·LV10으로 올리는 데 사용된다.',
      en: 'Raises an ally’s skill level (up to 10).',
      jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)',
      cn: '极其罕见的神奇木料，可用于提升技能等级至Lv.9·Lv.10。'
    }
  },
  skill_item1: {
    name: { kr: '매혹적인 향기', en: 'Avatamsa Incense', jp: '華厳の霊香', cn: '迷情香' },
    desc: {
      kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
      en: 'Raises an ally’s skill level (up to 10).',
      jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)',
      cn: '散发出魅惑气味的香丸，可用于提升技能等级至Lv.7-Lv.10。'
    }
  },
  skill_item2: {
    name: { kr: '금사 향기', en: 'Hermit’s Incense', jp: '仙気の霊香', cn: '金丝香' },
    desc: {
      kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
      en: 'Raises an ally’s skill level (up to 10).',
      jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)',
      cn: '散发出神秘气味的香丸，可用于提升技能等级至Lv.7-Lv.10。'
    }
  },
  skill_item3: {
    name: { kr: '노안 향기', en: 'Joyful Incense', jp: '愉悦の霊香', cn: '怒颜香' },
    desc: {
      kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
      en: 'Raises an ally’s skill level (up to 10).',
      jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)',
      cn: '散发出炽烈气味的香丸，可用于提升技能等级至Lv.7-Lv.10。'
    }
  },
  skill_item4: {
    name: { kr: '꿈을 먹는 향', en: 'Ephemeral Incense', jp: '霊香（夢喰い）', cn: '啖梦香' },
    desc: {
      kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
      en: 'Raises an ally’s skill level (up to 10).',
      jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)',
      cn: '散发出迷离气味的香丸，可用于提升技能等级至Lv.7-Lv.10。'
    }
  },
  skill_item5: {
    name: { kr: '속박의 향기', en: 'Incense', jp: '霊香（束縛）', cn: '缚生香' },
    desc: {
      kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
      en: 'Raises an ally’s skill level (up to 10).',
      jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)',
      cn: '散发出悲怯气味的香丸，可用于提升技能等级至Lv.7-Lv.10。'
    }
  },
  skill_item6: {
    name: { kr: '망수향', en: 'Incense', jp: '霊香（束縛）', cn: '妄殊香' },
    desc: {
      kr: '스킬 레벨을 LV7-10으로 올리는 데 사용된다.',
      en: 'Raises an ally’s skill level (up to 10).',
      jp: '主人公以外の味方のスキルレベルを上げる(最大10まで)',
      cn: '散发出清绝气味的香丸，可用于提升技能等级至Lv.7-Lv.10。'
    }
  },
  md_mercury: {
    name: { kr: '영롱한 머큐리', en: 'Stardust Shard', jp: '星屑の欠片', cn: '玲珑辰星' },
    desc: {
      kr: '『괴도 심상·속성 증가』 육성에 사용되는 재료다.',
      en: '',
      jp: '消費することで基本ステータスを上げるイメジャリーを解放できる。',
      cn: '可用于「怪盗心象·属性提升」养成的材料。'
    }
  },
  md_bell: {
    name: { kr: '별자리 방울', en: 'Stardust Bell', jp: '星屑の鈴', cn: '星辰之铃' },
    desc: {
      kr: '『괴도 심상·속성 강화』 육성에 사용되는 재료다.',
      en: '',
      jp: '「怪盗マインドスケープ・属性強化」の育成に使用する素材。',
      cn: '可用于「怪盗心象·属性强化」养成的材料。'
    }
  },
  md_stat1: {
    name: { kr: '명성 수정구·하급', en: 'Stardust Bottle', jp: '星屑のボトル', cn: '明星水晶球·低阶' },
    desc: {
      kr: '『괴도 심상·진급 강화』 육성에 사용되는 재료다.',
      en: '',
      jp: '「怪盗マインドスケープ・昇級強化」の育成に使用する素材。',
      cn: '可用于「怪盗心象·技能领悟」养成的低阶材料。'
    }
  },
  md_stat2: {
    name: { kr: '명성 수정구·고급', en: 'Venus Bottle', jp: '明星のボトル', cn: '明星水晶球·高阶' },
    desc: {
      kr: '『괴도 심상·진급 강화』 육성에 사용되는 재료다.',
      en: '',
      jp: '「怪盗マインドスケープ・昇級強化」の育成に使用する素材。',
      cn: '可用于「怪盗心象·技能领悟」养成的高阶材料。'
    }
  },
  md_skill1: {
    name: { kr: '별가루 병·하급', en: 'Stardust Gem', jp: '星屑晶珠', cn: '星屑之瓶·低阶' },
    desc: {
      kr: '『괴도 심상·스킬 깨달음』 육성에 사용되는 재료다.',
      en: '',
      jp: '「怪盗マインドスケープ・スキル覚醒」の育成に使用する素材。',
      cn: '可用于「怪盗心象·进阶强化」养成的低阶材料。'
    }
  },
  md_skill2: {
    name: { kr: '별가루 병·고급', en: 'Venus Gem', jp: '明星晶珠', cn: '星屑之瓶·高阶' },
    desc: {
      kr: '『괴도 심상·스킬 깨달음』 육성에 사용되는 재료다.',
      en: '',
      jp: '「怪盗マインドスケープ・スキル覚醒」の育成に使用する素材。',
      cn: '可用于「怪盗心象·进阶强化」养成的高阶材料。'
    }
  }
};
