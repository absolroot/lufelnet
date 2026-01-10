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
    
    // 수동 입력된 출시 일정 (확정된 날짜)
    manualReleases: [
        // ===== 2025년 =====
        { version: "0.0", date: "2025-06-25", characters: ["안" ,"류지", "모르가나", "야오링", "하루나", "루페르", "레오", "모토하", "몽타뉴", "슌", "세이지","유키미", "키요시", "토모코", "토시야", "미유", "카요"], note: "Global Launch" },
        { version: "1.0", date: "2025-06-25", characters: ["렌"], "main-story": "1&2" },
        { version: "1.1", date: "2025-07-10", characters: ["YUI", "미나미"] },
        { version: "1.2", date: "2025-07-24", characters: ["유스케"] },
        { version: "1.3", date: "2025-08-07", characters: ["마코토", "치즈코"] },
        { version: "1.4", date: "2025-08-21", characters: ["유우미"] },
        { version: "2.0", date: "2025-09-04", characters: ["아야카", "리코"], "main-story": "3-1" },
        { version: "2.1", date: "2025-09-22", characters: ["모토하·여름"], "summer": true },
        { version: "2.2", date: "2025-10-09", characters: ["토모코·여름"], "summer": true },
        { version: "2.3", date: "2025-10-23", characters: ["키라"], "main-story": "3-2" },
        { version: "2.4", date: "2025-11-06", characters: ["후타바"] },
        { version: "2.5", date: "2025-11-25", characters: ["마사키"] },
        { version: "2.6", date: "2025-12-06", characters: ["하루"] },
        { version: "2.7", date: "2025-12-25", characters: ["J&C"], note: "Worldwide Simultaneous Release" },
        // ===== 2026년 =====
        { version: "3.0", date: "2026-01-08", characters: ["몽타뉴·백조"], "main-story": "4-1" },
    ],
    
    // 순서를 지정하고 싶은 캐릭터들 (날짜만 자동 계산)
    // 이후 캐릭터들은 characterData의 release_order 기반으로 자동 추가됨
    autoGenerateCharacters: [
        // 3.x (2주 간격)
        { version: "3.1", characters: ["루우나"] },
        { version: "3.2", characters: ["카스미"] },
        { version: "3.3", characters: ["리코·매화"], "main-story": "4-2" },
        { version: "3.4", characters: ["야오링·사자무"] },
        { version: "3.5", characters: ["미오"] },
        { version: "3.6", characters: ["아케치"] },
        { version: "3.7", characters: ["마유미"] },
        // 4.0 이후 (3주 간격) - isThreeWeekStart 표시
        { version: "4.0", characters: ["마나카", "쇼키"], "main-story": "5-1", isThreeWeekStart: true },
        { version: "4.1.1", characters: ["유키 마코토"]},
        { version: "4.1.2", characters: ["유카리"] },
        { version: "4.1.3", characters: ["사나다"] },
        { version: "4.2", characters: ["이치고"], "main-story": "5-2" },
        { version: "4.3.1", characters: ["미나미·여름"], "summer": true },
        { version: "4.3.2", characters: ["미유·여름"], "summer": true },
        { version: "4.4", characters: ["카타야마"] },
        { version: "4.5", characters: ["YUI·스텔라"], "main-story": "5-3" },
        { version: "4.6.1", characters: ["미츠루"] },
        { version: "4.6.2", characters: ["후카"] },
        { version: "4.7.1", characters: ["쇼키·암야"], "main-story": "5-4" },
        { version: "4.7.1", characters: ["슌·프론티어"] },
        { version: "4.8", characters: ["준페이"] },
        { version: "4.9", characters: ["나루루"] },
        // 이후 캐릭터들은 release_order 기반으로 자동 추가됨
    ],
    
    // i18n Labels
    i18n: {
        en: {
            released: "Released",
            current: "Current",
            upcoming: "Upcoming",
            future: "Future",
            daysAgo: "days ago",
            daysLeft: "days left",
            today: "Today",
            nextRelease: "Next Release",
            currentBanner: "Current Banner",
            noCharacters: "No characters in this period",
            showReleased: "Released",
            hideReleased: "Hide"
        },
        jp: {
            released: "リリース済み",
            current: "現在",
            upcoming: "近日",
            future: "予定",
            daysAgo: "日前",
            daysLeft: "日後",
            today: "本日",
            nextRelease: "次のリリース",
            currentBanner: "現在のバナー",
            noCharacters: "この期間にキャラクターはいません",
            showReleased: "リリース済み",
            hideReleased: "隠す"
        },
        kr: {
            released: "출시됨",
            current: "현재",
            upcoming: "예정",
            future: "미래",
            daysAgo: "일 전",
            daysLeft: "일 후",
            today: "오늘",
            nextRelease: "다음 출시",
            currentBanner: "현재 배너",
            noCharacters: "이 기간에 캐릭터가 없습니다",
            showReleased: "출시됨",
            hideReleased: "숨기기"
        }
    }
};
