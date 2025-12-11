#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import process from 'process';
import { execSync } from 'child_process';

// ---------- recast / parser (for character key 탐색) ----------
let recast = null;
let babelParser = null;

async function ensureDepsLoaded() {
  async function tryLoad() {
    try {
      // eslint-disable-next-line no-undef
      const r = await import('recast');
      // eslint-disable-next-line no-undef
      const bp = await import('@babel/parser');
      recast = r.default || r;
      babelParser = bp;
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

// ---------- Basic FS helpers ----------
function readJSON(filePath) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(txt);
  } catch {
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

// ---------- CLI args & mapping ----------
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
  if (!['kr', 'jp', 'en', 'cn'].includes(out.lang)) {
    console.error('Invalid --lang (kr/jp/en/cn)');
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
  const byLocal = mapping.find(
    (m) => String(m.local).toUpperCase() === String(inputCode).toUpperCase()
  );
  if (byLocal) return byLocal.local;
  // by api
  const byApi = mapping.find(
    (m) => String(m.api).toLowerCase() === String(inputCode).toLowerCase()
  );
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

// ---------- character key helpers (AST) ----------

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
      if (
        init &&
        init.type === 'ObjectExpression' &&
        p.parent &&
        p.parent.node.type === 'VariableDeclaration'
      ) {
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
    },
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

function findElementForCharKey(filePath, charKey) {
  if (!fs.existsSync(filePath)) return null;
  const code = readText(filePath);
  const ast = parseAst(code);
  const holder = findObjectByVarName(ast, 'characterData') || findTopObject(ast);
  if (!holder) return null;
  const props = holder.obj.properties;
  for (const p of props) {
    if (p.value && p.value.type === 'ObjectExpression') {
      const key = getLiteralKey(p.key);
      if (key !== charKey) continue;
      const sub = p.value;
      const elProp = getProperty(sub, 'element');
      if (
        elProp &&
        elProp.value &&
        (elProp.value.type === 'StringLiteral' || elProp.value.type === 'Literal')
      ) {
        return elProp.value.value;
      }
      break;
    }
  }
  return null;
}

function findCharacterKeyByCodename(filePath, localCodename) {
  const code = readText(filePath);
  const ast = parseAst(code);
  const holder = findObjectByVarName(ast, 'characterData') || findTopObject(ast);
  if (!holder) return null;
  const props = holder.obj.properties;
  for (const p of props) {
    if (p.value && p.value.type === 'ObjectExpression') {
      const sub = p.value;
      const codeProp = getProperty(sub, 'codename');
      if (codeProp && codeProp.value && codeProp.value.type === 'StringLiteral') {
        if (
          String(codeProp.value.value).toUpperCase() === String(localCodename).toUpperCase()
        ) {
          return getLiteralKey(p.key);
        }
      }
    }
  }
  return null;
}

// ---------- innate.js helpers ----------

function readInnateFile(filePath, charKey) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const keyLiteral = JSON.stringify(charKey);
    const escapedKey = keyLiteral.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      String.raw`window\.innateData\s*\[\s*${escapedKey}\s*]\s*=\s*([\s\S]*?);`
    );
    const m = code.match(re);
    if (!m || !m[1]) return {};
    const objSource = m[1].trim();
    // 평가 가능한 JS 객체로 처리 (기존 파일 구조 유지)
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${objSource});`);
    const parsed = fn();
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    console.error(`::warning::failed to read innate.js for ${charKey}:`, e?.message || e);
    return {};
  }
}

function writeInnateFile(filePath, charKey, obj) {
  const content =
`window.innateData = window.innateData || {};
window.innateData[${JSON.stringify(charKey)}] = ${JSON.stringify(obj, null, 4)};
`;
  writeFile(filePath, content);
}

// ---------- transform helpers ----------

function getLangFieldNames(lang) {
  if (lang === 'kr') {
    return { nameField: 'name', descField: 'desc' };
  }
  return { nameField: `name_${lang}`, descField: `desc_${lang}` };
}

// 속성 매칭 테이블 (KR 기준 → EN/JP)
const ELEMENT_TABLE = {
  '만능': { en: 'Almighty', jp: '万能' },
  '물리': { en: 'Physical', jp: '物理' },
  '총격': { en: 'Gun', jp: '銃撃' },
  '화염': { en: 'Fire', jp: '火炎' },
  '빙결': { en: 'Ice', jp: '氷結' },
  '전격': { en: 'Electric', jp: '電撃' },
  '질풍': { en: 'Wind', jp: '疾風' },
  '염동': { en: 'Psychokinesis', jp: '念動' },
  '핵열': { en: 'Nuclear', jp: '核熱' },
  '축복': { en: 'Bless', jp: '祝福' },
  '주원': { en: 'Curse', jp: '呪怨' }
};

// nature(영문) → KR 속성명
const NATURE_TO_ELEMENT_KR = {
  Ice: '빙결',
  Elec: '전격',
  Electric: '전격',
  Fire: '화염',
  Wind: '질풍',
  Nuclear: '핵열',
  Nuke: '핵열',
  Psy: '염동',
  Psychokinesis: '염동',
  Bless: '축복',
  Curse: '주원',
  Phys: '물리',
  Physical: '물리',
  Gun: '총격',
  Almighty: '만능'
};

function resolveElementLabels(nature, elementKR) {
  const kr = elementKR || NATURE_TO_ELEMENT_KR[nature] || null;
  if (!kr) return null;
  const base = ELEMENT_TABLE[kr] || {};
  const en = base.en || nature || '';
  const jp = base.jp || '';
  return { kr, en, jp };
}

function updateInnateAwake(existing, externalArr, lang) {
  const out = Array.isArray(existing) ? existing.slice() : [];
  const { nameField, descField } = getLangFieldNames(lang);
  const allNameKeys = ['name', 'name_en', 'name_jp', 'name_cn'];
  const allDescKeys = ['desc', 'desc_en', 'desc_jp', 'desc_cn'];

  if (!Array.isArray(externalArr) || externalArr.length === 0) {
    return out;
  }

  for (let i = 0; i < externalArr.length; i++) {
    const ext = externalArr[i] || {};
    let cur = out[i];
    if (!cur || typeof cur !== 'object') {
      // 새로 만드는 경우: 기본 골격만 채우고 나머지는 비워둔다
      cur = {
        ascend: ext.ascend != null ? String(ext.ascend) : '0',
        autoSelect: 'Default',
        cooldown: typeof ext.cooldown === 'number' ? ext.cooldown : 0,
        cost: typeof ext.cost === 'string' ? ext.cost : '',
        level: ext.level != null ? String(ext.level) : '1',
        nature: ext.nature != null ? ext.nature : null,
        type: '패시브'
      };
    }

    // 언어별 name/desc 덮어쓰기
    if (ext.name != null) {
      cur[nameField] = ext.name;
    } else if (!(nameField in cur)) {
      cur[nameField] = '';
    }

    // 모든 언어 필드가 존재하도록 보정 (없으면 공백으로 생성)
    for (const k of allNameKeys) {
      if (!(k in cur)) cur[k] = '';
    }
    for (const k of allDescKeys) {
      if (!(k in cur)) cur[k] = '';
    }

    if (ext.desc != null) {
      cur[descField] = ext.desc;
    } else if (!(descField in cur)) {
      cur[descField] = '';
    }

    out[i] = cur;
  }

  return out;
}

function normalizeFinalInnate(finalArr, element) {
  const allDescKeys = ['desc', 'desc_en', 'desc_jp', 'desc_cn'];

  function buildAutoDesc(attr, nature, labels) {
    if (!labels) return null;
    const { kr, en, jp } = labels;
    if (!kr || !en || !jp) return null;

    // attr 패턴 판별
    let kind = null;
    if (attr === 'Final Damage Mult.') {
      kind = 'finalDamage';
    } else if (attr && /Boost$/.test(attr)) {
      kind = 'damageBoost';
    } else if (attr && /Damage Taken$/.test(attr)) {
      kind = 'damageTaken';
    }
    if (!kind) return null;

    if (kind === 'finalDamage') {
      return {
        desc: `모든 아군의 ${kr} 최종 대미지 증가`,
        desc_en: `All allies' ${en} Final Damage Increase`,
        desc_jp: `味方全員の${jp}最終ダメージ上昇`
      };
    }
    if (kind === 'damageBoost') {
      return {
        desc: `모든 아군의 ${kr} 대미지 보너스 증가`,
        desc_en: `All allies' ${en} DMG Bonus(ATK Mult) Increase`,
        desc_jp: `味方全員の${jp}攻撃倍率+上昇`
      };
    }
    if (kind === 'damageTaken') {
      return {
        desc: `모든 아군의 ${kr} 받는 대미지 감소`,
        desc_en: `All allies' ${en} DMG Taken Decrease`,
        desc_jp: `味方全員の${jp}ダメージ受ける減少`
      };
    }
    return null;
  }

  const normEntry = (entry) => {
    const e = entry && typeof entry === 'object' ? { ...entry } : {};
    // desc 계열 필드 보정
    for (const k of allDescKeys) {
      if (!(k in e)) e[k] = '';
    }
    // type 이 없으면 캐릭터 element로 설정
    if (!('type' in e) && element) {
      e.type = element;
    }

    // 템플릿으로 desc/desc_en/desc_jp 자동 채우기 (해당 필드가 비어 있을 때만)
    const labels = resolveElementLabels(e.nature, element);
    const auto = buildAutoDesc(e.attr, e.nature, labels);
    if (auto) {
      if (!e.desc) e.desc = auto.desc;
      if (!e.desc_en) e.desc_en = auto.desc_en;
      if (!e.desc_jp) e.desc_jp = auto.desc_jp;
    }
    return e;
  };

  if (!Array.isArray(finalArr)) return [];
  return finalArr.map((group) => {
    if (!Array.isArray(group)) return [];
    return group.map((entry) => normEntry(entry));
  });
}

// ---------- main ----------

async function main() {
  await ensureDepsLoaded();

  const { lang, code } = parseArgs();
  const mapping = loadCodenameMapping();
  const local = resolveLocalCodename(code, mapping);

  const ext = loadExternal(lang, local);
  if (!ext || !ext.data) {
    console.error(`[error] external innate data missing for ${lang}:${local}`);
    process.exit(2);
  }

  const data = ext.data || {};
  const finalInnateExt = Array.isArray(data.final_innate) ? data.final_innate : [];
  const innateAwakeExt =
    data.skill && Array.isArray(data.skill.innate_awake_skill)
      ? data.skill.innate_awake_skill
      : [];

  // character.js에서 실제 캐릭터 key 찾기 (없으면 local을 fallback으로 사용)
  let charKey = null;
  // 우선 KR characters.js 기준으로 키를 찾는다 (실제 per-character 디렉토리 키와 일치)
  const krCharsPath = path.join('data', 'kr', 'characters', 'characters.js');
  if (fs.existsSync(krCharsPath)) {
    charKey = findCharacterKeyByCodename(krCharsPath, local);
  }
  // 그 다음 현재 언어 characters.js에서도 시도 (혹시 다르게 정의된 경우)
  if (!charKey) {
    const charsPath = path.join('data', lang, 'characters', 'characters.js');
    if (fs.existsSync(charsPath)) {
      charKey = findCharacterKeyByCodename(charsPath, local);
    }
  }
  if (!charKey) {
    console.warn(
      `::warning::character key for '${local}' not found in KR/${lang} characters.js, fallback to local`
    );
    charKey = local;
  }

  // 캐릭터 속성(element) 조회 (KR 기준)
  const element =
    krCharsPath && fs.existsSync(krCharsPath)
      ? findElementForCharKey(krCharsPath, charKey)
      : null;

  const innatePath = path.join('data', 'characters', charKey, 'innate.js');

  // 기존 innate.js 읽기 (없으면 빈 객체에서 시작)
  const current = readInnateFile(innatePath, charKey);
  const next = current && typeof current === 'object' ? { ...current } : {};

  // 1) final_innate 는 외부 데이터로 덮어쓰되,
  //    desc/desc_en/desc_jp/desc_cn 필드를 모두 보정하고 type 은 캐릭터 element 로 자동 설정
  next.final_innate = normalizeFinalInnate(finalInnateExt, element);

  // 2) innate_awake_skill 은 언어별 name/desc만 덮어쓰기
  next.innate_awake_skill = updateInnateAwake(next.innate_awake_skill, innateAwakeExt, lang);

  writeInnateFile(innatePath, charKey, next);

  console.log(
    `syncInnate completed for ${lang}:${local} (charKey='${charKey}', file='${innatePath}')`
  );
}

main().catch((e) => {
  console.error('[fatal] syncInnate failed:', e?.stack || e?.message || e);
  process.exit(1);
});


