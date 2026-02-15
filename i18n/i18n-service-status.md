# 서비스별 i18n 처리 현황

기준일: 2026-02-15  
점검 범위: `apps` 하위 26개 서비스 + 기존 `통합 i18n 완료` 14개 서비스 재점검

## 0. i18n 불필요 서비스
- `article-editor`
- `dmg-calc`
- `patch-console`
- `pay-calc`
- `buff-calc`

## 1. 통합 i18n 완료 서비스(서비스 레벨)

| 서비스 | 상태 | 근거 |
| --- | --- | --- |
| `about` | 완료 | 통합 초기화 + 모달 타이틀/복사 피드백을 페이지 번들 키 조회로 통합(`apps/about/index.html:324`, `apps/about/index.html:458`, `apps/about/index.html:630`) |
| `astrolabe` | 완료 | `apps/astrolabe/index.html:123`, `apps/astrolabe/js/i18n.js:5`에서 페이지 번들 + `I18N_PAGE_ASTROLABE_*` 사용 |
| `critical-calc` | 완료(경미 초기값 잔존) | 통합 번들 사용(`apps/critical-calc/index.html:180`), 초기 하드코딩(`apps/critical-calc/index.html:27`)은 `assets/js/defense/defense-i18n.js:236`에서 런타임 치환 |
| `defense-calc` | 완료(경미 초기값 잔존) | 통합 번들 사용(`apps/defense-calc/index.html:363`), 초기 하드코딩(`apps/defense-calc/index.html:49`)은 `assets/js/defense/defense-i18n.js:236`에서 런타임 치환 |
| `gallery` | 완료 | `apps/gallery/index.html:104`, `apps/gallery/gallery-tags.js:30`에서 `initPageI18n('gallery')` + `window.t()` 사용 |
| `login` | 완료 | `apps/login/index.html:133`, `apps/login/index.html:138`에서 `initPageI18n('login')`/`I18nService.init('login')` 호출 |
| `revelations` | 완료 | 통합 초기화 + SEO/미출시 라벨/에러 메시지/아코디언 title/reset 버튼을 페이지 번들 키 조회로 통합(`apps/revelations/index.html:615`, `apps/revelations/index.html:428`, `apps/revelations/index.html:837`, `apps/revelations/index.html:647`, `apps/revelations/index.html:687`, `apps/revelations/index.html:997`, `apps/revelations/index.html:1022`, `i18n/pages/revelation/kr.js:26`) |
| `schedule` | 완료 | `apps/schedule/index.html:203` `initPageI18n('schedule')`, `apps/schedule/index.html:114` `window.t()` 사용 |
| `synergy` | 완료 | 통합 초기화 이후 레거시 `window.I18N` fallback 제거 및 `I18nService.cache` 기반 KR 의미 폴백으로 통합(`apps/synergy/synergy.js:60`, `apps/synergy/item_from.js:10`, `apps/synergy/soulmate.js:5`) |
| `tier` | 완료 | 타이틀/소스 토글/SEO/모달·툴바 라벨을 페이지 번들 키 조회로 통합(`apps/tier/position-tier.html:428`, `apps/tier/position-tier.html:473`, `apps/tier/position-tier.html:709`, `apps/tier/position-tiers.js:1711`, `apps/tier/capture.js:150`) |
| `wonder-weapon` | 완료 | `apps/wonder-weapon/wonder-weapon.js:1148` `initPageI18n('wonder-weapon')`, `apps/wonder-weapon/wonder-weapon.js:86` `window.t()` 사용 |

## 2. 통합 i18n 연결 + 로컬 i18n 잔존(부분)

| 서비스 | 상태 | 대표 잔존 위치 |
| --- | --- | --- |
| `character` | 부분 잔존 | 상세 상단/섹션 라벨은 통합 키 조회로 전환(`apps/character/character.html:735`, `assets/js/character/character-i18n.js:31`)했으나 도움말/보조 모듈 로컬 맵(`assets/js/character/helpmodal.js:13`, `assets/js/character/QEVEL.js:27`) 잔존 |
| `maps` | 부분 잔존 | 페이지 번들 + `MapsI18n` 사용(`apps/maps/maps-i18n.js:48`) 중이나 언어 선택기 라벨 하드코딩(`apps/maps/index.html:78`, `apps/maps/object-filter-panel.js:493`) 잔존 |
| `persona` | 부분 잔존 | 통합 초기화(`apps/persona/persona-list.js:49`) 이후에도 fallback 문자열/배지 하드코딩(`apps/persona/persona-list.js:393`, `apps/persona/skillfrom.js:214`, `apps/persona/skillfrom.js:236`) 잔존 |
| `pull-calc` | 부분 잔존 | 통합 초기화(`apps/pull-calc/pull-calc.js:1674`)되었으나 로컬 SEO 맵(`apps/pull-calc/index.html:471`) 잔존 |
| `tactic-maker` | 부분 잔존 | need-stat 카드 라벨은 통합 키 조회로 전환(`apps/tactic-maker/js/need-stat-state.js:133`, `apps/tactic-maker/js/ui-critical-card.js:1806`)했으나 액션 라벨 로컬 맵(`apps/tactic-maker/js/ui-tactic.js:2351`) 잔존 |

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
| `buff-calc` | 불필요 |
| `character` | 부분 잔존 |
| `critical-calc` | 완료(경미 잔존) |
| `defense-calc` | 완료(경미 잔존) |
| `dmg-calc` | 불필요 |
| `gallery` | 완료 |
| `guides` | 미구현 |
| `home` | 미구현 |
| `login` | 완료 |
| `maps` | 부분 잔존 |
| `material-calc` | 미구현 |
| `patch-console` | 불필요 |
| `pay-calc` | 불필요 |
| `persona` | 부분 잔존 |
| `pull-calc` | 부분 잔존 |
| `pull-tracker` | 미구현 |
| `revelations` | 완료 |
| `schedule` | 완료 |
| `synergy` | 완료 |
| `tactic` | 레거시/중복 잔존 |
| `tactic-maker` | 부분 잔존 |
| `tier` | 완료 |
| `wonder-weapon` | 완료 |

## 6. 결론
- 재점검 기준 통합 i18n 완료(경미 초기값 잔존 포함): `about`, `astrolabe`, `critical-calc`, `defense-calc`, `gallery`, `login`, `revelations`, `schedule`, `synergy`, `tier`, `wonder-weapon`
- 우선 정리 대상(미구현): `guides`, `home`, `material-calc`, `pull-tracker`
- 부분 잔존 정리 대상: `character`, `maps`, `persona`, `pull-calc`, `tactic-maker`, `tactic`
