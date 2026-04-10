#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { clone, isPlainObject, parseCsv, parseRangeSet } from './lib/patch-console-shared.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..', '..');

const EXTERNAL_WEAPON_ROOT = path.join(PROJECT_ROOT, 'data', 'external', 'weapon');
const LOCAL_WONDER_FILE = path.join(PROJECT_ROOT, 'data', 'kr', 'wonder', 'weapons.js');
const DEFAULT_REPORT_JSON_FILE = path.join(PROJECT_ROOT, 'scripts', 'reports', 'wonder-weapon-patch-diff.json');

const SUPPORTED_LANGS = ['kr', 'en', 'jp', 'cn'];
const SUPPORTED_PARTS = ['name', 'effect'];
const SUPPORTED_TIERS = ['fiveStar'];
const PATCHABLE_NAME_LANGS = new Set(['en', 'jp', 'cn']);
const NAME_FIELD_BY_LANG = {
  en: 'name_en',
  jp: 'name_jp',
  cn: 'name_cn'
};
const EFFECT_FIELD_BY_LANG = {
  kr: 'effect',
  en: 'effect_en',
  jp: 'effect_jp',
  cn: 'effect_cn'
};
const IANT_BASE_URL = 'https://iant.kr:5000';
const IANT_SOURCE_SERVERS = new Set(['kr', 'en', 'jp', 'cn', 'tw', 'sea']);
const wonderSourceCache = new Map();

function log(message) {
  process.stdout.write(`${message}\n`);
}

function warn(message) {
  process.stderr.write(`${message}\n`);
}

function fail(message) {
  warn(`[error] ${message}`);
  process.exit(1);
}

function usage() {
  log(`Usage:
  node apps/patch-console/patch-wonder-weapon.mjs list [--langs kr,en,jp,cn] [--nums 1,3-5] [--api text] [--local text]
  node apps/patch-console/patch-wonder-weapon.mjs report-json [--langs kr,en,jp,cn] [--all|--nums ...|--api ...|--local ...] [--parts name,effect] [--source-type external|iant] [--source-server kr|en|jp|cn|tw|sea] [--source-is-prod <value>] [--json-file scripts/reports/wonder-weapon-patch-diff.json]
  node apps/patch-console/patch-wonder-weapon.mjs patch [--langs kr,en,jp,cn] [--all|--nums ...|--api ...|--local ...] [--parts name,effect] [--source-type external|iant] [--source-server kr|en|jp|cn|tw|sea] [--source-is-prod <value>] [--dry-run] [--no-report]
  node apps/patch-console/patch-wonder-weapon.mjs apply-diff-json --input-file scripts/reports/apply-diff-request.json [--source-type external|iant] [--source-server kr|en|jp|cn|tw|sea] [--source-is-prod <value>] [--dry-run]
  node apps/patch-console/patch-wonder-weapon.mjs help
`);
}

function parseCli(argv) {
  const command = String(argv[2] || 'help').trim();
  const raw = argv.slice(3);
  const args = {};
  for (let i = 0; i < raw.length; i += 1) {
    const token = String(raw[i] || '');
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = raw[i + 1];
    if (next != null && !String(next).startsWith('--')) {
      args[key] = String(next);
      i += 1;
    } else {
      args[key] = true;
    }
  }
  return { command, args };
}

function parseLangs(input) {
  const requested = parseCsv(input || SUPPORTED_LANGS.join(',')).map((x) => x.toLowerCase());
  const langs = requested.filter((lang) => SUPPORTED_LANGS.includes(lang));
  return langs.length > 0 ? langs : [...SUPPORTED_LANGS];
}

function parseParts(input) {
  const requested = parseCsv(input || SUPPORTED_PARTS.join(',')).map((x) => x.toLowerCase());
  const picked = SUPPORTED_PARTS.filter((part) => requested.includes(part));
  return picked.length > 0 ? picked : [...SUPPORTED_PARTS];
}

function parseScope(args) {
  if (args.nums) return { mode: 'nums', value: String(args.nums) };
  if (args.api) return { mode: 'api', value: String(args.api) };
  if (args.local) return { mode: 'local', value: String(args.local) };
  return { mode: 'all', value: '' };
}

function normalizeSourceType(value) {
  return String(value || 'external').trim().toLowerCase() === 'iant' ? 'iant' : 'external';
}

function normalizeIantIsProdValue(value, fallback = 'false') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function parseSourceConfig(args = {}) {
  const type = normalizeSourceType(args['source-type'] || 'external');
  if (type === 'external') {
    return { type: 'external', server: null, isProdValue: '' };
  }
  const server = String(args['source-server'] || '').trim().toLowerCase();
  if (!IANT_SOURCE_SERVERS.has(server)) {
    throw new Error(`source-server is required for iant source. Allowed: ${[...IANT_SOURCE_SERVERS].join(', ')}`);
  }
  return {
    type: 'iant',
    server,
    isProdValue: normalizeIantIsProdValue(args['source-is-prod'], 'false')
  };
}

function cloneSourceConfig(source = {}, overrides = {}) {
  const type = normalizeSourceType(overrides.type ?? source.type);
  if (type !== 'iant') {
    return { type: 'external', server: null, isProdValue: '' };
  }
  return {
    type: 'iant',
    server: String(overrides.server ?? source.server ?? '').trim().toLowerCase(),
    isProdValue: normalizeIantIsProdValue(overrides.isProdValue ?? source.isProdValue ?? source.isProd, 'false')
  };
}

function ensureFetchAvailable() {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available in this Node runtime.');
  }
}

function buildIantWonderUrl(server, isProdValue) {
  const url = new URL(`${IANT_BASE_URL}/data/weapon/${server}/wonder`);
  url.searchParams.set('is_prod', normalizeIantIsProdValue(isProdValue, 'false'));
  return url.toString();
}

function normalizeName(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\uCA8C/g, '\u00B7')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeEffect(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .trim();
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
  } catch (error) {
    warn(`[warn] failed to parse json: ${path.relative(PROJECT_ROOT, filePath)} (${error.message})`);
    return null;
  }
}

function flattenWonderEntries(payload) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const data = source.data && typeof source.data === 'object' ? source.data : {};
  const out = [];
  for (const tier of SUPPORTED_TIERS) {
    const list = Array.isArray(data[tier]) ? data[tier] : [];
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];
      out.push({
        index: out.length + 1,
        tier,
        tierIndex: i + 1,
        quality: Number.isFinite(Number(item?.quality)) ? Number(item.quality) : null,
        name: normalizeName(item?.name),
        skill: normalizeEffect(item?.skill),
        stat: isPlainObject(item?.stat) ? clone(item.stat) : null
      });
    }
  }
  return out;
}

function loadExternalByLang() {
  const out = {};
  for (const lang of SUPPORTED_LANGS) {
    const filePath = path.join(EXTERNAL_WEAPON_ROOT, lang, 'wonder.json');
    const json = readJson(filePath);
    if (!json) {
      out[lang] = {
        ok: false,
        reason: 'missing_or_invalid',
        entries: [],
        byTier: {
          fiveStar: []
        }
      };
      continue;
    }
    const entries = flattenWonderEntries(json);
    const byTier = {
      fiveStar: entries.filter((item) => item.tier === 'fiveStar')
    };
    out[lang] = {
      ok: entries.length > 0,
      reason: entries.length > 0 ? null : 'empty',
      entries,
      byTier
    };
  }
  return out;
}

function loadExternalWonderByLang(lang) {
  const filePath = path.join(EXTERNAL_WEAPON_ROOT, lang, 'wonder.json');
  const json = readJson(filePath);
  if (!json) {
    return {
      ok: false,
      reason: 'missing_or_invalid',
      filePath,
      entries: [],
      byTier: { fiveStar: [] }
    };
  }
  const entries = flattenWonderEntries(json);
  return {
    ok: entries.length > 0,
    reason: entries.length > 0 ? 'ok' : 'empty',
    filePath,
    entries,
    byTier: {
      fiveStar: entries.filter((item) => item.tier === 'fiveStar')
    }
  };
}

async function readIantWonder(server, isProdValue) {
  const normalized = normalizeIantIsProdValue(isProdValue, 'false');
  const cacheKey = `wonder:${server}:${normalized}`;
  if (wonderSourceCache.has(cacheKey)) return wonderSourceCache.get(cacheKey);

  ensureFetchAvailable();
  const url = buildIantWonderUrl(server, normalized);
  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (error) {
    const payload = {
      ok: false,
      reason: `network_error:${error.message}`,
      filePath: url,
      entries: [],
      byTier: { fiveStar: [] },
      json: null,
      statusCode: 0
    };
    wonderSourceCache.set(cacheKey, payload);
    return payload;
  }

  let raw = '';
  try {
    raw = await response.text();
  } catch (error) {
    const payload = {
      ok: false,
      reason: `read_error:${error.message}`,
      filePath: url,
      entries: [],
      byTier: { fiveStar: [] },
      json: null,
      statusCode: response.status
    };
    wonderSourceCache.set(cacheKey, payload);
    return payload;
  }

  if (!response.ok) {
    const payload = {
      ok: false,
      reason: `http_${response.status}`,
      filePath: url,
      entries: [],
      byTier: { fiveStar: [] },
      json: null,
      statusCode: response.status,
      raw
    };
    wonderSourceCache.set(cacheKey, payload);
    return payload;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalizedJson = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? ((parsed.status === 0 && parsed.data) ? parsed : { status: 0, data: parsed })
      : null;
    if (!normalizedJson?.data) {
      const payload = {
        ok: false,
        reason: 'invalid_payload',
        filePath: url,
        entries: [],
        byTier: { fiveStar: [] },
        json: parsed,
        statusCode: response.status
      };
      wonderSourceCache.set(cacheKey, payload);
      return payload;
    }
    const entries = flattenWonderEntries(normalizedJson);
    const payload = {
      ok: entries.length > 0,
      reason: entries.length > 0 ? 'ok' : 'empty',
      filePath: url,
      json: normalizedJson,
      statusCode: response.status,
      entries,
      byTier: {
        fiveStar: entries.filter((item) => item.tier === 'fiveStar')
      }
    };
    wonderSourceCache.set(cacheKey, payload);
    return payload;
  } catch (error) {
    const payload = {
      ok: false,
      reason: `parse_error:${error.message}`,
      filePath: url,
      entries: [],
      byTier: { fiveStar: [] },
      json: null,
      statusCode: response.status,
      raw
    };
    wonderSourceCache.set(cacheKey, payload);
    return payload;
  }
}

async function loadCompareSourceByLang(sourceConfig, langs) {
  const out = {};
  const normalized = cloneSourceConfig(sourceConfig);
  for (const lang of langs) {
    if (normalized.type === 'iant') {
      out[lang] = await readIantWonder(normalized.server, normalized.isProdValue);
    } else {
      out[lang] = loadExternalWonderByLang(lang);
    }
  }
  return out;
}

function describeSourceMeta(meta) {
  if (!meta) return 'unknown';
  if (meta.ok) return meta.filePath || 'ok';
  return `${meta.filePath || '(unknown)'} (${meta.reason || 'unknown'})`;
}

function loadLocalWonderData() {
  if (!fs.existsSync(LOCAL_WONDER_FILE)) {
    throw new Error(`missing local wonder file: ${path.relative(PROJECT_ROOT, LOCAL_WONDER_FILE)}`);
  }
  const code = fs.readFileSync(LOCAL_WONDER_FILE, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { timeout: 5000 });

  const optionsRaw = typeof sandbox.getWonderWeaponOptions === 'function'
    ? sandbox.getWonderWeaponOptions()
    : [];
  const options = Array.isArray(optionsRaw)
    ? optionsRaw.map((name) => normalizeName(name)).filter(Boolean)
    : [];

  const mapRaw = sandbox.window && isPlainObject(sandbox.window.matchWeapons)
    ? sandbox.window.matchWeapons
    : {};
  const matchWeapons = clone(mapRaw) || {};
  return { options, matchWeapons };
}

function buildRowsFromContext(localData, externalByLang) {
  const krSource = externalByLang.kr;
  if (!krSource || !krSource.ok || !Array.isArray(krSource.entries) || krSource.entries.length === 0) {
    throw new Error('external wonder data for kr is missing or empty');
  }

  const localKeyByNorm = new Map();
  for (const key of Object.keys(localData.matchWeapons || {})) {
    const normalized = normalizeName(key);
    if (!normalized || localKeyByNorm.has(normalized)) continue;
    localKeyByNorm.set(normalized, key);
  }

  const rows = [];
  for (let i = 0; i < krSource.entries.length; i += 1) {
    const krEntry = krSource.entries[i];
    const krName = normalizeName(krEntry?.name);
    if (!krName) continue;

    const localKey = localKeyByNorm.get(krName) || null;
    const tier = krEntry.tier;
    const tierIndex = Number(krEntry.tierIndex || 0);
    const enEntry = externalByLang.en?.byTier?.[tier]?.[Math.max(tierIndex - 1, 0)] || null;
    const jpEntry = externalByLang.jp?.byTier?.[tier]?.[Math.max(tierIndex - 1, 0)] || null;
    const cnEntry = externalByLang.cn?.byTier?.[tier]?.[Math.max(tierIndex - 1, 0)] || null;
    const apiName = normalizeName(enEntry?.name) || normalizeName(jpEntry?.name) || krName;

    rows.push({
      index: i + 1,
      api: apiName,
      local: krName,
      key: localKey || krName,
      anchorKrName: krName,
      localKey,
      tier: krEntry.tier,
      tierIndex,
      externalByLang: {
        kr: krEntry,
        en: enEntry,
        jp: jpEntry,
        cn: cnEntry
      },
      status: {
        kr: krEntry ? 'Y' : 'N',
        en: enEntry ? 'Y' : 'N',
        jp: jpEntry ? 'Y' : 'N',
        cn: cnEntry ? 'Y' : 'N'
      }
    });
  }
  return rows;
}

function loadContext() {
  const localData = loadLocalWonderData();
  const externalByLang = loadExternalByLang();
  const rows = buildRowsFromContext(localData, externalByLang);
  return { localData, externalByLang, rows };
}

function matchesScope(row, scope) {
  if (scope.mode === 'all') return true;
  if (scope.mode === 'nums') {
    const nums = parseRangeSet(scope.value);
    if (nums.size === 0) return true;
    return nums.has(Number(row.index));
  }
  if (scope.mode === 'api') {
    const tokens = parseCsv(scope.value).map((x) => x.toLowerCase());
    if (tokens.length === 0) return true;
    const source = `${row.index} ${row.api}`.toLowerCase();
    return tokens.some((token) => source.includes(token));
  }
  if (scope.mode === 'local') {
    const tokens = parseCsv(scope.value).map((x) => x.toLowerCase());
    if (tokens.length === 0) return true;
    const source = `${row.local} ${row.key}`.toLowerCase();
    return tokens.some((token) => source.includes(token));
  }
  return true;
}

function buildPartDiff({ row, lang, part, localData, compareByLang }) {
  const sourceMeta = compareByLang?.[lang];
  const external = sourceMeta?.byTier?.[row.tier]?.[Math.max(Number(row.tierIndex || 1) - 1, 0)] || null;
  if (!external) {
    return { part, reason: 'source_missing', diffCount: 0, samplePaths: [], valueDiffs: [] };
  }

  const localKey = row.localKey || row.anchorKrName;
  if (!localKey) {
    return { part, reason: 'key_missing', diffCount: 0, samplePaths: [], valueDiffs: [] };
  }

  const localEntry = isPlainObject(localData.matchWeapons?.[localKey]) ? localData.matchWeapons[localKey] : null;
  const valueDiffs = [];

  if (part === 'name') {
    if (!PATCHABLE_NAME_LANGS.has(lang)) {
      return { part, reason: 'unsupported_lang', diffCount: 0, samplePaths: [], valueDiffs: [] };
    }
    const field = NAME_FIELD_BY_LANG[lang];
    const after = normalizeName(external.name);
    if (!after) return { part, reason: 'empty_external', diffCount: 0, samplePaths: [], valueDiffs: [] };
    const before = localEntry && Object.prototype.hasOwnProperty.call(localEntry, field) ? localEntry[field] : null;
    if (String(before ?? '') !== String(after ?? '')) {
      valueDiffs.push({
        path: field,
        before: before ?? null,
        after
      });
    }
  } else if (part === 'effect') {
    const field = EFFECT_FIELD_BY_LANG[lang];
    const after = normalizeEffect(external.skill);
    if (!after) return { part, reason: 'empty_external', diffCount: 0, samplePaths: [], valueDiffs: [] };
    const before = localEntry && Object.prototype.hasOwnProperty.call(localEntry, field) ? localEntry[field] : null;
    if (String(before ?? '') !== String(after ?? '')) {
      valueDiffs.push({
        path: field,
        before: before ?? null,
        after
      });
    }
  }

  if (valueDiffs.length === 0) {
    return { part, reason: 'no_change', diffCount: 0, samplePaths: [], valueDiffs: [] };
  }

  return {
    part,
    reason: null,
    diffCount: valueDiffs.length,
    samplePaths: valueDiffs.map((item) => item.path),
    valueDiffs,
    localKey
  };
}

function collectReportRows({ rows, langs, parts, scope, localData, compareByLang, sourceConfig }) {
  const out = [];
  for (const row of rows) {
    if (!matchesScope(row, scope)) continue;
    for (const lang of langs) {
      const partDiffs = [];
      for (const part of parts) {
        const diff = buildPartDiff({ row, lang, part, localData, compareByLang });
        if (Array.isArray(diff.valueDiffs) && diff.valueDiffs.length > 0) {
          partDiffs.push({
            part: diff.part,
            diffCount: diff.diffCount,
            samplePaths: diff.samplePaths,
            valueDiffs: diff.valueDiffs
          });
        }
      }
      if (partDiffs.length === 0) continue;
      out.push({
        index: row.index,
        api: row.api,
        local: row.local,
        key: row.localKey || row.anchorKrName || row.key,
        lang,
        source: cloneSourceConfig(sourceConfig),
        partDiffs
      });
    }
  }
  return out;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function ensureWonderEntry(localData, keyName) {
  if (!keyName) return null;
  if (!isPlainObject(localData.matchWeapons[keyName])) {
    localData.matchWeapons[keyName] = {};
  }
  if (!localData.options.includes(keyName)) {
    localData.options.push(keyName);
  }
  return localData.matchWeapons[keyName];
}

function applyPartsToRowLang({ row, lang, parts, localData, compareByLang, selectedPathsByPart = null }) {
  const changedParts = [];
  const skippedParts = [];
  let changedPaths = 0;

  for (const part of parts) {
    const diff = buildPartDiff({ row, lang, part, localData, compareByLang });
    if (!Array.isArray(diff.valueDiffs) || diff.valueDiffs.length === 0) {
      skippedParts.push(`${part}:${diff.reason || 'no_change'}`);
      continue;
    }

    let selectedDiffs = diff.valueDiffs;
    if (selectedPathsByPart instanceof Map) {
      const wanted = selectedPathsByPart.get(part);
      if (!wanted || wanted.size === 0) {
        skippedParts.push(`${part}:no_paths`);
        continue;
      }
      selectedDiffs = diff.valueDiffs.filter((item) => wanted.has(String(item.path || '').trim()));
      if (selectedDiffs.length === 0) {
        skippedParts.push(`${part}:no_selected_change`);
        continue;
      }
    }

    const localKey = row.localKey || row.anchorKrName || diff.localKey || row.key;
    const entry = ensureWonderEntry(localData, localKey);
    if (!entry) {
      skippedParts.push(`${part}:key_missing`);
      continue;
    }

    row.localKey = localKey;
    row.key = localKey;

    for (const item of selectedDiffs) {
      entry[item.path] = clone(item.after);
    }

    changedPaths += selectedDiffs.length;
    if (!changedParts.includes(part)) changedParts.push(part);
  }

  return { changedParts, changedPaths, skippedParts };
}

function orderedWonderKeys(localData) {
  const map = localData.matchWeapons || {};
  const options = Array.isArray(localData.options) ? localData.options.map((x) => normalizeName(x)).filter(Boolean) : [];

  const dedup = [];
  const seen = new Set();
  for (const key of options) {
    if (seen.has(key)) continue;
    if (!Object.prototype.hasOwnProperty.call(map, key)) continue;
    seen.add(key);
    dedup.push(key);
  }

  for (const key of Object.keys(map)) {
    if (seen.has(key)) continue;
    seen.add(key);
    dedup.push(key);
  }
  return dedup;
}

function buildWonderFileContent(localData) {
  const orderedKeys = orderedWonderKeys(localData);
  const orderedMap = {};
  for (const key of orderedKeys) {
    orderedMap[key] = localData.matchWeapons[key];
  }

  const optionsJson = JSON.stringify(orderedKeys, null, 2).replace(/\n/g, '\n  ');
  const mapJson = JSON.stringify(orderedMap, null, 2);

  return `function getWonderWeaponOptions() {\n  return ${optionsJson};\n}\n\nwindow.matchWeapons = ${mapJson};\n`;
}

function writeWonderFile(localData) {
  ensureDir(path.dirname(LOCAL_WONDER_FILE));
  const content = buildWonderFileContent(localData);
  fs.writeFileSync(LOCAL_WONDER_FILE, content, 'utf8');
}

function cleanCell(value) {
  return String(value || '').replace(/\|/g, '/');
}

function runList(args) {
  const { rows } = loadContext();
  const langs = parseLangs(args.langs);
  const scope = parseScope(args);
  const filtered = rows.filter((row) => matchesScope(row, scope));
  for (const row of filtered) {
    const statusText = langs.map((lang) => `${lang}:${row.status?.[lang] || 'N'}`).join(' ');
    const cols = [
      String(row.index),
      cleanCell(row.api),
      cleanCell(row.local),
      cleanCell(row.key),
      statusText
    ];
    log(`${cols[0]} | ${cols[1]} | ${cols[2]} | ${cols[3]} | ${cols[4]}`);
  }
}

async function validateIantSources({ langs, sourceConfig }) {
  if (sourceConfig?.type !== 'iant') return;
  const compareByLang = await loadCompareSourceByLang(sourceConfig, langs);
  const issues = [];
  for (const lang of langs) {
    const meta = compareByLang[lang];
    if (!meta?.ok) {
      issues.push(`${sourceConfig.server}->${lang}: ${describeSourceMeta(meta)}`);
    }
  }
  if (issues.length > 0) {
    fail([
      `IANT source fetch failed for server='${sourceConfig.server}'.`,
      ...issues.map((line) => `- ${line}`)
    ].join('\n'));
  }
}

async function runReportJson(args) {
  const { localData, rows } = loadContext();
  const langs = parseLangs(args.langs);
  const parts = parseParts(args.parts);
  const scope = parseScope(args);
  const sourceConfig = parseSourceConfig(args);
  await validateIantSources({ langs, sourceConfig });
  const compareByLang = await loadCompareSourceByLang(sourceConfig, langs);
  const reportRows = collectReportRows({
    rows,
    langs,
    parts,
    scope,
    localData,
    compareByLang,
    sourceConfig
  });

  const jsonFile = path.resolve(PROJECT_ROOT, String(args['json-file'] || DEFAULT_REPORT_JSON_FILE));
  ensureDir(path.dirname(jsonFile));
  fs.writeFileSync(jsonFile, `${JSON.stringify({ rows: reportRows, source: cloneSourceConfig(sourceConfig) }, null, 2)}\n`, 'utf8');
  log(`[report-json] wrote: ${path.relative(PROJECT_ROOT, jsonFile)} (${reportRows.length} rows)`);
}

async function runPatch(args) {
  const { localData, rows } = loadContext();
  const langs = parseLangs(args.langs);
  const parts = parseParts(args.parts);
  const scope = parseScope(args);
  const dryRun = Boolean(args['dry-run']);
  const sourceConfig = parseSourceConfig(args);
  await validateIantSources({ langs, sourceConfig });
  const compareByLang = await loadCompareSourceByLang(sourceConfig, langs);

  const targets = rows.filter((row) => matchesScope(row, scope));
  let changedRows = 0;
  let changedPartsTotal = 0;
  let changedPathsTotal = 0;

  for (const row of targets) {
    for (const lang of langs) {
      const applied = applyPartsToRowLang({
        row,
        lang,
        parts,
        localData,
        compareByLang
      });

      if (applied.changedPaths === 0) {
        const skipped = applied.skippedParts.length > 0 ? applied.skippedParts.join(',') : '-';
        log(`[patch] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[] skipped=[${skipped}]`);
        continue;
      }

      changedRows += 1;
      changedPartsTotal += applied.changedParts.length;
      changedPathsTotal += applied.changedPaths;
      log(`[patch] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[${applied.changedParts.join(',')}] paths=${applied.changedPaths} dry_run=${dryRun ? 'Y' : 'N'}`);
    }
  }

  if (!dryRun && changedPathsTotal > 0) {
    writeWonderFile(localData);
  }

  log(`[patch] summary: rows=${changedRows} changed_parts=${changedPartsTotal} changed_paths=${changedPathsTotal} dry_run=${dryRun ? 'Y' : 'N'}`);
}

async function runApplyDiffJson(args) {
  const inputRel = String(args['input-file'] || '').trim();
  if (!inputRel) fail("apply-diff-json requires '--input-file'");

  const inputFile = path.resolve(PROJECT_ROOT, inputRel);
  if (!fs.existsSync(inputFile)) fail(`input file not found: ${inputRel}`);

  const input = readJson(inputFile);
  if (!input || !Array.isArray(input.tasks)) {
    fail(`invalid input json format: ${inputRel}`);
  }

  const dryRun = Boolean(args['dry-run']);
  const { localData, rows } = loadContext();
  const sourceConfig = input?.source
    ? parseSourceConfig({
        'source-type': input.source.type,
        'source-server': input.source.server,
        'source-is-prod': input.source.isProdValue ?? input.source.isProd
      })
    : parseSourceConfig(args);
  const langs = [...new Set(
    input.tasks
      .map((task) => String(task?.lang || '').trim().toLowerCase())
      .filter((lang) => SUPPORTED_LANGS.includes(lang))
  )];
  await validateIantSources({ langs, sourceConfig });
  const compareByLang = await loadCompareSourceByLang(sourceConfig, langs);
  const byIndex = new Map(rows.map((row) => [Number(row.index), row]));

  let changedRows = 0;
  let changedPartsTotal = 0;
  let changedPathsTotal = 0;

  for (const task of input.tasks) {
    const index = Number(task?.index);
    const lang = String(task?.lang || '').trim().toLowerCase();
    if (!Number.isInteger(index) || !SUPPORTED_LANGS.includes(lang)) continue;

    const row = byIndex.get(index);
    if (!row) {
      warn(`[apply-diff-json] skip #${index} lang=${lang}: row not found`);
      continue;
    }

    const selectedPathsByPart = new Map();
    for (const partSpec of Array.isArray(task?.parts) ? task.parts : []) {
      const part = String(partSpec?.part || '').trim().toLowerCase();
      if (!SUPPORTED_PARTS.includes(part)) continue;
      const paths = new Set(
        (Array.isArray(partSpec?.paths) ? partSpec.paths : [])
          .map((item) => String(item || '').trim())
          .filter(Boolean)
      );
      if (paths.size === 0) continue;
      selectedPathsByPart.set(part, paths);
    }

    if (selectedPathsByPart.size === 0) {
      warn(`[apply-diff-json] skip #${index} ${row.api}/${row.local} (${row.key}) lang=${lang}: no valid paths`);
      continue;
    }

    const parts = [...selectedPathsByPart.keys()];
    const applied = applyPartsToRowLang({
      row,
      lang,
      parts,
      localData,
      compareByLang,
      selectedPathsByPart
    });

    if (applied.changedPaths === 0) {
      log(`[apply-diff-json] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[] skipped=[${applied.skippedParts.join(',')}]`);
      continue;
    }

    changedRows += 1;
    changedPartsTotal += applied.changedParts.length;
    changedPathsTotal += applied.changedPaths;

    const skipped = parts.filter((part) => !applied.changedParts.includes(part)).join(',');
    log(`[apply-diff-json] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[${applied.changedParts.join(',')}] skipped=[${skipped}]`);
  }

  if (!dryRun && changedPathsTotal > 0) {
    writeWonderFile(localData);
  }

  log(`[apply-diff-json] summary: rows=${changedRows} changed_parts=${changedPartsTotal} changed_paths=${changedPathsTotal} dry_run=${dryRun ? 'Y' : 'N'}`);
}

async function main() {
  const options = parseCli(process.argv);
  const command = options.command;

  if (!['help', 'list', 'report-json', 'patch', 'apply-diff-json'].includes(command)) {
    usage();
    fail(`unknown command: ${command}`);
  }

  if (command === 'help') {
    usage();
    return;
  }

  try {
    if (command === 'list') {
      runList(options.args);
      return;
    }
    if (command === 'report-json') {
      await runReportJson(options.args);
      return;
    }
    if (command === 'patch') {
      await runPatch(options.args);
      return;
    }
    if (command === 'apply-diff-json') {
      await runApplyDiffJson(options.args);
    }
  } catch (error) {
    fail(error?.message || String(error));
  }
}

main().catch((error) => {
  fail(error?.message || String(error));
});
