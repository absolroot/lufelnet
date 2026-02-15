# EN/JP characters.js 통합 마이그레이션 계획 (`data/character_info_glb.js`)

## 요약
- EN/JP 전용 캐릭터 목록/출시순서 데이터를 `data/character_info_glb.js` 1개로 통합.
- 런타임/스크립트의 EN/JP `characters.js` 참조를 새 파일로 전환.
- 기존 `data/en/characters/characters.js`, `data/jp/characters/characters.js` 제거.
- KR 원본 메타(`data/character_info.js`)는 유지.

## 공개 인터페이스
- 신규 데이터 엔드포인트: `data/character_info_glb.js`
- 데이터 계약 유지: `window.characterList`, `window.characterData`
- 언어 규칙:
  - `kr` -> `/data/character_info.js`
  - `en`, `jp` -> `/data/character_info_glb.js`
  - 기타 언어 -> `/data/{lang}/characters/characters.js` fallback

## 변경 대상
1. `apps/character/index.html`
2. `apps/character/character.html`
3. `assets/js/tactics-viewer.js`
4. `apps/tier/position-tier.html`
5. `assets/js/tactic/setparty.js`
6. `assets/js/character/character-list.js`
7. `apps/tactic-maker/js/data-loader.js`
8. `apps/tactic/index.html`
9. `apps/material-calc/material-planner.js`
10. `apps/home/js/popular-characters.js`
11. `scripts/syncCharacter.mjs`
12. `scripts/syncInnate.mjs`
13. `i18n/pages/tier/NOTE.md`

## 데이터 정책
- EN/JP는 동일 글로벌 서버 정책으로 단일 목록/출시순서 세트 사용.
- 공통 파일에는 언어별 고유 표시 문자열(`name` 등)을 두지 않음.
- 표시 이름은 기존대로 `data/character_info.js`의 `name_en`, `name_jp` 우선 사용.
- 고유명사 key는 KR 기준 key를 유지.

## 검증 체크리스트
- [ ] EN/JP 직접 참조 제거 확인 (`/data/{lang}/characters/characters.js`)
- [ ] `data/character_info_glb.js` 로드 확인
- [ ] 레거시 파일 삭제 확인 (`data/en/characters/characters.js`, `data/jp/characters/characters.js`)
- [ ] KR/EN/JP 주요 페이지 동작 확인
- [ ] `syncCharacter`, `syncInnate` EN/JP key lookup 경로 확인
