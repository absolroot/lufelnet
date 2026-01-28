// Node Detail Panel
const AstrolabeNodeDetail = (function () {
  let detailPanel = null;
  let currentNode = null;

  function init(panelElement) {
    detailPanel = panelElement;

    // Close on backdrop click (Only for mobile/standard modal view)
    detailPanel.addEventListener('click', (e) => {
      // On PC (>1600px), clicking the "transparent backdrop" (which allows pass-through via pointer-events:none anyway)
      // shouldn't close it. But since we use pointer-events: none on the container in CSS for >1600px, 
      // this event listener might not even fire for the background click on PC.
      // However, if we didn't use pointer-events: none, we would need this check.
      // Keeping it safe:
      if (window.innerWidth < 1600 && e.target === detailPanel) {
        hide();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && detailPanel.classList.contains('active')) {
        hide();
      }
    });

    // Delegate close button click
    detailPanel.addEventListener('click', (e) => {
      if (e.target.classList.contains('detail-close-btn') || e.target.closest('.detail-close-btn')) {
        hide();
      }
    });

    // Handle resize to adjust scroll lock
    window.addEventListener('resize', () => {
      if (detailPanel.classList.contains('active')) {
        if (window.innerWidth >= 1600) {
          document.body.style.overflow = '';
        } else {
          document.body.style.overflow = 'hidden';
          // Reset position on mobile shift if needed, or leave it (it's modal anyway)
          const content = detailPanel.querySelector('.detail-content');
          if (content) {
            content.style.top = '';
            content.style.left = '';
            content.style.bottom = '';
            content.style.right = '';
            content.style.transform = '';
          }
        }
      }
    });

    // Initialize Draggable Logic
    setupDraggable();
  }

  function setupDraggable() {
    const content = detailPanel.querySelector('.detail-content');
    if (!content) return;

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    // Use delegation on detailPanel because detail-header is dynamic
    detailPanel.addEventListener('mousedown', (e) => {
      // Check if clicking on header
      const header = e.target.closest('.detail-header');
      if (!header) return;

      // Don't drag if clicking buttons
      if (e.target.closest('button') || e.target.closest('.detail-close-btn')) return;

      // Only drag on PC > 1600
      if (window.innerWidth < 1600) return;

      isDragging = true;

      // Calculate current position to switch from CSS bottom/right to distinct top/left
      const rect = content.getBoundingClientRect();

      // Set explicit Top/Left based on current visual position
      // Important to clear bottom/right so top/left takes precedence
      content.style.bottom = 'auto';
      content.style.right = 'auto';
      content.style.left = `${rect.left}px`;
      content.style.top = `${rect.top}px`;

      startX = e.clientX;
      startY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      header.style.cursor = 'grabbing';

      e.preventDefault(); // Prevent text selection
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      content.style.left = `${initialLeft + dx}px`;
      content.style.top = `${initialTop + dy}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        // We can't easily reset cursor on header here because it might be recreated or mouse moved off
        // But we can try finding it again
        const header = detailPanel.querySelector('.detail-header');
        if (header) header.style.cursor = 'move';
      }
    });
  }

  function show(node) {
    if (!detailPanel || !node) return;

    currentNode = node;
    renderContent(node);
    detailPanel.classList.add('active');

    // Only lock scroll on smaller screens
    if (window.innerWidth < 1600) {
      document.body.style.overflow = 'hidden';
    }
  }

  function hide() {
    if (!detailPanel) return;
    detailPanel.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderContent(node) {
    const content = detailPanel.querySelector('.detail-content');
    if (!content) return;

    const lang = AstrolabeI18n.getLang();

    // Node name
    const nodeName = node.name || 'Unknown';

    // Enemies
    const enemies = node.enemy || [];

    // Affixes
    const affixes = node.affix || [];

    // Awards
    const awards = node.award || [];

    let html = `
      <div class="detail-header">
        <h2 class="detail-title">${escapeHtml(nodeName)}</h2>
        <button class="detail-close-btn" aria-label="${AstrolabeI18n.t('close')}">&times;</button>
      </div>

      <div class="detail-body">
    `;

    // Affixes section
    if (affixes.length > 0) {
      // Helper to highlight percentages
      const formatDesc = (desc) => {
        if (!desc) return '';
        const safeDesc = escapeHtml(desc);
        // Match 20%, 20.5%, 20/40/60%
        return safeDesc.replace(/(\d+(?:\.\d+)?(?:[\/]\d+(?:\.\d+)?)*%)/g, '<span class="highlight-percent">$1</span>');
      };

      html += `
        <div class="detail-section">
          <!-- Title removed as requested -->
          <div class="affix-list">
            ${affixes.map(a => `
              <div class="affix-item">
                <span class="affix-name">${escapeHtml(a.name || '')}</span>
                ${a.desc ? `<span class="affix-desc">${formatDesc(a.desc)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Enemies section
    if (enemies.length > 0) {
      html += `
        <div class="detail-section">
          <h3 class="section-title">${AstrolabeI18n.t('enemies')}</h3>
          <div class="enemy-list">
            ${enemies.map((e, i) => renderEnemy(e, i)).join('')}
          </div>
        </div>
      `;
    }

    // Awards section (optional, can be shown)
    if (awards.length > 0) {
      html += `
        <div class="detail-section">
          <h3 class="section-title">${AstrolabeI18n.t('rewards')}</h3>
          <div class="award-list">
            ${awards.map(a => `
              <div class="award-item">
                <img src="${AstrolabeConfig.BASE}/apps/astrolabe/img/${a.img}" alt="${escapeHtml(a.name)}" class="award-icon" onerror="this.style.display='none'">
                <span class="award-name">${escapeHtml(a.name || '')}</span>
                <span class="award-count">x${a.count || 0}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    html += `</div>`;

    content.innerHTML = html;
  }

  function renderEnemy(enemy, index) {
    const name = enemy.name || 'Unknown';
    const level = enemy.level || '?';

    return `
      <div class="enemy-item">
        <div class="enemy-header">
          <span class="enemy-name">${escapeHtml(name)}</span>
          <span class="enemy-level">${AstrolabeI18n.t('level')}${level}</span>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    init,
    show,
    hide
  };
})();
