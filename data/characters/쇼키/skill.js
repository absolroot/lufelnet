window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData["쇼키"] = {
  "name": "이케나미 쇼키",
  "skill1": {
    "name": "빛나는 독백",
    "element": "축복",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "1명의 적에게 공격력 151.8%/161.1%/158.0%/167.3%의 축복 속성 대미지를 주고 모든 동료가 축복 효과를 2중첩 획득한다. 또한 모든 동료의 대미지가 증가하며(이케나미 쇼키의 공격력 100포인트마다 대미지 0.8% 증가, 최대 35.1%/37.2%/36.6%/38.7%) 2턴 동안 지속된다."
  },
  "skill2": {
    "name": "낯선 공간",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 2,
    "description": "자신을 제외한 동료 1명의 방어력이 증가하고(이케나미 쇼키의 공격력 100포인트마다 방어력 0.83% 증가, 최대 36.6%/38.9%/38.1%/40.4%), 목표가 일부 정신 이상 효과(현기증, 수면, 혼란, 망각)에 면역되며 2턴 동안 지속된다."
  },
  "skill3": {
    "name": "별들의 공연",
    "element": "버프광역",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "모든 동료의 공격력이 증가하며(증가 값은 자신의 공격력의 15%, 상한 569/617/592/650) 2턴 동안 지속된다.\n자신의 현재 『즉흥 공연』 상태에 따라 스킬 메인 목표가 추가 효과를 획득한다.\n『즉흥·침투』: 2턴 동안 스킬 메인 목표의 지속 대미지 효과가 14.0%/15.5%/14.5%/16.0% 증가하고, 효과 명중이 30% 증가한다.\n『즉흥·전복』: 2턴 동안 스킬 메인 목표의 스킬 마스터가 655/722/682/749 증가하고, TECHNICAL을 줄 시 공격력이 20% 증가한다.\n『즉흥·공감』: 2턴 동안 스킬 메인 목표의 크리티컬 효과가 24.4%/26.9%/25.4%/27.9% 증가한다.\n『즉흥·교감』: 2턴 동안 스킬 메인 목표의 관통이 12.0%/13.2%/12.5%/13.7% 증가한다."
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "버프",
    "description": "모든 동료의 공격력이 증가하고(증가 값은 자신의 공격력의 6.5%, 상한 284/302/296/314), 효과 저항이 82.0%/87.1%/85.3%/90.4% 증가한다. 효과는 2턴 동안 지속된다. 또한 모든 동료가 축복 효과를 1중첩 획득한다."
  },
  "passive1": {
    "name": "본색",
    "element": "패시브",
    "description": "축복 효과를 보유한 아군 동료의 경우, 축복 중첩당 대미지가 5% 증가하고, 상한은 25.0%이다."
  },
  "passive2": {
    "name": "반전",
    "element": "패시브",
    "description": "자신의 효과 명중 1%마다 공격력이 0.72% 증가하며, 상한은 72.0%이다."
  }
};
window.enCharacterSkillsData["쇼키"] = {
  "name": "Shoki Ikenami",
  "skill1": {
    "name": "Spotlight Soliloquy",
    "element": "축복",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "Deals 151.8%/161.1%/158.0%/167.3% ATK as Bless DMG to 1 enemy, gives all allies 2 stacks of Blessing, and increases all allies' DMG Dealt (For every 100 ATK, increases DMG Dealt by 0.8%, up to 35.1%/37.2%/36.6%/38.7%) for 2 turns."
  },
  "skill2": {
    "name": "Brechtian Divide",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 2,
    "description": "Increases 1 other ally's DEF (For every 100 ATK, increases DEF by 0.83%, up to 36.6%/38.9%/38.1%/40.4%), and gives them immunity to certain Mental Ailments (Dizzy, Sleep, Confuse, Forget) for 2 turns."
  },
  "skill3": {
    "name": "Ensemble of Stars",
    "element": "버프광역",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "Increases all allies' ATK (Based on 15% own ATK, up to 569/617/592/650) for 2 turns.\nBased on your current [Improv], gives the main target additional effects:\n- [Improv·Osmosis]: Increases the main target's DoT DMG Effect by 14.0%/15.5%/14.5%/16.0% and EHR by 30% for 2 turns.\n- [Improv·Subversion]: Increases the main target's TECHNICAL Mastery by 655/722/682/749 and ATK when dealing TECHNICAL by 20% for 2 turns.\n- [Improv·Empathy]: Increases the main target's CRIT DMG by 24.4%/26.9%/25.4%/27.9% for 2 turns.\n- [Improv·Resonance]: Increases the main target's PEN by 12.0%/13.2%/12.5%/13.7% for 2 turns."
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "버프",
    "description": "Increases all allies' ATK (Based on 6.5% of own ATK, up to 284/302/296/314) and Effect RES by 82.0%/87.1%/85.3%/90.4% for 2 turns, then gives all allies 1 stack of Blessing."
  },
  "passive1": {
    "name": "Nature",
    "element": "패시브",
    "description": "For each stack of Blessing on an ally, increase their DMG Dealt by 5%, up to 25.0%."
  },
  "passive2": {
    "name": "Reverse",
    "element": "패시브",
    "description": "For every 1% EHR, increase ATK by 0.72%, up to 72.0%."
  }
};
window.jpCharacterSkillsData["쇼키"] = {
  "name": "池波 星輝",
  "skill1": {
    "name": "輝くモノローグ",
    "element": "축복",
    "type": "단일피해",
    "sp": 20,
    "cool": 0,
    "description": "敵1体に攻撃力151.8%/161.1%/158.0%/167.3%の祝福属性ダメージを与え、味方全体が祝福効果を2スタック獲得する。さらに、味方全体の与ダメージが上昇する（池波 星輝の攻撃力100ごとに0.8%上昇、最大35.1%/37.2%/36.6%/38.7%）、効果は2ターン持続。"
  },
  "skill2": {
    "name": "見知らぬ空間",
    "element": "버프",
    "type": "버프",
    "sp": 24,
    "cool": 2,
    "description": "自分以外の味方1体の防御力を上昇させる（池波 星輝の攻撃力100ごとに0.83%上昇、最大36.6%/38.9%/38.1%/40.4%）、さらに対象は一部の精神異常（目眩、睡眠、混乱、忘却）に2ターンの間免疫を得る。"
  },
  "skill3": {
    "name": "星々の公演",
    "element": "버프광역",
    "type": "버프",
    "sp": 24,
    "cool": 0,
    "description": "味方全体の攻撃力が上昇する（上昇値は自身の攻撃力の15%、上限569/617/592/650）、効果は2ターン持続。\n現在の『即興公演』状態に応じてスキルメイン対象が追加効果を得る。\n『即興・浸透』：2ターンの間、スキルメイン対象の持続ダメージ効果が14.0%/15.5%/14.5%/16.0%増加し、状態異常命中が30%上昇する。\n『即興・転覆』：2ターンの間、スキルメイン対象のスキルマスターが655/722/682/749上昇し、TECHNICALを与える際に攻撃力が20%上昇する。\n『即興・共感』：2ターンの間、スキルメイン対象のCRT倍率が24.4%/26.9%/25.4%/27.9%上昇する。\n『即興・交感』：2ターンの間、スキルメイン対象の貫通が12.0%/13.2%/12.5%/13.7%上昇する。"
  },
  "skill_highlight": {
    "element": "버프광역",
    "type": "버프",
    "description": "味方全体の攻撃力が上昇する（上昇値は自身の攻撃力の6.5%、上限284/302/296/314）、効果耐性が82.0%/87.1%/85.3%/90.4%増加する。効果は2ターン持続。また、味方全体が祝福効果を1スタック獲得する。"
  },
  "passive1": {
    "name": "本色",
    "element": "패시브",
    "description": "祝福効果を持つ味方は、祝福スタックごとに与ダメージが5%増加し、上限は25.0%。"
  },
  "passive2": {
    "name": "反転",
    "element": "패시브",
    "description": "状態異常命中1%ごとに攻撃力が0.72%上昇し、上限は72.0%。"
  }
};
