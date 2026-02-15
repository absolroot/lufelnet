window.I18N_PAGE_PULL_TRACKER_KR = {
  seo: {
    individual: {
      title: '계약 통계 - 페르소나5 더 팬텀 X',
      description: 'P5X 가챠 계약 정보를 기록하고 통계를 확인하세요.',
      ogLocale: 'ko_KR'
    },
    global: {
      title: '전체 통계 - 페르소나5 더 팬텀 X',
      description: 'P5X 계약 전체 통계와 일별 추이를 확인하세요.',
      ogLocale: 'ko_KR'
    },
    guide: {
      title: 'Pull Tracker URL 가이드',
      description: '가챠 기록 URL을 얻는 방법 안내',
      ogLocale: 'ko_KR'
    }
  },
  individual: {
    nav: {
      home: '홈',
      current: '계약 트래커'
    },
    pageTitle: '계약 트래커 (beta)',
    cardsTitle: '요약 카드 (최근 90일)',
    inputLabel: 'URL 획득 방법',
    placeholder: '여기에 주소를 붙여넣기...',
    labels: {
      debugExample: 'DEBUG 예시:'
    },
    buttons: {
      start: '가져오기',
      clear: '초기화',
      hideUnder4: '4★ 이하 숨기기',
      exampleApply: '예시 적용'
    },
    info: {
      ready: '가챠 기록 URL을 입력하고 가져오기를 누르세요.',
      notice: '최근 90일 동안의 기록만 가져옵니다. 이전 기록은 게임 서버에서 제공되지 않습니다.\n가챠 시도 횟수가 많은 경우 로딩에 5분 이상 걸릴 수 있습니다. 각 URL은 유효 기간이 있어 만료될 경우 새로 가져와야 합니다.\n※ 현재 기록을 추가 업데이트하는 과정이 불안정합니다. URL을 추가 제출하기 전에 내보내기를 통해 기존 데이터를 보존해주세요.',
      helpText: '·  로컬 데이터는 개인 브라우저에 저장되며 인터넷 기록을 모두 삭제할 경우 데이터는 삭제됩니다.\n·  구글 드라이브 로그인을 통해 여러분의 Google Drive에서 내용을 저장하고 동기화할 수 있습니다.\n·  URL을 통해 제출된 정보는 계정 정보를 비롯한 어떤 유저 식별자도 포함하지 않으며, 데이터는 통계(iant.kr/gacha)에 사용될 수 있습니다.\n·  Special Thanks To : Iant / TheROoNCo'
    },
    auth: {
      signedIn: '로그인:',
      login: '로그인',
      logout: '로그아웃',
      scopeNote: '※ 이 사이트에서 생성한 파일만 읽고 쓸 수 있습니다.',
      driveLabel: 'Google Drive'
    },
    loading: {
      title: '서버에서 기록을 조회 중입니다...',
      detail: '네트워크 상태와 서버 부하에 따라 시간이 걸릴 수 있습니다.',
      noticeLong: '최근 90일 뽑기 횟수에 따라 10분 이상 소요될 수 있습니다. 처리 중에는 브라우저 창을 닫지 말아주세요.',
      elapsed: '경과 시간: {m}분 {s}초'
    },
    status: {
      sending: '요청 전송 중...',
      waiting: '서버 응답 대기 중...',
      tryGet: '진행 중...',
      invalidUrl: '유효한 URL을 입력하세요.',
      done: '완료 (응답 바이트: {bytes})',
      failed: '요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      complete: '✅ Complete',
      savedLocal: '로컬 브라우저에 저장되었습니다.',
      loadedLocal: '로컬 브라우저에서 불러왔습니다.',
      loadedDrive: '클라우드(Drive)에서 불러왔습니다.',
      savedDrive: '클라우드(Drive)에 저장되었습니다.',
      deletedDrive: '클라우드(Drive)에서 삭제했습니다.',
      deleteDriveFailed: '클라우드(Drive) 삭제에 실패했습니다.',
      allDeleted: '브라우저에 저장된 데이터를 삭제했습니다.',
      driveForbidden: 'Google Drive 접근이 거부되었습니다. (403) 권한 또는 설정을 확인하세요.',
      driveNeedConsent: '드라이브 접근 권한이 필요합니다. 상단 로그인 버튼을 눌러 권한을 승인해 주세요.',
      driveNoData: '드라이브에 저장된 데이터가 없습니다.',
      noData: '저장된 데이터가 없습니다.',
      driveQuotaExceeded: 'Google 드라이브 저장 용량이 초과되었습니다. 공간을 확보해주세요.',
      exampleApplyFailed: '예시 적용 실패',
      recordAdded: '기록이 추가되었습니다.',
      recordUpdated: '기록이 수정되었습니다.',
      recordDeleted: '기록이 삭제되었습니다.',
      adjustmentSaved: '보정값이 저장되었습니다.'
    },
    confirm: {
      reset: '정말 초기화할까요?\n이 작업은 이 브라우저에 저장된 가챠 데이터(마지막 URL/응답 포함)를 모두 삭제합니다.\n※ Google Drive 백업은 영향을 받지 않습니다.'
    },
    overview: {
      pullsUnit: '회',
      limited5: '5성 한정',
      section: {
        character: '캐릭터',
        weapon: '무기',
        standard: '일반'
      }
    },
    manual: {
      tag: '수동'
    },
    lower: {
      andBelow: '이하'
    },
    merge: {
      fileTitle: '파일 가져오기',
      driveTitle: 'Drive 불러오기',
      message: '새 데이터 적용 방식 선택:\n\n병합: 기존 기록에 새 데이터를 합치기\n덮어쓰기: 현재 기록을 새 데이터로 교체하기',
      cancel: '취소',
      merge: '병합',
      overwrite: '덮어쓰기'
    },
    bannerNames: {
      gold: '일반',
      fortune: '운명',
      weapon: '무기',
      weapon_confirmed: '무기 확정',
      confirmed: '확정',
      newcomer: '신규'
    },
    table: {
      total: '총 뽑기',
      totalInProgress: '총 뽑기 / 진행 중',
      count: '합계',
      rate: '확률',
      avg: '평균 횟수',
      win: '성공',
      rule: '보장 규칙',
      fiveStarHistory: '5★ 상세 기록',
      timesSuffix: '회',
      tooltip_confirmed: '확정: 5★ 110회 보장, 4★ 10회 보장.\n5★ 확률은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.',
      tooltip_fortune: '운명: 5★ 80회 보장, 4★ 10회 보장 (50% 규칙).\n5★ 확률은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.\n\n50% 성공 여부는 현재 게임 서버에서 제공되지 않아 한정 캐릭터 여부를 통해 성공 여부를 판정합니다. 따라서 특정 상황에 따라 정확도가 떨어집니다.\n\n50%에 실패할 경우 다음은 무조건 성공하므로, 횟수가 많아지면 기댓값은 66.6%입니다.',
      tooltip_gold: '일반: 5★ 80회 보장, 4★ 10회 보장.\n5★ 확률은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.',
      tooltip_weapon: '무기: 5★ 70회 보장, 4★ 10회 보장 (50% 규칙).\n5★ 확률은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.\n\n50% 성공 여부는 현재 게임 서버에서 제공되지 않아 한정 캐릭터 여부를 통해 성공 여부를 판정합니다. 따라서 특정 상황에 따라 정확도가 떨어집니다.\n\n50%에 실패할 경우 다음은 무조건 성공하므로, 횟수가 많아지면 기댓값은 66.6%입니다.',
      tooltip_weapon_confirmed: '무기 확정: 5★ 95회 보장, 4★ 10회 보장.\n5★ 확률은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.',
      tooltip_newcomer: '신규: 5★ 50회 보장, 4★ 10회 보장.\n5★ 확률은 (총 뽑기 - 진행 중) 기준으로 계산됩니다.',
      fiveTotal: '5★ 총 횟수',
      fivePityRate: '5★ 확률',
      fiveAvg: '5★ 평균 횟수',
      win5050Count: '한정 (횟수)',
      win5050Rate: '한정 (확률)',
      fourTotal: '4★ 총 횟수',
      fourPityRate: '4★ 확률',
      fourAvg: '4★ 평균 횟수'
    }
  },
  global: {
    nav: {
      home: '홈',
      current: '전체 통계'
    },
    pageTitle: '전체 통계',
    note: 'lufel.net/iant.kr 유저들의 제출 데이터를 기반하여 계산됩니다.\n※ P5X서버 기록은 50% 반천장(Win) 정보를 제공하지 않아, 현재는 한정 캐릭터를 성공으로 계산하고 있습니다. 따라서 마유미, 루우나 등은 성공 기준에 포함되지 않아 수치가 높게/낮게 보일 수 있습니다.',
    labels: {
      avg: '평균',
      count: '5★ 합계',
      loseRate: '50:50 패배율',
      pullsByDay: '5★ 일별 횟수',
      charAvg: '캐릭터 5★ 평균',
      charLimitedAvg: '캐릭터 한정 5★ 평균',
      charCnt: '캐릭터 5★ 획득 수',
      weapAvg: '무기 5★ 평균',
      weapLimitedAvg: '무기 한정 5★ 평균',
      weapCnt: '무기 5★ 획득 수'
    },
    words: {
      unitTimes: '회',
      unitCount: '번',
      obtained: '획득',
      pickupSuccess: '한정 비율'
    },
    names: {
      Confirmed: '확정',
      Fortune: '운명',
      Gold: '일반',
      Weapon: '무기',
      Weapon_Confirmed: '무기 확정',
      Newcomer: '신규'
    },
    list: {
      header: {
        name: '이름',
        total: '합계',
        percent: '%'
      },
      more: '더보기',
      titles: {
        limited: '5★ 한정 리스트',
        standard: '5★ 통상 리스트',
        weapon: '5★ 무기 리스트'
      }
    },
    tabs: {
      all: '전체',
      w3: '3주',
      w6: '6주',
      w9: '9주'
    },
    pity: {
      legendChance: 'Chance %',
      legendTotal5: 'Total Pull 5★'
    },
    hover: {
      daily: '{date}\nTotal 5★: {count}',
      pity: 'Pity {pity}\nChance%: {chance}\nTotal Pull 5★: {count}'
    },
    status: {
      loadFailed: 'Load failed'
    },
    units: {
      avgSuffix: ' 회'
    }
  },
  guide: {
    nav: {
      home: '홈',
      back: '계약 트래커',
      current: 'URL 가이드'
    },
    pageTitle: 'URL 가이드',
    introWindows: '현재는 PC Windows에서의 방법만 제공하고 있습니다.',
    s1: 'FAQ를 확인하세요.',
    s2: '사용 중인 운영체제를 선택하세요. (안드로이드 방법을 제보 받습니다)',
    s3: '원하는 방법을 선택하세요. 제작된 프로그램 사용 / 직접 URL 추출',
    m1s1: 'PC에서 P5X을 실행하세요.',
    m1s2: '다음 링크에서 P5X_Gacha_Tools를 다운받아 압축을 풀고 실행하세요.',
    m1s3: 'P5X에서 계약 기록을 확인하세요. ※ 오류가 나는 것은 정상입니다.',
    m1s4: '지역을 선택한 후 [Try Find URL] 버튼을 클릭하고 Copy를 눌러 URL을 획득하세요.',
    m1s5: '프로그램을 닫아주세요.',
    m1s6: '복사된 URL을 아래 링크에서 입력해주세요.',
    m2s1: '다음 링크에서 방법을 확인하세요.',
    m2s2: '복사된 URL을 아래 링크에서 입력해주세요.',
    programTitle: '프로그램에 대하여',
    troubleshootButton: '문제 해결 방법',
    downloadLabel: '프로그램 제공 링크',
    sourceCode: 'source code',
    goBack: 'Go Back',
    os: {
      win: 'Windows',
      ios: 'iOS'
    },
    ios1: 'App Store에서 Stream 앱을 설치하세요.',
    ios2: 'Stream에서 Sniff Now를 눌러 VPN/CA 설치 및 신뢰를 완료하세요.',
    ios3: 'P5X에서 가챠 기록 화면을 엽니다.',
    ios4: 'Stream → Sniff History에서 아래 서버에 맞는 URL이 포함된 요청을 찾아 길게 눌러 링크 전체를 복사하세요.\n(KR) nsywl-krcard.wmupd.com\n(CN) nsywl-gfcard.wmupd.com\n(TW) wwwidcweb.p5x.com.tw\n(JP) web.p5xjpupd.com\n(EN) euweb.p5xjpupd.com\n(SEA) web.p5x-sea.com',
    ios5: '복사된 URL을 아래 링크에서 입력해주세요.',
    videoLabel: '영상 도움말',
    videoNote: '(영상 예시와 절차는 동일하며, URL 도메인만 다릅니다.)',
    streamOpen: 'Stream 앱 설치 페이지',
    modal: {
      faqTitle: 'FAQ',
      programTitle: '프로그램에 대하여',
      troubleshootTitle: '문제 해결 방법',
      close: '닫기'
    },
    faq: {
      text1: `Q. 어떤 원리로 동작하나요?
A. P5X의 기록은 기본적으로 웹 URL을 통해 가져옵니다. 게임에서 기록을 보게 될 경우 접근 가능한 임시 키가 주어지고, 이 사이트에서는 그 키를 이용해 P5X 서버와 통신하여 여러분의 가챠 기록을 가져옵니다.

Q. 안전한 건가요? 밴 당하진 않나요?
A. P5X에서 기록을 보여주는 것과 동일한 방법을 사용합니다. 또한 게임 파일이나 메모리를 변조하는 어떠한 방법도 사용하지 않으므로 안전하다고 할 수 있습니다. 그러나 이 기능을 사용함에 있어서의 책임은 여러분에게 있습니다.

Q. 제 정보를 해킹할 수도 있지 않나요?
A. lufel.net은 게임 내 UID나 관련 key등을 절대 저장하지 않습니다. 이 프로젝트는 오픈 소스이며, URL을 획득하는 툴에 대해서는 iant.kr/gacha의 설명을 참조해주시길 바랍니다. 해당 툴을 사용하는 방식이 불안할 경우, 방법 2를 통해 직접 URL을 추출하는 방법도 있습니다.

Q. Network 흐름을 보았는데 왜 바로 P5X 서버에 요청하지 않고 다른 서버를 통해 요청하나요?
A. CORS 문제 때문에 직접 P5X 서버 API에 요청할 수 없습니다. 그래서 요청 정보는 iant.kr 서버에 옮겨진 후 수행됩니다.

Q. 그럼 제 어떤 정보를 보관하나요?
A. 가챠 기록을 제외한 어떤 정보도 별도로 보관하지 않습니다. 해당 기록에는 어떤 플레이어가 뽑은 가챠 기록인지도 남지 않아, 단순한 통계 목적으로만 사용됩니다.

Q. 모든 기록이 보이지 않아요
A. P5X는 최근 90일 내의 기록 정보만 제공되고 있습니다. 백업된 정보가 있는게 아니라면 아쉽게도 확인할 수 없습니다. (저도 제걸 보고 싶어요)`,
      text2: `Q. 이 프로그램은 어떠한 형태로 작동하나요?
A. 가챠 정보를 획득하는 페이지로의 연결을 일시적으로 현재 사용자의 컴퓨터(127.0.0.1)로 재연결하도록 hosts를 일시적으로 수정합니다. 가챠 정보 획득 페이지에 도달하지 못할 경우 사용자 log에 일시적으로 임시 키가 나타나고, 이를 자동으로 프로그램이 추출하여 복사할 수 있도록 돕습니다. 프로그램을 종료할 경우 hosts를 원상복구 시킵니다. 관련한 문의는 해당 '링크(iant.kr/gacha)'의 설명을 참조해주세요.`
    },
    troubleshoot: {
      title: '문제 해결 방법',
      button: '문제 해결 방법',
      body: `1. 프로그램이 실행하면 오류가 발생해요
관리자 권한으로 실행해주세요.

2. 프로그램을 실행해도 아무런 창이 나오질 않아요.
.NET 8.0이 PC에 설치돼있어야 합니다. 설치돼있지 않을 경우 다음 링크에서 다운로드하여 설치해주세요.
https://dotnet.microsoft.com/ko-kr/download

3. URL 획득 후 게임 내에서 가챠 기록을 조회할 때마다 기록을 조회할 수 없다고 알림이 나옵니다.
프로그램을 다시 실행했다 종료해주세요. 그럼에도 불구하고 동일한 오류가 발생할 경우 
C:\\Windows\\System32\\drivers\\etc\\hosts 파일을 직접 열어 아래 내용을 지우고 저장해주세요.

127.0.0.1 nsywl-krcard.wmupd.com
127.0.0.1 nsywl-gfcard.wmupd.com
127.0.0.1 wwwidcweb.p5x.com.tw
127.0.0.1 web.p5xjpupd.com
127.0.0.1 euweb.p5xjpupd.com
127.0.0.1 web.p5x-sea.com`
    }
  },
  manualEditor: {
    addRecord: '기록 추가',
    editRecord: '기록 수정',
    get5Star: '5★ 추가',
    get4Star: '4★ 추가',
    character: '캐릭터',
    weapon: '무기',
    dateTime: '날짜/시간',
    atPity: 'At pity',
    atPityUnit: '회',
    grade: '등급',
    save: '저장',
    cancel: '취소',
    delete: '삭제',
    close: '닫기',
    search: '검색...',
    maxPity: '최대',
    originalReadonly: '자동으로 가져온 데이터는 삭제만 가능합니다',
    confirmDelete: '이 기록을 삭제하시겠습니까?',
    selectCharacter: '캐릭터 선택',
    selectWeapon: '무기 선택',
    noResults: '검색 결과 없음',
    historyTitle: '획득 기록',
    manualTag: '수동',
    autoTag: '자동'
  },
  adjustModal: {
    title: '횟수 보정',
    originalTotal: '기존 총 뽑기',
    additionalPulls: '추가 횟수',
    displayTotal: '표시될 총 뽑기',
    originalProgress: '기존 진행 중',
    progressAdjust: '진행 중 조정',
    displayProgress: '표시될 진행 중',
    note: '※ 기존 데이터는 유지되며, 표시만 조정됩니다.',
    reset: '초기화'
  },
  io: {
    export: {
      label: '내보내기',
      noData: '내보낼 데이터가 없습니다.',
      failed: '내보내기에 실패했습니다.'
    },
    import: {
      label: '가져오기',
      imported: '파일에서 가져왔습니다.',
      failed: '가져오기에 실패했습니다.'
    },
    drive: {
      saveLabel: 'Drive 저장',
      loadLabel: 'Drive 불러오기',
      saved: '드라이브에 저장했습니다.',
      loadedOk: '드라이브에서 불러왔습니다.',
      loadedNone: '드라이브에 저장된 데이터가 없습니다.',
      noLocal: '저장할 로컬 데이터가 없습니다.',
      needLogin: '먼저 상단 로그인 버튼으로 Google Drive에 로그인해 주세요.',
      failed: '작업에 실패했습니다. 잠시 후 다시 시도해 주세요.'
    }
  }
};
