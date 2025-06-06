// 딜러 버프 데이터 정의
const BUFF_DATA_DEALER = {
    '유키 마코토': [
        {
            id: '유키 마코토 주',
            type : '커스텀',
            skillName: '계시 주',
            skillIcon: `${BASE_URL}/assets/img/revelation/icon-주.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 0 },
                        { type: '공격력 상수', value: 0 },
                        { type: '크리티컬 확률', value: 3.9 },
                        { type: '크리티컬 효과', value: 12.5 },
                        { type: '대미지 보너스', value: 0 },
                        { type: '관통', value: 3.8 },
                    ],
                    duration: ''
                }
            ],
            options: {
                '입력 후 옵션 선택': {
                    '자신': { '공격력 %': 0}
                },
                '공격력 상수': {
                    '자신': { '공격력 상수': 359 }
                }
            },
            isCustom: true,
            note: ''
        },
        {
            id: '유키 마코토 일',
            type : '커스텀',
            skillName: '계시 일',
            skillIcon: `${BASE_URL}/assets/img/revelation/icon-일.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 2.8 },
                        { type: '공격력 상수', value: 41 },
                        { type: '크리티컬 확률', value: 6 },
                        { type: '크리티컬 효과', value: 10.4 },
                        { type: '대미지 보너스', value: 0 },
                        { type: '관통', value: 0 },
                    ],
                    duration: ''
                }
            ],
            options: {},
            isCustom: true,
            note: ''
        },
        {
            id: '유키 마코토 월',
            type : '커스텀',
            skillName: '계시 월',
            skillIcon: `${BASE_URL}/assets/img/revelation/icon-월.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 3.5 },
                        { type: '공격력 상수', value: 0 },
                        { type: '크리티컬 확률', value: 3.4 },
                        { type: '크리티컬 효과', value: 18.2 },
                        { type: '대미지 보너스', value: 0 },
                        { type: '관통', value: 2.1 },
                    ],
                    duration: ''
                }
            ],
            options: {
                '입력 후 옵션 선택': {
                    '자신': { '공격력 %': 0}
                },
                '공격력': {
                    '자신': { '공격력 %': 31.4 }
                },
                '대미지 보너스': {
                    '자신': { '대미지 보너스': 25.1 }
                }
            },
            isCustom: true,
            note: ''
        },
        {
            id: '유키 마코토 성',
            type : '커스텀',
            skillName: '계시 성',
            skillIcon: `${BASE_URL}/assets/img/revelation/icon-성.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 3.5 },
                        { type: '공격력 상수', value: 0 },
                        { type: '크리티컬 확률', value: 3.4 },
                        { type: '크리티컬 효과', value: 0 },
                        { type: '대미지 보너스', value: 11.2 },
                        { type: '관통', value: 2.1 },
                    ],
                    duration: ''
                }
            ],
            options: {
                '입력 후 옵션 선택': {
                    '자신': { '공격력 %': 0}
                },
                '크리티컬 확률': {
                    '자신': { '크리티컬 확률': 18.8 }
                },
                '크리티컬 효과': {
                    '자신': { '크리티컬 효과': 37.6 }
                }
            },
            isCustom: true,
            note: ''
        },
        {
            id: '유키 마코토 진',
            type : '커스텀',
            skillName: '계시 진',
            skillIcon: `${BASE_URL}/assets/img/revelation/icon-진.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 0 },
                        { type: '공격력 상수', value: 0 },
                        { type: '크리티컬 확률', value: 8.6 },
                        { type: '크리티컬 효과', value: 3.4 },
                        { type: '대미지 보너스', value: 0 },
                        { type: '관통', value: 1.4 },
                    ],
                    duration: ''
                }
            ],
            options: {
                '입력 후 옵션 선택': {
                    '자신': { '공격력 %': 0}
                },
                '공격력': {
                    '자신': { '공격력 %': 31.4 }
                }
            },
            isCustom: true,
            note: ''
        },
        {
            id: '유키 마코토 계시',
            type: '계시',
            skillName: '희망 고집',
            skillIcon: `${BASE_URL}/assets/img/revelation/희망.webp`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 37 },
                    ],
                    duration: '3턴'
                },
                {
                    target: '자신',
                    effects: [
                        { type: '대미지 보너스', value: 24 },
                        { type: '크리티컬 확률', value: 6 },
                    ],
                    duration: '3턴'
                }
            ],
            options: {
            },
        },
        {
            id: '유키 마코토 전용무기',
            type: '전용무기',
            skillName: '데오스사이포스',
            skillIcon: `${BASE_URL}/assets/img/character-weapon/유키 마코토-5-01.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 57 },
                        { type: '크리티컬 확률', value: 31 },
                        { type: '대미지 보너스', value: 64 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                '개조6': {
                    '자신': { '공격력 %': 57, '크리티컬 확률': 31, '대미지 보너스': 64 }
                },
                '개조5': {
                    '자신': { '공격력 %': 48, '크리티컬 확률': 31, '대미지 보너스': 64 }
                },
                '개조4': {
                    '자신': { '공격력 %': 48, '크리티컬 확률': 26.1, '대미지 보너스': 54 }
                },
                '개조3': {
                    '자신': { '공격력 %': 39, '크리티컬 확률': 26.1, '대미지 보너스': 54 }
                },
                '개조2': {
                    '자신': { '공격력 %': 39, '크리티컬 확률': 21.2, '대미지 보너스': 44 }
                },
                '개조1': {
                    '자신': { '공격력 %': 30, '크리티컬 확률': 21.2, '대미지 보너스': 44 }
                },
                '개조0': {
                    '자신': { '공격력 %': 30, '크리티컬 확률': 16.3, '대미지 보너스': 34 }
                }
            },
        },
        {
            id: '유키 마코토 스킬2',
            type: '스킬2',
            skillName : '월하의 전투곡',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '크리티컬 효과', value: 27.3 }
                    ],
                    duration: '2턴'
                },
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 22.7 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '크리티컬 효과': 27.3 },
                    '자신': { '공격력 %': 22.7 }
                },
                'LV13': {
                    '아군 전체': { '크리티컬 효과': 24.9 },
                    '자신': { '공격력 %': 20.7 }
                },
                'LV10+심상5': {
                    '아군 전체': { '크리티컬 효과': 25.8 },
                    '자신': { '공격력 %': 21.5 }
                },
                'LV10': {
                    '아군 전체': { '크리티컬 효과': 23.4 },
                    '자신': { '공격력 %': 19.5 }
                }
            }
        },
        {
            id: '유키 마코토 스킬3',
            type: '스킬3',
            skillName: '홍련 맹화의 탐식',
            skillIcon: `${BASE_URL}/assets/img/skill-element/화염.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '관통', value: 13.6 },
                        { type: '대미지 보너스', value: 28.4 },
                    ],
                    duration: '',
                    note: '월상 4중첩',
                    condition: '홍련 맹화의 탐식'
                }
            ],
            options: {
                'LV13+심상5': {
                    '자신': { '관통': 13.6, '대미지 보너스': 28.4 }
                },
                'LV13': {
                    '자신': { '관통': 12.4, '대미지 보너스': 25.9 }
                },
                'LV10+심상5': {
                    '자신': { '관통': 12.9, '대미지 보너스': 26.9 }
                },
                'LV10': {
                    '자신': { '관통': 11.7, '대미지 보너스': 24.4 }
                }
            },
        },
        {
            id: '유키 마코토 테우르기아1',
            type: '테우르기아',
            skillName: '테우르기아 - 카덴차',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 22.7 },
                        { type: '공격력 %', value: 28.4 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '대미지 보너스': 22.7, '공격력 %': 28.4 }
                },
                'LV13': {
                    '아군 전체': { '대미지 보너스': 21.2, '공격력 %': 26.5 }
                },
                'LV10+심상5': {
                    '아군 전체': { '대미지 보너스': 21.5, '공격력 %': 26.9 }
                },
                'LV10': {
                    '아군 전체': { '대미지 보너스': 20.0, '공격력 %': 25.0 }
                }
            },
            note: ''
        },
            
        {
            id: '유키 마코토 패시브1',
            type: '패시브',
            skillName: '리드',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 40 },
                    ],
                    duration: '2턴',
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 20 },
                    ],
                    duration: '2턴',
                    condition: 'SEES'
                }
            ],
            options: {
            },
        },
        {
            id: '유키 마코토 패시브2',
            type: '패시브',
            skillName: '신뢰',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '크리티컬 효과', value: 21.6 },
                    ],
                    duration: '2턴',
                }
            ],
            options: {
            },
        },
        {
            id: '유키 마코토 지원 기술',
            type: '지원 기술',
            skillName: '지원 기술',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력', value: 20 },
                    ],
                }
            ],
            note: ''
        },
        {
            id: '유키 마코토 의식0',
            type: '의식0',
            skillName: '위대한 결단',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual0.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '관통', value: 12 },
                    ],
                }
            ],
            options: {
            },
        },
        {
            id: '유키 마코토 의식1',
            type: '의식1',
            skillName: '우연한 인연',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '관통', value: 10 },
                    ],
                    duration: '2턴',
                    note: '2스킬 사용 시'
                },
                {
                    target: '자신',
                    effects: [
                        { type: '크리티컬 확률', value: 16 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
            },
        },
        {
            id: '유키 마코토 의식4',
            type: '의식4',
            skillName: '가시밭길',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual4.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 10 },
                    ],
                    duration: '2턴',
                    note: '카덴차 사용 시'
                }
            ],
            options: {
            },
        },
        {
            id: '유키 마코토 의식6',
            type: '의식6',
            skillName: '맹세의 서약',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual6.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '독립 배수', value: 20 },
                    ],
                    duration: '',
                    note: '특수월상 보유 시',
                    condition: '홍련 맹화의 탐식'
                }
            ],
            options: {
            },
        }
    ],
    '야오링·사자무': [
    ],
    '렌': [
        {
            id: '렌 주',
            type : '커스텀',
            skillName: '계시 주',
            skillIcon: `${BASE_URL}/assets/img/revelation/icon-주.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 0 },
                        { type: '공격력 상수', value: 0 },
                        { type: '크리티컬 확률', value: 3.7 },
                        { type: '크리티컬 효과', value: 12.6 },
                        { type: '대미지 보너스', value: 0 },
                        { type: '관통', value: 5.2 },
                    ],
                    duration: ''
                }
            ],
            options: {
                '입력 후 옵션 선택': {
                    '자신': { '공격력 %': 0}
                },
                '공격력 상수': {
                    '자신': { '공격력 상수': 359 }
                }
            },
            isCustom: true,
            note: ''
        },
        {
            id: '렌 일',
            type : '커스텀',
            skillName: '계시 일',
            skillIcon: `${BASE_URL}/assets/img/revelation/icon-일.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 5.6 },
                        { type: '공격력 상수', value: 0 },
                        { type: '크리티컬 확률', value: 3.1 },
                        { type: '크리티컬 효과', value: 8.3 },
                        { type: '대미지 보너스', value: 0 },
                        { type: '관통', value: 5.4 },
                    ],
                    duration: ''
                }
            ],
            options: {},
            isCustom: true,
            note: ''
        },
        {
            id: '렌 월',
            type : '커스텀',
            skillName: '계시 월',
            skillIcon: `${BASE_URL}/assets/img/revelation/icon-월.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 0 },
                        { type: '공격력 상수', value: 0 },
                        { type: '크리티컬 확률', value: 5.7 },
                        { type: '크리티컬 효과', value: 10.0 },
                        { type: '대미지 보너스', value: 4.6 },
                        { type: '관통', value: 0.0 },
                    ],
                    duration: ''
                }
            ],
            options: {
                '입력 후 옵션 선택': {
                    '자신': { '공격력 %': 0}
                },
                '공격력': {
                    '자신': { '공격력 %': 31.4 }
                },
                '대미지 보너스': {
                    '자신': { '대미지 보너스': 25.1 }
                }
            },
            isCustom: true,
            note: ''
        },
        {
            id: '렌 성',
            type : '커스텀',
            skillName: '계시 성',
            skillIcon: `${BASE_URL}/assets/img/revelation/icon-성.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 6.7 },
                        { type: '공격력 상수', value: 0 },
                        { type: '크리티컬 확률', value: 0 },
                        { type: '크리티컬 효과', value: 5.9 },
                        { type: '대미지 보너스', value: 4.6 },
                        { type: '관통', value: 0 },
                    ],
                    duration: ''
                }
            ],
            options: {
                '입력 후 옵션 선택': {
                    '자신': { '공격력 %': 0}
                },
                '크리티컬 확률': {
                    '자신': { '크리티컬 확률': 18.8 }
                },
                '크리티컬 효과': {
                    '자신': { '크리티컬 효과': 37.6 }
                }
            },
            isCustom: true,
            note: ''
        },
        {
            id: '렌 진',
            type : '커스텀',
            skillName: '계시 진',
            skillIcon: `${BASE_URL}/assets/img/revelation/icon-진.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 0 },
                        { type: '공격력 상수', value: 74 },
                        { type: '크리티컬 확률', value: 8.3 },
                        { type: '크리티컬 효과', value: 3.5 },
                        { type: '대미지 보너스', value: 0 },
                        { type: '관통', value: 0.0 },
                    ],
                    duration: ''
                }
            ],
            options: {
                '입력 후 옵션 선택': {
                    '자신': { '공격력 %': 0}
                },
                '공격력': {
                    '자신': { '공격력 %': 31.4 }
                }
            },
            isCustom: true,
            note: ''
        },
        {
            id: '렌 계시',
            type: '계시',
            skillName: '여정 방해',
            skillIcon: `${BASE_URL}/assets/img/revelation/여정.webp`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '대미지 보너스', value: 30 },
                        { type: '공격력 %', value: 30 },
                    ],
                    duration: '3턴'
                }
            ],
            options: {
            },
        },
        {
            id: '렌 전용무기',
            type: '전용무기',
            skillName: '불사조',
            skillIcon: `${BASE_URL}/assets/img/character-weapon/렌-5-01.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 57 },
                        { type: '대미지 보너스', value: 101 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
            },
        },
        {
            id: '렌 패시브1',
            type: '패시브',
            skillName: '복수',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 90 },
                    ],
                    duration: '',
                    note: '반역의 의지 5'
                }
            ],
        },
        {
            id: '렌 패시브2',
            type: '패시브',
            skillName: '패시브',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '대미지 보너스', value: 72 },
                    ],
                    duration: '',
                    condition: '추가 턴'
                }
            ]
        },
        {
            id: '렌 의식1',
            type: '의식1',
            skillName: '춤추는 패',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '독립 배수', value: 30 },
                    ],
                    duration: '',
                    note: '메인 목표'
                }
            ]
        },
        {
            id: '렌 의식3',
            type: '의식3',
            skillName: '신비로움',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual3.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '공격력 %', value: 50 },
                    ],
                    duration: '',
                    note: 'SP 60%'
                }
            ]
        },
        {
            id: '렌 심상',
            type: '심상',
            skillName: '진급강화',
            skillIcon: `${BASE_URL}/assets/img/character-detail/item-mind_stat2.png`,
            targets: [
                {
                    target: '자신',
                    effects: [
                        { type: '크리티컬 확률', value: 12 },
                        { type: '대미지 보너스', value: 16 },
                        { type: '공격력 상수', value: 240 },
                    ],
                    duration: '',
                    note: ''
                }
            ]
        }
    ]
};
