const state = {
  domain: 'character',
  activeView: 'work',
  capabilities: [],
  listRows: [],
  reportRows: [],
  ignoredItems: [],
  selectedIds: new Set(),
  selectedDiffKeys: new Set(),
  selectedIgnoredKeys: new Set(),
  ignoredSearch: '',
  ignoredFilters: {
    index: '',
    lang: '',
    api: '',
    local: '',
    key: '',
    part: '',
    path: '',
    characterKey: '',
    note: '',
    show: 'active',
    createdFrom: '',
    createdTo: ''
  },
  ignoredSort: 'created_desc',
  ignoredShow: 'active',
  ignoredRuleCount: 0,
  ignoredCount: 0,
  ignoredTotalCount: 0,
  ignoredActiveCount: 0,
  ignoredHiddenCount: 0,
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
  dataFileMeta: null,
  dataEditorMode: 'form',
  dataEditorParsed: null,
  dataEditorRaw: '',
  dataEditorParseError: null,
  dataEditorEntryIndex: 0,
  dataEditorDirty: false,
  selectedParts: new Set(),
  showChangedLinesOnly: false
};

const DOMAIN_PARTS = {
  character: ['ritual', 'skill', 'weapon', 'base_stats'],
  persona: ['profile', 'innate_skill', 'passive_skill', 'uniqueSkill', 'highlight'],
  wonder_weapon: ['name', 'effect']
};

const CHARACTER_PART_FILES = {
  ritual: 'ritual.js',
  skill: 'skill.js',
  weapon: 'weapon.js',
  base_stats: 'base_stats.js'
};
const PERSONA_DATA_ROOT_ID = 'persona';
const PERSONA_NONORDER_SUBDIR = 'nonorder';
const WONDER_INTERNAL_ROOT_ID = 'wonder_internal';

const FALLBACK_CAPABILITIES = [
  { id: 'character', label: 'Character', enabled: true, features: ['list', 'report', 'patch', 'create'], parts: DOMAIN_PARTS.character },
  { id: 'persona', label: 'Persona', enabled: true, features: ['list', 'report', 'patch'], parts: DOMAIN_PARTS.persona },
  { id: 'wonder_weapon', label: 'Wonder Weapon', enabled: true, features: ['list', 'report', 'patch'], parts: DOMAIN_PARTS.wonder_weapon }
];

const APP_VERSION = 'patch-console v0.12.3';
const VIEW_KEY = 'patch-console.activeView';
const DATA_EDITOR_MODE_KEY = 'patch-console.dataEditorMode';
const VALID_VIEWS = new Set(['work', 'ignored', 'editor']);

const dom = {
  domainTabs: document.getElementById('domain-tabs'),
  viewTabs: document.querySelectorAll('.view-tab'),
  panelWork: document.getElementById('panel-work'),
  panelIgnored: document.getElementById('panel-ignored'),
  panelEditor: document.getElementById('panel-editor'),
  currentDomain: document.getElementById('current-domain'),
  addCharacterGroup: document.getElementById('add-character-group'),
  langsInput: document.getElementById('langs-input'),
  scopeMode: document.getElementById('scope-mode'),
  scopeValue: document.getElementById('scope-value'),
  listSearch: document.getElementById('list-search'),
  reportSearch: document.getElementById('report-search'),
  btnHeaderRefresh: document.getElementById('btn-header-refresh'),
  btnSelectAll: document.getElementById('btn-select-all'),
  btnClearSelect: document.getElementById('btn-clear-select'),
  btnPatchSelected: document.getElementById('btn-patch-selected'),
  btnIgnoreSelected: document.getElementById('btn-ignore-selected'),
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
  ignoredActiveCountText: document.getElementById('ignored-active-count'),
  ignoredHiddenCountText: document.getElementById('ignored-hidden-count'),
  ignoredSearch: document.getElementById('ignored-search'),
  ignoredShow: document.getElementById('ignored-show'),
  ignoredSearchClear: document.getElementById('btn-clear-ignored-search'),
  ignoredFilterIndex: document.getElementById('ignored-filter-index'),
  ignoredFilterLang: document.getElementById('ignored-filter-lang'),
  ignoredFilterApi: document.getElementById('ignored-filter-api'),
  ignoredFilterLocal: document.getElementById('ignored-filter-local'),
  ignoredFilterKey: document.getElementById('ignored-filter-key'),
  ignoredFilterPart: document.getElementById('ignored-filter-part'),
  ignoredFilterPath: document.getElementById('ignored-filter-path'),
  ignoredFilterCharacterKey: document.getElementById('ignored-filter-character-key'),
  ignoredFilterNote: document.getElementById('ignored-filter-note'),
  ignoredFilterCreatedFrom: document.getElementById('ignored-filter-created-from'),
  ignoredFilterCreatedTo: document.getElementById('ignored-filter-created-to'),
  ignoredSort: document.getElementById('ignored-sort'),
  ignoredFiltersClear: document.getElementById('btn-clear-ignored-filters'),
  btnUnignoreFiltered: document.getElementById('btn-unignore-filtered'),
  btnHideSelectedIgnored: document.getElementById('btn-hide-selected-ignored'),
  btnUnhideSelectedIgnored: document.getElementById('btn-unhide-selected-ignored'),
  btnEditIgnoredNote: document.getElementById('btn-edit-ignored-note'),
  reportFile: document.getElementById('report-file'),
  logOutput: document.getElementById('log-output'),
  detailPanel: document.getElementById('detail-panel'),
  detailTitle: document.getElementById('detail-title'),
  detailContent: document.getElementById('detail-content'),
  detailAvatar: document.getElementById('detail-avatar'),
  dataRootsSelect: document.getElementById('data-root'),
  dataFileSearch: document.getElementById('data-file-search'),
  btnLoadDataFiles: document.getElementById('btn-load-data-files'),
  btnReloadDataFile: document.getElementById('btn-reload-data-file'),
  dataFileList: document.getElementById('data-file-list'),
  dataFilePathInput: document.getElementById('data-file-path'),
  dataEditorRawWrap: document.getElementById('data-editor-raw-wrap'),
  dataEditor: document.getElementById('data-editor'),
  dataEditorStatus: document.getElementById('data-editor-status'),
  dataEditorMeta: document.getElementById('data-editor-meta'),
  dataEditorModeForm: document.getElementById('btn-data-mode-form'),
  dataEditorModeRaw: document.getElementById('btn-data-mode-raw'),
  dataEditorFormWrap: document.getElementById('data-editor-form-wrap'),
  dataEditorEntryInfo: document.getElementById('data-editor-entry-info'),
  dataEditorEntrySelect: document.getElementById('data-editor-entry-select'),
  dataEditorForm: document.getElementById('data-editor-form'),
  btnLoadDataFile: document.getElementById('btn-load-data-file'),
  btnSaveDataFile: document.getElementById('btn-save-data-file'),
  ignoredList: document.getElementById('ignored-list'),
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

function getUrlView() {
  try {
    const url = new URL(window.location.href);
    const path = String(url.pathname || '').toLowerCase();
    const pathEnd = path.split('/').filter(Boolean).pop() || '';
    if (pathEnd === 'ignored') return 'ignored';
    if (pathEnd === 'editor') return 'editor';
    if (pathEnd === 'work') return 'work';

    const value = new URLSearchParams(window.location.search).get('view');
    return VALID_VIEWS.has(value) ? value : null;
  } catch {
    return null;
  }
}

function getStoredView() {
  try {
    const value = window.localStorage.getItem(VIEW_KEY);
    return VALID_VIEWS.has(value) ? value : null;
  } catch {
    return null;
  }
}

function normalizeView(view) {
  return VALID_VIEWS.has(String(view || '')) ? String(view) : 'work';
}

function getViewPath(view) {
  const next = normalizeView(view);
  try {
    const url = new URL(window.location.href);
    const normalizedPath = String(url.pathname || '/')
      .replace(/\/(work|ignored|editor|index\.html)?\/?$/, '/')
      .replace(/\/+/g, '/');
    return `${normalizedPath}${next}`;
  } catch {
    return `/${next}`;
  }
}

function setActiveView(view) {
  state.activeView = normalizeView(view);
  if (dom.panelWork) dom.panelWork.classList.toggle('hidden', state.activeView !== 'work');
  if (dom.panelIgnored) dom.panelIgnored.classList.toggle('hidden', state.activeView !== 'ignored');
  if (dom.panelEditor) dom.panelEditor.classList.toggle('hidden', state.activeView !== 'editor');

  const sidebars = document.querySelectorAll('.view-sidebar');
  for (const sidebar of sidebars) {
    const target = String(sidebar.dataset.view || '').toLowerCase();
    sidebar.classList.toggle('hidden', target !== state.activeView);
  }

  document.body.classList.remove('view-work', 'view-ignored', 'view-editor');
  document.body.classList.add(`view-${state.activeView}`);

  if (dom.viewTabs) {
    for (const tab of dom.viewTabs) {
      const isActive = String(tab.dataset.view || '') === state.activeView;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    }
  }

  try {
    window.localStorage.setItem(VIEW_KEY, state.activeView);
  } catch {
    // ignore
  }

  try {
    const url = new URL(window.location.href);
    const nextPath = getViewPath(state.activeView);
    if (url.pathname !== nextPath) {
      url.pathname = nextPath;
    }
    if (!url.searchParams.has('view') || url.searchParams.get('view') !== state.activeView) {
      url.searchParams.set('view', state.activeView);
    }
    window.history.replaceState({}, '', url.toString());
    // keep URL sync with UI without triggering navigation.
  } catch {
    // ignore
  }

  if (state.activeView === 'editor') {
    setDataEditorMode(getStoredDataEditorMode(), { renderOnly: true });
  }
  renderCounts();
}

function renderActiveView() {
  setActiveView(state.activeView);
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

function readIgnoredFilterForm() {
  const getValue = (node) => String(node?.value || '').trim();
  const rawIndex = getValue(dom.ignoredFilterIndex);
  return {
    index: rawIndex,
    lang: getValue(dom.ignoredFilterLang).toLowerCase(),
    api: getValue(dom.ignoredFilterApi),
    local: getValue(dom.ignoredFilterLocal),
    key: getValue(dom.ignoredFilterKey),
    part: getValue(dom.ignoredFilterPart),
    path: getValue(dom.ignoredFilterPath),
    characterKey: getValue(dom.ignoredFilterCharacterKey),
    note: getValue(dom.ignoredFilterNote),
    show: getValue(dom.ignoredShow),
    createdFrom: getValue(dom.ignoredFilterCreatedFrom),
    createdTo: getValue(dom.ignoredFilterCreatedTo)
  };
}

function syncIgnoredFilterState() {
  state.ignoredFilters = readIgnoredFilterForm();
}

function clearIgnoredFilterInputs() {
  if (dom.ignoredFilterIndex) dom.ignoredFilterIndex.value = '';
  if (dom.ignoredFilterLang) dom.ignoredFilterLang.value = '';
  if (dom.ignoredFilterApi) dom.ignoredFilterApi.value = '';
  if (dom.ignoredFilterLocal) dom.ignoredFilterLocal.value = '';
  if (dom.ignoredFilterKey) dom.ignoredFilterKey.value = '';
  if (dom.ignoredFilterPart) dom.ignoredFilterPart.value = '';
  if (dom.ignoredFilterPath) dom.ignoredFilterPath.value = '';
  if (dom.ignoredFilterCharacterKey) dom.ignoredFilterCharacterKey.value = '';
  if (dom.ignoredFilterNote) dom.ignoredFilterNote.value = '';
  if (dom.ignoredShow) dom.ignoredShow.value = 'active';
  if (dom.ignoredFilterCreatedFrom) dom.ignoredFilterCreatedFrom.value = '';
  if (dom.ignoredFilterCreatedTo) dom.ignoredFilterCreatedTo.value = '';
  if (dom.ignoredSearch) dom.ignoredSearch.value = '';
  state.ignoredSearch = '';
  state.ignoredShow = 'active';
  state.ignoredFilters = {
    index: '',
    lang: '',
    api: '',
    local: '',
    key: '',
    part: '',
    path: '',
    characterKey: '',
    note: '',
    show: 'active',
    createdFrom: '',
    createdTo: ''
  };
  if (dom.ignoredSort) dom.ignoredSort.value = 'created_desc';
  state.ignoredSort = 'created_desc';
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

function setHeaderRefreshPending(pending) {
  if (!dom.btnHeaderRefresh) return;
  dom.btnHeaderRefresh.disabled = Boolean(pending);
  dom.btnHeaderRefresh.classList.toggle('is-pending', Boolean(pending));
}

async function refreshPatchWorkspace({ logSuccess = false } = {}) {
  const steps = [
    { label: '목록 조회', run: loadList },
    { label: '무시 목록 조회', run: loadIgnoredList },
    { label: '리포트 생성', run: generateReport }
  ];
  let hasError = false;

  for (const step of steps) {
    try {
      await step.run();
    } catch (error) {
      hasError = true;
      appendLog(`[${state.domain}] ${step.label} 실패: ${error.message}`);
    }
  }

  if (!hasError && logSuccess) {
    appendLog(`[${state.domain}] 목록/리포트/무시 목록 새로고침 완료`);
  }
  return !hasError;
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
  if (dom.ignoredActiveCountText) {
    dom.ignoredActiveCountText.textContent = String(state.ignoredActiveCount || 0);
  }
  if (dom.ignoredHiddenCountText) {
    dom.ignoredHiddenCountText.textContent = String(state.ignoredHiddenCount || 0);
  }
  const ignoredActive = document.getElementById('ignored-active-count-ignored');
  const ignoredHidden = document.getElementById('ignored-hidden-count-ignored');
  const ignoredTotal = document.getElementById('ignored-total-count-ignored');
  const ignoredCount = document.getElementById('ignored-count-ignored');
  const ignoredTotalAll = document.getElementById('ignored-total-count-ignored-all');
  if (ignoredActive) ignoredActive.textContent = String(state.ignoredActiveCount || 0);
  if (ignoredHidden) ignoredHidden.textContent = String(state.ignoredHiddenCount || 0);
  const ignoredTotalValue = Number(state.ignoredTotalCount || 0);
  if (ignoredTotal) ignoredTotal.textContent = String(ignoredTotalValue);
  if (ignoredCount) ignoredCount.textContent = String(state.ignoredCount || 0);
  if (ignoredTotalAll) ignoredTotalAll.textContent = String(ignoredTotalValue);

  const editorSummaryFile = document.getElementById('editor-summary-file');
  const editorSummaryMode = document.getElementById('editor-summary-mode');
  const editorSummaryDirty = document.getElementById('editor-summary-dirty');
  if (editorSummaryFile) editorSummaryFile.textContent = state.dataFilePath || '-';
  if (editorSummaryMode) editorSummaryMode.textContent = state.dataEditorMode || 'raw';
  if (editorSummaryDirty) {
    editorSummaryDirty.textContent = state.dataEditorDirty ? '수정됨 (저장 필요)' : '저장됨';
  }

  const ignoreSortLabel = document.getElementById('ignored-sort-label');
  if (ignoreSortLabel) ignoreSortLabel.textContent = String(state.ignoredSort || 'created_desc');
}

function filteredIgnoredItems() {
  if (!state.ignoredItems || state.ignoredItems.length === 0) return [];
  const filters = state.ignoredFilters || {};
  const filterIndex = Number.parseInt(String(filters.index || ''), 10);
  const q = String(state.ignoredSearch || '').trim().toLowerCase();
  const createdFrom = String(filters.createdFrom || '').trim();
  const createdTo = String(filters.createdTo || '').trim();

  const out = state.ignoredItems.filter((item) => {
    if (!Number.isNaN(filterIndex) && filterIndex > 0 && Number(item.index) !== filterIndex) return false;
    if (filters.lang && String(item.lang || '').toLowerCase() !== String(filters.lang || '').toLowerCase()) return false;
    if (filters.api && !String(item.api || '').toLowerCase().includes(String(filters.api || '').toLowerCase())) return false;
    if (filters.local && !String(item.local || '').toLowerCase().includes(String(filters.local || '').toLowerCase())) return false;
    if (filters.key && !String(item.key || '').toLowerCase().includes(String(filters.key || '').toLowerCase())) return false;
    if (filters.characterKey && !String(item.characterKey || '').toLowerCase().includes(String(filters.characterKey || '').toLowerCase())) return false;
    if (filters.note && !String(item.note || '').toLowerCase().includes(String(filters.note || '').toLowerCase())) return false;
    if (filters.part && String(item.part || '').toLowerCase() !== String(filters.part || '').toLowerCase()) return false;
    if (filters.path && !String(item.path || '').toLowerCase().includes(String(filters.path || '').toLowerCase())) return false;
    const text = `${item.index} ${item.lang} ${item.api} ${item.local} ${item.characterKey} ${item.part} ${item.path} ${item.matcher || ''}`.toLowerCase();
    return q ? text.includes(q) : true;
  });

  const fromTime = createdFrom ? new Date(createdFrom).getTime() : NaN;
  const toTime = createdTo ? new Date(createdTo).getTime() : NaN;
  const normalizedTo = Number.isNaN(toTime)
    ? NaN
    : (() => {
      const d = new Date(toTime);
      d.setHours(23, 59, 59, 999);
      return d.getTime();
    })();
  const dateFiltered = out.filter((item) => {
    const createdAt = new Date(String(item.createdAt || '')).getTime();
    if (Number.isNaN(createdAt)) return true;
    if (!Number.isNaN(fromTime) && createdAt < fromTime) return false;
    if (!Number.isNaN(normalizedTo) && createdAt > normalizedTo) return false;
    return true;
  });

  const sortMode = String(state.ignoredSort || 'created_desc').toLowerCase();
  const cmp = (() => {
    switch (sortMode) {
      case 'created_asc':
        return (a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || ''));
      case 'index_asc':
        return (a, b) => Number(a.index || 0) - Number(b.index || 0);
      case 'index_desc':
        return (a, b) => Number(b.index || 0) - Number(a.index || 0);
      case 'created_desc':
      default:
        return (a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
    }
  })();

  return dateFiltered.sort((a, b) => {
    const res = cmp(a, b);
    if (res !== 0) return res;
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}

function setDataEditorDirty(dirty) {
  state.dataEditorDirty = Boolean(dirty);
  if (dom.dataEditorStatus) {
    const message = state.dataEditorDirty
      ? '편집 중: 저장 필요'
      : '로드된 파일: 변경 없음';
    dom.dataEditorStatus.textContent = message;
  }
  if (dom.dataEditorMeta) {
    const meta = [];
    if (state.dataEditorParseError) {
      dom.dataEditorMeta.textContent = `편집 모드 오류: ${state.dataEditorParseError}`;
    } else {
      if (state.dataEditorParsed !== null) {
        const type = Array.isArray(state.dataEditorParsed)
          ? 'Array'
          : (state.dataEditorParsed === null ? 'null' : typeof state.dataEditorParsed);
        meta.push(`형식: ${type}`);
      }
      meta.push(`모드: ${state.dataEditorMode}`);
      if (state.dataEditorRaw) meta.push(`raw ${state.dataEditorRaw.length.toLocaleString()}자`);
      if (state.dataEditorParseError) meta.push(`오류: ${state.dataEditorParseError}`);
      dom.dataEditorMeta.textContent = meta.length ? meta.join(' / ') : '파일을 선택하면 편집 가능합니다.';
    }
  }
  if (dom.dataEditorFormWrap && dom.dataEditorRawWrap) {
    if (state.dataEditorMode === 'form') {
      dom.dataEditorFormWrap.classList.remove('hidden');
      dom.dataEditorRawWrap.classList.add('hidden');
      if (dom.dataEditorModeForm) dom.dataEditorModeForm.classList.add('active');
      if (dom.dataEditorModeRaw) dom.dataEditorModeRaw.classList.remove('active');
      return;
    }
    dom.dataEditorRawWrap.classList.remove('hidden');
    dom.dataEditorFormWrap.classList.add('hidden');
    if (dom.dataEditorModeRaw) dom.dataEditorModeRaw.classList.add('active');
    if (dom.dataEditorModeForm) dom.dataEditorModeForm.classList.remove('active');
  }
  renderCounts();
}

function getStoredDataEditorMode() {
  try {
    const value = window.localStorage.getItem(DATA_EDITOR_MODE_KEY);
    return value === 'raw' ? 'raw' : 'form';
  } catch {
    return 'form';
  }
}

function storeDataEditorMode(mode) {
  try {
    window.localStorage.setItem(DATA_EDITOR_MODE_KEY, mode === 'raw' ? 'raw' : 'form');
  } catch {
    // ignore
  }
}

function dataEditorCanMode(mode) {
  if (mode !== 'raw' && mode !== 'form') return 'form';
  return mode;
}

function normalizeDataEditorMode(mode) {
  return mode === 'raw' ? 'raw' : 'form';
}

function getDataEditorModeCandidate() {
  return dataEditorCanMode(getStoredDataEditorMode());
}

function setDataEditorMode(mode, options = {}) {
  const shouldRender = options.renderOnly || false;
  const nextMode = normalizeDataEditorMode(mode);

  let resolvedMode = nextMode;
  if (state.selectedDataFile) {
    if (nextMode === 'form') {
      const parsed = parseDataEditorPayload(state.dataEditorRaw);
      if (parsed.ok) {
        state.dataEditorParsed = parsed.value;
        state.dataEditorMeta = parsed.meta;
        state.dataEditorParseError = null;
      } else {
        state.dataEditorParsed = null;
        state.dataEditorMeta = null;
        state.dataEditorParseError = parsed.error;
        resolvedMode = 'raw';
      }
    } else {
      state.dataEditorParseError = null;
    }
  } else {
    state.dataEditorParsed = null;
    state.dataEditorMeta = null;
    state.dataEditorRaw = '';
    state.dataEditorParseError = '파일이 선택되지 않았습니다.';
    resolvedMode = 'raw';
  }

  if (!shouldRender) storeDataEditorMode(resolvedMode);
  state.dataEditorMode = resolvedMode;

  if (resolvedMode === 'form') {
    renderDataEditorForm();
  } else if (dom.dataEditor) {
    dom.dataEditor.value = state.dataEditorRaw || '';
  }

  setDataEditorModeButtons();
  setDataEditorDirty(false);
}

function setDataEditorModeButtons() {
  if (!dom.dataEditorModeForm || !dom.dataEditorModeRaw) return;
  const isForm = state.dataEditorMode === 'form';
  dom.dataEditorModeForm.classList.toggle('toggled', isForm);
  dom.dataEditorModeRaw.classList.toggle('toggled', !isForm);
}

function parseDataEditorPayload(content) {
  return parseDataFilePayload(content);
}

function syncDataEditorFromRaw() {
  const text = dom.dataEditor ? String(dom.dataEditor.value || '') : '';
  state.dataEditorRaw = text;
  if (!state.dataEditorRaw) {
    if (state.dataEditorMode === 'form') {
      state.dataEditorParsed = null;
      state.dataEditorMeta = null;
      state.dataEditorParseError = '빈 파일입니다.';
      setDataEditorMode('raw', { renderOnly: true });
    } else {
      state.dataEditorParsed = null;
      state.dataEditorMeta = null;
      state.dataEditorParseError = null;
    }
    return;
  }

  const parsed = parseDataEditorPayload(state.dataEditorRaw);
  if (!parsed.ok) {
    state.dataEditorParsed = null;
    state.dataEditorMeta = null;
    state.dataEditorParseError = parsed.error;
    if (state.dataEditorMode === 'form') {
      setDataEditorMode('raw', { renderOnly: true });
    }
    return;
  }

  state.dataEditorParsed = parsed.value;
  state.dataEditorMeta = parsed.meta;
  state.dataEditorParseError = null;
  if (state.dataEditorMode === 'form') {
    renderDataEditorForm();
  }
}

function cloneEditorValue(value) {
  if (!value) return value;
  if (Array.isArray(value)) return value.map((item) => cloneEditorValue(item));
  if (typeof value === 'object') {
    const out = {};
    for (const [key, nested] of Object.entries(value)) {
      out[key] = cloneEditorValue(nested);
    }
    return out;
  }
  return value;
}

function getContainerAndKey(parsed, parts) {
  if (!Array.isArray(parts) || parts.length === 0) return { container: null, key: '' };
  const key = parts[parts.length - 1];
  const container = getValueByPath(parsed, parts.slice(0, -1));
  return { container, key };
}

function deleteValueByPath(parsed, parts) {
  const { container, key } = getContainerAndKey(parsed, parts);
  if (!container) return;
  if (Array.isArray(container)) {
    const index = Number(key);
    if (!Number.isInteger(index) || index < 0 || index >= container.length) return;
    container.splice(index, 1);
    return;
  }
  if (Object.prototype.hasOwnProperty.call(container, key)) {
    delete container[key];
  }
}

function addArrayItemByPath(parsed, parts) {
  const target = getValueByPath(parsed, parts);
  if (!Array.isArray(target)) return;
  if (target.length === 0) {
    target.push('');
    return;
  }
  const sample = target[target.length - 1];
  if (typeof sample === 'object' && sample !== null) target.push(cloneEditorValue(sample));
  else if (typeof sample === 'number') target.push(sample);
  else target.push('');
}

function encodeEditorPath(parts) {
  return parts.map((part) => String(part).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\//g, '\\/')).join('|');
}

function decodeEditorPath(pathText) {
  if (!pathText) return [];
  const out = [];
  let cur = '';
  let escape = false;
  for (let i = 0; i < pathText.length; i += 1) {
    const ch = pathText[i];
    if (escape) {
      cur += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === '|') {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function parsePathValueText(rawText) {
  const trimmed = String(rawText == null ? '' : rawText).trim();
  if (trimmed === '') return '';
  if (trimmed === 'null') return null;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  const n = Number(trimmed);
  if (!Number.isNaN(n) && String(n) === trimmed) return n;
  return trimmed;
}

function getValueByPath(value, parts) {
  let current = value;
  for (const part of parts) {
    if (!current || typeof current !== 'object') return undefined;
    const key = part;
    if (Array.isArray(current) && String(Number(key)) === String(key)) {
      current = current[Number(key)];
      continue;
    }
    current = current[key];
  }
  return current;
}

function setValueByPath(value, parts, nextValue) {
  if (!Array.isArray(parts) || parts.length === 0) return;
  const parent = parts.slice(0, -1).reduce((acc, part) => {
    if (!acc || typeof acc !== 'object') {
      return null;
    }
    if (Array.isArray(acc)) {
      const index = Number(part);
      if (!Number.isInteger(index) || index < 0 || index >= acc.length) return null;
      return acc[index];
    }
    return acc[part];
  }, value);
  if (!parent || typeof parent !== 'object') return;
  const last = parts[parts.length - 1];
  if (Array.isArray(parent) && String(Number(last)) === String(last)) {
    parent[Number(last)] = nextValue;
    return;
  }
  parent[last] = nextValue;
}

function findBalancedJsonBody(text, startIndex) {
  const open = text[startIndex];
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;
  let i = startIndex;

  for (; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) inString = false;
      continue;
    }
    if (ch === '/' && next === '/') {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === '\'' || ch === '`') {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function tryParseJsonText(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function parseDataFilePayload(content) {
  const raw = String(content || '');
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: '빈 파일입니다.' };
  }

  const direct = tryParseJsonText(trimmed);
  if (direct.ok) {
    return {
      ok: true,
      value: direct.value,
      meta: {
        mode: 'json',
        prefix: '',
        suffix: '',
        open: trimmed[0]
      },
      source: trimmed
    };
  }

  let best = null;
  let parseError = '';
  let hasOpenToken = false;

  for (let i = 0; i < trimmed.length; i += 1) {
    const ch = trimmed[i];
    if (ch !== '{' && ch !== '[') continue;
    hasOpenToken = true;
    const end = findBalancedJsonBody(trimmed, i);
    if (end < 0) continue;
    const body = trimmed.slice(i, end + 1);
    const parsed = tryParseJsonText(body);
    if (!parsed.ok) {
      parseError = parsed.error;
      i = end;
      continue;
    }

    const score = body.length;
    if (!best || score > best.score) {
      const prefix = trimmed.slice(0, i);
      const suffix = trimmed.slice(end + 1);
      best = {
        score,
        result: {
          ok: true,
          value: parsed.value,
          meta: {
            mode: 'wrapped',
            prefix,
            suffix,
            sourceOpen: body[0]
          },
          source: raw
        }
      };
    }

    // Skip nested starts inside the same balanced block.
    i = end;
  }

  if (best?.result) return best.result;
  if (!hasOpenToken) return { ok: false, error: '오브젝트/배열 구간을 찾을 수 없습니다.' };
  return { ok: false, error: parseError ? `JSON 파싱 실패: ${parseError}` : 'JSON 바디를 파싱하지 못했습니다.' };
}

function buildDataFilePayloadFromParsed() {
  if (!state.selectedDataFile) {
    throw new Error('파일이 선택되지 않았습니다.');
  }
  if (state.dataEditorMode === 'raw' || !state.dataEditorParsed || !state.dataEditorMeta) {
    return state.dataEditorRaw || '';
  }
  const valueText = JSON.stringify(state.dataEditorParsed, null, 2);
  if (state.dataEditorMeta.mode === 'json' || !state.dataEditorMeta.prefix) {
    return `${valueText}\n`;
  }
  return `${state.dataEditorMeta.prefix}${valueText}${state.dataEditorMeta.suffix}`;
}

function collectPrimitiveInputValue(target, typeHint) {
  if (typeHint === 'number') {
    const next = parseFloat(String(target.value).trim());
    return Number.isNaN(next) ? 0 : next;
  }
  if (typeHint === 'boolean') {
    return target.checked === true;
  }
  if (typeHint === 'null') {
    return null;
  }
  const value = String(target.value ?? '');
  const trimmed = value.trim();
  if (trimmed === '') return '';
  if (trimmed === 'null') return null;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  return parsePathValueText(value);
}

function makeInputForPrimitive(value, pathText, keyHint = '') {
  const type = value === null ? 'null' : (typeof value);
  const label = `${keyHint}` || '(unnamed)';
  const row = document.createElement('label');
  row.className = 'data-form-row';
  const key = document.createElement('strong');
  key.className = 'data-form-key';
  key.textContent = String(label);
  row.appendChild(key);
  let input;

  if (type === 'boolean') {
    input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = Boolean(value);
  } else if (type === 'number') {
    input = document.createElement('input');
    input.type = 'number';
    input.value = String(value);
  } else if (type === 'string' && String(value).length > 80) {
    input = document.createElement('textarea');
    input.rows = Math.max(2, Math.min(8, String(value).split('\n').length + 1));
    input.value = String(value);
  } else {
    input = document.createElement(type === 'number' ? 'number' : 'input');
    if (type !== 'number') {
      input.type = 'text';
    }
    input.value = value === null ? 'null' : String(value);
  }

  input.className = 'data-form-input';
  input.dataset.path = pathText;
  input.dataset.type = type;
  row.appendChild(input);
  return row;
}

function handleDataEditorInputChange(target) {
  if (!(target instanceof Element) || !target.classList.contains('data-form-input')) return;
  if (!state.dataEditorParsed) return;
  const pathText = String(target.dataset.path || '').trim();
  if (!pathText) return;

  const parts = decodeEditorPath(pathText);
  if (pathText === '__root__') {
    state.dataEditorParsed = collectPrimitiveInputValue(target, target.dataset.type);
    renderDataEditorForm();
    setDataEditorDirty(true);
    return;
  }
  if (parts.length === 0) return;
  setValueByPath(state.dataEditorParsed, parts, collectPrimitiveInputValue(target, target.dataset.type));
  setDataEditorDirty(true);
}

function handleDataEditorNodeAction(target) {
  const action = String(target.dataset.action || '').trim();
  if (!action || !state.dataEditorParsed) return;
  const pathText = String(target.dataset.path || '').trim();
  const parts = pathText ? decodeEditorPath(pathText) : [];

  if (action === 'remove-array-item' || action === 'remove-object') {
    deleteValueByPath(state.dataEditorParsed, parts);
    renderDataEditorForm();
    setDataEditorDirty(true);
    return;
  }

  if (action === 'add-array-item') {
    addArrayItemByPath(state.dataEditorParsed, parts);
    renderDataEditorForm();
    setDataEditorDirty(true);
    return;
  }

  if (action === 'add-object-key') {
    const node = closestFromTarget(target, '.data-form-node-actions');
    if (!node) return;
    const input = node.querySelector('.data-form-add-input');
    const keyValue = String(input?.value || '').trim();
    if (!keyValue) return;

    const targetObj = getValueByPath(state.dataEditorParsed, parts);
    if (!targetObj || typeof targetObj !== 'object' || Array.isArray(targetObj)) return;

    const safeKey = (() => {
      if (!Object.prototype.hasOwnProperty.call(targetObj, keyValue)) return keyValue;
      let i = 2;
      while (Object.prototype.hasOwnProperty.call(targetObj, `${keyValue}_${i}`)) i += 1;
      return `${keyValue}_${i}`;
    })();

    targetObj[safeKey] = '';
    if (input) input.value = '';
    renderDataEditorForm();
    setDataEditorDirty(true);
  }
}

function renderDataEditorForm() {
  if (!dom.dataEditorForm) return;
  if (!state.dataEditorParsed) {
    dom.dataEditorForm.innerHTML = '<p class="muted">파싱 가능한 데이터가 없어 FORM 모드를 사용할 수 없습니다.</p>';
    return;
  }
  dom.dataEditorForm.innerHTML = '';

  const root = state.dataEditorParsed;
  if (typeof root !== 'object' || root === null) {
    dom.dataEditorForm.appendChild(makeInputForPrimitive(root, '__root__', 'root'));
    return;
  }

  const renderNode = (parent, node, pathText, depth, caption, isRoot = false) => {
    const wrap = document.createElement('section');
    wrap.className = `data-form-node ${Array.isArray(node) ? 'data-form-array' : 'data-form-object'}`;
    if (depth > 0) wrap.classList.add('data-form-child');
    if (caption) {
      const head = document.createElement('div');
      head.className = 'data-form-head';
      const title = document.createElement('strong');
      title.textContent = caption;
      head.appendChild(title);
      if (Array.isArray(node)) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'btn ghost small';
        addBtn.textContent = '항목 추가';
        addBtn.dataset.action = 'add-array-item';
        addBtn.dataset.path = pathText;
        head.appendChild(addBtn);
      } else if (!isRoot) {
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn ghost small';
        removeBtn.textContent = '삭제';
        removeBtn.dataset.action = 'remove-object';
        removeBtn.dataset.path = pathText;
        head.appendChild(removeBtn);
      }
      wrap.appendChild(head);
    }

    const body = document.createElement('div');
    body.className = 'data-form-body';

    if (Array.isArray(node)) {
      node.forEach((item, idx) => {
        const itemPath = pathText ? `${pathText}|${idx}` : String(idx);
        if (typeof item === 'object' && item !== null) {
          renderNode(body, item, itemPath, depth + 1, `[${idx}]`);
        } else {
          body.appendChild(makeInputForPrimitive(item, itemPath, `[${idx}]`));
        }
        const row = body.lastElementChild;
        if (!row) return;
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn ghost small data-form-remove-row';
        removeBtn.textContent = '행 삭제';
        removeBtn.dataset.action = 'remove-array-item';
        removeBtn.dataset.path = itemPath;
        row.appendChild(removeBtn);
      });
      const addObj = document.createElement('button');
      addObj.type = 'button';
      addObj.className = 'btn ghost small';
      addObj.textContent = `배열 항목 추가 (${pathText || 'root'})`;
      addObj.dataset.action = 'add-array-item';
      addObj.dataset.path = pathText;
      body.appendChild(addObj);
    } else {
      const keys = Object.keys(node);
      for (const key of keys) {
        const value = node[key];
        const keyPath = pathText ? `${pathText}|${encodeEditorPath([key])}` : encodeEditorPath([key]);
        if (typeof value === 'object' && value !== null) {
          renderNode(body, value, keyPath, depth + 1, key);
        } else {
          const row = makeInputForPrimitive(value, keyPath, key);
          body.appendChild(row);
        }
      }
      const addKeyWrap = document.createElement('div');
      addKeyWrap.className = 'data-form-node-actions';
      const newKeyInput = document.createElement('input');
      newKeyInput.type = 'text';
      newKeyInput.placeholder = '새 키';
      newKeyInput.className = 'data-form-add-input';
      newKeyInput.dataset.action = 'new-object-key';
      newKeyInput.dataset.path = pathText;
      const addKeyBtn = document.createElement('button');
      addKeyBtn.type = 'button';
      addKeyBtn.className = 'btn ghost small';
      addKeyBtn.textContent = '키 추가';
      addKeyBtn.dataset.action = 'add-object-key';
      addKeyBtn.dataset.path = pathText;
      addKeyWrap.appendChild(newKeyInput);
      addKeyWrap.appendChild(addKeyBtn);
      body.appendChild(addKeyWrap);
    }

    wrap.appendChild(body);
    parent.appendChild(wrap);
  };

  renderNode(dom.dataEditorForm, root, '', 0, '', true);
  state.dataEditorMeta = state.dataEditorMeta || { mode: 'json', prefix: '', suffix: '' };
  if (dom.dataEditorEntryInfo) {
    dom.dataEditorEntryInfo.textContent = `루트 타입: ${Array.isArray(root) ? 'Array' : 'Object'}`;
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

function focusDetailPanel() {
  if (!dom.detailPanel) return;
  if (!window.matchMedia || !window.matchMedia('(max-width: 1060px)').matches) return;
  try {
    dom.detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch {
    dom.detailPanel.scrollIntoView();
  }
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

function selectedIgnoredItems() {
  if (!state.ignoredItems.length || !state.selectedIgnoredKeys.size) return [];
  const selected = new Set([...state.selectedIgnoredKeys]);
  return state.ignoredItems.filter((item) => selected.has(String(item.key || '')));
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
      const note = String(item.note || '').trim();
      const isHidden = Boolean(item.isHidden);
      const statusBadge = `<span class="status-badge ${isHidden ? 'hidden' : 'active'}">${isHidden ? '숨김' : '활성'}</span>`;
      const updated = item.createdAt ? ` (${new Date(item.createdAt).toISOString().slice(0, 19).replace('T', ' ')})` : '';
      return `
        <label class="ignored-item">
          <input type="checkbox" data-ignore-key="${escapeHtml(item.key)}" ${checked}>
          <div>
            <p>
              <strong>#${item.index} ${escapeHtml(item.lang)} ${escapeHtml(item.part)}</strong>
              ${statusBadge}
            </p>
            <p>${escapeHtml(item.api)} / ${escapeHtml(item.local)} / ${escapeHtml(item.characterKey)}${updated}</p>
            <p><code>${escapeHtml(item.path)}</code></p>
            ${note ? `<p class=\"muted small\">메모: ${escapeHtml(note)}</p>` : ''}
            <p class="ignored-item-actions">
              <button type="button" class="btn ghost small ignored-item-btn" data-action="ignore-note" data-ignore-key="${escapeHtml(item.key)}">메모 편집</button>
              <button type="button" class="btn ghost small ignored-item-btn" data-action="${isHidden ? 'unhide-ignore' : 'hide-ignore'}" data-ignore-key="${escapeHtml(item.key)}">
                ${isHidden ? '숨김 해제' : '숨김 처리'}
              </button>
            </p>
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
  state.dataEditorRaw = result.content || '';
  state.dataEditorParsed = null;
  state.dataEditorMeta = null;
  state.dataEditorParseError = null;
  if (dom.dataFilePathInput) {
    dom.dataFilePathInput.value = `${item.rootId} / ${item.path}`;
  }
  if (dom.dataEditor) dom.dataEditor.value = state.dataEditorRaw;
  if (state.dataEditorMode === 'form') {
    syncDataEditorFromRaw();
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
  const content = state.dataEditorMode === 'form'
    ? buildDataFilePayloadFromParsed()
    : state.dataEditorRaw || (dom.dataEditor ? dom.dataEditor.value : '');
  if (!window.confirm('선택한 파일을 저장할까요?')) return;
  const payloadContent = String(content || '');
  const result = await requestJson('/api/data-file', {
    method: 'POST',
    body: {
      domain: state.dataDomain,
      root: state.selectedDataFile.rootId,
      path: state.selectedDataFile.path,
      content: payloadContent
    }
  });
  appendLog(`데이터 파일 저장 완료: ${state.selectedDataFile.rootId}/${state.selectedDataFile.path}`);
  if (result.ok) {
    state.dataEditorRaw = payloadContent;
    if (dom.dataEditor) dom.dataEditor.value = payloadContent;
    setDataEditorDirty(false);
  }
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
            <button class="btn ghost small open-part-file-btn" type="button" data-part="${escapeHtml(part.part)}" data-row-id="${escapeHtml(rowId(row))}">
              파트 파일 열기
            </button>
          </div>
          ${valueDiffHtml ? `<ul class="value-diff-list">${valueDiffHtml}</ul>` : '<p class="muted small">샘플 경로 없음</p>'}
          ${hidden}
        </article>
      `;
    })
    .join('');

  dom.detailContent.innerHTML = `
    <div class="detail-actions">
      <button class="btn danger small" id="btn-detail-patch">이 행 실제 반영</button>
      <button class="btn ghost small" id="btn-detail-ignore">이 행 Diff 무시</button>
      <button class="btn ghost small ${state.showChangedLinesOnly ? 'toggled' : ''}" id="btn-toggle-changed-lines">${state.showChangedLinesOnly ? '전체 줄 보기' : '변경 줄만 보기'}</button>
    </div>
    <div class="diff-select-row">
      <div class="actions">
        <button class="btn ghost small" id="btn-diff-select-all-row">행 Diff 전체 선택</button>
        <button class="btn ghost small" id="btn-diff-clear-row">행 Diff 선택 해제</button>
      </div>
      <p class="muted small">현재 행 선택 Diff: <strong>${selectedInRow}</strong> / ${rowDiffs.length}</p>
    </div>
    <div class="diff-actions">
      <button class="btn danger small" id="btn-diff-patch">선택 Diff 실제 반영</button>
      <button class="btn ghost small" id="btn-diff-ignore">선택 Diff 무시</button>
    </div>
    ${partCards || '<p class="muted">표시할 part 정보가 없습니다.</p>'}
    <details>
      <summary>원본 Diff Preview</summary>
      <pre>${escapeHtml(row.diffSample || '')}</pre>
    </details>
  `;

  const btnPatch = document.getElementById('btn-detail-patch');
  const btnIgnoreRow = document.getElementById('btn-detail-ignore');
  const btnToggleChangedLines = document.getElementById('btn-toggle-changed-lines');
  const btnSelectAllRow = document.getElementById('btn-diff-select-all-row');
  const btnClearRow = document.getElementById('btn-diff-clear-row');
  const btnDiffPatch = document.getElementById('btn-diff-patch');
  const btnDiffIgnore = document.getElementById('btn-diff-ignore');
  const partOpenButtons = dom.detailContent ? Array.from(dom.detailContent.querySelectorAll('.open-part-file-btn')) : [];

  if (btnPatch) {
    btnPatch.addEventListener('click', async () => {
      const ok = window.confirm('이 행을 실제 patch 합니다. 계속할까요?');
      if (!ok) return;
      await runPatchForRows([{ index: row.index, lang: row.lang }]);
      await generateReport();
    });
  }
  if (btnIgnoreRow) {
    btnIgnoreRow.addEventListener('click', async () => {
      try {
        setPending(btnIgnoreRow, true);
        await runIgnoreRows([row]);
      } catch (error) {
        appendLog(`이 행 Diff 무시 실패: ${error.message}`);
      } finally {
        setPending(btnIgnoreRow, false);
      }
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
  if (btnDiffPatch) {
    btnDiffPatch.addEventListener('click', async () => {
      const ok = window.confirm('선택한 Diff만 실제 반영합니다. 계속할까요?');
      if (!ok) return;
      await runApplySelectedDiffs();
    });
  }
  if (btnDiffIgnore) btnDiffIgnore.addEventListener('click', async () => { await runIgnoreSelectedDiffs(); });

  for (const button of partOpenButtons) {
    button.addEventListener('click', async () => {
      const part = button.getAttribute('data-part') || '';
      await openDataFileByRowPart(row, part);
    });
  }
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
  state.ignoredFilters = readIgnoredFilterForm();
  const query = [];
  if (state.ignoredSearch) {
    query.push(`q=${encodeURIComponent(state.ignoredSearch)}`);
  }
  if (state.ignoredFilters.index) query.push(`index=${encodeURIComponent(state.ignoredFilters.index)}`);
  if (state.ignoredFilters.lang) query.push(`lang=${encodeURIComponent(state.ignoredFilters.lang)}`);
  if (state.ignoredFilters.api) query.push(`api=${encodeURIComponent(state.ignoredFilters.api)}`);
  if (state.ignoredFilters.local) query.push(`local=${encodeURIComponent(state.ignoredFilters.local)}`);
  if (state.ignoredFilters.key) query.push(`key=${encodeURIComponent(state.ignoredFilters.key)}`);
  if (state.ignoredFilters.part) query.push(`part=${encodeURIComponent(state.ignoredFilters.part)}`);
  if (state.ignoredFilters.path) query.push(`path=${encodeURIComponent(state.ignoredFilters.path)}`);
  if (state.ignoredFilters.characterKey) query.push(`characterKey=${encodeURIComponent(state.ignoredFilters.characterKey)}`);
  if (state.ignoredFilters.note) query.push(`note=${encodeURIComponent(state.ignoredFilters.note)}`);
  if (state.ignoredFilters.createdFrom) query.push(`createdFrom=${encodeURIComponent(state.ignoredFilters.createdFrom)}`);
  if (state.ignoredFilters.createdTo) query.push(`createdTo=${encodeURIComponent(state.ignoredFilters.createdTo)}`);
  if (state.ignoredSort) query.push(`sort=${encodeURIComponent(state.ignoredSort)}`);
  if (state.ignoredFilters.show || state.ignoredShow) query.push(`show=${encodeURIComponent(state.ignoredFilters.show || state.ignoredShow)}`);
  const rootQuery = query.length ? `&${query.join('&')}` : '';
  const result = await requestJson(`/api/ignored?domain=${encodeURIComponent(state.domain)}${rootQuery}`);
  state.ignoredItems = Array.isArray(result.items) ? result.items : [];
  state.ignoredCount = Number(result.count || state.ignoredItems.length);
  state.ignoredTotalCount = Number(result.totalCount || result.count || state.ignoredItems.length);
  state.ignoredActiveCount = Number(result.activeCount || 0);
  state.ignoredHiddenCount = Number(result.hiddenCount || 0);
  state.ignoredShow = String(state.ignoredFilters.show || state.ignoredShow || 'active').toLowerCase();
  if (dom.ignoredShow) dom.ignoredShow.value = state.ignoredShow;
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

  const restoredFromPrev = prevActive && rowIdSet.has(prevActive) ? prevActive : null;
  state.activeRowId = restoredFromPrev || null;

  if (dom.reportFile) dom.reportFile.textContent = result.reportFile || '-';
  state.ignoredCount = Number(result.ignoredCount || 0);
  renderReportTable();
  renderCounts();
  if (Number(result.autoPatchedCount || 0) > 0) {
    appendLog(`[${state.domain}] 자동 패치 적용: ${result.autoPatchedCount}개 (weapon 소수점 보강)`);
  }
  appendLog(`[${state.domain}] 리포트 생성 완료: ${state.reportRows.length}행 (ignored=${state.ignoredCount})`);
}
function selectedReportRows() {
  const byId = new Map(state.reportRows.map((row) => [rowId(row), row]));
  return [...state.selectedIds]
    .map((id) => byId.get(id))
    .filter(Boolean);
}

function selectedRows() {
  return selectedReportRows().map((row) => ({ index: row.index, lang: row.lang }));
}

async function runPatchForRows(rows) {
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
      parts: filter.parts
    }
  });

  appendLog(`실제 반영 완료: ${result.description || ''}`);
  for (const output of result.outputs || []) {
    const cmd = Array.isArray(output.args) ? output.args.join(' ') : '';
    appendLog(`cmd: node ${cmd}`);
    if (output.stdout) appendLog(output.stdout.trim());
    if (output.stderr) appendLog(output.stderr.trim());
  }
}

function inferDataFileByDomainRowPart(row, part) {
  const targetDomain = String(state.domain || '').trim();
  if (targetDomain === 'character') {
    const fileName = CHARACTER_PART_FILES[String(part || '').trim()];
    if (!fileName) return null;
    return { rootId: 'characters', path: `${row?.key || ''}/${fileName}` };
  }
  if (targetDomain === 'persona') {
    const key = String(row?.key || '').trim();
    if (!key) return null;
    const isOrdered = String(row?.local || '').toLowerCase() === 'ordered';
    const relPath = isOrdered ? `${key}.js` : `${PERSONA_NONORDER_SUBDIR}/${key}.js`;
    return { rootId: PERSONA_DATA_ROOT_ID, path: relPath };
  }
  if (targetDomain === 'wonder_weapon') {
    return { rootId: WONDER_INTERNAL_ROOT_ID, path: 'weapons.js' };
  }
  return null;
}

async function openDataFileByRowPart(row, part) {
  const target = inferDataFileByDomainRowPart(row, part);
  if (!target) {
    appendLog('현재 도메인에서는 파트 파일 바로 열기를 지원하지 않습니다.');
    return;
  }
  if (state.dataDomain !== state.domain) {
    state.dataDomain = state.domain;
    state.dataRoot = '';
    await loadDataRoots();
  }

  if (state.dataRoot !== target.rootId) {
    state.dataRoot = target.rootId;
    if (dom.dataRootsSelect) dom.dataRootsSelect.value = target.rootId;
    await loadDataFileList();
  }

  try {
    await loadDataFile({ rootId: target.rootId, path: target.path });
  } catch (error) {
    appendLog(`데이터 파일 열기 실패: ${error.message}`);
  }
}

async function runApplySelectedDiffs() {
  const diffs = selectedDiffEntries();
  if (diffs.length === 0) {
    appendLog('선택된 Diff가 없습니다.');
    return;
  }

  appendLog(`[${state.domain}] 선택 Diff 실반영 실행: ${diffs.length}개`);
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
      }))
    }
  });

  const cmd = Array.isArray(result.args) ? result.args.join(' ') : '';
  if (cmd) appendLog(`cmd: node ${cmd}`);
  if (result.stdout) appendLog(result.stdout.trim());
  if (result.stderr) appendLog(result.stderr.trim());

  await generateReport();
}

async function runIgnoreDiffEntries(diffs, { emptyMessage = '무시할 Diff가 없습니다.' } = {}) {
  const targetDiffs = Array.isArray(diffs) ? diffs.filter(Boolean) : [];
  if (targetDiffs.length === 0) {
    appendLog(emptyMessage);
    return;
  }

  const result = await requestJson('/api/ignore-diffs', {
    method: 'POST',
    body: {
      domain: state.domain,
      overwrite: true,
      diffs: targetDiffs.map((diff) => ({
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

  appendLog(`[${state.domain}] Diff 무시 처리: +${result.added || 0} / 갱신 ${result.updated || 0}`);
  for (const diff of targetDiffs) state.selectedDiffKeys.delete(diff.diffKey);

  await loadIgnoredList();
  await generateReport();
}

async function runIgnoreRows(rows) {
  const targetRows = Array.isArray(rows) ? rows.filter(Boolean) : [];
  if (!targetRows.length) {
    appendLog('선택된 행이 없습니다.');
    return;
  }

  const diffMap = new Map();
  for (const row of targetRows) {
    for (const diff of collectRowDiffEntries(row)) {
      diffMap.set(diff.diffKey, diff);
    }
  }

  await runIgnoreDiffEntries([...diffMap.values()], { emptyMessage: '무시할 Diff가 없습니다.' });
}

async function runIgnoreSelectedDiffs() {
  const diffs = selectedDiffEntries();
  await runIgnoreDiffEntries(diffs, { emptyMessage: '무시할 Diff가 선택되지 않았습니다.' });
}

async function runUpdateIgnoredState({ keys, isHidden, note }) {
  if (!keys || keys.length === 0) {
    appendLog('무시 항목이 선택되지 않았습니다.');
    return null;
  }
  const payload = {
    domain: state.domain,
    keys
  };
  if (typeof isHidden === 'boolean') payload.isHidden = isHidden;
  if (typeof note === 'string') payload.note = note.trim();
  const result = await requestJson('/api/ignore-diffs', {
    method: 'PATCH',
    body: payload
  });
  return result;
}

async function runHideSelectedIgnored() {
  const keys = [...state.selectedIgnoredKeys];
  if (!keys.length) {
    appendLog('숨길 항목이 선택되지 않았습니다.');
    return;
  }
  const result = await runUpdateIgnoredState({ keys, isHidden: true });
  if (!result) return;
  appendLog(`[${state.domain}] 무시 항목 숨김: ${result.updated || 0}개`);
  state.selectedIgnoredKeys.clear();
  await loadIgnoredList();
}

async function runUnhideSelectedIgnored() {
  const keys = [...state.selectedIgnoredKeys];
  if (!keys.length) {
    appendLog('숨김 해제할 항목이 선택되지 않았습니다.');
    return;
  }
  const result = await runUpdateIgnoredState({ keys, isHidden: false });
  if (!result) return;
  appendLog(`[${state.domain}] 무시 항목 숨김 해제: ${result.updated || 0}개`);
  state.selectedIgnoredKeys.clear();
  await loadIgnoredList();
}

async function runEditIgnoredNoteForKeys(keys, defaultNote = '') {
  const targetKeys = Array.isArray(keys) ? keys : [];
  if (targetKeys.length === 0) {
    appendLog('메모를 편집할 항목이 없습니다.');
    return;
  }
  const nextNote = window.prompt('무시 항목 메모를 입력하세요(비우려면 빈 입력).', defaultNote || '');
  if (nextNote === null) return;
  const result = await runUpdateIgnoredState({ keys: targetKeys, note: String(nextNote).trim() });
  if (!result) return;
  appendLog(`[${state.domain}] 무시 항목 메모 업데이트: ${result.updated || 0}건`);
  await loadIgnoredList();
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
    clearIgnoredFilterInputs();
    resetSelectedParts(state.domain);
    state.dataDomain = state.domain;
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
    } catch (error) {
      appendLog(`도메인 데이터 루트 로드 실패: ${error.message}`);
    }

    await refreshPatchWorkspace();

    try {
      await loadDataFileList();
    } catch (error) {
      appendLog(`도메인 파일 목록 로드 실패: ${error.message}`);
    }
  });
}

function bindEvents() {
  if (dom.viewTabs?.length) {
    for (const tab of dom.viewTabs) {
      tab.addEventListener('click', (event) => {
        const target = closestFromTarget(event.target, '.view-tab');
        if (!target) return;
        const nextView = target.dataset.view;
        if (!nextView) return;
        setActiveView(nextView);
      });
    }
  }

  dom.btnClearLog?.addEventListener('click', clearLog);
  dom.btnHeaderRefresh?.addEventListener('click', async () => {
    try {
      setHeaderRefreshPending(true);
      await refreshPatchWorkspace({ logSuccess: true });
    } catch (error) {
      appendLog(`통합 새로고침 실패: ${error.message}`);
    } finally {
      setHeaderRefreshPending(false);
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
      setHeaderRefreshPending(true);
      await generateReport();
      if (!state.activeRowId && state.reportRows.length > 0) {
        const byCurrentIndex = state.reportRows.find((row) => Number(row.index) === index) || state.reportRows[0];
        state.activeRowId = byCurrentIndex ? rowId(byCurrentIndex) : null;
        renderReportTable();
      }
      focusDetailPanel();
    } catch (error) {
      appendLog(`목록 클릭 리포트 실패: ${error.message}`);
    } finally {
      setHeaderRefreshPending(false);
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
    const current = state.reportRows.find((item) => rowId(item) === id);
    if (current) state.activeListIndex = Number(current.index);
    state.activeRowId = id;
    renderReportTable();
    focusDetailPanel();
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

  dom.btnPatchSelected?.addEventListener('click', async () => {
    if (!window.confirm('선택한 행을 실제 반영합니다. 계속할까요?')) return;
    try {
      setPending(dom.btnPatchSelected, true);
      await runPatchForRows(selectedRows());
      await generateReport();
    } catch (error) {
      appendLog(`선택 행 실반영 실패: ${error.message}`);
    } finally {
      setPending(dom.btnPatchSelected, false);
    }
  });

  dom.btnIgnoreSelected?.addEventListener('click', async () => {
    try {
      setPending(dom.btnIgnoreSelected, true);
      await runIgnoreRows(selectedReportRows());
    } catch (error) {
      appendLog(`선택 행 Diff 무시 실패: ${error.message}`);
    } finally {
      setPending(dom.btnIgnoreSelected, false);
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

  dom.dataRootsSelect?.addEventListener('change', async () => {
    state.dataRoot = dom.dataRootsSelect?.value || '';
    state.selectedDataFile = null;
    state.dataFilePath = '';
    state.dataEditorRaw = '';
    state.dataEditorParsed = null;
    state.dataEditorMeta = null;
    state.dataEditorParseError = null;
    if (dom.dataFilePathInput) dom.dataFilePathInput.value = '';
    if (dom.dataEditor) dom.dataEditor.value = '';
    setDataEditorMode('raw', { renderOnly: true });
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

  dom.dataEditorModeForm?.addEventListener('click', () => {
    setDataEditorMode('form');
  });

  dom.dataEditorModeRaw?.addEventListener('click', () => {
    setDataEditorMode('raw');
  });

  dom.dataEditor?.addEventListener('input', () => {
    syncDataEditorFromRaw();
    setDataEditorDirty(true);
  });

  dom.dataEditorForm?.addEventListener('input', (event) => {
    if (!(event.target instanceof Element)) return;
    handleDataEditorInputChange(event.target);
  });

  dom.dataEditorForm?.addEventListener('change', (event) => {
    if (!(event.target instanceof Element)) return;
    handleDataEditorInputChange(event.target);
  });

  dom.dataEditorForm?.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    const actionButton = closestFromTarget(event.target, '[data-action="add-array-item"], [data-action="remove-array-item"], [data-action="remove-object"], [data-action="add-object-key"]');
    if (!actionButton) return;
    event.preventDefault();
    handleDataEditorNodeAction(actionButton);
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
    if (state.ignoredSearch) {
      loadIgnoredList();
      return;
    }
    renderIgnoredList();
  });

  dom.ignoredSearchClear?.addEventListener('click', () => {
    clearIgnoredFilterInputs();
    loadIgnoredList().catch((error) => {
      appendLog(`무시 검색 초기화 실패: ${error.message}`);
    });
  });

  [dom.ignoredFilterIndex, dom.ignoredFilterLang, dom.ignoredFilterApi, dom.ignoredFilterLocal, dom.ignoredFilterKey,
  dom.ignoredFilterPart, dom.ignoredFilterPath, dom.ignoredFilterCharacterKey, dom.ignoredFilterNote,
  dom.ignoredFilterCreatedFrom, dom.ignoredFilterCreatedTo].forEach((el) => {
    if (!el) return;
    el.addEventListener('input', async () => {
      try {
        syncIgnoredFilterState();
        await loadIgnoredList();
      } catch (error) {
        appendLog(`무시 필터 적용 실패: ${error.message}`);
      }
    });
  });

  dom.ignoredFiltersClear?.addEventListener('click', async () => {
    clearIgnoredFilterInputs();
    try {
      setPending(dom.ignoredFiltersClear, true);
      await loadIgnoredList();
    } catch (error) {
      appendLog(`무시 필터 초기화 실패: ${error.message}`);
    } finally {
      setPending(dom.ignoredFiltersClear, false);
    }
  });

  if (dom.ignoredSort) {
    dom.ignoredSort.addEventListener('change', async () => {
      state.ignoredSort = dom.ignoredSort?.value || 'created_desc';
      if (dom.ignoredSort) dom.ignoredSort.value = state.ignoredSort;
      try {
        await loadIgnoredList();
      } catch (error) {
        appendLog(`무시 정렬 변경 실패: ${error.message}`);
      }
    });
  }

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

  dom.btnHideSelectedIgnored?.addEventListener('click', async () => {
    try {
      setPending(dom.btnHideSelectedIgnored, true);
      await runHideSelectedIgnored();
    } catch (error) {
      appendLog(`무시 항목 숨김 실패: ${error.message}`);
    } finally {
      setPending(dom.btnHideSelectedIgnored, false);
    }
  });

  dom.btnUnhideSelectedIgnored?.addEventListener('click', async () => {
    try {
      setPending(dom.btnUnhideSelectedIgnored, true);
      await runUnhideSelectedIgnored();
    } catch (error) {
      appendLog(`무시 항목 숨김 해제 실패: ${error.message}`);
    } finally {
      setPending(dom.btnUnhideSelectedIgnored, false);
    }
  });

  dom.btnEditIgnoredNote?.addEventListener('click', async () => {
    const keys = [...state.selectedIgnoredKeys];
    if (!keys.length) {
      appendLog('메모를 편집할 항목을 먼저 선택해 주세요.');
      return;
    }
    const selected = state.ignoredItems.find((item) => item.key === keys[0]) || null;
    const base = selected ? String(selected.note || '') : '';
    try {
      setPending(dom.btnEditIgnoredNote, true);
      await runEditIgnoredNoteForKeys(keys, base);
    } catch (error) {
      appendLog(`무시 항목 메모 편집 실패: ${error.message}`);
    } finally {
      setPending(dom.btnEditIgnoredNote, false);
    }
  });

  if (dom.ignoredShow) {
    dom.ignoredShow.addEventListener('change', async () => {
      state.ignoredShow = dom.ignoredShow?.value || 'active';
      try {
        const btn = dom.ignoredShow;
        setPending(btn, true);
        await loadIgnoredList();
      } catch (error) {
        appendLog(`무시 모드 변경 실패: ${error.message}`);
      } finally {
        setPending(dom.ignoredShow, false);
      }
    });
  }

  dom.ignoredList?.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.type !== 'checkbox') return;
    const key = String(target.dataset.ignoreKey || '').trim();
    if (!key) return;
    if (target.checked) state.selectedIgnoredKeys.add(key);
    else state.selectedIgnoredKeys.delete(key);
  });

  dom.ignoredList?.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const actionBtn = closestFromTarget(target, '.ignored-item-btn');
    if (!actionBtn) return;
    event.preventDefault();
    event.stopPropagation();
    const action = String(actionBtn.dataset.action || '').trim();
    const key = String(actionBtn.dataset.ignoreKey || '').trim();
    if (!action || !key) return;
    const item = state.ignoredItems.find((entry) => String(entry.key || '') === key) || null;

    if (action === 'ignore-note') {
      const base = item ? String(item.note || '') : '';
      await runEditIgnoredNoteForKeys([key], base);
      return;
    }

    if (action === 'hide-ignore' || action === 'unhide-ignore') {
      const isHidden = action === 'hide-ignore';
      await runUpdateIgnoredState({ keys: [key], isHidden });
      await loadIgnoredList();
      await generateReport();
      return;
    }
  });
}

async function bootstrap() {
  state.activeView = normalizeView(getUrlView() || getStoredView() || 'work');
  resetSelectedParts(state.domain);
  bindPartsPicker();
  bindEvents();
  bindDomainEvents();
  renderCounts();
  renderCharList();
  renderReportTable();
  renderIgnoredList();
  renderActiveView();
  setDetailAvatar(null);
  appendLog(`초기화 완료 (${APP_VERSION})`);
  if (dom.ignoredSort) {
    dom.ignoredSort.value = state.ignoredSort || 'created_desc';
  }

  try {
    await loadCapabilities();
  } catch (error) {
    appendLog(`초기 capabilities 로드 실패: ${error.message}`);
  }
  state.dataDomain = state.domain;

  try {
    await loadDataRoots();
  } catch (error) {
    appendLog(`초기 데이터 루트 로드 실패: ${error.message}`);
  }

  try {
    await loadDataFileList();
  } catch (error) {
    appendLog(`초기 데이터 파일 목록 로드 실패: ${error.message}`);
  }

  await refreshPatchWorkspace();
}

bootstrap();
