#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import process from 'process';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import {
  loadRevelationAdminBootstrap,
  loadRevelationAdminCard,
  saveRevelationAdminCard,
  createRevelationAdminCard,
  renameRevelationAdminKr
} from './lib/revelation-admin-store.mjs';
import {
  SEO_REQUIRED_LANGS,
  SEO_OPTIONAL_LANGS,
  SEO_PHASE1_DOMAINS,
  normalizeNewline,
  stripBom,
  containsBom,
  serializeJson,
  loadSeoAvailability,
  listSeoDomains,
  buildSeoDomainState,
  resolveSeoMetaPath,
  matrixRowsToMeta,
  normalizeAvailabilityFromRows,
  validateSeoRows,
  getSeoCheckScript,
  buildSeoEtag
} from './seo-console-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..', '..');
const APP_ROOT = path.join(PROJECT_ROOT, 'apps', 'patch-console');
const APP_STATE_ROOT = path.join(APP_ROOT, 'state');
const APP_REPORT_DIR = path.join(APP_STATE_ROOT, 'reports');
const DEFAULT_REPORT_REL = path.join('apps', 'patch-console', 'state', 'reports', 'patch-console-report.md');
const IGNORED_DIFFS_FILE = path.join(APP_STATE_ROOT, 'patch-console-ignored-diffs.json');
const ALLOW_REMOTE_ACCESS = String(process.env.PATCH_CONSOLE_ALLOW_REMOTE || '0') === '1';
const REMOTE_ACCESS_TOKEN = String(process.env.PATCH_CONSOLE_ACCESS_TOKEN || '').trim();
const REQUIRE_REMOTE_TOKEN = ALLOW_REMOTE_ACCESS && REMOTE_ACCESS_TOKEN.length > 0;
const CODENAME_FILE = path.join(PROJECT_ROOT, 'data', 'external', 'character', 'codename.json');
const TEMPLATE_ROOT = path.join(PROJECT_ROOT, 'data', 'characters', 'template');
const CHARACTER_ROOT = path.join(PROJECT_ROOT, 'data', 'characters');
const TIER_ICON_DIR = path.join(PROJECT_ROOT, 'assets', 'img', 'tier');
const PERSONA_ICON_DIR = path.join(PROJECT_ROOT, 'assets', 'img', 'persona');
const WONDER_WEAPON_ICON_DIR = path.join(PROJECT_ROOT, 'assets', 'img', 'wonder-weapon');
const REVELATION_ICON_DIR = path.join(PROJECT_ROOT, 'assets', 'img', 'revelation');
const ICON_EXTS = ['.webp', '.png', '.jpg', '.jpeg', '.svg'];
const DATA_TEXT_EXTS = ['.js', '.json', '.md', '.txt', '.csv', '.yml', '.yaml', '.html', '.css', '.ts'];
const DATA_FILE_MAX_BYTES = 2 * 1024 * 1024;
const SEO_AVAILABILITY_FILE = path.join(PROJECT_ROOT, 'data', 'seo', 'availability.json');
const SEO_REGISTRY_FILE = path.join(PROJECT_ROOT, 'data', 'seo', 'registry.json');
const SEO_HISTORY_FILE = path.join(APP_STATE_ROOT, 'seo-history.json');
const SEO_HISTORY_MAX_ITEMS = 300;

const DOMAIN_CAPABILITIES = [
  {
    id: 'character',
    label: 'Character',
    enabled: true,
    features: ['list', 'report', 'patch', 'create'],
    parts: ['ritual', 'skill', 'weapon', 'base_stats']
  },
  {
    id: 'persona',
    label: 'Persona',
    enabled: true,
    features: ['list', 'report', 'patch'],
    parts: ['profile', 'innate_skill', 'passive_skill', 'uniqueSkill', 'highlight']
  },
  {
    id: 'wonder_weapon',
    label: 'Wonder Weapon',
    enabled: true,
    features: ['list', 'report', 'patch'],
    parts: ['name', 'effect']
  },
  {
    id: 'revelation',
    label: 'Revelation',
    enabled: true,
    features: ['list', 'report', 'patch', 'create'],
    parts: ['name', 'relation', 'effect', 'unreleased']
  }
];
const DEFAULT_DOMAIN = 'character';
const DOMAIN_PATCH_SCRIPT = {
  character: path.join('apps', 'patch-console', 'patch-characters.mjs'),
  persona: path.join('apps', 'patch-console', 'patch-persona.mjs'),
  wonder_weapon: path.join('apps', 'patch-console', 'patch-wonder-weapon.mjs'),
  revelation: path.join('apps', 'patch-console', 'patch-revelation.mjs')
};
const DOMAIN_DATA_EDITOR_ROOTS = {
  character: [
    {
      id: 'characters',
      label: 'data/characters',
      path: path.join(PROJECT_ROOT, 'data', 'characters')
    },
    {
      id: 'character_external',
      label: 'data/external/character',
      path: path.join(PROJECT_ROOT, 'data', 'external', 'character')
    }
  ],
  persona: [
    {
      id: 'persona',
      label: 'data/persona',
      path: path.join(PROJECT_ROOT, 'data', 'persona')
    },
    {
      id: 'persona_external',
      label: 'data/external/persona',
      path: path.join(PROJECT_ROOT, 'data', 'external', 'persona')
    }
  ],
  wonder_weapon: [
    {
      id: 'wonder_internal',
      label: 'data/kr/wonder',
      path: path.join(PROJECT_ROOT, 'data', 'kr', 'wonder')
    },
    {
      id: 'wonder_external',
      label: 'data/external/weapon',
      path: path.join(PROJECT_ROOT, 'data', 'external', 'weapon')
    }
  ],
  revelation: [
    {
      id: 'revelation_kr',
      label: 'data/kr/revelations',
      path: path.join(PROJECT_ROOT, 'data', 'kr', 'revelations')
    },
    {
      id: 'revelation_en',
      label: 'data/en/revelations',
      path: path.join(PROJECT_ROOT, 'data', 'en', 'revelations')
    },
    {
      id: 'revelation_jp',
      label: 'data/jp/revelations',
      path: path.join(PROJECT_ROOT, 'data', 'jp', 'revelations')
    },
    {
      id: 'revelation_cn',
      label: 'data/cn/revelations',
      path: path.join(PROJECT_ROOT, 'data', 'cn', 'revelations')
    }
  ]
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

let tierIconIndexCache = null;
let personaIconIndexCache = null;
let wonderWeaponIconIndexCache = null;
let revelationIconIndexCache = null;
const seoCiJobs = new Map();

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj || {}, key);
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function stableObject(value) {
  if (Array.isArray(value)) return value.map((x) => stableObject(x));
  if (isPlainObject(value)) {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = stableObject(value[key]);
    }
    return out;
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(stableObject(value));
}

function shortHash(text) {
  return crypto.createHash('sha1').update(String(text || '')).digest('hex').slice(0, 12);
}

function valueSignature(value) {
  const normalized = value === undefined ? null : value;
  return shortHash(stableStringify(normalized));
}

function normalizeDomain(raw) {
  const value = String(raw || DEFAULT_DOMAIN).trim().toLowerCase();
  if (!value) return DEFAULT_DOMAIN;
  return value;
}

function defaultLangCsvForDomain(domain) {
  const d = normalizeDomain(domain);
  if (d === 'persona' || d === 'wonder_weapon' || d === 'revelation') return 'kr,en,jp,cn';
  return 'kr,en,jp';
}

function makeDiffKey(domain, diff, options = {}) {
  const legacy = Boolean(options.legacy);
  const d = normalizeDomain(domain);
  const index = Number(diff?.index);
  const lang = String(diff?.lang || '').trim().toLowerCase();
  const part = String(diff?.part || '').trim();
  const pathText = String(diff?.path || '').trim();
  const base = `${d}|${index}|${lang}|${part}|${pathText}`;
  if (legacy) return base;

  const hasBefore = hasOwn(diff, 'before');
  const hasAfter = hasOwn(diff, 'after');
  if (!hasBefore && !hasAfter) return base;
  const beforeSig = valueSignature(diff.before);
  const afterSig = valueSignature(diff.after);
  return `${base}|b:${beforeSig}|a:${afterSig}`;
}

function normalizeDataQueryValue(value) {
  return String(value || '').trim();
}

function normalizeIgnoredShow(value) {
  const normalized = String(value || 'active').trim().toLowerCase();
  if (normalized === 'hidden' || normalized === 'all') return normalized;
  return 'active';
}

function extractClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  if (forwarded) return forwarded.replace(/\[|\]/g, '');
  const realIp = String(req.headers['x-real-ip'] || '').trim();
  if (realIp) return realIp.replace(/\[|\]/g, '');
  return String(req.socket?.remoteAddress || '').trim();
}

function extractAccessToken(req) {
  const auth = String(req.headers.authorization || '').trim();
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  return String(req.headers['x-patch-console-token'] || '').trim();
}

function isLoopbackIp(ip) {
  const normalized = String(ip || '').toLowerCase().trim();
  if (!normalized) return false;
  if (normalized === '127.0.0.1' || normalized === '::1' || normalized === '::ffff:127.0.0.1') return true;
  if (normalized.startsWith('127.') || normalized.startsWith('::ffff:127.')) return true;
  return false;
}

function isAuthorizedRemoteRequest(req) {
  if (!REQUIRE_REMOTE_TOKEN) return false;
  const token = extractAccessToken(req);
  return token === REMOTE_ACCESS_TOKEN;
}

function parseInteger(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  if (!text) return null;
  const n = Number(text);
  return Number.isInteger(n) ? n : null;
}

function parseIgnoredFilter(params) {
  const q = normalizeDataQueryValue(params?.q).toLowerCase();
  return {
    q,
    index: parseInteger(normalizeDataQueryValue(params?.index)),
    lang: normalizeDataQueryValue(params?.lang).toLowerCase(),
    api: normalizeDataQueryValue(params?.api).toLowerCase(),
    local: normalizeDataQueryValue(params?.local).toLowerCase(),
    key: normalizeDataQueryValue(params?.key).toLowerCase(),
    part: normalizeDataQueryValue(params?.part).toLowerCase(),
    path: normalizeDataQueryValue(params?.path).toLowerCase(),
    characterKey: normalizeDataQueryValue(params?.characterKey).toLowerCase(),
    note: normalizeDataQueryValue(params?.note).toLowerCase(),
    createdFrom: normalizeDataQueryValue(params?.createdFrom).toLowerCase(),
    createdTo: normalizeDataQueryValue(params?.createdTo).toLowerCase(),
    show: normalizeIgnoredShow(params?.show),
    sort: normalizeDataQueryValue(params?.sort).toLowerCase() || 'created_desc'
  };
}

function matchIgnoredItemFilter(item, filter) {
  if (!item || typeof item !== 'object') return false;
  const createdAt = new Date(String(item.createdAt || '').trim());
  const fields = [
    ['index', Number(item.index), filter.index, (a, b) => a === b],
    ['lang', String(item.lang || '').toLowerCase(), filter.lang],
    ['api', String(item.api || '').toLowerCase(), filter.api],
    ['local', String(item.local || '').toLowerCase(), filter.local],
    ['key', String(item.key || '').toLowerCase(), filter.key],
    ['part', String(item.part || '').toLowerCase(), filter.part],
    ['path', String(item.path || '').toLowerCase(), filter.path],
    ['characterKey', String(item.characterKey || '').toLowerCase(), filter.characterKey],
    ['note', String(item.note || '').toLowerCase(), filter.note]
  ];

  if (filter.createdFrom) {
    const fromDate = new Date(filter.createdFrom);
    if (!Number.isNaN(fromDate.getTime()) && createdAt.getTime() < fromDate.getTime()) return false;
  }

  if (filter.createdTo) {
    const toDate = new Date(filter.createdTo);
    if (!Number.isNaN(toDate.getTime())) {
      const end = new Date(toDate.getTime());
      end.setHours(23, 59, 59, 999);
      if (createdAt.getTime() > end.getTime()) return false;
    }
  }

  for (const [name, actual, expected, comparer] of fields) {
    if (name === 'index') {
      if (expected != null && !comparer(actual, expected)) return false;
      continue;
    }
    if (expected && actual !== expected) return false;
  }

  if (filter.q) {
    const haystack = `${item.index} ${item.lang} ${item.api} ${item.local} ${item.key} ${item.part} ${item.path} ${item.characterKey} ${item.note || ''} ${item.matcher || ''}`
      .toLowerCase();
    if (!haystack.includes(filter.q)) return false;
  }

  return true;
}

function loadIgnoredStore() {
  let shouldSave = false;
  if (!fs.existsSync(IGNORED_DIFFS_FILE)) {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      items: []
    };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(IGNORED_DIFFS_FILE, 'utf8'));
    if (!parsed || typeof parsed !== 'object') {
      return { version: 1, updatedAt: new Date().toISOString(), items: [] };
    }
    if (!Array.isArray(parsed.items)) {
      parsed.items = [];
      shouldSave = true;
    }
    for (const item of parsed.items) {
      if (!item || typeof item !== 'object') continue;
      if (!Object.prototype.hasOwnProperty.call(item, 'isHidden')) {
        item.isHidden = false;
        shouldSave = true;
      }
    }
    if (shouldSave) {
      saveIgnoredStore(parsed);
    }
    return parsed;
  } catch {
    return { version: 1, updatedAt: new Date().toISOString(), items: [] };
  }
}

function saveIgnoredStore(store) {
  ensureDir(path.dirname(IGNORED_DIFFS_FILE));
  const payload = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: Array.isArray(store?.items) ? store.items : []
  };
  fs.writeFileSync(IGNORED_DIFFS_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function isIgnoredByStoreItem(domain, row, partName, entry) {
  const target = {
    index: Number(row.index),
    lang: String(row.lang || '').trim().toLowerCase(),
    part: String(partName || '').trim(),
    path: String(entry.path || '').trim()
  };
  const valueSigBefore = valueSignature(entry.before);
  const valueSigAfter = valueSignature(entry.after);
  const ignored = listIgnoredByDomain(domain);

  for (const item of ignored) {
    if (Number(item.index) !== target.index) continue;
    if (String(item.lang || '').trim().toLowerCase() !== target.lang) continue;
    if (String(item.part || '').trim() !== target.part) continue;
    if (String(item.path || '').trim() !== target.path) continue;

    if (item.matcher === 'value') {
      if (item.beforeSig || item.afterSig) {
        return item.beforeSig === valueSigBefore && item.afterSig === valueSigAfter;
      }
      return true;
    }

    return true;
  }

  return false;
}

function listIgnoredByDomain(domain, filter = null) {
  const d = normalizeDomain(domain);
  const store = loadIgnoredStore();
  const parsedFilter = parseIgnoredFilter(filter || {});
  const filtered = store.items
    .filter((item) => normalizeDomain(item.domain) === d)
    .filter((item) => matchIgnoredItemFilter(item, parsedFilter));
  const showMode = parsedFilter.show || 'active';
  const visibleItems = filtered.filter((item) => {
    const hidden = Boolean(item.isHidden);
    if (showMode === 'all') return true;
    if (showMode === 'hidden') return hidden;
    return !hidden;
  });
  const sortMode = String(parsedFilter.sort || 'created_desc').toLowerCase();
  let compare = (a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  if (sortMode === 'created_asc') {
    compare = (a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || ''));
  } else if (sortMode === 'index_asc') {
    compare = (a, b) => Number(a.index || 0) - Number(b.index || 0);
  } else if (sortMode === 'index_desc') {
    compare = (a, b) => Number(b.index || 0) - Number(a.index || 0);
  }
  return visibleItems.sort((a, b) => {
    const c = compare(a, b);
    if (c !== 0) return c;
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}

function addIgnoredDiffs(domain, diffs) {
  return addIgnoredDiffsWithOptions(domain, diffs, { overwrite: false });
}

function addIgnoredDiffsWithOptions(domain, diffs, options = {}) {
  const d = normalizeDomain(domain);
  const store = loadIgnoredStore();
  const overwrite = Boolean(options.overwrite);
  const map = new Map();
  for (const item of store.items) {
    map.set(String(item.key), item);
  }
  let added = 0;
  let updated = 0;
  for (const diff of diffs) {
    const hasBefore = hasOwn(diff, 'before');
    const hasAfter = hasOwn(diff, 'after');
    const matcher = hasBefore || hasAfter ? 'value' : 'path';
    const key = matcher === 'value'
      ? makeDiffKey(d, diff)
      : makeDiffKey(d, diff, { legacy: true });
    if (map.has(key)) {
      if (!overwrite) continue;
      const before = map.get(key) || {};
      const nextItem = {
        ...before,
        key,
        domain: d,
        index: Number(diff.index),
        lang: String(diff.lang || '').trim().toLowerCase(),
        api: String(diff.api || ''),
        local: String(diff.local || ''),
        characterKey: String(diff.key || ''),
        part: String(diff.part || ''),
        path: String(diff.path || ''),
        isHidden: false,
        note: String(diff.note || '').trim() || null,
        matcher,
        beforeSig: matcher === 'value' ? valueSignature(diff.before) : null,
        afterSig: matcher === 'value' ? valueSignature(diff.after) : null,
        createdAt: new Date().toISOString()
      };
      map.set(key, nextItem);
      updated += 1;
      continue;
    }
    const nextItem = {
      key,
      domain: d,
      index: Number(diff.index),
      lang: String(diff.lang || '').trim().toLowerCase(),
      api: String(diff.api || ''),
      local: String(diff.local || ''),
      characterKey: String(diff.key || ''),
      part: String(diff.part || ''),
      path: String(diff.path || ''),
      isHidden: false,
      note: String(diff.note || '').trim() || null,
      matcher,
      beforeSig: matcher === 'value' ? valueSignature(diff.before) : null,
      afterSig: matcher === 'value' ? valueSignature(diff.after) : null,
      createdAt: new Date().toISOString()
    };
    map.set(key, nextItem);
    added += 1;
  }
  store.items = [...map.values()];
  saveIgnoredStore(store);
  return { added, updated };
}

function removeIgnoredDiffs(domain, keys) {
  const d = normalizeDomain(domain);
  const store = loadIgnoredStore();
  const keySet = new Set(
    (Array.isArray(keys) ? keys : [])
      .map((key) => String(key || '').trim())
      .filter(Boolean)
  );
  const before = store.items.length;
  store.items = store.items.filter((item) => {
    if (normalizeDomain(item.domain) !== d) return true;
    if (keySet.has(String(item.key))) return false;
    return true;
  });
  saveIgnoredStore(store);
  return before - store.items.length;
}

function normalizeIgnoredUpdatePayload(payload = {}) {
  const hasIsHidden = Object.prototype.hasOwnProperty.call(payload, 'isHidden');
  const hasNote = Object.prototype.hasOwnProperty.call(payload, 'note');
  let isHidden = false;
  if (hasIsHidden) isHidden = Boolean(payload.isHidden);
  const note = hasNote ? String(payload.note || '').trim() : null;
  return {
    keys: Array.isArray(payload.keys) ? payload.keys.map((key) => String(key || '').trim()).filter(Boolean) : [],
    hasNote,
    note,
    hasIsHidden,
    isHidden
  };
}

function updateIgnoredDiffs(domain, payload = {}) {
  const d = normalizeDomain(domain);
  const { keys, hasNote, note, hasIsHidden, isHidden } = normalizeIgnoredUpdatePayload(payload);
  const normalizedKeys = [...keys];
  if (normalizedKeys.length === 0 && Array.isArray(payload.diffs)) {
    for (const diff of payload.diffs) {
      const hasBefore = hasOwn(diff, 'before');
      const hasAfter = hasOwn(diff, 'after');
      const matcher = hasBefore || hasAfter ? 'value' : 'path';
      const key = matcher === 'value'
        ? makeDiffKey(d, diff)
        : makeDiffKey(d, diff, { legacy: true });
      if (key) normalizedKeys.push(key);
    }
  }
  const keySet = new Set(Array.from(new Set(normalizedKeys)).map((key) => String(key || '').trim()).filter(Boolean));
  if (keySet.size === 0 || (!hasNote && !hasIsHidden)) {
    return { updated: 0, notFound: 0 };
  }

  const store = loadIgnoredStore();
  const updated = new Set();
  const keyList = [...keySet];
  for (const item of store.items) {
    if (normalizeDomain(item.domain) !== d) continue;
    if (!keyList.includes(String(item.key))) continue;
    if (hasIsHidden) item.isHidden = isHidden;
    if (hasNote) item.note = note || null;
    item.updatedAt = new Date().toISOString();
    updated.add(item.key);
  }

  if (updated.size > 0) {
    saveIgnoredStore(store);
  }

  return { updated: updated.size, notFound: keyList.length - updated.size };
}

function getDataEditorRoots(domain) {
  const d = normalizeDomain(domain);
  return Array.isArray(DOMAIN_DATA_EDITOR_ROOTS[d]) ? DOMAIN_DATA_EDITOR_ROOTS[d] : [];
}

function getDataRootById(domain, rootId) {
  const roots = getDataEditorRoots(domain);
  if (!Array.isArray(roots) || roots.length === 0) return null;
  return roots.find((item) => item.id === rootId) || roots[0];
}

function collectDataFiles(rootPath, query = '') {
  const rootNormalized = path.resolve(rootPath);
  if (!fs.existsSync(rootNormalized) || !fs.statSync(rootNormalized).isDirectory()) return [];
  const q = String(query || '').toLowerCase();
  const out = [];
  const skipDirs = new Set(['node_modules', '.git', '.turbo', '.next', '_site', '.cache']);

  const visit = (dir, relPrefix) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const name = entry.name;
      if (name.startsWith('.')) continue;
      if (skipDirs.has(name)) continue;
      const nextRel = relPrefix ? `${relPrefix}/${name}` : name;
      const abs = path.join(dir, name);
      if (entry.isDirectory()) {
        visit(abs, nextRel);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(name).toLowerCase();
      if (!DATA_TEXT_EXTS.includes(ext)) continue;
      if (!q || nextRel.toLowerCase().includes(q)) {
        out.push(nextRel.replace(/\\/g, '/'));
      }
    }
  };

  visit(rootNormalized, '');
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

function resolveDataFilePath(domain, rootId, relPath) {
  const root = getDataRootById(domain, rootId);
  if (!root) return null;
  const input = String(relPath || '').trim();
  if (!input) return null;
  const segments = input
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== '.');
  if (segments.includes('..')) return null;
  if (segments.length === 0) return null;
  const normalizedRelative = segments.join(path.sep).replace(/\\/g, '/');

  const rootAbs = path.resolve(root.path);
  const candidate = path.resolve(rootAbs, normalizedRelative);
  const candidatePrefix = `${rootAbs}${path.sep}`;
  if (candidate !== rootAbs && !candidate.startsWith(candidatePrefix)) return null;
  return {
    rootId: root.id,
    rootPath: root.path,
    rootLabel: root.label,
    rel: normalizedRelative.replace(/\\/g, '/'),
    abs: candidate
  };
}

function normalizeDataEditorResponseRow(domain, rootId, filePath) {
  return {
    domain: normalizeDomain(domain),
    rootId,
    path: filePath
  };
}

function canWriteDataFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return DATA_TEXT_EXTS.includes(ext);
}

function applyIgnoredFilter(domain, rows) {
  const ignored = listIgnoredByDomain(domain, { show: 'all' });
  const ignoredSet = new Set(ignored.map((item) => String(item.key)));
  if (ignored.length === 0) {
    return {
      rows,
      ignoredCount: 0
    };
  }

  const filteredRows = [];
  for (const row of rows) {
    const nextParts = [];
    for (const part of Array.isArray(row.partDiffs) ? row.partDiffs : []) {
      const diffs = Array.isArray(part.valueDiffs)
        ? part.valueDiffs
        : (Array.isArray(part.samplePaths) ? part.samplePaths.map((pathText) => ({ path: pathText })) : []);

      const remained = diffs.filter((entry) => {
        const isIgnored = isIgnoredByStoreItem(domain, row, part.part, entry);
        if (isIgnored) return false;
        return true;
      });
      if (remained.length === 0) continue;
      const allPaths = remained.map((entry) => entry.path);
      nextParts.push({
        ...part,
        diffCount: allPaths.length,
        samplePaths: allPaths,
        hiddenCount: 0,
        valueDiffs: remained
      });
    }
    if (nextParts.length === 0) continue;
    const partsText = nextParts.map((part) => `${part.part}(${part.diffCount})`).join(', ');
    const diffSample = nextParts
      .map((part) => `${part.part}: ${part.samplePaths.join(', ')}`)
      .join(' / ');
    filteredRows.push({
      ...row,
      partDiffs: nextParts,
      partsText,
      diffSample
    });
  }
  return {
    rows: filteredRows,
    ignoredCount: ignoredSet.size
  };
}

function toFiniteNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function isAutoPatchWeaponStatDiff(row, partName, valueDiff) {
  if (normalizeDomain(row?.domain || DEFAULT_DOMAIN) !== 'character') return false;
  if (String(partName || '').trim().toLowerCase() !== 'weapon') return false;
  const pathText = String(valueDiff?.path || '').trim();
  if (!/\.(attack|health|defense)$/i.test(pathText)) return false;

  const beforeNum = toFiniteNumber(valueDiff?.before);
  const afterNum = toFiniteNumber(valueDiff?.after);
  if (beforeNum == null || afterNum == null) return false;
  if (!Number.isInteger(beforeNum)) return false;
  if (Number.isInteger(afterNum)) return false;
  if (Math.trunc(beforeNum) !== Math.trunc(afterNum)) return false;
  if (beforeNum === afterNum) return false;
  return true;
}

function collectAutoPatchDiffs(rows, domain) {
  const out = [];
  const seen = new Set();
  for (const row of Array.isArray(rows) ? rows : []) {
    for (const part of Array.isArray(row.partDiffs) ? row.partDiffs : []) {
      for (const valueDiff of Array.isArray(part.valueDiffs) ? part.valueDiffs : []) {
        const scopedRow = { ...row, domain };
        if (!isAutoPatchWeaponStatDiff(scopedRow, part.part, valueDiff)) continue;
        const item = {
          index: row.index,
          lang: row.lang,
          api: row.api,
          local: row.local,
          key: row.key,
          part: part.part,
          path: valueDiff.path
        };
        const dedupeKey = `${item.index}|${item.lang}|${item.part}|${item.path}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        out.push(item);
      }
    }
  }
  return out;
}

function getDomainCapability(domain) {
  return DOMAIN_CAPABILITIES.find((item) => item.id === normalizeDomain(domain)) || null;
}

function getPatchScriptForDomain(domain) {
  const d = normalizeDomain(domain);
  return DOMAIN_PATCH_SCRIPT[d] || DOMAIN_PATCH_SCRIPT.character;
}

function ensureDomainFeatureOrRespond(res, domainRaw, feature) {
  const domain = normalizeDomain(domainRaw);
  const capability = getDomainCapability(domain);
  if (!capability) {
    sendJson(res, 400, {
      ok: false,
      error: `Unknown domain: ${domain}`
    });
    return { ok: false, domain, capability: null };
  }

  if (!capability.enabled || !capability.features.includes(feature)) {
    sendJson(res, 501, {
      ok: false,
      error: `Domain '${domain}' does not support feature '${feature}' yet.`,
      domain,
      capability
    });
    return { ok: false, domain, capability };
  }

  return { ok: true, domain, capability };
}

function parsePort(argv) {
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--port' && i + 1 < argv.length) {
      const parsed = Number(argv[i + 1]);
      if (Number.isInteger(parsed) && parsed > 0 && parsed <= 65535) {
        return parsed;
      }
      break;
    }
  }
  const envPort = Number(process.env.PATCH_CONSOLE_PORT || process.env.PORT || 4173);
  if (Number.isInteger(envPort) && envPort > 0 && envPort <= 65535) {
    return envPort;
  }
  return 4173;
}

function log(message) {
  process.stdout.write(`${message}\n`);
}

function warn(message) {
  process.stderr.write(`[warn] ${message}\n`);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(payload);
}

function sendRevelationAdminError(res, error) {
  const status = Number(error?.status);
  const statusCode = Number.isInteger(status) && status > 0 ? status : 500;
  const payload = {
    ok: false,
    error: String(error?.message || 'revelation_admin_failed')
  };
  if (error?.code) payload.code = String(error.code);
  if (error?.details != null) payload.details = error.details;
  sendJson(res, statusCode, payload);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeCodeName(value) {
  return String(value || '')
    .normalize('NFC')
    .trim()
    .replace(/\uCA8C/g, '\u00B7')
    .toUpperCase();
}

function normalizeLabel(value) {
  return String(value || '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/\uCA8C/g, '\u00B7')
    .replace(/[.\-_&]/g, ' ')
    .replace(/[\u00B7]/g, '')
    .replace(/\s+/g, '');
}

function toAssetIconUrl(subdir, fileName) {
  return `/assets/img/${subdir}/${encodeURIComponent(fileName)}`;
}

function findExactIconByName(rawName, iconDirAbs, subdir) {
  const baseName = String(rawName || '').normalize('NFC').trim();
  if (!baseName) return null;
  for (const ext of ICON_EXTS) {
    const fileName = `${baseName}${ext}`;
    const abs = path.join(iconDirAbs, fileName);
    if (fs.existsSync(abs)) {
      return toAssetIconUrl(subdir, fileName);
    }
  }
  return null;
}

function safeReportPath(relativeOrEmpty) {
  const rel = String(relativeOrEmpty || DEFAULT_REPORT_REL).replace(/\\/g, '/');
  const normalizedRel = rel.startsWith('/') ? rel.slice(1) : rel;
  const absolute = path.resolve(PROJECT_ROOT, normalizedRel);
  const reportsRoot = path.resolve(APP_REPORT_DIR);
  if (!absolute.startsWith(reportsRoot)) {
    return {
      rel: DEFAULT_REPORT_REL.replace(/\\/g, '/'),
      abs: path.resolve(PROJECT_ROOT, DEFAULT_REPORT_REL)
    };
  }
  return { rel: normalizedRel, abs: absolute };
}

function resolvePathUnder(baseDir, requestPath) {
  const encoded = String(requestPath || '/').split('?')[0];
  let noQuery = encoded;
  try {
    noQuery = decodeURIComponent(encoded);
  } catch {
    noQuery = encoded;
  }
  const normalized = path.normalize(noQuery).replace(/^([/\\])+/, '');
  const resolved = path.resolve(baseDir, normalized);
  const baseResolved = path.resolve(baseDir);
  if (!resolved.startsWith(baseResolved)) return null;
  return resolved;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString('utf8');
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error(`Invalid JSON body: ${error.message}`));
      }
    });
    req.on('error', reject);
  });
}

function normalizeUtf8NoBom(text) {
  const stripped = stripBom(String(text == null ? '' : text));
  return normalizeNewline(stripped);
}

function readTextUtf8(filePath, fallback = '') {
  if (!fs.existsSync(filePath)) return fallback;
  return normalizeUtf8NoBom(fs.readFileSync(filePath, 'utf8'));
}

function writeTextUtf8(filePath, content) {
  const normalized = normalizeUtf8NoBom(content);
  fs.writeFileSync(filePath, normalized.endsWith('\n') ? normalized : `${normalized}\n`, 'utf8');
}

function loadSeoHistoryStore() {
  const fallback = {
    version: 1,
    updatedAt: '',
    items: []
  };
  if (!fs.existsSync(SEO_HISTORY_FILE)) {
    return fallback;
  }
  try {
    const parsed = JSON.parse(stripBom(fs.readFileSync(SEO_HISTORY_FILE, 'utf8')));
    const version = Number(parsed?.version || 1);
    const items = Array.isArray(parsed?.items) ? parsed.items : [];
    const updatedAt = String(parsed?.updatedAt || '');
    return {
      version: Number.isInteger(version) && version > 0 ? version : 1,
      updatedAt,
      items
    };
  } catch {
    return fallback;
  }
}

function saveSeoHistoryStore(store) {
  const payload = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: Array.isArray(store?.items) ? store.items.slice(0, SEO_HISTORY_MAX_ITEMS) : []
  };
  writeTextUtf8(SEO_HISTORY_FILE, serializeJson(payload));
}

function addSeoHistoryItem(item) {
  const store = loadSeoHistoryStore();
  const nextItem = {
    id: shortHash(`${Date.now()}|${Math.random()}|${item?.domain || ''}|${item?.kind || ''}`),
    createdAt: new Date().toISOString(),
    ...item
  };
  store.items = [nextItem, ...(Array.isArray(store.items) ? store.items : [])]
    .slice(0, SEO_HISTORY_MAX_ITEMS);
  saveSeoHistoryStore(store);
  return nextItem;
}

function listSeoHistoryItems(limit = 80) {
  const safeLimit = Math.min(Math.max(Number(limit) || 80, 1), SEO_HISTORY_MAX_ITEMS);
  const store = loadSeoHistoryStore();
  return (Array.isArray(store.items) ? store.items : []).slice(0, safeLimit);
}

function ensureSeoSupportFiles() {
  ensureDir(path.dirname(SEO_AVAILABILITY_FILE));
  ensureDir(path.dirname(SEO_HISTORY_FILE));
  if (!fs.existsSync(SEO_AVAILABILITY_FILE)) {
    writeTextUtf8(SEO_AVAILABILITY_FILE, serializeJson({ version: 1, entries: {} }));
  }
  if (!fs.existsSync(SEO_HISTORY_FILE)) {
    saveSeoHistoryStore({ version: 1, updatedAt: '', items: [] });
  }
}

function loadSeoBootstrapPayload() {
  const domains = listSeoDomains(PROJECT_ROOT).map((entry) => {
    const phase = SEO_PHASE1_DOMAINS.includes(entry.id) ? 'phase1' : 'phase2';
    return {
      id: entry.id,
      type: entry.type,
      modeKeys: Array.isArray(entry.modeKeys) ? entry.modeKeys : [],
      placeholder: entry.placeholder || null,
      source: entry.source,
      langs: Array.isArray(entry.langs) ? entry.langs : SEO_REQUIRED_LANGS,
      phase
    };
  });

  const defaultDomain = domains.find((item) => item.phase === 'phase1')?.id
    || domains[0]?.id
    || 'home';

  return {
    defaultDomain,
    requiredLangs: [...SEO_REQUIRED_LANGS],
    optionalLangs: [...SEO_OPTIONAL_LANGS],
    phase1Domains: [...SEO_PHASE1_DOMAINS],
    domains,
    cnDefaultVisible: false
  };
}

function resolveSeoDomain(rawDomain) {
  const domain = String(rawDomain || '').trim().toLowerCase();
  if (!domain) return null;
  const domains = listSeoDomains(PROJECT_ROOT);
  return domains.find((item) => item.id === domain) || null;
}

function prepareSeoDomainPayload(domain) {
  const availability = loadSeoAvailability(SEO_AVAILABILITY_FILE);
  const state = buildSeoDomainState({
    projectRoot: PROJECT_ROOT,
    domain,
    availabilityEntries: availability.entries || {}
  });
  const metaRaw = readTextUtf8(state.sourcePath, '');
  const availabilityRaw = readTextUtf8(SEO_AVAILABILITY_FILE, '');
  const etag = buildSeoEtag({ metaRaw, availabilityRaw });
  return {
    ...state,
    etag
  };
}

function sanitizeSeoRows(rows) {
  return Array.isArray(rows)
    ? rows.map((row) => ({
        scope: String(row?.scope || '').trim(),
        placeholder: row?.placeholder == null ? null : String(row.placeholder),
        values: isPlainObject(row?.values) ? row.values : {},
        released: isPlainObject(row?.released) ? row.released : {}
      }))
    : [];
}

async function runNpmScript(scriptName, { timeoutMs = 30 * 60 * 1000 } = {}) {
  const npmExecPath = process.env.npm_execpath;
  let command;
  let args;
  if (npmExecPath) {
    command = process.execPath;
    args = [npmExecPath, 'run', scriptName];
  } else if (process.platform === 'win32') {
    command = process.env.ComSpec || 'cmd.exe';
    args = ['/d', '/s', '/c', 'npm', 'run', scriptName];
  } else {
    command = 'npm';
    args = ['run', scriptName];
  }

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: PROJECT_ROOT,
      shell: false
    });

    let stdout = '';
    let stderr = '';
    let done = false;
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      child.kill('SIGTERM');
      resolve({
        code: -1,
        stdout,
        stderr: `${stderr}\n[timeout] npm run ${scriptName} killed after ${timeoutMs}ms`.trim(),
        args
      });
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });
    child.on('close', (code) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, args });
    });
    child.on('error', (error) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve({
        code: -1,
        stdout,
        stderr: `${stderr}\n${error.message}`.trim(),
        args
      });
    });
  });
}

function startSeoCiJob(domain) {
  const jobId = shortHash(`${Date.now()}|${domain}|${Math.random()}`);
  const now = new Date().toISOString();
  const job = {
    id: jobId,
    domain,
    status: 'running',
    createdAt: now,
    updatedAt: now,
    code: null,
    stdout: '',
    stderr: ''
  };
  seoCiJobs.set(jobId, job);
  runNpmScript('seo:ci:check', { timeoutMs: 30 * 60 * 1000 })
    .then((run) => {
      const next = seoCiJobs.get(jobId);
      if (!next) return;
      next.status = run.code === 0 ? 'passed' : 'failed';
      next.updatedAt = new Date().toISOString();
      next.code = run.code;
      next.stdout = run.stdout || '';
      next.stderr = run.stderr || '';
      addSeoHistoryItem({
        kind: 'ci',
        domain,
        status: next.status,
        jobId,
        code: next.code,
        summary: next.status === 'passed' ? 'seo:ci:check passed' : 'seo:ci:check failed'
      });
    })
    .catch((error) => {
      const next = seoCiJobs.get(jobId);
      if (!next) return;
      next.status = 'failed';
      next.updatedAt = new Date().toISOString();
      next.code = -1;
      next.stderr = String(error?.message || error || 'unknown error');
      addSeoHistoryItem({
        kind: 'ci',
        domain,
        status: next.status,
        jobId,
        code: next.code,
        summary: next.stderr
      });
    });
  return job;
}

function parseCsv(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeScopeMode(modeRaw) {
  const mode = String(modeRaw || 'all').toLowerCase();
  if (['all', 'nums', 'api', 'local'].includes(mode)) return mode;
  return 'all';
}

function buildScopeArgs({ scopeMode, scopeValue }) {
  const mode = normalizeScopeMode(scopeMode);
  const value = String(scopeValue || '').trim();
  if (mode === 'all' || !value) return ['--all'];
  if (mode === 'nums') return ['--nums', value];
  if (mode === 'api') return ['--api', value];
  return ['--local', value];
}

function buildTierIconIndex() {
  if (tierIconIndexCache) return tierIconIndexCache;
  const map = new Map();
  if (!fs.existsSync(TIER_ICON_DIR)) {
    tierIconIndexCache = map;
    return map;
  }
  const files = fs.readdirSync(TIER_ICON_DIR);
  for (const fileName of files) {
    const ext = path.extname(fileName).toLowerCase();
    if (!ICON_EXTS.includes(ext)) continue;
    const stem = path.basename(fileName, ext);
    const key = normalizeLabel(stem);
    if (!key) continue;
    map.set(key, toAssetIconUrl('tier', fileName));
  }
  tierIconIndexCache = map;
  return map;
}

function buildPersonaIconIndex() {
  if (personaIconIndexCache) return personaIconIndexCache;
  const map = new Map();
  if (!fs.existsSync(PERSONA_ICON_DIR)) {
    personaIconIndexCache = map;
    return map;
  }
  const files = fs.readdirSync(PERSONA_ICON_DIR);
  for (const fileName of files) {
    const ext = path.extname(fileName).toLowerCase();
    if (!ICON_EXTS.includes(ext)) continue;
    const stem = path.basename(fileName, ext);
    const key = normalizeLabel(stem);
    if (!key) continue;
    map.set(key, toAssetIconUrl('persona', fileName));
  }
  personaIconIndexCache = map;
  return map;
}

function buildWonderWeaponIconIndex() {
  if (wonderWeaponIconIndexCache) return wonderWeaponIconIndexCache;
  const map = new Map();
  if (!fs.existsSync(WONDER_WEAPON_ICON_DIR)) {
    wonderWeaponIconIndexCache = map;
    return map;
  }
  const files = fs.readdirSync(WONDER_WEAPON_ICON_DIR);
  for (const fileName of files) {
    const ext = path.extname(fileName).toLowerCase();
    if (!ICON_EXTS.includes(ext)) continue;
    const stem = path.basename(fileName, ext);
    const key = normalizeLabel(stem);
    if (!key) continue;
    map.set(key, toAssetIconUrl('wonder-weapon', fileName));
  }
  wonderWeaponIconIndexCache = map;
  return map;
}

function buildRevelationIconIndex() {
  if (revelationIconIndexCache) return revelationIconIndexCache;
  const map = new Map();
  if (!fs.existsSync(REVELATION_ICON_DIR)) {
    revelationIconIndexCache = map;
    return map;
  }
  const files = fs.readdirSync(REVELATION_ICON_DIR);
  for (const fileName of files) {
    const ext = path.extname(fileName).toLowerCase();
    if (!ICON_EXTS.includes(ext)) continue;
    const stem = path.basename(fileName, ext);
    const key = normalizeLabel(stem);
    if (!key) continue;
    map.set(key, toAssetIconUrl('revelation', fileName));
  }
  revelationIconIndexCache = map;
  return map;
}

function resolveCharacterRowIcon({ key, local, api }) {
  const exactCandidates = [key, local, api];
  for (const candidate of exactCandidates) {
    const exact = findExactIconByName(candidate, TIER_ICON_DIR, 'tier');
    if (exact) return exact;
  }

  const iconIndex = buildTierIconIndex();
  const candidates = [key, local, api];
  for (const candidate of candidates) {
    const normalized = normalizeLabel(candidate);
    if (!normalized) continue;
    if (iconIndex.has(normalized)) {
      return iconIndex.get(normalized);
    }
  }
  return null;
}

function resolvePersonaRowIcon({ key, local, api }) {
  const exactCandidates = [key, local, api];
  for (const candidate of exactCandidates) {
    const exact = findExactIconByName(candidate, PERSONA_ICON_DIR, 'persona');
    if (exact) return exact;
  }

  const iconIndex = buildPersonaIconIndex();
  const candidates = [key, local, api];
  for (const candidate of candidates) {
    const normalized = normalizeLabel(candidate);
    if (!normalized) continue;
    if (iconIndex.has(normalized)) return iconIndex.get(normalized);
  }
  return null;
}

function resolveWonderWeaponRowIcon({ key, local, api }) {
  const exactCandidates = [key, local, api];
  for (const candidate of exactCandidates) {
    const exact = findExactIconByName(candidate, WONDER_WEAPON_ICON_DIR, 'wonder-weapon');
    if (exact) return exact;
  }

  const iconIndex = buildWonderWeaponIconIndex();
  const candidates = [key, local, api];
  for (const candidate of candidates) {
    const normalized = normalizeLabel(candidate);
    if (!normalized) continue;
    if (iconIndex.has(normalized)) return iconIndex.get(normalized);
  }
  return null;
}

function resolveRevelationRowIcon({ key, local, api }) {
  const exactCandidates = [key, local, api];
  for (const candidate of exactCandidates) {
    const exact = findExactIconByName(candidate, REVELATION_ICON_DIR, 'revelation');
    if (exact) return exact;
  }

  const iconIndex = buildRevelationIconIndex();
  const candidates = [key, local, api];
  for (const candidate of candidates) {
    const normalized = normalizeLabel(candidate);
    if (!normalized) continue;
    if (iconIndex.has(normalized)) return iconIndex.get(normalized);
  }
  return null;
}

function resolveRowIcon({ key, local, api }, domain = DEFAULT_DOMAIN) {
  const d = normalizeDomain(domain);
  if (d === 'persona') {
    return resolvePersonaRowIcon({ key, local, api });
  }
  if (d === 'wonder_weapon') {
    return resolveWonderWeaponRowIcon({ key, local, api });
  }
  if (d === 'revelation') {
    return resolveRevelationRowIcon({ key, local, api });
  }
  return resolveCharacterRowIcon({ key, local, api });
}

function parseListOutput(stdout, domain = DEFAULT_DOMAIN) {
  const rows = [];
  const lines = String(stdout || '').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || !/^\d+\s+\|/.test(line)) continue;
    const cols = line.split('|').map((x) => x.trim());
    if (cols.length < 5) continue;
    const index = Number(cols[0]);
    if (!Number.isInteger(index)) continue;
    const status = {};
    for (const token of cols[4].split(/\s+/)) {
      const [lang, mark] = token.split(':');
      if (!lang || !mark) continue;
      status[lang] = mark;
    }
    const row = {
      index,
      api: cols[1],
      local: cols[2],
      key: cols[3],
      status
    };
    row.icon = resolveRowIcon(row, domain);
    rows.push(row);
  }
  return rows;
}

function parseDiffSampleMap(diffSampleText) {
  const map = new Map();
  const chunks = String(diffSampleText || '')
    .split(' / ')
    .map((x) => x.trim())
    .filter(Boolean);
  for (const chunk of chunks) {
    const idx = chunk.indexOf(':');
    if (idx < 0) continue;
    const part = chunk.slice(0, idx).trim();
    const rest = chunk.slice(idx + 1).trim();
    if (!part) continue;
    const paths = rest
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
    map.set(part, paths);
  }
  return map;
}

function parseReportMarkdown(markdownText, domain = DEFAULT_DOMAIN) {
  const rows = [];
  const lines = String(markdownText || '').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line.startsWith('|')) continue;
    if (/^\|\s*-/.test(line)) continue;
    if (!/^\|\s*\d+\s*\|/.test(line)) continue;
    const cols = line
      .split('|')
      .slice(1, -1)
      .map((x) => x.trim());
    if (cols.length < 7) continue;

    const index = Number(cols[0]);
    if (!Number.isInteger(index)) continue;

    const partsRaw = cols[5];
    const diffSample = cols[6];
    const sampleMap = parseDiffSampleMap(diffSample);
    const partDiffs = partsRaw
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((token) => {
        const match = token.match(/^([a-z_]+)\((\d+)\)$/i);
        if (!match) {
          const part = token;
          const samplePaths = sampleMap.get(part) || [];
          return { part, diffCount: null, samplePaths, hiddenCount: null };
        }
        const part = match[1];
        const diffCount = Number(match[2]);
        const samplePaths = sampleMap.get(part) || [];
        const hiddenCount = Math.max(diffCount - samplePaths.length, 0);
        return { part, diffCount, samplePaths, hiddenCount };
      });

    // Fallback: some markdown rows may not parse into per-part sample map.
    if (partDiffs.length === 1 && (partDiffs[0].samplePaths || []).length === 0) {
      const idx = diffSample.indexOf(':');
      if (idx >= 0) {
        const fallbackPaths = diffSample
          .slice(idx + 1)
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean);
        partDiffs[0].samplePaths = fallbackPaths;
        if (typeof partDiffs[0].diffCount === 'number') {
          partDiffs[0].hiddenCount = Math.max(partDiffs[0].diffCount - fallbackPaths.length, 0);
        }
      }
    }

    const row = {
      rowId: `${index}:${cols[1]}:${cols[2]}`,
      index,
      lang: cols[1],
      api: cols[2],
      local: cols[3],
      key: cols[4],
      partsText: partsRaw,
      diffSample,
      partDiffs
    };
    row.icon = resolveRowIcon(row, domain);
    rows.push(row);
  }
  return rows;
}

function runNodeScript(args, { timeoutMs = 30 * 60 * 1000 } = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      cwd: PROJECT_ROOT,
      shell: false
    });

    let stdout = '';
    let stderr = '';
    let done = false;

    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      child.kill('SIGTERM');
      resolve({
        code: -1,
        stdout,
        stderr: `${stderr}\n[timeout] process killed after ${timeoutMs}ms`.trim()
      });
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });
    child.on('close', (code) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
    child.on('error', (error) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve({
        code: -1,
        stdout,
        stderr: `${stderr}\n${error.message}`.trim()
      });
    });
  });
}

function buildPatchArgsFromFilter(payload, dryRun) {
  const scriptRel = getPatchScriptForDomain(payload.domain);
  const args = [scriptRel, 'patch'];
  const langs = parseCsv(payload.langs);
  const parts = parseCsv(payload.parts);

  args.push('--langs', langs.length > 0 ? langs.join(',') : defaultLangCsvForDomain(payload.domain));
  if (parts.length > 0) {
    args.push('--parts', parts.join(','));
  }

  const scopeArgs = buildScopeArgs({
    scopeMode: payload.scopeMode,
    scopeValue: payload.scopeValue
  });
  if (scopeArgs[0] !== '--all') {
    args.push(...scopeArgs);
  } else {
    throw new Error('Patch by filter requires nums/api/local scope');
  }

  args.push('--no-report');
  if (dryRun) args.push('--dry-run');
  return args;
}

function groupRowsByLang(rows) {
  const map = new Map();
  for (const row of rows) {
    const index = Number(row.index);
    const lang = String(row.lang || '').trim().toLowerCase();
    if (!Number.isInteger(index) || !lang) continue;
    if (!map.has(lang)) map.set(lang, new Set());
    map.get(lang).add(index);
  }
  return map;
}

function loadCodenameEntries() {
  if (!fs.existsSync(CODENAME_FILE)) return [];
  const parsed = JSON.parse(fs.readFileSync(CODENAME_FILE, 'utf8'));
  if (!Array.isArray(parsed)) return [];
  return parsed;
}

function writeCodenameEntries(entries) {
  fs.writeFileSync(CODENAME_FILE, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
}

function replaceTemplateKey(content, characterKey) {
  return content.replace(/\[""\]/g, `[${JSON.stringify(characterKey)}]`);
}

function bootstrapCharacterFiles(characterKey) {
  if (!fs.existsSync(TEMPLATE_ROOT)) {
    throw new Error(`Template directory not found: ${TEMPLATE_ROOT}`);
  }

  const targetDir = path.join(CHARACTER_ROOT, characterKey);
  const createdFiles = [];
  const skippedFiles = [];
  let createdDirectory = false;

  if (!fs.existsSync(targetDir)) {
    ensureDir(targetDir);
    createdDirectory = true;
  }

  for (const fileName of fs.readdirSync(TEMPLATE_ROOT)) {
    const src = path.join(TEMPLATE_ROOT, fileName);
    const dst = path.join(targetDir, fileName);
    if (!fs.statSync(src).isFile()) continue;
    if (fs.existsSync(dst)) {
      skippedFiles.push(`data/characters/${characterKey}/${fileName}`);
      continue;
    }
    const content = fs.readFileSync(src, 'utf8');
    const replaced = replaceTemplateKey(content, characterKey);
    fs.writeFileSync(dst, replaced, 'utf8');
    createdFiles.push(`data/characters/${characterKey}/${fileName}`);
  }

  return {
    characterKey,
    createdDirectory,
    createdFiles,
    skippedFiles
  };
}

function addCharacter(payload) {
  const api = String(payload.api || '').trim();
  const local = String(payload.local || '').trim();
  const key = String(payload.key || '').trim();

  if (!api || !local || !key) {
    throw new Error('api/local/key are required');
  }

  const entries = loadCodenameEntries();
  const byApi = new Set(entries.map((entry) => String(entry.api || '').toLowerCase()));
  const byLocal = new Set(entries.map((entry) => normalizeCodeName(entry.local)));
  const byKey = new Set(entries.map((entry) => String(entry.key || '').trim()).filter(Boolean));

  if (byApi.has(api.toLowerCase())) {
    throw new Error(`api already exists: ${api}`);
  }
  if (byLocal.has(normalizeCodeName(local))) {
    throw new Error(`local already exists: ${local}`);
  }
  if (byKey.has(key)) {
    throw new Error(`key already exists: ${key}`);
  }

  const nextEntry = { api, local, key };
  entries.push(nextEntry);
  writeCodenameEntries(entries);

  const bootstrap = bootstrapCharacterFiles(key);
  return {
    entry: nextEntry,
    bootstrap,
    icon: resolveRowIcon({ key, local, api })
  };
}

async function handleList(res, urlObj) {
  const gate = ensureDomainFeatureOrRespond(res, urlObj.searchParams.get('domain'), 'list');
  if (!gate.ok) return;
  const langs = String(urlObj.searchParams.get('langs') || defaultLangCsvForDomain(gate.domain));
  const scriptRel = getPatchScriptForDomain(gate.domain);
  const run = await runNodeScript([scriptRel, 'list', '--langs', langs], { timeoutMs: 120000 });
  if (run.code !== 0) {
    sendJson(res, 500, { ok: false, error: 'list_failed', stdout: run.stdout, stderr: run.stderr });
    return;
  }
  const rows = parseListOutput(run.stdout, gate.domain);
  sendJson(res, 200, {
    ok: true,
    domain: gate.domain,
    rows,
    count: rows.length,
    stdout: run.stdout
  });
}

async function handleReport(res, payload) {
  const gate = ensureDomainFeatureOrRespond(res, payload.domain, 'report');
  if (!gate.ok) return;
  const langs = parseCsv(payload.langs);
  const parts = parseCsv(payload.parts);
  const reportPath = safeReportPath(payload.reportFile);
  const jsonRel = reportPath.rel.endsWith('.json')
    ? reportPath.rel
    : `${reportPath.rel.replace(/\.md$/i, '')}.json`;
  const jsonPath = safeReportPath(jsonRel);

  const scriptRel = getPatchScriptForDomain(gate.domain);
  const args = [scriptRel, 'report-json'];
  args.push('--langs', langs.length > 0 ? langs.join(',') : defaultLangCsvForDomain(gate.domain));
  args.push(...buildScopeArgs({ scopeMode: payload.scopeMode, scopeValue: payload.scopeValue }));
  if (parts.length > 0) {
    args.push('--parts', parts.join(','));
  }
  args.push('--json-file', jsonPath.rel);

  const run = await runNodeScript(args);
  if (run.code !== 0) {
    sendJson(res, 500, {
      ok: false,
      error: 'report_failed',
      args,
      stdout: run.stdout,
      stderr: run.stderr
    });
    return;
  }

  const loadRowsFromArtifacts = () => {
    let parsedRows = [];
    if (fs.existsSync(jsonPath.abs)) {
      try {
        const raw = fs.readFileSync(jsonPath.abs, 'utf8').replace(/^\uFEFF/, '');
        const parsed = JSON.parse(raw);
        parsedRows = Array.isArray(parsed?.rows) ? parsed.rows : [];
      } catch (error) {
        const reportText = fs.existsSync(reportPath.abs) ? fs.readFileSync(reportPath.abs, 'utf8') : '';
        parsedRows = parseReportMarkdown(reportText, gate.domain);
        parsedRows.push({
          rowId: 'parse-error',
          index: 0,
          lang: '-',
          api: '-',
          local: '-',
          key: '-',
          partsText: '-',
          diffSample: `report-json parse failed: ${error.message}`,
          partDiffs: []
        });
      }
    }
    return parsedRows.map((row) => ({
      ...row,
      rowId: row.rowId || `${row.index}:${row.lang}:${row.api}`,
      icon: row.icon || resolveRowIcon(row, gate.domain),
      partDiffs: Array.isArray(row.partDiffs)
        ? row.partDiffs.map((part) => ({
            ...part,
            samplePaths: Array.isArray(part.samplePaths) ? part.samplePaths : [],
            valueDiffs: Array.isArray(part.valueDiffs) ? part.valueDiffs : []
          }))
        : []
    }));
  };

  let rows = loadRowsFromArtifacts();
  let autoPatchedCount = 0;
  let autoPatchResult = null;
  const autoPatchDiffs = collectAutoPatchDiffs(rows, gate.domain);
  if (autoPatchDiffs.length > 0) {
    autoPatchResult = await executeApplyDiffs(autoPatchDiffs, { dryRun: false, domain: gate.domain });
    if (autoPatchResult.ok) {
      autoPatchedCount = autoPatchDiffs.length;
      const rerun = await runNodeScript(args);
      if (rerun.code !== 0) {
        warn(`[auto-patch] report rerun failed: ${rerun.stderr || rerun.stdout}`);
      } else {
        rows = loadRowsFromArtifacts();
      }
    } else {
      warn(`[auto-patch] apply failed: ${autoPatchResult.stderr || autoPatchResult.error || 'unknown error'}`);
    }
  }

  rows = rows.map((row) => ({
    ...row,
    rowId: row.rowId || `${row.index}:${row.lang}:${row.api}`,
    icon: row.icon || resolveRowIcon(row, gate.domain),
    partDiffs: Array.isArray(row.partDiffs)
      ? row.partDiffs.map((part) => ({
          ...part,
          samplePaths: Array.isArray(part.samplePaths) ? part.samplePaths : [],
          valueDiffs: Array.isArray(part.valueDiffs) ? part.valueDiffs : []
        }))
      : []
  }));
  const filtered = applyIgnoredFilter(gate.domain, rows);
  rows = filtered.rows;
  sendJson(res, 200, {
    ok: true,
    domain: gate.domain,
    args,
    reportFile: jsonPath.rel,
    rowCount: rows.length,
    ignoredCount: filtered.ignoredCount,
    autoPatchedCount,
    autoPatch: autoPatchResult
      ? {
          ok: autoPatchResult.ok,
          code: autoPatchResult.code,
          args: autoPatchResult.args,
          stdout: autoPatchResult.stdout,
          stderr: autoPatchResult.stderr
        }
      : null,
    rows,
    stdout: run.stdout,
    stderr: run.stderr
  });
}

function buildApplyDiffTasks(diffs) {
  const grouped = new Map();
  for (const diff of diffs) {
    const index = Number(diff.index);
    const lang = String(diff.lang || '').trim().toLowerCase();
    const part = String(diff.part || '').trim();
    const pathText = String(diff.path || '').trim();
    if (!Number.isInteger(index) || !lang || !part || !pathText) continue;
    const groupKey = `${index}|${lang}|${part}`;
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        index,
        lang,
        part,
        paths: new Set()
      });
    }
    grouped.get(groupKey).paths.add(pathText);
  }

  if (grouped.size === 0) {
    return [];
  }

  const tasksMap = new Map();
  for (const item of grouped.values()) {
    const taskKey = `${item.index}|${item.lang}`;
    if (!tasksMap.has(taskKey)) {
      tasksMap.set(taskKey, {
        index: item.index,
        lang: item.lang,
        parts: []
      });
    }
    tasksMap.get(taskKey).parts.push({
      part: item.part,
      paths: [...item.paths]
    });
  }
  return [...tasksMap.values()];
}

async function executeApplyDiffs(diffs, { dryRun = false, domain = DEFAULT_DOMAIN } = {}) {
  const tasks = buildApplyDiffTasks(diffs);
  if (tasks.length === 0) {
    return {
      ok: false,
      code: -1,
      error: 'No valid diff entries.',
      args: [],
      stdout: '',
      stderr: ''
    };
  }

  const reqFile = path.join(
    PROJECT_ROOT,
    'apps',
    'patch-console',
    'state',
    `apply-diff-request-${Date.now()}.json`
  );
  ensureDir(path.dirname(reqFile));
  fs.writeFileSync(reqFile, `${JSON.stringify({ tasks }, null, 2)}\n`, 'utf8');

  const scriptRel = getPatchScriptForDomain(domain);
  const args = [scriptRel, 'apply-diff-json', '--input-file', path.relative(PROJECT_ROOT, reqFile)];
  if (dryRun) args.push('--dry-run');
  const run = await runNodeScript(args);
  try {
    fs.unlinkSync(reqFile);
  } catch {
    // Keep temp file on failure to preserve debugging context.
  }

  return {
    ok: run.code === 0,
    code: run.code,
    args,
    stdout: run.stdout,
    stderr: run.stderr
  };
}

async function handleApplyDiffs(res, payload) {
  const gate = ensureDomainFeatureOrRespond(res, payload.domain, 'patch');
  if (!gate.ok) return;
  const dryRun = Boolean(payload.dryRun);
  const diffs = Array.isArray(payload.diffs) ? payload.diffs : [];
  if (diffs.length === 0) {
    sendJson(res, 400, { ok: false, error: 'No diffs provided.' });
    return;
  }

  const run = await executeApplyDiffs(diffs, { dryRun, domain: gate.domain });
  if (!run.args || run.args.length === 0) {
    sendJson(res, 400, { ok: false, error: run.error || 'No valid diff entries.' });
    return;
  }

  sendJson(res, run.code === 0 ? 200 : 500, {
    ok: run.code === 0,
    domain: gate.domain,
    dryRun,
    description: dryRun
      ? 'Dry Run: selected diff paths executed without file writes.'
      : 'Patch Run: selected diff paths were applied.',
    args: run.args,
    stdout: run.stdout,
    stderr: run.stderr
  });
}

async function handleIgnoredList(req, res, urlObj) {
  const domain = normalizeDomain(urlObj.searchParams.get('domain'));
  const items = listIgnoredByDomain(domain, {
    q: urlObj.searchParams.get('q'),
    index: urlObj.searchParams.get('index'),
    lang: urlObj.searchParams.get('lang'),
    api: urlObj.searchParams.get('api'),
    local: urlObj.searchParams.get('local'),
    key: urlObj.searchParams.get('key'),
    note: urlObj.searchParams.get('note'),
    part: urlObj.searchParams.get('part'),
    path: urlObj.searchParams.get('path'),
    characterKey: urlObj.searchParams.get('characterKey'),
    createdFrom: urlObj.searchParams.get('createdFrom'),
    createdTo: urlObj.searchParams.get('createdTo'),
    show: urlObj.searchParams.get('show'),
    sort: urlObj.searchParams.get('sort')
  });
  const activeCount = listIgnoredByDomain(domain, { show: 'active' }).length;
  const hiddenCount = listIgnoredByDomain(domain, { show: 'hidden' }).length;
  sendJson(res, 200, {
    ok: true,
    domain,
    count: items.length,
    totalCount: activeCount + hiddenCount,
    activeCount,
    hiddenCount,
    items
  });
}

async function handleDataRoots(res, urlObj) {
  const domain = normalizeDomain(urlObj.searchParams.get('domain'));
  const roots = getDataEditorRoots(domain).map((root) => ({
    id: root.id,
    label: root.label
  }));
  sendJson(res, 200, {
    ok: true,
    domain,
    roots
  });
}

async function handleDataFileList(res, urlObj) {
  const domain = normalizeDomain(urlObj.searchParams.get('domain'));
  const rootId = normalizeDataQueryValue(urlObj.searchParams.get('root'));
  const q = normalizeDataQueryValue(urlObj.searchParams.get('q'));
  const allRoots = getDataEditorRoots(domain);
  if (!allRoots || allRoots.length === 0) {
    sendJson(res, 404, { ok: false, error: `No editor root for domain: ${domain}` });
    return;
  }

  const selectedRoots = rootId
    ? allRoots.filter((root) => root.id === rootId)
    : allRoots;

  const items = [];
  for (const root of selectedRoots) {
    const rootFiles = collectDataFiles(root.path, q).map((filePath) => normalizeDataEditorResponseRow(domain, root.id, filePath));
    for (const item of rootFiles) {
      items.push(item);
    }
  }

  items.sort((a, b) => {
    if (a.rootId === b.rootId) return a.path.localeCompare(b.path);
    return a.rootId.localeCompare(b.rootId);
  });

  sendJson(res, 200, {
    ok: true,
    domain,
    rootId: rootId || '',
    roots: allRoots.map((root) => ({
      id: root.id,
      label: root.label
    })),
    count: items.length,
    items
  });
}

async function handleDataFileGet(res, urlObj) {
  const domain = normalizeDomain(urlObj.searchParams.get('domain'));
  const rootId = normalizeDataQueryValue(urlObj.searchParams.get('root'));
  const rel = normalizeDataQueryValue(urlObj.searchParams.get('path'));

  const target = resolveDataFilePath(domain, rootId, rel);
  if (!target) {
    sendJson(res, 400, { ok: false, error: 'Invalid domain/root/path' });
    return;
  }
  if (!canWriteDataFile(target.rel)) {
    sendJson(res, 400, { ok: false, error: `Unsupported file extension: ${path.extname(target.abs)}` });
    return;
  }
  if (!fs.existsSync(target.abs) || !fs.statSync(target.abs).isFile()) {
    sendJson(res, 404, { ok: false, error: 'File not found' });
    return;
  }

  const stat = fs.statSync(target.abs);
  if (stat.size > DATA_FILE_MAX_BYTES) {
    sendJson(res, 413, { ok: false, error: `File too large: ${stat.size}` });
    return;
  }

  let content;
  try {
    content = fs.readFileSync(target.abs, 'utf8');
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message });
    return;
  }

  sendJson(res, 200, {
    ok: true,
    domain,
    rootId: target.rootId,
    path: target.rel,
    rootLabel: target.rootLabel,
    size: stat.size,
    updatedAt: stat.mtime.toISOString(),
    content
  });
}

async function handleDataFileSave(res, payload) {
  const domain = normalizeDomain(payload.domain);
  const rootId = normalizeDataQueryValue(payload.root);
  const rel = normalizeDataQueryValue(payload.path);
  const content = String(payload.content == null ? '' : payload.content);

  const target = resolveDataFilePath(domain, rootId, rel);
  if (!target) {
    sendJson(res, 400, { ok: false, error: 'Invalid domain/root/path' });
    return;
  }
  if (!canWriteDataFile(target.rel)) {
    sendJson(res, 400, { ok: false, error: `Unsupported file extension: ${path.extname(target.abs)}` });
    return;
  }

  if (content.length > DATA_FILE_MAX_BYTES) {
    sendJson(res, 413, { ok: false, error: `Content too large: ${content.length}` });
    return;
  }

  if (path.extname(target.abs).toLowerCase() === '.json') {
    try {
      JSON.parse(content);
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: `Invalid JSON: ${error.message}`
      });
      return;
    }
  }

  try {
    ensureDir(path.dirname(target.abs));
    fs.writeFileSync(target.abs, content, 'utf8');
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message });
    return;
  }

  sendJson(res, 200, {
    ok: true,
    domain,
    rootId: target.rootId,
    path: target.rel,
    message: 'saved'
  });
}

async function handleSeoBootstrap(res) {
  const payload = loadSeoBootstrapPayload();
  sendJson(res, 200, { ok: true, ...payload });
}

async function handleSeoDomain(res, urlObj) {
  const domain = String(urlObj.searchParams.get('domain') || '').trim().toLowerCase();
  const matched = resolveSeoDomain(domain);
  if (!matched) {
    sendJson(res, 404, { ok: false, error: `Unknown SEO domain: ${domain}` });
    return;
  }
  try {
    const state = prepareSeoDomainPayload(matched.id);
    sendJson(res, 200, {
      ok: true,
      domain: state.domain,
      type: state.type,
      source: state.source,
      langs: state.langs,
      modeKeys: state.modeKeys,
      placeholder: state.placeholder,
      rows: state.rows,
      etag: state.etag
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: String(error?.message || error) });
  }
}

async function handleSeoValidate(res, payload) {
  const domain = String(payload?.domain || '').trim().toLowerCase();
  const matched = resolveSeoDomain(domain);
  if (!matched) {
    sendJson(res, 404, { ok: false, error: `Unknown SEO domain: ${domain}` });
    return;
  }

  try {
    const current = prepareSeoDomainPayload(matched.id);
    const rows = sanitizeSeoRows(payload?.rows);
    const validation = validateSeoRows({ domainState: current, rows });
    let nextMeta = null;
    let nextAvailability = null;
    if (validation.valid) {
      const availabilityStore = loadSeoAvailability(SEO_AVAILABILITY_FILE);
      nextMeta = matrixRowsToMeta({ domainState: current, rows });
      nextAvailability = normalizeAvailabilityFromRows({
        domainState: current,
        rows,
        currentEntries: availabilityStore.entries || {}
      });
    }

    sendJson(res, 200, {
      ok: true,
      domain: current.domain,
      valid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
      nextMeta,
      nextAvailability
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: String(error?.message || error) });
  }
}

async function handleSeoSave(res, payload) {
  const domain = String(payload?.domain || '').trim().toLowerCase();
  const matched = resolveSeoDomain(domain);
  if (!matched) {
    sendJson(res, 404, { ok: false, error: `Unknown SEO domain: ${domain}` });
    return;
  }

  const startedAt = Date.now();
  const sourcePath = resolveSeoMetaPath(PROJECT_ROOT, matched.id);
  const currentMetaRaw = readTextUtf8(sourcePath, '');
  const currentAvailabilityRaw = readTextUtf8(SEO_AVAILABILITY_FILE, '');
  const currentRegistryRaw = readTextUtf8(SEO_REGISTRY_FILE, '');
  const currentEtag = buildSeoEtag({
    metaRaw: currentMetaRaw,
    availabilityRaw: currentAvailabilityRaw
  });

  const providedEtag = String(payload?.etag || '').trim();
  if (providedEtag && providedEtag !== currentEtag) {
    sendJson(res, 409, {
      ok: false,
      error: 'etag_mismatch',
      expected: currentEtag,
      provided: providedEtag
    });
    return;
  }

  try {
    const current = prepareSeoDomainPayload(matched.id);
    const rows = sanitizeSeoRows(payload?.rows);
    const validation = validateSeoRows({ domainState: current, rows });
    if (!validation.valid) {
      sendJson(res, 400, {
        ok: false,
        error: 'validation_failed',
        errors: validation.errors,
        warnings: validation.warnings
      });
      return;
    }

    const availabilityStore = loadSeoAvailability(SEO_AVAILABILITY_FILE);
    const nextMeta = matrixRowsToMeta({ domainState: current, rows });
    const nextAvailabilityEntries = normalizeAvailabilityFromRows({
      domainState: current,
      rows,
      currentEntries: availabilityStore.entries || {}
    });
    const nextAvailability = {
      version: 1,
      entries: nextAvailabilityEntries
    };

    const nextMetaText = serializeJson(nextMeta);
    const nextAvailabilityText = serializeJson(nextAvailability);
    if (containsBom(nextMetaText) || containsBom(nextAvailabilityText)) {
      sendJson(res, 400, { ok: false, error: 'UTF-8 BOM is not allowed' });
      return;
    }

    writeTextUtf8(sourcePath, nextMetaText);
    writeTextUtf8(SEO_AVAILABILITY_FILE, nextAvailabilityText);

    const blockingChecks = [];
    const registryRun = await runNpmScript('seo:registry:generate', { timeoutMs: 180000 });
    blockingChecks.push({
      script: 'seo:registry:generate',
      code: registryRun.code,
      status: registryRun.code === 0 ? 'passed' : 'failed',
      stdout: registryRun.stdout,
      stderr: registryRun.stderr
    });

    const domainCheckScript = getSeoCheckScript(matched.id);
    if (domainCheckScript) {
      const run = await runNpmScript(domainCheckScript, { timeoutMs: 300000 });
      blockingChecks.push({
        script: domainCheckScript,
        code: run.code,
        status: run.code === 0 ? 'passed' : 'failed',
        stdout: run.stdout,
        stderr: run.stderr
      });
    } else {
      blockingChecks.push({
        script: null,
        code: 0,
        status: 'skipped',
        stdout: '',
        stderr: '',
        reason: 'No domain-specific check script mapped'
      });
    }

    const hasFailedBlocking = blockingChecks.some((item) => item.status === 'failed');
    if (hasFailedBlocking) {
      writeTextUtf8(sourcePath, currentMetaRaw);
      writeTextUtf8(SEO_AVAILABILITY_FILE, currentAvailabilityRaw);
      if (currentRegistryRaw.trim()) {
        writeTextUtf8(SEO_REGISTRY_FILE, currentRegistryRaw);
      } else if (fs.existsSync(SEO_REGISTRY_FILE)) {
        fs.unlinkSync(SEO_REGISTRY_FILE);
      }
      addSeoHistoryItem({
        kind: 'save',
        domain: matched.id,
        status: 'failed',
        durationMs: Date.now() - startedAt,
        summary: 'SEO save failed on blocking checks',
        checks: blockingChecks.map((item) => ({ script: item.script, status: item.status, code: item.code }))
      });
      sendJson(res, 500, {
        ok: false,
        error: 'blocking_check_failed',
        checks: blockingChecks
      });
      return;
    }

    const ciJob = startSeoCiJob(matched.id);
    const nextState = prepareSeoDomainPayload(matched.id);
    addSeoHistoryItem({
      kind: 'save',
      domain: matched.id,
      status: 'passed',
      durationMs: Date.now() - startedAt,
      summary: 'SEO meta saved successfully',
      ciJobId: ciJob.id,
      checks: blockingChecks.map((item) => ({ script: item.script, status: item.status, code: item.code }))
    });

    sendJson(res, 200, {
      ok: true,
      domain: matched.id,
      etag: nextState.etag,
      checks: blockingChecks,
      ciJob: {
        id: ciJob.id,
        status: ciJob.status,
        createdAt: ciJob.createdAt
      }
    });
  } catch (error) {
    try {
      writeTextUtf8(sourcePath, currentMetaRaw);
      writeTextUtf8(SEO_AVAILABILITY_FILE, currentAvailabilityRaw);
      if (currentRegistryRaw.trim()) {
        writeTextUtf8(SEO_REGISTRY_FILE, currentRegistryRaw);
      } else if (fs.existsSync(SEO_REGISTRY_FILE)) {
        fs.unlinkSync(SEO_REGISTRY_FILE);
      }
    } catch (rollbackError) {
      warn(`[seo-save] rollback failed: ${rollbackError.message}`);
    }
    addSeoHistoryItem({
      kind: 'save',
      domain: matched.id,
      status: 'failed',
      durationMs: Date.now() - startedAt,
      summary: String(error?.message || error || 'unknown error')
    });
    sendJson(res, 500, { ok: false, error: String(error?.message || error) });
  }
}

async function handleSeoCiStatus(res, urlObj) {
  const jobId = String(urlObj.searchParams.get('jobId') || '').trim();
  if (jobId) {
    const item = seoCiJobs.get(jobId);
    if (!item) {
      sendJson(res, 404, { ok: false, error: `Unknown jobId: ${jobId}` });
      return;
    }
    sendJson(res, 200, { ok: true, job: item });
    return;
  }

  const jobs = Array.from(seoCiJobs.values())
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
    .slice(0, 40);
  sendJson(res, 200, { ok: true, jobs });
}

async function handleSeoHistory(res, urlObj) {
  const limit = Number(urlObj.searchParams.get('limit') || 80);
  const items = listSeoHistoryItems(limit);
  sendJson(res, 200, {
    ok: true,
    count: items.length,
    items
  });
}

async function handleIgnoreDiffs(res, payload) {
  const domain = normalizeDomain(payload.domain);
  const diffs = Array.isArray(payload.diffs) ? payload.diffs : [];
  const overwrite = Boolean(payload.overwrite);
  const { added, updated } = addIgnoredDiffsWithOptions(domain, diffs, { overwrite });
  sendJson(res, 200, {
    ok: true,
    domain,
    added,
    updated,
    count: listIgnoredByDomain(domain, { show: 'all' }).length,
    activeCount: listIgnoredByDomain(domain, { show: 'active' }).length,
    hiddenCount: listIgnoredByDomain(domain, { show: 'hidden' }).length
  });
}

async function handleUpdateIgnoredDiffs(res, payload) {
  const domain = normalizeDomain(payload.domain);
  const result = updateIgnoredDiffs(domain, payload);
  sendJson(res, 200, {
    ok: true,
    domain,
    updated: result.updated,
    notFound: result.notFound,
    count: listIgnoredByDomain(domain, { show: 'all' }).length,
    activeCount: listIgnoredByDomain(domain, { show: 'active' }).length,
    hiddenCount: listIgnoredByDomain(domain, { show: 'hidden' }).length
  });
}

async function handleUnignoreDiffs(res, payload) {
  const domain = normalizeDomain(payload.domain);
  let keys = Array.isArray(payload.keys) ? payload.keys : [];
  if (keys.length === 0 && Array.isArray(payload.diffs)) {
    keys = payload.diffs.map((diff) => {
      const hasBefore = hasOwn(diff, 'before');
      const hasAfter = hasOwn(diff, 'after');
      const matcher = hasBefore || hasAfter ? 'value' : 'path';
      return matcher === 'value'
        ? makeDiffKey(domain, diff)
        : makeDiffKey(domain, diff, { legacy: true });
    });
  }
  const removed = removeIgnoredDiffs(domain, keys);
  sendJson(res, 200, {
    ok: true,
    domain,
    removed,
    count: listIgnoredByDomain(domain, { show: 'all' }).length
  });
}

async function handlePatch(res, payload) {
  const gate = ensureDomainFeatureOrRespond(res, payload.domain, 'patch');
  if (!gate.ok) return;
  const dryRun = Boolean(payload.dryRun);
  const parts = parseCsv(payload.parts);
  const outputs = [];
  const scriptRel = getPatchScriptForDomain(gate.domain);

  if (Array.isArray(payload.rows) && payload.rows.length > 0) {
    const grouped = groupRowsByLang(payload.rows);
    for (const [lang, indexSet] of grouped.entries()) {
      const indexes = [...indexSet].sort((a, b) => a - b);
      if (indexes.length === 0) continue;
      const args = [scriptRel, 'patch', '--nums', indexes.join(','), '--langs', lang, '--no-report'];
      if (parts.length > 0) args.push('--parts', parts.join(','));
      if (dryRun) args.push('--dry-run');
      const run = await runNodeScript(args);
      outputs.push({
        ok: run.code === 0,
        code: run.code,
        args,
        stdout: run.stdout,
        stderr: run.stderr
      });
    }
  } else {
    let args;
    try {
      args = buildPatchArgsFromFilter({ ...payload, domain: gate.domain }, dryRun);
      if (parts.length > 0 && !args.includes('--parts')) {
        args.push('--parts', parts.join(','));
      }
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
      return;
    }
    const run = await runNodeScript(args);
    outputs.push({
      ok: run.code === 0,
      code: run.code,
      args,
      stdout: run.stdout,
      stderr: run.stderr
    });
  }

  const allOk = outputs.every((item) => item.ok);
  sendJson(res, allOk ? 200 : 500, {
    ok: allOk,
    domain: gate.domain,
    dryRun,
    description: dryRun
      ? 'Dry Run: same patch logic, but files are not written.'
      : 'Patch Run: files may be modified.',
    outputs
  });
}

async function handleCreateEntry(res, payload) {
  const gate = ensureDomainFeatureOrRespond(res, payload.domain, 'create');
  if (!gate.ok) return;
  try {
    if (gate.domain === 'character') {
      const result = addCharacter(payload);
      sendJson(res, 200, {
        ok: true,
        domain: gate.domain,
        result
      });
      return;
    }

    if (gate.domain === 'revelation') {
      const scriptRel = getPatchScriptForDomain(gate.domain);
      const args = [scriptRel, 'create'];
      const kind = String(payload.kind || '').trim();
      const kr = String(payload.kr || '').trim();
      const en = String(payload.en || '').trim();
      const jp = String(payload.jp || '').trim();
      const cn = String(payload.cn || '').trim();
      const types = String(payload.types || '').trim();
      if (kind) args.push('--kind', kind);
      if (kr) args.push('--kr', kr);
      if (en) args.push('--en', en);
      if (jp) args.push('--jp', jp);
      if (cn) args.push('--cn', cn);
      if (types) args.push('--types', types);
      if (Boolean(payload.unreleased)) args.push('--unreleased');

      const setFields = ['set2_kr', 'set4_kr', 'set2_en', 'set4_en', 'set2_jp', 'set4_jp', 'set2_cn', 'set4_cn'];
      for (const field of setFields) {
        const value = payload[field];
        if (value == null) continue;
        const text = String(value);
        if (!text.trim()) continue;
        args.push(`--${field}`, text);
      }

      const run = await runNodeScript(args, { timeoutMs: 120000 });
      if (run.code !== 0) {
        sendJson(res, 400, {
          ok: false,
          error: 'create_failed',
          args,
          stdout: run.stdout,
          stderr: run.stderr
        });
        return;
      }

      let parsed = null;
      try {
        parsed = JSON.parse(String(run.stdout || '').trim());
      } catch {
        // ignored
      }

      sendJson(res, 200, {
        ok: true,
        domain: gate.domain,
        result: parsed?.entry || null,
        stdout: run.stdout,
        stderr: run.stderr
      });
      return;
    }

    sendJson(res, 400, {
      ok: false,
      error: `Unsupported create domain: ${gate.domain}`
    });
  } catch (error) {
    sendJson(res, 400, {
      ok: false,
      error: error.message
    });
  }
}

function resolveRevelationAdminIcon(card) {
  const names = card && typeof card === 'object' ? card.names || {} : {};
  return resolveRowIcon(
    {
      key: String(names.kr || ''),
      local: String(card?.kind || ''),
      api: String(names.en || names.jp || names.cn || names.kr || '')
    },
    'revelation'
  );
}

function withRevelationAdminCardIcon(card) {
  if (!card || typeof card !== 'object') return card;
  const out = { ...card };
  if (!out.icon) out.icon = resolveRevelationAdminIcon(out);
  return out;
}

function withRevelationAdminCardsIcon(cards) {
  if (!Array.isArray(cards)) return [];
  return cards.map((card) => withRevelationAdminCardIcon(card));
}

async function handleRevelationAdminBootstrap(res) {
  try {
    const result = loadRevelationAdminBootstrap();
    sendJson(res, 200, {
      ok: true,
      revision: result.revision,
      cards: withRevelationAdminCardsIcon(result.cards),
      options: result.options
    });
  } catch (error) {
    sendRevelationAdminError(res, error);
  }
}

async function handleRevelationAdminCard(res, urlObj) {
  const id = String(urlObj.searchParams.get('id') || '').trim();
  if (!id) {
    sendJson(res, 400, { ok: false, error: 'id is required' });
    return;
  }
  try {
    const result = loadRevelationAdminCard(id);
    sendJson(res, 200, {
      ok: true,
      revision: result.revision,
      card: withRevelationAdminCardIcon(result.card),
      options: result.options
    });
  } catch (error) {
    sendRevelationAdminError(res, error);
  }
}

async function handleRevelationAdminSaveCard(res, payload) {
  try {
    const result = saveRevelationAdminCard(payload || {});
    sendJson(res, 200, {
      ok: true,
      revision: result.revision,
      card: withRevelationAdminCardIcon(result.card),
      cards: withRevelationAdminCardsIcon(result.cards),
      options: result.options
    });
  } catch (error) {
    sendRevelationAdminError(res, error);
  }
}

async function handleRevelationAdminCreateCard(res, payload) {
  try {
    const result = createRevelationAdminCard(payload || {});
    sendJson(res, 200, {
      ok: true,
      revision: result.revision,
      id: result.id,
      card: withRevelationAdminCardIcon(result.card),
      cards: withRevelationAdminCardsIcon(result.cards),
      options: result.options
    });
  } catch (error) {
    sendRevelationAdminError(res, error);
  }
}

async function handleRevelationAdminRenameKr(res, payload) {
  try {
    const result = renameRevelationAdminKr(payload || {});
    sendJson(res, 200, {
      ok: true,
      revision: result.revision,
      newId: result.newId,
      card: withRevelationAdminCardIcon(result.card),
      cards: withRevelationAdminCardsIcon(result.cards),
      options: result.options
    });
  } catch (error) {
    sendRevelationAdminError(res, error);
  }
}

function serveFileFromBase(res, baseDir, requestPath, { defaultIndex = null } = {}) {
  let target = requestPath;
  if (defaultIndex && requestPath === '/') {
    target = `/${defaultIndex}`;
  }
  const resolved = resolvePathUnder(baseDir, target);
  if (!resolved) {
    sendText(res, 403, 'Forbidden');
    return;
  }
  if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
    sendText(res, 404, 'Not found');
    return;
  }
  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const buffer = fs.readFileSync(resolved);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store'
  });
  res.end(buffer);
}

async function requestHandler(req, res) {
  const host = req.headers.host || '127.0.0.1';
  const urlObj = new URL(req.url || '/', `http://${host}`);
  let pathname = urlObj.pathname;
  const normalizedPathname = String(pathname || '').replace(/\/+$/u, '') || '/';
  if (
    normalizedPathname === '/work'
    || normalizedPathname === '/ignored'
    || normalizedPathname === '/editor'
    || normalizedPathname === '/seo-admin'
    || normalizedPathname === '/revelation-admin'
  ) {
    pathname = '/';
  }

  if (!ALLOW_REMOTE_ACCESS) {
    const remote = extractClientIp(req);
    const isLoopback = isLoopbackIp(remote);
    if (!isLoopback) {
      sendText(res, 403, 'Forbidden: patch console is local-only. Use localhost host 127.0.0.1.');
      return;
    }
  } else if (!isAuthorizedRemoteRequest(req)) {
    sendText(
      res,
      403,
      'Forbidden: remote access requires Authorization Bearer token or x-patch-console-token header.'
    );
    return;
  }

  if (pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/seo/bootstrap' && req.method === 'GET') {
    await handleSeoBootstrap(res);
    return;
  }

  if (pathname === '/api/seo/domain' && req.method === 'GET') {
    await handleSeoDomain(res, urlObj);
    return;
  }

  if (pathname === '/api/seo/validate' && req.method === 'POST') {
    const body = await readBody(req);
    await handleSeoValidate(res, body);
    return;
  }

  if (pathname === '/api/seo/save' && req.method === 'POST') {
    const body = await readBody(req);
    await handleSeoSave(res, body);
    return;
  }

  if (pathname === '/api/seo/ci-status' && req.method === 'GET') {
    await handleSeoCiStatus(res, urlObj);
    return;
  }

  if (pathname === '/api/seo/history' && req.method === 'GET') {
    await handleSeoHistory(res, urlObj);
    return;
  }

  if (pathname === '/api/revelation-admin/bootstrap' && req.method === 'GET') {
    await handleRevelationAdminBootstrap(res);
    return;
  }

  if (pathname === '/api/revelation-admin/card' && req.method === 'GET') {
    await handleRevelationAdminCard(res, urlObj);
    return;
  }

  if (pathname === '/api/revelation-admin/save-card' && req.method === 'POST') {
    const body = await readBody(req);
    await handleRevelationAdminSaveCard(res, body);
    return;
  }

  if (pathname === '/api/revelation-admin/create-card' && req.method === 'POST') {
    const body = await readBody(req);
    await handleRevelationAdminCreateCard(res, body);
    return;
  }

  if (pathname === '/api/revelation-admin/rename-kr' && req.method === 'POST') {
    const body = await readBody(req);
    await handleRevelationAdminRenameKr(res, body);
    return;
  }

  if (pathname === '/api/capabilities' && req.method === 'GET') {
    const dataRoots = Object.fromEntries(
      Object.entries(DOMAIN_DATA_EDITOR_ROOTS).map(([domain, roots]) => [
        domain,
        roots.map((item) => ({ id: item.id, label: item.label }))
      ])
    );
    sendJson(res, 200, {
      ok: true,
      defaultDomain: DEFAULT_DOMAIN,
      domains: DOMAIN_CAPABILITIES,
      dataRoots
    });
    return;
  }

  if (pathname === '/api/ignored' && req.method === 'GET') {
    await handleIgnoredList(req, res, urlObj);
    return;
  }

  if (pathname === '/api/data-roots' && req.method === 'GET') {
    await handleDataRoots(res, urlObj);
    return;
  }

  if (pathname === '/api/data-files' && req.method === 'GET') {
    await handleDataFileList(res, urlObj);
    return;
  }

  if (pathname === '/api/data-file' && req.method === 'GET') {
    await handleDataFileGet(res, urlObj);
    return;
  }

  if (pathname === '/api/data-file' && req.method === 'POST') {
    const body = await readBody(req);
    await handleDataFileSave(res, body);
    return;
  }

  if (pathname === '/api/list' && req.method === 'GET') {
    await handleList(res, urlObj);
    return;
  }

  if (pathname === '/api/report' && req.method === 'POST') {
    const body = await readBody(req);
    await handleReport(res, body);
    return;
  }

  if (pathname === '/api/patch' && req.method === 'POST') {
    const body = await readBody(req);
    await handlePatch(res, body);
    return;
  }

  if (pathname === '/api/apply-diffs' && req.method === 'POST') {
    const body = await readBody(req);
    await handleApplyDiffs(res, body);
    return;
  }

  if (pathname === '/api/ignore-diffs' && req.method === 'POST') {
    const body = await readBody(req);
    await handleIgnoreDiffs(res, body);
    return;
  }

  if (pathname === '/api/unignore-diffs' && req.method === 'POST') {
    const body = await readBody(req);
    await handleUnignoreDiffs(res, body);
    return;
  }

  if (pathname === '/api/ignore-diffs' && req.method === 'PATCH') {
    const body = await readBody(req);
    await handleUpdateIgnoredDiffs(res, body);
    return;
  }

  if (pathname === '/api/create-entry' && req.method === 'POST') {
    const body = await readBody(req);
    await handleCreateEntry(res, body);
    return;
  }

  if (pathname === '/api/add-character' && req.method === 'POST') {
    const body = await readBody(req);
    await handleCreateEntry(res, body);
    return;
  }

  if (req.method === 'GET' && pathname.startsWith('/assets/')) {
    serveFileFromBase(res, PROJECT_ROOT, pathname);
    return;
  }

  if (req.method === 'GET') {
    serveFileFromBase(res, APP_ROOT, pathname, { defaultIndex: 'index.html' });
    return;
  }

  sendText(res, 405, 'Method not allowed');
}

function main() {
  if (!fs.existsSync(APP_ROOT)) {
    log(`[error] patch console app not found: ${APP_ROOT}`);
    process.exit(1);
  }

  const port = parsePort(process.argv);
  ensureDir(APP_STATE_ROOT);
  ensureDir(APP_REPORT_DIR);
  ensureSeoSupportFiles();
  if (!ALLOW_REMOTE_ACCESS) {
    log('Patch Console is local-only. Set PATCH_CONSOLE_ALLOW_REMOTE=1 only for explicit remote access testing.');
  } else if (REQUIRE_REMOTE_TOKEN) {
    log('Patch Console remote access enabled with token.');
  } else {
    log('Patch Console remote access enabled, but token check disabled (consider setting PATCH_CONSOLE_ACCESS_TOKEN).');
  }
  const host = '127.0.0.1';

  const server = http.createServer((req, res) => {
    requestHandler(req, res).catch((error) => {
      sendJson(res, 500, { ok: false, error: error.message });
    });
  });

  server.listen(port, host, () => {
    log(`Patch Console running at http://${host}:${port}`);
    for (const [domain, scriptRel] of Object.entries(DOMAIN_PATCH_SCRIPT)) {
      log(`Patch script [${domain}]: ${scriptRel.replace(/\\/g, '/')}`);
    }
    log(`Default report: ${DEFAULT_REPORT_REL.replace(/\\/g, '/')}`);
  });
}

main();
