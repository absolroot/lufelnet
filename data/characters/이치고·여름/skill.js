window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["이치고·여름"] = {
  "name": "시카노 이치고·여름",
  "skill1": {
    "name": "미라클 펄 드림",
    "element": "염동광역",
    "type": "광역 피해",
    "sp": 22,
    "cool": 0,
    "description": "랜덤 적에게 자신의 최대 생명 46.2%/50.9%/49.0%/53.7%의 염동 속성 대미지를 5회 주고(해당 스킬의 공격을 받지 않은 적 우선 공격, 다단 대미지가 동일 목표에 명중할 경우 25%의 대미지만 부여), 2턴 동안 아군 전체의 대미지가 13.7%/15.1%/14.5%/15.9% 증가한다(대미지 증가 수치는 시카노 이치고·여름의 최대 생명에 기반, 최대 17080/18830/18130/19880의 최대 생명 적용, 대미지 54.7%/60.3%/58.0%/63.6% 추가 증가). 팀에 다른 염동 속성 팀원이 존재할 경우, 시카노 이치고·여름은 『환상의 표식』을 획득한다."
  },
  "skill2": {
    "name": "스타 앵커의 속삭임",
    "element": "염동광역",
    "type": "광역 피해",
    "sp": 22,
    "cool": 0,
    "description": "적 전체에 자신의 최대 생명 46.2%/50.9%/49.0%/53.7%의 염동 속성 대미지를 주고, 2턴 동안 아군 전체의 대미지가 13.7%/15.1%/14.5%/15.9% 증가한다(대미지 증가 수치는 시카노 이치고·여름의 최대 생명에 기반, 최대 17080/18830/18130/19880의 최대 생명 적용, 대미지 54.7%/60.3%/58.0%/63.6% 추가 증가). 팀에 다른 『여름』 팀원이 존재할 경우, 시카노 이치고·여름은 『바다의 표식』을 획득한다."
  },
  "skill3": {
    "name": "마음이 향하는 곳",
    "element": "버프",
    "type": "치료",
    "sp": 25,
    "cool": 1,
    "description": "쿨타임: 1턴.\n아군 전체에 시카노 이치고·여름 최대 생명 19.5%/21.5%/20.7%/22.7%+1250/1648/1537/1955에 해당하는 생명을 회복시키고, 2턴 동안 아군 전체의 크리티컬 확률이 14.6%/16.1%/15.5%/17.0% 증가한다. 자신이 『환상의 표식』/『바다의 표식』을 보유하고 있다면, 해당하는 표식을 소모하여 모든 염동 팀원/『여름』 팀원의 크리티컬 효과를 19.5%/21.5%/20.7%/22.7% 증가시킨다(크리티컬 효과 증가 수치는 시카노 이치고·여름의 최대 생명에 기반, 최대 17080/18830/18130/19880의 최대 생명 적용, 크리티컬 효과 78.1%/86.1%/82.9%/90.9% 추가 증가). 동시에 스킬 메인 목표를 『조타수』로 지정한다. 『조타수』의 턴 종료 시 『출격·기적의 베리호』를 시전한 후 『조타수』에서 해임된다.\n『출격·기적의 베리호』: 적 전체에 『기적의 베리호』 최대 생명 48.3%/53.3%/51.3%/56.2% + 『조타수』 공격력 173.7%/191.5%/184.4%/202.2%의 대미지를 주며, 대미지 속성은 『조타수』 페르소나의 적합성 속성과 일치한다. 『마음이 향하는 곳』 시전 시 임의의 『표식』을 소모했다면 이번 대미지의 『조타수』 공격력 배율이 347.4%/382.9%/368.7%/404.3%까지 증가한다. 해당 대미지는 페르소나 스킬로 간주하며, 『조타수』의 관통, 대미지 보너스, 대미지 증폭, 크리티컬 확률, 크리티컬 효과, 약점 대미지, 『다운 특공』을 적용하여 계산하고 적의 수가 5명에서 1명씩 줄어들 때마다 대미지가 25%씩 증가한다."
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "버프",
    "type": "치료",
    "sp": 0,
    "cool": 4,
    "description": "아군 전체에 시카노 이치고·여름 최대 생명 20.3%/22.4%/21.5%/23.6%+1300/1703/1598/2022에 해당하는 생명을 회복시키고, 3턴 동안 대미지를 19.5%/21.5%/20.7%/22.7%, 크리티컬 효과를 19.5%/21.5%/20.7%/22.7% 증가시킨다."
  },
  "passive1": {
    "name": "사랑의 속삭임",
    "element": "패시브",
    "description": "아군 유닛을 치유할 때마다 대상의 상태 이상을 1종 제거하고, 1턴 동안 대상의 공격력이 30.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "연심",
    "element": "패시브",
    "description": "전투 중 자신의 최대 생명이 8,500 초과 시, 최대 생명을 300 추가 보유할 때마다 치유 효과가 1% 증가한다(상한 30.0%).",
    "cool": 0
  }
};
window.enCharacterSkillsData["이치고·여름"] = {
  "name": "Ichigo Shikano·Summer",
  "skill1": { "name": "Romantic Pearl", "element": "염동광역", "type": "광역피해", "sp": 22, "cool": 0, "description": "Deal Psy damage to random foes equal to 46.2%/50.9%/49.0%/53.7% of Ichigo max HP (5 hits). From the second hit, prioritize new targets and change damage to 25% for hits on the same target. Increase all allies' damage by 13.7%/15.1%/14.5%/15.9% (based on Ichigo's max HP, up to 54.7%/60.3%/58.0%/63.6% bonus damage at 17080/18830/18130/19880 max HP). Lasts for 2 turns. If another Psy character is present, grant Ichigo [Illusion Seal]." },
  "skill2": { "name": "Astral Anchor", "element": "염동광역", "type": "광역피해", "sp": 22, "cool": 0, "description": "Deal Psy damage to all foes equal to 46.2%/50.9%/49.0%/53.7% of Ichigo's max HP. Increase all allies' damage by 13.7%/15.1%/14.5%/15.9% (based on Ichigo's max HP, up to 54.7%/60.3%/58.0%/63.6% bonus damage at 17080/18830/18130/19880 max HP). Lasts for 2 turns. If another [Summer] character is present, grant Ichigo [Ocean's Seal]."},
  "skill3": { "name": "Heart's Desire", "element": "버프", "type": "치료", "sp": 25, "cool": 1, "description": "Cooldown Time: 1 turn.\nRestore HP to all allies equal to 19.5%/21.5%/20.7%/22.7% of Ichigo's max HP + 1250/1648/1537/1955. Increase all allies' critical rate by 14.6%/16.1%/15.5%/17.0% for 2 turns. If Ichigo has [Illusion Seal]/[Ocean's Seal], spend the corresponding Seal to increase all Psy/[Summer] characters' critical damage by 19.5%/21.5%/20.7%/22.7% (based on Ichigo's max HP, up to 78.1%/86.1%/82.9%/90.9% bonus critical damage at 17080/18830/18130/19880 max HP). Then select the skill main target as the [Helmsman]. At the end of the [Helmsman]'s turn, they will use [Ram: Miracle Ichi-Boat], then the [Helmsman] will step down.\n[Ram: Miracle Ichi-Boat]: Deal damage to all foes equal to 48.3%/53.3%/51.3%/56.2% of the [Miracle Ichi-Boat]'s max HP + 173.7%/191.5%/184.4%/202.2% of the [Helmsman]'s Attack. The attribute is identical to the [Helmsman]'s Persona. If Ichigo spends any [Seal] when using [Heart's Desire], increase the [Helmsman]'s Attack multiplier for this damage to 347.4%/382.9%/368.7%/404.3%. This damage counts as a Persona skill and is calculated using the [Helmsman]'s damage, Damage Amplification, critical rate, and critical damage. Increase damage by 25% for each foe that decreases from 5." },
  "skill_highlight": { "name": "HIGHLIGHT", "element": "버프", "type": "치료", "sp": 0, "cool": 4, "description": "Restore HP to all allies equal to 20.3%/22.4%/21.5%/23.6% of Ichigo's max HP + 1300/1703/1598/2022. Increase their damage and critical damage 19.5%/21.5%/20.7%/22.7% for 3 turns." },
  "passive1": { "name": "Words of Love", "element": "패시브", "description": "When healing an ally, remove 1 debuff from them, then increase their Attack by 30.0% for 1 turn.", "cool": 0 },
  "passive2": { "name": "Loving Heart", "element": "패시브", "description": "During battle, increase Ichigo's Healing Effect by 1% for every 300 points of max HP above 8500, up to 30.0%.", "cool": 0 }
};
window.jpCharacterSkillsData["이치고·여름"] = {
  "name": "鹿野 苺 夏",
  "skill1": { "name": "幻珠の綺夢", "element": "염동광역", "type": "광역피해", "sp": 22, "cool": 0, "description": "ランダムな敵に自身の最大ＨＰ46.2%/50.9%/49.0%/53.7%の念動属性ダメージを５回与える。同スキルの攻撃を受けていない敵を優先し、同じ対象に複数回命中した場合は25%のダメージのみを与える。２ターンの間、味方全体の与ダメージが13.7%/15.1%/14.5%/15.9%上昇する。上昇値は苺・夏の最大ＨＰに応じて、最大17080/18830/18130/19880まで追加で54.7%/60.3%/58.0%/63.6%上昇する。パーティーに他の念動属性の仲間がいる時、自身は『幻の印』を獲得する。" },
  "skill2": { "name": "星錨の潮騒", "element": "염동광역", "type": "광역피해", "sp": 22, "cool": 0, "description": "敵全体に自身の最大ＨＰ46.2%/50.9%/49.0%/53.7%の念動属性ダメージを与える。２ターンの間、味方全体の与ダメージが13.7%/15.1%/14.5%/15.9%上昇し、苺・夏の最大ＨＰに応じて追加で54.7%/60.3%/58.0%/63.6%上昇する。この追加効果は最大ＨＰ17080/18830/18130/19880分まで反映される。パーティーに他の『夏』の仲間がいる時、自身は『海の印』を獲得する。" },
  "skill3": { "name": "心の赴く先", "element": "버프", "type": "치료", "sp": 25, "cool": 1, "description": "クールタイム：１ターン。味方全体のＨＰを苺・夏の最大ＨＰ19.5%/21.5%/20.7%/22.7%+1250/1648/1537/1955回復し、２ターンの間、クリティカル率を14.6%/16.1%/15.5%/17.0%上昇させる。『幻の印』/『海の印』を所持している時、対応する印を消費して念動/『夏』の味方全体のクリティカルダメージを上昇させる。上昇値は19.5%/21.5%/20.7%/22.7%で、苺・夏の最大ＨＰに応じて追加で78.1%/86.1%/82.9%/90.9%上昇する。この追加効果は最大ＨＰ17080/18830/18130/19880分まで反映される。さらに主対象を『操舵手』に指定する。『操舵手』はターン終了時に『ミラクルベリー号、出撃！』を発動した後、指定が解除される。\n『ミラクルベリー号、出撃！』：敵全体に『ミラクルベリー号』の最大ＨＰ48.3%/53.3%/51.3%/56.2%+『操舵手』の攻撃力173.7%/191.5%/184.4%/202.2%のダメージを与える。属性は『操舵手』のペルソナ適性属性と同じで、『心の赴く先』使用時に印を消費した場合は攻撃力倍率が347.4%/382.9%/368.7%/404.3%になる。このダメージはペルソナスキルとして扱い、『操舵手』の与ダメージ上昇、与ダメージ増幅、クリティカル率、クリティカルダメージを使用して計算する。敵数が５体から１体減るごとにダメージが25%上昇する。" },
  "skill_highlight": { "name": "HIGHLIGHT", "element": "버프", "type": "치료", "sp": 0, "cool": 4, "description": "味方全体のＨＰを苺・夏の最大ＨＰ20.3%/22.4%/21.5%/23.6%+1300/1703/1598/2022回復し、３ターンの間、与ダメージとクリティカルダメージをそれぞれ19.5%/21.5%/20.7%/22.7%上昇させる。" },
  "passive1": { "name": "愛の言葉", "element": "패시브", "description": "味方ユニットを回復するたび、対象の状態異常を１つ解除し、１ターンの間、攻撃力を30.0%上昇させる。", "cool": 0 },
  "passive2": { "name": "恋心", "element": "패시브", "description": "戦闘中、自身の最大ＨＰが8500を超えた時、超過した最大ＨＰ300ごとに回復効果が1%上昇する。最大30.0%まで。", "cool": 0 }
};
window.cnCharacterSkillsData["이치고·여름"] = {
  "name": "鹿野莓·夏日",
  "skill1": {
    "name": "幻珠绮梦",
    "element": "염동광역",
    "type": "群体伤害",
    "sp": 22,
    "cool": 0,
    "description": "对随机敌人造成5次自身最大生命值46.2%/50.9%/49.0%/53.7%的念动属性伤害（优先攻击未受到该技能攻击的敌人，多次伤害命中同一目标时只会造成25%的伤害），并使所有同伴伤害提升13.7%/15.1%/14.5%/15.9%（伤害提升值将基于鹿野莓·夏日的最大生命值,最多计入17080/18830/18130/19880最大生命值使伤害额外提升54.7%/60.3%/58.0%/63.6%），持续2回合。若队伍中存在其他念动属性队员，鹿野莓·夏日将获得『幻之印记』。"
  },
  "skill2": {
    "name": "星锚潮语",
    "element": "염동광역",
    "type": "群体伤害",
    "sp": 22,
    "cool": 0,
    "description": "对所有敌人造成自身最大生命值46.2%/50.9%/49.0%/53.7%的念动属性伤害，并使所有同伴伤害提升13.7%/15.1%/14.5%/15.9%（伤害提升值将基于鹿野莓·夏日的最大生命值,最多计入17080/18830/18130/19880最大生命值使伤害额外提升54.7%/60.3%/58.0%/63.6%），持续2回合。若队伍中存在其他『夏日』队员，鹿野莓·夏日将获得『海之印记』。"
  },
  "skill3": {
    "name": "心之所向",
    "element": "버프",
    "type": "治疗",
    "sp": 25,
    "cool": 1,
    "description": "冷却时间：1回合。\n为所有同伴回复鹿野莓·夏日最大生命值19.5%/21.5%/20.7%/22.7%+1250/1648/1537/1955的生命值，并使所有同伴暴击率提升14.6%/16.1%/15.5%/17.0%，持续2回合；若自身拥有『幻之印记』/『海之印记』，消耗相应印记使所有念动队员/『夏日』队员暴击效果提升19.5%/21.5%/20.7%/22.7%（暴击效果提升值将基于鹿野莓·夏日的最大生命值,最多计入17080/18830/18130/19880最大生命值使暴击效果额外提升78.1%/86.1%/82.9%/90.9%）。同时指定技能主目标为『舵手』,『舵手』回合结束时释放『出击·奇迹莓莓号』，随后『舵手』卸任。\n『出击·奇迹莓莓号』：对所有敌人造成『奇迹莓莓号』最大生命值48.3%/53.3%/51.3%/56.2%+『舵手』攻击力173.7%/191.5%/184.4%/202.2%的伤害，伤害属性与『舵手』人格面具的适应性属性保持一致。若释放『心之所向』时消耗了任意『印记』，此次伤害的『舵手』攻击力倍率提升至347.4%/382.9%/368.7%/404.3%。该伤害视作人格面具技能，并采用『舵手』的穿透、伤害加成、伤害增幅、暴击率、暴击效果、弱点伤害、『倒地特攻』进行计算，且敌人数量从5开始每减少1个伤害提升25%。"
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "버프",
    "type": "治疗",
    "sp": 0,
    "cool": 4,
    "description": "为所有同伴回复鹿野莓·夏日最大生命值20.3%/22.4%/21.5%/23.6%+1300/1703/1598/2022的生命值，并使目标伤害提升19.5%/21.5%/20.7%/22.7%、暴击效果提升19.5%/21.5%/20.7%/22.7%，持续3回合。"
  },
  "passive1": {
    "name": "爱语",
    "element": "패시브",
    "description": "每次治疗友方单位时，为其驱散1种异常状态，并使其攻击力提升30.0%，持续1回合。",
    "cool": 0
  },
  "passive2": {
    "name": "恋心",
    "element": "패시브",
    "description": "战斗中自身最大生命值超过8500时，每额外拥有300点最大生命值，获得1%的治疗效果提升，上限30.0%。",
    "cool": 0
  }
};
