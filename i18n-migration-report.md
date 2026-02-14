# i18n 마이그레이션 리포트

최종 업데이트: 2026-02-14

## 1. 작업 범위
- 대상 페이지: `astrolabe`, `critical-calc`, `defense-calc`, `maps`
- 목적:
  - 페이지 내부 로컬 i18n 객체를 `i18n/pages/...` 번들 기반으로 전환
  - `???` placeholder 및 깨진/누락 번역 보정
  - 각 페이지가 실제로 i18n 페이지 번들을 로드하도록 스크립트 연결 정리

## 2. 이번 작업에서 완료한 내용

### 2.1 astrolabe
- `apps/astrolabe/js/i18n.js`
  - 로컬 `translations`, `adaptLabels` 제거
  - `window.I18N_PAGE_ASTROLABE_*`(kr/en/jp/cn/tw/sea) 참조 구조로 전환
- `apps/astrolabe/js/adapt-sprite.js`
  - 로컬 다국어 라벨 제거
  - `AstrolabeI18n.getAdaptLabel()` 사용하도록 변경
- `apps/astrolabe/index.html`
  - `i18n/pages/astrolabe/*.js`(6개 언어) 로딩 스크립트 추가

### 2.2 critical-calc
- `assets/js/critical-calc.js`
  - `applyHardcodedI18n()`의 로컬 언어 객체 제거
  - `window.I18N_PAGE_CRITICAL_CALC_*` 기반 텍스트 적용으로 전환
- `apps/critical-calc/index.html`
  - `i18n/pages/critical-calc/kr|en|jp.js` 로딩 추가
  - SEO 갱신 로직을 페이지 번들(`seoTitle`, `seoDescription`, `seoKeywords`, `seoOgLocale`) 참조 방식으로 전환
- `i18n/pages/critical-calc/kr.js`
  - `defenseGroupNames`의 `??` 값 복구: `원더/계시/공통`
  - `defenseI18n.other_reduce` 추가
- `i18n/pages/critical-calc/jp.js`
  - `defenseI18n.show_spoiler`: `スポイラー表示`로 복구
  - `defenseGroupNames`의 `????/??` 복구: `ワンダー/啓示/共通`

### 2.3 defense-calc
- `assets/js/defense/defense-i18n.js`
  - 대형 로컬 i18n 사전 제거
  - 페이지별 번들(`I18N_PAGE_DEFENSE_CALC_*`, `I18N_PAGE_CRITICAL_CALC_*`) 자동 참조 구조 추가
  - `showSpoilerLabel`을 하드코딩이 아닌 `defenseI18n.show_spoiler` 사용으로 변경
  - `translateType()` 로컬 타입맵 제거, `defenseTypeMap` 참조로 변경
  - `translateGroupName()` 추가, `defenseGroupNames` 참조 지원
- `apps/defense-calc/index.html`
  - `i18n/pages/defense-calc/kr|en|jp.js` 로딩 추가
  - SEO 갱신 로직을 페이지 번들 참조 방식으로 전환
- `i18n/pages/defense-calc/kr.js`
  - `defenseGroupNames`의 `??` 값 복구: `원더/계시/공통`
  - `defenseI18n.other_reduce` 추가
- `i18n/pages/defense-calc/jp.js`
  - `defenseI18n.show_spoiler`: `スポイラー表示`로 복구
  - `defenseGroupNames`의 `????/??` 복구: `ワンダー/啓示/共通`

### 2.4 maps
- `apps/maps/maps-i18n.js`
  - 로컬 `kr/en/jp` i18n 객체 제거
  - `window.I18N_PAGE_MAPS_*` 참조 구조로 전환 (`getPack` 포함)
- `apps/maps/object-click-handler.js`
  - 로컬 모달 i18n 객체 제거
  - `MapsI18n.getText()` 기반(`enemyInfoTitle`, `enemyDefeated`, `enemyUndo`, `enemyRelativeLevel`)으로 전환
  - 적합성 라벨(Weak/Resistant/...)도 페이지 번들(`adaptLabels`) 참조로 전환
- `apps/maps/maps-seo.js`
  - 로컬 SEO 제목/설명 상수 제거
  - 페이지 번들 키(`seoDefaultTitle`, `seoDefaultDescription`, `seoMapDescriptionTemplate`) 참조로 전환
- `apps/maps/index.html`
  - `i18n/pages/maps/kr|en|jp.js` 로딩 스크립트 추가
- `i18n/pages/maps/kr.js`, `i18n/pages/maps/en.js`, `i18n/pages/maps/jp.js`
  - `seoDefaultTitle`, `seoDefaultDescription`, `seoMapDescriptionTemplate` 추가
  - `adaptLabels` 추가

## 3. `???`/깨진 문자열 보정 결과
- 아래 4개 파일의 placeholder를 전부 정리:
  - `i18n/pages/critical-calc/jp.js`
  - `i18n/pages/critical-calc/kr.js`
  - `i18n/pages/defense-calc/jp.js`
  - `i18n/pages/defense-calc/kr.js`
- 대상 4개 페이지 번들(`astrolabe`, `critical-calc`, `defense-calc`, `maps`)에서 `??` 연속 placeholder 검색 결과: 없음

## 4. 검증
- 문법 검사(`node --check`) 통과 파일:
  - `apps/astrolabe/js/i18n.js`
  - `apps/astrolabe/js/adapt-sprite.js`
  - `apps/maps/maps-i18n.js`
  - `apps/maps/object-click-handler.js`
  - `apps/maps/maps-seo.js`
  - `assets/js/critical-calc.js`
  - `assets/js/defense/defense-i18n.js`
  - `i18n/pages/critical-calc/kr.js`
  - `i18n/pages/critical-calc/jp.js`
  - `i18n/pages/defense-calc/kr.js`
  - `i18n/pages/defense-calc/jp.js`
  - `i18n/pages/maps/kr.js`
  - `i18n/pages/maps/en.js`
  - `i18n/pages/maps/jp.js`

## 5. 참고(현재 스코프 외 잔여 로컬 문자열)
- `maps` 계열 일부 파일에는 여전히 소규모 로컬 문자열이 남아 있음(예: 진행도/토스트 메시지 등).
- 이번 작업 범위에서는 사용자 요청 대상 4페이지의 핵심 i18n 흐름(페이지 라벨, 계산 UI, 모달, SEO, 적합성 라벨) 우선 전환에 집중함.
