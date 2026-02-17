(function initSeoEngine(global) {
  'use strict';

  var REGISTRY_URL = (global.BASE_URL || '') + '/data/seo/registry.json';
  var FALLBACK_REGISTRY = {
    domains: {},
    localeMap: {
      kr: 'ko_KR',
      en: 'en_US',
      jp: 'ja_JP',
      cn: 'zh_CN'
    }
  };

  var state = {
    registry: null,
    registryPromise: null,
    running: false,
    pending: false,
    scheduled: false,
    suppressObserver: false,
    suppressHistoryHook: false,
    historyHooked: false,
    observerBound: false,
    lastResolved: null,
    contextHint: {}
  };

  function normalizeLang(raw) {
    var value = String(raw || '').trim().toLowerCase();
    if (value === 'en' || value === 'jp' || value === 'cn' || value === 'kr') return value;
    return 'kr';
  }

  function htmlLangFromSeoLang(lang) {
    if (lang === 'jp') return 'ja';
    if (lang === 'cn') return 'zh';
    if (lang === 'en') return 'en';
    return 'ko';
  }

  function getCurrentDescription() {
    var el = global.document.querySelector('meta[name="description"]');
    return el ? String(el.getAttribute('content') || '') : '';
  }

  function getCurrentImage() {
    var og = global.document.querySelector('meta[property="og:image"]');
    if (og && og.getAttribute('content')) return String(og.getAttribute('content'));
    var tw = global.document.querySelector('meta[name="twitter:image"]');
    if (tw && tw.getAttribute('content')) return String(tw.getAttribute('content'));
    return '';
  }

  function upsertMeta(selector, attribute, key, content) {
    var el = global.document.querySelector(selector);
    if (!el) {
      el = global.document.createElement('meta');
      el.setAttribute(attribute, key);
      global.document.head.appendChild(el);
    }
    el.setAttribute('content', String(content || ''));
  }

  function upsertCanonical(href) {
    var link = global.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = global.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      global.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  function buildCanonicalUrl(context) {
    var lang = normalizeLang(context.lang);
    var path = String(global.location.pathname || '/');

    if (context.domain === 'home') {
      path = '/' + lang + '/';
    } else if (context.domain === 'maps') {
      path = '/' + lang + '/maps/';
    } else if (path.length > 1 && !path.endsWith('/') && !path.endsWith('.html')) {
      path += '/';
    }

    return global.location.origin + path;
  }

  function safeGetDomainRegistry(registry, domain) {
    if (!registry || !registry.domains) return null;
    return registry.domains[domain] || null;
  }

  function applyTemplate(value, vars) {
    var text = String(value || '');
    if (!text || !vars || typeof vars !== 'object') return text;
    return text.replace(/\{([a-zA-Z0-9_]+)\}/g, function (match, key) {
      if (!Object.prototype.hasOwnProperty.call(vars, key)) return match;
      return String(vars[key] || '');
    });
  }

  function buildTemplateVars(context) {
    var out = {};
    var globalHint = global.__SEO_CONTEXT_HINT__ || {};
    var contextVars = (context && context.templateVars && typeof context.templateVars === 'object')
      ? context.templateVars
      : {};
    var hintVars = (globalHint.templateVars && typeof globalHint.templateVars === 'object')
      ? globalHint.templateVars
      : {};

    Object.assign(out, hintVars, contextVars);

    var explicitEntityName = String(
      (context && context.entityName) ||
      out.name ||
      globalHint.entityName ||
      ''
    ).trim();
    if (explicitEntityName) {
      out.name = explicitEntityName;
    } else if (context && context.entityKey) {
      out.name = String(context.entityKey).trim();
    }

    if (out.path) {
      out.path = String(out.path).trim();
    }

    return out;
  }

  function resolveTitleDescriptionFromRegistry(context, registry) {
    var current = {
      title: String(global.document.title || ''),
      description: getCurrentDescription()
    };
    var domainEntry = safeGetDomainRegistry(registry, context.domain);
    if (!domainEntry || !domainEntry.meta) return current;

    var langMeta = domainEntry.meta[context.lang] || domainEntry.meta.kr || null;
    if (!langMeta) return current;

    if (domainEntry.type === 'simple') {
      if (context.mode === 'detail') return current;
      return {
        title: String(langMeta.title || current.title),
        description: String(langMeta.description || current.description)
      };
    }

    if (domainEntry.type === 'tier') {
      var maker = context.mode === 'maker';
      return {
        title: String(maker ? (langMeta.maker_title || langMeta.title || current.title) : (langMeta.title || current.title)),
        description: String(maker ? (langMeta.maker_description || langMeta.description || current.description) : (langMeta.description || current.description))
      };
    }

    if (domainEntry.type === 'mode') {
      var modeKey = String(context.mode || 'list').trim() || 'list';
      var modeMeta = langMeta[modeKey] || langMeta.list || null;
      if (!modeMeta) return current;

      var modeVars = buildTemplateVars(context);
      if (context.domain === 'maps' && modeKey === 'detail' && !String(modeVars.path || '').trim()) {
        modeMeta = langMeta.list || modeMeta;
      }

      return {
        title: applyTemplate(String(modeMeta.title || current.title), modeVars),
        description: applyTemplate(String(modeMeta.description || current.description), modeVars)
      };
    }

    if (domainEntry.type === 'template') {
      var vars = buildTemplateVars(context);
      var hasName = String(vars.name || '').trim();
      if (context.mode !== 'detail' || !hasName) {
        return {
          title: String(langMeta.list_title || current.title),
          description: String(langMeta.list_description || current.description)
        };
      }
      return {
        title: applyTemplate(String(langMeta.title || current.title), vars),
        description: applyTemplate(String(langMeta.description || current.description), vars)
      };
    }

    return current;
  }

  function resolveLocale(context, registry) {
    var lang = normalizeLang(context.lang);
    if (registry && registry.localeMap && registry.localeMap[lang]) {
      return String(registry.localeMap[lang]);
    }
    if (lang === 'jp') return 'ja_JP';
    if (lang === 'en') return 'en_US';
    if (lang === 'cn') return 'zh_CN';
    return 'ko_KR';
  }

  function resolveContext(customHint) {
    var mergedHint = Object.assign({}, state.contextHint || {}, customHint || {});
    if (global.SeoContextResolver && typeof global.SeoContextResolver.resolveContext === 'function') {
      return global.SeoContextResolver.resolveContext(mergedHint);
    }
    return {
      domain: 'home',
      mode: 'list',
      lang: 'kr',
      entityKey: '',
      templateVars: {},
      pathname: global.location.pathname,
      query: {}
    };
  }

  function normalizeUrl(context) {
    if (!global.SeoUrlNormalizer || typeof global.SeoUrlNormalizer.normalizeUrl !== 'function') {
      return { changed: false, url: new URL(global.location.href) };
    }
    return global.SeoUrlNormalizer.normalizeUrl(context);
  }

  function sanitizeOverride(override) {
    if (!override || typeof override !== 'object') return null;
    var out = {};
    if (Object.prototype.hasOwnProperty.call(override, 'keywords')) out.keywords = String(override.keywords || '');
    if (Object.prototype.hasOwnProperty.call(override, 'ogLocale')) out.ogLocale = String(override.ogLocale || '');
    if (Object.prototype.hasOwnProperty.call(override, 'image')) out.image = String(override.image || '');
    return out;
  }

  function resolveMeta(context, registry, override) {
    var titleDesc = resolveTitleDescriptionFromRegistry(context, registry);
    var canonicalUrl = buildCanonicalUrl(context);
    var locale = resolveLocale(context, registry);
    var image = getCurrentImage();

    var resolved = {
      title: titleDesc.title,
      description: titleDesc.description,
      keywords: (global.document.querySelector('meta[name="keywords"]') || {}).content || '',
      ogLocale: locale,
      image: image,
      canonicalUrl: canonicalUrl,
      ogUrl: canonicalUrl
    };

    var allowedOverride = sanitizeOverride(override);
    if (allowedOverride) {
      Object.assign(resolved, allowedOverride);
    }

    return resolved;
  }

  function applyMeta(resolved, context) {
    if (!resolved) return;
    state.suppressObserver = true;
    try {
      if (resolved.title) global.document.title = String(resolved.title);
      upsertMeta('meta[name="description"]', 'name', 'description', resolved.description || '');
      upsertMeta('meta[name="keywords"]', 'name', 'keywords', resolved.keywords || '');

      upsertMeta('meta[property="og:title"]', 'property', 'og:title', resolved.title || '');
      upsertMeta('meta[property="og:description"]', 'property', 'og:description', resolved.description || '');
      upsertMeta('meta[property="og:url"]', 'property', 'og:url', resolved.ogUrl || resolved.canonicalUrl || '');
      upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', resolved.ogLocale || '');
      upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');

      upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
      upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', resolved.title || '');
      upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', resolved.description || '');
      if (resolved.image) {
        upsertMeta('meta[property="og:image"]', 'property', 'og:image', resolved.image);
        upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', resolved.image);
      }

      if (resolved.canonicalUrl) upsertCanonical(String(resolved.canonicalUrl));
      if (context && context.lang) {
        global.document.documentElement.setAttribute('lang', htmlLangFromSeoLang(normalizeLang(context.lang)));
      }
      state.lastResolved = resolved;
    } finally {
      state.suppressObserver = false;
    }
  }

  function loadRegistry() {
    if (state.registry) return Promise.resolve(state.registry);
    if (state.registryPromise) return state.registryPromise;

    if (global.__SEO_REGISTRY__ && typeof global.__SEO_REGISTRY__ === 'object') {
      state.registry = global.__SEO_REGISTRY__;
      return Promise.resolve(state.registry);
    }

    state.registryPromise = fetch(REGISTRY_URL, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('SEO registry fetch failed');
        return response.json();
      })
      .then(function (json) {
        state.registry = json;
        return json;
      })
      .catch(function () {
        state.registry = FALLBACK_REGISTRY;
        return state.registry;
      })
      .finally(function () {
        state.registryPromise = null;
      });

    return state.registryPromise;
  }

  function scheduleRun(reason, options) {
    if (state.scheduled) return;
    state.scheduled = true;
    global.setTimeout(function () {
      state.scheduled = false;
      run(Object.assign({ reason: reason || 'scheduled' }, options || {}));
    }, 0);
  }

  function bindMutationObserver() {
    if (state.observerBound || !global.MutationObserver) return;
    state.observerBound = true;
    var observer = new MutationObserver(function () {
      if (state.suppressObserver) return;
      scheduleRun('mutation');
    });
    observer.observe(global.document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['content', 'href']
    });
  }

  function bindHistoryHooks() {
    if (state.historyHooked) return;
    state.historyHooked = true;

    ['pushState', 'replaceState'].forEach(function (method) {
      var original = global.history[method];
      global.history[method] = function wrappedHistoryState() {
        var result = original.apply(global.history, arguments);
        if (!state.suppressHistoryHook) scheduleRun('history:' + method);
        return result;
      };
    });

    global.addEventListener('popstate', function () {
      scheduleRun('popstate');
    });
  }

  function setContextHint(partialHint, options) {
    var hint = partialHint && typeof partialHint === 'object' ? partialHint : {};
    var base = Object.assign({}, global.__SEO_CONTEXT_HINT__ || {}, state.contextHint || {});
    var next = Object.assign({}, base);

    Object.keys(hint).forEach(function (key) {
      var value = hint[key];
      if (key === 'templateVars') {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          next.templateVars = Object.assign({}, next.templateVars || {}, value);
        } else if (value === null) {
          delete next.templateVars;
        }
        return;
      }

      if (value === null || value === undefined || value === '') {
        delete next[key];
        return;
      }
      next[key] = value;
    });

    state.contextHint = Object.assign({}, next);
    global.__SEO_CONTEXT_HINT__ = Object.assign({}, next);

    if (options && options.rerun) {
      return run({ reason: 'context-hint', hint: next });
    }
    return Promise.resolve(state.lastResolved);
  }

  function run(options) {
    var opts = options || {};
    if (state.running) {
      state.pending = true;
      return Promise.resolve(state.lastResolved);
    }

    state.running = true;
    return Promise.resolve()
      .then(function () {
        var hintForRun = opts.hint || null;
        var context = resolveContext(hintForRun);
        var normalized = normalizeUrl(context);
        if (normalized && normalized.changed) {
          var nextHref = normalized.url.pathname + (normalized.url.searchParams.toString() ? ('?' + normalized.url.searchParams.toString()) : '') + normalized.url.hash;
          var currentHref = global.location.pathname + global.location.search + global.location.hash;
          if (nextHref !== currentHref) {
            state.suppressHistoryHook = true;
            global.history.replaceState(global.history.state, '', nextHref);
            state.suppressHistoryHook = false;
            context = resolveContext(hintForRun);
          }
        }

        return loadRegistry().then(function (registry) {
          var resolved = resolveMeta(context, registry, opts.override);
          applyMeta(resolved, context);
          return resolved;
        });
      })
      .finally(function () {
        state.running = false;
        if (state.pending) {
          state.pending = false;
          scheduleRun('pending');
        }
      });
  }

  global.SeoEngine = {
    isEnabled: function () { return true; },
    resolveContext: resolveContext,
    resolveMeta: function (context) {
      var safeContext = context || resolveContext();
      var registry = state.registry || FALLBACK_REGISTRY;
      return resolveMeta(safeContext, registry);
    },
    applyMeta: function (resolved) {
      var context = resolveContext();
      applyMeta(resolved, context);
    },
    setContextHint: setContextHint,
    normalizeUrl: normalizeUrl,
    run: run
  };

  bindHistoryHooks();
  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', function () {
      bindMutationObserver();
      run({ reason: 'dom-ready' });
      global.setTimeout(function () { run({ reason: 'dom-ready-delayed' }); }, 250);
    });
  } else {
    bindMutationObserver();
    run({ reason: 'immediate' });
    global.setTimeout(function () { run({ reason: 'immediate-delayed' }); }, 250);
  }

  global.addEventListener('load', function () {
    run({ reason: 'window-load' });
  });
})(window);
