#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

function readJSON(filePath) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(txt);
  } catch (_) {
    return null;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  let lang = 'kr';
  let code = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--lang' && i + 1 < args.length) {
      lang = args[++i];
    } else if (args[i] === '--code' && i + 1 < args.length) {
      code = args[++i];
    }
  }

  return { lang, code };
}

function main() {
  const { lang, code } = parseArgs();
  const mappingPath = path.join('data', 'external', 'character', 'codename.json');
  const mapping = readJSON(mappingPath);
  if (!Array.isArray(mapping)) {
    console.error(`[synclv100] codename mapping not found or invalid: ${mappingPath}`);
    process.exit(1);
  }

  console.log(
    `[synclv100] start sync for lang='${lang}'` + (code ? `, code='${code}'` : '')
  );

  for (const m of mapping) {
    const local = m?.local || m?.api;
    if (!local) continue;

    // --code 가 지정되면 해당 코드네임만 싱크
    if (code && local !== code) continue;

    const extPath = path.join('data', 'external', 'character', lang, `${local}.json`);
    if (!fs.existsSync(extPath)) {
      continue;
    }
    const json = readJSON(extPath);
    const stat100 = json?.data?.stat_100 || json?.data?.stat100 || null;
    if (!stat100) {
      continue;
    }

    try {
      console.log(`[synclv100] syncing ${lang}:${local} (only base_stats)`);
      // execFileSync 를 사용해서 코드네임에 & 같은 문자가 있어도 안전하게 실행
      execFileSync(
        process.execPath,
        ['scripts/syncCharacter.mjs', '--lang', lang, '--code', local, '--only', 'base_stats'],
        {
          stdio: 'inherit'
        }
      );
    } catch (e) {
      console.error(`[synclv100] failed for ${lang}:${local}:`, e?.message || e);
    }
  }

  console.log('[synclv100] done');
}

main();

