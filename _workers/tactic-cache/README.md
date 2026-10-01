# Tactic API cache

`api.lufel.net` proxies only the public `tactics` and `tactic_likes` PostgREST paths. The site keeps using Supabase Auth. Reads use Cloudflare's per-location cache; D1 stores a global version for each table. A successful write increments that version before the browser receives its response, so the next read uses a fresh cache key.

The home list cache lasts at most 30 seconds; other public reads can be cached for up to five minutes. The browser requests the home list only when the page loads or reloads, with no periodic refresh or separate newest-tactic probe. The normal upload path updates the cache version immediately. Likes are saved before the existing UI updates, and the write also invalidates cached like counts. Reads that include `recent_like` bypass the shared cache.

## Deployment

The live D1 database is `lufelnet-tactic-cache`, and its binding ID is in `wrangler.toml`. For a new Cloudflare account, create a D1 database, replace the binding ID, then run `schema.sql` against it.

```sh
npx --yes wrangler@4.145.0 d1 execute lufelnet-tactic-cache --remote --file _workers/tactic-cache/schema.sql
npx --yes wrangler@4.145.0 deploy --config _workers/tactic-cache/wrangler.toml
node --test _workers/tactic-cache/worker.test.mjs
```

Deploy the Worker before deploying a site that routes its tactics requests to `api.lufel.net`. The client falls back to direct Supabase reads when the Worker is unavailable. Before a write it checks `/health`; if unavailable, it writes directly to Supabase. Do not retry a write after an ambiguous network failure because an insert could be duplicated.

Check `/health`, then make the same public GET twice. Responses include `X-Tactic-Cache: MISS` and then `HIT` when both requests reach the same Cloudflare location. Cloudflare cache hits are local to each location, so an initial `MISS` elsewhere is expected. Track Supabase Log Ingestion for several days after release before estimating the billing-cycle reduction.
