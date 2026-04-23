window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["아이기스"] = {
  "name": "아이기스",
  "skill1": {
    "name": "기관총·난사",
    "element": "총격광역",
    "type": "광역 피해",
    "hp": 5,
    "cool": 0,
    "description": "모든 적에게 공격력 41.7%/45.9%/44.2%/48.5%의 총격 속성 대미지를 주고, 다음 『섬광 사격』의 스킬 대미지가 10% 증가한다. 또한 자신이 『위력 탄약』 1개를 장전하며, 효과는 2턴 동안 지속되고 최대 3회 중첩된다."
  },
  "skill2": {
    "name": "섬광 사격",
    "element": "총격광역",
    "type": "광역 피해",
    "hp": 5,
    "cool": 0,
    "description": "모든 적에게 공격력 41.7%/45.9%/44.2%/48.5%의 총격 속성 대미지를 주고, 다음 『기관총·난사』의 스킬 대미지가 10% 증가한다. 또한 자신이 『위력 탄약』 1개를 장전하며, 효과는 2턴 동안 지속되고 최대 3회 중첩된다."
  },
  "skill3": {
    "name": "기어 강화",
    "element": "버프",
    "type": "버프",
    "sp": 25,
    "cool": 0,
    "description": "자신이 테우르기아 에너지를 35포인트 획득하고, 즉시 테우르기아 에너지를 소모하지 않는 『오르기아 모드 기동』을 1회 발동한다. 자신이 『고폭 탄약』 1개를 획득하고, 해당 스킬이 『제압 사격』으로 변경된다.\n또한 2턴 동안 자신의 공격력이 39.0%/43.0%/41.4%/45.4% 증가하고, 관통이 14.6%/16.1%/15.5%/17.0% 증가한다.\n제압 사격:\n발동 조건: 자신이 『오르기아 모드』 상태\n모든 적에게 공격력 193.3%/213.2%/205.2%/225.0%의 총격 속성 대미지를 준다. 모든 테우르기아 에너지(임시 저장된 테우르기아 에너지를 포함)를 소모하며, 테우르기아 에너지 10포인트마다 스킬 배율이 10.2%/11.2%/10.8%/11.8% 증가한다.\n모든 『위력 탄약』과 『고폭 탄약』을 소모한다. 『위력 탄약』을 1개 소모할 때마다 스킬 대미지가 10% 증가하고, 『고폭 탄약』을 1개 소모할 때마다 자신의 크리티컬 효과가 29.3%/32.3%/31.1%/34.1% 증가한다."
  },
  "skill_highlight": {
    "name": "오르기아 모드 기동",
    "element": "총격광역",
    "type": "광역 피해",
    "sp": 0,
    "cool": 0,
    "description": "발동 조건: 테우르기아 에너지 70포인트\n모든 적에게 공격력 248.4%/273.8%/263.7%/289.1%의 총격 속성 대미지를 주며, 해당 대미지는 크리티컬이 발생할 수 있다. 자신이 『오르기아 모드』에 진입한다.\n『오르기아 모드』: 아이기스는 조작할 수 없으며, 동료 2명의 추가 턴이 아닌 턴이 종료될 때마다 『기관총·난사』 또는 『섬광 사격』을 번갈아 발동한다. 『오르기아 모드』에서 발동하는 모든 스킬은 테우르기아 스킬로 간주되며, 크리티컬이 발생할 수 있다.\n『오르기아 모드』 지속 중 자신의 턴 시작 시, 『제압 사격』이 사용 가능하면 자동으로 『제압 사격』을 발동해 자신의 턴을 종료하고 『오르기아 모드』를 종료한다. 그렇지 않으면 자동으로 『기관총·난사』를 발동해 자신의 턴을 종료하고 『오르기아 모드』를 종료한다. 『오르기아 모드』 종료 시 『제압 사격』은 『기어 강화』로 되돌아간다."
  },
  "skill_support": {
    "name": "지원 스킬",
    "element": "버프",
    "type": "버프",
    "description": "모든 적에게 공격력 30%의 총격 속성 대미지를 주고, 아군 전체 S.E.E.S. 멤버의 공격력이 영구적으로 10% 증가한다.",
    "cool": 0
  },
  "passive1": {
    "name": "영겁",
    "element": "패시브",
    "description": "자신 이외의 동료가 테우르기아 또는 HIGHLIGHT를 발동한 후, 2턴 동안 자신의 공격력이 42.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "증명",
    "element": "패시브",
    "description": "자신이 테우르기아 스킬을 시전한 후, 2턴 동안 자신의 대미지가 12.0% 증가한다(최대 3회 중첩).",
    "cool": 0
  }
};

window.enCharacterSkillsData["아이기스"] = {
  "name": "Aigis",
  "skill1": {
    "name": "Machine Gun Barrage",
    "element": "총격광역",
    "type": "Area Damage",
    "hp": 5,
    "cool": 0,
    "description": "Deal Gun damage to all foes equal to 41.7%/45.9%/44.2%/48.5% of Attack. Increase the damage of Aigis's next [Flash Strike] by 10%, then load 1 [Power Ammo] for 2 turns. Stacks up to 3 times."
  },
  "skill2": {
    "name": "Flash Strike",
    "element": "총격광역",
    "type": "Area Damage",
    "hp": 5,
    "cool": 0,
    "description": "Deal Gun damage to all foes equal to 41.7%/45.9%/44.2%/48.5% of Attack. Increase the damage of Aigis's next [Machine Gun Barrage] by 10%, then load 1 [Power Ammo] for 2 turns. Stacks up to 3 times."
  },
  "skill3": {
    "name": "Gear Enhancement",
    "element": "버프",
    "type": "Buff",
    "sp": 25,
    "cool": 0,
    "description": "Gain 35 Theurgy Energy, then immediately use [Orgia Mode Activation] once without spending Theurgy Energy. Gain 1 [High-Explosive Ammo], and this skill becomes [Suppressive Smash].\nIncrease Attack by 39.0%/43.0%/41.4%/45.4% and pierce rate by 14.6%/16.1%/15.5%/17.0% for 2 turns.\n[Suppressive Smash]:\nUse condition: While in [Orgia Mode]\nDeal Gun damage to all foes equal to 193.3%/213.2%/205.2%/225.0% of Attack. Spend all Theurgy Energy, including temporarily stored Theurgy Energy. For every 10 Theurgy Energy spent, increase the skill multiplier by 10.2%/11.2%/10.8%/11.8%.\nSpend all [Power Ammo] and [High-Explosive Ammo]. For every [Power Ammo] spent, increase skill damage by 10%. For every [High-Explosive Ammo] spent, increase critical damage by 29.3%/32.3%/31.1%/34.1%."
  },
  "skill_highlight": {
    "name": "Orgia Mode Activation",
    "element": "총격광역",
    "type": "Area Damage",
    "sp": 0,
    "cool": 0,
    "description": "Use condition: 70 Theurgy Energy\nDeal Gun damage to all foes equal to 248.4%/273.8%/263.7%/289.1% of Attack. This damage can crit. Enter [Orgia Mode].\n[Orgia Mode]: Aigis cannot be controlled. After every 2 non-extra ally turns, Aigis alternates between using [Machine Gun Barrage] or [Flash Strike]. All skills used in [Orgia Mode] are treated as Theurgy skills and can crit.\nWhile [Orgia Mode] is active, at the start of Aigis's turn, if [Suppressive Smash] is available, Aigis automatically uses [Suppressive Smash], ends her turn, and exits [Orgia Mode]. Otherwise, Aigis automatically uses [Machine Gun Barrage], ends her turn, and exits [Orgia Mode]. When exiting [Orgia Mode], [Suppressive Smash] reverts to [Gear Enhancement]."
  },
  "skill_support": {
    "name": "Assist Skill",
    "element": "버프",
    "type": "Buff",
    "description": "Deal Gun damage to all foes equal to 30% of Attack. Permanently increase all allied S.E.E.S. members' Attack by 10%.",
    "cool": 0
  },
  "passive1": {
    "name": "Eternity",
    "element": "패시브",
    "description": "After any ally other than Aigis uses Theurgy or HIGHLIGHT, increase Aigis's Attack by 42.0% for 2 turns.",
    "cool": 0
  },
  "passive2": {
    "name": "Proof",
    "element": "패시브",
    "description": "After using a Theurgy skill, increase Aigis's damage by 12.0% for 2 turns. Stacks up to 3 times.",
    "cool": 0
  }
};

window.jpCharacterSkillsData["아이기스"] = {
  "name": "アイギス",
  "skill1": {
    "name": "機銃・乱撃",
    "element": "총격광역",
    "type": "全体攻撃",
    "hp": 5,
    "cool": 0,
    "description": "敵全体に攻撃力41.7%/45.9%/44.2%/48.5%の射撃属性ダメージを与え、次に使用する『閃光撃』のスキルダメージが10%上昇する。さらに自身が『威力弾薬』を1個装填し、2ターン持続する（最大3スタック）。"
  },
  "skill2": {
    "name": "閃光撃",
    "element": "총격광역",
    "type": "全体攻撃",
    "hp": 5,
    "cool": 0,
    "description": "敵全体に攻撃力41.7%/45.9%/44.2%/48.5%の射撃属性ダメージを与え、次に使用する『機銃・乱撃』のスキルダメージが10%上昇する。さらに自身が『威力弾薬』を1個装填し、2ターン持続する（最大3スタック）。"
  },
  "skill3": {
    "name": "ギア強化",
    "element": "버프",
    "type": "強化",
    "sp": 25,
    "cool": 0,
    "description": "神通法エネルギーを35獲得し、さらに神通法エネルギーを消費しない『オルギアモード起動』を直ちに1回発動する。自身が『高爆弾薬』を1個獲得し、このスキルが『制圧強打』に変化する。\nさらに2ターンの間、攻撃力が39.0%/43.0%/41.4%/45.4%上昇し、貫通が14.6%/16.1%/15.5%/17.0%上昇する。\n制圧強打:\n発動条件：自身が『オルギアモード』状態\n敵全体に攻撃力193.3%/213.2%/205.2%/225.0%の射撃属性ダメージを与える。全ての神通法エネルギー（一次的に保存された神通法エネルギーを含む）を消費し、神通法エネルギー10ごとにスキル倍率が10.2%/11.2%/10.8%/11.8%上昇する。\n全ての『威力弾薬』と『高爆弾薬』を消費する。『威力弾薬』を1個消費するごとにスキルダメージが10%上昇し、『高爆弾薬』を1個消費するごとにCRT倍率が29.3%/32.3%/31.1%/34.1%上昇する。"
  },
  "skill_highlight": {
    "name": "オルギアモード起動",
    "element": "총격광역",
    "type": "全体攻撃",
    "sp": 0,
    "cool": 0,
    "description": "発動条件：神通法エネルギー70\n敵全体に攻撃力248.4%/273.8%/263.7%/289.1%の射撃属性ダメージを与え、このダメージはクリティカルが発生する。自身が『オルギアモード』に入る。\n『オルギアモード』：アイギスは操作できなくなり、味方2人の追加ターンではないターンが終了するたびに『機銃・乱撃』または『閃光撃』を交互に発動する。『オルギアモード』中に発動する全てのスキルは神通法スキルとみなされ、クリティカルが発生する。\n『オルギアモード』持続中、自身のターン開始時に『制圧強打』が使用可能な場合は自動で『制圧強打』を発動して自身のターンを終了し、『オルギアモード』を終了する。そうでない場合は自動で『機銃・乱撃』を発動して自身のターンを終了し、『オルギアモード』を終了する。『オルギアモード』終了時、『制圧強打』は『ギア強化』に戻る。"
  },
  "skill_support": {
    "name": "サポートスキル",
    "element": "버프",
    "type": "強化",
    "description": "敵全体に攻撃力30%の射撃属性ダメージを与え、味方全体のS.E.E.S.メンバーの攻撃力が永続的に10%上昇する。",
    "cool": 0
  },
  "passive1": {
    "name": "永劫",
    "element": "패시브",
    "description": "自身以外の味方が神通法またはHIGHLIGHTを発動した後、自身の攻撃力が42.0%上昇し、2ターン持続する。",
    "cool": 0
  },
  "passive2": {
    "name": "証明",
    "element": "패시브",
    "description": "神通法スキル発動後、自身の与ダメージが12.0%上昇し、2ターン持続する（最大3スタック）。",
    "cool": 0
  }
};

window.cnCharacterSkillsData["아이기스"] = {
  "name": "埃癸斯",
  "skill1": {
    "name": "机铳·乱击",
    "element": "총격광역",
    "type": "群体伤害",
    "hp": 5,
    "cool": 0,
    "description": "对所有敌人造成41.7%/45.9%/44.2%/48.5%攻击力的射击属性伤害，使自身下一次『闪光击』的技能伤害提升10%，自身装填1枚『威力弹药』，持续2回合，上限3层。"
  },
  "skill2": {
    "name": "闪光击",
    "element": "총격광역",
    "type": "群体伤害",
    "hp": 5,
    "cool": 0,
    "description": "对所有敌人造成41.7%/45.9%/44.2%/48.5%攻击力的射击属性伤害，使自身下一次『机铳·乱击』的技能伤害提升10%，自身装填1枚『威力弹药』，持续2回合，上限3层。"
  },
  "skill3": {
    "name": "齿轮强化",
    "element": "버프",
    "type": "增益",
    "sp": 25,
    "cool": 0,
    "description": "自身获得35点神通法能量，并立刻释放1次不消耗神通法能量的『启动狂宴模式』，自身获得1枚『高爆弹药』，该技能替换为『压制猛击』。\n并使自身的攻击力提升39.0%/43.0%/41.4%/45.4%、穿透提升14.6%/16.1%/15.5%/17.0%，持续2回合。\n压制猛击:\n释放条件：自身处于『狂宴模式』\n对所有敌人造成193.3%/213.2%/205.2%/225.0%攻击力的射击属性伤害。消耗所有神通法能量（包含暂时缓存的神通法能量），每有10点神通法能量使技能倍率提升10.2%/11.2%/10.8%/11.8%。\n消耗所有『威力弹药』和『高爆弹药』，每消耗1枚『威力弹药』使技能伤害提升10%，每消耗1枚『高爆弹药』使自身暴击效果提升29.3%/32.3%/31.1%/34.1%。"
  },
  "skill_highlight": {
    "name": "启动狂宴模式",
    "element": "총격광역",
    "type": "群体伤害",
    "sp": 0,
    "cool": 0,
    "description": "释放条件：70点神通法能量\n对所有敌人造成248.4%/273.8%/263.7%/289.1%攻击力的射击属性伤害，该伤害可以暴击。自身进入『狂宴模式』。\n『狂宴模式』：埃癸斯无法操控，每经过2个同伴的非额外回合会交替发动『机铳·乱击』或『闪光击』。『狂宴模式』下释放的所有技能都视为神通法技能，且可以发生暴击。\n『狂宴模式』持续期间，自身回合开始时，若『压制猛击』处于可用状态，则会自动释放『压制猛击』结束自身回合并退出『狂宴模式』，否则会自动释放『机铳·乱击』结束自身回合并退出『狂宴模式』。退出『狂宴模式』时，『压制猛击』还原为『齿轮强化』。"
  },
  "skill_support": {
    "name": "援助技能",
    "element": "버프",
    "type": "增益",
    "description": "对所有敌人造成30%攻击力的射击属性伤害，友方全体S.E.E.S.成员攻击力永久提升10%。",
    "cool": 0
  },
  "passive1": {
    "name": "永劫",
    "element": "패시브",
    "description": "自身以外的同伴释放神通法或HIGHLIGHT后，自身攻击力提升42.0%，持续2回合。",
    "cool": 0
  },
  "passive2": {
    "name": "证明",
    "element": "패시브",
    "description": "自身释放神通法技能后，自身伤害提升12.0%，持续2回合，上限3层。",
    "cool": 0
  }
};
