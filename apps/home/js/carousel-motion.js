(() => {
    'use strict';

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const full = 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)';
    const canWipe = CSS.supports('clip-path', full);
    let gsap;
    let finishTransition;

    function prepare() {
        if (canWipe && !reducedMotion.matches) {
            window.loadLufelGSAP?.().then(engine => { gsap = engine; });
        }
    }

    function cancel() {
        finishTransition?.();
    }

    function jumpToSlide(track, update) {
        track.classList.add('carousel-track--instant');
        try {
            update();
            void track.offsetWidth;
        } finally {
            track.classList.remove('carousel-track--instant');
        }
    }

    function captureSlide(slide) {
        const snapshot = slide.cloneNode(true);
        snapshot.classList.add('carousel-transition-snapshot');
        snapshot.setAttribute('inert', '');
        snapshot.setAttribute('aria-hidden', 'true');
        snapshot.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
        snapshot.querySelectorAll('video').forEach(video => {
            if (!video.poster) {
                video.remove();
                return;
            }
            const poster = new Image();
            poster.src = video.poster;
            poster.className = 'carousel-transition-poster';
            video.replaceWith(poster);
        });
        return snapshot;
    }

    function transition(track, previousIndex, nextIndex, direction, update) {
        cancel();
        if (reducedMotion.matches) {
            jumpToSlide(track, update);
            return;
        }

        const outgoing = track.children[previousIndex];
        const incoming = track.children[nextIndex];
        if (!gsap || !outgoing || !incoming || previousIndex === nextIndex) {
            prepare();
            update();
            return;
        }

        const snapshot = captureSlide(outgoing);
        // Move both ends of the diagonal by the same distance, including outside the viewport.
        const [start, end] = direction > 0
            ? ['polygon(-20% 0%,120% 0%,120% 100%,0% 100%)', 'polygon(100% 0%,120% 0%,120% 100%,120% 100%)']
            : ['polygon(-20% 0%,120% 0%,100% 100%,-20% 100%)', 'polygon(-20% 0%,0% 0%,-20% 100%,-20% 100%)'];

        jumpToSlide(track, update);
        track.parentElement.append(snapshot);
        const title = incoming.querySelector('.slide-left');
        const portraits = incoming.querySelector('.slide-right .char-img')?.parentElement;
        const wipeDuration = .47;
        let context;
        const finish = () => {
            finishTransition = null;
            context.revert();
            snapshot.remove();
        };
        context = gsap.context(() => {
            const timeline = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: finish });
            if (portraits) gsap.set(portraits, { opacity: 0, x: direction > 0 ? 16 : -16 });
            timeline.fromTo(snapshot, { clipPath: start }, {
                clipPath: end,
                duration: wipeDuration,
                ease: 'power1.inOut',
                onComplete: () => snapshot.remove()
            });
            if (title) timeline.fromTo(title, { opacity: .55, y: 6 }, { opacity: 1, y: 0, duration: .24 }, .065);
            if (portraits) timeline.to(portraits, { opacity: 1, x: 0, duration: .26 }, wipeDuration);
        });
        finishTransition = finish;
    }

    reducedMotion.addEventListener('change', cancel);
    window.LufelCarouselMotion = { cancel, transition };

    function prepareWhenIdle() {
        if ('requestIdleCallback' in window) requestIdleCallback(prepare, { timeout: 1200 });
        else setTimeout(prepare, 250);
    }

    if (document.readyState === 'complete') prepareWhenIdle();
    else window.addEventListener('load', prepareWhenIdle, { once: true });
})();
