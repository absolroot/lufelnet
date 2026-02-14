# 서비스별 i18n 처리 현황

기준일: 2026-02-14
정리 대상: `i18n-migration-report.md`의 #1~#6

## 1. 통합 i18n 완료 서비스(핵심 흐름)

| 서비스 | 분류 | 근거 |
| --- | --- | --- |
| `astrolabe` | 통합 i18n 완료 | `apps/astrolabe/index.html:123`~`apps/astrolabe/index.html:128`에서 페이지 번들 로드, `apps/astrolabe/js/i18n.js:5`, `apps/astrolabe/js/adapt-sprite.js:53`에서 `I18N_PAGE_ASTROLABE_*` 및 `AstrolabeI18n.getAdaptLabel()` 사용 |
| `critical-calc` | 통합 i18n 완료 | `apps/critical-calc/index.html:178`~`apps/critical-calc/index.html:180` 페이지 번들 로드, `assets/js/critical-calc.js:134`에서 `I18N_PAGE_CRITICAL_CALC_*` 참조 |
| `defense-calc` | 통합 i18n 완료 | `apps/defense-calc/index.html:362`~`apps/defense-calc/index.html:364` 페이지 번들 로드, `assets/js/defense/defense-i18n.js:55`, `assets/js/defense/defense-i18n.js:554`에서 페이지 번들 기반 번역 적용 |
| `maps` | 통합 i18n 완료 | 페이지 번들 로드 및 `MapsI18n` 기반 조회 사용. 잔존 로컬 맵(`progressLabels`, `messages`, `fallbackText`, 로컬 `adaptLabels`)을 페이지 번들 키로 전환: `apps/maps/object-filter-panel.js:303`, `apps/maps/object-filter-panel.js:999`, `apps/maps/object-click-handler.js:141`, `apps/maps/object-click-handler.js:233`, `i18n/pages/maps/kr.js:21` |
| `synergy` | 통합 i18n 완료 | `apps/synergy/synergy.js:350`, `apps/synergy/item_from.js:96`, `apps/synergy/soulmate.js:91`, `apps/synergy/synergy_search.js:58`에서 로컬 번역 맵을 `i18n/pages/synergy/*` 키 조회로 전환. 레거시 `apps/synergy/friends/synergy_translate.js` 제거 |

## 2. 로컬 i18n 잔존 서비스(서비스 기준)

| 서비스 | 상태 | 대표 잔존 위치 |
| --- | --- | --- |
| `pull-calc` | 로컬 i18n 잔존 | `apps/pull-calc/pull-calc-i18n.js:7`, `apps/pull-calc/pull-calc-i18n.js:257`, `apps/pull-calc/pull-calc.js:518` |
| `pull-tracker` | 로컬 i18n 잔존 | `apps/pull-tracker/js/pull-tracker.js:3`, `apps/pull-tracker/js/global-stats.js:6`, `apps/pull-tracker/js/manual-editor.js:16`, `apps/pull-tracker/js/import.js:6`, `apps/pull-tracker/js/export.js:6`, `apps/pull-tracker/url-guide.html:589`, `apps/pull-tracker/url-guide.html:686` |
| `schedule` | 로컬 i18n 잔존 | `apps/schedule/index.html:126`, `apps/schedule/schedule.js:307`, `apps/schedule/schedule.js:937`, `apps/schedule/schedule.js:983`, `apps/schedule/schedule.js:1010`, `apps/schedule/schedule.js:1039` |
| `gallery` | 로컬 i18n 잔존 | `apps/gallery/gallery-tags.js:32`, `apps/gallery/gallery-tags.js:54` |
| `tier` | 부분 잔존 | `apps/tier/position-tier-qa.js:1` |
| `tactic-maker` | 부분 잔존 | `apps/tactic-maker/js/ui-tactic.js:264`, `apps/tactic-maker/js/ui-tactic.js:1207`, `apps/tactic-maker/js/ui-tactic.js:2358` |
| `wonder-weapon` | 부분 잔존 | `apps/wonder-weapon/wonder-weapon.js:138` |

## 3. 레거시/중복 잔존

| 서비스 | 상태 | 위치 |
| --- | --- | --- |
| `tactic` | 페이지 번들 참조 중, fallback 성격 코드 잔존 | `apps/tactic/index.html:522`, `i18n/pages/tactic/en.js:2`, `i18n/pages/tactic/jp.js:2` |

## 4. 결론

- `##5` 이슈(맵스 소규모 로컬 문자열)는 **해결됨**.
- 현재 기준 완전 통합 완료 서비스: `astrolabe`, `critical-calc`, `defense-calc`, `maps`, `synergy`.

