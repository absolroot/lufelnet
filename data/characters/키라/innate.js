window.innateData = window.innateData || {};

window.innateData["키라"] = {
  "final_innate": [
    [
      {
        "attr": "Final Damage Mult.",
        "nature": "Phys",
        "value": "0.02",
        "type": "물리",
        "desc": "모든 물리 속성 아군의 최종 대미지 증가",
        "desc_en": "All Physical Attribute Allies' Final Damage Increase",
        "desc_jp": "物理属性の味方全員の最終ダメージ上昇",
        "desc_cn": "所有物理属性同伴的最终伤害提升"
      }
    ],
    [
      {
        "attr": "Phys Boost",
        "nature": "Phys",
        "value": "0.08",
        "type": "물리",
        "desc": "모든 물리 속성 아군의 물리 속성 대미지 보너스 증가",
        "desc_en": "All Physical Attribute Allies' Physical Attribute Damage Mult Increase",
        "desc_jp": "物理属性の味方全員の物理属性ダメージ倍率上昇",
        "desc_cn": "所有物理属性同伴的物理属性伤害倍率提升"
      },
      {
        "attr": "Phys Damage Taken",
        "nature": "Phys",
        "value": "-0.1",
        "type": "물리",
        "desc": "모든 물리 속성 아군의 물리 속성 받는 대미지 감소",
        "desc_en": "All Physical Attribute Allies' Physical Attribute DMG Taken Decrease",
        "desc_jp": "物理属性の味方全員の物理属性被ダメージ減少",
        "desc_cn": "所有物理属性同伴的物理属性受伤害降低"
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
      "name": "격앙",
      "desc": "적의 턴 종료 시, 『유혈』 1중첩마다 최대 생명이 영구적으로 1.25% 감소한다(최대 50%까지 감소).\n자신이 『사냥꾼』 상태일 때 공격력이 20.0%/30.0%/40.0% 증가한다.\n자신이 『집행관』 상태일 때 크리티컬 효과가 20.0%/30.0%/40.0% 증가한다.",
      "name_en": "",
      "name_jp": "",
      "name_cn": "亢奋",
      "desc_en": "",
      "desc_jp": "",
      "desc_cn": "敌人回合结束时，每拥有1层『流血』最大生命值永久降低1.25%，最多降低50%。\n自身处于『寻猎者』状态时，攻击力提升20.0%/30.0%/40.0%。\n自身处于『行刑官』状态时，暴击效果提升20.0%/30.0%/40.0%。"
    },
    {
      "ascend": "0",
      "autoSelect": "Default",
      "cooldown": 0,
      "cost": "",
      "level": "3",
      "nature": null,
      "type": "패시브",
      "name": "흡혈",
      "desc": "『절개』 및 『잔살』의 스킬 대미지가 7.5%/11.2%/15.0%+의식 레벨*8% 증가한다.\n자신이 『밤의장막』 사용 후, 2턴 동안 아군 전체 동료의 지속 대미지 효과가 10.0%/15.0%/20.0%+의식 레벨*5% 증가한다.\n아군 물리 속성 동료가 대미지를 줄 때, 적의 『유혈』이 7중첩 이상이면 총 대미지 증폭이 10.0%/15.0%/20.0%+의식 레벨*5%, 대미지가 20.0%/30.0%/40.0%+의식 레벨*10% 증가한다.",
      "name_en": "",
      "name_jp": "",
      "name_cn": "嗜血",
      "desc_en": "",
      "desc_jp": "",
      "desc_cn": "『撕裂』及『残杀』的技能伤害提升7.5%/11.2%/15.0%+意识等级*8%。\n自身使用『夜幕已至』后，使友方全体同伴的持续伤害效果提升10.0%/15.0%/20.0%+意识等级*5%，持续2回合。\n友方物理属性同伴造成伤害时，若敌人『流血』大于等于7层，则总伤害增幅提升10.0%/15.0%/20.0%+意识等级*5%、伤害提升20.0%/30.0%/40.0%+意识等级*10%。"
    }
  ]
};
