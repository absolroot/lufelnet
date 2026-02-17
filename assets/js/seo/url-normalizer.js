(function initSeoUrlNormalizer(global) {
  'use strict';

  function normalizeLang(raw) {
    var value = String(raw || '').toLowerCase();
    if (value === 'en' || value === 'jp' || value === 'cn' || value === 'kr') return value;
    return 'kr';
  }

  function resolveSlug(map, key) {
    if (!map || typeof map !== 'object') return '';
    var entry = map[key];
    if (!entry) return '';
    if (typeof entry === 'string') return entry;
    if (entry && typeof entry.slug === 'string') return entry.slug;
    return '';
  }

  function removeCommonParams(params) {
    params.delete('lang');
    params.delete('v');
  }

  function normalizeCharacter(url, lang) {
    if (!/\/character\.html$/i.test(url.pathname)) return false;
    var name = url.searchParams.get('name');
    if (!name) return false;
    var slug = resolveSlug(global.__CHARACTER_SLUG_MAP, name);
    if (!slug) return false;
    url.pathname = '/' + lang + '/character/' + slug + '/';
    url.searchParams.delete('name');
    return true;
  }

  function normalizePersona(url, lang) {
    if (!/\/persona\/?$/i.test(url.pathname)) return false;
    var name = url.searchParams.get('name') || url.searchParams.get('persona');
    if (!name) return false;
    var slug = resolveSlug(global.__PERSONA_SLUG_MAP, name);
    if (!slug) return false;
    url.pathname = '/' + lang + '/persona/' + slug + '/';
    url.searchParams.delete('name');
    url.searchParams.delete('persona');
    return true;
  }

  function normalizeWonderWeapon(url, lang) {
    if (!/\/wonder-weapon\/?$/i.test(url.pathname)) return false;
    var key = url.searchParams.get('weapon');
    if (!key) return false;
    var slug = resolveSlug(global.__WONDER_WEAPON_SLUG_MAP, key);
    if (!slug) return false;
    url.pathname = '/' + lang + '/wonder-weapon/' + slug + '/';
    url.searchParams.delete('weapon');
    return true;
  }

  function normalizeGuideDetail(url, lang) {
    if (!/\/article\/view\/?$/i.test(url.pathname)) return false;
    var id = String(url.searchParams.get('id') || '').trim();
    if (!id) return false;
    url.pathname = '/' + lang + '/article/' + encodeURIComponent(id) + '/';
    url.searchParams.delete('id');
    return true;
  }

  function normalizeTier(url, lang) {
    if (!/\/tier\/?$/i.test(url.pathname)) return false;
    var maker = url.searchParams.get('list') === 'false';
    url.pathname = maker ? '/' + lang + '/tier-maker/' : '/' + lang + '/tier/';
    url.searchParams.delete('list');
    return true;
  }

  function normalizeHome(url, lang) {
    if (url.pathname !== '/') return false;
    url.pathname = '/' + lang + '/';
    return true;
  }

  function normalizeLegacyRoot(url, context, lang) {
    var domain = context.domain;
    if (domain === 'about' && /^\/about\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/about/';
      return true;
    }
    if (domain === 'maps' && /^\/maps\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/maps/';
      return true;
    }
    if (domain === 'gallery' && /^\/gallery\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/gallery/';
      return true;
    }
    if (domain === 'schedule' && /^\/schedule\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/schedule/';
      return true;
    }
    if (domain === 'revelation' && /^\/revelations\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/revelations/';
      return true;
    }
    if (domain === 'material-calc' && /^\/material-calc\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/material-calc/';
      return true;
    }
    if (domain === 'pay-calc' && /^\/pay-calc\/?$/i.test(url.pathname)) {
      url.pathname = '/kr/pay-calc/';
      return true;
    }
    if (domain === 'critical-calc' && /^\/critical-calc\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/critical-calc/';
      return true;
    }
    if (domain === 'defense-calc' && /^\/defense-calc\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/defense-calc/';
      return true;
    }
    if (domain === 'pull-calc' && /^\/pull-calc\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/pull-calc/';
      return true;
    }
    if (domain === 'pull-tracker' && /^\/pull-tracker\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/pull-tracker/';
      return true;
    }
    if (domain === 'tactic' && /^\/tactic\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/tactic/';
      return true;
    }
    if (domain === 'tactics' && /^\/tactics\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/tactic/library/';
      return true;
    }
    if (domain === 'tactic-upload' && /^\/tactic-upload\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/tactic/tactic-upload.html';
      return true;
    }
    if (domain === 'tactic-share' && /^\/tactic-share\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/tactic/tactic-share.html';
      return true;
    }
    if (domain === 'tactic-maker' && /^\/tactic-maker\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/tactic-maker/';
      return true;
    }
    if (domain === 'astrolabe' && /^\/astrolabe\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/astrolabe/';
      return true;
    }
    return false;
  }

  function normalizeUrl(context) {
    var safeContext = context || {};
    var lang = normalizeLang(safeContext.lang || global.__SEO_PATH_LANG__ || 'kr');
    var url = new URL(global.location.href);
    var before = url.pathname + url.search;
    var changed = false;

    changed = normalizeCharacter(url, lang) || changed;
    changed = normalizePersona(url, lang) || changed;
    changed = normalizeWonderWeapon(url, lang) || changed;
    changed = normalizeGuideDetail(url, lang) || changed;
    changed = normalizeTier(url, lang) || changed;
    changed = normalizeHome(url, lang) || changed;
    changed = normalizeLegacyRoot(url, safeContext, lang) || changed;

    removeCommonParams(url.searchParams);

    var after = url.pathname + (url.searchParams.toString() ? ('?' + url.searchParams.toString()) : '');
    if (before !== after) changed = true;

    return {
      changed: changed,
      url: url
    };
  }

  global.SeoUrlNormalizer = {
    normalizeUrl: normalizeUrl
  };
})(window);
