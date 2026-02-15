# Tier 페이지 i18n 메모

## 통합 i18n 적용 항목

### 1. QA 섹션
**번들 키**: `tierQaTitle`, `tierQaItems`  
**파일**: `i18n/pages/tier/kr.js`, `i18n/pages/tier/en.js`, `i18n/pages/tier/jp.js`  
**렌더러**: `apps/tier/position-tier-qa.js`

- 다단락 답변은 `tierQaItems[].a`의 줄바꿈(`\n`)으로 관리
- 렌더러는 언어별 번들에서 동일 키를 읽어 `<p>` 단위로 출력

## 별도 관리 항목

### 1. 캐릭터 데이터
**파일**:
- KR: `/data/character_info.js`
- EN/JP: `/data/character_info_glb.js`
- 기타 언어(예: CN): `/data/{lang}/characters/characters.js` (fallback)

- 캐릭터 이름, 속성, 직업 등 콘텐츠 데이터
- i18n 페이지 번들이 아닌 데이터 파일로 유지
