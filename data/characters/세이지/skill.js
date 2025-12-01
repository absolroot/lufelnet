window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["세이지"] = {
  "name": "시라토리 세이지",
  "skill1": {
    "name": "바람의 속삭임",
    "element": "질풍",
    "type": "단일피해",
    "sp": 16,
    "cool": 0,
    "description": "1명의 적에게 공격력 42.9%/47.3%/44.7%/49.1%의 질풍 속성 대미지를 4회 주고, 19.2%/19.2%/20.4%/20.4%의 기본 확률로 적을 풍습 상태에 빠뜨린다. 효과는 2턴 동안 지속된다."
  },
  "skill2": {
    "name": "우아한 풍파",
    "element": "질풍광역",
    "type": "광역피해",
    "sp": 19,
    "cool": 0,
    "description": "모든 적에게 공격력 24.2%/26.6%/25.2%/27.6%의 질풍 속성 대미지를 3회 준다. 공격 시 적의 수량에 따라 (적의 수량*48.8%/48.8%/50.8%/50.8%)의 기본 확률로 『격려』 상태를 획득한다."
  },
  "skill3": {
    "name": "무영의 찌르기",
    "element": "질풍",
    "type": "단일피해",
    "sp": 18,
    "cool": 0,
    "description": "1명의 적에게 공격력 53.2%/58.6%/55.4%/60.8%의 질풍 속성 대미지를 3회 주고, 『격려』 상태가 3중첩 이상이면 해당 스킬로 추가 대미지를 1회 주고 크리티컬 확률이 20% 증가한다."
  },
  "skill_highlight": {
    "element": "질풍",
    "type": "단일피해",
    "description": "1명의 적에게 공격력 58.6%/64.6%/61.0%/67.0%의 질풍 속성 대미지를 4회 준다. 해당 스킬을 사용할 때 자신이 『격려』 상태를 3중첩 이상 보유할 시 대미지 횟수가 1회 증가한다."
  },
  "passive1": {
    "name": "초점",
    "element": "패시브",
    "description": "『무영의 찌르기』 스킬을 사용해 풍습 상태인 적에게 대미지를 주면 100.0%의 고정 확률로 추가 대미지를 1회 준다."
  },
  "passive2": {
    "name": "침울",
    "element": "패시브",
    "description": "턴 종료 시 60.0%의 고정 확률로 『격려』 1중첩을 획득한다."
  }
};
window.enCharacterSkillsData["세이지"] = {
  "name": "Seiji Shiratori",
  "skill1": {
    "name": "Blustering Épée",
    "element": "질풍",
    "type": "단일피해",
    "sp": 16,
    "cool": 0,
    "description": "Deal Wind damage to 1 foe equal to 42.9%/47.3%/44.7%/49.1% of Attack (4 hits). 19.2%/19.2%/20.4%/20.4% chance to inflict Windswept for 2 turns."
  },
  "skill2": {
    "name": "Graceful Gale",
    "element": "질풍광역",
    "type": "광역피해",
    "sp": 19,
    "cool": 0,
    "description": "Deal Wind damage to all foes equal to 24.2%/26.6%/25.2%/27.6% of Attack (3 hits). Gain 1 Right to Strike stack with a chance equal to the number of foes present when using the skill × 48.8%/48.8%/50.8%/50.8%."
  },
  "skill3": {
    "name": "Saber Surge",
    "element": "질풍",
    "type": "단일피해",
    "sp": 18,
    "cool": 0,
    "description": "Deal Wind damage to 1 foe equal to 53.2%/58.6%/55.4%/60.8% of Attack (3 hits). When Right to Strike is at 3 or more stacks, deal 1 additional hit and increase critical rate by 20%."
  },
  "skill_highlight": {
    "name": "Highlight",
    "element": "질풍",
    "type": "단일피해",
    "sp": 0,
    "cool": 0,
    "description": "Deal Wind damage to 1 foe equal to 58.6%/64.6%/61.0%/67.0% of Attack (4 hits). When Right to Strike is at 3 or more stacks, increase hits by 1."
  },
  "passive1": {
    "name": "Chivalrous Spirit",
    "element": "패시브",
    "description": "When attacking a Windswept foe with Saber Surge, 100.0% chance to deal 1 additional hit."
  },
  "passive2": {
    "name": "Coup Droit",
    "element": "패시브",
    "description": "At the end of turn, 60.0% chance to gain 1 Right to Strike stack."
  }
};
window.jpCharacterSkillsData["세이지"] = {
  "name": "白鳥 誠司",
  "skill1": {
    "name": "突風のエペ",
    "element": "질풍",
    "type": "단일피해",
    "sp": 16,
    "cool": 0,
    "description": "敵単体に攻撃力42.9%/47.3%/44.7%/49.1%の疾風属性ダメージを4回与え、19.2%/19.2%/20.4%/20.4%の確率で敵を2ターンの間、風襲状態にする。"
  },
  "skill2": {
    "name": "優雅なる暴風",
    "element": "질풍광역",
    "type": "광역피해",
    "sp": 19,
    "cool": 0,
    "description": "敵全体に攻撃力24.2%/26.6%/25.2%/27.6%の疾風属性ダメージを3回与え、スキル使用時の敵の数×48.8%/48.8%/50.8%/50.8%の確率で『アタック権』を1つ獲得する。"
  },
  "skill3": {
    "name": "吹き荒ぶサーブル",
    "element": "질풍",
    "type": "단일피해",
    "sp": 18,
    "cool": 0,
    "description": "敵単体に攻撃力53.2%/58.6%/55.4%/60.8%の疾風属性ダメージを3回与える。『アタック権』を3つ以上獲得している時、攻撃回数が1回増加し、クリティカル率が20%上昇する。"
  },
  "skill_highlight": {
    "element": "질풍",
    "type": "단일피해",
    "sp": 0,
    "cool": 0,
    "description": "敵単体に攻撃力58.6%/64.6%/61.0%/67.0%の疾風属性ダメージを4回与える。『アタック権』を3つ以上獲得している時、攻撃回数が1回増加する。"
  },
  "passive1": {
    "name": "果敢なる騎士道",
    "element": "패시브",
    "description": "『吹き荒ぶサーブル』で風襲状態の敵を攻撃した時、100.0%の確率で攻撃回数が1回増加する。"
  },
  "passive2": {
    "name": "クー・ドロワ",
    "element": "패시브",
    "description": "自身の行動が終了した時、60.0%の確率で『アタック権』を1つ獲得する。"
  }
};
