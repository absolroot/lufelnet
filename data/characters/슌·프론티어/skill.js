window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

window.characterSkillsData["슌·프론티어"] = {
  "skill1": {
    "name": "정의의 총격",
    "element": "총격",
    "type": "광역 피해",
    "cool": 0,
    "description": "임의 적에게 『반드시 크리티컬이 되는』 최대 생명 41.5%/45.7%/44.0%/48.3%의 총격 속성 대미지를 6회 준다. 이 스킬에 피격되지 않은 적을 우선 공격하며, 2턴 동안 각 대미지마다 목표가 받는 대미지를 증가시킨다(대미지 증가 효과는 카노 슌·프론티어의 최대 생명을 기반으로 하며, 최대 19520/21520/20720/22720 최대 생명이 적용되고, 받는 대미지 최대 4.9%/5.4%/5.2%/5.7% 증가, 6회 중첩 가능). 동일한 목표에 대한 후속 공격은 20%의 대미지만 준다."
  },
  "skill2": {
    "name": "결전의 깃발",
    "element": "버프",
    "type": "버프",
    "cool": 0,
    "description": "2턴 동안 아군 전체가 주는 대미지가 증가한다(대미지 증가 효과는 카노 슌·프론티어의 최대 생명을 기반으로 하며, 최대 19520/21520/20720/22720 최대 생명이 적용되고, 주는 대미지 최대 19.5%/21.5%/20.7%/22.7% 증가).\n적 수가 2명 이상일 때, 추가로 2턴 동안 아군 전체가 주는 대미지가 증가한다(대미지 증가 효과는 카노 슌·프론티어의 최대 생명을 기반으로 하며, 최대 19520/21520/20720/22720 최대 생명이 적용되고, 주는 대미지 최대 19.5%/21.5%/20.7%/22.7% 증가).",
    "sp": 23
  },
  "skill3": {
    "name": "어둠을 쫓는 총성",
    "element": "버프",
    "type": "버프",
    "cool": 1,
    "description": "2턴 동안 자신 이외의 메인 목표 동료 1명이 『별빛 엠블럼』을 획득한다. 필드에는 동시에 1개의 『별빛 엠블럼』만 존재할 수 있다.\n아군 전체의 공격력을 증가시키고(공격력 증가 효과는 카노 슌·프론티어의 최대 생명을 기반으로 하며, 최대 19520/21520/20720/22720 최대 생명이 적용되고, 공격력 최대 29.3%/32.3%/31.1%/34.1% 증가), 최대 생명 24.8%/24.8%/26.3%/26.3%+705/858/867/1020 대미지의 실드를 획득한다. 자신은 추가로 최대 생명 24.8%/24.8%/26.3%/26.3%+705/858/867/1020 대미지의 실드를 획득한다. 효과는 2턴 동안 지속된다.",
    "sp": 26
  },
  "passive1": {
    "name": "성위",
    "element": "패시브",
    "cool": 0,
    "description": "실드 효과가 9.0% 증가한다.\n카노 슌·프론티어가 자신에게 추가한 실드 지속 시간 종료 시 실드 잔여량의 500%만큼 생명을 회복한다."
  },
  "passive2": {
    "name": "용맹",
    "element": "패시브",
    "cool": 0,
    "description": "총기 사격으로 대미지를 줄 때, 2턴 동안 목표의 받는 대미지가 24.0% 증가하고 받는 총격 대미지가 추가로 12.0% 증가한다."
  },
  "skill_highlight": {
    "element": "총격",
    "cool": 4,
    "description": "적 전체에 최대 생명 73.2%/80.7%/77.7%/85.2%의 총격 속성 대미지를 주고, 4턴 동안 아군 전체가 주는 대미지가 증가한다(대미지 증가 효과는 카노 슌·프론티어의 최대 생명을 기반으로 하며, 최대 19520/21520/20720/22720 최대 생명이 적용되고, 주는 대미지 최대 34.2%/37.7%/36.3%/39.8% 증가)."
  },
  "name": "카노 슌·프론티어"
};

window.enCharacterSkillsData["슌·프론티어"] = {
  "name": "Gunslinger Shun",
  "skill1": {
    "name": "Gunslinger's Justice",
    "element": "총격광역",
    "type": "광역피해",
    "hp": 8,
    "cool": 0,
    "description": "Deal Gun damage to random foes equal to 41.5%/45.7%/44.0%/48.3% of Gunslinger Shun's max HP (6 hits). This attack is a guaranteed critical. From the second hit, prioritize new targets and change damage to 20% for hits on the same target. For each hit of damage dealt, increase the target's damage taken based on Gunslinger Shun's max HP (up to 19520/21520/20720/22720 of max HP, up to 6.1%/6.7%/6.5%/7.1%) for 2 turns. Stacks up to 6 times."
  },
  "skill2": {
    "name": "Flag of Battle",
    "element": "버프",
    "type": "보조",
    "sp": 23,
    "cool": 0,
    "description": "Increase party's damage dealt based on Gunslinger Shun's max HP (up to 19520/21520/20720/22720 of max HP, up to 24.4%/26.9%/25.9%/28.4%). Lasts for 2 turns. If there are 2 or more foes, increase party's damage dealt more based on Gunslinger Shun's max HP (up to 19520/21520/20720/22720 of max HP, up to 24.4%/26.9%/25.9%/28.4%). Lasts for 2 turns."
  },
  "skill3": {
    "name": "Shot in the Dark",
    "element": "버프",
    "type": "보조",
    "sp": 26,
    "cool": 1,
    "description": "Grant 1 Deputy's Badge to 1 selected ally besides Gunslinger Shun for 2 turns. Multiple allies cannot have Deputy's Badge at the same time.\nIncrease party's Attack based on Gunslinger Shun's max HP (up to 19520/21520/20720/22720 of max HP, up to 36.6%/40.4%/38.8%/42.6%) for 2 turns, and grant a shield equal to 24.8%/24.8%/26.3%/26.3% of Gunslinger Shun's max HP + 705/858/867/1020. Also grant Gunslinger Shun a shield equal to 24.8%/24.8%/26.3%/26.3% of max HP + 705/858/867/1020 for 2 turns."
  },
  "skill_highlight": {
    "element": "총격광역",
    "type": "광역피해",
    "cool": 4,
    "description": "Deal Gun damage to all foes equal to 73.2%/80.7%/77.7%/85.2% of Gunslinger Shun's max HP. Increase party's damage dealt based on Gunslinger Shun's max HP (up to 19520/21520/20720/22720 of max HP, up to 34.2%/37.7%/36.3%/39.8%) for 4 turns."
  },
  "passive1": {
    "name": "Indomitable Perseverance",
    "element": "패시브",
    "description": "Increase shield by 9.0%. When the shield effect on Gunslinger Shun ends, restore HP equal to 500% of the remaining shield.",
    "cool": 0
  },
  "passive2": {
    "name": "Daredevil",
    "element": "패시브",
    "description": "When dealing damage with a ranged attack, increase the target's damage taken by 24.0%, and also increase ranged attack damage taken by 12.0% for 2 turns.",
    "cool": 0
  }
};

window.jpCharacterSkillsData["슌·프론티어"] = {
  "name": "駿・生命欲の暴走",
  "skill1": {
    "name": "決闘のテリトリー",
    "element": "총격광역",
    "type": "광역피해",
    "hp": 8,
    "cool": 0,
    "description": "敵に最大ＨＰ41.5%/45.7%/44.0%/48.3%の銃撃属性ダメージを６回与える。この攻撃は必ずクリティカルが発生する。２回目以降の攻撃は新たな対象が優先され、同一の対象に命中した時、与ダメージが２０%になる。ダメージを与えるごとに、２ターンの間、対象の被ダメージが自身の最大ＨＰに応じて上昇する（最大ＨＰ19520/21520/20720/22720まで参照し、最大6.1%/6.7%/6.5%/7.1%まで）し、最大６つまで累積できる。"
  },
  "skill2": {
    "name": "デュエルフラッグ",
    "element": "버프",
    "type": "보조",
    "sp": 23,
    "cool": 0,
    "description": "２ターンの間、味方全体の与ダメージが駿・生命欲の暴走の最大ＨＰに応じて上昇する（最大ＨＰ19520/21520/20720/22720まで参照し、最大24.4%/26.9%/25.9%/28.4%まで）。敵が２体以上の時、追加で２ターンの間、味方全体の与ダメージが駿・生命欲の暴走の最大ＨＰに応じて上昇する（最大ＨＰ19520/21520/20720/22720まで参照し、最大24.4%/26.9%/25.9%/28.4%まで）。"
  },
  "skill3": {
    "name": "闇を払う銃声",
    "element": "버프",
    "type": "보조",
    "sp": 26,
    "cool": 1,
    "description": "２ターンの間、自身以外の選択した味方単体に『生命欲の守護』を付与する。複数の味方を同時に『生命欲の守護』状態にすることはできない。\n２ターンの間、味方全体の攻撃力が自身の最大ＨＰに応じて上昇し（最大ＨＰ19520/21520/20720/22720まで参照し、最大36.6%/40.4%/38.8%/42.6%まで）、最大ＨＰ24.8%/24.8%/26.3%/26.3%＋705/858/867/1020分のシールドを付与する。自身には追加で２ターンの間、最大ＨＰ24.8%/24.8%/26.3%/26.3%＋705/858/867/1020分のシールドを付与する。"
  },
  "skill_highlight": {
    "element": "총격광역",
    "type": "광역피해",
    "cool": 4,
    "description": "敵全体に最大ＨＰ73.2%/80.7%/77.7%/85.2%の銃撃属性ダメージを与え、４ターンの間、味方全体の与ダメージが自身の最大ＨＰに応じて上昇する（最大ＨＰ19520/21520/20720/22720まで参照し、最大34.2%/37.7%/36.3%/39.8%まで）。"
  },
  "passive1": {
    "name": "堅忍不抜",
    "element": "패시브",
    "description": "シールド量が9.0%上昇する。自身に付与したシールドの効果が終了した時、残っていたシールド量の５００%分ＨＰを回復する。",
    "cool": 0
  },
  "passive2": {
    "name": "勇猛果敢",
    "element": "패시브",
    "description": "遠隔攻撃でダメージを与えた時、２ターンの間、対象の被ダメージが24.0%上昇し、さらに遠隔攻撃の被ダメージが12.0%上昇する。",
    "cool": 0
  }
};

window.cnCharacterSkillsData["슌·프론티어"] = {
  "skill1": {
    "name": "正义枪击",
    "element": "총격",
    "type": "群体伤害",
    "cool": 0,
    "description": "对随机敌人造成6次『必定暴击』的41.5%/45.7%/44.0%/48.3%最大生命值的射击属性伤害，优先攻击未受到该技能攻击的敌人，每次伤害使目标受到伤害提升（伤害提升效果基于加纳骏·拓荒的最大生命值，最多计入19520/21520/20720/22720最大生命值，使受到伤害最多提升4.9%/5.4%/5.2%/5.7%），持续2回合，可叠加6层。对同一目标的后续攻击只会造成20%伤害。"
  },
  "skill2": {
    "name": "决战的旗帜",
    "element": "버프",
    "type": "增益",
    "cool": 0,
    "description": "使所有同伴造成伤害提升（伤害提升效果基于加纳骏·拓荒的最大生命值，最多计入19520/21520/20720/22720最大生命值，使造成伤害最多提升19.5%/21.5%/20.7%/22.7%），持续2回合。\n若敌人数量≥2时，额外使所有同伴造成伤害提升（伤害提升效果基于加纳骏·拓荒的最大生命值，最多计入19520/21520/20720/22720最大生命值，使造成伤害最多提升19.5%/21.5%/20.7%/22.7%），持续2回合。",
    "sp": 23
  },
  "skill3": {
    "name": "驱散黑暗的枪声",
    "element": "버프",
    "type": "增益",
    "cool": 1,
    "description": "使除自身以外的1名主目标同伴获得『锡星徽记』，持续2回合，场上同时只能存在1个『锡星徽记』。\n使所有同伴攻击力提升（攻击力提升效果基于加纳骏·拓荒的最大生命值，最多计入19520/21520/20720/22720最大生命值，使攻击力最多提升29.3%/32.3%/31.1%/34.1%），并获得24.8%/24.8%/26.3%/26.3%最大生命值+705/858/867/1020伤害的护盾，自身额外获得24.8%/24.8%/26.3%/26.3%最大生命值+705/858/867/1020伤害的护盾，持续2回合。",
    "sp": 26
  },
  "passive1": {
    "name": "戍卫",
    "element": "패시브",
    "cool": 0,
    "description": "护盾效果提升9.0%。\n加纳骏·拓荒为自身添加的护盾持续时间结束后，根据护盾的剩余值的500%恢复生命值。"
  },
  "passive2": {
    "name": "骁勇",
    "element": "패시브",
    "cool": 0,
    "description": "枪械射击造成伤害时，使目标受到的伤害提升24.0%，受到的枪械伤害额外提升12.0%，持续2回合。"
  },
  "skill_highlight": {
    "element": "총격",
    "cool": 4,
    "description": "对所有敌人造成73.2%/80.7%/77.7%/85.2%最大生命值的射击属性伤害，使所有同伴造成伤害提升（伤害提升效果基于加纳骏·拓荒的最大生命值，最多计入19520/21520/20720/22720最大生命值，使造成伤害最多提升34.2%/37.7%/36.3%/39.8%），持续4回合。",
    "name": "HIGHLIGHT",
    "type": "群体伤害"
  },
  "name": "加纳骏·拓荒"
};

