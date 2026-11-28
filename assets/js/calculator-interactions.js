(() => {
    const tables = '.critical-table, .defense-table, .penetrate-table';
    const controls = 'a[href], button, input, label, select, textarea, [role="button"], [role="combobox"], [role="listbox"]';
    const mobile = window.matchMedia('(max-width: 1200px)');
    let detailId = 0;

    function enhanceRow(row, durationCell, noteCell, labels) {
        row.classList.add('calc-mobile-row');
        const duration = durationCell.textContent.trim();
        const hasDuration = duration && duration !== '-';
        const hasNote = Boolean(noteCell.textContent.trim());
        if (!hasDuration && !hasNote) return;

        const noteLabel = labels.note || '비고';
        const durationLabel = labels.duration || '지속';
        if (hasNote) {
            const label = document.createElement('span');
            label.className = 'calc-mobile-detail-label';
            label.textContent = noteLabel;
            const value = document.createElement('span');
            value.append(...noteCell.childNodes);
            noteCell.append(label, value);
        }
        if (hasDuration) {
            const mobileDuration = document.createElement('div');
            mobileDuration.className = 'calc-mobile-duration';
            const label = document.createElement('span');
            label.className = 'calc-mobile-detail-label';
            label.textContent = durationLabel;
            const value = document.createElement('span');
            value.textContent = duration;
            mobileDuration.append(label, value);
            noteCell.prepend(mobileDuration);
        }

        noteCell.id = 'calc-row-detail-' + ++detailId;
        const toggleCell = document.createElement('td');
        toggleCell.className = 'calc-row-details-cell';
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'calc-row-details-toggle';
        const skillName = row.querySelector('.skill-name-column')?.textContent.trim();
        const captions = [skillName, hasDuration && durationLabel, hasNote && noteLabel];
        toggle.setAttribute('aria-label', captions.filter(Boolean).join(' · '));
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', noteCell.id);
        toggle.addEventListener('click', () => {
            const expanded = row.classList.toggle('calc-details-open');
            toggle.setAttribute('aria-expanded', String(expanded));
        });
        toggleCell.appendChild(toggle);
        row.appendChild(toggleCell);
        row.classList.add('calc-has-details');
    }

    window.CalculatorInteractions = { enhanceRow };

    document.addEventListener('click', event => {
        const target = event.target;
        if (event.defaultPrevented || !(target instanceof Element) || target.closest(controls)) return;

        const row = target.closest('tr.group-row');
        if (!row?.closest(tables)) return;
        if (mobile.matches && target.closest('.calc-details-open .note-column')) return;

        const checkbox = row.querySelector('.check-column img');
        if (!checkbox || target === checkbox) return;

        const selection = window.getSelection();
        if (selection && !selection.isCollapsed && selection.containsNode(row, true)) return;

        checkbox.click();
    });
})();
