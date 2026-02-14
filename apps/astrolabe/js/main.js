// Astrolabe Main Entry Point
(function () {
  let countdownTimer = null;
  let endTimeUTC = null;

  async function init() {
    // Initialize i18n
    await AstrolabeI18n.init();

    // Get region
    const region = AstrolabeI18n.loadRegion();

    // Update UI text
    await updateUIText();

    // Ensure URL has server param
    const url = new URL(window.location);
    if (url.searchParams.get('server') !== region) {
      url.searchParams.set('server', region);
      window.history.replaceState({}, '', url);
    }

    // Show loading
    const loadingEl = document.getElementById('astrolabe-loading');
    if (loadingEl) loadingEl.style.display = 'flex';

    try {
      // Load data
      const data = await AstrolabeDataLoader.loadData(region);
      const nodes = AstrolabeDataLoader.getNodes(data);

      // Preload images
      const imageCache = await AstrolabeDataLoader.preloadImages(nodes);

      // Initialize detail panel (Must be before auto-open logic)
      const detailPanel = document.getElementById('node-detail-panel');
      if (detailPanel) {
        AstrolabeNodeDetail.init(detailPanel);
      }

      // Initialize canvas
      const canvas = document.getElementById('astrolabe-canvas');
      if (canvas) {
        AstrolabeCanvasRenderer.init(canvas);
        AstrolabeCanvasRenderer.setData(nodes, imageCache);

        // Auto-select the first node for visual effect
        const firstNodeId = Object.keys(nodes)[0];
        if (firstNodeId) {
          AstrolabeCanvasRenderer.setSelectedNode(firstNodeId);

          // On PC (> 1600px), automatically show the detail panel for the first node
          if (window.innerWidth >= 1600) {
            AstrolabeNodeDetail.show(nodes[firstNodeId]);
          }
        }

        // Handle node selection
        canvas.addEventListener('nodeSelected', (e) => {
          const { nodeId, node } = e.detail;
          if (node) {
            AstrolabeNodeDetail.show(node);
          }
        });
      }

      // Initialize detail panel


      // Set up countdown
      endTimeUTC = AstrolabeDataLoader.getEndTime(data, region);
      updateCountdown();
      countdownTimer = setInterval(updateCountdown, 1000);

      // Set up zoom controls
      setupZoomControls();

      // Set up region selector
      setupRegionSelector(region);

    } catch (e) {
      console.error('Failed to initialize astrolabe:', e);
      const errorEl = document.getElementById('astrolabe-error');
      if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.textContent = 'Failed to load data. Please try again.';
      }
    } finally {
      if (loadingEl) loadingEl.style.display = 'none';
    }
  }

  async function updateUIText() {
    // Always sync UI language from current URL/router state before rendering texts.
    AstrolabeI18n.setLang(AstrolabeI18n.detectLang());
    await AstrolabeI18n.ensurePacksReady();

    // Page Title & Meta
    document.title = AstrolabeI18n.t('title') + " - P5X lufel.net";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', AstrolabeI18n.t('description'));
    }

    // Title
    const titleEl = document.getElementById('astrolabe-title');
    if (titleEl) titleEl.textContent = AstrolabeI18n.t('title');

    // Nav Title (Desktop)
    const navTitleEl = document.getElementById('astrolabe-title-nav');
    if (navTitleEl) navTitleEl.textContent = AstrolabeI18n.t('title');

    // Mobile Breadcrumb
    const mobileHome = document.querySelector('.mobile-breadcrumb .breadcrumb-item:not(.active)');
    if (mobileHome) mobileHome.textContent = AstrolabeI18n.t('home');

    const mobileActive = document.querySelector('.mobile-breadcrumb .breadcrumb-item.active');
    if (mobileActive) mobileActive.textContent = AstrolabeI18n.t('title');

    // Time label
    const timeLabelEl = document.getElementById('time-label');
    if (timeLabelEl) timeLabelEl.textContent = AstrolabeI18n.t('timeRemaining') + ':';

    // Navigation
    const homeLink = document.getElementById('nav-home');
    if (homeLink) homeLink.textContent = AstrolabeI18n.t('home');

    // Zoom buttons
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const resetBtn = document.getElementById('reset-btn');
    if (zoomInBtn) zoomInBtn.title = AstrolabeI18n.t('zoomIn');
    if (zoomOutBtn) zoomOutBtn.title = AstrolabeI18n.t('zoomOut');
    if (resetBtn) resetBtn.title = AstrolabeI18n.t('reset');
  }

  function updateCountdown() {
    const countdownEl = document.getElementById('countdown-value');
    if (!countdownEl) return;

    if (!endTimeUTC) {
      countdownEl.textContent = '-';
      return;
    }

    const remaining = endTimeUTC.getTime() - Date.now();
    countdownEl.textContent = AstrolabeI18n.formatCountdown(remaining);
  }

  function setupZoomControls() {
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => AstrolabeCanvasRenderer.zoomIn());
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => AstrolabeCanvasRenderer.zoomOut());
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => AstrolabeCanvasRenderer.resetView());
    }
  }

  function setupRegionSelector(currentRegion) {
    const selector = document.getElementById('region-selector');
    if (!selector) return;

    selector.value = currentRegion;
    selector.addEventListener('change', async (e) => {
      const newRegion = e.target.value;

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set('server', newRegion);
      window.history.pushState({}, '', url);

      // Keep current UI language. Server change is data-region switch only.
      await updateUIText();
      if (typeof AstrolabeNodeDetail !== 'undefined' && AstrolabeNodeDetail.refresh) {
        AstrolabeNodeDetail.refresh();
      }

      // Clear selection and pin
      if (AstrolabeCanvasRenderer.clearSelection) {
        AstrolabeCanvasRenderer.clearSelection();
      }

      // Close detail panel if open
      const detailPanel = document.getElementById('node-detail-panel');
      if (detailPanel) {
        detailPanel.classList.remove('active');
      }

      try {
        localStorage.setItem('carousel_region', newRegion);
      } catch (_) { }

      // Reload data
      const loadingEl = document.getElementById('astrolabe-loading');
      if (loadingEl) loadingEl.style.display = 'flex';

      try {
        const data = await AstrolabeDataLoader.loadData(newRegion);
        const nodes = AstrolabeDataLoader.getNodes(data);
        const imageCache = await AstrolabeDataLoader.preloadImages(nodes);

        AstrolabeCanvasRenderer.setData(nodes, imageCache);

        endTimeUTC = AstrolabeDataLoader.getEndTime(data, newRegion);
        updateCountdown();
      } catch (e) {
        console.error('Failed to load region data:', e);
      } finally {
        if (loadingEl) loadingEl.style.display = 'none';
      }
    });
  }

  // Start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Shooting Star Logic (CSS based)
  setInterval(() => {
    // Constraint: Only on PC > 1600px
    if (window.innerWidth < 1600) return;

    // Chance: 30% check every 2 seconds -> ~1 star every 6-7 seconds
    if (Math.random() > 0.3) return;

    spawnCSSStar();
  }, 2000);

  function spawnCSSStar() {
    const container = document.getElementById('shooting-star-container');
    if (!container) return;

    const star = document.createElement('div');
    star.classList.add('shooting-star');

    // Random start position
    // Top-left approach roughly
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * (window.innerHeight * 0.5) - 100;

    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;

    // Randomize duration slightly
    const duration = 1.5 + Math.random();
    star.style.animation = `shootingStarAnim ${duration}s linear forwards`;

    // Randomize length (width)
    const length = 100 + Math.random() * 80;
    star.style.width = `${length}px`;

    container.appendChild(star);

    // Clean up
    setTimeout(() => {
      if (star.parentNode) {
        star.parentNode.removeChild(star);
      }
    }, duration * 1000 + 100);
  }
})();
