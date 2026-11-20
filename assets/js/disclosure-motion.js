(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const running = new WeakMap();

    function cancel(element) {
        const stop = running.get(element);
        if (stop) stop();
    }

    function animateBlock(element, closing, finish) {
        if (!element) return;
        cancel(element);
        if (reduced.matches || !element.animate) {
            if (finish) finish();
            return;
        }
        const style = getComputedStyle(element);
        const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        const height = element.scrollHeight + (style.boxSizing === 'border-box' ? border : -padding);
        if (!height) {
            if (finish) finish();
            return;
        }
        const overflow = element.style.overflow;
        element.style.overflow = 'hidden';
        const keyframes = [
            { height: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0.75 },
            { height: `${height}px`, paddingTop: style.paddingTop, paddingBottom: style.paddingBottom, opacity: 1 }
        ];
        if (closing) keyframes.reverse();
        const animation = element.animate(keyframes, { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
        const cleanup = () => {
            animation.cancel();
            element.style.overflow = overflow;
            running.delete(element);
        };
        running.set(element, cleanup);
        animation.onfinish = () => {
            try { if (finish) finish(); } finally { cleanup(); }
        };
    }

    function rows(elements, closing = false, finish) {
        if (reduced.matches || !Element.prototype.animate || !elements.length) {
            if (finish) finish();
            return;
        }
        elements.forEach(cancel);
        const cleanups = [];
        let remaining = 0;
        let stopped = false;
        let timer;
        function stop(completed = false) {
            if (stopped) return;
            stopped = true;
            clearTimeout(timer);
            try {
                if (completed && finish) finish();
            } finally {
                cleanups.forEach(cleanup => cleanup());
                elements.forEach(row => running.delete(row));
            }
        }
        elements.forEach(row => {
            const cells = Array.from(row.children).filter(cell => cell.tagName === 'TD');
            cells.forEach(cell => {
                const wrapper = document.createElement('div');
                while (cell.firstChild) wrapper.appendChild(cell.firstChild);
                cell.appendChild(wrapper);
                const height = wrapper.getBoundingClientRect().height;
                const padding = getComputedStyle(cell);
                wrapper.style.overflow = 'hidden';
                const heights = [{ height: '0px' }, { height: `${height}px` }];
                const paddings = [{ paddingTop: '0px', paddingBottom: '0px' }, { paddingTop: padding.paddingTop, paddingBottom: padding.paddingBottom }];
                if (closing) { heights.reverse(); paddings.reverse(); }
                const options = { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' };
                const a = wrapper.animate(heights, options);
                const b = cell.animate(paddings, options);
                remaining++;
                a.onfinish = () => { if (--remaining === 0) stop(true); };
                cleanups.push(() => {
                    a.cancel(); b.cancel();
                    while (wrapper.firstChild) cell.insertBefore(wrapper.firstChild, wrapper);
                    wrapper.remove();
                });
            });
            running.set(row, () => stop());
        });
        if (!remaining) stop(true);
        else timer = setTimeout(() => stop(true), 500);
    }

    window.disclosureMotion = { reveal: element => animateBlock(element, false), collapse: (element, finish) => animateBlock(element, true, finish), rows, cancel };
})();
