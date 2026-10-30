window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["후카"] = {
  "name": "야마기시 후카",
  "skill1": {
    "name": "빛의 힘",
    "element": "버프",
    "type": "버프",
    "sp": 0,
    "cool": 4,
    "description": "모든 아군의 공격력이 10.0%/11.0%/11.2%/12.2%+야마기시 후카의 공격력 100포인트마다 1.143% 증가하며(상한 40.0%/44.0%/44.8%/48.8%), 대미지가 8.0%/8.8%/9.0%/9.8%+야마기시 후카의 공격력 100포인트마다 0.914% 증가한다(상한 32.0%/35.2%/35.8%/39.0%). 효과는 2턴 동안 지속된다. 자신은 『소망의 청취』를 1중첩 획득한다."
  },
  "skill2": {
    "name": "신성한 기도",
    "element": "버프",
    "type": "버프",
    "sp": 0,
    "cool": 16,
    "description": "초기 준비 시간: 16회 행동\n모든 아군의 공격력이 6.0%/6.6%/6.7%/7.3%+야마기시 후카의 공격력 100포인트마다 0.686% 증가하며(상한 24.0%/26.4%/26.9%/29.3%), 3턴 동안 지속된다. 스킬 메인 목표가 S.E.E.S 멤버인 경우 테우르기아 에너지를 35포인트 회복시키고, 해당 목표의 테우르기아 대미지가 6.0%/6.6%/6.7%/7.3%+야마기시 후카의 공격력 100포인트마다 0.686% 증가하며(상한 24.0%/26.4%/26.9%/29.3%), 3턴 동안 지속된다. 스킬 메인 목표가 S.E.E.S 멤버가 아닌 경우 HIGHLIGHT 에너지를 35포인트 회복시키고, 해당 목표의 HIGHLIGHT 대미지가 6.0%/6.6%/6.7%/7.3%+야마기시 후카의 공격력 100포인트마다 0.686% 증가하며(상한 24.0%/26.4%/26.9%/29.3%), 3턴 동안 지속된다.\n해당 스킬의 준비 시간은 별도로 계산되며, 해당 스킬 시전 시 다른 해명 스킬의 준비 시간에 영향을 주지 않는다. 해당 스킬의 전투 중 표시되는 준비 시간은 남은 준비 시간이다."
  },
  "skill3": {
    "name": "신념의 파동",
    "element": "버프",
    "type": "버프",
    "sp": 0,
    "cool": 4,
    "description": "모든 아군의 크리티컬 효과가 10.0%/11.0%/11.2%/12.2%+야마기시 후카의 크리티컬 효과 1%마다 0.625% 증가하며(상한 40.0%/44.0%/44.8%/48.8%), 2턴 동안 지속된다. 자신은 『소망의 청취』를 1중첩 획득한다.\n임의 동료가 다음 특정 조건을 만족하면 우선도에 따라 다음 효과 중 1개가 발동된다(만족하는 조건이 없을 시 다음 중 1개 효과 랜덤 발동).\n1. 임의 동료가 정신 이상 상태일 시 목표의 상태 이상 1개 제거.\n2. 임의 동료의 생명이 최대 생명의 25%보다 낮을 시 생명 백분율이 가장 낮은 동료의 생명 15% 회복.\n3. 임의 동료의 SP가 30포인트보다 낮을 시 SP가 가장 낮은 동료의 SP를 30포인트 회복."
  },
  "skill_highlight": {
    "name": "속성 증가",
    "element": "패시브",
    "description": "해명 괴도 각 속성의 20%만큼 출전 중인 모든 동료의 상응한 속성 수치가 증가한다."
  },
  "passive1": {
    "name": "자비",
    "element": "패시브",
    "description": "임의 동료가 테우르기아 또는 HIGHLIGHT 발동 시 2턴 동안 아군 전체의 크리티컬 효과가 24.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "진심",
    "element": "패시브",
    "description": "전투 시작 시 『백업 캐릭터』 각 속성의 4.5%만큼 필드에 있는 아군 전체의 해당 속성 값이 증가한다.",
    "cool": 0
  }
};

window.enCharacterSkillsData["후카"] = {
  "name": "Fuuka Yamagishi",
  "skill1": {
    "name": "Luminous Force",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "Increase party's Attack by 12.0%/13.2%/13.4%/14.6% (for every 100 points of Fuuka's Attack, increase by 1.371% more, up to a maximum of 48.0%/52.8%/53.8%/58.6%), and increase damage by 12.0%/13.2%/13.4%/14.6% (for every 100 points of Fuuka's Attack, increase by 1.371% more, up to a maximum of 48.0%/52.8%/53.8%/58.6%). Lasts for 2 turns.\nGain 1 Over Oracle stack."
  },
  "skill2": {
    "name": "Divine Prayer",
    "element": "버프광역",
    "type": "버프",
    "cool": 16,
    "description": "Increase party's Attack by 8.0%/8.8%/9.0%/9.8% (for every 100 points of Fuuka's Attack, increase by 0.914% more, up to a maximum of 32.0%/35.2%/35.8%/39.0%) for 3 turns.\nIf the main target has a Theurgy, increase the Theurgy gauge by 35. Also, increase the target's Theurgy damage by 8.0%/8.8%/9.0%/9.8% (for every 100 points of Fuuka's Attack, increase by 0.914% more, up to a maximum of 32.0%/35.2%/35.8%/39.0%) for 3 turns.\nIf the main target has a Highlight, increase the Highlight gauge by 35%. Also, increase the target's Highlight damage by 8.0%/8.8%/9.0%/9.8% (for every 100 points of Fuuka's Attack, increase by 0.914% more, up to a maximum of 32.0%/35.2%/35.8%/39.0%) for 3 turns.\nThis skill's cooldown is calculated independently, and does not affect other support skills (the remaining cooldown is displayed in battle).\nInitial cooldown time: 16 ally actions"
  },
  "skill3": {
    "name": "Thoughtful Waves",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "Increase party's critical damage by 12.0%/13.2%/13.4%/14.6% (for every 1% of Fuuka's critical multiplier, increase by 0.75% more, up to a maximum of 48.0%/52.8%/53.8%/58.6%) for 2 turns. Also, gain 1 Over Oracle stack.\nIf allies meet special conditions, activate 1 of the following effects based on the order listed (if conditions are not met, activate 1 effect at random).\n1. If allies are inflicted with spiritual ailments, remove 1 ailment from the target (incurable ailments count for the condition, but they cannot be removed).\n2. If allies' HP is below 25%, restore 15% of max HP to the ally with the lowest remaining HP percentage.\n3. If allies have less than 30 SP, restore 30 SP to the ally with the lowest SP."
  },
  "skill_highlight": {
    "name": "Stat Buff",
    "element": "패시브",
    "description": "Increase party's stats by 20% of Fuuka's stats."
  },
  "passive1": {
    "name": "Mercy",
    "element": "패시브",
    "description": "When an ally activates a Highlight or Theurgy, increase party's critical damage by 24.0% for 2 turns."
  },
  "passive2": {
    "name": "Courtesy",
    "element": "패시브",
    "description": "At the start of battle, increase party's stats based on 4.5% of the Shift Member's stats."
  }
};

window.jpCharacterSkillsData["후카"] = {
  "name": "山岸 風花",
  "skill1": {
    "name": "ルミナスフォース",
    "element": "버프광역",
    "type": "버프",
    "sp": 0,
    "cool": 4,
    "description": "2ターンの間、味方全体の攻撃力が12.0%/13.2%/13.4%/14.6%上昇し、追加で風花の攻撃力100ごとに1.371%になるように上昇（追加上昇分は最大48.0%/52.8%/53.8%/58.6%まで）し、与ダメージが12.0%/13.2%/13.4%/14.6%上昇し、追加で風花の攻撃力100ごとに1.371%になるように上昇（追加上昇分は最大48.0%/52.8%/53.8%/58.6%まで）する。\n『オーバーオラクル』を1つ獲得する。"
  },
  "skill2": {
    "name": "神気の祈り",
    "element": "버프광역",
    "type": "버프",
    "sp": 0,
    "cool": 16,
    "description": "3ターンの間、味方全体の攻撃力が8.0%/8.8%/9.0%/9.8%上昇し、追加で風花の攻撃力100ごとに0.914%になるように上昇（追加上昇分は最大32.0%/35.2%/35.8%/39.0%まで）する。\n選択した対象がテウルギアを持つ場合、テウルギアゲージが35増加する。さらに3ターンの間、対象のテウルギアの与ダメージが8.0%/8.8%/9.0%/9.8%上昇し、追加で風花の攻撃力100ごとに0.914%になるように上昇（追加上昇分は最大32.0%/35.2%/35.8%/39.0%まで）する。\n選択した対象がハイライトを持つ場合、ハイライトゲージが35%増加する。さらに3ターンの間、対象のハイライトの与ダメージが8.0%/8.8%/9.0%/9.8%上昇し、追加で風花の攻撃力100ごとに0.914%になるように上昇（追加上昇分は最大32.0%/35.2%/35.8%/39.0%まで）する。\nこのスキルのクールタイムは個別で計算され、他の支援スキルには影響しない（戦闘中の表示は残りのクールタイムとなる）。\n初期クールタイム：味方の行動16回"
  },
  "skill3": {
    "name": "想いの波動",
    "element": "버프광역",
    "type": "버프",
    "sp": 0,
    "cool": 4,
    "description": "2ターンの間、味方全体のクリティカルダメージが12.0%/13.2%/13.4%/14.6%上昇し、追加で風花のCRT倍率1%ごとに0.75%になるように上昇（追加上昇分は最大48.0%/52.8%/53.8%/58.6%まで）する。さらに『オーバーオラクル』を1つ獲得する。\n特定の条件を満たす味方がいる時、以下の優先順位で効果が1つ発動する（条件を満たしていない場合、ランダムに1つ発動）。\n「1．行動異常の味方がいる時、いずれかの対象の状態異常を1つ治療（治療不可能な行動異常も条件の対象となるが、治療はされない）」\n「2．HPが25%未満の味方がいる時、HP割合が最も低い味方を最大HPの15%分回復」\n「3．SPが30未満の味方がいる時、SPが最も低い味方のSPを30回復」"
  },
  "skill_highlight": {
    "name": "ステータス強化",
    "element": "패시브",
    "description": "解明系怪盗の各属性の20%分、味方全体のステータスを上昇させる。"
  },
  "passive1": {
    "name": "慈悲",
    "element": "패시브",
    "description": "味方がハイライト／テウルギアを発動した時、2ターンの間、味方全体のクリティカルダメージが24.0%上昇する。"
  },
  "passive2": {
    "name": "厚意",
    "element": "패시브",
    "description": "戦闘開始時、『シフトメンバー』のステータスの4.5%分、味方全体のステータスが上昇する。"
  }
};

window.cnCharacterSkillsData["후카"] = {
  "name": "山岸风花",
  "skill1": {
    "name": "光辉之力",
    "element": "버프",
    "type": "增益",
    "sp": 0,
    "cool": 4,
    "description": "使所有同伴攻击力提升10.0%/11.0%/11.2%/12.2%+山岸风花每有100点攻击力提升1.143%，上限40.0%/44.0%/44.8%/48.8%、伤害提升8.0%/8.8%/9.0%/9.8%+山岸风花每有100点攻击力提升0.914%，上限32.0%/35.2%/35.8%/39.0%，持续2回合，自身获得1层『愿望聆听』。"
  },
  "skill2": {
    "name": "神圣祈祷",
    "element": "버프",
    "type": "增益",
    "sp": 0,
    "cool": 16,
    "description": "初始准备时间：16次行动\n使所有同伴攻击力提升6.0%/6.6%/6.7%/7.3%+山岸风花每有100点攻击力提升0.686%，上限24.0%/26.4%/26.9%/29.3%，持续3回合。若技能主目标是S.E.E.S.成员，则为其恢复35点神通法能量，并使其神通法伤害提高6.0%/6.6%/6.7%/7.3%+山岸风花每有100点攻击力提升0.686%，上限24.0%/26.4%/26.9%/29.3%，持续3回合。若技能主目标为非S.E.E.S.成员，则恢复35点HIGHLIGHT能量，并使其HIGHLIHGT伤害提高6.0%/6.6%/6.7%/7.3%+山岸风花每有100点攻击力提升0.686%，上限24.0%/26.4%/26.9%/29.3%，持续3回合。\n该技能的准备时间独立计算，释放该技能后不会影响其他解明技能的准备时间。该技能在战斗中显示的准备时间为剩余准备时间。"
  },
  "skill3": {
    "name": "心念的波动",
    "element": "버프",
    "type": "增益",
    "sp": 0,
    "cool": 4,
    "description": "使所有同伴暴击效果提升10.0%/11.0%/11.2%/12.2%+山岸风花每有1%暴击效果提升0.625%，上限40.0%/44.0%/44.8%/48.8%，持续2回合，自身获得1层『愿望聆听』。\n任意同伴满足以下对应条件时，按照优先级触发以下效果中的1个。（不满足任何条件时，则随机触发其中1个效果）\n1、任意同伴处于精神异常状态，解除目标1个异常状态。\n2、任意同伴的生命值低于最大生命值的25%，恢复生命值百分比最低的同伴15%最大生命值。\n3、任意同伴的精力值低于30点，恢复精力值最低的同伴30点精力值。"
  },
  "skill_highlight": {
    "name": "属性提升",
    "element": "패시브",
    "description": "在场所有同伴的对应属性值提升，提升量相当于解明怪盗各属性的20%。"
  },
  "passive1": {
    "name": "慈悲",
    "element": "패시브",
    "description": "任意同伴释放神通法或HIGHLIGHT后，使全体同伴暴击效果提升24.0%，持续2回合。",
    "cool": 0
  },
  "passive2": {
    "name": "深情",
    "element": "패시브",
    "description": "战斗开始时根据『后备角色』各属性的4.5%，提升在场的所有同伴的相应属性值。",
    "cool": 0
  }
};

