import fs from 'fs';
import path from 'path';
import vm from 'vm';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
export const INFLATION_DATA_REL = 'apps/inflation/inflation-data.js';
export const VALID_MAIN_DEALER_TYPES = new Set(['지배', '반항']);
export const VALID_PHASES = new Set(['first', 'second']);
export const FUKA_KEY = '후카';

export function toPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

export function normalizeNewline(text) {
  return String(text == null ? '' : text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

export function stripBom(text) {
  const raw = String(text == null ? '' : text);
  return raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
}

export function normalizeUtf8NoBom(text) {
  return normalizeNewline(stripBom(text));
}

export function readTextUtf8(root, relPath) {
  return normalizeUtf8NoBom(fs.readFileSync(path.join(root, relPath), 'utf8'));
}

export function writeTextUtf8(filePath, content) {
  const normalized = normalizeUtf8NoBom(content);
  fs.writeFileSync(filePath, normalized.endsWith('\n') ? normalized : `${normalized}\n`, 'utf8');
}

export function contentHash(text) {
  return crypto.createHash('sha256').update(String(text || '')).digest('hex');
}

export function runBrowserScript(context, root, relPath) {
  const source = readTextUtf8(root, relPath);
  vm.runInContext(source, context, {
    filename: toPosix(relPath)
  });
}

export function loadDataContext(root = PROJECT_ROOT, { includeInflation = true } = {}) {
  const context = {
    console,
    window: {}
  };
  context.window.window = context.window;
  vm.createContext(context);

  runBrowserScript(context, root, 'data/character_info.js');
  runBrowserScript(context, root, 'apps/schedule/data.js');
  if (includeInflation) {
    runBrowserScript(context, root, INFLATION_DATA_REL);
  }

  return context.window;
}

export function makeScheduleKey(version, character) {
  return `${String(version || '').trim()}::${String(character || '').trim()}`;
}

export function buildScheduleIndex(scheduleData) {
  const releases = parseScheduleReleases(scheduleData);
  const map = new Map();

  releases.forEach((release) => {
    (release.characters || []).forEach((character) => {
      map.set(makeScheduleKey(release.version, character), release.date || '');
    });
  });

  return map;
}

export function parseScheduleReleases(scheduleData) {
  const releases = [];
  const beforeV4 = Number(scheduleData?.intervalRules?.beforeV4 || 14);

  (scheduleData.manualReleases || []).forEach((release) => {
    releases.push({
      version: release.version,
      date: release.fixedDate || release.date || '',
      characters: release.characters || [],
      days: release.days ?? beforeV4
    });
  });

  let lastDate = null;
  if (releases.length > 0) {
    const lastRelease = releases[releases.length - 1];
    lastDate = addDays(lastRelease.date, lastRelease.days);
  }

  (scheduleData.autoGenerateCharacters || []).forEach((release) => {
    const computedDate = lastDate ? toDateString(lastDate) : '';
    const releaseDate = release.fixedDate || release.date || computedDate;

    releases.push({
      version: release.version,
      date: releaseDate,
      characters: release.characters || [],
      days: release.days
    });

    const interval = Number(release.days || beforeV4);
    if (releaseDate) {
      lastDate = addDays(releaseDate, interval);
    }
  });

  return releases.filter((release) => release.date && Array.isArray(release.characters));
}

export function addDays(dateString, days) {
  if (!dateString) return null;
  const parts = String(dateString).split('-').map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return null;
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  date.setUTCDate(date.getUTCDate() + Number(days || 0));
  return date;
}

export function toDateString(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export function cloneJson(value) {
  return JSON.parse(JSON.stringify(value == null ? null : value));
}

export function normalizeInflationData(data) {
  const entries = Array.isArray(data?.entries) ? data.entries : [];
  return {
    unit: 'eok',
    entries: entries.map((entry) => ({
      id: String(entry?.id || '').trim(),
      version: String(entry?.version || '').trim(),
      releasedCharacter: String(entry?.releasedCharacter || '').trim(),
      releaseDate: String(entry?.releaseDate || '').trim(),
      teams: (Array.isArray(entry?.teams) ? entry.teams : []).map((team) => {
        const party = team?.party || {};
        const out = {
          id: String(team?.id || '').trim(),
          phase: String(team?.phase || '').trim(),
          scoreEok: Number(team?.scoreEok),
          mainDealer: String(team?.mainDealer || '').trim(),
          mainDealerType: String(team?.mainDealerType || '').trim(),
          party: {
            slots: Array.isArray(party.slots)
              ? party.slots.slice(0, 3).map((name) => String(name || '').trim())
              : [],
            support: String(party.support || '').trim()
          },
          note: String(team?.note || '')
        };
        const backup = String(party.backup || '').trim();
        if (backup) out.party.backup = backup;
        return out;
      })
    }))
  };
}

export function validateInflationData(data, context = {}) {
  const characterData = context.characterData || {};
  const knownCharacters = new Set(Object.keys(characterData));
  const scheduleIndex = buildScheduleIndex(context.releaseScheduleData || {});
  const normalized = normalizeInflationData(data || {});
  const errors = [];
  const entryIds = new Set();
  const teamIds = new Set();
  let teamCount = 0;

  if ((data || {}).unit !== 'eok') {
    errors.push({
      code: 'invalid_unit',
      path: 'unit',
      message: 'InflationData.unit must be "eok".'
    });
  }

  normalized.entries.forEach((entry, entryIndex) => {
    const entryLabel = entry.id || `entry[${entryIndex}]`;
    const entryPath = `entries.${entryIndex}`;

    if (!entry.id) {
      errors.push({ code: 'missing_entry_id', path: `${entryPath}.id`, entryId: entry.id, message: `${entryLabel}: missing id.` });
    } else if (entryIds.has(entry.id)) {
      errors.push({ code: 'duplicate_entry_id', path: `${entryPath}.id`, entryId: entry.id, message: `${entryLabel}: duplicate entry id.` });
    } else {
      entryIds.add(entry.id);
    }

    if (!entry.version) {
      errors.push({ code: 'missing_version', path: `${entryPath}.version`, entryId: entry.id, message: `${entryLabel}: missing version.` });
    }

    if (!entry.releasedCharacter) {
      errors.push({ code: 'missing_released_character', path: `${entryPath}.releasedCharacter`, entryId: entry.id, message: `${entryLabel}: missing releasedCharacter.` });
    } else if (!knownCharacters.has(entry.releasedCharacter)) {
      errors.push({ code: 'unknown_released_character', path: `${entryPath}.releasedCharacter`, entryId: entry.id, character: entry.releasedCharacter, message: `${entryLabel}.releasedCharacter: unknown character "${entry.releasedCharacter}".` });
    }

    if (!entry.releaseDate) {
      const scheduleKey = makeScheduleKey(entry.version, entry.releasedCharacter);
      if (!scheduleIndex.has(scheduleKey)) {
        errors.push({ code: 'schedule_missing', path: entryPath, entryId: entry.id, message: `${entryLabel}: schedule has no release for ${entry.version} + ${entry.releasedCharacter}.` });
      }
    }

    if (!Array.isArray(entry.teams)) {
      errors.push({ code: 'invalid_teams', path: `${entryPath}.teams`, entryId: entry.id, message: `${entryLabel}: teams must be an array.` });
      return;
    }

    if (entry.teams.length === 0) return;

    entry.teams.forEach((team, teamIndex) => {
      teamCount += 1;
      const teamLabel = team.id || `${entryLabel}.teams[${teamIndex}]`;
      const teamPath = `${entryPath}.teams.${teamIndex}`;

      if (!team.id) {
        errors.push({ code: 'missing_team_id', path: `${teamPath}.id`, entryId: entry.id, teamId: team.id, message: `${teamLabel}: missing id.` });
      } else if (teamIds.has(team.id)) {
        errors.push({ code: 'duplicate_team_id', path: `${teamPath}.id`, entryId: entry.id, teamId: team.id, message: `${teamLabel}: duplicate team id.` });
      } else {
        teamIds.add(team.id);
      }

      if (!Number.isFinite(Number(team.scoreEok)) || Number(team.scoreEok) <= 0) {
        errors.push({ code: 'invalid_score', path: `${teamPath}.scoreEok`, entryId: entry.id, teamId: team.id, message: `${teamLabel}: scoreEok must be a positive number.` });
      }

      if (!VALID_PHASES.has(team.phase)) {
        errors.push({ code: 'invalid_phase', path: `${teamPath}.phase`, entryId: entry.id, teamId: team.id, message: `${teamLabel}: phase must be "first" or "second".` });
      }

      if (!VALID_MAIN_DEALER_TYPES.has(team.mainDealerType)) {
        errors.push({ code: 'invalid_main_dealer_type', path: `${teamPath}.mainDealerType`, entryId: entry.id, teamId: team.id, message: `${teamLabel}: invalid mainDealerType "${team.mainDealerType || ''}".` });
      }

      if (!knownCharacters.has(team.mainDealer)) {
        errors.push({ code: 'unknown_main_dealer', path: `${teamPath}.mainDealer`, entryId: entry.id, teamId: team.id, character: team.mainDealer, message: `${teamLabel}.mainDealer: unknown character "${team.mainDealer || ''}".` });
      }

      const party = team.party || {};
      const slots = Array.isArray(party.slots) ? party.slots : [];
      if (slots.length !== 3 || slots.some((name) => !name)) {
        errors.push({ code: 'invalid_slots', path: `${teamPath}.party.slots`, entryId: entry.id, teamId: team.id, message: `${teamLabel}: party.slots must contain exactly 3 battle slots.` });
      }

      slots.forEach((name, slotIndex) => {
        if (!knownCharacters.has(name)) {
          errors.push({ code: 'unknown_slot_character', path: `${teamPath}.party.slots.${slotIndex}`, entryId: entry.id, teamId: team.id, character: name, message: `${teamLabel}.party.slots[${slotIndex}]: unknown character "${name || ''}".` });
        }
      });

      if (!slots.includes(team.mainDealer)) {
        errors.push({ code: 'main_dealer_not_in_slots', path: `${teamPath}.mainDealer`, entryId: entry.id, teamId: team.id, message: `${teamLabel}: mainDealer must be included in party.slots.` });
      }

      if (!party.support) {
        errors.push({ code: 'missing_support', path: `${teamPath}.party.support`, entryId: entry.id, teamId: team.id, message: `${teamLabel}: party.support is required.` });
      } else if (!knownCharacters.has(party.support)) {
        errors.push({ code: 'unknown_support', path: `${teamPath}.party.support`, entryId: entry.id, teamId: team.id, character: party.support, message: `${teamLabel}.party.support: unknown character "${party.support}".` });
      }

      if (party.support === FUKA_KEY) {
        if (!party.backup) {
          errors.push({ code: 'missing_fuka_backup', path: `${teamPath}.party.backup`, entryId: entry.id, teamId: team.id, message: `${teamLabel}: 후카 support requires party.backup.` });
        } else if (!knownCharacters.has(party.backup)) {
          errors.push({ code: 'unknown_backup', path: `${teamPath}.party.backup`, entryId: entry.id, teamId: team.id, character: party.backup, message: `${teamLabel}.party.backup: unknown character "${party.backup}".` });
        }
      } else if (party.backup) {
        errors.push({ code: 'backup_without_fuka', path: `${teamPath}.party.backup`, entryId: entry.id, teamId: team.id, message: `${teamLabel}: party.backup is only allowed when support is 후카.` });
      }
    });

  });

  return {
    ok: errors.length === 0,
    errors,
    entryCount: normalized.entries.length,
    teamCount,
    data: normalized
  };
}

export function buildCharacterOptions(characterData) {
  return Object.keys(characterData || {})
    .map((key) => {
      const item = characterData[key] || {};
      return {
        key,
        name: item.name || key,
        codename: item.codename || '',
        codename_en: item.codename_en || '',
        name_en: item.name_en || '',
        name_jp: item.name_jp || '',
        name_cn: item.name_cn || '',
        hasTierImage: fs.existsSync(path.join(PROJECT_ROOT, 'assets', 'img', 'tier', `${key}.webp`))
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key, 'ko'));
}

export function buildReleaseOptions(scheduleData) {
  return parseScheduleReleases(scheduleData)
    .flatMap((release) => (release.characters || []).map((character) => ({
      version: release.version || '',
      date: release.date || '',
      character
    })))
    .filter((item) => item.version && item.character);
}

function quoteString(value) {
  return `'${String(value == null ? '' : value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')}'`;
}

function isIdentifier(key) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

function serializeValue(value, indent = 0) {
  const space = ' '.repeat(indent);
  const childSpace = ' '.repeat(indent + 2);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((item) => `${childSpace}${serializeValue(item, indent + 2)}`);
    return `[\n${items.join(',\n')}\n${space}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, item]) => item !== undefined);
    if (entries.length === 0) return '{}';
    const items = entries.map(([key, item]) => {
      const prop = isIdentifier(key) ? key : quoteString(key);
      return `${childSpace}${prop}: ${serializeValue(item, indent + 2)}`;
    });
    return `{\n${items.join(',\n')}\n${space}}`;
  }

  if (typeof value === 'string') return quoteString(value);
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '0';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value == null) return 'null';
  return quoteString(value);
}

export function serializeInflationData(data) {
  const normalized = normalizeInflationData(data);
  return [
    '(function () {',
    "  'use strict';",
    '',
    `  window.InflationData = ${serializeValue(normalized, 2)};`,
    '})();',
    ''
  ].join('\n');
}
