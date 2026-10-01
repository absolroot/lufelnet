const TABLES = new Set(['tactics', 'tactic_likes']);
const METHODS = new Set(['GET', 'HEAD', 'POST', 'PATCH', 'DELETE']);
const CACHE_SECONDS = 300;
const HOME_CACHE_SECONDS = 30;

function tableFromPath(pathname) {
  const match = /^\/rest\/v1\/(tactics|tactic_likes)$/.exec(pathname);
  return match && TABLES.has(match[1]) ? match[1] : null;
}

function corsHeaders(origin, allowedOrigin) {
  const headers = new Headers({ Vary: 'Origin' });
  if (origin === allowedOrigin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'apikey, authorization, content-type, x-client-info, prefer, accept-profile, content-profile, range, range-unit');
    headers.set('Access-Control-Expose-Headers', 'content-range, range-unit, preference-applied, x-tactic-cache');
    headers.set('Access-Control-Max-Age', '86400');
  }
  return headers;
}

function browserResponse(upstream, cors, cacheStatus) {
  const headers = new Headers(upstream.headers);
  headers.delete('content-encoding');
  headers.delete('content-length');
  headers.delete('set-cookie');
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Tactic-Cache', cacheStatus);
  cors.forEach((value, name) => headers.set(name, value));
  return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers });
}

async function cacheKey(request, table, version) {
  const variants = [request.url, request.headers.get('accept') || '', request.headers.get('range') || '', request.headers.get('prefer') || ''];
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(variants)));
  const hash = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return new Request(`https://api.lufel.net/__cache/${table}/${version}/${hash}`);
}

async function proxy(request, env, publicRead) {
  const source = new URL(request.url);
  const target = new URL(source.pathname + source.search, env.SUPABASE_URL);
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('origin');
  headers.delete('cookie');
  headers.delete('content-length');
  headers.set('apikey', env.SUPABASE_PUBLISHABLE_KEY);
  if (publicRead) headers.set('authorization', `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`);
  const init = { method: request.method, headers };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
    init.duplex = 'half';
  }
  return fetch(new Request(target, init));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin');
    const allowedOrigin = env.ALLOWED_ORIGIN || 'https://lufel.net';
    const cors = corsHeaders(origin, allowedOrigin);
    const table = tableFromPath(url.pathname);

    if (origin && origin !== allowedOrigin) return new Response('Forbidden origin', { status: 403, headers: cors });
    if (url.pathname === '/health' && request.method === 'GET') {
      try {
        const state = await env.CACHE_STATE.prepare('SELECT COUNT(*) AS count FROM cache_versions').first();
        if (state?.count !== 2) throw new Error('Cache versions are not initialized');
        return new Response('ok', { headers: cors });
      } catch (error) {
        console.error('Tactic cache health check failed', error);
        return new Response('unavailable', { status: 503, headers: cors });
      }
    }
    if (!table) return new Response('Not found', { status: 404, headers: cors });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!METHODS.has(request.method)) return new Response('Method not allowed', { status: 405, headers: cors });
    if (request.method !== 'GET' && request.method !== 'HEAD' && origin !== allowedOrigin) {
      return new Response('Forbidden origin', { status: 403, headers: cors });
    }
    if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
      return new Response('Upstream is not configured', { status: 503, headers: cors });
    }

    const likeSelection = url.searchParams.get('select') || '*';
    const containsPrivateLikeHistory = table === 'tactic_likes' && /recent_like|\*/i.test(likeSelection);
    const cacheable = request.method === 'GET' && !containsPrivateLikeHistory;
    const isHomeList = table === 'tactics' && cacheable && url.searchParams.get('limit') === '3' &&
      (url.searchParams.get('order') || '').startsWith('created_at.desc');
    let key = null;
    if (cacheable) {
      try {
        const state = await env.CACHE_STATE.prepare('SELECT version FROM cache_versions WHERE table_name = ?').bind(table).first();
        if (state) {
          key = await cacheKey(request, table, state.version);
          const cached = await caches.default.match(key);
          if (cached) return browserResponse(cached, cors, 'HIT');
        }
      } catch (error) {
        console.error('Tactic cache lookup failed', error);
      }
    }

    try {
      const upstream = await proxy(request, env, request.method === 'GET' || request.method === 'HEAD');
      const response = browserResponse(upstream, cors, key ? 'MISS' : 'BYPASS');

      if (key && upstream.status === 200) {
        const copy = response.clone();
        copy.headers.set('Cache-Control', `public, max-age=${isHomeList ? HOME_CACHE_SECONDS : CACHE_SECONDS}`);
        ctx.waitUntil(caches.default.put(key, copy).catch(error => console.error('Tactic cache store failed', error)));
      }

      if (upstream.ok && request.method !== 'GET' && request.method !== 'HEAD') {
        try {
          await env.CACHE_STATE.prepare('UPDATE cache_versions SET version = version + 1 WHERE table_name = ?').bind(table).run();
        } catch (error) {
          // The write has already succeeded. Return that result rather than making
          // the browser retry a possibly non-idempotent database operation.
          console.error('Tactic cache invalidation failed', error);
          response.headers.set('X-Tactic-Cache', 'INVALIDATION-FAILED');
        }
      }
      return response;
    } catch (error) {
      console.error('Tactic upstream request failed', error);
      return new Response('Upstream unavailable', { status: 502, headers: cors });
    }
  }
};
