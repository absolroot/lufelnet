(function(){
  async function ensureHtmlToImage(){
    if (window.htmlToImage) return;
    await new Promise((resolve, reject)=>{
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function capturePositionTiers(){
    const el = document.querySelector('.position-tiers-container');
    if (!el) return;
    await ensureHtmlToImage();

    const bodyBg = getComputedStyle(document.body).backgroundColor || '#000';
    const pixelRatio = Math.min(3, (window.devicePixelRatio || 1) * 2);

    try {
      const dataUrl = await htmlToImage.toPng(el, {
        backgroundColor: bodyBg,
        pixelRatio
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `position-tiers-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('[position-tiers capture] failed:', err);
    }
  }

  function createOrGetDownloadButton(){
    let btn = document.querySelector('.tier-download-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'tier-download-btn';
      // Icon-only button (no i18n text)
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4.007 4.007a1 1 0 0 1-1.414 0L7.279 11.707a1 1 0 1 1 1.414-1.414L11 12.586V4a1 1 0 0 1 1-1z"></path><path d="M5 18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a1 1 0 1 1 2 0v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a1 1 0 1 1 2 0v2z"></path></svg>';
      btn.title = 'Download';
      btn.style.display = 'inline-flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.gap = '6px';
      btn.style.width = '36px';
      btn.style.height = '32px';
      // Match .tier-source-btn styles
      btn.style.padding = '6px 10px';
      btn.style.borderRadius = '6px';
      btn.style.border = '1px solid rgba(255,255,255,0.2)';
      btn.style.background = 'rgba(255,255,255,0.08)';
      btn.style.color = 'rgba(255,255,255,0.9)';
      btn.style.cursor = 'pointer';
      btn.addEventListener('mouseenter', () => { btn.style.filter = 'brightness(1.1)'; });
      btn.addEventListener('mouseleave', () => { btn.style.filter = ''; });
      btn.addEventListener('click', capturePositionTiers);
    }
    return btn;
  }

  function injectDownloadButton(){
    const container = document.querySelector('.position-tiers-container');
    if (!container) return;

    const btn = createOrGetDownloadButton();

    // Prefer placing on the same row as tier-source-toggle (right side) when visible
    const toggle = document.getElementById('tier-source-toggle');
    const isToggleVisible = !!(toggle && (getComputedStyle(toggle).display !== 'none'));
    if (isToggleVisible) {
      // Make the toggle act as a toolbar row spanning container width
      toggle.style.width = 'min(1400px, 100%)';
      toggle.style.margin = '0 auto';
      toggle.style.display = 'flex';
      toggle.style.justifyContent = 'space-between';
      toggle.style.alignItems = 'center';
      // Append button to the right side (after existing left group)
      if (btn.parentElement !== toggle) {
        if (btn.parentElement) btn.parentElement.removeChild(btn);
        toggle.appendChild(btn);
      }
      return;
    }

    // Otherwise, create or reuse a toolbar ABOVE (outside) the container
    let toolbar = document.querySelector('.position-tiers-toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'position-tiers-toolbar';
      toolbar.style.width = 'min(1400px, 100%)';
      toolbar.style.margin = '0 auto';
      toolbar.style.display = 'flex';
      toolbar.style.justifyContent = 'flex-end';
      toolbar.style.alignItems = 'center';
      toolbar.style.gap = '8px';
      toolbar.style.marginTop = '8px';
      container.parentNode.insertBefore(toolbar, container);
    }

    if (btn.parentElement !== toolbar) {
      if (btn.parentElement) btn.parentElement.removeChild(btn);
      toolbar.appendChild(btn);
    }
  }

  function init(){
    injectDownloadButton();
  }

  document.addEventListener('DOMContentLoaded', init);
  window.capturePositionTiers = capturePositionTiers;
})(); 


