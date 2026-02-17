import fs from 'fs';
import path from 'path';

export const SEO_REQUIRED_LANGS = ['kr', 'en', 'jp'];
export const SEO_OPTIONAL_LANGS = ['cn'];
export const SEO_PHASE1_DOMAINS = [
  'synergy',
  'tactic',
  'tactic-maker',
  'tactic-share',
  'tactic-upload',
  'tactics',
  'tier',
  'pull-tracker',
  'maps',
  'home'
];

const TEMPLATE_DOMAINS = new Set(['character', 'persona', 'synergy', 'wonder-weapon']);
const MODE_DOMAIN_KEYS = {
  maps: ['list', 'detail'],
  tactic: ['maker', 'share', 'upload', 'tactics'],
  'pull-tracker': ['individual', 'global', 'guide']
};

const SEO_CHECK_SCRIPT_BY_DOMAIN = {
  home: 'seo:home:check',
  about: 'seo:about:check',
  astrolabe: 'seo:astrolabe:check',
  character: 'seo:character:check',
  'critical-calc': 'seo:critical-calc:check',
  'defense-calc': 'seo:defense-calc:check',
  gallery: 'seo:gallery:check',
  guides: 'seo:article:check',
  maps: 'seo:maps:check',
  'material-calc': 'seo:material-calc:check',
  persona: 'seo:persona:check',
  'pull-calc': 'seo:pull-calc:check',
  'pull-tracker': 'seo:pull-tracker:check',
  revelation: 'seo:revelations:check',
  schedule: 'seo:schedule:check',
  synergy: 'seo:synergy:check',
  tactic: 'seo:tactic:check',
  'tactic-maker': 'seo:tactic-maker:check',
  tier: 'seo:tier:check',
  'wonder-weapon': 'seo:wonder-weapon:check'
};

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function normalizeNewline(text) {
  return String(text == null ? '' : text)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

export function stripBom(text) {
  return String(text == null ? '' : text).replace(/^\uFEFF/, '');
}

export function containsBom(text) {
  return /^\uFEFF/.test(String(text == null ? '' : text));
}

export function serializeJson(value) {
  return `${normalizeNewline(JSON.stringify(value, null, 2))}\n`;
}

function normalizeSeoDomain(raw) {
  return String(raw || '').trim().toLowerCase();
}

function normalizeLangList(rawLangs) {
  const order = ['kr', 'en', 'jp', 'cn'];
  const set = new Set(
    (Array.isArray(rawLangs) ? rawLangs : [])
      .map((lang) => String(lang || '').trim().toLowerCase())
      .filter(Boolean)
  );
  const out = [];
  for (const lang of order) {
    if (set.has(lang)) {
      out.push(lang);
      set.delete(lang);
    }
  }
  for (const lang of Array.from(set).sort((a, b) => a.localeCompare(b))) {
    out.push(lang);
  }
  return out;
}

function inferDomainType(domain) {
  if (domain === 'tier') return 'tier';
  if (Object.prototype.hasOwnProperty.call(MODE_DOMAIN_KEYS, domain)) return 'mode';
  if (TEMPLATE_DOMAINS.has(domain)) return 'template';
  return 'simple';
}

function defaultAvailabilityFlags() {
  return {
    kr: true,
    en: true,
    jp: true,
    cn: false
  };
}

function toScopeList(type, modeKeys = []) {
  if (type === 'template') return ['list', 'detail'];
  if (type === 'tier') return ['list', 'maker'];
  if (type === 'mode') return modeKeys.length > 0 ? modeKeys : ['list'];
  return ['main'];
}

function readJsonFile(filePath, fallbackValue) {
  if (!fs.existsSync(filePath)) return clone(fallbackValue);
  const raw = stripBom(fs.readFileSync(filePath, 'utf8'));
  const parsed = JSON.parse(raw);
  return parsed;
}

export function loadSeoRegistry(projectRoot) {
  const filePath = path.join(projectRoot, 'data', 'seo', 'registry.json');
  if (!fs.existsSync(filePath)) return null;
  try {
    const parsed = readJsonFile(filePath, null);
    return isPlainObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function listSeoDomains(projectRoot) {
  const registry = loadSeoRegistry(projectRoot);
  if (registry && isPlainObject(registry.domains)) {
    return Object.entries(registry.domains)
      .map(([id, entry]) => {
        const domain = normalizeSeoDomain(id);
        const type = String(entry?.type || inferDomainType(domain));
        const modeKeys = Array.isArray(entry?.modeKeys)
          ? entry.modeKeys.map((item) => String(item || '').trim()).filter(Boolean)
          : [];
        const langs = Array.isArray(entry?.langs)
          ? normalizeLangList(entry.langs)
          : normalizeLangList([...SEO_REQUIRED_LANGS, ...Object.keys(entry?.meta || {})]);
        return {
          id: domain,
          type,
          modeKeys: type === 'mode' ? (modeKeys.length > 0 ? modeKeys : (MODE_DOMAIN_KEYS[domain] || [])) : [],
          placeholder: String(entry?.placeholder || (type === 'template' ? '{name}' : (domain === 'maps' ? '{path}' : ''))) || null,
          source: String(entry?.source || `i18n/pages/${domain}/seo-meta.json`),
          langs
        };
      })
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  const pagesDir = path.join(projectRoot, 'i18n', 'pages');
  if (!fs.existsSync(pagesDir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(pagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const domain = normalizeSeoDomain(entry.name);
    const sourcePath = path.join(pagesDir, domain, 'seo-meta.json');
    if (!fs.existsSync(sourcePath)) continue;
    const type = inferDomainType(domain);
    const modeKeys = type === 'mode' ? (MODE_DOMAIN_KEYS[domain] || []) : [];
    const meta = readJsonFile(sourcePath, {});
    const langs = normalizeLangList([...SEO_REQUIRED_LANGS, ...Object.keys(meta || {})]);
    out.push({
      id: domain,
      type,
      modeKeys,
      placeholder: type === 'template' ? '{name}' : (domain === 'maps' ? '{path}' : null),
      source: `i18n/pages/${domain}/seo-meta.json`,
      langs
    });
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

export function resolveSeoMetaPath(projectRoot, domain) {
  return path.join(projectRoot, 'i18n', 'pages', domain, 'seo-meta.json');
}

export function loadSeoAvailability(availabilityPath) {
  const fallback = { version: 1, entries: {} };
  const parsed = readJsonFile(availabilityPath, fallback);
  const version = Number(parsed?.version || 1);
  const entries = isPlainObject(parsed?.entries) ? parsed.entries : {};
  const normalizedEntries = {};
  for (const [key, value] of Object.entries(entries)) {
    if (!isPlainObject(value)) continue;
    const flags = defaultAvailabilityFlags();
    for (const lang of Object.keys(flags)) {
      if (Object.prototype.hasOwnProperty.call(value, lang)) {
        flags[lang] = Boolean(value[lang]);
      }
    }
    normalizedEntries[String(key)] = flags;
  }
  return {
    version: Number.isInteger(version) && version > 0 ? version : 1,
    entries: normalizedEntries
  };
}

export function buildSeoDomainState({ projectRoot, domain, availabilityEntries = {} }) {
  const normalizedDomain = normalizeSeoDomain(domain);
  const descriptor = listSeoDomains(projectRoot).find((item) => item.id === normalizedDomain);
  if (!descriptor) {
    throw new Error(`Unknown SEO domain: ${normalizedDomain}`);
  }

  const sourcePath = resolveSeoMetaPath(projectRoot, descriptor.id);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing seo-meta file: ${descriptor.source}`);
  }

  const rawMeta = readJsonFile(sourcePath, {});
  if (!isPlainObject(rawMeta)) {
    throw new Error(`Invalid seo-meta root shape: ${descriptor.source}`);
  }

  const langs = normalizeLangList([
    ...SEO_REQUIRED_LANGS,
    ...descriptor.langs,
    ...Object.keys(rawMeta || {}),
    ...SEO_OPTIONAL_LANGS
  ]);
  const modeKeys = descriptor.type === 'mode'
    ? (descriptor.modeKeys.length > 0 ? descriptor.modeKeys : (MODE_DOMAIN_KEYS[descriptor.id] || []))
    : [];
  const scopes = toScopeList(descriptor.type, modeKeys);
  const rows = scopes.map((scope) => {
    const key = `${descriptor.id}/${scope}`;
    const savedFlags = isPlainObject(availabilityEntries?.[key]) ? availabilityEntries[key] : {};
    const baseFlags = defaultAvailabilityFlags();
    const row = {
      scope,
      placeholder: scope === 'detail'
        ? (descriptor.type === 'template' ? '{name}' : (descriptor.id === 'maps' ? '{path}' : null))
        : null,
      values: {},
      released: {}
    };
    for (const lang of langs) {
      const langMeta = isPlainObject(rawMeta?.[lang]) ? rawMeta[lang] : {};
      let title = '';
      let description = '';
      if (descriptor.type === 'simple') {
        title = String(langMeta.title || '');
        description = String(langMeta.description || '');
      } else if (descriptor.type === 'template') {
        if (scope === 'list') {
          title = String(langMeta.list_title || '');
          description = String(langMeta.list_description || '');
        } else {
          title = String(langMeta.title || '');
          description = String(langMeta.description || '');
        }
      } else if (descriptor.type === 'mode') {
        const scoped = isPlainObject(langMeta?.[scope]) ? langMeta[scope] : {};
        title = String(scoped.title || '');
        description = String(scoped.description || '');
      } else if (descriptor.type === 'tier') {
        if (scope === 'maker') {
          title = String(langMeta.maker_title || langMeta.title || '');
          description = String(langMeta.maker_description || langMeta.description || '');
        } else {
          title = String(langMeta.title || '');
          description = String(langMeta.description || '');
        }
      }
      row.values[lang] = {
        title,
        description
      };
      row.released[lang] = Object.prototype.hasOwnProperty.call(savedFlags, lang)
        ? Boolean(savedFlags[lang])
        : (Object.prototype.hasOwnProperty.call(baseFlags, lang) ? baseFlags[lang] : true);
    }
    return row;
  });

  return {
    domain: descriptor.id,
    type: descriptor.type,
    source: descriptor.source,
    sourcePath,
    langs,
    modeKeys,
    placeholder: descriptor.placeholder || null,
    rows,
    meta: rawMeta
  };
}

function ensureRowByScope(rows) {
  const out = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    const scope = String(row?.scope || '').trim();
    if (!scope) continue;
    out.set(scope, row);
  }
  return out;
}

function ensureLangObject(meta, lang) {
  if (!isPlainObject(meta[lang])) meta[lang] = {};
  return meta[lang];
}

export function matrixRowsToMeta({ domainState, rows }) {
  const next = clone(domainState.meta) || {};
  const byScope = ensureRowByScope(rows);
  const langs = normalizeLangList([
    ...domainState.langs,
    ...Object.keys(next || {}),
    ...SEO_REQUIRED_LANGS,
    ...SEO_OPTIONAL_LANGS
  ]);

  for (const lang of langs) {
    const langMeta = ensureLangObject(next, lang);
    if (domainState.type === 'simple') {
      const main = byScope.get('main');
      const values = isPlainObject(main?.values?.[lang]) ? main.values[lang] : {};
      langMeta.title = String(values.title || '');
      langMeta.description = String(values.description || '');
      continue;
    }

    if (domainState.type === 'template') {
      const listRow = byScope.get('list');
      const detailRow = byScope.get('detail');
      const listValues = isPlainObject(listRow?.values?.[lang]) ? listRow.values[lang] : {};
      const detailValues = isPlainObject(detailRow?.values?.[lang]) ? detailRow.values[lang] : {};
      langMeta.title = String(detailValues.title || '');
      langMeta.description = String(detailValues.description || '');
      langMeta.list_title = String(listValues.title || '');
      langMeta.list_description = String(listValues.description || '');
      continue;
    }

    if (domainState.type === 'mode') {
      for (const scope of domainState.modeKeys) {
        const row = byScope.get(scope);
        const values = isPlainObject(row?.values?.[lang]) ? row.values[lang] : {};
        if (!isPlainObject(langMeta[scope])) langMeta[scope] = {};
        langMeta[scope].title = String(values.title || '');
        langMeta[scope].description = String(values.description || '');
      }
      continue;
    }

    if (domainState.type === 'tier') {
      const listRow = byScope.get('list');
      const makerRow = byScope.get('maker');
      const listValues = isPlainObject(listRow?.values?.[lang]) ? listRow.values[lang] : {};
      const makerValues = isPlainObject(makerRow?.values?.[lang]) ? makerRow.values[lang] : {};
      langMeta.title = String(listValues.title || '');
      langMeta.description = String(listValues.description || '');
      langMeta.maker_title = String(makerValues.title || '');
      langMeta.maker_description = String(makerValues.description || '');
    }
  }

  return next;
}

export function normalizeAvailabilityFromRows({ domainState, rows, currentEntries }) {
  const nextEntries = clone(currentEntries) || {};
  for (const row of Array.isArray(rows) ? rows : []) {
    const scope = String(row?.scope || '').trim();
    if (!scope) continue;
    const key = `${domainState.domain}/${scope}`;
    const flags = defaultAvailabilityFlags();
    for (const lang of domainState.langs) {
      const value = row?.released?.[lang];
      if (typeof value === 'boolean') {
        flags[lang] = value;
      }
    }
    nextEntries[key] = flags;
  }
  return nextEntries;
}

export function validateSeoRows({ domainState, rows }) {
  const errors = [];
  const warnings = [];
  const byScope = ensureRowByScope(rows);
  const scopes = toScopeList(domainState.type, domainState.modeKeys);

  for (const scope of scopes) {
    const row = byScope.get(scope);
    if (!row) {
      errors.push({ scope, lang: '-', field: 'row', message: `Missing scope row: ${scope}` });
      continue;
    }

    for (const lang of SEO_REQUIRED_LANGS) {
      const values = row?.values?.[lang];
      const title = String(values?.title || '').trim();
      const description = String(values?.description || '').trim();
      if (!title) {
        errors.push({ scope, lang, field: 'title', message: 'title is required for required language' });
      }
      if (!description) {
        errors.push({ scope, lang, field: 'description', message: 'description is required for required language' });
      }
    }

    const cnValues = row?.values?.cn;
    const cnEnabled = Boolean(row?.released?.cn);
    if (cnEnabled) {
      if (!String(cnValues?.title || '').trim()) {
        errors.push({ scope, lang: 'cn', field: 'title', message: 'title is required when cn is released' });
      }
      if (!String(cnValues?.description || '').trim()) {
        errors.push({ scope, lang: 'cn', field: 'description', message: 'description is required when cn is released' });
      }
    }

    if (domainState.type === 'template' && scope === 'detail') {
      for (const lang of SEO_REQUIRED_LANGS) {
        const title = String(row?.values?.[lang]?.title || '');
        const description = String(row?.values?.[lang]?.description || '');
        if (!title.includes('{name}')) {
          errors.push({ scope, lang, field: 'title', message: 'title must include {name}' });
        }
        if (!description.includes('{name}')) {
          errors.push({ scope, lang, field: 'description', message: 'description must include {name}' });
        }
      }
    }

    if (domainState.domain === 'maps' && scope === 'detail') {
      for (const lang of SEO_REQUIRED_LANGS) {
        const title = String(row?.values?.[lang]?.title || '');
        const description = String(row?.values?.[lang]?.description || '');
        if (!title.includes('{path}')) {
          errors.push({ scope, lang, field: 'title', message: 'title must include {path}' });
        }
        if (!description.includes('{path}')) {
          errors.push({ scope, lang, field: 'description', message: 'description must include {path}' });
        }
      }
    }

    for (const lang of domainState.langs) {
      const title = String(row?.values?.[lang]?.title || '');
      const description = String(row?.values?.[lang]?.description || '');
      if (containsBom(title) || containsBom(description)) {
        errors.push({ scope, lang, field: 'encoding', message: 'UTF-8 BOM is not allowed' });
      }
      if (!title.trim() || !description.trim()) {
        continue;
      }
      if (title.length > 80) {
        warnings.push({ scope, lang, field: 'title', message: 'title length is over 80 chars' });
      }
      if (description.length > 170) {
        warnings.push({ scope, lang, field: 'description', message: 'description length is over 170 chars' });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function getSeoCheckScript(domain) {
  const normalizedDomain = normalizeSeoDomain(domain);
  if (!normalizedDomain) return null;
  return SEO_CHECK_SCRIPT_BY_DOMAIN[normalizedDomain] || null;
}

export function buildSeoEtag({ metaRaw, availabilityRaw }) {
  const meta = normalizeNewline(stripBom(metaRaw || ''));
  const availability = normalizeNewline(stripBom(availabilityRaw || ''));
  return `${meta.length}:${availability.length}:${meta.slice(0, 12)}:${availability.slice(0, 12)}`;
}
