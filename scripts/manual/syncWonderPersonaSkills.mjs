#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import vm from 'vm';

const ROOT = process.cwd();
const PERSONA_DIR = path.join(ROOT, 'data', 'persona');
const PERSONA_NONORDER_DIR = path.join(PERSONA_DIR, 'nonorder');
const SKILLS_FILE = path.join(ROOT, 'data', 'kr', 'wonder', 'skills.js');

const DEFAULT_REPORT_JSON = path.join(ROOT, 'scripts', 'reports', 'wonder-persona-skill-sync-report.json');
const DEFAULT_REPORT_MD = path.join(ROOT, 'scripts', 'reports', 'wonder-persona-skill-sync-report.md');
const DEFAULT_MISSING_PLAN_JSON = path.join(ROOT, 'scripts', 'reports', 'wonder-persona-skill-missing-plan.json');
const DEFAULT_MISSING_TRANSLATION_BACKLOG_JSON = path.join(ROOT, 'scripts', 'reports', 'wonder-persona-skill-missing-translation-backlog.json');
const DEFAULT_MISSING_OVERRIDES_JSON = path.join(ROOT, 'scripts', 'config', 'wonder-persona-skill-missing-overrides.json');

const DEFAULT_CONFLICT_OVERRIDES_JSON = path.join(ROOT, 'scripts', 'config', 'wonder-persona-skill-conflict-overrides.json');
const DEFAULT_ORPHAN_CN_OVERRIDES_JSON = path.join(ROOT, 'scripts', 'config', 'wonder-persona-skill-orphan-cn-overrides.json');

const INCLUDE_MISSING_MODES = ['none', 'auto', 'all', 'all-meta'];
const TARGET_FIELDS = ['name_en', 'name_jp', 'name_cn', 'description', 'description_en', 'description_jp', 'description_cn'];
const INSERT_REQUIRED_FIELDS = [...TARGET_FIELDS, 'type', 'target', 'icon'];
const META_REQUIRED_FIELDS = ['description', 'type', 'target', 'icon'];
const TRANSLATION_PENDING_FIELDS = ['name_en', 'name_jp', 'name_cn', 'description_en', 'description_jp', 'description_cn'];
const FIELD_MAP = [
  ['name_en', 'name_en'],
  ['name_jp', 'name_jp'],
  ['name_cn', 'name_cn'],
  ['description', 'desc'],
  ['description_en', 'desc_en'],
  ['description_jp', 'desc_jp'],
  ['description_cn', 'desc_cn']
];
const TARGET_TO_SOURCE_FIELD = Object.fromEntries(FIELD_MAP);

const TRACKED_SOURCE_FIELDS = ['name_en', 'name_jp', 'name_cn', 'desc', 'desc_en', 'desc_jp', 'desc_cn'];
const ROMAN_SUFFIX_RE = /\s*(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)$/u;
const PASSIVE_KEY_PATTERN = /(간파|강화|내성|면역|재능|률\s*UP|성공률\s*UP|마음가짐|소양|숨결|비호|코칭|기공|실드\s*강화|히트\s*업|반격|비의\s*노래|세월의\s*재앙|총탄의\s*열광)/u;
const SPECIAL_MISSING_META = new Map([
  ['가시창', { type: '공격', target: '단일', icon: '물리' }],
  ['랜더마이저', { type: '지원', target: '단일', icon: '디버프' }],
  ['심판의 호각', { type: '공격', target: '단일', icon: '빙결' }]
]);
const SKILL_FIELD_ORDER = [
  'name_jp',
  'name_en',
  'name_cn',
  'description',
  'description_jp',
  'description_en',
  'description_cn',
  'type',
  'target',
  'icon',
  'icon_gl'
];
const ROMAN_SYMBOL_TO_ASCII = new Map([
  ['Ⅰ', 'I'], ['Ⅱ', 'II'], ['Ⅲ', 'III'], ['Ⅳ', 'IV'], ['Ⅴ', 'V'], ['Ⅵ', 'VI'],
  ['Ⅶ', 'VII'], ['Ⅷ', 'VIII'], ['Ⅸ', 'IX'], ['Ⅹ', 'X'], ['Ⅺ', 'XI'], ['Ⅻ', 'XII']
]);

function parseArgs(argv) {
  const args = argv.slice(2);
  const out = {
    mode: 'dry-run',
    strictConflict: false,
    includeMissing: 'none',
    reportJson: DEFAULT_REPORT_JSON,
    reportMd: DEFAULT_REPORT_MD,
    missingPlanJson: DEFAULT_MISSING_PLAN_JSON,
    missingTranslationBacklogJson: DEFAULT_MISSING_TRANSLATION_BACKLOG_JSON,
    missingOverridesJson: DEFAULT_MISSING_OVERRIDES_JSON,
    conflictOverridesJson: DEFAULT_CONFLICT_OVERRIDES_JSON,
    orphanCnOverridesJson: DEFAULT_ORPHAN_CN_OVERRIDES_JSON
  };
  for (let i = 0; i < args.length; i += 1) {
    const token = String(args[i] || '').trim();
    if (!token) continue;
    if (token === '--apply') { out.mode = 'apply'; continue; }
    if (token === '--dry-run') { out.mode = 'dry-run'; continue; }
    if (token === '--strict-conflict') { out.strictConflict = true; continue; }
    if (token === '--include-missing' && i + 1 < args.length) {
      const mode = normalizeWhitespace(args[i + 1]).toLowerCase();
      if (!INCLUDE_MISSING_MODES.includes(mode)) {
        throw new Error(`Invalid --include-missing value: ${args[i + 1]} (expected: ${INCLUDE_MISSING_MODES.join('|')})`);
      }
      out.includeMissing = mode;
      i += 1;
      continue;
    }
    if (token === '--report-json' && i + 1 < args.length) { out.reportJson = path.resolve(ROOT, String(args[i + 1])); i += 1; continue; }
    if (token === '--report-md' && i + 1 < args.length) { out.reportMd = path.resolve(ROOT, String(args[i + 1])); i += 1; continue; }
    if (token === '--missing-plan-json' && i + 1 < args.length) { out.missingPlanJson = path.resolve(ROOT, String(args[i + 1])); i += 1; continue; }
    if (token === '--missing-translation-backlog-json' && i + 1 < args.length) { out.missingTranslationBacklogJson = path.resolve(ROOT, String(args[i + 1])); i += 1; continue; }
    if (token === '--missing-overrides-json' && i + 1 < args.length) { out.missingOverridesJson = path.resolve(ROOT, String(args[i + 1])); i += 1; continue; }
    if (token === '--conflict-overrides-json' && i + 1 < args.length) { out.conflictOverridesJson = path.resolve(ROOT, String(args[i + 1])); i += 1; continue; }
    if (token === '--orphan-cn-overrides-json' && i + 1 < args.length) { out.orphanCnOverridesJson = path.resolve(ROOT, String(args[i + 1])); i += 1; continue; }
    if (token === '--help' || token === '-h') { printUsage(); process.exit(0); }
  }
  return out;
}

function printUsage() {
  process.stdout.write(`Usage:
  node scripts/syncWonderPersonaSkills.mjs --dry-run
  node scripts/syncWonderPersonaSkills.mjs --apply
  node scripts/syncWonderPersonaSkills.mjs --apply --strict-conflict
  node scripts/syncWonderPersonaSkills.mjs --dry-run --include-missing auto
  node scripts/syncWonderPersonaSkills.mjs --apply --include-missing all
  node scripts/syncWonderPersonaSkills.mjs --apply --include-missing all-meta
  node scripts/syncWonderPersonaSkills.mjs --report-json scripts/reports/wonder-persona-skill-sync-report.json --report-md scripts/reports/wonder-persona-skill-sync-report.md
  node scripts/syncWonderPersonaSkills.mjs --missing-plan-json scripts/reports/wonder-persona-skill-missing-plan.json
  node scripts/syncWonderPersonaSkills.mjs --missing-translation-backlog-json scripts/reports/wonder-persona-skill-missing-translation-backlog.json
  node scripts/syncWonderPersonaSkills.mjs --missing-overrides-json scripts/config/wonder-persona-skill-missing-overrides.json
  node scripts/syncWonderPersonaSkills.mjs --conflict-overrides-json scripts/config/wonder-persona-skill-conflict-overrides.json --orphan-cn-overrides-json scripts/config/wonder-persona-skill-orphan-cn-overrides.json
`);
}

function normalizeWhitespace(value) {
  return String(value || '').normalize('NFC').replace(/\s+/g, ' ').trim();
}

function normalizeSkillKey(raw) {
  let value = normalizeWhitespace(raw);
  if (!value) return value;
  value = value.replace(/[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ]/g, (ch) => ROMAN_SYMBOL_TO_ASCII.get(ch) || ch);
  value = value.replace(ROMAN_SUFFIX_RE, ' $1');
  return value;
}

function stripRomanSuffix(skillKey) {
  return normalizeWhitespace(skillKey).replace(ROMAN_SUFFIX_RE, '');
}

function getRequiredFieldsForIncludeMissing(includeMissing) {
  if (includeMissing === 'all-meta') return META_REQUIRED_FIELDS;
  return INSERT_REQUIRED_FIELDS;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function loadJsonObjectOrEmpty(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, 'utf8');
  if (!normalizeWhitespace(raw)) return {};
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Expected object JSON: ${filePath}`);
  }
  return parsed;
}

function loadConflictOverrides(filePath) {
  const raw = loadJsonObjectOrEmpty(filePath);
  const map = new Map();
  for (const [rawKey, rawFields] of Object.entries(raw)) {
    const canonicalKey = normalizeSkillKey(rawKey);
    if (!canonicalKey) continue;
    if (!rawFields || typeof rawFields !== 'object' || Array.isArray(rawFields)) continue;
    const normalizedFields = {};
    for (const field of TARGET_FIELDS) {
      const nextValue = normalizeWhitespace(rawFields[field] || '');
      if (!nextValue) continue;
      normalizedFields[field] = nextValue;
    }
    if (Object.keys(normalizedFields).length > 0) map.set(canonicalKey, normalizedFields);
  }
  return map;
}

function loadOrphanCnOverrides(filePath) {
  const raw = loadJsonObjectOrEmpty(filePath);
  const map = new Map();
  for (const [rawKey, payload] of Object.entries(raw)) {
    const canonicalKey = normalizeSkillKey(rawKey);
    if (!canonicalKey) continue;
    const obj = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {};
    map.set(canonicalKey, {
      name_cn: normalizeWhitespace(obj.name_cn || ''),
      description_cn: normalizeWhitespace(obj.description_cn || '')
    });
  }
  return map;
}

function loadMissingOverrides(filePath) {
  const raw = loadJsonObjectOrEmpty(filePath);
  const map = new Map();
  const supportedFields = new Set([...INSERT_REQUIRED_FIELDS, 'insert_after', ...TARGET_FIELDS]);

  for (const [rawKey, payload] of Object.entries(raw)) {
    const canonicalKey = normalizeSkillKey(rawKey);
    if (!canonicalKey) continue;
    const obj = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {};
    const normalized = {};

    for (const field of Object.keys(obj)) {
      if (!supportedFields.has(field)) continue;
      normalized[field] = normalizeWhitespace(obj[field] || '');
    }

    map.set(canonicalKey, normalized);
  }

  return map;
}

function loadPersonaObject(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: { personaFiles: {} } };
  vm.runInNewContext(code, sandbox, { timeout: 5000 });
  const keys = Object.keys(sandbox.window?.personaFiles || {});
  if (keys.length === 0) return null;
  return sandbox.window.personaFiles[keys[0]];
}

function collectPersonaFiles() {
  const top = fs.readdirSync(PERSONA_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js') && entry.name !== 'order.js' && entry.name !== 'nonorder.js')
    .map((entry) => path.join(PERSONA_DIR, entry.name));

  const nonorder = fs.readdirSync(PERSONA_NONORDER_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
    .map((entry) => path.join(PERSONA_NONORDER_DIR, entry.name));

  return [...top, ...nonorder];
}

function collectPersonaSkillSources(personaFiles) {
  const sourceMap = new Map();
  for (const filePath of personaFiles) {
    const persona = loadPersonaObject(filePath);
    if (!persona) continue;

    const register = (skill, sourceType) => {
      if (!skill || typeof skill !== 'object') return;
      const keyKr = normalizeWhitespace(skill.name);
      if (!keyKr) return;
      const canon = normalizeSkillKey(keyKr);
      if (!sourceMap.has(canon)) {
        sourceMap.set(canon, { canonicalKey: canon, rawNames: new Set(), records: [] });
      }
      const bucket = sourceMap.get(canon);
      bucket.rawNames.add(keyKr);
      bucket.records.push({
        sourceType,
        personaId: String(persona.id || ''),
        personaNameKr: normalizeWhitespace(persona.name || ''),
        filePath: path.relative(ROOT, filePath),
        name_kr: keyKr,
        name_en: normalizeWhitespace(skill.name_en || ''),
        name_jp: normalizeWhitespace(skill.name_jp || ''),
        name_cn: normalizeWhitespace(skill.name_cn || ''),
        desc: normalizeWhitespace(skill.desc || ''),
        desc_en: normalizeWhitespace(skill.desc_en || ''),
        desc_jp: normalizeWhitespace(skill.desc_jp || ''),
        desc_cn: normalizeWhitespace(skill.desc_cn || ''),
        cost: normalizeWhitespace(skill.cost || ''),
        icon: normalizeWhitespace(skill.icon || ''),
        icon_gl: normalizeWhitespace(skill.icon_gl || '')
      });
    };

    const innateList = Array.isArray(persona.innate_skill) ? persona.innate_skill : [];
    for (const innate of innateList) register(innate, 'innate');
    register(persona.uniqueSkill, 'uniqueSkill');
  }
  return sourceMap;
}

function getUniqueNonEmptyValues(records, field) {
  const values = new Set();
  for (const record of records) {
    const value = normalizeWhitespace(record[field] || '');
    if (!value) continue;
    values.add(value);
  }
  return [...values];
}

function resolveSourceMap(sourceMap) {
  const resolvedMap = new Map();
  const conflictMap = new Map();

  for (const [canon, payload] of sourceMap.entries()) {
    const resolved = {};
    const conflicts = [];
    for (const field of TRACKED_SOURCE_FIELDS) {
      const values = getUniqueNonEmptyValues(payload.records, field);
      if (values.length === 1) resolved[field] = values[0];
      else if (values.length > 1) conflicts.push({ field, values });
    }

    if (conflicts.length > 0) {
      conflictMap.set(canon, {
        canonicalKey: canon,
        rawNames: [...payload.rawNames].sort((a, b) => a.localeCompare(b, 'ko')),
        conflicts,
        sourceTypes: [...new Set(payload.records.map((x) => x.sourceType))].sort(),
        sampleRecords: payload.records.slice(0, 8).map((x) => ({
          sourceType: x.sourceType,
          personaId: x.personaId,
          personaNameKr: x.personaNameKr,
          filePath: x.filePath
        }))
      });
    } else {
      resolvedMap.set(canon, {
        canonicalKey: canon,
        rawNames: [...payload.rawNames].sort((a, b) => a.localeCompare(b, 'ko')),
        values: resolved,
        sourceTypes: [...new Set(payload.records.map((x) => x.sourceType))].sort()
      });
    }
  }

  return { resolvedMap, conflictMap };
}
function findObjectLiteralRange(src, token) {
  const declIndex = src.indexOf(token);
  if (declIndex < 0) throw new Error(`Cannot find token: ${token}`);
  const eqIndex = src.indexOf('=', declIndex);
  if (eqIndex < 0) throw new Error(`Cannot find '=' for: ${token}`);
  const openIndex = src.indexOf('{', eqIndex);
  if (openIndex < 0) throw new Error(`Cannot find object literal for: ${token}`);

  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;
  let closeIndex = -1;

  for (let i = openIndex; i < src.length; i += 1) {
    const ch = src[i];
    if (inString) {
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (ch === quote) { inString = false; quote = ''; }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') { inString = true; quote = ch; continue; }
    if (ch === '{') { depth += 1; continue; }
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) { closeIndex = i; break; }
    }
  }

  if (closeIndex < 0) throw new Error(`Cannot find closing brace for: ${token}`);
  const semicolonIndex = src.indexOf(';', closeIndex);
  if (semicolonIndex < 0) throw new Error(`Cannot find semicolon after: ${token}`);
  return { declIndex, openIndex, closeIndex, semicolonIndex };
}

function loadSkillsSource() {
  const sourceText = fs.readFileSync(SKILLS_FILE, 'utf8');
  const range = findObjectLiteralRange(sourceText, 'const personaSkillList');
  const objectLiteral = sourceText.slice(range.openIndex, range.closeIndex + 1);

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`result = ${objectLiteral}`, sandbox);
  const personaSkillList = sandbox.result || {};
  return { sourceText, range, personaSkillList };
}

function applyFieldUpdates(skillObj, fields, sourceLabel) {
  let changed = false;
  const changedFields = [];
  for (const [field, rawValue] of Object.entries(fields || {})) {
    if (!TARGET_FIELDS.includes(field)) continue;
    const nextValue = normalizeWhitespace(rawValue || '');
    if (!nextValue) continue;
    const prevValue = normalizeWhitespace(skillObj[field] || '');
    if (prevValue === nextValue) continue;
    skillObj[field] = nextValue;
    changed = true;
    changedFields.push({ field, before: prevValue, after: nextValue, source: sourceLabel });
  }
  return { changed, changedFields };
}

function inferTargetFromDesc(desc) {
  const text = normalizeWhitespace(desc);
  if (!text) return '';
  if (/모든\s*적|적\s*전체|모든\s*동료|아군\s*전체|동료\s*전체|전체의\s*적/.test(text)) return '전체';
  if (/적군\s*1명|1명의\s*적|적\s*1명|동료\s*1명|아군\s*1명|적\s*단일|동료\s*단일|단일\s*적/.test(text)) return '단일';
  if (/^자신|자신의|본인/.test(text)) return '자신';
  return '';
}

function inferTypeFromRecord(record) {
  const desc = normalizeWhitespace(record.desc || '');
  const cost = normalizeWhitespace(record.cost || '');
  const isDamage = /대미지/.test(desc);
  const isSupportText = /증가|감소|회복|제거|부여/.test(desc);

  if (record.sourceType === 'innate') {
    if (!cost && !isDamage) return '패시브';
    if (isDamage) return '공격';
    return '지원';
  }

  if (record.sourceType === 'uniqueSkill') {
    if (isDamage) return '공격';
    if (isSupportText) return '지원';
    return '지원';
  }

  return '';
}

function inferIconFromRecord(record, inferredType, inferredTarget) {
  const explicitIcon = normalizeWhitespace(record.icon || '');
  if (explicitIcon && explicitIcon !== 'Default') return explicitIcon;

  if (inferredType === '패시브') return '패시브';

  const desc = normalizeWhitespace(record.desc || '');
  const elementMap = [
    ['화염', '화염'], ['빙결', '빙결'], ['전격', '전격'], ['질풍', '질풍'], ['염동', '염동'],
    ['핵열', '핵열'], ['축복', '축복'], ['주원', '주원'], ['물리', '물리'], ['총기', '총격']
  ];

  for (const [token, iconBase] of elementMap) {
    if (!desc.includes(token)) continue;
    if (inferredType === '공격' && inferredTarget === '전체' && ['화염', '빙결', '전격', '질풍', '염동', '핵열', '축복', '주원'].includes(iconBase)) {
      return `${iconBase}광역`;
    }
    return iconBase;
  }

  if (inferredType === '지원') {
    if (/감소|디버프/.test(desc)) return inferredTarget === '전체' ? '디버프광역' : '디버프';
    if (/증가|버프/.test(desc)) return inferredTarget === '전체' ? '버프광역' : '버프';
  }

  return '';
}

function inferIconFromDescription(desc, inferredType, inferredTarget) {
  const text = normalizeWhitespace(desc);
  if (!text) return '';
  if (inferredType === '패시브') return '패시브';

  const elementMap = [
    ['화염', '화염'], ['빙결', '빙결'], ['전격', '전격'], ['질풍', '질풍'], ['염동', '염동'],
    ['핵열', '핵열'], ['축복', '축복'], ['주원', '주원'], ['물리', '물리'], ['총격', '총격'], ['총기', '총격']
  ];

  for (const [token, iconBase] of elementMap) {
    if (!text.includes(token)) continue;
    if (inferredType === '공격' && inferredTarget === '전체' && ['화염', '빙결', '전격', '질풍', '염동', '핵열', '축복', '주원'].includes(iconBase)) {
      return `${iconBase}광역`;
    }
    return iconBase;
  }

  if (inferredType === '지원') {
    if (/감소|디버프/.test(text)) return inferredTarget === '전체' ? '디버프광역' : '디버프';
    if (/증가|버프/.test(text)) return inferredTarget === '전체' ? '버프광역' : '버프';
  }
  return '';
}

function inferMetaFromKeyPattern(skillKey) {
  const key = normalizeSkillKey(skillKey);
  if (!key) return {};
  if (!PASSIVE_KEY_PATTERN.test(key)) return {};
  return { type: '패시브', target: '자신', icon: '패시브' };
}

function collectExistingSkillMetaRows(personaSkillList) {
  const rows = [];
  for (const [keyKr, skillObj] of Object.entries(personaSkillList || {})) {
    const canonicalKey = normalizeSkillKey(keyKr);
    if (!canonicalKey) continue;
    rows.push({
      keyKr,
      canonicalKey,
      baseKey: stripRomanSuffix(canonicalKey),
      type: normalizeWhitespace(skillObj?.type || ''),
      target: normalizeWhitespace(skillObj?.target || ''),
      icon: normalizeWhitespace(skillObj?.icon || '')
    });
  }
  return rows;
}

function inferMetaFromBaseKey(canonicalKey, existingMetaRows) {
  const baseKey = stripRomanSuffix(canonicalKey);
  if (!baseKey) return {};

  const candidates = existingMetaRows.filter((row) => row.baseKey === baseKey && row.canonicalKey !== canonicalKey);
  if (candidates.length === 0) return {};

  return {
    type: selectByMajority(candidates.map((row) => row.type)),
    target: selectByMajority(candidates.map((row) => row.target)),
    icon: selectByMajority(candidates.map((row) => row.icon))
  };
}

function pickPreferredDescription(sourceFields, sourcePayload) {
  const direct = normalizeWhitespace(sourceFields.description || '');
  if (direct) return direct;
  const records = Array.isArray(sourcePayload?.records) ? sourcePayload.records : [];
  return selectByMajority(records.map((record) => normalizeWhitespace(record.desc || '')));
}

function pickMajoritySourceField(sourcePayload, sourceField) {
  if (!sourceField) return '';
  const records = Array.isArray(sourcePayload?.records) ? sourcePayload.records : [];
  return selectByMajority(records.map((record) => normalizeWhitespace(record[sourceField] || '')));
}

function resolveMissingMeta({
  canonicalKey,
  override,
  row,
  sourceFields,
  sourcePayload,
  existingMetaRows
}) {
  const meta = {
    type: normalizeWhitespace(override?.type || ''),
    target: normalizeWhitespace(override?.target || ''),
    icon: normalizeWhitespace(override?.icon || '')
  };

  const applyFallback = (nextMeta) => {
    if (!nextMeta || typeof nextMeta !== 'object') return;
    if (!meta.type) meta.type = normalizeWhitespace(nextMeta.type || '');
    if (!meta.target) meta.target = normalizeWhitespace(nextMeta.target || '');
    if (!meta.icon) meta.icon = normalizeWhitespace(nextMeta.icon || '');
  };

  applyFallback(inferMetaFromBaseKey(canonicalKey, existingMetaRows));
  applyFallback(inferMetaFromKeyPattern(canonicalKey));

  const description = pickPreferredDescription(sourceFields, sourcePayload);
  const inferredType = meta.type || normalizeWhitespace(row?.inferred?.type || '');
  const inferredTarget = meta.target || inferTargetFromDesc(description) || normalizeWhitespace(row?.inferred?.target || '');
  const inferredIcon = meta.icon || inferIconFromDescription(description, inferredType, inferredTarget) || normalizeWhitespace(row?.inferred?.icon || '');

  if (!meta.type) meta.type = inferredType;
  if (!meta.target) meta.target = inferredTarget;
  if (!meta.icon) meta.icon = inferredIcon;

  if (!meta.target) meta.target = '자신';
  if (!meta.icon && meta.type === '패시브') meta.icon = '패시브';

  const special = SPECIAL_MISSING_META.get(canonicalKey);
  if (special) {
    meta.type = special.type;
    meta.target = special.target;
    meta.icon = special.icon;
  }

  return meta;
}

function selectByMajority(values) {
  const counts = new Map();
  for (const value of values) {
    const key = normalizeWhitespace(value);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  if (counts.size === 0) return '';
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'))[0][0];
}

function buildMissingPlan(results, sourceMap, personaSkillList) {
  const existingRows = Object.entries(personaSkillList || {}).map(([keyKr, skillObj], index) => ({
    index,
    keyKr,
    type: normalizeWhitespace(skillObj?.type || ''),
    target: normalizeWhitespace(skillObj?.target || ''),
    icon: normalizeWhitespace(skillObj?.icon || '')
  }));

  const rows = [];
  for (const missing of results.missingInSkillsJs) {
    const canonicalKey = missing.canonicalKey;
    const sourcePayload = sourceMap.get(canonicalKey);
    const records = sourcePayload?.records || [];

    const inferredType = selectByMajority(records.map((record) => inferTypeFromRecord(record)));
    const inferredTarget = selectByMajority(records.map((record) => inferTargetFromDesc(record.desc || '')));
    const inferredIcon = selectByMajority(records.map((record) => inferIconFromRecord(record, inferredType, inferredTarget)));

    let anchorCandidates = [];
    let anchorStrategy = '';

    if (inferredIcon && inferredTarget) {
      anchorStrategy = 'icon+target';
      anchorCandidates = existingRows.filter((x) => x.icon === inferredIcon && x.target === inferredTarget).map((x) => x.keyKr);
    }
    if (anchorCandidates.length === 0 && inferredIcon) {
      anchorStrategy = 'icon';
      anchorCandidates = existingRows.filter((x) => x.icon === inferredIcon).map((x) => x.keyKr);
    }
    if (anchorCandidates.length === 0 && inferredType && inferredTarget) {
      anchorStrategy = 'type+target';
      anchorCandidates = existingRows.filter((x) => x.type === inferredType && x.target === inferredTarget).map((x) => x.keyKr);
    }
    if (anchorCandidates.length === 0 && inferredType) {
      anchorStrategy = 'type';
      anchorCandidates = existingRows.filter((x) => x.type === inferredType).map((x) => x.keyKr);
    }

    const manualReasons = [];
    if (!inferredIcon) manualReasons.push('icon_unresolved');
    if (!inferredTarget) manualReasons.push('target_unresolved');
    if (Array.isArray(missing.conflict) && missing.conflict.length > 0) manualReasons.push('source_conflict');

    rows.push({
      canonicalKey,
      rawNames: missing.rawNames,
      sourceTypes: missing.sourceTypes,
      hasConflict: Array.isArray(missing.conflict) && missing.conflict.length > 0,
      conflictFields: missing.conflict || [],
      hasEstimatedIcon: Boolean(inferredIcon),
      hasEstimatedTarget: Boolean(inferredTarget),
      inferred: { type: inferredType, icon: inferredIcon, target: inferredTarget },
      anchor: { strategy: anchorStrategy, candidates: anchorCandidates.slice(0, 12) },
      requiresManualClassification: manualReasons.length > 0,
      manualReasons,
      sampleSourceRecords: records.slice(0, 5).map((record) => ({
        sourceType: record.sourceType,
        personaId: record.personaId,
        personaNameKr: record.personaNameKr,
        filePath: record.filePath,
        cost: record.cost,
        icon: record.icon,
        name_kr: record.name_kr,
        desc: record.desc
      }))
    });
  }

  rows.sort((a, b) => a.canonicalKey.localeCompare(b.canonicalKey, 'ko'));

  return {
    generatedAt: new Date().toISOString(),
    skillsFile: path.relative(ROOT, SKILLS_FILE),
    missingCount: rows.length,
    manualRequiredCount: rows.filter((x) => x.requiresManualClassification).length,
    hasEstimatedIconCount: rows.filter((x) => x.hasEstimatedIcon).length,
    hasEstimatedTargetCount: rows.filter((x) => x.hasEstimatedTarget).length,
    rows
  };
}

function collectAllowedMetaValues(personaSkillList) {
  const types = new Set();
  const targets = new Set();
  const icons = new Set();

  for (const skill of Object.values(personaSkillList || {})) {
    const type = normalizeWhitespace(skill?.type || '');
    const target = normalizeWhitespace(skill?.target || '');
    const icon = normalizeWhitespace(skill?.icon || '');
    if (type) types.add(type);
    if (target) targets.add(target);
    if (icon) icons.add(icon);
  }

  return { types, targets, icons };
}

function buildMissingSourceFieldMap(sourceMap) {
  const out = new Map();
  for (const [canonicalKey, payload] of sourceMap.entries()) {
    const mapped = {};
    for (const [targetField, sourceField] of FIELD_MAP) {
      const values = getUniqueNonEmptyValues(payload.records || [], sourceField);
      if (values.length === 1) {
        mapped[targetField] = values[0];
      }
    }
    out.set(canonicalKey, mapped);
  }
  return out;
}

function pickAnchorKey({ override, row, personaSkillList, meta }) {
  const existingEntries = Object.entries(personaSkillList || {});
  const existingKeys = new Set(existingEntries.map(([key]) => key));

  const overrideAnchor = normalizeWhitespace(override?.insert_after || '');
  if (overrideAnchor && existingKeys.has(overrideAnchor)) {
    return overrideAnchor;
  }

  const candidateAnchors = Array.isArray(row?.anchor?.candidates) ? row.anchor.candidates : [];
  const existingCandidates = candidateAnchors.filter((x) => existingKeys.has(x));
  if (existingCandidates.length > 0) {
    return existingCandidates[existingCandidates.length - 1];
  }

  const clusterCandidates = existingEntries
    .filter(([, skill]) => (
      normalizeWhitespace(skill?.type || '') === meta.type
      && normalizeWhitespace(skill?.target || '') === meta.target
      && normalizeWhitespace(skill?.icon || '') === meta.icon
    ))
    .map(([key]) => key);
  if (clusterCandidates.length > 0) {
    return clusterCandidates[clusterCandidates.length - 1];
  }

  return null;
}

function buildMissingInsertionPlan({
  personaSkillList,
  results,
  missingPlan,
  sourceMap,
  missingOverridesMap,
  includeMissing
}) {
  if (includeMissing === 'none') {
    return {
      includeMissing,
      missingInsertPlanned: [],
      missingInsertResolved: [],
      missingUnresolvedForApply: [],
      missingTranslationPending: [],
      nextPersonaSkillList: personaSkillList,
      missingInsertPlannedCount: 0,
      missingInsertedCount: 0,
      missingStillPendingCount: results.missingInSkillsJs.length,
      missingUnresolvedForApplyCount: 0,
      missingTranslationPendingCount: 0
    };
  }

  const requiredFields = getRequiredFieldsForIncludeMissing(includeMissing);
  const allowedMeta = collectAllowedMetaValues(personaSkillList);
  const existingMetaRows = collectExistingSkillMetaRows(personaSkillList);
  const sourceFieldsMap = buildMissingSourceFieldMap(sourceMap);
  const missingByCanonical = new Map(results.missingInSkillsJs.map((row) => [row.canonicalKey, row]));
  const insertionCandidates = [];

  for (const row of missingPlan.rows) {
    const missingRow = missingByCanonical.get(row.canonicalKey);
    if (!missingRow) continue;
    if (includeMissing === 'auto' && row.requiresManualClassification) continue;

    const override = missingOverridesMap.get(row.canonicalKey) || {};
    const sourceFields = sourceFieldsMap.get(row.canonicalKey) || {};
    const sourcePayload = sourceMap.get(row.canonicalKey) || { records: [] };
    const nextEntry = {};

    for (const field of TARGET_FIELDS) {
      const sourceField = TARGET_TO_SOURCE_FIELD[field];
      const value = normalizeWhitespace(
        override[field]
        || sourceFields[field]
        || pickMajoritySourceField(sourcePayload, sourceField)
        || ''
      );
      if (!value) continue;
      nextEntry[field] = value;
    }

    const meta = resolveMissingMeta({
      canonicalKey: row.canonicalKey,
      override,
      row,
      sourceFields,
      sourcePayload,
      existingMetaRows
    });
    if (meta.type) nextEntry.type = meta.type;
    if (meta.target) nextEntry.target = meta.target;
    if (meta.icon) nextEntry.icon = meta.icon;

    const anchorAfter = pickAnchorKey({ override, row, personaSkillList, meta });
    const unresolvedReasons = [];

    for (const field of requiredFields) {
      if (normalizeWhitespace(nextEntry[field] || '')) continue;
      unresolvedReasons.push(`missing:${field}`);
    }
    if (meta.type && !allowedMeta.types.has(meta.type)) {
      unresolvedReasons.push(`invalid:type:${meta.type}`);
    }
    if (meta.target && !allowedMeta.targets.has(meta.target)) {
      unresolvedReasons.push(`invalid:target:${meta.target}`);
    }
    if (meta.icon && !allowedMeta.icons.has(meta.icon)) {
      unresolvedReasons.push(`invalid:icon:${meta.icon}`);
    }

    const missingTranslationFields = TRANSLATION_PENDING_FIELDS.filter((field) => !normalizeWhitespace(nextEntry[field] || ''));

    insertionCandidates.push({
      canonicalKey: row.canonicalKey,
      keyKr: row.canonicalKey,
      row,
      anchorAfter,
      entry: nextEntry,
      missingTranslationFields,
      unresolvedReasons
    });
  }

  const missingInsertPlanned = insertionCandidates
    .map((x) => ({ keyKr: x.keyKr, canonicalKey: x.canonicalKey, anchorAfter: x.anchorAfter || '', sourceTypes: x.row.sourceTypes }));

  const missingUnresolvedForApply = insertionCandidates
    .filter((x) => x.unresolvedReasons.length > 0)
    .map((x) => ({
      keyKr: x.keyKr,
      canonicalKey: x.canonicalKey,
      sourceTypes: x.row.sourceTypes,
      unresolvedReasons: x.unresolvedReasons
    }))
    .sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));

  const missingTranslationPending = insertionCandidates
    .filter((x) => x.missingTranslationFields.length > 0)
    .map((x) => ({
      keyKr: x.keyKr,
      canonicalKey: x.canonicalKey,
      sourceTypes: x.row.sourceTypes,
      missingFields: x.missingTranslationFields
    }))
    .sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));

  const insertionPlans = insertionCandidates
    .filter((x) => x.unresolvedReasons.length === 0)
    .sort((a, b) => a.canonicalKey.localeCompare(b.canonicalKey, 'ko'));

  const anchorToken = '__EOF__';
  const byAnchor = new Map();
  for (const plan of insertionPlans) {
    const key = plan.anchorAfter || anchorToken;
    if (!byAnchor.has(key)) byAnchor.set(key, []);
    byAnchor.get(key).push(plan);
  }

  const existingEntries = Object.entries(personaSkillList || {});
  const existingKeys = new Set(existingEntries.map(([key]) => key));
  const outputEntries = [];
  const missingInsertResolved = [];

  for (const [key, value] of existingEntries) {
    outputEntries.push([key, value]);
    const bucket = byAnchor.get(key) || [];
    for (const plan of bucket) {
      if (existingKeys.has(plan.keyKr)) continue;
      outputEntries.push([plan.keyKr, plan.entry]);
      existingKeys.add(plan.keyKr);
      missingInsertResolved.push({
        keyKr: plan.keyKr,
        canonicalKey: plan.canonicalKey,
        anchorAfter: plan.anchorAfter || '',
        sourceTypes: plan.row.sourceTypes
      });
    }
  }

  const endBucket = byAnchor.get(anchorToken) || [];
  for (const plan of endBucket) {
    if (existingKeys.has(plan.keyKr)) continue;
    outputEntries.push([plan.keyKr, plan.entry]);
    existingKeys.add(plan.keyKr);
    missingInsertResolved.push({
      keyKr: plan.keyKr,
      canonicalKey: plan.canonicalKey,
      anchorAfter: '',
      sourceTypes: plan.row.sourceTypes
    });
  }

  const nextPersonaSkillList = {};
  for (const [key, value] of outputEntries) {
    nextPersonaSkillList[key] = value;
  }

  return {
    includeMissing,
    missingInsertPlanned: missingInsertPlanned.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko')),
    missingInsertResolved: missingInsertResolved.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko')),
    missingUnresolvedForApply,
    missingTranslationPending,
    nextPersonaSkillList,
    missingInsertPlannedCount: missingInsertPlanned.length,
    missingInsertedCount: missingInsertResolved.length,
    missingStillPendingCount: Math.max(0, results.missingInSkillsJs.length - missingInsertResolved.length),
    missingUnresolvedForApplyCount: missingUnresolvedForApply.length,
    missingTranslationPendingCount: missingTranslationPending.length
  };
}
function applyUpdates(personaSkillList, resolvedMap, conflictMap, conflictOverridesMap, orphanCnOverridesMap) {
  const entries = Object.entries(personaSkillList || {});
  const touchedCanonical = new Set();

  const matchedUpdated = [];
  const matchedNoChange = [];
  const matchedConflictSkipped = [];
  const conflictResolvedByOverride = [];
  const orphanInSkillsJs = [];
  const orphanCnPatched = [];
  const orphanCnStillEmpty = [];

  for (const [skillKey, skillObj] of entries) {
    const canon = normalizeSkillKey(skillKey);
    if (!canon) continue;
    touchedCanonical.add(canon);

    if (conflictMap.has(canon)) {
      const override = conflictOverridesMap.get(canon);
      if (override) {
        const result = applyFieldUpdates(skillObj, override, 'conflict_override');
        conflictResolvedByOverride.push({
          keyKr: skillKey,
          canonicalKey: canon,
          appliedFields: Object.keys(override).sort(),
          changedFieldCount: result.changedFields.length
        });

        if (result.changed) {
          matchedUpdated.push({ keyKr: skillKey, canonicalKey: canon, changedFields: result.changedFields });
        } else {
          matchedNoChange.push({ keyKr: skillKey, canonicalKey: canon });
        }
      } else {
        matchedConflictSkipped.push({
          keyKr: skillKey,
          canonicalKey: canon,
          type: skillObj?.type || '',
          conflict: conflictMap.get(canon)
        });
      }
      continue;
    }

    const resolved = resolvedMap.get(canon);
    if (!resolved) {
      orphanInSkillsJs.push({ keyKr: skillKey, canonicalKey: canon, type: skillObj?.type || '' });

      const overlay = orphanCnOverridesMap.get(canon);
      if (overlay) {
        const overlayResult = applyFieldUpdates(skillObj, {
          name_cn: overlay.name_cn,
          description_cn: overlay.description_cn
        }, 'orphan_cn_override');
        if (overlayResult.changed) {
          orphanCnPatched.push({ keyKr: skillKey, canonicalKey: canon, changedFields: overlayResult.changedFields });
        }
      }

      const hasNameCn = Boolean(normalizeWhitespace(skillObj?.name_cn || ''));
      const hasDescCn = Boolean(normalizeWhitespace(skillObj?.description_cn || ''));
      if (!hasNameCn || !hasDescCn) {
        orphanCnStillEmpty.push({
          keyKr: skillKey,
          canonicalKey: canon,
          hasNameCn,
          hasDescriptionCn: hasDescCn
        });
      }
      continue;
    }

    let changed = false;
    const changedFields = [];
    for (const [targetField, sourceField] of FIELD_MAP) {
      const nextValue = normalizeWhitespace(resolved.values[sourceField] || '');
      if (!nextValue) continue;
      const prevValue = normalizeWhitespace(skillObj[targetField] || '');
      if (prevValue === nextValue) continue;
      skillObj[targetField] = nextValue;
      changed = true;
      changedFields.push({ field: targetField, before: prevValue, after: nextValue, source: 'persona_source' });
    }

    if (changed) matchedUpdated.push({ keyKr: skillKey, canonicalKey: canon, changedFields });
    else matchedNoChange.push({ keyKr: skillKey, canonicalKey: canon });
  }

  const missingInSkillsJs = [];
  for (const [canon, resolved] of resolvedMap.entries()) {
    if (touchedCanonical.has(canon)) continue;
    missingInSkillsJs.push({ canonicalKey: canon, rawNames: resolved.rawNames, sourceTypes: resolved.sourceTypes });
  }
  for (const [canon, conflict] of conflictMap.entries()) {
    if (touchedCanonical.has(canon)) continue;
    missingInSkillsJs.push({
      canonicalKey: canon,
      rawNames: conflict.rawNames,
      sourceTypes: conflict.sourceTypes,
      conflict: conflict.conflicts
    });
  }

  matchedUpdated.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));
  matchedNoChange.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));
  matchedConflictSkipped.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));
  conflictResolvedByOverride.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));
  orphanInSkillsJs.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));
  orphanCnPatched.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));
  orphanCnStillEmpty.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));
  missingInSkillsJs.sort((a, b) => a.canonicalKey.localeCompare(b.canonicalKey, 'ko'));

  return {
    matchedUpdated,
    matchedNoChange,
    matchedConflictSkipped,
    conflictResolvedByOverride,
    missingInSkillsJs,
    orphanInSkillsJs,
    orphanCnPatched,
    orphanCnStillEmpty
  };
}

function buildUpdatedSkillsSource(originalText, range, personaSkillList) {
  const reorderedPersonaSkillList = {};
  for (const [skillKey, skillObj] of Object.entries(personaSkillList || {})) {
    if (!skillObj || typeof skillObj !== 'object' || Array.isArray(skillObj)) {
      reorderedPersonaSkillList[skillKey] = skillObj;
      continue;
    }

    const reorderedSkillObj = {};
    for (const field of SKILL_FIELD_ORDER) {
      if (!Object.prototype.hasOwnProperty.call(skillObj, field)) continue;
      reorderedSkillObj[field] = skillObj[field];
    }
    for (const [field, value] of Object.entries(skillObj)) {
      if (Object.prototype.hasOwnProperty.call(reorderedSkillObj, field)) continue;
      reorderedSkillObj[field] = value;
    }
    reorderedPersonaSkillList[skillKey] = reorderedSkillObj;
  }

  const before = originalText.slice(0, range.declIndex);
  const after = originalText.slice(range.semicolonIndex + 1);
  const block = `const personaSkillList = ${JSON.stringify(reorderedPersonaSkillList, null, 4)};`;
  return `${before}${block}${after}`;
}

function buildMissingTranslationBacklog(personaSkillList, sourceMap) {
  const rows = [];
  for (const [keyKr, skillObj] of Object.entries(personaSkillList || {})) {
    const canonicalKey = normalizeSkillKey(keyKr);
    if (!canonicalKey) continue;
    const sourcePayload = sourceMap.get(canonicalKey);
    if (!sourcePayload) continue;

    const missingFields = TRANSLATION_PENDING_FIELDS.filter((field) => !normalizeWhitespace(skillObj?.[field] || ''));
    if (missingFields.length === 0) continue;

    rows.push({
      keyKr,
      canonicalKey,
      sourceTypes: [...new Set((sourcePayload.records || []).map((record) => record.sourceType))].sort(),
      missingFields
    });
  }

  rows.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));
  return rows;
}

function buildReport({
  options,
  personaFiles,
  sourceMap,
  resolvedMap,
  conflictMap,
  results,
  missingInsert,
  missingTranslationPending
}) {
  return {
    generatedAt: new Date().toISOString(),
    mode: options.mode,
    input: {
      skillsFile: path.relative(ROOT, SKILLS_FILE),
      personaFileCount: personaFiles.length,
      includeMissing: options.includeMissing,
      conflictOverridesJson: path.relative(ROOT, options.conflictOverridesJson),
      orphanCnOverridesJson: path.relative(ROOT, options.orphanCnOverridesJson),
      missingOverridesJson: path.relative(ROOT, options.missingOverridesJson),
      missingPlanJson: path.relative(ROOT, options.missingPlanJson),
      missingTranslationBacklogJson: path.relative(ROOT, options.missingTranslationBacklogJson)
    },
    counts: {
      sourceCanonicalSkillCount: sourceMap.size,
      resolvedCanonicalSkillCount: resolvedMap.size,
      conflictCanonicalSkillCount: conflictMap.size,
      matchedUpdatedCount: results.matchedUpdated.length,
      matchedNoChangeCount: results.matchedNoChange.length,
      matchedConflictSkippedCount: results.matchedConflictSkipped.length,
      conflictResolvedByOverrideCount: results.conflictResolvedByOverride.length,
      missingInSkillsJsCount: results.missingInSkillsJs.length,
      orphanInSkillsJsCount: results.orphanInSkillsJs.length,
      orphanCnFilledCount: results.orphanInSkillsJs.length - results.orphanCnStillEmpty.length,
      orphanCnStillEmptyCount: results.orphanCnStillEmpty.length,
      missingInsertPlannedCount: missingInsert.missingInsertPlannedCount,
      missingInsertedCount: missingInsert.missingInsertedCount,
      missingStillPendingCount: missingInsert.missingStillPendingCount,
      missingUnresolvedForApplyCount: missingInsert.missingUnresolvedForApplyCount,
      missingTranslationPendingCount: missingTranslationPending.length
    },
    matchedUpdated: results.matchedUpdated,
    matchedNoChange: results.matchedNoChange,
    conflictResolvedByOverride: results.conflictResolvedByOverride,
    matchedConflictSkipped: results.matchedConflictSkipped.map((item) => ({
      keyKr: item.keyKr,
      canonicalKey: item.canonicalKey,
      type: item.type,
      conflictFields: item.conflict.conflicts
    })),
    missingInSkillsJs: results.missingInSkillsJs,
    missingInsertPlanned: missingInsert.missingInsertPlanned,
    missingInsertResolved: missingInsert.missingInsertResolved,
    missingUnresolvedForApply: missingInsert.missingUnresolvedForApply,
    missingTranslationPending,
    orphanInSkillsJs: results.orphanInSkillsJs,
    orphanCnPatched: results.orphanCnPatched,
    orphanCnStillEmpty: results.orphanCnStillEmpty
  };
}

function buildMarkdownReport(report) {
  const lines = [];
  lines.push('# Wonder Persona Skill Sync Report');
  lines.push('');
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Mode: ${report.mode}`);
  lines.push(`- Skills file: \`${report.input.skillsFile}\``);
  lines.push(`- Persona files scanned: ${report.input.personaFileCount}`);
  lines.push(`- Include missing mode: ${report.input.includeMissing}`);
  lines.push(`- Conflict overrides: \`${report.input.conflictOverridesJson}\``);
  lines.push(`- Orphan CN overrides: \`${report.input.orphanCnOverridesJson}\``);
  lines.push(`- Missing overrides: \`${report.input.missingOverridesJson}\``);
  lines.push(`- Missing plan report: \`${report.input.missingPlanJson}\``);
  lines.push(`- Missing translation backlog: \`${report.input.missingTranslationBacklogJson}\``);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- Source canonical skills: ${report.counts.sourceCanonicalSkillCount}`);
  lines.push(`- Resolved canonical skills: ${report.counts.resolvedCanonicalSkillCount}`);
  lines.push(`- Conflict canonical skills: ${report.counts.conflictCanonicalSkillCount}`);
  lines.push(`- Matched updated: ${report.counts.matchedUpdatedCount}`);
  lines.push(`- Matched no-change: ${report.counts.matchedNoChangeCount}`);
  lines.push(`- Matched conflict skipped: ${report.counts.matchedConflictSkippedCount}`);
  lines.push(`- Conflict resolved by override: ${report.counts.conflictResolvedByOverrideCount}`);
  lines.push(`- Missing in skills.js (not auto-added): ${report.counts.missingInSkillsJsCount}`);
  lines.push(`- Missing insert planned: ${report.counts.missingInsertPlannedCount}`);
  lines.push(`- Missing inserted: ${report.counts.missingInsertedCount}`);
  lines.push(`- Missing still pending: ${report.counts.missingStillPendingCount}`);
  lines.push(`- Missing unresolved for apply: ${report.counts.missingUnresolvedForApplyCount}`);
  lines.push(`- Missing translation pending: ${report.counts.missingTranslationPendingCount}`);
  lines.push(`- Orphan in skills.js (not found in persona scan): ${report.counts.orphanInSkillsJsCount}`);
  lines.push(`- Orphan CN filled: ${report.counts.orphanCnFilledCount}`);
  lines.push(`- Orphan CN still empty: ${report.counts.orphanCnStillEmptyCount}`);
  lines.push('');

  lines.push('## Conflict Resolved By Override');
  lines.push('');
  if (report.conflictResolvedByOverride.length === 0) lines.push('- None');
  else for (const row of report.conflictResolvedByOverride) lines.push(`- ${row.keyKr} (${row.canonicalKey}) [changed=${row.changedFieldCount}]`);
  lines.push('');

  lines.push('## Conflict Skipped (Matched)');
  lines.push('');
  if (report.matchedConflictSkipped.length === 0) {
    lines.push('- None');
  } else {
    for (const row of report.matchedConflictSkipped) {
      lines.push(`- ${row.keyKr} (${row.canonicalKey})`);
      for (const field of row.conflictFields) lines.push(`  - ${field.field}: ${field.values.join(' | ')}`);
    }
  }
  lines.push('');

  lines.push('## Missing In skills.js (Not Auto Added)');
  lines.push('');
  if (report.missingInSkillsJs.length === 0) lines.push('- None');
  else for (const row of report.missingInSkillsJs) lines.push(`- ${row.canonicalKey} (${row.rawNames.join(', ')}) [${row.sourceTypes.join(', ')}]`);
  lines.push('');

  lines.push('## Missing Insert Planned');
  lines.push('');
  if (report.missingInsertPlanned.length === 0) lines.push('- None');
  else for (const row of report.missingInsertPlanned) lines.push(`- ${row.keyKr} [anchor=${row.anchorAfter || 'EOF'}]`);
  lines.push('');

  lines.push('## Missing Unresolved For Apply');
  lines.push('');
  if (report.missingUnresolvedForApply.length === 0) lines.push('- None');
  else for (const row of report.missingUnresolvedForApply) lines.push(`- ${row.keyKr}: ${row.unresolvedReasons.join(', ')}`);
  lines.push('');

  lines.push('## Missing Translation Pending');
  lines.push('');
  if (report.missingTranslationPending.length === 0) lines.push('- None');
  else for (const row of report.missingTranslationPending) lines.push(`- ${row.keyKr}: ${row.missingFields.join(', ')}`);
  lines.push('');

  lines.push('## Orphan In skills.js');
  lines.push('');
  if (report.orphanInSkillsJs.length === 0) lines.push('- None');
  else for (const row of report.orphanInSkillsJs) lines.push(`- ${row.keyKr} (${row.type || 'unknown'})`);
  lines.push('');

  lines.push('## Orphan CN Still Empty');
  lines.push('');
  if (report.orphanCnStillEmpty.length === 0) lines.push('- None');
  else for (const row of report.orphanCnStillEmpty) lines.push(`- ${row.keyKr} (name_cn=${row.hasNameCn}, description_cn=${row.hasDescriptionCn})`);
  lines.push('');

  return `${lines.join('\n')}\n`;
}
function main() {
  const options = parseArgs(process.argv);
  if (!fs.existsSync(SKILLS_FILE)) {
    throw new Error(`skills file not found: ${SKILLS_FILE}`);
  }

  const conflictOverridesMap = loadConflictOverrides(options.conflictOverridesJson);
  const orphanCnOverridesMap = loadOrphanCnOverrides(options.orphanCnOverridesJson);
  const missingOverridesMap = loadMissingOverrides(options.missingOverridesJson);

  const personaFiles = collectPersonaFiles();
  const sourceMap = collectPersonaSkillSources(personaFiles);
  const { resolvedMap, conflictMap } = resolveSourceMap(sourceMap);

  const { sourceText, range, personaSkillList } = loadSkillsSource();
  const results = applyUpdates(personaSkillList, resolvedMap, conflictMap, conflictOverridesMap, orphanCnOverridesMap);
  const missingPlan = buildMissingPlan(results, sourceMap, personaSkillList);
  const missingInsert = buildMissingInsertionPlan({
    personaSkillList,
    results,
    missingPlan,
    sourceMap,
    missingOverridesMap,
    includeMissing: options.includeMissing
  });
  const nextPersonaSkillList = missingInsert.nextPersonaSkillList;
  const missingTranslationPending = buildMissingTranslationBacklog(nextPersonaSkillList, sourceMap);

  const report = buildReport({
    options,
    personaFiles,
    sourceMap,
    resolvedMap,
    conflictMap,
    results,
    missingInsert,
    missingTranslationPending
  });
  const reportMd = buildMarkdownReport(report);
  const translationBacklog = {
    generatedAt: report.generatedAt,
    includeMissing: options.includeMissing,
    pendingCount: report.counts.missingTranslationPendingCount,
    rows: report.missingTranslationPending
  };

  ensureDir(options.reportJson);
  ensureDir(options.reportMd);
  ensureDir(options.missingPlanJson);
  ensureDir(options.missingTranslationBacklogJson);
  fs.writeFileSync(options.reportJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(options.reportMd, reportMd, 'utf8');
  fs.writeFileSync(options.missingPlanJson, `${JSON.stringify(missingPlan, null, 2)}\n`, 'utf8');
  fs.writeFileSync(options.missingTranslationBacklogJson, `${JSON.stringify(translationBacklog, null, 2)}\n`, 'utf8');

  const shouldApply = options.mode === 'apply';
  if (shouldApply) {
    if (options.strictConflict && report.counts.matchedConflictSkippedCount > 0) {
      throw new Error(`Conflicts detected in matched skills (${report.counts.matchedConflictSkippedCount}) with --strict-conflict.`);
    }
    if (report.counts.orphanCnStillEmptyCount > 0) {
      throw new Error(`Orphan CN fields still empty (${report.counts.orphanCnStillEmptyCount}). Fill overrides before --apply.`);
    }
    if (options.includeMissing !== 'none' && report.counts.missingUnresolvedForApplyCount > 0) {
      throw new Error(`Missing insert unresolved (${report.counts.missingUnresolvedForApplyCount}). Fill missing overrides before --apply.`);
    }

    const updatedSource = buildUpdatedSkillsSource(sourceText, range, nextPersonaSkillList);
    fs.writeFileSync(SKILLS_FILE, updatedSource, 'utf8');
  }

  process.stdout.write(`[sync-wonder-persona-skills] mode=${options.mode}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] include_missing=${options.includeMissing}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] report-json=${path.relative(ROOT, options.reportJson)}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] report-md=${path.relative(ROOT, options.reportMd)}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] missing-plan-json=${path.relative(ROOT, options.missingPlanJson)}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] missing-translation-backlog-json=${path.relative(ROOT, options.missingTranslationBacklogJson)}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] matched_updated=${report.counts.matchedUpdatedCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] matched_no_change=${report.counts.matchedNoChangeCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] matched_conflict_skipped=${report.counts.matchedConflictSkippedCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] conflict_resolved_by_override=${report.counts.conflictResolvedByOverrideCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] orphan_cn_filled=${report.counts.orphanCnFilledCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] orphan_cn_still_empty=${report.counts.orphanCnStillEmptyCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] missing_in_skillsjs=${report.counts.missingInSkillsJsCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] missing_insert_planned=${report.counts.missingInsertPlannedCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] missing_inserted=${report.counts.missingInsertedCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] missing_still_pending=${report.counts.missingStillPendingCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] missing_unresolved_for_apply=${report.counts.missingUnresolvedForApplyCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] missing_translation_pending=${report.counts.missingTranslationPendingCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] orphan_in_skillsjs=${report.counts.orphanInSkillsJsCount}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`[sync-wonder-persona-skills] failed: ${error.message}\n`);
  process.exitCode = 1;
}
