(function () {
    const SECTION_DEFS = [
        { selector: '.review-card', id: 'character-section-review' },
        { selector: '.settings-card', id: 'character-section-settings' },
        { selector: '.skills-card', id: 'character-section-skills' },
        { selector: '.ritual-card', id: 'character-section-ritual' },
        { selector: '.stats-card', id: 'character-section-stats' },
        { selector: '.weapons-card', id: 'character-section-weapons' },
        { selector: '.innate-card', id: 'character-section-innate' },
        { selector: '.recommended-persona-card', id: 'character-section-recommended-combo' },
        { selector: '.recommended-party-card', id: 'character-section-recommended-party' }
    ];
    const MIN_RIGHT_GAP = 220;
    const TOC_WIDTH = 184;
    const SCROLL_OFFSET = 100;
    const HANGUL_RE = /[\uac00-\ud7a3]/;
    const CLICK_LOCK_TIMEOUT_MS = 1800;

    let initialized = false;
    let root = null;
    let list = null;
    let entries = [];
    let refreshTimer = null;
    let scrollRaf = null;
    let lockTargetId = '';
    let lockTimeout = null;
    let lockRaf = null;

    function isSectionVisible(element) {
        if (!element) return false;
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        if (element.offsetParent === null && style.position !== 'fixed') return false;
        return true;
    }

    function ensureRoot() {
        if (root && list) return true;
        if (!document.body) return false;

        root = document.getElementById('character-page-toc');
        if (!root) {
            root = document.createElement('aside');
            root.id = 'character-page-toc';
            root.className = 'character-page-toc';
            root.hidden = true;
            document.body.appendChild(root);
        }

        list = root.querySelector('.character-page-toc-list');
        if (!list) {
            list = document.createElement('ul');
            list.className = 'character-page-toc-list';
            root.appendChild(list);
        }

        return true;
    }

    function getCurrentLanguageSafe() {
        try {
            if (typeof window.getCurrentLanguage === 'function') {
                const lang = window.getCurrentLanguage();
                if (lang) return String(lang);
            }
        } catch (_) {}

        const path = String(window.location.pathname || '');
        if (/^\/en(\/|$)/.test(path)) return 'en';
        if (/^\/jp(\/|$)/.test(path)) return 'jp';
        if (/^\/cn(\/|$)/.test(path)) return 'cn';
        return 'kr';
    }

    function toTocDisplayTitle(rawTitle) {
        const title = String(rawTitle || '').trim();
        const lang = getCurrentLanguageSafe();
        if (lang === 'en' && /^recommended parties example$/i.test(title)) {
            return 'Recommended Parties';
        }
        return title;
    }

    function setActiveById(targetId) {
        if (!list) return;
        const links = list.querySelectorAll('.character-page-toc-link');
        links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('data-target') === targetId);
        });
    }

    function clearClickLock({ runUpdate = true } = {}) {
        lockTargetId = '';
        if (lockTimeout) {
            clearTimeout(lockTimeout);
            lockTimeout = null;
        }
        if (lockRaf) {
            window.cancelAnimationFrame(lockRaf);
            lockRaf = null;
        }
        if (runUpdate) updateActive();
    }

    function monitorClickLockArrival() {
        if (!lockTargetId) return;
        const targetSection = document.getElementById(lockTargetId);
        if (!targetSection) {
            clearClickLock({ runUpdate: true });
            return;
        }

        const targetTop = targetSection.getBoundingClientRect().top;
        const anchorY = SCROLL_OFFSET + 1;
        if (targetTop <= anchorY) {
            clearClickLock({ runUpdate: true });
            return;
        }

        // If the page already hit the bottom and the section cannot be aligned to anchor,
        // keep the clicked section active and release the lock.
        const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        if (window.scrollY >= maxScrollY - 1) {
            const lockedId = lockTargetId;
            clearClickLock({ runUpdate: false });
            if (lockedId) setActiveById(lockedId);
            return;
        }

        lockRaf = window.requestAnimationFrame(monitorClickLockArrival);
    }

    function lockActiveToTarget(targetId) {
        clearClickLock({ runUpdate: false });
        lockTargetId = targetId;
        setActiveById(targetId);
        lockTimeout = window.setTimeout(() => {
            const lockedId = lockTargetId;
            clearClickLock({ runUpdate: false });
            if (lockedId) setActiveById(lockedId);
        }, CLICK_LOCK_TIMEOUT_MS);
        lockRaf = window.requestAnimationFrame(monitorClickLockArrival);
    }

    function updateActive() {
        if (!root || !list || root.hidden) return;
        if (!Array.isArray(entries) || entries.length === 0) return;
        if (lockTargetId) {
            const lockedSection = document.getElementById(lockTargetId);
            if (lockedSection) {
                setActiveById(lockTargetId);
                return;
            }
            clearClickLock({ runUpdate: false });
        }

        // At page bottom, force-highlight the last visible section.
        const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        if (window.scrollY >= maxScrollY - 1) {
            const lastEntry = entries[entries.length - 1];
            setActiveById(lastEntry ? lastEntry.id : '');
            return;
        }

        const anchorY = SCROLL_OFFSET + 1;
        let activeIndex = 0;
        let passedSectionFound = false;

        for (let i = 0; i < entries.length; i += 1) {
            const rect = entries[i].element.getBoundingClientRect();
            if (rect.top <= anchorY) {
                activeIndex = i;
                passedSectionFound = true;
            }
        }

        if (!passedSectionFound) activeIndex = 0;
        const activeEntry = entries[activeIndex];
        const activeId = activeEntry ? activeEntry.id : '';
        setActiveById(activeId);
    }

    function refresh() {
        if (!ensureRoot()) return;

        const wrapper = document.querySelector('.main-wrapper');
        const rightGap = wrapper ? Math.max(0, window.innerWidth - wrapper.getBoundingClientRect().right) : 0;
        const hasDesktopSpace = window.innerWidth > 1280 && rightGap >= MIN_RIGHT_GAP;
        if (!hasDesktopSpace) {
            clearClickLock({ runUpdate: false });
            entries = [];
            root.hidden = true;
            return;
        }

        const nextEntries = [];
        SECTION_DEFS.forEach((sectionDef, index) => {
            const section = document.querySelector(sectionDef.selector);
            if (!section || !isSectionVisible(section)) return;

            const heading = section.querySelector('h2');
            const title = heading ? toTocDisplayTitle(heading.textContent) : '';
            if (!title) return;

            if (!section.id) {
                section.id = sectionDef.id || `character-section-${index + 1}`;
            }

            nextEntries.push({
                id: section.id,
                title,
                element: section
            });
        });

        if (nextEntries.length < 2) {
            clearClickLock({ runUpdate: false });
            entries = [];
            root.hidden = true;
            return;
        }

        // Non-KR page: hide TOC until headings are translated (avoid initial Korean flash).
        const currentLang = getCurrentLanguageSafe();
        const shouldWaitForTranslation = currentLang !== 'kr'
            && nextEntries.some((entry) => HANGUL_RE.test(entry.title));
        if (shouldWaitForTranslation) {
            clearClickLock({ runUpdate: false });
            entries = [];
            root.hidden = true;
            return;
        }

        entries = nextEntries;
        root.hidden = false;
        root.style.right = `${Math.max(16, Math.round(rightGap - TOC_WIDTH - 12))}px`;

        list.innerHTML = '';
        entries.forEach((entry) => {
            const item = document.createElement('li');
            item.className = 'character-page-toc-item';

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'character-page-toc-link';
            button.setAttribute('data-target', entry.id);
            button.textContent = entry.title;

            item.appendChild(button);
            list.appendChild(item);
        });

        updateActive();
    }

    function scheduleRefresh() {
        if (!initialized) init();
        if (refreshTimer) clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => {
            refreshTimer = null;
            refresh();
        }, 120);
    }

    function bindEvents() {
        if (!root) return;

        root.addEventListener('click', (event) => {
            const trigger = event.target.closest('.character-page-toc-link');
            if (!trigger) return;

            const targetId = trigger.getAttribute('data-target');
            const targetSection = targetId ? document.getElementById(targetId) : null;
            if (!targetSection) return;

            event.preventDefault();
            lockActiveToTarget(targetId);

            const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
            window.scrollTo({
                top: Math.max(0, targetTop),
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            if (scrollRaf) return;
            scrollRaf = window.requestAnimationFrame(() => {
                scrollRaf = null;
                updateActive();
            });
        }, { passive: true });

        window.addEventListener('resize', scheduleRefresh);
    }

    function init() {
        if (initialized) return;
        if (!ensureRoot()) return;
        bindEvents();
        initialized = true;
        scheduleRefresh();
    }

    window.CharacterDetailTOC = {
        init,
        refresh,
        scheduleRefresh
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
