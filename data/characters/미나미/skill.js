window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["미나미"] = {
  "name": "미야시타 미나미",
  "skill1": {
    "name": "은방울꽃 계시",
    "element": "축복",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "1명의 적에게 최대 생명 56.9%/62.7%/60.4%/66.2%의 축복 속성 대미지를 주고, 모든 동료가 축복 효과 1중첩을 획득한다. 동시에 자신은 『암리타』 효과 1중첩을 획득한다."
  },
  "skill2": {
    "name": "치유의 축복",
    "element": "치료",
    "type": "제거",
    "sp": 25,
    "cool": 0,
    "description": "즉시 지정 아군 유닛과 현재 생명이 가장 적은 괴도 1명의 생명을 미야시타 미나미의 최대 생명 17.4%/17.4%/18.5%/18.5%+1488/1810/1829/2151만큼 회복시키고, 디버프 상태 2종을 제거한다. 동시에 치료를 받은 괴도는 축복 효과를 1중첩 획득하며, 해당 괴도의 턴 시작 시 미야시타 미나미 최대 생명 13.9%/13.9%/14.8%/14.8%+1190/1446/1463/1719만큼의 생명을 회복시킨다. 효과는 2턴 동안 지속된다.\n자신이 『암리타』 효과를 1중첩 획득한다."
  },
  "skill3": {
    "name": "봄의 은혜",
    "element": "치료광역",
    "type": "광역치료",
    "sp": 32,
    "cool": 0,
    "description": "모든 암리타 중첩수를 소모해 지정한 아군 유닛의 생명을 미야시타 미나미의 최대 생명 15.8%/15.8%/16.8%/16.8%+1347/1665/1656/1974만큼 회복시키고, 같은 치료 효과로 현재 생명이 가장 적은 괴도를 2회 치료한다. 『암리타』 효과를 1중첩 소모할 때마다 1회 추가 치료한다. 동시에 『암리타』 효과를 1중첩 소모할 때마다 자신을 제외한 기타 괴도는 미야시타 미나미의 최대 생명 7.5%(최대 1057/1057/1226/1226)만큼의 최대 생명 증가 효과를 1중첩 획득하며 2턴 동안 지속된다."
  },
  "skill_highlight": {
    "element": "치료광역",
    "type": "광역치료",
    "description": "즉시 전체 아군 괴도가 미야시타 미나미의 최대 생명 17.6%/17.6%/18.6%/18.6%+1500/1824/1844/2168의 생명을 회복하고 디버프 상태 1종을 제거하며, 목표는 미야시타 미나미의 최대 생명 16.5%(최대 2326/2326/2697/2697포인트)만큼의 최대 생명 증가 효과를 획득한다. 효과는 2턴 동안 지속된다. 동시에 목표 행동 후 미야시타 미나미의 최대 생명 6.5%/6.5%/6.9%/6.9%+556/676/683/803만큼의 생명을 회복하며 1턴 동안 지속된다."
  },
  "passive1": {
    "name": "축복",
    "element": "패시브",
    "description": "치료를 받은 유닛은 자신의 축복 효과 중첩수에 따라 1턴 동안 대미지 증가를 획득하며, 증가값은(15.0%3.0%×축복 효과 중첩수, 최대 30.0%)이다."
  },
  "passive2": {
    "name": "자비심",
    "element": "패시브",
    "description": "전투 진입 시 미나미의 최대 생명의 10.0%에 따라 모든 괴도의 최대 생명이 증가한다.(최대 1500포인트)"
  }
};
window.enCharacterSkillsData["미나미"] = {
  "name": "Minami Miyashita",
  "skill1": {
    "name": "Nurse's Light",
    "element": "축복",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Bless damage to 1 foe equal to 56.9%/62.7%/60.4%/66.2% of Minami's max HP, and grant 1 Blessing stack to party. Also gain 1 Diagnosis stack."
  },
  "skill2": {
    "name": "Healing Grace",
    "element": "치료",
    "type": "제거",
    "sp": 25,
    "cool": 0,
    "description": "Restore HP equal to 17.4%/17.4%/18.5%/18.5% of Minami's max HP + 1488/1810/1829/2151 to the ally with the lowest HP and 1 selected ally, and cure 2 debuffs.\nGrant 1 Blessing stack to allies healed, and grant Minami 1 Diagnosis stack.\nAt the start of each turn for 2 turns, restore HP of allies healed by this skill equal to 13.9%/13.9%/14.8%/14.8% of Minami's max HP + 1190/1446/1463/1719."
  },
  "skill3": {
    "name": "Compassionate Cure",
    "element": "치료광역",
    "type": "광역치료",
    "sp": 32,
    "cool": 0,
    "description": "Spend all Diagnosis stacks, and restore HP to selected ally equal to 15.8%/15.8%/16.8%/16.8% of Minami's max HP + 1347/1665/1656/1974.\nAlso restore HP of the ally with the lowest HP with this effect 2 times.\nFor each Diagnosis stack, activate this effect 1 more time.\nFor each Diagnosis stack spent, increase the max HP of allies (other than Minami) by 7.5% of Minami's max HP for 2 turns (up to 1057/1057/1226/1226)."
  },
  "skill_highlight": {
    "element": "치료광역",
    "type": "광역치료",
    "description": "Restore party's HP by 17.6%/17.6%/18.6%/18.6% of Minami's max HP + 1500/1824/1844/2168, and cure 1 debuff.\nIncrease party's max HP by 16.5% of Minami's max HP (up to 2326/2326/2697/2697) for 2 turns. At the end of an action, restore HP equal to 6.5%/6.5%/6.9%/6.9% of Minami's max HP + 556/676/683/803 for 1 turn."
  },
  "passive1": {
    "name": "Health Comes First",
    "element": "패시브",
    "description": "After Minami heals an ally, increase that ally's damage by 15.0% + (3.0% × target ally's Blessing stacks) for 1 turn (up to 30%)."
  },
  "passive2": {
    "name": "Peace of Mind",
    "element": "패시브",
    "description": "At the start of battle, increase party's max HP by 10.0% of Minami's max HP (up to 1500)."
  }
};
window.jpCharacterSkillsData["미나미"] = {
  "name": "宮下 美波",
  "skill1": {
    "name": "ナーシングライト",
    "element": "축복",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "敵単体に最大ＨＰ56.9%/62.7%/60.4%/66.2%の祝福属性ダメージを与え、味方全体に祝印を1つ付与する。さらに美波が『カルテ』を1つ獲得する。"
  },
  "skill2": {
    "name": "トリートメントライト",
    "element": "치료",
    "type": "제거",
    "sp": 25,
    "cool": 0,
    "description": "選択した味方とＨＰが最も低い味方のＨＰを、美波の最大ＨＰ17.4%/17.4%/18.5%/18.5%＋1488/1810/1829/2151回復し、弱体状態を2つ治療する。\nさらに回復した味方に祝印を1つ付与し、美波が『カルテ』を1つ獲得する。\nこのスキルで回復された味方は、2ターンの間、ターン開始時にＨＰを自身の最大ＨＰ13.9%/13.9%/14.8%/14.8%＋1190/1446/1463/1719回復する。"
  },
  "skill3": {
    "name": "コンパッションヒール",
    "element": "치료광역",
    "type": "광역치료",
    "sp": 32,
    "cool": 0,
    "description": "『カルテ』を全て消費し、選択した味方のＨＰを、美波の最大ＨＰ15.8%/15.8%/16.8%/16.8%＋1347/1665/1656/1974回復する。\nさらにＨＰが低い順に同一効果で味方を2回回復する。\n『カルテ』1つにつき、追加で効果が1回発動する。\n加えて、消費した『カルテ』の数に応じて、2ターンの間、美波を除く味方の最大ＨＰを美波の最大ＨＰ7．5%（最大1057/1057/1226/1226まで）分上昇させる。"
  },
  "skill_highlight": {
    "element": "치료광역",
    "type": "광역치료",
    "description": "味方全体のＨＰを美波の最大ＨＰ17.6%/17.6%/18.6%/18.6%＋1500/1824/1844/2168回復し、弱体状態を1つ治療する。\nさらに2ターンの間、味方全員の最大ＨＰを美波の最大ＨＰ1６．5%（最大2326/2326/2697/2697まで）分上昇させ、加えて1ターンの間、行動後に美波の最大ＨＰ6.5%/6.5%/6.9%/6.9%＋556/676/683/803回復する。"
  },
  "passive1": {
    "name": "健康第一",
    "element": "패시브",
    "description": "美波から回復効果を受けた味方は、1ターンの間、与ダメージが15.0%＋3.0%×対象の味方の『祝印』の累積数分上昇し、最大30%まで上昇する。"
  },
  "passive2": {
    "name": "安心感",
    "element": "패시브",
    "description": "戦闘開始時、味方全体の最大ＨＰが美波の最大ＨＰ10.0%分（最大1500まで）上昇する。"
  }
};
