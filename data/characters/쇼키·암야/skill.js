window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["쇼키·암야"] = {
  "name": "이케나미 쇼키·암야",
  "skill1": {
    "name": "여명의 검",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "모든 적에게 공격력 104.2%/114.9%/110.6%/121.3%의 축복 속성 대미지를 주고, 자신의 크리티컬 효과가 48.8%/53.8%/51.8%/56.8% 증가한다(2턴 지속).\n또한 『암야의 축복』을 2중첩 획득하고, 스킬 시전 시 자신의 HP가 40% 미만이면 『암야의 축복』을 3중첩 추가 획득한다."
  },
  "skill2": {
    "name": "굳건한 서약",
    "element": "버프",
    "type": "보조",
    "hp": 40,
    "cool": 0,
    "description": "자신에게 공격력 9.8%/10.8%/10.4%/11.4% + 1875/2472/2305/2933의 실드(단일 스킬 기준 최대 HP의 40% 상한)를 2턴 부여하고 『암야의 계약』을 1중첩 획득한다.\n『암야의 계약』: 자신이 주는 대미지가 9.8%/10.8%/10.4%/11.4% 증가하고, 『이 이름을 너의 몸에 새기노라』 사용 시 모든 계약 중첩을 소모하여 스킬 대미지가 증가한다(최대 8중첩).\n이 스킬 사용 후에도 이번 턴 다른 스킬 사용 가능하며, 페르소나 스킬로 취급되지 않는다."
  },
  "skill3": {
    "name": "이 이름을 너의 몸에 새기노라",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 24,
    "cool": 1,
    "description": "모든 적에게 공격력 256.7%/283.0%/272.5%/298.8%의 축복 속성 대미지를 1회 주고, 자신의 『암야의 축복』이 5중첩 이상일 경우 공격력 45.3%/49.9%/48.1%/52.7%의 축복 속성 대미지를 1회 추가로 준다.\n또한 『암야의 계약』 1중첩마다 해당 스킬의 대미지가 10% 증가한다.\n스킬 사용 후 『암야의 계약』을 모두 소모하고, 자신의 최대 HP 20% × 『암야의 축복』 중첩수만큼 HP를 회복한다."
  },
  "skill_highlight": {
    "element": "축복광역",
    "type": "광역피해",
    "cool": 0,
    "description": "모든 적에게 공격력 228.8%/252.2%/242.8%/266.3%의 축복 속성 대미지를 준다. 자신의 현재 HP가 낮을수록 HIGHLIGHT 대미지가 증가하며, HP 40% 기준 최대 60%의 추가 대미지를 얻는다."
  },
  "passive1": {
    "name": "은총",
    "element": "패시브",
    "description": "『암야의 축복』 1중첩마다 이케나미 쇼키·암야의 공격력이 6.0% 증가한다."
  },
  "passive2": {
    "name": "열반",
    "element": "패시브",
    "description": "현재 HP가 낮을수록 이케나미 쇼키·암야의 관통이 증가한다. HP 40% 기준 관통 최대 15.0% 증가."
  }
};
window.enCharacterSkillsData["쇼키·암야"] = {
  "name": "Shoki·Notte",
  "skill1": {
    "name": "Spada dell'Alba",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Bless damage to all foes equal to 104.2%/114.9%/110.6%/121.3% of Attack, and increase Shoki's critical damage by 48.8%/53.8%/51.8%/56.8% for 2 turns.\nGrant Shoki 2 [Night's Blessing] stacks, if he is below 40% max HP, grant 3 bonus [Night's Blessing] stacks."
  },
  "skill2": {
    "name": "Giuramento Incrollabile",
    "element": "버프",
    "type": "보조",
    "sp": 0,
    "cool": 0,
    "description": "Gain a Shield equal to 9.8%/10.8%/10.4%/11.4% of Attack + 1875/2472/2305/2933 for 2 turns (up to 40% of Shoki's max HP per skill). Gain 1 [Night's Contract] stack.\n[Night's Contract]: Increase damage by 9.8%/10.8%/10.4%/11.4%, when using [Ti Inciderò il Nome Mio], spend all [Night's Contract] to increase skill damage. Stacks up to 8 times.\nAfter using this skill, Shoki can use other skills, this doesn't count as a Persona skill."
  },
  "skill3": {
    "name": "Ti Inciderò il Nome Mio",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 24,
    "cool": 1,
    "description": "Deal Bless damage to all foes equal to 256.7%/283.0%/272.5%/298.8% of Attack. If Shoki has 5 [Night's Blessing] stacks, deal bonus Bless damage to all foes equal to 45.3%/49.9%/48.1%/52.7% of Attack. Increase skill damage by 10% per [Night's Contract] stack.\nLose all [Night's Contract] after using this skill, and restore HP by 20% of Shoki's max HP per [Night's Blessing] stack."
  },
  "skill_highlight": {
    "element": "축복광역",
    "type": "광역피해",
    "cool": 0,
    "description": "Deal Bless damage to all foes equal to 228.8%/252.2%/242.8%/266.3% of Attack, increase damage based on missing HP (up to 60% damage at 40% HP)."
  },
  "passive1": {
    "name": "Grace",
    "element": "패시브",
    "description": "Increase Attack by 6.0% based on the number of [Night's Blessing] stacks."
  },
  "passive2": {
    "name": "Nirvana",
    "element": "패시브",
    "description": "Increase pierce rate based on missing HP (up to 15.0% pierce rate at 40% HP)."
  }
};
window.jpCharacterSkillsData["쇼키·암야"] = {
  "name": "池波ショウキ・アンヤ",
  "skill1": {
    "name": "黎明の剣",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "敵全体に攻撃力104.2%/114.9%/110.6%/121.3%の祝福属性ダメージを与え、自身のクリティカル効果が48.8%/53.8%/51.8%/56.8%上昇する（2ターン持続）。\nまた、『暗夜の祝福』を2スタック獲得し、スキル発動時に自身のHPが40%未満の場合、『暗夜の祝福』を追加で3スタック獲得する。"
  },
  "skill2": {
    "name": "揺るがぬ誓約",
    "element": "버프",
    "type": "보조",
    "sp": 0,
    "cool": 0,
    "description": "自身に攻撃力9.8%/10.8%/10.4%/11.4% + 1875/2472/2305/2933のシールド（単一スキル基準で最大HPの40%まで）を2ターン付与し、『暗夜の契約』を1スタック獲得する。\n『暗夜の契約』：自身の与ダメージが9.8%/10.8%/10.4%/11.4%上昇し、『我が名を汝の身に刻まん』を発動すると全スタックを消費してスキルダメージが増加する（最大8スタック）。\nこのスキル使用後も同ターンに他のスキルを使用でき、ペルソナスキルとはみなされない。"
  },
  "skill3": {
    "name": "我が名を汝の身に刻まん",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 24,
    "cool": 1,
    "description": "敵全体に攻撃力256.7%/283.0%/272.5%/298.8%の祝福属性ダメージを1回与え、自身の『暗夜の祝福』が5スタック以上ある場合、攻撃力45.3%/49.9%/48.1%/52.7%の祝福属性ダメージを追加で1回与える。\nさらに、『暗夜の契約』1スタックにつき、このスキルのダメージが10%上昇する。\nスキル発動後、『暗夜の契約』を全て消費し、自身の最大HP20% × 『暗夜の祝福』スタック数に相当するHPを回復する。"
  },
  "skill_highlight": {
    "element": "축복광역",
    "type": "광역피해",
    "cool": 0,
    "description": "敵全体に攻撃力228.8%/252.2%/242.8%/266.3%の祝福属性ダメージを与える。自身の現在HPが低いほどHIGHLIGHTダメージが上昇し、HP40%時に最大60%の追加ダメージを獲得する。"
  },
  "passive1": {
    "name": "恩寵",
    "element": "패시브",
    "description": "『暗夜の祝福』1スタックにつき、池波ショウキ・アンヤの攻撃力が6.0%上昇する。"
  },
  "passive2": {
    "name": "涅槃",
    "element": "패시브",
    "description": "現在HPが低いほど池波ショウキ・アンヤの貫通が上昇する。HP40%時に最大15.0%の貫通ボーナスを得る。"
  }
};
