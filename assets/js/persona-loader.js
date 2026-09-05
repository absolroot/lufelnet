(function () {
  const DEFAULT_CONCURRENCY = 3;
  const SLOW_CONCURRENCY = 1;

  function getBaseUrl() {
    if (typeof BASE_URL !== 'undefined') return BASE_URL;
    if (typeof window !== 'undefined' && window.SITE_BASEURL) return window.SITE_BASEURL;
    return '';
  }

  function createState() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = connection && (connection.saveData || /2g/.test(connection.effectiveType || ''));
    return {
      queue: [],
      pending: new Map(),
      loaded: new Set(),
      active: 0,
      concurrency: isSlow ? SLOW_CONCURRENCY : DEFAULT_CONCURRENCY,
      idleHandle: null,
      cancelled: false
    };
  }

  function dispatchProgress() {
    const state = window.__personaLoaderState;
    if (!state) return;
    window.dispatchEvent(new CustomEvent('persona-loader-progress', {
      detail: {
        loaded: state.loaded.size,
        total: Object.keys(window.personaIndex || {}).length,
        active: state.active,
        queued: state.queue.length
      }
    }));
  }

  function schedule(immediate) {
    const state = window.__personaLoaderState;
    if (!state || state.cancelled || state.idleHandle) return;
    const run = () => {
      state.idleHandle = null;
      while (!state.cancelled && state.active < state.concurrency && state.queue.length) {
        const item = state.queue.shift();
        if (state.loaded.has(item.name)) {
          item.resolve(window.personaFiles[item.name]);
          continue;
        }
        state.active += 1;
        loadScript(item.name)
          .then(item.resolve, item.reject)
          .finally(() => {
            state.active -= 1;
            dispatchProgress();
            schedule();
          });
      }
    };
    if (immediate) {
      state.idleHandle = -1;
      Promise.resolve().then(run);
    } else if ('requestIdleCallback' in window) {
      state.idleHandle = window.requestIdleCallback(run, { timeout: 500 });
    } else {
      state.idleHandle = window.setTimeout(run, 50);
    }
  }

  function loadScript(name) {
    const state = window.__personaLoaderState;
    if (state.loaded.has(name) && window.personaFiles[name]) return Promise.resolve(window.personaFiles[name]);
    if (state.pending.has(name)) return state.pending.get(name);
    const metadata = (window.personaIndex || {})[name];
    if (!metadata || !metadata.__path) return Promise.reject(new Error(`Unknown persona: ${name}`));

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `${getBaseUrl()}/${metadata.__path}/${encodeURIComponent(name)}.js?h=${metadata.__hash || ''}`;
      script.onload = () => {
        state.loaded.add(name);
        state.pending.delete(name);
        resolve(window.personaFiles[name]);
      };
      script.onerror = () => {
        state.pending.delete(name);
        reject(new Error(`Failed to load persona data: ${name}`));
      };
      document.head.appendChild(script);
    });
    state.pending.set(name, promise);
    return promise;
  }

  function queuePersona(name, priority) {
    const state = window.__personaLoaderState;
    if (!state || state.cancelled) return Promise.reject(new Error('Persona loader is not available'));
    if (state.loaded.has(name) && window.personaFiles[name]) return Promise.resolve(window.personaFiles[name]);
    if (state.pending.has(name)) return state.pending.get(name);
    return new Promise((resolve, reject) => {
      const item = { name, resolve, reject };
      if (priority) state.queue.unshift(item);
      else state.queue.push(item);
      schedule(priority);
    });
  }

  function preloadPersonaFiles(names, priority) {
    return Promise.all((names || []).map((name) => queuePersona(name, priority)));
  }

  function startBackgroundPreload(exclude) {
    const state = window.__personaLoaderState;
    if (!state || state.backgroundStarted) return;
    state.backgroundStarted = true;
    const skip = new Set(exclude || []);
    const names = Object.keys(window.personaIndex || {}).filter((name) => !skip.has(name));
    preloadPersonaFiles(names, false).catch(() => {});
  }

  function ensurePersonaFilesLoaded(callback) {
    window.personaFiles = window.personaFiles || {};
    window.__personaLoaderState = window.__personaLoaderState || createState();
    if (typeof callback === 'function') callback();
  }

  window.ensurePersonaFilesLoaded = ensurePersonaFilesLoaded;
  window.loadPersonaFile = (name) => queuePersona(name, true);
  window.preloadPersonaFiles = preloadPersonaFiles;
  window.startPersonaBackgroundPreload = startBackgroundPreload;
  window.cancelPersonaBackgroundPreload = () => {
    const state = window.__personaLoaderState;
    if (!state) return;
    state.cancelled = true;
    state.queue.length = 0;
    if (state.idleHandle) {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(state.idleHandle);
      else window.clearTimeout(state.idleHandle);
      state.idleHandle = null;
    }
  };
})();
