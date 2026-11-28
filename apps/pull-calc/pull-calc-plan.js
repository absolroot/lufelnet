/**
 * P5X Pull Calculator - Plan Module
 * Pull Plan 렌더링 및 관리 로직
 */

(function () {
    'use strict';

    // PullSimulator 클래스가 이미 정의되어 있어야 함
    if (typeof PullSimulator === 'undefined') {
        console.error('PullSimulator class not found. Make sure pull-calc.js is loaded before pull-calc-plan.js');
        return;
    }

    console.log('PullSimulator plan module loaded');

    function normalizeReleaseVersion(version) {
        return String(version == null ? '' : version).trim().replace(/^v/i, '');
    }

    function isSameReleaseVersion(a, b) {
        return normalizeReleaseVersion(a) === normalizeReleaseVersion(b);
    }

    function positionTargetMenu(menu, button) {
        const rect = button.getBoundingClientRect();
        const viewport = window.visualViewport;
        const top = viewport?.offsetTop ?? 0;
        const left = viewport?.offsetLeft ?? 0;
        const bottom = top + (viewport?.height ?? document.documentElement.clientHeight);
        const right = left + (viewport?.width ?? document.documentElement.clientWidth);
        if (rect.bottom <= top || rect.top >= bottom || rect.right <= left || rect.left >= right) {
            menu.hidePopover();
            return;
        }
        const edge = 8;
        const gap = 4;
        const below = bottom - rect.bottom - gap - edge;
        const above = rect.top - top - gap - edge;
        menu.style.maxHeight = '';
        menu.style.maxWidth = `${right - left - edge * 2}px`;
        const upward = menu.offsetHeight > below && above > below;
        menu.style.maxHeight = `${Math.max(0, Math.min(300, upward ? above : below))}px`;
        menu.style.left = `${Math.max(left + edge, Math.min(rect.left, right - edge - menu.offsetWidth))}px`;
        menu.style.top = `${upward ? rect.top - gap - menu.offsetHeight : rect.bottom + gap}px`;
    }

    function repositionOpenTargetMenu() {
        const menu = document.querySelector('.target-dropdown-menu:popover-open');
        if (menu) positionTargetMenu(menu, menu.previousElementSibling);
    }

    window.addEventListener('resize', repositionOpenTargetMenu);
    window.visualViewport?.addEventListener('resize', repositionOpenTargetMenu);
    window.visualViewport?.addEventListener('scroll', repositionOpenTargetMenu);
    document.addEventListener('scroll', event => {
        if (!event.target.closest?.('.target-dropdown-menu')) repositionOpenTargetMenu();
    }, { capture: true, passive: true });

    /**
     * Calculate income for a character card (daily + version + battle pass)
     * This is used by both timeline cards and pull plan
     */
    PullSimulator.prototype.calculateCharacterIncome = function (charDate, charVersion, prevDate = null, charName = null) {
        const today = this.getKSTToday();
        const formatYMD = (d) => this.formatGameDate(d);

        const startDate = this.parseGameDate(charDate);

        const allReleases = Array.isArray(this.scheduleReleases) ? this.scheduleReleases : [];
        const sorted = [...allReleases]
            .filter(r => r && r.date)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Determine "current" release: latest release whose date is <= today
        const currentRelease = (() => {
            let cur = null;
            for (const r of sorted) {
                const d = this.parseGameDate(r.date);

                if (d <= today) cur = r;
                else break;
            }
            return cur;
        })();

        const idx = sorted.findIndex(r => r && r.date === charDate && isSameReleaseVersion(r.version, charVersion));
        const currentScheduleRelease = idx >= 0 ? sorted[idx] : null;
        const nextRelease = idx >= 0 ? sorted[idx + 1] : null;
        const prevRelease = idx >= 0 ? sorted[idx - 1] : null;

        let endDate = null;
        const fixedRewardDays = currentScheduleRelease && currentScheduleRelease.explicitDate && currentScheduleRelease.days != null
            ? Number(currentScheduleRelease.days)
            : null;
        if (Number.isFinite(fixedRewardDays) && fixedRewardDays >= 0) {
            endDate = this.addDays(startDate, fixedRewardDays);
        } else if (nextRelease && nextRelease.date) {
            endDate = this.parseGameDate(nextRelease.date);
        } else {
            // Last card edge case: estimate duration using previous interval
            if (prevRelease && prevRelease.date) {
                const prevDateObj = this.parseGameDate(prevRelease.date);
                const durationDays = Math.max(0, Math.round((startDate - prevDateObj) / (1000 * 60 * 60 * 24)));
                endDate = this.addDays(startDate, durationDays);
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
            isSameReleaseVersion(currentRelease.version, charVersion);

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
                if (cur.getUTCDay() === 1) count++; // CRITICAL: Use getUTCDay()
                cur.setUTCDate(cur.getUTCDate() + 1); // CRITICAL: Use setUTCDate()
            }
            return count;
        };

        const countMonthFirstDays = () => {
            let count = 0;
            const cur = new Date(calcStartDate);
            while (cur < endDate) {
                if (cur.getUTCDate() === 1) count++; // CRITICAL: Use getUTCDate()
                cur.setUTCDate(cur.getUTCDate() + 1); // CRITICAL: Use setUTCDate()
            }
            return count;
        };

        const mondayCount = countMondays();
        const monthFirstCount = countMonthFirstDays();

        const dailyIncome = this.income.dailyMission + (this.income.monthlySubEnabled ? this.income.monthlySubAmount : 0);
        const dailyIncomeTotal = Math.max(0, dayCount) * dailyIncome;

        // Calculate version income and battle pass for this character's version
        const incomeVersion = idx >= 0 && sorted[idx].incomeVersion ? sorted[idx].incomeVersion : charVersion;
        const versionNum = parseFloat(incomeVersion);
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
        const baseVersionDays = Number(window.ReleaseScheduleData?.intervalRules?.beforeV4 || 14);
        const fixedVersionMultiplier = Number.isFinite(fixedRewardDays) && fixedRewardDays >= 0 && baseVersionDays > 0
            ? fixedRewardDays / baseVersionDays
            : null;
        const versionMultiplier = versionNum >= 4.0
            ? (fixedVersionMultiplier != null ? fixedVersionMultiplier : (scheduleScenario === '2weeks' ? 1.0 : 1.5))
            : 1.0;
        // Version income should not be attributed to the current (already-started) version card.
        // Apply it only when the version actually starts (future cards).
        const versionIncome = (startDate >= today) ? (this.income.versionIncome * versionMultiplier) : 0;

        // Debug log for version 4.0+
        /*
        if (versionNum >= 4.0) {
            console.log(`[Income] Version ${charVersion}, scheduleScenario: ${scheduleScenario}, multiplier: ${versionMultiplier}, versionIncome: ${versionIncome} (base: ${this.income.versionIncome})`);
        }*/
        // const battlePassIncome = this.income.battlePassEnabled ? this.income.battlePassAmount : 0;
        const battlePassIncome = 0; // DISABLED

        // Extra Income
        const extraRows = Array.isArray(this.extraIncomeRows) ? this.extraIncomeRows : [];
        let isNewVersion = false;
        if (idx >= 0) {
            if (!prevRelease || prevRelease.version == null) {
                isNewVersion = true;
            } else {
                isNewVersion = !isSameReleaseVersion(prevRelease.version, charVersion);
            }
        } else {
            // fallback: preserve prior behavior if we cannot locate current release
            isNewVersion = !prevDate;
            if (prevDate) {
                const prevReleaseByDate = (Array.isArray(this.scheduleReleases) ? this.scheduleReleases : []).find(r => r && r.date === prevDate);
                if (prevReleaseByDate && prevReleaseByDate.version != null) {
                    isNewVersion = !isSameReleaseVersion(prevReleaseByDate.version, charVersion);
                } else {
                    isNewVersion = false;
                }
            }
        }

        // Once: apply to the current (ongoing) version's first 5★ card
        const isOnceRelease = !!currentRelease && currentRelease.date === charDate && isSameReleaseVersion(currentRelease.version, charVersion);
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
    PullSimulator.prototype.renderPlanList = function (targetCosts) {
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
        const today = this.getKSTToday();
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
            const fiveStarChars = this.getRenderableScheduleCharacters(release);

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
                        const d = this.parseGameDate(r.date);
                        if (d <= today) cur = r;
                        else break;
                    }
                    return cur;
                })();

                const isCurrent = !!curRelease && curRelease.date === release.date && String(curRelease.version) === String(release.version);
                const onceDate = isCurrent ? new Date(today) : this.parseGameDate(release.date);
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

            const endDate = this.parseGameDate(income.interval.endDate);
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

        let html = '';
        this.targets.forEach((target, index) => {
            // [FIX] Use parseGameDate to ensure UTC comparison matches income events
            const targetDate = this.parseGameDate(target.date);

            // Apply all income events up to this target date
            while (incomeEventIndex < incomeEvents.length && incomeEvents[incomeEventIndex].date <= targetDate) {
                const evt = incomeEvents[incomeEventIndex];
                currentWallet.addIncome(evt.baseIncome || 0);
                currentWallet.ticket += evt.extraTicket || 0;
                currentWallet.weaponTicket += evt.extraWeaponTicket || 0;
                currentWallet.ember += evt.extraEmber || 0;
                incomeEventIndex++;
            }

            // =================================================================
            // Wallet Normalization (Debt Repayment)
            // Automatically use accumulated ember to pay off negative ticket balances.
            // =================================================================
            if (currentWallet.ember > 0) {
                // 1. Pay off Character Ticket Debt (Rate: 150 Ember per ticket)
                if (currentWallet.ticket < 0) {
                    const debt = Math.abs(currentWallet.ticket);
                    const costToClear = debt * 150;

                    if (currentWallet.ember >= costToClear) {
                        // Fully clear debt
                        currentWallet.ember -= costToClear;
                        currentWallet.ticket = 0;
                    } else {
                        // Partially clear debt
                        const ticketsRestored = Math.floor(currentWallet.ember / 150);
                        currentWallet.ticket += ticketsRestored;
                        currentWallet.ember -= ticketsRestored * 150;
                    }
                }

                // 2. Pay off Weapon Ticket Debt (Rate: 100 Ember per ticket)
                if (currentWallet.weaponTicket < 0) {
                    const debt = Math.abs(currentWallet.weaponTicket);
                    const costToClear = debt * 100;

                    if (currentWallet.ember >= costToClear) {
                        // Fully clear debt
                        currentWallet.ember -= costToClear;
                        currentWallet.weaponTicket = 0;
                    } else {
                        // Partially clear debt
                        const ticketsRestored = Math.floor(currentWallet.ember / 100);
                        currentWallet.weaponTicket += ticketsRestored;
                        currentWallet.ember -= ticketsRestored * 100;
                    }
                }
            }
            // =================================================================

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

            // =================================================================
            // Wallet Normalization (Debt Repayment)
            // Automatically use accumulated ember to pay off negative ticket balances.
            // Now runs AFTER extra purchases, so it can use both natural income
            // and user-added extra ember to clear debt.
            // =================================================================
            if (currentWallet.ember > 0) {
                // 1. Pay off Character Ticket Debt (Rate: 150 Ember per ticket)
                if (currentWallet.ticket < 0) {
                    const debt = Math.abs(currentWallet.ticket);
                    const costToClear = debt * 150;

                    if (currentWallet.ember >= costToClear) {
                        // Fully clear debt
                        currentWallet.ember -= costToClear;
                        currentWallet.ticket = 0;
                    } else {
                        // Partially clear debt
                        const ticketsRestored = Math.floor(currentWallet.ember / 150);
                        currentWallet.ticket += ticketsRestored;
                        currentWallet.ember -= ticketsRestored * 150;
                    }
                }

                // 2. Pay off Weapon Ticket Debt (Rate: 100 Ember per ticket)
                if (currentWallet.weaponTicket < 0) {
                    const debt = Math.abs(currentWallet.weaponTicket);
                    const costToClear = debt * 100;

                    if (currentWallet.ember >= costToClear) {
                        // Fully clear debt
                        currentWallet.ember -= costToClear;
                        currentWallet.weaponTicket = 0;
                    } else {
                        // Partially clear debt
                        const ticketsRestored = Math.floor(currentWallet.ember / 100);
                        currentWallet.weaponTicket += ticketsRestored;
                        currentWallet.ember -= ticketsRestored * 100;
                    }
                }
            }
            // =================================================================

            // Capture wallet state BEFORE pull (with extra purchase)
            const walletBefore = currentWallet.clone();

            // Simulate spending with wallet system
            const costs = targetCosts[index];
            const spendResult = this.simulateWalletSpend(currentWallet, costs);
            const isSafe = spendResult.success;

            // Update wallet to remaining state AFTER pull
            currentWallet = spendResult.remainingWallet;
            const walletAfter = currentWallet;

            const displayName = this.getCharacterName(target.name);
            const weaponTarget = target.weaponTarget || 'None';
            const isTargeted = costs.weaponBanner === 'targeted';
            const charTicketsNeeded = Math.ceil(costs.charCost / 150);
            const weaponTicketsNeeded = Math.ceil(costs.weaponCost / 100);
            const weaponBudget = [];
            const weaponResult = spendResult.weapon.result;
            if (isTargeted && weaponResult) {
                const coinsUsed = Math.max(0, weaponResult.used.weaponTicket);
                const remainingCost = costs.weaponCost - coinsUsed * 100;
                weaponBudget.push(this.t('targetedWeaponPulls').replace('{count}', this.formatNumber(weaponTicketsNeeded)));
                if (coinsUsed > 0) {
                    weaponBudget.push(this.t('targetedWeaponCoins').replace('{count}', this.formatNumber(coinsUsed)));
                }
                if (remainingCost > 0) {
                    weaponBudget.push(this.t('targetedWeaponCurrency').replace('{count}', this.formatNumber(remainingCost)));
                }
                if (costs.weaponMaterials > 0) {
                    weaponBudget.push(this.t('targetedWeaponMaterials').replace('{count}', costs.weaponMaterials));
                }
            }

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
            const isPlaceholder = this.isPlannerPlaceholderCharacter(target.name);
            const detailHref = isPlaceholder ? '#' : this.getCharacterDetailHref(target.name);
            const avatarHtml = isPlaceholder
                ? `<div class="plan-item-avatar plan-item-avatar-placeholder" aria-hidden="true">?</div>`
                : `<a class="character-detail-anchor plan-item-avatar-link" data-character="${target.name}" href="${detailHref}">
                            <img class="plan-item-avatar" src="${BASE_URL}/assets/img/tier/${target.name}.webp" alt="${displayName}"
                                 onerror="this.src='${BASE_URL}/assets/img/character-cards/card_skeleton.webp'">
                        </a>`;

            html += `
                <div class="plan-item ${isSafe ? '' : 'warning'} ${isPlaceholder ? 'planner-placeholder' : ''}" data-index="${index}">
                    <div class="plan-item-header">
                        <span class="plan-item-number">${index + 1}</span>
                        ${avatarHtml}
                        <div class="plan-item-info">
                            <div class="plan-item-info-col1">
                                <div class="plan-item-subtitle">
                                    <div class="plan-item-name">${displayName}</div>
                                    <div class="char-meta">${metaHtml}</div>
                                </div>
                                <div class="plan-item-targets">
                                    <div class="target-dropdown" data-index="${index}" data-type="character">
                                        <button type="button" class="target-dropdown-btn" popovertarget="pull-character-target-${index}">
                                            <img src="${BASE_URL}/assets/img/ritual/${target.characterTarget.toLowerCase()}.png" alt="${target.characterTarget}">
                                            <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </button>
                                        <div class="target-dropdown-menu" id="pull-character-target-${index}" popover="auto">
                                            ${['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6'].map(opt =>
                `<button class="target-dropdown-item ${target.characterTarget === opt ? 'selected' : ''}" data-value="${opt}">
                                                    <img src="${BASE_URL}/assets/img/ritual/${opt.toLowerCase()}.png" alt="${opt}">
                                                    <span>${opt}</span>
                                                </button>`
            ).join('')}
                                        </div>
                                    </div>
                                    <div class="target-dropdown" data-index="${index}" data-type="weapon">
                                        <button type="button" class="target-dropdown-btn" popovertarget="pull-weapon-target-${index}">
                                            ${weaponTarget !== 'None' ? `<img src="${BASE_URL}/assets/img/ritual/${weaponTarget.toLowerCase()}.png" alt="${weaponTarget}">` : '<span class="weapon-none-badge">✕</span>'}
                                            <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </button>
                                        <div class="target-dropdown-menu" id="pull-weapon-target-${index}" popover="auto">
                                            <button class="target-dropdown-item ${weaponTarget === 'None' ? 'selected' : ''}" data-value="None">
                                                <span class="none-icon">✕</span>
                                                <span>${this.t('noneLabel')}</span>
                                            </button>
                                            ${['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'].map(opt =>
                `<button class="target-dropdown-item ${weaponTarget === opt ? 'selected' : ''}" data-value="${opt}">
                                                    <img src="${BASE_URL}/assets/img/ritual/${opt.toLowerCase()}.png" alt="${opt}">
                                                    <span>${opt}</span>
                                                </button>`
            ).join('')}
                                        </div>
                                    </div>
                                    ${weaponTarget !== 'None' && !this.isSeaServer ? `
                                        <select class="modal-input plan-weapon-banner" data-index="${index}" aria-label="${this.t('weaponBanner')}">
                                            <option value="chance" ${isTargeted ? '' : 'selected'}>${this.t('weaponBannerChance')}</option>
                                            <option value="targeted" ${isTargeted ? 'selected' : ''}>${this.t('weaponBannerTargeted')}</option>
                                        </select>` : ''}
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
                    ${weaponBudget.length ? `<div class="plan-weapon-budget">${weaponBudget.map(item => `<span>${item}</span>`).join('')}</div>` : ''}
                    <div class="plan-item-status-bar">
                        <div class="status-row-container">
                            <div class="status-column status-column-before">
                                <div class="status-column-label">${this.t('statusAvailable')}</div>
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
                                <div class="status-column-label">${this.t('statusRequired')}</div>
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
                                    ${this.t('statusAfter')}${!isSafe ? `<span class="shortage-label">: ${this.t('shortage')}</span>` : ''}
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
        if (typeof this.bindCharacterAvatarLinks === 'function') {
            this.bindCharacterAvatarLinks(container);
        }

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

            menu.addEventListener('toggle', () => {
                if (menu.matches(':popover-open')) positionTargetMenu(menu, btn);
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
                    const restoreFocus = e.detail === 0;
                    const trigger = btn.getAttribute('popovertarget');
                    menu.hidePopover();
                    this.recalculate();
                    if (restoreFocus) container.querySelector(`[popovertarget="${trigger}"]`)?.focus({ preventScroll: true });
                });
            });
        });

        container.querySelectorAll('.plan-weapon-banner').forEach(select => {
            select.addEventListener('change', () => {
                const { index } = select.dataset;
                this.targets[index].weaponBanner = select.value;
                this.saveData();
                this.recalculate();
                container.querySelector(`.plan-weapon-banner[data-index="${index}"]`)?.focus({ preventScroll: true });
            });
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
