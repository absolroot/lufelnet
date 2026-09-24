window.WeaponData = window.WeaponData || {};
window.enCharacterWeaponData = window.enCharacterWeaponData || {};
window.jpCharacterWeaponData = window.jpCharacterWeaponData || {};
window.cnCharacterWeaponData = window.cnCharacterWeaponData || {};

const kotoneWeapons = {
  kr: { name: "코토네", four: "아메노누보코", five: "베트리 벨 무루가", fourDesc: "공격력이 12.0%/12.0%/16.0%/16.0%/20.0%/20.0%/24.0% 증가한다.\n버프 스킬 사용 후 3턴 동안 자신의 공격력이 7.3%/9.6%/9.6%/11.9%/11.9%/14.2%/14.2% 증가한다. 최대 3회 중첩된다.", fiveDesc: "공격력이 30.0%/30.0%/39.0%/39.0%/48.0%/48.0%/57.0% 증가한다.\n『월하의 동료』의 『삭망월』이 5레벨 이상이면 자신의 스킬 효과 증폭이 10.0%/13.0%/13.0%/16.0%/16.0%/19.0%/19.0% 증가한다. 『인연의 힘』을 보유한 동료는 중첩마다 크리티컬 효과가 6.0%/7.8%/7.8%/9.6%/9.6%/11.4%/11.4% 증가한다." },
  en: { name: "Kotone", four: "Ame-no-Nuboko", five: "Vetri Vel Muruga", fourDesc: "Increase Attack by 12.0%/12.0%/16.0%/16.0%/20.0%/20.0%/24.0%.\nWhen granting buffs, increase Kotone Shiomi's Attack by 7.3%/9.6%/9.6%/11.9%/11.9%/14.2%/14.2% for 3 turns. Stacks up to 3 times.", fiveDesc: "Increase Attack by 30.0%/30.0%/39.0%/39.0%/48.0%/48.0%/57.0%.\nWhen the ally in the Arcana Link state reaches Lunar Bond 5 or higher, gain Skill Amplification equal to 10.0%/13.0%/13.0%/16.0%/16.0%/19.0%/19.0%. When an ally has Powerful Bond, increase their critical damage by 6.0%/7.8%/7.8%/9.6%/9.6%/11.4%/11.4% for each stack." },
  jp: { name: "汐見 琴音", four: "天沼矛", five: "孔雀御前・改", fourDesc: "攻撃力が12.0%/12.0%/16.0%/16.0%/20.0%/20.0%/24.0%上昇する。\n強化効果を付与した時、３ターンの間、自身の攻撃力が7.3%/9.6%/9.6%/11.9%/11.9%/14.2%/14.2%上昇する。最大３つまで累積できる。", fiveDesc: "攻撃力が30.0%/30.0%/39.0%/39.0%/48.0%/48.0%/57.0%上昇する。\n『月下の仲間』状態の味方の『ルネーション』が５以上の時、10.0%/13.0%/13.0%/16.0%/16.0%/19.0%/19.0%のスキル成長効果上昇を獲得する。『絆の力』を獲得している味方は、１つごとにクリティカルダメージが6.0%/7.8%/7.8%/9.6%/9.6%/11.4%/11.4%上昇する。" },
  cn: { name: "汐见琴音", four: "天沼矛", five: "孔雀御前・改", fourDesc: "攻击力提升12.0%/12.0%/16.0%/16.0%/20.0%/20.0%/24.0%。\n自身使用增益技能后，使自身攻击力提升7.3%/9.6%/9.6%/11.9%/11.9%/14.2%/14.2%，持续3回合，上限3层。", fiveDesc: "攻击力提升30.0%/30.0%/39.0%/39.0%/48.0%/48.0%/57.0%。\n『月下伙伴』的朔望月大于等于5级时，自身技能效果增幅提升10.0%/13.0%/13.0%/16.0%/16.0%/19.0%。拥有『羁绊之力』的同伴，每有1层『羁绊之力』，暴击效果提升6.0%/7.8%/7.8%/9.6%/9.6%/11.4%/11.4%。" }
};
function makeWeapons(locale) { const w = kotoneWeapons[locale]; return { name: w.name, "weapon4-1": { name: w.four, health: 1807.87, attack: 570.52, defense: 334.73, skill_name: "", description: w.fourDesc }, "weapon5-1": { name: w.five, health: 2259.46, attack: 713.51, defense: 418.4, skill_name: "", description: w.fiveDesc } }; }
window.WeaponData["코토네"] = {
  "name": "코토네",
  "weapon4-1": {
    "name": "아메노누보코",
    "health": 1807.87,
    "attack": 570.52,
    "defense": 334.73,
    "skill_name": "",
    "description": "공격력이 12.0%/12.0%/16.0%/16.0%/20.0%/20.0%/24.0% 증가한다.\n자신이 버프 스킬을 사용한 후 3턴 동안 자신의 공격력이 7.3%/9.6%/9.6%/11.9%/11.9%/14.2%/14.2% 증가한다(3회 중첩 가능)."
  },
  "weapon5-1": {
    "name": "공작·개조",
    "health": 2259.46,
    "attack": 713.51,
    "defense": 418.4,
    "highlight": true,
    "skill_name": "",
    "description": "공격력이 30.0%/30.0%/39.0%/39.0%/48.0%/48.0%/57.0% 증가한다.\n『월하 동료』의 삭망월 레벨이 5레벨 이상일 때 자신의 스킬 효과 증폭이 10.0%/13.0%/13.0%/16.0%/16.0%/19.0%/19.0% 증가한다.\n『인연의 힘』을 보유한 동료는 『인연의 힘』 1중첩당 크리티컬 효과가 6.0%/7.8%/7.8%/9.6%/9.6%/11.4%/11.4% 증가한다."
  }
};
window.enCharacterWeaponData["코토네"] = makeWeapons("en");
window.jpCharacterWeaponData["코토네"] = makeWeapons("jp");
window.cnCharacterWeaponData["코토네"] = {
  "name": "汐见琴音",
  "weapon4-1": {
    "name": "天沼矛",
    "health": 1807.87,
    "attack": 570.52,
    "defense": 334.73,
    "skill_name": "",
    "description": "攻击力提升12.0%/12.0%/16.0%/16.0%/20.0%/20.0%/24.0%\n自身使用增益技能后，使自身攻击力提升7.3%/9.6%/9.6%/11.9%/11.9%/14.2%/14.2%，持续3回合，上限3层。"
  },
  "weapon5-1": {
    "name": "孔雀御前・改",
    "health": 2259.46,
    "attack": 713.51,
    "defense": 418.4,
    "skill_name": "",
    "description": "攻击力提升30.0%/30.0%/39.0%/39.0%/48.0%/48.0%/57.0%\n『月下伙伴』的朔望月大于等于5级时，自身技能效果增幅提升10.0%/13.0%/13.0%/16.0%/16.0%/19.0%/19.0%。\n拥有『羁绊之力』的同伴，每有1层『羁绊之力』，暴击效果提升6.0%/7.8%/7.8%/9.6%/9.6%/11.4%/11.4%。"
  }
};
