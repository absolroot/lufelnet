# SEO Generator Playbook (`scripts/seo`)

This file is a machine-readable playbook for Claude.
When the user requests SEO page generation for any app, read this file first.

---

## Architecture Overview

```
_layouts/default.html
  └─ sets window.__SEO_PATH_LANG__ when page.url starts with /{lang}/
  └─ loads assets/js/language-router.js

assets/js/language-router.js
  └─ isSeoDetailPath() checks __SEO_PATH_LANG__ flag first
  └─ skips all redirect/detection logic for flagged pages
  └─ NO hardcoded app patterns needed — layout flag is generic

apps/{app}/index.html          ← original app page (permalink: /{app}/ or /)
_includes/{app}-body.html      ← extracted body content (shared across languages)
pages/{app}/{lang}/*.html      ← generated SEO pages (permalink: /{lang}/{app}/...)
i18n/pages/{app}/seo-meta.json ← SEO title/description templates per language
scripts/seo/generate-{app}-pages.mjs ← generator script
```

## Two App Types

### Type A: Per-Item Apps (synergy, wonder-weapon, character, persona, ...)

Each item gets its own page per language.

- Reference generators: `scripts/seo/generate-synergy-pages.mjs`, `scripts/seo/generate-character-pages.mjs`
- Reference body: `_includes/synergy-body.html`, `_includes/character-detail-body.html`
- Reference seo-meta: `i18n/pages/synergy/seo-meta.json` (uses `{name}` placeholder)
- Generated output: `pages/synergy/{kr,en,jp}/{codename}.html`
- Also generates: `pages/synergy/roots/*.html` (language root redirects), `pages/synergy/redirects/*.html` (legacy redirects)
- Permalink pattern: `/{lang}/synergy/{codename}/`
- Front matter includes: `layout: default`, `title`, `description`, `image`, `language`, `permalink`, `alternate_urls`, app-specific keys (e.g. `synergy_character`)
- Body: `{% include synergy-body.html %}`

### Type B: Single-Page Apps (home)

One page per language, no per-item iteration.

- Reference generator: `scripts/seo/generate-home-pages.mjs`
- Reference body: `_includes/home-body.html`
- Reference seo-meta: `i18n/pages/home/seo-meta.json` (no `{name}` placeholder)
- Generated output: `pages/home/{kr,en,jp}/index.html`
- No root redirects or legacy redirects needed
- Permalink pattern: `/{lang}/`
- Front matter includes: `layout: default`, `custom_css`, `custom_js`, `custom_data`, `title`, `description`, `image`, `language`, `permalink`, `alternate_urls`
- Body: `{% include home-body.html %}`

---

## Step-by-Step: Adding SEO Pages for a New App

### 1. Read the original app page

Read `apps/{app}/index.html` to understand:
- Front matter fields (`layout`, `custom_css`, `custom_js`, `custom_data`, `permalink`, `language`, `redirect_from`)
- Body content (everything after the `---` closing)
- What data sources it uses

### 2. Create seo-meta.json

Create `i18n/pages/{app}/seo-meta.json`.

For per-item apps (Type A) — use `{name}` placeholder:
```json
{
  "kr": {
    "title": "... {name} ...",
    "description": "... {name} ..."
  },
  "en": {
    "title": "... {name} ...",
    "description": "... {name} ..."
  },
  "jp": {
    "title": "... {name} ...",
    "description": "... {name} ..."
  }
}
```

For single-page apps (Type B) — direct strings, no placeholder:
```json
{
  "kr": { "title": "...", "description": "..." },
  "en": { "title": "...", "description": "..." },
  "jp": { "title": "...", "description": "..." }
}
```

Source the title/description from existing `i18n/pages/{app}/kr.js`, `en.js`, `jp.js` (`seo_title`, `seo_description` keys) or from the original front matter.

### 3. Extract body into include

Create `_includes/{app}-body.html` with ALL content from `apps/{app}/index.html` below the front matter `---`.

Use the synergy-body.html hreflang pattern at the top:
```html
{% if page.alternate_urls %}
{% for alt in page.alternate_urls %}
<link rel="alternate" hreflang="{{ alt[0] }}" href="{{ site.url }}{{ alt[1] }}" />
{% endfor %}
<link rel="alternate" hreflang="x-default" href="{{ site.url }}{{ page.alternate_urls['ko'] | default: page.alternate_urls.first[1] }}" />
{% endif %}
```

For home only: add the replaceState URL normalization script at the very top of `_includes/home-body.html`:
```html
<script>
(function () {
  var params = new URLSearchParams(window.location.search);
  var path = window.location.pathname;
  var lang = params.get('lang');

  if (path === '/' && ['kr', 'en', 'jp'].indexOf(lang) !== -1) {
    params.delete('lang');
    params.delete('v');
    var remainingRoot = params.toString();
    history.replaceState(null, '', '/' + lang + '/' + (remainingRoot ? '?' + remainingRoot : ''));
    return;
  }

  if (/^\/(kr|en|jp)(\/|$)/.test(path)) {
    var before = params.toString();
    params.delete('lang');
    params.delete('v');
    var remaining = params.toString();
    if (before !== remaining) {
      history.replaceState(null, '', path + (remaining ? '?' + remaining : ''));
    }
    return;
  }

  if (path === '/' && params.has('v')) {
    params.delete('v');
    var remainingBase = params.toString();
    history.replaceState(null, '', '/' + (remainingBase ? '?' + remainingBase : ''));
  }
})();
</script>
```

For single-page apps with non-root paths (example: `tier`), use the same pattern with app path mapping:
- `/tier/position-tier/?lang=en&v=...` -> `/en/tier/`
- `/tier/position-tier/?lang=en&list=false&v=...` -> `/en/tier-maker/`
- Set `window.__SEO_PATH_LANG__ = lang` before `replaceState` so `LanguageRouter` does not revert to query-based URL.

For per-item apps: add `?lang=` stripping via replaceState in the body include if the app page uses `?lang=` query params at runtime. The pattern:
- On `/{lang}/{app}/{slug}/` paths, if `?lang=` is present, strip it via `replaceState`.
- Path-based URLs must not retain `lang` query.
- If `?v=` is present (cache/version param), strip it from the visible URL too.

If the body include has IP-based language detection (like `checkAndDetectLanguage`), add a guard to skip on path-based language pages:
```javascript
if (/^\/(kr|en|jp)\//.test(window.location.pathname)) return;
```

### 4. Update the original app page

Rewrite `apps/{app}/index.html` to:
```yaml
---
layout: default
custom_css: [...]
custom_js: [...]
custom_data: [...]
permalink: /{app}/   # or / for home
language: kr
title: "..."
description: "..."
image: "/assets/img/{app}/SEO.png"
alternate_urls:
  ko: /kr/{app}/
  en: /en/{app}/
  jp: /jp/{app}/
---
{% include {app}-body.html %}
```

Critical changes from the original:
- **Remove `redirect_from`** entries that conflict with generated SEO page permalinks (e.g. remove `/kr/` if generating a page at `/kr/`)
- **Update `alternate_urls`** from query-style (`/?lang=en`) to path-style (`/en/`)
- **Add `image`** field
- **Replace body** with `{% include {app}-body.html %}`

### 5. Create the generator script

Create `scripts/seo/generate-{app}-pages.mjs`.

Copy from the closest reference:
- Per-item app → copy `generate-synergy-pages.mjs` or `generate-wonder-weapon-pages.mjs`
- Single-page app → copy `generate-home-pages.mjs`

Key elements every generator must have:
- `normalizeNewline()`, `yamlQuote()`, `toPosix()`, `readJson()` utilities
- `ensureSeoMetaShape()` — validate seo-meta.json structure
- `renderPage()` — generate front matter + `{% include {app}-body.html %}`
- `buildExpectedFiles()` — map of `relativePath -> content`
- `listExistingFiles()` — walk the output directory
- `runCheck()` — compare expected vs actual, exit 1 on drift
- `runGenerate()` — delete output dir, write all files
- `parseMode()` — handle `--check` flag
- `main()` — orchestrate

Generated page front matter must include:
```yaml
layout: default
title: "..."
description: "..."
image: "..."
language: {lang}
permalink: /{lang}/{app}/{slug}/
alternate_urls:
  ko: /kr/{app}/{slug}/
  en: /en/{app}/{slug}/
  jp: /jp/{app}/{slug}/
```

For per-item apps, also include app-specific keys (e.g. `synergy_character`, `wonder_weapon_key`).
Preserve `custom_css`, `custom_js`, `custom_data` from the original app page if the layout/body needs them.

### 6. Add npm scripts

In `package.json`, add:
```json
"seo:{app}:generate": "node scripts/seo/generate-{app}-pages.mjs",
"seo:{app}:check": "node scripts/seo/generate-{app}-pages.mjs --check"
```

### 7. Run and verify

```bash
npm run seo:{app}:generate
npm run seo:{app}:check
```

---

## Language Router Integration

**You do NOT need to modify `assets/js/language-router.js` when adding new apps.**

The mechanism:

1. `_layouts/default.html` has this block (already present):
   ```liquid
   {% assign _seg1 = page.url | remove_first: '/' | split: '/' | first %}
   {% if _seg1 == 'kr' or _seg1 == 'en' or _seg1 == 'jp' or _seg1 == 'cn' %}
   var __SEO_PATH_LANG__ = '{{ _seg1 }}';
   {% endif %}
   ```
2. `LanguageRouter.isSeoDetailPath()` checks `window.__SEO_PATH_LANG__` first.
3. When the flag is set, the router skips: `handleImmediateRedirect`, `initializeLanguageDetection`, `handleLanguageRouting`.

This means any page with permalink `/{lang}/...` and `layout: default` is automatically recognized as an SEO page. No router changes needed.

---

## Critical Gotchas

### redirect_from conflicts
If the original `apps/{app}/index.html` has `redirect_from: [/kr/, /kr/index.html]`, **remove those entries**. They conflict with generated SEO pages that use those permalinks.

### Infinite redirect loops
These happen when:
1. `language-router.js` sees `/{lang}/` and tries to redirect to `/?lang={lang}` (old behavior)
2. Page code sees `?lang={lang}` and replaceState back to `/{lang}/`
3. Router runs again on DOMContentLoaded/load events

Prevention: the `__SEO_PATH_LANG__` flag prevents step 1. Ensure it is set BEFORE language-router.js loads (it is — both are in the same `<script>` block in the layout).

### replaceState vs location.replace
- ALWAYS use `history.replaceState` for URL normalization on SEO pages.
- NEVER use `window.location.replace` — it causes page reload and potential loops.

### lang query stripping
Path-based language pages (`/{lang}/...`) must strip `?lang=` from the URL via `replaceState`. The language is in the path; the query param is redundant and confusing.

### version query stripping
Path-based canonical URLs should also strip `?v=` via `replaceState`. Keep `v` for resource loading, but do not keep it in the final visible page URL.

### root canonicalization for wonder-weapon
`/{lang}/wonder-weapon/` currently uses generated root stubs that may land on `/wonder-weapon/?lang={lang}` first. The app must normalize back to `/{lang}/wonder-weapon/` early via `replaceState`, and remove `lang`/`v` from the final URL.

### IP detection skip
Any IP-based language detection code in body includes (`checkAndDetectLanguage` or similar) must skip on path-based language pages. Add this guard:
```javascript
if (/^\/(kr|en|jp)\//.test(window.location.pathname)) return;
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `_layouts/default.html` | Sets `__SEO_PATH_LANG__`, loads language-router.js |
| `assets/js/language-router.js` | Global routing, `isSeoDetailPath()` with flag check |
| `scripts/seo/generate-synergy-pages.mjs` | Reference: per-item generator (Type A) |
| `scripts/seo/generate-wonder-weapon-pages.mjs` | Reference: per-item generator with slug map (Type A) |
| `scripts/seo/generate-home-pages.mjs` | Reference: single-page generator (Type B) |
| `_includes/synergy-body.html` | Reference: per-item body include |
| `_includes/wonder-weapon-body.html` | Reference: per-item body include |
| `_includes/character-detail-body.html` | Character detail body include with URL rewrite |
| `_includes/home-body.html` | Reference: single-page body include with replaceState |
| `i18n/pages/synergy/seo-meta.json` | Reference: seo-meta with `{name}` placeholder |
| `i18n/pages/home/seo-meta.json` | Reference: seo-meta without placeholder |
| `apps/home/index.html` | Reference: updated original page using include |
| `package.json` | npm scripts for generate/check |

## Current Implementation Status

| App | Type | Generator | Status |
|-----|------|-----------|--------|
| home | B (single-page) | `generate-home-pages.mjs` | Done |
| synergy | A (per-item) | `generate-synergy-pages.mjs` | Done |
| wonder-weapon | A (per-item) | `generate-wonder-weapon-pages.mjs` | Done |
| character | A (per-item) | `generate-character-pages.mjs` | Done |
| tier | B (single-page) | `generate-tier-pages.mjs` | Done |
| schedule | B (single-page) | `generate-schedule-pages.mjs` | Done |
| defense-calc | B (single-page) | `generate-defense-calc-pages.mjs` | Done |
| critical-calc | B (single-page) | `generate-critical-calc-pages.mjs` | Done |
| material-calc | B (single-page) | `generate-material-calc-pages.mjs` | Done |
| pull-calc | B (single-page) | `generate-pull-calc-pages.mjs` | Done |
| pull-tracker (individual/global/guide) | Hybrid (multi single-page) | `generate-pull-tracker-pages.mjs` | Done |
| about | B (single-page) | `generate-about-pages.mjs` | Done |
| gallery | B (single-page) | `generate-gallery-pages.mjs` | Done |
| astrolabe | B (single-page) | `generate-astrolabe-pages.mjs` | Done |
| article (guides list + detail) | Hybrid (single-page + per-item) | `generate-article-pages.mjs` | Done |
| persona | A (per-item) | `generate-persona-pages.mjs` | Done |
| maps | B (single-page) | `generate-maps-pages.mjs` | Done |

## URL Patterns

| Page | Canonical URLs |
|------|---------------|
| Home | `/` (kr default), `/kr/`, `/en/`, `/jp/` |
| Synergy | `/kr/synergy/{codename}/`, `/en/synergy/{codename}/`, `/jp/synergy/{codename}/` |
| Wonder Weapon | `/kr/wonder-weapon/{slug}/`, `/en/wonder-weapon/{slug}/`, `/jp/wonder-weapon/{slug}/` |
| Character (detail) | `/kr/character/{slug}/`, `/en/character/{slug}/`, `/jp/character/{slug}/` |
| Character (list) | `/character/` (default), `/kr/character/`, `/en/character/`, `/jp/character/` |
| Tier (list) | `/kr/tier/`, `/en/tier/`, `/jp/tier/` |
| Tier Maker | `/kr/tier-maker/`, `/en/tier-maker/`, `/jp/tier-maker/` |
| Schedule | `/kr/schedule/`, `/en/schedule/`, `/jp/schedule/` |
| Defense Calc | `/kr/defense-calc/`, `/en/defense-calc/`, `/jp/defense-calc/` |
| Critical Calc | `/kr/critical-calc/`, `/en/critical-calc/`, `/jp/critical-calc/` |
| Material Calc | `/kr/material-calc/`, `/en/material-calc/`, `/jp/material-calc/` |
| Pull Calc | `/kr/pull-calc/`, `/en/pull-calc/`, `/jp/pull-calc/` |
| Pull Tracker (individual) | `/kr/pull-tracker/`, `/en/pull-tracker/`, `/jp/pull-tracker/` |
| Pull Tracker (global) | `/kr/pull-tracker/global-stats/`, `/en/pull-tracker/global-stats/`, `/jp/pull-tracker/global-stats/` |
| Pull Tracker (guide) | `/kr/pull-tracker/url-guide/`, `/en/pull-tracker/url-guide/`, `/jp/pull-tracker/url-guide/` |
| About | `/kr/about/`, `/en/about/`, `/jp/about/` |
| Gallery | `/kr/gallery/`, `/en/gallery/`, `/jp/gallery/` |
| Maps | `/kr/maps/`, `/en/maps/`, `/jp/maps/` |
| Article (guides list) | `/kr/article/`, `/en/article/`, `/jp/article/` |
| Article (guide detail) | `/kr/article/{id}/`, `/en/article/{id}/`, `/jp/article/{id}/` |
| Persona (detail) | `/kr/persona/{slug}/`, `/en/persona/{slug}/`, `/jp/persona/{slug}/` |
| Persona (list) | `/persona/` (default), `/kr/persona/`, `/en/persona/`, `/jp/persona/` |

Legacy URLs redirect to canonical via generated stub pages (`layout: null`).
Language root URLs (`/{lang}/{app}/`) redirect to `/{app}/?lang={lang}` via generated root stubs.
For canonical UX, runtime scripts can still normalize this to `/{lang}/{app}/` using `history.replaceState`.

### URL Rewriting (replaceState)

Legacy query-based URLs are rewritten to clean path-based URLs via `history.replaceState` on page load. This updates the URL bar without a page reload or redirect.

| Legacy URL | Rewritten to |
|-----------|-------------|
| `/?lang=en` | `/en/` |
| `/?lang=en&v=4.4.7` | `/en/` |
| `/character.html?name=렌&lang=en` | `/en/character/joker/` |
| `/character/?lang=en` | `/en/character/` |
| `/en/wonder-weapon/?v=4.4.7` | `/en/wonder-weapon/` |
| `/tier/position-tier/?lang=en&v=4.4.8` | `/en/tier/` |
| `/tier/position-tier/?lang=en&list=false&v=4.4.8` | `/en/tier-maker/` |
| `/schedule/?lang=en&v=4.4.8` | `/en/schedule/` |
| `/defense-calc/?lang=en&v=4.4.8` | `/en/defense-calc/` |
| `/critical-calc/?lang=en&v=4.4.8` | `/en/critical-calc/` |
| `/material-calc/?lang=en&v=4.4.8` | `/en/material-calc/` |
| `/pull-calc/?lang=en&v=4.4.8` | `/en/pull-calc/` |
| `/pull-tracker/?lang=en&v=4.4.8` | `/en/pull-tracker/` |
| `/pull-tracker/global-stats/?lang=en&v=4.4.8` | `/en/pull-tracker/global-stats/` |
| `/pull-tracker/url-guide/?lang=en&v=4.4.8` | `/en/pull-tracker/url-guide/` |
| `/about/?lang=en&v=4.4.8` | `/en/about/` |
| `/gallery/?lang=en&v=4.4.8` | `/en/gallery/` |
| `/maps/?lang=en&v=4.4.8` | `/en/maps/` |
| `/en/maps/?lang=en&v=4.4.8` | `/en/maps/` |
| `/article/?lang=en&v=4.4.8` | `/en/article/` |
| `/article/technical-master/?lang=en&v=4.4.8` | `/en/article/technical-master/` |
| `/article/view/?id=technical-master&lang=en&v=4.4.8` | `/en/article/technical-master/` |
| `/persona/?name=야노식&lang=en` | `/en/persona/janosik/` |
| `/persona/?lang=en&v=4.4.9` | `/en/persona/` |

The rewrite scripts are placed at the top of the body include or page, before any other scripts, so they run early. They use the `__*_SLUG_MAP` data (injected via Jekyll) to resolve slugs.

For app paths not listed in `LanguageRouter.isSeoDetailPath()` (e.g. `tier`), set `window.__SEO_PATH_LANG__ = lang` before `replaceState` when rewriting query URLs to path URLs.

## Sitemap Policy (Canonical-Only)

### Architecture

- `sitemap.xml` is now an index file only.
- Child sitemaps are split by scope/language:
  - `sitemaps/sitemap-core.xml`
  - `sitemaps/sitemap-ko.xml`
  - `sitemaps/sitemap-en.xml`
  - `sitemaps/sitemap-ja.xml`
  - `sitemaps/sitemap-zh.xml`

### Inclusion Rules

A page is included only when all of the following are true:

- `layout != null`
- `sitemap != false`
- `sitemap.exclude != true`
- URL does not contain `.xml`, `assets`, or `?`
- URL matches canonical path style (legacy redirect paths are excluded by rule)

### hreflang Normalization

Sitemap hreflang is emitted through `_includes/sitemap-hreflang-links.xml` only.
Input keys from `alternate_urls` are normalized:

- `ko` or `kr` -> `ko`
- `en` -> `en`
- `ja` or `jp` -> `ja`
- `zh-CN` or `cn` -> `zh-CN`
- `zh-TW` or `tw` -> `zh-TW`

`x-default` uses `ko` alternate first; if missing, it falls back to the page's own canonical URL.

### Metadata Policy

- `<lastmod>` is emitted only when `page.sitemap.lastmod` exists.
- `<changefreq>` is emitted only when `page.sitemap.changefreq` exists.
- `<priority>` is emitted only when `page.sitemap.priority` exists.
- No global default date/frequency/priority is injected.

### Redirect Contract

All redirect/stub pages must include:

- `sitemap: false`
- `<meta name="robots" content="noindex,nofollow">`

This includes generated root and legacy redirect stubs, and any JS redirect list stubs.

### Commands

- Generate all SEO pages (maps excluded):
  - `npm run seo:all:generate`
- Check all SEO generated pages (maps excluded):
  - `npm run seo:all:check`
- Validate built sitemap outputs:
  - `npm run seo:sitemap:check`

`seo:sitemap:check` validates:

- sitemap index references exactly 5 child sitemaps
- no duplicate `<loc>` per child sitemap
- no query URLs (`?lang=` 포함) in `<loc>`
- no legacy non-language detail URLs (`/character/{slug}/` etc.)
- no forbidden hreflang (`jp`, `kr`, `cn`, `tw`)
- `sitemap: false` pages are not present in sitemap outputs
- CN sitemap stays canonical and currently centered on `/cn/astrolabe/`
- UTF-8 without BOM for sitemap-related source/output files

## Encoding and File Safety

- Write as UTF-8 without BOM.
- Normalize line endings to LF (`\n`) in generated content.
- Avoid locale-dependent sorting.
- Keep YAML front matter stable to avoid noisy diffs.

## Supported Languages

- `kr`, `en`, `jp` — full support now.
- `cn` — route-ready globally. SEO page generation is currently enabled for `astrolabe`.
