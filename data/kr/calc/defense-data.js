const penetrateData = {
    "계시":[
        {
            id: 1,
            type: "계시",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/revelation/희망.webp`,
            skillName: "직책 + 희망",
            options: [],
            value: 5.0,
            duration: "1턴",
            note: ""
        },
        {
            id: 2,
            type: "계시",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/revelation/자유.webp`,
            skillName: "자유 + 개선",
            options: [],
            value: 16.0,
            duration: "-",
            note: "영광 2중첩 추가효과 발동 시"
        }
    ],
    "마나카":[
        {
            id: "manaka1",
            type: "스킬3",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            skillName: "시공의 윤회",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5","LV13(14스택)","LV13+심상5(14스택)"],
            values: {
                "LV10": 12.0,
                "LV10+심상5": 13.2,
                "LV13": 15.6,
                "LV13+심상5": 16.8,
                "LV13(14스택)": 18.2,
                "LV13+심상5(14스택)": 19.6
            },
            defaultOption: "LV13+심상5(14스택)",
            value: 19.6,
            duration: "2턴",
            note: ""
        },
        {
            id: "manaka2",
            type: "패시브",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            skillName: "결심",
            value: 12.0,
            duration: "-",
            note: "성가 스택 * 1%"
        },
    ],
    "유카리":[
        {
            id: "yukari1",
            type: "의식1",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            skillName: "당겨진 활시위",
            options: [],
            value: 20.0,
            duration: "2턴",
            note: "스킬 메인 목표"
        }
    ],
    "마유미":[
        {
            id: "mayumi1",
            type: "스킬3",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            skillName: "엔진 굉음",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5"],
            values: {
                "LV10": 4.9,
                "LV10+심상5": 5.4,
                "LV13": 5.1,
                "LV13+심상5": 5.6
            },
            defaultOption: "LV13+심상5",
            value: 5.6,
            duration: "2턴",
            note: ""
        },
        {
            id: "mayumi2",
            type: "스킬3",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            skillName: "엔진 굉음 (메인목표)",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5"],
            values: {
                "LV10": 9.8,
                "LV10+심상5": 10.8,
                "LV13": 10.4,
                "LV13+심상5": 11.4
            },
            defaultOption: "LV13+심상5",
            value: 11.4,
            duration: "1턴",
            note: "스킬3 추가턴 메인 목표"
        },
        {
            id: "mayumi0",
            type: "의식0",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual0.png`,
            skillName: "급속 상승",
            options: ["1레벨","2레벨","3레벨"],
            values: {
                "1레벨": 5.0,
                "2레벨": 10.0,
                "3레벨": 15.0
            },
            defaultOption: "3레벨",
            value: 15.0,
            duration: "-",
            note: ""
        },
        {
            id: "mayumi3",
            type: "의식1",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            skillName: "풀악셀",
            options: [],
            value: 10.0,
            duration: "1턴",
            note: "스킬3 추가턴 메인 목표"
        }
    ],
    "이케나미":[
        {
            id: "ikenami0",
            type: "스킬3",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            skillName: "별들의 공연",
            options: ["LV10","LV10+심상5","LV12","LV12+심상5"],
            values: {
                "LV10": 12.0,
                "LV10+심상5": 13.2,
                "LV12": 12.5,
                "LV12+심상5": 13.7
            },
            defaultOption: "LV12+심상5",
            value: 13.7,
            duration: "2턴",
            note: "즉흥 교감(풍습) 상태 시"
        }
    ],
    "미나미":[
        {
            id: "minmami1",
            type: "의식1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            skillName: "통증 관리",
            options: [],
            value: 20.0,
            duration: "2턴",
            note: "치료량 초과 시"
        }
    ],
    "마사키":[
        {
            id: "masaki1",
            type: "의식1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            skillName: "적을 두려워하지 마라",
            options: [],
            value: 15.0,
            duration: "-",
            note: ""
        }
    ],
    "치즈코":[
        {
            id: "chizko1",
            type: "의식6",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual6.png`,
            skillName: "BOOM! BOOM!",
            options: [],
            value: 8.0,
            duration: "-",
            note: "방사선 보유 적 원소 이상 3개 이상"
        }
    ],
    "이치고":[
        {
            id: "ichigo1",
            type: "심상",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/item-mind_stat2.png`,
            skillName: "진급강화",
            options: [],
            value: 7.5,
            duration: "-",
            note: ""
        }
    ],
    "사나다":[
        {
            id: "sanada1",
            type: "의식0",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual0.png`,
            skillName: "전투의 이유",
            options: ["의식0","의식6"],
            values: {
                "의식0": 12.0,
                "의식6": 16.0
            },
            defaultOption: "의식0",
            value: 12.0,
            duration: "-",
            note: "투지 중첩 당 4%"
        },
    ],
    "유키 마코토":[
        {
            id: "yukimakoto1",
            type: "스킬3",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/skill-element/화염.png`,
            skillName: "홍련·맹화의 탐식",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5"],
            values: {
                "LV10": 11.7,
                "LV10+심상5": 12.9,
                "LV13": 12.4,
                "LV13+심상5": 13.6
            },
            defaultOption: "LV13+심상5",
            value: 13.6,
            duration: "-",
            note: "월상 4중첩"
        },
        {
            id: "yukimakoto2",
            type: "의식0",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual0.png`,
            skillName: "위대한 결단",
            options: [],
            value: 12.0,
            duration: "-",
            note: "월상 보유 시"
        },
        {
            id: "yukimakoto3",
            type: "의식1",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            skillName: "우연한 인연",
            options: [],
            value: 10.0,
            duration: "2턴",
            note: "스킬2"
        },
        {
            id: "yukimakoto4",
            type: "심상",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/item-mind_stat2.png`,
            skillName: "진급강화",
            options: [],
            value: 7.5,
            duration: "-",
            note: ""
        },
    ],
    "키라":[
        {
            id: "kira1",
            type: "패시브",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            skillName: "부패",
            options: [],
            value: 21.0,
            duration: "-",
            note: "집행관 상태"
        },
        {
            id: "kira2",
            type: "심상",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/item-mind_stat2.png`,
            skillName: "진급강화",
            options: [],
            value: 7.5,
            duration: "-",
            note: ""
        },
        {
            id: "kira3",
            type: "전용무기",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-weapon/키라-5-01.png`,
            skillName: "블러드 위브",
            options: ["개조0","개조1&2","개조3&4","개조5&6"],
            values: {
                "개조0": 25.0,
                "개조1&2": 32.5,
                "개조3&4": 40.0,
                "개조5&6": 47.5
            },
            defaultOption: "개조5&6",
            value: 47.5,
            duration: "-",
            note: "절개 대미지 한정"
        }
    ],
    "유스케":[
        {
            id: "yusuke1",
            type: "패시브",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            skillName: "조각",
            options: [],
            value: 20.0,
            duration: "1턴",
            note: "3스킬 사용"
        },
        {
            id: "yusuke2",
            type: "의식6",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual6.png`,
            skillName: "생생한 붓놀림",
            options: [],
            value: 30.0,
            duration: "-",
            note: "반격 시"
        }
    ],
    "마코토":[
        {
            id: "makoto1",
            type: "의식3",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual3.png`,
            skillName: "후발 선제",
            options: ["1중첩","2중첩","3중첩","4중첩","5중첩"],
            values: {
                "1중첩": 6.0,
                "2중첩": 12.0,
                "3중첩": 18.0,
                "4중첩": 24.0,
                "5중첩": 30.0
            },
            defaultOption: "5중첩",
            value: 30.0,
            duration: "-",
            note: "철의 의지 상태 원소이상 수"
        }
    ],
    "하루":[
        {
            id: "haru1",
            type: "의식6",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual6.png`,
            skillName: "악몽의 랩소디",
            options: [],
            value: 12.0,
            duration: "-",
            note: "조준점 보유한 적 공격 시"
        }
    ],
    "몽타뉴·백조":[
        {
            id: "mont5-1",
            type: "의식6",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual6.png`,
            skillName: "운명에 굴하지 않는 영혼",
            options: ["1중첩","2중첩","3중첩","4중첩","5중첩"],
            values: {
                "1중첩": 4.0,
                "2중첩": 8.0,
                "3중첩": 12.0,
                "4중첩": 16.0,
                "5중첩": 20.0
            },
            defaultOption: "5중첩",
            value: 20.0,
            duration: "-",
            note: "결정 1개 당"
        },
    ],
    "류지":[
        {
            id: "ryuji1",
            type: "의식3",
            target: "자신",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual3.png`,
            skillName: "쾌도난마",
            options: [],
            value: 35.0,
            duration: "-",
            note: "크리티컬 발생 시"
        }
    ],
}

const defenseCalcData = {
    "계시":[
        {
            id: 1,
            type: "계시",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/revelation/여정.webp`,
            skillName: "주권 + 여정",
            options: [],
            value: 23.0,
            duration: "2턴",
            note: ""
        },
        {
            id: 15,
            type: "계시",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/revelation/결심.webp`,
            skillName: "직책 + 결심",
            options: [],
            value: 10.0,
            duration: "2턴",
            note: ""
        },
    ],
    "원더":[
        {
            id: 2,
            type: "전용무기",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/wonder-weapon/천상의 별.webp`,
            skillName: "천상의 별",
            options: [],
            value: 22.0,
            duration: "-",
            note: ""
            },
        {
            id: "wonder-weapon1",
            type: "전용무기",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/wonder-weapon/망령의 저주.webp`,
            skillName: "망령의 저주",
            options: [],
            value: 25.0,
            duration: "3턴",
            note: ""
        },
        {
            id: 3,
            type: "전용무기",
            target: "단일/광역",
            skillIcon: `${BASE_URL}/assets/img/wonder-weapon/태고의 역장.webp`,
            skillName: "태고의 역장",
            options: ["1중첩","2중첩","3중첩","4중첩"],
            values: {
                "1중첩": 9.0,
                "2중첩": 18.0,
                "3중첩": 27.0,
                "4중첩": 36.0
            },
            defaultOption: "4중첩",
            value: 36.0,
            duration: "2턴",
            note: "원소이상 2종 이하일 경우 매 턴 원더의 공격 필수"
        },
        {
            id: "wonder-weapon-death",
            type: "전용무기",
            target: "단일/광역",
            skillIcon: `${BASE_URL}/assets/img/wonder-weapon/망자의 눈.webp`,
            skillName: "망자의 눈",
            options: ["1중첩","2중첩"],
            values: {
                "1중첩": 10.0,
                "2중첩": 20.0,
            },
            defaultOption: "2중첩",
            value: 20.0,
            duration: "2턴",
            note: "적에게 상태이상 부여 시"
        },
        {
            id: 4,
            type: "스킬",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/skill-element/디버프.png`,
            skillName: "라쿤다",
            options: [],
            value: 38.8,
            duration: "3턴",
            note: ""
        },
        {
            id: 5,
            type: "스킬",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/디버프광역.png`,
            skillName: "음률의 침입",
            options: [],
            value: 32.0,
            duration: "3턴",
            note: ""
        },
        {
            id: 6,
            type: "스킬",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/디버프광역.png`,
            skillName: "마하라쿤다",
            options: [],
            value: 27.1,
            duration: "3턴",
            note: ""
        },
        {
            id: 7,
            type: "페르소나",
            target: "단일/광역",
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/비슈누.webp`,
            skillName: "비슈누",
            options: [],
            value: 48.0,
            duration: "2턴",
            note: "풍습 부여 시"
        },
        {
            id: 8,
            type: "페르소나",
            target: "단일/광역",
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/노른.webp`,
            skillName: "노른",
            options: [],
            value: 31.5,
            duration: "2턴",
            note: "풍습 부여 시"
        },
        {
            id: 9,
            type: "페르소나",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/야노식.webp`,
            skillName: "야노식",
            options: [],
            value: 41.6,
            duration: "2턴",
            note: "[조준]"
        },
        {
            id: 10,
            type: "페르소나",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/체르노보그.webp`,
            skillName: "체르노보그 - 고유스킬",
            options: [],
            value: 10.0,
            duration: "2턴",
            note: ""
        },
        {
            id: 11,
            type: "페르소나",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/년수.webp`,
            skillName: "년수 - 고유스킬",
            options: [],
            value: 10.0,
            duration: "2턴",
            note: ""
        },
        {
            id: 12,
            type: "페르소나",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/시바.webp`,
            skillName: "시바 - 고유스킬",
            options: [],
            value: 45.0,
            duration: "1턴",
            note: "2턴마다 방어력 감소 효과 발동 가능"
        },
        {
            id: 13,
            type: "페르소나",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/스라오샤.webp`,
            skillName: "스라오샤 - 고유스킬",
            options: [],
            value: 25.0,
            duration: "1턴",
            note: "축복 속성 한정"
        },
    ],
    "카타야마":[
        {
            id: "katayama1",
            type: "스킬1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/전격광역.png`,
            skillName: "열혈 회전베기",
            options: [
                "LV10",
                "LV10+심상5",
                "LV13",
                "LV13+심상5"
            ],
            values: {
                "LV10": 48.8,
                "LV10+심상5": 53.8,
                "LV13": 51.8,
                "LV13+심상5": 56.8
            },
            defaultOption: "LV13+심상5",
            value: 56.8,
            duration: "2턴",
            note: "스킬2와 중복 불가"
        },
        {
            id: "katayama2",
            type: "스킬2",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/전격광역.png`,
            skillName: "심판의 뇌격",
            options: [
                "LV10",
                "LV10+심상5",
                "LV13",
                "LV13+심상5"
            ],
            values: {
                "LV10": 48.8,
                "LV10+심상5": 53.8,
                "LV13": 51.8,
                "LV13+심상5": 56.8
            },
            defaultOption: "LV13+심상5",
            value: 56.8,
            duration: "1턴",
            note: "스킬1과 중복 불가"
        },
        {
            id: "katayama3",
            type: "HIGHLIGHT",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/전격광역.png`,
            skillName: "HIGHLIGHT",
            options: [
                "LV10",
                "LV10+심상5",
                "LV13",
                "LV13+심상5"
                ],
            values: {
                "LV10": 29.3,
                "LV10+심상5": 32.3,
                "LV13": 31.1,
                "LV13+심상5": 34.1
            },
            defaultOption: "LV13+심상5",
            value: 34.1,
            duration: "-",
            note: "이후 적 다운 시킬 경우"
        },
        {
            id: "katayama4",
            type: "의식0",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual0.png`,
            skillName: "고효율 지휘",
            options: [],
            value: 50.0,
            duration: "",
            note: "중상"
        },
    ],
    "미나미·여름":[
        {
            id: "minami_sum1",
            type: "의식2",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual2.png`,
            skillName: "바람에 흔들리는 꽃",
            options: [],
            values: {},
            defaultOption: "",
            value: 25.0,
            duration: "3턴",
            note: "스킬1"
        }
    ],
    "이치고":[
        {
            id: "ichigo2",
            type: "의식1",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            skillName: "부서진다면",
            options: ["의식1","의식6"],
            values: {
                "의식1": 30.0,
                "의식6": 45.0
            },
            defaultOption: "의식6",
            value: 45.0,
            duration: "",
            note: "원념 중첩 당 3%"
        },
    ],
    "미오":[
        {
            id: "mio1",
            type: "스킬1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/빙결광역.png`,
            skillName: "파도의 메아리",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5"],
            values: {
                "LV10": 39.0,
                "LV10+심상5": 43.0,
                "LV13": 41.5,
                "LV13+심상5": 45.5
            },
            defaultOption: "LV13+심상5",
            value: 45.5,
            duration: "3턴",
            note: ""
        },
        {
            id: "mio2",
            type: "스킬3",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/빙결광역.png`,
            skillName: "흐름의 폭발",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5"],
            values: {
                "LV10": 36.6,
                "LV10+심상5": 40.4,
                "LV13": 38.8,
                "LV13+심상5": 42.6
            },
            defaultOption: "LV13+심상5",
            value: 42.6,
            duration: "2턴",
            note: "스킬3(강화) 중복 불가"
        },
        {
            id: "mio3",
            type: "스킬3(강화)",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/빙결광역.png`,
            skillName: "폭발의 용오름",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5"],
            values: {
                "LV10": 43.9,
                "LV10+심상5": 48.4,
                "LV13": 46.6,
                "LV13+심상5": 51.1
            },
            defaultOption: "LV13+심상5",
            value: 51.1,
            duration: "2턴",
            note: ""
        },
        {
            id: "mio4",
            type: "전용무기",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-weapon/미오-5-01.png`,
            skillName: "서리빛 스텔라",
            options: ["개조0","개조1&2","개조3&4","개조5&6"],
            values: {
                "개조0": 23.3,
                "개조1&2": 30.3,
                "개조3&4": 37.3,
                "개조5&6": 44.3
            },
            defaultOption: "개조5&6",
            value: 44.3,
            duration: "2턴",
            note: ""
        },
    ],
    "후타바":[
        {
            id: 14,
            type: "스킬1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            skillName: "소리없는 침습 (약점)",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5","LV13(의식5)","LV13(의식5)+심상5"],
            values: {
                "LV10": 60.8,
                "LV10+심상5": 65.7,
                "LV13": 75.4,
                "LV13+심상5": 80.3,
                "LV13(의식5)": 87.5,
                "LV13(의식5)+심상5": 93.1
            },
            defaultOption: "LV13(의식5)+심상5",
            value: 93.1,
            duration: "2턴",
            note: ""
        },
        {
            id: "14-2",
            charName: "",
            charImage: "",
            type: "스킬1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            skillName: "소리없는 침습",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5","LV13(의식5)","LV13(의식5)+심상5"],
            values: {
                "LV10": 30.4,
                "LV10+심상5": 32.8,
                "LV13": 37.7,
                "LV13+심상5": 40.1,
                "LV13(의식5)": 43.7,
                "LV13(의식5)+심상5": 46.6
            },
            defaultOption: "LV13(의식5)+심상5",
            value: 46.6,
            duration: "2턴",
            note: ""
        },
    ],
    "아케치":[
        {
            id: "akechi",
            type: "스킬2",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/주원광역.png`,
            skillName: "기울어진 사냥터",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5"],
            values: {
                "LV10": 25.4,
                "LV10+심상5": 28.0,
                "LV13": 26.9,
                "LV13+심상5": 29.5
            },
            defaultOption: "LV13+심상5",
            value: 29.5,
            duration: "2턴/4턴",
            note: "의식1 이상 4턴"
        },
    ],
    "몽타뉴·백조":[
        {
            id: "mont_swan1",
            type: "의식2",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual2.png`,
            skillName: "세월의 시와 바람의 탄식",
            options: [],
            values: {},
            defaultOption: "",
            value: 40.0,
            duration: "3턴",
            note: "봄 형태"
        }
    ],
    "토모코·여름":[
        {
            id: "tomoko1",
            type: "의식1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            skillName: "어김없는 빛",
            options: ["1중첩","2중첩","3중첩"],
            values: {
                "1중첩": 15.0,
                "2중첩": 30.0,
                "3중첩": 45.0
            },
            defaultOption: "3중첩",
            value: 45.0,
            duration: "3턴",
            note: "화려한 불꽃 발동 시 1중첩"
        }
    ],
    "루우나":[
        {
            id: 16,
            type: "전용무기",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-weapon/루우나-5-01.png`,
            skillName: "바이트 클로우 (스킬1 스택)",
            options: ["개조0","개조1&2","개조3&4","개조5&6"],
            values: {
                "개조0": 16.7,
                "개조1&2": 21.7,
                "개조3&4": 26.7,
                "개조5&6": 31.7
            },
            defaultOption: "개조5&6",
            value: 31.7,
            duration: "2턴",
            note: ""
        },
        {
            id: 17,
            type: "전용무기",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/character-weapon/루우나-5-01.png`,
            skillName: "바이트 클로우 (스킬2 스택)",
            options: ["개조0","개조1&2","개조3&4","개조5&6"],
            values: {
                "개조0": 33.3,
                "개조1&2": 43.3,
                "개조3&4": 53.3,
                "개조5&6": 63.3
            },
            defaultOption: "개조5&6",
            value: 63.3,
            duration: "2턴",
            note: ""
        },
        {
            id: 18,
            type: "의식0",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual0.png`,
            skillName: "모든 포옹과 따뜻함 (스킬3)",
            options: [],
            value: 18.0,
            duration: "2턴",
            note: "의식6 → 3턴으로 증가"
        },
        {
            id: "19-1",
            type: "스킬1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/화염광역.png`,
            skillName: "뜨거운 악수 (화염)",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5"],
            values: {
                "LV10": 52.8,
                "LV10+심상5": 55.6,
                "LV13": 56.2,
                "LV13+심상5": 58.7
            },
            defaultOption: "LV13+심상5",
            value: 58.7,
            duration: "2턴",
            note: "의식6 → 3턴으로 증가"
        },
        {
            id: "19-2",
            type: "스킬1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/화염광역.png`,
            skillName: "뜨거운 악수",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5"],
            values: {
                "LV10": 26.4,
                "LV10+심상5": 29.2,
                "LV13": 27.9,
                "LV13+심상5": 30.7
            },
            defaultOption: "LV13+심상5",
            value: 30.7,
            duration: "2턴",
            note: "의식6 → 3턴으로 증가"
        },
        {
            id: 20,
            type: "스킬2",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/skill-element/화염.png`,
            skillName: "악당에 대한 경고",
            options: ["LV10","LV10+심상5","LV13","LV13+심상5"],
            values: {
                "LV10": 68.3,
                "LV10+심상5": 73.9,
                "LV13": 72.5,
                "LV13+심상5": 78.0
            },
            defaultOption: "LV13+심상5",
            value: 78.0,
            duration: "2턴",
            note: "의식6 → 3턴으로 증가"
        },
    ],
    "치즈코":[
        {
            id: 21,
            type: "전용무기",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/character-weapon/치즈코-5-01.png`,
            skillName: "오버클럭 펄스",
            options: ["개조0","개조1&2","개조3&4","개조5&6"],
            values: {
                "개조0": 33.0,
                "개조1&2": 43.0,
                "개조3&4": 53.0,
                "개조5&6": 63.0
            },
            defaultOption: "개조5&6",
            value: 63.0,
            duration: "2턴",
            note: ""
        },
        {
            id: 22,
            type: "스킬1",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/skill-element/핵열.png`,
            skillName: "시그널 폭탄",
            options: [],
            value: 38.8,
            duration: "2턴",
            note: ""
        },
    ],
    "리코":[
        {
            id: "rico1",
            type: "스킬1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            skillName: "노을 그림자술",
            options: ["LV12","LV12+심상5"],
            values: {
                "LV12": 42.6,
                "LV12+심상5": 45.5
            },
            defaultOption: "LV12+심상5",
            value: 45.5,
            duration: "2턴",
            note: ""
        },
    ],
    "야오링":[
        {
            id: 23,
            type: "스킬1",
            target: "광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/주원광역.png`,
            skillName: "나룻배 사공",
            options: ["LV10","LV13","LV13+심상5"],
            values: {
                "LV10": 49.7,
                "LV13": 53.5,
                "LV13+심상5": 58.6
            },
            defaultOption: "LV13+심상5",
            value: 58.6,
            duration: "2턴",
            note: ""
        },
    ],
    "슌":[
        {
            id: 24,
            type: "전용무기",
            target: "단일/광역",
            skillIcon: `${BASE_URL}/assets/img/character-weapon/슌-5-01.png`,
            skillName: "선구자의 얼음도끼",
            options: ["개조0","개조1&2","개조3&4","개조5&6"],
            values: {
                "개조0": 30.0,
                "개조1&2": 39.0,
                "개조3&4": 48.0,
                "개조5&6": 57.0
            },
            defaultOption: "개조5&6",
            value: 57.0,
            duration: "1턴",
            note: "공격 받을 시 발동"
        },
        {
            id: 25,
            type: "스킬2",
            target: "단일",
            skillIcon: `${BASE_URL}/assets/img/skill-element/물리.png`,
            skillName: "선봉 돌격",
            options: ["LV12","LV12(황야의 구세주)"],
            values: {
                "LV12": 31.2,
                "LV12(황야의 구세주)": 62.4
            },
            defaultOption: "LV12(황야의 구세주)",
            value: 62.4,
            duration: "2턴",
            note: ""
        },
        {
            id: 26,
            type: "총기",
            target: "단일/광역",
            skillIcon: `${BASE_URL}/assets/img/skill-element/총격.png`,
            skillName: "총격",
            options: [],
            value: 35.0,
            duration: "3턴",
            note: "10.0% 고정확률, 총기 42발 (리필 24)"
        }
    ]
}; 