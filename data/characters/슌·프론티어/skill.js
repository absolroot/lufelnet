window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["슌·프론티어"] = {
    "name": "카노 슌·프론티어",
    "skill1": {
      "name": "정의의 사격",
      "element": "총격광역",
      "type": "광역피해",
      "hp": 8,
      "cool": 0,
      "description": "무작위 적에게 6회에 걸쳐 『확정 크리티컬』로 최대 생명의 41.5%/45.7%/44.0%/48.3%에 해당하는 총격 속성 대미지를 준다. 가능한 한 아직 이 스킬의 공격을 받지 않은 적을 우선하여 공격한다.\n매 타격마다 대상이 받는 대미지가 최대 4.9%/5.4%/5.2%/5.7% 증가하며(카노 슌·프론티어의 최대 생명력 19520/21520/20720/22720까지 계산), 2턴 동안 지속되고 최대 6중첩까지 가능하다.\n같은 대상에게 가해지는 후속 공격은 20%의 대미지만을 준다."
    },
    "skill2": {
      "name": "결전의 깃발",
      "element": "버프",
      "type": "보조",
      "sp": 23,
      "cool": 0,
      "description": "모든 아군이 주는 대미지가 최대 19.5%/21.5%/20.7%/22.7% 증가한다(카노 슌·프론티어의 최대 생명 19520/21520/20720/22720까지 계산). 효과는 2턴 동안 지속된다.\n적 수가 2명 이상일 경우, 추가로 모든 아군의 주는 대미지가 같은 수치만큼 2턴 동안 다시 증가한다."
    },
    "skill3": {
      "name": "어둠을 꿰뚫는 총성",
      "element": "버프",
      "type": "보조",
      "sp": 26,
      "cool": 1,
      "description": "자신을 제외한 아군 1명에게 2턴 동안 『주석성 휘장』을 부여하며, 전장에는 동시에 『주석성 휘장』이 1개만 존재할 수 있다.\n모든 아군의 공격력을 최대 29.3%/32.3%/31.1%/34.1% 증가시키고(카노 슌·프론티어의 최대 생명은 19520/21520/20720/22720까지 계산), 최대 생명의 24.8%/24.8%/26.3%/26.3% + 705/858/867/1020에 해당하는 피해를 흡수하는 실드를 부여한다.\n자신은 동일한 수치의 실드를 추가로 얻으며, 효과는 2턴 동안 지속된다."
    },
    "skill_highlight": {
      "element": "총격광역",
      "type": "광역피해",
      "cool": 4,
      "description": "모든 적에게 최대 HP 73.2%/80.7%/77.7%/85.2%의 총격 속성 대미지를 주고, 모든 아군이 주는 대미지가 최대 34.2%/37.7%/36.3%/39.8% 증가한다(카노 슌·프론티어의 최대 생명은 19520/21520/20720/22720까지 계산). 효과는 4턴 동안 지속된다."
    },
    "passive1": {
      "name": "수호",
      "element": "패시브",
      "description": "실드 효과가 9.0% 증가한다.\n카노 슌·프론티어가 자신에게 부여한 실드의 지속 시간이 종료될 때, 남은 실드 수치의 500%에 해당하는 HP를 회복한다."
    },
    "passive2": {
      "name": "용맹",
      "element": "패시브",
      "description": "총격 공격으로 피해를 줄 때마다 대상이 받는 모든 피해가 24.0% 증가하고, 받는 총격 속성 피해가 추가로 12.0% 증가한다. 효과는 2턴 동안 지속된다."
    }  
};
window.enCharacterSkillsData["슌·프론티어"] = {
  "name": "Shun Kano·Pioneer",

  "skill1": {
    "name": "Justice Shot",
    "element": "총격광역",
    "type": "광역피해",
    "hp": 8,
    "cool": 0,
    "description": "Deal Gun damage to random foes equal to 41.5%/45.7%/44.0%/48.3% of Shun's max HP (6 hits), this is guaranteed to be a critical hit. Each hit increases target's damage taken for 2 turns (based on Shun's max HP, up to 4.9%/5.4%/5.2%/5.7% at 19520/21520/20720/22720 max HP). Prioritze new targets and change damage to 20% for hits on the same target."
  },
  "skill2": {
    "name": "High Noon Flag",
    "element": "버프",
    "type": "보조",
    "sp": 23,
    "cool": 0,
    "description": "Increase party's damage for 2 turns (based on Shun's max HP, up to 19.5%/21.5%/20.7%/22.7% at 19520/21520/20720/22720 max HP). If there are 2 or more foes, additonally increase party's damage for 2 turns (based on Shun's max HP, up to 19.5%/21.5%/20.7%/22.7% at 19520/21520/20720/22720 max HP)."
  },
  "skill3": {
    "name": "Daybreak Shot",
    "element": "버프",
    "type": "보조",
    "sp": 26,
    "cool": 1,
    "description": "Grant 1 ally (other than Shun) [Sheriff Badge] for 2 turns. Only 1 ally can have [Sheriff Badge] at a time.\nIncrease party's Attack (based on Shun's max HP, up to 29.3%/32.3%/31.1%/34.1% at 19520/21520/20720/22720 max HP). Also grant a shield to party equal to 24.8%/24.8%/26.3%/26.3% of Shun's max HP + 705/858/867/1020 and grant Shun a bonus shield equal to 24.8%/24.8%/26.3%/26.3% of Shun's max HP + 705/858/867/1020 for 2 turns."
  },
  "skill_highlight": {
    "element": "총격광역",
    "type": "광역피해",
    "cool": 4,
    "description": "Deal Gun damage to all foes equal to 73.2%/80.7%/77.7%/85.2% of Shun's max HP. Increase party's damage for 4 turns (based on Shun's max HP, up to 34.2%/37.7%/36.3%/39.8% at 19520/21520/20720/22720 max HP)."
  },
  "passive1": {
    "name": "Sentry",
    "element": "패시브",
    "description": "Increase shield by 9.0%.\nAfter a shield Shun granted to himself ends, restore Shun's HP by 500% of remaining shield."
  },
  "passive2": {
    "name": "Valor",
    "element": "패시브",
    "description": "When dealing damage with a Ranged Attack, increase target's damage taken by 24.0% and Gun damage taken by 12.0% for 2 turns."
  }
};

window.jpCharacterSkillsData["슌·프론티어"] = {
  "name": "加納 駿・フロンティア",

  "skill1": {
    "name": "正義の銃撃",
    "element": "총격광역",
    "type": "광역피해",
    "hp": 8,
    "cool": 0,
    "description": "ランダムな敵に対して、最大HPの41.5%/45.7%/44.0%/48.3%に相当する『確定クリティカル』の銃撃ダメージを6回与える。可能な限り、このスキルでまだ攻撃されていない敵を優先して狙う。\n各ヒットは、対象の被ダメージを最大4.9%/5.4%/5.2%/5.7%増加させる（加納 駿・フロンティアの最大HP19520/21520/20720/22720まで計算）。効果は2ターン持続し、最大6スタックまで累積可能。\n同じ敵への後続ヒットは20%のダメージしか与えない。"
  },

  "skill2": {
    "name": "決戦の旗",
    "element": "버프",
    "type": "보조",
    "sp": 23,
    "cool": 0,
    "description": "味方全体の与ダメージを最大19.5%/21.5%/20.7%/22.7%増加させる（加納 駿・フロンティアの最大HP19520/21520/20720/22720まで計算）。効果は2ターン持続。\n敵が2体以上の場合、同じ与ダメージ増加効果が追加で2ターン付与される。"
  },

  "skill3": {
    "name": "闇を貫く銃声",
    "element": "버프",
    "type": "보조",
    "sp": 26,
    "cool": 1,
    "description": "自分以外の味方1名に『錫星の徽章』を2ターン付与する。戦場には同時に1つの『錫星の徽章』しか存在できない。\n味方全体の攻撃力を最大29.3%/32.3%/31.1%/34.1%増加させ（加納 駿・フロンティアの最大HP19520/21520/20720/22720まで計算）、最大HPの24.8%/24.8%/26.3%/26.3% + 705/858/867/1020に相当するシールドを付与する。\n加納 駿・フロンティア自身は同量のシールドを追加で獲得する。効果は2ターン持続。"
  },

  "skill_highlight": {
    "element": "총격광역",
    "type": "광역피해",
    "cool": 4,
    "description": "全ての敵に最大HPの73.2%/80.7%/77.7%/85.2%の銃撃ダメージを与え、味方全体の与ダメージを最大34.2%/37.7%/36.3%/39.8%増加させる（加納 駿・フロンティアの最大HP19520/21520/20720/22720まで計算）。効果は4ターン持続。"
  },

  "passive1": {
    "name": "守護",
    "element": "패시브",
    "description": "シールド効果量が9.0%上昇する。\n加納 駿・フロンティアが自身に付与したシールドが消失すると、その残量の500%に相当するHPを回復する。"
  },

  "passive2": {
    "name": "勇猛",
    "element": "패시브",
    "description": "銃撃でダメージを与えると、対象の被ダメージが24.0%増加し、さらに被銃撃ダメージが12.0%増加する。効果は2ターン持続。"
  }
};

