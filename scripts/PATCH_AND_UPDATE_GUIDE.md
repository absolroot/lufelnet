# 자동 업데이트 + 수동 패치 가이드

이 문서는 현재 저장소에서 사용 중인 자동 업데이트 흐름과, 수동 캐릭터 패치 작업에 필요한 스크립트를 빠르게 확인하기 위한 운영 메모입니다.

## 1. 자동 업데이트 로직 (현행)

아래는 `.github/workflows` 기준 현재 스케줄입니다.

1. `fetch-api.yaml`
- 이름: `Fetch External Core every 6h`
- 주기: 매 6시간 (`0 */6 * * *`, UTC)
- 실행 스크립트: `bash scripts/fetch-external-data.sh`
- 모드: `FETCH_MODE=core` (gacha/guildboss/sos/sandbox)

2. `fetch-api-character.yaml`
- 이름: `Fetch External Character every 6h (+1h)`
- 주기: `01:00, 07:00, 13:00, 19:00 UTC`
- 실행 스크립트: `bash scripts/fetch-external-data.sh`
- 모드: `FETCH_MODE=character`

3. `fetch-api-weapon.yaml`
- 이름: `Fetch External Weapon every 6h (+2h)`
- 주기: `02:00, 08:00, 14:00, 20:00 UTC`
- 실행 스크립트: `bash scripts/fetch-external-data.sh`
- 모드: `FETCH_MODE=weapon`

4. `fetch-synergy.yaml`
- 이름: `Fetch Synergy every 12h`
- 주기: 매 12시간 (`20 */12 * * *`, UTC)
- 실행 스크립트: `node scripts/fetch-synergy.mjs`
- 특징: 1회 실패 시 45초 후 재시도

5. `fetch-persona.yaml`
- 이름: `Fetch Persona (Wed 23:25, Thu 18:25, Fri 13:25 KST)`
- 주기: 수동 지정 cron 3개
- 실행 스크립트: `node scripts/fetch-persona.mjs`
- 특징: 1회 실패 시 45초 후 재시도

## 2. 수동 패치 핵심 스크립트

1. `scripts/patch-characters.mjs`
- 목적: 특정 캐릭터/특정 언어만 안전하게 패치
- 주요 안전장치
- 지정한 언어 테이블과 캐릭터 키만 갱신
- 외부 JSON이 없거나 파손되면 해당 파트 스킵
- 빈 문자열/빈 데이터로 기존 텍스트를 지우지 않도록 보호
- 기존 값 + 신규 값 병합(`deepMerge`) 방식 적용
- `codename.json`의 `key` 필드가 있으면 KR `characters.js` 매핑이 없어도 해당 key로 패치 가능

2. `scripts/fetch-external-data.sh`
- 목적: 외부 API JSON 수집 공통기
- 주요 안전장치
- JSON 유효성 검사 실패 시 skip
- 기존 파일과 동일하면 미갱신
- 변경 시 백업(`data/external/before/...`) 후 반영

3. `scripts/fetch-synergy.mjs`
- 목적: 시너지 데이터 업데이트
- 동작 요약: KR 기준 탐색 + 업데이트/보완 처리

## 3. patch-characters 사용법

1. 대상 인덱스/매핑 확인

```bash
node scripts/patch-characters.mjs list --langs kr,en,jp
```

2. 실제 패치 (예: 4번, 7~10번 / KR+EN)

```bash
node scripts/patch-characters.mjs patch --nums 4,7-10 --langs kr,en
```

3. 드라이런 (파일 미수정)

```bash
node scripts/patch-characters.mjs patch --nums 4 --langs en --dry-run
```

4. 차이점 리포트만 생성

```bash
node scripts/patch-characters.mjs report --langs kr,en,jp --all
```

## 4. 리포트 경로 정책

1. 기본 리포트 경로
- `scripts/reports/character-patch-diff.md`

2. 필요 시 직접 지정

```bash
node scripts/patch-characters.mjs report --all --langs kr,en,jp --report-file scripts/reports/custom-diff.md
```

3. Git 관리 정책
- `reports/` 및 `scripts/reports/`는 `.gitignore`에 포함되어 커밋 대상에서 제외

## 5. 로컬 GUI 제안

리포트 diff가 많은 현재 상황에서는 로컬 GUI를 두는 방향이 타당합니다.

1. 권장 기능
- 좌측: 캐릭터/언어/파트 필터
- 중앙: 현재값 vs 외부값 diff 미리보기
- 우측: 선택 항목만 patch 실행 버튼
- 하단: 실행 로그 + dry-run/real-run 전환

2. 구현 권장 형태
- `apps/patch-console/` 같은 로컬 전용 페이지
- 데이터 읽기/패치 실행은 기존 `scripts/patch-characters.mjs`를 호출해서 재사용
- 즉, GUI는 오케스트레이션만 담당하고 실제 반영 로직은 스크립트 단일화 유지

3. 기대 효과
- 대량 diff에서 사람 검수 속도 상승
- 오패치 확률 감소
- 신규 캐릭터 온보딩 시 선택형 작업 가능

## 6. 로컬 GUI (MVP) 실행

1. 실행

```bash
npm run patch-console
```

2. 접속
- `http://127.0.0.1:4173`

3. 위치
- 서버: `scripts/run-patch-console.mjs`
- UI: `apps/patch-console/index.html`
- 스타일: `apps/patch-console/patch-console.css`
- 클라이언트 로직: `apps/patch-console/patch-console.js`

4. 기본 흐름
- 좌측 `캐릭터 목록`에서 캐릭터 클릭 -> 해당 index 범위로 리포트 자동 생성
- 우측 테이블에서 행 클릭 -> 하단 `행 상세`에서 part별 diff 샘플 확인
- `검증 실행` 버튼은 Dry Run (파일 미수정)
- 검증 결과가 괜찮으면 `실제 반영` 버튼 실행

5. 파트 선택 방식
- `파트 선택`은 체크형 드롭다운입니다.
- 체크된 파트만 report/patch 대상으로 전달됩니다.

6. 참고
- GUI도 내부적으로 `scripts/patch-characters.mjs`를 호출합니다.
- 리포트는 기본적으로 `scripts/reports/patch-console-report.md`에 생성됩니다.
- GUI에서 신규 캐릭터 생성 시 다음이 자동 수행됩니다.
- `data/external/character/codename.json`에 `{ api, local, key }` 추가
- `data/characters/<key>`에 template 기반 파일 생성
- 도메인 탭(`character`, `persona`, `wonder_weapon`) 구조를 추가해 확장 가능한 형태로 정리했습니다.
- 현재 실제 동작은 `character`만 활성화되어 있고, 나머지는 준비중 상태로 표시됩니다.
- `capabilities` API를 읽지 못해도 `character`는 fallback으로 항상 동작하도록 처리했습니다.
- 아이콘은 `assets/img/tier`에서 `key -> local -> api` 순으로 exact 파일명을 우선 탐색하고, 실패 시 정규화 매칭으로 fallback합니다.
