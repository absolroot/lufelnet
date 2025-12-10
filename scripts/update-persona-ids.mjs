#!/usr/bin/env node

/**
 * mapping.json 기반으로 data/kr/wonder/persona.js 에 id 필드를 채워 넣는 스크립트
 *
 * - data/external/persona/mapping.json 의
 *   {
 *     "101": { "name_kr": "야노식", ... },
 *     ...
 *   }
 *   구조를 읽어서,
 * - data/kr/wonder/persona.js 의
 *   "야노식": { ... element: "총격", ... }
 *   블록 안에
 *   element 다음 줄에 id:"101", 을 추가한다.
 *
 * 이미 해당 블록 안에 id: 가 있으면 건드리지 않는다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

const MAPPING_PATH = path.join(PROJECT_ROOT, 'data', 'external', 'persona', 'mapping.json');
const PERSONA_JS_PATH = path.join(PROJECT_ROOT, 'data', 'kr', 'wonder', 'persona.js');

function log(msg) {
  console.log(msg);
}

function main() {
  if (!fs.existsSync(MAPPING_PATH)) {
    throw new Error(`mapping.json not found: ${MAPPING_PATH}`);
  }
  if (!fs.existsSync(PERSONA_JS_PATH)) {
    throw new Error(`persona.js not found: ${PERSONA_JS_PATH}`);
  }

  const mappingRaw = fs.readFileSync(MAPPING_PATH, 'utf8');
  /** @type {Record<string, {name_kr?: string}>} */
  let mapping;
  try {
    mapping = JSON.parse(mappingRaw);
  } catch (e) {
    throw new Error(`Failed to parse mapping.json: ${e.message}`);
  }

  let content = fs.readFileSync(PERSONA_JS_PATH, 'utf8');

  let updated = 0;
  let skippedNoMatch = 0;
  let skippedHasId = 0;

  for (const [id, entry] of Object.entries(mapping)) {
    const nameKr = entry && entry.name_kr;
    if (!nameKr) continue;

    const keyStr = `"${nameKr}": {`;
    const startIdx = content.indexOf(keyStr);
    if (startIdx === -1) {
      skippedNoMatch += 1;
      continue;
    }

    // 이 블록 안에 이미 id: 가 있으면 스킵
    const lookahead = content.indexOf('},', startIdx);
    const blockEnd = lookahead === -1 ? startIdx + 2000 : lookahead;
    const blockSlice = content.slice(startIdx, blockEnd);
    if (blockSlice.includes('id:')) {
      skippedHasId += 1;
      continue;
    }

    // 해당 블록 안에서 element: 있는 줄 찾기
    const elementIdx = content.indexOf('element:', startIdx);
    if (elementIdx === -1 || elementIdx > blockEnd) {
      // element 를 못 찾거나, 다음 블록 쪽이면 스킵
      skippedNoMatch += 1;
      continue;
    }

    const lineEnd = content.indexOf('\n', elementIdx);
    if (lineEnd === -1) {
      skippedNoMatch += 1;
      continue;
    }

    const insertLine = `        id:"${id}",`;
    const before = content.slice(0, lineEnd + 1);
    const after = content.slice(lineEnd + 1);
    content = `${before}${insertLine}\n${after}`;
    updated += 1;
  }

  fs.writeFileSync(PERSONA_JS_PATH, content, 'utf8');

  log(`✅ update-persona-ids.mjs completed.`);
  log(`   Updated id for ${updated} entries.`);
  log(`   Skipped (already had id): ${skippedHasId}`);
  log(`   Skipped (no match / no element): ${skippedNoMatch}`);
}

try {
  main();
} catch (e) {
  console.error('❌ update-persona-ids.mjs failed:', e?.message || e);
  process.exit(1);
}


