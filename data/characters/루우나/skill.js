window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["루우나"] = {
  "name": "도겐자카 루우나",
  "skill1": {
    "name": "뜨거운 악수",
    "element": "화염광역",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "모든 적에게 공격력 73.2%/80.7%/77.7%/85.2%의 화염 속성 대미지를 준다. 목표의 방어력이 감소하고(자신의 효과 명중의 15.4%만큼, 상한 26.4%/29.1%/28.0%/30.7%) 화염 속성 스킬을 받을 시 방어력이 추가로 26.4%/26.4%/28.0%/28.0% 감소하며 2턴 동안 지속된다. 또한 50%의 기본 확률로 목표를 화상 상태에 빠뜨린다. 자신이 『열렬한 환영』을 획득한다(방어력 감소 효과와 『악당에 대한 경고』는 중첩 불가)."
  },
  "skill2": {
    "name": "악당에 대한 경고",
    "element": "화염",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "1명의 적에게 공격력 170.8%/188.3%/181.3%/198.8%의 화염 속성 대미지를 주고, 2턴 동안 목표의 방어력이 14.6%/14.6%/15.5%/15.5%+(자신의 효과 명중의 31.4%, 상한 53.7%/59.2%/57.0%/62.5%) 감소한다. 자신이 『집요한 추격』을 획득한다(방어력 감소 효과와 『뜨거운 악수』는 중첩 불가)."
  },
  "skill3": {
    "name": "GOGO 멍멍!",
    "element": "화염광역",
    "type": "디버프",
    "sp": 26,
    "cool": 0,
    "description": "해제 조건: 자신이 『열렬한 환영』 또는 『집요한 추격』 보유 시 해제.\n자신이 『열렬한 환영』 또는 『집요한 추격』을 보유하고 있는지에 따라 해당 스킬은 각각 다른 효과가 발동되며, 동시에 하나의 효과만 발동할 수 있다.\n『열렬한 환영』: 모든 적에게 공격력 109.8%/109.8%/116.6%/116.6%의 화염 속성 대미지를 주고, 2턴 동안 목표가 받는 대미지가 증가하며(자신의 효과 명중의 24%만큼, 상한 41.0%/45.2%/43.5%/47.7%), 받는 화염 속성 대미지가 20.5%/22.6%/21.8%/23.9% 증가한다.\n『집요한 추격』: 1명의 적에게 공격력 219.6%/219.6%/233.1%/233.1%의 화염 속성 대미지를 주고, 2턴 동안 목표가 받는 대미지가 증가하며(자신의 효과 명중의 34.3%만큼, 상한 58.6%/64.6%/62.2%/68.2%), 받는 추가 효과 대미지가 29.3%/32.3%/31.1%/34.1% 증가한다."
  },
  "skill_highlight": {
    "element": "화염광역",
    "type": "디버프",
    "description": "모든 적에게 공격력 214.7%/236.7%/227.9%/249.9%의 화염 속성 대미지를 주고, 적 진영이 『대악당』 2중첩을 획득한다. 『대악당』: 적 진영의 임의의 목표가 추격 스킬 또는 화염 속성 스킬을 받으면 1중첩이 소모되며, 2턴 동안 대미지가 증가한다(자신의 효과 명중의 22.9%만큼, 상한 39.0%/43.0%/41.4%/45.4%).",
    "cool": 4
  },
  "passive1": {
    "name": "충실",
    "element": "패시브",
    "description": "전투 중 자신의 효과 명중 60.0%에 해당하는 공격력 보너스를 획득한다.",
    "cool": 0
  },
  "passive2": {
    "name": "열정",
    "element": "패시브",
    "description": "스킬을 사용해 적에게 디버프 효과를 추가한 후 자신의 공격력이 33.0% 증가한다. 동료가 화염 속성 대미지 또는 추가 효과 대미지를 줄 때 동일한 공격력 증가 효과를 획득하며 1턴 동안 지속된다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["루우나"] = {
  "skill1": {
    "name": "Welcome Hug",
    "element": "화염광역",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "Deal Fire damage to all foes equal to 73.2%/80.7%/77.7%/85.2% of Attack.\nDecrease target's Defense by 15.4% of Runa's ailment accuracy for 2 turns (up to 26.4%/29.1%/28.0%/30.7%). Also, when the target of this effect takes Fire, Ice, Electric, or Wind skill damage, decrease Defense by 26.4%/26.4%/28.0%/28.0% more. The Defense decrease effects from this skill and Furrious Bark do not stack.\nAlso, 50% chance to inflict Burn on the target, and gain Big Welcome for 2 turns."
  },
  "skill2": {
    "name": "Furrious Bark",
    "element": "화염",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "Deal Fire damage to 1 foe equal to 170.8%/188.3%/181.3%/198.8% of Attack.\nDecrease target's Defense by 14.6%/14.6%/15.5%/15.5% + 31.4% of Runa's ailment accuracy (up to 53.7%/59.2%/57.0%/62.5%) for 2 turns. The Defense decrease effects from this skill and Welcome Hug do not stack.\nAlso, gain Furrocious Follow-Up for 2 turns."
  },
  "skill3": {
    "name": "Woof Woof Blaze",
    "element": "화염광역",
    "type": "디버프",
    "sp": 26,
    "cool": 0,
    "description": "Usable when Big Welcome or Furrocious Follow-Up are active, and activates various effects based on which is active. If both effects are active at the same time, prioritize Big Welcome.\nRemove Big Welcome and Furrocious Follow-Up after effect activates.\nBig Welcome: Deal Fire damage to all foes equal to 109.8%/109.8%/116.6%/116.6% of Attack. This skill's damage is counted as a Resonance.\nIncrease target's damage taken by 24% of Runa's ailment accuracy (up to 41.0%/45.2%/43.5%/47.7%), and Fire, Ice, Electric and Wind damage taken by 20.5%/22.6%/21.8%/23.9% for 2 turns.\nFurrocious Follow-Up: Deal Fire damage to 1 foe equal to 219.6%/219.6%/233.1%/233.1% of Attack. This skill's damage is counted as a Resonance.\nIncrease target's damage taken by 34.3% of Runa's ailment accuracy (up to 58.6%/64.6%/62.2%/68.2%), and Resonance damage taken by 39.0%/43.0%/41.4%/45.4% for 2 turns."
  },
  "passive1": {
    "name": "Peppy Guard Dog",
    "element": "패시브",
    "cool": 0,
    "description": "During battle, increase Runa's Attack by 60.0% of her ailment accuracy."
  },
  "passive2": {
    "name": "Faithful Dog",
    "element": "패시브",
    "cool": 0,
    "description": "When Runa inflicts a debuff on a foe with a skill, increase her Attack by 33.0% for 1 turn. When an ally deals Fire, Ice, Electric or Wind damage or Resonance damage, grant them the same Attack increase effect."
  },
  "skill_highlight": {
    "element": "화염광역",
    "type": "디버프",
    "cool": 4,
    "description": "Deal Fire damage to all foes equal to 214.7%/236.7%/227.9%/249.9% of Attack.\nPermanently inflict 2 Enthusiastic Fuse stacks on foes. Stacks up to 2 times (remove as wave progresses).\nEnthusiastic Fuse: When any foe takes Fire, Ice, Electric, or Wind skill damage or Resonance damage, spend 1 Enthusiastic Fuse stack, and increase the damage by 22.9% of Runa's ailment accuracy (up to 53.7%/59.2%/57.0%/62.5%). If Runa's skills and Resonance activate this effect, Enthusiastic Fuse will not be spent."
  },
  "name": "Runa Dogenzaka"
};
window.jpCharacterSkillsData["루우나"] = {
  "skill1": {
    "name": "ウェルカム・ハグ",
    "element": "화염광역",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "敵全体に攻撃力73.2%/80.7%/77.7%/85.2%の火炎属性ダメージを与える。\n２ターンの間、対象の防御力が自身の状態異常命中の１５.４%分（最大26.4%/29.1%/28.0%/30.7%まで）低下し、さらにこの効果中の対象が火炎／氷結／電撃／疾風属性のスキルダメージを受ける時、追加で防御力が26.4%/26.4%/28.0%/28.0%低下する。このスキルと『フュリオス・バーク』の防御力低下効果は重複しない。\nまた、対象を５０%の確率で炎上状態にし、自身は２ターンの間『大歓迎』状態になる。"
  },
  "skill2": {
    "name": "フュリオス・バーク",
    "element": "화염",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "敵単体に攻撃力170.8%/188.3%/181.3%/198.8%の火炎属性ダメージを与える。\n２ターンの間、対象の防御力が14.6%/14.6%/15.5%/15.5%＋自身の状態異常命中の３１.４%分（最大53.7%/59.2%/57.0%/62.5%まで）低下する。このスキルと『ウェルカム・ハグ』の防御力低下効果は重複しない。\nさらに自身は２ターンの間、『猛追撃』状態になる。"
  },
  "skill3": {
    "name": "わんダフル・ブレイズ",
    "element": "화염광역",
    "type": "디버프",
    "sp": 26,
    "cool": 0,
    "description": "『大歓迎』または『猛追撃』状態の時に使用可能となり、それぞれの状態に応じたスキルの効果が発動する。２つの効果は同時に発動せず、『大歓迎』状態の効果が優先して発動する。\n『大歓迎』『猛追撃』状態は効果発動後に解除される。\n『大歓迎』状態：敵全体に攻撃力109.8%/109.8%/116.6%/116.6%の火炎属性ダメージを与える。このスキルのダメージは意識奏功として扱う。\n２ターンの間、対象の被ダメージが自身の状態異常命中の２４%分（最大41.0%/45.2%/43.5%/47.7%まで）上昇し、対象の火炎／氷結／電撃／疾風属性の被ダメージが20.5%/22.6%/21.8%/23.9%上昇する。\n『猛追撃』状態：敵単体に攻撃力219.6%/219.6%/233.1%/233.1%の火炎属性ダメージを与える。このスキルのダメージは意識奏功として扱う。\n２ターンの間、対象の被ダメージが自身の状態異常命中の３４.３%分（最大58.6%/64.6%/62.2%/68.2%まで）上昇し、対象の意識奏功の被ダメージが39.0%/43.0%/41.4%/45.4%上昇する。"
  },
  "passive1": {
    "name": "熱意の番犬",
    "element": "패시브",
    "cool": 0,
    "description": "戦闘中、自身の攻撃力が自身の状態異常命中の60.0%分上昇する。"
  },
  "passive2": {
    "name": "情熱の忠犬",
    "element": "패시브",
    "cool": 0,
    "description": "自身がスキルで敵に弱体効果を付与した時、１ターンの間、自身の攻撃力が33.0%上昇する。味方が火炎／氷結／電撃／疾風属性または意識奏功でダメージを与えた時も同じ攻撃力上昇効果を得る。"
  },
  "skill_highlight": {
    "element": "화염광역",
    "type": "디버프",
    "cool": 4,
    "description": "敵全体に攻撃力214.7%/236.7%/227.9%/249.9%の火炎属性ダメージを与える。\n敵陣営に対して『激情の導火線』を永続的に２つ付与し、最大２つまで累積できる（Ｗａｖｅ進行時に解除される）。\n『激情の導火線』：いずれかの敵が火炎／氷結／電撃／疾風属性のスキルまたは意識奏功のダメージを受ける時、『激情の導火線』を１つ消費し、そのダメージを琉七の状態異常命中の２２.９%分（最大53.7%/59.2%/57.0%/62.5%まで）上昇させる。琉七のスキル／意識奏功でこの効果を発動させる場合は『激情の導火線』を消費しない。"
  },
  "name": "道玄坂 琉七"
};
