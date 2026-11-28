(() => {
    let active;

    function close(restoreFocus = false) {
        if (!active) return;
        const { trigger, menu } = active;
        active = null;
        trigger.setAttribute('aria-expanded', 'false');
        menu.hidePopover?.();
        menu.hidden = true;
        if (restoreFocus) trigger.focus({ preventScroll: true });
    }

    function position() {
        if (!active) return;
        const { trigger, menu } = active;
        if (!trigger.isConnected) return close();
        const rect = trigger.getBoundingClientRect();
        const viewport = window.visualViewport;
        const left = (viewport?.offsetLeft ?? 0) + 8;
        const top = (viewport?.offsetTop ?? 0) + 8;
        const right = left - 16 + (viewport?.width ?? document.documentElement.clientWidth);
        const bottom = top - 16 + (viewport?.height ?? document.documentElement.clientHeight);
        if (rect.bottom < top || rect.top > bottom) return close();
        const gap = parseFloat(getComputedStyle(menu).getPropertyValue('--select-menu-gap'));
        const below = bottom - rect.bottom - gap;
        const above = rect.top - top - gap;
        menu.style.setProperty('--select-available-width', `${right - left}px`);
        const openAbove = menu.scrollHeight > below && above > below;
        menu.style.maxHeight = `${Math.max(0, openAbove ? above : below)}px`;
        menu.style.left = `${Math.max(left, Math.min(rect.right - menu.offsetWidth, right - menu.offsetWidth))}px`;
        menu.style.top = `${openAbove ? rect.top - gap - menu.offsetHeight : rect.bottom + gap}px`;
    }

    function bind(trigger, menu) {
        menu.classList.add('site-select-popup', 'site-action-dropdown');
        menu.hidden = true;
        menu.setAttribute('role', 'menu');
        if (menu.showPopover) menu.popover = 'manual';
        trigger.setAttribute('aria-haspopup', 'menu');
        trigger.setAttribute('aria-expanded', 'false');
        const items = [...menu.querySelectorAll('button')];
        items.forEach(item => {
            item.setAttribute('role', 'menuitem');
            item.tabIndex = -1;
        });
        function open(index) {
            close();
            active = { trigger, menu };
            menu.hidden = false;
            menu.showPopover?.();
            trigger.setAttribute('aria-expanded', 'true');
            position();
            if (active?.menu === menu) items[index].focus({ preventScroll: true });
        }
        trigger.addEventListener('click', () => active?.trigger === trigger ? close(true) : open(0));
        trigger.addEventListener('keydown', event => {
            if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
            event.preventDefault();
            open(event.key === 'ArrowUp' ? items.length - 1 : 0);
        });
        menu.addEventListener('click', event => {
            if (event.target.closest('[role="menuitem"]')) close(true);
        }, true);
        menu.addEventListener('keydown', event => {
            const index = items.indexOf(document.activeElement);
            switch (event.key) {
                case 'Escape': close(true); break;
                case 'Tab': close(true); return;
                case 'ArrowDown': items[(index + 1) % items.length].focus(); break;
                case 'ArrowUp': items[(index + items.length - 1) % items.length].focus(); break;
                case 'Home': items[0].focus(); break;
                case 'End': items.at(-1).focus(); break;
                default: return;
            }
            event.preventDefault();
            event.stopPropagation();
        });
    }

    document.addEventListener('pointerdown', event => {
        if (active && !active.menu.contains(event.target) && !active.trigger.contains(event.target)) close();
    }, true);
    document.addEventListener('scroll', position, true);
    window.addEventListener('resize', position);
    window.visualViewport?.addEventListener('resize', position);
    window.visualViewport?.addEventListener('scroll', position);
    window.actionDropdown = { bind, close };
})();
