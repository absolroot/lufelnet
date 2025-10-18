/* Quick Grid: Home launcher (2x6 desktop, 3x4 mobile) */
(function() {
    const injectStyles = () => {
        if (document.getElementById('quick-grid-styles')) return;
        const style = document.createElement('style');
        style.id = 'quick-grid-styles';
        const base = typeof BASE_URL !== 'undefined' ? BASE_URL : '';
        style.textContent = `
            .main-content { border-radius: 0px 0px 10px 10px; background-color: #3d3030; }
            .quick-grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 16px; width: 100%; margin: 12px 0 24px 0; }
            .quick-item { display: flex; align-items: center; justify-content: center; }
            .quick-link { width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; color: inherit; border: transparent; background: transparent; border-radius: 14px; padding: 12px 18px; transition: all .18s ease; position: relative; overflow: hidden; }
            .quick-link:hover, .quick-link:focus-visible { background: transparent; box-shadow: none; transform: none; }
            .quick-icon-wrap { width: 72px; height: 72px; display: grid; place-items: center; border-radius: 50%; margin-bottom: 10px; transition: transform .18s ease; position: relative; }
            .quick-icon-wrap::after { content: ""; position: absolute; left: 50%; transform: translateX(-49%); bottom: 6px; width: 70px; height: 30px; background: url(${base}/assets/img/home/icon_under.png) no-repeat center / contain; pointer-events: none; z-index: 0; opacity: 0.95; }
            .quick-link:hover .quick-icon-wrap { transform: scale(1.06); }
            .quick-icon { width: 48px; height: 48px; object-fit: contain; filter: drop-shadow(0 1px 1px rgba(0,0,0,.35)); position: relative; z-index: 1; }
            .quick-label { margin-top: 2px; color: #fff; font-size: 13px; font-weight: 700; letter-spacing: .2px; text-align: center; line-height: 1.25; white-space: normal; word-break: keep-all; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
            
            @media (max-width: 1024px) { .quick-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; } }
            @media (max-width: 768px) { .quick-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; } .quick-icon-wrap { width: 60px; height: 60px; } .quick-icon-wrap::after { width: 50px; height: 22px; bottom: 6px; } .quick-icon { width: 40px; height: 40px; } .quick-link { padding: 14px 8px; border-radius: 12px; } .quick-label { font-size: 12px; } }
        `;
        document.head.appendChild(style);
    };
    /* .quick-label { margin-top: 2px; color: #fff; font-size: 13px; font-weight: 800; letter-spacing: .2px; text-align: center; line-height: 1.25; white-space: normal; word-break: keep-all; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; text-shadow: 0 0 2px #000, 0 1px 0 #000, 1px 0 0 #000, -1px 0 0 #000, 0 -1px 0 #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000; }*/

    const getCurrentLanguage = () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = urlParams.get('lang');
            if (urlLang && ['kr', 'en', 'jp', 'cn'].includes(urlLang)) return urlLang;
            const pathLang = window.location.pathname.split('/')[1];
            if (['kr', 'en', 'jp', 'cn'].includes(pathLang)) return pathLang;
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && ['kr', 'en', 'jp', 'cn'].includes(savedLang)) return savedLang;
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('ko')) return 'kr';
            if (browserLang.startsWith('ja')) return 'jp';
            if (browserLang.startsWith('en')) return 'en';
        } catch(_) {}
        return 'kr';
    };

    const texts = {
        kr: {
            character: '괴도', persona: '페르소나', revelations: '계시', wonderweapon: '원더 무기',
            pullTracker: '계약 트래커', pullTracker_global: '계약 통계',
            materialCalc: '육성 계산기', defenseCalc: '방어력 계산기', criticalCalc: '크리티컬 계산기',
            tacticLibrary: '택틱 도서관', tacticMaker: '택틱 메이커',
            tier: '티어', guide: '가이드', gallery: '갤러리', synergy: '협력', support: '서포트'
        },
        en: {
            character: 'Character', persona: 'Persona', revelations: 'Revelations', wonderweapon: 'Wonder Daggers',
            pullTracker: 'Pull Tracker', pullTracker_global: 'Pull Global Stats',
            materialCalc: 'Progression Calc', defenseCalc: 'Defense Calc', criticalCalc: 'Critical Calc',
            tacticLibrary: 'Tactics Library', tacticMaker: 'Tactic Maker',
            tier: 'Tiers', guide: 'Guides', gallery: 'Gallery', synergy: 'Synergy', support: 'Support'
        },
        jp: {
            character: '怪盗', persona: 'ペルソナ', revelations: '啓示', wonderweapon: 'ワンダー武器',
            pullTracker: 'ガチャ履歴', pullTracker_global: '全体統計',
            materialCalc: '育成計算機', defenseCalc: '防御力減少計算機', criticalCalc: 'クリティカル計算機',
            tacticLibrary: 'タクティクスライブラリー', tacticMaker: 'タクティクスメーカー',
            tier: 'ティア', guide: 'ガイド', gallery: 'ギャラリー', synergy: 'シナジー', support: 'サポート'
        }
    };

    const iconMap = {
        character: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/guaidao.png`,
        persona: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/persona.png`,
        revelations: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/qishi.png`,
        wonderweapon: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/wonder-weapon.png`,
        pullTracker: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/pull.png`,
        pullTracker_global: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/pull-stat.png`,
        materialCalc: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/material.png`,
        defenseCalc: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/defense-calc.png`,
        criticalCalc: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/calculator.png`,
        tacticLibrary: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/tactic.png`,
        tacticMaker: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/tactic-maker.png`,
        tier: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/tier.png`,
        guide: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/article.png`,
        gallery: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/gallery.png`,
        synergy: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/synergy.png`,
        support: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/support.png`
    };

    const pathMap = {
        character: '/character/',
        persona: '/persona',
        revelations: '/revelations',
        wonderweapon: '/wonder-weapon',
        pullTracker: '/pull-tracker',
        pullTracker_global: '/pull-tracker/global-stats',
        materialCalc: '/material-calc',
        defenseCalc: '/defense-calc',
        criticalCalc: '/critical-calc',
        tacticLibrary: '/tactic/tactics.html',
        tacticMaker: '/tactic',
        tier: '/tier/position-tier/',
        guide: '/article',
        gallery: '/gallery',
        synergy: '/synergy',
        support: '/about'
    };

    const buildHref = (key, lang) => {
        const base = typeof BASE_URL !== 'undefined' ? BASE_URL : '';
        const ver = typeof APP_VERSION !== 'undefined' ? APP_VERSION : (Date.now().toString());
        const path = pathMap[key] || '/';
        const url = new URL(base + path, window.location.origin);

        // 새 창으로 띄우게
        if (key === 'synergy' && lang === 'kr') {
            return 'https://docs.google.com/spreadsheets/d/1L47W0r5nHpAlU_qUY3HuslcqBRS78tHC682eFCXiftM/'
        }
    else if (key === 'synergy' && lang === 'en') {
            return 'https://docs.google.com/spreadsheets/d/1gbV0OY_6K579nxUa5FuDcOkbxDc1VJD5ejjq3dkuELs'
        }
        else if (key === 'synergy' && lang === 'jp') {
            return 'https://docs.google.com/spreadsheets/d/1gbV0OY_6K579nxUa5FuDcOkbxDc1VJD5ejjq3dkuELs'
        }

        url.searchParams.set('lang', lang);
        url.searchParams.set('v', ver);
        return url.pathname + url.search;
    };

    const getItems = (lang) => {
        if (lang === 'kr') {
            return ['character','persona','revelations','wonderweapon','pullTracker','pullTracker_global','materialCalc','defenseCalc','criticalCalc','tacticLibrary','tacticMaker','guide','tier','gallery','synergy','support'];
        }
        if (lang === 'jp' || lang === 'en') {
            return ['character','persona','revelations','wonderweapon','pullTracker','pullTracker_global','materialCalc','defenseCalc','criticalCalc','tacticLibrary','tacticMaker','guide','tier','gallery','synergy','support'];
        }
        // default to KR set
        return ['character','persona','revelations','wonderweapon','pullTracker','pullTracker_global','materialCalc','defenseCalc','criticalCalc','tacticLibrary','guide','tier','gallery','synergy','support'];
    };

    const render = () => {
        const root = document.getElementById('quick-grid');
        if (!root) return;
        injectStyles();
        const lang = getCurrentLanguage();
        const order = getItems(lang);
        const dict = texts[lang] || texts.kr;
        root.innerHTML = '';
        order.forEach(key => {
            const a = document.createElement('a');
            a.className = 'quick-link';
            a.href = buildHref(key, lang);
            if (key === 'synergy') {
                a.target = '_blank';
            }
            a.setAttribute('data-key', key);
            a.setAttribute('aria-label', dict[key] || key);

            const iconWrap = document.createElement('div');
            iconWrap.className = 'quick-icon-wrap';
            const img = document.createElement('img');
            img.className = 'quick-icon';
            img.alt = key;
            img.loading = 'lazy';
            img.src = iconMap[key] || `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/home.png`;
            iconWrap.appendChild(img);

            const label = document.createElement('div');
            label.className = 'quick-label';
            label.textContent = dict[key] || key;

            //라벨이 서포트인 경우 글자 노란색
            if (key === 'support') {
                label.style.color = 'rgb(255, 226, 226)';
            }

            a.appendChild(iconWrap);
            a.appendChild(label);

            const item = document.createElement('div');
            item.className = 'quick-item';
            item.appendChild(a);
            root.appendChild(item);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();

