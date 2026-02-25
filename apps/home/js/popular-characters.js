(function () {
    'use strict';

    const DEFAULT_MAX_COUNT = 10;

    const POPULAR_CHARACTERS_OVERRIDE = { kr: null, en: null, jp: null };
    const POPULAR_CHARACTERS_FIXED = {
        kr: [
            { name: '나루미', badge: 'NEW' },
            { name: '렌', badge: 'NEW' },
            { name: '야오링·사자무', badge: 'NEW' },
            { name: 'J&C', badge: 'HOT' },
            { name: '마나카', badge: 'HOT' },
            { name: '미나미·여름', badge: 'HOT' },
            { name: '리코·매화', badge: 'HOT' },
        ],
        en: [
            { name: 'J&C', badge: 'HOT' },
            { name: '리코·매화', badge: 'HOT' },
            { name: '아야카', badge: 'HOT' },
        ],
        jp: [
            { name: 'J&C', badge: 'HOT' },
            { name: '리코·매화', badge: 'HOT' },
            { name: '아야카', badge: 'HOT' },
        ],
    };

    function getAllowedCharacterSet() {
        try {
            const list = window.characterList;
            if (!list) return null;
            const main = Array.isArray(list.mainParty) ? list.mainParty : [];
            const sup = Array.isArray(list.supportParty) ? list.supportParty : [];
            const all = [...main, ...sup].filter(x => typeof x === 'string' && x.trim() !== '');
            if (all.length === 0) return null;
            return new Set(all);
        } catch (_) {
            return null;
        }
    }

    function bindMouseDragScroll(container) {
        if (!container) return;
        if (container.dataset && container.dataset.mouseDragScrollBound === '1') return;
        if (container.dataset) container.dataset.mouseDragScrollBound = '1';

        container.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        let didDrag = false;

        container.style.cursor = 'grab';
        container.style.userSelect = 'none';

        container.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDown = true;
            didDrag = false;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            container.style.cursor = 'grabbing';
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        window.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            container.style.cursor = 'grab';
            window.setTimeout(() => { didDrag = false; }, 0);
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = x - startX;
            if (Math.abs(walk) > 5) didDrag = true;
            container.scrollLeft = scrollLeft - walk;
        });

        container.addEventListener('click', (e) => {
            if (!didDrag) return;
            e.preventDefault();
            e.stopPropagation();
        }, true);
    }

    function getCurrentLang() {
        try {
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
                const lr = LanguageRouter.getCurrentLanguage();
                if (lr && ['kr', 'en', 'jp', 'cn'].includes(lr)) return lr;
            }
        } catch (_) { }
        try {
            const urlLang = new URLSearchParams(window.location.search).get('lang');
            if (urlLang && ['kr', 'en', 'jp', 'cn'].includes(urlLang)) return urlLang;
        } catch (_) { }
        try {
            const saved = localStorage.getItem('preferredLanguage');
            if (saved && ['kr', 'en', 'jp', 'cn'].includes(saved)) return saved;
        } catch (_) { }
        try {
            const saved2 = localStorage.getItem('preferred_language');
            if (saved2 && ['kr', 'en', 'jp', 'cn'].includes(saved2)) return saved2;
        } catch (_) { }
        return 'kr';
    }

    function getMaxCountFromDom(popularRoot) {
        const raw = popularRoot ? popularRoot.getAttribute('data-max-count') : null;
        const n = raw ? Number(raw) : NaN;
        if (!Number.isFinite(n) || n <= 0) return DEFAULT_MAX_COUNT;
        return Math.floor(n);
    }

    async function fetchCharactersData(url) {
        try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const text = await res.text();
            const sandbox = {};
            const win = (new Function('window', `${text}\n; return window;`))(sandbox);
            const list = win.characterList || { mainParty: [], supportParty: [] };
            const data = win.characterData || {};
            return { characterList: list, characterData: data };
        } catch (_) {
            return null;
        }
    }

    function normalizeItems(items) {
        if (!Array.isArray(items)) return null;
        return items
            .filter(it => it && typeof it.name === 'string' && it.name.trim() !== '')
            .map(it => ({
                name: it.name,
                badge: (typeof it.badge === 'string') ? it.badge.trim().toUpperCase() : ((typeof it.isNew === 'boolean') ? (it.isNew ? 'NEW' : null) : 'NEW'),
            }));
    }

    function buildNameForLang(characterKey, lang, krCharacterData) {
        const kr = (krCharacterData && krCharacterData[characterKey]) ? krCharacterData[characterKey] : null;
        if (!kr) return characterKey;
        if (lang === 'en') return kr.codename || characterKey;
        if (lang === 'jp') return kr.name_jp || characterKey;
        return kr.name || characterKey;
    }

    function resolveCharacterSlug(characterKey) {
        try {
            const map = window.__CHARACTER_SLUG_MAP;
            if (!map || typeof map !== 'object') return null;

            const entry = map[characterKey];
            if (entry && entry.slug) return entry.slug;

            const keys = Object.keys(map);
            for (let i = 0; i < keys.length; i += 1) {
                const info = map[keys[i]];
                if (!info || !info.slug || !Array.isArray(info.aliases)) continue;
                if (info.aliases.includes(characterKey)) return info.slug;
            }
        } catch (_) {
            // no-op
        }
        return null;
    }

    function buildCharacterHref(characterKey, lang) {
        const slug = resolveCharacterSlug(characterKey);
        if (slug) {
            return `/${lang}/character/${slug}/`;
        }

        const url = new URL(`${window.BASE_URL || ''}/character.html`, window.location.origin);
        url.searchParams.set('name', characterKey);
        return url.pathname + url.search;
    }

    function buildReleaseOrderMap(langCharacterData) {
        const map = {};
        Object.keys(langCharacterData || {}).forEach(key => {
            const v = langCharacterData[key];
            if (v && typeof v.release_order !== 'undefined') {
                map[key] = v.release_order;
            }
        });
        return map;
    }

    function sortByReleaseOrderDesc(keys, releaseOrderMap) {
        return [...keys].sort((a, b) => {
            const ra = (typeof releaseOrderMap[a] === 'number') ? releaseOrderMap[a] : -Infinity;
            const rb = (typeof releaseOrderMap[b] === 'number') ? releaseOrderMap[b] : -Infinity;
            return rb - ra;
        });
    }

    function resolvePopularCharacters(lang, langCharacterData) {
        const overrideItems = normalizeItems(POPULAR_CHARACTERS_OVERRIDE[lang]);
        if (overrideItems) {
            return {
                orderedKeys: overrideItems.map(x => x.name),
                badgeMap: new Map(overrideItems.filter(x => x.badge).map(x => [x.name, x.badge])),
            };
        }

        const fixedItems = normalizeItems(POPULAR_CHARACTERS_FIXED[lang]) || [];
        const fixedKeys = fixedItems.map(x => x.name);
        const fixedSet = new Set(fixedKeys);

        const releaseOrderMap = buildReleaseOrderMap(langCharacterData);
        const orderedAuto = sortByReleaseOrderDesc(Object.keys(releaseOrderMap), releaseOrderMap);

        const topAuto = orderedAuto[0];
        const merged = [];
        if (topAuto) merged.push(topAuto);
        fixedKeys.forEach(k => {
            if (!k || k === topAuto) return;
            merged.push(k);
        });
        orderedAuto.forEach(k => {
            if (!k || k === topAuto) return;
            if (fixedSet.has(k)) return;
            merged.push(k);
        });

        const badgeMap = new Map();
        if (topAuto) badgeMap.set(topAuto, 'NEW');
        fixedItems.forEach(it => {
            if (!it || !it.name || !it.badge) return;
            badgeMap.set(it.name, it.badge);
        });

        return { orderedKeys: merged, badgeMap };
    }

    function renderPopularCards(container, lang, orderedKeys, badgeMap, maxCount, krCharacterData) {
        if (!container) return;
        container.innerHTML = '';

        orderedKeys.slice(0, maxCount).forEach(characterKey => {
            const card = document.createElement('div');
            card.className = 'character-card';
            const badge = (badgeMap && badgeMap.get) ? badgeMap.get(characterKey) : null;
            if (badge === 'NEW') card.classList.add('new');
            if (badge === 'HOT') card.classList.add('hot');

            const link = document.createElement('a');
            link.href = buildCharacterHref(characterKey, lang);
            link.style.textDecoration = 'none';
            link.style.color = 'inherit';

            const imgWrap = document.createElement('div');
            imgWrap.className = 'character-card-img';
            const img = document.createElement('img');
            img.src = `${window.BASE_URL || ''}/assets/img/tier/${encodeURIComponent(characterKey)}.webp`;
            img.alt = characterKey;
            img.width = 98;
            img.height = 140;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.setAttribute('fetchpriority', 'low');
            img.draggable = false;
            imgWrap.appendChild(img);
            link.appendChild(imgWrap);

            const textWrap = document.createElement('div');
            textWrap.className = 'character-card-text';
            const p = document.createElement('p');
            p.textContent = buildNameForLang(characterKey, lang, krCharacterData);
            textWrap.appendChild(p);

            card.appendChild(link);
            card.appendChild(textWrap);
            container.appendChild(card);
        });
    }

    async function initPopularCharacters() {
        const popularRoot = document.querySelector('.popular-content');
        const container = document.getElementById('popular-character-cards');
        if (!popularRoot || !container) return;

        bindMouseDragScroll(container);

        const lang = getCurrentLang();
        const maxCount = getMaxCountFromDom(popularRoot);
        const v = window.APP_VERSION || Date.now();

        const kr = await fetchCharactersData(`${window.BASE_URL || ''}/data/character_info.js?v=${v}`);
        const lgDataPath = (lang === 'en' || lang === 'jp')
            ? '/data/character_info_glb.js'
            : `/data/${lang}/characters/characters.js`;
        const lg = (lang === 'kr') ? kr : await fetchCharactersData(`${window.BASE_URL || ''}${lgDataPath}?v=${v}`);

        const krCharacterData = (kr && kr.characterData) ? kr.characterData : {};
        const langCharacterData = (lg && lg.characterData) ? lg.characterData : {};

        const resolved = resolvePopularCharacters(lang, langCharacterData);

        const allowedSet = getAllowedCharacterSet();
        let orderedKeys = resolved.orderedKeys || [];
        let badgeMap = resolved.badgeMap || new Map();
        if (allowedSet) {
            orderedKeys = orderedKeys.filter(k => allowedSet.has(k));
            const filtered = new Map();
            badgeMap.forEach((v, k) => {
                if (allowedSet.has(k)) filtered.set(k, v);
            });
            badgeMap = filtered;
        }

        renderPopularCards(container, lang, orderedKeys, badgeMap, maxCount, krCharacterData);
    }

    document.addEventListener('DOMContentLoaded', () => {
        initPopularCharacters();
        window.addEventListener('languageDetected', initPopularCharacters);
    });
})();
