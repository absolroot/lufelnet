(function initSeoUrlNormalizer(global) {
  'use strict';

  function normalizeLang(raw) {
    var value = String(raw || '').toLowerCase();
    if (value === 'en' || value === 'jp' || value === 'cn' || value === 'kr') return value;
    return 'kr';
  }

  function normalizeDetailLang(raw) {
    var value = String(raw || '').toLowerCase();
    if (value === 'cn') return 'cn';
    if (value === 'tw' || value === 'sea') return 'en';
    if (value === 'en' || value === 'jp' || value === 'kr') return value;
    return 'en';
  }

  function resolveSlug(map, key) {
    if (!map || typeof map !== 'object') return '';
    var entry = map[key];
    if (!entry) return '';
    if (typeof entry === 'string') return entry;
    if (entry && typeof entry.slug === 'string') return entry.slug;
    return '';
  }

  function removeCommonParams(params, context) {
    if (!context || context.domain !== 'login') {
      params.delete('lang');
    }
    params.delete('v');
  }

  function toPositiveInt(raw) {
    var text = String(raw || '').trim();
    if (!/^\d+$/.test(text)) return 0;
    var num = Number(text);
    return Number.isFinite(num) && num > 0 ? num : 0;
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

  function normalizeGuideLegacyDetail(url, lang) {
    var legacyDetailMatch = String(url.pathname || '').match(/^\/article\/([^\/?#]+)\/?$/i);
    if (!legacyDetailMatch) return false;

    var guideId = String(legacyDetailMatch[1] || '').trim();
    if (!guideId || guideId.toLowerCase() === 'view') return false;

    url.pathname = '/' + lang + '/article/' + encodeURIComponent(guideId) + '/';
    return true;
  }

  function normalizeTier(url, lang) {
    if (!/\/tier\/?$/i.test(url.pathname)) return false;
    var maker = url.searchParams.get('list') === 'false';
    url.pathname = maker ? '/' + lang + '/tier-maker/' : '/' + lang + '/tier/';
    url.searchParams.delete('list');
    return true;
  }

  function normalizeVelvetTrial(url, lang) {
    var lowerPath = String(url.pathname || '').toLowerCase();
    var detailMatch = lowerPath.match(/^\/(?:((?:kr|en|jp|cn))\/)?velvet-trial\/chapter-(\d+)\/stage-(\d+)\/?$/i);
    if (detailMatch) {
      var detailLang = normalizeDetailLang(detailMatch[1] || lang);
      url.pathname = '/' + detailLang + '/velvet-trial/chapter-' + detailMatch[2] + '/stage-' + detailMatch[3] + '/';
      url.searchParams.delete('chapter');
      url.searchParams.delete('ch');
      url.searchParams.delete('stage');
      url.searchParams.delete('level');
      return true;
    }

    var isLangRoot = /^\/(kr|en|jp|cn)\/velvet-trial\/?$/i.test(lowerPath);
    var isLegacyRoot = /^\/velvet-trial\/?$/i.test(lowerPath);
    if (!isLangRoot && !isLegacyRoot) return false;

    var chapter = toPositiveInt(url.searchParams.get('chapter')) || toPositiveInt(url.searchParams.get('ch'));
    var stage = toPositiveInt(url.searchParams.get('stage')) || toPositiveInt(url.searchParams.get('level'));
    var pathLangMatch = lowerPath.match(/^\/(kr|en|jp|cn)\/velvet-trial\/?$/i);
    var pathLang = pathLangMatch ? pathLangMatch[1] : '';
    var targetLang = normalizeDetailLang(pathLang || lang);

    if (chapter && stage) {
      url.pathname = '/' + targetLang + '/velvet-trial/chapter-' + chapter + '/stage-' + stage + '/';
    } else {
      url.pathname = '/' + targetLang + '/velvet-trial/';
    }

    url.searchParams.delete('chapter');
    url.searchParams.delete('ch');
    url.searchParams.delete('stage');
    url.searchParams.delete('level');
    return true;
  }

  function normalizeHome(url, lang) {
    if (url.pathname !== '/') return false;
    url.pathname = '/' + lang + '/';
    return true;
  }

  function normalizeLegacyRoot(url, context, lang) {
    var domain = context.domain;
    if (domain === 'character' && /^\/character\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/character/';
      return true;
    }
    if (domain === 'persona' && /^\/persona\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/persona/';
      return true;
    }
    if (domain === 'synergy' && /^\/synergy\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/synergy/';
      return true;
    }
    if (domain === 'wonder-weapon' && /^\/wonder-weapon\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/wonder-weapon/';
      return true;
    }
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
    if (domain === 'second-anniversary' && /^\/2nd-anniversary\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/2nd-anniversary/';
      return true;
    }
    if (domain === 'revelation' && /^\/revelations\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/revelations/';
      return true;
    }
    if (domain === 'revelation-setting' && /^\/revelation-setting\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/revelation-setting/';
      return true;
    }
    if (domain === 'material-calc' && /^\/material-calc\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/material-calc/';
      return true;
    }
    if (domain === 'pay-calc' && /^\/pay-calc\/?$/i.test(url.pathname)) {
      url.pathname = '/' + (lang === 'cn' ? 'cn' : 'kr') + '/pay-calc/';
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
    if (domain === 'velvet-trial' && /^\/velvet-trial\/?$/i.test(url.pathname)) {
      url.pathname = '/' + lang + '/velvet-trial/';
      return true;
    }
    return false;
  }

  function normalizeUrl(context) {
    var safeContext = context || {};
    var lang = normalizeLang(safeContext.lang || global.__SEO_PATH_LANG__ || 'kr');
    var detailLang = normalizeDetailLang(lang);
    var url = new URL(global.location.href);
    var before = url.pathname + url.search;
    var changed = false;

    changed = normalizeCharacter(url, detailLang) || changed;
    changed = normalizePersona(url, detailLang) || changed;
    changed = normalizeWonderWeapon(url, detailLang) || changed;
    changed = normalizeGuideDetail(url, lang) || changed;
    changed = normalizeGuideLegacyDetail(url, lang) || changed;
    changed = normalizeTier(url, lang) || changed;
    changed = normalizeVelvetTrial(url, lang) || changed;
    changed = normalizeHome(url, lang) || changed;
    changed = normalizeLegacyRoot(url, safeContext, lang) || changed;

    removeCommonParams(url.searchParams, safeContext);

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
