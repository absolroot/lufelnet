(() => {
    const root = document.documentElement;
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

    function animatePart(part) {
        if (!part.animate) return;
        part.animate([
            { opacity: 0, translate: '0 12px' },
            { opacity: 1, translate: '0 0' }
        ], { duration: 420, easing: 'cubic-bezier(.16, 1, .3, 1)' });
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
            const rect = part.getBoundingClientRect();
            if (!part.getClientRects().length) return;
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
    window.LufelPageEntrance = { finish };
    timer = setTimeout(show, 3500);
})();
