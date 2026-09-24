window.operationData = window.operationData || {};

// skills / buffs의 같은 인덱스는 같은 턴이다. 각 줄을 해당 턴의 스킬·효과로 직접 작성한다.
// 활성 버프 표기: S1 / S2 / S3 / HL. 『인연의 힘』 중첩은 powerful_bond 행에 별도로 표시한다.
const kotoneOperationRoutes = [
    {
        group: 'r0', id: 'standard', turnCount: 6,
        skills: [
            '1', '1', '1+2+3', 'fatigue', 'fatigue', '3', '', ''
        ],
        buffs: [
            'S1', 'S1', 'S1 · S2 · S3', 'S1 · S2 · S3', 'S1 · S2', 'S1 · S3', '', ''
        ],
        lunar_bond: ['2', '4', '8', '9', '10', '10', '10', '10'],
        powerful_bond: ['1', '2', '3', '3', '3', '2', '', '']
    },
    {
        group: 'r0', id: 'standard', turnCount: 6,
        skills: [
            '1', '1', '1', '1', '1+2+3', 'fatigue', '', ''
        ],
        buffs: [
            'S1', 'S1', 'S1', 'S1', 'S1 · S2 · S3', 'S1 · S2 · S3', '', ''
        ],
        lunar_bond: ['2', '4', '6', '8', '10', '10', '10', '10'],
        powerful_bond: ['1', '2', '3', '3', '3', '3', '', '']
    },
    /*
    {
        group: 'r0', id: 'standard', turnCount: 6,
        skills: [
            '1', '3', '1', '1', '1+2+3', 'fatigue', '', ''
        ],
        buffs: [
            'S1 × 1', 'S1 × 1 · S3', 'S1 × 2', 'S1 × 2', 'S1 × 3 · S2 · S3', 'S1 × 3 · S2 · S3', '', ''
        ]
    },
    {
        group: 'r0', id: 'miku', turnCount: 8,
        skills: [
            '1', '1', '1', '1', '1+2+3', 'fatigue', 'fatigue', '3'
        ],
        buffs: [
            'S1 × 1', 'S1 × 2', 'S1 × 3', 'S1 × 3', 'S1 × 3 · S2 · S3', 'S1 × 3 · S2 · S3', 'S1 × 3 · S2', 'S1 × 2 · S2 · S3'
        ]
    },*/
    {
        group: 'r0', id: 'miku', turnCount: 8,
        skills: [
            '1', '3', '1', '1', '1+2+3', 'fatigue', 'fatigue', '3'
        ],
        buffs: [
            'S1', 'S1 · S3', 'S1', 'S1', 'S1 · S2 · S3', 'S1 · S2 · S3', 'S1 · S2', 'S1 · S2 · S3'
        ],
        lunar_bond: ['2', '4', '6', '8', '10', '10', '10', '10'],
        powerful_bond: ['1', '1', '2', '2', '3', '3', '3', '2']
    },
    {
        group: 'r1', id: 'standard', turnCount: 6,
        skills: [
            '1', '1', '1+2+3', 'fatigue', 'fatigue', '3', '', ''
        ],
        buffs: [
            'S1', 'S1', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · HL', 'S1 · S3 · HL', '', ''
        ],
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r1', id: 'miku', turnCount: 8,
        skills: [
            '1', '3', '1', '1', '1+2+3', 'fatigue', 'fatigue', '3'
        ],
        buffs: [
            'S1', 'S1 · S3', 'S1', 'S1', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · HL', 'S1 · S2 · HL'
        ],
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '2', '3', '3', '3', '3', '3', '3']
    },
    {
        group: 'r2', id: 'alternate', turnCount: 6,
        skills: [
            '1', '1', '1+2+3', 'fatigue', 'fatigue', '3', '', ''
        ],
        buffs: [
            'S1', 'S1', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', '', ''
        ],
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r2', id: 'mikuAlternate', turnCount: 8,
        skills: [
            '1', '3', '1', '1', '1+2+3', 'fatigue', 'fatigue', '3'
        ],
        buffs: [
            'S1', 'S1 · S3', 'S1', 'S1', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL'
        ],
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '2', '3', '3', '3', '3', '3', '3']
    },
    {
        group: 'r6', id: 'standard', turnCount: 6,
        skills: [
            '1', '1+2+3', 'fatigue', 'fatigue', '1+2+3', 'fatigue', '', ''
        ],
        buffs: [
            'S1', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', '', ''
        ],
        lunar_bond: ['7', '10', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r6', id: 'miku', turnCount: 8,
        skills: [
            '1', '1+2+3', 'fatigue', 'fatigue', '1+2+3', 'fatigue', 'fatigue', '3'
        ],
        buffs: [
            'S1', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL', 'S1 · S2 · S3 · HL'
        ],
        lunar_bond: ['7', '10', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '3', '3']
    }
];

const kotoneOperationLocale = {
    kr: { awareness: '의식', miku: '미쿠', fatigue: '감기', labels: { turns: '턴', skills: '스킬', buffs: '버프', powerful_bond: '인연의 힘', lunar_bond: '삭망월' } },
    en: { awareness: 'Awareness', miku: 'Miku', fatigue: 'Fatigue', labels: { turns: 'Turn', skills: 'Skill', buffs: 'Buffs', powerful_bond: 'Powerful Bond', lunar_bond: 'Lunar Bond' } },
    jp: { awareness: '意識', miku: '初音ミク', fatigue: '疲労', labels: { turns: 'ターン', skills: 'スキル', buffs: 'バフ', powerful_bond: '絆の力', lunar_bond: 'ルネーション' } },
    cn: { awareness: '意识', miku: '初音未来', fatigue: '疲劳', labels: { turns: '回合', skills: '技能', buffs: '增益', powerful_bond: '羁绊之力', lunar_bond: '朔望月' } }
};

function createKotoneOperation(locale) {
    const text = kotoneOperationLocale[locale];
    return kotoneOperationRoutes.map((route) => {
        const labelSuffix = route.id.toLowerCase().includes('miku') ? ` (${text.miku})` : '';
        return {
            group: route.group,
            label: `${text.awareness} ${route.group.slice(1)}${labelSuffix}`,
            turns: Array.from({ length: 8 }, (_, index) => index < route.turnCount ? String(index + 1) : ''),
            skills: route.skills.map((skill) => skill === 'fatigue' ? text.fatigue : skill),
            fatigue_turns: route.skills.map((skill) => skill === 'fatigue'),
            full_power_turns: route.skills.map((skill) => skill.split('+').filter(Boolean).length >= 3),
            buffs: route.buffs,
            lunar_bond: route.lunar_bond,
            powerful_bond: route.powerful_bond,
            row_icons: {
                powerful_bond: 'PC079_01_12_28_01.png',
                lunar_bond: 'PC079_01_12_28_02.png'
            },
            row_labels: text.labels
        };
    });
}

window.operationData['코토네'] = {
    basic: createKotoneOperation('kr'),
    basic_en: createKotoneOperation('en'),
    basic_jp: createKotoneOperation('jp'),
    basic_cn: createKotoneOperation('cn'),
    note: [
        "· 핑크색 배경은 『전력전개』발동 턴을 의미한다.",
        "· 실질적으로 의식6을 제외하고는 운영 방식은 크게 변하지 않으나 활성화된 버프가 달라진다.",
        "· 『인연의 힘』, 『삭망월』 행은 현재 중첩 수를 표시한다.",
        "· (미쿠)는 해명 괴도로 미쿠를 활용하는 파티를 의미하며 미쿠의 고스트 룰을 사용하는 턴에 따라 택틱 순서는 변화할 수 있다."
    ],
    note_en: [
        "· The pink background marks the turn Go for Broke is activated.",
        "· The Powerful Bond row shows the current stack count, and the Lunar Bond row shows the current level.",
        "· (Miku) refers to a party that uses Miku as its Elucidator; the tactic sequence may change depending on the turn she uses Ghost Rule."
    ],
    note_jp: [
        "· ピンク色の背景は『全力全開』を発動するターンを示す。",
        "· 『絆の力』の欄は現在の累積数、『ルネーション』の欄は現在のレベルを示す。",
        "· （ミク）は解明怪盗としてミクを採用するパーティを指し、ミクが『ゴーストルール』を使用するターンによって、タクティクスの順序は変わる場合がある。"
    ],
    note_cn: [
        "· 粉色背景表示发动『全力全开』的回合。",
        "· 『羁绊之力』栏显示当前层数，『朔望月』栏显示当前等级。",
        "· （初音未来）是指将初音未来作为解明怪盗使用的队伍；根据初音未来使用『幽灵法则』的回合不同，战术顺序可能会变化。"
    ],
    mobile_hidden_notes: [1]
};
