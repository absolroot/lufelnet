window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["토시야"] = {
  "name": "스미 토시야",
  "skill1": {
    "name": "애통한 비극",
    "element": "주원",
    "type": "단일 피해",
    "sp": 22,
    "cool": 0,
    "description": "1명의 적에게 공격력 58.6%/64.6%/61.0%/67.0%의 주원 대미지를 3회 주고, 이번 공격으로 『증오 시』 3개를 획득한다.\n이후에 『시』를 획득하면 25%의 고정 확률로 『증오 시』로 전환되며, 최대 2회 발동된다.\n『증오 시』 매 중첩마다 『운명의 십사행시』는 30%의 기본 확률로 주원 효과를 부여한다."
  },
  "skill2": {
    "name": "허황된 희극",
    "element": "주원광역",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "모든 적에게 공격력 35.7%/39.3%/37.1%/40.8%의 주원 대미지를 2회 주고, 이번 공격으로 『치유 시』 2개를 획득한다.\n이후에 『시』를 획득하면 25%의 고정 확률로 『치유 시』로 전환되며, 최대 2회 발동된다.\n『치유 시』 매 중첩마다 『운명의 십사행시』는 생명이 가장 적은 동료의 생명을 공격력 7.5%만큼 회복한다."
  },
  "skill3": {
    "name": "낭만적인 정극",
    "element": "주원",
    "type": "단일 피해",
    "sp": 22,
    "cool": 0,
    "description": "1명의 적에게 공격력 41.5%/45.7%/43.2%/47.4%의 주원 대미지를 5회 주고, 이번 공격으로 『열정 시』 5개를 획득하게 한다.\n이후에 『시』 획득 시 25%의 고정 확률로 『열정 시』로 전환되며, 최대 2회 발동된다.\n『열정 시』마다 『운명의 십사행시』에 공격력 7%의 만능 대미지를 추가한다."
  },
  "skill_highlight": {
    "element": "주원",
    "type": "단일피해",
    "description": "1명의 적에게 공격력 96.8%/106.7%/100.8%/110.7%의 주원 대미지를 3회 주며, 다음 2회의 『운명의 십사행시』는 추가로 공격력 50.6%/55.7%/52.6%/57.8%의 대미지를 준다.",
    "cool": 4
  },
  "passive1": {
    "name": "조종",
    "element": "패시브",
    "description": "『운명의 십사행시』로 주원 이상 상태에 걸린 적에게 주는 대미지가 50.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "주언",
    "element": "패시브",
    "description": "『운명의 십사행시』에 특수 『시』가 1개 있을 때마다 이번 대미지가 10.0% 증가한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["토시야"] = {
  "name": "Toshiya Sumi",
  "skill1": {
    "name": "Unexpected Tragedy",
    "element": "주원",
    "type": "단일 피해",
    "sp": 22,
    "cool": 0,
    "description": "Deal Curse damage to 1 foe equal to 58.6%/64.6%/61.0%/67.0% of Attack (3 hits), and gain 3 Verse of Hate stacks.\nThe next time Verse stacks are gained, 25% chance to change to Verse of Hate (max 2).\nWhen spending Verse of Hate stacks to deal damage with Sonnet of Fate, 30% chance to inflict Curse for each Verse of Hate spent."
  },
  "skill2": {
    "name": "Absurd Comedy",
    "element": "주원광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Curse damage to all foes equal to 35.7%/39.3%/37.1%/40.8% of Attack (2 hits), and gain 2 Verse of Healing stacks.\nThe next time Verse stacks are gained, 25% chance to change to Verse of Healing (max 2).\nWhen spending Verse of Healing stacks to deal damage with Sonnet of Fate, restore HP to the ally with the lowest remaining HP by 7.5% of Sumi's Attack for each Verse of Healing spent."
  },
  "skill3": {
    "name": "Tragicomedy of Love",
    "element": "주원",
    "type": "단일 피해",
    "sp": 22,
    "cool": 0,
    "description": "Deal Curse damage to 1 foe equal to 41.5%/45.7%/43.2%/47.4% of Attack (5 hits), and gain 5 Verse of Passion stacks.\nThe next time Verse stacks are gained, 25% chance to change to Verse of Passion (max 2).\nWhen spending Verse of Passion stacks to deal damage with Sonnet of Fate, deal bonus Almighty damage equal to 7% of Attack for each Verse of Passion spent."
  },
  "skill_highlight": {
    "name": "Highlight",
    "element": "주원",
    "type": "단일피해",
    "sp": 0,
    "cool": 4,
    "description": "Deal Curse damage to 1 foe equal to 96.8%/106.7%/100.8%/110.7% of Attack (3 hits). Increase Sumi's Attack for Sonnet of Fate by 50.6%/55.7%/52.6%/57.8% up to 2 times."
  },
  "passive1": {
    "name": "The Other Prison",
    "element": "패시브",
    "description": "Increase damage of Sonnet of Fate on foes with Curse by 50.0%.",
    "cool": 0
  },
  "passive2": {
    "name": "This Beautiful Woman",
    "element": "패시브",
    "description": "For each Verse of Hate, Verse of Healing, or Verse of Passion stack spent, increase damage of Sonnet of Fate by 10.0%.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["토시야"] = {
  "name": "須見 俊也",
  "skill1": {
    "name": "予期せぬ悲劇",
    "element": "주원",
    "type": "단일피해",
    "sp": 22,
    "cool": 0,
    "description": "敵単体に攻撃力58.6%/64.6%/61.0%/67.0%の呪怨属性ダメージを３回与え、『憎文』を３つ獲得する。\n次に『破文』を獲得する時、２５%の確率で２つまで『憎文』に変化する。\nさらに『憎文』を消費して、『運命の叙情詩』でダメージを与えた時、消費された『憎文』１つごとに３０%の確率でその敵を呪印状態にする。"
  },
  "skill2": {
    "name": "不条理な喜劇",
    "element": "주원광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "敵全体に攻撃力35.7%/39.3%/37.1%/40.8%の呪怨属性ダメージを２回与え、『癒文』を２つ獲得する。\n次に『破文』を獲得する時、２５%の確率で２つまで『癒文』に変化する。\nさらに『癒文』を消費して、『運命の叙情詩』で敵にダメージを与えた時、残りのＨＰが一番少ない味方のＨＰを、消費した『癒文』の数に応じて自身の攻撃力７.５%分回復する。"
  },
  "skill3": {
    "name": "愛と情念の惨劇",
    "element": "주원",
    "type": "단일피해",
    "sp": 22,
    "cool": 0,
    "description": "敵単体に攻撃力41.5%/45.7%/43.2%/47.4%の呪怨属性ダメージを５回与え、『激文』を５つ獲得する。\n次に『破文』を獲得する時、２５%の確率で２つまで『激文』に変化する。\nさらに『激文』を消費して、『運命の叙情詩』でダメージを与えた敵に、消費した『激文』の数に応じて攻撃力７%の万能属性ダメージを追加で与える。"
  },
  "skill_highlight": {
    "element": "주원",
    "type": "단일피해",
    "sp": 0,
    "cool": 4,
    "description": "敵単体に攻撃力96.8%/106.7%/100.8%/110.7%の呪怨属性ダメージを３回与える。さらに、『運命の叙情詩』で参照される自身の攻撃力が２回まで50.6%/55.7%/52.6%/57.8%上昇する。"
  },
  "passive1": {
    "name": "『アザー・プリズン』",
    "element": "패시브",
    "description": "呪印状態の敵への『運命の叙情詩』の与ダメージが50.0%上昇する。",
    "cool": 0
  },
  "passive2": {
    "name": "『此方の佳人』",
    "element": "패시브",
    "description": "『憎文』『癒文』『激文』の消費数に応じて『運命の叙情詩』の与ダメージが10.0%ずつ上昇する。",
    "cool": 0
  }
};
