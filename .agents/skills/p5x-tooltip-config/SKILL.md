---
name: p5x-tooltip-config
description: Generate and verify official P5X skill tooltips for Lufelnet when adding a character, Persona, or terminology update. Use for Config skill links, IANT sync, and EN/JP tooltip grouping.
---

# P5X skill tooltips

Keep IANT-managed descriptions as plain text. The renderer reads generated locale packs from `data/tooltips/`. The patch console compares and updates the original description fields independently.

1. After adding a character or Persona or refreshing Config, run `npm run tooltips:generate` and `npm run tooltips:check`. KR/CN use `default/ConfSkillTips.json` and `battle/ConfSkill.json`. EN/JP use the corresponding `conftranslationen` or `conftranslationjp` tables `ConfSkillTips_XX.json` and `ConfSkill_XX.json`.
2. Run `npm run tooltips:audit -- "<site character or Persona key>"`. For a linked skill that misses, compare the rendered description with the same Config skill ID and locale. Differences in numbers and punctuation can still match. Descriptions that differ in wording require review.
3. If the site uses different wording and the same Config skill ID confirms the intended link, add a scoped entry to the optional `data/tooltips/overrides.json` array. Each entry has `lang`, the exact site description in `text`, and `links` with numeric `id`, visible `phrase`, and optional one-based `occurrence`. Keep official grouping intact. Use this only when the existing linked span has a clear counterpart.
4. Run `npm run assets:hashes:generate` and `npm run site:build`. Commit the generated language packs with any reviewed overrides. CI validates packs with `npm run tooltips:validate` without local Config.

Verify hover on a linked occurrence and plain text on an unlinked occurrence. On mobile, verify tapping the linked phrase. Plain English keywords are not a basis for adding links. A missing or ambiguous official match must not become a global keyword rule.

When KR/CN has a tooltip ID that EN/JP does not yet publish, add the translated description and the visible site phrases for each locale to `data/tooltips/provisional.json`. A phrase can also be `{ "phrase": "...", "before": "..." }` to identify a particular occurrence. Generation only transfers positions from a verified KR/CN link in the corresponding skill field. Check the localized field with `tooltips:audit`; unclear positions are skipped. When the corresponding EN/JP Config tables supply the ID and links, regeneration gives them priority and removes the provisional label for that ID.
