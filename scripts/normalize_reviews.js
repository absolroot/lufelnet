// Normalize per-character review.js files:
// - 리스트 출력: review 가 비어있는 캐릭터
// - 누락 필드 채움: review_en, review_jp, pros, pros_en, pros_jp, cons, cons_en, cons_jp
//   기본값:
//     review_en = ``; review_jp = ``;
//     pros = [""]; pros_en = [""]; pros_jp = [""];
//     cons = [""]; cons_en = [""]; cons_jp = [""];
//
// 실행:
//   node scripts/normalize_reviews.js
//
// 옵션:
//   --dry    실제 파일 쓰기 없이 콘솔에만 변경 사항 표시
//   --debug  처리 로그 상세 출력

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CHAR_DIR = path.join(ROOT, 'data', 'characters');
const isDryRun = process.argv.includes('--dry');
const isDebug = process.argv.includes('--debug');

function logDebug(...args) {
  if (isDebug) console.log(...args);
}

function listCharacterDirs(baseDir) {
  if (!fs.existsSync(baseDir)) return [];
  return fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(baseDir, d.name));
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function writeFileSafe(p, content) {
  if (isDryRun) return true;
  try {
    fs.writeFileSync(p, content, 'utf8');
    return true;
  } catch (e) {
    console.error(`[write-failed] ${p}`, e.message);
    return false;
  }
}

function extractCharacterName(src) {
  // window.characterReview["이름"] = {
  const m = src.match(/window\.characterReview\[(["'])(.+?)\1\]\s*=\s*\{/);
  return m ? m[2] : null;
}

function hasKey(src, key) {
  // 키 존재 여부(간단 매칭)
  const re = new RegExp(`\\b${key}\\s*:`);
  return re.test(src);
}

function isReviewBlank(src) {
  const m = src.match(/review\s*:\s*`([\s\S]*?)`/);
  if (!m) return false;
  return m[1].trim().length === 0;
}

function insertBeforeObjectClose(src, insertChunk) {
  // 객체의 닫힘 '};' 중, window.characterReview[...] = { ... }; 의 닫힘을 찾아 그 직전에 삽입
  // 간단 가정: 해당 파일에는 해당 객체 하나만 존재
  const assignIdx = src.search(/window\.characterReview\[/);
  if (assignIdx < 0) return src;
  // assign 이후의 '};' 를 찾는다
  const slice = src.slice(assignIdx);
  const closeIdxLocal = slice.search(/\n\s*\};/);
  if (closeIdxLocal < 0) return src;
  const closeIdx = assignIdx + closeIdxLocal;
  return src.slice(0, closeIdx) + insertChunk + src.slice(closeIdx);
}

function ensureFields(src) {
  // 들여쓰기 수준 추정 (review 라인의 들여쓰기 사용, 없으면 8공백)
  let indent = '        ';
  const reviewLine = src.match(/\n(\s*)review\s*:/);
  if (reviewLine && reviewLine[1]) indent = reviewLine[1];

  // review 뒤 콤마 보장: 이후에 필드가 추가될 예정이면 review 템플릿 리터럴 뒤에 콤마가 없을 경우 콤마 추가
  // - review: `...`\n<공백><영문키>:
  const needsComma = /review\s*:\s*`[\s\S]*?`\s*\n\s*[a-zA-Z_][\w]*\s*:/.test(src);
  if (needsComma) {
    src = src.replace(/(review\s*:\s*`[\s\S]*?`)(\s*\n\s*[a-zA-Z_][\w]*\s*:)/, '$1,$2');
  }

  const missing = [];
  const chunks = [];

  const wantStringKeys = ['review_en', 'review_jp'];
  const wantArrayKeys = [
    'pros', 'pros_en', 'pros_jp',
    'cons', 'cons_en', 'cons_jp'
  ];

  for (const k of wantStringKeys) {
    if (!hasKey(src, k)) {
      missing.push(k);
      chunks.push(`\n${indent}${k}: \`\`,`); // backtick empty
    }
  }
  for (const k of wantArrayKeys) {
    if (!hasKey(src, k)) {
      missing.push(k);
      chunks.push(`\n${indent}${k}: [""],`);
    }
  }

  if (chunks.length === 0) return { updated: false, next: src, added: [] };

  const insertChunk = chunks.join('');
  const next = insertBeforeObjectClose(src, insertChunk);
  return { updated: next !== src, next, added: missing };
}

function main() {
  const dirs = listCharacterDirs(CHAR_DIR);
  const emptyReviewNames = [];
  const changed = [];

  dirs.forEach(dir => {
    const file = path.join(dir, 'review.js');
    const code = readFileSafe(file);
    if (!code) return;

    const name = extractCharacterName(code) || path.basename(dir);
    const blank = isReviewBlank(code);
    if (blank) emptyReviewNames.push(name);

    const { updated, next, added } = ensureFields(code);
    if (updated) {
      const ok = writeFileSafe(file, next);
      if (ok) changed.push({ name, file, added });
    }
  });

  console.log('=== 빈 리뷰 캐릭터 목록 ===');
  if (emptyReviewNames.length === 0) {
    console.log('(없음)');
  } else {
    emptyReviewNames.forEach(n => console.log('- ' + n));
  }
  console.log('');

  console.log('=== 필드 보정 결과 ===');
  if (changed.length === 0) {
    console.log('(변경 없음)');
  } else {
    changed.forEach(c => {
      console.log(`- ${c.name} (${path.relative(ROOT, c.file)}): 추가 -> ${c.added.join(', ')}`);
    });
    if (isDryRun) {
      console.log('\n(dry-run) 실제 파일에는 쓰지 않았습니다.');
    }
  }
}

main();


