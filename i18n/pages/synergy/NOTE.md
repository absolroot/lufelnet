# Synergy 페이지 i18n 특수 항목

이 파일은 Synergy 페이지에서 i18n 시스템의  - 모바일 헤더: 이름/보상, 이름/가격/획득처
- **추가 개선**:
  - 로딩 및 에러 메시지(`msgLoading`, `msgLoadError`)를 i18n으로 처리
  - `CURRENCY_MAPPING` 및 `FILTER_TIME_MAPPING` 상수를 도입하여 매핑 로직 중앙화
  - `getMoneyIcon` 헬퍼 함수 구현으로 화폐 아이콘 처리 로직 개선
  - '아키하바라 게임 센터' 등 하드코딩된 장소명도 i18n(`labelMapAkihabaraArcade`) 적용

### 데이터 로딩
- 캐릭터별 데이터(`json`)는 기존 구조(언어별 폴더 `kr`, `en`, `jp` 사용)를 유지합니다.
- 단, 현재 언어 감지는 `i18nService`를 통해 이루어지므로 일관성이 확보되었습니다.
