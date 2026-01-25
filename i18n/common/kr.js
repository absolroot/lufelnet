/**
 * 한국어 공통 번역
 * 
 * 모든 페이지에서 공통으로 사용하는 UI 요소, 네비게이션, 버튼, 메시지 등의 번역을 포함합니다.
 */

export default {
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

    // 게임 공통 용어 (i18n-utils.js에서 이관)
    gameTerms: {
        // 기본 스탯
        hp: '생명',
        maxHp: '최대 생명',
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

        // 기타
        spRecovery: 'SP 회복',
        resonance: '추격',
        naviPower: '해명의힘',
        labor: '직책',
        myPalace: '마이팰리스',

        // 무기 및 의식
        awareness: '의식',
        exclusiveWeapon: '전용무기',
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

        // 속성
        fire: '화염 속성',
        ice: '빙결 속성',
        electric: '전격',

        // 상태이상
        burn: '화상',
        freeze: '동결',
        shock: '감전',
        sleep: '수면',
        forget: '망각',
        curse: '주원',
        windswept: '풍습',

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

        // 심상
        mindscape: '심상',
        minds5: '심상5',

        // 계시
        revelation: '계시',
        wonder: '원더',

        // 턴 관련
        '1turn': '1턴',
        '2turns': '2턴',
        '3turns': '3턴',
        '4turns': '4턴',
        '5turns': '5턴',
        '6turns': '6턴',

        // 범위
        aoe: '광역',
        single: '단일',
        self: '자신'
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

    // 계시 관련
    revelation: {
        sun: '일',
        moon: '월',
        star: '성',
        sky: '진',
        space: '주',
        sunMoonStarSky: '일월성진',

        // 계시 종류
        common: '공통',
        control: '주권',
        departure: '여정',
        labor: '직책',
        resolve: '결심',
        freedom: '자유',
        triumph: '개선',
        hope: '희망',
        desperado: '황야의 구세주'
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
