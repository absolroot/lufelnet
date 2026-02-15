/**
 * P5X Pull Calculator
 * 뽑기 계획 시뮬레이터 - 재화 및 수입 기반 다중 목표 계획 수립
 */

const PITY_EN_URL = 'https://raw.githubusercontent.com/iantCode/P5X_Gacha_Statistics/refs/heads/main/pity/pity_en.json';

// i18n is provided by i18n/service/i18n-service.js + i18n-adapter.js

/**
 * Wallet System - Manages assets with proper consumption priorities
 */
class Wallet {
    constructor(ember = 0, ticket = 0, paidEmber = 0, weaponTicket = 0, cognigem = 0) {
        this.ember = ember;              // Metajewel (free currency)
        this.ticket = ticket;            // Platinum Ticket (character only)
        this.paidEmber = paidEmber;      // Paid Jewel
        this.weaponTicket = weaponTicket; // Weapon Ticket (weapon only)
        this.cognigem = cognigem;        // Cognigem (converts to ember)
    }

    clone() {
        return new Wallet(this.ember, this.ticket, this.paidEmber, this.weaponTicket, this.cognigem);
    }

    /**
     * Calculate total ember equivalent (for display)
     */
    getTotalEmber() {
        return this.ember + this.paidEmber + this.cognigem * 10;
    }

    /**
     * Add income to wallet
     */
    addIncome(emberAmount) {
        this.ember += emberAmount;
    }

    /**
     * Spend assets for character pull
     * Priority: Platinum Ticket -> Metajewel -> Paid Ember -> Cognigem
     */
    spendForCharacter(emberCost) {
        const result = {
            success: true,
            shortage: 0,
            used: { ticket: 0, ember: 0, paidEmber: 0, cognigem: 0 }
        };

        let remaining = emberCost;

        // Priority 1: Use Platinum Tickets (150 ember each)
        const ticketsNeeded = Math.min(this.ticket, Math.ceil(remaining / 150));
        this.ticket -= ticketsNeeded;
        result.used.ticket = ticketsNeeded;
        remaining -= ticketsNeeded * 150;

        // Priority 2: Use free Metajewel
        const emberUsed = Math.min(this.ember, remaining);
        this.ember -= emberUsed;
        result.used.ember = emberUsed;
        remaining -= emberUsed;

        // Priority 3: Use Paid Ember
        const paidUsed = Math.min(this.paidEmber, remaining);
        this.paidEmber -= paidUsed;
        result.used.paidEmber = paidUsed;
        remaining -= paidUsed;

        // Priority 4: Convert Cognigem to ember (10 cognigem = 100 ember)
        const cognigemNeeded = Math.min(this.cognigem, Math.ceil(remaining / 10));
        const cognigemEmber = Math.min(cognigemNeeded * 10, remaining);
        this.cognigem -= cognigemNeeded;
        result.used.cognigem = cognigemNeeded;
        remaining -= cognigemEmber;

        if (remaining > 0) {
            result.success = false;
            result.shortage = remaining;
            // Allow negative values to show shortage
            // Convert remaining shortage to negative ticket/ember if needed
            // Try to use remaining ember first, then convert to tickets
            if (this.ember > 0) {
                const emberShortage = Math.min(this.ember, remaining);
                this.ember -= emberShortage;
                remaining -= emberShortage;
            }
            // Convert remaining shortage to tickets (150 ember per ticket)
            if (remaining > 0) {
                const additionalTicketsNeeded = Math.ceil(remaining / 150);
                this.ticket -= additionalTicketsNeeded;
            }
        }

        return result;
    }

    /**
     * Spend assets for weapon pull
     * Priority: Weapon Ticket -> Metajewel -> Paid Ember -> Cognigem
     */
    spendForWeapon(emberCost) {
        const result = {
            success: true,
            shortage: 0,
            used: { weaponTicket: 0, ember: 0, paidEmber: 0, cognigem: 0 }
        };

        let remaining = emberCost;

        // Priority 1: Use Weapon Tickets (100 ember each)
        const weaponTicketsNeeded = Math.min(this.weaponTicket, Math.ceil(remaining / 100));
        this.weaponTicket -= weaponTicketsNeeded;
        result.used.weaponTicket = weaponTicketsNeeded;
        remaining -= weaponTicketsNeeded * 100;

        // Priority 2: Use free Metajewel
        const emberUsed = Math.min(this.ember, remaining);
        this.ember -= emberUsed;
        result.used.ember = emberUsed;
        remaining -= emberUsed;

        // Priority 3: Use Paid Ember
        const paidUsed = Math.min(this.paidEmber, remaining);
        this.paidEmber -= paidUsed;
        result.used.paidEmber = paidUsed;
        remaining -= paidUsed;

        // Priority 4: Convert Cognigem to ember (10 cognigem = 100 ember)
        const cognigemNeeded = Math.min(this.cognigem, Math.ceil(remaining / 10));
        const cognigemEmber = Math.min(cognigemNeeded * 10, remaining);
        this.cognigem -= cognigemNeeded;
        result.used.cognigem = cognigemNeeded;
        remaining -= cognigemEmber;

        if (remaining > 0) {
            result.success = false;
            result.shortage = remaining;
            // Allow negative values to show shortage
            // Convert remaining shortage to negative weaponTicket/ember if needed
            // Try to use remaining ember first, then convert to weapon tickets
            if (this.ember > 0) {
                const emberShortage = Math.min(this.ember, remaining);
                this.ember -= emberShortage;
                remaining -= emberShortage;
            }
            // Convert remaining shortage to weapon tickets (100 ember per ticket)
            if (remaining > 0) {
                const additionalWeaponTicketsNeeded = Math.ceil(remaining / 100);
                this.weaponTicket -= additionalWeaponTicketsNeeded;
            }
        }

        return result;
    }
}

/**
 * Helper function: Add days to a date string (YYYY-MM-DD format)
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {number} days - Number of days to add
 * @returns {string} New date string in YYYY-MM-DD format
 */
function addDaysToDateString(dateStr, days) {
    if (!dateStr) return dateStr;
    const parts = dateStr.split('-');
    const date = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
    date.setUTCDate(date.getUTCDate() + days);
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getI18nServiceInstance() {
    if (typeof window === 'undefined') return null;
    return window.__I18nService__ || window.I18nService || null;
}

function getNestedValue(obj, key) {
    if (!obj || !key) return undefined;
    return key.split('.').reduce((current, part) => {
        if (current && current[part] !== undefined) {
            return current[part];
        }
        return undefined;
    }, obj);
}

function getTranslationByLang(lang, key) {
    const service = getI18nServiceInstance();
    if (!service || !service.cache) return undefined;

    const pageTranslation = getNestedValue(service.cache[lang]?.pages?.['pull-calc'], key);
    if (pageTranslation !== undefined) return pageTranslation;

    return getNestedValue(service.cache[lang]?.common, key);
}

function resolveTranslation(translator, key) {
    const missingToken = '__PULL_CALC_I18N_MISSING__';
    const translated = translator(key, missingToken);
    return translated === missingToken ? undefined : translated;
}

function getI18nText(key, fallback) {
    if (typeof window.t === 'function') {
        const translated = resolveTranslation(window.t, key);
        if (translated !== undefined) return translated;
    }

    const service = getI18nServiceInstance();
    if (service && typeof service.t === 'function') {
        const translated = resolveTranslation((k, defaultValue) => service.t(k, defaultValue), key);
        if (translated !== undefined) return translated;
    }

    const krTranslation = getTranslationByLang('kr', key);
    if (krTranslation !== undefined) return krTranslation;

    return fallback || key;
}

function getCurrentPullCalcLanguage() {
    const service = getI18nServiceInstance();
    if (service && typeof service.getCurrentLanguage === 'function') {
        const lang = service.getCurrentLanguage();
        if (lang) return lang;
    }

    if (typeof window.getCurrentLang === 'function') {
        const lang = window.getCurrentLang();
        if (lang) return lang;
    }

    if (typeof window.getCurrentLanguage === 'function') {
        const lang = window.getCurrentLanguage();
        if (lang) return lang;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const langFromQuery = urlParams.get('lang');
    if (langFromQuery && ['kr', 'en', 'jp'].includes(langFromQuery)) {
        return langFromQuery;
    }

    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['kr', 'en', 'jp'].includes(savedLang)) {
        return savedLang;
    }

    return 'kr';
}

function upsertMetaByName(name, content) {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

function upsertMetaByProperty(property, content) {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

function updatePullCalcSEOTags(lang = null) {
    const currentLang = lang || getCurrentPullCalcLanguage();
    const baseUrl = 'https://lufel.net';
    const currentUrl = `${baseUrl}/pull-calc/?lang=${currentLang}`;

    const seoTitle = getI18nText('seoTitle', '가챠 플래너 - 페르소나5 더 팬텀 X 루페르넷');
    const seoDescription = getI18nText('seoDescription', '페르소나5 더 팬텀 X 가챠 계획 시뮬레이터. 향후 캐릭터 출시에 맞춰 필요한 재화를 계산하고 계약 계획을 수립할 수 있습니다.');
    const seoKeywords = getI18nText('seoKeywords', 'P5X, 페르소나5X, 가챠 플래너, 가챠 계산기, 가챠 시뮬레이터, P5X 계산기, 계약 계획');
    const seoOgLocale = getI18nText('seoOgLocale', 'ko_KR');

    document.title = seoTitle;

    upsertMetaByName('description', seoDescription);
    upsertMetaByName('keywords', seoKeywords);
    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', seoTitle);
    upsertMetaByName('twitter:description', seoDescription);
    upsertMetaByName('twitter:image', `${baseUrl}/assets/img/home/seo.png`);

    upsertMetaByProperty('og:title', seoTitle);
    upsertMetaByProperty('og:description', seoDescription);
    upsertMetaByProperty('og:url', currentUrl);
    upsertMetaByProperty('og:locale', seoOgLocale);
    upsertMetaByProperty('og:type', 'website');
    upsertMetaByProperty('og:image', `${baseUrl}/assets/img/home/seo.png`);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    document.documentElement.setAttribute('lang', currentLang === 'jp' ? 'ja' : currentLang === 'kr' ? 'ko' : 'en');
}

/**
 * Apply or remove SEA server delay to ReleaseScheduleData
 * @param {boolean} isSea - If true, apply +7 days shift; if false, restore original
 */
function applyServerDelayToData(isSea) {
    if (!window.ReleaseScheduleData) return;

    // Backup original data on first run
    if (!window.ReleaseScheduleData_Original) {
        window.ReleaseScheduleData_Original = JSON.parse(JSON.stringify(window.ReleaseScheduleData));
    }

    // Always restore from original first
    window.ReleaseScheduleData = JSON.parse(JSON.stringify(window.ReleaseScheduleData_Original));

    // If SEA mode, shift all dates by +8 days
    if (isSea) {
        const shiftDays = 8;

        // Shift manualReleases dates
        if (window.ReleaseScheduleData.manualReleases) {
            window.ReleaseScheduleData.manualReleases.forEach(release => {
                if (release.date) {
                    release.date = addDaysToDateString(release.date, shiftDays);
                }
            });
        }

        // Shift anniversaryEvents dates
        if (window.ReleaseScheduleData.anniversaryEvents) {
            window.ReleaseScheduleData.anniversaryEvents.forEach(event => {
                if (event.date) {
                    event.date = addDaysToDateString(event.date, shiftDays);
                }
            });
        }

        // Note: autoGenerateCharacters don't have dates - they're calculated from manualReleases
        // So we don't need to shift them directly
    }
}

class PullSimulator {

    constructor() {
        this.lang = this.getLang();

        // Assets
        this.assets = {
            ember: 0,
            ticket: 0,
            paidEmber: 0,
            weaponTicket: 0,
            cognigem: 0
        };

        // Income settings
        this.income = {
            dailyMission: 80,
            monthlySubEnabled: false,
            monthlySubAmount: 100,
            versionIncome: 6000,
            // battlePassEnabled: false,
            // battlePassAmount: 1430,
            recursive: false
        };

        // Schedule scenario (4.0 이후 간격 및 보상 배율)
        this.scheduleScenario = '3weeks'; // '3weeks' or '2weeks'

        // SEA Server Mode (schedule +7 days)
        this.isSeaServer = false;

        // Pity settings
        this.pity = {
            charPity: 0,
            weaponPity: 0,
            weapon5050Failed: false,
            weaponScenario: 'average'  // 'best', 'average', or 'worst'
        };

        // Pity statistics
        this.charPityStats = { mean: 110, median: 110, total: 0 };
        this.weaponPityStats = { mean: 70, median: 70, total: 0 };

        // Targets (selected characters)
        this.targets = [];

        // Schedule data cache
        this.scheduleReleases = [];

        // Extra income manager
        this.extraIncomeManager = null;
        this.extraIncomeRows = [];

        // Chart instance
        this.chart = null;

        // Initialize
        this.loadSavedData();
        this.initializePityDistributions();
        this.applyI18n();
        this.initializeMustReadAccordion();
        this.bindEvents();
        this.initializeExtraIncome();
        // Apply server delay before building schedule
        applyServerDelayToData(this.isSeaServer);
        this.buildSchedule();
    }

    // ==================== KST (UTC+9) Date Helpers ====================
    // All dates are stored as "Logical UTC" where UTC midnight represents KST midnight

    /**
     * Get "Today" in KST (UTC+9), normalized to midnight
     * Returns a Date object representing KST today at 00:00:00, stored as UTC
     */
    getKSTToday() {
        const now = new Date();
        // 1. Get UTC time in ms
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        // 2. Add 9 hours for KST
        const kstDate = new Date(utc + (9 * 60 * 60 * 1000));

        // 3. Return as UTC midnight (Logical KST)
        return new Date(Date.UTC(kstDate.getFullYear(), kstDate.getMonth(), kstDate.getDate()));
    }

    /**
     * Parse "YYYY-MM-DD" string from data.js directly to Logical KST
     * @param {string} ymd - Date string in YYYY-MM-DD format
     * @returns {Date} Date object with UTC midnight representing KST date
     */
    parseGameDate(ymd) {
        if (!ymd) return null;
        const parts = ymd.split('-'); // Assumes YYYY-MM-DD format
        // Create Date using UTC to avoid local timezone shifts
        return new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
    }

    /**
     * Format Date object back to YYYY-MM-DD string
     * @param {Date} dateObj - Date object (Logical UTC)
     * @returns {string} Date string in YYYY-MM-DD format
     */
    formatGameDate(dateObj) {
        if (!dateObj) return '';
        const y = dateObj.getUTCFullYear();
        const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    /**
     * Format Date object to "M/D" (Short format)
     * @param {Date} dateObj - Date object (Logical UTC)
     * @returns {string} Date string in M/D format
     */
    formatDateShort(dateObj) {
        if (!dateObj) return '';
        return `${dateObj.getUTCMonth() + 1}/${dateObj.getUTCDate()}`;
    }

    /**
     * Add days helper (Pure UTC math)
     * @param {Date} dateObj - Date object (Logical UTC)
     * @param {number} days - Number of days to add
     * @returns {Date} New Date object
     */
    addDays(dateObj, days) {
        return new Date(dateObj.getTime() + (days * 86400000));
    }

    initializeExtraIncome() {
        if (typeof ExtraIncomeManager === 'undefined') return;
        const rootEl = document.getElementById('extraIncomeRoot');
        if (!rootEl) return;

        this.extraIncomeManager = new ExtraIncomeManager({
            rootEl,
            baseUrl: (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '',
            storageKey: 'pullCalc_extraIncome',
            t: (key) => (typeof t === 'function' ? t(key) : key),
            onChange: () => {
                this.extraIncomeRows = this.extraIncomeManager ? this.extraIncomeManager.getRows() : [];
                this.buildSchedule();
                this.recalculate();
            }
        });
        this.extraIncomeRows = this.extraIncomeManager ? this.extraIncomeManager.getRows() : [];

        const addBtn = document.getElementById('extraIncomeAddBtn');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.extraIncomeManager) this.extraIncomeManager.addRow();
            });
        }
    }

    getLang() {
        if (typeof getCurrentLang === 'function') {
            return getCurrentLang();
        }
        return this.lang || 'kr';
    }

    t(key, defaultValue = '') {
        const fallback = defaultValue || key;
        const lang = this.getLang();
        this.lang = lang;
        return getI18nText(key, fallback);
    }

    applyI18n() {
        const pageTitleEl = document.getElementById('page-title');
        if (pageTitleEl) pageTitleEl.textContent = t('pageTitle');

        const navHome = document.getElementById('nav-home');
        if (navHome) navHome.textContent = t('navHome');

        const navCurrent = document.getElementById('nav-current');
        if (navCurrent) navCurrent.textContent = t('navCurrent');

        const assetsTitle = document.getElementById('assetsTitle');
        if (assetsTitle) assetsTitle.textContent = t('assetsTitle');

        const incomeTitle = document.getElementById('incomeTitle');
        if (incomeTitle) incomeTitle.textContent = t('incomeTitle');

        const pityTitle = document.getElementById('pityTitle');
        if (pityTitle) pityTitle.textContent = t('pityTitle');

        const scheduleNotice = document.getElementById('scheduleNotice');
        if (scheduleNotice) scheduleNotice.textContent = t('scheduleNotice');

        const chartTitle = document.getElementById('chartTitle');
        if (chartTitle) chartTitle.textContent = t('chartTitle');

        const chartEmptyText = document.getElementById('chartEmptyText');
        if (chartEmptyText) chartEmptyText.textContent = t('chartEmpty');

        const planTitle = document.getElementById('planTitle');
        if (planTitle) planTitle.textContent = t('planTitle');

        const planDescription = document.getElementById('planDescription');
        if (planDescription) planDescription.textContent = t('planDescription');

        const loadingText = document.getElementById('loadingText');
        if (loadingText) loadingText.textContent = t('loading');

        const extraIncomeTitle = document.getElementById('extraIncomeTitle');
        if (extraIncomeTitle) extraIncomeTitle.textContent = t('extraIncomeTitle');

        const extraIncomeAddBtn = document.getElementById('extraIncomeAddBtn');
        if (extraIncomeAddBtn) extraIncomeAddBtn.textContent = t('extraIncomeAdd');

        const hudTotalLabel = document.getElementById('hudTotalLabel');
        if (hudTotalLabel) hudTotalLabel.textContent = t('totalEmber');

        // Labels
        const labels = [
            ['labelEmber', 'ember'], ['labelTicket', 'ticket'], ['labelPaidEmber', 'paidEmber'],
            ['labelWeaponTicket', 'weaponTicket'], ['labelCognigem', 'cognigem'],
            ['labelDailyMission', 'dailyMission'], ['labelMonthlySub', 'monthlySub'],
            ['labelVersionIncome', 'versionIncome'], ['labelBattlePass', 'battlePass'],
            ['labelRecursive', 'recursive'], ['labelSeaServer', 'labelSeaServer'],
            ['labelCharPity', 'charPity'],
            ['labelWeaponPity', 'weaponPity'], ['labelWeapon5050Failed', 'weapon5050Failed'],
            ['labelWeaponScenario', 'weaponScenario'], ['labelScheduleScenario', 'scheduleScenario']
        ];
        labels.forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = t(key);
        });

        // Additional labels
        const labelCharPityEl = document.getElementById('labelCharPity');
        if (labelCharPityEl) labelCharPityEl.textContent = t('charPityProgress');

        const labelWeaponPityEl = document.getElementById('labelWeaponPity');
        if (labelWeaponPityEl) labelWeaponPityEl.textContent = t('weaponPityProgress');

        const labelMonthlySubEl = document.getElementById('labelMonthlySub');
        if (labelMonthlySubEl) labelMonthlySubEl.textContent = t('monthlySubPerDay');

        const labelBattlePassEl = document.getElementById('labelBattlePass');
        if (labelBattlePassEl) labelBattlePassEl.textContent = t('battlePassPerPatch');

        // Summary labels

        // Tooltips - only update elements with data-i18n-tooltip attribute
        document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
            const tooltipKey = el.getAttribute('data-i18n-tooltip');
            if (tooltipKey) {
                const tooltipValue = t(tooltipKey);
                // console.log('[Tooltip Debug]', tooltipKey, '→', tooltipValue);
                el.setAttribute('data-tooltip', tooltipValue);
                // Re-bind tooltip after updating data-tooltip attribute
                // Remove existing binding flag to allow re-binding
                if (el.dataset.tooltipBound === '1') {
                    delete el.dataset.tooltipBound;
                    delete el.dataset.tooltipMode;
                }
                // Use tooltip.js's bindTooltipElement function if available
                // Check both global scope and window object
                const bindFn = typeof bindTooltipElement !== 'undefined' ? bindTooltipElement :
                    (typeof window !== 'undefined' && typeof window.bindTooltipElement === 'function' ? window.bindTooltipElement : null);
                if (bindFn) {
                    bindFn(el);
                }
            }
        });

        // Weapon scenario options
        const optionBest = document.getElementById('optionBest');
        if (optionBest) optionBest.textContent = t('weaponScenarioBest');

        const optionAverage = document.getElementById('optionAverage');
        if (optionAverage) optionAverage.textContent = t('weaponScenarioAverage');

        const optionWorst = document.getElementById('optionWorst');
        if (optionWorst) optionWorst.textContent = t('weaponScenarioWorst');

        // Schedule scenario options
        const option3Weeks = document.getElementById('option3Weeks');
        if (option3Weeks) option3Weeks.textContent = t('scheduleScenario3Weeks');

        const option2Weeks = document.getElementById('option2Weeks');
        if (option2Weeks) option2Weeks.textContent = t('scheduleScenario2Weeks');

        const tzLabel = document.getElementById('labelTimezone');
        if (tzLabel) tzLabel.textContent = t('timezone');

        const pitySource = document.getElementById('pitySource');
        if (pitySource) pitySource.textContent = t('pitySource');

        // Update must read title and content
        const mustReadTitle = document.getElementById('mustReadTitle');
        if (mustReadTitle) mustReadTitle.textContent = t('mustReadTitle');

        const mustReadText = document.getElementById('mustReadText');
        if (mustReadText) {
            const content = this.t('mustReadContent', '');
            if (!content) {
                mustReadText.innerHTML = '';
                return;
            }
            // Simple markdown to HTML conversion
            let html = content;

            // Convert headers
            html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');

            // Convert bold
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // Convert horizontal rule
            html = html.replace(/^---$/gm, '<hr>');

            // Convert numbered sections (e.g., **1. 재화 환산 및 비용**)
            html = html.replace(/^\*\*(\d+)\. (.*?)\*\*$/gm, '<h4><strong>$1. $2</strong></h4>');

            // Convert list items (e.g., * **계약 티켓:** 1장은...)
            html = html.replace(/^\* \*\*(.*?):\*\* (.*)$/gm, '<li><strong>$1:</strong> $2</li>');

            // Split into paragraphs (double newlines)
            const paragraphs = html.split(/\n\n+/);
            html = paragraphs.map(para => {
                para = para.trim();
                if (!para) return '';
                // If already contains HTML tags, return as is
                if (para.includes('<h3>') || para.includes('<h4>') || para.includes('<hr>')) {
                    return para;
                }
                // If contains list items, wrap in ul
                if (para.includes('<li>')) {
                    return '<ul>' + para + '</ul>';
                }
                // Otherwise wrap in paragraph
                return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
            }).filter(p => p).join('');

            mustReadText.innerHTML = html;
        }
    }

    loadSavedData() {
        try {
            const savedAssets = localStorage.getItem('pullCalc_assets');
            if (savedAssets) this.assets = JSON.parse(savedAssets);

            const savedIncome = localStorage.getItem('pullCalc_income');
            if (savedIncome) {
                const loaded = JSON.parse(savedIncome);
                // Migrate old monthlySub boolean to new monthlySubEnabled/Amount
                if (typeof loaded.monthlySub === 'boolean') {
                    loaded.monthlySubEnabled = loaded.monthlySub;
                    loaded.monthlySubAmount = 100;
                    delete loaded.monthlySub;
                }
                // Migrate old battlePass boolean to new battlePassEnabled/Amount - DISABLED
                // if (typeof loaded.battlePass === 'boolean') {
                //     loaded.battlePassEnabled = loaded.battlePass;
                //     loaded.battlePassAmount = 1430;
                //     delete loaded.battlePass;
                // }
                this.income = { ...this.income, ...loaded };
            }

            const savedPity = localStorage.getItem('pullCalc_pity');
            if (savedPity) this.pity = JSON.parse(savedPity);

            const savedTargets = localStorage.getItem('pullCalc_targets');
            if (savedTargets) this.targets = JSON.parse(savedTargets);

            const savedScheduleScenario = localStorage.getItem('pullCalc_scheduleScenario');
            if (savedScheduleScenario && ['3weeks', '2weeks'].includes(savedScheduleScenario)) {
                this.scheduleScenario = savedScheduleScenario;
            }

            const savedIsSeaServer = localStorage.getItem('pullCalc_isSeaServer');
            if (savedIsSeaServer !== null) {
                this.isSeaServer = savedIsSeaServer === 'true';
            }

            // Reschedule on load when schedule changes
            window.addEventListener('load', this.handleScheduleScenarioChange.bind(this));
        } catch (e) {
            console.warn('Failed to load saved data:', e);
        }
    }

    saveData() {
        try {
            localStorage.setItem('pullCalc_assets', JSON.stringify(this.assets));
            localStorage.setItem('pullCalc_income', JSON.stringify(this.income));
            localStorage.setItem('pullCalc_pity', JSON.stringify(this.pity));
            localStorage.setItem('pullCalc_targets', JSON.stringify(this.targets));
            localStorage.setItem('pullCalc_scheduleScenario', this.scheduleScenario);
            localStorage.setItem('pullCalc_isSeaServer', this.isSeaServer.toString());
        } catch (e) {
            console.warn('Failed to save data:', e);
        }
    }

    computeHistogramStats(histObj) {
        if (!histObj) return { mean: 0, median: 0, total: 0 };
        const entries = Object.entries(histObj)
            .map(([k, v]) => [Number(k), Number(v)])
            .filter(([k, v]) => Number.isFinite(k) && v > 0)
            .sort((a, b) => a[0] - b[0]);

        let total = 0, sum = 0;
        entries.forEach(([pull, count]) => {
            total += count;
            sum += pull * count;
        });

        let median = 0;
        if (total > 0) {
            const half = total / 2;
            let acc = 0;
            for (const [pull, count] of entries) {
                acc += count;
                if (acc >= half) { median = pull; break; }
            }
        }
        return { mean: total > 0 ? sum / total : 0, median, total };
    }

    async initializePityDistributions() {
        try {
            const res = await fetch(PITY_EN_URL, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch pity data');
            const data = await res.json();

            if (data.Confirmed) this.charPityStats = this.computeHistogramStats(data.Confirmed);
            if (data.Weapon) this.weaponPityStats = this.computeHistogramStats(data.Weapon);

            this.updatePityDisplay();
        } catch (e) {
            console.warn('Failed to load pity distributions:', e);
        }
    }

    updatePityDisplay() {
        const charMedianValue = document.getElementById('charMedianValue');
        if (charMedianValue) charMedianValue.textContent = `${this.charPityStats.median}${this.t('pulls')}`;

        const weaponMedianValue = document.getElementById('weaponMedianValue');
        if (weaponMedianValue) weaponMedianValue.textContent = `${this.weaponPityStats.median}${this.t('pulls')}`;
    }

    initializeMustReadAccordion() {
        const mustReadAccordion = document.getElementById('mustReadAccordion');
        if (!mustReadAccordion) return;

        // Check if user has closed it before
        const hasClosedMustRead = localStorage.getItem('pullCalc_mustReadClosed');

        if (!hasClosedMustRead) {
            // First visit: open it
            mustReadAccordion.classList.add('expanded');
        }
        // If hasClosedMustRead exists, leave it closed (default state)
    }

    bindEvents() {
        // Accordion toggles
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.closest('.accordion-section');
                const isExpanded = section.classList.contains('expanded');
                section.classList.toggle('expanded');

                // If mustRead accordion is being closed, save to localStorage
                if (section.id === 'mustReadAccordion' && isExpanded) {
                    localStorage.setItem('pullCalc_mustReadClosed', 'true');
                }
            });
        });

        // Asset inputs - bind individually like inputCharPity
        const emberInput = document.getElementById('inputEmber');
        if (emberInput) {
            emberInput.value = this.assets.ember || 0;
            emberInput.addEventListener('input', () => this.handleAssetChange());
            emberInput.addEventListener('change', () => this.handleAssetChange());
        }

        const ticketInput = document.getElementById('inputTicket');
        if (ticketInput) {
            ticketInput.value = this.assets.ticket || 0;
            ticketInput.addEventListener('input', () => this.handleAssetChange());
            ticketInput.addEventListener('change', () => this.handleAssetChange());
        }

        const paidEmberInput = document.getElementById('inputPaidEmber');
        if (paidEmberInput) {
            paidEmberInput.value = this.assets.paidEmber || 0;
            paidEmberInput.addEventListener('input', () => this.handleAssetChange());
            paidEmberInput.addEventListener('change', () => this.handleAssetChange());
        }

        const weaponTicketInput = document.getElementById('inputWeaponTicket');
        if (weaponTicketInput) {
            weaponTicketInput.value = this.assets.weaponTicket || 0;
            weaponTicketInput.addEventListener('input', () => this.handleAssetChange());
            weaponTicketInput.addEventListener('change', () => this.handleAssetChange());
        }

        const cognigemInput = document.getElementById('inputCognigem');
        if (cognigemInput) {
            cognigemInput.value = this.assets.cognigem || 0;
            cognigemInput.addEventListener('input', () => this.handleAssetChange());
            cognigemInput.addEventListener('change', () => this.handleAssetChange());
        }

        // Income inputs
        const dailyInput = document.getElementById('inputDailyMission');
        if (dailyInput) {
            dailyInput.value = this.income.dailyMission || 80;
            dailyInput.addEventListener('input', () => this.handleIncomeChange());
            dailyInput.addEventListener('change', () => this.handleIncomeChange());
        }

        const versionInput = document.getElementById('inputVersionIncome');
        if (versionInput) {
            versionInput.value = this.income.versionIncome || 1000;
            versionInput.addEventListener('input', () => this.handleIncomeChange());
            versionInput.addEventListener('change', () => this.handleIncomeChange());
        }

        // Monthly subscription checkbox and amount
        const monthlySubEnabledEl = document.getElementById('inputMonthlySubEnabled');
        if (monthlySubEnabledEl) {
            monthlySubEnabledEl.checked = this.income.monthlySubEnabled || false;
            monthlySubEnabledEl.addEventListener('change', () => this.handleIncomeChange());
        }

        const monthlySubAmountEl = document.getElementById('inputMonthlySubAmount');
        if (monthlySubAmountEl) {
            monthlySubAmountEl.value = this.income.monthlySubAmount || 100;
            monthlySubAmountEl.addEventListener('input', () => this.handleIncomeChange());
            monthlySubAmountEl.addEventListener('change', () => this.handleIncomeChange());
        }

        // Battle pass checkbox and amount - DISABLED
        // const battlePassEnabledEl = document.getElementById('inputBattlePassEnabled');
        // if (battlePassEnabledEl) {
        //     battlePassEnabledEl.checked = this.income.battlePassEnabled || false;
        //     battlePassEnabledEl.addEventListener('change', () => this.handleIncomeChange());
        // }

        // const battlePassAmountEl = document.getElementById('inputBattlePassAmount');
        // if (battlePassAmountEl) {
        //     battlePassAmountEl.value = this.income.battlePassAmount || 1430;
        //     battlePassAmountEl.addEventListener('change', () => this.handleIncomeChange());
        // }

        const recursiveEl = document.getElementById('inputRecursive');
        if (recursiveEl) {
            recursiveEl.checked = this.income.recursive;
            recursiveEl.addEventListener('change', () => this.handleIncomeChange());
        }

        // Pity inputs
        const charPityInput = document.getElementById('inputCharPity');
        if (charPityInput) {
            charPityInput.value = this.pity.charPity || 0;
            charPityInput.addEventListener('change', () => this.handlePityChange());
        }

        const weaponPityInput = document.getElementById('inputWeaponPity');
        if (weaponPityInput) {
            weaponPityInput.value = this.pity.weaponPity || 0;
            weaponPityInput.addEventListener('change', () => this.handlePityChange());
        }

        const weapon5050El = document.getElementById('inputWeapon5050Failed');
        if (weapon5050El) {
            weapon5050El.checked = this.pity.weapon5050Failed;
            weapon5050El.addEventListener('change', () => this.handlePityChange());
        }

        const weaponScenarioEl = document.getElementById('inputWeaponScenario');
        if (weaponScenarioEl) {
            weaponScenarioEl.value = this.pity.weaponScenario || 'average';
            weaponScenarioEl.addEventListener('change', () => this.handlePityChange());
        }

        // Schedule scenario dropdown
        const scheduleScenarioEl = document.getElementById('inputScheduleScenario');
        if (scheduleScenarioEl) {
            scheduleScenarioEl.value = this.scheduleScenario || '3weeks';
            scheduleScenarioEl.addEventListener('change', () => this.handleScheduleScenarioChange());
        }

        // Tooltips
        if (typeof addTooltips === 'function') addTooltips();
    }

    handleAssetChange() {
        console.log('[AssetChange] handleAssetChange called');
        this.assets.ember = parseInt(document.getElementById('inputEmber')?.value) || 0;
        this.assets.ticket = parseInt(document.getElementById('inputTicket')?.value) || 0;
        this.assets.paidEmber = parseInt(document.getElementById('inputPaidEmber')?.value) || 0;
        this.assets.weaponTicket = parseInt(document.getElementById('inputWeaponTicket')?.value) || 0;
        this.assets.cognigem = parseInt(document.getElementById('inputCognigem')?.value) || 0;

        console.log('[AssetChange] Assets updated:', this.assets);
        this.saveData();
        // this.updateHUD();
        this.recalculate();
    }

    handleIncomeChange() {
        this.income.dailyMission = parseInt(document.getElementById('inputDailyMission')?.value) || 0;
        this.income.monthlySubEnabled = document.getElementById('inputMonthlySubEnabled')?.checked || false;
        this.income.monthlySubAmount = parseInt(document.getElementById('inputMonthlySubAmount')?.value) || 100;
        this.income.versionIncome = parseInt(document.getElementById('inputVersionIncome')?.value) || 0;
        // this.income.battlePassEnabled = document.getElementById('inputBattlePassEnabled')?.checked || false;
        // this.income.battlePassAmount = parseInt(document.getElementById('inputBattlePassAmount')?.value) || 1430;
        this.income.recursive = document.getElementById('inputRecursive')?.checked || false;

        this.saveData();
        // Rebuild timeline to update income display on character cards
        this.buildSchedule();
        this.recalculate();
    }

    handlePityChange() {
        this.pity.charPity = parseInt(document.getElementById('inputCharPity')?.value) || 0;
        this.pity.weaponPity = parseInt(document.getElementById('inputWeaponPity')?.value) || 0;
        this.pity.weapon5050Failed = document.getElementById('inputWeapon5050Failed')?.checked || false;
        this.pity.weaponScenario = document.getElementById('inputWeaponScenario')?.value || 'average';

        this.saveData();
        this.recalculate();
    }

    handleServerChange() {
        const seaServerEl = document.getElementById('inputSeaServer');
        if (!seaServerEl) return;

        const newValue = seaServerEl.checked;

        // Confirm with user before changing
        const confirmMessage = this.t(
            'confirmServerChangeReset',
            'Changing server settings will reset your current plan/targets. Continue?'
        );

        if (!confirm(confirmMessage)) {
            // User cancelled - revert checkbox state
            seaServerEl.checked = !newValue;
            return;
        }

        // User confirmed - apply changes
        this.isSeaServer = newValue;

        // Apply server delay to data
        applyServerDelayToData(this.isSeaServer);

        // Reset targets
        this.targets = [];

        // Save data
        this.saveData();

        // Rebuild schedule and recalculate
        this.buildSchedule();
        this.recalculate();
        this.renderPlanList();
    }


    handleScheduleScenarioChange() {
        const newValue = document.getElementById('inputScheduleScenario')?.value || '3weeks';
        this.scheduleScenario = newValue;
        this.saveData();
        this.buildSchedule();

        // Update target dates to match new schedule
        // After buildSchedule(), scheduleReleases has new dates
        if (this.targets.length > 0 && this.scheduleReleases.length > 0) {
            this.targets.forEach(target => {
                // Find matching release by version and character name
                const matchingRelease = this.scheduleReleases.find(release => {
                    return release.characters &&
                        release.characters.includes(target.name);
                });

                if (matchingRelease && matchingRelease.date) {
                    // Update target date to match new schedule
                    target.date = matchingRelease.date;
                    console.log(`[ScheduleScenario] Updated target ${target.name} (${target.version}) date to ${matchingRelease.date}`);
                }
            });

            // Re-sort targets by date
            this.targets.sort((a, b) => new Date(a.date) - new Date(b.date));
            this.saveData();

            // Update timeline selection after dates are updated
            this.updateTimelineSelection();
        }

        this.recalculate();
    }

    calculateTotalEmber() {
        let total = this.assets.ember;
        //total += this.assets.ticket * 150;
        total += this.assets.paidEmber;
        //total += this.assets.weaponTicket * 100;  
        total += this.assets.cognigem * 10;
        return total;
    }

    calculateTotalEmberForGraph() {
        let total = this.assets.ember;
        total += this.assets.ticket * 150;
        total += this.assets.paidEmber;
        total += this.assets.weaponTicket * 100;
        total += this.assets.cognigem * 10;
        return total;
    }



    formatNumber(num) {
        return num.toLocaleString();
    }

    // Build schedule from ReleaseScheduleData - exclude 4-star characters
    buildSchedule() {
        const container = document.getElementById('timelineContainer');
        if (!container) return;

        const scheduleData = window.ReleaseScheduleData;
        if (!scheduleData) {
            container.innerHTML = `<div class="timeline-loading"><span>${t('loading')}</span></div>`;
            setTimeout(() => this.buildSchedule(), 500);
            return;
        }

        if (!window.characterData) {
            setTimeout(() => this.buildSchedule(), 500);
            return;
        }

        const releases = this.parseScheduleData(scheduleData);
        this.scheduleReleases = releases;

        const today = this.getKSTToday();
        const thirtyDaysAgo = this.addDays(today, -30);

        // Separate past and future releases
        const pastReleases = releases.filter(r => {
            const releaseDate = this.parseGameDate(r.date);
            return releaseDate < today && releaseDate >= thirtyDaysAgo;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending (most recent first)

        const futureReleases = releases.filter(r => {
            const releaseDate = this.parseGameDate(r.date);
            return releaseDate >= today;
        });

        // Show only the most recent past release (1 release) + all future releases
        const relevantReleases = [
            ...(pastReleases.length > 0 ? [pastReleases[0]] : []),
            ...futureReleases
        ].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort ascending by date

        // Header (notice + scenario selector) is inside timelineContainer because
        // buildSchedule() replaces innerHTML entirely.
        const scheduleScenarioLabel = t('scheduleScenario');
        const scheduleNoticeText = t('scheduleNotice');
        const scenarioTooltip = t('tooltipScheduleScenario');
        const seaServerLabel = t('labelSeaServer');
        const seaServerTooltip = t('tooltipSeaServer');

        const headerHtml = `
            <div class="schedule-notice schedule-notice--in-timeline">
                <p class="notice-text" id="scheduleNotice">${scheduleNoticeText}</p>
                <div class="schedule-controls-wrapper">
                    <div class="input-group schedule-scenario-inline">
                        <div class="schedule-scenario-group">
                            <label class="input-label">
                                <span id="labelScheduleScenario">${scheduleScenarioLabel}</span>
                                <span class="tooltip-icon" data-i18n-tooltip="tooltipScheduleScenario" data-tooltip="${scenarioTooltip}">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>
                                        <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>
                                    </svg>
                                </span>
                            </label>
                            <select id="inputScheduleScenario" class="modal-input modal-input--auto">
                                <option value="3weeks" id="option3Weeks">${t('scheduleScenario3Weeks')}</option>
                                <option value="2weeks" id="option2Weeks">${t('scheduleScenario2Weeks')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="sea-server-checkbox-wrapper">
                        <label class="checkbox-label">
                            <input type="checkbox" id="inputSeaServer">
                            <span id="labelSeaServer">${seaServerLabel}</span>
                            <span class="tooltip-icon" data-i18n-tooltip="tooltipSeaServer" data-tooltip="${seaServerTooltip}">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>
                                    <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>
                                </svg>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        `;

        let html = headerHtml + '<div class="timeline-grid">';
        // Daily income should accumulate only between future cards.
        // The first future card should use (today -> releaseDate),
        // and subsequent future cards should use (prevFutureDate -> releaseDate).
        let prevFutureDate = null;
        relevantReleases.forEach(release => {
            // Filter out 4-star characters
            const fiveStarChars = release.characters.filter(charName => {
                const charData = window.characterData?.[charName];
                return charData && charData.rarity !== 4;
            });

            if (fiveStarChars.length > 0) {
                const releaseDateObj = this.parseGameDate(release.date);
                const baselinePrev = releaseDateObj > today ? prevFutureDate : null;

                html += this.renderVersionColumn({ ...release, characters: fiveStarChars }, baselinePrev);

                // Update only when this is a future release (so past releases don't affect daily calc)
                if (releaseDateObj > today) {
                    prevFutureDate = release.date;
                }
            }
        });
        html += '</div>';
        container.innerHTML = html;

        // Re-bind schedule scenario dropdown (it was re-created by innerHTML replacement)
        const scheduleScenarioEl = container.querySelector('#inputScheduleScenario');
        if (scheduleScenarioEl) {
            scheduleScenarioEl.value = this.scheduleScenario || '3weeks';
            scheduleScenarioEl.addEventListener('change', () => this.handleScheduleScenarioChange());
        }

        // Re-bind SEA Server checkbox (it was re-created by innerHTML replacement)
        const seaServerEl = container.querySelector('#inputSeaServer');
        if (seaServerEl) {
            seaServerEl.checked = this.isSeaServer;
            seaServerEl.addEventListener('change', () => this.handleServerChange());
        }

        // Timezone selector removed - now using fixed KST timezone

        // Bind tooltip for schedule scenario icon
        if (typeof bindTooltipElement !== 'undefined') {
            container.querySelectorAll('.schedule-notice .tooltip-icon').forEach(el => {
                bindTooltipElement(el);
            });
        }

        container.querySelectorAll('.char-card').forEach(card => {
            // Don't allow clicking on released (past) characters
            if (card.classList.contains('released')) {
                card.style.cursor = 'not-allowed';
                card.style.opacity = '0.5';
            } else {
                card.addEventListener('click', () => {
                    const charName = card.dataset.character;
                    const version = card.dataset.version;
                    const date = card.dataset.date;
                    this.toggleTarget(charName, version, date);
                });
            }
        });

        // Bind tooltips for income tooltip icons
        if (typeof bindTooltipElement !== 'undefined') {
            container.querySelectorAll('.char-income .tooltip-icon').forEach(el => {
                bindTooltipElement(el);
            });
        }

        // Filter out past cards from saved targets
        const initialTargetCount = this.targets.length;
        this.targets = this.targets.filter(target => {
            if (!target.date) return true; // Keep targets without date (shouldn't happen, but safe)
            const targetDate = this.parseGameDate(target.date);
            // Keep only future cards (targetDate > today) - exclude today as well
            return targetDate > today;
        });

        // Save if any targets were removed
        if (this.targets.length < initialTargetCount) {
            this.saveData();
        }

        this.updateTimelineSelection();

        // If there are saved targets, render the plan and chart
        if (this.targets.length > 0) {
            this.recalculate();
        }
    }

    parseScheduleData(scheduleData) {
        const releases = [];
        const isTwoWeeksScenario = this.scheduleScenario === '2weeks';

        (scheduleData.manualReleases || []).forEach(release => {
            releases.push({
                version: release.version,
                date: release.date,
                characters: release.characters || [],
                note: release.note,
                days: release.days ?? scheduleData.intervalRules.beforeV4,
            });
        });

        let lastDate = null;
        if (releases.length > 0) {
            // 날짜 문자열(YYYY-MM-DD)을 쪼개서 UTC 자정 기준으로 명확하게 생성
            const lastRelease = releases[releases.length - 1];
            const parts = lastRelease.date.split('-');
            // 월(Month)은 0부터 시작하므로 -1 처리
            lastDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
            lastDate.setUTCDate(lastDate.getUTCDate() + lastRelease.days);
        }

        (scheduleData.autoGenerateCharacters || []).forEach(release => {
            releases.push({
                version: release.version,
                date: lastDate ? lastDate.toISOString().split('T')[0] : null,
                characters: release.characters || [],
                note: release.note
            });

            // Update lastDate after adding the release
            const version = parseFloat(release.version);
            const interval = version >= 4.0 && isTwoWeeksScenario ? scheduleData.intervalRules.beforeV4 : release.days;
            if (lastDate) {
                lastDate.setUTCDate(lastDate.getUTCDate() + interval);
            }
        });

        return releases.filter(r => r.date && r.characters.length > 0);
    }

    /**
     * Calculate income for a character card
     * Returns: { dailyIncome, versionIncome, battlePassIncome, totalIncome }
     */
    // calculateCharacterIncome is defined in pull-calc-plan.js

    renderVersionColumn(release, prevDate = null) {
        const releaseDate = this.parseGameDate(release.date);
        const today = this.getKSTToday();
        const diffDays = Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));

        let daysText = '';
        let daysClass = '';
        if (diffDays > 0) {
            daysText = `D-${diffDays}`;
        } else if (diffDays === 0) {
            daysText = t('today');
            daysClass = 'released';
        } else {
            daysText = `${Math.abs(diffDays)}${t('daysAgo')}`;
            daysClass = 'released';
        }

        const dateStr = this.formatDateShort(releaseDate);

        let cardsHtml = '';
        release.characters.forEach(charName => {
            cardsHtml += this.renderCharCard(charName, release.version, release.date, diffDays, prevDate);
        });

        return `
            <div class="version-column">
                <div class="version-header">
                    <div class="version-subheader">
                        <div class="version-badge">v${release.version}</div>
                        <div class="version-date">${dateStr}</div>
                    </div>
                    <div class="version-days ${daysClass}">${daysText}</div>
                </div>
                <div class="character-cards">${cardsHtml}</div>
            </div>
        `;
    }

    renderCharCard(charName, version, date, diffDays, prevDate = null) {
        const charData = window.characterData?.[charName] || {};
        const displayName = this.getCharacterName(charName);
        const position = charData.position || '';
        const element = charData.element || '';
        const isReleased = diffDays <= 0;
        const isSelected = this.targets.some(t => t.name === charName && t.date === date);

        let metaHtml = '';
        if (position) {
            metaHtml += `<img src="${BASE_URL}/assets/img/character-cards/직업_${position}.png" alt="${position}" onerror="this.style.display='none'">`;
        }
        if (element) {
            metaHtml += `<img src="${BASE_URL}/assets/img/character-cards/속성_${element}.png" alt="${element}" onerror="this.style.display='none'">`;
        }

        let daysText = '';
        if (diffDays > 0) daysText = `D-${diffDays}`;
        else if (diffDays === 0) daysText = t('today');
        else daysText = `${Math.abs(diffDays)}${t('daysAgo')}`;

        // Calculate expected income for this banner interval
        let incomeHtml = '';
        // Show income for:
        // - future cards (diffDays >= 0)
        // - current ongoing version card (most recent past release within interval)
        const isOngoing = (() => {
            if (diffDays >= 0) return true;
            // If this is the most recent past release, it is the current ongoing version
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const sorted = (Array.isArray(this.scheduleReleases) ? this.scheduleReleases : [])
                    .filter(r => r && r.date)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                let cur = null;
                for (const r of sorted) {
                    const d = new Date(r.date);
                    d.setHours(0, 0, 0, 0);
                    if (d <= today) cur = r;
                    else break;
                }
                return !!cur && cur.date === date && String(cur.version) === String(version);
            } catch (e) {
                return false;
            }
        })();

        if (isOngoing) {
            const income = this.calculateCharacterIncome(date, version, prevDate, charName);

            const ticket = income && income.extraIncome ? (income.extraIncome.ticket || 0) : 0;
            const weaponTicket = income && income.extraIncome ? (income.extraIncome.weaponTicket || 0) : 0;
            const ember = income && income.extraIncome ? (income.extraIncome.ember || 0) : 0;
            const baseEmber = income && income.baseIncome ? income.baseIncome : 0;

            const byFreq = income && income.extraByFreq ? income.extraByFreq : null;
            const fmt = (n) => this.formatNumber(n || 0);

            const tooltipHeader = (income && income.interval)
                ? `${income.interval.startDate} → ${income.interval.endDate}`
                : '';

            const emberTooltipLines = [];
            if (tooltipHeader) emberTooltipLines.push(tooltipHeader);
            // Daily (ember): include both base daily income and extra-income daily ember
            emberTooltipLines.push(`${t('incomeDaily')}: ${fmt((income && income.dailyIncome ? income.dailyIncome : 0) + (byFreq ? byFreq.daily.ember : 0))}`);
            emberTooltipLines.push(`${t('incomeWeekly')}: ${fmt(byFreq ? byFreq.weekly.ember : 0)}`);
            emberTooltipLines.push(`${t('incomeMonthly')}: ${fmt(byFreq ? byFreq.monthly.ember : 0)}`);
            emberTooltipLines.push(`${t('incomeVersion')}: ${fmt((income && income.versionIncome ? income.versionIncome : 0) + (byFreq ? byFreq.version.ember : 0))}`);
            emberTooltipLines.push(`${t('incomeOnce')}: ${fmt(byFreq ? byFreq.once.ember : 0)}`);

            const ticketTooltipLines = [];
            if (tooltipHeader) ticketTooltipLines.push(tooltipHeader);
            ticketTooltipLines.push(`${t('incomeDaily')}: ${fmt(byFreq ? byFreq.daily.ticket : 0)}`);
            ticketTooltipLines.push(`${t('incomeWeekly')}: ${fmt(byFreq ? byFreq.weekly.ticket : 0)}`);
            ticketTooltipLines.push(`${t('incomeMonthly')}: ${fmt(byFreq ? byFreq.monthly.ticket : 0)}`);
            ticketTooltipLines.push(`${t('incomeVersion')}: ${fmt(byFreq ? byFreq.version.ticket : 0)}`);
            ticketTooltipLines.push(`${t('incomeOnce')}: ${fmt(byFreq ? byFreq.once.ticket : 0)}`);

            const weaponTicketTooltipLines = [];
            if (tooltipHeader) weaponTicketTooltipLines.push(tooltipHeader);
            weaponTicketTooltipLines.push(`${t('incomeDaily')}: ${fmt(byFreq ? byFreq.daily.weaponTicket : 0)}`);
            weaponTicketTooltipLines.push(`${t('incomeWeekly')}: ${fmt(byFreq ? byFreq.weekly.weaponTicket : 0)}`);
            weaponTicketTooltipLines.push(`${t('incomeMonthly')}: ${fmt(byFreq ? byFreq.monthly.weaponTicket : 0)}`);
            weaponTicketTooltipLines.push(`${t('incomeVersion')}: ${fmt(byFreq ? byFreq.version.weaponTicket : 0)}`);
            weaponTicketTooltipLines.push(`${t('incomeOnce')}: ${fmt(byFreq ? byFreq.once.weaponTicket : 0)}`);

            incomeHtml = `
                <div class="char-income">
                    <div class="char-income-row">
                        <img src="${BASE_URL}/assets/img/pay/이계 엠버.png" class="char-income-icon" alt="">
                        <span>+${this.formatNumber(baseEmber + ember)}</span>
                        <span class="tooltip-icon" data-tooltip="${emberTooltipLines.join('<br>')}">
                            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>
                                <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>
                            </svg>
                        </span>
                    </div>
                    <div class="char-income-row">
                        <img src="${BASE_URL}/assets/img/pay/정해진 운명.png" class="char-income-icon" alt="">
                        <span>+${this.formatNumber(ticket)}</span>
                        <span class="tooltip-icon" data-tooltip="${ticketTooltipLines.join('<br>')}">
                            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>
                                <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>
                            </svg>
                        </span>
                    </div>
                    <div class="char-income-row">
                        <img src="${BASE_URL}/assets/img/pay/정해진 코인.png" class="char-income-icon" alt="">
                        <span>+${this.formatNumber(weaponTicket)}</span>
                        <span class="tooltip-icon" data-tooltip="${weaponTicketTooltipLines.join('<br>')}">
                            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>
                                <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>
                            </svg>
                        </span>
                    </div>
                </div>
            `;
        }

        return `
            <div class="char-card ${isSelected ? 'selected' : ''} ${isReleased ? 'released' : ''}"
                 data-character="${charName}" data-version="${version}" data-date="${date}">
                <img class="char-avatar" src="${BASE_URL}/assets/img/tier/${charName}.webp" alt="${displayName}"
                     onerror="this.src='${BASE_URL}/assets/img/character-cards/card_skeleton.webp'">
                <div class="char-info">
                    <div class="char-name">${displayName}</div>
                    <div class="char-meta">${metaHtml}</div>
                    <div class="char-days ${isReleased ? 'released' : ''}">${daysText}</div>
                </div>
                ${incomeHtml}
            </div>
        `;
    }

    getCharacterName(charName) {
        const charData = window.characterData?.[charName];
        if (!charData) return charName;
        const lang = this.getLang();
        if (lang === 'en' && charData.name_en) return charData.name_en;
        if (lang === 'jp' && charData.name_jp) return charData.name_jp;
        return charData.name || charName;
    }


    toggleTarget(charName, version, date) {
        const index = this.targets.findIndex(t => t.name === charName && t.date === date);

        if (index >= 0) {
            this.targets.splice(index, 1);
        } else {
            this.targets.push({
                name: charName,
                date: date,
                version: version,
                characterTarget: 'A0',
                weaponTarget: 'None',  // Default to not pulling weapon
                extraEmber: 0,
                extraTicket: 0,
                extraWeaponTicket: 0,
                cost: 0
            });
            this.targets.sort((a, b) => this.parseGameDate(a.date) - this.parseGameDate(b.date));
        }

        this.saveData();
        this.updateTimelineSelection();
        this.recalculate();
    }

    updateTimelineSelection() {
        document.querySelectorAll('.char-card').forEach(card => {
            const charName = card.dataset.character;
            const date = card.dataset.date;
            const isSelected = this.targets.some(t => t.name === charName && t.date === date);
            card.classList.toggle('selected', isSelected);
        });
    }

    recalculate() {
        // Ensure scheduleScenario is up to date from dropdown
        const dropdown = document.getElementById('inputScheduleScenario');
        if (dropdown && dropdown.value) {
            this.scheduleScenario = dropdown.value;
        }

        this.extraIncomeRows = this.extraIncomeManager ? this.extraIncomeManager.getRows() : [];

        this.calculateTargetCosts();
        this.calculateRunningBalance();
        this.renderPlanList();
        this.renderChart();
    }

    calculateTargetCosts() {
        // Find first character (A0+) and first weapon (not None) to apply pity
        let firstCharFound = false;
        let firstWeaponFound = false;

        this.targets.forEach(target => {
            // Check if this is the first character (A0+)
            const isFirstChar = !firstCharFound && target.characterTarget !== undefined &&
                parseInt(target.characterTarget.replace('A', '')) >= 0;
            if (isFirstChar) {
                firstCharFound = true;
            }

            // Check if this is the first weapon (not None)
            const isFirstWeapon = !firstWeaponFound && target.weaponTarget !== undefined &&
                target.weaponTarget !== 'None';
            if (isFirstWeapon) {
                firstWeaponFound = true;
            }

            const charCost = this.calculateCharacterCost(target.characterTarget, isFirstChar);
            const weaponCost = this.calculateWeaponCost(target.weaponTarget, isFirstWeapon);
            target.cost = charCost + weaponCost;
        });
    }

    /**
     * Simulate spending from a wallet for a specific target
     * Returns detailed breakdown of what was spent and any shortages
     */
    simulateWalletSpend(wallet, target, isFirstChar = false, isFirstWeapon = false) {
        const testWallet = wallet.clone();
        const result = {
            success: true,
            totalCost: target.cost,
            character: { cost: 0, result: null },
            weapon: { cost: 0, result: null },
            totalShortage: 0
        };

        // Calculate individual costs
        const charCost = this.calculateCharacterCost(target.characterTarget, isFirstChar);
        const weaponCost = this.calculateWeaponCost(target.weaponTarget, isFirstWeapon);

        result.character.cost = charCost;
        result.weapon.cost = weaponCost;

        // Spend for character first
        if (charCost > 0) {
            result.character.result = testWallet.spendForCharacter(charCost);
            if (!result.character.result.success) {
                result.success = false;
                result.totalShortage += result.character.result.shortage;
            }
        }

        // Then spend for weapon with remaining assets
        if (weaponCost > 0) {
            result.weapon.result = testWallet.spendForWeapon(weaponCost);
            if (!result.weapon.result.success) {
                result.success = false;
                result.totalShortage += result.weapon.result.shortage;
            }
        }

        result.remainingWallet = testWallet;
        return result;
    }

    /**
     * Calculate recursive payback multiplier
     * When enabled, cognigem from pulls is converted back to ember for more pulls
     * Uses infinite geometric series: effective cost = base cost / (1 - payback rate)
     */
    getRecursiveMultiplier(pullType) {
        if (!this.income.recursive) return 1;

        // Payback rates based on gacha statistics
        // Character: 5-star gives 30 cognigem, 4-star gives 15 cognigem
        // Weapon: 5-star gives 20 cognigem, 4-star gives 4 cognigem
        // 10 cognigem = 100 ember

        let paybackPerPull = 0;
        if (pullType === 'character') {
            // Character rates (approximate): 5-star ~0.6%, 4-star ~5.1% // ONLY COUNT 4 star - Consolidated Rate 13.1%
            // Conservative estimate: (0.131 × 15) = 1.965 cognigem per pull
            // At 150 ember per pull: 1.965 × 10 / 150 = 0.131 payback rate
            paybackPerPull = 0.131;
        } else if (pullType === 'weapon') {
            // Weapon rates (approximate): 5-star ~0.8%, 4-star ~6% // Consolidated Rate 5-star 2.3% / 4-star 14.5%
            // Conservative estimate: (0.023 × 20 + 0.145 × 4) = 0.86 cognigem per pull
            // At 100 ember per pull: 0.86 × 10 / 100 = 0.086 payback rate
            paybackPerPull = 0.086;
        }

        // Infinite geometric series: 1 / (1 - r) where r is payback rate
        // This gives us the effective multiplier for total pulls
        // Inverse this for cost reduction: cost_effective = cost_base × (1 - r)
        return (1 - paybackPerPull);
    }

    calculateCharacterCost(targetLevel, usePity = false) {
        const level = parseInt(targetLevel.replace('A', '')) || 0;
        const copies = level + 1;
        const pullsPerCopy = this.charPityStats.median || 110;

        let totalPulls = 0;
        for (let i = 0; i < copies; i++) {
            // Only apply pity to first character (A0+)
            if (i === 0 && usePity && this.pity.charPity > 0) {
                totalPulls += Math.max(0, pullsPerCopy - this.pity.charPity);
            } else {
                totalPulls += pullsPerCopy;
            }
        }

        let baseCost = totalPulls * 150;
        // Apply recursive payback if enabled
        return Math.ceil(baseCost * this.getRecursiveMultiplier('character'));
    }

    calculateWeaponCost(targetLevel, usePity = false) {
        // Handle 'None' - user doesn't want to pull for weapon
        if (targetLevel === 'None') {
            return 0;
        }

        const medianPity = this.weaponPityStats.median || 70;
        const scenario = this.pity.weaponScenario || 'average';

        // Scenario multipliers for 50:50
        // best: Always win 50:50 (1× pity per limited weapon)
        // average: Half win, half lose (1.5× pity per limited weapon)
        // worst: Always lose 50:50 (2× pity per limited weapon)
        const scenarioMultipliers = {
            'best': 1.0,
            'average': 1.5,
            'worst': 2.0
        };
        const multiplier = scenarioMultipliers[scenario] || 1.5;

        if (targetLevel === 'R0' || !targetLevel) {
            // Calculate cost for single limited weapon with 50:50 consideration
            let expectedPulls = 0;

            // Only apply pity and 50:50 failed state to first weapon (not None)
            if (usePity && this.pity.weapon5050Failed) {
                // Failed state: Next 5-star is GUARANTEED pickup (100%)
                expectedPulls = Math.max(0, medianPity - this.pity.weaponPity);
            } else if (usePity) {
                // Normal state: apply scenario multiplier
                const remainingToPity = Math.max(0, medianPity - this.pity.weaponPity);
                if (scenario === 'best') {
                    // Best case: assume we win the 50:50
                    expectedPulls = remainingToPity;
                } else if (scenario === 'worst') {
                    // Worst case: assume we lose the 50:50, need 2 pities
                    expectedPulls = remainingToPity + medianPity;
                } else {
                    // Average case: 50% chance need second pity
                    expectedPulls = remainingToPity + (medianPity * 0.5);
                }
            } else {
                // No pity: calculate normally without considering current pity
                if (scenario === 'best') {
                    expectedPulls = medianPity;
                } else if (scenario === 'worst') {
                    expectedPulls = medianPity * 2;
                } else {
                    expectedPulls = medianPity * 1.5;
                }
            }

            let baseCost = Math.ceil(expectedPulls) * 100;
            // Apply recursive payback if enabled
            return Math.ceil(baseCost * this.getRecursiveMultiplier('weapon'));
        }

        const refinementReqs = {
            'R0': { limited: 1, additional: 0 },
            'R1': { limited: 2, additional: 0 },
            'R2': { limited: 2, additional: 1 },
            'R3': { limited: 3, additional: 1 },
            'R4': { limited: 3, additional: 2 },
            'R5': { limited: 4, additional: 2 },
            'R6': { limited: 4, additional: 3 }
        };

        const req = refinementReqs[targetLevel] || { limited: 0, additional: 0 };

        // Calculate expected pity cycles needed based on scenario
        // Best case (multiplier 1.0): Win all 50:50s, get exactly N limited weapons in N pities
        // Average case (multiplier 1.5): Lose half, get N limited in 1.5N pities (also get 0.5N general)
        // Worst case (multiplier 2.0): Lose all 50:50s, get N limited in 2N pities (also get N general)

        const totalWeaponsNeeded = req.limited + req.additional;
        const expectedWeaponsFromLimited = req.limited * multiplier;

        let expectedPityCycles;
        if (expectedWeaponsFromLimited >= totalWeaponsNeeded) {
            // Getting the limited weapons gives us enough total weapons
            expectedPityCycles = req.limited * multiplier;
        } else {
            // Need more pulls beyond getting limited weapons
            // Extra weapons needed after getting all limited
            const extraNeeded = totalWeaponsNeeded - expectedWeaponsFromLimited;
            expectedPityCycles = (req.limited * multiplier) + extraNeeded;
        }

        // Adjust for existing pity (only for first weapon)
        let totalPulls = expectedPityCycles * medianPity;
        if (usePity && this.pity.weaponPity > 0 && expectedPityCycles > 0) {
            totalPulls -= Math.min(this.pity.weaponPity, medianPity);
        }

        // Adjust for guaranteed state (next pull is guaranteed limited) - only for first weapon
        if (usePity && this.pity.weapon5050Failed && req.limited > 0) {
            // One less expected failure, saves 0.5 or 1.0 pity cycle depending on scenario
            if (scenario === 'worst') {
                // In worst case, having a guaranteed means we skip a full failure (save 1.0 pity)
                totalPulls -= medianPity;
            } else if (scenario === 'average') {
                // In average case, save 0.5 pity
                totalPulls -= medianPity * 0.5;
            }
            // In best case, guaranteed doesn't save anything (we would've won anyway)
        }

        let baseCost = Math.ceil(totalPulls) * 100;
        // Apply recursive payback if enabled
        return Math.ceil(baseCost * this.getRecursiveMultiplier('weapon'));
    }

    // calculateRunningBalance, renderChart, createChartWithImages are defined in pull-calc-graph.js
    // calculateCharacterIncome, renderPlanList are defined in pull-calc-plan.js

    removeTarget(index) {
        if (index >= 0 && index < this.targets.length) {
            this.targets.splice(index, 1);
            this.saveData();
            this.updateTimelineSelection();
            this.recalculate();
        }
    }

    // calculateRunningBalance, renderChart, createChartWithImages are defined in pull-calc-graph.js

}

let pullCalcSeoLanguageHookBound = false;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof Navigation !== 'undefined' && typeof Navigation.load === 'function') {
        Navigation.load('pull-calc');
    }

    // Initialize i18n first
    if (typeof initPageI18n === 'function') {
        await initPageI18n('pull-calc');
    } else if (window.I18nService && typeof window.I18nService.init === 'function') {
        await window.I18nService.init('pull-calc');
    }

    updatePullCalcSEOTags();

    const i18nService = getI18nServiceInstance();
    if (i18nService && typeof i18nService.onLanguageChange === 'function' && !pullCalcSeoLanguageHookBound) {
        i18nService.onLanguageChange(() => {
            updatePullCalcSEOTags();
        });
        pullCalcSeoLanguageHookBound = true;
    }

    const checkAndInit = () => {
        if (window.characterData && window.ReleaseScheduleData) {
            window.pullSimulator = new PullSimulator();
        } else {
            setTimeout(checkAndInit, 100);
        }
    };
    checkAndInit();
});
