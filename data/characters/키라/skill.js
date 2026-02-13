window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["키라"] = {
  "name": "키타자토 키라",
  "skill1": {
    "name": "절단 기법/죄악의 게임",
    "element": "물리",
    "type": "단일 피해",
    "sp": 21,
    "cool": 0,
    "description": "『사냥꾼』 상태: 1명의 적에게 공격력 47.3%/52.2%/50.2%/55.1%의 물리 속성 대미지를 4회 주고, 『유혈』 1중첩을 추가한다.\n『집행관』 상태: 1명의 적에게 공격력 251.7%/277.5%/267.2%/292.9%의 물리 속성 대미지를 주고, 스킬 종료 후 해당 적의 『유혈』 2중첩을 제거한다(『절개』 효과 발동 가능)."
  },
  "skill2": {
    "name": "치명적 쾌감/커튼콜",
    "element": "물리",
    "type": "단일 피해",
    "sp": 21,
    "cool": 0,
    "description": "『사냥꾼』 상태: 1명의 적에게 공격력 84.2%/92.9%/89.4%/98.0%의 물리 속성 대미지를 2회 주고, 『유혈』 대미지를 즉시 1회 결산 및 적의 『유혈』 상태 지속시간을 초기화한다.\n『집행관』 상태: 1명의 적에게 공격력 251.7%/277.5%/267.2%/292.9%의 물리 속성 대미지를 준다. 목표에게 『유혈』 1중첩이 있을 때마다 해당 스킬 대미지와 발동한 『절개』 대미지가 2% 증가하고, 스킬 종료 후 해당 적의 모든 『유혈』 상태를 제거한다(『절개』 효과 발동 가능)."
  },
  "skill3": {
    "name": "밤의 장막",
    "element": "버프",
    "type": "전환",
    "sp": 15,
    "cool": 0,
    "description": "임의 적의 『유혈』 중첩수≥7 시 해당 스킬이 해제된다.\n『집행관』 상태로 전환해 스킬 모드가 변경되며 다음 효과를 획득한다. 스킬 사용 시 목표에게 『유혈』 3중첩이 있을 때마다 키타자토 키라는 추가로 목표에 『절개』 1회를 입혀, 공격력 66.7%/73.5%/70.8%/77.6%의 물리 속성 대미지를 준다.\n해당 스킬 사용 후 이번 턴에서는 다른 스킬을 사용할 수 있으며, 턴 종료 시 『사냥꾼』 상태로 자동 전환된다."
  },
  "skill_highlight": {
    "element": "물리",
    "type": "단일피해",
    "description": "『사냥꾼』 상태로 전환해 즉시 1명의 적에게 『유혈』 5중첩을 추가한다. 다음 『집행관』 상태로 전환해 해당 적에게 공격력 492.8%/543.3%/523.1%/573.6%의 물리 속성 대미지를 준다(『절개』 효과 발동 가능).",
    "cool": 4
  },
  "passive1": {
    "name": "감염",
    "element": "패시브",
    "description": "키타자토 키라의 효과 명중 30%마다 『유혈』의 물리 속성 대미지가 키타자토 키라 공격력의 4%만큼 증가한다. 최대 90%의 효과 명중이 계산된다.",
    "cool": 0
  },
  "passive2": {
    "name": "부패",
    "element": "패시브",
    "description": "『사냥꾼』 상태일 때 효과 명중이 36% 증가한다.\n『집행관』 상태일 때 관통이 21% 증가한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["키라"] = {
  "name": "Kira Kitazato",
  "skill1": {
    "name": "Moonlit Scalpel / Midnight Surgery",
    "element": "물리",
    "type": "단일 피해",
    "sp": 21,
    "cool": 0,
    "description": "Doctor mode: Deal Physical damage to 1 foe equal to 47.3%/52.2%/50.2%/55.1% of Attack (4 hits) and inflict 1 Bleed stack.  Ripper mode: Deal Physical damage to 1 foe equal to 251.7%/277.5%/267.2%/292.9% of Attack, then remove 2 Bleed stacks from the target (can activate Rending effects)."
  },
  "skill2": {
    "name": "Crimson Operation / Pathology",
    "element": "물리",
    "type": "단일 피해",
    "sp": 21,
    "cool": 0,
    "description": "Doctor mode: Deal Physical damage to 1 foe equal to 84.2%/92.9%/89.4%/98.0% of Attack (2 hits). At the same time, activate Bleed damage and reset the turn duration of the target's Bleed stacks 1 time.\nRipper mode: Deal Physical damage to 1 foe equal to 251.7%/277.5%/267.2%/292.9% of Attack. For each Bleed stack on the target, increase the damage of Rending activated by them and this skill by 2%, then remove all Bleed stacks from the target (can activate Rending effects)."
  },
  "skill3": {
    "name": "Nightfall",
    "element": "버프",
    "type": "버프",
    "sp": 15,
    "cool": 0,
    "description": "Switch to Ripper mode and change Kitazato's skills (can be activated when any foe has 7 or more Bleed stacks).\nWhen using skills in this mode, for every 3 Bleed stacks on the target, inflict 1 Rending stack (Physical damage equal to 66.7%/73.5%/70.8%/77.6% of Attack).\nAfter using this skill, Kitazato can use other skills and switches to Doctor mode at the end of the turn."
  },
  "skill_highlight": {
    "element": "물리",
    "cool": 4,
    "description": "Switch to Doctor mode and immediately inflict 5 Bleed stacks on 1 foe.\nThen, immediately switch to Ripper mode and deal Physical damage to the target equal to 492.8%/543.3%/523.1%/573.6% of Attack (can activate Rending effects)."
  },
  "passive1": {
    "name": "Hideous Mask",
    "element": "패시브",
    "cool": 0,
    "description": "For every 30% of Kitazato's ailment accuracy, increase Physical damage from Bleed by 4% of Attack (up to 90% of ailment accuracy)."
  },
  "passive2": {
    "name": "Drawn Blade",
    "element": "패시브",
    "cool": 0,
    "description": "When in Doctor mode, increase ailment accuracy by 36%.\nWhen in Ripper mode, increase pierce rate by 21%."
  }
};
window.jpCharacterSkillsData["키라"] = {
  "name": "北里 基良",
  "skill1": {
    "name": "月下のメス／闇夜処置",
    "element": "물리",
    "sp": 21,
    "cool": 0,
    "description": "『ドクター』状態：敵単体に４回、攻撃力47.3%/52.2%/50.2%/55.1%の物理属性ダメージを与え、さらに『出血』を１つ付与する。『バスター』状態：敵単体に攻撃力251.7%/277.5%/267.2%/292.9%の物理属性ダメージを与え、その後に対象の『出血』を２つ取り除く（『烈痛』効果を発動できる）。"
  },
  "skill2": {
    "name": "深紅のオペ／病理特定",
    "element": "물리",
    "sp": 21,
    "cool": 0,
    "description": "『ドクター』状態：敵単体に２回、攻撃力84.2%/92.9%/89.4%/98.0%の物理属性ダメージを与える。同時に１回、『出血』ダメージを発生させ、対象の『出血』の持続ターンをリセットする。\n『バスター』状態：敵単体に攻撃力251.7%/277.5%/267.2%/292.9%の物理属性ダメージを与える。対象に付与されている『出血』が１つごとに、このスキルとそれによって発動する『烈痛』のダメージが２%ずつ上昇する。その後、対象の『出血』を全て取り除く（『烈痛』効果を発動できる）。"
  },
  "skill3": {
    "name": "ジキルハイド",
    "type": "버프",
    "sp": 15,
    "cool": 0,
    "description": "自身の状態を『バスター』に切り替え、他のスキルの性質を変化させる（いずれかの敵に付与されている『出血』が７つ以上の時に使用可能）。\nさらに、この状態でスキルを使用した時、対象の『出血』が３つごとに、追加で１回『烈痛』（攻撃力66.7%/73.5%/70.8%/77.6%の物理属性ダメージ）を与える。\nこのスキルを使用した後に他のスキルを使用することができ、ターン終了時に『ドクター』状態に戻る。",
    "element": "버프"
  },
  "skill_highlight": {
    "element": "물리",
    "cool": 4,
    "description": "『ドクター』状態に切り替え、即座に敵単体に『出血』を５つ付与する。\n直後に『バスター』状態に切り替え、対象に攻撃力492.8%/543.3%/523.1%/573.6%の物理属性ダメージを与える（『烈痛』効果を発動可能）。"
  },
  "passive1": {
    "name": "異形のマスク",
    "element": "패시브",
    "cool": 0,
    "description": "自身の状態異常命中が３０%ごとに、『出血』の物理属性の与ダメージが自身の攻撃力の４%分上昇する（最大で状態異常命中90%分まで）。"
  },
  "passive2": {
    "name": "抜き身の刃",
    "element": "패시브",
    "cool": 0,
    "description": "『ドクター』状態の時、状態異常命中が36%上昇する。\n『バスター』状態の時、貫通力が21%上昇する。"
  }
};
