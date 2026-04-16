(function () {
    'use strict';

    const captureImageCache = new Map();

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

    async function loadImageCached(src) {
        const key = String(src || '').trim();
        if (!key) return null;
        if (!captureImageCache.has(key)) {
            captureImageCache.set(key, loadImage(key).catch(() => null));
        }
        return captureImageCache.get(key);
    }

    function shouldOverlayCaptureImages() {
        if (typeof window !== 'undefined' && window.__SC_FORCE_IMAGE_OVERLAY__ === true) {
            return true;
        }
        if (typeof navigator === 'undefined') return false;
        const ua = String(navigator.userAgent || '');
        const platform = String(navigator.platform || '');
        const maxTouchPoints = Number(navigator.maxTouchPoints || 0);
        return /iPad|iPhone|iPod/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
    }

    function addRoundedRectPath(ctx, x, y, width, height, radius) {
        const r = Math.max(0, Math.min(radius, width / 2, height / 2));
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + height, r);
        ctx.arcTo(x + width, y + height, x, y + height, r);
        ctx.arcTo(x, y + height, x, y, r);
        ctx.arcTo(x, y, x + width, y, r);
        ctx.closePath();
    }

    function parseFilterValue(filterText, name) {
        const text = String(filterText || '');
        const match = text.match(new RegExp(`${name}\\(([^)]+)\\)`, 'i'));
        if (!match) return null;
        const raw = String(match[1] || '').trim();
        if (!raw) return null;
        const parsed = raw.endsWith('%')
            ? Number.parseFloat(raw) / 100
            : Number.parseFloat(raw);
        return Number.isFinite(parsed) ? parsed : null;
    }

    function computeImagePlacement(sourceWidth, sourceHeight, x, y, width, height, objectFit) {
        const safeSourceWidth = Math.max(1, Number(sourceWidth) || 1);
        const safeSourceHeight = Math.max(1, Number(sourceHeight) || 1);
        const fit = String(objectFit || 'fill').toLowerCase();

        if (fit === 'contain' || fit === 'cover') {
            const scale = fit === 'contain'
                ? Math.min(width / safeSourceWidth, height / safeSourceHeight)
                : Math.max(width / safeSourceWidth, height / safeSourceHeight);
            const drawWidth = safeSourceWidth * scale;
            const drawHeight = safeSourceHeight * scale;
            return {
                x: x + (width - drawWidth) / 2,
                y: y + (height - drawHeight) / 2,
                width: drawWidth,
                height: drawHeight
            };
        }

        return { x, y, width, height };
    }

    function applyImageAdjustments(sourceImage, width, height, adjustments) {
        const needsProcessing = adjustments
            && (
                Math.abs((adjustments.grayscale || 0)) > 0.001
                || Math.abs((adjustments.saturate || 1) - 1) > 0.001
            );

        if (!needsProcessing) return sourceImage;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.max(1, Math.round(width));
        tempCanvas.height = Math.max(1, Math.round(height));
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return sourceImage;
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';

        tempCtx.drawImage(sourceImage, 0, 0, tempCanvas.width, tempCanvas.height);

        try {
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;
            const grayscale = Math.max(0, Math.min(1, adjustments.grayscale || 0));
            const saturate = Math.max(0, adjustments.saturate || 0);

            for (let i = 0; i < data.length; i += 4) {
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];

                const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                r = r * (1 - grayscale) + luminance * grayscale;
                g = g * (1 - grayscale) + luminance * grayscale;
                b = b * (1 - grayscale) + luminance * grayscale;

                const avg = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                r = avg + (r - avg) * saturate;
                g = avg + (g - avg) * saturate;
                b = avg + (b - avg) * saturate;

                data[i] = Math.max(0, Math.min(255, Math.round(r)));
                data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
                data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
            }

            tempCtx.putImageData(imageData, 0, 0);
            return tempCanvas;
        } catch (_) {
            return sourceImage;
        }
    }

    async function paintCaptureImagesToCanvas(ctx, node, captureImage, pad, options) {
        if (!ctx || !node || !captureImage) return;

        const rootRect = node.getBoundingClientRect();
        const rootWidth = Math.max(1, rootRect.width || captureImage.width);
        const rootHeight = Math.max(1, rootRect.height || captureImage.height);
        const scaleX = captureImage.width / rootWidth;
        const scaleY = captureImage.height / rootHeight;
        const opts = (options && typeof options === 'object') ? options : {};
        const overlaySelectors = Array.isArray(opts.selectors) ? opts.selectors : [];
        const clipCharacterToStatus = opts.clipCharacterToStatus !== false;

        for (let index = 0; index < overlaySelectors.length; index += 1) {
            const elements = Array.from(node.querySelectorAll(overlaySelectors[index]));
            for (let i = 0; i < elements.length; i += 1) {
                const imgEl = elements[i];
                if (!(imgEl instanceof HTMLImageElement)) continue;

                const rect = imgEl.getBoundingClientRect();
                if (!rect || rect.width <= 0 || rect.height <= 0) continue;

                const src = String(imgEl.currentSrc || imgEl.src || '').trim();
                if (!src) continue;

                const sourceImage = await loadImageCached(src);
                if (!sourceImage) continue;

                const style = getComputedStyle(imgEl);
                const x = pad + (rect.left - rootRect.left) * scaleX;
                const y = pad + (rect.top - rootRect.top) * scaleY;
                const width = rect.width * scaleX;
                const drawHeight = rect.height * scaleY;
                let clipHeight = drawHeight;
                const radius = Math.max(
                    parseFloat(style.borderTopLeftRadius) || 0,
                    parseFloat(style.borderTopRightRadius) || 0,
                    parseFloat(style.borderBottomRightRadius) || 0,
                    parseFloat(style.borderBottomLeftRadius) || 0
                ) * Math.min(scaleX, scaleY);
                const grayscale = parseFilterValue(style.filter, 'grayscale') || 0;
                const saturate = parseFilterValue(style.filter, 'saturate');
                const filterOpacity = parseFilterValue(style.filter, 'opacity');

                if (clipCharacterToStatus && imgEl.classList.contains('character-img')) {
                    const card = imgEl.closest('.sc-share-card');
                    const status = card ? card.querySelector('.sc-card-status') : null;
                    const nameText = card ? card.querySelector('.name-text') : null;
                    let foregroundTop = Number.POSITIVE_INFINITY;

                    if (status) {
                        const statusRect = status.getBoundingClientRect();
                        foregroundTop = Math.min(foregroundTop, statusRect.top);
                    }

                    if (nameText) {
                        const nameTextRect = nameText.getBoundingClientRect();
                        foregroundTop = Math.min(foregroundTop, nameTextRect.top);
                    }

                    if (Number.isFinite(foregroundTop)) {
                        const visibleHeight = (foregroundTop - rect.top) * scaleY;
                        if (Number.isFinite(visibleHeight) && visibleHeight > 0) {
                            clipHeight = Math.min(drawHeight, visibleHeight);
                        }
                    }
                }

                if (clipHeight <= 0 || drawHeight <= 0) continue;

                ctx.save();

                const opacity = filterOpacity != null
                    ? filterOpacity
                    : Number.parseFloat(style.opacity || '1');
                if (Number.isFinite(opacity)) {
                    ctx.globalAlpha = opacity;
                }

                if (!grayscale && (saturate == null || Math.abs(saturate - 1) < 0.001) && style.filter && style.filter !== 'none') {
                    try {
                        ctx.filter = style.filter;
                    } catch (_) { }
                }

                if (radius > 0.01) {
                    addRoundedRectPath(ctx, x, y, width, drawHeight, Math.min(radius, drawHeight / 2));
                    ctx.clip();
                }

                if (clipHeight < drawHeight - 0.01) {
                    ctx.beginPath();
                    ctx.rect(x, y, width, clipHeight);
                    ctx.clip();
                }

                const placement = computeImagePlacement(
                    sourceImage.naturalWidth || sourceImage.width,
                    sourceImage.naturalHeight || sourceImage.height,
                    x,
                    y,
                    width,
                    drawHeight,
                    style.objectFit || 'fill'
                );

                const drawSource = applyImageAdjustments(sourceImage, placement.width, placement.height, {
                    grayscale,
                    saturate: saturate == null ? 1 : saturate
                });

                ctx.drawImage(drawSource, placement.x, placement.y, placement.width, placement.height);
                ctx.restore();
            }
        }
    }

    function getCapturePixelRatio(node) {
        const rect = node && typeof node.getBoundingClientRect === 'function'
            ? node.getBoundingClientRect()
            : { width: 1280, height: 720 };
        const width = Math.max(1, Math.round(rect.width || 1280));
        const height = Math.max(1, Math.round(rect.height || 720));

        const targetWidth = 1920;
        const maxRatio = 1.6;
        const minRatio = 1;
        const maxPixels = 12_000_000;

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
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.fillStyle = bodyBg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(captureImage, pad, pad);

            if (shouldOverlayCaptureImages()) {
                await paintCaptureImagesToCanvas(ctx, node, captureImage, pad, {
                    selectors: ['.character-img'],
                    clipCharacterToStatus: true
                });
                await paintCaptureImagesToCanvas(ctx, node, captureImage, pad, {
                    selectors: ['.position-icon', '.element-icon', '.sc-enhancement-icon'],
                    clipCharacterToStatus: false
                });
            }

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
