(function () {
    const config = {
        enabled: false,
        containerSelectors: [
            '.logo-container',
            '.mobile-logo-container',
            '.maps-logo-container',
            '.mobile-breadcrumb-logo'
        ],
        markAsset: '/assets/img/logo/aprilfool_logo.png',
        textAsset: '/assets/img/logo/aprilfool_logotext.png',
        roleAttribute: 'data-april-fools-role',
        originalSrcAttribute: 'data-april-fools-original-src',
        activeAttribute: 'data-april-fools-active',
        popularCardAttribute: 'data-april-fools-popular-card',
        popularHiddenAttribute: 'data-april-fools-popular-hidden',
        tierRowAttribute: 'data-april-fools-tier-row',
        tierStyleId: 'april-fools-tier-style'
    };

    const roleValueMap = {
        mark: 'logo-mark',
        text: 'logo-text'
    };
    const aprilFoolsCharacterCards = new Map([
        ['\ub80c', '/assets/img/logo/aprilfool/\ub80c.png'],
        ['\ub9ac\ucf54\u00b7\ub9e4\ud654', '/assets/img/logo/aprilfool/\ub9ac\ucf54\u00b7\ub9e4\ud654.png'],
        ['\ub9c8\ucf54\ud1a0', '/assets/img/logo/aprilfool/\ub9c8\ucf54\ud1a0.png'],
        ['\uc720\uc2a4\ucf00', '/assets/img/logo/aprilfool/\uc720\uc2a4\ucf00.png'],
        ['\uc720\ud0a4 \ub9c8\ucf54\ud1a0', '/assets/img/logo/aprilfool/\uc720\ud0a4 \ub9c8\ucf54\ud1a0.png'],
        ['\uc774\uce58\uace0', '/assets/img/logo/aprilfool/\uc774\uce58\uace0.png'],
        ['\uce74\ud0c0\uc57c\ub9c8', '/assets/img/logo/aprilfool/\uce74\ud0c0\uc57c\ub9c8.png'],
        ['\ud558\ub8e8', '/assets/img/logo/aprilfool/\ud558\ub8e8.png'],
        ['\ud6c4\ud0c0\ubc14', '/assets/img/logo/aprilfool/\ud6c4\ud0c0\ubc14.png']
    ]);

    let observer = null;
    let scheduledRoot = null;
    let applyScheduled = false;

    function getBaseUrl() {
        if (typeof BASE_URL === 'string') {
            return BASE_URL;
        }

        if (typeof window !== 'undefined' && typeof window.BASE_URL === 'string') {
            return window.BASE_URL;
        }

        return '';
    }

    function resolveAsset(path) {
        return `${getBaseUrl()}${path}`;
    }

    function getCharacterCardSrc(characterName, fallbackSrc) {
        const safeFallback = typeof fallbackSrc === 'string' ? fallbackSrc : '';
        if (!config.enabled) {
            return safeFallback;
        }

        const normalizedName = String(characterName || '').trim();
        const assetPath = aprilFoolsCharacterCards.get(normalizedName);
        if (!assetPath) {
            return safeFallback;
        }

        return resolveAsset(assetPath);
    }

    function getCurrentLanguage() {
        try {
            const path = String((typeof window !== 'undefined' && window.location && window.location.pathname) || '');
            const pathMatch = path.match(/^\/(kr|en|jp|cn)(\/|$)/i);
            if (pathMatch) {
                return String(pathMatch[1]).toLowerCase();
            }

            const params = new URLSearchParams((typeof window !== 'undefined' && window.location && window.location.search) || '');
            const queryLang = String(params.get('lang') || '').toLowerCase();
            if (['kr', 'en', 'jp', 'cn'].includes(queryLang)) {
                return queryLang;
            }

            const stored = String(localStorage.getItem('preferredLanguage') || '').toLowerCase();
            if (['kr', 'en', 'jp', 'cn'].includes(stored)) {
                return stored;
            }
        } catch (_) { }

        return 'kr';
    }

    function getHomeSiteTitleText(lang) {
        const texts = {
            kr: 'P5X \ucc60\ud0c0\ub137',
            en: 'TabbyNet',
            jp: '\u8336\u30c8\u30e9\u30cd\u30c3\u30c8'
        };

        return texts[lang] || texts.kr;
    }

    function getPopularCharacterCard(rawLang) {
        if (!config.enabled) {
            return null;
        }

        const lang = ['en', 'jp'].includes(String(rawLang || '').toLowerCase())
            ? String(rawLang).toLowerCase()
            : 'kr';
        const queries = {
            kr: '\ub9cc\uc6b0\uc808',
            en: 'April Fools',
            jp: '\u30a8\u30a4\u30d7\u30ea\u30eb\u30d5\u30fc\u30eb'
        };
        const names = {
            kr: '\ucc60\ud0c0',
            en: 'Orange Tabby',
            jp: '\u8336\u30c8\u30e9'
        };
        const hl = {
            kr: 'ko',
            en: 'en',
            jp: 'ja'
        };

        return {
            type: 'april-fools-external',
            name: '__APRIL_FOOLS_CHATAI__',
            label: names[lang] || names.kr,
            badge: 'HOT',
            href: `https://www.google.com/search?hl=${hl[lang] || hl.kr}&q=${encodeURIComponent(queries[lang] || queries.kr)}`,
            target: '_blank',
            rel: 'noopener noreferrer',
            imageSrc: resolveAsset('/assets/img/logo/aprilfool_Chatai.webp'),
            imageAlt: names[lang] || names.kr
        };
    }

    function getPopularCharactersContainer(root) {
        if (typeof document === 'undefined') {
            return null;
        }

        const scope = root && typeof root.querySelector === 'function' ? root : document;
        return (scope.getElementById && scope.getElementById('popular-character-cards'))
            || scope.querySelector('#popular-character-cards')
            || document.getElementById('popular-character-cards');
    }

    function getPopularCharactersMaxCount(container) {
        const popularRoot = (container && container.closest && container.closest('.popular-content'))
            || (typeof document !== 'undefined' ? document.querySelector('.popular-content') : null);
        const raw = popularRoot ? popularRoot.getAttribute('data-max-count') : null;
        const parsed = Number(raw);
        return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 10;
    }

    function createPopularCharacterCardElement(rawLang) {
        const cardData = getPopularCharacterCard(rawLang);
        if (!cardData || typeof document === 'undefined') {
            return null;
        }

        const card = document.createElement('div');
        card.className = 'character-card hot';
        card.setAttribute(config.popularCardAttribute, 'true');

        const link = document.createElement('a');
        link.href = cardData.href;
        link.target = cardData.target || '_blank';
        link.rel = cardData.rel || 'noopener noreferrer';
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';

        const imgWrap = document.createElement('div');
        imgWrap.className = 'character-card-img';

        const img = document.createElement('img');
        img.src = cardData.imageSrc;
        img.alt = cardData.imageAlt || cardData.label || cardData.name;
        img.width = 98;
        img.height = 140;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.setAttribute('fetchpriority', 'low');
        img.draggable = false;
        imgWrap.appendChild(img);
        link.appendChild(imgWrap);

        const textWrap = document.createElement('div');
        textWrap.className = 'character-card-text';
        const p = document.createElement('p');
        p.textContent = cardData.label || cardData.name;
        textWrap.appendChild(p);

        card.appendChild(link);
        card.appendChild(textWrap);
        return card;
    }

    function updatePopularCharacterCardElement(card, rawLang) {
        const cardData = getPopularCharacterCard(rawLang);
        if (!cardData || !isElement(card)) {
            return;
        }

        card.className = 'character-card hot';
        card.setAttribute(config.popularCardAttribute, 'true');

        const link = card.querySelector('a');
        const img = card.querySelector('img');
        const label = card.querySelector('.character-card-text p');
        if (!link || !img || !label) {
            return;
        }

        if (link.href !== cardData.href) {
            link.href = cardData.href;
        }
        if (link.target !== (cardData.target || '_blank')) {
            link.target = cardData.target || '_blank';
        }
        if (link.rel !== (cardData.rel || 'noopener noreferrer')) {
            link.rel = cardData.rel || 'noopener noreferrer';
        }
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';

        const targetSrc = cardData.imageSrc;
        if (img.getAttribute('src') !== targetSrc) {
            img.setAttribute('src', targetSrc);
        }
        const targetAlt = cardData.imageAlt || cardData.label || cardData.name;
        if (img.alt !== targetAlt) {
            img.alt = targetAlt;
        }
        if (img.width !== 98) img.width = 98;
        if (img.height !== 140) img.height = 140;
        if (img.loading !== 'lazy') img.loading = 'lazy';
        if (img.decoding !== 'async') img.decoding = 'async';
        if (img.getAttribute('fetchpriority') !== 'low') img.setAttribute('fetchpriority', 'low');
        img.draggable = false;

        const targetLabel = cardData.label || cardData.name;
        if (label.textContent !== targetLabel) {
            label.textContent = targetLabel;
        }
    }

    function isPopularCharacterCardSynced(card, rawLang) {
        const cardData = getPopularCharacterCard(rawLang);
        if (!cardData || !isElement(card)) {
            return false;
        }

        const link = card.querySelector('a');
        const img = card.querySelector('img');
        const label = card.querySelector('.character-card-text p');
        if (!link || !img || !label) {
            return false;
        }

        return link.href === cardData.href
            && link.target === (cardData.target || '_blank')
            && link.rel === (cardData.rel || 'noopener noreferrer')
            && img.getAttribute('src') === cardData.imageSrc
            && img.alt === (cardData.imageAlt || cardData.label || cardData.name)
            && label.textContent === (cardData.label || cardData.name);
    }

    function applyPopularCharacterCard(root) {
        if (!config.enabled || typeof document === 'undefined') {
            return;
        }

        const container = getPopularCharactersContainer(root);
        if (!container) {
            return;
        }

        let card = container.querySelector(`[${config.popularCardAttribute}="true"]`);
        if (card) {
            if (!isPopularCharacterCardSynced(card, getCurrentLanguage())) {
                updatePopularCharacterCardElement(card, getCurrentLanguage());
            }
        } else {
            card = createPopularCharacterCardElement(getCurrentLanguage());
            if (!card) {
                return;
            }
            container.insertBefore(card, container.firstChild);
        }

        if (container.firstElementChild !== card) {
            container.insertBefore(card, container.firstChild);
        }

        const maxCount = getPopularCharactersMaxCount(container);
        const children = Array.from(container.children).filter(isElement);
        children.forEach((child, index) => {
            if (child === card || index < maxCount) {
                if (child.hasAttribute(config.popularHiddenAttribute)) {
                    child.style.removeProperty('display');
                    child.removeAttribute(config.popularHiddenAttribute);
                }
                return;
            }

            if (child.getAttribute(config.popularHiddenAttribute) !== 'true' || child.style.display !== 'none') {
                child.style.display = 'none';
                child.setAttribute(config.popularHiddenAttribute, 'true');
            }
        });
    }

    function restorePopularCharacterCard(root) {
        if (typeof document === 'undefined') {
            return;
        }

        const container = getPopularCharactersContainer(root);
        if (!container) {
            return;
        }

        const customCard = container.querySelector(`[${config.popularCardAttribute}="true"]`);
        if (customCard) {
            customCard.remove();
        }

        container.querySelectorAll(`[${config.popularHiddenAttribute}="true"]`).forEach((element) => {
            element.style.removeProperty('display');
            element.removeAttribute(config.popularHiddenAttribute);
        });
    }

    function getTierSearchHref(rawLang) {
        const lang = ['en', 'jp'].includes(String(rawLang || '').toLowerCase())
            ? String(rawLang).toLowerCase()
            : 'kr';
        const queries = {
            kr: '\ub9cc\uc6b0\uc808',
            en: 'April Fools',
            jp: '\u30a8\u30a4\u30d7\u30ea\u30eb\u30d5\u30fc\u30eb'
        };
        const hl = {
            kr: 'ko',
            en: 'en',
            jp: 'ja'
        };

        return `https://www.google.com/search?hl=${hl[lang] || hl.kr}&q=${encodeURIComponent(queries[lang] || queries.kr)}`;
    }

    function isTierListPage() {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return false;
        }

        const path = String((window.location && window.location.pathname) || '').toLowerCase();
        if (/\/tier-maker\/?$/.test(path)) {
            return false;
        }

        return /\/tier\/?$/.test(path) || document.body.classList.contains('tier-list-mode');
    }

    function getTierContainer(root) {
        if (!isTierListPage()) {
            return null;
        }

        const scope = root && typeof root.querySelector === 'function' ? root : document;
        return scope.querySelector('.position-tiers-container') || document.querySelector('.position-tiers-container');
    }

    function ensureTierStyle() {
        if (typeof document === 'undefined' || document.getElementById(config.tierStyleId)) {
            return;
        }

        const style = document.createElement('style');
        style.id = config.tierStyleId;
        style.textContent = `
            .tier-label-cell[${config.tierRowAttribute}="label"] {
                background:
                    radial-gradient(circle at 50% 18%, rgba(255, 253, 214, 0.95), rgba(255, 253, 214, 0) 42%),
                    linear-gradient(180deg, #ffe8a3 0%, #ffb43f 45%, #ef6b11 100%);
                box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2);
            }

            .tier-label-cell[${config.tierRowAttribute}="label"] span {
                color: rgba(65, 22, 0, 0.92);
                font-weight: 800;
                letter-spacing: 0.08em;
                text-shadow: 0 1px 0 rgba(255,255,255,0.35);
            }

            .position-cell[${config.tierRowAttribute}="cell"] {
                background:
                    radial-gradient(circle at top right, rgba(255, 201, 92, 0.18), rgba(255, 201, 92, 0) 40%),
                    linear-gradient(180deg, rgba(57, 36, 14, 0.98), rgba(31, 20, 8, 0.98));
                justify-content: center;
                align-items: center;
            }

            .settings-cell[${config.tierRowAttribute}="settings"] {
                background:
                    linear-gradient(180deg, rgba(57, 36, 14, 0.98), rgba(31, 20, 8, 0.98));
            }

            .april-fools-tier-chatai-link {
                display: block;
                width: 100%;
                line-height: 0;
                text-decoration: none;
            }

            .april-fools-tier-chatai {
                width: 100%;
                aspect-ratio: 1;
                object-fit: cover;
                object-position: center 24%;
                border-radius: 4px;
                box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
            }
        `;

        document.head.appendChild(style);
    }

    function getTierTemplateRow(container) {
        if (!isElement(container)) {
            return null;
        }

        const labelCell = Array.from(container.querySelectorAll('.tier-label-cell')).find((cell) => {
            const label = cell.querySelector('span');
            return label && label.textContent.trim() === 'T0';
        });

        if (!labelCell) {
            return null;
        }

        const rowElements = [labelCell];
        let current = labelCell.nextElementSibling;
        while (current && !current.classList.contains('tier-label-cell')) {
            rowElements.push(current);
            current = current.nextElementSibling;
        }

        return {
            labelCell,
            rowElements,
            positionCells: rowElements.filter((element) => element.classList.contains('position-cell')),
            settingsCell: rowElements.find((element) => element.classList.contains('settings-cell')) || null
        };
    }

    function createTierGodRow(container) {
        const template = getTierTemplateRow(container);
        if (!template) {
            return null;
        }

        const rowElements = [];
        const labelCell = document.createElement('div');
        labelCell.className = 'tier-label-cell';
        labelCell.setAttribute(config.tierRowAttribute, 'label');
        labelCell.style.setProperty('--color', '#ffb43f');
        labelCell.innerHTML = '<span>GOD</span>';
        rowElements.push(labelCell);

        const tierHref = getTierSearchHref(getCurrentLanguage());
        template.positionCells.forEach((cell) => {
            const positionCell = document.createElement('div');
            positionCell.className = 'position-cell';
            positionCell.setAttribute(config.tierRowAttribute, 'cell');
            if (cell.dataset && cell.dataset.position) {
                positionCell.dataset.position = cell.dataset.position;
            }

            const link = document.createElement('a');
            link.className = 'character-detail-anchor april-fools-tier-chatai-link';
            link.href = tierHref;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            const img = document.createElement('img');
            img.className = 'character-img star5 clickable-character april-fools-tier-chatai';
            img.src = resolveAsset('/assets/img/logo/aprilfool_Chatai.webp');
            img.alt = getPopularCharacterCard(getCurrentLanguage()).label;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.draggable = false;

            link.appendChild(img);
            positionCell.appendChild(link);
            rowElements.push(positionCell);
        });

        const settingsCell = document.createElement('div');
        settingsCell.className = template.settingsCell ? template.settingsCell.className : 'settings-cell';
        settingsCell.setAttribute(config.tierRowAttribute, 'settings');
        rowElements.push(settingsCell);

        return {
            rowElements,
            beforeNode: template.labelCell
        };
    }

    function clearTierGodRows(container) {
        if (!isElement(container)) {
            return;
        }

        Array.from(container.querySelectorAll(`[${config.tierRowAttribute}]`)).forEach((element) => {
            element.remove();
        });
    }

    function applyTierGodRow(root) {
        if (!config.enabled || typeof document === 'undefined') {
            return;
        }

        const container = getTierContainer(root);
        if (!container) {
            return;
        }

        ensureTierStyle();
        clearTierGodRows(container);

        const row = createTierGodRow(container);
        if (!row) {
            return;
        }

        row.rowElements.forEach((element) => {
            container.insertBefore(element, row.beforeNode);
        });
    }

    function restoreTierGodRow(root) {
        if (typeof document === 'undefined') {
            return;
        }

        const container = getTierContainer(root) || document.querySelector('.position-tiers-container');
        if (container) {
            clearTierGodRows(container);
        }

        const style = document.getElementById(config.tierStyleId);
        if (style) {
            style.remove();
        }
    }

    function applyHomeSiteTitle(root) {
        if (!config.enabled || typeof document === 'undefined') {
            return;
        }

        const scope = root && typeof root.querySelector === 'function' ? root : document;
        const siteTitle = (scope.getElementById && scope.getElementById('site-title'))
            || scope.querySelector('#site-title');
        const homeCarousel = (scope.getElementById && scope.getElementById('home-carousel-root'))
            || scope.querySelector('#home-carousel-root')
            || document.getElementById('home-carousel-root');

        if (!siteTitle || !homeCarousel) {
            return;
        }

        siteTitle.textContent = getHomeSiteTitleText(getCurrentLanguage());
    }

    function scheduleHomeSiteTitleApply() {
        if (typeof document === 'undefined') {
            return;
        }

        const run = function () {
            applyHomeSiteTitle(document);
        };

        run();

        if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(run);
        }

        setTimeout(run, 0);
        setTimeout(run, 200);
        setTimeout(run, 800);
    }

    function getHomeCarouselSlide(rawLang) {
        if (!config.enabled) {
            return null;
        }

        const lang = ['en', 'jp'].includes(String(rawLang || '').toLowerCase())
            ? String(rawLang).toLowerCase()
            : 'kr';
        const copyByLang = {
            kr: {
                name: '통조림을 내놔라',
                characterName: '챠타'
            },
            en: {
                name: 'Hand Over the Canned Food',
                characterName: 'Orange Tabby'
            },
            jp: {
                name: '缶詰をよこせ',
                characterName: '茶トラ'
            }
        };
        const copy = copyByLang[lang] || copyByLang.kr;
        const startUTC = new Date(Date.UTC(2026, 2, 31, 15, 0, 0));
        const endUTC = new Date(Date.UTC(2026, 3, 1, 15, 0, 0));

        return {
            kind: 'custom',
            name: copy.name,
            subtitle: '',
            body: '',
            customFiveStarText: copy.characterName,
            customColor: '#de7717',
            customImage: resolveAsset('/assets/img/logo/aprilfool_Chatai.webp'),
            customBgImage: null,
            customBgOffset: null,
            customBgOffsetMobile: null,
            customImgOffset: null,
            customLink: '',
            customLinkTarget: '_self',
            order: null,
            startUTC,
            endUTC,
            __aprilFools: true
        };
    }

    function isElement(value) {
        return typeof Element !== 'undefined' && value instanceof Element;
    }

    function getContainers(root) {
        if (!root) {
            return [];
        }

        const containers = [];

        for (const selector of config.containerSelectors) {
            if (isElement(root) && root.matches(selector)) {
                containers.push(root);
            }

            if (typeof root.querySelectorAll === 'function') {
                containers.push(...root.querySelectorAll(selector));
            }
        }

        return containers;
    }

    function getContainerImages(container) {
        if (!isElement(container)) {
            return { markImage: null, textImage: null };
        }

        const images = Array.from(container.querySelectorAll('img'));
        if (images.length === 0) {
            return { markImage: null, textImage: null };
        }

        const textImage = images.find((img) => /logo-text/i.test(img.alt || '')) || images[1] || null;
        const markImage = images.find((img) => img !== textImage) || images[0] || null;

        return { markImage, textImage };
    }

    function rememberOriginalSrc(image) {
        if (!isElement(image) || image.tagName !== 'IMG' || image.hasAttribute(config.originalSrcAttribute)) {
            return;
        }

        const currentSrc = image.getAttribute('src');
        if (currentSrc) {
            image.setAttribute(config.originalSrcAttribute, currentSrc);
        }
    }

    function swapLogoImage(image, role) {
        if (!isElement(image) || image.tagName !== 'IMG') {
            return;
        }

        const resolvedRole = roleValueMap[role];
        const targetSrc = resolveAsset(role === 'mark' ? config.markAsset : config.textAsset);
        if (!resolvedRole || !targetSrc) {
            return;
        }

        rememberOriginalSrc(image);
        image.setAttribute(config.roleAttribute, resolvedRole);
        if (image.getAttribute('src') !== targetSrc) {
            image.setAttribute('src', targetSrc);
        }
    }

    function restoreLogoImage(image) {
        if (!isElement(image) || image.tagName !== 'IMG') {
            return;
        }

        const originalSrc = image.getAttribute(config.originalSrcAttribute);
        if (originalSrc) {
            image.setAttribute('src', originalSrc);
        }

        image.removeAttribute(config.roleAttribute);
        image.removeAttribute(config.originalSrcAttribute);
    }

    function applyToContainer(container) {
        const { markImage, textImage } = getContainerImages(container);
        if (!markImage || !textImage) {
            return;
        }

        swapLogoImage(markImage, 'mark');
        swapLogoImage(textImage, 'text');
    }

    function restoreContainer(container) {
        const { markImage, textImage } = getContainerImages(container);
        restoreLogoImage(markImage);
        restoreLogoImage(textImage);
    }

    function setDocumentActiveState(isActive) {
        if (typeof document === 'undefined' || !document.documentElement) {
            return;
        }

        if (isActive) {
            document.documentElement.setAttribute(config.activeAttribute, 'true');
            return;
        }

        document.documentElement.removeAttribute(config.activeAttribute);
    }

    function apply(root) {
        if (!config.enabled || typeof document === 'undefined') {
            return;
        }

        const targetRoot = root || document;
        getContainers(targetRoot).forEach(applyToContainer);
        applyHomeSiteTitle(targetRoot);
        applyPopularCharacterCard(targetRoot);
        applyTierGodRow(targetRoot);
        setDocumentActiveState(true);
    }

    function restore(root) {
        if (typeof document === 'undefined') {
            return;
        }

        const targetRoot = root || document;
        getContainers(targetRoot).forEach(restoreContainer);
        restorePopularCharacterCard(targetRoot);
        restoreTierGodRow(targetRoot);
        setDocumentActiveState(false);
    }

    function scheduleApply(root) {
        if (!config.enabled) {
            return;
        }

        if (root) {
            scheduledRoot = root;
        }

        if (applyScheduled) {
            return;
        }

        applyScheduled = true;

        const flush = function () {
            applyScheduled = false;
            const rootToApply = scheduledRoot || document;
            scheduledRoot = null;
            apply(rootToApply);
        };

        if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(flush);
            return;
        }

        setTimeout(flush, 0);
    }

    function startObserver() {
        if (!config.enabled || observer || typeof MutationObserver === 'undefined' || typeof document === 'undefined' || !document.body) {
            return;
        }

        observer = new MutationObserver((mutations) => {
            let shouldReapply = false;

            for (const mutation of mutations) {
                if (mutation.type !== 'childList') {
                    continue;
                }

                if (isElement(mutation.target) && (
                    mutation.target.id === 'popular-character-cards'
                    || mutation.target.closest('#popular-character-cards')
                    || mutation.target.classList.contains('position-tiers-container')
                    || mutation.target.closest('.position-tiers-container')
                )) {
                    shouldReapply = true;
                    break;
                }

                if (mutation.addedNodes.length === 0) {
                    continue;
                }

                for (const node of mutation.addedNodes) {
                    if (!isElement(node)) {
                        continue;
                    }

                    const hasTarget = config.containerSelectors.some((selector) => {
                        if (typeof node.matches === 'function' && node.matches(selector)) {
                            return true;
                        }

                        return typeof node.querySelector === 'function' && Boolean(node.querySelector(selector));
                    }) || (typeof node.matches === 'function' && node.matches('#popular-character-cards'))
                        || (typeof node.querySelector === 'function' && Boolean(node.querySelector('#popular-character-cards')))
                        || Boolean(node.closest && node.closest('#popular-character-cards'))
                        || (typeof node.matches === 'function' && node.matches('.position-tiers-container, .tier-label-cell, .position-cell'))
                        || (typeof node.querySelector === 'function' && Boolean(node.querySelector('.position-tiers-container, .tier-label-cell, .position-cell')))
                        || Boolean(node.closest && node.closest('.position-tiers-container'));

                    if (hasTarget) {
                        shouldReapply = true;
                        break;
                    }
                }

                if (shouldReapply) {
                    break;
                }
            }

            if (shouldReapply) {
                scheduleApply(document);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function stopObserver() {
        if (!observer) {
            return;
        }

        observer.disconnect();
        observer = null;
    }

    function init() {
        if (!config.enabled) {
            restore(document);
            stopObserver();
            return;
        }

        apply(document);
        scheduleHomeSiteTitleApply();
        startObserver();
        setTimeout(() => applyPopularCharacterCard(document), 0);
        setTimeout(() => applyPopularCharacterCard(document), 200);
        setTimeout(() => applyPopularCharacterCard(document), 800);
        setTimeout(() => applyTierGodRow(document), 0);
        setTimeout(() => applyTierGodRow(document), 200);
        setTimeout(() => applyTierGodRow(document), 800);
    }

    function setEnabled(nextEnabled) {
        config.enabled = Boolean(nextEnabled);
        if (config.enabled) {
            init();
            return;
        }

        stopObserver();
        restore(document);
    }

    window.LufelAprilFools = {
        config,
        apply,
        applyHomeSiteTitle,
        getCharacterCardSrc,
        getHomeCarouselSlide,
        getPopularCharacterCard,
        applyTierGodRow,
        init,
        restore,
        scheduleHomeSiteTitleApply,
        setEnabled
    };

    if (typeof document === 'undefined') {
        return;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
        return;
    }

    init();
})();
