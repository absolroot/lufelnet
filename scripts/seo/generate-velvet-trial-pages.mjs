#!/usr/bin/env node

/**
 * generate-velvet-trial-pages.mjs
 *
 * Generates static SEO pages for velvet-trial list/detail pages.
 *
 * Usage:
 *   node scripts/seo/generate-velvet-trial-pages.mjs
 *   node scripts/seo/generate-velvet-trial-pages.mjs --check
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const OUTPUT_DIR = path.join(ROOT, 'pages', 'velvet-trial');
const LANGS = ['kr', 'en', 'jp'];
const IMAGE_PATH = '/assets/img/home/SEO.png';
const DETAIL_STAGE_LABEL = {
  kr: '\uC2A4\uD14C\uC774\uC9C0',
  en: 'Stage',
  jp: '\u30B9\u30C6\u30FC\u30B8'
};

const seoMetaPath = path.join(ROOT, 'i18n', 'pages', 'velvet-trial', 'seo-meta.json');
const trialDataDir = path.join(ROOT, 'apps', 'velvet_trial', 'data');

function normalizeNewline(text) {
  return String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function yamlQuote(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function toPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function ensureSeoMetaShape(meta) {
  for (const lang of LANGS) {
    const langMeta = meta?.[lang];
    if (!langMeta || typeof langMeta !== 'object') {
      throw new Error(`Missing seo meta language entry: ${lang}`);
    }
    if (typeof langMeta.title !== 'string' || !langMeta.title.includes('{name}')) {
      throw new Error(`i18n/pages/velvet-trial/seo-meta.json missing valid title template for ${lang}.`);
    }
    if (typeof langMeta.description !== 'string' || !langMeta.description.includes('{name}')) {
      throw new Error(`i18n/pages/velvet-trial/seo-meta.json missing valid description template for ${lang}.`);
    }
    if (typeof langMeta.list_title !== 'string' || !langMeta.list_title.trim()) {
      throw new Error(`i18n/pages/velvet-trial/seo-meta.json missing valid list_title for ${lang}.`);
    }
    if (typeof langMeta.list_description !== 'string' || !langMeta.list_description.trim()) {
      throw new Error(`i18n/pages/velvet-trial/seo-meta.json missing valid list_description for ${lang}.`);
    }
  }
}

function applyTemplate(value, vars) {
  return String(value || '').replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => {
    if (!Object.prototype.hasOwnProperty.call(vars, key)) return `{${key}}`;
    return String(vars[key] || '');
  });
}

function stagePath(lang, chapterSn, stageNum) {
  return `/${lang}/velvet-trial/chapter-${chapterSn}/stage-${stageNum}/`;
}

function readTrialEntries(lang) {
  const filePath = path.join(trialDataDir, `${lang}.json`);
  const payload = readJson(filePath);
  const chapters = Array.isArray(payload?.chapters) ? payload.chapters : [];
  const entries = [];
  const keySet = new Set();

  for (const chapter of chapters) {
    const chapterSn = Number(chapter?.sn);
    if (!Number.isFinite(chapterSn)) {
      throw new Error(`${lang}.json has chapter with invalid sn: ${chapter?.sn}`);
    }

    const chapterName = String(chapter?.name || '').trim() || `Chapter ${chapterSn}`;
    const levels = Array.isArray(chapter?.levels) ? chapter.levels : [];

    for (const level of levels) {
      const levelSn = Number(level?.sn);
      const stageNum = Number(level?.levelNum);
      if (!Number.isFinite(levelSn) || !Number.isFinite(stageNum)) {
        throw new Error(`${lang}.json has level with invalid sn/levelNum in chapter ${chapterSn}`);
      }

      const key = `${chapterSn}:${stageNum}`;
      if (keySet.has(key)) {
        throw new Error(`${lang}.json duplicate chapter/stage pair: ${key}`);
      }
      keySet.add(key);

      entries.push({
        chapterSn,
        levelSn,
        stageNum,
        chapterName,
        key
      });
    }
  }

  entries.sort((a, b) => {
    if (a.chapterSn !== b.chapterSn) return a.chapterSn - b.chapterSn;
    return a.stageNum - b.stageNum;
  });

  return entries;
}

function toEntryMap(entries) {
  const map = new Map();
  for (const entry of entries) {
    map.set(entry.key, entry);
  }
  return map;
}

function renderRootPage({ lang, title, description }) {
  return [
    '---',
    'layout: default',
    'custom_css: []',
    'custom_js: []',
    'custom_data: []',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `image: ${yamlQuote(IMAGE_PATH)}`,
    `language: ${lang}`,
    `permalink: /${lang}/velvet-trial/`,
    'alternate_urls:',
    '  ko: /kr/velvet-trial/',
    '  en: /en/velvet-trial/',
    '  jp: /jp/velvet-trial/',
    '---',
    '{% include velvet-trial-body.html %}',
    ''
  ].join('\n');
}

function renderDetailPage({
  lang,
  chapterSn,
  levelSn,
  stageNum,
  entityKey,
  entityName,
  title,
  description,
  alternateUrls
}) {
  const permalink = stagePath(lang, chapterSn, stageNum);
  return [
    '---',
    'layout: default',
    'custom_css: []',
    'custom_js: []',
    'custom_data: []',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `image: ${yamlQuote(IMAGE_PATH)}`,
    `language: ${lang}`,
    `permalink: ${permalink}`,
    `velvet_trial_chapter_sn: ${chapterSn}`,
    `velvet_trial_level_sn: ${levelSn}`,
    `velvet_trial_stage_num: ${stageNum}`,
    `velvet_trial_entity_key: ${yamlQuote(entityKey)}`,
    `velvet_trial_entity_name: ${yamlQuote(entityName)}`,
    'alternate_urls:',
    `  ko: ${alternateUrls.ko}`,
    `  en: ${alternateUrls.en}`,
    `  jp: ${alternateUrls.jp}`,
    '---',
    '{% include velvet-trial-body.html %}',
    ''
  ].join('\n');
}

function buildExpectedFiles(seoMeta) {
  const expected = new Map();
  const entriesByLang = {};
  const entryMapsByLang = {};

  for (const lang of LANGS) {
    entriesByLang[lang] = readTrialEntries(lang);
    entryMapsByLang[lang] = toEntryMap(entriesByLang[lang]);
  }

  for (const lang of LANGS) {
    const langMeta = seoMeta[lang];
    const rootRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, 'index.html')));
    expected.set(rootRel, normalizeNewline(renderRootPage({
      lang,
      title: langMeta.list_title,
      description: langMeta.list_description
    })));
  }

  for (const lang of LANGS) {
    const langMeta = seoMeta[lang];
    const stageLabel = DETAIL_STAGE_LABEL[lang] || 'Stage';

    for (const entry of entriesByLang[lang]) {
      const entityName = `${entry.chapterName} ${stageLabel} ${entry.stageNum}`;
      const entityKey = `chapter-${entry.chapterSn}/stage-${entry.stageNum}`;
      const key = entry.key;

      const krAlt = entryMapsByLang.kr.get(key);
      const enAlt = entryMapsByLang.en.get(key);
      const jpAlt = entryMapsByLang.jp.get(key);

      const alternateUrls = {
        ko: krAlt ? stagePath('kr', krAlt.chapterSn, krAlt.stageNum) : '/kr/velvet-trial/',
        en: enAlt ? stagePath('en', enAlt.chapterSn, enAlt.stageNum) : '/en/velvet-trial/',
        jp: jpAlt ? stagePath('jp', jpAlt.chapterSn, jpAlt.stageNum) : '/jp/velvet-trial/'
      };

      const title = applyTemplate(langMeta.title, { name: entityName });
      const description = applyTemplate(langMeta.description, { name: entityName });
      const fileRel = toPosix(path.relative(
        ROOT,
        path.join(OUTPUT_DIR, lang, `chapter-${entry.chapterSn}`, `stage-${entry.stageNum}.html`)
      ));

      expected.set(fileRel, normalizeNewline(renderDetailPage({
        lang,
        chapterSn: entry.chapterSn,
        levelSn: entry.levelSn,
        stageNum: entry.stageNum,
        entityKey,
        entityName,
        title,
        description,
        alternateUrls
      })));
    }
  }

  return expected;
}

function listExistingFiles(rootDir) {
  const files = [];
  if (!fs.existsSync(rootDir)) return files;

  const walk = (currentDir) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  };

  walk(rootDir);
  return files;
}

function runCheck(expectedFiles) {
  const missing = [];
  const changed = [];

  for (const [relativePath, expectedContent] of expectedFiles.entries()) {
    const fullPath = path.join(ROOT, relativePath);
    if (!fs.existsSync(fullPath)) {
      missing.push(relativePath);
      continue;
    }
    const actualContent = normalizeNewline(fs.readFileSync(fullPath, 'utf8'));
    if (actualContent !== expectedContent) {
      changed.push(relativePath);
    }
  }

  const expectedSet = new Set(expectedFiles.keys());
  const existingFiles = listExistingFiles(OUTPUT_DIR)
    .map((fullPath) => toPosix(path.relative(ROOT, fullPath)));
  const extra = existingFiles.filter((relativePath) => !expectedSet.has(relativePath));

  if (missing.length || changed.length || extra.length) {
    console.error('Velvet-trial SEO pages are out of date.');
    if (missing.length) {
      console.error(`- Missing (${missing.length}):`);
      for (const file of missing) console.error(`  - ${file}`);
    }
    if (changed.length) {
      console.error(`- Changed (${changed.length}):`);
      for (const file of changed) console.error(`  - ${file}`);
    }
    if (extra.length) {
      console.error(`- Extra (${extra.length}):`);
      for (const file of extra) console.error(`  - ${file}`);
    }
    process.exit(1);
  }

  console.log(`Velvet-trial SEO pages are up to date (${expectedFiles.size} files).`);
}

function runGenerate(expectedFiles) {
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }

  for (const [relativePath, content] of expectedFiles.entries()) {
    const fullPath = path.join(ROOT, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf8');
  }

  console.log(`Generated ${expectedFiles.size} velvet-trial SEO files in ${toPosix(path.relative(ROOT, OUTPUT_DIR))}`);
}

function parseMode() {
  const args = process.argv.slice(2);
  const known = new Set(['--check']);
  for (const arg of args) {
    if (!known.has(arg)) {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }
  return { check: args.includes('--check') };
}

function main() {
  const mode = parseMode();

  const seoMeta = readJson(seoMetaPath);
  ensureSeoMetaShape(seoMeta);

  const expectedFiles = buildExpectedFiles(seoMeta);

  if (mode.check) {
    runCheck(expectedFiles);
    return;
  }

  runGenerate(expectedFiles);
}

main();
