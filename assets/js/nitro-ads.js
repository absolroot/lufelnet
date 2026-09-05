(function () {
    'use strict';

    const PLACEMENT_PRESETS = {
        banner: {
            sizes: [
                [970, 90],
                [728, 90],
                [320, 50]
            ]
        },
        leaderboard: {
            sizes: [
                [728, 90],
                [320, 50]
            ]
        },
        rectangle: {
            sizes: [
                [300, 250]
            ]
        },
        incontent: {
            fitToContainer: true,
            sizes: [
                [300, 250],
                [970, 90],
                [728, 90],
                [320, 100],
                [320, 50]
            ]
        },
        article: {
            format: 'article',
            articleOffsetTop: 0,
            pageInterval: 3,
            report: {
                enabled: true,
                icon: true,
                wording: 'Report Ad',
                position: 'bottom-right'
            }
        }
    };

    const ASTROLABE_PATH = /^\/(?:(?:kr|en|jp|cn)\/)?astrolabe\/?$/i;
    const MAPS_PATH = /^\/(?:(?:kr|en|jp|cn)\/)?maps\/?$/i;
    const GALLERY_PATH = /^\/(?:(?:kr|en|jp|cn)\/)?gallery\/?$/i;

    const GLOBAL_PLACEMENTS = [
        {
            id: 'Sticky-1',
            excludedPaths: [
                ASTROLABE_PATH,
                MAPS_PATH
            ],
            options: {
                format: 'rail',
                sizes: [
                    [300, 600],
                    [160, 600]
                ],
                rail: 'right',
                railOffsetTop: 0,
                railOffsetBottom: 0,
                railCollisionWhitelist: [
                    '.container',
                    '.carousel-slide',
                    '.slide-bg',
                    '.slide-left',
                    '.page-bottom-container'
                ],
                railCloseColor: '#666666',
                railSpacing: 10,
                railStack: false,
                railStickyTop: 0,
                railVerticalAlign: 'center',
                refreshTime: 30,
                refreshVisibleOnly: true,
                refreshLimit: 0,
                mediaQuery: '(min-width: 1860px)'
            }
        },
        {
            id: 'anchor-map',
            includedPaths: [MAPS_PATH],
            options: {
                format: 'anchor-v2',
                anchor: 'bottom',
                anchorBgColor: 'rgb(0 0 0 / 80%)',
                anchorClose: true,
                anchorPersistClose: false,
                anchorStickyOffset: 0,
                mediaQuery: '(min-width: 0px)'
            }
        },
        {
            id: 'anchor-astrolabe',
            includedPaths: [ASTROLABE_PATH],
            options: {
                format: 'anchor-v2',
                anchor: 'bottom',
                anchorBgColor: 'rgb(0 0 0 / 80%)',
                anchorClose: true,
                anchorPersistClose: false,
                anchorStickyOffset: 0,
                mediaQuery: '(min-width: 0px)'
            }
        }
    ];

    const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
    const RIGHT_RAIL_CONTENT_GAP_MIN = 48;
    const RIGHT_RAIL_CONTENT_GAP_MAX = 72;
    const RIGHT_RAIL_WIDE_VIEWPORT_MIN = 2560;
    const RIGHT_RAIL_WIDE_VIEWPORT_CONTENT_GAP_MAX = 96;
    const GALLERY_RIGHT_RAIL_CONTENT_GAP_MAX = 128;
    const RIGHT_RAIL_VERTICAL_SHIFT = 90;
    const PLACEMENT_VISIBLE_MARGIN = 1200;
    const MAX_PLACEMENT_VISIBLE_MARGIN = 4000;
    const MOBILE_BANNER_MEDIA_QUERY = '(max-width: 768px)';
    const isLocalDemo = LOCAL_HOSTNAMES.has(window.location.hostname);
    const initializedGlobalPlacements = new Set();
    let contentReady = Boolean(window.LufelPageLifecycle?.isReady?.());

    function resolveGlobalPlacementOptions(placement) {
        const options = { ...placement.options };
        if (options.format !== 'rail' || options.rail !== 'right') return options;

        const mainWrapper = document.querySelector('.main-wrapper');
        const railSizes = options.sizes || [];
        if (!mainWrapper || !railSizes.length) return null;

        const viewportWidth = document.documentElement.clientWidth;
        const mainWrapperStyles = window.getComputedStyle(mainWrapper);
        const contentRight = mainWrapper.getBoundingClientRect().right
            - (Number.parseFloat(mainWrapperStyles.paddingRight) || 0);
        const minimumRailSpacing = Number.isFinite(options.railSpacing) ? options.railSpacing : 10;
        const availableRailWidth = Math.floor(
            viewportWidth - contentRight - RIGHT_RAIL_CONTENT_GAP_MIN - minimumRailSpacing
        );
        const fittingRailSizes = railSizes.filter(([width]) => width <= availableRailWidth);
        if (!fittingRailSizes.length) return null;

        options.sizes = fittingRailSizes;

        const railWidth = Math.max(...fittingRailSizes.map(([width]) => width));
        const railHeight = Math.max(...fittingRailSizes.map(([, height]) => height));
        const maximumContentGap = GALLERY_PATH.test(window.location.pathname)
            ? GALLERY_RIGHT_RAIL_CONTENT_GAP_MAX
            : viewportWidth >= RIGHT_RAIL_WIDE_VIEWPORT_MIN
                ? RIGHT_RAIL_WIDE_VIEWPORT_CONTENT_GAP_MAX
                : RIGHT_RAIL_CONTENT_GAP_MAX;
        const contentGap = Math.min(
            maximumContentGap,
            Math.max(
                RIGHT_RAIL_CONTENT_GAP_MIN,
                Math.floor(viewportWidth - contentRight - railWidth - minimumRailSpacing)
            )
        );
        const contentAlignedSpacing = Math.floor(
            viewportWidth - contentRight - railWidth - contentGap
        );

        options.railSpacing = Math.max(minimumRailSpacing, contentAlignedSpacing);

        if (railHeight) {
            const centeredTop = Math.floor((window.innerHeight - railHeight) / 2);
            const elevatedTop = Math.max(0, centeredTop - RIGHT_RAIL_VERTICAL_SHIFT);

            options.railVerticalAlign = 'top';
            options.railOffsetTop = elevatedTop;
            options.railStickyTop = elevatedTop;
        }

        return options;
    }

    function createAd(id, options, resetInitializedState) {
        if (typeof window.LufelNitroAds?.recordDebugTiming === 'function') {
            window.LufelNitroAds.recordDebugTiming('request', { id });
        }

        Promise.resolve(window.nitroAds.createAd(id, {
            demo: isLocalDemo,
            report: {
                enabled: true,
                icon: true,
                wording: 'Report Ad',
                position: 'top-right'
            },
            ...options
        })).catch((error) => {
            resetInitializedState();
            console.error(`[NitroAds] Failed to create placement: ${id}`, error);
        });
    }

    function createPlacement(slot) {
        if (!slot.id || slot.dataset.nitroInitialized === 'true') return;
        if (slot.dataset.nitroStartAfter === 'content-ready' && !contentReady) return;

        const format = slot.dataset.nitroFormat || 'banner';
        const mediaQuery = slot.dataset.nitroMediaQuery;
        const basePreset = PLACEMENT_PRESETS[format];
        if (!basePreset) {
            console.warn(`[NitroAds] Unknown placement format: ${format}`);
            return;
        }

        const { fitToContainer = false, ...baseOptions } = basePreset;
        let preset = baseOptions;
        if (
            (format === 'banner' || format === 'leaderboard')
            && window.matchMedia(MOBILE_BANNER_MEDIA_QUERY).matches
        ) {
            preset = {
                ...preset,
                sizes: preset.sizes.filter(([width, height]) => width <= 320 && height <= 50)
            };
        }
        if (fitToContainer) {
            const container = slot.closest('.nitro-ad-container') || slot;
            const availableWidth = Math.floor(container.getBoundingClientRect().width);
            const fittingSizes = preset.sizes.filter(([width]) => width <= availableWidth);
            if (!fittingSizes.length) return;
            preset = { ...preset, sizes: fittingSizes };
        }

        const requestedVisibleMargin = Number.parseInt(slot.dataset.nitroVisibleMargin, 10);
        const visibleMargin = Number.isFinite(requestedVisibleMargin)
            ? Math.max(0, Math.min(MAX_PLACEMENT_VISIBLE_MARGIN, requestedVisibleMargin))
            : PLACEMENT_VISIBLE_MARGIN;

        slot.dataset.nitroInitialized = 'true';

        createAd(slot.id, {
            ...preset,
            ...(mediaQuery ? { mediaQuery } : {}),
            visibleMargin,
            ...(format === 'article' && window.matchMedia('(max-width: 768px)').matches ? { pageInterval: 4 } : {}),
            ...(slot.dataset.nitroRenderVisibleOnly === 'true' ? {
                renderVisibleOnly: true
            } : {}),
        }, () => {
            delete slot.dataset.nitroInitialized;
        });
    }

    function watchPlaceholder(slot) {
        const container = slot.closest('.nitro-ad-container--with-placeholder');
        if (!container || slot.dataset.nitroPlaceholderWatching === 'true') return;

        const hasVisibleCreative = () => {
            const bidder = String(slot.dataset.bidder || '').trim().toLowerCase();
            if (!bidder || bidder === 'blank') return false;

            if (slot.matches('[data-ad-status="filled"]') || slot.querySelector('[data-ad-status="filled"]')) {
                return true;
            }

            return Array.from(slot.querySelectorAll('iframe')).some((iframe) => {
                const rect = iframe.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            });
        };

        const syncPlaceholder = () => {
            // Nitro can create a Google query ID and a zero-height iframe for a
            // no-fill auction. Keep the reserved space for a later refresh, but
            // do not hide the placeholder until a real creative is visible.
            container.classList.toggle('nitro-ad-container--has-content', hasVisibleCreative());
        };

        slot.dataset.nitroPlaceholderWatching = 'true';
        const observer = new MutationObserver(syncPlaceholder);
        observer.observe(container, { childList: true, subtree: true, attributes: true });
        syncPlaceholder();
    }

    function createGlobalPlacement(placement) {
        if (!placement.id || initializedGlobalPlacements.has(placement.id)) return;
        if (placement.includedPaths && !placement.includedPaths.some((pattern) => pattern.test(window.location.pathname))) return;
        if (placement.excludedPaths?.some((pattern) => pattern.test(window.location.pathname))) return;

        const options = resolveGlobalPlacementOptions(placement);
        if (!options) return;

        initializedGlobalPlacements.add(placement.id);
        createAd(placement.id, options, () => {
            initializedGlobalPlacements.delete(placement.id);
        });
    }

    function initializePlacements() {
        document.querySelectorAll('[data-nitro-ad]').forEach((slot) => {
            watchPlaceholder(slot);
            createPlacement(slot);
        });
        GLOBAL_PLACEMENTS.forEach(createGlobalPlacement);
    }

    function initializeContentReadyPlacements() {
        contentReady = true;
        document.querySelectorAll('[data-nitro-ad][data-nitro-start-after="content-ready"]').forEach((slot) => {
            watchPlaceholder(slot);
            createPlacement(slot);
        });
    }

    window.LufelNitroAds = window.LufelNitroAds || {};
    window.LufelNitroAds.initializePlacements = initializePlacements;

    document.addEventListener('lufel:content-ready', initializeContentReadyPlacements, { once: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlacements, { once: true });
    } else {
        initializePlacements();
    }
})();
