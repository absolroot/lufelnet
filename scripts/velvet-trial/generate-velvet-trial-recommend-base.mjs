#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const KR_DATA_PATH = path.join(ROOT, 'apps', 'velvet_trial', 'data', 'kr.json');
const CHARACTER_INFO_PATH = path.join(ROOT, 'data', 'character_info.js');
const RECOMMEND_DIR = path.join(ROOT, 'apps', 'velvet_trial', 'data', 'recommendations');
const CHAPTER_SNS = [1, 2, 3, 4, 5];

const LEGACY_FILES = [
  path.join(ROOT, 'apps', 'velvet_trial', 'data', 'recommendation-base.json'),
  path.join(ROOT, 'apps', 'velvet_trial', 'data', 'recommendation-names.json')
];

const ELEMENT_ORDER = ['Phys', 'Gun', 'Fire', 'Ice', 'Electric', 'Wind', 'Psychokinesis', 'Nuclear', 'Bless', 'Curse'];
const ELEMENT_ALIASES = {
  Phys: ['Phys', 'Physical', '물리'],
  Gun: ['Gun', '총격'],
  Fire: ['Fire', '화염'],
  Ice: ['Ice', '빙결'],
  Electric: ['Electric', '전격'],
  Wind: ['Wind', '질풍'],
  Psychokinesis: ['Psychokinesis', 'Psy', '염동'],
  Nuclear: ['Nuclear', 'Nuke', '핵열'],
  Bless: ['Bless', '축복'],
  Curse: ['Curse', '주원']
};

function toPosix(inputPath) {
  return String(inputPath).replace(/\\/g, '/');
}

function normalizeNewline(text) {
  return String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  for (const arg of args) {
    if (arg !== '--check') {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return { check: args.has('--check') };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseCharacterInfo(filePath) {
  const script = fs.readFileSync(filePath, 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(script, context);
  const data = context.window?.characterData || context.characterData || {};
  return data && typeof data === 'object' ? data : {};
}

function canonicalizeElementKey(value) {
  const raw = String(value || '').trim();
  if (!raw || raw === 'AAAAAA==') return '';
  if (ELEMENT_ORDER.includes(raw)) return raw;

  const lower = raw.toLowerCase();
  for (const [key, aliases] of Object.entries(ELEMENT_ALIASES)) {
    if (aliases.some((alias) => alias.toLowerCase() === lower || alias === raw)) {
      return key;
    }
  }
  return '';
}

function normalizeElementKeys(value) {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.flatMap((item) => normalizeElementKeys(item))));
  }

  const raw = String(value || '').trim();
  if (!raw || raw === 'AAAAAA==') return [];

  const direct = canonicalizeElementKey(raw);
  if (direct) return [direct];

  const found = new Set();
  Object.entries(ELEMENT_ALIASES).forEach(([key, aliases]) => {
    aliases.forEach((alias) => {
      if (raw.includes(alias)) found.add(key);
    });
  });
  return Array.from(found);
}

function sortElementKeys(a, b) {
  return ELEMENT_ORDER.indexOf(a) - ELEMENT_ORDER.indexOf(b);
}

function buildCharacterPools(characterData) {
  const all = [];
  Object.entries(characterData).forEach(([id, row]) => {
    const key = String(id || '').trim();
    if (!key) return;

    const elementKeys = normalizeElementKeys(row?.element);
    if (!elementKeys.length) return;

    all.push({
      id: key,
      releaseOrder: Number(row?.release_order || row?.releaseOrder || 0),
      elementKeys
    });
  });

  all.sort((a, b) => (b.releaseOrder - a.releaseOrder) || a.id.localeCompare(b.id, 'ko'));

  const byElement = new Map();
  ELEMENT_ORDER.forEach((key) => byElement.set(key, []));
  all.forEach((entry) => {
    entry.elementKeys.forEach((elementKey) => {
      const bucket = byElement.get(elementKey);
      if (!bucket) return;
      bucket.push(entry);
    });
  });

  return { all, byElement };
}

function buildPhaseSpecs(krData) {
  const specs = [];
  const chapters = Array.isArray(krData?.chapters) ? krData.chapters : [];
  chapters.forEach((chapter) => {
    const chapterSn = Number(chapter?.sn);
    if (!Number.isFinite(chapterSn)) return;

    const levels = Array.isArray(chapter?.levels) ? chapter.levels : [];
    levels.forEach((level) => {
      const levelSn = Number(level?.sn);
      const levelNum = Number(level?.levelNum);
      if (!Number.isFinite(levelSn)) return;

      const phases = Array.isArray(level?.phases) ? level.phases : [];
      phases.forEach((phase) => {
        const phaseNo = Number(phase?.phase);
        if (!Number.isFinite(phaseNo)) return;
        specs.push({
          chapterSn,
          levelSn,
          levelNum: Number.isFinite(levelNum) ? levelNum : 0,
          phaseNo,
          monsters: Array.isArray(phase?.monsters) ? phase.monsters : []
        });
      });
    });
  });
  return specs;
}

function collectWeaknessCounts(monsters) {
  const counts = new Map();
  monsters.forEach((monster) => {
    const weakList = Array.isArray(monster?.adapt?.Weak)
      ? monster.adapt.Weak
      : (Array.isArray(monster?.adapt?.약점) ? monster.adapt.약점 : []);

    const uniqueWeak = new Set();
    weakList.forEach((name) => {
      const key = canonicalizeElementKey(name);
      if (key) uniqueWeak.add(key);
    });

    uniqueWeak.forEach((key) => counts.set(key, (counts.get(key) || 0) + 1));
  });
  return counts;
}

function buildCharactersForPhase(spec, byElement) {
  const weaknessCounts = collectWeaknessCounts(spec.monsters);
  const weaknessKeys = Array.from(weaknessCounts.keys()).sort((a, b) => {
    const diff = (weaknessCounts.get(b) || 0) - (weaknessCounts.get(a) || 0);
    return diff !== 0 ? diff : sortElementKeys(a, b);
  });

  const characters = [];
  const seen = new Set();
  weaknessKeys.forEach((elementKey) => {
    const pool = byElement.get(elementKey) || [];
    pool.forEach((entry) => {
      const id = String(entry?.id || '').trim();
      if (!id || seen.has(id)) return;
      seen.add(id);
      characters.push(id);
    });
  });
  return characters;
}

function getRoundPath(chapterSn, levelSn, phaseNo) {
  return path.join(RECOMMEND_DIR, `chapter-${chapterSn}`, `round-${levelSn}-${phaseNo}.json`);
}

function buildRoundJson(spec, characters) {
  const payload = {
    chapterSn: spec.chapterSn,
    levelSn: spec.levelSn,
    levelNum: spec.levelNum,
    phase: spec.phaseNo,
    characters,
    personas: []
  };
  return `${normalizeNewline(JSON.stringify(payload, null, 2))}\n`;
}

function runCheckLegacyFiles() {
  for (const filePath of LEGACY_FILES) {
    if (fs.existsSync(filePath)) {
      console.error(`Legacy file should be removed: ${toPosix(path.relative(ROOT, filePath))}`);
      process.exit(1);
    }
  }
}

function runCheckRoundFiles(phaseSpecs) {
  for (const chapterSn of CHAPTER_SNS) {
    const oldChapterFile = path.join(RECOMMEND_DIR, `chapter-${chapterSn}.json`);
    if (fs.existsSync(oldChapterFile)) {
      console.error(`Legacy chapter file should be removed: ${toPosix(path.relative(ROOT, oldChapterFile))}`);
      process.exit(1);
    }
  }

  for (const spec of phaseSpecs) {
    const filePath = getRoundPath(spec.chapterSn, spec.levelSn, spec.phaseNo);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing ${toPosix(path.relative(ROOT, filePath))}`);
      process.exit(1);
    }

    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (Number(parsed?.chapterSn) !== spec.chapterSn) throw new Error('chapterSn mismatch');
      if (Number(parsed?.levelSn) !== spec.levelSn) throw new Error('levelSn mismatch');
      if (Number(parsed?.phase) !== spec.phaseNo) throw new Error('phase mismatch');
      if (!Array.isArray(parsed?.characters)) throw new Error('characters must be array');
      if (!Array.isArray(parsed?.personas)) throw new Error('personas must be array');
    } catch (error) {
      console.error(`Invalid round JSON ${toPosix(path.relative(ROOT, filePath))}: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  }
}

function clearChapterDirectories() {
  fs.mkdirSync(RECOMMEND_DIR, { recursive: true });
  for (const chapterSn of CHAPTER_SNS) {
    const chapterDir = path.join(RECOMMEND_DIR, `chapter-${chapterSn}`);
    fs.rmSync(chapterDir, { recursive: true, force: true });
    fs.mkdirSync(chapterDir, { recursive: true });

    const legacyChapterFile = path.join(RECOMMEND_DIR, `chapter-${chapterSn}.json`);
    if (fs.existsSync(legacyChapterFile)) {
      fs.rmSync(legacyChapterFile);
    }
  }
}

function runGenerate(phaseSpecs, byElement) {
  for (const filePath of LEGACY_FILES) {
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath);
      console.log(`Removed ${toPosix(path.relative(ROOT, filePath))}`);
    }
  }

  clearChapterDirectories();

  phaseSpecs.forEach((spec) => {
    const characters = buildCharactersForPhase(spec, byElement);
    const filePath = getRoundPath(spec.chapterSn, spec.levelSn, spec.phaseNo);
    fs.writeFileSync(filePath, buildRoundJson(spec, characters), 'utf8');
  });

  console.log(`Generated ${phaseSpecs.length} round recommendation files in ${toPosix(path.relative(ROOT, RECOMMEND_DIR))}`);
}

function main() {
  const mode = parseArgs(process.argv);
  const krData = readJson(KR_DATA_PATH);
  const characterData = parseCharacterInfo(CHARACTER_INFO_PATH);
  const phaseSpecs = buildPhaseSpecs(krData);
  const { byElement } = buildCharacterPools(characterData);

  if (mode.check) {
    runCheckLegacyFiles();
    runCheckRoundFiles(phaseSpecs);
    console.log(`Velvet trial round recommendation files are up to date (${phaseSpecs.length} files).`);
    return;
  }

  runGenerate(phaseSpecs, byElement);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
