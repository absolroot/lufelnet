(function () {
    'use strict';

    function sanitizeFileToken(value) {
        return String(value || '')
            .trim()
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
            .replace(/\s+/g, '_')
            .slice(0, 48) || 'roster';
    }

    function resolveBaseUrl(rawBaseUrl) {
        const fromState = String(rawBaseUrl || '').trim();
        const fromWindow = (typeof window !== 'undefined' && typeof window.BASE_URL !== 'undefined')
            ? String(window.BASE_URL || '').trim()
            : '';
        return String(fromState || fromWindow || '').replace(/\/+$/, '');
    }

    async function ensureHtmlToImage() {
        if (window.htmlToImage) return;
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js';
            script.onload = resolve;
            script.onerror = () => {
                const fallback = document.createElement('script');
                fallback.src = 'https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js';
                fallback.onload = resolve;
                fallback.onerror = reject;
                document.head.appendChild(fallback);
            };
            document.head.appendChild(script);
        });
    }

    function loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }

    function getCapturePixelRatio(node) {
        const rect = node && typeof node.getBoundingClientRect === 'function'
            ? node.getBoundingClientRect()
            : { width: 1280, height: 720 };
        const width = Math.max(1, Math.round(rect.width || 1280));
        const height = Math.max(1, Math.round(rect.height || 720));

        const targetWidth = 1600;
        const maxRatio = 1.35;
        const minRatio = 1;
        const maxPixels = 10_000_000;

        const widthRatio = targetWidth / width;
        const pixelCapRatio = Math.sqrt(maxPixels / (width * height));
        const ratio = Math.min(maxRatio, widthRatio, pixelCapRatio);

        if (!Number.isFinite(ratio)) return minRatio;
        return Math.max(minRatio, ratio);
    }

    async function waitForImages(node) {
        if (!node) return;
        const images = Array.from(node.querySelectorAll('img'));
        await Promise.all(images.map((img) => {
            try {
                img.loading = 'eager';
            } catch (_) { }
            if (img.complete) {
                if (img.naturalWidth > 0 && typeof img.decode === 'function') {
                    return img.decode().catch(() => { });
                }
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                const done = async () => {
                    img.removeEventListener('load', done);
                    img.removeEventListener('error', done);
                    if (typeof img.decode === 'function') {
                        try {
                            await img.decode();
                        } catch (_) { }
                    }
                    resolve();
                };
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
            });
        }));
    }

    function normalizeDependencies(deps) {
        const raw = (deps && typeof deps === 'object') ? deps : {};
        return {
            state: raw.state || {},
            dom: raw.dom || {},
            t: (typeof raw.t === 'function') ? raw.t : ((key, fallback) => fallback || key),
            showToast: (typeof raw.showToast === 'function') ? raw.showToast : (() => { }),
            getCaptureNode: (typeof raw.getCaptureNode === 'function') ? raw.getCaptureNode : (() => null)
        };
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

    function createController(deps) {
        const d = normalizeDependencies(deps);

        function buildFileName() {
            const lang = sanitizeFileToken(d.state.lang || 'kr');
            return `roster-share_${lang}_${Date.now()}.png`;
        }

        function setCaptureButtonsBusy(isBusy) {
            [d.dom.copyBtn, d.dom.captureBtn].forEach((button) => {
                if (!button) return;
                button.disabled = !!isBusy;
                if (isBusy) {
                    button.setAttribute('aria-busy', 'true');
                } else {
                    button.removeAttribute('aria-busy');
                }
            });
        }

        function createClipboardItem(blob) {
            try {
                return new ClipboardItem({ 'image/png': blob }, { presentationStyle: 'inline' });
            } catch (_) {
                return new ClipboardItem({ 'image/png': blob });
            }
        }

        function canvasToBlob(canvas) {
            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                        return;
                    }
                    reject(new Error('Failed to create PNG blob'));
                }, 'image/png');
            });
        }

        async function captureNodeToCanvas(node) {
            await ensureHtmlToImage();
            if (!window.htmlToImage || typeof window.htmlToImage.toPng !== 'function') {
                throw new Error('Capture library missing');
            }

            const pixelRatio = getCapturePixelRatio(node);
            const bodyBg = getComputedStyle(document.body).backgroundColor || '#0e0b0d';
            const captureContainer = (node && typeof node.closest === 'function')
                ? node.closest('.sc-capture-frame')
                : null;
            const classTarget = captureContainer || node;
            let dataUrl = '';

            if (classTarget && classTarget.classList) {
                classTarget.classList.add('sc-capture-mode');
            }
            try {
                await waitForImages(node);
                await new Promise((resolve) => window.setTimeout(resolve, 120));
                dataUrl = await window.htmlToImage.toPng(node, {
                    backgroundColor: bodyBg,
                    pixelRatio,
                    cacheBust: true,
                    skipFonts: true,
                    filter: (current) => {
                        if (!(current instanceof HTMLElement)) return true;
                        if (current.hidden) return false;
                        if (current.tagName === 'LINK' && current.rel === 'stylesheet' && current.href && !current.href.startsWith(window.location.origin)) return false;
                        return true;
                    }
                });
            } finally {
                if (classTarget && classTarget.classList) {
                    classTarget.classList.remove('sc-capture-mode');
                }
            }

            const captureImage = await loadImage(dataUrl);
            if (!captureImage) {
                throw new Error('Failed to render capture image');
            }

            const pad = 20 * pixelRatio;
            const watermarkHeight = 30 * pixelRatio;
            const canvas = document.createElement('canvas');
            canvas.width = captureImage.width + pad * 2;
            canvas.height = captureImage.height + pad * 2 + watermarkHeight;

            const ctx = canvas.getContext('2d');
            ctx.fillStyle = bodyBg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(captureImage, pad, pad);

            const baseUrl = resolveBaseUrl(d.state.baseUrl);
            const logo = await loadImage(`${baseUrl}/assets/img/logo/lufel.webp`);
            ctx.fillStyle = 'rgba(255,255,255,0.38)';
            ctx.font = `500 ${12 * pixelRatio}px "Noto Sans", sans-serif`;
            const label = 'lufel.net';
            const labelWidth = ctx.measureText(label).width;
            const textX = canvas.width - pad - labelWidth;
            const textY = captureImage.height + pad + 20 * pixelRatio;
            ctx.fillText(label, textX, textY);

            if (logo) {
                const size = 16 * pixelRatio;
                const logoX = textX - size - 6 * pixelRatio;
                ctx.drawImage(logo, logoX, textY - size + 2 * pixelRatio, size, size);
            }

            return canvas;
        }

        async function downloadCanvas(canvas) {
            const blob = await canvasToBlob(canvas);
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = buildFileName();
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
        }

        async function handleDownloadPng() {
            const captureNode = d.getCaptureNode();
            if (!captureNode) return;
            setCaptureButtonsBusy(true);
            createLoadingOverlay('scCaptureOverlay', d.t('msg_capture_generating', 'Generating image...'));

            try {
                const canvas = await captureNodeToCanvas(captureNode);
                await downloadCanvas(canvas);
                d.showToast(d.t('msg_capture_success', 'PNG downloaded.'), 'success');
            } catch (error) {
                console.error('[share-character] capture failed:', error);
                d.showToast(d.t('msg_capture_failed', 'Failed to capture image.'), 'error');
            } finally {
                removeLoadingOverlay('scCaptureOverlay');
                setCaptureButtonsBusy(false);
            }
        }

        async function handleCopyPng() {
            const captureNode = d.getCaptureNode();
            if (!captureNode) return;
            setCaptureButtonsBusy(true);
            createLoadingOverlay('scCopyOverlay', d.t('msg_copy_generating', 'Copying image...'));

            let canvas = null;
            try {
                canvas = await captureNodeToCanvas(captureNode);

                if (!navigator.clipboard || typeof navigator.clipboard.write !== 'function' || typeof window.ClipboardItem === 'undefined') {
                    await downloadCanvas(canvas);
                    d.showToast(d.t('msg_capture_success', 'PNG downloaded.'), 'success');
                    return;
                }

                const blob = await canvasToBlob(canvas);

                await navigator.clipboard.write([createClipboardItem(blob)]);
                d.showToast(d.t('msg_copy_success', 'Image copied to clipboard.'), 'success');
            } catch (error) {
                console.error('[share-character] copy failed:', error);
                if (canvas) {
                    try {
                        await downloadCanvas(canvas);
                        d.showToast(d.t('msg_capture_success', 'PNG downloaded.'), 'success');
                        return;
                    } catch (_) { }
                }
                d.showToast(d.t('msg_copy_failed', 'Failed to copy image.'), 'error');
            } finally {
                removeLoadingOverlay('scCopyOverlay');
                setCaptureButtonsBusy(false);
            }
        }

        return {
            handleDownloadPng,
            handleCopyPng
        };
    }

    window.ShareCharacterCapture = {
        createController
    };
})();
