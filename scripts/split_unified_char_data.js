// Create per-character unified files for ritual, skill, weapon with KR/EN/JP data
// Input:
//   data/{kr,en,jp}/characters/character_ritual.js
//   data/{kr,en,jp}/characters/character_skills.js
//   data/{kr,en,jp}/characters/character_weapon.js
// Output per character (Korean key as folder name):
//   data/characters/<name>/ritual.js
//   data/characters/<name>/skill.js
//   data/characters/<name>/weapon.js
//
// Each file assigns all three languages to legacy-compatible globals:
//   ritual.js: window.ritualData[name], window.enCharacterRitualData[name], window.jpCharacterRitualData[name]
//   skill.js:  window.characterSkillsData[name], window.enCharacterSkillsData[name], window.jpCharacterSkillsData[name]
//   weapon.js: window.WeaponData[name], window.enCharacterWeaponData[name], window.jpCharacterWeaponData[name]
//
// Usage:
//   node scripts/split_unified_char_data.js

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function readOrNull(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function evalObjectFrom(filePath, varName) {
  const code = readOrNull(filePath);
  if (!code) return {};
  // Replace "const <var> =" with "var <var> =" for eval
  const patched = code.replace(new RegExp(`(^|\\n)\\s*const\\s+${varName}\\s*=`, 'm'), `$1var ${varName} =`);
  const box = {};
  try {
    // Provide a minimal browser-like/global shim to avoid ReferenceError on "window.*" and "module.exports"
    // eslint-disable-next-line no-eval
    eval(`var window = {}; var module = {}; var exports = {};` + patched + `\n;box.__data__ = ${varName};`);
    const obj = box.__data__;
    return (obj && typeof obj === 'object') ? obj : {};
  } catch (e) {
    if (process.env.DEBUG_UNIFIED || process.argv.includes('--debug')) {
      console.error(`[eval-failed] ${filePath} var=${varName}: ${e && e.message}`);
    }
    return {};
  }
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, 'utf8');
}

function stringify(obj) {
  return JSON.stringify(obj ?? {}, null, 2);
}

// Unicode-normalize keys and build fast lookup maps to avoid subtle mismatches
function normalizeName(str) {
  if (typeof str !== 'string') return str;
  return str
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')            // remove zero-width
    .replace(/[\u00B7\u30FB]/g, '\u00B7')             // unify middle dot
    .replace(/\s+/g, ' ')                              // collapse spaces
    .trim();
}

function buildKeyMap(obj) {
  const map = {};
  if (!obj || typeof obj !== 'object') return map;
  for (const k of Object.keys(obj)) {
    map[normalizeName(k)] = obj[k];
  }
  return map;
}

function getFromMap(normMap, name) {
  if (!normMap) return undefined;
  const key = normalizeName(name);
  return Object.prototype.hasOwnProperty.call(normMap, key) ? normMap[key] : undefined;
}

function main() {
  // Load ritual maps
  const ritualKR = evalObjectFrom(path.join(ROOT, 'data', 'kr', 'characters', 'character_ritual.js'), 'ritualData');
  const ritualEN = evalObjectFrom(path.join(ROOT, 'data', 'en', 'characters', 'character_ritual.js'), 'enCharacterRitualData');
  const ritualJP = evalObjectFrom(path.join(ROOT, 'data', 'jp', 'characters', 'character_ritual.js'), 'jpCharacterRitualData');

  // Load skill maps
  const skillKR = evalObjectFrom(path.join(ROOT, 'data', 'kr', 'characters', 'character_skills.js'), 'characterSkillsData');
  const skillEN = evalObjectFrom(path.join(ROOT, 'data', 'en', 'characters', 'character_skills.js'), 'enCharacterSkillsData');
  const skillJP = evalObjectFrom(path.join(ROOT, 'data', 'jp', 'characters', 'character_skills.js'), 'jpCharacterSkillsData');

  // Load weapon maps
  const weapKR = evalObjectFrom(path.join(ROOT, 'data', 'kr', 'characters', 'character_weapon.js'), 'WeaponData');
  const weapEN = evalObjectFrom(path.join(ROOT, 'data', 'en', 'characters', 'character_weapon.js'), 'enCharacterWeaponData');
  const weapJP = evalObjectFrom(path.join(ROOT, 'data', 'jp', 'characters', 'character_weapon.js'), 'jpCharacterWeaponData');

  const DEBUG = process.env.DEBUG_UNIFIED || process.argv.includes('--debug');
  if (DEBUG) {
    const dbg = (label, obj) => `${label}:${obj ? Object.keys(obj).length : 0}`;
    console.log(`[load] ${dbg('ritualKR', ritualKR)} ${dbg('ritualEN', ritualEN)} ${dbg('ritualJP', ritualJP)}`);
    console.log(`[load] ${dbg('skillKR', skillKR)} ${dbg('skillEN', skillEN)} ${dbg('skillJP', skillJP)}`);
    console.log(`[load] ${dbg('weapKR', weapKR)} ${dbg('weapEN', weapEN)} ${dbg('weapJP', weapJP)}`);
  }

  // Union of character keys across KR (primary) and other languages
  const keys = new Set([
    ...Object.keys(ritualKR || {}),
    ...Object.keys(skillKR || {}),
    ...Object.keys(weapKR || {}),
    ...Object.keys(ritualEN || {}),
    ...Object.keys(skillEN || {}),
    ...Object.keys(weapEN || {}),
    ...Object.keys(ritualJP || {}),
    ...Object.keys(skillJP || {}),
    ...Object.keys(weapJP || {})
  ]);

  // Build normalized lookup maps for reliable cross-locale key matches
  const ritualENMap = buildKeyMap(ritualEN);
  const ritualJPMap = buildKeyMap(ritualJP);
  const skillENMap = buildKeyMap(skillEN);
  const skillJPMap = buildKeyMap(skillJP);
  const weapENMap = buildKeyMap(weapEN);
  const weapJPMap = buildKeyMap(weapJP);
  const ritualKRMap = buildKeyMap(ritualKR);
  const skillKRMap = buildKeyMap(skillKR);
  const weapKRMap = buildKeyMap(weapKR);

  if (DEBUG) {
    const peek = (m) => Object.keys(m).slice(0, 5).join(', ');
    console.log('[norm-peek] weapJP:', peek(weapJPMap));
  }

  let ritualCount = 0, skillCount = 0, weapCount = 0;
  for (const name of keys) {
    const dir = path.join(ROOT, 'data', 'characters', name);
    ensureDir(dir);

    // ritual.js
    const rKR = getFromMap(ritualKRMap, name) ?? {};
    let rEN = getFromMap(ritualENMap, name) ?? {};
    let rJP = getFromMap(ritualJPMap, name) ?? {};
    if (!rEN || Object.keys(rEN).length === 0) rEN = rKR;
    if (!rJP || Object.keys(rJP).length === 0) rJP = rKR;
    const ritualContent =
`window.ritualData = window.ritualData || {};
window.enCharacterRitualData = window.enCharacterRitualData || {};
window.jpCharacterRitualData = window.jpCharacterRitualData || {};
window.ritualData[${JSON.stringify(name)}] = ${stringify(rKR)};
window.enCharacterRitualData[${JSON.stringify(name)}] = ${stringify(rEN)};
window.jpCharacterRitualData[${JSON.stringify(name)}] = ${stringify(rJP)};
`;
    writeFile(path.join(dir, 'ritual.js'), ritualContent);
    ritualCount++;

    // skill.js
    const sKR = getFromMap(skillKRMap, name) ?? {};
    let sEN = getFromMap(skillENMap, name) ?? {};
    let sJP = getFromMap(skillJPMap, name) ?? {};
    if (!sEN || Object.keys(sEN).length === 0) sEN = sKR;
    if (!sJP || Object.keys(sJP).length === 0) sJP = sKR;
    const skillContent =
`window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData[${JSON.stringify(name)}] = ${stringify(sKR)};
window.enCharacterSkillsData[${JSON.stringify(name)}] = ${stringify(sEN)};
window.jpCharacterSkillsData[${JSON.stringify(name)}] = ${stringify(sJP)};
`;
    writeFile(path.join(dir, 'skill.js'), skillContent);
    skillCount++;

    // weapon.js
    const wKR = getFromMap(weapKRMap, name) ?? {};
    let wEN = getFromMap(weapENMap, name) ?? {};
    let wJP = getFromMap(weapJPMap, name) ?? {};
    if (!wEN || Object.keys(wEN).length === 0) wEN = wKR;
    if (!wJP || Object.keys(wJP).length === 0) {
      if (DEBUG) console.warn(`[fallback] JP weapon -> KR for "${name}"`);
      wJP = wKR;
    }
    const weaponContent =
`window.WeaponData = window.WeaponData || {};
window.enCharacterWeaponData = window.enCharacterWeaponData || {};
window.jpCharacterWeaponData = window.jpCharacterWeaponData || {};
window.WeaponData[${JSON.stringify(name)}] = ${stringify(wKR)};
window.enCharacterWeaponData[${JSON.stringify(name)}] = ${stringify(wEN)};
window.jpCharacterWeaponData[${JSON.stringify(name)}] = ${stringify(wJP)};
`;
    writeFile(path.join(dir, 'weapon.js'), weaponContent);
    weapCount++;
  }

  console.log(`[unified] ritual=${ritualCount}, skill=${skillCount}, weapon=${weapCount} files written under data/characters/`);
}

main();


