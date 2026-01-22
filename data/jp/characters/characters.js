window.characterList = window.characterList || {
    mainParty: [
        "렌", "루페르", "레오", "루우나", "류지", "마코토", "마사키", "모르가나",
        "모토하", "모토하·여름", "몽타뉴", "몽타뉴·백조", "미나미", "슌",
        "세이지", "아야카", "안",  "야오링", 
        "원더", "유스케", "유키미", "YUI",
        "키요시", "키라", "치즈코", "토모코", "토모코·여름", "토시야", "하루",
        "하루나","J&C"
        // P3R 캐릭터 제외: "사나다", "유카리", "유키 마코토"
    ],
    supportParty: [
        "유우미", "리코", "미유", "카요", "후타바"
        // P3R 서포트 캐릭터 제외: "마나카" (P3R 관련)
    ]
};

// Character data (basic info only - detailed info will be merged from KR data)
window.characterData = window.characterData || {};
Object.assign(window.characterData, {
    "원더": {
        "role": "",
        "tag": "",
        "persona": "",
        "release_order": 0
    },
    "루우나": {
        "release_order": 18
    },
    "몽타뉴·백조": {
        "release_order": 17
    },
    "J&C": {
        "release_order": 16
    },
    "하루": {
        "release_order": 15
    },
    "마사키": {
        "release_order": 14
    },
    "후타바": {
        "release_order": 13
    },
    "키라": {
        "release_order": 12
    },
    "토모코·여름": {
        "release_order": 11
    },
    "모토하·여름": {
        "release_order": 10
    },
    "아야카": {
        "release_order": 9
    },
    "리코": {
        "release_order": 8
    },
    "유우미":{
        "role": "",
        "tag": "",
        "persona": "",
        "release_order": 7
    },
    "마코토": {
        "role": "",
        "tag": "",
        "persona": "",
        "release_order": 6
    },
    "치즈코": {
        "role": "",
        "tag": "",
        "persona": "",
        "release_order": 5
    },
    "유스케": {
        "role": "",
        "tag": "",
        "persona": "",
        "release_order": 4
    },
    "YUI": {
        "role": "",
        "tag": "",
        "persona": "",
        "release_order": 3
    },
    "미나미": {
        "role": "",
        "tag": "",
        "persona": "",
        "release_order": 2
    },
    "렌": {
        "role": "",
        "tag": "",
        "persona": "アルセーヌ",
        "release_order": 1
    },
    "루페르": {
        "role": "",
        "tag": "",
        "persona": "ロブロイ",
        "release_order": 0
    },
    "레오": {
        "role": "",
        "tag": "",
        "persona": "エリテイア",
        "release_order": 0
    },
    "류지": {
        "role": "",
        "tag": "",
        "persona": "キャプテン・キッド",
        "release_order": 0
    },
    "모르가나": {
        "role": "",
        "tag": "",
        "persona": "ゾロ",
        "release_order": 0
    },
    "모토하": {
        "role": "",
        "tag": "",
        "persona": "アルビルダ",
        "release_order": 0
    },
    "몽타뉴": {
        "role": "",
        "tag": "",
        "persona": "テルプシコレー",
        "release_order": 0
    },
    "슌": {
        "role": "",
        "tag": "",
        "persona": "マンドラン",
        "release_order": 0
    },
    "세이지": {
        "role": "",
        "tag": "",
        "persona": "レウコテア",
        "release_order": 0
    },
    "안": {
        "role": "",
        "tag": "",
        "persona": "カルメン",
        "release_order": 0
    },
    "야오링": {
        "role": "",
        "tag": "",
        "persona": "맹파",
        "release_order": 0,
        "name": "李 瑤鈴"
    },
    "유키미": {
        "role": "",
        "tag": "",
        "persona": "스틱스",
        "release_order": 0,
        "name": "藤川 雪美"
    },
    "키요시": {
        "role": "",
        "tag": "",
        "persona": "프로심나",
        "release_order": 0,
        "name": "黒谷 清志"
    },
    "토모코": {
        "role": "",
        "tag": "",
        "persona": "프로심나",
        "release_order": 0,
        "name": "野毛 智子"
    },
    "토시야": {
        "role": "",
        "tag": "",
        "persona": "고르귀라",
        "release_order": 0,
        "name": "角海 利也"
    },
    "하루나": {
        "role": "",
        "tag": "",
        "persona": "다에이라",
        "release_order": 0,
        "name": "西森 春菜"
    },
    "미유": {
        "role": "",
        "tag": "",
        "persona": "ネメルテス",
        "release_order": 0,
        "name": "佐原 美雪"
    },
    "카요": {
        "role": "",
        "tag": "",
        "persona": "클레오도라",
        "release_order": 0,
        "name": "遠山 香代"
    }
});