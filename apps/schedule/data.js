/**
 * P5X Release Schedule Data
 * EN/JP Server Character Release Timeline
 * 
 * - manualReleases: 확정된 날짜의 출시 일정
 * - autoGenerateCharacters: 순서를 지정하고 싶은 캐릭터 (날짜 자동 계산)
 * - 이후 캐릭터들은 characterData의 release_order 기반으로 자동 추가됨
 * 
 * - 4.0 이전: 2주(14일) 간격
 * - 4.0 이후: 3주(21일) 간격 (마나카부터)
 */

window.ReleaseScheduleData = {
    // Release Interval Info
    intervalRules: {
        beforeV4: 14,   // 4.0 이전: 2주(14일) 간격
        afterV4: 21     // 4.0 이후: 3주(21일) 간격 (마나카부터)
    },

    // Anniversary Events (자동 생성됨)
    anniversaryEvents: [
        // Global Server Events (UTC)
        { type: "debut", date: "2025-06-26", name: "Global Debut", server: "global" },
        { type: "half", date: "2025-12-26", name: "Global Half-Anniversary", server: "global" },
        { type: "first", date: "2026-06-26", name: "Global 1st Anniversary", server: "global" },
        { type: "onehalf", date: "2026-12-26", name: "Global 1.5 Anniversary", server: "global" },

        // CN Server Events (UTC)
        { type: "debut", date: "2024-04-12", name: "CN Debut", server: "cn" },
        { type: "half", date: "2024-10-12", name: "CN Half-Anniversary", server: "cn" },
        { type: "first", date: "2025-04-12", name: "CN 1st Anniversary", server: "cn" },
        { type: "onehalf", date: "2025-10-12", name: "CN 1.5 Anniversary", server: "cn" },
        { type: "second", date: "2026-04-12", name: "CN 2nd Anniversary", server: "cn" },
        { type: "twohalf", date: "2026-10-12", name: "CN 2.5 Anniversary", server: "cn" }
    ],

    // 수동 입력된 출시 일정 (확정된 날짜)
    manualReleases: [
        // ===== 2025년 =====
        { version: "0.0", date: "2025-06-25", characters: ["안", "류지", "모르가나", "야오링", "하루나", "루페르", "레오", "모토하", "몽타뉴", "슌", "세이지", "유키미", "키요시", "토모코", "토시야", "미유", "카요"], note: "Global Launch" },
        { version: "1.0", date: "2025-06-25", characters: ["렌"], "main-story": "1&2", persona: ["킹 프로스트", "비사문천", "멜키세덱"], weapon: ["7일의 불꽃", "메아리의 절규"] },
        { version: "1.1", date: "2025-07-10", characters: ["YUI", "미나미"] },
        { version: "1.2", date: "2025-07-24", characters: ["유스케"] },
        { version: "1.3", date: "2025-08-07", characters: ["마코토", "치즈코"] },
        { version: "1.4", date: "2025-08-21", characters: ["유우미"], weapon: ["태고의 역장", "크리스탈 트레저"] },
        { version: "2.0", date: "2025-09-04", characters: ["아야카", "리코"], "main-story": "3-1", weapon: ["메커니컬 심판자"], revelation: ["지혜", "결심", "진정성", "환희", "억압", "직책", "미덕"] },
        { version: "2.1", date: "2025-09-22", characters: ["모토하·여름"], "summer": true, persona: ["요시츠네", "릴리스", "체르노보그"] },
        { version: "2.2", date: "2025-10-09", characters: ["토모코·여름"], "summer": true },
        { version: "2.3", date: "2025-10-23", characters: ["키라"], "main-story": "3-2", persona: ["쿠 훌린"], weapon: ["망자의 눈"] },
        { version: "2.4", date: "2025-11-06", characters: ["후타바"] },
        { version: "2.5", date: "2025-11-25", characters: ["마사키"], persona: ["비슈누", "시바", "산달폰"], weapon: ["천상의 별"] },
        { version: "2.6", date: "2025-12-06", characters: ["하루"] },
        { version: "2.7", date: "2025-12-25", characters: ["J&C"], note: "Worldwide Simultaneous Release", goldTicketUnlocks: ["MARIAN"], revelation: ["탄생"] },
        // ===== 2026년 =====
        { version: "3.0", date: "2026-01-08", characters: ["몽타뉴·백조"], "main-story": "4-1", persona: ["사악한 프로스트"], weapon: ["야수의 이빨"], revelation: ["창조", "자유", "개선", "좌절", "우려", "화해"] },
        { version: "3.1", date: "2026-01-22", characters: ["루우나"], days: 14 },
    ],

    // 순서를 지정하고 싶은 캐릭터들 (날짜만 자동 계산)
    // 이후 캐릭터들은 characterData의 release_order 기반으로 자동 추가됨
    autoGenerateCharacters: [
        // 3.x (2주 간격)
        { version: "3.2.1", date: "2026-02-05", characters: ["리코·매화"], "main-story": "4-2", persona: ["트론", "지크프리트"], weapon: ["작열의 연옥", "플라스마 섬멸자"], revelation: ["헛수고", "실망"], days: 8 },
        { version: "3.2.2", characters: ["미오"], days: 14 },
        { version: "3.3", characters: ["카스미"], persona: ["스라오샤"], days: 14 },
        { version: "3.4", characters: ["야오링·사자무"], persona: ["년수"], note: "", days: 14 },
        { version: "3.5", characters: ["아케치"], days: 14 },
        { version: "3.6", characters: ["마유미"], days: 14 },
        // 4.0 이후 (3주 간격) - isThreeWeekStart 표시
        { version: "4.0", characters: ["마나카", "쇼키"], "main-story": "5-1", weapon: ["하이브 가드"], revelation: ["희망", "신중", "고집"], days: 21 },
        { version: "4.1.1", characters: ["유키 마코토"], persona: ["자오우곤겐"], days: 21 },
        { version: "4.1.2", characters: ["유카리"], weapon: ["마그네틱 스톰"], days: 21 },
        { version: "4.1.3", characters: ["사나다"], revelation: ["돌파", "슬픔", "변화"], days: 21 },
        { version: "4.2", characters: ["이치고"], "main-story": "5-2", persona: ["트럼페터", "바스키"], weapon: ["망령의 저주"], days: 21 },
        { version: "4.3.1", characters: ["미나미·여름"], "summer": true, days: 21 },
        { version: "4.3.2", characters: ["미유·여름"], "summer": true, persona: ["사히모치노카미"], weapon: ["설원의 침묵"], days: 21 },
        { version: "4.4", characters: ["카타야마"], days: 21 },
        { version: "4.5", characters: ["YUI·스텔라"], "main-story": "5-3", weapon: ["엔트로피·제로"], revelation: ["예리", "풍족", "획득"], days: 21 },
        { version: "4.6.1", characters: ["미츠루"], days: 21 },
        { version: "4.6.2", characters: ["후카"], days: 21 },
        { version: "4.7.1", characters: ["쇼키·암야"], "main-story": "5-4", persona: ["마카브르"], weapon_stamp: ["크리스탈 트레저"], mindscape_core: ["토모코·여름", "유우미", "YUI"], note: "Janosik IV", days: 21 },
        { version: "4.7.1", characters: ["슌·프론티어"], note: "Desire Gallery Mission (Mindscape Core Dungeon)", mindscape_core: ["J&C"], days: 21 },
        { version: "4.8", characters: ["준페이"], days: 21 },
        { version: "4.9", characters: ["나루루"], days: 21 },
        // 이후 캐릭터들은 release_order 기반으로 자동 추가됨
    ]
};
