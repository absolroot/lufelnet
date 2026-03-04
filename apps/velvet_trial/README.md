# Velvet Trial App (`apps/velvet_trial`)

This document is a handoff guide for the Velvet Trial page.

## 1) Scope and URLs

- Main domain key: `velvet-trial`
- Legacy root URL: `/velvet-trial/`
- Canonical list URLs:
  - `/kr/velvet-trial/`
  - `/en/velvet-trial/`
  - `/jp/velvet-trial/`
- Canonical detail URLs:
  - `/kr/velvet-trial/chapter-{chapterSn}/stage-{stageNum}/`
  - `/en/velvet-trial/chapter-{chapterSn}/stage-{stageNum}/`
  - `/jp/velvet-trial/chapter-{chapterSn}/stage-{stageNum}/`

## 2) File Map

Core app:
- `apps/velvet_trial/index.html`
- `apps/velvet_trial/css/style.css`
- `apps/velvet_trial/js/config.js`
- `apps/velvet_trial/js/i18n.js`
- `apps/velvet_trial/js/data-loader.js`
- `apps/velvet_trial/js/adapt-sprite.js`
- `apps/velvet_trial/js/render.js`
- `apps/velvet_trial/js/main.js`
- `apps/velvet_trial/data/kr.json`
- `apps/velvet_trial/data/en.json`
- `apps/velvet_trial/data/jp.json`
- `apps/velvet_trial/data/recommendations/chapter-1/round-{levelSn}-{phase}.json`
- `apps/velvet_trial/data/recommendations/chapter-2/round-{levelSn}-{phase}.json`
- `apps/velvet_trial/data/recommendations/chapter-3/round-{levelSn}-{phase}.json`
- `apps/velvet_trial/data/recommendations/chapter-4/round-{levelSn}-{phase}.json`
- `apps/velvet_trial/data/recommendations/chapter-5/round-{levelSn}-{phase}.json`

Page include / SEO pages:
- `_includes/velvet-trial-body.html`
- `pages/velvet-trial/kr/index.html`
- `pages/velvet-trial/en/index.html`
- `pages/velvet-trial/jp/index.html`
- `pages/velvet-trial/{lang}/chapter-{chapterSn}/stage-{stageNum}.html`

Data + SEO scripts:
- `scripts/velvet-trial/generate-velvet-trial-data.mjs`
- `scripts/velvet-trial/generate-velvet-trial-recommend-base.mjs`
- `scripts/seo/generate-velvet-trial-pages.mjs`

I18n packs:
- `i18n/pages/velvet-trial/kr.js`
- `i18n/pages/velvet-trial/en.js`
- `i18n/pages/velvet-trial/jp.js`
- `i18n/pages/velvet-trial/seo-meta.json`

## 3) Runtime Architecture

Script responsibilities:
- `config.js`: URL builders
- `i18n.js`: language detection + translation lookup
- `data-loader.js`: JSON fetch + cache
- `adapt-sprite.js`: weakness/resistance sprite marks
- `render.js`: tabs, levels, conditions, phases, monsters, recommendations
- `main.js`: initialize i18n, load data, render, SEO hook

Current recommendation runtime model:
- Manual-only rendering (runtime auto default fallback is disabled)
- Recommendation files are loaded per chapter/round JSON
- Character lookup source is `data/character_info.js`
- All character roles are supported using common i18n position keys:
- `medic`, `saboteur`, `assassin`, `guardian`, `strategist`, `sweeper`, `elucidator`, `virtuoso`, `other`

## 4) Data Pipeline

Velvet trial core data source roots:
- `config_db/KR_Config`
- `config_db/EN_Config`
- `config_db/JP_Config`

Generator:
- `scripts/velvet-trial/generate-velvet-trial-data.mjs`

Output:
- `apps/velvet_trial/data/kr.json`
- `apps/velvet_trial/data/en.json`
- `apps/velvet_trial/data/jp.json`

Dataset snapshot:
- chapters: `5`
- total levels: `140`
- total phases: `175`

## 5) Recommendation Data Format

Path:
- `apps/velvet_trial/data/recommendations/chapter-{chapterSn}/round-{levelSn}-{phase}.json`

Round file shape:
```json
{
  "chapterSn": 1,
  "levelSn": 106,
  "levelNum": 6,
  "phase": 2,
  "characters": ["Character A", "Character B"],
  "personas": []
}
```

Manual entry rules:
- `characters` / `personas` can contain:
- `"Name String"`
- `{ "name": "Name" }`
- `{ "nameByLang": { "kr": "...", "en": "...", "jp": "..." } }`
- `elementKey` and `imageFile` are optional

Auto resolution behavior:
- Character string names are matched to `character_info.js`, so display name/image/meta are filled automatically.
- Persona string names can omit `imageFile`; renderer infers `{name}.webp` under `assets/img/persona/`.

## 6) Recommendation Generator

Script:
- `scripts/velvet-trial/generate-velvet-trial-recommend-base.mjs`

What it does:
- Reads `apps/velvet_trial/data/kr.json` and `data/character_info.js`
- Creates round files for all chapter/level/phase combinations (`175` files)
- Fills `characters` by weakness analysis:
- phase weakness elements are ranked by frequency
- for each matched element, all roles of characters with that element are appended (release order desc)
- removes duplicates while preserving order
- writes empty `personas` array by default

Legacy cleanup:
- Removes old flat files like `chapter-1.json` and old recommendation-base files.

## 7) Build / Check Commands

Data:
- `npm run velvet-trial:data:generate`
- `npm run velvet-trial:data:check`

Recommendation rounds:
- `npm run velvet-trial:recommend-base:generate`
- `npm run velvet-trial:recommend-base:check`

SEO:
- `npm run seo:velvet-trial:generate`
- `npm run seo:velvet-trial:check`

## 8) Change Playbook

When updating Velvet Trial raw content:
- update `config_db/*`
- run `npm run velvet-trial:data:generate`

When updating recommendation templates:
- run `npm run velvet-trial:recommend-base:generate`
- edit round files under `apps/velvet_trial/data/recommendations/chapter-{sn}/`

When changing UI:
- edit `apps/velvet_trial/js/render.js`
- edit `apps/velvet_trial/css/style.css`

## 9) Constraints

- Supported page languages: `kr`, `en`, `jp`
- CN route is out of scope for this page currently
- Save edited files as UTF-8 without BOM
