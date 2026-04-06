# CN Localization Handoff

Updated: 2026-04-06

## Authority

- `_config/` is the default authority for CN backfills.
- `_config/` is now ignored locally via `.gitignore`.
- Do not use dangling blobs or manual recovery as the normal path anymore.

## Scope Completed

- `data/character_info.js`
  - `name_cn` backfilled from `_config/Config_KR` / `_config/Config_CN` same-`sn` matching.
  - `persona_cn` backfilled from config same-`sn` matching.
  - Manual persona CN overrides already applied:
    - 코로마루 `케르베로스` -> `克鲁贝洛斯`
    - 아케치 `로빈후드` -> `罗宾汉`
    - 카스미 `상드리옹` -> `灰姑娘`

- `data/kr/wonder/weapons.js`
  - Main wonder `name_cn`, `effect_cn` filled.
  - `lightning_stamp.name_cn`, `lightning_stamp.effect_cn` filled.
  - `shard.desc_cn` filled.
  - Wonder CN is config-backed, not just external copy.

- `data/characters/*`
  - CN detail blocks regenerated for `skill.js`, `weapon.js`, `ritual.js`, and some `innate.js`.
  - CN no longer contains accidental Korean copies.
  - Important rule: `skill.element` in CN must stay identical to KR, same as EN/JP behavior.
  - `weapon.skill_name` is allowed to stay blank if no reliable CN source exists.
  - If external `highlight_skill.name` is just `HIGHLIGHT`, but the actual title is embedded as the first line of `desc`, extract that title into CN `skill_highlight.name`.

- `data/persona/*`
  - Current audit found no CN gaps for the targeted persona fields handled by the existing patch flow.

- `data/cn/revelations/revelations.js`
  - Fully rebuilt from KR + config matching.
  - Main/sub names, `sub_effects`, `set_effects`, and `type` all resolved.
  - Resolver handles raw `A&B` pair titles, `방해` <-> `교란` alias matching, and desc-similarity fallback for reused KR effect text.
  - Current audit result: unresolved `0`, CN Hangul payload `0`.

- `data/cn/calc/critical-data.js`
- `data/cn/calc/defense-data.js`
  - CN calc payloads are generated from KR calc data via `.tmp/cn-audit/lib/calc-cn.mjs`.
  - Added CN calc fields:
    - `skillName_cn`
    - `note_cn`
    - `type_cn`
    - `target_cn`
    - `duration_cn`
    - `options_cn`
  - Current calc audit result: unresolved `0`, missing localized fields `0`, CN Hangul payload `0`.

- `i18n/common/cn.js` and `i18n/pages/*/cn.js`
  - CN i18n bundles were created/refreshed from `_config/Config_KR` + `_config/Config_CN`.
  - Generation is handled by `scripts/generate-cn-i18n.mjs`.
  - Matching priority is config-backed same-context matching first, then conservative fallbacks.
  - Unresolved or ambiguous strings remain KR fallback instead of being manually translated.

- CN runtime / language routing
  - `i18n/service/i18n-service.js`, `i18n/service/i18n-adapter.js`, and `i18n/service/i18n-compat.js` now recognize `cn`.
  - `assets/js/language-router.js` is the shared KR-like language rule entry point.
  - CN should behave like KR for release/content gating, not like EN/JP global gating.
  - KR-like branching was patched in key pages and calculators including:
    - `apps/material-calc/material-planner.js`
    - `_includes/character-detail-body.html`
    - `apps/tactic-maker/js/data-loader.js`
    - `assets/js/tactic/setparty.js`
    - `assets/js/tactic/setwonder.js`
    - `assets/js/tactics-viewer.js`
    - `apps/schedule/schedule.js`
    - `apps/synergy/synergy.js`
    - `apps/tactic-maker/js/need-stat-state.js`
    - `apps/tactic-maker/js/ui-critical-card.js`
    - `apps/critical-calc/critical-calc.js`
    - `apps/defense-calc/defense-calc.js`
  - `maps` can show CN UI labels, but still falls back to KR data when CN map data is absent.
  - `apps/tactic-maker/js/data-loader.js` now loads `data/cn/calc/*.js` only when current language is `cn`; other languages still use KR calc data with embedded EN/JP fields.

## Working Files

- Temp project root: `.tmp/cn-audit/`
- Common helpers:
  - `.tmp/cn-audit/lib/common.mjs`
  - `.tmp/cn-audit/lib/character-detail-cn.mjs`
  - `.tmp/cn-audit/lib/wonder-cn-config.mjs`
  - `.tmp/cn-audit/lib/revelation-cn.mjs`
  - `.tmp/cn-audit/lib/calc-cn.mjs`

- Character / wonder / revelation scripts:
  - `.tmp/cn-audit/audit-character-cn.mjs`
  - `.tmp/cn-audit/patch-character-info-cn.mjs`
  - `.tmp/cn-audit/audit-character-detail-cn.mjs`
  - `.tmp/cn-audit/patch-character-detail-cn.mjs`
  - `.tmp/cn-audit/audit-wonder-cn.mjs`
  - `.tmp/cn-audit/patch-wonder-cn.mjs`
  - `.tmp/cn-audit/audit-revelation-cn.mjs`
  - `.tmp/cn-audit/patch-revelation-cn.mjs`
  - `.tmp/cn-audit/audit-calc-cn.mjs`
  - `.tmp/cn-audit/patch-calc-cn.mjs`
  - `scripts/generate-cn-i18n.mjs`

- Reports:
  - `.tmp/cn-audit/reports/summary.json`
  - `.tmp/cn-audit/reports/summary.md`
  - `.tmp/cn-audit/reports/calc-cn-audit.json`
  - `.tmp/cn-audit/reports/calc-cn-audit.md`
  - `.tmp/cn-audit/reports/revelation-missing.json`
  - `.tmp/cn-audit/reports/revelation-missing.md`
  - `.tmp/cn-audit/reports/generate-cn-i18n/report.json`

## Rules That Were Settled

- CN generation priority:
  - config same-`sn` first
  - external fallback second
  - if neither is reliable, do not leave Korean inside CN payload

- CN i18n generation:
  - do not invent CN game terms
  - use config-backed matches first
  - if needed, use paired KR/CN fields from `data/*`
  - if still ambiguous, keep KR fallback and leave it unresolved in the audit report
  - keep CN audit outputs in `.tmp/cn-audit`, not under `i18n/`

- Character detail CN:
  - `skill.element` remains KR text
  - `weapon.skill_name` may remain blank
  - `type` can be inferred from KR/EN/JP sibling slots if config lacks a direct CN display label

- Revelation CN:
  - Use `_config/Config_KR/battle/ConfSkill.json` and `_config/Config_CN/battle/ConfSkill.json` same-`sn`
  - Use `ConfSkillBuff` to recover direct main/sub CN names when needed
  - Do not reuse the old `apps/patch-console/patch-revelation.mjs` bootstrap logic for CN as-is; it originally copied KR into CN
  - Pair resolver must also support raw `main&sub` titles and KR aliases like `방해` <-> `교란`

## Validation Rules

- Always keep UTF-8 without BOM.
- Re-run audits after patching, not during.
- Past failure mode:
  - CN content looked filled but Korean text had been copied into CN blocks.
  - Verify actual payload text, not just field presence.

- Key checks used:
  - No Hangul in CN payloads except `skill.element`
  - No BOM in modified files
  - `skill.element` KR/CN equality
  - No blank CN strings except approved exceptions like `weapon.skill_name`
  - CN pages should follow KR-like runtime branches when the page has release/content gating logic

- Current verification state on 2026-04-06:
  - `data/character_info.js`: unresolved only `원더`
  - `data/kr/wonder/weapons.js`: main/stamp/shard CN gaps `0`
  - `data/cn/revelations/revelations.js`: unresolved `0`
  - `data/characters/*`: Hangul outside CN `element` `0`, unexpected blanks `0`
  - `data/cn/calc/*`: issue count `0`

## Build / CI Notes

- GitHub Actions Jekyll workflow currently runs on:
  - `push` to `main`
  - `pull_request` targeting `main`
- Pushing a separate feature branch by itself does not trigger this Jekyll workflow.
- Opening a PR to `main` will trigger the Jekyll workflow.
- Local Jekyll build was verified with:
  - Homebrew `ruby@3.3`
  - Bundler `2.6.6`
  - `bundle exec jekyll build`
- Local shell setup had to be updated so new terminals use Homebrew Ruby instead of system Ruby 2.6.

## Pending Work

- CN calc route exposure is still separate from data generation.
  - `data/cn/calc/*` exists and runtime readers are CN-aware now.
  - If true path-based CN pages are required for critical/defense calculators, frontmatter/page routing still needs to be reviewed.
- There are still unresolved CN i18n entries in `.tmp/cn-audit/reports/generate-cn-i18n/report.json`; review those before any manual translation.

## Reset Recovery Notes

- Reset recovery entry point:
  - `.tmp/cn-audit/recover-after-reset.mjs`
- Old blob/manual recovery is deprecated.
- Current recovery behavior:
  - rerun config/external-backed patchers in sequence
  - rerun audits
  - write summary JSON to `.tmp/cn-audit/reports/recover-after-reset.json`

## Quick Resume Checklist

1. If needed, review whether `critical-calc` / `defense-calc` need dedicated CN page/frontmatter entries.
2. If more CN coverage is needed, continue from `.tmp/cn-audit/reports/generate-cn-i18n/report.json`.
3. Re-verify:
   - CN display uses CN data, not KR fallback
   - no BOM
   - no accidental Hangul in CN-only payload fields
