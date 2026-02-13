window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["YUI"] = {
  "skill1": {
    "name": "타닥 깜짝상자",
    "element": "전격",
    "type": "단일 피해",
    "sp": 20,
    "cool": 0,
    "description": "1명의 적에게 공격력 185.4%/204.4%/196.8%/215.8%의 전격 속성 대미지를 준다. 적이 감전 상태가 아닐 시 2턴 동안 68.3%/68.3%/72.5%/72.5%의 기본 확률로 감전 상태에 빠뜨린다. 적이 이미 감전 상태일 경우, 스킬 대미지가 30% 증가한다."
  },
  "skill2": {
    "name": "폭발 벽돌",
    "element": "전격",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "적 전체에 공격력 59.6%/65.7%/63.3%/69.4%의 전격 속성 대미지를 주고, 스킬 메인 목표에게 주는 스킬 대미지가 25% 증가한다."
  },
  "skill3": {
    "name": "초희귀 보상",
    "element": "버프",
    "type": "버프",
    "sp": 25,
    "cool": 1,
    "description": "자신의 공격력이 39.0%/43.0%/41.4%/45.4% 증가한다. 동료 1명을 YUI의 『놀이 친구』로 선택하며, 『놀이 친구』가 적에게 페르소나 스킬로 대미지를 주면 YUI가 바로 추격한다. 또한 YUI 다음 2회 추격은 공격력 132.9%/146.6%/141.1%/154.7%의 전격 속성 대미지를 주며 2턴 동안 지속된다. 동시에 『★프로젝트! 가동★』이 발동하는 고정 확률이 2턴 동안 10% 증가한다."
  },
  "passive1": {
    "name": "역동",
    "element": "패시브",
    "cool": 0,
    "description": "YUI의 추격이 감전 상태인 적에게 주는 대미지가 36.0% 증가한다."
  },
  "passive2": {
    "name": "반짝",
    "element": "패시브",
    "cool": 0,
    "description": "『놀이 친구』가 있을 때, YUI와 놀이 친구의 크리티컬 확률이 12.0% 증가하고, 공격력이 12.0% 증가한다."
  },
  "skill_highlight": {
    "element": "버프",
    "cool": 4,
    "description": "YUI의 공격력이 34.2%/37.7%/36.3%/39.8% 증가하고, 추격으로 주는 대미지가 YUI 공격력의 24.4%/26.9%/25.9%/28.4%까지 증가한다. 효과는 2턴 동안 지속된다. 또한 임의의 동료가 스킬을 시전해 대미지를 주면 YUI의 추격이 발동하며 2턴 동안 지속된다."
  },
  "name": "YUI"
};
window.enCharacterSkillsData["YUI"] = {
  "name": "YUI",
  "skill1": {
    "name": "Electric Bomb",
    "element": "전격",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Electric damage to 1 foe equal to 185.4%/204.4%/196.8%/215.8%of Attack. If the foe is not Shocked, there is a 68.3%/68.3%/72.5%/72.5% chance to inflict Shock for 2 turns. If the foe is already Shocked, increase damage by 30%."
  },
  "skill2": {
    "name": "Meta Dynamite",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "Deal Electric damage to all foes equal to 59.6%/65.7%/63.3%/69.4% of Attack. Increase damage to the main target by 25%."
  },
  "skill3": {
    "name": "Sparky Surprise",
    "element": "버프",
    "type": "버프",
    "sp": 25,
    "cool": 1,
    "description": "Grant Player 2 to 1 ally for 2 turns, and increase YUI's Attack by 39.0%/43.0%/41.4%/45.4%.\nFor 2 turns, when an ally with Player 2 deals damage to a foe with a skill, perform a follow-up attack, dealing Electric damage equal to 132.9%/137.2%/141.1%/145.4% of Attack (max 2 times).\nIncrease chance to activate Jolly Cooperation by 10% for 2 turns."
  },
  "skill_highlight": {
    "element": "버프",
    "type": "버프",
    "description": "Increase Attack by 34.2%/37.7%/36.3%/39.8% and increase follow-up attack damage by 24.4%/25.9%/25.9%/27.4%  of Attack for 2 turns.\nActivate follow-up attacks after allies deal damage with skills for 2 turns."
  },
  "passive1": {
    "name": "Virtual Landowner",
    "element": "패시브",
    "description": "Increase follow-up damage to Shocked foes by 36.0%."
  },
  "passive2": {
    "name": "Let's Go Together",
    "element": "패시브",
    "description": "When an ally has Player 2, increase that ally and YUI's critical rate by 12.0% and Attack by 12.0%."
  }
};
window.jpCharacterSkillsData["YUI"] = {
  "name": "YUI",
  "skill1": {
    "name": "エレクトリックボム",
    "element": "전격",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "敵単体に攻撃力185.4%/204.4%/196.8%/215.8%の電撃属性ダメージを与える。敵が感電状態でない時、2ターンの間、68.3%/68.3%/72.5%/72.5%の確率で感電状態にし、敵が感電状態の時は、与ダメージが30%上昇する。"
  },
  "skill2": {
    "name": "メタダイナマイト",
    "element": "전격광역",
    "type": "광역피해",
    "sp": 20,
    "cool": 0,
    "description": "敵全体に攻撃力59.6%/65.7%/63.3%/69.4%の電撃属性ダメージを与える。その際、選択した敵への与ダメージが25%上昇する。"
  },
  "skill3": {
    "name": "サプライズプレゼント",
    "element": "버프",
    "type": "버프",
    "sp": 25,
    "cool": 1,
    "description": "味方単体を2ターンの間、『お友達』状態にし、ＹＵＩの攻撃力が39.0%/43.0%/41.4%/45.4%上昇する。\nさらに2ターンの間、『お友達』状態の味方が、スキルで敵にダメージを与えた時に追撃し、その追撃ダメージが2回まで攻撃力132.9%/137.2%/141.1%/145.4%の電撃属性ダメージになる。\n加えて2ターンの間、『プロジェクト『Ｂ』、ＳＴＡＲＴ！』の発動確率が10%上昇する。"
  },
  "skill_highlight": {
    "element": "버프",
    "type": "버프",
    "description": "2ターンの間、自身の攻撃力が34.2%/37.7%/36.3%/39.8%上昇し、追撃のダメージが攻撃力の24.4%/25.9%/25.9%/27.4%分上昇する。\nさらに2ターンの間、味方がスキルで敵にダメージを与えた時、追撃が発生する。"
  },
  "passive1": {
    "name": "バーチャル大地主",
    "element": "패시브",
    "description": "感電状態の敵への追撃によるダメージが36.0%上昇する。"
  },
  "passive2": {
    "name": "さあ、ご一緒に！",
    "element": "패시브",
    "description": "味方が『お友達』状態の時、ＹＵＩとその味方のクリティカル率が12.0%上昇し、攻撃力が12.0%上昇する。"
  }
};
