const personaData = {
    "야노식": {
        name_en: "Janosik",
        name_jp: "ヤノシーク",
        grade: "8",
        star: "5",
        position: "반항",
        element: "총격",
        best_persona: true,
        instinct: {
            name: "잔당의 수확 III",
            name_en: "Reaper III",
            name_jp: "ハンティング III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "전투 중 1회, 야노식으로 턴을 종료할 때 임의의 적 1명이 『조준』을 획득합니다. 모든 동료가 『조준』을 보유한 적 공격 시 공격력이 20% 증가한다.",
                "『조준』을 보유한 적의 방어력이 12% 추가 감소한다. 자신이 『조준』을 가진 적 공격시 공격력 18%의 총격 속성 대미지를 1회 준다.",
                "『조준』 : 2턴 동안 적의 방어력이 29.6% 감소한다."
            ],
            effects_en: [
                "Increases ATK by 29.1%. At the start of battle, inflicts 1 foe with [Marked]. When allies attack foes with [Marked], increases ATK by 20%. Additionally decreases DEF by 12% for foes with [Marked]. When you attack foes with [Marked], deal an additional 18% ATK as Gun DMG to them.",
                "[Marked]: Reduce enemy defense by 29.6% for 2 turns."
            ],
            effects_jp: [
                "攻撃力が29.1%上昇。味方が「標的」に攻撃した時、攻撃力が20%上昇。「標的」を保有した敵の防御力が12%追加減少する。自分が「標的」を持つ敵攻撃時、攻撃力18%の銃撃属性ダメージを1回与える。",
                "「標的」：2ターンの間、敵の防御力が29.6%減少する。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "궁지 반격",
            name_en: "Tatra Shot",
            name_jp: "タトラショット",
            effect: "1명의 적에게 공격력 203.3%의 총격 속성 대미지를 주고, 75%의 고정 확률로 적이 『조준』을 획득한다. 『조준』: 2턴 동안 적의 방어력이 29.6% 감소한다.",
            effect_en: "Deals 203.3% ATK as Gun DMG to 1 foe, has 75% fixed chance of inflicting [Marked]: Reduce enemy defense by 29.6% for 2 turns.",
            effect_jp: "敵単体に攻撃力203.3%の銃撃属性ダメージを与える。75%の確率で敵を2ターンの間、「標的」状態にする。「標的」状態：防御力が29.6%低下する。",
            priority: 0,
            icon: "총격"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 총격 속성 대미지를 준다.",
            effect_en: "Deals 360.0% ATK as Gun DMG to 1 foe",
            effect_jp: "1体の敵に360.0% ATKのガンダムダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "라쿤다", priority: 3},
            {name : "리벨리온", priority: 3},
            {name : "어드바이스", priority: 3},
            {name : "타루카쟈", priority: 2},
            {name : "치료 촉진", priority: 1},
            {name : "대미지 면역", priority: 0},
            {name : "방어 강화", priority: 0},
       ],
        comment : "선봉으로 사용하지 않고 교체 후 페르소나 스킬 사용 시 '전투 시작 시 『조준』 획득' 이 발동 돼 『조준』이 적용된다 (최초 1회). 버프도 동일하게 『조준』이 발동된다.",
        comment_en: "If you don't use Janosik as the vanguard, when you use the Persona skill after replacing, the '『Marked』 is obtained at the start of battle' is triggered, and the '『Marked』' is applied (only once). The buff also triggers '『Marked』'.",
        comment_jp: "ジャノシクを先頭にしないで、ペルソナスキルを使用する前に交代した場合、『ジャノシクの収穫 III』が発動し、『マーク』が付与されます（1回のみ）。バフも『マーク』が発動します。"
    },
    "디오니소스": {
        name_en: "Dionysus",
        name_jp: "ディオニュソス",
        grade: "7",
        star: "4",
        position: "우월",
        element: "염동",
        best_persona: true,
        instinct: {
            name: "술취한 카니발 III",
            name_en: "Druken Revelry III",
            name_jp: "狂乱の酒宴 III",
            effects: [
                "크리티컬 확률이 14.8% 증가한다.",
                "동료를 목표로 스킬 시전 시, 2턴 동안 스킬의 메인 목표의 크리티컬 효과가 30% 증가한다."
            ],
            effects_en: [
                "Increases CRIT Rate by 14.8%.",
                "When using a Persona skill on allies, increases the main target's CRIT DMG by 30% for 2 turns."
            ],
            effects_jp: [
                "クリティカル率が14.8%上昇。味方にスキルを使用後、選択した対象のクリティカルダメージを30%上昇（2ターン持続）。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "레볼루션",
            name_en: "Revolution",
            name_jp: "レボリューション",
            effect: "모든 동료의 크리티컬 확률이 6.5% 증가하고, 자신의 크리티컬 확률 10%마다 추가로 1.1%가 증가한다. 상한은 4.4%이며, 효과는 3턴 동안 지속된다.",
            effect_en: "Increase all allies CRIT by 6.5% + 1.1% for every 10% CRIT Wonder has to a maximum of 4.4% for 3 turns.",
            effect_jp: "3ターンの間、味方全体のクリティカル率が6.5%上昇する。自身のクリティカル率が10%ごとに、味方のクリティカル率がさらに1.1%上昇する（最大4.4%まで）。",
            priority: 2,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            effect_en: "Increase all allies dmg dealt by 29.5% for 2 turns.",
            effect_jp: "全ての味方の与えるダメージが29.5%増加し、2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "무한 알고리즘", priority: 3},
             {name : "리벨리온", priority: 3},
             {name : "타루카쟈", priority: 3},
             {name : "라쿠카쟈", priority: 1},
             {name : "마하타루카 오토", priority: 1 },
             {name : "치료 촉진", priority: 1},
             {name : "메디아라한", priority: 1},
             {name : "치료 강화", priority: 1},
             {name : "대미지 면역", priority: 0},
             {name : "방어 강화", priority: 0},
        ],
        comment : "메디아라한을 통한 치료에도 본능 크리티컬 효과 30% 증가가 적용된다. 본능을 통해 크리티컬 확률을 확보하고 해명 괴도를 통해 추가로 받으므로 리벨리온을 위한 별도 어드바이스 패시브가 필요하지 않다.",
        comment_en: "The core passive critical effect 30% increase also applies to healing through Mediarahan. Infinite Algorithm is a skill card distributed through paid events(KR).",
        comment_jp: "メディアラハンによる治療にも本能CRT倍率30%増加が適用される。無限アルゴリズムは課金イベントを通じて配布されたスキルカード。"
    },
    "비슈누": {
        name_en: "Vishnu",
        name_jp: "ヴィシュヌ",
        wild_emblem_rainbow : true,
        grade: "8",
        star: "5",
        position: "반항",
        element: "질풍",
        best_persona: true,
        instinct: {
            name: "중생에 내리는 은혜 III",
            name_en: "Blessing to All III",
            name_jp: "衆生への恵み III",
            effects: [
                "크리티컬 확률이 17.5% 증가한다.",
                "풍습의 효과 명중이 20% 증가하고, 풍습 상태인 적에게 주는 대미지가 20% 증가한다.",
                "풍습 상태를 추가하거나 초기화될 때 적의 방어력이 48% 추가 감소하며 2턴 동안 지속된다."
            ],
            effects_en: [
                "Increases CRIT Rate by 17.5%.",
                "Increases Ailment Accuracy when inflicting Winded by 20% and increase dmg dealt to foes with Winded by 20%.",
                "Decreases the foes' DEF by 48% when refreshing or inflicting Winded for 2 turns."
            ],
            effects_jp: [
                "クリティカル率が17.5%増加する。",
                "風襲の状態異常命中が20%増加し、風襲状態の敵に与えるダメージが20%増加する。",
                "風襲状態を追加または初期化する時、敵の防御力が48%追加減少し、2ターンの間持続する。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "적을 멸하는 바람",
            name_en: "Winds of Nirvana",
            name_jp: "敵を滅する風",
            effect: "1명의 적에게 공격력 192.0%의 질풍 속성 대미지를 주고, 75%의 기본 확률로 적을 풍습 상태에 빠뜨린다. 적이 풍습 상태인 경우 지속 시간을 초기화하고, 이번 스킬이 주는 대미지가 27.0% 증가하며 적이 받는 질풍 대미지가 27.0% 심화된다. 효과는 2턴 동안 지속된다.",
            effect_en: "Deals 192.0% ATK Wind dmg to 1 foe, with a 75% base chance to inflict Winded; If foe is already inflicted with Winded, refreshes its duration, increases this damage by 27.0% and increases their Wind dmg taken by 27.0% for 2 turns.",
            effect_jp: "1体の敵に192.0% ATKの風属性ダメージを与え、75%の基本確率で敵を風襲状態にする。敵が既に風襲状態の場合、持続時間を初期化し、このスキルのダメージが27.0%増加し、敵が受ける風ダメージが27.0%深化する。効果は2ターンの間持続する。",
            priority: 3,
            icon: "질풍"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 질풍 속성 대미지를 준다.",
            effect_en: "Deal 360% ATK as Wind dmg to 1 foe.",
            effect_jp: "1体の敵に360.0% ATKの風属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
             {name : "명중 강화", priority: 3},
             {name : "질풍률 UP", priority: 3},
             {name : "우중충한 하늘", priority: 3},
             {name : "마하갈다인", priority: 3},
             {name : "질풍 강화", priority: 1},
             {name : "마도의 재능", priority: 1},
             {name : "공격 강화", priority: 1},
             {name : "민첩의 마음가짐", priority: 0},
        ],
        comment : "마하갈다인을 통해 풍습 부여 시 광역 방어력 감소 효과를 적용할 수 있다.",
        comment_en: "Through Magarudyne, you can apply area-wide defense reduction effects when inflicting Winded.",
        comment_jp: "マハガルダインを通じて風襲付与時に広域防御力減少効果を適用できる。"
    },
    "도미니온": {
        name_en: "Dominion",
        name_jp: "ドミニオン",
        grade: "7",
        star: "5",
        position: "우월",
        element: "축복",
        best_persona: true,
        instinct: {
            name: "천사의 호령 III",
            name_en: "Angel's Order III",
            name_jp: "天使の号令 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "동료를 목표로 스킬 시전 후 『호령』을 2중첩 획득한다",
                "동료가 페르소나 스킬을 사용해 대미지를 줄 시, 『호령』을 1중첩 소모해 1턴 동안 주는 대미지가 15%, 공격력이 6.4% 증가한다."
            ],
            effects_en: [
                "Increases ATK by 29.1%.",
                "Gains 2 [Order] when using a skill on allies.",
                "When allies deals damage with a skill, consume 1 stack of [Order] to increase their DMG Dealt by 15% and ATK by 6.4% for 1 turn."
            ],
            effects_jp: [
                "攻撃力が29.1％上昇。",
                "味方にスキルを使用後、「号令」を2つ獲得。味方がスキルでダメージを与えた時に「号令」を一つ消費して、1ターンの間与えるダメージが15％、攻撃力が6.4％上昇。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "응집",
            name_en: "Cohesion",
            name_jp: "凝結",
            effect: "모든 동료의 공격력이 15% 증가하고, 자신의 공격력 500마다 1.25%가 추가 증가한다. 상한은 10%이며 효과는 2턴 동안 지속된다. 또한 스킬의 메인 목표가 주는 대미지가 8% 추가 증가하고, 자신의 공격력 500마다 1% 추가 증가한다. 상한은 8%이며 효과는 1턴 동안 지속된다.",
            effect_en: "Increases all allies' ATK by 15% + 1.25% for every 500 ATK you have, up to 10% for 2 turns. Increases the main target's dmg dealt by 8% + 1% for every 500 ATK you have, up to 8% for 1 turn.",
            effect_jp: "2ターンの間、味方全体の攻撃力が15％上昇し、自身の攻撃力500ごとに追加で攻撃力が1.25％上昇する（最大10％）。さらに1ターンの間、選択した対象の与ダメージが8％上昇し、自身の攻撃力500ごとに追加で与ダメージが1％上昇する（最大8％）。",
            priority: 3,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            effect_en: "Increase all allies dmg dealt by 29.5% for 2 turns.",
            effect_jp: "全ての味方の与えるダメージが29.5%増加し、2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "리벨리온", priority: 2},
             {name : "어드바이스", priority: 2},
             {name : "타루카쟈", priority: 2},
             {name : "치료 촉진", priority: 1 },
             {name : "대미지 면역", priority: 0},
             {name : "방어 강화", priority: 0},
        ],
        comment : "호령 + 응집 버프를 통해 1턴에 최대 공격력 31.4%, 대미지 31% 증가효과를 부여할 수 있다.",
        comment_en: "Through Order + Cohesion buffs, you can provide maximum ATK 31.4% and damage 31% increase effects in 1 turn.",
        comment_jp: "号令＋凝結バフを通じて1ターンに最大攻撃力31.4%、ダメージ31%増加効果を付与できる。"
    },
    "년수": {
        name_en: "Nian",
        name_jp: "年獣",
        grade: "8",
        star: "5",
        position: "굴복",
        element: "주원",
        best_persona: true,
        wild_emblem_rainbow : true,
        event: true,
        instinct: {
            name: "해 지면 출몰하는 괴수 III",
            name_en: "Yearly Beast III",
            name_jp: "日が沈むと出没する怪獣 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "적에게 페르소나 스킬 사용 시 2턴 동안 스킬 목표가 『해의 멸절』을 획득한다.",
                "『해의 멸절』을 보유한 캐릭터는 처음 화염 대미지를 받을 시 『공포(년수)』를 획득하여 3턴 동안 받는 대미지가 12% 증가한다.",
                "또한 2턴 동안 75% 기본 확률로 화상을 입는다."
            ],
            effects_en: [
                "Increases ATK by 29.1%.",
                "After using Persona skill on enemies, inflicts the targets with [Yearly Sacrifice] for 2 turns.",
                "Enemies with [Yearly Sacrifice] will gain [Frightened] when taking Fire damage for the first time: Increases dmg taken by 12% for 3 turns.",
                "Also has a 75% base chance to inflict Burn for 2 turns."
            ],
            effects_jp: [
                "攻撃力が29.1%増加する。",
                "敵にペルソナスキル使用時、2ターンの間スキルターゲットが『太陽の滅絶』を獲得する。",
                "『太陽の滅絶』を保有する怪盗は初めて火炎ダメージを受ける時『恐怖(ニエン)』を獲得し、3ターンの間受けるダメージが12%増加する。",
                "また、2ターンの間75%基本確率で火傷を負う。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "조화의 균열",
            name_en: "Fortune Devourer",
            name_jp: "調和の亀裂",
            effect: "모든 적에게 공격력 104.0%의 주원 속성 대미지를 주고, 2턴 동안 모든 적의 방어력을 10.0% 감소시키며, 받는 지속 대미지가 20.0% 증가한다.",
            effect_en: "Deals 104.0% ATK Curse dmg to all foes, decreases all foes' DEF by 10% and increases all foes Damage Over Time taken by 20% for 2 turns.",
            effect_jp: "全ての敵に104.0% ATKの呪怨属性ダメージを与え、2ターンの間全ての敵の防御力を10.0%減少させ、受ける持続ダメージが20.0%増加する。",
            priority: 0,
            icon: "주원광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 주원 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK Curse dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に90.0% ATKの呪怨属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "음률의 침입", priority: 3},
             {name : "마하라쿤다", priority: 3},
             {name : "대미지 면역", priority: 0},
             {name : "방어 강화", priority: 0},
        ],
        comment : "음률의 침입은 과금 이벤트를 통해 배포된 스킬 카드로 마하라쿤다로 대체 가능하다.",
        comment_en: "Melodic Infiltration is a skill card distributed through paid events(KR) and can be replaced with Marakunda.",
        comment_jp: "音律の侵入は課金イベントを通じて配布されたスキルカードでマハラクンダで代替可能である。"
    },
    "광목천": {
        name_en: "Koumokuten",
        name_jp: "コウモクテン",
        grade: "5",
        star: "4",
        position: "우월",
        element: "물리",
        best_persona: true,
        instinct: {
            name: "천왕의 주시 II",
            name_en: "Heavenly Gaze II",
            name_jp: "天王の眼力 II",
            effects: [
                "효과 명중이 21.2% 증가한다.",
                "전투 시작 시 3턴 동안 공격력이 가장 높은 괴도의 공격력이 14% 증가하고, 크리티컬 확률이 6% 증가한다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 21.2%.",
                "At the start of battle, increases the ATK and CRIT Rate for the ally with the highest ATK by 14% and 6% for 3 turns, prioritizing Single-target/Multi-target Thief."
            ],
            effects_jp: [
                "状態異常命中が21.2%上昇。",
                "戦闘開始時、攻撃力が最も高い味方の攻撃力が14%上昇し、クリティカル率が6%上昇（3ターン持続）"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "레볼루션",
            name_en: "Revolution",
            name_jp: "レボリューション",
            effect: "모든 동료의 크리티컬 확률이 6.5% 증가하고, 자신의 크리티컬 확률 10%마다 추가로 1.1%가 증가한다. 상한은 4.4%이며, 효과는 3턴 동안 지속된다.",
            effect_en: "Increase all allies CRIT by 6.5% + 1.1% for every 10% CRIT Wonder has to a maximum of 4.4% for 3 turns.",
            effect_jp: "3ターンの間、味方全体のクリティカル率が6.5%上昇する。自身のクリティカル率が10%ごとに、味方のクリティカル率がさらに1.1%上昇する（最大4.4%まで）。",
            priority: 2,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            effect_en: "Increase all allies dmg dealt by 29.5% for 2 turns.",
            effect_jp: "全ての味方の与えるダメージが29.5%増加し、2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "라쿤다", priority: 3 },
             {name : "마하타루카 오토", priority: 3 },
             {name : "민첩의 마음가짐", priority: 3 },
             {name : "리벨리온", priority: 1 },
             {name : "어드바이스", priority: 1 },
             {name : "타루카쟈", priority: 1 },
             {name : "치료 촉진", priority: 1 },
        ],
        comment : "본능 버프는 페르소나 전환 후에도 지속된다. ",
        comment_en: "The core passive buff continues even after persona switching.",
        comment_jp: "本能バフはペルソナ転換後も持続する。"
    },
    "지국천": {
        name_en: "Jikokuten",
        name_jp: "ジコクテン",
        grade: "3",
        star: "4",
        position: "우월",
        element: "물리",
        best_persona: true,
        instinct: {
            name: "혜토의 동쪽 I",
            name_en: "Wisdom of the East I",
            name_jp: "慧志の東 I",
            effects: [
                "방어력이 15.9% 증가한다.",
                "동료를 목표로 스킬 시전 시 2턴 동안 메인 목표의 공격력이 15.5% 증가한다. 목표의 생명이 60% 미만일 시 해당 효과는 30%까지 증가한다."
            ],
            effects_en: [
                "Increases DEF by 15.9%. When using a skill on allies, increases the main target's ATK by 13.5% for 2 turns, increases this effect by 30% when the target is below 60% HP."
            ],
            effects_jp: [
                "防御力が15.9%増加する。味方を対象にスキル使用時、2ターンの間メインターゲットの攻撃力が15.5%増加する。ターゲットの生命が60%未満の時、該当効果は30%まで増加する。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "마하타루카쟈",
            name_en: "Matarukaja",
            name_jp: "マハタルカジャ",
            effect: "모든 동료의 공격력이 10.9% 증가하고,자신의 공격력 500포인트마다 0.9% 추가 증가한다. 상한은 7.2%이며, 효과는 3턴 동안 지속된다.",
            effect_en: "Increase all allies ATK by 10.9% + 0.9% for every 500 ATK Wonder has to a maximum of 7.2% for 3 turns.",
            effect_jp: "3ターンの間、味方全体の攻撃力が10.9%上昇する。自身の攻撃力が500ごとに、味方の攻撃力がさらに0.9%上昇する（最大7.2%まで）。",
            priority: 1,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            effect_en: "Increase all allies dmg dealt by 29.5% for 2 turns.",
            effect_jp: "全ての味方の与えるダメージが29.5%増加し、2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "타루카쟈", priority: 3},
             {name : "리벨리온", priority: 3 },
             {name : "치료 촉진", priority: 1 },
        ],
        comment_en: "Provides consistent ATK buffs to allies, especially effective for low HP allies.",
        comment_jp: "味方に一貫したATKバフを提供し、特に低HPの味方に効果的である。"
    },
    "수르트": {
        name_en: "Surt",
        name_jp: "スルト",
        grade: "6",
        star: "3",
        position: "굴복",
        element: "화염",
        best_persona: true,
        instinct: {
            name: "맹렬한 불길의 군주 III",
            name_en: "Inferno Monarch I",
            name_jp: "烈焔の君主 III",
            effects: [
                "효과 명중이 20.9% 증가한다.",
                "화상 효과를 부여할 떄 효과 명중이 50% 증가한다. 생명이 50% 이상인 적에게 해당 효과가 30% 추가 증가한다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 20.9%.",
                "Increases Ailment Accuracy by 50% when inflicting Burn. Increases the effect by 30% when the foe is above 50% HP."
            ],
            effects_jp: [
                "状態異常命中が20.9%上昇。",
                "炎上の命中率が50%上昇。敵のHPが50%以上の時、効果が30%上昇"
            ],
            priority: 0
        },
        uniqueSkill: {
            name: "마하라쿤다",
            name_en: "Marakunda",
            name_jp: "マハラクンダ",
            effect: "3턴 동안 모든 적의 방어력이 27.1% 감소한다.",
            effect_en: "Decrease DEF of all foes by 27.1% for 3 turns.",
            effect_jp: "3ターンの間、敵全体の防御力を27.1%低下させる。",
            priority: 3,
            icon: "디버프광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 화염 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK as Fire dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に90.0% ATKの火炎属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
            {name : "대미지 면역", priority: 0},
            {name : "방어 강화", priority: 0},
        ],
        comment : "마하라쿤다 스킬카드 외 유일한 마하라쿤다를 소유한 페르소나",
        comment_en: "The only persona that possesses Marakunda besides the Marakunda skill card.",
        comment_jp: "マハラクンダスキルカード以外で唯一のマハラクンダを所有するペルソナ。"
    },
    "아메노우즈메": {
        name_en: "Ame-no-Uzume",
        name_jp: "アメノウズメ",
        grade: "3",
        star: "5",
        position: "반항",
        element: "전격",
        best_persona: true,
        instinct: {
            name: "전율하는 신락 I",
            name_en: "Trembling Kagura I",
            name_jp: "昂揚の神楽 I",
            effects: [
                "효과 명중이 15% 증가한다.",
                "감전 효과 부여 시 모든 동료의 크리티컬 확률이 2턴 동안 10% 증가한다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 15%.",
                "After inflicting Shock, increases all allies' CRIT Rate by 10.0% for 2 turns."
            ],
            effects_jp: [
                "状態異常命中が15%上昇。感電させた時、味方全体のクリティカル率が10.0%上昇（2ターン持続）。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "전류의 흐름",
            name_en: "Electric Surge",
            name_jp: "エレクトリックダンス",
            effect: "1명의 적에게 공격력 143.0%의 전격 속성 대미지를 주고, 2턴 동안 100.0%의 기본 확률로 감전 효과를 부여한다.",
            effect_en: "Deals 143.0% ATK Elec dmg to 1 foe, with a 100.0% base chance to inflict Shock for 2 turns.",
            effect_jp: "敵単体に攻撃力143.0%の電撃属性ダメージを与える。100.0%の確率で、2ターンの間、敵を感電状態にする。",
            priority: 0,
            icon: "전격"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 전격 속성 대미지를 준다.",
            effect_en: "Deal 360% ATK as Elec dmg to 1 foe.",
            effect_jp: "1体の敵に360.0% ATKの電撃属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
             {name : "엘 지하드", priority: 3},
             {name : "감전율 UP", priority: 3 },
             {name : "명중 강화", priority: 3 },
             {name : "우중충한 하늘", priority: 3},
        ],
        comment : "광역 감전을 통해 감전에 의한 크리티컬 확률 증가에 이어 본능을 통한 10%로 총 20%의 크리티컬 확률 증가를 노릴 수 있다.",
        comment_en: "Through area-wide shock, you can aim for a total of 20% critical rate increase with 10% from the core passive following the critical rate increase from shock.",
        comment_jp: "広域感電を通じて感電によるクリティカル率増加に続いて本能による10%で総20%のクリティカル率増加を狙うことができる。"
    },
    "서큐버스": {
        name_en: "Succubus",
        name_jp: "サキュバス",
        grade: "1",
        star: "4",
        position: "우월",
        element: "주원",
        best_persona: true,
        instinct: {
            name: "황홀한 속삭임 I",
            name_en: "Intoxicating Murmur I",
            name_jp: "酩酊のささやき I",
            effects: [
                "공격력이 3.5% 증가한다.",
                "동료를 목표로 스킬 시전 시 1턴 동안 동료의 크리티컬 확률이 11.7% 증가한다."
            ],
            effects_en: [
                "Increases ATK by 3.5%. When using a skill on an ally, increases their CRIT Rate by 10.2% for 1 turn."
            ],
            effects_jp: [
                "攻撃力が3.5%上昇。味方にスキルを使用後、その味方のクリティカル率を10.2%上昇（1ターン持続）"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "리벨리온",
            name_en: "Rebellion",
            name_jp: "リベリオン",
            effect: "동료 1명의 크리티컬 확률이 9.3% 증가하고, 자신의 크리티컬 확률 10%마다 1.6% 추가 증가한다. 상한은 6.4%이며, 효과는 3턴 동안 지속된다.",
            effect_en: "Increase 1 ally's CRIT by 9.3% + 1.6% for every 10% CRIT Wonder has to a maximum of 6.4% for 3 turns.",
            effect_jp: "3ターンの間、味方単体のクリティカル率が9.3%上昇する。自身のクリティカル率が10%ごとに、味方のクリティカル率がさらに1.6%上昇する（最大6.4%まで）。",
            priority: 1,
            icon: "버프"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            effect_en: "Increase all allies dmg dealt by 29.5% for 2 turns.",
            effect_jp: "全ての味方の与えるダメージが29.5%増加し、2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "리벨리온", priority: 3 },
             {name : "어드바이스", priority: 3 },
             {name : "타루카쟈", priority: 3 },
             {name : "라쿠카쟈", priority: 2 },
        ],
        comment : "리벨리온의 최대 효과를 위해 크리티컬 확률 패시브를 챙긴다. 설명은 10% 단위지만 0.1% 단위로도 효과가 적용된다.",
        comment_en: "Take the maximum effect of Rebellion by taking the core passive critical rate increase. The description is in 10% units, but the effect is applied in 0.1% units.",
        comment_jp: "リベリオンの最大効果を得るために、クリティカル確率のパッシブを取る。説明は10%単位ですが、効果は0.1%単位で適用されます。"
    },
    "유룽": {
        name_en: "Yurlungur",
        name_jp: "ユルング",
        grade: "5",
        star: "3",
        position: "굴복",
        element: "전격",
        best_persona: true,
        instinct: {
            name: "성천에 잠든 뱀 II",
            name_en: "Holy Pond's Serpent I",
            name_jp: "虹蛇の雷声 II",
            effects: [
                "크리티컬 효과가 17.4% 증가한다.",
                "필드의 적이 받는 크리티컬 효과가 18% 증가한다. 대상이 감전 상태일 경우 11% 추가 증가한다."
            ],
            effects_en: [
                "Increases CRIT DMG by 17.4%. Increases all foes' CRIT DMG taken by 14%, if they are inflicted with Shock, additionally increases the effect by 9%."
            ],
            effects_jp: [
                "クリティカルダメージが17.4%上昇。敵の被クリティカルダメージが14%上昇。敵が感電中の時、さらに9%上昇。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "전격 내성 제거",
            name_en: "Elec Break",
            name_jp: "電撃ガードキル",
            effect: "2턴 동안 적 1명의 전격 내성을 제거한다.",
            effect_en: "Suppress innate Electric resistances of 1 foe for 2 turns.",
            effect_jp: "2ターンの間、敵単体の電撃耐性を打ち消す。",
            priority: 3,
            icon: "디버프"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 전격 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK as Elec dmg to all foes and increase their DMG Taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に90.0% ATKの電撃属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
            {name : "타루카쟈", priority: 3 },
            {name : "리벨리온", priority: 3 },
            {name : "지오다인", priority: 3 },
            {name : "감전율 UP", priority: 3 },
            {name : "명중 강화", priority: 3 },
            {name : "우중충한 하늘", priority: 3},
        ],
        comment: "감전 효과를 주지 않아도 필드에 존재하는 것만으로도 크리티컬 효과 18%를 올릴 수 있다.",
        comment_en: "Even without applying the Shock effect, simply being present on the field can increase Crit Mult by 18%.",
        comment_jp: "感電効果を与えなくても、フィールドに存在するだけでCRT倍率を上昇させることができる。"
    },
    "나르키소스": {
        name_en: "Narcissus",
        name_jp: "ナルキッソス",
        grade: "5",
        star: "5",
        position: "굴복",
        element: "질풍",
        instinct: {
            name: "잃어버린 꽃향기 II",
            name_en: "Lost Fragrance II",
            name_jp: "花香の惑い II",
            effects: [
                "효과 명중이 24.9% 증가한다.",
                "풍습 효과 부여 후 2턴 동안 메인 목표 적이 받는 대미지가 22.4% 증가한다.",
                "또한 2턴 동안 자신의 효과 명중이 18% 증가한다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 24.9%. After inflicting Winded, increases the main target's dmg taken by 22.4% for 2 turns and increases own Ailment Accuracy by 18% for 2 turns."
            ],
            effects_jp: [
                "状態異常命中率が24.9%上昇。風襲にした時、選択した対象の被ダメージが22.4%上昇（2ターン持続）。さらに自身の状態異常命中が18%上昇（2ターン持続）。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "매복사냥",
            name_en: "Wild Hunt",
            name_jp: "スパイク",
            effect: "1명의 적에게 155.1%의 질풍 속성 대미지를 주고, 2턴 동안 100%의 기본 확률로 적을 풍습 상태에 빠뜨린다.",
            effect_en: "Deals 155.1% ATK Wind dmg to 1 foe and has a 100.0% chance of inflicting Winded for 2 turns.",
            effect_jp: "敵単体に攻撃力155.1%の疾風属性ダメージを与える。100%の確率で、2ターンの間、敵を風襲状態にする",
            priority: 1,
            icon: "질풍"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 질풍 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK Wind dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に90.0% ATKの風属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "질풍 강화", priority: 0},
             {name : "마도의 재능", priority: 0},
             {name : "공격 강화", priority: 0},
             {name : "어드바이스", priority: 0},
             {name : "정교한 타격", priority: 0},
        ]
    },
    "노른": {
        name_en: "Norn",
        name_jp: "ノルン",
        grade: "6",
        star: "5",
        position: "방위",
        element: "질풍",
        instinct: {
            name: "운명의 풍습 III",
            name_en: "Wind of Fate III",
            name_jp: "運命の導き III",
            effects: [
                "방어력이 37.4% 증가한다.",
                "풍습 효과 부여 시 효과를 입은 적의 방어력이 31.5% 감소하고, 자신의 방어력이 30% 증가한다. 효과는 2턴 간 지속된다."
            ],
            effects_en: [
                "Increases DEF by 37.4%. After inflicting Winded, decreases the DEF of the inflicted enemies by 31.5% and increases own DEF by 30% for 2 turns."
            ],
            effects_jp: [
                "防御力が37.4%上昇。敵を風襲にした時、対象の防御力が31.5%低下し、自身の防御力が30%上昇(2ターン持続)"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "방풍막",
            name_en: "Wind Barrier",
            name_jp: "護風の盾",
            effect: "모든 동료가 2턴 동안 공격력 19.5%+590의 실드를 획득한다. 실드가 대미지를 받으면 35.0%의 기본 확률로 대미지를 준 대상을 풍습 상태에 빠뜨린다.",
            effect_en: "Grants All allies 19.5% ATK + 590 Shield for 2 turns. When that ally takes damage, there is a 35.0% base chance to inflict Winded for 2 turns on the source of damage.",
            effect_jp: "味方全体に攻撃力19.5%＋590のシールド(2ターン持続)を付与する。シールドがダメージを受けた時、35.0%の確率で、攻撃者を風襲状態にする。",
            priority: 0,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            effect_en: "Grants all allies 48.6% ATK + 1471 shield for 2 turns.",
            effect_jp: "全ての味方が48.6% ATK+1471のシールドを獲得し、2ターンの間持続する。",
            priority: 0
        },
        recommendSkill : [
            {name : "명중 강화", priority: 3},
            {name : "질풍률 UP", priority: 3},
            {name : "우중충한 하늘", priority: 3},
            {name : "마하갈라", priority: 3},
            {name : "갈다인", priority: 3},
            {name : "실드 강화", priority: 1},
        ],
        comment : "비슈누가 다른 파티에 사용됐지만 동일 메커니즘이 필요한 경우 채용한다.",
        comment_en: "Although Vishnu was used in a different party, it can be used if the same mechanism is needed.",
        comment_jp: "ビシュヌが別のパーティで使用されていますが、同じメカニズムが必要な場合は使用できます。"
    },
    "사히모치노카미": {
        name_en: "Sahimochi-no-kami",
        name_jp: "さひもちのかみ",
        grade: "8",
        star: "5",
        position: "지배",
        element: "빙결",
        wild_emblem_rainbow : true,
        event: true,
        instinct: {
            name: "신속한 귀환자 III",
            name_en: "Swift Returner III",
            name_jp: "迅速なる送還者 III",
            effects: [
                "공격력이 29.1% 상승한다.",
                "전투 시작 시 『차가운 비늘』 5중첩을 획득한다. 아군이 페르소나 스킬을 사용 시 자신은 『차가운 비늘』 1중첩을 획득한다 (5회 중첩 가능). 추가 효과 시전 시 『예리한 비늘』 1중첩을 획득한다 (5회 중첩 가능). 자신이 적 캐릭터에게 페르소나 스킬을 시전할 때,『차가운 비늘』이 5중첩이면 『차가운 비늘』과 『예리한 비늘』을 모두 소모하고, 2턴 동안 중첩 1개당 적이 받는 피해를 1.5% 증가시킨다."
            ],
            effects_en: [
                "Increases ATK by 29.1%. At the start of battle, gains 5 stacks of [Cold Scales]. When an ally uses a Persona skill, gain 1 stack of [Cold Scales], up to a maximum of 5 stacks. When triggering an additional effect, gain 1 stack of [Sharp Cold Scales], up to 5 stacks. After using a Persona skill on an enemy, if you have 5 stacks of [Cold Scales], consume all [Cold Scales] and [Sharp Cold Scales] to increase the enemy’s DMG taken by 1.5% per stack for 2 turns."
            ],
            effects_jp: [
                "攻撃力が29.1%上昇する。戦闘開始時に「寒鱗」を5スタック獲得する。味方がペルソナスキルを発動すると、自身が「寒鱗」を1スタック獲得し、最大5スタックまで可能。追加効果を発動すると、「鋭い寒鱗」を1スタック獲得し、最大5スタックまで可能。敵にペルソナスキルを使用した後、自身の「寒鱗」が5スタックに達している場合、「寒鱗」と「鋭い寒鱗」をすべて消費し、スタック1つにつき敵が受けるダメージを1.5%増加させる（持続2ターン）。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "한 줄기 냉기",
            name_en: "Chilling Depth",
            name_jp: "深淵の冷気",
            effect: "적 전체에게 공격력 100.0%의 빙결 속성 대미지를 주고, 2턴 동안 적이 받는 추가 효과 대미지 증폭을 8.0% 증가시키며, 받는 빙결 속성 대미지가 8.0% 증가한다.",
            effect_en: "Deals 100.0% ATK Ice dmg to all foes. For 2 turns, increases all foes' additional dmg taken by 8.0%, and increases all foes' Ice dmg taken by 8.0%.",
            effect_jp: "敵全体に攻撃力100.0%の氷結属性ダメージを与える。2ターンの間、敵が受ける追加ダメージが8.0%増加、敵が受ける氷結属性ダメージが8.0%増加する。",
            priority: 2,
            icon: "빙결광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 빙결 속성 대미지를 준다.",
            effect_en: "Deals 180.0% ATK as Ice dmg to all foes.",
            effect_jp: "全ての敵に180.0% ATKの氷結属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "공격 강화", priority: 0 },
            {name : "빙결 강화", priority: 0 },
            {name : "어드바이스", priority: 0 },
            {name : "정교한 타격", priority: 0 },
            {name : "마도의 재능", priority: 0 }
        ]
    },
    "야마타노오로치": {
        name_en: "Yamata-no-Orochi",
        name_jp: "ヤマタノオロチ",
        grade: "7",
        star: "5",
        position: "반항",
        element: "빙결",
        instinct: {
            name: "제물의 비명 III",
            name_en: "Screams of Sacrifice III",
            name_jp: "生贄の悲鳴 III",
            effects: [
                "크리티컬 확률이 17.5% 증가한다.",
                "전투 시작 시 『제물의 비명』을 3중첩 획득한다. 자신의 턴 종료 시 『제물의 비명』을 1중첩 획득한다. 자신이 고유 스킬 시전 시 『제물의 비명』을 3중첩 보유한 경우, 『제물의 비명』을 3중첩 소모해 3턴 동안 모든 적을 동결에 빠뜨린다. 또한 3턴 동안 적이 받는 TECH 대미지가 25% 증가한다."
            ],
            effects_en: [
                "Increases CRIT Rate by 17.5%. At the start of battle, gains 3 stacks of [Screams of Sacrifice]. Gains 1 stack of [Screams of Sacrifice] at the end of your turn. When using the signature skill, if you have 3 stacks of [Screams of Sacrifice], then consumes 3 stacks of [Screams of Sacrifice] to inflict all foes with Freeze for 3 turns, and increases all foes' TECHNICAL dmg taken by 25% for 3 turns."
            ],
            effects_jp: [
                "クリティカル率が17.5％上昇。戦闘開始時に「生贄の悲鳴」を3つ獲得、自身のターン終了時に「生贄の悲鳴」を1つ獲得。固有スキル使用時、「生贄の悲鳴」が3つ以上の場合、3つ消費し、敵全体を凍結状態にする（3ターン継続）。さらに敵の被テクニカルダメージが25％上昇（3ターン継続）。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "광풍 눈",
            name_en: "Blizzard",
            name_jp: "狂雪",
            effect: "모든 적에게 공격력 100.0%의 빙결 속성 대미지를 주고, 2턴 동안 100.0%의 기본 확률로 메인 목표 적을 동결 상태에 빠뜨린다.",
            effect_en: "Deals 100.0% ATK Ice dmg to all foes, with a 100% base chance to inflict all foes with Freeze for 2 turns.",
            effect_jp: "敵全体に攻撃力100.0%の氷結属性ダメージを与え、100.0%の確率で、2ターンの間、選択した対象を凍結状態にする。",
            priority: 1,
            icon: "빙결광역"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 빙결 속성 대미지를 준다.",
            effect_en: "Deal 360% ATK as Ice dmg to 1 foe.",
            effect_jp: "1体の敵に360.0% ATKの氷結属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "공격 강화", priority: 0 },
            {name : "어드바이스", priority: 0 },
            {name : "정교한 타격", priority: 0 },
            {name : "마도의 재능", priority: 0 },
            {name : "빙결 강화", priority: 0}
        ]
    },
    "황룡": {
        name_en: "Kohryu",
        name_jp: "コウリュウ",
        grade: "8",
        star: "5",
        position: "지배",
        element: "염동",
        instinct: {
            name: "길조의 주인 III",
            name_en: "Lord of Auspiciousness III",
            name_jp: "瑞兆の主 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "모든 동료가 각 속성의 대미지를 줄 때마다 황룡이 『사상』을 1중첩 획득한다(4회 중첩 가능). 백업 출전 시에도 유효.",
                "자신의 턴 시작 시 만약 『사상』을 최소 4중첩 보유하면 모든 『사상』이 제거되고 『사상의 힘』을 획득한다.",
                "『사상의 힘』: 2턴 동안 자신의 공격력이 30% 증가하고, 모든 아군 동료의 공격력이 15% 증가하며, 자신의 스킬이 진화한다."
            ],
            effects_en: [
                "Increases ATK by 29.1%. Works when not active: Gains 1 stack of [Four Symbols] when allies deal different elemental damage, up to 4 stacks. At the start of your turn, if you have at least 4 stacks of [Four Symbols], then consumes all [Four Symbols] to gain [Four Symbols' Power]: Increases own ATK by 30% and all allies' ATK by 15%, then evolves your signature skill for 2 turns."
            ],
            effects_jp: [
                "攻撃力が29.1％上昇。控えでも効果発動：味方が異なる属性ダメージを与える毎「四神」を1つ付与（最大4つ）。自身のターン開始時に「四神」が4つの時、すべての「四神」を消費して「四神の力」を獲得。「四神の力」：自身の攻撃力が30％上昇、味方全体の攻撃力が15％上昇、コウリュウのスキルが進化（2ターン持続）。"
            ],
            priority: 2 
        },
        uniqueSkill: {
            name: "심마격",
            name_en: "Devious Strike",
            name_jp: "心魔撃",
            effect: "모든 적에게 공격력 101.4%의 염동 속성 대미지를 준다.",
            effect_en: "Deals 101.4% ATK Psy dmg to all foes. Evolved: Deals 125.0% ATK Psy dmg to all foes. There is a 35.0% base chance to inflict all foes with Dizzy for 2 turns.",
            effect_jp: "敵全体に攻撃力101.4％の念動属性ダメージを与える。進化：敵全体に攻撃力125.0％の念動属性ダメージを与える。35.0％の基本確率で敵全体を目眩状態にする。",
            priority: 0,
            icon: "염동광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 염동 속성 대미지를 준다.",
            effect_en: "Deals 180.0% ATK as Psy dmg to all foes.",
            effect_jp: "全ての敵に180.0% ATKの念動属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [        
        ],
        comment : "백업 출전에서 공격력 15% 증가 버프를 활용할 수 있을 때 사용한다.",
        comment_en: "Use when you can utilize the 15% ATK buff in a backup.",
        comment_jp: "バックアップ出戦で15%の攻撃力ボーナスを活用できる時、使用する。"
    },
    "스라오샤": {
        name_en: "Sraosha",
        name_jp: "スラオシャ",
        grade: "8",
        star: "5",
        position: "굴복",
        element: "축복",
        wild_emblem_rainbow : true,
        instinct: {
            name: "죄악의 경청자 III",
            name_en: "Listener of Sin III",
            name_jp: "罪悪の傾聴者 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "전투 시작 시 3턴 동안 『신의 귀』를 2중첩 획득한다 (3회 중첩 가능).",
                "아군이 HIGHLIGHT를 사용하면 『신의 귀』를 1중첩 획득한다. 축복 속성 괴도가 HIGHLIGHT를 사용하면 추가로 『신의 귀』를 1중첩 획득한다.",
                "고유 스킬 사용 시 『신의 귀』가 모두 소모되며, 중첩마다 적이 받는 축복 속성 대미지가 2턴 동안 6% 증가한다.",
                "『신의 귀』가 3중첩에 도달하면 축복 속성 대미지를 받는 적의 방어력이 추가로 25% 감소한다."
            ],
            effects_en: [
                "Increases ATK by 29.1%. At the start of battle, gains 2 stacks of [God's Ear] for 3 turns, up to 3 stacks. When allies use [HIGHLIGHT], gains 1 stack of [God's Ear], additionally gains 1 stack of [God's Ears] when Bless allies use [HIGHLIGHT]. When using the signature skill, consumes all [God's Ear], each stack increases Bless dmg taken by 6% for 2 turns. If [God's Ear] reaches 3 stacks, additionally decreases foes' DEF when taking Bless damage by 25%."
            ],
            effects_jp: [
                "攻撃力が29.1%増加する。戦闘開始時、3ターンの間『神の耳』を2重複獲得する（3回重複可能）。味方がHIGHLIGHTを使用すると『神の耳』を1重複獲得する。祝福属性怪盗がHIGHLIGHTを使用すると追加で『神の耳』を1重複獲得する。固有スキル使用時『神の耳』が全て消費され、重複ごとに敵が受ける祝福属性ダメージが2ターンの間6%増加する。『神の耳』が3重複に達すると祝福属性ダメージを受ける敵の防御力が追加で25%減少する。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "절대복종",
            name_en: "Absolute Obedience",
            name_jp: "絶対服従",
            effect: "1명의 적에게 공격력 200.0%의 축복 속성 대미지를 준다. 1턴 동안 목표가 받는 HIGHLIGHT 대미지가 30.0% 증가한다.",
            effect_en: "Deals 200% ATK Bless dmg to 1 foe. Increases their [HIGHLIGHT] dmg taken by 30% for 1 turn.",
            effect_jp: "1体の敵に200.0% ATKの祝福属性ダメージを与える。1ターンの間ターゲットが受けるHIGHLIGHTダメージが30.0%増加する。",
            priority: 2,
            icon: "축복"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 축복 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK Bless dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に90.0% ATKの祝福属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "라쿤다", priority: 3},
             {name : "마하타루카 오토", priority: 2},
             {name : "민첩의 마음가짐", priority: 1},
             {name : "마도의 재능", priority: 0},
             {name : "공격 강화", priority: 0},
             {name : "어드바이스", priority: 0},
             {name : "정교한 타격", priority: 0},
             {name : "축복 강화", priority: 0}
        ],
        comment : "선봉이 아닌 파티에 속해있기만 해도 『신의 귀』중첩을 획득 가능하다.",
        comment_en: "Can gain [God's Ear] stacks just by being in the party, not necessarily in the front line.",
        comment_jp: "先鋒でなくてもパーティに属しているだけで『神の耳』重複を獲得可能である。"
    },
    "바스키" : {
        name_en: "Vasuki",
        name_jp: "ヴァスキ",
        grade: "8",
        star: "5",
        position: "굴복",
        element: "총격",
        wild_emblem_rainbow : true,
        instinct: {
            name: "하늘과 땅을 잇는 올가미 III",
            name_en: "Serpent of the Sky and Earth III",
            name_jp: "天と地を繋ぐヴァスキ III",
            effects: [
                "효과 명중이 34.9% 중가한다.",
                "전투 시작 시 『응시』를 5중첩 획득한다. 아군 동료가 스킬로 디버프 효과 추가 시, 자신이 『응시』를 1중첩 획득한다(5회 중첩 가능, 동료 마다 턴당『응시』최대 1회 추가).",
                "자신이 페르소나 스킬 시전 시, 『응시』를 5중첩 보유한 경우 『응시』를 5중첩 소모하여 스킬 메인 목표가 받는 지속 대미지 효과가 15% 증가하며, 『뱀독』을 1중첩 추가 획득한다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 34.9%. At the start of battle, gains 5 stacks of [Stare]. When allies add debuff effects with their skills, gains 1 stack of [Stare] for yourself (up to 5 stacks, 1 stack per ally per turn). When using the signature skill, if you have 5 stacks of [Stare], consumes all [Stare] to increase the damage effect taken by the main target of the skill by 15% and gain 1 stack of [Serpent's Bite]."
            ],
            effects_jp: [
                "状態異常命中が34.9%増加する。戦闘開始時、5重複の『意識』を獲得する。味方がスキルでデバフ効果を付与すると、自身に『意識』を1重複獲得（最大5重複、味方1人あたり1重複/ターン）。固有スキル使用時、『意識』が5重複の時、すべての『意識』を消費してメインターゲットが受けるダメージ効果を15%増加させ、『ヴァスキの毒』を1重複獲得する。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "끝없는 속박",
            name_en: "Endless Bind",
            name_jp: "無限の縛り",
            effect: "1명의 적의 받는 대미지가 16.0% 중가하고, 목표가『뱀독』을 1중첩 획득한다(2회 중첩 가능). 효과는 3턴 동안 지속된다. 『뱀독』: 턴마다 아군 중 공격력이 가장 높은 괴도 공격력 12.8%의 주원 속성 대미지를 받는다(최대로 원더 공격력의 300% 적용).",
            effect_en: "Increases the enemy's dmg taken by 16.0% and gains 1 stack of [Serpent's Bite] (up to 2 stacks). Effect lasts for 3 turns. [Serpent's Bite]: Each turn, the highest ATK Wonder deals 12.8% ATK Psy dmg to the target (maximum 300% of Wonder ATK).",
            effect_jp: "敵が受けるダメージが16.0%増加し、『ヴァスキの毒』を1重複獲得（最大2重複）。効果は3ターンの間持続する。『ヴァスキの毒』：各ターン、最も高いATKのウォンダーがターゲットに12.8% ATKの念動属性ダメージを与える（最大300%のウォンダーATK適用）。",
            priority: 2,
            icon: "디버프"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 총격 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK Gun dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に90.0% ATKの銃撃属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
            {name : "라쿤다", priority: 3}
        ]
    },

    "체르노보그": {
        name_en: "Chernobog",
        name_jp: "チェルノボーグ",
        grade: "7",
        star: "5",
        position: "굴복",
        element: "물리",
        wild_emblem_rainbow : true,
        instinct: {
            name: "만연한 적막 III",
            name_en: "Deadly Silence III",
            name_jp: "蔓延する静寂 III",
            effects: [
                "효과 명중이 34.9% 증가한다.",
                "『악몽』은 2턴 동안 효과 저항이 15%, 방어력이 10% 감소한다.『악몽』 상태일 때 적이 받는 물리 대미지가 8% 증가한다.",
                "적이 물리 대미지를 3회 받을 때마다 추가로 1중첩을 획득하며 독립적으로 계산된다. 최대 3회 중첩 가능하며 2턴 동안 지속된다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 34.9%. [Nightmare] decreases Effect RES by 15% and DEF by 10% for 2 turns. Under [Nightmare], increases enemies' Phys dmg taken by 8% for 1 turn. Additionally increases Phys dmg taken stacks by 1 after the enemy takes 3 hits of Phys damage, up to 3 stacks, each stack counts down independently."
            ],
            effects_jp: [
                "状態異常命中が34.9%増加する。『悪夢』は2ターンの間効果抵抗が15%、防御力が10%減少する。『悪夢』状態の時、敵が受ける物理ダメージが8%増加する。敵が物理ダメージを3回受けるたびに追加で1重複を獲得し、独立して計算される。最大3回重複可能で2ターンの間持続する。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "고통의 심판",
            name_en: "Painful Judgement",
            name_jp: "苦痛の審判",
            effect: "1명의 적에게 40.0%의 물리 속성 대미지를 3회 주고, 적에게 『악몽』 효과를 준다. 또한 9.0%의 기본 확률로 공포 효과를 축라한다.",
            effect_en: "Deals 40.0% ATK Phys dmg to 1 enemy 3 times, inflicts the enemy with [Nightmare], and there is a 9% base chance to inflict Fear.",
            effect_jp: "1体の敵に40.0% ATKの物理属性ダメージを3回与え、敵に『悪夢』効果を与える。また、9.0%の基本確率で恐怖効果を付与する。",
            priority: 2,
            icon: "물리"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 물리 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK Phys dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に90.0% ATKの物理属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "마하타루카 오토", priority: 2},
             {name : "민첩의 마음가짐", priority: 1},
             {name : "공격 강화", priority: 0 },
             {name : "어드바이스", priority: 0 },
             {name : "정교한 타격", priority: 0 },
             {name : "마도의 재능", priority: 0 },
             {name : "물리 강화", priority: 0 },
        ]
    },
    "시바": {
        name_en: "Shiva",
        name_jp: "シヴァ",
        grade: "8",
        star: "5",
        position: "굴복",
        element: "염동",
        wild_emblem_rainbow : true,
        instinct: {
            name: "인과의 유전 III",
            name_en: "Karma Reversal III",
            name_jp: "因果の遺伝 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "턴이 시작될 때마다 『혜안』를 획득한다. (3회 중첩 가능). 고유 스킬을 사용하여 『혜안』을 소모하며 소모량에 따라 다음 효과를 얻을 수 있다.",
                "1중첩 : 이번 염동 공격 시 대미지가 33% 증가한다.",
                "2중첩 : 1턴 동안 적의 방어력이 45% 감소한다.",
                "3중첩 : 1턴 동안 목표가 염동 대미지를 받을 때 크리티컬 확률이 18% 증가한다."
            ],
            effects_en: [
                "Increases ATK by 29.1%. Gains 1 stack of [Wisdom] at the start of turn, up to 3 stacks. Consumes all [Wisdom] when using the signature skill and triggers the following effects based on the amount consumed: 1 Stack: Increases this damage by 33%. 2 Stacks: Decreases all foes' DEF by 45% for 1 turn. 3 Stacks: Increases all foes' Psy DMG CRIT Rate taken by 18% for 1 turn."
            ],
            effects_jp: [
                "攻撃力が29.1%増加する。ターンが始まるたびに『慧眼』を獲得する（3回重複可能）。固有スキルを使用して『慧眼』を消費し、消費量に応じて次の効果を得ることができる。1重複：今回の念動攻撃時ダメージが33%増加する。2重複：1ターンの間敵の防御力が45%減少する。3重複：1ターンの間ターゲットが念動ダメージを受ける時クリティカル率が18%増加する。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "파멸의 춤",
            name_en: "Dance of Destruction",
            name_jp: "破滅の踊り",
            effect: "모든 적에게 공격력 100%의 염동 속성 대미지를 1단계 입히고, 모든 『혜안』을 소모하여 본능 [인과의 유전] 효과를 발동한다.",
            effect_en: "Deals 90.0% ATK Psy dmg to all foes and consumes all stacks of [Wisdom] and trigger the effects of [Karma Reversal].",
            effect_jp: "全ての敵に100% ATKの念動属性ダメージを1段階与え、全ての『慧眼』を消費して本能[因果の遺伝]効果を発動する。",
            priority: 1,
            icon: "염동광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 염동 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK Psy dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に90.0% ATKの念動属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
            {name : "마하타루카 오토", priority: 2},
            {name : "민첩의 마음가짐", priority: 1},
            {name : "공격 강화", priority: 0 },
            {name : "어드바이스", priority: 0 },
            {name : "정교한 타격", priority: 0 },
            {name : "마도의 재능", priority: 0 },
            {name : "염동 강화", priority: 0 },
        ]
    },
    "오오쿠니누시": {
        name_en: "Okuninushi",
        name_jp: "オオクニヌシ",
        grade: "5",
        star: "5",
        position: "지배",
        element: "염동",
        instinct: {
            name: "지배자의 위엄 II",
            name_en: "Regent's Majesty II",
            name_jp: "支配者の威厳 II",
            effects: [
                "크리티컬 확률이 12.5% 증가한다.",
                "페르소나 스킬을 시전해 적에게 대미지를 준 후, 3턴 동안 적이 받는 염동 속성 대미지가 8.5% 증가한다(3회 중첩 가능).",
                "해당 효과를 보유한 적 공격 시 염동 속성 대미지가 10% 증가한다."
            ],
            effects_en: [
                "Increases CRIT Rate by 12.5%. After dealing damage with a Persona skill, increases foes' Psy dmg taken by 8.5% for 3 turns, up to 3 stacks. Increases Psy damage by 10% when attacking foes with this debuff."
            ],
            effects_jp: [
                "クリティカル率が12.5%上昇。スキルを使用時、敵の被念動属性ダメージが8.5%上昇(最大3つ3ターン持続)。該当効果を保有した敵攻撃時、念動属性ダメージが10%増加する。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "정신 파동",
            name_en: "Mental Wave",
            name_jp: "精神波",
            effect: "모든 적에게 공격력 88.0%의 염동 속성 대미지를 준다. 정신 이상 적에 대한 대미지는 20% 증가하며, 목표 적의 약점 속성이 염동일 경우에는 주는 대미지가 추가로 15% 증가한다.",
            effect_en: "Deals 88.0% ATK Psy dmg to all foes. Increases dmg dealt by 20% if the foe is inflicted with Mental Ailments. Additionally increases dmg dealt by 15% if the foe is weak to Psy.",
            effect_jp: "敵全体に攻撃力88.0%の念動属性ダメージを与える。行動異常の敵への与ダメージが20%上昇する。敵の弱点が念動の場合、さらにダメージが15%上昇する。",
            priority: 1,
            icon: "염동광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 염동 속성 대미지를 준다.",
            effect_en: "Deals 180.0% ATK as Psy dmg to all foes.",
            effect_jp: "全ての敵に180.0% ATKの念動属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "공격 강화", priority: 0 },
            {name : "어드바이스", priority: 0 },
            {name : "정교한 타격", priority: 0 },
            {name : "마도의 재능", priority: 0 },
            {name : "물리 강화", priority: 0 },
        ]
    },
    "앨리스": {
        name_en: "Alice",
        name_jp: "アリス",
        grade: "8",
        star: "5",
        position: "굴복",
        element: "주원",
        instinct: {
            name: "환생의 주원 III",
            name_en: "Curse of Rebirth III",
            name_jp: "再生の呪い III",
            effects: [
                "효과 명중이 34.9% 증가한다.",
                "모든 적이 받는 주원 속성 대미지가 18% 증가한다.",
                "모든 동료가 주원 속성의 페르소나 스킬을 1개 시전할 때마다 앨리스의 효과 명중, 공격력이 12.6% 증가한다. 효과는 2턴 동안 지속되며 3회 중첩 가능하다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 34.9%. Increases all foes' Curse dmg taken by 18%. After any ally uses Curse skills, increases Alice's Ailment Accuracy and ATK by 12.6% for 2 turns, up to 3 stacks."
            ],
            effects_jp: [
                "状態異常命中が34.9％上昇。敵全体の被呪怨属性ダメージが18％上昇。味方全体が呪怨属性スキルを1回使う毎、アリスの状態異常命中、攻撃力が12.6％上昇（最大3つ、2ターン持続）。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "죽어 줄래?",
            name_en: "Die For Me!",
            name_jp: "死んでくれる？",
            effect: "2턴 동안 모든 적이 받는 주원 속성 대미지가 17.5% 증가하고, 효과 명중 30%마다 추가로 2% 증가한다. 상한은 10%이다. 적의 생명이 50% 미만일 시 높은 확률로 즉사 효과가 추가된다.",
            effect_en: "Increases all enemies' Curse DMG Taken by 17.5% + 2% for every 30% Ailment Accuracy you have, up to 10% for 2 turns. There is a high chance of insta-kill to enemies under 50% HP. The lower the HP, the higher the chance.",
            effect_jp: "2ターンの間、敵全体の呪怨属性の被ダメージを17.5％上昇し、状態異常命中率30％ごとに追加で2％上昇する（最大10％）。敵のHPが50％未満の場合、高確率で即死させる。",
            priority: 2,
            icon: "주원광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 주원 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK Curse dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に90.0% ATKの呪怨属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "타루카쟈", priority: 3 },
             {name : "명중 강화", priority: 3 },
             {name : "우중충한 하늘", priority: 3 },
        ],
        comment : "기본 명중 80% + 명중 강화 IV 16.2% + 우중충한 하늘 16.9% + 본능 34.9% + 마이팰리스 2.3% = 150.3% 로 \'죽어 줄래?\' 상한 10%를 채울 수 있다. (우중충한 하늘 적용 여부 미확인)",
        comment_en: "Base accuracy 80% + Accuracy Enhancement IV 16.2% + Gloomy Sky 16.9% + Core Passive 34.9% + My Palace 2.3% = 150.3%, which can reach the 'Die For Me!' upper limit of 10%. (Gloomy Sky application unconfirmed)",
        comment_jp: "基本命中80% + 命中強化IV 16.2% + 憂鬱な空16.9% + 本能34.9% + マイパレス2.3% = 150.3%で「死んでくれる？」上限10%を満たすことができる。（憂鬱な空適用可否未確認）"
    },
    "비사문천": {
        name_en: "Bishamonten",
        name_jp: "毘沙門天",
        grade: "7",
        star: "5",
        position: "반항",
        element: "핵열",
        wild_emblem_rainbow : true,
        instinct: {
            name: "격노의 혜산 III",
            name_en: "Furious Umbrella III",
            name_jp: "破邪の宝塔 III",
            effects: [
                "크리티컬 확률이 17.5% 증가한다.",
                "적에게 스킬 시전 시, 메인 목표 적이 원소 이상을 1중첩 보유할 때마다 받는 핵열 대미지가 2턴 동안 10% 증가한다. (3회 중첩 가능).",
                "또한 다른 적이 해당 효과의 40%를 획득한다."
            ],
            effects_en: [
                "Increases CRIT Rate by 17.5%. After using a skill on enemies, increases the main target's Nuke dmg taken by 10% for 1 turn for every Elemental Ailment they have, up to 3 stacks. All other enemies gain 40% of this effect."
            ],
            effects_jp: [
                "クリティカル率が17.5％上昇。敵にスキルを使用時、属性異常1つごとに、対象の被核熱属性ダメージが10％上昇（最大3つ、1ターン持続）。また、他の敵が該当効果の40％を獲得する。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "존왕의 항복",
            name_en: "The King's Surrender",
            name_jp: "尊王の調伏",
            effect: "1명의 적에게 180.0%의 핵열 속성 대미지를 주고, 원소 이상 상태인 적 공격 시 해당 스킬 대미지가 25% 증가한다. 또한 아군 핵열 속성 동료의 공격력이 20% 증가하고, 2턴간 지속된다.",
            effect_en: "Deals 180.0% ATK Nuke dmg to 1 foe. Increases dmg dealt to enemy inflicted with Elemental Ailments by 25% and increases all Nuke allies' ATK by 20% for 2 turns.",
            effect_jp: "敵単体に180.0％攻撃力の核熱属性ダメージを与え、属性異常の敵に対してはこのスキルの与ダメージが25％上昇する。また、核熱属性の味方の攻撃力が20％上昇し、2ターンの間持続する。",
            priority: 1,
            icon: "핵열"
        },
        highlight: {
            effect: "1명의 적에게 360.0%의 핵열 속성 대미지를 준다.",
            effect_en: "Deal 360% ATK as Nuke dmg to 1 foe.",
            effect_jp: "1体の敵に360.0% ATKの核熱属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "라쿤다", priority: 3 },
            {name : "마하타루카 오토", priority: 2},
            {name : "민첩의 마음가짐", priority: 1},
        ],
        comment : "라쿤다를 사용해도 본능 효과가 적용된다.",
        comment_en: "The core passive effect is applied even when using Rakunda.",
        comment_jp: "ラクンダを使用しても本能効果が適用される。"
    },
    "토르": {
        name_en: "Thor",
        name_jp: "トール",
        grade: "7",
        star: "5",
        position: "지배",
        element: "전격",
        instinct: {
            name: "뇌신의 위엄 III",
            name_en: "Thunder God's Majesty III",
            name_jp: "雷神の威厳 III",
            effects: [
                "아군 괴도가 전격 속성의 페르소나 스킬/추가 효과/HIGHLIGHT 시전 시 2턴 동안 자신이 『뇌신의 위세』를 1중첩 획득한다(3회 중첩 가능).",
                "자신이 페르소나 스킬 대미지를 주었을 때, 만약 자신의 『뇌신의 위세』가 3중첩이면 2턴 동안 전체 적이 받는 전격 속성 대미지가 12% 증가하고, 받는 전격 속성 크리티컬 효과가 20% 증가한다."
            ],
            effects_en: [
                "Increases CRIT DMG by 34.9%. When allies use Elec Persona skill / Follow Up / HIGHLIGHT / Theurgy, gains 1 stack of [Thunder God's Might] for 2 turns, up to 3 stacks. When you deal damage with a Persona skill, if you have 3 stacks of [Thunder God's Might], increases all enemies' Elec dmg taken by 12% and Elec CRIT dmg taken by 20% for 2 turns."
            ],
            effects_jp: [
                "クリティカルダメージが34.9％上昇。味方が電撃属性スキル/意識奏功/ハイライトを使う毎、自身が「雷神の威厳」を1つ獲得（最大3つ、2ターン持続）。自身がスキルで電撃属性ダメージを与えた時、「雷神の威厳」が3つの場合、敵全体の被電撃属性ダメージが12％上昇、被電撃属性クリティカルダメージが20％上昇（2ターン継続）。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "하늘이 부른 번개",
            name_en: "Heavenly Thunder",
            name_jp: "召雷",
            effect: "모든 적에게 공격력 112%의 전격 속성 대미지를 준다. 『뇌신의 위세』가 3중첩일 경우, 80%의 기본 확률로 모든 적을 감전 상태에 빠뜨린다.",
            effect_en: "Deals 112.0% ATK Elec dmg to all foes. When [Thunder God's Might] is at 3 stacks, there is an 80% base chance to inflict all enemies with Shock for 2 turns.",
            effect_jp: "敵全体に攻撃力112％の電撃属性ダメージを与える。「雷神の威厳」が3つの時、80％の確率で2ターンの間、敵全体を感電状態にする。",
            priority: 2,
            icon: "전격광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180%의 전격 속성 대미지를 준다.",
            effect_en: "Deals 180.0% ATK as Elec dmg to all foes.",
            effect_jp: "全ての敵に180% ATKの電撃属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "감전율 UP", priority: 3 },
            {name : "명중 강화", priority: 3 },
            {name : "우중충한 하늘", priority: 3},
            {name : "어드바이스", priority: 0},
            {name : "정교한 타격", priority: 0},
            {name : "전격 강화", priority: 0},
        ]
    },
    "자오우곤겐":{
        name_en: "Zaou-Gongen",
        name_jp: "蔵王権現",
        grade: "8",
        star: "5",
        position: "반항",
        element: "화염",
        wild_emblem_rainbow : true,
        instinct: {
            name: "삼세 제도 III",
            name_en: "Three Ages' Salvation III",
            name_jp: "三世済度 III",
            effects: [
                "공격력이 29.1% 증가한다. 페르소나 스킬을 시전해 대미지를 준 후 3턴 동안 자신과 공격력이 가장 높은 반항/지배 동료가 『불멸의 진리』를 획득한다.",
                "『불멸의 진리』: 스킬을 시전해 4회 이상 대미지를 줄 때 자신의 공격력이 12%, 대미지가 10% 증가한다."
            ],
            effects_en: [
                "Increases ATK by 29.1%. After dealing damage with a Persona skill, gives self and the highest ATK Single-target/Multi-target ally [Undying Truth] for 3 turns. [Undying Truth]: When dealing 4 hits of damage with skills, increases own ATK by 12% and dmg dealt by 10%."
            ],
            effects_jp: [
                "攻撃力が29.1%増加する。ペルソナスキルでダメージを与えた後、3ターンの間自分と攻撃力が最も高い反逆/支配味方が『不滅の真理』を獲得する。『不滅の真理』：スキルで4回以上ダメージを与える時、自分の攻撃力が12%、ダメージが10%増加する。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "분노한 진신",
            name_en: "Fury Incarnate",
            name_jp: "怒りの真神",
            effect: "1명의 적에게 공격력 48.0%의 화염 속성 대미지를 4회 준다. 적군에게 「외상」을 주며 3턴 동안 지속된다. 「외상」기간 동안 목표가 화염 속성 대미지를 1회 받을 때 마다 2턴 동안 받는 크리티컬 효과가 3% 증가한다(8회 중첩 가능).",
            effect_en: "Deals 48.0% ATK Fire dmg to 1 foe 4 times. Inflicts the foe with [Trauma] for 3 turns. During [Trauma], each time the target takes 1 hit of Fire dmg, increases their CRIT dmg taken by 3% for 2 turns, up to 8 stacks.",
            effect_jp: "1体の敵に48.0% ATKの火炎属性ダメージを4回与える。敵軍に「外傷」を与え、3ターンの間持続する。「外傷」期間中、ターゲットが火炎属性ダメージを1回受けるたびに2ターンの間受けるCRT倍率が3%増加する（8回重複可能）。",
            priority: 3,
            icon: "화염"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 화염 속성 대미지를 준다.",
            effect_en: "Deal 360% ATK as Fire dmg to 1 foe.",
            effect_jp: "1体の敵に360.0% ATKの火炎属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "공격 강화", priority: 0 },
            {name : "어드바이스", priority: 0 },
            {name : "정교한 타격", priority: 0 },
            {name : "마도의 재능", priority: 0 },
            {name : "화염 강화", priority: 0 },
        ]
    },
    "트론": {
        name_en: "Throne",
        name_jp: "ソロネ",
        grade: "7",
        star: "5",
        position: "우월",
        element: "화염",
        wild_emblem_rainbow : true,
        instinct: {
            name: "세속을 초월한 성인 III",
            name_en: "Otherworldly Saint III",
            name_jp: "世俗を超越した聖人 III",
            effects: [
                "공격력이 29.1% 증가한다.\n전투 시작 시 『불씨』를 8중첩 획득한다. 아군 캐릭터가 원소 이상을 추가할 때 자신은 『불씨』 1중첩을 획득한다. 만약 화상일 경우 『불씨』를 추가로 1중첩 획득하며 3턴 동안 지속된다 (10회 중첩 가능).\n매회 스킬은 『불씨』를 최대 2중첩 제공할 수 있다. 자신이 아군 캐릭터에게 페르소나 스킬 시전 시『불씨』가 4중첩 이상이면 모든 『불씨』를 소모해 중첩마다 2턴 동안 아군 전체 대미지가 1.5% 증가하며, 75%의 확률로 임의 적군 1명이 화상 상태에 빠진다."
            ],
            effects_en: [
                "Increases ATK by 29.1%. At the start of battle, gains 8 stacks of [Tinder]. Gains 1 stack of [Tinder] when allies inflict Elemental Ailments, gains 1 additional stack of [Tinder] if that Elemental Ailment was Burn for 3 turns, up to 10 stacks, each skill can give up to 2 stacks of [Tinder]. When using a Persona skill on allies, if [Tinder] is at 4 stacks or above, consumes all [Tinder] and increases all allies' dmg dealt by 1.5% for 2 turns, with a 75% base chance to inflict 1 random enemy with Burn."
            ],
            effects_jp: [
                "攻撃力が29.1%増加する。戦闘開始時『火種』を8重複獲得する。味方怪盗が元素異常を追加する時自分は『火種』1重複を獲得する。もし火傷の場合『火種』を追加で1重複獲得し3ターンの間持続する（10回重複可能）。毎回スキルは『火種』を最大2重複提供できる。自分が味方怪盗にペルソナスキル使用時『火種』が4重複以上なら全ての『火種』を消費し重複ごとに2ターンの間味方全体ダメージが1.5%増加し、75%の確率で任意敵軍1体が火傷状態になる。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "정화의 불",
            name_en: "Fire of Purification",
            name_jp: "浄化の火",
            effect: "3턴 동안 모든 아군 캐릭터의 공격력이 12.0% 증가하고, 자신의 공격력 500마다 0.8% 추가 증가한다(최대 6%). 또한 3턴 동안 스킬 메인 목표가 『정화의 불』을 획득한다. 『정화의 불』: 적군 캐릭터에게 페르소나 스킬을 시전하여 대미지를 준 후 75%의 기본 확률로 임의 적군 1명이 화상 상태에 빠진다.",
            effect_en: "Increases all allies' ATK by 12% + 0.8% for every 500 ATK you have, up to 6% for 3 turns. Gives the main target [Fire of Purification] for 3 turns. [Fire of Purification]: After dealing Persona skill damage to foes, there is a 75% base chance to inflict 1 random foe with burn.",
            effect_jp: "3ターンの間全ての味方怪盗の攻撃力が12.0%増加し、自分の攻撃力500ごとに0.8%追加増加する（最大6%）。また3ターンの間スキルメインターゲットが『浄化の火』を獲得する。『浄化の火』：敵軍怪盗にペルソナスキルを使用してダメージを与えた後、75%の基本確率で任意敵軍1体が火傷状態になる。",
            priority: 3,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            effect_en: "Increase all allies dmg dealt by 29.5% for 2 turns.",
            effect_jp: "全ての味方の与えるダメージが29.5%増加し、2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
            {name : "화상률 UP", priority: 3 },
            {name : "명중 강화", priority: 3 },
            {name : "우중충한 하늘", priority: 3},
        ],
        comment : "화상이 필수적인 캐릭터(ex. 미오)에게 사용하는 형태로 채용된다.",
        comment_en: "Adopted in a form used for characters who require burn effects (e.g., Mio).",
        comment_jp: "火傷が必須的な怪盗（例：ミオ）に使用する形で採用される。"
    },
    "라미아": {
        name_en: "Lamia",
        name_jp: "ラミア",
        grade: "3",
        star: "5",
        position: "굴복",
        element: "화염",
        instinct: {
            name: "아름다운 탐욕 I",
            name_en: "Gorgeous Greed I",
            name_jp: "艶やかなる貪欲 I",
            effects: [
                "효과 명중이 15% 증가한다.",
                "화상 효과를 부여할 때 효과 명중이 40% 증가한다. 화상 효과 부여 후 2턴 동안 모든 동료의 공격력이 12% 증가한다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 15%. Increases Ailment Accuracy by 40% when inflicting Burn. After inflicting Burn, increases all allies' ATK by 12% for 2 turns."
            ],
            effects_jp: [
                "状態異常命中が15%上昇し、炎上の場合は命中率が40%上昇。炎上した時、味方全体の攻撃力を12%上昇（2ターン持続）。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "화제",
            name_en: "Fire Offering",
            name_jp: "火祭り",
            effect: "1명의 적에게 150.0%의 화염 속성 대미지를 주고, 50.0%의 기본 확률로 적을 화상 상태에 빠뜨린다. 필드의 화상 상태인 적이 없을 시 명중 확률이 2배가 된다.",
            effect_en: "Deals 150.0% ATK Fire dmg to 1 foe, with a 50% base chance to inflict Burn, double the chance if there are no enemies inflicted with Burn.",
            effect_jp: "敵単体に攻撃力150.0%の火炎属性ダメージを与える。50.0%の確率で敵を炎上状態にする。炎上状態の敵がいない場合、命中率が2倍になる。",
            priority: 1,
            icon: "화염"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 화염 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK Fire dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に90.0% ATKの火炎属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
            {name : "마하라기다인", priority: 3 },
            {name : "화상률 UP", priority: 3 },
            {name : "명중 강화", priority: 3 },
            {name : "우중충한 하늘", priority: 3},
        ]
    },
    "바포멧": {
        name_en: "Baphomet",
        name_jp: "バフォメット",
        grade: "6",
        star: "5",
        position: "지배",
        element: "화염",
        instinct: {
            name: "악마의 주조 III",
            name_en: "Demonic Melter III",
            name_jp: "悪魔の蕩かし III",
            effects: [
                "공격력이 24.9% 증가한다.",
                "페르소나 스킬을 시전해 화상 상태인 적에게 대미지를 준 후, 1턴 동안 모든 적이 받는 화염 속성 대미지가 29% 증가한다."
            ],
            effects_en: [
                "Increases ATK by 24.9%. After dealing Persona skill damage to foes inflicted with Burn, increases all enemies' Fire dmg taken by 29% for 1 turn."
            ],
            effects_jp: [
                "攻撃力が24.9%上昇。炎上中の敵にスキルダメージ時、敵全体の被火炎属性ダメージが29%上昇(1ターン持続)"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "극열",
            name_en: "Overheat",
            name_jp: "灼熱",
            effect: "모든 적에게 67.5%의 화염 속성 대미지를 주고, 100%의 고정 확률로 스킬 메인 목표를 화상 상태에 빠뜨린다.",
            effect_en: "Deals 67.5% ATK Fire damage to all enemies and has a 100% fixed chance of inflicting Burn to the main target for 2 turns.",
            effect_jp: "敵全体に攻撃力67.5%の火炎属性ダメージを与える。選択した対象を炎上にする。",
            priority: 1,
            icon: "화염광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 화염 속성 대미지를 준다.",
            effect_en: "Deals 180.0% ATK as Fire dmg to all foes.",
            effect_jp: "全ての敵に180.0% ATKの火炎属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "엘 지하드", priority: 3 },
            {name : "감전율 UP", priority: 3 },
            {name : "명중 강화", priority: 3 },
            {name : "우중충한 하늘", priority: 3},
            {name : "어드바이스", priority: 0},
        ],
        comment : "이미 화상 상태인 적에게 [극열 : 화염 대미지 or 엘 지하드 : 감전 추가] 본능 효과를 발동한다.",
        comment_en: "Triggers core passive effect on enemies already in Burn state with [Overheat: Fire damage or Thunder Reign: Shock addition].",
        comment_jp: "既に火傷状態の敵に[極熱：火炎ダメージ or エル・ジハード：感電追加]本能効果を発動する。"
    },
    "요시츠네": {
        name_en: "Yoshitsune",
        name_jp: "ヨシツネ",
        grade: "8",
        star: "5",
        position: "지배",
        element: "물리",
        wild_emblem_rainbow : true,
        instinct: {
            name: "연승의 숙명 III",
            name_en: "Destined Streak III",
            name_jp: "連勝の宿命 III",
            effects: [
                "크리티컬 효과가 34.9% 중가한다.",
                "전투 시작 시 『기습』을 4중첩 획득한다. 2턴 동안 고유 스킬이 대미지를 줄 때마다 60% 확률로 『기습』을 획득하며,",
                "매회 자신의 공격력이 9%씩 중가한다(8회 중첩 가능). 8중첩 도달 시 크리티컬 확률이 30% 증가한다."
            ],
            effects_en: [
                "Increases CRIT DMG by 34.9%. At the start of battle, gains 4 stacks of [Ambush]. When using the signature skill there is a 60% chance to gain [Ambush], each stack increases own ATK by 9% for 2 turns, up to 8 stacks. Increases the CRIT Rate of the signature skill by 30% when reaching 8 stacks."
            ],
            effects_jp: [
                "CRT倍率が34.9%増加する。戦闘開始時『奇襲』を4重複獲得する。2ターンの間固有スキルがダメージを与えるたびに60%確率で『奇襲』を獲得し、毎回自分の攻撃力が9%ずつ増加する（8回重複可能）。8重複到達時CRT発生率が30%増加する。"
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "팔척뛰기",
            name_en: "Hassou Tobi",
            name_jp: "八艘跳び",
            effect: "모든 적에게 공격력 15.0%의 물리 속성 대미지를 8회 주고, 적 1명당 해당 스킬 대미지가 5% 증가하며, 최대 15% 증가한다.",
            effect_en: "Deals 15.0% ATK Phys dmg to all foes 8 times. For every 1 foe, increases skill damage by 5%, up to 15%.",
            effect_jp: "全ての敵に15.0% ATKの物理属性ダメージを8回与え、敵1体ごとに該当スキルダメージが5%増加し、最大15%増加する。",
            priority: 3,
            icon: "물리광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 물리 속성 대미지를 준다.",
            effect_en: "Deals 180.0% ATK as Phys dmg to all foes.",
            effect_jp: "全ての敵に180.0% ATKの物理属性ダメージを与える。",
            priority: 1
        },
        recommendSkill : [
            {name : "공격 강화", priority: 3 },
            {name : "어드바이스", priority: 3 },
            {name : "정교한 타격", priority: 3 },
            {name : "마도의 재능", priority: 3 },
            {name : "물리 강화", priority: 3 },
            {name : "공격의 마음가짐", priority: 3},
        ],
        comment: "WONDER를 메인 딜러로 사용할 경우 이 페르소나를 채용한다.",
        comment_en: "Adopt this persona when using WONDER as main dealer.",
        comment_jp: "WONDERをメインディーラーとして使用する場合、このペルソナを採用する。",
    },

    "네코쇼군": {
        name_en: "Neko Shogun",
        name_jp: "ネコショウグン",
        grade: "3",
        star: "5",
        position: "우월",
        element: "염동",
        instinct: {
            name: "건어를 사주겠다옹 I",
            name_en: "Have a Dried Fish I",
            name_jp: "干物をどうぞニャ I",
            effects: [
                "효과 명중이 15% 증가한다.",
                "전투 시작 시 2턴 동안 모든 동료의 효과 명중이 10% 증가하고, 효과 명중이 가장 높은 동료의 효과 명중이 14% 증가한다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 15%. At the start of battle, increases all allies' Ailment Accuracy by 10%, increases the Ailment Accuracy for the ally with the highest Ailment Accuracy by 14% for 2 turns."
            ],
            effects_jp: [
                "状態異常命中が15%上昇。戦闘開始時、味方全体の状態異常命中を10%上昇。状態異常命中が最も高い味方の状態異常命中を14%上昇（2ターン持続）。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "사냥 행동",
            name_en: "Hunter's Code",
            name_jp: "狩猟本能",
            effect: "2턴 동안 동료 1명이 주는 대미지가 18.0% 증가한다. 목표 동료의 효과 명중 20%마다 1.0%의 추가 대미지를 획득한다. 최대 6.0%까지 중첩된다.",
            effect_en: "Increases 1 ally's damage dealt by 18.0% + 1.0% for every 20% Ailment Accuracy Rate the ally has to a maximum of 6.0% for 3 turns.",
            effect_jp: "3ターンの間、味方単体の与ダメージが18.0%上昇し、対象の状態異常命中が20%ごとに、さらにダメージが1.0%上昇する。この効果は最大6.0%まで上昇する。",
            priority: 1,
            icon: "버프"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            effect_en: "Increase all allies dmg dealt by 29.5% for 2 turns.",
            effect_jp: "全ての味方の与えるダメージが29.5%増加し、2ターンの間持続する。",
            priority: 0
        },
        recommendSkill : [
            {name : "명중 강화", priority: 3 },
        ]
    },
    "트럼페터": {
        name_en: "Trumpeter",
        name_jp: "トランペッター",
        grade: "7",
        star: "5",
        position: "굴복",
        element: "만능",
        wild_emblem_rainbow : true,
        event: true,
        instinct: {
            name: "붕괴의 나팔 III",
            name_en: "Trumpet of Destruction III",
            name_jp: "破壊のパフェ III",
            effects: [
                "효과 명중이 34.9% 중가한다.",
                "자신이 적에게 페르소나 스킬 사용 시, 스킬 목표의 이상 효과 수량이 15개 이상일 경우 2턴 동안 자신의 효과 명중이 50% 중가하고, 적이 받는 대미지가 6.5% 중가한다. 자신이 정신 이상 효과를 추가한 후, 2턴 동안 적 전체의 방어력이 12% 감소한다.",
            ],
            effects_en: [
                "Increases Ailment Accuracy by 34.9%. When using a Persona skill against an enemy, if the number of debuff effects on the target is 15 or more, increases your Ailment Accuracy by 50% for 2 turns and increases the enemy's dmg taken by 6.5% for 2 turns. After adding debuff effects to the enemy, decreases all foes' DEF by 12% for 2 turns."
            ],
            effects_jp: [
                "状態異常命中が34.9%増加する。ペルソナスキルで敵にデバフ効果を付与すると、敵のデバフ効果が15個以上の時、自身の状態異常命中が50%上昇し、敵が受けるダメージが6.5%上昇する。敵にデバフ効果を付与した後、2ターンの間敵全体の防御力が12%減少する。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "나락의 파동",
            name_en: "Wave of Despair",
            name_jp: "ナラロクの波",
            effect: "12.7%의 기본 확률로 적 전체를 절망 상태에 빠뜨린다. 『절망』: 정신 이상으로 행동이 불가하다. 턴마다 일정한 SP가 차감되고 몇 턴 후 사망한다.",
            effect_en: "12.7% of base chance to put all foes into [Despair] status. [Despair]: Unable to act. SP is deducted every turn and dies after a few turns.",
            effect_jp: "12.7%の基礎確率で全ての敵を『絶望』状態にする。『絶望』：行動不能。SPは毎ターン減少し、数ターン後に死亡する。",
            priority: 1,
            icon: "디버프광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 45.0%의 만능 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 45.0% ATK Allmighty dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "全ての敵に45.0% ATKの万能属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
            {name : "명중 강화", priority: 3 },
            {name : "우중충한 하늘", priority: 3 }
        ]
    },
    "멜키세덱": {
        name_en: "Melchizedek",
        name_jp: "メルキセデク",
        grade: "6",
        star: "5",
        position: "지배",
        element: "축복",
        wild_emblem_rainbow : true,
        instinct: {
            name: "인왕의 심판 III",
            name_en: "King of Righteousness Judgement III",
            name_jp: "王の裁き III",
            effects: [
                "공격력이 24.9% 증가한다.",
                "자신이 스킬 시전 시, 2턴 동안 모든 동료의 축복 중첩 수에 따라 주는 축복 대미지가 4% 증가한다 (8회 중첩 가능). 다른 축복 속성 아군은 해당 효과의 50%를 획득한다. 스킬 시전 시, 축복 중첩 수가 3중첩 이상인 괴도의 공격력이 15% 증가하며 2턴 동안 지속된다."
            ],
            effects_en: [
                "Increases ATK by 24.9%. When using a skill, increases Bless dmg by 4% for 2 turns based on the number of Bless stacks on all allies, up to 8 stacks. For allies with other Bless elements, gains 50% of the effect. When using a skill, increases ATK for allies with at least 3 stacks of Bless by 15% for 2 turns."
            ],
            effects_jp: [
                "攻撃力が24.9%上昇。スキル使用時、味方の祝福重複数に応じて2ターンの間祝福ダメージが4%増加する（8重複可能）。他の祝福属性の味方は効果の50%を獲得する。スキル使用時、祝福重複数が3重複以上の味方の攻撃力が15%増加（2ターン持続）。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "구원의 빛",
            name_en: "Light of Salvation",
            name_jp: "救いの光",
            effect: "모든 적에게 공격력 79.4%의 축복 속성 대미지를 주고, 아군 모두에게 축복 효과 2중첩을 부여한다. 본인은 축복 효과 중첩당 스킬 대미지가 5% 증가하며 최대 25% 증가한다.",
            effect_en: "Deals 79.4% ATK Bless dmg to all foes and gains 2 stacks of Bless. For every stack of Bless you have, increases skill damage by 5%, up to 25%.",
            effect_jp: "全ての敵に79.4% ATKの祝福属性ダメージを与え、味方全体に祝福重複2重複を付与する。自分は祝福重複ごとにスキルダメージが5%増加し、最大25%増加する。",
            priority: 1,
            icon: "축복광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 축복 속성 대미지를 준다.",
            effect_en: "Deals 180.0% ATK as Bless dmg to all foes.",
            effect_jp: "全ての敵に180.0% ATKの祝福属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "마하타루카 오토", priority: 0},
            {name : "마도의 재능", priority: 0},
            {name : "공격 강화", priority: 0},
            {name : "어드바이스", priority: 0},
            {name : "정교한 타격", priority: 0},
            {name : "축복 강화", priority: 0}
       ],
    },
    "미트라스": {
        name_en: "Mithras",
        name_jp: "ミトラス",
        grade: "4",
        star: "3",
        position: "방위",
        element: "핵열",
        instinct: {
            name: "태양의 비호 II",
            name_en: "Burning Sun's Blessing II",
            name_jp: "太陽の守護 II",
            effects: [
                "생명이 11.6% 증가한다.",
                "동료를 목표로 스킬 시전 후, 2턴 동안 방어력이 14.5% 증가한다. 생명이 50% 이상일 시 효과가 추가로 50% 증가한다."
            ],
            effects_en: [
                "Increases HP by 11.6%. When using a skill on allies, increases their DEF by 14.5% for 2 turns. If they are above 50% HP, increases the effect by 50%."
            ],
            effects_jp: [
                "HPが11.6%上昇。味方にスキル使用時、その味方の防御力が14.5%上昇。HPが50%を超える場合、効果がさらに50%上昇（2ターン持続）。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "마하라쿠카쟈",
            name_en: "Marakukaja",
            name_jp: "マハラクカジャ",
            effect: "모든 동료의 방어력이 16.3% 증가하고, 자신의 방어력 500마다 2.7% 추가 증가한다. 상한은 10.8%이며, 효과는 3턴 동안 지속된다.",
            effect_en: "Increase all allies DEF by 16.3% + 2.7% for every 500 DEF Wonder has to a maximum of 10.8% for 3 turns",
            effect_jp: "3ターンの間、味方全体の防御力が16.3%上昇する。自身の防御力が500ごとに、味方の防御力がさらに2.7%上昇する（最大10.8%まで）。",
            priority: 1,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            effect_en: "Grants all allies 48.6% ATK + 1471 shield for 2 turns.",
            effect_jp: "全ての味方が48.6% ATK + 1471のシールドを獲得し、2ターンの間持続する。",
            priority: 0
        },
        recommendSkill : [
             {name : "라쿠카쟈", priority: 3 },
             {name : "리벨리온", priority: 3 },
             {name : "어드바이스", priority: 3},
        ]
    },
    "산달폰": {
        name_en: "Sandalphon",
        name_jp: "サンダルフォン",
        grade: "8",
        star: "5",
        position: "방위",
        element: "만능",
        wild_emblem_rainbow : true,
        instinct: {
            name: "거대한 수호 III",
            name_en: "Higher Protection III",
            name_jp: "巨大な守護 III",
            effects: [
                "방어력이 43.6% 중가한다.",
                "산달폰이 필드 에 있을 경우 실드를 보유하고 있는 동료의 방어력이 42% 중가한다. 백업 출전 시 버프 효과를 25% 획득한다."
            ],
            effects_en: [
                "Increases DEF by 43.6%. When Sandalphon is present, increases all shielded allies' DEF by 42%, gains 25% of this effect when not present. Decreases the HP cost to 15% when using the signature skill."
            ],
            effects_jp: [
                "防御力が43.6%増加する。サンダルフォンがフィールドにいる場合、シールドを保有している味方の防御力が42%増加する。バックアップ出戦時バフ効果を25%獲得する。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "헌신의 비호",
            name_en: "Devoted Protection",
            name_jp: "献身の庇護",
            effect: "모든 동료가 공격력 25.5%+771의 실드를 획득한다. 메인 목표 동료가 임의의 실드를 보유하고 있을 때 주는 대미지가 20.4% 증가하며, 2턴 동안 지속된다.",
            effect_en: "Grants all allies 25.5% ATK + 771 shield. Increases the main target's dmg dealt when they have shield by 20.4% for 2 turns.",
            effect_jp: "全ての味方が25.5% ATK + 771のシールドを獲得する。メインターゲット味方が任意のシールドを保有している時、与えるダメージが20.4%増加し、2ターンの間持続する。",
            priority: 1,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            effect_en: "Grants all allies 48.6% ATK + 1471 shield for 2 turns.",
            effect_jp: "全ての味方が48.6% ATK + 1471のシールドを獲得し、2ターンの間持続する。",
            priority: 0
        },
        recommendSkill : [
             {name : "실드 강화", priority: 3 },
             {name : "공격 강화", priority: 2 },
             {name : "치료 촉진", priority: 1 },
        ],
        comment : "백업 출전으로 10.5%의 방어력 보너스를 부여할 수 있다.",
        comment_en: "Can provide 10.5% defense bonus through backup deployment.",
        comment_jp: "バックアップ出戦で10.5%の防御力ボーナスを付与できる。"
    },

    "이시스": {
        name_en: "Isis",
        name_jp: "イシス",
        grade: "3",
        star: "3",
        position: "구원",
        element: "전격",
        instinct: {
            name: "풍요의 앙크 I",
            name_en: "Ankh of Abundance I",
            name_jp: "豊穣のアンク I",
            effects: [
                "생명이 8.7% 증가한다.",
                "치료 효과 부여 시 목표는 다음 턴에 2턴 동안 공격력 5%의 생명을 회복한다."
            ],
            effects_en: [
                "Increases HP by 8.7%.",
                "When granting healing effects, the target recovers HP equal to 5% ATK for 2 turns starting next turn."
            ],
            effects_jp: [
                "HPが8.7%上昇。回復後の2ターンの間、対象のHPを攻撃力5%で回復。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "디아라마",
            name_en: "Diarama",
            name_jp: "ディアラマ",
            effect: "동료 1명의 생명이 공격력 35.6%+1077만큼 회복된다.",
            effect_en: "Restore HP equal to 35.6% ATK + 1077 to 1 ally.",
            effect_jp: "味方単体のHPを攻撃力の35.6%+1077回復する。",
            priority: 1,
            icon: "치료"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 생명을 회복한다.",
            effect_en: "Restore HP equal to 48.6% ATK + 1471 to all allies.",
            effect_jp: "すべての味方が攻撃力48.6%+1471の生命を回復する。",
            priority: 1
        },
        recommendSkill : [
             {name : "치료 강화", priority: 3 },
             {name : "공격 강화", priority: 1 },
             {name : "방어 강화", priority: 0 },
             {name : "대미지 면역", priority: 0 },
        ],
        comment : "공격 강화는 치료 수치에 적용된다. (영향력이 높지 않아 우선순위는 낮다)",
        comment_en: "Attack enhancement applies to healing values. (Low priority due to limited impact)",
        comment_jp: "攻撃強化は治療数値に適用される。（影響力が高くないため優先順位は低い）"
    },
    "티타니아": {
        name_en: "Titania",
        name_jp: "ティタニア",
        grade: "6",
        star: "5",
        position: "구원",
        element: "핵열",
        instinct: {
            name: "달의 요괴의 소란 III",
            name_en: "Fairy Queen's Disturbance III",
            name_jp: "妖精乱舞 III",
            effects: [
                "주는 치료 효과가 18% 증가한다.",
                "페르소나 스킬로 치료 효과 부여 후 77.5%의 기본 확률로 임의의 적 1명의 임의의 1가지 원소 이상 상태에 빠뜨리고, 방어력이 9% 감소한다. 효과는 2턴 지속된다."
            ],
            effects_en: [
                "Increases Healing Effect by 18%.",
                "After healing with a Persona skill, there is a 77.5% base chance to inflict 1 random enemy with a random Elemental Ailment and decreases their DEF by 9% for 2 turns."
            ],
            effects_jp: [
                "回復量が18%上昇。スキルで回復した後、77.5%の確率で、ランダムな敵1体を属性異常にし、防御力が9%減少する(2ターン持続)。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "격정과 진정",
            name_en: "Invigorating Caress",
            name_jp: "奮い立つ抱擁",
            effect: "모든 동료가 공격력 18.0%+544의 생명을 회복하며, 생명이 50% 미만인 동료에게 주는 치료 효과가 25% 증가한다. 또한 모든 동료가 SP 4포인트를 회복한다.",
            effect_en: "Restores 18.0% ATK + 544 HP to all allies. Increases Healing Effect by 25% to allies under 50% HP. Restores 4 SP to all allies.",
            effect_jp: "味方全体のHPを攻撃力18.0%＋544回復し、HP50%未満の味方への回復量が25%上昇する。さらに味方全体のSPを4回復する。",
            priority: 2,
            icon: "치료광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 생명을 회복한다.",
            effect_en: "Restore HP equal to 48.6% ATK + 1471 HP to all allies.",
            effect_jp: "すべての味方が攻撃力48.6%+1471の生命を回復する。",
            priority: 1
        },
        recommendSkill : [
            {name : "치료 강화", priority: 3 },
            {name : "공격 강화", priority: 1 },
            {name : "방어 강화", priority: 0 },
            {name : "대미지 면역", priority: 0 },
        ],
        comment : "공격 강화는 치료 수치에 적용된다. (영향력이 높지 않아 우선순위는 낮다)",
        comment_en: "Attack enhancement applies to healing values. (Low priority due to limited impact)",
        comment_jp: "攻撃強化は治療数値に適用される。（影響力が高くないため優先順位は低い）"
    },
    "파르바티": {
        name_en: "Parvati",
        name_jp: "パールヴァティ",
        grade: "6",
        star: "4",
        position: "구원",
        element: "염동",
        instinct: {
            name: "지모신의 비호 III",
            name_en: "Mother Earth's Protection III",
            name_jp: "地母神の庇護 III",
            effects: [
                "생명이 21.2% 증가한다.",
                "치료 효과를 준 후, 1턴 동안 치료 효과를 입은 동료의 공격력이 16%, 방어력이 10.5% 증가한다."
            ],
            effects_en: [
                "Increases HP by 21.2%.",
                "After using Healing skills, increases the healed allies' ATK by 16% and DEF by 10.5% for 1 turn."
            ],
            effects_jp: [
                "HPが21.2%上昇。回復した後、対象の攻撃力が16%上昇し、防御力が10.5%上昇(1ターン持続)。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "디아라마",
            name_en: "Diarama",
            name_jp: "ディアラマ",
            effect: "동료 1명이 공격력 35.6%+1077의 생명을 회복한다.",
            effect_en: "Restore HP equal to 35.6% ATK + 1077 to 1 ally.",
            effect_jp: "味方単体のHPを攻撃力の35.6%+1077回復する。",
            priority: 0,
            icon: "치료"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 생명을 회복한다.",
            effect_en: "Restore HP equal to 48.6% ATK + 1471 HP to all allies.",
            effect_jp: "すべての味方が攻撃力48.6%+1471の生命を回復する。",
            priority: 1
        },
        recommendSkill : [
            {name : "치료 강화", priority: 3 },
            {name : "공격 강화", priority: 1 },
            {name : "방어 강화", priority: 0 },
            {name : "대미지 면역", priority: 0 },
        ],
        comment : "하이라이트를 통한 치료에도 본능 효과가 발동된다. 공격 강화는 치료 수치에 적용된다. (영향력이 높지 않아 우선순위는 낮다)",
        comment_en: "Core passive effect also triggers on healing through highlights. Attack enhancement applies to healing values. (Low priority due to limited impact)",
        comment_jp: "ハイライトによる治療にも本能効果が発動する。攻撃強化は治療数値に適用される。（影響力が高くないため優先順位は低い）"
    },
    "지크프리트": {
        name_en: "Siegfried",
        name_jp: "ジークフリート",
        grade: "7",
        star: "5",
        position: "지배",
        element: "물리",
        wild_emblem_rainbow : true,
        event: true,
        instinct: {
            name: "용사의 살의 III",
            name_en: "Fearless Hero III",
            name_jp: "勇者の殺意 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "전투 시작 시 『용혈』을 획득한다. 자신이 물리 속성 스킬 시전 시 3턴 동안 공격력이 10% 증가한다.",
                "고유 스킬 사용 시 『용혈』 상태를 강화하며, 물리 속성 스킬을 시전하면 대미지가 28%, 크리티컬 효과가 28% 추가로 증가한다."
            ],
            effects_en: [
                "Increases ATK by 29.1%.",
                "At the start of battle, gains Dragon Blood: When using Phys skills, increases ATK by 10% for 3 turns.",
                "When using the main skill, boosts the effect of Dragon Blood, additionally increases damage by 28% and CRIT DMG by 28% when using Phys skills."
            ],
            effects_jp: [
                "攻撃力が29.1%増加する。",
                "戦闘開始時『竜血』を獲得する。自分が物理属性スキル使用時3ターンの間攻撃力が10%増加する。",
                "固有スキル使用時『竜血』状態を強化し、物理属性スキルを使用すればダメージが28%、CRT倍率が28%追加で増加する。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "용을 베는 자태",
            name_en: "Dragon Slayer",
            name_jp: "竜を斬る姿態",
            effect: "모든 적에게 공격력 95.0%의 물리 속성 대미지를 준다. 만약 자신이 「용혈」 상태를 보유하지 않은 경우 자신에게 「용혈」을 부여한다. 만약 자신이 「용혈」 상태이면,「용혈」 상태를 강화하고 지속 시간을 갱신한다.",
            effect_en: "Deals 95.0% ATK Phys dmg to all enemies. If you don't have Dragon Blood, gain Dragon Blood. If you have Dragon Blood, boost Dragon Blood and refresh its duration.",
            effect_jp: "すべての敵に攻撃力95.0%の物理属性ダメージを与える。もし自分が「竜血」状態を保有していない場合、自分に「竜血」を付与する。もし自分が「竜血」状態なら、「竜血」状態を強化し持続時間を更新する。",
            priority: 0,
            icon: "물리광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 물리 속성 대미지를 준다.",
            effect_en: "Deals 180.0% ATK as Phys dmg to all foes.",
            effect_jp: "すべての敵に攻撃力180.0%の物理属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
             {name : "", priority: 0 }
        ],
        comment : "파티에만 지니고 있어도 전투 시작 시 『용혈』을 획득한다",
        comment_en: "Gains Dragon Blood at the start of battle just by being in the party",
        comment_jp: "パーティーに持っているだけでも戦闘開始時『竜血』を獲得する"

    },
    "쿠시나다히메": {
        name_en: "Kushinada-Hime",
        name_jp: "クシナダヒメ",
        grade: "5",
        star: "4",
        position: "구원",
        element: "빙결",
        instinct: {
            name: "다정한 보살핌 II",
            name_en: "Intimate Care II",
            name_jp: "慈愛のささやき II",
            effects: [
                "효과 명중이 21.2% 증가한다.",
                "버프 스킬을 1개 시전할 때마다 모든 괴도의 공격력이 8.5% 영구 증가한다. 최대 3회 중첩된다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 21.2%. After using a buff skill, permanently increases all allies' ATK by 8.5%, up to 3 stacks."
            ],
            effects_jp: [
                "状態異常命中が21.2%上昇。バフスキルを1つ使用するごとに、味方全体の攻撃力が8.5%上昇（最大3回まで）。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "마하타루카쟈",
            name_en: "Matarukaja",
            name_jp: "マハタルカジャ",
            effect: "모든 동료의 공격력이 10.9% 증가하고, 자신의 공격력 500포인트마다 0.9% 추가 증가한다. 상한은 7.2%이며, 효과는 3턴 동안 지속된다.",
            effect_en: "Increase all allies' ATK by 10.9% + 0.9% for every 500 ATK Wonder has to a maximum of 7.2% for 3 turns.",
            effect_jp: "3ターンの間、味方全体の攻撃力が10.9%上昇する。自身の攻撃力500ごとに、味方の攻撃力がさらに0.9%上昇する（最大7.2%まで）。",
            priority: 0,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            effect_en: "Increases all allies dmg dealt by 29.5% for 2 turns.",
            effect_jp: "すべての味方の与えるダメージが29.5%増加し2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
             {name : "리벨리온", priority: 2},
             {name : "타루카쟈", priority: 2},
             {name : "마하타루카 오토", priority: 1},
        ],
        comment: "필드에 존재하지 않으면 영구 공격력 버프는 사라진다.",
        comment_en: "If not present on the field, the permanent ATK buff will disappear.",
        comment_jp: "フィールドに存在しなければ、永続的な攻撃力バフは消滅する。"
    },
    "아프사라스": {
        name_en: "Apsaras",
        name_jp: "アプサラス",
        grade: "2",
        star: "2",
        position: "우월",
        element: "빙결",
        instinct: {
            name: "감미로운 노랫소리 I",
            name_en: "Gentle Chant I",
            name_jp: "慈愛のささやき I",
            effects: [
                "방어력이 8.7% 중가한다. 동료를 목표로 스킬 시전 시 2턴 동안 동료의 방어력이 15.4% 증가한다."
            ],
            effects_en: [
                "Increases DEF by 8.7%. When using a skill on allies, increases their DEF by 15.4% for 2 turns."
            ],
            effects_jp: [
                "防御力が8.7%上昇。味方にスキルを使用後、その味方の防御力を15.4%上昇（2ターン持続）。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "리벨리온",
            name_en: "Rebellion",
            name_jp: "リベリオン",
            effect: "동료 1명의 크리티컬 확률이 9.3% 증가하고, 자신의 크리티컬 확률 10%마다 1.6% 추가 증가한다. 상한은 6.4%이며, 효과는 3턴 동안 지속된다.",
            effect_en: "Increase 1 ally's CRIT by 9.3% + 1.6% for every 10% CRIT Wonder has, up to 6.4% for 3 turns.",
            effect_jp: "3ターンの間、味方単体のクリティカル率が9.3%上昇する。自身のクリティカル率が10%ごとに、味方のクリティカル率がさらに1.6%上昇する（最大6.4%まで）。",
            priority: 1,
            icon: "버프"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            effect_en: "Increases all allies dmg dealt by 29.5% for 2 turns.",
            effect_jp: "すべての味方の与えるダメージが29.5%増加し2ターンの間持続する。",
            priority: 0
        },
        recommendSkill : [
             {name : "마하라쿠카 오토", priority: 2},
             {name : "어드바이스", priority: 2},
             {name : "민첩의 마음가짐", priority: 1},
        ]
    },
    "킹프로스트": {
        name_en: "King Frost",
        name_jp: "キングフロスト",
        grade: "7",
        star: "5",
        position: "방위",
        element: "빙결",
        wild_emblem_rainbow : true,
        instinct: {
            name: "얼음의 심판 III",
            name_en: "Frozen Adjudication III",
            name_jp: "氷雪の裁き III",
            effects: [
                "방어력이 37.4% 증가한다.",
                "동료에게 실드를 부여할 때 메인 목표는 방어력 25% 증가와 빙결 대미지 15% 증가 두 가지 효과를 획득하며 2턴 동안 지속된다."
            ],
            effects_en: [
                "Increases DEF by 37.4%.",
                "After giving Shield to allies, increases the main target's DEF by 25% and Ice dmg bonus by 15% for 2 turns."
            ],
            effects_jp: [
                "防御力が37.4％上昇。シールドを付与した対象に防御力25％上昇、氷結属性与ダメージ15％上昇を付与（2ターン持続）。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "눈의 여왕의 비호",
            name_en: "Snow Aegis",
            name_jp: "雪王の加護",
            effect: "모든 동료가 공격력 22.8%+690의 실드를 획득하며, 실드 기간 동안 방어력이 30% 증가한다. 효과는 2턴 동안 지속된다.",
            effect_en: "Grants all allies 22.8% ATK + 690 shield for 2 turns. When the Shield is active increases DEF by 30%.",
            effect_jp: "2ターンの間、味方全体に攻撃力22.8％+690のシールドを付与する。シールドが存在する間、防御力が30％上昇する。",
            priority: 1,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            effect_en: "Grants all allies 48.6% ATK + 1471 shield for 2 turns.",
            effect_jp: "すべての味方が攻撃力48.6%+1471のシールドを獲得し2ターンの間持続する。",
            priority: 0
        },
        recommendSkill : [
             {name : "마하라쿠카 오토", priority: 2},
             {name : "실드 강화", priority: 2},
             {name : "민첩의 마음가짐", priority: 1},
        ]
    },
    "릴리스": {
        name_en: "Lilith",
        name_jp: "リリス",
        grade: "7",
        star: "5",
        position: "지배",
        element: "만능",
        wild_emblem_rainbow : true,
        instinct: {
            name: "한밤의 유혹 III",
            name_en: "Midnight Seduction III",
            name_jp: "真夜中の誘惑 III",
            effects: [
                "공격력이 29.1% 중가한다.",
                "빙결, 질풍 또는 주원 속성의 스킬을 사용하면 2턴 동안 자신의 해당 속성 대미지가 30% 중가하고, 대미지가 10% 감면된다.",
                "릴리스가 빙결, 질풍 또는 주원 속성의 스킬을 사용하면 고유 스킬이 진화하여 같은 속성의 대미지를 추가하고, 이번 스킬 대미지가 대폭 증가 및 임시 관통 보너스를 15% 획득한다."
            ],
            effects_en: [
                "Increases ATK by 29.1%.",
                "When using Ice, Wind, or Curse skill, increases that Elemental dmg by 30% and dmg resistance by 10% for 2 turns.",
                "When Lilith uses Ice, Wind, or Curse skill, evolves the signature skill, makes it deal 1 hit of that element's damage, heavily increases skill damage and gains 15% PEN."
            ],
            effects_jp: [
                "攻撃力が29.1%増加する。",
                "氷結、疾風または呪怨属性のスキルを使用すれば2ターンの間自分の該当属性ダメージが30%増加し、ダメージが10%軽減される。",
                "リリスが氷結、疾風または呪怨属性のスキルを使用すれば固有スキルが進化して同じ属性のダメージを追加し、今回のスキルダメージが大幅増加及び一時貫通ボーナスを15%獲得する。"
            ],
            priority: 0
        },
        uniqueSkill: {
            name: "살육 유도",
            name_en: "Carnage Allure",
            name_jp: "殺戮誘導",
            effect: "모든 적에게 공격력 25.0%의 만능 대미지를 주고, 그 후 공격력 37.5%의 주원 대미지를 준다. 스킬이 「얼음」「폭풍」「저주」형태로 진화 가능: 모든 적에게 공격력 25.0%의 만능 대미지를 주고, 그 후 공격력 101.0%의 (빙결, 질풍 또는 주원) 대미지를 준다.",
            effect_en: "Deals 25.0% ATK Almighty dmg to all foes, then deals 37.5% ATK Curse dmg. Skill can evolves into [Ice] [Wind] [Curse] form: Deals 25.0% ATK Almighty dmg, then deals 101.0% ATK (Ice, Wind, Curse) dmg.",
            effect_jp: "すべての敵に攻撃力25.0%の万能ダメージを与え、その後攻撃力37.5%の呪怨ダメージを与える。スキルが「氷」「嵐」「呪い」形態に進化可能：すべての敵に攻撃力25.0%の万能ダメージを与え、その後攻撃力101.0%の（氷結、疾風または呪怨）ダメージを与える。",
            priority: 0,
            icon: "만능광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 만능 속성 대미지를 준다.",
            effect_en: "Deals 90.0% ATK as Almighty dmg to all foes.",
            effect_jp: "すべての敵に攻撃力90.0%の万能属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "마하타루카 오토", priority: 2},
            {name : "민첩의 마음가짐", priority: 1},
        ],
        comment : "원더 무기 메커니컬 심판자 등 만능 대미지 증가 목적 외 채용되지 않는다.",
        comment_en: "Rarely used except for increasing Almighty damage with Wonder weapons like Mechanical Arbiter.",
        comment_jp: "ワンダー武器メカニカル・アービター等の万能ダメージ増加目的以外では採用されない。"
    },
    "아누비스": {
        name_en: "Anubis",
        name_jp: "アヌビス",
        grade: "4",
        star: "5",
        position: "반항",
        element: "주원",
        instinct: {
            name: "죽음의 심판관 III",
            name_en: "Judge of Souls III",
            name_jp: "ソウルジャッジ III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "축복 효과를 줄 경우 자신은 축복 효과 2개를 획득하고, 50%의 고정 확률로 스킬의 메인 목표는 주원 효과 1개를 획득한다.",
                "주원 대미지를 줄 경우 스킬의 메인 목표가 주원 효과 2개를 획득하고, 50%의 고정 확률로 자신은 축복 효과 1개를 획득한다.",
                "주원 효과가 있는 적을 공격하면 공격력이 27% 증가한다."
            ],
            effects_en: [
                "Increases ATK by 29.1%.",
                "When dealing Bless damage, gains 2 stacks of Bless and there is a 50% fixed chance to inflict 1 stack of Curse to the main target.",
                "When dealing Curse damage the main target gains 2 stacks of Curse and there is a 50% fixed chance for you to gain 1 stack of Bless.",
                "Increases ATK by 27% when attacking enemies with Curse."
            ],
            effects_jp: [
                "攻撃力が29.1%上昇。祝福属性ダメージ時、自身に祝印を2つ獲得。呪怨属性ダメージ時、選択した対象に呪印2つ付与。呪印の敵を攻撃時、攻撃力が27%上昇。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "왕생의 심판",
            name_en: "Afterlife Judgement",
            name_jp: "冥府の審判",
            effect: "1명의 적에게 공격력 165.0%의 주원 속성 대미지를 주고, 스킬 시전 시 자신이 가진 축복 효과 또는 목표가 가진 주원 효과에 따라 해당 스킬이 주는 대미지가 10% 증가하며 최대 4회까지 중첩된다.",
            effect_en: "Deals 165.0% ATK Curse dmg to 1 foe. When using this skill, each stack of Bless on you or each stack of Curse on the target increases DMG Dealt by 10%, up to 4 stacks.",
            effect_jp: "敵単体に攻撃力165.0%の呪怨属性ダメージを与える。スキルを使用する時、自身の祝印、または対象の呪印1つ毎に、このスキルの与ダメージが10%上昇する。この効果は最大4つまで累積できる。",
            priority: 0,
            icon: "주원"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 주원 속성 대미지를 준다.",
            effect_en: "Deal 360% ATK as Curse dmg to 1 foe.",
            effect_jp: "1体の敵に攻撃力360.0%の呪怨属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
             {name : "악마의 심판", priority: 3 },
             {name : "만능 강화", priority: 3 },
             {name : "마도의 재능", priority: 3 },
        ],
        comment : "주원 상태이상 대미지는 만능 대미지에 영향을 받는다.",
        comment_en: "Curse damage is affected by Almighty damage.",
        comment_jp: "呪怨ダメージは万能ダメージに影響を受ける。"
    },
    "파즈스": {
        name_en: "Pazuzu",
        name_jp: "パズス",
        grade: "5",
        star: "4",
        position: "지배",
        element: "주원",
        instinct: {
            name: "영겁의 저주 II",
            name_en: "Eternal Curse II",
            name_jp: "永劫の呪い II",
            effects: [
                "공격력이 17.7% 증가한다.",
                "페르소나 스킬로 적을 공격하는 경우 60%의 고정 확률로 메인 목표인 적이 주원 효과를 1중첩 획득한다. 또한 주원 대미지를 1회 결산한다."
            ],
            effects_en: [
                "Increases ATK by 17.7%.",
                "After attacking foes with a Persona skill, there is a 60% fixed chance to inflict 1 stack of Curse on the main target. Immediately triggers all of the main target's Curse stacks."
            ],
            effects_jp: [
                "攻撃力が17.7%上昇。スキルで敵を攻撃した後、60%の確率で選択した対象に呪印を1つ付与。呪印ダメージを即時発生。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "마하에이가온",
            name_en: "Maeiga",
            name_jp: "マハエイガオン",
            effect: "모든 적에게 공격력 66.5%의 주원 속성 대미지를 주고, 일정 확률로 적이 주원 효과 1개를 획득한다.",
            effect_en: "Deals 66.5% ATK Curse dmg to all foes and has a chance to inflict 1 stack of Curse.",
            effect_jp: "敵全体に攻撃力66.5%の呪怨属性ダメージを与える。一定の確率で敵に1つの呪印を付与する。",
            priority: 0,
            icon: "주원광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 주원 속성 대미지를 준다.",
            effect_en: "Deals 180.0% ATK as Curse dmg to all foes.",
            effect_jp: "すべての敵に攻撃力180.0%の呪怨属性ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "악마의 심판", priority: 3 },
            {name : "만능 강화", priority: 3 },
            {name : "마도의 재능", priority: 3 },
            {name : "아기다인", priority: 3 },
            {name : "화상률 UP", priority: 2},
            {name : "명중 강화", priority: 2},
            {name : "우중충한 하늘", priority: 2},
        ],
        comment : "아기다인을 통한 화상 효과 + 본능에 의한 주원 대미지 결산 형태로 운영된다. 주원 효과 대미지는 만능 대미지에 영향을 받는다.",
        comment_en: "Operated with burn effects through Agidyne + Curse damage settlement through core passive. Curse effect damage is affected by Almighty damage.",
        comment_jp: "アギダインによる火傷効果＋本能による呪怨ダメージ決算形態で運営される。呪怨効果ダメージは万能ダメージの影響を受ける。"
    },
    "벨페고르": {
        name_en: "Belphegor",
        name_jp: "ベルフェゴール",
        grade: "4",
        star: "4",
        position: "굴복",
        element: "빙결",
        instinct: {
            name: "한파의 나태함 II",
            name_en: "Cold Wave of Sloth II",
            name_jp: "怠惰への寒波 II",
            effects: [
                "효과저항이 17% 증가한다.",
                "적을 목표로 페르소나 스킬을 시전한 후 2턴 동안 스킬 메인 목표가 받는 빙결 속성 대미지가 14.4%증가한다. 생명이 50%미만일 시 효과가 추가로 40% 증가한다."
            ],
            effects_en: [
                "Increases Effect RES by 17%.",
                "After using a Persona skill on enemies, increases the main target's Ice dmg taken by 14.4% for 2 turns. If they are under 50% HP, additionally increases effect by 40%."
            ],
            effects_jp: [
                "状態異常抵抗が17％上昇。敵にスキルを使用時、選択した対象の被氷結属性ダメージが14.4%上昇（2ターン持続）。対象のHPが50%未満の時、効果がさらに40%上昇。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "라쿤다",
            name_en: "Rakunda",
            name_jp: "ラクンダ",
            effect: "3턴 동안 적 1명의 방어력이 38.8% 감소한다.",
            effect_en: "Decrease DEF of 1 enemy by 38.8% for 3 turns.",
            effect_jp: "3ターンの間、敵単体の防御力が38.8%低下する。",
            priority: 1,
            icon: "디버프"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 빙결 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK Ice dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "すべての敵に攻撃力90.0%の氷結属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
            {name : "다이아의 별", priority: 3 },
            {name : "공격 강화", priority: 0 },
            {name : "어드바이스", priority: 0 },
            {name : "정교한 타격", priority: 0 },
            {name : "마도의 재능", priority: 0 },
            {name : "빙결 강화", priority: 0}
        ]
    },
    "야타가라스": {
        name_en: "Yatagarasu",
        name_jp: "ヤタガラス",
        grade: "6",
        star: "3",
        position: "지배",
        element: "화염",
        instinct: {
            name: "태양의 분노 III",
            name_en: "Sun's Wrath III",
            name_jp: "太陽神の使い III",
            effects: [
                "공격력이 17.5% 증가한다.",
                "자신에게 디버프 효과가 없을 시 공격력이 30% 증가하고, 주는 화염 속성 대미지가 16.5% 증가한다."
            ],
            effects_en: [
                "Increases ATK by 17.5%.",
                "When you don't have any debuffs, increases ATK by 30% and Fire dmg dealt by 16.5%."
            ],
            effects_jp: [
                "攻撃力が17.5%上昇。自身が弱体中でない場合、攻撃力が30%上昇し、火炎属性ダメージが16.5%上昇"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "마하라기다인",
            name_en: "Maragion",
            name_jp: "マハラギダイン",
            effect: "모든 적에게 공격력 60.8%의 화염 속성 대미지를 주고, 33.8%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
            effect_en: "Deals 60.8% ATK Fire dmg to all foes and has a 33.8% chance of inflicting Burn for 2 turns.",
            effect_jp: "敵全体に攻撃力60.8%の火炎属性ダメージを与える。33.8%の確率で敵を2ターンの間、炎上状態にする。",
            priority: 0,
            icon: "화염광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 화염 속성 대미지를 준다.",
            effect_en: "Deals 180.0% ATK as Fire dmg to all foes.",
            effect_jp: "すべての敵に攻撃力180.0%の火炎属性ダメージを与える。",
            priority: 1
        },
        recommendSkill : [
            {name : "공격 강화", priority: 0 },
            {name : "어드바이스", priority: 0 },
            {name : "정교한 타격", priority: 0 },
            {name : "마도의 재능", priority: 0 },
            {name : "화염 강화", priority: 0}
        ],
        comment : "원더를 통한 화염 대미지를 부여할 때 채용한다.",
        comment_en: "Adopted when granting Fire damage through Wonder.",
        comment_jp: "ワンダーによる火炎ダメージを付与する時に採用する。"
    },
    "기리메칼라": {
        name_en: "Girimehkala",
        name_jp: "ギリメカラ",
        grade: "5",
        star: "3",
        position: "방위",
        element: "물리",
        instinct: {
            name: "코끼리의 응시 II",
            name_en: "Elephant's Gaze II",
            name_jp: "魔象の邪眼 II",
            effects: [
                "효과저항이 17.4% 증가한다.",
                "모든 동료가 디버프 효과를 가진 적에게 받는 대미지가 20% 감소한다."
            ],
            effects_en: [
                "Increases Effect Resistance by 17.4%.",
                "All allies take 20% less damage from enemies with any debuffs."
            ],
            effects_jp: [
                "効果抵抗が17.4%上昇。デバフ効果を持つ敵から受けるダメージが20%減少。"
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "마하타쿤다",
            name_en: "Matarunda",
            name_jp: "マハタルンダ",
            effect: "3턴 동안 모든 적의 공격력이 18.1% 감소한다.",
            effect_en: "Decreases ATK of all foes by 18.1% for 3 turns.",
            effect_jp: "3ターンの間、敵全体の攻撃力を18.1%低下させる。",
            priority: 0,
            icon: "디버프광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            effect_en: "Grants all allies 48.6% ATK + 1471 shield for 2 turns.",
            effect_jp: "すべての味方が攻撃力48.6%+1471のシールドを獲得し2ターンの間持続する。",
            priority: 0
        },
        recommendSkill : [
        ],
        comment : "받는 대미지 감소 효과가 필요할 때 채용한다.",
        comment_en: "Adopted when damage reduction effects are needed.",
        comment_jp: "受けるダメージ減少効果が必要な時に採用する。"
    },
    "쿠 훌린": {
        name_en: "Cu Chulainn",
        name_jp: "クー・フーリン",
        grade: "7",
        star: "5",
        position: "반항",
        element: "물리",
        wild_emblem_rainbow : true,
        event: true,
        instinct: {
            name: "포효하는 맹견 III",
            name_en: "Roaring Hound III",
            name_jp: "咆哮する猛犬 III",
            effects: [
                "크리티컬 확률이 17.5% 중가한다.",
                "크리티컬 시 적에게 「치명덫」을 추가하고, 다음 고유 스킬 공격으로 표식을 폭발시켜 스킬 대미지가 공격력의 87%만큼 추가 증가한다. 표식 폭발 시 낮은 확률로 즉사 효과가 발동된다."
            ],
            effects_en: [
                "Increases CRIT Rate by 17.5%.",
                "Inflicts [Mortal Barb] when dealing Critical, detonates this the next time you use the signature skill, additionally increases skill damage by 87% ATK. When detonating, there is a low chance of insta-kill."
            ],
            effects_jp: [
                "CRT発生率が17.5%増加する。",
                "クリティカル時敵に「致命の罠」を追加し、次の固有スキル攻撃で標識を爆発させてスキルダメージが攻撃力の87%分追加増加する。標識爆発時低い確率で即死効果が発動される。"
            ],
            priority: 0
        },
        uniqueSkill: {
            name: "가시창",
            name_en: "Gae Bulg",
            name_jp: "ゲイボルク",
            effect: "공격력 174.0%의 물리 대미지를 1단계 주며, 공격을 받은 적에게 디버프가 1중첩 있을 때마다 해당 스킬 크리티컬 확률이 4% 증가한다. 크리티컬 버프는 최대 20%까지 획득한다.",
            effect_en: "Deals 174.0% ATK Phys dmg to 1 foe, increases CRIT Rate by 4% for every stack of debuffs the foe has, up to 20% Crit Rate Bonus.",
            effect_jp: "攻撃力174.0%の物理ダメージを1段階与え、攻撃を受けた敵にデバフが1重複ある度に該当スキルCRT発生率が4%増加する。クリティカルバフは最大20%まで獲得する。",
            priority: 0,
            icon: "물리"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 물리 대미지를 준다.",
            effect_en: "Deal 360% ATK as Phys dmg to 1 foe.",
            effect_jp: "1体の敵に攻撃力360.0%の物理ダメージを与える。",
            priority: 0
        },
        recommendSkill : [
            {name : "공격 강화", priority: 0 },
            {name : "어드바이스", priority: 0 },
            {name : "정교한 타격", priority: 0 },
            {name : "마도의 재능", priority: 0 },
            {name : "물리 강화", priority: 0 },
        ]
    },
    "오로바스": {
        name_en: "Orobas",
        name_jp: "オロバス",
        grade: "1",
        star: "2",
        position: "굴복",
        element: "화염",
        instinct: {
            name: "열광적인 점쟁이 I",
            name_en: "Fanatic Diviner I",
            name_jp: "熱狂の占い師 I",
            effects: [
                "효과 명중이 7% 증가한다.",
                "적에게 스킬 시전 시 2턴 동안 적이 받는 화염 속성 대미지가 8.2% 증가한다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 7%.",
                "When an enemy uses a skill, increases the main target's Fire dmg taken by 8.2% for 2 turns."
            ],
            effects_jp: [
                "状態異常命中が7%上昇。敵がスキルを使用する時、選択した対象の火炎属性ダメージが8.2%上昇（2ターン持続）。"
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "화염 내성 제거",
            name_en: "Fire Break",
            name_jp: "火炎耐性解除",
            effect: "2턴 동안 적 1명의 화염 내성을 제거한다.",
            effect_en: "Suppress innate Fire resistances of 1 foe for 2 turns.",
            effect_jp: "1体の敵の火炎耐性を2ターンの間解除する。",
            priority: 3,
            icon: "디버프"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 화염 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.    ",
            effect_en: "Deals 90.0% ATK as Fire dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "すべての敵に攻撃力90.0%の火炎属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
        ],
        comment : "화염 내성 제거 효과가 필요할 때 채용한다.",
        comment_en: "Adopted when Fire Resistance Removal effects are needed.",
        comment_jp: "火炎耐性解除効果が必要な時に採用する。"
    },
    "자타유": {
        name_en: "Jatayu",
        name_jp: "ジャターユ",
        grade: "4",
        star: "3",
        position: "굴복",
        element: "질풍",
        instinct: {
            name: "파공의 금빛 날개 II",
            name_en: "Soaring Golden Wings II",
            name_jp: "風神の金翼 II",
            effects: [
                "효과 명중이 14% 증가한다.",
                "질풍 속성 페르소나 스킬 시전 후 2턴 동안 스킬 목표의 방어력이 20% 감소한다."
            ],
            effects_en: [
                "Increases Ailment Accuracy by 14%.",
                "After using a Wind-type Persona skill, decreases the main target's DEF by 20% for 2 turns."
            ],
            effects_jp: [
                "状態異常命中が14%上昇。風属性スキルを使用した後、選択した対象の防御力が20%低下（2ターン持続）。"
            ],
            priority: 0
        },
        uniqueSkill: { 
            name: "질풍 내성 제거",
            name_en: "Wind Break",
            name_jp: "風属性耐性解除",
            effect: "2턴 동안 적 1명의 질풍 내성을 제거한다.",
            effect_en: "Suppress innate Wind resistances of 1 foe for 2 turns.",
            effect_jp: "1体の敵の風属性耐性を2ターンの間解除する。",
            priority: 3,
            icon: "디버프"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 질풍 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            effect_en: "Deals 90.0% ATK as Wind dmg to all foes and increase their dmg taken by 19.6% for 2 turns.",
            effect_jp: "すべての敵に攻撃力90.0%の風属性ダメージを与え、敵が受けるダメージが19.6%増加する。効果は2ターンの間持続する。",
            priority: 1
        },
        recommendSkill : [
        ],
        comment : "질풍 내성 제거 효과가 필요할 때 채용한다.",
        comment_en: "Adopted when Wind Resistance Removal effects are needed.",
        comment_jp: "風属性耐性解除効果が必要な時に採用する。"
    },
    "아라하바키": {
        name_en: "Arahabaki",
        name_jp: "アラハバキ",
        grade: "5",
        star: "4",
        position: "방위",
        element: "물리",
        instinct: {
            name: "철로 만든 몸 II",
            name_en: "Iron Body II",
            name_jp: "鉄製の身体 II",
            effects: [
                "방어력이 21.2% 증가한다.",
                "모든 동료가 받는 약점 대미지가 23% 감소한다."
            ],
            effects_en: [
                "Increases DEF by 21.2%.",
                "All allies take 23% less damage from Weakness dmg."
            ],
            effects_jp: [
                "防御力が21.2%上昇。味方全体の弱点被ダメージが18%低下。"
            ],
            priority: 0
        },
        uniqueSkill: {
            name: "타룬다",
            name_en: "Tarnada",
            name_jp: "タルナダ",
            effect: "3턴 동안 적 1명의 공격력이 25.8% 감소한다.",
            effect_en: "Decreases ATK of 1 foe by 25.8% for 3 turns.",
            effect_jp: "3ターンの間、敵単体の攻撃力が25.8%低下させる。",
            priority: 0,
            icon: "디버프"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            effect_en: "Grants all allies 48.6% ATK + 1471 shield for 2 turns.",
            effect_jp: "すべての味方が攻撃力48.6%+1471のシールドを獲得し2ターンの間持続する。",
            priority: 0
        },
        recommendSkill : [
            {name : "방어 강화", priority: 0 },
            {name : "방어의 마음가짐", priority: 0 },
            {name : "치료 촉진", priority: 0 },
            {name : "대미지 면역", priority: 0 },
        ],
        comment : "받는 대미지 감소 효과가 필요할 때 채용한다.",
        comment_en: "Adopted when damage reduction effects are needed.",
        comment_jp: "受けるダメージ減少効果が必要な時に採用する。"
    }
};
