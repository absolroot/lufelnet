#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import {
  clone,
  isPlainObject,
  parseCsv,
  parseRangeSet,
  setValueAtDiffPath
} from './lib/patch-console-shared.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..', '..');

const DATA_FILE_BY_LANG = {
  kr: path.join(PROJECT_ROOT, 'data', 'kr', 'revelations', 'revelations.js'),
  en: path.join(PROJECT_ROOT, 'data', 'en', 'revelations', 'revelations.js'),
  jp: path.join(PROJECT_ROOT, 'data', 'jp', 'revelations', 'revelations.js'),
  cn: path.join(PROJECT_ROOT, 'data', 'cn', 'revelations', 'revelations.js')
};

const MAPPING_KEY_BY_LANG = {
  en: 'mapping_en',
  jp: 'mapping_jp',
  cn: 'mapping_cn'
};

const DATA_VAR_BY_LANG = {
  en: 'enRevelationData',
  jp: 'jpRevelationData',
  cn: 'cnRevelationData'
};

const SUPPORTED_LANGS = ['kr', 'en', 'jp', 'cn'];
const SUPPORTED_PARTS = ['name', 'relation', 'effect', 'unreleased'];
const SUPPORTED_KINDS = ['main', 'sub'];
const DEFAULT_REPORT_JSON_FILE = path.join(PROJECT_ROOT, 'scripts', 'reports', 'revelation-patch-diff.json');
const UNRELEASED_TAG = '\uBBF8\uCD9C\uC2DC';

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
  node apps/patch-console/patch-revelation.mjs list [--langs kr,en,jp,cn] [--all|--nums 1,3-5|--api text|--local main|sub]
  node apps/patch-console/patch-revelation.mjs report-json [--langs kr,en,jp,cn] [--all|--nums ...|--api ...|--local ...] [--parts name,relation,effect,unreleased] [--json-file scripts/reports/revelation-patch-diff.json]
  node apps/patch-console/patch-revelation.mjs patch [--langs kr,en,jp,cn] [--all|--nums ...|--api ...|--local ...] [--parts ...] [--dry-run] [--no-report]
  node apps/patch-console/patch-revelation.mjs apply-diff-json --input-file scripts/reports/apply-diff-request.json [--dry-run]
  node apps/patch-console/patch-revelation.mjs create --kind main|sub --kr KR_NAME --en EN_NAME --jp JP_NAME --cn CN_NAME [--types CSV] [--unreleased] [--set2_kr text --set4_kr text --set2_en text --set4_en text --set2_jp text --set4_jp text --set2_cn text --set4_cn text]
  node apps/patch-console/patch-revelation.mjs help
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

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj || {}, key);
}

function parseLangs(input) {
  const requested = parseCsv(input || SUPPORTED_LANGS.join(',')).map((x) => x.toLowerCase());
  const langs = requested.filter((lang) => SUPPORTED_LANGS.includes(lang));
  return langs.length > 0 ? langs : [...SUPPORTED_LANGS];
}

function parseParts(input) {
  const requested = parseCsv(input || SUPPORTED_PARTS.join(',')).map((x) => x.toLowerCase());
  const parts = SUPPORTED_PARTS.filter((part) => requested.includes(part));
  return parts.length > 0 ? parts : [...SUPPORTED_PARTS];
}

function parseScope(args) {
  if (args.nums) return { mode: 'nums', value: String(args.nums) };
  if (args.api) return { mode: 'api', value: String(args.api) };
  if (args.local) return { mode: 'local', value: String(args.local) };
  return { mode: 'all', value: '' };
}

function parseBoolean(value) {
  if (value === true) return true;
  if (value === false || value == null) return false;
  const text = String(value).trim().toLowerCase();
  return ['1', 'true', 'yes', 'y', 'on'].includes(text);
}

function normalizeText(value) {
  return String(value == null ? '' : value)
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .trim();
}

function normalizeSetText(value) {
  return String(value == null ? '' : value)
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .trim();
}

function uniqueStrings(values) {
  const out = [];
  const seen = new Set();
  for (const raw of Array.isArray(values) ? values : []) {
    const text = String(raw || '').trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
  }
  return out;
}

function normalizeTypes(types, { allowUnreleased = true } = {}) {
  const normalized = uniqueStrings(types);
  if (allowUnreleased) return normalized;
  return normalized.filter((token) => token !== UNRELEASED_TAG);
}

function asArray(value) {
  return Array.isArray(value) ? [...value] : [];
}

function equalsValue(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function cleanCell(value) {
  return String(value || '').replace(/\|/g, '/');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function emptyKrData() {
  return {
    main: {},
    sub: {},
    sub_effects: {},
    set_effects: {}
  };
}

function emptyLocalizedData(lang) {
  const mapKey = MAPPING_KEY_BY_LANG[lang];
  return {
    [mapKey]: {},
    mainTranslated: {},
    subTranslated: {},
    main: {},
    sub: {},
    sub_effects: {},
    set_effects: {}
  };
}
function normalizeKrData(raw) {
  const source = isPlainObject(raw) ? raw : {};
  return {
    main: isPlainObject(source.main) ? clone(source.main) : {},
    sub: isPlainObject(source.sub) ? clone(source.sub) : {},
    sub_effects: isPlainObject(source.sub_effects) ? clone(source.sub_effects) : {},
    set_effects: isPlainObject(source.set_effects) ? clone(source.set_effects) : {}
  };
}

function normalizeLocalizedData(lang, raw) {
  const mapKey = MAPPING_KEY_BY_LANG[lang];
  const source = isPlainObject(raw) ? raw : {};
  return {
    [mapKey]: isPlainObject(source[mapKey]) ? clone(source[mapKey]) : {},
    mainTranslated: isPlainObject(source.mainTranslated) ? clone(source.mainTranslated) : {},
    subTranslated: isPlainObject(source.subTranslated) ? clone(source.subTranslated) : {},
    main: isPlainObject(source.main) ? clone(source.main) : {},
    sub: isPlainObject(source.sub) ? clone(source.sub) : {},
    sub_effects: isPlainObject(source.sub_effects) ? clone(source.sub_effects) : {},
    set_effects: isPlainObject(source.set_effects) ? clone(source.set_effects) : {}
  };
}

function captureExpressionForLang(lang) {
  if (lang === 'kr') {
    return `(typeof revelationData !== 'undefined' ? revelationData : (window && window.revelationData ? window.revelationData : null))`;
  }
  const varName = DATA_VAR_BY_LANG[lang];
  return `(typeof ${varName} !== 'undefined' ? ${varName} : (window && window.${varName} ? window.${varName} : null))`;
}

function loadRawLangFile(lang) {
  const filePath = DATA_FILE_BY_LANG[lang];
  if (!fs.existsSync(filePath)) return null;
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: {}, globalThis: {} };
  sandbox.globalThis = sandbox;
  const capture = `\n;globalThis.__OUT__ = ${captureExpressionForLang(lang)};`;
  try {
    vm.runInNewContext(code + capture, sandbox, { timeout: 10000 });
  } catch (error) {
    throw new Error(`failed to evaluate ${path.relative(PROJECT_ROOT, filePath)} (${error.message})`);
  }
  return sandbox.__OUT__ || null;
}

function buildCnFromKr(krData) {
  const out = emptyLocalizedData('cn');
  const mainKeys = Object.keys(krData.main || {});
  const subKeys = Object.keys(krData.sub || {});
  for (const mainName of mainKeys) {
    out.mapping_cn[mainName] = mainName;
    out.mainTranslated[mainName] = mainName;
    out.main[mainName] = asArray(krData.main?.[mainName]);
    const srcSet = isPlainObject(krData.set_effects?.[mainName]) ? krData.set_effects[mainName] : {};
    const clonedSet = clone(srcSet) || {};
    clonedSet.type = normalizeTypes(asArray(clonedSet.type), { allowUnreleased: false });
    out.set_effects[mainName] = clonedSet;
  }
  for (const subName of subKeys) {
    out.mapping_cn[subName] = subName;
    out.subTranslated[subName] = subName;
    out.sub[subName] = asArray(krData.sub?.[subName]);
    const srcEffect = isPlainObject(krData.sub_effects?.[subName]) ? krData.sub_effects[subName] : {};
    const cloned = clone(srcEffect) || {};
    cloned.set2 = String(cloned.set2 || '');
    cloned.set4 = String(cloned.set4 || '');
    cloned.type = normalizeTypes(asArray(cloned.type), { allowUnreleased: false });
    out.sub_effects[subName] = cloned;
  }
  return out;
}

function buildLocalizedFileContent(lang, data) {
  const mapKey = MAPPING_KEY_BY_LANG[lang];
  const dataVar = DATA_VAR_BY_LANG[lang];
  const mappingObj = isPlainObject(data[mapKey]) ? data[mapKey] : {};
  const payload = {
    [mapKey]: mappingObj,
    mainTranslated: isPlainObject(data.mainTranslated) ? data.mainTranslated : {},
    subTranslated: isPlainObject(data.subTranslated) ? data.subTranslated : {},
    main: isPlainObject(data.main) ? data.main : {},
    sub: isPlainObject(data.sub) ? data.sub : {},
    sub_effects: isPlainObject(data.sub_effects) ? data.sub_effects : {},
    set_effects: isPlainObject(data.set_effects) ? data.set_effects : {}
  };
  return `const ${mapKey} = ${JSON.stringify(mappingObj, null, 2)};\n\nconst ${dataVar} = ${JSON.stringify(payload, null, 2)};\n`;
}

function writeLangFile(lang, data) {
  const filePath = DATA_FILE_BY_LANG[lang];
  ensureDir(path.dirname(filePath));
  if (lang === 'kr') {
    fs.writeFileSync(filePath, `window.revelationData = ${JSON.stringify(normalizeKrData(data), null, 2)};\n`, 'utf8');
    return;
  }
  fs.writeFileSync(filePath, buildLocalizedFileContent(lang, normalizeLocalizedData(lang, data)), 'utf8');
}

function loadContext() {
  const rawKr = loadRawLangFile('kr');
  if (!rawKr) {
    throw new Error(`missing kr revelation file: ${path.relative(PROJECT_ROOT, DATA_FILE_BY_LANG.kr)}`);
  }

  const dataByLang = {
    kr: normalizeKrData(rawKr)
  };

  for (const lang of ['en', 'jp']) {
    const raw = loadRawLangFile(lang);
    if (!raw) {
      throw new Error(`missing ${lang} revelation file: ${path.relative(PROJECT_ROOT, DATA_FILE_BY_LANG[lang])}`);
    }
    dataByLang[lang] = normalizeLocalizedData(lang, raw);
  }

  const rawCn = loadRawLangFile('cn');
  if (!rawCn) {
    const bootstrapped = buildCnFromKr(dataByLang.kr);
    writeLangFile('cn', bootstrapped);
    dataByLang.cn = normalizeLocalizedData('cn', bootstrapped);
  } else {
    dataByLang.cn = normalizeLocalizedData('cn', rawCn);
  }

  const rows = buildRows(dataByLang);
  return { dataByLang, rows };
}
function getTranslatedName(dataByLang, lang, kind, krName) {
  if (lang === 'kr') return String(krName || '').trim();
  const data = dataByLang[lang];
  if (!data) return '';
  const translatedTable = kind === 'main' ? data.mainTranslated : data.subTranslated;
  const mapKey = MAPPING_KEY_BY_LANG[lang];
  const translated = normalizeText(translatedTable?.[krName]);
  if (translated) return translated;
  const mapped = normalizeText(data[mapKey]?.[krName]);
  if (mapped) return mapped;
  if (lang === 'cn') return String(krName || '').trim();
  return '';
}

function getTypeArrayForRow(row, lang, dataByLang) {
  const data = dataByLang[lang];
  if (!data) return [];
  const keyName = lang === 'kr'
    ? row.krName
    : getTranslatedName(dataByLang, lang, row.kind, row.krName);
  if (!keyName) return [];
  const source = row.kind === 'main'
    ? data.set_effects?.[keyName]
    : data.sub_effects?.[keyName];
  return uniqueStrings(asArray(source?.type));
}

function rowExistsInLang(row, lang, dataByLang) {
  const data = dataByLang[lang];
  if (!data) return false;
  const keyName = lang === 'kr'
    ? row.krName
    : getTranslatedName(dataByLang, lang, row.kind, row.krName);
  if (!keyName) return false;
  if (row.kind === 'main') {
    return hasOwn(data.main, keyName) && hasOwn(data.set_effects, keyName);
  }
  return hasOwn(data.sub, keyName) && hasOwn(data.sub_effects, keyName);
}

function buildRows(dataByLang) {
  const rows = [];
  const mainKeys = Object.keys(dataByLang.kr.main || {});
  const subKeys = Object.keys(dataByLang.kr.sub || {});
  let index = 1;

  const pushRow = (kind, krName) => {
    const names = {
      en: getTranslatedName(dataByLang, 'en', kind, krName),
      jp: getTranslatedName(dataByLang, 'jp', kind, krName),
      cn: getTranslatedName(dataByLang, 'cn', kind, krName)
    };
    const row = {
      index,
      kind,
      krName,
      api: names.en || names.jp || names.cn || krName,
      local: kind,
      key: krName,
      names,
      status: {}
    };
    for (const lang of SUPPORTED_LANGS) {
      row.status[lang] = rowExistsInLang(row, lang, dataByLang) ? 'Y' : 'N';
    }
    rows.push(row);
    index += 1;
  };

  for (const mainName of mainKeys) pushRow('main', mainName);
  for (const subName of subKeys) pushRow('sub', subName);
  return rows;
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
    const source = `${row.index} ${row.api} ${row.krName} ${row.names?.en || ''} ${row.names?.jp || ''} ${row.names?.cn || ''}`.toLowerCase();
    return tokens.some((token) => source.includes(token));
  }
  if (scope.mode === 'local') {
    const tokens = parseCsv(scope.value).map((x) => x.toLowerCase());
    if (tokens.length === 0) return true;
    const source = `${row.local} ${row.kind} ${row.krName}`.toLowerCase();
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
    cleanCell(row.api),
    cleanCell(row.local),
    cleanCell(row.key),
    statusText
  ];
  return `${cols[0]} | ${cols[1]} | ${cols[2]} | ${cols[3]} | ${cols[4]}`;
}

function pushDiffIfChanged(out, pathText, before, after) {
  if (equalsValue(before, after)) return;
  out.push({
    path: pathText,
    before: before === undefined ? null : clone(before),
    after: after === undefined ? null : clone(after)
  });
}

function buildNameDiffs(row, lang, dataByLang) {
  if (lang === 'kr') return [];
  const out = [];
  const data = dataByLang[lang];
  const translated = getTranslatedName(dataByLang, lang, row.kind, row.krName);
  if (!translated) return out;

  const mapKey = MAPPING_KEY_BY_LANG[lang];
  const translatedKey = row.kind === 'main' ? 'mainTranslated' : 'subTranslated';

  pushDiffIfChanged(out, `${mapKey}.${row.krName}`, data[mapKey]?.[row.krName], translated);
  pushDiffIfChanged(out, `${translatedKey}.${row.krName}`, data[translatedKey]?.[row.krName], translated);
  return out;
}

function buildRelationDiffs(row, lang, dataByLang) {
  const out = [];
  const krData = dataByLang.kr;
  const target = dataByLang[lang];
  const selfName = lang === 'kr'
    ? row.krName
    : getTranslatedName(dataByLang, lang, row.kind, row.krName);
  if (!selfName) return out;

  if (row.kind === 'main') {
    const expected = asArray(krData.main?.[row.krName])
      .map((subKr) => getTranslatedName(dataByLang, lang, 'sub', subKr))
      .filter(Boolean);
    const before = Array.isArray(target.main?.[selfName]) ? target.main[selfName] : [];
    pushDiffIfChanged(out, `main.${selfName}`, before, expected);
    return out;
  }

  const expected = asArray(krData.sub?.[row.krName])
    .map((mainKr) => getTranslatedName(dataByLang, lang, 'main', mainKr))
    .filter(Boolean);
  const before = Array.isArray(target.sub?.[selfName]) ? target.sub[selfName] : [];
  pushDiffIfChanged(out, `sub.${selfName}`, before, expected);
  return out;
}
function buildEffectDiffs(row, lang, dataByLang) {
  const out = [];
  const target = dataByLang[lang];
  const krData = dataByLang.kr;
  const selfName = lang === 'kr'
    ? row.krName
    : getTranslatedName(dataByLang, lang, row.kind, row.krName);
  if (!selfName) return out;

  if (row.kind === 'sub') {
    const beforeEntry = isPlainObject(target.sub_effects?.[selfName]) ? target.sub_effects[selfName] : {};
    const expectedSet2 = lang === 'kr'
      ? String(krData.sub_effects?.[row.krName]?.set2 || '')
      : '';
    const expectedSet4 = lang === 'kr'
      ? String(krData.sub_effects?.[row.krName]?.set4 || '')
      : '';

    if (!hasOwn(beforeEntry, 'set2')) {
      pushDiffIfChanged(out, `sub_effects.${selfName}.set2`, beforeEntry.set2, expectedSet2);
    }
    if (!hasOwn(beforeEntry, 'set4')) {
      pushDiffIfChanged(out, `sub_effects.${selfName}.set4`, beforeEntry.set4, expectedSet4);
    }
    if (!Array.isArray(beforeEntry.type)) {
      pushDiffIfChanged(out, `sub_effects.${selfName}.type`, beforeEntry.type, []);
    }
    return out;
  }

  const beforeEntry = isPlainObject(target.set_effects?.[selfName]) ? target.set_effects[selfName] : {};
  if (!Array.isArray(beforeEntry.type)) {
    pushDiffIfChanged(out, `set_effects.${selfName}.type`, beforeEntry.type, []);
  }

  const expectedSubs = asArray(krData.main?.[row.krName])
    .map((subKr) => getTranslatedName(dataByLang, lang, 'sub', subKr))
    .filter(Boolean);
  for (const subName of expectedSubs) {
    if (!hasOwn(beforeEntry, subName)) {
      pushDiffIfChanged(out, `set_effects.${selfName}.${subName}`, beforeEntry[subName], '');
    }
  }
  return out;
}

function collectUnreleasedUnion(rows, dataByLang) {
  const out = {
    main: new Set(),
    sub: new Set()
  };
  for (const row of rows) {
    const enTypes = getTypeArrayForRow(row, 'en', dataByLang);
    const jpTypes = getTypeArrayForRow(row, 'jp', dataByLang);
    if (enTypes.includes(UNRELEASED_TAG) || jpTypes.includes(UNRELEASED_TAG)) {
      out[row.kind].add(row.krName);
    }
  }
  return out;
}

function buildUnreleasedDiffs(row, lang, dataByLang, unreleasedUnion) {
  if (lang === 'kr') return [];
  const out = [];
  const selfName = getTranslatedName(dataByLang, lang, row.kind, row.krName);
  if (!selfName) return out;

  const before = getTypeArrayForRow(row, lang, dataByLang);
  let after = uniqueStrings(before);
  if (lang === 'cn') {
    after = after.filter((token) => token !== UNRELEASED_TAG);
  } else if (lang === 'en' || lang === 'jp') {
    const shouldHave = unreleasedUnion[row.kind].has(row.krName);
    if (shouldHave && !after.includes(UNRELEASED_TAG)) {
      after.push(UNRELEASED_TAG);
    }
  }
  if (equalsValue(before, after)) return out;

  const pathText = row.kind === 'main'
    ? `set_effects.${selfName}.type`
    : `sub_effects.${selfName}.type`;
  pushDiffIfChanged(out, pathText, before, after);
  return out;
}

function buildPartDiff(row, lang, part, dataByLang, unreleasedUnion) {
  let valueDiffs = [];
  if (part === 'name') valueDiffs = buildNameDiffs(row, lang, dataByLang);
  else if (part === 'relation') valueDiffs = buildRelationDiffs(row, lang, dataByLang);
  else if (part === 'effect') valueDiffs = buildEffectDiffs(row, lang, dataByLang);
  else if (part === 'unreleased') valueDiffs = buildUnreleasedDiffs(row, lang, dataByLang, unreleasedUnion);

  if (!Array.isArray(valueDiffs) || valueDiffs.length === 0) return null;
  return {
    part,
    diffCount: valueDiffs.length,
    samplePaths: valueDiffs.map((item) => item.path),
    valueDiffs
  };
}

function collectReportRows({ rows, langs, parts, scope, dataByLang }) {
  const out = [];
  const unreleasedUnion = collectUnreleasedUnion(rows, dataByLang);
  for (const row of rows) {
    if (!matchesScope(row, scope)) continue;
    for (const lang of langs) {
      const partDiffs = [];
      for (const part of parts) {
        const diff = buildPartDiff(row, lang, part, dataByLang, unreleasedUnion);
        if (diff) partDiffs.push(diff);
      }
      if (partDiffs.length === 0) continue;
      out.push({
        index: row.index,
        api: row.api,
        local: row.local,
        key: row.key,
        lang,
        partDiffs
      });
    }
  }
  return out;
}

function applyValueDiffs(baseValue, valueDiffs, selectedPaths = null) {
  let nextValue = clone(baseValue);
  let changedPaths = 0;
  for (const item of valueDiffs) {
    const pathText = String(item?.path || '').trim();
    if (!pathText) continue;
    if (selectedPaths instanceof Set && !selectedPaths.has(pathText)) continue;
    nextValue = setValueAtDiffPath(nextValue, pathText, clone(item.after));
    changedPaths += 1;
  }
  return { nextValue, changedPaths };
}

function applyPartsToRowLang({ row, lang, parts, dataByLang, unreleasedUnion, selectedPathsByPart = null }) {
  const changedParts = [];
  const skippedParts = [];
  let changedPaths = 0;

  for (const part of parts) {
    const diff = buildPartDiff(row, lang, part, dataByLang, unreleasedUnion);
    if (!diff || !Array.isArray(diff.valueDiffs) || diff.valueDiffs.length === 0) {
      skippedParts.push(`${part}:no_change`);
      continue;
    }

    let selectedPaths = null;
    if (selectedPathsByPart instanceof Map) {
      selectedPaths = selectedPathsByPart.get(part);
      if (!(selectedPaths instanceof Set) || selectedPaths.size === 0) {
        skippedParts.push(`${part}:no_paths`);
        continue;
      }
    }

    const applied = applyValueDiffs(dataByLang[lang], diff.valueDiffs, selectedPaths);
    if (applied.changedPaths === 0) {
      skippedParts.push(`${part}:no_selected_change`);
      continue;
    }

    dataByLang[lang] = applied.nextValue;
    changedPaths += applied.changedPaths;
    if (!changedParts.includes(part)) changedParts.push(part);
  }

  return {
    changedParts,
    changedPaths,
    skippedParts
  };
}
function runList(args) {
  const { dataByLang } = loadContext();
  const langs = parseLangs(args.langs);
  const scope = parseScope(args);
  const latestRows = buildRows(dataByLang).filter((row) => matchesScope(row, scope));
  for (const row of latestRows) {
    log(formatListLine(row, langs));
  }
}

function runReportJson(args) {
  const { dataByLang, rows } = loadContext();
  const langs = parseLangs(args.langs);
  const parts = parseParts(args.parts);
  const scope = parseScope(args);
  const reportRows = collectReportRows({ rows, langs, parts, scope, dataByLang });

  const jsonFile = path.resolve(PROJECT_ROOT, String(args['json-file'] || DEFAULT_REPORT_JSON_FILE));
  ensureDir(path.dirname(jsonFile));
  fs.writeFileSync(jsonFile, `${JSON.stringify({ rows: reportRows }, null, 2)}\n`, 'utf8');
  log(`[report-json] wrote: ${path.relative(PROJECT_ROOT, jsonFile)} (${reportRows.length} rows)`);
}

function runPatch(args) {
  const { dataByLang, rows } = loadContext();
  const langs = parseLangs(args.langs);
  const parts = parseParts(args.parts);
  const scope = parseScope(args);
  const dryRun = Boolean(args['dry-run']);

  const targets = rows.filter((row) => matchesScope(row, scope));
  const changedLangs = new Set();
  const unreleasedUnion = collectUnreleasedUnion(rows, dataByLang);

  let changedRows = 0;
  let changedPartsTotal = 0;
  let changedPathsTotal = 0;

  for (const row of targets) {
    for (const lang of langs) {
      const applied = applyPartsToRowLang({ row, lang, parts, dataByLang, unreleasedUnion });
      if (applied.changedPaths === 0) {
        const skipped = applied.skippedParts.length > 0 ? applied.skippedParts.join(',') : '-';
        log(`[patch] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[] skipped=[${skipped}]`);
        continue;
      }

      changedRows += 1;
      changedPartsTotal += applied.changedParts.length;
      changedPathsTotal += applied.changedPaths;
      changedLangs.add(lang);
      const changed = applied.changedParts.length > 0 ? applied.changedParts.join(',') : '-';
      const skipped = applied.skippedParts.length > 0 ? applied.skippedParts.join(',') : '-';
      log(`[patch] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[${changed}] skipped=[${skipped}] paths=${applied.changedPaths} dry_run=${dryRun ? 'Y' : 'N'}`);
    }
  }

  if (!dryRun && changedLangs.size > 0) {
    for (const lang of changedLangs) {
      writeLangFile(lang, dataByLang[lang]);
    }
  }

  log(`[patch] summary: rows=${changedRows} changed_parts=${changedPartsTotal} changed_paths=${changedPathsTotal} dry_run=${dryRun ? 'Y' : 'N'}`);
}

function runApplyDiffJson(args) {
  const inputRel = String(args['input-file'] || '').trim();
  if (!inputRel) fail("apply-diff-json requires '--input-file'");

  const inputFile = path.resolve(PROJECT_ROOT, inputRel);
  if (!fs.existsSync(inputFile)) fail(`input file not found: ${inputRel}`);
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(inputFile, 'utf8').replace(/^\uFEFF/, ''));
  } catch (error) {
    fail(`failed to parse input file: ${inputRel} (${error.message})`);
  }
  if (!payload || !Array.isArray(payload.tasks)) {
    fail(`invalid input json format: ${inputRel}`);
  }

  const dryRun = Boolean(args['dry-run']);
  const { dataByLang, rows } = loadContext();
  const byIndex = new Map(rows.map((row) => [Number(row.index), row]));
  const changedLangs = new Set();
  const unreleasedUnion = collectUnreleasedUnion(rows, dataByLang);

  let changedRows = 0;
  let changedPartsTotal = 0;
  let changedPathsTotal = 0;

  for (const task of payload.tasks) {
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
    const applied = applyPartsToRowLang({ row, lang, parts, dataByLang, unreleasedUnion, selectedPathsByPart });

    if (applied.changedPaths === 0) {
      const skipped = applied.skippedParts.length > 0 ? applied.skippedParts.join(',') : '-';
      log(`[apply-diff-json] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[] skipped=[${skipped}]`);
      continue;
    }

    changedRows += 1;
    changedPartsTotal += applied.changedParts.length;
    changedPathsTotal += applied.changedPaths;
    changedLangs.add(lang);
    const skipped = applied.skippedParts.length > 0 ? applied.skippedParts.join(',') : '-';
    log(`[apply-diff-json] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${lang} changed=[${applied.changedParts.join(',')}] skipped=[${skipped}] paths=${applied.changedPaths}`);
  }

  if (!dryRun && changedLangs.size > 0) {
    for (const lang of changedLangs) {
      writeLangFile(lang, dataByLang[lang]);
    }
  }

  log(`[apply-diff-json] summary: rows=${changedRows} changed_parts=${changedPartsTotal} changed_paths=${changedPathsTotal} dry_run=${dryRun ? 'Y' : 'N'}`);
}

function runCreate(args) {
  const kind = normalizeText(args.kind).toLowerCase();
  const namesByLang = {
    kr: normalizeText(args.kr),
    en: normalizeText(args.en),
    jp: normalizeText(args.jp),
    cn: normalizeText(args.cn)
  };

  if (!SUPPORTED_KINDS.includes(kind)) {
    throw new Error(`invalid kind '${kind}' (allowed: ${SUPPORTED_KINDS.join(', ')})`);
  }

  for (const lang of SUPPORTED_LANGS) {
    if (!namesByLang[lang]) throw new Error(`missing ${lang} name`);
  }

  const unreleased = parseBoolean(args.unreleased);
  const types = parseCsv(args.types).map((x) => normalizeText(x)).filter(Boolean);
  const setTexts = {
    kr: { set2: normalizeSetText(args.set2_kr), set4: normalizeSetText(args.set4_kr) },
    en: { set2: normalizeSetText(args.set2_en), set4: normalizeSetText(args.set4_en) },
    jp: { set2: normalizeSetText(args.set2_jp), set4: normalizeSetText(args.set4_jp) },
    cn: { set2: normalizeSetText(args.set2_cn), set4: normalizeSetText(args.set4_cn) }
  };

  const { dataByLang } = loadContext();
  const krName = namesByLang.kr;
  if (hasOwn(dataByLang.kr.main, krName) || hasOwn(dataByLang.kr.sub, krName)) {
    throw new Error(`kr revelation already exists: ${krName}`);
  }

  for (const lang of ['en', 'jp', 'cn']) {
    const targetName = namesByLang[lang];
    if (hasOwn(dataByLang[lang].main, targetName) || hasOwn(dataByLang[lang].sub, targetName)) {
      throw new Error(`${lang} revelation name already exists: ${targetName}`);
    }
  }

  if (kind === 'main') {
    dataByLang.kr.main[krName] = [];
    dataByLang.kr.set_effects[krName] = { type: normalizeTypes(types, { allowUnreleased: false }) };
  } else {
    dataByLang.kr.sub[krName] = [];
    dataByLang.kr.sub_effects[krName] = {
      set2: setTexts.kr.set2,
      set4: setTexts.kr.set4,
      type: normalizeTypes(types, { allowUnreleased: false })
    };
  }

  for (const lang of ['en', 'jp', 'cn']) {
    const data = dataByLang[lang];
    const mapKey = MAPPING_KEY_BY_LANG[lang];
    const localized = namesByLang[lang];
    data[mapKey][krName] = localized;
    if (kind === 'main') {
      data.mainTranslated[krName] = localized;
      data.main[localized] = [];
      const baseTypes = normalizeTypes(types, { allowUnreleased: lang !== 'cn' });
      if (unreleased && (lang === 'en' || lang === 'jp') && !baseTypes.includes(UNRELEASED_TAG)) baseTypes.push(UNRELEASED_TAG);
      data.set_effects[localized] = { type: lang === 'cn' ? baseTypes.filter((x) => x !== UNRELEASED_TAG) : baseTypes };
    } else {
      data.subTranslated[krName] = localized;
      data.sub[localized] = [];
      const baseTypes = normalizeTypes(types, { allowUnreleased: lang !== 'cn' });
      if (unreleased && (lang === 'en' || lang === 'jp') && !baseTypes.includes(UNRELEASED_TAG)) baseTypes.push(UNRELEASED_TAG);
      data.sub_effects[localized] = {
        set2: setTexts[lang].set2,
        set4: setTexts[lang].set4,
        type: lang === 'cn' ? baseTypes.filter((x) => x !== UNRELEASED_TAG) : baseTypes
      };
    }
  }

  for (const lang of SUPPORTED_LANGS) {
    writeLangFile(lang, dataByLang[lang]);
  }

  process.stdout.write(`${JSON.stringify({ ok: true, entry: { kind, ...namesByLang, unreleased: Boolean(unreleased), types } })}\n`);
}

function main() {
  const options = parseCli(process.argv);
  const command = options.command;
  if (!['help', 'list', 'report-json', 'patch', 'apply-diff-json', 'create'].includes(command)) {
    usage();
    fail(`unknown command: ${command}`);
  }

  if (command === 'help') {
    usage();
    return;
  }

  try {
    if (command === 'list') return runList(options.args);
    if (command === 'report-json') return runReportJson(options.args);
    if (command === 'patch') return runPatch(options.args);
    if (command === 'apply-diff-json') return runApplyDiffJson(options.args);
    if (command === 'create') return runCreate(options.args);
  } catch (error) {
    fail(error?.message || String(error));
  }
}

main();
