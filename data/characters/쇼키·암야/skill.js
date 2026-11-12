window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["쇼키·암야"] = {
  "name": "이케나미 쇼키·암야",
  "skill1": {
    "name": "여명의 검",
    "element": "축복광역",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "적 전체에 공격력 104.2%/114.9%/110.6%/121.3%의 축복 속성 대미지를 주고, 2턴 동안 자신의 크리티컬 효과가 48.8%/53.8%/51.8%/56.8% 증가한다.\n『암야의 축복』을 2중첩 획득하고, 해당 스킬 시전 시 자신의 생명이 40%보다 낮으면 『암야의 축복』을 추가로 3중첩 획득한다."
  },
  "skill2": {
    "name": "굳건한 맹세",
    "element": "버프",
    "type": "보조",
    "hp": 40,
    "cool": 0,
    "description": "자신이 2턴 동안 공격력 9.8%/10.8%/10.4%/11.4%+1875/2472/2305/2933의 실드를 획득하고(단일 스킬 상한은 자신 최대 생명의 40%), 『어두운 밤의 계약』을 1중첩 획득한다.\n『어두운 밤의 계약』: 주는 대미지가 9.8%/10.8%/10.4%/11.4% 증가하고, 『너에게 새기는 이름』 시전 시 모든 『어두운 밤의 계약』을 소모하며, 스킬 대미지가 증가한다(8회 중첩 가능).\n해당 스킬 사용 후 다른 스킬을 사용할 수 있고, 해당 스킬은 페르소나 스킬로 간주하지 않는다."
  },
  "skill3": {
    "name": "너에게 새기는 이름",
    "element": "축복광역",
    "type": "광역 피해",
    "sp": 24,
    "cool": 1,
    "description": "적 전체에 공격력 256.7%/283.0%/272.5%/298.8%의 축복 속성 대미지를 준다. 자신에게 『암야의 축복』 5중첩이 있다면 추가로 공격력 45.3%/49.9%/48.1%/52.7%의 축복 속성 대미지를 1회 준다. 『어두운 밤의 계약』 1중첩마다 해당 스킬 대미지가 10% 증가한다.\n해당 스킬 시전 후 『어두운 밤의 계약』이 모두 제거되며, 자신의 최대 생명 20%×『암야의 축복』 중첩 수의 생명을 회복한다."
  },
  "skill_highlight": {
    "element": "축복광역",
    "type": "광역피해",
    "cool": 4,
    "description": "적 전체에 공격력 228.8%/252.2%/242.8%/266.3%의 축복 속성 대미지를 주고, 현재 생명이 낮을수록 HIGHLIGHT로 주는 대미지가 증가하며, 생명이 40%일 때 최대 대미지 보너스 60%를 획득한다."
  },
  "passive1": {
    "name": "은혜",
    "element": "패시브",
    "description": "『암야의 축복』 1중첩을 보유할 때마다 이케나미 쇼키·암야의 공격력이 6.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "열반",
    "element": "패시브",
    "description": "현재 생명이 낮을수록 이케나미 쇼키·암야의 관통이 높아지고, 생명이 40%가 되면 최대 관통 보너스 15.0%를 획득한다.",
    "cool": 0
  }
};

window.enCharacterSkillsData["쇼키·암야"] = {
  "name": "Tenebre Shoki",
  "skill1": {
    "name": "Blade of Dawn",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Bless damage to all foes equal to 125.1%/137.9%/132.8%/145.6% of Attack, and increase Tenebre Shoki's critical damage by 48.8%/53.8%/51.8%/56.8% for 2 turns.\nGain 2 Nocturnal Blessing stacks. If Tenebre Shoki's HP is below 40%, gain 3 more Nocturnal Blessing stacks."
  },
  "skill2": {
    "name": "Steadfast Vow",
    "element": "버프",
    "type": "보조",
    "sp": 0,
    "cool": 0,
    "description": "Gain a shield equal to 9.8%/10.8%/10.4%/11.4% of Attack + 1875/2472/2305/2933 for 2 turns (up to a maximum of 40% of max HP per skill use). Gain 1 Stellato stack.\nAfter using this skill, Tenebre Shoki can use another skill in the same turn.\nThis skill does not count as a normal skill, and spends HP instead of SP when used.\nStellato: Increase damage dealt by 9.8%/10.8%/10.4%/11.4%. When using Scolpire, spend all Stellato stacks to increase the skill damage. Stacks up to 8 times."
  },
  "skill3": {
    "name": "Scolpire",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 24,
    "cool": 1,
    "description": "Deal Bless damage to all foes equal to 256.7%/283.0%/272.5%/298.8% of Attack. With 5 or more Nocturnal Blessing stacks, deal 1 more hit of Bless damage equal to 45.3%/49.9%/48.1%/52.7% of Attack. For each Stellato stack, increase this skill's damage by 12%.\nAfter activating this skill, spend all Stellato stacks, and restore HP equal to 20% of Tenebre Shoki's max HP times the total number of Nocturnal Blessing stacks."
  },
  "skill_highlight": {
    "element": "축복광역",
    "type": "광역피해",
    "cool": 4,
    "description": "Deal Bless damage to all foes equal to 286.0%/315.3%/303.5%/332.8% of Attack. Based on lost HP, increase Highlight damage. Increase by a maximum of 60% when HP is at 40% or lower."
  },
  "passive1": {
    "name": "Evening Starlight",
    "element": "패시브",
    "description": "For each Nocturnal Blessing stack, increase Attack by 6.0%.",
    "cool": 0
  },
  "passive2": {
    "name": "Morning Starlight",
    "element": "패시브",
    "description": "Increase pierce rate based on lost HP. Increase by a maximum of 15.0% when HP is 40% or lower.",
    "cool": 0
  }
};

window.jpCharacterSkillsData["쇼키·암야"] = {
  "name": "星輝・生命欲の暴走",
  "skill1": {
    "name": "煌めきの一閃",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "敵全体に攻撃力125.1%/137.9%/132.8%/145.6%の祝福属性ダメージを与え、２ターンの間、自身のクリティカルダメージが48.8%/53.8%/51.8%/56.8%上昇する。\n『生命欲の祝印』を２つ獲得する。自身のＨＰが４０%未満の場合、追加で『生命欲の祝印』を３つ獲得する。"
  },
  "skill2": {
    "name": "星の盾",
    "element": "버프",
    "type": "보조",
    "sp": 0,
    "cool": 0,
    "description": "２ターンの間、自身に攻撃力9.8%/10.8%/10.4%/11.4%＋1875/2472/2305/2933分のシールドを付与し（１回のスキルで付与できる上限は自身の最大ＨＰの４０%まで）、『ステッラート』を１つ獲得する。\nこのスキルを使用した後も同ターン内にスキルを使用できる。\nこのスキルは通常のスキルとして扱わず、ＳＰの代わりにＨＰを消費して使用する。\n『ステッラート』：与ダメージが9.8%/10.8%/10.4%/11.4%上昇する。『スコルピーレ』を使用した時、すべての『ステッラート』を消費してスキルダメージを上昇させる。最大８つまで累積できる。"
  },
  "skill3": {
    "name": "スコルピーレ",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 24,
    "cool": 1,
    "description": "敵全体に攻撃力256.7%/283.0%/272.5%/298.8%の祝福属性ダメージを与える。『生命欲の祝印』を５つ以上獲得している場合、追加で攻撃力45.3%/49.9%/48.1%/52.7%の祝福属性ダメージを１回与える。『ステッラート』１つごとに、このスキルダメージが１２%上昇する。\nこのスキルを発動後『ステッラート』はすべて消失し、自身の最大ＨＰの２０%×『生命欲の祝印』の累積数分、ＨＰを回復する。"
  },
  "skill_highlight": {
    "element": "축복광역",
    "type": "광역피해",
    "cool": 4,
    "description": "敵全体に攻撃力286.0%/315.3%/303.5%/332.8%の祝福属性ダメージを与える。現在のＨＰが少ないほど、ハイライトダメージが上昇する。残りのＨＰが４０%以下の時に最大となり６０%上昇する。"
  },
  "passive1": {
    "name": "宵の星明り",
    "element": "패시브",
    "description": "獲得している『生命欲の祝印』１つごとに、自身の攻撃力が6.0%上昇する。",
    "cool": 0
  },
  "passive2": {
    "name": "暁の星明り",
    "element": "패시브",
    "description": "現在のＨＰが少ないほど、自身の貫通が上昇する。残りＨＰが４０%以下の時に最大となり15.0%上昇する。",
    "cool": 0
  }
};

window.cnCharacterSkillsData["쇼키·암야"] = {
  "name": "池波星辉·永夜",
  "skill1": {
    "name": "破晓之剑",
    "element": "축복광역",
    "type": "群体伤害",
    "sp": 20,
    "cool": 0,
    "description": "对所有敌人造成104.2%/114.9%/110.6%/121.3%攻击力的祝福属性伤害，自身暴击效果提升48.8%/53.8%/51.8%/56.8%，效果持续2回合。\n获得2层『暗夜祝福』，释放该技能时若自身生命值低于40%，则额外获得3层『暗夜祝福』。"
  },
  "skill2": {
    "name": "坚守的誓言",
    "element": "버프",
    "type": "辅助",
    "hp": 40,
    "cool": 0,
    "description": "使自身获得9.8%/10.8%/10.4%/11.4%攻击力+1875/2472/2305/2933的护盾（单次技能上限为自身最大生命值的40%），效果持续2回合，并获得1层『暗夜契约』。\n『暗夜契约』：造成伤害提升9.8%/10.8%/10.4%/11.4%，释放『以吾之名刻于汝身』时，消耗所有『暗夜契约』并使技能伤害得到提升，可叠加8层。\n使用该技能后本回合仍可使用其他技能，该技能不视为人格面具技能。"
  },
  "skill3": {
    "name": "以吾之名刻于汝身",
    "element": "축복광역",
    "type": "群体伤害",
    "sp": 24,
    "cool": 1,
    "description": "对所有敌人造成1次256.7%/283.0%/272.5%/298.8%攻击力的祝福属性伤害，若自身存在5层及以上的『暗夜祝福』则额外造成1次45.3%/49.9%/48.1%/52.7%攻击力的祝福属性伤害，每层『暗夜契约』使该技能伤害提升10%。\n释放该技能后清空『暗夜契约』，并恢复自身20%最大生命值×『暗夜祝福』层数的生命值。"
  },
  "skill_highlight": {
    "element": "축복광역",
    "type": "群体伤害",
    "cool": 4,
    "description": "对所有敌人造成228.8%/252.2%/242.8%/266.3%攻击力的祝福属性伤害，当前生命值越低，HIGHLIGHT造成伤害越高，40%生命值时获得最大伤害加成60%。",
    "name": "HIGHLIGHT"
  },
  "passive1": {
    "name": "恩典",
    "element": "패시브",
    "description": "每拥有1层『暗夜祝福』，池波星辉·永夜攻击力提升6.0%。",
    "cool": 0
  },
  "passive2": {
    "name": "涅槃",
    "element": "패시브",
    "description": "当前生命值越低，池波星辉·永夜穿透越高，40%生命值时获得最大穿透加成15.0%。",
    "cool": 0
  }
};

