window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["미유·여름"] = {
  "name": "사하라 미유",
  "skill1": {
    "name": "해월의 꿈",
    "element": "빙결광역",
    "type": "광역피해",
    "sp": 0,
    "cool": 0,
    "description": "모든 적에게 공격력 100.7%/111.0%/106.9%/117.2%의 빙결 속성 대미지를 주고, 2턴 동안 100%의 기본 확률로 목표를 동결 상태에 빠뜨린다. 자신은 SP 40포인트를 회복한다(해당 효과는 SP 회복 속성의 영향 받음). 해당 방식으로 획득하는 SP는 SP 상한을 돌파할 수 있다(최대 SP 상한에 해당하는 만큼의 추가 SP 획득)."
  },
  "skill2": {
    "name": "푸른 협주",
    "element": "빙결광역",
    "type": "광역피해",
    "sp": 0,
    "cool": 0,
    "description": "모든 적에게 공격력 178.7%/197.0%/189.7%/208.0%의 빙결 속성 대미지를 준다. 『바다의 영역』에 있을 경우 『파도의 노래』 중첩마다 해당 스킬의 대미지가 10% 증가한다. 해당 스킬 시전 후 『바다의 영역』에서 나가며 『파도의 노래』가 제거된다. 해당 스킬은 추가 효과로 간주한다."
  },
  "skill3": {
    "name": "빛 너머의 파도",
    "element": "버프",
    "type": "강화",
    "sp": 60,
    "cool": 0,
    "description": "서핑보드를 타고 즉시 자신의 정신 이상 상태를 해제한 뒤 『바다의 영역』을 전개한다. 해당 기간 동안 다운, 정신 이상, 제어 효과에 면역이 되며, 자신은 근접 공격, 총기 공격 시전 및 아이템을 사용할 수 없다. 임의의 상태 획득 시 지속 시간이 1턴 연장된다. 해당 기간 동안 임의의 동료 턴 종료 시 자신의 SP가 충분한 경우에는 자동으로 SP를 일정량 소모해 『밀물과 구름』을 시전한다.\n『밀물과 구름』: SP 30포인트를 소모해 모든 적에게 공격력 50.2%/55.3%/53.3%/58.4%의 빙결 속성 대미지를 주고, 자신은 『파도의 노래』를 1중첩 획득한다. 『파도의 노래』 중첩마다 『밀물과 구름』 스킬 대미지가 5% 증가하며, 소모하는 SP가 30포인트 증가한다(4회 중첩 가능). 『밀물과 구름』은 추가 효과로 간주한다. 해당 추가 효과로는 적에게 다운 수치 대미지를 줄 수 없다.\n해당 스킬을 다시 시전하면 『바다의 영역』에서 나가고 『파도의 노래』가 제거된다. 이번 턴에 다른 스킬을 사용할 수 있지만, 『바다의 영역』은 다시 전개할 수 없다."
  },
  "skill_highlight": {
    "name": "",
    "element": "빙결광역",
    "type": "광역피해",
    "sp": 0,
    "cool": 0,
    "description": "모든 적에게 공격력 219.6%/242.1%/233.1%/255.6%의 빙결 속성 대미지를 준다. 『바다의 영역』에 있을 경우 공격력 146.4%/161.4%/155.4%/170.4%의 빙결 속성 대미지를 1회 추가로 준다."
  },
  "passive1": {
    "name": "날렵",
    "element": "패시브",
    "description": "전투 중 자신의 SP 회복에 따라 공격력이 증가하며, 최대 280.0%의 SP를 회복하면 98.0%의 공격력이 증가한다."
  },
  "passive2": {
    "name": "영리",
    "element": "패시브",
    "description": "『바다의 영역』에 있을 경우 주는 대미지가 30.0% 증가한다."
  }
};
window.enCharacterSkillsData["미유·여름"] = {
  "name": "Miyu·Summer",
  "skill1": {
    "name": "Jellyfish Reverie",
    "element": "빙결광역",
    "type": "AoE DMG",
    "sp": 0,
    "cool": 0,
    "description": "Deal Ice damage to all foes equal to 178.7%/197.0%/189.7%/208.0% of Attack, with a 100% base chance to inflict Freeze for 2 turns. Restore 40 SP to Miyu (this effect is affected by SP Recovery), SP restored by this can exceed the SP cap (up to SP equal to the SP cap)."
  },
  "skill2": {
    "name": "Cerulean Concerto",
    "element": "빙결광역",
    "type": "AoE DMG",
    "sp": 0,
    "cool": 0,
    "description": "Deal Ice damage to all foes equal to 178.7%/197.0%/189.7%/208.0% of Attack. When [Ocean's Domain] is active, each [Thousandfold Waves] stacks increase skill damage by 10%. After using this skill, exit [Ocean's Domain] and lose all [Thousandfold Waves] stacks. This counts as a Resonance."
  },
  "skill3": {
    "name": "Lightwave Leap",
    "element": "버프",
    "type": "Enhance",
    "sp": 60,
    "cool": 0,
    "description": "Get on the surfboard, immediately cleanse Miyu's spiritual ailments and open [Ocean's Domain]: Gain Null Down and Null spiritual/control ailment, Miyu cannot use Melee Attack, Gun Attack, and Item; When gaining any effect, extend its duration by 1 turn; When an ally end their turn, automatically use [Tidal Surge] if Miyu has enough SP.\n[Tidal Surge]: Spend 30 SP to deal Ice damage to all foes equal to 50.2%/55.3%/53.3%/58.4% of Attack. Gain 1 [Thousandfold Waves] stack, each [Thousandfold Waves] stack increases [Tidal Surge] skill damage by 5% and SP cost by 30. Stack up to 4 times. This counts as a Resonance. Damage from this Resonance cannot deal Down Point damage.\nUse this skill again to exit [Ocean's Domain] then lose all [Thousandfold Waves]. Miyu can still use other skills this turn but cannot open [Ocean's Domain]."
  },
  "skill_highlight": {
    "name": "",
    "element": "빙결광역",
    "type": "AoE DMG",
    "sp": 0,
    "cool": 0,
    "description": "Deal Ice damage to all foes equal to 219.6%/242.1%/233.1%/255.6% of Attack. If [Ocean's Domain] is active, deal bonus Ice damage to all foes equal to 146.4%/161.4%/155.4%/170.4% of Attack."
  },
  "passive1": {
    "name": "Finesse",
    "element": "패시브",
    "description": "During battle, increase Miyu's Attack based on her SP Recovery, up to 98% Attack at 280% SP Recovery."
  },
  "passive2": {
    "name": "Wit",
    "element": "패시브",
    "description": "When [Ocean's Domain] is active, increase damage by 30%."
  }
};
window.jpCharacterSkillsData["미유·여름"] = {
  "name": "佐原 海夕 夏",
  "skill1": {
    "name": "クラゲの夢",
    "element": "빙결광역",
    "type": "全体ダメージ",
    "sp": 0,
    "cool": 0,
    "description": "敵全体に攻撃力100.7%/111.0%/106.9%/117.2%の氷結属性ダメージを与え、100%の基礎確率で2ターンの間、凍結状態にする。\n自身のSPを40回復する（この効果はSP回復特性の影響を受ける）。\nこの方法で得たSPは最大値を超えて獲得でき（最大SP相当の追加SPまで可能）。"
  },
  "skill2": {
    "name": "蒼の協奏",
    "element": "빙결광역",
    "type": "全体ダメージ",
    "sp": 0,
    "cool": 0,
    "description": "敵全体に攻撃力178.7%/197.0%/189.7%/208.0%の氷結属性ダメージを与える。\n『海の領域』状態では、『重なる波』1スタックごとにこのスキルのダメージが10%増加する。使用後、『海の領域』から離脱し、『重なる波』がリセットされる。このスキルは追加効果とみなされる。"
  },
  "skill3": {
    "name": "光に乗り蒼き波へ",
    "element": "버프",
    "type": "強化",
    "sp": 60,
    "cool": 0,
    "description": "サーフボードに乗り、即座に自身の精神異常状態を解除し『海の領域』を展開する。\nこの間、ダウン、精神異常、制御効果に免疫を持ち、近接攻撃・銃撃攻撃・アイテム使用ができなくなる。\nいずれかの状態異常やバフを獲得すると持続時間が1ターン延長される。\nこの間、味方のターン終了時にSPが十分であれば、自動的に一定のSPを消費して『波と雲』を発動する。\n\n『波と雲』：SPを30消費し、敵全体に攻撃力50.2%/55.3%/53.3%/58.4%の氷結属性ダメージを与え、自身に『重なる波』を1スタック付与する。\n『重なる波』1スタックごとに『波と雲』のダメージが5%、SP消費量が30増加し、最大4回まで重複可能。\n『波と雲』は追加効果とみなされ、敵にダウン値を与えない。\nこのスキルを再使用すると『海の領域』が解除され、『重なる波』がリセットされる。そのターンは他のスキルを使用できるが、『海の領域』を再展開することはできない。"
  },
  "skill_highlight": {
    "name": "",
    "element": "빙결광역",
    "type": "全体ダメージ",
    "sp": 0,
    "cool": 0,
    "description": "敵全体に攻撃力219.6%/242.1%/233.1%/255.6%の氷結属性ダメージを与える。\n『海の領域』状態の場合、さらに攻撃力146.4%/161.4%/155.4%/170.4%の氷結属性ダメージを追加で与える。"
  },
  "passive1": {
    "name": "交酬",
    "element": "패시브",
    "description": "戦闘中、自身のSP回復量に応じて攻撃力が上昇し、SP回復が280.0%の時、攻撃力が最大98.0%上昇する。"
  },
  "passive2": {
    "name": "賢さ",
    "element": "패시브",
    "description": "『海の領域』状態中、与ダメージが30%上昇する。"
  }
};
