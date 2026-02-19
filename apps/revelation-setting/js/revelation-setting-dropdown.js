(function () {
    'use strict';

    function createManager(deps) {
        const d = (deps && typeof deps === 'object') ? deps : {};
        const derivePngFromWebp = typeof d.derivePngFromWebp === 'function'
            ? d.derivePngFromWebp
            : (() => '');

        let openDropdownRoot = null;

        function closeOpenDropdown() {
            if (openDropdownRoot) {
                openDropdownRoot.classList.remove('open');
                openDropdownRoot = null;
            }
        }

        function buildCustomDropdown(config) {
            const host = config.host;
            if (!host) return;

            host.innerHTML = '';

            const items = Array.isArray(config.items) ? config.items : [];
            const includeEmpty = !!config.includeEmptyOption;
            const disabled = !!config.disabled;
            const currentValue = String(config.value || '');
            const placeholder = config.placeholder || '';

            const allItems = includeEmpty
                ? [{ value: '', label: placeholder, icon: '' }, ...items]
                : items;

            const root = document.createElement('div');
            root.className = 'rs-custom-dropdown';

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'rs-dropdown-button';
            if (disabled) {
                button.disabled = true;
                button.classList.add('is-disabled');
            }

            const icon = document.createElement('img');
            icon.className = 'rs-dropdown-icon';
            icon.alt = '';
            icon.hidden = true;

            const text = document.createElement('span');
            text.className = 'rs-dropdown-text';

            const arrow = document.createElement('span');
            arrow.className = 'rs-dropdown-arrow';
            arrow.setAttribute('aria-hidden', 'true');

            button.appendChild(icon);
            button.appendChild(text);
            button.appendChild(arrow);

            const menu = document.createElement('div');
            menu.className = 'rs-dropdown-menu';

            function setButtonView(value) {
                const selected = allItems.find((item) => String(item.value) === String(value));
                const isPlaceholder = !selected || String(selected.value) === '';
                const label = selected ? selected.label : placeholder;
                const iconPath = selected ? (selected.icon || '') : '';

                button.classList.toggle('is-placeholder', isPlaceholder);
                text.textContent = label || placeholder;

                if (iconPath) {
                    icon.src = iconPath;
                    icon.hidden = false;
                    icon.onerror = function onIconError() {
                        const fallback = derivePngFromWebp(this.src);
                        if (fallback && this.src !== fallback) {
                            this.src = fallback;
                            return;
                        }
                        this.hidden = true;
                    };
                } else {
                    icon.hidden = true;
                    icon.removeAttribute('src');
                }
            }

            allItems.forEach((item) => {
                const option = document.createElement('button');
                option.type = 'button';
                option.className = 'rs-dropdown-option';
                option.setAttribute('data-value', String(item.value || ''));
                option.setAttribute('data-label', String(item.label || ''));

                const optionDisabled = disabled || !!item.disabled;
                if (optionDisabled) option.disabled = true;
                if (String(item.value) === currentValue) option.classList.add('active');
                if (String(item.value) === '') option.classList.add('is-empty');
                if (item.className) option.classList.add(item.className);

                const optionIcon = document.createElement('img');
                optionIcon.className = 'rs-dropdown-option-icon';
                optionIcon.alt = '';
                if (item.icon) {
                    optionIcon.src = item.icon;
                    optionIcon.hidden = false;
                    optionIcon.onerror = function onOptionIconError() {
                        const fallback = derivePngFromWebp(this.src);
                        if (fallback && this.src !== fallback) {
                            this.src = fallback;
                            return;
                        }
                        this.hidden = true;
                    };
                } else {
                    optionIcon.hidden = true;
                }

                const optionLabel = document.createElement('span');
                optionLabel.className = 'rs-dropdown-option-label';
                optionLabel.textContent = item.label || '';

                option.appendChild(optionIcon);
                option.appendChild(optionLabel);

                const actionItems = [];
                if (item && Array.isArray(item.actions)) {
                    item.actions.forEach((action) => {
                        if (action && action.type) {
                            actionItems.push(action);
                        }
                    });
                } else {
                    const itemAction = item && typeof item.action === 'object' ? item.action : null;
                    if (itemAction && itemAction.type) {
                        actionItems.push(itemAction);
                    }
                }

                if (actionItems.length > 0 && !optionDisabled) {
                    option.classList.add('has-action');
                    if (actionItems.length > 1) {
                        option.classList.add('has-multi-action');
                    }

                    const actionWrap = document.createElement('span');
                    actionWrap.className = 'rs-dropdown-option-actions';

                    actionItems.forEach((actionItem) => {
                        const actionButton = document.createElement('span');
                        actionButton.className = 'rs-dropdown-option-action';
                        actionButton.setAttribute('role', 'button');
                        actionButton.setAttribute('tabindex', '0');
                        actionButton.setAttribute('aria-label', String(actionItem.label || ''));
                        actionButton.title = String(actionItem.label || '');
                        actionButton.textContent = String(actionItem.iconText || '✎');

                        const triggerAction = (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (typeof config.onItemAction === 'function') {
                                config.onItemAction(String(item.value || ''), String(actionItem.type || ''), item);
                            }
                        };

                        actionButton.addEventListener('click', triggerAction);
                        actionButton.addEventListener('keydown', (event) => {
                            if (event.key !== 'Enter' && event.key !== ' ') return;
                            triggerAction(event);
                        });

                        actionWrap.appendChild(actionButton);
                    });

                    option.appendChild(actionWrap);
                }

                option.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (optionDisabled) return;
                    if (typeof config.onChange === 'function') {
                        config.onChange(String(item.value || ''));
                    }
                    closeOpenDropdown();
                });

                menu.appendChild(option);
            });

            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (disabled) return;

                if (openDropdownRoot && openDropdownRoot !== root) {
                    openDropdownRoot.classList.remove('open');
                }

                const nextOpen = !root.classList.contains('open');
                root.classList.toggle('open', nextOpen);
                openDropdownRoot = nextOpen ? root : null;
            });

            setButtonView(currentValue);

            root.appendChild(button);
            root.appendChild(menu);
            host.appendChild(root);
        }

        return {
            closeOpenDropdown,
            buildCustomDropdown
        };
    }

    window.RevelationSettingDropdown = {
        createManager
    };
})();
