#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import process from 'process';
import { execSync } from 'child_process';

let recast = null;
let babelParser = null;
let b = null;

async function ensureDepsLoaded() {
  async function tryLoad() {
    try {
      // dynamic import for ESM resolution
      // eslint-disable-next-line no-undef
      const r = await import('recast');
      // eslint-disable-next-line no-undef
      const bp = await import('@babel/parser');
      recast = r.default || r;
      babelParser = bp;
      b = recast.types.builders;
      return true;
    } catch (e) {
      return false;
    }
  }
  if (await tryLoad()) return;
  try {
    execSync('npm init -y', { stdio: 'ignore' });
  } catch { }
  try {
    execSync('npm i -D recast @babel/parser prettier', { stdio: 'ignore' });
  } catch (e) {
    console.error('Failed to install dependencies recast/@babel/parser/prettier');
    throw e;
  }
  if (!(await tryLoad())) {
    throw new Error('Unable to load recast/@babel/parser after install');
  }
}

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
    else if (args[i] === '--only' && i + 1 < args.length) out.only = args[++i]; // ritual | skill | weapon | base_stats
  }
  out.lang = out.lang || process.env.INPUT_LANG || 'kr';
  out.code = out.code || process.env.INPUT_CODE;
  if (!out.code) {
    console.error('Missing --code');
    process.exit(1);
  }
  if (!['kr', 'jp', 'en', 'cn'].includes(out.lang)) {
    console.error('Invalid --lang (kr/jp/en)');
    process.exit(1);
  }
  if (out.only) {
    out.only = String(out.only).toLowerCase();
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

// 보조 용도(다른 언어 이름만 참고 등)로 사용할 때는 경고를 찍지 않는 버전
function loadExternalSilent(lang, local) {
  const p = path.join('data', 'external', 'character', lang, `${local}.json`);
  const json = readJSON(p);
  if (!json) return null;
  if (!json.data || json.status !== 0) return { data: null };
  return json;
}

function loadExternalWeapon(lang, local) {
  const p = path.join('data', 'external', 'weapon', lang, `${local}.json`);
  const json = readJSON(p);
  if (!json) {
    console.warn(`[warn] external weapon not found: ${p}`);
    return null;
  }
  if (!json.data || json.status !== 0) {
    console.warn(`[warn] external weapon has no data: ${p}`);
    return { data: null };
  }
  return json;
}

function parseAst(code) {
  return recast.parse(code, {
    parser: {
      parse(source) {
        return babelParser.parse(source, {
          sourceType: 'module',
          plugins: ['jsx', 'classProperties', 'objectRestSpread', 'optionalChaining']
        });
      }
    }
  });
}

function findTopObject(ast) {
  let obj = null;
  recast.types.visit(ast, {
    visitVariableDeclarator(p) {
      const init = p.node.init;
      if (init && init.type === 'ObjectExpression' && p.parent && p.parent.node.type === 'VariableDeclaration') {
        obj = { path: p, obj: init };
        return false;
      }
      this.traverse(p);
    },
    visitExpressionStatement(p) {
      // Support top-level assignments like: foo = { ... }
      const expr = p.node.expression;
      if (
        expr &&
        expr.type === 'AssignmentExpression' &&
        expr.right &&
        expr.right.type === 'ObjectExpression'
      ) {
        obj = { path: p, obj: expr.right };
        return false;
      }
      this.traverse(p);
    }
    ,
    // Support patterns like: Object.assign(window.characterData, { ... })
    visitCallExpression(p) {
      if (obj) return false;
      const call = p.node;
      const callee = call.callee;
      if (
        callee &&
        callee.type === 'MemberExpression' &&
        callee.object &&
        callee.object.type === 'Identifier' &&
        callee.object.name === 'Object' &&
        callee.property &&
        (
          (callee.property.type === 'Identifier' && callee.property.name === 'assign') ||
          (callee.property.type === 'StringLiteral' && callee.property.value === 'assign')
        )
      ) {
        const args = call.arguments || [];
        if (args.length >= 2 && args[1] && args[1].type === 'ObjectExpression') {
          obj = { path: p, obj: args[1] };
          return false;
        }
      }
      this.traverse(p);
    }
  });
  return obj;
}

function findObjectByVarName(ast, varName) {
  let found = null;
  recast.types.visit(ast, {
    visitVariableDeclarator(p) {
      if (
        p.node.id &&
        p.node.id.type === 'Identifier' &&
        p.node.id.name === varName &&
        p.node.init &&
        p.node.init.type === 'ObjectExpression'
      ) {
        found = { path: p, obj: p.node.init };
        return false;
      }
      this.traverse(p);
    },
    visitExpressionStatement(p) {
      // Also support assignments like: varName = { ... }
      const expr = p.node.expression;
      if (
        expr &&
        expr.type === 'AssignmentExpression' &&
        expr.left &&
        expr.left.type === 'Identifier' &&
        expr.left.name === varName &&
        expr.right &&
        expr.right.type === 'ObjectExpression'
      ) {
        found = { path: p, obj: expr.right };
        return false;
      }
      this.traverse(p);
    }
  });
  return found;
}

function getLiteralKey(node) {
  if (!node) return null;
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'StringLiteral' || node.type === 'Literal') return node.value;
  return null;
}

function getProperty(objectExpression, keyName) {
  return objectExpression.properties.find((p) => getLiteralKey(p.key) === keyName);
}

function ensureObjectProperty(objExpr, keyName) {
  let prop = getProperty(objExpr, keyName);
  if (!prop) {
    prop = b.objectProperty(b.stringLiteral(keyName), b.objectExpression([]));
    objExpr.properties.push(prop);
  }
  return prop;
}

function setStringProp(objExpr, keyName, value) {
  let prop = getProperty(objExpr, keyName);
  if (!prop) {
    prop = b.objectProperty(b.stringLiteral(keyName), b.stringLiteral(value));
    objExpr.properties.push(prop);
  } else {
    prop.value = b.stringLiteral(value);
  }
}

function setObjectProp(objExpr, keyName, valueObj) {
  let prop = getProperty(objExpr, keyName);
  const jsonAst = recast.parse(`const x = ${JSON.stringify(valueObj)};`).program.body[0].declarations[0].init;
  if (!prop) {
    prop = b.objectProperty(b.stringLiteral(keyName), jsonAst);
    objExpr.properties.push(prop);
  } else {
    prop.value = jsonAst;
  }
}

function astLiteralToValue(node) {
  if (!node) return undefined;
  switch (node.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
    case 'NullLiteral':
      return node.value;
    case 'ObjectExpression': {
      const obj = {};
      for (const p of node.properties || []) {
        const k = getLiteralKey(p.key);
        if (k == null) continue;
        const v = astLiteralToValue(p.value);
        obj[k] = v;
      }
      return obj;
    }
    case 'ArrayExpression': {
      return node.elements.map((el) => astLiteralToValue(el));
    }
    default:
      return undefined;
  }
}

function valueToAstLiteral(value) {
  return recast.parse(`const x = ${JSON.stringify(value)};`).program.body[0].declarations[0].init;
}

function setMergedObjectProp(objExpr, keyName, updates, deleteKeys = []) {
  let prop = getProperty(objExpr, keyName);
  let current = {};
  if (prop && prop.value && prop.value.type === 'ObjectExpression') {
    const plain = astLiteralToValue(prop.value);
    if (plain && typeof plain === 'object' && !Array.isArray(plain)) current = plain;
  }
  // delete requested keys
  for (const k of deleteKeys) {
    if (k in current) delete current[k];
  }
  // shallow merge with null/undefined guard
  const merged = { ...current };
  for (const k of Object.keys(updates || {})) {
    const v = updates[k];
    if (v !== undefined && v !== null) merged[k] = v;
  }
  const astVal = valueToAstLiteral(merged);
  if (!prop) {
    prop = b.objectProperty(b.stringLiteral(keyName), astVal);
    objExpr.properties.push(prop);
  } else {
    prop.value = astVal;
  }
}

// ---------- Helpers for character info files ----------
function findCharacterKeyByCodename(filePath, localCodename) {
  const code = readText(filePath);
  const ast = parseAst(code);
  // Prefer characterData if present; fallback to first top-level object
  const holder = findObjectByVarName(ast, 'characterData') || findTopObject(ast);
  if (!holder) return null;
  const props = holder.obj.properties;
  for (const p of props) {
    if (p.value && p.value.type === 'ObjectExpression') {
      const sub = p.value;
      const codeProp = getProperty(sub, 'codename');
      if (codeProp && codeProp.value && codeProp.value.type === 'StringLiteral') {
        if (String(codeProp.value.value).toUpperCase() === String(localCodename).toUpperCase()) {
          return getLiteralKey(p.key);
        }
      }
    }
  }
  return null;
}

// ---------- Skill Transform Utilities ----------
function parseCost(cost) {
  if (!cost || typeof cost !== 'string') return {};
  const m = cost.match(/\b(SP|HP)\s*:?[\s]*([0-9]+(?:\.[0-9]+)?)\b/i);
  if (!m) return {};
  const key = m[1].toUpperCase();
  const val = Number(m[2]);
  if (Number.isNaN(val)) return {};
  return key === 'SP' ? { sp: val } : { hp: val };
}

function toArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x.filter(Boolean);
  return [x];
}

const NATURE_TO_ELEMENT_KR = {
  Ice: '빙결',
  Elec: '전격',
  Electric: '전격',
  Fire: '화염',
  Wind: '질풍',
  Nuclear: '핵열',
  Nuke: '핵열',
  Psy: '염동',
  Bless: '축복',
  Curse: '주원',
  Phys: '물리',
  Physical: '물리',
  Gun: '총격',
  Almighty: '만능',
  Support: '버프',
  Debuff: '디버프'
};

function normStr(s) {
  return String(s || '').toLowerCase();
}

function inferTypeFromTags(tags) {
  const list = toArray(tags).map(normStr);
  if (list.some((t) => t.includes('단일') || t.includes('single'))) return '단일피해';
  if (list.some((t) => t.includes('광역') || t.includes('aoe'))) return '광역피해';
  if (list.some((t) => t.includes('버프') || t.includes('buff') || t.includes('support') || t.includes('補助'))) return '버프';
  if (list.some((t) => t.includes('디버프') || t.includes('debuff'))) return '디버프';
  return undefined;
}

function inferElement({ group, tags, nature }) {
  // group: 'assist' | 'passive' | 'normal' | 'highlight' | 'theurgia'
  if (group === 'assist') return '버프';
  if (group === 'passive') return '패시브';
  const list = toArray(tags).map((t) => t && String(t));
  if (list.some((t) => t && (t.includes('버프') || /buff|support|補助/i.test(t)))) return '버프';
  if (list.some((t) => t && (t.includes('디버프') || /debuff/i.test(t)))) return '디버프';
  if (nature && NATURE_TO_ELEMENT_KR[nature]) return NATURE_TO_ELEMENT_KR[nature];
  return undefined;
}

function transformSkill(item, { group, removeName = false, keepName = true } = {}) {
  if (!item || typeof item !== 'object') return null;
  const nature = item.nature || item.element || undefined;
  const out = {};
  // name
  if (!removeName && keepName && item.name) out.name = item.name;
  // element
  const element = inferElement({ group, tags: item.tags, nature });
  if (element) out.element = element;
  // type
  const type = inferTypeFromTags(item.tags);
  if (type) out.type = type;
  // cost
  const c = parseCost(item.cost);
  if ('sp' in c) out.sp = c.sp;
  if ('hp' in c) out.hp = c.hp;
  // cool
  if (typeof item.cooldown === 'number') out.cool = item.cooldown;
  // description
  if (typeof item.desc === 'string') out.description = item.desc;
  // Done
  return out;
}

function extractSyncHighlightValues(normalDesc, syncDesc) {
  const numberPattern = /\d+(?:\.\d+)?%?(?:\/\d+(?:\.\d+)?%?){0,6}/g;
  const normalValues = String(normalDesc || '').match(numberPattern) || [];
  const syncValues = String(syncDesc || '').match(numberPattern) || [];
  const changed = [];
  const seen = new Set();

  for (let i = 0; i < syncValues.length; i += 1) {
    const value = syncValues[i];
    if (value !== normalValues[i] && !seen.has(value)) {
      changed.push(value);
      seen.add(value);
    }
  }

  return changed;
}

function applySyncNormalSkill(transformed, normalItem, syncItem) {
  if (!transformed || !normalItem || !syncItem) return transformed;
  if (String(normalItem.sn || '') !== String(syncItem.sn || '')) return transformed;
  if (typeof syncItem.desc !== 'string' || !syncItem.desc.trim()) return transformed;

  transformed.sync_description = syncItem.desc;
  const highlightValues = extractSyncHighlightValues(normalItem.desc, syncItem.desc);
  if (highlightValues.length > 0) {
    transformed.sync_highlight_values = highlightValues;
  }

  return transformed;
}

function parseSevenNumbers(s) {
  if (!s || typeof s !== 'string') return null;
  const parts = s.split('/').map((p) => parseFloat(String(p).trim()));
  if (parts.length !== 7 || parts.some((n) => Number.isNaN(n))) return null;
  return parts;
}

function updateNamesKR(local, key, nameMap) {
  const krCharsPath = path.join('data', 'character_info.js');
  if (!fs.existsSync(krCharsPath)) return;
  const code = readText(krCharsPath);
  const ast = parseAst(code);
  const top = findTopObject(ast);
  if (!top) return;
  let charProp = getProperty(top.obj, key);
  if (!charProp) return;
  const obj = charProp.value;
  if (nameMap.en) setStringProp(obj, 'name_en', nameMap.en);
  if (nameMap.jp) setStringProp(obj, 'name_jp', nameMap.jp);
  if (nameMap.cn) setStringProp(obj, 'name_cn', nameMap.cn);
  if (nameMap.tw) setStringProp(obj, 'name_tw', nameMap.tw);
  const output = recast.print(ast).code;
  writeFile(krCharsPath, output);
}

// ---------- Per-character updaters (ritual/skill/weapon/base_stats) ----------

function readPerCharacterBlock(filePath, windowName, charKey) {
  if (!fs.existsSync(filePath)) return {};
  try {
    const code = readText(filePath);
    const keyLiteral = JSON.stringify(charKey);
    const escapedKey = keyLiteral.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      String.raw`window\.${windowName}\s*\[\s*${escapedKey}\s*]\s*=\s*([\s\S]*?);`
    );
    const m = code.match(re);
    if (!m || !m[1]) return {};
    const objSource = m[1].trim();
    const parsed = JSON.parse(objSource);
    return (parsed && typeof parsed === 'object') ? parsed : {};
  } catch (e) {
    console.error(
      `::warning::[per-character] failed to read ${windowName}[${charKey}] from ${filePath}:`,
      e?.message || e
    );
    return {};
  }
}

function createPerCharacterSkeleton(kind) {
  if (kind === 'ritual') {
    return (
      `window.ritualData = window.ritualData || {};
window.enCharacterRitualData = window.enCharacterRitualData || {};
window.jpCharacterRitualData = window.jpCharacterRitualData || {};
`
    );
  }
  if (kind === 'skill') {
    return (
      `window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
`
    );
  }
  if (kind === 'weapon') {
    return (
      `window.WeaponData = window.WeaponData || {};
window.enCharacterWeaponData = window.enCharacterWeaponData || {};
window.jpCharacterWeaponData = window.jpCharacterWeaponData || {};
`
    );
  }
  if (kind === 'base_stats') {
    return (
      `window.basicStatsData = window.basicStatsData || {};
`
    );
  }
  return '';
}

function writePerCharacterBlock(filePath, kind, windowName, charKey, newObj) {
  let code;
  if (fs.existsSync(filePath)) {
    code = readText(filePath);
  } else {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    code = createPerCharacterSkeleton(kind);
  }

  const keyLiteral = JSON.stringify(charKey);
  const escapedKey = keyLiteral.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const assignRe = new RegExp(
    `(window\\.${windowName}\\s*\\[\\s*${escapedKey}\\s*]\\s*=\\s*)([\\s\\S]*?);`
  );
  const replacement = `$1${JSON.stringify(newObj, null, 2)};`;

  if (assignRe.test(code)) {
    code = code.replace(assignRe, replacement);
  } else {
    if (!code.endsWith('\n')) code += '\n';
    code += `window.${windowName}[${keyLiteral}] = ${JSON.stringify(newObj, null, 2)};\n`;
  }

  writeFile(filePath, code);
}

function buildRitualObjectFromExternal(external) {
  const out = {};
  const data = external?.data || {};
  if (data.name) out.name = data.name;
  // 외부 스키마가 data.skill.ascend_skill 또는 data.ascend_skill 둘 다 올 수 있으므로 둘 다 지원
  const skillRoot = data.skill || data;
  const asc = skillRoot.ascend_skill || [];
  for (let i = 0; i < asc.length && i < 7; i++) {
    const item = asc[i];
    if (!item) continue;
    out[`r${i}`] = item.name || '';
    out[`r${i}_detail`] = item.desc || '';
  }
  return out;
}

function updatePerCharacterRitual(lang, charKey, external) {
  const map = {
    kr: 'ritualData',
    en: 'enCharacterRitualData',
    jp: 'jpCharacterRitualData'
  };
  const windowName = map[lang];
  if (!windowName) {
    console.warn(`Unsupported lang for ritual update: ${lang}`);
    return;
  }
  const targetPath = path.join('data', 'characters', charKey, 'ritual.js');
  const payload = buildRitualObjectFromExternal(external);
  writePerCharacterBlock(targetPath, 'ritual', windowName, charKey, payload);
}

function buildSkillsObjectFromExternal(external) {
  const res = {};
  const data = external?.data || {};
  // 외부 스키마가 data.skill.* 또는 data.* 형태 둘 다 올 수 있으므로 통합 처리
  const skills = data.skill || data;
  const normal = Array.isArray(skills.normal_skill) ? skills.normal_skill : [];
  const syncNormal = Array.isArray(skills.sync_normal_skill) ? skills.sync_normal_skill : [];
  const assist = Array.isArray(skills.assist_skill) ? skills.assist_skill : [];
  const passive = Array.isArray(skills.passive_skill) ? skills.passive_skill : [];
  const theurgia = Array.isArray(skills.theurgia_skill) ? skills.theurgia_skill : [];
  const highlightRaw = skills.highlight_skill;
  const highlight = Array.isArray(highlightRaw)
    ? highlightRaw
    : (highlightRaw && typeof highlightRaw === 'object' ? [highlightRaw] : null);

  if (normal[0]) res.skill1 = applySyncNormalSkill(transformSkill(normal[0], { group: 'normal' }), normal[0], syncNormal[0]);
  if (normal[1]) res.skill2 = applySyncNormalSkill(transformSkill(normal[1], { group: 'normal' }), normal[1], syncNormal[1]);
  if (normal[2]) res.skill3 = applySyncNormalSkill(transformSkill(normal[2], { group: 'normal' }), normal[2], syncNormal[2]);

  if (assist[0]) res.skill_support = transformSkill(assist[0], { group: 'assist' });

  if (passive[0]) res.passive1 = transformSkill(passive[0], { group: 'passive' });
  if (passive[1]) res.passive2 = transformSkill(passive[1], { group: 'passive' });

  if (highlight && highlight[0]) {
    const hl = transformSkill(highlight[0], { group: 'highlight', removeName: true });
    res.skill_highlight = hl;
  }

  if (theurgia[0]) res.skill_highlight = transformSkill(theurgia[0], { group: 'theurgia', keepName: true });
  if (theurgia[1]) res.skill_highlight2 = transformSkill(theurgia[1], { group: 'theurgia', keepName: true });

  return res;
}

function updatePerCharacterSkills(lang, charKey, external) {
  const map = {
    kr: 'characterSkillsData',
    en: 'enCharacterSkillsData',
    jp: 'jpCharacterSkillsData'
  };
  const windowName = map[lang];
  if (!windowName) {
    console.warn(`Unsupported lang for skills update: ${lang}`);
    return;
  }
  const targetPath = path.join('data', 'characters', charKey, 'skill.js');
  const payload = buildSkillsObjectFromExternal(external);
  writePerCharacterBlock(targetPath, 'skill', windowName, charKey, payload);
}

function buildWeaponObjectFromExternal(externalWeapon) {
  const out = {};
  const wdata = externalWeapon?.data || {};
  const five = Array.isArray(wdata.fiveStar) ? wdata.fiveStar : [];
  const four = Array.isArray(wdata.fourStar) ? wdata.fourStar : [];

  if (five.length > 0) {
    five.forEach((w, idx) => {
      const keyName = `weapon5-${idx + 1}`;
      out[keyName] = {
        name: w?.name ?? '',
        health: w?.stat?.hp ?? undefined,
        attack: w?.stat?.attack ?? undefined,
        defense: w?.stat?.defense ?? undefined,
        skill_name: '',
        description: w?.skill ?? ''
      };
    });
  }

  if (four.length > 0) {
    four.forEach((w, idx) => {
      const keyName = `weapon4-${idx + 1}`;
      out[keyName] = {
        name: w?.name ?? '',
        health: w?.stat?.hp ?? undefined,
        attack: w?.stat?.attack ?? undefined,
        defense: w?.stat?.defense ?? undefined,
        skill_name: '',
        description: w?.skill ?? ''
      };
    });
  }

  return out;
}

function updatePerCharacterWeapon(lang, charKey, externalWeapon) {
  const map = {
    kr: 'WeaponData',
    en: 'enCharacterWeaponData',
    jp: 'jpCharacterWeaponData'
  };
  const windowName = map[lang];
  if (!windowName) {
    console.warn(`Unsupported lang for weapon update: ${lang}`);
    return;
  }
  const targetPath = path.join('data', 'characters', charKey, 'weapon.js');
  const payload = buildWeaponObjectFromExternal(externalWeapon);
  writePerCharacterBlock(targetPath, 'weapon', windowName, charKey, payload);
}

function buildBaseStatsObjectFromExternal(external, existing) {
  const out = (existing && typeof existing === 'object') ? { ...existing } : {};
  const data = external?.data || {};
  // API가 stats 또는 stat 이름 중 하나를 쓸 수 있으므로 둘 다 지원
  const stats = data.stats || data.stat || null;
  if (!stats) return out;
  const atk = parseSevenNumbers(stats['Attack']);
  const def = parseSevenNumbers(stats['Defense']);
  const hp = parseSevenNumbers(stats['HP']);
  if (!atk || !def || !hp) return out;

  for (let i = 0; i < 7; i++) {
    const key = `a${i}_lv80`;
    const cur = (out[key] && typeof out[key] === 'object') ? { ...out[key] } : {};
    cur.HP = hp[i];
    cur.attack = atk[i];
    cur.defense = def[i];
    out[key] = cur;
  }

  // stat_100 → a0_lv100 ~ a6_lv100
  const stat100 = data.stat_100 || data.stat100 || null;
  if (stat100) {
    const atk100 = parseSevenNumbers(stat100['Attack']);
    const def100 = parseSevenNumbers(stat100['Defense']);
    const hp100 = parseSevenNumbers(stat100['HP']);
    if (atk100 && def100 && hp100) {
      for (let i = 0; i < 7; i++) {
        const key100 = `a${i}_lv100`;
        const cur100 = (out[key100] && typeof out[key100] === 'object') ? { ...out[key100] } : {};
        cur100.HP = hp100[i];
        cur100.attack = atk100[i];
        cur100.defense = def100[i];
        out[key100] = cur100;
      }
    }
  }

  return out;
}

function updatePerCharacterBaseStats(charKey, external) {
  const targetPath = path.join('data', 'characters', charKey, 'base_stats.js');
  const existing = readPerCharacterBlock(targetPath, 'basicStatsData', charKey);
  const payload = buildBaseStatsObjectFromExternal(external, existing);
  writePerCharacterBlock(targetPath, 'base_stats', 'basicStatsData', charKey, payload);
}

async function main() {
  await ensureDepsLoaded();
  const { lang, code, only } = parseArgs();
  const mapping = loadCodenameMapping();
  const local = resolveLocalCodename(code, mapping);

  const extTarget = loadExternal(lang, local);

  // find character key via codename in target language data
  // - kr: data/character_info.js
  // - en/jp: data/character_info_glb.js
  // - others: data/{lang}/characters/characters.js
  // fallback: KR global data
  const charsPath = (lang === 'kr')
    ? path.join('data', 'character_info.js')
    : ((lang === 'en' || lang === 'jp')
      ? path.join('data', 'character_info_glb.js')
      : path.join('data', lang, 'characters', 'characters.js'));
  let key = null;
  if (fs.existsSync(charsPath)) {
    key = findCharacterKeyByCodename(charsPath, local);
  }
  if (!key && lang !== 'kr') {
    const alt = path.join('data', 'character_info.js');
    if (fs.existsSync(alt)) key = findCharacterKeyByCodename(alt, local);
  }
  if (!key) {
    console.error(`Character with codename ${local} not found in ${charsPath}`);
    process.exit(2);
  }

  // per-character 파일 4종만 갱신: ritual / skill / weapon / base_stats
  if (extTarget && extTarget.data) {
    // --only 가 없으면 전부, 있으면 해당 타입만 갱신
    const onlyBase =
      only === 'base_stats' || only === 'stat' || only === 'stats' || only === 'base';
    const onlySkill = only === 'skill' || only === 'skills';
    const onlyRitual = only === 'ritual';
    const onlyWeapon = only === 'weapon' || only === 'weapons';

    if (!only || onlyRitual) {
      updatePerCharacterRitual(lang, key, extTarget);
    }
    if (!only || onlySkill) {
      updatePerCharacterSkills(lang, key, extTarget);
    }
    if (!only || onlyBase) {
      updatePerCharacterBaseStats(key, extTarget);
    }
  } else {
    console.warn(`[warn] External character data missing or invalid for ${lang}:${local}`);
  }

  // 무기도 마찬가지로 --only 가 weapon(류)일 때만 갱신
  if (!only || only === 'weapon' || only === 'weapons') {
    const extWeapon = loadExternalWeapon(lang, local);
    if (extWeapon && extWeapon.data) {
      updatePerCharacterWeapon(lang, key, extWeapon);
    } else {
      console.warn(`[warn] External weapon data missing or invalid for ${lang}:${local}`);
    }
  }

  console.log(`Sync completed for ${lang}:${local} (key='${key}')`);
}

main();
