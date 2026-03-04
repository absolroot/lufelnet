const VelvetTrialRenderer = (function () {
  let tabsRootEl = null;
  let contentRootEl = null;
  let currentData = null;
  let activeChapterSn = null;
  const activeLevelSnByChapter = new Map();

  let recommendationData = {
    base: { characters: [], personas: [] },
    nameSources: { characters: {}, personas: {} },
    chapters: {},
    partyExamples: {}
  };
  let recommendationIndex = null;
  const personaMetaBySlug = new Map();
  const personaMetaLoadersBySlug = new Map();
  const personaNameBySlugCache = new Map();
  let releasedCharacterNameSet = null;
  let releasedCharacterLoadPromise = null;
  let releasedCharacterListLoaded = false;
  let selectionChangeHandler = null;

  const ELEMENT_ORDER = ['Phys', 'Gun', 'Fire', 'Ice', 'Electric', 'Wind', 'Psychokinesis', 'Nuclear', 'Bless', 'Curse'];
  const ELEMENT_ID_BY_KEY = {
    Phys: 1,
    Gun: 2,
    Fire: 3,
    Ice: 4,
    Electric: 5,
    Wind: 6,
    Psychokinesis: 7,
    Nuclear: 8,
    Bless: 9,
    Curse: 10
  };
  const ELEMENT_KEY_BY_ID = Object.fromEntries(Object.entries(ELEMENT_ID_BY_KEY).map(([k, v]) => [v, k]));
  const EN_TO_KR_ELEMENT = {
    Phys: '\uBB3C\uB9AC',
    Gun: '\uCD1D\uACA9',
    Fire: '\uD654\uC5FC',
    Ice: '\uBE59\uACB0',
    Electric: '\uC804\uACA9',
    Wind: '\uC9C8\uD48D',
    Psychokinesis: '\uC5FC\uB3D9',
    Nuclear: '\uD575\uC5F4',
    Bless: '\uCD95\uBCF5',
    Curse: '\uC8FC\uC6D0'
  };
  const COMBINED_ELEMENT_ICON_BY_KEYSET = {
    'Ice|Wind': '\uC9C8\uD48D\uBE59\uACB0'
  };
  const ELEMENT_ALIASES = {
    Phys: ['Phys', 'Physical', '\uBB3C\uB9AC'],
    Gun: ['Gun', '\uCD1D\uACA9'],
    Fire: ['Fire', '\uD654\uC5FC'],
    Ice: ['Ice', '\uBE59\uACB0'],
    Electric: ['Electric', '\uC804\uACA9'],
    Wind: ['Wind', '\uC9C8\uD48D'],
    Psychokinesis: ['Psychokinesis', 'Psy', '\uC5FC\uB3D9'],
    Nuclear: ['Nuclear', 'Nuke', '\uD575\uC5F4'],
    Bless: ['Bless', '\uCD95\uBCF5'],
    Curse: ['Curse', '\uC8FC\uC6D0']
  };

  const RECOMMEND_TYPE = {
    CHARACTER: 'character',
    PERSONA: 'persona'
  };
  const ROLE_KEYS = ['medic', 'saboteur', 'assassin', 'guardian', 'strategist', 'sweeper', 'elucidator', 'virtuoso', 'other'];
  const ROLE_TO_KR = {
    medic: '\uAD6C\uC6D0',
    saboteur: '\uAD74\uBCF5',
    assassin: '\uBC18\uD56D',
    guardian: '\uBC29\uC704',
    strategist: '\uC6B0\uC6D4',
    sweeper: '\uC9C0\uBC30',
    elucidator: '\uD574\uBA85',
    virtuoso: '\uC790\uC728',
    other: '\uAE30\uD0C0'
  };
  const ROLE_ALIASES = {
    medic: ['medic', '\uAD6C\uC6D0'],
    saboteur: ['saboteur', '\uAD74\uBCF5'],
    assassin: ['assassin', '\uBC18\uD56D'],
    guardian: ['guardian', '\uBC29\uC704'],
    strategist: ['strategist', '\uC6B0\uC6D4'],
    sweeper: ['sweeper', '\uC9C0\uBC30'],
    elucidator: ['elucidator', '\uD574\uBA85'],
    virtuoso: ['virtuoso', '\uC790\uC728'],
    other: ['other', '\uAE30\uD0C0']
  };
  const ROLE_ICON_PREFIX = '\uC9C1\uC5C5_';
  const PERSONA_ELEMENT_ICON_PREFIX = '\uC18D\uC131_';
  const PERSONA_POSITION_ICON_PREFIX = '\uC9C1\uC5C5_';

  recommendationIndex = buildRecommendationIndex(recommendationData);

  function ensureReady() {
    if (!tabsRootEl || !contentRootEl) {
      throw new Error('VelvetTrialRenderer is not initialized.');
    }
  }

  function init(options) {
    tabsRootEl = options.tabsRoot;
    contentRootEl = options.contentRoot;
    selectionChangeHandler = typeof options.onSelectionChange === 'function' ? options.onSelectionChange : null;
    ensureReady();
  }

  function setOnSelectionChange(handler) {
    selectionChangeHandler = typeof handler === 'function' ? handler : null;
  }

  function setRecommendations(rawRecommendationData) {
    recommendationData = normalizeRecommendationData(rawRecommendationData);
    recommendationIndex = buildRecommendationIndex(recommendationData);
    if (currentData) {
      renderChapter();
      emitSelectionChange('recommendation');
    }
  }

  function render(data, options = {}) {
    ensureReady();
    currentData = data;
    prepareCharacterReleaseFilter();

    const chapters = getChapters();
    if (chapters.length === 0) {
      tabsRootEl.innerHTML = '';
      contentRootEl.innerHTML = `<div class="vt-empty">${tSafe('no_data', null, 'No data available.')}</div>`;
      return;
    }

    if (!activeChapterSn || !chapters.some((chapter) => Number(chapter.sn) === Number(activeChapterSn))) {
      activeChapterSn = Number(chapters[0].sn);
    }

    renderTabs();
    renderChapter();
    emitSelectionChange(options.source || 'render');
  }

  function setActiveChapter(chapterSn, options = {}) {
    activeChapterSn = Number(chapterSn);
    renderTabs();
    renderChapter();
    emitSelectionChange(options.source || 'chapter');
  }

  function setActiveLevel(levelSn, options = {}) {
    const chapter = getActiveChapter();
    if (!chapter) return;
    activeLevelSnByChapter.set(Number(chapter.sn), Number(levelSn));
    renderChapter();
    emitSelectionChange(options.source || 'level');
  }

  function setSelection(chapterSn, stageNum, options = {}) {
    const chapters = getChapters();
    if (!chapters.length) return null;

    const chapter = chapters.find((item) => Number(item.sn) === Number(chapterSn)) || null;
    const targetChapter = chapter || chapters[0];
    const levels = getLevels(targetChapter);
    if (!levels.length) return null;

    const parsedStageNum = Number(stageNum);
    const targetLevel = levels.find((item) => Number(item.levelNum) === parsedStageNum) || levels[0];

    activeChapterSn = Number(targetChapter.sn);
    activeLevelSnByChapter.set(Number(targetChapter.sn), Number(targetLevel.sn));

    renderTabs();
    renderChapter();
    return emitSelectionChange(options.source || 'selection');
  }

  function getChapters() {
    return Array.isArray(currentData?.chapters) ? currentData.chapters : [];
  }

  function getActiveChapter() {
    return getChapters().find((chapter) => Number(chapter.sn) === Number(activeChapterSn)) || null;
  }

  function getLevels(chapter) {
    return Array.isArray(chapter?.levels) ? chapter.levels : [];
  }

  function getActiveLevel(chapter) {
    const levels = getLevels(chapter);
    if (levels.length === 0) return null;

    const chapterSn = Number(chapter?.sn);
    const activeLevelSn = Number(activeLevelSnByChapter.get(chapterSn));
    let level = levels.find((item) => Number(item.sn) === activeLevelSn);
    if (!level) {
      level = levels[0];
      activeLevelSnByChapter.set(chapterSn, Number(level.sn));
    }
    return level;
  }

  function getSelectionState() {
    const chapter = getActiveChapter();
    if (!chapter) return null;
    const level = getActiveLevel(chapter);
    if (!level) return null;
    return {
      chapterSn: Number(chapter.sn),
      chapterName: String(chapter.name || ''),
      levelSn: Number(level.sn),
      stageNum: Number(level.levelNum)
    };
  }

  function emitSelectionChange(source) {
    const state = getSelectionState();
    if (!state) return null;
    if (typeof selectionChangeHandler === 'function') {
      selectionChangeHandler(state, { source: source || 'unknown' });
    }
    return state;
  }

  function renderTabs() {
    tabsRootEl.innerHTML = '';

    getChapters().forEach((chapter) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'vt-tab';
      if (Number(chapter.sn) === Number(activeChapterSn)) {
        button.classList.add('is-active');
      }

      const media = document.createElement('span');
      media.className = 'vt-tab-media';
      const chapterImagePath = resolveChapterImagePath(chapter);
      if (chapterImagePath) {
        media.style.backgroundImage = `url("${chapterImagePath}")`;
      } else {
        media.classList.add('is-missing');
        media.appendChild(buildMissingImageMarker('vt-tab-missing-mark'));
      }

      const label = document.createElement('span');
      label.className = 'vt-tab-label';
      label.textContent = chapter.name || `${tSafe('chapter_prefix', null, 'Chapter')} ${chapter.sn}`;

      button.appendChild(media);
      button.appendChild(label);
      button.addEventListener('click', () => setActiveChapter(chapter.sn, { source: 'user' }));
      tabsRootEl.appendChild(button);
    });
  }

  function renderChapter() {
    const chapter = getActiveChapter();
    const prevNavScrollTop = contentRootEl.querySelector('.vt-level-nav-list')?.scrollTop ?? 0;
    contentRootEl.innerHTML = '';

    if (!chapter) {
      contentRootEl.innerHTML = `<div class="vt-empty">${tSafe('no_data', null, 'No data available.')}</div>`;
      return;
    }

    const levels = getLevels(chapter);
    const activeLevel = getActiveLevel(chapter);
    if (levels.length === 0 || !activeLevel) {
      contentRootEl.innerHTML = `<div class="vt-empty">${tSafe('no_data', null, 'No data available.')}</div>`;
      return;
    }

    const layout = document.createElement('div');
    layout.className = 'vt-level-layout';

    const nav = buildLevelNav(chapter, levels, activeLevel);
    const detail = document.createElement('section');
    detail.className = 'vt-level-detail';
    detail.appendChild(buildLevelCard(chapter, activeLevel));

    layout.appendChild(nav);
    layout.appendChild(detail);
    contentRootEl.appendChild(layout);

    const navList = nav.querySelector('.vt-level-nav-list');
    if (navList) navList.scrollTop = prevNavScrollTop;
  }

  function buildLevelNav(chapter, levels, activeLevel) {
    const nav = document.createElement('aside');
    nav.className = 'vt-level-nav';

    const navTitle = document.createElement('h3');
    navTitle.className = 'vt-level-nav-title';
    navTitle.textContent = tSafe('level_select_title', null, 'Stage Select');
    nav.appendChild(navTitle);

    const list = document.createElement('div');
    list.className = 'vt-level-nav-list';
    const activeLevelSn = Number(activeLevel?.sn);

    levels.forEach((level) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'vt-level-chip';
      if (Number(level.sn) === activeLevelSn) button.classList.add('is-active');

      const numSpan = document.createElement('span');
      numSpan.className = 'vt-level-chip-num';
      numSpan.textContent = String(level.levelNum);
      button.appendChild(numSpan);

      const navIcons = getLevelNavIcons(level);
      if (navIcons.length > 0) {
        const iconsWrap = document.createElement('span');
        iconsWrap.className = 'vt-level-chip-icons';
        navIcons.forEach((elementKey) => {
          const krName = EN_TO_KR_ELEMENT[elementKey] || elementKey;
          const img = document.createElement('img');
          img.className = 'vt-level-chip-icon';
          img.src = `${VelvetTrialConfig.BASE}/assets/img/skill-element/${krName}.png`;
          img.alt = getElementLabel(elementKey);
          img.onerror = function () { this.style.display = 'none'; };
          iconsWrap.appendChild(img);
        });
        button.appendChild(iconsWrap);
      }

      button.setAttribute(
        'aria-label',
        `${chapter.name || tSafe('chapter_prefix', null, 'Chapter')} ${tSafe('level_label', null, 'Stage')} ${level.levelNum}`
      );
      button.addEventListener('click', () => setActiveLevel(level.sn, { source: 'user' }));
      list.appendChild(button);
    });

    nav.appendChild(list);
    return nav;
  }

  function buildLevelCard(chapter, level) {
    const card = document.createElement('article');
    card.className = 'vt-level-card';

    const header = document.createElement('header');
    header.className = 'vt-level-head';

    const levelTitle = document.createElement('h3');
    levelTitle.className = 'vt-level-title';
    levelTitle.textContent = `${tSafe('level_label', null, 'Stage')} ${level.levelNum}`;
    header.appendChild(levelTitle);

    const effectDesc = String(chapter?.effect?.desc || '').trim();
    if (effectDesc && effectDesc !== 'AAAAAA==') {
      const effect = document.createElement('p');
      effect.className = 'vt-level-effect';
      effect.textContent = `${tSafe('chapter_effect_label', null, 'Chapter Effect')}: ${effectDesc}`;
      header.appendChild(effect);
    }

    card.appendChild(header);

    const scoreGrid = document.createElement('div');
    scoreGrid.className = 'vt-score-grid';
    const labels = [
      tSafe('star_1_score', null, 'Star 1 Score'),
      tSafe('star_2_score', null, 'Star 2 Score'),
      tSafe('star_3_score', null, 'Star 3 Score')
    ];
    const scoreIcons = [
      'icon-rogue-rewardteam-highline-tong.png',
      'icon-rogue-rewardteam-highline-yin.png',
      'icon-rogue-rewardteam-highline-jin.png'
    ];
    const scores = Array.isArray(level.starScores) ? level.starScores : [];

    for (let i = 0; i < 3; i += 1) {
      const item = document.createElement('div');
      item.className = 'vt-score-item';
      item.setAttribute('aria-label', labels[i]);

      const main = document.createElement('div');
      main.className = 'vt-score-main';

      const icons = document.createElement('div');
      icons.className = 'vt-score-icons';
      for (let count = 0; count < i + 1; count += 1) {
        const icon = document.createElement('img');
        icon.className = 'vt-score-icon';
        icon.src = VelvetTrialConfig.getChapterImageUrl(scoreIcons[i]);
        icon.alt = labels[i];
        icons.appendChild(icon);
      }
      main.appendChild(icons);

      const value = document.createElement('div');
      value.className = 'vt-score-value';
      value.textContent = formatScore(scores[i]);
      main.appendChild(value);

      item.appendChild(main);
      scoreGrid.appendChild(item);
    }

    card.appendChild(scoreGrid);

    const conditions = document.createElement('section');
    conditions.className = 'vt-conditions';

    const condList = document.createElement('ul');
    condList.className = 'vt-condition-list';
    [formatRule1(level?.conditions?.rule1), formatRule2(level?.conditions?.rule2), formatRule3(level?.conditions?.rule3)]
      .filter((text) => text)
      .forEach((text) => {
        const li = document.createElement('li');
        li.textContent = text;
        condList.appendChild(li);
      });

    conditions.appendChild(condList);
    card.appendChild(conditions);

    const phasesWrap = document.createElement('div');
    phasesWrap.className = 'vt-phases';
    const phases = Array.isArray(level.phases) ? level.phases : [];
    phases.forEach((phase) => phasesWrap.appendChild(buildPhaseSection(chapter, level, phase)));

    card.appendChild(phasesWrap);

    const partyExSection = buildLevelPartyExamplesSection(chapter, level);
    if (partyExSection) card.appendChild(partyExSection);

    const levelRec = buildLevelRecommendationSection(chapter, level);
    if (levelRec) card.appendChild(levelRec);

    return card;
  }

  function buildPhaseSection(chapter, level, phase) {
    const section = document.createElement('section');
    section.className = 'vt-phase-section';

    const phaseTitle = document.createElement('h4');
    phaseTitle.className = 'vt-phase-title';
    phaseTitle.textContent = `${tSafe('phase_label', null, 'Phase')} ${phase.phase}`;
    section.appendChild(phaseTitle);

    const monsters = Array.isArray(phase.monsters) ? phase.monsters : [];
    const weaknessCounts = collectWeaknessCounts(monsters);
    const weaknessKeys = Array.from(weaknessCounts.keys()).sort(sortElementKeys);

    if (weaknessKeys.length > 0) {
      const icons = document.createElement('div');
      icons.className = 'vt-phase-weakness-icons';
      weaknessKeys.forEach((elementKey) => {
        const krName = EN_TO_KR_ELEMENT[elementKey] || elementKey;
        const img = document.createElement('img');
        img.className = 'vt-phase-weakness-icon';
        img.src = `${VelvetTrialConfig.BASE}/assets/img/skill-element/${krName}.png`;
        img.alt = getElementLabel(elementKey);
        img.onerror = function () { this.style.display = 'none'; };
        icons.appendChild(img);
      });
      phaseTitle.appendChild(icons);
    }

    if (monsters.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'vt-monster-empty';
      empty.textContent = tSafe('no_monsters', null, 'No monster data.');
      section.appendChild(empty);
    } else {
      const monsterList = document.createElement('div');
      monsterList.className = 'vt-monster-list';
      monsters.forEach((monster) => monsterList.appendChild(buildMonsterCard(monster)));
      section.appendChild(monsterList);
    }

    return section;
  }

  function buildPhaseRecommendationSection(chapterSn, levelSn, elementKeys) {
    const manual = getElementRecommendations(chapterSn, levelSn, elementKeys);
    const characterItems = manual.characters;
    const personaItems = manual.personas;
    if (!characterItems.length && !personaItems.length) return null;

    const wrap = document.createElement('section');
    wrap.className = 'vt-phase-recommend';

    if (characterItems.length) {
      wrap.appendChild(
        buildRecommendationGroup(
          tSafe('phase_recommend_characters', null, 'Recommended Thieves'),
          characterItems,
          RECOMMEND_TYPE.CHARACTER
        )
      );
    }
    if (personaItems.length) {
      wrap.appendChild(
        buildRecommendationGroup(
          tSafe('phase_recommend_personas', null, 'Recommended Personas'),
          personaItems,
          RECOMMEND_TYPE.PERSONA
        )
      );
    }

    return wrap;
  }

  function buildRecommendationGroup(title, items, type) {
    const group = document.createElement('div');
    group.className = 'vt-recommend-group';

    const normalizedType = normalizeRecommendType(type);

    const list = document.createElement('div');
    list.className = 'vt-recommend-list';
    list.classList.add('is-roster-list');
    const filteredItems = normalizedType === RECOMMEND_TYPE.CHARACTER
      ? filterCharacterItemsBySpoiler(items)
      : items;
    filteredItems.forEach((item) => list.appendChild(buildRecommendationChip(item, normalizedType || type)));
    group.appendChild(list);

    return group;
  }

  function buildRecommendationRosterItem(item, type) {
    const normalizedType = normalizeRecommendType(type || item?.type || item?.imageType);
    const rosterItem = document.createElement('article');
    rosterItem.className = 'vt-rec-roster-item';
    if (normalizedType === RECOMMEND_TYPE.PERSONA) {
      rosterItem.classList.add('is-persona');
    }

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'vt-rec-roster-thumb-wrap';

    const thumb = document.createElement('img');
    thumb.className = 'vt-rec-roster-thumb';
    thumb.alt = item.name || '-';
    thumb.loading = 'lazy';
    thumb.decoding = 'async';
    const thumbFallback = buildMissingImageMarker('vt-rec-roster-thumb-fallback');

    const thumbSrc = resolveRecommendationImageUrl(item, type);
    if (thumbSrc) {
      thumb.src = thumbSrc;
      thumb.onerror = function () {
        thumb.style.display = 'none';
        thumbFallback.classList.add('show');
      };
    } else {
      thumb.style.display = 'none';
      thumbFallback.classList.add('show');
    }

    thumbWrap.appendChild(thumb);
    thumbWrap.appendChild(thumbFallback);
    rosterItem.appendChild(thumbWrap);

    const meta = document.createElement('div');
    meta.className = 'vt-rec-roster-meta';

    const nameRow = document.createElement('div');
    nameRow.className = 'vt-rec-roster-name-row';

    const name = document.createElement('div');
    name.className = 'vt-rec-roster-name';
    name.textContent = item.name || '-';
    nameRow.appendChild(name);
    meta.appendChild(nameRow);

    const sub = document.createElement('div');
    sub.className = 'vt-rec-roster-sub';

    if (normalizedType === RECOMMEND_TYPE.PERSONA) {
      const personaSlug = resolvePersonaSlug(item);
      const immediateMeta = resolvePersonaMeta(item, personaSlug);
      const immediateLocalizedName = resolvePersonaLocalizedName(item, personaSlug);
      if (immediateLocalizedName) {
        name.textContent = immediateLocalizedName;
      }
      applyPersonaRosterMeta(sub, nameRow, item, immediateMeta);

      if (personaSlug) {
        ensurePersonaMetaLoadedBySlug(personaSlug).then((meta) => {
          if (!sub.isConnected) return;
          const loadedLocalizedName = resolvePersonaLocalizedName(item, personaSlug);
          if (loadedLocalizedName && name.isConnected) {
            name.textContent = loadedLocalizedName;
          }
          if (!meta) return;
          applyPersonaRosterMeta(sub, nameRow, item, meta);
        }).catch(() => {});
      }
    } else {
      const elementKey = canonicalizeElementKey(item.elementKey);
      const elementIconKr = resolveCharacterElementIconKr(item, elementKey);
      const elementLabel = resolveCharacterElementLabel(item, elementKey);
      if (elementKey || elementIconKr) {
        const elementIcon = document.createElement('img');
        elementIcon.className = 'vt-rec-roster-meta-icon';
        elementIcon.src = buildElementIconUrlByKrName(elementIconKr || (EN_TO_KR_ELEMENT[elementKey] || elementKey || ''));
        elementIcon.alt = elementLabel || getElementLabel(elementKey);
        elementIcon.loading = 'lazy';
        elementIcon.onerror = function () { this.style.display = 'none'; };
        sub.appendChild(elementIcon);
      }

      const roleKr = resolveRoleKr(item);
      if (roleKr) {
        const roleIcon = document.createElement('img');
        roleIcon.className = 'vt-rec-roster-meta-icon';
        roleIcon.src = buildRoleIconUrl(roleKr);
        roleIcon.alt = roleKr;
        roleIcon.loading = 'lazy';
        roleIcon.onerror = function () { this.style.display = 'none'; };
        sub.appendChild(roleIcon);
      }

      const subText = document.createElement('span');
      subText.textContent = elementLabel || '-';
      sub.appendChild(subText);
    }
    meta.appendChild(sub);
    rosterItem.appendChild(meta);

    const detailUrl = buildRecommendationDetailUrl(item, normalizedType);
    if (detailUrl) {
      rosterItem.classList.add('is-link');
      rosterItem.setAttribute('role', 'link');
      rosterItem.tabIndex = 0;
      rosterItem.addEventListener('click', () => navigateToDetail(detailUrl));
      rosterItem.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigateToDetail(detailUrl);
        }
      });
    }

    return rosterItem;
  }

  function buildRecommendationChip(item, type) {
    const normalizedType = normalizeRecommendType(item?.type || item?.imageType || type);
    return buildRecommendationRosterItem(item, normalizedType || type || RECOMMEND_TYPE.CHARACTER);
  }

  function getElementRecommendations(chapterSn, levelSn, elementKeys) {
    const base = recommendationData.base;
    const universal = (base.universal && typeof base.universal === 'object') ? base.universal : {};
    const byElement = (base.byElement && typeof base.byElement === 'object') ? base.byElement : {};
    const allBaseChars = Array.isArray(base.characters) ? base.characters : [];

    const universalChars = Array.isArray(universal.characters) ? universal.characters : [];
    const universalPersonas = Array.isArray(universal.personas) ? universal.personas : [];

    const seenChars = new Set(universalChars.map((c) => String(c).trim().toLowerCase()));
    const seenPersonas = new Set(universalPersonas.map((p) => String(p).trim().toLowerCase()));
    const elementChars = [];
    const elementPersonas = [];

    (Array.isArray(elementKeys) ? elementKeys : []).forEach((key) => {
      allBaseChars.forEach((entry) => {
        const entryKeys = Array.isArray(entry.elementKeys) ? entry.elementKeys : [];
        if (!entryKeys.includes(key)) return;
        const name = String(entry.id || '').trim();
        const k = name.toLowerCase();
        if (k && !seenChars.has(k)) { seenChars.add(k); elementChars.push(name); }
      });
      const elData = byElement[key];
      if (!elData || typeof elData !== 'object') return;
      (Array.isArray(elData.personas) ? elData.personas : []).forEach((p) => {
        const k = String(p).trim().toLowerCase();
        if (k && !seenPersonas.has(k)) { seenPersonas.add(k); elementPersonas.push(p); }
      });
    });

    const chapterNode = recommendationData.chapters[String(chapterSn)] || null;
    const exclusions = chapterNode?.rounds?.[String(levelSn)] || {};
    const excludeChars = new Set((Array.isArray(exclusions.characters) ? exclusions.characters : []).map((c) => String(c).trim().toLowerCase()));
    const excludePersonas = new Set((Array.isArray(exclusions.personas) ? exclusions.personas : []).map((p) => String(p).trim().toLowerCase()));

    const allChars = [...universalChars, ...elementChars].filter((c) => !excludeChars.has(String(c).trim().toLowerCase()));
    const allPersonas = [...universalPersonas, ...elementPersonas].filter((p) => !excludePersonas.has(String(p).trim().toLowerCase()));

    return {
      characters: normalizeManualRecommendationList(allChars, RECOMMEND_TYPE.CHARACTER),
      personas: normalizeManualRecommendationList(allPersonas, RECOMMEND_TYPE.PERSONA)
    };
  }

  function normalizeManualRecommendationList(list, type) {
    if (!Array.isArray(list)) return [];
    const result = [];
    const seen = new Set();

    list.forEach((entry) => {
      let item = null;
      if (typeof entry === 'string') {
        const name = entry.trim();
        if (name) {
          item = {
            id: `manual:${name}`,
            name: '',
            lookupName: name,
            manualNameLocked: false,
            type: normalizeRecommendType(type)
          };
        }
      } else if (entry && typeof entry === 'object') {
        const hasLocalizedObject = Boolean(
          (entry.nameByLang && typeof entry.nameByLang === 'object')
          || (entry.names && typeof entry.names === 'object')
        );
        const resolvedName = resolveLocalizedText(entry.nameByLang || entry.names || entry.name || entry.label);
        const lookupName = String(entry.lookupName || entry.lookup || entry.name || entry.label || resolvedName || '').trim();
        const name = hasLocalizedObject ? resolvedName : '';
        const normalizedElementKeys = normalizeElementKeys(entry.elementKey || entry.element || entry.elements || entry.elementKeys);
        if (name || lookupName) {
          item = {
            id: String(entry.id || `manual:${lookupName || name}`),
            name,
            lookupName,
            manualNameLocked: hasLocalizedObject,
            role: normalizeRole(entry.role || entry.position),
            positionKr: pickName(entry.positionKr, entry.positionLabel),
            elementKeys: normalizedElementKeys,
            elementKey: normalizedElementKeys[0] || '',
            imageFile: normalizeImageFile(entry.imageFile || entry.image || entry.thumb),
            imageType: normalizeRecommendType(entry.imageType || entry.type),
            type: normalizeRecommendType(entry.type || type)
          };
        }
      }

      if (!item) return;
      item = hydrateManualRecommendationItem(item, type);
      const key = item.id || item.name;
      if (seen.has(key)) return;
      seen.add(key);
      result.push(item);
    });

    return result;
  }

  function hydrateManualRecommendationItem(item, fallbackType) {
    const type = normalizeRecommendType(item.type || item.imageType || fallbackType);
    const source = findRecommendationEntry(item, type);
    if (!source) {
      const inferredImageFile = (type === RECOMMEND_TYPE.PERSONA && !item.imageFile && item.lookupName)
        ? normalizeImageFile(item.lookupName)
        : '';
      const normalizedElementKeys = normalizeElementKeys(item.elementKeys || item.elementKey);
      const inferredSlug = normalizeSlugCandidate(
        item.slug
        || normalizeRecommendationId(item.id)
        || extractSlugFromImageFile(item.imageFile || inferredImageFile)
      );
      return {
        ...item,
        name: item.name || item.lookupName || '',
        type: type || RECOMMEND_TYPE.CHARACTER,
        imageType: item.imageType || type || RECOMMEND_TYPE.CHARACTER,
        imageFile: item.imageFile || inferredImageFile,
        elementKeys: normalizedElementKeys,
        elementKey: item.elementKey || normalizedElementKeys[0] || '',
        slug: inferredSlug
      };
    }

    const normalizedRole = item.role || source.role || '';
    const normalizedElementKeys = normalizeElementKeys(item.elementKeys || source.elementKeys || item.elementKey || source.primaryElement);
    const positionKr = pickName(item.positionKr, source.positionKr, ROLE_TO_KR[normalizedRole]);
    const localizedName = pickLocalizedName(source.names, source.id);
    const useSourceName = !item.manualNameLocked;

    return {
      ...item,
      id: item.id || `${type}:${source.id}`,
      name: useSourceName ? (localizedName || item.name || item.lookupName || '') : (item.name || localizedName || item.lookupName || ''),
      role: normalizedRole,
      positionKr,
      elementKeys: normalizedElementKeys,
      elementKey: item.elementKey || normalizedElementKeys[0] || source.primaryElement || '',
      imageFile: item.imageFile || source.imageFile || '',
      imageType: normalizeRecommendType(item.imageType || source.imageType || type),
      slug: normalizeSlugCandidate(item.slug || source.id),
      type
    };
  }

  function findRecommendationEntry(item, type) {
    const normalizedType = normalizeRecommendType(type);
    const idKey = normalizeRecommendationId(item.id);
    const nameKey = normalizeLookupKey(item.lookupName || item.name);
    if (!recommendationIndex) return null;

    if (normalizedType === RECOMMEND_TYPE.CHARACTER) {
      if (idKey && recommendationIndex.characterById.has(idKey)) return recommendationIndex.characterById.get(idKey);
      if (nameKey && recommendationIndex.characterByName.has(nameKey)) return recommendationIndex.characterByName.get(nameKey);
      return null;
    }

    if (normalizedType === RECOMMEND_TYPE.PERSONA) {
      if (idKey && recommendationIndex.personaById.has(idKey)) return recommendationIndex.personaById.get(idKey);
      if (nameKey && recommendationIndex.personaByName.has(nameKey)) return recommendationIndex.personaByName.get(nameKey);
      return null;
    }

    if (idKey && recommendationIndex.characterById.has(idKey)) return recommendationIndex.characterById.get(idKey);
    if (nameKey && recommendationIndex.characterByName.has(nameKey)) return recommendationIndex.characterByName.get(nameKey);
    if (idKey && recommendationIndex.personaById.has(idKey)) return recommendationIndex.personaById.get(idKey);
    if (nameKey && recommendationIndex.personaByName.has(nameKey)) return recommendationIndex.personaByName.get(nameKey);
    return null;
  }

  function resolveRecommendationImageUrl(item, fallbackType) {
    const type = normalizeRecommendType(item.imageType || item.type || fallbackType);
    const file = normalizeImageFile(item.imageFile || item.image || item.thumb);
    if (!file) return '';
    if (/^https?:\/\//i.test(file) || /^data:/i.test(file)) return file;
    if (file.startsWith('/')) return `${VelvetTrialConfig.BASE}${file}`;

    const root = type === RECOMMEND_TYPE.PERSONA ? 'assets/img/persona' : 'assets/img/tier';
    return `${VelvetTrialConfig.BASE}/${root}/${encodePathParts(file)}`;
  }

  function buildElementIconUrl(elementKey) {
    const krName = EN_TO_KR_ELEMENT[elementKey] || elementKey;
    return buildElementIconUrlByKrName(krName);
  }

  function buildElementIconUrlByKrName(krName) {
    return `${VelvetTrialConfig.BASE}/assets/img/skill-element/${encodePathParts(`${krName}.png`)}`;
  }

  function buildRoleIconUrl(roleKr) {
    return `${VelvetTrialConfig.BASE}/assets/img/character-cards/${encodePathParts(`${ROLE_ICON_PREFIX}${roleKr}.png`)}`;
  }

  function buildPersonaElementIconUrl(elementKr) {
    return `${VelvetTrialConfig.BASE}/assets/img/persona/${encodePathParts(`${PERSONA_ELEMENT_ICON_PREFIX}${elementKr}.png`)}`;
  }

  function buildPersonaPositionIconUrl(positionKr) {
    return `${VelvetTrialConfig.BASE}/assets/img/persona/${encodePathParts(`${PERSONA_POSITION_ICON_PREFIX}${positionKr}.png`)}`;
  }

  function buildPersonaGradeImageUrl(grade) {
    return `${VelvetTrialConfig.BASE}/assets/img/persona/${encodePathParts(`persona-grade${grade}.webp`)}`;
  }

  function resolveRoleKr(item) {
    const explicit = pickName(item?.positionKr);
    if (explicit) return explicit;
    const normalizedRole = normalizeRole(item?.role || item?.position);
    return ROLE_TO_KR[normalizedRole] || '';
  }

  function applyPersonaRosterMeta(sub, nameRow, item, meta) {
    if (!sub) return;
    sub.innerHTML = '';

    if (nameRow && nameRow.isConnected) {
      const oldGrade = nameRow.querySelector('.vt-rec-roster-name-grade');
      if (oldGrade) oldGrade.remove();
    }

    const fallbackElementKey = canonicalizeElementKey(item?.elementKey);
    const elementKr = pickName(meta?.elementKr, EN_TO_KR_ELEMENT[fallbackElementKey]);
    const elementKey = canonicalizeElementKey(elementKr) || fallbackElementKey;
    const positionKr = pickName(meta?.positionKr);
    const grade = Number(meta?.grade);

    if (nameRow && nameRow.isConnected && Number.isFinite(grade) && grade > 0) {
      const gradeImage = document.createElement('img');
      gradeImage.className = 'vt-rec-roster-name-grade persona-grade-img';
      gradeImage.src = buildPersonaGradeImageUrl(grade);
      gradeImage.alt = `Grade ${grade}`;
      gradeImage.loading = 'lazy';
      gradeImage.onerror = function () { this.style.display = 'none'; };
      nameRow.appendChild(gradeImage);
    }

    if (elementKr) {
      const elementIcon = document.createElement('img');
      elementIcon.className = 'vt-rec-roster-meta-icon';
      elementIcon.src = buildPersonaElementIconUrl(elementKr);
      elementIcon.alt = elementKey ? getElementLabel(elementKey) : elementKr;
      elementIcon.loading = 'lazy';
      elementIcon.onerror = function () { this.style.display = 'none'; };
      sub.appendChild(elementIcon);
    }

    if (positionKr) {
      const positionIcon = document.createElement('img');
      positionIcon.className = 'vt-rec-roster-meta-icon';
      positionIcon.src = buildPersonaPositionIconUrl(positionKr);
      positionIcon.alt = positionKr;
      positionIcon.loading = 'lazy';
      positionIcon.onerror = function () { this.style.display = 'none'; };
      sub.appendChild(positionIcon);
    }

    const text = document.createElement('span');
    if (elementKey) text.textContent = getElementLabel(elementKey);
    else if (elementKr) text.textContent = elementKr;
    else text.textContent = '-';
    sub.appendChild(text);
  }

  function shouldShowCharacterSpoilerToggle() {
    const lang = getRouteLang();
    return lang === 'en' || lang === 'jp';
  }

  function getCharacterSpoilerEnabled() {
    try {
      if (window.SpoilerState && typeof window.SpoilerState.get === 'function') {
        return !!window.SpoilerState.get();
      }
    } catch (_) {}
    try {
      return localStorage.getItem('spoilerToggle') === 'true';
    } catch (_) {
      return false;
    }
  }

  function setCharacterSpoilerEnabled(enabled) {
    const next = !!enabled;
    try {
      if (window.SpoilerState && typeof window.SpoilerState.set === 'function') {
        window.SpoilerState.set(next, { source: 'velvet-trial' });
      } else {
        localStorage.setItem('spoilerToggle', next ? 'true' : 'false');
      }
    } catch (_) {}
  }

  function handleCharacterSpoilerToggleChanged() {
    prepareCharacterReleaseFilter();
    if (currentData) renderChapter();
  }

  function buildCharacterSpoilerToggle() {
    const wrap = document.createElement('div');
    wrap.className = 'vt-rec-spoiler-toggle';

    const label = document.createElement('label');
    label.className = 'spoiler-toggle-label';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'spoiler-toggle-checkbox';
    input.checked = getCharacterSpoilerEnabled();
    input.addEventListener('change', () => {
      setCharacterSpoilerEnabled(input.checked);
      handleCharacterSpoilerToggleChanged();
    });

    const text = document.createElement('span');
    text.className = 'spoiler-toggle-text';
    const fallback = getRouteLang() === 'jp' ? '\u30cd\u30bf\u30d0\u30ec\u8868\u793a' : 'Show Spoilers';
    text.textContent = tSafe('show_spoilers_label', null, fallback);

    label.appendChild(input);
    label.appendChild(text);
    wrap.appendChild(label);
    return wrap;
  }

  function filterCharacterItemsBySpoiler(items) {
    if (!Array.isArray(items)) return [];
    if (!shouldShowCharacterSpoilerToggle()) return items;
    if (getCharacterSpoilerEnabled()) return items;
    if (!(releasedCharacterNameSet instanceof Set) || releasedCharacterNameSet.size === 0) return items;
    return items.filter((item) => isReleasedCharacterItem(item));
  }

  function isReleasedCharacterItem(item) {
    const candidates = [
      item?.lookupName,
      item?.name,
      normalizeRecommendationId(item?.id)
    ];
    return candidates.some((value) => {
      const key = normalizeLookupKey(value);
      return key && releasedCharacterNameSet.has(key);
    });
  }

  function prepareCharacterReleaseFilter() {
    if (!shouldShowCharacterSpoilerToggle()) {
      releasedCharacterNameSet = null;
      releasedCharacterLoadPromise = null;
      releasedCharacterListLoaded = false;
      return;
    }
    if (getCharacterSpoilerEnabled()) return;
    if (releasedCharacterListLoaded) return;
    if (releasedCharacterLoadPromise) return;

    releasedCharacterLoadPromise = loadReleasedCharacterNameSet()
      .then((set) => {
        releasedCharacterNameSet = (set instanceof Set) ? set : new Set();
        releasedCharacterListLoaded = true;
      })
      .catch(() => {
        releasedCharacterNameSet = new Set();
        releasedCharacterListLoaded = true;
      })
      .finally(() => {
        releasedCharacterLoadPromise = null;
        if (currentData) renderChapter();
      });
  }

  async function loadReleasedCharacterNameSet() {
    const lang = getRouteLang();
    if (lang !== 'en' && lang !== 'jp') return new Set();

    if (window.CharacterListLoader && typeof window.CharacterListLoader.getVisibleNames === 'function') {
      try {
        const names = await window.CharacterListLoader.getVisibleNames(false);
        if (Array.isArray(names) && names.length > 0) {
          window.originalLangCharacterList = names;
          return buildNormalizedNameSet(names);
        }
      } catch (_) {}
    }

    const existing = Array.isArray(window.originalLangCharacterList) ? window.originalLangCharacterList : [];
    if (existing.length > 0) return buildNormalizedNameSet(existing);

    if (window.CharacterListLoader && typeof window.CharacterListLoader.loadFor === 'function') {
      try {
        const result = await window.CharacterListLoader.loadFor(lang);
        const list = result?.characterList || {};
        const names = [...(list.mainParty || []), ...(list.supportParty || [])];
        if (names.length > 0) {
          window.originalLangCharacterList = names;
          return buildNormalizedNameSet(names);
        }
      } catch (_) {}
    }

    try {
      const suffix = VelvetTrialConfig.APP_VER ? `?v=${VelvetTrialConfig.APP_VER}` : '';
      const url = `${VelvetTrialConfig.BASE}/data/character_info_glb.js${suffix}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) return new Set();
      const text = await response.text();

      let parsed = null;
      try {
        const sandbox = {};
        const win = (new Function('window', `${text}\n; return window;`))(sandbox);
        if (win && win.characterList && typeof win.characterList === 'object') {
          parsed = win.characterList;
        }
      } catch (_) {}

      if (!parsed) {
        const match = text.match(/(?:window\.)?characterList\s*=\s*(?:window\.characterList\s*\|\|\s*)?({[\s\S]*?});/);
        if (match && match[1]) {
          parsed = new Function(`return (${match[1]});`)();
        }
      }
      if (!parsed || typeof parsed !== 'object') return new Set();

      const names = [...(parsed?.mainParty || []), ...(parsed?.supportParty || [])];
      if (names.length > 0) {
        window.originalLangCharacterList = names;
      }
      return buildNormalizedNameSet(names);
    } catch (_) {
      return new Set();
    }
  }

  function buildNormalizedNameSet(list) {
    const set = new Set();
    (Array.isArray(list) ? list : []).forEach((name) => {
      const key = normalizeLookupKey(name);
      if (key) set.add(key);
    });
    return set;
  }

  function navigateToDetail(url) {
    if (!url) return;
    window.location.assign(url);
  }

  function buildRecommendationDetailUrl(item, type) {
    const normalizedType = normalizeRecommendType(type || item?.type || item?.imageType);
    const lang = getRouteLang();

    if (normalizedType === RECOMMEND_TYPE.CHARACTER) {
      const slug = resolveCharacterSlug(item);
      if (!slug) return '';
      return `${VelvetTrialConfig.BASE}/${lang}/character/${encodePathParts(slug)}/`;
    }

    if (normalizedType === RECOMMEND_TYPE.PERSONA) {
      const slug = resolvePersonaSlug(item);
      if (!slug) return '';
      return `${VelvetTrialConfig.BASE}/${lang}/persona/${encodePathParts(slug)}/`;
    }

    return '';
  }

  function getRouteLang() {
    const lang = String(VelvetTrialI18n.getLang() || 'kr').toLowerCase();
    if (lang === 'en' || lang === 'jp' || lang === 'kr' || lang === 'cn') return lang;
    return 'kr';
  }

  function resolveCharacterSlug(item) {
    const slugById = normalizeSlugCandidate(item?.slug || normalizeRecommendationId(item?.id));
    if (slugById) return slugById;

    const map = (typeof window !== 'undefined' && window.__CHARACTER_SLUG_MAP && typeof window.__CHARACTER_SLUG_MAP === 'object')
      ? window.__CHARACTER_SLUG_MAP
      : null;

    return resolveSlugFromMap(map, [
      item?.lookupName,
      item?.name,
      normalizeRecommendationId(item?.id)
    ]);
  }

  function resolvePersonaSlug(item) {
    const slugById = normalizeSlugCandidate(item?.slug || normalizeRecommendationId(item?.id));
    if (slugById) return slugById;

    const map = (typeof window !== 'undefined' && window.__PERSONA_SLUG_MAP && typeof window.__PERSONA_SLUG_MAP === 'object')
      ? window.__PERSONA_SLUG_MAP
      : null;

    const byMap = resolveSlugFromMap(map, [
      item?.lookupName,
      item?.name,
      normalizeRecommendationId(item?.id)
    ]);
    if (byMap) return byMap;

    return normalizeSlugCandidate(extractSlugFromImageFile(item?.imageFile));
  }

  function resolvePersonaMeta(item, personaSlug = '') {
    const slug = normalizeSlugCandidate(personaSlug || resolvePersonaSlug(item));
    if (slug && personaMetaBySlug.has(slug)) {
      return personaMetaBySlug.get(slug);
    }

    const sourceEntry = findPersonaSourceEntry(item, slug);
    if (!sourceEntry) return null;
    const meta = normalizePersonaMeta(sourceEntry);
    if (meta && slug) personaMetaBySlug.set(slug, meta);
    return meta;
  }

  function resolvePersonaLocalizedName(item, personaSlug = '') {
    const slug = normalizeSlugCandidate(personaSlug || resolvePersonaSlug(item));
    const sourceEntry = findPersonaSourceEntry(item, slug);
    if (!sourceEntry || typeof sourceEntry !== 'object') return '';

    const lang = getRouteLang();
    if (lang === 'en') {
      return pickName(sourceEntry.name_en, sourceEntry.nameEn, sourceEntry.name, item?.name, item?.lookupName);
    }
    if (lang === 'jp') {
      return pickName(sourceEntry.name_jp, sourceEntry.nameJp, sourceEntry.name, item?.name, item?.lookupName);
    }
    return pickName(sourceEntry.name, item?.name, item?.lookupName);
  }

  function findPersonaSourceEntry(item, personaSlug = '') {
    const store = (typeof window !== 'undefined' && window.personaFiles && typeof window.personaFiles === 'object')
      ? window.personaFiles
      : null;
    if (!store) return null;

    const normalizedSlug = normalizeSlugCandidate(personaSlug || resolvePersonaSlug(item));
    const bySlugName = resolvePersonaNameBySlug(normalizedSlug);
    const candidates = [
      item?.lookupName,
      item?.name,
      bySlugName,
      normalizeRecommendationId(item?.id)
    ];

    for (const candidate of candidates) {
      const key = String(candidate || '').trim();
      if (!key || !Object.prototype.hasOwnProperty.call(store, key)) continue;
      const entry = store[key];
      if (entry && typeof entry === 'object') return entry;
    }

    return null;
  }

  function resolvePersonaNameBySlug(slug) {
    const normalizedSlug = normalizeSlugCandidate(slug);
    if (!normalizedSlug) return '';

    if (personaNameBySlugCache.has(normalizedSlug)) {
      return personaNameBySlugCache.get(normalizedSlug);
    }

    const map = (typeof window !== 'undefined' && window.__PERSONA_SLUG_MAP && typeof window.__PERSONA_SLUG_MAP === 'object')
      ? window.__PERSONA_SLUG_MAP
      : null;
    if (!map) return '';

    for (const [name, entry] of Object.entries(map)) {
      if (!entry || typeof entry !== 'object') continue;
      const entrySlug = normalizeSlugCandidate(entry.slug);
      if (!entrySlug || entrySlug !== normalizedSlug) continue;
      personaNameBySlugCache.set(normalizedSlug, name);
      return name;
    }

    personaNameBySlugCache.set(normalizedSlug, '');
    return '';
  }

  function normalizePersonaMeta(entry) {
    if (!entry || typeof entry !== 'object') return null;
    const gradeNum = Number(entry.grade || entry.rank || 0);
    const grade = Number.isFinite(gradeNum) && gradeNum > 0 ? gradeNum : null;
    const elementKr = pickName(entry.element);
    const positionKr = pickName(entry.position);
    if (!grade && !elementKr && !positionKr) return null;
    return { grade, elementKr, positionKr };
  }

  function ensurePersonaMetaLoadedBySlug(slug) {
    const normalizedSlug = normalizeSlugCandidate(slug);
    if (!normalizedSlug) return Promise.resolve(null);
    if (personaMetaBySlug.has(normalizedSlug)) return Promise.resolve(personaMetaBySlug.get(normalizedSlug));
    if (personaMetaLoadersBySlug.has(normalizedSlug)) return personaMetaLoadersBySlug.get(normalizedSlug);

    const loader = (async () => {
      const immediate = resolvePersonaMeta({}, normalizedSlug);
      if (immediate) return immediate;

      const personaName = resolvePersonaNameBySlug(normalizedSlug);
      if (!personaName) return null;

      const suffix = VelvetTrialConfig.APP_VER ? `?v=${VelvetTrialConfig.APP_VER}` : '';
      const base = VelvetTrialConfig.BASE || '';
      const encodedName = encodePathParts(personaName);
      const mainPath = `${base}/data/persona/${encodedName}.js${suffix}`;
      const nonOrderPath = `${base}/data/persona/nonorder/${encodedName}.js${suffix}`;

      const loadedMain = await loadExternalScript(mainPath);
      if (!loadedMain) {
        await loadExternalScript(nonOrderPath);
      }

      const loadedMeta = resolvePersonaMeta({}, normalizedSlug);
      if (loadedMeta) {
        personaMetaBySlug.set(normalizedSlug, loadedMeta);
        return loadedMeta;
      }
      return null;
    })().finally(() => {
      personaMetaLoadersBySlug.delete(normalizedSlug);
    });

    personaMetaLoadersBySlug.set(normalizedSlug, loader);
    return loader;
  }

  function loadExternalScript(src) {
    return new Promise((resolve) => {
      try {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
      } catch (_) {
        resolve(false);
      }
    });
  }

  function resolveSlugFromMap(map, keys) {
    if (!map || typeof map !== 'object') return '';
    const candidates = Array.isArray(keys) ? keys : [keys];

    for (const rawCandidate of candidates) {
      const candidate = String(rawCandidate || '').trim();
      if (!candidate) continue;

      const direct = map[candidate];
      const directSlug = extractSlugFromEntry(direct);
      if (directSlug) return directSlug;

      const lowerCandidate = candidate.toLowerCase();
      for (const [mapKey, entry] of Object.entries(map)) {
        if (!entry) continue;

        if (String(mapKey).trim().toLowerCase() === lowerCandidate) {
          const slug = extractSlugFromEntry(entry);
          if (slug) return slug;
        }

        if (entry && typeof entry === 'object' && Array.isArray(entry.aliases)) {
          const matched = entry.aliases.some((alias) => String(alias || '').trim().toLowerCase() === lowerCandidate);
          if (matched) {
            const slug = extractSlugFromEntry(entry);
            if (slug) return slug;
          }
        }
      }
    }

    return '';
  }

  function extractSlugFromEntry(entry) {
    if (!entry) return '';
    if (typeof entry === 'string') return normalizeSlugCandidate(entry);
    if (typeof entry === 'object') return normalizeSlugCandidate(entry.slug);
    return '';
  }

  function extractSlugFromImageFile(value) {
    const file = normalizeImageFile(value);
    if (!file) return '';
    const basename = String(file).split('/').pop() || '';
    const withoutExt = basename.replace(/\.[a-z0-9]{2,5}$/i, '');
    try {
      return decodeURIComponent(withoutExt);
    } catch (_) {
      return withoutExt;
    }
  }

  function collectWeaknessCounts(monsters) {
    const counts = new Map();

    monsters.forEach((monster) => {
      const weakList = Array.isArray(monster?.adapt?.Weak)
        ? monster.adapt.Weak
        : (Array.isArray(monster?.adapt?.['\uC57D\uC810']) ? monster.adapt['\uC57D\uC810'] : []);

      const unique = new Set();
      weakList.forEach((name) => {
        const key = canonicalizeElementKey(name);
        if (key) unique.add(key);
      });

      unique.forEach((key) => counts.set(key, (counts.get(key) || 0) + 1));
    });

    return counts;
  }

  function buildMonsterCard(monster) {
    const card = document.createElement('article');
    card.className = 'vt-monster-card';

    const layout = document.createElement('div');
    layout.className = 'vt-monster-layout';

    const imageWrap = document.createElement('div');
    imageWrap.className = 'vt-monster-image-wrap';

    const image = document.createElement('img');
    image.className = 'vt-monster-image';
    image.alt = monster.name || '';

    const imageFallback = buildMissingImageMarker('vt-monster-image-fallback');

    if (monster.image && !monster.imageMissing) {
      image.src = VelvetTrialConfig.getEnemyImageUrl(monster.image);
      image.onerror = function () {
        image.style.display = 'none';
        imageFallback.classList.add('show');
      };
    } else {
      image.style.display = 'none';
      imageFallback.classList.add('show');
    }

    imageWrap.appendChild(image);
    imageWrap.appendChild(imageFallback);
    layout.appendChild(imageWrap);

    const body = document.createElement('div');
    body.className = 'vt-monster-body';

    const info = document.createElement('div');
    info.className = 'vt-monster-info';

    const nameRow = document.createElement('div');
    nameRow.className = 'vt-monster-name-row';

    const name = document.createElement('div');
    name.className = 'vt-monster-name';
    name.textContent = monster.name || '-';
    nameRow.appendChild(name);

    const level = document.createElement('div');
    level.className = 'vt-monster-level';
    level.textContent = `Lv.${Number.isFinite(Number(monster.level)) ? monster.level : '-'}`;
    nameRow.appendChild(level);

    info.appendChild(nameRow);
    body.appendChild(info);

    const elementsWrap = document.createElement('div');
    elementsWrap.className = 'boss-elements';
    elementsWrap.appendChild(VelvetTrialAdaptSprite.build(monster.adapt || {}));
    body.appendChild(elementsWrap);

    layout.appendChild(body);
    card.appendChild(layout);

    return card;
  }

  function resolveChapterImagePath(chapter) {
    const filename = String(chapter?.images?.chapterImg || '').trim();
    if (!filename || filename === 'AAAAAA==') return '';
    return chapter?.images?.chapterImgPath || VelvetTrialConfig.getChapterImageUrl(filename);
  }

  function normalizeRecommendationData(raw) {
    const base = raw && typeof raw === 'object' && raw.base && typeof raw.base === 'object'
      ? raw.base
      : { characters: [], personas: [] };
    const nameSources = raw && typeof raw === 'object' && raw.nameSources && typeof raw.nameSources === 'object'
      ? raw.nameSources
      : { characters: {}, personas: {} };
    const chapters = raw && typeof raw === 'object' && raw.chapters && typeof raw.chapters === 'object'
      ? raw.chapters
      : {};

    return {
      base: {
        characters: Array.isArray(base.characters) ? base.characters : [],
        personas: Array.isArray(base.personas) ? base.personas : [],
        universal: (base.universal && typeof base.universal === 'object')
          ? base.universal
          : { characters: [], personas: [] },
        byElement: (base.byElement && typeof base.byElement === 'object')
          ? base.byElement
          : {}
      },
      nameSources: {
        characters: nameSources && typeof nameSources.characters === 'object' && !Array.isArray(nameSources.characters)
          ? nameSources.characters
          : {},
        personas: nameSources && typeof nameSources.personas === 'object' && !Array.isArray(nameSources.personas)
          ? nameSources.personas
          : {}
      },
      chapters,
      partyExamples: (raw?.partyExamples && typeof raw.partyExamples === 'object') ? raw.partyExamples : {}
    };
  }

  function buildRecommendationIndex(data) {
    const base = data && typeof data === 'object' && data.base && typeof data.base === 'object'
      ? data.base
      : { characters: [], personas: [] };
    const nameSources = data && typeof data === 'object' && data.nameSources && typeof data.nameSources === 'object'
      ? data.nameSources
      : { characters: {}, personas: {} };

    const charactersByElement = new Map();
    const personasByElement = new Map();
    const characterById = new Map();
    const characterByName = new Map();
    const personaById = new Map();
    const personaByName = new Map();

    ELEMENT_ORDER.forEach((elementKey) => {
      const buckets = {};
      ROLE_KEYS.forEach((roleKey) => {
        buckets[roleKey] = [];
      });
      charactersByElement.set(elementKey, buckets);
      personasByElement.set(elementKey, []);
    });

    const characters = Array.isArray(base?.characters) ? base.characters : [];
    characters.forEach((entry) => {
      const role = normalizeRole(entry?.role || entry?.position);

      const id = String(entry?.id || entry?.key || '').trim();
      if (!id) return;

      const mapped = nameSources.characters?.[id] || null;
      const names = normalizeNames(mapped || entry);
      const keyAlias = pickName(entry?.key, mapped?.key, mapped?.names?.kr);
      const releaseOrder = Number(entry?.releaseOrder || entry?.release_order || 0);
      const elementKeys = normalizeElementKeys(entry?.elementKeys || entry?.elements || entry?.element);

      const item = {
        id,
        role,
        names,
        releaseOrder,
        elementKeys,
        primaryElement: elementKeys[0] || '',
        imageFile: normalizeImageFile(entry?.imageFile || entry?.image || entry?.thumb || entry?.portrait),
        imageType: RECOMMEND_TYPE.CHARACTER,
        positionKr: pickName(entry?.positionKr, entry?.position, ROLE_TO_KR[role])
      };

      characterById.set(id, item);
      registerLookupNames(characterByName, item.names, item);
      if (keyAlias) registerLookupNames(characterByName, { kr: keyAlias, en: keyAlias, jp: keyAlias }, item);

      if (role && elementKeys.length) {
        elementKeys.forEach((elementKey) => {
          const bucket = charactersByElement.get(elementKey);
          if (!bucket || !Array.isArray(bucket[role])) return;
          bucket[role].push(item);
        });
      }
    });

    charactersByElement.forEach((bucket) => {
      ROLE_KEYS.forEach((roleKey) => {
        if (!Array.isArray(bucket[roleKey])) return;
        bucket[roleKey].sort((a, b) => (b.releaseOrder - a.releaseOrder) || a.id.localeCompare(b.id));
      });
    });

    const personas = Array.isArray(base?.personas) ? base.personas : [];
    personas.forEach((entry) => {
      const id = String(entry?.id || entry?.key || '').trim();
      if (!id) return;

      const mapped = nameSources.personas?.[id] || null;
      const names = normalizeNames(mapped || entry);
      const rank = Number(entry?.rank || 0);
      const elementKeys = normalizeElementKeys(entry?.elementKeys || entry?.elements || entry?.element || entry?.nature);
      if (!elementKeys.length) return;

      const item = {
        id,
        names,
        rank,
        elementKeys,
        primaryElement: elementKeys[0] || '',
        imageFile: normalizeImageFile(entry?.imageFile || entry?.image || entry?.thumb || entry?.portrait),
        imageType: RECOMMEND_TYPE.PERSONA
      };

      personaById.set(id, item);
      registerLookupNames(personaByName, item.names, item);

      elementKeys.forEach((elementKey) => {
        const bucket = personasByElement.get(elementKey);
        if (bucket) bucket.push(item);
      });
    });

    personasByElement.forEach((bucket) => bucket.sort((a, b) => (b.rank - a.rank) || (Number(a.id) - Number(b.id))));

    return {
      charactersByElement,
      personasByElement,
      characterById,
      characterByName,
      personaById,
      personaByName
    };
  }

  function normalizeNames(entry) {
    const names = entry?.names;
    if (names && typeof names === 'object') {
      const kr = pickName(names.kr, names.ko, entry?.name, entry?.label);
      const en = pickName(names.en, kr);
      const jp = pickName(names.jp, names.ja, kr);
      return { kr, en, jp };
    }

    const baseName = pickName(entry?.name, entry?.label, entry?.key, entry?.id);
    return { kr: baseName, en: baseName, jp: baseName };
  }

  function normalizeRole(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';

    const lower = raw.toLowerCase();
    for (const [roleKey, aliases] of Object.entries(ROLE_ALIASES)) {
      if (aliases.some((alias) => String(alias).toLowerCase() === lower || alias === raw)) {
        return roleKey;
      }
    }
    return '';
  }

  function normalizeElementKeys(value) {
    if (Array.isArray(value)) {
      return Array.from(new Set(value.flatMap((v) => normalizeElementKeys(v))));
    }

    if (Number.isFinite(Number(value))) {
      const id = Number(value);
      const key = Object.keys(ELEMENT_ID_BY_KEY).find((k) => ELEMENT_ID_BY_KEY[k] === id);
      return key ? [key] : [];
    }

    const raw = String(value || '').trim();
    if (!raw || raw === 'AAAAAA==') return [];

    const direct = canonicalizeElementKey(raw);
    if (direct) return [direct];

    const found = new Set();
    Object.entries(ELEMENT_ALIASES).forEach(([key, aliases]) => {
      aliases.forEach((alias) => {
        if (raw.includes(alias)) found.add(key);
      });
    });

    return Array.from(found);
  }

  function normalizeRecommendType(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === RECOMMEND_TYPE.CHARACTER || raw === 'char' || raw === 'thief') return RECOMMEND_TYPE.CHARACTER;
    if (raw === RECOMMEND_TYPE.PERSONA || raw === 'per') return RECOMMEND_TYPE.PERSONA;
    return '';
  }

  function normalizeRecommendationId(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const stripped = raw.replace(/^(manual|char|character|persona):/i, '').trim();
    return stripped;
  }

  function normalizeSlugCandidate(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(raw)) return '';
    if (!/[a-z]/i.test(raw)) return '';
    return raw.toLowerCase();
  }

  function normalizeLookupKey(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function registerLookupNames(map, names, item) {
    if (!map || !names || !item) return;
    [names.kr, names.ko, names.en, names.jp, names.ja].forEach((value) => {
      const key = normalizeLookupKey(value);
      if (!key || map.has(key)) return;
      map.set(key, item);
    });
  }

  function normalizeImageFile(value) {
    const raw = String(value || '').trim();
    if (!raw || raw === 'AAAAAA==') return '';
    if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw) || raw.startsWith('/')) return raw;
    if (/\.[a-z0-9]{2,5}$/i.test(raw)) return raw;
    return `${raw}.webp`;
  }

  function encodePathParts(value) {
    return String(value || '')
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/');
  }

  function canonicalizeElementKey(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (ELEMENT_ORDER.includes(raw)) return raw;

    const lower = raw.toLowerCase();
    for (const [key, aliases] of Object.entries(ELEMENT_ALIASES)) {
      if (aliases.some((alias) => alias.toLowerCase() === lower || alias === raw)) return key;
    }
    return '';
  }

  function sortElementKeys(a, b) {
    return ELEMENT_ORDER.indexOf(a) - ELEMENT_ORDER.indexOf(b);
  }

  function getCombinedElementIconKrByKeys(elementKeys) {
    const unique = Array.from(
      new Set((Array.isArray(elementKeys) ? elementKeys : [])
        .map((value) => canonicalizeElementKey(value))
        .filter(Boolean))
    ).sort();
    if (!unique.length) return '';
    return COMBINED_ELEMENT_ICON_BY_KEYSET[unique.join('|')] || '';
  }

  function resolveCharacterElementIconKr(item, fallbackElementKey = '') {
    const keys = normalizeElementKeys(item?.elementKeys || item?.elements || item?.elementKey || fallbackElementKey);
    const combined = getCombinedElementIconKrByKeys(keys);
    if (combined) return combined;

    const key = canonicalizeElementKey(fallbackElementKey) || keys[0] || '';
    if (!key) return '';
    return EN_TO_KR_ELEMENT[key] || key;
  }

  function resolveCharacterElementLabel(item, fallbackElementKey = '') {
    const keys = Array.from(
      new Set(normalizeElementKeys(item?.elementKeys || item?.elements || item?.elementKey || fallbackElementKey))
    );
    if (keys.length > 1) {
      return keys.map((key) => getElementLabel(key)).filter(Boolean).join(' / ');
    }

    const key = canonicalizeElementKey(fallbackElementKey) || keys[0] || '';
    return key ? getElementLabel(key) : '';
  }

  function resolveLocalizedText(value) {
    if (typeof value === 'string') return value.trim();
    if (value && typeof value === 'object') {
      const lang = VelvetTrialI18n.getLang();
      return pickName(value[lang], value.kr, value.ko, value.en, value.jp, value.ja);
    }
    return '';
  }

  function pickLocalizedName(names, fallback = '') {
    const lang = VelvetTrialI18n.getLang();
    return pickName(names?.[lang], names?.kr, names?.en, names?.jp, fallback);
  }

  function getElementLabel(elementKey) {
    const id = ELEMENT_ID_BY_KEY[elementKey];
    return id ? VelvetTrialI18n.getElementName(id) : elementKey;
  }

  function pickName(...candidates) {
    for (const candidate of candidates) {
      const text = String(candidate || '').trim();
      if (!text || text === 'AAAAAA==') continue;
      if (/^error:/i.test(text) || text.startsWith('\u30A8\u30E9\u30FC')) continue;
      return text;
    }
    return '';
  }

  function getLevelWeaknessKeys(level) {
    const rule1 = level?.conditions?.rule1;

    if (rule1?.type === 'element_score') {
      const elements = Array.isArray(rule1.elements) ? rule1.elements : [];
      return elements
        .map((id) => ELEMENT_KEY_BY_ID[Number(id)])
        .filter(Boolean)
        .sort(sortElementKeys);
    }

    if (rule1?.type === 'weak_allout') {
      const phases = Array.isArray(level.phases) ? level.phases : [];
      const allMonsters = phases.flatMap((p) => Array.isArray(p.monsters) ? p.monsters : []);
      const weaknessCounts = collectWeaknessCounts(allMonsters);
      return Array.from(weaknessCounts.keys()).sort(sortElementKeys);
    }

    return [];
  }

  function getLevelNavIcons(level) {
    return getLevelWeaknessKeys(level);
  }

  function getExclusionsForLevel(chapterSn, levelSn) {
    const chapterNode = recommendationData.chapters[String(chapterSn)] || null;
    const ex = chapterNode?.rounds?.[String(levelSn)] || {};
    return {
      characters: Array.isArray(ex.characters) ? ex.characters : [],
      personas: Array.isArray(ex.personas) ? ex.personas : []
    };
  }

  function getUniversalRecommendations(chapterSn, levelSn) {
    const base = recommendationData.base;
    const universal = (base.universal && typeof base.universal === 'object') ? base.universal : {};
    const chars = Array.isArray(universal.characters) ? universal.characters : [];
    const personas = Array.isArray(universal.personas) ? universal.personas : [];
    const exclusions = getExclusionsForLevel(chapterSn, levelSn);
    const excludeChars = new Set(exclusions.characters.map((c) => String(c).trim().toLowerCase()));
    const excludePersonas = new Set(exclusions.personas.map((p) => String(p).trim().toLowerCase()));
    return {
      characters: normalizeManualRecommendationList(
        chars.filter((c) => !excludeChars.has(String(c).trim().toLowerCase())),
        RECOMMEND_TYPE.CHARACTER
      ),
      personas: normalizeManualRecommendationList(
        personas.filter((p) => !excludePersonas.has(String(p).trim().toLowerCase())),
        RECOMMEND_TYPE.PERSONA
      )
    };
  }

  function getElementOnlyRecommendations(chapterSn, levelSn, elementKey) {
    const base = recommendationData.base;
    const byElement = (base.byElement && typeof base.byElement === 'object') ? base.byElement : {};
    const allBaseChars = Array.isArray(base.characters) ? base.characters : [];
    const elData = byElement[elementKey];
    const personas = (elData && Array.isArray(elData.personas)) ? elData.personas : [];
    const exclusions = getExclusionsForLevel(chapterSn, levelSn);
    const excludeChars = new Set(exclusions.characters.map((c) => String(c).trim().toLowerCase()));
    const excludePersonas = new Set(exclusions.personas.map((p) => String(p).trim().toLowerCase()));

    const chars = [];
    const seen = new Set();
    allBaseChars.forEach((entry) => {
      const entryKeys = Array.isArray(entry.elementKeys) ? entry.elementKeys : [];
      if (!entryKeys.includes(elementKey)) return;
      const name = String(entry.id || '').trim();
      const k = name.toLowerCase();
      if (k && !seen.has(k) && !excludeChars.has(k)) { seen.add(k); chars.push(name); }
    });

    return {
      characters: normalizeManualRecommendationList(chars, RECOMMEND_TYPE.CHARACTER),
      personas: normalizeManualRecommendationList(
        personas.filter((p) => !excludePersonas.has(String(p).trim().toLowerCase())),
        RECOMMEND_TYPE.PERSONA
      )
    };
  }

  function buildLevelPartyExamplesSection(chapter, level) {
    const chapterSn = String(chapter?.sn);
    const levelSn = String(level?.sn);
    const raw = recommendationData.partyExamples?.[chapterSn]?.[levelSn];

    // Flat array = no phases; plain object = phase-keyed { "1": [...], "2": [...] }
    const isPhaseKeyed = raw && !Array.isArray(raw) && typeof raw === 'object';

    let groups;
    if (isPhaseKeyed) {
      groups = Object.keys(raw)
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => ({
          phaseLabel: `${tSafe('phase_label', null, 'Phase')} ${k}`,
          parties: Array.isArray(raw[k]) ? raw[k] : []
        }))
        .filter((g) => g.parties.length > 0);
    } else {
      const parties = Array.isArray(raw) ? raw : [];
      groups = parties.length > 0 ? [{ phaseLabel: null, parties }] : [];
    }

    if (groups.length === 0) return null;

    // Pre-render parties, skip groups with no visible content
    const renderedGroups = groups.map(({ phaseLabel, parties }) => ({
      phaseLabel,
      partyEls: parties.map(buildPartyExample).filter(Boolean)
    })).filter((g) => g.partyEls.length > 0);

    if (renderedGroups.length === 0) return null;

    const section = document.createElement('section');
    section.className = 'vt-party-examples';

    const titleRow = document.createElement('div');
    titleRow.className = 'vt-party-examples-title-row';
    const titleEl = document.createElement('h4');
    titleEl.className = 'vt-party-examples-title';
    titleEl.textContent = tSafe('party_examples_title', null, '클리어 파티 예시');
    titleRow.appendChild(titleEl);
    section.appendChild(titleRow);

    const disclaimer = document.createElement('p');
    disclaimer.className = 'vt-party-examples-disclaimer';
    disclaimer.textContent = tSafe('party_examples_disclaimer', null, '아래 영상은 인터넷에서 수집된 커뮤니티 공략입니다. lufel.net과는 관련이 없습니다.');
    section.appendChild(disclaimer);

    renderedGroups.forEach(({ phaseLabel, partyEls }) => {
      if (phaseLabel) {
        const phaseLabelEl = document.createElement('div');
        phaseLabelEl.className = 'vt-party-example-phase-label';
        phaseLabelEl.textContent = phaseLabel;
        section.appendChild(phaseLabelEl);
      }
      const list = document.createElement('div');
      list.className = 'vt-party-example-list';
      partyEls.forEach((el) => list.appendChild(el));

      const scrollWrap = document.createElement('div');
      scrollWrap.className = 'vt-party-scroll-wrap';

      const cardWidth = 312; // 300px card + 12px gap

      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'vt-party-scroll-btn vt-party-scroll-btn--prev';
      prevBtn.setAttribute('aria-label', '이전');
      prevBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6L9 12L15 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      prevBtn.addEventListener('click', () => list.scrollBy({ left: -cardWidth, behavior: 'smooth' }));

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'vt-party-scroll-btn vt-party-scroll-btn--next';
      nextBtn.setAttribute('aria-label', '다음');
      nextBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      nextBtn.addEventListener('click', () => list.scrollBy({ left: cardWidth, behavior: 'smooth' }));

      scrollWrap.appendChild(prevBtn);
      scrollWrap.appendChild(list);
      scrollWrap.appendChild(nextBtn);
      section.appendChild(scrollWrap);

      const updateScrollable = () => {
        scrollWrap.classList.toggle('is-scrollable', list.scrollWidth > list.clientWidth);
      };
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(updateScrollable).observe(list);
      } else {
        requestAnimationFrame(updateScrollable);
      }
    });

    return section;
  }

  function showExternalLinkModal(url) {
    const existing = document.querySelector('.vt-ext-link-overlay');
    if (existing) existing.remove();

    const fullUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

    const overlay = document.createElement('div');
    overlay.className = 'vt-ext-link-overlay';

    const modal = document.createElement('div');
    modal.className = 'vt-ext-link-modal';

    const msg = document.createElement('p');
    msg.className = 'vt-ext-link-msg';
    msg.textContent = tSafe('ext_link_warning', null, '외부 사이트로 이동합니다.');

    const urlEl = document.createElement('div');
    urlEl.className = 'vt-ext-link-url';
    urlEl.textContent = url;
    urlEl.title = fullUrl;

    const actions = document.createElement('div');
    actions.className = 'vt-ext-link-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'vt-ext-link-cancel';
    cancelBtn.textContent = tSafe('ext_link_cancel', null, '취소');
    cancelBtn.addEventListener('click', () => overlay.remove());

    const openBtn = document.createElement('button');
    openBtn.className = 'vt-ext-link-open';
    openBtn.textContent = tSafe('ext_link_open', null, '열기');
    openBtn.addEventListener('click', () => {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
      overlay.remove();
    });

    actions.appendChild(cancelBtn);
    actions.appendChild(openBtn);
    modal.appendChild(msg);
    modal.appendChild(urlEl);
    modal.appendChild(actions);
    overlay.appendChild(modal);

    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  function extractYouTubeId(url) {
    if (!url) return null;
    const full = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const m = full.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([^&\n?#]+)/);
    return m ? m[1] : null;
  }

  function extractYouTubeStartTime(url) {
    if (!url) return null;
    try {
      const full = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      const t = new URL(full).searchParams.get('t');
      if (!t) return null;
      // Supports: 354, 354s, 5m30s, 1h5m30s
      const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(\d+)s?$/);
      if (!m) return null;
      const total = (parseInt(m[1] || 0) * 3600) + (parseInt(m[2] || 0) * 60) + parseInt(m[3] || 0);
      return total > 0 ? total : null;
    } catch (_) { return null; }
  }

  function buildPartyExample(party) {
    const url = typeof party === 'string' ? party.trim()
      : typeof party?.url === 'string' ? party.url.trim() : null;
    if (!url) return null;

    const videoId = extractYouTubeId(url);

    const el = document.createElement('div');
    el.className = 'vt-party-example';

    const stage = document.createElement('div');
    stage.className = 'vt-party-yt-stage';

    const poster = document.createElement('div');
    poster.className = 'vt-party-yt-poster';

    if (videoId) {
      const img = document.createElement('img');
      img.alt = 'YouTube';
      img.loading = 'lazy';
      img.src = `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
      poster.appendChild(img);
    } else {
      const urlLabel = document.createElement('span');
      urlLabel.className = 'vt-party-yt-url-label';
      urlLabel.textContent = url;
      poster.appendChild(urlLabel);
    }

    const overlay = document.createElement('div');
    overlay.className = 'vt-party-yt-overlay';
    poster.appendChild(overlay);

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'vt-party-yt-play';
    playBtn.setAttribute('aria-label', tSafe('ext_link_open', null, '재생'));
    const playImg = document.createElement('img');
    playImg.className = 'vt-party-yt-play-img';
    playImg.src = `${VelvetTrialConfig.BASE}/assets/img/character-detail/play_btn.png`;
    playImg.alt = '';
    playBtn.appendChild(playImg);

    if (videoId) {
      playBtn.addEventListener('click', () => {
        stage.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.title = 'YouTube';
        const startTime = extractYouTubeStartTime(url);
        const startParam = startTime ? `&start=${startTime}` : '';
        iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0${startParam}`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        stage.appendChild(iframe);
      });
    }

    poster.appendChild(playBtn);
    stage.appendChild(poster);
    el.appendChild(stage);
    return el;
  }

  function buildLevelRecommendationSection(chapter, level) {
    const chapterSn = Number(chapter?.sn);
    const levelSn = Number(level?.sn);
    const weaknessKeys = getLevelWeaknessKeys(level);
    const universalRec = getUniversalRecommendations(chapterSn, levelSn);
    const elementRecs = weaknessKeys.map((key) => ({
      key,
      ...getElementOnlyRecommendations(chapterSn, levelSn, key)
    }));

    const hasContent = universalRec.characters.length || universalRec.personas.length
      || elementRecs.some((r) => r.characters.length || r.personas.length);
    if (!hasContent) return null;

    const section = document.createElement('section');
    section.className = 'vt-level-recommend';

    const titleRow = document.createElement('div');
    titleRow.className = 'vt-level-recommend-title-row';

    const sectionTitle = document.createElement('h4');
    sectionTitle.className = 'vt-level-recommend-title';
    sectionTitle.textContent = tSafe('recommend_section_title', null, 'Recommendations');
    titleRow.appendChild(sectionTitle);

    if (shouldShowCharacterSpoilerToggle()) {
      titleRow.appendChild(buildCharacterSpoilerToggle());
    }
    section.appendChild(titleRow);

    if (universalRec.characters.length || universalRec.personas.length) {
      section.appendChild(buildLevelRecommendGroup(null, universalRec));
    }

    elementRecs.forEach(({ key, characters, personas }) => {
      if (!characters.length && !personas.length) return;
      section.appendChild(buildLevelRecommendGroup(key, { characters, personas }));
    });

    return section;
  }

  function buildLevelRecommendGroup(elementKey, rec) {
    const head = document.createElement('div');
    head.className = 'vt-level-recommend-head';

    const label = document.createElement('span');
    label.className = 'vt-level-recommend-element-label';
    label.textContent = elementKey
      ? getElementLabel(elementKey)
      : tSafe('recommend_universal', null, 'Universal');
    head.appendChild(label);

    if (elementKey) {
      const krName = EN_TO_KR_ELEMENT[elementKey] || elementKey;
      const icon = document.createElement('img');
      icon.className = 'vt-level-recommend-element-icon';
      icon.src = `${VelvetTrialConfig.BASE}/assets/img/skill-element/${krName}.png`;
      icon.alt = getElementLabel(elementKey);
      icon.onerror = function () { this.style.display = 'none'; };
      head.appendChild(icon);
    }

    const group = document.createElement('div');
    group.className = 'vt-level-recommend-group';

    if (rec.characters.length) {
      group.appendChild(buildRecommendationGroup(
        tSafe('recommend_characters', null, 'Thieves'),
        rec.characters,
        RECOMMEND_TYPE.CHARACTER
      ));
    }
    if (rec.personas.length) {
      group.appendChild(buildRecommendationGroup(
        tSafe('recommend_personas', null, 'Personas'),
        rec.personas,
        RECOMMEND_TYPE.PERSONA
      ));
    }

    const frag = document.createDocumentFragment();
    frag.appendChild(head);
    frag.appendChild(group);
    return frag;
  }

  function formatRule1(rule) {
    if (rule?.type === 'weak_allout') {
      return tSafe('condition_rule1_weak_allout', { multiplier: rule.multiplier }, 'WEAK/All-Out bonus score X{multiplier}');
    }

    if (rule?.type === 'element_score') {
      const elements = Array.isArray(rule.elements)
        ? rule.elements.map((id) => VelvetTrialI18n.getElementName(id)).filter(Boolean).join(' / ')
        : '';
      return tSafe('condition_rule1_element_score', { elements: elements || '-', multiplier: rule.multiplier }, '{elements} element score multiplier X{multiplier}');
    }

    return '';
  }

  function formatRule2(rule) {
    if (rule?.type === 'turn_limit') {
      return tSafe('condition_rule2_turn_limit', { maxActions: rule.maxActions }, 'Win within {maxActions} actions');
    }
    return '';
  }

  function formatRule3(rule) {
    if (rule?.type === 'death_limit') {
      return tSafe('condition_rule3_death_limit', { maxDeaths: rule.maxDeaths }, 'Deaths: {maxDeaths} or less');
    }
    return '';
  }

  function tSafe(key, vars, fallbackText) {
    const translated = VelvetTrialI18n.t(key, vars);
    if (translated && translated !== key) return translated;
    return applyTemplate(fallbackText || key, vars);
  }

  function formatScore(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return '-';
    return num.toLocaleString('en-US');
  }

  function applyTemplate(text, vars) {
    if (!vars || typeof vars !== 'object') return String(text);
    return String(text).replace(/\{([^}]+)\}/g, (_, token) => {
      if (Object.prototype.hasOwnProperty.call(vars, token)) {
        return String(vars[token]);
      }
      return `{${token}}`;
    });
  }

  function buildMissingImageMarker(className) {
    const marker = document.createElement('span');
    marker.className = className;
    marker.setAttribute('aria-hidden', 'true');
    marker.innerHTML = [
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false">',
      '<rect x="3" y="3" width="18" height="18" rx="2.5" fill="none" stroke="rgba(187,196,214,0.45)" stroke-width="1.4"/>',
      '<line x1="7" y1="7" x2="17" y2="17" stroke="rgba(215,224,240,0.85)" stroke-width="1.8" stroke-linecap="round"/>',
      '<line x1="17" y1="7" x2="7" y2="17" stroke="rgba(215,224,240,0.85)" stroke-width="1.8" stroke-linecap="round"/>',
      '</svg>'
    ].join('');
    return marker;
  }

  return {
    init,
    render,
    setSelection,
    getSelectionState,
    setOnSelectionChange,
    setActiveChapter,
    setActiveLevel,
    setRecommendations
  };
})();
