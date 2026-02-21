# Supabase 로그인 기반 저장 전환 상세 계획

## 요약
이 계획은 기존 `localStorage` 저장을 "로그인 사용자에 한해 Supabase 동기화"로 확장하는 1차 릴리스 사양이다.

핵심은 다음 4가지다.

1. 대상 키만 Supabase 동기화하고, `pull-tracker`와 `tactic_maker_autosave`는 로컬 유지.
2. 로그인 전에는 기존처럼 로컬 저장만 사용, 로그인 시 자동 동기화.
3. 로컬/클라우드 충돌은 기본 클라우드 우선이며, 양쪽 데이터가 모두 있으면 사용자 선택 모달 제공.
4. 메인 홈에 2주 유예 공지 모달(수동 날짜 기준, 1일 숨김 체크) 노출.

## 확정 결정사항
1. 동기화 방식: 완전 자동.
2. 충돌 기본 정책: 클라우드 우선.
3. 예외 정책: 클라우드 비어 있고 로컬에 데이터 있으면 로컬 -> 클라우드 부트스트랩.
4. 충돌 UI: 로컬/클라우드 모두 데이터가 있고 값이 다르면 선택 모달 표시.
5. 범위: 지정 키만 Phase 1 적용.
6. 무백업 키 정책: Export 없는 키도 Phase 1 포함.
7. 백업 정책: 기존 Export 기능만 안내(신규 통합 백업 도구는 이번 범위 제외).
8. 유예기간 기준: 수동 공지일 기준(코드 상수로 시작/종료일 수동 지정).
9. 제외 유지: `pull-tracker:*`, `tactic_maker_autosave`, `tactic_maker_autosave_time`는 로컬 전용.

## 저장 키 매트릭스 (Phase 1)
| Namespace | 로컬 키 | 페이지 | Supabase 동기화 | 현재 Export |
|---|---|---|---|---|
| `calc_defense_options` | `defenseCalc_penetrateOptions`, `defenseCalc_reduceOptions` | `/defense-calc/` | 예 | 없음 |
| `calc_critical_options` | `criticalCalc_selfOptions`, `criticalCalc_buffOptions` | `/critical-calc/` | 예 | 없음 |
| `character_qevel` | `qevel-value` | `/character.html` (QEVEL 모달) | 예 | 없음 |
| `pull_calc` | `pullCalc_*` | `/pull-calc/` | 예 | 없음 |
| `pay_calc` | `payCalcBaseResources` | `/pay-calc/` | 예 | 없음 |
| `material_planner` | `materialPlannerStateV1` | `/material-calc/` | 예 | 있음 (`backup/load`) |
| `maps_progress` | `clickedObjects` | `/maps/` | 예 | 있음 (`backup/restore`) |
| `wonder_weapon_shard` | `wonder_weapon_shard_*` | `/wonder-weapon/` | 예 | 없음 |
| `synergy_spoiler` | `unlockQuestSpoiler_*` | `/synergy/` | 예 | 없음 |
| `pull_tracker` | `pull-tracker:*` | `/pull-tracker/` | 아니오(로컬 유지) | 있음 (`export/import`) |
| `tactic_maker_autosave` | `tactic_maker_autosave*` | `/tactic-maker/` | 아니오(로컬 유지) | 있음(수동 export/import, 단 autosave 자체는 로컬) |

## DB 설계 (Supabase)
### 테이블
`public.user_sync_state`

```sql
create table if not exists public.user_sync_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  namespace text not null,
  payload jsonb not null default '{}'::jsonb,
  payload_hash text not null default '',
  payload_size int generated always as (pg_column_size(payload)) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, namespace),
  constraint user_sync_state_namespace_chk check (
    namespace in (
      'calc_defense_options',
      'calc_critical_options',
      'character_qevel',
      'pull_calc',
      'pay_calc',
      'material_planner',
      'maps_progress',
      'wonder_weapon_shard',
      'synergy_spoiler'
    )
  ),
  constraint user_sync_state_payload_size_chk check (pg_column_size(payload) <= 262144)
);

create index if not exists user_sync_state_user_updated_idx
  on public.user_sync_state (user_id, updated_at desc);
```

### updated_at 트리거
```sql
create or replace function public.tg_user_sync_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tr_user_sync_state_updated_at on public.user_sync_state;
create trigger tr_user_sync_state_updated_at
before update on public.user_sync_state
for each row execute function public.tg_user_sync_state_updated_at();
```

### RLS
```sql
alter table public.user_sync_state enable row level security;
alter table public.user_sync_state force row level security;

create policy user_sync_state_select_own
on public.user_sync_state
for select to authenticated
using ((select auth.uid()) = user_id);

create policy user_sync_state_insert_own
on public.user_sync_state
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy user_sync_state_update_own
on public.user_sync_state
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy user_sync_state_delete_own
on public.user_sync_state
for delete to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.user_sync_state to authenticated;
```

## 클라이언트 아키텍처
### 신규 파일
1. `assets/js/supabase/user-sync-config.js`
2. `assets/js/supabase/user-sync-namespaces.js`
3. `assets/js/supabase/user-sync-manager.js`
4. `apps/home/js/sync-migration-notice.js`
5. `scripts/manual/create-user-sync-state.sql` (위 SQL 저장)

### 공개 인터페이스
```ts
type SyncNamespace =
  | 'calc_defense_options'
  | 'calc_critical_options'
  | 'character_qevel'
  | 'pull_calc'
  | 'pay_calc'
  | 'material_planner'
  | 'maps_progress'
  | 'wonder_weapon_shard'
  | 'synergy_spoiler';

interface SyncBootstrapResult {
  page: string;
  namespaces: SyncNamespace[];
  status: 'skipped' | 'synced' | 'conflict-resolved' | 'error';
}

window.UserSyncManager.bootstrapForPage(pageKey: string): Promise<SyncBootstrapResult>;
window.UserSyncManager.flush(): Promise<void>;
window.UserSyncManager.getStatus(): { loggedIn: boolean; enabled: boolean; page: string };
```

### 핵심 동작
1. `bootstrapForPage(pageKey)` 실행 시 세션 확인.
2. 미로그인: 로컬만 사용, 동기화 미수행.
3. 로그인: 현재 페이지와 연관된 namespace만 조회.
4. 로컬/클라우드 비교 후 규칙 적용.
5. 적용 결과를 로컬 키에 반영.
6. 이후 `localStorage.setItem/removeItem` 패치로 추적 키 변경 감지.
7. 디바운스 + 해시 비교 후 `upsert` 실행.

### 충돌 규칙
1. 클라우드 비어있고 로컬 유효 데이터 있음: 로컬 업로드.
2. 로컬 비어있고 클라우드 유효 데이터 있음: 클라우드 다운로드.
3. 둘 다 유효하고 동일 해시: 무동작.
4. 둘 다 유효하고 상이: 선택 모달 표시.
5. 선택 기본 포커스: "클라우드 사용".
6. 선택 결과는 `localStorage`에 namespace별 캐시해서 같은 충돌 재질문 최소화.

## Egress 절감 설계
1. 페이지 단위 lazy fetch: 해당 페이지 namespace만 조회.
2. 초기 1회 fetch 후 폴링 없음.
3. 쓰기 디바운스 1500ms.
4. 이전 해시와 동일하면 write skip.
5. namespace별 최소 write 간격 10초.
6. payload 256KB 초과 시 cloud write skip + 콘솔 경고.
7. `pull-tracker` 제외 유지로 대용량 egress 차단.

## 페이지별 적용 포인트
### Supabase client include 추가 대상
`{% include supabase-config.html %}`를 아래에 추가.

1. `_includes/defense-calc-body.html`
2. `_includes/critical-calc-body.html`
3. `_includes/pull-calc-body.html`
4. `_includes/pay-calc-body.html`
5. `_includes/material-calc-body.html`
6. `_includes/synergy-body.html`
7. `_includes/wonder-weapon-body.html`
8. `_includes/character-detail-body.html`
9. `_includes/maps-body.html`

### bootstrap 호출 삽입
각 페이지 초기화 직전에 `await window.UserSyncManager.bootstrapForPage('<page-key>')` 삽입.

1. `apps/defense-calc/defense-calc.js` DOMContentLoaded start 직전.
2. `_includes/critical-calc-body.html` DOMContentLoaded 내부 `new CriticalCalc()` 직전.
3. `apps/pull-calc/pull-calc.js` DOMContentLoaded 내부 `new PullSimulator()` 전.
4. `apps/pay-calc/pay-calc.js` DOMContentLoaded 내부 `new PayCalculator()` 전.
5. `_includes/material-calc-body.html` DOMContentLoaded 내부 `MaterialPlanner.init()` 전.
6. `apps/synergy/synergy.js` `init()` 함수 시작부.
7. `apps/wonder-weapon/wonder-weapon.js` DOMContentLoaded 시작부.
8. `assets/js/character/QEVEL.js` `showQEVELModal()` 시작부.
9. `_includes/maps-body.html` 맵 초기화 IIFE 시작부.

## 메인 홈 공지 모달 사양
### 목적
로그인 기반 저장 전환 테스트 공지 + 로컬 데이터 손실 가능성 안내 + 기존 export 사용 안내.

### 표시 조건
1. 홈 경로에서만 표시.
2. `SYNC_NOTICE_START_AT` 이후 활성화.
3. 하루 숨김 키가 유효하면 미표시.
4. `SYNC_NOTICE_END_AT` 이전: "2주 유예 중" 메시지.
5. `SYNC_NOTICE_END_AT` 이후: "유예 종료, 로컬 데이터 보장 불가" 메시지.

### 날짜 상수 (수동 지정)
`assets/js/supabase/user-sync-config.js`에 ISO 문자열로 명시.

- `SYNC_NOTICE_START_AT = 'YYYY-MM-DDT00:00:00+09:00'`
- `SYNC_NOTICE_END_AT = 'YYYY-MM-DDT23:59:59+09:00'`

### UI 요구
1. 체크박스 라벨: `1일간 보지 않기`.
2. 버튼: `닫기`, `로그인`.
3. 로그인 버튼: `/login/?redirect=<current-url>`.
4. Export 안내 리스트는 "기존 기능 있는 페이지만" 표시.
5. Export 미지원 페이지가 존재함을 명시.

### 텍스트/i18n 추가
아래 3개 파일에 키 추가.

1. `i18n/pages/home/kr.js`
2. `i18n/pages/home/en.js`
3. `i18n/pages/home/jp.js`

## 로그인 안내 정책
1. 미로그인 사용자는 기존 로컬 저장 유지.
2. 페이지 상단(또는 토스트)으로 "로그인하면 계정 저장 동기화" 1회 안내.
3. 강제 차단 없음.
4. 저장을 계정에 보존하려면 로그인 필요.

## Export 안내 정책 (요청 반영)
신규 통합 백업 도구는 이번 범위에서 만들지 않는다.
공지 모달/안내문에 "기존 export 기능 활용"을 명시한다.

### 모달 내 노출 리스트
1. 맵(`/maps/`) Backup/Restore
2. 재료 계산기(`/material-calc/`) Backup/Load
3. 택틱(`/tactic/`) Export/Import
4. 택틱 메이커(`/tactic-maker/`) Export/Import
5. 풀 트래커(`/pull-tracker/`) Export/Import

### 필수 문구
"일부 페이지(방어/크리티컬/가챠 플래너/과금/시너지/원더무기/QEVEL)는 별도 Export 기능이 없습니다. 해당 데이터는 로그인 동기화를 권장합니다."

## 구현 순서 (작업 단위)
1. SQL 준비: `scripts/manual/create-user-sync-state.sql` 작성.
2. config 작성: `user-sync-config.js` (feature flag + 날짜 + namespace map).
3. namespace mapper 작성: `user-sync-namespaces.js` (read/write/hasData/hash).
4. manager 작성: `user-sync-manager.js` (bootstrap, conflict, flush, patch).
5. 각 페이지 bootstrap hook 삽입.
6. 홈 모달 마크업/스크립트 추가: `_includes/home-body.html`, `apps/home/js/sync-migration-notice.js`.
7. 홈 i18n 3개 언어 키 추가.
8. QA/테스트 시나리오 수행.
9. feature flag on 후 배포.
10. 공지 시작/종료일 상수 수동 반영 후 운영.

## 테스트 케이스 및 시나리오
1. 미로그인 상태에서 대상 페이지 입력 저장 시 localStorage만 갱신되고 네트워크 동기화 요청 없음.
2. 로그인 + 클라우드 없음 + 로컬 있음: 첫 로드에서 로컬 업로드.
3. 로그인 + 클라우드 있음 + 로컬 없음: 첫 로드에서 로컬 복원.
4. 로그인 + 양쪽 데이터 상이: 충돌 모달 표시.
5. 충돌에서 "클라우드 사용" 선택 시 로컬이 클라우드 값으로 치환.
6. 충돌에서 "로컬 사용" 선택 시 클라우드 overwrite.
7. `pull-tracker:*` 데이터는 어떠한 경우에도 Supabase로 전송되지 않음.
8. `tactic_maker_autosave*`는 Supabase 전송되지 않음.
9. `clickedObjects` 동기화 후 맵 체크 상태가 재접속/타기기에서 동일.
10. `wonder_weapon_shard_*` 동기화 후 무기 체크 상태 유지.
11. `unlockQuestSpoiler_*` 동기화 후 스포일러 해제 상태 유지.
12. payload 256KB 초과 시 write skip되고 앱 동작은 계속됨.
13. 네트워크 실패 시 로컬 저장 정상, 재시도 큐 동작.
14. 홈 모달 "1일간 보지 않기" 체크 시 24시간 재노출 없음.
15. 홈 모달 날짜 분기: 시작 전 미노출, 유예 중 문구, 종료 후 문구 확인.

## 롤아웃/모니터링/롤백
1. feature flag: `SYNC_ENABLED`로 즉시 비활성 가능.
2. 런타임 로그: namespace별 `bootstrap`, `conflict`, `upsert`, `skip(size/hash)` 콘솔 태그.
3. 장애 시 조치: `SYNC_ENABLED=false` 배포, 기존 로컬 저장 경로 유지.
4. DB 롤백: 테이블 유지해도 앱 영향 없음. 필요 시 정책만 revoke 가능.

## 가정 및 기본값
1. 유예 공지 기간은 KST 기준 수동 날짜 상수로 운영한다.
2. Export 미지원 키도 Phase 1 동기화 대상에 포함한다.
3. 로컬 데이터는 자동 삭제하지 않는다. 다만 유예 종료 후 보장하지 않는다고 공지한다.
4. 기존 페이지 로직(localStorage read/write)은 최대한 유지하고, 공통 Sync 레이어로 확장한다.
5. 다국어는 `kr/en/jp` 필수 반영, `cn`은 키 구조만 확장 가능하게 유지한다.
6. 모든 신규/수정 파일은 UTF-8 BOM 없이 저장한다.
