/* eslint-disable */
(function () {
    function $(sel) { return document.querySelector(sel); }
    function openModal(id) { const el = document.getElementById(id); if (el) el.setAttribute('aria-hidden', 'false'); }
    function closeModal(id) { const el = document.getElementById(id); if (el) el.setAttribute('aria-hidden', 'true'); }

    function t(key, fallback = '') {
        if (typeof window.t === 'function') {
            return window.t(key, fallback || key);
        }
        return fallback || key;
    }

    function currentLang() {
        if (typeof window.getCurrentLang === 'function') {
            const lang = window.getCurrentLang();
            if (lang) return lang;
        }
        if (window.MaterialPlanner && typeof window.MaterialPlanner.getLang === 'function') {
            const lang = window.MaterialPlanner.getLang();
            if (lang) return lang;
        }
        return 'kr';
    }

    function download(filename, text) {
        const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }

    function onBackup() {
        if (!window.MaterialPlanner) {
            alert(t('noPlanner', 'Planner is not initialized.'));
            return;
        }

        const hasFull = typeof window.MaterialPlanner.exportFullState === 'function';
        const full = hasFull ? window.MaterialPlanner.exportFullState() : null;
        const basic = (!full && typeof window.MaterialPlanner.exportState === 'function')
            ? window.MaterialPlanner.exportState()
            : null;

        const langVal = full?.lang || basic?.lang || currentLang();
        const ts = new Date();
        const pad = n => String(n).padStart(2, '0');
        const fname = `material_planner_backup_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.json`;

        let payload;
        if (full) {
            payload = {
                type: 'material_planner_full_backup',
                version: 2,
                lang: langVal,
                timestamp: ts.toISOString(),
                state: full
            };
        } else {
            payload = {
                type: 'material_planner_inventory_backup',
                version: 1,
                lang: langVal,
                timestamp: ts.toISOString(),
                inventory: basic?.inventory || {}
            };
        }

        download(fname, JSON.stringify(payload, null, 2));
    }

    let fileInput;
    function ensureFileInput() {
        if (fileInput) return fileInput;
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        return fileInput;
    }

    let pendingInventory = null;
    let pendingFullState = null;

    function clearPending() {
        pendingInventory = null;
        pendingFullState = null;
    }

    function onLoad() {
        const inp = ensureFileInput();
        inp.value = '';
        inp.onchange = async () => {
            const file = inp.files && inp.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const data = JSON.parse(text);
                clearPending();

                if (data && typeof data === 'object') {
                    if (data.state && typeof data.state === 'object') {
                        pendingFullState = data.state;
                    } else if (data.type === 'material_planner_full_backup' && data.version >= 2) {
                        pendingFullState = data;
                    } else if (Array.isArray(data.plans) && data.inventory && typeof data.inventory === 'object') {
                        pendingFullState = data;
                    } else {
                        const inv = (data.inventory && typeof data.inventory === 'object') ? data.inventory : data;
                        if (inv && typeof inv === 'object' && !Array.isArray(inv)) {
                            pendingInventory = inv;
                        }
                    }
                }

                if (!pendingFullState && !pendingInventory) {
                    alert(t('invalidFile', 'Invalid file format.'));
                    return;
                }

                openModal('loadConfirmModal');
            } catch (_) {
                alert(t('loadError', 'Failed to read the file.'));
            }
        };

        inp.click();
    }

    function bindEvents() {
        const backupBtn = $('#backupBtn');
        const loadBtn = $('#loadBtn');
        const modal = $('#loadConfirmModal');
        const closeBtn = modal ? modal.querySelector('[data-close]') : null;
        const no = $('#loadNoBtn');
        const yes = $('#loadYesBtn');

        if (backupBtn && !backupBtn._bound) {
            backupBtn._bound = true;
            backupBtn.addEventListener('click', onBackup);
        }
        if (loadBtn && !loadBtn._bound) {
            loadBtn._bound = true;
            loadBtn.addEventListener('click', onLoad);
        }

        if (closeBtn && !closeBtn._bound) {
            closeBtn._bound = true;
            closeBtn.addEventListener('click', () => {
                clearPending();
                closeModal('loadConfirmModal');
            });
        }
        if (no && !no._bound) {
            no._bound = true;
            no.addEventListener('click', () => {
                clearPending();
                closeModal('loadConfirmModal');
            });
        }
        if (yes && !yes._bound) {
            yes._bound = true;
            yes.addEventListener('click', () => {
                if (!window.MaterialPlanner) {
                    alert(t('noPlanner', 'Planner is not initialized.'));
                    return;
                }

                if (pendingFullState && typeof window.MaterialPlanner.importFullState === 'function') {
                    window.MaterialPlanner.importFullState(pendingFullState);
                } else if (pendingInventory && typeof window.MaterialPlanner.importInventory === 'function') {
                    window.MaterialPlanner.importInventory(pendingInventory);
                }

                clearPending();
                closeModal('loadConfirmModal');
            });
        }
    }

    function init() {
        bindEvents();
    }

    window.MaterialPlannerExport = {
        init
    };
})();
