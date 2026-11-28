// 언어별 캐릭터 데이터 동적 로딩 함수들
function getCurrentLanguage() {
    const seoLang = String(window.__SEO_PATH_LANG__ || '').toLowerCase();
    if (['kr', 'en', 'jp', 'cn'].includes(seoLang)) {
        return seoLang;
    }
    const pathMatch = String(window.location.pathname || '').match(/^\/(kr|en|jp|cn)(\/|$)/i);
    if (pathMatch) {
        return String(pathMatch[1] || '').toLowerCase();
    }
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && ['kr', 'en', 'jp', 'cn'].includes(urlLang)) {
        return urlLang;
    }
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['kr', 'en', 'jp', 'cn'].includes(savedLang)) {
        return savedLang;
    }
    if (typeof LanguageRouter !== 'undefined' && LanguageRouter.getCurrentLanguage) {
        return LanguageRouter.getCurrentLanguage();
    }
    return 'kr';
}

function getI18nText(key, fallback = '') {
    if (typeof window.t === 'function') {
        return window.t(key, fallback);
    }
    if (window.I18nService && typeof window.I18nService.t === 'function') {
        return window.I18nService.t(key, fallback);
    }
    return fallback || key;
}

function formatI18nTemplate(template, replacements = {}) {
    let result = String(template || '');
    Object.entries(replacements).forEach(([key, value]) => {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    });
    return result;
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
    const currentLang = getCurrentLanguage();
    if (window.CharacterDataUtils && typeof window.CharacterDataUtils.mergeCharacterData === 'function') {
        return window.CharacterDataUtils.mergeCharacterData({
            krData,
            langData,
            lang: currentLang
        });
    }
    const mergedData = {};
    Object.keys(krData || {}).forEach((key) => {
        const krChar = krData[key] || {};
        const langChar = (langData || {})[key] || {};
        const mergedChar = { ...krChar };

        if (currentLang === 'en') {
            if (krChar.name_en) mergedChar.name = krChar.name_en;
            else if (langChar.name) mergedChar.name = langChar.name;
            if (krChar.persona_en) mergedChar.persona = krChar.persona_en;
            else if (langChar.persona) mergedChar.persona = langChar.persona;
        } else if (currentLang === 'jp') {
            if (krChar.name_jp) mergedChar.name = krChar.name_jp;
            else if (langChar.name) mergedChar.name = langChar.name;
            if (krChar.persona_jp) mergedChar.persona = krChar.persona_jp;
            else if (langChar.persona) mergedChar.persona = langChar.persona;
        } else if (currentLang === 'cn') {
            if (krChar.name_cn) mergedChar.name = krChar.name_cn;
            else if (langChar.name) mergedChar.name = langChar.name;
            if (krChar.persona_cn) mergedChar.persona = krChar.persona_cn;
            else if (langChar.persona) mergedChar.persona = langChar.persona;
        }

        mergedData[key] = mergedChar;
    });
    return mergedData;
}

function isSpoilerEnabled() {
    try {
        if (window.SpoilerState && typeof window.SpoilerState.get === 'function') {
            return !!window.SpoilerState.get();
        }
    } catch (_) { }
    try {
        return localStorage.getItem('spoilerToggle') === 'true';
    } catch (_) {
        return false;
    }
}

async function ensureCharacterDataLoaded() {
    const lang = getCurrentLanguage();
    let forceKR = false;
    try { forceKR = localStorage.getItem('forceKRList') === 'true'; } catch (_) { }
    const spoilerEnabled = isSpoilerEnabled();

    // 1) KR 데이터 로드
    const kr = await fetchCharactersData(`/data/character_info.js?v=${APP_VERSION}`);
    if (!kr) return false;

    const krCharacterData = kr.characterData || {};
    const krCharacterList = kr.characterList || { mainParty: [], supportParty: [] };

    if (((window.isKrLikeLanguage && window.isKrLikeLanguage(lang)) || lang === 'kr')) {
        window.characterData = krCharacterData;
        window.characterList = krCharacterList;
        return true;
    }

    // 2) 언어 데이터 로드
    const langDataPath = (lang === 'en' || lang === 'jp')
        ? '/data/character_info_glb.js'
        : `/data/${lang}/characters/characters.js`;
    const lg = await fetchCharactersData(`${langDataPath}?v=${APP_VERSION}`);

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

async function readTacticRows(query) {
    const pageSize = 500;
    const rows = [];

    for (;;) {
        const { data, error } = await query.range(rows.length, rows.length + pageSize - 1);
        if (error) throw error;
        rows.push(...data);
        if (data.length < pageSize) return rows;
    }
}

class TacticsViewer {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 8;
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
        this.isApplyingSpoiler = false;
        this.ownedTacticIds = new Set();
        this.isLoadingTactics = false;
        this.tacticLoadFailed = false;

        this.init();
    }

    async init() {
        // 캐릭터 데이터를 먼저 로드 (언어별 병합 포함)
        await ensureCharacterDataLoaded();
        this.initRegionFilters();
        this.initTypeFilters();
        this.initCharacterFilter();
        this.initMobileCharacterFilter();
        this.initLanguageTexts();
        this.initSpoilerToggle();
        this.initTabs();
        this.initSearch();
        this.initRanking();
        void this.checkAuth().then(() => {
            if (this.ownedTacticIds.size > 0) this.renderTactics();
        });
        await this.loadTactics();
        window.LufelPageEntrance?.finish();
    }

    t(key, fallback = '') {
        return getI18nText(key, fallback || key);
    }

    template(key, fallback, replacements = {}) {
        return formatI18nTemplate(this.t(key, fallback), replacements);
    }

    initMobileCharacterFilter() {
        const trigger = document.getElementById('mobileCharacterFilter');
        const dialog = document.getElementById('characterFilterDialog');
        const card = document.getElementById('characterFilterCard');
        const desktopHost = card.parentElement;
        const mobileLayout = window.matchMedia('(width < 960px)');

        trigger.addEventListener('click', () => {
            dialog.prepend(card);
            dialog.showModal();
        });

        dialog.addEventListener('close', () => {
            if (!dialog.open) desktopHost.append(card);
        });
        mobileLayout.addEventListener('change', event => {
            if (!event.matches && dialog.open) dialog.close();
        });
    }

    updateMobileCharacterFilterCount() {
        const trigger = document.getElementById('mobileCharacterFilter');
        const badge = document.getElementById('mobileCharacterFilterCount');
        const count = this.selectedCharacters.length;
        badge.hidden = count === 0;
        badge.textContent = count || '';
        trigger.classList.toggle('has-selection', count > 0);
    }

    async fetchPublicTactics() {
        if (window.location.origin === 'https://lufel.net') {
            const response = await fetch('https://api.lufel.net/v1/tactics/library', { credentials: 'omit' });
            if (!response.ok) throw new Error(`Tactic library HTTP ${response.status}`);
            const { tactics } = await response.json();
            if (!Array.isArray(tactics)) throw new Error('Invalid tactic library response');
            return tactics;
        }

        return readTacticRows(supabase
            .from('tactic_library_public')
            .select('id,title,author,comment,created_at,url,region,tactic_type,tactic_version,party,likes')
            .order('created_at', { ascending: false })
            .order('id', { ascending: false }));
    }

    async fetchPublicTactics() {
        if (window.location.origin === 'https://lufel.net') {
            const response = await fetch('https://api.lufel.net/v1/tactics/library', { credentials: 'omit' });
            if (!response.ok) throw new Error(`Tactic library HTTP ${response.status}`);
            const { tactics } = await response.json();
            if (!Array.isArray(tactics)) throw new Error('Invalid tactic library response');
            return tactics;
        }

        return readTacticRows(supabase
            .from('tactic_library_public')
            .select('id,title,author,comment,created_at,url,region,tactic_type,tactic_version,party,likes')
            .order('created_at', { ascending: false })
            .order('id', { ascending: false }));
    }

    async loadTactics() {
        if (this.isLoadingTactics) return;
        this.isLoadingTactics = true;
        const postsList = document.getElementById('postsList');
        postsList.setAttribute('aria-busy', 'true');
        const status = document.getElementById('tacticLibraryEmpty');
        if (status) status.replaceChildren();
        else if (this.tacticLoadFailed) postsList.replaceChildren();

        try {
            const tactics = await this.fetchPublicTactics();
            this.allTactics = tactics.map(tactic => ({
                id: tactic.id,
                title: tactic.title,
                author: tactic.author,
                comment: tactic.comment,
                likes: Number(tactic.likes) || 0,
                createdAt: new Date(tactic.created_at),
                party: Array.isArray(tactic.party) ? tactic.party : [],
                url: tactic.url,
                region: tactic.region || null,
                tactic_type: tactic.tactic_type || null,
                tactic_version: tactic.tactic_version || 'legacy'
            }));
            this.tacticLoadFailed = false;
            this.applyFilters();
        } catch (error) {
            this.tacticLoadFailed = true;
            console.error('택틱 로드 실패:', error);
        } finally {
            this.isLoadingTactics = false;
            postsList.removeAttribute('aria-busy');
        }

        this.renderTactics();
        await this.loadRanking();
    }

    applyFilters() {
        let filtered = [...this.allTactics];

        if (this.currentRegion && this.currentRegion !== 'ALL') {
            filtered = filtered.filter(tactic => {
                const region = String(tactic.region || '').toLowerCase();
                if (this.currentRegion === 'GLB') return region === 'en' || region === 'sea';
                if (this.currentRegion === 'CN') return region === 'cn';
                if (this.currentRegion === 'JP') return region === 'jp';
                if (this.currentRegion === 'KR') return region === 'kr';
                return true;
            });
        }

        if (this.currentType && this.currentType !== 'ALL') {
            filtered = filtered.filter(tactic => tactic.tactic_type === this.currentType);
        }

        // 검색 필터
        if (this.searchKeyword) {
            const keyword = this.searchKeyword.toLocaleLowerCase();
            filtered = filtered.filter(tactic => {
                const title = String(tactic.title || '').toLocaleLowerCase();
                const author = String(tactic.author || '').toLocaleLowerCase();
                return title.includes(keyword) || author.includes(keyword);
            });
        }

        // 스포일러 체크: 스포일러가 꺼져있고 미출시 캐릭터가 포함된 택틱 숨김
        if (!((window.isKrLikeLanguage && window.isKrLikeLanguage(this.currentLang)) || this.currentLang === 'kr') && !isSpoilerEnabled()) {
            const originalList = window.originalLangCharacterList || [];

            filtered = filtered.filter(tactic => {
                // 파티 멤버 확인
                if (Array.isArray(tactic.party)) {
                    // 미출시 캐릭터가 하나라도 있으면 제외
                    const hasUnreleased = tactic.party.some(member => {
                        // v3 format can have null party slots
                        if (!member || !member.name) return false;
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
                    const party = Array.isArray(tactic.party) ? tactic.party : [];
                    return this.selectedCharacters.every(name => party.some(p => p && p.name === name));
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
        if (this.isLoadingTactics) return;
        const postsList = document.getElementById('postsList');
        const status = document.getElementById('tacticLibraryEmpty');
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const tacticsToShow = this.filteredTactics.slice(startIndex, endIndex);

        status?.replaceChildren();
        postsList.replaceChildren(...tacticsToShow.map(tactic => this.createPostElement(tactic)));
        if (this.tacticLoadFailed || tacticsToShow.length === 0) {
            const message = status || document.createElement('p');
            if (!status) {
                message.className = 'no-results';
                message.setAttribute('role', 'status');
                postsList.appendChild(message);
            }
            this.renderTacticListStatus(message);
        }

        window.LufelPageEntrance?.stagger(postsList);
        this.updatePaginationButtons();
    }

    renderTacticListStatus(message) {
        if (this.tacticLoadFailed) {
            const retry = document.createElement('button');
            retry.type = 'button';
            retry.textContent = this.t('tactic_load_retry', '다시 시도');
            retry.addEventListener('click', () => this.loadTactics(), { once: true });
            message.append(this.t('tactic_load_failed', '택틱을 불러오지 못했습니다.'), ' ', retry);
        } else {
            message.textContent = this.t('no_tactics_found', '표시할 택틱이 없습니다.');
        }
    }

    createPostElement(tactic) {
        // Version-aware link: v3 goes to /tactic-maker/, legacy goes to /tactic/
        const tacticPath = tactic.tactic_version === 'v3' ? '/tactic-maker/' : '/tactic/';
        const libraryLink = tactic.url ? `${tacticPath}?library=${encodeURIComponent(tactic.url)}` : null;
        const postDiv = document.createElement('div');
        postDiv.className = libraryLink ? 'post-item section-row-motion tactic-post-motion' : 'post-item';
        postDiv.setAttribute('data-post-id', tactic.id);

        const canEdit = this.ownedTacticIds.has(String(tactic.id));
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
                        <span class="post-title-text section-row-copy">${this.escapeHtml(tactic.title)}</span>
                        ${editSvg}
                    </a>
                ` : `
                    <span class="post-title"><span class="post-title-text">${this.escapeHtml(tactic.title)}</span>${editSvg}</span>
                `}
            </h3>
            <div class="post-meta">
                ${this.renderRegionBadge(tactic.region)} ${this.renderTypeBadge(tactic.tactic_type)}
                <span class="post-author">${this.escapeHtml(tactic.author)}</span>
                <span class="separator" aria-hidden="true">|</span>
                <span class="post-date">${this.formatDate(tactic.createdAt)}</span>
            </div>
            ${tactic.comment ? `<div class="post-comment section-row-copy">${this.escapeHtml(tactic.comment)}</div>` : ''}
        </div>
        
                <div class="post-content">
            ${libraryLink ? `
                <div class="post-link">
                    <a href="${libraryLink}" target="_blank" rel="noopener noreferrer">${this.t('view_tactic', '택틱 보기')}</a>
                </div>
            ` : ''}
            <div class="tactic-preview-container"></div>
        </div>

        <div class="post-footer">
            <div class="likes-section">
                <button onclick="tacticsViewer.handleLike('${tactic.id}')" class="like-button">
                    <img src="${BASE_URL}/assets/img/tactic-share/like.png" alt="${this.t('like_alt', '좋아요')}">
                </button>
                <div class="likes-count-wrapper">
                    <span class="likes-count">${tactic.likes}</span>
                </div>
            </div>
        </div>
    `;

        // 택틱 프리뷰 생성
        this.addTacticPreview(postDiv, tactic);

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
                const owned = await readTacticRows(supabase.from('my_tactic_ids').select('id').order('id'));
                this.ownedTacticIds = new Set(owned.map(tactic => String(tactic.id)));
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
        window.location.href = `/${this.currentLang}/tactic/tactic-upload.html?${params.toString()}`;
    }

    renderTypeBadge(type) {
        if (!type || type === 'ALL') return '';
        const labels = this.getTypeLabels();
        const label = labels[type] || type;
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

        // 컨테이너 표시 여부 (KR 제외)
        const container = document.querySelector('.spoiler-toggle-container');
        if (window.SpoilerState && typeof window.SpoilerState.bindCheckbox === 'function') {
            window.SpoilerState.bindCheckbox({
                checkbox: spoilerToggle,
                container,
                displayStyle: 'flex',
                lang: this.currentLang,
                source: 'tactics-viewer',
                onChange: async () => {
                    if (this.isApplyingSpoiler) return;
                    this.isApplyingSpoiler = true;
                    try {
                        await ensureCharacterDataLoaded();
                        this.initCharacterFilter();
                        this.applyFilters();
                        this.renderTactics();
                    } finally {
                        this.isApplyingSpoiler = false;
                    }
                }
            });
            return;
        }

        // Fallback
        const savedState = localStorage.getItem('spoilerToggle') === 'true';
        spoilerToggle.checked = savedState;
        spoilerToggle.addEventListener('change', async () => {
            const isEnabled = spoilerToggle.checked;
            localStorage.setItem('spoilerToggle', isEnabled.toString());
            await ensureCharacterDataLoaded();
            this.initCharacterFilter();
            this.applyFilters();
            this.renderTactics();
        });

        if (container) {
            container.style.display = ((window.isKrLikeLanguage && window.isKrLikeLanguage(this.currentLang)) || this.currentLang === 'kr') ? 'none' : 'flex';
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

    isFuukaElucidator(name) {
        const target = String(name || '').toLowerCase();
        return ['후카', 'Fuuka', 'フーカ', '風花'].some(v => v.toLowerCase() === target);
    }

    normalizePartyForLibraryPreview(party) {
        if (!Array.isArray(party)) return [];

        const members = party
            .map((member, index) => (member && typeof member === 'object') ? { ...member, __index: index } : null)
            .filter(member => member && member.name);

        const supportAtV3 = members.find(member => member.__index === 3 && String(member.order) === '-');
        const supportAtLegacy = members.find(member => member.__index === 4 && String(member.order) === '-');
        const supportMember = supportAtV3
            || supportAtLegacy
            || members.find(member => String(member.order) === '-')
            || null;
        const hasFuuka = supportMember ? this.isFuukaElucidator(supportMember.name) : false;

        if (hasFuuka) return members;

        const isWonder = (name) => name === '원더' || name === 'Wonder';

        const battleMembers = members
            .filter(member => !isWonder(member.name) && String(member.order) !== '-')
            .sort((a, b) => {
                const aOrder = parseInt(a.order, 10);
                const bOrder = parseInt(b.order, 10);
                const aSafe = Number.isFinite(aOrder) ? aOrder : 99;
                const bSafe = Number.isFinite(bOrder) ? bOrder : 99;
                return aSafe - bSafe;
            });

        const battleInNormalRange = battleMembers.filter(member => {
            const orderNumber = parseInt(member.order, 10);
            return Number.isFinite(orderNumber) && orderNumber >= 1 && orderNumber <= 4;
        });

        const keptIndexes = new Set();
        const battleToKeep = (battleInNormalRange.length > 0 ? battleInNormalRange : battleMembers).slice(0, 3);
        battleToKeep.forEach(member => keptIndexes.add(member.__index));

        if (supportMember && !isWonder(supportMember.name)) {
            keptIndexes.add(supportMember.__index);
        }

        members.forEach(member => {
            if (isWonder(member.name)) {
                keptIndexes.add(member.__index);
            }
        });

        return members.filter(member => keptIndexes.has(member.__index));
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
        const normalizedParty = this.normalizePartyForLibraryPreview(tacticData.party);
        const orderedParty = normalizedParty
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
                charImg.src = `${BASE_URL}/assets/img/tier/${member.name}.webp`;

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
                ritualImg.alt = this.template('ritual_alt', '의식 {value}', { value: ritualLevel });
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
            if (!this.userIP) {
                await this.getUserIP();
            }
            if (!this.userIP) {
                alert(this.t('error_like_ip_required', '좋아요 처리를 위해 IP 확인이 필요합니다. 잠시 후 다시 시도해주세요.'));
                return;
            }

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
                alert(this.t('error_already_liked_24h', '24시간 내 이미 좋아요 했습니다.'));
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
            if (likesCount) {
                likesCount.textContent = likes;
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    likesCount.animate?.([{ scale: 1 }, { scale: 1.18 }, { scale: 1 }], { duration: 220, easing: 'ease-out' });
                }
            }

            const tactic = this.allTactics.find(t => String(t.id) === String(tacticId));
            if (tactic) {
                tactic.likes = likes;
            }
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    }

    updatePaginationButtons() {
        const totalPages = Math.ceil(this.filteredTactics.length / this.postsPerPage);
        const pagination = document.getElementById('tacticPagination');
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const numbers = document.getElementById('tacticPageNumbers');
        const restoreFocus = pagination.contains(document.activeElement);
        pagination.hidden = totalPages <= 1;
        pagination.setAttribute('aria-label', this.t('pagination_label', 'Pagination'));
        prevButton.disabled = this.currentPage <= 1;
        nextButton.disabled = this.currentPage >= totalPages;

        const goTo = page => {
            if (page === this.currentPage || page < 1 || page > totalPages || pagination.hasAttribute('aria-busy')) return;
            this.currentPage = page;
            this.renderTactics();
        };
        prevButton.onclick = () => goTo(this.currentPage - 1);
        nextButton.onclick = () => goTo(this.currentPage + 1);
        numbers.replaceChildren();
        if (pagination.hidden) return;

        const windowStart = Math.max(2, Math.min(this.currentPage - 1, totalPages - 3));
        const windowEnd = Math.min(totalPages - 1, windowStart + 2);
        const pages = totalPages <= 7
            ? Array.from({ length: totalPages }, (_, index) => index + 1)
            : [1, ...Array.from({ length: windowEnd - windowStart + 1 }, (_, index) => windowStart + index), totalPages];
        let currentButton;
        pages.forEach((page, index) => {
            if (index > 0 && page - pages[index - 1] > 1) {
                const gap = document.createElement('span');
                gap.className = 'tactic-page-gap';
                gap.setAttribute('aria-hidden', 'true');
                gap.textContent = '…';
                numbers.append(gap);
            }
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = page;
            button.setAttribute('aria-label', formatI18nTemplate(this.t('page_number', 'Page {page}'), { page }));
            if (page === this.currentPage) {
                button.setAttribute('aria-current', 'page');
                currentButton = button;
            }
            button.onclick = () => goTo(page);
            numbers.append(button);
        });
        if (restoreFocus) currentButton?.focus({ preventScroll: true });
    }

    initRegionFilters() {
        const container = document.getElementById('regionButtons');
        if (!container) return;
        container.addEventListener('click', (e) => {
            const item = e.target.closest('.tab-button');
            if (!item) return;
            container.querySelectorAll('.tab-button').forEach(button => {
                button.classList.toggle('active', button === item);
                button.setAttribute('aria-pressed', String(button === item));
            });
            this.currentRegion = item.dataset.region;
            // 렌더 시점에서 region-badge는 renderRegionBadge에서 조건부 렌더링함
            this.applyFilters();
            this.renderTactics();
            this.loadRanking();
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
            container.querySelectorAll('.filter-item').forEach(button => {
                button.classList.toggle('active', button === item);
                button.setAttribute('aria-pressed', String(button === item));
            });
            this.currentType = item.dataset.type;
            this.applyFilters();
            this.renderTactics();
            this.loadRanking();
        });
    }

    getTypeLabels() {
        return {
            ALL: this.t('type_all', '전체'),
            '흉몽': this.t('type_nightmare', '흉몽'),
            '바다': this.t('type_sea', '바다'),
            '이벤트': this.t('type_event', '이벤트'),
            '기타': this.t('type_etc', '기타')
        };
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
            const displayTitle = this.currentLang === 'cn'
                ? (ch?.name_cn || ch?.name || name)
                : (ch?.name || name);

            img.alt = displayTitle;
            img.title = displayTitle;
            img.className = 'char-face';
            img.dataset.name = name;

            // 래퍼 생성 (배지 렌더링을 위한 컨테이너)
            const wrap = document.createElement('button');
            wrap.type = 'button';
            wrap.setAttribute('aria-pressed', 'false');
            wrap.className = 'char-face-wrap';
            wrap.appendChild(img);

            wrap.addEventListener('click', () => {
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
                            const pw = el.parentElement; if (pw && pw.classList.contains('char-face-wrap')) { pw.setAttribute('aria-pressed', 'false'); pw.classList.remove('selected'); pw.removeAttribute('data-order'); }
                        });
                    }
                    selected.push(name);
                }

                // 선택 표시 및 순번 배지 갱신
                grid.querySelectorAll('img.char-face').forEach(el => {
                    if (!selected.includes(el.dataset.name)) {
                        el.classList.remove('selected');
                        el.removeAttribute('data-order');
                        const pw = el.parentElement; if (pw && pw.classList.contains('char-face-wrap')) { pw.setAttribute('aria-pressed', 'false'); pw.classList.remove('selected'); pw.removeAttribute('data-order'); }
                    }
                });
                selected.forEach((n, i) => {
                    grid.querySelectorAll(`img[data-name="${CSS.escape(n)}"]`).forEach(el => {
                        el.classList.add('selected');
                        el.setAttribute('data-order', String(i + 1));
                        const pw = el.parentElement; if (pw && pw.classList.contains('char-face-wrap')) { pw.setAttribute('aria-pressed', 'true'); pw.classList.add('selected'); pw.setAttribute('data-order', String(i + 1)); }
                    });
                });

                this.updateMobileCharacterFilterCount();
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
                        const pw = el.parentElement; if (pw && pw.classList.contains('char-face-wrap')) { pw.setAttribute('aria-pressed', 'true'); pw.classList.add('selected'); pw.setAttribute('data-order', String(i + 1)); }
                    });
                });
                this.applyFilters();
                this.renderTactics();
            }
        } catch (_) { }
        this.updateMobileCharacterFilterCount();
    }

    // 언어별 UI 텍스트 초기화
    initLanguageTexts() {
        if (window.I18nService && typeof window.I18nService.updateDOM === 'function') {
            window.I18nService.updateDOM();
        }

        // 영어에서 랭킹 탭 폰트 사이즈 조정
        const rankingTabs = document.querySelectorAll('.ranking-tab');
        rankingTabs.forEach(btn => {
            if (this.currentLang === 'en') {
                btn.style.fontSize = '11px';
            } else {
                btn.style.fontSize = '';
            }
        });

        this.updateSEO();
    }

    updateSEO() {
        if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
            window.SeoEngine.setContextHint({
                domain: 'tactics',
                mode: 'list',
                lang: this.currentLang
            }, { rerun: true });
            return;
        }
        if (window.SeoEngine && typeof window.SeoEngine.run === 'function') {
            window.SeoEngine.run();
        }
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
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) {
                performSearch();
            }
        });
    }

    initRanking() {
        const rankingTabs = document.querySelectorAll('.ranking-tab');
        rankingTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                rankingTabs.forEach(button => {
                    button.classList.toggle('active', button === tab);
                    button.setAttribute('aria-pressed', String(button === tab));
                });
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
            if (this.currentRegion === 'CN') regionSet = new Set(['cn']);
            if (this.currentRegion === 'GLB') regionSet = new Set(['en', 'sea']);
            if (this.currentRegion === 'JP') regionSet = new Set(['jp']);

            const filteredTactics = this.allTactics.filter(tactic => {
                const inTime = tactic.createdAt >= startDate;
                const inRegion = !regionSet || regionSet.has((tactic.region || '').toLowerCase());
                const inType = !this.currentType || this.currentType === 'ALL' || tactic.tactic_type === this.currentType;
                return inTime && inRegion && inType;
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
        return {
            rankingStats: (posts, likes) => this.template(
                'ranking_stats',
                '택틱 {posts}개 · 좋아요 {likes}개',
                { posts, likes }
            ),
            relative: {
                minutes: (m) => this.template('relative_minutes', '{value}분 전', { value: m }),
                hours: (h) => this.template('relative_hours', '{value}시간 전', { value: h }),
                days: (d) => this.template('relative_days', '{value}일 전', { value: d })
            },
            dateLocale: this.t('date_locale', 'ko-KR')
        };
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async () => {
    const currentLang = getCurrentLanguage();
    document.getElementById('uploadButton').href = `/${currentLang}/tactic/tactic-upload.html`;
    if (typeof initPageI18n === 'function') {
        await initPageI18n('tactics');
        if (typeof setLang === 'function') {
            await setLang(currentLang);
        }
    } else if (window.I18nService && typeof window.I18nService.init === 'function') {
        await window.I18nService.init('tactics', currentLang);
    }
    Navigation.load('tactics');
    window.tacticsViewer = new TacticsViewer();
});
