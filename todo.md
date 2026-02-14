
# 할일 목록

## 데이터

캐릭터 정보 갱신
- 캐릭터 색상 / 태그
- 언어별 이름 설정
- 스킬
- 의식
- 전용 무기
- 심상 강화
- 기본 스탯 및 속도
- 캐릭터 권장 스탯 및 계시 설정
- 캐릭터 리뷰
- 캐릭터 파티 구성 추천
- 캐릭터 추천 운영 순서 및 택틱 메이커 반영
- 캐릭터 티어 조정
- 크리티컬/방어력 계산기 반영

패치 정보
- GLB/JP 스케줄 반영

갤러리
- 캐릭터 태그 및 일자 수정

페르소나
- 페르소나 스킬 추천도 표기
- 페르소나 획득처 
- 추천 육성 스킬
- 택틱 메이커용 별도 페르소나 카드 이미지 재가공 

협력자
- app/synergy/friends/friend_num.json 수정 - 캐릭터 num 및 img_color 별도 지정 필요
- node scripts/fetch-synergy.mjs {num} 입력하여 해당 캐릭터 정보 자동 갱신 // 자동화 완료 (02.14)



## 이미지

입력된 경로의 

기본적으로 복사하고 {krname}이 입력될 경우 {name}을 {krname}으로 변경.

전용무기 
- 경로: \assets\img\character-weapon\
- 파일 이름: {name}-2-01.png , {name}-3-01.png, {name}-4-01.png , {name}-5-01.png 

카드 이미지
- 경로: \assets\img\character-cards\png
- 파일 이름: guaidao-kapai-{name}-new.png
- webp 압축 변환 후 \assets\img\character-cards 에 복사

캐릭터 전신 이미지
- 경로: \assets\img\character-detail\png
- 파일 이름: lihui-guaidao-{name}.png
- webp 압축 변환 후 \assets\img\character-detail 에 복사

캐릭터 페르소나 전신 이미지
- 경로: \assets\img\character-detail\png
- 파일 이름: lihui-guaidao-{name}-02.png
- webp 압축 변환 후 \assets\img\character-detail 에 복사

캐릭터 반신 이미지
- 경로: \assets\img\character-half\png
- 파일 이름: {name}-generalAttack.png
- webp 압축 변환 후 \assets\img\character-half 에 복사

캐릭터 티어 이미지
- 경로: \assets\img\tier\png
- 파일 이름: touxiang-guaidaofu-{name}.png
- webp 압축 변환 후 \assets\img\tier 에 복사

시너지 캐릭터 이미지
- 경로: \assets\img\synergy\face 
- 파일 이름: '_normal_05_01_01' 포함한 모든 png 또는 'Tongyong-touxiang-changfu-'를 포함한 모든 png 

도시 이미지
- 경로 : \assets\img\synergy\place
- 파일 이름: 'dushi-ditiezhan-' 가 포함된 모든 png

페르소나 이미지
- 경로: \assets\img\persona\png
- 파일 이름: 'lihui-persona-'가 포함된 모든 png
- webp 압축 변환 후 \assets\img\persona 에 복사

원더 무기
- 경로: \assets\img\wonder-weapon\png
- 파일 이름: 'wonder-5-'가 포함된 모든 png
- webp 압축 변환 후 \assets\img\wonder-weapon 에 복사

총공격 이미지
- 경로: \apps\gallery\images\allout
- 파일 이름: 'MyPalace-Pics-generalAttack-' 가 포함된 모든 png

아이템 이미지
- 경로: \assets\img\synergy\item
- 파일 이름: 'item-317' 이 포함된 모든 png