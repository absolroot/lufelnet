const VelvetTrialDataLoader = (function () {
  const cache = new Map();

  const POSITION_TO_ROLE = {
    '\uAD6C\uC6D0': 'medic',
    '\uAD74\uBCF5': 'saboteur',
    '\uBC18\uD56D': 'assassin',
    '\uBC29\uC704': 'guardian',
    '\uC6B0\uC6D4': 'strategist',
    '\uC9C0\uBC30': 'sweeper',
    '\uD574\uBA85': 'elucidator',
    '\uC790\uC728': 'virtuoso',
    '\uAE30\uD0C0': 'other'
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
  const ELEMENT_KEYS = Object.keys(ELEMENT_ALIASES);

  async function fetchJson(url, options = {}) {
    const { optional = false } = options;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      if (optional) return null;
      throw new Error(`Failed to load velvet trial data: ${response.status}`);
    }
    return response.json();
  }

  function normalizeText(value) {
    return String(value ?? '').trim();
  }

  function sanitizeName(value) {
    const text = normalizeText(value);
    if (!text || text === 'AAAAAA==') return '';
    if (/^error:/i.test(text) || text.startsWith('\u30A8\u30E9\u30FC')) return '';
    return text;
  }

  function canonicalizeElementKey(value) {
    const raw = normalizeText(value);
    if (!raw) return '';
    if (ELEMENT_KEYS.includes(raw)) return raw;
    const lower = raw.toLowerCase();
    for (const [key, aliases] of Object.entries(ELEMENT_ALIASES)) {
      if (aliases.some((alias) => alias.toLowerCase() === lower || alias === raw)) return key;
    }
    return '';
  }

  function normalizeElementKeys(value) {
    if (Array.isArray(value)) {
      return Array.from(new Set(value.flatMap((item) => normalizeElementKeys(item))));
    }

    const raw = normalizeText(value);
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

  async function ensureCharacterInfoLoaded() {
    const key = '__character_info_script__';
    if (cache.has(key)) return cache.get(key);

    const promise = (async () => {
      if (typeof window !== 'undefined' && window.characterData && typeof window.characterData === 'object') {
        return window.characterData;
      }

      if (typeof document === 'undefined') return {};

      const src = VelvetTrialConfig.getCharacterInfoUrl();
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => resolve();
        (document.head || document.body || document.documentElement).appendChild(script);
      });

      if (typeof window !== 'undefined' && window.characterData && typeof window.characterData === 'object') {
        return window.characterData;
      }
      return {};
    })();

    cache.set(key, promise);
    return promise;
  }

  function buildCharacterCandidates(characterData) {
    const rows = characterData && typeof characterData === 'object' ? characterData : {};
    const output = [];

    Object.entries(rows).forEach(([key, row]) => {
      const id = normalizeText(key);
      if (!id) return;

      const positionKr = normalizeText(row?.position);
      const role = POSITION_TO_ROLE[positionKr] || '';

      const elementKeys = normalizeElementKeys(row?.element);

      const kr = sanitizeName(row?.name) || id;
      const en = sanitizeName(row?.codename) || sanitizeName(row?.name_en) || kr;
      const jp = sanitizeName(row?.name_jp) || kr;

      output.push({
        id,
        key: id,
        role,
        positionKr,
        elementKeys,
        releaseOrder: Number(row?.release_order) || 0,
        imageType: 'character',
        imageFile: `${id}.webp`,
        imageMissing: false,
        names: { kr, en, jp }
      });
    });

    output.sort((a, b) => (b.releaseOrder - a.releaseOrder) || a.id.localeCompare(b.id, 'ko'));
    return output;
  }

  function buildNameSources(characters) {
    return {
      characters: Object.fromEntries(characters.map((entry) => [entry.id, { key: entry.key, names: entry.names }])),
      personas: {}
    };
  }

  function buildRecommendationBase(characters) {
    return {
      characters: characters.map((entry) => ({
        id: entry.id,
        key: entry.key,
        role: entry.role,
        positionKr: entry.positionKr,
        elementKeys: entry.elementKeys,
        releaseOrder: entry.releaseOrder,
        imageType: entry.imageType,
        imageFile: entry.imageFile,
        imageMissing: entry.imageMissing
      })),
      personas: []
    };
  }

  async function load(lang) {
    const normalizedLang = VelvetTrialI18n.SUPPORTED.includes(lang) ? lang : 'kr';
    if (cache.has(normalizedLang)) {
      return cache.get(normalizedLang);
    }

    const url = VelvetTrialConfig.getDataUrl(normalizedLang);
    const json = await fetchJson(url);
    cache.set(normalizedLang, json);
    return json;
  }

  async function loadRecommendations(trialData) {
    const key = '__recommendations__';
    if (cache.has(key)) {
      return cache.get(key);
    }

    const normalizedTrialData = trialData && typeof trialData === 'object' && Array.isArray(trialData.chapters)
      ? trialData
      : await load('kr');

    const chapters = Array.isArray(normalizedTrialData?.chapters) ? normalizedTrialData.chapters : [];

    const uniqueChapterSns = Array.from(new Set(
      chapters
        .map((chapter) => Number(chapter?.sn))
        .filter((sn) => Number.isFinite(sn))
    ));

    const [characterData, baseJson, exclusionFiles, partyExampleFiles] = await Promise.all([
      ensureCharacterInfoLoaded(),
      fetchJson(VelvetTrialConfig.getRecommendBaseUrl(), { optional: true }).then((r) => r || {}),
      Promise.all(uniqueChapterSns.map((sn) =>
        fetchJson(VelvetTrialConfig.getRecommendExclusionsUrl(sn), { optional: true })
      )),
      Promise.all(uniqueChapterSns.map((sn) =>
        fetchJson(VelvetTrialConfig.getPartyExamplesUrl(sn), { optional: true })
      ))
    ]);

    const characters = buildCharacterCandidates(characterData);
    const nameSources = buildNameSources(characters);
    const base = {
      ...buildRecommendationBase(characters),
      universal: (baseJson.universal && typeof baseJson.universal === 'object')
        ? baseJson.universal
        : { characters: [], personas: [] },
      byElement: (baseJson.byElement && typeof baseJson.byElement === 'object')
        ? baseJson.byElement
        : {}
    };

    const chapterRecommendations = {};
    const partyExamples = {};
    uniqueChapterSns.forEach((chapterSn, index) => {
      const exclusionFile = exclusionFiles[index];
      chapterRecommendations[String(chapterSn)] = {
        chapterSn,
        rounds: (exclusionFile && typeof exclusionFile === 'object') ? exclusionFile : {}
      };
      const partyFile = partyExampleFiles[index];
      partyExamples[String(chapterSn)] = (partyFile && typeof partyFile === 'object') ? partyFile : {};
    });

    const payload = {
      base,
      nameSources,
      chapters: chapterRecommendations,
      partyExamples
    };

    cache.set(key, payload);
    return payload;
  }

  return {
    load,
    loadRecommendations
  };
})();
