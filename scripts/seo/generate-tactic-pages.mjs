#!/usr/bin/env node

/**
 * generate-tactic-pages.mjs
 *
 * Generates static SEO pages for tactic (maker/upload/tactics) in each supported language.
 * Also generates legacy redirects for old tactic URLs.
 *
 * Usage:
 *   node scripts/seo/generate-tactic-pages.mjs
 *   node scripts/seo/generate-tactic-pages.mjs --check
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const OUTPUT_DIR = path.join(ROOT, 'pages', 'tactic');
const LANGS = ['kr', 'en', 'jp'];
const IMAGE_PATH = '/assets/img/home/SEO.png';

const PAGE_MODES = [
  {
    key: 'maker',
    include: 'tactic-body.html',
    fileName: 'index.html',
    customCss: '[tactic]',
    customJs: '[tooltip, tactic/share, tactic/library-loader, tactic/import, tactic/export, tactic/setwonder, tactic/setparty, tactic/partyimg, tactic/createAction, tactic/renderTurns, tactic/updateAuto, tactic/findPattern, tactic/capture]',
    customData: '[/data/character_info.js, tooltip.js, tactic/pattern.js, revelations/revelations.js, wonder/weapons.js, wonder/skills.js]',
    permalink: (lang) => `/${lang}/tactic/`
  },
  {
    key: 'upload',
    include: 'tactic-upload-body.html',
    fileName: 'tactic-upload.html',
    customCss: '[tactic, tactic-share]',
    customJs: '[tooltip, tactic-preview]',
    customData: '[tooltip.js, /data/character_info.js, revelations/revelations.js, tactic/pattern.js, wonder/weapons.js, wonder/skills.js]',
    permalink: (lang) => `/${lang}/tactic/tactic-upload.html`
  },
  {
    key: 'tactics',
    include: 'tactics-body.html',
    fileName: 'library.html',
    customCss: '[tactic, tactic-share]',
    customJs: '[tooltip, character/spoiler-state, tactic-preview]',
    customData: '[tooltip.js, /data/character_info.js, revelations/revelations.js, tactic/pattern.js, wonder/weapons.js, wonder/skills.js]',
    permalink: (lang) => `/${lang}/tactic/library/`
  }
];

const LEGACY_REDIRECTS = [
  {
    fileName: 'legacy-tactics.html',
    from: (lang) => `/${lang}/tactic/tactics.html`,
    to: (lang) => `/${lang}/tactic/library/`
  },
  {
    fileName: 'legacy-tactic-share.html',
    from: (lang) => `/${lang}/tactic/tactic-share.html`,
    to: (lang) => `/${lang}/tactic/library/`
  }
];

const seoMetaPath = path.join(ROOT, 'i18n', 'pages', 'tactic', 'seo-meta.json');

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
        throw new Error(`i18n/pages/tactic/seo-meta.json missing "${mode.key}" entry for ${lang}.`);
      }
      if (typeof modeMeta.title !== 'string' || !modeMeta.title) {
        throw new Error(`i18n/pages/tactic/seo-meta.json missing valid ${mode.key}.title for ${lang}.`);
      }
      if (typeof modeMeta.description !== 'string' || !modeMeta.description) {
        throw new Error(`i18n/pages/tactic/seo-meta.json missing valid ${mode.key}.description for ${lang}.`);
      }
    }
  }
}

function renderPage({ lang, mode, title, description }) {
  const altKo = mode.permalink('kr');
  const altEn = mode.permalink('en');
  const altJp = mode.permalink('jp');

  return [
    '---',
    'layout: default',
    `custom_css: ${mode.customCss}`,
    `custom_js: ${mode.customJs}`,
    `custom_data: ${mode.customData}`,
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `image: ${yamlQuote(IMAGE_PATH)}`,
    `language: ${lang}`,
    `tactic_page: ${mode.key}`,
    `permalink: ${mode.permalink(lang)}`,
    'alternate_urls:',
    `  ko: ${altKo}`,
    `  en: ${altEn}`,
    `  jp: ${altJp}`,
    '---',
    `{% include ${mode.include} %}`,
    ''
  ].join('\n');
}

function renderLegacyRedirectPage({ from, to }) {
  return [
    '---',
    'layout: null',
    `permalink: ${from}`,
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
    `      var target = "${to}";`,
    '      params.delete("lang");',
    '      params.delete("v");',
    '      var query = params.toString();',
    '      window.location.replace(target + (query ? ("?" + query) : ""));',
    '    })();',
    '  </script>',
    `  <noscript><meta http-equiv="refresh" content="0; url=${to}"></noscript>`,
    `  <a href="${to}">Continue</a>`,
    '</body>',
    '</html>',
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
          mode,
          title,
          description
        })
      );
      expected.set(fileRel, content);
    }

    for (const redirect of LEGACY_REDIRECTS) {
      const from = redirect.from(lang);
      const to = redirect.to(lang);
      const fileRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, redirect.fileName)));
      const content = normalizeNewline(renderLegacyRedirectPage({ from, to }));
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
    console.error('Tactic SEO pages are out of date.');
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

  console.log(`Tactic SEO pages are up to date (${expectedFiles.size} files).`);
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

  console.log(`Generated ${expectedFiles.size} tactic SEO files in ${toPosix(path.relative(ROOT, OUTPUT_DIR))}`);
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
