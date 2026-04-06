window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["아란"] = {
  "name": "히라노 아란",
  "skill1": {
    "name": "금전의 식흔",
    "element": "주원",
    "type": "단일피해",
    "sp": 22,
    "cool": 0,
    "description": "1명의 적에게 공격력 153.7%/169.5%/160.0%/175.8%의 주원 속성 대미지를 준다. 목표에게 『죄』가 있을 경우 『죄업』을 2중첩 부여하고, 목표의 『죄업』 중첩수를 『죄』 상태인 다른 적에게 복제한다. 목표에게 『죄업』이 있을 경우 이번 대미지가 20% 증가한다.\n『죄업』: 방어력이 3.9%/4.3%/4.1%/4.5% 감소하며(자신의 효과 명중의 161.0%/177.5%/167.6%/184.1%만큼 추가 감소, 최대 11.7%/12.9%/12.2%/13.4%), 2턴 동안 지속된다(최대 4중첩)."
  },
  "skill2": {
    "name": "복수의 명경",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 2,
    "description": "2턴 동안 모든 아군의 내성을 '반사'로 변경하고 반사 대미지 비율을 20%에서 100%로 상향한다(자신의 효과 명중의 161.0%/177.5%/167.6%/184.1%만큼 추가 상향, 최대 97.6%/107.6%/101.6%/111.6%). 히라노 아란의 다음 행동 혹은 스킬 대미지를 1회 반사한 후 사라진다. 대미지 반사 시 적에게 『죄』가 있다면 『죄업』을 2중첩 부여한다. 일부 스킬의 부가적인 디버프 효과는 무효화할 수 없다."
  },
  "skill3": {
    "name": "단죄의 눈",
    "element": "디버프",
    "type": "디버프",
    "sp": 0,
    "cool": 0,
    "description": "선택한 적 2명에게 각각 『죄』를 부여한다(동일 목표 중복 선택 가능). 재사용 시 대상을 다시 선택한다. 이 스킬은 턴을 소모하지 않지만 턴당 1회만 사용 가능하다.\n『죄』의 전도 효과가 19.5%/21.5%/20.3%/22.3% 증폭된다(자신의 효과 명중의 161.0%/177.5%/167.6%/184.1%만큼 추가 증폭, 최대 78.1%/86.1%/81.3%/89.3%)."
  },
  "skill_highlight": {
    "element": "주원",
    "type": "단일피해",
    "description": "1명의 적에게 공격력 361.8%/398.9%/376.6%/413.7%의 주원 속성 대미지를 준다. 목표에게 『죄』가 있을 경우 3턴 동안 목표가 받는 HIGHLIGHT 대미지가 14.6%/16.1%/15.2%/16.7% 증가하며, 해당 효과를 『죄』 상태인 다른 적에게 복제한다."
  },
  "passive1": {
    "name": "역날",
    "element": "패시브",
    "description": "히라노 아란이 전장에 있을 때, 모든 아군이 『죄』 상태인 적에게 주는 대미지가 24.0% 증가한다."
  },
  "passive2": {
    "name": "제염",
    "element": "패시브",
    "description": "히라노 아란이 전장에 있을 때, 전장의 『죄』 상태인 적 1명당 모든 아군의 공격력이 18.0% 증가한다."
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
    "name": "HIGHLIGHT"
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

