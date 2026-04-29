window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["쇼키"] = {
  "name": "이케나미 쇼키",
  "skill1": {
    "name": "빛나는 독백",
    "element": "축복",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "1명의 적에게 공격력 151.8%/167.3%/158.0%/173.5%의 축복 속성 대미지를 주고 모든 동료가 축복 효과를 2중첩 획득한다. 또한 모든 동료의 대미지가 증가하며(이케나미 쇼키의 공격력 100포인트마다 대미지 0.8% 증가, 최대 35.1%/38.7%/36.6%/40.2%) 2턴 동안 지속된다."
  },
  "skill2": {
    "name": "낯선 공간",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 2,
    "description": "자신을 제외한 동료 1명의 방어력이 증가하고(이케나미 쇼키의 공격력 100포인트마다 방어력 0.83% 증가, 최대 36.6%/40.4%/38.1%/41.8%), 목표가 일부 정신 이상 효과(현기증, 수면, 혼란, 망각)에 면역되며 2턴 동안 지속된다.\n쿨타임: 2턴."
  },
  "skill3": {
    "name": "별들의 공연",
    "element": "버프광역",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "모든 동료의 공격력이 증가하며(증가 값은 자신의 공격력의 15%, 상한 569/627/592/650) 2턴 동안 지속된다.\n자신의 현재 『즉흥 공연』 상태에 따라 스킬 메인 목표가 추가 효과를 획득한다.\n『즉흥·침투』: 2턴 동안 스킬 메인 목표의 지속 대미지 효과가 14.0%/15.4%/14.5%/16.0% 증가하고, 효과 명중이 30% 증가한다.\n『즉흥·전복』: 2턴 동안 스킬 메인 목표의 스킬 마스터가 655/723/682/749 증가하고, TECHNICAL을 줄 시 공격력이 20% 증가한다.\n『즉흥·공감』: 2턴 동안 스킬 메인 목표의 크리티컬 효과가 24.4%/26.9%/25.4%/27.9% 증가한다.\n『즉흥·교감』: 2턴 동안 스킬 메인 목표의 관통이 12.0%/13.2%/12.5%/13.7% 증가한다."
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "버프",
    "description": "모든 동료의 공격력이 증가하고(증가 값은 자신의 공격력의 6.5%, 상한 284/314/296/325), 효과 저항이 82.0%/90.4%/85.3%/93.7% 증가한다. 효과는 2턴 동안 지속된다. 또한 모든 동료가 축복 효과를 1중첩 획득한다.",
    "cool": 4
  },
  "passive1": {
    "name": "본색",
    "element": "패시브",
    "description": "축복 효과를 보유한 아군 동료의 경우, 축복 중첩당 대미지가 5% 증가하고, 상한은 25.0%이다.",
    "cool": 0
  },
  "passive2": {
    "name": "반전",
    "element": "패시브",
    "description": "자신의 효과 명중 1%마다 공격력이 0.72% 증가하며, 상한은 72.0%이다.",
    "cool": 0
  }
};

window.enCharacterSkillsData["쇼키"] = {
  "name": "Shoki Ikenami",
  "skill1": {
    "name": "Followspot",
    "element": "축복",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Bless damage to 1 foe equal to 151.8%/167.3%/158.0%/173.5% of Attack.\nAlso, grant 2 Blessing stacks to all allies, and for 2 turns, increase damage by 0.8% for every 100 points of Shoki's Attack (up to a maximum of 35.1%/38.7%/36.6%/40.2%)."
  },
  "skill2": {
    "name": "Adlib",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 2,
    "description": "Increase Defense of 1 ally except Shoki by 0.83% for every 100 points of Shoki's Attack (up to a maximum of 36.6%/40.4%/38.1%/41.8%), and nullify Dizzy, Sleep, Confuse, and Forget. Lasts for 2 turns.\nCooldown: 2 turns."
  },
  "skill3": {
    "name": "Improvise",
    "element": "버프광역",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "Increase party's Attack by 15% of Shoki's Attack (up to a maximum of 569/627/592/650) for 2 turns.\nAlso, based on Shoki's Improv state, grant the following additional effect to the main target.\nBlazing Passion: Increase the main target's continuous damage effect by 14.0%/15.4%/14.5%/16.0%, and increase ailment accuracy by 30% for 2 turns.\nChilling Intensity: Increase the main target's Technical Precision by 655/723/682/749 for 2 turns. Also, when activating a technical, increase Attack by 20%.\nElectrifying Performance: Increase the main target's critical damage by 24.4%/26.9%/25.4%/27.9% for 2 turns.\nTempestuous Drama: Increase the main target's pierce rate by 12.0%/13.2%/12.5%/13.7% for 2 turns."
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "버프",
    "description": "Increase party's Attack by 6.5% of Shoki's Attack (up to a maximum of 284/314/296/325), and increase ailment resistance by 82.0%/90.4%/85.3%/93.7% for 2 turns.\nAlso, grant 1 Blessing stack.",
    "cool": 4
  },
  "passive1": {
    "name": "Supporting Role",
    "element": "패시브",
    "description": "When allies gain a Blessing, increase damage by 5% for each Blessing stack (up to a maximum of 25.0%).",
    "cool": 0
  },
  "passive2": {
    "name": "Method Acting",
    "element": "패시브",
    "description": "Increase Attack by 0.72% for every 1% of Shoki's ailment accuracy (up to a maximum of 72.0%).",
    "cool": 0
  }
};

window.jpCharacterSkillsData["쇼키"] = {
  "name": "池波 星輝",
  "skill1": {
    "name": "ピンスポットライト",
    "element": "축복",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "敵単体に攻撃力151.8%/167.3%/158.0%/173.5%の祝福属性ダメージを与える。\nさらに味方全体に祝印を２つ付与し、２ターンの間、与ダメージが星輝の攻撃力１００ごとに０.８%になるように（最大35.1%/38.7%/36.6%/40.2%まで）上昇する。"
  },
  "skill2": {
    "name": "アドリブフォロー",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 2,
    "description": "２ターンの間、自身以外の味方単体の防御力を星輝の攻撃力１００ごと０.８３%になるように（最大36.6%/40.4%/38.1%/41.8%まで）上昇させ、目眩・睡眠・混乱・忘却を無効化する。\nクールタイム：２ターン"
  },
  "skill3": {
    "name": "インプロヴァイズ",
    "element": "버프광역",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "２ターンの間、味方全体の攻撃力が星輝の攻撃力の１５%分（最大569/627/592/650まで）上昇する。\nさらに自身の『即興劇』状態に応じて、選択した対象に追加効果を付与する。\n『紅蓮の熱演』：２ターンの間、選択した対象の持続ダメージ効果が14.0%/15.4%/14.5%/16.0%上昇し、状態異常命中が３０%上昇する。\n『冴氷の静演』：２ターンの間、選択した対象のテクニカル精度が655/723/682/749上昇する。さらにテクニカルが発生する時、攻撃力が２０%上昇する。\n『稲妻の烈演』：２ターンの間、選択した対象のクリティカルダメージが24.4%/26.9%/25.4%/27.9%上昇する。\n『晴嵐の快演』：２ターンの間、選択した対象の貫通が12.0%/13.2%/12.5%/13.7%上昇する。"
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "버프",
    "description": "２ターンの間、味方全体の攻撃力が星輝の攻撃力の６.５%（最大284/314/296/325まで）上昇し、状態異常抵抗が82.0%/90.4%/85.3%/93.7%上昇する。\nさらに祝印を１つ付与する。",
    "cool": 4
  },
  "passive1": {
    "name": "舞台共演",
    "element": "패시브",
    "description": "祝印を獲得している味方は、祝印１つごとに与ダメージが５%（最大25.0%まで）上昇する。",
    "cool": 0
  },
  "passive2": {
    "name": "迫真の演技",
    "element": "패시브",
    "description": "自身の状態異常命中１%ごとに、攻撃力が０.７２%になるように（最大72.0%まで）上昇する。",
    "cool": 0
  }
};

window.cnCharacterSkillsData["쇼키"] = {
  "name": "池波星辉",
  "skill1": {
    "name": "聚光独白",
    "element": "축복",
    "type": "单体伤害",
    "sp": 20,
    "cool": 0,
    "description": "对1名敌人造成151.8%/167.3%/158.0%/173.5%攻击力的祝福属性伤害，使所有同伴获得2层祝福效果，并使所有同伴伤害提升（每100点池波星辉的攻击力提供0.8%伤害加成，上限35.1%/38.7%/36.6%/40.2%），持续2回合。"
  },
  "skill2": {
    "name": "间离之所",
    "element": "버프",
    "type": "增益",
    "sp": 24,
    "cool": 2,
    "description": "使除自身以外的1名同伴防御力提升（每100点池波星辉的攻击力提供0.83%防御力加成，上限36.6%/40.4%/38.1%/41.8%），并使目标免疫部分精神异常效果（眩晕、睡眠、混乱、遗忘），持续2回合。\n冷却时间：2回合。"
  },
  "skill3": {
    "name": "繁星共演",
    "element": "버프광역",
    "type": "增益",
    "sp": 24,
    "cool": 0,
    "description": "使所有同伴攻击力提升（数值相当于自身攻击力的15%，上限569/627/592/650），持续2回合。\n根据自身当前的『即兴表演』状态，使技能主目标获得额外效果。\n『即兴·渗透』：使技能主目标持续伤害效果提升14.0%/15.4%/14.5%/16.0%，效果命中提升30%，持续2回合。\n『即兴·颠覆』：使技能主目标技巧精通提升655/723/682/749，造成TECHNICAL时攻击力提升20%，持续2回合。\n『即兴·共情』：使技能主目标暴击效果提升24.4%/26.9%/25.4%/27.9%，持续2回合。\n『即兴·感应』：使技能主目标穿透提升12.0%/13.2%/12.5%/13.7%，持续2回合。"
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "增益",
    "description": "使所有同伴攻击力提升(数值相当于自身攻击力的6.5%，上限284/314/296/325），效果抵抗提升82.0%/90.4%/85.3%/93.7%，持续2回合，并使所有同伴获得1层祝福效果。",
    "cool": 4,
    "name": "HIGHLIGHT"
  },
  "passive1": {
    "name": "本色",
    "element": "패시브",
    "description": "拥有祝福效果的友方同伴，每层祝福使其伤害提升5%，上限25.0%。",
    "cool": 0
  },
  "passive2": {
    "name": "反转",
    "element": "패시브",
    "description": "自身每有1%的效果命中，攻击力提升0.72%，上限72.0%。",
    "cool": 0
  }
};

