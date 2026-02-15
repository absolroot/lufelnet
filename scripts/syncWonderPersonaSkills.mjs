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

const FIELD_MAP = [
  ['name_en', 'name_en'],
  ['name_jp', 'name_jp'],
  ['name_cn', 'name_cn'],
  ['description', 'desc'],
  ['description_en', 'desc_en'],
  ['description_jp', 'desc_jp'],
  ['description_cn', 'desc_cn']
];

const TRACKED_SOURCE_FIELDS = ['name_en', 'name_jp', 'name_cn', 'desc', 'desc_en', 'desc_jp', 'desc_cn'];
const ROMAN_SYMBOL_TO_ASCII = new Map([
  ['Ⅰ', 'I'],
  ['Ⅱ', 'II'],
  ['Ⅲ', 'III'],
  ['Ⅳ', 'IV'],
  ['Ⅴ', 'V'],
  ['Ⅵ', 'VI'],
  ['Ⅶ', 'VII'],
  ['Ⅷ', 'VIII'],
  ['Ⅸ', 'IX'],
  ['Ⅹ', 'X'],
  ['Ⅺ', 'XI'],
  ['Ⅻ', 'XII']
]);

function parseArgs(argv) {
  const args = argv.slice(2);
  const out = {
    mode: 'dry-run',
    strictConflict: false,
    reportJson: DEFAULT_REPORT_JSON,
    reportMd: DEFAULT_REPORT_MD
  };
  for (let i = 0; i < args.length; i += 1) {
    const token = String(args[i] || '').trim();
    if (!token) continue;
    if (token === '--apply') {
      out.mode = 'apply';
      continue;
    }
    if (token === '--dry-run') {
      out.mode = 'dry-run';
      continue;
    }
    if (token === '--strict-conflict') {
      out.strictConflict = true;
      continue;
    }
    if (token === '--report-json' && i + 1 < args.length) {
      out.reportJson = path.resolve(ROOT, String(args[i + 1]));
      i += 1;
      continue;
    }
    if (token === '--report-md' && i + 1 < args.length) {
      out.reportMd = path.resolve(ROOT, String(args[i + 1]));
      i += 1;
      continue;
    }
    if (token === '--help' || token === '-h') {
      printUsage();
      process.exit(0);
    }
  }
  return out;
}

function printUsage() {
  process.stdout.write(`Usage:
  node scripts/syncWonderPersonaSkills.mjs --dry-run
  node scripts/syncWonderPersonaSkills.mjs --apply
  node scripts/syncWonderPersonaSkills.mjs --apply --strict-conflict
  node scripts/syncWonderPersonaSkills.mjs --report-json scripts/reports/wonder-persona-skill-sync-report.json --report-md scripts/reports/wonder-persona-skill-sync-report.md
`);
}

function normalizeWhitespace(value) {
  return String(value || '').normalize('NFC').replace(/\s+/g, ' ').trim();
}

function normalizeSkillKey(raw) {
  let value = normalizeWhitespace(raw);
  if (!value) return value;
  value = value.replace(/[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ]/g, (ch) => ROMAN_SYMBOL_TO_ASCII.get(ch) || ch);
  value = value.replace(/\s*(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)$/u, ' $1');
  return value;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
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
  const top = fs
    .readdirSync(PERSONA_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js') && entry.name !== 'order.js' && entry.name !== 'nonorder.js')
    .map((entry) => path.join(PERSONA_DIR, entry.name));
  const nonorder = fs
    .readdirSync(PERSONA_NONORDER_DIR, { withFileTypes: true })
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
        sourceMap.set(canon, {
          canonicalKey: canon,
          rawNames: new Set(),
          records: []
        });
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
        desc_cn: normalizeWhitespace(skill.desc_cn || '')
      });
    };

    const innateList = Array.isArray(persona.innate_skill) ? persona.innate_skill : [];
    for (const innate of innateList) {
      register(innate, 'innate');
    }
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
      if (values.length === 1) {
        resolved[field] = values[0];
      } else if (values.length > 1) {
        conflicts.push({
          field,
          values
        });
      }
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
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '{') {
      depth += 1;
      continue;
    }
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        closeIndex = i;
        break;
      }
    }
  }

  if (closeIndex < 0) throw new Error(`Cannot find closing brace for: ${token}`);
  const semicolonIndex = src.indexOf(';', closeIndex);
  if (semicolonIndex < 0) throw new Error(`Cannot find semicolon after: ${token}`);
  return {
    declIndex,
    openIndex,
    closeIndex,
    semicolonIndex
  };
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

function applyUpdates(personaSkillList, resolvedMap, conflictMap) {
  const entries = Object.entries(personaSkillList || {});
  const touchedCanonical = new Set();

  const matchedUpdated = [];
  const matchedNoChange = [];
  const matchedConflictSkipped = [];
  const orphanInSkillsJs = [];

  for (const [skillKey, skillObj] of entries) {
    const canon = normalizeSkillKey(skillKey);
    if (!canon) continue;
    touchedCanonical.add(canon);

    if (conflictMap.has(canon)) {
      matchedConflictSkipped.push({
        keyKr: skillKey,
        canonicalKey: canon,
        type: skillObj?.type || '',
        conflict: conflictMap.get(canon)
      });
      continue;
    }

    const resolved = resolvedMap.get(canon);
    if (!resolved) {
      orphanInSkillsJs.push({
        keyKr: skillKey,
        canonicalKey: canon,
        type: skillObj?.type || ''
      });
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
      changedFields.push({
        field: targetField,
        before: prevValue,
        after: nextValue
      });
    }

    if (changed) {
      matchedUpdated.push({
        keyKr: skillKey,
        canonicalKey: canon,
        changedFields
      });
    } else {
      matchedNoChange.push({
        keyKr: skillKey,
        canonicalKey: canon
      });
    }
  }

  const missingInSkillsJs = [];
  for (const [canon, resolved] of resolvedMap.entries()) {
    if (touchedCanonical.has(canon)) continue;
    missingInSkillsJs.push({
      canonicalKey: canon,
      rawNames: resolved.rawNames,
      sourceTypes: resolved.sourceTypes
    });
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
  orphanInSkillsJs.sort((a, b) => a.keyKr.localeCompare(b.keyKr, 'ko'));
  missingInSkillsJs.sort((a, b) => a.canonicalKey.localeCompare(b.canonicalKey, 'ko'));

  return {
    matchedUpdated,
    matchedNoChange,
    matchedConflictSkipped,
    missingInSkillsJs,
    orphanInSkillsJs
  };
}

function buildUpdatedSkillsSource(originalText, range, personaSkillList) {
  const before = originalText.slice(0, range.declIndex);
  const after = originalText.slice(range.semicolonIndex + 1);
  const block = `const personaSkillList = ${JSON.stringify(personaSkillList, null, 4)};`;
  return `${before}${block}${after}`;
}

function buildReport({ options, personaFiles, sourceMap, resolvedMap, conflictMap, results }) {
  return {
    generatedAt: new Date().toISOString(),
    mode: options.mode,
    input: {
      skillsFile: path.relative(ROOT, SKILLS_FILE),
      personaFileCount: personaFiles.length
    },
    counts: {
      sourceCanonicalSkillCount: sourceMap.size,
      resolvedCanonicalSkillCount: resolvedMap.size,
      conflictCanonicalSkillCount: conflictMap.size,
      matchedUpdatedCount: results.matchedUpdated.length,
      matchedNoChangeCount: results.matchedNoChange.length,
      matchedConflictSkippedCount: results.matchedConflictSkipped.length,
      missingInSkillsJsCount: results.missingInSkillsJs.length,
      orphanInSkillsJsCount: results.orphanInSkillsJs.length
    },
    matchedUpdated: results.matchedUpdated,
    matchedNoChange: results.matchedNoChange,
    matchedConflictSkipped: results.matchedConflictSkipped.map((item) => ({
      keyKr: item.keyKr,
      canonicalKey: item.canonicalKey,
      type: item.type,
      conflictFields: item.conflict.conflicts
    })),
    missingInSkillsJs: results.missingInSkillsJs,
    orphanInSkillsJs: results.orphanInSkillsJs
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
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Source canonical skills: ${report.counts.sourceCanonicalSkillCount}`);
  lines.push(`- Resolved canonical skills: ${report.counts.resolvedCanonicalSkillCount}`);
  lines.push(`- Conflict canonical skills: ${report.counts.conflictCanonicalSkillCount}`);
  lines.push(`- Matched updated: ${report.counts.matchedUpdatedCount}`);
  lines.push(`- Matched no-change: ${report.counts.matchedNoChangeCount}`);
  lines.push(`- Matched conflict skipped: ${report.counts.matchedConflictSkippedCount}`);
  lines.push(`- Missing in skills.js (not auto-added): ${report.counts.missingInSkillsJsCount}`);
  lines.push(`- Orphan in skills.js (not found in persona scan): ${report.counts.orphanInSkillsJsCount}`);
  lines.push('');

  lines.push('## Conflict Skipped (Matched)');
  lines.push('');
  if (report.matchedConflictSkipped.length === 0) {
    lines.push('- None');
  } else {
    for (const row of report.matchedConflictSkipped) {
      lines.push(`- ${row.keyKr} (${row.canonicalKey})`);
      for (const field of row.conflictFields) {
        lines.push(`  - ${field.field}: ${field.values.join(' | ')}`);
      }
    }
  }
  lines.push('');

  lines.push('## Missing In skills.js (Not Auto Added)');
  lines.push('');
  if (report.missingInSkillsJs.length === 0) {
    lines.push('- None');
  } else {
    for (const row of report.missingInSkillsJs) {
      lines.push(`- ${row.canonicalKey} (${row.rawNames.join(', ')}) [${row.sourceTypes.join(', ')}]`);
    }
  }
  lines.push('');

  lines.push('## Orphan In skills.js');
  lines.push('');
  if (report.orphanInSkillsJs.length === 0) {
    lines.push('- None');
  } else {
    for (const row of report.orphanInSkillsJs) {
      lines.push(`- ${row.keyKr} (${row.type || 'unknown'})`);
    }
  }
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function main() {
  const options = parseArgs(process.argv);
  if (!fs.existsSync(SKILLS_FILE)) {
    throw new Error(`skills file not found: ${SKILLS_FILE}`);
  }

  const personaFiles = collectPersonaFiles();
  const sourceMap = collectPersonaSkillSources(personaFiles);
  const { resolvedMap, conflictMap } = resolveSourceMap(sourceMap);

  const { sourceText, range, personaSkillList } = loadSkillsSource();
  const results = applyUpdates(personaSkillList, resolvedMap, conflictMap);

  const report = buildReport({
    options,
    personaFiles,
    sourceMap,
    resolvedMap,
    conflictMap,
    results
  });
  const reportMd = buildMarkdownReport(report);

  ensureDir(options.reportJson);
  ensureDir(options.reportMd);
  fs.writeFileSync(options.reportJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(options.reportMd, reportMd, 'utf8');

  const shouldApply = options.mode === 'apply';
  if (shouldApply) {
    if (options.strictConflict && report.counts.conflictCanonicalSkillCount > 0) {
      throw new Error(`Conflicts detected (${report.counts.conflictCanonicalSkillCount}) with --strict-conflict.`);
    }
    const updatedSource = buildUpdatedSkillsSource(sourceText, range, personaSkillList);
    fs.writeFileSync(SKILLS_FILE, updatedSource, 'utf8');
  }

  process.stdout.write(`[sync-wonder-persona-skills] mode=${options.mode}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] report-json=${path.relative(ROOT, options.reportJson)}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] report-md=${path.relative(ROOT, options.reportMd)}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] matched_updated=${report.counts.matchedUpdatedCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] matched_no_change=${report.counts.matchedNoChangeCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] matched_conflict_skipped=${report.counts.matchedConflictSkippedCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] missing_in_skillsjs=${report.counts.missingInSkillsJsCount}\n`);
  process.stdout.write(`[sync-wonder-persona-skills] orphan_in_skillsjs=${report.counts.orphanInSkillsJsCount}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`[sync-wonder-persona-skills] failed: ${error.message}\n`);
  process.exitCode = 1;
}
