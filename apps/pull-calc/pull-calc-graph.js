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
                // Check if this history entry has character names and is a target
                if (h.charNames && Array.isArray(h.charNames) && h.charNames.length > 0 && h.isTarget) {
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
                        
                        // Draw each character image
                        h.charNames.forEach((charName, idx) => {
                            if (!charName) return;
                            
                            const img = imageCache.get(charName);
                            if (img && img instanceof Image && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                                const imgSize = 24;
                                const spacing = 2;
                                const totalWidth = h.charNames.length * imgSize + (h.charNames.length - 1) * spacing;
                                const startX = x - totalWidth / 2;
                                const offsetX = startX + idx * (imgSize + spacing) + imgSize / 2;
                                const offsetY = y - imgSize - 6;
                                
                                ctx.save();
                                
                                // Draw circle background
                                ctx.beginPath();
                                ctx.arc(offsetX, offsetY, imgSize/2 + 2, 0, Math.PI * 2);
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                                ctx.fill();
                                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                                ctx.lineWidth = 1.5;
                                ctx.stroke();
                                
                                // Draw image with aspect ratio preserved
                                ctx.beginPath();
                                ctx.arc(offsetX, offsetY, imgSize/2, 0, Math.PI * 2);
                                ctx.clip();
                                
                                // Calculate image dimensions preserving aspect ratio
                                const imgAspect = img.naturalWidth / img.naturalHeight;
                                let drawWidth = imgSize;
                                let drawHeight = imgSize;
                                let drawX = offsetX - imgSize/2;
                                let drawY = offsetY - imgSize/2;
                                
                                if (imgAspect > 1) {
                                    // Image is wider than tall
                                    drawHeight = imgSize / imgAspect;
                                    drawY = offsetY - drawHeight / 2;
                                } else {
                                    // Image is taller than wide
                                    drawWidth = imgSize * imgAspect;
                                    drawX = offsetX - drawWidth / 2;
                                }
                                
                                ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                                ctx.restore();
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

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

        // Get all future character cards (same as timeline)
        const futureReleases = allReleases.filter(r => {
            const releaseDate = new Date(r.date);
            return releaseDate >= today;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Get last target date
        const sortedTargets = [...this.targets].sort((a, b) => new Date(a.date) - new Date(b.date));
        const lastTargetDate = sortedTargets.length > 0 ? new Date(sortedTargets[sortedTargets.length - 1].date) : today;
        lastTargetDate.setHours(0, 0, 0, 0);

        // Collect all character cards up to last target
        // Each character card adds its total income (daily + version + battle pass) on its release date
        let prevFutureDate = null;
        futureReleases.forEach(release => {
            const releaseDate = new Date(release.date);
            releaseDate.setHours(0, 0, 0, 0);
            if (releaseDate <= lastTargetDate) {
                // Filter out 4-star characters
                const fiveStarChars = (release.characters || []).filter(charName => {
                    const charData = window.characterData?.[charName];
                    return charData && charData.rarity !== 4;
                });

                fiveStarChars.forEach(charName => {
                    const income = this.calculateCharacterIncome(release.date, release.version, prevFutureDate);
                    const displayName = this.getCharacterName(charName);
                    // Add income event on character release date (includes daily income for days between prev and current)
                    events.push({ 
                        date: new Date(releaseDate), 
                        type: 'income', 
                        amount: income.totalIncome, 
                        label: displayName,
                        charName: charName
                    });
                    // Update prevDate for next character
                    prevFutureDate = release.date;
                });
            }
        });

        // Add all targets as expense events
        sortedTargets.forEach(target => {
            const targetDate = new Date(target.date);
            targetDate.setHours(0, 0, 0, 0);
            const extraPurchase = (target.extraEmber || 0) + (target.extraTicket || 0) * 150 + (target.extraWeaponTicket || 0) * 100;
            events.push({ 
                date: targetDate, 
                type: 'expense', 
                amount: target.cost - extraPurchase, 
                label: this.getCharacterName(target.name),
                charName: target.name
            });
        });

        events.sort((a, b) => a.date - b.date);
        if (events.length === 0) { this.balanceHistory = []; return; }

        const lastEvent = events[events.length - 1];

        // Always start from today
        let currentDate = new Date(today);
        let eventIndex = 0;

        // Add starting point (today)
        history.push({ date: new Date(currentDate), balance: currentBalance, label: this.t('today') });

        // Process all future dates from today to last event
        // Note: Daily income is already included in character card income events, so we don't add it daily
        while (currentDate < lastEvent.date) {
            currentDate.setDate(currentDate.getDate() + 1);

            // Process all events on this date
            let hasEvent = false;
            let eventLabels = [];
            let charNames = [];
            let hasTarget = false;
            while (eventIndex < events.length && events[eventIndex].date.getTime() === currentDate.getTime()) {
                const event = events[eventIndex];
                if (event.type === 'income') currentBalance += event.amount;
                else if (event.type === 'expense') {
                    currentBalance -= event.amount;
                    hasTarget = true;
                }
                eventLabels.push(event.label);
                if (event.charName) {
                    charNames.push(event.charName);
                }
                hasEvent = true;
                eventIndex++;
            }

            // Add only one history entry per date (combine all events on the same date)
            if (hasEvent) {
                // Deduplicate labels and charNames (same character can appear multiple times on same date)
                const uniqueLabels = [...new Set(eventLabels)].filter(Boolean);
                const uniqueCharNames = [...new Set(charNames)].filter(Boolean);
                history.push({
                    date: new Date(currentDate),
                    balance: currentBalance,
                    label: uniqueLabels.join(', '),
                    charNames: uniqueCharNames,
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

        // Preload character images for pins
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

        // Load all character images
        const charNamesToLoad = new Set();
        this.balanceHistory.forEach(h => {
            if (h.charNames && h.charNames.length > 0) {
                h.charNames.forEach(name => charNamesToLoad.add(name));
            }
        });
        
        // If no characters to load, create chart immediately
        if (charNamesToLoad.size === 0) {
            console.log('[Graph] No images to load, creating chart immediately');
            this.createChartWithImages(ctx, labels, allData, imageCache, BASE_URL);
        } else {
            console.log('[Graph] Loading', charNamesToLoad.size, 'character images');
            Promise.all(Array.from(charNamesToLoad).map(name => loadImage(name))).then(() => {
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
