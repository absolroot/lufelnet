(() => {
    const root = document.documentElement;
    const easing = 'cubic-bezier(.16, 1, .3, 1)';
    const staggeredContent = new WeakSet();
    const observedStaggerParts = new WeakSet();
    const staggerEffects = new WeakMap();
    let completed = false;
    let finishing = false;
    let timer;

    function prepareParts() {
        const wrapper = document.querySelector('.main-wrapper');
        if (!wrapper) return;
        function visit(element) {
            if (!['DIV', 'SECTION', 'HEADER', 'MAIN'].includes(element.tagName)) return;
            if (element.classList.contains('page-entrance-part')) return;
            if (element.matches('[hidden], [aria-hidden="true"], dialog, .nitro-ad-container, .modal, [class*="-modal"], [id*="Modal"], [id*="modal"], [id*="Overlay"]')) return;
            if (!element.getClientRects().length) return;
            if (element.querySelector('.page-entrance-part')) {
                Array.from(element.children).forEach(visit);
                return;
            }
            element.classList.add('page-entrance-part');
        }
        Array.from(wrapper.children).forEach(visit);
    }

    function visibleStaggerItems(part, items) {
        const bounds = part.getBoundingClientRect();
        const top = Math.max(0, bounds.top);
        const bottom = Math.min(window.innerHeight, bounds.bottom);
        const left = Math.max(0, bounds.left);
        const right = Math.min(window.innerWidth, bounds.right);
        if (top >= bottom || left >= right) return [];
        return items.filter(item => {
            const rect = item.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.top < bottom && rect.bottom > top &&
                rect.left < right && rect.right > left;
        });
    }

    function animateStaggerBatch(items, effect) {
        if (items.length && effect?.(items)) return;
        const step = Math.min(30, 510 / Math.max(1, items.length - 1));
        items.forEach((item, index) => {
            item.animate([
                { opacity: 0, translate: '0 8px' },
                { opacity: 1, translate: '0 0' }
            ], { duration: 240, delay: index * step, easing, fill: 'backwards' });
        });
    }

    function setStaggerEffect(part, effect) {
        staggerEffects.set(part, effect);
    }

    function setCardStaggerEffect(part) {
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        setStaggerEffect(part, cards => {
            const gsap = window.gsap;
            if (!gsap || motion.matches) return false;

            const stagger = { each: Math.min(0.042, 0.24 / Math.max(1, cards.length - 1)) };
            const finish = () => entrance.progress(1);
            const finishOnReducedMotion = event => {
                if (event.matches) finish();
            };
            const entrance = gsap.timeline({
                onComplete() {
                    part.removeEventListener('focusin', finish);
                    motion.removeEventListener('change', finishOnReducedMotion);
                }
            });
            entrance.fromTo(cards, {
                '--character-card-arrival-translate': '0px 22px',
                '--character-card-arrival-scale': 0.96
            }, {
                '--character-card-arrival-translate': '0px 0px',
                '--character-card-arrival-scale': 1,
                duration: 0.44,
                ease: 'power2.inOut',
                stagger,
                clearProps: '--character-card-arrival-translate,--character-card-arrival-scale'
            }, 0).fromTo(cards, { opacity: 0 }, {
                opacity: 1, duration: 0.34, ease: 'power1.out', stagger, clearProps: 'opacity'
            }, 0);
            part.addEventListener('focusin', finish);
            motion.addEventListener('change', finishOnReducedMotion);
            return true;
        });
    }

    function observeRemainingStaggerItems(items, effect) {
        if (!items.length) return;
        const remaining = new Set(items);
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const observer = new IntersectionObserver(entries => {
            if (motion.matches) {
                observer.disconnect();
                return;
            }
            const entering = new Set();
            entries.forEach(({ target, isIntersecting }) => {
                if (target.isConnected && !isIntersecting) return;
                observer.unobserve(target);
                remaining.delete(target);
                if (target.isConnected) entering.add(target);
            });
            animateStaggerBatch(items.filter(item => entering.has(item)), effect);
            if (!remaining.size) observer.disconnect();
        });
        items.forEach(item => observer.observe(item));
    }

    function animateStaggeredItems(part, selector) {
        const items = Array.from(part.querySelectorAll(selector));
        if (!items.length) return false;
        if (staggeredContent.has(items[0])) return true;

        const onScroll = part.hasAttribute('data-page-entrance-stagger-scroll') && 'IntersectionObserver' in window;
        const all = part.hasAttribute('data-page-entrance-stagger-all');
        const visible = visibleStaggerItems(part, all ? [part] : items);
        const animatedItems = all && visible.length ? items : visible;
        if (!animatedItems.length && !onScroll) return false;
        staggeredContent.add(items[0]);
        const effect = staggerEffects.get(part);
        animateStaggerBatch(animatedItems, effect);
        if (onScroll) {
            const animated = new Set(animatedItems);
            observeRemainingStaggerItems(items.filter(item => !animated.has(item)), effect);
        }
        return true;
    }

    function animateFilterRows(part) {
        const rows = Array.from(part.querySelectorAll('.filter-group'))
            .filter(row => row.animate && row.getClientRects().length &&
                getComputedStyle(row).visibility === 'visible');
        if (!rows.length) return false;

        rows.forEach((row, index) => {
            row.animate([
                { translate: '-10px 0', opacity: 0.42 },
                { translate: '0 0', opacity: 1 }
            ], {
                duration: 170,
                delay: Math.min(index, 2) * 54 + Math.max(0, index - 2) * 28,
                easing,
                fill: 'backwards'
            });
        });
        return true;
    }

    function animatePart(part) {
        if (part.matches('.filter-section') && animateFilterRows(part)) return;
        if (!part.animate) return;
        part.animate([
            { opacity: 0, translate: '0 12px' },
            { opacity: 1, translate: '0 0' }
        ], { duration: 420, easing });
    }

    function stagger(part) {
        const selector = part.dataset.pageEntranceStagger;
        if (!completed || !selector || !part.animate || observedStaggerParts.has(part)) return;
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motion.matches || animateStaggeredItems(part, selector)) return;

        function finishStagger() {
            if (part.isConnected && !motion.matches && !animateStaggeredItems(part, selector)) return false;
            viewportObserver?.disconnect();
            contentObserver.disconnect();
            observedStaggerParts.delete(part);
            return true;
        }

        function observeTargets() {
            if (!viewportObserver) return;
            viewportObserver.disconnect();
            // A group can intersect the viewport before any of its actual cards do.
            const targets = part.hasAttribute('data-page-entrance-stagger-all') ? [part] : part.querySelectorAll(selector);
            targets.forEach(target => viewportObserver.observe(target));
        }

        const viewportObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) finishStagger();
        }) : null;
        const contentObserver = new MutationObserver(() => {
            if (!finishStagger()) observeTargets();
        });
        observedStaggerParts.add(part);
        contentObserver.observe(part, { childList: true, subtree: true });
        observeTargets();
    }

    function show() {
        if (completed) return;
        completed = true;
        clearTimeout(timer);
        let parts = [];
        try {
            prepareParts();
            parts = document.querySelectorAll('.page-entrance-part');
        } finally {
            root.removeAttribute('data-page-entrance');
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let observer;
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) animatePart(entry.target);
                });
            }, { threshold: 0 });
        }
        parts.forEach(part => {
            if (!part.getClientRects().length) return;
            if (part.dataset.pageEntranceStagger) {
                stagger(part);
                return;
            }
            const rect = part.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) animatePart(part);
            else if (observer && rect.top >= window.innerHeight) observer.observe(part);
        });
    }

    function finish() {
        if (completed || finishing) return false;
        finishing = true;
        prepareParts();
        const images = Array.from(document.querySelectorAll('.page-entrance-part img'))
            .filter(image => {
                const rect = image.getBoundingClientRect();
                return image.getClientRects().length && rect.top < window.innerHeight && rect.bottom > 0 && !image.complete;
            });
        const ready = images.map(image => new Promise(resolve => {
            let timeout;
            const done = () => {
                clearTimeout(timeout);
                image.removeEventListener('load', done);
                image.removeEventListener('error', done);
                resolve();
            };
            image.addEventListener('load', done, { once: true });
            image.addEventListener('error', done, { once: true });
            timeout = setTimeout(done, 700);
            if (image.complete) done();
        }));
        if (ready.length) Promise.all(ready).then(show);
        else show();
        return true;
    }

    root.setAttribute('data-page-entrance', 'waiting');
    window.LufelPageEntrance = {
        finish,
        stagger,
        setStaggerEffect,
        setCardStaggerEffect
    };
    timer = setTimeout(show, 3500);
})();
