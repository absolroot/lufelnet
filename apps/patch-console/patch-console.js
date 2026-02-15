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
  showChangedLinesOnly: false,
  revelationAdmin: {
    revision: '',
    cards: [],
    options: { main: [], sub: [] },
    selectedId: '',
    detail: null,
    draft: null,
    dirty: false,
    createOpen: false
  }
};

const DOMAIN_PARTS = {
  character: ['ritual', 'skill', 'weapon', 'base_stats'],
  persona: ['profile', 'innate_skill', 'passive_skill', 'uniqueSkill', 'highlight'],
  wonder_weapon: ['name', 'effect'],
  revelation: ['name', 'relation', 'effect', 'unreleased']
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
const REVELATION_LANGS = ['kr', 'en', 'jp', 'cn'];
const DOMAIN_DEFAULT_LANGS = {
  character: 'kr,en,jp',
  persona: 'kr,en,jp',
  wonder_weapon: 'kr,en,jp,cn',
  revelation: 'kr,en,jp,cn'
};

const FALLBACK_CAPABILITIES = [
  { id: 'character', label: 'Character', enabled: true, features: ['list', 'report', 'patch', 'create'], parts: DOMAIN_PARTS.character },
  { id: 'persona', label: 'Persona', enabled: true, features: ['list', 'report', 'patch'], parts: DOMAIN_PARTS.persona },
  { id: 'wonder_weapon', label: 'Wonder Weapon', enabled: true, features: ['list', 'report', 'patch'], parts: DOMAIN_PARTS.wonder_weapon },
  { id: 'revelation', label: 'Revelation', enabled: true, features: ['list', 'report', 'patch', 'create'], parts: DOMAIN_PARTS.revelation }
];

const APP_VERSION = 'patch-console v0.12.3';
const VIEW_KEY = 'patch-console.activeView';
const DATA_EDITOR_MODE_KEY = 'patch-console.dataEditorMode';
const VALID_VIEWS = new Set(['work', 'ignored', 'editor', 'revelation-admin']);

const dom = {
  domainTabs: document.getElementById('domain-tabs'),
  viewTabs: document.querySelectorAll('.view-tab'),
  panelWork: document.getElementById('panel-work'),
  panelIgnored: document.getElementById('panel-ignored'),
  panelEditor: document.getElementById('panel-editor'),
  panelRevelationAdmin: document.getElementById('panel-revelation-admin'),
  currentDomain: document.getElementById('current-domain'),
  addCharacterGroup: document.getElementById('add-character-group'),
  addRevelationGroup: document.getElementById('add-revelation-group'),
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
  btnAddCharacter: document.getElementById('btn-add-character'),
  newRevelationKind: document.getElementById('new-revelation-kind'),
  newRevelationKr: document.getElementById('new-revelation-kr'),
  newRevelationEn: document.getElementById('new-revelation-en'),
  newRevelationJp: document.getElementById('new-revelation-jp'),
  newRevelationCn: document.getElementById('new-revelation-cn'),
  newRevelationTypes: document.getElementById('new-revelation-types'),
  newRevelationUnreleased: document.getElementById('new-revelation-unreleased'),
  newRevelationSet2Kr: document.getElementById('new-revelation-set2-kr'),
  newRevelationSet4Kr: document.getElementById('new-revelation-set4-kr'),
  newRevelationSet2En: document.getElementById('new-revelation-set2-en'),
  newRevelationSet4En: document.getElementById('new-revelation-set4-en'),
  newRevelationSet2Jp: document.getElementById('new-revelation-set2-jp'),
  newRevelationSet4Jp: document.getElementById('new-revelation-set4-jp'),
  newRevelationSet2Cn: document.getElementById('new-revelation-set2-cn'),
  newRevelationSet4Cn: document.getElementById('new-revelation-set4-cn'),
  btnAddRevelation: document.getElementById('btn-add-revelation'),
  revAdminSearch: document.getElementById('rev-admin-search'),
  revAdminKindFilter: document.getElementById('rev-admin-kind-filter'),
  revAdminUnreleasedFilter: document.getElementById('rev-admin-unreleased-filter'),
  btnRevAdminRefresh: document.getElementById('btn-rev-admin-refresh'),
  btnRevAdminNewToggle: document.getElementById('btn-rev-admin-new-toggle'),
  revAdminCardList: document.getElementById('rev-admin-card-list'),
  revAdminEmpty: document.getElementById('rev-admin-empty'),
  revAdminDetail: document.getElementById('rev-admin-detail'),
  revAdminDirtyState: document.getElementById('rev-admin-dirty-state'),
  revAdminCardId: document.getElementById('rev-admin-card-id'),
  revAdminCardKind: document.getElementById('rev-admin-card-kind'),
  revAdminNameKr: document.getElementById('rev-admin-name-kr'),
  revAdminNameEn: document.getElementById('rev-admin-name-en'),
  revAdminNameJp: document.getElementById('rev-admin-name-jp'),
  revAdminNameCn: document.getElementById('rev-admin-name-cn'),
  btnRevAdminRenameKr: document.getElementById('btn-rev-admin-rename-kr'),
  revAdminTypes: document.getElementById('rev-admin-types'),
  revAdminUnreleased: document.getElementById('rev-admin-unreleased'),
  revAdminMainFields: document.getElementById('rev-admin-main-fields'),
  revAdminSubFields: document.getElementById('rev-admin-sub-fields'),
  revAdminMainSubOptions: document.getElementById('rev-admin-main-sub-options'),
  revAdminMainEffects: document.getElementById('rev-admin-main-effects'),
  revAdminSubMainRefs: document.getElementById('rev-admin-sub-main-refs'),
  revAdminSubSet2Kr: document.getElementById('rev-admin-sub-set2-kr'),
  revAdminSubSet4Kr: document.getElementById('rev-admin-sub-set4-kr'),
  revAdminSubSet2En: document.getElementById('rev-admin-sub-set2-en'),
  revAdminSubSet4En: document.getElementById('rev-admin-sub-set4-en'),
  revAdminSubSet2Jp: document.getElementById('rev-admin-sub-set2-jp'),
  revAdminSubSet4Jp: document.getElementById('rev-admin-sub-set4-jp'),
  revAdminSubSet2Cn: document.getElementById('rev-admin-sub-set2-cn'),
  revAdminSubSet4Cn: document.getElementById('rev-admin-sub-set4-cn'),
  btnRevAdminSave: document.getElementById('btn-rev-admin-save'),
  btnRevAdminReset: document.getElementById('btn-rev-admin-reset'),
  revAdminCreate: document.getElementById('rev-admin-create'),
  revAdminCreateKind: document.getElementById('rev-admin-create-kind'),
  revAdminCreateNameKr: document.getElementById('rev-admin-create-name-kr'),
  revAdminCreateNameEn: document.getElementById('rev-admin-create-name-en'),
  revAdminCreateNameJp: document.getElementById('rev-admin-create-name-jp'),
  revAdminCreateNameCn: document.getElementById('rev-admin-create-name-cn'),
  revAdminCreateTypes: document.getElementById('rev-admin-create-types'),
  revAdminCreateUnreleased: document.getElementById('rev-admin-create-unreleased'),
  revAdminCreateMainFields: document.getElementById('rev-admin-create-main-fields'),
  revAdminCreateSubFields: document.getElementById('rev-admin-create-sub-fields'),
  revAdminCreateMainSubOptions: document.getElementById('rev-admin-create-main-sub-options'),
  revAdminCreateMainEffects: document.getElementById('rev-admin-create-main-effects'),
  revAdminCreateSubSet2Kr: document.getElementById('rev-admin-create-sub-set2-kr'),
  revAdminCreateSubSet4Kr: document.getElementById('rev-admin-create-sub-set4-kr'),
  revAdminCreateSubSet2En: document.getElementById('rev-admin-create-sub-set2-en'),
  revAdminCreateSubSet4En: document.getElementById('rev-admin-create-sub-set4-en'),
  revAdminCreateSubSet2Jp: document.getElementById('rev-admin-create-sub-set2-jp'),
  revAdminCreateSubSet4Jp: document.getElementById('rev-admin-create-sub-set4-jp'),
  revAdminCreateSubSet2Cn: document.getElementById('rev-admin-create-sub-set2-cn'),
  revAdminCreateSubSet4Cn: document.getElementById('rev-admin-create-sub-set4-cn'),
  btnRevAdminCreateSubmit: document.getElementById('btn-rev-admin-create-submit'),
  btnRevAdminCreateCancel: document.getElementById('btn-rev-admin-create-cancel')
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
    if (pathEnd === 'revelation-admin') return 'revelation-admin';
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

function syncViewTabsForDomain() {
  if (!dom.viewTabs?.length) return;
  for (const tab of dom.viewTabs) {
    const view = String(tab.dataset.view || '').trim();
    const visible = view !== 'revelation-admin' || state.domain === 'revelation';
    tab.classList.toggle('hidden', !visible);
    tab.disabled = !visible;
  }
}

function getViewPath(view) {
  const next = normalizeView(view);
  try {
    const url = new URL(window.location.href);
    const normalizedPath = String(url.pathname || '/')
      .replace(/\/(work|ignored|editor|revelation-admin|index\.html)?\/?$/, '/')
      .replace(/\/+/g, '/');
    return `${normalizedPath}${next}`;
  } catch {
    return `/${next}`;
  }
}

function setActiveView(view) {
  const normalized = normalizeView(view);
  state.activeView = (normalized === 'revelation-admin' && state.domain !== 'revelation') ? 'work' : normalized;
  syncViewTabsForDomain();
  if (dom.panelWork) dom.panelWork.classList.toggle('hidden', state.activeView !== 'work');
  if (dom.panelIgnored) dom.panelIgnored.classList.toggle('hidden', state.activeView !== 'ignored');
  if (dom.panelEditor) dom.panelEditor.classList.toggle('hidden', state.activeView !== 'editor');
  if (dom.panelRevelationAdmin) dom.panelRevelationAdmin.classList.toggle('hidden', state.activeView !== 'revelation-admin');

  const sidebars = document.querySelectorAll('.view-sidebar');
  for (const sidebar of sidebars) {
    const target = String(sidebar.dataset.view || '').toLowerCase();
    sidebar.classList.toggle('hidden', target !== state.activeView);
  }

  document.body.classList.remove('view-work', 'view-ignored', 'view-editor', 'view-revelation-admin');
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
  if (state.activeView === 'revelation-admin' && state.domain === 'revelation') {
    ensureRevelationAdminBootstrapped();
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

function defaultLangsForDomain(domain = state.domain) {
  const key = String(domain || '').trim();
  return DOMAIN_DEFAULT_LANGS[key] || DOMAIN_DEFAULT_LANGS.character;
}

function setLangInputForDomain(domain = state.domain) {
  if (!dom.langsInput) return;
  dom.langsInput.value = defaultLangsForDomain(domain);
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
    langs: asCsv(parseCsv(dom.langsInput?.value || '')) || defaultLangsForDomain(state.domain),
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
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
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
  syncViewTabsForDomain();
  if (dom.addCharacterGroup) {
    dom.addCharacterGroup.classList.toggle('hidden', state.domain !== 'character');
  }
  if (dom.addRevelationGroup) {
    dom.addRevelationGroup.classList.toggle('hidden', state.domain !== 'revelation');
  }
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
      const statusKeys = Object.keys(row.status || {}).sort((a, b) => {
        const order = ['kr', 'en', 'jp', 'cn'];
        const ai = order.includes(a) ? order.indexOf(a) : 999;
        const bi = order.includes(b) ? order.indexOf(b) : 999;
        if (ai !== bi) return ai - bi;
        return a.localeCompare(b);
      });
      const status = statusKeys
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
    setLangInputForDomain(state.domain);
    if (state.domain === 'revelation' && state.activeView !== 'revelation-admin') {
      state.activeView = 'revelation-admin';
    }
    if (state.domain !== 'revelation' && state.activeView === 'revelation-admin') {
      state.activeView = 'work';
    }
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
  const langs = asCsv(parseCsv(dom.langsInput?.value || '')) || defaultLangsForDomain(state.domain);
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
  if (targetDomain === 'revelation') {
    const langRaw = String(row?.lang || '').trim().toLowerCase();
    const lang = REVELATION_LANGS.includes(langRaw) ? langRaw : 'kr';
    return { rootId: `revelation_${lang}`, path: 'revelations.js' };
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
  const result = await requestJson('/api/create-entry', {
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

function clearRevelationCreateInputs() {
  if (dom.newRevelationKind) dom.newRevelationKind.value = 'sub';
  if (dom.newRevelationKr) dom.newRevelationKr.value = '';
  if (dom.newRevelationEn) dom.newRevelationEn.value = '';
  if (dom.newRevelationJp) dom.newRevelationJp.value = '';
  if (dom.newRevelationCn) dom.newRevelationCn.value = '';
  if (dom.newRevelationTypes) dom.newRevelationTypes.value = '';
  if (dom.newRevelationUnreleased) dom.newRevelationUnreleased.checked = false;
  if (dom.newRevelationSet2Kr) dom.newRevelationSet2Kr.value = '';
  if (dom.newRevelationSet4Kr) dom.newRevelationSet4Kr.value = '';
  if (dom.newRevelationSet2En) dom.newRevelationSet2En.value = '';
  if (dom.newRevelationSet4En) dom.newRevelationSet4En.value = '';
  if (dom.newRevelationSet2Jp) dom.newRevelationSet2Jp.value = '';
  if (dom.newRevelationSet4Jp) dom.newRevelationSet4Jp.value = '';
  if (dom.newRevelationSet2Cn) dom.newRevelationSet2Cn.value = '';
  if (dom.newRevelationSet4Cn) dom.newRevelationSet4Cn.value = '';
}

async function addRevelation() {
  if (state.domain !== 'revelation') {
    appendLog(`[${state.domain}] 신규 계시 생성은 revelation 도메인에서만 지원합니다.`);
    return;
  }

  const kind = String(dom.newRevelationKind?.value || '').trim().toLowerCase();
  const kr = String(dom.newRevelationKr?.value || '').trim();
  const en = String(dom.newRevelationEn?.value || '').trim();
  const jp = String(dom.newRevelationJp?.value || '').trim();
  const cn = String(dom.newRevelationCn?.value || '').trim();
  if (!kind || !kr || !en || !jp || !cn) {
    appendLog('신규 계시 생성 실패: kind/kr/en/jp/cn 모두 필요합니다.');
    return;
  }

  const payload = {
    domain: state.domain,
    kind,
    kr,
    en,
    jp,
    cn,
    types: String(dom.newRevelationTypes?.value || '').trim(),
    unreleased: Boolean(dom.newRevelationUnreleased?.checked),
    set2_kr: String(dom.newRevelationSet2Kr?.value || '').trim(),
    set4_kr: String(dom.newRevelationSet4Kr?.value || '').trim(),
    set2_en: String(dom.newRevelationSet2En?.value || '').trim(),
    set4_en: String(dom.newRevelationSet4En?.value || '').trim(),
    set2_jp: String(dom.newRevelationSet2Jp?.value || '').trim(),
    set4_jp: String(dom.newRevelationSet4Jp?.value || '').trim(),
    set2_cn: String(dom.newRevelationSet2Cn?.value || '').trim(),
    set4_cn: String(dom.newRevelationSet4Cn?.value || '').trim()
  };

  appendLog(`신규 계시 생성 요청: kind=${kind}, kr=${kr}, en=${en}, jp=${jp}, cn=${cn}`);
  const result = await requestJson('/api/create-entry', {
    method: 'POST',
    body: payload
  });

  if (result.stdout) appendLog(String(result.stdout).trim());
  if (result.stderr) appendLog(String(result.stderr).trim());
  appendLog(`신규 계시 생성 완료: ${kr} (${kind})`);

  clearRevelationCreateInputs();

  await loadList();
  const matched = state.listRows.find((row) => String(row.key || '').trim() === kr && String(row.local || '').trim() === kind);
  if (matched) {
    state.activeListIndex = matched.index;
    if (dom.scopeMode) dom.scopeMode.value = 'nums';
    if (dom.scopeValue) dom.scopeValue.value = String(matched.index);
    renderCharList();
    await generateReport();
  }
}

function cloneData(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function revelationAdminState() {
  return state.revelationAdmin;
}

function revelationAdminOptionById(id) {
  const rev = revelationAdminState();
  const all = [...(rev.options.main || []), ...(rev.options.sub || [])];
  return all.find((item) => String(item.id || '') === String(id || '')) || null;
}

function revelationNameById(id, lang = 'kr') {
  const card = revelationAdminOptionById(id);
  if (!card) return String(id || '');
  return String(card.names?.[lang] || card.names?.kr || id || '');
}

function revelationParseCardId(id) {
  const text = String(id || '').trim();
  const idx = text.indexOf(':');
  if (idx <= 0) return { kind: '', kr: text };
  return {
    kind: text.slice(0, idx).trim(),
    kr: text.slice(idx + 1).trim()
  };
}

function revelationDraftSignature(value) {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return '';
  }
}

function updateRevelationAdminDirtyState() {
  const rev = revelationAdminState();
  const before = revelationDraftSignature(rev.detail);
  const after = revelationDraftSignature(rev.draft);
  rev.dirty = Boolean(rev.draft) && before !== after;
  if (dom.revAdminDirtyState) {
    dom.revAdminDirtyState.textContent = rev.dirty ? 'dirty (save required)' : 'saved';
  }
}

function applyRevelationAdminDraftMutation(mutator, { refreshList = false, refreshDetail = false } = {}) {
  const rev = revelationAdminState();
  if (!rev.draft || typeof rev.draft !== 'object') return;
  mutator(rev.draft);
  updateRevelationAdminDirtyState();
  if (refreshList) renderRevelationAdminCardList();
  if (refreshDetail) renderRevelationAdminDetail();
}

function clearRevelationAdminState() {
  const rev = revelationAdminState();
  rev.revision = '';
  rev.cards = [];
  rev.options = { main: [], sub: [] };
  rev.selectedId = '';
  rev.detail = null;
  rev.draft = null;
  rev.dirty = false;
}

async function handleRevelationAdminAction(action, actionLabel) {
  try {
    await action();
    return true;
  } catch (error) {
    if (Number(error?.status) === 409) {
      appendLog(`[revelation] ${actionLabel} failed: stale revision. reloading latest data.`);
      try {
        await loadRevelationAdminBootstrap({ preserveSelection: true });
      } catch (reloadError) {
        appendLog(`[revelation] reload after conflict failed: ${reloadError.message}`);
      }
      return false;
    }
    appendLog(`[revelation] ${actionLabel} failed: ${error.message}`);
    return false;
  }
}

function ensureMainEffectEntry(draft, subId) {
  if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
  if (!draft.effects.bySubId || typeof draft.effects.bySubId !== 'object') draft.effects.bySubId = {};
  if (!draft.effects.bySubId[subId] || typeof draft.effects.bySubId[subId] !== 'object') {
    draft.effects.bySubId[subId] = { kr: '', en: '', jp: '', cn: '' };
  }
  for (const lang of ['kr', 'en', 'jp', 'cn']) {
    if (draft.effects.bySubId[subId][lang] == null) draft.effects.bySubId[subId][lang] = '';
  }
  return draft.effects.bySubId[subId];
}

function normalizeRevelationDraftShape(draft) {
  if (!draft || typeof draft !== 'object') return null;
  if (!draft.names || typeof draft.names !== 'object') draft.names = { kr: '', en: '', jp: '', cn: '' };
  for (const lang of ['kr', 'en', 'jp', 'cn']) {
    if (draft.names[lang] == null) draft.names[lang] = '';
  }
  if (!Array.isArray(draft.types)) draft.types = parseCsv(draft.types || '');
  if (!draft.relations || typeof draft.relations !== 'object') draft.relations = {};
  if (!Array.isArray(draft.relations.subIds)) draft.relations.subIds = [];
  if (!Array.isArray(draft.relations.mainIds)) draft.relations.mainIds = [];
  if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
  if (draft.kind === 'main') {
    if (!draft.effects.bySubId || typeof draft.effects.bySubId !== 'object') draft.effects.bySubId = {};
  } else {
    if (!draft.effects.set2 || typeof draft.effects.set2 !== 'object') draft.effects.set2 = { kr: '', en: '', jp: '', cn: '' };
    if (!draft.effects.set4 || typeof draft.effects.set4 !== 'object') draft.effects.set4 = { kr: '', en: '', jp: '', cn: '' };
    for (const lang of ['kr', 'en', 'jp', 'cn']) {
      if (draft.effects.set2[lang] == null) draft.effects.set2[lang] = '';
      if (draft.effects.set4[lang] == null) draft.effects.set4[lang] = '';
    }
  }
  return draft;
}

function filteredRevelationAdminCards() {
  const rev = revelationAdminState();
  const q = String(dom.revAdminSearch?.value || '').trim().toLowerCase();
  const kindFilter = String(dom.revAdminKindFilter?.value || 'all').trim().toLowerCase();
  const unreleasedFilter = String(dom.revAdminUnreleasedFilter?.value || 'all').trim().toLowerCase();

  return (Array.isArray(rev.cards) ? rev.cards : []).filter((card) => {
    const kindMatch = kindFilter === 'all' || String(card.kind || '') === kindFilter;
    if (!kindMatch) return false;

    if (unreleasedFilter === 'yes' && !card.unreleased) return false;
    if (unreleasedFilter === 'no' && card.unreleased) return false;

    if (!q) return true;
    const source = `${card.id || ''} ${card.names?.kr || ''} ${card.names?.en || ''} ${card.names?.jp || ''} ${card.names?.cn || ''} ${(card.types || []).join(' ')}`.toLowerCase();
    return source.includes(q);
  });
}

function renderRevelationAdminCardList() {
  if (!dom.revAdminCardList) return;
  const rev = revelationAdminState();
  const rows = filteredRevelationAdminCards();
  if (rows.length === 0) {
    dom.revAdminCardList.innerHTML = '<p class="muted" style="padding:10px;">No cards to display.</p>';
    return;
  }

  dom.revAdminCardList.innerHTML = rows.map((card) => {
    const active = String(card.id || '') === String(rev.selectedId || '') ? 'active' : '';
    const icon = card.icon
      ? `<img class="char-icon" src="${escapeHtml(card.icon)}" alt="">`
      : '<div class="char-icon-fallback">N/A</div>';
    const badges = [
      `<span class="revelation-admin-badge ${escapeHtml(card.kind)}">${escapeHtml(card.kind)}</span>`,
      card.unreleased ? '<span class="revelation-admin-badge unreleased">unreleased</span>' : '',
      (rev.dirty && String(card.id || '') === String(rev.selectedId || ''))
        ? '<span class="revelation-admin-badge dirty">dirty</span>'
        : '',
      `<span class="revelation-admin-badge">links:${Number(card.relationCount || 0)}</span>`
    ].filter(Boolean).join('');
    return `
      <div class="revelation-admin-card-item ${active}" data-card-id="${escapeHtml(card.id)}">
        ${icon}
        <div class="revelation-admin-card-main">
          <strong>${escapeHtml(card.names?.kr || card.id)}</strong>
          <p class="revelation-admin-card-subline">${escapeHtml(card.names?.en || '-')} | ${escapeHtml(card.names?.jp || '-')} | ${escapeHtml(card.names?.cn || '-')}</p>
          <div class="revelation-admin-badges">${badges}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderRevelationAdminMainFields(draft) {
  if (!dom.revAdminMainSubOptions || !dom.revAdminMainEffects) return;
  const rev = revelationAdminState();
  const selected = new Set(Array.isArray(draft.relations?.subIds) ? draft.relations.subIds : []);
  const options = Array.isArray(rev.options.sub) ? rev.options.sub : [];

  dom.revAdminMainSubOptions.innerHTML = options.map((item) => {
    const checked = selected.has(item.id) ? 'checked' : '';
    const label = `${item.names?.kr || item.id} | ${item.names?.en || '-'} | ${item.names?.jp || '-'} | ${item.names?.cn || '-'}`;
    return `<label class="revelation-admin-sub-option"><input class="rev-admin-main-sub-check" type="checkbox" data-sub-id="${escapeHtml(item.id)}" ${checked}> <span>${escapeHtml(label)}</span></label>`;
  }).join('');

  const selectedIds = Array.isArray(draft.relations?.subIds) ? draft.relations.subIds : [];
  const rows = selectedIds.map((subId) => {
    const effect = ensureMainEffectEntry(draft, subId);
    const title = revelationNameById(subId, 'kr');
    return `
      <div class="revelation-admin-main-effect-row">
        <h4>${escapeHtml(title)}</h4>
        <div class="revelation-admin-main-effect-grid">
          <div class="field"><label>KR</label><textarea class="rev-admin-main-effect-text" data-sub-id="${escapeHtml(subId)}" data-lang="kr" rows="2">${escapeHtml(effect.kr || '')}</textarea></div>
          <div class="field"><label>EN</label><textarea class="rev-admin-main-effect-text" data-sub-id="${escapeHtml(subId)}" data-lang="en" rows="2">${escapeHtml(effect.en || '')}</textarea></div>
          <div class="field"><label>JP</label><textarea class="rev-admin-main-effect-text" data-sub-id="${escapeHtml(subId)}" data-lang="jp" rows="2">${escapeHtml(effect.jp || '')}</textarea></div>
          <div class="field"><label>CN</label><textarea class="rev-admin-main-effect-text" data-sub-id="${escapeHtml(subId)}" data-lang="cn" rows="2">${escapeHtml(effect.cn || '')}</textarea></div>
        </div>
      </div>
    `;
  });

  dom.revAdminMainEffects.innerHTML = rows.length > 0
    ? rows.join('')
    : '<p class="muted small">Select at least one sub card to edit main effects.</p>';
}

function renderRevelationAdminSubFields(draft) {
  if (!dom.revAdminSubMainRefs) return;
  const mainIds = Array.isArray(draft.relations?.mainIds) ? draft.relations.mainIds : [];
  dom.revAdminSubMainRefs.innerHTML = mainIds.length > 0
    ? mainIds.map((id) => `<span class="revelation-admin-chip">${escapeHtml(revelationNameById(id, 'kr'))}</span>`).join('')
    : '<span class="muted small">No linked main cards.</span>';

  if (dom.revAdminSubSet2Kr) dom.revAdminSubSet2Kr.value = String(draft.effects?.set2?.kr || '');
  if (dom.revAdminSubSet4Kr) dom.revAdminSubSet4Kr.value = String(draft.effects?.set4?.kr || '');
  if (dom.revAdminSubSet2En) dom.revAdminSubSet2En.value = String(draft.effects?.set2?.en || '');
  if (dom.revAdminSubSet4En) dom.revAdminSubSet4En.value = String(draft.effects?.set4?.en || '');
  if (dom.revAdminSubSet2Jp) dom.revAdminSubSet2Jp.value = String(draft.effects?.set2?.jp || '');
  if (dom.revAdminSubSet4Jp) dom.revAdminSubSet4Jp.value = String(draft.effects?.set4?.jp || '');
  if (dom.revAdminSubSet2Cn) dom.revAdminSubSet2Cn.value = String(draft.effects?.set2?.cn || '');
  if (dom.revAdminSubSet4Cn) dom.revAdminSubSet4Cn.value = String(draft.effects?.set4?.cn || '');
}

function renderRevelationAdminDetail() {
  const rev = revelationAdminState();
  if (!dom.revAdminEmpty || !dom.revAdminDetail) return;

  const draft = normalizeRevelationDraftShape(cloneData(rev.draft));
  if (!draft) {
    dom.revAdminEmpty.classList.remove('hidden');
    dom.revAdminDetail.classList.add('hidden');
    renderRevelationAdminCardList();
    return;
  }

  rev.draft = draft;
  dom.revAdminEmpty.classList.add('hidden');
  dom.revAdminDetail.classList.remove('hidden');

  if (dom.revAdminCardId) dom.revAdminCardId.textContent = String(draft.id || '-');
  if (dom.revAdminCardKind) dom.revAdminCardKind.textContent = String(draft.kind || '-');
  if (dom.revAdminNameKr) dom.revAdminNameKr.value = String(draft.names?.kr || '');
  if (dom.revAdminNameEn) dom.revAdminNameEn.value = String(draft.names?.en || '');
  if (dom.revAdminNameJp) dom.revAdminNameJp.value = String(draft.names?.jp || '');
  if (dom.revAdminNameCn) dom.revAdminNameCn.value = String(draft.names?.cn || '');
  if (dom.revAdminTypes) dom.revAdminTypes.value = parseCsv(draft.types || []).join(',');
  if (dom.revAdminUnreleased) dom.revAdminUnreleased.checked = Boolean(draft.unreleased);

  const isMain = draft.kind === 'main';
  if (dom.revAdminMainFields) dom.revAdminMainFields.classList.toggle('hidden', !isMain);
  if (dom.revAdminSubFields) dom.revAdminSubFields.classList.toggle('hidden', isMain);
  if (isMain) renderRevelationAdminMainFields(draft);
  else renderRevelationAdminSubFields(draft);

  updateRevelationAdminDirtyState();
  renderRevelationAdminCardList();
}

function renderRevelationAdminCreateMainFields() {
  if (!dom.revAdminCreateMainSubOptions || !dom.revAdminCreateMainEffects) return;
  const rev = revelationAdminState();
  const options = Array.isArray(rev.options.sub) ? rev.options.sub : [];

  const oldChecked = new Set(
    Array.from(dom.revAdminCreateMainSubOptions.querySelectorAll('input.rev-admin-create-main-sub-check:checked'))
      .map((input) => String(input.dataset.subId || ''))
      .filter(Boolean)
  );

  dom.revAdminCreateMainSubOptions.innerHTML = options.map((item) => {
    const checked = oldChecked.has(item.id) ? 'checked' : '';
    const label = `${item.names?.kr || item.id} | ${item.names?.en || '-'} | ${item.names?.jp || '-'} | ${item.names?.cn || '-'}`;
    return `<label class="revelation-admin-sub-option"><input class="rev-admin-create-main-sub-check" type="checkbox" data-sub-id="${escapeHtml(item.id)}" ${checked}> <span>${escapeHtml(label)}</span></label>`;
  }).join('');

  const prevValue = {};
  for (const textarea of dom.revAdminCreateMainEffects.querySelectorAll('textarea.rev-admin-create-main-effect-text')) {
    const subId = String(textarea.dataset.subId || '');
    const lang = String(textarea.dataset.lang || '');
    if (!subId || !lang) continue;
    prevValue[`${subId}:${lang}`] = textarea.value || '';
  }

  const selectedIds = Array.from(dom.revAdminCreateMainSubOptions.querySelectorAll('input.rev-admin-create-main-sub-check:checked'))
    .map((input) => String(input.dataset.subId || ''))
    .filter(Boolean);

  const rows = selectedIds.map((subId) => `
      <div class="revelation-admin-main-effect-row">
        <h4>${escapeHtml(revelationNameById(subId, 'kr'))}</h4>
        <div class="revelation-admin-main-effect-grid">
          <div class="field"><label>KR</label><textarea class="rev-admin-create-main-effect-text" data-sub-id="${escapeHtml(subId)}" data-lang="kr" rows="2">${escapeHtml(prevValue[`${subId}:kr`] || '')}</textarea></div>
          <div class="field"><label>EN</label><textarea class="rev-admin-create-main-effect-text" data-sub-id="${escapeHtml(subId)}" data-lang="en" rows="2">${escapeHtml(prevValue[`${subId}:en`] || '')}</textarea></div>
          <div class="field"><label>JP</label><textarea class="rev-admin-create-main-effect-text" data-sub-id="${escapeHtml(subId)}" data-lang="jp" rows="2">${escapeHtml(prevValue[`${subId}:jp`] || '')}</textarea></div>
          <div class="field"><label>CN</label><textarea class="rev-admin-create-main-effect-text" data-sub-id="${escapeHtml(subId)}" data-lang="cn" rows="2">${escapeHtml(prevValue[`${subId}:cn`] || '')}</textarea></div>
        </div>
      </div>
    `);

  dom.revAdminCreateMainEffects.innerHTML = rows.length > 0
    ? rows.join('')
    : '<p class="muted small">Select sub cards to enter main effects.</p>';
}

function resetRevelationAdminCreateForm() {
  if (dom.revAdminCreateKind) dom.revAdminCreateKind.value = 'sub';
  if (dom.revAdminCreateNameKr) dom.revAdminCreateNameKr.value = '';
  if (dom.revAdminCreateNameEn) dom.revAdminCreateNameEn.value = '';
  if (dom.revAdminCreateNameJp) dom.revAdminCreateNameJp.value = '';
  if (dom.revAdminCreateNameCn) dom.revAdminCreateNameCn.value = '';
  if (dom.revAdminCreateTypes) dom.revAdminCreateTypes.value = '';
  if (dom.revAdminCreateUnreleased) dom.revAdminCreateUnreleased.checked = false;
  if (dom.revAdminCreateSubSet2Kr) dom.revAdminCreateSubSet2Kr.value = '';
  if (dom.revAdminCreateSubSet4Kr) dom.revAdminCreateSubSet4Kr.value = '';
  if (dom.revAdminCreateSubSet2En) dom.revAdminCreateSubSet2En.value = '';
  if (dom.revAdminCreateSubSet4En) dom.revAdminCreateSubSet4En.value = '';
  if (dom.revAdminCreateSubSet2Jp) dom.revAdminCreateSubSet2Jp.value = '';
  if (dom.revAdminCreateSubSet4Jp) dom.revAdminCreateSubSet4Jp.value = '';
  if (dom.revAdminCreateSubSet2Cn) dom.revAdminCreateSubSet2Cn.value = '';
  if (dom.revAdminCreateSubSet4Cn) dom.revAdminCreateSubSet4Cn.value = '';
  if (dom.revAdminCreateMainSubOptions) dom.revAdminCreateMainSubOptions.innerHTML = '';
  if (dom.revAdminCreateMainEffects) dom.revAdminCreateMainEffects.innerHTML = '';
}

function renderRevelationAdminCreatePanel() {
  const rev = revelationAdminState();
  if (!dom.revAdminCreate) return;
  dom.revAdminCreate.classList.toggle('hidden', !rev.createOpen);
  if (!rev.createOpen) return;

  const kind = String(dom.revAdminCreateKind?.value || 'sub').trim().toLowerCase();
  const isMain = kind === 'main';
  if (dom.revAdminCreateMainFields) dom.revAdminCreateMainFields.classList.toggle('hidden', !isMain);
  if (dom.revAdminCreateSubFields) dom.revAdminCreateSubFields.classList.toggle('hidden', isMain);
  if (isMain) renderRevelationAdminCreateMainFields();
}

function renderRevelationAdminCreateToggle() {
  if (!dom.btnRevAdminNewToggle) return;
  const rev = revelationAdminState();
  dom.btnRevAdminNewToggle.textContent = rev.createOpen ? 'Close New Card' : 'New Card';
}

function setRevelationAdminCreateOpen(open) {
  const rev = revelationAdminState();
  rev.createOpen = Boolean(open);
  renderRevelationAdminCreateToggle();
  renderRevelationAdminCreatePanel();
}

async function loadRevelationAdminCard(id, { confirmDirty = true } = {}) {
  const rev = revelationAdminState();
  const nextId = String(id || '').trim();
  if (!nextId) return;
  if (confirmDirty && rev.dirty && rev.selectedId && rev.selectedId !== nextId) {
    const ok = window.confirm('Current draft is not saved. Discard changes and move to another card?');
    if (!ok) return;
  }

  const result = await requestJson(`/api/revelation-admin/card?id=${encodeURIComponent(nextId)}`);
  rev.revision = String(result.revision || rev.revision || '');
  rev.options = result.options || { main: [], sub: [] };
  rev.selectedId = nextId;
  rev.detail = cloneData(result.card);
  rev.draft = cloneData(result.card);
  rev.dirty = false;
  renderRevelationAdminDetail();
}

async function loadRevelationAdminBootstrap({ preserveSelection = true } = {}) {
  const rev = revelationAdminState();
  const selected = preserveSelection ? String(rev.selectedId || '').trim() : '';
  const result = await requestJson('/api/revelation-admin/bootstrap');
  rev.revision = String(result.revision || '');
  rev.cards = Array.isArray(result.cards) ? result.cards : [];
  rev.options = result.options || { main: [], sub: [] };

  if (selected && rev.cards.some((card) => String(card.id || '') === selected)) {
    await loadRevelationAdminCard(selected, { confirmDirty: false });
    return;
  }

  rev.selectedId = '';
  rev.detail = null;
  rev.draft = null;
  rev.dirty = false;
  renderRevelationAdminDetail();
  renderRevelationAdminCardList();
}

async function ensureRevelationAdminBootstrapped(force = false) {
  if (state.domain !== 'revelation') return;
  const rev = revelationAdminState();
  if (!force && Array.isArray(rev.cards) && rev.cards.length > 0) {
    renderRevelationAdminCardList();
    renderRevelationAdminDetail();
    return;
  }
  try {
    await loadRevelationAdminBootstrap({ preserveSelection: true });
  } catch (error) {
    appendLog(`[revelation] admin bootstrap failed: ${error.message}`);
  }
}

async function saveRevelationAdminCard() {
  const rev = revelationAdminState();
  if (state.domain !== 'revelation') return;
  if (!rev.selectedId || !rev.draft) {
    appendLog('[revelation] select a card before saving.');
    return;
  }
  const result = await requestJson('/api/revelation-admin/save-card', {
    method: 'POST',
    body: {
      id: rev.selectedId,
      revision: rev.revision,
      draft: rev.draft
    }
  });
  rev.revision = String(result.revision || rev.revision || '');
  rev.cards = Array.isArray(result.cards) ? result.cards : rev.cards;
  rev.options = result.options || rev.options;
  rev.selectedId = String(result.card?.id || rev.selectedId);
  rev.detail = cloneData(result.card);
  rev.draft = cloneData(result.card);
  rev.dirty = false;
  renderRevelationAdminDetail();
  renderRevelationAdminCardList();
  appendLog(`[revelation] card saved: ${rev.selectedId}`);
}

function resetRevelationAdminDraft() {
  const rev = revelationAdminState();
  if (!rev.detail) return;
  rev.draft = cloneData(rev.detail);
  rev.dirty = false;
  renderRevelationAdminDetail();
}

async function renameRevelationAdminKr() {
  const rev = revelationAdminState();
  if (!rev.selectedId || !rev.detail) return;
  const parsed = revelationParseCardId(rev.selectedId);
  const nextKr = window.prompt('New KR key', parsed.kr || '');
  if (nextKr == null) return;
  const trimmed = String(nextKr || '').trim();
  if (!trimmed || trimmed === parsed.kr) return;

  const result = await requestJson('/api/revelation-admin/rename-kr', {
    method: 'POST',
    body: {
      id: rev.selectedId,
      revision: rev.revision,
      nextKr: trimmed
    }
  });
  rev.revision = String(result.revision || rev.revision || '');
  rev.cards = Array.isArray(result.cards) ? result.cards : rev.cards;
  rev.options = result.options || rev.options;
  rev.selectedId = String(result.newId || result.card?.id || rev.selectedId);
  rev.detail = cloneData(result.card);
  rev.draft = cloneData(result.card);
  rev.dirty = false;
  renderRevelationAdminDetail();
  renderRevelationAdminCardList();
  appendLog(`[revelation] KR renamed: ${parsed.kr} -> ${trimmed}`);
}

function collectCreateMainPayload() {
  const subIds = Array.from(dom.revAdminCreateMainSubOptions?.querySelectorAll('input.rev-admin-create-main-sub-check:checked') || [])
    .map((input) => String(input.dataset.subId || ''))
    .filter(Boolean);
  const bySubId = {};
  for (const textarea of dom.revAdminCreateMainEffects?.querySelectorAll('textarea.rev-admin-create-main-effect-text') || []) {
    const subId = String(textarea.dataset.subId || '');
    const lang = String(textarea.dataset.lang || '');
    if (!subId || !lang) continue;
    if (!bySubId[subId]) bySubId[subId] = { kr: '', en: '', jp: '', cn: '' };
    bySubId[subId][lang] = String(textarea.value || '').trim();
  }
  return { subIds, bySubId };
}

function collectCreateSubPayload() {
  return {
    set2: {
      kr: String(dom.revAdminCreateSubSet2Kr?.value || '').trim(),
      en: String(dom.revAdminCreateSubSet2En?.value || '').trim(),
      jp: String(dom.revAdminCreateSubSet2Jp?.value || '').trim(),
      cn: String(dom.revAdminCreateSubSet2Cn?.value || '').trim()
    },
    set4: {
      kr: String(dom.revAdminCreateSubSet4Kr?.value || '').trim(),
      en: String(dom.revAdminCreateSubSet4En?.value || '').trim(),
      jp: String(dom.revAdminCreateSubSet4Jp?.value || '').trim(),
      cn: String(dom.revAdminCreateSubSet4Cn?.value || '').trim()
    }
  };
}

async function createRevelationAdminCard() {
  const rev = revelationAdminState();
  const kind = String(dom.revAdminCreateKind?.value || '').trim().toLowerCase();
  const names = {
    kr: String(dom.revAdminCreateNameKr?.value || '').trim(),
    en: String(dom.revAdminCreateNameEn?.value || '').trim(),
    jp: String(dom.revAdminCreateNameJp?.value || '').trim(),
    cn: String(dom.revAdminCreateNameCn?.value || '').trim()
  };
  if (!kind || !names.kr || !names.en || !names.jp || !names.cn) {
    appendLog('[revelation] create failed: kind and all localized names are required.');
    return;
  }

  const payload = {
    revision: rev.revision,
    kind,
    names,
    types: parseCsv(String(dom.revAdminCreateTypes?.value || '')),
    unreleased: Boolean(dom.revAdminCreateUnreleased?.checked),
    payload: {}
  };

  if (kind === 'main') {
    payload.payload.main = collectCreateMainPayload();
  } else {
    payload.payload.sub = collectCreateSubPayload();
  }

  const result = await requestJson('/api/revelation-admin/create-card', {
    method: 'POST',
    body: payload
  });

  rev.revision = String(result.revision || rev.revision || '');
  rev.cards = Array.isArray(result.cards) ? result.cards : rev.cards;
  rev.options = result.options || rev.options;
  rev.selectedId = String(result.id || result.card?.id || '');
  rev.detail = cloneData(result.card);
  rev.draft = cloneData(result.card);
  rev.dirty = false;
  setRevelationAdminCreateOpen(false);
  resetRevelationAdminCreateForm();
  renderRevelationAdminDetail();
  renderRevelationAdminCardList();
  appendLog(`[revelation] card created: ${rev.selectedId}`);
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
    setRevelationAdminCreateOpen(false);
    clearIgnoredFilterInputs();
    resetSelectedParts(state.domain);
    setLangInputForDomain(state.domain);
    state.dataDomain = state.domain;
    state.dataRoot = '';

    if (state.domain === 'revelation') {
      setActiveView('revelation-admin');
    } else if (state.activeView === 'revelation-admin') {
      setActiveView('work');
    }
    if (state.domain !== 'revelation') clearRevelationAdminState();

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

    if (state.domain === 'revelation') {
      await ensureRevelationAdminBootstrapped(true);
      resetRevelationAdminCreateForm();
      renderRevelationAdminCreatePanel();
    }

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
        if (nextView === 'revelation-admin' && state.domain !== 'revelation') {
          appendLog('[revelation] Revelation Admin view is only available in revelation domain.');
          return;
        }
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

  dom.revAdminSearch?.addEventListener('input', () => {
    renderRevelationAdminCardList();
  });

  dom.revAdminKindFilter?.addEventListener('change', () => {
    renderRevelationAdminCardList();
  });

  dom.revAdminUnreleasedFilter?.addEventListener('change', () => {
    renderRevelationAdminCardList();
  });

  dom.btnRevAdminRefresh?.addEventListener('click', async () => {
    if (state.domain !== 'revelation') return;
    try {
      setPending(dom.btnRevAdminRefresh, true);
      await loadRevelationAdminBootstrap({ preserveSelection: true });
      appendLog('[revelation] admin cards refreshed.');
    } catch (error) {
      appendLog(`[revelation] admin refresh failed: ${error.message}`);
    } finally {
      setPending(dom.btnRevAdminRefresh, false);
    }
  });

  dom.btnRevAdminNewToggle?.addEventListener('click', () => {
    if (state.domain !== 'revelation') return;
    const rev = revelationAdminState();
    const nextOpen = !rev.createOpen;
    if (nextOpen) resetRevelationAdminCreateForm();
    setRevelationAdminCreateOpen(nextOpen);
  });

  dom.revAdminCardList?.addEventListener('click', async (event) => {
    const item = closestFromTarget(event.target, '.revelation-admin-card-item');
    if (!item) return;
    const id = String(item.dataset.cardId || '').trim();
    if (!id) return;
    await handleRevelationAdminAction(async () => {
      await loadRevelationAdminCard(id);
    }, `card load (${id})`);
  });

  const revealNameInputs = [
    ['en', dom.revAdminNameEn],
    ['jp', dom.revAdminNameJp],
    ['cn', dom.revAdminNameCn]
  ];
  for (const [lang, input] of revealNameInputs) {
    input?.addEventListener('input', () => {
      applyRevelationAdminDraftMutation((draft) => {
        if (!draft.names || typeof draft.names !== 'object') draft.names = { kr: '', en: '', jp: '', cn: '' };
        draft.names[lang] = String(input.value || '');
      }, { refreshList: true });
    });
  }

  dom.revAdminTypes?.addEventListener('input', () => {
    applyRevelationAdminDraftMutation((draft) => {
      draft.types = parseCsv(dom.revAdminTypes?.value || '');
    }, { refreshList: true });
  });

  dom.revAdminUnreleased?.addEventListener('change', () => {
    applyRevelationAdminDraftMutation((draft) => {
      draft.unreleased = Boolean(dom.revAdminUnreleased?.checked);
    }, { refreshList: true });
  });

  dom.revAdminSubSet2Kr?.addEventListener('input', () => {
    applyRevelationAdminDraftMutation((draft) => {
      if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
      if (!draft.effects.set2 || typeof draft.effects.set2 !== 'object') draft.effects.set2 = { kr: '', en: '', jp: '', cn: '' };
      draft.effects.set2.kr = String(dom.revAdminSubSet2Kr?.value || '');
    });
  });
  dom.revAdminSubSet4Kr?.addEventListener('input', () => {
    applyRevelationAdminDraftMutation((draft) => {
      if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
      if (!draft.effects.set4 || typeof draft.effects.set4 !== 'object') draft.effects.set4 = { kr: '', en: '', jp: '', cn: '' };
      draft.effects.set4.kr = String(dom.revAdminSubSet4Kr?.value || '');
    });
  });
  dom.revAdminSubSet2En?.addEventListener('input', () => {
    applyRevelationAdminDraftMutation((draft) => {
      if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
      if (!draft.effects.set2 || typeof draft.effects.set2 !== 'object') draft.effects.set2 = { kr: '', en: '', jp: '', cn: '' };
      draft.effects.set2.en = String(dom.revAdminSubSet2En?.value || '');
    });
  });
  dom.revAdminSubSet4En?.addEventListener('input', () => {
    applyRevelationAdminDraftMutation((draft) => {
      if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
      if (!draft.effects.set4 || typeof draft.effects.set4 !== 'object') draft.effects.set4 = { kr: '', en: '', jp: '', cn: '' };
      draft.effects.set4.en = String(dom.revAdminSubSet4En?.value || '');
    });
  });
  dom.revAdminSubSet2Jp?.addEventListener('input', () => {
    applyRevelationAdminDraftMutation((draft) => {
      if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
      if (!draft.effects.set2 || typeof draft.effects.set2 !== 'object') draft.effects.set2 = { kr: '', en: '', jp: '', cn: '' };
      draft.effects.set2.jp = String(dom.revAdminSubSet2Jp?.value || '');
    });
  });
  dom.revAdminSubSet4Jp?.addEventListener('input', () => {
    applyRevelationAdminDraftMutation((draft) => {
      if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
      if (!draft.effects.set4 || typeof draft.effects.set4 !== 'object') draft.effects.set4 = { kr: '', en: '', jp: '', cn: '' };
      draft.effects.set4.jp = String(dom.revAdminSubSet4Jp?.value || '');
    });
  });
  dom.revAdminSubSet2Cn?.addEventListener('input', () => {
    applyRevelationAdminDraftMutation((draft) => {
      if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
      if (!draft.effects.set2 || typeof draft.effects.set2 !== 'object') draft.effects.set2 = { kr: '', en: '', jp: '', cn: '' };
      draft.effects.set2.cn = String(dom.revAdminSubSet2Cn?.value || '');
    });
  });
  dom.revAdminSubSet4Cn?.addEventListener('input', () => {
    applyRevelationAdminDraftMutation((draft) => {
      if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
      if (!draft.effects.set4 || typeof draft.effects.set4 !== 'object') draft.effects.set4 = { kr: '', en: '', jp: '', cn: '' };
      draft.effects.set4.cn = String(dom.revAdminSubSet4Cn?.value || '');
    });
  });

  dom.revAdminMainSubOptions?.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains('rev-admin-main-sub-check')) return;
    applyRevelationAdminDraftMutation((draft) => {
      const selectedSet = new Set(
        Array.from(dom.revAdminMainSubOptions?.querySelectorAll('input.rev-admin-main-sub-check:checked') || [])
          .map((input) => String(input.dataset.subId || ''))
          .filter(Boolean)
      );
      const order = (revelationAdminState().options.sub || [])
        .map((item) => String(item.id || ''))
        .filter(Boolean);
      draft.relations.subIds = order.filter((id) => selectedSet.has(id));

      if (!draft.effects || typeof draft.effects !== 'object') draft.effects = {};
      if (!draft.effects.bySubId || typeof draft.effects.bySubId !== 'object') draft.effects.bySubId = {};
      const nextBySub = {};
      for (const subId of draft.relations.subIds) {
        nextBySub[subId] = ensureMainEffectEntry(draft, subId);
      }
      draft.effects.bySubId = nextBySub;
    }, { refreshDetail: true, refreshList: true });
  });

  dom.revAdminMainEffects?.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    if (!target.classList.contains('rev-admin-main-effect-text')) return;
    const subId = String(target.dataset.subId || '').trim();
    const lang = String(target.dataset.lang || '').trim();
    if (!subId || !lang) return;
    applyRevelationAdminDraftMutation((draft) => {
      const entry = ensureMainEffectEntry(draft, subId);
      entry[lang] = String(target.value || '');
    });
  });

  dom.btnRevAdminRenameKr?.addEventListener('click', async () => {
    try {
      setPending(dom.btnRevAdminRenameKr, true);
      await handleRevelationAdminAction(async () => {
        await renameRevelationAdminKr();
      }, 'KR rename');
    } finally {
      setPending(dom.btnRevAdminRenameKr, false);
    }
  });

  dom.btnRevAdminSave?.addEventListener('click', async () => {
    try {
      setPending(dom.btnRevAdminSave, true);
      await handleRevelationAdminAction(async () => {
        await saveRevelationAdminCard();
      }, 'save');
    } finally {
      setPending(dom.btnRevAdminSave, false);
    }
  });

  dom.btnRevAdminReset?.addEventListener('click', () => {
    const rev = revelationAdminState();
    if (!rev.dirty) return;
    const ok = window.confirm('Discard unsaved draft changes?');
    if (!ok) return;
    resetRevelationAdminDraft();
  });

  dom.revAdminCreateKind?.addEventListener('change', () => {
    renderRevelationAdminCreatePanel();
  });

  dom.revAdminCreateMainSubOptions?.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains('rev-admin-create-main-sub-check')) return;
    renderRevelationAdminCreateMainFields();
  });

  dom.btnRevAdminCreateSubmit?.addEventListener('click', async () => {
    try {
      setPending(dom.btnRevAdminCreateSubmit, true);
      await handleRevelationAdminAction(async () => {
        await createRevelationAdminCard();
      }, 'create');
    } finally {
      setPending(dom.btnRevAdminCreateSubmit, false);
    }
  });

  dom.btnRevAdminCreateCancel?.addEventListener('click', () => {
    setRevelationAdminCreateOpen(false);
    resetRevelationAdminCreateForm();
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

  dom.btnAddRevelation?.addEventListener('click', async () => {
    try {
      setPending(dom.btnAddRevelation, true);
      await addRevelation();
    } catch (error) {
      appendLog(`신규 계시 생성 실패: ${error.message}`);
    } finally {
      setPending(dom.btnAddRevelation, false);
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
  renderActiveView();
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
