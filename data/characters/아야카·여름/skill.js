window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["아야카·여름"] = {
  "name": "사카이 아야카·여름",
  "skill1": {
    "name": "별빛 협주",
    "element": "질풍광역",
    "type": "광역 피해",
    "sp": 22,
    "cool": 0,
    "description": "적 전체에 공격력 330.9%/364.8%/351.2%/385.1%의 질풍 속성 대미지를 준다.\n시전 후 『여름밤 별의 장막』을 전개하며, 자신이 주는 대미지가 영구적으로 39.0%/43.0%/41.4%/45.4% 증가하고 HIGHLIGHT 에너지를 100% 회복한다.\n『여름밤 별의 장막』 전개 후에는 시전할 수 없다.\n『여름밤 별의 장막』: 사카이 아야카·여름의 턴 종료 전 적 전체에 공격력 41.4%/45.6%/43.9%/48.2%의 질풍 속성 대미지를 주며, 추가 대미지로 간주한다."
  },
  "skill2": {
    "name": "끝나지 않은 노래",
    "element": "질풍광역",
    "type": "광역 피해",
    "sp": 22,
    "cool": 0,
    "description": "적 전체에 공격력 173.7%/191.5%/184.4%/202.2%의 질풍 속성 대미지를 주고, 자신은 2턴 동안 『선율 엮기』를 획득한다.\n『선율 엮기』: 자신의 턴 종료 시 HIGHLIGHT 에너지를 32% 추가 회복한다.\n『끝나지 않은 노래』 최초 시전 후, 즉시 『선율 엮기』의 HIGHLIGHT 에너지 회복 효과가 1회 발동한다."
  },
  "skill3": {
    "name": "바람에게 보내는 멜로디",
    "element": "질풍광역",
    "type": "광역 피해",
    "sp": 26,
    "cool": 0,
    "description": "적 전체에 공격력 105.1%/115.9%/111.6%/122.3%의 질풍 속성 대미지를 2회 준다. 『여름밤 별의 장막』이 이미 전개되었다면 모든 『별의 소원』을 소모하며, 『별의 소원』 1중첩을 소모할 때마다 『여름밤 별의 장막』이 1회 추가 발동한다. 『별의 소원』을 3중첩 소모했다면, 추가 발동하는 『여름밤 별의 장막』의 스킬 대미지가 100% 추가로 증가한다."
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "질풍광역",
    "type": "버프",
    "description": "『별의 소원』 1중첩을 획득하고, 1턴 동안 『여름밤 별의 장막』이 대미지를 줄 때 크리티컬 효과가 24.4%/26.9%/25.9%/28.4% 증가한다.\n100%의 HIGHLIGHT 에너지를 소모한 후 추가로 50%의 HIGHLIGHT 에너지를 소모할 때마다 『별의 소원』 1중첩을 추가로 획득하고, 『여름밤 별의 장막』이 대미지를 줄 때 크리티컬 효과가 12.2%/13.4%/13.0%/14.2% 추가로 증가한다.\nHIGHLIGHT를 중복 시전하여 획득한 크리티컬 효과 증가는 중첩되지 않는다.",
    "cool": 0
  },
  "passive1": {
    "name": "가벼운 콧노래",
    "element": "패시브",
    "description": "『여름밤 별의 장막』이 주는 대미지가 36.0% 증가하고, 적의 버프 효과를 1중첩 해제한다. 해제 효과는 턴당 최대 1회 발동한다.",
    "cool": 0
  },
  "passive2": {
    "name": "합주",
    "element": "패시브",
    "description": "동료가 HIGHLIGHT 또는 테우르기아 시전 후 2턴 동안 사카이 아야카·여름의 공격력이 21.0% 증가한다(2회 중첩 가능).",
    "cool": 0
  }
};

window.enCharacterSkillsData["아야카·여름"] = {
  "name": "Ayaka·Summer",
  "skill1": {
    "name": "Celestial Concerto",
    "element": "질풍광역",
    "type": "AoE DMG",
    "sp": 22,
    "cool": 0,
    "description": "Deal Wind damage to all foes equal to 330.9%/364.8%/351.2%/385.1% of Attack.\nThen, open [Summer Starscape], permanently increase Ayaka's damage by 39.0%/43.0%/41.4%/45.4%, and restore 100% HIGHLIGHT Energy.\nAfter opening [Summer Starscape], Ayaka cannot use this skill.\n[Summer Starscape]: Before the end of Ayaka's turn, deal Wind damage to all foes equal to 41.4%/45.6%/43.9%/48.2% of Attack. This damage is counted as a Resonance."
  },
  "skill2": {
    "name": "Unfinished Song",
    "element": "질풍광역",
    "type": "AoE DMG",
    "sp": 22,
    "cool": 0,
    "description": "Deal Wind damage to all foes equal to 173.7%/191.5%/184.4%/202.2% of Attack.\nAyaka gains [Improvised Song] for 2 turns.\n[Improvised Song]: At the end of Ayaka's turn, restore 32% bonus HIGHLIGHT Energy.\nAfter using [Unfinished Song] for the first time, immediately activate [Improvised Song]'s HIGHLIGHT Energy recovery effect."
  },
  "skill3": {
    "name": "Windward Melody",
    "element": "질풍광역",
    "type": "AoE DMG",
    "sp": 26,
    "cool": 0,
    "description": "Deal Wind damage to all foes equal to 105.1%/115.9%/111.6%/122.3% of Attack (2 hits).\nIf [Summer Starscape] is open, spend all [Star Wish] stacks, and for each stack spent, activate 1 [Summer Starscape].\nIf Ayaka spent 3 [Star Wish] stacks, increase [Summer Starscape]'s Skill Damage by 100%."
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "질풍광역",
    "type": "Buff",
    "description": "Gain 1 [Star Wish] stack. Then increase [Summer Starscape]'s critical damage by 24.4%/26.9%/25.9%/28.4% for 1 turn.\nAfter spending 100% HIGHLIGHT Energy, each subsequent 50% HIGHLIGHT Energy spent will grant 1 bonus [Star Wish] stack. Then further increase [Summer Starscape]'s critical damage by 12.2%/13.4%/13.0%/14.2%.\nThe critical damage buff from repeated HIGHLIGHT activation does not stack.",
    "cool": 0
  },
  "passive1": {
    "name": "Gentle Hum",
    "element": "패시브",
    "description": "Increase [Summer Starscape]'s damage by 36.0%. [Summer Starscape] can dispel 1 buff each turn.",
    "cool": 0
  },
  "passive2": {
    "name": "Duet",
    "element": "패시브",
    "description": "After an ally uses a HIGHLIGHT/Theurgy, increase Ayaka's Attack by 21.0% for 2 turns. Stacks up to 2 times.",
    "cool": 0
  }
};

window.jpCharacterSkillsData["아야카·여름"] = {
  "name": "坂井 綾香 夏",
  "skill1": {
    "name": "星軌コンチェルト",
    "element": "질풍광역",
    "type": "全体ダメージ",
    "sp": 22,
    "cool": 0,
    "description": "敵全体に攻撃力330.9%/364.8%/351.2%/385.1%の疾風属性ダメージを与える。\n発動後、『夏夜の星幕』を展開し、自身の与ダメージが39.0%/43.0%/41.4%/45.4%永続的に上昇し、HIGHLIGHTエネルギーを100%回復する。\n『夏夜の星幕』展開後は発動できない。\n『夏夜の星幕』：坂井 綾香 夏のターン終了前に敵全体へ攻撃力41.4%/45.6%/43.9%/48.2%の疾風属性ダメージを与える。このダメージは意識奏功として扱う。"
  },
  "skill2": {
    "name": "未完の歌",
    "element": "질풍광역",
    "type": "全体ダメージ",
    "sp": 22,
    "cool": 0,
    "description": "敵全体に攻撃力173.7%/191.5%/184.4%/202.2%の疾風属性ダメージを与え、自身が『音を集めて曲に』を獲得する。２ターン持続する。\n『音を集めて曲に』：自身のターン終了時、HIGHLIGHTエネルギーを32%追加で回復する。\n初めて『未完の歌』を発動した後、『音を集めて曲に』のHIGHLIGHTエネルギー回復効果を即座に１回発動する。"
  },
  "skill3": {
    "name": "風に贈る旋律",
    "element": "질풍광역",
    "type": "全体ダメージ",
    "sp": 26,
    "cool": 0,
    "description": "敵全体に攻撃力105.1%/115.9%/111.6%/122.3%の疾風属性ダメージを２回与える。その後、『星願』をすべて消費し、消費した『星願』１つごとに『夏夜の星幕』を追加で１回発動する。『星願』を３つ消費した場合、追加で発動した『夏夜の星幕』のスキルダメージがさらに100%上昇する。"
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "질풍광역",
    "type": "強化",
    "description": "『星願』を１つ獲得し、『夏夜の星幕』がダメージを与える時のクリティカルダメージが24.4%/26.9%/25.9%/28.4%上昇する。１ターン持続する。\nHIGHLIGHTエネルギーを100%消費した後、追加で50%消費するたびに『星願』をさらに１つ獲得し、『夏夜の星幕』がダメージを与える時のクリティカルダメージが追加で12.2%/13.4%/13.0%/14.2%上昇する。\nHIGHLIGHTの再発動で獲得したクリティカルダメージ上昇は重複しない。",
    "cool": 0
  },
  "passive1": {
    "name": "小さな口ずさみ",
    "element": "패시브",
    "description": "『夏夜の星幕』の与ダメージが36.0%上昇し、敵の強化効果を１つ解除する。解除効果は１ターンに最大１回まで発動する。",
    "cool": 0
  },
  "passive2": {
    "name": "共奏",
    "element": "패시브",
    "description": "味方がHIGHLIGHTまたはテウルギアを発動した後、坂井 綾香 夏の攻撃力が21.0%上昇する。２ターン持続し、最大２つまで累積できる。",
    "cool": 0
  }
};

window.cnCharacterSkillsData["아야카·여름"] = {
  "name": "坂井绫香·夏日",
  "skill1": {
    "name": "星轨协奏",
    "element": "질풍광역",
    "type": "群体伤害",
    "sp": 22,
    "cool": 0,
    "description": "对所有敌人造成330.9%/364.8%/351.2%/385.1%攻击力的疾风属性伤害。\n施放后将展开『夏夜星幕』，自身造成伤害永久提升39.0%/43.0%/41.4%/45.4%并回复100%HIGHLIGHT能量。\n展开『夏夜星幕』后无法施放。\n『夏夜星幕』：在坂井绫香·夏日回合结束前对所有敌人造成41.4%/45.6%/43.9%/48.2%攻击力的疾风属性伤害，视为追加伤害。"
  },
  "skill2": {
    "name": "未尽之歌",
    "element": "질풍광역",
    "type": "群体伤害",
    "sp": 22,
    "cool": 0,
    "description": "对所有敌人造成173.7%/191.5%/184.4%/202.2%攻击力的疾风属性伤害，并使自身获得『拾音成曲』，持续2回合。\n『拾音成曲』：在自身回合结束时额外回复32%HIGHLIGHT能量。\n首次施放『未尽之歌』后，将立即触发一次『拾音成曲』的HIGHLIGHT能量回复效果。"
  },
  "skill3": {
    "name": "写给风的旋律",
    "element": "질풍광역",
    "type": "群体伤害",
    "sp": 26,
    "cool": 0,
    "description": "对所有敌人造成2次105.1%/115.9%/111.6%/122.3%攻击力的疾风属性伤害。若『夏夜星幕』已展开，则消耗全部『星愿』，每消耗1层『星愿』都会额外触发1次『夏夜星幕』。若『星愿』消耗达到了3层，额外触发的『夏夜星幕』的技能伤害还会额外提升100%。"
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "질풍광역",
    "type": "增益",
    "description": "获得1层『星愿』，并使『夏夜星幕』造成伤害时暴击效果提升24.4%/26.9%/25.9%/28.4%，持续1回合。\n消耗100%HIGHLIGHT能量后每继续消耗50%HIGHLIGHT能量都会再获得1层『星愿』,并使『夏夜星幕』造成伤害时暴击效果进一步提升12.2%/13.4%/13.0%/14.2%。\n重复施放HIGHLIGHT获得的暴击效果提升无法叠加。",
    "cool": 0
  },
  "passive1": {
    "name": "轻吟",
    "element": "패시브",
    "description": "『夏夜星幕』造成的伤害提升36.0%，并将驱散敌方1层增益效果。驱散效果每回合最多触发1次。",
    "cool": 0
  },
  "passive2": {
    "name": "共奏",
    "element": "패시브",
    "description": "队友施放HIGHLIGHT或神通法后坂井绫香·夏日的攻击力提升21.0%，持续2回合，可叠加2层。",
    "cool": 0
  }
};
