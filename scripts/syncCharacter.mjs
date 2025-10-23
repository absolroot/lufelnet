#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import process from 'process';

function readJSON(filePath) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(txt);
  } catch (e) {
    return null;
  }
}

function writeFile(filePath, code) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, code, 'utf8');
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--lang' && i + 1 < args.length) out.lang = args[++i];
    else if (args[i] === '--code' && i + 1 < args.length) out.code = args[++i];
  }
  out.lang = out.lang || process.env.INPUT_LANG || 'kr';
  out.code = out.code || process.env.INPUT_CODE;
  if (!out.code) {
    console.error('Missing --code');
    process.exit(1);
  }
  if (!['kr', 'jp', 'en'].includes(out.lang)) {
    console.error('Invalid --lang (kr/jp/en)');
    process.exit(1);
  }
  return out;
}

function loadCodenameMapping() {
  const mappingPath = path.join('data', 'external', 'character', 'codename.json');
  const arr = readJSON(mappingPath);
  if (!Array.isArray(arr)) return [];
  return arr;
}

function resolveLocalCodename(inputCode, mapping) {
  // if matches local
  const byLocal = mapping.find((m) => String(m.local).toUpperCase() === String(inputCode).toUpperCase());
  if (byLocal) return byLocal.local;
  // by api
  const byApi = mapping.find((m) => String(m.api).toLowerCase() === String(inputCode).toLowerCase());
  if (byApi) return byApi.local;
  // fallback: assume already local
  return inputCode;
}

function loadExternal(lang, local) {
  const p = path.join('data', 'external', 'character', lang, `${local}.json`);
  const json = readJSON(p);
  if (!json) {
    console.warn(`[warn] external not found: ${p}`);
    return null;
  }
  if (!json.data || json.status !== 0) {
    console.warn(`[warn] external has no data: ${p}`);
    return { data: null };
  }
  return json;
}

// -------- Helper: find and replace a specific character block in big JS object --------
function findCharacterBlock(jsText, charKey) {
  const keyPattern = new RegExp(`"${charKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\s*:\s*\{`);
  const match = keyPattern.exec(jsText);
  if (!match) return null;
  let start = match.index + match[0].length; // position after '{'
  let i = start;
  let depth = 1;
  const n = jsText.length;
  while (i < n) {
    const ch = jsText[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return { blockStart: start, blockEnd: i, keyStart: match.index, keyLen: match[0].length };
      }
    }
    i++;
  }
  return null;
}

function replaceOrInsertProp(blockText, propName, jsonStr, indent = '        ') {
  // Try to find existing property "propName": ...,
  const propRegex = new RegExp(`("${propName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}")\s*:\s*`);
  const m = propRegex.exec(blockText);
  if (m) {
    // locate value object/array starting right after colon
    const valStart = m.index + m[0].length;
    // detect structure (object or other), then find its end by braces/brackets balance
    let i = valStart;
    let depth = 0;
    let end = valStart;
    const open = blockText[i];
    if (open === '{' || open === '[') {
      const openCh = open;
      const closeCh = open === '{' ? '}' : ']';
      depth = 1; i++;
      while (i < blockText.length) {
        const ch = blockText[i];
        if (ch === openCh) depth++;
        else if (ch === closeCh) {
          depth--;
          if (depth === 0) { end = i + 1; break; }
        }
        i++;
      }
    } else {
      // primitive or string until comma/newline/closing brace
      while (i < blockText.length && ![',', '\n', '\r', '}'].includes(blockText[i])) i++;
      end = i;
    }
    const before = blockText.slice(0, valStart);
    const after = blockText.slice(end);
    return before + jsonStr + after;
  }
  // Insert before closing '}' with trailing comma if needed
  const closeIdx = blockText.lastIndexOf('}');
  if (closeIdx === -1) return blockText; // invalid
  // ensure comma before insert (if last non-space before '}' is not '{')
  const prev = blockText.slice(0, closeIdx).trimEnd();
  const needComma = !prev.endsWith('{');
  const insertion = `${needComma ? ',' : ''}\n${indent}"${propName}": ${jsonStr}\n    `;
  return blockText.slice(0, closeIdx) + insertion + blockText.slice(closeIdx);
}

function jsonCompact(obj) {
  return JSON.stringify(obj, null, 0);
}

// (legacy AST helpers removed)

function findCharacterKeyByCodename(filePath, localCodename) {
  const code = readText(filePath);
  const localUpper = String(localCodename).toUpperCase();
  const codenameRe = /"codename"\s*:\s*"([^"]+)"/g;
  let m;
  while ((m = codenameRe.exec(code))) {
    if (String(m[1]).toUpperCase() !== localUpper) continue;
    const hitIdx = m.index;
    // find nearest character key line before this index: 4-space indent then "Key": {
    const headerRe = /^\s{4}"([^"]+)"\s*:\s*\{\s*$/gm;
    let lastKey = null;
    let lastPos = -1;
    let hm;
    while ((hm = headerRe.exec(code))) {
      if (hm.index < hitIdx) {
        lastKey = hm[1];
        lastPos = hm.index;
      } else {
        break;
      }
    }
    if (lastKey) return lastKey;
  }
  return null;
}

function updateRitual(lang, charKey, external) {
  const ritualPath = path.join('data', lang, 'characters', 'character_ritual.js');
  if (!fs.existsSync(ritualPath)) return;
  const code = readText(ritualPath);
  const found = findCharacterBlock(code, charKey);
  if (!found) return;
  const before = code.slice(0, found.blockStart);
  const block = code.slice(found.blockStart, found.blockEnd);
  const after = code.slice(found.blockEnd);
  let newBlock = block;
  if (external?.data?.name) newBlock = replaceOrInsertProp(newBlock, 'name', jsonCompact(external.data.name));
  const asc = external?.data?.skill?.ascend_skill || [];
  for (let i = 0; i < asc.length && i < 7; i++) {
    const item = asc[i];
    if (!item) continue;
    newBlock = replaceOrInsertProp(newBlock, `r${i}`, jsonCompact(item.name || ''));
    newBlock = replaceOrInsertProp(newBlock, `r${i}_detail`, jsonCompact(item.desc || ''));
  }
  const output = before + newBlock + after;
  try { new Function(output); } catch (e) { throw new Error('ritual file edit invalid'); }
  writeFile(ritualPath, output);
}

function mapNatureToElement(nature, lang) {
  if (!nature) return undefined;
  if (lang !== 'kr') return nature;
  const n = String(nature).toLowerCase();
  const map = {
    ice: '빙결',
    elec: '전격',
    electric: '전격',
    fire: '화염',
    bless: '축복',
    curse: '주원',
    wind: '질풍',
    psychokinesis: '염동',
    almighty: '만능',
    allmighty: '만능',
    physical: '물리',
    support: '버프',
  };
  return map[n] || nature;
}

function mapTagsToType(tags, lang) {
  if (!Array.isArray(tags) || tags.length === 0) return undefined;
  // KR 외부는 한국어 태그 사용. 가장 의미 있는 태그를 선택
  const set = new Set(tags.filter(Boolean).map((t) => String(t)));
  const candidates = ['단일피해', '광역피해', '버프', '강화', '디버프'];
  for (const c of candidates) if (set.has(c)) return c;
  // 일부는 "광역" 같은 변형일 수 있음
  for (const t of set) {
    if (t.includes('광역')) return '광역피해';
    if (t.includes('단일')) return '단일피해';
  }
  return undefined;
}

function parseCostToFields(cost) {
  if (!cost || typeof cost !== 'string') return {};
  const m = cost.match(/^(SP|HP)\s*(\d+)/i);
  if (!m) return {};
  const val = parseInt(m[2], 10);
  if (m[1].toUpperCase() === 'SP') return { sp: val };
  if (m[1].toUpperCase() === 'HP') return { hp: val };
  return {};
}

function normalizeSkill(item, lang, { removeName = false, elementOverride } = {}) {
  if (!item) return null;
  const element = elementOverride || mapNatureToElement(item.nature, lang);
  const type = mapTagsToType(item.tags, lang);
  const costFields = parseCostToFields(item.cost || '');
  const out = {};
  if (!removeName && item.name) out.name = item.name;
  if (element !== undefined) out.element = element;
  if (type !== undefined) out.type = type;
  if (typeof item.cooldown === 'number') out.cool = item.cooldown;
  if (item.desc) out.description = item.desc;
  Object.assign(out, costFields);
  return out;
}

function updateSkills(lang, charKey, external) {
  const skillsPath = path.join('data', lang, 'characters', 'character_skills.js');
  if (!fs.existsSync(skillsPath)) return;
  const code = readText(skillsPath);
  const found = findCharacterBlock(code, charKey);
  if (!found) return;
  const before = code.slice(0, found.blockStart);
  const block = code.slice(found.blockStart, found.blockEnd);
  const after = code.slice(found.blockEnd);
  let newBlock = block;
  const skills = external?.data?.skill || {};
  const normal = Array.isArray(skills.normal_skill) ? skills.normal_skill : [];
  const assist = Array.isArray(skills.assist_skill) ? skills.assist_skill : [];
  const passive = Array.isArray(skills.passive_skill) ? skills.passive_skill : [];
  const theurgia = Array.isArray(skills.theurgia_skill) ? skills.theurgia_skill : [];
  const highlight = Array.isArray(skills.highlight_skill) ? skills.highlight_skill : null;

  if (normal[0]) newBlock = replaceOrInsertProp(newBlock, 'skill1', jsonCompact(normalizeSkill(normal[0], lang)));
  if (normal[1]) newBlock = replaceOrInsertProp(newBlock, 'skill2', jsonCompact(normalizeSkill(normal[1], lang)));
  if (normal[2]) newBlock = replaceOrInsertProp(newBlock, 'skill3', jsonCompact(normalizeSkill(normal[2], lang)));

  if (assist[0]) newBlock = replaceOrInsertProp(newBlock, 'skill_support', jsonCompact(normalizeSkill(assist[0], lang, { elementOverride: '패시브' })));

  if (passive[0]) newBlock = replaceOrInsertProp(newBlock, 'passive1', jsonCompact(normalizeSkill(passive[0], lang)));
  if (passive[1]) newBlock = replaceOrInsertProp(newBlock, 'passive2', jsonCompact(normalizeSkill(passive[1], lang)));

  if (highlight && highlight[0]) newBlock = replaceOrInsertProp(newBlock, 'skill_highlight', jsonCompact(normalizeSkill(highlight[0], lang, { removeName: true })));

  if (theurgia[0]) newBlock = replaceOrInsertProp(newBlock, 'skill_highlight', jsonCompact(normalizeSkill(theurgia[0], lang)));
  if (theurgia[1]) newBlock = replaceOrInsertProp(newBlock, 'skill_highlight2', jsonCompact(normalizeSkill(theurgia[1], lang)));

  const output = before + newBlock + after;
  try { new Function(output); } catch (e) { throw new Error('skills file edit invalid'); }
  writeFile(skillsPath, output);
}

function parseSevenNumbers(s) {
  if (!s || typeof s !== 'string') return null;
  const parts = s.split('/').map((p) => parseFloat(String(p).trim()));
  if (parts.length !== 7 || parts.some((n) => Number.isNaN(n))) return null;
  return parts;
}

function updateBaseStatsKR(charKey, external) {
  const basePath = path.join('data', 'kr', 'characters', 'character_base_stats.js');
  if (!fs.existsSync(basePath)) return;
  const code = readText(basePath);
  const found = findCharacterBlock(code, charKey);
  if (!found) return;
  const before = code.slice(0, found.blockStart);
  const block = code.slice(found.blockStart, found.blockEnd);
  const after = code.slice(found.blockEnd);
  let newBlock = block;
  const stats = external?.data?.stats || null;
  if (stats) {
    const atk = parseSevenNumbers(stats['Attack']);
    const def = parseSevenNumbers(stats['Defense']);
    const hp = parseSevenNumbers(stats['HP']);
    if (atk && def && hp) {
      for (let i = 0; i < 7; i++) {
        const key = `a${i}_lv80`;
        const obj = { HP: hp[i], attack: atk[i], defense: def[i] };
        newBlock = replaceOrInsertProp(newBlock, key, jsonCompact(obj));
      }
    }
  }
  const output = before + newBlock + after;
  try { new Function(output); } catch (e) { throw new Error('base stats file edit invalid'); }
  writeFile(basePath, output);
}

function updateNamesKR(local, key, nameMap) {
  const krCharsPath = path.join('data', 'kr', 'characters', 'characters.js');
  if (!fs.existsSync(krCharsPath)) return;
  const code = readText(krCharsPath);
  const found = findCharacterBlock(code, key);
  if (!found) return;
  const before = code.slice(0, found.blockStart);
  const block = code.slice(found.blockStart, found.blockEnd);
  const after = code.slice(found.blockEnd);
  let newBlock = block;
  if (nameMap.en) newBlock = replaceOrInsertProp(newBlock, 'name_en', jsonCompact(nameMap.en));
  if (nameMap.jp) newBlock = replaceOrInsertProp(newBlock, 'name_jp', jsonCompact(nameMap.jp));
  if (nameMap.cn) newBlock = replaceOrInsertProp(newBlock, 'name_cn', jsonCompact(nameMap.cn));
  if (nameMap.tw) newBlock = replaceOrInsertProp(newBlock, 'name_tw', jsonCompact(nameMap.tw));
  const output = before + newBlock + after;
  try { new Function(output); } catch (e) { throw new Error('names file edit invalid'); }
  writeFile(krCharsPath, output);
}

function main() {
  const { lang, code } = parseArgs();
  const mapping = loadCodenameMapping();
  const local = resolveLocalCodename(code, mapping);

  // external per language
  const extTarget = loadExternal(lang, local);

  // find character key via codename in target language characters.js (fallback to KR)
  const charsPath = path.join('data', lang, 'characters', 'characters.js');
  let key = null;
  if (fs.existsSync(charsPath)) {
    key = findCharacterKeyByCodename(charsPath, local);
  }
  if (!key && lang !== 'kr') {
    const alt = path.join('data', 'kr', 'characters', 'characters.js');
    if (fs.existsSync(alt)) key = findCharacterKeyByCodename(alt, local);
  }
  if (!key) {
    console.error(`Character with codename ${local} not found in ${charsPath}`);
    process.exit(2);
  }

  // Update ritual/skills/base for requested language if data exists
  if (extTarget && extTarget.data) {
    updateRitual(lang, key, extTarget);
    updateSkills(lang, key, extTarget);
    if (lang === 'kr') updateBaseStatsKR(key, extTarget);
  } else {
    console.warn(`[warn] Skip skills/stats update for ${lang}:${local} due to null data`);
  }

  // Names enrichment from multiple languages (best-effort)
  const extEN = loadExternal('en', local);
  const extJP = loadExternal('jp', local);
  const extCN = loadExternal('cn', local);
  const extTW = loadExternal('tw', local);
  const nameMap = {
    en: extEN?.data?.name || null,
    jp: extJP?.data?.name || null,
    cn: extCN?.data?.name || null,
    tw: extTW?.data?.name || null
  };
  updateNamesKR(local, key, nameMap);

  console.log(`Sync completed for ${lang}:${local} (key='${key}')`);
}

main();


