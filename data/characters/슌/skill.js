window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["슌"] = {
  "name": "카노 슌",
  "skill1": {
    "name": "흔들리는 빙산",
    "element": "빙결",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "1명의 적에게 최대 생명 55.6%/61.3%/57.9%/63.6%의 빙결 속성 대미지를 주고 70%의 기본 확률로 적을 동결 상태에 빠뜨린다."
  },
  "skill2": {
    "name": "선봉 돌격",
    "element": "물리",
    "type": "단일 피해",
    "hp": 6,
    "cool": 0,
    "description": "1명의 적에게 최대 생명 56.9%/62.7%/59.2%/65.1%의 물리 속성 대미지를 주고, 2턴 동안 목표 적의 방어력이 30.0%/30.0%/31.2%/31.2% 감소한다. 『황야의 구세주』 상태일 경우 방어력 감소가 59.9%/59.9%/62.4%/62.4%까지 증가한다."
  },
  "skill3": {
    "name": "0도 치유",
    "element": "버프",
    "type": "생존",
    "sp": 24,
    "cool": 1,
    "description": "아군 전체의 최대 생명이 카노 슌 최대 생명의 15%(최대 생명의 14100/14100/15600/15600포인트까지 계산)만큼 증가하고 자신이 공격받을 확률이 대폭 증가한다. 효과는 2턴 지속된다. 카노 슌 최대 생명의 16.5%/18.2%/17.2%/18.9%에 해당하는 수치만큼 아군 전체의 생명이 회복된다.\n쿨타임: 1턴."
  },
  "skill_highlight": {
    "element": "빙결",
    "type": "생존",
    "description": "아군 전체의 최대 생명이 카노 슌 최대 생명의 10.3%(최대 생명의 14100/14100/15600/15600포인트까지 계산)만큼 증가한다. 카노 슌 최대 생명의 10.1%/11.1%/10.5%/11.5%에 해당하는 수치만큼 아군 전체의 생명이 회복된다. 1명의 적에게 최대 생명 75.3%/83.1%/78.4%/86.2%의 빙결 속성 대미지를 준다.",
    "cool": 4
  },
  "passive1": {
    "name": "야만",
    "element": "패시브",
    "description": "총기의 총알 개수가 18 증가한다. 총격 시 총알 1발당 10.0%의 고정 확률로 자신은 최대 생명 9%의 대미지를 주고, 적의 방어력이 35% 감소한다. 효과는 3턴 동안 지속된다. 총격 대미지는 동일 목표에게 약해진다.",
    "cool": 0
  },
  "passive2": {
    "name": "모략",
    "element": "패시브",
    "description": "『0도 치유』 스킬 시전 후 공격받을 때마다 30.0%의 고정 확률로 『황야의 구세주』 회복 효과를 발동하며 2턴 동안 지속된다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["슌"] = {
  "name": "Shun Kano",
  "skill1": {
    "name": "Icicle Hatchet",
    "element": "빙결",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Ice damage to 1 foe equal to 55.6%/61.3%/57.9%/63.6% of Shun's max HP. 70% chance to inflict Freeze."
  },
  "skill2": {
    "name": "Smash Hit",
    "element": "물리",
    "type": "단일 피해",
    "hp": 6,
    "cool": 0,
    "description": "Deal Physical damage to 1 foe equal to 56.9%/62.7%/59.2%/65.1% of Shun's max HP. Decrease Defense by 30.0%/30.0%/31.2%/31.2% for 2 turns.When Desperado is active, increase effect by 59.9%/59.9%/62.4%/62.4%."
  },
  "skill3": {
    "name": "Icy Defense",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 1,
    "description": "Increase party's max HP by 15% of Shun's max HP (up to 14100/14100/15600/15600) for 2 turns.\nAlso, restore party's HP by 16.5%/18.2%/17.2%/18.9% of Shun's max HP.\nGreatly increase Shun's chance of being targeted by attacks for 2 turns.\nCooldown Time: 1 turn."
  },
  "skill_highlight": {
    "element": "빙결",
    "type": "생존",
    "description": "Increase party's max HP by 10.3% of Shun's max HP for 2 turns (up to 14100/14100/15600/15600) and restore party's HP by 10.1%/11.1%/10.5%/11.5% of Shun's max HP.\nDeal Ice damage to 1 foe equal to 75.3%/83.1%/78.4%/86.2% of Shun's max HP.",
    "cool": 4
  },
  "passive1": {
    "name": "Daunting Firepower",
    "element": "패시브",
    "description": "Increase ammo for ranged attacks by 18. When attacking foes with ranged attacks, 10.0% chance to deal bonus damage equal to 9% of Shun's max HP, and decrease foe's Defense by 35% for 3 turns. Consecutive ranged attacks against the same foe will deal decreased damage.",
    "cool": 0
  },
  "passive2": {
    "name": "For Your Benefit",
    "element": "패시브",
    "description": "When Shun is attacked while Icy Defense is active, 30.0% chance to activate Desperado.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["슌"] = {
  "name": "加納 駿",
  "skill1": {
    "name": "アイシクルハチェット",
    "element": "빙결",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "敵単体に最大ＨＰ55.6%/61.3%/57.9%/63.6%の氷結属性ダメージを与え、７０%の確率で凍結状態にする。"
  },
  "skill2": {
    "name": "スマッシュヒット",
    "element": "물리",
    "type": "단일피해",
    "hp": 6,
    "cool": 0,
    "description": "敵単体に最大ＨＰ56.9%/62.7%/59.2%/65.1%の物理属性ダメージを与える。また２ターンの間、対象の防御力を30.0%/30.0%/31.2%/31.2%低下させる。この効果は『タフガイ』状態の時、59.9%/59.9%/62.4%/62.4%に上昇する。"
  },
  "skill3": {
    "name": "守護の氷壁",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 1,
    "description": "２ターンの間、味方全体の最大ＨＰが駿の最大ＨＰ１５%分（最大で最大ＨＰ14100/14100/15600/15600分まで）上昇する。\nさらに味方全体のＨＰを、駿の最大ＨＰ16.5%/18.2%/17.2%/18.9%分、回復する。\n同時に、２ターンの間、駿が攻撃を受ける確率が大幅に上昇する。\nクールタイム：１ターン"
  },
  "skill_highlight": {
    "element": "빙결",
    "type": "생존",
    "description": "２ターンの間、味方全体の最大ＨＰが駿の最大ＨＰ１０.３%分（最大で最大ＨＰ14100/14100/15600/15600分まで）上昇する。さらに味方全体のＨＰを駿の最大ＨＰ10.1%/11.1%/10.5%/11.5%で回復する。\n同時に、敵単体に最大ＨＰ75.3%/83.1%/78.4%/86.2%の氷結属性ダメージを与える。",
    "cool": 4
  },
  "passive1": {
    "name": "威圧の弾撃",
    "element": "패시브",
    "description": "自身の遠隔攻撃の残弾数が18増加する。遠隔攻撃で敵を攻撃した時、10.0%の確率で、自身の最大ＨＰ９%のダメージを追加で与え、敵の防御力を３ターンの間、３５%減少させる。遠隔攻撃を同一の敵に対して連続して使用すると、ダメージが減少する。",
    "cool": 0
  },
  "passive2": {
    "name": "恩人のために",
    "element": "패시브",
    "description": "『守護の氷壁』の効果中に自身が攻撃を受けた時、30.0%の確率で『タフガイ』の回復効果が発動する。",
    "cool": 0
  }
};
