const state = {
  domain: 'character',
  capabilities: [],
  listRows: [],
  reportRows: [],
  ignoredItems: [],
  selectedIds: new Set(),
  selectedDiffKeys: new Set(),
  selectedIgnoredKeys: new Set(),
  ignoredSearch: '',
  ignoredRuleCount: 0,
  ignoredCount: 0,
  ignoredTotalCount: 0,
  activeRowId: null,
  activeListIndex: null,
  listSearch: '',
  reportSearch: '',
  dataDomain: 'character',
  dataRoots: [],
  dataRoot: '',
  dataFileSearch: '',
  dataFiles: [],
  dataFilePath: '',
  selectedDataFile: null,
  dataEditorDirty: false,
  selectedParts: new Set(),
  showChangedLinesOnly: false
};

const DOMAIN_PARTS = {
  character: ['ritual', 'skill', 'weapon', 'base_stats'],
  persona: ['profile', 'innate_skill', 'passive_skill', 'uniqueSkill', 'highlight'],
  wonder_weapon: ['name', 'effect']
};

const FALLBACK_CAPABILITIES = [
  { id: 'character', label: 'Character', enabled: true, features: ['list', 'report', 'patch', 'create'], parts: DOMAIN_PARTS.character },
  { id: 'persona', label: 'Persona', enabled: true, features: ['list', 'report', 'patch'], parts: DOMAIN_PARTS.persona },
  { id: 'wonder_weapon', label: 'Wonder Weapon', enabled: true, features: ['list', 'report', 'patch'], parts: DOMAIN_PARTS.wonder_weapon }
];

const APP_VERSION = 'patch-console v0.9.2';

const dom = {
  domainTabs: document.getElementById('domain-tabs'),
  currentDomain: document.getElementById('current-domain'),
  addCharacterGroup: document.getElementById('add-character-group'),
  langsInput: document.getElementById('langs-input'),
  scopeMode: document.getElementById('scope-mode'),
  scopeValue: document.getElementById('scope-value'),
  listSearch: document.getElementById('list-search'),
  reportSearch: document.getElementById('report-search'),
  btnLoadList: document.getElementById('btn-load-list'),
  btnReport: document.getElementById('btn-report'),
  btnSelectAll: document.getElementById('btn-select-all'),
  btnClearSelect: document.getElementById('btn-clear-select'),
  btnDryrunSelected: document.getElementById('btn-dryrun-selected'),
  btnPatchSelected: document.getElementById('btn-patch-selected'),
  btnDryrunFilter: document.getElementById('btn-dryrun-filter'),
  btnPatchFilter: document.getElementById('btn-patch-filter'),
  btnClearLog: document.getElementById('btn-clear-log'),
  reportTbody: document.getElementById('report-tbody'),
  charList: document.getElementById('char-list'),
  partsPicker: document.getElementById('parts-picker'),
  partsToggle: document.getElementById('parts-toggle'),
  partsMenu: document.getElementById('parts-menu'),
  selectedCount: document.getElementById('selected-count'),
  selectedDiffCount: document.getElementById('selected-diff-count'),
  reportCount: document.getElementById('report-count'),
  listCount: document.getElementById('list-count'),
  ignoredCount: document.getElementById('ignored-count'),
  ignoredTotalCountText: document.getElementById('ignored-total-count'),
  ignoredSearch: document.getElementById('ignored-search'),
  ignoredSearchClear: document.getElementById('btn-clear-ignored-search'),
  btnUnignoreFiltered: document.getElementById('btn-unignore-filtered'),
  reportFile: document.getElementById('report-file'),
  logOutput: document.getElementById('log-output'),
  detailTitle: document.getElementById('detail-title'),
  detailContent: document.getElementById('detail-content'),
  detailAvatar: document.getElementById('detail-avatar'),
  dataDomains: document.getElementById('data-domain'),
  dataRootsSelect: document.getElementById('data-root'),
  dataFileSearch: document.getElementById('data-file-search'),
  btnLoadDataFiles: document.getElementById('btn-load-data-files'),
  btnReloadDataFile: document.getElementById('btn-reload-data-file'),
  dataFileList: document.getElementById('data-file-list'),
  dataFilePathInput: document.getElementById('data-file-path'),
  dataEditor: document.getElementById('data-editor'),
  dataEditorStatus: document.getElementById('data-editor-status'),
  btnLoadDataFile: document.getElementById('btn-load-data-file'),
  btnSaveDataFile: document.getElementById('btn-save-data-file'),
  ignoredList: document.getElementById('ignored-list'),
  btnLoadIgnored: document.getElementById('btn-load-ignored'),
  btnUnignoreSelected: document.getElementById('btn-unignore-selected'),
  newApi: document.getElementById('new-api'),
  newLocal: document.getElementById('new-local'),
  newKey: document.getElementById('new-key'),
  btnAddCharacter: document.getElementById('btn-add-character')
};

function appendLog(message) {
  if (!dom.logOutput) return;
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  dom.logOutput.textContent += `[${ts}] ${message}\n`;
  dom.logOutput.scrollTop = dom.logOutput.scrollHeight;
}

function clearLog() {
  if (!dom.logOutput) return;
  dom.logOutput.textContent = '';
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function asCsv(values) {
  return values.map((x) => String(x).trim()).filter(Boolean).join(',');
}

function parseCsv(value) {
  return String(value || '').split(',').map((x) => x.trim()).filter(Boolean);
}

function domainInfoById(domain) {
  const source = state.capabilities.length > 0 ? state.capabilities : FALLBACK_CAPABILITIES;
  return source.find((item) => item.id === domain) || null;
}

function partsForDomain(domain = state.domain) {
  const info = domainInfoById(domain);
  if (info && Array.isArray(info.parts) && info.parts.length > 0) {
    return info.parts.map((part) => String(part || '').trim()).filter(Boolean);
  }
  return DOMAIN_PARTS[domain] || DOMAIN_PARTS.character;
}

function resetSelectedParts(domain = state.domain) {
  const parts = partsForDomain(domain);
  state.selectedParts = new Set(parts);
}

function selectedPartsCsv() {
  const parts = partsForDomain().filter((part) => state.selectedParts.has(part));
  return asCsv(parts);
}

function renderPartsMenu() {
  if (!dom.partsMenu) return;
  const parts = partsForDomain();
  const selected = new Set([...state.selectedParts].filter((part) => parts.includes(part)));
  if (selected.size === 0 && parts.length > 0) {
    selected.add(parts[0]);
  }
  state.selectedParts = selected;

  dom.partsMenu.innerHTML = parts
    .map((part) => {
      const checked = state.selectedParts.has(part) ? 'checked' : '';
      return `<label><input type="checkbox" value="${escapeHtml(part)}" ${checked}> ${escapeHtml(part)}</label>`;
    })
    .join('');
}

function updatePartsToggleLabel() {
  if (!dom.partsToggle) return;
  const ordered = partsForDomain();
  const parts = ordered.filter((part) => state.selectedParts.has(part));
  if (parts.length === 0) {
    dom.partsToggle.textContent = '선택된 파트 없음';
    return;
  }
  dom.partsToggle.textContent = parts.length === ordered.length ? '전체 파트' : parts.join(', ');
}

function readFilterForm() {
  return {
    domain: state.domain,
    langs: asCsv(parseCsv(dom.langsInput?.value || '')) || 'kr,en,jp',
    parts: selectedPartsCsv(),
    scopeMode: dom.scopeMode?.value || 'all',
    scopeValue: String(dom.scopeValue?.value || '').trim()
  };
}

function setPending(button, pending) {
  if (!button) return;
  if (pending) {
    button.dataset.prev = button.textContent;
    button.textContent = '진행 중...';
    button.disabled = true;
  } else {
    button.textContent = button.dataset.prev || button.textContent;
    button.disabled = false;
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    const message = payload.error || `HTTP ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

function renderCounts() {
  if (dom.listCount) dom.listCount.textContent = String(state.listRows.length);
  if (dom.reportCount) dom.reportCount.textContent = String(state.reportRows.length);
  if (dom.selectedCount) dom.selectedCount.textContent = String(state.selectedIds.size);
  if (dom.selectedDiffCount) dom.selectedDiffCount.textContent = String(state.selectedDiffKeys.size);
  if (dom.ignoredCount) dom.ignoredCount.textContent = String(state.ignoredCount);
  if (dom.ignoredTotalCountText) {
    dom.ignoredTotalCountText.textContent = String(state.ignoredTotalCount || 0);
  }
}

function filteredIgnoredItems() {
  if (!state.ignoredItems || state.ignoredItems.length === 0) return [];
  const q = String(state.ignoredSearch || '').trim().toLowerCase();
  if (!q) return state.ignoredItems;
  return state.ignoredItems.filter((item) => {
    const text = `${item.index} ${item.lang} ${item.api} ${item.local} ${item.characterKey} ${item.part} ${item.path} ${item.matcher || ''}`.toLowerCase();
    return text.includes(q);
  });
}

function setDataEditorDirty(dirty) {
  state.dataEditorDirty = Boolean(dirty);
  if (dom.dataEditorStatus) {
    dom.dataEditorStatus.textContent = state.dataEditorDirty
      ? '편집 중: 저장 필요'
      : '로드된 파일: 변경 없음';
  }
}

function closestFromTarget(target, selector) {
  if (target instanceof Element) return target.closest(selector);
  if (target && target.parentElement) return target.parentElement.closest(selector);
  return null;
}

function rowId(row) {
  return row.rowId || `${row.index}:${row.lang}:${row.api}`;
}

function iconHtml(row, className = 'table-icon') {
  if (row.icon) {
    return `<img class="${className}" src="${escapeHtml(row.icon)}" alt="">`;
  }
  return `<div class="${className} char-icon-fallback">N/A</div>`;
}

function setDetailAvatar(row) {
  if (!dom.detailAvatar) return;
  if (row && row.icon) {
    dom.detailAvatar.innerHTML = `<img src="${escapeHtml(row.icon)}" alt="">`;
    return;
  }
  dom.detailAvatar.textContent = 'N/A';
}

function domainInfo() {
  return domainInfoById(state.domain);
}

function domainSupports(feature) {
  const info = domainInfo();
  if (!info) return state.domain === 'character';
  return Boolean(info.enabled && Array.isArray(info.features) && info.features.includes(feature));
}

function updateDomainDependentUi() {
  if (dom.currentDomain) dom.currentDomain.textContent = state.domain;
  if (!dom.addCharacterGroup) return;
  if (state.domain === 'character') dom.addCharacterGroup.classList.remove('hidden');
  else dom.addCharacterGroup.classList.add('hidden');
}

function renderDomainTabs() {
  if (!dom.domainTabs) return;
  const source = state.capabilities.length > 0 ? state.capabilities : FALLBACK_CAPABILITIES;
  dom.domainTabs.innerHTML = source
    .map((cap) => {
      const classes = ['domain-tab'];
      if (cap.id === state.domain) classes.push('active');
      if (!cap.enabled) classes.push('disabled');
      const title = cap.enabled ? cap.label : `${cap.label} (준비중)`;
      return `<button class="${classes.join(' ')}" data-domain="${escapeHtml(cap.id)}">${escapeHtml(title)}</button>`;
    })
    .join('');
}

function filteredListRows() {
  const q = state.listSearch.trim().toLowerCase();
  if (!q) return state.listRows;
  return state.listRows.filter((row) => `${row.index} ${row.api} ${row.local} ${row.key}`.toLowerCase().includes(q));
}

function renderCharList() {
  if (!dom.charList) return;
  const rows = filteredListRows();
  if (rows.length === 0) {
    dom.charList.innerHTML = '<p class="muted" style="padding:10px;">표시할 목록이 없습니다.</p>';
    renderCounts();
    return;
  }

  dom.charList.innerHTML = rows
    .map((row) => {
      const active = state.activeListIndex === row.index ? 'active' : '';
      const status = ['kr', 'en', 'jp']
        .map((lang) => {
          const mark = String(row.status?.[lang] || 'N').toLowerCase();
          return `<span class="status-dot ${mark === 'y' ? 'y' : 'n'}" title="${lang}:${mark.toUpperCase()}"></span>`;
        })
        .join('');

      return `
        <div class="char-item ${active}" data-index="${row.index}">
          ${row.icon ? `<img class="char-icon" src="${escapeHtml(row.icon)}" alt="">` : '<div class="char-icon-fallback">N/A</div>'}
          <div class="char-main">
            <strong>#${row.index} ${escapeHtml(row.api)}</strong>
            <p>${escapeHtml(row.local)} | ${escapeHtml(row.key)} ${status}</p>
          </div>
        </div>
      `;
    })
    .join('');

  renderCounts();
}

function filteredReportRows() {
  const q = state.reportSearch.trim().toLowerCase();
  if (!q) return state.reportRows;
  return state.reportRows.filter((row) => {
    const text = `${row.index} ${row.lang} ${row.api} ${row.local} ${row.key} ${row.partsText} ${row.diffSample}`.toLowerCase();
    return text.includes(q);
  });
}

function previewText(text) {
  const raw = String(text || '');
  if (raw.length <= 180) return raw;
  return `${raw.slice(0, 180)} ...`;
}

function stringifyValue(value) {
  if (value === undefined) return '(undefined)';
  if (value === null) return 'null';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function clampText(text, maxLen = 500) {
  const raw = String(text || '');
  if (raw.length <= maxLen) return raw;
  return `${raw.slice(0, maxLen)} ...`;
}

function splitValueToLines(value, maxLen = 2000) {
  const text = clampText(stringifyValue(value), maxLen);
  const lines = String(text).replace(/\r\n/g, '\n').split('\n');
  return lines.length > 0 ? lines : [''];
}

function tokenizeForDiff(text) {
  const src = String(text ?? '');
  const tokens = src.match(/[\u3131-\uD79D]+|[A-Za-z0-9_]+|\s+|./g);
  return tokens && tokens.length > 0 ? tokens : [''];
}

function buildLcsDiff(beforeTokens, afterTokens) {
  const n = beforeTokens.length;
  const m = afterTokens.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      if (beforeTokens[i] === afterTokens[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (beforeTokens[i] === afterTokens[j]) {
      ops.push({ type: 'eq', token: beforeTokens[i] });
      i += 1;
      j += 1;
      continue;
    }
    if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'del', token: beforeTokens[i] });
      i += 1;
    } else {
      ops.push({ type: 'add', token: afterTokens[j] });
      j += 1;
    }
  }
  while (i < n) {
    ops.push({ type: 'del', token: beforeTokens[i] });
    i += 1;
  }
  while (j < m) {
    ops.push({ type: 'add', token: afterTokens[j] });
    j += 1;
  }
  return ops;
}

function markDiffPairFast(beforeLine, afterLine) {
  const before = String(beforeLine ?? '');
  const after = String(afterLine ?? '');

  if (before === after) {
    const escaped = escapeHtml(before || ' ');
    return {
      changed: false,
      beforeHtml: escaped,
      afterHtml: escaped
    };
  }

  const minLen = Math.min(before.length, after.length);
  let start = 0;
  while (start < minLen && before[start] === after[start]) {
    start += 1;
  }

  let beforeEnd = before.length - 1;
  let afterEnd = after.length - 1;
  while (beforeEnd >= start && afterEnd >= start && before[beforeEnd] === after[afterEnd]) {
    beforeEnd -= 1;
    afterEnd -= 1;
  }

  const beforeHead = escapeHtml(before.slice(0, start));
  const beforeMid = escapeHtml(before.slice(start, beforeEnd + 1) || ' ');
  const beforeTail = escapeHtml(before.slice(beforeEnd + 1));

  const afterHead = escapeHtml(after.slice(0, start));
  const afterMid = escapeHtml(after.slice(start, afterEnd + 1) || ' ');
  const afterTail = escapeHtml(after.slice(afterEnd + 1));

  return {
    changed: true,
    beforeHtml: `${beforeHead}<span class="diff-inline-change before">${beforeMid}</span>${beforeTail}`,
    afterHtml: `${afterHead}<span class="diff-inline-change after">${afterMid}</span>${afterTail}`,
    removedCount: 1,
    addedCount: 1
  };
}

function markDiffPair(beforeLine, afterLine) {
  const before = String(beforeLine ?? '');
  const after = String(afterLine ?? '');
  if (before === after) {
    const escaped = escapeHtml(before || ' ');
    return {
      changed: false,
      beforeHtml: escaped,
      afterHtml: escaped,
      removedCount: 0,
      addedCount: 0
    };
  }

  const beforeTokens = tokenizeForDiff(before);
  const afterTokens = tokenizeForDiff(after);
  const tokenCap = 280;
  const complexityCap = 50000;

  if (
    beforeTokens.length > tokenCap
    || afterTokens.length > tokenCap
    || (beforeTokens.length * afterTokens.length) > complexityCap
  ) {
    return markDiffPairFast(before, after);
  }

  const ops = buildLcsDiff(beforeTokens, afterTokens);
  let beforeHtml = '';
  let afterHtml = '';
  let removedCount = 0;
  let addedCount = 0;

  for (const op of ops) {
    const tokenText = escapeHtml(op.token || ' ');
    if (op.type === 'eq') {
      beforeHtml += tokenText;
      afterHtml += tokenText;
      continue;
    }
    if (op.type === 'del') {
      beforeHtml += `<span class="diff-inline-change before">${tokenText}</span>`;
      if (String(op.token || '').trim()) removedCount += 1;
      continue;
    }
    if (op.type === 'add') {
      afterHtml += `<span class="diff-inline-change after">${tokenText}</span>`;
      if (String(op.token || '').trim()) addedCount += 1;
    }
  }

  return {
    changed: removedCount > 0 || addedCount > 0,
    beforeHtml: beforeHtml || '&nbsp;',
    afterHtml: afterHtml || '&nbsp;',
    removedCount,
    addedCount
  };
}

function renderDiffColumns(beforeValue, afterValue) {
  const beforeLines = splitValueToLines(beforeValue);
  const afterLines = splitValueToLines(afterValue);
  const lineCount = Math.max(beforeLines.length, afterLines.length);

  const linePairs = [];
  let changedLines = 0;
  let removedTokens = 0;
  let addedTokens = 0;

  for (let i = 0; i < lineCount; i += 1) {
    const beforeLine = beforeLines[i] ?? '';
    const afterLine = afterLines[i] ?? '';
    const pair = markDiffPair(beforeLine, afterLine);
    if (pair.changed) changedLines += 1;
    removedTokens += Number(pair.removedCount || 0);
    addedTokens += Number(pair.addedCount || 0);
    linePairs.push({
      changed: pair.changed,
      beforeHtml: pair.beforeHtml,
      afterHtml: pair.afterHtml
    });
  }

  const visibleIndexes = (() => {
    if (!state.showChangedLinesOnly) {
      return new Set([...linePairs.keys()]);
    }
    const changed = [];
    for (let i = 0; i < linePairs.length; i += 1) {
      if (linePairs[i].changed) changed.push(i);
    }
    if (changed.length === 0) {
      return new Set(linePairs.length > 0 ? [0] : []);
    }
    const out = new Set();
    for (const idx of changed) {
      out.add(idx);
      if (idx - 1 >= 0) out.add(idx - 1);
      if (idx + 1 < linePairs.length) out.add(idx + 1);
    }
    return out;
  })();

  const beforeHtmlLines = [];
  const afterHtmlLines = [];
  let hiddenRun = 0;
  for (let i = 0; i < linePairs.length; i += 1) {
    if (!visibleIndexes.has(i)) {
      hiddenRun += 1;
      continue;
    }
    if (hiddenRun > 0) {
      const omitted = `<div class="diff-omitted">... ${hiddenRun} lines hidden ...</div>`;
      beforeHtmlLines.push(omitted);
      afterHtmlLines.push(omitted);
      hiddenRun = 0;
    }
    const changedClass = linePairs[i].changed ? ' changed' : '';
    beforeHtmlLines.push(`<div class="diff-line${changedClass}">${linePairs[i].beforeHtml}</div>`);
    afterHtmlLines.push(`<div class="diff-line${changedClass}">${linePairs[i].afterHtml}</div>`);
  }
  if (hiddenRun > 0) {
    const omitted = `<div class="diff-omitted">... ${hiddenRun} lines hidden ...</div>`;
    beforeHtmlLines.push(omitted);
    afterHtmlLines.push(omitted);
  }

  const summary = changedLines > 0
    ? `<p class="diff-quick">변경 라인 <strong>${changedLines}</strong> / 제거 토큰 <strong>${removedTokens}</strong> / 추가 토큰 <strong>${addedTokens}</strong></p>`
    : '';

  return {
    changedLines,
    removedTokens,
    addedTokens,
    html: `
      ${summary}
      <div class="value-diff-grid">
        <div class="value-diff-col before">
          <p class="diff-col-head">before</p>
          <div class="diff-pre">${beforeHtmlLines.join('')}</div>
        </div>
        <div class="value-diff-col after">
          <p class="diff-col-head">after</p>
          <div class="diff-pre">${afterHtmlLines.join('')}</div>
        </div>
      </div>
    `
  };
}

function makeDiffKey({ index, lang, part, path }) {
  return `${state.domain}|${Number(index)}|${String(lang || '').trim().toLowerCase()}|${String(part || '').trim()}|${String(path || '').trim()}`;
}

function normalizeDiffEntry(entry) {
  return {
    path: String(entry?.path || '').trim(),
    before: entry?.before ?? null,
    after: entry?.after ?? null,
    sampleOnly: Boolean(entry?.sampleOnly)
  };
}

function entriesFromPart(part) {
  const valueDiffs = Array.isArray(part?.valueDiffs) ? part.valueDiffs : [];
  if (valueDiffs.length > 0) return valueDiffs.map((entry) => normalizeDiffEntry(entry)).filter((entry) => entry.path);
  const samplePaths = Array.isArray(part?.samplePaths) ? part.samplePaths : [];
  return samplePaths.map((pathText) => normalizeDiffEntry({ path: pathText, sampleOnly: true })).filter((entry) => entry.path);
}

function collectRowDiffEntries(row) {
  const out = [];
  for (const part of Array.isArray(row.partDiffs) ? row.partDiffs : []) {
    for (const entry of entriesFromPart(part)) {
      const diff = {
        index: row.index,
        lang: row.lang,
        api: row.api,
        local: row.local,
        key: row.key,
        part: part.part,
        path: entry.path,
        before: entry.before,
        after: entry.after,
        sampleOnly: entry.sampleOnly
      };
      diff.diffKey = makeDiffKey(diff);
      out.push(diff);
    }
  }
  return out;
}

function collectAllDiffEntryMap(rows) {
  const map = new Map();
  for (const row of rows) {
    for (const diff of collectRowDiffEntries(row)) {
      map.set(diff.diffKey, diff);
    }
  }
  return map;
}

function selectedDiffEntries() {
  const all = collectAllDiffEntryMap(state.reportRows);
  return [...state.selectedDiffKeys].map((key) => all.get(key)).filter(Boolean);
}

function renderReportTable() {
  if (!dom.reportTbody) return;
  const rows = filteredReportRows();
  if (rows.length === 0) {
    dom.reportTbody.innerHTML = '<tr><td colspan="9" class="empty">조건에 맞는 리포트 행이 없습니다.</td></tr>';
    renderCounts();
    renderDetail();
    return;
  }

  dom.reportTbody.innerHTML = rows
    .map((row) => {
      const id = rowId(row);
      const checked = state.selectedIds.has(id) ? 'checked' : '';
      const selectedClass = state.selectedIds.has(id) ? 'selected' : '';
      const activeClass = state.activeRowId === id ? 'active' : '';
      const partTags = (row.partDiffs || [])
        .map((part) => `<span class="chip">${escapeHtml(part.part)}${part.diffCount == null ? '' : `(${part.diffCount})`}</span>`)
        .join('');

      return `
        <tr class="${selectedClass} ${activeClass}" data-row-id="${escapeHtml(id)}">
          <td><input type="checkbox" data-row-id="${escapeHtml(id)}" ${checked}></td>
          <td>${row.index}</td>
          <td>${iconHtml(row)}</td>
          <td>${escapeHtml(row.lang)}</td>
          <td>${escapeHtml(row.api)}</td>
          <td>${escapeHtml(row.local)}</td>
          <td>${escapeHtml(row.key)}</td>
          <td>${partTags || '-'}</td>
          <td><div class="preview">${escapeHtml(previewText(row.diffSample || ''))}</div></td>
        </tr>
      `;
    })
    .join('');

  renderCounts();
  renderDetail();
}

function activeRow() {
  if (!state.activeRowId) return null;
  return state.reportRows.find((row) => rowId(row) === state.activeRowId) || null;
}
function renderIgnoredList() {
  if (!dom.ignoredList) return;
  const items = filteredIgnoredItems();
  if (!items.length) {
    dom.ignoredList.innerHTML = '<p class="muted" style="padding:10px;">무시한 Diff가 없습니다.</p>';
    renderCounts();
    return;
  }

  dom.ignoredList.innerHTML = items
    .map((item) => {
      const checked = state.selectedIgnoredKeys.has(item.key) ? 'checked' : '';
      return `
        <label class="ignored-item">
          <input type="checkbox" data-ignore-key="${escapeHtml(item.key)}" ${checked}>
          <div>
            <p><strong>#${item.index} ${escapeHtml(item.lang)} ${escapeHtml(item.part)}</strong></p>
            <p>${escapeHtml(item.api)} / ${escapeHtml(item.local)} / ${escapeHtml(item.characterKey)}</p>
            <p><code>${escapeHtml(item.path)}</code></p>
          </div>
        </label>
      `;
    })
    .join('');

  renderCounts();
}

async function loadDataRoots() {
  const result = await requestJson(`/api/data-roots?domain=${encodeURIComponent(state.dataDomain)}`);
  state.dataRoots = Array.isArray(result?.roots) ? result.roots : [];
  state.dataRoot = state.dataRoot || (state.dataRoots[0]?.id || '');
  if (!state.dataRoots.some((item) => item.id === state.dataRoot)) {
    state.dataRoot = state.dataRoots[0]?.id || '';
  }

  if (dom.dataDomains) {
    const domainExists = [...dom.dataDomains.options || []].some((opt) => opt.value === state.dataDomain);
    if (!domainExists) {
      dom.dataDomains.innerHTML = '';
      const existing = getDataAvailableDomains();
      for (const item of existing) {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        dom.dataDomains.appendChild(opt);
      }
    }
    dom.dataDomains.value = state.dataDomain;
  }

  if (dom.dataRootsSelect) {
    dom.dataRootsSelect.innerHTML = state.dataRoots
      .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`)
      .join('');
    dom.dataRootsSelect.value = state.dataRoot || (state.dataRoots[0]?.id || '');
    if (!dom.dataRootsSelect.value && state.dataRoots[0]) {
      dom.dataRootsSelect.value = state.dataRoots[0].id;
    }
  }

  state.dataFiles = [];
  renderDataFiles();
}

function getDataAvailableDomains() {
  return ['character', 'persona', 'wonder_weapon'];
}

function filteredDataFiles() {
  if (!state.dataFiles.length) return [];
  const q = String(state.dataFileSearch || '').trim().toLowerCase();
  if (!q) return state.dataFiles;
  return state.dataFiles.filter((item) => `${item.rootId} ${item.path}`.toLowerCase().includes(q));
}

async function loadDataFileList() {
  if (!state.dataDomain) return;
  const params = new URLSearchParams({
    domain: state.dataDomain
  });
  if (state.dataRoot) params.set('root', state.dataRoot);
  if (state.dataFileSearch) params.set('q', state.dataFileSearch.trim());
  const result = await requestJson(`/api/data-files?${params.toString()}`);
  state.dataFiles = Array.isArray(result.items) ? result.items : [];
  renderDataFiles();
  appendLog(`데이터 파일 목록 조회: ${state.dataFiles.length}개`);
}

function renderDataFiles() {
  if (!dom.dataFileList) return;
  const items = filteredDataFiles();
  if (!items.length) {
    dom.dataFileList.innerHTML = '<p class="muted" style="padding:10px;">조회된 파일이 없습니다.</p>';
    return;
  }
  dom.dataFileList.innerHTML = items
    .map((item) => {
      const selected = state.selectedDataFile
        && state.selectedDataFile.rootId === item.rootId
        && state.selectedDataFile.path === item.path
        ? 'active'
        : '';
      return `
        <button class="data-file-item ${selected}" type="button" data-root-id="${escapeHtml(item.rootId)}" data-file-path="${escapeHtml(item.path)}">
          <p><strong>${escapeHtml(item.rootId)}</strong> / ${escapeHtml(item.path)}</p>
        </button>
      `;
    })
    .join('');
}

async function loadDataFile(item) {
  if (!item || !item.rootId || !item.path) return;
  const params = new URLSearchParams({
    domain: state.dataDomain,
    root: item.rootId,
    path: item.path
  });
  const result = await requestJson(`/api/data-file?${params.toString()}`);
  state.selectedDataFile = {
    domain: state.dataDomain,
    rootId: item.rootId,
    path: item.path
  };
  state.dataFilePath = item.path;
  if (dom.dataFilePathInput) {
    dom.dataFilePathInput.value = `${item.rootId} / ${item.path}`;
  }
  if (dom.dataEditor) {
    dom.dataEditor.value = result.content || '';
  }
  setDataEditorDirty(false);
  appendLog(`데이터 파일 로드: ${item.rootId}/${item.path}`);
  renderDataFiles();
}

async function saveDataFile() {
  if (!state.selectedDataFile || !state.selectedDataFile.path) {
    appendLog('저장할 데이터 파일이 선택되지 않았습니다.');
    return;
  }
  if (!dom.dataEditor) return;
  const content = dom.dataEditor.value;
  if (!window.confirm('선택한 파일을 저장할까요?')) return;
  const result = await requestJson('/api/data-file', {
    method: 'POST',
    body: {
      domain: state.dataDomain,
      root: state.selectedDataFile.rootId,
      path: state.selectedDataFile.path,
      content
    }
  });
  appendLog(`데이터 파일 저장 완료: ${state.selectedDataFile.rootId}/${state.selectedDataFile.path}`);
  if (result.ok) setDataEditorDirty(false);
}

function renderDetail() {
  const row = activeRow();
  if (!dom.detailTitle || !dom.detailContent) return;

  if (!row) {
    dom.detailTitle.textContent = '행을 클릭하면 상세 내용을 볼 수 있습니다.';
    dom.detailContent.innerHTML = '<p class="muted">선택된 행이 없습니다.</p>';
    setDetailAvatar(null);
    return;
  }

  setDetailAvatar(row);
  dom.detailTitle.textContent = `#${row.index} ${row.lang} | ${row.api} / ${row.local} / ${row.key}`;

  const rowDiffs = collectRowDiffEntries(row);
  const rowDiffKeySet = new Set(rowDiffs.map((diff) => diff.diffKey));
  const selectedInRow = rowDiffs.filter((diff) => state.selectedDiffKeys.has(diff.diffKey)).length;

  const partCards = (row.partDiffs || [])
    .map((part) => {
      const diffCount = part.diffCount == null ? '-' : String(part.diffCount);
      const entries = entriesFromPart(part);
      const valueDiffHtml = entries
        .map((entry) => {
          const diffKey = makeDiffKey({
            index: row.index,
            lang: row.lang,
            part: part.part,
            path: entry.path
          });
          const checked = state.selectedDiffKeys.has(diffKey) ? 'checked' : '';
          const meta = entry.sampleOnly ? '<p class="muted small">샘플 경로만 있습니다. 상세 before/after는 report-json 필요</p>' : '';
          const rendered = renderDiffColumns(entry.before, entry.after);
          const diffColumns = rendered.html;

          return `
            <li>
              <label class="diff-checkline">
                <input type="checkbox" class="diff-path-checkbox" data-diff-key="${escapeHtml(diffKey)}" ${checked}>
                <code>${escapeHtml(entry.path)}</code>
              </label>
              ${meta}
              ${diffColumns}
            </li>
          `;
        })
        .join('');

      const hiddenCount = typeof part.hiddenCount === 'number'
        ? part.hiddenCount
        : (typeof part.diffCount === 'number' ? Math.max(part.diffCount - entries.length, 0) : 0);
      const hidden = hiddenCount > 0 ? `<p class="muted small">+ ${hiddenCount}개 경로는 요약에서 생략됨</p>` : '';

      return `
        <article class="part-card">
          <div class="part-head">
            <strong>${escapeHtml(part.part)}</strong>
            <span>diff ${diffCount}</span>
          </div>
          ${valueDiffHtml ? `<ul class="value-diff-list">${valueDiffHtml}</ul>` : '<p class="muted small">샘플 경로 없음</p>'}
          ${hidden}
        </article>
      `;
    })
    .join('');

  dom.detailContent.innerHTML = `
    <div class="detail-actions">
      <button class="btn warn small" id="btn-detail-dryrun">이 행 검증 실행</button>
      <button class="btn danger small" id="btn-detail-patch">이 행 실제 반영</button>
      <button class="btn ghost small ${state.showChangedLinesOnly ? 'toggled' : ''}" id="btn-toggle-changed-lines">${state.showChangedLinesOnly ? '전체 줄 보기' : '변경 줄만 보기'}</button>
    </div>
    <div class="diff-select-row">
      <p class="muted small">현재 행 선택 Diff: <strong>${selectedInRow}</strong> / ${rowDiffs.length}</p>
      <div class="actions">
        <button class="btn ghost small" id="btn-diff-select-all-row">행 Diff 전체 선택</button>
        <button class="btn ghost small" id="btn-diff-clear-row">행 Diff 선택 해제</button>
      </div>
    </div>
    <div class="diff-actions">
      <button class="btn warn small" id="btn-diff-dryrun">선택 Diff 검증 실행</button>
      <button class="btn danger small" id="btn-diff-patch">선택 Diff 실제 반영</button>
      <button class="btn ghost small" id="btn-diff-ignore">선택 Diff 무시</button>
    </div>
    ${partCards || '<p class="muted">표시할 part 정보가 없습니다.</p>'}
    <details>
      <summary>원본 Diff Preview</summary>
      <pre>${escapeHtml(row.diffSample || '')}</pre>
    </details>
  `;

  const btnDry = document.getElementById('btn-detail-dryrun');
  const btnPatch = document.getElementById('btn-detail-patch');
  const btnToggleChangedLines = document.getElementById('btn-toggle-changed-lines');
  const btnSelectAllRow = document.getElementById('btn-diff-select-all-row');
  const btnClearRow = document.getElementById('btn-diff-clear-row');
  const btnDiffDry = document.getElementById('btn-diff-dryrun');
  const btnDiffPatch = document.getElementById('btn-diff-patch');
  const btnDiffIgnore = document.getElementById('btn-diff-ignore');

  if (btnDry) {
    btnDry.addEventListener('click', async () => {
      await runPatchForRows([{ index: row.index, lang: row.lang }], true);
      await generateReport();
    });
  }
  if (btnPatch) {
    btnPatch.addEventListener('click', async () => {
      const ok = window.confirm('이 행을 실제 patch 합니다. 계속할까요?');
      if (!ok) return;
      await runPatchForRows([{ index: row.index, lang: row.lang }], false);
      await generateReport();
    });
  }
  if (btnToggleChangedLines) {
    btnToggleChangedLines.addEventListener('click', () => {
      state.showChangedLinesOnly = !state.showChangedLinesOnly;
      renderDetail();
    });
  }
  if (btnSelectAllRow) {
    btnSelectAllRow.addEventListener('click', () => {
      for (const diff of rowDiffs) state.selectedDiffKeys.add(diff.diffKey);
      renderCounts();
      renderDetail();
    });
  }
  if (btnClearRow) {
    btnClearRow.addEventListener('click', () => {
      for (const key of rowDiffKeySet) state.selectedDiffKeys.delete(key);
      renderCounts();
      renderDetail();
    });
  }
  if (btnDiffDry) btnDiffDry.addEventListener('click', async () => { await runApplySelectedDiffs(true); });
  if (btnDiffPatch) {
    btnDiffPatch.addEventListener('click', async () => {
      const ok = window.confirm('선택한 Diff만 실제 반영합니다. 계속할까요?');
      if (!ok) return;
      await runApplySelectedDiffs(false);
    });
  }
  if (btnDiffIgnore) btnDiffIgnore.addEventListener('click', async () => { await runIgnoreSelectedDiffs(); });
}

async function loadCapabilities() {
  try {
    const result = await requestJson('/api/capabilities');
    state.capabilities = Array.isArray(result.domains) ? result.domains : [];
    if (!state.capabilities.find((item) => item.id === state.domain)) state.domain = result.defaultDomain || 'character';
  } catch (error) {
    state.capabilities = [];
    state.domain = 'character';
    appendLog(`capabilities 로드 실패, fallback 사용: ${error.message}`);
  } finally {
    resetSelectedParts(state.domain);
    renderPartsMenu();
    updatePartsToggleLabel();
    renderDomainTabs();
    updateDomainDependentUi();
  }
}

async function loadList() {
  if (!domainSupports('list')) {
    state.listRows = [];
    renderCharList();
    appendLog(`[${state.domain}] list 기능은 아직 준비중입니다.`);
    return;
  }
  const langs = asCsv(parseCsv(dom.langsInput?.value || '')) || 'kr,en,jp';
  appendLog(`[${state.domain}] 목록 조회: langs=${langs}`);
  const result = await requestJson(`/api/list?domain=${encodeURIComponent(state.domain)}&langs=${encodeURIComponent(langs)}`);
  state.listRows = Array.isArray(result.rows) ? result.rows : [];
  renderCharList();
  appendLog(`[${state.domain}] 목록 조회 완료: ${state.listRows.length}개`);
}

async function loadIgnoredList() {
  const query = [];
  if (state.ignoredSearch) {
    query.push(`q=${encodeURIComponent(state.ignoredSearch)}`);
  }
  const rootQuery = query.length ? `&${query.join('&')}` : '';
  const result = await requestJson(`/api/ignored?domain=${encodeURIComponent(state.domain)}${rootQuery}`);
  state.ignoredItems = Array.isArray(result.items) ? result.items : [];
  state.ignoredCount = Number(result.count || state.ignoredItems.length);
  state.ignoredTotalCount = Number(result.totalCount || result.count || state.ignoredItems.length);
  const ignoreKeySet = new Set(state.ignoredItems.map((item) => item.key));
  state.selectedIgnoredKeys = new Set([...state.selectedIgnoredKeys].filter((key) => ignoreKeySet.has(key)));
  renderIgnoredList();
}

async function generateReport() {
  if (!domainSupports('report')) {
    state.reportRows = [];
    renderReportTable();
    appendLog(`[${state.domain}] report 기능은 아직 준비중입니다.`);
    return;
  }

  const filter = readFilterForm();
  appendLog(`[${state.domain}] 리포트 생성: scope=${filter.scopeMode}(${filter.scopeValue || '-'}) langs=${filter.langs} parts=${filter.parts || 'all'}`);
  const result = await requestJson('/api/report', { method: 'POST', body: filter });

  const prevActive = state.activeRowId;
  const prevSelectedRows = new Set(state.selectedIds);
  const prevSelectedDiffs = new Set(state.selectedDiffKeys);
  const [prevActiveIndex, prevActiveLang] = (() => {
    if (!prevActive) return [null, null];
    const [indexText, langText] = String(prevActive).split(':');
    const index = Number.parseInt(indexText, 10);
    if (Number.isFinite(index)) {
      return [index, String(langText || '').trim().toLowerCase()];
    }
    return [null, null];
  })();

  state.reportRows = Array.isArray(result.rows) ? result.rows : [];
  state.reportRows = state.reportRows.map((row) => ({
    ...row,
    rowId: row.rowId || `${row.index}:${row.lang}:${row.api}`,
    partsText: row.partsText || (row.partDiffs || []).map((part) => `${part.part}(${part.diffCount ?? '-'})`).join(', '),
    diffSample: row.diffSample || ''
  }));

  const rowIdSet = new Set(state.reportRows.map((row) => rowId(row)));
  state.selectedIds = new Set([...prevSelectedRows].filter((id) => rowIdSet.has(id)));

  const diffMap = collectAllDiffEntryMap(state.reportRows);
  state.selectedDiffKeys = new Set([...prevSelectedDiffs].filter((key) => diffMap.has(key)));

  const restoreByIndex = prevActiveIndex == null
    ? null
    : state.reportRows.find((row) => Number(row.index) === prevActiveIndex && (!prevActiveLang || row.lang === prevActiveLang));

  state.activeRowId = prevActive && rowIdSet.has(prevActive)
    ? prevActive
    : restoreByIndex
      ? rowId(restoreByIndex)
      : (state.reportRows[0] ? rowId(state.reportRows[0]) : null);

  if (dom.reportFile) dom.reportFile.textContent = result.reportFile || '-';
  state.ignoredCount = Number(result.ignoredCount || 0);
  renderReportTable();
  renderCounts();
  if (Number(result.autoPatchedCount || 0) > 0) {
    appendLog(`[${state.domain}] 자동 패치 적용: ${result.autoPatchedCount}개 (weapon 소수점 보강)`);
  }
  appendLog(`[${state.domain}] 리포트 생성 완료: ${state.reportRows.length}행 (ignored=${state.ignoredCount})`);
}
function selectedRows() {
  const byId = new Map(state.reportRows.map((row) => [rowId(row), row]));
  return [...state.selectedIds]
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((row) => ({ index: row.index, lang: row.lang }));
}

async function runPatchForRows(rows, dryRun) {
  if (!domainSupports('patch')) {
    appendLog(`[${state.domain}] patch 기능은 아직 준비중입니다.`);
    return;
  }
  if (!rows || rows.length === 0) {
    appendLog('선택된 행이 없습니다.');
    return;
  }

  const filter = readFilterForm();
  const result = await requestJson('/api/patch', {
    method: 'POST',
    body: {
      domain: state.domain,
      rows,
      dryRun,
      parts: filter.parts
    }
  });

  appendLog(`${dryRun ? '검증 실행' : '실제 반영'} 완료: ${result.description || ''}`);
  for (const output of result.outputs || []) {
    const cmd = Array.isArray(output.args) ? output.args.join(' ') : '';
    appendLog(`cmd: node ${cmd}`);
    if (output.stdout) appendLog(output.stdout.trim());
    if (output.stderr) appendLog(output.stderr.trim());
  }
}

async function runPatchByFilter(dryRun) {
  if (!domainSupports('patch')) {
    appendLog(`[${state.domain}] patch 기능은 아직 준비중입니다.`);
    return;
  }

  const filter = readFilterForm();
  if (filter.scopeMode === 'all') {
    appendLog('필터 patch는 all 범위를 지원하지 않습니다. nums/api/local을 선택하세요.');
    return;
  }

  appendLog(`${dryRun ? '검증 실행' : '실제 반영'}: filter ${filter.scopeMode}=${filter.scopeValue}`);
  const result = await requestJson('/api/patch', { method: 'POST', body: filter });

  for (const output of result.outputs || []) {
    const cmd = Array.isArray(output.args) ? output.args.join(' ') : '';
    appendLog(`cmd: node ${cmd}`);
    if (output.stdout) appendLog(output.stdout.trim());
    if (output.stderr) appendLog(output.stderr.trim());
  }
}

async function runApplySelectedDiffs(dryRun) {
  const diffs = selectedDiffEntries();
  if (diffs.length === 0) {
    appendLog('선택된 Diff가 없습니다.');
    return;
  }

  appendLog(`[${state.domain}] 선택 Diff ${dryRun ? '검증' : '실반영'} 실행: ${diffs.length}개`);
  const result = await requestJson('/api/apply-diffs', {
    method: 'POST',
    body: {
      domain: state.domain,
      diffs: diffs.map((diff) => ({
        index: diff.index,
        lang: diff.lang,
        api: diff.api,
        local: diff.local,
        key: diff.key,
        part: diff.part,
        path: diff.path
      })),
      dryRun
    }
  });

  const cmd = Array.isArray(result.args) ? result.args.join(' ') : '';
  if (cmd) appendLog(`cmd: node ${cmd}`);
  if (result.stdout) appendLog(result.stdout.trim());
  if (result.stderr) appendLog(result.stderr.trim());

  await generateReport();
}

async function runIgnoreSelectedDiffs() {
  const diffs = selectedDiffEntries();
  if (diffs.length === 0) {
    appendLog('무시할 Diff가 선택되지 않았습니다.');
    return;
  }

  const result = await requestJson('/api/ignore-diffs', {
    method: 'POST',
    body: {
      domain: state.domain,
      diffs: diffs.map((diff) => ({
        index: diff.index,
        lang: diff.lang,
        api: diff.api,
        local: diff.local,
        key: diff.key,
        part: diff.part,
        path: diff.path,
        before: diff.before,
        after: diff.after
      }))
    }
  });

  appendLog(`[${state.domain}] Diff 무시 처리: +${result.added || 0}개`);
  for (const diff of diffs) state.selectedDiffKeys.delete(diff.diffKey);

  await loadIgnoredList();
  await generateReport();
}

async function runUnignoreFilteredDiffs() {
  const items = filteredIgnoredItems();
  if (!items.length) {
    appendLog('현재 필터에서 해제할 무시 항목이 없습니다.');
    return;
  }
  if (!window.confirm(`현재 무시 검색 결과 ${items.length}건을 해제할까요?`)) return;

  const result = await requestJson('/api/unignore-diffs', {
    method: 'POST',
    body: {
      domain: state.domain,
      keys: items.map((item) => String(item.key || '').trim()).filter(Boolean)
    }
  });
  appendLog(`[${state.domain}] 무시 전체 해제: ${result.removed || 0}건`);
  state.selectedIgnoredKeys.clear();
  await loadIgnoredList();
  await generateReport();
}

async function runUnignoreSelectedDiffs() {
  const keys = [...state.selectedIgnoredKeys];
  if (keys.length === 0) {
    appendLog('무시 해제할 항목이 선택되지 않았습니다.');
    return;
  }

  const result = await requestJson('/api/unignore-diffs', {
    method: 'POST',
    body: {
      domain: state.domain,
      keys
    }
  });

  appendLog(`[${state.domain}] 무시 해제 완료: ${result.removed || 0}개`);
  state.selectedIgnoredKeys.clear();
  await loadIgnoredList();
  await generateReport();
}

function setVisibleSelection(enabled) {
  for (const row of filteredReportRows()) {
    const id = rowId(row);
    if (enabled) state.selectedIds.add(id);
    else state.selectedIds.delete(id);
  }
  renderReportTable();
}

async function addCharacter() {
  if (state.domain !== 'character') {
    appendLog(`[${state.domain}] 신규 캐릭터 추가는 character 도메인에서만 지원합니다.`);
    return;
  }

  const api = String(dom.newApi?.value || '').trim();
  const local = String(dom.newLocal?.value || '').trim();
  const key = String(dom.newKey?.value || '').trim();
  if (!api || !local || !key) {
    appendLog('신규 캐릭터 생성 실패: api/local/key 모두 필요합니다.');
    return;
  }

  appendLog(`신규 캐릭터 생성 요청: api=${api}, local=${local}, key=${key}`);
  const result = await requestJson('/api/add-character', {
    method: 'POST',
    body: { domain: state.domain, api, local, key }
  });

  const created = result.result;
  appendLog(`신규 캐릭터 추가 완료: ${created.entry.api}/${created.entry.local}/${created.entry.key}`);
  if (created.bootstrap?.createdFiles?.length) appendLog(`템플릿 파일 생성: ${created.bootstrap.createdFiles.length}개`);

  if (dom.newApi) dom.newApi.value = '';
  if (dom.newLocal) dom.newLocal.value = '';
  if (dom.newKey) dom.newKey.value = '';

  await loadList();
  const matched = state.listRows.find((row) => String(row.api).toLowerCase() === api.toLowerCase());
  if (matched) {
    state.activeListIndex = matched.index;
    if (dom.scopeMode) dom.scopeMode.value = 'nums';
    if (dom.scopeValue) dom.scopeValue.value = String(matched.index);
    renderCharList();
    await generateReport();
  }
}
function bindPartsPicker() {
  if (!dom.partsToggle || !dom.partsMenu || !dom.partsPicker) return;
  renderPartsMenu();
  updatePartsToggleLabel();
  dom.partsToggle.addEventListener('click', () => {
    dom.partsMenu.classList.toggle('hidden');
  });

  dom.partsMenu.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.type !== 'checkbox') return;
    const part = String(target.value || '');
    if (!part) return;

    if (target.checked) {
      state.selectedParts.add(part);
    } else {
      const parts = partsForDomain();
      if (parts.length > 0 && state.selectedParts.size === 1 && state.selectedParts.has(part)) {
        target.checked = true;
        appendLog('파트는 최소 1개 이상 선택해야 합니다.');
        return;
      }
      state.selectedParts.delete(part);
    }
    updatePartsToggleLabel();
  });

  document.addEventListener('click', (event) => {
    if (!dom.partsPicker.contains(event.target)) dom.partsMenu.classList.add('hidden');
  });
}

function bindDomainEvents() {
  if (!dom.domainTabs) return;
  dom.domainTabs.addEventListener('click', async (event) => {
    const tab = closestFromTarget(event.target, '.domain-tab');
    if (!tab) return;
    const nextDomain = String(tab.dataset.domain || '').trim();
    if (!nextDomain || nextDomain === state.domain) return;

    state.domain = nextDomain;
    state.listRows = [];
    state.reportRows = [];
    state.ignoredItems = [];
    state.selectedIds.clear();
    state.selectedDiffKeys.clear();
    state.selectedIgnoredKeys.clear();
    state.activeRowId = null;
    state.activeListIndex = null;
    state.ignoredCount = 0;
    resetSelectedParts(state.domain);
    state.dataDomain = state.domain;
    if (dom.dataDomains) dom.dataDomains.value = state.domain;
    state.dataRoot = '';

    renderDomainTabs();
    updateDomainDependentUi();
    renderPartsMenu();
    updatePartsToggleLabel();
    renderCharList();
    renderReportTable();
    renderIgnoredList();
    appendLog(`도메인 변경: ${state.domain}`);

    try {
      await loadDataRoots();
      await loadList();
      await loadIgnoredList();
      await generateReport();
      await loadDataFileList();
    } catch (error) {
      appendLog(`도메인 로드 실패: ${error.message}`);
    }
  });
}

function bindEvents() {
  dom.btnClearLog?.addEventListener('click', clearLog);

  dom.btnLoadList?.addEventListener('click', async () => {
    try {
      setPending(dom.btnLoadList, true);
      await loadList();
    } catch (error) {
      appendLog(`목록 조회 실패: ${error.message}`);
    } finally {
      setPending(dom.btnLoadList, false);
    }
  });

  dom.btnReport?.addEventListener('click', async () => {
    try {
      setPending(dom.btnReport, true);
      await generateReport();
    } catch (error) {
      appendLog(`리포트 생성 실패: ${error.message}`);
    } finally {
      setPending(dom.btnReport, false);
    }
  });

  dom.btnSelectAll?.addEventListener('click', () => setVisibleSelection(true));
  dom.btnClearSelect?.addEventListener('click', () => setVisibleSelection(false));

  dom.listSearch?.addEventListener('input', () => {
    state.listSearch = dom.listSearch.value || '';
    renderCharList();
  });

  dom.reportSearch?.addEventListener('input', () => {
    state.reportSearch = dom.reportSearch.value || '';
    renderReportTable();
  });

  dom.charList?.addEventListener('click', async (event) => {
    const item = closestFromTarget(event.target, '.char-item');
    if (!item) return;
    const index = Number(item.dataset.index);
    if (!Number.isInteger(index)) return;

    state.activeListIndex = index;
    if (dom.scopeMode) dom.scopeMode.value = 'nums';
    if (dom.scopeValue) dom.scopeValue.value = String(index);
    renderCharList();

    try {
      setPending(dom.btnReport, true);
      await generateReport();
    } catch (error) {
      appendLog(`목록 클릭 리포트 실패: ${error.message}`);
    } finally {
      setPending(dom.btnReport, false);
    }
  });

  dom.reportTbody?.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.type !== 'checkbox') return;
    const id = target.dataset.rowId;
    if (!id) return;
    if (target.checked) state.selectedIds.add(id);
    else state.selectedIds.delete(id);
    renderReportTable();
  });

  dom.reportTbody?.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') return;
    const row = closestFromTarget(event.target, 'tr[data-row-id]');
    if (!row) return;
    const id = row.dataset.rowId;
    if (!id) return;
    state.activeRowId = id;
    renderReportTable();
  });

  dom.detailContent?.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains('diff-path-checkbox')) return;
    const key = String(target.dataset.diffKey || '').trim();
    if (!key) return;
    if (target.checked) state.selectedDiffKeys.add(key);
    else state.selectedDiffKeys.delete(key);
    renderCounts();
    renderDetail();
  });

  dom.btnDryrunSelected?.addEventListener('click', async () => {
    try {
      setPending(dom.btnDryrunSelected, true);
      await runPatchForRows(selectedRows(), true);
      await generateReport();
    } catch (error) {
      appendLog(`선택 행 검증 실패: ${error.message}`);
    } finally {
      setPending(dom.btnDryrunSelected, false);
    }
  });

  dom.btnPatchSelected?.addEventListener('click', async () => {
    if (!window.confirm('선택한 행을 실제 반영합니다. 계속할까요?')) return;
    try {
      setPending(dom.btnPatchSelected, true);
      await runPatchForRows(selectedRows(), false);
      await generateReport();
    } catch (error) {
      appendLog(`선택 행 실반영 실패: ${error.message}`);
    } finally {
      setPending(dom.btnPatchSelected, false);
    }
  });

  dom.btnDryrunFilter?.addEventListener('click', async () => {
    try {
      setPending(dom.btnDryrunFilter, true);
      await runPatchByFilter(true);
      await generateReport();
    } catch (error) {
      appendLog(`현재 필터 검증 실패: ${error.message}`);
    } finally {
      setPending(dom.btnDryrunFilter, false);
    }
  });

  dom.btnPatchFilter?.addEventListener('click', async () => {
    if (!window.confirm('현재 필터를 실제 반영합니다. 계속할까요?')) return;
    try {
      setPending(dom.btnPatchFilter, true);
      await runPatchByFilter(false);
      await generateReport();
    } catch (error) {
      appendLog(`현재 필터 실반영 실패: ${error.message}`);
    } finally {
      setPending(dom.btnPatchFilter, false);
    }
  });

  dom.btnAddCharacter?.addEventListener('click', async () => {
    try {
      setPending(dom.btnAddCharacter, true);
      await addCharacter();
    } catch (error) {
      appendLog(`신규 캐릭터 생성 실패: ${error.message}`);
    } finally {
      setPending(dom.btnAddCharacter, false);
    }
  });

  dom.dataDomains?.addEventListener('change', async () => {
    state.dataDomain = dom.dataDomains?.value || state.domain;
    state.dataRoot = '';
    state.selectedDataFile = null;
    state.dataFilePath = '';
    state.dataFiles = [];
    if (dom.dataFilePathInput) dom.dataFilePathInput.value = '';
    if (dom.dataEditor) dom.dataEditor.value = '';
    renderDataFiles();
    setDataEditorDirty(false);

    try {
      await loadDataRoots();
      await loadDataFileList();
    } catch (error) {
      appendLog(`데이터 루트 로드 실패: ${error.message}`);
    } finally {
      // no-op
    }
  });

  dom.dataRootsSelect?.addEventListener('change', async () => {
    state.dataRoot = dom.dataRootsSelect?.value || '';
    state.selectedDataFile = null;
    state.dataFilePath = '';
    if (dom.dataFilePathInput) dom.dataFilePathInput.value = '';
    if (dom.dataEditor) dom.dataEditor.value = '';
    setDataEditorDirty(false);
    renderDataFiles();
    try {
      await loadDataFileList();
    } catch (error) {
      appendLog(`파일 목록 로드 실패: ${error.message}`);
    } finally {
      // no-op
    }
  });

  dom.dataFileSearch?.addEventListener('input', () => {
    state.dataFileSearch = dom.dataFileSearch.value || '';
    renderDataFiles();
  });

  dom.btnLoadDataFiles?.addEventListener('click', async () => {
    try {
      setPending(dom.btnLoadDataFiles, true);
      state.dataFileSearch = dom.dataFileSearch?.value || '';
      await loadDataFileList();
    } catch (error) {
      appendLog(`데이터 파일 조회 실패: ${error.message}`);
    } finally {
      setPending(dom.btnLoadDataFiles, false);
    }
  });

  dom.dataFileList?.addEventListener('click', async (event) => {
    const btn = closestFromTarget(event.target, '.data-file-item');
    if (!btn) return;
    const rootId = String(btn.dataset.rootId || '').trim();
    const relPath = String(btn.dataset.filePath || '').trim();
    if (!rootId || !relPath) return;
    try {
      setPending(btn, true);
      await loadDataFile({ rootId, path: relPath });
    } catch (error) {
      appendLog(`데이터 파일 로드 실패: ${error.message}`);
    } finally {
      setPending(btn, false);
    }
  });

  dom.btnLoadDataFile?.addEventListener('click', async () => {
    const target = state.selectedDataFile;
    if (!target) {
      appendLog('로드할 파일을 먼저 선택해 주세요.');
      return;
    }
    try {
      setPending(dom.btnLoadDataFile, true);
      await loadDataFile(target);
    } catch (error) {
      appendLog(`데이터 파일 로드 실패: ${error.message}`);
    } finally {
      setPending(dom.btnLoadDataFile, false);
    }
  });

  dom.btnReloadDataFile?.addEventListener('click', async () => {
    const target = state.selectedDataFile;
    if (!target) {
      appendLog('새로고침할 파일이 없습니다.');
      return;
    }
    try {
      setPending(dom.btnReloadDataFile, true);
      await loadDataFile(target);
    } catch (error) {
      appendLog(`데이터 파일 새로고침 실패: ${error.message}`);
    } finally {
      setPending(dom.btnReloadDataFile, false);
    }
  });

  dom.dataEditor?.addEventListener('input', () => {
    setDataEditorDirty(true);
  });

  dom.btnSaveDataFile?.addEventListener('click', async () => {
    try {
      setPending(dom.btnSaveDataFile, true);
      await saveDataFile();
    } catch (error) {
      appendLog(`데이터 저장 실패: ${error.message}`);
    } finally {
      setPending(dom.btnSaveDataFile, false);
    }
  });

  dom.ignoredSearch?.addEventListener('input', () => {
    state.ignoredSearch = dom.ignoredSearch?.value || '';
    renderIgnoredList();
  });

  dom.ignoredSearchClear?.addEventListener('click', () => {
    state.ignoredSearch = '';
    if (dom.ignoredSearch) dom.ignoredSearch.value = '';
    renderIgnoredList();
  });

  dom.btnUnignoreFiltered?.addEventListener('click', async () => {
    try {
      setPending(dom.btnUnignoreFiltered, true);
      await runUnignoreFilteredDiffs();
    } catch (error) {
      appendLog(`무시 일괄 해제 실패: ${error.message}`);
    } finally {
      setPending(dom.btnUnignoreFiltered, false);
    }
  });

  dom.btnLoadIgnored?.addEventListener('click', async () => {
    try {
      setPending(dom.btnLoadIgnored, true);
      await loadIgnoredList();
    } catch (error) {
      appendLog(`무시 목록 로드 실패: ${error.message}`);
    } finally {
      setPending(dom.btnLoadIgnored, false);
    }
  });

  dom.btnUnignoreSelected?.addEventListener('click', async () => {
    try {
      setPending(dom.btnUnignoreSelected, true);
      await runUnignoreSelectedDiffs();
    } catch (error) {
      appendLog(`무시 해제 실패: ${error.message}`);
    } finally {
      setPending(dom.btnUnignoreSelected, false);
    }
  });

  dom.ignoredList?.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.type !== 'checkbox') return;
    const key = String(target.dataset.ignoreKey || '').trim();
    if (!key) return;
    if (target.checked) state.selectedIgnoredKeys.add(key);
    else state.selectedIgnoredKeys.delete(key);
  });
}

async function bootstrap() {
  resetSelectedParts(state.domain);
  bindPartsPicker();
  bindEvents();
  bindDomainEvents();
  renderCounts();
  renderCharList();
  renderReportTable();
  renderIgnoredList();
  setDetailAvatar(null);
  appendLog(`초기화 완료 (${APP_VERSION}): Dry Run은 파일을 수정하지 않는 검증 모드입니다.`);

  try {
    await loadCapabilities();
    if (state.domain && dom.dataDomains) {
      dom.dataDomains.value = state.domain;
    }
    state.dataDomain = state.domain;
    await loadDataRoots();
    await loadDataFileList();
    await loadList();
    await loadIgnoredList();
    await generateReport();
  } catch (error) {
    appendLog(`초기 로딩 실패: ${error.message}`);
  }
}

bootstrap();
