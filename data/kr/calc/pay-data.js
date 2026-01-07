const PAY_DATA = {
    packages: [
        /*
        {
            name: "1주년 패키지 1",
            crystal: 300,
            amber: 3000,
            price: 3000,
            maxCount: 1
        },
        {
            name: "1주년 패키지 2",
            destiny: 15,
            destiny_future: 15,
            price: 19000,
            maxCount: 1
        },
        {
            name: "1주년 패키지 3",
            destinyCoins: 20,
            price: 13000,
            maxCount: 1
        },
        {
            name: "1주년 패키지 4",
            amber: 2680,
            price: 51000,
            maxCount: 1
        },*/
        {
            name: "마루치무의 VIP 패키지",
            crystal: 300,
            amber: 3000,
            price: 6000,
            maxCount: 9,
            note: "30일"
        },
        {
            name: "패키지 특별",
            destiny: 5,
            price: 6800,
            maxCount: 9,
            note: "버전당 1개"
        },
        {
            name: "보급 특별",
            destinyCoins: 5,
            price: 4400,
            maxCount: 9,
            note: "버전당 1개"
        },
        {
            name: "주간 보급 패키지1",
            destiny: 10,
            destinyCoins: 5,
            price: 12000,
            maxCount: 99,
            note: "매주 수요일"
        },
        {
            name: "주간 보급 패키지2",
            destiny: 20,
            destinyCoins: 10,
            destiny_future: 10,
            price: 51000,
            maxCount: 99,
            note: "매주 수요일"
        },
        {
            name: "월간 전술 보급",
            amber: 600,
            destinyCoins: 20,
            price: 25000,
            maxCount: 9,
            note: "매월 1일"
        },
        {
            name: "월간 계약 보급",
            amber: 1000,
            destiny: 20,
            price: 38000,
            maxCount: 9,
            note: "매월 1일"
        },
        {
            name: "디럭스 패스",
            amber: 650,
            destiny: 3,
            destinyCoins: 3,
            luckyCoins: 4,
            price: 13000,
            maxCount: 99,
            note: "2버전당 1개"
        },
        {
            name: "얼티밋 패스",
            amber: 1150,
            destiny: 3,
            destinyCoins: 3,
            price: 23000,
            maxCount: 99,
            note: "2버전당 1개"
        },
        {
            name: "캐릭터 패키지",
            destiny: 10,
            price: 13000,
            maxCount: 99,
            note: "매주 목요일"
        },
        {
            name: "캐릭터 패키지 2",
            destiny: 25,
            price: 33000,
            maxCount: 99,
            note: "매주 목요일"
        },
        {
            name: "캐릭터 패키지 3",
            destiny: 30,
            destiny_future: 3,
            price: 62000,
            maxCount: 99,
            note: "매주 목요일 2개"
        },
        {
            name: "캐릭터 보급",
            destinyCoins: 10,
            price: 9200,
            maxCount: 99,
            note: "매주 목요일"
        },
        {
            name: "캐릭터 보급 2",
            destinyCoins: 25,
            price: 22000,
            maxCount: 99,
            note: "매주 목요일"
        },
        {
            name: "캐릭터 보급 3",
            destinyCoins: 30,
            price: 42000,
            maxCount: 99,
            note: "매주 목요일"
        },
        {
            name: "7일보급 캐릭터",
            crystal: 120,
            amber: 700,
            price: 2400,
            maxCount: 9,
            note: "버전당 1개"
        },
        {
            name: "캐릭터 음료 보급",
            crystal: 180,
            price: 3600,
            maxCount: 9,
            note: "버전당 1개"
        },
        {
            name: "보급 패키지·캐릭터",
            destiny: 20,
            destinyCoins: 20,
            price: 62000,
            maxCount: 9,
            note: "버전당 1개"
        },
        {
            name: "일일 소원 복주머니",
            amber: 30,
            price: 600,
            maxCount: 99,
            note: "매일 1개"
        },
        {
            name: "일일 소원 복주머니(7일)",
            amber: 210,
            price: 4000,
            maxCount: 99,
            note: "7일"
        },
        {
            name: "특별 한정 패키지 1",
            destiny: 25,
            price: 49500,
            maxCount: 99,
            note: "버전당 2개"
        },
        {
            name: "특별 한정 패키지 2",
            destiny: 40,
            destiny_future: 5,
            destinyCoins: 30,
            price: 119000,
            maxCount: 99,
            note: "버전당 2개"
        },
        {
            name: "특별 한정 패키지 3",
            destiny_future: 35,
            destinyCoins: 25,
            price: 99000,
            maxCount: 99,
            note: "버전당 2개"
        },
        {
            name: "별의 계시",
            amber: 2680,
            price: 51000,
            maxCount: 99,
            note: "버전당 3개"
        },
        {
            name: "별의 영원",
            amber: 3280,
            price: 62000,
            maxCount: 99,
            note: "버전당 3개"
        }
    ],
    crystalPackages: [
        {
            name: "이계 수정 60",
            crystal: 60,
            price: 1200,
            maxCount: 99
        },
        {
            name: "이계 수정 300",
            crystal: 330,
            price: 6000,
            maxCount: 99
        },
        {
            name: "이계 수정 980",
            crystal: 1100,
            price: 19000,
            maxCount: 99
        },
        {
            name: "이계 수정 1980",
            crystal: 2280,
            price: 38000,
            maxCount: 99
        },
        {
            name: "이계 수정 3280",
            crystal: 3880,
            price: 62000,
            maxCount: 99
        },
        {
            name: "이계 수정 6480",
            crystal: 8080,
            price: 119000,
            maxCount: 99
        },
        {
            name: "이계 수정 60 (초회)",
            crystal: 120,
            price: 1200,
            maxCount: 1
        },
        {
            name: "이계 수정 300 (초회)",
            crystal: 600,
            price: 6000,
            maxCount: 1
        },
        {
            name: "이계 수정 980 (초회)",
            crystal: 1960,
            price: 19000,
            maxCount: 1
        },
        {
            name: "이계 수정 1980 (초회)",
            crystal: 3960,
            price: 38000,
            maxCount: 1
        },
        {
            name: "이계 수정 3280 (초회)",
            crystal: 6560,
            price: 62000,
            maxCount: 1
        },
        {
            name: "이계 수정 6480 (초회)",
            crystal: 12960,
            price: 119000,
            maxCount: 1
        }
    ],
    discountOptions: [
        { label: "-", value: 0, type: "fixed" },
        { label: "2,000원", value: 2000, type: "fixed" },
        { label: "5,000원", value: 5000, type: "fixed" },
        { label: "10,000원", value: 10000, type: "fixed" },
        { label: "20,000원", value: 20000, type: "fixed" },
        { label: "30,000원", value: 30000, type: "fixed" },
        { label: "40,000원", value: 40000, type: "fixed" },
        { label: "50,000원", value: 50000, type: "fixed" },
        { label: "10%", value: 10, type: "percent" },
        { label: "15%", value: 15, type: "percent" },
        { label: "20%", value: 20, type: "percent" },
        { label: "30%", value: 30, type: "percent" },
        { label: "40%", value: 40, type: "percent" },
        { label: "50%", value: 50, type: "percent" }
    ]
};
