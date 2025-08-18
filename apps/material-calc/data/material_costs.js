// MATERIAL_COSTS: 플래너 계산용 백데이터 스켈레톤
// 수치는 임시 0 또는 예시만 포함. 필요 수치 제공 시 이 파일만 채우면 즉시 반영됩니다.
// 키 명칭은 assets/js/material-planner.js 의 MATERIAL_ICONS와 매칭됩니다.

const MATERIAL_COSTS = {
    // LV 10→20, 20→30 ... 형태는 목표 레벨을 키로 사용 (예: 20을 달성할 때 필요한 추가분)
    level: {
        // 목표 레벨 도달 시 한계돌파 + gem 소모
        20: { lv_limit1: 5, konpaku_gem: 1000 },
        30: { lv_limit1: 12, konpaku_gem: 1500 },
        40: { lv_limit2: 6, konpaku_gem: 2000 },
        50: { lv_limit2: 10, konpaku_gem: 2600 },
        60: { lv_limit2: 18, konpaku_gem: 3200 },
        70: { lv_limit3: 12, konpaku_gem: 4500 },
        80: { lv_limit3: 24, konpaku_gem: 6000 }
    },
    weapon: {
        // 무기 한계돌파/강화 시 gem 소모 포함 (수치 임시)
        20: { wp_limit1: 5, konpaku_gem: 800 },
        30: { wp_limit1: 12, konpaku_gem: 1200 },
        40: { wp_limit2: 6, konpaku_gem: 1600 },
        50: { wp_limit2: 10, konpaku_gem: 2200 },
        60: { wp_limit2: 18, konpaku_gem: 2800 },
        70: { wp_limit3: 12, konpaku_gem: 3600 },
        80: { wp_limit3: 24, konpaku_gem: 4800 }
    },
    skills: {
        // 스킬 레벨 목표 도달 시 소모 (요청 표 기반 기본값). 필요 시 수정 가능
        2: { skill_lv_1: 3, konpaku_gem: 1000 },
        3: { skill_lv_1: 6, konpaku_gem: 1500 },
        4: { skill_lv_2: 3, konpaku_gem: 2000 },
        5: { skill_lv_2: 4, konpaku_gem: 2600 },
        6: { skill_lv_2: 6, konpaku_gem: 3200 },
        7: { skill_lv_3: 3, skill_item: 1, konpaku_gem: 4000 },
        8: { skill_lv_3: 4, skill_item: 1, konpaku_gem: 5200 },
        9: { skill_lv_3: 6, skill_rose: 1, skill_item: 1, konpaku_gem: 6800 },
        10:{ skill_lv_3: 12, skill_rose: 1, skill_item: 1, konpaku_gem: 8200 }
    },
    mind: {
        base: { 1:{ md_mercury:100 }, 2:{ md_mercury:150 }, 3:{ md_mercury:200 }, 4:{ md_mercury:300 }, 5:{ md_mercury:400 }, 6:{ md_mercury:500 }, 7:{ md_mercury:650 }, 8:{ md_mercury:800 }, 9:{ md_mercury:950 }, 10:{ md_mercury:1100 }, 11:{ md_mercury:1250 }, 12:{ md_mercury:1450 } },
        // 스탯/스킬은 1→5를 2,3,4,5 도달 레벨 키로 표기
        stat1: { 1: { md_stat1: 35 }, 2: { md_stat1: 75 }, 3: { md_stat1: 110 } },
        stat2: { 4: { md_stat2: 6 }, 5: { md_stat2: 15 } },
        skill1: { 1: { md_skill1: 25 }, 2: { md_skill1: 50 }, 3: { md_skill1: 80 }},
        skill2: { 4: { md_skill2: 2 }, 5: { md_skill2: 3 } },
        // 속성 강화 1→12 (도달 레벨 키)
        attr: { 1:{ md_bell:10 },2:{ md_bell:20 },3:{ md_bell:30 },4:{ md_bell:45 },5:{ md_bell:65 },6:{ md_bell:85 },7:{ md_bell:110 },8:{ md_bell:135 },9:{ md_bell:165 },10:{ md_bell:200 },11:{ md_bell:240 },12:{ md_bell:280 } }
    }
};


