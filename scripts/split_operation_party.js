// Split KR operation and party into per-character files:
//  - data/kr/characters/character_operation.js  -> data/characters/<name>/operation.js
//  - data/kr/characters/character_party.js      -> data/characters/<name>/party.js
//
// Usage (repo root):
//   node scripts/split_operation_party.js
//
// Output format:
//   window.operationData = window.operationData || {};
//   window.operationData["<name>"] = { ... };
//
//   window.recommendParty = window.recommendParty || {};
//   window.recommendParty["<name>"] = { ... };

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC_OPERATION = path.join(ROOT, 'data', 'kr', 'characters', 'character_operation.js');
const SRC_PARTY = path.join(ROOT, 'data', 'kr', 'characters', 'character_party.js');
const OUT_ROOT = path.join(ROOT, 'data', 'characters');

function ensureDirSync(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function evalToObject(filePath, varName) {
    const raw = fs.readFileSync(filePath, 'utf8');
    // normalize "const <varName> = {...};" to "var <varName> = {...};"
    const patched = raw.replace(new RegExp(`^\\s*const\\s+${varName}\\s*=`, 'm'), `var ${varName} =`);
    const box = {};
    // eslint-disable-next-line no-eval
    eval(patched + `\n;box.__data__ = ${varName};`);
    const obj = box.__data__;
    if (!obj || typeof obj !== 'object') {
        throw new Error(`Failed to parse ${filePath} into object (${varName})`);
    }
    return obj;
}

function writeOperationPerCharacter(operationData) {
    const names = Object.keys(operationData);
    let count = 0;
    for (const name of names) {
        const value = operationData[name];
        const charDir = path.join(OUT_ROOT, name);
        ensureDirSync(charDir);
        const file = path.join(charDir, 'operation.js');
        const code =
`window.operationData = window.operationData || {};
window.operationData[${JSON.stringify(name)}] = ${JSON.stringify(value, null, 4)};
`;
        fs.writeFileSync(file, code, 'utf8');
        count++;
    }
    return count;
}

function writePartyPerCharacter(recommendParty) {
    const names = Object.keys(recommendParty);
    let count = 0;
    for (const name of names) {
        const value = recommendParty[name];
        const charDir = path.join(OUT_ROOT, name);
        ensureDirSync(charDir);
        const file = path.join(charDir, 'party.js');
        const code =
`window.recommendParty = window.recommendParty || {};
window.recommendParty[${JSON.stringify(name)}] = ${JSON.stringify(value, null, 4)};
`;
        fs.writeFileSync(file, code, 'utf8');
        count++;
    }
    return count;
}

function main() {
    try {
        console.log('[split_operation_party] Reading sources...');
        const operationData = evalToObject(SRC_OPERATION, 'operationData');
        const recommendParty = evalToObject(SRC_PARTY, 'recommendParty');
        console.log('[split_operation_party] Writing per-character files...');
        const opCount = writeOperationPerCharacter(operationData);
        const partyCount = writePartyPerCharacter(recommendParty);
        console.log(`[split_operation_party] Done. operation=${opCount}, party=${partyCount}`);
        process.exit(0);
    } catch (e) {
        console.error('[split_operation_party] Failed:', e);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}


