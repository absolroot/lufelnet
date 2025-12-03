window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["미츠루"] = {
  "name": "키리조 미츠루",
  "skill1": {
    "name": "찬란한 얼음꽃",
    "element": "빙결",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "1명의 적에게 공격력 211.2%/232.8%/224.2%/245.8%의 빙결 속성 대미지를 주고, 추가로 『서리 결정』을 3중첩 추가한다. 동시에 2턴 동안 해당 적의 방어력을 감소시킨다(키리조 미츠루의 공격력 300포인트마다 방어력 1.2%*『서리 결정』 중첩 수만큼 감소하며, 최대 2928/3228/3108/3408포인트 공격력까지 계산)."
  },
  "skill2": {
    "name": "혹한의 폭풍",
    "element": "디버프",
    "type": "버프",
    "sp": 0,
    "cool": 0,
    "description": "1명의 적을 『여왕의 응시』 상태에 빠뜨리며, 방어력이 7.8%/8.6%/8.3%/9.1% 감소하고(키리조 미츠루의 공격력 300포인트마다 방어력이 추가로 3.2% 감소하며, 최대 2928/3228/3108/3408포인트 공격력까지 계산), 받는 대미지가 증가하며(키리조 미츠루의 공격력 300포인트마다 받는 대미지가 2% 증가하며, 최대 2928/3228/3108/3408포인트 공격력까지 계산), 해당 전투 동안 영구적으로 지속된다.\n\n『여왕의 응시』는 필드에 단 하나만 존재하며, 새로운 목표를 선택하여 시전하면 『여왕의 응시』가 새로운 목표로 전이된다. 『여왕의 응시』 상태인 적이 사망하면 『여왕의 응시』가 자동으로 현재 필드에서 생명이 가장 높은 적에게로 전이된다. 『여왕의 응시』 전이 시, 키리조 미츠루가 추가한 모든 상태 이상도 동시에 전이된다. 이 스킬 사용 후 해당 턴에서 다른 스킬을 사용할 수 있으며, 해당 스킬은 페르소나 스킬로 간주하지 않는다."
  },
  "skill3": {
    "name": "프로스트 피어스",
    "element": "빙결",
    "type": "단일피해",
    "sp": 24,
    "cool": 0,
    "description": "해명 괴도 각 속성의 3%만큼 출전 중인 아군 전체의 상응하는 속성 수치가 증가하며 2턴 동안 지속된다. 이후 적 1명에게 공격력의 345.1%/380.5%/366.3%/401.7%에 해당하는 빙결 속성 대미지를 주며, 목표가 보유한 『서리 결정』 1중첩마다 스킬 대미지가 10% 증가하고, 목표의 『서리 결정』이 5중첩에 도달하면 스킬의 크리티컬 확률이 15% 추가로 증가한다."
  },
  "skill_highlight": {
    "name": "블리자드 에지",
    "element": "빙결",
    "cool": 0,
    "description": "시전 조건: 테우르기아 에너지 70포인트\n1명의 적에게 공격력 362.3%/399.4%/384.6%/421.7%의 빙결 속성 대미지를 주고, 2턴 내에 목표의 『서리 결정』을 『혹한 결정』으로 강화한다. 아군이 페르소나 스킬로 『혹한 결정』 상태의 적 공격 시, 키리조 미츠루의 『냉혈의 칼날』이 발동되어 목표에게 공격력 19.5%/21.5%/20.7%/22.7%*『서리 결정』 중첩 수에 해당하는 추가 대미지를 1회 준다."
  },
  "skill_support": {
    "name": "지원 스킬",
    "element": "버프",
    "cool": 0,
    "description": "1명의 적에게 2턴 동안 지속되는 『에너지 표식』을 추가한다. S.E.E.S. 멤버가 해당 적을 처음 공격할 때 자신의 테우르기아 에너지를 35포인트 회복한다. S.E.E.S.가 아닌 멤버는 해당 적을 처음 공격할 때 HIGHLIGHT 에너지를 15%를 회복한다."
  },
  "passive1": {
    "name": "책임",
    "element": "패시브",
    "cool": 0,
    "description": "해명 괴도의 초기 준비 시간이 4회 행동만큼 감소한다."
  },
  "passive2": {
    "name": "질서",
    "element": "패시브",
    "cool": 0,
    "description": "키리조 미츠루가 필드에 있으면 모든 반항 또는 지배 캐릭터가 『서리 결정』을 보유한 적 공격 시 『서리 결정』 중첩 수*4.8%의 대미지 증가를 획득한다."
  }
};
window.enCharacterSkillsData["미츠루"] = {
  "name": "Mitsuru Kirijo",
  "skill1": {
    "name": "Ice Blossom",
    "element": "빙결",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Ice damage to 1 foe equal to 211.2%/232.8%/224.2%/245.8% of Attack, and inflict 3 [Frost] stacks on target. Decrease target's Defense by 1.2% for every 300 Attack * [Frost] stacks (up to 2928/3228/3108/3408 Attack) for 2 turns."
  },
  "skill2": {
    "name": "Arctic Storm",
    "element": "버프",
    "type": "단일피해",
    "sp": 0,
    "description": "Inflict 1 foe with [Queen's Gaze]. Decrease DEF by 7.8%/8.6%/8.3%/9.1%, also decrease Defense by 3.2% for every 300 Attack (up to 2928/3228/3108/3408 Attack) and increase damage taken by 2% for every every 300 Attack (up to 2928/3228/3108/3408 Attack). This effect is permanent. Only 1 [Queen's Gaze] can be active. When selecting a new target, pass [Queen's Gaze] to the new target. When the target with [Queen's Gaze] is defeated, pass [Queen's Gaze] to the highest HP foe. When passing [Queen's Gaze], pass all debuffs inflicted by Mitsuru. Mitsuru can use other skills, this doesn't count as a Persona skill."
  },
  "skill3": {
    "name": "Glacial Lunge",
    "element": "빙결",
    "type": "단일피해",
    "sp": 24,
    "cool": 0,
    "description": "Increase party's stats by 3% of Elucidator's stats for 2 turns. Deal Ice damage to 1 foe equal to 345.1%/380.5%/366.3%/401.7% of Attack, for every 1 [Frost] stack, increase skill damage by 10%. When target have 5 [Frost] stacks, increase skill critical rate by 15%."
  },
  "skill_highlight": {
    "name": "Theurgy - Blizzard Edge",
    "element": "빙결",
    "type": "단일피해",
    "description": "Use condition: When Mitsuru has 70 Theurgy Energy.\nDeal Ice damage to 1 foe equal to 362.3%/399.4%/384.6%/421.7% of Attack. Upgrade target's [Frost] to [Rime] for 2 turns. When allies use a Persona skill to attack foes with [Rime], activate [Cruel Edge].\n\n[Cruel Edge]: Deal damage to 1 foe equal to [Frost] stacks * 19.5%/21.5%/20.7%/22.7% of Attack. This damage will perfectly replicate all combat stats of the activator (Attack, damage, critical rate, critical damage, pierce rate), skill attribute is identical to the activator's attack skill."
  },
  "skill_support": {
    "name": "Assist Skill",
    "element": "버프",
    "type": "버프",
    "description": "Inflict 1 foe with [Energy Mark]. When S.E.E.S. member attack that foe for the first time, restore 35 Theurgy Energy to that member; When non S.E.E.S. member attack that foe for the first time, restore 15% HIGHLIGHT Energy."
  },
  "passive1": {
    "name": "Responsibility",
    "element": "패시브",
    "description": "At the start of battle, decrease Elucidator's cooldown time by 4 turns."
  },
  "passive2": {
    "name": "Order",
    "element": "패시브",
    "description": "When Mitsuru is on the field, all Assassin/Sweeper increase damage by 4.8% per [Frost] stacks when attacking foes with [Frost]."
  }
};
window.jpCharacterSkillsData["미츠루"] = {
  "name": "桐条 美鶴",
  "skill1": {
    "name": "絢爛氷華",
    "element": "빙결",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "敵単体に攻撃力の211.2%/232.8%/224.2%/245.8%の氷結属性ダメージを与え、さらに『霜結』を3層付与する。対象の防御力を低下させる（桐条美鶴の攻撃力300につき、防御力を1.2%×『霜結』層数分低下、最大2928/3228/3108/3408攻撃力まで計算）。効果は2ターン持続。"
  },
  "skill2": {
    "name": "極寒の嵐",
    "element": "버프",
    "type": "버프",
    "sp": 0,
    "cool": 0,
    "description": "敵1体を『女王の凝視』状態にし、防御力を7.8%/8.6%/8.3%/9.1%低下させる（桐条美鶴の攻撃力300につき追加で3.2%低下、最大2928/3228/3108/3408攻撃力まで計算）。さらに被ダメージが上昇する（攻撃力300につき2%上昇、同上限まで）。効果はバトル中永続。『女王の凝視』は全体で1体のみ有効で、新しい対象に使用した場合、効果が転移する。対象が戦闘不能になった場合、場上のHPが最も高い敵に自動転移する。『女王の凝視』が転移する時、桐条美鶴が付与した異常効果も全て転移する。このスキル使用後も他のスキルを使用可能であり、ペルソナスキルとは見なされない。"
  },
  "skill3": {
    "name": "氷の舞刺撃",
    "element": "빙결",
    "type": "단일피해",
    "sp": 24,
    "cool": 0,
    "description": "解明系怪盗の各属性値の3%分、味方全体の対応属性値を2ターンの間上昇させる。その後、敵1体に攻撃力345.1%/380.5%/366.3%/401.7%の氷結属性ダメージを与える。対象の『霜結』1層ごとにスキルダメージが10%上昇し、『霜結』が5層に達すると、さらにクリティカル率が15%上昇する。"
  },
  "skill_highlight": {
    "name": "テウルギア：ブリザードブレード",
    "element": "빙결",
    "type": "단일피해",
    "description": "発動条件：神通法エネルギー70点\n敵1体に攻撃力362.3%/399.4%/384.6%/421.7%の氷結属性ダメージを与え、2ターンの間『霜結』を『寒霜結』に強化する。味方がペルソナスキルで『寒霜結』状態の敵を攻撃した時、『冷血の刃』を発動し、対象に『霜結』層数×19.5%/21.5%/20.7%/22.7%の追加ダメージを与える。"
  },
  "skill_support": {
    "name": "サポートスキル",
    "element": "버프",
    "type": "버프",
    "description": "敵1体に2ターン持続する『エナジーマーク』を付与する。各S.E.E.S.メンバーがその敵を初めて攻撃した時、自身の神通法エネルギーを35回復する。各S.E.E.S.以外のメンバーがその敵を初めて攻撃した時、ハイライトゲージを15%回復する。"
  },
  "passive1": {
    "name": "責任",
    "element": "패시브",
    "description": "解明系怪盗の初期準備時間を4行動分短縮する。"
  },
  "passive2": {
    "name": "秩序",
    "element": "패시브",
    "description": "桐条美鶴が戦場にいる時、反抗または支配タイプのキャラクターが『霜結』状態の敵を攻撃すると、『霜結』層数×4.8%分のダメージ増加効果を得る。"
  }
};
