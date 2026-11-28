# Tactic API cache

`api.lufel.net` proxies only the public `tactics` and `tactic_likes` PostgREST paths. The site keeps using Supabase Auth. Reads use Cloudflare's per-location cache; D1 stores a global version for each table. A successful write increments that version before the browser receives its response, so the next read uses a fresh cache key.

Cacheable reads through the original REST proxy last up to five minutes, with a 30-second timeout for the older home query. Reads that include `recent_like` bypass the shared cache.

## Public list snapshots

`GET /v1/tactics/library` returns all public summaries in `{"tactics":[...]}`. `GET /v1/tactics/home?lang=kr` returns up to three rows from the same snapshot. Home accepts `kr`, `en`, `jp`, and `cn`. It preserves the site's region rules, including EN/SEA as the fallback for an empty JP list and the unfiltered CN list.

D1 stores the most recent successful generation for both endpoints. A shared lease prevents competing refreshes for the same tactic revision. The Worker publishes all chunks and home lists in one transaction and prevents an older refresh from replacing a newer one. The source read uses the publishable key with no user session, verifies pagination against the exact row count, and selects the public projection. Each D1 chunk is limited to 1 MB of UTF-8, below D1's 2 MB per-row limit.

Successful proxy writes to `tactics` queue an immediate refresh and wait up to three seconds for it to publish. The committed write still returns its original result if publication takes longer or fails. Changes to `tactic_likes` are coalesced, with the next public read triggering a refresh once the snapshot is at least one minute old. With traffic, public reads also reconcile changes made outside the proxy once a snapshot is five minutes old. An upstream failure retains the last good generation and waits at least two minutes before trying again for the same tactic revision. The Worker uses no scheduled origin reads.

`X-Tactic-Snapshot` reports `HIT`, `REFRESH`, or `STALE`. `X-Tactic-Snapshot-Generation` and `X-Tactic-Snapshot-At` identify the generation and when it was published. With an empty snapshot a failed refresh returns HTTP 503.

## Deployment

The live D1 database is `lufelnet-tactic-cache`, and its binding ID is in `wrangler.toml`. Apply the Supabase migration that provides `public.tactic_library_public`, then apply the D1 schema and deploy the Worker before releasing the site code. The D1 schema is idempotent and preserves existing cache versions.

```sh
npx --yes wrangler@4.145.0 d1 execute lufelnet-tactic-cache --remote --file _workers/tactic-cache/schema.sql --config _workers/tactic-cache/wrangler.toml
npx --yes wrangler@4.145.0 deploy --config _workers/tactic-cache/wrangler.toml
node --experimental-sqlite --test _workers/tactic-cache/worker.test.mjs _workers/tactic-cache/snapshot.test.mjs
```

After the Worker is deployed, GET the library once to warm D1 before releasing the site. Verify both the library count and the three rows per applicable home locale. Further requests to both endpoints should serve the same generation. The tests exercise the D1 transaction and pagination using Node 22's SQLite driver.

The existing proxy remains available for REST reads and writes. Before a write the client checks `/health`. An unavailable health route leads to a direct Supabase write that will be reconciled on a later snapshot refresh. An ambiguous write failure is treated as indeterminate to avoid duplicate inserts.

For the REST proxy, two identical cacheable GETs at the same Cloudflare location show `X-Tactic-Cache: MISS` followed by `HIT`. Track the new snapshot source requests, legacy REST request counts, Supabase Log Ingestion, and egress for several days after release. Compare like-for-like traffic periods when estimating the billing-cycle reduction.
