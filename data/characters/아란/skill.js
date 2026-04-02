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
    "name": "Forbidden Scars",
    "element": "주원",
    "type": "단일피해",
    "description": "Deal Curse damage to 1 foe equal to 153.7%/169.5%/160.0%/175.8% of Attack. If the target has [Sin], inflict 2 [Guilt] stacks and copy the target's [Guilt] stacks to other foes with [Sin]. If the target already has [Guilt], increase this skill's damage by 20%.\n[Guilt]: Decrease Defense by 3.9%/4.3%/4.1%/4.5% + 161.0%/177.5%/167.6%/184.1% of Aran's ailment accuracy (up to 11.7%/12.9%/12.2%/13.4%) for 2 turns. Stacks up to 4 times."
  },
  "skill2": {
    "name": "Mirror of Vengeance",
    "element": "버프",
    "type": "버프",
    "description": "Change all allies' affinities to 'Reflect' and increase reflection ratio from 20% to 100% + 161.0%/177.5%/167.6%/184.1% of Aran's ailment accuracy (up to 97.6%/107.6%/101.6%/111.6%) for 2 turns. Disappears after Alan's next action or reflecting skill damage once. If the attacker has [Sin] when reflecting, inflict 2 [Guilt] stacks. This effect cannot nullify certain secondary debuff effects."
  },
  "skill3": {
    "name": "Eyes of Judgment",
    "element": "디버프",
    "type": "디버프",
    "description": "Select 2 enemy targets and inflict [Sin] on each (can select the same target twice). Re-casting allows re-selecting targets. This skill does not consume a turn but can only be used once per turn.\nIncrease [Sin]'s conduction effect by 19.5%/21.5%/20.3%/22.3% + 161.0%/177.5%/167.6%/184.1% of Alan's ailment accuracy (up to 78.1%/86.1%/81.3%/89.3%)."
  },
  "skill_highlight": {
    "element": "주원",
    "type": "단일피해",
    "description": "Deal Curse damage to 1 foe equal to 361.8%/398.9%/376.6%/413.7% of Attack. If the target has [Sin], increase HIGHLIGHT damage taken by 14.6%/16.1%/15.2%/16.7% for 3 turns, and copy this effect to other foes with [Sin]."
  },
  "passive1": { "name": "Reverse Blade", "element": "패시브", "description": "While Alan is on the field, increase damage dealt by all allies to foes with [Sin] by 24.0%." },
  "passive2": { "name": "Sacrificial Flame", "element": "패시브", "description": "While Alan is on the field, for each foe with [Sin], increase all allies' Attack by 18.0%." }
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
  "passive1": { "name": "逆刃", "element": "패시브", "description": "平野亜蘭が戦場にいる時、味方全体が『罪』状態の敵に与えるダメージ가 24.0%上昇する。" },
  "passive2": { "name": "祭炎", "element": "패시브", "description": "平野亜蘭が戦場にいる時、戦場に『罪』状態の敵が1体存在するごとに、味方全体の攻撃力が18.0%上昇する。" }
};