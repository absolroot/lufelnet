(() => {
    'use strict';

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const numberPattern = /^\d+(?:\.(\d+))?(%)?$/;

    function warmWhenNear(...sections) {
        const targets = sections.filter(Boolean);
        if (!targets.length || !('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver(entries => {
            if (motion.matches || !entries.some(entry => entry.isIntersecting)) return;
            observer.disconnect();
            window.loadLufelGSAP?.();
        }, { rootMargin: '320px 0px' });
        targets.forEach(target => observer.observe(target));
    }

    window.createSkillValueAnimation = function (valueSelector) {
        let tween;
        const counters = new Map();

        function finish() {
            motion.removeEventListener('change', finish);
            tween?.kill();
            tween = null;
            for (const [span, { target, preview }] of counters) {
                target.replaceWith(...target.childNodes);
                preview.remove();
                span.classList.remove('is-counting');
            }
            counters.clear();
        }

        function addCounter(span, previous, integerDigits = 0) {
            const next = span.textContent;
            const from = previous.match(numberPattern);
            const to = next.match(numberPattern);
            if (!from || !to || from[2] !== to[2] || span.childElementCount) return;

            const start = parseFloat(previous);
            const end = parseFloat(next);
            if (start === end) return;

            const suffix = to[2] || '';
            const precision = Math.min(100, Math.max(from[1]?.length || 0, to[1]?.length || 0));
            const width = integerDigits + (precision ? precision + 1 : 0);
            const format = value => value.toFixed(precision).padStart(width, '0') + suffix;
            const target = document.createElement('span');
            target.className = 'skill-level-count-target';
            target.append(...span.childNodes);
            const preview = document.createElement('span');
            preview.className = 'skill-level-count-preview';
            preview.setAttribute('aria-hidden', 'true');
            preview.dataset.value = previous;
            preview.dataset.sizingValue = format(Math.max(start, end));

            // Keep the exact target available to tooltips and assistive technology.
            span.append(target, preview);
            span.classList.add('is-counting');
            counters.set(span, { target, preview, start, end, format });
        }

        function play(gsap, duration = 0.28, stagger = 0, ease = 'power2.out') {
            if (!counters.size) return;
            motion.addEventListener('change', finish);
            const progress = { value: 0 };
            const runtime = duration + stagger * (counters.size - 1);
            const staggerEase = stagger ? gsap.parseEase(ease) : null;
            tween = gsap.to(progress, {
                value: 1,
                duration: runtime,
                ease: staggerEase ? 'none' : ease,
                onUpdate() {
                    let offset = 0;
                    for (const { preview, start, end, format } of counters.values()) {
                        const fraction = staggerEase
                            ? staggerEase(Math.min(1, Math.max(0, (progress.value * runtime - offset) / duration)))
                            : progress.value;
                        const value = format(start + (end - start) * fraction);
                        if (preview.dataset.value !== value) preview.dataset.value = value;
                        offset += stagger;
                    }
                },
                onComplete: finish
            });
        }

        function animate(gsap, previousDescriptions, descriptions) {
            if (descriptions.length !== previousDescriptions.length) return;

            Array.from(descriptions).forEach((description, descriptionIndex) => {
                const previousValues = previousDescriptions[descriptionIndex];
                const values = description.querySelectorAll(valueSelector);
                if (values.length !== previousValues.length) return;
                values.forEach((span, index) => addCounter(span, previousValues[index]));
            });
            play(gsap);
        }

        function countUp(values) {
            finish();
            if (motion.matches) return;

            const start = gsap => {
                if (!gsap || motion.matches) return;
                values.forEach(span => {
                    if (!span.isConnected) return;
                    const number = span.textContent.match(numberPattern);
                    if (!number) return;
                    const integerDigits = number[0].split(/[.%]/, 1)[0].length;
                    const decimals = number[1] ? '.' + '0'.repeat(number[1].length) : '';
                    addCounter(span, '0'.repeat(integerDigits) + decimals + (number[2] || ''), integerDigits);
                });
                play(gsap, 0.82, Math.min(0.026, 0.14 / Math.max(1, counters.size - 1)), 'sine.out');
            };

            if (window.gsap) {
                start(window.gsap);
                return;
            }

            Promise.race([
                window.loadLufelGSAP?.(),
                new Promise(resolve => window.setTimeout(resolve, 180))
            ]).then(start);
        }

        function prepare(descriptions, enabled) {
            const shouldAnimate = enabled && !motion.matches;
            const gsap = shouldAnimate ? window.gsap : null;
            if (shouldAnimate && !gsap) window.loadLufelGSAP?.();
            const previous = gsap ? Array.from(descriptions, description =>
                Array.from(description.querySelectorAll(valueSelector), span =>
                    counters.get(span)?.preview.dataset.value ?? span.textContent)) : null;
            finish();

            if (gsap) return (updated = descriptions) => animate(gsap, previous, updated);
        }

        return { prepare, finish, warmWhenNear, countUp };
    };
})();
