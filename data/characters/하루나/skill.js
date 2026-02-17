window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["하루나"] = {
  "name": "니시모리 하루나",
  "skill1": {
    "name": "멍청한 조수",
    "element": "염동",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "1명의 적에게 공격력 146.4%/161.4%/155.4%/170.4%의 염동 속성 대미지를 주고, 모든 동료를 『총애』 상태에 빠뜨린다. 페르소나 스킬을 사용하여 대미지를 주면 니시모리가 『동심』 1중첩을 획득한다. 효과는 1턴 동안 지속된다."
  },
  "skill2": {
    "name": "똑똑한 탐험가",
    "element": "버프광역",
    "type": "버프",
    "sp": 22,
    "cool": 0,
    "description": "모든 동료가 받는 치료 효과와 받는 실드 효과가 17.6%/19.4%/18.6%/20.4%, 방어력이 34.2%/37.7%/36.3%/39.8% 증가한다. 효과는 2턴 동안 지속된다. 해당 스킬 시전 시 『동심』 중첩이 0이면 스킬 종료 후 『동심』을 2중첩 획득한다."
  },
  "skill3": {
    "name": "왕성한 동심",
    "element": "버프광역",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "『동심』 보유 시 스킬이 활성화되어 2턴 동안 모든 동료의 공격력이 10% 증가한다. 해당 스킬 사용 시 『동심』이 2중첩 이상일 경우, 2턴 동안 모든 동료가 주는 대미지가 증가한다(자신의 공격력 100포인트마다 1% 증가, 최대 48.8%/53.8%/51.8%/56.8%)."
  },
  "skill_highlight": {
    "element": "염동",
    "type": "버프",
    "description": "니시모리가 『동심』 획득 시, 『계수』 1개를 획득하며 2턴 동안 지속된다(5회 중첩 가능). HIGHLIGHT 시전 시,1명의 적에게 공격력 366.0%/403.5%/388.5%/426.0%의 염동 속성 대미지를 주고, 1턴 동안 모든 동료가 주는 대미지가 7.8%/8.6%/8.3%/9.1%*현재 『계수』 중첩수만큼 증가한다.",
    "cool": 4
  },
  "passive1": {
    "name": "의문 추적",
    "element": "패시브",
    "description": "『총애』 상태인 동료가 대미지를 1단계 줄 때마다 40.0%의 고정 확률로 니시모리가 『동심』을 1중첩 획득한다.",
    "cool": 0
  },
  "passive2": {
    "name": "탐구",
    "element": "패시브",
    "description": "『동심』을 3중첩 이상 소모한 경우, 『동심』으로 인한 공격력 증가 효과가 24.0% 증가한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["하루나"] = {
  "name": "Haruna Nishimori",
  "skill1": {
    "name": "Surprise Squad",
    "element": "염동",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Psychokinesis damage to 1 foe equal to 146.4%/161.4%/155.4%/170.4% of Attack, and grant Affection to party for 1 turn.\nAffection: When dealing damage with a skill, grant Haruna 1 Childish Heart stack."
  },
  "skill2": {
    "name": "Ready for Adventure",
    "element": "버프광역",
    "type": "버프",
    "sp": 22,
    "cool": 0,
    "description": "Increase party's healing received and shield received by 17.6%/19.4%/18.6%/20.4%, and Defense by 34.2%/37.7%/36.3%/39.8% for 2 turns.\nIf Haruna does not have Childish Heart, gain 2 Childish Heart stacks."
  },
  "skill3": {
    "name": "Courageous Campaign",
    "element": "버프광역",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "This skill requires Childish Heart.\nWhen used with Childish Heart, increase party's Attack by 10% for 2 turns.\nAt 2 or more stacks of Childish Heart, also increase party's damage by 1% for every 100 of Haruna's Attack, up to 48.8%/53.8%/51.8%/56.8%."
  },
  "skill_highlight": {
    "name": "Highlight",
    "element": "염동",
    "type": "버프",
    "sp": 0,
    "cool": 4,
    "description": "Deal Psychokinesis damage to 1 foe equal to 366.0%/403.5%/388.5%/426.0% of Attack. Increase party's damage by 7.8%/8.6%/8.3%/9.1% for each stack of Mystery for 1 turn."
  },
  "passive1": {
    "name": "Let's Hold Hands",
    "element": "패시브",
    "description": "Each time an ally with Affection deals damage, 40.0% chance to gain 1 Childish Heart stack.",
    "cool": 0
  },
  "passive2": {
    "name": "Safety in Numbers",
    "element": "패시브",
    "description": "When spending 3 or more Childish Heart stacks at once, increase effects of Off to Treasure Hunt by 24.0% more.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["하루나"] = {
  "name": "西森 陽菜",
  "skill1": {
    "name": "ビックリドッキリ隊員",
    "element": "염동",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "敵単体に攻撃力146.4%/161.4%/155.4%/170.4%の念動属性ダメージを与え、味方全体を１ターンの間、『愛情』状態にする。\n『愛情』状態：スキルでダメージを与えた時、陽菜が『子供心』を１つ獲得する。"
  },
  "skill2": {
    "name": "冒険の準備は万端",
    "element": "버프광역",
    "type": "버프",
    "sp": 22,
    "cool": 0,
    "description": "２ターンの間、味方全体の被ＨＰ回復量と被シールド量を17.6%/19.4%/18.6%/20.4%、防御力を34.2%/37.7%/36.3%/39.8%上昇させる。\n『子供心』を獲得していない場合、『子供心』を２つ獲得する。"
  },
  "skill3": {
    "name": "勇気の大作戦",
    "element": "버프광역",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "『子供心』を獲得していない場合、このスキルは使用できない。\n『子供心』を獲得した状態で使用すると２ターンの間、味方全体の攻撃力を１０%上昇させる。\n『子供心』の累積が２つ以上の時、さらに与ダメージが自身の攻撃力１００ごとに１%上昇し、最大48.8%/53.8%/51.8%/56.8%まで上昇する。"
  },
  "skill_highlight": {
    "element": "염동",
    "type": "버프",
    "sp": 0,
    "cool": 4,
    "description": "敵単体に攻撃力366.0%/403.5%/388.5%/426.0%の念動属性ダメージを与え、１ターンの間、味方全体の与ダメージを『ミステリー』の累積数ごとに7.8%/8.6%/8.3%/9.1%ずつ上昇させる。"
  },
  "passive1": {
    "name": "手を繋いで行こう！",
    "element": "패시브",
    "description": "『愛情』状態の味方がダメージを与えるごとに、40.0%の確率で『子供心』を１つ獲得する。",
    "cool": 0
  },
  "passive2": {
    "name": "一緒なら怖くない！",
    "element": "패시브",
    "description": "『子供心』を一度に３つ以上消費した時、『宝探しへ出発！』の攻撃力上昇効果の値が24.0%上昇する。",
    "cool": 0
  }
};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.cnCharacterSkillsData["하루나"] = {
  "name": "西森阳菜",
  "skill1": {
    "name": "笨笨的助手",
    "sp": 20,
    "cool": 0,
    "description": "对1名敌人造成146.4%/161.4%/155.4%/170.4%攻击力的念动属性伤害，使所有同伴进入『宠爱』状态：释放人格面具技能造成伤害时，使西森获得1层『童趣』，效果持续1回合。",
    "element": "염동"
  },
  "skill2": {
    "name": "聪明的探险家",
    "sp": 22,
    "cool": 0,
    "description": "使所有同伴受到的治疗效果以及受到的护盾效果提升17.6%/19.4%/18.6%/20.4%，防御力提升34.2%/37.7%/36.3%/39.8%。效果持续2回合。释放该技能时若『童趣』层数为0，则在技能结束后获得2层『童趣』。",
    "element": "버프광역"
  },
  "skill3": {
    "name": "旺盛童心",
    "sp": 24,
    "cool": 0,
    "description": "持有『童趣』时该技能开启，使所有同伴的攻击力提升10%，效果持续2回合。释放该技能时若『童趣』不少于2层，则使所有同伴造成的伤害提升（自身每有100点攻击力提升1%，上限48.8%/53.8%/51.8%/56.8%），效果持续2回合。",
    "element": "버프광역"
  },
  "passive1": {
    "name": "追疑",
    "element": "패시브",
    "cool": 0,
    "description": "处于『宠爱』的同伴造成伤害时，每造成1段伤害，有40.0%固定概率使西森获得1层『童趣』。"
  },
  "passive2": {
    "name": "探究",
    "element": "패시브",
    "cool": 0,
    "description": "消耗『童趣』的层数大于等于3时，使得由『童趣』带来的攻击力提升效果提升24.0%。"
  },
  "skill_highlight": {
    "cool": 4,
    "description": "西森获得『童趣』时，会获得1个『计数』，上限5层，持续2回合。释放HIGHLIGHT时，对1名敌人造成366.0%/403.5%/388.5%/426.0%攻击力的念动属性伤害，使所有同伴造成的伤害提升7.8%/8.6%/8.3%/9.1%*当前『计数』层数，效果持续1回合。",
    "element": "염동"
  }
};
