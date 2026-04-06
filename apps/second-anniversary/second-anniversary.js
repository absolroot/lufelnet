(function () {
    'use strict';

    const DEFAULT_LANG = 'kr';
    const SUPPORTED_LANGS = ['kr', 'en', 'jp', 'cn'];
    const EXCLUDED_CODENAMES = new Set(['WONDER', 'AIGIS_01']);

    const TICKET_ICONS = {
        reroll: '/assets/img/character-detail/limit.png',
        login: '/assets/img/2nd-aniv/item-datu-1062.png',
        event: '/assets/img/2nd-aniv/item-190091.png',
        standard: '/assets/img/2nd-aniv/item-190091.png',
        katayama: '/assets/img/2nd-aniv/item-190091.png'
    };

    const ALIASES = {
        '아라이 모토하·청광': { kr: '모토하·청광' },
        '나가오 마나카': { kr: '마나카' },
        '타네무라 리코·매화': { kr: '리코·매화' },
        '사카이 아야카': { kr: '아야카' },
        '리 야오링·사자무': { kr: '야오링·사자무' },
        '유키 마코토': { kr: '유키 마코토' },
        '하시모토 마유미': { kr: '마유미' },
        '키타가와 유스케': { kr: '유스케' },
        '미야시타 미나미·여름': { kr: '미나미·여름' },
        '아마미야 렌': { kr: '렌' },
        '카타야마 쿠미': { kr: '카타야마' },
        '타케바 유카리': { kr: '유카리' },
        '야마기시 후카': { kr: '후카' }
    };

    const ROLE_MAP = {
        '우월': '버퍼',
        '굴복': '디버퍼',
        '지배': '광역딜러',
        '반항': '단일딜러',
        '방위': '탱커/특화 버퍼',
        '구원': '힐러',
        '해명': '전역 서포터'
    };

    const ELEMENT_LABELS = {
        kr: { 화염: '화염', 빙결: '빙결', 전격: '전격', 질풍: '질풍', 염동: '염동', 축복: '축복', 주원: '주원', 핵열: '핵열', 물리: '물리' },
        en: { 화염: 'Fire', 빙결: 'Ice', 전격: 'Elec', 질풍: 'Wind', 염동: 'Psy', 축복: 'Bless', 주원: 'Curse', 핵열: 'Nuke', 물리: 'Physical' },
        jp: { 화염: '火炎', 빙결: '氷結', 전격: '電撃', 질풍: '疾風', 염동: '念動', 축복: '祝福', 주원: '呪怨', 핵열: '核熱', 물리: '物理' },
        cn: { 화염: '火焰', 빙결: '冰冻', 전격: '电击', 질풍: '疾风', 염동: '念动', 축복: '祝福', 주원: '咒怨', 핵열: '核热', 물리: '物理' }
    };

    const ROLE_LABELS = {
        kr: ROLE_MAP,
        en: { 우월: 'Buffer', 굴복: 'Debuffer', 지배: 'AOE Dealer', 반항: 'ST Dealer', 방위: 'Sustain Support', 구원: 'Healer', 해명: 'Support' },
        jp: { 우월: 'バッファー', 굴복: 'デバッファー', 지배: '全体アタッカー', 반항: '単体アタッカー', 방위: '耐久サポート', 구원: 'ヒーラー', 해명: 'サポート' },
        cn: { 우월: '增益', 굴복: '减益', 지배: '群攻输出', 반항: '单体输出', 방위: '生存辅助', 구원: '治疗', 해명: '辅助' }
    };

    const UI_TEXT = {
        kr: {
            headerLead: '2주년 출시 캐릭터 모토하 청광을 획득하고, 이외는 범용적으로 사용 가능한 버퍼와 서포트 괴도들을 획득을 목표로 하는 방법.\n아니면 리세마라를 패스하고 1명의 좋은 딜러를 선택하는 형태로 시작할 수 있습니다.',
            dayRule: '첫날 80 + 10일 누적 80개 = <strong>한정 선택권 2장</strong>',
            mailRule: '우편 수령 = <strong>한정 선택권 1장 + 통상 선택권 1장</strong>',
            slotTitles: { reroll: '리세마라 (선택)', event1: '이벤트 선택권 1', event2: '이벤트 선택권 2', katayama: '이벤트 선택권 3', standard: '통상 선택권 1', qa: '뉴비 Q&A' },
            metaRange: '범위',
            metaAcquire: '획득',
            acquireReroll: '계약(운명)',
            acquireEvent: '80 티켓 교환',
            acquireMail: '우편 수령',
            rankSuffix: '순위',
            qaTitle: '뉴비 Q&A',
            listSuffix: '목록',
            listHint: '최상단에 기재된 순위를 위주로 선택하는 것이 좋습니다.',
            standardHint: '* 한정 괴도 유스케, YUI, 렌의 통상(상시) 편입이 함께 진행됐습니다.',
            candidateHeading: '전체 선택 가능 후보군',
            tierPending: 'KR TBD'
        },
        en: {
            headerLead: 'The default route aims to secure Radiance Motoha first, then spend the remaining picks on flexible buffers and support thieves.\nYou can also skip rerolling and start with one strong standalone damage dealer.',
            dayRule: 'Day 1: 80 + next 10 days: 80 = <strong>2 event selectors</strong>',
            mailRule: 'Mailbox rewards = <strong>1 event selector + 1 standard selector</strong>',
            slotTitles: { reroll: 'Reroll', event1: 'Event Selector 1', event2: 'Event Selector 2', katayama: 'Event Selector 3', standard: 'Standard Selector 1', qa: 'New Player Q&A' },
            metaRange: 'Pool',
            metaAcquire: 'Source',
            acquireReroll: 'Contract (Fate)',
            acquireEvent: '80-ticket exchange',
            acquireMail: 'Mailbox reward',
            rankSuffix: '',
            qaTitle: 'New Player Q&A',
            listSuffix: 'List',
            listHint: 'Follow the higher-ranked recommendations first unless you have a specific preference.',
            standardHint: '* Yusuke, YUI, and Ren have already been added to the standard pool.',
            candidateHeading: 'All selectable candidates',
            tierPending: 'KR/TW TBD'
        },
        jp: {
            headerLead: '基本ルートはまず素羽・晴光を確保し、残りは汎用性の高いバッファーやサポート怪盗に回す考え方です。\nリセマラを省略して、単体で強いアタッカー1人から始める形でも進められます。',
            dayRule: '初日80 + 10日累計80 = <strong>イベント選択券2枚</strong>',
            mailRule: 'メール受取 = <strong>イベント選択券1枚 + 恒常選択券1枚</strong>',
            slotTitles: { reroll: 'リセマラ', event1: 'イベント選択券1', event2: 'イベント選択券2', katayama: 'イベント選択券3', standard: '恒常選択券1', qa: '初心者Q&A' },
            metaRange: '範囲',
            metaAcquire: '入手',
            acquireReroll: '契約(運命)',
            acquireEvent: '80枚交換',
            acquireMail: 'メール受取',
            rankSuffix: '位',
            qaTitle: '初心者Q&A',
            listSuffix: '一覧',
            listHint: '基本的には上位に書かれている候補から優先して選ぶのがおすすめです。',
            standardHint: '* 限定怪盗だった祐介、YUI、蓮は恒常プール編入が進んでいます。',
            candidateHeading: '選択可能な全候補',
            tierPending: 'KR/TW TBD'
        },
        cn: {
            headerLead: '默认路线是先拿到新井素羽·晴光，剩下的自选优先补泛用辅助和支援怪盗。\n如果不想刷初始，也可以直接围绕一名强力主力输出开局。',
            dayRule: '首日80 + 10日累计80 = <strong>2张活动自选券</strong>',
            mailRule: '邮件领取 = <strong>1张活动自选券 + 1张常驻自选券</strong>',
            slotTitles: { reroll: '刷初始', event1: '活动自选券1', event2: '活动自选券2', katayama: '活动自选券3', standard: '常驻自选券1', qa: '新手 Q&A' },
            metaRange: '范围',
            metaAcquire: '获取',
            acquireReroll: '契约(命运)',
            acquireEvent: '80票兑换',
            acquireMail: '邮件领取',
            rankSuffix: '位',
            qaTitle: '新手 Q&A',
            listSuffix: '列表',
            listHint: '优先按照上方排名更高的推荐来选，除非你有明确偏好。',
            standardHint: '* Yusuke、YUI、Ren 已并入常驻 5 星范围。',
            candidateHeading: '全部可选角色',
            tierPending: 'KR/TW TBD'
        }
    };

    const SLOT_DEFS = [
        { id: 'reroll', ticket: 'reroll', pool: 'rerollPool', scopeChar: '아라이 모토하·청광', titleRaw: '리세마라 (선택)' },
        { id: 'event1', ticket: 'event', pool: 'eventMakoto', scopeChar: '유키 마코토', titleRaw: '이벤트 선택권 1' },
        { id: 'event2', ticket: 'event', pool: 'eventMakoto', scopeChar: '유키 마코토', titleRaw: '이벤트 선택권 2' },
        { id: 'katayama', ticket: 'katayama', pool: 'katayama', scopeChar: '카타야마 쿠미', titleRaw: '이벤트 선택권 3' },
        { id: 'standard', ticket: 'standard', pool: 'standard', scopeChar: '하시모토 마유미', titleRaw: '통상 선택권 1' },
        { id: 'qa', ticket: 'login', pool: '', scopeChar: '', titleRaw: '뉴비 Q&A' }
    ];

    let rootEl = null;
    let currentLang = DEFAULT_LANG;
    let characters = [];
    let pools = {};
    let tierLookups = { kr: {} };
    let guideData = {};
    let qaData = [];
    let currentTab = 'reroll';

    function getUi() {
        return UI_TEXT[currentLang] || UI_TEXT[DEFAULT_LANG];
    }

    function normalizeLang(raw) {
        const value = String(raw || '').trim().toLowerCase();
        return SUPPORTED_LANGS.includes(value) ? value : DEFAULT_LANG;
    }

    function detectLang() {
        try { if (typeof window.getCurrentLang === 'function') return normalizeLang(window.getCurrentLang()); } catch (_) { }
        try { if (window.LanguageRouter && typeof window.LanguageRouter.getCurrentLanguage === 'function') return normalizeLang(window.LanguageRouter.getCurrentLanguage()); } catch (_) { }
        return DEFAULT_LANG;
    }

    function t(key, fallback) {
        try { if (typeof window.t === 'function') return window.t(key, fallback); } catch (_) { }
        return fallback !== undefined ? fallback : key;
    }

    function getCharacterEntries() {
        return Object.entries(window.characterData || {})
            .map(([shortName, entry]) => Object.assign({ shortName }, entry))
            .filter((entry) => entry && typeof entry === 'object' && entry.name && entry.rarity)
            .sort((a, b) => (b.release_order || 0) - (a.release_order || 0));
    }

    function findCharacter(name) {
        return characters.find((entry) => entry.name === name) || null;
    }

    function getShortName(character) {
        if (!character) return '';
        if (currentLang === 'kr') {
            return character.shortName || (ALIASES[character.name] && ALIASES[character.name].kr) || character.name;
        }
        if (currentLang === 'jp') return character.name_jp || character.name_en || character.name;
        if (currentLang === 'cn') return character.name_cn || character.name_en || character.name;
        return character.name_en || character.name;
    }

    function getTierMatchName(character) {
        if (!character) return '';
        return character.shortName || (ALIASES[character.name] && ALIASES[character.name].kr) || character.name;
    }

    function resolveCharacterSlug(character) {
        if (!character || typeof window === 'undefined') return '';

        const slugMap = window.__CHARACTER_SLUG_MAP;
        if (!slugMap || typeof slugMap !== 'object') return '';

        const candidates = [
            character.shortName,
            (ALIASES[character.name] && ALIASES[character.name].kr) || '',
            character.name,
            character.name_en
        ].map((value) => String(value || '').trim()).filter(Boolean);

        for (let i = 0; i < candidates.length; i += 1) {
            const key = candidates[i];
            const direct = slugMap[key];
            if (direct && typeof direct === 'object' && direct.slug) {
                return String(direct.slug).trim();
            }
        }

        const keys = Object.keys(slugMap);
        for (let i = 0; i < keys.length; i += 1) {
            const entry = slugMap[keys[i]];
            if (!entry || typeof entry !== 'object' || !entry.slug || !Array.isArray(entry.aliases)) continue;
            for (let j = 0; j < candidates.length; j += 1) {
                if (entry.aliases.includes(candidates[j])) {
                    return String(entry.slug).trim();
                }
            }
        }

        return '';
    }

    function getCharacterLink(character) {
        if (!character) return '#';
        const slug = resolveCharacterSlug(character);
        if (slug) {
            return `/${currentLang}/character/${encodeURIComponent(slug)}/`;
        }
        if (window.LanguageRouter && typeof window.LanguageRouter.buildCharacterDetailUrl === 'function') {
            return window.LanguageRouter.buildCharacterDetailUrl(getTierMatchName(character), currentLang);
        }
        return `/character.html?name=${encodeURIComponent(getTierMatchName(character))}&lang=${encodeURIComponent(currentLang)}`;
    }

    function encodeFileName(fileName) {
        return String(fileName || '').split('/').map((part) => encodeURIComponent(part)).join('/');
    }

    function getCharacterImage(character, variant) {
        if (!character) return '';
        const fileName = `${getTierMatchName(character)}.webp`;
        let folder = 'tier';
        if (variant === 'half') folder = 'character-half';
        return `/assets/img/${folder}/${encodeFileName(fileName)}`;
    }

    function getElementIcon(element) {
        return `/assets/img/character-cards/속성_${encodeFileName(element)}.png`;
    }

    function getPositionIcon(position) {
        return `/assets/img/character-cards/직업_${encodeFileName(position)}.png`;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function buildPools() {
        return {
            rerollPool: characters.filter((entry) => entry.rarity === 5 && entry.limit === true && !EXCLUDED_CODENAMES.has(entry.codename) && entry.name !== '아이기스' && (entry.release_order < 37 || entry.release_order >= 44)),
            eventMakoto: characters.filter((entry) => entry.rarity === 5 && entry.limit === true && !EXCLUDED_CODENAMES.has(entry.codename) && entry.name !== '아이기스' && entry.release_order <= 27),
            standard: characters.filter((entry) => entry.rarity === 5 && entry.limit === false && !EXCLUDED_CODENAMES.has(entry.codename) && entry.name !== '아이기스'),
            katayama: characters.filter((entry) => entry.rarity === 5 && !EXCLUDED_CODENAMES.has(entry.codename) && entry.name !== '아이기스' && entry.release_order <= 33)
        };
    }

    function buildTierLookup(rows) {
        const lookup = {};
        (rows || []).forEach((tierGroup) => {
            const positions = tierGroup && tierGroup.positions ? tierGroup.positions : {};
            Object.keys(positions).forEach((position) => {
                (positions[position] || []).forEach((entry) => {
                    if (!entry || !entry.name) return;
                    let label = tierGroup.label || '';
                    if (label.startsWith('T') && label.length === 2 && !isNaN(label[1])) {
                        label = label.replace('T', 'Tier ');
                    } else if (label.startsWith('T0')) {
                        label = label.replace('T0', 'Tier 0');
                    }
                    const awareness = entry.Awareness || 0;

                    if (!lookup[entry.name] || awareness < lookup[entry.name].awareness) {
                        lookup[entry.name] = { label: label, color: tierGroup.color || '', awareness: awareness };
                    }
                });
            });
        });
        return lookup;
    }

    async function loadDataFiles() {
        if (typeof window.fetch !== 'function') return;
        try {
            const tierResponse = await window.fetch('/apps/tier/kr_tier.json');
            if (tierResponse.ok) {
                const data = await tierResponse.json();
                tierLookups.kr = buildTierLookup(data);
            }
        } catch (_) { }

        try {
            const guideResponse = await window.fetch('/apps/second-anniversary/guide.json');
            if (guideResponse.ok) {
                guideData = await guideResponse.json();
            }
        } catch (_) { }

        try {
            const qaResponse = await window.fetch('/apps/second-anniversary/qa.json');
            if (qaResponse.ok) {
                qaData = await qaResponse.json();
            }
        } catch (_) { }
    }

    function getTierInfo(name) {
        return tierLookups.kr[name] || null;
    }

    function getLocalizedGuideReview(guide) {
        if (!guide) return '';
        if (currentLang === 'jp' && guide.review_jp) return guide.review_jp;
        if (currentLang === 'cn' && guide.review_cn) return guide.review_cn;
        if (currentLang === 'en' && guide.review_en) return guide.review_en;
        return guide.review || '';
    }

    function getLocalizedQaField(entry, key) {
        if (!entry) return '';
        const suffix = currentLang === 'jp' ? '_jp' : currentLang === 'cn' ? '_cn' : currentLang === 'en' ? '_en' : '';
        if (suffix && entry[key + suffix]) return entry[key + suffix];
        return entry[key] || '';
    }

    function getSlotTitle(slotId) {
        const ui = getUi();
        return (ui.slotTitles && ui.slotTitles[slotId]) || slotId;
    }

    function getRoleDescription(character) {
        if (!character) return '';
        const posName = character.position || '';
        const elName = character.element || '';
        const role = (ROLE_LABELS[currentLang] && ROLE_LABELS[currentLang][posName]) || (ROLE_LABELS[DEFAULT_LANG] && ROLE_LABELS[DEFAULT_LANG][posName]) || posName;
        const element = (ELEMENT_LABELS[currentLang] && ELEMENT_LABELS[currentLang][elName]) || (ELEMENT_LABELS[DEFAULT_LANG] && ELEMENT_LABELS[DEFAULT_LANG][elName]) || elName;
        if (posName === '해명') return role;
        return `${element} ${role}`.trim();
    }

    function getValidGuides(slotId) {
        const guides = guideData[slotId] || [];
        return guides.filter((guide) => !Array.isArray(guide.hidden_langs) || !guide.hidden_langs.includes(currentLang));
    }

    function renderHeader() {
        const ui = getUi();
        return `
            <h1>${escapeHtml(t('pageTitle', '2주년 뉴비 선택 가이드'))}</h1>
            <div class="sa-header-panel">
                <div class="sa-header-content">
                    <p>${escapeHtml(ui.headerLead).replace(/\n/g, '<br>')}</p>
                    <div class="sa-core-rules">
                        <div class="sa-core-rule" style="background:rgba(216, 184, 91, 0.08); border-color:rgba(216, 184, 91, 0.2);">
                            <img src="${TICKET_ICONS.login}" alt="">
                            <span>${ui.dayRule}</span>
                        </div>
                        <div class="sa-core-rule">
                            <span aria-hidden="true" style="color:var(--sa-gold-strong); font-size:1rem; margin-top:1px;">✉</span>
                            <span>${ui.mailRule}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSidebar() {
        const ui = getUi();
        return `
            <aside class="sa-sidebar">
                ${SLOT_DEFS.map(slot => {
            if (slot.id === 'qa') {
                return `
                        <button type="button" class="sa-tab-btn sa-tab-btn-single ${currentTab === slot.id ? 'is-active' : ''}" data-tab="${slot.id}" style="margin-top:20px;">
                            <div class="sa-tab-icons-stack" style="width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
                                <div style="font-size:1.8rem;">💡</div>
                            </div>
                            <div class="sa-tab-content" style="justify-content:center;">
                                <div class="sa-tab-header-box">
                                    <strong style="font-size: 1.15rem;">${escapeHtml(getSlotTitle(slot.id))}</strong>
                                </div>
                            </div>
                        </button>
                        `;
            }

            const validGuides = getValidGuides(slot.id);
            const rank1Guides = validGuides.filter(g => g.rank === 1);
            const rank1Char = rank1Guides.length > 0 ? findCharacter(rank1Guides[0].name) : null;

            let faceHtml = '';
            if (rank1Char) {
                faceHtml = `
                    <div class="sa-tab-visual">
                        <div class="sa-tab-icons-stack" style="width:46px; align-items:center; justify-content:center; display:flex;">
                            <img src="${getCharacterImage(rank1Char, 'half')}" class="sa-tab-front-icon" alt="" onerror="this.style.display='none'">
                        </div>
                        <span class="sa-tab-character-name">${escapeHtml(getShortName(rank1Char))}</span>
                    </div>
                `;
            }

            let scopeContent = '';
            let hintContent = '';
            if (slot.id === 'reroll') {
                scopeContent = `
                    <div class="sa-tab-scope-stack">
                        <div class="sa-tab-scope-row">
                            <span class="sa-tab-meta-label">${escapeHtml(ui.metaRange)}</span>
                            <div class="sa-tab-scope">
                                <span style="margin-right:2px;">~</span>
                                <img src="${getCharacterImage(findCharacter('야마기시 후카'), 'half')}" class="sa-tab-scope-face">
                                <span>${escapeHtml(getShortName(findCharacter('야마기시 후카')))}</span>
                            </div>
                        </div>
                        <div class="sa-tab-scope-row sa-tab-scope-row-indent">
                            <div class="sa-tab-scope">
                                <span style="margin-right:2px;">+</span>
                                <img src="${getCharacterImage(findCharacter('아라이 모토하·청광'), 'half')}" class="sa-tab-scope-face">
                                <span>${escapeHtml(getShortName(findCharacter('아라이 모토하·청광')))}</span>
                            </div>
                        </div>
                    </div>
                `;
                hintContent = `<div class="sa-tab-hint"><span class="sa-tab-meta-label">${escapeHtml(ui.metaAcquire)}</span><div class="sa-tab-hint-box"><img src="${TICKET_ICONS.reroll}" class="sa-currency-icon" alt=""> ${escapeHtml(ui.acquireReroll)}</div></div>`;
            } else if (['event1', 'event2'].includes(slot.id)) {
                scopeContent = `<span class="sa-tab-meta-label">${escapeHtml(ui.metaRange)}</span><div class="sa-tab-scope"><span style="margin-right:2px;">~</span> <img src="${getCharacterImage(findCharacter(slot.scopeChar), 'half')}" class="sa-tab-scope-face"> <span>${escapeHtml(getShortName(findCharacter(slot.scopeChar)))}</span></div>`;
                hintContent = `<div class="sa-tab-hint"><span class="sa-tab-meta-label">${escapeHtml(ui.metaAcquire)}</span><div class="sa-tab-hint-box"><img src="${TICKET_ICONS.login}" class="sa-currency-icon" alt=""> ${escapeHtml(ui.acquireEvent)}</div></div>`;
            } else if (['standard', 'katayama'].includes(slot.id)) {
                scopeContent = `<span class="sa-tab-meta-label">${escapeHtml(ui.metaRange)}</span><div class="sa-tab-scope"><span style="margin-right:2px;">~</span> <img src="${getCharacterImage(findCharacter(slot.scopeChar), 'half')}" class="sa-tab-scope-face"> <span>${escapeHtml(getShortName(findCharacter(slot.scopeChar)))}</span></div>`;
                hintContent = `<div class="sa-tab-hint"><span class="sa-tab-meta-label">${escapeHtml(ui.metaAcquire)}</span><div class="sa-tab-hint-box"><span aria-hidden="true">✉</span> ${escapeHtml(ui.acquireMail)}</div></div>`;
            }
            return `
                    <button type="button" class="sa-tab-btn ${currentTab === slot.id ? 'is-active' : ''}" data-tab="${slot.id}">
                        <strong class="sa-tab-title" style="font-size: 1.15rem; display:flex; align-items:center; gap:6px;">
                            <img src="${TICKET_ICONS[slot.ticket]}" style="width:24px; height:20px; object-fit:contain;" alt="">
                            ${escapeHtml(getSlotTitle(slot.id))}
                        </strong>
                        <div class="sa-tab-body">
                            ${faceHtml}
                            <div class="sa-tab-content">
                                <div class="sa-tab-header-box">
                                    <div class="sa-tab-meta-row">
                                        <div class="sa-tab-scope-box">
                                            ${scopeContent}
                                        </div>
                                    </div>
                                    ${hintContent}
                                </div>
                            </div>
                        </div>
                    </button>
                    `;
        }).join('')}
            </aside>
        `;
    }

    function getRankHtml(guide) {
        if (!guide || !guide.rank) return '';
        const ui = getUi();
        let color = '#a0a0a0';
        if (guide.rank === 1) color = 'var(--sa-gold-strong)';
        if (guide.rank === 2) color = '#c0c0c0';
        if (guide.rank === 3) color = '#cd7f32';
        return `<div class="sa-pill-rank" style="background:${color}; color:#111;">${guide.rank}${escapeHtml(ui.rankSuffix)}</div>`;
    }

    function renderCandidateGrid(slot) {
        if (slot.id === 'qa') {
            const ui = getUi();
            return `
            <div class="sa-candidate-view">
                <div class="sa-candidate-header">
                    <h2 style="margin-bottom: 8px;">${escapeHtml(ui.qaTitle)}</h2>
                </div>
                <div class="sa-qa-list" style="display:flex; flex-direction:column; gap:20px; margin-top:24px;">
                    ${qaData.map(qa => `
                        <div class="sa-qa-card" style="padding:20px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                            <h3 style="color:var(--sa-gold-strong); margin:0 0 12px 0; font-size:1.1rem; display:flex; gap:8px;">
                                <span>Q.</span> <span>${escapeHtml(getLocalizedQaField(qa, 'q'))}</span>
                            </h3>
                            <p style="color:var(--sa-text-muted); line-height:1.6; margin:0;">${escapeHtml(getLocalizedQaField(qa, 'a'))}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            `;
        }

        const pool = pools[slot.pool] || [];
        const validGuides = getValidGuides(slot.id);

        let guidesHtml = '';
        if (validGuides.length > 0) {
            guidesHtml = `
            <div class="sa-guides-container">
                ${validGuides.sort((a, b) => a.rank - b.rank).map(g => {
                const character = findCharacter(g.name);
                if (!character) return '';
                const isRank1 = g.rank === 1;
                const ui = getUi();

                return `
                    <div class="sa-guide-card" style="${isRank1 ? 'border-color: rgba(216, 184, 91, 0.4); background: linear-gradient(145deg, rgba(216, 184, 91, 0.1), rgba(0,0,0,0.3)); box-shadow: 0 8px 32px rgba(216, 184, 91, 0.12);' : ''}">
                        <div class="sa-guide-profile">
                            <img src="${getCharacterImage(character, 'half')}" class="sa-guide-profile-img" alt="">
                            <div class="sa-guide-content">
                                <div class="sa-guide-meta">
                                    <span class="sa-guide-rank-pill" style="align-self: flex-start; color:${isRank1 ? 'var(--sa-gold-strong)' : '#ddd'}; background:rgba(255,255,255,0.06); padding:4px 10px; border-radius:6px; font-size:0.85rem; font-weight:700; border:1px solid ${isRank1 ? 'rgba(216,184,91,0.3)' : 'rgba(255,255,255,0.1)'};">${g.rank}${escapeHtml(ui.rankSuffix)}</span>
                                    <div class="sa-guide-heading">
                                        <h4 style="margin:0;">${escapeHtml(getShortName(character) || g.name)}</h4>
                                        <div class="sa-guide-subtext">
                                            <img src="${getElementIcon(character.element || '')}" alt="${escapeHtml(character.element || '')}" class="sa-guide-tiny-icon">
                                            <img src="${getPositionIcon(character.position || '')}" alt="${escapeHtml(character.position || '')}" class="sa-guide-tiny-icon">
                                            <span class="sa-guide-job-desc">${escapeHtml(getRoleDescription(character))}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="sa-guide-text">
                                    <p style="margin-bottom:8px; color:rgba(255,255,255,0.9); font-size:1rem;">${escapeHtml(getLocalizedGuideReview(g))}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
            }).join('')}
            </div>
            `;
        }

        let mobileInfoHtml = '';
        if (slot.id !== 'qa') {
            let scopeContent = '';
            let hintContent = '';
            const ui = getUi();
            if (slot.id === 'reroll') {
                scopeContent = '<div class="sa-tab-scope-row" style="display:flex; align-items:center; gap:8px;"><span class="sa-tab-meta-label">' + escapeHtml(ui.metaRange) + '</span><div class="sa-tab-scope" style="margin-top:0;"><span style="margin-right:2px;">~</span><img src="' + getCharacterImage(findCharacter('야마기시 후카'), 'half') + '" class="sa-tab-scope-face"> <span>' + escapeHtml(getShortName(findCharacter('야마기시 후카'))) + '</span> <span style="margin:0 4px; color:var(--sa-text-soft);">+</span> <img src="' + getCharacterImage(findCharacter('아라이 모토하·청광'), 'half') + '" class="sa-tab-scope-face"> <span>' + escapeHtml(getShortName(findCharacter('아라이 모토하·청광'))) + '</span></div></div>';
                hintContent = '<div class="sa-tab-hint" style="margin-top:0;"><span class="sa-tab-meta-label">' + escapeHtml(ui.metaAcquire) + '</span><div class="sa-tab-hint-box"><img src="' + TICKET_ICONS.reroll + '" class="sa-currency-icon" alt=""> ' + escapeHtml(ui.acquireReroll) + '</div></div>';
            } else if (['event1', 'event2'].includes(slot.id)) {
                scopeContent = '<div class="sa-tab-scope-row" style="display:flex; align-items:center; gap:8px;"><span class="sa-tab-meta-label">' + escapeHtml(ui.metaRange) + '</span><div class="sa-tab-scope" style="margin-top:0;"><span style="margin-right:2px;">~</span> <img src="' + getCharacterImage(findCharacter(slot.scopeChar), 'half') + '" class="sa-tab-scope-face"> <span>' + escapeHtml(getShortName(findCharacter(slot.scopeChar))) + '</span></div></div>';
                hintContent = '<div class="sa-tab-hint" style="margin-top:0;"><span class="sa-tab-meta-label">' + escapeHtml(ui.metaAcquire) + '</span><div class="sa-tab-hint-box"><img src="' + TICKET_ICONS.login + '" class="sa-currency-icon" alt=""> ' + escapeHtml(ui.acquireEvent) + '</div></div>';
            } else if (['standard', 'katayama'].includes(slot.id)) {
                scopeContent = '<div class="sa-tab-scope-row" style="display:flex; align-items:center; gap:8px;"><span class="sa-tab-meta-label">' + escapeHtml(ui.metaRange) + '</span><div class="sa-tab-scope" style="margin-top:0;"><span style="margin-right:2px;">~</span> <img src="' + getCharacterImage(findCharacter(slot.scopeChar), 'half') + '" class="sa-tab-scope-face"> <span>' + escapeHtml(getShortName(findCharacter(slot.scopeChar))) + '</span></div></div>';
                hintContent = '<div class="sa-tab-hint" style="margin-top:0;"><span class="sa-tab-meta-label">' + escapeHtml(ui.metaAcquire) + '</span><div class="sa-tab-hint-box"><span aria-hidden="true" style="margin-right:4px;">✉</span> ' + escapeHtml(ui.acquireMail) + '</div></div>';
            }
            if (scopeContent || hintContent) {
                mobileInfoHtml = `\n                    <div class="sa-mobile-tab-info" style="display:none; flex-wrap:wrap; gap:12px; margin-bottom:12px; margin-top:12px; background:rgba(0,0,0,0.25); padding:10px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">\n                        ${scopeContent}\n                        ${hintContent}\n                    </div>`;
            }
        }

        return `
            <div class="sa-candidate-view">
                <div class="sa-candidate-header" style="${guidesHtml ? 'border-bottom:none; margin-bottom:0;' : ''}">
                    <h2 style="margin-bottom: 0px;">${escapeHtml(getSlotTitle(slot.id))} ${escapeHtml(getUi().listSuffix)}</h2>${mobileInfoHtml}
                    <p style="color:var(--sa-text-muted); font-size:0.95rem; line-height:1.5;">${escapeHtml(getUi().listHint)}</p>
                    ${slot.id === 'standard' ? `<p style="color:var(--sa-gold-strong); font-size:0.9rem; margin-top:6px;">${escapeHtml(getUi().standardHint)}</p>` : ''}
                </div>

                ${guidesHtml}

                <div class="sa-all-candidates-title" style="margin-top:40px; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:8px; display:flex; align-items:center; justify-content:space-between;">
                    <h3 style="font-size:1.2rem; color:var(--sa-text-soft);">${escapeHtml(getUi().candidateHeading)}</h3>
                </div>
                
                <div class="sa-candidate-grid">
                    ${pool.map(character => {
            const tierInfo = getTierInfo(getTierMatchName(character));
            const tierLabel = tierInfo ? tierInfo.label : getUi().tierPending;
            const tierColor = tierInfo ? tierInfo.color : '#fff';

            let guideMatch = validGuides.find(g => g.name === character.name);

            return `
                        <a class="sa-candidate-pill" href="${getCharacterLink(character)}" style="${guideMatch ? `border-color: ${guideMatch.rank === 1 ? 'var(--sa-gold-strong)' : 'rgba(255,255,255,0.4)'};` : ''}">
                            <div class="sa-candidate-pill-icons">
                                <img src="${getElementIcon(character.element || '')}" alt="${escapeHtml(character.element || '')}" title="${escapeHtml(character.element || '')}" onerror="this.style.display='none'">
                                <img src="${getPositionIcon(character.position || '')}" alt="${escapeHtml(character.position || '')}" title="${escapeHtml(character.position || '')}" onerror="this.style.display='none'">
                            </div>
                            ${getRankHtml(guideMatch)}
                            <img class="sa-candidate-pill-art" src="${getCharacterImage(character, 'tier')}" data-fallback="${getCharacterImage(character, 'half')}" loading="lazy" alt="">
                            <div class="sa-candidate-pill-name">${escapeHtml(getShortName(character))}</div>
                            <div class="sa-candidate-pill-desc">
                                <span style="display:block; margin-bottom:2px;">${escapeHtml(getRoleDescription(character))}</span>
                                <span style="display:inline-block; font-weight:700; color:${tierColor}; font-size:0.75rem;">${escapeHtml(tierLabel)}</span>
                            </div>
                        </a>
                        `
        }).join('')}
                </div>
            </div>
        `;
    }

    function render() {
        if (!rootEl) return;

        const currentSlot = SLOT_DEFS.find(s => s.id === currentTab);

        rootEl.innerHTML = `
            ${renderHeader()}
            <div class="sa-app-layout">
                ${renderSidebar()}
                <div class="sa-main-content">
                    ${renderCandidateGrid(currentSlot)}
                </div>
            </div>
        `;

        bindEvents();
        if (window.I18nService && typeof window.I18nService.updateDOM === 'function') {
            window.I18nService.updateDOM(rootEl);
        }
    }

    function bindEvents() {
        rootEl.querySelectorAll('[data-tab]').forEach((button) => {
            button.addEventListener('click', () => {
                currentTab = button.getAttribute('data-tab');
                render();
            });
        });

        rootEl.querySelectorAll('img[data-fallback]').forEach((img) => {
            img.addEventListener('error', function handleImageError() {
                const nextSrc = this.getAttribute('data-fallback');
                if (nextSrc && this.src !== nextSrc) {
                    this.src = nextSrc;
                    return;
                }
                this.style.display = 'none';
            });
        });
    }

    function setSeoHint() {
        if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
            window.SeoEngine.setContextHint({ domain: 'second-anniversary', mode: 'list', lang: currentLang }, { rerun: true });
        }
    }

    function ensureCharacterData(maxAttempts) {
        let attempt = 0;
        return new Promise((resolve, reject) => {
            const poll = () => {
                attempt += 1;
                if (window.characterData && Object.keys(window.characterData).length > 0) return resolve();
                if (attempt >= maxAttempts) return reject(new Error('characterData unavailable'));
                window.setTimeout(poll, 100);
            };
            poll();
        });
    }

    async function init() {
        rootEl = document.getElementById('second-anniversary-root');
        if (!rootEl) return;
        currentLang = detectLang();
        try {
            await ensureCharacterData(50);
        } catch (_) {
            rootEl.innerHTML = `<div class="second-anniversary-loading">${escapeHtml(t('errors.characterData', 'Failed to load character data.'))}</div>`;
            return;
        }
        characters = getCharacterEntries();
        pools = buildPools();
        await loadDataFiles();
        render();
        setSeoHint();
    }

    window.SecondAnniversaryPage = { init };
})();
