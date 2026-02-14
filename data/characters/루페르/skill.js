window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["루페르"] = {
  "name": "루페르",
  "skill1": {
    "name": "타오르는 불길",
    "element": "화염",
    "type": "단일 피해",
    "sp": 22,
    "cool": 0,
    "description": "1명의 적에게 공격력 113.2%/124.8%/117.9%/129.5%의 화염 속성 대미지를 주고, 100%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨리고 적이 받는 치료 효과가 30% 감소한다."
  },
  "skill2": {
    "name": "희망의 빔",
    "element": "치료",
    "type": "단일 피해",
    "sp": 24,
    "cool": 0,
    "description": "동료 1명이 공격력 67.4%/67.4%/70.2%/70.2%+1920/2334/2209/2623의 생명을 회복한다. 목표의 생명이 50% 미만일 경우, 치료 효과가 19%/19%/20%/20% 증가한다."
  },
  "skill3": {
    "name": "천사의 연민",
    "element": "치료광역",
    "type": "광역 피해",
    "sp": 31,
    "cool": 0,
    "description": "모든 동료가 공격력의 42.1%/42.1%/43.8%/43.8%+1197/1456/1378/1636의 생명을 회복하고, 메인 목표 동료에 대한 치료 효과가 24%/24%/25%/25% 증가한다."
  },
  "skill_highlight": {
    "element": "치료광역",
    "type": "광역치료",
    "description": "모든 동료가 공격력의 59.7%/59.7%/62.2%/62.2%+1700/2067/1956/2323의 생명을 회복하고, 1턴 동안 모든 동료의 공격력이 33.2%/33.2%/34.5%/34.5% 증가한다.",
    "cool": 4
  },
  "passive1": {
    "name": "광명",
    "element": "패시브",
    "description": "페르소나 스킬을 사용해 적 공격 시, 임의의 동료 3명이 『별의 불꽃』 효과를 획득한다.",
    "cool": 0
  },
  "passive2": {
    "name": "희망",
    "element": "패시브",
    "description": "자신의 최대 생명이 치료 효과로 전환되며, 최대 12000의 생명으로 치료 효과를 42.0% 증가시킬 수 있다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["루페르"] = {
  "name": "Lufel",
  "skill1": {
    "name": "Owl Fire",
    "element": "화염",
    "type": "단일 피해",
    "sp": 22,
    "cool": 0,
    "description": "Deal Fire damage to 1 foe equal to 113.2%/124.8%/117.9%/129.5% of Attack, inflict Burn for 2 turns, and decrease healing received by 30%."
  },
  "skill2": {
    "name": "Owl Green",
    "element": "치료",
    "type": "단일 피해",
    "sp": 24,
    "cool": 0,
    "description": "Restore 1 ally's HP by 67.4%/67.4%/70.2%/70.2% of Lufel's Attack + 1920/2334/2209/2623. If target's HP is below 50%, increase healing effect by 19%/19%/20%/20%."
  },
  "skill3": {
    "name": "Healing Satellite",
    "element": "치료광역",
    "type": "광역치료",
    "sp": 31,
    "cool": 0,
    "description": "Restore party's HP by 42.1%/42.1%/43.8%/43.8% of Lufel's Attack + 1197/1456/1378/1636. Increase healing effect on the main target by 24%/24%/25%/25%."
  },
  "skill_highlight": {
    "name": "Highlight",
    "element": "치료광역",
    "type": "광역치료",
    "sp": 0,
    "cool": 4,
    "description": "Restore party's HP by 59.7%/59.7%/62.2%/62.2% of Lufel's Attack + 1700/2067/1956/2323. Increase party's Attack by 33.2%/33.2%/34.5%/34.5% for 1 turn."
  },
  "passive1": {
    "name": "Forest Sage",
    "element": "패시브",
    "description": "After attacking with a skill, grant Starfire to up to 3 allies.",
    "cool": 0
  },
  "passive2": {
    "name": "Sparks of Support",
    "element": "패시브",
    "description": "Increase healing effect based on Lufel's max HP. The effect is maximized at 12000 HP, and healing effect will increase by 42.0%.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["루페르"] = {
  "name": "ルフェル",
  "skill1": {
    "name": "オウルファイア",
    "element": "화염",
    "type": "단일피해",
    "sp": 22,
    "cool": 0,
    "description": "敵単体に攻撃力113.2%/124.8%/117.9%/129.5%の火炎属性ダメージを与え、２ターンの間、炎上状態にし、その状態の敵の被回復量を３０%低下させる。"
  },
  "skill2": {
    "name": "オウルグリーン",
    "element": "치료",
    "type": "단일치료",
    "sp": 24,
    "cool": 0,
    "description": "味方単体のＨＰをルフェルの攻撃力67.4%/67.4%/70.2%/70.2%+1920/2334/2209/2623分、回復する。対象の残りのＨＰが５０%未満の場合、回復量が19%/19%/20%/20%上昇する。"
  },
  "skill3": {
    "name": "ヒーリングサテライト",
    "element": "치료광역",
    "type": "광역치료",
    "sp": 31,
    "cool": 0,
    "description": "味方全体のＨＰをルフェルの攻撃力42.1%/42.1%/43.8%/43.8%＋1197/1456/1378/1636で回復する。選択した対象は回復量が24%/24%/25%/25%上昇する。"
  },
  "skill_highlight": {
    "element": "치료광역",
    "type": "광역치료",
    "sp": 0,
    "cool": 4,
    "description": "味方全体のＨＰをルフェルの攻撃力59.7%/59.7%/62.2%/62.2%＋1700/2067/1956/2323で回復する。さらに１ターンの間、味方全体の攻撃力が33.2%/33.2%/34.5%/34.5%上昇する。"
  },
  "passive1": {
    "name": "森の賢者",
    "element": "패시브",
    "description": "スキルで敵を攻撃した時、最大3人の味方を『星火』状態にする。",
    "cool": 0
  },
  "passive2": {
    "name": "援護の飛び火",
    "element": "패시브",
    "description": "自身の最大ＨＰに応じて、自身のＨＰ回復量が上昇する。ＨＰ12000で効果が最大となり、回復量が42.0%上昇する。",
    "cool": 0
  }
};
