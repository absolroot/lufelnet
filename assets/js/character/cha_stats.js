// character/cha_stats.js
(function () {
    // 안전 실행 유틸
    function safe(fn) { try { fn(); } catch (e) { console.warn('[cha_stats]', e); } }
  
    // 현재 언어 가져오기 (페이지에 정의되어 있으면 사용)
    function getLang() {
      try { return typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'kr'; }
      catch(_) { return 'kr'; }
    }
  
    // URL파라미터 name
    function getCharacterNameFromURL() {
      const p = new URLSearchParams(window.location.search);
      return p.get('name');
    }
  
    // basicStatsData 로더 (fetch → 전역 바인딩으로 변환 주입)
    function ensureBasicStatsLoaded() {
      return new Promise((resolve) => {
        if (window.basicStatsData) return resolve(true);

        const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : Date.now();
        const url = `${window.BASE_URL || ''}/data/kr/characters/character_base_stats.js?v=${ver}`;

        fetch(url)
          .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.text();
          })
          .then(text => {
            // const basicStatsData → window.basicStatsData 로 치환하여 전역에 노출
            const patched = text.replace(/const\s+basicStatsData\s*=\s*/, 'window.basicStatsData = ');
            // eslint-disable-next-line no-eval
            eval(patched);
            if (window.basicStatsData) resolve(true); else resolve(false);
          })
          .catch(err => {
            console.error('[cha_stats] Failed to load character_base_stats.js', err);
            resolve(false);
          });
      });
    }
  
    // 이름 → 한국어 키 매핑
    function toKoreanKey(name, lang) {
      if (!name) return null;
      if (window.characterData && window.characterData[name]) return name; // 이미 KR키
  
      // 역매핑 (EN/JP 표시 이름이 들어온 경우)
      if (window.characterData) {
        for (const k in window.characterData) {
          const cd = window.characterData[k] || {};
          if (lang === 'en' && cd.name_en === name) return k;
          if (lang === 'jp' && cd.name_jp === name) return k;
          // 혹시 전체 한글 이름 필드와 같은 경우
          if (cd.name === name) return k;
        }
      }
      return name; // 마지막 시도
    }
  
    // awake7 내부키 -> 라벨(kr/en/jp)
    function translateAwakeLabel(internalKey, lang) {
      const map = {
        attack_per: { kr: '공격력 %', en: 'ATK %', jp: '攻撃力 %' },
        defense_per:{ kr: '방어력 %', en: 'DEF %', jp: '防御力 %' },
        HP_per:     { kr: '생명 %',  en: 'HP %',  jp: 'HP %'  },
        crit_rate:  { kr: '크리티컬 확률', en: 'CRIT Rate', jp: 'CRT発生率' },
        crit_mult:  { kr: '크리티컬 효과', en: 'CRIT DMG',  jp: 'CRT倍率' },
        speed:      { kr: '속도', en: 'Speed', jp: '速さ' },
        ailment_accuracy: { kr: '효과 명중', en: 'Ailment Accur.', jp: '状態異常命中' },
        sp_recover: { kr: 'SP 회복', en: 'SP Recovery', jp: 'SP回復' },
        HP_recover: { kr: '치료 효과', en: 'Healing Effect', jp: 'HP回復量' },
        pierce_rate:{ kr: '관통', en: 'Pierce Rate', jp: '貫通' },
      };
      const entry = map[internalKey];
      if (!entry) return (lang === 'en' ? 'Hidden Stat' : lang === 'jp' ? '潜在能力' : '잠재력');
      return entry[lang] || entry.kr;
    }
  
    // 퍼센트 키 여부 (awake7 값 포맷용)
    function isPercentKey(key) {
      return key.endsWith('_per') ||
             key === 'crit_rate' ||
             key === 'crit_mult' ||
             key === 'ailment_accuracy' ||
             key === 'sp_recover' ||
             key === 'HP_recover' ||
             key === 'pierce_rate'
    }
  
    // DOM 헬퍼
    function qs(sel) { return document.querySelector(sel); }
    function setText(sel, v) { const el = qs(sel); if (el) el.textContent = (v ?? '') + ''; }
    function setValueRow(baseSelector, idx, v) {
      const row = document.querySelector(`${baseSelector} .stat-row:nth-child(${idx}) .value`);
      if (row) row.textContent = (v ?? '') + '';
    }
  
    function localizeAwakeTitle(lang) {
      return lang === 'en' ? 'Hidden Ability LV7'
           : lang === 'jp' ? '潜在能力 LV7'
           : '잠재력 LV7';
    }

    // 스탯 카드 제목 로컬라이즈 (h2, h3)
    function localizeStatsHeadings(lang) {
      const H2 = { kr: '스탯', en: 'Stats', jp: 'ステータス' };
      const H3_LEFT = { kr: '기초 스탯', en: 'Base Stats', jp: '基礎ステータス' };
      const H3_RIGHT = { kr: '잠재력 LV 7', en: 'Hidden Ability LV7', jp: '潜在能力 LV7' };

      setText('.stats-card h2', H2[lang] || H2.kr);
      const leftH3Sel = '.stats-card .stats-settings .setting-section:nth-child(1) > h3';
      const rightH3Sel = '.stats-card .stats-settings .setting-section:nth-child(2) > h3';
      const leftH3 = document.querySelector(leftH3Sel);
      const rightH3 = document.querySelector(rightH3Sel);
      if (leftH3) {
        leftH3.innerHTML = `${H3_LEFT[lang] || H3_LEFT.kr}
          <span class="help-icon" onclick="showHelpModal('base-stats')">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>
              <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>
            </svg>
          </span>`;
      }
      if (rightH3) {
        rightH3.innerHTML = `${H3_RIGHT[lang] || H3_RIGHT.kr}
          <span class="help-icon" onclick="showHelpModal('awake7')">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>
              <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>
            </svg>
          </span>`;
      }
    }

    async function init() {
      // DOM 준비
      if (!document.querySelector('.stats-card')) return;

      const lang = getLang();
      const urlName = getCharacterNameFromURL();
      const krKey = toKoreanKey(urlName, lang);

      // 스탯 카드 제목 로컬라이즈
      localizeStatsHeadings(lang);

      // 데이터 로드
      const ok = await ensureBasicStatsLoaded();
      if (!ok || !window.basicStatsData) return;
  
      const statObj = window.basicStatsData[krKey];
      if (!statObj) return;
  
      // 좌측: 초기 스탯 (a0_lv1)
      const lv1 = statObj.a0_lv1 || {};
      // HP, ATK(attack), DEF(defense), Speed(speed) 소수점 버림 처리
      setValueRow('.stats-main .stats-grid', 1, Math.floor(lv1.HP) ?? '');
      setValueRow('.stats-main .stats-grid', 2, Math.floor(lv1.attack) ?? '');
      setValueRow('.stats-main .stats-grid', 3, Math.floor(lv1.defense) ?? '');
      // Speed는 상수(그대로 숫자)
      setValueRow('.stats-main .stats-grid', 4, lv1.speed ?? '');
      // 두개는 뒤에 % 붙이기
      setValueRow('.stats-main .stats-grid', 5, lv1.crit_rate+'%' ?? '');
      setValueRow('.stats-main .stats-grid', 6, lv1.crit_mult+'%' ?? '');
  
      // 우측: 잠재력
      const a7 = statObj.awake7 || {};
      const entries = Object.entries(a7);
      // 타이틀 지역화
      setText('.stats-awake .awake-title', localizeAwakeTitle(lang));
  
      if (entries.length > 0) {
        const [k, v] = entries[0];
        const label = translateAwakeLabel(k, lang);
        const value = (v === undefined || v === null) ? '' : (isPercentKey(k) ? `${v}%` : `${v}`);
        setText('.stats-awake .label', label);
        setText('.stats-awake .value', value);
      } else {
        // 데이터가 없으면 빈 값 처리
        setText('.stats-awake .label', '');
        setText('.stats-awake .value', '');
      }
    }
  
    // 실행
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => safe(init));
    } else {
      safe(init);
    }
  })();