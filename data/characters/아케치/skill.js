window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["아케치"] = {
  "name": "아케치 고로",
  "skill1": {
    "name": "정의의 약속",
    "element": "축복광역",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "모든 적에게 공격력 93.2%/102.8%/98.9%/108.5%의 축복 속성 대미지를 주고, 모든 동료의 생명을 1561/1561/1657/1657포인트 회복하며, 모든 동료가 축복을 1중첩 획득한다. 자신이 『진실』을 획득하고 2턴 동안 『정확』 상태를 획득한다. 『정확』 상태에서는 모든 동료가 주는 대미지가 19.5%/21.5%/20.7%/22.7% 증가한다."
  },
  "skill2": {
    "name": "기울어진 사냥터",
    "element": "주원광역",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "모든 적에게 공격력 116.5%/128.5%/123.7%/135.6%의 주원 속성 대미지를 준다. 자신이 『진실』을 획득하며, 2턴 동안 『혼돈』 상태를 획득한다. 『혼돈』 상태에서는 모든 적의 방어가 25.4%/28.0%/26.9%/29.5% 감소하고, 자신의 『혼돈의 화살』 발동 횟수가 1회 증가하며, 주는 대미지가 19.5%/21.5%/20.7%/22.7% 증가한다."
  },
  "skill3": {
    "name": "황금 화살비·파멸",
    "element": "만능광역",
    "type": "광역 피해",
    "sp": 24,
    "cool": 0,
    "description": "활성화 조건: 자신이 『진실』 보유\n모든 『명확 화살』을 소모하여 적 전체에 『명확 화살』 기록 대미지의 고정값 만능 속성 19.5%/21.5%/20.7%/22.7% 대미지를 준다. 이후 랜덤 적에게 『혼돈 화살』을 4회 발동하고, 매회 공격력 77.4%/85.3%/82.2%/90.1%의 만능 속성 대미지를 주며, 해당 효과의 공격을 받은 적 없는 적을 우선 공격한다. 동일 목표에게 여러 번 명중 시 15%의 대미지만 준다.\n『탐정 동료』를 자신으로 선택했을 때, 『명확 화살』이 『혼돈 화살』 스킬 배율 240%에 해당하는 만능 속성 대미지를 준다."
  },
  "skill_highlight": {
    "element": "만능",
    "type": "광역피해",
    "description": "모든 적에게 공격력 124.1%/136.9%/131.8%/144.5%의 축복 속성 대미지를 1회 주고, 공격력 124.1%/136.9%/131.8%/144.5%의 주원 속성 대미지를 1회 준다. 자신의 『혼돈의 화살』 발동 횟수가 2회 증가하며 4턴 동안 지속된다.",
    "cool": 4
  },
  "passive1": {
    "name": "법도",
    "element": "패시브",
    "description": "아케치 고로가 팀에 합류하면 원하는 속성의 욕망 소나타를 발동할 수 있다. 전투 시작 시 욕망 소나타 1종을 발동할 때마다 자신이 주는 대미지가 15.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "갈망",
    "element": "패시브",
    "description": "만능 대미지를 줄 때 목표가 방어 감소 효과 1%를 보유할 때마다 자신의 대미지가 0.5% 증가한다. (상한 120.0%)",
    "cool": 0
  }
};

window.enCharacterSkillsData["아케치"] = {
  "name": "Goro Akechi",
  "skill1": {
    "name": "Flash of Intuition",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Bless damage to all foes equal to 93.2%/102.8%/98.9%/108.5% of Attack. Also, restore all allies' HP by 1561/1561/1657/1657 and grant 1 Blessing stack.\nAlso, gain Suspicion, and gain Deduction for 2 turns. With Deduction, increase party's damage by 19.5%/21.5%/20.7%/22.7%."
  },
  "skill2": {
    "name": "Decisive Scheme",
    "element": "주원광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Curse damage to all foes equal to 116.5%/128.5%/123.7%/135.6% of Attack.\nAlso, gain Suspicion, and gain Stratagem for 2 turns. With Stratagem, decrease all foes' Defense by 25.4%/28.0%/26.9%/29.5%. Also increase Arrow of Perjury's number of hits by 1, and increase damage dealt by 19.5%/21.5%/20.7%/22.7%."
  },
  "skill3": {
    "name": "Rain of Justice",
    "element": "만능광역",
    "type": "광역피해",
    "sp": 24,
    "cool": 0,
    "description": "Usable with Suspicion.\nSpend all Arrow of Truth stacks, deal a fixed amount of Almighty damage to all foes equal to 19.5%/21.5%/20.7%/22.7% of the damage recorded by each Arrow of Truth stack, and lose Suspicion.\nThen, activate Arrow of Perjury on random foes, dealing Almighty damage equal to 77.4%/85.3%/82.2%/90.1% (4 hits). From the second hit, prioritize new targets, and decrease damage to 15% for hits on the same target.\nIf Akechi has Mastermind, Arrow of Truth gains 240% of the Almighty damage of Arrow of Perjury."
  },
  "skill_highlight": {
    "element": "만능",
    "type": "광역피해",
    "description": "Deal Bless damage to all foes equal to 124.1%/136.9%/131.8%/144.5% of Attack, and Curse damage equal to 124.1%/136.9%/131.8%/144.5% of Attack (1 hit each).\nAlso, for 4 turns, increase Arrow of Perjury's number of hits by 2.",
    "cool": 4
  },
  "passive1": {
    "name": "Rival's Pride",
    "element": "패시브",
    "description": "Can activate Flames of Desire effects with all allies in the party. At the start of battle, for each Flames of Desire effect activated, increase Akechi's damage by 15.0%.",
    "cool": 0
  },
  "passive2": {
    "name": "Rending Arrow",
    "element": "패시브",
    "description": "When dealing Almighty damage, for every 1% of the target's decreased Defense, increase Akechi's damage dealt by 0.5% (up to a maximum of 120.0%).",
    "cool": 0
  }
};

window.jpCharacterSkillsData["아케치"] = {
  "name": "明智 吾郎",
  "skill1": {
    "name": "推理の閃き",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "敵全体に攻撃力93.2%/102.8%/98.9%/108.5%の祝福属性ダメージを与える。また、味方全体のＨＰを1561/1561/1657/1657回復し、祝印を１つ付与する。\nさらに『糸口』を獲得し、２ターンの間、『推理』状態になる。『推理』状態では、味方全体の与ダメージが19.5%/21.5%/20.7%/22.7%上昇する。"
  },
  "skill2": {
    "name": "謀略の一手",
    "element": "주원광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "敵全体に攻撃力116.5%/128.5%/123.7%/135.6%の呪怨属性ダメージを与える。\nさらに『糸口』を獲得し、２ターンの間、『謀略』状態になる。『謀略』状態では、敵全体の防御力が25.4%/28.0%/26.9%/29.5%低下する。また『偽証の矢』の攻撃回数が１回増加し、与ダメージが19.5%/21.5%/20.7%/22.7%上昇する。"
  },
  "skill3": {
    "name": "正義の矢の雨",
    "element": "万능広域",
    "type": "광역피해",
    "sp": 24,
    "cool": 0,
    "description": "『糸口』を獲得している時に使用可能になる。\n『真実の矢』を全て消費し、敵全体に『真実の矢』に蓄積した効果量19.5%/21.5%/20.7%/22.7%の万能属性固定ダメージを与え、『糸口』は消失する。\nその後、ランダムな敵に『偽証の矢』を放ち、攻撃力77.4%/85.3%/82.2%/90.1%の万能属性ダメージを４回与える。２回目以降の攻撃は新たな対象が優先され、同一の対象に命中した時、与ダメージが１５%になる。\n自身が『狂言回し』状態の場合、『真実の矢』は『偽証の矢』の２４０%分の万能属性ダメージを与える。"
  },
  "skill_highlight": {
    "element": "万능",
    "type": "광역피해",
    "description": "敵全体に攻撃力124.1%/136.9%/131.8%/144.5%の祝福属性ダメージと、攻撃力124.1%/136.9%/131.8%/144.5%の呪怨属性ダメージをそれぞれ１回ずつ与える。\nさらに４ターンの間、『偽証の矢』の攻撃回数が２回増加する。",
    "cool": 4
  },
  "passive1": {
    "name": "ライバルの矜持",
    "element": "패시브",
    "description": "パーティに編成している全ての味方の属性で『欲望の共鳴』を発動できる。戦闘開始時、『欲望の共鳴』が１つ発動するごとに、自身の与ダメージが15.0%上昇する。",
    "cool": 0
  },
  "passive2": {
    "name": "綻び射貫く矢",
    "element": "패시브",
    "description": "万能属性ダメージを与える時、対象の防御力低下１%につき、自身の与ダメージが0.5%上昇する（最大120.0%まで）。",
    "cool": 0
  }
};

window.cnCharacterSkillsData["아케치"] = {
  "name": "明智吾郎",
  "skill1": {
    "name": "正义之约",
    "element": "축복광역",
    "type": "群体伤害",
    "sp": 20,
    "cool": 0,
    "description": "对所有敌人造成93.2%/102.8%/98.9%/108.5%攻击力的祝福属性伤害，为所有同伴恢复1561/1561/1657/1657点生命值，并使所有同伴获得1层祝福。自身获得『真相』，并获得『清晰』状态，持续2回合。『清晰』状态下，所有同伴造成伤害提升19.5%/21.5%/20.7%/22.7%。"
  },
  "skill2": {
    "name": "不公的狩猎场",
    "element": "주원광역",
    "type": "群体伤害",
    "sp": 20,
    "cool": 0,
    "description": "对所有敌人造成116.5%/128.5%/123.7%/135.6%攻击力的诅咒属性伤害，自身获得『真相』，并获得『混沌』状态，持续2回合。『混沌』状态下，所有敌人防御降低25.4%/28.0%/26.9%/29.5%、自身『混沌之箭』触发次数增加1次、造成伤害提升19.5%/21.5%/20.7%/22.7%。"
  },
  "skill3": {
    "name": "黄金箭雨·湮灭",
    "element": "만능광역",
    "type": "群体伤害",
    "sp": 24,
    "cool": 0,
    "description": "开启条件：自身拥有『真相』\n消耗所有『清晰之矢』，对所有敌人造成19.5%/21.5%/20.7%/22.7%『清晰之矢』记录伤害的固定值万能属性伤害。之后，对随机敌人发射4次『混沌之箭』，每次造成77.4%/85.3%/82.2%/90.1%攻击力的万能属性伤害，优先攻击未受到该效果攻击的敌人。多次伤害命中同一目标时只会造成15%的伤害。\n当选择『侦探伙伴』为自身时，『清晰之矢』造成相当于240%『混沌之箭』技能倍率的万能属性伤害。"
  },
  "skill_highlight": {
    "element": "만능",
    "type": "群体伤害",
    "description": "对所有敌人造成1次124.1%/136.9%/131.8%/144.5%攻击力的祝福属性伤害和1次124.1%/136.9%/131.8%/144.5%攻击力诅咒属性伤害，自身『混沌之箭』触发次数增加2次，持续4回合。",
    "cool": 4,
    "name": "HIGHLIGHT"
  },
  "passive1": {
    "name": "法度",
    "element": "패시브",
    "description": "明智吾郎编入队伍时，可以触发任意属性的欲望奏鸣。战斗开始时，每触发1种欲望奏鸣使自身造成伤害提升15.0%。",
    "cool": 0
  },
  "passive2": {
    "name": "渴望",
    "element": "패시브",
    "description": "造成万能伤害时，目标每有1%的百分比防御降低效果，自身伤害增加0.5%。（上限120.0%）",
    "cool": 0
  }
};

