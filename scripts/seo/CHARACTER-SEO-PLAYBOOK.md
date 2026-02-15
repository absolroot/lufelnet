# Character SEO Playbook (문서 전용)

## 1. 목적/범위

### 목적
- `character` 페이지의 SEO 적용 전, 구현 기준을 문서로 먼저 정리한다.
- 기존 URL 접근을 유지하면서 canonical 경로를 path 기반으로 통일한다.
- 이번 단계는 문서화만 수행하고 코드/설정/워크플로우 변경은 하지 않는다.

### 범위
- 호환 유지 대상:
  - `/character/`
  - `/character.html?name=...&lang=...`
- canonical 정책:
  - `/kr/character/{slug}/`
  - `/en/character/{slug}/`
  - `/jp/character/{slug}/`

### 비범위
- `scripts/seo/README.md` 수정
- 앱 코드, 라우터, CI, 생성 스크립트 수정
- 생성 페이지 실구현 및 배포 반영

## 2. URL 정책

### 정책 요약
- canonical 상세 URL은 path 기반을 사용한다.
- legacy query URL은 계속 허용하되 런타임에서 canonical로 정규화한다.
- 언어 루트는 redirect stub 방식으로 관리한다.

### URL 매트릭스

| 구분 | URL 형식 | 역할 | 비고 |
|---|---|---|---|
| Canonical (KR) | `/kr/character/{slug}/` | 검색엔진 기준 URL | 기본 기준 |
| Canonical (EN) | `/en/character/{slug}/` | 검색엔진 기준 URL | 글로벌 서버 |
| Canonical (JP) | `/jp/character/{slug}/` | 검색엔진 기준 URL | 글로벌 서버 |
| Legacy 상세 | `/character.html?name={KR_NAME}` | 기존 링크 호환 | 유지 |
| Legacy 상세+언어 | `/character.html?name={KR_NAME}&lang={kr\|en\|jp}` | 기존 링크 호환 | 유지 |
| Root KR | `/kr/character/` | 언어 루트 진입 | `/character/?lang=kr`로 redirect |
| Root EN | `/en/character/` | 언어 루트 진입 | `/character/?lang=en`로 redirect |
| Root JP | `/jp/character/` | 언어 루트 진입 | `/character/?lang=jp`로 redirect |
| Root CN 준비 | `/cn/character/` | route-ready | `/character/?lang=cn`로 redirect |

## 3. slug 정책

### 기본 원칙
- 기본 키는 `data/character_info.js`의 `codename`을 사용한다.
- URL 안정성 보장을 위해 별도 slug 맵을 도입한다.

### 안정 맵(예정)
- 파일: `_data/character_slugs.json`
- 역할:
  - `slug`: 현재 canonical slug
  - `aliases`: 과거 slug(redirect 대상)

### 운영 규칙
- 번역명/표기 변경이 있어도 slug는 가능한 유지한다.
- slug 변경이 필요한 경우 기존 slug를 `aliases`로 보존한다.
- slug 충돌/중복은 생성 단계에서 실패 처리한다.

## 4. 런타임 주의사항

### 핵심 위험
- 현재 `character` 상세는 `name`/`lang` query 의존 코드가 많다.
- 전역 라우터와 상세 페이지 로직이 서로 URL을 재작성할 가능성이 있다.

### 준수 규칙
- URL 해석 우선순위는 `path-first`, legacy query는 fallback으로 처리한다.
- canonical 정규화 시 `replaceState`를 사용해 중복 history를 만들지 않는다.
- canonical path에서는 `lang` query를 제거한다.
- 언어 전환 시 상세 경로를 유지한 채 대상 언어 canonical path로 이동한다.

### 충돌 가능 지점(향후 구현 시점 점검 대상)
- `assets/js/language-router.js`
  - SEO 상세 경로 인식 대상에 `character` 추가 필요 여부
  - 언어 자동 감지/강제 query 추가 로직과 충돌 여부
- `assets/js/geo-meta.js`
  - character 상세 판별이 query 기반으로 되어 있는지 점검
- `apps/character/character.html` + `assets/js/character/*.js`
  - `URLSearchParams(...).get('name'|'lang')` 직접 의존 구간
  - canonical/og:url 갱신 방식 정리 필요

## 5. i18n/고유명사 규칙

### 언어 정책
- 현재 기준 언어: `en`, `kr`, `jp`
- `cn`은 상세 콘텐츠가 부족해도 라우팅은 route-ready로 준비 가능

### 고유명사 정책
- 캐릭터/코드네임/무기명 등 고유명사는 임의 의역 금지
- 원문 출처가 불명확하거나 표기 충돌이 있으면 사용자 확인 후 확정

### 서버 차이 반영
- `en`, `jp`는 글로벌 서버 특성상 `kr` 대비 미출시 콘텐츠가 존재할 수 있다.
- 문서/SEO 설명 문구 작성 시 이 차이를 명시적으로 고려한다.

## 6. 인코딩/파일 안전

### 필수 규칙
- UTF-8 without BOM
- LF(`\n`) line ending

### 주의사항
- 한글/일본어 텍스트가 깨지지 않도록 편집기 저장 설정을 사전 확인한다.
- 자동 포맷/변환 도구 사용 시 BOM 삽입 여부를 반드시 재검증한다.

## 7. 구현 전 체크리스트

### 사전 검토(우선순위 높음)
1. `character` 상세의 query 의존 지점 목록화 (`name`, `lang`)
2. canonical/og 메타 갱신 방식 단일화 방안 확정
3. language-router와 상세 정규화 로직의 책임 경계 확정
4. slug 소스(`codename`)와 안정 맵(`character_slugs.json`) 충돌 검증 설계

### 사전 검토(우선순위 중간)
1. 기존 내부 링크(`/character.html?name=...`)를 단계적으로 canonical로 전환할 범위 정의
2. root redirect stub과 기존 redirect 규칙 충돌 여부 확인
3. 글로벌 서버(en/jp) 미출시 캐릭터 노출 정책 확인

## 8. 검증 시나리오

### 시나리오별 기대 결과
1. direct canonical
- 입력: `/kr/character/{slug}/`
- 기대: 정상 렌더, `lang` query 없음, 경로 유지

2. legacy query
- 입력: `/character.html?name=나루미&lang=kr`
- 기대: 정상 렌더 후 canonical KR path로 정규화(`replaceState`)

3. root redirect
- 입력: `/en/character/?v=123`
- 기대: `/character/?lang=en&v=123`로 상대 경로 redirect

4. language switch
- 입력: `/jp/character/{slug}/`에서 언어 변경
- 기대: 대상 언어의 동일 slug canonical path로 이동

5. language preference safety
- 조건: `localStorage.preferredLanguage='en'`
- 입력: `/kr/character/{slug}/`
- 기대: KR canonical 유지, 강제 query 전환 없음

## 9. Important Changes To Public APIs / Interfaces / Types

이번 작업(문서 작성)에서 실제 인터페이스 변경은 없다.

향후 도입 예정 인터페이스:
1. `scripts/seo/generate-character-pages.mjs`
- 계약: `generate`, `--check`

2. `_data/character_slugs.json`
- 스키마: `{ "<KR_NAME>": { "slug": "<stable-slug>", "aliases": ["<old-slug>"] } }`

3. `i18n/pages/character/seo-meta.json`
- 스키마:
  - `kr/en/jp`별 `title`, `description`
  - `{name}` placeholder 사용

## 10. Test Cases And Scenarios (문서 품질 점검)

1. 변경 파일 수 검증
- 이 단계에서 변경 파일이 `scripts/seo/CHARACTER-SEO-PLAYBOOK.md` 1개인지 확인

2. 필수 섹션 포함 검증
- canonical/legacy/root/lang/i18n/encoding 섹션 존재 확인

3. 정책 일관성 검증
- 문서 내 예시 URL이 서로 모순되지 않는지 확인

4. 파일 포맷 검증
- UTF-8 BOM 없음
- LF line ending 유지

## 11. Assumptions And Defaults

1. 파일명은 `scripts/seo/CHARACTER-SEO-PLAYBOOK.md`로 고정한다.
2. 문서 언어는 한국어를 기본으로 한다.
3. 이번 단계는 문서 작성만 수행하며, 구현/설정 변경은 다음 단계로 분리한다.
