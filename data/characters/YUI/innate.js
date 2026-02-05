window.innateData = window.innateData || {};
window.innateData["YUI"] = {
    "final_innate": [
        [
            {
                "attr": "Final Damage Mult.",
                "nature": "Electric",
                "value": "0.02",
                "desc": "모든 전격 속성 아군의 총 대미지 증폭",
                "desc_en": "All Electric Attribute Allies' Final Damage Increase",
                "desc_jp": "電撃属性の味方全員の最終ダメージ上昇",
                "desc_cn": "",
                "type": "전격"
            }
        ],
        [
            {
                "attr": "Electric Boost",
                "nature": "Electric",
                "value": "0.08",
                "desc": "모든 전격 속성 아군의 전격 속성 대미지 보너스 증가",
                "desc_en": "All Electric Attribute Allies' Electric Attribute DMG Bonus(ATK Mult) Increase",
                "desc_jp": "電撃属性の味方全員の電撃属性ダメージ攻撃倍率+上昇",
                "desc_cn": "",
                "type": "전격"
            },
            {
                "attr": "Electric Damage Taken",
                "nature": "Electric",
                "value": "-0.1",
                "desc": "모든 전격 속성 아군의 전격 속성 받는 대미지 감소",
                "desc_en": "All Electric Attribute Allies' Electric Attribute DMG Taken Decrease",
                "desc_jp": "電撃属性の味方全員の電撃属性ダメージ受ける減少",
                "desc_cn": "",
                "type": "전격"
            }
        ]
    ],
    "innate_awake_skill": [
        {
            "ascend": "0",
            "autoSelect": "Default",
            "cooldown": 0,
            "cost": "",
            "desc": "YUI가 추격을 발동하는 고정 확률이 35.0%/45.0%/55.0% 증가하고, 추격 발동 시 크리티컬 효과가 10.0%/15.0%/20.0% 증가한다.\n『초희귀 보상』이 제공하는 강화 추격 횟수가 3회로 증가한다.",
            "desc_en": "The fixed probability of YUI's Follow-up increases by 35.0%/45.0%/55.0%. When the Follow-up is triggered, the CRIT Mult increases by 10.0%/15.0%/20.0%. The number of Follow-up times increased by 3 times by the 'Sparky Surprise'.",
            "desc_jp": "YUIの追撃発生確率が35.0%/45.0%/55.0%上昇し、追撃発生時にCRT倍率が10.0%/15.0%/20.0%上昇します。\n『サプライズプレゼント』により追撃回数が3回増加します。",
            "desc_cn": "YUI发动追击的固定概率提升35.0%/45.0%/55.0%，触发追击时，暴击效果提升10.0%/15.0%/20.0%。\n『超稀有奖励』提供的强化追击次数提升为3次。",
            "level": "3",
            "name": "스포트라이트",
            "name_en": "Spotlight",
            "name_jp": "追光",
            "name_cn": "追光",
            "nature": null,
            "type": "패시브"
        },
        {
            "ascend": "0",
            "autoSelect": "Default",
            "cooldown": 0,
            "cost": "",
            "desc": "자신의 추가 효과 증폭이 자신의 의식 레벨*3%만큼 증가한다. YUI가 필드에 있을 때, 모든 다른 동료는 해당 효과의 25% 버프를 획득한다. 강화 추격의 스킬 대미지가 1.0%/1.5%/2.0%+자신의 의식 레벨*6%만큼 추가로 증가한다.",
            "desc_en": "Increases the amplification of Follow-up by Self Awareness Level × 3%. When YUI is on the field, all other allies gain 25% of this effect. The damage of Enhanced Follow-Up attacks is additionally increased by 1.0%/1.5%/2.0% + Self AwarenessLevel × 6%.",
            "desc_jp": "自身の追加効果増幅が自身の意識レベル × 3%増加します。YUIが戦場にいる場合、他の味方はこの効果の25%を追加で得ます。強化追撃のスキルダメージが1.0%/1.5%/2.0% + 自身の意識レベル × 6%増加します。",
            "desc_cn": "自身追加效果增幅提升自身意识等级*3%。YUI在场时，所有其他同伴获得该效果的25%增益。强化追击的技能伤害额外提升1.0%/1.5%/2.0%+自身意识等级*6%。",
            "level": "3",
            "name": "서프라이즈",
            "name_en": "Surprise",
            "name_jp": "惊喜",
            "name_cn": "惊喜",
            "nature": null,
            "type": "패시브"
        }
    ]
};
