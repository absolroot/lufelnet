#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const TRIAL_DATA_DIR = path.join(ROOT, 'apps', 'velvet_trial', 'data');
const TAG_CHAPTER = {
  sn: 6,
  effectSn: 4008,
  levelCount: 20,
  nameByLang: { kr: '다채로운 빛', cn: '千面浮光', en: 'A Thousand Faces', jp: '千面の光' },
  recommendationVersion: '5.5.1',
  image: 'shilian-tu08.png',
  battleStarts: [71801, 71901]
};
const THIEF_TAG_IDS = [
  null, 'male', 'female', 'p5x', 'p5', 'p5r', 'dancing_star', 'p3r', 'p3p',
  'phantom_thieves_of_hearts', 'sees', 'phantom_thieves', 'velvet_resident',
  'phantom_idol', 'special_collaboration', 'survival_instinct', 'virtual', 'swimsuit'
];
const GLOBAL_TAG_TEXT = {
  en: {
    effect: {
      name: 'Faces of the Many',
      desc: 'Thieves who share a category deal 20% more damage while on the field together. Bonuses from multiple categories do not stack.'
    },
    enemyPrefix: 'Greedy ',
    personaFallbacks: { takeminakata: 'Take-Minakata', beelzebub: 'Beelzebub' }
  },
  jp: {
    effect: {
      name: '衆生の相',
      desc: '同じカテゴリーの怪盗が同時にフィールドにいると、該当する怪盗の与ダメージが20%上昇する。複数のカテゴリーによる効果は重複しない。'
    },
    enemyPrefix: '貪欲な',
    personaFallbacks: { takeminakata: 'タケミナカタ', beelzebub: 'ベルゼブブ' }
  }
};
const ENEMY_IMAGE_ALIASES = {
  matador: 'B-guaiwutouxiang-matador-i18n.png',
  suiki: 'B-guaiwutouxiang-suiki-i18n.png'
};

const LANG_CONFIGS = [
  { lang: 'kr', sourceRoot: 'KR_Config', baseDir: path.join(ROOT, '_config', 'Config_KR') },
  { lang: 'en', sourceRoot: 'EN_Config', baseDir: path.join(ROOT, '_config', 'Config_EN') },
  { lang: 'jp', sourceRoot: 'JP_Config', baseDir: path.join(ROOT, '_config', 'Config_JP') },
  { lang: 'cn', sourceRoot: 'Config_CN', baseDir: path.join(ROOT, '_config', 'Config_CN') }
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
    if (arg !== '--check' && arg !== '--expanded-stages') {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return {
    check: args.has('--check'),
    expandedStages: args.has('--expanded-stages')
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

  if (code === 15 && parts.length >= 3) {
    const categories = parts.slice(1, -1).map((id) => THIEF_TAG_IDS[Number(id)]);
    const multiplier = Number(parts.at(-1));
    if (categories.every(Boolean) && Number.isFinite(multiplier)) {
      return { type: 'category_score', categories, multiplier, raw };
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

function parseRuleOneMoreBonus(token) {
  const raw = String(token || '');
  const parts = raw.split(',');
  const code = Number(parts[0]);
  if (code === 5 && parts.length >= 2) {
    const score = Number(parts[1]);
    if (Number.isFinite(score)) {
      return {
        type: 'one_more_bonus',
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
  const hasOneMoreBonus = Number(String(parts[1] || '').split(',')[0]) === 5;
  if (hasOneMoreBonus) {
    return {
      rule1: parseRule1(parts[0] || ''),
      rule2: parseRuleOneMoreBonus(parts[1] || ''),
      rule3: parseRuleTurnLimit(parts[2] || ''),
      rule4: parseRuleDeathLimit(parts[3] || '')
    };
  }
  return {
    rule1: parseRule1(parts[0] || ''),
    rule2: parseRuleTurnLimit(parts[1] || ''),
    rule3: parseRuleDeathLimit(parts[2] || '')
  };
}

function buildMonsterImageName(model, enemyImageSet, indexedImages) {
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
  const alias = ENEMY_IMAGE_ALIASES[model];
  if (enemyImageSet.has(alias)) {
    return { image: alias, imageMissing: false };
  }
  const fallback = model === 'melkisedec' && resolveImagePath('멜키세덱.webp', indexedImages);
  if (fallback) return { image: fallback, imageMissing: false };
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

function createPhaseBuilder(baseDir, translation, ctx) {
  const read = (relativePath) => readJson(path.join(baseDir, relativePath));
  const confInst = read('battle/ConfInst.json');
  const confZhanDou = read('battle/ConfZhanDou.json');
  const confGuaiWu = read('text/ConfGuaiWu.json');
  const confGuaiWuAdapt = read('text/ConfGuaiWuAdapt.json');
  const resistPath = path.join(baseDir, 'default/ConfSkillNatureResist.json');
  const resistCodeToCategory = buildResistCodeMap(fs.existsSync(resistPath) ? readJson(resistPath) : []);
  const instBySn = new Map(confInst.map((row) => [Number(row.sn), row]));
  const monsterBySn = new Map(confGuaiWu.map((row) => [Number(row.sn), row]));
  const adaptBySn = new Map(confGuaiWuAdapt.map((row) => [Number(row.sn), row]));

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

  const { krMonsterBySn, enemyImageSet, indexedImages } = ctx;
  return (phase, instSn, battleSn = null) => {
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
      const imageInfo = buildMonsterImageName(monster?.model, enemyImageSet, indexedImages);
      return {
        position: Number(groupRow.position),
        sn: monsterSn,
        name: monsterName,
        level: parseIntSafe(monster?.lv),
        image: imageInfo.image,
        imageMissing: imageInfo.imageMissing,
        isBoss: Number(monster?.isBoss || 0),
        adapt: buildAdaptObject(adaptBySn.get(Number(monster?.adaptSN)), resistCodeToCategory)
      };
    });
    return { phase, battleSn, instSn, monsterGroup, monsters };
  };
}

function buildLanguageData({ lang, sourceRoot, baseDir }, ctx, includeChapter = () => true) {
  const read = (relativePath) => readJson(path.join(baseDir, relativePath));
  const confTrial = read('default/ConfVelvetTrial.json');
  const confLevel = read('default/ConfVelvetTrialLevel.json');
  const confBattle = read('default/ConfVelvetTrialBattle.json');
  const confSkillAffix = read('default/ConfSkillAffix.json');
  const translation = loadTranslationTables(baseDir, lang);
  const buildPhase = createPhaseBuilder(baseDir, translation, ctx);
  const levelBySn = new Map(confLevel.map((row) => [Number(row.sn), row]));
  const battleBySn = new Map(confBattle.map((row) => [Number(row.sn), row]));
  const affixBySn = new Map(confSkillAffix.map((row) => [Number(row.sn), row]));
  const { krChapterBySn, krAffixBySn, indexedImages } = ctx;

  const chapters = confTrial
    .filter(includeChapter)
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
          return buildPhase(phaseIndex + 1, Number(battleRow.instSN), battleSn);
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

function buildTagChapter({ lang, baseDir }, ctx, sourceChapter) {
  const name = TAG_CHAPTER.nameByLang[lang];
  if (sourceChapter) {
    return {
      ...sourceChapter,
      sn: TAG_CHAPTER.sn,
      name,
      tagRosterVersion: TAG_CHAPTER.recommendationVersion,
      levels: sourceChapter.levels.filter((level) => level.levelNum <= TAG_CHAPTER.levelCount)
    };
  }

  // The partial KR/CN exports contain both battles for each stage.
  const buildPhase = createPhaseBuilder(baseDir, loadTranslationTables(baseDir, lang), ctx);
  const effect = readJson(path.join(baseDir, 'default/ConfSkillAffix.json'))
    .find((row) => Number(row.sn) === TAG_CHAPTER.effectSn);
  if (!effect) throw new Error('Missing tag chapter effect for ' + lang);

  const chapterImg = TAG_CHAPTER.image;
  const chapterImgPath = resolveImagePath(chapterImg, ctx.indexedImages);
  const levels = Array.from({ length: TAG_CHAPTER.levelCount }, (_, index) => {
    const phases = TAG_CHAPTER.battleStarts.map((start, phaseIndex) => buildPhase(phaseIndex + 1, start + index));
    if (phases.some((phase) => !phase?.monsters.length)) {
      throw new Error('Missing tag chapter battle for ' + lang + ' stage ' + (index + 1));
    }
    return { sn: phases[0].instSn, levelNum: index + 1, phaseCount: phases.length, phases };
  });

  return {
    sn: TAG_CHAPTER.sn,
    name,
    tagRosterVersion: TAG_CHAPTER.recommendationVersion,
    effect: { sn: TAG_CHAPTER.effectSn, name: effect.name, desc: effect.desc },
    images: { chapterImg, chapterImgPath, resolvedPath: chapterImgPath, missing: !chapterImgPath },
    levels
  };
}

function localizeTagChapter(chapter, { lang, baseDir }, krMonsterBySn) {
  const { effect, enemyPrefix, personaFallbacks } = GLOBAL_TAG_TEXT[lang];
  const folder = 'conftranslation' + lang;
  const suffix = lang.toUpperCase();
  const translations = readJson(path.join(baseDir, folder, 'ConfPersona_' + suffix + '.json'));
  const personaNameBySn = new Map(translations.map((row) => [Number(row.sn), row.name]));
  const personas = readJson(path.join(baseDir, 'develop/ConfPersona.json'));
  const nameByModel = new Map(Object.entries(personaFallbacks));
  for (const persona of personas) {
    const name = pickLocalizedName(personaNameBySn.get(Number(persona.sn)));
    if (name && !nameByModel.has(persona.model)) nameByModel.set(persona.model, name);
  }
  const { monsterNameBySn } = loadTranslationTables(baseDir, lang);
  const levels = chapter.levels.map((level) => ({
    ...level,
    phases: level.phases.map((phase) => ({
      ...phase,
      monsters: phase.monsters.map((monster) => {
        const model = krMonsterBySn.get(monster.sn)?.model;
        const personaName = nameByModel.get(model);
        const name = pickLocalizedName(monsterNameBySn.get(monster.sn), personaName && enemyPrefix + personaName);
        if (!name) throw new Error('Missing ' + lang + ' name for tag chapter enemy ' + monster.sn);
        return { ...monster, name };
      })
    }))
  }));
  return {
    ...chapter,
    name: TAG_CHAPTER.nameByLang[lang],
    provisionalNames: true,
    effect: { sn: TAG_CHAPTER.effectSn, ...effect },
    levels
  };
}

function findTagChapter(data) {
  return data.chapters.find((chapter) => chapter.effect?.sn === TAG_CHAPTER.effectSn && chapter.levels.length);
}

function copyTagStageRules(chapter, sourceChapter) {
  if (!sourceChapter) return;
  const byNumber = new Map(sourceChapter.levels.map((level) => [level.levelNum, level]));
  for (const level of chapter.levels) {
    const source = byNumber.get(level.levelNum);
    if (level.starScores?.length || !source?.starScores?.length) continue;
    if (source.phases.length !== level.phases.length
      || source.phases.some((phase, index) => phase.instSn !== level.phases[index].instSn)) {
      throw new Error('Tag chapter battles differ for stage ' + level.levelNum);
    }
    level.sn = source.sn;
    level.starScores = source.starScores;
    level.conditions = source.conditions;
  }
}

function buildExpectedOutput({ expandedStages }) {
  const indexedImages = indexImageFiles();
  const enemyImageDir = path.join(ROOT, 'assets', 'img', 'enemy');
  const enemyImageSet = fs.existsSync(enemyImageDir)
    ? new Set(fs.readdirSync(enemyImageDir))
    : new Set();

  const krChapterPath = path.join(ROOT, '_config', 'Config_KR', 'default', 'ConfVelvetTrial.json');
  const krChapterRows = expandedStages && !fs.existsSync(krChapterPath) ? [] : readJson(krChapterPath);
  const krMonsterRows = readJson(path.join(ROOT, '_config', 'Config_KR', 'text', 'ConfGuaiWu.json'));
  const krAffixRows = readJson(path.join(ROOT, '_config', 'Config_KR', 'default', 'ConfSkillAffix.json'));

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
  for (const langConfig of expandedStages ? [] : LANG_CONFIGS) {
    const sourceRoot = langConfig.sourceRoot;
    const baseDir = langConfig.baseDir;
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
  const krConfig = LANG_CONFIGS.find((config) => config.lang === 'kr');
  let krTagChapter;

  for (const langConfig of LANG_CONFIGS) {
    const dataPath = path.join(TRIAL_DATA_DIR, langConfig.lang + '.json');
    const isGlobal = Object.hasOwn(GLOBAL_TAG_TEXT, langConfig.lang);
    let data;

    if (expandedStages) {
      data = readJson(dataPath);
      if (isGlobal) {
        const elemental = buildLanguageData(langConfig, ctx, (row) => Number(row.sn) >= 2 && Number(row.sn) <= 5);
        const updates = new Map(elemental.chapters.map((chapter) => [chapter.sn, chapter]));
        data.chapters = data.chapters.map((chapter) => {
          const updated = updates.get(chapter.sn);
          if (!updated) return chapter;
          const published = chapter.levels.filter((level) => level.levelNum <= 25);
          const added = updated.levels.filter((level) => level.levelNum > 25 && level.levelNum <= 30);
          if (added.length !== 5 || added.some((level) => !level.phases.length)) {
            throw new Error('Missing stages 26 through 30 for ' + langConfig.lang + ' chapter ' + chapter.sn);
          }
          return { ...chapter, levels: [...published, ...added] };
        });
      }
    } else {
      data = buildLanguageData(langConfig, ctx);
    }

    let sourceChapter = findTagChapter(data);
    if (expandedStages && sourceInputFiles.slice(0, 3).every((file) => fs.existsSync(path.join(langConfig.baseDir, file)))) {
      const native = buildLanguageData(langConfig, ctx, (row) => Number(row.skillAffix) === TAG_CHAPTER.effectSn);
      sourceChapter = findTagChapter(native) || sourceChapter;
    }
    const hasNativeLevels = sourceChapter?.levels.some((level) => level.starScores?.length);
    const isOfficialGlobal = isGlobal && hasNativeLevels && !sourceChapter.tagRosterVersion;
    const chapter = isGlobal && !isOfficialGlobal
      ? localizeTagChapter(krTagChapter || buildTagChapter(krConfig, ctx), langConfig, ctx.krMonsterBySn)
      : buildTagChapter(langConfig, ctx, hasNativeLevels ? sourceChapter : null);
    if (isOfficialGlobal) chapter.name = sourceChapter.name || chapter.name;
    if (langConfig.lang === 'kr') {
      krTagChapter = chapter;
    } else if (langConfig.lang === 'cn') {
      copyTagStageRules(chapter, krTagChapter);
    }
    data.chapters = data.chapters.filter((entry) => entry.effect?.sn !== TAG_CHAPTER.effectSn);
    data.chapters.push(chapter);

    const content = `${normalizeNewline(JSON.stringify(data, null, 2))}\n`.replace(/\n/g, '\r\n');
    expected.set(dataPath, content);
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
    if (actual !== normalizeNewline(expectedContent)) {
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
  const expected = buildExpectedOutput(mode);

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
