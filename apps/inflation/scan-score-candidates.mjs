#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import {
  PROJECT_ROOT,
  FUKA_KEY,
  INFLATION_DATA_REL,
  loadDataContext,
  normalizeInflationData,
  readTextUtf8,
  serializeInflationData,
  validateInflationData,
  writeTextUtf8
} from './inflation-data-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://ipdkvuybgxczqwwmrqsw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Hk_7I7kkgaAKrPLQz_sdUA_XvrKoJbI';
const BILIBILI_SEARCH_API = 'https://api.bilibili.com/x/web-interface/search/type';
const DEFAULT_REPORT_REL = 'apps/inflation/score-candidates.json';
const VALID_DEALER_TYPES = new Set(['지배', '반항']);
const PHASES = new Set(['first', 'second']);

const BILIBILI_QUERY_TERMS = [
  'p5x 心之海',
  'P5X 心之海',
  'p5x 心海',
  'P5X 心海'
];

const EXTRA_VERSION_QUERIES = {
  '4.7.1': ['4.71', '4.7.1'],
  '4.8.1': ['4.8.1', '4.81'],
  '4.8.2': ['4.8.2', '4.82'],
  '5.0.1': ['5.0.1', '5.01'],
  '5.0.2': ['5.0.2', '5.02'],
  '5.1.1': ['5.1.1', '5.11']
};

const args = parseArgs(process.argv.slice(2));
const includeBilibili = !args.noBilibili;
const includeTactics = !args.noTactics;
const outputRel = args.output || DEFAULT_REPORT_REL;
const writeReport = args.write !== false;
const maxBilibiliPages = Number(args.bilibiliPages || 1);
const bilibiliDelayMs = Number(args.bilibiliDelayMs || 900);

const context = loadDataContext(PROJECT_ROOT);
const inflationData = normalizeInflationData(context.InflationData || { unit: 'eok', entries: [] });
const characterData = context.characterData || {};
const knownCharacters = new Set(Object.keys(characterData));
const versions = resolveTargetVersions(args.versions, inflationData);
const entryIndex = buildInflationEntryIndex(inflationData);
const knownPartySignatures = buildKnownPartySignatures(inflationData);
const versionAliasMap = buildVersionAliasMap(versions);
const releaseWindows = buildReleaseWindows(inflationData, versions);

const report = {
  generatedAt: new Date().toISOString(),
  targetVersions: versions,
  summary: {
    inflationEntries: inflationData.entries.length,
    existingTeams: inflationData.entries.reduce((sum, entry) => sum + (entry.teams || []).length, 0),
    tacticRowsScanned: 0,
    tacticCandidates: 0,
    bilibiliCandidates: 0,
    autoMatchableCandidates: 0,
    existingMatches: 0,
    needsReview: 0
  },
  existing: summarizeExisting(inflationData),
  suggestedBest: [],
  candidates: [],
  byVersion: {}
};

if (includeTactics) {
  const tacticRows = await fetchTacticRows();
  report.summary.tacticRowsScanned = tacticRows.length;
  const tacticCandidates = scanTactics(tacticRows);
  report.candidates.push(...tacticCandidates);
}

if (includeBilibili) {
  const bilibiliCandidates = await scanBilibili();
  report.candidates.push(...bilibiliCandidates);
}

finalizeReport(report);

if (args.applyNewPhase) {
  const result = applyNewPhaseCandidates(inflationData, report.suggestedBest);
  if (result.added.length) {
    const validation = validateInflationData(result.data, context);
    if (!validation.ok) {
      console.error('Refusing to write invalid InflationData after applying candidates.');
      validation.errors.slice(0, 20).forEach((error) => console.error(`- ${error.message}`));
      process.exit(1);
    }
    writeTextUtf8(path.join(PROJECT_ROOT, INFLATION_DATA_REL), serializeInflationData(result.data));
  }
  report.applied = {
    mode: 'new_phase_only',
    added: result.added,
    skipped: result.skipped
  };
  console.log(`Applied ${result.added.length} new phase candidates to ${INFLATION_DATA_REL}.`);
}

if (writeReport) {
  const outputPath = path.join(PROJECT_ROOT, outputRel);
  writeTextUtf8(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${outputRel}`);
}

printConsoleSummary(report);

function parseArgs(argv) {
  const out = {};
  argv.forEach((arg) => {
    if (arg === '--no-bilibili') out.noBilibili = true;
    else if (arg === '--no-tactics') out.noTactics = true;
    else if (arg === '--no-write') out.write = false;
    else if (arg === '--apply-new-phase') out.applyNewPhase = true;
    else if (arg.startsWith('--output=')) out.output = arg.slice('--output='.length);
    else if (arg.startsWith('--versions=')) out.versions = arg.slice('--versions='.length);
    else if (arg.startsWith('--bilibili-pages=')) out.bilibiliPages = arg.slice('--bilibili-pages='.length);
    else if (arg.startsWith('--bilibili-delay-ms=')) out.bilibiliDelayMs = arg.slice('--bilibili-delay-ms='.length);
  });
  return out;
}

function resolveTargetVersions(raw, data) {
  if (raw) {
    return raw.split(',').map((value) => value.trim()).filter(Boolean);
  }
  const versionsSet = new Set(data.entries.map((entry) => entry.version).filter(Boolean));
  return [...versionsSet].sort(compareVersion);
}

function buildInflationEntryIndex(data) {
  const byVersion = new Map();
  const byEntryKey = new Map();
  data.entries.forEach((entry) => {
    const version = entry.version || '';
    if (!byVersion.has(version)) byVersion.set(version, []);
    byVersion.get(version).push(entry);
    byEntryKey.set(makeEntryKey(version, entry.releasedCharacter), entry);
  });
  return { byVersion, byEntryKey };
}

function buildKnownPartySignatures(data) {
  const map = new Map();
  data.entries.forEach((entry) => {
    (entry.teams || []).forEach((team) => {
      const signature = partySignature(team.party);
      if (!signature) return;
      const key = `${entry.version}::${team.phase || ''}::${signature}`;
      map.set(key, { entry, team });
    });
  });
  return map;
}

function buildVersionAliasMap(targetVersions) {
  const map = new Map();
  targetVersions.forEach((version) => {
    const parts = String(version || '').split('.');
    if (parts.length < 2) return;
    const alias = `${parts[0]}.${parts[1]}`;
    if (!map.has(alias)) map.set(alias, []);
    map.get(alias).push(version);
  });
  [...map.values()].forEach((items) => items.sort(compareVersion));
  return map;
}

function buildReleaseWindows(data, targetVersions) {
  const targetSet = new Set(targetVersions);
  const byVersion = new Map();
  data.entries.forEach((entry) => {
    if (!targetSet.has(entry.version) || !entry.releaseDate) return;
    if (!byVersion.has(entry.version)) byVersion.set(entry.version, entry.releaseDate);
  });
  const releases = [...byVersion.entries()]
    .map(([version, date]) => ({ version, date }))
    .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  return releases.map((release, index) => ({
    version: release.version,
    start: release.date || '',
    end: releases[index + 1]?.date || ''
  }));
}

function summarizeExisting(data) {
  return data.entries.map((entry) => ({
    id: entry.id,
    version: entry.version,
    releasedCharacter: entry.releasedCharacter,
    releaseDate: entry.releaseDate,
    teams: (entry.teams || []).map((team) => ({
      id: team.id,
      phase: team.phase,
      scoreEok: team.scoreEok,
      mainDealer: team.mainDealer,
      mainDealerType: team.mainDealerType,
      party: team.party
    }))
  }));
}

async function fetchTacticRows() {
  const rows = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const url = new URL('/rest/v1/tactics', SUPABASE_URL);
    url.searchParams.set('select', 'id,title,comment,created_at,url,region,tactic_type,tactic_version,query');
    url.searchParams.set('order', 'created_at.desc');
    url.searchParams.set('limit', String(pageSize));
    url.searchParams.set('offset', String(offset));

    const response = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase tactics fetch failed: HTTP ${response.status}`);
    }

    const batch = await response.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    rows.push(...batch);
    if (batch.length < pageSize) break;
    offset += pageSize;
  }

  return rows;
}

function scanTactics(rows) {
  const candidates = [];
  rows.forEach((row) => {
    const query = parseJsonMaybe(row.query) || {};
    const fields = collectTacticText(row, query);
    const text = fields.map((field) => field.text).join('\n');
    const primaryText = [
      cleanText(row.title),
      cleanText(query.title)
    ].filter(Boolean).join('\n');
    const primaryVersions = matchVersions(primaryText, row.created_at || '');
    const versionsFound = primaryVersions.length
      ? primaryVersions
      : matchVersions(text, row.created_at || '');
    const inferredVersion = versionsFound.length ? '' : inferVersionByCreatedAt(row.created_at || '');
    const scoreMatches = extractScores(fields);
    const phase = inferPhase(text);
    const party = normalizePartyFromTactic(query.party || []);
    const type = String(row.tactic_type || '').trim();

    if (type !== '바다' && !looksLikeSeaOfSoulText(text)) return;
    if (!scoreMatches.length) return;

    const versionsForRow = versionsFound.length ? versionsFound : [inferredVersion || ''];
    versionsForRow.forEach((version) => {
      const scoresForPhase = assignScoresToPhase(scoreMatches, phase, text);
      scoresForPhase.forEach((score) => {
        const candidate = buildCandidate({
          sourceType: 'tactic-library',
          version,
          phase: score.phase || phase || '',
          scoreEok: score.scoreEok,
          rawScore: score.raw,
          confidence: type === '바다' ? 0.72 : 0.42,
          evidenceText: clipEvidence(score.sourceText || text),
          source: {
            tacticId: row.id,
            title: cleanText(row.title),
            comment: cleanText(row.comment),
            url: row.url ? `/tactic-maker/?library=${row.url}` : '',
            region: row.region || '',
            tacticType: type,
            createdAt: row.created_at || ''
          },
          party
        });
        candidates.push(candidate);
      });
    });
  });
  return dedupeCandidates(candidates);
}

function collectTacticText(row, query) {
  const fields = [
    { field: 'title', text: cleanText(row.title) },
    { field: 'comment', text: cleanText(row.comment) },
    { field: 'query.title', text: cleanText(query.title) },
    { field: 'query.memo', text: cleanText(query.memo) }
  ];

  if (Array.isArray(query.turns)) {
    query.turns.forEach((turn, turnIndex) => {
      const columns = turn && turn.columns ? turn.columns : {};
      Object.entries(columns).forEach(([column, actions]) => {
        if (!Array.isArray(actions)) return;
        actions.forEach((action, actionIndex) => {
          if (action && action.memo) {
            fields.push({
              field: `turns.${turnIndex}.${column}.${actionIndex}.memo`,
              text: cleanText(action.memo)
            });
          }
        });
      });
    });
  }

  return fields.filter((field) => field.text);
}

function parseJsonMaybe(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function looksLikeSeaOfSoulText(text) {
  return /마음의\s*바다|心之海|心海|sea\s*of\s*soul|SoS\b/i.test(text);
}

function normalizePartyFromTactic(rawParty) {
  const members = (Array.isArray(rawParty) ? rawParty : [])
    .filter((member) => member && member.name && member.name !== '원더')
    .map((member) => ({
      name: String(member.name || '').trim(),
      order: String(member.order || '').trim(),
      ritual: member.ritual == null ? '' : String(member.ritual),
      modification: member.modification == null ? '' : String(member.modification),
      role: member.role || '',
      mainRev: member.mainRev || '',
      subRev: member.subRev || ''
    }));

  const combat = members
    .filter((member) => member.order !== '-')
    .sort((a, b) => Number(a.order || 99) - Number(b.order || 99))
    .slice(0, 3);
  const supports = members.filter((member) => member.order === '-');
  const support = supports[0] || null;
  const backup = supports[1] || (support && support.name === FUKA_KEY
    ? members.find((member) => member.order === '5')
    : null) || null;
  const mainDealer = inferMainDealer(combat, members);
  const mainDealerType = inferMainDealerType(mainDealer);

  return {
    slots: combat.map((member) => member.name),
    support: support ? support.name : '',
    backup: backup ? backup.name : '',
    mainDealer,
    mainDealerType,
    a6Characters: members.filter((member) => member.ritual === '6').map((member) => member.name),
    members
  };
}

function inferMainDealer(combat, members) {
  const explicitDealer = combat.find((member) => VALID_DEALER_TYPES.has(member.role));
  if (explicitDealer) return explicitDealer.name;
  const sorted = [...combat].sort((a, b) => Number(b.order || 0) - Number(a.order || 0));
  const byDealerPosition = sorted.find((member) => VALID_DEALER_TYPES.has(characterData[member.name]?.position));
  if (byDealerPosition) return byDealerPosition.name;
  return sorted[0] ? sorted[0].name : '';
}

function inferMainDealerType(character) {
  const position = characterData[character]?.position || '';
  return VALID_DEALER_TYPES.has(position) ? position : '';
}

function extractScores(fields) {
  const out = [];
  fields.forEach((field) => {
    const text = stripScoreNoise(field.text);
    scorePatterns().forEach(({ regex, unit }) => {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(text))) {
        const value = Number(match[1]);
        if (!Number.isFinite(value) || value <= 0) continue;
        const scoreEok = convertScoreToEok(value, unit);
        if (!Number.isFinite(scoreEok) || scoreEok <= 0) continue;
        if (isLikelyNonScore(text, match.index, match[0], unit)) continue;
        out.push({
          raw: match[0],
          scoreEok: roundScore(scoreEok),
          unit,
          field: field.field,
          sourceText: text,
          index: match.index
        });
      }
    });
  });
  return dedupeScores(out);
}

function stripScoreNoise(value) {
  return String(value || '')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\bBV[A-Za-z0-9]{6,}\b/g, ' ');
}

function scorePatterns() {
  return [
    { unit: 'eok', regex: /(\d+(?:\.\d+)?)\s*(?:억|亿|億|e|E)(?:\+|以上|이상)?/g },
    { unit: 'man', regex: /(\d+(?:\.\d+)?)\s*(?:만|万|萬|w|W)(?:\+|以上|이상)?/g },
    { unit: 'million', regex: /(\d+(?:\.\d+)?)\s*(?:m|M|mil|Mil|million|Million)\b/g }
  ];
}

function convertScoreToEok(value, unit) {
  if (unit === 'eok') return value;
  if (unit === 'man') return value / 10000;
  if (unit === 'million') return value / 100;
  return value;
}

function roundScore(value) {
  return Math.round(Number(value) * 10000) / 10000;
}

function dedupeScores(scores) {
  const seen = new Set();
  return scores.filter((score) => {
    const key = `${score.field}::${score.raw}::${score.index}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isLikelyNonScore(text, index, raw, unit) {
  const nearby = text.slice(Math.max(0, index - 12), index + raw.length + 12);
  if (/\b(?:A|R|C|S)\s*$/i.test(text.slice(Math.max(0, index - 2), index))) return true;
  if (/bilibili\.com\/video\/BV/i.test(nearby) || /BV[A-Za-z0-9]{6,}/.test(nearby)) return true;
  if (/\b\d+(?:\.\d+)?\s*[wW]\b/.test(raw) && !/分|점|score|心|海|바다|공략|目标|목표|딜|damage/i.test(text)) return true;
  if (unit === 'million' && /(?:TDP|Hz|FPS|1080p|1440p|display|monitor)/i.test(nearby)) return true;
  return false;
}

function matchVersions(text, createdAt = '') {
  const found = new Set();
  const versionStrings = [...versions];
  const sourceText = String(text || '');
  versionStrings.forEach((version) => {
    const queries = EXTRA_VERSION_QUERIES[version] || [version];
    queries.forEach((queryVersion) => {
      const escaped = escapeRegExp(queryVersion);
      const regex = new RegExp(`(^|[^0-9])${escaped}([^0-9]|$)`, 'i');
      if (regex.test(sourceText)) found.add(version);
    });
  });

  const shortVersionRegex = /(^|[^A-Za-z0-9.])v?(\d+)\.(\d+)(?!\.\d)(?!\s*(?:[eE]|억|亿|億|만|万|萬|m|M))(?=$|[^A-Za-z0-9])/gi;
  let match;
  while ((match = shortVersionRegex.exec(sourceText))) {
    const alias = `${match[2]}.${match[3]}`;
    const candidates = versionAliasMap.get(alias) || [];
    if (candidates.length === 1) {
      found.add(candidates[0]);
      continue;
    }
    const byDate = resolveVersionAliasByDate(candidates, createdAt);
    if (byDate) found.add(byDate);
  }

  return [...found].sort(compareVersion);
}

function resolveVersionAliasByDate(candidates, createdAt) {
  if (!candidates.length || !createdAt) return '';
  const date = String(createdAt).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
  const candidateSet = new Set(candidates);
  const exactWindow = releaseWindows.find((item) => (
    candidateSet.has(item.version)
    && item.start
    && date >= item.start
    && (!item.end || date < item.end)
  ));
  if (exactWindow) return exactWindow.version;
  const previous = releaseWindows
    .filter((item) => candidateSet.has(item.version) && item.start && item.start <= date)
    .sort((a, b) => String(b.start).localeCompare(String(a.start)))[0];
  return previous ? previous.version : '';
}

function inferVersionByCreatedAt(createdAt) {
  if (!createdAt) return '';
  const date = String(createdAt).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
  const window = releaseWindows.find((item) => (
    item.start
    && date >= item.start
    && (!item.end || date < item.end)
  ));
  return window ? window.version : '';
}

function inferPhase(text) {
  if (/전반|전반전|상반|上半|first\s*half|1st\s*half/i.test(text)) return 'first';
  if (/후반|후반전|하반|下半|second\s*half|2nd\s*half/i.test(text)) return 'second';
  return '';
}

function assignScoresToPhase(scores, phase, text) {
  const hasBothHalves = /전후반|상하반|上下半|上半.*下半|前半.*後半|first\s*half.*second\s*half|1st\s*half.*2nd\s*half/i.test(text);
  if (hasBothHalves && scores.length >= 2) {
    const sorted = [...scores].sort((a, b) => a.index - b.index);
    return sorted.slice(0, 2).map((score, index) => ({
      ...score,
      phase: index === 0 ? 'first' : 'second'
    }));
  }
  return scores.map((score) => ({ ...score, phase }));
}

function buildCandidate(input) {
  const entry = resolveEntryForCandidate(input.version, input.party);
  const partyObj = {
    slots: input.party.slots,
    support: input.party.support
  };
  if (input.party.backup) partyObj.backup = input.party.backup;

  const existing = findExistingMatch(input.version, input.phase, input.party);
  const autoMatchable = Boolean(
    input.sourceType === 'tactic-library'
      && input.version
      && PHASES.has(input.phase)
      && input.scoreEok > 0
      && input.party.slots.length === 3
      && input.party.support
      && input.party.mainDealer
      && VALID_DEALER_TYPES.has(input.party.mainDealerType)
      && input.source.tacticType === '바다'
  );

  const confidence = Math.min(0.98, input.confidence
    + (input.version ? 0.08 : 0)
    + (PHASES.has(input.phase) ? 0.08 : 0)
    + (input.party.slots.length === 3 ? 0.05 : 0)
    + (input.party.a6Characters.length ? 0.02 : 0)
    + (existing ? 0.08 : 0));

  return {
    sourceType: input.sourceType,
    version: input.version,
    entryId: entry ? entry.id : '',
    releasedCharacter: entry ? entry.releasedCharacter : '',
    phase: input.phase,
    scoreEok: input.scoreEok,
    rawScore: input.rawScore,
    mainDealer: input.party.mainDealer,
    mainDealerType: input.party.mainDealerType,
    party: partyObj,
    a6Characters: input.party.a6Characters,
    confidence: roundScore(confidence),
    autoMatchable,
    existingMatch: existing ? {
      entryId: existing.entry.id,
      teamId: existing.team.id,
      scoreEok: existing.team.scoreEok,
      scoreDiffEok: roundScore(input.scoreEok - Number(existing.team.scoreEok || 0))
    } : null,
    evidenceText: input.evidenceText,
    source: input.source,
    reviewReason: getReviewReason(input, autoMatchable, existing, entry)
  };
}

function resolveEntryForCandidate(version, party) {
  const entries = entryIndex.byVersion.get(version) || [];
  if (entries.length === 1) return entries[0];
  if (!entries.length) return null;
  const main = party.mainDealer || '';
  return entries.find((entry) => entry.releasedCharacter === main) || entries[0] || null;
}

function findExistingMatch(version, phase, party) {
  const signature = partySignature({ slots: party.slots, support: party.support, backup: party.backup });
  if (!signature) return null;
  return knownPartySignatures.get(`${version}::${phase || ''}::${signature}`) || null;
}

function getReviewReason(input, autoMatchable, existing, entry) {
  if (existing) return '기존 입력과 파티가 일치합니다.';
  if (!entry) return '인플레이션 데이터에 같은 버전 엔트리가 없습니다.';
  if (!input.version) return '버전이 텍스트에서 확인되지 않았습니다.';
  if (!PHASES.has(input.phase)) return '전반/후반을 확정하지 못했습니다.';
  if (input.party.slots.length !== 3) return '전투 슬롯 3개를 확정하지 못했습니다.';
  if (!input.party.support) return 'support 슬롯을 확정하지 못했습니다.';
  if (!VALID_DEALER_TYPES.has(input.party.mainDealerType)) return '메인 딜러 타입을 지배/반항으로 확정하지 못했습니다.';
  if (!autoMatchable) return '자동 반영 기준에는 못 미칩니다.';
  return '자동 반영 후보입니다.';
}

function partySignature(party) {
  if (!party) return '';
  const slots = Array.isArray(party.slots) ? party.slots : [];
  if (slots.length !== 3 || slots.some((name) => !name)) return '';
  return [
    ...slots,
    party.support || '',
    party.backup || ''
  ].join('|');
}

async function scanBilibili() {
  const candidates = [];
  const seen = new Set();

  for (const version of versions) {
    const versionQueries = EXTRA_VERSION_QUERIES[version] || [version];
    for (const versionQuery of versionQueries) {
      for (const term of BILIBILI_QUERY_TERMS) {
        for (let page = 1; page <= maxBilibiliPages; page += 1) {
          const results = await fetchBilibiliSearch(`${term} ${versionQuery}`, page);
          await sleep(bilibiliDelayMs);
          results.forEach((item) => {
            if (!item || !item.bvid || seen.has(item.bvid)) return;
            seen.add(item.bvid);
            const title = cleanText(stripHtml(item.title));
            const description = cleanText(stripHtml(item.description));
            const text = `${title}\n${description}`;
            if (!matchVersions(text).includes(version)) return;
            if (!looksLikeSeaOfSoulText(text)) return;
            const scores = extractScores([
              { field: 'title', text: title },
              { field: 'description', text: description }
            ]);
            if (!scores.length) return;
            const phase = inferPhase(text);
            assignScoresToPhase(scores, phase, text).forEach((score) => {
              const candidate = {
                sourceType: 'bilibili',
                version,
                entryId: '',
                releasedCharacter: '',
                phase: score.phase || phase || '',
                scoreEok: score.scoreEok,
                rawScore: score.raw,
                mainDealer: '',
                mainDealerType: '',
                party: {
                  slots: [],
                  support: '',
                  backup: ''
                },
                a6Characters: detectA6Characters(text),
                confidence: roundScore(0.38 + (PHASES.has(score.phase || phase) ? 0.08 : 0)),
                autoMatchable: false,
                existingMatch: null,
                evidenceText: clipEvidence(score.sourceText || text),
                source: {
                  bvid: item.bvid,
                  title,
                  description,
                  author: item.author || '',
                  url: `https://www.bilibili.com/video/${item.bvid}`,
                  searchQuery: `${term} ${versionQuery}`,
                  pubdate: item.pubdate || ''
                },
                reviewReason: 'Bilibili 제목/설명 후보입니다. 파티와 전후반은 영상 확인이 필요할 수 있습니다.'
              };
              candidates.push(candidate);
            });
          });
        }
      }
    }
  }

  return dedupeCandidates(candidates);
}

async function fetchBilibiliSearch(keyword, page) {
  const url = new URL(BILIBILI_SEARCH_API);
  url.searchParams.set('search_type', 'video');
  url.searchParams.set('keyword', keyword);
  url.searchParams.set('page', String(page));

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Referer: 'https://search.bilibili.com/'
    }
  });
  const text = await response.text();
  if (!response.ok || !text.trim().startsWith('{')) return [];
  const json = JSON.parse(text);
  return Array.isArray(json?.data?.result) ? json.data.result : [];
}

function detectA6Characters(text) {
  const found = [];
  Object.keys(characterData).forEach((key) => {
    const data = characterData[key] || {};
    const names = [key, data.name, data.name_en, data.codename, data.codename_en].filter(Boolean);
    if (names.some((name) => new RegExp(`${escapeRegExp(String(name))}[^\\n]{0,16}(?:A6|6돌|66|满命|满星)`, 'i').test(text))) {
      found.push(key);
    }
  });
  return found;
}

function dedupeCandidates(candidates) {
  const map = new Map();
  candidates.forEach((candidate) => {
    const key = [
      candidate.sourceType,
      candidate.version,
      candidate.phase,
      candidate.scoreEok,
      candidate.source?.tacticId || candidate.source?.bvid || '',
      partySignature(candidate.party)
    ].join('::');
    const current = map.get(key);
    if (!current || candidate.confidence > current.confidence) {
      map.set(key, candidate);
    }
  });
  return [...map.values()];
}

function finalizeReport(out) {
  out.candidates.sort((a, b) => {
    const versionDiff = compareVersion(a.version || '0', b.version || '0');
    if (versionDiff !== 0) return versionDiff;
    return (b.confidence || 0) - (a.confidence || 0);
  });

  out.summary.tacticCandidates = out.candidates.filter((candidate) => candidate.sourceType === 'tactic-library').length;
  out.summary.bilibiliCandidates = out.candidates.filter((candidate) => candidate.sourceType === 'bilibili').length;
  out.summary.autoMatchableCandidates = out.candidates.filter((candidate) => candidate.autoMatchable).length;
  out.summary.existingMatches = out.candidates.filter((candidate) => candidate.existingMatch).length;
  out.summary.needsReview = out.candidates.filter((candidate) => !candidate.autoMatchable && !candidate.existingMatch).length;
  out.suggestedBest = buildSuggestedBest(out.candidates);

  out.candidates.forEach((candidate) => {
    const version = candidate.version || 'unknown';
    if (!out.byVersion[version]) out.byVersion[version] = [];
    out.byVersion[version].push(candidate);
  });
}

function buildSuggestedBest(candidates) {
  const existingBest = new Map();
  inflationData.entries.forEach((entry) => {
    (entry.teams || []).forEach((team) => {
      const key = `${entry.version || ''}::${team.phase || ''}`;
      const current = existingBest.get(key);
      if (!current || Number(team.scoreEok || 0) > Number(current.scoreEok || 0)) {
        existingBest.set(key, { entry, team });
      }
    });
  });

  const grouped = new Map();
  candidates
    .filter((candidate) => candidate.sourceType === 'tactic-library')
    .filter((candidate) => candidate.autoMatchable || candidate.existingMatch)
    .forEach((candidate) => {
      const key = `${candidate.version || ''}::${candidate.phase || ''}`;
      const current = grouped.get(key);
      if (!current || Number(candidate.scoreEok || 0) > Number(current.scoreEok || 0)) {
        grouped.set(key, candidate);
      }
    });

  return [...grouped.values()]
    .sort((a, b) => {
      const versionDiff = compareVersion(a.version || '0', b.version || '0');
      if (versionDiff !== 0) return versionDiff;
      return String(a.phase || '').localeCompare(String(b.phase || ''), 'en');
    })
    .map((candidate) => {
      const existing = existingBest.get(`${candidate.version || ''}::${candidate.phase || ''}`) || null;
      const existingScore = existing ? Number(existing.team.scoreEok || 0) : null;
      const scoreDiffEok = existing ? roundScore(candidate.scoreEok - existingScore) : null;
      let status = 'new_phase_candidate';
      if (existing && Math.abs(scoreDiffEok) < 0.0001) status = 'matches_existing_best';
      else if (existing && scoreDiffEok > 0) status = 'higher_than_existing_best';
      else if (existing && scoreDiffEok < 0) status = 'lower_than_existing_best';

      return {
        version: candidate.version,
        entryId: candidate.entryId,
        releasedCharacter: candidate.releasedCharacter,
        phase: candidate.phase,
        scoreEok: candidate.scoreEok,
        rawScore: candidate.rawScore,
        status,
        existingScoreEok: existingScore,
        scoreDiffEok,
        mainDealer: candidate.mainDealer,
        mainDealerType: candidate.mainDealerType,
        party: candidate.party,
        a6Characters: candidate.a6Characters,
        sourceType: candidate.sourceType,
        source: candidate.source,
        evidenceText: candidate.evidenceText
      };
    });
}

function applyNewPhaseCandidates(data, suggestions) {
  const next = normalizeInflationData(data);
  const added = [];
  const skipped = [];
  const teamIds = new Set();
  const entryMap = new Map(next.entries.map((entry) => [entry.id, entry]));
  const candidatesByEntry = new Map();

  next.entries.forEach((entry) => {
    (entry.teams || []).forEach((team) => teamIds.add(team.id));
  });

  (suggestions || [])
    .filter((candidate) => candidate.status === 'new_phase_candidate' || candidate.status === 'higher_than_existing_best')
    .forEach((candidate) => {
      if (!candidatesByEntry.has(candidate.entryId)) candidatesByEntry.set(candidate.entryId, []);
      candidatesByEntry.get(candidate.entryId).push(candidate);
    });

  candidatesByEntry.forEach((entryCandidates, entryId) => {
    const entry = entryMap.get(entryId);
    if (!entry) {
      entryCandidates.forEach((candidate) => {
        skipped.push({ version: candidate.version, phase: candidate.phase, reason: 'entry_not_found' });
      });
      return;
    }

    entryCandidates.forEach((candidate) => {
      const currentEntry = entryMap.get(candidate.entryId);
      const entry = currentEntry;
      if (!entry) {
        skipped.push({ version: candidate.version, phase: candidate.phase, reason: 'entry_not_found' });
        return;
      }

      const sameParty = (entry.teams || []).some((team) => (
        team.phase === candidate.phase
        && partySignature(team.party) === partySignature(candidate.party)
        && Math.abs(Number(team.scoreEok || 0) - Number(candidate.scoreEok || 0)) < 0.0001
      ));
      if (sameParty) {
        skipped.push({ version: candidate.version, phase: candidate.phase, entryId: entry.id, reason: 'same_party_exists' });
        return;
      }

      if (candidate.status === 'new_phase_candidate' && (entry.teams || []).some((team) => team.phase === candidate.phase)) {
        skipped.push({ version: candidate.version, phase: candidate.phase, entryId: entry.id, reason: 'entry_phase_exists' });
        return;
      }

      const idBase = `${entry.id}-${candidate.phase}-tactic-${candidate.source?.tacticId || 'candidate'}`;
      const id = makeUniqueId(idBase, teamIds);
      teamIds.add(id);

      const party = {
        slots: (candidate.party?.slots || []).slice(0, 3),
        support: candidate.party?.support || ''
      };
      if (candidate.party?.backup) party.backup = candidate.party.backup;

      entry.teams.push({
        id,
        phase: candidate.phase,
        scoreEok: candidate.scoreEok,
        mainDealer: candidate.mainDealer || '',
        mainDealerType: candidate.mainDealerType || '',
        party,
        note: makeCandidateNote(candidate)
      });

      added.push({
        entryId: entry.id,
        teamId: id,
        version: entry.version,
        phase: candidate.phase,
        scoreEok: candidate.scoreEok,
        sourceType: candidate.sourceType,
        sourceId: candidate.source?.tacticId || candidate.source?.bvid || ''
      });
    });
  });

  return { data: next, added, skipped };
}

function makeUniqueId(base, used) {
  let id = base;
  let suffix = 2;
  while (used.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}

function makeCandidateNote(candidate) {
  const sourceId = candidate.source?.tacticId ? `tactic-library #${candidate.source.tacticId}` : candidate.sourceType || 'score-candidate';
  const title = candidate.source?.title || candidate.evidenceText || '';
  return [sourceId, title].filter(Boolean).join(': ');
}

function printConsoleSummary(out) {
  console.log(`Scanned ${out.summary.tacticRowsScanned} tactic rows.`);
  console.log(`Candidates: tactics ${out.summary.tacticCandidates}, Bilibili ${out.summary.bilibiliCandidates}.`);
  console.log(`Auto-matchable: ${out.summary.autoMatchableCandidates}, existing matches: ${out.summary.existingMatches}, needs review: ${out.summary.needsReview}.`);
  const top = out.candidates
    .filter((candidate) => candidate.autoMatchable || candidate.existingMatch)
    .slice(-20);
  if (out.suggestedBest.length) {
    console.log('\nSuggested best by version/phase:');
    out.suggestedBest.forEach((candidate) => {
      const party = [
        ...(candidate.party.slots || []),
        candidate.party.support || '',
        candidate.party.backup || ''
      ].filter(Boolean).join(' / ');
      console.log(`- v${candidate.version} ${candidate.phase}: ${candidate.scoreEok}억 (${candidate.status}) ${party}`);
    });
  }
  if (top.length) {
    console.log('\nHigh-confidence or existing-match samples:');
    top.forEach((candidate) => {
      const party = [
        ...(candidate.party.slots || []),
        candidate.party.support || '',
        candidate.party.backup || ''
      ].filter(Boolean).join(' / ');
      console.log(`- v${candidate.version} ${candidate.phase || '?'} ${candidate.scoreEok}억 ${party} [${candidate.sourceType}] ${candidate.source.title || candidate.source.bvid || ''}`);
    });
  }
}

function makeEntryKey(version, character) {
  return `${version || ''}::${character || ''}`;
}

function compareVersion(a, b) {
  const left = String(a || '').split('.').map((part) => Number(part) || 0);
  const right = String(b || '').split('.').map((part) => Number(part) || 0);
  const len = Math.max(left.length, right.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (left[i] || 0) - (right[i] || 0);
    if (diff !== 0) return diff;
  }
  return String(a || '').localeCompare(String(b || ''), 'en');
}

function cleanText(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'");
}

function clipEvidence(value) {
  const text = cleanText(value);
  return text.length > 280 ? `${text.slice(0, 277)}...` : text;
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
