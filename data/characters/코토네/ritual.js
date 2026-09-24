window.ritualData = window.ritualData || {};
window.enCharacterRitualData = window.enCharacterRitualData || {};
window.jpCharacterRitualData = window.jpCharacterRitualData || {};
window.cnCharacterRitualData = window.cnCharacterRitualData || {};

const ritualNames = {
  kr: ["위대한 선택", "메아리치는 현의 소리", "든든한 버팀목", "만월의 밤", "무궁한 인연", "꺼지지 않는 불꽃", "영혼의 시편"],
  en: ["Moment of Truth", "Echoing Strings", "Team Mom", "Full Moon Night", "Eternal Bonds", "Unquenchable Flames", "Song of the Soul"],
  jp: ["大いなる決断", "響く琴の音", "肝っ玉母さん", "満月の夜に", "無窮の絆", "燃え尽きぬ炎", "魂の詩片"],
  cn: ["伟大的抉择", "回响的琴音", "主心骨", "满月之夜", "无穷的羁绊", "不会消逝的火焰", "灵魂诗篇"]
};
const ritualDetails = {
  kr: ["코토네를 획득하면 전투 중 필드에 있는 우월 역할 동료 1명당 모든 동료의 최종 대미지 증폭이 1% 증가한다. 코토네가 전투에 참여하지 않아도 적용된다.\n『월하의 동료』가 페르소나 스킬을 사용하거나 코토네가 『월하의 동료』에게 페르소나 스킬을 사용하면, 대상의 『삭망월』이 1레벨 증가한다. 『삭망월』은 최대 10레벨까지 올릴 수 있으며, 레벨에 따라 다음 효과를 획득한다.\n『삭망월』 1레벨: 공격력이 10% 증가한다.\n『삭망월』 5레벨: 관통이 15% 증가한다.\n『삭망월』 10레벨: 크리티컬 효과가 20% 증가한다.\n전투 시작 시 공격력이 가장 높은 반항 또는 지배 역할 동료를 자동으로 『월하의 동료』로 선택한다. 코토네의 턴 시작 시 『월하의 동료』를 다시 선택할 수 있지만, 기존 『월하의 동료』에게 부여한 전용 버프 효과는 해제된다.\n코토네는 특수 스킬 『전력전개』를 보유하며, 전투마다 1회 사용해 『운명의 수레바퀴』 상태에 진입할 수 있다.", "『운명의 수레바퀴』 상태에 진입하면 HIGHLIGHT 게이지를 소모하지 않고 HIGHLIGHT를 즉시 1회 사용한다.\n『월하의 동료』를 선택하면 대상에게 영구 『인연의 힘』 1중첩을 부여하고 『삭망월』을 즉시 5레벨로 만든다.\n『인연의 힘』이 3중첩인 대상에게 『리라의 선율』을 사용하면, 대상의 크리티컬 효과가 추가로 40% 증가한다. 효과는 5턴 동안 지속된다.", "『운명의 수레바퀴』 상태에서는 코토네의 페르소나 스킬과 HIGHLIGHT가 부여하는 모든 지속 효과가 추가로 1턴 연장된다. 『염화·비월고양』으로 복제하는 버프 효과의 수치는 원래 효과의 150%가 된다.", "『리라의 선율』과 전투 기술의 스킬 레벨이 증가한다.", "HIGHLIGHT 사용 시 모든 동료의 대미지가 추가로 25% 증가한다.", "『월명화염』과 『염화·비월고양』의 스킬 레벨이 증가한다.", "『염화·비월고양』 사용 시 스킬의 주 대상이 원더가 아니면, 원더가 부여한 버프 효과도 추가로 복제할 수 있다. 복제 효과의 수치는 원래 효과의 100%다. 『전력전개』의 사용 횟수가 1회 증가한다."],
  en: ["After obtaining Kotone Shiomi, during battle, for every Strategist present, increase party's final damage amplification by 1% (takes effect even when Kotone Shiomi is not in battle). At the start of battle, grant Arcana Link to the Sweeper or Assassin ally with the highest Attack. At the start of Kotone Shiomi's turn, she can reselect the target of Arcana Link. Multiple allies cannot be in the Arcana Link state at the same time.\nWhen the ally in the Arcana Link state uses a skill, or when Kotone Shiomi uses a skill on them, increase Lunar Bond by 1 (max 10). Lunar Bond 1/5/10 increases Attack by 50%, pierce rate by 15%, and critical damage by 50%. Reselecting Arcana Link resets Lunar Bond.\nKotone Shiomi can activate Go for Broke once per battle to enter the Fortune state.", "When entering the Fortune state, immediately activate Highlight once without spending the Highlight gauge.\nWhen an ally enters the Arcana Link state, permanently grant them 1 Powerful Bond stack and set Lunar Bond to 5.\nWhen using Lyre's Melody on an ally with 3 Powerful Bond stacks, increase the target's critical damage by 30% more for 5 turns.", "When in the Fortune state, extend the duration of all effects granted by Kotone Shiomi's skills and Highlight by 1 more turn. Also, when using Lunar Phaseshift, increase buff copy multiplier to 1.25.", "Increase the skill levels of Lyre's Melody and Combat Tactics.", "Highlight Enhanced: Increase party's damage by 25% for 2 turns.", "Increase the skill levels of Burning Moon's Cry and Lunar Phaseshift.", "Go for Broke can be used 1 more time.\nWhen using Lunar Phaseshift on allies other than Wonder, if Wonder is not in the Arcana Link state, copy certain buff effects granted to Wonder over to the ally in the Arcana Link state based on the buff copy multiplier. The applied buffs last for 1 turn, and certain buffs cannot be copied."],
  jp: ["優越ロールの怪盗１体ごとに味方全体の最終ダメージ増幅が１%上昇し、『ルネーション』により『月下の仲間』が強化される。", "『運命の輪』時、ゲージを消費しないハイライトを１回発動し、『月下の仲間』に永続する『絆の力』とルネーション５を付与する。", "『運命の輪』中、効果の持続ターンが１延長され、複製倍率が125%になる。", "『琴奏の調べ』と『戦術技能』のスキルレベルが上昇する。", "ハイライトで味方全体の与ダメージが２ターンの間25%上昇する。", "『月鳴の炎』と『焔華・緋月昂揚』のスキルレベルが上昇する。", "『全力全開』の使用回数が１回追加され、主人公の強化効果を追加で複製できる。"],
  cn: ["每有1个优越同伴，所有同伴总伤害增幅提升1%。『月下伙伴』根据朔望月获得增益。", "进入『命运之轮』状态立即释放1次不消耗能量的HIGHLIGHT，并使『月下伙伴』获得永久『羁绊之力』和5级朔望月。", "『命运之轮』状态下持续效果额外延长1回合，复制增益效果值提升为150%。", "『琴奏之调』、战斗技巧等级提升。", "HIGHLIGHT额外使所有同伴伤害提升25%。", "『月鸣之炎』、『焰华·绯月昂扬』等级提升。", "可额外复制来自WONDER的增益效果，效果值为原本100%；全力全开额外增加1次使用次数。"]
};
// Align KR/EN/JP with the current KR/CN source values.
// The current KR endpoint erroneously returns Chinese for Ritual 0; retain the
// Korean source response verified immediately before that upstream regression.
ritualDetails.kr[0] = "시오미 코토네 획득 후, 전투 중 필드에 있는 아군 우월 동료 수에 따라 아군 전체의 총 대미지 증폭이 증가한다. 우월 동료 1명당 총 대미지 증폭이 1% 증가한다(시오미 코토네의 필드 출전 여부와 무관).\n전투 시작 시 자동으로 아군 중 공격력이 가장 높은 반항/지배 동료를 『월하 동료』로 지정한다. 시오미 코토네의 턴 시작 시 『월하 동료』를 다시 지정할 수 있다.\n『월하 동료』가 페르소나 스킬을 시전하거나 자신이 『월하 동료』에게 페르소나 스킬을 시전한 후, 목표의 삭망월 레벨이 1레벨 상승하며(최대 10레벨), 삭망월 레벨에 따라 버프를 획득한다.\n삭망월 1레벨: 공격력 50% 증가\n삭망월 5레벨: 관통 15% 증가\n삭망월 10레벨: 크리티컬 효과 50% 증가\n\n시오미 코토네는 특수 스킬 『전력 전개』를 보유하며, 시전 후 『운명의 수레바퀴』 상태에 진입한다(전투 중 1회 사용 가능).";
ritualDetails.kr[1] = "『운명의 수레바퀴』 상태에 진입하면 자신이 즉시 에너지를 소모하지 않는 HIGHLIGHT를 1회 시전한다.\n『월하 동료』를 선택한 후 『월하 동료』는 영구적인 『인연의 힘』 1중첩을 획득하고, 삭망월 레벨이 즉시 5레벨로 상승한다.\n목표를 향해 『현의 선율』 사용 시, 목표의 『인연의 힘』이 3중첩이면 5턴 동안 목표의 크리티컬 효과가 30% 추가로 증가한다.";
ritualDetails.kr[2] = "『운명의 수레바퀴』 상태에서 자신이 페르소나 스킬/HIGHLIGHT로 부여한 모든 지속 효과가 1턴 추가 연장된다.\n『염화·떠오르는 붉은 달』로 복사한 버프 효과의 『기본 복사 비율』이 기존의 1.25배로 증가한다.";
ritualDetails.kr[3] = "『현의 선율』, 전투 기술 레벨이 증가한다.";
ritualDetails.kr[4] = "HIGHLIGHT가 아군 전체의 대미지를 추가로 25% 증가시킨다.";
ritualDetails.kr[5] = "『달의 불꽃』, 『염화·떠오르는 붉은 달』 레벨이 증가한다.";
ritualDetails.kr[6] = "『전력 전개』의 사용 가능 횟수가 1회 추가된다.\n『염화·떠오르는 붉은 달』 사용 시 스킬 메인 목표가 원더가 아닐 경우, 원더가 부여한 버프 효과를 추가로 복사할 수 있으며, 효과 수치는 원본 수치의 『기본 복사 비율』로 적용된다.";
ritualDetails.en[0] = "After obtaining Kotone Shiomi, during battle, for every Strategist present, increase party's final damage amplification by 1% (takes effect even when Kotone Shiomi is not in battle). At the start of battle, grant Arcana Link to the Sweeper or Assassin ally with the highest Attack. At the start of Kotone Shiomi's turn, she can reselect the target of Arcana Link. Multiple allies cannot be in the Arcana Link state at the same time.\nWhen the ally in the Arcana Link state uses a skill, or when Kotone Shiomi uses a skill on the ally in the Arcana Link state, increase the target's Lunar Bond (max 10). Also, gain the following effects based on current Lunar Bond.\n1: Increase Attack by 10%.\n5: Increase pierce rate by 15%.\n10: Increase critical damage by 20%.\nWhen reselecting the target of Arcana Link, Lunar Bond is reset.\nAlso, Kotone Shiomi can activate the assist skill Go for Broke once per battle. When activated, she enters the Fortune state.";
ritualDetails.en[1] = "When entering the Fortune state, immediately activate Highlight once without spending the Highlight gauge.\nWhen an ally enters the Arcana Link state, permanently grant them 1 Powerful Bond stack, and set their Lunar Bond to 5.\nWhen using Lyre's Melody on an ally with 3 Powerful Bond stacks, increase the target's critical damage by 40% more for 5 turns.";
ritualDetails.en[2] = "When in the Fortune state, extend the duration of all effects granted by Kotone Shiomi's skills and Highlight by 1 more turn. Also, buffs copied to a target by Lunar Phaseshift have 50% of their original effectiveness.";
ritualDetails.en[6] = "When using Lunar Phaseshift on allies other than Wonder, if Wonder is not in the Arcana Link state, also copy buffs granted to the ally in the Arcana Link state to Wonder with 50% of their original effectiveness. The applied buffs last for 1 turn, and certain special buffs cannot be copied.\nGo for Broke can be used 1 more time.";
ritualDetails.jp[0] = "汐見琴音を獲得すると、戦闘中、場にいる優越ロールの怪盗１体ごとに、味方全体の最終ダメージ増幅が１%上昇する（自身が戦闘に参加していない場合でも有効）。戦闘開始時、攻撃力が最も高い支配／反抗ロールの味方を『月下の仲間』状態にする。自身のターン開始時、『月下の仲間』の対象を再選択できる。複数の味方を同時に『月下の仲間』状態に選択することはできない。\n『月下の仲間』状態の味方がスキルを使用、または自身が『月下の仲間』状態の味方にスキルを使用した時、対象の『ルネーション』が増加する（最大１０まで）。また、『ルネーション』に応じて以下の効果を獲得する。\n「１：攻撃力が１０%上昇」\n「５：貫通が１５%上昇」\n「１０：クリティカルダメージが２０%上昇」\n『ルネーション』は『月下の仲間』を再選択するとリセットされる。\nさらに汐見琴音は戦闘中に一度だけ、アシスト『全力全開』を発動できる。発動すると『運命の輪』状態になる。";
ritualDetails.jp[1] = "『運命の輪』状態になった時、即座にハイライトゲージを消費しないハイライトを１回発動する。\n味方を『月下の仲間』状態にした時、その対象に永続する『絆の力』を１つ付与し、『ルネーション』が５になる。\n『絆の力』を３つ獲得している味方に『琴奏の調べ』を使用した時、５ターンの間、追加で対象のクリティカルダメージが４０%上昇する。";
ritualDetails.jp[2] = "『運命の輪』状態の時、自身がスキル／ハイライトで付与する全ての効果の持続ターンが追加で１ターン延長される。また『焔華・緋月昂揚』で、複製した強化効果の効果量が５０%になる。";
ritualDetails.jp[3] = "『琴奏の調べ』／『戦術技能』のスキルレベルが上昇する。";
ritualDetails.jp[4] = "ハイライト能力追加：２ターンの間、味方全体の与ダメージが２５%上昇する。";
ritualDetails.jp[5] = "『月鳴の炎』／『焔華・緋月昂揚』のスキルレベルが上昇する。";
ritualDetails.jp[6] = "主人公以外の味方に『焔華・緋月昂揚』を使用した時、主人公が『月下の仲間』状態でなければ、追加で主人公が『月下の仲間』状態の味方に付与した強化効果を元の効果量の５０%で複製する。この効果は１ターン持続し、一部の特殊な効果は複製されない。\n『全力全開』の使用回数が１回追加される。";
function makeRitual(locale, characterName) { const value = { name: characterName }; ritualNames[locale].forEach((name, index) => { value[`r${index}`] = name; value[`r${index}_detail`] = ritualDetails[locale][index]; }); return value; }
window.ritualData["코토네"] = makeRitual("kr", "시오미 코토네");
/*
  "name": "시오미 코토네",
  "r0": "위대한 선택",
  "r0_detail": "시오미 코토네 획득 후, 전투 중 필드에 있는 아군 우월 동료 수에 따라 아군 전체의 총 대미지 증폭이 증가한다. 우월 동료 1명당 총 대미지 증폭이 1% 증가한다(시오미 코토네의 필드 출전 여부와 무관).\n전투 시작 시 자동으로 아군 중 공격력이 가장 높은 반항/지배 동료를 『월하 동료』로 지정한다. 시오미 코토네의 턴 시작 시 『월하 동료』를 다시 지정할 수 있다.\n『월하 동료』가 페르소나 스킬을 시전하거나 자신이 『월하 동료』에게 페르소나 스킬을 시전한 후, 목표의 삭망월 레벨이 1레벨 상승하며(최대 10레벨), 삭망월 레벨에 따라 버프를 획득한다.\n삭망월 1레벨: 공격력 50% 증가\n삭망월 5레벨: 관통 15% 증가\n삭망월 10레벨: 크리티컬 효과 50% 증가\n\n시오미 코토네는 특수 스킬 『전력 전개』를 보유하며, 시전 후 『운명의 수레바퀴』 상태에 진입한다(전투 중 1회 사용 가능).",
  "r1": "메아리치는 현의 소리",
  "r1_detail": "『운명의 수레바퀴』 상태에 진입하면 자신이 즉시 에너지를 소모하지 않는 HIGHLIGHT를 1회 시전한다.\n『월하 동료』를 선택한 후 『월하 동료』는 영구적인 『인연의 힘』 1중첩을 획득하고, 삭망월 레벨이 즉시 5레벨로 상승한다.\n목표를 향해 『현의 선율』 사용 시, 목표의 『인연의 힘』이 3중첩이면 5턴 동안 목표의 크리티컬 효과가 30% 추가로 증가한다.",
  "r2": "든든한 버팀목",
  "r2_detail": "『운명의 수레바퀴』 상태에서 자신이 페르소나 스킬/HIGHLIGHT로 부여한 모든 지속 효과가 1턴 추가 연장된다.\n『염화·떠오르는 붉은 달』로 복사한 버프 효과의 『기본 복사 비율』이 기존의 1.25배로 증가한다.",
  "r3": "만월의 밤",
  "r3_detail": "『현의 선율』, 전투 기술 레벨이 증가한다.",
  "r4": "무궁한 인연",
  "r4_detail": "HIGHLIGHT가 아군 전체의 대미지를 추가로 25% 증가시킨다.",
  "r5": "꺼지지 않는 불꽃",
  "r5_detail": "『달의 불꽃』, 『염화·떠오르는 붉은 달』 레벨이 증가한다.",
  "r6": "영혼의 시편",
  "r6_detail": "『전력 전개』의 사용 가능 횟수가 1회 추가된다.\n『염화·떠오르는 붉은 달』 사용 시 스킬 메인 목표가 원더가 아닐 경우, 원더가 부여한 버프 효과를 추가로 복사할 수 있으며, 효과 수치는 원본 수치의 『기본 복사 비율』로 적용된다."
};
*/
window.enCharacterRitualData["코토네"] = makeRitual("en", "Kotone Shiomi");
window.jpCharacterRitualData["코토네"] = makeRitual("jp", "汐見 琴音");
window.cnCharacterRitualData["코토네"] = {
  "name": "汐见琴音",
  "r0": "伟大的抉择",
  "r0_detail": "获得汐见琴音后，战斗中根据我方在场的优越同伴数量提升所有同伴总伤害增幅，每有1个优越同伴提升1%的总伤害增幅。（无论汐见琴音是否在场）\n战斗开始时，会自动选择友方攻击力最高的反抗/支配同伴成为『月下伙伴』，汐见琴音的回合开始时可以重新选择『月下伙伴』。\n『月下伙伴』每次释放人格面具技能/自身对『月下伙伴』释放人格面具技能后，使目标的朔望月提升1级，上限10级，并根据朔望月获得增益。\n朔望月1级：攻击力提升50%\n朔望月5级：穿透提升15%\n朔望月10级：暴击效果提升50%\n\n汐见琴音拥有特殊技能『全力全开』，释放后进入『命运之轮』状态，战斗中可使用一次。",
  "r1": "回响的琴音",
  "r1_detail": "进入『命运之轮』状态自身立刻释放1次不消耗能量的HIGHLIGHT。\n选择『月下伙伴』后，『月下伙伴』获得1层永久『羁绊之力』，并且朔望月直接提升为5级。\n对目标使用『琴奏之调』后，若目标『羁绊之力』为3层，则额外使目标暴击效果提升30%，持续5回合。",
  "r2": "主心骨",
  "r2_detail": "『命运之轮』状态下，自身人格面具技能/HIGHLIGHT添加的所有持续效果都额外延长1回合。\n『焰华·绯月昂扬』复制增益效果的『基础复制比例』提升提升为原本的1.25倍。",
  "r3": "满月之夜",
  "r3_detail": "『琴奏之调』、战斗技巧等级提升。",
  "r4": "无穷的羁绊",
  "r4_detail": "HIGHLIGHT额外使所有同伴伤害提升25%。",
  "r5": "不会消逝的火焰",
  "r5_detail": "『月鸣之炎』、『焰华·绯月昂扬』等级提升。",
  "r6": "灵魂诗篇",
  "r6_detail": "『全力全开』额外增加1次使用次数。\n使用『焰华·绯月昂扬』时，若技能主目标不是WONDER，则可以额外复制来自WONDER的增益效果，效果值为原本值的『基础复制比例』。"
};
