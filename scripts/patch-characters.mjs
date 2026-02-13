#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import process from 'process';
import recastImport from 'recast';
import * as babelParser from '@babel/parser';
import { fileURLToPath } from 'url';

const recast = recastImport.default || recastImport;
const b = recast.types.builders;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

const CHARACTER_ROOT = path.join(PROJECT_ROOT, 'data', 'characters');
const TEMPLATE_ROOT = path.join(CHARACTER_ROOT, 'template');
const CODENAME_FILE = path.join(PROJECT_ROOT, 'data', 'external', 'character', 'codename.json');
const KR_CHARACTER_META_FILE = path.join(PROJECT_ROOT, 'data', 'kr', 'characters', 'characters.js');

const SUPPORTED_PATCH_LANGS = new Set(['kr', 'en', 'jp']);
const ALL_EXTERNAL_LANGS = ['kr', 'en', 'jp', 'cn', 'tw', 'sea'];
const DEFAULT_REPORT_FILE = path.join(PROJECT_ROOT, 'scripts', 'reports', 'character-patch-diff.md');
const DEFAULT_REPORT_JSON_FILE = path.join(PROJECT_ROOT, 'scripts', 'reports', 'character-patch-diff.json');

const WINDOW_NAME_MAP = {
  ritual: {
    kr: 'ritualData',
    en: 'enCharacterRitualData',
    jp: 'jpCharacterRitualData'
  },
  skill: {
    kr: 'characterSkillsData',
    en: 'enCharacterSkillsData',
    jp: 'jpCharacterSkillsData'
  },
  weapon: {
    kr: 'WeaponData',
    en: 'enCharacterWeaponData',
    jp: 'jpCharacterWeaponData'
  },
  base_stats: {
    kr: 'basicStatsData'
  }
};

const FILE_NAME_MAP = {
  ritual: 'ritual.js',
  skill: 'skill.js',
  weapon: 'weapon.js',
  base_stats: 'base_stats.js'
};

const KR = {
  single: '\uB2E8\uC77C',
  whole: '\uC804\uCCB4',
  aoe: '\uAD11\uC5ED',
  damageSingle: '\uB2E8\uC77C \uD53C\uD574',
  damageAoe: '\uAD11\uC5ED \uD53C\uD574',
  buff: '\uBC84\uD504',
  debuff: '\uB514\uBC84\uD504',
  weaken: '\uC57D\uD654',
  passive: '\uD328\uC2DC\uBE0C',
  elementIce: '\uBE59\uACB0',
  elementElectric: '\uC804\uACA9',
  elementFire: '\uD654\uC5FC',
  elementWind: '\uC9C8\uD48D',
  elementNuclear: '\uD575\uC5F4',
  elementPsy: '\uC5FC\uB3D9',
  elementBless: '\uCD95\uBCF5',
  elementCurse: '\uC8FC\uC6D0',
  elementPhys: '\uBB3C\uB9AC',
  elementGun: '\uCD1D\uACA9',
  elementAlmighty: '\uB9CC\uB2A5'
};

const NATURE_TO_ELEMENT_KR = {
  Ice: KR.elementIce,
  Elec: KR.elementElectric,
  Electric: KR.elementElectric,
  Fire: KR.elementFire,
  Wind: KR.elementWind,
  Nuclear: KR.elementNuclear,
  Nuke: KR.elementNuclear,
  Psy: KR.elementPsy,
  Bless: KR.elementBless,
  Curse: KR.elementCurse,
  Phys: KR.elementPhys,
  Physical: KR.elementPhys,
  Gun: KR.elementGun,
  Almighty: KR.elementAlmighty,
  Support: KR.buff,
  Debuff: KR.debuff
};

function log(message) {
  process.stdout.write(`${message}\n`);
}

function warn(message) {
  process.stderr.write(`[warn] ${message}\n`);
}

function fail(message, exitCode = 1) {
  process.stderr.write(`[error] ${message}\n`);
  process.exit(exitCode);
}

function usage() {
  log(`Usage:
  node scripts/patch-characters.mjs list [--langs kr,en,jp,cn,tw,sea]
  node scripts/patch-characters.mjs patch --langs kr,en,jp [--api api1,api2 | --local local1,local2 | --nums 1,3-5]
                                       [--parts ritual,skill,weapon,base_stats]
                                       [--dry-run] [--no-bootstrap]
                                       [--report-file scripts/reports/character-patch-diff.md] [--no-report]
  node scripts/patch-characters.mjs report --langs kr,en,jp
                                       [--api ... | --local ... | --nums ... | --all]
                                       [--exclude-api ... | --exclude-local ... | --exclude-nums ...]
                                       [--parts ritual,skill,weapon,base_stats]
                                       [--report-file scripts/reports/character-patch-diff.md]
  node scripts/patch-characters.mjs report-json --langs kr,en,jp
                                       [--api ... | --local ... | --nums ... | --all]
                                       [--exclude-api ... | --exclude-local ... | --exclude-nums ...]
                                       [--parts ritual,skill,weapon,base_stats]
                                       [--json-file scripts/reports/character-patch-diff.json]
  node scripts/patch-characters.mjs apply-diff-json --input-file scripts/reports/apply-diff-request.json
                                       [--dry-run]
`);
}

function parseCsv(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseNumRanges(value) {
  const out = new Set();
  for (const token of parseCsv(value)) {
    if (token.includes('-')) {
      const [aRaw, bRaw] = token.split('-', 2);
      const a = Number(aRaw);
      const bVal = Number(bRaw);
      if (!Number.isInteger(a) || !Number.isInteger(bVal)) {
        throw new Error(`Invalid range token '${token}'`);
      }
      const from = Math.min(a, bVal);
      const to = Math.max(a, bVal);
      for (let n = from; n <= to; n += 1) out.add(n);
    } else {
      const n = Number(token);
      if (!Number.isInteger(n)) {
        throw new Error(`Invalid number token '${token}'`);
      }
      out.add(n);
    }
  }
  return [...out].sort((a, b) => a - b);
}

function parseArgs(argv) {
  const raw = argv.slice(2);
  if (raw.includes('--help') || raw.includes('-h')) {
    return { command: 'help', args: {} };
  }
  const command = raw[0] || 'help';
  const args = {};

  for (let i = 1; i < raw.length; i += 1) {
    const token = raw[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    if (key === 'dry-run' || key === 'no-bootstrap' || key === 'no-report' || key === 'all') {
      args[key] = true;
      continue;
    }
    if (i + 1 >= raw.length) {
      throw new Error(`Option '${token}' needs a value`);
    }
    args[key] = raw[i + 1];
    i += 1;
  }

  if (!['list', 'patch', 'report', 'report-json', 'apply-diff-json', 'help'].includes(command)) {
    throw new Error(`Unknown command '${command}'`);
  }

  return { command, args };
}

function parseLangs(value, fallback, mode) {
  const raw = parseCsv(value || fallback).map((x) => x.toLowerCase());
  const langs = raw.length > 0 ? raw : ['kr'];
  const checker = mode === 'list' ? ALL_EXTERNAL_LANGS : [...SUPPORTED_PATCH_LANGS];
  const allowed = new Set(checker);
  for (const lang of langs) {
    if (!allowed.has(lang)) {
      throw new Error(`Unsupported lang '${lang}'. Allowed: ${[...allowed].join(', ')}`);
    }
  }
  return [...new Set(langs)];
}

function parseParts(value, langs, mode) {
  const defaultParts = (() => {
    if (mode === 'report') return ['ritual', 'skill', 'weapon', 'base_stats'];
    if (langs.length === 1 && langs[0] === 'kr') return ['ritual', 'skill', 'weapon', 'base_stats'];
    return ['ritual', 'skill', 'weapon'];
  })();

  const parts = value
    ? parseCsv(value).map((x) => x.toLowerCase())
    : defaultParts;

  const normalized = [];
  for (const part of parts) {
    if (part === 'all') {
      normalized.push('ritual', 'skill', 'weapon', 'base_stats');
      continue;
    }
    if (!['ritual', 'skill', 'weapon', 'base_stats'].includes(part)) {
      throw new Error(`Unsupported part '${part}'`);
    }
    normalized.push(part);
  }
  return [...new Set(normalized)];
}

function parseAst(code) {
  return recast.parse(code, {
    parser: {
      parse(source) {
        return babelParser.parse(source, {
          sourceType: 'script',
          plugins: [
            'jsx',
            'classProperties',
            'objectRestSpread',
            'optionalChaining',
            'numericSeparator'
          ]
        });
      }
    }
  });
}

function parseExpressionFromValue(value) {
  const code = `const __x = ${JSON.stringify(value, null, 2)};`;
  const ast = parseAst(code);
  return ast.program.body[0].declarations[0].init;
}

function getMemberPropName(node) {
  if (!node) return null;
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'StringLiteral' || node.type === 'Literal') return node.value;
  return null;
}

function getLiteralValue(node) {
  if (!node) return null;
  if (node.type === 'StringLiteral' || node.type === 'Literal') return String(node.value);
  if (node.type === 'NumericLiteral') return String(node.value);
  return null;
}

function isWindowKeyAssignment(expr, windowName, charKey) {
  if (!expr || expr.type !== 'AssignmentExpression') return false;
  const left = expr.left;
  if (!left || left.type !== 'MemberExpression') return false;
  if (!left.computed) return false;
  const key = getLiteralValue(left.property);
  if (key == null || key !== String(charKey)) return false;

  const obj = left.object;
  if (!obj || obj.type !== 'MemberExpression') return false;
  if (obj.computed) return false;

  const win = obj.object;
  if (!win || win.type !== 'Identifier' || win.name !== 'window') return false;
  const prop = getMemberPropName(obj.property);
  return prop === windowName;
}

function hasWindowInit(ast, windowName) {
  let found = false;
  recast.types.visit(ast, {
    visitExpressionStatement(p) {
      const expr = p.node.expression;
      if (
        expr &&
        expr.type === 'AssignmentExpression' &&
        expr.left &&
        expr.left.type === 'MemberExpression' &&
        !expr.left.computed &&
        expr.left.object &&
        expr.left.object.type === 'Identifier' &&
        expr.left.object.name === 'window' &&
        getMemberPropName(expr.left.property) === windowName
      ) {
        found = true;
        return false;
      }
      this.traverse(p);
    }
  });
  return found;
}
function upsertWindowEntry(filePath, windowName, charKey, nextValue, { dryRun = false } = {}) {
  const original = fs.readFileSync(filePath, 'utf8');
  const ast = parseAst(original);
  const nextExpr = parseExpressionFromValue(nextValue);

  let updated = false;
  recast.types.visit(ast, {
    visitExpressionStatement(p) {
      const expr = p.node.expression;
      if (isWindowKeyAssignment(expr, windowName, charKey)) {
        expr.right = nextExpr;
        updated = true;
        return false;
      }
      this.traverse(p);
    }
  });

  if (!updated) {
    if (!hasWindowInit(ast, windowName)) {
      const initStmt = parseAst(`window.${windowName} = window.${windowName} || {};`).program.body[0];
      ast.program.body.push(initStmt);
    }

    const left = b.memberExpression(
      b.memberExpression(b.identifier('window'), b.identifier(windowName), false),
      b.stringLiteral(String(charKey)),
      true
    );
    const assignStmt = b.expressionStatement(b.assignmentExpression('=', left, nextExpr));
    ast.program.body.push(assignStmt);
  }

  const nextCode = recast.print(ast).code;
  const changed = nextCode !== original;
  if (changed && !dryRun) {
    fs.writeFileSync(filePath, nextCode, 'utf8');
  }
  return changed;
}

function loadWindowObject(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: {} };
  try {
    vm.runInNewContext(code, sandbox, { timeout: 3000 });
    return sandbox.window || {};
  } catch (error) {
    warn(`Failed to evaluate JS '${filePath}': ${error.message}`);
    return {};
  }
}

function readWindowEntry(filePath, windowName, charKey) {
  const win = loadWindowObject(filePath);
  const table = win[windowName];
  if (!table || typeof table !== 'object') return {};
  const value = table[charKey];
  if (!value || typeof value !== 'object') return {};
  return value;
}

function clone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function deepMerge(base, patch) {
  if (!isPlainObject(base)) return clone(patch);
  if (!isPlainObject(patch)) return clone(patch);
  const out = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    if (isPlainObject(value) && isPlainObject(out[key])) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = clone(value);
    }
  }
  return out;
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
      if (Number.isInteger(index)) {
        tokens.push({ type: 'index', index });
      }
      i = close + 1;
      continue;
    }
    buffer += ch;
    i += 1;
  }
  if (buffer) {
    tokens.push({ type: 'prop', key: buffer });
  }
  return tokens;
}

function getValueAtDiffPath(root, pathText) {
  const tokens = tokenizeDiffPath(pathText);
  let cur = root;
  for (const token of tokens) {
    if (cur === undefined || cur === null) return undefined;
    if (token.type === 'prop') {
      cur = cur[token.key];
      continue;
    }
    if (!Array.isArray(cur)) return undefined;
    cur = cur[token.index];
  }
  return cur;
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
      } else {
        if (!isPlainObject(child)) child = {};
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
    } else {
      if (!isPlainObject(child)) child = {};
    }

    cur[token.index] = child;
    parent = cur;
    parentToken = token;
    cur = child;
  }

  const finalToken = tokens[tokens.length - 1];
  const nextCloned = clone(nextValue);
  if (finalToken.type === 'prop') {
    if (!isPlainObject(cur) && !Array.isArray(cur)) {
      replaceCurrent({});
    }
    cur[finalToken.key] = nextCloned;
  } else {
    if (!Array.isArray(cur)) {
      replaceCurrent([]);
    }
    while (cur.length <= finalToken.index) cur.push(undefined);
    cur[finalToken.index] = nextCloned;
  }

  return out;
}

function normalizeCodeName(value) {
  return String(value || '')
    .trim()
    .replace(/\uCA8C/g, '\u00B7')
    .toUpperCase();
}

function loadCodenameEntries() {
  if (!fs.existsSync(CODENAME_FILE)) {
    throw new Error(`Missing codename file: ${CODENAME_FILE}`);
  }
  const parsed = JSON.parse(fs.readFileSync(CODENAME_FILE, 'utf8'));
  if (!Array.isArray(parsed)) {
    throw new Error(`Invalid codename format: ${CODENAME_FILE}`);
  }
  return parsed.map((entry, index) => ({
    index: index + 1,
    api: String(entry.api || '').trim(),
    local: String(entry.local || '').trim(),
    key: String(entry.key || '').trim()
  }));
}

function loadCharacterKeyMapFromKr() {
  if (!fs.existsSync(KR_CHARACTER_META_FILE)) {
    throw new Error(`Missing KR character metadata: ${KR_CHARACTER_META_FILE}`);
  }
  const win = loadWindowObject(KR_CHARACTER_META_FILE);
  const data = win.characterData || {};
  const map = new Map();
  for (const [characterKey, value] of Object.entries(data)) {
    const codename = value?.codename;
    if (!codename) continue;
    map.set(normalizeCodeName(codename), characterKey);
  }
  return map;
}

function resolveCharacterKey(entry, characterKeyMap) {
  const fromKr = characterKeyMap.get(normalizeCodeName(entry.local));
  if (fromKr) return fromKr;
  if (entry.key) return entry.key;
  return null;
}

const externalFileCache = new Map();

function getExternalFileMap(kind, lang) {
  const cacheKey = `${kind}:${lang}`;
  if (externalFileCache.has(cacheKey)) return externalFileCache.get(cacheKey);

  const dir = path.join(PROJECT_ROOT, 'data', 'external', kind, lang);
  const map = new Map();
  if (fs.existsSync(dir)) {
    for (const fileName of fs.readdirSync(dir)) {
      if (!fileName.endsWith('.json')) continue;
      const stem = fileName.slice(0, -5);
      map.set(normalizeCodeName(stem), path.join(dir, fileName));
    }
  }
  externalFileCache.set(cacheKey, map);
  return map;
}

function readExternalJson(kind, lang, localCode) {
  const fileMap = getExternalFileMap(kind, lang);
  const filePath = fileMap.get(normalizeCodeName(localCode));
  if (!filePath || !fs.existsSync(filePath)) {
    return { ok: false, reason: 'missing', filePath: null, json: null };
  }

  try {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!json || json.status !== 0 || !json.data) {
      return { ok: false, reason: 'invalid_payload', filePath, json };
    }
    return { ok: true, reason: 'ok', filePath, json };
  } catch (error) {
    return { ok: false, reason: `parse_error:${error.message}`, filePath, json: null };
  }
}

function parseSevenNumbers(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const parts = raw.split('/').map((x) => Number.parseFloat(String(x).trim()));
  if (parts.length !== 7 || parts.some((x) => Number.isNaN(x))) return null;
  return parts;
}

function parseCost(raw) {
  if (!raw || typeof raw !== 'string') return {};
  const m = raw.match(/\b(SP|HP)\s*:?\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (!m) return {};
  const key = String(m[1]).toUpperCase();
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return {};
  return key === 'SP' ? { sp: value } : { hp: value };
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function inferTypeFromTags(tags) {
  const list = (Array.isArray(tags) ? tags : tags ? [tags] : [])
    .map((x) => String(x || '').toLowerCase());
  if (list.some((x) => x.includes('single') || x.includes(KR.single))) return KR.damageSingle;
  if (list.some((x) => x.includes('aoe') || x.includes(KR.aoe) || x.includes(KR.whole))) return KR.damageAoe;
  if (list.some((x) => x.includes('buff') || x.includes('support') || x.includes(KR.buff) || x.includes('\u88DC\u52A9'))) return KR.buff;
  if (list.some((x) => x.includes('debuff') || x.includes(KR.debuff) || x.includes(KR.weaken))) return KR.debuff;
  return undefined;
}

function inferElementKr(group, tags, nature) {
  if (group === 'assist') return KR.buff;
  if (group === 'passive') return KR.passive;

  const list = (Array.isArray(tags) ? tags : tags ? [tags] : [])
    .map((x) => String(x || '').toLowerCase());
  if (list.some((x) => x.includes('buff') || x.includes('support') || x.includes(KR.buff) || x.includes('\u88DC\u52A9'))) return KR.buff;
  if (list.some((x) => x.includes('debuff') || x.includes(KR.debuff) || x.includes(KR.weaken))) return KR.debuff;

  const n = String(nature || '').trim();
  if (NATURE_TO_ELEMENT_KR[n]) return NATURE_TO_ELEMENT_KR[n];

  if ([
    KR.elementIce, KR.elementElectric, KR.elementFire, KR.elementWind, KR.elementNuclear, KR.elementPsy,
    KR.elementBless, KR.elementCurse, KR.elementPhys, KR.elementGun, KR.elementAlmighty, KR.buff, KR.debuff, KR.passive
  ].includes(n)) {
    return n;
  }

  return undefined;
}
function transformSkillItem(item, options = {}) {
  if (!item || typeof item !== 'object') return null;
  const group = options.group || 'normal';
  const keepName = options.keepName !== false;
  const removeName = options.removeName === true;

  const out = {};
  if (keepName && !removeName && item.name) out.name = item.name;

  const element = inferElementKr(group, item.tags, item.nature || item.element);
  if (element) out.element = element;

  const type = inferTypeFromTags(item.tags);
  if (type) out.type = type;

  const costObj = parseCost(item.cost);
  if (costObj.sp !== undefined) out.sp = costObj.sp;
  if (costObj.hp !== undefined) out.hp = costObj.hp;
  if (typeof item.cooldown === 'number') out.cool = item.cooldown;
  if (hasText(item.desc)) out.description = item.desc;

  return out;
}

function getSkillRoot(data) {
  if (!data || typeof data !== 'object') return {};
  if (data.skill && typeof data.skill === 'object') return data.skill;
  return data;
}

function buildSkillPayload(external) {
  const payload = {};
  const data = external?.data || {};
  const skillRoot = getSkillRoot(data);

  if (typeof data.name === 'string' && data.name.trim()) {
    payload.name = data.name;
  }

  const normal = Array.isArray(skillRoot.normal_skill) ? skillRoot.normal_skill : [];
  for (let i = 0; i < normal.length; i += 1) {
    const transformed = transformSkillItem(normal[i], { group: 'normal' });
    if (!transformed) continue;
    payload[`skill${i + 1}`] = transformed;
  }

  const assist = Array.isArray(skillRoot.assist_skill) ? skillRoot.assist_skill : [];
  if (assist[0]) {
    const transformed = transformSkillItem(assist[0], { group: 'assist' });
    if (transformed) payload.skill_support = transformed;
  }

  const passive = Array.isArray(skillRoot.passive_skill) ? skillRoot.passive_skill : [];
  if (passive[0]) {
    const transformed = transformSkillItem(passive[0], { group: 'passive' });
    if (transformed) payload.passive1 = transformed;
  }
  if (passive[1]) {
    const transformed = transformSkillItem(passive[1], { group: 'passive' });
    if (transformed) payload.passive2 = transformed;
  }

  const theurgia = Array.isArray(skillRoot.theurgia_skill) ? skillRoot.theurgia_skill : [];
  if (theurgia[0]) {
    const transformed = transformSkillItem(theurgia[0], { group: 'theurgia', keepName: true });
    if (transformed) payload.skill_highlight = transformed;
  } else {
    const highlightRaw = skillRoot.highlight_skill;
    const highlight = Array.isArray(highlightRaw)
      ? highlightRaw[0]
      : highlightRaw && typeof highlightRaw === 'object'
        ? highlightRaw
        : null;
    if (highlight) {
      const transformed = transformSkillItem(highlight, { group: 'highlight', removeName: true, keepName: false });
      if (transformed) payload.skill_highlight = transformed;
    }
  }

  if (theurgia[1]) {
    const transformed = transformSkillItem(theurgia[1], { group: 'theurgia', keepName: true });
    if (transformed) payload.skill_highlight2 = transformed;
  }

  return payload;
}

function buildRitualPayload(external) {
  const payload = {};
  const data = external?.data || {};
  const skillRoot = getSkillRoot(data);

  if (typeof data.name === 'string' && data.name.trim()) {
    payload.name = data.name;
  }

  const ascend = Array.isArray(skillRoot.ascend_skill)
    ? skillRoot.ascend_skill
    : Array.isArray(data.ascend_skill)
      ? data.ascend_skill
      : [];

  for (let i = 0; i < Math.min(ascend.length, 7); i += 1) {
    const item = ascend[i];
    if (!item) continue;
    if (hasText(item.name)) payload[`r${i}`] = item.name;
    if (hasText(item.desc)) payload[`r${i}_detail`] = item.desc;
  }
  return payload;
}

function toNumberOrKeep(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function buildWeaponPayload(externalWeapon) {
  const payload = {};
  const data = externalWeapon?.data || {};
  const five = Array.isArray(data.fiveStar) ? data.fiveStar : [];
  const four = Array.isArray(data.fourStar) ? data.fourStar : [];

  five.forEach((item, idx) => {
    const record = {};
    if (hasText(item?.name)) record.name = item.name;
    if (item?.stat?.hp !== undefined) record.health = toNumberOrKeep(item.stat.hp);
    if (item?.stat?.attack !== undefined) record.attack = toNumberOrKeep(item.stat.attack);
    if (item?.stat?.defense !== undefined) record.defense = toNumberOrKeep(item.stat.defense);
    if (hasText(item?.skill)) record.description = item.skill;
    if (Object.keys(record).length > 0) {
      payload[`weapon5-${idx + 1}`] = record;
    }
  });

  four.forEach((item, idx) => {
    const record = {};
    if (hasText(item?.name)) record.name = item.name;
    if (item?.stat?.hp !== undefined) record.health = toNumberOrKeep(item.stat.hp);
    if (item?.stat?.attack !== undefined) record.attack = toNumberOrKeep(item.stat.attack);
    if (item?.stat?.defense !== undefined) record.defense = toNumberOrKeep(item.stat.defense);
    if (hasText(item?.skill)) record.description = item.skill;
    if (Object.keys(record).length > 0) {
      payload[`weapon4-${idx + 1}`] = record;
    }
  });

  return payload;
}

function buildBaseStatsPayload(external, existing) {
  const out = isPlainObject(existing) ? clone(existing) : {};
  const data = external?.data || {};
  const stats = data.stats || data.stat || null;

  if (stats) {
    const atk = parseSevenNumbers(stats.Attack);
    const def = parseSevenNumbers(stats.Defense);
    const hp = parseSevenNumbers(stats.HP);
    if (atk && def && hp) {
      for (let i = 0; i < 7; i += 1) {
        const key = `a${i}_lv80`;
        const cur = isPlainObject(out[key]) ? { ...out[key] } : {};
        cur.HP = hp[i];
        cur.attack = atk[i];
        cur.defense = def[i];
        out[key] = cur;
      }
    }
  }

  const stat100 = data.stat_100 || data.stat100 || null;
  if (stat100) {
    const atk100 = parseSevenNumbers(stat100.Attack);
    const def100 = parseSevenNumbers(stat100.Defense);
    const hp100 = parseSevenNumbers(stat100.HP);
    if (atk100 && def100 && hp100) {
      for (let i = 0; i < 7; i += 1) {
        const key = `a${i}_lv100`;
        const cur = isPlainObject(out[key]) ? { ...out[key] } : {};
        cur.HP = hp100[i];
        cur.attack = atk100[i];
        cur.defense = def100[i];
        out[key] = cur;
      }
    }
  }

  return out;
}

function resolveWindowName(part, lang) {
  return WINDOW_NAME_MAP[part]?.[lang] || null;
}

function getTargetFilePath(characterKey, part) {
  return path.join(CHARACTER_ROOT, characterKey, FILE_NAME_MAP[part]);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function replaceTemplateKey(content, characterKey) {
  return content.replace(/\[""\]/g, `[${JSON.stringify(characterKey)}]`);
}

function bootstrapCharacterFiles(characterKey, { dryRun = false } = {}) {
  const targetDir = path.join(CHARACTER_ROOT, characterKey);
  if (!fs.existsSync(TEMPLATE_ROOT)) {
    throw new Error(`Template not found: ${TEMPLATE_ROOT}`);
  }

  if (!fs.existsSync(targetDir)) {
    if (!dryRun) ensureDir(targetDir);
    log(`[bootstrap] create directory: data/characters/${characterKey}`);
  }

  for (const fileName of fs.readdirSync(TEMPLATE_ROOT)) {
    const src = path.join(TEMPLATE_ROOT, fileName);
    const dst = path.join(targetDir, fileName);
    if (!fs.statSync(src).isFile()) continue;
    if (fs.existsSync(dst)) continue;
    const content = fs.readFileSync(src, 'utf8');
    const replaced = replaceTemplateKey(content, characterKey);
    if (!dryRun) fs.writeFileSync(dst, replaced, 'utf8');
    log(`[bootstrap] create file: data/characters/${characterKey}/${fileName}`);
  }
}

function pickEntriesBySelectors(entries, selectors) {
  const byApi = new Map(entries.map((x) => [String(x.api).toLowerCase(), x]));
  const byLocal = new Map(entries.map((x) => [normalizeCodeName(x.local), x]));
  const byIndex = new Map(entries.map((x) => [x.index, x]));
  const picked = new Map();

  for (const api of selectors.apis) {
    const hit = byApi.get(String(api).toLowerCase());
    if (!hit) {
      warn(`api not found in codename list: ${api}`);
      continue;
    }
    picked.set(hit.index, hit);
  }

  for (const local of selectors.locals) {
    const hit = byLocal.get(normalizeCodeName(local));
    if (!hit) {
      warn(`local not found in codename list: ${local}`);
      continue;
    }
    picked.set(hit.index, hit);
  }

  for (const idx of selectors.nums) {
    const hit = byIndex.get(idx);
    if (!hit) {
      warn(`index out of range: ${idx}`);
      continue;
    }
    picked.set(hit.index, hit);
  }

  return [...picked.values()].sort((a, b) => a.index - b.index);
}

function getSelectors(args) {
  const selectors = {
    apis: parseCsv(args.api),
    locals: parseCsv(args.local),
    nums: []
  };
  if (args.nums) {
    selectors.nums = parseNumRanges(args.nums);
  }
  return selectors;
}

function createPatchPayload(part, lang, sources, existing) {
  if (part === 'skill') return buildSkillPayload(sources.character);
  if (part === 'ritual') return buildRitualPayload(sources.character);
  if (part === 'weapon') return buildWeaponPayload(sources.weapon);
  if (part === 'base_stats') return buildBaseStatsPayload(sources.character, existing);
  return {};
}

function loadSources(localCode, lang) {
  return {
    character: readExternalJson('character', lang, localCode).json,
    characterMeta: readExternalJson('character', lang, localCode),
    weapon: readExternalJson('weapon', lang, localCode).json,
    weaponMeta: readExternalJson('weapon', lang, localCode)
  };
}
function runPatch(options) {
  const codenameEntries = loadCodenameEntries();
  const selectors = getSelectors(options.args);
  const selected = pickEntriesBySelectors(codenameEntries, selectors);
  if (selected.length === 0) {
    fail('No target selected. Use --api / --local / --nums');
  }

  const langs = parseLangs(options.args.langs, 'kr', 'patch');
  const parts = parseParts(options.args.parts, langs, 'patch');
  const characterKeyMap = loadCharacterKeyMapFromKr();
  const bootstrap = options.args['no-bootstrap'] ? false : true;
  const dryRun = Boolean(options.args['dry-run']);

  const patchedTargets = new Set();
  const resultRows = [];

  for (const entry of selected) {
    const localNorm = normalizeCodeName(entry.local);
    const characterKey = resolveCharacterKey(entry, characterKeyMap);
    if (!characterKey) {
      warn(`character key not found for local='${entry.local}'. Add key in codename.json or KR characters.js.`);
      continue;
    }

    if (bootstrap) {
      bootstrapCharacterFiles(characterKey, { dryRun });
    }

    for (const lang of langs) {
      const sources = loadSources(entry.local, lang);
      const row = {
        index: entry.index,
        api: entry.api,
        local: entry.local,
        key: characterKey,
        lang,
        changedParts: [],
        skippedParts: []
      };

      for (const part of parts) {
        if (part === 'base_stats' && lang !== 'kr') {
          row.skippedParts.push(`${part}:not_kr`);
          continue;
        }

        const windowName = resolveWindowName(part, lang);
        if (!windowName) {
          row.skippedParts.push(`${part}:unsupported_lang`);
          continue;
        }

        const filePath = getTargetFilePath(characterKey, part);
        if (!fs.existsSync(filePath)) {
          if (bootstrap) {
            bootstrapCharacterFiles(characterKey, { dryRun });
          }
        }
        if (!fs.existsSync(filePath)) {
          row.skippedParts.push(`${part}:file_missing`);
          continue;
        }

        if (part === 'weapon') {
          if (!sources.weaponMeta.ok) {
            row.skippedParts.push(`${part}:${sources.weaponMeta.reason}`);
            continue;
          }
        } else {
          if (!sources.characterMeta.ok) {
            row.skippedParts.push(`${part}:${sources.characterMeta.reason}`);
            continue;
          }
        }

        const existing = readWindowEntry(filePath, windowName, characterKey);
        const payload = createPatchPayload(part, lang, sources, existing);
        if (!payload || Object.keys(payload).length === 0) {
          row.skippedParts.push(`${part}:empty_payload`);
          continue;
        }
        const nextValue = deepMerge(existing, payload);
        if (equals(existing, nextValue)) {
          row.skippedParts.push(`${part}:no_change`);
          continue;
        }
        const changed = upsertWindowEntry(filePath, windowName, characterKey, nextValue, { dryRun });
        if (changed) {
          row.changedParts.push(part);
        } else {
          row.skippedParts.push(`${part}:no_change`);
        }
      }

      resultRows.push(row);
      if (row.changedParts.length > 0) {
        patchedTargets.add(`${lang}|${normalizeCodeName(entry.local)}`);
      }
    }
  }

  for (const row of resultRows) {
    const changed = row.changedParts.length > 0 ? row.changedParts.join(',') : '-';
    const skipped = row.skippedParts.length > 0 ? row.skippedParts.join(', ') : '-';
    log(`[patch] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${row.lang} changed=[${changed}] skipped=[${skipped}]`);
  }

  if (!options.args['no-report']) {
    const reportFile = options.args['report-file'] || DEFAULT_REPORT_FILE;
    const reportLangs = langs;
    writePendingReport({
      codenameEntries,
      characterKeyMap,
      langs: reportLangs,
      parts: parseParts(options.args.parts, reportLangs, 'report'),
      excludeTargets: patchedTargets,
      reportFile
    });
  }
}

function buildDiffRecord(entry, characterKey, lang, part, sources) {
  const windowName = resolveWindowName(part, lang);
  if (!windowName) return null;
  const filePath = getTargetFilePath(characterKey, part);
  if (!fs.existsSync(filePath)) {
    return {
      part,
      diffCount: 1,
      samplePaths: ['<file_missing>']
    };
  }

  if (part === 'weapon') {
    if (!sources.weaponMeta.ok) return null;
  } else if (!sources.characterMeta.ok) {
    return null;
  }

  const current = readWindowEntry(filePath, windowName, characterKey);
  const payload = createPatchPayload(part, lang, sources, current);
  if (!payload || Object.keys(payload).length === 0) return null;
  const nextValue = deepMerge(current, payload);
  if (equals(current, nextValue)) return null;
  const paths = diffPaths(current, nextValue).filter(Boolean);
  const samplePaths = paths.slice(0, 6);
  const valueDiffs = samplePaths.map((pathText) => {
    const beforeRaw = getValueAtDiffPath(current, pathText);
    const afterRaw = getValueAtDiffPath(nextValue, pathText);
    return {
      path: pathText,
      before: beforeRaw === undefined ? null : clone(beforeRaw),
      after: afterRaw === undefined ? null : clone(afterRaw)
    };
  });
  return {
    part,
    diffCount: paths.length,
    samplePaths,
    valueDiffs
  };
}

function collectPendingRows({ codenameEntries, characterKeyMap, langs, parts, excludeTargets }) {
  const rows = [];

  for (const entry of codenameEntries) {
    const localNorm = normalizeCodeName(entry.local);
    const characterKey = resolveCharacterKey(entry, characterKeyMap);
    if (!characterKey) continue;

    for (const lang of langs) {
      const excludeKey = `${lang}|${localNorm}`;
      if (excludeTargets.has(excludeKey)) continue;

      const sources = loadSources(entry.local, lang);
      const partDiffs = [];
      for (const part of parts) {
        if (part === 'base_stats' && lang !== 'kr') continue;
        const diff = buildDiffRecord(entry, characterKey, lang, part, sources);
        if (diff) partDiffs.push(diff);
      }
      if (partDiffs.length === 0) continue;

      rows.push({
        index: entry.index,
        api: entry.api,
        local: entry.local,
        key: characterKey,
        lang,
        partDiffs
      });
    }
  }

  rows.sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index;
    return a.lang.localeCompare(b.lang);
  });
  return rows;
}

function writePendingReport({ codenameEntries, characterKeyMap, langs, parts, excludeTargets, reportFile }) {
  const rows = collectPendingRows({
    codenameEntries,
    characterKeyMap,
    langs,
    parts,
    excludeTargets
  });

  const lines = [];
  lines.push('# Character Patch Pending Report');
  lines.push('');
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push(`- Languages: ${langs.join(', ')}`);
  lines.push(`- Pending rows: ${rows.length}`);
  lines.push('');
  lines.push('## Rows');
  lines.push('');
  lines.push('| # | Lang | API | Local | Key | Parts | Diff Sample |');
  lines.push('|---:|:---:|:---|:---|:---|:---|:---|');

  for (const row of rows) {
    const partsText = row.partDiffs.map((d) => `${d.part}(${d.diffCount})`).join(', ');
    const sample = row.partDiffs
      .map((d) => `${d.part}: ${d.samplePaths.join(', ')}`)
      .join(' / ');
    lines.push(`| ${row.index} | ${row.lang} | ${row.api} | ${row.local} | ${row.key} | ${partsText} | ${sample} |`);
  }

  ensureDir(path.dirname(reportFile));
  fs.writeFileSync(reportFile, `${lines.join('\n')}\n`, 'utf8');
  log(`[report] wrote: ${path.relative(PROJECT_ROOT, reportFile)} (${rows.length} rows)`);
}

function runReport(options) {
  const finalEntries = resolveReportTargets(options);
  const characterKeyMap = loadCharacterKeyMapFromKr();
  const langs = parseLangs(options.args.langs, 'kr,en,jp', 'report');
  const parts = parseParts(options.args.parts, langs, 'report');
  const reportFile = options.args['report-file'] || DEFAULT_REPORT_FILE;

  writePendingReport({
    codenameEntries: finalEntries,
    characterKeyMap,
    langs,
    parts,
    excludeTargets: new Set(),
    reportFile
  });
}

function resolveReportTargets(options) {
  const codenameEntries = loadCodenameEntries();
  const selectors = getSelectors(options.args);
  const includeAll = Boolean(options.args.all);
  const includeSelected = includeAll ? codenameEntries : pickEntriesBySelectors(codenameEntries, selectors);
  if (includeSelected.length === 0) {
    fail('No target selected for report. Use --all or --api/--local/--nums');
  }

  const includeSet = new Set(includeSelected.map((x) => x.index));
  const filteredEntries = codenameEntries.filter((x) => includeSet.has(x.index));

  const excludeSelectors = {
    apis: parseCsv(options.args['exclude-api']),
    locals: parseCsv(options.args['exclude-local']),
    nums: options.args['exclude-nums'] ? parseNumRanges(options.args['exclude-nums']) : []
  };
  const excludeRows = pickEntriesBySelectors(codenameEntries, excludeSelectors);
  const excludeSet = new Set(excludeRows.map((x) => x.index));
  return filteredEntries.filter((x) => !excludeSet.has(x.index));
}

function runReportJson(options) {
  const finalEntries = resolveReportTargets(options);
  const characterKeyMap = loadCharacterKeyMapFromKr();
  const langs = parseLangs(options.args.langs, 'kr,en,jp', 'report');
  const parts = parseParts(options.args.parts, langs, 'report');
  const jsonFile = options.args['json-file'] || DEFAULT_REPORT_JSON_FILE;
  const rows = collectPendingRows({
    codenameEntries: finalEntries,
    characterKeyMap,
    langs,
    parts,
    excludeTargets: new Set()
  });
  const payload = {
    generatedAt: new Date().toISOString(),
    languages: langs,
    rowCount: rows.length,
    rows
  };
  ensureDir(path.dirname(jsonFile));
  fs.writeFileSync(jsonFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  log(`[report-json] wrote: ${path.relative(PROJECT_ROOT, jsonFile)} (${rows.length} rows)`);
}

function runApplyDiffJson(options) {
  const inputFileRaw = String(options.args['input-file'] || '').trim();
  if (!inputFileRaw) {
    fail("apply-diff-json requires '--input-file'");
  }

  const inputFile = path.resolve(PROJECT_ROOT, inputFileRaw);
  if (!inputFile.startsWith(PROJECT_ROOT)) {
    fail(`input-file is outside project root: ${inputFileRaw}`);
  }
  if (!fs.existsSync(inputFile)) {
    fail(`input-file not found: ${inputFileRaw}`);
  }

  let parsedInput;
  try {
    const raw = fs.readFileSync(inputFile, 'utf8').replace(/^\uFEFF/, '');
    parsedInput = JSON.parse(raw);
  } catch (error) {
    fail(`input-file parse failed: ${error.message}`);
  }

  const tasks = Array.isArray(parsedInput?.tasks) ? parsedInput.tasks : [];
  if (tasks.length === 0) {
    fail(`No tasks in input-file: ${inputFileRaw}`);
  }

  const codenameEntries = loadCodenameEntries();
  const byIndex = new Map(codenameEntries.map((entry) => [entry.index, entry]));
  const characterKeyMap = loadCharacterKeyMapFromKr();
  const dryRun = Boolean(options.args['dry-run']);

  let changedPartsTotal = 0;
  let changedPathsTotal = 0;
  const resultRows = [];

  for (const task of tasks) {
    const index = Number(task?.index);
    const lang = String(task?.lang || '').trim().toLowerCase();
    if (!Number.isInteger(index) || !lang) {
      warn(`invalid task skipped: ${JSON.stringify(task)}`);
      continue;
    }

    const entry = byIndex.get(index);
    if (!entry) {
      warn(`index not found in codename list: ${index}`);
      continue;
    }

    const characterKey = resolveCharacterKey(entry, characterKeyMap);
    if (!characterKey) {
      warn(`character key not found for index=${index}, local='${entry.local}'`);
      continue;
    }

    const row = {
      index,
      api: entry.api,
      local: entry.local,
      key: characterKey,
      lang,
      changedParts: [],
      skippedParts: []
    };

    const sources = loadSources(entry.local, lang);
    const parts = Array.isArray(task?.parts) ? task.parts : [];
    for (const partTask of parts) {
      const part = String(partTask?.part || '').trim().toLowerCase();
      if (!['ritual', 'skill', 'weapon', 'base_stats'].includes(part)) {
        row.skippedParts.push(`${part || '(empty)'}:invalid_part`);
        continue;
      }
      if (part === 'base_stats' && lang !== 'kr') {
        row.skippedParts.push(`${part}:not_kr`);
        continue;
      }

      const paths = [...new Set(
        (Array.isArray(partTask?.paths) ? partTask.paths : [])
          .map((x) => String(x || '').trim())
          .filter(Boolean)
      )];
      if (paths.length === 0) {
        row.skippedParts.push(`${part}:no_paths`);
        continue;
      }

      const windowName = resolveWindowName(part, lang);
      if (!windowName) {
        row.skippedParts.push(`${part}:unsupported_lang`);
        continue;
      }

      const filePath = getTargetFilePath(characterKey, part);
      if (!fs.existsSync(filePath)) {
        row.skippedParts.push(`${part}:file_missing`);
        continue;
      }

      if (part === 'weapon') {
        if (!sources.weaponMeta.ok) {
          row.skippedParts.push(`${part}:${sources.weaponMeta.reason}`);
          continue;
        }
      } else if (!sources.characterMeta.ok) {
        row.skippedParts.push(`${part}:${sources.characterMeta.reason}`);
        continue;
      }

      const existing = readWindowEntry(filePath, windowName, characterKey);
      const partPayload = createPatchPayload(part, lang, sources, existing);
      if (!partPayload || Object.keys(partPayload).length === 0) {
        row.skippedParts.push(`${part}:empty_payload`);
        continue;
      }
      const nextValue = deepMerge(existing, partPayload);
      if (equals(existing, nextValue)) {
        row.skippedParts.push(`${part}:no_change`);
        continue;
      }

      let selectedValue = clone(existing);
      let changedPaths = 0;

      for (const pathText of paths) {
        const before = getValueAtDiffPath(existing, pathText);
        const after = getValueAtDiffPath(nextValue, pathText);
        if (after === undefined && pathText !== '<root>') {
          row.skippedParts.push(`${part}:${pathText}:path_not_found`);
          continue;
        }
        if (equals(before, after)) continue;
        selectedValue = setValueAtDiffPath(selectedValue, pathText, after);
        changedPaths += 1;
      }

      if (changedPaths === 0 || equals(existing, selectedValue)) {
        row.skippedParts.push(`${part}:no_selected_change`);
        continue;
      }

      const changed = upsertWindowEntry(filePath, windowName, characterKey, selectedValue, { dryRun });
      if (changed) {
        row.changedParts.push(`${part}(${changedPaths})`);
        changedPartsTotal += 1;
        changedPathsTotal += changedPaths;
      } else {
        row.skippedParts.push(`${part}:no_change`);
      }
    }

    resultRows.push(row);
  }

  for (const row of resultRows) {
    const changed = row.changedParts.length > 0 ? row.changedParts.join(',') : '-';
    const skipped = row.skippedParts.length > 0 ? row.skippedParts.join(', ') : '-';
    log(`[apply-diff-json] #${row.index} ${row.api}/${row.local} (${row.key}) lang=${row.lang} changed=[${changed}] skipped=[${skipped}]`);
  }

  log(`[apply-diff-json] summary: rows=${resultRows.length} changed_parts=${changedPartsTotal} changed_paths=${changedPathsTotal} dry_run=${dryRun ? 'Y' : 'N'}`);
}

function runList(options) {
  const entries = loadCodenameEntries();
  const langs = parseLangs(options.args.langs, 'kr,en,jp', 'list');
  const keyMap = loadCharacterKeyMapFromKr();

  log('Index | API | Local | CharacterKey | External(kr/en/jp/cn/tw/sea)');
  log('---|---|---|---|---');

  for (const entry of entries) {
    const key = resolveCharacterKey(entry, keyMap) || '(not-found)';
    const status = langs
      .map((lang) => {
        const meta = readExternalJson('character', lang, entry.local);
        const mark = meta.ok ? 'Y' : 'N';
        return `${lang}:${mark}`;
      })
      .join(' ');
    log(`${entry.index} | ${entry.api} | ${entry.local} | ${key} | ${status}`);
  }
}

function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv);
  } catch (error) {
    fail(error.message);
    return;
  }

  const options = parsed;

  try {
    if (options.command === 'help') {
      usage();
      return;
    }
    if (options.command === 'list') {
      runList(options);
      return;
    }
    if (options.command === 'patch') {
      runPatch(options);
      return;
    }
    if (options.command === 'report') {
      runReport(options);
      return;
    }
    if (options.command === 'report-json') {
      runReportJson(options);
      return;
    }
    if (options.command === 'apply-diff-json') {
      runApplyDiffJson(options);
      return;
    }
    usage();
  } catch (error) {
    fail(error?.message || String(error));
  }
}

main();

