# SEO/i18n 동적 페이지 대응 실행 계획서
- 작성일: 2026-02-15
- 저장소: `lufelnet`
- 문서 목적: 어떤 에이전트가 맡아도 같은 방식으로 구현되도록 단일 기준을 제공한다.

## 1. 문제 정의
- 현재 다수 페이지가 `?lang=`, `?name=`, `?map=`, `?character=`, `?data=` 같은 쿼리값으로 화면과 SEO를 동적으로 바꾼다.
- X/Discord/기타 봇은 JS 실행 없이 HTML head를 읽는 경우가 많아, 런타임 JS 기반 메타 변경만으로는 언어/엔티티별 공유 미리보기가 불안정하다.
- 요구사항은 다음 2가지를 동시에 만족해야 한다.
- 외부 노출 URL은 언어 경로 기반(`/{lang}/...`)으로 보이기.
- 내부 앱 로직은 기존 쿼리 기반(`?lang=...`)을 최대한 재사용하기.

## 2. 목표
- 언어/엔티티별 SEO 메타를 JS 이전 단계에서 확정한다.
- 동적 페이지(캐릭터/페르소나/맵/시너지)를 URL 기반으로 안정적으로 제어한다.
- 기존 앱 로직을 최대한 유지하면서 마이그레이션한다.

## 3. 비목표
- UI/디자인 개편은 본 계획 범위가 아니다.
- 기존 i18n 텍스트 체계를 전면 교체하지 않는다.
- 검색 엔진 순위 최적화(키워드 전략/백링크)는 본 계획의 핵심 범위가 아니다.

## 4. 필수 원칙
- 공유봇 기준 최종 소스는 서버가 반환한 HTML head다.
- SEO 전용 런타임 JS는 보조 수단이며, 정적/서버 메타를 대체하지 않는다.
- canonical은 쿼리형 내부 URL이 아닌 외부 표준 URL로 고정한다.
- `hreflang`은 실제 제공되는 언어만 출력한다.
- 고유 명사는 임의 의역 금지. 확정되지 않은 명칭은 `TODO-TRANSLATION` 상태로 남기고 검수 절차를 거친다.

## 5. 현재 동적 SEO 우선 대상

| 페이지군 | 현재 동적 키 | 현재 구현 특성 | 우선도 |
| --- | --- | --- | --- |
| Character | `name`, `lang` | 캐릭터 선택에 따라 title/description/og/canonical 동적 변경 | P0 |
| Persona | `name`, `lang`, `search` | 선택 페르소나에 따라 title/description/canonical 동적 변경 | P0 |
| Maps | `map`, `category`, `lang` | 선택 맵 경로 기반으로 title/description/og:url 동적 변경 | P0 |
| Synergy | `character`, `lang` | 캐릭터 탭 선택에 따라 title 동적 변경 | P1 |
| Tactic Share | `data`, `lang` | 공유용 특수 URL. 데이터 payload 중심 | P1 |

## 6. 공개 URL 표준안
- 외부 노출 URL은 경로형을 기본으로 사용한다.
- 내부 라우팅은 쿼리형을 유지하되 edge/server rewrite로 연결한다.

| 페이지군 | 공개 URL(권장) | 내부 앱 URL(유지) |
| --- | --- | --- |
| Character | `/{lang}/character/{character-slug}` | `/character.html?name={originalName}&lang={lang}` |
| Persona | `/{lang}/persona/{persona-slug}` | `/persona/?name={originalName}&lang={lang}` |
| Maps | `/{lang}/maps/{mapId}` | `/maps/?map={mapId}&lang={lang}` |
| Synergy | `/{lang}/synergy/{characterCode}` | `/synergy/?character={characterCode}&lang={lang}` |
| Tactic Share | `/{lang}/tactic/share/{shareId}`(선택) 또는 기존 유지 | `/tactic/?data={payload}&lang={lang}` |

## 7. SEO 데이터 구조(신규)
- UI 번역(`i18n/pages/...`)과 SEO 소스(`i18n/seo/...`)를 분리한다.
- SEO는 엔티티 단위로 독립 관리해서 빌드 시 정적 head를 생성한다.

권장 구조:

```text
i18n/
  seo/
    schema/
      seo-schema.md
    common/
      kr.json
      en.json
      jp.json
    pages/
      character/
        kr.json
        en.json
        jp.json
      persona/
        kr.json
        en.json
        jp.json
      maps/
        kr.json
        en.json
        jp.json
      synergy/
        kr.json
        en.json
        jp.json
    entities/
      character/
        kr.json
        en.json
        jp.json
      persona/
        kr.json
        en.json
        jp.json
      maps/
        kr.json
        en.json
        jp.json
      synergy/
        kr.json
        en.json
        jp.json
```

필수 필드:
- `id`: 언어 독립 ID
- `slug`: 언어별 URL slug
- `title`
- `description`
- `ogImage`
- `locale`: `ko_KR`, `en_US`, `ja_JP`
- `available`: 언어 제공 여부
- `canonicalPath`: 공개 URL path
- `robots`: `index,follow` 또는 `noindex,follow`

## 8. 렌더링 아키텍처

### 8.1 서버/정적 head 레이어
- `_includes/seo-head.html` 단일 include에서 meta/canonical/hreflang/tw/og를 출력한다.
- 각 페이지는 front matter 또는 생성된 manifest로 SEO 값을 주입받는다.
- 빌드 시점에 언어/엔티티별 head가 확정된 HTML을 만든다.

### 8.2 런타임 레이어
- `assets/js/seo-runtime.js`를 별도 두고, 사용자 인터랙션 중 `document.title` 동기화만 수행한다.
- 런타임 변경은 UX 개선용이며 봇 의존 로직으로 사용하지 않는다.

### 8.3 라우팅 레이어
- 공개 URL(`/{lang}/...`) 요청 시 edge/server에서 내부 쿼리형으로 rewrite한다.
- rewrite는 주소창 URL을 유지한다.
- edge 미사용 환경에서는 최소한 언어/엔티티별 정적 스텁 페이지를 생성한다.

## 9. 페이지별 세부 전략

### 9.1 Character
- 기준 ID: 캐릭터 코드명(가능하면 codename) 또는 고정 키.
- 입력 alias: KR/EN/JP 이름을 alias 맵으로 흡수.
- canonical: `/{lang}/character/{slug}`.
- 내부 연결: 기존 `character.html?name=...` 로직 재사용.
- EN/JP 미출시 시 `available=false`, 기본은 `noindex`.

### 9.2 Persona
- 기준 ID: 페르소나 고정 키.
- canonical: `/{lang}/persona/{slug}`.
- 내부 연결: `persona/?name=...`.
- SEO description은 코멘트 기반 동적 생성 대신, 빌드 가능한 템플릿 + 엔티티 설명 필드 조합으로 생성.

### 9.3 Maps
- 기준 ID: `maps_list.json`의 `id`.
- canonical: `/{lang}/maps/{mapId}`.
- category/submap은 canonical에서 최소화한다.
- 상세 경로 표시는 title/description 템플릿으로 생성하되 canonical은 단일 키 유지.

### 9.4 Synergy
- 기준 ID: `character` 코드명.
- canonical: `/{lang}/synergy/{characterCode}`.
- 내부 연결: `synergy/?character=...`.
- locale별 데이터 파일 부재 시 정책적으로 `noindex` 또는 미노출 처리.

### 9.5 Tactic Share
- `data` payload URL은 색인 가치가 낮고 중복이 심하다.
- 기본 정책: `noindex, noarchive`.
- 공유 카드가 필요하면 summary 전용 endpoint를 별도로 설계한다.

## 10. 구현 단계(에이전트 실행 순서)

### Phase 0: 사전 결정 고정
- 미출시 콘텐츠 처리 기준 확정.
- `x-default` 대상 언어 확정.
- slug 규칙(공백/특수문자/대소문자) 확정.

### Phase 1: 인벤토리/키 정규화
- `character/persona/maps/synergy` 엔티티 ID 테이블 생성.
- KR/EN/JP alias 맵 생성.
- 충돌 slug 탐지 규칙 구현.

### Phase 2: SEO 데이터 소스 구축
- `i18n/seo/common`, `i18n/seo/pages`, `i18n/seo/entities` 생성.
- 각 엔티티별 `available` 채우기.
- 고유명사 검수 필요 항목 목록화.

### Phase 3: 생성기 구현
- `scripts/seo/build-seo-manifest.mjs` 작성.
- 산출물 예시:
- `build/seo/manifest.json`
- `build/seo/routes.json`
- `build/seo/hreflang.json`

### Phase 4: Jekyll head 통합
- `_includes/seo-head.html` 신설.
- `_layouts/default.html`에서 기존 중복 메타를 include 기반으로 통합.
- canonical/hreflang/og/twitter 출력 경로 통일.

### Phase 5: 라우팅 통합
- edge rewrite 또는 정적 스텁 생성 중 택1 또는 병행.
- 공개 URL → 내부 쿼리 URL 매핑 테이블 적용.
- 기존 `?lang=` 직접 링크는 점진적 유지 후 마이그레이션.

### Phase 6: 검증/출시
- 봇 UA 기반 HTML head 검증.
- canonical/hreflang 자동 검증.
- 미출시 콘텐츠 noindex 검증.
- 점진 배포 및 rollback 시나리오 실행.

## 11. 검증 체크리스트(필수)
- [ ] `/{lang}/character/{slug}`가 언어별 title/description/og를 SSR/정적으로 제공한다.
- [ ] `/{lang}/persona/{slug}`가 언어별 canonical/hreflang을 정확히 출력한다.
- [ ] `/{lang}/maps/{mapId}`가 JS 없이도 올바른 OG 카드 값을 가진다.
- [ ] `?lang=` 직접 접근 시 공개 URL로 301 또는 rewrite 일관 처리된다.
- [ ] sitemap에 제공 언어만 포함된다.
- [ ] `x-default`가 정책과 일치한다.

## 12. 테스트 명세

자동 테스트:
- `scripts/seo/validate-seo.mjs` 추가.
- 검사 항목:
- URL별 `title`, `meta description`, `og:title`, `og:description`, `og:url`, `canonical`, `hreflang`.
- `available=false` 엔티티의 robots 정책.
- slug 중복 여부.

수동 테스트:
- `curl`로 UA 지정 테스트:
- `Twitterbot`
- `Discordbot`
- `facebookexternalhit`
- 랜덤 샘플 20개 URL 검증(언어/엔티티 균등 분포).

## 13. 운영 정책
- 고유명사 번역 신규 추가 시 `translation-review` 라벨로 검수한다.
- 검수 미완료 엔티티는 `available=false` 또는 `TODO-TRANSLATION`로 배포 차단한다.
- EN/JP 서버 미출시 데이터는 KR 강제 노출하지 않는다(정책 변경 전까지 기본 `noindex` 권장).

## 14. 리스크와 대응
- 리스크: slug 충돌.
- 대응: 빌드 단계에서 실패 처리.
- 리스크: 기존 링크 깨짐.
- 대응: legacy URL 매핑 + 301/rewrites + 추적 로그.
- 리스크: JS 의존 SEO 잔존.
- 대응: 린터/검증 스크립트로 `document.title`만 남기고 핵심 메타는 빌드 소스로 강제.

## 15. 롤백 전략
- edge rewrite 규칙 플래그로 즉시 비활성화 가능하게 한다.
- `_includes/seo-head.html` 도입 이전 head 템플릿을 별도 백업한다.
- manifest 생성 실패 시 기존 경로를 fallback으로 서비스한다.

## 16. 에이전트 작업 규칙
- 이 문서 기준으로 작업 시 PR은 Phase 단위로 분리한다.
- 각 PR에는 다음을 반드시 포함한다.
- 변경 파일 목록
- 검증 로그
- 미해결 이슈 목록
- 고유명사 신규/변경 목록

## 17. 우선 실행 권장안
- 1차 릴리스 범위: `character`, `persona`, `maps`.
- 2차 릴리스 범위: `synergy`, `tactic share`.
- 최종 전환 전까지 `?lang=` 링크는 호환 유지한다.
