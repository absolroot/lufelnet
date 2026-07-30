window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["미유·여름"] = {
  "name": "사하라 미유·여름",
  "skill1": {
    "name": "해월의 꿈",
    "element": "빙결광역",
    "type": "광역 피해",
    "sp": 0,
    "cool": 0,
    "description": "모든 적에게 공격력 100.7%/111.0%/106.9%/117.2%의 빙결 속성 대미지를 주고, 2턴 동안 100%의 기본 확률로 목표를 동결 상태에 빠뜨린다. 자신은 SP 40포인트를 회복한다(해당 효과는 SP 회복 속성의 영향 받음). 해당 방식으로 획득하는 SP는 SP 상한을 돌파할 수 있다(최대 SP 상한에 해당하는 만큼의 추가 SP 획득)."
  },
  "skill2": {
    "name": "푸른 협주",
    "element": "빙결광역",
    "type": "광역 피해",
    "sp": 0,
    "cool": 0,
    "description": "적 전체에 공격력 178.7%/197.0%/189.7%/208.0%의 빙결 속성 대미지를 주고, 『바다의 영역』 내에 있으면 『파도의 노래』 중첩마다 해당 스킬 대미지가 10% 증가하며, 해당 스킬 시전 후 『바다의 영역』에서 퇴장하고 『파도의 노래』를 초기화한다. 해당 스킬은 추가 효과로 간주한다."
  },
  "skill3": {
    "name": "빛 너머의 파도",
    "element": "버프",
    "type": "강화",
    "sp": 60,
    "cool": 0,
    "description": "서핑보드를 타고 즉시 자신의 정신 이상 상태를 해제한 뒤 『바다의 영역』 전개: 지속 시간 동안 다운, 정신 이상, 제어 효과에 면역이 되며, 자신은 근접 공격과 총기 공격 시전 및 아이템 사용을 할 수 없게 된다. 임의의 상태 획득 시 지속 시간이 1턴 연장된다. 지속 시간 동안 임의의 동료 턴 종료 시 자신의 SP가 충분한 경우에는 자동으로 SP를 일정량 소모해 『해일 구름』을 시전한다.\n『해일 구름』: SP 30포인트를 소모하여 적 전체에 공격력 50.2%/55.3%/53.3%/58.4%의 빙결 속성 대미지를 주고, 자신이 『파도의 노래』 1중첩을 획득한다. 『파도의 노래』 중첩마다 『해일 구름』의 스킬 대미지가 5% 증가하고, 소모 SP가 30포인트 증가한다(4회 중첩 가능). 『해일 구름』은 추가 효과로 간주한다. 해당 추가 효과로는 적에게 다운 수치 대미지를 줄 수 없다.\n해당 스킬을 다시 시전하면 『바다의 영역』에서 나가고 『파도의 노래』가 제거된다. 이번 턴에 다른 스킬을 사용할 수 있지만, 『바다의 영역』은 다시 전개할 수 없다."
  },
  "skill_highlight": {
    "name": "",
    "element": "빙결광역",
    "type": "광역피해",
    "sp": 0,
    "cool": 4,
    "description": "모든 적에게 공격력 219.6%/242.1%/233.1%/255.6%의 빙결 속성 대미지를 준다. 『바다의 영역』에 있을 경우 공격력 146.4%/161.4%/155.4%/170.4%의 빙결 속성 대미지를 1회 추가로 준다."
  },
  "passive1": {
    "name": "날렵",
    "element": "패시브",
    "description": "전투 중 자신의 SP 회복에 따라 공격력이 증가하며, 최대 280.0%의 SP를 회복하면 98.0%의 공격력이 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "영리",
    "element": "패시브",
    "description": "『바다의 영역』에 있을 경우 주는 대미지가 30.0% 증가한다.",
    "cool": 0
  }
};

window.enCharacterSkillsData["미유·여름"] = {
  "name": "Wavecatcher Miyu",
  "skill1": {
    "name": "Jellyfish Splash",
    "element": "빙결광역",
    "type": "AoE DMG",
    "sp": 0,
    "cool": 0,
    "description": "Deal Ice damage to all foes equal to 100.7%/111.0%/106.9%/117.2% of Attack, and inflict Freeze for 2 turns.\nRestore Wavecatcher Miyu's SP by 40 (this is affected by SP Recovery). This skill can restore SP above max SP (up to the value of max SP)."
  },
  "skill2": {
    "name": "Aerial Tide",
    "element": "빙결광역",
    "type": "AoE DMG",
    "sp": 0,
    "cool": 0,
    "description": "Deal Ice damage to all foes equal to 178.7%/197.0%/189.7%/208.0% of Attack. When Surf is active, for each Offshore stack, increase this skill's damage by 10%. After activating this skill, remove Surf, and remove all Offshore stacks. This skill is counted as a Resonance."
  },
  "skill3": {
    "name": "Paddle Out",
    "element": "버프",
    "type": "Enhance",
    "sp": 60,
    "cool": 0,
    "description": "Remove spiritual ailments from Wavecatcher Miyu, and enter Surf state. When this skill is used again while Surf is active, remove Surf and all Offshore stacks. On the turn when Surf is removed, other skills can be used, but Surf cannot be re-entered.\nSurf: While this state is active, nullify Down, spiritual ailments, and certain unable to act effects, and Wavecatcher Miyu cannot use melee attacks, ranged attacks, or items. Also, extend the duration of buffs and debuffs applied by 1 turn. At the end of an ally's turn, if Wavecatcher Miyu has enough SP to activate Catch a Wave, automatically spend SP and activate Catch a Wave.\nCatch a Wave: Spend 30 SP to deal Ice damage to all foes equal to 50.2%/55.3%/53.3%/58.4% of Attack, and gain 1 Offshore stack. For each Offshore stack, increase the skill damage of Catch a Wave by 5%, and increase the SP cost by 30. Stacks up to 4 times. Catch a Wave is counted as a Resonance, and cannot decrease foes' Down Points."
  },
  "skill_highlight": {
    "name": "Highlight",
    "element": "빙결광역",
    "type": "AoE DMG",
    "sp": 0,
    "cool": 4,
    "description": "Deal Ice damage to all foes equal to 329.4%/363.2%/349.7%/383.4% of Attack. When in Surf state, deal bonus Ice damage equal to 164.7%/181.6%/174.8%/191.7% of Attack 1 time."
  },
  "passive1": {
    "name": "Hang Ten!",
    "element": "패시브",
    "description": "During battle, increase Wavecatcher Miyu's Attack based on SP Recovery. At a maximum of 280.0% SP Recovery, increase Attack up to 98.0%."
  },
  "passive2": {
    "name": "Ride it Out!",
    "element": "패시브",
    "description": "When Surf is active, increase damage by 30.0%."
  }
};

window.jpCharacterSkillsData["미유·여름"] = {
  "name": "海夕・サマーウェーブ",
  "skill1": {
    "name": "ジェリースプラッシュ",
    "element": "빙결광역",
    "type": "全体ダメージ",
    "sp": 0,
    "cool": 0,
    "description": "敵全体に攻撃力100.7%/111.0%/106.9%/117.2%の氷結属性ダメージを与え、２ターンの間、凍結状態にする。\n自身のＳＰを４０回復する（この効果はＳＰ回復の影響を受ける）。このスキルで回復したＳＰは最大ＳＰを超過して回復できる（最大ＳＰの上限値に相当する分まで）。"
  },
  "skill2": {
    "name": "エアリアルタイド",
    "element": "빙결광역",
    "type": "全体ダメージ",
    "sp": 0,
    "cool": 0,
    "description": "敵全体に攻撃力178.7%/197.0%/189.7%/208.0%の氷結属性ダメージを与える。『サーフ』状態の時、『オフショア』１つごとに、このスキルの与ダメージが１０%上昇する。スキル発動後、『サーフ』状態は解除され、『オフショア』は全て消失する。このスキルは意識奏功として扱う。"
  },
  "skill3": {
    "name": "パドル・アウト",
    "element": "버프",
    "type": "強化",
    "sp": 60,
    "cool": 0,
    "description": "自身の行動異常を治療し、『サーフ』状態になる。『サーフ』状態中に再びこのスキルを使用すると『サーフ』状態は解除され、『オフショア』は全て消失する。解除されたターン中は他のスキルを使用できるが、再度『サーフ』状態になることはできない。\n『サーフ』：この状態中は、ダウン／行動異常／一部の行動不能を無効化し、自身は近接攻撃／遠隔攻撃／アイテム使用ができない。また強化／弱体効果が付与された時、その持続ターンが１ターン延長される。さらに味方の行動終了時、『キャッチザウェーブ』に必要なＳＰがあれば、自動的にＳＰを消費して『キャッチザウェーブ』を発動する。\n『キャッチザウェーブ』：ＳＰを３０消費し、敵全体に攻撃力50.2%/55.3%/53.3%/58.4%の氷結属性ダメージを与え、『オフショア』を１つ獲得する。『オフショア』１つごとに、『キャッチザウェーブ』のスキルダメージが５%上昇し、消費ＳＰが３０増加する。最大４つまで累積できる。『キャッチザウェーブ』は意識奏功として扱い、敵のダウン値を減少させることはできない。"
  },
  "skill_highlight": {
    "name": "ハイライト",
    "element": "빙결광역",
    "type": "全体ダメージ",
    "sp": 0,
    "cool": 4,
    "description": "敵全体に攻撃力329.4%/363.2%/349.7%/383.4%の氷結属性ダメージを与える。『サーフ』状態の時、追加で攻撃力164.7%/181.6%/174.8%/191.7%の氷結属性ダメージを１回与える。"
  },
  "passive1": {
    "name": "いい波来てます！",
    "element": "패시브",
    "description": "戦闘中、自身のＳＰ回復に応じて攻撃力が上昇する。最大でＳＰ回復280.0%で、攻撃力が98.0%上昇する。"
  },
  "passive2": {
    "name": "ノリにノってます！",
    "element": "패시브",
    "description": "『サーフ』状態の時、与ダメージが30.0%上昇する。"
  }
};

window.cnCharacterSkillsData["미유·여름"] = {
  "name": "佐原海夕·夏日",
  "skill1": {
    "name": "海月沉梦",
    "element": "빙결광역",
    "type": "群体伤害",
    "sp": 0,
    "cool": 0,
    "description": "对所有敌人造成100.7%/111.0%/106.9%/117.2%攻击力的冰冻属性伤害，有100%的基础概率使目标陷入冻结状态，效果持续2回合。自身恢复40点精力值（该效果受到精力回复属性的影响），通过这种方式获得的精力值可突破精力值上限（最多获得相当于精力值上限的额外精力值）。"
  },
  "skill2": {
    "name": "蔚蓝协奏",
    "element": "빙결광역",
    "type": "群体伤害",
    "sp": 0,
    "cool": 0,
    "description": "对所有敌人造成178.7%/197.0%/189.7%/208.0%攻击力的冰冻属性伤害，处于『海之领域』中，每层『千叠浪』使该技能伤害提升10%，释放该技能后退出『海之领域』并清空『千叠浪』。该技能视为追加效果。"
  },
  "skill3": {
    "name": "踏光跃上晴波",
    "element": "버프",
    "type": "强化",
    "sp": 60,
    "cool": 0,
    "description": "踏上冲浪板，立刻解除自身的精神异常状态并展开『海之领域』：期间免疫倒地、精神异常及控制效果，自身无法释放近战攻击、枪械攻击、无法使用道具；获得任意状态时持续时间延长1回合；期间任意同伴回合结束时，若自身精力值足够，则自动消耗一定精力值释放『潮涌云倾』。\n『潮涌云倾』：消耗30点精力值，对所有敌人造成50.2%/55.3%/53.3%/58.4%攻击力的冰冻属性伤害并使自身获得1层『千叠浪』，每层『千叠浪』使『潮涌云倾』技能伤害提升5%、消耗精力值提升30点，可叠加4层。『潮涌云倾』视为追加效果，该追加效果不能对敌人造成倒地值伤害。\n再次释放该技能时退出『海之领域』并清空『千叠浪』，本回合仍可使用其他技能，但不可再次展开『海之领域』。"
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "빙결광역",
    "type": "群体伤害",
    "sp": 0,
    "cool": 4,
    "description": "对所有敌人造成219.6%/242.1%/233.1%/255.6%攻击力的冰冻属性伤害，若处于『海之领域』中，则额外造成1次146.4%/161.4%/155.4%/170.4%攻击力的冰冻属性伤害。"
  },
  "passive1": {
    "name": "巧取",
    "element": "패시브",
    "description": "战斗中，依据自身精力回复提升攻击力，最多280.0%精力回复提升98.0%攻击力。",
    "cool": 0
  },
  "passive2": {
    "name": "伶俐",
    "element": "패시브",
    "description": "处于『海之领域』中，造成伤害提升30.0%。",
    "cool": 0
  }
};

