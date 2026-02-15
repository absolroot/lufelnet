// character/cha_stats.js
(function () {
    // ?전 ?행 ?틸
    function safe(fn) { try { fn(); } catch (e) { console.warn('[cha_stats]', e); } }
  
    // ?재 ?어 가?오?(?이지???의?어 ?으??용)
    function getLang() {
      try { return typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'kr'; }
      catch(_) { return 'kr'; }
    }

    function t(key, fallback) {
      if (typeof window.t === 'function') {
        try {
          return window.t(key, fallback);
        } catch (_) {}
      }
      if (window.I18nService && typeof window.I18nService.t === 'function') {
        const result = window.I18nService.t(key, fallback);
        if (result && result !== key) return result;
      }
      return fallback;
    }

    function getAwarenessPattern(lang) {
      if (lang === 'en') return t('characterStatsAwarenessPatternEn', 'A{idx}');
      if (lang === 'jp') return t('characterStatsAwarenessPatternJp', '意識{idx}');
      return t('characterStatsAwarenessPatternKr', '의식 {idx}');
    }

    function awarenessLabel(idx, lang) {
      return getAwarenessPattern(lang).replace(/\{idx\}/g, String(idx));
    }

    function statsLabelSet() {
      return {
        hp: t('characterStatsLabelHp', '생명'),
        atk: t('characterStatsLabelAtk', '공격력'),
        def: t('characterStatsLabelDef', '방어력')
      };
    }
  

    function localizeBaseStatsLabels() {
      const labels = statsLabelSet();
      const speed = t('gameTerms.speed', '속도');
      const statLabels = document.querySelectorAll('.stats-card .stats-main .stats-grid .stat-row .label');
      if (!statLabels || statLabels.length < 4) return;
      statLabels[0].textContent = labels.hp;
      statLabels[1].textContent = labels.atk;
      statLabels[2].textContent = labels.def;
      statLabels[3].textContent = speed;
    }
    // URL?라미터 name
    function getCharacterNameFromURL() {
      const p = new URLSearchParams(window.location.search);
      return p.get('name');
    }
  
    // basicStatsData 로더
    function ensureBasicStatsLoaded() {
      return new Promise((resolve) => {
        if (window.basicStatsData) return resolve(true);

        const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : Date.now();
        const charName = getCharacterNameFromURL();
        const basePath = `${window.BASE_URL || ''}/data/characters/${encodeURIComponent(charName)}`;

        // 1) per-character JS ?선 ?도
        const tryPerCharacterJs = () => new Promise((res) => {
          try {
            const s = document.createElement('script');
            s.src = `${basePath}/base_stats.js?v=${ver}`;
            s.onload = () => {
              try {
                if (window.basicStatsData && window.basicStatsData[charName]) return res(true);
                // ?거??변?명 ?캔 (basicStats_* ?태)
                const keys = Object.keys(window).filter(k => /^basicStats_/.test(k));
                for (const k of keys) {
                  const val = window[k];
                  if (val && typeof val === 'object') {
                    window.basicStatsData = window.basicStatsData || {};
                    window.basicStatsData[charName] = val;
                    break;
                  }
                }
                res(!!(window.basicStatsData && window.basicStatsData[charName]));
              } catch(_) { res(false); }
            };
            s.onerror = () => res(false);
            document.head.appendChild(s);
          } catch(_) { res(false); }
        });

        // 2) per-character JSON ?백
        const tryPerCharacterJson = async () => {
          try {
            const r = await fetch(`${basePath}/base_stats.json?v=${ver}`, { cache: 'no-store' });
            if (!r.ok) return false;
            const data = await r.json();
            if (data && typeof data === 'object') {
              window.basicStatsData = window.basicStatsData || {};
              window.basicStatsData[charName] = data;
              return true;
            }
          } catch(_) {}
          return false;
        };

        (async () => {
          if (await tryPerCharacterJs()) return resolve(true);
          if (await tryPerCharacterJson()) return resolve(true);
          console.warn('[cha_stats] basicStats per-character missing (skipping)');
          resolve(!!window.basicStatsData);
        })();
      });
    }
  
    // ?름 ???국????매핑
    function toKoreanKey(name, lang) {
      if (!name) return null;
      if (window.characterData && window.characterData[name]) return name; // ?? KR??
  
      // ????(EN/JP ?시 ?름???어??경우)
      if (window.characterData) {
        for (const k in window.characterData) {
          const cd = window.characterData[k] || {};
          if (lang === 'en' && cd.name_en === name) return k;
          if (lang === 'jp' && cd.name_jp === name) return k;
          // ?시 ?체 ?? ?름 ?드? 같? 경우
          if (cd.name === name) return k;
        }
      }
      return name; // 마???도
    }
  
    // awake7 ????-> ?벨(kr/en/jp)
    function translateAwakeLabel(internalKey) {
      const keyMap = {
        attack_per: ['characterStatsAwakeAttackPercent', '공격력 %'],
        defense_per: ['characterStatsAwakeDefensePercent', '방어력 %'],
        HP_per: ['characterStatsAwakeHpPercent', '생명 %'],
        crit_rate: ['characterStatsAwakeCritRate', '크리티컬 확률'],
        crit_mult: ['characterStatsAwakeCritDamage', '크리티컬 효과'],
        speed: ['characterStatsAwakeSpeed', '속도'],
        ailment_accuracy: ['characterStatsAwakeAilmentAccuracy', '효과 명중'],
        sp_recover: ['characterStatsAwakeSpRecovery', 'SP 회복'],
        HP_recover: ['characterStatsAwakeHealingEffect', '치료 효과'],
        pierce_rate: ['characterStatsAwakePierceRate', '관통']
      };
      const mapped = keyMap[internalKey];
      if (!mapped) return t('characterStatsAwakeFallback', '잠재력');
      return t(mapped[0], mapped[1]);
    }
  
    // ?센?????? (awake7 ??맷??
    function isPercentKey(key) {
      return key.endsWith('_per') ||
             key === 'crit_rate' ||
             key === 'crit_mult' ||
             key === 'ailment_accuracy' ||
             key === 'sp_recover' ||
             key === 'HP_recover' ||
             key === 'pierce_rate'
    }
  
    // DOM ?퍼
    function qs(sel) { return document.querySelector(sel); }
    function setText(sel, v) { const el = qs(sel); if (el) el.textContent = (v ?? '') + ''; }
    function setValueRow(baseSelector, idx, v) {
      const row = document.querySelector(`${baseSelector} .stat-row:nth-child(${idx}) .value`);
      if (row) row.textContent = (v ?? '') + '';
    }
  
    function localizeAwakeTitle() {
      return t('characterStatsAwakeTitle', '잠재력 LV7');
    }

    // ?탯 카드 ?목 로컬?이?(h2, h3)
    function localizeStatsHeadings(lang) {
      const h2 = t('characterStatsSectionTitle', '스탯');
      const h3Left = t('characterStatsBaseTitle', '기초 스탯');
      const h3Right = t('characterStatsAwakeTitle', '잠재력 LV7');

      setText('.stats-card h2', h2);
      const leftH3Sel = '.stats-card .stats-settings .setting-section:nth-child(1) > h3';
      const rightH3Sel = '.stats-card .stats-settings .setting-section:nth-child(2) > h3';
      const leftH3 = document.querySelector(leftH3Sel);
      const rightH3 = document.querySelector(rightH3Sel);
      if (leftH3) {
        leftH3.innerHTML = `${h3Left}
          <span class="help-icon" onclick="showHelpModal('base-stats')">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>
              <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>
            </svg>
          </span>`;
      }
      if (rightH3) {
        rightH3.innerHTML = `${h3Right}
          <span class="help-icon" onclick="showHelpModal('awake7')">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>
              <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>
            </svg>
          </span>`;
      }
    }


    function localizeStatsCardTexts() {
      const lang = getLang();
      localizeStatsHeadings(lang);
      localizeBaseStatsLabels();
      const awakeTitle = document.querySelector('.stats-awake .awake-title');
      if (awakeTitle) awakeTitle.textContent = localizeAwakeTitle();
      const lv80Title = document.querySelector('.lv80-stats-card .lv80-title');
      if (lv80Title) lv80Title.textContent = localizeLv80Title();
      const lv100Title = document.querySelector('.lv100-stats-card .lv80-title');
      if (lv100Title) lv100Title.textContent = t('characterStatsLv100Title', 'Base Stats (LV 100)');
      relocalizeLvStatsGrid('.lv80-stats-card .lv80-grid', lang);
      relocalizeLvStatsGrid('.lv100-stats-card .lv80-grid', lang);
      const awakeLabel = document.querySelector('.stats-awake .label');
      if (awakeLabel && awakeLabel.dataset && awakeLabel.dataset.awakeKey) {
        awakeLabel.textContent = translateAwakeLabel(awakeLabel.dataset.awakeKey);
      }
    }

    function relocalizeLvStatsGrid(selector, lang) {
      const grid = document.querySelector(selector);
      if (!grid) return;

      const labels = statsLabelSet();
      const L_HP = labels.hp;
      const L_ATK = labels.atk;
      const L_DEF = labels.def;
      const labelCells = Array.from(grid.querySelectorAll('.lv80-cell.label'));
      if (labelCells.length < 4) return;

      const norm = (v) => String(v || '').replace(/\s+/g, ' ').trim();
      const extractAwakeIdx = (v) => {
        const m = norm(v).match(/(\d+)/);
        return m ? parseInt(m[1], 10) : null;
      };

      const secondText = norm(labelCells[1] && labelCells[1].textContent);
      // Wide layout second label is awareness (contains index number), narrow layout is stat label.
      const isNarrowLayout = !/\d+/.test(secondText);

      if (isNarrowLayout) {
        labelCells[1].textContent = L_HP;
        labelCells[2].textContent = L_ATK;
        labelCells[3].textContent = L_DEF;
        for (let i = 4; i < labelCells.length; i++) {
          const idx = extractAwakeIdx(labelCells[i].textContent);
          labelCells[i].textContent = awarenessLabel(idx !== null ? idx : (i - 4), lang);
        }
        return;
      }

      const statStart = Math.max(1, labelCells.length - 3);
      for (let i = 1; i < statStart; i++) {
        const idx = extractAwakeIdx(labelCells[i].textContent);
        labelCells[i].textContent = awarenessLabel(idx !== null ? idx : (i - 1), lang);
      }
      if (labelCells[statStart]) labelCells[statStart].textContent = L_HP;
      if (labelCells[statStart + 1]) labelCells[statStart + 1].textContent = L_ATK;
      if (labelCells[statStart + 2]) labelCells[statStart + 2].textContent = L_DEF;
    }

    function getI18nServiceInstance() {
      return window.__I18nService__ || window.I18nService || null;
    }

    function hasCharacterPack(lang) {
      const service = getI18nServiceInstance();
      return !!(service &&
        service.cache &&
        service.cache[lang] &&
        service.cache[lang].pages &&
        service.cache[lang].pages.character);
    }

    function waitAndRelocalizeStatsCard() {
      const maxAttempts = 60;
      const intervalMs = 100;
      let attempts = 0;

      function tryRelocalize() {
        const lang = getLang();
        if (hasCharacterPack(lang) || lang === 'kr') {
          safe(localizeStatsCardTexts);
          return;
        }
        attempts += 1;
        if (attempts < maxAttempts) {
          setTimeout(tryRelocalize, intervalMs);
        }
      }

      tryRelocalize();
    }

    function registerI18nLanguageHook() {
      const service = getI18nServiceInstance();
      if (!service || typeof service.onLanguageChange !== 'function') return;
      if (window.__CharacterStatsI18nHookRegistered__) return;
      window.__CharacterStatsI18nHookRegistered__ = true;
      service.onLanguageChange(() => {
        safe(localizeStatsCardTexts);
      });
    }

    window.localizeCharacterStatsCard = function () {
      safe(localizeStatsCardTexts);
    };
    // LV80 기초 ?탯 ?션 ??? 지??
    function localizeLv80Title() {
      return t('characterStatsLv80Title', '기초 스탯 (LV 80)');
    }
  
    // a0_lv80 ~ a7_lv80 ??나?도 ?이?? ?는지 ?인
    function hasAnyLv80(statObj) {
      if (!statObj) return false;
      for (let i = 0; i <= 7; i++) {
        const key = `a${i}_lv80`;
        const v = statObj[key];
        if (v && (v.HP != null || v.attack != null || v.defense != null)) return true;
      }
      return false;
    }
  
    // a0_lv100 ~ a7_lv100 ??나?도 ?이?? ?는지 ?인
    function hasAnyLv100(statObj) {
      if (!statObj) return false;
      for (let i = 0; i <= 7; i++) {
        const key = `a${i}_lv100`;
        const v = statObj[key];
        if (v && (v.HP != null || v.attack != null || v.defense != null)) return true;
      }
      return false;
    }

    // LV80 기초 ?탯 DOM 빌드 ??더 (??컬럼 ?역 ? ?체 ???용)
    function renderLv80BaseStats(statObj, lang) {
      try {
        if (!hasAnyLv80(statObj)) return; // ?체 비표??

        // ??컬럼 ?퍼(.stats-settings) 바로 ?래(?제)??입?여 ?체 ???용
        const settingsWrap = document.querySelector('.stats-card .stats-settings');
        const cardRoot = document.querySelector('.stats-card');
        if (!settingsWrap || !cardRoot) return;

        // 컨테?너 ?성
        const wrap = document.createElement('div');
        wrap.className = 'lv80-stats-card setting-section';
        wrap.style.marginTop = '16px';

        const title = document.createElement('h3');
        title.className = 'lv80-title';
        title.textContent = localizeLv80Title();
        wrap.appendChild(title);

        const grid = document.createElement('div'); // ?이?컨테?너
        grid.className = 'lv80-grid';
        grid.style.fontSize = '14px';
        wrap.appendChild(grid);

        // ?? ?성: a0~a7 ?회, 존재?는 것만 추?
        const items = [];
        for (let i = 0; i <= 7; i++) {
          const key = `a${i}_lv80`;
          const v = statObj[key];
          if (v && (v.HP != null || v.attack != null || v.defense != null)) {
            items.push({ idx: i, data: v });
          }
        }
        if (items.length === 0) return;

        // 공통 ?벨
        const labels = statsLabelSet();
        const L_HP = labels.hp;
        const L_ATK = labels.atk;
        const L_DEF = labels.def;

        // ?치 ?맷: ?수 첫째?리까? ?시, ?째?리?서 반올?
        function fmt1(v) {
          if (v === undefined || v === null || isNaN(v)) return '';
          const n = Math.round(Number(v) * 10) / 10;
          return n.toFixed(1);
        }

        // ?치 ?맷: ?수 ?시, ?숫??첫째?리?서 반올?
        function fmt0(v) {
          if (v === undefined || v === null || isNaN(v)) return '';
          const n = Math.round(Number(v));
          return n.toFixed(0);
        }

        // ?더 ?벨 지??: KR: ?식0~6, JP: ?識0~6, ??? A0~6
        function lv80HeaderLabel(idx, currentLang) {
          return awarenessLabel(idx, currentLang);
        }

        // ???성 ?수??(??스?에 ?라??????미적??
        function renderWide() {
          grid.innerHTML = '';
          const cols = items.length + 1; // ?컬럼? ?벨
          grid.style.display = 'grid';
          grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
          grid.style.gap = '6px';

          // ?더 ?? [blank, A0/A1... (지??)]
          const headBlank = document.createElement('div');
          headBlank.className = 'lv80-cell label';
          grid.appendChild(headBlank);
          items.forEach(({ idx }) => {
            const h = document.createElement('div');
            h.className = 'lv80-cell label';
            h.textContent = lv80HeaderLabel(idx, lang);
            grid.appendChild(h);
          });

          // HP ??
          const hpLabel = document.createElement('div');
          hpLabel.className = 'lv80-cell label';
          hpLabel.textContent = L_HP;
          grid.appendChild(hpLabel);
          items.forEach(({ data }) => {
            const c = document.createElement('div');
            c.className = 'lv80-cell value';
            c.textContent = fmt0(data.HP);
            grid.appendChild(c);
          });

          // ATK ??
          const atkLabel = document.createElement('div');
          atkLabel.className = 'lv80-cell label';
          atkLabel.textContent = L_ATK;
          grid.appendChild(atkLabel);
          items.forEach(({ data }) => {
            const c = document.createElement('div');
            c.className = 'lv80-cell value';
            c.textContent = fmt0(data.attack);
            grid.appendChild(c);
          });

          // DEF ??
          const defLabel = document.createElement('div');
          defLabel.className = 'lv80-cell label';
          defLabel.textContent = L_DEF;
          grid.appendChild(defLabel);
          items.forEach(({ data }) => {
            const c = document.createElement('div');
            c.className = 'lv80-cell value';
            c.textContent = fmt0(data.defense);
            grid.appendChild(c);
          });
        }

        function renderNarrow() {
          grid.innerHTML = '';
          const cols = 4; // A#, HP, ATK, DEF
          grid.style.display = 'grid';
          grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
          grid.style.gap = '6px';

          // ?더 ?? ['', ?명, 공격?? 방어??
          const blank = document.createElement('div'); blank.className = 'lv80-cell label'; grid.appendChild(blank);
          const h1 = document.createElement('div'); h1.className = 'lv80-cell label'; h1.textContent = L_HP; grid.appendChild(h1);
          const h2 = document.createElement('div'); h2.className = 'lv80-cell label'; h2.textContent = L_ATK; grid.appendChild(h2);
          const h3 = document.createElement('div'); h3.className = 'lv80-cell label'; h3.textContent = L_DEF; grid.appendChild(h3);

          // ?이???들: [A#/?식#, hp, atk, def]
          items.forEach(({ idx, data }) => {
            const r0 = document.createElement('div'); r0.className = 'lv80-cell label'; r0.textContent = lv80HeaderLabel(idx, lang); grid.appendChild(r0);
            const r1 = document.createElement('div'); r1.className = 'lv80-cell value'; r1.textContent = fmt0(data.HP); grid.appendChild(r1);
            const r2 = document.createElement('div'); r2.className = 'lv80-cell value'; r2.textContent = fmt0(data.attack); grid.appendChild(r2);
            const r3 = document.createElement('div'); r3.className = 'lv80-cell value'; r3.textContent = fmt0(data.defense); grid.appendChild(r3);
          });
        }

        function applyLayout() {
          const wide = window.innerWidth >= 1200;
          if (wide) renderWide(); else renderNarrow();
        }

        // ?입 ??용
        if (settingsWrap.nextSibling) {
          cardRoot.insertBefore(wrap, settingsWrap.nextSibling);
        } else {
          cardRoot.appendChild(wrap);
        }
        applyLayout();
        window.addEventListener('resize', applyLayout);
      } catch (e) {
        console.warn('[cha_stats] renderLv80BaseStats error', e);
      }
    }

    // ??(?? cha_detail.js)?서 ?출?????는 LV100 ?탯 카드 ?더??
    window.renderLv100BaseStatsFromBasicStats = async function () {
      try {
        // ?? 카드가 ?다?중복 ?성 방?
        const existing = document.querySelector('.lv100-stats-card');
        if (existing) return;

        const statsCard = document.querySelector('.stats-card');
        const lv80Card = document.querySelector('.lv80-stats-card');
        if (!statsCard || !lv80Card) return;

        const lang = getLang();
        const urlName = getCharacterNameFromURL();
        const krKey = toKoreanKey(urlName, lang);

        const ok = await ensureBasicStatsLoaded();
        if (!ok || !window.basicStatsData) return;
        const statObj = window.basicStatsData[krKey];
        if (!statObj || !hasAnyLv100(statObj)) return;

        const wrap = document.createElement('div');
        wrap.className = 'lv100-stats-card setting-section';
        wrap.style.padding = '20px 0 30px 0';
        wrap.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';

        const title = document.createElement('h3');
        title.className = 'lv80-title';
        title.textContent = t('characterStatsLv100Title', '기초 스탯 (LV 100)');
        wrap.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'lv80-grid';
        grid.style.fontSize = '14px';
        wrap.appendChild(grid);

        const items = [];
        for (let i = 0; i <= 7; i++) {
          const key = `a${i}_lv100`;
          const v = statObj[key];
          if (v && (v.HP != null || v.attack != null || v.defense != null)) {
            items.push({ idx: i, data: v });
          }
        }
        if (items.length === 0) return;

        const labels = statsLabelSet();
        const L_HP = labels.hp;
        const L_ATK = labels.atk;
        const L_DEF = labels.def;

        function fmt1(v) {
          if (v === undefined || v === null || isNaN(v)) return '';
          const n = Math.round(Number(v) * 10) / 10;
          return n.toFixed(1);
        }
        function fmt0(v) {
          if (v === undefined || v === null || isNaN(v)) return '';
          const n = Math.round(Number(v));
          return n.toFixed(0);
        }

        function headerLabel(idx, currentLang) {
          return awarenessLabel(idx, currentLang);
        }

        function renderWide() {
          grid.innerHTML = '';
          const cols = items.length + 1;
          grid.style.display = 'grid';
          grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
          grid.style.gap = '6px';

          const headBlank = document.createElement('div');
          headBlank.className = 'lv80-cell label';
          grid.appendChild(headBlank);
          items.forEach(({ idx }) => {
            const h = document.createElement('div');
            h.className = 'lv80-cell label';
            h.textContent = headerLabel(idx, lang);
            grid.appendChild(h);
          });

          const hpLabel = document.createElement('div');
          hpLabel.className = 'lv80-cell label';
          hpLabel.textContent = L_HP;
          grid.appendChild(hpLabel);
          items.forEach(({ data }) => {
            const c = document.createElement('div');
            c.className = 'lv80-cell value';
            c.textContent = fmt0(data.HP);
            grid.appendChild(c);
          });

          const atkLabel = document.createElement('div');
          atkLabel.className = 'lv80-cell label';
          atkLabel.textContent = L_ATK;
          grid.appendChild(atkLabel);
          items.forEach(({ data }) => {
            const c = document.createElement('div');
            c.className = 'lv80-cell value';
            c.textContent = fmt0(data.attack);
            grid.appendChild(c);
          });

          const defLabel = document.createElement('div');
          defLabel.className = 'lv80-cell label';
          defLabel.textContent = L_DEF;
          grid.appendChild(defLabel);
          items.forEach(({ data }) => {
            const c = document.createElement('div');
            c.className = 'lv80-cell value';
            c.textContent = fmt0(data.defense);
            grid.appendChild(c);
          });
        }

        function renderNarrow() {
          grid.innerHTML = '';
          const cols = 4;
          grid.style.display = 'grid';
          grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
          grid.style.gap = '6px';

          const blank = document.createElement('div'); blank.className = 'lv80-cell label'; grid.appendChild(blank);
          const h1 = document.createElement('div'); h1.className = 'lv80-cell label'; h1.textContent = L_HP; grid.appendChild(h1);
          const h2 = document.createElement('div'); h2.className = 'lv80-cell label'; h2.textContent = L_ATK; grid.appendChild(h2);
          const h3 = document.createElement('div'); h3.className = 'lv80-cell label'; h3.textContent = L_DEF; grid.appendChild(h3);

          items.forEach(({ idx, data }) => {
            const r0 = document.createElement('div'); r0.className = 'lv80-cell label'; r0.textContent = headerLabel(idx, lang); grid.appendChild(r0);
            const r1 = document.createElement('div'); r1.className = 'lv80-cell value'; r1.textContent = fmt0(data.HP); grid.appendChild(r1);
            const r2 = document.createElement('div'); r2.className = 'lv80-cell value'; r2.textContent = fmt0(data.attack); grid.appendChild(r2);
            const r3 = document.createElement('div'); r3.className = 'lv80-cell value'; r3.textContent = fmt0(data.defense); grid.appendChild(r3);
          });
        }

        function applyLayout() {
          const wide = window.innerWidth >= 1200;
          if (wide) renderWide(); else renderNarrow();
        }

        if (lv80Card.nextSibling) {
          statsCard.insertBefore(wrap, lv80Card.nextSibling);
        } else {
          statsCard.appendChild(wrap);
        }
        applyLayout();
        window.addEventListener('resize', applyLayout);
      } catch (e) {
        console.warn('[cha_stats] renderLv100BaseStatsFromBasicStats error', e);
      }
    };

    async function init() {
      // DOM 준?
      if (!document.querySelector('.stats-card')) return;

      const lang = getLang();
      const urlName = getCharacterNameFromURL();
      const krKey = toKoreanKey(urlName, lang);

      // ?탯 카드 ?목 로컬?이?
      localizeStatsCardTexts();
      registerI18nLanguageHook();
      waitAndRelocalizeStatsCard();

      // ?이??로드
      const ok = await ensureBasicStatsLoaded();
      if (!ok || !window.basicStatsData) return;
  
      const statObj = window.basicStatsData[krKey];
      if (!statObj) return;
  
      // 좌측: 초기 ?탯 (a0_lv1)
      const lv1 = statObj.a0_lv1 || {};
      // HP, ATK(attack), DEF(defense), Speed(speed) ?수??버림 처리
      setValueRow('.stats-main .stats-grid', 1, Math.floor(lv1.HP) ?? '');
      setValueRow('.stats-main .stats-grid', 2, Math.floor(lv1.attack) ?? '');
      setValueRow('.stats-main .stats-grid', 3, Math.floor(lv1.defense) ?? '');
      // Speed???수(그???자)
      setValueRow('.stats-main .stats-grid', 4, lv1.speed ?? '');
      // ?개???에 % 붙이?
      //setValueRow('.stats-main .stats-grid', 5, lv1.crit_rate+'%' ?? '');
      //setValueRow('.stats-main .stats-grid', 6, lv1.crit_mult+'%' ?? '');
  
      // ?벨 80 기초 ?탯 (a0_lv80 ~ a7_lv80)
      renderLv80BaseStats(statObj, lang);

      // ?측: ?재??
      const a7 = statObj.awake7 || {};
      const entries = Object.entries(a7);
      // ??? 지??
      setText('.stats-awake .awake-title', localizeAwakeTitle());
  
      if (entries.length > 0) {
        const [k, v] = entries[0];
        const label = translateAwakeLabel(k);
        const awakeLabel = document.querySelector('.stats-awake .label');
        if (awakeLabel && awakeLabel.dataset) awakeLabel.dataset.awakeKey = k;
        const value = (v === undefined || v === null) ? '' : (isPercentKey(k) ? `${Math.floor(v*10)/10}%` : `${Math.floor(v*10)/10}`);
        setText('.stats-awake .label', label);
        setText('.stats-awake .value', value);
      } else {
        const awakeLabel = document.querySelector('.stats-awake .label');
        if (awakeLabel && awakeLabel.dataset && awakeLabel.dataset.awakeKey) delete awakeLabel.dataset.awakeKey;
        setText('.stats-awake .label', '');
        setText('.stats-awake .value', '');
      }

      // Re-apply localized labels after LV80/LV100 cards are rendered.
      localizeStatsCardTexts();
    }
  
    // ?행
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => safe(init));
    } else {
      safe(init);
    }
  })();
