import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { afterEach, test } from 'node:test';
import worker from './worker.mjs';

const origin = 'https://lufel.net';
const initialFetch = globalThis.fetch;
const schema = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');

afterEach(() => { globalThis.fetch = initialFetch; });

function tactic(id, region, attrs = {}) {
  return {
    id, title: `Tactic ${id}`, author: 'Author', comment: '',
    created_at: '2026-11-28T00:00:00Z', url: `t${id}`, region, tactic_type: '바다', tactic_version: 'v3',
    party: [{ name: 'Test', ritual: 0, order: 1, ignored: 'excluded' }, null],
    likes: 2, user_id: 'excluded', query: 'excluded', recent_like: 'excluded', ...attrs
  };
}

function rangeResponse(data, url, headers) {
  const start = Number(url.searchParams.get('offset'));
  const page = data.slice(start, start + Number(url.searchParams.get('limit')));
  const count = headers.get('prefer') === 'count=exact' ? data.length : '*';
  const range = page.length ? `${start}-${start + page.length - 1}` : '*';
  return Response.json(page, { headers: { 'Content-Range': `${range}/${count}` } });
}

function setup(rows) {
  const sql = new DatabaseSync(':memory:');
  sql.exec(schema);
  const pending = [];
  const state = { rows, requests: [], pending };
  globalThis.fetch = async (input, options) => {
    const request = new Request(input, options);
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.pathname !== '/rest/v1/tactic_library_public') {
      return new Response(null, { status: request.method === 'POST' ? 201 : 204 });
    }
    state.requests.push(request);
    return state.reply ? state.reply(url, request.headers) : rangeResponse(state.rows, url, request.headers);
  };

  function prepare(query, parameters = []) {
    const statement = sql.prepare(query);
    return {
      bind: (...args) => prepare(query, args),
      async first() { return statement.get(...parameters) ?? null; },
      async all() { return { results: statement.all(...parameters) }; },
      async run() { return { meta: statement.run(...parameters) }; }
    };
  }
  const database = {
    prepare,
    async batch(statements) {
      sql.exec('BEGIN');
      try {
        const result = [];
        for (const statement of statements) result.push(await statement.run());
        sql.exec('COMMIT');
        return result;
      } catch (error) {
        sql.exec('ROLLBACK');
        throw error;
      }
    }
  };
  const env = {
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
    ALLOWED_ORIGIN: origin,
    TACTIC_SNAPSHOTS: 'enabled',
    CACHE_STATE: database
  };
  return Object.assign(state, {
    env,
    handle(path, method = 'GET', headers = {}) {
      const init = { method, headers: { Origin: origin, ...headers } };
      if (['POST', 'PATCH'].includes(method)) init.body = '{}';
      return worker.fetch(new Request('https://api.lufel.net' + path, init), env, {
        waitUntil(promise) { pending.push(promise); }
      });
    },
    age(milliseconds) {
      sql.prepare('UPDATE tactic_snapshot_state SET generated_at = generated_at - ?').run(milliseconds);
    },
    async settle() { await Promise.all(pending.splice(0)); }
  });
}

async function ids(response) {
  assert.equal(response.status, 200);
  const { tactics } = await response.json();
  return tactics.map(row => row.id);
}

test('uses one anonymous snapshot for the library and each localized home', async () => {
  const state = setup([tactic(6, 'en'), tactic(5, 'kr'), tactic(4, 'sea'), tactic(3, 'cn'), tactic(2, 'kr'), tactic(1, 'en')]);
  const first = await state.handle('/v1/tactics/library', 'GET', { Authorization: 'Bearer user-session' });
  assert.equal(first.headers.get('X-Tactic-Snapshot'), 'REFRESH');
  assert.equal(first.headers.get('X-Tactic-Snapshot-Generation'), '1');
  assert.equal(first.headers.get('Access-Control-Allow-Origin'), origin);
  assert.match(first.headers.get('Access-Control-Expose-Headers'), /x-tactic-snapshot-at/);
  assert.deepEqual(await ids(first.clone()), [6, 5, 4, 3, 2, 1]);
  const { tactics } = await first.json();
  assert.deepEqual(tactics[0].party, [{ name: 'Test', ritual: 0, order: 1 }, null]);
  assert.ok(!('user_id' in tactics[0]) && !('query' in tactics[0]) && !('recent_like' in tactics[0]));
  for (const [lang, expected] of Object.entries({ kr: [5, 2], en: [6, 4, 1], jp: [6, 4, 1], cn: [6, 5, 4] })) {
    const response = await state.handle(`/v1/tactics/home?lang=${lang}`);
    assert.equal(response.headers.get('X-Tactic-Snapshot'), 'HIT');
    assert.deepEqual(await ids(response), expected);
  }
  assert.equal(state.requests.length, 1);
  const [request] = state.requests;
  assert.equal(new URL(request.url).searchParams.get('order'), 'created_at.desc,id.desc');
  assert.equal(request.headers.get('apikey'), 'sb_publishable_test');
  assert.equal(request.headers.has('authorization'), false);
});

test('reads past the PostgREST cap and reconstructs a multi-part snapshot', async () => {
  const state = setup(Array.from({ length: 1002 }, (_, index) => tactic(1002 - index, 'jp', { comment: '한'.repeat(350) })));
  const response = await state.handle('/v1/tactics/library');
  assert.equal(response.status, 200);
  const { tactics } = await response.json();
  assert.equal(tactics.length, 1002);
  assert.equal(tactics.at(-1).id, 1);
  assert.equal(tactics.at(-1).comment, '한'.repeat(350));
  assert.deepEqual(state.requests.map(request => new URL(request.url).searchParams.get('offset')), ['0', '1000']);
  assert.deepEqual(await ids(await state.handle('/v1/tactics/home?lang=jp')), [1002, 1001, 1000]);
  assert.equal(state.requests.length, 2);
});

test('refreshes tactic writes promptly and coalesces count updates', async () => {
  const state = setup([tactic(1, 'kr')]);
  await state.handle('/v1/tactics/library');
  state.rows = [tactic(2, 'kr'), tactic(1, 'kr')];
  const write = await state.handle('/rest/v1/tactics', 'POST');
  assert.equal(write.status, 201);
  await state.settle();
  assert.deepEqual(await ids(await state.handle('/v1/tactics/home?lang=kr')), [2, 1]);
  assert.equal(state.requests.length, 2);

  state.rows = [tactic(2, 'kr', { likes: 8 }), tactic(1, 'kr')];
  await state.handle('/rest/v1/tactic_likes', 'PATCH');
  await state.handle('/rest/v1/tactic_likes', 'PATCH');
  const before = await state.handle('/v1/tactics/home?lang=kr');
  assert.equal((await before.json()).tactics[0].likes, 2);
  assert.equal(state.requests.length, 2);
  state.age(61_000);
  assert.equal((await state.handle('/v1/tactics/home?lang=kr')).headers.get('X-Tactic-Snapshot'), 'STALE');
  await state.settle();
  const after = await state.handle('/v1/tactics/home?lang=kr');
  assert.equal((await after.json()).tactics[0].likes, 8);
  assert.equal(state.requests.length, 3);
});

test('prevents an older refresh from publishing over a newer tactic write', async () => {
  const state = setup([tactic(1, 'kr')]);
  await state.handle('/v1/tactics/library');
  state.age(301_000);
  let unlock;
  let didStart;
  const starting = new Promise(resolve => { didStart = resolve; });
  state.reply = async (url, headers) => {
    if (state.requests.length !== 2) return rangeResponse(state.rows, url, headers);
    const result = rangeResponse(state.rows, url, headers);
    await new Promise(resolve => { unlock = resolve; didStart(); });
    return result;
  };
  await state.handle('/v1/tactics/library');
  await starting;
  const [oldRefresh] = state.pending.splice(0);
  state.rows = [tactic(2, 'kr')];
  await state.handle('/rest/v1/tactics', 'PATCH');
  await state.settle();
  unlock();
  await oldRefresh;
  const final = await state.handle('/v1/tactics/library');
  assert.equal(final.headers.get('X-Tactic-Snapshot-Generation'), '2');
  assert.deepEqual(await ids(final), [2]);
  assert.equal(state.requests.length, 3);
});

test('retains last good content on incomplete pages and backs off until recovery', async () => {
  const state = setup([tactic(1, 'kr')]);
  await state.handle('/v1/tactics/library');
  state.rows = [tactic(2, 'kr')];
  state.reply = () => Response.json([], { headers: { 'Content-Range': '*/1' } });
  state.age(301_000);
  const stale = await state.handle('/v1/tactics/library');
  assert.equal(stale.headers.get('X-Tactic-Snapshot'), 'STALE');
  assert.deepEqual(await ids(stale), [1]);
  await state.settle();
  const stillStale = await state.handle('/v1/tactics/home?lang=kr');
  assert.equal(stillStale.headers.get('X-Tactic-Snapshot-Generation'), '1');
  assert.deepEqual(await ids(stillStale), [1]);
  await state.settle();
  assert.equal(state.requests.length, 2);
});

test('validates routes and supports cache metadata on HEAD and cold-start failure', async () => {
  const state = setup([]);
  assert.equal((await state.handle('/v1/tactics/home?lang=other')).status, 400);
  assert.equal((await state.handle('/v1/tactics/library', 'POST')).status, 405);
  assert.equal((await state.handle('/v1/tactics/library', 'GET', { Origin: 'https://other.example' })).status, 403);
  assert.equal((await state.handle('/v1/tactics/library', 'OPTIONS')).status, 204);
  const head = await state.handle('/v1/tactics/library', 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('X-Tactic-Snapshot'), 'REFRESH');
  assert.equal(await head.text(), '');
  assert.deepEqual(await ids(await state.handle('/v1/tactics/library')), []);

  const cold = setup([]);
  cold.reply = () => new Response('unavailable', { status: 503 });
  const unavailable = await cold.handle('/v1/tactics/library');
  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.headers.get('Retry-After'), '15');
});
