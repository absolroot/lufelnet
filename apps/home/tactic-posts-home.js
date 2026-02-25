// =====================
// Supabase 기반 홈 택틱 로더
// =====================
const HOME_TACTIC_RAW_LANGS = ['kr', 'en', 'jp', 'cn', 'tw', 'sea'];

function detectHomeTacticRawLang() {
  if (window.HomeI18n && typeof window.HomeI18n.detectRawLang === 'function') {
    const rawLang = window.HomeI18n.detectRawLang();
    if (HOME_TACTIC_RAW_LANGS.includes(rawLang)) return rawLang;
  }

  let lang = (window.__HOME_LANG__ || '').toLowerCase();
  if (lang && HOME_TACTIC_RAW_LANGS.includes(lang)) return lang;

  try {
    const urlLang = (new URLSearchParams(window.location.search).get('lang') || '').toLowerCase();
    if (urlLang && HOME_TACTIC_RAW_LANGS.includes(urlLang)) return urlLang;
  } catch (_) { }
  if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
    try {
      const routerLang = String(LanguageRouter.getCurrentLanguage() || '').toLowerCase();
      if (HOME_TACTIC_RAW_LANGS.includes(routerLang)) return routerLang;
    } catch (_) { }
  }
  try {
    const savedLang = String(localStorage.getItem('preferredLanguage') || '').toLowerCase();
    if (savedLang && HOME_TACTIC_RAW_LANGS.includes(savedLang)) return savedLang;
  } catch (_) { }
  return 'kr';
}

function homeTacticT(key, fallback, rawLang) {
  if (window.HomeI18n && typeof window.HomeI18n.t === 'function') {
    return window.HomeI18n.t(key, fallback, rawLang);
  }
  return fallback;
}

function formatTemplate(template, value) {
  return String(template || '').replace(/\{value\}/g, String(value));
}

async function waitHomeTacticI18nReady() {
  if (!window.__HOME_I18N_READY__) return;
  try {
    await window.__HOME_I18N_READY__;
  } catch (_) { }
}

async function ensureHomePublicIp() {
  if (window.__HOME_IP) return window.__HOME_IP;
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipJson = await ipRes.json();
    window.__HOME_IP = ipJson?.ip || '';
  } catch (_) {
    window.__HOME_IP = '';
  }
  return window.__HOME_IP;
}

window.loadHomeTacticsFromSupabase = async function (currentLang) {
  try {
    await waitHomeTacticI18nReady();
    const postsListEl = document.getElementById('postsList');
    if (!postsListEl || typeof supabase === 'undefined') return;
    const rawLang = HOME_TACTIC_RAW_LANGS.includes(String(currentLang || '').toLowerCase())
      ? String(currentLang).toLowerCase()
      : detectHomeTacticRawLang();
    window.__HOME_LANG__ = rawLang || 'kr';

    const tacticSelectColumns = 'id,title,author,comment,created_at,url,region,tactic_version,party:query->party';
    let query = supabase.from('tactics').select(tacticSelectColumns).order('created_at', { ascending: false }).limit(3);
    if (rawLang === 'kr') query = query.eq('region', 'kr');
    else if (rawLang === 'jp') query = query.eq('region', 'jp');
    else if (rawLang === 'en') query = query.in('region', ['en', 'sea']);

    let { data, error } = await query;
    if (!error && data && data.length === 0 && (rawLang === 'en' || rawLang === 'jp')) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('tactics')
        .select(tacticSelectColumns)
        .in('region', ['en', 'sea'])
        .order('created_at', { ascending: false })
        .limit(3);
      if (fallbackError) { console.error('Supabase fallback load error:', fallbackError); return; }
      data = fallbackData || [];
    }
    if (error) { console.error('Supabase load error:', error); return; }
    await ensureHomePublicIp();
    window.__HOME_LIKES_MAP = {};
    try {
      const ids = (data || []).map(t => String(t.id));
      if (ids.length > 0) {
        const { data: likeRows } = await supabase
          .from('tactic_likes')
          .select('tactic_id,likes')
          .in('tactic_id', ids);
        (likeRows || []).forEach(row => {
          window.__HOME_LIKES_MAP[String(row.tactic_id)] = {
            likes: row.likes || 0
          };
        });
      }
    } catch (_) { }

    postsListEl.innerHTML = '';
    data.forEach(t => {
      const libraryLink = t.url ? `${BASE_URL}/tactic-maker/?library=${encodeURIComponent(t.url)}` : null;
      const item = document.createElement('div');
      item.className = 'post-item';
      item.setAttribute('data-post-id', String(t.id));
      const likeRow = window.__HOME_LIKES_MAP[String(t.id)] || null;
      const likeCount = likeRow?.likes || 0;
      item.innerHTML = `
        <div class="post-header">
          <h3>
            ${libraryLink ? `<a href="${libraryLink}" target="_blank" rel="noopener noreferrer" class="post-title">${escapeHtml(t.title || '')}<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="rgba(255, 255, 255, 0.6)"></path></svg></a>` : `<span class="post-title">${escapeHtml(t.title || '')}</span>`}
          </h3>
          <div class="post-meta">
            <span class="post-author">${escapeHtml(t.author || '')}</span>
            <span class="separator">|</span>
            <span class="post-date">${formatHomeDate(new Date(t.created_at))}</span>
          </div>
          ${t.comment ? `<div class="post-comment">${escapeHtml(t.comment)}</div>` : ''}
        </div>
        <div class="tactic-preview-container" style="margin-left: auto; margin-right: 20px;"></div>
        <div class="post-footer">
          <div class="likes-section">
            <button onclick="homeHandleLike('${String(t.id)}')" class="like-button">
              <img src="${BASE_URL}/assets/img/tactic-share/like.png" alt="${homeTacticT('tactic_like_alt', '좋아요', rawLang)}">
            </button>
            <div class="likes-count-wrapper">
              <span class="likes-count">${likeCount}</span>
            </div>
          </div>
        </div>
      `;
      postsListEl.appendChild(item);
      // 파티 프리뷰 렌더링
      try {
        const party = Array.isArray(t.party)
          ? t.party
          : (() => {
              const parsed = typeof t.query === 'string'
                ? (t.query.startsWith('{') ? JSON.parse(t.query) : null)
                : t.query;
              return Array.isArray(parsed?.party) ? parsed.party : [];
            })();
        const previewEl = createHomePreviewFromParty(party);
        const container = item.querySelector('.tactic-preview-container');
        if (container && previewEl) container.appendChild(previewEl);
      } catch (_) { }
    });
  } catch (e) { console.error('홈 택틱 로드 실패:', e); }
}

function formatHomeDate(date) {
  try {
    const rawLang = detectHomeTacticRawLang();

    if (window.HomeI18n && typeof window.HomeI18n.formatRelativeDate === 'function') {
      return window.HomeI18n.formatRelativeDate(date, { rawLang, includeWeeks: true });
    }

    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        if (rawLang === 'en') return `${minutes} min ago`;
        if (rawLang === 'jp') return `${minutes}分前`;
        return `${minutes}분 전`;
      }
      if (rawLang === 'en') return `${hours} hours ago`;
      if (rawLang === 'jp') return `${hours}時間前`;
      return `${hours}시간 전`;
    } else if (days < 7) {
      if (rawLang === 'en') return `${days} days ago`;
      if (rawLang === 'jp') return `${days}日前`;
      return `${days}일 전`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      if (rawLang === 'en') return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      if (rawLang === 'jp') return `${weeks}週間前`;
      return `${weeks}주 전`;
    }
    const locale = (rawLang === 'en') ? 'en-US' : (rawLang === 'jp') ? 'ja-JP' : 'ko-KR';
    return date.toLocaleDateString(locale);
  } catch (_) { return ''; }
}

// 홈 목록용 파티 프리뷰 (tactics.html의 미리보기와 동일 로직)
function createHomePreviewFromParty(party) {
  if (!Array.isArray(party)) return null;
  const previewDiv = document.createElement('div');
  previewDiv.className = 'tactic-preview';

  const partyImagesContainer = document.createElement('div');
  partyImagesContainer.className = 'party-images-container';

  const partyImagesDiv = document.createElement('div');
  partyImagesDiv.className = 'party-images';

  const orderedParty = party
    .filter(pm => pm && pm.name && pm.name !== '')
    .sort((a, b) => {
      if (a.order === '-') return 1;
      if (b.order === '-') return -1;
      return parseInt(a.order, 10) - parseInt(b.order, 10);
    });

  orderedParty.forEach(member => {
    if (member.name === '원더') return;

    const container = document.createElement('div');
    if (typeof characterData !== 'undefined' && characterData[member.name]) {
      container.className = 'character-container';

      const charImg = document.createElement('img');
      charImg.className = 'character-img';
      charImg.src = `${BASE_URL}/assets/img/character-half/${member.name}.webp`;
      charImg.alt = member.name;
      charImg.title = member.name;
      charImg.loading = 'lazy';
      charImg.decoding = 'async';
      charImg.setAttribute('fetchpriority', 'low');
      container.appendChild(charImg);
    }

    const ritualLevel = parseInt(member.ritual);
    if (ritualLevel >= 1 && ritualLevel <= 6) {
      const ritualImg = document.createElement('img');
      ritualImg.className = 'ritual-img';
      ritualImg.src = `${BASE_URL}/assets/img/ritual/num${ritualLevel}.png`;
      const rawLang = detectHomeTacticRawLang();
      ritualImg.alt = formatTemplate(homeTacticT('tactic_ritual_alt', '의식 {value}', rawLang), ritualLevel);
      ritualImg.loading = 'lazy';
      ritualImg.decoding = 'async';
      ritualImg.setAttribute('fetchpriority', 'low');
      container.appendChild(ritualImg);
    }

    partyImagesDiv.appendChild(container);
  });

  partyImagesContainer.appendChild(partyImagesDiv);
  previewDiv.appendChild(partyImagesContainer);
  return previewDiv;
}

// 홈 좋아요 처리 (tactics.html과 동일 정책)
window.homeHandleLike = async function (tacticId) {
  try {
    const ip = await ensureHomePublicIp();
    const rawLang = detectHomeTacticRawLang();
    if (!ip) {
      const msg = homeTacticT('tactic_like_ip_required', 'Unable to verify IP address. Please try again in a moment.', rawLang);
      alert(msg);
      return;
    }

    const { data: likeRow, error: likeError } = await supabase
      .from('tactic_likes')
      .select('id,likes,recent_like')
      .eq('tactic_id', String(tacticId))
      .maybeSingle();
    if (likeError) throw likeError;
    let likes = likeRow?.likes || 0;
    const recent = (likeRow?.recent_like && typeof likeRow.recent_like === 'object') ? likeRow.recent_like : {};
    const last = recent[ip] ? new Date(recent[ip]).getTime() : 0;
    if (last && (Date.now() - last) < 24 * 60 * 60 * 1000) {
      const msg = homeTacticT('tactic_like_already_24h', '24시간 내 이미 좋아요 했습니다.', rawLang);
      alert(msg);
      return;
    }
    likes += 1;
    recent[ip] = new Date().toISOString();

    if (likeRow && likeRow.id) {
      const { error: updateError } = await supabase.from('tactic_likes').update({ likes, recent_like: recent }).eq('id', likeRow.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase.from('tactic_likes').insert([{ tactic_id: String(tacticId), likes, recent_like: recent }]);
      if (insertError) throw insertError;
    }

    const wrapper = document.querySelector(`[data-post-id="${tacticId}"]`);
    if (wrapper) {
      const likeButton = wrapper.querySelector('.like-button');
      const likesCount = wrapper.querySelector('.likes-count');
      if (likeButton) { likeButton.classList.add('liked'); likeButton.disabled = true; }
      if (likesCount) { likesCount.textContent = String(likes); }
    }
  } catch (error) {
    console.error('홈 좋아요 처리 실패:', error);
  }
}
