window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["하루"] = {
  "name": "오쿠무라 하루",
  "skill1": {
    "name": "집중 조준",
    "element": "염동광역",
    "type": "광역 피해",
    "sp": 26,
    "cool": 0,
    "description": "적 전체에 공격력 68.8%/75.9%/73.0%/80.1%의 염동 속성 대미지를 2단 준다. 97.6%/97.6%/103.6%/103.6%의 기본 확률로 메인 목표에게 『조준점』을 추가하며, 동시에 53.7%/53.7%/57.0%/57.0%의 기본 확률로 다른 목표에게 『조준점』을 추가한 후, 적의 『조준점』을 자신의 『조준점』으로 전환한다(3턴 지속). 자신은 『열에너지 개조』를 획득한다. 총기로 사격 시 자신이 『조준점』을 보유하면 스킬 대미지가 29.3%/32.3%/31.1%/34.1% 증가하고, 총기 사격 완료 후 자신의 모든 『조준점』이 제거된다."
  },
  "skill2": {
    "name": "화력 제압",
    "element": "총격",
    "type": "단일 피해",
    "hp": 12,
    "cool": 0,
    "description": "1명의 적에게 공격력 151.6%/167.1%/160.9%/176.4%의 총격 속성 대미지를 주며, 자신이 『조준점』을 보유하면 관통이 19.5%/19.5%/20.7%/20.7% 증가한다. 자신은 『장갑제거 개조』를 획득해 총기 사격 시 추가로 메인 목표에게 공격력 39.0%/43.0%/41.4%/45.4%의 염동 속성 대미지를 주며, 『열에너지 개조』의 스킬 대미지 증가 효과를 발동할 수 있다."
  },
  "skill3": {
    "name": "아이언 버스트",
    "element": "염동광역",
    "type": "광역 피해",
    "sp": 26,
    "cool": 0,
    "description": "적 전체에 공격력 129.2%/142.5%/137.2%/150.4%의 염동 속성 대미지를 준다. 자신이 『조준점』을 보유하면 크리티컬 확률이 19.5%/19.5%/20.7%/20.7% 증가한다. 자신은 『확산 개조』를 획득해 총기 사격 시 추가로 적 전체에 공격력 29.3%/32.3%/31.1%/34.1%의 염동 속성 대미지를 주며, 『열에너지 개조』의 스킬 대미지 증가 효과를 발동할 수 있다."
  },
  "skill_highlight": {
    "element": "염동광역",
    "type": "광역피해",
    "description": "적 전체에 공격력 206.9%/228.1%/219.6%/240.8%의 염동 속성 대미지를 준다. 『개조』가 최대치가 아니며 『오버클럭 개조』가 없는 경우, 『오버클럭 개조』를 획득해 총기 사격 시 크리티컬 확률이 14.6%/14.6%/15.5%/15.5% 증가한다. 그 외의 경우 이번 공격의 스킬 대미지가 14.6%/16.1%/15.5%/17.0% 증가한다.",
    "cool": 4
  },
  "passive1": {
    "name": "탄사",
    "element": "패시브",
    "description": "전투 중 1.45%의 효과 명중마다 1%의 공격력 보너스를 획득하며, 최대 165.0%의 공격력 보너스를 획득한다.\n50%의 효과 명중마다 추가로 20%의 크리티컬 효과 증가 1중첩을 획득하며, 최대 3중첩까지 획득한다.",
    "cool": 0
  },
  "passive2": {
    "name": "전략",
    "element": "패시브",
    "description": "개조를 1종 사용할 때마다 『총구 가열』을 1중첩 영구 획득한다. 『총구 가열』이 지정 중첩 수에 도달하면 자신이 속성 증가를 획득한다.\n1중첩: 효과 명중 18.0% 증가, 효과 저항 18.0% 증가\n2중첩: 공격력 18.0% 증가, 방어력 18.0% 증가\n3중첩: 크리티컬 효과 18.0% 증가",
    "cool": 0
  }
};
window.enCharacterSkillsData["하루"] = {
  "name": "Haru Okumura",
  "skill1": {
    "name": "Extrasensory Aim",
    "element": "염동광역",
    "type": "광역피해",
    "sp": 26,
    "cool": 0,
    "description": "Deal Psychokinesis damage to all foes equal to 75.8%/83.6%/80.5%/88.3% of Attack (2 hits). 97.6%/97.6%/103.6%/103.6% chance to inflict 1 Target Audience stack on the main target and 53.7%/53.7%/57.0%/57.0% chance to inflict 1 Target Audience stack on other foes. Then, change Target Audience stacks on foes to Target Audience stacks on Haru and Target Audience's duration to 3 turns. Also gain 1 Focused Round stack.\nFocused Round: When using a ranged attack with Target Audience, increase skill damage by 29.3%/32.3%/31.1%/34.1%. After the ranged attack, remove all Target Audience stacks granted to Haru."
  },
  "skill2": {
    "name": "Precise Volley",
    "element": "총격",
    "type": "단일 피해",
    "hp": 12,
    "cool": 0,
    "description": "Deal Gun damage to 1 foe equal to 151.6%/167.1%/160.9%/176.4% of Attack. When Haru has Target Audience, increase this skill's pierce rate by 19.5%/19.5%/20.7%/20.7% and gain 1 Painpoint Round.\nPainpoint Round: When using a ranged attack, also deal Psychokinesis damage to the main target equal to 39.0%/43.0%/41.4%/45.4% of Attack (can gain skill damage increases from Focused Round)."
  },
  "skill3": {
    "name": "Mindful Release",
    "element": "염동광역",
    "type": "광역피해",
    "sp": 26,
    "cool": 0,
    "description": "Deal Psychokinesis damage to all foes equal to 142.1%/156.7%/150.8%/165.4% of Attack. When Haru has Target Audience, increase this skill's critical rate by 19.5%/19.5%/20.7%/20.7% and gain 1 Spillover Round stack.\nSpillover Round: When using a ranged attack, also deal Psychokinesis damage to all foes equal to 29.3%/32.3%/31.1%/34.1% of Attack (can gain skill damage increases from Focused Round)."
  },
  "skill_highlight": {
    "element": "염동광역",
    "type": "광역피해",
    "description": "Deal Psychokinesis damage to all foes equal to 206.9%/228.1%/219.6%/240.8% of Attack. Gain 1 Overload Round if Haru doesn't have any Overload Round stacks and is below maximum Thoughtful Round stacks.\nOverload Round: When using a ranged attack, increase critical rate by 14.6%/14.6%/15.5%/15.5%.\nIf Haru hasn't gained any Overload Round stacks, increase this skill damage by 14.6%/16.1%/15.5%/17.0%.",
    "cool": 4
  },
  "passive1": {
    "name": "Heiress's Leadership",
    "element": "패시브",
    "description": "During battle, increase Attack by 1% for every 1.45% of ailment accuracy (up to 165.0% of Attack). Also increase critical damage by 20% for every 50% of ailment accuracy (stacks up to 3 times).",
    "cool": 0
  },
  "passive2": {
    "name": "Helping Others",
    "element": "패시브",
    "description": "Permanently gain 1 Area to Improve stack for each Thoughtful Round stack gained. Gain the following effects based on the number of Area to Improve stacks.\n1 stack: Increase ailment accuracy by 18.0% and ailment resistance by 18.0%.\n2 stacks: Increase Attack by 18.0% and Defense by 18.0%.\n3 stacks: Increase critical damage by 18.0%.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["하루"] = {
  "name": "奥村 春",
  "skill1": {
    "name": "マインドエイム",
    "element": "염동광역",
    "type": "광역피해",
    "sp": 26,
    "cool": 0,
    "description": "敵全体に攻撃力75.8%/83.6%/80.5%/88.3%の念動属性ダメージを２回与え、選択した対象に97.6%/97.6%/103.6%/103.6%の確率で『標的層』を１つ付与し、それ以外の敵に53.7%/53.7%/57.0%/57.0%の確率で『標的層』を１つ付与する。その後、敵の『標的層』を自身の『標的層』に変換し、『標的層』は３ターンの間持続する。また自身は『フォーカス弾』を１つ獲得する。\n『フォーカス弾』：遠隔攻撃時、『標的層』を獲得している時、スキルダメージが29.3%/32.3%/31.1%/34.1%上昇し、遠隔攻撃後に自身が獲得している全ての『標的層』を解除する。"
  },
  "skill2": {
    "name": "精密斉射",
    "element": "총격",
    "type": "단일피해",
    "hp": 12,
    "cool": 0,
    "description": "敵単体に攻撃力151.6%/167.1%/160.9%/176.4%の銃撃属性ダメージを与える。自身が『標的層』を獲得している時、このスキルの貫通力が19.5%/19.5%/20.7%/20.7%上昇する。さらに自身は『ペインポイント弾』を１つ獲得する。\n『ペインポイント弾』：遠隔攻撃時、選択した対象に攻撃力39.0%/43.0%/41.4%/45.4%の念動属性ダメージを追加で与え、『フォーカス弾』のスキルダメージ上昇効果を得ることができる。"
  },
  "skill3": {
    "name": "マインドフルリリース",
    "element": "염동광역",
    "type": "광역피해",
    "sp": 26,
    "cool": 0,
    "description": "敵全体に攻撃力142.1%/156.7%/150.8%/165.4%の念動属性ダメージを与え、自身が『標的層』を獲得している時、このスキルのクリティカル率が19.5%/19.5%/20.7%/20.7%上昇する。さらに自身は『スピルオーバー弾』を１つ獲得する。\n『スピルオーバー弾』：遠隔攻撃時、敵全体に攻撃力29.3%/32.3%/31.1%/34.1%の念動属性ダメージを追加で与え、『フォーカス弾』のスキルダメージ上昇効果を得ることができる。"
  },
  "skill_highlight": {
    "element": "염동광역",
    "type": "광역피해",
    "description": "敵全体に攻撃力206.9%/228.1%/219.6%/240.8%の念動属性ダメージを与える。『想いの弾丸』が最大数未満で『オーバーロード弾』も獲得していない場合、『オーバーロード弾』を１つ獲得する。\n『オーバーロード弾』：遠隔攻撃時、クリティカル率が14.6%/14.6%/15.5%/15.5%上昇する。\n『オーバーロード弾』を獲得しなかった場合、このスキルダメージが14.6%/16.1%/15.5%/17.0%上昇する。",
    "cool": 4
  },
  "passive1": {
    "name": "令嬢の采配",
    "element": "패시브",
    "description": "戦闘中、状態異常命中が１.４５%ごとに攻撃力が１%上昇し、最大で攻撃力165.0%まで上昇する。さらに状態異常命中が５０%ごとに、追加でクリティカルダメージが２０%上昇し、最大で3つまで累積する。",
    "cool": 0
  },
  "passive2": {
    "name": "みんなの役に立ちたい",
    "element": "패시브",
    "description": "『想いの弾丸』を１種獲得するごとに、『改善点』を永続的に１つ獲得する。『改善点』の累積数に応じて、以下の効果を獲得する。\n「１：状態異常命中が18.0%上昇し、状態異常抵抗が18.0%上昇する。」\n「２：攻撃力が18.0%上昇し、防御力が18.0%上昇する。」\n「３：クリティカルダメージが18.0%上昇する。」",
    "cool": 0
  }
};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.cnCharacterSkillsData["하루"] = {
  "name": "奥村春",
  "skill1": {
    "name": "聚合瞄准",
    "sp": 26,
    "cool": 0,
    "description": "对所有敌人造成2段68.8%/75.9%/73.0%/80.1%攻击力的念动属性伤害，有97.6%/97.6%/103.6%/103.6%的基础概率为主目标添加『准星』同时有53.7%/53.7%/57.0%/57.0%的基础概率为其他目标添加『准星』，而后将敌人身上的『准星』转化为自身的『准星』，持续3回合；自身获得『热能改装』：使用枪械射击时，若自身拥有『准星』，技能伤害提升29.3%/32.3%/31.1%/34.1%，枪械射击完成后移除自身所有『准星』。",
    "element": "염동광역"
  },
  "skill2": {
    "name": "火力压制",
    "element": "총격",
    "cool": 0,
    "description": "对1名敌人造成151.6%/167.1%/160.9%/176.4%攻击力的射击属性伤害，自身拥有『准星』时穿透提升19.5%/19.5%/20.7%/20.7%；自身获得『卸甲改装』：枪械射击时额外对主目标造成39.0%/43.0%/41.4%/45.4%攻击力的念动属性伤害，可触发『热能改装』的技能伤害提升效果。"
  },
  "skill3": {
    "name": "全金属爆发",
    "sp": 26,
    "cool": 0,
    "description": "对所有敌人造成129.2%/142.5%/137.2%/150.4%攻击力的念动属性伤害，自身拥有『准星』时暴击率提升19.5%/19.5%/20.7%/20.7%；自身获得『扩散改装』：枪械射击时额外对所有敌人造成29.3%/32.3%/31.1%/34.1%攻击力的念动属性伤害，可触发『热能改装』的技能伤害提升效果。",
    "element": "염동광역"
  },
  "passive1": {
    "name": "弹射",
    "element": "패시브",
    "cool": 0,
    "description": "战斗中，每有1.45%的效果命中，获得1%的攻击力加成，最多可获得165.0%的攻击力加成；\n每有50%的效果命中，额外获得1层20%暴击效果提升，最多可获得3层。"
  },
  "passive2": {
    "name": "策动",
    "element": "패시브",
    "cool": 0,
    "description": "每使用1种改装，永久获得1层『枪管加热』；『枪管加热』层数达到指定层数自身可获得属性提升：\n1层：效果命中提升18.0%、效果抵抗提升18.0%；\n2层：攻击力提升18.0%、防御力提升18.0%；\n3层：暴击效果提升18.0%。"
  },
  "skill_highlight": {
    "cool": 4,
    "description": "对所有敌人造成206.9%/228.1%/219.6%/240.8%攻击力的念动属性伤害。若『改装』未满且未获得『超荷改装』,则获得『超荷改装』：枪械射击时暴击率提升14.6%/14.6%/15.5%/15.5%；否则，本次攻击技能伤害提升14.6%/16.1%/15.5%/17.0%。",
    "element": "염동광역"
  }
};
