// 액션 이름 매핑 상수
const ACTION_TO_CODE = {
  '스킬1': 'a',
  '스킬2': 'b',
  '스킬3': 'c',
  'HIGHLIGHT': 'h',
  '테우르기아': 't',
  'ONE MORE': 'o',
  '총격': 'g',
  '근접': 'm',
  '방어': 'd',
  '특수 스킬': 's',
  '아이템': 'i'
};

const CODE_TO_ACTION = {
  'a': '스킬1',
  'b': '스킬2',
  'c': '스킬3',
  'h': 'HIGHLIGHT',
  't': '테우르기아',
  'o': 'ONE MORE',
  'g': '총격',
  'm': '근접',
  'd': '방어',
  's': '특수 스킬',
  'i': '아이템'
};

// 캐릭터 이름 매핑 (알파벳 2글자)
const CHAR_TO_CODE = {
  "렌": "a", "루우나": "b", "루페르": "c", "레오": "d", "류지": "e",
  "리코·매화": "f", "마사키": "g", "마코토": "h", "미나미": "i", "모르가나": "j",
  "모토하": "k", "모토하·여름": "l", "몽타뉴": "m", "몽타뉴·백조": "n", "슌": "o",
  "세이지": "p", "안": "q", "아야카": "r", "야오링": "s", "야오링·사자무": "t",
  "원더": "u", "유스케": "v", "YUI": "w", "유키미": "x", "카스미": "y",
  "키라": "z", "키요시": "A", "토모코": "B", "토모코·여름": "C", "토시야": "D",
  "하루": "E", "하루나": "F", "치즈코": "G", "유카리": "N", "유키 마코토": "O", "쇼키": "P",
  "마유미" : "Q", "아케치": "R", "미오" : "S", "사나다": "T", "이치고": "U",
  // 서포트 파티
  "리코": "H", "미유": "I", "유우미": "J", "카요": "K", "후타바": "L","마나카": "M"
};

const CODE_TO_CHAR = Object.fromEntries(
  Object.entries(CHAR_TO_CODE).map(([k, v]) => [v, k])
);

// 페르소나 매핑 (알파벳 2글자)
const PERSONA_TO_CODE = {
  "광목천": "gm", "네코쇼군": "ns", "노른": "nr", "년수": "ny", "도미니온": "dm",
  "디오니소스": "di", "라미아": "rm", "릴리스": "ll", "미트라스": "mt", "바포멧": "bp",
  "비사문천": "bs", "비슈누": "vs", "사라스바티": "sr", "서큐버스": "sc", "수르트": "st",
  "스라오샤": "sl", "시바": "sv", "아누비스": "ab", "앨리스": "al", "야노식": "yn",
  "야마타노오로치": "ym", "아메노우즈메": "yu", "요시츠네": "yt", "오우쿠시누시": "ok",
  "유룽": "yl", "이시스": "is", "지국천": "jg", "지크프리트": "zf", "체르노보그": "cb",
  "킹프로스트": "kf", "티타니아": "tt", "파르바티": "pv", "파즈스": "pz", "자오우곤겐": "jog",
  "황룡": "hl", "토르": "tr", "트론" : "tn"
};

const CODE_TO_PERSONA = Object.fromEntries(
  Object.entries(PERSONA_TO_CODE).map(([k, v]) => [v, k])
);

// 원더 무기 매핑 (알파벳 1글자)
const WEAPON_TO_CODE = {
  "천상의 별": "a",
  "태고의 역장": "b",
  "메커니컬 심판자": "c",
  "작열의 연옥": "d",
  "야수의 이빨": "e",
  "크리스탈 트레저": "f",
  "망자의 눈": "g",
  "메아리의 절규": "h",
  "7일의 불꽃": "i",
  "마그네틱 스톰": "j",
  "플라스마 섬멸자": "k",
  "하이브 가드": "l"
};

const CODE_TO_WEAPON = Object.fromEntries(
  Object.entries(WEAPON_TO_CODE).map(([k, v]) => [v, k])
);

// 메인 계시 매핑 (알파벳 2글자)
const MAIN_REV_TO_CODE = {
  "창조": "a",
  "깨달음": "b",
  "여정": "c",
  "성장": "d",
  "지혜": "e",
  "전념": "f",
  "신념": "g",
  "신뢰": "h",
  "조화": "i",
  "결심": "j",
  "수락": "k",
  "자유": "l",
  "진정성": "m",
  "희망": "n",
  "돌파": "o"
};

// 서브 계시 매핑 (알파벳 2글자)
const SUB_REV_TO_CODE = {
  "우려": "a",
  "화해": "b",
  "진리": "c",
  "주권": "d",
  "방해": "e",
  "풍요": "f",
  "화려": "g",
  "변환": "h",
  "힘": "i",
  "억압": "j",
  "환희": "k",
  "미덕": "l",
  "용맹": "m",
  "사랑": "n",
  "평화": "o",
  "승리": "p",
  "직책": "q",
  "분쟁": "r",
  "개선": "s",
  "좌절": "t",
  "고집": "u",
  "신중": "v",
  "헛수고": "w",
  "실망": "x",
  "변화": "y",
  "슬픔": "z"
};

const CODE_TO_MAIN_REV = Object.fromEntries(
  Object.entries(MAIN_REV_TO_CODE).map(([k, v]) => [v, k])
);

const CODE_TO_SUB_REV = Object.fromEntries(
  Object.entries(SUB_REV_TO_CODE).map(([k, v]) => [v, k])
);

// 자주 사용되는 텍스트 매핑 (알파벳 2글자)
const TEXT_TO_CODE = {
  // 스킬명
  "명중": "ac",
  "강화": "bf",
  "조준": "am",
  "빙결": "fr",
  "화상": "bn",
  "감전": "el",
  "풍습": "wt",
  "즉사": "in",
  "리트": "rt",
  "방어": "df",
  "타케미나이엘": "te",
  "1스": "s1",
  "2스": "s2",
  "3스": "s3",
  "HL": "hl",
  "하이라이트": "hl"
};

const CODE_TO_TEXT = Object.fromEntries(
  Object.entries(TEXT_TO_CODE).map(([k, v]) => [v, k])
);

// 스킬 이름 매핑
const SKILL_TO_CODE = {
  // 화염 속성 스킬
  "아기": "aa", "아기라오": "ab", "아기다인": "ac",
  "마하라기": "ad", "마하라기온": "ae", "마하라기다인": "af",
  
  // 빙결 속성 스킬
  "부흐": "ba", "부흐라": "bb", "부흐다인": "bc",
  "다이아의 별": "bd", "마하부흐": "be", "마하부흐라": "bf",
  "마하부흐다인": "bg",
  
  // 전격 속성 스킬
  "지오": "ca", "지온가": "cb", "지오다인": "cc",
  "마하지온가": "cd", "마하지오다인": "ce", "엘 지하드": "cf",
  
  // 질풍 속성 스킬
  "갈": "da", "갈라": "db", "갈다인": "dc",
  "마하갈라": "dd", "마하갈다인": "de",
  
  // 염동 속성 스킬
  "사이오": "ea", "사이다인": "eb", "사이코키네시스": "ec",
  "마하사이": "ed", "마하사이오": "ee", "마하사이다인": "ef",
  "사이코 포스": "eg",
  
  // 핵열 속성 스킬
  "코우가": "fa", "코우가온": "fb", "신의 심판": "fc",
  "마하코우하": "fd", "마하코우가": "fe", "마하코우가온": "ff",
  
  // 주원 속성 스킬
  "하마온": "ga", "마한마": "gb", "마한마온": "gc",
  "에이가온": "gd", "악마의 심판": "ge", "마하에이가": "gf",
  "마하에이가온": "gg",
  
  // 물리 속성 스킬
  "연옥의 날개": "ha", "무드": "hb", "무드온": "hc",
  "마하무드": "hd", "메기도": "he", "마하메기도": "hf",
  "메기도라온": "hg", "흡혈": "hh", "흡마": "hi",
  "돌격": "hj", "참격": "hk", "빅 슬라이스": "hl",
  "궁서아": "hm", "이연아": "hn", "어설트 다이브": "ho",
  "럭키 펀치": "hp", "장대비 베기": "hq", "메가톤 레이드": "hr",
  "검의 춤": "hs", "브레이브 재퍼": "ht", "사망유희": "hu",
  "젠틀 펀치": "hv", "전광석화": "hw", "난동 부리기": "hx",
  "히트 웨이브": "hy", "데스바운드": "hz", "폴 다운": "ia",
  "몽향침": "ib", "망살 러시": "ic", "피의 축제": "id",
  "마인드 슬라이스": "ie", "도르민 러시": "if", "박치기": "ig",
  "브레인 버스터": "ih", "지탄": "ii", "원 샷 킬": "ij",
  "트리플 다운": "ik",
  
  // 회복 스킬
  "디아": "ja", "디아라마": "jb", "메디아": "jc",
  "메디라마": "jd", "메디아라한": "je", "우로스": "jf",
  "파트라": "jg", "바이스디": "jh", "에너지 드롭": "ji",
  
  // 지원 스킬
  "데카쟈": "ka", "데쿤다": "kb",
  "타루카쟈": "kc", "마하타루카쟈": "kd",
  "라쿠카쟈": "ke", "마하라쿠카쟈": "kf",
  "스쿠카쟈": "kg", "마하스쿠카쟈": "kh",
  "리벨리온": "ki", "컨센트레이트": "kj", "차지": "kk",
  "라쿤다": "kl", "마하라쿤다": "km", "타룬다": "kn",
  
  // 고유 스킬
  "격정과 진정": "ua", "고통의 심판": "ub", "광풍 눈": "uc",
  "궁지 반격": "ud", "극열": "ue", "눈의 여왕의 비호": "uf",
  "매복사냥": "ug", "방풍막": "uh", "살육 유도": "ui",
  "왕생의 심판": "uj", "용을 베는 자태": "uk", "응집": "ul",
  "적을 멸하는 바람": "um", "전격 내성 제거": "un", "전류의 흐름": "uo",
  "절대복종": "up", "정신 파동": "uq", "조화의 균열": "ur",
  "존왕의 항복": "us", "죽어 줄래?": "ut", "파멸의 춤": "uu",
  "팔척뛰기": "uv", "화제": "uw", "분노한 진신": "ux"
};

const CODE_TO_SKILL = Object.fromEntries(
    Object.entries(SKILL_TO_CODE).map(([k, v]) => [v, k])
);

// 공유 데이터 처리 함수
function processSharedData(sharedData) {
  try {
    const decompressedData = LZString.decompressFromEncodedURIComponent(sharedData);
    const compressed = JSON.parse(
      decompressedData
      .replace(/¶/g, 'm":1,"')          // manual 타입 복원
      .replace(/§6/g, '{"n":6,"a":[{"')  // 순서 중요: 큰 숫자부터 복원
      .replace(/§5/g, '{"n":5,"a":[{"')
      .replace(/§4/g, '{"n":4,"a":[{"')
      .replace(/§3/g, '{"n":3,"a":[{"')
      .replace(/§2/g, '{"n":2,"a":[{"')
      .replace(/§1/g, '{"n":1,"a":[{"')
      .replace(/\$/g, '":"')
      .replace(/@/g, '","')
      .replace(/¤/g, '"},{"')
    );
    
    //console.log('After initial decompression:', compressed);

    const decompressed = {
      title: compressed.h || "P5X Tactic Maker",
      w: compressed.w?.map(p => CODE_TO_PERSONA[p] || p) || [],
      weapon: compressed.wp ? CODE_TO_WEAPON[compressed.wp] || compressed.wp : "",
      personaSkills: compressed.ps?.map(skill => 
        CODE_TO_SKILL[skill] || CODE_TO_TEXT[skill] || skill
      ) || [],
      // 파티 데이터 추가
      p: compressed.p.map(member => ({
        name: CODE_TO_CHAR[member.n] || member.n,
        order: member.o || "",
        ritual: member.r || "0",
        mainRev: member.mr ? CODE_TO_MAIN_REV[member.mr] || member.mr : "",
        subRev: member.sr ? CODE_TO_SUB_REV[member.sr] || member.sr : ""
      })),
      t: compressed.t.map(turn => {
        const processed = {
          turn: turn.n,
          actions: turn.a.map(action => {
            const result = {
            //  type: action.m ? 'manual' : 'auto',
              type: 'manual',
              character: CODE_TO_CHAR[action.c] || action.c,
              wonderPersona: action.w ? CODE_TO_PERSONA[action.w] || action.w : "",
              action: action.a ? CODE_TO_ACTION[action.a] || action.a : "" || "empty", 
              memo: action.mm ? action.mm.split(' ').map(word => CODE_TO_TEXT[word] || word).join(' ') : ""
            };
            return result;
          })
        };
        return processed;
      })
    };

    //console.log('Final decompressed result:', JSON.stringify(decompressed, null, 2));
    
    
    // cleanData를 JSON 문자열로 변환했다가 다시 파싱해서 반환
    return JSON.parse(JSON.stringify(decompressed));
  } catch (error) {
    console.error('Invalid shared data:', error);
    return null;
  }
}

// URL 공유 함수
function shareURL() {
  const partyMap = {};
  partyMembers.forEach((member, idx) => {
    if (member.name) {
      partyMap[member.name] = `p${idx}`;
    }
  });

  const data = {
    h: document.querySelector('.title-input').value.slice(0, 20),
    w: wonderPersonas.filter(p => p).map(p => PERSONA_TO_CODE[p] || p),
    wp: WEAPON_TO_CODE[document.querySelector(".wonder-weapon-input").value] || undefined,
    p: partyMembers.map((pm, idx) => {
      const obj = { n: CHAR_TO_CODE[pm.name] || pm.name };
      if (pm.order !== "") obj.o = pm.order;
      if (pm.ritual !== "") obj.r = pm.ritual;
      
      const mainRev = document.querySelector(`.party-member[data-index="${idx}"]`)?.querySelector(".main-revelation")?.value;
      const subRev = document.querySelector(`.party-member[data-index="${idx}"]`)?.querySelector(".sub-revelation")?.value;
      
      // 디버깅 로그 추가 - 모든 계시 값 확인
      //console.log(`[DEBUG] Party Member ${idx} - mainRev: "${mainRev}", subRev: "${subRev}"`);
      
      if (mainRev) obj.mr = MAIN_REV_TO_CODE[mainRev];
      if (subRev) obj.sr = SUB_REV_TO_CODE[subRev];
      
      return obj;
    }),
    t: turns.map(turn => ({
      n: turn.turn,
      a: turn.actions.map(action => {
           const obj = { c: CHAR_TO_CODE[action.character] || action.character };
           //if (action.type === 'manual') obj.m = 1;
           if (action.wonderPersona) obj.w = PERSONA_TO_CODE[action.wonderPersona];
           if (action.action) obj.a = ACTION_TO_CODE[action.action];
           if (action.memo) {
             const words = action.memo.split(' ');
             const convertedWords = words.map(word => TEXT_TO_CODE[word] || word);
             obj.mm = convertedWords.join(' ');
           }
           return obj;
         })
    })),
    ps: Array.from(document.querySelectorAll(".persona-skill-input"))
      .filter((_, index) => index % 3 !== 0)
      .map(input => input.value ? (SKILL_TO_CODE[input.value] || TEXT_TO_CODE[input.value] || input.value) : "")
  };

  if (data.h === "페르소나5X 택틱 메이커") {
    delete data.h;
  }

  //console.log(data);

  const jsonString = JSON.stringify(data)
    .replace(/":"/g, '$')
    .replace(/","/g, '@')
    .replace(/"},{"/g, '¤')
    .replace(/{"n":1,"a":\[{"/g, '§1')  // 턴 1 시작 패턴
    .replace(/{"n":2,"a":\[{"/g, '§2')  // 턴 2 시작 패턴
    .replace(/{"n":3,"a":\[{"/g, '§3')  // 턴 3 시작 패턴
    .replace(/{"n":4,"a":\[{"/g, '§4')  // 턴 4 시작 패턴
    .replace(/{"n":5,"a":\[{"/g, '§5')  // 턴 5 시작 패턴
    .replace(/{"n":6,"a":\[{"/g, '§6')  // 턴 6 시작 패턴
    .replace(/m":1,"/g, '¶');           // manual 타입 패턴

  const compressedData = LZString.compressToEncodedURIComponent(jsonString);
  const shareURL = new URL(getBaseUrl());
  shareURL.searchParams.set('data', compressedData);
  
  return shareURL.toString();
}

function getShareI18nText(key, fallback = '') {
  if (typeof window.t === 'function') {
    return window.t(key, fallback);
  }
  if (window.I18nService && typeof window.I18nService.t === 'function') {
    return window.I18nService.t(key, fallback);
  }
  return fallback || key;
}

// shareURL 함수 수정
function handleShare() {
    // exportData와 동일한 데이터 구조 사용
    const url = shareURL();
    navigator.clipboard.writeText(url)
        .then(() => {
        alert(getShareI18nText('alertShareUrlCopied', '공유 URL이 클립보드에 복사되었습니다.'));
        })
        .catch(err => {
        alert(getShareI18nText('alertShareUrlCopyFailed', 'URL 복사에 실패했습니다. 수동으로 복사해주세요.'));
        console.error('Failed to copy: ', err);
        });

    // URL 파라미터 제거 시에도 동일하게 적용
    window.history.replaceState({}, document.title, getBaseUrl());
}
