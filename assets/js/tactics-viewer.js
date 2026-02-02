// 언어별 캐릭터 데이터 동적 로딩 함수들
function getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) {
        return urlLang;
    }
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['kr', 'en', 'jp'].includes(savedLang)) {
        return savedLang;
    }
    if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
        return LanguageRouter.getCurrentLanguage();
    }
    return 'kr';
}

async function fetchCharactersData(url) {
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        const sandbox = {};
        const win = (new Function('window', `${text}\n; return window;`))(sandbox);
        const list = win.characterList || { mainParty: [], supportParty: [] };
        const data = win.characterData || {};
        return { characterList: list, characterData: data };
    } catch (e) {
        return null;
    }
}

function mergeCharacterData(krData, langData) {
    const mergedData = {};
    const currentLang = getCurrentLanguage();

    // KR 데이터의 모든 키를 먼저 복사하고, 언어별 name 설정
    Object.keys(krData || {}).forEach(key => {
        mergedData[key] = { ...krData[key] };
        const krChar = krData[key];
        // 언어별 name 필드 설정 (kr 데이터의 name_en/name_jp 사용)
        if (currentLang === 'en' && krChar.name_en) {
            mergedData[key].name = krChar.name_en;
        } else if (currentLang === 'jp' && krChar.name_jp) {
            mergedData[key].name = krChar.name_jp;
        }
        // kr일 때는 원본 name 유지 (이미 복사됨)
    });

    // langData의 키로 추가 필드 업데이트 (role, tag, release_order 등)
    Object.keys(langData || {}).forEach(key => {
        const langChar = langData[key];
        if (!mergedData[key]) return; // krData에 없는 캐릭터는 무시
        if (langChar?.role) mergedData[key].role = langChar.role;
        if (langChar?.tag) mergedData[key].tag = langChar.tag;
        if (typeof langChar?.release_order !== 'undefined' && langChar.release_order !== 0) {
            mergedData[key].release_order = langChar.release_order;
        }
    });

    return mergedData;
}

function isSpoilerEnabled() {
    return localStorage.getItem('spoilerToggle') === 'true';
}

async function ensureCharacterDataLoaded() {
    const lang = getCurrentLanguage();
    let forceKR = false;
    try { forceKR = localStorage.getItem('forceKRList') === 'true'; } catch (_) { }
    const spoilerEnabled = isSpoilerEnabled();

    // 1) KR 데이터 로드
    const kr = await fetchCharactersData(`/data/kr/characters/characters.js?v=${APP_VERSION}`);
    if (!kr) return false;

    const krCharacterData = kr.characterData || {};
    const krCharacterList = kr.characterList || { mainParty: [], supportParty: [] };

    if (lang === 'kr') {
        window.characterData = krCharacterData;
        window.characterList = krCharacterList;
        return true;
    }

    // 2) 언어 데이터 로드
    const lg = await fetchCharactersData(`/data/${lang}/characters/characters.js?v=${APP_VERSION}`);

    let langCharacterList = { mainParty: [], supportParty: [] };
    let langCharacterData = {};

    if (lg) {
        langCharacterList = lg.characterList || { mainParty: [], supportParty: [] };
        langCharacterData = lg.characterData || {};
    }

    // 스포일러 모드 지원을 위해 원본 언어 리스트 저장 (전역)
    window.originalLangCharacterList = [...(langCharacterList.mainParty || []), ...(langCharacterList.supportParty || [])];

    const merged = mergeCharacterData(krCharacterData, langCharacterData);
    window.characterData = merged;

    if (spoilerEnabled) {
        // 스포일러 ON: 리스트는 KR(전체) 사용
        window.characterList = krCharacterList;
    } else {
        // 스포일러 OFF: 리스트는 해당 언어의 출시 목록만 사용
        window.characterList = forceKR ? krCharacterList : langCharacterList;
    }

    return true;
}

class TacticsViewer {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 5;
        this.currentView = 'all';
        this.searchKeyword = '';
        this.currentRankingPeriod = 'weekly';
        this.allTactics = [];
        this.filteredTactics = [];
        this.tacticPreview = new TacticPreview();
        this.currentRegion = 'ALL';
        this.currentType = 'ALL';
        this.userIP = '';
        this.currentLang = getCurrentLanguage();
        this.currentUser = null;
        this.selectedCharacters = [];

        this.init();
    }

    async init() {
        // 캐릭터 데이터를 먼저 로드 (언어별 병합 포함)
        await ensureCharacterDataLoaded();
        await this.getUserIP();
        await this.checkAuth();
        this.initRegionFilters();
        this.initTypeFilters();
        this.initCharacterFilter();
        this.initMobileCollapsibles();
        this.initLanguageTexts();
        this.initSpoilerToggle();
        await this.loadTactics();
        this.initTabs();
        this.initSearch();
        this.initRanking();
        this.renderTactics();
        this.loadRanking();
    }

    // 모바일에서 Ranking/캐릭터 필터 접기/펼치기
    initMobileCollapsibles() {
        const apply = () => {
            const isMobile = window.innerWidth <= 640;
            const ranking = document.querySelector('.ranking-container');
            const rankingHeader = ranking?.querySelector('.ranking-header');
            const charCard = document.querySelector('.character-filter-card');
            const charHeader = charCard?.querySelector('.card-header');

            const ensureCaret = (headerEl) => {
                if (!headerEl) return null;
                let caret = headerEl.querySelector('.collapse-caret');
                if (!caret) {
                    caret = document.createElement('span');
                    caret.className = 'collapse-caret';
                    caret.textContent = '▼';
                    headerEl.appendChild(caret);
                }
                return caret;
            };

            if (isMobile) {
                if (ranking && rankingHeader) {
                    ranking.classList.add('collapsible', 'collapsed');
                    const caret = ensureCaret(rankingHeader);
                    rankingHeader.style.cursor = 'pointer';
                    rankingHeader.onclick = () => {
                        ranking.classList.toggle('collapsed');
                        caret.textContent = ranking.classList.contains('collapsed') ? '▶' : '▼';
                    };
                    // 초기 화살표 상태
                    if (caret) caret.textContent = '▶';
                }
                if (charCard && charHeader) {
                    charCard.classList.add('collapsible', 'collapsed');
                    const caret2 = ensureCaret(charHeader);
                    charHeader.style.cursor = 'pointer';
                    charHeader.onclick = () => {
                        charCard.classList.toggle('collapsed');
                        caret2.textContent = charCard.classList.contains('collapsed') ? '▶' : '▼';
                    };
                    if (caret2) caret2.textContent = '▶';
                }
            } else {
                // 데스크탑: 항상 펼침, 이벤트 제거
                if (ranking && rankingHeader) {
                    ranking.classList.remove('collapsed');
                    rankingHeader.style.cursor = '';
                    const caret = rankingHeader.querySelector('.collapse-caret');
                    if (caret) caret.remove();
                    rankingHeader.onclick = null;
                }
                if (charCard && charHeader) {
                    charCard.classList.remove('collapsed');
                    charHeader.style.cursor = '';
                    const caret2 = charHeader.querySelector('.collapse-caret');
                    if (caret2) caret2.remove();
                    charHeader.onclick = null;
                }
            }
        };

        // 적용 및 리사이즈 감지
        apply();
        window.addEventListener('resize', () => {
            // 성능 보호: 리사이즈마다 재적용
            apply();
        });
    }

    async loadTactics() {
        try {
            let query = supabase
                .from('tactics')
                .select('*')
                .order('created_at', { ascending: false });

            if (this.currentRegion && this.currentRegion !== 'ALL') {
                if (this.currentRegion === 'GLB') {
                    query = query.in('region', ['en', 'sea']);
                } else if (this.currentRegion === 'JP') {
                    query = query.eq('region', 'jp');
                } else if (this.currentRegion === 'KR') {
                    query = query.eq('region', 'kr');
                }
            }
            if (this.currentType && this.currentType !== 'ALL') {
                query = query.eq('tactic_type', this.currentType);
            }

            const { data, error } = await query;
            if (error) {
                console.error('데이터 로드 오류:', error);
                return;
            }

            const tacticIds = data.map(t => String(t.id));
            const likesMap = await this.loadLikesMap(tacticIds);

            this.allTactics = data.map(tactic => ({
                id: tactic.id,
                title: tactic.title,
                author: tactic.author,
                comment: tactic.comment,
                likes: likesMap[String(tactic.id)]?.likes || 0,
                recentLikes: 0,
                createdAt: new Date(tactic.created_at),
                query: typeof tactic.query === 'string' ? (tactic.query.startsWith('{') ? JSON.parse(tactic.query) : null) : tactic.query,
                url: tactic.url,
                isLiked: this.isLikedByMe(likesMap[String(tactic.id)]),
                region: tactic.region || null,
                tactic_type: tactic.tactic_type || null,
                user_id: tactic.user_id || null
            }));

            this.applyFilters();
        } catch (error) {
            console.error('택틱 로드 실패:', error);
        }
    }

    async loadLikesMap(tacticIds) {
        const result = {};
        if (!tacticIds || tacticIds.length === 0) return result;
        const { data, error } = await supabase
            .from('tactic_likes')
            .select('id,tactic_id,likes,recent_like')
            .in('tactic_id', tacticIds);
        if (error) {
            console.error('likes 로드 실패:', error);
            return result;
        }
        data.forEach(row => {
            result[row.tactic_id] = {
                id: row.id,
                likes: row.likes || 0,
                recent_like: row.recent_like || null
            };
        });
        return result;
    }

    isLikedByMe(likeRow) {
        if (!likeRow || !likeRow.recent_like || !this.userIP) return false;
        try {
            const map = likeRow.recent_like;
            const ts = map[this.userIP];
            if (!ts) return false;
            const last = new Date(ts).getTime();
            return (Date.now() - last) < 24 * 60 * 60 * 1000;
        } catch (e) {
            return false;
        }
    }

    applyFilters() {
        let filtered = [...this.allTactics];

        // 검색 필터
        if (this.searchKeyword) {
            filtered = filtered.filter(tactic =>
                tactic.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
            );
        }

        // 스포일러 체크: 스포일러가 꺼져있고 미출시 캐릭터가 포함된 택틱 숨김
        if (this.currentLang !== 'kr' && !isSpoilerEnabled()) {
            const originalList = window.originalLangCharacterList || [];

            filtered = filtered.filter(tactic => {
                // 파티 멤버 확인
                if (tactic.query && Array.isArray(tactic.query.party)) {
                    // 미출시 캐릭터가 하나라도 있으면 제외
                    const hasUnreleased = tactic.query.party.some(member => {
                        // 원더 제외
                        if (member.name === '원더') return false;
                        // originalList에 없는 캐릭터면 미출시로 간주
                        return !originalList.includes(member.name);
                    });
                    if (hasUnreleased) return false;
                }
                return true;
            });
        }

        // 캐릭터 필터 (AND 조건, 최대 4개 선택)
        if (this.selectedCharacters && this.selectedCharacters.length > 0) {
            filtered = filtered.filter(tactic => {
                try {
                    const party = Array.isArray(tactic.query?.party) ? tactic.query.party : [];
                    return this.selectedCharacters.every(name => party.some(p => p.name === name));
                } catch (e) { return false; }
            });
        }

        // 베스트 필터 (좋아요 5개 이상)
        if (this.currentView === 'best') {
            filtered = filtered.filter(tactic => tactic.likes >= 5);
        }

        this.filteredTactics = filtered;
        this.currentPage = 1;
    }

    renderTactics() {
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const tacticsToShow = this.filteredTactics.slice(startIndex, endIndex);

        const postsList = document.getElementById('postsList');
        postsList.innerHTML = '';

        tacticsToShow.forEach(tactic => {
            const postElement = this.createPostElement(tactic);
            postsList.appendChild(postElement);
        });

        this.updatePaginationButtons();
    }

    createPostElement(tactic) {
        const libraryLink = tactic.url ? `/tactic/?library=${encodeURIComponent(tactic.url)}` : null;
        const postDiv = document.createElement('div');
        postDiv.className = 'post-item';
        postDiv.setAttribute('data-post-id', tactic.id);

        const canEdit = !!(this.currentUser && tactic.user_id && this.currentUser.id === tactic.user_id);
        const editSvg = canEdit ? `
        <svg class="edit-icon" data-edit-id="${tactic.id}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin:0 6px;cursor:pointer;vertical-align:middle;">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
        </svg>` : '';

        postDiv.innerHTML = `
        <div class="post-header">
            <h3>
                ${libraryLink ? `
                    <a href="${libraryLink}" target="_blank" rel="noopener noreferrer" class="post-title">
                        ${this.renderRegionBadge(tactic.region)} ${this.renderTypeBadge(tactic.tactic_type)} 
                        <span class="post-title-text">${this.escapeHtml(tactic.title)}</span>
                        ${editSvg}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="rgba(255, 255, 255, 0.6)"></path>
                        </svg>
                    </a>
                ` : `
                    <span class="post-title">${this.renderTypeBadge(tactic.tactic_type)}<span class="post-title-text">${this.escapeHtml(tactic.title)}</span>${editSvg}</span>
                `}
            </h3>
            <div class="post-meta">
                <span class="post-author">${this.escapeHtml(tactic.author)}</span>
                <span class="separator">|</span>
                <span class="post-date">${this.formatDate(tactic.createdAt)}</span>
            </div>
            ${tactic.comment ? `<div class="post-comment">${this.escapeHtml(tactic.comment)}</div>` : ''}
        </div>
        
        <div class="post-content">
            ${libraryLink ? `
                <div class="post-link">
                    <a href="${libraryLink}" target="_blank" rel="noopener noreferrer">택틱 보기</a>
                </div>
            ` : ''}
            <div class="tactic-preview-container"></div>
        </div>

        <div class="post-footer">
            <div class="likes-section">
                <button onclick="tacticsViewer.handleLike('${tactic.id}')" class="like-button ${tactic.isLiked ? 'liked' : ''}" ${tactic.isLiked ? 'disabled' : ''}>
                    <img src="${BASE_URL}/assets/img/tactic-share/like.png" alt="좋아요">
                </button>
                <div class="likes-count-wrapper">
                    <span class="likes-count">${tactic.likes}</span>
                </div>
            </div>
        </div>
    `;

        // 택틱 프리뷰 생성
        this.addTacticPreview(postDiv, tactic.query);

        // 편집 아이콘 클릭 처리
        if (canEdit) {
            const icon = postDiv.querySelector('.edit-icon');
            if (icon) {
                icon.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.goToEdit(tactic);
                });
            }
        }

        return postDiv;
    }

    async checkAuth() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && session.user) {
                this.currentUser = session.user;
                this.showUserInfoBar();
            }
        } catch (e) { /* ignore */ }
    }

    showUserInfoBar() {
        const bar = document.getElementById('userInfoBar');
        const nameEl = document.getElementById('userDisplayName');
        const logoutBtn = document.getElementById('logoutButton');
        if (!bar || !this.currentUser) return;
        const displayName = this.currentUser.user_metadata?.display_name || this.currentUser.user_metadata?.full_name || this.currentUser.email || '';
        if (nameEl) nameEl.textContent = displayName;
        bar.style.display = 'flex';
        if (logoutBtn) {
            logoutBtn.onclick = async () => {
                try { await supabase.auth.signOut(); window.location.reload(); } catch (_) { }
            };
        }
    }

    goToEdit(tactic) {
        // 업로드 페이지로 이동: library 로더가 채우고, 업로드 페이지에서 edit 모드로 동작하도록 파라미터 전달
        const params = new URLSearchParams();
        if (tactic.url) params.set('library', tactic.url);
        params.set('edit', '1');
        params.set('id', tactic.id);
        window.location.href = `/tactic/tactic-upload.html?${params.toString()}`;
    }

    renderTypeBadge(type) {
        if (!type || type === 'ALL') return '';
        const map = {
            kr: { '흉몽': '흉몽', '바다': '바다', '이벤트': '이벤트', '기타': '기타' },
            en: { '흉몽': 'NTMR', '바다': 'SoS', '이벤트': 'Event', '기타': 'ETC' },
            jp: { '흉몽': '閼兇夢', '바다': '心の海', '이벤트': 'イベント', '기타': 'その他' }
        };
        const label = (map[this.currentLang] || map.kr)[type] || type;
        return `<span class="type-badge">${label}</span>`;
    }

    renderRegionBadge(region) {
        // 지역 필터가 ALL이 아닐 때는 지역 배지를 렌더하지 않음 (필터 컨텍스트에서 중복 정보 제거)
        if (!region) return '';
        if (this.currentRegion && this.currentRegion !== 'ALL') return '';
        const r = String(region).toLowerCase();
        let label = '';
        if (r === 'kr') label = 'KR';
        else if (r === 'jp') label = 'JP';
        else if (r === 'en' || r === 'sea') label = 'GLB';
        else label = r.toUpperCase();
        return `<span class="region-badge">${label}</span>`;
    }

    initSpoilerToggle() {
        // 스포일러 토글 위치 변경됨 (Character Filter Header)
        const spoilerToggle = document.getElementById('spoilerToggle');
        const spoilerToggleText = document.getElementById('spoilerToggleText');
        if (!spoilerToggle || !spoilerToggleText) return;

        // 저장된 상태 복원
        const savedState = localStorage.getItem('spoilerToggle') === 'true';
        spoilerToggle.checked = savedState;

        // 이벤트 리스너
        spoilerToggle.addEventListener('change', function () {
            const isEnabled = this.checked;
            localStorage.setItem('spoilerToggle', isEnabled.toString());
            window.location.reload();
        });

        // 컨테이너 표시 여부 (KR 제외)
        const container = document.querySelector('.spoiler-toggle-container');
        if (container) {
            if (this.currentLang === 'kr') {
                container.style.display = 'none';
            } else {
                container.style.display = 'flex';
            }
        }
    }

    addTacticPreview(postElement, tacticData) {
        try {
            const previewContainer = postElement.querySelector('.tactic-preview-container');
            const preview = this.createTacticPreview(tacticData);
            if (preview) {
                previewContainer.appendChild(preview);
            }
        } catch (error) {
            console.error('택틱 프리뷰 생성 실패:', error);
        }
    }

    createTacticPreview(tacticData) {
        if (!tacticData || !tacticData.party) return null;

        // window.characterData 사용 (언어별 병합된 데이터)
        const charData = window.characterData || (typeof characterData !== 'undefined' ? characterData : {});
        if (!charData || Object.keys(charData).length === 0) {
            // 데이터가 아직 로드되지 않았으면 빈 div 반환
            return null;
        }

        const previewDiv = document.createElement('div');
        previewDiv.className = 'tactic-preview';

        // 파티 이미지 컨테이너
        const partyImagesContainer = document.createElement('div');
        partyImagesContainer.className = 'party-images-container';

        const partyImagesDiv = document.createElement('div');
        partyImagesDiv.className = 'party-images';

        // 파티원 정렬 및 이미지 생성 (v3 포맷은 null 멤버 포함 가능)
        const orderedParty = tacticData.party
            .filter(pm => pm && pm.name && pm.name !== "")
            .sort((a, b) => {
                if (a.order === "-") return 1;
                if (b.order === "-") return -1;
                return parseInt(a.order, 10) - parseInt(b.order, 10);
            });

        orderedParty.forEach(member => {
            // 원더인 경우 건너뛰기
            if (member.name === "원더" || member.name === "Wonder") return;

            const container = document.createElement('div');
            if (charData[member.name]) {
                container.className = 'character-container';

                const charImg = document.createElement('img');
                charImg.className = 'character-img';
                charImg.src = `${BASE_URL}/assets/img/character-half/${member.name}.webp`;

                // 언어별 번역된 이름 사용 (window.characterData는 이미 병합되어 name 필드에 올바른 언어가 들어있음)
                const ch = charData[member.name];
                // 병합된 데이터의 name 필드 사용 (이미 언어별로 설정됨)
                const displayName = ch?.name || member.name;

                charImg.alt = displayName;
                charImg.title = displayName;
                container.appendChild(charImg);
            }

            // 의식 이미지
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

    async handleLike(tacticId) {
        try {
            const { data: likeRow, error: likeErr } = await supabase
                .from('tactic_likes')
                .select('id,likes,recent_like')
                .eq('tactic_id', String(tacticId))
                .maybeSingle();
            if (likeErr) {
                console.error('like row 조회 실패:', likeErr);
            }
            let likes = likeRow?.likes || 0;
            const recent = (likeRow?.recent_like && typeof likeRow.recent_like === 'object') ? likeRow.recent_like : {};
            const last = recent[this.userIP] ? new Date(recent[this.userIP]).getTime() : 0;
            if (last && (Date.now() - last) < 24 * 60 * 60 * 1000) {
                alert(this.currentLang === 'en' ? 'You already liked this within 24 hours.' : this.currentLang === 'jp' ? '24時間以内に既にいいねしました。' : '24시간 내 이미 좋아요 했습니다.');
                return;
            }
            likes += 1;
            recent[this.userIP] = new Date().toISOString();

            if (likeRow && likeRow.id) {
                const { error: upErr } = await supabase
                    .from('tactic_likes')
                    .update({ likes, recent_like: recent })
                    .eq('id', likeRow.id);
                if (upErr) throw upErr;
            } else {
                const { error: insErr } = await supabase
                    .from('tactic_likes')
                    .insert([{ tactic_id: String(tacticId), likes, recent_like: recent }]);
                if (insErr) throw insErr;
            }

            // UI 업데이트
            const likeButton = document.querySelector(`[data-post-id="${tacticId}"] .like-button`);
            const likesCount = document.querySelector(`[data-post-id="${tacticId}"] .likes-count`);
            if (likeButton) likeButton.classList.add('liked');
            if (likeButton) likeButton.disabled = true;
            if (likesCount) likesCount.textContent = likes;

            const tactic = this.allTactics.find(t => String(t.id) === String(tacticId));
            if (tactic) {
                tactic.likes = likes;
                tactic.isLiked = true;
            }
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    }

    updatePaginationButtons() {
        const totalPages = Math.ceil(this.filteredTactics.length / this.postsPerPage);
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const currentPageSpan = document.getElementById('currentPage');

        prevButton.disabled = this.currentPage === 1;
        nextButton.disabled = this.currentPage === totalPages || totalPages === 0;
        currentPageSpan.textContent = this.currentPage;

        prevButton.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTactics();
            }
        };

        nextButton.onclick = () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTactics();
            }
        };
    }

    initRegionFilters() {
        const container = document.getElementById('regionButtons');
        if (!container) return;
        container.addEventListener('click', (e) => {
            const item = e.target.closest('.tab-button');
            if (!item) return;
            container.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            item.classList.add('active');
            this.currentRegion = item.dataset.region;
            // 렌더 시점에서 region-badge는 renderRegionBadge에서 조건부 렌더링함
            this.loadTactics().then(() => { this.applyFilters(); this.renderTactics(); this.loadRanking(); });
        });
    }

    initTypeFilters() {
        const labels = this.getTypeLabels();
        const container = document.getElementById('typeButtons');
        // 라벨 현지화 (텍스트형 아이템)
        container.querySelectorAll('.filter-item').forEach(el => {
            const type = el.dataset.type;
            el.textContent = (type === 'ALL') ? labels.ALL : (labels[type] || el.textContent);
        });
        container.addEventListener('click', (e) => {
            const item = e.target.closest('.filter-item');
            if (!item) return;
            container.querySelectorAll('.filter-item').forEach(b => b.classList.remove('active'));
            item.classList.add('active');
            this.currentType = item.dataset.type;
            this.loadTactics().then(() => { this.applyFilters(); this.renderTactics(); });
        });
    }

    getTypeLabels() {
        if (this.currentLang === 'en') {
            return { ALL: 'All', '흉몽': 'NTMR', '바다': 'SoS', '이벤트': 'Event', '기타': 'ETC' };
        } else if (this.currentLang === 'jp') {
            return { ALL: '全体', '흉몽': '閼兇夢', '바다': '心の海', '이벤트': 'イベント', '기타': 'その他' };
        }
        return { ALL: '전체', '흉몽': '흉몽', '바다': '바다', '이벤트': '이벤트', '기타': '기타' };
    }

    // 캐릭터 필터 초기화
    initCharacterFilter() {
        this.selectedCharacters = Array.isArray(this.selectedCharacters) ? this.selectedCharacters : [];
        const grid = document.getElementById('characterFilterGrid');
        if (!grid) return;

        // window.characterData와 window.characterList 사용 (언어별 병합된 데이터)
        const charData = window.characterData || (typeof characterData !== 'undefined' ? characterData : {});
        const charList = window.characterList || (typeof characterList !== 'undefined' ? characterList : { mainParty: [], supportParty: [] });

        // release_order 기준 내림차순 정렬, '원더' 제외
        const allNames = [...(charList?.mainParty || []), ...(charList?.supportParty || [])];
        const sortedNames = allNames
            .filter(n => n !== '원더')
            .sort((a, b) => {
                const ra = (charData?.[a]?.release_order ?? -Infinity);
                const rb = (charData?.[b]?.release_order ?? -Infinity);
                return rb - ra; // 내림차순
            });
        // 중복 제거 (메인/서포트에 중복 존재 시 한 번만 표시)
        const uniqueNames = [];
        const seen = new Set();
        sortedNames.forEach(n => { if (!seen.has(n)) { seen.add(n); uniqueNames.push(n); } });
        const fragment = document.createDocumentFragment();
        uniqueNames.forEach(name => {
            const img = document.createElement('img');
            img.src = `${BASE_URL}/assets/img/tier/${name}.webp`;
            // 언어에 따른 타이틀/대체 텍스트 (병합된 데이터의 name 필드 사용)
            const ch = charData?.[name];
            // 병합된 데이터의 name 필드 사용 (이미 언어별로 설정됨)
            const displayTitle = ch?.name || name;

            img.alt = displayTitle;
            img.title = displayTitle;
            img.className = 'char-face';
            img.dataset.name = name;

            // 래퍼 생성 (배지 렌더링을 위한 컨테이너)
            const wrap = document.createElement('div');
            wrap.className = 'char-face-wrap';
            wrap.appendChild(img);

            img.addEventListener('click', () => {
                const selected = this.selectedCharacters;
                const idx = selected.indexOf(name);
                if (idx >= 0) {
                    // 해제
                    selected.splice(idx, 1);
                } else {
                    // 추가 (최대 4개, 초과 시 가장 오래된 선택 자동 제거)
                    if (selected.length === 4) {
                        const oldest = selected.shift();
                        grid.querySelectorAll(`img[data-name="${CSS.escape(oldest)}"]`).forEach(el => {
                            el.classList.remove('selected');
                            el.removeAttribute('data-order');
                            const pw = el.parentElement; if (pw && pw.classList.contains('char-face-wrap')) { pw.classList.remove('selected'); pw.removeAttribute('data-order'); }
                        });
                    }
                    selected.push(name);
                }

                // 선택 표시 및 순번 배지 갱신
                grid.querySelectorAll('img.char-face').forEach(el => {
                    if (!selected.includes(el.dataset.name)) {
                        el.classList.remove('selected');
                        el.removeAttribute('data-order');
                        const pw = el.parentElement; if (pw && pw.classList.contains('char-face-wrap')) { pw.classList.remove('selected'); pw.removeAttribute('data-order'); }
                    }
                });
                selected.forEach((n, i) => {
                    grid.querySelectorAll(`img[data-name="${CSS.escape(n)}"]`).forEach(el => {
                        el.classList.add('selected');
                        el.setAttribute('data-order', String(i + 1));
                        const pw = el.parentElement; if (pw && pw.classList.contains('char-face-wrap')) { pw.classList.add('selected'); pw.setAttribute('data-order', String(i + 1)); }
                    });
                });

                this.applyFilters();
                this.renderTactics();
                // URL 상태 동기화 (CSV)
                try {
                    const params = new URLSearchParams(window.location.search);
                    if (selected.length) params.set('char', selected.join(',')); else params.delete('char');
                    const newUrl = `${window.location.pathname}?${params.toString()}`;
                    window.history.replaceState({}, '', newUrl);
                } catch (_) { }
            });
            fragment.appendChild(wrap);
        });
        grid.innerHTML = '';
        grid.appendChild(fragment);

        // URL 파라미터에 의해 선택된 캐릭터들 하이라이트 적용 (CSV, 최대 4개)
        try {
            const urlChar = new URLSearchParams(window.location.search).get('char');
            if (urlChar) {
                const names = urlChar.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);
                this.selectedCharacters = names.filter(n => uniqueNames.includes(n));
                this.selectedCharacters.forEach((n, i) => {
                    grid.querySelectorAll(`img[data-name="${CSS.escape(n)}"]`).forEach(el => {
                        el.classList.add('selected');
                        el.setAttribute('data-order', String(i + 1));
                        const pw = el.parentElement; if (pw && pw.classList.contains('char-face-wrap')) { pw.classList.add('selected'); pw.setAttribute('data-order', String(i + 1)); }
                    });
                });
                this.applyFilters();
                this.renderTactics();
            }
        } catch (_) { }
    }

    // 언어별 UI 텍스트 초기화
    initLanguageTexts() {
        const t = {
            kr: {
                search: '제목 검색...',
                ranking: '순위',
                weekly: '주간',
                monthly: '월간',
                alltime: '역대',
                title: '택틱 도서관',
                nav_home: '홈',
                nav_current: '택틱 / 택틱 도서관',
                prev: '이전',
                next: '다음',
                upload: '택틱 업로드',
                filter_char: '캐릭터 필터',
                signed_in_as: '로그인:',
                logout: '로그아웃',
                spoiler: '스포일러 보기',
                type: { '흉몽': '흉몽', '바다': '바다', '이벤트': '이벤트', '기타': '기타' }
            },
            en: {
                search: 'Search title...',
                ranking: 'Ranking',
                weekly: 'Weekly',
                monthly: 'Monthly',
                alltime: 'Alltime',
                title: 'Tactics Library',
                nav_home: 'Home',
                nav_current: 'Tactics / Library',
                prev: 'Prev',
                next: 'Next',
                upload: 'Upload Tactic',
                filter_char: 'Character Filter',
                signed_in_as: 'Signed in as:',
                logout: 'Logout',
                spoiler: 'Show Spoilers',
                type: { '흉몽': 'NTMR', '바다': 'SoS', '이벤트': 'Event', '기타': 'ETC' }
            },
            jp: {
                search: 'タイトル検索...',
                ranking: '順位',
                weekly: '週間',
                monthly: '月間',
                alltime: '通算',
                title: 'タクティクスライブラリー',
                nav_home: 'ホーム',
                nav_current: 'タクティクス / ライブラリー',
                prev: '前',
                next: '次',
                upload: 'タクティクスをアップロード',
                filter_char: '怪盗フィルター',
                signed_in_as: 'ログイン：',
                logout: 'ログアウト',
                spoiler: 'ネタバレ表示',
                type: { '흉몽': '閼兇夢', '바다': '心の海', '이벤트': 'イベント', '기타': 'その他' }
            }
        }[this.currentLang] || {
            search: '제목 검색...', ranking: '순위', weekly: '주간', monthly: '월간', alltime: '역대', title: '택틱 도서관', nav_home: '홈', nav_current: '택틱 / 택틱 도서관', prev: '이전', next: '다음', upload: '택틱 업로드', filter_char: '캐릭터 필터', spoiler: '스포일러 보기', type: { '흉몽': '흉몽', '바다': '바다', '이벤트': '이벤트', '기타': '기타' }
        };

        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.placeholder = t.search;

        const rankingTitle = document.querySelector('.ranking-title-text');
        if (rankingTitle) rankingTitle.textContent = t.ranking;

        const tabs = document.querySelectorAll('.ranking-tab');
        tabs.forEach(tab => {
            const period = tab.getAttribute('data-period');
            if (period === 'weekly') tab.textContent = t.weekly;
            if (period === 'monthly') tab.textContent = t.monthly;
            if (period === 'all') tab.textContent = t.alltime;
        });

        // 헤더/네비/페이지네이션 텍스트
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.textContent = t.title;
        const navHome = document.getElementById('nav-home');
        const navCurrent = document.getElementById('nav-current');
        if (navHome) navHome.textContent = t.nav_home;
        if (navCurrent) navCurrent.textContent = t.nav_current;
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        if (prevBtn) prevBtn.textContent = t.prev;
        if (nextBtn) nextBtn.textContent = t.next;

        const uploadBtn = document.getElementById('uploadButton');
        if (uploadBtn) uploadBtn.textContent = t.upload;
        const charFilterTitle = document.getElementById('charFilterTitle');
        if (charFilterTitle) charFilterTitle.textContent = t.filter_char;

        // 로그인 정보 바 언어 적용
        const userLabel = document.querySelector('#userInfoBar .user-label');
        const logoutBtn = document.getElementById('logoutButton');
        if (userLabel) userLabel.textContent = t.signed_in_as;
        if (logoutBtn) logoutBtn.textContent = t.logout;

        const spoilerLabel = document.getElementById('spoilerToggleText');
        if (spoilerLabel) spoilerLabel.textContent = t.spoiler;

        // 타입 필터 라벨 현지화
        const typeItems = document.querySelectorAll('#typeButtons .filter-item');
        typeItems.forEach(el => {
            const key = el.dataset.type;
            if (t.type[key]) el.textContent = t.type[key];
        });

        // 영어(JP)에서 랭킹 탭 폰트 사이즈 조정
        const rankingTabs = document.querySelectorAll('.ranking-tab');
        rankingTabs.forEach(btn => {
            if (this.currentLang === 'en') {
                btn.style.fontSize = '11px';
            } else {
                btn.style.fontSize = '';
            }
        });

        // SEO 업데이트
        this.updateSEO(t);
    }

    updateSEO(t) {
        const seoMap = {
            kr: {
                title: '택틱 도서관 - 페르소나5 더 팬텀 X 루페르넷',
                description: '페르소나5 더 팬텀 X 택틱들을 확인하세요.'
            },
            en: {
                title: 'Tactics Library - Persona 5: The Phantom X LufelNet',
                description: 'Browse community tactics for Persona 5: The Phantom X.'
            },
            jp: {
                title: 'タクティクスライブラリー - ペルソナ5 ザ・ファントム X LufelNet',
                description: 'ペルソナ5 ザ・ファントム X の戦術を閲覧できます。'
            }
        };
        const lang = this.currentLang in seoMap ? this.currentLang : 'kr';
        const meta = seoMap[lang];
        document.title = meta.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (metaDesc) metaDesc.setAttribute('content', meta.description);
        if (ogTitle) ogTitle.setAttribute('content', meta.title);
        if (ogDesc) ogDesc.setAttribute('content', meta.description);
    }

    async getUserIP() {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const json = await res.json();
            this.userIP = json.ip;
        } catch (e) {
            this.userIP = '';
        }
    }
    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentView = button.dataset.view;
                this.applyFilters();
                this.renderTactics();
            });
        });
    }

    initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        const performSearch = () => {
            this.searchKeyword = searchInput.value.trim();
            this.applyFilters();
            this.renderTactics();
        };

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    initRanking() {
        const rankingTabs = document.querySelectorAll('.ranking-tab');
        rankingTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                rankingTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentRankingPeriod = tab.dataset.period;
                this.loadRanking();
            });
        });
    }

    async loadRanking() {
        try {
            const now = new Date();
            let startDate;

            switch (this.currentRankingPeriod) {
                case 'weekly':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'monthly':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'all':
                    startDate = new Date(0);
                    break;
            }

            // 현재 지역 필터에 따라 집계 대상 선택
            let regionSet = null;
            if (this.currentRegion === 'KR') regionSet = new Set(['kr']);
            if (this.currentRegion === 'GLB') regionSet = new Set(['en', 'sea']);
            if (this.currentRegion === 'JP') regionSet = new Set(['jp']);

            const filteredTactics = this.allTactics.filter(tactic => {
                const inTime = tactic.createdAt >= startDate;
                const inRegion = !regionSet || regionSet.has((tactic.region || '').toLowerCase());
                return inTime && inRegion;
            });

            const authorStats = new Map();
            filteredTactics.forEach(tactic => {
                const stats = authorStats.get(tactic.author) || { posts: 0, likes: 0 };
                stats.posts++;
                stats.likes += tactic.likes;
                authorStats.set(tactic.author, stats);
            });

            let rankings = Array.from(authorStats.entries())
                .map(([author, stats]) => ({
                    author,
                    score: (stats.posts * 5) + stats.likes,
                    posts: stats.posts,
                    likes: stats.likes
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);

            // 비어 있으면 placeholder 채우기
            while (rankings.length < 3) {
                rankings.push({ author: '-', score: 0, posts: 0, likes: 0 });
            }

            this.renderRanking(rankings);
        } catch (error) {
            console.error('랭킹 로드 실패:', error);
        }
    }

    renderRanking(rankings) {
        const container = document.querySelector('.ranking-list');
        const i18n = this.getI18n();
        container.innerHTML = rankings.map((rank, index) => {
            const statsText = i18n.rankingStats(rank.posts, rank.likes);
            return `
        <div class="ranking-item" data-rank="${index + 1}">
            <div class="ranking-position">
                <img src="${BASE_URL}/assets/img/tactic-share/rank${index + 1}.png" alt="${index + 1}" class="rank-icon">
            </div>
            <div class="ranking-info">
                <div class="ranking-author">${this.escapeHtml(rank.author)}</div>
                <div class="ranking-stats">${statsText}</div>
            </div>
        </div>`;
        }).join('');
    }

    formatDate(date) {
        const i18n = this.getI18n();
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours === 0) {
                const minutes = Math.floor(diff / (1000 * 60));
                return i18n.relative.minutes(minutes);
            }
            return i18n.relative.hours(hours);
        } else if (days < 7) {
            return i18n.relative.days(days);
        } else {
            return date.toLocaleDateString(i18n.dateLocale);
        }
    }

    getI18n() {
        const lang = this.currentLang || 'kr';
        if (lang === 'en') {
            return {
                rankingStats: (posts, likes) => `${posts} Tactics · ${likes} Likes`,
                relative: {
                    minutes: (m) => `${m} min ago`,
                    hours: (h) => `${h} hours ago`,
                    days: (d) => `${d} days ago`
                },
                dateLocale: 'en-US'
            };
        } else if (lang === 'jp') {
            return {
                rankingStats: (posts, likes) => `タクティクス ${posts}件 ・ いいね ${likes}件`,
                relative: {
                    minutes: (m) => `${m}分前`,
                    hours: (h) => `${h}時間前`,
                    days: (d) => `${d}日前`
                },
                dateLocale: 'ja-JP'
            };
        }
        // default kr
        return {
            rankingStats: (posts, likes) => `택틱 ${posts}개 · 좋아요 ${likes}개`,
            relative: {
                minutes: (m) => `${m}분 전`,
                hours: (h) => `${h}시간 전`,
                days: (d) => `${d}일 전`
            },
            dateLocale: 'ko-KR'
        };
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    Navigation.load('tactics');
    window.tacticsViewer = new TacticsViewer();
});
