# Plan: Character Meta Migration (`characters.js` -> `data/character_info.js`)

## Goal
- Remove KR hard dependency on `data/kr/characters/characters.js`.
- Use `data/character_info.js` as the canonical KR/global character metadata.
- Keep release filtering for non-KR using `data/{lang}/characters/characters.js`.

## Loading Rules (Final)
1. KR/global metadata: `/data/character_info.js`
2. EN/JP release list/filter data: `/data/{lang}/characters/characters.js`
3. `_layouts/default.html` `custom_data` behavior:
   - Absolute path (e.g. `/data/character_info.js`): load directly (with `site.baseurl`)
   - Relative path (e.g. `revelations/revelations.js`): resolve to `/data/kr/...` (existing behavior 유지)

## Applied Changes
- `_layouts/default.html`: `custom_data` 로더에 절대 경로 지원 추가.
- `custom_data`에서 `../character_info.js` 사용하던 페이지를 `/data/character_info.js`로 통일.
- KR 로딩 경로를 `/data/character_info.js`로 통일.
- 잘못 `/data/{lang}/../character_info.js`를 보던 언어별 로딩은 `/data/{lang}/characters/characters.js`로 복구.
- `sitemap.xml` 주석 경로 동기화 완료.

## Verification Status
- [x] 런타임에서 `data/kr/characters/characters.js` 직접 참조 제거
- [x] 런타임/프론트매터에서 `../character_info.js` 경로 제거
- [x] `data/kr/characters/characters.js` 삭제 완료
- [ ] 스모크 테스트
  - [ ] Home 인기 캐릭터
  - [ ] Character 목록/상세 (kr/en/jp)
  - [ ] Tactic / Tier / Synergy / Revelations
  - [ ] Pull Tracker / Material Calc / Wonder Weapon

## Rollback
- `data/kr/characters/characters.js` 복원
- 변경 파일 git revert/restore
