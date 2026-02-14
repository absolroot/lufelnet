# Wonder-Weapon 페이지 i18n 메모

## 통합 i18n 적용 항목

### 1. SEO 메타데이터
**번들 키**: `seoTitle`, `seoDescription`  
**파일**: `i18n/pages/wonder-weapon/kr.js`, `i18n/pages/wonder-weapon/en.js`, `i18n/pages/wonder-weapon/jp.js`  
**적용 코드**: `apps/wonder-weapon/wonder-weapon.js`의 `updateSEO()`

- SEO 제목/설명은 페이지 번들 키 조회(`t`)로 처리
- JS 내부 언어별 SEO 하드코딩 객체 제거

### 2. Source 매핑
**번들 키**: `sourceMap`  
**적용 코드**: `apps/wonder-weapon/wonder-weapon.js`의 `getSourceMapValue()`

- 로컬 fallback map 제거
- 번들 `sourceMap` 기준으로 표시

## 별도 관리 항목

### 1. 데이터 파일
**위치**: `/data/{lang}/wonder/weapons.js` 등

- 무기 이름/효과 설명 등 콘텐츠 데이터
- i18n 페이지 번들이 아닌 언어별 데이터 파일로 유지
