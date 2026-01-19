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
    PullSimulator.prototype.calculateCharacterIncome = function(charDate, charVersion, prevDate = null) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const releaseDate = new Date(charDate);
        releaseDate.setHours(0, 0, 0, 0);
        
        // Calculate days difference: if prevDate exists, use it; otherwise use today (first card)
        let daysDiff = 0;
        if (prevDate) {
            const prevDateObj = new Date(prevDate);
            prevDateObj.setHours(0, 0, 0, 0);
            daysDiff = Math.ceil((releaseDate - prevDateObj) / (1000 * 60 * 60 * 24));
        } else {
            // First card: use days from today
            daysDiff = Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));
        }

        const dailyIncome = this.income.dailyMission + (this.income.monthlySubEnabled ? this.income.monthlySubAmount : 0);
        const dailyIncomeTotal = Math.max(0, daysDiff) * dailyIncome;

        // Calculate version income and battle pass for this character's version
        const versionNum = parseFloat(charVersion);
        const versionIncome = this.income.versionIncome * (versionNum >= 4.0 ? 1.5 : 1.0);
        // const battlePassIncome = this.income.battlePassEnabled ? this.income.battlePassAmount : 0;
        const battlePassIncome = 0; // DISABLED

        const totalIncome = dailyIncomeTotal + versionIncome + battlePassIncome;

        return {
            dailyIncome: dailyIncomeTotal,
            versionIncome: versionIncome,
            battlePassIncome: battlePassIncome,
            totalIncome: totalIncome
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

        let html = '';
        this.targets.forEach((target, index) => {
            const targetDate = new Date(target.date);
            targetDate.setHours(0, 0, 0, 0);

            // Use the same calculation logic as timeline cards
            // Find all characters between prevPlanDate (or today) and targetDate
            let totalIncomeDelta = 0;
            
            if (targetDate > today) {
                const baseline = prevPlanDate && prevPlanDate > today ? new Date(prevPlanDate) : today;
                baseline.setHours(0, 0, 0, 0);
                
                // Use the same schedule releases as buildSchedule (parseScheduleData result)
                // This ensures we use the same data structure and dates
                const allReleases = this.scheduleReleases.length > 0 
                    ? this.scheduleReleases 
                    : (window.ReleaseScheduleData ? this.parseScheduleData(window.ReleaseScheduleData) : []);
                
                // Filter releases between baseline and targetDate
                const relevantReleases = allReleases.filter(release => {
                    if (!release.date) return false;
                    const releaseDate = new Date(release.date);
                    releaseDate.setHours(0, 0, 0, 0);
                    return releaseDate > baseline && releaseDate <= targetDate;
                });
                
                // Sort by date
                relevantReleases.sort((a, b) => new Date(a.date) - new Date(b.date));
                
                // Calculate income for each character card in order
                // First character uses baseline if it's after today, otherwise null (which means use today)
                let currentPrevDate = baseline > today ? baseline.toISOString().split('T')[0] : null;
                relevantReleases.forEach(release => {
                    // Filter out 4-star characters (same as buildSchedule)
                    const fiveStarChars = (release.characters || []).filter(charName => {
                        const charData = window.characterData?.[charName];
                        return charData && charData.rarity !== 4;
                    });
                    
                    fiveStarChars.forEach(charName => {
                        const income = this.calculateCharacterIncome(release.date, release.version, currentPrevDate);
                        totalIncomeDelta += income.totalIncome;
                        // Update prevDate for next character (use date string format)
                        currentPrevDate = release.date;
                    });
                });
            }

            // Add incremental income to wallet
            currentWallet.addIncome(totalIncomeDelta);

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
            const spendResult = this.simulateWalletSpend(currentWallet, target);
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
                            <div class="status-operator">−</div>
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
                            <div class="status-operator">=</div>
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
