#!/usr/bin/env node

/**
 * generate-article-pages.mjs
 *
 * Generates static SEO pages for guides/article list + detail pages in each supported language.
 *
 * Usage:
 *   node scripts/seo/generate-article-pages.mjs
 *   node scripts/seo/generate-article-pages.mjs --check
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const OUTPUT_DIR = path.join(ROOT, 'pages', 'article');
const LANGS = ['kr', 'en', 'jp'];
const IMAGE_PATH = '/assets/img/home/SEO.png';

const seoMetaPath = path.join(ROOT, 'i18n', 'pages', 'guides', 'seo-meta.json');
const guidesListPath = path.join(ROOT, 'apps', 'guides', 'data', 'guides-list.json');
const guidesI18nPaths = {
  kr: path.join(ROOT, 'i18n', 'pages', 'guides', 'kr.js'),
  en: path.join(ROOT, 'i18n', 'pages', 'guides', 'en.js'),
  jp: path.join(ROOT, 'i18n', 'pages', 'guides', 'jp.js')
};

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

function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickFirstText(...values) {
  for (const value of values) {
    const cleaned = cleanText(value);
    if (cleaned) return cleaned;
  }
  return '';
}

function ensureSeoMetaShape(meta) {
  for (const lang of LANGS) {
    const langMeta = meta?.[lang];
    if (!langMeta || typeof langMeta !== 'object') {
      throw new Error(`Missing seo meta language entry: ${lang}`);
    }
    if (typeof langMeta.title !== 'string' || !langMeta.title) {
      throw new Error(`i18n/pages/guides/seo-meta.json missing valid title for ${lang}.`);
    }
    if (typeof langMeta.description !== 'string' || !langMeta.description) {
      throw new Error(`i18n/pages/guides/seo-meta.json missing valid description for ${lang}.`);
    }
  }
}

function loadGuidesSiteNames() {
  const siteNames = {};

  for (const lang of LANGS) {
    const filePath = guidesI18nPaths[lang];
    const code = fs.readFileSync(filePath, 'utf8');
    const sandbox = { window: {} };
    vm.runInNewContext(code, sandbox, { timeout: 5000 });

    const key = `I18N_PAGE_GUIDES_${lang.toUpperCase()}`;
    const dict = sandbox.window?.[key];
    if (!dict || typeof dict !== 'object') {
      throw new Error(`Failed to parse guides i18n dictionary: ${path.relative(ROOT, filePath)}`);
    }

    const siteName = cleanText(dict.siteName);
    siteNames[lang] = siteName || 'Lufelnet';
  }

  return siteNames;
}

function loadGuides() {
  const raw = readJson(guidesListPath);
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('apps/guides/data/guides-list.json is empty or invalid.');
  }

  const lowerIdMap = new Map();
  const guides = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid guide entry in guides-list.json (must be object).');
    }

    const id = cleanText(item.id);
    if (!id) {
      throw new Error('Guide entry missing non-empty id in guides-list.json.');
    }

    const lowerId = id.toLowerCase();
    const existingId = lowerIdMap.get(lowerId);
    if (existingId && existingId !== id) {
      throw new Error(`Guide id collision by case-insensitive path: "${existingId}" and "${id}"`);
    }
    lowerIdMap.set(lowerId, id);

    if (item.hasPage === false) continue;

    const titles = {};
    const descriptions = {};
    for (const lang of LANGS) {
      const title = pickFirstText(item?.titles?.[lang], item?.titles?.kr, item.title, id);
      const description = pickFirstText(item?.excerpts?.[lang], item?.excerpts?.kr, title);
      titles[lang] = title;
      descriptions[lang] = description;
    }

    const thumbnail = pickFirstText(item.thumbnail);
    guides.push({
      id,
      titles,
      descriptions,
      image: thumbnail || IMAGE_PATH
    });
  }

  if (guides.length === 0) {
    throw new Error('No guides with hasPage != false were found in guides-list.json.');
  }

  return guides;
}

function renderArticleListPage({ lang, title, description }) {
  const permalink = `/${lang}/article/`;
  const altKo = '/kr/article/';
  const altEn = '/en/article/';
  const altJp = '/jp/article/';

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
    `permalink: ${permalink}`,
    'alternate_urls:',
    `  ko: ${altKo}`,
    `  en: ${altEn}`,
    `  jp: ${altJp}`,
    '---',
    '{% include guides-body.html %}',
    ''
  ].join('\n');
}

function renderArticleDetailPage({ lang, guideId, title, description, image }) {
  const permalink = `/${lang}/article/${guideId}/`;
  const altKo = `/kr/article/${guideId}/`;
  const altEn = `/en/article/${guideId}/`;
  const altJp = `/jp/article/${guideId}/`;

  return [
    '---',
    'layout: default',
    'custom_css: []',
    'custom_js: []',
    'custom_data: ["/data/character_info.js"]',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `image: ${yamlQuote(image)}`,
    `language: ${lang}`,
    `guide_id: ${yamlQuote(guideId)}`,
    `permalink: ${permalink}`,
    'alternate_urls:',
    `  ko: ${altKo}`,
    `  en: ${altEn}`,
    `  jp: ${altJp}`,
    '---',
    '{% include guides-article-body.html %}',
    ''
  ].join('\n');
}

function buildExpectedFiles(seoMeta, guides, siteNames) {
  const expected = new Map();

  for (const lang of LANGS) {
    {
      const title = seoMeta[lang].title;
      const description = seoMeta[lang].description;
      const fileRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, 'index.html')));
      const content = normalizeNewline(
        renderArticleListPage({ lang, title, description })
      );
      expected.set(fileRel, content);
    }

    for (const guide of guides) {
      const displayTitle = guide.titles[lang];
      const siteName = siteNames[lang] || 'Lufelnet';
      const pageTitle = cleanText(`${displayTitle} - ${siteName}`);
      const description = guide.descriptions[lang] || displayTitle;
      const fileRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, `${guide.id}.html`)));
      const content = normalizeNewline(
        renderArticleDetailPage({
          lang,
          guideId: guide.id,
          title: pageTitle,
          description,
          image: guide.image
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
    console.error('Article SEO pages are out of date.');
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

  console.log(`Article SEO pages are up to date (${expectedFiles.size} files).`);
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

  console.log(`Generated ${expectedFiles.size} article SEO files in ${toPosix(path.relative(ROOT, OUTPUT_DIR))}`);
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
  const guides = loadGuides();
  const siteNames = loadGuidesSiteNames();

  const expectedFiles = buildExpectedFiles(seoMeta, guides, siteNames);

  if (mode.check) {
    runCheck(expectedFiles);
    return;
  }

  runGenerate(expectedFiles);
}

main();
