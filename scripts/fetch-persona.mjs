#!/usr/bin/env node

/**
 * Persona 상세 정보를 외부 API에서 가져와
 * `data/external/persona/<region>/<id>.json` 으로 저장하고,
 * 동일 폴더의 `mapping.json` 에 ID별 다국어 이름 매핑을 갱신하는 스크립트입니다.
 *
 * 기본 동작:
 *   node scripts/fetch-persona.mjs
 *     - regions: kr,en,jp,cn
 *     - id: 101 ~ 300
 *
 * 옵션:
 *   node scripts/fetch-persona.mjs [regions] [startId] [endId]
 *     - regions: 콤마로 구분된 지역 코드 (예: kr,en,jp,cn) (기본값: kr,en,jp,cn)
 *     - startId: 시작 ID (기본값: 101)
 *     - endId  : 끝 ID (기본값: 300, 포함 범위)
 *
 * API 예시:
 *   https://iant.kr:5000/data/persona/kr/101?source=lufelnet
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

const ROOT_DIR = path.join(PROJECT_ROOT, 'data', 'external');
const BASE_URL = process.env.BASE_URL || 'https://iant.kr:5000/data';

const ALLOWED_REGIONS = ['kr', 'en', 'cn', 'tw', 'jp', 'sea'];

function log(msg) {
  console.log(msg);
}

/**
 * JSON 문자열 정화 함수
 * Python의 `re.sub(r"([:\[,]\s*)0+([1-9])", r"\1\2", s)` 로직을 JS로 구현
 * 숫자 앞의 불필요한 0을 제거하여 유효한 JSON으로 만듦
 */
function cleanJsonString(str) {
  if (!str) return str;
  // 1. : [ , 뒤에 공백이 있을 수 있고, 그 뒤에 0으로 시작해서 0이 아닌 숫자가 오는 경우 0을 제거
  // 예: "id": 0123 -> "id": 123
  // 예: [ 01, 02 ] -> [ 1, 2 ]
  return str.replace(/([:\[,]\s*)0+([1-9])/g, '$1$2');
}

function usage() {
  console.log(
    `Usage:
  node scripts/fetch-persona.mjs [regions] [startId] [endId] 

예시:
  # 기본값 (kr,en,jp,cn, 101~300)
  node scripts/fetch-persona.mjs

  # en만, 1~200
  node scripts/fetch-persona.mjs en 1 200

  # jp,kr 101~300
  node scripts/fetch-persona.mjs jp,kr 101 300 
`
  );
  process.exit(1);
}

function parseArgs() {
  const raw = process.argv.slice(2);
  let useDev = false;
  const pos = [];
  for (const token of raw) {
    if (token === '--dev') {
      useDev = true;
      continue;
    }
    pos.push(token);
  }
  const regionStr = pos[0] || 'kr,en,jp,cn';
  const startId = pos[1] ? Number(pos[1]) : 101;
  const endId = pos[2] ? Number(pos[2]) : 300;

  const regions = regionStr.split(',').map(r => r.trim()).filter(Boolean);

  for (const r of regions) {
    if (!ALLOWED_REGIONS.includes(r)) {
      console.error(`Invalid region '${r}'. Must be one of: ${ALLOWED_REGIONS.join(', ')}`);
      usage();
    }
  }

  if (!Number.isInteger(startId) || !Number.isInteger(endId) || startId <= 0 || endId < startId) {
    console.error(`Invalid ID range: start=${startId}, end=${endId}`);
    usage();
  }

  return { regions, startId, endId, useDev };
}

function buildQuery(useDev) {
  const params = ['source=lufelnet'];
  return params.join('&');
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
            // 정화 작업 수행
            const cleanData = cleanJsonString(data);
            const json = JSON.parse(cleanData);
            resolve(json);
          } catch (e) {
            // 원본 데이터가 너무 길 수 있으므로 에러 메시지에 전체 포함은 자제
            const snippet = data.slice(0, 100);
            reject(new Error(`Invalid JSON from ${url}: ${e.message} (Snippet: ${snippet}...)`));
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

function sortMappingById(mapping) {
  const out = {};
  const keys = Object.keys(mapping).sort((a, b) => Number(a) - Number(b));
  for (const k of keys) {
    out[k] = mapping[k];
  }
  return out;
}

// region 코드 -> mapping.json 필드명
function regionToNameKey(region) {
  switch (region) {
    case 'kr': return 'name_kr';
    case 'en': return 'name_en';
    case 'jp': return 'name_jp';
    case 'cn': return 'name_cn';
    case 'tw': return 'name_tw';
    case 'sea': return 'name_sea';
    default: return `name_${region}`;
  }
}

async function fetchPersonaOnce({ region, id, useDev }) {
  const query = buildQuery(useDev);
  const url = `${BASE_URL}/persona/${region}/${id}?${query}`;
  // log(`➡️  Fetching: ${url}`); // 너무 많아서 생략 가능하나 일단 유지

  const json = await fetchJson(url);

  // Character not found 케이스 스킵
  if (!json || (json.status === 100 && json.data == null)) {
    // log(`   Skip (not found): region=${region}, id=${id}`);
    return null;
  }

  return json;
}

async function run() {
  const { regions, startId, endId, useDev } = parseArgs();

  log(`Start fetching personas... Regions: [${regions.join(', ')}], ID: ${startId}~${endId}`);

  const mappingFile = path.join(ROOT_DIR, 'persona', 'mapping.json');
  // 기존 매핑 읽기
  let mapping = readJsonIfExists(mappingFile);
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
    mapping = {};
  }

  let totalSaved = 0;
  let totalNotFound = 0;
  let changedMapping = false;

  for (const region of regions) {
    log(`[${region.toUpperCase()}] Processing...`);
    const personaDir = path.join(ROOT_DIR, 'persona', region);
    ensureDir(personaDir);

    const nameKey = regionToNameKey(region);
    let savedCount = 0;
    let notFoundCount = 0;

    for (let id = startId; id <= endId; id += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const json = await fetchPersonaOnce({ region, id, useDev });
        if (!json) {
          notFoundCount += 1;
          continue;
        }

        const outPath = path.join(personaDir, `${id}.json`);

        // 변경 사항 확인 (선택 사항: 원본과 비교하여 변경 시에만 저장할 수도 있으나, 여기선 덮어쓰기)
        // 기존 파일이 있으면 읽어서 비교해볼 수 있음 (최적화)
        let isChanged = true;
        /*
        const oldData = readJsonIfExists(outPath);
        if (oldData && JSON.stringify(oldData) === JSON.stringify(json)) {
            isChanged = false;
        }
        */

        if (isChanged) {
          fs.writeFileSync(outPath, JSON.stringify(json, null, 2), 'utf8');
          // log(`   Saved: persona/${region}/${id}.json`);
          savedCount += 1;
        }

        // mapping.json 갱신
        const idStr = String(id);
        if (!mapping[idStr]) {
          mapping[idStr] = {
            name_kr: '',
            name_en: '',
            name_jp: '',
            name_cn: '',
            name_tw: '',
            name_sea: ''
          };
        }

        const oldName = mapping[idStr][nameKey];
        const newName = typeof json?.data?.name === 'string'
          ? json.data.name
          : (typeof json?.name === 'string' ? json.name : '');
        if (newName && oldName !== newName) {
          mapping[idStr][nameKey] = newName;
          changedMapping = true;
        }
      } catch (e) {
        console.error(`   ❌ Failed (${region}, id=${id}):`, e?.message || e);
      }
    }
    log(`   -> Saved: ${savedCount}, Not Found: ${notFoundCount}`);
    totalSaved += savedCount;
    totalNotFound += notFoundCount;
  }

  if (changedMapping) {
    // mapping.json 저장 (ID 순 정렬)
    const sorted = sortMappingById(mapping);
    ensureDir(path.dirname(mappingFile));
    fs.writeFileSync(mappingFile, JSON.stringify(sorted, null, 2), 'utf8');
    log(`Updated mapping.json`);
  } else {
    log(`No changes in mapping.json`);
  }

  log(`✅ Done. Total Saved: ${totalSaved}. Total Not Found: ${totalNotFound}.`);
}

run().catch((e) => {
  console.error('❌ fetch-persona failed:', e?.message || e);
  process.exit(1);
});


