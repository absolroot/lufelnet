#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const APP_ROOT = path.join(PROJECT_ROOT, 'apps', 'patch-console');
const PATCH_SCRIPT_REL = path.join('scripts', 'patch-characters.mjs');
const DEFAULT_REPORT_REL = path.join('scripts', 'reports', 'patch-console-report.md');
const IGNORED_DIFFS_FILE = path.join(PROJECT_ROOT, 'scripts', 'reports', 'patch-console-ignored-diffs.json');
const CODENAME_FILE = path.join(PROJECT_ROOT, 'data', 'external', 'character', 'codename.json');
const TEMPLATE_ROOT = path.join(PROJECT_ROOT, 'data', 'characters', 'template');
const CHARACTER_ROOT = path.join(PROJECT_ROOT, 'data', 'characters');
const TIER_ICON_DIR = path.join(PROJECT_ROOT, 'assets', 'img', 'tier');
const ICON_EXTS = ['.webp', '.png', '.jpg', '.jpeg', '.svg'];

const DOMAIN_CAPABILITIES = [
  {
    id: 'character',
    label: 'Character',
    enabled: true,
    features: ['list', 'report', 'patch', 'create']
  },
  {
    id: 'persona',
    label: 'Persona',
    enabled: false,
    features: []
  },
  {
    id: 'wonder_weapon',
    label: 'Wonder Weapon',
    enabled: false,
    features: []
  }
];
const DEFAULT_DOMAIN = 'character';

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

function normalizeDomain(raw) {
  const value = String(raw || DEFAULT_DOMAIN).trim().toLowerCase();
  if (!value) return DEFAULT_DOMAIN;
  return value;
}

function makeDiffKey(domain, diff) {
  const d = normalizeDomain(domain);
  const index = Number(diff?.index);
  const lang = String(diff?.lang || '').trim().toLowerCase();
  const part = String(diff?.part || '').trim();
  const pathText = String(diff?.path || '').trim();
  return `${d}|${index}|${lang}|${part}|${pathText}`;
}

function loadIgnoredStore() {
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

function listIgnoredByDomain(domain) {
  const d = normalizeDomain(domain);
  const store = loadIgnoredStore();
  return store.items
    .filter((item) => normalizeDomain(item.domain) === d)
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

function addIgnoredDiffs(domain, diffs) {
  const d = normalizeDomain(domain);
  const store = loadIgnoredStore();
  const map = new Map();
  for (const item of store.items) {
    map.set(String(item.key), item);
  }
  let added = 0;
  for (const diff of diffs) {
    const key = makeDiffKey(d, diff);
    if (map.has(key)) continue;
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
      createdAt: new Date().toISOString()
    };
    map.set(key, nextItem);
    added += 1;
  }
  store.items = [...map.values()];
  saveIgnoredStore(store);
  return added;
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

function applyIgnoredFilter(domain, rows) {
  const ignored = listIgnoredByDomain(domain);
  const ignoredSet = new Set(ignored.map((item) => String(item.key)));
  if (ignoredSet.size === 0) {
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
        const key = makeDiffKey(domain, {
          index: row.index,
          lang: row.lang,
          part: part.part,
          path: entry.path
        });
        return !ignoredSet.has(key);
      });
      if (remained.length === 0) continue;
      const allPaths = remained.map((entry) => entry.path);
      nextParts.push({
        ...part,
        diffCount: allPaths.length,
        samplePaths: allPaths.slice(0, 6),
        hiddenCount: Math.max(allPaths.length - 6, 0),
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

function getDomainCapability(domain) {
  return DOMAIN_CAPABILITIES.find((item) => item.id === normalizeDomain(domain)) || null;
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

function toAssetIconUrl(fileName) {
  return `/assets/img/tier/${encodeURIComponent(fileName)}`;
}

function findExactIconByName(rawName) {
  const baseName = String(rawName || '').normalize('NFC').trim();
  if (!baseName) return null;
  for (const ext of ICON_EXTS) {
    const fileName = `${baseName}${ext}`;
    const abs = path.join(TIER_ICON_DIR, fileName);
    if (fs.existsSync(abs)) {
      return toAssetIconUrl(fileName);
    }
  }
  return null;
}

function safeReportPath(relativeOrEmpty) {
  const rel = String(relativeOrEmpty || DEFAULT_REPORT_REL).replace(/\\/g, '/');
  const normalizedRel = rel.startsWith('/') ? rel.slice(1) : rel;
  const absolute = path.resolve(PROJECT_ROOT, normalizedRel);
  const reportsRoot = path.resolve(PROJECT_ROOT, 'scripts', 'reports');
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
    map.set(key, toAssetIconUrl(fileName));
  }
  tierIconIndexCache = map;
  return map;
}

function resolveRowIcon({ key, local, api }) {
  const exactCandidates = [key, local, api];
  for (const candidate of exactCandidates) {
    const exact = findExactIconByName(candidate);
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

function parseListOutput(stdout) {
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
    row.icon = resolveRowIcon(row);
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

function parseReportMarkdown(markdownText) {
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
    row.icon = resolveRowIcon(row);
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
  const args = [PATCH_SCRIPT_REL, 'patch'];
  const langs = parseCsv(payload.langs);
  const parts = parseCsv(payload.parts);

  args.push('--langs', langs.length > 0 ? langs.join(',') : 'kr,en,jp');
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
  const langs = String(urlObj.searchParams.get('langs') || 'kr,en,jp');
  const run = await runNodeScript([PATCH_SCRIPT_REL, 'list', '--langs', langs], { timeoutMs: 120000 });
  if (run.code !== 0) {
    sendJson(res, 500, { ok: false, error: 'list_failed', stdout: run.stdout, stderr: run.stderr });
    return;
  }
  const rows = parseListOutput(run.stdout);
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

  const args = [PATCH_SCRIPT_REL, 'report-json'];
  args.push('--langs', langs.length > 0 ? langs.join(',') : 'kr,en,jp');
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

  let rows = [];
  if (fs.existsSync(jsonPath.abs)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(jsonPath.abs, 'utf8'));
      rows = Array.isArray(parsed?.rows) ? parsed.rows : [];
    } catch (error) {
      const reportText = fs.existsSync(reportPath.abs) ? fs.readFileSync(reportPath.abs, 'utf8') : '';
      rows = parseReportMarkdown(reportText);
      rows.push({
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
  rows = rows.map((row) => ({
    ...row,
    rowId: row.rowId || `${row.index}:${row.lang}:${row.api}`,
    icon: row.icon || resolveRowIcon(row),
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
    rows,
    stdout: run.stdout,
    stderr: run.stderr
  });
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
    sendJson(res, 400, { ok: false, error: 'No valid diff entries.' });
    return;
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
  const tasks = [...tasksMap.values()];

  const reqFile = path.join(
    PROJECT_ROOT,
    'scripts',
    'reports',
    `apply-diff-request-${Date.now()}.json`
  );
  ensureDir(path.dirname(reqFile));
  fs.writeFileSync(reqFile, `${JSON.stringify({ tasks }, null, 2)}\n`, 'utf8');

  const args = [PATCH_SCRIPT_REL, 'apply-diff-json', '--input-file', path.relative(PROJECT_ROOT, reqFile)];
  if (dryRun) args.push('--dry-run');
  const run = await runNodeScript(args);
  try {
    fs.unlinkSync(reqFile);
  } catch {
    // Keep temp file on failure to preserve debugging context.
  }

  sendJson(res, run.code === 0 ? 200 : 500, {
    ok: run.code === 0,
    domain: gate.domain,
    dryRun,
    description: dryRun
      ? 'Dry Run: selected diff paths executed without file writes.'
      : 'Patch Run: selected diff paths were applied.',
    args,
    stdout: run.stdout,
    stderr: run.stderr
  });
}

async function handleIgnoredList(req, res, urlObj) {
  const domain = normalizeDomain(urlObj.searchParams.get('domain'));
  const items = listIgnoredByDomain(domain);
  sendJson(res, 200, {
    ok: true,
    domain,
    count: items.length,
    items
  });
}

async function handleIgnoreDiffs(res, payload) {
  const domain = normalizeDomain(payload.domain);
  const diffs = Array.isArray(payload.diffs) ? payload.diffs : [];
  const added = addIgnoredDiffs(domain, diffs);
  sendJson(res, 200, {
    ok: true,
    domain,
    added,
    count: listIgnoredByDomain(domain).length
  });
}

async function handleUnignoreDiffs(res, payload) {
  const domain = normalizeDomain(payload.domain);
  let keys = Array.isArray(payload.keys) ? payload.keys : [];
  if (keys.length === 0 && Array.isArray(payload.diffs)) {
    keys = payload.diffs.map((diff) => makeDiffKey(domain, diff));
  }
  const removed = removeIgnoredDiffs(domain, keys);
  sendJson(res, 200, {
    ok: true,
    domain,
    removed,
    count: listIgnoredByDomain(domain).length
  });
}

async function handlePatch(res, payload) {
  const gate = ensureDomainFeatureOrRespond(res, payload.domain, 'patch');
  if (!gate.ok) return;
  const dryRun = Boolean(payload.dryRun);
  const parts = parseCsv(payload.parts);
  const outputs = [];

  if (Array.isArray(payload.rows) && payload.rows.length > 0) {
    const grouped = groupRowsByLang(payload.rows);
    for (const [lang, indexSet] of grouped.entries()) {
      const indexes = [...indexSet].sort((a, b) => a - b);
      if (indexes.length === 0) continue;
      const args = [PATCH_SCRIPT_REL, 'patch', '--nums', indexes.join(','), '--langs', lang, '--no-report'];
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
      args = buildPatchArgsFromFilter(payload, dryRun);
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

async function handleAddCharacter(res, payload) {
  const gate = ensureDomainFeatureOrRespond(res, payload.domain, 'create');
  if (!gate.ok) return;
  try {
    const result = addCharacter(payload);
    sendJson(res, 200, {
      ok: true,
      domain: gate.domain,
      result
    });
  } catch (error) {
    sendJson(res, 400, {
      ok: false,
      error: error.message
    });
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
  const { pathname } = urlObj;

  if (pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/capabilities' && req.method === 'GET') {
    sendJson(res, 200, {
      ok: true,
      defaultDomain: DEFAULT_DOMAIN,
      domains: DOMAIN_CAPABILITIES
    });
    return;
  }

  if (pathname === '/api/ignored' && req.method === 'GET') {
    await handleIgnoredList(req, res, urlObj);
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

  if (pathname === '/api/add-character' && req.method === 'POST') {
    const body = await readBody(req);
    await handleAddCharacter(res, body);
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

  ensureDir(path.join(PROJECT_ROOT, 'scripts', 'reports'));
  const port = parsePort(process.argv);
  const host = '127.0.0.1';

  const server = http.createServer((req, res) => {
    requestHandler(req, res).catch((error) => {
      sendJson(res, 500, { ok: false, error: error.message });
    });
  });

  server.listen(port, host, () => {
    log(`Patch Console running at http://${host}:${port}`);
    log(`Using patch script: ${PATCH_SCRIPT_REL}`);
    log(`Default report: ${DEFAULT_REPORT_REL.replace(/\\/g, '/')}`);
  });
}

main();
