#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const LANG_CONFIGS = [
  { lang: 'kr', sourceRoot: 'KR_Config' },
  { lang: 'en', sourceRoot: 'EN_Config' },
  { lang: 'jp', sourceRoot: 'JP_Config' }
];

const ELEMENT_BY_ID = {
  1: 'Phys',
  2: 'Gun',
  3: 'Fire',
  4: 'Ice',
  5: 'Electric',
  6: 'Wind',
  7: 'Psychokinesis',
  8: 'Nuclear',
  9: 'Bless',
  10: 'Curse'
};

const DEFAULT_RESIST_CODE_TO_CATEGORY = {
  1: 'Weak',
  2: 'Resistant',
  3: 'Nullify',
  4: 'Reflect',
  5: 'Absorb'
};

const ADAPT_TEMPLATE = {
  Weak: [],
  Resistant: [],
  Nullify: [],
  Reflect: [],
  Absorb: []
};
const JP_ERROR_PREFIX = '\u30A8\u30E9\u30FC';
const GENERIC_AFFIX_NAMES = new Set(['Special Effect', '\u7279\u6B8A\u52B9\u679C']);

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
  return {
    check: args.has('--check')
  };
}

function isPlaceholder(value) {
  const text = String(value ?? '').trim();
  return text === '' || text === 'AAAAAA==';
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function isInvalidLocalizedName(value) {
  const text = normalizeText(value);
  if (isPlaceholder(text)) return true;
  const lower = text.toLowerCase();
  return lower.startsWith('error:') || text.startsWith(JP_ERROR_PREFIX);
}

function isInvalidAffixName(value) {
  const text = normalizeText(value);
  if (isInvalidLocalizedName(text)) return true;
  return GENERIC_AFFIX_NAMES.has(text);
}

function pickLocalizedName(...candidates) {
  for (const candidate of candidates) {
    const text = normalizeText(candidate);
    if (!isInvalidLocalizedName(text)) {
      return text;
    }
  }
  return '';
}

function pickLocalizedAffixName(...candidates) {
  for (const candidate of candidates) {
    const text = normalizeText(candidate);
    if (!isInvalidAffixName(text)) {
      return text;
    }
  }
  return '';
}

function parseCsvNumbers(value, delimiter = ',') {
  if (value == null) return [];
  return String(value)
    .split(delimiter)
    .map((token) => Number(String(token).trim()))
    .filter((num) => Number.isFinite(num));
}

function parseIntSafe(value) {
  const num = Number(String(value ?? '').trim());
  return Number.isFinite(num) ? num : null;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function indexImageFiles() {
  const roots = [
    path.join(ROOT, 'apps', 'velvet_trial', 'img'),
    path.join(ROOT, 'assets', 'img')
  ];

  const byBaseName = new Map();

  const pushIfMissing = (fullPath) => {
    const baseName = path.basename(fullPath);
    if (!byBaseName.has(baseName)) {
      const rel = toPosix(path.relative(ROOT, fullPath));
      byBaseName.set(baseName, `/${rel}`);
    }
  };

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const stack = [root];

    while (stack.length > 0) {
      const current = stack.pop();
      const entries = fs.readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(fullPath);
          continue;
        }
        pushIfMissing(fullPath);
      }
    }
  }

  return byBaseName;
}

function resolveImagePath(fileName, indexedImages) {
  if (isPlaceholder(fileName)) return null;
  return indexedImages.get(String(fileName)) || null;
}

function buildResistCodeMap(confSkillNatureResist) {
  const map = { ...DEFAULT_RESIST_CODE_TO_CATEGORY };
  for (const row of confSkillNatureResist || []) {
    const sn = Number(row?.sn);
    if (!Number.isFinite(sn)) continue;
    if (DEFAULT_RESIST_CODE_TO_CATEGORY[sn]) {
      map[sn] = DEFAULT_RESIST_CODE_TO_CATEGORY[sn];
    }
  }
  return map;
}

function buildAdaptObject(adaptRow, resistCodeToCategory) {
  const result = {
    Weak: [],
    Resistant: [],
    Nullify: [],
    Reflect: [],
    Absorb: []
  };

  if (!adaptRow || isPlaceholder(adaptRow.adaptType) || isPlaceholder(adaptRow.adaptValue)) {
    return result;
  }

  const adaptTypes = parseCsvNumbers(adaptRow.adaptType);
  const adaptValues = parseCsvNumbers(adaptRow.adaptValue);
  const maxLen = Math.min(adaptTypes.length, adaptValues.length);

  for (let i = 0; i < maxLen; i += 1) {
    const elementId = adaptTypes[i];
    const resistCode = adaptValues[i];
    const elementName = ELEMENT_BY_ID[elementId];
    const category = resistCodeToCategory[resistCode];
    if (!elementName || !category) continue;
    result[category].push(elementName);
  }

  for (const key of Object.keys(result)) {
    result[key] = Array.from(new Set(result[key]));
  }

  return result;
}

function parseRule1(token) {
  const raw = String(token || '');
  if (!raw) {
    return { type: 'raw', raw: '' };
  }

  const parts = raw.split(',');
  const code = Number(parts[0]);

  if (code === 10 && parts.length >= 2) {
    const multiplier = Number(parts[1]);
    if (Number.isFinite(multiplier)) {
      return {
        type: 'weak_allout',
        multiplier,
        raw
      };
    }
  }

  if ((code === 12 || code === 2) && parts.length >= 3) {
    const elements = parseCsvNumbers(parts[1], ':');
    const multiplier = Number(parts[2]);
    if (elements.length > 0 && Number.isFinite(multiplier)) {
      return {
        type: 'element_score',
        elements,
        multiplier,
        raw
      };
    }
  }

  return {
    type: 'raw',
    raw
  };
}

function parseRuleTurnLimit(token) {
  const raw = String(token || '');
  const parts = raw.split(',');
  const code = Number(parts[0]);
  if (code === 1 && parts.length >= 3) {
    const maxActions = Number(parts[1]);
    const score = Number(parts[2]);
    if (Number.isFinite(maxActions) && Number.isFinite(score)) {
      return {
        type: 'turn_limit',
        maxActions,
        score,
        raw
      };
    }
  }
  return {
    type: 'raw',
    raw
  };
}

function parseRuleDeathLimit(token) {
  const raw = String(token || '');
  const parts = raw.split(',');
  const code = Number(parts[0]);
  if (code === 6 && parts.length >= 3) {
    const maxDeaths = Number(parts[1]);
    const score = Number(parts[2]);
    if (Number.isFinite(maxDeaths) && Number.isFinite(score)) {
      return {
        type: 'death_limit',
        maxDeaths,
        score,
        raw
      };
    }
  }
  return {
    type: 'raw',
    raw
  };
}

function parseConditions(bonusRule) {
  const parts = String(bonusRule || '').split('|');
  return {
    rule1: parseRule1(parts[0] || ''),
    rule2: parseRuleTurnLimit(parts[1] || ''),
    rule3: parseRuleDeathLimit(parts[2] || '')
  };
}

function buildMonsterImageName(model, enemyImageSet) {
  if (isPlaceholder(model)) {
    return { image: '', imageMissing: true };
  }
  const pngName = `B-guaiwutouxiang-${model}.png`;
  const webpName = `B-guaiwutouxiang-${model}.webp`;
  if (enemyImageSet.has(pngName)) {
    return { image: pngName, imageMissing: false };
  }
  if (enemyImageSet.has(webpName)) {
    return { image: webpName, imageMissing: false };
  }
  return { image: pngName, imageMissing: true };
}

function loadTranslationTables(baseDir, lang) {
  if (lang !== 'en' && lang !== 'jp') {
    return {
      chapterNameBySn: new Map(),
      monsterNameBySn: new Map(),
      affixBySn: new Map()
    };
  }

  const folder = lang === 'en' ? 'conftranslationen' : 'conftranslationjp';
  const suffix = lang === 'en' ? 'EN' : 'JP';
  const chapterPath = path.join(baseDir, folder, `ConfVelvetTrial_${suffix}.json`);
  const monsterPath = path.join(baseDir, folder, `ConfGuaiWu_${suffix}.json`);
  const affixPath = path.join(baseDir, folder, `ConfSkillAffix_${suffix}.json`);

  const chapterRows = fs.existsSync(chapterPath) ? readJson(chapterPath) : [];
  const monsterRows = fs.existsSync(monsterPath) ? readJson(monsterPath) : [];
  const affixRows = fs.existsSync(affixPath) ? readJson(affixPath) : [];

  return {
    chapterNameBySn: new Map(
      chapterRows.map((row) => [Number(row.sn), normalizeText(row.chapterNameResResult)])
    ),
    monsterNameBySn: new Map(
      monsterRows.map((row) => [Number(row.sn), normalizeText(row.name)])
    ),
    affixBySn: new Map(
      affixRows.map((row) => [
        Number(row.sn),
        {
          name: normalizeText(row.name),
          desc: normalizeText(row.desc)
        }
      ])
    )
  };
}

function buildLanguageData({ lang, sourceRoot }, ctx) {
  const baseDir = path.join(ROOT, 'config_db', sourceRoot);
  const read = (relativePath) => readJson(path.join(baseDir, relativePath));

  const confTrial = read('default/ConfVelvetTrial.json');
  const confLevel = read('default/ConfVelvetTrialLevel.json');
  const confBattle = read('default/ConfVelvetTrialBattle.json');
  const confInst = read('battle/ConfInst.json');
  const confZhanDou = read('battle/ConfZhanDou.json');
  const confGuaiWu = read('text/ConfGuaiWu.json');
  const confGuaiWuAdapt = read('text/ConfGuaiWuAdapt.json');
  const confSkillAffix = read('default/ConfSkillAffix.json');
  const confSkillNatureResist = read('default/ConfSkillNatureResist.json');
  const translation = loadTranslationTables(baseDir, lang);

  const chapterBySn = new Map(confTrial.map((row) => [Number(row.sn), row]));
  const levelBySn = new Map(confLevel.map((row) => [Number(row.sn), row]));
  const battleBySn = new Map(confBattle.map((row) => [Number(row.sn), row]));
  const instBySn = new Map(confInst.map((row) => [Number(row.sn), row]));
  const monsterBySn = new Map(confGuaiWu.map((row) => [Number(row.sn), row]));
  const adaptBySn = new Map(confGuaiWuAdapt.map((row) => [Number(row.sn), row]));
  const affixBySn = new Map(confSkillAffix.map((row) => [Number(row.sn), row]));

  const zhanDouByGroup = new Map();
  for (const row of confZhanDou) {
    const groupId = Number(row.monsterGroup);
    if (!Number.isFinite(groupId)) continue;
    if (!zhanDouByGroup.has(groupId)) zhanDouByGroup.set(groupId, []);
    zhanDouByGroup.get(groupId).push(row);
  }
  for (const rows of zhanDouByGroup.values()) {
    rows.sort((a, b) => {
      const pDiff = Number(a.position) - Number(b.position);
      if (pDiff !== 0) return pDiff;
      return Number(a.sn) - Number(b.sn);
    });
  }

  const krChapterBySn = ctx.krChapterBySn;
  const krMonsterBySn = ctx.krMonsterBySn;
  const krAffixBySn = ctx.krAffixBySn;
  const enemyImageSet = ctx.enemyImageSet;
  const indexedImages = ctx.indexedImages;
  const resistCodeToCategory = buildResistCodeMap(confSkillNatureResist);

  const chapters = confTrial
    .slice()
    .sort((a, b) => Number(a.sn) - Number(b.sn))
    .map((chapterRow) => {
      const chapterSn = Number(chapterRow.sn);
      const krChapter = krChapterBySn.get(chapterSn);
      const chapterName = pickLocalizedName(
        translation.chapterNameBySn.get(chapterSn),
        chapterRow.chapterNameResResult,
        krChapter?.chapterNameResResult
      );

      const chapterNameRes = String(chapterRow.chapterNameRes || '');
      const chapterNameBgRes = String(chapterRow.chapterNameBgRes || '');
      const chapterImg = String(chapterRow.chapterImg || '');

      const chapterNameResPath = resolveImagePath(chapterNameRes, indexedImages);
      const chapterNameBgResPath = resolveImagePath(chapterNameBgRes, indexedImages);
      const chapterImgPath = resolveImagePath(chapterImg, indexedImages);
      const chapterAffixSn = parseIntSafe(chapterRow.skillAffix);
      const chapterAffix = chapterAffixSn != null ? affixBySn.get(chapterAffixSn) : null;
      const krChapterAffix = chapterAffixSn != null ? krAffixBySn.get(chapterAffixSn) : null;
      const translatedAffix = chapterAffixSn != null ? translation.affixBySn.get(chapterAffixSn) : null;
      const chapterEffectName = pickLocalizedAffixName(
        translatedAffix?.name,
        chapterAffix?.name,
        krChapterAffix?.name
      );
      const chapterEffectDesc = pickLocalizedName(
        translatedAffix?.desc,
        chapterAffix?.desc,
        krChapterAffix?.desc
      );

      const levelList = parseCsvNumbers(chapterRow.levelList);

      const levels = levelList.map((levelSn) => {
        const levelRow = levelBySn.get(levelSn);
        if (!levelRow) return null;

        const battleSns = parseCsvNumbers(levelRow.battleSN);
        const phases = battleSns.map((battleSn, phaseIndex) => {
          const battleRow = battleBySn.get(battleSn);
          if (!battleRow) return null;
          const instSn = Number(battleRow.instSN);
          const instRow = instBySn.get(instSn);
          if (!instRow) return null;
          const monsterGroup = Number(instRow.monsterGroup);

          const monsters = (zhanDouByGroup.get(monsterGroup) || []).map((groupRow) => {
            const monsterSn = Number(groupRow.monster);
            const monster = monsterBySn.get(monsterSn);
            const krMonster = krMonsterBySn.get(monsterSn);
            const monsterName = pickLocalizedName(
              translation.monsterNameBySn.get(monsterSn),
              monster?.name,
              krMonster?.name
            );
            const level = parseIntSafe(monster?.lv);
            const adaptRow = adaptBySn.get(Number(monster?.adaptSN));
            const adapt = buildAdaptObject(adaptRow, resistCodeToCategory);
            const imageInfo = buildMonsterImageName(monster?.model, enemyImageSet);
            return {
              position: Number(groupRow.position),
              sn: monsterSn,
              name: monsterName,
              level,
              image: imageInfo.image,
              imageMissing: imageInfo.imageMissing,
              isBoss: Number(monster?.isBoss || 0),
              adapt
            };
          });

          return {
            phase: phaseIndex + 1,
            battleSn,
            instSn,
            monsterGroup,
            monsters
          };
        }).filter(Boolean);

        return {
          sn: levelSn,
          levelNum: Number(levelRow.levelNum),
          phaseCount: phases.length,
          starScores: parseCsvNumbers(levelRow.goalScores),
          conditions: parseConditions(levelRow.bonusRule),
          phases
        };
      }).filter(Boolean);

      return {
        sn: chapterSn,
        name: chapterName,
        effect: {
          sn: chapterAffixSn,
          name: chapterEffectName,
          desc: chapterEffectDesc
        },
        images: {
          chapterNameRes,
          chapterNameBgRes,
          chapterImg,
          chapterNameResPath,
          chapterNameBgResPath,
          chapterImgPath,
          resolvedPath: chapterImgPath,
          missing: !chapterImgPath
        },
        levels
      };
    });

  return {
    meta: {
      lang,
      sourceRoot,
      generatedAt: ctx.generatedAtBySource[sourceRoot]
    },
    chapters
  };
}

function buildExpectedOutput() {
  const indexedImages = indexImageFiles();
  const enemyImageDir = path.join(ROOT, 'assets', 'img', 'enemy');
  const enemyImageSet = fs.existsSync(enemyImageDir)
    ? new Set(fs.readdirSync(enemyImageDir))
    : new Set();

  const krChapterRows = readJson(path.join(ROOT, 'config_db', 'KR_Config', 'default', 'ConfVelvetTrial.json'));
  const krMonsterRows = readJson(path.join(ROOT, 'config_db', 'KR_Config', 'text', 'ConfGuaiWu.json'));
  const krAffixRows = readJson(path.join(ROOT, 'config_db', 'KR_Config', 'default', 'ConfSkillAffix.json'));

  const sourceInputFiles = [
    'default/ConfVelvetTrial.json',
    'default/ConfVelvetTrialLevel.json',
    'default/ConfVelvetTrialBattle.json',
    'battle/ConfInst.json',
    'battle/ConfZhanDou.json',
    'text/ConfGuaiWu.json',
    'text/ConfGuaiWuAdapt.json',
    'default/ConfSkillAffix.json',
    'default/ConfSkillNature.json',
    'default/ConfSkillNatureResist.json'
  ];
  const optionalSourceInputFiles = [
    'conftranslationen/ConfVelvetTrial_EN.json',
    'conftranslationen/ConfGuaiWu_EN.json',
    'conftranslationen/ConfSkillAffix_EN.json',
    'conftranslationjp/ConfVelvetTrial_JP.json',
    'conftranslationjp/ConfGuaiWu_JP.json',
    'conftranslationjp/ConfSkillAffix_JP.json'
  ];

  const generatedAtBySource = {};
  for (const langConfig of LANG_CONFIGS) {
    const sourceRoot = langConfig.sourceRoot;
    const baseDir = path.join(ROOT, 'config_db', sourceRoot);
    let maxMtime = 0;
    for (const relativeFile of sourceInputFiles) {
      const fullPath = path.join(baseDir, relativeFile);
      const stat = fs.statSync(fullPath);
      if (stat.mtimeMs > maxMtime) {
        maxMtime = stat.mtimeMs;
      }
    }
    for (const relativeFile of optionalSourceInputFiles) {
      const fullPath = path.join(baseDir, relativeFile);
      if (!fs.existsSync(fullPath)) continue;
      const stat = fs.statSync(fullPath);
      if (stat.mtimeMs > maxMtime) {
        maxMtime = stat.mtimeMs;
      }
    }
    generatedAtBySource[sourceRoot] = new Date(maxMtime || Date.now()).toISOString();
  }

  const ctx = {
    indexedImages,
    enemyImageSet,
    krChapterBySn: new Map(krChapterRows.map((row) => [Number(row.sn), row])),
    krMonsterBySn: new Map(krMonsterRows.map((row) => [Number(row.sn), row])),
    krAffixBySn: new Map(krAffixRows.map((row) => [Number(row.sn), row])),
    generatedAtBySource
  };

  const expected = new Map();

  for (const langConfig of LANG_CONFIGS) {
    const data = buildLanguageData(langConfig, ctx);
    const content = `${normalizeNewline(JSON.stringify(data, null, 2))}\n`;
    expected.set(
      path.join(ROOT, 'apps', 'velvet_trial', 'data', `${langConfig.lang}.json`),
      content
    );
  }

  return expected;
}

function runCheck(expectedFiles) {
  const missing = [];
  const changed = [];

  for (const [filePath, expectedContent] of expectedFiles.entries()) {
    if (!fs.existsSync(filePath)) {
      missing.push(filePath);
      continue;
    }
    const actual = normalizeNewline(fs.readFileSync(filePath, 'utf8'));
    if (actual !== expectedContent) {
      changed.push(filePath);
    }
  }

  if (missing.length || changed.length) {
    console.error('Velvet trial data files are out of date.');
    if (missing.length) {
      console.error(`- Missing (${missing.length}):`);
      for (const file of missing) {
        console.error(`  - ${toPosix(path.relative(ROOT, file))}`);
      }
    }
    if (changed.length) {
      console.error(`- Changed (${changed.length}):`);
      for (const file of changed) {
        console.error(`  - ${toPosix(path.relative(ROOT, file))}`);
      }
    }
    process.exit(1);
  }

  console.log(`Velvet trial data files are up to date (${expectedFiles.size}).`);
}

function runGenerate(expectedFiles) {
  for (const [filePath, expectedContent] of expectedFiles.entries()) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, expectedContent, 'utf8');
    console.log(`Generated ${toPosix(path.relative(ROOT, filePath))}`);
  }
}

function main() {
  const mode = parseArgs(process.argv);
  const expected = buildExpectedOutput();

  if (mode.check) {
    runCheck(expected);
    return;
  }

  runGenerate(expected);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
