#!/usr/bin/env node

/**
 * Fetch synergy (coop) data from iant API and write files to:
 *   apps/synergy/friends/<lang>/<characterName>.json
 *
 * Default behavior:
 *   node scripts/fetch-synergy.mjs
 *   - languages: kr,en,jp,cn
 *   - range: start at 1
 *   - auto mode scans at least 1..33, then increases numbers and stops on KR not-found
 *
 * Manual range:
 *   node scripts/fetch-synergy.mjs [lang] [startNum] [endNum]
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
const SYNERGY_DIR = path.join(PROJECT_ROOT, 'apps', 'synergy', 'friends');

const LANGUAGES = ['kr', 'en', 'jp', 'cn'];
const AUTO_MIN_SCAN_END = 33;
const REQUEST_TIMEOUT_MS = 15000;
const REQUEST_RETRIES = 1;
const REQUEST_DELAY_MS = 600;

function log(message) {
  console.log(message);
}

function usage() {
  console.log(
    `Usage:
  node scripts/fetch-synergy.mjs [lang] [startNum] [endNum]

Examples:
  # default (kr,en,jp,cn, start=1, auto-stop)
  node scripts/fetch-synergy.mjs

  # kr only, start=1, auto-stop
  node scripts/fetch-synergy.mjs kr

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
  const lang = raw[0] || 'all';
  const startNum = raw[1] ? Number(raw[1]) : 1;
  const endNum = raw[2] ? Number(raw[2]) : null;

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
  return { targetLangs, startNum, endNum };
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

function loadFriendNumMapping() {
  if (!fs.existsSync(FRIEND_NUM_FILE)) {
    throw new Error(`friend_num.json not found: ${FRIEND_NUM_FILE}`);
  }

  const mapping = readJsonIfExists(FRIEND_NUM_FILE);
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
    throw new Error('Invalid friend_num.json format');
  }

  const numToName = {};
  let maxMappedNum = 0;

  for (const [characterName, value] of Object.entries(mapping)) {
    const num = value?.num;
    if (!Number.isInteger(num) || num <= 0) continue;

    if (numToName[num] && numToName[num] !== characterName) {
      log(`Warning: duplicate num=${num} in friend_num.json (${numToName[num]}, ${characterName}).`);
      continue;
    }

    numToName[num] = characterName;
    if (num > maxMappedNum) maxMappedNum = num;
  }

  return { numToName, maxMappedNum };
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      const { statusCode } = res;
      if (statusCode && statusCode >= 400) {
        res.resume();
        reject(new Error(`Request failed. Status: ${statusCode} URL=${url}`));
        return;
      }

      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
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

async function fetchSynergyOnce({ lang, num }) {
  const url = `${BASE_URL}/coop/${lang}/${num}?source=${encodeURIComponent(SOURCE)}`;
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

function writeJson(filePath, json) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
}

function saveIfTextIncreased(filePath, nextJson) {
  const nextTextVolume = computeTextVolume(nextJson);
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

  const previousTextVolume = computeTextVolume(previousJson);
  if (nextTextVolume > previousTextVolume) {
    writeJson(filePath, nextJson);
    return { saved: true, mode: 'updated', previousTextVolume, nextTextVolume };
  }

  return { saved: false, reason: 'not_longer', previousTextVolume, nextTextVolume };
}

async function run() {
  const { targetLangs, startNum, endNum } = parseArgs();
  const { numToName, maxMappedNum } = loadFriendNumMapping();
  const manualRange = Number.isInteger(endNum);
  const autoGuaranteedEnd = Math.max(AUTO_MIN_SCAN_END, maxMappedNum);

  log(`Start fetch-synergy`);
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
      krProbe = await fetchSynergyOnce({ lang: 'kr', num });

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
        : await fetchSynergyOnce({ lang, num });

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

      const outPath = path.join(SYNERGY_DIR, lang, `${characterName}.json`);
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
  log(`- errors                : ${totals.errors}`);
}

run().catch((error) => {
  console.error(`fetch-synergy failed: ${error?.message || error}`);
  process.exit(1);
});
