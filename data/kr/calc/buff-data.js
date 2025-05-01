// 버프 데이터 정의
const BUFF_DATA = {
    '원더': [
        {
            id: '무한 알고리즘',
            type: '스킬',
            skillName: '무한 알고리즘',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 30 },
                    ],
                    duration: '2턴'
                },
                {
                    target: '메인 목표',
                    effects: [
                        { type: '대미지 보너스', value: 20 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
            },
        },
        {
            id: '리벨리온',
            type: '스킬',
            skillName: '리벨리온',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '크리티컬 확률', value: 15.7 },
                    ],
                    duration: '1턴'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '레볼루션',
            type: '스킬',
            skillName: '레볼루션',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '크리티컬 확률', value: 10.9 },
                    ],
                    duration: '3턴'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '타루카쟈',
            type: '스킬',
            skillName: '타루카쟈',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 %', value: 25.9 },
                    ],
                    duration: '3턴'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '마하타루카쟈',
            type: '스킬',
            skillName: '마하타루카쟈',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 18.1 },
                    ],
                    duration: '3턴'
                }
            ],
            
        },
        {
            id: '라쿤다',
            type: '스킬',
            skillName: '라쿤다',
            skillIcon: `${BASE_URL}/assets/img/skill-element/디버프.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 38.8 },
                    ],
                    duration: '3턴'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '음률의 침입',
            type: '스킬',
            skillName: '음률의 침입',
            skillIcon: `${BASE_URL}/assets/img/skill-element/디버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 32.0 },
                        { type: '대미지 보너스', value: 10.0 },
                    ],
                    duration: '3턴'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '마하라쿤다',
            type: '스킬',
            skillName: '마하라쿤다',
            skillIcon: `${BASE_URL}/assets/img/skill-element/디버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 27.1 },
                    ],
                    duration: '3턴'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '디오니소스1',
            type: '본능',
            skillName: '디오니소스 - 본능',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/디오니소스.webp`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '크리티컬 효과', value: 30 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
            },
        },
        {
            id: '광목천1',
            type: '본능',
            skillName: '광목천 - 본능',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/광목천.webp`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 %', value: 14 },
                        { type: '크리티컬 확률', value: 6 }
                    ],
                    duration: '3턴'
                }
            ],
            options: {
            },
            note: '전투 시작 시'
        },
        {
            id: '황룡1',
            type: '본능',
            skillName: '황룡 - 본능',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/황룡.webp`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 15 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
            },
            note: '사상의 힘 4중첩'
        },
        {
            id: '비슈누1',
            type: '본능',
            skillName: '비슈누 - 본능',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/비슈누.webp`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 48 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
            },
            note: '풍습 부여 시'
        },
        {
            id: '비슈누2',
            type: '스킬',
            skillName: '비슈누 - 적을 멸하는 바람',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/비슈누.webp`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 27 },
                    ],
                    duration: '2턴',
                    condition: '질풍'
                }
            ],
            options: {
            },
            note: '풍습 상태인 경우'
        },
        {
            id: "유룽1",
            type: '본능',
            skillName: '유룽 - 본능',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/유룽.webp`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '크리티컬 효과', value: 29 },
                    ],
                    duration: ''
                }
            ],
            options: {
                '감전' : {
                    '아군 전체': { '크리티컬 효과': 29 }
                },
                '일반' : {
                    '아군 전체': { '크리티컬 효과': 18 }
                }
            },
            note: ''
        },
        {
            id: '아메노우즈메1',
            type: '본능',
            skillName: '아메노우즈메 - 본능',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/아메노우즈메.webp`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '크리티컬 확률', value: 10.9 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
            },
            note: '감전 부여 시'
        },
        {
            id: '도미니온1',
            type: '본능',
            skillName: '도미니온 - 본능',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/도미니온.webp`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '대미지 보너스', value: 15 },
                        { type: '공격력 %', value: 6.4 },
                    ],
                    duration: '1턴'
                }
            ],
            options: {
            },
            note: '버프 후 동료가 페르소나 스킬로 대미지'
        },
        {
            id: '도미니온2',
            type: '스킬',
            skillName: '도미니온 - 응집',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/도미니온.webp`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '대미지 보너스', value: 16 }
                    ],
                    duration: '1턴'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 25 }
                    ],
                    duration: '2턴',
                    condition: ''
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '스라오샤1',
            type: '본능',
            skillName: '스라오샤 - 본능',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/스라오샤.webp`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '대미지 보너스', value: 6 },
                        { type: '방어력 감소', value: 25 },
                    ],
                    duration: '1턴',
                    condition: '축복'
                }
            ],
            options: {
            },
            note: '신의 귀 3중첩'
        },
        {
            id: '스라오샤2',
            type: '스킬',
            skillName: '스라오샤 - 절대복종',
            skillIcon: `${BASE_URL}/assets/img/tactic-persona/스라오샤.webp`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '대미지 보너스', value: 30 }
                    ],
                    duration: '1턴',
                    condition: 'HIGHLIGHT'
                }
            ],
            options: {
            },
            note: ''
        },
    ],
    // 마나카
    '마나카': [
        {
            id: '마나카 스킬1',
            type: '스킬1',
            skillName: '천공의 노래',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 42.7 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '대미지 보너스': 42.7 }
                },
                'LV13': {
                    '아군 전체': { '대미지 보너스': 39.2 }
                },
                'LV10+심상5': {
                    '아군 전체': { '대미지 보너스': 39.5 }
                },
                'LV10': {
                    '아군 전체': { '대미지 보너스': 35.0 }
                }
            },
            note: ''
        },
        {
            id: '마나카 스킬3',
            type: '스킬3',
            skillName: '시공의 윤회',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [ 
                        { type: '공격력 상수', value: 864.4 },
                        { type: '공격력 %', value: 19.6 },
                        { type: '관통', value: 19.6 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5 (14스택)': {
                    '아군 전체': { '공격력 상수': 864.4, '공격력 %': 19.6, '관통': 19.6 }
                },
                'LV13 (14스택)': {
                    '아군 전체': { '공격력 상수': 800.8, '공격력 %': 18.2, '관통': 18.2 }
                },
                'LV10+심상5': {
                    '아군 전체': { '공격력 상수': 697.6, '공격력 %': 13.2, '관통': 13.2 }
                },
                'LV10': {
                    '아군 전체': { '공격력 상수': 634.0, '공격력 %': 12.0, '관통': 12.0 }
                }
            },
        },
        {
            id: '마나카 패시브1',
            type: '패시브1',
            skillName: '날갯짓',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 %', value: 37.5 }
                    ],
                    duration: '',
                    condition: '천계의 선율'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '마나카 패시브2',
            type: '패시브2',
            skillName: '결심',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '관통', value: 12.0 }
                    ],
                    duration: ''
                }
            ],
            options: {
            },
            note: '성가*1%'
        },
        {
            id: '마나카 의식1',
            type: '의식1',
            skillName: '시작의 멜로디',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '크리티컬 확률', value: 12.0 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
            },
            note: '3스킬'
        },
        {
            id: '마나카 의식2',
            type: '의식2',
            skillName: '꿈꾸는 출항',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual2.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '독립 배수', value: 12.0 }
                    ],
                    duration: '',
                    condition: '천계의 선율'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '마나카 전용무기',
            type: '전용무기',
            skillName: '천상의 속삭임',
            skillIcon: `${BASE_URL}/assets/img/character-weapon/마나카-5-01.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 15.6 },
                        { type: '크리티컬 효과', value: 27.9 },
                    ],
                    duration: ''
                }
            ],
            options: {
                '개조5&6': {
                    '아군 전체': { '대미지 보너스': 15.6, '크리티컬 효과': 27.9 }
                },
                '개조3&4': {
                    '아군 전체': { '대미지 보너스': 13.2, '크리티컬 효과': 23.7 }
                },
                '개조1&2': {
                    '아군 전체': { '대미지 보너스': 10.8, '크리티컬 효과': 19.5 }
                },
                '개조0': {
                    '아군 전체': { '대미지 보너스': 8.4, '크리티컬 효과': 15.3 }
                }
            },
            note: ''
        }
    ],
    // 이케나미
    '이케나미': [
        {
            id: '이케나미 스킬1',
            type: '스킬1',
            skillName: '빛나는 독백',
            skillIcon: `${BASE_URL}/assets/img/skill-element/축복.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value:38.7 }
                    ],
                    duration: '2턴',
                    note: '축복 2중첩 획득'
                }
            ]
        },
        {
            id: '이케나미 스킬3',
            type: '스킬3',
            skillName: '별들의 공연',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 상수', value: 650.0 }
                    ],
                    duration: '2턴',
                }
            ]
        },
        {
            id: '이케나미 스킬3-1',
            type: '스킬3',
            skillName: '별들의 공연 추가효과(침투)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '독립 배수', value: 16.0 }
                    ],
                    duration: '2턴',
                    note: '의식6 4턴',
                    condition: '지속 대미지'
                }
            ]
        },
        {
            id: '이케나미 스킬3-2',
            type: '스킬3',
            skillName: '별들의 공연 추가효과(전복)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '스킬 마스터', value: 749.0 }
                    ],
                    duration: '2턴',
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 20.0 }
                    ],
                    duration: '2턴',
                    note: '의식6 4턴',
                    condition: 'TECHNICAL'
                }
            ]
        },
        {
            id: '이케나미 스킬3-3',
            type: '스킬3',
            skillName: '별들의 공연 추가효과(공감)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '크리티컬 효과', value: 27.9 }
                    ],
                    duration: '2턴',
                    note: '의식6 4턴'
                }
            ]
        },
        {
            id: '이케나미 스킬3-4',
            type: '스킬3',
            skillName: '별들의 공연 추가효과(교감)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '관통', value: 13.7 }
                    ],
                    duration: '2턴',
                    note: '의식6 4턴'
                }
            ]
        },
        {
            id : '이케나미 하이라이트',
            type: 'HL',
            skillName: '하이라이트',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력', value: 314.0 }
                    ],
                    duration: '2턴',
                    note: '의식4 축복 3중첩 획득'
                }
            ]
        },
        {
            id: '이케나미 패시브1',
            type: '패시브1',
            skillName: '본색',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 25.0 }
                    ],
                }
            ],
            options: {
                '5중첩': {
                    '아군 전체': { '대미지 보너스': 25.0 }
                },
                '4중첩': {
                    '아군 전체': { '대미지 보너스': 20.0 }
                },
                '3중첩': {
                    '아군 전체': { '대미지 보너스': 15.0 }
                },
                '2중첩': {
                    '아군 전체': { '대미지 보너스': 10.0 }
                },
                '1중첩': {
                    '아군 전체': { '대미지 보너스': 5.0 }
                }
            },
            note: '축복 중첩 수'
        },
        {
            id: '이케나미 의식1',
            type: '의식1',
            skillName: '다시 만나요! 나를 기억해해',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 15.0 }
                    ]
                }
            ],
            options: {
                '5중첩': {
                    '아군 전체': { '대미지 보너스': 15.0 }
                },
                '4중첩': {
                    '아군 전체': { '대미지 보너스': 12.0 }
                },
                '3중첩': {
                    '아군 전체': { '대미지 보너스': 9.0 }
                },
                '2중첩': {
                    '아군 전체': { '대미지 보너스': 6.0 }
                },
                '1중첩': {
                    '아군 전체': { '대미지 보너스': 3.0 }
                }
            },
            note: '축복 중첩 수'
        },
        {
            id: '이케나미 의식4',
            type: '의식4',
            skillName: '미약하지만 부러지지 않는 의지',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual4.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 %', value: 10.0 }
                    ],
                    duration: '2턴',
                    note: '하이라이트 강화'
                }
            ]
        },
        {
            id: '이케나미 전용무기',
            type: '전용무기',
            skillName: '백야의 성흔',
            skillIcon: `${BASE_URL}/assets/img/character-weapon/이케나미-5-01.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '대미지 보너스', value: 20.0 }
                    ],
                    duration: '2턴',
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 39.0 }
                    ],
                    duration: ''
                }
            ],
            options: {
                '개조5&6': {
                    '메인 목표': { '대미지 보너스': 20.0 },
                    '아군 전체': { '공격력 %': 39.0 }
                },
                '개조3&4': {
                    '메인 목표': { '대미지 보너스': 17.0 },
                    '아군 전체': { '공격력 %': 33.0 }
                },
                '개조1&2': {
                    '메인 목표': { '대미지 보너스': 14.0 },
                    '아군 전체': { '공격력 %': 27.0 }
                },
                '개조0': {
                    '메인 목표': { '대미지 보너스': 11.0 },
                    '아군 전체': { '공격력 %': 21.0 }
                }
            },
            note: ''
        }
            
    ],

    // 마유미
    '마유미': [
        {
            id: '마유미 스킬1',
            type: '스킬1',
            skillName: '소용돌이 억압',
            skillIcon: `${BASE_URL}/assets/img/skill-element/물리광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 51.1 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '대미지 보너스': 51.1 }
                },
                'LV13': {
                    '아군 전체': { '대미지 보너스': 46.6 }
                },
                'LV10+심상5': {
                    '아군 전체': { '대미지 보너스': 48.4 }
                },
                'LV10': {
                    '아군 전체': { '대미지 보너스': 43.9 }
                }
            },
            note: ''
        },
        {
            id: '마유미 스킬2',
            type: '스킬2',
            skillName: '과부하 가속',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 51.1 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '공격력 %': 51.1 }
                },
                'LV13': {
                    '아군 전체': { '공격력 %': 46.6 }
                },
                'LV10+심상5': {
                    '아군 전체': { '공격력 %': 48.4 }
                },
                'LV10': {
                    '아군 전체': { '공격력 %': 43.9 }
                }
            },
            note: '방어력 % 버프 존재'
        },
        {
            id: '마유미 스킬3',
            type: '스킬3',
            skillName: '엔진 굉음',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '관통', value: 5.6 }
                    ],
                    duration: '2턴'
                },
                {
                    target: '메인 목표',
                    effects: [
                        { type: '관통', value: 11.4 }
                    ],
                    duration: '1턴',
                    note: '추가 턴 시전'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '관통': 5.6 },
                    '메인 목표': { '관통': 11.4 }
                },
                'LV13': {
                    '아군 전체': { '관통': 5.1 },
                    '메인 목표': { '관통': 10.4 }
                },
                'LV10+심상5': {
                    '아군 전체': { '관통': 5.4 },
                    '메인 목표': { '관통': 10.8 }
                },
                'LV10': {
                    '아군 전체': { '관통': 4.9 },
                    '메인 목표': { '관통': 9.8 }
                }
            },
            note: ''
        },
        {
            id: '마유미 하이라이트',
            type: 'HL',
            skillName: '하이라이트',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 34.1 },
                        { type: '대미지 보너스', value: 34.1 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '공격력 %': 34.1, '대미지 보너스': 34.1 }
                },
                'LV13': {
                    '아군 전체': { '공격력 %': 31.1, '대미지 보너스': 31.1 }
                },
                'LV10+심상5': {
                    '아군 전체': { '공격력 %': 32.3, '대미지 보너스': 32.3 }
                },
                'LV10': {
                    '아군 전체': { '공격력 %': 29.3, '대미지 보너스': 29.3 }
                }
            },
            note: '의식4 지속시간 3턴'
        },
        {
            id: '마유미 패시브1',
            type: '패시브1',
            skillName: '선두',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 30.0 }
                    ],
                    duration: '1턴',
                    condition: '추가 턴'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '마유미 의식0',
            type: '의식0',
            skillName: '급속 상승',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual0.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '관통', value: 15.0 }
                    ],
                    duration: '',
                }
            ],
            options: {
                '3단계': {
                    '아군 전체': { '관통': 15.0 }
                },
                '2단계': {
                    '아군 전체': { '관통': 10.0 }
                },
                '1단계': {
                    '아군 전체': { '관통': 5.0 }
                },
            },
            note: ''
        },
        {
            id: '마유미 의식1',
            type: '의식1',
            skillName: '풀악셀',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '관통', value: 10.0 }
                    ],
                    duration: '1턴',
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '마유미 의식2',
            type: '의식2',
            skillName: '감속 시 충돌',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual2.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 20.0 },
                        { type: '공격력 %', value: 20.0 },
                        { type: '크리티컬 효과', value: 20.0 },
                    ],
                    duration: '',
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '마유미 의식4',
            type: '의식4',
            skillName: '위기 무시',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual4.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 10.0 }
                    ],
            duration: '3턴',
                }
            ],
            options: {
            },
            note: 'HL 강화'
        },
        {
            id: '마유미 의식6',
            type: '의식6',
            skillName: '질주에 대한 갈망',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual6.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 25.0 }
                    ],
                    duration: '1턴',
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '마유미 전용무기',
            type: '전용무기',
            skillName: '승리선언',
            skillIcon: `${BASE_URL}/assets/img/character-weapon/마유미-5-01.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 32.0 }
                    ],
                    duration: '2턴',
                }
            ],
            options: {
                '개조5&6': {
                    '아군 전체': { '대미지 보너스': 32.0 }
                },
                '개조3&4': {
                    '아군 전체': { '대미지 보너스': 27.0 }
                },
                '개조1&2': {    
                    '아군 전체': { '대미지 보너스': 22.0 }
                },
                '개조0': {
                    '아군 전체': { '대미지 보너스': 17.0 }
                }
            },
            note: ''
        }
    ],
    // 아케치
    '아케치': [
        {
            id: '아케치 스킬1',
            type: '스킬1',
            skillName: '화려한 화살',
            skillIcon: `${BASE_URL}/assets/img/skill-element/축복광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 22.7 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '대미지 보너스': 22.7 }
                },
                'LV13': {
                    '아군 전체': { '대미지 보너스': 20.7 }
                },
                'LV10+심상5': {
                    '아군 전체': { '대미지 보너스': 21.5 }
                },
                'LV10': {
                    '아군 전체': { '대미지 보너스': 19.5 }
                }
            },
            note: '의식1 지속시간 4턴'
        },
        {
            id: '아케치 스킬2',
            type: '스킬2',
            skillName: '기울어진 사냥터',
            skillIcon: `${BASE_URL}/assets/img/skill-element/주원광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 29.5 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '방어력 감소': 29.5 }
                },
                'LV13': {
                    '아군 전체': { '방어력 감소': 26.9 }
                },
                'LV10+심상5': {
                    '아군 전체': { '방어력 감소': 28.0 }
                },
                'LV10': {
                    '아군 전체': { '방어력 감소': 25.4 }
                }
            },
            note: '의식1 지속시간 4턴'
        },
        {
            id: '아케치 스킬3',
            type: '스킬3',
            skillName: '황금 화살비·파멸',
            skillIcon: `${BASE_URL}/assets/img/skill-element/만능광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '독립 배수', value: 22.7 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '독립 배수': 22.7 }
                },
                'LV13': {
                    '아군 전체': { '독립 배수': 20.7 }
                },
                'LV10+심상5': {
                    '아군 전체': { '독립 배수': 21.5 }
                },
                'LV10': {
                    '아군 전체': { '독립 배수': 19.5 }
                }
            },
            note: ''
        },
        {
            id: '아케치 의식1',
            type: '의식1',
            skillName: '혐의 조사',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '대미지 보너스', value: 25.0 }
                    ],
                    duration: '',
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '아케치 의식1 (의식6)',
            type: '의식1',
            skillName: '혐의 조사 (의식 6)',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 25.0 }
                    ],
                    duration: '',
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '아케치 의식2',
            type: '의식2',
            skillName: '실마리',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual2.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 %', value: 25.0 },
                        { type: '크리티컬 효과', value: 30.0 },
                    ],
                    duration: '1턴',
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '아케치 의식2 (의식6)',
            type: '의식2',
            skillName: '실마리 (의식 6)',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual2.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 25.0 },
                        { type: '크리티컬 효과', value: 30.0 },
                    ],
                    duration: '1턴',
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '아케치 전용무기',
            type: '전용무기',
            skillName: '신의 심판',
            skillIcon: `${BASE_URL}/assets/img/character-weapon/아케치-5-01.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 40.0 }
                    ],
                    duration: '2턴',
                }
            ],
            options: {
                '개조6': {
                    '아군 전체': { '공격력 %': 40.0 }
                },
                '개조4&5': {
                    '아군 전체': { '공격력 %': 33.7 }
                },
                '개조2&3': {
                    '아군 전체': { '공격력 %': 27.3 }
                },
                '개조0&1': {
                    '아군 전체': { '공격력 %': 21.0 }
                }
            },
            note: ''
        }
    ],
    // 미오
    '미오': [
        {
            id: '미오 스킬1',
            type: '스킬1',
            skillName: '파도의 메아리',
            skillIcon: `${BASE_URL}/assets/img/skill-element/빙결광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 45.5 },
                        { type: '스킬 마스터', value: 1136 }
                    ],
                    duration: '3턴',
                    note: '타오르는 숨결'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '방어력 감소': 45.5, '스킬 마스터': 1136 }
                },
                'LV13': {
                    '아군 전체': { '방어력 감소': 41.5, '스킬 마스터': 1036 }
                },
                'LV10+심상5': {
                    '아군 전체': { '방어력 감소': 43.0, '스킬 마스터': 1076 }
                },
                'LV10': {
                    '아군 전체': { '방어력 감소': 39.0, '스킬 마스터': 976 }
                }
            },
            note: ''
        },
        {
            id: '미오 스킬3',
            type: '스킬3',
            skillName: '흐름의 폭발 (4중첩)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/빙결광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 51.1 },
                        { type: '대미지 보너스', value: 68.1 }
                    ],
                    duration: '2턴',
                    note: '빙결 TECHNICAL'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '방어력 감소': 51.1, '대미지 보너스': 68.1 }
                },
                'LV13': {
                    '아군 전체': { '방어력 감소': 46.6, '대미지 보너스': 62.1 }
                },
                'LV10+심상5': {
                    '아군 전체': { '방어력 감소': 48.4, '대미지 보너스': 64.5 }
                },
                'LV10': {
                    '아군 전체': { '방어력 감소': 44.9, '대미지 보너스': 58.5 }
                }
            },
            note: ''
        },
        {
            id: '미오 하이라이트',
            type: 'HL',
            skillName: '하이라이트',
            skillIcon: `${BASE_URL}/assets/img/skill-element/빙결광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 34.1 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '대미지 보너스': 34.1 }
                },
                'LV13': {
                    '아군 전체': { '대미지 보너스': 31.1 }
                },
                'LV10+심상5': {
                    '아군 전체': { '대미지 보너스': 32.3 }
                },
                'LV10': {
                    '아군 전체': { '대미지 보너스': 29.3 }
                }
            },
            note: '의식4 지속시간 3턴'
        },
        {
            id: '미오 패시브2',
            type: '패시브2',
            skillName: '위협',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 27.0 }
                    ],
                    duration: '',
                    note: '동결 상태 적'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '미오 의식0',
            type: '의식0',
            skillName: '억제되는 불의 파도',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual0.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 24.0 }
                    ],
                    duration: '2턴',
                    note: '익수 4스택'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '미오 의식1',
            type: '의식1',
            skillName: '소방 문서',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '크리티컬 효과', value: 30.0 }
                    ],
                    duration: '2턴',
                    note: '3스킬'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '미오 의식2',
            type: '의식2',
            skillName: '불의 억제',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual2.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 15.0 },
                        { type: '공격력 %', value: 20.0 }
                    ],
                    duration: '2턴',
                    note: '3스킬'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '미오 의식6',
            type: '의식6',
            skillName: '소멸하는 에도의 꽃',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual6.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 25.0 },
                    ],
                    duration: '1턴',
                    note: '3스킬 연속 사용 시'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 12.0 },
                    ],
                    duration: '2턴',
                    note: '익수 중첩 상한 6회'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '미오 전용무기',
            type: '전용무기',
            skillName: '서리빛 스텔라',
            skillIcon: `${BASE_URL}/assets/img/character-weapon/미오-5-01.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 44.3 }
                    ],
                    duration: '2턴',
                    note: '빙결 TECHNICAL 시'
                }
            ],
            options: {
                '개조5&6': {
                    '아군 전체': { '방어력 감소': 44.3 }
                },
                '개조3&4': {
                    '아군 전체': { '방어력 감소': 37.3 }
                },
                '개조1&2': {
                    '아군 전체': { '방어력 감소': 30.3 }
                },
                '개조0': {
                    '아군 전체': { '방어력 감소': 23.3 }
                }
            },
            note: ''
        }
    ],
    // 리코 매화
    '리코·매화': [
        {
            id: '리코·매화 스킬1',
            type: '스킬1',
            skillName: '휘날리는 매화꽃 (의식0)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/질풍.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 58.2 }
                    ],
                    duration: '2턴',
                    condition: '질풍'
                }
            ],
            options: {
                'LV10+심상5': {
                    '아군 전체': { '대미지 보너스': 58.2 }
                },
                'LV10': {
                    '아군 전체': { '대미지 보너스': 52.7 }
                }
            },
            note: '적 단일'
        },
        {
            id: '리코·매화 스킬1-2',
            type: '스킬1',
            skillName: '휘날리는 매화꽃 (의식1)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/질풍.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 63.7 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '대미지 보너스': 63.7 }
                },
                'LV13': {
                    '아군 전체': { '대미지 보너스': 58.2 }
                },
                'LV10+심상5': {
                    '아군 전체': { '대미지 보너스': 58.2 }
                },
                'LV10': {
                    '아군 전체': { '대미지 보너스': 52.7 }
                }
            },
            note: '적 단일, 의식6 3턴'
        },
        {
            id: '리코·매화 스킬2',
            type: '스킬2',
            skillName: '우산 속 매화',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 44.5 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '공격력 %': 44.5 }
                },
                'LV13': {
                    '아군 전체': { '공격력 %': 40.7 }
                },
                'LV10+심상5': {
                    '아군 전체': { '공격력 %': 40.7 }
                },
                'LV10': {
                    '아군 전체': { '공격력 %': 36.9 }
                }
            },
            note: ''
        },
        {
            id: '리코·매화 스킬3',
            type: '스킬3',
            skillName: '매화의 잔향',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '크리티컬 확률', value: 18.0 },
                        { type: '공격력 상수', value: 835.2 },
                        { type: '크리티컬 효과', value: 62.6 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '메인 목표': { '크리티컬 확률': 18.0, '공격력 상수': 835.2, '크리티컬 효과': 62.6 }
                },
                'LV13': {
                    '메인 목표': { '크리티컬 확률': 17.0, '공격력 상수': 763.2, '크리티컬 효과': 57.2 }
                },
                'LV10+심상5': {
                    '메인 목표': { '크리티컬 확률': 17.0, '공격력 상수': 763.2, '크리티컬 효과': 57.2 }
                },
                'LV10': {
                    '메인 목표': { '크리티컬 확률': 16.0, '공격력 상수': 691.2, '크리티컬 효과': 51.8 }
                }
            },
            note: ''
        },
        {
            id: '리코·매화 스킬3-2',
            type: '스킬3',
            skillName: '매화의 잔향 (의식 6)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '크리티컬 확률', value: 18.0 },
                        { type: '공격력 상수', value: 835.2 },
                        { type: '크리티컬 효과', value: 62.6 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '크리티컬 확률': 18.0, '공격력 상수': 835.2, '크리티컬 효과': 62.6 }
                },
                'LV13': {
                    '아군 전체': { '크리티컬 확률': 17.0, '공격력 상수': 763.2, '크리티컬 효과': 57.2 }
                },
                'LV10+심상5': {
                    '아군 전체': { '크리티컬 확률': 17.0, '공격력 상수': 763.2, '크리티컬 효과': 57.2 }
                },
                'LV10': {
                    '아군 전체': { '크리티컬 확률': 16.0, '공격력 상수': 691.2, '크리티컬 효과': 51.8 }
                }
            },
            note: ''
        },
        {
            id: '리코·매화 하이라이트',
            type: 'HL',
            skillName: '하이라이트',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 상수', value: 870},
                        { type: '크리티컬 효과', value: 28.4 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '메인 목표': { '공격력 상수': 870, '크리티컬 효과': 28.4 }
                },
                'LV13': {
                    '메인 목표': { '공격력 상수': 795, '크리티컬 효과': 25.9 }
                },
                'LV10+심상5': {
                    '메인 목표': { '공격력 상수': 795, '크리티컬 효과': 26.9 }
                },
                'LV10': {
                    '메인 목표': { '공격력 상수': 720, '크리티컬 효과': 24.4 }
                }
            },
            note: ''
        },
        {
            id: '리코·매화 하이라이트 (의식4)',
            type: 'HL',
            skillName: '하이라이트 (의식4)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 상수', value: 870},
                        { type: '크리티컬 효과', value: 28.4 },
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '공격력 상수': 870, '크리티컬 효과': 28.4 }
                },
                'LV13': {
                    '아군 전체': { '공격력 상수': 795, '크리티컬 효과': 25.9 }
                },
                'LV10+심상5': {
                    '아군 전체': { '공격력 상수': 795, '크리티컬 효과': 26.9 }
                },
                'LV10': {
                    '아군 전체': { '공격력 상수': 720, '크리티컬 효과': 24.4 }
                }
            },
            note: ''
        },
        {
            id: '리코·매화 만개',
            type: '패시브1',
            skillName: '만개',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 상수', value: 300 },
                        { type: '공격력 %', value: 27.8 },
                        { type: '크리티컬 효과', value: 34.4 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
            },
            note: '개화 10스택'
        },
        {
            id: '리코·매화 의식1',
            type: '의식1',
            skillName: '추위 없는 길',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '크리티컬 효과', value: 30.0 }
                    ],
                    duration: '2턴',
                    note: '스킬1, 적 단일'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 %', value: 25.0 }
                    ],
                    duration: '2턴',
                    condition: '지배 괴도',
                    note: '스킬2'
                }
            ],
            options: {
            },
        },
        {
            id: '리코·매화 의식2',
            type: '의식2',
            skillName: '깨어 있는 밤',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual2.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 상수', value: 208.8 },
                        { type: '크리티컬 효과', value: 15.7 },
                    ],
                    duration: '2턴',
                    note: '스킬3 SP50'
                },
                {
                    target: '메인 목표',
                    effects: [
                        { type: '크리티컬 효과', value: 34.4 }
                    ],
                    duration: '2턴',
                    note: '만개 크효 2배'
                }
            ],
            options: {
                'LV13+심상5': {
                    '메인 목표': { '공격력 상수': 835.2, '크리티컬 효과': 62.6 }
                },
                'LV13': {
                    '메인 목표': { '공격력 상수': 763.2, '크리티컬 효과': 57.2 }
                },
                'LV10+심상5': {
                    '메인 목표': { '공격력 상수': 763.2, '크리티컬 효과': 57.2 }
                },
                'LV10': {
                    '메인 목표': { '공격력 상수': 691.2, '크리티컬 효과': 51.8 }
                }
            },
        },
        {
            id: '리코·매화 의식2 (의식6)',
            type: '의식2',
            skillName: '깨어 있는 밤 (의식6)',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual2.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '공격력 상수', value: 208.8 },
                        { type: '크리티컬 효과', value: 15.7 },
                    ],
                    duration: '2턴',
                    note: '스킬3 SP50'
                },
                {
                    target: '메인 목표',
                    effects: [
                        { type: '크리티컬 효과', value: 34.4 }
                    ],
                    duration: '2턴',
                    note: '만개 크효 2배'
                }
            ],
            options: {
                'LV13+심상5': {
                    '아군 전체': { '공격력 상수': 835.2, '크리티컬 효과': 62.6 }
                },
                'LV13': {
                    '아군 전체': { '공격력 상수': 763.2, '크리티컬 효과': 57.2 }
                },
                'LV10+심상5': {
                    '아군 전체': { '공격력 상수': 763.2, '크리티컬 효과': 57.2 }
                },
                'LV10': {
                    '아군 전체': { '공격력 상수': 691.2, '크리티컬 효과': 51.8 }
                }
            },
        },
        {
            id: '리코·매화 의식4',
            type: '의식4',
            skillName: '산을 휘감는 매화',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual4.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '크리티컬 효과', value: 12.0 }
                    ],
                    duration: '2턴',
                    note: 'HL 메인 목표'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '리코·매화 전용무기',
            type: '전용무기',
            skillName: '겨울학의 날갯짓',
            skillIcon: `${BASE_URL}/assets/img/character-weapon/리코·매화-5-01.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '크리티컬 효과', value: 25.2 }
                    ],
                    duration: '2턴'
                },
                {
                    target: '메인 목표',
                    effects: [
                        { type: '대미지 보너스', value: 31.5 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
                '개조5&6/SP250': {
                    '아군 전체': { '크리티컬 효과': 25.2 },
                    '메인 목표': { '대미지 보너스': 31.5 }
                },
                '개조3&4/SP250': {
                    '아군 전체': { '크리티컬 효과': 21.2 },
                    '메인 목표': { '대미지 보너스': 26.5 }
                },
                '개조1&2/SP250': {
                    '아군 전체': { '크리티컬 효과': 17.2 },
                    '메인 목표': { '대미지 보너스': 21.5 }
                },
                '개조0/SP250': {
                    '아군 전체': { '크리티컬 효과': 13.2 },
                    '메인 목표': { '대미지 보너스': 16.5 }
                },
                '개조5&6/SP200': {
                    '아군 전체': { '크리티컬 효과': 25.2 },
                    '메인 목표': { '대미지 보너스': 25.2 }
                },
                '개조3&4/SP200': {
                    '아군 전체': { '크리티컬 효과': 21.2 },
                    '메인 목표': { '대미지 보너스': 21.2 }
                },
                '개조1&2/SP200': {
                    '아군 전체': { '크리티컬 효과': 17.2 },
                    '메인 목표': { '대미지 보너스': 17.2 }
                },
                '개조0/SP200': {
                    '아군 전체': { '크리티컬 효과': 13.2 },
                    '메인 목표': { '대미지 보너스': 13.2 }
                },
            },
            note: ''
        }
    ],

    //루우나
    '루우나': [
        {
            id: '루우나 스킬1',
            type: '스킬1',
            skillName: '뜨거운 악수',
            skillIcon: `${BASE_URL}/assets/img/skill-element/화염광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 30.7 }
                    ],
                    duration: '3턴',
                    note: '광역'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 28.0 }
                    ],
                    duration: '3턴',
                    note: '광역',
                    condition: '화염'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '루우나 스킬2',
            type: '스킬2',
            skillName: '악당에 대한 경고',
            skillIcon: `${BASE_URL}/assets/img/skill-element/화염.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 78.0 }
                    ],
                    duration: '3턴',
                    note: '단일'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '루우나 스킬3 (의식6 - 단일)',
            type: '스킬3',
            skillName: 'GOGO 멍멍! (의식6 - 단일)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/화염광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 68.2 }
                    ],
                    duration: '3턴',
                    note: '단일'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 23.9 }
                    ],
                    duration: '3턴',
                    note: '광역',
                    condition: '화염'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 34.1 }
                    ],
                    duration: '3턴',
                    note: '단일',
                    condition: '추가 효과'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '루우나 스킬3 (의식6 - 광역)',
            type: '스킬3',
            skillName: 'GOGO 멍멍! (의식6 - 광역)',
            skillIcon: `${BASE_URL}/assets/img/skill-element/화염광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 47.7 }
                    ],
                    duration: '3턴',
                    note: '광역'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 23.9 }
                    ],
                    duration: '3턴',
                    note: '광역',
                    condition: '화염'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 34.1 }
                    ],
                    duration: '3턴',
                    note: '단일',
                    condition: '추가 효과'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '루우나 하이라이트',
            type: 'HL',
            skillName: '루우나 하이라이트',
            skillIcon: `${BASE_URL}/assets/img/skill-element/화염광역.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 45.4 }
                    ],
                    duration: '2턴',
                    condition: '화염'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 45.4 }
                    ],
                    duration: '2턴',
                    condition: '추가 효과'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '루우나 의식0',
            type: '의식0',
            skillName: '모든 포옹과 따뜻함',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual0.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 18.0 }
                    ],
                    duration: '2턴'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '루우나 의식1',
            type: '의식1',
            skillName: '다정한 안정감',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 36.0 }
                    ],
                    duration: '2턴',
                    condition: '화염'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 40.0 }
                    ],
                    duration: '2턴',
                    condition: '추가 효과'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '루우나 의식2',
            type: '의식2',
            skillName: '고민을 알아주는 마음',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual2.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '크리티컬 효과', value: 36.0 }
                    ],
                    duration: ''
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '루우나 의식6',
            type: '의식6',
            skillName: '영원히 내 곁에',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual6.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 18.0 }
                    ],
                    duration: '2턴',
                    note: '광역',
                    condition: '화염'
                },
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 25.0 }
                    ],
                    duration: '2턴',
                    note: '단일',
                    condition: '추가 효과'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '루우나 전용무기',
            type: '전용무기',
            skillName: '바이트 클로우',
            skillIcon: `${BASE_URL}/assets/img/character-weapon/루우나-5-01.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '방어력 감소', value: 63.3 }
                    ],
                    duration: '2턴',
                    note: '단일 (광역 31.7)'
                }
            ],
            options: {
            },
            note: ''
        }
    ],

    //아야카
    '아야카': [
        {
            id: '아야카 스킬2',
            type: '스킬2',
            skillName: '즉흥 독주',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 상수', value: 1136 }
                    ],
                    duration: '3턴'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '아야카 스킬3',
            type: '스킬3',
            skillName: '피날레: 음역 가동',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '대미지 보너스', value: 90.9 }
                    ],
                    duration: '',
                    condition: '피날레 HIGHLIGHT'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '아야카 하이라이트',
            type: 'HL',
            skillName: '하이라이트',
            skillIcon: `${BASE_URL}/assets/img/skill-element/버프.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 52.9 }
                    ],
                    duration: '4회',
                    note: '의식5, 6회'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '아야카 패시브1',
            type: '패시브1',
            skillName: '악센트',
            skillIcon: `${BASE_URL}/assets/img/skill-element/패시브.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 %', value: 36 }
                    ],
                    duration: '',
                    condition: 'HIGHLIGHT'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '아야카 의식1',
            type: '의식1',
            skillName: '새벽 맞이',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual1.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '크리티컬 확률', value: 15 }
                    ],
                    duration: '3턴'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '아야카 의식3',
            type: '의식3',
            skillName: '계몽의 별',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual3.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '대미지 보너스', value: 30.0 }
                    ],
                    duration: '1턴',
                    note: '스킬3 사용 동료'
                }
            ],
            options: {
            },
            note: ''
        },
        {
            id: '아야카 의식6',
            type: '의식6',
            skillName: '모두의 힘',
            skillIcon: `${BASE_URL}/assets/img/character-detail/ritual6.png`,
            targets: [
                {
                    target: '아군 전체',
                    effects: [
                        { type: '대미지 보너스', value: 30.0 }
                    ],
                    
                }
            ]
        },
        {
            id: '아야카 전용무기',
            type: '전용무기',
            skillName: '샤이닝 스타',
            skillIcon: `${BASE_URL}/assets/img/character-weapon/아야카-5-01.png`,
            targets: [
                {
                    target: '메인 목표',
                    effects: [
                        { type: '공격력 %', value: 57.3 }
                    ],
                }
            ],
            options: {
            },
            note: ''
        }
    ]
}; 