window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["아야카·여름"] = {
  "name": "아야카·여름",
  "skill1": {
    "name": "별빛 궤적의 협주곡",
    "element": "질풍광역",
    "type": "광역 피해",
    "sp": 22,
    "cool": 0,
    "description": "모든 적에게 공격력 330.9%/364.8%/351.2%/385.1%의 질풍 속성 대미지를 준다.\n시전 후 『여름밤의 별장막』을 전개하고, 자신의 주는 대미지가 39.0%/43.0%/41.4%/45.4% 영구 증가하며 HIGHLIGHT 에너지를 100% 회복한다.\n『여름밤의 별장막』 전개 후에는 시전할 수 없다.\n『여름밤의 별장막』: 아야카·여름의 턴 종료 전 모든 적에게 공격력 41.4%/45.6%/43.9%/48.2%의 질풍 속성 대미지를 주며, 추가 효과 대미지로 간주된다."
  },
  "skill2": {
    "name": "끝나지 않은 노래",
    "element": "질풍광역",
    "type": "광역 피해",
    "sp": 22,
    "cool": 0,
    "description": "모든 적에게 공격력 173.7%/191.5%/184.4%/202.2%의 질풍 속성 대미지를 주고, 자신이 『음을 모아 선율로』를 획득한다. 효과는 2턴 동안 지속된다.\n『음을 모아 선율로』: 자신의 턴 종료 시 HIGHLIGHT 에너지를 32% 추가 회복한다.\n처음 『끝나지 않은 노래』를 시전한 후, 『음을 모아 선율로』의 HIGHLIGHT 에너지 회복 효과가 즉시 1회 발동한다."
  },
  "skill3": {
    "name": "바람에게 쓰는 선율",
    "element": "질풍광역",
    "type": "광역 피해",
    "sp": 26,
    "cool": 0,
    "description": "모든 적에게 공격력 105.1%/115.9%/111.6%/122.3%의 질풍 속성 대미지를 2회 준다. 이후 『별의 소원』을 모두 소모하며, 『별의 소원』 1중첩을 소모할 때마다 『여름밤의 별장막』이 추가로 1회 발동한다. 『별의 소원』을 3중첩 소모했다면 추가로 발동한 『여름밤의 별장막』의 스킬 대미지가 100% 추가 증가한다."
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "질풍광역",
    "type": "버프",
    "description": "『별의 소원』 1중첩을 획득하고, 『여름밤의 별장막』이 대미지를 줄 때 크리티컬 효과가 24.4%/26.9%/25.9%/28.4% 증가한다. 효과는 1턴 동안 지속된다.\nHIGHLIGHT 에너지를 100% 소모한 뒤 추가로 50% 소모할 때마다 『별의 소원』을 1중첩 더 획득하고, 『여름밤의 별장막』이 대미지를 줄 때 크리티컬 효과가 추가로 12.2%/13.4%/13.0%/14.2% 증가한다.\nHIGHLIGHT를 반복 시전해 획득한 크리티컬 효과 증가는 중첩되지 않는다.",
    "cool": 0
  },
  "passive1": {
    "name": "흥얼거림",
    "element": "패시브",
    "description": "『여름밤의 별장막』이 주는 대미지가 36.0% 증가하고, 적의 강화 효과 1중첩을 해제한다. 해제 효과는 턴마다 최대 1회 발동한다.",
    "cool": 0
  },
  "passive2": {
    "name": "합주",
    "element": "패시브",
    "description": "동료가 HIGHLIGHT 또는 테우르기아를 시전한 후, 아야카·여름의 공격력이 21.0% 증가한다. 효과는 2턴 동안 지속되며 2중첩까지 중첩된다.",
    "cool": 0
  }
};

window.enCharacterSkillsData["아야카·여름"] = {
  "name": "Ayaka·Summer",
  "skill1": {
    "name": "Starlit Concerto",
    "element": "질풍광역",
    "type": "AoE DMG",
    "sp": 22,
    "cool": 0,
    "description": "Deal Wind damage to all foes equal to 330.9%/364.8%/351.2%/385.1% of Attack.\nAfter activation, deploy Summer Night Star Curtain, permanently increase Ayaka·Summer's damage by 39.0%/43.0%/41.4%/45.4%, and restore 100% HIGHLIGHT energy.\nThis skill cannot be used after Summer Night Star Curtain has been deployed.\nSummer Night Star Curtain: Before Ayaka·Summer's turn ends, deal Wind damage to all foes equal to 41.4%/45.6%/43.9%/48.2% of Attack. This is counted as Resonance damage."
  },
  "skill2": {
    "name": "Unfinished Song",
    "element": "질풍광역",
    "type": "AoE DMG",
    "sp": 22,
    "cool": 0,
    "description": "Deal Wind damage to all foes equal to 173.7%/191.5%/184.4%/202.2% of Attack, and gain Gathered Notes for 2 turns.\nGathered Notes: At the end of Ayaka·Summer's turn, additionally restore 32% HIGHLIGHT energy.\nAfter Unfinished Song is used for the first time, immediately trigger Gathered Notes' HIGHLIGHT energy recovery effect 1 time."
  },
  "skill3": {
    "name": "Melody for the Wind",
    "element": "질풍광역",
    "type": "AoE DMG",
    "sp": 26,
    "cool": 0,
    "description": "Deal Wind damage to all foes 2 times, each equal to 105.1%/115.9%/111.6%/122.3% of Attack. Then spend all Starwish stacks. For each Starwish stack spent, trigger Summer Night Star Curtain 1 additional time. If 3 Starwish stacks were spent, the additionally triggered Summer Night Star Curtain deals 100% more skill damage."
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "질풍광역",
    "type": "Buff",
    "description": "Gain 1 Starwish stack, and when Summer Night Star Curtain deals damage, increase critical damage by 24.4%/26.9%/25.9%/28.4% for 1 turn.\nAfter spending 100% HIGHLIGHT energy, for every additional 50% HIGHLIGHT energy spent, gain 1 more Starwish stack and further increase critical damage when Summer Night Star Curtain deals damage by 12.2%/13.4%/13.0%/14.2%.\nCritical damage increases gained from repeated HIGHLIGHT activations cannot stack.",
    "cool": 0
  },
  "passive1": {
    "name": "Soft Humming",
    "element": "패시브",
    "description": "Increase damage dealt by Summer Night Star Curtain by 36.0%, and dispel 1 buff from foes. This dispel can trigger up to 1 time per turn.",
    "cool": 0
  },
  "passive2": {
    "name": "Duet",
    "element": "패시브",
    "description": "After an ally uses HIGHLIGHT or Theurgy, increase Ayaka·Summer's Attack by 21.0% for 2 turns. Stacks up to 2 times.",
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
    "description": "对所有敌人造成2次105.1%/115.9%/111.6%/122.3%攻击力的疾风属性伤害。随后消耗全部『星愿』，每消耗1层『星愿』都会额外触发1次『夏夜星幕』。若『星愿』消耗达到了3层，额外触发的『夏夜星幕』的技能伤害还会额外提升100%。"
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "질풍광역",
    "type": "增益",
    "description": "获得1层『星愿』，并使『夏夜星幕』造成伤害时暴击效果提升24.4%/26.9%/25.9%/28.4%，持续1回合。\n消耗100%HIGHLIGHT能量后每继续消耗50%HIGHLIGHT能量都会再获得1层『星愿』，并使『夏夜星幕』造成伤害时暴击效果进一步提升12.2%/13.4%/13.0%/14.2%。\n重复施放HIGHLIGHT获得的暴击效果提升无法叠加。",
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
