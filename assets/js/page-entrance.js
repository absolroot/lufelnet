(() => {
    const root = document.documentElement;
    const easing = 'cubic-bezier(.16, 1, .3, 1)';
    const staggeredContent = new WeakSet();
    const observedStaggerParts = new WeakSet();
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

    function animateStaggerBatch(items) {
        const step = Math.min(30, 510 / Math.max(1, items.length - 1));
        items.forEach((item, index) => {
            item.animate([
                { opacity: 0, translate: '0 8px' },
                { opacity: 1, translate: '0 0' }
            ], { duration: 240, delay: index * step, easing, fill: 'backwards' });
        });
    }

    function observeRemainingStaggerItems(items) {
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
            animateStaggerBatch(items.filter(item => entering.has(item)));
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
        animateStaggerBatch(animatedItems);
        if (onScroll) {
            const animated = new Set(animatedItems);
            observeRemainingStaggerItems(items.filter(item => !animated.has(item)));
        }
        return true;
    }

    function animatePart(part) {
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
    window.LufelPageEntrance = { finish, stagger };
    timer = setTimeout(show, 3500);
})();
