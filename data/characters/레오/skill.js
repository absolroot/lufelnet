window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["레오"] = {
  "name": "카미야마 레오",
  "skill1": {
    "name": "핵열의 환상",
    "element": "핵열",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "1명의 적에게 공격력 170.8%/188.3%/177.8%/195.3%의 핵열 속성 대미지를 준다. 스킬 시전 시 아군 전체가 보유한 『활성화』 1중첩마다 스킬 대미지가 10% 증가한다."
  },
  "skill2": {
    "name": "생명 추출",
    "element": "버프",
    "type": "버프",
    "sp": 20,
    "cool": 0,
    "description": "동료 1명의 현재 생명의 30%를 80%의 비율로 실드로 전환하며, 추가로 카미야마 레오 공격력 31.6%/31.6%/32.9%/32.9%+900/1095/1035/1230의 실드를 부여한다. 실드는 2턴 동안 지속된다. 또한 『활성』 1중첩을 획득한다."
  },
  "skill3": {
    "name": "용맹 전환",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "동료 1명의 공격력이 2턴 동안 19.5%/19.5%/20.3%/20.3% 증가한다. 효과가 지속되는 동안 목표가 보유하고 있는 『활성』 1중첩당 카미야마 레오 공격력의 20%만큼 공격력이 증가한다. 최대 1516.7/1672.1/1578.9/1734.3 공격력이 증가한다."
  },
  "skill_highlight": {
    "element": "버프",
    "type": "버프",
    "description": "2턴 동안 동료 1명이 『활성』을 최대 횟수만큼 획득한다. 목표의 생명이 60% 미만일 시 생명을 60%까지 회복시키며, 생명 회복 상한은 카미야마 레오 공격력의 200%다. 2턴 동안 카미야마 레오 공격력의 15%만큼 공격력이 증가한다. 상한은 585.6/645.6/609.6/669.6포인트다.",
    "cool": 4
  },
  "passive1": {
    "name": "항쟁",
    "element": "패시브",
    "description": "『생명 추출』 스킬 지속시간이 끝난 후, 남은 실드값의 100.0%에 따라 생명을 회복한다.",
    "cool": 0
  },
  "passive2": {
    "name": "동행",
    "element": "패시브",
    "description": "동료가 『활성』 효과 2중첩을 보유할 경우 크리티컬 효과가 추가로 45.0% 증가한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["레오"] = {
  "name": "Leo Kamiyama",
  "skill1": {
    "name": "Atomic Smash",
    "element": "핵열",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Nuclear damage to 1 foe equal to 170.8%/188.3%/177.8%/195.3% of Attack. For each stack of Power of Friendship the party has, increase damage by 10%."
  },
  "skill2": {
    "name": "Justice Barrier",
    "element": "치료",
    "type": "버프",
    "sp": 20,
    "cool": 0,
    "description": "Spend 30% of 1 other ally's remaining HP to grant them a shield equal to 80% of HP spent + 31.6%/31.6%/32.9%/32.9% of Kamiyama's Attack + 900/1095/1035/1230 for 2 turns.\nAlso grant 1 Power of Friendship stack."
  },
  "skill3": {
    "name": "Ultima Booster",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "Increase 1 ally's Attack by 19.5%/19.5%/20.3%/20.3% for 2 turns (other than Kamiyama).\nFor each stack of Power of Friendship the target has, increase Attack by 20% of Kamiyama's Attack more (up to 1516.7/1672.1/1578.9/1734.3)."
  },
  "skill_highlight": {
    "element": "버프",
    "type": "버프",
    "description": "Grant the maximum number of Power of Friendship stacks to 1 ally (other than Kamiyama) for 2 turns. If the target's remaining HP is below 60%, restore their HP up to 60% (healing is limited to 200% of Kamiyama's Attack). Increase Attack by 15% of Kamiyama's Attack (up to 585.6/645.6/609.6/669.6) for 2 turns.",
    "cool": 4
  },
  "passive1": {
    "name": "Energy Recharge",
    "element": "패시브",
    "description": "When Justice Barrier ends, restore HP equal to 100.0% of remaining shield.",
    "cool": 0
  },
  "passive2": {
    "name": "Full Power: Start!",
    "element": "패시브",
    "description": "Increase allies' critical damage by 45.0% when they have 2 Power of Friendship stacks.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["레오"] = {
  "name": "神山 嶺央",
  "skill1": {
    "name": "アトミックボンバー",
    "element": "핵열",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "敵単体に攻撃力170.8%/188.3%/177.8%/195.3%の核熱属性ダメージを与える。味方全体の『友情パワー』１つごとに与ダメージが１０%上昇する。"
  },
  "skill2": {
    "name": "ジャスティスバリアー",
    "element": "치료",
    "type": "버프",
    "sp": 20,
    "cool": 0,
    "description": "自身以外の味方単体の残りＨＰの３０%を消費し、２ターンの間、消費したＨＰの８０%と、神山の攻撃力31.6%/31.6%/32.9%/32.9%＋900/1095/1035/1230分のシールドを付与する。\nさらに『友情パワー』を１つ付与する。"
  },
  "skill3": {
    "name": "アルティマブースター",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "２ターンの間、味方単体の攻撃力を19.5%/19.5%/20.3%/20.3%上昇させる。\nその味方の『友情パワー』の累積数に応じて、追加で攻撃力が神山の攻撃力２０%分（最大1516.7/1672.1/1578.9/1734.3まで）上昇する。"
  },
  "skill_highlight": {
    "element": "버프",
    "type": "버프",
    "description": "自身以外の味方単体の『友情パワー』の累積数を２ターンの間、最大状態にする。対象の残りのＨＰが６０%未満の時、そのＨＰを最大で６０%まで回復する。ただし回復量は神山の攻撃力の２００%が上限となる。さらに２ターンの間、攻撃力を神山の攻撃力１５%分（最大585.6/645.6/609.6/669.6まで）上昇させる。",
    "cool": 4
  },
  "passive1": {
    "name": "エネルギー充填",
    "element": "패시브",
    "description": "『ジャスティスバリアー』の効果が終了した時、ＨＰを残シールド量の100.0%分回復する。",
    "cool": 0
  },
  "passive2": {
    "name": "パワー全・開！",
    "element": "패시브",
    "description": "『友情パワー』を２つ付与された味方のクリティカルダメージを45.0%上昇させる。",
    "cool": 0
  }
};
