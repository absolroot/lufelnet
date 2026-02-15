#!/usr/bin/env node

/**
 * generate-synergy-pages.mjs
 *
 * Generates static SEO pages for synergy characters and language root redirects.
 *
 * Usage:
 *   node scripts/seo/generate-synergy-pages.mjs
 *   node scripts/seo/generate-synergy-pages.mjs --check
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const OUTPUT_DIR = path.join(ROOT, 'pages', 'synergy');
const ROOT_STUB_DIR = path.join(OUTPUT_DIR, 'roots');

const CHARACTER_LANGS = ['kr', 'en', 'jp'];
const ROOT_REDIRECT_LANGS = ['en', 'jp', 'cn'];

const friendNumPath = path.join(ROOT, 'apps', 'synergy', 'friends', 'friend_num.json');
const charInfoPath = path.join(ROOT, 'data', 'character_info.js');
const seoMetaPath = path.join(ROOT, 'i18n', 'pages', 'synergy', 'seo-meta.json');

// Characters not in characterData that need name overrides
const NAME_OVERRIDES = {
  메로페: { name_en: 'Merope', name_jp: 'メロペ' }
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

function sortByCodePoint(values) {
  return [...values].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function parseCharacterData(src) {
  const match = src.match(/Object\.assign\(\s*window\.characterData\s*,\s*(\{[\s\S]*\})\s*\)\s*;/);
  if (!match) {
    throw new Error('Could not parse data/character_info.js (Object.assign block not found).');
  }
  const fn = new Function(`return (${match[1]});`);
  return fn();
}

function ensureSeoMetaShape(meta) {
  for (const lang of CHARACTER_LANGS) {
    const langMeta = meta?.[lang];
    if (!langMeta || typeof langMeta !== 'object') {
      throw new Error(`Missing seo meta language entry: ${lang}`);
    }
    if (typeof langMeta.title !== 'string' || !langMeta.title.includes('{name}')) {
      throw new Error(`i18n/pages/synergy/seo-meta.json missing valid title template for ${lang}.`);
    }
    if (typeof langMeta.description !== 'string' || !langMeta.description.includes('{name}')) {
      throw new Error(`i18n/pages/synergy/seo-meta.json missing valid description template for ${lang}.`);
    }
  }
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/['".]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCodename(krName, friendNum, characterData) {
  if (krName === '메로페') return 'merope';

  const charEntry = characterData[krName];
  if (charEntry?.codename) {
    const codename = slugify(charEntry.codename);
    if (!codename) {
      throw new Error(`Invalid codename for "${krName}" in data/character_info.js`);
    }
    return codename;
  }

  const fallbackNameEn = friendNum[krName]?.name_en;
  if (fallbackNameEn) {
    const codename = slugify(fallbackNameEn);
    if (!codename) {
      throw new Error(`Invalid name_en fallback for "${krName}" in apps/synergy/friends/friend_num.json`);
    }
    return codename;
  }

  throw new Error(
    `Cannot resolve codename for "${krName}". Add characterData.codename or friend_num.name_en.`
  );
}

function getDisplayName(krName, lang, friendNum, characterData) {
  if (lang === 'kr') return krName;

  const override = NAME_OVERRIDES[krName];
  const fnEntry = friendNum[krName];
  const charEntry = characterData[krName];

  if (lang === 'en') {
    return (
      override?.name_en ||
      fnEntry?.name_en ||
      charEntry?.name_en ||
      krName
    );
  }

  if (lang === 'jp') {
    return (
      override?.name_jp ||
      fnEntry?.name_jp ||
      charEntry?.name_jp ||
      override?.name_en ||
      fnEntry?.name_en ||
      charEntry?.name_en ||
      krName
    );
  }

  return krName;
}

function getImagePath(krName, friendNum) {
  const fnEntry = friendNum[krName];
  if (fnEntry?.img_color) {
    return `/assets/img/synergy/face/${fnEntry.img_color}`;
  }
  if (fnEntry?.img) {
    return `/assets/img/synergy/face_black/${fnEntry.img}`;
  }
  return '/assets/img/logo/lufel.png';
}

function isActiveCharacter(entry) {
  return !(entry?.inactive && entry?.num === 0);
}

function renderCharacterPage({ lang, codename, title, description, imagePath }) {
  const permalink = lang === 'kr' ? `/synergy/${codename}/` : `/${lang}/synergy/${codename}/`;
  const altKo = `/synergy/${codename}/`;
  const altEn = `/en/synergy/${codename}/`;
  const altJp = `/jp/synergy/${codename}/`;
  const redirectFromLines = lang === 'kr'
    ? [
      'redirect_from:',
      `  - /kr/synergy/${codename}/`,
      `  - /kr/synergy/${codename}/index.html`
    ]
    : [];

  return [
    '---',
    'layout: default',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `image: ${yamlQuote(imagePath)}`,
    `language: ${lang}`,
    `permalink: ${permalink}`,
    ...redirectFromLines,
    `synergy_character: ${codename}`,
    'alternate_urls:',
    `  ko: ${altKo}`,
    `  en: ${altEn}`,
    `  jp: ${altJp}`,
    '---',
    '{% include synergy-body.html %}',
    ''
  ].join('\n');
}

function renderRootRedirectPage(lang) {
  return [
    '---',
    'layout: null',
    `permalink: /${lang}/synergy/`,
    `redirect_to: /synergy/?lang=${lang}`,
    'sitemap: false',
    '---',
    ''
  ].join('\n');
}

function buildExpectedFiles(friendNum, characterData, seoMeta) {
  const expected = new Map();
  const codenameOwner = new Map();

  const activeKrNames = sortByCodePoint(
    Object.keys(friendNum).filter((krName) => isActiveCharacter(friendNum[krName]))
  );

  for (const krName of activeKrNames) {
    const codename = getCodename(krName, friendNum, characterData);
    const previousOwner = codenameOwner.get(codename);
    if (previousOwner && previousOwner !== krName) {
      throw new Error(`Codename collision: "${codename}" is used by "${previousOwner}" and "${krName}".`);
    }
    codenameOwner.set(codename, krName);

    const imagePath = getImagePath(krName, friendNum);

    for (const lang of CHARACTER_LANGS) {
      const displayName = getDisplayName(krName, lang, friendNum, characterData);
      const titleTemplate = seoMeta[lang].title;
      const descriptionTemplate = seoMeta[lang].description;

      const title = titleTemplate.replaceAll('{name}', displayName);
      const description = descriptionTemplate.replaceAll('{name}', displayName);

      const fileRel = toPosix(path.relative(ROOT, path.join(OUTPUT_DIR, lang, `${codename}.html`)));
      const content = normalizeNewline(
        renderCharacterPage({
          lang,
          codename,
          title,
          description,
          imagePath
        })
      );
      expected.set(fileRel, content);
    }
  }

  for (const lang of ROOT_REDIRECT_LANGS) {
    const fileRel = toPosix(path.relative(ROOT, path.join(ROOT_STUB_DIR, `${lang}-index.html`)));
    const content = normalizeNewline(renderRootRedirectPage(lang));
    expected.set(fileRel, content);
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
    console.error('Synergy SEO pages are out of date.');
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

  console.log(`Synergy SEO pages are up to date (${expectedFiles.size} files).`);
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

  console.log(`Generated ${expectedFiles.size} synergy SEO files in ${toPosix(path.relative(ROOT, OUTPUT_DIR))}`);
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

  const friendNum = readJson(friendNumPath);
  const charInfoSrc = fs.readFileSync(charInfoPath, 'utf8');
  const characterData = parseCharacterData(charInfoSrc);
  const seoMeta = readJson(seoMetaPath);
  ensureSeoMetaShape(seoMeta);

  const expectedFiles = buildExpectedFiles(friendNum, characterData, seoMeta);

  if (mode.check) {
    runCheck(expectedFiles);
    return;
  }

  runGenerate(expectedFiles);
}

main();
