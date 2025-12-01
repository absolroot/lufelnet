window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["마나카"] = {
  "name": "나가오 마나카",
  "skill1": {
    "name": "천공의 노래",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "모든 동료의 주는 대미지가 7.0%/7.7%/7.8%/8.5%+(나가오 마나카의 공격력 164포인트당 1%의 대미지 보너스 추가 제공, 최대 28.0%/31.8%/31.4%/34.2% 추가)증가하며 2턴 동안 지속된다. 자신이 『성가』를 4중첩 획득한다."
  },
  "skill2": {
    "name": "치유 빛의 노래",
    "element": "치료광역",
    "type": "치료",
    "cool": 8,
    "description": "모든 동료가 공격력 10.0%/10.0%/11.2%/11.2%+681/816/989/1124의 생명을 회복하고, 모든 동료의 디버프 상태 1종을 제거한다. 『성가』 보유 시 『성가』를 1중첩 소모하여 해당 스킬 시전 후 필요한 준비 시간을 1회 행동만큼 감소시킨다. 이러한 방식으로 준비 시간을 최대 4회 행동만큼 감소시킬 수 있다. 해당 스킬을 직접 발동 시 치료량이 50% 증가한다.\n패시브: 전투 중 나가오 마나카가 『성가』를 12중첩 획득할 때마다 해당 스킬의 치료 효과를 자동으로 1회 시전한다."
  },
  "skill3": {
    "name": "시공의 윤회",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "모든 동료의 공격력이 나가오 마나카의 공격력 11%+128/141/143/156만큼 증가한다. 모든 『성가』를 소모하며,『성가』를 1중첩 소모할 때마다 2턴 동안 모든 동료의 관통이 증가하고(나가오 마나카의 공격력 460포인트마다 관통 0.1% 증가), 공격력이 증가한다(나가오 마나카의 공격력 460포인트마다 공격력 0.1% 증가).(해당 스킬은 최대 나가오 마나카의 공격력 4600/5060/5980/6440포인트까지 계산)"
  },
  "skill_highlight": {
    "name": "속성 증가",
    "element": "패시브",
    "description": "해명 괴도 각 속성의 20%만큼 출전 중인 모든 동료의 상응한 속성 수치가 증가한다."
  },
  "passive1": {
    "name": "날갯짓",
    "element": "패시브",
    "description": "『천계의 선율』 상태인 동료의 공격력이 37.5% 증가한다."
  },
  "passive2": {
    "name": "결심",
    "element": "패시브",
    "description": "누적 획득한 『성가』 중첩 수에 따라 중첩당 모든 동료의 관통이 1.0% 증가한다(최대 12중첩 적용)."
  }
};
window.enCharacterSkillsData["마나카"] = {
  "name": "Manaka Nagao",
  "skill1": {
    "name": "Choir of Doves",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "Increase party's damage by 7.0%/7.7%/7.8%/8.5% + 1% for every 164 points of Manaka's Attack, up to 28.0%/31.8%/31.4%/34.2%. Lasts for 2 turn. Manaka gains 4 [Holy Song] stacks."
  },
  "skill2": {
    "name": "Poem of Radiance",
    "element": "치료광역",
    "type": "치료",
    "cool": 8,
    "description": "Restore party's HP by 10.0%/10.0%/11.2%/11.2% of Manaka's Attack + 681/816/989/1124, and cure 1 debuff. When Manaka has [Holy Song], spend 1 [Holy Song] stack to decrease skill cooldown by 1 action, up to 4 actions. When Manaka manually uses this skill, increase healing by 50%. \nPassive: After Manaka gained 12 [Holy Song] stacks, automatically activate the healing from this skill once."
  },
  "skill3": {
    "name": "Wheel of Time",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "Increase party's Attack by 11% + 128/141/143/156 of Manaka's Attack. Spend all [Holy Song], for each [Holy Song] stack spent, increase party's pierce rate by 0.1% for every 460 points of Manaka's Attack, and Attack by 0.2% for every 460 points of Manaka's Attack. Lasts for 2 turns. (Up to 4600/5060/5980/6440 points of Attack)"
  },
  "skill_highlight": {
    "name": "Stat Buff",
    "element": "패시브",
    "description": "Increase party's stats by 15% of Manaka's stats."
  },
  "passive1": {
    "name": "Grace",
    "element": "패시브",
    "description": "Increase ATK for allies during [Myriad Song] by 37.5%."
  },
  "passive2": {
    "name": "Resilience",
    "element": "패시브",
    "description": "Based on gained [Holy Song] stacks, increase party's pierce rate by 1.0%. Stacks up to 12 times."
  }
};
window.jpCharacterSkillsData["마나카"] = {
  "name": "長尾 愛歌",
  "skill1": {
    "name": "天空の歌",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "味方全体の与ダメージが7.0%/7.7%/7.8%/8.5%上昇し、さらに長尾 愛歌の攻撃力164ごとに1%の追加攻撃倍率+（最大28.0%/31.8%/31.4%/34.2%）を得る。効果は2ターン持続。『聖歌』を4スタック獲得する。"
  },
  "skill2": {
    "name": "癒しの光の歌",
    "element": "치료광역",
    "type": "치료",
    "cool": 8,
    "description": "味方全体のHPを攻撃力10.0%/10.0%/11.2%/11.2%+681/816/989/1124回復し、味方全体のデバフ1種類を解除する。『聖歌』がある場合、『聖歌』を1スタック消費して、このスキルの準備時間を1行動分短縮する。この方法で最大4行動分まで短縮可能。スキルを直接発動すると回復量が50%増加する。\nパッシブ：戦闘中、長尾 愛歌が『聖歌』を12スタック獲得すると、この回復効果が自動で1回発動する。"
  },
  "skill3": {
    "name": "時空の輪廻",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "味方全体の攻撃力が長尾 愛歌の攻撃力11%+128/141/143/156上昇する。すべての『聖歌』を消費し、消費した『聖歌』1スタックごとに味方全体の貫通が上昇（長尾 愛歌の攻撃力460ごとに0.1%）、攻撃力も上昇する（長尾 愛歌の攻撃力460ごとに0.1%）。このスキルは最大で長尾 愛歌の攻撃力4600/5060/5980/6440まで計算される。"
  },
  "skill_highlight": {
    "name": "ステータス強化",
    "element": "패시브",
    "description": "長尾のステータスの20%分、味方全体のステータスを上昇させる。"
  },
  "passive1": {
    "name": "羽ばたき",
    "element": "패시브",
    "description": "『天界の旋律』状態の味方の攻撃力が37.5%上昇する。"
  },
  "passive2": {
    "name": "決意",
    "element": "패시브",
    "description": "累積獲得した『聖歌』のスタック数に応じて、1スタックごとに味方全体の貫通が1.0%上昇する（最大12スタック適用）。"
  }
};
