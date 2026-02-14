window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["마사키"] = {
  "name": "아시야 마사키",
  "skill1": {
    "name": "연민의 축복",
    "element": "빙결",
    "type": "광역 피해",
    "sp": 24,
    "cool": 0,
    "description": "지정된 적 1명에게 방어력 149.2%/164.5%/158.4%/173.7%의 빙결 속성 대미지를 주고, 다른 적 유닛에게 방어력 44.8%/49.4%/47.6%/52.1%의 빙결 속성 대미지를 주며, 97.6%/97.6%/103.6%/103.6%의 기본 확률로 메인 목표를 동결 상태에 빠뜨린다. 동시에 아시야 마사키는 『용맹』을 2포인트 회복한다. 아시야 마사키가 『정의 선언』 상태일 경우, 2턴 동안 메인 목표가 받는 대미지가 추가 증가한다(아시야 마사키가 방어 600포인트를 보유할 때마다 메인 목표가 받는 대미지 1% 증가, 최대 9.8%/10.8%/10.4%/11.4% 증가). 하지만 『용맹』 회복량이 1포인트로 감소한다."
  },
  "skill2": {
    "name": "명예 수호",
    "element": "버프",
    "type": "실드",
    "sp": 26,
    "cool": 0,
    "description": "동료 1명이 방어력 22.8%/22.8%/24.2%/24.2%+650/790/799/939의 대미지를 막을 수 있는 『정직의 성인』을 1중첩 획득하고, 아시야 마사키 방어력의 20%(최대 1220/1345/1295/1420포인트)만큼 방어력이 증가한다. 효과는 2턴 동안 지속된다. 해당 효과를 획득할 때 해당 동료의 생명이 60%보다 높으면, 공격받을 확률이 50% 증가한다. 아시야 마사키의 다음 턴이 시작되면, 해당 동료가 다시 『정직의 성인』 1중첩을 획득한다. 아시야 마사키가 『정의 선언』 상태일 경우, 2턴 동안 발동하는 『정직의 성인』 실드량이 추가로 25% 증가한다."
  },
  "skill3": {
    "name": "영혼의 기도",
    "element": "버프광역",
    "type": "실드",
    "sp": 30,
    "cool": 1,
    "description": "즉시 모든 동료에게 방어력 12%+120/240/360(1/50/70레벨)의 대미지를 막을 수 있는 『정직의 성인』 1중첩과 방어력 49.2%/49.2%/52.2%/52.2%+1400/1702/1721/2024의 대미지를 막을 수 있는 『성결의 가호』 1중첩을 추가한다. 동시에 모든 동료가 다운 수치 1포인트와 주는 대미지 증가 효과(아시야 마사키가 방어력 300포인트를 보유할 때마다 주는 대미지 1% 증가, 최대 19.5%/21.5%/20.7%/22.7% 증가)를 획득하며 2턴 동안 지속된다."
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "실드",
    "description": "즉시 모든 동료에게 방어력 59.0%/59.0%/62.7%/62.7%+1681/2044/2066/2429의 대미지를 막을 수 있는 『성결의 가호』 1중첩을 추가한다. 동시에 모든 동료가 받는 대미지가 31.9%/35.2%/33.9%/37.1% 감소하며 2턴 동안 지속된다.",
    "cool": 4
  },
  "passive1": {
    "name": "희생",
    "element": "패시브",
    "description": "아시야 마사키의 실드 보호를 받는 동료의 방어력이 24.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "겸손",
    "element": "패시브",
    "description": "아시야 마사키의 실드 보호를 받는 동료의 효과 저항이 48.0% 증가한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["마사키"] = {
  "name": "Masaki Ashiya",
  "skill1": {
    "name": "Frost Vines",
    "element": "빙결",
    "type": "단일피해",
    "sp": 24,
    "cool": 0,
    "description": "Deal Ice damage to the main target equal to 149.2%/164.5%/158.4%/173.7% of Ashiya's Defense, and deal Ice damage to other foes equal to 44.8%/49.4%/47.6%/52.1% of Ashiya's Defense.\n97.6%/97.6%/103.6%/103.6% chance to inflict Freeze on the main target, and gain 2 Heroism stacks.\nIf Garden of Promises is active, increase the main target's damage taken by 2% for every 600 points of Ashiya's Defense (up to 19.5%/21.5%/20.7%/22.7%), but gain only 1 Heroism stack."
  },
  "skill2": {
    "name": "Hoarfrost Vow",
    "element": "버프",
    "type": "실드",
    "sp": 26,
    "cool": 0,
    "description": "Grant 1 Knight's Protection shield equal to 22.8%/22.8%/24.2%/24.2% of Ashiya's Defense + 650/790/799/939 to 1 ally. Also increase the ally's Defense by 20% of Ashiya's Defense (up to 1220/1345/1295/1420) for 2 turns. If the target granted this effect has more than 60% HP, increase rate to take attacks from foes by 50%.\nAt the start of Ashiya's next turn, grant 1 Knight's Protection again to the same target. If Garden of Promises is active, increase shield granted from Knight's Protection by 25% for 2 turns."
  },
  "skill3": {
    "name": "Winter Fortress",
    "element": "버프광역",
    "type": "실드",
    "sp": 30,
    "cool": 1,
    "description": "Grant all allies 1 Knight's Protection shield equal to 12% of Ashiya's Defense + 120/240/360 (effect changes at Lv. 1/50/70, respectively) and Knight's Resolve shield equal to 49.2%/49.2%/52.2%/52.2% of Ashiya's Defense + 1400/1702/1721/2024.\nAlso increase all allies' Down Points by 1 and damage dealt by 2.9% for every 300 points of Ashiya's Defense (up to 56.6%/62.4%/60.1%/65.9%) for 2 turns."
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "실드",
    "description": "Grant Knight's Resolve shield equal to 59.0%/59.0%/62.7%/62.7% of Ashiya's Defense + 1681/2044/2066/2429 to all allies and decrease damage taken by 31.9%/35.2%/33.9%/37.1% for 2 turns.",
    "cool": 4
  },
  "passive1": {
    "name": "Flower Knight's Shield",
    "element": "패시브",
    "description": "When allies have a shield granted by Ashiya, increase Defense by 24.0% and ailment resistance by 48.0%.",
    "cool": 0
  },
  "passive2": {
    "name": "Flower Knight's Devotion",
    "element": "패시브",
    "description": "While Ashiya is in battle, when an ally uses their ailment resistance to avoid a Curse, elemental ailment, or spiritual ailment, grant 1, 2, or 3 buff stacks, respectively.\nFor each buff stack, increase the targeted ally's damage dealt by 10.0% for 2 turns. This can stack up to 3 times. At 3 buff stacks, also increase critical damage by 20.0% for 2 turns.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["마사키"] = {
  "name": "芦谷 真咲",
  "skill1": {
    "name": "フロストヴァイン",
    "element": "빙결",
    "type": "単体ダメージ",
    "sp": 24,
    "cool": 0,
    "description": "選択した対象に防御力149.2%/164.5%/158.4%/173.7%分の氷結属性ダメージを与え、それ以外の敵に防御力44.8%/49.4%/47.6%/52.1%分の氷結属性ダメージを与える。\n選択した対象を97.6%/97.6%/103.6%/103.6%の確率で凍結状態にし、同時に『英勇』を２つ獲得する。\nさらに『花園に誓う友情』状態ならば、２ターンの間、選択した対象の被ダメージを自身の防御力６００ごとに２%上昇させる（最大19.5%/21.5%/20.7%/22.7%まで）。ただし『英勇』の獲得量は１つになる。"
  },
  "skill2": {
    "name": "誓いの雪花",
    "element": "버프",
    "type": "シールド",
    "sp": 26,
    "cool": 0,
    "description": "味方単体に防御力22.8%/22.8%/24.2%/24.2%＋650/790/799/939のシールド『騎士の守り』を１つ付与する。さらに、２ターンの間、その味方の防御力を芦谷の防御力の２０%分（最大1220/1345/1295/1420まで）上昇させる。この効果を付与された対象のＨＰが６０%より多い場合、敵から攻撃を受ける確率が５０%上昇する。\n自身の次のターン開始時、同じ対象に再度『騎士の守り』を１つ付与する。『花園に誓う友情』状態ならば、２ターンの間、付与する『騎士の守り』のシールド量が２５%上昇する。"
  },
  "skill3": {
    "name": "決意の氷壁",
    "element": "버프광역",
    "type": "シールド",
    "sp": 30,
    "cool": 1,
    "description": "味方全体に、防御力の１２%＋１２０／２４０／３６０(自身のレベルが１/５０/７０以上の時)のシールド『騎士の守り』を１つと、さらに防御力49.2%/49.2%/52.2%/52.2%+1400/1702/1721/2024のシールド『騎士の決意』を付与する。\n同時に、味方全体のダウン値を１増加させ、さらに２ターンの間、与ダメージを芦谷の防御力３００ごとに２.９%(最大56.6%/62.4%/60.1%/65.9%まで）上昇させる。"
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "シールド",
    "description": "２ターンの間、味方全体に防御力59.0%/59.0%/62.7%/62.7%＋1681/2044/2066/2429のシールド『騎士の決意』を付与し、さらに味方全体の被ダメージを31.9%/35.2%/33.9%/37.1%低下させる。",
    "cool": 4
  },
  "passive1": {
    "name": "花の騎士の庇護",
    "element": "패시브",
    "description": "芦谷のシールドが付与されている味方は、防御力が24.0%上昇、状態異常抵抗が48.0%上昇する。",
    "cool": 0
  },
  "passive2": {
    "name": "花の騎士の献身",
    "element": "패시브",
    "description": "芦谷が場にいる時、味方が状態異常抵抗により、呪印／属性異常／行動異常を回避した時、１／２／３つの強化効果を得る。\n強化効果は、１つごとに、２ターンの間、対象の味方の与ダメージが10.0%上昇し、最大３つまで累積できる。３つになると、さらに２ターンの間、クリティカルダメージが20.0%上昇する。",
    "cool": 0
  }
};
