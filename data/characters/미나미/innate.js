window.innateData = window.innateData || {};

window.innateData["미나미"] = {
  "final_innate": [
    [
      {
        "attr": "Final Damage Mult.",
        "nature": "Bless",
        "value": "0.02",
        "type": "축복",
        "desc": "모든 축복 속성 아군의 최종 대미지 증가",
        "desc_en": "All Bless Attribute Allies' Final Damage Increase",
        "desc_jp": "祝福属性の味方全員の最終ダメージ上昇",
        "desc_cn": "所有祝福属性同伴的最终伤害提升"
      }
    ],
    [
      {
        "attr": "Bless Boost",
        "nature": "Bless",
        "value": "0.08",
        "type": "축복",
        "desc": "모든 축복 속성 아군의 축복 속성 대미지 보너스 증가",
        "desc_en": "All Bless Attribute Allies' Bless Attribute Damage Mult Increase",
        "desc_jp": "祝福属性の味方全員の祝福属性ダメージ倍率上昇",
        "desc_cn": "所有祝福属性同伴的祝福属性伤害倍率提升"
      },
      {
        "attr": "Bless Damage Taken",
        "nature": "Bless",
        "value": "-0.1",
        "type": "축복",
        "desc": "모든 축복 속성 아군의 축복 속성 받는 대미지 감소",
        "desc_en": "All Bless Attribute Allies' Bless Attribute DMG Taken Decrease",
        "desc_jp": "祝福属性の味方全員の祝福属性被ダメージ減少",
        "desc_cn": "所有祝福属性同伴的祝福属性受伤害降低"
      }
    ]
  ],
  "innate_awake_skill": [
    {
      "ascend": "0",
      "autoSelect": "Default",
      "cooldown": 0,
      "cost": "",
      "level": "3",
      "nature": null,
      "type": "패시브",
      "name_cn": "眷佑",
      "desc_cn": "友方生命值低于50%时，立即为其回复宫下美波7.0%/10.5%/14.0%最大生命值+320/717/1271的生命值，触发后有2回合的冷却时间。受到宫下美波治疗的同伴伤害永久提升10.0%/15.0%/20.0%、暴击效果永久提升10.0%/15.0%/20.0%；若该同伴为祝福属性角色，效果提升至伤害永久提升30.0%/45.0%/60.0%、暴击效果永久提升30.0%/45.0%/60.0%。",
      "name": "가호",
      "name_en": "Divine Favor",
      "name_jp": "加護",
      "desc": "아군의 생명이 50% 미만일 때, 즉시 대상의 생명을 미야시타 미나미 최대 생명의 7.0%/10.5%/14.0%+320/717/1271만큼 회복시킨다. 발동 후 2턴의 쿨타임이 적용된다. 미야시타 미나미의 치료를 받은 동료는 대미지가 영구적으로 10.0%/15.0%/20.0% 증가하고, 크리티컬 효과가 영구적으로 10.0%/15.0%/20.0% 증가한다. 해당 동료가 축복 속성 캐릭터일 경우, 효과가 강화되어 대미지가 영구적으로 30.0%/45.0%/60.0% 증가하고, 크리티컬 효과가 영구적으로 30.0%/45.0%/60.0% 증가한다.",
      "desc_en": "When an ally's HP falls below 50%, immediately restore HP equal to 7.0%/10.5%/14.0% of Minami Miyashita's max HP + 320/717/1271. This effect has a 2-turn cooldown after activation. Allies healed by Minami Miyashita permanently gain 10.0%/15.0%/20.0% damage and 10.0%/15.0%/20.0% critical damage. For Bless allies, both increases become 30.0%/45.0%/60.0%.",
      "desc_jp": "味方のHPが50%未満になると、即座に宮下美波の最大HPの7.0%/10.5%/14.0%＋320/717/1271のHPを回復する。発動後、2ターンのクールタイムがある。宮下美波から回復を受けた味方は与ダメージとクリティカルダメージがそれぞれ永続的に10.0%/15.0%/20.0%上昇する。その味方が祝福属性の場合、それぞれの上昇量は30.0%/45.0%/60.0%になる。"
    },
    {
      "ascend": "0",
      "autoSelect": "Default",
      "cooldown": 0,
      "cost": "",
      "level": "3",
      "nature": null,
      "type": "패시브",
      "name_cn": "润泽",
      "desc_cn": "宫下美波提供的增益效果延长1回合，并且自身的精力值消耗减少15%。\n获得『甘露』时，使所有同伴造成祝福伤害时总伤害增幅提升10.0%/15.0%/20.0%+意识等级*3%，持续2回合。\n使用『春之恩赐』消耗『甘露』时，使所有同伴攻击力提升15.0%/22.5%/30.0%+意识等级*3%，并使主目标伤害提升10.0%/15.0%/20.0%+意识等级*2%，持续2回合。",
      "name": "윤택",
      "name_en": "Nourishment",
      "name_jp": "潤沢",
      "desc": "미야시타 미나미가 제공하는 버프 효과가 1턴 연장되고, 자신의 SP 소모가 15% 감소한다.\n『암리타』 획득 시, 2턴 동안 아군 전체가 축복 대미지를 줄 때 총대미지 증폭이 10.0%/15.0%/20.0%+의식 레벨*3%만큼 증가한다.\n『봄의 은혜』를 사용해 『암리타』를 소모할 때, 2턴 동안 아군 전체의 공격력이 15.0%/22.5%/30.0%+의식 레벨*3%만큼 증가하고, 메인 목표의 대미지가 10.0%/15.0%/20.0%+의식 레벨*2%만큼 증가한다.",
      "desc_en": "Buffs granted by Minami Miyashita last 1 additional turn, and her SP costs are reduced by 15%.\nWhen she gains Diagnosis, increase all allies' total Bless damage by 10.0%/15.0%/20.0% + 3% per Awareness level for 2 turns.\nWhen Compassionate Cure consumes Diagnosis, increase all allies' Attack by 15.0%/22.5%/30.0% + 3% per Awareness level and the primary target's damage by 10.0%/15.0%/20.0% + 2% per Awareness level for 2 turns.",
      "desc_jp": "宮下美波が付与する強化効果の持続時間が1ターン延長され、自身のSP消費量が15%減少する。\n『カルテ』を獲得すると、味方全体の祝福属性ダメージの総ダメージ増加量が10.0%/15.0%/20.0%＋意識レベル×3%上昇する。効果は2ターン持続する。\n『コンパッションヒール』で『カルテ』を消費すると、味方全体の攻撃力が15.0%/22.5%/30.0%＋意識レベル×3%上昇し、主対象の与ダメージが10.0%/15.0%/20.0%＋意識レベル×2%上昇する。効果は2ターン持続する。"
    }
  ]
};
