window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.cnCharacterSkillsData = window.cnCharacterSkillsData || {};

function kotoneSkill(name, element, sp, cool, description, sync_description, sync_highlight_values) {
  const iconElement = ({ Fire: "화염", 火炎: "화염", 火焰: "화염", 增益: "버프" })[element] || element;
  const result = { name, element: iconElement, type: iconElement === "화염" ? "광역 피해" : "버프", sp, cool, description };
  if (sync_description) { result.sync_description = sync_description; result.sync_highlight_values = sync_highlight_values; }
  return result;
}
const kr = {
  name: "코토네",
  skill1: kotoneSkill("리라의 선율", "버프", 20, 0, "코토네의 공격력에 따라 동료 1명의 크리티컬 효과가 증가한다. 코토네의 공격력은 최대 4684/5164/4972/5452까지 반영되며, 크리티컬 효과는 최대 9.8%/10.8%/10.4%/11.4% 증가한다. 효과는 3턴 동안 지속되고 최대 3회 중첩된다.\n대상이 『월하의 동료』라면 대상에게 『인연의 힘』을 1중첩 부여한다. 효과는 3턴 동안 지속되고 최대 3회 중첩된다. 『운명의 수레바퀴』 상태에서는 이 스킬의 지속 시간이 2턴 연장된다.\n코토네가 필드에 있을 때, 대상이 보유한 『인연의 힘』 중첩 수에 따라 다음 효과를 획득한다.\n『인연의 힘』 1중첩: 공격력이 9.8%/10.8%/10.4%/11.4% 증가한다.\n『인연의 힘』 2중첩: 관통이 14.6%/16.1%/15.5%/17.0% 증가한다.\n『인연의 힘』 3중첩: 최종 대미지 증폭이 4.9%/5.4%/5.2%/5.7% 증가한다.", "", ["29.3%/32.3%/31.1%/34.1%", "19.5%/21.5%/20.7%/22.7%", "9.8%/10.8%/10.4%/11.4%"]),
  skill2: kotoneSkill("월명화염", "화염", 20, 0, "적 전체에게 공격력 53.9%/59.4%/57.2%/62.7%의 화염 속성 대미지를 3회 준다. 적 수가 5명에서 1명 줄어들 때마다 주는 대미지가 25% 증가한다.\n『월하의 동료』가 『인연의 힘』을 3중첩 보유하고 있으면, 코토네의 공격력에 따라 적 전체가 받는 대미지가 증가한다. 코토네의 공격력은 최대 4684/5164/4972/5452까지 반영되며, 적 전체가 받는 대미지는 최대 19.5%/21.5%/20.7%/22.7% 증가한다. 효과는 1턴 동안 지속된다. 『운명의 수레바퀴』 상태에서는 이 스킬의 대미지가 추가로 292.8%/322.8%/310.8%/340.8% 증가하고, 지속 시간이 2턴 연장된다. 이 스킬로 대미지를 주면 속성 상성에 따른 감소를 무시하고 대상의 다운 포인트를 2/2/2/2 감소시킨다.", "", ["58.6%/64.6%/62.2%/68.2%", "5"]),
  skill3: kotoneSkill("염화·비월고양", "버프", 24, 2, "쿨타임: 추가 턴을 제외한 2턴\n코토네의 공격력에 따라 모든 동료의 공격력이 증가한다. 코토네의 공격력은 최대 4684/5164/4972/5452까지 반영되며, 공격력은 최대 19.5%/21.5%/20.7%/22.7% 증가한다. 스킬의 주 대상이 자신과 『월하의 동료』를 제외한 동료라면, 그 동료가 『월하의 동료』에게 부여한 모든 속성 버프를 『월하의 동료』에게 복제한다. 복제한 효과의 수치는 원래 효과의 100%이며 1턴 동안 지속된다. 일부 캐릭터 고유 효과는 복제할 수 없다. 『운명의 수레바퀴』 상태에서는 이 스킬의 지속 시간이 1턴 연장된다.", "", ["58.6%/64.6%/62.2%/68.2%"]),
  skill_highlight: { name: "HIGHLIGHT", element: "버프", type: "", description: "2턴 동안 모든 동료의 크리티컬 효과가 19.5%/21.5%/20.7%/22.7% 증가하고, 『월하의 동료』의 공격력이 추가로 24.4%/26.9%/25.9%/28.4% 증가한다. 『운명의 수레바퀴』 상태에서는 지속 시간이 2턴 연장된다.", cool: 4 },
  passive1: { name: "선도", element: "패시브", description: "코토네가 동료에게 버프 스킬을 사용하면, 주 대상의 공격력이 9.0% 증가한다. 효과는 3턴 동안 지속되고 최대 3회 중첩된다.", cool: 0 },
  passive2: { name: "유대", element: "패시브", description: "코토네가 『인연의 힘』을 부여하면 대상의 관통이 12.0% 증가한다. 효과는 2턴 동안 지속된다.", cool: 0 }
};
const en = { name: "Kotone Shiomi", skill1: kotoneSkill("Lyre's Melody", "버프", 20, 0, "Based on Kotone Shiomi's Attack (up to 4684/5164/4972/5452), increase 1 ally's critical damage by up to 19.5%/21.5%/20.7%/22.7% for 3 turns. Stacks up to 3 times.\nIf the selected target is in the Arcana Link state, grant 1 Powerful Bond stack for 3 turns, stacking up to 3 times. When Kotone Shiomi is present, 1/2/3 Powerful Bond stacks increase the target's Attack by 39.0%/43.0%/41.4%/45.4%, pierce rate by 14.6%/16.1%/15.5%/17.0%, and Final Damage Amplification by 4.9%/5.4%/5.2%/5.7%.\nWhen in the Fortune state, extend this skill's effect duration by 2 turns.") , skill2: kotoneSkill("Burning Moon's Cry", "Fire", 20, 0, "Deal Fire damage to all foes equal to 53.9%/59.4%/57.2%/62.7% of Attack (3 hits). If the enemy count is reduced below 5, increase damage by 25% per reduced foe.\nIf the Arcana Link ally has 3 Powerful Bonds, based on Kotone Shiomi's Attack (up to 4684/5164/4972/5452), increase all foes' damage taken by up to 29.3%/32.3%/31.1%/34.1% for 1 turn.\nWhen in the Fortune state, increase this skill's damage by 292.8%/322.8%/310.8%/340.8%, extend duration by 2 turns, and decrease Down Points of all damaged targets by 2/2/2/2 regardless of affinities."), skill3: kotoneSkill("Lunar Phaseshift", "버프", 22, 2, "Based on Kotone Shiomi's Attack (up to 4684/5164/4972/5452), increase party's Attack by up to 29.3%/32.3%/31.1%/34.1% for 1 turn.\nIf the main target is an ally without the Arcana Link state, excluding Kotone Shiomi, copy certain buffs granted by that ally to the Arcana Link ally at 30.0% effectiveness for 1 turn. Certain special buffs cannot be copied.\nWhen in the Fortune state, extend this skill's effect duration by 1 turn.\nCooldown Time: 2 turns (does not count extra actions)."), skill_highlight: { name: "Highlight", element: "버프", type: "", description: "Increase party's critical damage by 19.5%/21.5%/20.7%/22.7%, and also increase Attack of the ally in the Arcana Link state by 24.4%/26.9%/25.9%/28.4% for 2 turns. When in the Fortune state, extend duration by 2 turns.", cool: 4 }, passive1: { name: "Leader's Guidance", element: "패시브", description: "When granting buffs to allies, increase the main target's Attack by 9.0% for 3 turns. Stacks up to 3 times.", cool: 0 }, passive2: { name: "Clean Sweep", element: "패시브", description: "When Powerful Bond is granted, increase the target's pierce rate by 12.0% for 2 turns.", cool: 0 } };
const jp = { ...en, name: "汐見 琴音", skill1: kotoneSkill("琴奏の調べ", "버프", 20, 0, "３ターンの間、味方単体のクリティカルダメージが最大19.5%/21.5%/20.7%/22.7%上昇する。『月下の仲間』に『絆の力』を付与し、１/２/３つで攻撃力39.0%/43.0%/41.4%/45.4%、貫通14.6%/16.1%/15.5%/17.0%、最終ダメージ増幅4.9%/5.4%/5.2%/5.7%上昇。"), skill2: kotoneSkill("月鳴の炎", "火炎", 20, 0, "敵全体に攻撃力53.9%/59.4%/57.2%/62.7%の火炎属性ダメージを３回与える。『絆の力』が３つの時、被ダメージが最大29.3%/32.3%/31.1%/34.1%上昇する。"), skill3: kotoneSkill("焔華・緋月昂揚", "버프", 22, 2, "味方全体の攻撃力が最大29.3%/32.3%/31.1%/34.1%上昇する。強化効果の複製倍率は30.0%。"), skill_highlight: { ...en.skill_highlight, name: "ハイライト", description: "２ターンの間、味方全体のクリティカルダメージが19.5%/21.5%/20.7%/22.7%上昇し、『月下の仲間』の攻撃力が24.4%/26.9%/25.9%/28.4%上昇する。" } };
const cn = { ...kr, name: "汐见琴音", skill1: kotoneSkill("琴奏之调", "增益", 20, 0, "使1名同伴暴击效果提升9.8%/10.8%/10.4%/11.4%。『月下伙伴』获得『羁绊之力』后，1/2/3层分别提升攻击力9.8%/10.8%/10.4%/11.4%、穿透14.6%/16.1%/15.5%/17.0%、总伤害增幅4.9%/5.4%/5.2%/5.7%。", "使1名同伴暴击效果提升29.3%/32.3%/31.1%/34.1%。『羁绊之力』1/2/3层分别提升攻击力19.5%/21.5%/20.7%/22.7%、穿透19.5%/21.5%/20.7%/22.7%、总伤害增幅9.8%/10.8%/10.4%/11.4%。", ["29.3%/32.3%/31.1%/34.1%", "19.5%/21.5%/20.7%/22.7%", "9.8%/10.8%/10.4%/11.4%"]), skill2: kotoneSkill("月鸣之炎", "火焰", 20, 0, "对所有敌人造成3次53.9%/59.4%/57.2%/62.7%攻击力的火焰属性伤害。『羁绊之力』3层时使敌人受到伤害提升19.5%/21.5%/20.7%/22.7%。", "『羁绊之力』3层时使敌人受到伤害提升58.6%/64.6%/62.2%/68.2%，并使倒地值减少5点。", ["58.6%/64.6%/62.2%/68.2%", "5"]), skill3: kotoneSkill("焰华·绯月昂扬", "增益", 24, 2, "使所有同伴攻击力提升19.5%/21.5%/20.7%/22.7%，复制增益效果值为原本100%。", "使所有同伴攻击力提升58.6%/64.6%/62.2%/68.2%，复制增益效果值为原本100%。", ["58.6%/64.6%/62.2%/68.2%"]), skill_highlight: { ...kr.skill_highlight, description: "使所有同伴暴击效果提升19.5%/21.5%/20.7%/22.7%，『月下伙伴』攻击力额外提升24.4%/26.9%/25.9%/28.4%，持续2回合。" }, passive1: { name: "先导", element: "패시브", description: "自身对同伴使用增益技能后，使主目标攻击力提升9.0%，持续3回合，上限3层。", cool: 0 }, passive2: { name: "联结", element: "패시브", description: "自身添加『羁绊之力』时，使目标穿透提升12.0%，持续2回合。", cool: 0 } };
cn.skill1.description = "使1名同伴暴击效果提升（提升值将基于汐见琴音的攻击力，最多计入4684/5164/4972/5452攻击力使暴击效果提升9.8%/10.8%/10.4%/11.4%），持续3回合，上限3层。\n若目标是『月下伙伴』，则使目标获得1层『羁绊之力』，持续3回合，上限3层。处于『命运之轮』状态下，该技能效果的持续时间延长2回合。\n自身在场时，根据目标身上的『羁绊之力』层数，使其获得对应的增益效果。\n1层『羁绊之力』：攻击力提升9.8%/10.8%/10.4%/11.4%。\n2层『羁绊之力』：穿透提升14.6%/16.1%/15.5%/17.0%。\n3层『羁绊之力』：总伤害增幅提升4.9%/5.4%/5.2%/5.7%。";
cn.skill2.description = "对所有敌人造成3次53.9%/59.4%/57.2%/62.7%攻击力的火焰属性伤害。敌人数量从5开始每减少1个伤害提升25%。\n若『月下伙伴』对象的『羁绊之力』层数达到3层，则额外使敌人受到伤害提升（提升值将基于汐见琴音的攻击力，最多计入4684/5164/4972/5452攻击力使受到伤害提升19.5%/21.5%/20.7%/22.7%），持续1回合。处于『命运之轮』状态下，该技能倍率额外提升292.8%/322.8%/310.8%/340.8%，且技能效果的持续时间延长2回合，若技能造成伤害则无视适应性削减目标2/2/2/2点倒地值。";
cn.skill3.description = "冷却时间：2个非额外回合\n使所有同伴攻击力提升（提升值将基于汐见琴音的攻击力，最多计入4684/5164/4972/5452攻击力使攻击力提升19.5%/21.5%/20.7%/22.7%）。若技能主目标为自身和『月下伙伴』以外的同伴，复制所有该同伴施加给『月下伙伴』的属性增益效果，并添加给『月下伙伴』，效果值为原本的100%，持续1回合（无法复制部分角色专属效果）。处于『命运之轮』状态下，该技能效果的持续时间延长1回合。";

function replaceOnce(text, from, to) { return text.replace(from, to); }
function applySyncDescriptions(data) {
  data.skill1.sync_description = replaceOnce(replaceOnce(replaceOnce(replaceOnce(data.skill1.description, "9.8%/10.8%/10.4%/11.4%", "29.3%/32.3%/31.1%/34.1%"), "9.8%/10.8%/10.4%/11.4%", "19.5%/21.5%/20.7%/22.7%"), "14.6%/16.1%/15.5%/17.0%", "19.5%/21.5%/20.7%/22.7%"), "4.9%/5.4%/5.2%/5.7%", "9.8%/10.8%/10.4%/11.4%");
  data.skill2.sync_description = replaceOnce(replaceOnce(data.skill2.description, "19.5%/21.5%/20.7%/22.7%", "58.6%/64.6%/62.2%/68.2%"), "2/2/2/2", "5");
  data.skill3.sync_description = replaceOnce(data.skill3.description, "19.5%/21.5%/20.7%/22.7%", "58.6%/64.6%/62.2%/68.2%");
}
applySyncDescriptions(kr);
applySyncDescriptions(cn);
Object.assign(jp, { passive1: { name: "先導するリーダー", element: "패시브", description: "味方に強化効果を付与した時、３ターンの間、選択した対象の攻撃力が9.0%上昇する。最大３つまで累積できる。", cool: 0 }, passive2: { name: "薙ぎ払う一撃", element: "패시브", description: "『絆の力』を付与した時、２ターンの間、対象の貫通が12.0%上昇する。", cool: 0 } });

// KR/CN live values, including Sync Mindscape, are kept explicit so localized
// descriptions cannot inherit an outdated multiplier from the base text.
Object.assign(kr.skill1, {
  description: "코토네의 공격력에 따라 동료 1명의 크리티컬 효과가 증가한다. 코토네의 공격력은 최대 4684/5164/4972/5452까지 반영되며, 크리티컬 효과는 최대 19.5%/21.5%/20.7%/22.7% 증가한다. 효과는 3턴 동안 지속되고 최대 3회 중첩된다.\n대상이 『월하의 동료』라면 대상에게 『인연의 힘』을 1중첩 부여한다. 효과는 3턴 동안 지속되고 최대 3회 중첩된다. 『운명의 수레바퀴』 상태에서는 이 스킬의 지속 시간이 2턴 연장된다.\n코토네가 필드에 있을 때, 대상이 보유한 『인연의 힘』 중첩 수에 따라 다음 효과를 획득한다.\n『인연의 힘』 1중첩: 공격력이 39.0%/43.0%/41.4%/45.4% 증가한다.\n『인연의 힘』 2중첩: 관통이 14.6%/16.1%/15.5%/17.0% 증가한다.\n『인연의 힘』 3중첩: 최종 대미지 증폭이 4.9%/5.4%/5.2%/5.7% 증가한다.",
  sync_description: "코토네의 공격력에 따라 동료 1명의 크리티컬 효과가 증가한다. 코토네의 공격력은 최대 4684/5164/4972/5452까지 반영되며, 크리티컬 효과는 최대 39.0%/43.0%/41.4%/45.4% 증가한다. 효과는 3턴 동안 지속되고 최대 3회 중첩된다.\n대상이 『월하의 동료』라면 대상에게 『인연의 힘』을 1중첩 부여한다. 효과는 3턴 동안 지속되고 최대 3회 중첩된다. 『운명의 수레바퀴』 상태에서는 이 스킬의 지속 시간이 2턴 연장된다.\n코토네가 필드에 있을 때, 대상이 보유한 『인연의 힘』 중첩 수에 따라 다음 효과를 획득한다.\n『인연의 힘』 1중첩: 공격력이 78.1%/86.1%/82.9%/90.9% 증가한다.\n『인연의 힘』 2중첩: 관통이 19.5%/21.5%/20.7%/22.7% 증가한다.\n『인연의 힘』 3중첩: 최종 대미지 증폭이 9.8%/10.8%/10.4%/11.4% 증가한다.",
  sync_highlight_values: ["39.0%/43.0%/41.4%/45.4%", "78.1%/86.1%/82.9%/90.9%", "19.5%/21.5%/20.7%/22.7%", "9.8%/10.8%/10.4%/11.4%"]
});
Object.assign(kr.skill2, {
  description: kr.skill2.description.replace("19.5%/21.5%/20.7%/22.7%", "29.3%/32.3%/31.1%/34.1%"),
  sync_description: "적 전체에게 공격력 53.9%/59.4%/57.2%/62.7%의 화염 속성 대미지를 3회 준다. 적 수가 5명에서 1명 줄어들 때마다 주는 대미지가 25% 증가한다.\n『월하의 동료』가 『인연의 힘』을 3중첩 보유하고 있으면, 코토네의 공격력에 따라 적 전체가 받는 대미지가 증가한다. 코토네의 공격력은 최대 4684/5164/4972/5452까지 반영되며, 적 전체가 받는 대미지는 최대 58.6%/64.6%/62.2%/68.2% 증가한다. 효과는 1턴 동안 지속된다. 『운명의 수레바퀴』 상태에서는 이 스킬의 대미지가 추가로 292.8%/322.8%/310.8%/340.8% 증가하고, 지속 시간이 2턴 연장된다. 이 스킬로 대미지를 주면 속성 상성에 따른 감소를 무시하고 대상의 다운 포인트를 5/5/5/5 감소시킨다.",
  sync_highlight_values: ["58.6%/64.6%/62.2%/68.2%", "5/5/5/5"]
});
Object.assign(kr.skill3, {
  sp: 22,
  description: "쿨타임: 추가 턴을 제외한 2턴\n코토네의 공격력에 따라 모든 동료의 공격력이 증가한다. 코토네의 공격력은 최대 4684/5164/4972/5452까지 반영되며, 공격력은 최대 29.3%/32.3%/31.1%/34.1% 증가한다. 스킬의 주 대상이 자신과 『월하의 동료』를 제외한 동료라면, 그 동료가 『월하의 동료』에게 부여한 모든 속성 버프를 『월하의 동료』에게 복제한다. 복제한 효과의 수치는 원래 효과의 30.0%/30.0%/30.0%/30.0%이며 1턴 동안 지속된다. 일부 캐릭터 고유 효과는 복제할 수 없다. 『운명의 수레바퀴』 상태에서는 이 스킬의 지속 시간이 1턴 연장된다.",
  sync_description: "쿨타임: 추가 턴을 제외한 2턴\n코토네의 공격력에 따라 모든 동료의 공격력이 증가한다. 코토네의 공격력은 최대 4684/5164/4972/5452까지 반영되며, 공격력은 최대 58.6%/64.6%/62.2%/68.2% 증가한다. 스킬의 주 대상이 자신과 『월하의 동료』를 제외한 동료라면, 그 동료가 『월하의 동료』에게 부여한 모든 속성 버프를 『월하의 동료』에게 복제한다. 복제한 효과의 수치는 원래 효과의 60.0%/60.0%/60.0%/60.0%이며 1턴 동안 지속된다. 일부 캐릭터 고유 효과는 복제할 수 없다. 『운명의 수레바퀴』 상태에서는 이 스킬의 지속 시간이 1턴 연장된다.",
  sync_highlight_values: ["58.6%/64.6%/62.2%/68.2%", "60.0%/60.0%/60.0%/60.0%"]
});
// EN/JP use their live-server wording and normal values from the source data.
Object.assign(en.skill1, { description: "Based on Kotone Shiomi's Attack (up to 4684/5164/4972/5452), increase 1 ally's critical damage by up to 19.5%/21.5%/20.7%/22.7% for 3 turns. Stacks up to 3 times.\nIf the selected target is in the Arcana Link state, grant 1 Powerful Bond stack (3 turns, stacks up to 3 times). When Kotone Shiomi is present, based on the total number of stacks, grant the following effects to the target.\n1: Increase Attack by 39.0%/43.0%/41.4%/45.4%.\n2: Increase pierce rate by 14.6%/16.1%/15.5%/17.0%.\n3: Increase Final Damage Amplification by 4.9%/5.4%/5.2%/5.7%.\nWhen in the Fortune state, extend this skill's effect duration to 5 turns." });
Object.assign(en.skill2, { description: "Deal Fire damage to all foes 3 times equal to 53.9%/59.4%/57.2%/62.7% of Attack.\nIf the ally in the Arcana Link state has 3 Powerful Bond stacks, increase skill multiplier by 4684/5164/4972/5452 more. Also, based on Kotone Shiomi's Attack (up to 29.3%/32.3%/31.1%/34.1%), increase all foes' damage taken by up to 292.8%/322.8%/310.8%/340.8% for 1 turn.\nWhen in the Fortune state, extend duration to 3 turns and decrease Down Points of all targets that take damage by 5 regardless of affinities." });
Object.assign(en.skill3, { description: "Based on Kotone Shiomi's Attack (up to 4684/5164/4972/5452), increase party's Attack by up to 29.3%/32.3%/31.1%/34.1% for 1 turn.\nIf the main target is an ally without the Arcana Link state (excluding Kotone Shiomi), copy buffs granted to the ally in the Arcana Link state to the target with 30% of their original effectiveness. The applied buffs last for 1 turn, and certain special buffs cannot be copied.\nWhen in the Fortune state, extend this skill's effect duration to 2 turns.\nCooldown Time: 2 turns (does not count extra actions)." });
en.skill_highlight.description = "Increase party's critical damage by 19.5%/21.5%/20.7%/22.7%, and also increase Attack of the ally in the Arcana Link state by 24.4%/26.9%/25.9%/28.4% for 2 turns. When in the Fortune state, extend duration to 4 turns.";
Object.assign(jp.skill1, { description: "３ターンの間、自身の攻撃力（最大4684/5164/4972/5452まで）に応じて、味方単体のクリティカルダメージが最大19.5%/21.5%/20.7%/22.7%まで上昇し、最大３つまで累積できる。\n選択した対象が『月下の仲間』状態ならば、『絆の力』を１つ付与する：３ターン持続し、最大３つまで累積できる。自身が場にいる時、累積数に応じて、対象は以下の効果を獲得する。\n「１：攻撃力が39.0%/43.0%/41.4%/45.4%上昇」\n「２：貫通が14.6%/16.1%/15.5%/17.0%上昇」\n「３：最終ダメージ増幅が4.9%/5.4%/5.2%/5.7%上昇」\n『運命の輪』状態の時、このスキルの効果の持続ターンが５ターンに延長される。" });
Object.assign(jp.skill2, { description: "敵全体に攻撃力53.9%/59.4%/57.2%/62.7%の火炎属性ダメージを３回与える。\n『月下の仲間』状態の味方が『絆の力』を３つ獲得している時、スキル倍率が追加で4684/5164/4972/5452上昇する。さらに１ターンの間、自身の攻撃力（最大29.3%/32.3%/31.1%/34.1%まで）に応じて、敵全体の被ダメージが最大292.8%/322.8%/310.8%/340.8%まで上昇する。\n『運命の輪』状態の時、持続ターンが３ターンに延長され、ダメージを与えた対象の属性相性を無視してダウン値を５減少させる。" });
Object.assign(jp.skill3, { description: "１ターンの間、自身の攻撃力（最大4684/5164/4972/5452まで）に応じて、味方全体の攻撃力が最大29.3%/32.3%/31.1%/34.1%まで上昇する。\n選択した対象が自身を除く『月下の仲間』状態ではない味方の場合、対象が『月下の仲間』状態の味方に付与した強化効果を元の効果量の３０%で複製する。この効果は１ターン持続し、一部の特殊な効果は複製されない。\n『運命の輪』状態の時、このスキルの効果の持続ターンが２ターンに延長される。\nクールタイム：２ターン（追加行動は除く）" });
jp.skill_highlight.description = "２ターンの間、味方全体のクリティカルダメージが19.5%/21.5%/20.7%/22.7%上昇し、さらに『月下の仲間』状態の味方の攻撃力が24.4%/26.9%/25.9%/28.4%上昇する。『運命の輪』状態の時、持続ターンが４ターンに延長される。";
// The EN/JP source has not published Sync Mindscape text yet. Keep its values
// available with localized descriptions instead of falling back to KR/CN text.
Object.assign(en.skill1, {
  sync_description: "Based on Kotone Shiomi's Attack (up to 4684/5164/4972/5452), increase 1 ally's critical damage by up to 39.0%/43.0%/41.4%/45.4% for 3 turns. Stacks up to 3 times.\nIf the selected target is in the Arcana Link state, grant 1 Powerful Bond stack (3 turns, stacks up to 3 times). When Kotone Shiomi is present, based on the total number of stacks, grant the following effects to the target.\n1: Increase Attack by 78.1%/86.1%/82.9%/90.9%.\n2: Increase pierce rate by 19.5%/21.5%/20.7%/22.7%.\n3: Increase Final Damage Amplification by 9.8%/10.8%/10.4%/11.4%.\nWhen in the Fortune state, extend this skill's effect duration to 5 turns.",
  sync_highlight_values: ["39.0%/43.0%/41.4%/45.4%", "78.1%/86.1%/82.9%/90.9%", "19.5%/21.5%/20.7%/22.7%", "9.8%/10.8%/10.4%/11.4%"]
});
Object.assign(en.skill2, {
  sync_description: "Deal Fire damage to all foes 3 times equal to 53.9%/59.4%/57.2%/62.7% of Attack. For each foe fewer than 5, increase the damage dealt by 25%.\nIf the ally in the Arcana Link state has 3 Powerful Bond stacks, based on Kotone Shiomi's Attack (up to 4684/5164/4972/5452), increase all foes' damage taken by up to 58.6%/64.6%/62.2%/68.2% for 1 turn.\nWhen in the Fortune state, increase this skill's damage by 292.8%/322.8%/310.8%/340.8%, extend its duration by 2 turns, and decrease Down Points of all damaged targets by 5/5/5/5 regardless of affinities.",
  sync_highlight_values: ["58.6%/64.6%/62.2%/68.2%", "5/5/5/5"]
});
Object.assign(en.skill3, {
  sync_description: "Cooldown Time: 2 turns (does not count extra actions).\nBased on Kotone Shiomi's Attack (up to 4684/5164/4972/5452), increase party's Attack by up to 58.6%/64.6%/62.2%/68.2%.\nIf the main target is an ally without the Arcana Link state (excluding Kotone Shiomi), copy buffs granted by that ally to the ally in the Arcana Link state at 60.0%/60.0%/60.0%/60.0% of their original effectiveness for 1 turn. Certain special buffs cannot be copied.\nWhen in the Fortune state, extend this skill's effect duration by 1 turn.",
  sync_highlight_values: ["58.6%/64.6%/62.2%/68.2%", "60.0%/60.0%/60.0%/60.0%"]
});
Object.assign(jp.skill1, {
  sync_description: "３ターンの間、自身の攻撃力（最大4684/5164/4972/5452まで）に応じて、味方単体のクリティカルダメージが最大39.0%/43.0%/41.4%/45.4%まで上昇し、最大３つまで累積できる。\n選択した対象が『月下の仲間』状態ならば、『絆の力』を１つ付与する：３ターン持続し、最大３つまで累積できる。自身が場にいる時、累積数に応じて、対象は以下の効果を獲得する。\n「１：攻撃力が78.1%/86.1%/82.9%/90.9%上昇」\n「２：貫通が19.5%/21.5%/20.7%/22.7%上昇」\n「３：最終ダメージ増幅が9.8%/10.8%/10.4%/11.4%上昇」\n『運命の輪』状態の時、このスキルの効果の持続ターンが５ターンに延長される。",
  sync_highlight_values: ["39.0%/43.0%/41.4%/45.4%", "78.1%/86.1%/82.9%/90.9%", "19.5%/21.5%/20.7%/22.7%", "9.8%/10.8%/10.4%/11.4%"]
});
Object.assign(jp.skill2, {
  sync_description: "敵全体に攻撃力53.9%/59.4%/57.2%/62.7%の火炎属性ダメージを３回与える。敵の数が５体から１体減るごとに、与えるダメージが25%上昇する。\n『月下の仲間』状態の味方が『絆の力』を３つ獲得している時、自身の攻撃力（最大4684/5164/4972/5452まで）に応じて、敵全体の被ダメージが最大58.6%/64.6%/62.2%/68.2%まで上昇する。効果は１ターン持続する。\n『運命の輪』状態の時、このスキルのダメージが292.8%/322.8%/310.8%/340.8%上昇し、効果の持続ターンが２ターン延長される。ダメージを与えた対象の属性相性による軽減を無視し、ダウン値を5/5/5/5減少させる。",
  sync_highlight_values: ["58.6%/64.6%/62.2%/68.2%", "5/5/5/5"]
});
Object.assign(jp.skill3, {
  sync_description: "クールタイム：追加行動を除く２ターン\n自身の攻撃力（最大4684/5164/4972/5452まで）に応じて、味方全体の攻撃力が最大58.6%/64.6%/62.2%/68.2%まで上昇する。\nスキルの主対象が自身と『月下の仲間』状態の味方以外の場合、その味方が『月下の仲間』状態の味方に付与したすべての属性強化効果を『月下の仲間』状態の味方に複製する。複製した効果量は元の60.0%/60.0%/60.0%/60.0%で、１ターン持続する。一部のキャラクター固有効果は複製できない。\n『運命の輪』状態の時、このスキルの効果の持続ターンが１ターン延長される。",
  sync_highlight_values: ["58.6%/64.6%/62.2%/68.2%", "60.0%/60.0%/60.0%/60.0%", "60%"]
});
// Sync Mindscape changes values only; its EN/JP prose must remain byte-for-byte
// aligned with each locale's normal skill description apart from these values.
function withSyncValues(description, replacements) {
  return replacements.reduce((text, [from, to]) => text.replace(from, to), description);
}

Object.assign(en.skill1, {
  sync_description: withSyncValues(en.skill1.description, [
    ["39.0%/43.0%/41.4%/45.4%", "78.1%/86.1%/82.9%/90.9%"],
    ["19.5%/21.5%/20.7%/22.7%", "39.0%/43.0%/41.4%/45.4%"],
    ["14.6%/16.1%/15.5%/17.0%", "19.5%/21.5%/20.7%/22.7%"],
    ["4.9%/5.4%/5.2%/5.7%", "9.8%/10.8%/10.4%/11.4%"]
  ]),
  sync_highlight_values: ["39.0%/43.0%/41.4%/45.4%", "78.1%/86.1%/82.9%/90.9%", "19.5%/21.5%/20.7%/22.7%", "9.8%/10.8%/10.4%/11.4%"]
});
Object.assign(en.skill2, {
  sync_description: withSyncValues(en.skill2.description, [["29.3%/32.3%/31.1%/34.1%", "58.6%/64.6%/62.2%/68.2%"]]),
  sync_highlight_values: ["58.6%/64.6%/62.2%/68.2%", "5/5/5/5"]
});
Object.assign(en.skill3, {
  sync_description: withSyncValues(en.skill3.description, [
    ["29.3%/32.3%/31.1%/34.1%", "58.6%/64.6%/62.2%/68.2%"],
    ["30% of their original effectiveness", "60% of their original effectiveness"]
  ]),
  sync_highlight_values: ["58.6%/64.6%/62.2%/68.2%", "60.0%/60.0%/60.0%/60.0%", "60%"]
});
Object.assign(jp.skill1, {
  sync_description: withSyncValues(jp.skill1.description, [
    ["39.0%/43.0%/41.4%/45.4%", "78.1%/86.1%/82.9%/90.9%"],
    ["19.5%/21.5%/20.7%/22.7%", "39.0%/43.0%/41.4%/45.4%"],
    ["14.6%/16.1%/15.5%/17.0%", "19.5%/21.5%/20.7%/22.7%"],
    ["4.9%/5.4%/5.2%/5.7%", "9.8%/10.8%/10.4%/11.4%"]
  ]),
  sync_highlight_values: ["39.0%/43.0%/41.4%/45.4%", "78.1%/86.1%/82.9%/90.9%", "19.5%/21.5%/20.7%/22.7%", "9.8%/10.8%/10.4%/11.4%"]
});
Object.assign(jp.skill2, {
  sync_description: withSyncValues(jp.skill2.description, [["29.3%/32.3%/31.1%/34.1%", "58.6%/64.6%/62.2%/68.2%"]]),
  sync_highlight_values: ["58.6%/64.6%/62.2%/68.2%", "5/5/5/5"]
});
Object.assign(jp.skill3, {
  sync_description: withSyncValues(jp.skill3.description, [
    ["29.3%/32.3%/31.1%/34.1%", "58.6%/64.6%/62.2%/68.2%"],
    ["３０%", "６０%"]
  ]),
  sync_highlight_values: ["58.6%/64.6%/62.2%/68.2%", "60.0%/60.0%/60.0%/60.0%", "６０%"]
});
window.characterSkillsData["코토네"] = {
  "name": "시오미 코토네",
  "skill1": {
    "name": "현의 선율",
    "element": "버프",
    "type": "버프",
    "sp": 20,
    "cool": 0,
    "description": "3턴 동안 동료 1명의 크리티컬 효과가 증가한다(증가 수치는 시오미 코토네의 공격력에 기반, 최대 4684/5164/4972/5452의 공격력 적용, 크리티컬 효과 19.5%/21.5%/20.7%/22.7% 증가, 3회 중첩 가능).\n목표가 『월하 동료』일 경우 목표에게 3턴 동안 『인연의 힘』 1중첩을 부여한다(3회 중첩 가능). 『운명의 수레바퀴』 상태에서는 해당 스킬 효과의 지속 시간이 2턴 연장된다.\n자신이 필드에 있을 때 목표의 『인연의 힘』 중첩 수에 따라 목표에게 해당하는 버프 효과를 부여한다.\n『인연의 힘』 1중첩: 공격력이 39.0%/43.0%/41.4%/45.4% 증가한다.\n『인연의 힘』 2중첩: 관통이 14.6%/16.1%/15.5%/17.0% 증가한다.\n『인연의 힘』 3중첩: 총 대미지 증폭이 4.9%/5.4%/5.2%/5.7% 증가한다.",
    "sync_description": "3턴 동안 동료 1명의 크리티컬 효과가 증가한다(증가 수치는 시오미 코토네의 공격력에 기반, 최대 4684/5164/4972/5452의 공격력 적용, 크리티컬 효과 39.0%/43.0%/41.4%/45.4% 증가, 3회 중첩 가능).\n목표가 『월하 동료』일 경우 목표에게 3턴 동안 『인연의 힘』 1중첩을 부여한다(3회 중첩 가능). 『운명의 수레바퀴』 상태에서는 해당 스킬 효과의 지속 시간이 2턴 연장된다.\n자신이 필드에 있을 때 목표의 『인연의 힘』 중첩 수에 따라 목표에게 해당하는 버프 효과를 부여한다.\n『인연의 힘』 1중첩: 공격력이 78.1%/86.1%/82.9%/90.9% 증가한다.\n『인연의 힘』 2중첩: 관통이 19.5%/21.5%/20.7%/22.7% 증가한다.\n『인연의 힘』 3중첩: 총 대미지 증폭이 9.8%/10.8%/10.4%/11.4% 증가한다.",
    "sync_highlight_values": [
      "39.0%/43.0%/41.4%/45.4%",
      "78.1%/86.1%/82.9%/90.9%",
      "19.5%/21.5%/20.7%/22.7%",
      "9.8%/10.8%/10.4%/11.4%"
    ]
  },
  "skill2": {
    "name": "달의 불꽃",
    "element": "화염",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "적 전체에 공격력 53.9%/59.4%/57.2%/62.7%의 화염 속성 대미지를 3회 준다. 적의 수가 5명에서 1명씩 줄어들 때마다 대미지가 25%씩 증가한다.\n『월하 동료』의 『인연의 힘』이 3중첩에 도달했을 경우 1턴 동안 적이 받는 대미지가 추가로 증가한다(증가 수치는 시오미 코토네의 공격력에 기반, 최대 4684/5164/4972/5452의 공격력 적용, 받는 대미지 29.3%/32.3%/31.1%/34.1% 추가 증가).\n『운명의 수레바퀴』 상태에서는 해당 스킬의 대미지가 292.8%/322.8%/310.8%/340.8% 추가 증가하고, 스킬 효과의 지속 시간이 2턴 연장되며, 스킬이 대미지를 주었을 경우 적합성을 무시하고 목표의 다운 수치를 2/2/2/2포인트 차감한다.",
    "sync_description": "적 전체에 공격력 53.9%/59.4%/57.2%/62.7%의 화염 속성 대미지를 3회 준다. 적의 수가 5명에서 1명씩 줄어들 때마다 대미지가 25%씩 증가한다.\n『월하 동료』의 『인연의 힘』이 3중첩에 도달했을 경우 1턴 동안 적이 받는 대미지가 추가로 증가한다(증가 수치는 시오미 코토네의 공격력에 기반, 최대 4684/5164/4972/5452의 공격력 적용, 받는 대미지 58.6%/64.6%/62.2%/68.2% 추가 증가).\n『운명의 수레바퀴』 상태에서는 해당 스킬의 대미지가 292.8%/322.8%/310.8%/340.8% 추가 증가하고, 스킬 효과의 지속 시간이 2턴 연장되며, 스킬이 대미지를 주었을 경우 적합성을 무시하고 목표의 다운 수치를 5/5/5/5포인트 차감한다.",
    "sync_highlight_values": [
      "58.6%/64.6%/62.2%/68.2%",
      "5/5/5/5"
    ]
  },
  "skill3": {
    "name": "염화·떠오르는 붉은 달",
    "element": "버프",
    "type": "버프",
    "sp": 22,
    "cool": 2,
    "description": "쿨타임: 추가 턴이 아닌 턴 2개\n아군 전체의 공격력이 증가한다(증가 수치는 시오미 코토네의 공격력 기반, 최대 4684/5164/4972/5452의 공격력 적용, 공격력 29.3%/32.3%/31.1%/34.1% 증가).\n스킬 메인 목표가 자신과 『월하 동료』 이외의 동료일 경우, 해당 동료가 『월하 동료』에게 부여한 모든 속성 버프 효과를 복사하여 『월하 동료』에게 1턴 동안 원본 수치의 30.0%/30.0%/30.0%/30.0%(『기본 복사 비율』)로 부여한다(일부 캐릭터 전용 효과 복사 불가).\n『운명의 수레바퀴』 상태에서는 해당 스킬 효과의 지속 시간이 1턴 연장된다.",
    "sync_description": "쿨타임: 추가 턴이 아닌 턴 2개\n아군 전체의 공격력이 증가한다(증가 수치는 시오미 코토네의 공격력 기반, 최대 4684/5164/4972/5452의 공격력 적용, 공격력 58.6%/64.6%/62.2%/68.2% 증가).\n스킬 메인 목표가 자신과 『월하 동료』 이외의 동료일 경우, 해당 동료가 『월하 동료』에게 부여한 모든 속성 버프 효과를 복사하여 『월하 동료』에게 1턴 동안 원본 수치의 60.0%/60.0%/60.0%/60.0%(『기본 복사 비율』)로 부여한다(일부 캐릭터 전용 효과 복사 불가).\n『운명의 수레바퀴』 상태에서는 해당 스킬 효과의 지속 시간이 1턴 연장된다.",
    "sync_highlight_values": [
      "58.6%/64.6%/62.2%/68.2%",
      "60.0%/60.0%/60.0%/60.0%"
    ]
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "버프",
    "type": "",
    "description": "2턴 동안 아군 전체의 크리티컬 효과가 19.5%/21.5%/20.7%/22.7% 증가하고, 『월하 동료』의 공격력이 24.4%/26.9%/25.9%/28.4% 추가로 증가한다. 『운명의 수레바퀴』 상태에서는 해당 스킬 효과의 지속 시간이 2턴 연장된다.",
    "cool": 4
  },
  "passive1": {
    "name": "선도",
    "element": "패시브",
    "description": "자신이 동료에게 버프 스킬을 사용한 후 3턴 동안 메인 목표의 공격력이 9.0% 증가한다(3회 중첩 가능).",
    "cool": 0
  },
  "passive2": {
    "name": "연결",
    "element": "패시브",
    "description": "자신이 인연의 힘을 부여할 때 2턴 동안 목표의 관통이 12.0% 증가한다.",
    "cool": 0
  }
};
window.enCharacterSkillsData["코토네"] = en;
window.jpCharacterSkillsData["코토네"] = jp;
window.cnCharacterSkillsData["코토네"] = {
  "name": "汐见琴音",
  "skill1": {
    "name": "琴奏之调",
    "element": "버프",
    "type": "버프",
    "sp": 20,
    "cool": 0,
    "description": "使1名同伴暴击效果提升（提升值将基于汐见琴音的攻击力,最多计入4684/5164/4972/5452攻击力使暴击效果提升19.5%/21.5%/20.7%/22.7%），持续3回合，上限3层。\n若目标是『月下伙伴』，则使目标获得1层『羁绊之力』，持续3回合，上限3层。处于『命运之轮』状态下，该技能效果的持续时间延长2回合。\n自身在场时，根据目标身上的『羁绊之力』层数，使其获得对应的增益效果。\n1层『羁绊之力』：攻击力提升39.0%/43.0%/41.4%/45.4%。\n2层『羁绊之力』：穿透提升14.6%/16.1%/15.5%/17.0%。\n3层『羁绊之力』：总伤害增幅提升4.9%/5.4%/5.2%/5.7%。",
    "sync_description": "使1名同伴暴击效果提升（提升值将基于汐见琴音的攻击力,最多计入4684/5164/4972/5452攻击力使暴击效果提升39.0%/43.0%/41.4%/45.4%），持续3回合，上限3层。\n若目标是『月下伙伴』，则使目标获得1层『羁绊之力』，持续3回合，上限3层。处于『命运之轮』状态下，该技能效果的持续时间延长2回合。\n自身在场时，根据目标身上的『羁绊之力』层数，使其获得对应的增益效果。\n1层『羁绊之力』：攻击力提升78.1%/86.1%/82.9%/90.9%。\n2层『羁绊之力』：穿透提升19.5%/21.5%/20.7%/22.7%。\n3层『羁绊之力』：总伤害增幅提升9.8%/10.8%/10.4%/11.4%。",
    "sync_highlight_values": [
      "39.0%/43.0%/41.4%/45.4%",
      "78.1%/86.1%/82.9%/90.9%",
      "19.5%/21.5%/20.7%/22.7%",
      "9.8%/10.8%/10.4%/11.4%"
    ]
  },
  "skill2": {
    "name": "月鸣之炎",
    "element": "화염",
    "type": "광역 피해",
    "sp": 20,
    "cool": 0,
    "description": "对所有敌人造成3次53.9%/59.4%/57.2%/62.7%攻击力的火焰属性伤害。敌人数量从5开始每减少1个伤害提升25%。\n若『月下伙伴』对象的『羁绊之力』层数达到3层，则额外使敌人受到伤害提升（提升值将基于汐见琴音的攻击力,最多计入4684/5164/4972/5452攻击力使受到伤害提升29.3%/32.3%/31.1%/34.1%），持续1回合。\n处于『命运之轮』状态下，该技能伤害额外提升292.8%/322.8%/310.8%/340.8%，且技能效果的持续时间延长2回合，若技能造成伤害则无视适应性削减目标2/2/2/2点倒地值。",
    "sync_description": "对所有敌人造成3次53.9%/59.4%/57.2%/62.7%攻击力的火焰属性伤害。敌人数量从5开始每减少1个伤害提升25%。\n若『月下伙伴』对象的『羁绊之力』层数达到3层，则额外使敌人受到伤害提升（提升值将基于汐见琴音的攻击力,最多计入4684/5164/4972/5452攻击力使受到伤害提升58.6%/64.6%/62.2%/68.2%），持续1回合。\n处于『命运之轮』状态下，该技能伤害额外提升292.8%/322.8%/310.8%/340.8%，且技能效果的持续时间延长2回合，若技能造成伤害则无视适应性削减目标5/5/5/5点倒地值。",
    "sync_highlight_values": [
      "58.6%/64.6%/62.2%/68.2%",
      "5/5/5/5"
    ]
  },
  "skill3": {
    "name": "焰华·绯月昂扬",
    "element": "버프",
    "type": "버프",
    "sp": 22,
    "cool": 2,
    "description": "冷却时间：2个非额外回合\n使所有同伴攻击力提升（提升值将基于汐见琴音的攻击力,最多计入4684/5164/4972/5452攻击力使攻击力提升29.3%/32.3%/31.1%/34.1%）。\n若技能主目标为自身和『月下伙伴』以外的同伴，复制所有该同伴施加给『月下伙伴』的属性增益效果，并添加给『月下伙伴』，效果值为原本的30.0%/30.0%/30.0%/30.0%（『基础复制比例』），持续1回合（无法复制部分角色专属效果）。\n处于『命运之轮』状态下，该技能效果的持续时间延长1回合。",
    "sync_description": "冷却时间：2个非额外回合\n使所有同伴攻击力提升（提升值将基于汐见琴音的攻击力,最多计入4684/5164/4972/5452攻击力使攻击力提升58.6%/64.6%/62.2%/68.2%）。\n若技能主目标为自身和『月下伙伴』以外的同伴，复制所有该同伴施加给『月下伙伴』的属性增益效果，并添加给『月下伙伴』，效果值为原本的60.0%/60.0%/60.0%/60.0%（『基础复制比例』），持续1回合（无法复制部分角色专属效果）。\n处于『命运之轮』状态下，该技能效果的持续时间延长1回合。",
    "sync_highlight_values": [
      "58.6%/64.6%/62.2%/68.2%",
      "60.0%/60.0%/60.0%/60.0%"
    ]
  },
  "skill_highlight": {
    "name": "HIGHLIGHT",
    "element": "버프",
    "type": "",
    "description": "使所有同伴暴击效果提升19.5%/21.5%/20.7%/22.7%，『月下伙伴』的攻击力额外提升24.4%/26.9%/25.9%/28.4%，持续2回合。处于『命运之轮』状态下，该技能效果的持续时间延长2回合。",
    "cool": 4
  },
  "passive1": {
    "name": "先导",
    "element": "패시브",
    "description": "自身对同伴使用增益技能后，使主目标的攻击提升9.0%，持续3回合，上限3层。",
    "cool": 0
  },
  "passive2": {
    "name": "联结",
    "element": "패시브",
    "description": "自身添加羁绊之力时，使目标的穿透提升12.0%，持续2回合。",
    "cool": 0
  }
};
