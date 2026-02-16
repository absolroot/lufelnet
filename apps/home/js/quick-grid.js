/* Quick Grid: Home launcher (2x6 desktop, 3x4 mobile) */
(function () {
    'use strict';

    const HOME_RAW_LANGS = ['kr', 'en', 'jp', 'cn', 'tw', 'sea'];
    const LABEL_KEY_MAP = {
        character: 'quick_character',
        persona: 'quick_persona',
        revelations: 'quick_revelations',
        wonderweapon: 'quick_wonderweapon',
        pullTracker: 'quick_pull_tracker',
        pullTracker_global: 'quick_pull_tracker_global',
        materialCalc: 'quick_material_calc',
        defenseCalc: 'quick_defense_calc',
        criticalCalc: 'quick_critical_calc',
        tacticLibrary: 'quick_tactic_library',
        tacticMaker: 'quick_tactic_maker',
        tier: 'quick_tier',
        guide: 'quick_guide',
        gallery: 'quick_gallery',
        synergy: 'quick_synergy',
        schedule: 'quick_schedule',
        maps: 'quick_maps',
        pullCalc: 'quick_pull_calc',
        astrolabe: 'quick_astrolabe'
    };
    const LABEL_FALLBACK_MAP = {
        character: '캐릭터',
        persona: '페르소나',
        revelations: '계시',
        wonderweapon: '원더 무기',
        pullTracker: '계약 트래커',
        pullTracker_global: '계약 통계',
        materialCalc: '육성 계산기',
        defenseCalc: '방어력 계산기',
        criticalCalc: '크리티컬 계산기',
        tacticLibrary: '택틱 도서관',
        tacticMaker: '택틱 메이커',
        tier: '티어',
        guide: '가이드',
        gallery: '갤러리',
        synergy: '협력자',
        schedule: '스케줄',
        maps: '지도',
        pullCalc: '가챠 플래너',
        astrolabe: '성좌의 시련'
    };

    const injectStyles = () => {
        if (document.getElementById('quick-grid-styles')) return;
        const style = document.createElement('style');
        style.id = 'quick-grid-styles';
        const base = typeof BASE_URL !== 'undefined' ? BASE_URL : '';
        style.textContent = `
            .main-content { border-radius: 0px 0px 10px 10px; background-color: var(--card-background); border-bottom: 3px solid var(--border-red); }
            .quick-grid { display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); gap: 16px; width: 100%; margin: 12px 0 24px 0; }
            .quick-item { display: flex; align-items: flex-start; }
            .quick-link { width: 100%; display: flex; flex-direction: column; align-items: center; text-decoration: none; color: inherit; border: transparent; background: transparent; border-radius: 14px; padding: 12px 18px; transition: all .18s ease; position: relative; overflow: hidden; }
            .quick-link:hover, .quick-link:focus-visible { background: transparent; box-shadow: none; transform: none; }
            .quick-icon-wrap { width: 72px; height: 72px; display: grid; place-items: center; border-radius: 50%; margin-bottom: 10px; transition: transform .18s ease; position: relative; }
            .quick-icon-wrap::after { content: ""; position: absolute; left: 50%; transform: translateX(-49%); bottom: 6px; width: 70px; height: 30px; background: url(${base}/assets/img/home/icon_under.png) no-repeat center / contain; pointer-events: none; z-index: 0; opacity: 0.95; }
            .quick-link:hover .quick-icon-wrap { transform: scale(1.1); }
            .quick-icon { width: 48px; height: 48px; object-fit: contain; filter: drop-shadow(0 1px 1px rgba(0,0,0,.35)); position: relative; z-index: 1; }
            .quick-label { margin-top: 2px; color: #fff; font-size: 13px; font-weight: 700; letter-spacing: .2px; text-align: center; line-height: 1.25; white-space: normal; word-break: keep-all; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
            .quick-new-badge { position: absolute; top: 8px; left: 4px; width: 20px; height: 20px; background: #ffd700; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; color: #000000; z-index: 10; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); font-family: 'Arial Black', 'Arial', 'Helvetica', sans-serif; }
            
            @media (max-width: 1024px) { .quick-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; } }
            @media (max-width: 768px) { .quick-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; } .quick-icon-wrap { width: 60px; height: 60px; } .quick-icon-wrap::after { width: 50px; height: 22px; bottom: 6px; } .quick-icon { width: 40px; height: 40px; } .quick-link { padding: 14px 8px; border-radius: 12px; } .quick-label { font-size: 12px; } .quick-new-badge { width: 20px; height: 20px; font-size: 11px; top: -1px; left: -1px; } }
        `;
        document.head.appendChild(style);
    };
    /* .quick-label { margin-top: 2px; color: #fff; font-size: 13px; font-weight: 800; letter-spacing: .2px; text-align: center; line-height: 1.25; white-space: normal; word-break: keep-all; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; text-shadow: 0 0 2px #000, 0 1px 0 #000, 1px 0 0 #000, -1px 0 0 #000, 0 -1px 0 #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000; }*/

    const getCurrentLanguage = () => {
        if (window.HomeI18n && typeof window.HomeI18n.detectRawLang === 'function') {
            const rawLang = window.HomeI18n.detectRawLang();
            if (HOME_RAW_LANGS.includes(rawLang)) return rawLang;
        }
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = (urlParams.get('lang') || '').toLowerCase();
            if (urlLang && HOME_RAW_LANGS.includes(urlLang)) return urlLang;
            const pathLang = window.location.pathname.split('/')[1];
            if (HOME_RAW_LANGS.includes(pathLang)) return pathLang;
            const savedLang = (localStorage.getItem('preferredLanguage') || '').toLowerCase();
            if (savedLang && HOME_RAW_LANGS.includes(savedLang)) return savedLang;
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('ko')) return 'kr';
            if (browserLang.startsWith('ja')) return 'jp';
            if (browserLang.startsWith('en')) return 'en';
            if (browserLang.startsWith('zh')) return 'cn';
        } catch (_) { }
        return 'kr';
    };

    function quickT(key, fallback, rawLang) {
        if (window.HomeI18n && typeof window.HomeI18n.t === 'function') {
            return window.HomeI18n.t(key, fallback, rawLang);
        }
        return fallback;
    }

    function getLabelByKey(itemKey, rawLang) {
        const i18nKey = LABEL_KEY_MAP[itemKey];
        const fallback = LABEL_FALLBACK_MAP[itemKey] || itemKey;
        if (!i18nKey) return fallback;
        return quickT(i18nKey, fallback, rawLang);
    }

    const iconMap = {
        character: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/guaidao.png`,
        persona: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/persona.png`,
        revelations: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/qishi.png`,
        wonderweapon: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/wonder-weapon.png`,
        maps: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/maps.png`,
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
        schedule: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/schedule.png`,
        synergy: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/synergy.png`,
        pullCalc: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/pull-calc.png`,
        astrolabe: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/astrolabe.png`
    };

    const pathMap = {
        character: '/character/',
        persona: '/persona',
        revelations: '/revelations',
        wonderweapon: '/wonder-weapon',
        maps: '/maps',
        astrolabe: '/astrolabe/',
        pullTracker: '/pull-tracker',
        pullTracker_global: '/pull-tracker/global-stats',
        materialCalc: '/material-calc',
        defenseCalc: '/defense-calc',
        criticalCalc: '/critical-calc',
        tacticLibrary: '/tactic/library/',
        tacticMaker: '/tactic-maker',
        tier: '/tier/',
        guide: '/article',
        gallery: '/gallery',
        schedule: '/schedule',
        synergy: '/synergy',
        pullCalc: '/pull-calc'
    };

    const buildHref = (key, lang) => {
        const base = typeof BASE_URL !== 'undefined' ? BASE_URL : '';
        if (key === 'tier') {
            return `${base}/${lang}/tier/`;
        }
        const ver = typeof APP_VERSION !== 'undefined' ? APP_VERSION : (Date.now().toString());
        const path = pathMap[key] || '/';
        const url = new URL(base + path, window.location.origin);

        url.searchParams.set('lang', lang);
        url.searchParams.set('v', ver);
        return url.pathname + url.search;
    };

    const getItems = (lang) => {
        if (lang === 'kr') {
            return ['character', 'persona', 'revelations', 'synergy', 'wonderweapon', 'maps', 'astrolabe', 'pullTracker', 'pullTracker_global', 'materialCalc', 'defenseCalc', 'criticalCalc', 'tacticLibrary', 'tacticMaker', 'guide', 'tier', 'gallery'];
        }
        if (lang === 'jp' || lang === 'en') {
            return ['character', 'persona', 'revelations', 'synergy', 'wonderweapon', 'maps', 'astrolabe', 'pullTracker', 'pullTracker_global', 'materialCalc', 'defenseCalc', 'criticalCalc', 'tacticLibrary', 'guide', 'tier', 'schedule', 'pullCalc', 'gallery'];
        }
        // default to KR set
        return ['character', 'persona', 'revelations', 'synergy', 'wonderweapon', 'maps', 'astrolabe', 'pullTracker', 'pullTracker_global', 'materialCalc', 'defenseCalc', 'criticalCalc', 'tacticLibrary', 'guide', 'tier', 'schedule', 'pullCalc', 'gallery'];
    };

    // New 배지를 표시할 아이템 목록
    const newItems = ['character','guide'];

    const render = () => {
        const root = document.getElementById('quick-grid');
        if (!root) return;
        injectStyles();
        const lang = getCurrentLanguage();
        const order = getItems(lang);
        root.innerHTML = '';
        order.forEach(key => {
            const labelText = getLabelByKey(key, lang);
            const a = document.createElement('a');
            a.className = 'quick-link';
            a.href = buildHref(key, lang);
            a.setAttribute('data-key', key);
            a.setAttribute('aria-label', labelText || key);

            const iconWrap = document.createElement('div');
            iconWrap.className = 'quick-icon-wrap';
            const img = document.createElement('img');
            img.className = 'quick-icon';
            img.alt = key;
            img.loading = 'lazy';
            img.src = iconMap[key] || `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}/assets/img/nav/home.png`;
            // schedule 아이콘 스케일 0.9 적용
            if (key === 'schedule') {
                img.style.transform = 'scale(0.9)';
            }
            iconWrap.appendChild(img);

            // New 배지 추가
            if (newItems.includes(key)) {
                const badge = document.createElement('div');
                badge.className = 'quick-new-badge';
                badge.textContent = 'N';
                badge.setAttribute('aria-label', quickT('quick_new_aria', '신규', lang));
                iconWrap.appendChild(badge);
            }

            const label = document.createElement('div');
            label.className = 'quick-label';
            label.textContent = labelText || key;



            // 일본어일 때만 word-break: break-all 적용
            if (lang === 'jp') {
                label.style.wordBreak = 'break-all';
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
        document.addEventListener('DOMContentLoaded', async () => {
            if (window.__HOME_I18N_READY__) {
                try { await window.__HOME_I18N_READY__; } catch (_) { }
            }
            render();
        });
    } else {
        (async () => {
            if (window.__HOME_I18N_READY__) {
                try { await window.__HOME_I18N_READY__; } catch (_) { }
            }
            render();
        })();
    }

    document.addEventListener('languageChanged', () => {
        render();
    });
})();

