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
      callbacks: [],
      total: 0,
      loadedCount: 0,
      failedCount: 0
    });

    const emitProgress = () => {
      if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
      try {
        window.dispatchEvent(new CustomEvent('persona-loader-progress', {
          detail: {
            loaded: Number(state.loadedCount || 0),
            total: Number(state.total || 0),
            failed: Number(state.failedCount || 0),
            isComplete: !!state.loaded
          }
        }));
      } catch (_) { /* noop */ }
    };

    if (state.loaded) {
      emitProgress();
      if (typeof callback === 'function') {
        try { callback(); } catch (_) { /* noop */ }
      }
      return;
    }

    if (typeof callback === 'function') {
      state.callbacks.push(callback);
    }
    if (state.loading) {
      emitProgress();
      return;
    }

    state.loading = true;

    const order = Array.isArray(w.personaOrder) ? w.personaOrder.slice() : [];
    const nonOrder = Array.isArray(w.personaNonOrder) ? w.personaNonOrder.slice() : [];

    // Combine validation list
    const allItems = [
      ...order.map(name => ({ name, path: 'data/persona/' })),
      ...nonOrder.map(name => ({ name, path: 'data/persona/nonorder/' }))
    ];

    state.total = allItems.length;
    state.loadedCount = 0;
    state.failedCount = 0;
    emitProgress();

    if (!allItems.length) {
      state.loaded = true;
      state.loading = false;
      emitProgress();
      const cbs = state.callbacks.slice();
      state.callbacks.length = 0;
      cbs.forEach(cb => { try { cb(); } catch (_) { /* noop */ } });
      return;
    }

    const base = getBaseUrl();
    const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : (typeof SITE_VERSION !== 'undefined' ? SITE_VERSION : '');
    let remaining = allItems.length;

    const done = (didFail = false) => {
      state.loadedCount += 1;
      if (didFail) state.failedCount += 1;
      remaining--;
      if (remaining > 0) {
        emitProgress();
        return;
      }
      state.loaded = true;
      state.loading = false;
      emitProgress();
      const cbs = state.callbacks.slice();
      state.callbacks.length = 0;
      cbs.forEach(cb => { try { cb(); } catch (_) { /* noop */ } });
    };

    allItems.forEach(item => {
      try {
        const s = document.createElement('script');
        s.src = `${base}/${item.path}${encodeURIComponent(item.name)}.js${ver ? `?v=${ver}` : ''}`;
        s.async = true;
        s.onload = () => done(false);
        s.onerror = () => done(true);
        document.head.appendChild(s);
      } catch (_) {
        done(true);
      }
    });
  }

  if (typeof window !== 'undefined') {
    window.ensurePersonaFilesLoaded = ensurePersonaFilesLoaded;
  } else if (typeof globalThis !== 'undefined') {
    globalThis.ensurePersonaFilesLoaded = ensurePersonaFilesLoaded;
  }
})();


