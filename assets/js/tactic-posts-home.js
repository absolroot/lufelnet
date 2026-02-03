// =====================
// Supabase 기반 홈 택틱 로더
// =====================
window.loadHomeTacticsFromSupabase = async function(currentLang) {
  try {
    const postsListEl = document.getElementById('postsList');
    if (!postsListEl || typeof supabase === 'undefined') return;

    let query = supabase.from('tactics').select('*').order('created_at', { ascending: false }).limit(3);
    if (currentLang === 'kr') query = query.eq('region', 'kr');
    else if (currentLang === 'jp') query = query.eq('region', 'jp');
    else if (currentLang === 'en') query = query.in('region', ['en', 'sea']);

    let { data, error } = await query;
    if (!error && data && data.length === 0 && (currentLang === 'en' || currentLang === 'jp')) {
      const res2 = await supabase.from('tactics').select('*').in('region', ['en','sea']).order('created_at', { ascending: false }).limit(3);
      data = res2.data || [];
    }
    if (error) { console.error('Supabase load error:', error); return; }

    // IP/언어/좋아요 맵 준비
    try {
      window.__HOME_LANG__ = currentLang || 'kr';
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipJson = await ipRes.json();
      window.__HOME_IP = ipJson.ip || '';
    } catch(_) { window.__HOME_IP = ''; }
    window.__HOME_LIKES_MAP = {};
    try {
      const ids = (data || []).map(t => String(t.id));
      if (ids.length > 0) {
        const { data: likeRows } = await supabase
          .from('tactic_likes')
          .select('id,tactic_id,likes,recent_like')
          .in('tactic_id', ids);
        (likeRows || []).forEach(row => {
          window.__HOME_LIKES_MAP[String(row.tactic_id)] = {
            id: row.id,
            likes: row.likes || 0,
            recent_like: row.recent_like || null
          };
        });
      }
    } catch(_) {}

    postsListEl.innerHTML = '';
    data.forEach(t => {
      const libraryLink = t.url ? `${BASE_URL}/tactic-maker/?library=${encodeURIComponent(t.url)}` : null;
      const item = document.createElement('div');
      item.className = 'post-item';
      item.setAttribute('data-post-id', String(t.id));
      const likeRow = window.__HOME_LIKES_MAP[String(t.id)] || null;
      const likeCount = likeRow?.likes || 0;
      const likedByMe = (function(){ try { if (!likeRow || !likeRow.recent_like || !window.__HOME_IP) return false; const ts = likeRow.recent_like[window.__HOME_IP]; if (!ts) return false; const last = new Date(ts).getTime(); return (Date.now() - last) < 24*60*60*1000; } catch(_) { return false; } })();
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
            <button onclick="homeHandleLike('${String(t.id)}')" class="like-button ${likedByMe ? 'liked' : ''}" ${likedByMe ? 'disabled' : ''}>
              <img src="${BASE_URL}/assets/img/tactic-share/like.png" alt="좋아요">
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
        const q = typeof t.query === 'string' ? (t.query.startsWith('{') ? JSON.parse(t.query) : null) : t.query;
        const previewEl = createHomePreviewFromQuery(q);
        const container = item.querySelector('.tactic-preview-container');
        if (container && previewEl) container.appendChild(previewEl);
      } catch(_) {}
    });
  } catch (e) { console.error('홈 택틱 로드 실패:', e); }
}

function formatHomeDate(date) {
  try {
    // Detect current language for home list
    let lang = (window.__HOME_LANG__ || '').toLowerCase();
    if (!lang) {
      try {
        const urlLang = new URLSearchParams(window.location.search).get('lang');
        if (urlLang) lang = urlLang;
      } catch(_) {}
      if (!lang && typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
        try { lang = LanguageRouter.getCurrentLanguage(); } catch(_) {}
      }
      if (!lang) {
        try { lang = localStorage.getItem('preferredLanguage') || 'kr'; } catch(_) { lang = 'kr'; }
      }
    }
    if (!['kr','en','jp'].includes(lang)) lang = 'kr';

    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000*60*60*24));
    if (days === 0) {
      const hours = Math.floor(diff / (1000*60*60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000*60));
        if (lang === 'en') return `${minutes} min ago`;
        if (lang === 'jp') return `${minutes}分前`;
        return `${minutes}분 전`;
      }
      if (lang === 'en') return `${hours} hours ago`;
      if (lang === 'jp') return `${hours}時間前`;
      return `${hours}시간 전`;
    } else if (days < 7) {
      if (lang === 'en') return `${days} days ago`;
      if (lang === 'jp') return `${days}日前`;
      return `${days}일 전`;
    }
    const locale = (lang === 'en') ? 'en-US' : (lang === 'jp') ? 'ja-JP' : 'ko-KR';
    return date.toLocaleDateString(locale);
  } catch(_) { return ''; }
}

// 홈 목록용 파티 프리뷰 (tactics.html의 미리보기와 동일 로직)
function createHomePreviewFromQuery(tacticData) {
  if (!tacticData || !Array.isArray(tacticData.party)) return null;
  const previewDiv = document.createElement('div');
  previewDiv.className = 'tactic-preview';

  const partyImagesContainer = document.createElement('div');
  partyImagesContainer.className = 'party-images-container';

  const partyImagesDiv = document.createElement('div');
  partyImagesDiv.className = 'party-images';

  const orderedParty = tacticData.party
    .filter(pm => pm.name !== '')
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
      container.appendChild(charImg);
    }

    const ritualLevel = parseInt(member.ritual);
    if (ritualLevel >= 1 && ritualLevel <= 6) {
      const ritualImg = document.createElement('img');
      ritualImg.className = 'ritual-img';
      ritualImg.src = `${BASE_URL}/assets/img/ritual/num${ritualLevel}.png`;
      ritualImg.alt = `의식 ${ritualLevel}`;
      container.appendChild(ritualImg);
    }

    partyImagesDiv.appendChild(container);
  });

  partyImagesContainer.appendChild(partyImagesDiv);
  previewDiv.appendChild(partyImagesContainer);
  return previewDiv;
}

// 홈 좋아요 처리 (tactics.html과 동일 정책)
window.homeHandleLike = async function(tacticId) {
  try {
    const ip = window.__HOME_IP || '';
    const { data: likeRow } = await supabase
      .from('tactic_likes')
      .select('id,likes,recent_like')
      .eq('tactic_id', String(tacticId))
      .maybeSingle();
    let likes = likeRow?.likes || 0;
    const recent = (likeRow?.recent_like && typeof likeRow.recent_like === 'object') ? likeRow.recent_like : {};
    const last = recent[ip] ? new Date(recent[ip]).getTime() : 0;
    if (last && (Date.now() - last) < 24*60*60*1000) {
      const lang = window.__HOME_LANG__ || 'kr';
      const msg = lang === 'en' ? 'You already liked this within 24 hours.' : lang === 'jp' ? '24時間以内に既にいいねしました。' : '24시간 내 이미 좋아요 했습니다.';
      alert(msg);
      return;
    }
    likes += 1;
    recent[ip] = new Date().toISOString();

    if (likeRow && likeRow.id) {
      await supabase.from('tactic_likes').update({ likes, recent_like: recent }).eq('id', likeRow.id);
    } else {
      await supabase.from('tactic_likes').insert([{ tactic_id: String(tacticId), likes, recent_like: recent }]);
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