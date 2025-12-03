window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["유카리"] = {
  "name": "타케바 유카리",
  "skill1": {
    "name": "윈드 스톰",
    "element": "질풍",
    "type": "단일 피해",
    "sp": 23,
    "cool": 0,
    "description": "1명의 적에게 공격력 200.1%/220.6%/212.4%/232.9%의 질풍 속성 대미지를 주고 100%의 기본 확률로 목표를 풍습 상태에 빠지게 하며, 목표를 『바람의 흔적』 상태에 빠지게 한다. 2턴 동안 지속되며, 필드에는 동시에 1개의 『바람의 흔적』 상태만 존재할 수 있다. 『바람의 흔적』 상태의 적 사망 시, 『바람의 흔적』은 생명이 가장 높은 적에게로 전이된다.\n\n패시브 : 아군 동료가 스킬 시전 시 임의 스킬 목표가 『바람의 흔적』을 보유하면 해당 스킬 공격력이 8.8%/9.7%/9.3%/10.2% 증가하고, 유카리의 공격력 100포인트마다 공격력이 0.72% 증가한다. 상한은 29.3%/32.3%/31.1%/34.1%이다."
  },
  "skill2": {
    "name": "바람의 추적자",
    "element": "버프광역",
    "type": "",
    "sp": 25,
    "cool": 0,
    "description": "모든 동료의 받는 대미지가 29.3%/32.3%/31.1%/34.1% 감소하며 3턴 동안 지속된다. 또한 메인 목표의 공격력이 7.8%/8.6%/8.3%/9.1% 증가하고, 자신의 공격력 100포인트마다 공격력이 0.78% 증가한다(상한 31.2%/34.4%/33.2%/36.4%).\n 자신의 공격력 100포인트마다 대미지가 0.24% 증가한다(상한 9.8%/10.8%/10.4%/11.4%). 효과는 2턴 동안 지속된다."
  },
  "skill3": {
    "name": "리바이브 애로",
    "element": "치료광역",
    "type": "",
    "sp": 27,
    "cool": 0,
    "description": "모든 동료가 유카리 공격력 39.1%/43.1%/41.5%/45.6% + 2507/3158/3081/3773의 생명을 회복한다. 모든 『바람의 언어』를 소모하며, 『바람의 언어』를 1중첩 소모할 때마다 스킬 메인 목표의 테우르기아 에너지를 17.5포인트 회복하며, 목표가 다음에 테우르기아를 사용한 후 2턴 동안 공격력이 29.3%/32.3%/31.1%/34.1% 증가한다(2회 중첩 가능). (회복한 테우르기아 에너지가 초과될 경우 해당 에너지는 잠시 저장되며, 목표가 테우르기아를 시전한 후 반환된다. 최대로 목표의 테우르기아 에너지 상한만큼 저장되며, 초과된 에너지는 최대 2턴 동안 저장된다). 만약 스킬 메인 목표가 S.E.E.S. 멤버가 아닌 경우, 『바람의 언어』를 1중첩 소모할 때마다 해당 목표가 다음 HIGHLIGHT 사용 시 총 대미지가 9.8%/10.8%/10.4%/11.4% 증가한다."
  },
  "skill_highlight": {
    "name": "테우르기아 - 사이클론 애로",
    "element": "질풍",
    "type": "",
    "description": "발동 조건: 테우르기아 에너지 70포인트\n1명의 적에게 공격력 406.0%/447.6%/431.0%/472.6%의 질풍 속성 대미지를 주고, 자신의 공격력 100포인트마다 아군 전체의 주는 대미지가 0.48% 증가한다(상한 19.5%/21.5%/20.7%/22.7%).\n목표의 버프 효과 2개를 제거하고, 100%의 기본 확률로 목표가 풍습 상태에 빠지며, 목표가 『바람의 흔적』을 획득한다. 효과는 2턴 동안 지속된다."
  },
  "skill_support": {
    "name": "지원 기술",
    "element": "버프",
    "type": "",
    "description": "아군 1명의 상태이상을 1개 해제합니다."
  },
  "passive1": {
    "name": "교감",
    "element": "패시브",
    "description": "타케바 유카리가 필드에 있을 시, 아군 전체의 HIGHLIGHT/테우르기아의 대미지가 45.0% 증가한다."
  },
  "passive2": {
    "name": "승부욕",
    "element": "패시브",
    "description": "전투 중 자신의 공격력 100포인트마다 최대 생명이 60포인트 증가하며, 상한은 2700이다."
  }
};
window.enCharacterSkillsData["유카리"] = {
  "name": "Yukari Takeba",
  "skill1": {
    "name": "Wind Burst",
    "element": "질풍",
    "type": "단일 피해",
    "sp": 23,
    "cool": 0,
    "description": "Deal Wind damage to 1 foe equal to 200.1%/220.6%/212.4%/232.9% of Attack, with a 100% base chance to inflict Windswept, then inflict the target with [Wind Erosion] for 2 turns, there can only be 1 [Wind Erosion]. When foe with [Wind Erosion] is defeated, transfer their [Wind Erosion] to the foe with the highest HP.\nPassive: When allies use skills, if any skill target has [Wind Erosion], increase skill Attack by 8.8%/9.7%/9.3%/10.2% + 0.72% for every 100 Attack, up to 29.3%/32.3%/31.1%/34.1%."
  },
  "skill2": {
    "name": "Windchaser’s Breath",
    "element": "버프광역",
    "type": "",
    "sp": 25,
    "cool": 0,
    "description": "Decrease party's damage taken by 29.3%/32.3%/31.1%/34.1% for 3 turns; Then increase the main target's Attack by 7.8%/8.6%/8.3%/9.1% + 0.78% for every 100 Attack, up to 31.2%, and damage by 0.24% for every 100 Attack, up to 9.8%/10.8%/10.4%/11.4%. Lasts for 2 turns."
  },
  "skill3": {
    "name": "Arrow of Rejuvenation",
    "element": "치료광역",
    "type": "",
    "sp": 27,
    "cool": 0,
    "description": "Restore party's HP by 39.1%/43.1%/41.5%/45.6% of Yukari's Attack + 2507/3158/3081/3773. Spend all [Wind Whisper], for every stack of [Wind Whisper] spent, restore 17.5 Theurgy Energy to the main target, then increase the target's Attack after using Theurgy by 29.3%/32.3%/31.1%/34.1% for 2 turns. Stacks up to 2 times. (When restoring Theurgy Energy, save the overflow Theurgy Energy then return it after the target used Theurgy, up to their Theurgy Energy cap. Lasts for 2 turns.) If the main target is not a S.E.E.S. member, then for every stack of [Wind Whisper] spent, increase their next Highlight total damage by Total DMG Amp by 9.8%/10.8%/10.4%/11.4%."
  },
  "skill_highlight": {
    "name": "Theurgy - Cyclone Arrow",
    "element": "질풍",
    "type": "",
    "description": "Use condition: When Yukari has 70 Theurgy Energy\nDeal Wind damage to 1 foe equal to 406.0%/447.6%/431.0%/472.6% of Attack. Increase party's damage by 0.48% for every 100 Attack, up to 19.5%/21.5%/20.7%/22.7%; Remove 2 buffs on the target, with a 100% base chance to inflict Windswept, then inflict the target with [Wind Erosion] for 2 turns."
  },
  "skill_support": {
    "name": "Assist Skill",
    "element": "버프",
    "type": "",
    "description": "Cure 1 debuff from 1 ally."
  },
  "passive1": {
    "name": "Chemistry",
    "element": "패시브",
    "description": "When Yukari is on the field, increase party's Highlight/Theurgy damage by 45%."
  },
  "passive2": {
    "name": "Competitiveness",
    "element": "패시브",
    "description": "During battle, increase Yukari's max HP by 100 for every 60 Attack, up to 2700."
  }
};
window.jpCharacterSkillsData["유카리"] = {
  "name": "岳羽 ゆかり",
  "skill1": {
    "name": "ウィンドストーム",
    "element": "질풍",
    "type": "단일 피해",
    "sp": 23,
    "cool": 0,
    "description": "敵1体に攻撃力200.1%/220.6%/212.4%/232.9%の疾風属性ダメージを与え、100%の基本確率で風纏い状態にし、『風の痕跡』を付与する。持続時間は2ターンで、フィールドには同時に1つの『風の痕跡』しか存在できない。『風の痕跡』状態の敵が倒れると、最もHPが高い敵に転移する。\n\nパッシブ：味方がスキルを使用した際、対象が『風の痕跡』を持っている場合、そのスキルのダメージが8.8%/9.7%/9.3%/10.2%増加し、岳羽 ゆかりの攻撃力100ごとにさらに0.72%増加する（上限29.3%/32.3%/31.1%/34.1%）。"
  },
  "skill2": {
    "name": "風の追跡者",
    "element": "버프광역",
    "type": "",
    "sp": 25,
    "cool": 0,
    "description": "味方全体の被ダメージを29.3%/32.3%/31.1%/34.1%減少させ、3ターン持続する。さらにメイン対象の攻撃力を7.8%/8.6%/8.3%/9.1%上昇させ、岳羽 ゆかりの攻撃力100ごとに0.78%上昇する（上限31.2%/34.4%/33.2%/36.4%）。加えて、攻撃力100ごとにダメージが0.24%増加し（上限9.8%/10.8%/10.4%/11.4%）、2ターン持続する。"
  },
  "skill3": {
    "name": "リバイブアロー",
    "element": "치료광역",
    "type": "",
    "sp": 27,
    "cool": 0,
    "description": "味方全体のHPを岳羽 ゆかりの攻撃力39.1%/43.1%/41.5%/45.6% + 2507/3158/3081/3773回復する。全ての『風の言霊』を消費し、消費したスタックごとにメイン対象のテウルギアエネルギーを17.5回復し、対象が次にテウルギアを使用した後、2ターンの間攻撃力が29.3%/32.3%/31.1%/34.1%上昇する（最大2回まで重複）。（超過したテウルギアエネルギーは一時的に保存され、対象がテウルギアを発動後に返還される。保存上限は対象の最大テウルギアエネルギーで、最大2ターン持続。）メイン対象がS.E.E.S.メンバーでない場合、消費した『風の言霊』1スタックごとに次のHIGHLIGHTダメージが9.8%/10.8%/10.4%/11.4%増加する。"
  },
  "skill_highlight": {
    "name": "テウルギア - サイクロンアロー",
    "element": "질풍",
    "type": "",
    "description": "発動条件：テウルギアエネルギー70\n敵1体に攻撃力406.0%/447.6%/431.0%/472.6%の疾風属性ダメージを与え、岳羽 ゆかりの攻撃力100ごとに味方全体の与ダメージが0.48%増加する（上限19.5%/21.5%/20.7%/22.7%）。対象のバフを2つ解除し、100%の基本確率で風纏い状態にし、『風の痕跡』を付与する。効果は2ターン持続。"
  },
  "skill_support": {
    "name": "サポートスキル",
    "element": "버프",
    "type": "",
    "description": "味方1体の状態異常を1つ解除する。"
  },
  "passive1": {
    "name": "共感",
    "element": "패시브",
    "description": "岳羽 ゆかりがフィールドにいる時、味方全体のHIGHLIGHT/テウルギアのダメージが45.0%増加する。"
  },
  "passive2": {
    "name": "勝負欲",
    "element": "패시브",
    "description": "戦闘中、岳羽 ゆかりの攻撃力100ごとに最大HPが60上昇し、上限は2700となる。"
  }
};
