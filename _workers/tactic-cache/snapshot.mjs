const PAGE_SIZE = 1000;
const MAX_CHUNK_BYTES = 1_000_000;
const RECONCILE_MS = 5 * 60_000;
const LIKE_BATCH_MS = 60_000;
const LEASE_MS = 25_000;
const ORIGIN_BUDGET_MS = 10_000;
const RETRY_MS = 2 * 60_000;
const HOME_LANGS = ['kr', 'en', 'jp', 'cn'];
const PUBLIC_COLUMNS = 'id,title,author,comment,created_at,url,region,tactic_type,tactic_version,party,likes';
const version = table => `(SELECT version FROM cache_versions WHERE table_name = '${table}')`;
const TACTICS_VERSION = version('tactics');
const LIKES_VERSION = version('tactic_likes');
const OWNS_REFRESH = `SELECT 1 FROM tactic_snapshot_state
  WHERE id = 1 AND lease_token = ? AND lease_version = ${TACTICS_VERSION}`;
const encoder = new TextEncoder();

export function isSnapshotPath(pathname) {
  return pathname === '/v1/tactics/library' || pathname === '/v1/tactics/home';
}

function snapshotKind(url) {
  if (url.pathname === '/v1/tactics/library') return 'library';
  const lang = url.searchParams.get('lang');
  return HOME_LANGS.includes(lang) ? `home-${lang}` : null;
}

async function readSnapshot(db, kind) {
  const { results } = await db.prepare(`
    SELECT s.generation, s.generated_at, s.tactics_version, s.likes_version,
      s.retry_at, s.lease_version, s.lease_until,
      ${TACTICS_VERSION} AS current_tactics_version,
      ${LIKES_VERSION} AS current_likes_version, c.body
    FROM tactic_snapshot_state AS s
    LEFT JOIN tactic_snapshot_chunks AS c ON c.kind = ?
    WHERE s.id = 1
    ORDER BY c.part
  `).bind(kind).all();
  if (!results.length) throw new Error('Snapshot state is uninitialized');
  return { state: results[0], parts: results.map(row => row.body).filter(body => body !== null) };
}

function needsRefresh(state, now) {
  const age = now - state.generated_at;
  return state.generation === 0
    || state.tactics_version !== state.current_tactics_version
    || age >= RECONCILE_MS
    || (state.likes_version !== state.current_likes_version && age >= LIKE_BATCH_MS);
}

function canRefresh(state, now) {
  return state.lease_version !== state.current_tactics_version
    || (state.lease_until <= now && state.retry_at <= now);
}

async function claimRefresh(db, now, token) {
  return db.prepare(`
    UPDATE tactic_snapshot_state
    SET lease_token = ?, lease_until = ?, lease_version = ${TACTICS_VERSION}, retry_at = 0
    WHERE id = 1
      AND (lease_version != ${TACTICS_VERSION} OR (lease_until <= ? AND retry_at <= ?))
      AND (
        generation = 0 OR tactics_version != ${TACTICS_VERSION} OR generated_at <= ?
        OR (likes_version != ${LIKES_VERSION} AND generated_at <= ?)
      )
    RETURNING lease_version AS tactics_version, ${LIKES_VERSION} AS likes_version
  `).bind(token, now + LEASE_MS, now, now, now - RECONCILE_MS, now - LIKE_BATCH_MS).first();
}

function publicRow(row) {
  if ((typeof row?.id !== 'number' && typeof row?.id !== 'string') || !row.id) {
    throw new Error('Snapshot row is missing an ID');
  }
  const { id, title, author, comment, created_at, url, region, tactic_type, tactic_version } = row;
  const party = Array.isArray(row.party) ? row.party.map(member => {
    if (!member || typeof member.name !== 'string') return null;
    return { name: member.name, ritual: member.ritual, order: member.order };
  }) : [];
  return {
    id, title, author, comment, created_at, url, region, tactic_type, tactic_version,
    party, likes: Math.max(0, Number(row.likes) || 0)
  };
}

async function fetchPublicTactics(env) {
  const url = new URL('/rest/v1/tactic_library_public', env.SUPABASE_URL);
  url.searchParams.set('select', PUBLIC_COLUMNS);
  url.searchParams.set('order', 'created_at.desc,id.desc');
  url.searchParams.set('limit', String(PAGE_SIZE));
  const signal = AbortSignal.timeout(ORIGIN_BUDGET_MS);
  const rows = [];
  const ids = new Set();
  let total;
  do {
    url.searchParams.set('offset', String(rows.length));
    const headers = new Headers({ apikey: env.SUPABASE_PUBLISHABLE_KEY, accept: 'application/json' });
    if (total === undefined) headers.set('prefer', 'count=exact');
    const response = await fetch(url, { headers, signal });
    if (!response.ok) throw new Error(`Snapshot source returned HTTP ${response.status}`);
    const range = /^(?:(\d+)-(\d+)|\*)\/(\d+|\*)$/.exec(response.headers.get('content-range') || '');
    if (!range || (total === undefined && range[3] === '*')) throw new Error('Snapshot source omitted its row count');
    total ??= Number(range[3]);
    const page = await response.json();
    const start = rows.length;
    if (!Array.isArray(page) || (page.length === 0 && total > start)
      || (page.length && (Number(range[1]) !== start || Number(range[2]) !== start + page.length - 1))
      || start + page.length > total) {
      throw new Error('Snapshot source returned an incomplete page');
    }
    for (const entry of page) {
      const row = publicRow(entry);
      if (ids.has(String(row.id))) throw new Error('Snapshot source returned a duplicate ID');
      ids.add(String(row.id));
      rows.push(row);
    }
  } while (rows.length < total);
  return rows;
}

function splitResponse(rows) {
  const body = JSON.stringify({ tactics: rows });
  // Three UTF-8 bytes per UTF-16 code unit is a safe upper bound.
  if (body.length * 3 <= MAX_CHUNK_BYTES) return [body];
  const bytes = encoder.encode(body);
  if (bytes.byteLength <= MAX_CHUNK_BYTES) return [body];
  const parts = [];
  const decoder = new TextDecoder();
  // Leave space for a code point completed by the next chunk.
  const partSize = MAX_CHUNK_BYTES - 4;
  for (let start = 0; start < bytes.byteLength; start += partSize) {
    const end = start + partSize;
    parts.push(decoder.decode(bytes.subarray(start, end), { stream: end < bytes.byteLength }));
  }
  return parts;
}

function homeRows(rows, lang) {
  if (lang === 'cn') return rows.slice(0, 3);
  const matching = rows.filter(row => lang === 'en'
    ? row.region === 'en' || row.region === 'sea'
    : row.region === lang).slice(0, 3);
  return lang === 'jp' && matching.length === 0 ? homeRows(rows, 'en') : matching;
}

async function publishSnapshot(db, rows, lease, token) {
  const sets = [['library', splitResponse(rows)]];
  for (const lang of HOME_LANGS) sets.push([`home-${lang}`, splitResponse(homeRows(rows, lang))]);
  // D1 batches are transactions. Every statement checks the same lease, and
  // readers obtain metadata and parts in one query.
  const statements = [db.prepare(`DELETE FROM tactic_snapshot_chunks WHERE EXISTS (${OWNS_REFRESH})`).bind(token)];
  for (const [kind, parts] of sets) {
    for (const [part, body] of parts.entries()) {
      statements.push(db.prepare(`
        INSERT INTO tactic_snapshot_chunks (kind, part, body)
        SELECT ?, ?, ? WHERE EXISTS (${OWNS_REFRESH})
      `).bind(kind, part, body, token));
    }
  }
  statements.push(db.prepare(`
    UPDATE tactic_snapshot_state
    SET generation = generation + 1, generated_at = ?, tactics_version = ?, likes_version = ?,
      lease_token = NULL, lease_until = 0
    WHERE EXISTS (${OWNS_REFRESH})
  `).bind(Date.now(), lease.tactics_version, lease.likes_version, token));
  const result = await db.batch(statements);
  return result.at(-1).meta.changes === 1;
}

export async function refreshTacticSnapshot(env) {
  const db = env.CACHE_STATE;
  const token = crypto.randomUUID();
  const lease = await claimRefresh(db, Date.now(), token);
  if (!lease) return false;
  try {
    const rows = await fetchPublicTactics(env);
    return await publishSnapshot(db, rows, lease, token);
  } catch (error) {
    await db.prepare(`
      UPDATE tactic_snapshot_state SET lease_token = NULL, lease_until = 0, retry_at = ?
      WHERE id = 1 AND lease_token = ?
    `).bind(Date.now() + RETRY_MS, token).run();
    console.error('Tactic snapshot refresh failed', error.message);
    return false;
  }
}

function reportRefreshError(error) {
  console.error('Tactic snapshot coordination failed', error.message);
  return false;
}

export function refreshSnapshotAfterWrite(env, ctx) {
  ctx.waitUntil(refreshTacticSnapshot(env).catch(reportRefreshError));
}

function unavailable(cors) {
  const headers = new Headers(cors);
  headers.set('Retry-After', '15');
  headers.set('Cache-Control', 'no-store');
  return new Response('Tactic list temporarily unavailable', { status: 503, headers });
}

export async function serveTacticSnapshot(request, url, env, ctx, cors) {
  const kind = snapshotKind(url);
  if (!kind) return new Response('Invalid tactic locale', { status: 400, headers: cors });
  try {
    const db = env.CACHE_STATE;
    let snapshot = await readSnapshot(db, kind);
    let refreshed = false;
    if (needsRefresh(snapshot.state, Date.now())) {
      const mustReadFresh = !snapshot.parts.length
        || snapshot.state.tactics_version !== snapshot.state.current_tactics_version;
      if (mustReadFresh) {
        if (canRefresh(snapshot.state, Date.now())) {
          refreshed = await refreshTacticSnapshot(env).catch(reportRefreshError);
          snapshot = await readSnapshot(db, kind);
        }
        // A successful tactic write may have already queued the same refresh.
        // Give that in-flight refresh time to publish before serving old data.
        if (!refreshed && snapshot.state.lease_until > Date.now()) {
          for (const wait of [100, 250, 500]) {
            await new Promise(resolve => setTimeout(resolve, wait));
            snapshot = await readSnapshot(db, kind);
            if (snapshot.state.lease_until <= Date.now()
              || snapshot.state.tactics_version === snapshot.state.current_tactics_version) break;
          }
        }
      } else if (canRefresh(snapshot.state, Date.now())) {
        refreshSnapshotAfterWrite(env, ctx);
      }
    }
    if (!snapshot.parts.length) return unavailable(cors);
    const headers = new Headers(cors);
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Cache-Control', 'no-store');
    const stale = needsRefresh(snapshot.state, Date.now());
    headers.set('X-Tactic-Snapshot', stale ? 'STALE' : refreshed ? 'REFRESH' : 'HIT');
    headers.set('X-Tactic-Snapshot-Generation', String(snapshot.state.generation));
    headers.set('X-Tactic-Snapshot-At', new Date(snapshot.state.generated_at).toISOString());
    return new Response(request.method === 'HEAD' ? null : snapshot.parts.join(''), { headers });
  } catch (error) {
    console.error('Tactic snapshot read failed', error.message);
    return unavailable(cors);
  }
}
