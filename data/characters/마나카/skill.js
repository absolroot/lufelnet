window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["마나카"] = {
  "name": "나가오 마나카",
  "skill1": {
    "name": "천공의 노래",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "준비 시간: 행동 4회\n모든 동료의 주는 대미지가 7.0%/7.7%/7.8%/8.5%+(나가오 마나카의 공격력 164포인트당 1%의 대미지 보너스 추가 제공, 최대 28.0%/30.8%/31.4%/34.2% 추가) 증가하며 2턴 동안 지속된다. 자신이 『성가』를 4중첩 획득한다."
  },
  "skill2": {
    "name": "치유 빛의 노래",
    "element": "치료광역",
    "type": "치료",
    "cool": 8,
    "description": "준비 시간: 8회 행동\n아군 전체가 공격력 10.0%/10.0%/11.2%/11.2%+681/816/989/1124의 생명을 회복하고, 아군 전체의 디버프 상태 1개를 정화한다. 『성가』 보유 시 『성가』를 1중첩 소모하여 해당 스킬 시전 후 필요한 준비 시간을 1회 행동만큼 감소시킨다. 이러한 방식으로 준비 시간을 최대 4회 행동만큼 감소시킬 수 있다. 해당 스킬을 액티브로 시전 시 치료량이 50% 증가한다.\n패시브: 전투 중 나가오 마나카가 『성가』를 12중첩 획득할 때마다 해당 스킬의 치료 효과를 자동으로 1회 시전한다."
  },
  "skill3": {
    "name": "시공의 윤회",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "준비 시간: 행동 4회\n모든 동료의 공격력이 나가오 마나카 공격력의 11%+128/140/143/156만큼 증가한다. 모든 『성가』를 소모하며, 『성가』를 1중첩 소모할 때마다 2턴 동안 모든 동료의 관통이 증가하고(나가오 마나카의 공격력 460포인트마다 관통 0.1% 증가), 공격력이 증가한다(나가오 마나카의 공격력 460포인트마다 공격력 0.1% 증가). (해당 스킬은 최대 나가오 마나카의 공격력 4600/5060/5980/6440포인트까지 계산)"
  },
  "skill_highlight": {
    "name": "속성 증가",
    "element": "패시브",
    "description": "해명 괴도 각 속성의 20%만큼 출전 중인 모든 동료의 상응한 속성 수치가 증가한다."
  },
  "passive1": {
    "name": "날갯짓",
    "element": "패시브",
    "description": "『천계의 선율』 상태인 동료의 공격력이 37.5% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "결심",
    "element": "패시브",
    "description": "누적 획득한 『성가』 중첩 수에 따라 중첩당 모든 동료의 관통이 1.0% 증가한다(최대 12중첩 적용).",
    "cool": 0
  }
};

window.enCharacterSkillsData["마나카"] = {
  "name": "Manaka Nagao",
  "skill1": {
    "name": "Winged Canon",
    "element": "버프광역",
    "type": "버프",
    "cool": 0,
    "description": "Increase party's damage by 7.0%/7.7%/7.8%/8.5% for 2 turns (for every 164 points of Manaka's Attack, increase by 1% more, up to a maximum of 28.0%/30.8%/31.4%/34.2%).\nAlso, gain 4 Musical Note stacks.\nCooldown Time: 4 ally actions"
  },
  "skill2": {
    "name": "Prayer Refrain",
    "element": "치료광역",
    "type": "치료",
    "cool": 0,
    "description": "Restore HP to party equal to 10.0%/10.0%/11.2%/11.2% of Manaka's Attack + 681/816/989/1124, and remove 1 debuff.\nWhen Manaka has Musical Note, spend 1 Musical Note stack, and reduce skill cooldown by 1 action. (this effect can reduce cooldowns by up to 4 actions).\nIf this skill is selected and used, increase healing by 50%.\nCooldown Time: 8 ally actions\nAutomatic Effect: For every 12 Musical Note stacks gained during battle, activate this skill's healing effect 1 time."
  },
  "skill3": {
    "name": "Melody of Steps",
    "element": "버프광역",
    "type": "버프",
    "cool": 0,
    "description": "Increase party's Attack by 11% of Manaka's Attack + 128/140/143/156 for 2 turns.\nSpend all Musical Note stacks, and for each stack spent, increase party's pierce rate by 0.1% for every 460 points of Manaka's Attack, and increase party's Attack by 0.1% for every 460 points of Manaka's Attack. Lasts for 2 turns.\nThis skill applies up to 4600/5060/5980/6440 of Manaka's Attack.\nCooldown Time: 4 ally actions"
  },
  "skill_highlight": {
    "name": "Stat Buff",
    "element": "패시브",
    "description": "Increase party's stats by 20% of Manaka's stats."
  },
  "passive1": {
    "name": "Crescendo",
    "element": "패시브",
    "description": "Increase Attack of allies with Da Capo by 37.5%.",
    "cool": 0
  },
  "passive2": {
    "name": "Heavenly Voice",
    "element": "패시브",
    "description": "Based on the total number of Musical Note stacks gained, increase party's pierce rate by 1.0% for each stack. Counts up to 12 stacks.",
    "cool": 0
  }
};

window.jpCharacterSkillsData["마나카"] = {
  "name": "長尾 愛歌",
  "skill1": {
    "name": "翼のカノン",
    "element": "버프광역",
    "type": "버프",
    "cool": 0,
    "description": "２ターンの間、味方全体の与ダメージが7.0%/7.7%/7.8%/8.5%上昇し、追加で愛歌の攻撃力１６４ごとに１%になるように上昇（追加上昇分は最大28.0%/30.8%/31.4%/34.2%まで）する。\nさらに『音符』を４つ獲得する。\nクールタイム：味方の行動４回"
  },
  "skill2": {
    "name": "祈りのリフレイン",
    "element": "치료광역",
    "type": "치료",
    "cool": 0,
    "description": "味方全体のＨＰを愛歌の攻撃力10.0%/10.0%/11.2%/11.2%＋681/816/989/1124回復し、さらに弱体を１つ打ち消す。\n『音符』を獲得している時、『音符』を１つ消費して、スキル使用後のクールタイムを１行動分減少させる（この効果で減少できるのは最大４行動まで）。\nこのスキルを選択して使用した場合は回復量が５０%上昇する。\nクールタイム：味方の行動８回\n自動効果：戦闘中『音符』を１２個獲得するごとに、このスキルの回復効果が１回発動する。"
  },
  "skill3": {
    "name": "歩みの旋律",
    "element": "버프광역",
    "type": "버프",
    "cool": 0,
    "description": "２ターンの間、味方全体の攻撃力が愛歌の攻撃力１１%＋128/140/143/156上昇する。\n『音符』を全て消費して、２ターンの間、消費した『音符』１つごとに、味方全体の貫通が愛歌の攻撃力４６０ごとに０.１%になるように上昇し、攻撃力が愛歌の攻撃力４６０ごとに０.１%になるように上昇する。\nこのスキルが参照する愛歌の攻撃力は最大4600/5060/5980/6440まで。\nクールタイム：味方の行動４回"
  },
  "skill_highlight": {
    "name": "ステータス強化",
    "element": "패시브",
    "description": "長尾のステータスの20%分、味方全体のステータスを上昇させる。"
  },
  "passive1": {
    "name": "クレッシェンド",
    "element": "패시브",
    "description": "『ダ・カーポ』状態の味方の攻撃力が37.5%上昇する。",
    "cool": 0
  },
  "passive2": {
    "name": "天まで届く声",
    "element": "패시브",
    "description": "獲得した『音符』の総数に応じて、１つごとに味方全体の貫通が1.0%上昇する。最大１２個まで適用される。",
    "cool": 0
  }
};

window.cnCharacterSkillsData["마나카"] = {
  "name": "长尾爱歌",
  "skill1": {
    "name": "群鸽于圣堂和鸣",
    "element": "버프광역",
    "type": "增益",
    "cool": 4,
    "description": "准备时间：4次行动\n使所有同伴造成伤害提升7.0%/7.7%/7.8%/8.5%+（每164点长尾爱歌的攻击力额外提供1%伤害加成，最多额外提供28.0%/30.8%/31.4%/34.2%伤害加成），效果持续2回合。自身获得4层『圣歌』。"
  },
  "skill2": {
    "name": "华光下的治愈诗",
    "element": "치료광역",
    "type": "治疗",
    "cool": 8,
    "description": "准备时间：8次行动\n使所有同伴恢复10.0%/10.0%/11.2%/11.2%攻击力+681/816/989/1124的生命值，并为所有同伴净化1种负面状态。拥有『圣歌』时，会消耗1层『圣歌』使释放该技能后所需的准备时间减少1次行动，通过这种方式最多使准备时间减少4次行动。主动释放该技能时，治疗量提升50%。\n被动：战斗中，长尾爱歌每获得12层『圣歌』，会自动释放一次该技能的治疗效果。"
  },
  "skill3": {
    "name": "贯穿时空的轮转",
    "element": "버프광역",
    "type": "增益",
    "cool": 4,
    "description": "准备时间：4次行动\n使所有同伴攻击力提升，数值相当于长尾爱歌攻击力的11%+128/140/143/156。消耗所有『圣歌』，每消耗1层『圣歌』，使所有同伴穿透提升（每460点长尾爱歌的攻击力提供0.1%穿透），攻击力提升（每460点长尾爱歌的攻击力提供0.1%攻击力），效果持续2回合。（该技能最多计入长尾爱歌4600/5060/5980/6440点攻击力）"
  },
  "skill_highlight": {
    "name": "属性提升",
    "element": "패시브",
    "description": "在场所有同伴的对应属性值提升，提升量相当于解明怪盗各属性的20%。"
  },
  "passive1": {
    "name": "翩然",
    "element": "패시브",
    "description": "处于『千籁重歌』的同伴，攻击力提升37.5%。",
    "cool": 0
  },
  "passive2": {
    "name": "韧心",
    "element": "패시브",
    "description": "根据累积获得的『圣歌』层数，每层使所有同伴穿透提升1.0%，最多计入12层。",
    "cool": 0
  }
};

