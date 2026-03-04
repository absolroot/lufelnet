(function () {
  let currentData = null;

  function normalizeLang(raw) {
    const value = String(raw || '').toLowerCase();
    if (value === 'kr' || value === 'en' || value === 'jp') return value;
    return 'kr';
  }

  function toPositiveInt(raw) {
    const text = String(raw || '').trim();
    if (!/^\d+$/.test(text)) return 0;
    const num = Number(text);
    return Number.isFinite(num) && num > 0 ? num : 0;
  }

  function getPathLang(pathname) {
    const match = String(pathname || '').toLowerCase().match(/^\/(kr|en|jp)(\/|$)/);
    return match ? normalizeLang(match[1]) : '';
  }

  function parseRouteFromLocation() {
    const path = String(window.location.pathname || '/').toLowerCase();
    const params = new URLSearchParams(window.location.search || '');

    const detailPathMatch = path.match(/^\/(?:kr|en|jp)\/velvet-trial\/chapter-(\d+)\/stage-(\d+)\/?$/);
    if (detailPathMatch) {
      return {
        chapterSn: toPositiveInt(detailPathMatch[1]),
        stageNum: toPositiveInt(detailPathMatch[2])
      };
    }

    const detailLegacyMatch = path.match(/^\/velvet-trial\/chapter-(\d+)\/stage-(\d+)\/?$/);
    if (detailLegacyMatch) {
      return {
        chapterSn: toPositiveInt(detailLegacyMatch[1]),
        stageNum: toPositiveInt(detailLegacyMatch[2])
      };
    }

    const chapterSn = toPositiveInt(params.get('chapter')) || toPositiveInt(params.get('ch'));
    const stageNum = toPositiveInt(params.get('stage')) || toPositiveInt(params.get('level'));
    return {
      chapterSn,
      stageNum
    };
  }

  function getFirstSelection(data) {
    const chapters = Array.isArray(data?.chapters) ? data.chapters : [];
    if (!chapters.length) return null;

    const chapter = chapters[0];
    const levels = Array.isArray(chapter?.levels) ? chapter.levels : [];
    if (!levels.length) return null;

    const level = levels[0];
    return {
      chapterSn: Number(chapter.sn),
      chapterName: String(chapter.name || ''),
      levelSn: Number(level.sn),
      stageNum: Number(level.levelNum)
    };
  }

  function findSelection(data, chapterSn, stageNum) {
    const chapters = Array.isArray(data?.chapters) ? data.chapters : [];
    const chapter = chapters.find((item) => Number(item.sn) === Number(chapterSn)) || null;
    if (!chapter) return null;

    const levels = Array.isArray(chapter?.levels) ? chapter.levels : [];
    const level = levels.find((item) => Number(item.levelNum) === Number(stageNum)) || null;
    if (!level) return null;

    return {
      chapterSn: Number(chapter.sn),
      chapterName: String(chapter.name || ''),
      levelSn: Number(level.sn),
      stageNum: Number(level.levelNum)
    };
  }

  function resolveSelectionFromRoute(data) {
    const route = parseRouteFromLocation();
    if (route.chapterSn && route.stageNum) {
      const exact = findSelection(data, route.chapterSn, route.stageNum);
      if (exact) return exact;
    }
    return getFirstSelection(data);
  }

  function buildDetailPath(lang, selection) {
    return `/${lang}/velvet-trial/chapter-${selection.chapterSn}/stage-${selection.stageNum}/`;
  }

  function syncUrlToSelection(selection, historyMode) {
    if (!selection) return;

    const pathLang = getPathLang(window.location.pathname);
    const lang = normalizeLang(pathLang || VelvetTrialI18n.getLang() || 'kr');
    const url = new URL(window.location.href);

    url.pathname = buildDetailPath(lang, selection);
    url.searchParams.delete('lang');
    url.searchParams.delete('v');
    url.searchParams.delete('chapter');
    url.searchParams.delete('ch');
    url.searchParams.delete('stage');
    url.searchParams.delete('level');

    const next = `${url.pathname}${url.search}${url.hash || ''}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash || ''}`;
    if (next === current) return;

    const state = {
      chapterSn: selection.chapterSn,
      levelSn: selection.levelSn,
      stageNum: selection.stageNum
    };
    if (historyMode === 'push') {
      window.history.pushState(state, '', next);
    } else {
      window.history.replaceState(state, '', next);
    }
  }

  function buildDetailEntityName(selection) {
    const chapterPrefixRaw = VelvetTrialI18n.t('chapter_prefix');
    const chapterPrefix = chapterPrefixRaw && chapterPrefixRaw !== 'chapter_prefix'
      ? chapterPrefixRaw
      : 'Chapter';
    const levelLabelRaw = VelvetTrialI18n.t('level_label');
    const levelLabel = levelLabelRaw && levelLabelRaw !== 'level_label'
      ? levelLabelRaw
      : 'Stage';
    const chapterName = String(selection?.chapterName || '').trim()
      || `${chapterPrefix} ${selection.chapterSn}`;
    const vars = {
      chapterName,
      chapter: selection.chapterSn,
      stage: selection.stageNum,
      levelLabel
    };
    const translated = VelvetTrialI18n.t('seo_detail_entity', vars);
    if (translated && translated !== 'seo_detail_entity') return translated;
    return `${chapterName} ${levelLabel} ${selection.stageNum}`;
  }

  function applyDetailSeo(selection) {
    if (!selection) return;
    const entityName = buildDetailEntityName(selection);
    const entityKey = `chapter-${selection.chapterSn}/stage-${selection.stageNum}`;

    if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
      window.SeoEngine.setContextHint({
        domain: 'velvet-trial',
        mode: 'detail',
        entityKey,
        entityName,
        templateVars: { name: entityName }
      }, { rerun: true });
      return;
    }
    if (window.SeoEngine && typeof window.SeoEngine.run === 'function') {
      window.SeoEngine.run();
    }
  }

  function applyListSeo() {
    if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
      window.SeoEngine.setContextHint({
        domain: 'velvet-trial',
        mode: 'list',
        entityKey: null,
        entityName: null,
        templateVars: null
      }, { rerun: true });
      return;
    }
    if (window.SeoEngine && typeof window.SeoEngine.run === 'function') {
      window.SeoEngine.run();
    }
  }

  function onRendererSelectionChange(selection, meta) {
    const source = String(meta?.source || '');
    const historyMode = source === 'user' ? 'push' : 'replace';
    syncUrlToSelection(selection, historyMode);
    applyDetailSeo(selection);
  }

  function applyRouteSelection(source) {
    if (!currentData) return;
    const resolved = resolveSelectionFromRoute(currentData);
    if (!resolved) {
      applyListSeo();
      return;
    }
    VelvetTrialRenderer.setSelection(resolved.chapterSn, resolved.stageNum, { source: source || 'route' });
  }

  async function init() {
    VelvetTrialI18n.init();

    const tabsRoot = document.getElementById('vt-chapter-tabs');
    const contentRoot = document.getElementById('vt-content');
    if (!tabsRoot || !contentRoot) return;

    updateStaticText();
    VelvetTrialRenderer.init({ tabsRoot, contentRoot });

    const lang = VelvetTrialI18n.getLang();
    const data = await VelvetTrialDataLoader.load(lang);
    const recommendations = await VelvetTrialDataLoader.loadRecommendations(data);

    currentData = data;

    VelvetTrialRenderer.setRecommendations(recommendations);
    VelvetTrialRenderer.render(data, { source: 'boot-render' });
    applyRouteSelection('boot-route');

    VelvetTrialRenderer.setOnSelectionChange(onRendererSelectionChange);
    const selection = VelvetTrialRenderer.getSelectionState();
    if (selection) {
      onRendererSelectionChange(selection, { source: 'boot-sync' });
    } else {
      applyListSeo();
    }

    window.addEventListener('popstate', () => {
      applyRouteSelection('popstate');
    });
  }

  function updateStaticText() {
    const title = VelvetTrialI18n.t('title');
    const description = VelvetTrialI18n.t('description');
    const navHome = VelvetTrialI18n.t('nav_home');

    const titleEl = document.getElementById('vt-page-title');
    if (titleEl) titleEl.textContent = title;

    const descEl = document.getElementById('vt-page-description');
    if (descEl) descEl.textContent = description;

    const navCurrentEl = document.getElementById('vt-nav-current');
    if (navCurrentEl) navCurrentEl.textContent = title;

    const navHomeEl = document.getElementById('vt-nav-home');
    if (navHomeEl) navHomeEl.textContent = navHome;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init().catch((error) => {
        console.error(error);
      });
    });
  } else {
    init().catch((error) => {
      console.error(error);
    });
  }
})();
