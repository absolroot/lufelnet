const personaData = {
    "야노식": {
        grade: "8",
        star: "5",
        position: "반항",
        element: "총격",
        instinct: {
            name: "잔당의 수확 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "전투 중 1회, 야노식으로 턴을 종료할 때 임의의 적 1명이 『조준』을 획득합니다. 모든 동료가 『조준』을 보유한 적 공격 시 공격력이 20% 증가한다.",
                "『조준』을 보유한 적의 방어력이 12% 추가 감소한다. 자신이 『조준』을 가진 적 공격시 공격력 18%의 총격 속성 대미지를 1회 준다.",
                "『조준』 : 2턴 동안 적의 방어력이 29.6% 감소한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "궁지 반격",
            effect: "1명의 적에게 공격력 203.3%의 총격 속성 대미지를 주고, 75%의 고정 확률로 적이 『조준』을 획득한다. 『조준』: 2턴 동안 적의 방어력이 29.6% 감소한다.",
            priority: 0,
            icon: "총격"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 총격 속성 대미지를 준다.",
            priority: 0
        },
        recommendSkill : [
            {name : "라쿤다", priority: 3},
            {name : "리벨리온", priority: 3},
            {name : "어드바이스", priority: 3},
            {name : "타루카쟈", priority: 2},
            {name : "대미지 면역", priority: 0},
            {name : "방어 강화", priority: 0},
       ],
        comment : "선봉으로 사용하지 않고 교체 후 페르소나 스킬 사용 시 '전투 시작 시 『조준』 획득' 이 발동 돼 『조준』이 적용된다 (최초 1회). 버프도 동일하게 『조준』이 발동된다."
    },
    "비슈누": {
        grade: "8",
        star: "5",
        position: "반항",
        element: "질풍",
        instinct: {
            name: "중생에 내리는 은혜 III",
            effects: [
                "크리티컬 확률이 17.5% 증가한다.",
                "풍습의 효과 명중이 20% 증가하고, 풍습 상태인 적에게 주는 대미지가 20% 증가한다.",
                "풍습 상태를 추가하거나 초기화될 때 적의 방어력이 48% 추가 감소하며 2턴 동안 지속된다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "적을 멸하는 바람",
            effect: "1명의 적에게 공격력 192.0%의 질풍 속성 대미지를 주고, 75%의 기본 확률로 적을 풍습 상태에 빠뜨린다. 적이 풍습 상태인 경우 지속 시간을 초기화하고, 이번 스킬이 주는 대미지가 27.0% 증가하며 적이 받는 질풍 대미지가 27.0% 심화된다. 효과는 2턴 동안 지속된다.",
            priority: 3,
            icon: "질풍"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 질풍 속성 대미지를 준다.",
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
        comment : "마하갈다인을 통해 풍습 부여 시 광역 방어력 감소 효과를 적용할 수 있다."
    },
    "디오니소스": {
        grade: "7",
        star: "4",
        position: "우월",
        element: "염동",
        instinct: {
            name: "술취한 카니발 III",
            effects: [
                "크리티컬 확률이 14.8% 증가한다.",
                "동료를 목표로 스킬 시전 시, 2턴 동안 스킬의 메인 목표의 크리티컬 효과가 30% 증가한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "레볼루션",
            effect: "모든 동료의 크리티컬 확률이 6.5% 증가하고, 자신의 크리티컬 확률 10%마다 추가로 1.1%가 증가한다. 상한은 4.4%이며, 효과는 3턴 동안 지속된다.",
            priority: 2,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            priority: 1
        },
        recommendSkill : [
             {name : "무한 알고리즘", priority: 3},
             {name : "리벨리온", priority: 3},
             {name : "타루카쟈", priority: 3},
             {name : "라쿠카쟈", priority: 2},
             {name : "메디아라한", priority: 1},
             {name : "치료 강화", priority: 1},
             {name : "대미지 면역", priority: 0},
             {name : "방어 강화", priority: 0},
        ],
        comment : "메디아라한을 통한 치료에도 본능 크리티컬 효과 30% 증가가 적용된다. 무한 알고리즘은 과금 이벤트를 통해 배포된 스킬 카드."
    },
    "도미니온": {
        grade: "7",
        star: "5",
        position: "우월",
        element: "축복",
        instinct: {
            name: "천사의 호령 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "동료를 목표로 스킬 시전 후 『호령』을 2중첩 획득한다",
                "동료가 페르소나 스킬을 사용해 대미지를 줄 시, 『호령』을 1중첩 소모해 1턴 동안 주는 대미지가 15%, 공격력이 6.4% 증가한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "응집",
            effect: "모든 동료의 공격력이 15% 증가하고, 자신의 공격력 500마다 1.25%가 추가 증가한다. 상한은 10%이며 효과는 2턴 동안 지속된다. 또한 스킬의 메인 목표가 주는 대미지가 8% 추가 증가하고, 자신의 공격력 500마다 1% 추가 증가한다. 상한은 8%이며 효과는 1턴 동안 지속된다.",
            priority: 3,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            priority: 1
        },
        recommendSkill : [
             {name : "리벨리온", priority: 2},
             {name : "어드바이스", priority: 2},
             {name : "타루카쟈", priority: 2},
             {name : "대미지 면역", priority: 0},
             {name : "방어 강화", priority: 0},
        ],
        comment : "호령 + 응집 버프를 통해 1턴에 최대 공격력 31.4%, 대미지 31% 증가효과를 부여할 수 있다."
    },
    "년수": {
        grade: "8",
        star: "5",
        position: "굴복",
        element: "주원",
        instinct: {
            name: "해 지면 출몰하는 괴수 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "적에게 페르소나 스킬 사용 시 2턴 동안 스킬 목표가 『해의 멸절』을 획득한다.",
                "『해의 멸절』을 보유한 캐릭터는 처음 화염 대미지를 받을 시 『공포(년수)』를 획득하여 3턴 동안 받는 대미지가 12% 증가한다.",
                "또한 2턴 동안 75% 기본 확률로 화상을 입는다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "조화의 균열",
            effect: "모든 적에게 공격력 104.0%의 주원 속성 대미지를 주고, 2턴 동안 모든 적의 방어력을 10.0% 감소시키며, 받는 지속 대미지가 20.0% 증가한다.",
            priority: 0,
            icon: "주원광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 주원 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            priority: 1
        },
        recommendSkill : [
             {name : "음률의 침입", priority: 3},
             {name : "마하라쿤다", priority: 3},
             {name : "대미지 면역", priority: 0},
             {name : "방어 강화", priority: 0},
        ],
        comment : "음률의 침입은 과금 이벤트를 통해 배포된 스킬 카드로 마하라쿤다로 대체 가능하다."
    },
    "수르트": {
        grade: "6",
        star: "3",
        position: "굴복",
        element: "화염",
        instinct: {
            name: "맹렬한 불길의 군주 III",
            effects: [
                "효과 명중이 20.9% 증가한다.",
                "화상 효과를 부여할 떄 효과 명중이 50% 증가한다. 생명이 50% 이상인 적에게 해당 효과가 30% 추가 증가한다."
            ],
            priority: 0
        },
        uniqueSkill: {
            name: "마하라쿤다",
            effect: "3턴 동안 모든 적의 방어력이 27.1% 감소한다.",
            priority: 3,
            icon: "디버프광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 화염 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            priority: 1
        },
        recommendSkill : [
            {name : "대미지 면역", priority: 0},
            {name : "방어 강화", priority: 0},
        ],
        comment : "마하라쿤다 스킬카드 외 유일한 마하라쿤다를 소유한 페르소나"
    },
    "광목천": {
        grade: "5",
        star: "4",
        position: "우월",
        element: "물리",
        instinct: {
            name: "천왕의 주시 II",
            effects: [
                "효과 명중이 21.2% 증가한다.",
                "전투 시작 시 3턴 동안 공격력이 가장 높은 괴도의 공격력이 14% 증가하고, 크리티컬 확률이 6% 증가한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "레볼루션",
            effect: "모든 동료의 크리티컬 확률이 6.5% 증가하고, 자신의 크리티컬 확률 10%마다 추가로 1.1%가 증가한다. 상한은 4.4%이며, 효과는 3턴 동안 지속된다.",
            priority: 2,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            priority: 1
        },
        recommendSkill : [
             {name : "라쿤다", priority: 3 },
             {name : "마하타루카 오토", priority: 3 },
             {name : "민첩의 마음가짐", priority: 3 },
             {name : "리벨리온", priority: 1 },
             {name : "어드바이스", priority: 1 },
             {name : "타루카쟈", priority: 1 },
        ],
        comment : "본능 버프는 페르소나 전환 후에도 지속된다. "
    },
    "아메노우즈메": {
        grade: "3",
        star: "5",
        position: "반항",
        element: "전격",
        instinct: {
            name: "전율하는 신락 I",
            effects: [
                "효과 명중이 15% 증가한다.",
                "감전 효과 부여 시 모든 동료의 크리티컬 확률이 2턴 동안 10% 증가한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "전류의 흐름",
            effect: "1명의 적에게 공격력 143.0%의 전격 속성 대미지를 주고, 2턴 동안 100.0%의 기본 확률로 감전 효과를 부여한다.",
            priority: 0,
            icon: "전격"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 전격 속성 대미지를 준다.",
            priority: 0
        },
        recommendSkill : [
             {name : "엘 지하드", priority: 3},
             {name : "감전율 UP", priority: 3 },
             {name : "명중 강화", priority: 3 },
             {name : "우중충한 하늘", priority: 3},
        ],
        comment : "광역 감전을 통해 감전에 의한 크리티컬 확률 증가에 이어 본능을 통한 10%로 총 20%의 크리티컬 확률 증가를 노릴 수 있다."
    },
    "서큐버스": {
        grade: "1",
        star: "4",
        position: "우월",
        element: "주원",
        instinct: {
            name: "황홀한 속삭임 I",
            effects: [
                "공격력이 3.5% 증가한다.",
                "동료를 목표로 스킬 시전 시 1턴 동안 동료의 크리티컬 확률이 11.7% 증가한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "리벨리온",
            effect: "동료 1명의 크리티컬 확률이 9.3% 증가하고, 자신의 크리티컬 확률 10%마다 1.6% 추가 증가한다. 상한은 6.4%이며, 효과는 3턴 동안 지속된다.",
            priority: 1,
            icon: "버프"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            priority: 1
        },
        recommendSkill : [
             {name : "리벨리온", priority: 3 },
             {name : "어드바이스", priority: 3 },
             {name : "타루카쟈", priority: 3 },
             {name : "라쿠카쟈", priority: 3 },
        ]
    },
    "나르키소스": {
        grade: "5",
        star: "5",
        position: "굴복",
        element: "질풍",
        instinct: {
            name: "잃어버린 꽃향기 II",
            effects: [
                "효과 명중이 24.9% 증가한다.",
                "풍습 효과 부여 후 2턴 동안 메인 목표 적이 받는 대미지가 22.4% 증가한다.",
                "또한 2턴 동안 자신의 효과 명중이 18% 증가한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "매복사냥",
            effect: "1명의 적에게 155.1%의 질풍 속성 대미지를 주고, 2턴 동안 100%의 기본 확률로 적을 풍습 상태에 빠뜨린다.",
            priority: 1,
            icon: "질풍"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 질풍 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
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
        grade: "6",
        star: "5",
        position: "방위",
        element: "질풍",
        instinct: {
            name: "운명의 풍습 III",
            effects: [
                "방어력이 37.4% 증가한다.",
                "풍습 효과 부여 시 효과를 입은 적의 방어력이 31.5% 감소하고, 자신의 방어력이 30% 증가한다. 효과는 2턴 간 지속된다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "방풍막",
            effect: "모든 동료가 2턴 동안 공격력 19.5%+590의 실드를 획득한다. 실드가 대미지를 받으면 35.0%의 기본 확률로 대미지를 준 대상을 풍습 상태에 빠뜨린다.",
            priority: 0,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            priority: 0
        },
        recommendSkill : [
            {name : "명중 강화", priority: 3},
            {name : "질풍률 UP", priority: 3},
            {name : "우중충한 하늘", priority: 3},
            {name : "마하갈다인", priority: 3},
            {name : "갈다인", priority: 3},
            {name : "실드 강화", priority: 1},
        ],
        comment : "비슈누가 다른 파티에 사용됐지만 동일 메커니즘이 필요한 경우 채용한다."
    },
    "지국천": {
        grade: "3",
        star: "4",
        position: "우월",
        element: "물리",
        instinct: {
            name: "혜토의 동쪽 I",
            effects: [
                "방어력이 15.9% 증가한다.",
                "동료를 목표로 스킬 시전 시 2턴 동안 메인 목표의 공격력이 15.5% 증가한다. 목표의 생명이 60% 미만일 시 해당 효과는 30%까지 증가한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "마하타루카쟈",
            effect: "모든 동료의 공격력이 10.9% 증가하고,자신의 공격력 500포인트마다 0.9% 추가 증가한다. 상한은 7.2%이며, 효과는 3턴 동안 지속된다.",
            priority: 1,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            priority: 1
        },
        recommendSkill : [
             {name : "타루카쟈", priority: 3},
             {name : "리벨리온", priority: 3 },
        ]
    },
    "야마타노오로치": {
        grade: "7",
        star: "5",
        position: "반항",
        element: "빙결",
        instinct: {
            name: "제물의 비명 III",
            effects: [
                "크리티컬 확률이 17.5% 증가한다.",
                "전투 시작 시 『제물의 비명』을 3중첩 획득한다. 자신의 턴 종료 시 『제물의 비명』을 1중첩 획득한다. 자신이 고유 스킬 시전 시 『제물의 비명』을 3중첩 보유한 경우, 『제물의 비명』을 3중첩 소모해 3턴 동안 모든 적을 동결에 빠뜨린다. 또한 3턴 동안 적이 받는 TECH 대미지가 25% 증가한다."
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "광풍 눈",
            effect: "모든 적에게 공격력 100.0%의 빙결 속성 대미지를 주고, 2턴 동안 100.0%의 기본 확률로 메인 목표 적을 동결 상태에 빠뜨린다.",
            priority: 1,
            icon: "빙결광역"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 빙결 속성 대미지를 준다.",
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
        grade: "8",
        star: "5",
        position: "지배",
        element: "염동",
        instinct: {
            name: "길조의 주인 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "모든 동료가 각 속성의 대미지를 줄 때마다 황룡이 『사상』을 1중첩 획득한다(4회 중첩 가능). 백업 출전 시에도 유효.",
                "자신의 턴 시작 시 만약 『사상』을 최소 4중첩 보유하면 모든 『사상』이 제거되고 『사상의 힘』을 획득한다.",
                "『사상의 힘』: 2턴 동안 자신의 공격력이 30% 증가하고, 모든 아군 동료의 공격력이 15% 증가하며, 자신의 스킬이 진화한다."
            ],
            priority: 2 
        },
        uniqueSkill: {
            name: "심마격",
            effect: "모든 적에게 공격력 101.4%의 염동 속성 대미지를 준다.",
            priority: 0,
            icon: "염동광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 염동 속성 대미지를 준다.",
            priority: 0
        },
        recommendSkill : [
            
        ]
    },
    "스라오샤": {
        grade: "8",
        star: "5",
        position: "굴복",
        element: "축복",
        instinct: {
            name: "죄악의 경청자 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "전투 시작 시 3턴 동안 『신의 귀』를 2중첩 획득한다 (3회 중첩 가능).",
                "아군이 HIGHLIGHT를 사용하면 『신의 귀』를 1중첩 획득한다. 축복 속성 괴도가 HIGHLIGHT를 사용하면 추가로 『신의 귀』를 1중첩 획득한다.",
                "고유 스킬 사용 시 『신의 귀』가 모두 소모되며, 중첩마다 적이 받는 축복 속성 대미지가 2턴 동안 6% 증가한다.",
                "『신의 귀』가 3중첩에 도달하면 축복 속성 대미지를 받는 적의 방어력이 추가로 25% 감소한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "절대복종",
            effect: "1명의 적에게 공격력 200.0%의 축복 속성 대미지를 준다. 1턴 동안 목표가 받는 HIGHLIGHT 대미지가 30.0% 증가한다.",
            priority: 2,
            icon: "축복"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 축복 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
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
        comment : "선봉이 아닌 파티에 속해있기만 해도 『신의 귀』중첩을 획득 가능하다."
    },
    "체르노보그": {
        grade: "7",
        star: "5",
        position: "굴복",
        element: "물리",
        instinct: {
            name: "만연한 적막 III",
            effects: [
                "효과 명중이 34.9% 증가한다.",
                "『악몽』은 2턴 동안 효과 저항이 15%, 방어력이 10% 감소한다.『악몽』 상태일 때 적이 받는 물리 대미지가 8% 증가한다.",
                "적이 물리 대미지를 3회 받을 때마다 추가로 1중첩을 획득하며 독립적으로 계산된다. 최대 3회 중첩 가능하며 2턴 동안 지속된다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "고통의 심판",
            effect: "1명의 적에게 40.0%의 물리 속성 대미지를 3회 주고, 적에게 『악몽』 효과를 준다. 또한 9.0%의 기본 확률로 공포 효과를 축라한다.",
            priority: 2,
            icon: "물리"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 물리 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
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
        grade: "8",
        star: "5",
        position: "굴복",
        element: "염동",
        instinct: {
            name: "인과의 유전 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "턴이 시작될 때마다 『혜안』를 획득한다. (3회 중첩 가능). 고유 스킬을 사용하여 『혜안』을 소모하며 소모량에 따라 다음 효과를 얻을 수 있다.",
                "1중첩 : 이번 염동 공격 시 대미지가 33% 증가한다.",
                "2중첩 : 1턴 동안 적의 방어력이 45% 감소한다.",
                "3중첩 : 1턴 동안 목표가 염동 대미지를 받을 때 크리티컬 확률이 18% 증가한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "파멸의 춤",
            effect: "모든 적에게 공격력 100%의 염동 속성 대미지를 1단계 입히고, 모든 『혜안』을 소모하여 본능 [인과의 유전] 효과를 발동한다.",
            priority: 1,
            icon: "염동광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 염동 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
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
        grade: "5",
        star: "5",
        position: "지배",
        element: "염동",
        instinct: {
            name: "지배자의 위엄 II",
            effects: [
                "크리티컬 확률이 12.5% 증가한다.",
                "페르소나 스킬을 시전해 적에게 대미지를 준 후, 3턴 동안 적이 받는 염동 속성 대미지가 8.5% 증가한다(3회 중첩 가능).",
                "해당 효과를 보유한 적 공격 시 염동 속성 대미지가 10% 증가한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "정신 파동",
            effect: "모든 적에게 공격력 88.0%의 염동 속성 대미지를 준다. 정신 이상 적에 대한 대미지는 20% 증가하며, 목표 적의 약점 속성이 염동일 경우에는 주는 대미지가 추가로 15% 증가한다.",
            priority: 1,
            icon: "염동광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 염동 속성 대미지를 준다.",
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
    "자오우곤겐":{
        grade: "8",
        star: "5",
        position: "반항",
        element: "화염",
        instinct: {
            name: "삼세 제도 III",
            effects: [
                "공격력이 29.1% 증가한다. 페르소나 스킬을 시전해 대미지를 준 후 3턴 동안 자신과 공격력이 가장 높은 반항/지배 동료가 『불멸의 진리』를 획득한다.",
                "『불멸의 진리』: 스 킬을 시전해 4회 이상 대미지를 줄 때 자신의 공격력이 12%, 대미지가 10% 증가한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "분노한 진신",
            effect: "1명의 적에게 공격력 48.0%의 화염 속성 대미지를 4회 준다. 적군에게 「외상」을 주며 3턴 동안 지속된다. 「외상」기간 동안 목표가 화염 속성 대미지를 1회 받을 때 마다 2턴 동안 받는 크리티컬 효과가 3% 증가한다(8회 중첩 가능).",
            priority: 3,
            icon: "화염"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 화염 속성 대미지를 준다.",
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
    "앨리스": {
        grade: "8",
        star: "5",
        position: "굴복",
        element: "주원",
        instinct: {
            name: "환생의 주원 III",
            effects: [
                "효과 명중이 34.9% 증가한다.",
                "모든 적이 받는 주원 속성 데미지가 18% 증가한다.",
                "모든 동료가 주원 속성의 페르소나 스킬을 1개 시전할 때마다 앨리스의 효과 명중, 공격력이 12.6% 증가한다. 효과는 2턴 동안 지속되며 3회 중첩 가능하다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "죽어 줄래?",
            effect: "2턴 동안 모든 적이 받는 주원 속성 대미지가 17.5% 증가하고, 효과 명중 30%마다 추가로 2% 증가한다. 상한은 10%이다. 적의 생명이 50% 미만일 시 높은 확률로 즉사 효과가 추가된다.",
            priority: 2,
            icon: "주원광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 주원 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            priority: 1
        },
        recommendSkill : [
             {name : "타루카쟈", priority: 3 },
             {name : "명중 강화", priority: 3 },
             {name : "우중충한 하늘", priority: 3 },
        ],
        comment : "기본 명중 80% + 명중 강화 IV 16.2% + 우중충한 하늘 16.9% + 본능 34.9% + 마이팰리스 2.3% = 150.3% 로 \'죽어 줄래?\' 상한 10%를 채울 수 있다. (우중충한 하늘 적용 여부 미확인)"
    },
    "비사문천": {
        grade: "7",
        star: "5",
        position: "반항",
        element: "핵열",
        instinct: {
            name: "격노의 혜산 III",
            effects: [
                "크리티컬 확률이 17.5% 증가한다.",
                "적에게 스킬 시전 시, 메인 목표 적이 원소 이상을 1중첩 보유할 때마다 받는 핵열 데미지가 1턴 동안 10% 증가한다. (3회 중첩 가능).",
                "또한 다른 적이 해당 효과의 40%를 획득한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "존왕의 항복",
            effect: "1명의 적에게 180.0%의 핵열 속성 대미지를 주고, 원소 이상 상태인 적 공격 시 해당 스킬 대미지가 25% 증가한다.",
            priority: 0,
            icon: "핵열"
        },
        highlight: {
            effect: "1명의 적에게 360.0%의 핵열 속성 대미지를 준다.",
            priority: 0
        },
        recommendSkill : [
            {name : "라쿤다", priority: 3 },
            {name : "마하타루카 오토", priority: 2},
            {name : "민첩의 마음가짐", priority: 1},
        ],
        comment : "라쿤다를 사용해도 본능 효과가 적용된다."
    },
    "토르": {
        grade: "7",
        star: "5",
        position: "지배",
        element: "전격",
        instinct: {
            name: "뇌신의 위엄 III",    
            effects: [
                "아군 괴도가 전격 속성의 페르소나 스킬/추가 효과/HIGHLIGHT 시전 시 2턴 동안 자신이 『뇌신의 위세』를 1중첩 획득한다(3회 중첩 가능).",
                "자신이 페르소나 스킬 대미지를 주었을 때, 만약 자신의 『뇌신의 위세』가 3중첩이면 2턴 동안 전체 적이 받는 전격 속성 대미지가 12% 증가하고, 받는 전격 속성 크리티컬 효과가 20% 증가한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "하늘이 부른 번개",
            effect: "모든 적에게 공격력 112%의 전격 속성 대미지를 준다. 『뇌신의 위세』가 3중첩일 경우, 80%의 기본 확률로 모든 적을 감전 상태에 빠뜨린다.",
            priority: 2,
            icon: "전격광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180%의 전격 속성 대미지를 준다.",
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
    "유룽": {
        grade: "5",
        star: "3",
        position: "굴복",
        element: "전격",
        instinct: {
            name: "성천에 잠든 뱀 II",
            effects: [
                "크리티컬 효과가 17.4% 증가한다.",
                "필드의 적이 받는 크리티컬 효과가 18% 증가한다. 대상이 감전 상태일 경우 11% 추가 증가한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "전격 내성 제거",
            effect: "2턴 동안 적 1명의 전격 내성을 제거한다.",
            priority: 0,
            icon: "디버프"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 전격 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
            priority: 1
        },
        recommendSkill : [
            {name : "지오다인", priority: 3 },
            {name : "감전율 UP", priority: 3 },
            {name : "명중 강화", priority: 3 },
            {name : "우중충한 하늘", priority: 3},
        ]
    },
    "트론": {
        grade: "7",
        star: "5",
        position: "우월",
        element: "화염",
        instinct: {
            name: "세속을 초월한 성인 III",
            effects: [
                "공격력이 29.1% 증가한다.\n전투 시작 시 『불씨』를 8중첩 획득한다. 아군 캐릭터가 원소 이상을 추가할 때 자신은 『불씨』 1중첩을 획득한다. 만약 화상일 경우 『불씨』를 추가로 1중첩 획득하며 3턴 동안 지속된다 (10회 중첩 가능).\n매회 스킬은 『불씨』를 최대 2중첩 제공할 수 있다. 자신이 아군 캐릭터에게 페르소나 스킬 시전 시『불씨』가 4중첩 이상이면 모든 『불씨』를 소모해 중첩마다 2턴 동안 아군 전체 대미지가 1% 증가하며, 75%의 확률로 임의 적군 1명이 화상 상태에 빠진다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "정화의 불",
            effect: "3턴 동안 모든 아군 캐릭터의 공격력이 8.0% 증가하고, 자신의 공격력 500마다 0.5% 추가 증가한다(최대 4%). 또한 3턴 동안 스킬 메인 목표가 『정화의 불』을 획득한다. 『정화의 불』: 적군 캐릭터에게 페르소나 스킬을 시전하여 대미지를 준 후 75%의 기본 확률로 임의 적군 1명이 화상 상태에 빠진다.",
            priority: 3,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            priority: 1
        },
        recommendSkill : [
            {name : "화상률 UP", priority: 3 },
            {name : "명중 강화", priority: 3 },
            {name : "우중충한 하늘", priority: 3},
        ],
        comment : "화상이 필수적인 캐릭터(ex. 미오)에게 사용하는 형태로 채용된다."
    },
    "라미아": {
        grade: "3",
        star: "5",
        position: "굴복",
        element: "화염",
        instinct: {
            name: "아름다운 탐욕 I",
            effects: [
                "효과 명중이 15% 증가한다.",
                "화상 효과를 부여할 때 효과 명중이 40% 증가한다. 화상 효과 부여 후 2턴 동안 모든 동료의 공격력이 12% 증가한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "화제",
            effect: "1명의 적에게 150.0%의 화염 속성 대미지를 주고, 50.0%의 기본 확률로 적을 화상 상태에 빠뜨린다. 필드의 화상 상태인 적이 없을 시 명중 확률이 2배가 된다.",
            priority: 1,
            icon: "화염"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 화염 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
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
        grade: "6",
        star: "5",
        position: "지배",
        element: "화염",
        instinct: {
            name: "악마의 주조 III",
            effects: [
                "공격력이 24.9% 증가한다.",
                "페르소나 스킬을 시전해 화상 상태인 적에게 대미지를 준 후, 1턴 동안 모든 적이 받는 화염 속성 대미지가 29% 증가한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "극열",
            effect: "모든 적에게 67.5%의 화염 속성 대미지를 주고, 100%의 고정 확률로 스킬 메인 목표를 화상 상태에 빠뜨린다.",
            priority: 1,
            icon: "화염광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 화염 속성 대미지를 준다.",
            priority: 0
        },
        recommendSkill : [
            {name : "엘 지하드", priority: 3 },
            {name : "감전율 UP", priority: 3 },
            {name : "명중 강화", priority: 3 },
            {name : "우중충한 하늘", priority: 3},
            {name : "어드바이스", priority: 0},
        ],
        comment : "이미 화상 상태인 적에게 [극열 : 화염 대미지 or 엘 지하드 : 감전 추가] 본능 효과를 발동한다."
    },
    "요시츠네": {
        grade: "8",
        star: "5",
        position: "지배",
        element: "물리",
        instinct: {
            name: "연승의 숙명 III",
            effects: [
                "크리티컬 효과가 34.9% 중가한다.",
                "전투 시작 시 『기습』을 4중첩 획득한다. 2턴 동안 고유 스킬이 대미지를 줄 때마다 60% 확률로 『기습』을 획득하며,",
                "매회 자신의 공격력이 9%씩 중가한다(8회 중첩 가능). 8중첩 도달 시 크리티컬 확률이 30% 증가한다."
            ],
            priority: 3
        },
        uniqueSkill: {
            name: "팔척뛰기",
            effect: "모든 적에게 공격력 15.0%의 물리 속성 데미지를 8회 주고, 적 1명당 해당 스킬 데미지가 5% 증가하며, 최대 15% 증가한다.",
            priority: 3,
            icon: "물리광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 물리 속성 대미지를 준다.",
            priority: 1
        },
        recommendSkill : [
            {name : "공격 강화", priority: 3 },
            {name : "어드바이스", priority: 3 },
            {name : "정교한 타격", priority: 3 },
            {name : "마도의 재능", priority: 3 },
            {name : "물리 강화", priority: 3 },
            {name : "공격의 마음가짐", priority: 3},
        ]
    },

    "네코쇼군": {
        grade: "3",
        star: "5",
        position: "우월",
        element: "염동",
        instinct: {
            name: "건어를 사주겠다옹 I",
            effects: [
                "효과 명중이 15% 증가한다.",
                "전투 시작 시 2턴 동안 모든 동료의 효과 명중이 10% 증가하고, 효과 명중이 가장 높은 동료의 효과 명중이 14% 증가한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "스쿠카쟈",
            effect: "동료 1명의 효과 명중, 효과 저항이 9.3% 증가하고,자신의 효과 명중 25%마다 1.6% 추가 증가한다.상한은 6.4%이며, 효과는 3턴 동안 지속된다.",
            priority: 1,
            icon: "버프"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            priority: 0
        },
        recommendSkill : [
            {name : "명중 강화", priority: 3 },
        ]
    },
    "미트라스": {
        grade: "4",
        star: "3",
        position: "방위",
        element: "핵열",
        instinct: {
            name: "태양의 비호 II",
            effects: [
                "생명이 11.6% 증가한다.",
                "동료를 목표로 스킬 시전 후, 2턴 동안 방어력이 14.5% 증가한다. 생명이 50% 이상일 시 효과가 추가로 50% 증가한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "마하라쿠카쟈",
            effect: "모든 동료의 방어력이 16.3% 증가하고, 자신의 방어력 500마다 2.7% 추가 증가한다. 상한은 10.8%이며, 효과는 3턴 동안 지속된다.",
            priority: 1,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            priority: 0
        },
        recommendSkill : [
             {name : "라쿠카쟈", priority: 3 },
             {name : "리벨리온", priority: 3 },
             {name : "어드바이스", priority: 3},
        ]
    },
    "산달폰": {
        grade: "8",
        star: "5",
        position: "방위",
        element: "만능",
        instinct: {
            name: "거대한 수호 III",
            effects: [
                "방어력이 43.6% 중가한다.",
                "산달폰이 필드 에 있을 경우 실드를 보유하고 있는 동료의 방어력이 42% 중가한다. 백업 출전 시 버프 효과를 25% 획득한다."
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "헌신의 비호",
            effect: "모든 동료가 공격력 25.5%+771의 실드를 획득한다. 메인 목표 동료가 임의의 실드를 보유하고 있을 때 주는 대미지가 20.4% 증가하며, 2턴 동안 지속된다.",
            priority: 1,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            priority: 0
        },
        recommendSkill : [
             {name : "실드 강화", priority: 3 },
             {name : "공격 강화", priority: 2 },
             {name : "치료 촉진", priority: 1 },
        ],
        comment : "백업 출전으로 10.5%의 방어력 보너스를 부여할 수 있다."
    },

    "이시스": {
        grade: "3",
        star: "3",
        position: "구원",
        element: "전격",
        instinct: {
            name: "풍요의 앙크 I",
            effects: [
                "생명이 8.7% 증가한다.",
                "치료 효과 부여 시 목표는 다음 턴에 2턴 동안 공격력 5%의 생명을 회복한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "메디아라한",
            effect: "모든 동료가 공격력 19.0%+575의 생명을 회복한다.",
            priority: 1,
            icon: "치료광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 생명을 회복한다.",
            priority: 1
        },
        recommendSkill : [
             {name : "치료 강화", priority: 3 },
             {name : "공격 강화", priority: 1 },
             {name : "방어 강화", priority: 0 },
             {name : "대미지 면역", priority: 0 },
        ],
        comment : "공격 강화는 치료 수치에 적용된다. (영향력이 높지 않아 우선순위는 낮다)"
    },
    "티타니아": {
        grade: "6",
        star: "5",
        position: "구원",
        element: "핵열",
        instinct: {
            name: "달의 요괴의 소란 III",
            effects: [
                "주는 치료 효과가 18% 증가한다.",
                "페르소나 스킬로 치료 효과 부여 후 77.5%의 기본 확률로 임의의 적 1명의 임의의 1가지 원소 이상 상태에 빠뜨리고, 방어력이 9% 감소한다. 효과는 2턴 지속된다."
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "격정과 진정",
            effect: "모든 동료가 공격력 18.0%+544의 생명을 회복하며, 생명이 50% 미만인 동료에게 주는 치료 효과가 25% 증가한다. 또한 모든 동료가 SP 4포인트를 회복한다.",
            priority: 2,
            icon: "치료광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 생명을 회복한다.",
            priority: 1
        },
        recommendSkill : [
            {name : "치료 강화", priority: 3 },
            {name : "공격 강화", priority: 1 },
            {name : "방어 강화", priority: 0 },
            {name : "대미지 면역", priority: 0 },
        ],
        comment : "공격 강화는 치료 수치에 적용된다. (영향력이 높지 않아 우선순위는 낮다)"
    },
    "파르바티": {
        grade: "6",
        star: "4",
        position: "구원",
        element: "염동",
        instinct: {
            name: "지모신의 비호 III",
            effects: [
                "생명이 21.2% 증가한다.",
                "치료 효과를 준 후, 1턴 동안 치료 효과를 입은 동료의 공격력이 16%, 방어력이 10.5% 증가한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "디아라마",
            effect: "동료 1명이 공격력 35.6%+1077의 생명을 회복한다.",
            priority: 0,
            icon: "치료"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 생명을 회복한다.",
            priority: 1
        },
        recommendSkill : [
            {name : "치료 강화", priority: 3 },
            {name : "공격 강화", priority: 1 },
            {name : "방어 강화", priority: 0 },
            {name : "대미지 면역", priority: 0 },
        ],
        comment : "하이라이트를 통한 치료에도 본능 효과가 발동된다. 공격 강화는 치료 수치에 적용된다. (영향력이 높지 않아 우선순위는 낮다)"
    },
    "지크프리트": {
        grade: "7",
        star: "5",
        position: "지배",
        element: "물리",
        instinct: {
            name: "용사의 살의 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "전투 시작 시 『용혈』을 획득한다. 자신이 물리 속성 스킬 시전 시 3턴 동안 공격력이 10% 증가한다.",
                "고유 스킬 사용 시 『용혈』 상태를 강화하며, 물리 속성 스킬을 시전하면 대미지가 28%, 크리티컬 효과가 28% 추가로 증가한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "용을 베는 자태",
            effect: "모든 적에게 공격력 95.0%의 물리 속성 대미지를 준다. 만약 자신이 「용혈」 상태를 보유하지 않은 경우 자신에게 「용혈」을 부여한다. 만약 자신이 「용혈」 상태이면,「용혈」 상태를 강화하고 지속 시간을 갱신한다.",
            priority: 0,
            icon: "물리광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 물리 속성 대미지를 준다.",
            priority: 0
        },
        recommendSkill : [
             {name : "", priority: 0 }
        ],
        comment : "파티에만 지니고 있어도 전투 시작 시 『용혈』을 획득한다"

    },
    "아프사라스": {
        grade: "2",
        star: "2",
        position: "우월",
        element: "빙결",
        instinct: {
            name: "감미로운 노랫소리 I",
            effects: [
                "방어력이 8.7% 중가한다. 동료를 목표로 스킬 시전 시 2턴 동안 동료의 방어력이 15.4% 증가한다."
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "리벨리온",
            effect: "동료 1명의 크리티컬 확률이 9.3% 증가하고, 자신의 크리티컬 확률 10%마다 1.6% 추가 증가한다. 상한은 6.4%이며, 효과는 3턴 동안 지속된다.",
            priority: 1,
            icon: "버프"
        },
        highlight: {
            effect: "모든 동료의 주는 대미지가 29.5% 증가하며 2턴 동안 지속된다.",
            priority: 0
        },
        recommendSkill : [
             {name : "마하라쿠카 오토", priority: 2},
             {name : "어드바이스", priority: 2},
             {name : "민첩의 마음가짐", priority: 1},
        ]
    },
    "킹프로스트": {
        grade: "7",
        star: "5",
        position: "방위",
        element: "빙결",
        instinct: {
            name: "얼음의 심판 III",
            effects: [
                "방어력이 37.4% 증가한다.",
                "동료에게 실드를 부여할 때 메인 목표는 방어력 25% 증가와 빙결 대미지 15% 증가 두 가지 효과를 획득하며 2턴 동안 지속된다."
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "눈의 여왕의 비호",
            effect: "모든 동료가 공격력 22.8%+690의 실드를 획득하며, 실드 기간 동안 방어력이 30% 증가한다. 효과는 2턴 동안 지속된다.",
            priority: 1,
            icon: "버프광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            priority: 0
        },
        recommendSkill : [
             {name : "마하라쿠카 오토", priority: 2},
             {name : "실드 강화", priority: 2},
             {name : "민첩의 마음가짐", priority: 1},
        ]
    },
    "릴리스": {
        grade: "7",
        star: "5",
        position: "지배",
        element: "만능",
        instinct: {
            name: "한밤의 유혹 III",
            effects: [
                "공격력이 29.1% 중가한다.",
                "빙결, 질풍 또는 주원 속성의 스킬을 사용하면 2턴 동안 자신의 해당 속성 대미지가 30% 중가하고, 대미지가 10% 감면된다.",
                "릴리스가 빙결, 질풍 또는 주원 속성의 스킬을 사용하면 고유 스킬이 진화하여 같은 속성의 대미지를 추가하고, 이번 스킬 대미지가 대폭 증가 및 임시 관통 보너스를 15% 획득한다."
            ],
            priority: 0
        },
        uniqueSkill: {
            name: "살육 유도",
            effect: "모든 적에게 공격력 25.0%의 만능 대미지를 주고, 그 후 공격력 37.5%의 주원 대미지를 준다. 스킬이 「얼음」「폭풍」「저주」형태로 진화 가능: 모든 적에게 공격력 25.0%의 만능 대미지를 주고, 그 후 공격력 101.0%의 (빙결, 질풍 또는 주원) 대미지를 준다.",
            priority: 0,
            icon: "만능광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 만능 속성 대미지를 준다.",
            priority: 0
        },
        recommendSkill : [
            {name : "마하타루카 오토", priority: 2},
            {name : "민첩의 마음가짐", priority: 1},
        ],
        comment : "원더 무기 메커니컬 심판자 등 만능 대미지 증가 목적 외 채용되지 않는다."
    },
    "아누비스": {
        grade: "4",
        star: "5",
        position: "반항",
        element: "주원",
        instinct: {
            name: "죽음의 심판관 III",
            effects: [
                "공격력이 29.1% 증가한다.",
                "축복 효과를 줄 경우 자신은 축복 효과 2개를 획득하고, 50%의 고정 확률로 스킬의 메인 목표는 주원 효과 1개를 획득한다.",
                "주원 대미지를 줄 경우 스킬의 메인 목표가 주원 효과 2개를 획득하고, 50%의 고정 확률로 자신은 축복 효과 1개를 획득한다.",
                "주원 효과가 있는 적을 공격하면 공격력이 27% 증가한다."
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "왕생의 심판",
            effect: "1명의 적에게 공격력 165.0%의 주원 속성 대미지를 주고, 스킬 시전 시 자신이 가진 축복 효과 또는 목표가 가진 주원 효과에 따라 해당 스킬이 주는 대미지가 10% 증가하며 최대 4회까지 중첩된다.",
            priority: 0,
            icon: "주원"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 주원 속성 대미지를 준다.",
            priority: 0
        },
        recommendSkill : [
             {name : "악마의 심판", priority: 3 },
             {name : "만능 강화", priority: 3 },
             {name : "마도의 재능", priority: 3 },
        ],
        comment : "주원 효과 대미지는 만능 대미지에 영향을 받는다."
    },
    "파즈스": {
        grade: "5",
        star: "4",
        position: "지배",
        element: "주원",
        instinct: {
            name: "영겁의 저주 II",
            effects: [
                "공격력이 17.7% 증가한다.",
                "페르소나 스킬로 적을 공격하는 경우 60%의 고정 확률로 메인 목표인 적이 주원 효과를 1중첩 획득한다. 또한 주원 대미지를 1회 결산한다."
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "마하에이가온",
            effect: "모든 적에게 공격력 66.5%의 주원 속성 대미지를 주고, 일정 확률로 적이 주원 효과 1개를 획득한다.",
            priority: 0,
            icon: "주원광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 주원 속성 대미지를 준다.",
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
        comment : "아기다인을 통한 화상 효과 + 본능에 의한 주원 대미지 결산 형태로 운영된다. 주원 효과 대미지는 만능 대미지에 영향을 받는다."
    },
    "벨페고르": {
        grade: "4",
        star: "4",
        position: "굴복",
        element: "빙결",
        instinct: {
            name: "한파의 나태함 II",
            effects: [
                "효과저항이 17% 증가한다.",
                "적을 목표로 페르소나 스킬을 시전한 후 2턴 동안 스킬 메인 목표가 받는 빙결 속성 데미지가 14.4%증가한다. 생명이 50%미만일 시 효과가 추가로 40% 증가한다."
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "라쿤다",
            effect: "3턴 동안 적 1명의 방어력이 38.8% 감소한다.",
            priority: 1,
            icon: "디버프"
        },
        highlight: {
            effect: "모든 적에게 공격력 90.0%의 빙결 속성 대미지를 주며, 적이 받는 대미지가 19.6% 증가한다. 효과는 2턴동안 지속된다.",
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
        grade: "6",
        star: "3",
        position: "지배",
        element: "화염",
        instinct: {
            name: "태양의 분노 III",
            effects: [
                "공격력이 17.5% 증가한다.",
                "자신에게 디버프 효과가 없을 시 공격력이 30% 증가하고, 주는 화염 속성 대미지가 16.5% 증가한다."
            ],
            priority: 1
        },
        uniqueSkill: {
            name: "마하라기다인",
            effect: "모든 적에게 공격력 60.8%의 화염 속성 대미지를 주고, 33.8%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
            priority: 0,
            icon: "화염광역"
        },
        highlight: {
            effect: "모든 적에게 공격력 180.0%의 화염 속성 대미지를 준다.",
            priority: 1
        },
        recommendSkill : [
            {name : "공격 강화", priority: 0 },
            {name : "어드바이스", priority: 0 },
            {name : "정교한 타격", priority: 0 },
            {name : "마도의 재능", priority: 0 },
            {name : "화염 강화", priority: 0}
        ],
        comment : "원더를 통한 화염 대미지를 부여할 때 채용한다."
    },
    "기리메칼라": {
        grade: "5",
        star: "3",
        position: "방위",
        element: "물리",
        instinct: {
            name: "코끼리의 응시 II",
            effects: [
                "효과저항이 17.4% 증가한다.",
                "모든 동료가 디버프 효과를 가진 적에게 받는 대미지가 20% 감소한다."
            ],
            priority: 2
        },
        uniqueSkill: {
            name: "마하타쿤다",
            effect: "3턴 동안 모든 적의 공격력이 18.1% 감소한다.",
            priority: 0,
            icon: "디버프광역"
        },
        highlight: {
            effect: "모든 동료가 공격력 48.6%+1471의 실드를 획득하며 2턴 동안 지속된다.",
            priority: 0
        },
        recommendSkill : [
        ],
        comment : "받는 대미지 감소 효과가 필요할 때 채용한다."
    },
    "쿠 훌린": {
        grade: "7",
        star: "5",
        position: "반항",
        element: "물리",
        instinct: {
            name: "포효하는 맹견 III",
            effects: [
                "크리티컬 확률이 17.5% 중가한다.",
                "크리티컬 시 적에게 「치명덫」을 추가하고, 다음 고유 스킬 공격으로 표식을 폭발시켜 스킬 대미지가 공격력의 87%만큼 추가 증가한다. 표식 폭발 시 낮은 확률로 즉사 효과가 발동된다."
            ],
            priority: 0
        },
        uniqueSkill: {
            name: "가시창",
            effect: "공격력 174.0%의 물리 대미지를 1단계 주며, 공격을 받은 적에게 디버프가 1중첩 있을 때마다 해당 스킬 크리티컬 확률이 4% 증가한다. 크리티컬 버프는 최대 20%까지 획득한다.",
            priority: 0,
            icon: "물리"
        },
        highlight: {
            effect: "1명의 적에게 공격력 360.0%의 물리 대미지를 준다.",
            priority: 0
        },
        recommendSkill : [
            {name : "공격 강화", priority: 0 },
            {name : "어드바이스", priority: 0 },
            {name : "정교한 타격", priority: 0 },
            {name : "마도의 재능", priority: 0 },
            {name : "물리 강화", priority: 0 },
        ]
    }
};
