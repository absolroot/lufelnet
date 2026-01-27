// Skill Source Modal & CSV Parsing (self-initializing)
(function () {
  // Utilities
  function normalizeRoman(num) {
    if (!num) return '';
    const map = { 'Ⅰ': 'I', 'Ⅱ': 'II', 'Ⅲ': 'III', 'Ⅳ': 'IV', 'Ⅴ': 'V' };
    return (map[num] || num).trim();
  }

  function extractRankSuffix(name) {
    if (!name) return '';
    const m = name.trim().match(/(?:\s+|)(I{1,3}|IV|V|Ⅰ|Ⅱ|Ⅲ|Ⅳ|Ⅴ)$/);
    return m ? normalizeRoman(m[1]) : '';
  }

  function stripRankSuffix(name) {
    if (!name) return '';
    return name.replace(/(?:\s+|)(I{1,3}|IV|V|Ⅰ|Ⅱ|Ⅲ|Ⅳ|Ⅴ)$/, '').trim();
  }

  // Cache
  let skillSourceMap = null;
  let skillSourceMapLoading = null;

  // Shared global ad rotation (used by multiple modals)
  function getSharedAdRotation() {
    const w = (typeof window !== 'undefined') ? window : globalThis;
    if (!w.__modalAdRotation) {
      w.__modalAdRotation = {
        slots: ['7254578915', '7331282728', '6018201052', '9244892982'],
        idx: 0
      };
    }
    return w.__modalAdRotation;
  }
  function nextSharedAdSlot() {
    const state = getSharedAdRotation();
    const slot = state.slots[state.idx % state.slots.length];
    state.idx++;
    return slot;
  }

  async function loadSkillSourceMap() {
    if (skillSourceMap) return skillSourceMap;
    if (skillSourceMapLoading) return skillSourceMapLoading;

    const cacheVer = (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1');
    const url = `${(typeof SITE_BASEURL !== 'undefined' ? SITE_BASEURL : '{{ site.baseurl }}')}/data/kr/wonder/persona_skill_from.csv?v=${cacheVer}`;
    skillSourceMapLoading = fetch(url)
      .then(res => res.text())
      .then(text => parseSkillSourceCSV(text))
      .then(map => { skillSourceMap = map; return map; })
      .catch(err => { console.error('Failed to load skill source CSV:', err); return {}; });
    return skillSourceMapLoading;
  }

  function parseSkillSourceCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length);
    if (lines.length === 0) return {};

    let start = 0;
    if (/korean\s*,\s*english\s*,\s*japanese/i.test(lines[0])) start = 1;

    const map = {};
    for (let i = start; i < lines.length; i++) {
      const raw = lines[i];
      const cols = raw.split(',').map(s => s.trim());
      if (cols.length < 4) continue;

      const sourceKr = cols[0] || '';
      const sourceEn = cols[1] || '';
      const sourceJp = cols[2] || '';

      let skillStartIdx = 3;
      if (/^\d+$/.test(cols[3])) skillStartIdx = 4;

      const sourceObj = { kr: sourceKr, en: sourceEn, jp: sourceJp };

      for (let c = skillStartIdx; c < cols.length; c++) {
        const skillFullKr = cols[c];
        if (!skillFullKr) continue;

        const base = stripRankSuffix(skillFullKr);
        const rank = extractRankSuffix(skillFullKr); // '' or I~V

        if (!map[base]) map[base] = { ranks: { I: [], II: [], III: [], IV: [], V: [] }, plain: [] };

        if (rank) {
          const key = normalizeRoman(rank);
          if (!map[base].ranks[key]) map[base].ranks[key] = [];
          map[base].ranks[key].push(sourceObj);
        } else {
          map[base].plain.push(sourceObj);
        }
      }
    }
    return map;
  }

  // Modal
  function ensureSkillSourceModal() {
    if (document.getElementById('skillSourceModal')) return;
    const modal = document.createElement('div');
    modal.id = 'skillSourceModal';
    modal.className = 'skill-source-modal hidden';
    modal.innerHTML = `
      <div class="skill-source-backdrop" data-close="1"></div>
      <div class="skill-source-dialog" role="dialog" aria-modal="true">
        <div class="skill-source-header">
          <div class="skill-source-title-wrap">
            <div class="skill-source-title-row">
              <img id="skillSourceIcon" class="skill-source-icon" alt="" />
              <h3 id="skillSourceTitle">Skill Sources</h3>
            </div>
            <div id="skillSourceSubtitle" class="skill-source-subtitle"></div>
          </div>
          <button class="skill-source-close" aria-label="Close" data-close="1">×</button>
        </div>
        <div class="skill-source-content" id="skillSourceContent"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target.dataset.close === '1') closeSkillSourceModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSkillSourceModal();
    });
  }

  function openSkillSourceModal(title, html, opts) {
    ensureSkillSourceModal();
    const modal = document.getElementById('skillSourceModal');
    const titleEl = document.getElementById('skillSourceTitle');
    const contentEl = document.getElementById('skillSourceContent');
    const subtitleEl = document.getElementById('skillSourceSubtitle');
    const iconEl = document.getElementById('skillSourceIcon');
    if (titleEl) titleEl.textContent = title;
    if (contentEl) contentEl.innerHTML = html;
    if (subtitleEl) subtitleEl.textContent = (opts && opts.subtitle) ? opts.subtitle : '';
    if (iconEl) {
      const src = opts && opts.iconSrc ? opts.iconSrc : '';
      if (src) {
        iconEl.src = src;
        iconEl.style.display = 'block';
        // Hide icon if it fails to load
        iconEl.onerror = () => { iconEl.style.display = 'none'; };
      } else {
        iconEl.removeAttribute('src');
        iconEl.style.display = 'none';
      }
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Ads removed: no ad injection inside skill source modal
  }

  function closeSkillSourceModal() {
    const modal = document.getElementById('skillSourceModal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function addRecommendedSkillClickHandler() {
    const container = document.getElementById('personaCards');
    if (!container) return;

    container.addEventListener('click', async (e) => {
      const target = e.target;
      // Accept clicks on the name container or anything inside it (icon, name text)
      const nameContainer = target.closest('.skill-name-container');
      if (!nameContainer) return;

      // Find the actual skill-name element within the container to read attributes/text
      const nameEl = nameContainer.querySelector('.skill-name');
      if (!nameEl) return;

      const currentLang = typeof LanguageRouter !== 'undefined' ? LanguageRouter.getCurrentLanguage() : 'kr';
      const korFull = nameEl.getAttribute('data-skill-kor-full') || '';
      const baseKor = nameEl.getAttribute('data-skill-base-kor') || stripRankSuffix(korFull);
      const rankFromUI = extractRankSuffix(nameEl.textContent || '');

      // Prepare skill icon and description (using global personaSkillList if present)
      let skillInfo = null;
      const skillsMap = (typeof personaSkillList !== 'undefined') ? personaSkillList : ((typeof window !== 'undefined' && window.personaSkillList) ? window.personaSkillList : null);
      if (skillsMap) {
        skillInfo = skillsMap[korFull] || skillsMap[baseKor] || null;
      }
      const siteBase = (typeof window !== 'undefined' && window.SITE_BASEURL) ? window.SITE_BASEURL : '';
      // Choose icon based on language (use icon_gl for en/jp when available)
      const iconKey = (skillInfo)
        ? ((currentLang === 'en' || currentLang === 'jp')
            ? (skillInfo.icon_gl || skillInfo.icon || '')
            : (skillInfo.icon || ''))
        : '';
      const iconSrc = iconKey ? `${siteBase}/assets/img/persona/속성_${iconKey}.png` : '';
      let subtitle = '';
      if (skillInfo) {
        if (currentLang === 'en') subtitle = skillInfo.description_en || skillInfo.description || '';
        else if (currentLang === 'jp') subtitle = skillInfo.description_jp || skillInfo.description || '';
        else subtitle = skillInfo.description || '';
      }

      const map = await loadSkillSourceMap();
      const entry = map[baseKor];

      const title = (nameEl.textContent || baseKor).trim();

      const noSourcesText = (function () {
        if (currentLang === 'en') return 'No sources found.';
        if (currentLang === 'jp') return '入手先が見つかりません。';
        return '출처를 찾을 수 없습니다.';
      })();

      if (!entry) {
        openSkillSourceModal(title, `<div class="skill-source-empty">${noSourcesText}</div>`, { iconSrc, subtitle });
        return;
      }

      const ranksOrder = ['I', 'II', 'III', 'IV', 'V'];
      const hasAnyRank = ranksOrder.some(r => entry.ranks[r] && entry.ranks[r].length);

      let sections = [];

      function renderSources(list) {
        if (!list || list.length === 0) return `<div class="skill-source-empty">${noSourcesText}</div>`;
        const labelKey = currentLang === 'en' ? 'en' : (currentLang === 'jp' ? 'jp' : 'kr');
        return `<div class="skill-source-list">${list.map(s => {
          const display = (s[labelKey] || s.kr).trim();
          const sourceKr = (s.kr || '').trim();
          const sourceEn = (s.en || '').trim();
          const iconName = encodeURIComponent(sourceKr) + '.png';
          const iconPath = `${siteBase}/apps/persona/persona_icon/${iconName}`;
          const isKrOnly = (sourceKr === '결제 이벤트') || sourceKr.startsWith('와일드 엠블럼') || sourceEn.startsWith('Wild Emblem');
          const krOnlyBadge = (isKrOnly && currentLang !== 'kr') ? (currentLang === 'jp' ? '<span class="kr-only-badge">(KR専用)</span>' : '<span class="kr-only-badge">(KR Only)</span>') : '';
          return `<div class="skill-source-item"><img class="source-icon" src="${iconPath}" alt="" onerror="this.style.display='none'" /><span class="source-label">${display}</span>${krOnlyBadge}</div>`;
        }).join('')}</div>`;
      }

      if (hasAnyRank) {
        const preferred = normalizeRoman(rankFromUI);
        if (preferred && entry.ranks[preferred] && entry.ranks[preferred].length) {
          sections.push(`<div class="skill-source-group"><div class="group-title">${preferred}</div>${renderSources(entry.ranks[preferred])}</div>`);
        }
        ranksOrder.forEach(r => {
          if (r === preferred) return;
          const arr = entry.ranks[r];
          if (arr && arr.length) {
            sections.push(`<div class="skill-source-group"><div class="group-title">${r}</div>${renderSources(arr)}</div>`);
          }
        });
        if (entry.plain && entry.plain.length) {
          sections.push(`<div class="skill-source-group"><div class="group-title">-</div>${renderSources(entry.plain)}</div>`);
        }
      } else {
        sections.push(`<div class="skill-source-group">${renderSources(entry.plain)}</div>`);
      }

      const labelText = (function(){
        if (currentLang === 'en') return 'Sources';
        if (currentLang === 'jp') return '入手先';
        return '획득처';
      })();
      const html = `<div class="skill-source-label" style="font-weight:700;margin-bottom:8px;color:#ffd54f;">${labelText}</div><div class="skill-source-sections">${sections.join('')}</div>`;
      openSkillSourceModal(title, html, { iconSrc, subtitle });
    });
  }

  // Self-init after DOM ready and when personaCards exists
  function initWhenReady() {
    const tryInit = () => {
      const cards = document.getElementById('personaCards');
      if (cards) {
        addRecommendedSkillClickHandler();
        return true;
      }
      return false;
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (!tryInit()) {
          const observer = new MutationObserver(() => {
            if (tryInit()) observer.disconnect();
          });
          observer.observe(document.body, { childList: true, subtree: true });
        }
      });
    } else {
      if (!tryInit()) {
        const observer = new MutationObserver(() => {
          if (tryInit()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  }

  initWhenReady();
})();