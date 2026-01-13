#!/usr/bin/env node

/**
 * 협력자(Synergy) 데이터를 외부 API에서 가져와
 * `apps/synergy/friends/<lang>/<캐릭터이름>.json` 으로 저장하는 스크립트입니다.
 *
 * 기본 동작:
 *   node scripts/fetch-synergy.mjs
 *     - 모든 언어 (kr, en, jp)
 *     - 모든 캐릭터 (1 ~ 32)
 *
 * 옵션:
 *   node scripts/fetch-synergy.mjs [lang] [startNum] [endNum]
 *     - lang    : kr | en | jp | all (기본값: all)
 *     - startNum: 시작 번호 (기본값: 1)
 *     - endNum  : 끝 번호 (기본값: 32, 포함 범위)
 *
 * API 예시:
 *   https://iant.kr:5000/data/coop/kr/1?source=mydiscord
 *
 * 응답이
 *   {"data": null, "msg": "Character not found.", "status": 100}
 * 인 경우에는 저장하지 않습니다.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

const BASE_URL = process.env.BASE_URL || 'https://iant.kr:5000/data';
const FRIEND_NUM_FILE = path.join(PROJECT_ROOT, 'apps', 'synergy', 'friends', 'friend_num.json');
const SYNERGY_DIR = path.join(PROJECT_ROOT, 'apps', 'synergy', 'friends');

const LANGUAGES = ['kr', 'en', 'jp'];

function log(msg) {
  console.log(msg);
}

function usage() {
  console.log(
`Usage:
  node scripts/fetch-synergy.mjs [lang] [startNum] [endNum]

예시:
  # 기본값 (모든 언어, 1~32)
  node scripts/fetch-synergy.mjs

  # kr만, 1~32
  node scripts/fetch-synergy.mjs kr

  # kr만, 1~10
  node scripts/fetch-synergy.mjs kr 1 10

  # 모든 언어, 1~10
  node scripts/fetch-synergy.mjs all 1 10
`
  );
  process.exit(1);
}

function parseArgs() {
  const raw = process.argv.slice(2);
  const lang = raw[0] || 'all';
  const startNum = raw[1] ? Number(raw[1]) : 1;
  const endNum = raw[2] ? Number(raw[2]) : 32;

  if (lang !== 'all' && !LANGUAGES.includes(lang)) {
    console.error(`Invalid language '${lang}'. Must be one of: ${LANGUAGES.join(', ')}, all`);
    usage();
  }
  if (!Number.isInteger(startNum) || !Number.isInteger(endNum) || startNum <= 0 || endNum < startNum) {
    console.error(`Invalid number range: start=${startNum}, end=${endNum}`);
    usage();
  }

  return { lang, startNum, endNum };
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const { statusCode } = res;
        if (statusCode && statusCode >= 400) {
          reject(new Error(`Request failed. Status: ${statusCode} URL=${url}`));
          res.resume();
          return;
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(new Error(`Invalid JSON from ${url}: ${e.message}`));
          }
        });
      })
      .on('error', (e) => reject(e));
  });
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readJsonIfExists(p) {
  try {
    if (!fs.existsSync(p)) return null;
    const txt = fs.readFileSync(p, 'utf8');
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

function loadFriendNumMapping() {
  if (!fs.existsSync(FRIEND_NUM_FILE)) {
    throw new Error(`friend_num.json not found: ${FRIEND_NUM_FILE}`);
  }
  const friendNum = readJsonIfExists(FRIEND_NUM_FILE);
  if (!friendNum || typeof friendNum !== 'object') {
    throw new Error(`Invalid friend_num.json format`);
  }

  // num -> 캐릭터 이름 매핑 생성
  const numToName = {};
  Object.keys(friendNum).forEach(name => {
    const num = friendNum[name].num;
    if (num > 0) {
      numToName[num] = name;
    }
  });

  return numToName;
}

async function fetchSynergyOnce({ lang, num }) {
  const query = 'source=mydiscord';
  const url = `${BASE_URL}/coop/${lang}/${num}?${query}`;
  log(`➡️  Fetching: ${url}`);

  try {
    const json = await fetchJson(url);

    // Character not found 케이스 스킵
    if (!json || (json.status === 100 && json.data == null)) {
      log(`   Skip (not found): lang=${lang}, num=${num}`);
      return null;
    }

    return json;
  } catch (e) {
    log(`   ❌ Error: lang=${lang}, num=${num} - ${e.message}`);
    return null;
  }
}

async function run() {
  const { lang, startNum, endNum } = parseArgs();

  // friend_num.json에서 매핑 로드
  log(`➡️  Loading character mapping from: ${FRIEND_NUM_FILE}`);
  const numToName = loadFriendNumMapping();
  log(`   Found ${Object.keys(numToName).length} character mappings`);

  const targetLangs = lang === 'all' ? LANGUAGES : [lang];
  let totalSaved = 0;
  let totalNotFound = 0;
  let totalError = 0;

  for (const targetLang of targetLangs) {
    const langDir = path.join(SYNERGY_DIR, targetLang);
    ensureDir(langDir);

    log(`\n📁 Processing language: ${targetLang}`);

    for (let num = startNum; num <= endNum; num += 1) {
      const characterName = numToName[num];
      if (!characterName) {
        log(`   ⚠️  No character mapping for num=${num}, skipping...`);
        continue;
      }

      try {
        // eslint-disable-next-line no-await-in-loop
        const json = await fetchSynergyOnce({ lang: targetLang, num });
        if (!json) {
          totalNotFound += 1;
          continue;
        }

        const outPath = path.join(langDir, `${characterName}.json`);
        fs.writeFileSync(outPath, JSON.stringify(json, null, 2), 'utf8');
        log(`   ✅ Saved: ${targetLang}/${characterName}.json`);
        totalSaved += 1;

        // API 부하 방지를 위한 딜레이 (1초)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.error(`   ❌ Failed (lang=${targetLang}, num=${num}):`, e?.message || e);
        totalError += 1;
      }
    }
  }

  log(`\n✅ Done. Saved ${totalSaved} files. Not found: ${totalNotFound}. Errors: ${totalError}.`);
}

run().catch((e) => {
  console.error('❌ fetch-synergy failed:', e?.message || e);
  process.exit(1);
});

