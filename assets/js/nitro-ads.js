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
            ],
            mediaQuery: '(min-width: 769px)'
        }
    };

    const ASTROLABE_PATH = /^\/(?:(?:kr|en|jp|cn)\/)?astrolabe\/?$/i;
    const MAPS_PATH = /^\/(?:(?:kr|en|jp|cn)\/)?maps\/?$/i;

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
                    '.slide-left'
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
    const RIGHT_RAIL_CONTENT_GAP = 48;
    const RIGHT_RAIL_VERTICAL_SHIFT = 90;
    const isLocalDemo = LOCAL_HOSTNAMES.has(window.location.hostname);
    const initializedGlobalPlacements = new Set();

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
            viewportWidth - contentRight - RIGHT_RAIL_CONTENT_GAP - minimumRailSpacing
        );
        const fittingRailSizes = railSizes.filter(([width]) => width <= availableRailWidth);
        if (!fittingRailSizes.length) return null;

        options.sizes = fittingRailSizes;

        const railWidth = Math.max(...fittingRailSizes.map(([width]) => width));
        const railHeight = Math.max(...fittingRailSizes.map(([, height]) => height));
        const contentAlignedSpacing = Math.floor(
            viewportWidth - contentRight - railWidth - RIGHT_RAIL_CONTENT_GAP
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
        Promise.resolve(window.nitroAds.createAd(id, {
            demo: isLocalDemo,
            delayLoading: true,
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

        const format = slot.dataset.nitroFormat || 'banner';
        const preset = PLACEMENT_PRESETS[format];
        if (!preset) {
            console.warn(`[NitroAds] Unknown placement format: ${format}`);
            return;
        }

        slot.dataset.nitroInitialized = 'true';

        createAd(slot.id, {
            ...preset,
        }, () => {
            delete slot.dataset.nitroInitialized;
        });
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
        document.querySelectorAll('[data-nitro-ad]').forEach(createPlacement);
        GLOBAL_PLACEMENTS.forEach(createGlobalPlacement);
    }

    window.LufelNitroAds = window.LufelNitroAds || {};
    window.LufelNitroAds.initializePlacements = initializePlacements;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlacements, { once: true });
    } else {
        initializePlacements();
    }
})();
