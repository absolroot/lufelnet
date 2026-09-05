#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ALL_OUT_DIR = path.join(ROOT, 'assets', 'img', 'gallery', 'allout');
const THUMB_DIR = path.join(ROOT, 'assets', 'img', 'gallery', 'thumbs', 'allout');
const MANIFEST_PATH = path.join(ROOT, 'apps', 'gallery', 'allout-manifest.json');
const CHECK_ONLY = process.argv.includes('--check');
const WONDER_VARIANTS = new Set(['원더-벨벳룸', '원더-신년', '원더-슈진교복', '원더-여름']);
const WONDER_RELEASE_ORDER = 0;

function loadCharacterData() {
  const source = fs.readFileSync(path.join(ROOT, 'data', 'character_info.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: 'data/character_info.js' });
  const data = sandbox.characterData || sandbox.window.characterData;
  if (!data || typeof data !== 'object') throw new Error('Could not load characterData.');
  return data;
}

function sourceFiles() {
  return fs.readdirSync(ALL_OUT_DIR)
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, 'ko'));
}

function buildEntries() {
  const characterData = loadCharacterData();
  return sourceFiles().map((filename) => {
    const stem = path.parse(filename).name;
    const tag = WONDER_VARIANTS.has(stem) ? '원더' : stem;
    if (!characterData[tag]) {
      throw new Error(`No character tag mapping for all-out image: ${filename}`);
    }
    const releaseOrder = tag === '원더'
      ? WONDER_RELEASE_ORDER
      : Number(characterData[tag].release_order);
    if (!Number.isFinite(releaseOrder)) {
      throw new Error(`Missing release_order for all-out image tag: ${tag}`);
    }
    return {
      filename,
      thumbnail: `allout/${stem}.webp`,
      tags: [tag],
      category: ['allout'],
      order: releaseOrder
    };
  }).sort((a, b) => b.order - a.order || a.filename.localeCompare(b.filename, 'ko'));
}

function manifestText(entries) {
  return `${JSON.stringify(entries, null, 2)}\n`;
}

function generateThumbnails(entries) {
  fs.mkdirSync(THUMB_DIR, { recursive: true });
  entries.forEach((entry) => {
    const source = path.join(ALL_OUT_DIR, entry.filename);
    const target = path.join(THUMB_DIR, path.basename(entry.thumbnail));
    execFileSync('magick', [source, '-resize', '480x', '-quality', '82', target], { stdio: 'inherit' });
  });
}

function check(entries) {
  if (!fs.existsSync(MANIFEST_PATH)) throw new Error('All-out manifest is missing. Run gallery:allout:generate.');
  const expected = manifestText(entries);
  const actual = fs.readFileSync(MANIFEST_PATH, 'utf8');
  if (actual !== expected) throw new Error('All-out manifest is stale. Run gallery:allout:generate.');
  entries.forEach((entry) => {
    const thumbnail = path.join(THUMB_DIR, path.basename(entry.thumbnail));
    if (!fs.existsSync(thumbnail)) throw new Error(`All-out thumbnail is missing: ${entry.thumbnail}`);
  });
}

const entries = buildEntries();
if (CHECK_ONLY) {
  check(entries);
  console.log(`Verified ${entries.length} all-out images, tags, manifest entries, and thumbnails.`);
} else {
  fs.writeFileSync(MANIFEST_PATH, manifestText(entries), 'utf8');
  generateThumbnails(entries);
  console.log(`Generated ${entries.length} all-out manifest entries and thumbnails.`);
}
