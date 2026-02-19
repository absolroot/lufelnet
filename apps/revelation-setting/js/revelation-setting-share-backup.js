(function () {
    'use strict';

    function normalizeDependencies(deps) {
        const raw = (deps && typeof deps === 'object') ? deps : {};
        return {
            state: raw.state || {},
            dom: raw.dom || {},
            t: (typeof raw.t === 'function') ? raw.t : ((key, fallback) => fallback || key),
            showToast: (typeof raw.showToast === 'function') ? raw.showToast : (() => { }),
            clearError: (typeof raw.clearError === 'function') ? raw.clearError : (() => { }),
            collectRevelationSettingStorageEntries: (typeof raw.collectRevelationSettingStorageEntries === 'function')
                ? raw.collectRevelationSettingStorageEntries
                : (() => ({})),
            clearRevelationSettingStorageEntries: (typeof raw.clearRevelationSettingStorageEntries === 'function')
                ? raw.clearRevelationSettingStorageEntries
                : (() => { }),
            normalizeBackupEntries: (typeof raw.normalizeBackupEntries === 'function')
                ? raw.normalizeBackupEntries
                : (() => null),
            handleCharacterSelection: (typeof raw.handleCharacterSelection === 'function')
                ? raw.handleCharacterSelection
                : (async () => { }),
            renderPresetDropdown: (typeof raw.renderPresetDropdown === 'function') ? raw.renderPresetDropdown : (() => { }),
            renderMainRevelationDropdown: (typeof raw.renderMainRevelationDropdown === 'function') ? raw.renderMainRevelationDropdown : (() => { }),
            renderSubRevelationDropdown: (typeof raw.renderSubRevelationDropdown === 'function') ? raw.renderSubRevelationDropdown : (() => { }),
            renderSlotCards: (typeof raw.renderSlotCards === 'function') ? raw.renderSlotCards : (() => { }),
            renderPreview: (typeof raw.renderPreview === 'function') ? raw.renderPreview : (() => { }),
            renderCharacterSelector: (typeof raw.renderCharacterSelector === 'function') ? raw.renderCharacterSelector : (() => { }),
            syncActivePresetFromEditorState: (typeof raw.syncActivePresetFromEditorState === 'function') ? raw.syncActivePresetFromEditorState : (() => { }),
            clonePackedBuild: (typeof raw.clonePackedBuild === 'function') ? raw.clonePackedBuild : ((value) => value),
            createEmptyPackedBuild: (typeof raw.createEmptyPackedBuild === 'function')
                ? raw.createEmptyPackedBuild
                : (() => ({ m: '', s: '', a: [] })),
            normalizePresetStorePayload: (typeof raw.normalizePresetStorePayload === 'function')
                ? raw.normalizePresetStorePayload
                : (() => null),
            applyPresetStoreToState: (typeof raw.applyPresetStoreToState === 'function') ? raw.applyPresetStoreToState : (() => { }),
            applyPackedBuildToEditorState: (typeof raw.applyPackedBuildToEditorState === 'function')
                ? raw.applyPackedBuildToEditorState
                : (() => { }),
            ensureSlotDefaults: (typeof raw.ensureSlotDefaults === 'function') ? raw.ensureSlotDefaults : (() => { }),
            createInitialSlotState: (typeof raw.createInitialSlotState === 'function') ? raw.createInitialSlotState : (() => ({})),
            setCharacterPanelOpen: (typeof raw.setCharacterPanelOpen === 'function') ? raw.setCharacterPanelOpen : (() => { }),
            defaultPresetId: String(raw.defaultPresetId || 'default'),
            sharePayloadVersion: Number.isFinite(Number(raw.sharePayloadVersion)) ? Number(raw.sharePayloadVersion) : 1,
            shareQueryKey: String(raw.shareQueryKey || 'bin'),
            gasUrl: String(raw.gasUrl || '')
        };
    }

    function createController(deps) {
        const d = normalizeDependencies(deps);

        function buildSharePresetStoreFromActivePreset() {
            d.syncActivePresetFromEditorState();

            const activePresetId = String(d.state.activePresetId || '').trim();
            const sourceBuild = d.state.presetMap[activePresetId]
                || d.state.presetMap[d.defaultPresetId]
                || d.createEmptyPackedBuild();

            return {
                v: 2,
                active: d.defaultPresetId,
                order: [d.defaultPresetId],
                map: {
                    [d.defaultPresetId]: d.clonePackedBuild(sourceBuild)
                },
                names: {}
            };
        }

        function createSharePayload() {
            const characterName = String(d.state.selectedCharacter || '').trim();
            if (!characterName) return null;

            return {
                'revelation-setting-share-ver': d.sharePayloadVersion,
                character: characterName,
                store: buildSharePresetStoreFromActivePreset()
            };
        }

        function parseSharePayload(rawData) {
            let jsonString = String(rawData || '').trim();
            if (!jsonString) return null;

            if (typeof LZString !== 'undefined') {
                const decompressed = LZString.decompressFromEncodedURIComponent(jsonString);
                if (decompressed) {
                    jsonString = decompressed;
                }
            }

            let payload = null;
            try {
                payload = JSON.parse(jsonString);
            } catch (_) {
                return null;
            }

            if (!payload || typeof payload !== 'object') return null;
            const payloadVersion = Number(payload['revelation-setting-share-ver']);
            if (!Number.isFinite(payloadVersion) || payloadVersion < 1) return null;

            const characterName = String(payload.character || '').trim();
            if (!characterName) return null;

            const normalizedStore = d.normalizePresetStorePayload(payload.store);
            if (!normalizedStore) return null;

            return {
                character: characterName,
                store: normalizedStore
            };
        }

        function applySharedPayload(sharedPayload) {
            if (!sharedPayload || typeof sharedPayload !== 'object') return false;

            const characterName = String(sharedPayload.character || '').trim();
            if (!characterName) return false;

            const normalizedStore = d.normalizePresetStorePayload(sharedPayload.store);
            if (!normalizedStore) return false;

            d.state.selectedCharacter = characterName;
            d.state.mainRev = '';
            d.state.subRev = '';
            d.state.slots = d.createInitialSlotState();

            d.applyPresetStoreToState(normalizedStore);
            const activeBuild = d.state.presetMap[d.state.activePresetId]
                || d.state.presetMap[d.defaultPresetId]
                || d.createEmptyPackedBuild();
            d.applyPackedBuildToEditorState(activeBuild);
            d.ensureSlotDefaults();

            d.renderCharacterSelector();
            d.renderPresetDropdown();
            d.renderMainRevelationDropdown();
            d.renderSubRevelationDropdown();
            d.renderSlotCards();
            d.renderPreview();
            d.setCharacterPanelOpen(false);
            d.clearError();
            return true;
        }

        async function tryLoadSharedFromUrl() {
            let binId = '';
            try {
                const params = new URLSearchParams(window.location.search || '');
                binId = String(params.get(d.shareQueryKey) || '').trim();
            } catch (_) {
                return false;
            }

            if (!binId) return false;
            showSharedLoadModal();

            try {
                const response = await fetch(`${d.gasUrl}?id=${encodeURIComponent(binId)}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch shared payload: ${response.status}`);
                }

                const result = await response.json();
                const encodedData = result && typeof result === 'object'
                    ? String(result.data || '').trim()
                    : '';
                if (!encodedData) {
                    throw new Error('Shared payload not found');
                }

                const sharedPayload = parseSharePayload(encodedData);
                if (!sharedPayload) {
                    throw new Error('Invalid shared payload');
                }

                return applySharedPayload(sharedPayload);
            } catch (error) {
                console.error('[revelation-setting] shared payload load failed:', error);
                d.showToast(d.t('msg_share_load_failed', 'Failed to load shared link.'), 'error');
                return false;
            } finally {
                hideSharedLoadModal();
            }
        }

        function hideShareLoadingModal() {
            const modal = document.getElementById('rsShareLoadingModal');
            if (modal) {
                modal.remove();
            }
        }

        function hideSharedLoadModal() {
            const modal = document.getElementById('rsSharedLoadModal');
            if (modal) {
                modal.remove();
            }
        }

        function showShareLoadingModal() {
            hideShareLoadingModal();

            const modal = document.createElement('div');
            modal.id = 'rsShareLoadingModal';
            modal.style.cssText = [
                'position:fixed',
                'inset:0',
                'background:rgba(0,0,0,0.7)',
                'display:flex',
                'align-items:center',
                'justify-content:center',
                'z-index:10000'
            ].join(';');

            const content = document.createElement('div');
            content.style.cssText = [
                'background:#2a2a2a',
                'padding:32px',
                'border-radius:12px',
                'text-align:center',
                'max-width:400px',
                'box-shadow:0 4px 20px rgba(0, 0, 0, 0.5)'
            ].join(';');

            content.innerHTML = `
                <div style="margin-bottom:20px;">
                    <div class="rs-share-loading-spinner" style="
                        border:3px solid rgba(255, 255, 255, 0.1);
                        border-top:3px solid #fff;
                        border-radius:50%;
                        width:40px;
                        height:40px;
                        margin:0 auto;
                    "></div>
                </div>
                <div style="color:#fff;font-size:16px;margin-bottom:16px;">
                    ${d.t('msg_share_generating', 'Generating share link...')}
                </div>
                <div style="color:rgba(255, 255, 255, 0.6);font-size:13px;line-height:1.6;">
                    ${d.t('msg_share_warning', 'This URL is a convenience feature and may be corrupted.<br>For safe backup, please use the backup feature.')}
                </div>
            `;

            modal.appendChild(content);
            document.body.appendChild(modal);

            if (!document.getElementById('rsShareLoadingSpinnerStyle')) {
                const style = document.createElement('style');
                style.id = 'rsShareLoadingSpinnerStyle';
                style.textContent = `
                    @keyframes rs-share-spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .rs-share-loading-spinner {
                        animation: rs-share-spin 1s linear infinite;
                    }
                `;
                document.head.appendChild(style);
            }
        }

        function showSharedLoadModal() {
            hideSharedLoadModal();

            const modal = document.createElement('div');
            modal.id = 'rsSharedLoadModal';
            modal.style.cssText = [
                'position:fixed',
                'inset:0',
                'background:rgba(0,0,0,0.7)',
                'display:flex',
                'align-items:center',
                'justify-content:center',
                'z-index:10000'
            ].join(';');

            const content = document.createElement('div');
            content.style.cssText = [
                'background:#2a2a2a',
                'padding:28px',
                'border-radius:12px',
                'text-align:center',
                'max-width:360px',
                'box-shadow:0 4px 20px rgba(0, 0, 0, 0.5)'
            ].join(';');

            content.innerHTML = `
                <div style="margin-bottom:14px;">
                    <div class="rs-share-loading-spinner" style="
                        border:3px solid rgba(255, 255, 255, 0.1);
                        border-top:3px solid #fff;
                        border-radius:50%;
                        width:36px;
                        height:36px;
                        margin:0 auto;
                    "></div>
                </div>
                <div style="color:#fff;font-size:15px;line-height:1.5;">
                    ${d.t('msg_share_loading_shared', 'Loading shared setup...')}
                </div>
            `;

            modal.appendChild(content);
            document.body.appendChild(modal);

            if (!document.getElementById('rsShareLoadingSpinnerStyle')) {
                const style = document.createElement('style');
                style.id = 'rsShareLoadingSpinnerStyle';
                style.textContent = `
                    @keyframes rs-share-spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .rs-share-loading-spinner {
                        animation: rs-share-spin 1s linear infinite;
                    }
                `;
                document.head.appendChild(style);
            }
        }

        async function handleShareClick() {
            if (!d.state.selectedCharacter) {
                d.showToast(d.t('msg_preview_empty', 'Please select a character first.'), 'error');
                return;
            }

            const payload = createSharePayload();
            if (!payload) {
                d.showToast(d.t('msg_preview_empty', 'Please select a character first.'), 'error');
                return;
            }

            showShareLoadingModal();
            if (d.dom.shareBtn) {
                d.dom.shareBtn.disabled = true;
                d.dom.shareBtn.style.opacity = '0.6';
            }

            try {
                let jsonString = JSON.stringify(payload);
                if (typeof LZString !== 'undefined') {
                    jsonString = LZString.compressToEncodedURIComponent(jsonString);
                }

                const response = await fetch(d.gasUrl, {
                    method: 'POST',
                    body: JSON.stringify({ data: jsonString })
                });
                if (!response.ok) {
                    throw new Error(`Failed to share payload: ${response.status}`);
                }

                const result = await response.json();
                const binId = String((result && result.id) || '').trim();
                if (!binId) {
                    throw new Error('No bin id returned from GAS');
                }

                const shareUrl = `${window.location.origin}${window.location.pathname}?${d.shareQueryKey}=${encodeURIComponent(binId)}`;
                await navigator.clipboard.writeText(shareUrl);
                d.showToast(d.t('msg_share_success', 'Link copied to clipboard!'));
            } catch (error) {
                console.error('[revelation-setting] share failed:', error);
                d.showToast(d.t('msg_share_failed', 'Failed to share.'), 'error');
            } finally {
                hideShareLoadingModal();
                if (d.dom.shareBtn) {
                    d.dom.shareBtn.disabled = false;
                    d.dom.shareBtn.style.opacity = '1';
                }
            }
        }

        async function handleBackupExport() {
            if (typeof window.localStorage === 'undefined') {
                d.showToast(d.t('msg_backup_failed', 'Backup failed.'), 'error');
                return;
            }
            if (d.dom.backupBtn) d.dom.backupBtn.disabled = true;

            try {
                const payload = {
                    format: 'revelation-setting-backup',
                    version: 1,
                    exported_at: new Date().toISOString(),
                    entries: d.collectRevelationSettingStorageEntries()
                };

                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const objectUrl = URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = objectUrl;
                anchor.download = `revelation-setting-backup_${Date.now()}.json`;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                URL.revokeObjectURL(objectUrl);

                d.showToast(d.t('msg_backup_success', 'Backup downloaded.'));
            } catch (error) {
                console.error('[revelation-setting] backup export failed:', error);
                d.showToast(d.t('msg_backup_failed', 'Backup failed.'), 'error');
            } finally {
                if (d.dom.backupBtn) d.dom.backupBtn.disabled = false;
            }
        }

        async function handleBackupImportFromFile(file) {
            if (!file) return;
            if (typeof window.localStorage === 'undefined') {
                d.showToast(d.t('msg_load_backup_failed', 'Failed to load backup.'), 'error');
                return;
            }
            if (d.dom.loadBtn) d.dom.loadBtn.disabled = true;

            try {
                const fileText = await file.text();
                const parsed = JSON.parse(fileText);
                const entries = d.normalizeBackupEntries(parsed);
                if (!entries) {
                    d.showToast(d.t('msg_load_backup_invalid', 'Invalid backup file format.'), 'error');
                    return;
                }

                d.clearRevelationSettingStorageEntries();
                Object.keys(entries).forEach((key) => {
                    window.localStorage.setItem(key, entries[key]);
                });

                if (d.state.selectedCharacter) {
                    await d.handleCharacterSelection(d.state.selectedCharacter);
                } else {
                    d.renderPresetDropdown();
                    d.renderMainRevelationDropdown();
                    d.renderSubRevelationDropdown();
                    d.renderSlotCards();
                    d.renderPreview();
                }

                d.showToast(d.t('msg_load_backup_success', 'Backup loaded.'));
            } catch (error) {
                console.error('[revelation-setting] backup import failed:', error);
                d.showToast(d.t('msg_load_backup_failed', 'Failed to load backup.'), 'error');
            } finally {
                if (d.dom.backupFileInput) {
                    d.dom.backupFileInput.value = '';
                }
                if (d.dom.loadBtn) d.dom.loadBtn.disabled = false;
            }
        }

        function handleBackupImportClick() {
            if (!d.dom.backupFileInput) return;
            d.dom.backupFileInput.click();
        }

        return {
            handleShareClick,
            tryLoadSharedFromUrl,
            handleBackupExport,
            handleBackupImportFromFile,
            handleBackupImportClick
        };
    }

    window.RevelationSettingShareBackup = {
        createController
    };
})();
