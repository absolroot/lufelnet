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
                character: '괴도',
                persona: '페르소나',
                revelations: '계시',
                defenseCalc: '방어력 계산',
                tactic: '택틱',
                tacticMaker: '택틱 메이커',
                tacticForge: '택틱 대장간',
                tier: '티어 (beta)',
                tierMaker: '티어 메이커'
            },
            en: {
                home: 'Home',
                character: 'Characters',
                persona: 'Persona',
                revelations: 'Revelations',
                defenseCalc: 'Defense Calc',
                tactic: 'Tactics',
                tacticMaker: 'Tactics Maker',
                tacticForge: 'Tactics Forge',
                tier: 'Tier (beta)',
                tierMaker: 'Tier Maker'
            },
            jp: {
                home: 'ホーム',
                character: '怪盗',
                persona: 'ペルソナ',
                revelations: '啓示',
                defenseCalc: '防御力計算',
                tactic: '戦術',
                tacticMaker: '戦術メーカー',
                tacticForge: '戦術鍛冶場',
                tier: 'ティア (beta)',
                tierMaker: 'ティアメーカー'
            },
            cn: {
                home: '首页',
                character: '怪盗',
                persona: '人格面具',
                revelations: '启示',
                defenseCalc: '防御力计算',
                tactic: '战术',
                tacticMaker: '战术制作',
                tacticForge: '战术锻造',
                tier: '梯队 (beta)',
                tierMaker: '梯队制作'
            }
        };

        // 현재 언어의 텍스트 가져오기
        const texts = i18n[currentLang] || i18n.kr;

        const navTemplate = `
            <nav class="main-nav">
                <div class="logo-container">
                    <img src="${BASE_URL}/assets/img/logo/lufel.webp" alt="logo" />
                    <img src="${BASE_URL}/assets/img/logo/lufelnet.png" alt="logo-text" />
                </div>
                <a href="${BASE_URL}/${currentLang}/?v=${APP_VERSION}" class="nav-link" data-nav="home">
                    <img src="${BASE_URL}/assets/img/nav/home.png" alt="home" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.home}">${texts.home}</span>
                </a>
                <a href="${BASE_URL}/${currentLang}/character?v=${APP_VERSION}" class="nav-link" data-nav="character">
                    <img src="${BASE_URL}/assets/img/nav/guaidao.png" alt="guaidao" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.character}">${texts.character}</span>
                </a>
                <a href="${BASE_URL}/${currentLang}/persona?v=${APP_VERSION}" class="nav-link" data-nav="persona">
                    <img src="${BASE_URL}/assets/img/nav/persona.png" alt="persona" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.persona}">${texts.persona}</span>
                </a>
                <a href="${BASE_URL}/${currentLang}/revelations?v=${APP_VERSION}" class="nav-link" data-nav="revelations">
                    <img src="${BASE_URL}/assets/img/nav/qishi.png" alt="qishi" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.revelations}">${texts.revelations}</span>
                </a>
                <a href="${BASE_URL}/${currentLang}/defense-calc?v=${APP_VERSION}" class="nav-link" data-nav="defense-calc">
                    <img src="${BASE_URL}/assets/img/nav/defense-calc.png" alt="defense-calc" style="width: 32px; height: 32px; object-fit: contain;" />
                    <span data-text="${texts.defenseCalc}">${texts.defenseCalc}</span>
                </a>
                <div class="nav-item has-submenu" data-nav="tactic">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/tactic.png" alt="tactic" style="width: 32px; height: 32px; object-fit: contain;" />
                        <span data-text="${texts.tactic}">${texts.tactic}</span>
                    </div>
                    <div class="submenu">
                        <a href="${BASE_URL}/${currentLang}/tactic?v=${APP_VERSION}" class="nav-sub-item" data-nav="tactic-maker">
                            <span data-text="${texts.tacticMaker}">◈　${texts.tacticMaker}</span>
                        </a>
                        <a href="${BASE_URL}/${currentLang}/tactic/tactic-share.html?v=${APP_VERSION}" class="nav-sub-item" data-nav="tactic-share">
                            <span data-text="${texts.tacticForge}">◈　${texts.tacticForge}</span>
                        </a>
                    </div>
                </div>
                <div class="nav-item has-submenu" data-nav="tier">
                    <div class="nav-main-item">
                        <img src="${BASE_URL}/assets/img/nav/tier.png" alt="tier" style="width: 32px; height: 32px; object-fit: contain;" />
                        <span data-text="${texts.tier}">${texts.tier}</span>
                    </div>
                    <div class="submenu">
                        <a href="${BASE_URL}/${currentLang}/tier?v=${APP_VERSION}" class="nav-sub-item" data-nav="tier-maker">
                            <span data-text="${texts.tierMaker}">◈　${texts.tierMaker}</span>
                        </a>
                    </div>
                </div>
                
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
                                <span>English (Beta)</span>
                            </div>
                            <!--
                            <div class="option ${currentLang === 'jp' ? 'selected' : ''}" data-value="jp" role="button" tabindex="0" onclick="return false;">
                                <img src="${BASE_URL}/assets/img/flags/jp.png" alt="jp" class="flag-icon">
                                <span>日本語</span>
                            </div>
                            -->
                            <div class="option ${currentLang === 'cn' ? 'selected' : ''}" data-value="cn" role="button" tabindex="0" onclick="return false;">
                                <img src="${BASE_URL}/assets/img/flags/cn.png" alt="cn" class="flag-icon">
                                <span>中文 (Not Yet)</span>
                            </div>
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
                window.location.href = `${BASE_URL}/${currentLang}/?v=${APP_VERSION}`;
            });
            document.querySelector('.logo-container').setAttribute('data-event-bound', 'true');
        }

        if (!document.querySelector('.mobile-logo-container').hasAttribute('data-event-bound')) {
            // 모바일 로고 클릭 이벤트 처리
            document.querySelector('.mobile-logo-container').addEventListener('click', () => {
                window.location.href = `${BASE_URL}/${currentLang}/?v=${APP_VERSION}`;
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
            if (activePage === 'tactic' || activePage === 'tactic-maker' || activePage === 'tactic-share') {
                const tacticMenu = document.querySelector('[data-nav="tactic"]');
                if (tacticMenu) {
                    tacticMenu.classList.add('active');
                    
                    // 현재 활성화된 서브메뉴 아이템 찾기
                    let activeSubItem;
                    if (activePage === 'tactic' || activePage === 'tactic-maker') {
                        activeSubItem = document.querySelector('[data-nav="tactic-maker"]');
                    } else if (activePage === 'tactic-share') {
                        activeSubItem = document.querySelector('[data-nav="tactic-share"]');
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
            hamburgerBtn.classList.toggle('active');
            nav.classList.toggle('active');
            header.classList.toggle('active');
        });

        // 모바일에서 메뉴 아이템 클릭시 메뉴 닫기
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 1440) {  // 1440px 이하에서 작동하도록 수정
                    const nav = document.querySelector('.main-nav');
                    const hamburgerBtn = document.querySelector('.hamburger-btn');
                    nav.classList.remove('active');
                    hamburgerBtn.classList.remove('active');
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
    }
    
    // 현재 언어 감지 함수
    static getCurrentLanguage() {
        // URL에서 언어 감지
        const currentPath = window.location.pathname;
        const baseUrl = BASE_URL;
        
        // baseUrl을 제거한 실제 경로 얻기
        const pathWithoutBase = currentPath.replace(baseUrl, '');
        const pathSegments = pathWithoutBase.split('/').filter(Boolean);

        console.log('pathSegments:', pathSegments);
        
        // 첫 번째 세그먼트가 언어 코드인지 확인
        if (pathSegments.length > 0 && ['kr', 'en', 'jp', 'cn'].includes(pathSegments[0])) {
            return pathSegments[0];
        } else if (pathSegments.length > 1 && ['kr', 'en', 'jp', 'cn'].includes(pathSegments[1])) {
            return pathSegments[1];
        }
        
        // 저장된 언어 설정 확인
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && ['kr', 'en', 'jp', 'cn'].includes(savedLang)) {
            return savedLang;
        }
        
        // 브라우저 언어 감지
        const browserLang = navigator.language.toLowerCase();
        
        if (browserLang.startsWith('kr')) return 'kr';
        if (browserLang.startsWith('en')) return 'en';
        if (browserLang.startsWith('ja')) return 'jp';
        if (browserLang.startsWith('zh')) return 'cn';
        
        // 기본값은 한국어
        return 'kr';
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
        
        // 현재 URL 가져오기
        const currentPath = window.location.pathname;
        const baseUrl = BASE_URL;
        
        // baseUrl을 제거한 실제 경로 얻기
        const pathWithoutBase = currentPath.replace(baseUrl, '');
        
        const pathSegments = pathWithoutBase.split('/').filter(Boolean);
        
        // 첫 번째 세그먼트가 언어 코드인지 확인
        if (pathSegments.length > 0 && ['kr', 'en', 'jp', 'cn'].includes(pathSegments[0])) {
            pathSegments[0] = lang;
        } else if (pathSegments.length > 1 && ['kr', 'en', 'jp', 'cn'].includes(pathSegments[1])) {
            pathSegments[1] = lang;
        } else {
            pathSegments.unshift(lang);
        }
        
        // 새 URL 생성
        const newPath = baseUrl + '/' + pathSegments.join('/');
        
        const queryString = window.location.search;
        const finalUrl = newPath + queryString;
        
        
        // 페이지 이동 
        window.location.href = finalUrl;
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
}