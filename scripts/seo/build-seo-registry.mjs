#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const I18N_PAGES_DIR = path.join(ROOT, 'i18n', 'pages');
const OUTPUT_PATH = path.join(ROOT, 'data', 'seo', 'registry.json');

const REQUIRED_LANGS = ['kr', 'en', 'jp'];
const PLACEHOLDER_DOMAINS = new Set(['character', 'persona', 'synergy', 'wonder-weapon']);
const MODE_DOMAIN_KEYS = {
  maps: ['list', 'detail'],
  tactic: ['maker', 'share', 'upload', 'tactics'],
  'pull-tracker': ['individual', 'global', 'guide']
};

const DOMAIN_PARAM_POLICY = {
  home: { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  about: { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  astrolabe: { remove: ['lang', 'v'], modeParam: null, detailParam: 'server' },
  character: { remove: ['lang', 'v', 'name'], modeParam: null, detailParam: 'name' },
  'critical-calc': { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  'defense-calc': { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  gallery: { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  guides: { remove: ['lang', 'v', 'id'], modeParam: null, detailParam: 'id' },
  maps: { remove: ['lang', 'v', 'map', 'category'], modeParam: null, detailParam: 'map' },
  'material-calc': { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  persona: { remove: ['lang', 'v', 'name', 'persona'], modeParam: null, detailParam: 'name' },
  'pull-calc': { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  'pull-tracker': { remove: ['lang', 'v'], modeParam: 'view', detailParam: null },
  revelation: { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  schedule: { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  synergy: { remove: ['lang', 'v', 'character'], modeParam: null, detailParam: 'character' },
  tactic: { remove: ['lang', 'v'], modeParam: 'mode', detailParam: null },
  'tactic-maker': { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  tier: { remove: ['lang', 'v', 'list'], modeParam: 'list', detailParam: null },
  'wonder-weapon': { remove: ['lang', 'v', 'weapon'], modeParam: null, detailParam: 'weapon' },
  login: { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  'tactic-upload': { remove: ['lang', 'v'], modeParam: null, detailParam: null },
  'tactic-share': { remove: ['lang', 'v', 'data'], modeParam: null, detailParam: null },
  tactics: { remove: ['lang', 'v', 'char'], modeParam: null, detailParam: 'char' },
  'not-found': { remove: ['lang', 'v'], modeParam: null, detailParam: null }
};

function toPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

function normalizeNewline(text) {
  return String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function sortObjectKeys(value) {
  if (Array.isArray(value)) return value.map((item) => sortObjectKeys(item));
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const key of Object.keys(value).sort()) {
    out[key] = sortObjectKeys(value[key]);
  }
  return out;
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  for (const arg of args) {
    if (arg !== '--check') {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return { check: args.has('--check') };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function inferDomainType(domain, meta) {
  if (domain === 'tier') return 'tier';
  if (Object.prototype.hasOwnProperty.call(MODE_DOMAIN_KEYS, domain)) return 'mode';
  if (PLACEHOLDER_DOMAINS.has(domain)) return 'template';
  return 'simple';
}

function assertNonEmptyString(value, message) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(message);
  }
}

function isBlank(value) {
  return !String(value == null ? '' : value).trim();
}

function isSkippableOptionalMeta({ type, domain, langMeta }) {
  if (langMeta == null) return true;
  if (!langMeta || typeof langMeta !== 'object' || Array.isArray(langMeta)) return false;

  if (type === 'simple') {
    return isBlank(langMeta.title) && isBlank(langMeta.description);
  }

  if (type === 'template') {
    return isBlank(langMeta.title)
      && isBlank(langMeta.description)
      && isBlank(langMeta.list_title)
      && isBlank(langMeta.list_description);
  }

  if (type === 'mode') {
    const modeKeys = MODE_DOMAIN_KEYS[domain] || [];
    return modeKeys.every((modeKey) => {
      const modeMeta = langMeta?.[modeKey];
      return isBlank(modeMeta?.title) && isBlank(modeMeta?.description);
    });
  }

  if (type === 'tier') {
    return isBlank(langMeta.title)
      && isBlank(langMeta.description)
      && isBlank(langMeta.maker_title)
      && isBlank(langMeta.maker_description);
  }

  return false;
}

function validateAndNormalizeSimple(domain, lang, langMeta) {
  assertNonEmptyString(langMeta?.title, `${domain}.${lang}.title must be a non-empty string`);
  assertNonEmptyString(langMeta?.description, `${domain}.${lang}.description must be a non-empty string`);
  return {
    title: String(langMeta.title),
    description: String(langMeta.description)
  };
}

function validateAndNormalizeTemplate(domain, lang, langMeta) {
  const normalized = validateAndNormalizeSimple(domain, lang, langMeta);
  if (!normalized.title.includes('{name}')) {
    throw new Error(`${domain}.${lang}.title must include "{name}"`);
  }
  if (!normalized.description.includes('{name}')) {
    throw new Error(`${domain}.${lang}.description must include "{name}"`);
  }
  assertNonEmptyString(langMeta?.list_title, `${domain}.${lang}.list_title must be a non-empty string`);
  assertNonEmptyString(langMeta?.list_description, `${domain}.${lang}.list_description must be a non-empty string`);
  return {
    title: normalized.title,
    description: normalized.description,
    list_title: String(langMeta.list_title),
    list_description: String(langMeta.list_description)
  };
}

function validateAndNormalizeMode(domain, lang, langMeta) {
  const modeKeys = MODE_DOMAIN_KEYS[domain];
  const out = {};
  for (const modeKey of modeKeys) {
    const modeMeta = langMeta?.[modeKey];
    assertNonEmptyString(modeMeta?.title, `${domain}.${lang}.${modeKey}.title must be a non-empty string`);
    assertNonEmptyString(modeMeta?.description, `${domain}.${lang}.${modeKey}.description must be a non-empty string`);
    out[modeKey] = {
      title: String(modeMeta.title),
      description: String(modeMeta.description)
    };
  }

  if (domain === 'maps') {
    const detail = out.detail;
    if (!detail.title.includes('{path}')) {
      throw new Error(`${domain}.${lang}.detail.title must include "{path}"`);
    }
    if (!detail.description.includes('{path}')) {
      throw new Error(`${domain}.${lang}.detail.description must include "{path}"`);
    }
  }

  return out;
}

function validateAndNormalizeTier(lang, langMeta) {
  assertNonEmptyString(langMeta?.title, `tier.${lang}.title must be a non-empty string`);
  assertNonEmptyString(langMeta?.description, `tier.${lang}.description must be a non-empty string`);
  return {
    title: String(langMeta.title),
    description: String(langMeta.description),
    maker_title: String(langMeta?.maker_title || langMeta.title),
    maker_description: String(langMeta?.maker_description || langMeta.description)
  };
}

function normalizeDomainMeta(domain, rawMeta) {
  const type = inferDomainType(domain, rawMeta);
  const langs = Object.keys(rawMeta || {}).sort();

  for (const required of REQUIRED_LANGS) {
    if (!langs.includes(required)) {
      throw new Error(`${domain} seo-meta missing required language: ${required}`);
    }
  }

  const normalizedMeta = {};
  for (const lang of langs) {
    const langMeta = rawMeta[lang];
    const isOptional = !REQUIRED_LANGS.includes(lang);
    if (isOptional && isSkippableOptionalMeta({ type, domain, langMeta })) {
      continue;
    }
    if (!langMeta || typeof langMeta !== 'object' || Array.isArray(langMeta)) {
      throw new Error(`${domain}.${lang} must be an object`);
    }

    if (type === 'simple') {
      normalizedMeta[lang] = validateAndNormalizeSimple(domain, lang, langMeta);
    } else if (type === 'template') {
      normalizedMeta[lang] = validateAndNormalizeTemplate(domain, lang, langMeta);
    } else if (type === 'mode') {
      normalizedMeta[lang] = validateAndNormalizeMode(domain, lang, langMeta);
    } else if (type === 'tier') {
      normalizedMeta[lang] = validateAndNormalizeTier(lang, langMeta);
    }
  }

  const normalizedLangs = Object.keys(normalizedMeta).sort();

  return {
    type,
    langs: normalizedLangs,
    placeholder: type === 'template' ? '{name}' : (domain === 'maps' ? '{path}' : null),
    modeKeys: type === 'mode' ? MODE_DOMAIN_KEYS[domain] : (type === 'tier' ? ['list', 'maker'] : []),
    paramPolicy: DOMAIN_PARAM_POLICY[domain] || { remove: ['lang', 'v'], modeParam: null, detailParam: null },
    meta: normalizedMeta
  };
}

function collectSeoMetaFiles() {
  const out = [];
  if (!fs.existsSync(I18N_PAGES_DIR)) return out;

  for (const entry of fs.readdirSync(I18N_PAGES_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const domain = entry.name;
    const filePath = path.join(I18N_PAGES_DIR, domain, 'seo-meta.json');
    if (!fs.existsSync(filePath)) continue;
    out.push({ domain, filePath });
  }
  out.sort((a, b) => a.domain.localeCompare(b.domain));
  return out;
}

function buildRegistry() {
  const files = collectSeoMetaFiles();
  if (files.length === 0) {
    throw new Error('No seo-meta.json files found.');
  }

  const domains = {};
  for (const item of files) {
    const raw = readJson(item.filePath);
    domains[item.domain] = {
      source: toPosix(path.relative(ROOT, item.filePath)),
      ...normalizeDomainMeta(item.domain, raw)
    };
  }

  const registry = {
    version: 1,
    generatedAt: new Date().toISOString(),
    requiredLangs: REQUIRED_LANGS,
    defaultLang: 'kr',
    localeMap: {
      kr: 'ko_KR',
      en: 'en_US',
      jp: 'ja_JP',
      cn: 'zh_CN'
    },
    domains: sortObjectKeys(domains)
  };

  return registry;
}

function renderRegistry(registry) {
  return `${normalizeNewline(JSON.stringify(sortObjectKeys(registry), null, 2))}\n`;
}

function checkRegistryOutput(expectedContent) {
  if (!fs.existsSync(OUTPUT_PATH)) {
    throw new Error(`Missing output file: ${toPosix(path.relative(ROOT, OUTPUT_PATH))}`);
  }
  const currentRaw = normalizeNewline(fs.readFileSync(OUTPUT_PATH, 'utf8'));
  const currentJson = JSON.parse(currentRaw);
  const expectedJson = JSON.parse(expectedContent);

  if (currentJson && typeof currentJson === 'object') {
    currentJson.generatedAt = '__IGNORED__';
  }
  if (expectedJson && typeof expectedJson === 'object') {
    expectedJson.generatedAt = '__IGNORED__';
  }

  const normalizedCurrent = `${normalizeNewline(JSON.stringify(sortObjectKeys(currentJson), null, 2))}\n`;
  const normalizedExpected = `${normalizeNewline(JSON.stringify(sortObjectKeys(expectedJson), null, 2))}\n`;

  if (normalizedCurrent !== normalizedExpected) {
    throw new Error(`Registry mismatch: ${toPosix(path.relative(ROOT, OUTPUT_PATH))}`);
  }
}

function writeRegistryOutput(content) {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
}

function main() {
  const mode = parseArgs(process.argv);
  const registry = buildRegistry();
  const content = renderRegistry(registry);

  if (mode.check) {
    checkRegistryOutput(content);
    console.log(`SEO registry is up to date: ${toPosix(path.relative(ROOT, OUTPUT_PATH))}`);
    return;
  }

  writeRegistryOutput(content);
  console.log(`SEO registry generated: ${toPosix(path.relative(ROOT, OUTPUT_PATH))}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
