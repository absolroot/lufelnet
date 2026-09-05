(function () {
  'use strict';

  const RETRY_DELAY_MS = 2000;
  const RETRY_LIMIT = 1;

  function getLang() {
    try {
      if (window.HomeI18n && typeof window.HomeI18n.detectRawLang === 'function') return window.HomeI18n.detectRawLang();
    } catch (_) { }
    return 'kr';
  }

  function text(key, fallback) {
    try {
      if (window.HomeI18n && typeof window.HomeI18n.t === 'function') return window.HomeI18n.t(key, fallback, getLang());
    } catch (_) { }
    return fallback;
  }

  function rootFor(id) {
    return document.querySelector(`[data-home-section="${id}"]`);
  }

  function clearStatus(root) {
    root.querySelectorAll('.home-section-status, .home-section-announcement').forEach((node) => node.remove());
  }

  function announce(root, message) {
    const live = document.createElement('p');
    live.className = 'home-section-announcement sr-only';
    live.setAttribute('role', 'status');
    live.textContent = message;
    root.appendChild(live);
  }

  function setState(id, state, options) {
    const root = rootFor(id);
    if (!root) return;
    const opts = options || {};
    root.dataset.homeState = state;
    root.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
    clearStatus(root);

    if (state === 'loading') {
      root.classList.remove('home-section-ready');
      if (!root.children.length) {
        const loading = document.createElement('div');
        loading.className = 'home-section-status home-section-status--loading';
        loading.setAttribute('role', 'status');
        loading.textContent = text('home_section_loading', 'Loading...');
        root.appendChild(loading);
      }
      return;
    }

    if (state === 'ready') {
      root.classList.remove('home-section-ready');
      window.requestAnimationFrame(() => root.classList.add('home-section-ready'));
      announce(root, text('home_section_ready', 'Content loaded.'));
      return;
    }

    if (state === 'empty' || state === 'error') {
      const status = document.createElement('div');
      status.className = `home-section-status home-section-status--${state}`;
      status.setAttribute('role', state === 'error' ? 'alert' : 'status');
      const message = state === 'empty'
        ? text('home_section_empty', 'Nothing to show right now.')
        : text('home_section_error', 'Unable to load this section.');
      status.append(document.createTextNode(message));
      if (state === 'error' && typeof opts.retry === 'function') {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'home-section-retry';
        button.textContent = text('home_section_retry', 'Try again');
        button.setAttribute('aria-label', text('home_section_retry_aria', 'Retry loading this section.'));
        button.addEventListener('click', opts.retry, { once: true });
        status.appendChild(button);
      }
      root.replaceChildren(status);
      return;
    }
  }

  async function run(id, task) {
    const execute = async (attempt) => {
      setState(id, 'loading');
      try {
        const result = await task();
        if (result && result.empty) setState(id, 'empty');
        else setState(id, 'ready');
        return result;
      } catch (error) {
        if (attempt < RETRY_LIMIT) {
          await new Promise((resolve) => window.setTimeout(resolve, RETRY_DELAY_MS));
          return execute(attempt + 1);
        }
        setState(id, 'error', { retry: () => run(id, task) });
        try { console.error(`[home-section:${id}]`, error); } catch (_) { }
        return null;
      }
    };
    return execute(0);
  }

  window.HomeSectionState = { run, setState };
})();
