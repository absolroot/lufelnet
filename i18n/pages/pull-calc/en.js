/**
 * Pull Calculator - English Translations
 * 가챠 플래너 영어 번역
 */

window.I18N_PAGE_PULL_CALC_EN = {
    pageTitle: 'Pull Planner',
    pageDescription: 'Calculate resources needed to pull your target character based on the predicted release schedule.',
    navCurrent: 'Pull Planner',
    seoKeywords: 'P5X, Persona 5X, Pull Planner, Gacha Calculator, Pull Simulator, Pull Calculator, Gacha Planning',
    seoOgLocale: 'en_US',

    // Section titles
    assetsTitle: 'Current Assets',
    incomeTitle: 'Income Settings',
    pityTitle: 'Pity Progress Settings',
    chartTitle: 'Resource Balance Graph',
    planTitle: 'Pull Plan',
    mustReadTitle: 'Calculator Criteria & Guide',
    extraIncomeTitle: 'Extra Income',

    // Resources
    ember: 'Meta Jewel',
    ticket: 'Platinum Ticket',
    paidEmber: 'Cognition Crystals',
    weaponTicket: 'Platinum Milicoin',
    cognigem: 'Cognigem',
    totalEmber: 'Total Jewel:',

    // Income related
    dailyMission: 'Daily Mission',
    monthlySub: 'Monthly Pass',
    versionIncome: 'Version Income',
    battlePass: 'Battle Pass',
    recursive: 'Cognigem Recursive Conversion',
    monthlySubPerDay: 'Monthly Pass (Day)',
    battlePassPerPatch: 'Battle Pass (Patch)',

    // Income frequency
    incomeDaily: 'Daily',
    incomeWeekly: 'Weekly',
    incomeMonthly: 'Monthly',
    incomeVersion: 'Version',
    incomeBattlePass: 'Pass',
    incomeOnce: 'Once',
    freqDaily: 'Daily',
    freqWeekly: 'Weekly',
    freqMonthly: 'Monthly',
    freqVersion: 'Per Version',
    freqOnce: 'Once',
    extraIncomeAdd: '+',

    // Pity related
    charPity: 'Character Pity Progress',
    weaponPity: 'Weapon Pity Progress',
    weapon5050Failed: 'Weapon 50:50 Failed',
    charPityProgress: 'Character Progress',
    weaponPityProgress: 'Weapon Progress',

    // Weapon scenarios
    weaponScenario: 'Weapon Calculation Scenario',
    weaponScenarioBest: 'Best (All 50:50 Won)',
    weaponScenarioAverage: 'Average (Half Won)',
    weaponScenarioWorst: 'Worst (All 50:50 Lost)',

    // Schedule
    scheduleNotice: 'This schedule is estimated and may differ from actual release dates. Click to add/remove from plan.',
    scheduleScenario: 'Post-4.0 Schedule Scenario',
    scheduleScenario3Weeks: '3-week interval (1.5x reward)',
    scheduleScenario2Weeks: '2-week interval (1x reward)',
    labelSeaServer: 'SEA Server (+8 Days)',
    confirmServerChangeReset: 'Changing server settings will reset your current plan/targets. Continue?',

    // Plan related
    planDescription: 'Click characters from the timeline to add to your plan. If a character that has already been released remains in the data, the graph will not be drawn.',
    chartEmpty: 'Select characters from the timeline',
    charTarget: 'Character Target',
    weaponTarget: 'Weapon Target',
    pulls: 'pulls',
    tickets: 'tickets',
    extraPurchase: 'Extra Purchase',
    currentResources: 'Resources at this point',
    statusAvailable: 'Available',
    statusRequired: 'Required',
    statusAfter: 'After',
    noneLabel: 'None',

    // Status
    loading: 'Loading...',
    safe: 'Safe',
    shortage: 'Shortage',
    daysLeft: 'days left',
    daysAgo: 'days ago',
    today: 'Today',

    // Data source
    pitySource: 'Pity median is calculated based on iantCode\'s P5X gacha statistics data.',

    // Tooltips
    tooltips: {
        ticket: '1 ticket = 150 Meta Jewel',
        weaponTicket: '1 ticket = 100 Meta Jewel',
        cognigem: '10 = 100 Meta Jewel (Global)',
        dailyMission: 'Meta Jewel obtainable daily. Default 80.',
        versionIncome: 'Income per version (patch). Sum of weekly content (NTMR, SoS, etc.) divided by the version period + maintenance rewards, redeem codes, events, etc. This is a conservative estimate—adjust it to fit your situation. For the currently ongoing banner, it is assumed you have already received this reward and it is not included.',
        monthlySub: 'Meta Jewel obtained daily when purchasing monthly pass. Default 100.',
        battlePass: 'Meta Jewel obtained per patch when purchasing battle pass. Default 1430 (5 limited tickets + 680 paid Meta Jewel).',
        recursive: 'Assumes all 4-star characters are at full awakening (A6). Cognigem obtained from pulling 4-star characters, 4&5-stars weapons is immediately converted to Meta Jewel (10 = 100 Meta Jewel) and used for more pulls.',
        charPity: 'Number of pulls since last 5-star on character banner. 110 is hard pity (guaranteed ceiling).',
        weaponPity: 'Number of pulls since last 5-star on weapon banner. 70 is hard pity (ceiling).',
        weapon5050Failed: 'Whether you failed the 50% chance to get limited weapon on weapon banner. If failed, next 5-star is guaranteed pickup weapon.',
        weaponScenario: 'Calculates required Meta Jewel based on 50:50 luck. Best: All 50:50 won, Average: Half won, Worst: All 50:50 lost',
        chart: 'Shows resource changes over time. Red areas indicate resource shortage.',
        scheduleScenario: 'Select version interval and reward multiplier after 4.0.',
        extraIncome: 'Weekly income counts Mondays, and Monthly income counts the 1st day of the month between the current and next banner.',
        seaServer: 'SEA server schedule is 8 days behind the default schedule. When enabled, all release dates shift by +8 days and your current plan will be reset.'
    },

    // Must Read Content
    mustReadContent: `

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

**[Disclaimer]** This calculator is a tool for **convenience only**. We are not responsible for discrepancies in gacha results or resource calculations due to variable in-game probabilities or event changes.`
};
