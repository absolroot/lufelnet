(() => {
    'use strict';

    const grid = document.getElementById('characterCards');
    if (!grid) return;

    const motion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const artWindow = document.createElement('div');
    artWindow.className = 'character-card-art-window';
    artWindow.setAttribute('aria-hidden', 'true');
    const zoomLayer = document.createElement('div');
    zoomLayer.className = 'character-card-art-zoom';
    const light = document.createElement('div');
    light.className = 'character-card-art-light';
    artWindow.append(zoomLayer, light);

    let activeCard;
    let bounds;

    function startHover(card) {
        const portrait = card.querySelector('.character-img.loaded');
        if (!portrait) return false;

        if (artWindow.parentElement !== portrait.parentElement) {
            zoomLayer.style.backgroundImage = `url("${portrait.src}")`;
            portrait.after(artWindow);
        }

        activeCard = card;
        bounds = null;
        artWindow.classList.add('is-zoomed');
        return true;
    }

    function handlePointer(event) {
        if (!motion.matches || event.pointerType !== 'mouse') return;

        if (!activeCard?.contains(event.target)) {
            const card = event.target.closest('.card[data-rarity="4"], .card[data-rarity="5"]');
            if (!card || !startHover(card)) return;
        }

        if (!bounds) {
            const rect = activeCard.getBoundingClientRect();
            bounds = { left: rect.left + window.scrollX, top: rect.top + window.scrollY, width: rect.width, height: rect.height };
        }
        const pointerX = Math.max(-1, Math.min(1, 2 * (event.pageX - bounds.left) / bounds.width - 1));
        const pointerY = Math.max(-1, Math.min(1, 2 * (event.pageY - bounds.top) / bounds.height - 1));
        light.style.setProperty('--reflection-position', `${pointerX * 28}% ${pointerY * 28}%`);
    }

    function stopHover() {
        if (!activeCard) return;
        activeCard = null;
        artWindow.classList.remove('is-zoomed');
        light.style.removeProperty('--reflection-position');
    }

    grid.addEventListener('pointerover', handlePointer);
    grid.addEventListener('pointermove', handlePointer, { passive: true });
    grid.addEventListener('pointerout', event => {
        if (event.pointerType === 'mouse' && !activeCard?.contains(event.relatedTarget)) stopHover();
    });
    zoomLayer.addEventListener('transitionend', event => {
        if (!activeCard && event.propertyName === 'scale') artWindow.remove();
    });
    window.addEventListener('blur', stopHover);
    window.addEventListener('resize', () => { bounds = null; });
    motion.addEventListener('change', () => {
        stopHover();
        artWindow.remove();
    });
})();
