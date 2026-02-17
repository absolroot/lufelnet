window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["후타바"] = {
  "name": "사쿠라 후타바",
  "skill1": {
    "name": "소리 없는 침습",
    "element": "버프광역",
    "type": "디버프",
    "cool": 0,
    "description": "모든 적의 방어력이 6%+(사쿠라 후타바의 공격력 100포인트마다 방어력 추가 0.53% 감소, 최대 4600/5060/5980/6440포인트 공격력 계산)만큼 감소하며 3턴 동안 지속된다. 기간 동안 적이 약점 대미지를 받을 때 해당 효과는 2배로 증가한다. 자신의 분석 진도가 100%에 도달하면 아군 전체에게 『해킹 완료』를 추가하며 2턴 동안 지속된다."
  },
  "skill2": {
    "name": "데이터 해독",
    "element": "버프",
    "type": "디버프",
    "cool": 4,
    "description": "3턴 동안 적 1명이 받는 대미지를 6%+(사쿠라 후타바의 공격력 100포인트마다 목표가 받는 대미지 0.57% 추가 증가, 최대 공격력 4600/5060/5980/6440포인트까지 계산) 증가시킨다. 효과가 지속되는 동안 아군 괴도가 페르소나 스킬/추가 효과/HIGHLIGHT/테우르기아로 목표에게 대미지를 주면, 사쿠라 후타바가 분석 진도 20%를 획득한다. 2턴 동안 자신의 분석 진도가 100%일 때 아군 전체에게 『해킹 완료』를 추가한다."
  },
  "skill3": {
    "name": "불사조의 이름으로",
    "element": "버프",
    "type": "버프",
    "cool": 8,
    "unlock": "아군 캐릭터가 『해킹 완료』 보유.",
    "description": "해제 조건: 아군 캐릭터가 『해킹 완료』 보유\n아군 괴도 1명의 공격력이 270/297/302/329+(사쿠라 후타바의 공격력 100포인트마다 공격력 추가 21.7 증가, 최대 4600/5060/5980/6440포인트 공격력 계산) 증가하며 2턴 동안 지속된다. 전체 적에게 해당 괴도 적합성의 『교란 바이러스』를 추가하며 1턴 동안 지속된다.\n『교란 바이러스』: 목표의 적합성 속성을 변경한다. 무효, 반사, 흡수일 경우 내성으로, 내성일 경우 일반으로, 일반일 경우 약점으로 변경된다. 약점일 경우 목표가 받는 약점 대미지가 25% 증가한다."
  },
  "skill_highlight": {
    "name": "속성 증가",
    "element": "패시브",
    "description": "해명 괴도 각 속성의 20%만큼 출전 중인 모든 동료의 상응한 속성 수치가 증가한다."
  },
  "passive1": {
    "name": "장난기",
    "element": "패시브",
    "description": "전투 시작 시 100%의 분석 진도를 획득한다.",
    "cool": 0
  },
  "passive2": {
    "name": "뒷수습",
    "element": "패시브",
    "description": "『해킹 완료』 상태에서 3턴 동안 모든 괴도는 사쿠라 후타바 공격력 30.0%의 실드를 획득한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["후타바"] = {
  "name": "Futaba Sakura",
  "skill1": {
    "name": "Pentest Complete!",
    "element": "버프",
    "type": "버프",
    "cool": 0,
    "description": "For 3 turns, decrease all foes' Defense by 6%; decrease Defense by 0.53% more for every 100 points of Futaba's Attack (up to 4600/5060/5980/6440 of Attack). When foes with this Defense decrease take weakness damage, multiply the effect by 2.\nIf Futaba's Analysis Progress is at 100%, also grant Data Storm to all allies for 2 turns."
  },
  "skill2": {
    "name": "Vulnerability Found!",
    "element": "버프",
    "type": "버프",
    "cool": 0,
    "description": "For 3 turns, increase 1 foe's damage taken by 6%; increase damage taken by 0.57% more for every 100 points of Futaba's Attack (up to 4600/5060/5980/6440 of Attack).\nWhen an ally deals damage with a skill, Resonance, or Highlight to foes inflicted with this effect, gain 20% Analysis Progress.\nIf Futaba's Analysis Progress is at 100%, also grant Data Storm to all allies for 2 turns."
  },
  "skill3": {
    "name": "Data Link Established!",
    "element": "버프",
    "type": "버프",
    "cool": 0,
    "unlock": "Ally must have 『Hack Complete』.",
    "description": "Usable when allies have Data Storm. For 2 turns, increase 1 ally's Attack by 270/297/302/329; increase Attack by 21.7 more for every 100 points of Futaba's Attack (up to 4600/5060/5980/6440 of Attack).\nInflict Virus on all foes for 1 turn, based on the targeted ally's attribute.\nVirus: Change affinities of the foe this is inflicted upon. (Null, Repel, and Drain become Resist. Resist becomes Normal. Normal becomes Weak. Weak attributes take 25% more weakness damage.)"
  },
  "skill_highlight": {
    "name": "Stat Buff",
    "element": "패시브",
    "description": "Increase all allies' stats by 20% of Oracle's stats."
  },
  "passive1": {
    "name": "Programming Pro",
    "element": "패시브",
    "description": "At the start of battle, Futaba gains 100% to her Analysis Progress.",
    "cool": 0
  },
  "passive2": {
    "name": "Rootkit",
    "element": "패시브",
    "description": "When Data Storm is active, grant all allies a shield equal to 30.0% of Futaba's Attack for 3 turns.",
    "cool": 0
  }
};
window.jpCharacterSkillsData["후타바"] = {
  "name": "佐倉 双葉",
  "skill1": {
    "name": "セキュリティバイバイ",
    "element": "버프광역",
    "type": "디버프",
    "cool": 0,
    "description": "３ターンの間、敵全体の防御力を６%低下させ、さらに双葉の攻撃力１００ごとに追加で防御力を０.５３%低下させる（最大で攻撃力4600/5060/5980/6440分まで）。この防御力低下効果中の敵が弱点ダメージを受ける時、効果が２倍になる。\nまた双葉の『解析進捗』が１００%の場合、２ターンの間、味方全体に『データ掌握』を付与する。"
  },
  "skill2": {
    "name": "脆弱性みーっけ！",
    "element": "버프",
    "type": "디버프",
    "cool": 0,
    "description": "３ターンの間、敵単体の被ダメージを６%上昇させ、さらに双葉の攻撃力１００ごとに追加で被ダメージを０.５７%上昇させる（最大で攻撃力4600/5060/5980/6440分まで）。\nこの効果中の敵に、味方がスキル／意識奏功／ハイライトでダメージを与えた時、『解析進捗』を２０%獲得する。\nまた双葉の『解析進捗』が１００%の場合、２ターンの間、味方全体に『データ掌握』を付与する。"
  },
  "skill3": {
    "name": "データリンク開始！",
    "element": "버프",
    "type": "버프",
    "cool": 0,
    "unlock": "味方が『ハッキング完了』を保有。",
    "description": "味方が『データ掌握』状態の時に使用可能となり、２ターンの間、味方単体の攻撃力を270/297/302/329上昇させる。さらに双葉の攻撃力１００ごとに追加で攻撃力を２１.７上昇させる（最大で攻撃力4600/5060/5980/6440分まで）。\nまた１ターンの間、選択した味方の属性に応じた『ウイルス』を敵全体に付与する。\n『ウイルス』：付与された敵の属性相性が変化する。無効・反射・吸収は耐性。耐性は通常。通常は弱点。弱点は弱点ダメージ＋２５%となる。"
  },
  "skill_highlight": {
    "name": "ステータス強化",
    "element": "패시브",
    "description": "佐倉のステータスの20%分、味方全体のステータスを上昇させる。"
  },
  "passive1": {
    "name": "天才プログラマーの好奇心",
    "element": "패시브",
    "description": "戦闘開始時、双葉は『解析進捗』を100%獲得する。",
    "cool": 0
  },
  "passive2": {
    "name": "ルートキット",
    "element": "패시브",
    "description": "『データ掌握』状態の時、３ターンの間、味方全体に双葉の攻撃力30.0%分のシールドを付与する。",
    "cool": 0
  }
};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.cnCharacterSkillsData["후타바"] = {
  "name": "佐仓双叶",
  "skill1": {
    "name": "无声侵袭",
    "cool": 0,
    "description": "使所有敌人防御力降低6%+(佐仓双叶每有100点攻击力额外使防御力降低0.53%，最多计入4600/5060/5980/6440点攻击力)，持续3回合。效果持续期间，敌人受到弱点伤害时，使上述减防效果翻倍。若自身解析进度为100%，给予我方全体『骇入完成』，持续2回合。",
    "element": "버프광역"
  },
  "skill2": {
    "name": "数据破解",
    "cool": 0,
    "description": "使1名敌人受到伤害增加6%+(佐仓双叶每有100点攻击力额外使目标受到伤害增加0.57%，最多计入4600/5060/5980/6440点攻击力），持续3回合。效果持续期间，友方怪盗使用人格面具技能/追加效果/HIGHLIGHT/神通法对目标造成伤害后，佐仓双叶获得20%解析进度。若自身解析进度为100%，给予我方全体『骇入完成』，持续2回合。",
    "element": "버프"
  },
  "skill3": {
    "name": "以不死鸟的名义",
    "cool": 0,
    "description": "解锁条件：我方角色拥有『骇入完成』\n使1名友方怪盗的攻击力提升270/297/302/329+(佐仓双叶每有100点攻击力，额外提升其21.7攻击力，最多计入4600/5060/5980/6440点攻击力)，持续2回合。为全体敌人添加上该名怪盗适应性的『扰乱病毒』，持续1回合。『扰乱病毒』：改变目标的对应的适应性属性：若为无效、反弹、吸收，则变为耐性；若为耐性则变为普通；若为普通则变为弱点。若为弱点，则提升其25%受到弱点伤害。",
    "element": "버프"
  },
  "passive1": {
    "name": "玩心",
    "element": "패시브",
    "cool": 0,
    "description": "战斗开始时获得100%解析进度。"
  },
  "passive2": {
    "name": "善后",
    "element": "패시브",
    "cool": 0,
    "description": "『骇入完成』状态下，所有怪盗获得佐仓双叶攻击力的30.0%的护盾，持续3回合。"
  },
  "skill_highlight": {
    "element": "패시브"
  }
};
