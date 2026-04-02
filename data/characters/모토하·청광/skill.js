window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["모토하·청광"] = {
  "name": "아라이 모토하·청광",
  "skill1": {
    "name": "순뢰창격",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "모든 적에게 공격력 282.8%/311.8%/300.2%/329.2%의 전격 속성 대미지를 준다. 해당 대미지는 모든 적에게 균등하게 분할되며, 목표를 감전 및 『섬락』 상태에 빠뜨린다(2턴 지속). 자신이 『빛』을 획득한다.\n『섬락』: 받는 대미지가 39.0%/43.0%/41.4%/45.4% 증가한다."
  },
  "skill2": {
    "name": "지지 않는 태양",
    "element": "버프",
    "type": "버프",
    "sp": 22,
    "cool": 0,
    "description": "모든 아군이 다운 수치 1포인트와 1561/1721/1657/1817의 실드를 획득한다. 또한 모든 적을 도발하며, 자신의 받는 대미지가 39.0%/43.0%/41.4%/45.4% 감소한다. 효과는 자신의 다음 턴 시작 시까지 지속된다.\n다음 턴 시작 시, 자동으로 모든 적에게 『순뢰창격』의 대미지 효과를 발동하며, 지속 시간 동안 적의 스킬 대미지를 1회 받을 때마다 해당 『순뢰창격』의 대미지가 5% 증가한다. 자신이 『그림자』를 획득한다."
  },
  "skill3": {
    "name": "솟구치는 뇌광",
    "element": "전격광역",
    "type": "단일피해",
    "sp": 24,
    "cool": 0,
    "description": "즉시 『결의의 소녀』 상태에 진입한다(2턴 지속). 적 2명(동일 목표 중복 선택 가능)에게 공격력 162.9%/179.6%/172.9%/189.6%의 전격 속성 대미지를 준다. 목표가 『섬락』 상태일 경우 스킬 대미지가 기존의 120%까지 증가한다.\n『결의의 소녀』: HIGHLIGHT 시전 시 스킬 배율이 55.8%/61.5%/59.3%/65.0% 증가한다."
  },
  "skill_highlight": {
    "name": "황혼의 잔광",
    "element": "전격광역",
    "type": "단일피해",
    "description": "발동 조건: 『빛』 또는 『그림자』를 최소 3중첩 보유.\n적 2명(동일 목표 중복 선택 가능)을 선택하여 각각 『빛의 창』과 『그림자의 창』을 시전한다.\n『빛의 창』: 공격력 223.3%/246.2%/237.0%/259.9%의 전격 속성 대미지를 준다.\n『그림자의 창』: 『빛의 창』 대미지의 100%에 해당하는 고정 대미지를 주고, 내성을 무시하고 목표의 다운 수치를 1포인트 깎는다.\n『빛의 창』과 『그림자의 창』이 동시에 서로 다른 2명의 적에게 명중하면 스킬 대미지가 기존의 115%까지 증가하며, 동일한 적에게 명중하면 이번 스킬의 크리티컬 효과가 30% 증가한다.\n『빛』 또는 『그림자』를 총 3중첩 소모하며(빛 우선 소모), 소모된 『빛』 1중첩당 『빛의 창』 시전 시 공격력이 29.3%/32.3%/31.1%/34.1% 증가하고, 소모된 『그림자』 1중첩당 모든 아군이 488/538/518/568의 실드를 획득한다(2턴 지속)."
  },
  "passive1": {
    "name": "유금",
    "element": "패시브",
    "description": "전투 시작 시 아라이 모토하·청광이 『결의의 소녀』 상태에 진입한다(2턴 지속). 『결의의 소녀』 상태일 때 관통이 15.0% 증가한다."
  },
  "passive2": {
    "name": "불굴",
    "element": "패시브",
    "description": "『섬락』 상태의 적에게 대미지를 줄 때 공격력이 42.0% 증가한다."
  }
};

window.enCharacterSkillsData["모토하·청광"] = {
  "name": "Closer·Radiance",
  "skill1": {
    "name": "Thunder Thrust",
    "element": "전격광역",
    "type": "광역피해",
    "description": "Deal Elec damage to all foes equal to 282.8%/311.8%/300.2%/329.2% of Attack, distribute this damage between all foes. Inflict targets with Shock and [Flashover] for 2 turns. Motoha gains [Light].\n[Flashover]: Increase damage taken by 39.0%/43.0%/41.4%/45.4%."
  },
  "skill2": {
    "name": "Unsetting Sun",
    "element": "버프",
    "type": "버프",
    "description": "Grant a 1561/1721/1657/1817 Shield and 1 Down Points to all allies. Inflict all foes with Taunt, decrease Motoha's damage taken by 39.0%/43.0%/41.4%/45.4%. Lasts until the start of Motoha's next turn.\nAt the start of next turn, automatically activate [Thunder Thrust]'s damage, each time Motoha takes skill damage during this effect, increase that [Thunder Thrust]'s Skill Damage by 5%.\nMotoha gains [Shadow]."
  },
  "skill3": {
    "name": "Skyfall Bolt",
    "element": "전격광역",
    "type": "단일피해",
    "description": "Immediately enter [Resolute Maiden] state. Lasts for 2 turns. \nDeal Elec damage to 2 targets equal to 162.9%/179.6%/172.9%/189.6% of Attack (can select the same target), if skill targets have [Flashover], increase Skill Damage to 120% of its normal damage.\n[Resolute Maiden]: When activating a HIGHLIGHT, increase skill multiplier by 55.8%."
  },
  "skill_highlight": {
    "name": "Twilight Radiance",
    "element": "전격광역",
    "type": "단일피해",
    "description": "Use condition: When Motoha has at least 3 [Light]/[Shadow] stacks. \nSelect 2 foes (can select the same target) and use [Spear of Light] and [Spear of Shadow] on them. \n[Spear of Light]: Deal Elec damage equal to 223.3%/246.2%/237.0%/259.9% of Attack.\n[Spear of Shadow]: Deal fixed damage equal of 100% of [Spear of Light]'s damage. Ignore all affinites and decrease Down Points by 1.\nIf [Spear of Light] and [Spear of Shadow] hit 2 foes, increase Skill Damage to 115% of its normal damage. If they hit the same foe, increase this skill's critical damage by 30%.\nSpend 3 [Light]/[Shadow] stacks (Light will be spent first), for each [Light] stack spent, increase [Spear of Light]'s Attack by 29.3%/32.3%/31.1%/34.1%. For each [Shadow] stack spent, grant a 488/538/518/568 Shield Shield to all allies. Lasts for 2 turns."
  },
  "passive1": {
    "name": "Gilding",
    "element": "패시브",
    "description": "At the start of battle, Motoha enters [Resolute Maiden] state. Lasts for 2 turns. When [Resolute Maiden] is active, increase pierce rate by 15%."
  },
  "passive2": {
    "name": "Unyielding",
    "element": "패시브",
    "description": "When dealing damage to foes with [Flashover], increase Attack by 42.0%."
  }
};

window.jpCharacterSkillsData["모토하·청광"] = {
  "name": "素羽・晴光",
  "skill1": {
    "name": "瞬雷槍撃",
    "element": "전격광역",
    "type": "광역피해",
    "description": "敵全体に攻撃力の282.8%/311.8%/300.2%/329.2%の電撃属性ダメージを与える。このダメージは敵全体に均等に分配される。対象を感電および『閃絡』状態にする（2ターン持続）。自身は『光』を獲得する。\n『閃絡』：受けるダメージが39.0%/43.0%/41.4%/45.4%上昇する。"
  },
  "skill2": {
    "name": "不落の日",
    "element": "버프",
    "type": "버프",
    "description": "味方全体がダウン値1ポイントと1561/1721/1657/1817의 실드(シールド)を獲得する。また、敵全体を挑発し、自身の被ダメージが39.0%/43.0%/41.4%/45.4%低下する。効果は次の自身のターン開始時まで持続する.\n次のターン開始時、自動的に敵全体へ『瞬雷槍撃』のダメージ効果を発動する. 期間中に敵のスキルダメージを受けるたびに、その『瞬雷槍撃』のダメージが5%上昇する. 自身は『影』を獲得する."
  },
  "skill3": {
    "name": "凌空雷光",
    "element": "전격광역",
    "type": "단일피해",
    "description": "直ちに『決意の少女』状態になる（2ターン持続）. 敵2体（同一目標を重複選択可能）に攻撃力の162.9%/179.6%/172.9%/189.6%の電撃属性ダメージを与える. 対象が『閃絡』状態の場合、スキルダメージが元の120%に上昇する.\n『決意の少女』: ハイライト発動時、スキル倍率が55.8%/61.5%/59.3%/65.0%上昇する."
  },
  "skill_highlight": {
    "name": "黄昏の余暉",
    "element": "전격광역",
    "type": "단일피해",
    "description": "発動条件：『光』または『影』を合計3スタック以上所持.\n敵2体（同一目標を重複選択可能）を選択し、それぞれに『光の槍』と『影の槍』を放つ.\n『光の槍』：攻撃力の223.3%/246.2%/237.0%/259.9%の電撃属性ダメージを与える.\n『影の槍』：『光の槍』の100%相当の固定ダメージを与え、耐性を無視して対象のダウン値を1ポイント削る.\n『光の槍』と『影의 槍』が同時に異なる敵2体に命中した場合、スキルダメージが元の115%に上昇する. 同一の敵に命中した場合、今回のクリティカル効果が30%上昇する.\n『光』または『影』を合計3スタック消費（光を優先的に消費）. 消費した『光』1つにつき『光の槍』の攻撃力が29.3%/32.3%/31.1%/34.1%上昇し、消費した『影』1つにつき味方全体に488/538/518/568のシールドを付与する（2턴 지속）."
  },
  "passive1": {
    "name": "鎏金",
    "element": "패시브",
    "description": "戦闘開始時、素羽・晴光は『決意の少女』状態になる（2ターン持続）。『決意の少女』状態の間、貫通が15.0%上昇する。"
  },
  "passive2": {
    "name": "不屈",
    "element": "패시브",
    "description": "『閃絡』状態の敵にダメージを与える時、攻撃力が42.0%上昇する。"
  }
};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};
window.cnCharacterSkillsData["모토하·청광"] = {
  "name": "新井素羽·晴光",
  "skill1": {
    "name": "瞬雷枪击",
    "element": "전격광역",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "对所有敌人造成282.8%/311.8%/300.2%/329.2%攻击力的电击属性伤害，该伤害由所有敌人平均分摊，使目标陷入触电和『闪络』状态，持续2回合。自身获得『光』。\n『闪络』：受到伤害提升39.0%/43.0%/41.4%/45.4%。"
  },
  "skill2": {
    "name": "不落之日",
    "element": "버프",
    "type": "버프",
    "sp": 22,
    "cool": 0,
    "description": "使所有同伴获得1点倒地值与1561/1721/1657/1817的护盾，并嘲讽所有敌人，自身受到伤害降低39.0%/43.0%/41.4%/45.4%，效果持续至自身下回合开始。\n下回合开始时，自动对所有敌人造成『瞬雷枪击』的伤害效果，期间每受到1次敌人的技能伤害，使该次『瞬雷枪击』技能伤害提升5%。自身获得『影』。"
  },
  "skill3": {
    "name": "凌空雷光",
    "element": "전격",
    "type": "광역 피해",
    "sp": 24,
    "cool": 0,
    "description": "立刻进入『决意的少女』状态，持续2回合。对2个敌方目标（可重复选择同一目标）造成162.9%/179.6%/172.9%/189.6%攻击力的电击属性伤害，若技能目标处于『闪络』状态，则技能伤害提升至原本的120%。\n『决意的少女』：释放HIGHLIGHT时，技能倍率提升55.8%/61.5%/59.3%/65.0%。"
  },
  "skill_highlight": {
    "element": "전격",
    "type": "광역 피해",
    "cool": 0,
    "description": "『黄昏之余晖』\n发动条件：拥有至少3层『光』/『影』。\n选择2个敌方目标（可重复选择同一目标）分别对其释放『光之枪』与『影之枪』。\n『光之枪』：造成223.3%/246.2%/237.0%/259.9%攻击力的电击属性伤害；\n『影之枪』：造成相当于『光之枪』伤害100%的固定伤害，并无视适应性削减目标1点倒地值；\n若『光之枪』与『影之枪』同时命中2名敌人，则技能伤害提升至原本的115%；若命中同一名敌人，则释放本技能时暴击效果提升30%。\n消耗共3层『光』/『影』（优先消耗『光』），每消耗1层『光』使释放『光之枪』时攻击力提升29.3%/32.3%/31.1%/34.1%；每消耗1层『影』使所有同伴获得488/538/518/568的护盾，持续2回合。"
  },
  "passive1": {
    "name": "鎏金",
    "element": "패시브",
    "description": "战斗开始时，新井素羽·晴光进入『决意的少女』状态，持续2回合。处于『决意的少女』状态时，穿透提升15.0%。",
    "cool": 0
  },
  "passive2": {
    "name": "不屈",
    "element": "패시브",
    "description": "对处于『闪络』状态的敌人造成伤害时，攻击力提升42.0%。",
    "cool": 0
  }
};
