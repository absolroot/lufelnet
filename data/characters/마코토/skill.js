window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["마코토"] = {
  "name": "니지마 마코토",
  "skill1": {
    "name": "펄스 연타",
    "element": "핵열광역",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "임의의 적에게 공격력 83.0%/91.5%/88.1%/96.6%의 핵열 속성 대미지를 5회 주고, 해당 스킬 공격을 받지 않은 적을 우선 공격한다. 대미지를 줄 때마다 100%의 기본 확률로 적을 1가지 원소 이상 상태에 빠트린다(적이 보유하지 않은 원소 이상 우선 추가). 같은 목표를 겨냥해 여러 번 대미지를 줄 경우 20%의 대미지만 줄 수 있다. 메인 목표가 원소 이상 상태일 경우, TECHNICAL을 주고, 목표에게 추가로 공격력 29.3%/29.3%/31.1%/31.1%의 핵열 속성 대미지를 준다. 100%의 고정 확률로 2턴 동안 메인 목표를 『방사선』 상태에 빠뜨린다."
  },
  "skill2": {
    "name": "핵열 공진",
    "element": "치료",
    "type": "단일치료",
    "sp": 22,
    "cool": 0,
    "description": "동료 1명의 생명을 니지마 마코토의 공격력의 52.7%/52.7%/55.9%/55.9%+1500/1824/1844/2168만큼 회복시키고, 2턴 동안 자신의 공격력이 48.8%/53.8%/51.8%/56.8% 증가한다. 자신이 『강인』 효과를 3중첩을 획득하고, 적이 보유한 원소 이상 종류에 따라 해당하는 수량의 『강인』 효과를 추가 획득한다."
  },
  "skill3": {
    "name": "핵열 치명타",
    "element": "핵열",
    "type": "단일 피해",
    "sp": 21,
    "cool": 0,
    "description": "1명의 적에게 공격력 210.6%/232.2%/223.6%/245.1%의 핵열 속성 대미지를 주며 목표가 원소 이상 상태일 경우 TECHNICAL을 주고, 공격력 39.0%/43.0%/41.4%/45.4%의 핵열 속성 대미지를 1단 추가로 준다. 자신이 『강인』 효과를 2중첩 획득한다.\n『철의 의지』 상태에서 해당 스킬이 『핵융합 과부하』로 레벨업한다.\n『핵융합 과부하』: 1명의 적에게 공격력 243.6%/268.6%/258.6%/283.5%의 핵열 속성 대미지를 주며 목표가 원소 이상 상태를 1종류 보유할 때마다 TECHNICAL을 주고, 공격력 34.2%/37.7%/36.3%/39.8%의 핵열 속성 대미지를 추가로 1단 준다(최대 3단)."
  },
  "skill_highlight": {
    "element": "핵열",
    "type": "단일피해",
    "description": "『열물질』 2중첩을 획득하고 즉시 다음 효과가 적용된 후, 1명의 적에게 공격력 468.5%/516.5%/497.3%/545.3%의 핵열 속성 대미지를 준다. 현재 『열물질』을 소모해 1중첩 소모할 때마다 적에게 임의의 원소 이상을 1개 추가하며, 적이 원소 이상 2개를 보유할 때까지 지속된다. 남은 『열물질』을 모두 소모하여 1중첩 소모할 때마다 이번 스킬 대미지가 20% 증가한다.",
    "cool": 4
  },
  "passive1": {
    "name": "응집",
    "element": "패시브",
    "description": "필드에 한 종류의 원소 이상이 있을 때마다, 니지마 마코토의 공격력이 15.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "의지",
    "element": "패시브",
    "description": "전투 시작 시 대미지 감소율이 6.0% 증가하며, 『철의 의지』 상태에 진입할 때마다 대미지 감소율이 6.0% 추가로 증가하고, 최대 18.0% 증가한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["마코토"] = {
  "name": "Makoto Niijima",
  "skill1": {
    "name": "Sanctioned Drift",
    "element": "핵열광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Nuclear damage to foes equal to 83.0%/91.5%/88.1%/96.6% of Attack (5 hits). From the second hit, prioritize new targets and change damage to 20% for hits on the same target. Also inflict a random elemental ailment on the target of each hit, prioritizing ones the target does not have.\nIf the target has an elemental ailment, activate a Technical and deal bonus Nuclear damage equal to 29.3%/29.3%/31.1%/31.1% of Attack.\nInflict Radiation on the main target for 2 turns."
  },
  "skill2": {
    "name": "President's Prowess",
    "element": "치료",
    "type": "단일치료",
    "sp": 22,
    "cool": 0,
    "description": "Restore 1 ally's HP equal to 52.7%/52.7%/55.9%/55.9% of Makoto's Attack + 1500/1824/1844/2168. Increase Makoto's Attack by 48.8%/53.8%/51.8%/56.8% for 2 turns.\nAlso gain 3 Tenacity stacks, and gain more Tenacity stacks for each different elemental ailment on foes."
  },
  "skill3": {
    "name": "Nuclear Fury",
    "element": "핵열",
    "type": "단일 피해",
    "sp": 21,
    "cool": 0,
    "description": "Deal Nuclear damage to 1 foe equal to 210.6%/232.2%/223.6%/245.1% of Attack, and gain 2 Tenacity stacks.\nIf the main target has an elemental ailment, activate a Technical and deal bonus Nuclear damage equal to 39.0%/43.0%/41.4%/45.4% of Attack.\nWhen Crash Out is active, evolve this skill to Thermonuclear Fury.\nThermonuclear Fury: Deal Nuclear damage to 1 foe equal to 243.6%/268.6%/258.6%/283.5% of Attack. For each different elemental ailment the target has, activate a Technical and deal bonus Nuclear damage equal to 34.2%/37.7%/36.3%/39.8% of Attack (up to 3 hits)."
  },
  "skill_highlight": {
    "element": "핵열",
    "type": "단일피해",
    "description": "Deal Nuclear damage to 1 foe equal to 468.5%/516.5%/497.3%/545.3% of Attack, gain 2 Frenzied Voltage stacks, and activate the following effects.\nSpend 1 Frenzied Voltage stack to inflict 1 random elemental ailment on foes, continuing until foes have 2 elemental ailments. Spend all remaining Frenzied Voltage stacks to increase the damage of this skill by 20% per stack.",
    "cool": 4
  },
  "passive1": {
    "name": "Chief Strategist",
    "element": "패시브",
    "description": "During battle, for each different type of elemental ailment on foes, increase Attack by 15.0%.",
    "cool": 0
  },
  "passive2": {
    "name": "Unshakable Will",
    "element": "패시브",
    "description": "At the start of battle, increase damage reduction rate by 6.0%, and whenever Crash Out is active, increase damage reduction rate by 6.0% more (up to 18.0%).",
    "cool": 0
  }
};
window.jpCharacterSkillsData["마코토"] = {
  "name": "新島 真",
  "skill1": {
    "name": "制裁ドリフト",
    "element": "핵열광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "敵に攻撃力83.0%/91.5%/88.1%/96.6%の核熱属性ダメージを５回与える。２回目以降の攻撃は新たな対象が優先され、同一の対象に命中した時、与ダメージが２０%になる。同時にそれぞれの攻撃ごとの対象にランダムな属性異常を付与する（付与されていない属性異常を優先して付与する）。\nさらに攻撃対象が属性異常の場合、テクニカルが発生し、追加で攻撃力29.3%/29.3%/31.1%/31.1%の核熱属性ダメージを与える。\nまた選択した対象を２ターンの間、『極熱』状態にする。"
  },
  "skill2": {
    "name": "生徒会長の手腕",
    "element": "치료",
    "type": "単体回復",
    "sp": 22,
    "cool": 0,
    "description": "味方単体のＨＰを真の攻撃力52.7%/52.7%/55.9%/55.9%＋1500/1824/1844/2168分回復し、２ターンの間、自身の攻撃力が48.8%/53.8%/51.8%/56.8%上昇する。\nさらに『我慢』を３つ獲得し、敵の異なる属性異常の数ごとに追加で『我慢』を獲得する。"
  },
  "skill3": {
    "name": "沸き立つ怒り",
    "element": "핵열",
    "type": "単体ダメージ",
    "sp": 21,
    "cool": 0,
    "description": "敵単体に攻撃力210.6%/232.2%/223.6%/245.1%の核熱属性ダメージを与え、自身が『我慢』を２つ獲得する。\n選択した対象が属性異常の時、テクニカルが発生し、攻撃力39.0%/43.0%/41.4%/45.4%の核熱属性ダメージを追加で与える。\n『ブチ切れ』状態の時、このスキルは『爆発する怒り』に変化する。\n『爆発する怒り』：敵単体に攻撃力243.6%/268.6%/258.6%/283.5%の核熱属性ダメージを与え、対象の異なる属性異常の数ごとにテクニカルが発生し、追加で攻撃力34.2%/37.7%/36.3%/39.8%の核熱属性ダメージを最大３回与える。"
  },
  "skill_highlight": {
    "element": "핵열",
    "type": "単体ダメージ",
    "description": "敵単体に攻撃力468.5%/516.5%/497.3%/545.3%の核熱属性ダメージを与え、『怒りのボルテージ』を２つ獲得して、次の効果を発動させる。\n『怒りのボルテージ』を１つ消費して、敵にランダムな属性異常を１つ付与し、属性異常が２つになるまで続ける。次に、残りの『怒りのボルテージ』を全て消費して、この攻撃によるダメージを上昇させ、１つ消費する毎に２０%上昇させる。",
    "cool": 4
  },
  "passive1": {
    "name": "作戦参謀",
    "element": "패시브",
    "description": "戦闘中、敵の異なる属性異常の数ごとに、自身の攻撃力が15.0%上昇する。",
    "cool": 0
  },
  "passive2": {
    "name": "確固たる意志",
    "element": "패시브",
    "description": "戦闘開始時、ダメージ軽減率が6.0%上昇し、『ブチ切れ』状態になるたびに、ダメージ軽減率がさらに6.0%（最大18.0%まで）上昇する。",
    "cool": 0
  }
};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.cnCharacterSkillsData["마코토"] = {
  "name": "新岛真",
  "skill1": {
    "name": "脉冲连击",
    "element": "핵열",
    "sp": 20,
    "cool": 0,
    "description": "对随机敌人造成5次83.0%/91.5%/88.1%/96.6%攻击力的核热属性伤害，优先攻击未受到该技能攻击的敌人。每次伤害有100%的基础概率使敌人陷入一种元素异常（优先添加敌人未拥有的元素异常）。多次伤害命中同一目标时只会造成20%的伤害。若主目标处于元素异常状态，则造成TECHNICAL，对其额外造成一次29.3%/29.3%/31.1%/31.1%攻击力的核热属性伤害。有100%的固定概率使主目标陷入『辐射』状态，持续2回合。"
  },
  "skill2": {
    "name": "核能共振",
    "sp": 22,
    "cool": 0,
    "description": "使1名同伴恢复等同于新岛真52.7%/52.7%/55.9%/55.9%攻击力+1500/1824/1844/2168的生命值，自身攻击力提升48.8%/53.8%/51.8%/56.8%，持续2回合。自身获得3层『坚韧』效果，并且根据敌人拥有的元素异常种类额外获得对应数量的『坚韧』效果。",
    "element": "치료"
  },
  "skill3": {
    "name": "核热爆伤",
    "element": "핵열",
    "sp": 21,
    "cool": 0,
    "description": "对1名敌人造成210.6%/232.2%/223.6%/245.1%攻击力的核热属性伤害，若目标处于元素异常状态，造成TECHNICAL，额外造成一段39.0%/43.0%/41.4%/45.4%攻击力的核热属性伤害。 自身获得2层『坚韧』效果。\n『铁血意志』状态下，该技能升级为『超载聚变』。\n『超载聚变』：对1名敌人造成243.6%/268.6%/258.6%/283.5%攻击力的核热属性伤害，目标身上每有1种元素异常的效果，造成TECHNICAL，额外造成一段34.2%/37.7%/36.3%/39.8%攻击力的核热属性伤害，最多造成3段额外伤害。"
  },
  "passive1": {
    "name": "聚能",
    "element": "패시브",
    "cool": 0,
    "description": "场上每有一种元素异常，新岛真攻击力提升15.0%。"
  },
  "passive2": {
    "name": "意志",
    "element": "패시브",
    "cool": 0,
    "description": "战斗开始时，减伤率提升6.0%，每次进入『铁血意志』状态后，减伤率额外提升6.0%，上限提升18.0%。"
  },
  "skill_highlight": {
    "element": "핵열",
    "cool": 4,
    "description": "获取2层『热质』并立刻适用以下效果，然后对1名敌人造成468.5%/516.5%/497.3%/545.3%攻击力的核热属性伤害： 消耗当前『热质』，每消耗1层为敌人施加1个随机元素异常，直到敌人拥有2个元素异常；消耗所有剩余的『热质』，每消耗1层使得本次技能伤害提升20%。"
  }
};
