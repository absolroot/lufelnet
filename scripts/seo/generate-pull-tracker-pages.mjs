#!/usr/bin/env node

/**
 * generate-pull-tracker-pages.mjs
 *
 * Generates static SEO pages for pull-tracker (individual/global/guide) in each supported language.
 *
 * Usage:
 *   node scripts/seo/generate-pull-tracker-pages.mjs
 *   node scripts/seo/generate-pull-tracker-pages.mjs --check
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const OUTPUT_DIR = path.join(ROOT, 'pages', 'pull-tracker');
const LANGS = ['kr', 'en', 'jp'];
const IMAGE_PATH = '/assets/img/home/SEO.png';

const PAGE_MODES = [
  {
    key: 'individual',
    include: 'pull-tracker-body.html',
    fileName: 'index.html',
    permalink: (lang) => `/${lang}/pull-tracker/`
  },
  {
    key: 'global',
    include: 'pull-tracker-global-stats-body.html',
    fileName: 'global-stats.html',
    permalink: (lang) => `/${lang}/pull-tracker/global-stats/`
  },
  {
    key: 'guide',
    include: 'pull-tracker-url-guide-body.html',
    fileName: 'url-guide.html',
    permalink: (lang) => `/${lang}/pull-tracker/url-guide/`
  }
];

const seoMetaPath = path.join(ROOT, 'i18n', 'pages', 'pull-tracker', 'seo-meta.json');

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

    for (const mode of PAGE_MODES) {
      const modeMeta = langMeta?.[mode.key];
      if (!modeMeta || typeof modeMeta !== 'object') {
        throw new Error(`i18n/pages/pull-tracker/seo-meta.json missing "${mode.key}" entry for ${lang}.`);
      }
      if (typeof modeMeta.title !== 'string' || !modeMeta.title) {
        throw new Error(`i18n/pages/pull-tracker/seo-meta.json missing valid ${mode.key}.title for ${lang}.`);
      }
      if (typeof modeMeta.description !== 'string' || !modeMeta.description) {
        throw new Error(`i18n/pages/pull-tracker/seo-meta.json missing valid ${mode.key}.description for ${lang}.`);
      }
    }
  }
}

function renderPage({ lang, modeKey, include, title, description, permalink }) {
  const altKo = permalink('kr');
  const altEn = permalink('en');
  const altJp = permalink('jp');

  return [
    '---',
    'layout: default',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `image: ${yamlQuote(IMAGE_PATH)}`,
    `language: ${lang}`,
    `pull_tracker_page: ${modeKey}`,
    `permalink: ${permalink(lang)}`,
    'alternate_urls:',
    `  ko: ${altKo}`,
    `  en: ${altEn}`,
    `  jp: ${altJp}`,
    '---',
    `{% include ${include} %}`,
    ''
  ].join('\n');
}

function buildExpectedFiles(seoMeta) {
  const expected = new Map();

  for (const lang of LANGS) {
    for (const mode of PAGE_MODES) {
      const title = seoMeta[lang][mode.key].title;
      const description = seoMeta[lang][mode.key].description;
      const fileRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, mode.fileName)));
      const content = normalizeNewline(
        renderPage({
          lang,
          modeKey: mode.key,
          include: mode.include,
          title,
          description,
          permalink: mode.permalink
        })
      );
      expected.set(fileRel, content);
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
    console.error('Pull-tracker SEO pages are out of date.');
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

  console.log(`Pull-tracker SEO pages are up to date (${expectedFiles.size} files).`);
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

  console.log(`Generated ${expectedFiles.size} pull-tracker SEO files in ${toPosix(path.relative(ROOT, OUTPUT_DIR))}`);
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
