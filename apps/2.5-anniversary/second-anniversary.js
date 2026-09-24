(function () {
    'use strict';

    window.SecondAnniversaryConfig = {
        appBase: '/apps/2.5-anniversary',
        rootId: 'two-half-anniversary-root',
        globalName: 'TwoHalfAnniversaryPage',
        seoDomain: 'two-half-anniversary',
        flatVisuals: true,
        rerollBaseMaxReleaseOrder: 47,
        rerollExtraNames: ['시오미 코토네'],
        rerollRegionalExtraNames: {
            kr: ['시카노 이치고·여름'],
            tw: ['시카노 이치고·여름']
        },
        rerollRegionalExtraEndsAt: {
            kr: '2026-10-02T00:00:00+09:00',
            tw: '2026-10-02T00:00:00+08:00'
        },
        rerollScopeBase: '아마미야 렌·댄싱 스타',
        rerollScopeExtraItems: [{ name: '시오미 코토네' }],
        rerollScopeExtraItemsByRegion: {
            kr: [{ name: '시오미 코토네' }, { name: '시카노 이치고·여름', suffix: '(10.1)' }],
            tw: [{ name: '시오미 코토네' }, { name: '시카노 이치고·여름', suffix: '(10.1)' }]
        },
        guideAliases: { event3: 'event2' },
        eventKoromaruExcludeNames: ['쥐스틴&카롤린'],
        slotDefs: [
            { id: 'reroll', ticket: 'reroll', pool: 'rerollPool', scopeChar: '시오미 코토네', titleRaw: '리세마라 (선택)' },
            { id: 'event1', ticket: 'event', pool: 'eventKoromaru', scopeChar: '코로마루', titleRaw: '이벤트 선택권 1' },
            { id: 'event2', ticket: 'event', pool: 'eventMakoto', scopeChar: '유키 마코토', titleRaw: '이벤트 선택권 2' },
            { id: 'event3', ticket: 'event', pool: 'eventMakoto', scopeChar: '유키 마코토', titleRaw: '이벤트 선택권 3' },
            { id: 'standard', ticket: 'standard', pool: 'standard', scopeChar: '사카이 아야카', titleRaw: '통상 선택권' },
            { id: 'qa', ticket: 'login', pool: '', scopeChar: '', titleRaw: '뉴비 Q&A' }
        ],
        uiText: {
            kr: {
                headerLead: '2.5주년 리세마라에서 시오미 코토네를 확보하고, 이후 선택권은 범용적으로 활용할 수 있는 버퍼와 서포트 괴도를 확보하는 방법입니다.\n리세마라를 건너뛰는 경우에도 선택권 범위 안에서 좋은 캐릭터를 골라 시작할 수 있습니다.\n게임을 플레이하며 획득할 수 있는 추가 자원이 많은 만큼 코토네와 렌·댄싱 스타는 플레이로도 충분히 획득할 수 있습니다.',
                mailRule: '우편 수령 = <strong>한정 선택권 1장</strong>',
                acquireMail: '상시 300번 이후',
                slotTitles: { reroll: '리세마라 (선택)', event1: '이벤트 선택권 1', event2: '이벤트 선택권 2', event3: '이벤트 선택권 3', standard: '통상 선택권', qa: '뉴비 Q&A' }
            },
            en: {
                headerLead: 'Secure Kotone Shiomi through the 2.5th-anniversary reroll, then use the selectors for flexible buffers and support thieves.\nEven if you skip rerolling, you can start with a good character from the selector pools. Since you can obtain multiple characters while playing, we strongly recommend securing Kotone and Ren Amamiya·Starlight during this opportunity.',
                mailRule: 'Mailbox rewards = <strong>1 event selector</strong>',
                acquireMail: 'After 300 standard pulls',
                slotTitles: { reroll: 'Reroll', event1: 'Event Selector 1', event2: 'Event Selector 2', event3: 'Event Selector 3', standard: 'Standard Selector', qa: 'New Player Q&A' }
            },
            jp: {
                headerLead: '2.5周年のリセマラで汐見 琴音を確保し、その後の選択券は汎用性の高いバッファーやサポート怪盗に使う考え方です。\nリセマラを省略する場合も、選択券の範囲内で良いキャラを選んで始められます。ゲームを進めながら複数のキャラを入手できるため、この機会に琴音と雨宮 蓮・スターナイトはぜひ確保することをおすすめします。',
                mailRule: 'メール受取 = <strong>イベント選択券1枚</strong>',
                acquireMail: '恒常300回以降',
                slotTitles: { reroll: 'リセマラ', event1: 'イベント選択券1', event2: 'イベント選択券2', event3: 'イベント選択券3', standard: '恒常選択券', qa: '初心者Q&A' }
            },
            cn: {
                headerLead: '2.5周年刷初始优先拿到汐见琴音，之后的自选券优先补泛用增益和辅助怪盗。\n不刷初始也可以从自选范围内挑选优秀角色开局。游戏过程中能获得多名角色，因此推荐借这次机会务必拿到琴音和雨宫莲·星舞。',
                mailRule: '邮件领取 = <strong>1张活动自选券</strong>',
                acquireMail: '常驻300抽后',
                slotTitles: { reroll: '刷初始', event1: '活动自选券1', event2: '活动自选券2', event3: '活动自选券3', standard: '常驻自选券', qa: '新手 Q&A' }
            }
        }
    };

})();
