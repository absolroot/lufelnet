#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..', '..');

const EXTERNAL_PERSONA_DIR = path.join(PROJECT_ROOT, 'data', 'external', 'persona');
const LOCAL_PERSONA_DIR = path.join(PROJECT_ROOT, 'data', 'persona');
const LOCAL_PERSONA_NONORDER_DIR = path.join(LOCAL_PERSONA_DIR, 'nonorder');
const ORDER_FILE = path.join(LOCAL_PERSONA_DIR, 'order.js');
const MAPPING_FILE = path.join(EXTERNAL_PERSONA_DIR, 'mapping.json');

const DEFAULT_REPORT_JSON_FILE = path.join(PROJECT_ROOT, 'scripts', 'reports', 'persona-patch-diff.json');

const SUPPORTED_LANGS = ['kr', 'en', 'jp'];
const SUPPORTED_PARTS = ['profile', 'innate_skill', 'passive_skill', 'uniqueSkill', 'highlight'];

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
  node apps/patch-console/patch-persona.mjs list [--langs kr,en,jp] [--nums 101,120-130] [--api TEXT] [--local ordered|nonorder|missing]
  node apps/patch-console/patch-persona.mjs report-json [--langs kr,en,jp] [--all|--nums ...|--api ...|--local ...] [--parts profile,innate_skill] [--json-file scripts/reports/persona-patch-diff.json]
  node apps/patch-console/patch-persona.mjs patch [--langs kr,en,jp] [--all|--nums ...|--api ...|--local ...] [--parts ...] [--dry-run] [--no-report]
  node apps/patch-console/patch-persona.mjs apply-diff-json --input-file scripts/reports/apply-diff-request.json [--dry-run]
  node apps/patch-console/patch-persona.mjs help
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

function clone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
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

function equals(a, b) {
  return stableStringify(a) === stableStringify(b);
}

function diffPaths(a, b, prefix = '') {
  if (equals(a, b)) return [];

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return [prefix || '<root>'];
    const max = Math.max(a.length, b.length);
    const out = [];
    for (let i = 0; i < max; i += 1) {
      const nextPrefix = `${prefix}[${i}]`;
      out.push(...diffPaths(a[i], b[i], nextPrefix));
    }
    return out;
  }

  if (isPlainObject(a) || isPlainObject(b)) {
    if (!isPlainObject(a) || !isPlainObject(b)) return [prefix || '<root>'];
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const out = [];
    for (const key of [...keys].sort()) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      out.push(...diffPaths(a[key], b[key], nextPrefix));
    }
    return out;
  }

  return [prefix || '<root>'];
}

function tokenizeDiffPath(pathText) {
  const text = String(pathText || '').trim();
  if (!text || text === '<root>') return [];
  const tokens = [];
  let buffer = '';
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '.') {
      if (buffer) {
        tokens.push({ type: 'prop', key: buffer });
        buffer = '';
      }
      i += 1;
      continue;
    }
    if (ch === '[') {
      if (buffer) {
        tokens.push({ type: 'prop', key: buffer });
        buffer = '';
      }
      const close = text.indexOf(']', i + 1);
      if (close < 0) break;
      const rawIndex = text.slice(i + 1, close).trim();
      const index = Number(rawIndex);
      if (Number.isInteger(index)) tokens.push({ type: 'index', index });
      i = close + 1;
      continue;
    }
    buffer += ch;
    i += 1;
  }
  if (buffer) tokens.push({ type: 'prop', key: buffer });
  return tokens;
}

function getValueAtDiffPath(root, pathText) {
  const tokens = tokenizeDiffPath(pathText);
  let current = root;
  for (const token of tokens) {
    if (current === undefined || current === null) return undefined;
    if (token.type === 'prop') {
      current = current[token.key];
      continue;
    }
    if (!Array.isArray(current)) return undefined;
    current = current[token.index];
  }
  return current;
}

function setValueAtDiffPath(root, pathText, nextValue) {
  const tokens = tokenizeDiffPath(pathText);
  if (tokens.length === 0) {
    return clone(nextValue);
  }

  let out = clone(root);
  if (tokens[0].type === 'index') {
    if (!Array.isArray(out)) out = [];
  } else if (!isPlainObject(out) && !Array.isArray(out)) {
    out = {};
  }

  let cur = out;
  let parent = null;
  let parentToken = null;

  const replaceCurrent = (replacement) => {
    if (!parent) {
      out = replacement;
      cur = replacement;
      return;
    }
    if (parentToken.type === 'prop') {
      parent[parentToken.key] = replacement;
    } else {
      while (parent.length <= parentToken.index) parent.push(undefined);
      parent[parentToken.index] = replacement;
    }
    cur = replacement;
  };

  for (let i = 0; i < tokens.length - 1; i += 1) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];

    if (token.type === 'prop') {
      if (!isPlainObject(cur) && !Array.isArray(cur)) {
        replaceCurrent({});
      }

      let child = cur[token.key];
      if (nextToken.type === 'index') {
        if (!Array.isArray(child)) child = [];
      } else if (!isPlainObject(child)) {
        child = {};
      }

      cur[token.key] = child;
      parent = cur;
      parentToken = token;
      cur = child;
      continue;
    }

    if (!Array.isArray(cur)) {
      replaceCurrent([]);
    }

    while (cur.length <= token.index) cur.push(undefined);
    let child = cur[token.index];
    if (nextToken.type === 'index') {
      if (!Array.isArray(child)) child = [];
    } else if (!isPlainObject(child)) {
      child = {};
    }

    cur[token.index] = child;
    parent = cur;
    parentToken = token;
    cur = child;
  }

  const tail = tokens[tokens.length - 1];
  if (tail.type === 'prop') {
    if (!isPlainObject(cur) && !Array.isArray(cur)) {
      replaceCurrent({});
    }
    cur[tail.key] = clone(nextValue);
  } else {
    if (!Array.isArray(cur)) {
      replaceCurrent([]);
    }
    while (cur.length <= tail.index) cur.push(undefined);
    cur[tail.index] = clone(nextValue);
  }

  return out;
}

function mergePatch(base, patch) {
  if (patch === undefined) return clone(base);

  if (Array.isArray(patch)) {
    const out = Array.isArray(base) ? clone(base) : [];
    for (let i = 0; i < patch.length; i += 1) {
      if (patch[i] === undefined) continue;
      out[i] = mergePatch(out[i], patch[i]);
    }
    return out;
  }

  if (isPlainObject(patch)) {
    const out = isPlainObject(base) ? clone(base) : {};
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue;
      out[key] = mergePatch(out[key], value);
    }
    return out;
  }

  return clone(patch);
}

function parseCsv(value) {
  return String(value || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseLangs(input) {
  const requested = parseCsv(input || SUPPORTED_LANGS.join(',')).map((x) => x.toLowerCase());
  const langs = requested.filter((lang) => SUPPORTED_LANGS.includes(lang));
  return langs.length > 0 ? langs : [...SUPPORTED_LANGS];
}

function parseParts(input) {
  const requested = parseCsv(input || SUPPORTED_PARTS.join(','));
  const set = new Set(requested);
  const parts = SUPPORTED_PARTS.filter((part) => set.has(part));
  return parts.length > 0 ? parts : [...SUPPORTED_PARTS];
}

function parseNumsSelector(text) {
  const out = new Set();
  const chunks = parseCsv(text);
  for (const chunk of chunks) {
    const m = chunk.match(/^(\d+)-(\d+)$/);
    if (m) {
      const start = Number(m[1]);
      const end = Number(m[2]);
      if (Number.isInteger(start) && Number.isInteger(end) && start <= end) {
        for (let n = start; n <= end; n += 1) out.add(n);
      }
      continue;
    }
    const n = Number(chunk);
    if (Number.isInteger(n)) out.add(n);
  }
  return out;
}

function parseScope(args) {
  if (args.nums) return { mode: 'nums', value: String(args.nums) };
  if (args.api) return { mode: 'api', value: String(args.api) };
  if (args.local) return { mode: 'local', value: String(args.local) };
  return { mode: 'all', value: '' };
}

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
  } catch (error) {
    warn(`[warn] failed to parse json: ${filePath} (${error.message})`);
    return null;
  }
}

function loadOrderList() {
  if (!fs.existsSync(ORDER_FILE)) return [];
  const code = fs.readFileSync(ORDER_FILE, 'utf8');
  const sandbox = { window: { personaOrder: [] } };
  try {
    vm.runInNewContext(code, sandbox, { timeout: 3000 });
    return Array.isArray(sandbox.window?.personaOrder) ? sandbox.window.personaOrder : [];
  } catch (error) {
    warn(`[warn] failed to evaluate order.js: ${error.message}`);
    return [];
  }
}

function loadPersonaEntry(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: { personaFiles: {} } };
  try {
    vm.runInNewContext(code, sandbox, { timeout: 3000 });
    const table = sandbox.window?.personaFiles;
    if (!table || typeof table !== 'object') return null;
    const keys = Object.keys(table);
    if (keys.length === 0) return null;
    const first = keys[0];
    return {
      entryKey: first,
      data: clone(table[first]) || {}
    };
  } catch (error) {
    warn(`[warn] failed to evaluate persona file: ${filePath} (${error.message})`);
    return null;
  }
}

function writePersonaEntry(filePath, entryKey, data) {
  const content = `window.personaFiles = window.personaFiles || {};\nwindow.personaFiles[${JSON.stringify(entryKey)}] = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(filePath, content, 'utf8');
}

function resolveLocalPersona(nameKr) {
  const safeName = String(nameKr || '').trim();
  if (!safeName) {
    return { localType: 'missing', filePath: null };
  }
  const orderedPath = path.join(LOCAL_PERSONA_DIR, `${safeName}.js`);
  const nonorderPath = path.join(LOCAL_PERSONA_NONORDER_DIR, `${safeName}.js`);
  const orderedExists = fs.existsSync(orderedPath);
  const nonorderExists = fs.existsSync(nonorderPath);
  if (orderedExists) return { localType: 'ordered', filePath: orderedPath };
  if (nonorderExists) return { localType: 'nonorder', filePath: nonorderPath };
  return { localType: 'missing', filePath: null };
}

function hasExternal(lang, index) {
  const filePath = path.join(EXTERNAL_PERSONA_DIR, lang, `${index}.json`);
  return fs.existsSync(filePath);
}

function loadExternalPersonaByLang(index) {
  const out = {};
  for (const lang of SUPPORTED_LANGS) {
    const filePath = path.join(EXTERNAL_PERSONA_DIR, lang, `${index}.json`);
    out[lang] = loadJson(filePath);
  }
  return out;
}

function loadRows() {
  const mapping = loadJson(MAPPING_FILE);
  const orderList = loadOrderList();
  const orderSet = new Set(orderList.map((name) => String(name || '').trim()).filter(Boolean));
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
    return [];
  }

  const rows = [];
  for (const idText of Object.keys(mapping).sort((a, b) => Number(a) - Number(b))) {
    const index = Number(idText);
    if (!Number.isInteger(index)) continue;
    const mapData = mapping[idText] && typeof mapping[idText] === 'object' ? mapping[idText] : {};
    const key = String(mapData.name_kr || '').trim();
    const api = String(mapData.name_en || '').trim() || `persona-${index}`;
    const resolved = resolveLocalPersona(key);
    const localType = resolved.localType;
    const localByOrder = orderSet.has(key) ? 'ordered' : 'nonorder';
    const row = {
      index,
      api,
      local: localType === 'missing' ? 'missing' : localByOrder,
      key,
      status: {
        kr: hasExternal('kr', index) ? 'Y' : 'N',
        en: hasExternal('en', index) ? 'Y' : 'N',
        jp: hasExternal('jp', index) ? 'Y' : 'N'
      },
      mapData,
      localPath: resolved.filePath
    };
    rows.push(row);
  }
  return rows;
}

function matchesScope(row, scope) {
  if (scope.mode === 'all') return true;
  if (scope.mode === 'nums') {
    const nums = parseNumsSelector(scope.value);
    if (nums.size === 0) return true;
    return nums.has(Number(row.index));
  }
  if (scope.mode === 'api') {
    const tokens = parseCsv(scope.value).map((x) => x.toLowerCase());
    if (tokens.length === 0) return true;
    const source = `${row.api} ${row.index}`.toLowerCase();
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

function formatListLine(row, langs) {
  const statusText = langs
    .map((lang) => `${lang}:${String(row.status?.[lang] || 'N').toUpperCase()}`)
    .join(' ');
  const cols = [
    String(row.index),
    String(row.api || '').replace(/\|/g, '/'),
    String(row.local || '').replace(/\|/g, '/'),
    String(row.key || '').replace(/\|/g, '/'),
    statusText
  ];
  return `${cols[0]} | ${cols[1]} | ${cols[2]} | ${cols[3]} | ${cols[4]}`;
}

function keepDefinedFields(src) {
  if (!isPlainObject(src)) return src;
  const out = {};
  for (const [key, value] of Object.entries(src)) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}

function buildProfilePatch({ index, lang, mapData, localType, ext }) {
  const patch = {};
  patch.id = String(index);
  if (lang === 'kr') {
    const nameKr = String(mapData.name_kr || ext.kr?.name || '').trim();
    if (nameKr) {
      patch.key = nameKr;
      patch.name = nameKr;
    }
  }

  if (localType === 'nonorder') {
    if (lang === 'en') {
      patch.name_en = mapData.name_en || ext.en?.name;
    }
    if (lang === 'jp') {
      patch.name_jp = mapData.name_jp || ext.jp?.name;
    }
  }
  return keepDefinedFields(patch);
}

function buildInnatePatch({ lang, ext }) {
  const sourceKr = Array.isArray(ext.kr?.innate_skill) ? ext.kr.innate_skill : [];
  if (sourceKr.length === 0) return null;
  return sourceKr.map((krEntry, idx) => {
    const enEntry = ext.en?.innate_skill?.[idx];
    const jpEntry = ext.jp?.innate_skill?.[idx];
    if (lang === 'kr') {
      return keepDefinedFields({
        name: krEntry?.name,
        desc: krEntry?.desc,
        cost: krEntry?.cost,
        level: krEntry?.level,
        learn_level: krEntry?.learn_level
      });
    }
    if (lang === 'en') {
      return keepDefinedFields({
        name_en: enEntry?.name,
        desc_en: enEntry?.desc
      });
    }
    if (lang === 'jp') {
      return keepDefinedFields({
        name_jp: jpEntry?.name,
        desc_jp: jpEntry?.desc
      });
    }
    return {};
  });
}

function buildPassivePatch({ lang, localType, ext }) {
  if (localType !== 'nonorder') return null;
  const sourceKr = Array.isArray(ext.kr?.passive_skill) ? ext.kr.passive_skill : [];
  if (sourceKr.length === 0) return null;
  return sourceKr.map((krEntry, idx) => {
    const enEntry = ext.en?.passive_skill?.[idx];
    const jpEntry = ext.jp?.passive_skill?.[idx];
    if (lang === 'kr') {
      return keepDefinedFields({
        name: krEntry?.name,
        desc: krEntry?.desc
      });
    }
    if (lang === 'en') {
      return keepDefinedFields({
        name_en: enEntry?.name,
        desc_en: enEntry?.desc
      });
    }
    if (lang === 'jp') {
      return keepDefinedFields({
        name_jp: jpEntry?.name,
        desc_jp: jpEntry?.desc
      });
    }
    return {};
  });
}

function buildUniqueSkillPatch({ lang, localType, ext }) {
  if (localType !== 'nonorder') return null;
  if (!ext.kr?.fixed_skill) return null;
  const patch = {};
  if (lang === 'kr') {
    patch.name = ext.kr.fixed_skill?.name;
    patch.desc = ext.kr.fixed_skill?.desc;
  }
  if (lang === 'en') {
    patch.name_en = ext.en?.fixed_skill?.name;
    patch.desc_en = ext.en?.fixed_skill?.desc;
  }
  if (lang === 'jp') {
    patch.name_jp = ext.jp?.fixed_skill?.name;
    patch.desc_jp = ext.jp?.fixed_skill?.desc;
  }
  return keepDefinedFields(patch);
}

function buildHighlightPatch({ lang, localType, ext }) {
  if (localType !== 'nonorder') return null;
  if (!ext.kr?.showtime_skill) return null;
  const patch = {};
  if (lang === 'kr') patch.desc = ext.kr.showtime_skill?.desc;
  if (lang === 'en') patch.desc_en = ext.en?.showtime_skill?.desc;
  if (lang === 'jp') patch.desc_jp = ext.jp?.showtime_skill?.desc;
  return keepDefinedFields(patch);
}

function buildPartPatch({ part, index, lang, mapData, localType, ext }) {
  if (part === 'profile') return buildProfilePatch({ index, lang, mapData, localType, ext });
  if (part === 'innate_skill') return buildInnatePatch({ lang, ext });
  if (part === 'passive_skill') return buildPassivePatch({ lang, localType, ext });
  if (part === 'uniqueSkill') return buildUniqueSkillPatch({ lang, localType, ext });
  if (part === 'highlight') return buildHighlightPatch({ lang, localType, ext });
  return null;
}

function pathForPart(part, pathText) {
  const pathValue = String(pathText || '<root>');
  if (part === 'profile') {
    if (pathValue === '<root>') return 'profile';
    return `profile.${pathValue}`;
  }
  if (pathValue === '<root>') return part;
  if (pathValue.startsWith('[')) return `${part}${pathValue}`;
  return `${part}.${pathValue}`;
}

function rootPathForPart(part, pathText) {
  const rel = String(pathText || '<root>');
  if (part === 'profile') return rel;
  if (rel === '<root>') return part;
  if (rel.startsWith('[')) return `${part}${rel}`;
  return `${part}.${rel}`;
}

function buildPartDiff({ part, patchValue, localData }) {
  const current = part === 'profile'
    ? (isPlainObject(localData) ? localData : {})
    : localData?.[part];
  const nextValue = mergePatch(current, patchValue);
  const changed = diffPaths(current, nextValue).filter(Boolean);
  if (changed.length === 0) return null;
  const valueDiffs = changed.map((pathText) => ({
    path: pathForPart(part, pathText),
    before: getValueAtDiffPath(current, pathText),
    after: getValueAtDiffPath(nextValue, pathText)
  }));
  return {
    part,
    diffCount: valueDiffs.length,
    samplePaths: valueDiffs.map((item) => item.path),
    valueDiffs
  };
}

function collectReportRows({ rows, langs, parts, scope }) {
  const reportRows = [];
  for (const row of rows) {
    if (!matchesScope(row, scope)) continue;

    const entry = loadPersonaEntry(row.localPath);
    const localData = entry?.data || {};
    const ext = loadExternalPersonaByLang(row.index);

    for (const lang of langs) {
      if (!ext[lang]) continue;
      const partDiffs = [];
      for (const part of parts) {
        const patchValue = buildPartPatch({
          part,
          index: row.index,
          lang,
          mapData: row.mapData || {},
          localType: row.local,
          ext
        });
        if (patchValue === null || patchValue === undefined) continue;
        const diff = buildPartDiff({
          part,
          patchValue,
          localData
        });
        if (diff) partDiffs.push(diff);
      }
      if (partDiffs.length === 0) continue;
      reportRows.push({
        index: row.index,
        api: row.api,
        local: row.local,
        key: row.key,
        lang,
        partDiffs
      });
    }
  }
  return reportRows;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function applyPartsToPersona({ row, lang, parts, ext, baseData, selectedPathsByPart = null }) {
  let nextData = clone(baseData);
  const changedParts = [];
  let changedPaths = 0;
  const skippedParts = [];

  for (const part of parts) {
    const patchValue = buildPartPatch({
      part,
      index: row.index,
      lang,
      mapData: row.mapData || {},
      localType: row.local,
      ext
    });
    if (patchValue === null || patchValue === undefined) {
      skippedParts.push(part);
      continue;
    }

    const currentPart = part === 'profile'
      ? (isPlainObject(nextData) ? nextData : {})
      : nextData?.[part];
    const fullNextPart = mergePatch(currentPart, patchValue);
    const changedRelPaths = diffPaths(currentPart, fullNextPart).filter(Boolean);
    if (changedRelPaths.length === 0) {
      skippedParts.push(part);
      continue;
    }

    let selectedRelPaths = changedRelPaths;
    if (selectedPathsByPart instanceof Map) {
      const wanted = selectedPathsByPart.get(part);
      if (!wanted || wanted.size === 0) {
        skippedParts.push(part);
        continue;
      }
      selectedRelPaths = changedRelPaths.filter((rel) => wanted.has(pathForPart(part, rel)));
      if (selectedRelPaths.length === 0) {
        skippedParts.push(part);
        continue;
      }
    }

    if (!(selectedPathsByPart instanceof Map)) {
      if (part === 'profile') {
        nextData = mergePatch(nextData, patchValue);
      } else {
        if (!isPlainObject(nextData) && !Array.isArray(nextData)) nextData = {};
        nextData[part] = fullNextPart;
      }
    } else {
      for (const relPath of selectedRelPaths) {
        const rootPath = rootPathForPart(part, relPath);
        const nextValue = getValueAtDiffPath(fullNextPart, relPath);
        nextData = setValueAtDiffPath(nextData, rootPath, nextValue);
      }
    }

    if (!changedParts.includes(part)) changedParts.push(part);
    changedPaths += selectedRelPaths.length;
  }

  return {
    nextData,
    changedParts,
    changedPaths,
    skippedParts
  };
}

function runList(args) {
  const rows = loadRows();
  const langs = parseLangs(args.langs);
  const scope = parseScope(args);
  const filtered = rows.filter((row) => matchesScope(row, scope));
  for (const row of filtered) {
    log(formatListLine(row, langs));
  }
}

function runReportJson(args) {
  const rows = loadRows();
  const langs = parseLangs(args.langs);
  const parts = parseParts(args.parts);
  const scope = parseScope(args);
  const reportRows = collectReportRows({
    rows,
    langs,
    parts,
    scope
  });

  const jsonFile = path.resolve(PROJECT_ROOT, String(args['json-file'] || DEFAULT_REPORT_JSON_FILE));
  ensureDir(path.dirname(jsonFile));
  fs.writeFileSync(jsonFile, `${JSON.stringify({ rows: reportRows }, null, 2)}\n`, 'utf8');
  log(`[report-json] wrote: ${path.relative(PROJECT_ROOT, jsonFile)} (${reportRows.length} rows)`);
}

function runPatch(args) {
  const rows = loadRows();
  const langs = parseLangs(args.langs);
  const parts = parseParts(args.parts);
  const scope = parseScope(args);
  const dryRun = Boolean(args['dry-run']);

  const targetRows = rows.filter((row) => matchesScope(row, scope));
  let changedRows = 0;
  let changedPartsTotal = 0;
  let changedPathsTotal = 0;

  for (const row of targetRows) {
    if (!row.localPath || !fs.existsSync(row.localPath)) {
      warn(`[patch] skip #${row.index} ${row.api}/${row.local} (${row.key}): local file missing`);
      continue;
    }

    const entry = loadPersonaEntry(row.localPath);
    if (!entry || !isPlainObject(entry.data)) {
      warn(`[patch] skip #${row.index} ${row.api}/${row.local} (${row.key}): local file parse failed`);
      continue;
    }

    const ext = loadExternalPersonaByLang(row.index);
    let workingData = entry.data;

    for (const lang of langs) {
      if (!ext[lang]) {
        warn(`[patch] skip #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang}: external not found`);
        continue;
      }

      const applied = applyPartsToPersona({
        row,
        lang,
        parts,
        ext,
        baseData: workingData
      });

      if (applied.changedPaths === 0) {
        log(`[patch] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[] skipped=[${applied.skippedParts.join(',')}]`);
        continue;
      }

      if (!dryRun) {
        writePersonaEntry(row.localPath, entry.entryKey || row.key, applied.nextData);
      }

      workingData = applied.nextData;
      changedRows += 1;
      changedPartsTotal += applied.changedParts.length;
      changedPathsTotal += applied.changedPaths;
      log(`[patch] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[${applied.changedParts.join(',')}] paths=${applied.changedPaths} dry_run=${dryRun ? 'Y' : 'N'}`);
    }
  }

  log(`[patch] summary: rows=${changedRows} changed_parts=${changedPartsTotal} changed_paths=${changedPathsTotal} dry_run=${dryRun ? 'Y' : 'N'}`);
}

function runApplyDiffJson(args) {
  const inputRel = String(args['input-file'] || '').trim();
  if (!inputRel) {
    fail("apply-diff-json requires '--input-file'");
  }
  const inputFile = path.resolve(PROJECT_ROOT, inputRel);
  if (!fs.existsSync(inputFile)) {
    fail(`input file not found: ${inputRel}`);
  }

  const dryRun = Boolean(args['dry-run']);
  const payload = loadJson(inputFile);
  if (!payload || !Array.isArray(payload.tasks)) {
    fail(`invalid input json format: ${inputRel}`);
  }

  const rows = loadRows();
  const byIndex = new Map(rows.map((row) => [Number(row.index), row]));

  let resultRows = 0;
  let changedPartsTotal = 0;
  let changedPathsTotal = 0;

  for (const task of payload.tasks) {
    const index = Number(task?.index);
    const lang = String(task?.lang || '').trim().toLowerCase();
    if (!Number.isInteger(index) || !SUPPORTED_LANGS.includes(lang)) {
      continue;
    }

    const row = byIndex.get(index);
    if (!row) {
      warn(`[apply-diff-json] skip #${index} lang=${lang}: mapping row not found`);
      continue;
    }
    if (!row.localPath || !fs.existsSync(row.localPath)) {
      warn(`[apply-diff-json] skip #${index} ${row.api}/${row.local} (${row.key}) lang=${lang}: local file missing`);
      continue;
    }

    const entry = loadPersonaEntry(row.localPath);
    if (!entry || !isPlainObject(entry.data)) {
      warn(`[apply-diff-json] skip #${index} ${row.api}/${row.local} (${row.key}) lang=${lang}: local parse failed`);
      continue;
    }

    const ext = loadExternalPersonaByLang(index);
    if (!ext[lang]) {
      warn(`[apply-diff-json] skip #${index} ${row.api}/${row.local} (${row.key}) lang=${lang}: external not found`);
      continue;
    }

    const selectedPathsByPart = new Map();
    for (const partSpec of Array.isArray(task?.parts) ? task.parts : []) {
      const part = String(partSpec?.part || '').trim();
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
    const applied = applyPartsToPersona({
      row,
      lang,
      parts,
      ext,
      baseData: entry.data,
      selectedPathsByPart
    });

    if (applied.changedPaths === 0) {
      log(`[apply-diff-json] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[] skipped=[${parts.join(',')}]`);
      continue;
    }

    if (!dryRun) {
      writePersonaEntry(row.localPath, entry.entryKey || row.key, applied.nextData);
    }

    resultRows += 1;
    changedPartsTotal += applied.changedParts.length;
    changedPathsTotal += applied.changedPaths;

    const requestedParts = parts.join(',');
    const changed = applied.changedParts.join(',');
    const skipped = parts.filter((part) => !applied.changedParts.includes(part)).join(',');
    log(`[apply-diff-json] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[${changed}] skipped=[${skipped}]`);
  }

  log(`[apply-diff-json] summary: rows=${resultRows} changed_parts=${changedPartsTotal} changed_paths=${changedPathsTotal} dry_run=${dryRun ? 'Y' : 'N'}`);
}

function main() {
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
  if (command === 'list') {
    runList(options.args);
    return;
  }
  if (command === 'report-json') {
    runReportJson(options.args);
    return;
  }
  if (command === 'patch') {
    runPatch(options.args);
    return;
  }
  if (command === 'apply-diff-json') {
    runApplyDiffJson(options.args);
  }
}

main();
