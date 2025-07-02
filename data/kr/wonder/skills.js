// 스킬 목록
const skillList = ["스킬1", "스킬2", "스킬3", "HIGHLIGHT","테우르기아", "총격", "근접", "방어", "ONE MORE", "아이템"];

// 페르소나 액티브 스킬 리스트
// "아기" : 1명의 적에게 공격력 106.2%의 화염 속성 대미지를 주고, 59.0%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.
// "아기라오" : 1명의 적에게 공격력 114.0%의 화염 속성 대미지를 주고, 63.3%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.


const personaSkillList = {
    // 화염 속성 스킬
    "아기": {
        name_jp: "アギ",
        description: "1명의 적에게 공격력 106.2%의 화염 속성 대미지를 주고, 59.0%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力106.2%の火炎属性ダメージを与える。59.0%の確率で敵を2ターンの間、炎上状態にする。",
        type: "공격",
        target: "단일",
        icon : "화염",
        effects: [
            {
                type: "대미지",
                element: "화염",
                power: 106.2,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "화상",
                chance: 59.0,
                duration: 2
            }
        ]
    },
    "아기라오": {
        name_jp: "アギラオ",
        description: "1명의 적에게 공격력 114.0%의 화염 속성 대미지를 주고, 63.3%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力114.0%の火炎属性ダメージを与える。63.3%の確率で敵を2ターンの間、炎上状態にする。",
        type: "공격",
        target: "단일",
        icon : "화염",
        effects: [
            {
                type: "대미지",
                element: "화염",
                power: 114.0,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "화상",
                chance: 63.3,
                duration: 2
            }
        ]
    },
    "아기다인": {
        name_jp: "アギダイン",
        description: "1명의 적에게 공격력 121.7%의 화염 속성 대미지를 주고, 67.6%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力121.7%の火炎属性ダメージを与える。67.6%の確率で敵を2ターンの間、炎上状態にする。",
        type: "공격",
        target: "단일",
        icon : "화염",
        effects: [
            {
                type: "대미지",
                element: "화염",
                power: 121.7,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "화상",
                chance: 67.6,
                duration: 2
            }
        ]
    },
    "마하라기": {
        name_jp: "マハラギ",
        description: "모든 적에게 공격력 53.1%의 화염 속성 대미지를 주고, 29.5%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力53.1%の火炎属性ダメージを与える。29.5%の確率で敵を2ターンの間、炎上状態にする。",
        type: "공격",
        target: "전체",
        icon : "화염광역",
        effects: [
            {
                type: "대미지",
                element: "화염",
                power: 53.1,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "화상",
                chance: 29.5,
                duration: 2
            }
        ]
    },
    "마하라기온": {
        name_jp: "マハラギオン",
        description: "모든 적에게 공격력 57.0%의 화염 속성 대미지를 주고, 31.7%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力57.0%の火炎属性ダメージを与える。31.7%の確率で敵を2ターンの間、炎上状態にする。",
        type: "공격",
        target: "전체",
        icon : "화염광역",
        effects: [
            {
                type: "대미지",
                element: "화염",
                power: 57.0,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "화상",
                chance: 31.7,
                duration: 2
            }
        ]
    },
    "마하라기다인": {
        name_jp: "マハラギダイン",
        description: "모든 적에게 공격력 60.8%의 화염 속성 대미지를 주고, 33.8%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力60.8%の火炎属性ダメージを与える。33.8%の確率で敵を2ターンの間、炎上状態にする。",
        type: "공격",
        target: "전체",
        icon : "화염광역",
        effects: [
            {
                type: "대미지",
                element: "화염",
                power: 60.8,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "화상",
                chance: 33.8,
                duration: 2
            }
        ]
    },

    // 빙결 속성 스킬
    "부흐": {
        name_jp: "ブフ",
        description: "1명의 적에게 공격력 106.2%의 빙결 속성 대미지를 주고, 59.0%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力106.2%の氷結属性ダメージを与える。59.0%の確率で敵を2ターンの間、凍結状態にする。",
        type: "공격",
        target: "단일",
        icon : "빙결",
        effects: [
            {
                type: "대미지",
                element: "빙결",
                power: 106.2,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "동결",
                chance: 59.0,
                duration: 2
            }
        ]
    },
    "부흐라": {
        name_jp: "ブフーラ",
        description: "1명의 적에게 공격력 114.0%의 빙결 속성 대미지를 주고, 63.3%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力114.0%の氷結属性ダメージを与える。63.3%の確率で敵を2ターンの間、凍結状態にする。",
        type: "공격",
        target: "단일",
        icon : "빙결",
        effects: [
            {
                type: "대미지",
                element: "빙결",
                power: 114.0,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "동결",
                chance: 63.3,
                duration: 2
            }
        ]
    },
    "부흐다인": {
        name_jp: "ブフダイン",
        description: "1명의 적에게 공격력 121.7%의 빙결 속성 대미지를 주고, 67.6%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力121.7%の氷結属性ダメージを与える。67.6%の確率で敵を2ターンの間、凍結状態にする。",
        type: "공격",
        target: "단일",
        icon : "빙결",
        effects: [
            {
                type: "대미지",
                element: "빙결",
                power: 121.7,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "동결",
                chance: 67.6,
                duration: 2
            }
        ]
    },
    "다이아의 별": {
        name_jp: "ダイアモンドダスト",
        description: "1명의 적에게 공격력 129.5%의 빙결 속성 대미지를 주고, 72.0%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力129.5％の氷結属性ダメージを与える。72.0％の確率で敵を2ターンの間、凍結状態にする。",
        type: "공격",
        target: "단일",
        icon : "빙결",
        effects: [
            {
                type: "대미지",
                element: "빙결",
                power: 129.5,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "동결",
                chance: 72.0,
                duration: 2
            }
        ]
    },
    "마하부흐": {
        name_jp: "マハブフ",
        description: "모든 적에게 공격력 53.1%의 빙결 속성 대미지를 주고, 29.5%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力53.1%の氷結属性ダメージを与える。29.5%の確率で敵を2ターンの間、凍結状態にする。",
        type: "공격",
        target: "전체",
        icon : "빙결광역",
        effects: [
            {
                type: "대미지",
                element: "빙결",
                power: 53.1,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "동결",
                chance: 29.5,
                duration: 2
            }
        ]
    },
    "마하부흐라": {
        name_jp: "マハブフーラ",
        description: "모든 적에게 공격력 57.0%의 빙결 속성 대미지를 주고, 31.7%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力57.0%の氷結属性ダメージを与える。31.7%の確率で敵を2ターンの間、凍結状態にする。",
        type: "공격",
        target: "전체",
        icon : "빙결광역",
        effects: [
            {
                type: "대미지",
                element: "빙결",
                power: 57.0,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "동결",
                chance: 31.7,
                duration: 2
            }
        ]
    },
    "마하부흐다인": {
        name_jp: "マハブフダイン",
        description: "모든 적에게 공격력 60.8%의 빙결 속성 대미지를 주고, 33.8%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力60.8%の氷結属性ダメージを与える。33.8%の確率で敵を2ターンの間、凍結状態にする。",
        type: "공격",
        target: "전체",
        icon : "빙결광역",
        effects: [
            {
                type: "대미지",
                element: "빙결",
                power: 60.8,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "동결",
                chance: 33.8,
                duration: 2
            }
        ]
    },

    // 전격 속성 스킬
    "지오": {
        name_jp: "ジオ",
        description: "1명의 적에게 공격력 106.2%의 전격 속성 대미지를 주고, 59.0%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力106.2%の電撃属性ダメージを与える。59.0%の確率で敵を2ターンの間、感電状態にする。",
        type: "공격",
        target: "단일",
        icon : "전격",
        effects: [
            {
                type: "대미지",
                element: "전격",
                power: 106.2,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "감전",
                chance: 59.0,
                duration: 2
            }
        ]
    },
    "지온가": {
        name_jp: "ジオンガ",
        description: "1명의 적에게 공격력 114.0%의 전격 속성 대미지를 주고, 63.3%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力114.0%の電撃属性ダメージを与える。63.3%の確률で敵を2ターンの間、感電状態にする。",
        type: "공격",
        target: "단일",
        icon : "전격",
        effects: [
            {
                type: "대미지",
                element: "전격",
                power: 114.0,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "감전",
                chance: 63.3,
                duration: 2
            }
        ]
    },
    "지오다인": {
        name_jp: "ジオダイン",
        description: "1명의 적에게 공격력 121.7%의 전격 속성 대미지를 주고, 67.6%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力121.7%の電撃属性ダメージを与える。67.6%の確率で敵を2ターンの間、感電状態にする。",
        type: "공격",
        target: "단일",
        icon : "전격",
        effects: [
            {
                type: "대미지",
                element: "전격",
                power: 121.7,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "감전",
                chance: 67.6,
                duration: 2
            }
        ]
    },
    "마하지온가": {
        name_jp: "マハジオンガ",
        description: "모든 적에게 공격력 57.0%의 전격 속성 대미지를 주고, 31.7%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力57.0%の電撃属性ダメージを与える。31.7%の確率で敵を2ターンの間、感電状態にする。",
        type: "공격",
        target: "전체",
        icon : "전격광역",
        effects: [
            {
                type: "대미지",
                element: "전격",
                power: 57.0,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "감전",
                chance: 31.7,
                duration: 2
            }
        ]
    },
    "마하지오다인": {
        name_jp: "マハジオダイン",
        description: "모든 적에게 공격력 60.8%의 전격 속성 대미지를 주고, 33.8%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力60.8%の電撃属性ダメージを与える。33.8%の確률で敵を2ターンの間、감電状態にする。",
        type: "공격",
        target: "전체",
        icon : "전격광역",
        effects: [
            {
                type: "대미지",
                element: "전격",
                power: 60.8,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "감전",
                chance: 33.8,
                duration: 2
            }
        ]
    },
    "엘 지하드": {
        name_jp: "エル・ジハード",
        description: "모든 적에게 공격력 64.8%의 전격 속성 대미지를 주고, 36.0%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力64.8％の電撃属性ダメージを与える。36.0％の確率で敵を2ターンの間、感電状態にする。",
        type: "공격",
        target: "전체",
        icon : "전격광역",
        effects: [
            {
                type: "대미지",
                element: "전격",
                power: 64.8,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "감전",
                chance: 36.0,
                duration: 2
            }
        ]
    },

    // 질풍 속성 스킬
    "갈": {
        name_jp: "ガル",
        description: "1명의 적에게 공격력 106.2%의 질풍 속성 대미지를 주고, 59.0%의 기본 확률로 적을 2턴 동안 풍습 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力106.2%の疾風属性ダメージを与える。59.0%の確率で敵を2ターンの間、風襲状態にする。",
        type: "공격",
        target: "단일",
        icon : "질풍",
        effects: [
            {
                type: "대미지",
                element: "질풍",
                power: 106.2,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "풍습",
                chance: 59.0,
                duration: 2
            }
        ]
    },
    "갈라": {
        name_jp: "ガルーラ",
        description: "1명의 적에게 공격력 114.0%의 질풍 속성 대미지를 주고, 63.3%의 기본 확률로 적을 2턴 동안 풍습 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力114.0%の疾風属性ダメージを与える。63.3%の確률で敵を2ターンの間、風襲状態にする。",
        type: "공격",
        target: "단일",
        icon : "질풍",
        effects: [
            {
                type: "대미지",
                element: "질풍",
                power: 114.0,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "풍습",
                chance: 63.3,
                duration: 2
            }
        ]
    },
    "갈다인": {
        name_jp: "ガルダイン",
        description: "1명의 적에게 공격력 121.7%의 질풍 속성 대미지를 주고, 67.6%의 기본 확률로 적을 2턴 동안 풍습 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力121.7%の疾風属性ダメージを与える。67.6%の確率で敵を2ターンの間、風襲状態にする。",
        type: "공격",
        target: "단일",
        icon : "질풍",
        effects: [
            {
                type: "대미지",
                element: "질풍",
                power: 121.7,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "풍습",
                chance: 67.6,
                duration: 2
            }
        ]
    },
    "마하갈라": {
        name_jp: "マハガルーラ",
        description: "모든 적에게 공격력 57.0%의 질풍 속성 대미지를 주고, 31.7%의 기본 확률로 적을 2턴 동안 풍습 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力57.0%の疾風属性ダメージを与える。31.7%の確率で敵を2ターンの間、風襲状態にする。",
        type: "공격",
        target: "전체",
        icon : "질풍광역",
        effects: [
            {
                type: "대미지",
                element: "질풍",
                power: 57.0,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "풍습",
                chance: 31.7,
                duration: 2
            }
        ]
    },
    "마하갈다인": {
        name_jp: "マハガルダイン",
        description: "모든 적에게 공격력 60.8%의 질풍 속성 대미지를 주고, 33.8%의 기본 확률로 적을 2턴 동안 풍습 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力60.8%の疾風属性ダメージを与える。33.8%の確률で敵を2ターンの間、風襲状態にする。",
        type: "공격",
        target: "전체",
        icon : "질풍광역",
        effects: [
            {
                type: "대미지",
                element: "질풍",
                power: 60.8,
                scale: "공격력"
            },
            {
                type: "원소이상",
                status: "풍습",
                chance: 33.8,
                duration: 2
            }
        ]
    },

    // 염동 속성 스킬
    "사이오": {
        name_jp: "サイオ",
        description: "1명의 적에게 공격력 122.0%의 염동 속성 대미지를 주고, 정신 이상 상태의 적은 TECHNICAL을 주고 스킬 대미지는 40% 증가한다.",
        description_jp: "敵単体に攻撃力122.0%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが40%上昇する。",
        type: "공격",
        target: "단일",
        icon : "염동",
        effects: [
            {
                type: "대미지",
                element: "염동",
                power: 122.0,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "정신이상",
                damageIncrease: 40
            }
        ]
    },
    "사이다인": {
        name_jp: "サイダイン",
        description: "1명의 적에게 공격력 130.5%의 염동 속성 대미지를 주고, 정신 이상 상태의 적은 TECHNICAL을 주고 스킬 대미지는 45% 증가한다.",
        description_jp: "敵単体に攻撃力130.5%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが45%上昇する。",
        type: "공격",
        target: "단일",
        icon : "염동",
        effects: [
            {
                type: "대미지",
                element: "염동",
                power: 130.5,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "정신이상",
                damageIncrease: 45
            }
        ]
    },
    "사이코키네시스": {
        name_jp: "サイコキネシス",
        description: "1명의 적에게 공격력 138.9%의 염동 속성 대미지를 주고, 정신 이상 상태의 적은 TECHNICAL을 주고 스킬 대미지는 50% 증가한다.",
        description_jp: "敵単体に攻撃力138.9%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが50%上昇する。",
        type: "공격",
        target: "단일",
        icon : "염동",
        effects: [
            {
                type: "대미지",
                element: "염동",
                power: 138.9,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "정신이상",
                damageIncrease: 50
            }
        ]
    },
    "마하사이": {
        name_jp: "マハサイ",
        description: "모든 적에게 공격력 61.4%의 염동 속성 대미지를 주고, 정신 이상 상태의 적은 TECHNICAL을 주고 스킬 대미지는 35% 증가한다.",
        description_jp: "敵全体に攻撃力61.4%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが35%上昇する。",
        type: "공격",
        target: "전체",
        icon : "염동광역",
        effects: [
            {
                type: "대미지",
                element: "염동",
                power: 61.4,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "정신이상",
                damageIncrease: 35
            }
        ]
    },
    "마하사이오": {
        name_jp: "マハサイオ",
        description: "모든 적에게 공격력 66.4%의 염동 속성 대미지를 주고, 정신 이상 상태의 적은 TECHNICAL을 주고 스킬 대미지는 40% 증가한다.",
        description_jp: "敵全体に攻撃力66.4%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが40%上昇する。",
        type: "공격",
        target: "전체",
        icon : "염동광역",
        effects: [
            {
                type: "대미지",
                element: "염동",
                power: 66.4,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "정신이상",
                damageIncrease: 40
            }
        ]
    },
    "마하사이다인": {
        name_jp: "マハサイダイン",
        description: "모든 적에게 공격력 72.3%의 염동 속성 대미지를 주고, 정신 이상 상태의 적은 TECHNICAL을 주고 스킬 대미지는 45% 증가한다.",
        description_jp: "敵全体に攻撃力72.3%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが45%上昇する。",
        type: "공격",
        target: "전체",
        icon : "염동광역",
        effects: [
            {
                type: "대미지",
                element: "염동",
                power: 72.3,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "정신이상",
                damageIncrease: 45
            }
        ]
    },
    "사이코 포스": {
        name_jp: "サイコフォース",
        description: "모든 적에게 공격력 77.1%의 염동 속성 대미지를 주고, 정신 이상 상태의 적은 TECHNICAL을 주고 스킬 대미지는 50% 증가한다.",
        description_jp: "敵全体に攻撃力77.1％の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが50％上昇する。",
        type: "공격",
        target: "전체",
        icon : "염동광역",
        effects: [
            {
                type: "대미지",
                element: "염동",
                power: 77.1,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "정신이상",
                damageIncrease: 50
            }
        ]
    },


    //핵열 속성 스킬
    "프레이": {
        name_jp: "フレイ",
        description: "1명의 적에게 공격력 114.8%의 핵열 속성 대미지를 주고, 원소 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 16% 증가한다.",
        description_jp: "敵単体に攻撃力114.8%の核熱属性ダメージを与える。属性異常の敵に対してテクニカルが発生しダメージが16%上昇する。",
        type: "공격",
        target: "단일",
        icon : "핵열",
        effects: [
            {
                type: "대미지",
                element: "핵열",
                power: 114.8,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "원소이상",
                damageIncrease: 16
            }
        ]
    },
    "프레이라": {
        name_jp: "フレイラ",
        description: "1명의 적에게 공격력 124.2%의 핵열 속성 대미지를 주고, 원소 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 18% 증가한다.",
        description_jp: "敵単体に攻撃力124.2%の核熱属性ダメージを与える。属性異常の敵に対してテクニカルが発生しダメージが18%上昇する。",
        type: "공격",
        target: "단일",
        icon : "핵열",
        effects: [
            {
                type: "대미지",
                element: "핵열",
                power: 124.2,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "원소이상",
                damageIncrease: 18
            }
        ]
    },
    "마하프레이라": {
        name_jp: "マハフレイラ",
        description: "모든 적에게 공격력 61.8%의 핵열 속성 대미지를 주고, 원소 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 18% 증가한다.",
        description_jp: "敵全体に攻撃力61.8%の核熱属性ダメージを与える。属性異常の敵に対してテクニカルが発生しダメージが18%上昇する。",
        type: "공격",
        target: "전체",
        icon : "핵열광역",
        effects: [
            {
                type: "대미지",
                element: "핵열",
                power: 61.8,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "원소이상",
                damageIncrease: 18
            }
        ]
    },
    "코즈믹 플레어": {
        name_jp: "コズミックフレア",
        description: "모든 적에게 공격력 71.1%의 핵열 속성 대미지를 주고, 원소 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 22% 증가한다.",
        description_jp: "敵全体に攻撃力71.1％の核熱属性ダメージを与える。属性異常の敵に対してテクニカルが発生しダメージが22％上昇する。",
        type: "공격",
        target: "전체",
        icon : "핵열광역",
        effects: [
            {
                type: "대미지",
                element: "핵열",
                power: 71.1,
                scale: "공격력"
            },
            {
                type: "technical",
                condition: "원소이상",
                damageIncrease: 22
            }
        ]
    },
    
    // 축복 속성 스킬

    "코우가": {
        name_jp: "コウガ",
        description: "1명의 적에게 공격력 123.2%의 축복 속성 대미지를 주고, 자신은 축복 효과 1~2개를 획득한다.",
        description_jp: "敵単体に攻撃力123.2%の祝福属性ダメージを与える。自身に1〜2つの祝印を獲得する。",
        type: "공격",
        target: "단일",
        icon : "축복",
        effects: [
            {
                type: "대미지",
                element: "축복",
                power: 123.2,
                scale: "공격력"
            },
            {
                type: "버프",
                target: "자신",
                effect: "축복",
                count: "1-2"
            }
        ]
    },
    "코우가온": {
        name_jp: "コウガオン",
        description: "1명의 적에게 공격력 130.8%의 축복 속성 대미지를 주고, 자신은 축복 효과 1~2개를 획득한다.",
        description_jp: "敵単体に攻撃力130.8%の祝福属性ダメージを与える。自身に1〜2つの祝印を獲得する。",
        type: "공격",
        target: "단일",
        icon : "축복",
        effects: [
            {
                type: "대미지",
                element: "축복",
                power: 130.8,
                scale: "공격력"
            },
            {
                type: "버프",
                target: "자신",
                effect: "축복",
                count: "1-2"
            }
        ]
    },
    "신의 심판": {
        name_jp: "神の審判",
        description: "1명의 적에게 공격력 140.0%의 축복 속성 대미지를 주고, 자신은 축복 효과 2개를 획득한다.",
        description_jp: "敵単体に攻撃力140.0％の祝福属性ダメージを与える。自身に2つの祝印を獲得する。",
        type: "공격",
        target: "단일",
        icon : "축복",
        effects: [
            {
                type: "대미지",
                element: "축복",
                power: 140.0,
                scale: "공격력"
            },
            {
                type: "버프",
                target: "자신",
                effect: "축복",
                count: 2
            }
        ]
    },
    "마하코우하": {
        name_jp: "マハコウハ",
        description: "모든 적에게 공격력 57.6%의 축복 속성 대미지를 주고, 자신은 축복 효과 0~1개를 획득한다.",
        description_jp: "敵全体に攻撃力57.6%の祝福属性ダメージを与える。自身に0〜1つの祝印を獲得する。",
        type: "공격",
        target: "전체",
        icon : "축복광역",
        effects: [
            {
                type: "대미지",
                element: "축복",
                power: 57.6,
                scale: "공격력"
            },
            {
                type: "버프",
                target: "자신",
                effect: "축복",
                count: "0-1"
            }
        ]
    },
    "마하코우가": {
        name_jp: "マハコウガ",
        description: "모든 적에게 공격력 61.3%의 축복 속성 대미지를 주고, 자신은 축복 효과 1~2개를 획득한다.",
        description_jp: "敵全体に攻撃力61.3%の祝福属性ダメージを与える。自身に1〜2つの祝印を獲得する。",
        type: "공격",
        target: "전체",
        icon : "축복광역",
        effects: [
            {
                type: "대미지",
                element: "축복",
                power: 61.3,
                scale: "공격력"
            },
            {
                type: "버프",
                target: "자신",
                effect: "축복",
                count: "1-2"
            }
        ]
    },
    "마하코우가온": {
        name_jp: "マハコウガオン",
        description: "모든 적에게 공격력 65.8%의 축복 속성 대미지를 주고, 자신은 축복 효과 1~2개를 획득한다.",
        description_jp: "敵全体に攻撃力65.8%の祝福属性ダメージを与える。自身に1〜2つの祝印を獲得する。",
        type: "공격",
        target: "전체",
        icon : "축복광역",
        effects: [
            {
                type: "대미지",
                element: "축복",
                power: 65.8,
                scale: "공격력"
            },
            {
                type: "버프",
                target: "자신",
                effect: "축복",
                count: "1-2"
            }
        ]
    },
    "하마온": {
        name_jp: "ハマオン",
        description: "1명의 적에게 공격력 90.6%의 축복 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률로 축복 속성 즉사 효과를 부여하며 생명이 낮을수록 확률이 높아진다.",
        description_jp: "敵単体に攻撃力90.6%の祝福属性ダメージを与える。HP 50%以下の敵に低確率で祝福属性の即死効果を与える。敵のHPが低いほど確률が上がる。",
        type: "공격",
        target: "단일",
        icon : "축복",
        effects: [
            {
                type: "대미지",
                element: "축복",
                power: 90.6,
                scale: "공격력"
            },
            {
                type: "즉사",
                element: "축복",
                condition: "HP50%이하",
                variableChance: true
            }
        ]
    },
    "마한마": {
        name_jp: "マハンマ",
        description: "모든 적에게 39.9%의 축복 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률로 축복 속성 즉사 효과를 부여하며 생명이 낮을수록 확률이 높아진다.",
        description_jp: "敵全体に攻撃力39.9%の祝福属性ダメージを与える。HP 50%以下の敵に低確率で祝福属性の即死効果を与える。敵のHPが低いほど確률が上がる。",
        type: "공격",
        target: "전체",
        icon : "축복광역",
        effects: [
            {
                type: "대미지",
                element: "축복",
                power: 39.9,
                scale: "공격력"
            },
            {
                type: "즉사",
                element: "축복",
                condition: "HP50%이하",
                variableChance: true
            }
        ]
    },
    "마한마온": {
        name_jp: "マハンマオン",
        description: "모든 적에게 45.0%의 축복 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률로 축복 속성 즉사 효과를 부여하며 생명이 낮을수록 확률이 높아진다.",
        description_jp: "敵全体に攻撃力45.0%の祝福属性ダメージを与える。HP 50%以下の敵に低確率で祝福属性の即死効果を与える。敵のHPが低いほど確률が上がる。",
        type: "공격",
        target: "전체",
        icon : "축복광역",
        effects: [
            {
                type: "대미지",
                element: "축복",
                power: 45.0,
                scale: "공격력"
            },
            {
                type: "즉사",
                element: "축복",
                condition: "HP50%이하",
                variableChance: true
            }
        ]
    },
    "에이가온": {
        name_jp: "エイガオン",
        description: "1명의 적에게 공격력 132.5%의 주원 속성 대미지를 주고, 적이 주원 효과 1~2개를 획득한다.",
        description_jp: "敵単体に攻撃力132.5%の呪怨属性ダメージを与える。敵に1〜2つの呪印を付与する。",
        type: "공격",
        target: "단일",
        icon : "주원",
        effects: [
            {
                type: "대미지",
                element: "주원",
                power: 132.5,
                scale: "공격력"
            },
            {
                type: "디버프",
                target: "적",
                effect: "주원",
                count: "1-2"
            }
        ]
    },
    "악마의 심판": {
        name_jp: "悪魔の審判",
        description: "1명의 적에게 공격력 142.5%의 주원 속성 대미지를 주고, 적이 주원 효과 2개를 획득한다.",
        description_jp: "敵単体に攻撃力142.5％の呪怨属性ダメージを与える。敵に2つの呪印を付与する。",
        type: "공격",
        target: "단일",
        icon : "주원",
        effects: [
            {
                type: "대미지",
                element: "주원",
                power: 142.5,
                scale: "공격력"
            },
            {
                type: "디버프",
                target: "적",
                effect: "주원",
                count: 2
            }
        ]
    },
    "마하에이가": {
        name_jp: "マハエイガ",
        description: "모든 적에게 공격력 61.8%의 주원 속성 대미지를 주고, 일정 확률로 적에게 주원 효과 1개를 추가한다.",
        description_jp: "敵全体に攻撃力61.8%の呪怨属性ダメージを与える。一定の確率で敵に1つの呪印を付与する。",
        type: "공격",
        target: "전체",
        icon : "주원광역",
        effects: [
            {
                type: "대미지",
                element: "주원",
                power: 61.8,
                scale: "공격력"
            },
            {
                type: "디버프",
                target: "적",
                effect: "주원",
                count: 1,
                chance: true
            }
        ]
    },
    "마하에이가온": {
        name_jp: "マハエイガオン",
        description: "모든 적에게 공격력 66.5%의 주원 속성 대미지를 주고, 일정 확률로 적에게 주원 효과 1개를 추가한다.",
        description_jp: "敵全体に攻撃力66.5%の呪怨属性ダメージを与える。一定の確率で敵に1つの呪印を付与する。",
        type: "공격",
        target: "전체",
        icon : "주원광역",
        effects: [
            {
                type: "대미지",
                element: "주원",
                power: 66.5,
                scale: "공격력"
            },
            {
                type: "디버프",
                target: "적",
                effect: "주원",
                count: 1,
                chance: true
            }
        ]
    },
    "연옥의 날개": {
        name_jp: "煉獄の翼",
        description: "모든 적에게 공격력 71.0%의 주원 속성 대미지를 주고, 적에게 주원 효과 1개를 추가한다.",
        description_jp: "敵全体に攻撃力71.0%の呪怨属性ダメージを与える。敵に1つの呪印を付与する。",
        type: "공격",
        target: "전체",
        icon : "주원광역",
        effects: [
            {
                type: "대미지",
                element: "주원",
                power: 71.0,
                scale: "공격력"
            },
            {
                type: "디버프",
                target: "적",
                effect: "주원",
                count: 1
            }
        ]
    },
    "무드": {
        name_jp: "ムド",
        description: "1명의 적에게 공격력 79.2%의 주원 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률로 주원 속성 즉사 효과를 부여하며 생명이 낮을수록 확률이 높아진다.",
        description_jp: "敵単体に攻撃力79.2%の呪怨属性ダメージを与える。HP 50%以下の敵に低確率で呪怨属性の即死効果を与える。敵のHPが低いほど確率が上がる。",
        type: "공격",
        target: "단일",
        icon : "주원",
        effects: [
            {
                type: "대미지",
                element: "주원",
                power: 79.2,
                scale: "공격력"
            },
            {
                type: "즉사",
                element: "주원",
                condition: "HP50%이하",
                variableChance: true
            }
        ]
    },
    "무드온": {
        name_jp: "ムドオン",
        description: "1명의 적에게 공격력 90.6%의 주원 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률로 주원 속성 즉사 효과를 부여하며 생명이 낮을수록 확률이 높아진다.",
        description_jp: "敵単体に攻撃力90.6%の呪怨属性ダメージを与える。HP 50%以下の敵に低確率で呪怨属性の即死効果を与える。敵のHPが低いほど確率が上がる。",
        type: "공격",
        target: "단일",
        icon : "주원",
        effects: [
            {
                type: "대미지",
                element: "주원",
                power: 90.6,
                scale: "공격력"
            },
            {
                type: "즉사",
                element: "주원",
                condition: "HP50%이하",
                variableChance: true
            }
        ]
    },
    "마하무드": {
        name_jp: "マハムド",
        description: "모든 적에게 39.9%의 주원 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률로 주원 속성 즉사 효과를 부여하며 생명이 낮을수록 확률이 높아진다.",
        description_jp: "敵全体に攻撃力39.9%の呪怨属性ダメージを与える。HP 50%以下の敵に低確率で呪怨属性の即死効果を与える。敵のHPが低いほど確률が上がる。",
        type: "공격",
        target: "전체",
        icon : "주원광역",
        effects: [
            {
                type: "대미지",
                element: "주원",
                power: 39.9,
                scale: "공격력"
            },
            {
                type: "즉사",
                element: "주원",
                condition: "HP50%이하",
                variableChance: true
            }
        ]
    },
    "메기도": {
        name_jp: "メギド",
        description: "1명의 적에게 공격력 81.4%의 만능 속성 대미지를 주고, 적의 방어력을 무시한다.",
        description_jp: "敵単体に攻撃力81.4%の万能属性ダメージを与える。敵の防御力を無視する。",
        type: "공격",
        target: "단일",
        icon : "만능",
        effects: [
            {
                type: "대미지",
                element: "만능",
                power: 81.4,
                scale: "공격력",
                ignoreDefense: true
            }
        ]
    },
    "마하메기도": {
        name_jp: "マハメギド",
        description: "모든 적에게 공격력 40.7%의 만능 속성 대미지를 주고, 적의 방어력을 무시한다.",
        description_jp: "敵全体に攻撃力40.7%の万能属性ダメージを与える。敵の防御力を無視する。",
        type: "공격",
        target: "전체",
        icon : "만능광역",
        effects: [
            {
                type: "대미지",
                element: "만능",
                power: 40.7,
                scale: "공격력",
                ignoreDefense: true
            }
        ]
    },
    "메기도라온": {
        name_jp: "メギドラオン",
        description: "모든 적에게 공격력 43.5%의 만능 속성 대미지를 주고, 적의 방어력을 무시한다.",
        description_jp: "敵全体に攻撃力43.5%の万能属性ダメージを与える。敵の防御力を無視する。",
        type: "공격",
        target: "전체",
        icon : "만능광역",
        effects: [
            {
                type: "대미지",
                element: "만능",
                power: 43.5,
                scale: "공격력",
                ignoreDefense: true
            }
        ]
    },
    "흡혈": {
        name_jp: "吸血",
        description: "1명의 적에게 공격력 41.4%의 만능 대미지를 주고 방어력을 무시하며, 자신은 생명을 공격력 41.4%만큼 회복한다.",
        description_jp: "敵単体に攻撃力41.4%の万能属性ダメージを与え、防御力を無視する。自身のHPを攻撃力41.4%分回復する。",
        type: "공격",
        target: "단일",
        icon : "만능",
        effects: [
            {
                type: "대미지",
                element: "만능",
                power: 41.4,
                scale: "공격력",
                ignoreDefense: true
            },
            {
                type: "회복",
                target: "자신",
                power: 41.4,
                scale: "공격력"
            }
        ]
    },
    "흡마": {
        name_jp: "吸魔",
        description: "적 1명의 SP 25포인트를 흡수한다.",
        description_jp: "敵単体のSP25ポイントを吸収する。",
        type: "지원",
        target: "단일",
        icon : "만능",
        effects: [
            {
                type: "SP흡수",
                amount: 25
            }
        ]
    },
    "돌격": {
        name_jp: "突撃",
        description: "1명의 적에게 공격력 116.4%의 물리 속성 대미지를 준다.",
        description_jp: "敵単体に攻撃力116.4%の物理属性ダメージを与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 116.4,
                scale: "공격력"
            }
        ]
    },
    "참격": {
        name_jp: "斬撃",
        description: "1명의 적에게 공격력 116.4%의 물리 속성 대미지를 준다.",
        description_jp: "敵単体に攻撃力116.4%の物理属性ダメージを与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 116.4,
                scale: "공격력"
            }
        ]
    },
    "빅 슬라이스": {
        name_jp: "ビッグスライス",
        description: "1명의 적에게 공격력 129.1%의 물리 속성 대미지를 준다.",
        description_jp: "敵単体に攻撃力129.1%の物理属性ダメージを与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 129.1,
                scale: "공격력"
            }
        ]
    },
    "궁서아": {
        name_jp: "弓射",
        description: "1명의 적에게 공격력 129.1%의 물리 속성 대미지를 준다.",
        description_jp: "敵単体に攻撃力129.1%の物理属性ダメージを与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 129.1,
                scale: "공격력"
            }
        ]
    },
    "이연아": {
        name_jp: "二連矢",
        description: "1명의 적에게 공격력 58.2%의 물리 속성 대미지를 2회 준다.",
        description_jp: "敵単体に攻撃力58.2%の物理属性ダメージを2回与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 58.2,
                scale: "공격력",
                hits: 2
            }
        ]
    },
    "어설트 다이브": {
        name_jp: "アサルトダイブ",
        description: "1명의 적에게 공격력 141.8%의 물리 속성 대미지를 준다.",
        description_jp: "敵単体に攻撃力141.8%の物理属性ダメージを与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 141.8,
                scale: "공격력"
            }
        ]
    },
    "럭키 펀치": {
        name_jp: "ラッキーパンチ",
        description: "1명의 적에게 공격력 108.3%의 물리 속성 대미지를 주고, 크리티컬 확률이 20% 증가하며 명중률은 20% 감소한다.",
        description_jp: "敵単体に攻撃力108.3%の物理属性ダメージを与える。クリティカル率が20%上昇し、命中率が20%低下する。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 108.3,
                scale: "공격력",
                critRate: 20,
                accuracy: -20
            }
        ]
    },
    "장대비 베기": {
        name_jp: "五月雨斬り",
        description: "1명의 적에게 공격력 36.9%의 물리 속성 대미지를 3~5회 준다.",
        description_jp: "敵単体に攻撃力36.9%の物理属性ダメージを3〜5回与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 36.9,
                scale: "공격력",
                hits: "3-5"
            }
        ]
    },
    "메가톤 레이드": {
        name_jp: "メガトンレイド",
        description: "1명의 적에게 공격력 141.8%의 물리 속성 대미지를 준다.",
        description_jp: "敵単体に攻撃力141.8%の物理属性ダメージを与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 141.8,
                scale: "공격력"
            }
        ]
    },
    "검의 춤": {
        name_jp: "剣の舞",
        description: "1명의 적에게 공격력 154.5%의 물리 속성 대미지를 준다.",
        description_jp: "敵単体に攻撃力154.5%の物理属性ダメージを与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 154.5,
                scale: "공격력"
            }
        ]
    },
    "브레이브 재퍼": {
        name_jp: "ブレイブザッパー",
        description: "1명의 적에게 공격력 154.5%의 물리 속성 대미지를 준다.",
        description_jp: "敵単体に攻撃力154.5%の物理属性ダメージを与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 154.5,
                scale: "공격력"
            }
        ]
    },
    "사망유희": {
        name_jp: "死亡遊戯",
        description: "1명의 적에게 공격력 154.5%의 물리 속성 대미지를 준다.",
        description_jp: "敵単体に攻撃力154.5%の物理属性ダメージを与える。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 154.5,
                scale: "공격력"
            }
        ]
    },
    "젠틀 펀치": {
        description: "1명의 적에게 공격력 108.3%의 물리 속성 대미지를 주고, 크리티컬 확률이 20% 증가하며 명중률은 20% 감소한다.",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 108.3,
                scale: "공격력",
                critRate: 20,
                accuracy: -20
            }
        ]
    },
    "전광석화": {
        name_jp: "電光石火",
        description: "모든 적에게 공격력 15.2%의 물리 속성 대미지를 3~4회 준다.",
        description_jp: "敵全体に攻撃力15.2%の物理属性ダメージを3〜4回与える。",
        type: "공격",
        target: "전체",
        icon : "물리광역",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 15.2,
                scale: "공격력",
                hits: "3-4"
            }
        ]
    },
    "난동 부리기": {
        description: "모든 적에게 공격력 30.0%의 물리 속성 대미지를 1~3회 준다.",
        type: "공격",
        target: "전체",
        icon : "물리광역",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 30.0,
                scale: "공격력",
                hits: "1-3"
            }
        ]
    },
    "히트 웨이브": {
        description: "모든 적에게 60.8%의 물리 속성 대미지를 준다.",
        type: "공격",
        target: "전체",
        icon : "물리광역",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 60.8,
                scale: "공격력"
            }
        ]
    },
    "데스바운드": {
        name_jp: "デスバウンド",
        description: "모든 적에게 공격력 40.6%의 물리 속성 대미지를 1~2회 준다.",
        description_jp: "敵全体に攻撃力40.6%の物理属性ダメージを1〜2回与える。",
        type: "공격",
        target: "전체",
        icon : "물리광역",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 40.6,
                scale: "공격력",
                hits: "1-2"
            }
        ]
    },
    "폴 다운": {
        description: "1명의 적에게 공격력 82.4%의 물리 속성 대미지를 주고, 2턴 동안 9.3%의 기본 확률로 적을 혼란 상태에 빠뜨린다.",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 82.4,
                scale: "공격력"
            },
            {
                type: "정신이상",
                status: "혼란",
                chance: 9.3,
                duration: 2
            }
        ]
    },
    "몽향침": {
        name_jp: "夢想針",
        description: "1명의 적에게 공격력 82.4%의 물리 속성 대미지를 주고, 2턴 동안 12.5%의 기본 확률로 적을 수면 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力82.4%の物理属性ダメージを与える。12.5%の確率で敵を2ターンの間、睡眠状態にする。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 82.4,
                scale: "공격력"
            },
            {
                type: "정신이상",
                status: "수면",
                chance: 12.5,
                duration: 2
            }
        ]
    },
    "망살 러시": {
        name_jp: "忘殺ラッシュ",
        description: "모든 적에게 공격력 40.8%의 물리 속성 대미지를 주고, 2턴 동안 6.7%의 기본 확률로 적을 망각 상태에 빠뜨린다.",
        description_jp: "敵全体に攻撃力40.8%の物理属性ダメージを与える。6.7%の確率で敵を2ターンの間、忘却状態にする。",
        type: "공격",
        target: "전체",
        icon : "물리광역",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 40.8,
                scale: "공격력"
            },
            {
                type: "정신이상",
                status: "망각",
                chance: 6.7,
                duration: 2
            }
        ]
    },
    "피의 축제": {
        description: "모든 적에게 공격력 40.8%의 물리 속성 대미지를 주고, 2턴 동안 2.6%의 기본 확률로 적을 공포 상태에 빠뜨린다.",
        type: "공격",
        target: "전체",
        icon : "물리광역",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 40.8,
                scale: "공격력"
            },
            {
                type: "정신이상",
                status: "공포",
                chance: 2.6,
                duration: 2
            }
        ]
    },
    "마인드 슬라이스": {
        description: "모든 적에게 공격력 40.8%의 물리 속성 대미지를 주고, 2턴 동안 3.4%의 기본 확률로 적을 혼란 상태에 빠뜨린다.",
        type: "공격",
        target: "전체",
        icon : "물리광역",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 40.8,
                scale: "공격력"
            },
            {
                type: "정신이상",
                status: "혼란",
                chance: 3.4,
                duration: 2
            }
        ]
    },
    "도르민 러시": {
        description: "모든 적에게 공격력 40.8%의 물리 속성 대미지를 주고, 2턴 동안 4.5%의 기본 확률로 적을 수면 상태에 빠뜨린다.",
        type: "공격",
        target: "전체",
        icon : "물리광역",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 40.8,
                scale: "공격력"
            },
            {
                type: "정신이상",
                status: "수면",
                chance: 4.5,
                duration: 2
            }
        ]
    },
    "박치기": {
        name_jp: "頭突き",
        description: "1명의 적에게 공격력 82.4%의 물리 속성 대미지를 주고, 2턴 동안 18.7%의 기본 확률로 적을 망각 상태에 빠뜨린다.",
        description_jp: "敵単体に攻撃力82.4%の物理属性ダメージを与える。18.7%の確率で敵を2ターンの間、忘却状態にする。",
        type: "공격",
        target: "단일",
        icon : "물리",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 82.4,
                scale: "공격력"
            },
            {
                type: "정신이상",
                status: "망각",
                chance: 18.7,
                duration: 2
            }
        ]
    },
    "브레인 버스터": {
        description: "모든 적에게 공격력 40.8%의 물리 속성 대미지를 주고, 2턴 동안 1.7%의 기본 확률로 적을 세뇌 상태에 빠뜨린다.",
        type: "공격",
        target: "전체",
        icon : "물리광역",
        effects: [
            {
                type: "대미지",
                element: "물리",
                power: 40.8,
                scale: "공격력"
            },
            {
                type: "정신이상",
                status: "세뇌",
                chance: 1.7,
                duration: 2
            }
        ]
    },
    "지탄": {
        name_jp: "狙撃",
        description: "1명의 적에게 공격력 92.2%의 총격 속성 대미지를 주고, 크리티컬 확률이 16% 증가한다.",
        description_jp: "敵単体に攻撃力92.2%の銃撃属性ダメージを与える。クリティカル率が16%上昇する。",
        type: "공격",
        target: "단일",
        icon : "총격",
        effects: [
            {
                type: "대미지",
                element: "총격",
                power: 92.2,
                scale: "공격력",
                critRate: 16
            }
        ]
    },
    "원 샷 킬": {
        name_jp: "ワンショットキル",
        description: "1명의 적에게 공격 포인트 107.5%의 총격 속성 대미지를 주고, 크리티컬 확률이 20% 증가한다.",
        description_jp: "敵単体に攻撃力107.5%の銃撃属性ダメージを与える。クリティカル率が20%上昇する。",
        type: "공격",
        target: "단일",
        icon : "총격",
        effects: [
            {
                type: "대미지",
                element: "총격",
                power: 107.5,
                scale: "공격력",
                critRate: 20
            }
        ]
    },
    "트리플 다운": {
        name_jp: "トリプルダウン",
        description: "모든 적에게 공격력 14.9%의 총격 속성 대미지를 3회 입히고, 크리티컬 확률이 16% 증가하며 명중률은 15% 감소한다.",
        description_jp: "敵全体に攻撃力14.9%の銃撃属性ダメージを3回与える。クリティカル率が16%上昇し、命中率が15%低下する。",
        type: "공격",
        target: "전체",
        icon : "총격광역",
        effects: [
            {
                type: "대미지",
                element: "총격",
                power: 14.9,
                scale: "공격력",
                hits: 3,
                critRate: 16,
                accuracy: -15
            }
        ]
    },
    "디아": {
        name_jp: "ディア",
        description: "동료 1명이 공격력 33.1%+1001의 생명을 회복한다.",
        description_jp: "味方単体のHPを攻撃力の33.1%+1001回復する。",
        type: "회복",
        target: "단일",
        icon : "치료",
        effects: [
            {
                type: "회복",
                power: 33.1,
                scale: "공격력",
                flat: 1001
            }
        ]
    },
    "디아라마": {
        name_jp: "ディアラマ",
        description: "동료 1명이 공격력 35.6%+1077의 생명을 회복한다.",
        description_jp: "味方単体のHPを攻撃力の35.6%+1077回復する。",
        type: "회복",
        target: "단일",
        icon : "치료",
        effects: [
            {
                type: "회복",
                power: 35.6,
                scale: "공격력",
                flat: 1077
            }
        ]
    },
    "메디아": {
        name_jp: "メディア",
        description: "모든 동료가 공격력 16.6%+502의 생명을 회복한다.",
        description_jp: "味方全体のHPを攻撃力の16.6%＋502回復する。",
        type: "회복",
        target: "전체",
        icon : "치료광역",
        effects: [
            {
                type: "회복",
                power: 16.6,
                scale: "공격력",
                flat: 502
            }
        ]
    },
    "메디라마": {
        name_jp: "メディラマ",
        description: "모든 동료가 공격력 17.8%+538의 생명을 회복한다.",
        description_jp: "味方全体のHPを攻撃力の17.8%+538回復する。",
        type: "회복",
        target: "전체",
        icon : "치료광역",
        effects: [
            {
                type: "회복",
                power: 17.8,
                scale: "공격력",
                flat: 538
            }
        ]
    },
    "메디아라한": {
        name_jp: "メディアラハン",
        description: "모든 동료가 공격력 19.0%+575의 생명을 회복한다.",
        description_jp: "味方全体のHPを攻撃力の19.0%+575回復する。",
        type: "회복",
        target: "전체",
        icon : "치료광역",
        effects: [
            {
                type: "회복",
                power: 19.0,
                scale: "공격력",
                flat: 575
            }
        ]
    },
    "우로스": {
        name_jp: "ウロス",
        description: "동료 1명의 공격력 25.7%+777의 생명을 회복하고, 원소 이상 효과 1개를 제거한다.",
        description_jp: "味方単体のHPを攻撃力の25.7%+777回復し、属性異常効果を1つ解除する。",
        type: "회복",
        target: "단일",
        icon : "치료",
        effects: [
            {
                type: "회복",
                power: 25.7,
                scale: "공격력",
                flat: 777
            },
            {
                type: "상태해제",
                category: "원소이상",
                count: 1
            }
        ]
    },
    "파트라": {
        name_jp: "パトラ",
        description: "동료 1명의 현기증, 수면, 망각 효과를 제거한다.",
        description_jp: "味方単体の目眩、睡眠、忘却効果を解除する。",
        type: "지원",
        target: "단일",
        icon : "치료",
        effects: [
            {
                type: "상태해제",
                status: ["현기증", "수면", "망각"]
            }
        ]
    },
    "바이스디": {
        name_jp: "バイスディ",
        description: "동료 1명의 화상, 동결, 감전, 풍습 효과를 제거한다.",
        description_jp: "味方単体の炎上、凍結、感電、風襲を治療する。",
        type: "지원",
        target: "단일",
        icon : "치료",
        effects: [
            {
                type: "상태해제",
                status: ["화상", "동결", "감전", "풍습"]
            }
        ]
    },
    "에너지 드롭": {
        name_jp: "エナジードロップ",
        description: "동료 1명의 혼란, 공포, 절망, 광노, 세뇌 효과를 제거한다.",
        description_jp: "味方単体の混乱・恐怖・絶望・激怒・洗脳状態を治療する。",
        type: "지원",
        target: "단일",
        icon : "치료",
        effects: [
            {
                type: "상태해제",
                status: ["혼란", "공포", "절망", "광노", "세뇌"]
            }
        ]
    },
    "데카쟈": {
        name_jp: "デカジャ",
        description: "모든 적의 속성 증가 효과 1개를 제거한다.",
        description_jp: "敵全体のステータス上昇効果を1つ解除する。",
        type: "지원",
        target: "전체",
        icon : "버프광역",
        effects: [
            {
                type: "버프해제",
                target: "적",
                category: "속성증가",
                count: 1
            }
        ]
    },
    "데쿤다": {
        name_jp: "デクンダ",
        description: "모든 동료의 속성 감소 효과를 1개 제거한다.",
        description_jp: "味方全体のステータス低下効果を1つ打ち消す。",
        type: "지원",
        target: "전체",
        icon : "버프",
        effects: [
            {
                type: "디버프해제",
                target: "아군",
                category: "속성감소",
                count: 1
            }
        ]
    },
    "타루카쟈": {
        name_jp: "タルカジャ",
        description: "동료 1명의 공격력이 15.5% 증가하고, 자신의 공격력 500포인트마다 1.3% 추가 증가한다. 상한은 10.4%이며, 효과는 3턴 동안 지속된다.",
        description_jp: "3ターンの間、味方単体の攻撃力が15.5%上昇する。自身の攻撃力500ごとに、味方の攻撃力がさらに1.3%上昇する（最大10.4%まで）。",
        type: "지원",
        target: "단일",
        icon : "버프",
        effects: [
            {
                type: "버프",
                stat: "공격력",
                baseValue: 15.5,
                scaleValue: 1.3,
                scalePer: 500,
                maxValue: 10.4,
                duration: 3
            }
        ]
    },
    "마하타루카쟈": {
        name_jp: "マハタルカジャ",
        description: "모든 동료의 공격력이 10.9% 증가하고, 자신의 공격력 500포인트마다 0.9% 추가 증가한다. 상한은 7.2%이며, 효과는 3턴 동안 지속된다.",
        description_jp: "3ターンの間、味方全体の攻撃力が10.9%上昇する。自身の攻撃力500ごとに、味方の攻撃力がさらに0.9%上昇する（最大7.2%まで）。",
        type: "지원",
        target: "전체",
        icon : "버프광역",
        effects: [
            {
                type: "버프",
                stat: "공격력",
                baseValue: 10.9,
                scaleValue: 0.9,
                scalePer: 500,
                maxValue: 7.2,
                duration: 3
            }
        ]
    },
    "라쿠카쟈": {
        name_jp: "ラクカジャ",
        description: "동료 1명의 방어력이 23.3% 증가하고, 자신의 방어력 500마다 3.9% 추가 증가한다. 상한은 15.6%이며, 효과는 3턴 동안 지속된다.",
        description_jp: "3ターンの間、味方単体の防御力が23.3%上昇する。自身の防御力500ごとに、味方の防御力がさらに3.9%上昇する（最大15.6%まで）。",
        type: "지원",
        target: "단일",
        icon : "버프",
        effects: [
            {
                type: "버프",
                stat: "방어력",
                baseValue: 23.3,
                scaleValue: 3.9,
                scalePer: 500,
                maxValue: 15.6,
                duration: 3
            }
        ]
    },
    "마하라쿠카쟈": {
        name_jp: "マハラクカジャ",
        description: "모든 동료의 방어력이 16.3% 증가하고, 자신의 방어력 500마다 2.7% 추가 증가한다. 상한은 10.8%이며, 효과는 3턴 동안 지속된다.",
        description_jp: "3ターンの間、味方全体の防御力が16.3%上昇する。自身の防御力500ごとに、味方の防御力がさらに2.7%上昇する（最大10.8%まで）。",
        type: "지원",
        target: "전체",
        icon : "버프광역",
        effects: [
            {
                type: "버프",
                stat: "방어력",
                baseValue: 16.3,
                scaleValue: 2.7,
                scalePer: 500,
                maxValue: 10.8,
                duration: 3
            }
        ]
    },
    "스쿠카쟈": {
        name_jp: "スクカジャ",
        description: "동료 1명의 효과 명중, 효과 저항이 9.3% 증가하고, 자신의 효과 명중 25%마다 1.6% 추가 증가한다. 상한은 6.4%이며, 효과는 3턴 동안 지속된다.",
        description_jp: "3ターンの間、味方単体の命中・回避が9.3%上昇する。自身の効果命中25%ごとに、味方の命中・回避がさらに1.6%上昇する（最大6.4%まで）。",
        type: "지원",
        target: "단일",
        icon : "버프",
        effects: [
            {
                type: "버프",
                stat: ["효과명중", "효과저항"],
                baseValue: 9.3,
                scaleValue: 1.6,
                scalePer: 25,
                maxValue: 6.4,
                duration: 3
            }
        ]
    },
    "마하스쿠카쟈": {
        name_jp: "マハスクカジャ",
        description: "모든 동료의 효과 명중, 효과 저항이 6.5% 증가하고, 자신의 효과 명중 25%마다 1.1% 추가 증가한다. 상한은 4.4%이며, 효과는 3턴 동안 지속된다.",
        description_jp: "3ターンの間、味方全体の命中・回避が6.5%上昇する。自身の効果命中25%ごとに、味方の命中・回避がさらに1.1%上昇する（最大4.4%まで）。",
        type: "지원",
        target: "전체",
        icon : "버프광역",
        effects: [
            {
                type: "버프",
                stat: ["효과명중", "효과저항"],
                baseValue: 6.5,
                scaleValue: 1.1,
                scalePer: 25,
                maxValue: 4.4,
                duration: 3
            }
        ]
    },
    "리벨리온": {
        name_jp: "リベリオン",
        description: "동료 1명의 크리티컬 확률이 9.3% 증가하고, 자신의 크리티컬 확률 10%마다 1.6% 추가 증가한다. 상한은 6.4%이며, 효과는 3턴 동안 지속된다.",
        description_jp: "3ターンの間、味方単体のクリティカル率が9.3%上昇する。自身のクリティカル率が10%ごとに、味方のクリティカル率がさらに1.6%上昇する（最大6.4%まで）。",
        type: "지원",
        target: "단일",
        icon : "버프",
        effects: [
            {
                type: "버프",
                stat: "크리티컬",
                baseValue: 9.3,
                scaleValue: 1.6,
                scalePer: 10,
                maxValue: 6.4,
                duration: 3
            }
        ]
    },
    "레볼루션": {
        name_jp: "レボリューション",
        description: "모든 동료의 크리티컬 확률이 6.5% 증가하고, 자신의 크리티컬 확률 10%마다 1.1% 추가 증가한다. 상한은 4.4%이며, 효과는 3턴 동안 지속된다.",
        description_jp: "3ターンの間、味方全体のクリティカル率が6.5%上昇する。自身のクリティカル率が10%ごとに、味方のクリティカル率がさらに1.1%上昇する（最大4.4%まで）。",
        type: "지원",
        target: "전체",
        icon : "버프광역",
        effects: [
            {
                type: "버프",
                stat: "크리티컬",
                baseValue: 6.5,
                scaleValue: 1.1,
                scalePer: 10,
                maxValue: 4.4,
                duration: 3
            }
        ]
    },
    "무한 알고리즘": {
        name_jp: "無限アルゴリズム",
        description: "2턴 동안 모든 아군 캐릭터의 공격력이 30.0% 증가하고, 메인 목표의 대미지가 추가로 20.0% 증가한다.",
        description_jp: "2ターンの間、味方全体の攻撃力が30.0%上昇し、メインターゲットへのダメージがさらに20.0%増加する。",
        type: "지원",
        target: "전체",
        icon : "버프광역",
        effects: [
            {
                type: "버프",
                stat: "공격력",
                value: 30.0,
                duration: 2
            },
            {
                type: "버프",
                stat: "대미지",
                value: 20.0,
                duration: 2
            }
        ]
    },
    "컨센트레이트": {
        name_jp: "コンセントレイト",
        description: "자신의 다음 마법 속성 대미지가 52.1% 증가하며 1턴 동안 지속된다.",
        description_jp: "1ターンの間、自身が次に与える魔法属性ダメージが52.1%上昇する。",
        type: "지원",
        target: "자신",
        icon : "버프",
        effects: [
            {
                type: "버프",
                stat: "마법대미지",
                value: 52.1,
                duration: 1,
                nextOnly: true
            }
        ]
    },
    "차지": {
        name_jp: "チャージ",
        description: "자신의 다음 물리 속성 대미지가 52.1% 증가하며 1턴 동안 지속된다.",
        description_jp: "1ターンの間、自身が次に与える物理属性ダメージが52.1%上昇する。",
        type: "지원",
        target: "자신",
        icon : "버프",
        effects: [
            {
                type: "버프",
                stat: "물리대미지",
                value: 52.1,
                duration: 1,
                nextOnly: true
            }
        ]
    },
    "라쿤다": {
        name_jp: "ラクンダ",
        description: "3턴 동안 적 1명의 방어력이 38.8% 감소한다.",
        description_jp: "3ターンの間、敵単体の防御力を38.8%低下する。",
        type: "지원",
        target: "단일",
        icon : "디버프",
        effects: [
            {
                type: "디버프",
                stat: "방어력",
                value: -38.8,
                duration: 3
            }
        ]
    },
    "마하라쿤다": {
        name_jp: "マハラクンダ",
        description: "3턴 동안 모든 적의 방어력이 27.1% 감소한다.",
        description_jp: "3ターンの間、敵全体の防御力を27.1%低下させる。",
        type: "지원",
        target: "전체",
        icon : "디버프광역",
        effects: [
            {
                type: "디버프",
                stat: "방어력",
                value: -27.1,
                duration: 3
            }
        ]
    },
    "음률의 침입": {
        name_jp: "音律の侵入",
        description: "3턴 동안 모든 적의 방어력이 32.0% 감소하고, 받는 대미지를 10% 증가시킨다.",
        description_jp: "3ターンの間、敵全体の防御力を32.0%低下させ、受けるダメージを10%増加させる。",
        type: "지원",
        target: "전체",
        icon : "디버프광역",
        effects: [
            {
                type: "디버프",
                stat: "방어력",
                value: -32.0,
                duration: 3
            },
            {
                type: "디버프",
                stat: "대미지",
                value: 10,
                duration: 3
            }
        ]
    },
    "타룬다": {
        name_jp: "タルンダ",
        description: "3턴 동안 적 1명의 공격력이 25.8% 감소한다.",
        description_jp: "3ターンの間、敵単体の攻撃力を25.8%低下させる。",
        type: "지원",
        target: "단일",
        icon : "디버프",
        effects: [
            {
                type: "디버프",
                stat: "공격력",
                value: -25.8,
                duration: 3
            }
        ]
    },
    // ... existing code ...
    "공격 강화 I": {
        name_jp: "攻撃強化Ⅰ",
        description: "공격력이 5.8% 증가한다.",
        description_jp: "攻撃力が5.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "공격력",
                value: 5.8
            }
        ]
    },
    "공격 강화 II": {
        name_jp: "攻撃強化Ⅱ",
        description: "공격력이 8.3% 증가한다.",
        description_jp: "攻撃力が8.3%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "공격력",
                value: 8.3
            }
        ]
    },
    "공격 강화 III": {
        name_jp: "攻撃強化Ⅲ",
        description: "공격력이 10.8% 증가한다.",
        description_jp: "攻撃力が10.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "공격력",
                value: 10.8
            }
        ]
    },
    "공격 강화 IV": {
        name_jp: "攻撃強化Ⅳ",
        description: "공격력이 13.5% 증가한다.",
        description_jp: "攻撃力が13.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "공격력",
                value: 13.5
            }
        ]
    },
    "공격 강화 V": {
        name_jp: "攻撃強化Ⅴ",
        description: "공격력이 16.2% 증가한다.",
        description_jp: "攻撃力が16.2%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "공격력",
                value: 16.2
            }
        ]
    },
    "공격 강화": {
        name_jp: "攻撃強化",
        description: "공격력이 5.8%/8.3%/10.8%/13.5%/16.2% 증가한다.",
        description_jp: "攻撃力が5.8%/8.3%/10.8%/13.5%/16.2%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "공격의 마음가짐 I": {
        name_jp: "攻撃の心得Ⅰ",
        description: "전투 시작 시 2턴 동안 공격력이 8.5% 증가한다.",
        description_jp: "戦闘開始時、2ターンの間、自身の攻撃力が8.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "공격력",
                value: 8.5,
                duration: 2
            }
        ]
    },
    "공격의 마음가짐 II": {
        name_jp: "攻撃の心得Ⅱ",
        description: "전투 시작 시 2턴 동안 공격력이 12.1% 증가한다.",
        description_jp: "戦闘開始時、2ターンの間、自身の攻撃力が12.1%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "공격력",
                value: 12.1,
                duration: 2
            }
        ]
    },
    "공격의 마음가짐 III": {
        name_jp: "攻撃の心得Ⅲ",
        description: "전투 시작 시 2턴 동안 공격력이 15.7% 증가한다.",
        description_jp: "戦闘開始時、2ターンの間、自身の攻撃力が15.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "공격력",
                value: 15.7,
                duration: 2
            }
        ]
    },
    "공격의 마음가짐 IV": {
        name_jp: "攻撃の心得Ⅳ",
        description: "전투 시작 시 2턴 동안 공격력이 19.6% 증가한다.",
        description_jp: "戦闘開始時、2ターンの間、自身の攻撃力が19.6%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "공격력",
                value: 19.6,
                duration: 2
            }
        ]
    },
    "공격의 마음가짐": {
        name_jp: "攻撃の心得",
        description: "전투 시작 시 2턴 동안 공격력이 8.5%/12.1%/15.7%/19.6% 증가한다.",
        description_jp: "戦闘開始時、2ターンの間、自身の攻撃力が8.5%/12.1%/15.7%/19.6%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "방어의 마음가짐 I": {
        name_jp: "防御の心得Ⅰ",
        description: "전투 시작 시 2턴 동안 방어력이 12.7% 증가한다.",
        description_jp: "戦闘開始時、2ターンの間、自身の防御力が12.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "방어력",
                value: 12.7,
                duration: 2
            }
        ]
    },
    "방어의 마음가짐 II": {
        name_jp: "防御の心得Ⅱ",
        description: "전투 시작 시 2턴 동안 방어력이 18.1% 증가한다.",
        description_jp: "戦闘開始時、2ターンの間、自身の防御力が18.1%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "방어력",
                value: 18.1,
                duration: 2
            }
        ]
    },
    "방어의 마음가짐 III": {
        name_jp: "防御の心得Ⅲ",
        description: "전투 시작 시 2턴 동안 방어력이 23.6% 증가한다.",
        description_jp: "戦闘開始時、2ターンの間、自身の防御力が23.6%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "방어력",
                value: 23.6,
                duration: 2
            }
        ]
    },
    "방어의 마음가짐 IV": {
        name_jp: "防御の心得Ⅳ",
        description: "전투 시작 시 2턴 동안 방어력이 29.4% 증가한다.",
        description_jp: "戦闘開始時、2ターンの間、自身の防御力が29.4%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "방어력",
                value: 29.4,
                duration: 2
            }
        ]
    },
    "방어의 마음가짐": {
        name_jp: "防御の心得",
        description: "전투 시작 시 2턴 동안 방어력이 12.7%/18.1%/23.6%/29.4% 증가한다.",
        description_jp: "戦闘開始時、2ターンの間、自身の防御力が12.7%/18.1%/23.6%/29.4%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "마하타루카 오토 I": {
        name_jp: "マハタルカオートⅠ",
        description: "전투 시작 시 전원의 공격력이 4.2% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        description_jp: "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の攻撃力が4.2%上昇する。",
        type: "패시브",
        target: "전체",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "공격력",
                value: 4.2,
                duration: 2,
                cancelOnSwitch: true
            }
        ]
    },
    "마하타루카 오토 II": {
        name_jp: "マハタルカオートⅡ",
        description: "전투 시작 시 전원의 공격력이 6.0% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        description_jp: "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の攻撃力が6.0%上昇する。",
        type: "패시브",
        target: "전체",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "공격력",
                value: 6.0,
                duration: 2,
                cancelOnSwitch: true
            }
        ]
    },
    "마하타루카 오토 III": {
        name_jp: "マハタルカオートⅢ",
        description: "전투 시작 시 전원의 공격력이 7.9% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        description_jp: "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の攻撃力が7.9%上昇する。",
        type: "패시브",
        target: "전체",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "공격력",
                value: 7.9,
                duration: 2,
                cancelOnSwitch: true
            }
        ]
    },
    "마하타루카 오토 IV": {
        name_jp: "マハタルカオートⅣ",
        description: "전투 시작 시 전원의 공격력이 9.8% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        description_jp: "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の攻撃力が9.8%上昇する。",
        type: "패시브",
        target: "전체",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "공격력",
                value: 9.8,
                duration: 2,
                cancelOnSwitch: true
            }
        ]
    },
    "마하타루카 오토": {
        name_jp: "マハタルカオート",
        description: "전투 시작 시 전원의 공격력이 4.2%/6.0%/7.9%/9.8% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        description_jp: "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の攻撃力が4.2%/6.0%/7.9%/9.8%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "마하라쿠카 오토 I": {
        name_jp: "マハラクカオートⅠ",
        description: "전투 시작 시 전원의 방어력이 6.3% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        description_jp: "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の防御力が6.3%上昇する。",
        type: "패시브",
        target: "전체",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "방어력",
                value: 6.3,
                duration: 2,
                cancelOnSwitch: true
            }
        ]
    },
    "마하라쿠카 오토 II": {
        name_jp: "マハラクカオートⅡ",
        description: "전투 시작 시 전원의 방어력이 9.1% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        description_jp: "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の防御力が9.1%上昇する。",
        type: "패시브",
        target: "전체",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "방어력",
                value: 9.1,
                duration: 2,
                cancelOnSwitch: true
            }
        ]
    },
    "마하라쿠카 오토 III": {
        name_jp: "マハラクカオートⅢ",
        description: "전투 시작 시 전원의 방어력이 11.8% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        description_jp: "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の防御力が11.8%上昇する。",
        type: "패시브",
        target: "전체",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "방어력",
                value: 11.8,
                duration: 2,
                cancelOnSwitch: true
            }
        ]
    },
    "마하라쿠카 오토 IV": {
        name_jp: "マハラクカオートⅣ",
        description: "전투 시작 시 전원의 방어력이 14.7% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        description_jp: "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の防御力が14.7%上昇する。",
        type: "패시브",
        target: "전체",
        icon: "패시브",
        effects: [
            {
                type: "전투시작",
                stat: "방어력",
                value: 14.7,
                duration: 2,
                cancelOnSwitch: true
            }
        ]
    },
    "마하라쿠카 오토": {
        name_jp: "マハラクカオート",
        description: "전투 시작 시 전원의 방어력이 6.3%/9.1%/11.8%/14.7% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        description_jp: "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の防御力が6.3%/9.1%/11.8%/14.7%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "어드바이스 I": {
        name_jp: "アドバイスⅠ",
        description: "크리티컬 확률이 3.5% 증가한다.",
        description_jp: "クリティカル率が3.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "크리티컬",
                value: 3.5
            }
        ]
    },
    "어드바이스 II": {
        name_jp: "アドバイスⅡ",
        description: "크리티컬 확률이 5.0% 증가한다.",
        description_jp: "クリティカル率が5.0%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "크리티컬",
                value: 5.0
            }
        ]
    },
    "어드바이스 III": {
        name_jp: "アドバイスⅢ",
        description: "크리티컬 확률이 6.5% 증가한다.",
        description_jp: "クリティカル率が6.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "크리티컬",
                value: 6.5
            }
        ]
    },
    "어드바이스 IV": {
        name_jp: "アドバイスⅣ",
        description: "크리티컬 확률이 8.1% 증가한다.",
        description_jp: "クリティカル率が8.1%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "크리티컬",
                value: 8.1
            }
        ]
    },
    "어드바이스": {
        name_jp: "アドバイス",
        description: "크리티컬 확률이 3.5%/5.0%/6.5%/8.1% 증가한다.",
        description_jp: "クリティカル率が3.5%/5.0%/6.5%/8.1%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "총탄의 열광 II": {
        name_jp: "トリガーハッピーⅡ",
        description: "총기 공격 크리티컬 확률이 5.5% 증가한다.",
        description_jp: "銃撃属性のクリティカル率が5.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "총기크리티컬",
                value: 5.5
            }
        ]
    },
    "총탄의 열광 III": {
        name_jp: "トリガーハッピーⅢ",
        description: "총기 공격 크리티컬 확률이 7.2% 증가한다.",
        description_jp: "銃撃属性のクリティカル率が7.2%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "총기크리티컬",
                value: 7.2
            }
        ]
    },
    "총탄의 열광": {
        name_jp: "トリガーハッピー",
        description: "총기 공격 크리티컬 확률이 5.5%/7.2% 증가한다.",
        description_jp: "銃撃属性のクリティカル率が5.5%/7.2%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "고압 전류 I": {
        name_jp: "高圧電流Ⅰ",
        description: "선제 공격 시 크리티컬 확률이 4.2% 증가한다.",
        description_jp: "先制攻撃時のクリティカル率が4.2%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "선제크리티컬",
                value: 4.2
            }
        ]
    },
    "고압 전류 II": {
        name_jp: "高圧電流Ⅱ",
        description: "선제 공격 시 크리티컬 확률이 6.0% 증가한다.",
        description_jp: "先制攻撃時のクリティカル率が6.0%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "선제크리티컬",
                value: 6.0
            }
        ]
    },
    "고압 전류 III": {
        name_jp: "高圧電流Ⅲ",
        description: "선제 공격 시 크리티컬 확률이 7.8% 증가한다.",
        description_jp: "先制攻撃時のクリティカル率が7.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "선제크리티컬",
                value: 7.8
            }
        ]
    },
    "고압 전류 IV": {
        name_jp: "高圧電流Ⅳ",
        description: "선제 공격 시 크리티컬 확률이 9.7% 증가한다.",
        description_jp: "先制攻撃時のクリティカル率が9.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "선제크리티컬",
                value: 9.7
            }
        ]
    },
    "고압 전류": {
        name_jp: "高圧電流",
        description: "선제 공격 시 크리티컬 확률이 4.2%/6.0%/7.8%/9.7% 증가한다.",
        description_jp: "先制攻撃時のクリティカル率が4.2%/6.0%/7.8%/9.7%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "역경의 각오 I": {
        name_jp: "逆境の覚悟Ⅰ",
        description: "적에게 포위 시 크리티컬 확률이 4.6% 증가한다.",
        description_jp: "ピンチエンカウント時のクリティカル率が4.6%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "포위크리티컬",
                value: 4.6
            }
        ]
    },
    "역경의 각오 II": {
        name_jp: "逆境の覚悟Ⅱ",
        description: "적에게 포위 시 크리티컬 확률이 6.5% 증가한다.",
        description_jp: "ピンチエンカウント時のクリティカル率が6.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "포위크리티컬",
                value: 6.5
            }
        ]
    },
    "역경의 각오 III": {
        name_jp: "逆境の覚悟Ⅲ",
        description: "적에게 포위 시 크리티컬 확률이 8.5% 증가한다.",
        description_jp: "ピンチエンカウント時のクリティカル率が8.5％上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "포위크리티컬",
                value: 8.5
            }
        ]
    },
    "역경의 각오 IV": {
        name_jp: "逆境の覚悟Ⅳ",
        description: "적에게 포위 시 크리티컬 확률이 10.5% 증가한다.",
        description_jp: "ピンチエンカウント時のクリティカル率が10.5％上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "포위크리티컬",
                value: 10.5
            }
        ]
    },
    "역경의 각오": {
        name_jp: "逆境の覚悟",
        description: "적에게 포위 시 크리티컬 확률이 4.6%/6.5%/8.5%/10.5% 증가한다.",
        description_jp: "ピンチエンカウント時のクリティカル率が4.6%/6.5%/8.5%/10.5%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "정교한 타격 I": {
        name_jp: "ピンポイントⅠ",
        description: "크리티컬 효과가 7% 증가한다.",
        description_jp: "クリティカルダメージが7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "크리티컬 효과",
                value: 7
            }
        ]
    },
    "정교한 타격 II": {
        name_jp: "ピンポイントⅡ",
        description: "크리티컬 효과가 10% 증가한다.",
        description_jp: "クリティカルダメージが10%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "크리티컬 효과",
                value: 10
            }
        ]
    },
    "정교한 타격 III": {
        name_jp: "ピンポイントⅢ",
        description: "크리티컬 효과가 13% 증가한다.",
        description_jp: "クリティカルダメージが13%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "크리티컬 효과",
                value: 13
            }
        ]
    },
    "정교한 타격 IV": {
        name_jp: "ピンポイントⅣ",
        description: "크리티컬 효과가 16.2% 증가한다.",
        description_jp: "クリティカルダメージが16.2％上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "크리티컬 효과",
                value: 16.2
            }
        ]
    },
    "정교한 타격": {
        name_jp: "ピンポイント",
        description: "크리티컬 효과가 7%/10%/13%/16.2% 증가한다.",
        description_jp: "クリティカルダメージが7%/10%/13%/16.2%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "마도의 재능 I": {
        name_jp: "魔導の才能Ⅰ",
        description: "주는 대미지가 4.7% 증가한다.",
        description_jp: "与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "대미지",
                value: 4.7
            }
        ]
    },
    "마도의 재능 II": {
        name_jp: "魔導の才能Ⅱ",
        description: "주는 대미지가 6.7% 증가한다.",
        description_jp: "与ダメージが6.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "대미지",
                value: 6.7
            }
        ]
    },
    "마도의 재능 III": {
        name_jp: "魔導の才能Ⅲ",
        description: "주는 대미지가 8.7% 증가한다.",
        description_jp: "与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "대미지",
                value: 8.7
            }
        ]
    },
    "마도의 재능 IV": {
        name_jp: "魔導の才能Ⅳ",
        description: "주는 대미지가 10.8% 증가한다.",
        description_jp: "与ダメージが10.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "대미지",
                value: 10.8
            }
        ]
    },
    "마도의 재능 V": {
        name_jp: "魔導の才能Ⅴ",
        description: "주는 대미지가 13.0% 증가한다.",
        description_jp: "与ダメージが13.0%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "대미지",
                value: 13.0
            }
        ]
    },
    "마도의 재능": {
        name_jp: "魔導の才能",
        description: "주는 대미지가 4.7%/6.7%/8.7%/10.8%/13.0% 증가한다.",
        description_jp: "与ダメージが4.7%/6.7%/8.7%/10.8%/13.0%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "물리 강화 I": {
        name_jp: "物理ブースタⅠ",
        description: "물리 속성 대미지가 4.7% 증가한다.",
        description_jp: "物理属性の与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "물리대미지",
                value: 4.7
            }
        ]
    },
    "물리 강화 II": {
        name_jp: "物理ブースタⅡ",
        description: "물리 속성 대미지가 6.7% 증가한다.",
        description_jp: "物理属性の与ダメージが6.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "물리대미지",
                value: 6.7
            }
        ]
    },
    "물리 강화 III": {
        name_jp: "物理ブースタⅢ",
        description: "물리 속성 대미지가 8.7% 증가한다.",
        description_jp: "物理属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "물리대미지",
                value: 8.7
            }
        ]
    },
    "물리 강화 IV": {
        name_jp: "物理ブースタⅣ",
        description: "물리 속성 대미지가 10.8% 증가한다.",
        description_jp: "物理属性の与ダメージが10.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "물리대미지",
                value: 10.8
            }
        ]
    },
    "물리 강화 V": {
        name_jp: "物理ブースタⅤ",
        description: "물리 속성 대미지가 13.0% 증가한다.",
        description_jp: "物理属性の与ダメージが13.0%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "물리대미지",
                value: 13.0
            }
        ]
    },
    "물리 강화": {
        name_jp: "物理ブースタ",
        description: "물리 속성 대미지가 4.7%/6.7%/8.7%/10.8%/13.0% 증가한다.",
        description_jp: "物理属性の与ダメージが4.7%/6.7%/8.7%/10.8%/13.0%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "정밀한 사격 I": {
        name_jp: "銃撃ブースタⅠ",
        description: "총기 대미지가 4.7% 증가한다.",
        description_jp: "銃撃属性の与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "총기대미지",
                value: 4.7
            }
        ]
    },
    "정밀한 사격 III": {
        name_jp: "銃撃ブースタⅢ",
        description: "총기 대미지가 8.7% 증가한다.",
        description_jp: "銃撃属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "총기대미지",
                value: 8.7
            }
        ]
    },
    "정밀한 사격": {
        name_jp: "銃撃ブースタ",
        description: "총기 대미지가 4.7%/6.7%/8.7% 증가한다.",
        description_jp: "銃撃属性の与ダメージが4.7%/6.7%/8.7%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "화염 강화 I": {
        name_jp: "火炎ブースタⅠ",
        description: "화염 속성 대미지가 4.7% 증가한다.",
        description_jp: "火炎属性の与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "화염대미지",
                value: 4.7
            }
        ]
    },
    "화염 강화 II": {
        name_jp: "火炎ブースタⅡ",
        description: "화염 속성 대미지가 6.7% 증가한다.",
        description_jp: "火炎属性の与ダメージが6.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "화염대미지",
                value: 6.7
            }
        ]
    },
    "화염 강화 III": {
        name_jp: "火炎ブースタⅢ",
        description: "화염 속성 대미지가 8.7% 증가한다.",
        description_jp: "火炎属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "화염대미지",
                value: 8.7
            }
        ]
    },
    "화염 강화": {
        name_jp: "火炎ブースタ",
        description: "화염 속성 대미지가 4.7%/6.7%/8.7% 증가한다.",
        description_jp: "火炎属性の与ダメージが4.7%/6.7%/8.7%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "빙결 강화 I": {
        name_jp: "氷結ブースタⅠ",
        description: "빙결 속성 대미지가 4.7% 증가한다.",
        description_jp: "氷結属性の与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "빙결대미지",
                value: 4.7
            }
        ]
    },
    "빙결 강화 II": {
        name_jp: "氷結ブースタⅡ",
        description: "빙결 속성 대미지가 6.7% 증가한다.",
        description_jp: "氷結属性の与ダメージが6.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "빙결대미지",
                value: 6.7
            }
        ]
    },
    "빙결 강화 III": {
        name_jp: "氷結ブースタⅢ",
        description: "빙결 속성 대미지가 8.7% 증가한다.",
        description_jp: "氷結属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "빙결대미지",
                value: 8.7
            }
        ]
    },
    "빙결 강화 IV": {
        name_jp: "氷結ブースタⅣ",
        description: "빙결 속성 대미지가 10.8% 증가한다.",
        description_jp: "氷結속성の与ダメージが10.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "빙결대미지",
                value: 10.8
            }
        ]
    },
    "빙결 강화": {
        name_jp: "氷結ブースタ",
        description: "빙결 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        description_jp: "氷結属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "전격 강화 I": {
        name_jp: "電撃ブースタⅠ",
        description: "전격 속성 대미지가 4.7% 증가한다.",
        description_jp: "電撃属性の与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "전격대미지",
                value: 4.7
            }
        ]
    },
    "전격 강화 II": {
        name_jp: "電撃ブースタⅡ",
        description: "전격 속성 대미지가 6.7% 증가한다.",
        description_jp: "電撃属性の与ダメージが6.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "전격대미지",
                value: 6.7
            }
        ]
    },
    "전격 강화 III": {
        name_jp: "電撃ブースタⅢ",
        description: "전격 속성 대미지가 8.7% 증가한다.",
        description_jp: "電撃属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "전격대미지",
                value: 8.7
            }
        ]
    },
    "전격 강화 IV": {
        name_jp: "電撃ブースタⅣ",
        description: "전격 속성 대미지가 10.8% 증가한다.",
        description_jp: "電撃属性の与ダメージが10.8％上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "전격대미지",
                value: 10.8
            }
        ]
    },
    "전격 강화": {
        name_jp: "電撃ブースタ",
        description: "전격 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        description_jp: "電撃属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "질풍 강화 I": {
        name_jp: "疾風ブースタⅠ",
        description: "질풍 속성 대미지가 4.7% 증가한다.",
        description_jp: "疾風属性の与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "질풍대미지",
                value: 4.7
            }
        ]
    },
    "질풍 강화 II": {
        name_jp: "疾風ブースタⅡ",
        description: "질풍 속성 대미지가 6.7% 증가한다.",
        description_jp: "疾風属性の与ダメージが6.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "질풍대미지",
                value: 6.7
            }
        ]
    },
    "질풍 강화 III": {
        name_jp: "疾風ブースタⅢ",
        description: "질풍 속성 대미지가 8.7% 증가한다.",
        description_jp: "疾風属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "질풍대미지",
                value: 8.7
            }
        ]
    },
    "질풍 강화 IV": {
        name_jp: "疾風ブースタⅣ",
        description: "질풍 속성 대미지가 10.8% 증가한다.",
        description_jp: "疾風属性の与ダメージが10.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "질풍대미지",
                value: 10.8
            }
        ]
    },
    "질풍 강화": {
        name_jp: "疾風ブースタ",
        description: "질풍 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        description_jp: "疾風属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "핵열 강화 I": {
        name_jp: "核熱ブースタⅠ",
        description: "핵열 속성 대미지가 4.7% 증가한다.",
        description_jp: "核熱属性の与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "핵열대미지",
                value: 4.7
            }
        ]
    },
    "핵열 강화 II": {
        name_jp: "核熱ブースタⅡ",
        description: "핵열 속성 대미지가 6.7% 증가한다.",
        description_jp: "核熱属性の与ダメージが6.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "핵열대미지",
                value: 6.7
            }
        ]
    },
    "핵열 강화 III": {
        name_jp: "核熱ブースタⅢ",
        description: "핵열 속성 대미지가 8.7% 증가한다.",
        description_jp: "核熱属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "핵열대미지",
                value: 8.7
            }
        ]
    },
    "핵열 강화 IV": {
        name_jp: "核熱ブースタⅣ",
        description: "핵열 속성 대미지가 10.8% 증가한다.",
        description_jp: "核熱属性の与ダメージが10.8％上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "핵열대미지",
                value: 10.8
            }
        ]
    },
    "핵열 강화": {
        name_jp: "核熱ブースタ",
        description: "핵열 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        description_jp: "核熱属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "염동 강화 I": {
        name_jp: "念動ブースタⅠ",
        description: "염동 속성 대미지가 4.7% 증가한다.",
        description_jp: "念動属性の与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "염동대미지",
                value: 4.7
            }
        ]
    },
    "염동 강화 II": {
        name_jp: "念動ブースタⅡ",
        description: "염동 속성 대미지가 6.7% 증가한다.",
        description_jp: "念動属性の与ダメージが6.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "염동대미지",
                value: 6.7
            }
        ]
    },
    "염동 강화 III": {
        name_jp: "念動ブースタⅢ",
        description: "염동 속성 대미지가 8.7% 증가한다.",
        description_jp: "念動属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "염동대미지",
                value: 8.7
            }
        ]
    },
    "염동 강화 IV": {
        name_jp: "念動ブースタⅣ",
        description: "염동 속성 대미지가 10.8% 증가한다.",
        description_jp: "念動属性の与ダメージが10.8％上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "염동대미지",
                value: 10.8
            }
        ]
    },
    "염동 강화": {
        name_jp: "念動ブースタ",
        description: "염동 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        description_jp: "念動属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "축복 강화 I": {
        name_jp: "祝福ブースタⅠ",
        description: "축복 속성 대미지가 4.7% 증가한다.",
        description_jp: "祝福属性の与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "축복대미지",
                value: 4.7
            }
        ]
    },
    "축복 강화 II": {
        name_jp: "祝福ブースタⅡ",
        description: "축복 속성 대미지가 6.7% 증가한다.",
        description_jp: "祝福属性の与ダメージが6.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "축복대미지",
                value: 6.7
            }
        ]
    },
    "축복 강화 III": {
        name_jp: "祝福ブースタⅢ",
        description: "축복 속성 대미지가 8.7% 증가한다.",
        description_jp: "祝福属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "축복대미지",
                value: 8.7
            }
        ]
    },
    "축복 강화": {
        name_jp: "祝福ブースタ",
        description: "축복 속성 대미지가 4.7%/6.7%/8.7% 증가한다.",
        description_jp: "祝福属性の与ダメージが4.7%/6.7%/8.7%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "주원 강화 I": {
        name_jp: "呪怨ブースタⅠ",
        description: "주원 속성 대미지가 4.7% 증가한다.",
        description_jp: "呪怨属性の与ダメージが4.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "주원대미지",
                value: 4.7
            }
        ]
    },
    "주원 강화 II": {
        name_jp: "呪怨ブースタⅡ",
        description: "주원 속성 대미지가 6.7% 증가한다.",
        description_jp: "呪怨属性の与ダメージが6.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "주원대미지",
                value: 6.7
            }
        ]
    },
    "주원 강화 III": {
        name_jp: "呪怨ブースタⅢ",
        description: "주원 속성 대미지가 8.7% 증가한다.",
        description_jp: "呪怨属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "주원대미지",
                value: 8.7
            }
        ]
    },
    "주원 강화 IV": {
        name_jp: "呪怨ブースタⅣ",
        description: "주원 속성 대미지가 10.8% 증가한다.",
        description_jp: "呪怨属性の与ダメージが10.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "주원대미지",
                value: 10.8
            }
        ]
    },
    "주원 강화": {
        name_jp: "呪怨ブースタ",
        description: "주원 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        description_jp: "呪怨属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "만능 강화 III": {
        name_jp: "万能ブースタⅢ",
        description: "만능 속성 대미지가 8.7% 증가한다.",
        description_jp: "万能属性の与ダメージが8.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "만능대미지",
                value: 8.7
            }
        ]
    },
    "치료 강화 I": {
        name_jp: "治療ブースタⅠ",
        description: "주는 치료 효과가 4.2% 증가한다.",
        description_jp: "回復量が4.2%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "치료량",
                value: 4.2
            }
        ]
    },
    "치료 강화 II": {
        name_jp: "治療ブースタⅡ",
        description: "주는 치료 효과가 6.0% 증가한다.",
        description_jp: "回復量が6.0%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "치료량",
                value: 6.0
            }
        ]
    },
    "치료 강화 III": {
        name_jp: "治療ブースタⅢ",
        description: "주는 치료 효과가 7.8% 증가한다.",
        description_jp: "回復量が7.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "치료량",
                value: 7.8
            }
        ]
    },
    "치료 강화 IV": {
        name_jp: "治療ブースタⅣ",
        description: "주는 치료 효과가 9.7% 증가한다.",
        description_jp: "回復量が9.7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "치료량",
                value: 9.7
            }
        ]
    },
    "치료 강화": {
        name_jp: "治療ブースタ",
        description: "주는 치료 효과가 4.2%/6.0%/7.8%/9.7% 증가한다.",
        description_jp: "回復量が4.2%/6.0%/7.8%/9.7%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "생명 강화 I": {
        name_jp: "一分の活泉",
        description: "생명이 5.1% 증가한다.",
        description_jp: "体力が5.1%増える。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "생명",
                value: 5.1
            }
        ]
    },
    "생명 강화 II": {
        name_jp: "二分の活泉",
        description: "생명이 8.3% 증가한다.",
        description_jp: "体力が8.3%増える。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "생명",
                value: 8.3
            }
        ]
    },
    "생명 강화 III": {
        name_jp: "三分の活泉",
        description: "생명이 10.8% 증가한다.",
        description_jp: "体力が10.8%増える。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "생명",
                value: 10.8
            }
        ]
    },
    "생명 강화 IV": {
        name_jp: "四分の活泉",
        description: "생명이 13.5% 증가한다.",
        description_jp: "体力が13.5%増える。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "생명",
                value: 13.5
            }
        ]
    },
    "생명 강화": {
        name_jp: "活泉",
        description: "생명이 5.1%/8.3%/10.8%/13.5% 증가한다.",
        description_jp: "体力が5.1%/8.3%/10.8%/13.5%増える。",
        type: "패시브",
        icon: "패시브"
    },
    "방어 강화 I": {
        name_jp: "防御強化Ⅰ",
        description: "방어력이 8.8% 증가한다.",
        description_jp: "防御力が8.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "방어력",
                value: 8.8
            }
        ]
    },
    "방어 강화 II": {
        name_jp: "防御強化Ⅱ",
        description: "방어력이 12.5% 증가한다.",
        description_jp: "防御力が12.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "방어력",
                value: 12.5
            }
        ]
    },
    "방어 강화 III": {
        name_jp: "防御強化Ⅲ",
        description: "방어력이 16.3% 증가한다.",
        description_jp: "防御力が16.3%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "방어력",
                value: 16.3
            }
        ]
    },
    "방어 강화": {
        name_jp: "防御強化",
        description: "방어력이 8.8%/12.5%/16.3% 증가한다.",
        description_jp: "防御力が8.8%/12.5%/16.3%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "대미지 면역 I": {
        name_jp: "ダメージ免疫Ⅰ",
        description: "받는 대미지가 4.7% 감소한다.",
        description_jp: "受けるダメージが4.7%軽減される。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "받는대미지감소",
                value: 4.7
            }
        ]
    },
    "대미지 면역 II": {
        name_jp: "ダメージ免疫Ⅱ",
        description: "받는 대미지가 6.7% 감소한다.",
        description_jp: "受けるダメージが6.7%軽減される。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "받는대미지감소",
                value: 6.7
            }
        ]
    },
    "대미지 면역 III": {
        name_jp: "ダメージ免疫Ⅲ",
        description: "받는 대미지가 8.7% 감소한다.",
        description_jp: "受けるダメージが8.7%軽減される。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "받는대미지감소",
                value: 8.7
            }
        ]
    },
    "대미지 면역 IV": {
        name_jp: "ダメージ免疫Ⅳ",
        description: "받는 대미지가 10.8% 감소한다.",
        description_jp: "受けるダメージが10.8%軽減される。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "받는대미지감소",
                value: 10.8
            }
        ]
    },
    "대미지 면역": {
        name_jp: "ダメージ免疫",
        description: "받는 대미지가 4.7%/6.7%/8.7%/10.8% 감소한다.",
        description_jp: "受けるダメージが4.7%/6.7%/8.7%/10.8%軽減される。",
        type: "패시브",
        icon: "패시브"
    },
    "치료 촉진 I": {
        name_jp: "治療促進Ⅰ",
        description: "턴 시작 시 최대 생명 1.9%를 회복한다.",
        description_jp: "ターン開始時に最大HPの1.9%を回復する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "턴시작",
                stat: "생명회복",
                value: 1.9
            }
        ]
    },
    "치료 촉진 II": {
        name_jp: "治療促進Ⅱ",
        description: "턴 시작 시 최대 생명 2.7%를 회복한다.",
        description_jp: "ターン開始時に最大HPの2.7%を回復する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "턴시작",
                stat: "생명회복",
                value: 2.7
            }
        ]
    },
    "치료 촉진 III": {
        name_jp: "治療促進Ⅲ",
        description: "턴 시작 시 최대 생명 3.5%를 회복한다.",
        description_jp: "ターン開始時に最大HPの3.5%を回復する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "턴시작",
                stat: "생명회복",
                value: 3.5
            }
        ]
    },
    "치료 촉진": {
        name_jp: "治療促進",
        description: "턴 시작 시 최대 생명 1.9%/2.7%/3.5%를 회복한다.",
        description_jp: "ターン開始時に最大HPの1.9%/2.7%/3.5%を回復する。",
        type: "패시브",
        icon: "패시브"
    },
    "명중 강화 I": {
        name_jp: "命中強化Ⅰ",
        description: "효과 명중이 7% 증가한다.",
        description_jp: "効果命中が7%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "명중",
                value: 7
            }
        ]
    },
    "명중 강화 II": {
        name_jp: "命中強化Ⅱ",
        description: "효과 명중이 10% 증가한다.",
        description_jp: "効果命中が10%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "명중",
                value: 10
            }
        ]
    },
    "명중 강화 III": {
        name_jp: "命中強化Ⅲ",
        description: "효과 명중이 13% 증가한다.",
        description_jp: "効果命中が13%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "명중",
                value: 13
            }
        ]
    },
    "명중 강화 IV": {
        name_jp: "命中強化Ⅳ",
        description: "효과 명중이 16.2% 증가한다.",
        description_jp: "効果命中が16.2%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "명중",
                value: 16.2
            }
        ]
    },
    "명중 강화 V": {
        name_jp: "命中強化Ⅴ",
        description: "효과 명중이 19.4% 증가한다.",
        description_jp: "効果命中が19.4%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "명중",
                value: 19.4
            }
        ]
    },
    "명중 강화": {
        name_jp: "命中強化",
        description: "효과 명중이 7%/10%/13%/16.2%/19.4% 증가한다.",
        description_jp: "効果命中が7%/10%/13%/16.2%/19.4%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "화상률 UP I": {
        name_jp: "炎上率UPⅠ",
        description: "화상 효과 부여 시 효과 명중이 8.8% 증가한다.",
        description_jp: "炎上の命中率が8.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "화상명중",
                value: 8.8
            }
        ]
    },
    "화상률 UP II": {
        name_jp: "炎上率UPⅡ",
        description: "화상 효과 부여 시 효과 명중이 12.5% 증가한다.",
        description_jp: "炎上の命中率が12.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "화상명중",
                value: 12.5
            }
        ]
    },
    "화상률 UP III": {
        name_jp: "炎上率UPⅢ",
        description: "화상 효과 부여 시 효과 명중이 16.3% 증가한다.",
        description_jp: "炎上の命中率が16.3%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "화상명중",
                value: 16.3
            }
        ]
    },
    "화상률 UP": {
        name_jp: "炎上率UP",
        description: "화상 효과 부여 시 효과 명중이 8.8%/12.5%/16.3% 증가한다.",
        description_jp: "炎上の命中率が8.8%/12.5%/16.3%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "빙결률 UP I": {
        name_jp: "凍結率UPⅠ",
        description: "빙결 효과 부여 시 효과 명중이 8.8% 증가한다.",
        description_jp: "凍結の命中率が8.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "빙결명중",
                value: 8.8
            }
        ]
    },
    "빙결률 UP II": {
        name_jp: "凍結率UPⅡ",
        description: "빙결 효과 부여 시 효과 명중이 12.5% 증가한다.",
        description_jp: "凍結の命中率が12.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "빙결명중",
                value: 12.5
            }
        ]
    },
    "빙결률 UP III": {
        name_jp: "凍結率UPⅢ",
        description: "빙결 효과 부여 시 효과 명중이 16.3% 증가한다.",
        description_jp: "凍結の命中率が16.3%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "빙결명중",
                value: 16.3
            }
        ]
    },
    "빙결률 UP": {
        name_jp: "凍結率UP",
        description: "빙결 효과 부여 시 효과 명중이 8.8%/12.5%/16.3% 증가한다.",
        description_jp: "凍結の命中率が8.8%/12.5%/16.3%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "감전율 UP I": {
        name_jp: "感電率UPⅠ",
        description: "감전 효과 부여 시 효과 명중이 8.8% 증가한다.",
        description_jp: "感電の命中率が8.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "감전명중",
                value: 8.8
            }
        ]
    },
    "감전율 UP II": {
        name_jp: "感電率UPⅡ",
        description: "감전 효과 부여 시 효과 명중이 12.5% 증가한다.",
        description_jp: "感電の命中率が12.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "감전명중",
                value: 12.5
            }
        ]
    },
    "감전율 UP III": {
        name_jp: "感電率UPⅢ",
        description: "감전 효과 부여 시 효과 명중이 16.3% 증가한다.",
        description_jp: "感電の命中率が16.3%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "감전명중",
                value: 16.3
            }
        ]
    },
    "감전율 UP IV": {
        name_jp: "感電率UPⅣ",
        description: "감전 효과 부여 시 효과 명중이 20.3% 증가한다.",
        description_jp: "感電の命中率が20.3％上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "감전명중",
                value: 20.3
            }
        ]
    },
    "감전율 UP": {
        name_jp: "感電率UP",
        description: "감전 효과 부여 시 효과 명중이 8.8%/12.5%/16.3%/20.3% 증가한다.",
        description_jp: "感電の命中率が8.8%/12.5%/16.3%/20.3%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "질풍률 UP I": {
        name_jp: "風襲率UPⅠ",
        description: "풍습 효과 부여 시 효과 명중이 8.8% 증가한다.",
        description_jp: "風襲の命中率が8.8%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "풍습명중",
                value: 8.8
            }
        ]
    },
    "질풍률 UP II": {
        name_jp: "風襲率UPⅡ",
        description: "풍습 효과 부여 시 효과 명중이 12.5% 증가한다.",
        description_jp: "風襲の命中率が12.5%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "풍습명중",
                value: 12.5
            }
        ]
    },
    "질풍률 UP III": {
        name_jp: "風襲率UPⅢ",
        description: "풍습 효과 부여 시 효과 명중이 16.3% 증가한다.",
        description_jp: "風襲の命中率が16.3%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "풍습명중",
                value: 16.3
            }
        ]
    },
    "질풍률 UP": {
        name_jp: "風襲率UP",
        description: "풍습 효과 부여 시 효과 명중이 8.8%/12.5%/16.3% 증가한다.",
        description_jp: "風襲の命中率が8.8%/12.5%/16.3%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "우중충한 하늘 I": {
        name_jp: "浮かない空Ⅰ",
        description: "비가 내릴 때 이상 효과 부여 시 효과 명중이 9.1% 증가한다.",
        description_jp: "雨・雪・注意報が出ている時、状態異常攻撃の付着率が9.1%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "비상태이상명중",
                value: 9.1
            }
        ]
    },
    "우중충한 하늘 II": {
        name_jp: "浮かない空Ⅱ",
        description: "비가 내릴 때 이상 효과 부여 시 효과 명중이 13% 증가한다.",
        description_jp: "雨・雪・注意報が出ている時、状態異常攻撃の付着率が13%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "비상태이상명중",
                value: 13
            }
        ]
    },
    "우중충한 하늘 III": {
        name_jp: "浮かない空Ⅲ",
        description: "비가 내릴 때 이상 효과 부여 시 효과 명중이 16.9% 증가한다.",
        description_jp: "雨・雪・注意報が出ている時、状態異常攻撃の付着率が16.9%上昇する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "비상태이상명중",
                value: 16.9
            }
        ]
    },
    "우중충한 하늘": {
        name_jp: "浮かない空",
        description: "비가 내릴 때 이상 효과 부여 시 효과 명중이 9.1%/13%/16.9% 증가한다.",
        description_jp: "雨・雪・注意報が出ている時、状態異常攻撃の付着率が9.1%/13%/16.9%上昇する。",
        type: "패시브",
        icon: "패시브"
    },
    "민첩의 마음가짐 I": {
        name_jp: "敏捷の心得Ⅰ",
        description: "속도가 6포인트 증가하고, 방어력이 0% 감소한다.",
        description_jp: "速さが6上昇し、防御力が0%低下する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "속도",
                value: 6
            },
            {
                type: "패시브",
                stat: "방어력",
                value: 0
            }
        ]
    },
    "민첩의 마음가짐 II": {
        name_jp: "敏捷の心得Ⅱ",
        description: "속도가 9포인트 증가하고, 방어력이 4% 감소한다.",
        description_jp: "速さが9上昇し、防御力が4%低下する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "속도",
                value: 9
            },
            {
                type: "패시브",
                stat: "방어력",
                value: -4
            }
        ]
    },
    "민첩의 마음가짐 III": {
        name_jp: "敏捷の心得Ⅲ",
        description: "속도가 12포인트 증가하고, 방어력이 8% 감소한다.",
        description_jp: "速さが12上昇し、防御力が8%低下する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "속도",
                value: 12
            },
            {
                type: "패시브",
                stat: "방어력",
                value: -8
            }
        ]
    },
    "민첩의 마음가짐 IV": {
        name_jp: "敏捷の心得Ⅳ",
        description: "속도가 15포인트 증가하고, 방어력이 12% 감소한다.",
        description_jp: "速さが15上昇し、防御力が12%低下する。",
        type: "패시브",
        target: "자신",
        icon: "패시브",
        effects: [
            {
                type: "패시브",
                stat: "속도",
                value: 15
            },
            {
                type: "패시브",
                stat: "방어력",
                value: -12
            }
        ]
    },
    "민첩의 마음가짐": {
        name_jp: "敏捷の心得",
        description: "속도가 6/9/12/15포인트 증가하고, 방어력이 0%/4%/8%/12% 감소한다.",
        description_jp: "速さが6/9/12/15上昇し、防御力が0%/4%/8%/12%低下する。",
        type: "패시브",
        icon: "패시브"
    },
    "실드 강화" : {
        name_jp: "シールド強化",
        description: "실드 효과가 4.2%/-/7.8%/9.7% 증가한다.",
        description_jp: "シールド効果が4.2%/-/7.8%/9.7%上昇する。",
        type: "패시브",
        icon: "패시브"
    }
}