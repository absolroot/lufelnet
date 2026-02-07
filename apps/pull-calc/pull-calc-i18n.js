/**
 * P5X Pull Calculator - i18n Module
 * 다국어 지원 및 Must Read 콘텐츠
 */

// i18n Labels
const I18N = {
    kr: {
        pageTitle: '가챠 플래너',
        navHome: '홈',
        navCurrent: '가챠 플래너',
        assetsTitle: '보유 자산',
        incomeTitle: '수입 설정',
        pityTitle: '피티 설정',
        loading: '로딩 중...',
        scheduleNotice: '이 스케줄은 예상 일정이며, 실제 출시 날짜와 다를 수 있습니다. 클릭하여 계획에 추가/제거하세요.',
        chartTitle: '재화 변화 그래프',
        chartEmpty: '타임라인에서 캐릭터를 선택하세요',
        planTitle: '가챠 계획',
        planDescription: '타임라인에서 캐릭터를 클릭하여 계획에 추가하세요. 이미 출시된 캐릭터가 데이터에 남아있는 경우 그래프가 그려지지 않습니다. ',
        ember: '이계 엠버',
        ticket: '계약 티켓',
        paidEmber: '유료 엠버',
        weaponTicket: '무기 티켓',
        cognigem: '인지 단면',
        totalEmber: '총 엠버:',
        dailyMission: '일일 미션',
        monthlySub: '월정액',
        versionIncome: '버전별 수입',
        battlePass: '배틀 패스',
        recursive: '인지 단면 재귀적 변환',
        charPity: '캐릭터 피티',
        weaponPity: '무기 피티',
        weapon5050Failed: '무기 50:50 실패',
        weaponScenario: '무기 계산 시나리오',
        weaponScenarioBest: '최선 (모든 50:50 성공)',
        weaponScenarioAverage: '평균 (절반 성공)',
        weaponScenarioWorst: '최악 (모든 50:50 실패)',
        pitySource: 'Pity 중간값은 iantCode의 P5X 가챠 통계 데이터를 기반으로 산정됩니다.',
        daysLeft: '일 후',
        daysAgo: '일 전',
        today: '오늘',
        safe: '성공',
        shortage: '부족',
        charTarget: '캐릭터 목표',
        weaponTarget: '무기 목표',
        pulls: '회',
        tickets: '장',
        extraPurchase: '추가 구매',
        currentResources: '해당 시점 보유 재화',
        tooltipTicket: '1장 = 150 엠버',
        tooltipWeaponTicket: '1장 = 100 엠버',
        tooltipCognigem: '10개 = 100 엠버 (글로벌판)',
        tooltipDailyMission: '매일 획득 가능한 엠버. 기본값 80.',
        tooltipVersionIncome: '각 버전(패치)마다 지급되는 수입. 흉몽(NTMR), 바다(SoS) 등 주간 콘텐츠 합계를 버전 기간으로 나눈 값 + 점검 보상, 리딤 코드, 이벤트 등. 보수적으로 설정된 값으로 개인이 알맞게 조정하세요. 현재 진행 중인 배너에는 해당 보상을 이미 수령한 것으로 간주하고 포함되지 않습니다.',
        tooltipMonthlySub: '월정액 구매 시 매일 획득하는 엠버. 기본값 100.',
        tooltipBattlePass: '배틀 패스 구매 시 각 패치마다 획득하는 엠버. 기본값 1430 (한정 티켓 5장 + 유료 엠버 680).',
        tooltipRecursive: '모든 4성 캐릭터 풀돌(A6) 상태를 가정합니다. 4성, 5성 캐릭터를 뽑을 때 획득하는 인지 단면을 즉시 엠버로 변환(10개=100엠버)하여 다시 뽑기에 사용합니다.',
        tooltipCharPity: '캐릭터 배너에서 마지막 5성을 뽑은 후 경과한 뽑기 수입니다. 110회는 하드 피티(천장 확정)입니다.',
        tooltipWeaponPity: '무기 배너에서 마지막 5성을 뽑은 후 경과한 뽑기 수입니다. 70회는 하드 피티(천장)입니다.',
        tooltipWeapon5050Failed: '무기 배너에서 50% 확률로 한정 무기를 뽑지 못했는지 여부입니다. 실패 시 다음 5성은 반드시 픽업 무기입니다.',
        tooltipWeaponScenario: '무기 50:50의 운을 기준으로 필요 엠버량을 계산합니다. 최선: 모든 50:50 성공, 평균: 절반 성공, 최악: 모든 50:50 실패',
        tooltipChart: '시간에 따른 재화 변화를 보여줍니다. 빨간색 영역은 재화가 부족한 구간입니다.',
        charPityProgress: '캐릭터 진행 중',
        weaponPityProgress: '무기 진행 중',
        monthlySubPerDay: '월정액 (엠버/일)',
        battlePassPerPatch: '배틀 패스 (엠버/패치)',
        incomeDaily: '일일',
        incomeWeekly: '주간',
        incomeMonthly: '월간',
        incomeVersion: '버전',
        incomeBattlePass: '패스',
        incomeOnce: '1회',
        scheduleScenario: '4.0 이후 스케줄 시나리오',
        scheduleScenario3Weeks: '3주 간격 (보상 1.5배)',
        scheduleScenario2Weeks: '2주 간격 (보상 1배)',
        tooltipScheduleScenario: '4.0 이후 버전 간격과 보상 배율을 선택합니다.',
        tooltipExtraIncome: 'Weekly는 월요일을 기준으로 계산되며, Monthly는 1일을 기준으로 계산됩니다. (현재 배너 시작일 ~ 다음 배너 시작일 구간)',
        extraIncomeTitle: '추가 수입',
        extraIncomeAdd: '+',
        freqDaily: '일일',
        freqWeekly: '주간',
        freqMonthly: '월간',
        freqVersion: '버전',
        freqOnce: '1회',
        mustReadTitle: '계산기 기준 및 안내',
        labelSeaServer: 'SEA 서버 (일정 +8일)',
        tooltipSeaServer: 'SEA 서버는 기본 일정보다 8일 늦습니다. 활성화 시 모든 출시 일정이 8일 연기되며, 현재 계획이 초기화됩니다.'
    },
    en: {
        pageTitle: 'Pull Planner',
        navHome: 'Home',
        navCurrent: 'Pull Planner',
        assetsTitle: 'Current Assets',
        incomeTitle: 'Income Settings',
        pityTitle: 'Pity Progress Settings',
        loading: 'Loading...',
        scheduleNotice: 'This schedule is estimated and may differ from actual release dates. Click to add/remove from plan.',
        chartTitle: 'Resource Balance Graph',
        chartEmpty: 'Select characters from the timeline',
        planTitle: 'Pull Plan',
        planDescription: 'Click characters from the timeline to add to your plan. If a character that has already been released remains in the data, the graph will not be drawn.',
        ember: 'Meta Jewel',
        ticket: 'Platinum Ticket',
        paidEmber: 'Cognition Crystals',
        weaponTicket: 'Platinum Milicoin',
        cognigem: 'Cognigem',
        totalEmber: 'Total Jewel:',
        dailyMission: 'Daily Mission',
        monthlySub: 'Monthly Pass',
        versionIncome: 'Version Income',
        battlePass: 'Battle Pass',
        recursive: 'Cognigem Recursive Conversion',
        charPity: 'Character Pity Progress',
        weaponPity: 'Weapon Pity Progress',
        weapon5050Failed: 'Weapon 50:50 Failed',
        weaponScenario: 'Weapon Calculation Scenario',
        weaponScenarioBest: 'Best (All 50:50 Won)',
        weaponScenarioAverage: 'Average (Half Won)',
        weaponScenarioWorst: 'Worst (All 50:50 Lost)',
        pitySource: 'Pity median is calculated based on iantCode\'s P5X gacha statistics data.',
        daysLeft: 'days left',
        daysAgo: 'days ago',
        today: 'Today',
        safe: 'Safe',
        shortage: 'Shortage',
        charTarget: 'Character Target',
        weaponTarget: 'Weapon Target',
        pulls: 'pulls',
        tickets: 'tickets',
        extraPurchase: 'Extra Purchase',
        currentResources: 'Resources at this point',
        tooltipTicket: '1 ticket = 150 Meta Jewel',
        tooltipWeaponTicket: '1 ticket = 100 Meta Jewel',
        tooltipCognigem: '10 = 100 Meta Jewel (Global)',
        tooltipDailyMission: 'Meta Jewel obtainable daily. Default 80.',
        tooltipVersionIncome: 'Income per version (patch). Sum of weekly content (NTMR, SoS, etc.) divided by the version period + maintenance rewards, redeem codes, events, etc. This is a conservative estimate—adjust it to fit your situation. For the currently ongoing banner, it is assumed you have already received this reward and it is not included.',
        tooltipMonthlySub: 'Meta Jewel obtained daily when purchasing monthly pass. Default 100.',
        tooltipBattlePass: 'Meta Jewel obtained per patch when purchasing battle pass. Default 1430 (5 limited tickets + 680 paid Meta Jewel).',
        tooltipRecursive: 'Assumes all 4-star characters are at full awakening (A6). Cognigem obtained from pulling 4-star characters, 4&5-stars weapons is immediately converted to Meta Jewel (10 = 100 Meta Jewel) and used for more pulls.',
        tooltipCharPity: 'Number of pulls since last 5-star on character banner. 110 is hard pity (guaranteed ceiling).',
        tooltipWeaponPity: 'Number of pulls since last 5-star on weapon banner. 70 is hard pity (ceiling).',
        tooltipWeapon5050Failed: 'Whether you failed the 50% chance to get limited weapon on weapon banner. If failed, next 5-star is guaranteed pickup weapon.',
        tooltipWeaponScenario: 'Calculates required Meta Jewel based on 50:50 luck. Best: All 50:50 won, Average: Half won, Worst: All 50:50 lost',
        tooltipChart: 'Shows resource changes over time. Red areas indicate resource shortage.',
        charPityProgress: 'Character Progress',
        weaponPityProgress: 'Weapon Progress',
        monthlySubPerDay: 'Monthly Pass (Day)',
        battlePassPerPatch: 'Battle Pass (Patch)',
        incomeDaily: 'Daily',
        incomeWeekly: 'Weekly',
        incomeMonthly: 'Monthly',
        incomeVersion: 'Version',
        incomeBattlePass: 'Pass',
        incomeOnce: 'Once',
        scheduleScenario: 'Post-4.0 Schedule Scenario',
        scheduleScenario3Weeks: '3-week interval (1.5x reward)',
        scheduleScenario2Weeks: '2-week interval (1x reward)',
        tooltipScheduleScenario: 'Select version interval and reward multiplier after 4.0.',
        tooltipExtraIncome: 'Weekly income counts Mondays, and Monthly income counts the 1st day of the month between the current and next banner.',
        extraIncomeTitle: 'Extra Income',
        extraIncomeAdd: '+',
        freqDaily: 'Daily',
        freqWeekly: 'Weekly',
        freqMonthly: 'Monthly',
        freqVersion: 'Per Version',
        freqOnce: 'Once',
        mustReadTitle: 'Calculator Criteria & Guide',
        labelSeaServer: 'SEA Server (+8 Days)',
        tooltipSeaServer: 'SEA server schedule is 8 days behind the default schedule. When enabled, all release dates shift by +8 days and your current plan will be reset.'
    },
    jp: {
        pageTitle: 'ガチャプランナー',
        navHome: 'ホーム',
        navCurrent: 'ガチャプランナー',
        assetsTitle: '保有資産',
        incomeTitle: '収入設定',
        pityTitle: '契約 進捗度設定',
        loading: '読み込み中...',
        scheduleNotice: 'このスケジュールは予定であり、実際のリリース日と異なる場合があります。クリックして計画に追加/削除してください。',
        chartTitle: '資源変動グラフ',
        chartEmpty: 'タイムラインからキャラクターを選択してください',
        planTitle: 'ガチャ計画',
        planDescription: 'タイムラインからキャラクターをクリックして計画に追加してください。既にリリースされたキャラクターがデータに残っている場合、グラフは描画されません。',
        ember: '異界琥珀',
        ticket: 'プラチナチケット',
        paidEmber: '異界晶',
        weaponTicket: 'プラチナミリコイン',
        cognigem: '認知の欠片',
        totalEmber: '異界琥珀合計:',
        dailyMission: 'デイリーミッション',
        monthlySub: '月額パス',
        versionIncome: 'バージョン別収入',
        battlePass: 'バトルパス',
        recursive: '認知の欠片再帰的変換',
        charPity: 'キャラクタ 進捗度',
        weaponPity: '武器 進捗度',
        weapon5050Failed: '武器50:50失敗',
        weaponScenario: '武器計算シナリオ',
        weaponScenarioBest: '最善 (全50:50成功)',
        weaponScenarioAverage: '平均 (半分成功)',
        weaponScenarioWorst: '最悪 (全50:50失敗)',
        pitySource: 'Pity中央値はiantCodeのP5Xガチャ統計データに基づいて算出されます。',
        daysLeft: '日後',
        daysAgo: '日前',
        today: '本日',
        safe: '安全',
        shortage: '不足',
        charTarget: 'キャラクター目標',
        weaponTarget: '武器目標',
        pulls: '回',
        tickets: '枚',
        extraPurchase: '追加購入',
        currentResources: 'この時点の資源',
        tooltipTicket: '1枚 = 150異界琥珀',
        tooltipWeaponTicket: '1枚 = 100異界琥珀',
        tooltipCognigem: '10個 = 100異界琥珀 (グローバル版)',
        tooltipDailyMission: '毎日獲得可能な異界琥珀。デフォルト80。',
        tooltipVersionIncome: '各バージョン(パッチ)ごとに支給される収入。悪夢(NTMR)、海(SoS)などの週間コンテンツ合計をバージョン期間で割った値 + メンテナンス報酬、リデムコード、イベントなど。保守的に設定した値なので、状況に合わせて調整してください。現在進行中のバナーについては、すでに受け取ったものとして扱い、含めません。',
        tooltipMonthlySub: '月額パス購入時、毎日獲得する異界琥珀。デフォルト100。',
        tooltipBattlePass: 'バトルパス購入時、各パッチごとに獲得する異界琥珀。デフォルト1430 (限定チケット5枚 + 有料異界琥珀680)。',
        tooltipRecursive: 'すべての4星キャラクターがフル覚醒(A6)状態であることを想定します。4星、5星キャラクターを引く際に獲得する認知の結晶を即座に異界琥珀に変換(10個=100異界琥珀)して再度引くのに使用します。',
        tooltipCharPity: 'キャラクターバナーで最後の5星を引いた後の経過した引く回数です。110回はハードピティ(天井確定)です。',
        tooltipWeaponPity: '武器バナーで最後の5星を引いた後の経過した引く回数です。70回はハードピティ(天井)です。',
        tooltipWeapon5050Failed: '武器バナーで50%の確率で限定武器を引けなかったかどうかです。失敗時、次の5星は必ずピックアップ武器です。',
        tooltipWeaponScenario: '武器50:50の運を基準に必要異界琥珀量を計算します。最善: すべての50:50成功、平均: 半分成功、最悪: すべての50:50失敗',
        tooltipChart: '時間による資源変化を示します。赤い領域は資源が不足している区間です。',
        charPityProgress: 'キャラクター 進捗中',
        weaponPityProgress: '武器 進捗中',
        monthlySubPerDay: '月額パス (日)',
        battlePassPerPatch: 'バトルパス (パッチ)',
        incomeDaily: '日次',
        incomeWeekly: '週間',
        incomeMonthly: '月間',
        incomeVersion: 'バージョン',
        incomeBattlePass: 'パス',
        incomeOnce: '1回',
        scheduleScenario: '4.0以降スケジュールシナリオ',
        scheduleScenario3Weeks: '3週間間隔 (報酬1.5倍)',
        scheduleScenario2Weeks: '2週間間隔 (報酬1倍)',
        tooltipScheduleScenario: '4.0以降のバージョン間隔と報酬倍率を選択します。',
        tooltipExtraIncome: 'Weeklyは月曜日を基準に、Monthlyは毎月1日を基準に計算します。（現在のバナー開始日〜次のバナー開始日）',
        extraIncomeTitle: '追加収入',
        extraIncomeAdd: '+',
        freqDaily: '日次',
        freqWeekly: '週間',
        freqMonthly: '月間',
        freqVersion: 'バージョン',
        freqOnce: '1回',
        mustReadTitle: '計算機の基準と案内',
        labelSeaServer: 'SEAサーバー (+8日)',
        tooltipSeaServer: 'SEAサーバーはデフォルトスケジュールより8日遅れます。有効にすると、すべてのリリース日程が8日延期され、現在の計画がリセットされます.'
    }
};

// Must Read Content by Language
const MUST_READ_CONTENT = {
    kr: `

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

**[면책 조항]** 이 계산기는 계획 수립을 돕기 위한 **단순 참고용 도구**입니다. 실제 게임 내 확률, 이벤트 보상 변경 등으로 인해 결과에 오차가 발생할 수 있으며, 이에 대해 책임지지 않습니다.`,
    en: `

This calculator follows the **'Targeted Contract'** system for characters.

**1. Currency & Cost**
- Platinum Ticket: Equivalent to 150 Meta Jewels.
- Platinum Milicoin: Equivalent to 100 Meta Jewels.
- Priority: Tickets are consumed first. When both Character and Weapon require Jewels, Jewels are prioritized for the Character first.

**2. Character Banner (Targeted)**
- Guarantees the banner 5★ character every 110 pulls.
- Assumes 110 pulls (approx. 16,500 Jewels) are required for one copy.

**3. Weapon Banner (Scenarios)**
- Guarantees a 5★ weapon every 70 pulls with a 50% pickup chance.
- Best: Assumes winning the 50:50 immediately. (Within 70 pulls).
- Average: Calculates based on statistical median and 50% probability.
- Worst: Assumes losing the 50:50 and hitting hard pity. (Up to 140 pulls).

**4. Cognigem Recursive Conversion (Payback)**
- When enabled, assumes **ALL 4★ characters are at Max Awareness (A6)**.
- Character: Excludes 5★ refund (assuming first copy) and calculates conservatively based only on 4★ consolidated rates (~13.1%). (Approx. 13% discount per pull).
- Weapon: Includes consolidated rates for both 5★ (2.3%) and 4★ (14.5%).

---

**[Disclaimer]** This calculator is a tool for **convenience only**. We are not responsible for discrepancies in gacha results or resource calculations due to variable in-game probabilities or event changes.`,
    jp: `

この計算機はキャラクターは**「TARGET契約」**システムに基づいており計算します。

**1. 通貨換算とコスト**
- プラチナチケット: 1枚につき150 異界琥珀(エンバー)として計算されます。
- プラチナミリコイン: 1枚につき100 異界琥珀(エンバー)として計算されます。
- 優先順位: チケットが優先的に消費されます。異界琥珀が必要な場合、キャラクターに優先的に割り当てられます。

**2. キャラクターガチャ（TARGET契約）**
- 110回ごとにピックアップキャラクターが100%確定で排出されます。
- 運の要素を排除し、1体につき110回（約16,500 異界琥珀）が必要と仮定します。

**3. 武器ガチャ（シナリオ別）**
- 70回ごとに★5確定ですが、ピックアップ確率は50%です。
- 最善 (Best): 50:50に一発で成功すると仮定します。（70回以内）
- 普通 (Average): 実際の統計データの中央値(Median)と50%の確率を反映します。
- 最悪 (Worst): 50:50に失敗（すり抜け）し、天井まで引くと仮定します。（最大140回）

**4. 認知の結晶 再帰変換（ペイバック）**
- 有効にすると、**「全★4キャラを完凸(A6)している」**と仮定して計算します。
- キャラクター: ★5獲得時の還元は除外し（初獲得を仮定）、★4の総合確率（約13.1%）のみを反映して保守的に計算します。（1回あたり約13%の割引効果）
- 武器: ★5（2.3%）および★4（14.5%）の総合確率を反映して計算します。

---

**[免責事項]** この計算機は計画を支援するための**参考ツール**です。実際のゲーム内確率やイベント報酬の変更などによる結果の誤差について、一切の責任を負いません。`
};
