#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const OUTPUT_DIR = path.join(ROOT, 'pages', '2nd-anniversary');
const LANGS = ['kr', 'en', 'jp'];
const IMAGE_PATH = '/assets/img/home/SEO.png';
const seoMetaPath = path.join(ROOT, 'i18n', 'pages', 'second-anniversary', 'seo-meta.json');

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
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureSeoMetaShape(meta) {
  for (const lang of LANGS) {
    const langMeta = meta?.[lang];
    if (!langMeta || typeof langMeta !== 'object') {
      throw new Error(`Missing seo meta language entry: ${lang}`);
    }
    if (typeof langMeta.title !== 'string' || !langMeta.title) {
      throw new Error(`i18n/pages/second-anniversary/seo-meta.json missing valid title for ${lang}.`);
    }
    if (typeof langMeta.description !== 'string' || !langMeta.description) {
      throw new Error(`i18n/pages/second-anniversary/seo-meta.json missing valid description for ${lang}.`);
    }
  }
}

function renderPage({ lang, title, description }) {
  return [
    '---',
    'layout: default',
    'custom_css: []',
    'custom_js: []',
    'custom_data: ["/data/character_info.js"]',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `image: ${yamlQuote(IMAGE_PATH)}`,
    `language: ${lang}`,
    `permalink: /${lang}/2nd-anniversary/`,
    'alternate_urls:',
    '  ko: /kr/2nd-anniversary/',
    '  en: /en/2nd-anniversary/',
    '  jp: /jp/2nd-anniversary/',
    '---',
    '{% include second-anniversary-body.html %}',
    ''
  ].join('\n');
}

function buildExpectedFiles(seoMeta) {
  const expected = new Map();
  for (const lang of LANGS) {
    const fileRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, 'index.html')));
    expected.set(fileRel, normalizeNewline(renderPage({
      lang,
      title: seoMeta[lang].title,
      description: seoMeta[lang].description
    })));
  }
  return expected;
}

function listExistingFiles(rootDir) {
  const files = [];
  if (!fs.existsSync(rootDir)) return files;

  const walk = (currentDir) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else files.push(fullPath);
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
  const extra = listExistingFiles(OUTPUT_DIR)
    .map((fullPath) => toPosix(path.relative(ROOT, fullPath)))
    .filter((relativePath) => !expectedSet.has(relativePath));

  if (missing.length || changed.length || extra.length) {
    console.error('Second anniversary SEO pages are out of date.');
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

  console.log(`Second anniversary SEO pages are up to date (${expectedFiles.size} files).`);
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

  console.log(`Generated ${expectedFiles.size} second anniversary SEO files in ${toPosix(path.relative(ROOT, OUTPUT_DIR))}`);
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
