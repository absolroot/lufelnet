window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["모토하"] = {
  "name": "아라이 모토하",
  "skill1": {
    "name": "천둥의 격노",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "4개의 천뢰를 발사하여 공격력 76.7%/84.5%/79.9%/87.7%의 전격 속성 대미지를 주고, 100%의 기본 확률로 스킬 메인 목표를 감전 상태에 빠뜨린다. 동일한 목표에게 후속 공격 시 대미지를 10%만 줄 수 있으며, 천뢰는 공격하지 않은 목표를 우선 선택한다."
  },
  "skill2": {
    "name": "초고속 전격",
    "element": "전격",
    "type": "단일피해",
    "sp": 18,
    "cool": 0,
    "description": "1명의 적에게 공격력 157.1%/173.2%/163.6%/179.7%의 전격 속성 대미지를 주고, 2턴 동안 모든 동료가 주는 전격 속성 대미지가 11.7%/11.7%/12.2%/12.2% 증가한다."
  },
  "skill3": {
    "name": "전기 상어",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 24,
    "cool": 0,
    "description": "모든 적에게 공격력 79.3%/87.4%/82.5%/90.6%의 전격 속성 대미지를 준다. 필드에 감전 상태인 적이 있는 경우 TECHNICAL를 주고 모든 적에게 공격력 42.8%/47.2%/44.5%/48.9%의 전격 속성 대미지를 1회 추가로 준다."
  },
  "skill_highlight": {
    "element": "전격",
    "type": "광역피해",
    "description": "모든 적에게 공격력 162.4%/179.0%/169.1%/185.7%의 전격 속성 대미지를 주고, 100%의 고정 확률로 2턴 동안 스킬 메인 목표를 감전 상태에 빠뜨린다. 해당 적이 받는 전격 대미지가 10% 증가하며 2턴 동안 지속된다."
  },
  "passive1": {
    "name": "힘",
    "element": "패시브",
    "description": "감전 효과 부여 시 66.0%의 고정 확률로 감전 효과를 1턴 연장한다."
  },
  "passive2": {
    "name": "수호",
    "element": "패시브",
    "description": "페르소나 스킬을 사용 후 2턴 동안 스킬 메인 목표가 받는 전격 속성 대미지가 20.0% 증가한다(2회 중첩 가능)."
  }
};
window.enCharacterSkillsData["모토하"] = {
  "name": "Motoha Arai",
  "skill1": {
    "name": "Wrathful Thunder",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Electric damage to random foes equal to 76.7%/84.5%/79.9%/87.7% of Attack (4 hits), and inflict Shock on main target for 2 turns. Prioritizes targeting different foes, and repeated hits on same foe deal 10% decreased damage."
  },
  "skill2": {
    "name": "Blitz Mine",
    "element": "전격",
    "type": "단일피해",
    "sp": 18,
    "cool": 0,
    "description": "Deal Electric damage to 1 foe equal to 157.1%/173.2%/163.6%/179.7% of Attack. Increase party's Electric damage by 11.7%/11.7%/12.2%/12.2% for 2 turns."
  },
  "skill3": {
    "name": "Electroshark",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 24,
    "cool": 0,
    "description": "Deal Electric damage to all foes equal to 79.3%/87.4%/82.5%/90.6% of Attack. If a foe is Shocked, activate a Technical and deal bonus Electric damage equal to 42.8%/47.2%/44.5%/48.9% of Attack."
  },
  "skill_highlight": {
    "element": "전격",
    "type": "광역피해",
    "description": "Deal Electric damage to all foes equal to 162.4%/179.0%/169.1%/185.7% of Attack, inflict Shock on the main target for 2 turns, and increase Electric damage taken by 10% for 2 turns."
  },
  "passive1": {
    "name": "Extra Inning",
    "element": "패시브",
    "description": "When foes are Shocked, 66.0% chance to extend effect duration by 1 turn."
  },
  "passive2": {
    "name": "Line Drive to Pitcher",
    "element": "패시브",
    "description": "Increase Electric damage taken by main target of a skill by 20.0% for 2 turns. Stacks up to 2 times."
  }
};
window.jpCharacterSkillsData["모토하"] = {
  "name": "新井基葉",
  "skill1": {
    "name": "怒りの雷霆",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "攻撃力76.7%/84.5%/79.9%/87.7%の電撃属性ダメージを4回与える。2回目以降の攻撃は新たな対象が優先され、同一の対象に命中した時、与ダメージが10%に減少する。選択した対象には必ず攻撃を行い、2ターンの間、感電状態にする。"
  },
  "skill2": {
    "name": "ブリッツマイン",
    "element": "전격",
    "type": "단일피해",
    "sp": 18,
    "cool": 0,
    "description": "敵単体に攻撃力157.1%/173.2%/163.6%/179.7%の電撃属性ダメージを与え、味方全体の電撃属性の与ダメージが2ターンの間、11.7%/11.7%/12.2%/12.2%上昇する。"
  },
  "skill3": {
    "name": "ライトニングシャーク",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 24,
    "cool": 0,
    "description": "敵全体に攻撃力79.3%/87.4%/82.5%/90.6%の電撃属性ダメージを与える。攻撃後に感電状態の敵がいる時、テクニカルが発生し、敵全体に攻撃力42.8%/47.2%/44.5%/48.9%の電撃属性ダメージを追加で与える。"
  },
  "skill_highlight": {
    "element": "전격",
    "type": "광역피해",
    "description": "敵全体に攻撃力162.4%/179.0%/169.1%/185.7%の電撃属性ダメージを与え、選択した対象を2ターンの間、感電状態にし、電撃属性の被ダメージを10%上昇させる。"
  },
  "passive1": {
    "name": "延長戦",
    "element": "패시브",
    "description": "敵を感電状態にする時、66.0%の確率で効果時間を1ターン延長する。"
  },
  "passive2": {
    "name": "ピッチャーライナー",
    "element": "패시브",
    "description": "2ターンの間、自身のスキルによる攻撃時に選択した敵の電撃属性による被ダメージが20.0%上昇する。（2回分まで重ねがけ可能）。"
  }
};
