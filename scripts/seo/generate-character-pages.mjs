#!/usr/bin/env node

/**
 * generate-character-pages.mjs
 *
 * Generates static SEO pages for character detail pages and language root redirects.
 *
 * Usage:
 *   node scripts/seo/generate-character-pages.mjs
 *   node scripts/seo/generate-character-pages.mjs --check
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const OUTPUT_DIR = path.join(ROOT, 'pages', 'character');
const ROOT_STUB_DIR = path.join(OUTPUT_DIR, 'roots');

const DETAIL_LANGS = ['kr', 'en', 'jp'];
const LIST_PAGE_LANGS = ['kr', 'en', 'jp'];
const ROOT_REDIRECT_LANGS = ['cn'];

const characterInfoPath = path.join(ROOT, 'data', 'character_info.js');
const seoMetaPath = path.join(ROOT, 'i18n', 'pages', 'character', 'seo-meta.json');
const listI18nPaths = {
  kr: path.join(ROOT, 'i18n', 'pages', 'character', 'kr.js'),
  en: path.join(ROOT, 'i18n', 'pages', 'character', 'en.js'),
  jp: path.join(ROOT, 'i18n', 'pages', 'character', 'jp.js')
};
const slugMapPath = path.join(ROOT, '_data', 'character_slugs.json');

function normalizeNewline(text) {
  return String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function yamlQuote(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function toPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

function sortByCodePoint(values) {
  return [...values].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function normalizeName(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\uCA8C/g, '\u00B7')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/['".]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function ensureSeoMetaShape(meta) {
  for (const lang of DETAIL_LANGS) {
    const langMeta = meta?.[lang];
    if (!langMeta || typeof langMeta !== 'object') {
      throw new Error(`Missing seo meta language entry: ${lang}`);
    }
    if (typeof langMeta.title !== 'string' || !langMeta.title.includes('{name}')) {
      throw new Error(`i18n/pages/character/seo-meta.json missing valid title template for ${lang}.`);
    }
    if (typeof langMeta.description !== 'string' || !langMeta.description.includes('{name}')) {
      throw new Error(`i18n/pages/character/seo-meta.json missing valid description template for ${lang}.`);
    }
  }
}

function loadCharacterListSeoMetaFromI18n() {
  const out = {};

  for (const lang of LIST_PAGE_LANGS) {
    const i18nPath = listI18nPaths[lang];
    if (!fs.existsSync(i18nPath)) {
      throw new Error(`Missing character i18n file for ${lang}: ${toPosix(path.relative(ROOT, i18nPath))}`);
    }

    const code = fs.readFileSync(i18nPath, 'utf8');
    const sandbox = { window: {} };
    vm.runInNewContext(code, sandbox, { timeout: 5000 });

    const key = `I18N_PAGE_CHARACTER_${lang.toUpperCase()}`;
    const dict = sandbox.window[key];
    if (!dict || typeof dict !== 'object') {
      throw new Error(`Missing i18n dictionary ${key} in ${toPosix(path.relative(ROOT, i18nPath))}`);
    }

    const title = normalizeName(dict.seoTitle);
    const description = normalizeName(dict.seoDescription);
    if (!title || !description) {
      throw new Error(`Invalid seoTitle/seoDescription in ${toPosix(path.relative(ROOT, i18nPath))}`);
    }

    out[lang] = { title, description };
  }

  return out;
}

function ensureSlugValue(rawSlug, contextLabel) {
  const slug = slugify(rawSlug);
  if (!slug) {
    throw new Error(`Invalid slug for ${contextLabel}`);
  }
  if (slug !== rawSlug) {
    throw new Error(`Slug must already be normalized for ${contextLabel}: "${rawSlug}" -> "${slug}"`);
  }
  return slug;
}

function loadCharacterData() {
  const code = fs.readFileSync(characterInfoPath, 'utf8');
  const sandbox = { window: { characterList: null, characterData: {} } };
  vm.runInNewContext(code, sandbox, { timeout: 5000 });

  const characterList = sandbox.window.characterList || { mainParty: [], supportParty: [] };
  const characterData = sandbox.window.characterData || {};

  const allCharacters = [
    ...(characterList.mainParty || []),
    ...(characterList.supportParty || [])
  ].filter((name) => name !== '원더');

  if (allCharacters.length === 0) {
    throw new Error('No characters found in data/character_info.js');
  }

  return { allCharacters, characterData };
}

function loadSlugMap(allCharacters) {
  const mapRaw = readJson(slugMapPath);
  if (!mapRaw || typeof mapRaw !== 'object' || Array.isArray(mapRaw)) {
    throw new Error('_data/character_slugs.json must be an object map.');
  }

  const normalizedMap = {};
  const characterSet = new Set(allCharacters);

  for (const [krName, entry] of Object.entries(mapRaw)) {
    if (!characterSet.has(krName)) {
      throw new Error(`Slug map contains unknown character key: "${krName}"`);
    }
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`Slug map entry must be object for "${krName}"`);
    }

    const slug = ensureSlugValue(String(entry.slug || ''), `${krName}.slug`);
    const aliasesRaw = Array.isArray(entry.aliases) ? entry.aliases : [];
    const aliases = [];
    const aliasSeen = new Set();
    for (const aliasRaw of aliasesRaw) {
      const alias = ensureSlugValue(String(aliasRaw || ''), `${krName}.aliases`);
      if (alias === slug || aliasSeen.has(alias)) continue;
      aliasSeen.add(alias);
      aliases.push(alias);
    }

    normalizedMap[krName] = { slug, aliases };
  }

  for (const krName of allCharacters) {
    if (!normalizedMap[krName]) {
      throw new Error(`Missing slug map entry for "${krName}". Add it to _data/character_slugs.json`);
    }
  }

  return normalizedMap;
}

function getDisplayName(krName, lang, charEntry) {
  if (lang === 'kr') {
    return normalizeName(charEntry?.name) || krName;
  }
  if (lang === 'en') {
    return normalizeName(charEntry?.name_en) || normalizeName(charEntry?.codename) || krName;
  }
  if (lang === 'jp') {
    return normalizeName(charEntry?.name_jp) || normalizeName(charEntry?.name_en) || normalizeName(charEntry?.codename) || krName;
  }
  return krName;
}

function getImagePath(krName) {
  return `/assets/img/character-cards/${encodeURIComponent(krName)}.webp`;
}

function renderCharacterPage({ lang, slug, characterKrName, title, description, imagePath }) {
  const permalink = `/${lang}/character/${slug}/`;
  const altKo = `/kr/character/${slug}/`;
  const altEn = `/en/character/${slug}/`;
  const altJp = `/jp/character/${slug}/`;
  return [
    '---',
    'layout: default',
    'custom_css: [cha_detail, cha_detail_img, tactic-posts, tactic-share]',
    'custom_js: [character/cha_video, character/cha_detail, tooltip, detail/dot-carousel,',
    '  marked.min, character/cha_stats, character/character-i18n, character/helpmodal, character/QEVEL]',
    'custom_data: [/data/character_info.js, revelations/revelations.js,',
    '  tooltip.js, wonder/weapons.js]',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `image: ${yamlQuote(imagePath)}`,
    `language: ${lang}`,
    `permalink: ${permalink}`,
    `character_kr_name: ${yamlQuote(characterKrName)}`,
    `character_slug: ${slug}`,
    'alternate_urls:',
    `  ko: ${altKo}`,
    `  en: ${altEn}`,
    `  jp: ${altJp}`,
    '---',
    '{% include character-detail-body.html %}',
    ''
  ].join('\n');
}

function renderCharacterListPage({ lang, title, description }) {
  return [
    '---',
    'layout: null',
    `permalink: /${lang}/character/`,
    'sitemap: false',
    '---',
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="robots" content="noindex,nofollow">',
    `  <title>${title.replace(/"/g, '&quot;')}</title>`,
    `  <meta name="description" content="${description.replace(/"/g, '&quot;')}">`,
    '</head>',
    '<body>',
    '  <script>',
    '    (function () {',
    '      var params = new URLSearchParams(window.location.search || "");',
    `      params.set("lang", "${lang}");`,
    '      var query = params.toString();',
    '      var next = "/character/" + (query ? ("?" + query) : "");',
    '      window.location.replace(next);',
    '    })();',
    '  </script>',
    `  <noscript><meta http-equiv="refresh" content="0; url=/character/?lang=${lang}"></noscript>`,
    `  <a href="/character/?lang=${lang}">Continue</a>`,
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

function toRedirectStubFilePath(fromPath) {
  let token = String(fromPath || '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '--')
    .replace(/[^a-zA-Z0-9\-_.]/g, '_');
  if (token.endsWith('.html')) {
    token = token.slice(0, -5);
  }
  const fileName = `${token || 'root'}.html`;
  return path.join(OUTPUT_DIR, 'redirects', fileName);
}

function renderDetailRedirectStub({ fromPath, toPath }) {
  return [
    '---',
    'layout: null',
    `permalink: ${fromPath}`,
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
    '      params.delete("lang");',
    '      params.delete("name");',
    `      var nextPath = ${JSON.stringify(toPath)};`,
    '      var query = params.toString();',
    '      var next = nextPath + (query ? ("?" + query) : "");',
    '      window.location.replace(next);',
    '    })();',
    '  </script>',
    `  <noscript><meta http-equiv="refresh" content="0; url=${toPath}"></noscript>`,
    `  <a href="${toPath}">Continue</a>`,
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

function renderRootRedirectPage(lang, permalinkPath = `/${lang}/character/`) {
  return [
    '---',
    'layout: null',
    `permalink: ${permalinkPath}`,
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
    `      params.set("lang", "${lang}");`,
    '      var query = params.toString();',
    '      var next = "/character/" + (query ? ("?" + query) : "");',
    '      window.location.replace(next);',
    '    })();',
    '  </script>',
    `  <noscript><meta http-equiv="refresh" content="0; url=/character/?lang=${lang}"></noscript>`,
    `  <a href="/character/?lang=${lang}">Continue</a>`,
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

function buildExpectedFiles(allCharacters, characterData, seoMeta, listSeoMeta, slugMap) {
  const expected = new Map();
  const slugOwner = new Map();
  const redirectOwner = new Map();
  const characterNames = sortByCodePoint(allCharacters);
  const addRedirectStub = (fromPath, toPath) => {
    const from = fromPath.endsWith('.html')
      ? fromPath
      : (fromPath.endsWith('/') ? fromPath : `${fromPath}/`);
    const to = toPath.endsWith('.html')
      ? toPath
      : (toPath.endsWith('/') ? toPath : `${toPath}/`);
    const previous = redirectOwner.get(from);
    if (previous && previous !== to) {
      throw new Error(`Redirect collision: "${from}" points to both "${previous}" and "${to}".`);
    }
    redirectOwner.set(from, to);

    const fileRel = toPosix(path.relative(ROOT, toRedirectStubFilePath(from)));
    const content = normalizeNewline(
      renderDetailRedirectStub({
        fromPath: from,
        toPath: to
      })
    );
    expected.set(fileRel, content);
  };

  for (const lang of LIST_PAGE_LANGS) {
    const listMeta = listSeoMeta[lang];
    if (!listMeta || typeof listMeta !== 'object') {
      throw new Error(`Missing character list SEO meta for language: ${lang}`);
    }
    const fileRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, 'index.html')));
    const content = normalizeNewline(
      renderCharacterListPage({
        lang,
        title: listMeta.title,
        description: listMeta.description
      })
    );
    expected.set(fileRel, content);
  }

  for (const krName of characterNames) {
    const charEntry = characterData[krName];
    if (!charEntry || typeof charEntry !== 'object') {
      throw new Error(`Missing character data entry for "${krName}" in characterData`);
    }

    const slugEntry = slugMap[krName];
    const slug = slugEntry.slug;
    const aliasSlugs = slugEntry.aliases;

    const previousOwner = slugOwner.get(slug);
    if (previousOwner && previousOwner !== krName) {
      throw new Error(`Character slug collision: "${slug}" is used by "${previousOwner}" and "${krName}".`);
    }
    slugOwner.set(slug, krName);

    for (const alias of aliasSlugs) {
      const aliasOwner = slugOwner.get(alias);
      if (aliasOwner && aliasOwner !== krName) {
        throw new Error(`Character alias collision: "${alias}" is used by "${aliasOwner}" and "${krName}".`);
      }
      slugOwner.set(alias, krName);
    }

    const imagePath = getImagePath(krName);

    for (const lang of DETAIL_LANGS) {
      const displayName = getDisplayName(krName, lang, charEntry);
      const titleTemplate = seoMeta[lang].title;
      const descriptionTemplate = seoMeta[lang].description;

      const title = titleTemplate.replaceAll('{name}', displayName);
      const description = descriptionTemplate.replaceAll('{name}', displayName);

      const fileRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, `${slug}.html`)));
      const content = normalizeNewline(
        renderCharacterPage({
          lang,
          slug,
          characterKrName: krName,
          title,
          description,
          imagePath
        })
      );
      expected.set(fileRel, content);
    }

    const canonicalKoPath = `/kr/character/${slug}/`;
    addRedirectStub(`/character/${slug}/`, canonicalKoPath);

    for (const alias of aliasSlugs) {
      addRedirectStub(`/character/${alias}/`, canonicalKoPath);
      addRedirectStub(`/kr/character/${alias}/`, canonicalKoPath);
      addRedirectStub(`/en/character/${alias}/`, `/en/character/${slug}/`);
      addRedirectStub(`/jp/character/${alias}/`, `/jp/character/${slug}/`);
    }
  }

  for (const lang of ROOT_REDIRECT_LANGS) {
    const rootFileRel = toPosix(path.relative(ROOT, path.join(ROOT_STUB_DIR, `${lang}-index.html`)));
    const rootContent = normalizeNewline(renderRootRedirectPage(lang, `/${lang}/character/`));
    expected.set(rootFileRel, rootContent);
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
    console.error('Character SEO pages are out of date.');
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

  console.log(`Character SEO pages are up to date (${expectedFiles.size} files).`);
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

  console.log(`Generated ${expectedFiles.size} character SEO files in ${toPosix(path.relative(ROOT, OUTPUT_DIR))}`);
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

  const { allCharacters, characterData } = loadCharacterData();
  const slugMap = loadSlugMap(allCharacters);
  const seoMeta = readJson(seoMetaPath);
  ensureSeoMetaShape(seoMeta);
  const listSeoMeta = loadCharacterListSeoMetaFromI18n();

  const expectedFiles = buildExpectedFiles(allCharacters, characterData, seoMeta, listSeoMeta, slugMap);

  if (mode.check) {
    runCheck(expectedFiles);
    return;
  }

  runGenerate(expectedFiles);
}

main();
