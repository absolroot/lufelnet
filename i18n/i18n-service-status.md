# 서비스별 i18n 처리 현황

기준일: 2026-02-14  
점검 범위: `apps` 하위 26개 서비스 전수 점검

## 0. i18n 불필요 서비스
- `article-editor`
- `dmg-calc`
- `patch-console`
- `pay-calc`
- `buff-calc`

## 1. 통합 i18n 완료 서비스(서비스 레벨)

| 서비스 | 상태 | 근거 |
| --- | --- | --- |
| `about` | 완료 | `apps/about/index.html:549`, `apps/about/index.html:554`에서 `initPageI18n('about')`/`I18nService.init('about')` 호출 |
| `astrolabe` | 완료 | `apps/astrolabe/index.html:123`, `apps/astrolabe/js/i18n.js:5`에서 페이지 번들 + `I18N_PAGE_ASTROLABE_*` 사용 |
| `critical-calc` | 완료 | `apps/critical-calc/index.html:180`, `apps/critical-calc/index.html:200`에서 페이지 번들 + `I18N_PAGE_CRITICAL_CALC_*` 사용 |
| `defense-calc` | 완료 | `apps/defense-calc/index.html:363`, `apps/defense-calc/index.html:429`에서 페이지 번들 + `I18N_PAGE_DEFENSE_CALC_*` 사용 |
| `gallery` | 완료 | `apps/gallery/index.html:104`, `apps/gallery/gallery-tags.js:30`에서 `initPageI18n('gallery')` + `window.t()` 사용 |
| `login` | 완료 | `apps/login/index.html:133`, `apps/login/index.html:138`에서 `initPageI18n('login')`/`I18nService.init('login')` 호출 |
| `maps` | 완료 | `apps/maps/index.html:152`~`apps/maps/index.html:154` 페이지 번들 로드, `apps/maps/maps-i18n.js:48`에서 `MapsI18n` 사용 |
| `pull-calc` | 완료 | `apps/pull-calc/pull-calc.js:1674` `initPageI18n('pull-calc')`, `apps/pull-calc/pull-calc.js:523` `mustReadContent`를 `window.t()`로 조회, 로컬 번역 팩 제거(`apps/pull-calc/pull-calc-i18n.js` 삭제) |
| `revelations` | 완료 | `apps/revelations/index.html:29`의 `data-i18n` 바인딩 + `apps/revelations/index.html:624`의 `I18nService.init('revelation')` |
| `schedule` | 완료 | `apps/schedule/index.html:203` `initPageI18n('schedule')`, `apps/schedule/index.html:114` `window.t()` 사용 |
| `synergy` | 완료 | `apps/synergy/synergy.js:2165` `initPageI18n('synergy')`, `apps/synergy/synergy.js:62` `window.t()` 사용 |
| `tier` | 완료 | `apps/tier/position-tier.html:840` `initPageI18n('tier')`, `apps/tier/position-tier-qa.js:16` 키 조회 |
| `wonder-weapon` | 완료 | `apps/wonder-weapon/wonder-weapon.js:1148` `initPageI18n('wonder-weapon')`, `apps/wonder-weapon/wonder-weapon.js:86` `window.t()` 사용 |

## 2. 통합 i18n 연결 + 로컬 i18n 잔존(부분)

| 서비스 | 상태 | 대표 잔존 위치 |
| --- | --- | --- |
| `character` | 부분 잔존 | 목록 페이지는 통합 i18n(`apps/character/index.html:949`)이나 상세 페이지에서 언어 분기 하드코딩(`apps/character/character.html:51`) 및 로컬 맵(`assets/js/character/character-i18n.js:5`) 유지 |
| `persona` | 부분 잔존 | 통합 i18n 초기화(`apps/persona/persona-list.js:49`)는 적용됐지만 획득처 모듈에 로컬 라벨 분기(`apps/persona/getfrom.js:89`) 잔존 |
| `tactic-maker` | 부분 잔존 | 통합 i18n 초기화(`apps/tactic-maker/js/main.js:67`) 이후에도 언어별 하드코딩 분기(`apps/tactic-maker/js/need-stat-state.js:261`, `apps/tactic-maker/js/ui-critical-card.js:1201`) 잔존 |

## 3. 통합 i18n 미구현 서비스

| 서비스 | 상태 | 근거 |
| --- | --- | --- |
| `guides` | 미구현(서비스 내부 로컬 i18n) | 로컬 번역 객체 사용(`apps/guides/guides.js:116`, `apps/guides/guides.js:130`, `apps/guides/guides.js:523`) |
| `home` | 미구현(공통 번역 일부 + 로컬 맵) | 공통 번역 로드 후 로컬 데이터 조합(`apps/home/index.html:456`, `apps/home/index.html:462`), 로컬 라벨 맵(`apps/home/js/quick-grid.js:45`) |
| `material-calc` | 미구현(로컬 i18n) | 로컬 `I18N` 맵/`t()` 사용(`apps/material-calc/material-planner.js:68`, `apps/material-calc/material-planner.js:137`) |
| `pull-tracker` | 미구현(로컬 i18n) | 로컬 메시지/맵 사용(`apps/pull-tracker/js/pull-tracker.js:3`, `apps/pull-tracker/js/global-stats.js:13`, `apps/pull-tracker/url-guide.html:656`) |

## 4. 레거시/중복 잔존

| 서비스 | 상태 | 위치 |
| --- | --- | --- |
| `tactic` | 통합 i18n 동작 중이나 레거시 구조 잔존 | `apps/tactic/index.html:685`~`apps/tactic/index.html:690` 통합 초기화, `i18n/pages/tactic/en.js:1`, `i18n/pages/tactic/jp.js:1` 별도 페이지 번들 유지 |

## 5. 앱 전수 커버리지(26개)

| 서비스 | 최종 상태 |
| --- | --- |
| `about` | 완료 |
| `article-editor` | 불필요 |
| `astrolabe` | 완료 |
| `buff-calc` | 미구현 |
| `character` | 부분 잔존 |
| `critical-calc` | 완료 |
| `defense-calc` | 완료 |
| `dmg-calc` | 불필요 |
| `gallery` | 완료 |
| `guides` | 미구현 |
| `home` | 미구현 |
| `login` | 완료 |
| `maps` | 완료 |
| `material-calc` | 미구현 |
| `patch-console` | 불필요 |
| `pay-calc` | 불필요 |
| `persona` | 부분 잔존 |
| `pull-calc` | 완료 |
| `pull-tracker` | 미구현 |
| `revelations` | 완료 |
| `schedule` | 완료 |
| `synergy` | 완료 |
| `tactic` | 레거시/중복 잔존 |
| `tactic-maker` | 부분 잔존 |
| `tier` | 완료 |
| `wonder-weapon` | 완료 |

## 6. 결론
- 전수 점검 기준 통합 i18n 완료: `about`, `astrolabe`, `critical-calc`, `defense-calc`, `gallery`, `login`, `maps`, `pull-calc`, `revelations`, `schedule`, `synergy`, `tier`, `wonder-weapon`
- 우선 정리 대상(미구현): `guides`, `home`, `material-calc`, `pull-tracker`
- 부분 잔존 정리 대상: `character`, `persona`, `tactic-maker`, `tactic`
