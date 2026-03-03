/**
 * Guides Related Articles
 * Injects related guide recommendations below article content.
 */
(function () {
    'use strict';

    const RELATED_LIMIT = 5;
    const VIEWED_SESSION_KEY = 'guidesViewedSessionV1';
    const MAX_HISTORY = 200;

    let guidesListCache = null;
    let guidesListPromise = null;

    function hasGuides() {
        return typeof Guides !== 'undefined' && Guides && typeof Guides === 'object';
    }

    function normalizeGuideId(value) {
        return String(value || '').trim();
    }

    function sanitizeClassToken(value) {
        return String(value || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getCurrentLang() {
        if (hasGuides() && typeof Guides.normalizeLang === 'function') {
            return Guides.normalizeLang(Guides.currentLang);
        }
        return 'kr';
    }

    function getI18nText(key, fallback) {
        if (hasGuides() && typeof Guides.getI18nText === 'function') {
            return Guides.getI18nText(key, fallback);
        }
        return fallback || key;
    }

    function getGuideTitle(guide, lang) {
        const untitled = getI18nText('untitled', 'Untitled');
        return guide?.titles?.[lang] || guide?.titles?.kr || guide?.title || untitled;
    }

    function getGuideUrl(guide, lang) {
        if (hasGuides() && typeof Guides.getGuideUrl === 'function') {
            return Guides.getGuideUrl(guide, lang);
        }
        const id = encodeURIComponent(normalizeGuideId(guide?.id));
        if (!id) return '/kr/article/';
        return `/${lang}/article/${id}/`;
    }

    function getCategoryLabel(guide, lang) {
        const categoryId = String(guide?.category || '');
        if (!categoryId) return '';
        if (hasGuides() && typeof Guides.getCategoryLabel === 'function') {
            return Guides.getCategoryLabel(categoryId, lang);
        }
        return categoryId;
    }

    function formatGuideDate(guide, lang) {
        const dateValue = String(guide?.date || '');
        if (!dateValue) return '';
        if (hasGuides() && typeof Guides.formatDate === 'function') {
            return Guides.formatDate(dateValue, lang);
        }
        return dateValue;
    }

    function readViewedGuides() {
        try {
            const raw = window.sessionStorage.getItem(VIEWED_SESSION_KEY);
            if (!raw) return [];

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];

            const map = new Map();
            for (const entry of parsed) {
                const id = normalizeGuideId(entry?.id);
                if (!id) continue;
                const ts = Number(entry?.ts);
                map.set(id, Number.isFinite(ts) ? ts : 0);
            }

            return Array.from(map.entries())
                .map(([id, ts]) => ({ id, ts }))
                .sort((a, b) => a.ts - b.ts);
        } catch (_) {
            return [];
        }
    }

    function writeViewedGuides(entries) {
        try {
            const normalized = Array.isArray(entries) ? entries : [];
            const trimmed = normalized.slice(-MAX_HISTORY);
            window.sessionStorage.setItem(VIEWED_SESSION_KEY, JSON.stringify(trimmed));
        } catch (_) {
            // Ignore storage write failures
        }
    }

    function trackViewedGuide(guideId) {
        const id = normalizeGuideId(guideId);
        if (!id) return;

        const now = Date.now();
        const current = readViewedGuides().filter((entry) => entry.id !== id);
        current.push({ id, ts: now });
        writeViewedGuides(current);
    }

    function shuffleArray(items) {
        const result = items.slice();
        for (let i = result.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = result[i];
            result[i] = result[j];
            result[j] = tmp;
        }
        return result;
    }

    async function loadGuidesList() {
        if (Array.isArray(guidesListCache)) {
            return guidesListCache;
        }

        if (guidesListPromise) {
            return guidesListPromise;
        }

        const basePath = hasGuides() && typeof Guides.basePath === 'string'
            ? Guides.basePath
            : '/apps/guides/data';
        const url = `${basePath}/guides-list.json?v=${Date.now()}`;

        guidesListPromise = fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load guides list (${response.status})`);
                }
                return response.json();
            })
            .then((list) => {
                if (!Array.isArray(list)) {
                    throw new Error('guides-list.json is not an array.');
                }
                guidesListCache = list;
                return list;
            })
            .catch((error) => {
                guidesListPromise = null;
                throw error;
            });

        return guidesListPromise;
    }

    function buildRecommendations(currentGuide, list) {
        const currentId = normalizeGuideId(currentGuide?.id);
        if (!currentId || !Array.isArray(list)) return [];

        const candidates = list.filter((item) => {
            const id = normalizeGuideId(item?.id);
            if (!id || id === currentId) return false;
            if (item?.hasPage === false) return false;
            return true;
        });

        if (candidates.length === 0) return [];

        const history = readViewedGuides();
        const seenMap = new Map(history.map((entry) => [entry.id, entry.ts]));

        const unseen = [];
        const seen = [];

        for (const candidate of candidates) {
            const id = normalizeGuideId(candidate?.id);
            if (!id) continue;
            if (seenMap.has(id)) {
                seen.push(candidate);
            } else {
                unseen.push(candidate);
            }
        }

        const selected = shuffleArray(unseen).slice(0, RELATED_LIMIT);
        if (selected.length < RELATED_LIMIT) {
            seen.sort((a, b) => {
                const aTs = seenMap.get(normalizeGuideId(a?.id)) || 0;
                const bTs = seenMap.get(normalizeGuideId(b?.id)) || 0;
                return aTs - bTs;
            });

            const needed = RELATED_LIMIT - selected.length;
            selected.push(...seen.slice(0, needed));
        }

        return selected.slice(0, RELATED_LIMIT);
    }

    function renderRelatedSection(guide) {
        const articleEl = document.querySelector('#guide-view-container .guide-article');
        if (!articleEl) return;

        const contentEl = articleEl.querySelector('.guide-content');
        if (!contentEl) return;

        const existing = articleEl.querySelector('.guide-related');
        if (existing) {
            existing.remove();
        }

        const lang = getCurrentLang();
        const section = document.createElement('section');
        section.className = 'guide-related';
        section.innerHTML = `
            <h2 class="guide-related-title">${escapeHtml(getI18nText('relatedArticlesTitle', 'Recommended Articles'))}</h2>
            <div class="guide-related-list"></div>
        `;
        contentEl.insertAdjacentElement('afterend', section);

        const listEl = section.querySelector('.guide-related-list');
        if (!listEl) return;

        const renderEmpty = () => {
            listEl.innerHTML = `<p class="guide-related-empty">${escapeHtml(getI18nText('relatedArticlesEmpty', 'No other articles to recommend.'))}</p>`;
        };

        loadGuidesList()
            .then((list) => {
                const recommendations = buildRecommendations(guide, list);
                if (recommendations.length === 0) {
                    renderEmpty();
                    return;
                }

                listEl.innerHTML = recommendations.map((item) => {
                    const title = getGuideTitle(item, lang);
                    const url = getGuideUrl(item, lang);
                    const date = formatGuideDate(item, lang);
                    const categoryLabel = getCategoryLabel(item, lang);
                    const categoryClass = sanitizeClassToken(item?.category);

                    return `
                        <a class="guide-related-item" href="${escapeHtml(url)}">
                            <h3 class="guide-related-item-title">${escapeHtml(title)}</h3>
                            <div class="guide-related-meta">
                                ${categoryLabel ? `<span class="guide-related-category cat-${categoryClass}">${escapeHtml(categoryLabel)}</span>` : ''}
                                ${date ? `<span class="guide-related-date">${escapeHtml(date)}</span>` : ''}
                            </div>
                        </a>
                    `;
                }).join('');
            })
            .catch((error) => {
                console.warn('[guides-related] Failed to load related guides:', error);
                renderEmpty();
            });
    }

    function patchGuides() {
        if (!hasGuides() || typeof Guides.renderGuide !== 'function') {
            return false;
        }
        if (Guides.__relatedPatched === true) {
            return true;
        }

        const originalRenderGuide = Guides.renderGuide.bind(Guides);
        Guides.renderGuide = function wrappedRenderGuide(guide) {
            originalRenderGuide(guide);
            try {
                const currentId = normalizeGuideId(guide?.id);
                if (currentId) {
                    trackViewedGuide(currentId);
                }
                renderRelatedSection(guide);
            } catch (error) {
                console.warn('[guides-related] Failed to render related section:', error);
            }
        };

        Guides.__relatedPatched = true;
        return true;
    }

    if (patchGuides()) {
        return;
    }

    const retryTimer = window.setInterval(() => {
        if (patchGuides()) {
            window.clearInterval(retryTimer);
        }
    }, 100);

    window.setTimeout(() => {
        window.clearInterval(retryTimer);
    }, 5000);
})();
