window.operationData = window.operationData || {};

// skills / buffs의 같은 인덱스는 같은 턴이다. 각 줄을 해당 턴의 스킬·효과로 직접 작성한다.
// 활성 버프 표기: S1 / S2 / S3 / P1 / P2 / HL. 『인연의 힘』 중첩은 powerful_bond 행에 별도로 표시한다.
const kotoneOperationRoutes = [
    
    {
        group: 'r0', id: 'standard', turnCount: 6,
        skills: [
            '1', '1+1+3', 'fatigue', 'fatigue', '1', '3', ''
        ],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', '', ''],
            ['S1 × 3', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 1', 'P2', ''],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['2', '6', '7', '8', '10', '10', '', ''],
        powerful_bond: ['1', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r0', id: 'standard', turnCount: 6,
        skills: [
            '1', '1', '1', '1', '1+3+2', 'fatigue', '', ''
        ],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', ''],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', ''],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['2', '4', '6', '8', '10', '10', '10', '10'],
        powerful_bond: ['1', '2', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r0', id: 'standard', turnCount: 6,
        skills: [
            '1', '1', '1', '1', '1+1+3', 'fatigue', '', ''
        ],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', ''],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['2', '4', '6', '8', '10', '10', '10', '10'],
        powerful_bond: ['1', '2', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r0', id: 'miku', turnCount: 8,
        skills: [
            '1', '1', '1', '1', '1+3+2', 'fatigue', 'fatigue', '3'
        ],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', ''],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', ''],
            ['S1 × 1', 'S2', '', 'P1 × 1', '', ''],
            ['S1 × 1', 'S2', 'S3', '', '', '']
        ],
        buff_slots: true,
        lunar_bond: ['2', '4', '6', '8', '10', '10', '10', '10'],
        powerful_bond: ['1', '2', '3', '3', '3', '3', '3', '2']
    },
    {
        group: 'r0', id: 'miku', turnCount: 8,
        skills: [
            '1', '1', '1', '1', '1+1+3', 'fatigue', 'fatigue', '3'
        ],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', '', ''],
            ['S1 × 2', '', 'S3', '', '', '']
        ],
        buff_slots: true,
        lunar_bond: ['2', '4', '6', '8', '10', '10', '10', '10'],
        powerful_bond: ['1', '2', '3', '3', '3', '3', '3', '3']
    },
    /* =================의식1====================== */
    {
        group: 'r1', id: 'standard', turnCount: 6,
        skills: ['1', '1+1+3', 'fatigue', 'fatigue', '1', '3', '', ''],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', '', '', 'P1 × 2', '', 'HL'],
            ['S1 × 3', '', '', 'P1 × 1', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 1', 'P2', ''],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['7', '10', '10', '10', '10', '10', '', ''],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r1', id: 'standard', turnCount: 6,
        skills: ['1', '1', '1', '1', '1+3+2', 'fatigue', '', ''],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '', ''],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r1', id: 'standard', turnCount: 6,
        skills: ['1', '1', '1', '1', '1+1+3', 'fatigue', '', ''],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '', ''],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r1', id: 'miku', turnCount: 8,
        skills: ['1', '1', '1', '1', '1+3+2', 'fatigue', 'fatigue', '3'],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 1', 'S2', '', 'P1 × 1', '', 'HL'],
            ['S1 × 1', 'S2', 'S3', '', '', 'HL']
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '3', '3']
    },
    {
        group: 'r1', id: 'miku', turnCount: 8,
        skills: ['1', '1', '1', '1', '1+1+3', 'fatigue', 'fatigue', '3'],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', '', '', 'P1 × 2', '', 'HL'],
            ['S1 × 2', '', 'S3', '', '', 'HL']
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '3', '3']
    },
    /* =================의식2====================== */
    {
        group: 'r2', id: 'standard', turnCount: 6,
        skills: ['1', '1+1+3', 'fatigue', 'fatigue', '1', '3', '', ''],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', '', 'S3', 'P1 × 2', '', 'HL'],
            ['S1 × 3', '', '', 'P1 × 1', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 1', 'P2', 'HL'],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['7', '10', '10', '10', '10', '10', '', ''],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r2', id: 'standard', turnCount: 6,
        skills: ['1', '1', '1', '1+3+2', 'fatigue', 'fatigue', '', ''],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 1', 'S2', 'S3', 'P1 × 1', '', 'HL'],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '', ''],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r2', id: 'standard', turnCount: 6,
        skills: ['1', '1', '1', '1+1+3', 'fatigue', 'fatigue', '', ''],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', '', 'S3', 'P1 × 2', '', 'HL'],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '', ''],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r2', id: 'miku', turnCount: 8,
        skills: ['1', '1', '1', '1', '1+3+2', 'fatigue', 'fatigue', '3'],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 1', 'S2', 'S3', 'P1 × 1', '', 'HL'],
            ['S1 × 1', 'S2', 'S3', '', '', 'HL']
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '3', '3']
    },
    {
        group: 'r2', id: 'miku', turnCount: 8,
        skills: ['1', '1', '1', '1', '1+1+3', 'fatigue', 'fatigue', '3'],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', '', 'S3', 'P1 × 2', '', 'HL'],
            ['S1 × 2', '', 'S3', '', '', 'HL']
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '3', '3']
    },
    {
        group: 'r2', id: 'miku', turnCount: 8,
        skills: ['1', '1', '1', '1+3+2', 'fatigue', 'fatigue', '1', '3'],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 1', 'S2', 'S3', 'P1 × 1', '', 'HL'],
            ['S1 × 2', 'S2', '', 'P1 × 1', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 1', 'P2', 'HL']
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '3', '3']
    },
    {
        group: 'r2', id: 'miku', turnCount: 8,
        skills: ['1', '1', '1', '1+1+3', 'fatigue', 'fatigue', '1', '3'],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', '', 'S3', 'P1 × 2', '', 'HL'],
            ['S1 × 3', '', '', 'P1 × 1', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 1', 'P2', 'HL']
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '3', '3']
    },
    /* =================의식6====================== */
    {
        group: 'r6', id: 'standard', turnCount: 6,
        skills: ['1', '1', '1+3+2', 'fatigue', 'fatigue', '1+1+3', '', ''],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 1', 'S2', 'S3', 'P1 × 1', '', 'HL'],
            ['S1 × 3', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '', ''],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r6', id: 'standard', turnCount: 6,
        skills: ['1', '1+1+3', 'fatigue', 'fatigue', '1+3+2', '3', '', ''],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', '', 'S3', 'P1 × 2', '', 'HL'],
            ['S1 × 3', 'S2', 'S3', 'P1 × 1', 'P2', 'HL'],
            ['S1 × 3', 'S2', 'S3', 'P1 × 1', 'P2', 'HL'],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['7', '10', '10', '10', '10', '10', '', ''],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r6', id: 'standard', turnCount: 6,
        skills: ['1', '1+1+1+3+2', 'fatigue', 'fatigue', '1', '3', '', ''],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', '', 'HL'],
            ['S1 × 3', 'S2', '', 'P1 × 1', 'P2', 'HL'],
            ['S1 × 3', '', 'S3', 'P1 × 1', 'P2', 'HL'],
            [], []
        ],
        buff_slots: true,
        lunar_bond: ['7', '10', '10', '10', '10', '10', '', ''],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '', '']
    },
    {
        group: 'r6', id: 'miku', turnCount: 8,
        skills: ['1', '1', '1', '1', '1+3+2', 'fatigue', 'fatigue', '1+1+3'],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 1', 'S2', 'S3', 'P1 × 1', '', 'HL'],
            ['S1 × 3', 'S2', 'S3', 'P1 × 2', 'P2', 'HL']
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '3', '3']
    },
    /*
    {
        group: 'r6', id: 'miku', turnCount: 8,
        skills: ['1', '1', '1', '1+3+2', 'fatigue', 'fatigue', '1+1+3', 'fatigue'],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', '', '', 'P1 × 3', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 1', 'S2', 'S3', 'P1 × 1', '', 'HL'],
            ['S1 × 3', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 3', 'S2', 'S3', 'P1 × 2', 'P2', 'HL']
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '3', '3']
    },*/
    {
        group: 'r6', id: 'miku', turnCount: 8,
        skills: ['1', '1', '1+3+2', 'fatigue', 'fatigue', '1+1+3', 'fatigue', 'fatigue'],
        buffs: [
            ['S1 × 1', '', '', 'P1 × 1', 'P2', ''],
            ['S1 × 2', '', '', 'P1 × 2', 'P2', ''],
            ['S1 × 3', 'S2', 'S3', 'P1 × 3', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 1', 'S2', 'S3', 'P1 × 1', '', 'HL'],
            ['S1 × 3', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 3', 'S2', 'S3', 'P1 × 2', 'P2', 'HL'],
            ['S1 × 2', 'S2', 'S3', 'P1 × 2', '', 'HL']
        ],
        buff_slots: true,
        lunar_bond: ['7', '9', '10', '10', '10', '10', '10', '10'],
        powerful_bond: ['2', '3', '3', '3', '3', '3', '3', '3']
    }
];

const kotoneOperationLocale = {
    kr: { awareness: '의식', miku: '미쿠', fatigue: '감기', labels: { turns: '턴', skills: '스킬', buffs: '버프', highlight: 'HIGHLIGHT', powerful_bond: '인연의 힘', lunar_bond: '삭망월' } },
    en: { awareness: 'Awareness', miku: 'Miku', fatigue: 'Fatigue', labels: { turns: 'Turn', skills: 'Skill', buffs: 'Buffs', highlight: 'HIGHLIGHT', powerful_bond: 'Powerful Bond', lunar_bond: 'Lunar Bond' } },
    jp: { awareness: '意識', miku: '初音ミク', fatigue: '疲労', labels: { turns: 'ターン', skills: 'スキル', buffs: 'バフ', highlight: 'HIGHLIGHT', powerful_bond: '絆の力', lunar_bond: 'ルネーション' } },
    cn: { awareness: '意识', miku: '初音未来', fatigue: '疲劳', labels: { turns: '回合', skills: '技能', buffs: '增益', highlight: 'HIGHLIGHT', powerful_bond: '羁绊之力', lunar_bond: '朔望月' } }
};

function createKotoneOperation(locale) {
    const text = kotoneOperationLocale[locale];
    return kotoneOperationRoutes.map((route) => {
        const labelSuffix = route.id.toLowerCase().includes('miku') ? ` (${text.miku})` : '';
        return {
            group: route.group,
            variant: route.id.toLowerCase().includes('miku') ? 'miku' : 'standard',
            label: `${text.awareness} ${route.group.slice(1)}${labelSuffix}`,
            turns: Array.from({ length: 8 }, (_, index) => index < route.turnCount ? String(index + 1) : ''),
            skills: route.skills.map((skill) => skill === 'fatigue' ? text.fatigue : skill),
            fatigue_turns: route.skills.map((skill) => skill === 'fatigue'),
            full_power_turns: route.skills.map((skill) => skill.split('+').filter(Boolean).length >= 3),
            buffs: route.buffs,
            buff_slots: route.buff_slots,
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
        "· 현재 추천 운영은 초기 출시로 인해 지속 조정 중입니다.",
        "· 핑크색 배경은 『전력전개』 발동 턴을 의미하며, 『인연의 힘』, 『삭망월』 행은 현재 중첩 수를 의미한다.",
        "· S1, P1 옆의 점은 각 스킬의 중첩수를 의미한다.",
        "· 미쿠(8턴)의 2번째 턴에 아군의 버프가 충분한 경우 1스킬 대신 3스킬을 사용할 수 있다.",
        "· 미쿠(8턴)은 해명 괴도로 미쿠를 활용하는 파티를 의미하며 미쿠의 고스트 룰을 사용하는 턴에 따라 택틱 순서는 변화할 수 있다."
    ],
    note_en: [
        "· The recommended rotations are still being adjusted following the initial release.",
        "· The pink background marks the turn Go for Broke is activated, while the Powerful Bond and Lunar Bond rows show their current stack counts.",
        "· The dots next to S1 and P1 show each skill's stack count.",
        "· In the 8-turn Miku rotations, Skill 3 can be used instead of Skill 1 on turn 2 if the party has enough buffs.",
        "· The 8-turn Miku rotations use Miku as the Elucidator; the tactic sequence may change depending on when she uses Ghost Rule."
    ],
    note_jp: [
        "· 推奨運用はリリース直後のため、引き続き調整中です。",
        "· ピンク色の背景は『全力全開』を発動するターンを示し、『絆の力』と『ルネーション』の欄は現在の累積数を示す。",
        "· S1・P1の横の点は、それぞれのスキルの累積数を示す。",
        "· ミク（8ターン）の2ターン目は、味方のバフが十分ならスキル1の代わりにスキル3を使用できる。",
        "· ミク（8ターン）は解明怪盗としてミクを採用するパーティを指し、ミクが『ゴーストルール』を使用するターンによってタクティクスの順序が変わる場合がある。"
    ],
    note_cn: [
        "· 由于刚上线，推荐的操作顺序仍在持续调整中。",
        "· 粉色背景表示发动『全力全开』的回合，『羁绊之力』和『朔望月』栏显示当前层数。",
        "· S1、P1旁的圆点表示各自技能的层数。",
        "· 在初音未来（8回合）的第2回合，若队伍的增益足够，可以用技能3代替技能1。",
        "· 初音未来（8回合）是指将初音未来作为解明怪盗使用的队伍；根据初音未来使用『幽灵法则』的回合不同，战术顺序可能会变化。"
    ],
    mobile_hidden_notes: [1]
};
