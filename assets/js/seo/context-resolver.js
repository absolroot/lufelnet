(function initSeoContextResolver(global) {
  'use strict';

  function normalizeLang(raw) {
    var value = String(raw || '').trim().toLowerCase();
    if (value === 'en' || value === 'jp' || value === 'cn' || value === 'kr') return value;
    return 'kr';
  }

  function splitPath(pathname) {
    var clean = String(pathname || '/').replace(/\/{2,}/g, '/');
    if (!clean.startsWith('/')) clean = '/' + clean;
    var parts = clean.split('/').filter(Boolean);
    var pathLang = '';
    if (parts.length > 0 && /^(kr|en|jp|cn)$/i.test(parts[0])) {
      pathLang = parts.shift().toLowerCase();
    }
    return {
      pathLang: pathLang,
      segments: parts,
      pathname: clean
    };
  }

  function toQueryObject(search) {
    var out = {};
    try {
      var params = new URLSearchParams(String(search || ''));
      params.forEach(function (value, key) {
        out[key] = value;
      });
    } catch (_) {}
    return out;
  }

  function inferDomainAndMode(parts, query) {
    var first = parts[0] || '';
    var second = parts[1] || '';

    if (first === '404.html') return { domain: 'not-found', mode: 'list' };
    if (!first) return { domain: 'home', mode: 'list' };
    if (first === 'about') return { domain: 'about', mode: 'list' };
    if (first === 'astrolabe') return { domain: 'astrolabe', mode: 'list' };
    if (first === 'character') return { domain: 'character', mode: second ? 'detail' : 'list' };
    if (first === 'persona') return { domain: 'persona', mode: second ? 'detail' : 'list' };
    if (first === 'synergy') return { domain: 'synergy', mode: second ? 'detail' : 'list' };
    if (first === 'wonder-weapon') return { domain: 'wonder-weapon', mode: second ? 'detail' : 'list' };
    if (first === 'article') return { domain: 'guides', mode: second ? 'detail' : 'list' };
    if (first === 'maps') return { domain: 'maps', mode: query.map ? 'detail' : 'list' };
    if (first === 'gallery') return { domain: 'gallery', mode: 'list' };
    if (first === 'schedule') return { domain: 'schedule', mode: 'list' };
    if (first === 'revelations') return { domain: 'revelation', mode: 'list' };
    if (first === 'material-calc') return { domain: 'material-calc', mode: 'list' };
    if (first === 'pay-calc') return { domain: 'pay-calc', mode: 'list' };
    if (first === 'critical-calc') return { domain: 'critical-calc', mode: 'list' };
    if (first === 'defense-calc') return { domain: 'defense-calc', mode: 'list' };
    if (first === 'pull-calc') return { domain: 'pull-calc', mode: 'list' };
    if (first === 'pull-tracker') {
      if (second === 'global-stats') return { domain: 'pull-tracker', mode: 'global' };
      if (second === 'url-guide') return { domain: 'pull-tracker', mode: 'guide' };
      return { domain: 'pull-tracker', mode: 'individual' };
    }
    if (first === 'tier-maker') return { domain: 'tier', mode: 'maker' };
    if (first === 'tier') {
      return { domain: 'tier', mode: query.list === 'false' ? 'maker' : 'list' };
    }
    if (first === 'tactic-maker') return { domain: 'tactic-maker', mode: 'maker' };
    if (first === 'tactic') {
      if (second === 'library') return { domain: 'tactics', mode: 'list' };
      if (second === 'tactic-upload.html') return { domain: 'tactic-upload', mode: 'list' };
      if (second === 'tactic-share.html') return { domain: 'tactic-share', mode: 'list' };
      return { domain: 'tactic', mode: 'maker' };
    }
    if (first === 'tactics') return { domain: 'tactics', mode: 'list' };
    if (first === 'tactic-upload') return { domain: 'tactic-upload', mode: 'list' };
    if (first === 'tactic-share') return { domain: 'tactic-share', mode: 'list' };
    if (first === 'login') return { domain: 'login', mode: 'list' };

    return { domain: 'home', mode: 'list' };
  }

  function inferEntityKey(pathname, parts, query, domain, mode) {
    if (domain === 'character' && mode === 'detail') return parts[1] || query.name || '';
    if (domain === 'persona' && mode === 'detail') return parts[1] || query.name || query.persona || '';
    if (domain === 'synergy' && mode === 'detail') return parts[1] || query.character || '';
    if (domain === 'wonder-weapon' && mode === 'detail') return parts[1] || query.weapon || '';
    if (domain === 'guides' && mode === 'detail') return parts[1] || query.id || '';
    if (domain === 'maps') return query.map || '';

    if (/\/character\.html$/i.test(pathname)) return query.name || '';
    if (/\/persona\/?$/i.test(pathname)) return query.name || query.persona || '';
    if (/\/wonder-weapon\/?$/i.test(pathname)) return query.weapon || '';
    if (/\/article\/view\/?$/i.test(pathname)) return query.id || '';

    return '';
  }

  function resolveContext(customHint) {
    var globalHint = global.__SEO_CONTEXT_HINT__ || {};
    var hint = Object.assign({}, globalHint, customHint || {});

    var url = new URL(global.location.href);
    var pathInfo = splitPath(url.pathname);
    var query = toQueryObject(url.search);
    var inferred = inferDomainAndMode(pathInfo.segments, query);

    var lang = normalizeLang(
      hint.lang ||
      pathInfo.pathLang ||
      global.__SEO_PATH_LANG__ ||
      query.lang ||
      (global.LanguageRouter && typeof global.LanguageRouter.getCurrentLanguage === 'function'
        ? global.LanguageRouter.getCurrentLanguage()
        : '')
    );

    var domain = String(hint.domain || inferred.domain || '').trim() || 'home';
    var mode = String(hint.mode || inferred.mode || '').trim() || 'list';
    var entityKey = String(
      hint.entityKey ||
      inferEntityKey(url.pathname, pathInfo.segments, query, domain, mode) ||
      ''
    ).trim();
    var templateVars = {};
    if (hint.templateVars && typeof hint.templateVars === 'object' && !Array.isArray(hint.templateVars)) {
      templateVars = Object.assign({}, hint.templateVars);
    }
    var entityName = String(hint.entityName || '').trim();

    return {
      domain: domain,
      mode: mode,
      lang: lang,
      entityKey: entityKey,
      entityName: entityName,
      templateVars: templateVars,
      pathname: url.pathname,
      query: query
    };
  }

  global.SeoContextResolver = {
    resolveContext: resolveContext,
    normalizeLang: normalizeLang
  };
})(window);
