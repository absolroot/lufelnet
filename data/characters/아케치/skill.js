window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["아케치"] = {
  "name": "아케치 고로",
  "skill1": {
    "name": "정의의 약속",
    "element": "축복광역",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "모든 적에게 공격력 93.2%/102.8%/98.9%/108.5%의 축복 속성 대미지를 주고, 모든 동료의 생명을 1561/1561/1657/1657포인트 회복하며, 모든 동료가 축복을 1중첩 획득한다. 자신이 『진실』을 획득하고 2턴 동안 『정확』 상태를 획득한다. 『정확』 상태에서는 모든 동료가 주는 대미지가 19.5%/21.5%/20.7%/22.7% 증가한다."
  },
  "skill2": {
    "name": "기울어진 사냥터",
    "element": "주원광역",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "모든 적에게 공격력 116.5%/128.5%/123.7%/135.6%의 주원 속성 대미지를 준다. 자신이 『진실』을 획득하며, 2턴 동안 『혼돈』 상태를 획득한다. 『혼돈』 상태에서는 모든 적의 방어가 25.4%/28.0%/26.9%/29.5% 감소하고, 자신의 『혼돈의 화살』 발동 횟수가 1회 증가하며, 주는 대미지가 19.5%/21.5%/20.7%/22.7% 증가한다."
  },
  "skill3": {
    "name": "황금 화살비·파멸",
    "element": "만능광역",
    "type": "광역 피해",
    "sp": 24,
    "cool": 0,
    "description": "활성화 조건: 자신이 『진실』 보유\n모든 『정확한 화살』을 소모하여 모든 적에게 『정확한 화살』 기록 대미지 19.5%/21.5%/20.7%/22.7%의 만능 속성 고정 대미지를 준다. 이후 임의 적에게 『혼돈의 화살』을 4회 발사하고, 매회 공격력 77.4%/85.3%/82.2%/90.1%의 만능 속성 대미지를 준다. 해당 효과의 공격을 받지 않은 적을 우선 공격하며, 동일 목표에게 여러 회 명중 시 15%의 대미지만 준다."
  },
  "skill_highlight": {
    "element": "만능",
    "type": "광역피해",
    "description": "모든 적에게 공격력 103.5%/114.1%/109.8%/120.4%의 축복 속성 대미지를 1회 주고, 공격력 103.5%/114.1%/109.8%/120.4%의 주원 속성 대미지를 1회 준다. 자신의 『혼돈의 화살』 발동 횟수가 2회 증가하며 4턴 동안 지속된다.",
    "cool": 4
  },
  "passive1": {
    "name": "법도",
    "element": "패시브",
    "description": "아케치 고로가 팀에 합류하면 원하는 속성의 욕망 소나타를 발동할 수 있다. 전투 시작 시 욕망 소나타 1종을 발동할 때마다 자신이 주는 대미지가 15.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "갈망",
    "element": "패시브",
    "description": "만능 대미지를 줄 때 목표가 방어 감소 효과 1%를 보유할 때마다 자신의 대미지가 0.5% 증가한다. (상한 120.0%)",
    "cool": 0
  }
};
window.enCharacterSkillsData["아케치"] = {
  "name": "Goro Akechi",
  "skill1": {
    "name": "Vow of Justice",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deals 93.2%/102.8%/98.9%/108.5% ATK as Bless DMG to all enemies, and restore 1561/1561/1657/1657 HP to all allies, then gives all allies 1 stack of Blessing. Crow gains [Truth], then gain [Clarity] for 2 turns. Under [Clarity], increase all allies' DMG Dealt by 19.5%/21.5%/20.7%/22.7%."
  },
  "skill2": {
    "name": "Unjust Hunting Ground",
    "element": "주원광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deals 116.5%/128.5%/123.7%/135.6% ATK as Curse DMG to all enemies, Crow gains [Truth], then gain [Chaos] for 2 turns. Under [Chaos], decrease all enemies' DEF by 25.4%/28.0%/26.9%/29.5%, adds 1 more shot to [Arrow of Chaos] and increase its DMG Dealt by 19.5%/21.5%/20.7%/22.7%."
  },
  "skill3": {
    "name": "Golden Arrow Rain - Annihilate",
    "element": "만능광역",
    "type": "광역피해",
    "sp": 24,
    "cool": 0,
    "description": "Unlock condition: When Crow has [Truth].\nConsumes all [Arrow of Clarity], deals 19.5%/21.5%/20.7%/22.7% of the recorded damage from [Arrow of Clarity] as fixed Almighty DMG (can't CRIT) to all enemies. Then randomly shoots 4 [Arrow of Chaos], each dealing 77.4%/85.3%/82.2%/90.1% ATK as Almighty DMG, prioritizing enemies that have not been attacked yet. Crow will only deal 15% DMG to the same target."
  },
  "skill_highlight": {
    "element": "만능",
    "type": "광역피해",
    "description": "Deals 103.5%/114.1%/109.8%/120.4% ATK as Bless DMG and 103.5%/114.1%/109.8%/120.4% ATK as Curse DMG to all enemies, adds 2 more shots to [Arrow of Chaos] for 4 turns."
  },
  "passive1": {
    "name": "Law",
    "element": "패시브",
    "description": "When Crow is in the team, he can trigger Desire Sonata for any element. At the start of battle, increase DMG Dealt by 15.0% for every triggered Desire Sonata."
  },
  "passive2": {
    "name": "Desire",
    "element": "패시브",
    "description": "When dealing Almighty DMG, for every 1% DEF Down on the target, increase DMG Dealt by 0.5%. (Up to 120.0%)"
  }
};
window.jpCharacterSkillsData["아케치"] = {
  "name": "明智 吾郎",
  "skill1": {
    "name": "正義の誓い",
    "element": "축복광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "全ての敵に攻撃力の93.2%/102.8%/98.9%/108.5%の祝福属性ダメージを与え、味方全体のHPを1561/1561/1657/1657ポイント回復し、味方全体に祝福を1スタック付与する。自身が『真実』を獲得し、2ターンの間『正確』状態になる。『正確』状態では味方全体の与ダメージが19.5%/21.5%/20.7%/22.7%上昇する。"
  },
  "skill2": {
    "name": "傾いた狩場",
    "element": "주원광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "全ての敵に攻撃力の116.5%/128.5%/123.7%/135.6%の呪怨属性ダメージを与える。自身が『真実』を獲得し、2ターンの間『混沌』状態になる。『混沌』状態では全ての敵の防御が25.4%/28.0%/26.9%/29.5%減少し、自身の『混沌の矢』発動回数が1回増加し、与ダメージが19.5%/21.5%/20.7%/22.7%上昇する。"
  },
  "skill3": {
    "name": "黄金の矢雨・破滅",
    "element": "万능広域",
    "type": "광역피해",
    "sp": 24,
    "cool": 0,
    "description": "発動条件：自身が『真実』を保有\n全ての『正確な矢』を消費して、全ての敵に『正確な矢』記録ダメージ19.5%/21.5%/20.7%/22.7%の万能固定ダメージを与える。その後、ランダムな敵に『混沌の矢』を4回発射し、1回ごとに攻撃力の77.4%/85.3%/82.2%/90.1%の万能属性ダメージを与える。この攻撃は未被弾の敵を優先し、同一ターゲットに複数回命中した場合、2回目以降は15%のダメージのみを与える。"
  },
  "skill_highlight": {
    "element": "万능",
    "type": "광역피해",
    "description": "全ての敵に攻撃力の103.5%/114.1%/109.8%/120.4%の祝福属性ダメージを1回、呪怨属性ダメージを1回与える。自身の『混沌の矢』発動回数が2回増加し、4ターン持続する。"
  },
  "passive1": {
    "name": "法度",
    "element": "패시브",
    "description": "明智 吾郎がチームにいるとき、任意の属性の欲望ソナタを発動できる。戦闘開始時に欲望ソナタを1種発動するごとに、自身の与ダメージが15.0%上昇する。"
  },
  "passive2": {
    "name": "渇望",
    "element": "패시브",
    "description": "万能ダメージを与える際、ターゲットが1%の防御減少効果を持つごとに、自身のダメージが0.5%上昇する（上限120.0%）。"
  }
};
