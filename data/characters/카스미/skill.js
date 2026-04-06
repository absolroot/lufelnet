window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["카스미"] = {
  "name": "요시자와 카스미",
  "skill1": {
    "name": "어둠 속 빛",
    "element": "축복",
    "type": "단일 피해",
    "sp": 23,
    "cool": 0,
    "description": "액티브로 해당 스킬 사용 시 1명의 적에게 공격력 186.9%/206.1%/198.4%/217.5%의 축복 속성 대미지를 주고, 자신은 춤사위 『용기의 발걸음』을 획득한다(최대 3중첩). 댄스 파트너가 해당 스킬을 발동할 경우, 1명의 적에게 공격력 121.6%/134.1%/129.1%/141.5%의 축복 속성 대미지를 주고, 자신은 춤사위 『용기의 발걸음』을 획득한다(최대 3중첩)."
  },
  "skill2": {
    "name": "함께 추는 춤",
    "element": "버프",
    "type": "버프",
    "sp": 22,
    "cool": 0,
    "description": "1명의 동료를 선택해 1턴 동안 『댄스 파트너』로 삼는다. 자신과 『댄스 파트너』의 공격력이 32.4%/35.7%/34.4%/37.7% 증가하며 3턴 동안 지속된다. 자신은 춤사위 『민첩한 발걸음』을 획득한다(최대 1중첩). 『댄스 파트너』가 페르소나 스킬을 사용하면 자신이 즉시 임의의 적 목표에게 『어둠 속 빛』을 1회 시전한다(『댄스 파트너』의 스킬 목표가 적일 경우, 해당 메인 목표에게 시전). 『댄스 파트너』는 동시에 1명만 존재할 수 있다."
  },
  "skill3": {
    "name": "피어나는 마음",
    "element": "축복",
    "type": "단일 피해",
    "sp": 27,
    "cool": 0,
    "description": "1명의 적에게 공격력 249.1%/274.6%/264.4%/289.9%의 축복 속성 대미지를 준다. 해당 스킬을 사용할 때 자신이 『가장무도회』 상태일 경우 스킬 대미지가 30% 증가하고 자신의 크리티컬 효과가 29.3%/29.3%/31.1%/31.1% 증가한다."
  },
  "skill_highlight": {
    "element": "축복",
    "type": "단일 피해",
    "description": "발동 조건: 자신이 『가장무도회』 상태일 것\n1명의 적에게 공격력 273.1%/301.0%/289.8%/317.8%의 축복 속성 대미지를 준다. 자신이 춤사위 보유 시 해당 대응하는 버프 효과를 획득한다. 『용기의 발걸음』: 중첩마다 HIGHLIGHT 스킬 대미지가 15% 증가한다. 『민첩한 발걸음』: HIGHLIGHT의 크리티컬 확률이 10% 증가하고, 크리티컬 효과가 20% 증가한다.",
    "cool": 0
  },
  "passive1": {
    "name": "신심",
    "element": "패시브",
    "description": "자신이 춤사위를 1중첩 보유할 때마다 축복 속성 대미지가 15.0% 증가한다(최대 45.0% 증가).",
    "cool": 0
  },
  "passive2": {
    "name": "결의",
    "element": "패시브",
    "description": "아군 동료가 HIGHLIGHT/테우르기아를 발동하면 요시자와 카스미의 공격력이 45.0% 증가하며 2턴 동안 지속된다(최대 2회 중첩 가능).",
    "cool": 0
  }
};

window.enCharacterSkillsData["카스미"] = {
  "name": "Kasumi Yoshizawa",
  "skill1": {
    "name": "Cinderella Glow",
    "element": "축복",
    "type": "단일피해",
    "sp": 23,
    "cool": 0,
    "description": "Deal Bless damage to 1 foe equal to 186.9%/206.1%/198.4%/217.5% of Attack, and gain Lead Step.\nIf this skill is activated by an ally with Dance Partner, deal Bless damage to 1 foe equal to 121.6%/134.1%/129.1%/141.5%, and gain 1 Lead Step.\nLead Step stacks up to 3 times."
  },
  "skill2": {
    "name": "Invitation",
    "element": "버프",
    "type": "버프",
    "sp": 22,
    "cool": 0,
    "description": "Grant Dance Partner to 1 ally for 1 turn. Only 1 ally may have Dance Partner at one time.\nIncrease Attack of Kasumi and the selected ally by 32.4%/35.7%/34.4%/37.7% for 3 turns. Also, Kasumi gains Follow Step. This effect does not stack.\nWhen an ally with Dance Partner uses a skill, immediately activate Cinderella Glow 1 time on 1 random foe (if the skill is activated on a foe, activate Cinderella Glow 1 time on that foe)."
  },
  "skill3": {
    "name": "Midnight Magic",
    "element": "축복",
    "type": "단일피해",
    "sp": 27,
    "cool": 0,
    "description": "Deal Bless damage to 1 foe equal to 249.1%/274.6%/264.4%/289.9% of Attack.\nWhen using this skill while in Masquerade mode, increase skill damage by 30%, and critical damage by 29.3%/29.3%/31.1%/31.1%."
  },
  "skill_highlight": {
    "element": "축복",
    "type": "단일피해",
    "unlock": "자신이 『가면무도회』 상태.",
    "description": "Can be activated in Masquerade mode. Deal Bless damage to 1 foe equal to 273.1%/301.0%/289.8%/317.8% of Attack. Also, with Step stacks, gain additional effects accordingly.\nLead Step: Increase Highlight damage by 15% for each stack.\nFollow Step: Increase Highlight critical rate by 10%, and critical damage by 20%.",
    "cool": 0
  },
  "passive1": {
    "name": "Rhythm Count",
    "element": "패시브",
    "description": "For every Step stack, increase Bless damage by 15% (up to 45.0%).",
    "cool": 0
  },
  "passive2": {
    "name": "Steps of Faith",
    "element": "패시브",
    "description": "When an ally other than Kasumi uses a Highlight, increase Kasumi's Attack by 45.0% for 2 turns. Stacks up to 2 times.",
    "cool": 0
  }
};

window.jpCharacterSkillsData["카스미"] = {
  "name": "芳澤 かすみ",
  "skill1": {
    "name": "シンデレラ・グロー",
    "element": "축복",
    "type": "단일피해",
    "sp": 23,
    "cool": 0,
    "description": "敵単体に攻撃力186.9%/206.1%/198.4%/217.5%の祝福属性ダメージを与え、『リード・ステップ』を獲得する。\n『ダンスパートナー』状態の味方によってこのスキルが発動した時、敵単体に攻撃力121.6%/134.1%/129.1%/141.5%の祝福属性ダメージを与え、『リード・ステップ』を獲得する。\n『リード・ステップ』は最大３つまで累積できる。"
  },
  "skill2": {
    "name": "インヴィテーション",
    "element": "버프",
    "type": "버프",
    "sp": 22,
    "cool": 0,
    "description": "１ターンの間、味方単体を『ダンスパートナー』状態にする。複数の味方を同時に『ダンスパートナー』状態にすることはできない。\n３ターンの間、自身と選択した味方の攻撃力が32.4%/35.7%/34.4%/37.7%上昇する。さらに自身は『フォロー・ステップ』を獲得する。この効果は累積しない。\n『ダンスパートナー』状態の味方がスキルを使用した時、即座にランダムな敵単体に『シンデレラ・グロー』を１回発動する（敵にスキルを発動した場合、その敵に『シンデレラ・グロー』を１回発動する）。"
  },
  "skill3": {
    "name": "ミッドナイトマジック",
    "element": "축복",
    "type": "단일피해",
    "sp": 27,
    "cool": 0,
    "description": "敵単体に攻撃力249.1%/274.6%/264.4%/289.9%の祝福属性ダメージを与える。\n『マスカレード』状態中にこのスキルを使用する時、スキルダメージが３０%上昇し、クリティカルダメージが29.3%/29.3%/31.1%/31.1%上昇する。"
  },
  "skill_highlight": {
    "element": "축복",
    "type": "단일피해",
    "unlock": "자신이 『가면무도회』 상태.",
    "description": "『マスカレード』状態の時に発動でき、敵単体に攻撃力273.1%/301.0%/289.8%/317.8%の祝福属性ダメージを与える。さらに『ステップ』を獲得している時、対応する強化効果を獲得する。\n『リード・ステップ』：１つごとにハイライトダメージが１５%上昇する。\n『フォロー・ステップ』：ハイライトのクリティカル率が１０%上昇し、クリティカルダメージが２０%上昇する。",
    "cool": 0
  },
  "passive1": {
    "name": "リズムカウント",
    "element": "패시브",
    "description": "『ステップ』１つごとに、祝福属性ダメージが15%上昇する（最大45.0%まで）。",
    "cool": 0
  },
  "passive2": {
    "name": "信念の足跡",
    "element": "패시브",
    "description": "自身以外の味方がハイライトを発動した時、２ターンの間、自身の攻撃力が45.0%上昇する。最大２つまで累積できる。",
    "cool": 0
  }
};

window.cnCharacterSkillsData["카스미"] = {
  "name": "芳泽霞",
  "skill1": {
    "name": "黑夜微光",
    "element": "축복",
    "type": "单体伤害",
    "sp": 23,
    "cool": 0,
    "description": "主动使用该技能时，对1名敌人造成186.9%/206.1%/198.4%/217.5%攻击力的祝福属性伤害，自身获得舞姿『勇气步伐』，上限3层。舞伴触发该技能时，技能效果为对1名敌人造成121.6%/134.1%/129.1%/141.5%攻击力的祝福属性伤害，自身获得舞姿『勇气步伐』，上限3层。"
  },
  "skill2": {
    "name": "携手共舞",
    "element": "버프",
    "type": "增益",
    "sp": 22,
    "cool": 0,
    "description": "选择1名同伴使其成为『舞伴』，持续1回合。自身和『舞伴』攻击力提升32.4%/35.7%/34.4%/37.7%，持续3回合。自身获得舞姿『灵巧步伐』，上限1层。『舞伴』使用人格面具技能后，自身立刻对随机敌方目标释放1次『黑夜微光』（若『舞伴』的技能目标为敌方，则改为对技能主目标释放1次『黑夜微光』）。同时只能存在一个『舞伴』。"
  },
  "skill3": {
    "name": "心绪绽放",
    "element": "축복",
    "type": "单体伤害",
    "sp": 27,
    "cool": 0,
    "description": "对1名敌人造成249.1%/274.6%/264.4%/289.9%攻击力的祝福属性伤害。使用该技能时若自身处于『化装舞会』状态，则技能伤害提升30%、自身暴击效果提升29.3%/29.3%/31.1%/31.1%。"
  },
  "skill_highlight": {
    "element": "축복",
    "type": "单体伤害",
    "description": "发动条件：自身处于『化装舞会』状态\n对1名敌人造成273.1%/301.0%/289.8%/317.8%攻击力的祝福属性伤害。自身拥有舞姿时，获得对应的增益效果。『勇气步伐』：每层提升HIGHLIGHT技能伤害15%。『灵巧步伐』：HIGHLIGHT提升10%暴击率、20%暴击效果。",
    "cool": 0,
    "name": "HIGHLIGHT"
  },
  "passive1": {
    "name": "信心",
    "element": "패시브",
    "description": "自身每拥有一层舞姿，祝福属性伤害提升15%，上限45.0%。",
    "cool": 0
  },
  "passive2": {
    "name": "决意",
    "element": "패시브",
    "description": "友方同伴发动HIGHLIGHT/神通法后，芳泽霞攻击力提升45.0%，持续2回合，可叠加2层。",
    "cool": 0
  }
};

