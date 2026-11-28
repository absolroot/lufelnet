(() => {
    // Browsers with a stylable picker keep their own selection and focus handling.
    if (CSS.supports('(appearance: base-select) and selector(::picker(select))')) return;

    const selector = 'select:not([multiple], [size]:not([size="0"], [size="1"]), [data-native-select])';
    const openKeys = new Set(['Enter', ' ', 'ArrowDown', 'ArrowUp', 'F4']);
    const forcedColors = matchMedia('(forced-colors: active)');
    const popup = document.createElement('div');
    popup.className = 'site-select-popup';
    popup.id = 'site-select-popup';
    popup.setAttribute('role', 'listbox');
    popup.tabIndex = -1;
    popup.hidden = true;
    const topLayer = typeof popup.showPopover === 'function';
    if (topLayer) popup.popover = 'manual';
    let current = null;
    const observer = new MutationObserver(() => close(popup.contains(document.activeElement)));

    function getSelect(target) {
        const select = target.closest?.(selector);
        return select && !forcedColors.matches && !select.matches(':disabled') &&
            select.options.length && getComputedStyle(select).pointerEvents !== 'none' ? select : null;
    }

    function appendOption(option, index, parent) {
        if (option.hidden || option.style.display === 'none') return;
        const item = document.createElement('div');
        item.id = `${popup.id}-${index}`;
        item.dataset.index = index;
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', option.selected);
        if (option.matches(':disabled')) item.setAttribute('aria-disabled', 'true');
        item.textContent = option.label;
        parent.append(item);
        current.items.set(index, item);
        if (!option.matches(':disabled')) current.enabled.push(index);
    }

    function appendOptions(select) {
        const content = document.createDocumentFragment();
        for (const option of select.options) {
            const group = option.parentElement;
            if (group.tagName !== 'OPTGROUP') {
                appendOption(option, option.index, content);
                continue;
            }
            if (group.hidden) continue;
            if (!current.groups.has(group)) {
                const section = document.createElement('div');
                section.setAttribute('role', 'group');
                section.setAttribute('aria-label', group.label);
                const heading = document.createElement('div');
                heading.dataset.groupLabel = '';
                heading.setAttribute('aria-hidden', 'true');
                heading.textContent = group.label;
                section.append(heading);
                content.append(section);
                current.groups.set(group, section);
            }
            appendOption(option, option.index, current.groups.get(group));
        }
        popup.replaceChildren(content);
    }

    function position() {
        if (!current) return;
        const { select } = current;
        const rect = select.getBoundingClientRect();
        const viewport = window.visualViewport;
        const left = viewport?.offsetLeft ?? 0;
        const top = viewport?.offsetTop ?? 0;
        const right = left + (viewport?.width ?? document.documentElement.clientWidth);
        const bottom = top + (viewport?.height ?? document.documentElement.clientHeight);
        if (!rect.width || !rect.height || rect.bottom <= top || rect.top >= bottom ||
            rect.right <= left || rect.left >= right) {
            close();
            return;
        }
        const styles = getComputedStyle(popup);
        const gap = parseFloat(styles.getPropertyValue('--select-menu-gap'));
        const edge = 8;
        const availableBelow = bottom - rect.bottom - gap - edge;
        const availableAbove = rect.top - top - gap - edge;
        const maxWidth = Math.min(384, right - left - edge * 2);
        popup.style.setProperty('--select-anchor-width', `${rect.width}px`);
        popup.style.setProperty('--select-available-width', `${maxWidth}px`);
        popup.style.maxHeight = '';
        const above = popup.offsetHeight > availableBelow && availableAbove > availableBelow;
        const availableHeight = Math.max(0, above ? availableAbove : availableBelow);
        if (popup.offsetHeight > availableHeight) popup.style.maxHeight = `${availableHeight}px`;
        const x = popup.dir === 'rtl' ? rect.right - popup.offsetWidth : rect.left;
        popup.style.left = `${Math.max(left + edge, Math.min(x, right - edge - popup.offsetWidth))}px`;
        popup.style.top = `${above ? rect.top - gap - popup.offsetHeight : rect.bottom + gap}px`;
        popup.dataset.positioned = '';
    }

    function activate(index, scroll = true) {
        const item = current.items.get(index);
        if (!item || item.hasAttribute('aria-disabled')) return;
        current.items.get(current.active)?.removeAttribute('data-active');
        current.active = index;
        item.dataset.active = '';
        popup.setAttribute('aria-activedescendant', item.id);
        if (scroll) {
            const inset = parseFloat(getComputedStyle(popup).paddingBlockStart);
            const from = item.offsetTop - inset;
            const to = item.offsetTop + item.offsetHeight + inset - popup.clientHeight;
            if (from < popup.scrollTop) popup.scrollTop = from;
            else if (to > popup.scrollTop) popup.scrollTop = to;
        }
    }

    function open(select) {
        if (current?.select === select) {
            close(true);
            return;
        }
        close();
        current = { select, items: new Map(), groups: new Map(), enabled: [], active: -1, query: '', lastKey: 0 };
        appendOptions(select);
        if (!current.items.size) {
            current = null;
            return;
        }

        const labels = [...select.labels].map(label => label.textContent.trim());
        const referencedLabel = select.getAttribute('aria-labelledby')?.split(/\s+/)
            .map(id => document.getElementById(id)?.textContent.trim()).filter(Boolean).join(' ');
        const label = referencedLabel || select.getAttribute('aria-label') || labels.join(' ') || select.title;
        if (label) popup.setAttribute('aria-label', label);
        else popup.removeAttribute('aria-label');
        const styles = getComputedStyle(select);
        popup.style.fontFamily = styles.fontFamily;
        popup.style.setProperty('--select-trigger-font-size', styles.fontSize);
        popup.style.setProperty('--select-menu-min-width', styles.getPropertyValue('--select-menu-min-width'));
        popup.dataset.selectDensity = select.dataset.selectDensity || '';
        popup.dir = styles.direction;
        if (!popup.isConnected) (select.closest('dialog[open]') || document.body).append(popup);
        popup.hidden = false;
        if (topLayer) popup.showPopover();
        select.setAttribute('data-select-open', '');
        position();
        if (!current) return;
        const initial = current.enabled.includes(select.selectedIndex) ? select.selectedIndex : current.enabled[0];
        const item = current.items.get(initial);
        popup.scrollTop = item ? item.offsetTop - (popup.clientHeight - item.offsetHeight) / 2 : 0;
        activate(initial, false);
        popup.focus({ preventScroll: true });
        observer.observe(select, { attributes: true, childList: true, subtree: true, characterData: true });
    }

    function close(restoreFocus = false) {
        if (!current) return;
        const { select } = current;
        current = null;
        observer.disconnect();
        if (topLayer) popup.hidePopover();
        popup.hidden = true;
        popup.remove();
        delete popup.dataset.positioned;
        popup.removeAttribute('aria-activedescendant');
        select.removeAttribute('data-select-open');
        if (restoreFocus) select.focus({ preventScroll: true });
    }

    function choose(index) {
        if (!current.enabled.includes(index)) return;
        const { select } = current;
        const changed = select.selectedIndex !== index;
        close(true);
        if (changed) {
            select.selectedIndex = index;
            select.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    document.addEventListener('mousedown', event => {
        if (event.button === 0 && getSelect(event.target)) event.preventDefault();
    }, true);

    document.addEventListener('click', event => {
        const select = getSelect(event.target);
        if (!select) return;
        event.preventDefault();
        open(select);
    }, true);

    document.addEventListener('keydown', event => {
        if (event.defaultPrevented || event.isComposing || !openKeys.has(event.key)) return;
        const select = getSelect(event.target);
        if (!select) return;
        event.preventDefault();
        open(select);
    }, true);

    popup.addEventListener('click', event => {
        const option = event.target.closest('[data-index]');
        if (current && option) choose(Number(option.dataset.index));
    });

    popup.addEventListener('pointermove', event => {
        const option = event.target.closest('[data-index]');
        if (event.pointerType === 'mouse' && current && option) activate(Number(option.dataset.index), false);
    });

    popup.addEventListener('keydown', event => {
        if (!current || event.isComposing) return;
        const { enabled, active, select } = current;
        const index = enabled.indexOf(active);
        switch (event.key) {
            case 'ArrowDown': activate(enabled[Math.min(index + 1, enabled.length - 1)]); break;
            case 'ArrowUp': activate(enabled[Math.max(0, index - 1)]); break;
            case 'Home': activate(enabled[0]); break;
            case 'End': activate(enabled.at(-1)); break;
            case 'PageDown': activate(enabled[Math.min(index + 7, enabled.length - 1)]); break;
            case 'PageUp': activate(enabled[Math.max(0, index - 7)]); break;
            case 'Enter':
            case ' ': choose(active); break;
            case 'Escape': close(true); break;
            case 'Tab': close(true); return;
            default: {
                if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
                const key = event.key.toLocaleLowerCase();
                const previous = Date.now() - current.lastKey < 700 ? current.query : '';
                current.query = previous === key ? key : previous + key;
                current.lastKey = Date.now();
                const start = index + (current.query.length === 1 ? 1 : 0);
                const ordered = enabled.slice(start).concat(enabled.slice(0, start));
                const match = ordered.find(i => select.options[i].label.trim().toLocaleLowerCase().startsWith(current.query));
                if (match !== undefined) activate(match);
            }
        }
        event.preventDefault();
        event.stopPropagation();
    });

    document.addEventListener('pointerdown', event => {
        if (current && !popup.contains(event.target) && event.target !== current.select) close();
    }, true);
    document.addEventListener('focusin', event => {
        if (current && !popup.contains(event.target) && event.target !== current.select) close();
    });
    document.addEventListener('scroll', event => {
        if (current && !popup.contains(event.target)) position();
    }, { capture: true, passive: true });
    window.addEventListener('resize', position);
    window.visualViewport?.addEventListener('resize', position);
    window.visualViewport?.addEventListener('scroll', position);
})();
