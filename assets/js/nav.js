class Navigation {
    static async load(activePage) {
        // 현재 언어 감지
        const currentLang = this.getCurrentLanguage();

        // 모바일 헤더 추가
        const mobileHeader = document.createElement('div');
        mobileHeader.className = 'mobile-header';
        document.body.insertBefore(mobileHeader, document.body.firstChild);

        // 로고 컨테이너 추가
        const logoContainer = document.createElement('div');
        logoContainer.className = 'mobile-logo-container';
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
                home: '홈',
                character: '캐릭터',
                persona: '페르소나',
                revelations: '계시',
                revelationsInfo: '계시 정보',
                revelationSetting: '계시 공유',
                synergy: '협력자',
                wonderweapon: '원더 무기',
                tactic: '택틱',
                tacticMaker: '택틱 메이커',
                tacticLibrary: '택틱 도서관',
                tier: '티어',
                tierMaker: '티어 메이커',
                tierList: '티어 리스트',
                calculator: '계산기',
                materialCalc: '육성 계산기',
                payCalc: '과금 계산기',
                defenseCalc: '방어력 계산기',
                criticalCalc: '크리티컬 계산기',
                maps: '지도',
                astrolabe: '성좌의 시련',
                pullTracker: '계약',
                pullTracker_individual: '개인 통계',
                pullTracker_global: '전체 통계',
                schedule: '스케줄',
                scheduleRelease: '출시 일정',
                pullPlanner: '계약 플래너',
                article: '가이드',
                gallery: '갤러리',
                about: 'about'
            },
            en: {
                home: 'Home',
                character: 'Character',
                persona: 'Persona',
                revelations: 'Revelations',
                revelationsInfo: 'Card Info',
                revelationSetting: 'Revelation Share',
                synergy: 'Synergy',
                wonderweapon: 'Wonder Daggers',
                maps: 'Maps',
                astrolabe: 'Astrolabe',
                tactic: 'Tactics',
                tacticMaker: 'Tactic Maker',
                tacticForge: 'Tactics Forge',
                tacticLibrary: 'Tactics Library',
                tier: 'Tiers',
                tierMaker: 'Tier Maker',
                tierList: 'Tier List',
                calculator: 'Calculator',
                materialCalc: 'Progression',
                payCalc: 'Payment Calculator',
                defenseCalc: 'Defense Reduction',
                criticalCalc: 'Critical Rate',
                pullTracker: 'Pull',
                pullTracker_individual: 'Individual Stats',
                pullTracker_global: 'Global Stats',
                schedule: 'Schedule',
                scheduleRelease: 'Release Schedule',
                pullPlanner: 'Pull Planner',
                article: 'Guides',
                gallery: 'Gallery',
                about: 'About'
            },
            jp: {
                home: 'ホーム',
                character: '怪盗',
                persona: 'ペルソナ',
                revelations: '啓示',
                revelationsInfo: '啓示情報',
                revelationSetting: '啓示共有',
                synergy: 'シナジー',
                wonderweapon: 'ワンダー武器',
                maps: '地図',
                astrolabe: 'アストロラーベ',
                tactic: 'タクティクス',
                tacticMaker: 'タクティクスメーカー',
                tacticForge: 'タクティック鍛冶場',
                tacticLibrary: 'タクティクスライブラリー',
                tier: 'ティア',
                tierMaker: 'ティアメーカー',
                tierList: 'ティアリスト',
                calculator: '計算機',
                materialCalc: '育成',
                payCalc: '課金',
                defenseCalc: '防御力減少',
                criticalCalc: 'クリティカル',
                pullTracker: 'ガチャ',
                pullTracker_individual: '個人統計',
                pullTracker_global: '全体統計',
                schedule: 'スケジュール',
                scheduleRelease: 'リリース',
                pullPlanner: 'ガチャプランナー',
                article: 'ガイド',
                gallery: 'ギャラリー',
                about: '紹介'
            },
            cn: {
                home: '首页',
                character: '角色',
                persona: '面具',
                revelations: '觉醒',
                revelationsInfo: '觉醒信息',
                revelationSetting: '觉醒分享',
                maps: '地图',
                astrolabe: '天域星盘',
                tactic: '战术',
                tacticMaker: '战术制作',
                tacticForge: '战术锻造',
                tier: '梯队 (beta)',
                tierMaker: '梯队制作',
                calculator: '计算器',
                payCalc: '充值计算器',
                defenseCalc: '防御力计算器',
                criticalCalc: '暴击计算机',
                article: '指南',
                about: '关于'
            }
        };

        // 현재 언어의 텍스트 가져오기
        const texts = i18n[currentLang] || i18n.kr;

        const availableMenus = {
            kr: ['character', 'persona', 'revelations', 'synergy', 'wonderweapon', 'maps', 'astrolabe', 'calculator', 'tactic', 'article', 'pullTracker', 'tier', 'gallery', 'about'],
            en: ['character', 'persona', 'revelations', 'synergy', 'wonderweapon', 'maps', 'astrolabe', 'calculator', 'tactic', 'article', 'pullTracker', 'tier', 'gallery', 'about'],
            jp: ['character', 'persona', 'revelations', 'synergy', 'wonderweapon', 'maps', 'astrolabe', 'calculator', 'tactic', 'article', 'pullTracker', 'tier', 'gallery', 'about'],
            cn: ['character', 'article', 'about']
        };

        const currentMenus = availableMenus[currentLang] || availableMenus.kr;

        const navTemplate = `
            <nav class="main-nav">
                <div class="logo-container">
                    <img src="${BASE_URL}/assets/img/logo/lufel.webp" alt="logo" />
                    <img src="${BASE_URL}/assets/img/logo/lufelnet.png" alt="logo-text" />
                </div>
                ${currentMenus.includes('home') ? `
                <a href="${BASE_URL}/${currentLang}/" class="nav-link" data-nav="home">
                    <img src="${BASE_URL}/assets/img/nav/home.png" alt="home" style="width: 28px; height: 28px; object-fit: contain;" />
                    <span data-text="${texts.home}">${texts.home}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('character') ? `
                <a href="${BASE_URL}/${currentLang}/character/" class="nav-link" data-nav="character">
                    <img src="${BASE_URL}/assets/img/nav/guaidao.png" alt="guaidao" style="width: 28px; height: 28px; object-fit: contain;" />
                    <span data-text="${texts.character}">${texts.character}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('persona') ? `
                <a href="${BASE_URL}/${currentLang}/persona/" class="nav-link" data-nav="persona">
                    <img src="${BASE_URL}/assets/img/nav/persona.png" alt="persona" style="width: 28px; height: 28px; object-fit: contain;" />
                    <span data-text="${texts.persona}">${texts.persona}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('revelations') ? `
                <div class="nav-item has-submenu" data-nav="revelations">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/qishi.png" alt="qishi" style="width: 28px; height: 28px; object-fit: contain;" />
                        <span data-text="${texts.revelations}">${texts.revelations}</span>
                    </div>
                    <div class="submenu">
                        <a href="${BASE_URL}/${currentLang}/revelations/" class="nav-sub-item" data-nav="revelations-info">
                            <span data-text="${texts.revelationsInfo}">◈　${texts.revelationsInfo}</span>
                        </a>
                        <a href="${BASE_URL}/${currentLang}/revelation-setting/" class="nav-sub-item" data-nav="revelation-setting">
                            <span data-text="${texts.revelationSetting}">◈　${texts.revelationSetting}</span>
                        </a>
                    </div>
                </div>
                ` : ''}
                ${currentMenus.includes('synergy') ? `
                <a href="${BASE_URL}/${currentLang}/synergy/" class="nav-link" data-nav="synergy">
                    <img src="${BASE_URL}/assets/img/nav/synergy.png" alt="synergy" style="width: 28px; height: 28px; object-fit: contain;" />
                    <span data-text="${texts.synergy}">${texts.synergy}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('wonderweapon') ? `
                <a href="${BASE_URL}/${currentLang}/wonder-weapon/" class="nav-link" data-nav="wonderweapon">
                    <img src="${BASE_URL}/assets/img/nav/wonder-weapon.png" alt="wonderweapon" style="width: 28px; height: 28px; object-fit: contain;" />
                    <span data-text="${texts.wonderweapon}">${texts.wonderweapon}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('maps') ? `
                <a href="${BASE_URL}/${currentLang}/maps/" class="nav-link" data-nav="maps">
                    <img src="${BASE_URL}/assets/img/nav/maps.png" alt="maps" style="width: 28px; height: 28px; object-fit: contain;" />
                    <span data-text="${texts.maps}">${texts.maps}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('astrolabe') ? `
                <a href="${BASE_URL}/${currentLang}/astrolabe/" class="nav-link" data-nav="astrolabe">
                    <img src="${BASE_URL}/assets/img/nav/astrolabe.png" alt="astrolabe" style="width: 28px; height: 28px; object-fit: contain;" />
                    <span data-text="${texts.astrolabe}">${texts.astrolabe}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('pullTracker') ? `
                <div class="nav-item has-submenu" data-nav="pullTracker">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/pull.png" alt="pullTracker" style="width: 28px; height: 28px; object-fit: contain;" />
                        <span data-text="${texts.pullTracker}">${texts.pullTracker}</span>
                    </div>
                    <div class="submenu">
                        ${currentLang !== 'kr' ? `
                        <a href="${BASE_URL}/${currentLang}/schedule/" class="nav-sub-item" data-nav="schedule-release">
                            <span data-text="${texts.scheduleRelease}">◈　${texts.scheduleRelease}</span>
                        </a>
                        <a href="${BASE_URL}/${currentLang}/pull-calc/" class="nav-sub-item" data-nav="pull-calc">
                            <span data-text="${texts.pullPlanner}">◈　${texts.pullPlanner}</span>
                        </a>
                        ` : ''}
                        <a href="${BASE_URL}/${currentLang}/pull-tracker/" class="nav-sub-item" data-nav="pullTracker_individual">
                            <span data-text="${texts.pullTracker_individual}">◈　${texts.pullTracker_individual}</span>
                        </a>
                        <a href="${BASE_URL}/${currentLang}/pull-tracker/global-stats/" class="nav-sub-item" data-nav="pullTracker_global">
                            <span data-text="${texts.pullTracker_global}">◈　${texts.pullTracker_global}</span>
                        </a>
                    </div>
                </div>
                ` : ''}
                ${currentMenus.includes('calculator') ? `
                <div class="nav-item has-submenu" data-nav="calculator">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/calculator.png" alt="calculator" style="width: 28px; height: 28px; object-fit: contain;" />
                        <span data-text="${texts.calculator}">${texts.calculator}</span>
                    </div>
                    <div class="submenu">
                        <a href="${BASE_URL}/${currentLang}/material-calc/" class="nav-sub-item" data-nav="material-calc">
                            <span data-text="${texts.materialCalc}">◈　${texts.materialCalc}</span>
                        </a>
                        <a href="${BASE_URL}/${currentLang}/defense-calc/" class="nav-sub-item" data-nav="defense-calc">
                            <span data-text="${texts.defenseCalc}">◈　${texts.defenseCalc}</span>
                        </a>
                        <a href="${BASE_URL}/${currentLang}/critical-calc/" class="nav-sub-item" data-nav="critical-calc">
                            <span data-text="${texts.criticalCalc}">◈　${texts.criticalCalc}</span>
                        </a>
                        ${currentLang === 'kr' ? `
                        <a href="${BASE_URL}/${currentLang}/pay-calc/" class="nav-sub-item" data-nav="pay-calc">
                            <span data-text="${texts.payCalc}">◈　${texts.payCalc}</span>
                        </a>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
                ${currentMenus.includes('tactic') ? `
                <div class="nav-item has-submenu" data-nav="tactic">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/tactic.png" alt="tactic" style="width: 28px; height: 28px; object-fit: contain;" />
                        <span data-text="${texts.tactic}">${texts.tactic}</span>
                    </div>
                    <div class="submenu">
                        <a href="${BASE_URL}/${currentLang}/tactic-maker/" class="nav-sub-item" data-nav="tactic-maker">
                            <span data-text="${texts.tacticMaker}">◈　${texts.tacticMaker}</span>
                        </a>
                        <a href="${BASE_URL}/${currentLang}/tactic/library/" class="nav-sub-item" data-nav="tactics">
                            <span data-text="${texts.tacticLibrary}">◈　${texts.tacticLibrary}</span>
                        </a>
                    </div>
                </div>
                ` : ''}
                ${currentMenus.includes('tactic-maker') ? `
                <a href="${BASE_URL}/${currentLang}/tactic/" class="nav-link" data-nav="tactic-maker">
                    <img src="${BASE_URL}/assets/img/nav/tactic.png" alt="tactic" style="width: 28px; height: 28px; object-fit: contain;" />
                    <span data-text="${texts.tacticMaker}">${texts.tacticMaker}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('article') ? `
                    <a href="${BASE_URL}/${currentLang}/article/" class="nav-link" data-nav="article">
                        <img src="${BASE_URL}/assets/img/nav/article.png" alt="article" style="width: 28px; height: 28px; object-fit: contain;" />
                        <span data-text="${texts.article}">${texts.article}</span>
                    </a>
                    ` : ''}
                ${currentMenus.includes('tier') ? `
                <div class="nav-item has-submenu" data-nav="tier">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/tier.png" alt="tier" style="width: 28px; height: 28px; object-fit: contain;" />
                        <span data-text="${texts.tier}">${texts.tier}</span>
                    </div>
                    <div class="submenu">
                        <a href="${BASE_URL}/${currentLang}/tier/" class="nav-sub-item" data-nav="tier-list">
                            <span data-text="${texts.tierList}">◈　${texts.tierList}</span>
                        </a>
                        <a href="${BASE_URL}/${currentLang}/tier-maker/" class="nav-sub-item" data-nav="tier-maker">
                            <span data-text="${texts.tierMaker}">◈　${texts.tierMaker}</span>
                        </a>
                    </div>
                </div>
                ` : ''}

                ${currentMenus.includes('gallery') ? `
                    <a href="${BASE_URL}/${currentLang}/gallery/" class="nav-link" data-nav="gallery">
                        <img src="${BASE_URL}/assets/img/nav/gallery.png" alt="gallery" style="width: 28px; height: 28px; object-fit: contain;" />
                        <span data-text="${texts.gallery}">${texts.gallery}</span>
                    </a>
                    ` : ''}
                ${currentMenus.includes('about') ? `
                <a href="${BASE_URL}/${currentLang}/about/" class="nav-link" data-nav="about">
                    <img src="${BASE_URL}/assets/img/nav/about.png" alt="about" style="width: 28px; height: 28px; object-fit: contain;" />
                    <span data-text="${texts.about}">${texts.about}</span>
                </a>
                ` : ''}
                
                <div class="nav-spacer"></div>
                <div class="nav-bg"></div>
                <!-- language selector -->
                <div class="language-selector-container">
                    <div class="custom-select">
                        <div class="selected-option">
                            <img src="${BASE_URL}/assets/img/flags/${currentLang}.png" alt="${currentLang}" class="flag-icon">
                            <span>${currentLang === 'kr' ? '한국어' : currentLang === 'en' ? 'English' : currentLang === 'jp' ? '日本語' : '中文'}</span>
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
                            <!--
                            <div class="option ${currentLang === 'cn' ? 'selected' : ''} disabled" data-value="cn" role="button" tabindex="0" onclick="return false;">
                                <img src="${BASE_URL}/assets/img/flags/cn.png" alt="cn" class="flag-icon">
                                <span>中文 (Not Yet)</span>
                            </div>
                            -->
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
        this.initNavScrollThumb();

        // 먼저 sword animation 초기화
        this.initSwordAnimation();

        // 그 다음 이벤트 리스너 등록
        if (!document.querySelector('.logo-container').hasAttribute('data-event-bound')) {
            // 로고 클릭 이벤트 처리
            document.querySelector('.logo-container').addEventListener('click', () => {
                window.location.href = `${BASE_URL}/${currentLang}/`;
            });
            document.querySelector('.logo-container').setAttribute('data-event-bound', 'true');
        }

        if (!document.querySelector('.mobile-logo-container').hasAttribute('data-event-bound')) {
            // 모바일 로고 클릭 이벤트 처리
            document.querySelector('.mobile-logo-container').addEventListener('click', () => {
                window.location.href = `${BASE_URL}/${currentLang}/`;
            });
            document.querySelector('.mobile-logo-container').setAttribute('data-event-bound', 'true');
        }

        if (!document.querySelector('.selected-option').hasAttribute('data-event-bound')) {
            // 언어 드롭다운 토글 이벤트 처리
            document.querySelector('.selected-option').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const optionsContainer = document.querySelector('.options-container');
                optionsContainer.classList.toggle('active');
            });
            document.querySelector('.selected-option').setAttribute('data-event-bound', 'true');
        }

        // 언어 선택 옵션 이벤트 처리
        document.querySelectorAll('.language-selector-container .option').forEach(option => {
            if (!option.hasAttribute('data-event-bound')) {
                option.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    // 비활성화된 언어는 선택 불가능하게 처리
                    if (this.classList.contains('disabled')) {
                        return;
                    }

                    const lang = this.getAttribute('data-value');
                    Navigation.selectLanguage(lang, e);
                });
                option.setAttribute('data-event-bound', 'true');
            }
        });

        // PC nav toggle button event handler
        const navToggleBtn = document.querySelector('.nav-toggle-btn');
        if (navToggleBtn && !navToggleBtn.hasAttribute('data-event-bound')) {
            navToggleBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const mainNav = document.querySelector('.main-nav');
                const body = document.body;

                if (mainNav.classList.contains('nav-pinned')) {
                    // Close: remove pinned state
                    mainNav.classList.remove('nav-pinned');
                    body.classList.remove('nav-expanded');
                    localStorage.setItem('navPinned', 'false');
                } else {
                    // Open: add pinned state
                    mainNav.classList.add('nav-pinned');
                    body.classList.add('nav-expanded');
                    localStorage.setItem('navPinned', 'true');
                }
            });
            navToggleBtn.setAttribute('data-event-bound', 'true');
        }

        // Restore nav pinned state from localStorage (PC only)
        if (window.innerWidth > 1440) {
            const navPinned = localStorage.getItem('navPinned');
            // Default to true (expanded) if null or explicitly 'true'
            if (navPinned !== 'false') {
                document.querySelector('.main-nav')?.classList.add('nav-pinned');
                document.body.classList.add('nav-expanded');
            }
        }

        if (activePage) {
            const activeItem = document.querySelector(`[data-nav="${activePage}"]`);
            if (activeItem) {
                activeItem.classList.add('active');

                // 서브메뉴 아이템인 경우
                if (activeItem.classList.contains('nav-sub-item')) {
                    // 부모 메뉴 활성화
                    const parentMenu = activeItem.closest('.has-submenu');
                    if (parentMenu) {
                        parentMenu.classList.add('active');
                    }
                }
            }

            // 계시 관련 페이지인 경우 추가 처리
            if (activePage === 'revelations' || activePage === 'revelations-info' || activePage === 'revelation-setting') {
                const revelationsMenu = document.querySelector('[data-nav="revelations"]');
                if (revelationsMenu) {
                    revelationsMenu.classList.add('active');

                    // 현재 활성화된 서브메뉴 아이템 찾기
                    let activeSubItem;
                    if (activePage === 'revelation-setting') {
                        activeSubItem = document.querySelector('[data-nav="revelation-setting"]');
                    } else {
                        activeSubItem = document.querySelector('[data-nav="revelations-info"]');
                    }

                    if (activeSubItem) {
                        // 다른 서브메뉴 아이템의 active 클래스 제거
                        document.querySelectorAll('.nav-sub-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        // 현재 서브메뉴 아이템 활성화
                        activeSubItem.classList.add('active');
                    }
                }
            }

            // 택틱 관련 페이지인 경우 추가 처리
            if (activePage === 'tactic' || activePage === 'tactic-maker' || activePage === 'tactics') {
                const tacticMenu = document.querySelector('[data-nav="tactic"]');
                if (tacticMenu) {
                    tacticMenu.classList.add('active');

                    // 현재 활성화된 서브메뉴 아이템 찾기
                    let activeSubItem;
                    if (activePage === 'tactic' || activePage === 'tactic-maker') {
                        activeSubItem = document.querySelector('[data-nav="tactic-maker"]');
                    } else if (activePage === 'tactics') {
                        activeSubItem = document.querySelector('[data-nav="tactics"]');
                    }

                    if (activeSubItem) {
                        // 다른 서브메뉴 아이템의 active 클래스 제거
                        document.querySelectorAll('.nav-sub-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        // 현재 서브메뉴 아이템 활성화
                        activeSubItem.classList.add('active');
                    }
                }
            }

            // 계산기 관련 페이지인 경우 추가 처리
            if (activePage === 'pay-calc' || activePage === 'defense-calc' || activePage === 'critical-calc' || activePage === 'material-calc') {
                const calculatorMenu = document.querySelector('[data-nav="calculator"]');
                if (calculatorMenu) {
                    calculatorMenu.classList.add('active');

                    // 현재 활성화된 서브메뉴 아이템 찾기
                    let activeSubItem = document.querySelector(`[data-nav="${activePage}"]`);

                    if (activeSubItem) {
                        // 다른 서브메뉴 아이템의 active 클래스 제거
                        document.querySelectorAll('.nav-sub-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        // 현재 서브메뉴 아이템 활성화
                        activeSubItem.classList.add('active');
                    }
                }
            }

            // 스케줄 관련 페이지인 경우 추가 처리
            if (activePage === 'schedule' || activePage === 'schedule-release' || activePage === 'pull-calc') {
                const scheduleMenu = document.querySelector('[data-nav="schedule"]');
                if (scheduleMenu) {
                    scheduleMenu.classList.add('active');

                    // 현재 활성화된 서브메뉴 아이템 찾기
                    let activeSubItem;
                    if (activePage === 'schedule' || activePage === 'schedule-release') {
                        activeSubItem = document.querySelector('[data-nav="schedule-release"]');
                    } else if (activePage === 'pull-calc') {
                        activeSubItem = document.querySelector('[data-nav="pull-calc"]');
                    }

                    if (activeSubItem) {
                        // 다른 서브메뉴 아이템의 active 클래스 제거
                        document.querySelectorAll('.nav-sub-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        // 현재 서브메뉴 아이템 활성화
                        activeSubItem.classList.add('active');
                    }
                }
            }
        }

        // 스크롤 이벤트 처리
        let lastScroll = 0;
        // 모바일 바디 스크롤 잠금용 저장 변수
        let scrollPosition = 0;

        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 1440) {  // 1440px under
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

        // 햄버거 메뉴 이벤트 리스너
        hamburgerBtn.addEventListener('click', () => {
            const nav = document.querySelector('.main-nav');
            const header = document.querySelector('.mobile-header');

            const willOpen = !hamburgerBtn.classList.contains('active');

            hamburgerBtn.classList.toggle('active');
            nav.classList.toggle('active');
            header.classList.toggle('active');

            if (willOpen) {
                // iOS에서 가끔 scrollTop=0이 먹기 전에 그려져서 두 번 처리
                nav.style.webkitOverflowScrolling = 'auto';
                nav.scrollTop = 0;
                void nav.offsetHeight;                       // 강제 리플로우
                nav.style.webkitOverflowScrolling = 'touch';

                // 768px 이하에서 배경 스크롤 잠금 (CSS와 임계값 일치)
                if (window.innerWidth <= 768) {
                    scrollPosition = window.scrollY || window.pageYOffset;
                    document.documentElement.classList.add('nav-locked');
                    document.body.classList.add('nav-locked');
                    // 현재 스크롤 위치 고정
                    document.body.style.top = `-${scrollPosition}px`;
                    document.body.style.position = 'fixed';
                    document.body.style.width = '100%';
                }
            } else {
                // 닫을 때 잠금 해제 (모바일 전용, 768px 이하)
                if (window.innerWidth <= 768) {
                    document.documentElement.classList.remove('nav-locked');
                    document.body.classList.remove('nav-locked');
                    // 원래 위치로 복원
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    window.scrollTo(0, scrollPosition || 0);
                }
            }
        });

        // 모바일에서 메뉴 아이템 클릭시 메뉴 닫기
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 1440) {  // 1440px 이하에서 작동하도록 수정
                    const nav = document.querySelector('.main-nav');
                    const hamburgerBtn = document.querySelector('.hamburger-btn');
                    nav.classList.remove('active');
                    hamburgerBtn.classList.remove('active');
                    // 잠금 해제는 모바일(<=1200px)에서만
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

        // 메인 메뉴 클릭 이벤트 처리
        document.querySelectorAll('.has-submenu .nav-main-item').forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const submenu = this.closest('.has-submenu');
                submenu.classList.toggle('active');
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

        const updateThumb = () => {
            if (!nav.isConnected || !thumb.isConnected) return;

            const scrollHeight = nav.scrollHeight;
            const clientHeight = nav.clientHeight;
            const maxScroll = scrollHeight - clientHeight;
            const hasScroll = maxScroll > 0;
            nav.classList.toggle('has-scroll', hasScroll);
            const navRect = nav.getBoundingClientRect();
            const thumbLeft = Math.round(navRect.right - 8);

            if (!hasScroll || navRect.width <= 0 || navRect.height <= 0) {
                thumb.style.display = 'none';
                thumb.style.height = '0';
                thumb.style.top = `${Math.round(navRect.top)}px`;
                thumb.style.left = `${thumbLeft}px`;
                return;
            }

            const minThumbHeight = 32;
            const thumbHeight = Math.max(minThumbHeight, Math.round((clientHeight / scrollHeight) * clientHeight));
            const maxTop = clientHeight - thumbHeight;
            const thumbTop = maxTop > 0 ? Math.round((nav.scrollTop / maxScroll) * maxTop) : 0;

            thumb.style.display = 'block';
            thumb.style.height = `${thumbHeight}px`;
            thumb.style.top = `${Math.round(navRect.top + thumbTop)}px`;
            thumb.style.left = `${thumbLeft}px`;
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
        const isPc = () => window.innerWidth > 1440;  // PC 1440px

        // sword animation 생성 함수
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

        // nav-link - sword animation
        document.querySelectorAll('.nav-link').forEach(item => {
            // 언어 선택 옵션이 아닌 경우에만 이벤트 처리
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

        // 서브메뉴 아이템에 대한 이벤트 처리
        document.querySelectorAll('.nav-sub-item').forEach(item => {
            // 언어 선택 옵션이 아닌 경우에만 이벤트 처리
            if (!item.closest('.language-selector-container')) {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const href = this.getAttribute('href');

                    if (isPc()) {
                        createSwordAnimation(this, href);
                    } else {
                        window.location.href = href;
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
            }
        };

        const translation = footerTranslations[currentLang];
        if (!translation) return;

        // Footer 요소들 업데이트
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
