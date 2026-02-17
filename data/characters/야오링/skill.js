window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["야오링"] = {
  "name": "리 야오링",
  "skill1": {
    "name": "나룻배 사공",
    "element": "주원광역",
    "type": "버프",
    "sp": 20,
    "cool": 0,
    "description": "모든 적에게 공격력 73.2%/80.7%/77.7%/85.2%의 주원 속성 대미지를 준다. 2턴 동안 자신의 속도 10포인트마다 목표 적의 방어력이 3% 감소되며, 최대 49.7%/54.8%/53.5%/58.6% 감소된다. 해당 스킬이 적 1명을 명중할 때마다 자신은 『추억』 4포인트를 획득한다."
  },
  "skill2": {
    "name": "피안의 덤불",
    "element": "주원",
    "type": "제어",
    "sp": 22,
    "cool": 0,
    "description": "1명의 적에게 공격력 97.6%/107.6%/103.6%/113.6%의 주원 속성 대미지를 준다. 적이 임의의 디버프 효과를 보유하면 스킬 대미지가 20% 증가한다. 『맹파탕』 추가 효과로 2턴 동안 100%의 기본 확률로 메인 목표를 망각 상태에 빠뜨린다. 망각 상태 추가에 성공하거나 목표가 정신 이상 상태일 경우, 목표가 받는 대미지가 증가한다. 자신에게 속도가 10포인트 있을 때마다 1턴 동안 적이 받는 대미지가 2% 증가한다(상한 32.3%/32.3%/34.3%/34.3%)."
  },
  "skill3": {
    "name": "사자놀이",
    "element": "주원광역",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "모든 적에게 공격력 78.1%/86.1%/82.9%/90.9%의 주원 속성 대미지를 주고, 『피안화』 효과를 부여하여 자신의 속도 10포인트마다 적이 받는 대미지가 3% 증가한다. 상한은 48.5%/53.5%/52.2%/57.2%이다. 해당 효과는 대미지를 2회 받거나 2턴이 지나면 제거된다. 『맹파탕』의 추가 효과는 『피안화』의 대미지 증가 효과를 2배로 만든다."
  },
  "skill_highlight": {
    "element": "주원광역",
    "type": "디버프",
    "description": "모든 적에게 공격력 146.4%/161.4%/155.4%/170.4%의 주원 속성 대미지를 주고, 모든 적이 다음에 받는 대미지가 48.8%/53.8%/51.8%/56.8% 증가한다. 30%의 기본 확률로 모든 적을 2턴 동안 망각 상태에 빠뜨린다.",
    "cool": 4
  },
  "passive1": {
    "name": "웃음소리",
    "element": "패시브",
    "description": "속도 2포인트마다 자신의 공격력이 1% 증가한다. 이 방식으로 공격력이 최대 90.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "만발",
    "element": "패시브",
    "description": "필드에서 생명이 50% 이상인 적이 받는 주원 대미지가 30.0% 증가한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["야오링"] = {
  "name": "Yaoling Li",
  "skill1": {
    "name": "Underworld Ferry",
    "element": "주원광역",
    "type": "디버프 중첩",
    "sp": 20,
    "cool": 0,
    "description": "Deal Curse damage to all foes equal to 73.2%/80.7%/77.7%/85.2% of Attack. Decrease foes' Defense by 3% for every 10 points of Yaoling's Speed for 2 turns (up to 49.7%/54.8%/53.5%/58.6%). Also gain 4 Memory stacks for each foe attacked."
  },
  "skill2": {
    "name": "Flowers of Naihe",
    "element": "주원",
    "type": "제어",
    "sp": 22,
    "cool": 0,
    "description": "Deal Curse damage to 1 foe equal to 97.6%/107.6%/103.6%/113.6% of Attack. If foe has a debuff, increase damage by 20%. When spending Meng Po Soup, inflict Forget on the main target for 2 turns.\nIf foe is inflicted with Forget or another spiritual ailment, increase their damage taken by 2% for every 10 points of Yaoling's Speed (up to 32.3%/32.3%/34.3%/34.3%) for 1 turn."
  },
  "skill3": {
    "name": "Lion Dance of Oblivion",
    "element": "주원광역",
    "type": "디버프",
    "sp": 24,
    "cool": 0,
    "description": "Deal Curse damage to all foes equal to 78.1%/86.1%/82.9%/90.9% of Attack, and inflict Red Spider Lily for 2 turns. When spending Meng Po Soup, double Red Spider Lily's damage increase.\nRed Spider Lily: Increase foes' damage taken by 3% for every 10 points of Yaoling's Speed (up to 48.5%/53.5%/52.2%/57.2%). Lasts for 2 turns, or until damage is taken 2 times."
  },
  "skill_highlight": {
    "name": "Highlight",
    "element": "주원광역",
    "type": "디버프",
    "sp": 0,
    "cool": 4,
    "description": "Deal Curse damage to all foes equal to 146.4%/161.4%/155.4%/170.4% of Attack, and increase target's damage taken by 48.8%/53.8%/51.8%/56.8%. 30% chance to inflict Forget on foes for 2 turns."
  },
  "passive1": {
    "name": "Kung Fu Mastery",
    "element": "패시브",
    "description": "Increase Attack by 1% for every 2 points of Yaoling's Speed (up to 90.0%).",
    "cool": 0
  },
  "passive2": {
    "name": "Up to Chance",
    "element": "패시브",
    "description": "When attacking a foe with more than 50% HP, increase foe's Curse damage taken by 30.0%.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["야오링"] = {
  "name": "李 瑤鈴",
  "skill1": {
    "name": "黄泉の渡し",
    "element": "주원광역",
    "type": "디버프 중첩",
    "sp": 20,
    "cool": 0,
    "description": "敵全体に攻撃力73.2%/80.7%/77.7%/85.2%の呪怨属性ダメージを与え、２ターンの間、自身の速さ１０ごとに防御力を３%ずつ減少させる。減少させる最大値は49.7%/54.8%/53.5%/58.6%までとなる。さらに攻撃した敵１体ごとに『回想』を４つ獲得する。"
  },
  "skill2": {
    "name": "黄泉路に咲く花",
    "element": "주원",
    "type": "제어",
    "sp": 22,
    "cool": 0,
    "description": "敵単体に攻撃力97.6%/107.6%/103.6%/113.6%の呪怨属性ダメージを与える。敵が弱体状態の時は、さらにダメージが２０%上昇する。『孟婆湯』を消費した時は、選択した敵を２ターンの間、忘却状態にする。\n敵を忘却状態にした時、または行動異常の時、１ターンの間、自身の速さ１０ごとにその敵の被ダメージが２%ずつ上昇する（最大32.3%/32.3%/34.3%/34.3%まで）。"
  },
  "skill3": {
    "name": "泉下の獅子",
    "element": "주원광역",
    "type": "디버프",
    "sp": 24,
    "cool": 0,
    "description": "敵全体に攻撃力78.1%/86.1%/82.9%/90.9%の呪怨属性ダメージを与え、２ターンの間、『彼岸花』状態にする。『孟婆湯』を消費した時、『彼岸花』状態のダメージ上昇効果が２倍になる。\n『彼岸花』状態：自身の速さ１０ごとに、敵の被ダメージが３%ずつ上昇し、最大48.5%/53.5%/52.2%/57.2%まで上昇する。この効果は２ターン経過または２回ダメージを受けることで終了する。"
  },
  "skill_highlight": {
    "element": "주원광역",
    "type": "디버프",
    "sp": 0,
    "cool": 4,
    "description": "敵全体に攻撃力146.4%/161.4%/155.4%/170.4%の呪怨属性ダメージを与え、対象が次に受けるダメージを48.8%/53.8%/51.8%/56.8%上昇させる。さらに敵を３０%の確率で２ターンの間、忘却状態にする。"
  },
  "passive1": {
    "name": "功夫の極み",
    "element": "패시브",
    "description": "自身の速さ２ごとに自身の攻撃力が１%上昇する。最大90.0%まで上昇する。",
    "cool": 0
  },
  "passive2": {
    "name": "当たるも八卦",
    "element": "패시브",
    "description": "残りのＨＰが５０%以上の敵を攻撃した時、その敵に与える呪怨属性のダメージが30.0%上昇する。",
    "cool": 0
  }
};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.cnCharacterSkillsData["야오링"] = {
  "name": "李瑶铃",
  "skill1": {
    "name": "摆渡者",
    "element": "주원",
    "sp": 20,
    "cool": 0,
    "description": "对所有敌人造成73.2%/80.7%/77.7%/85.2%攻击力的诅咒属性伤害，自身每有10点速度，就使目标敌人的防御力降低3%，上限49.7%/54.8%/53.5%/58.6%，效果持续2回合。该技能每命中一个敌人，就使自身获得4点『回忆』。"
  },
  "skill2": {
    "name": "彼岸之丛",
    "element": "주원",
    "sp": 22,
    "cool": 0,
    "description": "对1名敌人造成97.6%/107.6%/103.6%/113.6%攻击力的诅咒属性伤害。若敌人带有任意减益效果，则使技能伤害提升20%。『孟婆汤』额外效果：使主目标有100%的基础概率陷入遗忘状态，效果持续2回合。若成功为添加遗忘状态或目标处于精神异常状态，则使其受到伤害提升，自身每有10点速度使敌人受到伤害提升2%，上限32.3%/32.3%/34.3%/34.3%，持续1回合。"
  },
  "skill3": {
    "name": "顽狮闹",
    "element": "주원",
    "sp": 24,
    "cool": 0,
    "description": "对所有敌人造成78.1%/86.1%/82.9%/90.9%攻击力的诅咒属性伤害，并使所有敌人获得『彼岸花』效果：自身每有10点速度，使敌人受到的伤害提升3%，上限48.5%/53.5%/52.2%/57.2%。该效果在受到2次伤害或2回合后清除。『孟婆汤』额外效果：『彼岸花』的增伤效果翻倍。"
  },
  "passive1": {
    "name": "嬉闹",
    "element": "패시브",
    "cool": 0,
    "description": "每有2点速度，则提升自身1%攻击力，通过这种方式最多提升90.0%攻击力。"
  },
  "passive2": {
    "name": "怒放",
    "element": "패시브",
    "cool": 0,
    "description": "使场上生命值高于50%的敌人受到的诅咒伤害提升30.0%。"
  },
  "skill_highlight": {
    "element": "주원",
    "cool": 4,
    "description": "对所有敌人造成146.4%/161.4%/155.4%/170.4%攻击力的诅咒属性伤害，并使所有敌人下一次受到的伤害提升48.8%/53.8%/51.8%/56.8%。有30%的基础概率使得所有敌人陷入遗忘状态，效果持续2回合。"
  }
};
