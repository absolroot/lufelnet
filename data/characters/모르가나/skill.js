window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["모르가나"] = {
  "name": "모르가나",
  "skill1": {
    "name": "질풍 강습",
    "element": "질풍",
    "type": "단일 피해",
    "sp": 22,
    "cool": 0,
    "description": "1명의 적에게 공격력 146.4%/161.4%/155.4%/170.4%의 질풍 속성 대미지를 주고, 100%의 기본 확률로 적을 2턴 동안 풍습 상태에 빠뜨린다. 풍습 효과를 추가하면 고정 확률로 『직감』을 획득한다(획득하는 고정 확률은 현재 크리티컬 확률과 동일)."
  },
  "skill2": {
    "name": "치유술",
    "element": "치료광역",
    "type": "광역 피해",
    "sp": 33,
    "cool": 0,
    "description": "아군 전체가 공격력 37.6%/37.6%/39.9%/39.9%+1069/1300/1315/1546의 생명을 회복하고, 아군 전체의 원소 이상 상태 1개를 정화한다. 정화에 성공하면 즉시 『직감』을 1중첩 획득한다."
  },
  "skill3": {
    "name": "젠틀 펀치",
    "element": "물리",
    "type": "단일 피해",
    "hp": 12,
    "cool": 0,
    "description": "1명의 적에게 공격력 128.9%/142.1%/136.9%/150.1%의 물리 속성 대미지를 준다. 해당 스킬의 명중률이 20% 감소하고 크리티컬 확률이 30% 증가한다. 해당 스킬 크리티컬 발동 즉시 『직감』을 1개 획득한다."
  },
  "skill_highlight": {
    "element": "질풍",
    "type": "치료단일",
    "description": "1명의 적에게 공격력 227.8%/251.1%/241.8%/265.1%의 질풍 속성 대미지를 주고, 동료 1명을 최대 생명의 20% 상태로 부활시킨다.",
    "cool": 4
  },
  "passive1": {
    "name": "자신",
    "element": "패시브",
    "description": "『직감』의 치료 효과는 크리티컬이 적용될 수 있으며, 추가로 30.0%의 크리티컬 확률을 획득한다. 크리티컬 시 『직감』의 회복량은 공격력 24.0%+720만큼 추가로 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "속박",
    "element": "패시브",
    "description": "빛의 고리: 모든 동료의 SP 소모가 15.0% 감소한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["모르가나"] = {
  "name": "Morgana",
  "skill1": {
    "name": "Missile Whirlwind",
    "element": "질풍",
    "type": "단일 피해",
    "sp": 22,
    "cool": 0,
    "description": "Deal Wind damage to 1 foe equal to 146.4%/161.4%/155.4%/170.4% of Attack. Inflict Windswept on the foe for 2 turns. Chance to gain 1 Chivalry stack (chance is equal to current critical rate)."
  },
  "skill2": {
    "name": "Healing Breeze",
    "element": "치료광역",
    "type": "광역치료",
    "sp": 33,
    "cool": 0,
    "description": "Restore party's HP by 37.6%/37.6%/39.9%/39.9% of Morgana's Attack + 1069/1300/1315/1546, and heal 1 elemental ailment. When healing an elemental ailment, gain 1 Chivalry stack."
  },
  "skill3": {
    "name": "Gentle Fist",
    "element": "물리",
    "type": "단일 피해",
    "hp": 12,
    "cool": 0,
    "description": "Decrease this skill's accuracy by 20%, increase critical rate by 30%, and deal Physical damage to 1 foe equal to 128.9%/142.1%/136.9%/150.1% of Attack. On a critical hit, gain 1 Chivalry stack."
  },
  "skill_highlight": {
    "name": "Highlight",
    "element": "질풍",
    "type": "치료단일",
    "sp": 0,
    "cool": 4,
    "description": "Deal Wind damage to 1 foe equal to 227.8%/251.1%/241.8%/265.1% of Attack, and revive 1 KO'd ally with 20% HP."
  },
  "passive1": {
    "name": "Masked Gentleman",
    "element": "패시브",
    "description": "When healing with Chivalry, increase critical rate by 30.0%.\nWhen inflicting a critical hit, increase Chivalry's healing effect by 24.0% of Morgana's Attack + 720.",
    "cool": 0
  },
  "passive2": {
    "name": "Morgana's Method",
    "element": "패시브",
    "description": "Decrease party's SP cost by 15.0%.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["모르가나"] = {
  "name": "モルガナ",
  "skill1": {
    "name": "旋風ミサイル",
    "element": "질풍",
    "type": "단일피해",
    "sp": 22,
    "cool": 0,
    "description": "敵単体に攻撃力146.4%/161.4%/155.4%/170.4%の疾風属性ダメージを与え、その敵を２ターンの間、風襲状態にする。さらに確率で『義賊魂』を１つ獲得する。（獲得確率は現在のクリティカル率と同一）"
  },
  "skill2": {
    "name": "癒しのそよ風",
    "element": "치료광역",
    "type": "광역치료",
    "sp": 33,
    "cool": 0,
    "description": "味方全体のＨＰをモルガナの攻撃力37.6%/37.6%/39.9%/39.9%＋1069/1300/1315/1546分回復し、属性異常を１つ治療する。属性異常を治療した時、『義賊魂』を１つ獲得する。"
  },
  "skill3": {
    "name": "ジェントルパンチ",
    "element": "물리",
    "type": "단일피해",
    "hp": 12,
    "cool": 0,
    "description": "このスキルの命中率を２０%下げ、クリティカル率を３０%上昇させ、敵単体に物理属性で攻撃力128.9%/142.1%/136.9%/150.1%のダメージを与える。クリティカルが発生した時、『義賊魂』を１つ獲得する。"
  },
  "skill_highlight": {
    "element": "질풍",
    "type": "치료단일",
    "sp": 0,
    "cool": 4,
    "description": "敵単体に攻撃力227.8%/251.1%/241.8%/265.1%の疾風属性ダメージを与え、味方単体の戦闘不能をＨＰ２０%で回復する。"
  },
  "passive1": {
    "name": "仮面の紳士",
    "element": "패시브",
    "description": "『義賊魂』による回復時、クリティカル率が30.0%上昇する。\nさらに、クリティカル発生時、『義賊魂』の回復量が攻撃力24.0%＋720上昇する。",
    "cool": 0
  },
  "passive2": {
    "name": "ワガハイの流儀",
    "element": "패시브",
    "description": "味方全体のスキル使用時のＳＰ消費量が15.0%減少する。",
    "cool": 0
  }
};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.cnCharacterSkillsData["모르가나"] = {
  "name": "摩尔加纳",
  "skill1": {
    "name": "疾风强袭",
    "element": "질풍",
    "sp": 22,
    "cool": 0,
    "description": "对1名敌人造成146.4%/161.4%/155.4%/170.4%攻击力的疾风属性伤害，有100%基础概率使敌人陷入风袭状态，效果持续2回合。成功添加风袭效果后，有固定概率获得『直觉』（获取的固定概率等同于当前的暴击率）。"
  },
  "skill2": {
    "name": "疗愈之术",
    "sp": 33,
    "cool": 0,
    "description": "使所有同伴恢复37.6%/37.6%/39.9%/39.9%攻击力+1069/1300/1315/1546的生命值，净化所有同伴的1个元素异常状态。若成功净化，则立刻获得一层『直觉』。",
    "element": "치료광역"
  },
  "skill3": {
    "name": "吾辈之拳",
    "element": "물리",
    "cool": 0,
    "description": "对1名敌人造成128.9%/142.1%/136.9%/150.1%攻击力的物理属性伤害，该技能命中率降低20%，暴击率提升30%。若该技能暴击，则立刻获得一层『直觉』。"
  },
  "passive1": {
    "name": "自信",
    "element": "패시브",
    "cool": 0,
    "description": "『直觉』的治疗效果可以暴击，获得额外暴击率30.0%。暴击使得『直觉』的恢复量额外提升24.0%攻击力+720。"
  },
  "passive2": {
    "name": "羁绊",
    "element": "패시브",
    "cool": 0,
    "description": "光环：所有同伴的精力值消耗减少15.0%。"
  },
  "skill_highlight": {
    "element": "질풍",
    "cool": 4,
    "description": "对1名敌人造成227.8%/251.1%/241.8%/265.1%攻击力的疾风属性伤害，并且使1名同伴以20%的最大生命值复活。"
  }
};
