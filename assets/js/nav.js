class Navigation {
    static getLanguageSelectorLabel(lang) {
        const safeLang = String(lang || '').toLowerCase();
        if (safeLang === 'kr') return '한국어';
        if (safeLang === 'en') return 'English';
        if (safeLang === 'jp') return '日本語';
        if (safeLang === 'cn') return '中文(Beta)';
        return '한국어';
    }

    static async load(activePage) {
        // 현재 언어 감지
        const currentLang = this.getCurrentLanguage();

        // 모바일 헤더 추가
        const mobileHeader = document.createElement('div');
        mobileHeader.className = 'mobile-header';
        mobileHeader.style.position = 'fixed';
        mobileHeader.style.top = '0';
        mobileHeader.style.left = '0';
        mobileHeader.style.width = '100%';
        document.body.insertBefore(mobileHeader, document.body.firstChild);

        // 로고 컨테이너 추가
        const logoContainer = document.createElement('a');
        logoContainer.className = 'mobile-logo-container';
        logoContainer.href = `${BASE_URL}/${currentLang}/`;
        logoContainer.innerHTML = `
            <img src="${BASE_URL}/assets/img/logo/lufel.webp" alt="logo" />
            <img src="${BASE_URL}/assets/img/logo/lufelnet.png" alt="logo-text" />
        `;
        mobileHeader.appendChild(logoContainer);

        // 햄버거 버튼 추가
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        mobileHeader.appendChild(hamburgerBtn);

        // 다국어 텍스트 정의
        const i18n = {
            kr: {
                sectionGuide: '가이드',
                sectionTools: '도구',
                sectionMeta: '메타',
                sectionSite: '사이트',
                character: '캐릭터',
                persona: '페르소나',
                revelationsInfo: '계시',
                synergy: '협력자',
                wonderweapon: '원더 무기',
                maps: '지도',
                article: '아티클',
                scheduleRelease: '출시 일정',
                pullPlanner: '계약 플래너',
                materialCalc: '육성 계산기',
                defenseCalc: '방어력 감소 계산기',
                criticalCalc: '크리티컬 계산기',
                revelationSetting: '계시 공유',
                pullTrackerIndividual: '계약 통계',
                pullTrackerGlobal: '계약 통계 (전체)',
                payCalc: '과금 계산기',
                tier: '티어',
                tacticLibrary: '택틱 도서관',
                tacticMaker: '택틱 메이커',
                astrolabe: '성좌의 시련',
                velvetTrial: '벨벳 시련',
                about: '소개'
            },
            en: {
                sectionGuide: 'Guide',
                sectionTools: 'Tools',
                sectionMeta: 'META/TRIAL',
                sectionSite: 'Site',
                character: 'Character',
                persona: 'Persona',
                revelationsInfo: 'Revelations',
                synergy: 'Synergy',
                wonderweapon: 'Wonder Daggers',
                maps: 'Maps',
                article: 'Articles',
                scheduleRelease: 'Release Schedule',
                pullPlanner: 'Pull Planner',
                materialCalc: 'Progression',
                defenseCalc: 'Defense Reduction',
                criticalCalc: 'Critical Rate',
                revelationSetting: 'Revelation Share',
                pullTrackerIndividual: 'Pull Stats',
                pullTrackerGlobal: 'Pull Stats (Global)',
                payCalc: 'Payment Calculator',
                tier: 'Tier',
                tacticLibrary: 'Tactics Library',
                tacticMaker: 'Tactic Maker',
                astrolabe: 'Astrolabe',
                velvetTrial: 'Velvet Trial',
                about: 'About'
            },
            jp: {
                sectionGuide: 'ガイド',
                sectionTools: 'ツール',
                sectionMeta: 'メタ/試練',
                sectionSite: 'サイト',
                character: '怪盗',
                persona: 'ペルソナ',
                revelationsInfo: '啓示',
                synergy: 'シナジー',
                wonderweapon: 'ワンダー武器',
                maps: '地図',
                article: '攻略記事',
                scheduleRelease: 'リリース',
                pullPlanner: 'ガチャプランナー',
                materialCalc: '育成',
                defenseCalc: '防御力減少',
                criticalCalc: 'クリティカル',
                revelationSetting: '啓示共有',
                pullTrackerIndividual: '個人統計',
                pullTrackerGlobal: '全体統計',
                payCalc: '課金',
                tier: 'ティア',
                tacticLibrary: 'タクティクスライブラリー',
                tacticMaker: 'タクティクスメーカー',
                astrolabe: 'アストロラーベ',
                velvetTrial: 'ベルベット試練',
                about: '紹介'
            },
            cn: {
                sectionGuide: '攻略',
                sectionTools: '工具',
                sectionMeta: '配队/试炼',
                sectionSite: '网站',
                character: '怪盗',
                persona: '人格面具',
                revelationsInfo: '启示',
                synergy: '协同者',
                wonderweapon: 'WONDER武器',
                maps: '地图',
                article: '攻略',
                scheduleRelease: '上线日程',
                pullPlanner: '抽卡规划器',
                materialCalc: '养成计算器',
                defenseCalc: '防御力降低计算器',
                criticalCalc: '暴击率计算器',
                revelationSetting: '启示分享',
                pullTrackerIndividual: '契约记录',
                pullTrackerGlobal: '全服统计',
                payCalc: '充值计算器',
                tier: '强度榜',
                tacticLibrary: '战术库',
                tacticMaker: '战术编辑器',
                astrolabe: '星盘试炼',
                velvetTrial: '天鹅绒试炼',
                about: '关于'
            }
        };

        // 현재 언어의 텍스트 가져오기
        const texts = i18n[currentLang] || i18n.kr;

        const krLikeMenus = [
            'character', 'persona', 'revelations-info', 'synergy', 'wonderweapon', 'maps', 'article',
            'material-calc', 'defense-calc', 'critical-calc', 'revelation-setting', 'pullTracker', 'pay-calc',
            'tier', 'tactic-library', 'tactic-maker', 'astrolabe', 'velvet-trial',
            'about'
        ];

        const cnMenus = krLikeMenus.filter((key) => !['article', 'revelation-setting', 'pay-calc', 'velvet-trial'].includes(key));

        const availableMenus = {
            kr: krLikeMenus,
            en: [
                'character', 'persona', 'revelations-info', 'synergy', 'wonderweapon', 'maps', 'article',
                'schedule-release', 'pull-calc', 'material-calc', 'defense-calc', 'critical-calc', 'revelation-setting', 'pullTracker',
                'tier', 'tactic-library', 'tactic-maker', 'astrolabe', 'velvet-trial',
                'about'
            ],
            jp: [
                'character', 'persona', 'revelations-info', 'synergy', 'wonderweapon', 'maps', 'article',
                'schedule-release', 'pull-calc', 'material-calc', 'defense-calc', 'critical-calc', 'revelation-setting', 'pullTracker',
                'tier', 'tactic-library', 'tactic-maker', 'astrolabe', 'velvet-trial',
                'about'
            ],
            cn: cnMenus
        };

        const currentMenus = availableMenus[currentLang] || availableMenus.kr;

        // 섹션 정의 (각 아이템에 개별 아이콘)
        const sections = [
            {
                key: 'guide',
                labelKey: 'sectionGuide',
                items: [
                    { key: 'character', textKey: 'character', icon: 'guaidao.png', url: `/${currentLang}/character/` },
                    { key: 'persona', textKey: 'persona', icon: 'persona2.png', url: `/${currentLang}/persona/` },
                    { key: 'revelations-info', textKey: 'revelationsInfo', icon: 'qishi.png', url: `/${currentLang}/revelations/` },
                    { key: 'synergy', textKey: 'synergy', icon: 'synergy.png', url: `/${currentLang}/synergy/` },
                    { key: 'wonderweapon', textKey: 'wonderweapon', icon: 'wonder-weapon.png', url: `/${currentLang}/wonder-weapon/` },
                    { key: 'maps', textKey: 'maps', icon: 'maps.png', url: `/${currentLang}/maps/` },
                    { key: 'article', textKey: 'article', icon: 'article.png', url: `/${currentLang}/article/` }
                ]
            },
            {
                key: 'tools',
                labelKey: 'sectionTools',
                items: [
                    { key: 'schedule-release', textKey: 'scheduleRelease', icon: 'schedule.png', url: `/${currentLang}/schedule/` },
                    { key: 'pull-calc', textKey: 'pullPlanner', icon: 'pull-calc.png', url: `/${currentLang}/pull-calc/` },
                    { key: 'material-calc', textKey: 'materialCalc', icon: 'material.png', url: `/${currentLang}/material-calc/` },
                    { key: 'defense-calc', textKey: 'defenseCalc', icon: 'defense-calc.png', url: `/${currentLang}/defense-calc/` },
                    { key: 'critical-calc', textKey: 'criticalCalc', icon: 'critical.png', url: `/${currentLang}/critical-calc/` },
                    { key: 'revelation-setting', textKey: 'revelationSetting', icon: 'qishi2.png', url: `/${currentLang}/revelation-setting/` },
                    { key: 'pullTracker', textKey: 'pullTracker', icon: 'pull.png', url: `/${currentLang}/pull-tracker/` },
                    { key: 'pay-calc', textKey: 'payCalc', icon: 'calculator.png', url: `/${currentLang}/pay-calc/` }
                ]
            },
            {
                key: 'meta',
                labelKey: 'sectionMeta',
                items: [
                    { key: 'tier', textKey: 'tier', icon: 'tier.png', url: `/${currentLang}/tier/` },
                    { key: 'tactic-library', textKey: 'tacticLibrary', icon: 'tactic.png', url: `/${currentLang}/tactic/library/` },
                    { key: 'tactic-maker', textKey: 'tacticMaker', icon: 'tactic-maker.png', url: `/${currentLang}/tactic-maker/` },
                    { key: 'astrolabe', textKey: 'astrolabe', icon: 'astrolabe.png', url: `/${currentLang}/astrolabe/` },
                    { key: 'velvet-trial', textKey: 'velvetTrial', icon: 'velvet-trial.png', url: `/${currentLang}/velvet-trial/` }
                ]
            },
            {
                key: 'site',
                labelKey: 'sectionSite',
                items: [
                    { key: 'about', textKey: 'about', icon: 'about.png', url: `/${currentLang}/about/` }
                ]
            }
        ];

        // 섹션 HTML 생성
        const buildSectionsHtml = () => {
            const pullTrackerFallbackText = currentLang === 'kr'
                ? '\uacc4\uc57d \ud2b8\ub798\ucee4'
                : (texts.pullTrackerIndividual || 'Pull Tracker');

            return sections.map(section => {
                const visibleItems = section.items.filter(item => currentMenus.includes(item.key));
                if (visibleItems.length === 0) return '';
                return `
                    <div class="nav-section" data-section="${section.key}">
                        <div class="nav-section-header">
                            <span class="nav-section-label">${texts[section.labelKey]}</span>
                            ${visibleItems.length > 1 ? `
                            <svg class="nav-section-chevron" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
                            ` : '<span class="nav-section-chevron-spacer"></span>'}
                        </div>
                        <div class="nav-section-items">
                            ${visibleItems.map(item => `
                                <a href="${BASE_URL}${item.url}" class="nav-section-item" data-nav="${item.key}">
                                    <img src="${BASE_URL}/assets/img/nav/${item.icon}" alt="" class="nav-item-icon" />
                                    <span>${texts[item.textKey] || (item.key === 'pullTracker' ? pullTrackerFallbackText : item.textKey)}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        };

        const shouldStartPinned = window.innerWidth > 1440 && localStorage.getItem('navPinned') !== 'false';

        const navTemplate = `
            <nav class="main-nav${shouldStartPinned ? ' nav-pinned' : ''}">
                <a class="logo-container" href="${BASE_URL}/${currentLang}/">
                    <img src="${BASE_URL}/assets/img/logo/lufel.webp" alt="logo" />
                    <img src="${BASE_URL}/assets/img/logo/lufelnet.png" alt="logo-text" />
                </a>
                ${buildSectionsHtml()}
                <div class="nav-spacer"></div>
                <div class="nav-bg"></div>
                <!-- language selector -->
                <div class="language-selector-container">
                    <div class="custom-select">
                        <div class="selected-option">
                            <img src="${BASE_URL}/assets/img/flags/${currentLang}.png" alt="${currentLang}" class="flag-icon">
                            <span>${this.getLanguageSelectorLabel(currentLang)}</span>
                        </div>
                        <div class="options-container">
                            <div class="option ${currentLang === 'kr' ? 'selected' : ''}" data-value="kr" role="button" tabindex="0" onclick="return false;">
                                <img src="${BASE_URL}/assets/img/flags/kr.png" alt="kr" class="flag-icon">
                                <span>한국어</span>
                            </div>

                            <div class="option ${currentLang === 'en' ? 'selected' : ''}" data-value="en" role="button" tabindex="0" onclick="return false;">
                                <img src="${BASE_URL}/assets/img/flags/en.png" alt="en" class="flag-icon">
                                <span>English</span>
                            </div>
                            <div class="option ${currentLang === 'jp' ? 'selected' : ''}" data-value="jp" role="button" tabindex="0" onclick="return false;">
                                <img src="${BASE_URL}/assets/img/flags/jp.png" alt="jp" class="flag-icon">
                                <span>日本語</span>
                            </div>
                            <div class="option ${currentLang === 'cn' ? 'selected' : ''}" data-value="cn" role="button" tabindex="0" onclick="return false;">
                                <img src="${BASE_URL}/assets/img/flags/cn.png" alt="cn" class="flag-icon">
                                <span>中文(Beta)</span>
                            </div>
                        </div>
                    </div>
                    <!-- PC nav toggle icon -->
                    <div class="nav-toggle-separator"></div>
                    <button class="nav-toggle-btn" aria-label="Toggle navigation">
                    <div class="nav-toggle-icon-wrapper" aria-label="Toggle navigation">
                        <svg class="nav-toggle-icon open" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-9v14h9a1 1 0 0 0 .993 -.883l.007 -.117v-12a1 1 0 0 0 -.883 -.993l-.117 -.007zm-4.387 4.21l.094 .083l2 2a1 1 0 0 1 .083 1.32l-.083 .094l-2 2a1 1 0 0 1 -1.497 -1.32l.083 -.094l1.292 -1.293l-1.292 -1.293a1 1 0 0 1 -.083 -1.32l.083 -.094a1 1 0 0 1 1.32 -.083z" />
                        </svg>
                        <svg class="nav-toggle-icon close" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-9v14h9a1 1 0 0 0 .993 -.883l.007 -.117v-12a1 1 0 0 0 -.883 -.993l-.117 -.007zm-2.293 4.293a1 1 0 0 1 .083 1.32l-.083 .094l-1.292 1.293l1.292 1.293a1 1 0 0 1 .083 1.32l-.083 .094a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 -.083 -1.32l.083 -.094l2 -2a1 1 0 0 1 1.414 0z" />
                        </svg>
                    </div>
                </button>
                </div>
                <div class="nav-scroll-thumb" aria-hidden="true"></div>
            </nav>
        `;

        document.querySelector('#nav-container').innerHTML = navTemplate;
        const mainNavEl = document.querySelector('#nav-container .main-nav');
        if (mainNavEl) {
            // Prevent first-paint layout shift before nav CSS applies.
            mainNavEl.style.position = 'fixed';
            mainNavEl.style.top = '0';
        }
        this.initNavScrollThumb();

        // sword animation 초기화
        this.initSwordAnimation();

        // 로고는 기본 링크 동작을 사용 (중간 클릭/우클릭 메뉴 지원)

        // 언어 드롭다운 토글
        if (!document.querySelector('.selected-option').hasAttribute('data-event-bound')) {
            document.querySelector('.selected-option').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const optionsContainer = document.querySelector('.options-container');
                optionsContainer.classList.toggle('active');
            });
            document.querySelector('.selected-option').setAttribute('data-event-bound', 'true');
        }

        // 언어 선택 옵션 이벤트
        document.querySelectorAll('.language-selector-container .option').forEach(option => {
            if (!option.hasAttribute('data-event-bound')) {
                option.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    if (this.classList.contains('disabled')) return;
                    const lang = this.getAttribute('data-value');
                    Navigation.selectLanguage(lang, e);
                });
                option.setAttribute('data-event-bound', 'true');
            }
        });

        // PC nav toggle button
        const navToggleBtn = document.querySelector('.nav-toggle-btn');
        if (navToggleBtn && !navToggleBtn.hasAttribute('data-event-bound')) {
            navToggleBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const mainNav = document.querySelector('.main-nav');
                const body = document.body;

                if (mainNav.classList.contains('nav-pinned')) {
                    mainNav.classList.remove('nav-pinned');
                    body.classList.remove('nav-expanded');
                    localStorage.setItem('navPinned', 'false');
                } else {
                    mainNav.classList.add('nav-pinned');
                    body.classList.add('nav-expanded');
                    localStorage.setItem('navPinned', 'true');
                }
            });
            navToggleBtn.setAttribute('data-event-bound', 'true');
        }

        // Restore nav pinned state (PC only)
        if (window.innerWidth > 1440) {
            const navPinned = localStorage.getItem('navPinned');
            if (navPinned !== 'false') {
                document.querySelector('.main-nav')?.classList.add('nav-pinned');
                document.body.classList.add('nav-expanded');
            }
        }

        // 섹션 접기 상태 복원
        const collapsedSections = JSON.parse(localStorage.getItem('navCollapsedSections') || '[]');
        collapsedSections.forEach(sectionKey => {
            const section = document.querySelector(`.nav-section[data-section="${sectionKey}"]`);
            if (section) section.classList.add('collapsed');
        });

        // 섹션 토글 이벤트
        document.querySelectorAll('.nav-section-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const section = header.closest('.nav-section');
                // 아이템이 1개인 섹션은 토글하지 않음
                const items = section.querySelectorAll('.nav-section-item');
                if (items.length <= 1) return;

                section.classList.toggle('collapsed');
                const collapsed = [...document.querySelectorAll('.nav-section.collapsed')].map(el => el.dataset.section);
                localStorage.setItem('navCollapsedSections', JSON.stringify(collapsed));
                requestAnimationFrame(() => Navigation.initNavScrollThumb());
            });
        });

        // 활성 페이지 처리
        if (activePage) {
            // 이전 data-nav 값과의 호환성 매핑
            const activePageAliases = {
                'revelations': 'revelations-info',
                'tactic': 'tactic-maker',
                'tactics': 'tactic-library',
                'schedule': 'schedule-release',
                'pullTracker': 'pullTracker',
                'pullTracker_individual': 'pullTracker',
                'pullTracker_global': 'pullTracker',
                'tier-list': 'tier',
                'tier-maker': 'tier',
                'home': null,
                'gallery': null
            };

            const resolved = activePageAliases.hasOwnProperty(activePage)
                ? activePageAliases[activePage]
                : activePage;

            if (resolved) {
                const activeItem = document.querySelector(`.nav-section-item[data-nav="${resolved}"]`);
                if (activeItem) {
                    activeItem.classList.add('active');
                    // 부모 섹션이 접혀있으면 펼치기
                    const parentSection = activeItem.closest('.nav-section');
                    if (parentSection) {
                        parentSection.classList.remove('collapsed');
                        parentSection.classList.add('has-active');
                    }
                }
            }
        }

        // 스크롤 이벤트 처리
        let lastScroll = 0;
        let scrollPosition = 0;

        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 1440) {
                const currentScroll = window.pageYOffset;
                const header = document.querySelector('.mobile-header');

                if (currentScroll > lastScroll && currentScroll > 60) {
                    header.classList.add('hide');
                } else {
                    header.classList.remove('hide');
                }
                lastScroll = currentScroll;
            }
        });

        // 햄버거 메뉴 이벤트
        hamburgerBtn.addEventListener('click', () => {
            const nav = document.querySelector('.main-nav');
            const header = document.querySelector('.mobile-header');

            const willOpen = !hamburgerBtn.classList.contains('active');

            hamburgerBtn.classList.toggle('active');
            nav.classList.toggle('active');
            header.classList.toggle('active');

            if (willOpen) {
                nav.style.webkitOverflowScrolling = 'auto';
                nav.scrollTop = 0;
                void nav.offsetHeight;
                nav.style.webkitOverflowScrolling = 'touch';

                if (window.innerWidth <= 768) {
                    scrollPosition = window.scrollY || window.pageYOffset;
                    document.documentElement.classList.add('nav-locked');
                    document.body.classList.add('nav-locked');
                    document.body.style.top = `-${scrollPosition}px`;
                    document.body.style.position = 'fixed';
                    document.body.style.width = '100%';
                }
            } else {
                if (window.innerWidth <= 768) {
                    document.documentElement.classList.remove('nav-locked');
                    document.body.classList.remove('nav-locked');
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    window.scrollTo(0, scrollPosition || 0);
                }
            }
        });

        // 모바일에서 메뉴 아이템 클릭시 메뉴 닫기
        document.querySelectorAll('.nav-section-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 1440) {
                    const nav = document.querySelector('.main-nav');
                    const hamburgerBtn = document.querySelector('.hamburger-btn');
                    nav.classList.remove('active');
                    hamburgerBtn.classList.remove('active');
                    if (window.innerWidth <= 1200) {
                        document.documentElement.classList.remove('nav-locked');
                        document.body.classList.remove('nav-locked');
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.width = '';
                        window.scrollTo(0, scrollPosition || 0);
                    }
                }
            });
        });

        // Footer 번역 적용
        this.updateFooterTranslation();
        requestAnimationFrame(() => this.initNavScrollThumb());
    }

    static initNavScrollThumb() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;

        let thumb = nav.querySelector('.nav-scroll-thumb');
        if (!thumb) {
            thumb = document.createElement('div');
            thumb.className = 'nav-scroll-thumb';
            thumb.setAttribute('aria-hidden', 'true');
            nav.appendChild(thumb);
        }

        const getThumbMetrics = () => {
            const scrollHeight = nav.scrollHeight;
            const clientHeight = nav.clientHeight;
            const maxScroll = scrollHeight - clientHeight;
            const hasScroll = maxScroll > 0;
            const minThumbHeight = 32;
            const thumbHeight = hasScroll
                ? Math.max(minThumbHeight, Math.round((clientHeight / scrollHeight) * clientHeight))
                : 0;

            return {
                hasScroll,
                maxScroll,
                thumbHeight,
                maxThumbTop: Math.max(clientHeight - thumbHeight, 0)
            };
        };

        let dragState = null;

        const updateThumb = () => {
            if (!nav.isConnected || !thumb.isConnected) return;

            const { hasScroll, maxScroll, thumbHeight, maxThumbTop } = getThumbMetrics();
            nav.classList.toggle('has-scroll', hasScroll);
            const navRect = nav.getBoundingClientRect();
            const thumbLeft = Math.round(navRect.right - 11);

            if (!hasScroll || navRect.width <= 0 || navRect.height <= 0) {
                thumb.style.display = 'none';
                thumb.style.height = '0';
                thumb.style.top = `${Math.round(navRect.top)}px`;
                thumb.style.left = `${thumbLeft}px`;
                return;
            }

            const thumbTop = maxThumbTop > 0 ? Math.round((nav.scrollTop / maxScroll) * maxThumbTop) : 0;

            thumb.style.display = 'block';
            thumb.style.height = `${thumbHeight}px`;
            thumb.style.top = `${Math.round(navRect.top + thumbTop)}px`;
            thumb.style.left = `${thumbLeft}px`;
        };

        const syncScrollToPointer = (clientY) => {
            if (!dragState) return;

            const { hasScroll, maxScroll, maxThumbTop } = getThumbMetrics();
            if (!hasScroll) return;

            const navRect = nav.getBoundingClientRect();
            const thumbTop = Math.min(
                Math.max(clientY - navRect.top - dragState.pointerOffsetY, 0),
                maxThumbTop
            );

            nav.scrollTop = maxThumbTop > 0
                ? (thumbTop / maxThumbTop) * maxScroll
                : 0;
            updateThumb();
        };

        const endThumbDrag = (pointerId) => {
            if (!dragState || (pointerId !== undefined && dragState.pointerId !== pointerId)) {
                return;
            }

            const activePointerId = dragState.pointerId;
            dragState = null;
            nav.classList.remove('is-scroll-dragging');
            thumb.classList.remove('is-dragging');

            if (typeof thumb.hasPointerCapture === 'function' && thumb.hasPointerCapture(activePointerId)) {
                thumb.releasePointerCapture(activePointerId);
            }

            requestAnimationFrame(updateThumb);
        };

        updateThumb();

        if (!nav.hasAttribute('data-scroll-thumb-bound')) {
            nav.addEventListener('scroll', updateThumb, { passive: true });
            nav.addEventListener('click', () => requestAnimationFrame(updateThumb));
            nav.addEventListener('mouseenter', updateThumb);
            nav.addEventListener('mousemove', updateThumb);
            nav.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'width') {
                    updateThumb();
                }
            });

            thumb.addEventListener('pointerdown', (event) => {
                if (event.pointerType === 'mouse' && event.button !== 0) {
                    return;
                }

                updateThumb();
                if (thumb.style.display === 'none') {
                    return;
                }

                const thumbRect = thumb.getBoundingClientRect();
                dragState = {
                    pointerId: event.pointerId,
                    pointerOffsetY: Math.min(
                        Math.max(event.clientY - thumbRect.top, 0),
                        thumbRect.height || 0
                    )
                };

                nav.classList.add('is-scroll-dragging');
                thumb.classList.add('is-dragging');

                if (typeof thumb.setPointerCapture === 'function') {
                    thumb.setPointerCapture(event.pointerId);
                }

                event.preventDefault();
                event.stopPropagation();
                syncScrollToPointer(event.clientY);
            });

            thumb.addEventListener('pointermove', (event) => {
                if (!dragState || dragState.pointerId !== event.pointerId) {
                    return;
                }

                event.preventDefault();
                syncScrollToPointer(event.clientY);
            });

            thumb.addEventListener('pointerup', (event) => {
                endThumbDrag(event.pointerId);
            });
            thumb.addEventListener('pointercancel', (event) => {
                endThumbDrag(event.pointerId);
            });
            thumb.addEventListener('lostpointercapture', () => {
                endThumbDrag();
            });
            window.addEventListener('resize', updateThumb);
            window.addEventListener('load', updateThumb);
            nav.setAttribute('data-scroll-thumb-bound', 'true');
        }
    }

    // 현재 언어 감지 함수
    static getCurrentLanguage() {
        const pathLang = window.location.pathname.split('/')[1];
        if (['kr', 'en', 'jp', 'cn'].includes(pathLang)) {
            return pathLang;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['kr', 'en', 'jp', 'cn'].includes(urlLang)) {
            return urlLang;
        }

        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && ['kr', 'en', 'jp', 'cn'].includes(savedLang)) {
            return savedLang;
        }

        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('ko')) return 'kr';
        if (browserLang.startsWith('ja')) return 'jp';
        if (browserLang.startsWith('zh')) return 'cn';
        if (browserLang.startsWith('en')) return 'en';

        return 'kr';
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 언어 선택 함수
    static async selectLanguage(lang, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }

        const safeLang = ['kr', 'en', 'jp', 'cn'].includes(String(lang || '').toLowerCase())
            ? String(lang).toLowerCase()
            : 'kr';

        const optionsContainer = document.querySelector('.options-container');
        if (optionsContainer) {
            optionsContainer.classList.remove('active');
        }

        localStorage.setItem('preferredLanguage', safeLang);
        localStorage.setItem('preferred_language', safeLang);

        const currentUrl = new URL(window.location.href);
        const currentPath = currentUrl.pathname;
        const currentParams = new URLSearchParams(currentUrl.search);
        currentParams.delete('lang');
        currentParams.delete('v');
        currentParams.delete('weapon');

        let nextPath = currentPath;
        const langPrefixMatch = currentPath.match(/^\/(kr|en|jp|cn)(\/.*)?$/i);

        if (langPrefixMatch) {
            const remainingPath = langPrefixMatch[2] || '/';
            nextPath = `/${safeLang}${remainingPath}`;
        } else if (currentPath === '/') {
            nextPath = `/${safeLang}/`;
        } else {
            const isDetailFallback = /^\/character\.html$/i.test(currentPath) || /^\/article\/view\/?$/i.test(currentPath);
            if (!isDetailFallback) {
                nextPath = `/${safeLang}${currentPath}`;
            }
        }

        const query = currentParams.toString();
        const hash = currentUrl.hash || '';
        window.location.href = `${nextPath}${query ? `?${query}` : ''}${hash}`;
    }

    static initSwordAnimation() {
        const isPc = () => window.innerWidth > 1440;

        const createSwordAnimation = (element, href) => {
            const sword = document.createElement('div');
            sword.className = 'sword-animation';

            const rect = element.getBoundingClientRect();
            const navRect = document.querySelector('.main-nav').getBoundingClientRect();

            sword.style.top = `${rect.top + (rect.height - 32) / 2}px`;
            sword.style.left = `${navRect.left + navRect.width - 48}px`;

            document.body.appendChild(sword);

            setTimeout(() => {
                window.location.href = href;
            }, 300);
        };

        // nav-section-item sword animation
        document.querySelectorAll('.nav-section-item').forEach(item => {
            if (!item.closest('.language-selector-container')) {
                item.addEventListener('click', function (e) {
                    if (!this.classList.contains('active')) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        const href = this.getAttribute('href');

                        if (isPc()) {
                            createSwordAnimation(this, href);
                        } else {
                            window.location.href = href;
                        }
                    }
                });
            }
        });
    }

    // Footer 번역 함수
    static updateFooterTranslation() {
        const currentLang = Navigation.getCurrentLanguage();

        const footerTranslations = {
            kr: {
                disclaimer: "※ 루페르넷은 개인이 만든 비공식 페르소나5X 정보 제공 사이트로 게임의 콘텐츠와 소재의 트레이드마크와 저작권은 SEGA·ATLUS·Perfect World Games에 있습니다.",
                contact: `✉️ contact : superphil722@gmail.com　💬 <a href="https://discord.gg/8S8pnv2MsH" target="_blank" class="discord-link">Discord</a>　@루트　<a href="/about/">사이트 지원</a>`
            },
            en: {
                disclaimer: "※ LufelNet is an unofficial Persona 5X information site created by individuals. The trademarks and copyrights of game content and materials belong to SEGA·ATLUS·Perfect World Games.",
                contact: `✉️ contact : superphil722@gmail.com　💬 <a href="https://discord.gg/8S8pnv2MsH" target="_blank" class="discord-link">Discord</a>　@AbsolRoot　<a href="/about/" target="_blank" class="discord-link">Support</a>　<a href="https://lufel.net/privacy.html" class="privacy-link">Privacy Policy</a>
`
            },
            jp: {
                disclaimer: "※ ルフェルネットは個人が作成した非公式ペルソナ5X情報提供サイトで、ゲームのコンテンツと素材の商標と著作権はSEGA·ATLUS·Perfect World Gamesに帰属します。",
                contact: `✉️ contact : superphil722@gmail.com　💬 <a href="https://discord.gg/8S8pnv2MsH" target="_blank" class="discord-link">Discord</a>　@AbsolRoot　<a href="/about/" target="_blank" class="discord-link">Support</a>　`
            },
            cn: {
                disclaimer: "※ 路菲尔网是由个人制作的非官方《女神异闻录5X》信息站。游戏内容与素材的商标及版权归 SEGA·ATLUS·Perfect World Games 所有。",
                contact: `✉️ contact : superphil722@gmail.com　💬 <a href="https://discord.gg/8S8pnv2MsH" target="_blank" class="discord-link">Discord</a>　@AbsolRoot　<a href="/cn/about/" target="_blank" class="discord-link">支持网站</a>　`
            }
        };

        const translation = footerTranslations[currentLang];
        if (!translation) return;

        const disclaimerElement = document.getElementById('footer-disclaimer');
        const contactElement = document.getElementById('footer-contact');

        if (disclaimerElement) {
            disclaimerElement.innerHTML = translation.disclaimer;
        }
        if (contactElement) {
            contactElement.innerHTML = translation.contact;
        }
    }
}
