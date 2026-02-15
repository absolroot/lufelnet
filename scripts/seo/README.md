# Synergy SEO Generator

`scripts/seo/generate-synergy-pages.mjs` manages all generated synergy SEO pages.

## Commands

- `npm run seo:synergy:generate`
  - Regenerates `pages/synergy/**` (character pages + language root redirect stubs).
- `npm run seo:synergy:check`
  - Checks drift without writing files.
  - Exits non-zero if generated output is stale.

## Source Priority

1. Character source of truth: `apps/synergy/friends/friend_num.json`
2. Codename source: `data/character_info.js` (`codename`)
3. Codename fallback: `friend_num.json.name_en` slug
4. SEO meta templates: `i18n/pages/synergy/seo-meta.json`

If codename is missing from both `character_info.js` and `friend_num.json.name_en`, generation fails.

## Generated Output

- Character pages:
  - `pages/synergy/kr/{codename}.html`
  - `pages/synergy/en/{codename}.html`
  - `pages/synergy/jp/{codename}.html`
- Root redirect stubs:
  - `/en/synergy/` -> `/synergy/?lang=en`
  - `/jp/synergy/` -> `/synergy/?lang=jp`
  - `/cn/synergy/` -> `/synergy/?lang=cn`
  - Managed in: `pages/synergy/roots/*.html`

## Collision Handling

If two characters resolve to the same codename slug, generation fails with a collision error.

## Encoding Rules

- Write files as UTF-8 without BOM.
- Use LF (`\n`) line endings.

## CI Behavior

- `fetch-synergy` workflow runs generation after data sync and commits both data and generated pages.
- `jekyll` workflow runs:
  - `seo:synergy:check` on pull requests (drift guard)
  - `seo:synergy:generate` before build (deployment safety net)

Because of this, manual execution is not required for normal synergy updates.
