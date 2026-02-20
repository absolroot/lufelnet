(function () {
    'use strict';

    const STAT_ID_BY_CANONICAL = {
        'HP': 242,
        'HP %': 243,
        'Attack': 262,
        'Attack %': 263,
        'Defense': 272,
        'Defense %': 273,
        'Crit Rate': 281,
        'Crit Mult.': 291,
        'Ailment Accuracy': 301,
        'Speed': 341,
        'SP Recovery': 361,
        'Pierce Rate': 371,
        'Attack Mult.': 411,
        'Damage Mult.': 411,
        'Damage Mult': 411
    };

    const PERCENT_STATS = new Set([
        'Crit Rate',
        'Crit Mult.',
        'Pierce Rate',
        'Attack Mult.',
        'Damage Mult.',
        'Damage Mult',
        'Attack %',
        'HP %',
        'Defense %',
        'Ailment Accuracy',
        'SP Recovery',
        'Healing Effect'
    ]);

    const DISPLAY_ROUNDING_MODES = ['floor1', 'round1', 'ceil1', 'floor0', 'round0', 'ceil0'];
    const SUMMARY_ORDER = [
        'Attack', 'Attack %', 'Defense', 'Defense %', 'HP', 'HP %', 'Speed',
        'Crit Rate', 'Crit Mult.', 'Attack Mult.', 'Pierce Rate', 'SP Recovery', 'Ailment Accuracy', 'Healing Effect'
    ];

    function parseNumeric(raw) {
        const cleaned = String(raw || '').replace(/[^0-9.\-]/g, '');
        const value = Number.parseFloat(cleaned);
        return Number.isFinite(value) ? value : NaN;
    }

    function applyRoundingMode(value, mode) {
        if (!Number.isFinite(value)) return 0;
        if (mode === 'floor1') return Math.floor(value * 10) / 10;
        if (mode === 'round1') return Math.round(value * 10) / 10;
        if (mode === 'ceil1') return Math.ceil(value * 10) / 10;
        if (mode === 'floor0') return Math.floor(value);
        if (mode === 'round0') return Math.round(value);
        if (mode === 'ceil0') return Math.ceil(value);
        return value;
    }

    function buildCompositions(totalRolls) {
        const out = [];
        const n = Math.max(0, Number(totalRolls) || 0);

        for (let c5 = n; c5 >= 0; c5 -= 1) {
            for (let c4 = n - c5; c4 >= 0; c4 -= 1) {
                for (let c3 = n - c5 - c4; c3 >= 0; c3 -= 1) {
                    for (let c2 = n - c5 - c4 - c3; c2 >= 0; c2 -= 1) {
                        const c1 = n - c5 - c4 - c3 - c2;
                        out.push([c5, c4, c3, c2, c1]);
                    }
                }
            }
        }
        return out;
    }

    function weightedCounts(counts) {
        // Greedy tie-breaker: prioritize higher tier counts (5 -> 1).
        return (counts[0] * 100000)
            + (counts[1] * 10000)
            + (counts[2] * 1000)
            + (counts[3] * 100)
            + (counts[4] * 10);
    }

    function getTotalRolls(upgradeCount) {
        const upgrades = Math.max(0, Number(upgradeCount) || 0);
        // Base roll is always included.
        return 1 + upgrades;
    }

    function createController(deps) {
        const d = deps || {};
        let cardSubstats = null;
        let loaded = false;
        let rowSortMode = 'count';

        function getCardTypeKey(slotId) {
            return String(slotId || '') === 'uni' ? 'card_type_0' : 'card_type_1';
        }

        function getCardTypeData(slotId) {
            if (!cardSubstats || !cardSubstats.card_types) return null;
            return cardSubstats.card_types[getCardTypeKey(slotId)] || null;
        }

        function getTierRawValues(slotId, canonicalKey) {
            const statId = STAT_ID_BY_CANONICAL[String(canonicalKey || '').trim()];
            if (!statId) return null;
            const typeData = getCardTypeData(slotId);
            if (!typeData || !Array.isArray(typeData.stats)) return null;
            const row = typeData.stats.find((item) => Number(item && item.id) === Number(statId));
            if (!row || !Array.isArray(row.values) || row.values.length < 5) return null;
            return row.values.slice(0, 5).map((v) => Number(v));
        }

        function getTierDisplayValuesFromStatsData(slotId, canonicalKey) {
            const statsData = d.getStatsData ? d.getStatsData() : null;
            if (!statsData || !statsData.sub_stats) return null;
            const group = String(slotId || '') === 'uni' ? 'universe' : 'universal';
            const rows = Array.isArray(statsData.sub_stats[group]) ? statsData.sub_stats[group] : [];
            const row = rows.find((item) => String(item && item[0] || '').trim() === String(canonicalKey || '').trim());
            if (!row) return null;
            const values = row.slice(1, 6).map((value) => parseNumeric(value));
            if (values.some((v) => !Number.isFinite(v))) return null;
            return values;
        }

        function buildMixedRollCandidates(totalRolls) {
            const n = Math.max(0, Number(totalRolls) || 0);
            const categoryCount = 10; // 5 tiers x 2 sources(card/stats)
            const out = [];
            const counts = new Array(categoryCount).fill(0);

            function walk(index, remain) {
                if (index === categoryCount - 1) {
                    counts[index] = remain;
                    out.push(counts.slice());
                    return;
                }
                for (let v = 0; v <= remain; v += 1) {
                    counts[index] = v;
                    walk(index + 1, remain - v);
                }
            }

            walk(0, n);
            return out;
        }

        function scoreMixedCandidate(candidate, observedDisplay, isPercent, tierCardRaw, tierStatsDisplay) {
            const observedRaw = isPercent ? (observedDisplay / 100) : observedDisplay;

            // category index map:
            // 0..4 => S/A/B/C/D with card source
            // 5..9 => S/A/B/C/D with stats source
            let rawSum = 0;
            let displaySum = 0;
            let cardRolls = 0;
            const tierCounts = [0, 0, 0, 0, 0];

            for (let i = 0; i < 5; i += 1) {
                const cardCount = Number(candidate[i] || 0);
                const statsCount = Number(candidate[i + 5] || 0);
                const total = cardCount + statsCount;
                tierCounts[i] = total;
                cardRolls += cardCount;

                const cardRaw = Number(tierCardRaw[i] || 0);
                const statsDisplay = Number(tierStatsDisplay[i] || 0);
                const statsRaw = isPercent ? (statsDisplay / 100) : statsDisplay;

                rawSum += (cardCount * cardRaw) + (statsCount * statsRaw);
                displaySum += (cardCount * (isPercent ? (cardRaw * 100) : cardRaw)) + (statsCount * statsDisplay);
            }

            const rawError = Math.abs(rawSum - observedRaw);
            const displayError = Math.abs(displaySum - observedDisplay);
            const tierWeight = weightedCounts(tierCounts);

            return {
                candidate,
                counts: tierCounts,
                rawError,
                displayError,
                tierWeight,
                cardRolls
            };
        }

        function chooseBestMixedCandidate(scored) {
            const EPS = 1e-12;
            let best = null;
            scored.forEach((item) => {
                if (!best) {
                    best = item;
                    return;
                }

                if (item.rawError < best.rawError - EPS) {
                    best = item;
                    return;
                }
                if (Math.abs(item.rawError - best.rawError) > EPS) return;

                if (item.displayError < best.displayError - EPS) {
                    best = item;
                    return;
                }
                if (Math.abs(item.displayError - best.displayError) > EPS) return;

                if (item.tierWeight > best.tierWeight) {
                    best = item;
                    return;
                }
                if (item.tierWeight < best.tierWeight) return;

                if (item.cardRolls > best.cardRolls) {
                    best = item;
                }
            });
            return best;
        }

        function inferSingleRow(slotId, optionName, valueText, upgradeCount) {
            const canonical = d.toCanonicalStatKey ? d.toCanonicalStatKey(optionName) : String(optionName || '').trim();
            if (!canonical) return null;

            const observedDisplay = parseNumeric(valueText);
            if (!Number.isFinite(observedDisplay)) return null;

            const isPercent = PERCENT_STATS.has(canonical) || String(valueText || '').includes('%');
            const totalRolls = getTotalRolls(upgradeCount);
            const rawValues = getTierRawValues(slotId, canonical);
            const statsDisplayValues = getTierDisplayValuesFromStatsData(slotId, canonical);
            if (!rawValues || !statsDisplayValues) return null;

            const candidates = buildMixedRollCandidates(totalRolls);
            const scored = candidates.map((candidate) => scoreMixedCandidate(
                candidate,
                observedDisplay,
                isPercent,
                rawValues,
                statsDisplayValues
            ));
            const chosen = chooseBestMixedCandidate(scored);
            if (!chosen || !Array.isArray(chosen.counts)) return null;

            let confidence = 'high';
            if (Number(chosen.displayError || 0) > 0.21 || Number(chosen.rawError || 0) > (isPercent ? 0.0012 : 0.25)) {
                confidence = 'low';
            } else if (Number(chosen.displayError || 0) > 0.11) {
                confidence = 'medium';
            }

            return {
                canonical,
                counts: chosen.counts.slice(0, 5),
                confidence
            };
        }

        function load() {
            if (loaded) return Promise.resolve(true);

            const baseUrl = String(d.baseUrl || '').replace(/\/+$/, '');
            const version = String(d.version || '');
            const url = `${baseUrl}/apps/revelation-setting/revelation-card-substats.json${version}`;

            return fetch(url, { cache: 'no-cache' })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to load tier data: ${response.status}`);
                    }
                    return response.json();
                })
                .then((json) => {
                    cardSubstats = json || {};
                    loaded = true;
                    return true;
                })
                .catch((error) => {
                    console.warn('[revelation-setting] tier estimator load failed:', error);
                    cardSubstats = null;
                    loaded = false;
                    return false;
                });
        }

        function buildSummaryEstimate(state) {
            if (!loaded || !cardSubstats || !state || !state.slots) return null;

            const summaryMap = {};

            Object.keys(state.slots).forEach((slotId) => {
                const slot = state.slots[slotId];
                if (!slot || !Array.isArray(slot.subs)) return;

                slot.subs.forEach((sub) => {
                    const option = String(sub && sub.option || '').trim();
                    const value = String(sub && sub.value || '').trim();
                    if (!option || !value) return;

                    const upgrades = d.parseUpgradeValue ? d.parseUpgradeValue(sub.upgrades) : 0;
                    const inferred = inferSingleRow(slotId, option, value, upgrades);
                    if (!inferred) return;

                    if (!summaryMap[inferred.canonical]) {
                        summaryMap[inferred.canonical] = {
                            counts: [0, 0, 0, 0, 0],
                            lowConfidence: false
                        };
                    }
                    for (let i = 0; i < 5; i += 1) {
                        summaryMap[inferred.canonical].counts[i] += Number(inferred.counts[i] || 0);
                    }
                    if (inferred.confidence === 'low') {
                        summaryMap[inferred.canonical].lowConfidence = true;
                    }
                });
            });

            const rows = SUMMARY_ORDER
                .filter((key) => summaryMap[key])
                .map((key) => ({
                    key,
                    counts: summaryMap[key].counts,
                    lowConfidence: summaryMap[key].lowConfidence
                }));

            return rows.length ? { rows } : null;
        }

        function renderInto(containerEl, estimateData, options) {
            if (!containerEl) return;
            const opts = options || {};
            const escapeHtml = opts.escapeHtml || ((v) => String(v == null ? '' : v));
            const t = opts.t || ((_, fallback) => fallback || '');
            const getStatIconPath = opts.getStatIconPath || (() => '');
            const translateSubStatOption = opts.translateSubStatOption || ((raw) => raw);
            const minimumStatTargetSet = opts.minimumStatTargetSet;
            const isMinimumTargetStat = (typeof opts.isMinimumTargetStat === 'function')
                ? opts.isMinimumTargetStat
                : ((key) => !!(minimumStatTargetSet && typeof minimumStatTargetSet.has === 'function' && minimumStatTargetSet.has(key)));
            const statTotals = opts.statTotals || {};
            const mainTotals = opts.mainTotals || {};
            const subTotals = opts.subTotals || {};

            const prev = containerEl.querySelector('.rs-tier-card');
            if (prev) prev.remove();

            const titleText = t('summary_tier_estimation_title', 'Sub Stat Tier Estimation');
            const tooltipText = t(
                'summary_tier_estimation_tooltip',
                'Estimated from card sub-stat values first, then adjusted by in-game display values when needed. If multiple solutions exist, higher tiers are preferred.'
            );
            const lowConfidenceMark = t('summary_tier_low_confidence', 'low confidence');
            const colStat = t('summary_tier_table_stat', 'Stat');
            const colValueMain = t('summary_tier_table_main_value', 'Main');
            const colValueSub = t('summary_tier_table_sub_value', 'Sub');
            const colValueSum = t('summary_tier_table_sum_value', 'Sum');
            const colTotal = t('summary_tier_table_total', 'Total');
            const sortByCountLabel = t('summary_tier_sort_count', 'By Count');
            const sortByStatLabel = t('summary_tier_sort_stat', 'By Stat');
            const sortAriaLabel = t('summary_tier_sort_aria', 'Sort rows');

            const tooltipIconSvg = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">'
                + '<circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>'
                + '<path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>'
                + '</svg>';
            const sortIconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
                + '<path d="M8 3V21M8 3L5 6M8 3L11 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
                + '<path d="M16 21V3M16 21L13 18M16 21L19 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
                + '</svg>';

            const estimateRows = (estimateData && Array.isArray(estimateData.rows)) ? estimateData.rows : [];
            const estimateRowMap = {};
            estimateRows.forEach((row) => {
                const key = String(row && row.key || '').trim();
                if (!key) return;
                estimateRowMap[key] = row;
            });

            const extraKeys = Object.keys(statTotals)
                .concat(Object.keys(mainTotals))
                .concat(Object.keys(subTotals))
                .filter((key, idx, arr) => arr.indexOf(key) === idx)
                .filter((key) => SUMMARY_ORDER.indexOf(key) === -1)
                .filter((key) => {
                    const totalInfo = statTotals[key];
                    const mainInfo = mainTotals[key];
                    const subInfo = subTotals[key];
                    const totalValue = Number(totalInfo && totalInfo.value || 0);
                    const mainValue = Number(mainInfo && mainInfo.value || 0);
                    const subValue = Number(subInfo && subInfo.value || 0);
                    return Math.abs(totalValue) >= 0.000001
                        || Math.abs(mainValue) >= 0.000001
                        || Math.abs(subValue) >= 0.000001;
                });

            const orderedKeys = SUMMARY_ORDER.concat(extraKeys);
            const keyOrderMap = {};
            orderedKeys.forEach((key, index) => {
                keyOrderMap[key] = index;
            });
            const displayRows = orderedKeys
                .filter((key) => {
                    if (estimateRowMap[key]) return true;
                    const totalInfo = statTotals[key];
                    const mainInfo = mainTotals[key];
                    const subInfo = subTotals[key];
                    const totalValue = Number(totalInfo && totalInfo.value || 0);
                    const mainValue = Number(mainInfo && mainInfo.value || 0);
                    const subValue = Number(subInfo && subInfo.value || 0);
                    return Math.abs(totalValue) >= 0.000001
                        || Math.abs(mainValue) >= 0.000001
                        || Math.abs(subValue) >= 0.000001;
                })
                .map((key) => {
                    const fromEstimate = estimateRowMap[key];
                    return {
                        key,
                        counts: fromEstimate && Array.isArray(fromEstimate.counts) ? fromEstimate.counts : [0, 0, 0, 0, 0],
                        lowConfidence: !!(fromEstimate && fromEstimate.lowConfidence)
                    };
                });

            function getTotalCount(row) {
                const counts = (row && Array.isArray(row.counts)) ? row.counts : [0, 0, 0, 0, 0];
                return counts.reduce((sum, n) => sum + Number(n || 0), 0);
            }

            function compareByCountThenTier(a, b) {
                const totalA = getTotalCount(a);
                const totalB = getTotalCount(b);
                if (totalA !== totalB) return totalB - totalA;

                for (let i = 0; i < 5; i += 1) {
                    const diff = Number((b.counts && b.counts[i]) || 0) - Number((a.counts && a.counts[i]) || 0);
                    if (diff !== 0) return diff;
                }

                return Number(keyOrderMap[a.key] || 0) - Number(keyOrderMap[b.key] || 0);
            }

            function compareByStatOrder(a, b) {
                return Number(keyOrderMap[a.key] || 0) - Number(keyOrderMap[b.key] || 0);
            }

            // Minimum-stat targets are always pinned above others.
            // Within each group, apply the currently selected sort mode.
            const activeComparator = (rowSortMode === 'stat')
                ? compareByStatOrder
                : compareByCountThenTier;
            const minimumRows = [];
            const normalRows = [];
            displayRows.forEach((row) => {
                if (isMinimumTargetStat(row && row.key)) {
                    minimumRows.push(row);
                } else {
                    normalRows.push(row);
                }
            });
            minimumRows.sort(activeComparator);
            normalRows.sort(activeComparator);
            const sortedRows = minimumRows.concat(normalRows);

            if (!sortedRows.length) {
                containerEl.hidden = true;
                return;
            }

            const rowsHtml = sortedRows.map((row) => {
                const icon = getStatIconPath(row.key);
                const label = translateSubStatOption(row.key);
                const isMinimumTarget = !!isMinimumTargetStat(row.key);
                const counts = row.counts || [0, 0, 0, 0, 0];
                const total = counts.reduce((sum, n) => sum + Number(n || 0), 0);
                const mainInfo = mainTotals[row.key] || { value: 0, isPercent: PERCENT_STATS.has(row.key) };
                const subInfo = subTotals[row.key] || { value: 0, isPercent: PERCENT_STATS.has(row.key) };
                const sumInfo = statTotals[row.key] || { value: 0, isPercent: PERCENT_STATS.has(row.key) };

                function formatValue(info) {
                    const numeric = Number(info && info.value || 0);
                    const isPercent = !!(info && info.isPercent);
                    if (Math.abs(numeric) < 0.000001) {
                        return isPercent ? '0%' : '0';
                    }

                    if (isPercent) {
                        return (Math.round(numeric * 100) / 100) + '%';
                    }

                    const roundedInt = Math.round(numeric);
                    if (Math.abs(numeric - roundedInt) < 0.000001) {
                        return String(roundedInt);
                    }
                    return String(Math.round(numeric * 10) / 10);
                }

                const mainDisplay = formatValue(mainInfo);
                const subDisplay = formatValue(subInfo);
                const sumDisplay = formatValue(sumInfo);
                const mainIsZero = Math.abs(Number(mainInfo && mainInfo.value || 0)) < 0.000001;
                const subIsZero = Math.abs(Number(subInfo && subInfo.value || 0)) < 0.000001;
                const sumIsZero = Math.abs(Number(sumInfo && sumInfo.value || 0)) < 0.000001;

                function tdNum(value, extraClass) {
                    const n = Number(value || 0);
                    const cls = 'rs-tier-td rs-tier-td-num' + (n === 0 ? ' is-zero' : '') + (extraClass ? (' ' + extraClass) : '');
                    return '<td class="' + cls + '">' + escapeHtml(String(n)) + '</td>';
                }

                return '<tr class="rs-tier-tr' + (row.lowConfidence ? ' is-low-confidence' : '') + (isMinimumTarget ? ' rs-tier-tr-minstat' : '') + '">'
                    + '<td class="rs-tier-td rs-tier-td-stat">'
                    + '<span class="rs-tier-label">'
                    + (icon ? `<img class="rs-summary-icon" src="${escapeHtml(icon)}" alt="">` : '')
                    + '<span>' + escapeHtml(label) + '</span>'
                    + (row.lowConfidence ? `<em class="rs-tier-low-confidence">(${escapeHtml(lowConfidenceMark)})</em>` : '')
                    + '</span>'
                    + '</td>'
                    + '<td class="rs-tier-td rs-tier-td-value rs-tier-td-value-sum' + (sumIsZero ? ' is-zero' : '') + '">' + escapeHtml(sumDisplay) + '</td>'
                    + '<td class="rs-tier-td rs-tier-td-value rs-tier-td-value-main' + (mainIsZero ? ' is-zero' : '') + '">' + escapeHtml(mainDisplay) + '</td>'
                    + '<td class="rs-tier-td rs-tier-td-value rs-tier-td-value-sub' + (subIsZero ? ' is-zero' : '') + '">' + escapeHtml(subDisplay) + '</td>'
                    + '<td class="rs-tier-td rs-tier-td-total' + (total === 0 ? ' is-zero' : '') + (total > 0 && total < 5 ? ' is-under-five' : '') + '">' + escapeHtml(String(total)) + '</td>'
                    + tdNum(counts[0], 'rs-tier-td-s')
                    + tdNum(counts[1], '')
                    + tdNum(counts[2], '')
                    + tdNum(counts[3], '')
                    + tdNum(counts[4], '')
                    + '</tr>';
            }).join('');

            const wrapper = document.createElement('div');
            wrapper.className = 'rs-tier-card';
            const currentSortLabel = rowSortMode === 'stat' ? sortByStatLabel : sortByCountLabel;
            wrapper.innerHTML = `<div class="rs-tier-card-head">`
                + '<div class="rs-tier-card-head-left">'
                + `<h4 class="rs-tier-card-title">${escapeHtml(titleText)}</h4>`
                + `<span class="tooltip-icon rs-tier-tooltip-icon" data-tooltip="${escapeHtml(tooltipText)}" aria-label="${escapeHtml(tooltipText)}">${tooltipIconSvg}</span>`
                + '</div>'
                + `<div class="rs-tier-card-tools" role="group" aria-label="${escapeHtml(sortAriaLabel)}">`
                + `<button type="button" id="rsTierSortToggle" class="rs-tier-sort-toggle" aria-label="${escapeHtml(sortAriaLabel)}">`
                + `<span class="rs-tier-sort-icon" aria-hidden="true">${sortIconSvg}</span>`
                + `<span class="rs-tier-sort-text">${escapeHtml(currentSortLabel)}</span>`
                + '</button>'
                + '</div>'
                + `</div>`
                + '<div class="rs-tier-table-wrap">'
                + '<table class="rs-tier-table">'
                + '<thead><tr>'
                + `<th>${escapeHtml(colStat)}</th>`
                + `<th>${escapeHtml(colValueSum)}</th>`
                + `<th>${escapeHtml(colValueMain)}</th>`
                + `<th>${escapeHtml(colValueSub)}</th>`
                + `<th>${escapeHtml(colTotal)}</th>`
                + '<th>S</th><th>A</th><th>B</th><th>C</th><th>D</th>'
                + '</tr></thead>'
                + `<tbody>${rowsHtml}</tbody>`
                + '</table>'
                + '</div>';
            containerEl.appendChild(wrapper);
            containerEl.hidden = false;

            const sortToggle = wrapper.querySelector('#rsTierSortToggle');
            if (sortToggle) {
                sortToggle.addEventListener('click', function () {
                    rowSortMode = (rowSortMode === 'count') ? 'stat' : 'count';
                    renderInto(containerEl, estimateData, options);
                });
            }

            if (typeof window.bindTooltipElement === 'function') {
                const icon = wrapper.querySelector('.rs-tier-tooltip-icon');
                if (icon) window.bindTooltipElement(icon);
            } else {
                const icon = wrapper.querySelector('.rs-tier-tooltip-icon');
                const content = icon ? String(icon.getAttribute('data-tooltip') || '') : '';
                if (icon && content) {
                    const floating = document.getElementById('cursor-tooltip') || (function () {
                        const el = document.createElement('div');
                        el.id = 'cursor-tooltip';
                        el.className = 'cursor-tooltip';
                        document.body.appendChild(el);
                        return el;
                    })();
                    const move = function (e) {
                        const offset = 16;
                        let x = e.clientX + offset;
                        let y = e.clientY + offset;
                        const vw = window.innerWidth;
                        const vh = window.innerHeight;
                        const w = floating.offsetWidth;
                        const h = floating.offsetHeight;
                        if (x + w + 8 > vw) x = e.clientX - w - offset;
                        if (y + h + 8 > vh) y = e.clientY - h - offset;
                        floating.style.left = `${x}px`;
                        floating.style.top = `${y}px`;
                    };
                    icon.addEventListener('mouseenter', function (e) {
                        floating.innerHTML = content;
                        floating.style.display = 'block';
                        move(e);
                    });
                    icon.addEventListener('mousemove', move);
                    icon.addEventListener('mouseleave', function () {
                        floating.style.display = 'none';
                    });
                }
            }
        }

        return {
            load,
            buildSummaryEstimate,
            renderInto
        };
    }

    window.RevelationSettingTierEstimator = {
        createController
    };
})();
