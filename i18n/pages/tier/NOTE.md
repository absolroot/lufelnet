# Tier 페이지 i18n - 별도 관리 항목

## ⚠️ i18n 시스템 외 별도 관리

### 1. QA 섹션
**파일**: `apps/tier/position-tier-qa.js`

- 복잡한 다단락 텍스트 (개행, 서식 포함)
- JavaScript 렌더링 로직과 강하게 결합
- 별도 파일로 하드코딩 관리 권장

### 2. 캐릭터 데이터
**파일**: `/data/{lang}/characters/characters.js`

- 캐릭터 이름, 속성, 직업 등
- i18n이 아닌 콘텐츠 데이터
- 언어별 별도 파일 유지
