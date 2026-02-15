#!/usr/bin/env node

/**
 * generate-tier-pages.mjs
 *
 * Generates static SEO pages for the tier app in each supported language.
 *
 * Usage:
 *   node scripts/seo/generate-tier-pages.mjs
 *   node scripts/seo/generate-tier-pages.mjs --check
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const OUTPUT_DIR = path.join(ROOT, 'pages', 'tier');
const LANGS = ['kr', 'en', 'jp'];
const IMAGE_PATH = '/assets/img/logo/lufel.png';
const MODES = ['list', 'maker'];

const seoMetaPath = path.join(ROOT, 'i18n', 'pages', 'tier', 'seo-meta.json');

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
    if (typeof langMeta.title !== 'string' || !langMeta.title) {
      throw new Error(`i18n/pages/tier/seo-meta.json missing valid title for ${lang}.`);
    }
    if (typeof langMeta.description !== 'string' || !langMeta.description) {
      throw new Error(`i18n/pages/tier/seo-meta.json missing valid description for ${lang}.`);
    }
  }
}

function getPermalink(lang, mode) {
  return mode === 'maker'
    ? `/${lang}/tier-maker/`
    : `/${lang}/tier/`;
}

function renderLegacyTierRedirectPage(lang) {
  const fallback = getPermalink(lang, 'list');

  return [
    '---',
    'layout: null',
    `permalink: /${lang}/tier/position-tier/`,
    'sitemap: false',
    '---',
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="robots" content="noindex,nofollow">',
    '  <title>Redirecting...</title>',
    '</head>',
    '<body>',
    '  <script>',
    '    (function () {',
    '      var params = new URLSearchParams(window.location.search || "");',
    '      var mode = (params.get("list") === "false") ? "maker" : "list";',
    `      var target = mode === "maker" ? "/${lang}/tier-maker/" : "/${lang}/tier/";`,
    '      params.delete("lang");',
    '      params.delete("v");',
    '      params.delete("list");',
    '      var query = params.toString();',
    '      window.location.replace(target + (query ? ("?" + query) : ""));',
    '    })();',
    '  </script>',
    `  <noscript><meta http-equiv="refresh" content="0; url=${fallback}"></noscript>`,
    `  <a href="${fallback}">Continue</a>`,
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

function renderTierPage({ lang, title, description, mode }) {
  const permalink = getPermalink(lang, mode);
  const altKo = getPermalink('kr', mode);
  const altEn = getPermalink('en', mode);
  const altJp = getPermalink('jp', mode);

  return [
    '---',
    'layout: default',
    'custom_css: [position-tiers]',
    'custom_js: [character/spoiler-state]',
    'custom_data: [/data/character_info.js]',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `image: ${yamlQuote(IMAGE_PATH)}`,
    `language: ${lang}`,
    `tier_mode: ${mode}`,
    `permalink: ${permalink}`,
    'alternate_urls:',
    `  ko: ${altKo}`,
    `  en: ${altEn}`,
    `  jp: ${altJp}`,
    '---',
    '{% include tier-position-body.html %}',
    ''
  ].join('\n');
}

function buildExpectedFiles(seoMeta) {
  const expected = new Map();

  for (const lang of LANGS) {
    for (const mode of MODES) {
      const title = mode === 'maker'
        ? (seoMeta[lang].maker_title || seoMeta[lang].title)
        : seoMeta[lang].title;
      const description = mode === 'maker'
        ? (seoMeta[lang].maker_description || seoMeta[lang].description)
        : seoMeta[lang].description;

      const fileName = mode === 'maker' ? 'tier-maker.html' : 'index.html';
      const fileRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, fileName)));
      const content = normalizeNewline(
        renderTierPage({ lang, title, description, mode })
      );
      expected.set(fileRel, content);
    }

    const legacyRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, 'legacy-position-tier.html')));
    const legacyContent = normalizeNewline(renderLegacyTierRedirectPage(lang));
    expected.set(legacyRel, legacyContent);
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
    console.error('Tier SEO pages are out of date.');
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

  console.log(`Tier SEO pages are up to date (${expectedFiles.size} files).`);
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

  console.log(`Generated ${expectedFiles.size} tier SEO files in ${toPosix(path.relative(ROOT, OUTPUT_DIR))}`);
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
