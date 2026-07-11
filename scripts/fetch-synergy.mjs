#!/usr/bin/env node

/**
 * Fetch synergy (coop/cybercoop) data from iant API and write files to:
 *   apps/synergy/friends/<lang>/<characterName>.json
 *
 * Default behavior:
 *   node scripts/fetch-synergy.mjs
 *   - languages: kr,en,jp,cn
 *   - range: start at 1
 *   - auto mode scans at least 1..33, then increases numbers and stops on KR not-found
 *
 * Manual range:
 *   node scripts/fetch-synergy.mjs [dataset] [lang] [startNum] [endNum]
 *   - dataset: synergy | cybercoop (default: synergy)
 *   - lang: kr | en | jp | cn | all (default: all)
 *   - startNum: default 1
 *   - endNum: optional; if omitted, auto-stop mode is used
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

const BASE_URL = process.env.BASE_URL || 'https://iant.kr:5000/data';
const SOURCE = process.env.SYNERGY_SOURCE || 'mydiscord';

const FRIEND_NUM_FILE = path.join(PROJECT_ROOT, 'apps', 'synergy', 'friends', 'friend_num.json');
const CYBER_FRIEND_NUM_FILE = path.join(PROJECT_ROOT, 'apps', 'synergy', 'friends', 'cyber_freind_num.json');
const SYNERGY_DIR = path.join(PROJECT_ROOT, 'apps', 'synergy', 'friends');

const LANGUAGES = ['kr', 'en', 'jp', 'cn'];
const AUTO_MIN_SCAN_END = 33;
const REQUEST_TIMEOUT_MS = 15000;
const REQUEST_RETRIES = 1;
const REQUEST_DELAY_MS = 600;
const LOCAL_ONLY_DATA_KEYS = ['unlock_notes'];
const ALLOW_STRUCTURAL_SHRINK = process.env.SYNERGY_ALLOW_STRUCTURAL_SHRINK === '1';
const KNOWN_BAD_PAYLOAD_STRINGS = [
  "'NoneType' object is not subscriptable",
  'NoneType object is not subscriptable'
];
const DATASET_CONFIGS = {
  synergy: {
    label: 'synergy',
    endpoint: 'coop',
    mappingFile: FRIEND_NUM_FILE,
    outputDir: SYNERGY_DIR,
    source: SOURCE,
    autoMinScanEnd: AUTO_MIN_SCAN_END
  },
  cybercoop: {
    label: 'cybercoop',
    endpoint: 'cybercoop',
    mappingFile: CYBER_FRIEND_NUM_FILE,
    outputDir: SYNERGY_DIR,
    source: process.env.CYBERCOOP_SOURCE || SOURCE,
    autoMinScanEnd: 1
  }
};

function log(message) {
  console.log(message);
}

function usage() {
  console.log(
    `Usage:
  node scripts/fetch-synergy.mjs [dataset] [lang] [startNum] [endNum]

Examples:
  # default (kr,en,jp,cn, start=1, auto-stop)
  node scripts/fetch-synergy.mjs

  # cybercoop default (kr,en,jp,cn, start=1, auto-stop)
  node scripts/fetch-synergy.mjs cybercoop

  # kr only, start=1, auto-stop
  node scripts/fetch-synergy.mjs kr

  # cybercoop cn only, range 1..1
  node scripts/fetch-synergy.mjs cybercoop cn 1 1

  # kr only, range 1..33
  node scripts/fetch-synergy.mjs kr 1 33

  # all languages, range 1..40
  node scripts/fetch-synergy.mjs all 1 40
`
  );
  process.exit(1);
}

function parseArgs() {
  const raw = process.argv.slice(2);
  const datasetFromEnv = process.env.SYNERGY_DATASET || 'synergy';
  let dataset = datasetFromEnv;
  let offset = 0;

  if (raw[0] && DATASET_CONFIGS[raw[0]]) {
    dataset = raw[0];
    offset = 1;
  }

  if (!DATASET_CONFIGS[dataset]) {
    console.error(`Invalid dataset '${dataset}'. Must be one of: ${Object.keys(DATASET_CONFIGS).join(', ')}`);
    usage();
  }

  const lang = raw[offset] || 'all';
  const startNum = raw[offset + 1] ? Number(raw[offset + 1]) : 1;
  const endNum = raw[offset + 2] ? Number(raw[offset + 2]) : null;

  if (lang !== 'all' && !LANGUAGES.includes(lang)) {
    console.error(`Invalid language '${lang}'. Must be one of: ${LANGUAGES.join(', ')}, all`);
    usage();
  }

  if (!Number.isInteger(startNum) || startNum <= 0) {
    console.error(`Invalid startNum: ${raw[1]}`);
    usage();
  }

  if (endNum != null && (!Number.isInteger(endNum) || endNum < startNum)) {
    console.error(`Invalid endNum: ${raw[2]}`);
    usage();
  }

  const targetLangs = lang === 'all' ? LANGUAGES : [lang];
  return { config: DATASET_CONFIGS[dataset], targetLangs, startNum, endNum };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function loadFriendNumMapping(config) {
  if (!fs.existsSync(config.mappingFile)) {
    throw new Error(`mapping file not found: ${config.mappingFile}`);
  }

  const mapping = readJsonIfExists(config.mappingFile);
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
    throw new Error(`Invalid mapping file format: ${config.mappingFile}`);
  }

  const numToName = {};
  let maxMappedNum = 0;

  for (const [characterName, value] of Object.entries(mapping)) {
    const num = value?.num;
    if (!Number.isInteger(num) || num <= 0) continue;

    if (numToName[num] && numToName[num] !== characterName) {
      log(`Warning: duplicate num=${num} in ${path.basename(config.mappingFile)} (${numToName[num]}, ${characterName}).`);
      continue;
    }

    numToName[num] = characterName;
    if (num > maxMappedNum) maxMappedNum = num;
  }

  return { numToName, maxMappedNum };
}

function cleanJsonString(str) {
  if (!str) return str;
  // 1. : [ , 뒤에 공백이 있을 수 있고, 그 뒤에 0으로 시작해서 0이 아닌 숫자가 오는 경우 0을 제거
  // 예: "id": 0123 -> "id": 123
  // 예: [ 01, 02 ] -> [ 1, 2 ]
  return str.replace(/([:\[,]\s*)0+([1-9])/g, '$1$2');
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      const { statusCode } = res;

      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const cleanBody = cleanJsonString(body);
          resolve(JSON.parse(cleanBody));
        } catch (error) {
          if (statusCode && statusCode >= 400) {
            reject(new Error(`Request failed. Status: ${statusCode} URL=${url}`));
            return;
          }
          reject(new Error(`Invalid JSON from ${url}: ${error.message}`));
        }
      });
    });

    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy(new Error(`Timeout after ${REQUEST_TIMEOUT_MS}ms`));
    });
    req.on('error', (error) => reject(error));
  });
}

function isNotFoundPayload(json) {
  return Boolean(json && typeof json === 'object' && json.status === 100 && json.data == null);
}

function isUsablePayload(json) {
  return Boolean(json && typeof json === 'object' && !isNotFoundPayload(json));
}

async function fetchSynergyOnce({ config, lang, num }) {
  const url = `${BASE_URL}/${config.endpoint}/${lang}/${num}?source=${encodeURIComponent(config.source)}`;
  let lastError = null;

  for (let attempt = 1; attempt <= REQUEST_RETRIES + 1; attempt += 1) {
    try {
      const json = await fetchJson(url);
      if (isNotFoundPayload(json)) {
        return { state: 'not_found', json: null, url };
      }
      if (!isUsablePayload(json)) {
        return { state: 'invalid', json: null, url, error: new Error('Unexpected payload shape') };
      }
      return { state: 'ok', json, url };
    } catch (error) {
      lastError = error;
      if (attempt <= REQUEST_RETRIES) {
        log(`Retry ${attempt}/${REQUEST_RETRIES}: lang=${lang}, num=${num} (${error.message})`);
        await sleep(400 * attempt);
      }
    } finally {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  return { state: 'error', json: null, url, error: lastError };
}

function computeTextVolume(value) {
  if (typeof value === 'string') return value.trim().length;
  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + computeTextVolume(item), 0);
  }
  if (value && typeof value === 'object') {
    return Object.values(value).reduce((sum, item) => sum + computeTextVolume(item), 0);
  }
  return 0;
}

function findKnownBadPayloadString(value) {
  if (typeof value === 'string') {
    return KNOWN_BAD_PAYLOAD_STRINGS.find((badText) => value.includes(badText)) || null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const badText = findKnownBadPayloadString(item);
      if (badText) return badText;
    }
    return null;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      const badText = findKnownBadPayloadString(item);
      if (badText) return badText;
    }
  }

  return null;
}

function computeShapeStats(value) {
  const stats = {
    arrays: 0,
    objects: 0,
    keys: 0
  };

  function visit(item) {
    if (Array.isArray(item)) {
      stats.arrays += 1;
      for (const child of item) visit(child);
      return;
    }

    if (item && typeof item === 'object') {
      stats.objects += 1;
      const values = Object.values(item);
      stats.keys += values.length;
      for (const child of values) visit(child);
    }
  }

  visit(value);
  return stats;
}

function findStructuralShrink(previousStats, nextStats) {
  for (const key of ['objects', 'arrays', 'keys']) {
    if (nextStats[key] < previousStats[key]) {
      return `${key} ${previousStats[key]} -> ${nextStats[key]}`;
    }
  }

  return null;
}

function omitLocalOnlyDataKeys(json) {
  if (!json || typeof json !== 'object') return json;

  const clone = JSON.parse(JSON.stringify(json));
  const data = clone && typeof clone === 'object' && clone.data && typeof clone.data === 'object'
    ? clone.data
    : clone;

  if (data && typeof data === 'object') {
    for (const key of LOCAL_ONLY_DATA_KEYS) {
      delete data[key];
    }
  }

  return clone;
}

function mergeLocalOnlyData(previousJson, nextJson) {
  if (!previousJson || !nextJson || typeof previousJson !== 'object' || typeof nextJson !== 'object') {
    return nextJson;
  }

  const merged = JSON.parse(JSON.stringify(nextJson));
  const previousData = previousJson.data && typeof previousJson.data === 'object' ? previousJson.data : previousJson;
  const nextData = merged.data && typeof merged.data === 'object' ? merged.data : merged;

  if (!previousData || typeof previousData !== 'object' || !nextData || typeof nextData !== 'object') {
    return merged;
  }

  for (const key of LOCAL_ONLY_DATA_KEYS) {
    if (Object.prototype.hasOwnProperty.call(previousData, key) && !Object.prototype.hasOwnProperty.call(nextData, key)) {
      nextData[key] = JSON.parse(JSON.stringify(previousData[key]));
    }
  }

  return merged;
}

function writeJson(filePath, json) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
}

function saveIfTextIncreased(filePath, nextJson) {
  const nextComparableJson = omitLocalOnlyDataKeys(nextJson);
  const badPayloadString = findKnownBadPayloadString(nextComparableJson);
  if (badPayloadString) {
    return { saved: false, reason: 'invalid_new_payload', badPayloadString };
  }

  const nextTextVolume = computeTextVolume(nextComparableJson);
  if (nextTextVolume <= 0) {
    return { saved: false, reason: 'empty_new', previousTextVolume: 0, nextTextVolume };
  }

  if (!fs.existsSync(filePath)) {
    writeJson(filePath, nextJson);
    return { saved: true, mode: 'created', previousTextVolume: 0, nextTextVolume };
  }

  const previousJson = readJsonIfExists(filePath);
  if (!previousJson) {
    return { saved: false, reason: 'invalid_existing', previousTextVolume: 0, nextTextVolume };
  }

  const previousComparableJson = omitLocalOnlyDataKeys(previousJson);
  const previousTextVolume = computeTextVolume(previousComparableJson);
  const previousShapeStats = computeShapeStats(previousComparableJson);
  const nextShapeStats = computeShapeStats(nextComparableJson);
  const structuralShrink = findStructuralShrink(previousShapeStats, nextShapeStats);
  if (structuralShrink && !ALLOW_STRUCTURAL_SHRINK) {
    return {
      saved: false,
      reason: 'structural_shrink',
      structuralShrink,
      previousTextVolume,
      nextTextVolume
    };
  }

  if (nextTextVolume > previousTextVolume) {
    const mergedJson = mergeLocalOnlyData(previousJson, nextJson);
    writeJson(filePath, mergedJson);
    return { saved: true, mode: 'updated', previousTextVolume, nextTextVolume };
  }

  return { saved: false, reason: 'not_longer', previousTextVolume, nextTextVolume };
}

async function run() {
  const { config, targetLangs, startNum, endNum } = parseArgs();
  const { numToName, maxMappedNum } = loadFriendNumMapping(config);
  const manualRange = Number.isInteger(endNum);
  const autoGuaranteedEnd = Math.max(config.autoMinScanEnd, maxMappedNum);

  log(`Start fetch-synergy (${config.label})`);
  log(`- endpoint : ${config.endpoint}`);
  log(`- mapping  : ${path.relative(PROJECT_ROOT, config.mappingFile)}`);
  log(`- output   : ${path.relative(PROJECT_ROOT, config.outputDir)}`);
  log(`- languages: ${targetLangs.join(', ')}`);
  log(`- startNum : ${startNum}`);
  log(
    `- endNum   : ${manualRange
      ? endNum
      : `auto (scan <=${autoGuaranteedEnd}, then KR stop probe from ${autoGuaranteedEnd + 1})`}`
  );

  const totals = {
    created: 0,
    updated: 0,
    skippedNotFound: 0,
    skippedEmpty: 0,
    skippedNotLonger: 0,
    skippedNoMapping: 0,
    skippedInvalidExisting: 0,
    skippedInvalidPayload: 0,
    skippedStructuralShrink: 0,
    errors: 0
  };

  let num = startNum;
  while (true) {
    if (manualRange && num > endNum) break;

    const characterName = numToName[num] || null;
    const shouldAutoStopProbe = !manualRange && num > autoGuaranteedEnd;
    const shouldGapProbeInGuaranteedRange = !manualRange && !characterName && num <= AUTO_MIN_SCAN_END;
    let krProbe = null;

    if (shouldAutoStopProbe || shouldGapProbeInGuaranteedRange) {
      // In auto mode:
      // 1) Always scan up to AUTO_MIN_SCAN_END (33) even if there are gaps.
      // 2) After guaranteed range, probe KR and stop on first not-found.
      // eslint-disable-next-line no-await-in-loop
      krProbe = await fetchSynergyOnce({ config, lang: 'kr', num });

      if (shouldAutoStopProbe) {
        if (krProbe.state === 'not_found') {
          log(`Auto-stop: KR not found at num=${num}`);
          break;
        }
        if (krProbe.state !== 'ok') {
          log(`Auto-stop: KR probe failed at num=${num} (${krProbe.error?.message || krProbe.state})`);
          totals.errors += 1;
          break;
        }
      } else if (krProbe.state !== 'ok' && krProbe.state !== 'not_found') {
        log(`KR gap probe failed: num=${num} (${krProbe.error?.message || krProbe.state})`);
        totals.errors += 1;
      }
    }

    if (!characterName) {
      if (krProbe?.state === 'ok') {
        log(`No mapping for num=${num} (KR exists), skipping save.`);
      } else {
        log(`No mapping for num=${num}, skipping.`);
      }
      totals.skippedNoMapping += 1;
      num += 1;
      continue;
    }

    for (const lang of targetLangs) {
      // Reuse KR probe result if we already fetched it.
      // eslint-disable-next-line no-await-in-loop
      const result = lang === 'kr' && krProbe?.state === 'ok'
        ? krProbe
        : await fetchSynergyOnce({ config, lang, num });

      if (result.state === 'not_found') {
        log(`Skip not found: lang=${lang}, num=${num}`);
        totals.skippedNotFound += 1;
        continue;
      }
      if (result.state !== 'ok') {
        log(`Fetch failed: lang=${lang}, num=${num} (${result.error?.message || result.state})`);
        totals.errors += 1;
        continue;
      }

      const outPath = path.join(config.outputDir, lang, `${characterName}.json`);
      const saveResult = saveIfTextIncreased(outPath, result.json);

      if (saveResult.saved) {
        if (saveResult.mode === 'created') totals.created += 1;
        if (saveResult.mode === 'updated') totals.updated += 1;
        log(
          `Saved (${saveResult.mode}): ${lang}/${characterName}.json `
          + `(text ${saveResult.previousTextVolume} -> ${saveResult.nextTextVolume})`
        );
        continue;
      }

      if (saveResult.reason === 'empty_new') {
        totals.skippedEmpty += 1;
        log(`Skip empty payload: ${lang}/${characterName}.json`);
        continue;
      }
      if (saveResult.reason === 'invalid_existing') {
        totals.skippedInvalidExisting += 1;
        log(`Skip invalid existing file: ${lang}/${characterName}.json`);
        continue;
      }
      if (saveResult.reason === 'invalid_new_payload') {
        totals.skippedInvalidPayload += 1;
        log(`Skip invalid payload: ${lang}/${characterName}.json (${saveResult.badPayloadString})`);
        continue;
      }
      if (saveResult.reason === 'structural_shrink') {
        totals.skippedStructuralShrink += 1;
        log(
          `Skip structural shrink: ${lang}/${characterName}.json `
          + `(${saveResult.structuralShrink}, text ${saveResult.previousTextVolume} -> ${saveResult.nextTextVolume})`
        );
        continue;
      }

      totals.skippedNotLonger += 1;
      log(
        `Skip not longer: ${lang}/${characterName}.json `
        + `(text ${saveResult.previousTextVolume} -> ${saveResult.nextTextVolume})`
      );
    }

    num += 1;
  }

  log('\nDone.');
  log(`- created               : ${totals.created}`);
  log(`- updated               : ${totals.updated}`);
  log(`- skipped not found     : ${totals.skippedNotFound}`);
  log(`- skipped empty         : ${totals.skippedEmpty}`);
  log(`- skipped not longer    : ${totals.skippedNotLonger}`);
  log(`- skipped no mapping    : ${totals.skippedNoMapping}`);
  log(`- skipped invalid old   : ${totals.skippedInvalidExisting}`);
  log(`- skipped invalid new   : ${totals.skippedInvalidPayload}`);
  log(`- skipped shape shrink  : ${totals.skippedStructuralShrink}`);
  log(`- errors                : ${totals.errors}`);
}

run().catch((error) => {
  console.error(`fetch-synergy failed: ${error?.message || error}`);
  process.exit(1);
});
