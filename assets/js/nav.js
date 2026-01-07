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
                pullTracker: '계약 트래커',
                pullTracker_individual: '개인 통계',
                pullTracker_global: '전체 통계',
                article: '가이드',
                gallery: '갤러리',
                about: 'about'
            },
            en: {
                home: 'Home',
                character: 'Character',
                persona: 'Persona',
                revelations: 'Revelations',
                wonderweapon: 'Wonder Daggers',
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
                pullTracker: 'Pull Tracker',
                pullTracker_individual: 'Individual Stats',
                pullTracker_global: 'Global Stats',
                article: 'Guides',
                gallery: 'Gallery',
                about: 'About'
            },
            jp: {
                home: 'ホーム',
                character: '怪盗',
                persona: 'ペルソナ',
                revelations: '啓示',
                wonderweapon: 'ワンダー武器',
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
                pullTracker: 'ガチャ履歴',
                pullTracker_individual: '個人統計',
                pullTracker_global: '全体統計',
                article: 'ガイド',
                gallery: 'ギャラリー',
                about: '紹介'
            },
            cn: {
                home: '首页',
                character: '角色',
                persona: '面具',
                revelations: '觉醒',
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

        // 언어별 표시할 메뉴 정의 (한국어는 모든 메뉴, 영어/일본어는 제한된 메뉴)
        const availableMenus = {
            kr: ['character', 'persona', 'revelations', 'wonderweapon', 'calculator', 'tactic', 'article', 'pullTracker', 'tier', 'gallery', 'about'],
            en: ['character', 'persona', 'revelations', 'wonderweapon', 'calculator', 'tactic', 'article', 'pullTracker', 'tier', 'gallery', 'about'],
            jp: ['character', 'persona', 'revelations', 'wonderweapon', 'calculator', 'tactic', 'article', 'pullTracker', 'tier', 'gallery', 'about'],
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
                <a href="${BASE_URL}/?lang=${currentLang}&v=${APP_VERSION}" class="nav-link" data-nav="home">
                    <img src="${BASE_URL}/assets/img/nav/home.png" alt="home" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.home}">${texts.home}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('character') ? `
                <a href="${BASE_URL}/character/?lang=${currentLang}&v=${APP_VERSION}" class="nav-link" data-nav="character">
                    <img src="${BASE_URL}/assets/img/nav/guaidao.png" alt="guaidao" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.character}">${texts.character}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('persona') ? `
                <a href="${BASE_URL}/persona?lang=${currentLang}&v=${APP_VERSION}" class="nav-link" data-nav="persona">
                    <img src="${BASE_URL}/assets/img/nav/persona.png" alt="persona" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.persona}">${texts.persona}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('revelations') ? `
                <a href="${BASE_URL}/revelations?lang=${currentLang}&v=${APP_VERSION}" class="nav-link" data-nav="revelations">
                    <img src="${BASE_URL}/assets/img/nav/qishi.png" alt="qishi" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.revelations}">${texts.revelations}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('wonderweapon') ? `
                <a href="${BASE_URL}/wonder-weapon?lang=${currentLang}&v=${APP_VERSION}" class="nav-link" data-nav="wonderweapon">
                    <img src="${BASE_URL}/assets/img/nav/wonder-weapon.png" alt="wonderweapon" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.wonderweapon}">${texts.wonderweapon}</span>
                </a>
                ` : ''}
                
                ${currentMenus.includes('pullTracker') ? `
                <div class="nav-item has-submenu" data-nav="pullTracker">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/pull.png" alt="pullTracker" style="width: 32px; height: 32px; object-fit: contain;" />
                        <span data-text="${texts.pullTracker}">${texts.pullTracker}</span>
                    </div>
                    <div class="submenu">
                        <a href="${BASE_URL}/pull-tracker?lang=${currentLang}&v=${APP_VERSION}" class="nav-sub-item" data-nav="pullTracker_individual">
                            <span data-text="${texts.pullTracker_individual}">◈　${texts.pullTracker_individual}</span>
                        </a>
                        <a href="${BASE_URL}/pull-tracker/global-stats?lang=${currentLang}&v=${APP_VERSION}" class="nav-sub-item" data-nav="pullTracker_global">
                            <span data-text="${texts.pullTracker_global}">◈　${texts.pullTracker_global}</span>
                        </a>
                    </div>
                </div>
                ` : ''}
                ${currentMenus.includes('calculator') ? `
                <div class="nav-item has-submenu" data-nav="calculator">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/calculator.png" alt="calculator" style="width: 32px; height: 32px; object-fit: contain;" />
                        <span data-text="${texts.calculator}">${texts.calculator}</span>
                    </div>
                    <div class="submenu">
                        <a href="${BASE_URL}/material-calc?lang=${currentLang}&v=${APP_VERSION}" class="nav-sub-item" data-nav="material-calc">
                            <span data-text="${texts.materialCalc}">◈　${texts.materialCalc}</span>
                        </a>
                        <a href="${BASE_URL}/defense-calc?lang=${currentLang}&v=${APP_VERSION}" class="nav-sub-item" data-nav="defense-calc">
                            <span data-text="${texts.defenseCalc}">◈　${texts.defenseCalc}</span>
                        </a>
                        <a href="${BASE_URL}/critical-calc?lang=${currentLang}&v=${APP_VERSION}" class="nav-sub-item" data-nav="critical-calc">
                            <span data-text="${texts.criticalCalc}">◈　${texts.criticalCalc}</span>
                        </a>
                        ${currentLang === 'kr' ? `
                        <a href="${BASE_URL}/pay-calc?lang=${currentLang}&v=${APP_VERSION}" class="nav-sub-item" data-nav="pay-calc">
                            <span data-text="${texts.payCalc}">◈　${texts.payCalc}</span>
                        </a>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
                ${currentMenus.includes('tactic') ? `
                <div class="nav-item has-submenu" data-nav="tactic">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/tactic.png" alt="tactic" style="width: 32px; height: 32px; object-fit: contain;" />
                        <span data-text="${texts.tactic}">${texts.tactic}</span>
                    </div>
                    <div class="submenu">
                        <a href="${BASE_URL}/tactic?lang=${currentLang}&v=${APP_VERSION}" class="nav-sub-item" data-nav="tactic-maker">
                            <span data-text="${texts.tacticMaker}">◈　${texts.tacticMaker}</span>
                        </a>
                        <a href="${BASE_URL}/tactic/tactics.html?lang=${currentLang}&v=${APP_VERSION}" class="nav-sub-item" data-nav="tactics">
                            <span data-text="${texts.tacticLibrary}">◈　${texts.tacticLibrary}</span>
                        </a>
                    </div>
                </div>
                ` : ''}
                ${currentMenus.includes('tactic-maker') ? `
                <a href="${BASE_URL}/tactic?lang=${currentLang}&v=${APP_VERSION}" class="nav-link" data-nav="tactic-maker">
                    <img src="${BASE_URL}/assets/img/nav/tactic.png" alt="tactic" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.tacticMaker}">${texts.tacticMaker}</span>
                </a>
                ` : ''}
                ${currentMenus.includes('article') ? `
                    <a href="${BASE_URL}/article/?lang=${currentLang}&v=${APP_VERSION}" class="nav-link" data-nav="article">
                        <img src="${BASE_URL}/assets/img/nav/article.png" alt="article" style="width: 32px; height: 32px; object-fit: contain;" />
                        <span data-text="${texts.article}">${texts.article}</span>
                    </a>
                    ` : ''}
                ${currentMenus.includes('tier') ? `
                <div class="nav-item has-submenu" data-nav="tier">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/tier.png" alt="tier" style="width: 32px; height: 32px; object-fit: contain;" />
                        <span data-text="${texts.tier}">${texts.tier}</span>
                    </div>
                    <div class="submenu">
                        <a href="${BASE_URL}/tier/position-tier/?lang=${currentLang}&v=${APP_VERSION}" class="nav-sub-item" data-nav="tier-list">
                            <span data-text="${texts.tierList}">◈　${texts.tierList}</span>
                        </a>
                        <a href="${BASE_URL}/tier/position-tier/?lang=${currentLang}&v=${APP_VERSION}&list=false" class="nav-sub-item" data-nav="tier-maker">
                            <span data-text="${texts.tierMaker}">◈　${texts.tierMaker}</span>
                        </a>
                    </div>
                </div>
                ` : ''}
                ${currentMenus.includes('gallery') ? `
                    <a href="${BASE_URL}/gallery/?lang=${currentLang}&v=${APP_VERSION}" class="nav-link" data-nav="gallery">
                        <img src="${BASE_URL}/assets/img/nav/gallery.png" alt="gallery" style="width: 32px; height: 32px; object-fit: contain;" />
                        <span data-text="${texts.gallery}">${texts.gallery}</span>
                    </a>
                    ` : ''}
                ${currentMenus.includes('about') ? `
                <a href="${BASE_URL}/about?lang=${currentLang}&v=${APP_VERSION}" class="nav-link" data-nav="about">
                    <img src="${BASE_URL}/assets/img/nav/about.png" alt="about" style="width: 32px; height: 32px; object-fit: contain;" />
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
                </div>
            </nav>
        `;

        document.querySelector('#nav-container').innerHTML = navTemplate;
        
        // 먼저 sword animation 초기화
        this.initSwordAnimation();
        
        // 그 다음 이벤트 리스너 등록
        if (!document.querySelector('.logo-container').hasAttribute('data-event-bound')) {
            // 로고 클릭 이벤트 처리
            document.querySelector('.logo-container').addEventListener('click', () => {
                window.location.href = `${BASE_URL}/?lang=${currentLang}&v=${APP_VERSION}`;
            });
            document.querySelector('.logo-container').setAttribute('data-event-bound', 'true');
        }

        if (!document.querySelector('.mobile-logo-container').hasAttribute('data-event-bound')) {
            // 모바일 로고 클릭 이벤트 처리
            document.querySelector('.mobile-logo-container').addEventListener('click', () => {
                window.location.href = `${BASE_URL}/?lang=${currentLang}&v=${APP_VERSION}`;
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
                option.addEventListener('click', function(e) {
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

            // 택틱 관련 페이지인 경우 추가 처리
            if (activePage === 'tactic' || activePage === 'tactic-maker' || activePage === 'tactic-share' || activePage === 'tactics') {
                const tacticMenu = document.querySelector('[data-nav="tactic"]');
                if (tacticMenu) {
                    tacticMenu.classList.add('active');
                    
                    // 현재 활성화된 서브메뉴 아이템 찾기
                    let activeSubItem;
                    if (activePage === 'tactic' || activePage === 'tactic-maker') {
                        activeSubItem = document.querySelector('[data-nav="tactic-maker"]');
                    } else if (activePage === 'tactic-share') {
                        activeSubItem = document.querySelector('[data-nav="tactic-share"]');
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
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const submenu = this.closest('.has-submenu');
                submenu.classList.toggle('active');
            });
        });
        
        // Footer 번역 적용
        this.updateFooterTranslation();
    }
    
    // 현재 언어 감지 함수
    static getCurrentLanguage() {
        // URL 파라미터에서 언어 확인
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['kr', 'en', 'jp', 'cn'].includes(urlLang)) {
            return urlLang;
        }

        // URL 경로에서 언어 확인 (기존 /kr/, /en/ 방식 호환)
        const pathLang = window.location.pathname.split('/')[1];
        if (['kr', 'en', 'jp', 'cn'].includes(pathLang)) {
            return pathLang;
        }
        
        // 로컬 스토리지에서 언어 확인
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && ['kr', 'en', 'jp', 'cn'].includes(savedLang)) {
            return savedLang;
        }
        
        // 브라우저 언어 감지
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('ko')) return 'kr';
        if (browserLang.startsWith('ja')) return 'jp';
        if (browserLang.startsWith('zh')) return 'cn';
        if (browserLang.startsWith('en')) return 'en';
        
        return 'kr'; // 기본값
    }
    
    // sleep 함수 추가
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 언어 선택 함수
    static async selectLanguage(lang, event) {
        // 이벤트 전파 중단
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }

        // 드롭다운 닫기
        const optionsContainer = document.querySelector('.options-container');
        if (optionsContainer) {
            optionsContainer.classList.remove('active');
        }
        
        // 선호 언어 저장
        localStorage.setItem('preferredLanguage', lang);
        
        // 현재 URL 구성
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        
        // URL 파라미터 구성
        const params = new URLSearchParams(currentSearch);
        params.set('lang', lang);
        
        // 경로 정리 (기존 언어 디렉토리 제거)
        let cleanPath = currentPath;
        const pathSegments = currentPath.split('/').filter(Boolean);
        
        // 첫 번째 세그먼트가 언어 코드인 경우 제거
        if (pathSegments.length > 0 && ['kr', 'en', 'jp', 'cn'].includes(pathSegments[0])) {
            pathSegments.shift();
            cleanPath = '/' + pathSegments.join('/');
        }
        
        // 빈 경로면 루트로
        if (cleanPath === '/' || cleanPath === '') {
            cleanPath = '/';
        }
        
        // 새 URL 생성
        const newUrl = cleanPath + '?' + params.toString();
        
        // 페이지 이동 
        window.location.href = newUrl;
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
                item.addEventListener('click', function(e) {
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
                item.addEventListener('click', function(e) {
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