/**
 * Pull Calculator - Korean Translations
 * 가챠 플래너 한국어 번역
 */

window.I18N_PAGE_PULL_CALC_KR = {
    pageTitle: '가챠 플래너',
    pageDescription: '예측 출시 스케줄 기반으로 목표 캐릭터 획득에 필요한 재화를 계산하고 계획을 세울 수 있습니다.',
    navCurrent: '가챠 플래너',
    seoKeywords: 'P5X, 페르소나5X, 가챠 플래너, 가챠 계산기, 가챠 시뮬레이터, P5X 계산기, 계약 계획',
    seoOgLocale: 'ko_KR',

    // 섹션 제목
    assetsTitle: '보유 자산',
    incomeTitle: '수입 설정',
    pityTitle: '피티 설정',
    chartTitle: '재화 변화 그래프',
    planTitle: '가챠 계획',
    mustReadTitle: '계산기 기준 및 안내',
    extraIncomeTitle: '추가 수입',

    // 재화 (Resources)
    ember: '이계 엠버',
    ticket: '계약 티켓',
    paidEmber: '유료 엠버',
    weaponTicket: '무기 티켓',
    cognigem: '인지 단면',
    totalEmber: '총 엠버:',

    // 수입 관련
    dailyMission: '일일 미션',
    monthlySub: '월정액',
    versionIncome: '버전별 수입',
    battlePass: '배틀 패스',
    recursive: '인지 단면 재귀적 변환',
    monthlySubPerDay: '월정액 (엠버/일)',
    battlePassPerPatch: '배틀 패스 (엠버/패치)',

    // 수입 빈도
    incomeDaily: '일일',
    incomeWeekly: '주간',
    incomeMonthly: '월간',
    incomeVersion: '버전',
    incomeBattlePass: '패스',
    incomeOnce: '1회',
    freqDaily: '일일',
    freqWeekly: '주간',
    freqMonthly: '월간',
    freqVersion: '버전',
    freqOnce: '1회',
    extraIncomeAdd: '+',

    // 피티 관련
    charPity: '캐릭터 피티',
    weaponPity: '무기 피티',
    weapon5050Failed: '무기 50:50 실패',
    charPityProgress: '캐릭터 진행 중',
    weaponPityProgress: '무기 진행 중',

    // 무기 시나리오
    weaponScenario: '무기 계산 시나리오',
    weaponScenarioBest: '최선 (모든 50:50 성공)',
    weaponScenarioAverage: '평균 (절반 성공)',
    weaponScenarioWorst: '최악 (모든 50:50 실패)',

    // 스케줄
    scheduleNotice: '이 스케줄은 예상 일정이며, 실제 출시 날짜와 다를 수 있습니다. 클릭하여 계획에 추가/제거하세요.',
    scheduleScenario: '4.0 이후 스케줄 시나리오',
    scheduleScenario3Weeks: '3주 간격 (보상 1.5배)',
    scheduleScenario2Weeks: '2주 간격 (보상 1배)',
    labelSeaServer: 'SEA 서버 (일정 +8일)',
    confirmServerChangeReset: '서버 설정을 변경하면 현재 계획/목표가 초기화됩니다. 계속하시겠습니까?',

    // 계획 관련
    planDescription: '타임라인에서 캐릭터를 클릭하여 계획에 추가하세요.',
    chartEmpty: '타임라인에서 캐릭터를 선택하세요',
    charTarget: '캐릭터 목표',
    weaponTarget: '무기 목표',
    pulls: '회',
    tickets: '장',
    extraPurchase: '추가 구매',
    currentResources: '해당 시점 보유 재화',
    statusAvailable: '보유',
    statusRequired: '필요',
    statusAfter: '결과',
    noneLabel: '없음',

    // 상태
    loading: '로딩 중...',
    safe: '성공',
    shortage: '부족',
    daysLeft: '일 후',
    daysAgo: '일 전',
    today: '오늘',

    // 데이터 출처
    pitySource: 'Pity 중간값은 iantCode의 P5X 가챠 통계 데이터를 기반으로 산정됩니다.',

    // 툴팁
    tooltips: {
        ticket: '1장 = 150 엠버',
        weaponTicket: '1장 = 100 엠버',
        cognigem: '10개 = 100 엠버 (글로벌판)',
        dailyMission: '매일 획득 가능한 엠버. 기본값 80.',
        versionIncome: '각 버전(패치)마다 지급되는 수입. 흉몽(NTMR), 바다(SoS) 등 주간 콘텐츠 합계를 버전 기간으로 나눈 값 + 점검 보상, 리딤 코드, 이벤트 등. 보수적으로 설정된 값으로 개인이 알맞게 조정하세요. 현재 진행 중인 배너에는 해당 보상을 이미 수령한 것으로 간주하고 포함되지 않습니다.',
        monthlySub: '월정액 구매 시 매일 획득하는 엠버. 기본값 100.',
        battlePass: '배틀 패스 구매 시 각 패치마다 획득하는 엠버. 기본값 1430 (한정 티켓 5장 + 유료 엠버 680).',
        recursive: '모든 4성 캐릭터 풀돌(A6) 상태를 가정합니다. 4성, 5성 캐릭터를 뽑을 때 획득하는 인지 단면을 즉시 엠버로 변환(10개=100엠버)하여 다시 뽑기에 사용합니다.',
        charPity: '캐릭터 배너에서 마지막 5성을 뽑은 후 경과한 뽑기 수입니다. 110회는 하드 피티(천장 확정)입니다.',
        weaponPity: '무기 배너에서 마지막 5성을 뽑은 후 경과한 뽑기 수입니다. 70회는 하드 피티(천장)입니다.',
        weapon5050Failed: '무기 배너에서 50% 확률로 한정 무기를 뽑지 못했는지 여부입니다. 실패 시 다음 5성은 반드시 픽업 무기입니다.',
        weaponScenario: '무기 50:50의 운을 기준으로 필요 엠버량을 계산합니다. 최선: 모든 50:50 성공, 평균: 절반 성공, 최악: 모든 50:50 실패',
        chart: '시간에 따른 재화 변화를 보여줍니다. 빨간색 영역은 재화가 부족한 구간입니다.',
        scheduleScenario: '4.0 이후 버전 간격과 보상 배율을 선택합니다.',
        extraIncome: 'Weekly는 월요일을 기준으로 계산되며, Monthly는 1일을 기준으로 계산됩니다. (현재 배너 시작일 ~ 다음 배너 시작일 구간)',
        seaServer: 'SEA 서버는 기본 일정보다 8일 늦습니다. 활성화 시 모든 출시 일정이 8일 연기되며, 현재 계획이 초기화됩니다.'
    },

    // Must Read Content
    mustReadContent: `

이 계산기는 캐릭터는 **'확정 계약(Targeted Contract)'** 시스템을 기준으로 동작합니다.

**1. 재화 환산 및 비용**
- 계약 티켓: 1장은 150 이계 엠버 가치로 계산됩니다.
- 무기 티켓: 1장은 100 이계 엠버 가치로 계산됩니다.
- 우선순위: 티켓을 최우선으로 소모하며, 부족분은 엠버로 충당합니다. 동시 지출 시 **캐릭터에 엠버를 우선 할당**합니다.

**2. 캐릭터 뽑기 (Targeted)**
- 확정 계약은 110회마다 픽업 캐릭터를 100% 확정 획득합니다.
- 운을 배제하고, 픽업 1명당 110회(약 16,500 엠버)가 필요하다고 가정합니다.

**3. 무기 뽑기 (시나리오)**
- 무기는 70회마다 5성을 확정 획득하지만, 픽업 확률은 50%입니다.
- 최선(Best): 50:50을 한 번에 성공한다고 가정합니다. (70회 이내)
- 평균(Average): 실제 유저 통계의 중간값(Median)과 50% 확률을 반영합니다.
- 최악(Worst): 50:50 실패(픽뚫) 후 천장을 친다고 가정합니다. (최대 140회)

**4. 인지 결정 재귀 변환 (페이백)**
- 옵션 활성화 시, **"모든 4성 캐릭터 풀돌(A6)"** 상태를 가정하여 계산합니다.
- 캐릭터: 5성 획득 시의 환급은 배제하고(첫 획득 가정), 오직 4성 중복 획득 확률(약 13.1%)만을 반영하여 보수적으로 계산합니다. (1회당 약 13% 할인 효과)
- 무기: 5성(2.3%) 및 4성(14.5%) 종합 확률을 반영하여 계산합니다.

---

**[면책 조항]** 이 계산기는 계획 수립을 돕기 위한 **단순 참고용 도구**입니다. 실제 게임 내 확률, 이벤트 보상 변경 등으로 인해 결과에 오차가 발생할 수 있으며, 이에 대해 책임지지 않습니다.`
};
