// Node Detail Panel
const AstrolabeNodeDetail = (function () {
  let detailPanel = null;
  let currentNode = null;

  function init(panelElement) {
    detailPanel = panelElement;

    // Close on backdrop click
    detailPanel.addEventListener('click', (e) => {
      if (e.target === detailPanel) {
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
      if (e.target.classList.contains('detail-close-btn')) {
        hide();
      }
    });
  }

  function show(node) {
    if (!detailPanel || !node) return;

    currentNode = node;
    renderContent(node);
    detailPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
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
