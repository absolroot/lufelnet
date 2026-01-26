(function () {
  function getBaseUrl() {
    if (typeof BASE_URL !== 'undefined') return BASE_URL;
    if (typeof window !== 'undefined' && window.SITE_BASEURL) return window.SITE_BASEURL;
    return '';
  }

  function ensurePersonaFilesLoaded(callback) {
    const w = (typeof window !== 'undefined') ? window : globalThis;
    if (!w.personaFiles) w.personaFiles = {};

    // 내부 상태 캐시
    const state = w.__personaLoaderState || (w.__personaLoaderState = {
      loaded: false,
      loading: false,
      callbacks: []
    });

    if (state.loaded) {
      if (typeof callback === 'function') {
        try { callback(); } catch (_) { /* noop */ }
      }
      return;
    }

    if (typeof callback === 'function') {
      state.callbacks.push(callback);
    }
    if (state.loading) return;

    state.loading = true;

    const order = Array.isArray(w.personaOrder) ? w.personaOrder.slice() : [];
    const nonOrder = Array.isArray(w.personaNonOrder) ? w.personaNonOrder.slice() : [];

    // Combine validation list
    const allItems = [
      ...order.map(name => ({ name, path: 'data/persona/' })),
      ...nonOrder.map(name => ({ name, path: 'data/persona/nonorder/' }))
    ];

    if (!allItems.length) {
      state.loaded = true;
      state.loading = false;
      const cbs = state.callbacks.slice();
      state.callbacks.length = 0;
      cbs.forEach(cb => { try { cb(); } catch (_) { /* noop */ } });
      return;
    }

    const base = getBaseUrl();
    const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : (typeof SITE_VERSION !== 'undefined' ? SITE_VERSION : '');
    let remaining = allItems.length;

    const done = () => {
      remaining--;
      if (remaining > 0) return;
      state.loaded = true;
      state.loading = false;
      const cbs = state.callbacks.slice();
      state.callbacks.length = 0;
      cbs.forEach(cb => { try { cb(); } catch (_) { /* noop */ } });
    };

    allItems.forEach(item => {
      try {
        const s = document.createElement('script');
        s.src = `${base}/${item.path}${encodeURIComponent(item.name)}.js${ver ? `?v=${ver}` : ''}`;
        s.async = true;
        s.onload = done;
        s.onerror = done;
        document.head.appendChild(s);
      } catch (_) {
        done();
      }
    });
  }

  if (typeof window !== 'undefined') {
    window.ensurePersonaFilesLoaded = ensurePersonaFilesLoaded;
  } else if (typeof globalThis !== 'undefined') {
    globalThis.ensurePersonaFilesLoaded = ensurePersonaFilesLoaded;
  }
})();


