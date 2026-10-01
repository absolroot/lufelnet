import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import worker from './worker.mjs';

const originalFetch = globalThis.fetch;
const originalCaches = globalThis.caches;

afterEach(() => {
  globalThis.fetch = originalFetch;
  globalThis.caches = originalCaches;
});

function setup() {
  const versions = { tactics: 0, tactic_likes: 0 };
  const probe = { latestId: '100', storedId: null, lastAt: 0 };
  const entries = new Map();
  const originRequests = [];
  const pending = [];
  globalThis.caches = {
    default: {
      async match(key) { return entries.get(key.url)?.clone(); },
      async put(key, response) { entries.set(key.url, response.clone()); }
    }
  };
  globalThis.fetch = async request => {
    originRequests.push(request);
    if (request.url.includes('order=created_at.desc')) return Response.json([{ id: probe.latestId }]);
    if (request.method === 'GET') return Response.json([{ id: originRequests.length }]);
    return Response.json({ id: 42 }, { status: 201 });
  };
  const env = {
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
    ALLOWED_ORIGIN: 'https://lufel.net',
    CACHE_STATE: {
      prepare(sql) {
        return {
          bind(...args) {
            return {
              async first() { return { version: versions[args[0]] }; },
              async run() {
                if (sql.includes('last_probe_at_ms = ?')) {
                  if (probe.lastAt >= args[2]) return { meta: { changes: 0 } };
                  probe.lastAt = args[0];
                  return { meta: { changes: 1 } };
                }
                if (sql.includes('latest_id = ?')) {
                  if (probe.storedId === args[0]) return { meta: { changes: 0 } };
                  probe.storedId = args[0];
                  versions.tactics += 1;
                  return { meta: { changes: 1 } };
                }
                if (sql.includes('last_probe_at_ms = 0')) probe.lastAt = 0;
                else versions[args[0]] += 1;
                return { meta: { changes: 1 } };
              }
            };
          },
          async first() { return { count: 2 }; }
        };
      }
    }
  };
  const ctx = { waitUntil(promise) { pending.push(promise); } };
  const settle = async () => Promise.all(pending.splice(0));
  return { env, ctx, originRequests, versions, probe, settle };
}

function request(table, method = 'GET', options = {}) {
  return new Request(`https://api.lufel.net/rest/v1/${table}?select=id`, {
    method,
    headers: { Origin: 'https://lufel.net', Authorization: 'Bearer user-jwt', ...options.headers },
    ...(method === 'GET' ? {} : { body: '{}', duplex: 'half' })
  });
}

test('public reads use cache and a successful write makes the next read fresh', async () => {
  const state = setup();
  const first = await worker.fetch(request('tactics'), state.env, state.ctx);
  assert.equal(first.headers.get('x-tactic-cache'), 'MISS');
  assert.deepEqual(await first.json(), [{ id: 1 }]);
  await state.settle();

  const second = await worker.fetch(request('tactics'), state.env, state.ctx);
  assert.equal(second.headers.get('x-tactic-cache'), 'HIT');
  assert.equal(state.originRequests.length, 1);
  assert.equal(state.originRequests[0].headers.get('authorization'), 'Bearer sb_publishable_test');

  const saved = await worker.fetch(request('tactics', 'POST'), state.env, state.ctx);
  assert.equal(saved.status, 201);
  assert.equal(state.versions.tactics, 1);
  assert.equal(state.originRequests[1].headers.get('authorization'), 'Bearer user-jwt');

  const refreshed = await worker.fetch(request('tactics'), state.env, state.ctx);
  assert.equal(refreshed.headers.get('x-tactic-cache'), 'MISS');
  assert.deepEqual(await refreshed.json(), [{ id: 3 }]);
});

test('like history reads bypass shared cache and a like write invalidates counts', async () => {
  const state = setup();
  const history = new Request('https://api.lufel.net/rest/v1/tactic_likes?select=id,likes,recent_like', {
    headers: { Origin: 'https://lufel.net' }
  });
  const first = await worker.fetch(history, state.env, state.ctx);
  assert.equal(first.headers.get('x-tactic-cache'), 'BYPASS');
  await worker.fetch(history, state.env, state.ctx);
  assert.equal(state.originRequests.length, 2);

  const updated = await worker.fetch(request('tactic_likes', 'PATCH'), state.env, state.ctx);
  assert.equal(updated.status, 201);
  assert.equal(state.versions.tactic_likes, 1);
});

test('failed writes do not invalidate and untrusted origins are rejected', async () => {
  const state = setup();
  globalThis.fetch = async () => new Response('failed', { status: 403 });
  const denied = await worker.fetch(request('tactics', 'POST'), state.env, state.ctx);
  assert.equal(denied.status, 403);
  assert.equal(state.versions.tactics, 0);

  const foreign = new Request('https://api.lufel.net/rest/v1/tactics', {
    headers: { Origin: 'https://other.example' }
  });
  const blocked = await worker.fetch(foreign, state.env, state.ctx);
  assert.equal(blocked.status, 403);
});

test('home listing detects a direct legacy post within the 30 second probe window', async () => {
  const state = setup();
  const home = new Request('https://api.lufel.net/rest/v1/tactics?select=id&order=created_at.desc&limit=3', {
    headers: { Origin: 'https://lufel.net' }
  });
  const first = await worker.fetch(home, state.env, state.ctx);
  assert.equal(first.headers.get('x-tactic-cache'), 'MISS');
  await state.settle();
  const second = await worker.fetch(home, state.env, state.ctx);
  assert.equal(second.headers.get('x-tactic-cache'), 'HIT');

  state.probe.latestId = '101';
  state.probe.lastAt = Date.now() - 31000;
  const afterPost = await worker.fetch(home, state.env, state.ctx);
  assert.equal(afterPost.headers.get('x-tactic-cache'), 'MISS');
  assert.equal(state.versions.tactics, 2);
});
