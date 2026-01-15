// 속성값 상수 정의
const RESISTANCE_TYPES = {
    NULL: "null",   // 속성 없음
    WEAK: "약",     // 약점
    NORMAL: "내",   // 내성
    ABSORB: "흡",   // 흡수
    REFLECT: "반",  // 반사
    IMMUNE: "무"    // 무효
};

// 속성 종류 상수 정의
const ELEMENT_TYPES = {
    physics: "physics",   // 물리
    shoot: "shoot",            // 총격
    FIRE: "fire",          // 화염
    ICE: "ice",            // 빙결
    ELECTRIC: "electric",   // 전격
    WIND: "wind",          // 질풍
    think: "think",            // 염동
    pit: "pit",    // 핵열
    blessing: "blessing",        // 축복
    CURSE: "curse"         // 주원
};

// 속성 한글명 매핑
const ELEMENT_NAMES = {
    physics: "물리",
    shoot: "총격",
    fire: "화염",
    ice: "빙결",
    electric: "전격",
    wind: "질풍",
    think: "염동",
    pit: "핵열",
    blessing: "축복",
    curse: "주원"
};

// 속성 아이콘 경로 매핑
const ELEMENT_ICONS = {
    physics: "../img/elements/physics.webp",
    shoot: "../img/elements/shoot.webp",
    fire: "../img/elements/fire.webp",
    ice: "../img/elements/ice.webp",
    electric: "../img/elements/electric.webp",
    wind: "../img/elements/wind.webp",
    think: "../img/elements/think.webp",
    pit: "../img/elements/pit.webp",
    blessing: "../img/elements/blessing.webp",
    curse: "../img/elements/curse.webp"
};

// 내성 아이콘 경로 매핑
const RESISTANCE_ICONS = {
    "null": "",
    "약": "../img/resistance/weak.webp",
    "내": "../img/resistance/normal.webp",
    "흡": "../img/resistance/absorb.webp",
    "반": "../img/resistance/reflect.webp",
    "무": "../img/resistance/immune.webp"
};


const bossData = [
    {
        id: 1,
        isSea: true,
        name: "단일 보스 (예시)",
        name_en: "Single Boss (Example)",
        name_jp: "シングルボス (例)",
        icon: "",
        description: "",
        resistances: {},
        baseDefense: "855",
        defenseCoef: "263.2",
        comment: "",
        img: "B-guaiwutouxiang-theReaper.png"
    },
    {
        id: 2,
        isSea: true,
        name: "광역 보스 (예시)",
        name_en: "Area Boss (Example)",
        name_jp: "エリアボス (例)",
        icon: "",
        description: "",
        resistances: {},
        baseDefense: "567",
        defenseCoef: "263.2",
        comment: "",
        img: "B-guaiwutouxiang-theReaper.png"
    },
    {
        id: 220,
        isSea: false,
        name: "단일 보스 (예시)",
        name_en: "Single Boss (Example)",
        name_jp: "シングルボス (例)",
        icon: "",
        description: "",
        resistances: {},
        baseDefense: "1280",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-theReaper.png"
    },
    {
        id: 221,
        isSea: false,
        name: "광역 보스 (예시)",
        name_en: "Area Boss (Example)",
        name_jp: "エリアボス (例)",
        icon: "",
        description: "",
        resistances: {},
        baseDefense: "821",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-theReaper.png"
    },

    {
        id: 3,
        isSea: true,
        name: "케르베로스",
        icon: "",
        description: "",
        resistances: {},
        baseDefense: "?",
        defenseCoef: "363.2",
        comment: "",
        img: "B-guaiwutouxiang-cerberus.png"
    },
    /*
    {
        id: 4,
        isSea: true,
        name: "릴리스",
        icon: "../img/boss/릴리스.webp",
        description: "시종 4개 소환해 [생명 연결] 상태\n[생명 연결] : 현재 생명 비율에 따라 받는 대미지 분배\n\n1턴마다 모든 아군에게 [황혼의 가호] 1중첩 추가 (최대 2중첩)\n[황혼의 가호] : 자신이 받는 최종 대미지 15% 감소, 원소 이상 상태 획득 시 1중첩 제거",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "약",
            ice: "내",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "내",
            blessing: "null",
            curse: "null"
        },
        baseDefense: "-",
        defenseCoef: "263.2",
        comment: ""
    },
    {
        id: 5,
        isSea: true,
        name: "릴리스 / 누에",
        icon: "../img/boss/누에.webp",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "약",
            ice: "내",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "null",
            blessing: "null",
            curse: "null"
        },
        baseDefense: "-",
        defenseCoef: "263.2",
        comment: ""
    },*/
    {
        id: 6,
        isSea: true,
        name: "바포멧",
        icon: "../img/boss/바포멧.webp",
        description: "바포맷은 한 턴 마다 모든 괴도의 SP 회복\n2번째 행동마다 공격력이 가장 높은 괴도에게 [악마의 주원] 부여\n(2턴/4턴 종료 후 발동)\n\n[악마의 주원] : 주는 대미지가 50% 감소한다 (2턴 지속)",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "내",
            ice: "내",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "null",
            blessing: "약",
            curse: "약"
        },
        baseDefense: 855,
        defenseCoef: 263.2,
        comment: "미나미의 2스 / 쿤다킬을 통해 [악마의 주원] 제거 가능",
        img: "B-guaiwutouxiang-baphomet.png"
    },
    {
        id: 555,
        isSea: true,
        name: "쿠 훌린",
        baseDefense: 855,
        defenseCoef: 263.2,
        img: "B-guaiwutouxiang-cuchulainn.png"
    },
    {
        id: 556,
        isSea: true,
        name: "오베론 / 티타니아",
        baseDefense: 860,
        defenseCoef: 263.2,
        img: "B-guaiwutouxiang-oberon.png"
    },
    {
        id: 557,
        isSea: true,
        name: "도미니온",
        baseDefense: 376,
        defenseCoef: 263.2,
        img: "B-guaiwutouxiang-dominion.png"
    },
    {
        id: 558,
        isSea: true,
        name: "수르트",
        baseDefense: 855,
        defenseCoef: 263.2,
        img: "B-guaiwutouxiang-surtr.png"
    },
    {
        id: 559,
        isSea: true,
        name: "비사문천 / 광목천 / 증장천 / 지국천",
        baseDefense: 567,
        defenseCoef: 263.2,
        img: "B-guaiwutouxiang-bishamonten.png"
    },
    {
        id: 7,
        isSea: true,
        name: "멜키세덱",
        icon: "../img/boss/멜키세덱.webp",
        description: "1턴마다 [신의 비호] 6중첩 획득 (1턴/3턴/5턴)\n- 중첩마다 5% 대미지 감소\n- 스킬 또는 추가효과로 대미지를 받을 때마다 1중첩 해제\n- 모든 중첩을 잃으면 모든 괴도가 [신의 축복] 획득\n\n[신의 축복] : 주는 대미지 30% 증가",
        resistances: {
            physics: "내",
            shoot: "null",
            fire: "null",
            electric: "null",
            ice: "null",
            wind: "약",
            think: "내",
            pit: "내",
            blessing: "내",
            curse: "내"
        },
        baseDefense: 1493,
        defenseCoef: 263.2,
        comment: "",
        img: "B-guaiwutouxiang-melchizedek.png"
    },
    {
        id: 111,
        isSea: true,
        name: "청룡",
        icon: "../img/boss/청룡.webp",
        description: "전투 진입 시 [청룡의 인갑] 2중첩 획득\n- 턴 마다 [청룡의 인갑] 1중첩 회복\n- 중첩마다 최종 대미지 10% 감면\n- 약점 대미지 받으면 1중첩 제거\n- [청룡의 인갑] 모두 제거 시 모든 괴도가 [청룡의 힘]을 얻고 최종 대미지 증가",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "null",
            ice: "내",
            electric: "null",
            wind: "내",
            think: "null",
            pit: "약",
            blessing: "내",
            curse: "null"
        },
        baseDefense: 213,
        defenseCoef: 263.2,
        comment: "",
        img: "B-guaiwutouxiang-seiryu.png"
    },
    {
        id: 8,
        isSea: false,
        name: "비슈누",
        icon: "",
        description: "화신 4개 소환해 [생명 연결] 상태\n[생명 연결] : 현재 생명 비율에 따라 받는 대미지 분배",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "약",
            ice: "내",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "내",
            blessing: "null",
            curse: "null"
        },
        baseDefense: "821",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-vishnu.png"
    },
    {
        id: 9,
        isSea: false,
        name: "비슈누 / 화신",
        name_en: "비슈누 / Mini",
        name_jp: "비슈누 / 化身",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "약",
            ice: "내",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "내",
            blessing: "null",
            curse: "null"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-vishnu.png"

    },
    {
        id: 10,
        isSea: false,
        name: "바알",
        name_en: "Baal",
        name_jp: "バアル",
        icon: "",
        description: "스킬 대미지 또는 디버프를 받을 때마다 [쇠퇴] 중첩\n[쇠퇴] : 3턴 동안 방어력 3% 감소 (최대 15중첩, 45%)\n\n차지 이후 다음 턴 스킬 '마이무르' (단일 딜) 발동,\n[쇠퇴] 10 중첩 이상 시에 차지는 중단되고 '참격'으로 스킬 변경\n공격은 지배, 반항 괴도 우선",
        resistances: {
            physics: "약",
            shoot: "null",
            fire: "내",
            ice: "null",
            electric: "null",
            wind: "내",
            think: "null",
            pit: "내",
            blessing: "내",
            curse: "null"
        },
        baseDefense: "1280",
        defenseCoef: "258.4",
        comment: "아야카/리코/후타바 파티 구성이 가능할 경우 카스미 채용",
        img: "B-guaiwutouxiang-baal.png"
    },
    {
        id: 11,
        isSea: false,
        name: "위타천",
        name_en: "Kartikeya",
        name_jp: "カルティケーヤ",
        icon: "",
        description: "가루다'와  '자타유'가 대미지를 받을 때마다\n→ 3턴 동안 해당 괴도의 주는 대미지 4% 증가 (5회 중첩 가능)\n\n'호루스'와 '야타가라스'가 대미지를 받을 때마다\n→ 3턴 동안 해당 괴도의 관통이 2% 증가 (5회 중첩 가능)",
        resistances: {
            physics: "내",
            shoot: "내",
            fire: "null",
            ice: "null",
            electric: "내",
            wind: "null",
            think: "약",
            pit: "null",
            blessing: "내",
            curse: "null"
        },
        baseDefense: "669",
        defenseCoef: "258.4",
        comment: "아야카/리코/후타바 파티 구성이 가능할 경우 조커 채용",
        img: "B-guaiwutouxiang-kartikeya.png"
    },
    {
        id: 12,
        isSea: false,
        name: "위타천 / 가루다",
        name_en: "Kartikeya / 가루다",
        name_jp: "カルティケーヤ / 가루다",
        icon: "",
        description: "-",
        resistances: {
            physics: "내",
            shoot: "null",
            fire: "null",
            ice: "null",
            electric: "null",
            wind: "내",
            think: "약",
            pit: "null",
            blessing: "null",
            curse: "null"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-garuda.png"
    },
    {
        id: 13,
        isSea: false,
        name: "위타천 / 자타유",
        name_en: "Kartikeya / 자타유",
        name_jp: "カルティケーヤ / 자타유",
        icon: "",
        description: "-",
        resistances: {
            physics: "내",
            shoot: "null",
            fire: "null",
            ice: "null",
            electric: "null",
            wind: "내",
            think: "약",
            pit: "null",
            blessing: "내",
            curse: "null"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-jatayu.png"
    },
    {
        id: 14,
        isSea: false,
        name: "위타천 / 호루스",
        name_en: "Kartikeya / 호루스",
        name_jp: "カルティケーヤ / 호루스",
        icon: "",
        description: "-",
        resistances: {
            physics: "내",
            shoot: "null",
            fire: "null",
            ice: "null",
            wind: "내",
            electric: "null",
            think: "약",
            pit: "null",
            blessing: "내",
            curse: "null"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-horus.png"
    },
    {
        id: 15,
        isSea: false,
        name: "위타천 / 야타가라스",
        name_en: "Kartikeya / 야타가라스",
        name_jp: "カルティケーヤ / 야타가라스",
        icon: "",
        description: "-",
        resistances: {
            physics: "내",
            shoot: "null",
            fire: "null",
            ice: "null",
            electric: "null",
            wind: "내",
            think: "약",
            pit: "null",
            blessing: "내",
            curse: "null"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-yatagarasu.png"
    },
    {
        id: 16,
        isSea: false,
        name: "야츠카미즈오미츠누",
        name_en: "Yatsukamizu Omitsunu",
        name_jp: "オオミツヌ",
        icon: "",
        description: "페르소나/HIGHLIGHT/추가 효과로 대미지를 받을 때마다\n3턴 동안 받는 해당 속성 대미지가 6% 증가 (8중첩 가능)",
        resistances: {
            physics: "내",
            shoot: "내",
            fire: "null",
            ice: "null",
            electric: "내",
            wind: "약",
            think: "null",
            pit: "null",
            blessing: "내",
            curse: "null"
        },
        baseDefense: "1280",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-oomitu.png"
    },
    {
        id: 17,
        isSea: false,
        name: "파프니르",
        name_en: "Fafnir",
        name_jp: "ファフニール",
        icon: "",
        description: "모든 괴도에게 [파프니르의 주원] 추가 (받는 대미지 20% 증가)\n- 괴도가 우월/구원/방위 유형 기술 사용 시 [파프니르의 주원] 해제\n- 디버프 해제 시 파프니르에게 [주원의 배반] 1중첩 부여\n  중첩당 방어력 12% 감소, 3중첩 시 받는 HL 대미지 30% 증가 (최대 3중첩)",
        resistances: {
            physics: "내",
            shoot: "내",
            fire: "내",
            ice: "null",
            electric: "내",
            wind: "null",
            think: "null",
            pit: "내",
            blessing: "약",
            curse: "null"
        },
        baseDefense: "1280",
        defenseCoef: "305.9",
        comment: "주원의 배반 36% +\n원더 [역장 36% + 비슈누 48% + 라쿤다 38.8%  + 스라오샤 25%] \n+ 주권여정 23%  + 후타바 [결심직책 10% + 1스 93.1%] \n= 방어력 감소 309.9% > 305.9%",
        img: "B-guaiwutouxiang-fafnir.png"
    },
    {
        id: 18,
        isSea: false,
        name: "마라",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "내",
            ice: "내",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "null",
            blessing: "내",
            curse: "내"
        },
        baseDefense: "821",
        defenseCoef: "258.4",
        comment: "페르소나 '요시츠네' 패시브 세팅 필요",
        img: "B-guaiwutouxiang-maara.png"
    },
    {
        id: 19,
        isSea: false,
        name: "마라 / 데카라비아",
        icon: "",
        description: "-",
        resistances: {
            physics: "약",
            shoot: "null",
            fire: "내",
            ice: "null",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "내",
            blessing: "null",
            curse: "내"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-decarabia.png"
    },
    {
        id: 20,
        isSea: false,
        name: "아타바크",
        name_en: "Atabaka",
        name_jp: "アタバク",
        icon: "",
        description: "-",
        resistances: {
            physics: "내",
            shoot: "내",
            fire: "내",
            ice: "null",
            electric: "약",
            wind: "null",
            think: "null",
            pit: "null",
            blessing: "null",
            curse: "내"
        },
        baseDefense: "1280",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-atabaku.png"
    },
    {
        id: 21,
        isSea: false,
        name: "야츠후사",
        name_en: "Yatsufusa",
        name_jp: "ヤツフサ",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "null",
            ice: "null",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "약",
            blessing: "null",
            curse: "null"
        },
        baseDefense: "1280",
        defenseCoef: "305.9",
        comment: "",
        img: "B-guaiwutouxiang-bafang.png"
    },
    {
        id: 22,
        isSea: false,
        name: "수르트",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "내",
            ice: "내",
            electric: "약",
            wind: "null",
            think: "null",
            pit: "내",
            blessing: "null",
            curse: "null"
        },
        baseDefense: "821",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-surtr.png"
    },
    {
        id: 23,
        isSea: false,
        name: "수르트 / 잭 오 랜턴",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "약",
            ice: "내",
            electric: "약",
            wind: "null",
            think: "약",
            pit: "null",
            blessing: "null",
            curse: "null"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-rantan.png"
    },
    {
        id: 24,
        isSea: false,
        name: "도미니온",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "null",
            ice: "null",
            electric: "내",
            wind: "null",
            think: "null",
            pit: "내",
            blessing: "내",
            curse: "약"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "야오링 1스 최대 58.5% + 마하라쿤다 27.1% + 천상의 별 22% = 107.6%\n\n다른 보스에 비해 기본 방어력이 낮아 방어 감소에 대한 DPS 증가량이 적은 편",
        img: "B-guaiwutouxiang-dominion.png"
    },
    {
        id: 25,
        isSea: false,
        name: "도미니온 / 아크엔젤",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "null",
            ice: "null",
            electric: "내",
            wind: "null",
            think: "null",
            pit: "null",
            blessing: "내",
            curse: "약"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-archangel.png"
    },
    {
        id: 26,
        isSea: false,
        name: "도미니온 / 프린시펄리티",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "null",
            ice: "내",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "null",
            blessing: "내",
            curse: "약"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-principality.png"
    },
    {
        id: 27,
        isSea: false,
        name: "도미니온 / 파워",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "null",
            ice: "null",
            electric: "null",
            wind: "내",
            think: "null",
            pit: "null",
            blessing: "내",
            curse: "약"
        },
        baseDefense: "182",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-power.png"
    },
    {
        id: 28,
        isSea: false,
        name: "도미니온 / 엔젤",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "null",
            ice: "null",
            electric: "내",
            wind: "null",
            think: "null",
            pit: "null",
            blessing: "내",
            curse: "약"
        },
        baseDefense: "182",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-angel.png"
    },
    {
        id: 29,
        isSea: false,
        name: "니드호그",
        name_en: "Nidhoggr",
        name_jp: "ニーズホッグ",
        icon: "",
        description: "니드호그와 뱀은「생명 연결」 상태\n「생명 연결」: 현재 생명 비율에 따라 받는 대미지 분배\n\n니드호그와 뱀이 스킬을 사용한 후, 모든 스킬 목표에게 「독소」 1중첩이 추가\n「독소」: 제거 불가, 중첩당 괴도가 턴 종료 시 일정 생명을 잃으며, 동시에 공격력이 10% 상승 (3회 중첩 가능).",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "내",
            ice: "null",
            electric: "내",
            wind: "내",
            think: "null",
            pit: "내",
            blessing: "약",
            curse: "내"
        },
        baseDefense: "669",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-nidhoggr.png"
    },
    {
        id: 30,
        isSea: false,
        name: "니드호그 / 유룽",
        name_en: "Nidhoggr / 유룽",
        name_jp: "ニーズホッグ / 유룽",
        icon: "",
        description: "-",
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: "",
        img: "B-guaiwutouxiang-yurung.png"
    }
    /*
    {
        id: 29,
        isSea: false,
        name: "니드호그 / 화염의 뱀",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "내",
            ice: "약",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "null",
            blessing: "약",
            curse: "null"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: ""
    },
    {
        id: 30,
        isSea: false,
        name: "니드호그 / 빙결의 뱀",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "약",
            ice: "내",
            electric: "null",
            wind: "null",
            think: "null",
            pit: "null",
            blessing: "약",
            curse: "null"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: ""
    },
    {
        id: 31,
        isSea: false,
        name: "니드호그 / 전격의 뱀",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "null",
            ice: "null",
            electric: "내",
            wind: "약",
            think: "null",
            pit: "null",
            blessing: "약",
            curse: "null"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: ""
    },
    {
        id: 32,
        isSea: false,
        name: "니드호그 / 질풍의 뱀",
        icon: "",
        description: "-",
        resistances: {
            physics: "null",
            shoot: "null",
            fire: "null",
            ice: "null",
            electric: "약",
            wind: "내",
            think: "null",
            pit: "null",
            blessing: "약",
            curse: "null"
        },
        baseDefense: "364",
        defenseCoef: "258.4",
        comment: ""
    }*/
];

