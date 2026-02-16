#!/usr/bin/env node

/**
 * sync-character-slugs.mjs
 *
 * Synchronizes _data/character_slugs.json with data/character_info.js.
 *
 * Usage:
 *   node scripts/seo/sync-character-slugs.mjs
 *   node scripts/seo/sync-character-slugs.mjs --check
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const characterInfoPath = path.join(ROOT, 'data', 'character_info.js');
const slugMapPath = path.join(ROOT, '_data', 'character_slugs.json');

const EXCLUDED_CHARACTER = '\uC6D0\uB354'; // "원더"

function normalizeNewline(text) {
  return String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/['".]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

function parseMode() {
  const args = process.argv.slice(2);
  const known = new Set(['--check']);
  for (const arg of args) {
    if (!known.has(arg)) {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return { check: args.includes('--check') };
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
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
  ].filter((name) => name !== EXCLUDED_CHARACTER);

  if (allCharacters.length === 0) {
    throw new Error('No characters found in data/character_info.js');
  }

  return { allCharacters, characterData };
}

function loadExistingSlugMap() {
  const mapRaw = readJson(slugMapPath);
  if (!mapRaw || typeof mapRaw !== 'object' || Array.isArray(mapRaw)) {
    throw new Error('_data/character_slugs.json must be an object map.');
  }
  return mapRaw;
}

function buildSyncedSlugMap(allCharacters, characterData, mapRaw) {
  const nextMap = {};

  for (const krName of allCharacters) {
    const existingEntry = mapRaw[krName];
    const existingObj = (existingEntry && typeof existingEntry === 'object' && !Array.isArray(existingEntry))
      ? existingEntry
      : null;

    const charEntry = characterData[krName];
    if (!charEntry || typeof charEntry !== 'object') {
      throw new Error(`Missing character data entry for "${krName}" in characterData`);
    }

    const rawCodename = String(charEntry.codename || '').trim();
    const codenameSlug = slugify(rawCodename);
    if (!codenameSlug) {
      throw new Error(`Missing or invalid codename for "${krName}" in data/character_info.js`);
    }

    const rawSlug = String(existingObj?.slug || '').trim();
    const slug = rawSlug ? ensureSlugValue(rawSlug, `${krName}.slug`) : codenameSlug;

    const aliasesRaw = Array.isArray(existingObj?.aliases) ? existingObj.aliases : [];
    const aliases = [];
    const aliasSeen = new Set();
    for (const aliasRaw of aliasesRaw) {
      const alias = ensureSlugValue(String(aliasRaw || ''), `${krName}.aliases`);
      if (alias === slug || aliasSeen.has(alias)) continue;
      aliasSeen.add(alias);
      aliases.push(alias);
    }

    nextMap[krName] = { slug, aliases };
  }

  return nextMap;
}

function validateUniqueness(slugMap) {
  const ownerByToken = new Map();

  for (const [krName, entry] of Object.entries(slugMap)) {
    const canonical = entry.slug;
    const prevCanonicalOwner = ownerByToken.get(canonical);
    if (prevCanonicalOwner && prevCanonicalOwner !== krName) {
      throw new Error(`Character slug collision: "${canonical}" is used by "${prevCanonicalOwner}" and "${krName}".`);
    }
    ownerByToken.set(canonical, krName);

    for (const alias of entry.aliases) {
      const prevAliasOwner = ownerByToken.get(alias);
      if (prevAliasOwner && prevAliasOwner !== krName) {
        throw new Error(`Character alias collision: "${alias}" is used by "${prevAliasOwner}" and "${krName}".`);
      }
      ownerByToken.set(alias, krName);
    }
  }
}

function stableStringifySlugMap(mapObj) {
  const keys = Object.keys(mapObj);
  const lines = ['{'];

  keys.forEach((key, index) => {
    const entry = mapObj[key];
    const aliasList = entry.aliases.map((alias) => JSON.stringify(alias)).join(', ');
    const aliases = `[${aliasList}]`;
    const trailingComma = index < keys.length - 1 ? ',' : '';
    lines.push(`  ${JSON.stringify(key)}: { "slug": ${JSON.stringify(entry.slug)}, "aliases": ${aliases} }${trailingComma}`);
  });

  lines.push('}');
  return `${lines.join('\n')}\n`;
}

function main() {
  const mode = parseMode();

  const { allCharacters, characterData } = loadCharacterData();
  const mapRaw = loadExistingSlugMap();
  const syncedMap = buildSyncedSlugMap(allCharacters, characterData, mapRaw);
  validateUniqueness(syncedMap);

  const expected = stableStringifySlugMap(syncedMap);
  const actual = normalizeNewline(fs.readFileSync(slugMapPath, 'utf8'));

  if (mode.check) {
    if (actual !== expected) {
      console.error('_data/character_slugs.json is out of date. Run: npm run seo:character:sync-slugs');
      process.exit(1);
    }
    console.log('_data/character_slugs.json is up to date.');
    return;
  }

  if (actual === expected) {
    console.log('No changes needed for _data/character_slugs.json');
    return;
  }

  fs.writeFileSync(slugMapPath, expected, 'utf8');
  console.log('Updated _data/character_slugs.json');
}

main();
