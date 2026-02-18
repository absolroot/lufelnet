export function handlePersonaRouting() {
    const normalizeToken = (value) => String(value || '').trim();
    const safeDecode = (value) => {
        const text = normalizeToken(value);
        if (!text) return '';
        try {
            return decodeURIComponent(text);
        } catch (_) {
            return text;
        }
    };

    const resolvePathSlug = () => {
        const path = String(window.location.pathname || '');
        const match = path.match(/^\/(?:kr|en|jp|cn)\/persona\/([^/]+)\/?$/i);
        if (!match) return '';
        return normalizeToken(safeDecode(match[1]));
    };

    const resolveFromSlugMap = (token) => {
        const safeToken = normalizeToken(token);
        if (!safeToken) return '';
        const slugMap = (window.__PERSONA_SLUG_MAP && typeof window.__PERSONA_SLUG_MAP === 'object')
            ? window.__PERSONA_SLUG_MAP
            : null;
        if (!slugMap) return '';

        if (Object.prototype.hasOwnProperty.call(slugMap, safeToken)) {
            return safeToken;
        }

        const lowered = safeToken.toLowerCase();
        const keys = Object.keys(slugMap);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const entry = slugMap[key];
            if (!entry || typeof entry !== 'object') continue;
            const slug = String(entry.slug || '').toLowerCase();
            if (slug && slug === lowered) return key;
            if (Array.isArray(entry.aliases)) {
                const hasAlias = entry.aliases.some((alias) => String(alias || '').toLowerCase() === lowered);
                if (hasAlias) return key;
            }
        }
        return '';
    };

    const resolveFromPersonaFiles = (token) => {
        const safeToken = normalizeToken(token);
        if (!safeToken) return '';
        const source = (window.personaFiles && typeof window.personaFiles === 'object')
            ? window.personaFiles
            : null;
        if (!source) return '';
        if (Object.prototype.hasOwnProperty.call(source, safeToken)) return safeToken;

        const lowered = safeToken.toLowerCase();
        const keys = Object.keys(source);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const persona = source[key] || {};
            if (key.toLowerCase() === lowered) return key;
            if (String(persona.name_en || '').toLowerCase() === lowered) return key;
            if (String(persona.name_jp || '').toLowerCase() === lowered) return key;
        }
        return '';
    };

    const resolveTargetPersonaKey = () => {
        const urlParams = new URLSearchParams(window.location.search || '');
        const seoHint = (window.__SEO_CONTEXT_HINT__ && typeof window.__SEO_CONTEXT_HINT__ === 'object')
            ? window.__SEO_CONTEXT_HINT__
            : null;
        const seoEntity = (seoHint && seoHint.domain === 'persona') ? normalizeToken(seoHint.entityKey || '') : '';

        const candidates = [
            normalizeToken(urlParams.get('persona')),
            normalizeToken(urlParams.get('name')),
            resolvePathSlug(),
            seoEntity,
            normalizeToken(window.__PERSONA_DEFAULT)
        ].filter(Boolean);

        for (let i = 0; i < candidates.length; i++) {
            const raw = candidates[i];
            const decoded = normalizeToken(safeDecode(raw));

            const bySlugMap = resolveFromSlugMap(decoded);
            if (bySlugMap) return bySlugMap;

            const byFiles = resolveFromPersonaFiles(decoded);
            if (byFiles) return byFiles;
        }

        return '';
    };

    const findCardByName = (targetName) => {
        if (!targetName) return null;
        const cards = document.querySelectorAll('.persona-detail-container');
        for (let i = 0; i < cards.length; i++) {
            if (String(cards[i].dataset.name || '').trim() === targetName) {
                return cards[i];
            }
        }
        return null;
    };

    const selectCard = (targetName) => {
        const cardContainer = findCardByName(targetName);
        if (!cardContainer) return false;

        const clickTarget = cardContainer.querySelector('.persona-card-section')
            || cardContainer.querySelector('.card')
            || cardContainer;

        cardContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clickTarget.click();
        window.__LAST_ROUTED_PERSONA__ = targetName;
        return true;
    };

    const fallbackSelectFirst = () => {
        if (document.querySelector('.persona-detail-container.selected')) return;
        const first = document.querySelector('.persona-detail-container');
        if (!first) return;
        const clickTarget = first.querySelector('.persona-card-section')
            || first.querySelector('.card')
            || first;
        clickTarget.click();
    };

    const targetName = resolveTargetPersonaKey();
    if (!targetName) return;

    // Prevent default first-card auto-select for detail routing while retries are running.
    window.hasInitialAutoSelected = true;

    if (window.__personaRoutingTask && typeof window.__personaRoutingTask.cancel === 'function') {
        window.__personaRoutingTask.cancel();
    }

    if (selectCard(targetName)) return;

    let attempts = 0;
    const maxAttempts = 80; // about 8s at 100ms interval
    let finished = false;
    let intervalId = null;
    let observer = null;

    const cleanup = () => {
        if (intervalId) clearInterval(intervalId);
        if (observer) observer.disconnect();
    };

    const finish = (selected) => {
        if (finished) return;
        finished = true;
        cleanup();
        if (!selected) fallbackSelectFirst();
    };

    const trySelect = () => {
        if (selectCard(targetName)) {
            finish(true);
            return true;
        }
        attempts += 1;
        if (attempts >= maxAttempts) {
            finish(false);
        }
        return false;
    };

    intervalId = setInterval(trySelect, 100);

    const cardsRoot = document.getElementById('personaCards') || document.body;
    observer = new MutationObserver(() => {
        trySelect();
    });
    observer.observe(cardsRoot, { childList: true, subtree: true });

    window.__personaRoutingTask = {
        cancel: () => {
            if (finished) return;
            finished = true;
            cleanup();
        }
    };
}
