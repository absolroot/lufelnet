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
  } catch {}
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

// ---------- Helpers for language character files ----------
function resolveCharacterFile(lang, kind) {
  // kind: 'ritual' | 'skills' | 'weapon' | 'base_stats'
  const dir = path.join('data', lang, 'characters');
  const primary = path.join(dir, `character_${kind}.js`);
  const alt = path.join(dir, `_character_${kind}.js`);
  if (fs.existsSync(primary)) return primary;
  if (fs.existsSync(alt)) return alt;
  // 기본 경로(없으면 이후 fs.existsSync에서 필터됨)
  return primary;
}

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

function toNumberOrKeep(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : x;
}

function updateWeapons(lang, charKey, externalWeapon) {
  const targetPath = resolveCharacterFile(lang, 'weapon');
  if (!fs.existsSync(targetPath)) return;
  const code = readText(targetPath);
  const ast = parseAst(code);
  const top = findTopObject(ast);
  if (!top) return;
  let charProp = getProperty(top.obj, charKey);
  if (!charProp) {
    charProp = b.objectProperty(b.stringLiteral(charKey), b.objectExpression([]));
    top.obj.properties.push(charProp);
  }
  const charObj = charProp.value;

  const wdata = externalWeapon?.data || {};
  const five = Array.isArray(wdata.fiveStar) ? wdata.fiveStar : [];
  const four = Array.isArray(wdata.fourStar) ? wdata.fourStar : [];

  console.error(`::notice::[weapon] target=${targetPath} key='${charKey}' fiveStar=${five.length} fourStar=${four.length}`);

  // fiveStar -> weapon5-1, weapon5-2, ...
  if (five.length > 0) {
    five.forEach((w, idx) => {
      const keyName = `weapon5-${idx + 1}`;
      const beforeNode = getProperty(charObj, keyName)?.value;
      const before = beforeNode ? astLiteralToValue(beforeNode) : undefined;
      const payload = {
        name: w?.name ?? '',
        health: w?.stat?.hp !== undefined ? toNumberOrKeep(w.stat.hp) : undefined,
        attack: w?.stat?.attack !== undefined ? toNumberOrKeep(w.stat.attack) : undefined,
        defense: w?.stat?.defense !== undefined ? toNumberOrKeep(w.stat.defense) : undefined,
        skill_name: '',
        description: w?.skill ?? ''
      };
      setMergedObjectProp(charObj, keyName, payload);
      console.error(`::notice::[weapon] ${keyName} before=${before ? JSON.stringify(before) : 'null'} after=${JSON.stringify(payload)}`);
    });
  }

  // fourStar -> weapon4-1, weapon4-2, ... (1개여도 -1 사용)
  if (four.length > 0) {
    four.forEach((w, idx) => {
      const keyName = `weapon4-${idx + 1}`;
      const beforeNode = getProperty(charObj, keyName)?.value;
      const before = beforeNode ? astLiteralToValue(beforeNode) : undefined;
      const payload = {
        name: w?.name ?? '',
        health: w?.stat?.hp !== undefined ? toNumberOrKeep(w.stat.hp) : undefined,
        attack: w?.stat?.attack !== undefined ? toNumberOrKeep(w.stat.attack) : undefined,
        defense: w?.stat?.defense !== undefined ? toNumberOrKeep(w.stat.defense) : undefined,
        skill_name: '',
        description: w?.skill ?? ''
      };
      setMergedObjectProp(charObj, keyName, payload);
      console.error(`::notice::[weapon] ${keyName} before=${before ? JSON.stringify(before) : 'null'} after=${JSON.stringify(payload)}`);
    });
  }

  const output = recast.print(ast).code;
  writeFile(targetPath, output);
}

// ---------- Per-character unified writers (ritual/skill/weapon) ----------
function readLangEntry(filePath, varName, charKey) {
  if (!fs.existsSync(filePath)) return {};
  const code = readText(filePath);
  const ast = parseAst(code);
  const holder = findObjectByVarName(ast, varName) || findTopObject(ast);
  if (!holder) return {};
  const prop = getProperty(holder.obj, charKey);
  if (!prop || !prop.value) return {};
  const val = astLiteralToValue(prop.value);
  return (val && typeof val === 'object') ? val : {};
}

function writePerCharacterUnified(charKey) {
  const root = path.join('data', 'characters', charKey);
  fs.mkdirSync(root, { recursive: true });

  const krRitual = readLangEntry(resolveCharacterFile('kr', 'ritual'), 'ritualData', charKey);
  const enRitual = readLangEntry(resolveCharacterFile('en', 'ritual'), 'enCharacterRitualData', charKey);
  const jpRitual = readLangEntry(resolveCharacterFile('jp', 'ritual'), 'jpCharacterRitualData', charKey);

  const krSkills = readLangEntry(resolveCharacterFile('kr', 'skills'), 'characterSkillsData', charKey);
  const enSkills = readLangEntry(resolveCharacterFile('en', 'skills'), 'enCharacterSkillsData', charKey);
  const jpSkills = readLangEntry(resolveCharacterFile('jp', 'skills'), 'jpCharacterSkillsData', charKey);

  const krWeapon = readLangEntry(resolveCharacterFile('kr', 'weapon'), 'WeaponData', charKey);
  const enWeapon = readLangEntry(resolveCharacterFile('en', 'weapon'), 'enCharacterWeaponData', charKey);
  const jpWeapon = readLangEntry(resolveCharacterFile('jp', 'weapon'), 'jpCharacterWeaponData', charKey);

  // ritual.js
  const ritualJs =
`window.ritualData = window.ritualData || {};
window.enCharacterRitualData = window.enCharacterRitualData || {};
window.jpCharacterRitualData = window.jpCharacterRitualData || {};
window.ritualData[${JSON.stringify(charKey)}] = ${JSON.stringify(krRitual || {}, null, 2)};
window.enCharacterRitualData[${JSON.stringify(charKey)}] = ${JSON.stringify((Object.keys(enRitual || {}).length ? enRitual : krRitual) || {}, null, 2)};
window.jpCharacterRitualData[${JSON.stringify(charKey)}] = ${JSON.stringify((Object.keys(jpRitual || {}).length ? jpRitual : krRitual) || {}, null, 2)};
`;
  writeFile(path.join(root, 'ritual.js'), ritualJs);

  // skill.js
  const skillJs =
`window.characterSkillsData = window.characterSkillsData || {};
window.enCharacterSkillsData = window.enCharacterSkillsData || {};
window.jpCharacterSkillsData = window.jpCharacterSkillsData || {};
window.characterSkillsData[${JSON.stringify(charKey)}] = ${JSON.stringify(krSkills || {}, null, 2)};
window.enCharacterSkillsData[${JSON.stringify(charKey)}] = ${JSON.stringify((Object.keys(enSkills || {}).length ? enSkills : krSkills) || {}, null, 2)};
window.jpCharacterSkillsData[${JSON.stringify(charKey)}] = ${JSON.stringify((Object.keys(jpSkills || {}).length ? jpSkills : krSkills) || {}, null, 2)};
`;
  writeFile(path.join(root, 'skill.js'), skillJs);

  // weapon.js
  const weaponJs =
`window.WeaponData = window.WeaponData || {};
window.enCharacterWeaponData = window.enCharacterWeaponData || {};
window.jpCharacterWeaponData = window.jpCharacterWeaponData || {};
window.WeaponData[${JSON.stringify(charKey)}] = ${JSON.stringify(krWeapon || {}, null, 2)};
window.enCharacterWeaponData[${JSON.stringify(charKey)}] = ${JSON.stringify((Object.keys(enWeapon || {}).length ? enWeapon : krWeapon) || {}, null, 2)};
window.jpCharacterWeaponData[${JSON.stringify(charKey)}] = ${JSON.stringify((Object.keys(jpWeapon || {}).length ? jpWeapon : krWeapon) || {}, null, 2)};
`;
  writeFile(path.join(root, 'weapon.js'), weaponJs);
}

function updateRitual(lang, charKey, external) {
  const ritualPath = path.join('data', lang, 'characters', 'character_ritual.js');
  if (!fs.existsSync(ritualPath)) return;
  const code = readText(ritualPath);
  const ast = parseAst(code);
  const top = findTopObject(ast);
  if (!top) return;
  let charProp = getProperty(top.obj, charKey);
  if (!charProp) {
    charProp = b.objectProperty(b.stringLiteral(charKey), b.objectExpression([]));
    top.obj.properties.push(charProp);
  }
  const charObj = charProp.value;
  if (external?.data?.name) setStringProp(charObj, 'name', external.data.name);
  const asc = external?.data?.skill?.ascend_skill || [];
  for (let i = 0; i < asc.length && i < 7; i++) {
    const item = asc[i];
    if (!item) continue;
    setStringProp(charObj, `r${i}`, item.name || '');
    setStringProp(charObj, `r${i}_detail`, item.desc || '');
  }
  const output = recast.print(ast).code;
  writeFile(ritualPath, output);
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

function updateSkills(lang, charKey, external) {
  const skillsPath = path.join('data', lang, 'characters', 'character_skills.js');
  if (!fs.existsSync(skillsPath)) return;
  const code = readText(skillsPath);
  const ast = parseAst(code);
  const top = findTopObject(ast);
  if (!top) return;
  let charProp = getProperty(top.obj, charKey);
  if (!charProp) {
    charProp = b.objectProperty(b.stringLiteral(charKey), b.objectExpression([]));
    top.obj.properties.push(charProp);
  }
  const charObj = charProp.value;

  const skills = external?.data?.skill || {};
  const normal = Array.isArray(skills.normal_skill) ? skills.normal_skill : [];
  const assist = Array.isArray(skills.assist_skill) ? skills.assist_skill : [];
  const passive = Array.isArray(skills.passive_skill) ? skills.passive_skill : [];
  const theurgia = Array.isArray(skills.theurgia_skill) ? skills.theurgia_skill : [];
  const highlightRaw = skills.highlight_skill;
  const highlight = Array.isArray(highlightRaw)
    ? highlightRaw
    : (highlightRaw && typeof highlightRaw === 'object' ? [highlightRaw] : null);

  // normal_skill -> skill1/2/3
  if (normal[0]) setMergedObjectProp(charObj, 'skill1', transformSkill(normal[0], { group: 'normal' }));
  if (normal[1]) setMergedObjectProp(charObj, 'skill2', transformSkill(normal[1], { group: 'normal' }));
  if (normal[2]) setMergedObjectProp(charObj, 'skill3', transformSkill(normal[2], { group: 'normal' }));

  // assist_skill -> skill_support (element = 버프)
  if (assist[0]) setMergedObjectProp(charObj, 'skill_support', transformSkill(assist[0], { group: 'assist' }));

  // passive_skill -> passive1/2 (element = 패시브)
  if (passive[0]) setMergedObjectProp(charObj, 'passive1', transformSkill(passive[0], { group: 'passive' }));
  if (passive[1]) setMergedObjectProp(charObj, 'passive2', transformSkill(passive[1], { group: 'passive' }));

  // highlight_skill -> skill_highlight (remove name)
  if (highlight && highlight[0]) {
    const hl = transformSkill(highlight[0], { group: 'highlight', removeName: true });
    setMergedObjectProp(charObj, 'skill_highlight', hl);
  }

  // theurgia_skill -> skill_highlight[/2] (keep name)
  if (theurgia[0]) setMergedObjectProp(charObj, 'skill_highlight', transformSkill(theurgia[0], { group: 'theurgia', keepName: true }));
  if (theurgia[1]) setMergedObjectProp(charObj, 'skill_highlight2', transformSkill(theurgia[1], { group: 'theurgia', keepName: true }));

  const output = recast.print(ast).code;
  writeFile(skillsPath, output);
}

function parseSevenNumbers(s) {
  if (!s || typeof s !== 'string') return null;
  const parts = s.split('/').map((p) => parseFloat(String(p).trim()));
  if (parts.length !== 7 || parts.some((n) => Number.isNaN(n))) return null;
  return parts;
}

function updateBaseStatsKR(charKey, external) {
  const basePath = resolveCharacterFile('kr', 'base_stats');
  if (!fs.existsSync(basePath)) return;
  const code = readText(basePath);
  const ast = parseAst(code);
  const top = findTopObject(ast);
  if (!top) return;
  let charProp = getProperty(top.obj, charKey);
  if (!charProp) {
    charProp = b.objectProperty(b.stringLiteral(charKey), b.objectExpression([]));
    top.obj.properties.push(charProp);
  }
  const charObj = charProp.value;
  const stats = external?.data?.stats || null;
  if (stats) {
    const atk = parseSevenNumbers(stats['Attack']);
    const def = parseSevenNumbers(stats['Defense']);
    const hp = parseSevenNumbers(stats['HP']);
    if (atk && def && hp) {
      for (let i = 0; i < 7; i++) {
        const key = `a${i}_lv80`;
        const objProp = ensureObjectProperty(charObj, key);
        const v = objProp.value && objProp.value.type === 'ObjectExpression' ? objProp.value : b.objectExpression([]);
        objProp.value = v;
        setObjectProp(v, 'HP', hp[i]);
        setObjectProp(v, 'attack', atk[i]);
        setObjectProp(v, 'defense', def[i]);
      }
      // 신규 구조: data/characters/<캐릭터명>/base_stats.js 생성/갱신
      try {
        // KR 통합 파일에 존재하는 구조(a0_lv1, awake7 등)는 그대로 두고,
        // a0_lv80~a6_lv80 값만 외부 스탯으로 갱신한 뒤 그대로 per-character로 복사한다.
        const outObjRaw = astLiteralToValue(charObj);
        const outObj = (outObjRaw && typeof outObjRaw === 'object') ? outObjRaw : {};
        const destDir = path.join('data', 'characters', charKey);
        fs.mkdirSync(destDir, { recursive: true });
        const destFile = path.join(destDir, 'base_stats.js');
        const content =
`window.basicStatsData = window.basicStatsData || {};
window.basicStatsData[${JSON.stringify(charKey)}] = ${JSON.stringify(outObj, null, 2)};
`;
        fs.writeFileSync(destFile, content, 'utf8');
        console.error(`::notice::[base_stats] wrote per-character stats → ${destFile}`);
      } catch (e) {
        console.error(`::warning::[base_stats] failed to write per-character stats for ${charKey}:`, e?.message || e);
      }
    }
  }
  const output = recast.print(ast).code;
  writeFile(basePath, output);
}

function updateNamesKR(local, key, nameMap) {
  const krCharsPath = path.join('data', 'kr', 'characters', 'characters.js');
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

async function main() {
  await ensureDepsLoaded();
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

  // Update weapon (best-effort, independant of character data)
  const extWeapon = loadExternalWeapon(lang, local);
  if (extWeapon && extWeapon.data) {
    updateWeapons(lang, key, extWeapon);
  } else {
    console.warn(`[warn] Skip weapon update for ${lang}:${local} due to null data`);
  }

  // Names enrichment from multiple languages (best-effort)
  const extEN = loadExternalSilent('en', local);
  const extJP = loadExternalSilent('jp', local);
  const extCN = loadExternalSilent('cn', local);
  const extTW = loadExternalSilent('tw', local);
  const nameMap = {
    en: extEN?.data?.name || null,
    jp: extJP?.data?.name || null,
    cn: extCN?.data?.name || null,
    tw: extTW?.data?.name || null
  };
  updateNamesKR(local, key, nameMap);

  // Per-character unified ritual/skill/weapon files
  try {
    writePerCharacterUnified(key);
    console.error(`::notice::[per-character] wrote ritual/skill/weapon for '${key}'`);
  } catch (e) {
    console.error(`::warning::[per-character] failed to write unified files for ${key}:`, e?.message || e);
  }

  console.log(`Sync completed for ${lang}:${local} (key='${key}')`);
}

main();


