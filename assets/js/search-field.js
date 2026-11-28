(() => {
    const fieldSelector = 'input[data-lufel-search]';
    const actionSelector = 'button[data-lufel-search-action]';
    const labels = {
        kr: { search: '검색', clear: '검색어 지우기' },
        en: { search: 'Search', clear: 'Clear search' },
        jp: { search: '検索', clear: '検索語を消去' },
        cn: { search: '搜索', clear: '清除搜索词' }
    };
    const generatedLabels = new WeakSet();

    function getLabels() {
        const lang = window.LanguageRouter?.getCurrentLanguage?.()
            || document.documentElement.lang.toLowerCase().split('-')[0];
        return labels[lang === 'ko' ? 'kr' : lang === 'ja' ? 'jp' : lang === 'zh' ? 'cn' : lang] || labels.en;
    }

    function labelControl(control) {
        if (control.hasAttribute('aria-labelledby') || control.labels?.length) return;
        if (control.hasAttribute('aria-label') && !generatedLabels.has(control)) return;

        const copy = getLabels();
        const placeholder = control.getAttribute('placeholder')?.trim();
        const name = control.matches(actionSelector)
            ? (control.dataset.lufelSearchAction === 'clear' ? copy.clear : copy.search)
            : (placeholder?.replace(/(?:\.{3}|\u2026)$/, '').trim() || copy.search);
        control.setAttribute('aria-label', name === '-' ? copy.search : name);
        generatedLabels.add(control);
    }

    function bindSuggestions(input) {
        const menu = document.getElementById(input.dataset.lufelSearchResults);
        if (!menu || input.hasAttribute('aria-controls')) return;

        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-controls', menu.id);
        menu.setAttribute('role', 'listbox');
        let active = -1;
        let options = [];

        function highlight(index) {
            if (options[active]) options[active].setAttribute('aria-selected', 'false');
            active = index;
            const option = options[active];
            if (option) {
                option.setAttribute('aria-selected', 'true');
                input.setAttribute('aria-activedescendant', option.id);
                option.scrollIntoView({ block: 'nearest' });
            } else {
                input.removeAttribute('aria-activedescendant');
            }
        }

        function refresh() {
            highlight(-1);
            options = menu.getClientRects().length ? [...menu.querySelectorAll('.dropdown-item')] : [];
            input.setAttribute('aria-expanded', String(options.length > 0));
            options.forEach((option, index) => {
                option.id ||= `${menu.id}-option-${index + 1}`;
                option.setAttribute('role', 'option');
                option.setAttribute('aria-selected', 'false');
            });
        }

        refresh();
        new MutationObserver(refresh).observe(menu, { childList: true, attributes: true, attributeFilter: ['style', 'hidden'] });
        input.addEventListener('input', () => highlight(-1));
        input.addEventListener('keydown', event => {
            if (event.isComposing || event.keyCode === 229 || !options.length) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                menu.style.display = 'none';
            } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                const delta = event.key === 'ArrowDown' ? 1 : -1;
                highlight(active === -1 && delta === -1
                    ? options.length - 1
                    : (active + delta + options.length) % options.length);
            } else if (event.key === 'Enter' && options[active]) {
                event.preventDefault();
                event.stopImmediatePropagation();
                options[active].click();
            }
        }, true);
    }

    document.querySelectorAll('input[data-lufel-search-results]').forEach(bindSuggestions);

    function labelTree(root) {
        if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
        if (root.matches?.(fieldSelector + ',' + actionSelector)) labelControl(root);
        root.querySelectorAll(fieldSelector + ',' + actionSelector).forEach(labelControl);
    }

    labelTree(document);
    new MutationObserver(records => {
        for (const record of records) {
            if (record.type === 'attributes') {
                if (record.target.matches(fieldSelector)) labelControl(record.target);
            } else {
                record.addedNodes.forEach(labelTree);
            }
        }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder'] });
})();
