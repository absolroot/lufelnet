const NAME_KEYS = ['name', 'name_en', 'name_jp', 'name_cn'];
const DESC_KEYS = ['desc', 'desc_en', 'desc_jp', 'desc_cn'];
const DEFAULT_AWAKE_TYPE = '패시브';

const LANG_TEXT_FIELDS = {
  kr: { name: 'name', desc: 'desc' },
  en: { name: 'name_en', desc: 'desc_en' },
  jp: { name: 'name_jp', desc: 'desc_jp' },
  cn: { name: 'name_cn', desc: 'desc_cn' }
};

const ELEMENT_LABELS = {
  만능: { en: 'Almighty', jp: '万能', cn: '万能' },
  물리: { en: 'Physical', jp: '物理', cn: '物理' },
  총격: { en: 'Gun', jp: '銃撃', cn: '枪击' },
  화염: { en: 'Fire', jp: '火炎', cn: '火焰' },
  빙결: { en: 'Ice', jp: '氷結', cn: '冰结' },
  전격: { en: 'Electric', jp: '電撃', cn: '电击' },
  질풍: { en: 'Wind', jp: '疾風', cn: '疾风' },
  염동: { en: 'Psychokinesis', jp: '念動', cn: '念动' },
  핵열: { en: 'Nuclear', jp: '核熱', cn: '核热' },
  축복: { en: 'Bless', jp: '祝福', cn: '祝福' },
  주원: { en: 'Curse', jp: '呪怨', cn: '咒怨' }
};

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
  Almighty: '만능',
  // Legacy typo compatibility for older data inputs.
  Allmighty: '만능'
};

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function pickDefined(...values) {
  for (const value of values) {
    if (value !== undefined) return value;
  }
  return undefined;
}

function pickText(...values) {
  for (const value of values) {
    if (hasText(value)) return String(value);
  }
  return '';
}

function pickLastSlashText(...values) {
  const text = pickText(...values);
  if (!text) return '';
  const parts = text.split('/').map((part) => part.trim()).filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : text.trim();
}

function normalizeTextKeys(target, keys) {
  for (const key of keys) {
    if (!hasText(target[key])) target[key] = '';
  }
}

function resolveElementLabels(nature, elementKr, explicitType) {
  const kr = explicitType || elementKr || NATURE_TO_ELEMENT_KR[String(nature || '').trim()] || null;
  if (!kr) return null;
  const labels = ELEMENT_LABELS[kr];
  if (!labels) return null;
  return { kr, ...labels };
}

function buildFinalDescriptions(attr, labels) {
  if (!labels || !hasText(attr)) return null;

  if (attr === 'Final Damage Mult.') {
    return {
      desc: `모든 ${labels.kr} 속성 아군의 최종 대미지 증가`,
      desc_en: `All ${labels.en} Attribute Allies' Final Damage Increase`,
      desc_jp: `${labels.jp}属性の味方全員の最終ダメージ上昇`,
      desc_cn: `所有${labels.cn}属性同伴的最终伤害提升`
    };
  }

  if (/ Boost$/.test(attr)) {
    return {
      desc: `모든 ${labels.kr} 속성 아군의 ${labels.kr} 속성 대미지 보너스 증가`,
      desc_en: `All ${labels.en} Attribute Allies' ${labels.en} Attribute Damage Mult Increase`,
      desc_jp: `${labels.jp}属性の味方全員の${labels.jp}属性ダメージ倍率上昇`,
      desc_cn: `所有${labels.cn}属性同伴的${labels.cn}属性伤害倍率提升`
    };
  }

  if (/ Damage Taken$/.test(attr)) {
    return {
      desc: `모든 ${labels.kr} 속성 아군의 ${labels.kr} 속성 받는 대미지 감소`,
      desc_en: `All ${labels.en} Attribute Allies' ${labels.en} Attribute DMG Taken Decrease`,
      desc_jp: `${labels.jp}属性の味方全員の${labels.jp}属性被ダメージ減少`,
      desc_cn: `所有${labels.cn}属性同伴的${labels.cn}属性受伤害降低`
    };
  }

  if (attr === 'Attack') {
    return {
      desc: `모든 ${labels.kr} 속성 아군의 공격력 증가`,
      desc_en: `All ${labels.en} Attribute Allies' Attack Increase`,
      desc_jp: `${labels.jp}属性の味方全員の攻撃力上昇`,
      desc_cn: `所有${labels.cn}属性同伴的攻击力提升`
    };
  }

  if (attr === 'Crit Mult.') {
    return {
      desc: `모든 ${labels.kr} 속성 아군의 크리티컬 효과 증가`,
      desc_en: `All ${labels.en} Attribute Allies' Crit Mult Increase`,
      desc_jp: `${labels.jp}属性の味方全員のクリティカル倍率上昇`,
      desc_cn: `所有${labels.cn}属性同伴的暴击效果提升`
    };
  }

  return null;
}

function normalizeFinalEntry(localEntry, externalEntry, elementKr) {
  const local = isPlainObject(localEntry) ? clone(localEntry) : {};
  const external = isPlainObject(externalEntry) ? clone(externalEntry) : {};
  if (!isPlainObject(local) && !isPlainObject(external)) return null;
  if (Object.keys(local).length === 0 && Object.keys(external).length === 0) return null;

  const merged = { ...local, ...external };
  merged.attr = pickDefined(external.attr, local.attr);
  merged.nature = pickDefined(external.nature, local.nature);
  merged.value = pickDefined(external.value, local.value);

  const labels = resolveElementLabels(merged.nature, elementKr, pickText(external.type, local.type));
  merged.type = pickText(external.type, local.type) || labels?.kr || elementKr || '';

  normalizeTextKeys(merged, DESC_KEYS);
  const auto = buildFinalDescriptions(merged.attr, labels);
  if (auto) {
    for (const key of DESC_KEYS) {
      if (!hasText(merged[key]) && hasText(auto[key])) merged[key] = auto[key];
    }
  }

  return merged;
}

function mergeFinalInnate(existingFinal, externalFinal, elementKr) {
  const localGroups = Array.isArray(existingFinal) ? existingFinal : [];
  const sourceGroups = Array.isArray(externalFinal) ? externalFinal : [];
  const groupCount = Math.max(localGroups.length, sourceGroups.length);
  const next = [];

  for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
    const localGroup = Array.isArray(localGroups[groupIndex]) ? localGroups[groupIndex] : [];
    const sourceGroup = Array.isArray(sourceGroups[groupIndex]) ? sourceGroups[groupIndex] : [];
    const itemCount = Math.max(localGroup.length, sourceGroup.length);
    const nextGroup = [];

    for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
      const merged = normalizeFinalEntry(localGroup[itemIndex], sourceGroup[itemIndex], elementKr);
      if (merged) nextGroup.push(merged);
    }

    if (nextGroup.length > 0 || groupIndex < localGroups.length || groupIndex < sourceGroups.length) {
      next.push(nextGroup);
    }
  }

  return next;
}

function normalizeAwakeEntry(localEntry, externalEntry, lang) {
  const local = isPlainObject(localEntry) ? clone(localEntry) : {};
  const external = isPlainObject(externalEntry) ? clone(externalEntry) : {};
  if (Object.keys(local).length === 0 && Object.keys(external).length === 0) return null;

  const merged = { ...local };
  const langFields = LANG_TEXT_FIELDS[lang] || LANG_TEXT_FIELDS.kr;

  merged.ascend = pickLastSlashText(external.ascend, local.ascend) || '0';
  merged.autoSelect = pickText(external.autoSelect, external.auto_select, local.autoSelect) || 'Default';
  merged.cooldown = typeof pickDefined(external.cooldown, local.cooldown) === 'number'
    ? pickDefined(external.cooldown, local.cooldown)
    : Number(pickDefined(external.cooldown, local.cooldown, 0)) || 0;
  merged.cost = pickText(external.cost, local.cost);
  merged.level = pickLastSlashText(external.level, external.skill_lv, local.level);
  merged.nature = pickDefined(external.nature, local.nature, null);
  merged.type = pickText(external.type, local.type) || DEFAULT_AWAKE_TYPE;

  if (hasText(external.name)) merged[langFields.name] = external.name;
  if (hasText(external.desc)) merged[langFields.desc] = external.desc;

  normalizeTextKeys(merged, NAME_KEYS);
  normalizeTextKeys(merged, DESC_KEYS);
  return merged;
}

function mergeInnateAwake(existingAwake, externalAwake, lang) {
  const localItems = Array.isArray(existingAwake) ? existingAwake : [];
  const sourceItems = Array.isArray(externalAwake) ? externalAwake : [];
  const itemCount = Math.max(localItems.length, sourceItems.length);
  const next = [];

  for (let index = 0; index < itemCount; index += 1) {
    const merged = normalizeAwakeEntry(localItems[index], sourceItems[index], lang);
    if (merged) next.push(merged);
  }

  return next;
}

export function extractCharacterInnateSource(external) {
  const data = isPlainObject(external?.data) ? external.data : {};
  const skillRoot = isPlainObject(data.skill) ? data.skill : {};
  return {
    final_innate: Array.isArray(data.final_innate)
      ? clone(data.final_innate)
      : (Array.isArray(skillRoot.final_innate) ? clone(skillRoot.final_innate) : []),
    innate_awake_skill: Array.isArray(data.innate_awake_skill)
      ? clone(data.innate_awake_skill)
      : (Array.isArray(skillRoot.innate_awake_skill) ? clone(skillRoot.innate_awake_skill) : [])
  };
}

export function buildCharacterInnatePayload({ existing = {}, external, lang = 'kr', element = null } = {}) {
  const current = isPlainObject(existing) ? clone(existing) : {};
  const source = extractCharacterInnateSource(external);
  const finalInnate = mergeFinalInnate(current.final_innate, source.final_innate, element);
  const innateAwake = mergeInnateAwake(current.innate_awake_skill, source.innate_awake_skill, lang);

  const payload = {};
  if (finalInnate.length > 0) payload.final_innate = finalInnate;
  if (innateAwake.length > 0) payload.innate_awake_skill = innateAwake;
  return payload;
}
