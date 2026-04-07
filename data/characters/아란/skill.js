window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["아란"] = {
  "name": "히라노 아란",
  "skill1": {
    "name": "금단의 부식",
    "element": "주원",
    "type": "단일피해",
    "sp": 22,
    "cool": 0,
    "description": "1명의 적에게 153.7%/169.5%/160.0%/175.8%의 주원 속성 대미지를 준다.\n적이 『죄』를 보유한 경우 『죄업』을 2중첩 추가하고, 적에게 있는 『죄업』 중첩 수를 『죄』를 보유한 다른 적에게 복제한다.\n적이 『죄업』을 보유한 경우 이번 대미지를 20% 증가시킨다.\n『죄업』: 2턴 동안 방어력이 3.9%/4.3%/4.1%/4.5% 감소한다(또한 방어력 추가 감소 효과가 히라노 아란의 효과 명중을 기반으로 하며, 최대 161.0%/177.5%/167.6%/184.1% 효과 명중까지 계산되고, 방어력은 최대 11.7%/12.9%/12.2%/13.4%까지 감소). 최대 4회 중첩까지 중첩된다."
  },
  "skill2": {
    "name": "복수의 거울",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 2,
    "description": "아군 전체의 모든 적합성을 ‘반’으로 변경하고 2턴 동안 반사 비율이 20%에서 100%까지 증가한다(아란의 효과 명중은 반사 비율을 증가시키며, 최대 161.0%/177.5%/167.6%/184.1% 효과 명중까지 계산되고, 반사 비율은 최대 97.6%/107.6%/101.6%/111.6%까지 추가로 증가한다). 히라노 아란의 다음 행동 또는 스킬의 전체 대미지를 1회 반사한 뒤 사라진다.\n대미지 반사 시 적이 『죄』를 보유한 경우, 적에게 『죄업』을 2중첩 부여한다.\n해당 반사 효과는 일부 대미지에 포함된 디버프 효과를 무효화할 수 없다."
  },
  "skill3": {
    "name": "단죄의 눈동자 ",
    "element": "디버프",
    "type": "디버프",
    "sp": 0,
    "cool": 0,
    "description": "아란이 적 목표를 2명 선택하고 각각 『죄』를 추가한다. 같은 목표를 중복으로 선택할 수 있다.\n다시 시전: 『죄』의 대상을 다시 선택한다.\n해당 스킬은 턴을 소모하지 않으며, 턴마다 1회만 시전할 수 있다.\n『죄』의 전도 효과가 19.5%/21.5%/20.3%/22.3% 증폭을 획득한다(추가 전도 효과 증폭은 히라노 아란의 효과 명중을 기반으로 하며, 최대 161.0%/177.5%/167.6%/184.1% 효과 명중까지 계산되고, 전도 효과 증폭이 최대 78.1%/86.1%/81.3%/89.3%까지 증가)."
  },
  "skill_highlight": {
    "element": "주원",
    "type": "단일피해",
    "description": "1명의 적에게 361.8%/398.9%/376.6%/413.7%의 주원 속성 대미지를 준다.\n만약 적이 『죄』를 보유한 경우, 3턴 동안 해당 적이 받는 HIGHLIGHT 대미지가 14.6%/16.1%/15.2%/16.7% 증가한다. 또한 해당 효과를 『죄』를 보유한 다른 적에게 복제한다.",
    "cool": 4
  },
  "passive1": {
    "name": "역날",
    "element": "패시브",
    "description": "히라노 아란이 필드에 있을 때, 전체 아군이 『죄』를 보유한 적에게 주는 대미지가 24.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "제사의 불꽃",
    "element": "패시브",
    "description": "히라노 아란이 필드에 있을 때, 필드에 『죄』를 보유한 적이 1명 존재할 때마다 아군 전체가 18.0%의 공격력 보너스를 획득한다.",
    "cool": 0
  }
};

window.enCharacterSkillsData["아란"] = {
  "name": "Aran Hirano",
  "skill1": {
    "name": "Forbidden Etching",
    "element": "주원",
    "type": "단일피해",
    "description": "Deal Curse damage to 1 foe equal to 153.7%/169.5%/160.0%/175.8% of Attack.\nIf the target has [Sin], inflict 2 [Bad Karma] stacks, then copy target's [Bad Karma] stacks to other foes with [Sin]. \nIf the target has [Bad Karma], increase this damage by 20%. \n[Bad Karma]: Decrease Defense by 3.9%/4.3%/4.1%/4.5% for 2 turns (based on Aran's ailment accuracy, up to 11.7%/12.9%/12.2%/13.4% bonus Defense Down at 161.0%/177.5%/167.6%/184.1% ailment accuracy). Stacks up to 4 times."
  },
  "skill2": {
    "name": "Mirror of Vengeance",
    "element": "버프",
    "type": "버프",
    "description": "Change all allies' affinities to Repel and increase Repel ratio from 20% to 100% for 2 turns (based on Aran's ailment accuracy, up to 97.6%/107.6%/101.6%/111.6% bonus Repel ratio at 161.0%/177.5%/167.6%/184.1% ailment accuracy). Lose this effect at the start of Aran's next turn or after repelling 1 skill damage. \nWhen repelling damage, if foes have [Sin], inflict 2 [Bad Karma] stacks. This Repel effect does not nullify certain debuff effects from certain damage."
  },
  "skill3": {
    "name": "Eye of Condemnation",
    "element": "디버프",
    "type": "디버프",
    "description": "Select 2 foes and inflict [Sin] on them (can select the same target). \nReactivate: Change [Sin]'s targets.\nAfter using this skill, Aran can use other skills.\nIncrease [Sin]'s Transfer Effect Amplification by 19.5%/21.5%/20.3%/22.3% (based on Aran's ailment accuracy, up to 78.1%/86.1%/81.3%/89.3% bonus Transfer Effect Amplification at 161.0%/177.5%/167.6%/184.1% ailment accuracy)."
  },
  "skill_highlight": {
    "element": "주원",
    "type": "단일피해",
    "description": "Deal Curse damage to 1 foe equal to 361.8%/398.9%/376.6%/413.7% of Attack.\nIf foes have [Sin], increase their HIGHLIGHT damage taken by 14.6%/16.1%/15.2%/16.7%. Lasts for 3 turns. Copy this effect to other foes with [Sin]."
  },
  "passive1": {
    "name": "Reverse Blade",
    "element": "패시브",
    "description": "When Aran is on the field, increase all allies' damage dealt to foes with [Sin] by 24.0%."
  },
  "passive2": {
    "name": "Ritual Fire",
    "element": "패시브",
    "description": "When Aran is on the field, for each foe with [Sin], increase all allies' ATK by 18.0%."
  }
};

window.jpCharacterSkillsData["아란"] = {
  "name": "平野亜蘭",
  "skill1": {
    "name": "禁典の蝕痕",
    "element": "주원",
    "type": "단일피해",
    "description": "敵単体に攻撃力153.7%/169.5%/160.0%/175.8%の呪怨属性ダメージを与える。対象が『罪』状態の場合、『罪業』を2つ付与し、対象の『罪業』スタック数を『罪』状態の他の敵にコピーする。対象に『罪業』がある場合、今回のダメージが20%上昇する。\n『罪業』：防御力が3.9%/4.3%/4.1%/4.5%低下（自身の状態異常命中の161.0%/177.5%/167.6%/184.1%分、最大11.7%/12.9%/12.2%/13.4%まで追加低下）し、2ターン持続する（最大4スタック）。"
  },
  "skill2": {
    "name": "復讐の冥鏡",
    "element": "버프",
    "type": "버프",
    "description": "2ターンの間、味方全体の全耐性を「反射」に変更し、反射ダメージ倍率を20%から100%（自身の状態異常命中の161.0%/177.5%/167.6%/184.1%分、最大97.6%/107.6%/101.6%/111.6%まで追加上昇）に引き上げる。平野亜蘭の次の行動後、またはスキルダメージを1回反射した後に消失する。反射時に攻撃者が『罪』状態であれば、『罪業』を2つ付与する。一部のスキルに付随する弱体効果は無効化できない."
  },
  "skill3": {
    "name": "断罪の瞳",
    "element": "디버프",
    "type": "디버프",
    "description": "敵2体を選択し、それぞれに『罪』を付与する（同一目標を重複選択可能）。再発動時、対象を再選択する。このスキルはターンを消費しないが、1ターンに1回のみ発動可能。\n『罪』の伝導効果が19.5%/21.5%/20.3%/22.3%増幅（自身の状態異常命中の161.0%/177.5%/167.6%/184.1%分、最大78.1%/86.1%/81.3%/89.3%まで追加増幅）される."
  },
  "skill_highlight": {
    "element": "주원",
    "type": "단일피해",
    "description": "敵単体に攻撃力361.8%/398.9%/376.6%/413.7%の呪怨属性ダメージを与える。対象が『罪』状態の場合、3ターンの間、対象の被HIGHLIGHTダメージを14.6%/16.1%/15.2%/16.7%上昇させ、その効果を『罪』状態の他の敵にコピーする."
  },
  "passive1": {
    "name": "逆刃",
    "element": "패시브",
    "description": "平野亜蘭が戦場にいる時、味方全体が『罪』状態の敵に与えるダメージ가 24.0%上昇する。"
  },
  "passive2": {
    "name": "祭炎",
    "element": "패시브",
    "description": "平野亜蘭が戦場にいる時、戦場に『罪』状態の敵が1体存在するごとに、味方全体の攻撃力が18.0%上昇する。"
  }
};

window.cnCharacterSkillsData["아란"] = {
  "name": "平野亚兰",
  "skill1": {
    "name": "禁典蚀痕",
    "element": "주원",
    "type": "单体伤害",
    "sp": 22,
    "cool": 0,
    "description": "对1名敌人造成153.7%/169.5%/160.0%/175.8%诅咒属性伤害。\n如果敌人带有『罪』则将施加2层『罪业』，并将敌人身上的『罪业』层数复制给其他带有『罪』的敌人。\n敌人身上带有『罪业』时本次伤害提高20%。\n『罪业』：防御降低3.9%/4.3%/4.1%/4.5%（且防御力额外降低效果将基于平野亚兰的效果命中，最多计入161.0%/177.5%/167.6%/184.1%效果命中，使防御力最多额外降低11.7%/12.9%/12.2%/13.4%），持续2回合，最多叠加至4层。"
  },
  "skill2": {
    "name": "复仇冥镜",
    "element": "버프",
    "type": "增益",
    "sp": 24,
    "cool": 2,
    "description": "使所有我方全适应性变成“反”并使反伤比例由20%提升至100%（且亚兰的效果命中还会使反伤比例提升,最多计入161.0%/177.5%/167.6%/184.1%效果命中使反伤比例最多额外提升97.6%/107.6%/101.6%/111.6%），持续2回合，平野亚兰下次行动或反弹1次技能的全部伤害后消失。\n反弹伤害时若敌方带有『罪』，还会为敌方施加2层『罪业』。\n该反弹效果对于部分伤害无法无效化其附带的负面效果。"
  },
  "skill3": {
    "name": "断罪之瞳",
    "element": "디버프",
    "type": "减益",
    "sp": 0,
    "cool": 0,
    "description": "亚兰选择2个敌方目标，分别为其施加『罪』，可重复选择同一目标。\n再次施放：重新选择『罪』的对象。\n该技能不占用回合，但每回合仅能施放1次。\n『罪』的传导效果获得19.5%/21.5%/20.3%/22.3%增幅（且额外传导效果增幅将基于平野亚兰的效果命中，最多计入161.0%/177.5%/167.6%/184.1%效果命中，使传导效果增幅最多额外提升78.1%/86.1%/81.3%/89.3%）。"
  },
  "skill_highlight": {
    "element": "주원",
    "type": "单体伤害",
    "description": "对1名敌人造成361.8%/398.9%/376.6%/413.7%诅咒属性伤害。\n如果敌人身上带有『罪』则使其受HIGHLIGHT的伤害提升14.6%/16.1%/15.2%/16.7%，持续3回合，并将该效果复制给其他带有『罪』的敌人。",
    "name": "HIGHLIGHT",
    "cool": 4
  },
  "passive1": {
    "name": "逆刃",
    "element": "패시브",
    "description": "平野亚兰在场时，我方全体对带有『罪』的敌人造成伤害提升24.0%。"
  },
  "passive2": {
    "name": "祭炎",
    "element": "패시브",
    "description": "平野亚兰在场时，场上每存在1个带有『罪』的敌人，我方全队就获得18.0%攻击力加成。"
  }
};

