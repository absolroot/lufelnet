window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["이치고"] = {
  "name": "시카노 이치고",
  "skill1": {
    "name": "진홍빛 나비",
    "element": "주원",
    "type": "단일 피해",
    "sp": 20,
    "cool": 1,
    "description": "1명의 적에게 공격력 129.0%/142.2%/137.0%/150.2%의 주원 속성 대미지를 주고, 『원념』을 2중첩 추가한다. 대상의 현재 생명이 70%보다 높을 때 스킬 대미지가 200% 증가한다. 스킬로 목표 처치 시 스킬 효과가 1회 추가 발동된다(연속 발동 가능)."
  },
  "skill2": {
    "name": "붉은 장미의 키스",
    "element": "주원",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "1명의 적에게 공격력 92.9%/102.4%/98.6%/108.1%의 주원 속성 대미지를 주고, 『원념』을 4중첩 추가한다."
  },
  "skill3": {
    "name": "쉿! 처형 시간",
    "element": "주원",
    "type": "단일 피해",
    "sp": 22,
    "cool": 0,
    "description": "1명의 적에게 공격력 221.6%/244.3%/235.2%/257.9%+『원념』 중첩 수*11.7%/12.9%/12.4%/13.6%의 주원 속성 대미지를 주고, 『원념』 중첩 수가 10에 도달하면 추가로 공격력 103.3%/113.8%/109.6%/120.2%의 주원 속성 대미지를 준다. 동시에 『원념』의 지속 시간이 초기화된다."
  },
  "skill_highlight": {
    "element": "주원",
    "type": "단일피해",
    "cool": 4,
    "description": "1명의 적에게 공격력 457.1%/503.9%/485.2%/532.0%의 주원 속성 대미지를 주고, 3턴 동안 『원념』이 크리티컬을 발동할 수 있다. 목표의 모든 유형의 지속 대미지 효과를 즉시 1회 결산하고, 『원념』 효과를 2회 추가 결산한다."
  },
  "passive1": {
    "name": "집념",
    "element": "패시브",
    "description": "『집착』 1중첩마다 자신의 공격력이 15.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "애착",
    "element": "패시브",
    "description": "시카노 이치고가 필드에 있을 때 모든 아군의 지속 대미지 효과가 15.0% 증가한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["이치고"] = {
  "name": "Ichigo Shikano",
  "skill1": {
    "name": "Butterfly Beheadment",
    "element": "주원",
    "type": "단일피해",
    "sp": 20,
    "cool": 1,
    "description": "Deal Curse damage to 1 foe equal to 129.0%/142.2%/137.0%/150.2% of Attack, inflict 2 [Resentment] stacks on the target. When the target is above 70% current HP, increase skill damage by 200%. If this skill kills the target, activate this skill again (can chain activation).\n[Resentment]: Take Curse damage equal to 6%/12%/18% of Ichigo's Attack (effect increases at level 1/50/70) for 4 turns. Stacks up to 10 times. When a foe with [Resentment] dies, transfer its [Resentment] to the highest HP foe (cannot transfer to target with Null/Repel/Drain Curse)."
  },
  "skill2": {
    "name": "Blood Rose's Kiss",
    "element": "주원",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Curse damage to 1 foe equal to 92.9%/102.4%/98.6%/108.1% of Attack, inflict 4 [Resentment] stacks on the target."
  },
  "skill3": {
    "name": "Hush! It's Execution Time",
    "element": "주원",
    "type": "단일피해",
    "sp": 22,
    "cool": 0,
    "description": "Deal Curse damage to 1 foe equal to 221.6%/244.3%/235.2%/257.9% of Attack + [Resentment] stacks x 11.7%/12.9%/12.4%/13.6% of Attack, when [Resentment] stacks reach 10, deal bonus Curse damage equal to 103.3%/113.8%/109.6%/120.2% of Attack; Then refresh the duration of [Resentment]."
  },
  "skill_highlight": {
    "element": "주원",
    "type": "단일피해",
    "cool": 0,
    "description": "Deal Curse damage to 1 foe equal to 457.1%/503.9%/485.2%/532.0% of ATK, and make [Resentment] can deal critical for 3 turns. Immediately deal all Damage Over Time damage on the target and deal [Resentment] damage 2 times."
  },
  "passive1": {
    "name": "Obsession",
    "element": "패시브",
    "description": "Increase Attack by 15% for each [Obsessive Love] stack."
  },
  "passive2": {
    "name": "Attachment",
    "element": "패시브",
    "description": "When Ichigo is on the field, increase party's Damage Over Time Effect by 15%."
  }
};
window.jpCharacterSkillsData["이치고"] = {
  "name": "鹿野 苺",
  "skill1": {
    "name": "深紅の蝶",
    "element": "주원",
    "type": "단일피해",
    "sp": 20,
    "cool": 1,
    "description": "敵1体に攻撃力129.0%/142.2%/137.0%/150.2%の呪怨属性ダメージを与え、『怨念』を2スタック付与する。対象の現在HPが70%以上の場合、スキルダメージが200%増加する。スキルで敵を撃破した場合、スキル効果が1回追加発動する（連続発動可能）。"
  },
  "skill2": {
    "name": "紅薔薇のキス",
    "element": "주원",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "敵1体に攻撃力92.9%/102.4%/98.6%/108.1%の呪怨属性ダメージを与え、『怨念』を4スタック付与する。"
  },
  "skill3": {
    "name": "シッ！処刑の時間",
    "element": "주원",
    "type": "단일피해",
    "sp": 22,
    "cool": 0,
    "description": "敵1体に攻撃力221.6%/244.3%/235.2%/257.9% + 『怨念』スタック数 × 11.7%/12.9%/12.4%/13.6%の呪怨属性ダメージを与える。『怨念』が10スタックに達すると、追加で攻撃力103.3%/113.8%/109.6%/120.2%の呪怨属性ダメージを与える。同時に『怨念』の持続時間がリセットされる。"
  },
  "skill_highlight": {
    "element": "주원",
    "type": "단일피해",
    "cool": 0,
    "description": "敵1体に攻撃力457.1%/503.9%/485.2%/532.0%の呪怨属性ダメージを与え、3ターンの間『怨念』がクリティカル発動可能になる。対象の全ての持続ダメージ効果を即時1回結算し、『怨念』効果を追加で2回結算する。"
  },
  "passive1": {
    "name": "執着",
    "element": "패시브",
    "description": "『執着』1スタックごとに自身の攻撃力が15.0%増加する。"
  },
  "passive2": {
    "name": "愛着",
    "element": "패시브",
    "description": "鹿野 苺がフィールドにいる時、味方全体の持続ダメージ効果が15.0%増加する。"
  }
};
