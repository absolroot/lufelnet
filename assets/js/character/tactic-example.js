document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Navigation/VersionChecker는 그대로 character.html에서 구동됨
        const urlParams = new URLSearchParams(window.location.search);
        const characterName = urlParams.get('name');

        // 이미지 로딩 완료 시에만 표시되도록 data-loaded 세팅 및 error 시 제거
        try {
            const thiefImg = document.querySelector('.thief-image');
            const personaImg = document.querySelector('.persona-image');
            if (thiefImg) {
                thiefImg.addEventListener('load', () => thiefImg.setAttribute('data-loaded', 'true'));
                thiefImg.addEventListener('error', () => thiefImg.remove());
            }
            if (personaImg) {
                personaImg.addEventListener('load', () => personaImg.setAttribute('data-loaded', 'true'));
                personaImg.addEventListener('error', () => personaImg.remove());
            }
        } catch(_) {}

        // 언어 결정
        const currentLang = (function(){
            const urlLang = urlParams.get('lang');
            if (urlLang && ['kr','en','jp'].includes(urlLang)) return urlLang;
            const saved = localStorage.getItem('preferredLanguage');
            if (saved && ['kr','en','jp'].includes(saved)) return saved;
            return 'kr';
        })();

        // en에서 캐릭터명 스켈레톤 처리
        const nameElement = document.querySelector('.character-name');
        if (nameElement) {
            if (currentLang === 'en') {
                nameElement.classList.add('skeleton');
                requestAnimationFrame(() => {
                    const character = window.characterData?.[characterName] || {};
                    nameElement.textContent = character.name_en || characterName || 'Character Name';
                    nameElement.classList.remove('skeleton');
                });
            }
        }

        // 캐릭터 출시 목록 로드 (en/jp 스포일러 판단용)
        try { if (typeof loadCharacterList === 'function') await loadCharacterList(); } catch(_) {}

        // 택틱 예시 카드 텍스트 로컬라이즈 및 링크 구성
        const titleMap = { kr: '택틱 도서관', en: 'Tactic Library', jp: 'タクティクスライブラリー' };
        const moreMap  = { kr: '+ 더보기', en: '+ More', jp: '+ もっと見る' };
        const titleEl = document.getElementById('tactic-examples-title');
        const moreEl  = document.getElementById('tactic-examples-more');
        if (titleEl) titleEl.textContent = titleMap[currentLang] || titleMap.kr;
        if (moreEl) {
            moreEl.textContent = moreMap[currentLang] || moreMap.kr;
            const params = new URLSearchParams();
            params.set('char', characterName || '');
            params.set('lang', currentLang);
            moreEl.href = `/tactic/tactics.html?${params.toString()}`;
        }

        // 예시 택틱 로드 (페이지네이션으로 최대 2000개 탐색)
        if (typeof supabase !== 'undefined' && characterName) {
            const matched = [];
            const pageSize = 100;
            let offset = 0;
            for (let page = 0; page < 20; page++) {
                const { data, error } = await supabase
                    .from('tactics')
                    .select('id,title,author,created_at,url,query,region,tactic_type')
                    .order('created_at', { ascending: false })
                    .range(offset, offset + pageSize - 1);
                if (error || !Array.isArray(data) || data.length === 0) break;
                data.forEach(t => {
                    const q = (typeof t.query === 'string' ? (t.query.startsWith('{') ? JSON.parse(t.query) : null) : t.query);
                    if (Array.isArray(q?.party) && q.party.some(p => p.name === characterName)) {
                        matched.push({ ...t, query: q });
                    }
                });
                if (data.length < pageSize) break;
                offset += pageSize;
            }

            if (matched.length > 0) {
                // 정렬: 스포일러 수(오름차순) → 언어 우선순위 → 날짜 최신순
                const normalizeRegion = (region) => {
                    const r = String(region || '').toLowerCase();
                    if (r === 'sea' || r === 'glb' || r === 'global') return 'en';
                    if (r === 'kr' || r === 'en' || r === 'jp') return r;
                    return 'en';
                };
                const languageRank = (region) => {
                    const r = normalizeRegion(region);
                    if (currentLang === 'kr') return r === 'kr' ? 0 : 1;
                    if (currentLang === 'jp') return r === 'jp' ? 0 : 1;
                    return r === 'en' ? 0 : 1;
                };
                const countSpoilers = (q) => {
                    try {
                        if (!q || !Array.isArray(q.party)) return 0;
                        if (currentLang === 'kr') return 0;
                        let cnt = 0;
                        q.party.forEach(m => {
                            const name = (m && typeof m.name === 'string') ? m.name.trim().replace(/\u200B/g,'') : '';
                            if (!name || name === '원더' || name === characterName) return;
                            if (!(typeof characterData !== 'undefined' && characterData[name])) return;
                            const released = ((typeof currentLangCharacterList !== 'undefined') && (currentLangCharacterList.mainParty || []).includes(name)) ||
                                             ((typeof currentLangCharacterList !== 'undefined') && (currentLangCharacterList.supportParty || []).includes(name));
                            if (!released) cnt += 1;
                        });
                        return cnt;
                    } catch(_) { return 0; }
                };
                matched.sort((a, b) => {
                    const sa = countSpoilers(a.query);
                    const sb = countSpoilers(b.query);
                    if (sa !== sb) return sa - sb;
                    const la = languageRank(a.region);
                    const lb = languageRank(b.region);
                    if (la !== lb) return la - lb;
                    const da = new Date(a.created_at).getTime();
                    const db = new Date(b.created_at).getTime();
                    return db - da;
                });
                const list = document.getElementById('tactic-examples-list');
                const wrap = document.getElementById('character-tactic-examples');
                if (wrap) wrap.style.display = '';
                if (list) {
                    list.innerHTML = '';

                    // 좋아요 맵/내 IP 로드
                    let likesMap = {};
                    let myIP = '';
                    try {
                        const ipRes = await fetch('https://api.ipify.org?format=json');
                        const ipJson = await ipRes.json();
                        myIP = ipJson.ip || '';
                    } catch(_) { myIP = ''; }
                    try {
                        const ids = matched.slice(0,3).map(t => String(t.id));
                        if (ids.length > 0) {
                            const { data: likeRows } = await supabase
                                .from('tactic_likes')
                                .select('id,tactic_id,likes,recent_like')
                                .in('tactic_id', ids);
                            (likeRows || []).forEach(row => {
                                likesMap[String(row.tactic_id)] = {
                                    id: row.id,
                                    likes: row.likes || 0,
                                    recent_like: row.recent_like || null
                                };
                            });
                        }
                    } catch(_) {}

                    // 좋아요 처리 함수
                    window.charHandleLike = async function(tacticId) {
                        try {
                            const { data: likeRow } = await supabase
                                .from('tactic_likes')
                                .select('id,likes,recent_like')
                                .eq('tactic_id', String(tacticId))
                                .maybeSingle();
                            let likes = likeRow?.likes || 0;
                            const recent = (likeRow?.recent_like && typeof likeRow.recent_like === 'object') ? likeRow.recent_like : {};
                            const last = recent[myIP] ? new Date(recent[myIP]).getTime() : 0;
                            if (last && (Date.now() - last) < 24*60*60*1000) {
                                const msg = currentLang === 'en' ? 'You already liked this within 24 hours.' : currentLang === 'jp' ? '24時間以内に既にいいねしました。' : '24시간 내 이미 좋아요 했습니다.';
                                alert(msg);
                                return;
                            }
                            likes += 1;
                            recent[myIP] = new Date().toISOString();
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
                            console.error('캐릭터 페이지 좋아요 처리 실패:', error);
                        }
                    };

                    // 배지 렌더링 헬퍼 (tactics와 동일한 스타일/라벨)
                    const renderTypeBadge = (type) => {
                        if (!type || type === 'ALL') return '';
                        const map = {
                            kr: { '흉몽': '흉몽', '바다': '바다', '이벤트': '이벤트', '기타': '기타' },
                            en: { '흉몽': 'NTMR', '바다': 'SoS', '이벤트': 'Event', '기타': 'ETC' },
                            jp: { '흉몽': '閼兇夢', '바다': '心の海', '이벤트': 'イベント', '기타': 'その他' }
                        };
                        const label = (map[currentLang] || map.kr)[type] || type;
                        return `<span class="type-badge">${label}</span>`;
                    };
                    const renderRegionBadge = (region) => {
                        if (!region) return '';
                        const r = String(region).toLowerCase();
                        let label = '';
                        if (r === 'kr') label = 'KR';
                        else if (r === 'jp') label = 'JP';
                        else if (r === 'en' || r === 'sea') label = 'GLB';
                        else label = r.toUpperCase();
                        return `<span class="region-badge">${label}</span>`;
                    };

                    matched.slice(0,3).forEach(t => {
                        const libraryLink = t.url ? `/tactic-maker/?library=${encodeURIComponent(t.url)}` : null;
                        const item = document.createElement('div');
                        item.className = 'post-item';
                        item.setAttribute('data-post-id', String(t.id));
                        const likeRow = likesMap[String(t.id)] || null;
                        const likeCount = likeRow?.likes || 0;
                        const likedByMe = (function(){
                            try {
                                if (!likeRow || !likeRow.recent_like || !myIP) return false;
                                const ts = likeRow.recent_like[myIP];
                                if (!ts) return false;
                                const last = new Date(ts).getTime();
                                return (Date.now() - last) < 24*60*60*1000;
                            } catch(_) { return false; }
                        })();
                        const typeBadge = renderTypeBadge(t.tactic_type);
                        const regionBadge = renderRegionBadge(t.region);
                        item.innerHTML = `
                            <div class="post-header">
                                <h3 style="margin:0;font-size:16px;">
                                    ${libraryLink ? `<a href="${libraryLink}" target="_blank" rel="noopener noreferrer" class="post-title">${regionBadge}${typeBadge}<span class="post-title-text">${(t.title || '').replace(/[<>]/g,'')}</span>
                                        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" style=\"vertical-align:middle;margin-left:4px;\"><path d=\"M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z\" fill=\"rgba(255, 255, 255, 0.6)\"></path></svg></a>`
                                        : `<span class=\"post-title\">${regionBadge}${typeBadge}<span class=\"post-title-text\">${(t.title || '').replace(/[<>]/g,'')}</span></span>`}
                                </h3>
                                <div class="post-meta" style="font-size:12px;opacity:0.8;">
                                    <span class="post-author">${(t.author || '').replace(/[<>]/g,'')}</span>
                                    <span class="separator">|</span>
                                    <span class="post-date">${new Date(t.created_at).toLocaleDateString(currentLang==='en'?'en-US':(currentLang==='jp'?'ja-JP':'ko-KR'))}</span>
                                </div>
                            </div>
                            <div class="tactic-preview-container"></div>
                            <div class="post-footer">
                                <div class="likes-section">
                                    <button onclick="charHandleLike('${String(t.id)}')" class="like-button ${likedByMe ? 'liked' : ''}" ${likedByMe ? 'disabled' : ''}>
                                        <img src="${BASE_URL}/assets/img/tactic-share/like.png" alt="좋아요">
                                    </button>
                                    <div class="likes-count-wrapper"><span class="likes-count">${likeCount}</span></div>
                                </div>
                            </div>
                        `;
                        list.appendChild(item);
                        try {
                            const preview = (function createPreview(q){
                                if (!q || !Array.isArray(q.party)) return null;
                                const previewDiv = document.createElement('div');
                                previewDiv.className = 'tactic-preview';
                                const container = document.createElement('div');
                                container.className = 'party-images-container';
                                const images = document.createElement('div');
                                images.className = 'party-images';
                                const ordered = q.party.filter(pm => pm.name !== '').sort((a,b)=>{
                                    if (a.order === '-') return 1; if (b.order === '-') return -1; return parseInt(a.order,10)-parseInt(b.order,10);
                                });
                                ordered.forEach(m => {
                                    if (m.name === '원더') return;
                                    const c = document.createElement('div');
                                    if (typeof characterData !== 'undefined' && characterData[m.name]) {
                                        c.className = 'character-container';
                                        const img = document.createElement('img');
                                        img.className = 'character-img';
                                        img.src = `${BASE_URL}/assets/img/character-half/${m.name}.webp`;
                                        img.alt = m.name; img.title = m.name;
                                        c.appendChild(img);
                                        // 스포일러 처리: 현재 언어에서 미출시인 경우 가림 (현재 페이지 캐릭터는 항상 제외)
                                        try {
                                            const urlLang2 = new URLSearchParams(window.location.search).get('lang');
                                            const savedLang2 = localStorage.getItem('preferredLanguage');
                                            const currentLangLocal = (urlLang2 && ['kr','en','jp'].includes(urlLang2)) ? urlLang2 : (savedLang2 && ['kr','en','jp'].includes(savedLang2) ? savedLang2 : 'kr');
                                            if (currentLangLocal !== 'kr' && m.name !== characterName) {
                                                const isReleased = ((typeof currentLangCharacterList !== 'undefined') && (currentLangCharacterList.mainParty || []).includes(m.name)) ||
                                                                  ((typeof currentLangCharacterList !== 'undefined') && (currentLangCharacterList.supportParty || []).includes(m.name));
                                                if (!isReleased) {
                                                    c.classList.add('spoiler');
                                                    c.addEventListener('click', function(ev){
                                                        if (this.classList.contains('spoiler')) {
                                                            ev.preventDefault();
                                                            ev.stopPropagation();
                                                            this.classList.remove('spoiler');
                                                        }
                                                    });
                                                }
                                            }
                                        } catch(_) {}
                                    }
                                    const level = parseInt(m.ritual);
                                    if (level >=1 && level <=6) {
                                        const ri = document.createElement('img');
                                        ri.className = 'ritual-img';
                                        ri.src = `${BASE_URL}/assets/img/ritual/num${level}.png`;
                                        ri.alt = `의식 ${level}`;
                                        c.appendChild(ri);
                                    }
                                    images.appendChild(c);
                                });
                                container.appendChild(images);
                                previewDiv.appendChild(container);
                                return previewDiv;
                            })(t.query);
                            const previewContainer = item.querySelector('.tactic-preview-container');
                            if (preview && previewContainer) previewContainer.appendChild(preview);
                        } catch(_) {}
                    });
                }
            }
        }
    } catch (e) {
        console.warn('tactic-example init failed:', e);
    }
});

