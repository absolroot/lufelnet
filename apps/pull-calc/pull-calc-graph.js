/**
 * P5X Pull Calculator - Graph Module
 * 그래프 렌더링 및 밸런스 계산 로직
 */

(function() {
    'use strict';

    // PullSimulator 클래스가 이미 정의되어 있어야 함
    if (typeof PullSimulator === 'undefined') {
        console.error('PullSimulator class not found. Make sure pull-calc.js is loaded before pull-calc-graph.js');
        return;
    }

    console.log('PullSimulator graph module loaded');

    // Gradient function for chart border color (green above 0, red below 0)
    function getGradient(ctx, chartArea, scales) {
        const { top, bottom } = chartArea;
        const { y } = scales;
        
        // Calculate Y-axis position of 0 value in pixels
        const zeroPixel = y.getPixelForValue(0);
        const zeroRatio = Math.min(Math.max((zeroPixel - top) / (bottom - top), 0), 1);

        // Create gradient (top to bottom)
        const gradient = ctx.createLinearGradient(0, top, 0, bottom);
        
        // Color stops: green above 0, red below 0
        gradient.addColorStop(0, 'rgba(125, 218, 125, 1)');      // Top (Green)
        gradient.addColorStop(zeroRatio, 'rgba(125, 218, 125, 1)'); // Zero Line (Green)
        gradient.addColorStop(zeroRatio, 'rgba(255, 100, 100, 1)'); // Zero Line (Red)
        gradient.addColorStop(1, 'rgba(255, 100, 100, 1)');      // Bottom (Red)

        return gradient;
    }

    // Chart.js plugin to draw character pins
    const characterImagePlugin = {
        id: 'characterImagePlugin',
        afterDatasetDraw(chart, args) {
            // Only draw on the single dataset
            if (args.index !== 0) return;
            
            const pluginOptions = chart.options.plugins?.characterImagePlugin;
            if (!pluginOptions || !pluginOptions.balanceHistory || !pluginOptions.imageCache) return;
            
            const balanceHistory = pluginOptions.balanceHistory;
            const imageCache = pluginOptions.imageCache;
            const ctx = chart.ctx;
            
            balanceHistory.forEach((h, i) => {
                // Check if this history entry has target info and is a target
                if (h.targetInfo && Array.isArray(h.targetInfo) && h.targetInfo.length > 0 && h.isTarget) {
                    // Try to find point in the single dataset
                    let point = null;
                    const meta = chart.getDatasetMeta(0);
                    
                    // Check the dataset for the point
                    if (i < meta.data.length && meta.data[i]) {
                        const p = meta.data[i];
                        if (!p.skip && typeof p.x === 'number' && typeof p.y === 'number' && !isNaN(p.x) && !isNaN(p.y)) {
                            point = p;
                        }
                    }
                    
                    if (point) {
                        const x = point.x;
                        const y = point.y;
                        const imgSize = 24;
                        const spacing = 2;
                        
                        // Calculate total width needed for all targets (only character images)
                        const totalTargets = h.targetInfo.length;
                        const totalWidth = totalTargets * imgSize + (totalTargets - 1) * spacing;
                        const startX = x - totalWidth / 2;
                        let currentX = startX;
                        
                        // Draw each target (character + icons overlapping on top)
                        h.targetInfo.forEach((target, targetIdx) => {
                            const charName = target.charName;
                            if (!charName) return;
                            
                            // Draw character image
                            const charImg = imageCache.get(charName);
                            if (charImg && charImg instanceof Image && charImg.complete && charImg.naturalWidth > 0 && charImg.naturalHeight > 0) {
                                const charOffsetX = currentX + imgSize / 2;
                                const charOffsetY = y - imgSize - 6;
                                
                                ctx.save();
                                
                                // Draw circle background for character
                                ctx.beginPath();
                                ctx.arc(charOffsetX, charOffsetY, imgSize/2 + 2, 0, Math.PI * 2);
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                                ctx.fill();
                                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                                ctx.lineWidth = 1.5;
                                ctx.stroke();
                                
                                // Draw character image with aspect ratio preserved
                                ctx.beginPath();
                                ctx.arc(charOffsetX, charOffsetY, imgSize/2, 0, Math.PI * 2);
                                ctx.clip();
                                
                                // Calculate image dimensions preserving aspect ratio
                                const imgAspect = charImg.naturalWidth / charImg.naturalHeight;
                                let drawWidth = imgSize;
                                let drawHeight = imgSize;
                                let drawX = charOffsetX - imgSize/2;
                                let drawY = charOffsetY - imgSize/2;
                                
                                if (imgAspect > 1) {
                                    drawHeight = imgSize / imgAspect;
                                    drawY = charOffsetY - drawHeight / 2;
                                } else {
                                    drawWidth = imgSize * imgAspect;
                                    drawX = charOffsetX - drawWidth / 2;
                                }
                                
                                ctx.drawImage(charImg, drawX, drawY, drawWidth, drawHeight);
                                ctx.restore();
                                
                                // Icon size (smaller than character)
                                const iconSize = imgSize * 0.8;
                                const iconSpacing = -4; // Reduced spacing between A and R icons
                                
                                // Draw awakening icon (A0~A6) if characterTarget is set - overlapping on top left
                                if (target.characterTarget !== undefined) {
                                    const awakeningLevel = target.characterTarget.replace('A', '').toLowerCase();
                                    const awakeningImgKey = `a${awakeningLevel}`;
                                    const awakeningImg = imageCache.get(awakeningImgKey);
                                    
                                    if (awakeningImg && awakeningImg instanceof Image && awakeningImg.complete && awakeningImg.naturalWidth > 0 && awakeningImg.naturalHeight > 0) {
                                        // Position icon on top-left of character image, slightly to the right and lower
                                        const iconOffsetX = charOffsetX - imgSize/2 + iconSize/2 + 12; // Left side, slightly more to the right
                                        const iconOffsetY = charOffsetY - imgSize/2 + iconSize/2 + 8; // Top side, lower down
 
                                        ctx.save();
                                        
                                        // No background for icons
                                        
                                        // Draw image with aspect ratio preserved
                                        const iconAspect = awakeningImg.naturalWidth / awakeningImg.naturalHeight;
                                        let iconDrawWidth = iconSize;
                                        let iconDrawHeight = iconSize;
                                        let iconDrawX = iconOffsetX - iconSize/2;
                                        let iconDrawY = iconOffsetY - iconSize/2;
                                        
                                        if (iconAspect > 1) {
                                            iconDrawHeight = iconSize / iconAspect;
                                            iconDrawY = iconOffsetY - iconDrawHeight / 2;
                                        } else {
                                            iconDrawWidth = iconSize * iconAspect;
                                            iconDrawX = iconOffsetX - iconDrawWidth / 2;
                                        }
                                        
                                        ctx.drawImage(awakeningImg, iconDrawX, iconDrawY, iconDrawWidth, iconDrawHeight);
                                        ctx.restore();
                                    }
                                }
                                
                                // Draw refinement icon (R0~R6) if weaponTarget is set and not None (-1) - overlapping next to awakening icon
                                if (target.weaponTarget !== undefined && target.weaponTarget !== -1) {
                                    const refinementLevel = target.weaponTarget.replace('R', '').toLowerCase();
                                    const refinementImgKey = `r${refinementLevel}`;
                                    const refinementImg = imageCache.get(refinementImgKey);
                                    
                                    if (refinementImg && refinementImg instanceof Image && refinementImg.complete && refinementImg.naturalWidth > 0 && refinementImg.naturalHeight > 0) {
                                        // R icon size (smaller than A icon)
                                        const rIconSize = imgSize * 0.63;
                                        
                                        // Position icon next to awakening icon (if exists) or on top-left
                                        let iconOffsetX;
                                        if (target.characterTarget !== undefined) {
                                            // If awakening icon exists, place refinement icon next to it with smaller spacing
                                            iconOffsetX = charOffsetX - imgSize/2 + iconSize/2 + 8 + iconSize + iconSpacing;
                                        } else {
                                            // Otherwise, place on top-left
                                            iconOffsetX = charOffsetX - imgSize/2 + iconSize/2 + 8;
                                        }
                                        const iconOffsetY = charOffsetY - imgSize/2 + iconSize/2 + 8; // Top side, lower down (same as awakening icon)
                                        
                                        ctx.save();
                                        
                                        // No background for icons
                                        
                                        // Draw image with aspect ratio preserved
                                        const iconAspect = refinementImg.naturalWidth / refinementImg.naturalHeight;
                                        let iconDrawWidth = rIconSize;
                                        let iconDrawHeight = rIconSize;
                                        let iconDrawX = iconOffsetX - rIconSize/2;
                                        let iconDrawY = iconOffsetY - rIconSize/2;
                                        
                                        if (iconAspect > 1) {
                                            iconDrawHeight = rIconSize / iconAspect;
                                            iconDrawY = iconOffsetY - iconDrawHeight / 2;
                                        } else {
                                            iconDrawWidth = rIconSize * iconAspect;
                                            iconDrawX = iconOffsetX - iconDrawWidth / 2;
                                        }
                                        
                                        ctx.drawImage(refinementImg, iconDrawX, iconDrawY, iconDrawWidth, iconDrawHeight);
                                        ctx.restore();
                                    }
                                }
                                
                                currentX += imgSize + spacing;
                            }
                        });
                    }
                }
            });
        }
    };
    
    // Register the plugin
    if (typeof Chart !== 'undefined') {
        Chart.register(characterImagePlugin);
    }

    /**
     * Calculate running balance history for the chart
     */
    PullSimulator.prototype.calculateRunningBalance = function() {
        const today = (typeof this.normalizeDate === 'function') ? this.normalizeDate(new Date()) : (() => {
            const t = new Date(); t.setHours(0,0,0,0); return t;
        })();

        let currentBalance = this.calculateTotalEmberForGraph();
        const history = [];
        const events = [];

        if (this.targets.length === 0) {
            this.balanceHistory = [];
            console.log('[Graph] No targets, balanceHistory cleared');
            return;
        }
        
        console.log('[Graph] calculateRunningBalance called with', this.targets.length, 'targets');

        // Use the same calculation logic as timeline cards and pull plan
        // Collect all character cards between today and last target, in order
        const allReleases = this.scheduleReleases.length > 0 
            ? this.scheduleReleases 
            : (window.ReleaseScheduleData ? this.parseScheduleData(window.ReleaseScheduleData) : []);

        const sortedReleases = [...allReleases]
            .filter(r => r && r.date)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Determine current (ongoing) release: latest release whose date is <= today
        /*
        const currentRelease = (() => {
            let cur = null;
            for (const r of sortedReleases) {
                const d = new Date(r.date);
                d.setHours(0, 0, 0, 0);
                if (d <= today) cur = r;
                else break;
            }
            return cur;
        })();*/
        const currentRelease = (() => {
            let cur = null;
            for (const r of sortedReleases) {
                // parseYMD와 normalizeDate를 사용하여 설정된 시간대 기준으로 날짜 변환
                const d = (typeof this.parseYMD === 'function')
                    ? this.normalizeDate(this.parseYMD(r.date))
                    : (() => { const _d = new Date(r.date); _d.setHours(0,0,0,0); return _d; })();
                
                if (d <= today) cur = r;
                else break;
            }
            return cur;
        })();

        // Get all future character cards (same as timeline)
        const futureReleases = sortedReleases.filter(r => {
            const releaseDate = (typeof this.parseYMD === 'function')
                ? this.normalizeDate(this.parseYMD(r.date))
                : (() => { const d = new Date(r.date); d.setHours(0,0,0,0); return d; })();
            return releaseDate >= today;
        });

        // Get last target date
        const sortedTargets = [...this.targets].sort((a, b) => new Date(a.date) - new Date(b.date));
        const lastTargetDate = sortedTargets.length > 0
            ? ((typeof this.parseYMD === 'function')
                ? this.normalizeDate(this.parseYMD(sortedTargets[sortedTargets.length - 1].date))
                : (() => { const d = new Date(sortedTargets[sortedTargets.length - 1].date); d.setHours(0,0,0,0); return d; })())
            : today;

        // Collect all banner-interval income events up to last target.
        // Include the current ongoing version (so v3.0 -> v3.1 income is applied before the first selectable future target).
        const releasesToProcess = [
            ...(currentRelease ? [currentRelease] : []),
            ...futureReleases
        ];

        // Interval income is granted at interval endDate, and Once income (if any) is granted at:
        // - today for current ongoing version
        // - banner start date for future versions
        releasesToProcess.forEach(release => {
            const releaseDate = (typeof this.parseYMD === 'function')
                ? this.normalizeDate(this.parseYMD(release.date))
                : (() => { const d = new Date(release.date); d.setHours(0,0,0,0); return d; })();
            if (releaseDate > lastTargetDate) return;

            // Filter out 4-star characters
            const fiveStarChars = (release.characters || []).filter(charName => {
                const charData = window.characterData?.[charName];
                return charData && charData.rarity !== 4;
            });
            const firstCharName = fiveStarChars.length > 0 ? fiveStarChars[0] : null;
            if (!firstCharName) return;

            const income = this.calculateCharacterIncome(release.date, release.version, null, firstCharName);
            if (!income || !income.interval || !income.interval.endDate) return;

            // Once income at start date
            if ((income.totalIncomeOnceEquivalent || 0) > 0) {
                const onceDate = (currentRelease && release.date === currentRelease.date && String(release.version) === String(currentRelease.version))
                    ? new Date(today)
                    : new Date(releaseDate);
                events.push({
                    date: onceDate,
                    type: 'income',
                    amount: income.totalIncomeOnceEquivalent,
                    label: this.getCharacterName(firstCharName),
                    charName: firstCharName
                });
            }

            // Interval income at end date
            const endDate = (typeof this.parseYMD === 'function')
                ? this.normalizeDate(this.parseYMD(income.interval.endDate))
                : (() => { const d = new Date(income.interval.endDate); d.setHours(0,0,0,0); return d; })();
            if (endDate <= lastTargetDate) {
                events.push({
                    date: endDate,
                    type: 'income',
                    amount: income.totalIncomeRecurringEquivalent || income.totalIncome,
                    label: this.getCharacterName(firstCharName),
                    charName: firstCharName
                });
            }
        });

        // Add all targets as expense events
        sortedTargets.forEach(target => {
            const targetDate = (typeof this.parseYMD === 'function')
                ? this.normalizeDate(this.parseYMD(target.date))
                : (() => { const d = new Date(target.date); d.setHours(0,0,0,0); return d; })();
            const extraPurchase = (target.extraEmber || 0) + (target.extraTicket || 0) * 150 + (target.extraWeaponTicket || 0) * 100;
            events.push({ 
                date: targetDate, 
                type: 'expense', 
                amount: target.cost - extraPurchase, 
                label: this.getCharacterName(target.name),
                charName: target.name,
                characterTarget: target.characterTarget,
                weaponTarget: target.weaponTarget
            });
        });

        events.sort((a, b) => a.date - b.date);
        if (events.length === 0) { this.balanceHistory = []; return; }

        const lastEvent = events[events.length - 1];

        // Always start from today
        let currentDate = new Date(today);
        let eventIndex = 0;

        // Apply events on "today" before pushing the starting point (so Once-on-today is reflected)
        let todayLabels = [];
        while (eventIndex < events.length && events[eventIndex].date.getTime() === currentDate.getTime()) {
            const event = events[eventIndex];
            if (event.type === 'income') currentBalance += event.amount;
            else if (event.type === 'expense') currentBalance -= event.amount;
            if (event.label) todayLabels.push(event.label);
            eventIndex++;
        }

        // Add starting point (today)
        const startLabel = todayLabels.length > 0 ? todayLabels.join(', ') : this.t('today');
        history.push({ date: new Date(currentDate), balance: currentBalance, label: startLabel });

        // Process all future dates from today to last event
        // Note: Daily income is already included in character card income events, so we don't add it daily
        while (currentDate < lastEvent.date) {
            currentDate.setDate(currentDate.getDate() + 1);

            // Process all events on this date
            let hasEvent = false;
            let eventLabels = [];
            let charNames = [];
            let targetInfo = []; // Store target info: { charName, characterTarget, weaponTarget }
            let hasTarget = false;
            while (eventIndex < events.length && events[eventIndex].date.getTime() === currentDate.getTime()) {
                const event = events[eventIndex];
                if (event.type === 'income') currentBalance += event.amount;
                else if (event.type === 'expense') {
                    currentBalance -= event.amount;
                    hasTarget = true;
                    // Store target info for graph pins
                    if (event.charName) {
                        targetInfo.push({
                            charName: event.charName,
                            characterTarget: event.characterTarget,
                            weaponTarget: event.weaponTarget
                        });
                    }
                }
                eventLabels.push(event.label);
                if (event.charName) {
                    charNames.push(event.charName);
                }
                hasEvent = true;
                eventIndex++;
            }

            // Only add one history entry per date, but keep the graph uncluttered:
            // - Always keep today (starting point)
            // - Only keep target (expense) dates afterwards
            // This prevents extra nodes for "income-only" dates (interval ends).
            if (hasEvent && hasTarget) {
                // Deduplicate labels and charNames (same character can appear multiple times on same date)
                const uniqueLabels = [...new Set(eventLabels)].filter(Boolean);
                const uniqueCharNames = [...new Set(charNames)].filter(Boolean);
                history.push({
                    date: new Date(currentDate),
                    balance: currentBalance,
                    label: uniqueLabels.join(', '),
                    charNames: uniqueCharNames,
                    targetInfo: targetInfo, // Store target info for rendering pins
                    isTarget: hasTarget
                });
            }
        }

        this.balanceHistory = history;
        console.log('[Graph] balanceHistory calculated:', history.length, 'entries');
    };

    /**
     * Render the balance chart
     */
    PullSimulator.prototype.renderChart = function() {
        console.log('[Graph] renderChart called');
        const canvas = document.getElementById('balanceChart');
        const emptyEl = document.getElementById('chartEmpty');
        if (!canvas) {
            console.warn('[Graph] Canvas element not found');
            return;
        }

        if (!this.balanceHistory || this.balanceHistory.length === 0) {
            console.log('[Graph] No balanceHistory, hiding chart');
            if (emptyEl) emptyEl.style.display = 'flex';
            if (this.chart) { this.chart.destroy(); this.chart = null; }
            return;
        }
        
        console.log('[Graph] Rendering chart with', this.balanceHistory.length, 'data points');

        if (emptyEl) emptyEl.style.display = 'none';

        const ctx = canvas.getContext('2d');
        const labels = this.balanceHistory.map(h => this.formatDateShort(h.date));
        
        // Use single dataset instead of splitting into positive/negative
        // This ensures smooth curve connection and prevents connection bugs
        const allData = this.balanceHistory.map(h => h.balance);

        if (this.chart) this.chart.destroy();

        // Preload character and weapon images for pins
        const BASE_URL = (typeof window.BASE_URL !== 'undefined') ? window.BASE_URL : '';
        const imageCache = new Map();
        const loadImage = (charName) => {
            if (!charName) return Promise.resolve(null);
            if (imageCache.has(charName)) {
                return Promise.resolve(imageCache.get(charName));
            }
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    imageCache.set(charName, img);
                    resolve(img);
                };
                img.onerror = () => {
                    // Fallback to skeleton image
                    const fallback = new Image();
                    fallback.crossOrigin = 'anonymous';
                    fallback.onload = () => {
                        imageCache.set(charName, fallback);
                        resolve(fallback);
                    };
                    fallback.onerror = () => {
                        imageCache.set(charName, null);
                        resolve(null);
                    };
                    fallback.src = `${BASE_URL}/assets/img/character-cards/card_skeleton.webp`;
                };
                img.src = `${BASE_URL}/assets/img/tier/${charName}.webp`;
            });
        };
        
        const loadAwakeningIcon = (level) => {
            const iconKey = `a${level}`;
            if (imageCache.has(iconKey)) {
                return Promise.resolve(imageCache.get(iconKey));
            }
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    imageCache.set(iconKey, img);
                    resolve(img);
                };
                img.onerror = () => {
                    imageCache.set(iconKey, null);
                    resolve(null);
                };
                img.src = `${BASE_URL}/assets/img/ritual/a${level}.png`;
            });
        };
        
        const loadRefinementIcon = (level) => {
            const iconKey = `r${level}`;
            if (imageCache.has(iconKey)) {
                return Promise.resolve(imageCache.get(iconKey));
            }
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    imageCache.set(iconKey, img);
                    resolve(img);
                };
                img.onerror = () => {
                    imageCache.set(iconKey, null);
                    resolve(null);
                };
                img.src = `${BASE_URL}/assets/img/ritual/r${level}.png`;
            });
        };

        // Collect all character names and icons that need to be loaded
        const charNamesToLoad = new Set();
        const awakeningLevelsToLoad = new Set();
        const refinementLevelsToLoad = new Set();
        this.balanceHistory.forEach(h => {
            if (h.targetInfo && Array.isArray(h.targetInfo) && h.targetInfo.length > 0) {
                h.targetInfo.forEach(target => {
                    if (target.charName) {
                        charNamesToLoad.add(target.charName);
                    }
                    // Load awakening icon (A0~A6)
                    if (target.characterTarget !== undefined) {
                        const awakeningLevel = target.characterTarget.replace('A', '').toLowerCase();
                        awakeningLevelsToLoad.add(awakeningLevel);
                    }
                    // Load refinement icon (R0~R6) if weaponTarget is set and not None
                    if (target.weaponTarget !== undefined && target.weaponTarget !== -1) {
                        const refinementLevel = target.weaponTarget.replace('R', '').toLowerCase();
                        refinementLevelsToLoad.add(refinementLevel);
                    }
                });
            }
            // Also load from charNames for backward compatibility
            if (h.charNames && h.charNames.length > 0) {
                h.charNames.forEach(name => charNamesToLoad.add(name));
            }
        });
        
        // If no images to load, create chart immediately
        if (charNamesToLoad.size === 0 && awakeningLevelsToLoad.size === 0 && refinementLevelsToLoad.size === 0) {
            console.log('[Graph] No images to load, creating chart immediately');
            this.createChartWithImages(ctx, labels, allData, imageCache, BASE_URL);
        } else {
            console.log('[Graph] Loading', charNamesToLoad.size, 'character images,', awakeningLevelsToLoad.size, 'awakening icons, and', refinementLevelsToLoad.size, 'refinement icons');
            const charPromises = Array.from(charNamesToLoad).map(name => loadImage(name));
            const awakeningPromises = Array.from(awakeningLevelsToLoad).map(level => loadAwakeningIcon(level));
            const refinementPromises = Array.from(refinementLevelsToLoad).map(level => loadRefinementIcon(level));
            Promise.all([...charPromises, ...awakeningPromises, ...refinementPromises]).then(() => {
                // Images loaded, continue with chart creation
                console.log('[Graph] All images loaded, creating chart');
                this.createChartWithImages(ctx, labels, allData, imageCache, BASE_URL);
            }).catch(() => {
                // Even if some images fail, create chart anyway
                console.log('[Graph] Some images failed to load, creating chart anyway');
                this.createChartWithImages(ctx, labels, allData, imageCache, BASE_URL);
            });
        }
    };

    /**
     * Create chart with character image pins using single dataset with gradient
     */
    PullSimulator.prototype.createChartWithImages = function(ctx, labels, allData, imageCache, BASE_URL) {
        const balanceHistory = this.balanceHistory; // Capture for closure
        const self = this; // Capture this for callbacks
        
        // Debug: Check if balanceHistory is available
        if (!balanceHistory) {
            console.error('[Graph] balanceHistory is not available in createChartWithImages');
            return;
        }
        
        console.log('[Graph] createChartWithImages called, creating Chart.js instance');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Balance',
                    data: allData,
                    borderWidth: 2,
                    tension: 0.4, // Smooth curve
                    pointRadius: balanceHistory.map((h, i) => {
                        return h.isTarget ? 4 : 2;
                    }),
                    pointBackgroundColor: balanceHistory.map((h, i) => {
                        const value = allData[i];
                        if (value >= 0) {
                            return h.isTarget ? '#7dda7d' : 'rgba(125, 218, 125, 0.5)';
                        } else {
                            return h.isTarget ? '#ff6464' : 'rgba(255, 100, 100, 0.5)';
                        }
                    }),
                    pointHoverRadius: 6,
                    // Border color using gradient function
                    borderColor: function(context) {
                        const chart = context.chart;
                        const { chartArea, scales } = chart;
                        if (!chartArea) return 'rgba(125, 218, 125, 1)';
                        return getGradient(ctx, chartArea, scales);
                    },
                    // Fill with different colors above/below 0
                    fill: {
                        target: 'origin',
                        above: 'rgba(125, 218, 125, 0.15)', // Green when above 0
                        below: 'rgba(255, 100, 100, 0.25)'  // Red when below 0
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'rgba(255, 255, 255, 0.9)',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            title: (items) => {
                                const h = balanceHistory[items[0].dataIndex];
                                return h.label || self.formatDateShort(h.date);
                            },
                            label: (item) => {
                                const value = balanceHistory[item.dataIndex].balance;
                                const status = value >= 0 ? self.t('safe') : self.t('shortage');
                                return `${status}: ${self.formatNumber(value)}`;
                            }
                        }
                    },
                    characterImagePlugin: {
                        balanceHistory: balanceHistory,
                        imageCache: imageCache
                    }
                },
                animation: {
                    duration: 0 // Disable animation to prevent flickering
                },
                layout: {
                    padding: {
                        top: 30 // Add padding at top for character images
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.5)', maxRotation: 0, autoSkip: true, maxTicksLimit: 10 }
                    },
                    y: {
                        grid: {
                            color: (context) => {
                                // Make 0 line more visible
                                if (context.tick.value === 0) return 'rgba(255, 255, 255, 0.5)';
                                return 'rgba(255, 255, 255, 0.05)';
                            }
                        },
                        ticks: { color: 'rgba(255, 255, 255, 0.5)', callback: (v) => self.formatNumber(v) },
                        beginAtZero: false,
                        afterDataLimits: (scale) => {
                            // Ensure 0 is always visible on y-axis
                            if (scale.min > 0) scale.min = 0;
                            if (scale.max < 0) scale.max = 0;
                        }
                    }
                }
            }
        });
        
        console.log('[Graph] Chart.js instance created, chart object:', this.chart);
    };

})();
