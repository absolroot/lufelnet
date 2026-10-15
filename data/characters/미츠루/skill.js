window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["미츠루"] = {
  "name": "키리조 미츠루",
  "skill1": {
    "name": "찬란한 얼음꽃",
    "element": "빙결",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "1명의 적에게 공격력 211.2%/232.8%/224.2%/245.8%의 빙결 속성 대미지를 주고, 추가로 『서리 결정』을 3중첩 추가한다. 동시에 2턴 동안 해당 적의 방어력을 감소시킨다(키리조 미츠루의 공격력 300포인트마다 방어력 1.2%*『서리 결정』 중첩 수만큼 감소하며, 최대 2928/3228/3108/3408포인트 공격력까지 계산)."
  },
  "skill2": {
    "name": "혹한의 폭풍",
    "element": "디버프",
    "type": "버프",
    "sp": 0,
    "cool": 0,
    "description": "1명의 적을 『여왕의 응시』 상태에 빠뜨리며, 방어력이 7.8%/8.6%/8.3%/9.1% 감소하고(키리조 미츠루의 공격력 300포인트마다 방어력이 추가로 3.2% 감소하며, 최대 2928/3228/3108/3408포인트 공격력까지 계산), 받는 대미지가 증가하며(키리조 미츠루의 공격력 300포인트마다 받는 대미지가 2% 증가하며, 최대 2928/3228/3108/3408포인트 공격력까지 계산), 해당 전투 동안 영구적으로 지속된다. 『여왕의 응시』는 필드에 단 하나만 존재하며, 새로운 목표를 선택하여 시전하면 『여왕의 응시』가 새로운 목표로 전이된다. 『여왕의 응시』 상태인 적이 사망하면 『여왕의 응시』가 자동으로 현재 필드에서 생명이 가장 높은 적에게로 전이된다. 『여왕의 응시』 전이 시, 키리조 미츠루가 추가한 모든 상태 이상도 동시에 전이된다. 이 스킬 사용 후 해당 턴에서 다른 스킬을 사용할 수 있으며, 해당 스킬은 페르소나 스킬로 간주하지 않는다."
  },
  "skill3": {
    "name": "프로스트 피어스",
    "element": "빙결",
    "type": "단일 피해",
    "sp": 24,
    "cool": 0,
    "description": "2턴 동안 해명 괴도 각 속성의 3%만큼 출전 중인 아군 전체의 상응하는 속성 수치가 증가한다. 이후 1명의 적에게 공격력 345.1%/380.5%/366.3%/401.7%의 빙결 속성 대미지를 주며, 목표의 『서리 결정』 1중첩마다 스킬 대미지가 10% 증가하고, 목표의 『서리 결정』이 5중첩에 도달하면 이 스킬은 추가로 크리티컬 확률이 15% 증가한다."
  },
  "skill_highlight": {
    "name": "블리자드 에지",
    "element": "빙결",
    "cool": 0,
    "description": "시전 조건: 테우르기아 에너지 70포인트\n1명의 적에게 공격력 362.3%/399.4%/384.6%/421.7%의 빙결 속성 대미지를 주고, 2턴 내에 목표의 『서리 결정』을 『혹한 결정』으로 강화한다. 아군이 페르소나 스킬로 『혹한 결정』 상태의 적 공격 시, 키리조 미츠루의 『냉혈의 칼날』이 발동되어 목표에게 공격력 19.5%/21.5%/20.7%/22.7%*『서리 결정』 중첩 수에 해당하는 추가 대미지를 1회 준다."
  },
  "skill_support": {
    "name": "지원 스킬",
    "element": "버프",
    "cool": 0,
    "description": "1명의 적에게 2턴 동안 지속되는 『에너지 표식』을 추가한다. 테우르기아를 보유한 동료가 해당 적을 처음 공격할 때 해당 동료의 테우르기아 에너지를 35포인트 회복한다. HIGHLIGHT를 보유한 동료가 해당 적을 처음 공격할 때 HIGHLIGHT 에너지를 15% 회복한다."
  },
  "passive1": {
    "name": "책임",
    "element": "패시브",
    "cool": 0,
    "description": "해명 괴도의 초기 준비 시간이 4회 행동만큼 감소한다."
  },
  "passive2": {
    "name": "질서",
    "element": "패시브",
    "cool": 0,
    "description": "키리조 미츠루가 필드에 있으면 모든 반항 또는 지배 캐릭터가 『서리 결정』을 보유한 적 공격 시 『서리 결정』 중첩 수*4.8%의 대미지 증가를 획득한다."
  }
};

window.enCharacterSkillsData["미츠루"] = {
  "name": "Mitsuru Kirijo",
  "skill1": {
    "name": "Flower of Ice",
    "element": "빙결",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Ice damage to 1 foe equal to 211.2%/232.8%/224.2%/245.8% of Attack.\nInflict 3 Frostbound stacks on the target, and for every 300 of Mitsuru's Attack, decrease the target's Defense by 1.2% times the amount of Frostbound stacks for 2 turns (up to 2928/3228/3108/3408 of Attack)."
  },
  "skill2": {
    "name": "Frozen Tempest",
    "element": "버프",
    "type": "단일피해",
    "sp": 0,
    "description": "Inflict Imperious Queen on 1 foe.\nDecrease target's Defense by 7.8%/8.6%/8.3%/9.1%, and decrease Defense by 3.2% more for every 300 of Mitsuru's Attack (up to 2928/3228/3108/3408 of Attack). Also, increase damage taken by 2% for every 300 of Mitsuru's Attack (up to 2928/3228/3108/3408 of Attack). These effects are permanent.\nImperious Queen can only be active on 1 target at a time and will automatically transfer to the new target whenever this skill is used. When a target with Imperious Queen is KO'd, it will transfer to the foe with the highest HP, and all debuffs inflicted by Mitsuru will also transfer.\nAfter using this skill, Mitsuru can use another skill in the same turn (this skill does not count as a normal skill).",
    "cool": 0
  },
  "skill3": {
    "name": "Snowpierced Waltz",
    "element": "빙결",
    "type": "단일피해",
    "sp": 24,
    "cool": 0,
    "description": "Increase party's stats by 3% of Elucidator's stats for 2 turns.\nDeal Ice damage to 1 foe equal to 345.1%/380.5%/366.3%/401.7% of Attack. For every Frostbound stack, increase skill damage by 10%. Additionally, when the target has 5 or more Frostbound stacks, increase this skill's damage by 35% and increase critical rate of this skill by 15%."
  },
  "skill_highlight": {
    "name": "Blizzard Edge",
    "element": "빙결",
    "type": "단일피해",
    "description": "Can be activated when Theurgy gauge is at 70. Deal Ice damage to 1 foe equal to 362.3%/399.4%/384.6%/421.7% of Attack, and for 2 turns, evolve Frostbound stacks on the target to Snowbound and increase damage taken by 19.5%/21.5%/20.7%/22.7%.\nWhen an ally uses a skill to attack a foe inflicted with Snowbound, activate Iceblade 1 time, dealing damage equal to 22.0%/24.2%/23.3%/25.6% of that ally's Attack for every Frostbound stack on the target.",
    "cool": 0
  },
  "skill_support": {
    "name": "Assist",
    "element": "버프",
    "type": "버프",
    "description": "Inflict Charged Mark on 1 foe for 2 turns.\nThe first time that each ally attacks a foe inflicted with Charged Mark, increase the Theurgy gauge by 35 if that ally has a Theurgy, or increase the Highlight gauge by 15% if that ally has a Highlight.",
    "cool": 0
  },
  "passive1": {
    "name": "Pre-Navigator",
    "element": "패시브",
    "description": "Decrease any Elucidator's first cooldown time by 4 actions.",
    "cool": 0
  },
  "passive2": {
    "name": "Freeze Mark",
    "element": "패시브",
    "description": "If Mitsuru is on the field, when Assassin and Sweeper allies attack foes inflicted with Frostbound, increase damage by 4.8% times the number of Frostbound stacks.",
    "cool": 0
  }
};

window.jpCharacterSkillsData["미츠루"] = {
  "name": "桐条 美鶴",
  "skill1": {
    "name": "華麗なる氷花",
    "element": "빙결",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "敵単体に攻撃力211.2%/232.8%/224.2%/245.8%の氷結属性ダメージを与える。\n２ターンの間、対象に『細氷』を３つ付与し、防御力が美鶴の攻撃力３００ごとに１.２%×『細氷』の累積数分になるように低下する（最大で攻撃力2928/3228/3108/3408分まで）。"
  },
  "skill2": {
    "name": "フリーズテンペスト",
    "element": "버프",
    "type": "버프",
    "sp": 0,
    "cool": 0,
    "description": "敵単体を『女王の先導』状態にする。\n対象の防御力が7.8%/8.6%/8.3%/9.1%低下し、追加で防御力が自身の攻撃力３００ごとに３.２%になるように低下する（最大で攻撃力2928/3228/3108/3408分まで）。さらに被ダメージが美鶴の攻撃力３００ごとに２%になるように上昇する（最大で攻撃力2928/3228/3108/3408分まで）。この効果は永続する。\n複数の敵を同時に『女王の先導』状態にすることはできず、このスキルを他の対象に使用した場合、『女王の先導』はその対象に転移する。『女王の先導』状態の敵が戦闘不能になると、ＨＰが最も高い敵に『女王の先導』状態が転移する。『女王の先導』が転移する時、美鶴が付与したすべての弱体状態も同時に転移する。\nこのスキルを使用した後も同ターン内に他のスキルを使用できる（このスキルは通常のスキルとして扱わない）。"
  },
  "skill3": {
    "name": "氷舞の刺撃",
    "element": "빙결",
    "type": "단일피해",
    "sp": 24,
    "cool": 0,
    "description": "２ターンの間、味方全体のステータスが『解明』ロールの味方のステータスの３%分上昇する。\n敵単体に攻撃力345.1%/380.5%/366.3%/401.7%の氷結属性ダメージを与え、対象の『細氷』１つごとに、スキルダメージが１０%上昇する。さらに『細氷』が５つ以上の時、スキルダメージが３５%上昇し、クリティカル率が１５%上昇する。"
  },
  "skill_highlight": {
    "name": "ブリザードエッジ",
    "element": "빙결",
    "type": "단일피해",
    "description": "テウルギアゲージが７０の時に発動可能となり、敵単体に攻撃力362.3%/399.4%/384.6%/421.7%の氷結属性ダメージを与え、２ターンの間、対象の『細氷』を『厳寒の細氷』に強化し、被ダメージが19.5%/21.5%/20.7%/22.7%上昇する。\n味方がスキルで『厳寒の細氷』を付与されている敵を攻撃した時、『細氷剣』が発動し、対象に『細氷』の累積数×その味方の攻撃力22.0%/24.2%/23.3%/25.6%のダメージを１回与える。",
    "cool": 0
  },
  "skill_support": {
    "name": "アシスト",
    "element": "버프",
    "type": "버프",
    "description": "敵単体に２ターンの間、『チャージマーカー』を付与する。\nそれぞれの味方が『チャージマーカー』を付与されている敵を初めて攻撃した時、テウルギアを持つ味方はテウルギアゲージが３５増加し、ハイライトを持つ味方はハイライトゲージが１５%増加する。",
    "cool": 0
  },
  "passive1": {
    "name": "プレナビゲーター",
    "element": "패시브",
    "description": "『解明』ロールの初期クールタイムが4行動分減少する。",
    "cool": 0
  },
  "passive2": {
    "name": "細氷の目印",
    "element": "패시브",
    "description": "自身が場にいる間、『反抗』または『支配』ロールの味方が『細氷』を付与されている敵を攻撃する時、そのダメージが『細氷』の累積数×4.8%分上昇する。",
    "cool": 0
  }
};

window.cnCharacterSkillsData["미츠루"] = {
  "name": "桐条美鹤",
  "skill1": {
    "name": "绚烂冰华",
    "element": "빙결",
    "type": "单体伤害",
    "sp": 20,
    "cool": 0,
    "description": "对1名敌人造成211.2%/232.8%/224.2%/245.8%攻击力的冰冻属性伤害，额外为其添加3层『霜结』，并使其防御力降低（桐条美鹤每有300点攻击力，防御力降低1.2%*『霜结』层数，最多计入2928/3228/3108/3408点攻击力），持续2回合。"
  },
  "skill2": {
    "name": "极寒风暴",
    "element": "디버프",
    "type": "增益",
    "sp": 0,
    "cool": 0,
    "description": "使1名敌人陷入『女王凝视』状态，防御力降低7.8%/8.6%/8.3%/9.1%（桐条美鹤每有300点的攻击力，防御力额外降低3.2%，最多计入2928/3228/3108/3408点攻击力），受到伤害提升（桐条美鹤每有300点的攻击力，受到伤害提升2%，最多计入2928/3228/3108/3408点攻击力），本场战斗永久生效。『女王凝视』全场唯一，选择新目标释放时，会将『女王凝视』转移至新目标。若处于『女王凝视』状态的敌人死亡时，『女王凝视』会自动转移至当前场上生命值最高的敌人。『女王凝视』转移时，会同时转移桐条美鹤添加的所有异常状态。使用该技能后本回合仍可使用其他技能，该技能不视为人格面具技能。"
  },
  "skill3": {
    "name": "冰之舞刺击",
    "element": "빙결",
    "type": "单体伤害",
    "sp": 24,
    "cool": 0,
    "description": "根据解明怪盗各属性的3%，提升在场的所有同伴的相应属性值，持续2回合。而后对1名敌人造成345.1%/380.5%/366.3%/401.7%攻击力的冰冻属性伤害，目标每有1层『霜结』，技能伤害提升10%，目标『霜结』达到5层时，技能额外获得15%的暴击率提升。"
  },
  "skill_highlight": {
    "name": "暴雪利刃",
    "element": "빙결",
    "cool": 0,
    "description": "释放条件：70点神通法能量\n对1名敌人造成362.3%/399.4%/384.6%/421.7%攻击力的冰冻属性伤害，在2回合内将目标的『霜结』强化为『寒霜结』。友方同伴使用人格面具技能攻击处于『寒霜结』状态下的敌人时，触发桐条美鹤的『冷血之刃』，对目标额外造成1次『霜结』层数*19.5%/21.5%/20.7%/22.7%攻击力的伤害。",
    "type": "单体伤害"
  },
  "skill_support": {
    "name": "援助技能",
    "element": "버프",
    "cool": 0,
    "description": "使1名敌人获得持续2回合的『能量标记』。每名拥有神通法的同伴首次攻击该名敌人时，该同伴回复35点神通法能量；每名拥有HIGHLIGHT的同伴首次攻击该名敌人时，回复15%的HIGHLIGHT能量。",
    "type": "增益"
  },
  "passive1": {
    "name": "责任",
    "element": "패시브",
    "cool": 0,
    "description": "解明怪盗的初始准备时间减少4次行动。"
  },
  "passive2": {
    "name": "秩序",
    "element": "패시브",
    "cool": 0,
    "description": "桐条美鹤在场时，所有反抗或支配角色攻击拥有『霜结』的单位获得『霜结』层数*4.8%的伤害提升。"
  }
};

