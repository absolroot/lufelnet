window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["아야카"] = {
  "name": "사카이 아야카",
  "skill1": {
    "name": "열정 소나타",
    "element": "전격광역",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "모든 적에게 공격력 85.4%/94.2%/90.6%/99.4%의 전격 속성 대미지를 주고, 80%의 기본 확률로 메인 목표를 감전 상태에 빠트린다. 『열성 관객』이 있는 경우, 『열성 관객』이 스킬 메인 목표에게 추가로 『열성 관객』 공격력 83.3%/91.8%/88.4%/96.9%의 전격 속성 추가 대미지를 1회 준다."
  },
  "skill2": {
    "name": "즉흥 독주",
    "element": "버프",
    "type": "버프",
    "sp": 20,
    "cool": 0,
    "description": "1명의 동료를 선택하여 『열성 관객』으로 만들면 『열성 관객』의 공격력이 사카이 아야카 공격력의 24%만큼 증가하며 3턴 동안 지속된다(최대 1220/1345/1295/1420). 『열성 관객』은 동시에 1명만 보유할 수 있다."
  },
  "skill3": {
    "name": "피날레: 음역 가동",
    "element": "버프",
    "type": "버프",
    "sp": 25,
    "cool": 1,
    "description": "동료 1명을 선택하고 즉시 HIGHLIGHT 스킬을 시전한다. 동시에 이번 HIGHLIGHT의 대미지가 78.1%/86.1%/82.9%/90.9% 증가한다. 해당 스킬을 통해 사용한 HIGHLIGHT는 캐릭터 본인의 HIGHLIGHT 쿨타임 시간에 포함하지 않는다. 목표가 S.E.E.S. 멤버인 경우, 다음 테우르기아의 최종 대미지 19.5%/19.5%/20.7%/20.7% 증폭으로 변경된다."
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "버프",
    "description": "괴도 행동 4회 동안 모든 동료가 45.5%/50.1%/48.3%/52.9%의 대미지 보너스를 받는다. 기간 동안 아군 괴도는 행동 후 HIGHLIGHT 에너지를 10% 획득하며, 최대 40% 회복한다.",
    "cool": 4
  },
  "passive1": {
    "name": "악센트",
    "element": "패시브",
    "description": "아군 괴도가 HIGHLIGHT/테우르기아 사용 시, 1턴 동안 해당 괴도의 공격력이 즉시 24.0% 증가한다. 해당 괴도가 열성 관객이라면 효과가 1.5배로 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "스트로크",
    "element": "패시브",
    "description": "아군 괴도가 HIGHLIGHT/테우르기아를 사용한 후, 사카이 아야카는 생명 비율이 가장 낮은 동료에게 즉시 사카이 공격력 15.0%+1350의 생명을 회복시킨다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["아야카"] = {
  "name": "Ayaka Sakai",
  "skill1": {
    "name": "Distortion",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Electric damage to all foes equal to 85.4%/94.2%/90.6%/99.4% of Attack. 80% chance to inflict Shock on the main target for 2 turns.\nIf an ally has Costar, deal bonus Electric damage to the main target equal to 83.3%/91.8%/88.4%/96.9% of that ally's Attack (1 hit)."
  },
  "skill2": {
    "name": "Unison Notes",
    "element": "버프",
    "type": "버프",
    "sp": 20,
    "cool": 0,
    "description": "Grant Costar to 1 ally, and increase their Attack by 24% of Ayaka's Attack (up to 1220/1345/1295/1420) for 3 turns.\nOnly 1 ally can be a Costar at a time."
  },
  "skill3": {
    "name": "Catchy Hook",
    "element": "버프",
    "type": "버프",
    "sp": 25,
    "cool": 1,
    "description": "Immediately activate the selected ally's Highlight and increase its damage by 78.1%/86.1%/82.9%/90.9%.\nThis skill does not affect the target's Highlight cooldown time, even if it activates a Highlight."
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "버프",
    "description": "For 4 ally actions, increase the party's damage by 45.5%/50.1%/48.3%/52.9%.\nWhile active, fill the Highlight gauge by 10% after an ally acts (up to 40%).",
    "cool": 4
  },
  "passive1": {
    "name": "Backing Track",
    "element": "패시브",
    "description": "When an ally uses a Highlight, increase target's Attack by 24.0% for 1 turn.\nWhen the target has Costar, increase effect by 1.5 times.",
    "cool": 0
  },
  "passive2": {
    "name": "Chorus Effect",
    "element": "패시브",
    "description": "After an ally uses a Highlight, the ally with the lowest HP recovers HP equal to 15.0% of Ayaka's Attack + 1350.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["아야카"] = {
  "name": "坂井 綾香",
  "skill1": {
    "name": "ディストーション",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "敵全体に攻撃力85.4%/94.2%/90.6%/99.4%の電撃属性ダメージを与え、８０％の確率で２ターンの間、選択した対象を感電状態にする。\n『共演』状態の味方がいる時、選択した敵に対して、その味方の攻撃力83.3%/91.8%/88.4%/96.9%の電撃属性ダメージを追加で１回与える。"
  },
  "skill2": {
    "name": "ユニゾンノーツ",
    "element": "버프",
    "type": "버프",
    "sp": 20,
    "cool": 0,
    "description": "３ターンの間、味方単体を\n『共演』状態にし、対象の攻撃力を綾香の攻撃力２４%分（最大1220/1345/1295/1420まで）上昇させる。\n複数の味方を同時に『共演』状態にすることはできない。"
  },
  "skill3": {
    "name": "エキサイトフレーズ",
    "element": "버프",
    "type": "버프",
    "sp": 25,
    "cool": 1,
    "description": "選択した味方のハイライトを即座に発動させ、その与ダメージを78.1%/86.1%/82.9%/90.9%上昇させる。\nこのスキルによってハイライトを発動しても、対象のハイライト発動クールタイムには影響しない。"
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "버프",
    "description": "味方が４回行動する間、味方全体の与ダメージを45.5%/50.1%/48.3%/52.9%上昇させる。\nこの効果が持続中、味方が行動した後にハイライトゲージが１０%増加する（最大４０%まで）。",
    "cool": 4
  },
  "passive1": {
    "name": "バッキング",
    "element": "패시브",
    "description": "味方がハイライトを使用する時、１ターンの間、対象の攻撃力を24.0%上昇させる。\nこの効果は、対象が『共演』状態の時、１.５倍になる。",
    "cool": 0
  },
  "passive2": {
    "name": "コーラスエフェクト",
    "element": "패시브",
    "description": "味方がハイライトを使用した時、残りＨＰ割合が最も低い味方のＨＰを綾香の攻撃力15.0%＋1350分回復する。",
    "cool": 0
  }
};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.cnCharacterSkillsData["아야카"] = {
  "name": "坂井绫香",
  "skill1": {
    "name": "激情鸣奏",
    "element": "전격",
    "sp": 20,
    "cool": 0,
    "description": "对所有敌人造成85.4%/94.2%/90.6%/99.4%攻击力的电击属性伤害，有80%的基础概率使主目标陷入触电状态。若存在『忠实听众』，则『忠实听众』对技能主目标额外造成1次基于『忠实听众』83.3%/91.8%/88.4%/96.9%攻击力的电击属性附加伤害。"
  },
  "skill2": {
    "name": "即兴独奏",
    "element": "버프",
    "sp": 20,
    "cool": 0,
    "description": "选择1名同伴成为『忠实听众』，『忠实听众』的攻击力提升相当于坂井绫香攻击力的24%，上限1220/1345/1295/1420，持续3回合。同时只能拥有1个『忠实听众』。"
  },
  "skill3": {
    "name": "终曲：音域全开",
    "element": "버프",
    "sp": 25,
    "cool": 1,
    "description": "选择1名同伴，立刻释放其HIGHLIGHT技能，同时提升78.1%/86.1%/82.9%/90.9%本次HIGHLIGHT的伤害。通过该技能使用的HIGHLIGHT不会计入角色的HIGHLIGHT冷却时间。若目标为S.E.E.S.成员，则改为使其下一次神通法获得19.5%/19.5%/20.7%/20.7%最终伤害增幅。"
  },
  "passive1": {
    "name": "重音",
    "element": "패시브",
    "cool": 0,
    "description": "友方怪盗使用HIGHLIGHT/神通法时，立刻提升其24.0%攻击力，持续1回合；如果此人是忠实听众则效果提升为1.5倍。"
  },
  "passive2": {
    "name": "扫弦",
    "element": "패시브",
    "cool": 0,
    "description": "友方怪盗使用HIGHLIGHT/神通法后，坂井绫香立刻对生命值百分比最低的同伴恢复相当于坂井15.0%攻击力+1350的生命值。"
  },
  "skill_highlight": {
    "element": "버프",
    "cool": 4,
    "description": "所有同伴获得45.5%/50.1%/48.3%/52.9%伤害加成，持续4个怪盗行动。期间我方怪盗行动后回复10%HIGHLIGHT能量，最多回复40%。"
  }
};
