window.innateData = window.innateData || {};
window.innateData["리코·매화"] = {
  "final_innate": [
    [
      {
        "attr": "Final Damage Mult.",
        "nature": "Wind",
        "value": "0.02",
        "desc": "모든 질풍 속성 아군의 총 대미지 증폭",
        "desc_en": "All Wind Attribute Allies' Final Damage Increase",
        "desc_jp": "疾風属性の味方全員の最終ダメージ上昇",
        "desc_cn": "所有疾风属性同伴的总伤害增幅",
        "type": "질풍"
      }
    ],
    [
      {
        "attr": "Wind Boost",
        "nature": "Wind",
        "value": "0.08",
        "desc": "모든 질풍 속성 아군의 질풍 속성 대미지 보너스 증가",
        "desc_en": "All Wind Attribute Allies' Wind Attribute Damage Mult. Increase",
        "desc_jp": "疾風属性の味方全員の疾風属性ダメージ倍率上昇",
        "desc_cn": "所有疾风属性同伴的疾风属性伤害加成提升",
        "type": "질풍"
      },
      {
        "attr": "Wind Damage Taken",
        "nature": "Wind",
        "value": "-0.1",
        "desc": "모든 질풍 속성 아군의 질풍 속성 받는 대미지 감소",
        "desc_en": "All Wind Attribute Allies' Wind Attribute DMG Taken Decrease",
        "desc_jp": "疾風属性の味方全員の疾風属性被ダメージ減少",
        "desc_cn": "所有疾风属性同伴受到的疾风属性伤害降低",
        "type": "질풍"
      }
    ]
  ],
  "innate_awake_skill": [
    {
      "ascend": "0",
      "autoSelect": "Default",
      "cooldown": 0,
      "cost": "",
      "level": "1/2/3",
      "nature": null,
      "type": "패시브",
      "name": "풍화",
      "name_en": "Windblossom",
      "name_jp": "風華",
      "name_cn": "风华",
      "desc": "『개화』를 보유한 캐릭터는 『개화』 1중첩마다 크리티컬 효과가 추가로 4.0%/6.0%/8.0% 증가한다(상한 20.0%/30.0%/40.0%). 공격력이 4.0%/6.0%/8.0% 증가한다(상한 20.0%/30.0%/40.0%).\n자신이 『우산 속 매화』를 사용한 후, 모든 동료의 관통이 추가로 7.5%/11.2%/15.0% 증가하고 크리티컬 확률이 7.5%/11.2%/15.0% 증가한다. 2턴 동안 지속된다.",
      "desc_en": "Characters with Blossom gain an additional 4.0%/6.0%/8.0% Critical Effect for each Blossom stack, up to 20.0%/30.0%/40.0%, and 4.0%/6.0%/8.0% Attack, up to 20.0%/30.0%/40.0%.\nAfter using Arrival of Spring, additionally increase all allies' Pierce by 7.5%/11.2%/15.0% and Critical Rate by 7.5%/11.2%/15.0% for 2 turns.",
      "desc_jp": "『開花』を持つキャラクターは、『開花』1つにつきクリティカル効果が追加で4.0%/6.0%/8.0%上昇する（上限20.0%/30.0%/40.0%）。攻撃力が4.0%/6.0%/8.0%上昇する（上限20.0%/30.0%/40.0%）。\n自身が『春立ちて梅花盛りぬ』を使用した後、味方全体の貫通が追加で7.5%/11.2%/15.0%、クリティカル率が7.5%/11.2%/15.0%上昇する。2ターン持続する。",
      "desc_cn": "拥有『花开』的角色，每拥有1层『花开』暴击效果额外提升4.0%/6.0%/8.0%，上限20.0%/30.0%/40.0%、攻击力提升4.0%/6.0%/8.0%，上限20.0%/30.0%/40.0%。\n自身使用『伞边摇，安居伞中』后，额外使所有同伴穿透提升7.5%/11.2%/15.0%、暴击率提升7.5%/11.2%/15.0%，持续2回合。"
    },
    {
      "ascend": "0",
      "autoSelect": "Default",
      "cooldown": 0,
      "cost": "",
      "level": "1/2/3",
      "nature": null,
      "type": "패시브",
      "name": "봄의 은혜",
      "name_en": "Spring's Grace",
      "name_jp": "春の恩恵",
      "name_cn": "春恩",
      "desc": "자신이 『매화의 잔향』을 사용하면 소모한 SP 수량에 따라 아군 질풍 속성 캐릭터에게 버프 효과를 부여한다. SP 100포인트를 소모할 때마다 총 대미지 증폭이 4.0%/6.0%/8.0%+의식 레벨*1.5% 증가하고, 대미지가 4.0%/6.0%/8.0%+의식 레벨*1.5% 증가한다. 2턴 동안 지속된다.\n『낙화』는 추가로 적이 질풍 속성 대미지를 받을 때 받는 크리티컬 효과를 10.0%/15.0%/20.0%+2.5%*의식 레벨만큼 증가시킨다.",
      "desc_en": "When using Blossoming Season, grant Wind allies buffs based on SP spent. For every 100 SP spent, increase Final Damage by 4.0%/6.0%/8.0% + Awareness Level * 1.5% and damage by 4.0%/6.0%/8.0% + Awareness Level * 1.5% for 2 turns.\nFalling Petals additionally increases enemies' Critical Effect taken from Wind damage by 10.0%/15.0%/20.0% + 2.5% * Awareness Level.",
      "desc_jp": "自身が『時満ちて咲ふ梅が枝』を使用すると、消費したSP量に応じて味方の疾風属性キャラクターにバフ効果を付与する。SPを100消費するごとに、最終ダメージが4.0%/6.0%/8.0%+意識レベル*1.5%、与ダメージが4.0%/6.0%/8.0%+意識レベル*1.5%上昇する。2ターン持続する。\n『散り初め』は追加で、敵が疾風属性ダメージを受ける時の被クリティカル効果を10.0%/15.0%/20.0%+2.5%*意識レベル上昇させる。",
      "desc_cn": "自身使用『梅自香，时过香浓』，根据消耗SP的数量给予我方疾风属性角色增益效果，每消耗100点SP总伤害增幅提升4.0%/6.0%/8.0%+意识等级*1.5%、伤害提升4.0%/6.0%/8.0%+意识等级*1.5%，持续2回合。\n『凋落』额外使敌人受到疾风属性伤害时的暴击效果提升10.0%/15.0%/20.0%+2.5%*意识等级。"
    }
  ]
};
