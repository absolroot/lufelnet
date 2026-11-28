(function () {
    'use strict';

    const characterSelector = 'a[data-character-prefetch][href]';
    const documentSelector = 'a.nav-section-item[href], #quick-grid a[href], a#popular-characters-title[href], a#show-more-characters-btn[href]';
    const intentSelector = characterSelector + ', ' + documentSelector;
    const basePath = typeof BASE_URL === 'string' ? BASE_URL : '';
    const characterDelay = 140;
    const documentDelay = 600;
    const characterLimit = 4;
    const portraitLimit = 2;
    const documentLimit = 2;
    const automaticTierLimit = 2;
    const homePreviewCount = 3;

    const characters = new Set();
    const portraits = new Set();
    const documents = new Set();
    let pendingIntent;
    let tierObserver;
    let automaticTierCount = 0;
    let homePrefetchScheduled = false;
    let homePrefetch;

    function canPrefetch() {
        const connection = navigator.connection;
        return document.visibilityState === 'visible' && navigator.onLine &&
            !connection?.saveData && !['slow-2g', '2g', '3g'].includes(connection?.effectiveType);
    }

    function destination(link) {
        const url = new URL(link.href);
        if (url.origin !== location.origin || !url.pathname.startsWith(basePath + '/') ||
            url.hash || url.href === location.href) return null;
        const path = url.pathname.slice(basePath.length);
        if (link.dataset.characterPrefetch) {
            const characterDetail = /^\/(?:kr|en|jp|cn)\/character\/[^/]+\/$/.test(path);
            const legacyDetail = path === '/character.html' && url.searchParams.has('name');
            return characterDetail || legacyDetail ? url : null;
        }
        return !url.search && /^\/(?:kr|en|jp|cn)\/(?:character|tier)\/$/.test(path) ? url : null;
    }

    function warmCharacter(name) {
        const index = window.__CHARACTER_INITIAL_RESOURCE_HASHES;
        if (!index || !Object.hasOwn(index, name) || characters.has(name) || characters.size >= characterLimit) return false;

        characters.add(name);
        for (const [file, hash] of Object.entries(index[name])) {
            const hint = document.createElement('link');
            hint.rel = 'prefetch';
            hint.as = 'script';
            hint.href = basePath + '/data/characters/' + encodeURIComponent(name) + '/' + file + '.js?h=' + hash;
            document.head.appendChild(hint);
        }
        return true;
    }

    function warmPortrait(name) {
        if (portraits.has(name) || portraits.size >= portraitLimit) return;

        portraits.add(name);
        const image = new Image();
        image.fetchPriority = 'low';
        image.onerror = () => portraits.delete(name);
        image.src = basePath + '/assets/img/character-detail/' + encodeURIComponent(name) + '.webp';
    }

    function prepareHomePrefetch(container, readRoster) {
        homePrefetch = { container, readRoster };
        if (homePrefetchScheduled) return;
        homePrefetchScheduled = true;

        async function warmHome() {
            if (!canPrefetch()) return;
            const { container: cards, readRoster: read } = homePrefetch;
            [...cards.querySelectorAll(characterSelector)].slice(0, homePreviewCount).forEach(link => {
                if (destination(link)) warmCharacter(link.dataset.characterPrefetch);
            });
            if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
            try {
                const names = await read();
                if (!canPrefetch()) return;
                for (const name of names.slice(0, homePreviewCount)) {
                    const image = new Image();
                    image.fetchPriority = 'low';
                    image.src = basePath + '/assets/img/character-cards/' + name + '.webp';
                }
            } catch (_) {
                // The roster page loads its own images if prefetching fails.
            }
        }

        const schedule = () => {
            const delay = navigator.serviceWorker && !navigator.serviceWorker.controller ? 800 : 400;
            setTimeout(() => {
                if ('requestIdleCallback' in window) requestIdleCallback(warmHome);
                else void warmHome();
            }, delay);
        };
        if (document.readyState === 'complete') schedule();
        else window.addEventListener('load', schedule, { once: true });
    }

    function warmDocument(path) {
        if (documents.has(path) || documents.size >= documentLimit ||
            !HTMLScriptElement.supports?.('speculationrules')) return;

        documents.add(path);
        const rules = document.createElement('script');
        rules.type = 'speculationrules';
        rules.textContent = JSON.stringify({ prefetch: [{ source: 'list', urls: [path] }] });
        document.head.appendChild(rules);
    }

    function cancelIntent(link) {
        if (link && pendingIntent?.link !== link) return;
        clearTimeout(pendingIntent?.timer);
        pendingIntent = undefined;
    }

    function scheduleIntent(link) {
        if (!canPrefetch() || pendingIntent?.link === link) return;
        const url = destination(link);
        if (!url) return;

        const name = link.dataset.characterPrefetch;
        cancelIntent();
        const timer = setTimeout(() => {
            pendingIntent = undefined;
            if (!link.isConnected || link.href !== url.href || !canPrefetch()) return;
            if (name) {
                warmCharacter(name);
                if (link.hasAttribute('data-character-prefetch-portrait')) warmPortrait(name);
            } else {
                warmDocument(url.pathname);
            }
        }, name ? characterDelay : documentDelay);
        pendingIntent = { link, timer };
    }

    function observeTopTierCharacters(container) {
        tierObserver?.disconnect();
        tierObserver = undefined;
        if (!container || !canPrefetch() || !('IntersectionObserver' in window) ||
            automaticTierCount >= automaticTierLimit) return;

        const cells = [...container.querySelectorAll('[data-tier-prefetch]')];
        const visibleCells = new Set();
        let idlePending = false;
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) visibleCells.add(entry.target);
                else visibleCells.delete(entry.target);
            }
            if (!visibleCells.size || idlePending) return;
            idlePending = true;

            const warmVisible = () => {
                idlePending = false;
                if (tierObserver !== observer || !canPrefetch() || pendingIntent) return;
                // Tier tiles are recreated when the board changes layout or drag mode.
                const links = cells.filter(cell => visibleCells.has(cell) && cell.isConnected)
                    .flatMap(cell => [...cell.querySelectorAll(characterSelector)]);
                for (const link of links) {
                    const bounds = link.getBoundingClientRect();
                    if (!bounds.width || !bounds.height || bounds.bottom <= 0 || bounds.top >= innerHeight ||
                        bounds.right <= 0 || bounds.left >= innerWidth || !destination(link)) continue;
                    if (warmCharacter(link.dataset.characterPrefetch)) automaticTierCount++;
                    if (automaticTierCount >= automaticTierLimit || characters.size >= characterLimit) {
                        observer.disconnect();
                        break;
                    }
                }
            };

            // Give the visible cards time to paint before warming their detail data.
            setTimeout(() => {
                if ('requestIdleCallback' in window) requestIdleCallback(warmVisible);
                else warmVisible();
            }, 700);
        });
        tierObserver = observer;
        cells.forEach(cell => observer.observe(cell));
    }

    document.addEventListener('pointerover', event => {
        if (event.pointerType !== 'mouse') return;
        const link = event.target.closest(intentSelector);
        if (link && !link.contains(event.relatedTarget)) scheduleIntent(link);
    });

    document.addEventListener('pointerout', event => {
        if (event.pointerType !== 'mouse') return;
        const link = event.target.closest(intentSelector);
        if (link && !link.contains(event.relatedTarget) && !link.matches(':focus-visible')) cancelIntent(link);
    });

    document.addEventListener('focusin', event => {
        const link = event.target.closest(intentSelector);
        if (link?.matches(':focus-visible')) scheduleIntent(link);
    });

    document.addEventListener('focusout', event => {
        const link = event.target.closest(intentSelector);
        if (link && !link.matches(':hover')) cancelIntent(link);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') cancelIntent();
    });

    window.LufelNavigationPrefetch = { observeTopTierCharacters, prepareHomePrefetch };
})();
