# 서비스별 i18n 처리 현황

기준일: 2026-02-15  
점검 범위: `apps` 하위 26개 서비스 전체 재점검

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
| `character` | 완료 | 도움말/QEVEL/스탯/영상/상세/무기/검색 카운트의 UI 노출 문자열·ARIA·툴팁을 페이지 번들 키 조회로 통합(`assets/js/character/helpmodal.js:32`, `assets/js/character/QEVEL.js:502`, `assets/js/character/cha_stats.js:169`, `assets/js/character/cha_video.js:169`, `assets/js/character/cha_detail.js:574`, `apps/character/character.html:1490`, `apps/character/character-search.js:153`, `i18n/pages/character/kr.js:58`) |
| `critical-calc` | 완료(경미 초기값 잔존) | 통합 번들 사용(`apps/critical-calc/index.html:180`), 초기 하드코딩(`apps/critical-calc/index.html:27`)은 `assets/js/defense/defense-i18n.js:236`에서 런타임 치환 |
| `defense-calc` | 완료(경미 초기값 잔존) | 통합 번들 사용(`apps/defense-calc/index.html:363`), 초기 하드코딩(`apps/defense-calc/index.html:49`)은 `assets/js/defense/defense-i18n.js:236`에서 런타임 치환 |
| `gallery` | 완료 | `apps/gallery/index.html:104`, `apps/gallery/gallery-tags.js:30`에서 `initPageI18n('gallery')` + `window.t()` 사용 |
| `guides` | 완료 | 신규 페이지 번들 + 통합 초기화로 목록/동적상세/정적상세 진입점 통합(`i18n/pages/guides/kr.js:1`, `apps/guides/index.html:41`, `apps/guides/view.html:40`, `apps/guides/pages/books.html:28`, `apps/guides/guides.js:28`, `apps/article-editor/editor.js:320`) |
| `login` | 완료 | `apps/login/index.html:133`, `apps/login/index.html:138`에서 `initPageI18n('login')`/`I18nService.init('login')` 호출 |
| `maps` | 완료 | `MapsI18n` 경로를 유지하면서 언어 선택기/모바일 ARIA/백업 툴팁/에러 문구/적 정보 fallback을 페이지 번들 키 조회로 통합하고 KR direct 참조 제거(`apps/maps/index.html:78`, `apps/maps/object-filter-panel.js:34`, `apps/maps/map-select-panel.js:21`, `apps/maps/maps-core.js:44`, `apps/maps/object-click-handler.js:33`, `i18n/pages/maps/kr.js:18`) |
| `persona` | 완료 | 통합 초기화 이후 스킬 라벨/배지/접근성 ARIA/상세 SEO fallback을 페이지 번들·공통 키 조회로 통합(`apps/persona/persona-list.js:49`, `apps/persona/persona-list.js:393`, `apps/persona/persona-list.js:710`, `apps/persona/persona-list.js:896`, `apps/persona/skillfrom.js:117`, `apps/persona/skillfrom.js:237`, `apps/persona/index.html:94`, `i18n/pages/persona/kr.js:18`) |
| `pull-calc` | 완료 | `initPageI18n('pull-calc')` 이후 SEO 태그를 페이지 번들 키(`seoTitle/seoDescription/seoKeywords/seoOgLocale`) 조회로 통합하고 언어 변경 훅으로 재반영(`apps/pull-calc/pull-calc.js:1814`, `apps/pull-calc/pull-calc.js:276`, `apps/pull-calc/pull-calc.js:1822`, `i18n/pages/pull-calc/kr.js:10`) |
| `pull-tracker` | 완료 | 3개 진입점 + 연관 JS를 `PullTrackerI18n` 경유로 통합하고 FAQ fetch/인라인 로컬 맵 제거, 초기화 레이스/폴백 체인을 안정화(`apps/pull-tracker/index.html:114`, `apps/pull-tracker/global-stats.html:103`, `apps/pull-tracker/url-guide.html:504`, `apps/pull-tracker/js/i18n-runtime.js:1`, `apps/pull-tracker/js/pull-tracker.js:4`, `apps/pull-tracker/js/global-stats.js:15`, `apps/pull-tracker/js/manual-editor.js:22`, `i18n/pages/pull-tracker/kr.js:1`, `i18n/pages/pull-tracker/en.js:1`, `i18n/pages/pull-tracker/jp.js:1`) |
| `revelations` | 완료 | 통합 초기화 + SEO/미출시 라벨/에러 메시지/아코디언 title/reset 버튼을 페이지 번들 키 조회로 통합(`apps/revelations/index.html:615`, `apps/revelations/index.html:428`, `apps/revelations/index.html:837`, `apps/revelations/index.html:647`, `apps/revelations/index.html:687`, `apps/revelations/index.html:997`, `apps/revelations/index.html:1022`, `i18n/pages/revelation/kr.js:26`) |
| `schedule` | 완료 | `apps/schedule/index.html:203` `initPageI18n('schedule')`, `apps/schedule/index.html:114` `window.t()` 사용 |
| `synergy` | 완료 | 통합 초기화 이후 레거시 `window.I18N` fallback 제거 및 `I18nService.cache` 기반 KR 의미 폴백으로 통합(`apps/synergy/synergy.js:60`, `apps/synergy/item_from.js:10`, `apps/synergy/soulmate.js:5`) |
| `tactic` | 완료 | `apps/tactic/index.html`의 `translateUI/uiMap` 경로 제거 후 키 기반 정적 치환으로 통합, `apps/tactic/tactics.html` + `assets/js/tactics-viewer.js`를 `tactics` 페이지 번들로 통합, `apps/tactic/tactic-upload.html`의 언어 삼항 분기 제거(`assets/js/tactic/createAction.js`, `assets/js/tactic/renderTurns.js`, `assets/js/tactic/import.js`, `assets/js/tactic/setparty.js`, `assets/js/tactic/setwonder.js`, `assets/js/tactic/share.js`, `i18n/pages/tactic/kr.js`, `i18n/pages/tactic/en.js`, `i18n/pages/tactic/jp.js`, `i18n/pages/tactics/kr.js`, `i18n/pages/tactics/en.js`, `i18n/pages/tactics/jp.js`, `i18n/pages/tactic-upload/kr.js`, `i18n/pages/tactic-upload/en.js`, `i18n/pages/tactic-upload/jp.js`) |
| `tactic-maker` | 완료 | 액션/리벨레이션/접근성/툴팁/에러 알림 하드코딩을 페이지 번들 키 조회로 통합(`apps/tactic-maker/js/ui-tactic.js:207`, `apps/tactic-maker/js/ui-party.js:89`, `apps/tactic-maker/js/ui-critical-card.js:1592`, `apps/tactic-maker/js/import-export.js:224`, `apps/tactic-maker/js/capture.js:91`, `i18n/pages/tactic-maker/kr.js:61`) |
| `tier` | 완료 | 타이틀/소스 토글/SEO/모달·툴바 라벨을 페이지 번들 키 조회로 통합(`apps/tier/position-tier.html:428`, `apps/tier/position-tier.html:473`, `apps/tier/position-tier.html:709`, `apps/tier/position-tiers.js:1711`, `apps/tier/capture.js:150`) |
| `wonder-weapon` | 완료 | `apps/wonder-weapon/wonder-weapon.js:1148` `initPageI18n('wonder-weapon')`, `apps/wonder-weapon/wonder-weapon.js:86` `window.t()` 사용 |

## 2. 통합 i18n 연결 + 로컬 i18n 잔존(부분)

| 서비스 | 상태 | 대표 잔존 위치 |
| --- | --- | --- |
| 없음 | - | - |

## 3. 통합 i18n 미구현 서비스

| 서비스 | 상태 | 근거 |
| --- | --- | --- |
| `home` | 미구현(공통 번역 일부 + 로컬 맵) | 공통 번역 로드 후 로컬 데이터 조합(`apps/home/index.html:456`, `apps/home/index.html:462`), 로컬 라벨 맵(`apps/home/js/quick-grid.js:45`) |
| `material-calc` | 미구현(로컬 i18n) | 로컬 `I18N` 맵/`t()` 사용(`apps/material-calc/material-planner.js:68`, `apps/material-calc/material-planner.js:137`) |

## 4. 레거시/중복 잔존

| 서비스 | 상태 | 위치 |
| --- | --- | --- |
| 없음 | - | - |

## 5. 앱 전수 커버리지(26개)

| 서비스 | 최종 상태 |
| --- | --- |
| `about` | 완료 |
| `article-editor` | 불필요 |
| `astrolabe` | 완료 |
| `buff-calc` | 불필요 |
| `character` | 완료 |
| `critical-calc` | 완료(경미 잔존) |
| `defense-calc` | 완료(경미 잔존) |
| `dmg-calc` | 불필요 |
| `gallery` | 완료 |
| `guides` | 완료 |
| `home` | 미구현 |
| `login` | 완료 |
| `maps` | 완료 |
| `material-calc` | 미구현 |
| `patch-console` | 불필요 |
| `pay-calc` | 불필요 |
| `persona` | 완료 |
| `pull-calc` | 완료 |
| `pull-tracker` | 완료 |
| `revelations` | 완료 |
| `schedule` | 완료 |
| `synergy` | 완료 |
| `tactic` | 완료 |
| `tactic-maker` | 완료 |
| `tier` | 완료 |
| `wonder-weapon` | 완료 |

## 6. 결론
- 재점검 기준 통합 i18n 완료(경미 초기값 잔존 포함): `about`, `astrolabe`, `character`, `critical-calc`, `defense-calc`, `gallery`, `guides`, `login`, `maps`, `persona`, `pull-calc`, `pull-tracker`, `revelations`, `schedule`, `synergy`, `tactic`, `tactic-maker`, `tier`, `wonder-weapon`
- 우선 정리 대상(미구현): `home`, `material-calc`
