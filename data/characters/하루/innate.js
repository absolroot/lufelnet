window.innateData = window.innateData || {};

window.innateData["하루"] = {
  "final_innate": [
    [
      {
        "attr": "Final Damage Mult.",
        "nature": "Psychokinesis",
        "value": "0.02",
        "type": "염동",
        "desc": "모든 염동 속성 아군의 최종 대미지 증가",
        "desc_en": "All Psychokinesis Attribute Allies' Final Damage Increase",
        "desc_jp": "念動属性の味方全員の最終ダメージ上昇",
        "desc_cn": "所有念动属性同伴的最终伤害提升"
      }
    ],
    [
      {
        "attr": "Psychokinesis Boost",
        "nature": "Psychokinesis",
        "value": "0.08",
        "type": "염동",
        "desc": "모든 염동 속성 아군의 염동 속성 대미지 보너스 증가",
        "desc_en": "All Psychokinesis Attribute Allies' Psychokinesis Attribute Damage Mult Increase",
        "desc_jp": "念動属性の味方全員の念動属性ダメージ倍率上昇",
        "desc_cn": "所有念动属性同伴的念动属性伤害倍率提升"
      },
      {
        "attr": "Psychokinesis Damage Taken",
        "nature": "Psychokinesis",
        "value": "-0.1",
        "type": "염동",
        "desc": "모든 염동 속성 아군의 염동 속성 받는 대미지 감소",
        "desc_en": "All Psychokinesis Attribute Allies' Psychokinesis Attribute DMG Taken Decrease",
        "desc_jp": "念動属性の味方全員の念動属性被ダメージ減少",
        "desc_cn": "所有念动属性同伴的念动属性受伤害降低"
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
      "name_cn": "改膛",
      "desc_cn": "释放『全金属爆发』后，回复50%技能消耗的精力值，若『改装』未满则额外获得1种未获得的『改装』（添加未获得『改装』的优先级：『超荷改装』>『热能改装』>『卸甲改装』。）每有1种『改装』自身攻击力提升15.0%/22.5%/30.0%、暴击效果提升18.0%/27.0%/36.0%。",
      "name": "총열 개조",
      "name_en": "Rechamber",
      "name_jp": "薬室改造",
      "desc": "『아이언 버스트』 시전 후 스킬로 소모한 SP 50%를 회복하고, 『개조』가 가득 차지 않았다면 아직 획득하지 않은 『개조』 1종을 추가 획득한다(미획득 『개조』 부여 우선순위: 『오버클럭 개조』 > 『열에너지 개조』 > 『장갑제거 개조』). 『개조』 1종당 자신의 공격력이 15.0%/22.5%/30.0%, 크리티컬 효과가 18.0%/27.0%/36.0% 증가한다.",
      "desc_en": "After using [Mindful Release], restore 50% of its SP cost. If Haru has not reached the maximum number of Thoughtful Rounds, also gain 1 Thoughtful Round type she has not yet acquired (priority: [Overload Round] > [Focused Round] > [Painpoint Round]). For each Thoughtful Round type held, increase Attack by 15.0%/22.5%/30.0% and critical damage by 18.0%/27.0%/36.0%.",
      "desc_jp": "『マインドフルリリース』使用後、消費したＳＰの５０%を回復する。『想いの弾丸』が最大数未満の場合、未獲得の『想いの弾丸』を１つ追加で獲得する（未獲得の『想いの弾丸』の獲得優先度：『オーバーロード弾』＞『フォーカス弾』＞『ペインポイント弾』）。所持する『想いの弾丸』１種類ごとに、攻撃力が15.0%/22.5%/30.0%、クリティカルダメージが18.0%/27.0%/36.0%上昇する。"
    },
    {
      "ascend": "0",
      "autoSelect": "Default",
      "cooldown": 0,
      "cost": "",
      "level": "3",
      "nature": null,
      "type": "패시브",
      "name_cn": "猛攻",
      "desc_cn": "回合结束前，若自身『改装』已满，则自动释放枪械射击。\n每有1层『准星』，自身技能伤害提升13.0%/19.5%/26.0%+3%*意识等级，最多提升39.0%/58.5%/78.0%+9%*意识等级。\n枪械射击时，自身总伤害增幅提升12.0%/18.0%/24.0%+3%*意识等级、伤害提升28.0%/42.0%/56.0%+7%*意识等级。",
      "name": "맹공",
      "name_en": "Fierce Assault",
      "name_jp": "猛攻",
      "desc": "턴 종료 전, 자신의 『개조』가 가득 찼다면 총격을 자동 시전한다.\n『조준점』 1중첩당 자신의 스킬 대미지가 13.0%/19.5%/26.0%+3%*의식 레벨만큼 증가하고, 최대 39.0%/58.5%/78.0%+9%*의식 레벨까지 증가한다.\n총격 시 자신의 총대미지 증폭이 12.0%/18.0%/24.0%+3%*의식 레벨만큼 증가하고, 대미지가 28.0%/42.0%/56.0%+7%*의식 레벨만큼 증가한다.",
      "desc_en": "Before the end of the turn, if Thoughtful Rounds are at their maximum, automatically perform 1 ranged attack. For each Target Audience stack, increase skill damage by 13.0%/19.5%/26.0% + 3% × Awareness level, up to 39.0%/58.5%/78.0% + 9% × Awareness level. When performing a ranged attack, increase final damage amplification by 12.0%/18.0%/24.0% + 3% × Awareness level and damage by 28.0%/42.0%/56.0% + 7% × Awareness level.",
      "desc_jp": "ターン終了前、『想いの弾丸』が最大数の時、自動で遠隔攻撃を１回行う。『標的層』１つごとに、自身のスキルダメージが13.0%/19.5%/26.0%＋意識レベル×3%上昇する。最大で39.0%/58.5%/78.0%＋意識レベル×9%まで上昇する。遠隔攻撃時、自身の最終ダメージ増幅が12.0%/18.0%/24.0%＋意識レベル×3%、与ダメージが28.0%/42.0%/56.0%＋意識レベル×7%上昇する。"
    }
  ]
};
