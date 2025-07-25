function getWonderWeaponOptions() {
  return [
      "천상의 별",
      "태고의 역장",
      "메커니컬 심판자",
      "작열의 연옥",
      "플라스마 섬멸자",
      "하이브 가드",
      "야수의 이빨",
      "크리스탈 트레저",
      "마그네틱 스톰",
      "망자의 눈",
      "망령의 저주",
      "메아리의 절규",
      "7일의 불꽃",
    ];
}

const matchWeapons = {
  "천상의 별" :  {
    name_en : "Starry Compass",
    name_jp : "天の星",
    effect : "공격력이 56.0% 증가한다.\n빛의 고리 『성반만상』: 원더의 『부연』 중첩 수에 따라 다음 효과가 활성화된다.\n5중첩: 모든 적 방어력 22.0% 감소\n10중첩: 모든 괴도 효과 명중 18.0% 증가\n15중첩: 모든 괴도 염동 대미지 12.0% 증가\n전투가 시작되면 『부연』 10중첩을 획득하고, 적에게 대미지를 줄 때마다 원더가 『부연』을 1중첩 획득한다. 원더 턴 종료 시 『부연』 5중첩을 소모한다.",
    effect_en: "Increase Attack by 56.0%.\nAura - Universal Astrolabe: Gain effects based on number of Guidance stacks.\n5 stacks: Decrease all foes' Defense by 22.0%.\n10 stacks: Increase party's ailment accuracy by 18.0%.\n15 stacks: Increase party's Psychokinesis damage by 12.0%.\nStart battle with 10 stacks of Guidance. Gain 1 stack when dealing damage, lose 5 at end of turn.",
    effect_jp: "攻撃力が56.0%上昇する。\nオーラ『星盤満象』：導きのスタック数に応じて効果を得る。\n5スタック：全敵の防御力が22.0%低下。\n10スタック：味方全体の異常命中率が18.0%上昇。\n15スタック：味方全体の念動ダメージが12.0%上昇。\n戦闘開始時に導き10スタックを獲得し、ダメージを与えるたびに1スタック獲得、ターン終了時に5スタック消費。"
  },
  "태고의 역장" :  {
    name_en : "Arc Knife",
    name_jp : "時の逆響",
    effect : "공격력이 56.0% 증가한다. 적이 원소 이상일 시, 2턴 동안 자신의 공격력이 20.0% 증가한다. 원소 이상 상태를 줄 때, 효과 명중이 30.0% 증가한다.\n적을 공격할 시, 2턴 동안 적의 방어력이 9.0% 감소한다. 적이 원소 이상 상태를 한 종류 가지고 있을 때마다, 해당 효과를 추가로 1회 발동한다(4회 중첩 가능).",
    effect_en: "Increase Attack by 56.0%.\nAfter inflicting an elemental ailment, increase Attack by 20.0% for 2 turns and increase ailment accuracy by 30.0%.\nWhen attacking, decrease enemy Defense by 9.0% for 2 turns. This effect is applied once per ailment type (up to 4).",
    effect_jp: "攻撃力が56.0%上昇する。\n属性異常付与後、2ターンの間攻撃力が20.0%上昇し、異常命中率が30.0%上昇する。\n攻撃時、敵の防御力を9.0%低下（2ターン）。敵の異常状態ごとに1回追加発動（最大4回）。"
  },
  "메커니컬 심판자" :  {
    name_en : "Ex Machina",
    name_jp : "機械の裁き",
    effect : "공격력이 56.0% 증가한다.\n빛의 고리: 원더가 필드에 있을 경우 모든 괴도의 공격력이 240포인트 증가한다.\n전투 진입 시 페르소나에 따라 상응하는 속성 대미지가 34.0% 증가하고, 기타 괴도는 전자의 40%에 해당하는 효과를 획득한다.",
    effect_en: "Increase Attack by 56.0%.\nAura: When user is on the field, increase party's Attack by 240.\nAt battle start, increase damage of the Persona's attribute by 34.0%, and 40% of that value for other allies.",
    effect_jp: "攻撃力が56.0%上昇する。\nオーラ：ワンダーが場にいる時、味方全体の攻撃力が240ポイント上昇する。\n戦闘開始時、ペルソナの属性ダメージが34.0%上昇し、他の仲間はその40%の効果を得る。"
  },
  "작열의 연옥" :  {
    name_en : "Flame's Inferno",
    name_jp : "炎の地獄",
    effect: "공격력이 56.0% 증가한다.\n빛의 고리 『연옥의 세례』: 원더의 『정화의 불꽃』 중첩 수에 따라 다음 효과가 활성화된다.\n1중첩: 자신의 공격력이 360포인트 증가하고, 다른 괴도의 공격력이 300포인트 증가한다.\n2중첩: 자신이 주는 대미지가 16.0% 증가하고, 다른 괴도가 주는 대미지가 6.0% 증가한다.\n3중첩: 모든 괴도의 화염 대미지가 24.0% 증가한다.\n전투 시작 시 『정화의 불꽃』 2중첩을 획득하며, 모든 괴도가 페르소나 스킬로 화염 대미지를 줄 때마다 『정화의 불꽃』 1중첩을 획득하고, 각 『정화의 불꽃』은 3턴 간 지속된다.",
    effect_en: "Increase Attack by 56.0%.\nAura - Purgatory's Baptism: Effects based on the number of Cleansing Flame stacks.\n1 stack: User's Attack +360 points, others +300 points.\n2 stacks: User's damage +16.0%, others +6.0%.\n3 stacks: All allies' Fire damage +24.0%.\nAt battle start, gain 2 stacks of Cleansing Flame. Whenever any ally deals Fire damage with a Persona skill, gain 1 stack of Cleansing Flame, each lasting 3 turns.",
    effect_jp: "攻撃力が56.0%上昇する。\nオーラ『煉獄の洗礼』：『浄化の炎』のスタック数に応じて効果が発動する。\n1スタック：自身の攻撃力+360ポイント、他の怪盗+300ポイント。\n2スタック：自身の与ダメージ+16.0%、他+6.0%。\n3スタック：全員の火炎ダメージ+24.0%。\n戦闘開始時に『浄化の炎』を2スタック獲得。味方がペルソナスキルで火炎ダメージを与えるたびに1スタック獲得し、各『浄化の炎』は3ターン持続する。"
  },
  "플라스마 섬멸자" :  {
    name_en : "Plasma Destroyer",
    name_jp : "プラズマの破壊者",
    effect: "공격력이 60.7% 증가한다.\n전투가 시작될 때 혹은 임의의 캐릭터가 페르소나 스킬을 사용해 만능 속성 대미지를 준 후 『공명』 효과가 발동되며 2턴 동안 지속된다.\n『공명』: 현재 라인업이 활성화한 소나타 효과 수량에 따라 다음 효과가 발동된다.\n소나타 최소 1개: 자신의 공격력이 30.0% 증가하고, 만능 속성 대미지가 12.0% 증가하며, 모든 괴도가 효과의 50%를 획득한다.\n소나타 최소 2개: 모든 괴도의 크리티컬 효과가 18.0% 증가한다.",
    effect_en: "Increase Attack by 60.7%.\nAt battle start or after a Persona skill deals Almighty damage, Resonance is triggered for 2 turns.\nResonance: Based on the number of active Sonata effects.\n1+ Sonata: User's Attack +30.0%, Almighty damage +12.0%, all allies get 50% of this.\n2+ Sonata: All allies' Critical Damage +18.0%.",
    effect_jp: "攻撃力が60.7%上昇する。\n戦闘開始時または任意のキャラが万能属性ダメージを与えると『共鳴』が2ターン発動。\n『共鳴』：アクティブなソナタ効果数に応じて効果発動。\nソナタ1個以上：自身攻撃力+30.0%、万能ダメージ+12.0%、味方は50%を共有。\nソナタ2個以上：味方全体のクリティカル効果+18.0%。"
  },
  "하이브 가드" :  {
    name_en : "Hive Guard",
    name_jp : "ハイブガード",
    effect: "효과 명중이 68.0% 증가한다.\n자신이 주는 원소 이상|정신 이상의 부여율이 25.0% 증가하고, 적이 임의의 이상 상태에 빠지면 해당 적을 추가로 『기생 감염』에 빠지게 해 3턴 동안 받는 대미지가 20.0% 증가한다.\n필드에 『기생 감염』 상태에 빠진 적이 있으면 자신의 효과 명중이 8.0% 증가하고, 공격력이 14.0% 증가한다.",
    effect_en: "Increase Effect Hit Rate by 68.0%.\nIncrease user's elemental/mental ailment infliction rate by 25.0%. When a foe is afflicted, also inflict Parasitic Infection, making them take 20.0% more damage for 3 turns.\nIf a foe with Parasitic Infection is on the field, increase user's Effect Hit Rate by 8.0% and Attack by 14.0%.",
    effect_jp: "効果命中が68.0%上昇する。\n自身の属性・精神異常付与率が25.0%上昇。敵が異常状態になると『寄生感染』を付与し、3ターンの間受けるダメージが20.0%増加。\n『寄生感染』状態の敵がいる時、自身の効果命中が8.0%、攻撃力が14.0%上昇する。"
  },
  "야수의 이빨" :  {
    name_en : "Animal's Fang",
    name_jp : "動物の牙",
    effect: "공격력이 56.0% 증가하며,\n페르소나 스킬로 대미지를 줄 경우 『사냥 리듬』 3중첩을 획득하고, 대미지 2회당 추가로 『사냥 리듬』 1중첩을 획득한다. 『사냥 리듬』: 1턴 동안 자신의 대미지가 6.6% 증가한다(5회 중첩 가능). 『사냥 리듬』이 3|5중첩에 도달하면 추가로 크리티컬 확률이 12.0% | 18.0% 증가하고, 크리티컬 효과가 24.0% | 36.0% 증가한다.",
    effect_en: "Increase Attack by 56.0%.\nWhen dealing damage with a Persona skill, gain 3 Hunter's Rhythm stacks, plus 1 more every 2 hits.\nHunter's Rhythm: Increase damage by 6.6% for 1 turn (max 5). At 3/5 stacks, also increase Critical Rate by 12.0% / 18.0% and Critical Damage by 24.0% / 36.0%.",
    effect_jp: "攻撃力が56.0%上昇する。\nペルソナスキルでダメージを与えると『狩猟リズム』を3スタック獲得し、2回のダメージごとにさらに1スタック獲得。\n『狩猟リズム』：1ターンの間、自身の与ダメージが6.6%上昇（最大5）。3/5スタック時、クリティカル率が12.0% / 18.0%、クリティカルダメージが24.0% / 36.0%上昇。"
  },
  "크리스탈 트레저" :  {
    name_en : "Glimmer",
    name_jp : "水晶の宝箱",
    effect: "공격력이 56.0% 증가한다.\n축복 속성 대미지 및 치료 효과가 22.0% 증가한다.\n턴 시작 시 1명의 괴도에게 축복 효과를 제공하며, 해당 괴도에게 16.0%의 대미지 보너스를 제공한다. 만약 이 괴도가 축복 속성 괴도일 경우, 16.0%의 축복 대미지 보너스를 추가로 획득한다.\n이후 2턴마다 같은 효과가 1회 발동한다.",
    effect_en: "Increase Attack by 56.0%.\nIncrease Bless damage and healing by 22.0%. At start of turn, grant Blessing to 1 ally, increasing damage by 16.0%.\nIf the ally's attribute is Bless, grant an additional 16.0% Bless damage. Reactivates every 2 turns.",
    effect_jp: "攻撃力が56.0%上昇する。\n祝福属性ダメージと回復効果が22.0%上昇。\nターン開始時に味方1人に祝福を付与し、与ダメージが16.0%上昇。祝福属性ならさらに祝福ダメージ+16.0%。2ターンごとに再発動。"
  },
  "마그네틱 스톰" :  {
    name_en : "Magnetic Storm",
    name_jp : "磁気の嵐",
    effect: "공격력이 56.0% 증가한다.\n전투 진입 시 자신의 크리티컬 확률이 19.0% 증가한다.\n전투 중 임의의 캐릭터가 페르소나 스킬을 사용해 전격 속성 대미지를 준 후, 모든 캐릭터에 2턴 동안 지속되는 『자력 플라즈마』를 추가한다. 『자력 플라즈마』: 주는 대미지가 18.0% 증가하고, 전격 속성 대미지를 줄 때 크리티컬 효과가 18.0% 증가한다.",
    effect_en: "Increase Attack by 56.0%.\nAt battle start, increase user's Critical Rate by 19.0%.\nAfter any ally deals Electric damage with a Persona skill, grant all allies Magnetic Plasma for 2 turns: Damage dealt +18.0% and Electric Critical Damage +18.0%.",
    effect_jp: "攻撃力が56.0%上昇する。\n戦闘開始時、クリティカル率が19.0%上昇。\n戦闘中、誰かがペルソナスキルで電撃ダメージを与えると、全員に『磁力プラズマ』2ターン：与ダメ+18.0%、電撃クリティカル効果+18.0%。"
  },
  "망자의 눈" :  {
    name_en : "Eye of Obsequies",
    name_jp : "死の眼",
    effect: "공격력이 56.0% 증가한다.\n적에게 이상 상태 부여 시 목표의 효과 저항을 12.0%, 방어력을 10% 감소시키고, 자신의 공격력이 20.0% 증가한다(2회 중첩 가능). 3턴 동안 지속되며 중첩마다 독립적으로 계산한다. 2중첩 도달 시 적이 받는 물리 대미지가 28.0% 심화되며 3턴 동안 지속된다.",
    effect_en: "Increase Attack by 56.0%.\nAfter inflicting a status ailment on an enemy, reduce its ailment resistance by 12.0% and Defense by 10%, and increase user's Attack by 20.0% (up to 2 stacks).\nLasts for 3 turns, and each stack is calculated independently.\nAt 2 stacks, the target takes 28.0% more Physical damage for 3 turns.",
    effect_jp: "攻撃力が56.0%上昇する。\n敵に状態異常を付与すると、対象の異常耐性を12.0%、防御力を10%低下させ、自身の攻撃力が20.0%上昇する（最大2回累積可能）。\n効果は3ターン持続し、スタックごとに独立して計算される。\n2スタックに達すると、敵が受ける物理ダメージが28.0%増加し、3ターン持続する。"
  },
  "망령의 저주" :  {
    name_en : "Curse of the Phantom",
    name_jp : "幻の呪い",
    effect: "효과 명중이 68.0% 증가한다.\n임의의 캐릭터가 페르소나 스킬을 사용해 주원 속성 대미지를 준 후, 원더가 70%의 기본 확률로 목표에게 『악령의 저주』를 부여한다. 자신이 『악령의 저주』를 보유한 적 공격 시, 공격력이 36.0% 증가한다.\n『악령의 저주』: 3턴 동안 방어가 25.0% 감소하고, 받는 주원 속성 대미지가 16.0% 증가한다.",
    effect_en: "Increase Effect Hit Rate by 68.0%.\nWhen any ally deals Curse damage, 70% chance to inflict Phantom's Curse on the target. Attacking a cursed foe increases Attack by 36.0%.\nPhantom's Curse: For 3 turns, Defense -25.0% and Curse damage taken +16.0%.",
    effect_jp: "効果命中が68.0%上昇する。\n味方が呪怨属性ダメージを与えると、70%の確率で敵に『悪霊の呪い』を付与。呪われた敵を攻撃すると攻撃力+36.0%。\n『悪霊の呪い』：3ターン、防御力-25.0%、呪怨ダメージ+16.0%。"
  },
  "메아리의 절규" :  {
    name_en : "All In",
    name_jp : "万里一空",
    effect: "치료 보너스, 실드 보너스가 40.0% 증가한다.\n빛의 고리: 주인공이 필드에 있을 경우 모든 괴도의 방어력이 30.0% 증가한다. 동료에게 스킬 사용 시, 메인 목표는 자신의 최대 생명 20.0%의 회복 효과를 획득한다.",
    effect_en: "Increase healing and shield by 40.0%.\nAura: When user is on the field, increase party's Defense by 30.0%.\nAfter using a skill on an ally, restore 20.0% of the main target's max HP.",
    effect_jp: "回復量、シールドが40.0%上昇する。\nオーラ：自身が場にいる時、味方全体の防御力が30.0%上昇する。\n味方にスキルを使用した時、対象の最大HP20.0%を回復する。"
  },
  "7일의 불꽃" :  {
    name_en : "Sennight Inferno",
    name_jp : "七日ノ焔",
    effect : "공격력이 56.0% 증가한다. 다른 속성의 페르소나 1개 장착 시마다 적에게 주는 대미지가 12.0% 증가하고, 최대 3회 중첩된다. 적 다운 시 100% 기본 확률로 적의 방어력이 30.0% 감소한다.",
    effect_en: "Increase Attack by 56.0%.\nFor each Persona of a different attribute equipped, increase damage by 12.0% (max 3).\nAfter knocking down an enemy, decrease its Defense by 30.0% for 1 turn.",
    effect_jp: "攻撃力が56.0%上昇する。\n異なる属性のペルソナを装備するごとに与ダメージが12.0%上昇（最大3回）。\n敵をダウンさせた後、1ターンの間防御力が30.0%低下する。"
  }
}
