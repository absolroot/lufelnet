(function () {
    'use strict';

    const LZ_STRING_URLS = [
        'https://cdn.jsdelivr.net/npm/lz-string@1.4.4/libs/lz-string.min.js',
        'https://unpkg.com/lz-string@1.4.4/libs/lz-string.min.js'
    ];

    function normalizeDependencies(deps) {
        const raw = (deps && typeof deps === 'object') ? deps : {};
        return {
            dom: raw.dom || {},
            t: (typeof raw.t === 'function') ? raw.t : ((key, fallback) => fallback || key),
            showToast: (typeof raw.showToast === 'function') ? raw.showToast : (() => { }),
            applySharedPayload: (typeof raw.applySharedPayload === 'function') ? raw.applySharedPayload : (async () => false),
            getSharePayload: (typeof raw.getSharePayload === 'function') ? raw.getSharePayload : (() => null),
            gasUrl: String(raw.gasUrl || ''),
            shareQueryKey: String(raw.shareQueryKey || 'bin'),
            shareTypeQueryKey: String(raw.shareTypeQueryKey || 'shareType'),
            shareType: String(raw.shareType || ''),
            sharePayloadVersion: Number.isFinite(Number(raw.sharePayloadVersion)) ? Number(raw.sharePayloadVersion) : 1
        };
    }

    async function ensureLzString() {
        if (typeof window.LZString !== 'undefined') return true;

        const existingScript = document.querySelector('script[data-share-character-lz-string="true"]');
        if (existingScript) {
            return new Promise((resolve) => {
                const complete = () => resolve(typeof window.LZString !== 'undefined');
                existingScript.addEventListener('load', complete, { once: true });
                existingScript.addEventListener('error', () => resolve(false), { once: true });
                window.setTimeout(complete, 1500);
            });
        }

        for (const src of LZ_STRING_URLS) {
            const loaded = await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.dataset.shareCharacterLzString = 'true';
                script.onload = () => resolve(true);
                script.onerror = () => {
                    script.remove();
                    resolve(false);
                };
                document.head.appendChild(script);
            });
            if (loaded && typeof window.LZString !== 'undefined') {
                return true;
            }
        }

        return false;
    }

    function copyText(text) {
        if (!text) return Promise.resolve(false);
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            return navigator.clipboard.writeText(text).then(() => true);
        }

        return new Promise((resolve) => {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', 'readonly');
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                const ok = document.execCommand('copy');
                textarea.remove();
                resolve(!!ok);
            } catch (_) {
                resolve(false);
            }
        });
    }

    function createLoadingOverlay(id, message) {
        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.className = 'sc-loading-overlay';
        overlay.innerHTML = `
            <div class="sc-loading-card">
                <div class="sc-loading-spinner" aria-hidden="true"></div>
                <div class="sc-loading-text">${message}</div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    function removeLoadingOverlay(id) {
        const overlay = document.getElementById(id);
        if (overlay) overlay.remove();
    }

    function parseEncodedPayload(rawData, expectedVersion) {
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
        if (String(payload.kind || '') !== 'share-character') return null;
        if (Number(payload.version) !== Number(expectedVersion)) return null;
        if (!payload.entries || typeof payload.entries !== 'object' || Array.isArray(payload.entries)) return null;
        return payload;
    }

    function createController(deps) {
        const d = normalizeDependencies(deps);

        async function tryLoadSharedFromUrl() {
            const params = new URLSearchParams(window.location.search || '');
            const binId = String(params.get(d.shareQueryKey) || '').trim();
            const shareType = String(params.get(d.shareTypeQueryKey) || '').trim();
            if (!binId) return false;

            createLoadingOverlay('scShareLoadOverlay', d.t('msg_share_loading', 'Loading shared roster...'));
            try {
                await ensureLzString();
                const requestParams = new URLSearchParams({ id: binId });
                if (shareType) {
                    requestParams.set(d.shareTypeQueryKey, shareType);
                }
                const response = await fetch(`${d.gasUrl}?${requestParams.toString()}`);
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

                const payload = parseEncodedPayload(encodedData, d.sharePayloadVersion);
                if (!payload) {
                    throw new Error('Invalid shared payload');
                }

                const applied = await d.applySharedPayload(payload);
                if (!applied) {
                    throw new Error('Failed to apply shared payload');
                }

                d.showToast(d.t('msg_share_loaded', 'Shared roster loaded.'), 'success');
                return true;
            } catch (error) {
                console.error('[share-character] shared payload load failed:', error);
                d.showToast(d.t('msg_share_load_failed', 'Failed to load shared link.'), 'error');
                return false;
            } finally {
                removeLoadingOverlay('scShareLoadOverlay');
            }
        }

        async function handleShareClick() {
            const payload = d.getSharePayload();
            if (!payload) {
                d.showToast(d.t('msg_share_failed', 'Failed to create share link.'), 'error');
                return;
            }

            if (d.dom.shareBtn) d.dom.shareBtn.disabled = true;
            createLoadingOverlay('scShareOverlay', d.t('msg_share_generating', 'Generating share link...'));

            try {
                let jsonString = JSON.stringify(payload);
                const hasLzString = await ensureLzString();
                if (hasLzString && typeof LZString !== 'undefined') {
                    jsonString = LZString.compressToEncodedURIComponent(jsonString);
                }

                const response = await fetch(d.gasUrl, {
                    method: 'POST',
                    body: JSON.stringify({
                        data: jsonString,
                        shareType: d.shareType
                    })
                });
                if (!response.ok) {
                    throw new Error(`Failed to share payload: ${response.status}`);
                }

                const result = await response.json();
                const binId = String((result && (result.id || result.bin)) || '').trim();
                if (!binId) {
                    throw new Error('No bin id returned from GAS');
                }

                const shareParams = new URLSearchParams({
                    [d.shareQueryKey]: binId
                });
                if (d.shareType) {
                    shareParams.set(d.shareTypeQueryKey, d.shareType);
                }
                const shareUrl = `${window.location.origin}${window.location.pathname}?${shareParams.toString()}`;
                const copied = await copyText(shareUrl);
                if (!copied) {
                    throw new Error('Clipboard unavailable');
                }

                d.showToast(d.t('msg_share_success', 'Share link copied to clipboard.'), 'success');
            } catch (error) {
                console.error('[share-character] share failed:', error);
                d.showToast(d.t('msg_share_failed', 'Failed to create share link.'), 'error');
            } finally {
                removeLoadingOverlay('scShareOverlay');
                if (d.dom.shareBtn) d.dom.shareBtn.disabled = false;
            }
        }

        return {
            tryLoadSharedFromUrl,
            handleShareClick
        };
    }

    window.ShareCharacterShareBackup = {
        createController
    };
})();
