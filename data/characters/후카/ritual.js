window.ritualData = window.ritualData || {};
window.enCharacterRitualData = window.enCharacterRitualData || {};
window.jpCharacterRitualData = window.jpCharacterRitualData || {};
window.cnCharacterRitualData = window.cnCharacterRitualData || {};

window.ritualData["후카"] = {
  "name": "야마기시 후카",
  "r0": "믿음직한 서포터",
  "r0_detail": "라인업 선택 단계에서 야마기시 후카는 아군 캐릭터 1명을 『백업 캐릭터』로 선택할 수 있다. 전투 중 야마기시 후카는 『소망의 청취』를 소모하여 특수 스킬 『오라클 전환』을 시전해 『백업 캐릭터』를 등장시켜 행동하게 할 수 있다. 『전투 라운드』 1회당 『오라클 전환』을 1회 사용할 수 있다.\n전투 시작 시 자신이 『소망의 청취』를 1/2/3중첩 획득한다(1/50/70레벨, 4회 중첩 가능).\n『오라클 전환』:\n『소망의 청취』를 4중첩 소모하여 현재 턴인 아군 캐릭터(이후 『현재 캐릭터』로 칭함)를 잠시 퇴장하게 하고, 『백업 캐릭터』를 등장시켜 1회 행동하게 한다. 『백업 캐릭터』는 행동 후 퇴장하며, 다시 『현재 캐릭터』로 전환되어 『현재 캐릭터』가 행동을 계속한다.\n『백업 캐릭터』는 등장 시 『현재 캐릭터』의 자신이 추가한 상태 이외의 모든 상태를 복제한다(『백업 캐릭터』 퇴장 시 해당 상태들은 제거됨). 『백업 캐릭터』 첫 등장 시 모든 “전투 시작 시” 효과가 발동된다. 『백업 캐릭터』 퇴장 후 모든 상태의 지속 시간은 감소하지 않는다. 『백업 캐릭터』 첫 등장 후 스킬 쿨타임은 『전투 라운드』에 따라 정상적으로 감소한다.",
  "r1": "내가 있을 곳",
  "r1_detail": "전투 시작 시 야마기시 후카는 추가로 『소망의 청취』를 2중첩 획득하며, 『소망의 청취』 중첩 상한이 8회까지 증가한다.\n자신이 스킬 시전 후 2턴 동안 아군 전체의 크리티컬 확률이 6% 증가한다(2회 중첩 가능).",
  "r2": "강점과 약점",
  "r2_detail": "야마기시 후카가 『오라클 전환』을 시전하여 『백업 캐릭터』를 등장시킬 때, 즉시 해당 캐릭터의 테우르기아 또는 HIGHLIGHT를 1회 시전하게 한다. (해당 효과는 『전투 라운드』 3회당 1회 발동 가능)\n『오라클 전환』 시전 후, 1턴 동안 아군 전체의 총 대미지 증폭이 6% 증가한다.\n임의 동료의 생명이 최대 생명의 40%보다 낮을 시 즉시 해당 목표의 최대 생명의 20%를 회복한다. 또한 2턴 동안 해당 목표는 턴마다 최대 생명의 15%를 회복한다. 해당 효과는 전투당 1회만 발동할 수 있다.",
  "r3": "유대 관계",
  "r3_detail": "『신성한 기도』, 『신념의 파동』의 스킬 레벨이 3레벨 증가하고, 최대 15레벨까지 증가한다.",
  "r4": "탑의 인도자",
  "r4_detail": "임의 동료가 HIGHLIGHT 또는 테우르기아 시전 시 해당 동료의 HIGHLIGHT 또는 테우르기아의 주는 대미지가 25% 증가한다.",
  "r5": "연결 능력",
  "r5_detail": "『빛의 힘』의 스킬 레벨이 3레벨 증가하고, 최대 15레벨까지 증가한다.",
  "r6": "자아의 가치",
  "r6_detail": "『오라클 전환』 시전에 소모되는 『소망의 청취』가 3중첩으로 감소한다.\n『신성한 기도』 시전 시, 추가로 『소망의 청취』를 2중첩 획득한다."
};

window.enCharacterRitualData["후카"] = {
  "name": "야마기시 후카",
  "r0": "Reliable Support",
  "r0_detail": "At the party selection screen, Fuuka can set 1 ally as a Shift Member, and during battle she can use Oracle Shift to swap in the Shift Member. Oracle Shift can be activated 1 time per round by spending 4 Over Oracle stacks.\nAt the start of battle, gain 1/2/3 Over Oracle stacks (at level 1/50/70, respectively), up to a maximum of 4 stacks.\nOracle Shift: Temporarily swap the currently acting ally with the Shift Member, allowing them to take 1 action. At this time, replicate buff and debuff effects granted to the swapped-out target, excluding effects granted by the target and certain special effects (replicated effects are active only during the swap). When the Shift Member first swaps, activate all start-of-battle effects, and then reduce skill cooldown times as usual based on the number of rounds. After the Shift Member's action, they swap back with the target, who can continue acting. However, support skill cooldown times and the swapped-out target's buff and debuff effect turn counters are not decreased from the Shift Member's action.",
  "r1": "Where I Belong",
  "r1_detail": "At the start of battle, gain 2 more Over Oracle stacks. Also, increase the maximum number of stacks to 8.\nWhen Fuuka uses a skill, increase party's critical rate by 6% and critical damage by 15% for 2 turns. Stacks up to 2 times.",
  "r2": "Pros and Cons",
  "r2_detail": "When swapping in a Shift Member with Oracle Shift, activate the target's Highlight or Theurgy (this effect can activate 1 time every 3 rounds).\nAfter activating Oracle Shift, increase party's final damage amplification by 10% for 1 turn.\nWhen an ally's HP falls below 40% of the maximum, restore 20% of their max HP, and also restore 15% of max HP every turn for 2 turns. This effect activates once per battle.",
  "r3": "Binding Ties",
  "r3_detail": "Increase the skill levels of Divine Prayer and Thoughtful Waves by 3.",
  "r4": "Tower Navigator",
  "r4_detail": "When an ally activates a Highlight or Theurgy, increase its damage by 25%.",
  "r5": "Unifying Power",
  "r5_detail": "Increase the skill level of Luminous Force by 3.",
  "r6": "My Own Worth",
  "r6_detail": "The number of Over Oracle stacks spent when activating Oracle Shift becomes 3.\nWhen activating Divine Prayer, gain 2 Over Oracle stacks.\nThe duration of the final damage amplification effect of Pros and Cons becomes 2 turns and stacks up to 2 times."
};

window.jpCharacterRitualData["후카"] = {
  "name": "山岸 風花",
  "r0": "頼れる支援者",
  "r0_detail": "風花は編成画面で味方1体を『シフトメンバー』に指定し、戦闘中に『オラクルシフト』で『シフトメンバー』を交代させることができる。『オラクルシフト』は1ラウンド経過するごとに1回、『オーバーオラクル』を4つ消費して発動できる。\n『オーバーオラクル』は戦闘開始時に1／2／3つ獲得でき（自身のレベルが1／50／70以上の時）、最大4つまで累積できる。\n『オラクルシフト』：『シフトメンバー』が行動選択中の味方と一時的に交代し、1回行動できる。この時、交代した対象に付与されている強化／弱体効果のうち、その対象が付与した効果と一部の特殊な効果を除いて複製する（複製した効果は交代中のみ有効）。『シフトメンバー』が初めて交代した時、戦闘開始時に発動する効果が全て発動し、以降はスキルのクールタイムがラウンドに応じて通常通り減少する。『シフトメンバー』の行動後は交代した対象に戻り、さらに続けて行動できる。ただし、『シフトメンバー』の行動で支援スキルのクールタイムは減少せず、交代した対象の強化／弱体効果の持続ターンは減少しない。",
  "r1": "私の居場所",
  "r1_detail": "戦闘開始時、追加で『オーバーオラクル』を2つ獲得する。また、『オーバーオラクル』の最大累積数が8つになる。\n自身がスキルを使用した時、2ターンの間、味方全体のクリティカル率が6%上昇し、クリティカルダメージが15%上昇する。最大2つまで累積できる（獲得するごとに、持続ターンがリセットされる）。",
  "r2": "得意不得意",
  "r2_detail": "『オラクルシフト』で『シフトメンバー』が登場した時、対象のハイライト／テウルギアを発動させる（この効果は3ラウンド経過するごとに1回まで）。\n『オラクルシフト』を発動した後、1ターンの間、味方全体の最終ダメージ増幅が10%上昇する。\n味方のHPが最大値の40%未満になった時、対象のHPを最大値の20%分回復し、さらに2ターンの間、毎ターン最大HPの15%分を回復する。この効果は戦闘中に一度だけ発動する。",
  "r3": "結ぶ者",
  "r3_detail": "『神気の祈り』／『想いの波動』のスキルレベルが3上昇する。",
  "r4": "塔の導き者",
  "r4_detail": "味方がハイライト／テウルギアを発動する時、その与ダメージが25%上昇する。",
  "r5": "繋がる力",
  "r5_detail": "『ルミナスフォース』のスキルレベルが3上昇する。",
  "r6": "自身の価値",
  "r6_detail": "『オラクルシフト』の発動に消費する『オーバーオラクル』が3つになる。\n『神気の祈り』を使用した時、『オーバーオラクル』を2つ獲得する。\n『得意不得意』の最終ダメージ増幅効果の持続ターンが2ターンになり、最大2つまで累積できるようになる（獲得するごとに、持続ターンがリセットされる）。"
};

window.cnCharacterRitualData["후카"] = {
  "name": "山岸风花",
  "r0": "值得信赖的支援者",
  "r0_detail": "选择阵容阶段，山岸风花可以选择1名友方角色作为『后备角色』。战斗中山岸风花可以消耗『愿望聆听』，释放特殊技能『神谕转换』使『后备角色』登场并行动。每经过1个『战斗轮次』可以使用1次『神谕转换』。\n战斗开始时，自身获得1/2/3层『愿望聆听』（达到1、50、70级时变化），上限4层。\n『神谕转换』：\n消耗4层『愿望聆听』，使当前回合所属的友方角色（后称『当前角色』）暂时退场并使『后备角色』登场并进行1次行动，『后备角色』行动后退场并重新替换为『当前角色』，『当前角色』继续行动。\n『后备角色』登场时，会复制『当前角色』非自身添加的所有状态（『后备角色』退场时会清除这些状态）。『后备角色』初次登场时，会触发所有\"战斗开始时\"的效果。『后备角色』退场后，所有状态的持续时间不会减少。『后备角色』初次登场后，技能冷却时间会随『战斗轮次』正常减少。",
  "r1": "我的容身之处",
  "r1_detail": "战斗开始时，山岸风花额外获得2层『愿望聆听』，『愿望聆听』上限提升为8层。\n自身释放技能后，使所有同伴暴击率提升6%，持续2回合，上限2层。",
  "r2": "擅长与不擅长",
  "r2_detail": "山岸风花释放『神谕转换』使『后备角色』登场时，立刻使其释放1次神通法或HIGHLIGHT。(该效果每经过3个『战斗轮次』后可以发动1次）\n释放『神谕转换』后，使所有同伴总伤害增幅提升6%，持续1回合。\n任意同伴生命值低于最大生命值的40%时，使其立刻恢复最大生命值20%的生命值，并使其每回合回复最大生命值15%的生命值，持续2回合，此效果每场战斗仅能触发1次。",
  "r3": "维系者",
  "r3_detail": "『神圣祈祷』、『心念的波动』的技能等级提升3级，至多提升至15级。",
  "r4": "塔之引导者",
  "r4_detail": "任意同伴释放HIGHLIGHT或神通法时，使其HIGHLIGHT或神通法伤害伤害提升25%。",
  "r5": "链接之能",
  "r5_detail": "『光辉之力』的技能等级提升3级，至多提升至15级。",
  "r6": "自我的价值",
  "r6_detail": "释放『神谕转换』消耗的『愿望聆听』减少至3层。\n释放『神圣祈祷』时，额外获得2层『愿望聆听』。"
};

