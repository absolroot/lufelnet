---
name: p5x-translator
description: P5X(페르소나 5더 팬텀 X)의 한국어 게임 데이터를 프로젝트 내 참조 파일들을 기반으로 영어(_en) 및 일본어(_jp)로 번역합니다.
---

# P5X Translator Skill

이 스킬은 P5X 게임 데이터(캐릭터, 스킬, 무기, 의식 등) 내의 한국어 텍스트를 분석하여, 게임 내 공식 용어 설정을 준수하며 _en, _jp 필드나 영어 일본어 번역 파트를 채우는 역할을 합니다.

## Instructions

1. **용어 사전 준수 (가장 중요)**:
- 공통 용어: /i18n/common 내의 kr.js, en.js, jp.js를 대조하여 '대미지', '관통', '의식', '다운 허약' 등 게임 메커니즘 용어를 번역합니다.

- 캐릭터 이름: data/kr/characters.js를 참조합니다.
    - EN: codename 사용을 원칙으로 하며, 이름 사용 시 성을 제외한 이름만 사용합니다. (예: Narumi Nashimoto → Narumi)
    - JP: name_jp를 그대로 사용합니다.
    - characters.js에는 다음과 같은 형태로 캐릭터 이름이 저장돼있습니다. name에 한국어 전체 이름이 있지만 한국어도 캐릭터 키를 우선합니다.
        '캐릭터 키' (한국어 이름) 
        - codename (코드 네임)
        - name_en (영어 이름)
        - name_jp (일본어 이름)
    
- 캐릭터 세부 데이터: 모든 캐릭터의 설명은 data/characters/{캐릭터 키}/ 경로의 skill.js, ritual.js, weapon.js, innate.js를 참조하여 고유 명사를 추출하여 번역합니다. (ex. 나루미 → data/characters/나루미/skill.js)
- 페르소나: 페르소나의 이름이 들어간 경우 /data/persona 또는 /data/persona/nonorder 에서 한국어 이름으로 된 js 파일을 찾아 name_en과 name_jp를 찾아 번역합니다. (ex. 비슈누 →/data/persona/비슈누.js) 
- 페르소나 스킬 명: 페르소나의 스킬 이름이 들어갈 경우 /data/kr/wonder/persona_skill_from.csv 또는 /data/kr/wonder/skills.js를 찾아 번역합니다. 
- 원더 무기: '원더 무기 천상의 별'과 같이 원더의 무기에 대한 정보가 필요한 경우 /data/kr/wonder/weapons.js를 참조합니다.
- 계시: 계시 이름이 들어갈 경우 /data/kr/revelations/revelations.js /data/en/revelations/revelations.js /data/jp/revelations/revelations.js 각각의 매칭 데이터를 참조합니다. 
   - 계시 이름 목록 예시 : [
      "순수", "타락", "탄생", "힘", "예리", "풍족", "돌파", "슬픔", "변화", "획득",
      "희망", "직책", "고집", "창조", "우려", "화해", "강인", "자유", "개선", "좌절",
      "실망", "결심", "미덕", "신중", "진정성", "환희", "지혜", "억압", "깨달음", "진리",
      "주권", "방해", "여정", "풍요", "성장", "화려", "변환", "전념", "용맹", "사랑",
      "신념", "평화", "헛수고", "신뢰", "조화", "승리", "수락", "분쟁"]


2. **데이터 구조 유지**:
   - 기존 JSON/JS/md 객체 구조를 유지하되, 빈 칸인 _en, _jp 속성을 번역된 값으로 채웁니다.
   - 내용에 마크다운 표시 등 별도의 표시가 존재한 경우 해당 표식을 유지한 채 번역합니다.
   - 예외 사항: 캐릭터 스킬 파일(skill.js) 번역 시 element, type 필드의 값은 번역하지 않고 한국어를 그대로 유지합니다.
   
3. **참조 사항**:
   - 의식: 파일 명칭이나 데이터 키가 ritual이더라도, 영어 번역 시 용어는 Awareness를 사용합니다.
   - 의식&개조: 의식과 개조 뒤에 '의식6', '개조6'과 같이 숫자가 붙은 형태는 i18n/common/en.js, i18n/common/jp.js의 awarenessLevel.a(n), refinement.r(n)을 참조합니다.
   - 스킬: 설명 내에 '스킬1' '스킬 1' 과 같은 형태는 영어로 번역 시 'S1'으로 표현해도 무방합니다.

4. **예시**:
   - 아래 경로의 예시 파일들을 참조하여 번역 스타일을 학습하세요. 이외에도 동일한 구조를 가진 파일이 있을 경우 학습합니다.
   - 아티클: examples/2025-08-07-HIGHLIGHT.md
   - 스킬: examples/skill.js ~ skill4.js (element, type 유지 확인)
   - 의식: examples/ritual.js ~ ritual4.js 
   - 무기/리뷰: examples/weapon.js, examples/review.js 등


## Guidelines
- 일관성: 반드시 프로젝트 내 정의된 JS/CSV 파일의 용어와 100% 일치해야 합니다. 임의의 직역은 최대한 지양합니다.
- 정확성: 캐릭터 설명 내에 타 캐릭터가 언급될 경우, 해당 캐릭터의 공식 영문/일문 명칭을 찾아 적용합니다.
- 통일성: 의역을 진행할 경우 다른 파일에서 사용된 번역과 동일한 뉘앙스를 사용해야 합니다.