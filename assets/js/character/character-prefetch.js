(function () {
    'use strict';

    const portraitSelector = 'a[data-character-prefetch]';
    const warmedImages = new Set();
    let portraitTimer;
    let pendingPortrait;
    let readRoster;
    let rosterIntent = false;

    function canPrefetch() {
        const connection = navigator.connection;
        return document.visibilityState === 'visible' && navigator.onLine &&
            !connection?.saveData && !['slow-2g', '2g', '3g'].includes(connection?.effectiveType);
    }

    function warmImage(directory, filename) {
        const base = typeof BASE_URL === 'string' ? BASE_URL : '';
        const url = `${base}/assets/img/${directory}/${filename}.webp`;
        if (warmedImages.has(url)) return;

        warmedImages.add(url);
        const image = new Image();
        image.fetchPriority = 'low';
        image.onerror = () => warmedImages.delete(url);
        image.src = url;
    }

    function schedulePortrait(link) {
        if (!canPrefetch() || pendingPortrait === link) return;
        clearTimeout(portraitTimer);
        pendingPortrait = link;
        portraitTimer = setTimeout(() => {
            pendingPortrait = null;
            if (link.isConnected && canPrefetch()) {
                warmImage('character-detail', encodeURIComponent(link.dataset.characterPrefetch));
            }
        }, 140);
    }

    function cancelPortrait(link) {
        if (pendingPortrait !== link) return;
        clearTimeout(portraitTimer);
        pendingPortrait = null;
    }

    function isRosterLink(link) {
        if (!link) return false;
        const { origin, pathname } = new URL(link.href);
        const base = typeof BASE_URL === 'string' ? BASE_URL : '';
        return origin === location.origin && pathname.startsWith(`${base}/`) &&
            /^\/(?:(?:kr|en|jp|cn)\/)?character\/?$/.test(pathname.slice(base.length));
    }

    async function warmRoster() {
        if (!canPrefetch()) return;
        if (!readRoster) {
            rosterIntent = true;
            return;
        }
        rosterIntent = false;
        const read = readRoster;
        readRoster = null;
        try {
            const names = await read();
            if (canPrefetch()) {
                // The list uses the literal character name in its image URL.
                names.slice(0, 3).forEach(name => warmImage('character-cards', name));
            }
        } catch (_) {
            // Prefetch is optional. Navigation uses its own resource loading.
        }
    }

    function prepareHomeRoster(read) {
        readRoster = read;
        if (rosterIntent) {
            void warmRoster();
            return;
        }
        if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const scheduleIdle = () => {
            if ('requestIdleCallback' in window) requestIdleCallback(warmRoster);
            else setTimeout(warmRoster, 400);
        };
        const schedule = () => {
            const worker = navigator.serviceWorker;
            if (!worker || worker.controller) {
                scheduleIdle();
                return;
            }

            // On a first visit the existing worker registers after window.load.
            const start = () => {
                clearTimeout(fallback);
                worker.removeEventListener('controllerchange', start);
                scheduleIdle();
            };
            const fallback = setTimeout(start, 800);
            worker.addEventListener('controllerchange', start);
        };
        if (document.readyState === 'complete') schedule();
        else window.addEventListener('load', schedule, { once: true });
    }

    document.addEventListener('pointerover', event => {
        if (event.pointerType === 'touch') return;
        const link = event.target.closest('a[href]');
        if (!link || link.contains(event.relatedTarget)) return;
        if (link.matches(portraitSelector)) schedulePortrait(link);
        else if (isRosterLink(link)) void warmRoster();
    });

    document.addEventListener('pointerout', event => {
        const link = event.target.closest(portraitSelector);
        if (link && !link.contains(event.relatedTarget) && !link.matches(':focus-visible')) {
            cancelPortrait(link);
        }
    });

    document.addEventListener('focusin', event => {
        const link = event.target.closest('a[href]');
        if (!link?.matches(':focus-visible')) return;
        if (link.matches(portraitSelector)) schedulePortrait(link);
        else if (isRosterLink(link)) void warmRoster();
    });

    document.addEventListener('focusout', event => {
        const link = event.target.closest(portraitSelector);
        if (link && !link.matches(':hover')) cancelPortrait(link);
    });

    document.addEventListener('click', event => {
        if (event.target.closest('.hamburger-btn.active')) void warmRoster();
    });

    window.LufelCharacterPrefetch = { prepareHomeRoster };
})();
