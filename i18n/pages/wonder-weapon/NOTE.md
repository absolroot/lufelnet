# Wonder-Weapon 페이지 i18n 특수 항목

이 파일은 Wonder-Weapon 페이지에서 i18n 시스템의 특수 처리 사항을 정리합니다.

## ✅ 완료된 i18n 마이그레이션

### `apps/wonder-weapon/index.html`
**상태**: ✅ 완전히 i18n 시스템으로 마이그레이션 완료

**i18n으로 관리되는 항목:**
- ✅ 네비게이션 (홈, 원더 무기)
- ✅ 페이지 제목
- ✅ 필터 제목 (전체, 교환, 스토리)
- ✅ 검색창 Placeholder

### `apps/wonder-weapon/wonder-weapon.js`
**상태**: ✅ 완전히 i18n 시스템으로 마이그레이션 완료

**i18n으로 관리되는 항목:**
- ✅ 획득처 표기 (Source Map: Shop, Palace 1~7)
- ✅ 섹션 제목 (획득처, 개조 설명, 주요 괴도, 수정 등)
- ✅ Lightning Stamp 관련 문구
- ✅ 출시 시점 관련 문구
- ✅ 에러 및 상태 메시지 (검색 결과 없음, 로딩 실패 등)

**주요 변경 사항:**
- 하드코딩된 `i18n` 객체 제거
- 전역 `t()` 함수 사용
- `getLocalizedSource` 함수가 `getSourceMapValue` 헬퍼 사용하도록 변경

---

## ⚠️ 특수 처리가 필요한 항목

### 1. SEO 메타데이터 (`updateSEO`)
**위치**: `wonder-weapon.js` 라인 136-161

SEO 관련 제목과 설명은 여전히 JS 파일 내에 하드코딩된 객체로 남아있습니다.
단, `title` 속성은 `t('pageTitle')`을 사용하여 일부 동적으로 처리되도록 개선되었습니다.

```javascript
const seo = {
  kr: {
    title: t('pageTitle') + ' - 페르소나5 더 팬텀 X 루페르넷',
    description: '...'
  },
  // ...
};
```

**권장 사항**: 향후 SEO 전용 JS 모듈이 도입되면 통합될 예정입니다.

### 2. 데이터 파일
**위치**: `/data/{lang}/wonder/weapons.js` 등

무기 이름, 효과 설명 등 실제 데이터는 별도의 데이터 파일에서 로드됩니다.
이 데이터 파일들은 이미 언어별로 분리되어 있습니다 (`kr`, `en`, `jp`).
