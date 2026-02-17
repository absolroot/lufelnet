# Patch Console 기능 명세

## 1) 목적
- 로컬 데이터 패치, diff 검토, 무시 규칙 관리, 데이터 직접 편집, SEO 메타 운영, Revelation 카드 운영을 한 콘솔에서 처리한다.
- 운영 원칙:
  - `seo-meta.json`을 SEO authoritative source로 사용한다.
  - 데이터 수정은 항상 도메인/언어 범위를 명시하고 검증 후 저장한다.

## 2) 정보 구조 (Header IA)
- 레이아웃은 `좌측 사이드바 + 우측 워크스페이스`로 구성한다.
  - `Sidebar`: 뷰 전환 탭 + 도메인 선택
  - `Workspace Header`: 현재 활성 화면 컨텍스트 + 전역 새로고침
- 사이드바 탭은 기능군 기준으로 분리한다.
  - `Patch Workflows`: `패치 작업`, `무시 목록`, `데이터 편집기`
  - `Operations`: `SEO Admin`, `Revelation Admin`
- `Revelation Admin`은 `revelation` 도메인일 때만 노출한다.

## 3) 화면별 기능 명세

### A. 패치 작업 (`work`)
- 목적: API/로컬 문자열 diff를 조회하고 선택 반영한다.
- 핵심 기능:
  - 언어/범위/파트 필터
  - 리스트 검색, 리포트 검색
  - 선택 반영, 선택 해제, diff 무시
  - 상세 diff 프리뷰와 실행 로그
- 주요 API:
  - `GET /api/list`
  - `POST /api/report`
  - `POST /api/patch`
  - `POST /api/apply-diffs`
  - `POST /api/ignore-diffs`

### B. 무시 목록 (`ignored`)
- 목적: 누적된 무시 규칙을 필터링/정렬/복구/메모 편집한다.
- 핵심 기능:
  - active/hidden/all 표시
  - 고급 필터(index/lang/api/local/key/path/note/date)
  - 선택/필터 결과 단위 unignore, hide/unhide
- 주요 API:
  - `GET /api/ignored`
  - `POST /api/unignore-diffs`
  - `POST /api/ignore-diffs` (상태 갱신)

### C. 데이터 편집기 (`editor`)
- 목적: 도메인별 데이터 파일을 form/raw 모드로 안전 편집한다.
- 핵심 기능:
  - 데이터 루트/파일 탐색
  - JSON 파싱 상태 표시
  - Form 모드 path 기반 수정 + Raw 모드 직접 수정
  - 저장 전 파싱 검증
- 주요 API:
  - `GET /api/data-roots`
  - `GET /api/data-files`
  - `GET /api/data-file`
  - `POST /api/data-file`

### D. SEO Admin (`seo-admin`)
- 목적: `i18n/pages/*/seo-meta.json` 기반 SEO를 매트릭스로 운영한다.
- 핵심 기능:
  - 도메인 로드, 언어 열 편집(EN/KR/JP + CN 토글)
  - KR -> EN/JP 복사
  - `{name}`, `{path}` 토큰 삽입
  - 저장 전 validate, 저장 후 CI 상태 조회, 이력 확인
- 주요 API:
  - `GET /api/seo/bootstrap`
  - `GET /api/seo/domain`
  - `POST /api/seo/validate`
  - `POST /api/seo/save`
  - `GET /api/seo/ci-status`
  - `GET /api/seo/history`

### E. Revelation Admin (`revelation-admin`)
- 목적: Revelation 카드 데이터 조회/수정/생성 운영.
- 핵심 기능:
  - 카드 목록 검색/필터
  - 다국어 이름, 타입, 효과, 하위 옵션 편집
  - KR rename, 카드 저장/생성
- 주요 API:
  - `GET /api/revelation-admin/bootstrap`
  - `GET /api/revelation-admin/card`
  - `POST /api/revelation-admin/save-card`
  - `POST /api/revelation-admin/rename-kr`
  - `POST /api/revelation-admin/create-card`

## 4) 공통 동작
- URL/스토리지 동기화:
  - 현재 view는 URL path/query + localStorage에 동기화된다.
- 도메인 의존 UI:
  - 도메인 변경 시 가능한 기능/탭 노출이 자동 갱신된다.
- 전역 새로고침:
  - 리스트, 리포트, 무시 목록 재조회의 진입점.

## 5) 운영 가드레일
- UTF-8 저장, BOM 금지.
- SEO title 우선순위:
  - 기본은 SEO 엔진/seo-meta 적용
  - i18n title은 `document.title`이 비어 있을 때만 fallback으로 사용
