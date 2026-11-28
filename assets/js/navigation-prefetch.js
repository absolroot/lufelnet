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
    const automaticPortraitConcurrency = 2;
    const latestCharacterCount = 4;
    const initialCharacterFiles = ['setting', 'base_stats', 'review'];

    const characters = new Set();
    const characterResources = new Set();
    const portraits = new Set();
    const intentPortraits = new Set();
    const documents = new Set();
    let pendingIntent;
    let pendingSelection;
    let portraitQueue = [];
    let activePortraits = 0;
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

    function warmCharacterResources(name, files) {
        const hashes = window.__CHARACTER_INITIAL_RESOURCE_HASHES;
        if (!hashes || !Object.hasOwn(hashes, name)) return;
        for (const file of files || Object.keys(hashes[name])) {
            const hash = hashes[name][file];
            if (!hash) continue;
            const url = basePath + '/data/characters/' + encodeURIComponent(name) + '/' + file + '.js?h=' + hash;
            if (characterResources.has(url)) continue;
            characterResources.add(url);
            if (file === 'party' || file === 'innate') {
                fetch(url, { priority: 'low' }).then(response => {
                    if (!response.ok) characterResources.delete(url);
                }).catch(() => characterResources.delete(url));
                continue;
            }
            const hint = document.createElement('link');
            hint.rel = 'prefetch';
            hint.as = 'script';
            hint.href = url;
            hint.onerror = () => characterResources.delete(url);
            document.head.appendChild(hint);
        }
    }

    function warmCharacter(name) {
        const index = window.__CHARACTER_INITIAL_RESOURCE_HASHES;
        if (!index || !Object.hasOwn(index, name) || characters.has(name) || characters.size >= characterLimit) return false;

        characters.add(name);
        warmCharacterResources(name, initialCharacterFiles);
        return true;
    }

    function prefetchCharacters(names) {
        if (!canPrefetch()) return;
        const hashes = window.__CHARACTER_INITIAL_RESOURCE_HASHES;
        const selection = [...new Set(names)].filter(name => hashes && Object.hasOwn(hashes, name));
        selection.forEach(name => warmCharacterResources(name));
        portraitQueue = selection.filter(name => !portraits.has(name));
        drainPortraitQueue();
    }

    function prepareCharacterPrefetch(readNames) {
        const run = () => {
            if (pendingSelection !== run) return;
            pendingSelection = undefined;
            if (canPrefetch()) prefetchCharacters(readNames());
        };
        pendingSelection = run;
        if (document.readyState === 'complete') setTimeout(run, 0);
        else window.addEventListener('load', run, { once: true });
    }

    function drainPortraitQueue() {
        while (canPrefetch() && activePortraits < automaticPortraitConcurrency && portraitQueue.length) {
            const name = portraitQueue.shift();
            if (portraits.has(name)) continue;
            activePortraits++;
            warmPortrait(name, () => {
                activePortraits--;
                drainPortraitQueue();
            });
        }
    }

    function warmPortrait(name, complete) {
        portraits.add(name);
        const image = new Image();
        image.fetchPriority = 'low';
        image.onload = complete;
        image.onerror = () => {
            portraits.delete(name);
            intentPortraits.delete(name);
            complete?.();
        };
        image.src = basePath + '/assets/img/character-detail/' + encodeURIComponent(name) + '.webp';
    }

    function prepareHomePrefetch(readRoster) {
        homePrefetch = readRoster;
        if (homePrefetchScheduled) return;
        homePrefetchScheduled = true;

        async function warmHome() {
            if (!canPrefetch()) return;
            try {
                const names = await homePrefetch();
                if (!canPrefetch()) return;
                prefetchCharacters(names.slice(0, latestCharacterCount));
                for (const name of names.slice(0, latestCharacterCount)) {
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
                if (link.hasAttribute('data-character-prefetch-portrait') && !portraits.has(name) &&
                    intentPortraits.size < portraitLimit) {
                    intentPortraits.add(name);
                    warmPortrait(name);
                }
            } else {
                warmDocument(url.pathname);
            }
        }, name ? characterDelay : documentDelay);
        pendingIntent = { link, timer };
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
        else drainPortraitQueue();
    });

    window.LufelNavigationPrefetch = { prepareHomePrefetch, prepareCharacterPrefetch, latestCharacterCount };
})();
