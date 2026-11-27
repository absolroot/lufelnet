---
name: lufelnet-supporters-update
description: Lufelnet 프로젝트의 About 후원 목록을 Ko-fi와 동기화합니다. 사용자가 후원목록 업데이트, 최근 후원 반영, 또는 About 후원자 추가를 요청할 때 사용합니다.
---

# Lufelnet 후원 목록 업데이트

## Ko-fi 내역 확인

1. `_private/supporters.csv`에서 마지막 Ko-fi 거래 날짜와 거래 ID를 확인합니다. 파일이 없으면 사용자에게 로컬 원본을 요청합니다. 공개 CSV에는 금액과 날짜가 없으므로 원본을 복원하는 데 사용할 수 없습니다.
2. **Browser 스킬**로 [Ko-fi 프로필](https://ko-fi.com/absolroot)을 열고 로그인된 계정의 `Payments & orders`에서 `Received`를 선택합니다. Browser 연결이 되지 않으면 해당 스킬의 연결 복구 절차를 따릅니다. Ko-fi 확인에는 Browser 스킬을 사용합니다.
3. `CSV`에서 필요한 월을 선택해 내보냅니다. 목록에 보이는 일회성 후원과 월 후원을 모두 포함하고, 마지막으로 반영한 월도 다시 확인합니다. 공개 피드에는 월 후원의 일부가 표시되지 않습니다. 내보내기에 포함된 이메일, 결제 수단, 메시지, 주소 등은 옮기지 않습니다.
4. `transaction_id`로 중복을 확인합니다. ID가 없는 기존 행은 표시명, 날짜, 금액, 통화를 대조해 같은 거래인지 확인합니다. 수기로 적은 날짜는 Ko-fi 기록과 다를 수 있으므로 후보가 여러 개면 따로 확인합니다. 표시명이 바뀐 경우 같은 후원자임을 확인한 뒤 한 이름으로 통일합니다.

## CSV 갱신과 확인

- `_private/supporters.csv`는 UTF-8로 저장합니다. `name,date,amount,currency,source,kind,transaction_id,public,highlight` 순서로 거래마다 한 행을 추가합니다. Ko-fi의 `DateTime (UTC)`는 `YYYY-MM-DD`, `Received`는 통화 기호 없는 숫자, `source`는 `ko-fi`, `kind`는 `one-time` 또는 `monthly`로 저장합니다. 이전에 월까지만 기록된 행은 `YYYY-MM`을 유지합니다.
- 기존 About, Ko-fi 공개 피드 또는 리더보드에서 공개 표시가 확인된 이름은 `public=yes`로 기록합니다. 익명 표시나 공개 여부가 확인되지 않은 이름은 `public=no`로 기록합니다. 기존 강조 표시가 있는 행을 수정할 때는 `highlight`를 유지합니다.
- `python .agents/skills/lufelnet-supporters-update/scripts/generate_supporters.py`를 실행하고 같은 명령에 `--check`를 붙여 확인합니다. 공개 거래의 후원자별 합계 순으로 `_data/supporters.csv`를 만듭니다. 통화가 다른 거래는 표시 순서를 계산할 때만 USD 1달러당 1,400원으로 계산합니다. 공개 CSV의 열은 `name,highlight`입니다.
- `git check-ignore _private/supporters.csv`로 비공개 원본이 제외되는지 확인합니다. 전체 Jekyll 빌드 후 `/about/`, `/kr/about/`, `/en/about/`, `/jp/about/`, `/cn/about/`에서 후원 버튼을 열어 목록을 확인합니다. 빌드 결과에 `_private`가 포함되지 않았는지도 확인합니다.
- 사용자에게 확인한 기간과 추가·갱신 건수를 알려줍니다. 금액, 거래 ID, 비공개 이름은 공개 파일이나 완료 메시지에 옮기지 않습니다.
