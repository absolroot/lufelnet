/**
 * P5X Pull Calculator - Plan Module
 * Pull Plan 렌더링 및 관리 로직
 */

(function() {
    'use strict';

    // PullSimulator 클래스가 이미 정의되어 있어야 함
    if (typeof PullSimulator === 'undefined') {
        console.error('PullSimulator class not found. Make sure pull-calc.js is loaded before pull-calc-plan.js');
        return;
    }

    console.log('PullSimulator plan module loaded');

    /**
     * Calculate income for a character card (daily + version + battle pass)
     * This is used by both timeline cards and pull plan
     */
    PullSimulator.prototype.calculateCharacterIncome = function(charDate, charVersion, prevDate = null, charName = null) {
        const today = (typeof this.normalizeDate === 'function') ? this.normalizeDate(new Date()) : (() => {
            const t = new Date(); t.setHours(0,0,0,0); return t;
        })();
        const formatYMD = (d) => (typeof this.formatYMD === 'function')
            ? this.formatYMD(d)
            : d.toISOString().split('T')[0];

        const startDate = (typeof this.parseYMD === 'function')
            ? this.normalizeDate(this.parseYMD(charDate))
            : (() => { 
                const parts = charDate.split('-');
                return new Date(parts[0], parts[1]-1, parts[2]); 
              })();

        const allReleases = Array.isArray(this.scheduleReleases) ? this.scheduleReleases : [];
        const sorted = [...allReleases]
            .filter(r => r && r.date)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Determine "current" release: latest release whose date is <= today
        const currentRelease = (() => {
            let cur = null;
            for (const r of sorted) {
                const d = (typeof this.parseYMD === 'function')
                    ? this.normalizeDate(this.parseYMD(r.date))
                    : (() => { 
                        const parts = r.date.split('-');
                        return new Date(parts[0], parts[1]-1, parts[2]); 
                      })();
                
                if (d <= today) cur = r;
                else break;
            }
            return cur;
        })();

        const idx = sorted.findIndex(r => r && r.date === charDate && String(r.version) === String(charVersion));
        const nextRelease = idx >= 0 ? sorted[idx + 1] : null;
        const prevRelease = idx >= 0 ? sorted[idx - 1] : null;

        let endDate = null;
        if (nextRelease && nextRelease.date) {
            endDate = new Date(nextRelease.date);
            endDate.setHours(0, 0, 0, 0);
        } else {
            // Last card edge case: estimate duration using previous interval
            if (prevRelease && prevRelease.date) {
                const prevDateObj = new Date(prevRelease.date);
                prevDateObj.setHours(0, 0, 0, 0);
                const durationDays = Math.max(0, Math.round((startDate - prevDateObj) / (1000 * 60 * 60 * 24)));
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + durationDays);
            } else {
                endDate = new Date(startDate);
            }
        }

        // Income interval:
        // - For the current (ongoing) version, count from today → next release
        // - For future versions, count from its release date → next release
        // - For old past versions, count nothing
        const isCurrentRelease = !!currentRelease &&
            currentRelease.date === charDate &&
            String(currentRelease.version) === String(charVersion);

        const calcStartDate = new Date(startDate);
        if (isCurrentRelease) {
            if (calcStartDate < today) calcStartDate.setTime(today.getTime());
        } else {
            // Not current: do NOT clamp to today (pre-release days should not be counted for future cards)
            // If this is already in the past, dayCount will be 0 anyway.
        }

        const dayCount = Math.max(0, Math.round((endDate - calcStartDate) / (1000 * 60 * 60 * 24)));

        const countMondays = () => {
            let count = 0;
            const cur = new Date(calcStartDate);
            while (cur < endDate) {
                if (cur.getDay() === 1) count++;
                cur.setDate(cur.getDate() + 1);
            }
            return count;
        };

        const countMonthFirstDays = () => {
            let count = 0;
            const cur = new Date(calcStartDate);
            while (cur < endDate) {
                if (cur.getDate() === 1) count++;
                cur.setDate(cur.getDate() + 1);
            }
            return count;
        };

        const mondayCount = countMondays();
        const monthFirstCount = countMonthFirstDays();

        const dailyIncome = this.income.dailyMission + (this.income.monthlySubEnabled ? this.income.monthlySubAmount : 0);
        const dailyIncomeTotal = Math.max(0, dayCount) * dailyIncome;

        // Calculate version income and battle pass for this character's version
        const versionNum = parseFloat(charVersion);
        // scheduleScenario에 따라 4.0부터(4.0, 4.1, 4.2 등) 보상 배율 결정
        // this.scheduleScenario가 없으면 드롭다운에서 직접 가져오기
        let scheduleScenario = this.scheduleScenario;
        if (!scheduleScenario) {
            const dropdown = document.getElementById('inputScheduleScenario');
            scheduleScenario = dropdown ? dropdown.value : '3weeks';
            // 드롭다운에서 가져온 값을 this.scheduleScenario에도 저장
            if (scheduleScenario) {
                this.scheduleScenario = scheduleScenario;
            }
        }
        const versionMultiplier = versionNum >= 4.0 
            ? (scheduleScenario === '2weeks' ? 1.0 : 1.5)
            : 1.0;
        // Version income should not be attributed to the current (already-started) version card.
        // Apply it only when the version actually starts (future cards).
        const versionIncome = (startDate >= today) ? (this.income.versionIncome * versionMultiplier) : 0;
        
        // Debug log for version 4.0+
        if (versionNum >= 4.0) {
            console.log(`[Income] Version ${charVersion}, scheduleScenario: ${scheduleScenario}, multiplier: ${versionMultiplier}, versionIncome: ${versionIncome} (base: ${this.income.versionIncome})`);
        }
        // const battlePassIncome = this.income.battlePassEnabled ? this.income.battlePassAmount : 0;
        const battlePassIncome = 0; // DISABLED

        // Extra Income
        const extraRows = Array.isArray(this.extraIncomeRows) ? this.extraIncomeRows : [];
        let isNewVersion = false;
        if (idx >= 0) {
            if (!prevRelease || prevRelease.version == null) {
                isNewVersion = true;
            } else {
                const pv = parseFloat(prevRelease.version);
                const cv = parseFloat(charVersion);
                if (Number.isFinite(pv) && Number.isFinite(cv)) {
                    isNewVersion = cv !== pv;
                }
            }
        } else {
            // fallback: preserve prior behavior if we cannot locate current release
            isNewVersion = !prevDate;
            if (prevDate) {
                const prevReleaseByDate = (Array.isArray(this.scheduleReleases) ? this.scheduleReleases : []).find(r => r && r.date === prevDate);
                if (prevReleaseByDate && prevReleaseByDate.version != null) {
                    const pv = parseFloat(prevReleaseByDate.version);
                    const cv = parseFloat(charVersion);
                    if (Number.isFinite(pv) && Number.isFinite(cv)) {
                        isNewVersion = cv !== pv;
                    }
                } else {
                    isNewVersion = false;
                }
            }
        }

        // Once: apply to the current (ongoing) version's first 5★ card
        const isOnceRelease = !!currentRelease && currentRelease.date === charDate && String(currentRelease.version) === String(charVersion);
        let isOnceTarget = false;
        if (isOnceRelease && charName && currentRelease && Array.isArray(currentRelease.characters)) {
            const firstFiveStar = currentRelease.characters.find(n => {
                const cd = window.characterData?.[n];
                return cd && cd.rarity !== 4;
            });
            isOnceTarget = !!firstFiveStar && firstFiveStar === charName;
        }

        // Extra Income - keep breakdown per frequency for tooltips
        const extraByFreq = {
            daily: { ticket: 0, weaponTicket: 0, ember: 0 },
            weekly: { ticket: 0, weaponTicket: 0, ember: 0 },
            monthly: { ticket: 0, weaponTicket: 0, ember: 0 },
            version: { ticket: 0, weaponTicket: 0, ember: 0 },
            once: { ticket: 0, weaponTicket: 0, ember: 0 }
        };

        extraRows.forEach(row => {
            if (!row || !row.frequency) return;
            const freq = String(row.frequency);
            const t = parseInt(row.ticket, 10) || 0;
            const w = parseInt(row.weaponTicket, 10) || 0;
            const e = parseInt(row.ember, 10) || 0;

            if (freq === 'daily') {
                extraByFreq.daily.ticket += t * Math.max(0, dayCount);
                extraByFreq.daily.weaponTicket += w * Math.max(0, dayCount);
                extraByFreq.daily.ember += e * Math.max(0, dayCount);
                return;
            }

            if (freq === 'weekly') {
                extraByFreq.weekly.ticket += t * Math.max(0, mondayCount);
                extraByFreq.weekly.weaponTicket += w * Math.max(0, mondayCount);
                extraByFreq.weekly.ember += e * Math.max(0, mondayCount);
                return;
            }

            if (freq === 'monthly') {
                extraByFreq.monthly.ticket += t * Math.max(0, monthFirstCount);
                extraByFreq.monthly.weaponTicket += w * Math.max(0, monthFirstCount);
                extraByFreq.monthly.ember += e * Math.max(0, monthFirstCount);
                return;
            }

            if (freq === 'version') {
                if (isNewVersion) {
                    extraByFreq.version.ticket += t;
                    extraByFreq.version.weaponTicket += w;
                    extraByFreq.version.ember += e;
                }
                return;
            }

            if (freq === 'once') {
                if (isOnceTarget) {
                    extraByFreq.once.ticket += t;
                    extraByFreq.once.weaponTicket += w;
                    extraByFreq.once.ember += e;
                }
            }
        });

        const extraRecurringTicket = extraByFreq.daily.ticket + extraByFreq.weekly.ticket + extraByFreq.monthly.ticket + extraByFreq.version.ticket;
        const extraRecurringWeaponTicket = extraByFreq.daily.weaponTicket + extraByFreq.weekly.weaponTicket + extraByFreq.monthly.weaponTicket + extraByFreq.version.weaponTicket;
        const extraRecurringEmber = extraByFreq.daily.ember + extraByFreq.weekly.ember + extraByFreq.monthly.ember + extraByFreq.version.ember;

        const extraOnceTicket = extraByFreq.once.ticket;
        const extraOnceWeaponTicket = extraByFreq.once.weaponTicket;
        const extraOnceEmber = extraByFreq.once.ember;

        const extraTicket = extraRecurringTicket + extraOnceTicket;
        const extraWeaponTicket = extraRecurringWeaponTicket + extraOnceWeaponTicket;
        const extraEmber = extraRecurringEmber + extraOnceEmber;

        const extraRecurringEquivalent = extraRecurringEmber + (extraRecurringTicket * 150) + (extraRecurringWeaponTicket * 100);
        const extraOnceEquivalent = extraOnceEmber + (extraOnceTicket * 150) + (extraOnceWeaponTicket * 100);
        const extraEmberEquivalent = extraRecurringEquivalent + extraOnceEquivalent;
        // Base income that affects wallet/graph/plan:
        // include version income for future versions, but for the current (already-started) version
        // versionIncome is already forced to 0 above.
        const baseIncome = dailyIncomeTotal + battlePassIncome + versionIncome;
        const totalIncome = baseIncome + extraEmberEquivalent;

        return {
            dailyIncome: dailyIncomeTotal,
            versionIncome: versionIncome,
            battlePassIncome: battlePassIncome,
            interval: {
                // Use local date string to avoid timezone (UTC) shifting by one day in tooltips
                startDate: formatYMD(calcStartDate),
                endDate: formatYMD(endDate),
                days: dayCount,
                mondays: mondayCount,
                monthFirstDays: monthFirstCount
            },
            extraByFreq: extraByFreq,
            extraIncomeRecurring: {
                ticket: extraRecurringTicket,
                weaponTicket: extraRecurringWeaponTicket,
                ember: extraRecurringEmber
            },
            extraIncomeOnce: {
                ticket: extraOnceTicket,
                weaponTicket: extraOnceWeaponTicket,
                ember: extraOnceEmber
            },
            extraIncome: {
                ticket: extraTicket,
                weaponTicket: extraWeaponTicket,
                ember: extraEmber
            },
            baseIncome: baseIncome,
            totalIncome: totalIncome,
            totalIncomeRecurringEquivalent: baseIncome + extraRecurringEquivalent,
            totalIncomeOnceEquivalent: extraOnceEquivalent
        };
    };

    /**
     * Render the pull plan list
     */
    PullSimulator.prototype.renderPlanList = function() {
        const container = document.getElementById('planList');
        const countEl = document.getElementById('planCount');

        if (!container) return;
        countEl.textContent = `(${this.targets.length})`;

        if (this.targets.length === 0) {
            container.innerHTML = '';
            return;
        }

        // Initialize wallet with current assets
        let currentWallet = new Wallet(
            this.assets.ember,
            this.assets.ticket,
            this.assets.paidEmber,
            this.assets.weaponTicket,
            this.assets.cognigem
        );
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let prevPlanDate = null;

        // Precompute income events:
        // - interval income is granted at interval endDate
        // - once income is granted at:
        //   - today for current ongoing version
        //   - banner startDate for future versions
        const incomeEvents = [];
        const allReleases = this.scheduleReleases.length > 0
            ? this.scheduleReleases
            : (window.ReleaseScheduleData ? this.parseScheduleData(window.ReleaseScheduleData) : []);
        const sortedReleases = [...allReleases]
            .filter(r => r && r.date)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        sortedReleases.forEach(release => {
            const fiveStarChars = (release.characters || []).filter(n => {
                const cd = window.characterData?.[n];
                return cd && cd.rarity !== 4;
            });

            // Income is per-banner-interval. Avoid double counting when a banner has multiple 5-stars.
            const firstCharName = fiveStarChars.length > 0 ? fiveStarChars[0] : null;
            if (!firstCharName) return;

            const income = this.calculateCharacterIncome(release.date, release.version, null, firstCharName);
            if (!income || !income.interval || !income.interval.endDate) return;

            const onceEq = income.totalIncomeOnceEquivalent || 0;
            if (onceEq > 0 && income.extraIncomeOnce) {
                // Find current ongoing release (latest release <= today)
                const curRelease = (() => {
                    let cur = null;
                    for (const r of sortedReleases) {
                        const d = new Date(r.date);
                        d.setHours(0, 0, 0, 0);
                        if (d <= today) cur = r;
                        else break;
                    }
                    return cur;
                })();

                const isCurrent = !!curRelease && curRelease.date === release.date && String(curRelease.version) === String(release.version);
                const onceDate = isCurrent ? new Date(today) : new Date(release.date);
                onceDate.setHours(0, 0, 0, 0);
                if (onceDate >= today) {
                    incomeEvents.push({
                        date: onceDate,
                        baseIncome: 0,
                        extraTicket: income.extraIncomeOnce.ticket || 0,
                        extraWeaponTicket: income.extraIncomeOnce.weaponTicket || 0,
                        extraEmber: income.extraIncomeOnce.ember || 0
                    });
                }
            }

            const endDate = new Date(income.interval.endDate);
            endDate.setHours(0, 0, 0, 0);
            // Include endDate === today so that "today -> next banner" income applies
            // when the first target is also today.
            if (endDate >= today) {
                incomeEvents.push({
                    date: endDate,
                    baseIncome: income.baseIncome || 0,
                    extraTicket: (income.extraIncomeRecurring && income.extraIncomeRecurring.ticket) ? income.extraIncomeRecurring.ticket : 0,
                    extraWeaponTicket: (income.extraIncomeRecurring && income.extraIncomeRecurring.weaponTicket) ? income.extraIncomeRecurring.weaponTicket : 0,
                    extraEmber: (income.extraIncomeRecurring && income.extraIncomeRecurring.ember) ? income.extraIncomeRecurring.ember : 0
                });
            }
        });
        incomeEvents.sort((a, b) => a.date - b.date);
        let incomeEventIndex = 0;

        // Find first character (A0+) and first weapon (not None) to apply pity
        let firstCharFound = false;
        let firstWeaponFound = false;
        
        let html = '';
        this.targets.forEach((target, index) => {
            const targetDate = new Date(target.date);
            targetDate.setHours(0, 0, 0, 0);
            
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

            // Apply all income events up to this target date
            while (incomeEventIndex < incomeEvents.length && incomeEvents[incomeEventIndex].date <= targetDate) {
                const evt = incomeEvents[incomeEventIndex];
                currentWallet.addIncome(evt.baseIncome || 0);
                currentWallet.ticket += evt.extraTicket || 0;
                currentWallet.weaponTicket += evt.extraWeaponTicket || 0;
                currentWallet.ember += evt.extraEmber || 0;
                incomeEventIndex++;
            }

            // Advance baseline only for future targets
            if (targetDate > today) {
                prevPlanDate = new Date(targetDate);
            }

            // Capture wallet state BEFORE extra purchase (base available)
            const walletBase = currentWallet.clone();

            // Add extra purchases to wallet (for current character's available)
            currentWallet.ember += (target.extraEmber || 0);
            currentWallet.ticket += (target.extraTicket || 0);
            currentWallet.weaponTicket += (target.extraWeaponTicket || 0);

            // Capture wallet state BEFORE pull (with extra purchase)
            const walletBefore = currentWallet.clone();

            // Simulate spending with wallet system
            const spendResult = this.simulateWalletSpend(currentWallet, target, isFirstChar, isFirstWeapon);
            const isSafe = spendResult.success;

            // Update wallet to remaining state AFTER pull
            currentWallet = spendResult.remainingWallet;
            const walletAfter = currentWallet;

            const displayName = this.getCharacterName(target.name);
            const ticketCount = Math.ceil(target.cost / 150);

            // Calculate individual costs and required tickets
            const charCost = spendResult.character.cost;
            const weaponCost = spendResult.weapon.cost;
            const charTicketsNeeded = Math.ceil(charCost / 150);
            const weaponTicketsNeeded = Math.ceil(weaponCost / 100);

            // Generate detailed breakdown HTML
            let breakdownHtml = '';

            if (charCost > 0) {
                const charResult = spendResult.character.result;
                const charSuccess = charResult && charResult.success;
                breakdownHtml += `
                    <div class="cost-breakdown-row ${charSuccess ? 'success' : 'warning'}">
                        <span class="cost-label">${charSuccess ? '✓' : '⚠'} ${this.t('charTarget')}:</span>
                        <span class="cost-value">${this.formatNumber(charCost)}</span>
                    </div>`;
            }

            if (weaponCost > 0) {
                const weaponResult = spendResult.weapon.result;
                const weaponSuccess = weaponResult && weaponResult.success;
                breakdownHtml += `
                    <div class="cost-breakdown-row ${weaponSuccess ? 'success' : 'warning'}">
                        <span class="cost-label">${weaponSuccess ? '✓' : '⚠'} ${this.t('weaponTarget')}:</span>
                        <span class="cost-value">${this.formatNumber(weaponCost)}</span>
                    </div>`;
            }

            const balanceAfter = currentWallet.getTotalEmber();

            let metaHtml = '';
            const charData = window.characterData?.[target.name] || {};
            const position = charData.position || '';
            const element = charData.element || '';
            if (position) {
                metaHtml += `<img src="${BASE_URL}/assets/img/character-cards/직업_${position}.png" alt="${position}" onerror="this.style.display='none'">`;
            }
            if (element) {
                metaHtml += `<img src="${BASE_URL}/assets/img/character-cards/속성_${element}.png" alt="${element}" onerror="this.style.display='none'">`;
            }

            html += `
                <div class="plan-item ${isSafe ? '' : 'warning'}" data-index="${index}">
                    <div class="plan-item-header">
                        <span class="plan-item-number">${index + 1}</span>
                        <img class="plan-item-avatar" src="${BASE_URL}/assets/img/tier/${target.name}.webp" alt="${displayName}"
                             onerror="this.src='${BASE_URL}/assets/img/character-cards/card_skeleton.webp'">
                        <div class="plan-item-info">
                            <div class="plan-item-info-col1">
                                <div class="plan-item-subtitle">
                                    <div class="plan-item-name">${displayName}</div>
                                    <div class="char-meta">${metaHtml}</div>
                                </div>
                                <div class="plan-item-targets">
                                    <div class="target-dropdown" data-index="${index}" data-type="character">
                                        <button class="target-dropdown-btn">
                                            <img src="${BASE_URL}/assets/img/ritual/${target.characterTarget.toLowerCase()}.png" alt="${target.characterTarget}">
                                            <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </button>
                                        <div class="target-dropdown-menu">
                                            ${['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6'].map(opt =>
                                                `<button class="target-dropdown-item ${target.characterTarget === opt ? 'selected' : ''}" data-value="${opt}">
                                                    <img src="${BASE_URL}/assets/img/ritual/${opt.toLowerCase()}.png" alt="${opt}">
                                                    <span>${opt}</span>
                                                </button>`
                                            ).join('')}
                                        </div>
                                    </div>
                                    <div class="target-dropdown" data-index="${index}" data-type="weapon">
                                        <button class="target-dropdown-btn">
                                            ${target.weaponTarget !== 'None' ? `<img src="${BASE_URL}/assets/img/ritual/${target.weaponTarget.toLowerCase()}.png" alt="${target.weaponTarget}">` : '<span class="weapon-none-badge">✕</span>'}
                                            <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </button>
                                        <div class="target-dropdown-menu">
                                            <button class="target-dropdown-item ${target.weaponTarget === 'None' ? 'selected' : ''}" data-value="None">
                                                <span class="none-icon">✕</span>
                                                <span>None</span>
                                            </button>
                                            ${['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'].map(opt =>
                                                `<button class="target-dropdown-item ${target.weaponTarget === opt ? 'selected' : ''}" data-value="${opt}">
                                                    <img src="${BASE_URL}/assets/img/ritual/${opt.toLowerCase()}.png" alt="${opt}">
                                                    <span>${opt}</span>
                                                </button>`
                                            ).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="plan-item-info-col2">
                                <div class="plan-resources-section">
                                    <div class="plan-resources-title">${this.t('extraPurchase')}</div>
                                    <div class="plan-resources-row">
                                        <div class="plan-resource-input">
                                            <img src="${BASE_URL}/assets/img/pay/이계 엠버.png" alt="">
                                            <input type="number" data-index="${index}" data-field="extraEmber" value="${target.extraEmber || 0}" min="0">
                                        </div>
                                        <div class="plan-resource-input">
                                            <img src="${BASE_URL}/assets/img/pay/정해진 운명.png" alt="">
                                            <input type="number" data-index="${index}" data-field="extraTicket" value="${target.extraTicket || 0}" min="0">
                                        </div>
                                        <div class="plan-resource-input">
                                            <img src="${BASE_URL}/assets/img/pay/정해진 코인.png" alt="">
                                            <input type="number" data-index="${index}" data-field="extraWeaponTicket" value="${target.extraWeaponTicket || 0}" min="0">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="plan-item-actions">
                            <button class="plan-item-remove" data-index="${index}">&times;</button>
                        </div>
                    </div>
                    <div class="plan-item-status-bar">
                        <div class="status-row-container">
                            <div class="status-column status-column-before">
                                <div class="status-column-label">Available</div>
                                <div class="status-column-values">
                                    <div class="status-column-value">
                                        <img src="${BASE_URL}/assets/img/pay/정해진 운명.png" class="status-mini-icon">
                                        <span>${walletBefore.ticket}</span>
                                    </div>
                                    <div class="status-column-value">
                                        <img src="${BASE_URL}/assets/img/pay/정해진 코인.png" class="status-mini-icon">
                                        <span>${walletBefore.weaponTicket}</span>
                                    </div>
                                    <div class="status-column-value">
                                        <img src="${BASE_URL}/assets/img/pay/이계 엠버.png" class="status-mini-icon">
                                        <span>${this.formatNumber(walletBefore.getTotalEmber())}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="status-operator status-operator-minus">−</div>
                            <div class="status-column status-column-required">
                                <div class="status-column-label">Required</div>
                                <div class="status-column-values">
                                    <div class="status-column-value">
                                        <img src="${BASE_URL}/assets/img/pay/정해진 운명.png" class="status-mini-icon">
                                        <span>${charTicketsNeeded}</span>
                                    </div>
                                    <div class="status-column-value">
                                        <img src="${BASE_URL}/assets/img/pay/정해진 코인.png" class="status-mini-icon">
                                        <span>${weaponTicketsNeeded}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="status-operator status-operator-equal">=</div>
                            <div class="status-column status-column-after ${isSafe ? 'safe' : 'warning'}">
                                <div class="status-column-label">
                                    After${!isSafe ? '<span class="shortage-label">: Shortage</span>' : ''}
                                </div>
                                <div class="status-column-values">
                                    <div class="status-column-value ${walletAfter.ticket < 0 ? 'negative' : ''}">
                                        <img src="${BASE_URL}/assets/img/pay/정해진 운명.png" class="status-mini-icon">
                                        <span>${walletAfter.ticket < 0 ? `(${Math.abs(walletAfter.ticket)})` : walletAfter.ticket}</span>
                                    </div>
                                    <div class="status-column-value ${walletAfter.weaponTicket < 0 ? 'negative' : ''}">
                                        <img src="${BASE_URL}/assets/img/pay/정해진 코인.png" class="status-mini-icon">
                                        <span>${walletAfter.weaponTicket < 0 ? `(${Math.abs(walletAfter.weaponTicket)})` : walletAfter.weaponTicket}</span>
                                    </div>
                                    <div class="status-column-value ${walletAfter.getTotalEmber() < 0 ? 'negative' : ''}">
                                        <img src="${BASE_URL}/assets/img/pay/이계 엠버.png" class="status-mini-icon">
                                        <span>${walletAfter.getTotalEmber() < 0 ? `(${this.formatNumber(Math.abs(walletAfter.getTotalEmber()))})` : this.formatNumber(walletAfter.getTotalEmber())}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Bind events

        container.querySelectorAll('.plan-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeTarget(parseInt(btn.dataset.index));
            });
        });

        // Target dropdown handlers
        container.querySelectorAll('.target-dropdown').forEach(dropdown => {
            const btn = dropdown.querySelector('.target-dropdown-btn');
            const menu = dropdown.querySelector('.target-dropdown-menu');
            const idx = parseInt(dropdown.dataset.index);
            const type = dropdown.dataset.type;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other dropdowns
                container.querySelectorAll('.target-dropdown-menu').forEach(m => {
                    if (m !== menu) m.classList.remove('active');
                });
                menu.classList.toggle('active');
            });

            menu.querySelectorAll('.target-dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const value = item.dataset.value;
                    if (type === 'character') {
                        this.targets[idx].characterTarget = value;
                    } else {
                        this.targets[idx].weaponTarget = value;
                    }
                    this.saveData();
                    this.recalculate();
                    menu.classList.remove('active');
                });
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.target-dropdown')) {
                container.querySelectorAll('.target-dropdown-menu').forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        });

        container.querySelectorAll('.plan-resource-input input').forEach(input => {
            input.addEventListener('change', (e) => {
                e.stopPropagation();
                const idx = parseInt(input.dataset.index);
                const field = input.dataset.field;
                this.targets[idx][field] = parseInt(input.value) || 0;
                this.saveData();
                this.recalculate();
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        });
    };

})();
