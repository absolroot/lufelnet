window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["후카"] = {
  "name": "야마기시 후카",
  "skill1": {
    "name": "빛의 힘",
    "element": "버프",
    "type": "버프",
    "sp": 0,
    "cool": 4,
    "description": "모든 아군의 공격력이 10.0%/11.0%/11.2%/12.2%+야마기시 후카의 공격력 100포인트마다 1.143% 증가하며(상한 40.0%/44.0%/44.8%/48.8%), 대미지가 8.0%/8.8%/9.0%/9.8%+야마기시 후카의 공격력 100포인트마다 0.914% 증가한다(상한 32.0%/35.2%/35.8%/39.0%). 효과는 2턴 동안 지속된다. 자신은 『소망의 청취』를 1중첩 획득한다."
  },
  "skill2": {
    "name": "신성한 기도",
    "element": "버프",
    "type": "버프",
    "sp": 0,
    "cool": 16,
    "description": "초기 준비 시간: 16회 행동\n모든 아군의 공격력이 6.0%/6.6%/6.7%/7.3%+야마기시 후카의 공격력 100포인트마다 0.686% 증가하며(상한 24.0%/26.4%/26.9%/29.3%), 3턴 동안 지속된다. 스킬 메인 목표가 S.E.E.S 멤버인 경우 테우르기아 에너지를 35포인트 회복시키고, 해당 목표의 테우르기아 대미지가 6.0%/6.6%/6.7%/7.3%+야마기시 후카의 공격력 100포인트마다 0.686% 증가하며(상한 24.0%/26.4%/26.9%/29.3%), 3턴 동안 지속된다. 스킬 메인 목표가 S.E.E.S 멤버가 아닌 경우 HIGHLIGHT 에너지를 35포인트 회복시키고, 해당 목표의 HIGHLIGHT 대미지가 6.0%/6.6%/6.7%/7.3%+야마기시 후카의 공격력 100포인트마다 0.686% 증가하며(상한 24.0%/26.4%/26.9%/29.3%), 3턴 동안 지속된다.\n해당 스킬의 준비 시간은 별도로 계산되며, 해당 스킬 시전 시 다른 해명 스킬의 준비 시간에 영향을 주지 않는다. 해당 스킬의 전투 중 표시되는 준비 시간은 남은 준비 시간이다."
  },
  "skill3": {
    "name": "신념의 파동",
    "element": "버프",
    "type": "버프",
    "sp": 0,
    "cool": 4,
    "description": "모든 아군의 크리티컬 효과가 10.0%/11.0%/11.2%/12.2%+야마기시 후카의 크리티컬 효과 1%마다 0.625% 증가하며(상한 40.0%/44.0%/44.8%/48.8%), 2턴 동안 지속된다. 자신은 『소망의 청취』를 1중첩 획득한다.\n임의 동료가 다음 특정 조건을 만족하면 우선도에 따라 다음 효과 중 1개가 발동된다(만족하는 조건이 없을 시 다음 중 1개 효과 랜덤 발동).\n1. 임의 동료가 정신 이상 상태일 시 목표의 상태 이상 1개 제거.\n2. 임의 동료의 생명이 최대 생명의 25%보다 낮을 시 생명 백분율이 가장 낮은 동료의 생명 15% 회복.\n3. 임의 동료의 SP가 30포인트보다 낮을 시 SP가 가장 낮은 동료의 SP를 30포인트 회복."
  },
  "skill_highlight": {
    "name": "속성 증가",
    "element": "패시브",
    "description": "해명 괴도 각 속성의 20%만큼 출전 중인 모든 동료의 상응한 속성 수치가 증가한다."
  },
  "passive1": {
    "name": "자비",
    "element": "패시브",
    "description": "임의 동료가 테우르기아 또는 HIGHLIGHT 발동 시 2턴 동안 아군 전체의 크리티컬 효과가 24.0% 증가한다.",
    "cool": 0
  },
  "passive2": {
    "name": "진심",
    "element": "패시브",
    "description": "전투 시작 시 『백업 캐릭터』 각 속성의 4.5%만큼 필드에 있는 아군 전체의 해당 속성 값이 증가한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["후카"] = {
  "name": "Fuuka Yamagishi",
  "skill1": {
    "name": "Radiant Power",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "Increase party's Attack by 10.0%/11.0%/11.2%/12.2% + 1.143% for every 100 points of Fuuka's Attack, up to 40.0%/44.0%/44.8%/48.8%, and damage by 8.0%/8.8%/9.0%/9.8% + 0.914% for every 100 points of Fuuka's Attack, up to 32.0%/35.2%/35.8%/39.0%. Lasts for 2 turns. User gains 1 [Wish Listener] stack."
  },
  "skill2": {
    "name": "Holy Prayer",
    "element": "버프광역",
    "type": "버프",
    "cool": 16,
    "description": "Initial Cooldown Time: 16 ally actions\nIncrease party's Attack by 6.0%/6.6%/6.7%/7.3% + 0.686% for every 100 points of Fuuka's Attack, up to 24.0%/26.4%/26.9%/29.3%. Lasts for 3 turns. If main target is a S.E.E.S. member, restore target's Theurgy Energy by 35 points, then increase target's Theurgy damage by 6.0%/6.6%/6.7%/7.3% + 0.686% for every 100 points of Fuuka's Attack, up to 24.0%/26.4%/26.9%/29.3%. Lasts for 3 turns; If the main target is not a S.E.E.S. member, restore HIGHLIGHT Energy by 35 points, then increase target's HIGHLIGHT damage by 6.0%/6.6%/6.7%/7.3% + 0.686% for every 100 points of Fuuka's Attack, up to 24.0%/26.4%/26.9%/29.3%.\nThis skill has an independent cooldown and does not affect the cooldown time of other skills."
  },
  "skill3": {
    "name": "Spirit Wave",
    "element": "버프광역",
    "type": "버프",
    "cool": 4,
    "description": "Increase party's critical damage by 10.0%/11.0%/11.2%/12.2% + 0.625% for every 1% of Fuuka's critical damage, up to 40.0%/44.0%/44.8%/48.8%. Lasts for 2 turns. User gains 1 [Wish Listener] stacks.\nWhen any ally meets a certain conditions, activate one of the following effect in order of priority. (When no conditions are met, activate 1 random effect)\n1. When any ally is inflicted with Mental Ailments, cure 1 debuff on the target.\n2. When any ally is below 25% max HP, restore HP equal to 15% of  that ally's max HP.\n3. When any ally is below 30 SP, restore 30 SP to the lowest SP ally."
  },
  "skill_highlight": {
    "name": "Stat Buff",
    "element": "패시브",
    "description": "Increase party's stats by 20% of Fuuka's stats."
  },
  "passive1": {
    "name": "Benevolence",
    "element": "패시브",
    "description": "After any ally uses a Theurgy or HIGHLIGHT, increase party's critical damage by 24.0% for 2 turns."
  },
  "passive2": {
    "name": "Compassion",
    "element": "패시브",
    "description": "Increase party's stats by 4.5% of [Backup Character]'s stats."
  }
};
window.jpCharacterSkillsData["후카"] = {
  "name": "山岸 風花",
  "skill1": {
    "name": "輝きの力",
    "element": "버프광역",
    "type": "버프",
    "sp": 0,
    "cool": 4,
    "description": "味方全体の攻撃力が10.0%/11.0%/11.2%/12.2%上昇し、山岸 風花の攻撃力100ごとに1.143%追加で上昇（最大40.0%/44.0%/44.8%/48.8%）。与ダメージが8.0%/8.8%/9.0%/9.8%上昇し、攻撃力100ごとに0.914%追加で上昇（最大32.0%/35.2%/35.8%/39.0%）。効果は2ターン持続し、自身は『願いの傾聴』を1スタック獲得する。"
  },
  "skill2": {
    "name": "聖なる祈り",
    "element": "버프광역",
    "type": "버프",
    "sp": 0,
    "cool": 16,
    "description": "初期準備時間：行動16回\n味方全体の攻撃力が6.0%/6.6%/6.7%/7.3%上昇し、山岸 風花の攻撃力100ごとに0.686%追加で上昇（最大24.0%/26.4%/26.9%/29.3%）。効果は3ターン持続。\n対象がS.E.E.S.メンバーの場合、その対象のテウルギアエネルギーを35回復し、テウルギアの与ダメージが同数値分上昇する。\n対象が非S.E.E.S.メンバーの場合、その対象のHIGHLIGHTゲージを35回復し、HIGHLIGHTの与ダメージが同数値分上昇する。\nこのスキルの準備時間は独立して計算され、他の解明スキルの準備時間に影響しない。"
  },
  "skill3": {
    "name": "心の波動",
    "element": "버프광역",
    "type": "버프",
    "sp": 0,
    "cool": 4,
    "description": "味方全体のCRT倍率が10.0%/11.0%/11.2%/12.2%上昇し、山岸 風花のCRT倍率1%ごとに0.625%追加で上昇（最大40.0%/44.0%/44.8%/48.8%）。効果は2ターン持続し、自身は『願いの傾聴』を1スタック獲得する。\nスキル使用時、以下の条件のいずれかを満たす味方がいる場合、優先順位に従っていずれか1つの効果を発動する。条件がない場合はランダムに発動する。\n1. 精神異常状態の味方がいる場合：その味方の状態異常を1つ解除\n2. HPが25%未満の味方がいる場合：HP割合が最も低い味方のHPを15%回復\n3. SPが30未満の味方がいる場合：SPが最も低い味方のSPを30回復"
  },
  "skill_highlight": {
    "name": "ステータス強化",
    "element": "패시브",
    "description": "解明系怪盗の各属性の20%分、味方全体のステータスを上昇させる。"
  },
  "passive1": {
    "name": "慈悲",
    "element": "패시브",
    "description": "味方がテウルギアまたはHIGHLIGHTを使用すると、味方全体のCRT倍率が24.0%上昇する。効果は2ターン持続する。"
  },
  "passive2": {
    "name": "深い情",
    "element": "패시브",
    "description": "戦闘開始時、山岸 風花が指定した『候補キャラクター』の各ステータスの4.5%を、現在戦場にいる味方全員のステータスに反映する。"
  }
};
