(function () {
    'use strict';

    const DEFAULT_MAX_COUNT = 10;
    const REGIONS = ['cn', 'tw', 'sea', 'kr', 'en', 'jp'];
    const GLB_RELEASE_ORDER_REGIONS = new Set(['en', 'jp', 'sea']);

    const POPULAR_CHARACTERS_OVERRIDE = { kr: null, en: null, jp: null };
    const POPULAR_CHARACTERS_FIXED = {
        kr: [
            { name: '미쿠', badge: 'HOT' },
            { name: '코토네', badge: 'HOT' },
        ],
        en: [
            { name: '쇼키·암야', badge: 'NEW' },
            { name: '슌·프론티어', badge: 'NEW' },
            { name: '후카', badge: 'HOT' },
        ],
        jp: [
            { name: '쇼키·암야', badge: 'NEW' },
            { name: '슌·프론티어', badge: 'NEW' },
            { name: '후카', badge: 'HOT' },
        ],
    };

    function getAllowedCharacterSet(characterList) {
        try {
            const list = characterList || null;
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

    function mapLangToRegion(lang) {
        if (!lang) return null;
        const value = String(lang).toLowerCase();
        return REGIONS.includes(value) ? value : null;
    }

    function loadRegion() {
        try {
            const saved = localStorage.getItem('carousel_region');
            if (saved && REGIONS.includes(saved)) return saved;
        } catch (_) { }
        try {
            const candidates = [];
            const urlLang = new URLSearchParams(window.location.search).get('lang');
            if (urlLang) candidates.push(urlLang);
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
                candidates.push((LanguageRouter.getCurrentLanguage() || '').toLowerCase());
            }
            try {
                const savedLang = localStorage.getItem('preferredLanguage');
                if (savedLang) candidates.push(savedLang);
            } catch (_) { }
            try {
                const legacyLang = localStorage.getItem('preferred_language');
                if (legacyLang) candidates.push(legacyLang);
            } catch (_) { }

            for (const candidate of candidates) {
                const region = mapLangToRegion(candidate);
                if (region) return region;
            }
        } catch (_) { }
        return 'kr';
    }

    function shouldUseGlbReleaseOrder(region) {
        return GLB_RELEASE_ORDER_REGIONS.has(String(region || '').toLowerCase());
    }

    function getPopularListKey(region) {
        const value = String(region || '').toLowerCase();
        if (value === 'kr' || value === 'cn' || value === 'tw') return 'kr';
        if (value === 'jp') return 'jp';
        return 'en';
    }

    function getCurrentLang() {
        try {
            const urlLang = new URLSearchParams(window.location.search).get('lang');
            if (urlLang && ['kr', 'en', 'jp', 'cn'].includes(urlLang)) return urlLang;
        } catch (_) { }
        try {
            const pathLang = String(window.location.pathname || '').split('/')[1];
            if (pathLang && ['kr', 'en', 'jp', 'cn'].includes(pathLang)) return pathLang;
        } catch (_) { }
        try {
            if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
                const lr = LanguageRouter.getCurrentLanguage();
                if (lr && ['kr', 'en', 'jp', 'cn'].includes(lr)) return lr;
            }
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
            const res = await fetch(url);
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
        if (lang === 'en') return kr.codename_en || kr.codename || characterKey;
        if (lang === 'jp') return kr.name_jp || characterKey;
        if (lang === 'cn') return kr.name_cn || kr.name || characterKey;
        return kr.name || characterKey;
    }

    function buildReleaseOrderMap(releaseOrderCharacterData) {
        const map = {};
        Object.keys(releaseOrderCharacterData || {}).forEach(key => {
            const v = releaseOrderCharacterData[key];
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

    function sortByBadge(keys, badgeMap) {
        const priority = { NEW: 0, HOT: 1 };
        return keys.map((name, index) => ({ name, index }))
            .sort((a, b) => (priority[badgeMap.get(a.name)] ?? 2) - (priority[badgeMap.get(b.name)] ?? 2) || a.index - b.index)
            .map(item => item.name);
    }

    function resolvePopularCharacters(listKey, releaseOrderCharacterData) {
        const langKey = POPULAR_CHARACTERS_FIXED[listKey] ? listKey : 'en';
        const overrideItems = normalizeItems(POPULAR_CHARACTERS_OVERRIDE[langKey]);
        if (overrideItems) {
            const badgeMap = new Map(overrideItems.filter(x => x.badge).map(x => [x.name, x.badge]));
            return {
                orderedKeys: sortByBadge(overrideItems.map(x => x.name), badgeMap),
                badgeMap,
            };
        }

        const fixedItems = normalizeItems(POPULAR_CHARACTERS_FIXED[langKey]) || [];
        const fixedKeys = fixedItems.map(x => x.name);
        const fixedSet = new Set(fixedKeys);

        const releaseOrderMap = buildReleaseOrderMap(releaseOrderCharacterData);
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
            if (!it || !it.name) return;
            if (it.badge) badgeMap.set(it.name, it.badge);
            else badgeMap.delete(it.name);
        });

        return { orderedKeys: sortByBadge(merged, badgeMap), badgeMap };
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function finishPopularCard(card) {
        card.classList.remove('popular-card-pending');
        card.querySelector('.home-character-skeleton')?.remove();
        card.style.removeProperty('--popular-card-loading-opacity');
    }

    async function revealPopularCards(cards) {
        const pending = cards.filter(card => card.classList.contains('popular-card-pending'));
        if (!pending.length) return;

        // Keep the slot filled until its portrait is paintable, with a ceiling for slow requests.
        let deadline;
        await Promise.race([
            Promise.allSettled(pending.map(card => card.querySelector('img')?.decode?.())),
            new Promise(resolve => { deadline = window.setTimeout(resolve, 650); })
        ]);
        window.clearTimeout(deadline);

        const ready = pending.filter(card => card.isConnected && card.classList.contains('popular-card-pending'));
        if (!ready.length) return;
        if (reducedMotion.matches) {
            ready.forEach(finishPopularCard);
            return;
        }

        const interval = Math.min(0.034, 0.18 / Math.max(1, ready.length - 1));
        if (window.gsap) {
            window.gsap.fromTo(ready, { '--popular-card-loading-opacity': 1 }, {
                '--popular-card-loading-opacity': 0,
                duration: 0.28,
                ease: 'power1.inOut',
                stagger: interval,
                onComplete: () => ready.forEach(finishPopularCard)
            });
            return;
        }

        ready.forEach((card, index) => {
            const options = { duration: 280, delay: index * interval * 1000, easing: 'ease-in-out', fill: 'both' };
            const content = card.querySelector('.character-card-content');
            const placeholder = card.querySelector('.home-character-skeleton');
            const animations = [
                content.animate([{ opacity: 0 }, { opacity: 1 }], options),
                placeholder.animate([{ opacity: 1 }, { opacity: 0 }], options)
            ];
            Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
                finishPopularCard(card);
                animations.forEach(animation => animation.cancel());
            });
        });
    }

    function renderPopularCards(container, lang, orderedKeys, badgeMap, maxCount, krCharacterData) {
        if (!container) return;
        const cards = document.createDocumentFragment();
        const placeholders = !reducedMotion.matches && container.animate && 'IntersectionObserver' in window &&
            window.LufelPageEntrance?.setStaggerEffect
            ? container.querySelectorAll(':scope > .home-character-skeleton')
            : [];

        orderedKeys.slice(0, maxCount).forEach((characterKey, index) => {
            const card = document.createElement('div');
            card.className = 'character-card';
            const badge = (badgeMap && badgeMap.get) ? badgeMap.get(characterKey) : null;
            if (badge === 'NEW') card.classList.add('new');
            if (badge === 'HOT') card.classList.add('hot');

            const link = document.createElement('a');
            link.dataset.characterPrefetch = characterKey;
            link.setAttribute('data-character-prefetch-portrait', '');
            if (window.LanguageRouter && typeof window.LanguageRouter.buildCharacterDetailUrl === 'function') {
                link.href = window.LanguageRouter.buildCharacterDetailUrl(characterKey, lang);
            } else {
                const url = new URL(`${window.BASE_URL || ''}/character.html`, window.location.origin);
                url.searchParams.set('name', characterKey);
                url.searchParams.set('lang', lang);
                url.searchParams.set('v', window.APP_VERSION || Math.random().toString(36).substr(2, 5));
                link.href = url.pathname + url.search;
            }
            link.style.textDecoration = 'none';
            link.style.color = 'inherit';

            const imgWrap = document.createElement('div');
            imgWrap.className = 'character-card-img';
            const img = document.createElement('img');
            img.src = `${window.BASE_URL || ''}/assets/img/tier/${encodeURIComponent(characterKey)}.webp`;
            img.alt = characterKey;
            img.draggable = false;
            imgWrap.appendChild(img);
            link.appendChild(imgWrap);

            const textWrap = document.createElement('div');
            textWrap.className = 'character-card-text';
            const p = document.createElement('p');
            p.textContent = buildNameForLang(characterKey, lang, krCharacterData);
            textWrap.appendChild(p);

            const content = document.createElement('div');
            content.className = 'character-card-content';
            content.append(link, textWrap);
            card.appendChild(content);
            if (placeholders[index]) {
                card.classList.add('popular-card-pending');
                card.appendChild(placeholders[index]);
            }
            cards.appendChild(card);
        });
        container.replaceChildren(cards);
    }

    async function loadPopularCharacters(lang, selectedRegion) {
        const popularRoot = document.querySelector('.popular-content');
        const container = document.getElementById('popular-character-cards');
        if (!popularRoot || !container) return;

        bindMouseDragScroll(container);

        const maxCount = getMaxCountFromDom(popularRoot);
        const staticAssetUrl = (path) => window.getHomeStaticAssetUrl
            ? window.getHomeStaticAssetUrl(path)
            : `${window.BASE_URL || ''}${path}`;
        const existingKr = (window.characterData && Object.keys(window.characterData).length)
            ? { characterList: window.characterList, characterData: window.characterData }
            : null;

        const [kr, glb] = await Promise.all([
            existingKr || fetchCharactersData(staticAssetUrl('/data/character_info.js')),
            shouldUseGlbReleaseOrder(selectedRegion)
                ? fetchCharactersData(staticAssetUrl('/data/character_info_glb.js'))
                : Promise.resolve(null)
        ]);

        const krCharacterData = (kr && kr.characterData) ? kr.characterData : {};
        const useGlbReleaseOrder = shouldUseGlbReleaseOrder(selectedRegion) && glb && glb.characterData;
        const releaseOrderCharacterData = useGlbReleaseOrder ? glb.characterData : krCharacterData;
        const releaseOrderCharacterList = useGlbReleaseOrder && glb && glb.characterList
            ? glb.characterList
            : ((kr && kr.characterList) ? kr.characterList : null);

        const resolved = resolvePopularCharacters(getPopularListKey(selectedRegion), releaseOrderCharacterData);

        const allowedSet = getAllowedCharacterSet(releaseOrderCharacterList);
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
        window.LufelNavigationPrefetch?.prepareHomePrefetch(container, async () => {
            const globalRoster = lang === 'en' || lang === 'jp';
            const roster = globalRoster ? (glb || await fetchCharactersData(staticAssetUrl('/data/character_info_glb.js'))) : kr;
            if (!roster) return [];

            const { mainParty = [], supportParty = [] } = roster.characterList || {};
            const { characterData: rosterData = {} } = roster;
            const order = key => rosterData[key].release_order ?? krCharacterData[key].release_order ?? 0;
            return [...mainParty, ...supportParty]
                .filter(key => key !== '원더' && krCharacterData[key] && rosterData[key])
                .sort((a, b) => order(b) - order(a) || krCharacterData[b].rarity - krCharacterData[a].rarity);
        });
        return { empty: orderedKeys.length === 0 };
    }

    let activeLoad;
    let loadedSelection;

    async function initPopularCharacters() {
        while (activeLoad) await activeLoad;

        const lang = getCurrentLang();
        const region = loadRegion();
        const selection = `${lang}:${getPopularListKey(region)}`;
        if (selection === loadedSelection) return;

        const load = () => loadPopularCharacters(lang, region);
        activeLoad = window.HomeSectionState
            ? window.HomeSectionState.run('popular-characters', load)
            : load();
        try {
            if (await activeLoad) loadedSelection = selection;
        } finally {
            activeLoad = null;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('popular-character-cards');
        if (container) {
            window.LufelPageEntrance?.setStaggerEffect?.(container, cards => {
                revealPopularCards(cards);
                return true;
            });
            reducedMotion.addEventListener('change', event => {
                if (event.matches) container.querySelectorAll('.popular-card-pending').forEach(finishPopularCard);
            });
            if (!reducedMotion.matches) window.loadLufelGSAP?.();
        }
        initPopularCharacters();
        window.addEventListener('languageDetected', initPopularCharacters);
    });
})();
