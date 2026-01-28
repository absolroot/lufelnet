// Astrolabe Main Entry Point
(function () {
  let countdownTimer = null;
  let endTimeUTC = null;

  async function init() {
    // Initialize i18n
    AstrolabeI18n.init();

    // Update UI text
    updateUIText();

    // Get region
    const region = AstrolabeI18n.loadRegion();

    // Show loading
    const loadingEl = document.getElementById('astrolabe-loading');
    if (loadingEl) loadingEl.style.display = 'flex';

    try {
      // Load data
      const data = await AstrolabeDataLoader.loadData(region);
      const nodes = AstrolabeDataLoader.getNodes(data);

      // Preload images
      const imageCache = await AstrolabeDataLoader.preloadImages(nodes);

      // Initialize canvas
      const canvas = document.getElementById('astrolabe-canvas');
      if (canvas) {
        AstrolabeCanvasRenderer.init(canvas);
        AstrolabeCanvasRenderer.setData(nodes, imageCache);

        // Handle node selection
        canvas.addEventListener('nodeSelected', (e) => {
          const { nodeId, node } = e.detail;
          if (node) {
            AstrolabeNodeDetail.show(node);
          }
        });
      }

      // Initialize detail panel
      const detailPanel = document.getElementById('node-detail-panel');
      if (detailPanel) {
        AstrolabeNodeDetail.init(detailPanel);
      }

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

  function updateUIText() {
    // Title
    const titleEl = document.getElementById('astrolabe-title');
    if (titleEl) titleEl.textContent = AstrolabeI18n.t('title');

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
})();
