#!/usr/bin/env node

/**
 * persona.js -> data/persona/* 마이그레이션 스크립트
 *
 * 1) 기존 data/kr/wonder/persona.js 의 personaData 를 불러와서
 *    각 페르소나(KR 이름)별로 data/persona/<KR이름>.js 파일을 생성한다.
 *
 * 2) 각 페르소나 파일에는:
 *    - 기본 메타 (id, name/name_en/name_jp, grade, star, position, element, event, best_persona, wild_emblem_rainbow, cost, combination, comment 등)
 *    - passive_skill: external/persona/{kr,en,jp}/<id>.json 의 passive_skill 을 통합
 *        - 항목 구조: { name, name_en, name_jp, desc, desc_en, desc_jp }
 *        - en/jp 데이터가 없으면 빈 문자열, 단 기존 persona.js 의 instinct/instinct2 번역이 있으면 그걸 보존 시도
 *    - uniqueSkill: fixed_skill 을 기반으로 { name, name_en, name_jp, desc, desc_en, desc_jp, priority, icon, icon_gl }
 *    - highlight: showtime_skill 을 기반으로 { name, name_en, name_jp, desc, desc_en, desc_jp, priority }
 *
 * 3) 기존 persona.js 는 수정하지 않는다.
 *
 * 4) 각 JS 파일 포맷:
 *      window.personaFiles = window.personaFiles || {};
 *      window.personaFiles["야노식"] = { ... };
 *
 *    → 나중에 새로운 로더에서 활용할 수 있도록 글로벌 맵에 쌓는 형태로 만든다.
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

const OLD_PERSONA_PATH = path.join(PROJECT_ROOT, 'data', 'kr', 'wonder', 'persona.js');
const MAPPING_PATH = path.join(PROJECT_ROOT, 'data', 'external', 'persona', 'mapping.json');
const EXTERNAL_PERSONA_ROOT = path.join(PROJECT_ROOT, 'data', 'external', 'persona');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'data', 'persona');

function log(msg) {
  console.log(msg);
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readJsonIfExists(p) {
  try {
    if (!fs.existsSync(p)) return null;
    const txt = fs.readFileSync(p, 'utf8');
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

function loadPersonaData() {
  if (!fs.existsSync(OLD_PERSONA_PATH)) {
    throw new Error(`persona.js not found: ${OLD_PERSONA_PATH}`);
  }
  const code = fs.readFileSync(OLD_PERSONA_PATH, 'utf8');
  const sandbox = { module: {}, console };
  // persona.js 는 const personaData = {...}; 구조이므로, 마지막에 module.exports 로 노출
  const wrapped = `${code}\nmodule.exports = personaData;`;
  vm.runInNewContext(wrapped, sandbox, { filename: 'persona.js' });
  const personaData = sandbox.module.exports;
  if (!personaData || typeof personaData !== 'object') {
    throw new Error('Invalid personaData from persona.js');
  }
  return personaData;
}

function loadMapping() {
  const map = readJsonIfExists(MAPPING_PATH);
  if (!map || typeof map !== 'object') return {};
  return map;
}

function stripTierSuffix(name) {
  if (!name || typeof name !== 'string') return '';
  let s = name.trim();
  // 로마 숫자(ASCII) / 유니코드 로마 숫자 제거
  s = s.replace(/\s+[IVX]+$/u, '');
  s = s.replace(/[ⅠⅡⅢⅣⅤⅥⅦⅧⅨ]+$/gu, '');
  return s.trim();
}

function normalizeSpaces(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/\s+/g, ' ').trim();
}

function extractTierFromKr(name) {
  if (!name || typeof name !== 'string') return '';
  const s = name.trim();
  if (!s) return '';
  // 풀와이드 로마 숫자 맵
  const fwMap = {
    'Ⅰ': 'I',
    'Ⅱ': 'II',
    'Ⅲ': 'III',
    'Ⅳ': 'IV',
    'Ⅴ': 'V',
    'Ⅵ': 'VI',
    'Ⅶ': 'VII',
    'Ⅷ': 'VIII',
    'Ⅸ': 'IX'
  };
  const last = s[s.length - 1];
  if (fwMap[last]) return fwMap[last];
  // ASCII 로마 숫자 (공백 + I/V/X 조합)
  const m = s.match(/\s+([IVX]+)$/u);
  return m ? m[1] : '';
}

function splitBaseAndTier(name) {
  const raw = normalizeSpaces(name || '');
  if (!raw) return { base: '', compact: '', tier: '' };

  let base = raw;
  let tier = '';

  // 1) 풀와이드 로마 숫자 (ⅠⅡⅢⅣⅤⅥⅦⅧⅨ) 가 끝에 붙은 경우
  const fwMatch = raw.match(/(.*?)([ⅠⅡⅢⅣⅤⅥⅦⅧⅨ]+)$/u);
  if (fwMatch) {
    base = fwMatch[1].trim();
    tier = fwMatch[2].trim();
  } else {
    // 2) ASCII 로마 숫자 (I/V/X) 가 공백 뒤에 오는 경우: "XXX III"
    const asciiMatch = raw.match(/(.+?)\s+([IVX]+)$/u);
    if (asciiMatch) {
      base = asciiMatch[1].trim();
      tier = asciiMatch[2].trim();
    }
  }

  const compact = base.replace(/\s+/g, '');
  return { base, compact, tier };
}

function buildPassiveSkill(personaKey, persona, id, mapping) {
  const passives = [];

  if (!id) {
    // id 가 없으면 기존 instinct/instinct2 만 1~2개 패시브로 변환
    const instList = [];
    if (persona.instinct) instList.push(persona.instinct);
    if (persona.instinct2) instList.push(persona.instinct2);
    for (const inst of instList) {
      const desc = Array.isArray(inst.effects) ? inst.effects.join('\n') : (inst.effects || '');
      const desc_en = Array.isArray(inst.effects_en) ? inst.effects_en.join('\n') : (inst.effects_en || '');
      const desc_jp = Array.isArray(inst.effects_jp) ? inst.effects_jp.join('\n') : (inst.effects_jp || '');
      passives.push({
        name: inst.name || '',
        name_en: inst.name_en || '',
        name_jp: inst.name_jp || '',
        desc,
        desc_en,
        desc_jp
      });
    }
    return passives;
  }

  const krPath = path.join(EXTERNAL_PERSONA_ROOT, 'kr', `${id}.json`);
  const enPath = path.join(EXTERNAL_PERSONA_ROOT, 'en', `${id}.json`);
  const jpPath = path.join(EXTERNAL_PERSONA_ROOT, 'jp', `${id}.json`);

  const krJson = readJsonIfExists(krPath);
  const enJson = readJsonIfExists(enPath);
  const jpJson = readJsonIfExists(jpPath);

  const krArr = krJson?.data?.skill?.passive_skill || [];
  const enArr = enJson?.data?.skill?.passive_skill || [];
  const jpArr = jpJson?.data?.skill?.passive_skill || [];

  // instinct/instinct2 를 이름(티어 제거) 기준으로 매핑해서 번역/설명 fallback용으로 활용
  const instinctSources = [];
  if (persona.instinct) instinctSources.push(persona.instinct);
  if (persona.instinct2) instinctSources.push(persona.instinct2);
  const instinctEntries = [];
  for (const inst of instinctSources) {
    const { base, compact, tier } = splitBaseAndTier(inst.name || '');
    if (!base) continue;
    instinctEntries.push({ inst, base, compact, tier });
  }
  const singleInstinct = instinctEntries.length === 1 ? instinctEntries[0].inst : null;

  let matchedCount = 0;
  for (let i = 0; i < krArr.length; i += 1) {
    const k = krArr[i] || {};
    const e = enArr[i] || {};
    const j = jpArr[i] || {};

    const { base, compact, tier } = splitBaseAndTier(k.name || '');

    // 1순위: base/tier 완전 일치
    let inst = null;
    if (base) {
      inst = instinctEntries.find(
        (entry) =>
          entry.tier === tier &&
          (entry.base === base || entry.compact === compact)
      )?.inst || null;
    }

    // 2순위: tier 는 같고, base/compact 가 부분 문자열 관계 (누구에게나 vs 누구에게 같은 케이스)
    if (!inst && base) {
      const lcBase = base.toLowerCase();
      const lcCompact = compact.toLowerCase();
      inst =
        instinctEntries.find((entry) => {
          if (entry.tier !== tier) return false;
          const eb = entry.base.toLowerCase();
          const ec = entry.compact.toLowerCase();
          return (
            eb.includes(lcBase) ||
            lcBase.includes(eb) ||
            ec.includes(lcCompact) ||
            lcCompact.includes(ec)
          );
        })?.inst || null;
    }

    if (inst) matchedCount += 1;

    const descFromInst = (src, field) => {
      if (!src) return '';
      const v = src[field];
      if (Array.isArray(v)) return v.join('\n');
      return v || '';
    };

    const item = {
      name: k.name || (inst?.name || ''),
      name_en: e.name || (inst?.name_en || ''),
      name_jp: j.name || (inst?.name_jp || ''),
      desc: k.desc || descFromInst(inst, 'effects'),
      desc_en: e.desc || descFromInst(inst, 'effects_en'),
      desc_jp: j.desc || descFromInst(inst, 'effects_jp')
    };

    passives.push(item);
  }

  // 어떤 패시브도 instinct 와 매칭되지 않았고, instinct 가 1개뿐이면
  // 마지막 패시브에만 instinct 번역을 fallback 으로 채운다.
  if (matchedCount === 0 && singleInstinct && passives.length > 0) {
    const last = passives[passives.length - 1];
    const inst = singleInstinct;
    const descFromInst = (src, field) => {
      if (!src) return '';
      const v = src[field];
      if (Array.isArray(v)) return v.join('\n');
      return v || '';
    };
    if (!last.name_en && inst.name_en) last.name_en = inst.name_en;
    if (!last.name_jp && inst.name_jp) last.name_jp = inst.name_jp;
    if (!last.desc_en) last.desc_en = descFromInst(inst, 'effects_en');
    if (!last.desc_jp) last.desc_jp = descFromInst(inst, 'effects_jp');
  }

  // 완전히 동일한 패시브(이름/설명/번역 모두 동일)는 1개만 남기고 제거
  const unique = [];
  const isSame = (a, b) =>
    a.name === b.name &&
    a.name_en === b.name_en &&
    a.name_jp === b.name_jp &&
    a.desc === b.desc &&
    a.desc_en === b.desc_en &&
    a.desc_jp === b.desc_jp;

  for (const p of passives) {
    if (!unique.some(u => isSame(u, p))) {
      unique.push(p);
    }
  }

  // name_en / name_jp 의 로마자 형식만, 마지막 오브젝트를 참고해 채워준다 (설명은 복사하지 않음)
  if (unique.length > 0) {
    // 뒤에서부터 name_en/name_jp 가 존재하는 기준 패시브를 찾는다
    let ref = null;
    for (let i = unique.length - 1; i >= 0; i -= 1) {
      if (unique[i].name_en || unique[i].name_jp) {
        ref = unique[i];
        break;
      }
    }
    if (ref && (ref.name_en || ref.name_jp)) {
      const { base: refBaseEn } = splitBaseAndTier(ref.name_en || '');
      const { base: refBaseJp, tier: refTierJp } = splitBaseAndTier(ref.name_jp || '');
      unique.forEach((p) => {
        if (!p.name) return;
        const tier = extractTierFromKr(p.name);
        // EN 이름 보정
        if (!p.name_en && refBaseEn) {
          p.name_en = tier ? `${refBaseEn} ${tier}` : refBaseEn;
        }
        // JP 이름 보정
        if (!p.name_jp && refBaseJp) {
          if (!tier) {
            p.name_jp = refBaseJp;
          } else {
            // ref 가 풀와이드 로마 숫자를 쓰고 있다면 동일 스타일로 변환
            let outTier = tier;
            let join = ' ';
            if (refTierJp && /[ⅠⅡⅢⅣⅤⅥⅦⅧⅨ]/u.test(refTierJp)) {
              const asciiToFw = {
                I: 'Ⅰ',
                II: 'Ⅱ',
                III: 'Ⅲ',
                IV: 'Ⅳ',
                V: 'Ⅴ',
                VI: 'Ⅵ',
                VII: 'Ⅶ',
                VIII: 'Ⅷ',
                IX: 'Ⅸ'
              };
              outTier = asciiToFw[tier] || tier;
              // 풀와이드 스타일은 보통 공백 없이 붙인다
              join = '';
            }
            p.name_jp = `${refBaseJp}${join}${outTier}`;
          }
        }
      });
    }
  }

  // external KR 도 없고 instinct 만 있는 경우는 위에서 이미 처리함
  return unique;
}

function buildSkillBlock(kind, persona, id) {
  // kind: 'unique' -> fixed_skill, 'highlight' -> showtime_skill
  if (!id) {
    // id 가 없으면 기존 persona.js 데이터로만 구성
    if (kind === 'unique' && persona.uniqueSkill) {
      const u = persona.uniqueSkill;
      return {
        name: u.name || '',
        name_en: u.name_en || '',
        name_jp: u.name_jp || '',
        desc: u.effect || '',
        desc_en: u.effect_en || '',
        desc_jp: u.effect_jp || '',
        priority: u.priority ?? 0,
        icon: u.icon || '',
        icon_gl: u.icon_gl || ''
      };
    }
    if (kind === 'highlight' && persona.highlight) {
      const h = persona.highlight;
      return {
        name: h.name || 'HIGHLIGHT',
        name_en: h.name_en || 'HIGHLIGHT',
        name_jp: h.name_jp || 'HIGHLIGHT',
        desc: h.effect || '',
        desc_en: h.effect_en || '',
        desc_jp: h.effect_jp || '',
        priority: h.priority ?? 0
      };
    }
    return null;
  }

  const krPath = path.join(EXTERNAL_PERSONA_ROOT, 'kr', `${id}.json`);
  const enPath = path.join(EXTERNAL_PERSONA_ROOT, 'en', `${id}.json`);
  const jpPath = path.join(EXTERNAL_PERSONA_ROOT, 'jp', `${id}.json`);

  const krJson = readJsonIfExists(krPath);
  const enJson = readJsonIfExists(enPath);
  const jpJson = readJsonIfExists(jpPath);

  const krSkillRoot = krJson?.data?.skill || {};
  const enSkillRoot = enJson?.data?.skill || {};
  const jpSkillRoot = jpJson?.data?.skill || {};

  const legacy = kind === 'unique' ? (persona.uniqueSkill || {}) : (persona.highlight || {});

  let k = null;
  let e = null;
  let j = null;

  if (kind === 'unique') {
    k = krSkillRoot.fixed_skill || null;
    e = enSkillRoot.fixed_skill || null;
    j = jpSkillRoot.fixed_skill || null;
  } else {
    k = krSkillRoot.showtime_skill || null;
    e = enSkillRoot.showtime_skill || null;
    j = jpSkillRoot.showtime_skill || null;
  }

  // KR 은 external 을 우선, fallback 으로 legacy effect/name
  const name = k?.name || legacy.name || (kind === 'highlight' ? 'HIGHLIGHT' : '');
  const desc = k?.desc || legacy.effect || '';

  // EN/JP: external 이 없으면 legacy 번역 보존
  const name_en = (e && e.name) || legacy.name_en || '';
  const name_jp = (j && j.name) || legacy.name_jp || '';
  const desc_en = (e && e.desc) || legacy.effect_en || '';
  const desc_jp = (j && j.desc) || legacy.effect_jp || '';

  const base = {
    name,
    name_en,
    name_jp,
    desc,
    desc_en,
    desc_jp,
    priority: legacy.priority ?? 0
  };

  if (kind === 'unique') {
    return {
      ...base,
      icon: legacy.icon || '',
      icon_gl: legacy.icon_gl || ''
    };
  }
  return base;
}

function resolveIdForPersona(nameKr, persona, mapping) {
  // 1) persona.js 안에 id 가 있으면 우선 사용
  if (persona.id) return String(persona.id);

  // 2) mapping.json 에서 name_kr 매칭
  for (const [id, rec] of Object.entries(mapping)) {
    if (rec && rec.name_kr === nameKr) return id;
  }
  return null;
}

function main() {
  const personaData = loadPersonaData();
  const mapping = loadMapping();

  // 기존 생성물 전체 삭제 후 재생성
  try {
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
  } catch (_) {
    // ignore
  }
  ensureDir(OUTPUT_DIR);

  let count = 0;
  let missingExternal = 0;

  for (const [nameKr, persona] of Object.entries(personaData)) {
    const id = resolveIdForPersona(nameKr, persona, mapping);
    if (!id) {
      missingExternal += 1;
    }

    const meta = {
      id: id || null,
      key: nameKr,
      name: nameKr,
      name_en: persona.name_en || (mapping[id]?.name_en || ''),
      name_jp: persona.name_jp || (mapping[id]?.name_jp || ''),
      grade: persona.grade || '',
      star: persona.star || '',
      position: persona.position || '',
      element: persona.element || '',
      event: !!persona.event,
      wild_emblem_rainbow: !!persona.wild_emblem_rainbow,
      best_persona: !!persona.best_persona,
      added: persona.added || '',
      cost: persona.cost || null,
      combination: persona.combination || null,
      recommendSkill: Array.isArray(persona.recommendSkill) ? persona.recommendSkill : [],
      comment: persona.comment || '',
      comment_en: persona.comment_en || '',
      comment_jp: persona.comment_jp || ''
    };

    const passiveSkill = buildPassiveSkill(nameKr, persona, id, mapping);
    const passivePriority =
      (persona.instinct && typeof persona.instinct.priority === 'number')
        ? persona.instinct.priority
        : (persona.instinct2 && typeof persona.instinct2.priority === 'number'
          ? persona.instinct2.priority
          : 0);

    const uniqueSkill = buildSkillBlock('unique', persona, id);
    const highlight = buildSkillBlock('highlight', persona, id);

    const outObj = {
      ...meta,
      passive_priority: passivePriority,
      passive_skill: passiveSkill,
      uniqueSkill,
      highlight
    };

    const fileSafeName = nameKr; // 한글 이름 그대로 파일명으로 사용 (Windows 허용 범위 내)
    const outPath = path.join(OUTPUT_DIR, `${fileSafeName}.js`);

    const jsContent =
      `// Auto-generated from data/kr/wonder/persona.js and data/external/persona/* by scripts/migrate-persona-to-files.mjs\n` +
      `window.personaFiles = window.personaFiles || {};\n` +
      `window.personaFiles[${JSON.stringify(nameKr)}] = ${JSON.stringify(outObj, null, 2)};\n`;

    fs.writeFileSync(outPath, jsContent, 'utf8');
    count += 1;
  }

  // 개별 파일들을 하나로 합친 번들 생성 (window.personaFiles[...] 정의를 모두 포함)
  try {
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.js'));
    let bundle = '// Auto-generated bundle of data/persona/*.js\n';
    bundle += 'window.personaFiles = window.personaFiles || {};\n';
    for (const f of files) {
      const p = path.join(OUTPUT_DIR, f);
      bundle += fs.readFileSync(p, 'utf8') + '\n';
    }
    const bundlePath = path.join(OUTPUT_DIR, 'bundle.persona.js');
    fs.writeFileSync(bundlePath, bundle, 'utf8');
    log(`✅ Bundle generated at data/persona/bundle.persona.js`);
  } catch (e) {
    log(`⚠️ Failed to generate persona bundle: ${e?.message || e}`);
  }

  log(`✅ Migration completed. Generated ${count} files in data/persona/.`);
  if (missingExternal > 0) {
    log(`ℹ️  Personas without external id/mapping: ${missingExternal} (passives/skills built from legacy persona.js only).`);
  }
}

try {
  main();
} catch (e) {
  console.error('❌ migrate-persona-to-files.mjs failed:', e?.message || e);
  process.exit(1);
}


