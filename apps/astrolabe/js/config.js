// Astrolabe Configuration
const AstrolabeConfig = (function () {
  const REGIONS = ['cn', 'tw', 'sea', 'kr', 'en', 'jp'];
  const REGION_BASE_UTC = { cn: 8, tw: 8, sea: 8, kr: 9, en: 9, jp: 9 };

  const BASE = (typeof window !== 'undefined' && (window.BASE_URL || window.SITE_BASEURL)) || '';
  const APP_VER = (typeof window !== 'undefined' && window.APP_VERSION) || '';

  // Canvas settings
  const CANVAS_CONFIG = {
    // Base canvas size (will be scaled)
    baseWidth: 1200,
    baseHeight: 800,
    // Node settings
    nodeSize: 80,
    selectedNodeSize: 90,
    pinOffsetY: -50,
    // Connection line
    lineColor: 'rgba(120, 200, 255, 0.7)',
    lineWidth: 1.5,
    // Perspective (trapezoid effect - narrower at top)
    perspectiveRatio: 0.4, // top width = bottom width * ratio (lower = more perspective)
    // Coordinate scaling (stretch nodes horizontally)
    xScale: 1.2, // Horizontal stretch factor
    yScale: 0.45, // Vertical compression factor
    // Pan and zoom
    minZoom: 1.0,
    maxZoom: 2.75,
    zoomStep: 0.25
  };

  // Image paths
  const IMG_PATH = `${BASE}/apps/astrolabe/img/`;
  const DATA_PATH = `${BASE}/data/external/sandbox/`;

  return {
    REGIONS,
    REGION_BASE_UTC,
    BASE,
    APP_VER,
    CANVAS_CONFIG,
    IMG_PATH,
    DATA_PATH,

    getDataUrl: function (region) {
      return `${DATA_PATH}${region}.json${APP_VER ? `?v=${APP_VER}` : ''}`;
    },

    getImgUrl: function (filename) {
      return `${IMG_PATH}${filename}`;
    }
  };
})();
