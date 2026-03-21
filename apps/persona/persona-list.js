
// i18n Safety Fallback
window.t = window.t || function (key, defaultValue) { return defaultValue || key; };

// 다국어 지원 함수
// 언어별 SEO 설정 함수
function updateSEOContent() {
    if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
        window.SeoEngine.setContextHint({
            domain: 'persona',
            mode: 'list',
            entityKey: null,
            entityName: null
        }, { rerun: true });
        return;
    }
    if (window.SeoEngine && typeof window.SeoEngine.run === 'function') {
        window.SeoEngine.run();
    }
}

// URL에서 검색 파라미터를 가져와서 검색을 실행하는 함수
function handleSearchParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
        const searchInput = document.getElementById('personaSearch');

        if (searchInput) {
            // URL 기반 검색 적용 플래그 설정 (자동 확장 및 드롭다운 숨김은 이 경우에만)
            window.isApplyingUrlSearch = true;
            searchInput.value = searchQuery;
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            // 초기 파라미터 적용 시 자동완성 드롭다운은 표시하지 않음
            const dropdown = document.getElementById('searchDropdown');
            if (dropdown) dropdown.style.display = 'none';
        }
    }
}

function triggerPersonaRoutingWhenReady(maxAttempts = 80, delayMs = 100) {
    if (window.__personaRoutingBootstrapTimer) return;

    let attempts = 0;

    const tryRoute = () => {
        if (typeof window.handlePersonaRouting === 'function') {
            if (window.__personaRoutingBootstrapTimer) {
                clearTimeout(window.__personaRoutingBootstrapTimer);
                window.__personaRoutingBootstrapTimer = null;
            }
            window.handlePersonaRouting();
            return;
        }

        attempts += 1;
        if (attempts >= maxAttempts) {
            if (window.__personaRoutingBootstrapTimer) {
                clearTimeout(window.__personaRoutingBootstrapTimer);
                window.__personaRoutingBootstrapTimer = null;
            }
            return;
        }

        window.__personaRoutingBootstrapTimer = setTimeout(tryRoute, delayMs);
    };

    tryRoute();
}

function updatePersonaLoadingProgress(loaded, total) {
    const progressEl = document.getElementById('personaLoadingProgress');
    if (!progressEl) return;

    const safeTotal = Number(total || 0);
    if (!Number.isFinite(safeTotal) || safeTotal <= 0) {
        progressEl.textContent = '';
        progressEl.hidden = true;
        return;
    }

    const safeLoaded = Math.max(0, Math.min(safeTotal, Number(loaded || 0)));
    progressEl.hidden = false;
    progressEl.textContent = `${safeLoaded}/${safeTotal}`;
}

function initializePersonaLoadingProgress() {
    const initialTotal =
        (Array.isArray(window.personaOrder) ? window.personaOrder.length : 0) +
        (Array.isArray(window.personaNonOrder) ? window.personaNonOrder.length : 0);

    updatePersonaLoadingProgress(0, initialTotal);

    window.addEventListener('persona-loader-progress', (event) => {
        const detail = event && event.detail ? event.detail : {};
        updatePersonaLoadingProgress(detail.loaded, detail.total);
    });

    const state = window.__personaLoaderState;
    if (state && Number(state.total || 0) > 0) {
        updatePersonaLoadingProgress(state.loadedCount, state.total);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize i18n
    if (typeof initPageI18n === 'function') {
        await initPageI18n('persona');
    }

    // 2. Load Core Modules
    Navigation.load('persona');
    VersionChecker.check();
    updateSEOContent();
    initializePersonaLoadingProgress();

    // 3. Initialize Page Content
    const runInit = () => {
        initializePageContent().then(() => {
            setTimeout(handleSearchParam, 100);
            triggerPersonaRoutingWhenReady();
            setupGlobalSkillLevelSelector();
            if (window.initPersonaSearch) window.initPersonaSearch();
        });
    };

    if (typeof ensurePersonaFilesLoaded === 'function') {
        ensurePersonaFilesLoaded(runInit);
    } else {
        runInit();
    }
});

// 공용: LV6/LV7/LV8/ALL 버튼으로 "/" 구분 3단 수치를 필터링하는 헬퍼
function filterDescByLevel(originalText, levelIndex) {
    if (levelIndex === null || levelIndex === undefined) return originalText;
    // "150.0%/157.5%/165.0%" 또는 "1471 / 1854 / 2275" 형태를 개별 값으로 치환 (공백 허용)
    const tripleRegex = /(\d+(?:\.\d+)?)(%?)\s*\/\s*(\d+(?:\.\d+)?)(%?)\s*\/\s*(\d+(?:\.\d+)?)(%?)/g;
    return originalText.replace(tripleRegex, (match, n1, u1, n2, u2, n3, u3) => {
        const variants = [`${n1}${u1}`, `${n2}${u2}`, `${n3}${u3}`];
        return variants[levelIndex] || variants[0];
    });
}

// Global variable for skill level (0: LV6, 1: LV7, 2: LV8, null: ALL)
let globalSkillLevel = 0;

async function initializePageContent() {
    const cardsContainer = document.getElementById('personaCards');

    // 현재 언어 확인
    const currentLang = typeof LanguageRouter !== 'undefined' ? LanguageRouter.getCurrentLanguage() : 'kr';

    // 새 데이터(window.personaFiles)만 사용 (기존 persona.js 는 더 이상 참조하지 않음)
    const personaSource = (typeof window !== 'undefined' && window.personaFiles)
        ? window.personaFiles
        : {};

    // order.js 에서 로드된 순서 정보 + nonorder.js 정보 병합
    let sortedPersonas = [];

    // Update initial count (정렬된 목록 길이 기준)
    const countText = window.t('filteredCount', '전체');
    const countUnit = window.t('countUnit', (currentLang === 'kr' ? '개' : ''));
    document.getElementById('filteredCount').textContent = `${countText} ${sortedPersonas.length}${countUnit}`;
    // 대량 렌더링 최적화: 청크 단위로 분할 렌더링하여 메인 스레드 점유를 줄임
    const CHUNK_SIZE = 10;
    let currentIndex = 0;

    function renderChunk() {
        const fragment = document.createDocumentFragment();
        let processed = 0;
        while (processed < CHUNK_SIZE && currentIndex < sortedPersonas.length) {
            const personaName = sortedPersonas[currentIndex];
            const index = currentIndex;
            const detailContainer = document.createElement('div');
            detailContainer.className = 'persona-detail-container';
            // Add data attributes for filtering
            detailContainer.dataset.element = personaSource[personaName].element;
            detailContainer.dataset.position = personaSource[personaName].position;
            detailContainer.dataset.rarity = personaSource[personaName].star;
            detailContainer.dataset.name = personaName;  // Add data-name attribute for search
            detailContainer.dataset.grade = personaSource[personaName].grade;  // Add data-grade attribute for grade
            detailContainer.dataset.event = personaSource[personaName].event;
            detailContainer.dataset.wild_emblem_rainbow = personaSource[personaName].wild_emblem_rainbow;
            // Preserve original order for restoring after collapse
            detailContainer.dataset.order = String(index);

            // Left card image section
            const cardSection = document.createElement('div');
            cardSection.className = 'persona-card-section';

            // Insert existing card creation code here
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.element = personaSource[personaName].element;
            card.dataset.position = personaSource[personaName].position;
            card.dataset.rarity = personaSource[personaName].star;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            // Add card background with optimization
            const cardBg = document.createElement('img');
            cardBg.src = `${window.SITE_BASEURL}/assets/img/persona/persona-card-${personaSource[personaName].element}.webp`;
            cardBg.alt = "card background";
            cardBg.className = 'card-background';
            cardBg.loading = 'lazy';
            cardBg.decoding = 'async';

            // Persona image with optimized lazy loading
            const img = document.createElement('img');
            img.src = `${window.SITE_BASEURL}/assets/img/persona/${personaName}.webp`;
            img.alt = personaName;
            img.className = 'persona-img';
            img.loading = 'lazy';
            img.decoding = 'async';  // 비동기 디코딩으로 렌더링 성능 향상

            // Add rarity cover
            const coverStar = document.createElement('img');
            coverStar.src = `${window.SITE_BASEURL}/assets/img/persona/persona-cover-star${personaSource[personaName].star}.webp`;
            coverStar.alt = "rarity cover";
            coverStar.className = 'cover-star';
            coverStar.loading = 'lazy';

            // Add remaining elements
            const positionContainer = document.createElement('div');
            positionContainer.className = 'position-container';

            const positionIcon = document.createElement('img');
            positionIcon.src = `${window.SITE_BASEURL}/assets/img/persona/직업_${personaSource[personaName].position}.png`;
            positionIcon.alt = personaSource[personaName].position;
            positionIcon.className = 'position-icon';
            positionIcon.loading = 'lazy';
            positionIcon.decoding = 'async';

            const elementIcon = document.createElement('img');
            elementIcon.src = `${window.SITE_BASEURL}/assets/img/persona/속성_${personaSource[personaName].element}.png`;
            elementIcon.alt = personaSource[personaName].element;
            elementIcon.className = 'element-icon';
            elementIcon.loading = 'lazy';
            elementIcon.decoding = 'async';

            positionContainer.appendChild(positionIcon);

            // 1. Background (Static)
            card.appendChild(cardBg);

            // 2. Persona Image (Scalable Wrapper)
            imageContainer.appendChild(img);
            card.appendChild(imageContainer);

            // 3. Overlays (Static)
            card.appendChild(coverStar);
            card.appendChild(positionContainer);
            card.appendChild(elementIcon);

            // Repression Medal
            if (personaSource[personaName].wild_emblem_rainbow) {
                const wildEmblem = document.createElement('img');
                wildEmblem.src = `${window.SITE_BASEURL}/assets/img/persona/wild-emblem-rainbow.png`;
                wildEmblem.alt = "Repression Medal";
                wildEmblem.className = 'wild-emblem';
                wildEmblem.loading = 'lazy';
                wildEmblem.decoding = 'async';
                // attach to card so it can be absolutely positioned at top-right via CSS
                card.appendChild(wildEmblem);
            }

            // Tier Labels
            // Logic: Use `tier` property ("S", "A", "B", "C") directly
            const pTier = personaSource[personaName].tier;
            if (pTier) {
                const tierLabel = document.createElement('div');
                tierLabel.className = `tier-label tier-${pTier.toLowerCase()}`;
                tierLabel.textContent = pTier;
                card.appendChild(tierLabel);
            }

            cardSection.appendChild(card);

            // 언어별 데이터 가져오기 (이름만 필요)
            const persona = personaSource[personaName];
            let displayName = personaName;
            if (currentLang === 'en') {
                displayName = persona.name_en || personaName;
            } else if (currentLang === 'jp') {
                displayName = persona.name_jp || personaName;
            }

            // Collapsed-mode name caption under the card
            const nameCaption = document.createElement('div');
            nameCaption.className = 'persona-name';
            nameCaption.textContent = displayName;

            cardSection.appendChild(nameCaption);

            // Info Section 생략 (detailPanel에서 생성)

            // Add sections to container
            detailContainer.appendChild(cardSection);

            fragment.appendChild(detailContainer);
            currentIndex++;
            processed++;
        }
        // 청크 단위로 DOM 삽입
        cardsContainer.appendChild(fragment);

        if (currentIndex < sortedPersonas.length) {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(renderChunk, { timeout: 100 });
            } else {
                setTimeout(renderChunk, 0);
            }
        } else {
            // 전체 렌더 완료 후 툴팁 1회 지연 실행 및 컨테이너 캐싱
            if (typeof addTooltips === 'function') {
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => addTooltips(), { timeout: 1000 });
                } else {
                    setTimeout(() => addTooltips(), 0);
                }
            }

            // Count 업데이트 (Explicitly set at end of render)
            const cText = window.t('filteredCount', '전체');
            const cUnit = window.t('countUnit', (currentLang === 'kr' ? '개' : ''));
            const cEl = document.getElementById('filteredCount');
            if (cEl) cEl.textContent = `${cText} ${sortedPersonas.length}${cUnit}`;

            // 컨테이너 목록 캐싱 (필터/검색에서 재사용)
            containers = document.querySelectorAll('.persona-detail-container');
            // 인터랙션 연결
            wireCardInteractions();

            // 렌더 완료 후 URL 검색 파라미터 적용 (컨테이너 준비된 이후에만 실행)
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const searchQuery = urlParams.get('search');
                if (searchQuery && searchInput) {
                    searchInput.value = searchQuery;
                    // 드롭다운은 표시하지 않음
                    if (dropdown) dropdown.style.display = 'none';
                    // 리스너가 연결된 이후 안전하게 트리거
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

            } catch (_) { /* no-op */ }

            // Always attempt detail routing after cards are rendered and interactions are wired.
            triggerPersonaRoutingWhenReady();

            // Initial Auto Select (Once) - Only if no deep link handled
            if (!window.hasInitialAutoSelected && containers.length > 0) {
                const firstCard = containers[0];
                renderDetailInPanel(firstCard);
                firstCard.classList.add('selected');
                window.hasInitialAutoSelected = true;
            }
        }
    }
    // 초기 렌더 시작
    // if ('requestIdleCallback' in window) {
    //     requestIdleCallback(renderChunk, { timeout: 50 });
    // } else {
    //     setTimeout(renderChunk, 0);
    // }

    // 컨테이너 목록은 렌더 완료 후 할당됨
    let containers = null;

    // Function to generate detailed info section dynamically
    function generatePersonaDetail(personaName) {
        if (!personaSource[personaName]) return null;

        const persona = personaSource[personaName];
        // Create info section
        const infoSection = document.createElement('div');
        infoSection.className = 'persona-info-section';

        // Localize
        let displayName = personaName;
        let uniqueSkillName = persona.uniqueSkill?.name || '';
        let uniqueSkillEffect = persona.uniqueSkill?.desc || persona.uniqueSkill?.effect || '';
        let highlightEffect = persona.highlight?.desc || persona.highlight?.effect || '';
        let tierDesc = persona.tier_desc;
        let comment = persona.comment;

        if (currentLang === 'en') {
            displayName = persona.name_en || personaName;
            uniqueSkillName = persona.uniqueSkill?.name_en || persona.uniqueSkill?.name || uniqueSkillName;
            uniqueSkillEffect = persona.uniqueSkill?.desc_en || persona.uniqueSkill?.desc || persona.uniqueSkill?.effect_en || persona.uniqueSkill?.effect || uniqueSkillEffect;
            highlightEffect = persona.highlight?.desc_en || persona.highlight?.desc || persona.highlight?.effect_en || persona.highlight?.effect || highlightEffect;
            tierDesc = persona.tier_desc_en || persona.tier_desc || tierDesc;
            comment = persona.comment_en || persona.comment;
        } else if (currentLang === 'jp') {
            displayName = persona.name_jp || personaName;
            uniqueSkillName = persona.uniqueSkill?.name_jp || persona.uniqueSkill?.name || uniqueSkillName;
            uniqueSkillEffect = persona.uniqueSkill?.desc_jp || persona.uniqueSkill?.desc || persona.uniqueSkill?.effect_jp || persona.uniqueSkill?.effect || uniqueSkillEffect;
            highlightEffect = persona.highlight?.desc_jp || persona.highlight?.desc || persona.highlight?.effect_jp || persona.highlight?.effect || highlightEffect;
            tierDesc = persona.tier_desc_jp || persona.tier_desc || tierDesc;
            comment = persona.comment_jp || persona.comment;
        }

        // Header Info (Updated with Skill Toggle)
        const headerInfo = document.createElement('div');
        headerInfo.className = 'persona-header-info';
        // Use flex to position toggle on the right
        headerInfo.style.display = 'flex';
        headerInfo.style.justifyContent = 'space-between';
        headerInfo.style.alignItems = 'flex-end';

        // Left: Name & Grade + Icons/Stars
        const leftDiv = document.createElement('div');
        leftDiv.style.display = 'flex';
        leftDiv.style.flexDirection = 'column';
        leftDiv.style.alignItems = 'flex-start';
        leftDiv.style.gap = '10px';

        // Star Logic
        const starCount = parseInt(persona.star) || 0;
        let starHtml = '';
        const baseUrl = window.SITE_BASEURL || '';
        if (starCount >= 5) {
            // 5 stars = 5 gold stars
            starHtml = Array(5).fill(`<img src="${baseUrl}/assets/img/character-detail/star5.png" alt="★" style="width:14px;height:14px;object-fit:contain;">`).join('');
        } else {
            // < 5 stars = N silver stars
            starHtml = Array(starCount).fill(`<img src="${baseUrl}/assets/img/character-detail/star4.png" alt="★" style="width:14px;height:14px;object-fit:contain;">`).join('');
        }

        leftDiv.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <h2>${displayName}</h2>
                <img class="persona-grade-img" src="${baseUrl}/assets/img/persona/persona-grade${persona.grade}.webp" alt="Grade ${persona.grade}">
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
                <img src="${baseUrl}/assets/img/persona/속성_${persona.element}.png" alt="${persona.element}" style="width:20px; height:20px; object-fit:contain;">
                <img src="${baseUrl}/assets/img/persona/직업_${persona.position}.png" alt="${persona.position}" style="width:20px; height:20px; object-fit:contain;">
                <div style="display:flex; gap:1px;">${starHtml}</div>
            </div>
        `;


        // Right: Skill Toggle (Dynamic)
        const rightDiv = document.createElement('div');
        // Determine active state
        const lvl = (typeof globalSkillLevel === 'number' && globalSkillLevel !== null) ? globalSkillLevel : 'ALL';
        const btnClass = (l) => `skill-level-btn${lvl === l ? ' active' : ''}`;

        const labelText = window.t('skillLevelLabel', '스킬 레벨');

        rightDiv.innerHTML = `
            <div class="skill-level-toggle" style="margin-left:auto;">
                <div style="display: flex; align-items: center; gap: 4px;">
                    <span class="skill-level-label" style="margin-right:0px; font-size:12px; color:#aaa;">${labelText}</span>
                    <span class="tooltip-icon" data-i18n-tooltip="tooltipSkillLevel" data-tooltip="${window.t('tooltipSkillLevel', '')}" style="display: inline-flex; align-items: center;">
                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="8.5" stroke="currentColor" stroke-opacity="0.1" fill="rgba(255,255,255,0.05)"></circle>
                            <path d="M7.2 7.2C7.2 6.32 7.92 5.6 8.8 5.6H9.2C10.08 5.6 10.8 6.32 10.8 7.2C10.8 7.84 10.48 8.4 9.96 8.68L9.6 8.88C9.28 9.04 9.2 9.2 9.2 9.6V10.4M9 12.4V13.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.3"></path>
                        </svg>
                    </span>
                </div>
                <div class="skill-level-buttons skill-level-buttons-global">
                    <button type="button" class="${btnClass(0)}" data-level="0">6</button>
                    <button type="button" class="${btnClass(1)}" data-level="1">7</button>
                    <button type="button" class="${btnClass(2)}" data-level="2">8</button>
                    <button type="button" class="${btnClass('ALL')}" data-level="ALL">ALL</button>
                </div>
            </div>
        `;

        headerInfo.appendChild(leftDiv);
        headerInfo.appendChild(rightDiv);

        // Note: Event listeners for buttons are delegated in setupGlobalSkillLevelSelector

        infoSection.appendChild(headerInfo);

        // Acquisition moved to bottom


        const tier = persona.tier ? String(persona.tier).trim().toUpperCase() : '';
        if (tier) {
            const tierInfo = document.createElement('div');
            tierInfo.className = 'persona-tier-info';
            tierInfo.dataset.tier = tier.toLowerCase();

            const tierHeader = document.createElement('div');
            tierHeader.className = 'persona-tier-header';

            const tierTitle = document.createElement('h3');
            tierTitle.textContent = window.t('tierSectionTitle', 'TIER');

            const tierBadge = document.createElement('span');
            tierBadge.className = 'persona-tier-badge';
            tierBadge.textContent = tier;

            tierHeader.appendChild(tierTitle);
            tierHeader.appendChild(tierBadge);
            tierInfo.appendChild(tierHeader);

            if (tierDesc && tierDesc.trim() !== '') {
                const tierDescP = document.createElement('p');
                tierDescP.className = 'persona-tier-desc';
                tierDescP.textContent = tierDesc;
                tierInfo.appendChild(tierDescP);
            }

            if (comment && comment.trim() !== '') {
                const tipWrap = document.createElement('div');
                tipWrap.className = 'persona-tier-tip';

                const tipLabel = document.createElement('span');
                tipLabel.className = 'persona-tier-tip-label';
                tipLabel.textContent = window.t('tipLabel', 'TIP');

                const tipText = document.createElement('p');
                tipText.className = 'persona-tier-tip-text';
                tipText.textContent = comment;

                tipWrap.appendChild(tipLabel);
                tipWrap.appendChild(tipText);
                tierInfo.appendChild(tipWrap);
            }

            infoSection.appendChild(tierInfo);
        }

        // Instinct / Passive
        const instinctInfo = document.createElement('div');
        instinctInfo.className = 'persona-instinct-info';

        // Instinct Variants Logic
        const instinctVariants = [];
        if (Array.isArray(persona.passive_skill) && persona.passive_skill.length > 0) {
            persona.passive_skill.forEach((p) => {
                if (!p) return;
                let name = p.name; let effects = p.desc;
                const priority = typeof persona.passive_priority === 'number' ? persona.passive_priority : 0;
                if (currentLang === 'en') { name = p.name_en || name; effects = p.desc_en || effects; }
                else if (currentLang === 'jp') { name = p.name_jp || name; effects = p.desc_jp || effects; }
                let baseName = name; let roman = '';
                const m = name && name.match(/\s+([IVX]+)$/);
                if (m) { roman = m[1]; baseName = name.slice(0, m.index).trim(); }
                instinctVariants.push({ name, baseName, roman, effects, priority });
            });
        } else {
            function pushLegacy(src) {
                if (!src) return;
                let name = src.name; let effects = src.effects; let priority = src.priority;
                if (currentLang === 'en') { name = src.name_en || name; effects = src.effects_en || effects; }
                else if (currentLang === 'jp') { name = src.name_jp || name; effects = src.effects_jp || effects; }
                let baseName = name; let roman = '';
                const m = name && name.match(/\s+([IVX]+)$/);
                if (m) { roman = m[1]; baseName = name.slice(0, m.index).trim(); }
                instinctVariants.push({ name, baseName, roman, effects, priority });
            }
            pushLegacy(persona.instinct);
            if (persona.instinct2) pushLegacy(persona.instinct2);
        }

        // Instinct Header
        const instinctHeader = document.createElement('div');
        instinctHeader.className = 'persona-instinct-header';
        const instinctTitle = document.createElement('h3');
        const baseTitle = instinctVariants[0] ? (instinctVariants[0].baseName || instinctVariants[0].name) : ((persona.instinct && persona.instinct.name) || '');
        instinctTitle.textContent = baseTitle;
        instinctHeader.appendChild(instinctTitle);

        let activeInstinctIndex = instinctVariants.length > 0 ? (instinctVariants.length - 1) : 0;
        let instinctButtonsWrap = null;
        if (instinctVariants.length > 1) {
            instinctButtonsWrap = document.createElement('div');
            instinctButtonsWrap.className = 'instinct-variant-buttons';
            instinctVariants.forEach((variant, idx) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'instinct-variant-btn' + (idx === activeInstinctIndex ? ' active' : '');
                if (idx === 0) btn.textContent = '0';
                else if (variant.roman) btn.textContent = variant.roman;
                else btn.textContent = String(idx);

                btn.setAttribute('aria-pressed', idx === activeInstinctIndex ? 'true' : 'false');
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (activeInstinctIndex === idx) return;
                    activeInstinctIndex = idx;
                    instinctButtonsWrap.querySelectorAll('.instinct-variant-btn').forEach((b, i) => {
                        b.classList.toggle('active', i === activeInstinctIndex);
                        b.setAttribute('aria-pressed', i === activeInstinctIndex);
                    });
                    updateInstinctEffect();
                });
                instinctButtonsWrap.appendChild(btn);
            });
            instinctHeader.appendChild(instinctButtonsWrap);
        }
        instinctInfo.appendChild(instinctHeader);

        const instinctEffectP = document.createElement('p');
        instinctEffectP.className = 'instinct-text';

        function updateInstinctEffect() {
            const current = instinctVariants[activeInstinctIndex] || instinctVariants[0];
            if (!current) return;
            const text = Array.isArray(current.effects) ? current.effects.join('\n') : current.effects;
            instinctEffectP.textContent = text || '';
            instinctTitle.textContent = current.baseName || current.name || instinctTitle.textContent;
            // Re-highlight if needed (tooltips)
            if (typeof addTooltips === 'function') try { addTooltips(); } catch (_) { }
        }
        updateInstinctEffect();
        instinctInfo.appendChild(instinctEffectP);
        infoSection.appendChild(instinctInfo);

        // Unique & Highlight
        const skillContainer = document.createElement('div');
        skillContainer.className = 'skill-highlight-container';

        // Unique
        const uniqueSkillInfo = document.createElement('div');
        uniqueSkillInfo.className = 'persona-unique-skill-info';

        let uniqueSkillIconName = (currentLang === 'en' || currentLang === 'jp')
            ? (persona.uniqueSkill.icon_gl || persona.uniqueSkill.icon) : persona.uniqueSkill.icon;

        // Fallback for Default icon: lookup in skills.js using original Korean name
        if (uniqueSkillIconName === 'Default' || !uniqueSkillIconName) {
            const sList = (typeof personaSkillList !== 'undefined') ? personaSkillList : {};
            // Use original name for lookup
            const originalName = (persona.uniqueSkill.name || '').trim();
            const match = sList[originalName];
            if (match && match.icon) {
                uniqueSkillIconName = match.icon;
            }
        }

        const uniqueHeader = document.createElement('div');
        uniqueHeader.className = 'persona-unique-header';
        const uniqueTitle = document.createElement('h3');
        const uniqueIcon = document.createElement('img');
        uniqueIcon.src = `${window.SITE_BASEURL}/assets/img/persona/속성_${uniqueSkillIconName}.png`;
        uniqueIcon.className = 'skill-type-icon';

        uniqueTitle.appendChild(uniqueIcon);
        uniqueTitle.appendChild(document.createTextNode(` ${uniqueSkillName} `));
        uniqueHeader.appendChild(uniqueTitle);

        const uniqueDescP = document.createElement('p');
        uniqueDescP.dataset.originalText = uniqueSkillEffect;
        if (typeof globalSkillLevel === 'number' && typeof filterDescByLevel === 'function') {
            uniqueDescP.textContent = filterDescByLevel(uniqueSkillEffect, globalSkillLevel);
        } else {
            uniqueDescP.textContent = uniqueSkillEffect;
        }
        uniqueSkillInfo.appendChild(uniqueHeader);
        uniqueSkillInfo.appendChild(uniqueDescP);
        skillContainer.appendChild(uniqueSkillInfo);

        // Highlight
        const highlightLabel = window.t('highlight', 'HIGHLIGHT');

        const highlightInfo = document.createElement('div');
        highlightInfo.className = 'persona-highlight-info';

        const highlightHeader = document.createElement('div');
        highlightHeader.className = 'persona-highlight-header';
        const highlightTitle = document.createElement('h3');
        highlightTitle.textContent = highlightLabel;
        highlightHeader.appendChild(highlightTitle);

        const highlightDescP = document.createElement('p');
        highlightDescP.dataset.originalText = highlightEffect;
        if (typeof globalSkillLevel === 'number' && typeof filterDescByLevel === 'function') {
            highlightDescP.textContent = filterDescByLevel(highlightEffect, globalSkillLevel);
        } else {
            highlightDescP.textContent = highlightEffect;
        }
        highlightInfo.appendChild(highlightHeader);
        highlightInfo.appendChild(highlightDescP);
        skillContainer.appendChild(highlightInfo);

        infoSection.appendChild(skillContainer);

        // Recommended Skills
        if (persona.recommendSkill && persona.recommendSkill.length > 0 && persona.recommendSkill[0].name) {
            const recommendedSkillLabel = window.t('recommendedSkills', '추천 스킬');

            const recommendedSkills = document.createElement('div');
            recommendedSkills.className = 'persona-recommended-skills';
            recommendedSkills.innerHTML = `<h3>${recommendedSkillLabel}</h3><ul>` +
                persona.recommendSkill.map(skill => {
                    const skillInfo = personaSkillList[skill.name];
                    if (!skillInfo) return '';
                    let skillName = skill.name; let skillDescription = skillInfo.description;
                    if (currentLang === 'en') { skillName = skillInfo.name_en || skill.name; skillDescription = skillInfo.description_en || skillInfo.description; }
                    else if (currentLang === 'jp') { skillName = skillInfo.name_jp || skill.name; skillDescription = skillInfo.description_jp || skillInfo.description; }

                    let iconName = (currentLang === 'en' || currentLang === 'jp') ? (skillInfo.icon_gl || skillInfo.icon) : skillInfo.icon;
                    if (iconName === 'Default') {
                        if (skillInfo.icon && skillInfo.icon !== 'Default') iconName = skillInfo.icon;
                        // Sometimes skillInfo IS the source, if it says Default we are stuck unless we have another mapping. 
                        // But request says "match @[skills.js]". recommendSkill ALREADY matches skills.js. 
                        // If skills.js says Default, maybe there's a circular logic or it's just Default. 
                        // Assuming request mostly targeted Unique skills where icon is embedded in persona object.
                    }

                    const isPassive = skillInfo.type === "패시브";
                    return `<li data-priority="${skill.priority}">
                                <div class="skill-info">
                                    <div class="skill-name-container">
                                        ${(function () {
                            const pMap = { '3': '1st', '2': '2nd', '1': '3rd', '0': '4th' };
                            const cMap = {
                                '3': '#e99292',
                                '2': 'rgba(114, 165, 224, 0.8)',
                                '1': 'rgb(255, 255, 255, 0.8)',
                                '0': 'rgb(255, 255, 255, 0.4)'
                            };
                            const pLabel = pMap[String(skill.priority)] || '';
                            const pColor = cMap[String(skill.priority)] || 'rgba(255, 255, 255, 0.9)';
                            return `<span class="priority-label" style="display:inline-block; font-size: 9px !important; min-width: 24px; margin-right: 0px !important; box-sizing: border-box; background: #222; padding: 1px 3px; border-radius: 4px; text-align: center; color: ${pColor};">${pLabel}</span>`;
                        })()}
                                        <img src="${window.SITE_BASEURL}/assets/img/persona/속성_${iconName}.png" alt="${iconName}" class="skill-icon">
                                        <span class="skill-name" data-skill-kor-full="${skill.name}">${skillName}</span>
                                    </div>
                    <span class="skill-description" ${isPassive ? 'data-passive="true"' : ''}>${skillDescription}</span>
                </div>
            </li>`;
                }).join('') + `</ul>`;

            // Apply skill level filtering to recommended skills
            const recommendedDescSpans = recommendedSkills.querySelectorAll('.skill-description');
            recommendedDescSpans.forEach((span) => {
                // type 이 "패시브" 인 추천 스킬은 스킬 레벨 토글의 영향을 받지 않는다.
                if (span.dataset.passive === 'true') return;
                const original = span.textContent || '';
                span.dataset.originalText = original;
                if (typeof globalSkillLevel === 'number' && typeof filterDescByLevel === 'function') {
                    span.textContent = filterDescByLevel(original, globalSkillLevel);
                }
            });
            infoSection.appendChild(recommendedSkills);
        }
        // Innate Skills (Acquired)
        if (persona.innate_skill && persona.innate_skill.length > 0) {
            const innateLabel = window.t('innateSkills', '획득 스킬');

            // Filter skills that exist in current language
            const validSkills = persona.innate_skill.filter(skill => {
                if (currentLang === 'en') return !!skill.name_en;
                if (currentLang === 'jp') return !!skill.name_jp;
                return !!skill.name; // default kr
            });

            if (validSkills.length > 0) {
                const innateSkills = document.createElement('div');
                innateSkills.className = 'persona-innate-skills';
                innateSkills.innerHTML = `<h3>${innateLabel}</h3><ul>` +
                    validSkills.map(skill => {
                        const skillInfo = personaSkillList[skill.name] || {};
                        let skillName = skill.name;
                        let skillDescription = skill.desc;

                        if (currentLang === 'en') {
                            skillName = skill.name_en;
                            skillDescription = skill.desc_en;
                        } else if (currentLang === 'jp') {
                            skillName = skill.name_jp;
                            skillDescription = skill.desc_jp;
                        }

                        const iconName = (currentLang === 'en' || currentLang === 'jp') ? (skillInfo.icon_gl || skillInfo.icon) : skillInfo.icon;
                        const safeIcon = iconName || '패시브';

                        return `<li>
                                    <div class="skill-info">
                                        <div class="skill-name-container">
                                            <span class="innate-level">Lv.${skill.learn_level}</span>
                                            <img src="${window.SITE_BASEURL}/assets/img/persona/속성_${safeIcon}.png" alt="${safeIcon}" class="skill-icon">
                                            <span class="skill-name">${skillName}</span>
                                        </div>
                                        <span class="skill-description">${skillDescription}</span>
                                    </div>
                                </li>`;
                    }).join('') + `</ul>`;

                infoSection.appendChild(innateSkills);
            }
        }

        // Acquisition (Moved here)
        try {
            if (window.Acquisition && typeof window.Acquisition.renderInto === 'function') {
                window.Acquisition.renderInto(infoSection, personaName);
            }
        } catch (e) { }

        // Update Page Title and Meta Data (SEO)
        updatePageSEO(personaName, displayName, tierDesc || comment);

        return infoSection;
    }

    // Update Page Title & Meta Tags
    function updatePageSEO(originalName, localizedName, description) {
        const slugMap = window.__PERSONA_SLUG_MAP;
        const pathMatch = window.location.pathname.match(/^\/(kr|en|jp)\/persona\//);
        let entityKey = originalName;

        if (slugMap && slugMap[originalName] && pathMatch) {
            entityKey = slugMap[originalName].slug || originalName;
        }

        if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
            window.SeoEngine.setContextHint({
                domain: 'persona',
                mode: 'detail',
                entityKey: entityKey,
                entityName: localizedName
            }, { rerun: true });
        } else if (window.SeoEngine && typeof window.SeoEngine.run === 'function') {
            window.SeoEngine.run();
        }
    }

    // 카드 클릭 인터랙션 (Selection -> Detail View)
    function wireCardInteractions() {
        const grid = document.getElementById('personaCards');
        if (containers) {
            containers.forEach(container => {
                // 클릭 가능한 영역 설정
                const clickTarget = container.querySelector('.persona-card-section') || container;
                clickTarget.style.cursor = 'pointer';

                clickTarget.onclick = (e) => {
                    e.stopPropagation();

                    // 1. Highlight Selection
                    containers.forEach(c => c.classList.remove('selected'));
                    container.classList.add('selected');

                    // 2. Render Detail
                    renderDetailInPanel(container);

                    // 3. Update URL (SEO / Deep Linking)
                    const targetName = container.dataset.name;
                    const slugMap = window.__PERSONA_SLUG_MAP;
                    const pathMatch = window.location.pathname.match(/^\/(kr|en|jp)\/persona\//);
                    if (slugMap && slugMap[targetName] && pathMatch) {
                        var lang = pathMatch[1];
                        var newPath = '/' + lang + '/persona/' + slugMap[targetName].slug + '/';
                        if (window.location.pathname !== newPath) {
                            window.history.pushState({ name: targetName }, '', newPath);
                        }
                    } else {
                        const url = new URL(window.location);
                        if (url.searchParams.get('name') !== targetName) {
                            url.searchParams.set('name', targetName);
                            // Delete legacy param if exists
                            url.searchParams.delete('persona');
                            window.history.pushState({ name: targetName }, '', url);
                        }
                    }
                };
            });
        }
    }

    function renderDetailInPanel(sourceContainer) {
        const detailPanel = document.getElementById('personaDetailContent');
        const sourceName = sourceContainer.dataset.name;

        // Generate content dynamically
        const infoSection = generatePersonaDetail(sourceName);
        if (!infoSection) {
            return;
        }

        // Clear previous content
        detailPanel.innerHTML = '';
        detailPanel.className = 'sticky-content';

        // Append to panel
        detailPanel.appendChild(infoSection);

        // Re-bind tooltips and apply formatting (number highlighting)
        if (typeof addTooltips === 'function') {
            try { addTooltips(); } catch (_) { }
        }

        // Manual binding for new tooltip elements (ensure icons are bound even if addTooltips didn't catch them)
        if (typeof bindTooltipElement === 'function') {
            const newTooltips = detailPanel.querySelectorAll('.tooltip-text, .tooltip-icon, [data-tooltip]');
            newTooltips.forEach(bindTooltipElement);
        }
    }


    // ----------------------------------------------------
    // Filter implementation

    // Ensure personaFiles is available for search
    if (typeof window.personaFiles === 'undefined') {
        window.personaFiles = personaSource;
    }

    // ----------------------------------------------------
    // Filter Implementation (Modal & Tags)
    // ----------------------------------------------------

    const filterModal = document.getElementById('filterModal');
    const filterOpenBtn = document.getElementById('filterOpenBtn');
    const filterCloseBtn = filterModal ? filterModal.querySelector('.filter-close-btn') : null;
    const filterSaveBtn = document.getElementById('filterSaveBtn');
    const filterResetBtn = document.getElementById('filterResetBtn');
    const activeFiltersContainer = document.getElementById('activeFilters');
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const filterBackdrop = filterModal ? filterModal.querySelector('.filter-backdrop') : null;

    // 필터 상태 캐싱을 위한 변수들
    let filterCache = {
        elements: new Set(),
        positions: new Set(),
        rarities: new Set(),
        grades: new Set()
    };

    // Modal Events
    if (filterOpenBtn && filterModal) {
        filterOpenBtn.addEventListener('click', () => {
            // Sync checkboxes from Cache
            checkboxes.forEach(cb => {
                const val = cb.value;
                const name = cb.name;
                if (name === 'element') cb.checked = filterCache.elements.has(val);
                else if (name === 'position') cb.checked = filterCache.positions.has(val);
                else if (name === 'rarity') cb.checked = filterCache.rarities.has(parseInt(val));
                else if (name === 'grade') cb.checked = filterCache.grades.has(val);
            });
            filterModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        const closeFilter = () => {
            filterModal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        if (filterCloseBtn) filterCloseBtn.addEventListener('click', closeFilter);
        if (filterBackdrop) filterBackdrop.addEventListener('click', closeFilter);

        // Reset (Clear checkboxes locally)
        if (filterResetBtn) {
            filterResetBtn.addEventListener('click', () => {
                checkboxes.forEach(cb => cb.checked = false);
            });
        }

        // Save
        if (filterSaveBtn) {
            filterSaveBtn.addEventListener('click', () => {
                applyFilters();
                closeFilter();
            });
        }
    }

    // Active Tags Renderer
    function renderActiveTags() {
        if (!activeFiltersContainer) return;
        activeFiltersContainer.innerHTML = '';

        const createTag = (text, type, value, iconSrc) => {
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            let iconHtml = '';
            if (iconSrc) iconHtml = `<img src="${iconSrc}" alt="" onerror="this.style.display='none'">`;

            const textHtml = text ? `<span>${text}</span>` : '';
            tag.innerHTML = `${iconHtml}${textHtml}<button class="filter-tag-close" aria-label="${window.t('common.remove', '제거')}">×</button>`;

            tag.querySelector('.filter-tag-close').addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubbling
                // Update Checkbox
                const cb = document.querySelector(`input[name="${type}"][value="${value}"]`);
                if (cb) cb.checked = false;
                // Re-apply
                applyFilters();
            });
            return tag;
        };

        filterCache.elements.forEach(val => {
            const label = window.t ? window.t(`elements.${val}`, val) : val;
            activeFiltersContainer.appendChild(createTag(label, 'element', val, `${window.SITE_BASEURL}/assets/img/persona/속성_${val}.png`));
        });
        filterCache.positions.forEach(val => {
            const label = window.t ? window.t(`positions.${val}`, val) : val;
            activeFiltersContainer.appendChild(createTag(label, 'position', val, `${window.SITE_BASEURL}/assets/img/persona/직업_${val}.png`));
        });
        filterCache.rarities.forEach(val => {
            // Rarity: Show text (e.g. ★5) to distinguish
            activeFiltersContainer.appendChild(createTag(`★${val}`, 'rarity', val, `${window.SITE_BASEURL}/assets/img/persona/star${val}.webp`));
        });
        filterCache.grades.forEach(val => {
            // Grade: Show only icon
            activeFiltersContainer.appendChild(createTag('', 'grade', val, `${window.SITE_BASEURL}/assets/img/persona/persona-grade${val}.webp`));
        });
    }

    // 성능 최적화된 필터 적용 함수
    function applyFilters() {
        if (!containers) return;

        // Read from checkboxes
        filterCache.elements = new Set(Array.from(document.querySelectorAll('input[name="element"]:checked')).map(cb => cb.value));
        filterCache.positions = new Set(Array.from(document.querySelectorAll('input[name="position"]:checked')).map(cb => cb.value));
        filterCache.rarities = new Set(Array.from(document.querySelectorAll('input[name="rarity"]:checked')).map(cb => parseInt(cb.value)));
        filterCache.grades = new Set(Array.from(document.querySelectorAll('input[name="grade"]:checked')).map(cb => cb.value));

        // Update Tags
        renderActiveTags();

        let visibleCount = 0;

        requestAnimationFrame(() => {
            containers.forEach(container => {
                const element = container.dataset.element;
                const position = container.dataset.position;
                const rarity = parseInt(container.dataset.rarity);
                const grade = container.dataset.grade;
                const personaName = container.dataset.name;

                const elementMatch = filterCache.elements.size === 0 || filterCache.elements.has(element);
                const positionMatch = filterCache.positions.size === 0 || filterCache.positions.has(position);
                const rarityMatch = filterCache.rarities.size === 0 || filterCache.rarities.has(rarity);
                const gradeMatch = filterCache.grades.size === 0 || filterCache.grades.has(grade);

                const isVisible = elementMatch && positionMatch && rarityMatch && gradeMatch;

                if (isVisible) {
                    container.style.position = 'relative';
                    container.style.visibility = 'visible';
                    container.style.height = 'auto';
                    visibleCount++;
                } else {
                    container.style.position = 'absolute';
                    container.style.visibility = 'hidden';
                    container.style.height = '0';
                }
            });

            // 카운트 업데이트
            const countText = window.t('filteredCount', '전체');
            const countUnit = window.t('countUnit', (currentLang === 'kr' ? '개' : ''));
            const countEl = document.getElementById('filteredCount');
            if (countEl) countEl.textContent = `${countText} ${visibleCount}${countUnit}`;
        });
    }

    // Initial Sort & Render
    updateSort('tier');

    // Sort Event Listener
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        updateSort(e.target.value);
    });

    function updateSort(mode) {
        let newSorted = [];
        const allIds = Object.keys(personaSource);

        if (mode === 'tier') {
            // Tier Order:
            // 1. Defined Order List (Strictly `window.personaOrder`) split into S/A/B/Others
            // 2. Everything else (Non-Order) -> Sorted by Rarity Desc, then Name

            const strictOrderList = (typeof window !== 'undefined' && window.personaOrder) ? window.personaOrder : [];
            const strictOrderSet = new Set(strictOrderList);

            const orderedS = [];
            const orderedA = [];
            const orderedB = [];
            const orderedC = [];
            const orderedOthers = [];
            const nonOrdered = [];

            const processed = new Set();

            // Process Strict Order List
            strictOrderList.forEach(name => {
                if (personaSource[name]) {
                    const tier = String(personaSource[name].tier || '').trim().toUpperCase();
                    if (tier === 'S') {
                        orderedS.push(name);
                        processed.add(name);
                    } else if (tier === 'A') {
                        orderedA.push(name);
                        processed.add(name);
                    } else if (tier === 'B') {
                        orderedB.push(name);
                        processed.add(name);
                    } else if (tier === 'C') {
                        orderedC.push(name);
                        processed.add(name);
                    } else {
                        // No explicit tier (or not S/A/B/C).
                        // Do NOT add to processed.
                        // Treat as Non-Ordered (will be picked up by next loop and sorted by Rarity).
                    }
                }
            });

            // Gather Non-Ordered (anything in source but NOT processed yet)
            allIds.forEach(name => {
                if (!processed.has(name)) {
                    nonOrdered.push(name);
                }
            });

            // Sort Non-Ordered by Rarity Descending
            nonOrdered.sort((a, b) => {
                const starA = parseInt(personaSource[a].star || 0, 10);
                const starB = parseInt(personaSource[b].star || 0, 10);
                if (starA !== starB) return starB - starA;
                return a.localeCompare(b);
            });

            newSorted = [...orderedS, ...orderedA, ...orderedB, ...orderedC, ...orderedOthers, ...nonOrdered];

        } else if (mode === 'rarity') {
            // Rarity Order: Star Descending, then Name
            newSorted = allIds.sort((a, b) => {
                const starA = parseInt(personaSource[a].star || 0, 10);
                const starB = parseInt(personaSource[b].star || 0, 10);
                if (starA !== starB) return starB - starA;
                return a.localeCompare(b);
            });

        } else if (mode === 'name') {
            // Name Order: By current lang name
            newSorted = allIds.sort((a, b) => {
                let nameA = a;
                let nameB = b;
                if (currentLang === 'en') {
                    nameA = personaSource[a].name_en || a;
                    nameB = personaSource[b].name_en || b;
                } else if (currentLang === 'jp') {
                    nameA = personaSource[a].name_jp || a;
                    nameB = personaSource[b].name_jp || b;
                }
                return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
            });
        }

        // Re-render
        sortedPersonas = newSorted;
        cardsContainer.innerHTML = ''; // Clear existing
        currentIndex = 0;
        if ('requestIdleCallback' in window) {
            requestIdleCallback(renderChunk, { timeout: 50 });
        } else {
            setTimeout(renderChunk, 0);
        }
    }

    // Initialize filtered count logic moved to end of render or handled within renderChunk updates? 
    // Note: renderChunk is async recursive.
    // We need to ensure filteredCount is updated. 
    // Existing renderChunk code updates `filteredCount`. 
    // 완료 시
    if (typeof addTooltips === 'function') {
        if ('requestIdleCallback' in window) requestIdleCallback(addTooltips, { timeout: 200 });
        else setTimeout(addTooltips, 200);
    }

    // Count 업데이트 (Explicitly set at end of render)
    const cText = window.t('filteredCount', '전체');
    const cUnit = window.t('countUnit', (currentLang === 'kr' ? '개' : ''));
    const cEl = document.getElementById('filteredCount');
    if (cEl) cEl.textContent = `${cText} ${sortedPersonas.length}${cUnit}`;

    // auto-select first if not done
    // Check if we haven't auto-selected yet
    const firstCard = document.querySelector('.persona-detail-container');
    if (firstCard && !window.hasInitialAutoSelected) {
        renderDetailInPanel(firstCard);
        firstCard.classList.add('selected');
        window.hasInitialAutoSelected = true;
    }


} // initializePageContent 함수 종료

// ----------------------------------------------------
// Global skill level selector (LV6 / LV7 / LV8 / ALL)
// ----------------------------------------------------

function setupGlobalSkillLevelSelector() {
    // const buttons = document.querySelectorAll('.skill-level-buttons-global .skill-level-btn');
    // if (!buttons.length) return; Remove this check to allow delegation for future elements

    function applyGlobalSkillLevel(level) {
        // console.log("Applying level", level);
        globalSkillLevel = level;
        const applyTo = (p) => {
            const original = p.dataset.originalText || p.textContent || '';
            if (level === null) {
                p.textContent = original;
            } else {
                p.textContent = filterDescByLevel(original, level);
            }
        };
        const uniqueParas = document.querySelectorAll('.persona-unique-skill-info p');
        const highlightParas = document.querySelectorAll('.persona-highlight-info p');
        uniqueParas.forEach(applyTo);
        highlightParas.forEach(applyTo);
        // 추천 스킬(description)에도 동일한 스킬 레벨 필터 적용
        const recommendedParas = document.querySelectorAll('.persona-recommended-skills .skill-description');
        recommendedParas.forEach((p) => {
            // type 이 "패시브" 인 추천 스킬은 스킬 레벨 토글의 영향을 받지 않는다.
            if (p.dataset.passive === 'true') return;
            if (p.dataset.passive === 'true') return;
            applyTo(p);
        });
        // 획득 스킬에도 동일한 필터 적용
        const innateParas = document.querySelectorAll('.persona-innate-skills .skill-description');
        innateParas.forEach(applyTo);

        if (typeof addTooltips === 'function') {
            try { addTooltips(); } catch (_) { /* noop */ }
        }
    }

    // Use Event Delegation for dynamic buttons
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.skill-level-buttons-global .skill-level-btn');
        if (!btn) return;

        e.preventDefault();
        const levelAttr = btn.dataset.level;
        // alert('Debug: Clicked ' + levelAttr);
        // console.log("Clicked level btn", levelAttr);
        const level = levelAttr === 'ALL' ? null : parseInt(levelAttr, 10);

        // Update ALL buttons on the page (since we might have multiple if cached/etc, but mainly the one in detail)
        // and also update state

        document.querySelectorAll('.skill-level-buttons-global .skill-level-btn').forEach(b => {
            const isActive = b.dataset.level === levelAttr;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        applyGlobalSkillLevel(level);
    });

    // 초기 상태(LV6) 전역 적용
    applyGlobalSkillLevel(0);
}
