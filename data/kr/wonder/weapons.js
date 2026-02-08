function getWonderWeaponOptions() {
  return [
    "엔트로피·제로",
    "천상의 별",
    "태고의 역장",
    "메커니컬 심판자",
    "작열의 연옥",
    "설원의 침묵",
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

window.matchWeapons = {
  "엔트로피·제로": {
    element: "핵열",
    name_en: "Entropy Zero",
    name_jp: "エントロピー零",
    where_to_get: "Shop",
    release: "YUI·스텔라",
    order: "15",
    effect: "공격력이 28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0% 증가한다.\n전투 진입 시 아군 전체에 『아토믹홀릭』을 2중첩 부여한다. 임의의 캐릭터가 페르소나 스킬로 핵열 속성 대미지를 줄 때 아군 전체에 『아토믹홀릭』을 1중첩 부여한다. 필드에 『아토믹홀릭』을 보유한 동료가 1명 있을 때마다 자신의 공격력이 50/58/66/75/83/91/100 증가한다.\n『아토믹홀릭』: 공격력이 5.5%/6.4%/7.3%/8.2%/9.2%/10.1%/11.0% 증가하고, 핵열 속성 대미지를 줄 때 크리티컬 효과가 5.0%/5.8%/6.7%/7.5%/8.3%/9.2%/10.0% 증가한다(2회 중첩 가능, 중첩마다 독립 계산). 효과는 2턴 동안 지속된다.",
    effect_en: "Increase Attack by 28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0%.\nAt battle start, grant [Atomic Holic] to all allies 2 stacks. When any ally deals Atomic damage with a Persona skill, grant [Atomic Holic] to all allies 1 stack. Increase Attack by 50/58/66/75/83/91/100 when there's 1 ally with [Atomic Holic] on the field.\n[Atomic Holic]: Increase Attack by 5.5%/6.4%/7.3%/8.2%/9.2%/10.1%/11.0% and Atomic Critical Damage by 5.0%/5.8%/6.7%/7.5%/8.3%/9.2%/10.0% (can stack up to 2 times, each stack is independent). Effect lasts for 2 turns.",
    effect_jp: "攻撃力が28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0%上昇する。\n戦闘開始時、味方全体に『アトミック・ホリック』を2重付与。誰かがペルソナスキルで原子力ダメージを与えると、味方全体に『アトミック・ホリック』を1重付与。『アトミック・ホリック』を持つ味方が1人いる場合、攻撃力が50/58/66/75/83/91/100上昇。\n『アトミック・ホリック』：攻撃力が5.5%/6.4%/7.3%/8.2%/9.2%/10.1%/11.0%上昇し、原子力クリティカルダメージが5.0%/5.8%/6.7%/7.5%/8.3%/9.2%/10.0%上昇（2重付与可能、それぞれの重ね合わせは独立して計算）。効果は2ターン間持続。",
    shard: [
      {
        desc: "교환 - 운명의 섬 {item-huobi-49.png} 800",
        desc_en: "Exchange - Land of Fortune {item-huobi-49.png} 800",
        dsec_jp: "交換 - {item-huobi-49.png} 800"
      }
    ]
  },
  "설원의 침묵": {
    element: "빙결",
    name_en: "Glacial Eternity",
    name_jp: "氷河永寂",
    where_to_get: "Shop",
    release: "미유·여름",
    order: "14",
    effect: "공격력이 28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0% 증가한다.\n전투 시작 시 아군 1명에게 [혹한의 각인]을 부여한다. 원더가 동료를 목표로 페르소나 스킬을 사용할 경우, 추가로 목표에게 [혹한의 각인]을 부여한다(필드에 1명만 보유 가능). 필드에 [혹한의 각인]을 보유한 아군이 존재할 경우, 원더의 주는 대미지가 17.5%/20.4%/23.3%/26.3%/29.2%/32.1%/35.0% 증가한다.\n[혹한의 각인]: 3턴 동안 주는 대미지가 8.0%/9.3%/10.7%/12.0%/13.3%/14.7%/16.0% 증가하고, 빙결 속성 대미지가 추가로 11.0%/12.8%/14.7%/16.5%/18.3%/20.2%/22.0% 증가한다.",
    effect_en: "Increase Attack by 28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0%.\nAt battle start, grant [Extreme Mark] to 1 ally. When WONDER uses a Persona skill on an ally, grant [Extreme Mark] to the target (only 1 ally can have this). If an ally with [Extreme Mark] is on the field, WONDER's damage is increased by 17.5%/20.4%/23.3%/26.3%/29.2%/32.1%/35.0%.\n[Extreme Mark]: Increase damage by 8.0%/9.3%/10.7%/12.0%/13.3%/14.7%/16.0% and Ice damage by 11.0%/12.8%/14.7%/16.5%/18.3%/20.2%/22.0% for 3 turns.",
    effect_jp: "攻撃力が28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0%上昇する。\n戦闘開始時、味方1人に『極限の印』を付与。ワンダーが味方にペルソナスキルを使用すると、その対象に『極限の印』を付与（味方は1人しか持てない）。『極限の印』を持つ味方がいる場合、ワンダーのダメージが17.5%/20.4%/23.3%/26.3%/29.2%/32.1%/35.0%増加する。\n『極限の印』：3ターン間、ダメージが8.0%/9.3%/10.7%/12.0%/13.3%/14.7%/16.0%増加、氷結属性ダメージが11.0%/12.8%/14.7%/16.5%/18.3%/20.2%/22.0%増加。",
    shard: [
      {
        desc: "교환 - 운명의 섬 {item-huobi-49.png} 800",
        desc_en: "Exchange - Land of Fortune {item-huobi-49.png} 800",
        dsec_jp: "交換 - {item-huobi-49.png} 800"
      }
    ]
  },
  "망령의 저주": {
    element: "주원",
    name_en: "Curse of the Phantom",
    name_jp: "幻の呪い",
    where_to_get: "Shop",
    release: "이치고",
    order: "13",
    effect: "효과 명중이 34.0%/39.7%/45.3%/51.0%/56.7%/62.3%/68.0% 증가한다.\n임의의 캐릭터가 페르소나 스킬을 사용해 주원 속성 대미지를 준 후, 원더가 70%의 기본 확률로 목표에게 『악령의 저주』를 부여한다. 자신이 『악령의 저주』를 보유한 적 공격 시, 공격력이 18.0%/21.0%/24.0%/27.0%/30.0%/33.0%/36.0% 증가한다.\n『악령의 저주』: 3턴 동안 방어가 12.5%/14.6%/16.7%/18.8%/20.8%/22.9%/25.0% 감소하고, 받는 주원 속성 대미지가 8.0%/9.3%/10.7%/12.0%/13.3%/14.7%/16.0% 증가한다.",
    effect_en: "Increase Ailment Accuracy Rate by 34.0%/39.7%/45.3%/51.0%/56.7%/62.3%/68.0%.\nWhen any ally deals Curse damage, 70% chance to inflict Phantom's Curse on the target. Attacking a cursed foe increases Attack by 18.0%/21.0%/24.0%/27.0%/30.0%/33.0%/36.0%.\nPhantom's Curse: For 3 turns, Defense -12.5%/14.6%/16.7%/18.8%/20.8%/22.9%/25.0% and Curse damage taken +8.0%/9.3%/10.7%/12.0%/13.3%/14.7%/16.0%.",
    effect_jp: "状態異常命中が34.0%/39.7%/45.3%/51.0%/56.7%/62.3%/68.0%上昇する。\n味方が呪怨属性ダメージを与えると、70%の確率で敵に『悪霊の呪い』を付与。呪われた敵を攻撃すると攻撃力+18.0%/21.0%/24.0%/27.0%/30.0%/33.0%/36.0%。\n『悪霊の呪い』：3ターン、防御力-12.5%/14.6%/16.7%/18.8%/20.8%/22.9%/25.0%、呪怨ダメージ+8.0%/9.3%/10.7%/12.0%/13.3%/14.7%/16.0%。",
    shard: [
      {
        desc: "교환 - 운명의 섬 {item-huobi-49.png} 800",
        desc_en: "Exchange - Land of Fortune {item-huobi-49.png} 800",
        dsec_jp: "交換 - {item-huobi-49.png} 800"
      }
    ]
  },
  "마그네틱 스톰": {
    element: "전격",
    name_en: "Magnetic Storm",
    name_jp: "磁気の嵐",
    where_to_get: "Shop",
    release: "유카리",
    order: "12",
    effect: "공격력이 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0% 증가한다.\n전투 진입 시 자신의 크리티컬 확률이 9.5%/11.1%/12.7%/14.2%/15.8%/17.4%/19.0% 증가한다.\n전투 중 임의의 캐릭터가 페르소나 스킬을 사용해 전격 속성 대미지를 준 후, 모든 캐릭터에 2턴 동안 지속되는 『자력 플라즈마』를 추가한다. 『자력 플라즈마』: 주는 대미지가 9.0%/10.5%/12.0%/13.5%/15.0%/16.5%/18.0% 증가하고, 전격 속성 대미지를 줄 때 크리티컬 효과가 9.0%/10.5%/12.0%/13.5%/15.0%/16.5%/18.0% 증가한다.",
    effect_en: "Increase Attack by 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%.\nAt battle start, increase user's Critical Rate by 9.5%/11.1%/12.7%/14.2%/15.8%/17.4%/19.0%.\nAfter any ally deals Electric damage with a Persona skill, grant all allies Magnetic Plasma for 2 turns: Damage dealt +9.0%/10.5%/12.0%/13.5%/15.0%/16.5%/18.0% and Electric Critical Damage +9.0%/10.5%/12.0%/13.5%/15.0%/16.5%/18.0%.",
    effect_jp: "攻撃力が28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%上昇する。\n戦闘開始時、クリティカル率が9.5%/11.1%/12.7%/14.2%/15.8%/17.4%/19.0%上昇。\n戦闘中、誰かがペルソナスキルで電撃ダメージを与えると、全員に『磁力プラズマ』2ターン：与ダメ+9.0%/10.5%/12.0%/13.5%/15.0%/16.5%/18.0%、電撃CRT倍率+9.0%/10.5%/12.0%/13.5%/15.0%/16.5%/18.0%。",
    shard: [
      {
        desc: "교환 - 운명의 섬 {item-huobi-49.png} 800",
        desc_en: "Exchange - Land of Fortune {item-huobi-49.png} 800",
        dsec_jp: "交換 - {item-huobi-49.png} 800"
      }
    ]
  },
  "하이브 가드": {
    element: "디버프",
    name_en: "Hive Guard",
    name_jp: "ハイブガード",
    where_to_get: "Palace 5",
    release: "Palace 5",
    order: "11",
    effect: "효과 명중이 68.0% 증가한다.\n자신이 주는 원소 이상|정신 이상의 부여율이 12.5%/14.6%/16.7%/18.8%/20.8%/22.9%/25.0% 증가하고, 적이 임의의 이상 상태에 빠지면 해당 적을 추가로 『기생 감염』에 빠지게 해 3턴 동안 받는 대미지가 10.0%/11.7%/13.3%/15.0%/16.7%/18.3%/20.0% 증가한다.\n필드에 『기생 감염』 상태에 빠진 적이 있으면 자신의 효과 명중이 4.0%/4.7%/5.3%/6.0%/6.7%/7.3%/8.0% 증가하고, 공격력이 7.0%/8.2%/9.3%/10.5%/11.7%/12.8%/14.0% 증가한다.",
    effect_en: "Increase Ailment Accuracy Rate by 68.0%.\nIncrease user's elemental/mental ailment infliction rate by 12.5%/14.6%/16.7%/18.8%/20.8%/22.9%/25.0%. When a foe is afflicted with any debuff, also inflict Parasitic Infection, making them take 10.0%/11.7%/13.3%/15.0%/16.7%/18.3%/20.0% more damage for 3 turns.\nIf a foe with Parasitic Infection is on the field, increase user's Ailment Accuracy Rate by 4.0%/4.7%/5.3%/6.0%/6.7%/7.3%/8.0% and Attack by 7.0%/8.2%/9.3%/10.5%/11.7%/12.8%/14.0%.",
    effect_jp: "状態異常命中が68.0%上昇する。\n自身の属性・精神異常付与率が12.5%/14.6%/16.7%/18.8%/20.8%/22.9%/25.0%上昇。敵が異常状態になると『寄生感染』を付与し、3ターンの間受けるダメージが10.0%/11.7%/13.3%/15.0%/16.7%/18.3%/20.0%増加。\n『寄生感染』状態の敵がいる時、自身の状態異常命中が4.0%/4.7%/5.3%/6.0%/6.7%/7.3%/8.0%、攻撃力が7.0%/8.2%/9.3%/10.5%/11.7%/12.8%/14.0%上昇する。",
    shard: [
      {
        desc: "팰리스5 개미굴 탐색도 100%",
        desc_en: "Palace 5-1 Progress 100%",
        desc_jp: "パレス 5-1 踏破率 100%"
      },
      {
        desc: "팰리스5 잡지사 탐색도 50%",
        desc_en: "Palace 5-2 Progress 50%",
        desc_jp: "パレス 5-2 踏破率 50%"
      },
      {
        desc: "팰리스5 잡지사 탐색도 100%",
        desc_en: "Palace 5-2 Progress 100%",
        desc_jp: "パレス 5-2 踏破率 100%"
      },
      {
        desc: "메멘토스4 - 미덕을 잃은 길 탐색도 레벨 10",
        desc_en: "Mementos 4 - Explorer LV 10",
        desc_jp: "メメントス 4 - Explorer LV 10"
      },
      {
        desc: "교환 - 비밀의 장소 {item-huobi-46.png} 500",
        desc_en: "Exchange - The Velvet Shop {item-huobi-46.png} 500",
        dsec_jp: "交換 - {item-huobi-46.png} 500"
      },
      {
        desc: "교환 - 낙원 백화 {item-huobi-50.png} 500",
        desc_en: "Exchange - Companio Shop {item-huobi-50.png} 500",
        dsec_jp: "交換 - {item-huobi-50.png} 500"
      }
    ]
  },
  "플라스마 섬멸자": {
    element: "만능",
    name_en: "Starsplitter",
    name_jp: "滅星の光刃",
    where_to_get: "Shop",
    release: "미오",
    order: "10",
    effect: "공격력이 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/60.7% 증가한다.\n전투가 시작될 때 혹은 임의의 캐릭터가 페르소나 스킬을 사용해 만능 속성 대미지를 준 후 『공명』 효과가 발동되며 2턴 동안 지속된다.\n『공명』: 현재 라인업이 활성화한 소나타 효과 수량에 따라 다음 효과가 발동된다.\n소나타 최소 1개: 자신의 공격력이 15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0% 증가하고, 만능 속성 대미지가 9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0% 증가하며, 모든 괴도가 효과의 50%를 획득한다.\n소나타 최소 2개: 모든 괴도의 크리티컬 효과가 9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0% 증가한다.",
    effect_en: "Increase Attack by 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/60.7%.\nAt the start of battle, or after any ally deals damage with an Almighty skill, activate Sympathy for 2 turns.\nSympathy: Based on the number of Flames of Desire effects active on the current party, activate the following effects.\n1 or more: Increase user's Attack by 15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0% and Almighty damage by 6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0%. Grant 50% of this effect to party.\n2 or more: Increase party's critical damage by 9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0%.",
    effect_jp: "攻撃力が28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/60.7%上昇する。\n戦闘開始時または任意の味方がスキルで万能属性ダメージを与えた後、２ターンの間、『共鳴』を発動する。\n『共鳴』：現在のパーティで発動している『欲望の共鳴』の数に応じて、以下の効果が発動する。\n１つ以上：自身の攻撃力が15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0%上昇し、万能属性ダメージが6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0%上昇する。味方全体はその効果量のうち５０%が上昇する。\n２つ以上：味方全体のクリティカルダメージが9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0%上昇する。",
    shard: [
      {
        desc: "교환 - 운명의 섬 {item-huobi-49.png} 800",
        desc_en: "Exchange - Land of Fortune {item-huobi-49.png} 800",
        dsec_jp: "交換 - {item-huobi-49.png} 800"
      }
    ]
  },
  "작열의 연옥": {
    element: "화염",
    name_en: "Purgatory",
    name_jp: "煉獄の短刀",
    where_to_get: "Shop",
    release: "카스미",
    order: "9",
    effect: "공격력이 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0% 증가한다.\n빛의 고리 『연옥의 세례』: 원더의 『정화의 불꽃』 중첩 수에 따라 다음 효과가 활성화된다.\n1중첩: 자신의 공격력이 180/240/240/300/300/360/360포인트 증가하고, 다른 괴도의 공격력이 150/200/200/249/249/300/300포인트 증가한다.\n2중첩: 자신이 주는 대미지가 8.0%/10.7%/10.7%/13.3%/13.3%/16.0%/16.0% 증가하고, 다른 괴도가 주는 대미지가 3.0%/4.0%/4.0%/5.0%/5.0%/6.0%/6.0% 증가한다.\n3중첩: 모든 괴도의 화염 대미지가 12.0%/16.0%/16.0%/20.0%/20.0%/24.0%/24.0% 증가한다.\n전투 시작 시 『정화의 불꽃』 2중첩을 획득하며, 모든 괴도가 페르소나 스킬로 화염 대미지를 줄 때마다 『정화의 불꽃』 1중첩을 획득하고, 각 『정화의 불꽃』은 3턴 간 지속된다.",
    effect_en: "Increase Attack by 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/60.7%.\nBaptism of Nothingness (Aura): Gain following effects based on number of Purging Blaze stacks.\n1 stack: Increase user's Attack by 180/240/240/300/300/360/360, and increase all other allies' Attack by 150/200/200/249/249/300/300.\n2 stacks: Increase user's damage by 8.0%/10.7%/10.7%/13.3%/13.3%/16.0%/16.0%, and increase all other allies' damage by 3.0%/4.0%/4.0%/5.0%/5.0%/6.0%/6.0%.\n3 stacks: Increase party's Fire damage by 7.0%/9.3%/9.3%/11.7%/11.7%/14.0%/14.0%.\nAt the start of battle, gain 2 Purging Blaze stacks. When party deals Fire damage to foes, gain 1 Purging Blaze stack. At the start of the user's turn, spend 1 Purging Blaze stack.",
    effect_jp: "攻撃力が28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/60.7%上昇する。\nオーラ『煉獄の洗礼』：『浄化の炎』の数に応じて以下の効果を付与する。\n「１つ：自身の攻撃力が180/240/240/300/300/360/360上昇、自身を除いた味方全体の攻撃力が150/200/200/249/249/300/300上昇」\n「２つ：自身の与ダメージが8.0%/10.7%/10.7%/13.3%/13.3%/16.0%/16.0%上昇、自身を除いた味方全体の与ダメージが3.0%/4.0%/4.0%/5.0%/5.0%/6.0%/6.0%上昇」\n「３つ：味方全体の火炎属性の与ダメージが7.0%/9.3%/9.3%/11.7%/11.7%/14.0%/14.0%上昇」\n戦闘開始時、『浄化の炎』を２つ獲得する。味方全体が敵に火炎属性ダメージを与えた時、『浄化の炎』を１つ獲得する。自身の開始時に『浄化の炎』を１つ消費する。",
    shard: [
      {
        desc: "교환 - 운명의 섬 {item-huobi-49.png} 800",
        desc_en: "Exchange - Land of Fortune {item-huobi-49.png} 800",
        dsec_jp: "交換 - {item-huobi-49.png} 800"
      }
    ]
  },
  "야수의 이빨": {
    element: "버프",
    name_en: "Abyss Fang",
    name_jp: "アビスファング",
    where_to_get: "Palace 4",
    release: "Palace 4",
    order: "8",
    effect: "공격력이 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0% 증가하며,\n페르소나 스킬로 대미지를 줄 경우 『사냥 리듬』 3중첩을 획득하고, 대미지 2회당 추가로 『사냥 리듬』 1중첩을 획득한다. 『사냥 리듬』: 1턴 동안 자신의 대미지가 3.3%/4.4%/4.4%/5.5%/5.5%/6.6%/6.6% 증가한다(5회 중첩 가능). 『사냥 리듬』이 3|5중첩에 도달하면 추가로 크리티컬 확률이 6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0% | 9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0% 증가하고, 크리티컬 효과가 12.0%/16.0%/16.0%/20.0%/20.0%/24.0%/24.0% | 18.0%/24.0%/24.0%/30.0%/30.0%/36.0%/36.0% 증가한다.",
    effect_en: "Increase Attack by 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%.\nWhen dealing damage with a skill, gain 3 Hunter's Instinct stacks. Every 2 times damage is dealt, gain 1 more stack.\nHunter's Instinct: Increase damage by 3.3%/4.4%/4.4%/5.5%/5.5%/6.6%/6.6% for 1 turn. Stacks up to 5 times. When Hunter's Instinct is at 3/5 stacks, also increase critical rate by 6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0%/9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0%, and increase critical damage by 12.0%/16.0%/16.0%/20.0%/20.0%/24.0%/24.0%/18.0%/24.0%/24.0%/30.0%/30.0%/36.0%/36.0%.",
    effect_jp: "攻撃力が28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%上昇する。\nスキルダメージを与えた時『爪牙のリズム』を３つ獲得し、ダメージを２回与えるごとに『爪牙のリズム』を追加で１つ獲得する。\n『爪牙のリズム』：１ターンの間、自身の与ダメージが3.3%/4.4%/4.4%/5.5%/5.5%/6.6%/6.6%上昇する。この効果は最大５つまで累積できる。『爪牙のリズム』が３／５つの時、クリティカル率がさらに6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0%／9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0%、クリティカルダメージが12.0%/16.0%/16.0%/20.0%/20.0%/24.0%/24.0%／18.0%/24.0%/24.0%/30.0%/30.0%/36.0%/36.0%上昇する。",
    shard: [
      {
        desc: "팰리스4 컨트롤 센터 탐색도 100%",
        desc_en: "Palace 4-1 Progress 100%",
        desc_jp: "パレス 4-1 踏破率 100%"
      },
      {
        desc: "팰리스4 급수탑 탐색도 50%",
        desc_en: "Palace 4-2 Progress 50%",
        desc_jp: "パレス 4-2 踏破率 50%"
      },
      {
        desc: "팰리스4 급수탑 탐색도 100%",
        desc_en: "Palace 4-2 Progress 100%",
        desc_jp: "パレス 4-2 踏破率 100%"
      },
      {
        desc: "메멘토스3 - 절제를 잃은 길 탐색도 레벨 30",
        desc_en: "Mementos 3 - Explorer LV 30",
        desc_jp: "メメントス 3 - Explorer LV 30"
      },
      {
        desc: "교환 - 비밀의 장소 {item-huobi-46.png} 500 ",
        desc_en: "Exchange - The Velvet Shop {item-huobi-46.png} 500",
        dsec_jp: "交換 - {item-huobi-46.png} 500"
      },
      {
        desc: "교환 - 낙원 백화 {item-huobi-50.png} 500",
        desc_en: "Exchange - Companio Shop {item-huobi-50.png} 500",
        dsec_jp: "交換 - {item-huobi-50.png} 500"
      }
    ]
  },
  "천상의 별": {
    element: "염동",
    name_en: "Starry Compass",
    name_jp: "星天の羅針",
    where_to_get: "Shop",
    release: "마사키",
    order: "7",
    effect: "공격력이 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0% 증가한다.\n빛의 고리 『성반만상』: 원더의 『부연』 중첩 수에 따라 다음 효과가 활성화된다.\n5중첩: 모든 적 방어력 11.0%/14.7%/14.7%/18.3%/18.3%/22.0%/22.0% 감소\n10중첩: 모든 괴도 효과 명중 9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0% 증가\n15중첩: 모든 괴도의 염동 대미지 11.0%/14.7%/14.7%/18.3%/18.3%/22.0%/22.0% 증가\n전투가 시작되면 『부연』 10중첩을 획득하고, 적에게 대미지를 줄 때마다 원더가 『부연』을 1중첩 획득한다. 원더 턴 종료 시 『부연』 5중첩을 소모한다.",
    effect_en: "Increase Attack by 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%.\nAura - Universal Astrolabe: Gain the following effects based on number of stacks of Guidance.\n5 stacks: Decrease all foes' Defense by 11.0%/14.7%/14.7%/18.3%/18.3%/22.0%/22.0%.\n10 stacks: Increase party's ailment accuracy by 9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0%.\n15 stacks: Increase party's Psychokinesis damage by 6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0%.\nAt the start of battle, gain 10 Guidance stacks, and each time damage is dealt to a foe, gain 1 stack. At the end of user's turn, lose 5 Guidance stacks.",
    effect_jp: "攻撃力が28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%上昇する。\nオーラ『万象の星盤』：『導き』の数に応じて以下の効果を付与する。\n「５：敵全体の防御力を11.0%/14.7%/14.7%/18.3%/18.3%/22.0%/22.0%低下」\n「１０：味方全体の状態異常命中が9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0%上昇」\n「１５：味方全体の念動属性の与ダメージが6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0%上昇」。\n戦闘開始時、『導き』を１０個獲得し、敵にダメージを与えるごとに『導き』を１つ獲得する。自身のターン終了時に『導き』を５つ消費する。",
    lightning_stamp: [
      {
        order: 2,
        name: "현혹의 식심",
        name_en: "Corrupting Glow",
        name_jp: "荧惑蝕心",
        stamp_img: "item-datu-302932.png",
        stamp_icon: "weaponEngraving-icon-2.png",
        effect: "빛의 고리 『성반만상』이 아군 전체의 공격력을 추가로 2.5%/5.0%/7.5%/10.0% 증가시킨다. 적이 대미지를 입을 때마다 원더가 『부연』을 추가로 1중첩 획득하며, 원더의 턴 종료 시 더 이상 『부연』 중첩을 소모하지 않는다.\n임의의 동료가 추가 턴을 획득할 때 해당 동료에게 2턴 동안 지속되는 『사유의 속도』를 부여한다.\n『사유의 속도』: 염동 속성 대미지가 4.0%/8.0%/12.0%/16.0% 증가하고, 염동 속성 대미지를 줄 때 크리티컬 효과가 2.5%/5.0%/7.5%/10.0% 증가한다.",
        effect_en: "Aura [Universal Astrolabe] additionally increases the Attack of all allies by 2.5%/5.0%/7.5%/10.0%. Each time an enemy takes damage, WONDER gains 1 additional stack of [Guidance], and WONDER no longer consumes [Guidance] stacks at the end of their turn.\nWhen any ally enters an extra turn, grant them [Mind Overclock] for 2 turns.\n[Mind Overclock]: Psychokinesis damage +4.0%/8.0%/12.0%/16.0%. When dealing Psychokinesis damage, Critical Damage +2.5%/5.0%/7.5%/10.0%.",
        effect_jp: "オーラ『万象の星盤』により、味方全体の攻撃力がさらに2.5%/5.0%/7.5%/10.0%上昇する。敵がダメージを受けるたびに、ワンダーは『導き』をさらに1スタック獲得し、自身のターン終了時に『導き』を消費しなくなる。\n味方が追加ターンを獲得した時、その味方に2ターン持続する『思考オーバークロック』を付与する。\n『思考オーバークロック』：念動属性ダメージが4.0%/8.0%/12.0%/16.0%上昇し、念動属性ダメージを与えた時のクリティカル倍率が2.5%/5.0%/7.5%/10.0%上昇する。",
        release: "나루미",
      }
    ],
    shard: [
      {
        desc: "교환 - 운명의 섬 {item-huobi-49.png} 800",
        desc_en: "Exchange - Land of Fortune {item-huobi-49.png} 800",
        dsec_jp: "交換 - {item-huobi-49.png} 800"
      }
    ]
  },
  "망자의 눈": {
    element: "물리",
    name_en: "Eye of Obsequies",
    name_jp: "葬送の眼",
    where_to_get: "Shop",
    order: "6",
    release: "키라",
    effect: "공격력이 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0% 증가한다.\n적에게 이상 상태 부여 시 목표의 효과 저항을 12.0%, 방어력을 5.0%/6.7%/6.7%/8.3%/8.3%/10.0%/10.0% 감소시키고, 자신의 공격력이 10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0% 증가한다(2회 중첩 가능). 3턴 동안 지속되며 중첩마다 독립적으로 계산한다. 2중첩 도달 시 적이 받는 물리 대미지가 14.0%/18.7%/18.7%/23.3%/23.3%/28.0%/28.0% 증가하며 3턴 동안 지속된다.",
    effect_en: "Increase Attack by 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%. After inflicting a status ailment on a foe, decrease the foe's ailment resistance by 12.0%/12.0%/12.0%/12.0%/12.0%/12.0%/12.0%, Defense by 5.0%/6.7%/6.7%/8.3%/8.3%/10.0%/10.0%, and increase the user's Attack by 10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0% for 3 turns. This effect can stack up to 2 times, and stacks are spent separately. With 1 stack, increase target's Physical damage taken by 14.0%/18.7%/18.7%/23.3%/23.3%/28.0%/28.0% for 3 turns.",
    effect_jp: "攻撃力が28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%上昇する。敵を弱体状態にする時、３ターンの間、敵の状態異常抵抗を12.0%/12.0%/12.0%/12.0%/12.0%/12.0%/12.0%低下、防御力を5.0%/6.7%/6.7%/8.3%/8.3%/10.0%/10.0%低下させ、自身の攻撃力が10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0%上昇する。この効果は２つまで累積でき、個別に消費する。効果が１つ累積した時、３ターンの間、対象の物理属性の被ダメージが14.0%/18.7%/18.7%/23.3%/23.3%/28.0%/28.0%上昇する。",
    shard: [
      {
        desc: "교환 - 운명의 섬 {item-huobi-49.png} 800",
        desc_en: "Exchange - Land of Fortune {item-huobi-49.png} 800",
        dsec_jp: "交換 - {item-huobi-49.png} 800"
      }
    ]
  },
  "크리스탈 트레저": {
    element: "축복",
    name_en: "Glimmer",
    name_jp: "グリッター",
    where_to_get: "Shop",
    order: "5",
    release: "아야카",
    effect: "공격력이 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0% 증가한다.\n축복 속성 대미지 및 치료 효과가 11.0%/14.7%/14.7%/18.3%/18.3%/22.0%/22.0% 증가한다.\n턴 시작 시 1명의 괴도에게 축복 효과를 제공하며, 해당 괴도에게 8.0%/10.7%/10.7%/13.3%/13.3%/16.0%/16.0%의 대미지 보너스를 제공한다. 만약 이 괴도가 축복 속성 괴도일 경우, 13.5%/18.0%/18.0%/22.5%/22.5%/27.0%/27.0%의 축복 대미지 보너스를 추가로 획득한다.\n이후 2턴마다 같은 효과가 1회 발동한다.",
    effect_en: "Increase Attack by 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%.\nIncrease Bless damage and healing by 11.0%/14.7%/14.7%/18.3%/18.3%/22.0%/22.0%.\nAt the start of the turn, grant Blessing to 1 ally and increase their damage by 8.0%/10.7%/10.7%/13.3%/13.3%/16.0%/16.0%. If the target's attribute is Bless, increase Bless damage by 8.0%/10.7%/10.7%/13.3%/13.3%/16.0%/16.0% more.\nEffect reactivates every 2 turns.",
    effect_jp: "攻撃力が28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%上昇する。\n祝福属性の与ダメージと回復量が11.0%/14.7%/14.7%/18.3%/18.3%/22.0%/22.0%上昇する。\nターン開始時、味方単体に祝印を付与し、与ダメージを8.0%/10.7%/10.7%/13.3%/13.3%/16.0%/16.0%を上昇させる。対象が祝福属性の場合、祝福属性の与ダメージを8.0%/10.7%/10.7%/13.3%/13.3%/16.0%/16.0%を上昇させる。その後、２ターンごとに同じ効果が発動する。",
    lightning_stamp: [
      {
        order: 1,
        name: "천명의 위엄",
        name_en: "Divine Might",
        name_jp: "天命の威光",
        stamp_img: "item-datu-302931.png",
        stamp_icon: "weaponEngraving-icon-1.png",
        effect: "임의 동료가 HP를 소모하여 스킬을 발동할 때, 해당 동료가 2턴 동안 지속되는 『오라클의 가호』를 획득한다. 『오라클의 가호』: 축복 속성 대미지가 4.0%/8.0%/12.0%/16.0% 증가한다. 축복 속성 대미지를 줄 때 크리티컬 효과가 2.5%/5.0%/7.5%/10.0% 증가한다.",
        effect_en: "When an ally consumes HP to activate a skill, that ally gains Oracle’s Blessing for 2 turns.  Oracle’s Blessing: Bless damage is increased by 4.0% / 8.0% / 12.0% / 16.0%.  Critical Damage dealt with Bless attacks is increased by 2.5% / 5.0% / 7.5% / 10.0%.",
        effect_jp: "味方がHPを消費してスキルを発動した時、その味方に2ターン持続する『オラクルの加護』を付与する。『オラクルの加護』：祝福属性ダメージが4.0% / 8.0% / 12.0% / 16.0%上昰。祝福属性ダメージのCRT倍率が2.5% / 5.0% / 7.5% / 10.0%上昰。",
        release: "쇼키·암야",
      }
    ],
    shard: [
      {
        desc: "교환 - 운명의 섬 {item-huobi-49.png} 800",
        desc_en: "Exchange - Land of Fortune {item-huobi-49.png} 800",
        dsec_jp: "交換 - {item-huobi-49.png} 800"
      }
    ]
  },
  "메커니컬 심판자": {
    element: "버프",
    name_en: "Ex Machina",
    name_jp: "エクス・マキナ",
    where_to_get: "Palace 3",
    release: "Palace 3",
    order: "4",
    effect: "공격력이 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0% 증가한다.\n빛의 고리: 원더가 필드에 있을 경우 모든 괴도의 공격력이 120/160/160/199/199/240/240포인트 증가한다.\n전투 진입 시 페르소나에 따라 상응하는 속성 대미지가 17.0%/22.7%/22.7%/28.3%/28.3%/34.0%/34.0% 증가하고, 기타 괴도는 전자의 40%(6.8%/9.1%/9.1%/11.3%/11.3%/13.6%/13.6%)에 해당하는 효과를 획득한다.",
    effect_en: "Increase Attack by 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%.\nAura: When user is on the field, increase party's Attack by 120/160/160/199/199/240/240.\nBased on the attribute of the Persona equipped at the start of battle, increase damage of that attribute by 17.0%/22.7%/22.7%/28.3%/28.3%/34.0%/34.0%, and 40%(6.8%/9.1%/9.1%/11.3%/11.3%/13.6%/13.6%) for other allies.",
    effect_jp: "攻撃力が28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%上昇する。\nオーラ：自身が場にいる時、味方全体の攻撃力が120/160/160/199/199/240/240上昇する。\n戦闘開始時のペルソナに応じた属性の与ダメージが17.0%/22.7%/22.7%/28.3%/28.3%/34.0%/34.0%上昇し、他の味方はその４０%(6.8%/9.1%/9.1%/11.3%/11.3%/13.6%/13.6%)上昇する。",
    shard: [
      {
        desc: "팰리스3 수처리장 탐색도 100%",
        desc_en: "Palace 3-1 Progress 100%",
        desc_jp: "パレス 3-1 踏破率 100%"
      },
      {
        desc: "팰리스3 발전소 탐색도 50%",
        desc_en: "Palace 3-2 Progress 50%",
        desc_jp: "パレス 3-2 踏破率 50%"
      },
      {
        desc: "팰리스3 발전소 탐색도 100%",
        desc_en: "Palace 3-2 Progress 100%",
        desc_jp: "パレス 3-2 踏破率 100%"
      },
      {
        desc: "메멘토스3 - 절제를 잃은 길 탐색도 레벨 10",
        desc_en: "Mementos 3 - Explorer LV 10",
        desc_jp: "メメントス 3 - Explorer LV 10"
      },
      {
        desc: "교환 - 비밀의 장소 {item-huobi-46.png} 500",
        desc_en: "Exchange - The Velvet Shop {item-huobi-46.png} 500",
        dsec_jp: "交換 - {item-huobi-46.png} 500"
      },
      {
        desc: "교환 - 낙원 백화 {item-huobi-50.png} 500",
        desc_en: "Exchange - Companio Shop {item-huobi-50.png} 500",
        dsec_jp: "交換 - {item-huobi-50.png} 500"
      }
    ]
  },
  "태고의 역장": {
    element: "버프",
    name_en: "Arc Knife",
    name_jp: "アークナイフ",
    where_to_get: "Shop",
    release: "유우미",
    order: "3",
    effect: "공격력이 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0% 증가한다. 적이 원소 이상일 시, 2턴 동안 자신의 공격력이 10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0% 증가한다. 원소 이상 상태를 줄 때, 효과 명중이 15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0% 증가한다.\n적을 공격할 시, 2턴 동안 적의 방어력이 4.5%/6.0%/6.0%/7.5%/7.5%/9.0%/9.0% 감소한다. 적이 원소 이상 상태를 한 종류 가지고 있을 때마다, 해당 효과를 추가로 1회 발동한다(4회 중첩 가능).",
    effect_en: "Increase Attack by 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%.\nAfter inflicting an elemental ailment, increase Attack by 10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0% for 2 turns. Increase elemental ailment accuracy by 15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0%.\nWhen attacking a foe, decrease the target's Defense by 4.5%/6.0%/6.0%/7.5%/7.5%/9.0%/9.0% for 2 turns. Increase this effect for each of target's elemental ailments, up to 4.",
    effect_jp: "攻撃力が28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%上昇する。\n敵を属性異常にする時、２ターンの間、自身の攻撃力が10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0%上昇する。属性異常の命中率が15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0%上昇する。\n敵を攻撃する時、2ターンの間、対象の防御力を4.5%/6.0%/6.0%/7.5%/7.5%/9.0%/9.0%低下させる。この効果は対象の属性異常ごとに１つ付与され、最大４つまで累積できる。",
    shard: [
      {
        desc: "교환 - 운명의 섬 {item-huobi-49.png} 800",
        desc_en: "Exchange - Land of Fortune {item-huobi-49.png} 800",
        dsec_jp: "交換 - {item-huobi-49.png} 800"
      }
    ]
  },
  "메아리의 절규": {
    element: "버프",
    name_en: "All In",
    name_jp: "万里一空",
    where_to_get: "Palace 2",
    release: "Palace 2",
    order: "2",
    effect: "치료 보너스, 실드 보너스가 20.0%/20.0%/26.7%/26.7%/33.3%/33.3%/40.0% 증가한다.\n빛의 고리: 주인공이 필드에 있을 경우 모든 괴도의 방어력이 15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0% 증가한다. 동료에게 스킬 사용 시, 메인 목표는 자신의 최대 생명 10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0%의 회복 효과를 획득한다.",
    effect_en: "Increase healing and shield by 20.0%/20.0%/26.7%/26.7%/33.3%/33.3%/40.0%.\nAura: When user is on the field, increase party's Defense by 15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0%.\nAfter using a skill on an ally, restore 10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0% of the main target's max HP.",
    effect_jp: "回復量、シールドが20.0%/20.0%/26.7%/26.7%/33.3%/33.3%/40.0%上昇する。\nオーラ：自身が場にいる時、味方全体の防御力が15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0%上昇する。\n味方にスキルを使用した時、対象の最大HP10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0%を回復する。",
    shard: [
      {
        desc: "벨벳의 시련 - 장인의 작품 누적 별 획득 개수 35",
        desc_en: "Velvet Trial - Technician: Total ★ Obtained 35",
        dsec_jp: "ベルベットの試練 - 技術者の試練 累計星獲得数 35"
      },
      {
        desc: "벨벳의 시련 - 장인의 작품 누적 별 획득 개수 50",
        desc_en: "Velvet Trial - Technician: Total ★ Obtained 50",
        dsec_jp: "ベルベットの試練 - 技術者の試練 累計星獲得数 50"
      },
      {
        desc: "팰리스2 탐색도 100%",
        desc_en: "Palace 2 Progress 100%",
        desc_jp: "パレス 2 踏破率 100%"
      },
      {
        desc: "메멘토스2 - 조화를 잃은 길 탐색도 레벨 18",
        desc_en: "Mementos 2 - Path of Aiyatsbus Explorer LV 18",
        desc_jp: "メメントス 2 - Explorer LV 18"
      },
      {
        desc: "교환 - 비밀의 장소 {item-huobi-46.png} 200",
        desc_en: "Exchange - The Velvet Shop {item-huobi-46.png} 200",
        dsec_jp: "交換 - {item-huobi-46.png} 200"
      },
      {
        desc: "교환 - 낙원 백화 {item-huobi-50.png} 200",
        desc_en: "Exchange - Companio Shop {item-huobi-50.png} 200",
        dsec_jp: "交換 - {item-huobi-50.png} 200"
      }
    ]
  },
  "7일의 불꽃": {
    element: "버프",
    name_en: "Sennight Inferno",
    name_jp: "七日ノ焔",
    where_to_get: "Palace 1",
    release: "Palace 1",
    order: "1",
    effect: "공격력이 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0% 증가한다. 다른 속성의 페르소나 1개 장착 시마다 적에게 주는 대미지가 6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0% 증가하고, 최대 3회 중첩된다. 적 다운 시 100% 기본 확률로 적의 방어력이 15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0% 감소한다.",
    effect_en: "Increase Attack by 28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%.\nFor each Persona of a different attribute equipped, increase damage by 6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0% (max 3).\nAfter knocking down an enemy, decrease its Defense by 15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0% for 1 turn.",
    effect_jp: "攻撃力が28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%上昇する。異なる属性のペルソナを装備するごとに与ダメージが6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0%上昇（最大3回）。敵をダウンさせた後、1ターンの間防御力が15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0%低下する。",
    shard: [
      {
        desc: "벨벳의 시련 - 장인의 작품 누적 별 획득 개수 30",
        desc_en: "Velvet Trial - Technician: Total ★ Obtained 30",
        dsec_jp: "ベルベットの試練 - 技術者の試練 累計星獲得数 30"
      },
      {
        desc: "벨벳의 시련 - 장인의 작품 누적 별 획득 개수 45",
        desc_en: "Velvet Trial - Technician: Total ★ Obtained 45",
        dsec_jp: "ベルベットの試練 - 技術者の試練 累計星獲得数 45"
      },
      {
        desc: "팰리스1 탐색도 100%",
        desc_en: "Palace 1 Progress 100%",
        desc_jp: "パレス 1 踏破率 100%"
      },
      {
        desc: "메멘토스1 - 사상을 잃은 길 탐색도 레벨 18",
        desc_en: "Mementos 1 - Path of Qimranut Explorer LV 18",
        desc_jp: "メメントス 1 - Explorer LV 18"
      },
      {
        desc: "교환 - 비밀의 장소 {item-huobi-46.png} 200",
        desc_en: "Exchange - The Velvet Shop {item-huobi-46.png} 200",
        dsec_jp: "交換 - {item-huobi-46.png} 200"
      },
      {
        desc: "교환 - 낙원 백화 {item-huobi-50.png} 200",
        desc_en: "Exchange - Companio Shop {item-huobi-50.png} 200",
        dsec_jp: "交換 - {item-huobi-50.png} 200"
      }
    ]
  }
}


// 야노식 Janosik's Axe Pistol
/* Lufel's business plan 1-2, 2-2, 2-5 */