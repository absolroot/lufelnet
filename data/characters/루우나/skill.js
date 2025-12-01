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
    "description": "모든 적에게 공격력 73.2%/80.7%/77.7%/85.2%의 화염 속성 대미지를 준다. 목표의 방어력이 감소하고(자신의 효과 명중의 15.4%만큼, 상한 26.4%/29.2%/27.9%/30.7%) 화염 속성 스킬을 받을 시 방어력이 추가로 26.4%/26.4%/28.0%/28.0% 감소하며 2턴 동안 지속된다. 또한 50%의 기본 확률로 목표를 화상 상태에 빠뜨린다. 자신이 『열렬한 환영』을 획득한다(방어력 감소 효과는 『악당에 대한 경고』가 동시에 존재시 가장 높은 수치가 적용됨)."
  },
  "skill2": {
    "name": "악당에 대한 경고",
    "element": "화염",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "1명의 적에게 공격력 170.8%/188.3%/181.3%/198.8%의 화염 속성 대미지를 주고, 2턴 동안 목표의 방어력이 14.6%/14.6%/15.5%/15.5%+(자신의 효과 명중의 31.4%, 상한 53.7%/59.3%/56.9%/62.5%) 감소한다. 자신이 『집요한 추격』을 획득한다(방어력 감소 효과는 『뜨거운 악수』가 동시에 존재시 가장 높은 수치가 적용됨)."
  },
  "skill3": {
    "name": "GOGO 멍멍!",
    "element": "화염광역",
    "type": "디버프",
    "sp": 24,
    "cool": 0,
    "description": "자신이 『열렬한 환영』 또는 『집요한 추격』을 보유하고 있는지에 따라 해당 스킬은 각각 다른 효과가 발동되며, 동시에 하나의 효과만 발동할 수 있다.\n『열렬한 환영』: 모든 적에게 공격력 109.8%/109.8%/116.6%/116.6%의 화염 속성 대미지를 주고, 2턴 동안 목표가 받는 대미지가 증가하며(자신의 효과 명중의 24%만큼, 상한 41.0%/45.2%/43.5%/47.7%), 받는 화염 속성 대미지가 20.5%/22.7%/21.7%/23.9% 증가한다.\n『집요한 추격』: 1명의 적에게 공격력 219.6%/219.6%/233.1%/233.1%의 화염 속성 대미지를 주고, 2턴 동안 목표가 받는 대미지가 증가하며(자신의 효과 명중의 34.3%만큼, 상한 58.6%/64.7%/62.1%/68.2%), 받는 추가 효과 대미지가 29.3%/31.6%/31.8%/34.1% 증가한다."
  },
  "skill_highlight": {
    "element": "화염광역",
    "type": "디버프",
    "description": "모든 적에게 공격력 214.7%/236.7%/227.9%/249.9%의 화염 속성 대미지를 주고, 적 진영이 『대악당』 2중첩을 획득한다.\n『대악당』: 적 진영의 임의의 목표가 추격(추가 효과) 스킬 또는 화염 속성 스킬을 받으면 1중첩이 소모되며, 2턴 동안 받는 대미지가 증가한다(자신의 효과 명중의 22.9%만큼, 상한 39.0%/43.0%/41.4%/45.4%)."
  },
  "passive1": {
    "name": "충실",
    "element": "패시브",
    "description": "전투 중 자신의 효과 명중 60.0%에 해당하는 공격력 보너스를 획득한다."
  },
  "passive2": {
    "name": "열정",
    "element": "패시브",
    "description": "스킬을 사용해 적에게 디버프 효과를 추가한 후 자신의 공격력이 33.0% 증가한다. 동료가 화염 속성 대미지 또는 추가 효과 대미지를 줄 때 동일한 공격력 증가 효과를 획득하며 1턴 동안 지속된다."
  }
};
window.enCharacterSkillsData["루우나"] = {
  "name": "Runa Dogenzaka",
  "skill1": {
    "name": "Fiery Handshake",
    "element": "화염광역",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "Deals 73.2%/80.7%/77.7%/85.2% ATK as Fire DMG to all enemies, decreases the target's DEF based on 15.4% own EHR, up to 26.4%/29.2%/27.9%/30.7% for 2 turns, additionally decreases DEF by 26.4% when taking Fire DMG. There is a 50% base chance to inflict Burn. Howler gains [Warm Welcome]. (Cannot stack the DEF Down effect with [Intimidate Baddie].)"
  },
  "skill2": {
    "name": "Intimidate Baddie",
    "element": "화염",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "Deals 170.8%/188.3%/181.3%/198.8% ATK as Fire DMG to 1 enemy, decreases the target's DEF by 14.6%/14.6%/15.5%/15.5% + 31.4% of own EHR (up to 53.7%/59.3%/56.9%/62.5% DEF Down) for 2 turns. You gain [Furious Pursue]. (Cannot stack the DEF Down effect with [Fiery Handshake].)"
  },
  "skill3": {
    "name": "GOGO WOOF WOOF RU!",
    "element": "화염광역",
    "type": "디버프",
    "sp": 24,
    "cool": 0,
    "description": "Requirement: You have [Warm Welcome] or [Furious Pursue]. When you have [Warm Welcome] or [Furious Pursue], triggers their corresponding effect. Only one effect can be triggered.\n- [Warm Welcome]: Deals 109.8%/109.8%/116.6%/116.6% ATK as Fire DMG to all enemies, increases the target's DMG Taken based on 24% of own EHR, up to 41.0%/45.2%/43.5%/47.7%, increases their Fire DMG Taken by 20.5%/22.7%/21.7%/23.9% for 2 turns.\n- [Furious Pursue]: Deals 219.6%/219.6%/233.1%/233.1% ATK as Fire DMG to 1 enemy, increases the target's DMG Taken based on 34.3% of own EHR, up to 58.6%/64.7%/62.1%/68.2%, increases their Follow Up DMG Taken by 29.3%/31.6%/31.8%/34.1% for 2 turns."
  },
  "skill_highlight": {
    "element": "화염광역",
    "type": "디버프",
    "description": "Deals 214.7%/236.7%/227.9%/249.9% ATK as Fire DMG to all enemies, inflicts all enemies with 2 stacks of [Big Bad]: Consumes 1 stack when any enemy take Follow Up DMG or Fire DMG to increase that damage based on 22.9% own EHR, up to 39.0%/43.0%/41.4%/45.4% for 2 turns."
  },
  "passive1": {
    "name": "Loyalty",
    "element": "패시브",
    "description": "Increase ATK by 60% of your EHR."
  },
  "passive2": {
    "name": "Passion",
    "element": "패시브",
    "description": "After using skills to inflict debuffs, increase own ATK by 33.0%, allies gain the same amount of ATK when they deal Fire DMG or Follow Up DMG for 1 turn."
  }
};
window.jpCharacterSkillsData["루우나"] = {
  "name": "道玄坂 琉七",
  "skill1": {
    "name": "熱き握手",
    "element": "화염광역",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "全ての敵に攻撃力の73.2%/80.7%/77.7%/85.2%の火炎属性ダメージを与える。対象の防御力を減少させ（自身の状態異常命中の15.4%分、上限26.4%/29.2%/27.9%/30.7%）、火炎属性スキルを受けた際に防御がさらに26.4%/26.4%/28.0%/28.0%減少し、2ターン持続する。また50%の基本確率で燃焼状態にする。自身が『熱烈な歓迎』を獲得する（防御減少効果は『悪党への警告』が同時に存在する場合、より高い数値が適用される）。"
  },
  "skill2": {
    "name": "悪党への警告",
    "element": "화염",
    "type": "디버프",
    "sp": 22,
    "cool": 0,
    "description": "1体の敵に攻撃力の170.8%/188.3%/181.3%/198.8%の火炎属性ダメージを与え、2ターンの間、防御力を14.6%/14.6%/15.5%/15.5% +（自身の状態異常命中の31.4%、上限53.7%/59.3%/56.9%/62.5%）減少させる。自身が『執拗な追跡』を獲得する（防御減少効果は『熱き握手』が同時に存在する場合、より高い数値が適用される）。"
  },
  "skill3": {
    "name": "GOGO ワンワン！",
    "element": "화염광역",
    "type": "디버프",
    "sp": 24,
    "cool": 0,
    "description": "『熱烈な歓迎』または『執拗な追跡』を所持しているかによって、スキルの効果が異なり、同時に1つの効果のみ発動可能。\n『熱烈な歓迎』：全ての敵に攻撃力の109.8%/109.8%/116.6%/116.6%の火炎属性ダメージを与え、2ターンの間、対象が受けるダメージが増加（自身の状態異常命中の24%、上限41.0%/45.2%/43.5%/47.7%）、受ける火炎属性ダメージが20.5%/22.7%/21.7%/23.9%増加する。\n『執拗な追跡』：1体の敵に攻撃力の219.6%/219.6%/233.1%/233.1%の火炎属性ダメージを与え、2ターンの間、対象が受けるダメージが増加（自身の状態異常命中の34.3%、上限58.6%/64.7%/62.1%/68.2%）、受ける追加効果ダメージが29.3%/31.6%/31.8%/34.1%増加する。"
  },
  "skill_highlight": {
    "element": "화염광역",
    "type": "디버프",
    "description": "全ての敵に攻撃力の214.7%/236.7%/227.9%/249.9%の火炎属性ダメージを与え、敵陣が『大悪党』2スタックを獲得する。\n『大悪党』：敵陣の任意の対象が追撃（追加効果）スキルまたは火炎属性スキルを受けると1スタックが消費され、2ターンの間、受けるダメージが増加する（自身の状態異常命中の22.9%、上限39.0%/43.0%/41.4%/45.4%）。"
  },
  "passive1": {
    "name": "忠実",
    "element": "패시브",
    "description": "戦闘中、自身の状態異常命中60.0%分の攻撃力ボーナスを獲得する。"
  },
  "passive2": {
    "name": "情熱",
    "element": "패시브",
    "description": "スキルで敵にデバフを付与した後、自身の攻撃力が33.0%上昇する。味方が火炎属性ダメージまたは追加効果ダメージを与えると、同じ攻撃力上昇効果を獲得し、1ターン持続する。"
  }
};
