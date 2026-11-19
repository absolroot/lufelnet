// KR names for unique skills and statuses are provisional translations of the CN source.
window.personaFiles = window.personaFiles || {};
window.personaFiles["바알"] = {
  "id": "270",
  "key": "바알",
  "name": "바알",
  "name_en": "Baal",
  "name_jp": "バアル",
  "name_cn": "巴力",
  "grade": "9",
  "rank": 9,
  "star": "5",
  "position": "반항",
  "element": "질풍",
  "nature": "Wind",
  "max_level": 80,
  "max_level_after_awake": 120,
  "adapt": {"Absorb": [], "Nullify": [], "Reflect": [], "Resistant": ["Fire", "Wind", "Bless", "Curse"], "Weak": []},
  "event": false,
  "wild_emblem_rainbow": true,
  "best_persona": true,
  "tier": "S",
  "tier_desc": "반항 또는 자율 동료에게 「풍요의 선물」을 부여해 추가 스킬 대미지와 속성 대미지를 지원한다.",
  "tier_desc_en": "Grants [Gift of Abundance] (provisional name) to an Assassin or Virtuoso ally, supporting them with additional skill damage and attribute damage.",
  "tier_desc_jp": "反抗または自律ロールの味方に『豊穣の贈り物』（仮訳）を付与し、スキルダメージと属性ダメージを支援する。",
  "tier_desc_cn": "为反抗或自律同伴提供「丰穰之赐」，支援技能伤害和属性伤害。",
  "comment": "「풍요의 선물」은 공격력이 가장 높은 반항 또는 자율 동료에게 부여된다. 추가 대미지는 원더의 공격력에 따라 증가한다.",
  "comment_en": "[Gift of Abundance] (provisional name) is granted to the Assassin or Virtuoso ally with the highest Attack. Its additional damage scales with WONDER's Attack.",
  "comment_jp": "『豊穣の贈り物』（仮訳）は攻撃力が最も高い反抗または自律の味方に付与される。追加ダメージはWONDERの攻撃力に応じて増加する。",
  "comment_cn": "「丰穰之赐」会赋予攻击力最高的反抗或自律同伴，追加伤害随WONDER的攻击力提升。",
  "added": "KR/CN v5.5.1",
  "cost": {"blue": 0, "purple": 0, "rainbow": 4000},
  "combination": null,
  "recommendSkill": [],
  "passive_priority": 3,
  "passive_skill": [
    {
      "name": "대지에 돌아온 풍요의 주인",
      "name_en": "Lord of Abundance Returns (provisional)",
      "name_jp": "大地に帰還せし豊穣の主（仮訳）",
      "name_cn": "重临大地的丰主",
      "desc": "공격력이 29.1% 증가한다.\n전투 시작 시와 페르소나 스킬 사용 시 공격력이 가장 높은 반항 또는 자율 동료에게 「풍요의 선물」 1중첩을 부여한다. 동료가 「풍요의 선물」 2중첩을 소모하면 해당 동료의 적합성에 맞는 속성 대미지가 2턴 동안 25% 증가한다.\n「풍요의 선물」: 최대 4중첩. 대미지를 줄 때 1중첩을 소모하여 적 1명에게 주는 스킬 대미지를 증가시킨다. 원더의 공격력 중 2000을 초과하는 수치 100포인트마다 대미지가 200 증가하며 최대 16000까지 증가한다. 한 번의 공격이 여러 적에게 적중하면 적마다 1중첩을 소모한다.",
      "desc_en": "Increase Attack by 29.1%. At the start of battle and when using a Persona skill, grant 1 stack of [Gift of Abundance] (provisional name) to the Assassin or Virtuoso ally with the highest Attack. After that ally consumes 2 stacks, increase damage of their affinity attribute by 25% for 2 turns.\n[Gift of Abundance]: Up to 4 stacks. When dealing damage, consume 1 stack to increase skill damage against 1 foe by 200 for every 100 of WONDER's Attack above 2000, up to 16000. An attack hitting multiple foes consumes 1 stack per foe.",
      "desc_jp": "攻撃力が29.1%上昇する。戦闘開始時とペルソナスキル使用時、攻撃力が最も高い反抗または自律の味方に『豊穣の贈り物』（仮訳）を1つ付与する。味方が2つ消費すると、その味方の適性に対応する属性ダメージが2ターンの間25%上昇する。\n『豊穣の贈り物』は最大4つ。ダメージを与える時に1つ消費し、敵1体へのスキルダメージを上昇させる。WONDERの攻撃力が2000を超えた分の100ごとに200上昇し、最大16000。複数の敵に命中する場合、敵1体につき1つ消費する。",
      "desc_cn": "攻击力提升29.1%。\n战斗开始时及释放人格面具技能时，为攻击力最高的反抗/自律同伴添加1层「丰穰之赐」。同伴消耗2层「丰穰之赐」后，根据其适应性属性提升其相应属性伤害25%，持续2回合。\n「丰穰之赐」：可叠加4层。造成伤害时获得技能伤害加成，消耗1层「丰穰之赐」提升对1名敌人造成的伤害，提升值基于WONDER的攻击力超过2000点的部分，每100点提升200点伤害，最多提升16000点。同一次攻击命中多名敌人时，每对1名敌人造成伤害就消耗1层。"
    },
    {
      "name": "대지에 돌아온 풍요의 주인Ⅰ",
      "name_en": "Lord of Abundance Returns I (provisional)",
      "name_jp": "大地に帰還せし豊穣の主Ⅰ（仮訳）",
      "name_cn": "重临大地的丰主Ⅰ",
      "desc": "공격력이 29.1% 증가한다.\n전투 시작 시와 페르소나 스킬 사용 시 공격력이 가장 높은 반항 또는 자율 동료에게 「풍요의 선물」 1중첩을 부여한다. 동료가 「풍요의 선물」 2중첩을 소모하면 해당 동료의 적합성에 맞는 속성 대미지가 2턴 동안 37.5% 증가한다.\n「풍요의 선물」: 최대 4중첩. 대미지를 줄 때 1중첩을 소모하여 적 1명에게 주는 스킬 대미지를 증가시킨다. 원더의 공격력 중 2000을 초과하는 수치 100포인트마다 대미지가 300 증가하며 최대 24000까지 증가한다. 한 번의 공격이 여러 적에게 적중하면 적마다 1중첩을 소모한다.",
      "desc_en": "Increase Attack by 29.1%. At the start of battle and when using a Persona skill, grant 1 stack of [Gift of Abundance] (provisional name) to the Assassin or Virtuoso ally with the highest Attack. After that ally consumes 2 stacks, increase damage of their affinity attribute by 37.5% for 2 turns.\n[Gift of Abundance]: Up to 4 stacks. When dealing damage, consume 1 stack to increase skill damage against 1 foe by 300 for every 100 of WONDER's Attack above 2000, up to 24000. An attack hitting multiple foes consumes 1 stack per foe.",
      "desc_jp": "攻撃力が29.1%上昇する。戦闘開始時とペルソナスキル使用時、攻撃力が最も高い反抗または自律の味方に『豊穣の贈り物』（仮訳）を1つ付与する。味方が2つ消費すると、その味方の適性に対応する属性ダメージが2ターンの間37.5%上昇する。\n『豊穣の贈り物』は最大4つ。ダメージを与える時に1つ消費し、敵1体へのスキルダメージを上昇させる。WONDERの攻撃力が2000を超えた分の100ごとに300上昇し、最大24000。複数の敵に命中する場合、敵1体につき1つ消費する。",
      "desc_cn": "攻击力提升29.1%。\n战斗开始时及释放人格面具技能时，为攻击力最高的反抗/自律同伴添加1层「丰穰之赐」。同伴消耗2层「丰穰之赐」后，根据其适应性属性提升其相应属性伤害37.5%，持续2回合。\n「丰穰之赐」：可叠加4层。造成伤害时获得技能伤害加成，消耗1层「丰穰之赐」提升对1名敌人造成的伤害，提升值基于WONDER的攻击力超过2000点的部分，每100点提升300点伤害，最多提升24000点。同一次攻击命中多名敌人时，每对1名敌人造成伤害就消耗1层。"
    }
  ],
  "uniqueSkill": {
    "name": "신림의 은위", "name_en": "Divine Grace and Might (provisional)", "name_jp": "神臨の恩威（仮訳）", "name_cn": "神临的恩威",
    "desc": "적 1명에게 공격력 100.0%/105.0%/110.0%의 물리 속성 대미지를 3회 준다.\n동료가 누적 소모한 「풍요의 선물」 1중첩마다 이번 스킬 대미지가 50.0%/52.5%/55.0% 증가하며, 최대 300.0%/315.0%/330.0%까지 증가한다.\n목표에게 「고갈의 징조」를 부여한다. 다음에 「풍요의 선물」을 보유한 괴도가 목표를 공격하면 바알이 추가 공격을 가하며, 대미지는 해당 괴도가 준 공격 대미지의 8%다.",
    "desc_en": "Deal Physical damage to 1 foe 3 times, each equal to 100.0%/105.0%/110.0% of Attack. Increase this skill's damage by 50.0%/52.5%/55.0% for each stack of [Gift of Abundance] (provisional name) consumed by allies, up to 300.0%/315.0%/330.0%. Apply [Withering Omen] (provisional name) to the target: after its next hit from a Phantom Thief with [Gift of Abundance], Baal follows up for 8% of that attack's damage.",
    "desc_jp": "敵1体に攻撃力100.0%/105.0%/110.0%の物理属性ダメージを3回与える。味方が累計消費した『豊穣の贈り物』（仮訳）1つにつき、このスキルのダメージが50.0%/52.5%/55.0%上昇する。最大300.0%/315.0%/330.0%。対象に『枯渇の兆し』（仮訳）を付与し、次に『豊穣の贈り物』を持つ怪盗が攻撃すると、バアルがその攻撃ダメージの8%で追撃する。",
    "desc_cn": "对1名敌人造成3次100.0%/105.0%/110.0%攻击力的物理属性伤害。\n根据同伴累计消耗「丰穰之赐」的层数，提高本次技能的伤害，每层提高50.0%/52.5%/55.0%，上限300.0%/315.0%/330.0%。\n使目标陷入「枯兆」状态：下次受到带有「丰穰之赐」的怪盗攻击后，巴力进行追加攻击，伤害值为本次怪盗的攻击伤害的8%。",
    "cost": "HP 11%", "level": "6/7/8", "priority": "", "icon": "물리", "icon_gl": ""
  },
  "highlight": {
    "name": "HIGHLIGHT", "name_en": "HIGHLIGHT", "name_jp": "HIGHLIGHT", "name_cn": "HIGHLIGHT",
    "desc": "적 1명에게 공격력 180.0%/189.0%/198.0%의 질풍 속성 대미지를 주고, 3턴 동안 목표가 받는 크리티컬 효과를 18.0%/18.9%/19.8% 증가시킨다. 공격력이 가장 높은 반항 또는 자율 동료에게 「풍요의 선물」 2중첩을 부여한다.",
    "desc_en": "Deal Wind damage to 1 foe equal to 180.0%/189.0%/198.0% of Attack and increase its critical damage taken by 18.0%/18.9%/19.8% for 3 turns. Grant 2 stacks of [Gift of Abundance] (provisional name) to the Assassin or Virtuoso ally with the highest Attack.",
    "desc_jp": "敵1体に攻撃力180.0%/189.0%/198.0%の疾風属性ダメージを与え、3ターンの間、対象が受けるクリティカルダメージを18.0%/18.9%/19.8%上昇させる。攻撃力が最も高い反抗または自律の味方に『豊穣の贈り物』（仮訳）を2つ付与する。",
    "desc_cn": "对1名敌人造成180.0%/189.0%/198.0%攻击力的疾风属性伤害，使其受到暴击效果提升18.0%/18.9%/19.8%，持续3回合，并为攻击力最高的反抗/自律同伴添加2层「丰穰之赐」",
    "cost": "", "level": "6/7/8", "priority": ""
  },
  "innate_skill": [
  {
    "name": "마하타루카쟈",
    "name_en": "Matarukaja",
    "name_jp": "マハタルカジャ",
    "desc": "모든 동료의 공격력이 10.9%/11.4%/12.0% 증가하고, 자신의 공격력 500포인트마다 0.9%/0.9%/1.0% 추가 증가한다. 상한은 7.2%/7.6%/7.9%이며, 효과는 3턴 동안 지속된다.",
    "desc_en": "Increase party's Attack by 10.9%/11.4%/12.0%. For every 500 of the user's Attack, increase party's Attack by 0.9%/0.9%/1.0% more, up to 7.2%/7.6%/7.9%. Lasts for 3 turns.",
    "desc_jp": "３ターンの間、味方全体の攻撃力が10.9%/11.4%/12.0%上昇する。自身の攻撃力が５００ごとに、味方の攻撃力がさらに0.9%/0.9%/1.0%上昇する（最大7.2%/7.6%/7.9%まで）。",
    "name_cn": "玛哈塔尔卡加",
    "desc_cn": "使所有同伴的攻击力提升10.9%/11.4%/12.0%，自身每500攻击力额外提升0.9%/0.9%/1.0%，上限7.2%/7.6%/7.9%。效果持续3回合。",
    "cost": "SP 22",
    "level": "6/7/8",
    "learn_level": "10"
  },
  {
    "name": "공격 강화Ⅴ",
    "desc": "공격력이 16.2% 증가한다.",
    "cost": "",
    "level": "6/7/8",
    "learn_level": "20",
    "name_cn": "攻击强化Ⅴ",
    "desc_cn": "攻击力提升16.2%。",
    "name_en": "Attack Boost V",
    "desc_en": "Increase Attack by 16.2%.",
    "name_jp": "アタックブースタⅤ",
    "desc_jp": "攻撃力が１６.２%上昇する。"
  },
  {
    "name": "갈다인",
    "name_en": "Garudyne",
    "name_jp": "ガルダイン",
    "desc": "1명의 적에게 공격력 121.7/127.8/133.9%의 질풍 속성 대미지를 주고, 67.6/71.0/74.4%의 기본 확률로 적을 2턴 동안 풍습 상태에 빠뜨린다.",
    "desc_en": "Deal Wind damage to 1 foe equal to 121.7/127.8/133.9% of Attack. 67.6/71.0/74.4% chance to inflict Windswept for 2 turns.",
    "desc_jp": "敵単体に攻撃力121.7/127.8/133.9%の疾風属性ダメージを与える。67.6/71.0/74.4%の確率で敵を２ターンの間、風襲状態にする。",
    "cost": "SP 21",
    "level": "6/7/8",
    "learn_level": "30",
    "name_cn": "加尔达因",
    "desc_cn": "对1名敌人造成121.7/127.8/133.9%攻击力的疾风属性伤害，有67.6/71.0/74.4%基础概率使敌人陷入风袭状态，效果持续2回合。"
  },
  {
    "name": "질풍 강화Ⅳ",
    "name_en": "Wind Boost IV",
    "name_jp": "疾風ブースタⅣ",
    "desc": "질풍 속성 대미지가 10.8% 증가한다.",
    "desc_en": "Increase Wind damage by 10.8%.",
    "desc_jp": "疾風属性の与ダメージが１０.８%上昇する。",
    "cost": "",
    "level": "6/7/8",
    "learn_level": "40",
    "name_cn": "疾风强化Ⅳ",
    "desc_cn": "疾风属性伤害提升10.8%。"
  }
]
};
