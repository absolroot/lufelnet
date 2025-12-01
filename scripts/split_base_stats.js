// Split data/kr/characters/character_base_stats.js into per-character files:
// data/characters/<캐릭터명>/base_stats.js
//
// Usage (repo root):
//   node scripts/split_base_stats.js
//
// 결과 파일 포맷:
//   window.basicStatsData = window.basicStatsData || {};
//   window.basicStatsData["캐릭터명"] = { ... };
//
// Windows 경로 포함 모든 OS에서 동작하도록 작성됨.

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'data', 'kr', 'characters', 'character_base_stats.js');
const OUT_ROOT = path.join(ROOT, 'data', 'characters');

function ensureDirSync(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function readBasicStatsData() {
    const raw = fs.readFileSync(SRC, 'utf8');
    // const -> var 치환하여 eval로 객체 추출
    const patched = raw.replace(/^\s*const\s+basicStatsData\s*=/, 'var basicStatsData =');
    const box = {};
    // eslint-disable-next-line no-eval
    eval(patched + '\n;box.basicStatsData = basicStatsData;');
    return box.basicStatsData || {};
}

function writePerCharacterFiles(basicStatsData) {
    const names = Object.keys(basicStatsData);
    let count = 0;
    names.forEach((name) => {
        const stats = basicStatsData[name];
        const charDir = path.join(OUT_ROOT, name);
        ensureDirSync(charDir);
        const outFile = path.join(charDir, 'base_stats.js');
        const content =
`window.basicStatsData = window.basicStatsData || {};
window.basicStatsData[${JSON.stringify(name)}] = ${JSON.stringify(stats, null, 4)};
`;
        fs.writeFileSync(outFile, content, 'utf8');
        count++;
    });
    return count;
}

function main() {
    try {
        console.log('[split_base_stats] Reading:', SRC);
        const data = readBasicStatsData();
        const total = writePerCharacterFiles(data);
        console.log(`[split_base_stats] Done. Wrote ${total} files to ${OUT_ROOT}`);
        process.exit(0);
    } catch (e) {
        console.error('[split_base_stats] Failed:', e);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}


