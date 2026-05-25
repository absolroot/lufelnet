(function () {
  'use strict';

  const FILTER_TYPES = {
    all: null,
    domination: '지배',
    rebellion: '반항'
  };

  const MAIN_DEALER_TYPES = ['지배', '반항'];
  const PHASES = ['first', 'second'];
  const FUKA_KEY = '후카';
  const ADMIN_API_BASE = 'http://127.0.0.1:4174';
  const SCORE_UNIT_MULTIPLIERS = {
    eok: 1,
    man: 0.0001
  };

  const POSITION_LABELS = {
    kr: { 지배: '지배', 반항: '반항' },
    en: { 지배: 'Sweeper', 반항: 'Assassin' },
    jp: { 지배: '支配', 반항: '反抗' },
    cn: { 지배: '支配', 반항: '反抗' }
  };

  const PHASE_LABELS = {
    kr: { first: '전반', second: '후반' },
    en: { first: 'First Half', second: 'Second Half' },
    jp: { first: '前半', second: '後半' },
    cn: { first: '上半', second: '下半' }
  };

  const state = {
    filter: 'all',
    data: null,
    entries: [],
    chart: null,
    editMode: false,
    editPanel: null,
    editDraft: null,
    editBaseline: '',
    editFileHash: '',
    editConnected: false,
    editLoading: false,
    editSaving: false,
    editDirty: false,
    editError: '',
    editValidation: null,
    characters: [],
    releases: [],
    validateTimer: null,
    validateSeq: 0,
    editActiveEntryIndex: 0,
    editPicker: null
  };

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    await initI18n();
    updateStaticText();
    state.data = cloneData(window.InflationData || { unit: 'eok', entries: [] });
    state.entries = normalizeEntriesFromData(state.data);
    state.editMode = new URLSearchParams(window.location.search || '').get('edit') === '1';
    bindControls();
    if (state.editMode) {
      initEditMode();
    }
    render();
  }

  async function initI18n() {
    if (window.I18nService && typeof window.I18nService.init === 'function') {
      await window.I18nService.init('inflation');
    }
  }

  function t(key, fallback) {
    if (window.I18nService && typeof window.I18nService.t === 'function') {
      return window.I18nService.t(key, fallback || key);
    }
    return fallback || key;
  }

  function getLang() {
    if (window.I18nService && typeof window.I18nService.getCurrentLanguage === 'function') {
      return window.I18nService.getCurrentLanguage();
    }
    const pathLang = String(window.location.pathname || '').split('/')[1];
    if (['kr', 'en', 'jp', 'cn'].includes(pathLang)) return pathLang;
    return 'kr';
  }

  function updateStaticText() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = t(key, el.textContent || key);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (!key) return;
      el.setAttribute('aria-label', t(key, el.getAttribute('aria-label') || key));
    });
  }

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value == null ? null : value));
  }

  function normalizeEntriesFromData(data) {
    const rawEntries = Array.isArray(data?.entries) ? data.entries : [];
    const scheduleIndex = buildScheduleIndex(window.ReleaseScheduleData || {});

    return rawEntries
      .map((entry) => {
        const scheduleDate = scheduleIndex.get(makeScheduleKey(entry.version, entry.releasedCharacter)) || '';
        const releaseDate = String(entry.releaseDate || scheduleDate || '').trim();
        const teams = (Array.isArray(entry.teams) ? entry.teams : [])
          .map((team) => ({
            ...team,
            phase: team.phase || '',
            scoreEok: Number(team.scoreEok || 0),
            party: {
              slots: Array.isArray(team.party && team.party.slots) ? [...team.party.slots] : [],
              support: team.party ? team.party.support || '' : '',
              backup: team.party ? team.party.backup || '' : ''
            }
          }))
          .sort((a, b) => {
            const phaseDiff = PHASES.indexOf(a.phase) - PHASES.indexOf(b.phase);
            if (phaseDiff !== 0) return phaseDiff;
            return b.scoreEok - a.scoreEok;
          });

        return {
          ...entry,
          releaseDate,
          teams
        };
      })
      .sort((a, b) => compareVersion(a.version, b.version));
  }

  function makeScheduleKey(version, character) {
    return `${String(version || '').trim()}::${String(character || '').trim()}`;
  }

  function buildScheduleIndex(scheduleData) {
    const releases = parseScheduleReleases(scheduleData);
    const map = new Map();
    releases.forEach((release) => {
      (release.characters || []).forEach((character) => {
        map.set(makeScheduleKey(release.version, character), release.date || '');
      });
    });
    return map;
  }

  function parseScheduleReleases(scheduleData) {
    const releases = [];
    const beforeV4 = Number(scheduleData?.intervalRules?.beforeV4 || 14);

    (scheduleData.manualReleases || []).forEach((release) => {
      releases.push({
        version: release.version,
        date: release.fixedDate || release.date || '',
        characters: release.characters || [],
        days: release.days ?? beforeV4
      });
    });

    let lastDate = null;
    if (releases.length > 0) {
      const lastRelease = releases[releases.length - 1];
      lastDate = addDays(lastRelease.date, lastRelease.days);
    }

    (scheduleData.autoGenerateCharacters || []).forEach((release) => {
      const computedDate = lastDate ? toDateString(lastDate) : '';
      const releaseDate = release.fixedDate || release.date || computedDate;
      releases.push({
        version: release.version,
        date: releaseDate,
        characters: release.characters || [],
        days: release.days
      });

      const interval = Number(release.days || beforeV4);
      if (releaseDate) {
        lastDate = addDays(releaseDate, interval);
      }
    });

    return releases.filter((release) => release.date && Array.isArray(release.characters));
  }

  function addDays(dateString, days) {
    if (!dateString) return null;
    const parts = String(dateString).split('-').map(Number);
    if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return null;
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    date.setUTCDate(date.getUTCDate() + Number(days || 0));
    return date;
  }

  function toDateString(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  }

  function compareVersion(a, b) {
    const left = String(a || '').split('.').map((part) => Number(part) || 0);
    const right = String(b || '').split('.').map((part) => Number(part) || 0);
    const len = Math.max(left.length, right.length);
    for (let i = 0; i < len; i += 1) {
      const diff = (left[i] || 0) - (right[i] || 0);
      if (diff !== 0) return diff;
    }
    return String(a || '').localeCompare(String(b || ''), 'en');
  }

  function bindControls() {
    document.querySelectorAll('[data-inflation-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-inflation-filter') || 'all';
        if (!Object.prototype.hasOwnProperty.call(FILTER_TYPES, filter)) return;
        state.filter = filter;
        updateFilterButtons();
        render();
      });
    });
    updateFilterButtons();
  }

  function updateFilterButtons() {
    document.querySelectorAll('[data-inflation-filter]').forEach((button) => {
      const active = button.getAttribute('data-inflation-filter') === state.filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function getFilteredEntries({ ascending = false } = {}) {
    const type = FILTER_TYPES[state.filter];
    const entries = state.entries
      .map((entry) => ({
        ...entry,
        teams: type ? entry.teams.filter((team) => team.mainDealerType === type) : [...entry.teams]
      }))
      .filter((entry) => !type || entry.teams.length > 0);

    entries.sort((a, b) => compareVersion(a.version, b.version));
    return ascending ? entries : entries.reverse();
  }

  function getPhaseBestTeams(entry) {
    const out = { first: null, second: null };
    (entry.teams || []).forEach((team) => {
      if (!PHASES.includes(team.phase)) return;
      const current = out[team.phase];
      if (!current || Number(team.scoreEok) > Number(current.scoreEok)) {
        out[team.phase] = team;
      }
    });
    return out;
  }

  function getScorePoint(entry) {
    const phaseBest = getPhaseBestTeams(entry);
    const phaseTeams = PHASES.map((phase) => phaseBest[phase]).filter(Boolean);
    if (!phaseTeams.length) return null;
    const totalScoreEok = phaseTeams.reduce((sum, team) => sum + Number(team.scoreEok || 0), 0);
    return {
      entry,
      phaseBest,
      phaseTeams,
      totalScoreEok
    };
  }

  function render() {
    const entriesAsc = getFilteredEntries({ ascending: true });
    renderSummary(entriesAsc);
    renderChart(entriesAsc);
    renderEntries(getFilteredEntries());
  }

  function renderSummary(entriesAsc) {
    const points = entriesAsc.map(getScorePoint).filter(Boolean);
    const best = points.reduce((out, point) => (!out || point.totalScoreEok > out.totalScoreEok ? point : out), null);
    const first = points[0] || null;
    const latest = points[points.length - 1] || null;
    const growth = first && latest && first.totalScoreEok > 0
      ? ((latest.totalScoreEok - first.totalScoreEok) / first.totalScoreEok) * 100
      : null;

    setMetric('metricVersionsValue', String(entriesAsc.length));
    setMetric('metricBestValue', best ? formatScore(best.totalScoreEok) : '-');
    setMetric('metricLatestValue', latest ? formatScore(latest.totalScoreEok) : '-');
    setMetric('metricGrowthValue', growth == null ? '-' : `${formatNumber(growth)}%`);
  }

  function setMetric(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderChart(entriesAsc) {
    const canvas = document.getElementById('inflationChart');
    const empty = document.getElementById('chartEmpty');
    if (!canvas) return;

    const points = entriesAsc.map(getScorePoint).filter(Boolean);
    const releaseLabelPlugin = createReleaseLabelPlugin(points);

    if (!points.length || typeof Chart === 'undefined') {
      if (empty) empty.hidden = false;
      if (state.chart) {
        state.chart.destroy();
        state.chart = null;
      }
      return;
    }

    if (empty) empty.hidden = true;
    if (state.chart) state.chart.destroy();

    state.chart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: points.map((point) => `v${point.entry.version}`),
        datasets: [
          {
            data: points.map((point) => point.totalScoreEok),
            borderColor: '#ff5d5d',
            backgroundColor: 'rgba(255, 93, 93, 0.14)',
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#ff5d5d',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
            tension: 0.25,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 22,
            bottom: 6
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title(items) {
                const index = items && items[0] ? items[0].dataIndex : 0;
                const point = points[index];
                return point ? `v${point.entry.version} ${getCharacterDisplayName(point.entry.releasedCharacter)}` : '';
              },
              label(item) {
                const point = points[item.dataIndex];
                if (!point) return '';
                return [
                  `${t('totalScore', 'Total Score')}: ${formatScore(point.totalScoreEok)}`,
                  ...formatPhaseTooltipLines(point)
                ];
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: 'rgba(255,255,255,0.65)' }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.08)' },
            ticks: { color: 'rgba(255,255,255,0.65)' },
            title: {
              display: true,
              text: t('chartYAxis', 'Score (100M unit)'),
              color: 'rgba(255,255,255,0.72)'
            }
          }
        }
      },
      plugins: [releaseLabelPlugin]
    });
  }

  function createReleaseLabelPlugin(points) {
    return {
      id: 'inflationReleaseLabels',
      afterDatasetsDraw(chart) {
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data || !meta.data.length) return;

        const { ctx, chartArea } = chart;
        const compact = chart.width < 520;
        const maxWidth = compact ? 86 : 150;
        const fontSize = compact ? 10 : 11;
        const lineHeight = fontSize + 2;
        const paddingX = 7;
        const paddingY = 5;

        ctx.save();
        ctx.font = `600 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const placedLabels = [];
        meta.data.forEach((element, index) => {
          const point = points[index];
          if (!point) return;

          const { x, y } = element.getProps(['x', 'y'], true);
          const lines = [
            `v${point.entry.version}`,
            fitCanvasText(ctx, getChartCharacterLabel(point, compact), maxWidth - paddingX * 2),
            fitCanvasText(ctx, formatChartPhaseLine(point), maxWidth - paddingX * 2)
          ].filter(Boolean);
          const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
          const boxWidth = Math.min(maxWidth, Math.ceil(textWidth + paddingX * 2));
          const boxHeight = Math.ceil(lines.length * lineHeight + paddingY * 2);
          const labelBox = chooseChartLabelBox({
            chartArea,
            placedLabels,
            x,
            y,
            width: boxWidth,
            height: boxHeight,
            compact,
            index
          });
          const boxX = labelBox.x;
          const boxY = labelBox.y;
          placedLabels.push(labelBox);

          drawCanvasRoundRect(ctx, boxX, boxY, boxWidth, boxHeight, 5);
          ctx.fillStyle = 'rgba(13, 14, 20, 0.84)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
          ctx.lineWidth = 1;
          ctx.stroke();

          lines.forEach((line, lineIndex) => {
            if (lineIndex === 0) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
            } else if (lineIndex === lines.length - 1) {
              ctx.fillStyle = 'rgba(255, 180, 180, 0.84)';
            } else {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
            }
            ctx.fillText(line, boxX + boxWidth / 2, boxY + paddingY + lineHeight * lineIndex + lineHeight / 2);
          });
        });

        ctx.restore();
      }
    };
  }

  function chooseChartLabelBox({ chartArea, placedLabels, x, y, width, height, compact, index }) {
    const margin = 3;
    const clampX = (value) => Math.max(chartArea.left + 2, Math.min(value, chartArea.right - width - 2));
    const clampY = (value) => Math.max(chartArea.top + 2, Math.min(value, chartArea.bottom - height - 2));
    const centeredX = clampX(x - width / 2);
    const above = y - height - 12;
    const below = y + 12;
    const laneGap = 5;
    const candidates = compact
      ? [
          index % 2 === 1 ? below : above,
          index % 2 === 1 ? above : below,
          chartArea.top + 2 + (index % 4) * (height + laneGap),
          chartArea.bottom - height - 2 - (index % 4) * (height + laneGap),
          chartArea.top + 2,
          chartArea.top + height + laneGap + 2,
          chartArea.bottom - height - 2
        ]
      : [
          above,
          below
        ];

    const boxes = candidates.map((candidateY) => ({
      x: centeredX,
      y: clampY(candidateY),
      width,
      height
    }));
    const uniqueBoxes = boxes.filter((box, boxIndex) => boxes.findIndex((other) => (
      Math.abs(other.x - box.x) < 1 && Math.abs(other.y - box.y) < 1
    )) === boxIndex);

    return uniqueBoxes.find((box) => !placedLabels.some((placed) => chartBoxesOverlap(box, placed, margin)))
      || uniqueBoxes[0]
      || { x: centeredX, y: clampY(above), width, height };
  }

  function chartBoxesOverlap(a, b, margin) {
    return !(
      a.x + a.width + margin < b.x ||
      b.x + b.width + margin < a.x ||
      a.y + a.height + margin < b.y ||
      b.y + b.height + margin < a.y
    );
  }

  function getChartCharacterLabel(point, compact) {
    if (compact && getLang() === 'kr') {
      return point.entry.releasedCharacter || getCharacterDisplayName(point.entry.releasedCharacter);
    }
    return getCharacterDisplayName(point.entry.releasedCharacter);
  }

  function fitCanvasText(ctx, text, maxWidth) {
    const value = String(text || '');
    if (!value || ctx.measureText(value).width <= maxWidth) return value;
    let out = value;
    while (out.length > 1 && ctx.measureText(`${out}...`).width > maxWidth) {
      out = out.slice(0, -1);
    }
    return `${out}...`;
  }

  function drawCanvasRoundRect(ctx, x, y, width, height, radius) {
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
      return;
    }
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  function renderEntries(entries) {
    const root = document.getElementById('inflationEntries');
    const empty = document.getElementById('entriesEmpty');
    if (!root) return;

    if (!entries.length) {
      root.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    root.innerHTML = entries.map(renderEntryCard).join('');
  }

  function renderEntryCard(entry) {
    const scorePoint = getScorePoint(entry);
    const dateLabel = entry.releaseDate ? formatDate(entry.releaseDate) : t('unknownDate', 'Unconfirmed date');
    const breakdown = scorePoint ? renderPhaseBreakdown(scorePoint) : '';

    return `
      <article class="inflation-release">
        <div class="inflation-release-header">
          <div class="inflation-release-meta">
            <div class="inflation-version">v${escapeHtml(entry.version)}</div>
            <h3>${escapeHtml(getCharacterDisplayName(entry.releasedCharacter))}</h3>
            <div class="inflation-release-date">${escapeHtml(dateLabel)}</div>
          </div>
          <div class="inflation-release-best">
            <span>${escapeHtml(t('totalScore', 'Total Score'))}</span>
            <strong>${scorePoint ? formatScore(scorePoint.totalScoreEok) : '-'}</strong>
            ${breakdown}
          </div>
        </div>
        <div class="inflation-phase-board">
          ${PHASES.map((phase) => renderPhaseTeamColumn(entry, phase)).join('')}
        </div>
      </article>
    `;
  }

  function renderPhaseTeamColumn(entry, phase) {
    const teams = (entry.teams || [])
      .filter((team) => (team.phase || 'first') === phase)
      .sort((a, b) => Number(b.scoreEok || 0) - Number(a.scoreEok || 0));
    const teamsHtml = teams.length
      ? teams.map((team) => renderTeamRow(team)).join('')
      : `<div class="inflation-phase-empty">${escapeHtml(t('editNoPhaseTeams', 'No parties in this half.'))}</div>`;

    return `
      <section class="inflation-phase-column">
        <div class="inflation-phase-head">
          <div>
            <strong>${escapeHtml(getPhaseLabel(phase))}</strong>
            <span>${escapeHtml(formatPhaseColumnMeta(teams))}</span>
          </div>
        </div>
        <div class="inflation-team-list">
          ${teamsHtml}
        </div>
      </section>
    `;
  }

  function formatPhaseColumnMeta(teams) {
    if (!teams.length) return t('editNoPhaseTeamsShort', 'No parties');
    const best = teams.reduce((top, team) => (Number(team.scoreEok || 0) > Number(top.scoreEok || 0) ? team : top), teams[0]);
    return `${formatScore(best.scoreEok)} / ${String(teams.length)}${t('editTeamCountSuffix', ' parties')}`;
  }

  function renderTeamRow(team) {
    const party = team.party || {};
    const slotsHtml = (party.slots || [])
      .map((name) => renderCharacterChip(name, { main: name === team.mainDealer }))
      .join('');
    const supportHtml = party.support
      ? renderCharacterChip(party.support, { compact: true })
      : '';
    const backupHtml = party.backup
      ? renderCharacterChip(party.backup, { compact: true })
      : '';

    return `
      <div class="inflation-team-row">
        <div class="inflation-team-score">${formatScore(team.scoreEok)}</div>
        <div class="inflation-team-body">
          <div class="inflation-team-main">
            ${renderPositionIcon(team.mainDealerType)}
            <span>${escapeHtml(t('mainDealer', 'Main Dealer'))}</span>
            <strong>${escapeHtml(getCharacterDisplayName(team.mainDealer))}</strong>
            <em>${escapeHtml(getPositionLabel(team.mainDealerType))}</em>
          </div>
          <div class="inflation-party-line">
            <div class="inflation-battle-slots">${slotsHtml}</div>
            ${supportHtml}
            ${backupHtml}
          </div>
        </div>
      </div>
    `;
  }

  function renderPhaseBreakdown(point) {
    const items = PHASES.map((phase) => {
      const team = point.phaseBest[phase];
      if (!team) return '';
      return `<span>${escapeHtml(getPhaseLabel(phase))} ${escapeHtml(formatScore(team.scoreEok))}</span>`;
    }).filter(Boolean);
    if (!items.length) return '';
    return `<div class="inflation-release-breakdown">${items.join('')}</div>`;
  }

  function formatPhaseBreakdown(point) {
    return PHASES.map((phase) => {
      const team = point.phaseBest[phase];
      return team ? `${getPhaseLabel(phase)} ${formatScore(team.scoreEok)}` : '';
    }).filter(Boolean).join(' / ');
  }

  function formatChartPhaseLine(point) {
    return PHASES.map((phase) => {
      const team = point.phaseBest[phase];
      if (!team) return '';
      return `${getPhaseShortLabel(phase)} ${formatNumber(team.scoreEok)}`;
    }).filter(Boolean).join(' / ');
  }

  function formatPhaseTooltipLines(point) {
    return PHASES.map((phase) => {
      const team = point.phaseBest[phase];
      if (!team) return '';
      return `${getPhaseLabel(phase)}: ${formatScore(team.scoreEok)} (${getCharacterDisplayName(team.mainDealer)})`;
    }).filter(Boolean);
  }

  function renderCharacterChip(name, options = {}) {
    const displayName = getCharacterDisplayName(name);
    const classes = [
      'inflation-character-chip',
      options.main ? 'is-main' : '',
      options.compact ? 'is-compact' : ''
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}" title="${escapeHtml(displayName)}">
        <img src="${characterImageUrl(name)}" alt="" loading="lazy" onerror="this.style.display='none'">
        <span>${escapeHtml(displayName)}</span>
      </div>
    `;
  }

  function renderPositionIcon(type) {
    if (!type) return '';
    return `
      <img class="inflation-position-icon"
        src="${baseUrl()}/assets/img/character-cards/직업_${encodeURIComponent(type)}.png"
        alt="${escapeHtml(getPositionLabel(type))}"
        onerror="this.style.display='none'">
    `;
  }

  function initEditMode() {
    const header = document.querySelector('.header-container');
    if (!header) return;
    header.insertAdjacentHTML('afterend', '<section class="inflation-edit-panel" id="inflationEditPanel"></section>');
    state.editPanel = document.getElementById('inflationEditPanel');
    state.editPanel.addEventListener('click', handleEditClick);
    state.editPanel.addEventListener('input', handleEditInput);
    state.editPanel.addEventListener('change', handleEditChange);
    renderEditDisconnected();
    connectAdmin();
  }

  async function connectAdmin() {
    state.editLoading = true;
    state.editError = '';
    renderEditDisconnected();
    try {
      const result = await requestAdmin('/api/inflation/bootstrap');
      state.editConnected = true;
      state.editLoading = false;
      state.editFileHash = result.fileHash || '';
      state.characters = Array.isArray(result.characters) ? result.characters : buildLocalCharacterOptions();
      state.releases = Array.isArray(result.releases) ? result.releases : buildLocalReleaseOptions();
      state.editDraft = cloneData(result.data || { unit: 'eok', entries: [] });
      state.editActiveEntryIndex = getInitialEditEntryIndex(state.editDraft);
      state.editBaseline = stableDraftString(state.editDraft);
      state.editDirty = false;
      state.editValidation = result.validation || null;
      setRuntimeData(state.editDraft);
      renderEditConnected();
    } catch (error) {
      state.editConnected = false;
      state.editLoading = false;
      state.editError = String(error?.message || error);
      renderEditDisconnected();
    }
  }

  async function requestAdmin(pathname, options = {}) {
    const response = await fetch(`${ADMIN_API_BASE}${pathname}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(text || response.statusText || 'Invalid admin response');
    }
    if (!response.ok) {
      throw new Error(data?.message || data?.error || response.statusText || 'Admin request failed');
    }
    return data || {};
  }

  function renderEditDisconnected() {
    if (!state.editPanel) return;
    const status = state.editLoading
      ? t('editConnecting', 'Connecting to local admin API...')
      : t('editDisconnected', 'Local admin API is not connected.');
    const error = state.editError
      ? `<p class="inflation-edit-error">${escapeHtml(state.editError)}</p>`
      : '';

    state.editPanel.innerHTML = `
      <div class="inflation-edit-head">
        <div>
          <p class="inflation-edit-kicker">${escapeHtml(t('editMode', 'Edit Mode'))}</p>
          <h2>${escapeHtml(t('editTitle', 'Inflation Data Editor'))}</h2>
          <p>${escapeHtml(status)}</p>
          ${error}
        </div>
        <button type="button" class="inflation-edit-btn" data-edit-action="connect">${renderEditButtonLabel('refresh-cw', t('editReconnect', 'Reconnect'))}</button>
      </div>
      <div class="inflation-edit-help">
        <code>npm run inflation:admin</code>
        <span>${escapeHtml(t('editRunAdminHint', 'Run the local admin API, then reconnect from this page.'))}</span>
      </div>
    `;
  }

  function renderEditConnected() {
    if (!state.editPanel) return;
    const validation = state.editValidation || { ok: false, errors: [] };
    const errors = Array.isArray(validation.errors) ? validation.errors : [];
    const entries = state.editDraft && Array.isArray(state.editDraft.entries) ? state.editDraft.entries : [];
    state.editActiveEntryIndex = clampEntryIndex(state.editActiveEntryIndex, entries);
    const activeEntry = entries[state.editActiveEntryIndex] || null;
    const saveDisabled = state.editSaving || !state.editDirty || !validation.ok;
    const statusText = state.editSaving
      ? t('editSaving', 'Saving...')
      : state.editDirty
        ? t('editDirty', 'Unsaved changes')
        : t('editSaved', 'Saved');
    const validationHtml = errors.length && isEditEntryBlank(activeEntry)
      ? renderEditPendingSummary()
      : renderValidationSummary(errors);

    state.editPanel.innerHTML = `
      <div class="inflation-edit-head">
        <div>
          <p class="inflation-edit-kicker">${escapeHtml(t('editMode', 'Edit Mode'))}</p>
          <h2>${escapeHtml(t('editTitle', 'Inflation Data Editor'))}</h2>
          <p>${escapeHtml(t('editConnected', 'Connected to local admin API.'))}</p>
        </div>
        <div class="inflation-edit-actions">
          <span class="inflation-edit-status ${state.editDirty ? 'is-dirty' : ''}">${escapeHtml(statusText)}</span>
          <button type="button" class="inflation-edit-btn" data-edit-action="add-entry">${renderEditButtonLabel('plus', t('editAddEntry', 'Add Version'))}</button>
          <button type="button" class="inflation-edit-btn" data-edit-action="reload">${renderEditButtonLabel('refresh-cw', t('editReload', 'Reload'))}</button>
          <button type="button" class="inflation-edit-btn is-primary" data-edit-action="save" ${saveDisabled ? 'disabled' : ''}>${renderEditButtonLabel('save', t('editSave', 'Save'))}</button>
        </div>
      </div>
      ${validationHtml}
      ${renderEditEntryNav()}
      <datalist id="inflationVersionOptions">
        ${state.releases.map((release) => `<option value="${escapeHtml(release.version)}">${escapeHtml(`${release.version} ${release.character}`)}</option>`).join('')}
      </datalist>
      <div class="inflation-edit-entry-list">
        ${activeEntry ? renderEditEntry(activeEntry, state.editActiveEntryIndex, errors) : renderEditEmptyEntries()}
      </div>
    `;
  }

  function renderEditEmptyEntries() {
    return `
      <div class="inflation-edit-empty-state">
        <p>${escapeHtml(t('editNoEntries', 'No version data yet.'))}</p>
        <button type="button" class="inflation-edit-btn" data-edit-action="add-entry">${renderEditButtonLabel('plus', t('editAddEntry', 'Add Version'))}</button>
      </div>
    `;
  }

  function renderValidationSummary(errors) {
    if (!errors.length) {
      return `<div class="inflation-edit-validation is-ok">${escapeHtml(t('editValidationOk', 'Validation passed.'))}</div>`;
    }
    return `
      <div class="inflation-edit-validation">
        <strong>${escapeHtml(t('editValidationFailed', 'Validation failed.'))}</strong>
        <ul>
          ${errors.slice(0, 8).map((error) => `<li>${escapeHtml(error.message || error)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  function renderEditPendingSummary() {
    return `<div class="inflation-edit-validation is-pending">${escapeHtml(t('editFillRequiredFields', 'Fill the required fields to validate this draft.'))}</div>`;
  }

  function renderEditEntry(entry, entryIndex, errors) {
    const entryError = errors.some((error) => error.entryId === entry.id || String(error.path || '').startsWith(`entries.${entryIndex}`));
    return `
      <article class="inflation-edit-entry ${entryError ? 'has-error' : ''}" data-entry-index="${entryIndex}">
        <div class="inflation-edit-entry-head">
          <div>
            <div class="inflation-version">${escapeHtml(formatEditVersionLabel(entry))}</div>
            <h3>${escapeHtml(formatEditEntryTitle(entry))}</h3>
            <p>${escapeHtml(formatEditEntryMeta(entry))}</p>
          </div>
          <div class="inflation-edit-row-actions">
            <button type="button" data-edit-action="regen-entry-id" data-entry-index="${entryIndex}">${renderEditButtonLabel('rotate-cw', t('editRegenerateId', 'Regenerate ID'))}</button>
            <button type="button" data-edit-action="duplicate-entry" data-entry-index="${entryIndex}">${renderEditButtonLabel('copy', t('editDuplicate', 'Duplicate'))}</button>
            <button type="button" data-edit-action="delete-entry" data-entry-index="${entryIndex}">${renderEditButtonLabel('trash-2', t('editDelete', 'Delete'))}</button>
          </div>
        </div>
        <div class="inflation-edit-grid">
          ${renderEditField(t('editVersion', 'Version'), `<input type="text" data-edit-field="version" value="${escapeHtml(entry.version || '')}" list="inflationVersionOptions">`)}
          ${renderEditField(t('editReleasedCharacter', 'Released Character'), renderCharacterPicker(entry.releasedCharacter || '', 'releasedCharacter'))}
          ${renderEditField(t('editReleaseDate', 'Release Date Override'), `<input type="date" data-edit-field="releaseDate" value="${escapeHtml(entry.releaseDate || '')}">`)}
        </div>
        ${renderEditAdvanced(renderEditField('ID', `<input type="text" data-edit-field="id" value="${escapeHtml(entry.id || '')}">`))}
        <div class="inflation-edit-phase-board">
          ${PHASES.map((phase) => renderEditPhaseColumn(entry, entryIndex, phase, errors)).join('')}
        </div>
      </article>
    `;
  }

  function renderEditPhaseColumn(entry, entryIndex, phase, errors) {
    const teams = Array.isArray(entry.teams) ? entry.teams : [];
    const indexedTeams = teams
      .map((team, teamIndex) => ({ team, teamIndex }))
      .filter(({ team }) => (team.phase || 'first') === phase);

    return `
      <section class="inflation-edit-phase-column" data-edit-phase="${escapeHtml(phase)}">
        <div class="inflation-edit-phase-head">
          <div>
            <strong>${escapeHtml(getPhaseLabel(phase))}</strong>
            <span>${escapeHtml(formatEditPhaseMeta(indexedTeams.map(({ team }) => team)))}</span>
          </div>
          <button type="button" class="inflation-edit-add-team" data-edit-action="add-team" data-entry-index="${entryIndex}" data-phase="${escapeHtml(phase)}">
            ${renderEditButtonLabel('plus', t('editAddTeam', 'Add Party'))}
          </button>
        </div>
        <div class="inflation-edit-team-list">
          ${indexedTeams.length
            ? indexedTeams.map(({ team, teamIndex }) => renderEditTeam(team, entryIndex, teamIndex, errors)).join('')
            : `<div class="inflation-edit-phase-empty">${escapeHtml(t('editNoPhaseTeams', 'No parties in this half.'))}</div>`}
        </div>
      </section>
    `;
  }

  function formatEditPhaseMeta(teams) {
    if (!teams.length) return t('editNoPhaseTeamsShort', 'No parties');
    const best = teams.reduce((top, team) => (Number(team.scoreEok || 0) > Number(top.scoreEok || 0) ? team : top), teams[0]);
    return `${formatEditScore(best.scoreEok)} · ${String(teams.length)}${t('editTeamCountSuffix', ' parties')}`;
  }

  function formatEditScore(score) {
    return Number(score || 0) > 0 ? formatScore(score) : t('editScoreMissing', 'No score');
  }

  function renderEditTeam(team, entryIndex, teamIndex, errors) {
    const party = team.party || {};
    const slots = Array.isArray(party.slots) ? party.slots : [];
    const teamError = errors.some((error) => error.teamId === team.id || String(error.path || '').startsWith(`entries.${entryIndex}.teams.${teamIndex}`));
    const backupDisabled = party.support !== FUKA_KEY;
    const mainDealerName = team.mainDealer ? getCharacterDisplayName(team.mainDealer) : t('editMainMissing', 'Main not set');
    return `
      <div class="inflation-edit-team ${teamError ? 'has-error' : ''}" data-entry-index="${entryIndex}" data-team-index="${teamIndex}">
        <div class="inflation-edit-team-head">
          <div>
            <strong>${escapeHtml(`${getPhaseLabel(team.phase || 'first')} / ${formatEditScore(team.scoreEok)}`)}</strong>
            <span>${escapeHtml(mainDealerName)} ${escapeHtml(getPositionLabel(team.mainDealerType || ''))}</span>
          </div>
          <div class="inflation-edit-row-actions">
            <button type="button" data-edit-action="regen-team-id" data-entry-index="${entryIndex}" data-team-index="${teamIndex}">${renderEditButtonLabel('rotate-cw', t('editRegenerateId', 'Regenerate ID'))}</button>
            <button type="button" data-edit-action="duplicate-team" data-entry-index="${entryIndex}" data-team-index="${teamIndex}">${renderEditButtonLabel('copy', t('editDuplicate', 'Duplicate'))}</button>
            <button type="button" data-edit-action="delete-team" data-entry-index="${entryIndex}" data-team-index="${teamIndex}">${renderEditButtonLabel('trash-2', t('editDelete', 'Delete'))}</button>
          </div>
        </div>
        <div class="inflation-edit-team-layout">
          <div class="inflation-edit-team-controls">
            <input type="hidden" data-edit-team-field="mainDealer" value="${escapeHtml(team.mainDealer || '')}">
            ${renderEditField(t('editScore', 'Score'), renderEditScoreControl(team.scoreEok))}
            ${renderEditField(t('editPhase', 'Phase'), renderPhaseSelect(team.phase || 'first'))}
            ${renderEditField(t('editMainDealerType', 'Dealer Type'), renderMainDealerTypeSelect(team.mainDealerType || '지배'))}
          </div>
          <div class="inflation-edit-party-board">
            ${renderEditPartySlot(t('editSlot1', 'Slot 1'), slots[0] || '', 'slot0', team.mainDealer)}
            ${renderEditPartySlot(t('editSlot2', 'Slot 2'), slots[1] || '', 'slot1', team.mainDealer)}
            ${renderEditPartySlot(t('editSlot3', 'Slot 3'), slots[2] || '', 'slot2', team.mainDealer)}
            ${renderEditPartySlot(t('support', 'Support'), party.support || '', 'support', team.mainDealer, { support: true })}
            ${renderEditPartySlot(t('backup', 'Backup'), party.backup || '', 'backup', team.mainDealer, { disabled: backupDisabled })}
          </div>
          <div class="inflation-edit-team-extra">
            ${renderEditField(t('editNote', 'Note'), `<textarea data-edit-team-field="note" rows="2">${escapeHtml(team.note || '')}</textarea>`)}
            ${renderEditAdvanced(renderEditField('ID', `<input type="text" data-edit-team-field="id" value="${escapeHtml(team.id || '')}">`))}
          </div>
        </div>
      </div>
    `;
  }

  function renderEditAdvanced(contentHtml) {
    return `
      <details class="inflation-edit-advanced">
        <summary>${escapeHtml(t('editAdvanced', 'Advanced'))}</summary>
        ${contentHtml}
      </details>
    `;
  }

  function renderEditScoreControl(scoreEok) {
    const unit = getPreferredScoreInputUnit(scoreEok);
    const displayValue = formatScoreInputValue(scoreEok, unit);
    return `
      <div class="inflation-edit-score-control" data-edit-score-control>
        <input type="hidden" data-edit-team-field="scoreEok" value="${escapeHtml(formatScoreEokDataValue(scoreEok))}">
        <input type="number"
          min="0"
          step="${unit === 'man' ? '1' : '0.1'}"
          data-edit-score-value
          value="${escapeHtml(displayValue)}"
          aria-label="${escapeHtml(t('editScore', 'Score'))}">
        <input type="hidden" data-edit-score-unit value="${escapeHtml(unit)}">
        <div class="inflation-edit-score-units" role="group" aria-label="${escapeHtml(t('editScoreUnit', 'Score unit'))}">
          ${renderScoreUnitButton('eok', unit)}
          ${renderScoreUnitButton('man', unit)}
        </div>
      </div>
    `;
  }

  function renderScoreUnitButton(unit, activeUnit) {
    return `
      <button type="button"
        class="${unit === activeUnit ? 'is-active' : ''}"
        data-edit-action="set-score-unit"
        data-value="${escapeHtml(unit)}"
        aria-pressed="${unit === activeUnit ? 'true' : 'false'}">
        ${escapeHtml(getScoreInputUnitLabel(unit))}
      </button>
    `;
  }

  function renderEditEntryNav() {
    const entries = state.editDraft && Array.isArray(state.editDraft.entries) ? state.editDraft.entries : [];
    if (!entries.length) return '';
    const activeIndex = clampEntryIndex(state.editActiveEntryIndex, entries);
    return `
      <div class="inflation-edit-entry-nav" aria-label="${escapeHtml(t('editVersionNav', 'Version list'))}">
        ${entries.map((entry, index) => {
          return `<button type="button" class="${index === activeIndex ? 'is-active' : ''}" data-edit-action="jump-entry" data-entry-index="${index}" aria-selected="${index === activeIndex ? 'true' : 'false'}">${escapeHtml(formatEditEntryTabLabel(entry))}</button>`;
        }).join('')}
      </div>
    `;
  }

  function formatEditEntryTabLabel(entry) {
    if (isEditEntryBlank(entry)) return t('editNewEntryTab', 'New version');
    const point = getScorePoint(entry);
    return [
      formatEditVersionLabel(entry),
      getCharacterDisplayName(entry.releasedCharacter || ''),
      point ? formatScore(point.totalScoreEok) : ''
    ].filter(Boolean).join(' · ');
  }

  function formatEditVersionLabel(entry) {
    return entry && entry.version ? `v${entry.version}` : t('editVersionMissing', 'Version not set');
  }

  function formatEditEntryTitle(entry) {
    return entry && entry.releasedCharacter
      ? getCharacterDisplayName(entry.releasedCharacter)
      : t('editReleasedCharacterMissing', 'Choose a released character');
  }

  function isEditEntryBlank(entry) {
    if (!entry) return false;
    const hasEntryFields = Boolean(entry.version || entry.releasedCharacter || entry.releaseDate);
    const hasTeams = Array.isArray(entry.teams) && entry.teams.length > 0;
    return !hasEntryFields && !hasTeams;
  }

  function formatEditEntryMeta(entry) {
    const point = getScorePoint(entry);
    const teamCount = Array.isArray(entry.teams) ? entry.teams.length : 0;
    return [
      point ? formatScore(point.totalScoreEok) : '',
      `${teamCount}${t('editTeamCountSuffix', ' parties')}`
    ].filter(Boolean).join(' · ');
  }

  function renderEditPartySlot(label, value, field, mainDealer, options = {}) {
    const isMain = value && value === mainDealer;
    const classes = [
      'inflation-edit-party-slot',
      isMain ? 'is-main' : '',
      options.disabled ? 'is-disabled' : ''
    ].filter(Boolean).join(' ');
    return `
      <div class="${classes}">
        <div class="inflation-edit-party-slot-label">${escapeHtml(label)}</div>
        ${renderCharacterPicker(value, field, true, options.disabled)}
        ${value && !options.support && field !== 'backup'
          ? `<button type="button" class="inflation-edit-main-toggle" data-edit-action="set-main-from-field" data-edit-team-field-source="${escapeHtml(field)}">${renderEditButtonLabel(isMain ? 'check' : 'target', isMain ? t('editMainAssigned', 'Main') : t('editSetMain', 'Set Main'))}</button>`
          : ''}
      </div>
    `;
  }

  function renderEditButtonLabel(iconName, text) {
    return `${renderEditIcon(iconName)}<span>${escapeHtml(text)}</span>`;
  }

  function renderEditIcon(name) {
    const icons = {
      plus: '<path d="M5 12h14"></path><path d="M12 5v14"></path>',
      copy: '<rect x="8" y="8" width="12" height="12" rx="2" ry="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>',
      'trash-2': '<path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path>',
      'refresh-cw': '<path d="M21 12a9 9 0 0 1-9 9 9.8 9.8 0 0 1-6.7-2.7L3 16"></path><path d="M3 21v-5h5"></path><path d="M3 12a9 9 0 0 1 9-9 9.8 9.8 0 0 1 6.7 2.7L21 8"></path><path d="M21 3v5h-5"></path>',
      save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><path d="M17 21v-8H7v8"></path><path d="M7 3v5h8"></path>',
      'rotate-cw': '<path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>',
      target: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="3"></circle><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M2 12h4"></path><path d="M18 12h4"></path>',
      check: '<path d="M20 6 9 17l-5-5"></path>'
    };
    const paths = icons[name] || icons.plus;
    return `<svg class="inflation-edit-action-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
  }

  function renderEditField(label, controlHtml) {
    return `
      <label class="inflation-edit-field">
        <span>${escapeHtml(label)}</span>
        ${controlHtml}
      </label>
    `;
  }

  function renderCharacterPicker(value, field, teamField = false, disabled = false) {
    const attr = teamField ? 'data-edit-team-field' : 'data-edit-field';
    const displayName = value ? getCharacterDisplayName(value) : t('editChooseCharacter', 'Choose');
    const classes = [
      'inflation-edit-character-picker',
      value ? 'has-value' : '',
      disabled ? 'is-disabled' : ''
    ].filter(Boolean).join(' ');
    return `
      <div class="${classes}">
        <input type="hidden" ${attr}="${escapeHtml(field)}" value="${escapeHtml(value || '')}" ${disabled ? 'disabled' : ''}>
        <button type="button" class="inflation-edit-character-trigger" data-edit-action="open-character-picker" ${disabled ? 'disabled' : ''}>
          ${value ? renderEditCharacterImage(value) : '<span class="inflation-edit-character-empty">+</span>'}
          <span>${escapeHtml(displayName)}</span>
        </button>
        ${value && !disabled ? `<button type="button" class="inflation-edit-character-clear" data-edit-action="clear-character" aria-label="${escapeHtml(t('editClearCharacter', 'Clear character'))}">x</button>` : ''}
      </div>
    `;
  }

  function renderEditCharacterImage(name) {
    if (!hasEditCharacterImage(name)) {
      return `<span class="inflation-edit-character-empty">${escapeHtml(getCharacterInitial(name))}</span>`;
    }
    return `<img src="${characterImageUrl(name)}" alt="" loading="lazy" onerror="this.style.display='none'">`;
  }

  function hasEditCharacterImage(name) {
    const option = state.characters.find((character) => character.key === name);
    return !option || option.hasTierImage !== false;
  }

  function getCharacterInitial(name) {
    const displayName = getCharacterDisplayName(name);
    return String(displayName || name || '?').trim().slice(0, 1) || '?';
  }

  function renderMainDealerTypeSelect(value) {
    return renderEditSegmentedControl(
      'mainDealerType',
      MAIN_DEALER_TYPES.map((type) => ({ value: type, label: getPositionLabel(type) })),
      value || '지배'
    );
  }

  function renderPhaseSelect(value) {
    return renderEditSegmentedControl(
      'phase',
      PHASES.map((phase) => ({ value: phase, label: getPhaseLabel(phase) })),
      value || 'first'
    );
  }

  function renderEditSegmentedControl(field, options, value) {
    return `
      <div class="inflation-edit-segmented" data-edit-segmented="${escapeHtml(field)}">
        <input type="hidden" data-edit-team-field="${escapeHtml(field)}" value="${escapeHtml(value || '')}">
        ${options.map((option) => {
          const active = option.value === value;
          return `
            <button type="button"
              class="${active ? 'is-active' : ''}"
              data-edit-action="set-segment"
              data-edit-team-field-source="${escapeHtml(field)}"
              data-value="${escapeHtml(option.value)}"
              aria-pressed="${active ? 'true' : 'false'}">
              ${escapeHtml(option.label)}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  function handleEditInput(event) {
    if (!state.editConnected) return;
    if (!event.target.closest('.inflation-edit-panel')) return;
    if (event.target.matches('[data-edit-picker-search]')) {
      filterEditCharacterPicker(event.target);
      return;
    }
    if (!event.target.matches('input, textarea')) return;
    if (event.target.matches('[data-edit-score-value]')) {
      updateScoreHiddenFromControl(event.target.closest('[data-edit-score-control]'));
    }
    syncDraftFromForm();
    scheduleDraftValidation();
  }

  function handleEditChange(event) {
    if (!state.editConnected) return;
    if (!event.target.closest('.inflation-edit-panel')) return;
    if (!event.target.matches('select, input, textarea')) return;
    const supportSelect = event.target.matches('[data-edit-team-field="support"]') ? event.target : null;
    const phaseSelect = event.target.matches('[data-edit-team-field="phase"]') ? event.target : null;
    if (event.target.matches('[data-edit-score-value]')) {
      updateScoreHiddenFromControl(event.target.closest('[data-edit-score-control]'));
    }
    if (supportSelect) {
      const teamEl = supportSelect.closest('.inflation-edit-team');
      const backup = teamEl ? teamEl.querySelector('[data-edit-team-field="backup"]') : null;
      if (backup) {
        backup.disabled = supportSelect.value !== FUKA_KEY;
        if (backup.disabled) backup.value = '';
      }
    }
    syncDraftFromForm();
    if (phaseSelect) {
      renderEditConnected();
    }
    scheduleDraftValidation();
  }

  function handleEditClick(event) {
    const button = event.target.closest('[data-edit-action]');
    if (!button) return;
    const action = button.getAttribute('data-edit-action');

    if (action === 'close-character-picker') {
      closeEditCharacterPicker();
      return;
    }

    if (action === 'connect' || action === 'reload') {
      connectAdmin();
      return;
    }

    if (!state.editConnected) return;

    if (action === 'open-character-picker') {
      openEditCharacterPicker(button);
      return;
    }
    if (action === 'select-character') {
      applyEditCharacterSelection(button);
      return;
    }
    if (action === 'clear-character') {
      clearEditCharacter(button);
      return;
    }
    if (action === 'set-main-from-field') {
      setMainDealerFromField(button);
      return;
    }
    if (action === 'set-segment') {
      setSegmentValue(button);
      return;
    }
    if (action === 'set-score-unit') {
      setScoreUnit(button);
      return;
    }
    if (action === 'jump-entry') {
      switchEditEntry(button);
      return;
    }

    syncDraftFromForm();

    const entryIndex = Number(button.getAttribute('data-entry-index'));
    const teamIndex = Number(button.getAttribute('data-team-index'));

    if (action === 'add-entry') addEntry();
    if (action === 'duplicate-entry') duplicateEntry(entryIndex);
    if (action === 'delete-entry') deleteEntry(entryIndex);
    if (action === 'regen-entry-id') regenerateEntryId(entryIndex);
    if (action === 'add-team') addTeam(entryIndex, button.getAttribute('data-phase') || '');
    if (action === 'duplicate-team') duplicateTeam(entryIndex, teamIndex);
    if (action === 'delete-team') deleteTeam(entryIndex, teamIndex);
    if (action === 'regen-team-id') regenerateTeamId(entryIndex, teamIndex);
    if (action === 'save') saveDraft();

    if (action !== 'save') {
      afterStructuralEdit();
    }
  }

  function openEditCharacterPicker(trigger) {
    const picker = trigger.closest('.inflation-edit-character-picker');
    const input = picker ? picker.querySelector('[data-edit-field], [data-edit-team-field]') : null;
    if (!picker || !input || input.disabled) return;

    closeEditCharacterPicker();
    const entryEl = trigger.closest('.inflation-edit-entry');
    const teamEl = trigger.closest('.inflation-edit-team');
    const context = {
      entryIndex: entryEl ? entryEl.getAttribute('data-entry-index') : '',
      teamIndex: teamEl ? teamEl.getAttribute('data-team-index') : '',
      field: input.getAttribute('data-edit-team-field') || input.getAttribute('data-edit-field') || '',
      teamField: input.hasAttribute('data-edit-team-field'),
      value: input.value || ''
    };
    state.editPicker = context;
    state.editPanel.insertAdjacentHTML('beforeend', renderEditCharacterPickerModal(context));
    const search = state.editPanel.querySelector('[data-edit-picker-search]');
    if (search) search.focus();
  }

  function renderEditCharacterPickerModal(context) {
    const cards = state.characters.map((character) => {
      const key = character.key;
      const displayName = getCharacterDisplayName(key);
      const selected = key === context.value;
      return `
        <button type="button"
          class="inflation-edit-picker-card ${selected ? 'is-selected' : ''}"
          data-edit-action="select-character"
          data-character-key="${escapeHtml(key)}"
          data-search="${escapeHtml(getCharacterSearchText(key))}">
          ${renderEditCharacterImage(key)}
          <span>${escapeHtml(displayName)}</span>
        </button>
      `;
    }).join('');

    return `
      <div class="inflation-edit-picker-modal"
        data-entry-index="${escapeHtml(context.entryIndex)}"
        data-team-index="${escapeHtml(context.teamIndex)}"
        data-field="${escapeHtml(context.field)}"
        data-team-field="${context.teamField ? '1' : '0'}">
        <button type="button" class="inflation-edit-picker-backdrop" data-edit-action="close-character-picker" aria-label="${escapeHtml(t('editClosePicker', 'Close'))}"></button>
        <div class="inflation-edit-picker-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(t('editPickerTitle', 'Choose Character'))}">
          <div class="inflation-edit-picker-head">
            <div>
              <strong>${escapeHtml(t('editPickerTitle', 'Choose Character'))}</strong>
              <span>${escapeHtml(t('editPickerSubtitle', 'Search and pick a character card.'))}</span>
            </div>
            <button type="button" class="inflation-edit-picker-close" data-edit-action="close-character-picker" aria-label="${escapeHtml(t('editClosePicker', 'Close'))}">×</button>
          </div>
          <input type="search" class="inflation-edit-picker-search" data-edit-picker-search placeholder="${escapeHtml(t('editCharacterSearch', 'Search character'))}">
          <div class="inflation-edit-picker-grid">
            ${cards}
          </div>
          <div class="inflation-edit-picker-empty" hidden>${escapeHtml(t('editNoCharacterResults', 'No matching characters.'))}</div>
        </div>
      </div>
    `;
  }

  function filterEditCharacterPicker(input) {
    const modal = input.closest('.inflation-edit-picker-modal');
    if (!modal) return;
    const query = normalizeSearchText(input.value || '');
    let visibleCount = 0;
    modal.querySelectorAll('.inflation-edit-picker-card').forEach((card) => {
      const haystack = card.getAttribute('data-search') || '';
      const visible = !query || haystack.includes(query);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    const empty = modal.querySelector('.inflation-edit-picker-empty');
    if (empty) empty.hidden = visibleCount > 0;
  }

  function applyEditCharacterSelection(button) {
    const modal = button.closest('.inflation-edit-picker-modal');
    if (!modal) return;
    const input = findPickerTargetInput(modal);
    if (!input) return;

    input.value = button.getAttribute('data-character-key') || '';
    applyDependentCharacterRules(input);
    closeEditCharacterPicker();
    syncDraftFromForm();
    scheduleDraftValidation();
    renderEditConnected();
  }

  function clearEditCharacter(button) {
    const picker = button.closest('.inflation-edit-character-picker');
    const input = picker ? picker.querySelector('[data-edit-field], [data-edit-team-field]') : null;
    if (!input || input.disabled) return;
    input.value = '';
    applyDependentCharacterRules(input);
    syncDraftFromForm();
    scheduleDraftValidation();
    renderEditConnected();
  }

  function setMainDealerFromField(button) {
    const teamEl = button.closest('.inflation-edit-team');
    const field = button.getAttribute('data-edit-team-field-source') || '';
    if (!teamEl || !field) return;
    const source = teamEl.querySelector(`[data-edit-team-field="${cssEscape(field)}"]`);
    const main = teamEl.querySelector('[data-edit-team-field="mainDealer"]');
    if (!source || !main || !source.value) return;
    main.value = source.value;
    syncDraftFromForm();
    scheduleDraftValidation();
    renderEditConnected();
  }

  function setSegmentValue(button) {
    const teamEl = button.closest('.inflation-edit-team');
    const field = button.getAttribute('data-edit-team-field-source') || '';
    const value = button.getAttribute('data-value') || '';
    if (!teamEl || !field) return;
    const input = teamEl.querySelector(`[data-edit-team-field="${cssEscape(field)}"]`);
    if (!input) return;
    input.value = value;
    syncDraftFromForm();
    scheduleDraftValidation();
    renderEditConnected();
  }

  function setScoreUnit(button) {
    const control = button.closest('[data-edit-score-control]');
    const unit = button.getAttribute('data-value') || 'eok';
    if (!control || !Object.prototype.hasOwnProperty.call(SCORE_UNIT_MULTIPLIERS, unit)) return;

    updateScoreHiddenFromControl(control);
    const hidden = control.querySelector('[data-edit-team-field="scoreEok"]');
    const visible = control.querySelector('[data-edit-score-value]');
    const unitInput = control.querySelector('[data-edit-score-unit]');
    const scoreEok = hidden ? hidden.value : '';

    if (unitInput) unitInput.value = unit;
    if (visible) {
      visible.value = formatScoreInputValue(scoreEok, unit);
      visible.step = unit === 'man' ? '1' : '0.1';
    }

    control.querySelectorAll('[data-edit-action="set-score-unit"]').forEach((unitButton) => {
      const active = unitButton.getAttribute('data-value') === unit;
      unitButton.classList.toggle('is-active', active);
      unitButton.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    syncDraftFromForm();
    scheduleDraftValidation();
  }

  function switchEditEntry(button) {
    syncDraftFromForm();
    const entries = state.editDraft && Array.isArray(state.editDraft.entries) ? state.editDraft.entries : [];
    const entryIndex = Number(button.getAttribute('data-entry-index'));
    state.editActiveEntryIndex = clampEntryIndex(entryIndex, entries);
    renderEditConnected();
  }

  function findPickerTargetInput(modal) {
    const entryIndex = modal.getAttribute('data-entry-index');
    const teamIndex = modal.getAttribute('data-team-index');
    const field = modal.getAttribute('data-field');
    const teamField = modal.getAttribute('data-team-field') === '1';
    const entry = state.editPanel.querySelector(`.inflation-edit-entry[data-entry-index="${cssEscape(entryIndex)}"]`);
    if (!entry || !field) return null;
    if (!teamField) return entry.querySelector(`[data-edit-field="${cssEscape(field)}"]`);
    const team = entry.querySelector(`.inflation-edit-team[data-team-index="${cssEscape(teamIndex)}"]`);
    return team ? team.querySelector(`[data-edit-team-field="${cssEscape(field)}"]`) : null;
  }

  function applyDependentCharacterRules(input) {
    const field = input.getAttribute('data-edit-team-field') || input.getAttribute('data-edit-field') || '';
    const teamEl = input.closest('.inflation-edit-team');
    if (!teamEl) return;

    if (field === 'support') {
      const backup = teamEl.querySelector('[data-edit-team-field="backup"]');
      if (backup && input.value !== FUKA_KEY) backup.value = '';
    }

    if (field === 'slot0' || field === 'slot1' || field === 'slot2') {
      const main = teamEl.querySelector('[data-edit-team-field="mainDealer"]');
      const slots = ['slot0', 'slot1', 'slot2']
        .map((slotField) => teamEl.querySelector(`[data-edit-team-field="${slotField}"]`)?.value || '')
        .filter(Boolean);
      if (main && main.value && !slots.includes(main.value)) main.value = '';
      if (main && !main.value && input.value) main.value = input.value;
    }
  }

  function closeEditCharacterPicker() {
    const modal = state.editPanel ? state.editPanel.querySelector('.inflation-edit-picker-modal') : null;
    if (modal) modal.remove();
    state.editPicker = null;
  }

  function syncDraftFromForm() {
    if (!state.editPanel || !state.editDraft) return;
    const entries = Array.isArray(state.editDraft.entries) ? cloneData(state.editDraft.entries) : [];
    Array.from(state.editPanel.querySelectorAll('.inflation-edit-entry')).forEach((entryEl) => {
      const getEntryValue = (field) => {
        const input = entryEl.querySelector(`[data-edit-field="${field}"]`);
        return input ? String(input.value || '').trim() : '';
      };
      const teams = Array.from(entryEl.querySelectorAll('.inflation-edit-team')).map((teamEl) => {
        const getTeamValue = (field) => {
          const input = teamEl.querySelector(`[data-edit-team-field="${field}"]`);
          return input ? String(input.value || '').trim() : '';
        };
        const support = getTeamValue('support');
        const backup = getTeamValue('backup');
        const party = {
          slots: [getTeamValue('slot0'), getTeamValue('slot1'), getTeamValue('slot2')],
          support
        };
        if (backup) party.backup = backup;
        return {
          id: getTeamValue('id'),
          phase: getTeamValue('phase'),
          scoreEok: Number(getTeamValue('scoreEok')),
          mainDealer: getTeamValue('mainDealer'),
          mainDealerType: getTeamValue('mainDealerType'),
          party,
          note: getTeamValue('note')
        };
      });
      const entryIndex = Number(entryEl.getAttribute('data-entry-index'));
      if (!Number.isInteger(entryIndex) || entryIndex < 0) return;
      entries[entryIndex] = {
        id: getEntryValue('id'),
        version: getEntryValue('version'),
        releasedCharacter: getEntryValue('releasedCharacter'),
        releaseDate: getEntryValue('releaseDate'),
        teams
      };
    });
    state.editDraft = { unit: 'eok', entries };
    state.editDirty = stableDraftString(state.editDraft) !== state.editBaseline;
    setRuntimeData(state.editDraft);
    updateEditStatusOnly();
  }

  function setRuntimeData(data) {
    state.data = cloneData(data || { unit: 'eok', entries: [] });
    window.InflationData = cloneData(state.data);
    state.entries = normalizeEntriesFromData(state.data);
    render();
  }

  function scheduleDraftValidation() {
    clearTimeout(state.validateTimer);
    state.validateTimer = setTimeout(validateDraft, 250);
  }

  async function validateDraft() {
    if (!state.editConnected || !state.editDraft) return;
    const seq = state.validateSeq + 1;
    state.validateSeq = seq;
    try {
      const result = await requestAdmin('/api/inflation/validate', {
        method: 'POST',
        body: { data: state.editDraft }
      });
      if (seq !== state.validateSeq) return;
      state.editValidation = result.validation || { ok: Boolean(result.ok), errors: [] };
      updateEditStatusOnly();
    } catch (error) {
      if (seq !== state.validateSeq) return;
      state.editValidation = {
        ok: false,
        errors: [{ message: String(error?.message || error) }]
      };
      updateEditStatusOnly();
    }
  }

  function updateEditStatusOnly() {
    const status = state.editPanel ? state.editPanel.querySelector('.inflation-edit-status') : null;
    const save = state.editPanel ? state.editPanel.querySelector('[data-edit-action="save"]') : null;
    const validation = state.editValidation || { ok: false, errors: [] };
    if (status) {
      status.textContent = state.editDirty ? t('editDirty', 'Unsaved changes') : t('editSaved', 'Saved');
      status.classList.toggle('is-dirty', state.editDirty);
    }
    if (save) {
      save.disabled = state.editSaving || !state.editDirty || !validation.ok;
    }
    const box = state.editPanel ? state.editPanel.querySelector('.inflation-edit-validation') : null;
    if (box) {
      const entries = state.editDraft && Array.isArray(state.editDraft.entries) ? state.editDraft.entries : [];
      const activeEntry = entries[clampEntryIndex(state.editActiveEntryIndex, entries)] || null;
      const errors = Array.isArray(validation.errors) ? validation.errors : [];
      const next = document.createElement('div');
      next.innerHTML = errors.length && isEditEntryBlank(activeEntry)
        ? renderEditPendingSummary()
        : renderValidationSummary(errors);
      box.replaceWith(next.firstElementChild);
    }
  }

  function afterStructuralEdit() {
    state.editActiveEntryIndex = clampEntryIndex(state.editActiveEntryIndex, state.editDraft.entries || []);
    state.editDirty = stableDraftString(state.editDraft) !== state.editBaseline;
    setRuntimeData(state.editDraft);
    renderEditConnected();
    scheduleDraftValidation();
  }

  function addEntry() {
    const entry = {
      id: makeEntryId('', ''),
      version: '',
      releasedCharacter: '',
      releaseDate: '',
      teams: []
    };
    state.editDraft.entries.push(entry);
    state.editActiveEntryIndex = state.editDraft.entries.length - 1;
  }

  function duplicateEntry(entryIndex) {
    const source = state.editDraft.entries[entryIndex];
    if (!source) return;
    const next = cloneData(source);
    next.id = makeEntryId(next.version, next.releasedCharacter);
    next.teams = (next.teams || []).map((team, index) => ({
      ...team,
      id: makeTeamId(next, team, index)
    }));
    state.editDraft.entries.splice(entryIndex + 1, 0, next);
    state.editActiveEntryIndex = entryIndex + 1;
  }

  function deleteEntry(entryIndex) {
    if (!Number.isInteger(entryIndex)) return;
    state.editDraft.entries.splice(entryIndex, 1);
    state.editActiveEntryIndex = clampEntryIndex(Math.min(entryIndex, state.editDraft.entries.length - 1), state.editDraft.entries);
  }

  function regenerateEntryId(entryIndex) {
    const entry = state.editDraft.entries[entryIndex];
    if (!entry) return;
    entry.id = makeEntryId(entry.version, entry.releasedCharacter);
    entry.teams = (entry.teams || []).map((team, index) => ({
      ...team,
      id: makeTeamId(entry, team, index)
    }));
  }

  function addTeam(entryIndex, phase = '') {
    const entry = state.editDraft.entries[entryIndex];
    if (!entry) return;
    entry.teams = Array.isArray(entry.teams) ? entry.teams : [];
    entry.teams.push(makeDefaultTeam(entry, phase));
  }

  function duplicateTeam(entryIndex, teamIndex) {
    const entry = state.editDraft.entries[entryIndex];
    const team = entry?.teams?.[teamIndex];
    if (!entry || !team) return;
    const next = cloneData(team);
    next.id = makeTeamId(entry, next, entry.teams.length);
    entry.teams.splice(teamIndex + 1, 0, next);
  }

  function deleteTeam(entryIndex, teamIndex) {
    const entry = state.editDraft.entries[entryIndex];
    if (!entry || !Number.isInteger(teamIndex)) return;
    entry.teams.splice(teamIndex, 1);
  }

  function regenerateTeamId(entryIndex, teamIndex) {
    const entry = state.editDraft.entries[entryIndex];
    const team = entry?.teams?.[teamIndex];
    if (!entry || !team) return;
    team.id = makeTeamId(entry, team, teamIndex);
  }

  function makeDefaultTeam(entry, phase = '') {
    return {
      id: makeTeamId(entry, { mainDealer: '' }, (entry.teams || []).length),
      phase: PHASES.includes(phase) ? phase : nextDefaultPhase(entry),
      scoreEok: '',
      mainDealer: '',
      mainDealerType: '지배',
      party: {
        slots: ['', '', ''],
        support: ''
      },
      note: ''
    };
  }

  function nextDefaultPhase(entry) {
    const teams = Array.isArray(entry.teams) ? entry.teams : [];
    const hasFirst = teams.some((team) => team.phase === 'first');
    const hasSecond = teams.some((team) => team.phase === 'second');
    if (!hasFirst) return 'first';
    if (!hasSecond) return 'second';
    return 'first';
  }

  async function saveDraft() {
    if (!state.editConnected || !state.editDraft || state.editSaving) return;
    syncDraftFromForm();
    state.editSaving = true;
    updateEditStatusOnly();
    try {
      const result = await requestAdmin('/api/inflation/save', {
        method: 'POST',
        body: {
          fileHash: state.editFileHash,
          data: state.editDraft
        }
      });
      state.editSaving = false;
      state.editFileHash = result.fileHash || state.editFileHash;
      state.editDraft = cloneData(result.data || state.editDraft);
      state.editBaseline = stableDraftString(state.editDraft);
      state.editDirty = false;
      state.editValidation = result.validation || { ok: true, errors: [] };
      setRuntimeData(state.editDraft);
      renderEditConnected();
    } catch (error) {
      state.editSaving = false;
      state.editValidation = {
        ok: false,
        errors: [{ message: String(error?.message || error) }]
      };
      renderEditConnected();
    }
  }

  function stableDraftString(data) {
    return JSON.stringify(data || { unit: 'eok', entries: [] });
  }

  function getInitialEditEntryIndex(data) {
    const entries = data && Array.isArray(data.entries) ? data.entries : [];
    return entries.length > 0 ? 0 : 0;
  }

  function clampEntryIndex(index, entries) {
    const list = Array.isArray(entries) ? entries : [];
    if (!list.length) return 0;
    const value = Number(index);
    if (!Number.isFinite(value)) return 0;
    return Math.min(Math.max(Math.trunc(value), 0), list.length - 1);
  }

  function buildLocalCharacterOptions() {
    return Object.keys(window.characterData || {})
      .map((key) => ({ key }))
      .sort((a, b) => a.key.localeCompare(b.key, 'ko'));
  }

  function buildLocalReleaseOptions() {
    return parseScheduleReleases(window.ReleaseScheduleData || {})
      .flatMap((release) => (release.characters || []).map((character) => ({
        version: release.version || '',
        date: release.date || '',
        character
      })));
  }

  function hasCharacter(key) {
    return state.characters.some((character) => character.key === key)
      || Boolean(window.characterData && window.characterData[key]);
  }

  function makeEntryId(version, character) {
    return `v${slugPart(version || 'entry')}-${slugPart(character || 'new')}-${Date.now().toString(36)}`;
  }

  function makeTeamId(entry, team, index) {
    return `${entry.id || makeEntryId(entry.version, entry.releasedCharacter)}-${slugPart(team.mainDealer || 'team')}-${index + 1}-${Date.now().toString(36)}`;
  }

  function slugPart(value) {
    const ascii = String(value || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return ascii || `k${simpleHash(value)}`;
  }

  function simpleHash(value) {
    let hash = 0;
    const text = String(value || '');
    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  function getCharacterDisplayName(name) {
    return String(name || '');
  }

  function getPreferredScoreInputUnit(scoreEok) {
    const value = Number(scoreEok);
    if (Number.isFinite(value) && value > 0 && value < 1) return 'man';
    return 'eok';
  }

  function getScoreInputUnitLabel(unit) {
    if (unit === 'man') return t('editScoreUnitMan', '10K');
    return t('editScoreUnitEok', '100M');
  }

  function formatScoreInputValue(scoreEok, unit) {
    const value = Number(scoreEok);
    if (!Number.isFinite(value) || value <= 0) return '';
    const multiplier = SCORE_UNIT_MULTIPLIERS[unit] || 1;
    return formatScoreEokDataValue(value / multiplier);
  }

  function formatScoreEokDataValue(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return '';
    return number.toFixed(4).replace(/\.?0+$/, '');
  }

  function updateScoreHiddenFromControl(control) {
    if (!control) return;
    const visible = control.querySelector('[data-edit-score-value]');
    const hidden = control.querySelector('[data-edit-team-field="scoreEok"]');
    const unitInput = control.querySelector('[data-edit-score-unit]');
    if (!visible || !hidden) return;

    const unit = unitInput && SCORE_UNIT_MULTIPLIERS[unitInput.value] ? unitInput.value : 'eok';
    const displayValue = Number(visible.value);
    if (!Number.isFinite(displayValue) || displayValue <= 0) {
      hidden.value = '';
      return;
    }

    hidden.value = formatScoreEokDataValue(displayValue * SCORE_UNIT_MULTIPLIERS[unit]);
  }

  function getCharacterSearchText(name) {
    const data = window.characterData && window.characterData[name] || {};
    return normalizeSearchText([
      name,
      data.name,
      data.name_en,
      data.name_jp,
      data.name_cn,
      data.codename,
      data.codename_en
    ].filter(Boolean).join(' '));
  }

  function normalizeSearchText(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function getPositionLabel(type) {
    const labels = POSITION_LABELS[getLang()] || POSITION_LABELS.kr;
    return labels[type] || type || '';
  }

  function getPhaseLabel(phase) {
    const labels = PHASE_LABELS[getLang()] || PHASE_LABELS.kr;
    return labels[phase] || phase || '';
  }

  function getPhaseShortLabel(phase) {
    if (phase === 'first') return t('chartFirstShort', '1H');
    if (phase === 'second') return t('chartSecondShort', '2H');
    return getPhaseLabel(phase);
  }

  function characterImageUrl(name) {
    return `${baseUrl()}/assets/img/tier/${encodeURIComponent(name)}.webp`;
  }

  function baseUrl() {
    return typeof window.BASE_URL === 'string' ? window.BASE_URL : '';
  }

  function formatDate(dateString) {
    const parts = String(dateString || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return dateString;
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    const locale = ({ kr: 'ko-KR', en: 'en-US', jp: 'ja-JP', cn: 'zh-CN' })[getLang()] || 'ko-KR';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  }

  function formatScore(value) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0 && number < 1) {
      const manScore = formatNumber(number * 10000);
      if (getLang() === 'en') return `${manScore} ${t('scoreUnitManFull', '10K unit')}`;
      return `${manScore}${t('scoreUnitMan', '만')}`;
    }
    const formatted = formatNumber(value);
    if (getLang() === 'kr') return `${formatted}${t('scoreUnit', '억')}`;
    return `${formatted} ${t('scoreUnitFull', '100M unit')}`;
  }

  function formatNumber(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return '0';
    const fixed = Math.round(num * 10) / 10;
    return Number.isInteger(fixed) ? String(fixed) : fixed.toFixed(1);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(String(value == null ? '' : value));
    }
    return String(value == null ? '' : value).replace(/["\\]/g, '\\$&');
  }
})();
