# SEO Generator Playbook (`scripts/seo`)

This directory is not only for `synergy`.  
It is the shared playbook for building SEO generators for any app (`character`, `persona`, `maps`, `synergy`, ...).

## Goals

- Generate stable, crawlable SEO pages from source-of-truth data.
- Keep runtime UI behavior unchanged while improving static URL coverage.
- Make generation deterministic so CI drift checks are reliable.
- Keep i18n-compatible structure for `kr`, `en`, `jp` now, and `cn` later.

## Current Implementation

- Generator: `scripts/seo/generate-synergy-pages.mjs`
- Commands:
  - `npm run seo:synergy:generate`
  - `npm run seo:synergy:check`
- Output:
  - Character pages: `pages/synergy/{kr,en,jp}/*.html`
  - Root redirects: `pages/synergy/roots/*.html`

## URL Compatibility Policy

For every generated app, define:

1. Canonical permalink
2. Legacy compatibility paths (`redirect_from`)
3. Language-root redirects (`redirect_to`)

Synergy example:

- Canonical KR character path: `/synergy/{codename}/`
- Legacy KR path allowed: `/kr/synergy/{codename}/`
- Language root redirects:
  - `/en/synergy/` -> `/synergy/?lang=en`
  - `/jp/synergy/` -> `/synergy/?lang=jp`
  - `/cn/synergy/` -> `/synergy/?lang=cn`

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

## Rollout Order Recommendation

When extending beyond synergy:

1. `character`
2. `persona`
3. `maps`
4. others

Use the same generator contract and CI pattern for each app.
