window.ritualData = window.ritualData || {};
window.enCharacterRitualData = window.enCharacterRitualData || {};
window.jpCharacterRitualData = window.jpCharacterRitualData || {};
window.cnCharacterRitualData = window.cnCharacterRitualData || {};

window.ritualData["아케치"] = {
  "name": "아케치 고로",
  "r0": "안개 속을 걸어서",
  "r0_detail": "전투 시작 시 공격력이 가장 높은 동료가 『탐정 동료』가 되며(지배 또는 반항 괴도 우선), 턴 시작 시 『탐정 동료』를 다시 선택할 수 있다(『탐정 동료』는 동시에 1명만 존재 가능, 다시 선택 후 쿨타임 1턴). 자신이 『탐정 동료』 25%의 공격력을 획득한다(상한 500/750/1,000, 1/50/70레벨 시 레벨업). 『탐정 동료』가 광역 페르소나 스킬/HIGHLIGHT/테우르기아/추가 효과를 발동하여 대미지를 줄 때 적에게 준 평균 대미지를 기록한다(단일 스킬인 경우 메인 목표에게 준 대미지의 40%를 기록). 아케치 고로가 턴 시작 시 기록한 총 대미지에 따라 『정확한 화살』을 1중첩 획득하며, 기록한 대미지가 리셋된다. 『정확한 화살』은 2턴 동안 지속된다.",
  "r1": "혐의 조사",
  "r1_detail": "전투 시작 시 『정확』 상태를 획득하며, 『정확』 상태와 『혼돈』 상태의 지속 시간이 4턴까지 연장된다. 『정확』 상태와 『혼돈』 상태가 공존하는 경우 자신의 크리티컬 확률이 16% 증가하고, 자신과 『탐정 동료』의 대미지가 25% 증가한다.",
  "r2": "실마리",
  "r2_detail": "자신이 페르소나 스킬을 시전하여 대미지를 준 후, 스킬의 적합성 속성이 지난번에 시전한 스킬과 다르면 1턴 동안 자신과 『탐정 동료』의 공격력이 25%, 크리티컬 효과가 30% 증가한다.",
  "r3": "그림자 추적",
  "r3_detail": "『황금 화살비·파멸』, 『전투 기술』의 스킬 레벨이 3레벨 증가하고, 최대 15레벨까지 증가한다.",
  "r4": "진실과 거짓",
  "r4_detail": "HIGHLIGHT 효과 증가: 4턴 동안 자신의 『혼돈의 화살』 대미지가 추가로 10% 증가한다.",
  "r5": "타지의 동행자",
  "r5_detail": "『정의의 약속』, 『기울어진 사냥터』의 스킬 레벨이 3레벨 증가하고, 최대 15레벨까지 증가한다.",
  "r6": "일단락",
  "r6_detail": "『황금 화살비·파멸』을 시전할 때 『정확한 화살』의 기록 대미지가 50% 증가한다. 아케치 고로가 모든 동료를 『탐정 동료』로 여긴다. 전투 중 아케치 고로가 추가로 크리티컬 확률, 크리티컬 효과 증가를 획득하고, 증가값은 모든 『탐정 동료』의 크리티컬 확률, 크리티컬 효과(100%를 초과하는 부분) 최곳값의 40%다(상한 20%, 40%)."
};

window.enCharacterRitualData["아케치"] = {
  "name": "Goro Akechi",
  "r0": "High School Detective",
  "r0_detail": "At the start of battle, grant Mastermind to the ally with the highest Attack (prioritizing Sweepers or Assassins, select Akechi if no target found). At the start of each turn, can manually reselect a target to grant Mastermind. Only 1 ally can have Mastermind at one time (reselecting has a cooldown of 1 turn).\nAlso, increase Akechi's Attack by 25% of the Mastermind ally's Attack (up to a maximum of 500/750/1000, at level 1/50/70, respectively).\nWhen an ally besides Akechi has Mastermind and deals damage to all foes with an attack skill, Highlight, or Resonance, record the average damage dealt to all foes (if targeting 1 foe, record 40% of the damage dealt). At the start of Akechi's turn, gain 1 Arrow of Truth stack based on the amount of damage recorded, and reset the recorded damage. Arrow of Truth can be held for 2 turns.\nWhen Akechi has Mastermind, the effect of Rain of Justice changes, and Arrow of Truth deals Almighty damage based on the skill multiplier or Arrow of Perjury.",
  "r1": "Detective Profile",
  "r1_detail": "At the start of battle, gain Deduction, and the durations of Deduction and Stratagem are extended to 4 turns.\nAlso, when Deduction and Stratagem are both active, increase Akechi's critical rate by 16%, and increase the damage dealt by Akechi and allies with Mastermind by 25%.",
  "r2": "Detective Advice",
  "r2_detail": "When dealing damage with a skill, if the attribute of the last skill used was different, increase the Attack of Akechi and allies with Mastermind by 25%, and their critical damage by 30%. Lasts for 1 turn.",
  "r3": "Detective Style",
  "r3_detail": "Increase the skill levels of Rain of Justice and Thief Tactics by 3.",
  "r4": "Detective Trick",
  "r4_detail": "Highlight Enhanced: Increase the damage of Arrow of Perjury by 30% more for 4 turns.",
  "r5": "Detective Logic",
  "r5_detail": "Increase the skill levels of Flash of Intuition and Decisive Scheme by 3.",
  "r6": "Masked Detective",
  "r6_detail": "When using Rain of Justice, increase the effect of Arrow of Truth by 50%.\nAkechi and all allies are considered to have the Mastermind effect (the Attack increase from High School Detective is based on the ally with the highest Attack). During battle, increase Akechi's critical rate and critical damage more. This additional increase is equal to 40% of the critical rate of the Mastermind ally with the highest critical rate, and 40% of the highest critical multiplier exceeding 100% (up to a maximum of 20% and 40%, respectively)."
};

window.jpCharacterRitualData["아케치"] = {
  "name": "明智 吾郎",
  "r0": "現役高校生探偵",
  "r0_detail": "戦闘開始時、攻撃力が最も高い味方を『狂言回し』状態にする（支配／反抗ロールを優先し、対象がいない場合は自身を選択する）。ターン開始時、『狂言回し』の対象を再選択できる。複数の味方を同時に『狂言回し』状態に選択することはできない（再選択のクールタイムは１ターン）。\nさらに『狂言回し』状態の味方の攻撃力の２５%分、自身の攻撃力が上昇する（最大５００／７５０／１０００まで、レベル１／５０／７０で変化）。\n自身以外の『狂言回し』状態の味方は、全体対象の攻撃スキル／ハイライト／意識奏功でダメージを与えた時、敵全体に与えた平均ダメージを蓄積する（単体対象の場合、与ダメージの４０%を蓄積）。自身のターン開始時、蓄積したダメージに応じた効果量の『真実の矢』を１つ獲得し、蓄積したダメージをリセットする。『真実の矢』は２ターン持続する。\n自身が『狂言回し』状態の場合、『正義の矢の雨』の効果が変化し、『真実の矢』は『偽証の矢』のスキル倍率に基づいた追加の万能属性ダメージを与える。",
  "r1": "探偵のプロファイル",
  "r1_detail": "戦闘開始時に『推理』状態となり、『推理』と『謀略』状態の持続時間が４ターンに延長される。\nさらに『推理』かつ『謀略』状態の時、自身のクリティカル率が１６%上昇し、自身と『狂言回し』状態の味方の与ダメージが２５%上昇する。",
  "r2": "探偵のアドバイス",
  "r2_detail": "スキルでダメージを与えた時、前回使用したスキルの属性と異なる場合、１ターンの間、自身と『狂言回し』状態の味方の攻撃力が２５%上昇し、クリティカルダメージが３０%上昇する。",
  "r3": "探偵のスタイル",
  "r3_detail": "『正義の矢の雨』／『怪盗戦技』のスキルレベルが３上昇する。",
  "r4": "探偵のトリック",
  "r4_detail": "ハイライト能力追加：４ターンの間、追加で『偽証の矢』のダメージが３０%上昇する。",
  "r5": "探偵のロジック",
  "r5_detail": "『推理の閃き』／『謀略の一手』のスキルレベルが３上昇する。",
  "r6": "怪盗服の名探偵",
  "r6_detail": "『正義の矢の雨』を使用する時、『真実の矢』の効果量が５０%上昇する。\n自身を含む味方全体を『狂言回し』状態として扱う（『現役高校生探偵』の攻撃力上昇は、攻撃力が最も高い味方を参照）。戦闘中、追加で自身のクリティカル率とクリティカルダメージが上昇する。この上昇量はすべての『狂言回し』状態の味方の中でＣＲＴ発生率と、ＣＲＴ倍率１００%超過分の最も高い数値の４０%に相当する（それぞれ最大２０%、４０%まで）。"
};

window.cnCharacterRitualData["아케치"] = {
  "name": "明智吾郎",
  "r0": "行走于迷雾之中",
  "r0_detail": "战斗开始时，使攻击力最高的同伴成为『侦探伙伴』（优先支配或反抗怪盗），回合开始时可以重新选择『侦探伙伴』（同时只能存在1名『侦探伙伴』，重新选择后有1回合的冷却时间）。自身获得『侦探伙伴』25%的攻击力，上限500/750/1000（1/50/70级时升级）。『侦探伙伴』释放群体人格面具技能/HIGHLIGHT/神通法/追加效果造成伤害时，记录其对敌方单位造成的平均伤害（若为单体技能，则记录其对主目标伤害的40%）。明智吾郎回合开始时，根据记录的总伤害获得1层『清晰之矢』并清空所记录的伤害，『清晰之矢』持续2回合。",
  "r1": "嫌疑侦查",
  "r1_detail": "战斗开始时获得『清晰』状态，『清晰』状态和『混沌』状态的持续时间延长至4回合。『清晰』状态和『混沌』状态共存时，自身暴击率提升16%，并使自身和『侦探伙伴』的伤害提升25%。",
  "r2": "蛛丝马迹",
  "r2_detail": "自身释放人格面具技能造成伤害后，若技能的适应性属性与上次释放的技能不相同，则使自身和『侦探伙伴』的攻击力提升25%、暴击效果提升30%，持续1回合。",
  "r3": "迷影追踪",
  "r3_detail": "『黄金箭雨·湮灭』、『战斗技巧』的技能等级提升3级，至多提升至15级。",
  "r4": "真假难辨",
  "r4_detail": "HIGHLIGHT效果提升：额外使自身『混沌之箭』的伤害提高10%，持续4回合。",
  "r5": "异路同行",
  "r5_detail": "『正义之约』、『不公的狩猎场』的技能等级提升3级，至多提升至15级。",
  "r6": "尘埃落定",
  "r6_detail": "释放『黄金箭雨·湮灭』时『清晰之矢』的记录伤害提升50%。明智吾郎会视所有同伴为『侦探伙伴』。战斗中，明智吾郎会额外获得暴击率、暴击效果提升，提升值基于所有『侦探伙伴』中暴击率、暴击效果（超过100%的部分）最高值的40%(上限20%、40%）。"
};

