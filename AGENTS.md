# 다국어와 서버 그룹

- 신규 기능과 문구는 `/i18n`을 참조하고 `kr`, `en`, `jp`, `cn`을 지원합니다.
- 고유 명사는 공식 현지화와 기존 용례를 확인합니다.

- `kr`, `cn`, `tw`는 같은 서버 그룹으로 취급합니다.
- `en`, `jp`, `sea`는 같은 글로벌 서버 그룹으로 취급합니다.
- 출시 순서는 `cn`이 가장 빠르고, `kr`, `tw`는 `cn`보다 1주일 뒤에 출시됩니다.
- 글로벌 버전은 `en`, `jp`가 먼저 출시되고, `sea`는 그보다 6일 뒤에 출시됩니다.
- `en`, `jp`, `sea`는 `kr`, `cn`, `tw`보다 늦게 출시된 글로벌 서버라 미출시 콘텐츠가 많습니다. 그래서 한국어/중국어 기준의 모든 내용이 글로벌에 그대로 존재하지 않을 수 있습니다.
- 문서, 주석, 설명, 메모를 남길 때 `KR only`, `KR 서버 전용`, `KR v4.7.1 출시`처럼 쓰지 말고, 실제 서버 기준에 맞춰 `KR/CN`, `KR/CN v4.7.1 출시`처럼 표기합니다. 글로벌 기준 설명도 같은 방식으로 `EN/JP`, 필요하면 `EN/JP/SEA`로 표기합니다.

# 파일 인코딩

- 다국어 텍스트는 BOM 없는 UTF-8 평문으로 저장합니다.

# 정적 자산 캐시와 신규 기능
- 같은 출처의 CSS, JS, 빌드 시 경로를 알 수 있는 데이터 파일은 공통 사이트 버전이 아니라 **파일별 콘텐츠 해시**를 사용합니다.
- 해시 원본은 `_data/asset_versions.json`이며 직접 편집하지 않습니다. `npm run assets:hashes:generate`로 생성합니다.
- `_config.yml`의 `safe: true`는 유지합니다. 해시는 Jekyll 플러그인이 아니라 Node 사전 빌드 단계에서 생성합니다.
- `assets/css`와 `assets/js`의 페이지 자산은 가능하면 frontmatter의 `custom_css`, `custom_js`에 등록합니다. 기본 레이아웃이 파일별 `?h=`를 자동으로 붙입니다.
- 템플릿에서 로컬 자산을 직접 참조해야 한다면 다음 형태를 사용합니다.
  - CSS: `/path/file.css?h={{ site.data.asset_versions.files['/path/file.css'] }}`
  - JS: `/path/file.js?h={{ site.data.asset_versions.files['/path/file.js'] }}`
- 정적 CSS/JS URL에 `site.time`, `APP_VERSION`, `Date.now()` 또는 수동 숫자 버전을 붙이지 않습니다. 새 무해시 로컬 CSS/JS 태그는 `npm run assets:hashes:test`와 GitHub Actions가 실패시켜야 합니다.
- 런타임에만 파일명이 결정되는 자산은 전체 해시 목록을 모든 페이지에 싣지 않습니다. 페이지별 작은 매핑을 주입하거나, 즉시 최신성이 필요한 동적 데이터만 기존 재검증 경로를 명시적으로 사용합니다.
- 배포·검증 빌드는 `_config.full-build.yml`을 함께 사용해 증분 메타데이터가 이전 해시를 재사용하지 않게 합니다.
- 자산 관련 변경 후 최소 검증 명령은 `npm run assets:hashes:generate`, `npm run assets:hashes:check`, `npm run assets:hashes:test`, `npm run assets:cache-policy:test`, `npm run site:build`입니다.

# 페르소나·계시 목록 인덱스
- 페르소나 목록은 `data/persona/index.js`의 경량 인덱스로 먼저 표시하고, 상세 데이터는 우선순위/유휴 큐로 로드합니다. 이 파일은 직접 편집하지 말고 `npm run persona:index:generate`로 생성합니다.
- 새 페르소나를 추가하거나 `data/persona/order.js`, `data/persona/nonorder.js`, 개별 `data/persona/**/*.js`의 목록 표시 필드(이름, 속성, 직업, 등급, 티어 등)를 바꾼 경우 `npm run persona:index:generate`와 `npm run persona:index:check`를 실행합니다. 새 페르소나는 순서 목록과 `_data/persona_slugs.json`에도 등록되어야 합니다.
- 계시 페이지의 추천 캐릭터 역색인은 `data/revelations/character-index.js`입니다. 직접 편집하지 말고 `npm run revelation:index:generate`로 생성합니다. 원본은 각 `data/characters/<캐릭터>/setting.js`의 `main_revelation` 및 `sub_revelation`입니다.
- 새 계시, 새 캐릭터의 계시 추천, 또는 위 `setting.js` 배열을 수정한 경우 `npm run revelation:index:generate`와 `npm run revelation:index:check`를 실행합니다. 계시 데이터는 지원 언어(`en`, `kr`, `jp`, `cn`)의 `data/*/revelations/revelations.js`도 함께 갱신하고, EN/JP의 미출시 표기를 서버 출시 상태에 맞게 유지합니다.
- `npm run site:build`는 두 인덱스를 먼저 생성합니다. 관련 변경 후에는 인덱스 검사와 자산 해시 검사를 통과시킨 뒤 빌드합니다.

# 이미지와 영상 캐시
- `/assets/img/`의 지원 이미지 형식은 서비스 워커가 URL의 `v`와 `h`를 제거한 경로 키로 최대 2,000개까지 캐시합니다.
- 12시간은 삭제 만료 시간이 아닙니다. 캐시 이미지를 즉시 반환한 뒤, 간격이 지났을 때 다음 요청에서 백그라운드 재검증합니다. 네트워크 실패 시 기존 캐시는 유지됩니다.
- 이미지 캐시는 2,000개를 초과할 때 오래된 키부터 정리하며, 응답 크기가 5MB를 넘는 이미지는 저장하지 않습니다.
- 현재 이미지에 파일별 해시를 일괄 적용하지 않습니다. 적용하려면 서비스 워커가 해시가 있는 이미지의 `h`를 캐시 키에 보존하도록 함께 변경해야 합니다.
- 영상은 이미지 Cache Storage 대상이 아닙니다. 콘텐츠 해시를 도입하더라도 Range 요청을 지원하는 브라우저/CDN 캐시를 사용하고, 서비스 워커에 영상 전체를 저장하지 않습니다.
