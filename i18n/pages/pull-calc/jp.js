/**
 * Pull Calculator - Japanese Translations
 * ガチャプランナー 일본어 번역
 */

window.I18N_PAGE_PULL_CALC_JP = {
    pageTitle: 'ガチャプランナー',
    pageDescription: '予測リリーススケジュールを基に、目標キャラクター獲得に必要なリソースを計算してプランを立てられます。',
    navCurrent: 'ガチャプランナー',
    seoKeywords: 'P5X, ペルソナ5X, ガチャプランナー, ガチャ計算機, ガチャシミュレーター, P5X計算機, ガチャ計画',
    seoOgLocale: 'ja_JP',

    // セクションタイトル
    assetsTitle: '保有資産',
    incomeTitle: '収入設定',
    pityTitle: '契約 進捗度設定',
    chartTitle: '資源変動グラフ',
    planTitle: 'ガチャ計画',
    mustReadTitle: '計算機の基準と案内',
    extraIncomeTitle: '追加収入',

    // 資源
    ember: '異界琥珀',
    ticket: 'プラチナチケット',
    paidEmber: '異界晶',
    weaponTicket: 'プラチナミリコイン',
    cognigem: '認知の欠片',
    totalEmber: '異界琥珀合計:',

    // 収入関連
    dailyMission: 'デイリーミッション',
    monthlySub: '月額パス',
    versionIncome: 'バージョン別収入',
    battlePass: 'バトルパス',
    recursive: '認知の欠片再帰的変換',
    monthlySubPerDay: '月額パス (日)',
    battlePassPerPatch: 'バトルパス (パッチ)',

    // 収入頻度
    incomeDaily: '日次',
    incomeWeekly: '週間',
    incomeMonthly: '月間',
    incomeVersion: 'バージョン',
    incomeBattlePass: 'パス',
    incomeOnce: '1回',
    freqDaily: '日次',
    freqWeekly: '週間',
    freqMonthly: '月間',
    freqVersion: 'バージョン',
    freqOnce: '1回',
    extraIncomeAdd: '+',

    // 進捗度関連
    charPity: 'キャラクタ 進捗度',
    weaponPity: '武器 進捗度',
    weapon5050Failed: '武器50:50失敗',
    charPityProgress: 'キャラクター 進捗中',
    weaponPityProgress: '武器 進捗中',

    // 武器シナリオ
    weaponScenario: '武器計算シナリオ',
    weaponScenarioBest: '最善 (全50:50成功)',
    weaponScenarioAverage: '平均 (半分成功)',
    weaponScenarioWorst: '最悪 (全50:50失敗)',

    // スケジュール
    scheduleNotice: 'このスケジュールは予定であり、実際のリリース日と異なる場合があります。クリックして計画に追加/削除してください。',
    scheduleScenario: '4.0以降スケジュールシナリオ',
    scheduleScenario3Weeks: '3週間間隔 (報酬1.5倍)',
    scheduleScenario2Weeks: '2週間間隔 (報酬1倍)',
    labelSeaServer: 'SEAサーバー (+8日)',
    confirmServerChangeReset: 'サーバー設定を変更すると、現在の計画/目標がリセットされます。続けますか？',

    // 計画関連
    planDescription: 'タイムラインからキャラクターをクリックして計画に追加してください。既にリリースされたキャラクターがデータに残っている場合、グラフは描画されません。',
    chartEmpty: 'タイムラインからキャラクターを選択してください',
    charTarget: 'キャラクター目標',
    weaponTarget: '武器目標',
    pulls: '回',
    tickets: '枚',
    extraPurchase: '追加購入',
    currentResources: 'この時点の資源',
    statusAvailable: '所持',
    statusRequired: '必要',
    statusAfter: '結果',
    noneLabel: 'なし',

    // ステータス
    loading: '読み込み中...',
    safe: '安全',
    shortage: '不足',
    daysLeft: '日後',
    daysAgo: '日前',
    today: '本日',

    // データソース
    pitySource: 'Pity中央値はiantCodeのP5Xガチャ統計データに基づいて算出されます。',

    // ツールチップ
    tooltips: {
        ticket: '1枚 = 150異界琥珀',
        weaponTicket: '1枚 = 100異界琥珀',
        cognigem: '10個 = 100異界琥珀 (グローバル版)',
        dailyMission: '毎日獲得可能な異界琥珀。デフォルト80。',
        versionIncome: '各バージョン(パッチ)ごとに支給される収入。悪夢(NTMR)、海(SoS)などの週間コンテンツ合計をバージョン期間で割った値 + メンテナンス報酬、リデムコード、イベントなど。保守的に設定した値なので、状況に合わせて調整してください。現在進行中のバナーについては、すでに受け取ったものとして扱い、含めません。',
        monthlySub: '月額パス購入時、毎日獲得する異界琥珀。デフォルト100。',
        battlePass: 'バトルパス購入時、各パッチごとに獲得する異界琥珀。デフォルト1430 (限定チケット5枚 + 有料異界琥珀680)。',
        recursive: 'すべての4星キャラクターがフル覚醒(A6)状態であることを想定します。4星、5星キャラクターを引く際に獲得する認知の結晶を即座に異界琥珀に変換(10個=100異界琥珀)して再度引くのに使用します。',
        charPity: 'キャラクターバナーで最後の5星を引いた後の経過した引く回数です。110回はハードピティ(天井確定)です。',
        weaponPity: '武器バナーで最後の5星を引いた後の経過した引く回数です。70回はハードピティ(天井)です。',
        weapon5050Failed: '武器バナーで50%の確率で限定武器を引けなかったかどうかです。失敗時、次の5星は必ずピックアップ武器です。',
        weaponScenario: '武器50:50の運を基準に必要異界琥珀量を計算します。最善: すべての50:50成功、平均: 半分成功、最悪: すべての50:50失敗',
        chart: '時間による資源変化を示します。赤い領域は資源が不足している区間です。',
        scheduleScenario: '4.0以降のバージョン間隔と報酬倍率を選択します。',
        extraIncome: 'Weeklyは月曜日を基準に、Monthlyは毎月1日を基準に計算します。（現在のバナー開始日〜次のバナー開始日）',
        seaServer: 'SEAサーバーはデフォルトスケジュールより8日遅れます。有効にすると、すべてのリリース日程が8日延期され、現在の計画がリセットされます.'
    },

    // Must Read Content
    mustReadContent: `

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
