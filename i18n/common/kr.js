/**
 * 한국어 공통 번역
 * 
 * 모든 페이지에서 공통으로 사용하는 UI 요소, 네비게이션, 버튼, 메시지 등의 번역을 포함합니다.
 * 영어 키 → 한국어 값 구조로 통일 (다른 언어 파일과 동일한 키 사용)
 */

window.I18N_COMMON_KR = {
    // 사이트 메타데이터
    site: {
        title: '페르소나5 더 팬텀 X - 루페르넷',
        description: '페르소나5 더 팬텀 X의 모든 정보를 한 곳에서 확인하세요. 캐릭터, 페르소나, 스킬, 공략 가이드를 제공합니다.',
        keywords: '페르소나5 더 팬텀 X, P5X, 루페르넷, 괴도, 페르소나, 계시, 택틱, 게임공략',
        author: '루페르넷'
    },

    // 푸터
    footer: {
        disclaimer: '※ 루페르넷은 개인이 만든 비공식 페르소나5X 정보 제공 사이트로 게임의 콘텐츠와 소재의 트레이드마크와 저작권은 SEGA·ATLUS·Perfect World Games에 있습니다.',
        contactName: '루트',
        reportLink: '제보 및 요청'
    },

    // 홈페이지
    home: {
        languageNotice: '',
        siteTitle: 'P5X 루페르넷',
        menuCharacter: '괴도',
        menuPersona: '페르소나',
        menuRevelations: '계시',
        menuTactic: '택틱',
        menuArticle: '가이드',
        menuTier: '티어',
        menuCharacterDescDesktop: '보다 높은 점수, 보다 쉬운 클리어를 위한<br>괴도별 육성 전략을 만나보세요',
        menuCharacterDescMobile: '괴도별 육성 전략을 만나보세요',
        menuPersonaDescDesktop: '핵심 페르소나 추천과 더불어<br>각 페르소나에 어울리는 스킬 세팅까지',
        menuPersonaDescMobile: '핵심 페르소나 추천과 스킬 세팅까지',
        menuRevelationsDescDesktop: '계시 정보들을 한 눈에!<br>속성별, 일월성진별 원하는 대로 매칭',
        menuRevelationsDescMobile: '계시 정보들을 한 눈에!',
        menuTacticDescDesktop: '본인만의 택틱을 만들고 공유하고,<br>바다와 흉몽에서 높은 점수를 쟁취하세요',
        menuTacticDescMobile: '본인만의 택틱을 만들고 공유하세요',
        menuGoto: '바로가기',
        popularCharacters: '인기 괴도',
        recentUpdates: '최신 업데이트',
        guides: '가이드',
        guideCity: '도시 생활',
        guideGrowth: '육성 및 재화',
        guideBattle: '전투 및 팰리스',
        tacticWorkshop: '택틱 도서관',
        showMore: '더보기'
    },

    // 네비게이션 공통
    nav: {
        home: '홈',
        character: '괴도',
        persona: '페르소나',
        revelations: '계시',
        tactic: '택틱',
        tier: '티어',
        about: '어바웃'
    },

    // 공통 버튼 및 액션
    common: {
        loading: '로딩 중...',
        save: '저장',
        cancel: '취소',
        confirm: '확인',
        close: '닫기',
        delete: '삭제',
        edit: '수정',
        add: '추가',
        remove: '제거',
        reset: '초기화',
        search: '검색',
        filter: '필터',
        sort: '정렬',
        showMore: '더보기',
        showLess: '접기',
        copy: '복사',
        share: '공유',
        download: '다운로드',
        upload: '업로드',
        submit: '제출',
        apply: '적용',
        clear: '지우기'
    },

    // 날짜 및 시간 관련
    time: {
        today: '오늘',
        yesterday: '어제',
        tomorrow: '내일',
        daysLeft: '일 후',
        daysAgo: '일 전',
        hours: '시간',
        minutes: '분',
        seconds: '초'
    },

    // 게임 용어 (영어 키 → 한국어 값) - 동적 번역용
    gameTerms: {
        // 기본 스탯
        hp: '생명',
        maxHp: '최대 생명',
        maxHpUp: '최대 생명 증가',
        attack: '공격력',
        defense: '방어력',
        speed: '속도',

        // 대미지 관련
        dmgBonus: '대미지 보너스',
        critRate: '크리티컬 확률',
        critMult: '크리티컬 효과',
        pierce: '관통',
        defReduction: '방어력 감소',

        // 효과 관련
        ailmentAccuracy: '효과 명중',
        effectResi: '효과 저항',
        healing: '치료',
        healingEffect: '치료효과',
        shieldEffect: '실드 효과',
        dmgReduction: '대미지감면',

        // 기타 스탯
        spRecovery: 'SP 회복',
        resonance: '추가 효과',
        downdamage: '다운 허약',
        naviPower: '해명의힘',
        labor: '직책',
        myPalace: '마이팰리스',
        gunShot: '총격',

        // 무기 및 의식
        awareness: '의식',
        exclusiveWeapon: '전용무기',
        weapon4star: '4성 무기',
        weapon: '무기',
        passive: '패시브',

        // 페르소나 및 스킬
        persona: '페르소나',
        skill: '스킬',
        level: '레벨',
        stack: '스택',

        // 전투 관련
        allOutAttack: '총 공격',
        counterAttack: '반격',
        taunt: '공격받을 확률 증가',
        down: '다운',
        theurgy: '테우르기아',
        theurgyCharge: '테우르기아 충전',
        dmgTaken: '받는 대미지 증가',
        hpCost: 'HP 소모',

        // 버프/디버프
        buff: '버프',
        debuff: '디버프',
        blessing: '축복',
        shield: '실드',

        // 기타 효과
        dot: '지속 대미지',
        dotRecovery: '지속 회복',
        revive: '부활',
        transform: '변신',
        charge: '차지',
        additionalTurn: '추가 턴',
        weaknessChange: '약점 변경',
        formChange: '폼 체인지',
        skillMaster: '스킬마스터',
        damageAccumulation: '대미지 축적',
        item: '아이템',
        tbd: '미정',

        // 심상 코어 (LV100)
        mindscapeCore: '심상 코어',
        mindscapeCoreAlt: '심상코어',

        // 심상
        mindscape: '심상',
        minds5: '심상5',

        // 계시/원더
        revelation: '계시',
        wonder: '원더',
        common: '공통',

        // 범위
        aoe: '광역',
        single: '단일',
        self: '자신',

        // 재화 (Resources)
        ember: '이계 엠버',
        ticket: '계약 티켓',
        paidEmber: '유료 엠버',
        weaponTicket: '무기 티켓',
        cognigem: '인지 단면',
        totalEmber: '총 엠버:',

        // 컨텐츠 (게임 모드 및 시스템)
        task: '의뢰',
        tycoon: '대부호',
        metroOfDesire: '선택의 궤적',
        landOfFortune: '운명의 섬',
        companioShop: '낙원 상점',
        spaceCard: '주 계시',
        kaguraBell: '기원 뽑기',
        nightmareGateway: '흉몽',
        phantomPass: '팬텀 패스',
        rerunContract: '복각 계약',

        // ========================================
        // 띄어쓰기 변형 (aliases) - 동적 번역 매칭용
        // ========================================
        // 원문 데이터에서 띄어쓰기가 다양하게 사용됨
        // ex) '대미지보너스', '대미지 보너스' 둘 다 처리 필요

        // 생명 관련
        hpAlt: '생명력',

        // 대미지 관련 (띄어쓰기 없는 버전)
        dmgBonusAlt: '대미지보너스',
        critRateAlt: '크리티컬확률',
        critMultAlt: '크리티컬효과',

        // 효과 관련
        ailmentAccuracyAlt: '효과명중',
        effectResiAlt: '효과저항',
        healingEffectAlt: '치료 효과',
        shieldEffectAlt: '실드효과',

        // 기타
        spRecoveryAlt: 'SP회복',
        naviPowerAlt: '해명의 힘',
        resonanceAlt: '추격',
        myPalaceRating: '마이팰리스 평점',
        desperado: '황야의 구세주'
    },

    // 의식(Awareness) 단계
    awarenessLevel: {
        a0: '의식0',
        a1: '의식1',
        a2: '의식2',
        a3: '의식3',
        a4: '의식4',
        a5: '의식5',
        a6: '의식6'
    },

    // 무기 개조(Refinement) 단계
    refinement: {
        r0: '개조0',
        r1: '개조1',
        r2: '개조2',
        r3: '개조3',
        r4: '개조4',
        r5: '개조5',
        r6: '개조6',
        enhanced: '(강화)'
    },

    // 턴 관련
    turns: {
        '1turn': '1턴',
        '2turns': '2턴',
        '3turns': '3턴',
        '4turns': '4턴',
        '5turns': '5턴',
        '6turns': '6턴'
    },

    // 속성 (영어 키 → 한국어 값)
    elements: {
        almighty: '만능',
        physical: '물리',
        gun: '총격',
        fire: '화염',
        ice: '빙결',
        electric: '전격',
        wind: '질풍',
        windIce: '질풍빙결',
        psy: '염동',
        nuclear: '핵열',
        bless: '축복',
        curse: '주원',
        buff: '버프',
        debuff: '디버프',
        debuffAoe: '디버프광역'
    },

    // 상태이상 (영어 키 → 한국어 값)
    ailments: {
        burn: '화상',
        freeze: '동결',
        shock: '감전',
        sleep: '수면',
        forget: '망각',
        curse: '주원',
        windswept: '풍습',
        elementAilment: '원소 이상'
    },

    // 직업/포지션 (영어 키 → 한국어 값)
    positions: {
        medic: '구원',
        breaker: '굴복',
        assassin: '반항',
        guardian: '방위',
        striker: '우월',
        controller: '지배',
        navigator: '해명',
        autonomous: '자율'
    },

    // 계시 관련
    revelation: {
        sun: '일',
        moon: '월',
        star: '성',
        sky: '진',
        space: '주',
        sunMoonStarSky: '일월성진',
        sms: 'S/M/S/P',

        // 계시 종류
        common: '공통',
        control: '주권',
        departure: '여정',
        labor: '직책',
        resolve: '결심',
        freedom: '자유',
        triumph: '개선',
        hope: '희망'
    },

    // 에러 메시지
    errors: {
        loadFailed: '데이터를 불러오는데 실패했습니다.',
        saveFailed: '저장에 실패했습니다.',
        networkError: '네트워크 오류가 발생했습니다.',
        invalidInput: '잘못된 입력값입니다.',
        notFound: '데이터를 찾을 수 없습니다.',
        accessDenied: '접근 권한이 없습니다.',
        unknownError: '알 수 없는 오류가 발생했습니다.'
    },

    // 성공 메시지
    success: {
        saved: '저장되었습니다.',
        deleted: '삭제되었습니다.',
        copied: '복사되었습니다.',
        updated: '업데이트되었습니다.'
    },

    // 확인 메시지
    confirm: {
        delete: '정말 삭제하시겠습니까?',
        reset: '초기화하시겠습니까?',
        unsavedChanges: '저장하지 않은 변경사항이 있습니다. 계속하시겠습니까?'
    },

    // 레이블
    labels: {
        total: '전체',
        count: '개',
        unitPerson: '명',
        unitTime: '회',
        unitDay: '일',
        required: '필수',
        optional: '선택',
        recommended: '추천',
        new: '신규',
        hot: '인기',
        updated: '업데이트됨'
    }
};
