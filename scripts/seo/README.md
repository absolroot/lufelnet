# SEO Generator Playbook (`scripts/seo`)

This directory is not only for `synergy`.  
It is the shared playbook for building SEO generators for any app (`character`, `persona`, `maps`, `synergy`, ...).

## Goals

- Generate stable, crawlable SEO pages from source-of-truth data.
- Keep runtime UI behavior unchanged while improving static URL coverage.
- Make generation deterministic so CI drift checks are reliable.
- Keep i18n-compatible structure for `kr`, `en`, `jp` now, and `cn` later.

## Current Implementation

- Synergy
  - Generator: `scripts/seo/generate-synergy-pages.mjs`
  - Commands:
    - `npm run seo:synergy:generate`
    - `npm run seo:synergy:check`
  - Output:
    - Character pages: `pages/synergy/{kr,en,jp}/*.html`
    - Root redirects: `pages/synergy/roots/*.html`
    - Legacy detail redirects: `pages/synergy/redirects/*.html`
- Wonder Weapon
  - Generator: `scripts/seo/generate-wonder-weapon-pages.mjs`
  - Commands:
    - `npm run seo:wonder-weapon:generate`
    - `npm run seo:wonder-weapon:check`
  - Stable slug map:
    - `_data/wonder_weapon_slugs.json`
  - Output:
    - Weapon pages: `pages/wonder-weapon/{kr,en,jp}/*.html`
    - Root redirects: `pages/wonder-weapon/roots/*.html`
    - Legacy detail redirects: `pages/wonder-weapon/redirects/*.html`

## URL Compatibility Policy

For every generated app, define:

1. Canonical permalink
2. Legacy compatibility paths (prefer explicit redirect stubs)
3. Language-root redirects (root stub pages)

Synergy example:

- Canonical KR character path: `/kr/synergy/{codename}/`
- Legacy compatibility path: `/synergy/{codename}/`
- Language root redirects:
  - `/kr/synergy/` -> `/synergy/?lang=kr`
  - `/en/synergy/` -> `/synergy/?lang=en`
  - `/jp/synergy/` -> `/synergy/?lang=jp`
  - `/cn/synergy/` -> `/synergy/?lang=cn`

Detail URL normalization policy (for generated detail pages):

1. Canonical detail URL must be path-based.
2. Canonical KR detail URL should use `/kr/{app}/{slug}/` for language-prefix consistency.
3. Do not keep `lang` query on path-based detail URLs.
4. Legacy query params (`?weapon=...`, `?character=...`) may be accepted for backward compatibility, but runtime must normalize to canonical path via `replaceState`.
5. Legacy detail paths/slugs must be handled by generated redirect stub pages (`layout: null` + relative `window.location.replace`), not plugin-generated absolute redirects.

Language-root redirect implementation policy:

1. Do not use `redirect_to` for language-root stubs (`/en/{app}/`, `/jp/{app}/`, ...).
2. Generate `layout: null` HTML stubs that redirect with relative paths via `window.location.replace(...)`.
3. Preserve existing query params (e.g. `v`) and override only `lang`.
4. Do not generate both `/{path}/` and `/{path}/index.html` as separate pages. They resolve to the same output target in Jekyll and can collide.
5. Keep `<noscript>` fallback to relative URL.
6. This prevents local host mismatch issues (`127.0.0.1` vs `0.0.0.0`) during development.

## Recommended Structure for New Apps

When adding a new app generator, use this pattern:

1. Generator script:
   - `scripts/seo/generate-{app}-pages.mjs`
2. SEO i18n template:
   - `i18n/pages/{app}/seo-meta.json`
3. Generated output:
   - `pages/{app}/{lang}/*.html`
   - optional: `pages/{app}/roots/*.html`
4. NPM scripts:
   - `seo:{app}:generate`
   - `seo:{app}:check`
5. CI integration:
   - data sync workflow: run `seo:{app}:generate`
   - deploy workflow: run `seo:{app}:check` (PR), `seo:{app}:generate` (build)

## Generator Contract (All Apps)

Every generator should implement:

1. `generate` mode (write files)
2. `check` mode (no writes, non-zero on drift)
3. deterministic ordering
4. deterministic output format
5. collision detection for URL keys/slugs
6. strict source validation (fail fast on missing required fields)
7. URL key stability policy (fixed map or immutable key), with alias support when key changes

## i18n and Naming Rules

- SEO title/description must come from `i18n/pages/{app}/seo-meta.json`.
- Use `{name}`-style placeholders instead of hardcoded text in script.
- Supported now: `kr`, `en`, `jp`.
- `cn` can be route-ready before full content release.
- Proper nouns must not be freely paraphrased.  
  If source name is unclear, stop and confirm before fixing slug/name mapping.

## Source Priority Design

Define source priority per app and document it in the generator.

Synergy baseline:

1. truth source: `apps/synergy/friends/friend_num.json`
2. primary URL key: `data/character_info.js` -> `codename`
3. fallback URL key: `friend_num.json.name_en` -> slug

If both primary and fallback are missing, generation must fail.

Wonder Weapon baseline:

1. truth source: `data/kr/wonder/weapons.js`
2. primary URL key: `_data/wonder_weapon_slugs.json` -> `slug`
3. legacy URL aliases: `_data/wonder_weapon_slugs.json` -> `aliases[]` -> explicit redirect stubs
4. fallback URL key: `name_en` is display-only, not URL key

## Stable Slug Policy (Wonder Weapon)

Use `_data/wonder_weapon_slugs.json` as URL source of truth.

When translated names (`name_en`, `name_jp`) change:

1. Keep existing `slug` unchanged (preferred).
2. If slug must change, move old slug into `aliases` before updating `slug`.
3. Run:
   - `npm run seo:wonder-weapon:generate`
   - `npm run seo:wonder-weapon:check`
4. Verify old URLs redirect via generated redirect stubs.

## Runtime SEO Behavior Contract

For pages with tab/selection UI:

1. Initial deep-link (legacy query or canonical path) must select the matching tab/item.
2. On deep-link normalization, use `replaceState` to avoid duplicate history entries.
3. On user tab change, update URL to canonical path (`pushState`).
4. Browser tab title (`document.title`) must reflect the selected item on detail context.
5. Path-based detail URLs must not retain `lang` query after normalization.

Language router compatibility contract:

1. Global language router must not rewrite SEO detail paths from `/{lang}/{app}/{slug}/` to query-style URLs.
2. Global language router must treat `/{app}/{slug}/` as a valid direct-access page and must not auto-append `?lang=...`.
3. Legacy-prefix detail URLs (`/kr/{app}/{slug}/`) should be normalized by SEO redirect stubs, not by generic language-router rewrites.
4. `initializeLanguageDetection()` and first-load IP fallback logic must skip SEO detail paths.
5. For SEO detail pages, language resolution must be path-first (`/{en|jp}/{app}/{slug}/` -> that language, `/{app}/{slug}/` -> `kr`) and must ignore query `lang`.
6. Language switch action on SEO detail pages should navigate to canonical detail paths for supported route languages (`kr`,`en`,`jp`), not force query-style rewriting.
7. App-level language helpers (e.g. `synergy.js` local `getCurrentLanguage`) must follow the same path-first rule as the global router.

## Encoding and File Safety

- Write as UTF-8 without BOM.
- Normalize line endings to LF (`\n`) in generated content.
- Avoid locale-dependent sorting.
- Keep YAML front matter stable to avoid noisy diffs.

## CI Pattern (Dual Safety Net)

Use both:

1. Data workflow generation
   - ensures commits contain updated generated pages.
2. Deploy workflow generation
   - ensures deployment never misses generated pages even if commit was stale.

Optional but recommended:

- Run `seo:{app}:check` on PR to block drift.

## Validation Checklist for Any New App

1. `npm run seo:{app}:generate` produces expected files.
2. `npm run seo:{app}:check` passes after generation.
3. Canonical URLs resolve correctly.
4. Legacy URLs redirect correctly.
5. Language root URLs do not 404.
6. `_site` output contains expected redirect/canonical pages.
7. BOM check passes on generated and config files.
8. Local redirect safety check:
   - access `http://127.0.0.1:4000/en/{app}/`
   - ensure redirect target stays on `127.0.0.1` (no forced `0.0.0.0`)
   - access `http://127.0.0.1:4000/kr/{app}/`
   - ensure `kr` root exists and redirects consistently
9. Local KR-detail canonical safety check:
   - access `http://127.0.0.1:4000/kr/{app}/{slug}/`
   - ensure URL stays on `/kr/{app}/{slug}/` (no forced downgrade to unprefixed KR path)
10. Local language-preference safety check:
   - set `localStorage.preferredLanguage='en'` and access `http://127.0.0.1:4000/kr/{app}/{slug}/`
   - ensure final URL is KR canonical detail path (no detour to another slug, no forced `?lang=en`)

## Troubleshooting (Local)

1. If redirect behavior seems impossible/unexpected after code changes, clear browser redirect cache (or test in Incognito).
2. Rebuild from clean state when debugging routing:
   - `bundle exec jekyll clean`
   - `bundle exec jekyll serve --host 127.0.0.1 --port 4000`
3. Verify generated source first (`pages/{app}/...`) and then verify `_site/...` output for the same path.

## Rollout Order Recommendation

When extending beyond synergy:

1. `character`
2. `persona`
3. `maps`
4. others

Use the same generator contract and CI pattern for each app.
