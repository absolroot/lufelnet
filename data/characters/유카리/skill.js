window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["유카리"] = {
  "name": "타케바 유카리",
  "skill1": {
    "name": "윈드 스톰",
    "element": "질풍",
    "type": "단일 피해",
    "sp": 23,
    "cool": 0,
    "description": "1명의 적에게 공격력 200.1%/220.6%/212.4%/232.9%의 질풍 속성 대미지를 주고 100%의 기본 확률로 목표를 풍습 상태에 빠지게 하며, 목표를 『바람의 흔적』 상태에 빠지게 한다. 2턴 동안 지속되며, 필드에는 동시에 1개의 『바람의 흔적』 상태만 존재할 수 있다. 『바람의 흔적』 상태의 적 사망 시, 『바람의 흔적』은 생명이 가장 높은 적에게로 전이된다.\n패시브: 아군 동료가 스킬 시전 시 임의 스킬 목표가 『바람의 흔적』을 보유하면 해당 스킬 공격력이 8.8%/9.7%/9.3%/10.2% 증가하고, 유카리의 공격력 100포인트마다 공격력이 0.72% 증가한다. 상한은 29.3%/32.3%/31.1%/34.1%이다."
  },
  "skill2": {
    "name": "바람의 추적자",
    "element": "버프광역",
    "type": "버프",
    "sp": 25,
    "cool": 0,
    "description": "모든 동료의 받는 대미지가 29.3%/32.3%/31.1%/34.1% 감소하며 3턴 동안 지속된다. 또한 메인 목표의 공격력이 7.8%/8.6%/8.3%/9.1% 증가하고, 자신의 공격력 100포인트마다 공격력이 0.78% 증가한다(상한 31.2%/34.4%/33.2%/36.4%). 자신의 공격력 100포인트마다 대미지가 0.24% 증가한다(상한 9.8%/10.8%/10.4%/11.4%). 효과는 2턴 동안 지속된다."
  },
  "skill3": {
    "name": "리바이브 애로",
    "element": "치료광역",
    "type": "광역 피해",
    "sp": 27,
    "cool": 0,
    "description": "모든 동료가 유카리 공격력 39.1%/43.1%/41.5%/45.6%+2507/3158/3081/3773의 생명을 회복한다. 모든 『바람의 언어』를 소모하며, 『바람의 언어』를 1중첩 소모할 때마다 스킬 메인 목표의 테우르기아 에너지를 17.5포인트 회복하며, 목표가 다음에 테우르기아를 사용한 후 2턴 동안 공격력이 29.3%/32.3%/31.1%/34.1% 증가한다(2회 중첩 가능). (회복한 테우르기아 에너지가 초과될 경우 해당 에너지는 잠시 저장되며, 목표가 테우르기아를 시전한 후 반환된다. 최대로 목표의 테우르기아 에너지 상한만큼 저장되며, 초과된 에너지는 최대 2턴 동안 저장된다). 만약 스킬 메인 목표가 S.E.E.S. 멤버가 아닌 경우, 『바람의 언어』를 1중첩 소모할 때마다 해당 목표가 다음 HIGHLIGHT 사용 시 총 대미지가 9.8%/10.8%/10.4%/11.4% 증가한다."
  },
  "skill_highlight": {
    "name": "사이클론 애로",
    "element": "질풍",
    "type": "",
    "description": "발동 조건: 테우르기아 에너지 70포인트\n1명의 적에게 공격력 406.0%/447.6%/431.0%/472.6%의 질풍 속성 대미지를 주고, 자신의 공격력 100포인트마다 아군 전체의 주는 대미지가 0.48% 증가한다(상한 19.5%/21.5%/20.7%/22.7%). 목표의 버프 효과 2개를 제거하고, 100%의 기본 확률로 목표가 풍습 상태에 빠지며, 목표가 『바람의 흔적』을 획득한다. 효과는 2턴 동안 지속된다.",
    "cool": 0
  },
  "skill_support": {
    "name": "지원 스킬",
    "element": "버프",
    "type": "",
    "description": "동료 1명의 상태 이상을 1개 정화한다.",
    "cool": 0
  },
  "passive1": {
    "name": "교감",
    "element": "패시브",
    "description": "타케바 유카리가 필드에 있을 때, 아군 전체의 HIGHLIGHT/테우르기아 대미지가 45.0% 증가한다. 임의의 동료가 HIGHLIGHT/테우르기아를 시전한 후, 2턴 동안 해당 동료의 대미지가 20.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "승부욕",
    "element": "패시브",
    "description": "전투 중 자신의 공격력 100포인트마다 최대 생명이 60포인트 증가하며, 상한은 2700이다.",
    "cool": 0
  }
};

window.enCharacterSkillsData["유카리"] = {
  "name": "Yukari Takeba",
  "skill1": {
    "name": "Gale Burst",
    "element": "질풍",
    "type": "단일 피해",
    "sp": 23,
    "cool": 0,
    "description": "Deal Wind damage to 1 foe equal to 200.1%/220.6%/212.4%/232.9% of Attack. Also, inflict Windswept and Erosion for 2 turns. Multiple foes cannot be inflicted with Erosion at the same time. If a foe with Erosion is defeated, Erosion is transferred to the foe with the highest HP.\nPassive: When an ally attacks a foe with a skill, if any target is inflicted with Erosion, increase that skill's Attack by 8.8%/9.7%/9.3%/10.2% + 0.72% for every 100 points of Yukari's Attack (up to a maximum of 29.3%/32.3%/31.1%/34.1%)."
  },
  "skill2": {
    "name": "Tailwind's Breath",
    "element": "버프광역",
    "type": "",
    "sp": 25,
    "cool": 0,
    "description": "Decrease party's damage taken by 29.3%/32.3%/31.1%/34.1% for 3 turns.\nAlso, increase the main target's Attack by 7.8%/8.6%/8.3%/9.1% + 0.78% for every 100 points of Yukari's Attack (up to a maximum of 31.2%/34.4%/33.2%/36.4%), and increase damage by 0.24% for every 100 points of Yukari's Attack (up to a maximum of 9.8%/10.8%/10.4%/11.4%) for 2 turns."
  },
  "skill3": {
    "name": "Arrow of Life",
    "element": "치료광역",
    "type": "",
    "sp": 27,
    "cool": 0,
    "description": "Restore HP to all allies equal to 39.1%/43.1%/41.5%/45.6% of Yukari's Attack + 2507/3158/3081/3773.\nSpend all Whisperwind stacks, and for each stack spent, increase the main target's Theurgy gauge by 17.5, and after the next time the target activates a Theurgy, increase Attack by 29.3%/32.3%/31.1%/34.1% for 2 turns. This effect stacks up to 2 times. If the Theurgy gauge is increased above the maximum, the amount above the maximum is temporarily reserved for up to 2 turns, and returned after the Theurgy is activated.\nIf the main target has a Highlight, the next time they activate a Highlight, increase final damage amplification by 9.8%/10.8%/10.4%/11.4% for every Whisperwind stack spent."
  },
  "skill_highlight": {
    "name": "Cyclone Arrow",
    "element": "질풍",
    "type": "",
    "description": "Can be activated when Theurgy gauge is at 70. Deal Wind damage to 1 foe equal to 406.0%/447.6%/431.0%/472.6% of Attack. Also, remove 2 buffs from the target, and inflict Windswept and Erosion.\nAlso, increase party's damage by 0.48% for every 100 points of Yukari's Attack (up to a maximum of 19.5%/21.5%/20.7%/22.7%) for 2 turns.",
    "cool": 0
  },
  "skill_support": {
    "name": "Assist",
    "element": "버프",
    "type": "",
    "description": "Remove 1 debuff from 1 ally.",
    "cool": 0
  },
  "passive1": {
    "name": "Tailwind's Air",
    "element": "패시브",
    "description": "When Yukari is present, increase party's Highlight and Theurgy damage by 45.0%. When an ally activates a Highlight or Theurgy, increase that ally's damage by 20.0% for 2 turns.",
    "cool": 0
  },
  "passive2": {
    "name": "Archer's Courage",
    "element": "패시브",
    "description": "During battle, increase max HP by 60 for every 100 points of Yukari's Attack (up to a maximum of 2700).",
    "cool": 0
  }
};

window.jpCharacterSkillsData["유카리"] = {
  "name": "岳羽 ゆかり",
  "skill1": {
    "name": "ゲイルバースト",
    "element": "질풍",
    "type": "단일 피해",
    "sp": 23,
    "cool": 0,
    "description": "敵単体に攻撃力200.1%/220.6%/212.4%/232.9%の疾風属性ダメージを与える。さらに２ターンの間、風襲と『ゲイルトラック』状態にする。複数の敵を同時に『ゲイルトラック』状態にすることはできない。『ゲイルトラック』状態の敵が戦闘不能になると、ＨＰが最も高い敵に『ゲイルトラック』状態が転移する。\n自動効果：味方がスキルで敵を攻撃する時、いずれかの対象が『ゲイルトラック』状態の場合、スキルの攻撃力が8.8%/9.7%/9.3%/10.2%＋ゆかりの攻撃力１００ごとに０.７２%上昇する（最大29.3%/32.3%/31.1%/34.1%まで）。"
  },
  "skill2": {
    "name": "追風の息吹",
    "element": "버프광역",
    "type": "",
    "sp": 25,
    "cool": 0,
    "description": "３ターンの間、味方全体の被ダメージが29.3%/32.3%/31.1%/34.1%低下する。\nさらに２ターンの間、選択した対象の攻撃力が7.8%/8.6%/8.3%/9.1%＋自身の攻撃力１００ごとに０.７８%上昇（最大31.2%/34.4%/33.2%/36.4%まで）し、与ダメージが自身の攻撃力１００ごとに０.２４%になるように上昇する（最大9.8%/10.8%/10.4%/11.4%まで）。"
  },
  "skill3": {
    "name": "リゲインアロー",
    "element": "치료광역",
    "type": "",
    "sp": 27,
    "cool": 0,
    "description": "味方全体のＨＰをゆかりの攻撃力39.1%/43.1%/41.5%/45.6%＋2507/3158/3081/3773回復する。\n『風の囁き』を全て消費して、消費した『風の囁き』１つごとに選択した対象のテウルギアゲージが１７.５増加し、その対象が次にテウルギアを発動した後、２ターンの間、攻撃力が29.3%/32.3%/31.1%/34.1%上昇する。この効果は最大２つまで累積できる。テウルギアゲージの上限を超過した増加分は、最大２ターンの間、対象のテウルギアゲージ上限値に相当する分まで一時的に蓄積され、テウルギアを発動した後に返還される。\n選択した対象がハイライトを持つ場合、その対象が次にハイライトを発動する時、消費した『風の囁き』１つごとに最終ダメージ増幅が9.8%/10.8%/10.4%/11.4%上昇する。"
  },
  "skill_highlight": {
    "name": "サイクロンアロー",
    "element": "질풍",
    "type": "",
    "description": "テウルギアゲージが７０の時に発動可能となり、敵単体に攻撃力406.0%/447.6%/431.0%/472.6%の疾風属性ダメージを与える。さらに対象の強化効果を２つ打ち消し、２ターンの間、風襲と『ゲイルトラック』状態にする。\nまた２ターンの間、味方全体の与ダメージがゆかりの攻撃力１００ごとに０.４８%になるように上昇する（最大19.5%/21.5%/20.7%/22.7%まで）。",
    "cool": 0
  },
  "skill_support": {
    "name": "アシスト",
    "element": "버프",
    "type": "",
    "description": "味方単体の弱体効果を１つ打ち消す。",
    "cool": 0
  },
  "passive1": {
    "name": "追い風のエール",
    "element": "패시브",
    "description": "自身が場にいる時、味方全体のハイライト／テウルギアの与ダメージが45.0%上昇する。味方がハイライト／テウルギアを発動した時、２ターンの間、その味方の与ダメージが20.0%上昇する。",
    "cool": 0
  },
  "passive2": {
    "name": "弓道の胆力",
    "element": "패시브",
    "description": "戦闘中、最大ＨＰが自身の攻撃力１００ごとに６０になるように上昇する（最大2700まで）。",
    "cool": 0
  }
};

window.cnCharacterSkillsData["유카리"] = {
  "name": "岳羽由加莉",
  "skill1": {
    "name": "疾风爆裂",
    "element": "질풍",
    "type": "单体伤害",
    "sp": 23,
    "cool": 0,
    "description": "对1名敌人造成200.1%/220.6%/212.4%/232.9%攻击力的疾风属性伤害，有100%基础概率使目标进入风袭状态，并使目标进入『风蚀』状态，持续2回合，场上同时只能存在1个『风蚀』状态。处于『风蚀』状态的敌人阵亡时，其『风蚀』会转移至生命值最高的敌人。\n被动：友方同伴释放技能时，若任意技能目标拥有『风蚀』，该技能攻击力提升8.8%/9.7%/9.3%/10.2%+由加莉每有100点攻击力提升0.72%，上限29.3%/32.3%/31.1%/34.1%。"
  },
  "skill2": {
    "name": "追风之息",
    "element": "버프광역",
    "type": "增益",
    "sp": 25,
    "cool": 0,
    "description": "使所有同伴受到伤害降低29.3%/32.3%/31.1%/34.1%，持续3回合；并使主目标攻击力提升7.8%/8.6%/8.3%/9.1%+自身每有100点攻击力提升0.78%，上限31.2%/34.4%/33.2%/36.4%，自身每有100点攻击力，伤害提升0.24%，上限9.8%/10.8%/10.4%/11.4%，持续2回合。"
  },
  "skill3": {
    "name": "复苏之矢",
    "element": "치료광역",
    "type": "群体伤害",
    "sp": 27,
    "cool": 0,
    "description": "为所有同伴恢复相当于由加莉攻击力39.1%/43.1%/41.5%/45.6%+2507/3158/3081/3773的生命值。消耗所有『风语』，每消耗1层『风语』，使技能主目标回复17.5点神通法能量，并使目标下一次使用神通法后攻击力提升29.3%/32.3%/31.1%/34.1%，持续2回合，上限2层。（回复的神通法能量溢出时会暂时缓存溢出的能量值，在目标释放神通法后返还，最多缓存相当于目标神通法能量上限的能量值，溢出的能量值最多缓存2回合）。若技能主目标为非S.E.E.S.成员，则改为每消耗1层『风语』，使其下一次使用HIGHLIGHT时总伤害增幅提升9.8%/10.8%/10.4%/11.4%。"
  },
  "skill_highlight": {
    "name": "龙卷箭",
    "element": "질풍",
    "type": "单体伤害",
    "description": "释放条件：70点神通法能量\n对1名敌人造成406.0%/447.6%/431.0%/472.6%攻击力的疾风属性伤害，自身每有100点攻击力使所有同伴造成伤害提升0.48%，上限19.5%/21.5%/20.7%/22.7%；驱散目标的2个增益效果，有100%基础概率使目标进入风袭状态，并使目标获得『风蚀』，持续2回合。",
    "cool": 0
  },
  "skill_support": {
    "name": "援助技能",
    "element": "버프",
    "type": "解除",
    "description": "为1名同伴净化一个异常状态。",
    "cool": 0
  },
  "passive1": {
    "name": "默契",
    "element": "패시브",
    "description": "岳羽由加莉在场时，所有同伴HIGHLIGHT/神通法伤害提升45.0%；任意同伴释放HIGHLIGHT/神通法后，该同伴伤害提升20.0%，持续2回合。",
    "cool": 0
  },
  "passive2": {
    "name": "好胜",
    "element": "패시브",
    "description": "战斗中，自身每有100点攻击力，最大生命值提升60点，上限2700。",
    "cool": 0
  }
};

