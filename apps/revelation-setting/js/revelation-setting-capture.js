(function () {
    'use strict';

    function sanitizeFileToken(value) {
        return String(value || '')
            .trim()
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
            .replace(/\s+/g, '_')
            .slice(0, 40) || 'unknown';
    }

    async function ensureHtmlToImage() {
        if (window.htmlToImage) return;
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js';
            script.onload = resolve;
            script.onerror = () => {
                const fallbackScript = document.createElement('script');
                fallbackScript.src = 'https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js';
                fallbackScript.onload = resolve;
                fallbackScript.onerror = reject;
                document.head.appendChild(fallbackScript);
            };
            document.head.appendChild(script);
        });
    }

    function loadImageAsCanvas(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }

    function normalizeDependencies(deps) {
        const raw = (deps && typeof deps === 'object') ? deps : {};
        return {
            state: raw.state || {},
            dom: raw.dom || {},
            t: (typeof raw.t === 'function') ? raw.t : ((key, fallback) => fallback || key),
            showToast: (typeof raw.showToast === 'function') ? raw.showToast : (() => { }),
            parseUpgradeValue: (typeof raw.parseUpgradeValue === 'function')
                ? raw.parseUpgradeValue
                : ((value) => {
                    const n = Number.parseInt(String(value || '').trim(), 10);
                    return Number.isFinite(n) ? n : 0;
                })
        };
    }

    function createController(deps) {
        const d = normalizeDependencies(deps);

        async function withZeroUpgradeHiddenForCapture(captureNode, task) {
            if (!captureNode || typeof task !== 'function') {
                return task ? task() : null;
            }

            const zeroUpgradeInputs = Array.from(
                captureNode.querySelectorAll('.rs-sub-upgrade-input')
            ).filter((input) => {
                const text = String(input.value || '').trim();
                if (!text) return true;
                return d.parseUpgradeValue(text) === 0;
            });

            zeroUpgradeInputs.forEach((input) => {
                input.classList.add('rs-capture-zero-hidden');
            });

            try {
                return await task();
            } finally {
                zeroUpgradeInputs.forEach((input) => {
                    input.classList.remove('rs-capture-zero-hidden');
                });
            }
        }

        async function captureToCanvas(captureNode) {
            await ensureHtmlToImage();
            if (!window.htmlToImage || typeof window.htmlToImage.toPng !== 'function') {
                throw new Error('Capture library missing');
            }

            const bodyBg = getComputedStyle(document.body).backgroundColor || '#222222';
            const pixelRatio = Math.min(3, (window.devicePixelRatio || 1) * 2);
            const pad = 16;
            const watermarkH = 28;

            let dataUrl = '';
            captureNode.classList.add('rs-capture-mode');
            try {
                dataUrl = await window.htmlToImage.toPng(captureNode, {
                    backgroundColor: bodyBg,
                    pixelRatio,
                    cacheBust: true,
                    skipFonts: true,
                    filter: (node) => {
                        if (!(node instanceof HTMLElement)) return true;
                        if (node.hidden) return false;
                        if (node.classList && node.classList.contains('rs-character-panel')) return false;
                        if (node.classList && node.classList.contains('rs-dropdown-menu')) return false;
                        if (node.classList && node.classList.contains('rs-dropdown-arrow')) return false;
                        if (node.tagName === 'LINK' && node.rel === 'stylesheet' && node.href && !node.href.startsWith(window.location.origin)) return false;
                        return true;
                    }
                });
            } finally {
                captureNode.classList.remove('rs-capture-mode');
            }

            const srcImg = await loadImageAsCanvas(dataUrl);
            if (!srcImg) throw new Error('Failed to load captured image');

            const cw = srcImg.width + pad * 2 * pixelRatio;
            const ch = srcImg.height + (pad * 2 + watermarkH) * pixelRatio;

            const canvas = document.createElement('canvas');
            canvas.width = cw;
            canvas.height = ch;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = bodyBg;
            ctx.fillRect(0, 0, cw, ch);
            ctx.drawImage(srcImg, pad * pixelRatio, pad * pixelRatio);

            const logoSrc = `${d.state.baseUrl || ''}/assets/img/logo/lufel.webp`;
            const logoImg = await loadImageAsCanvas(logoSrc);
            const logoSize = 16 * pixelRatio;
            const textSize = 11 * pixelRatio;
            const wmY = srcImg.height + (pad * 1.5) * pixelRatio;

            ctx.font = `500 ${textSize}px "Noto Sans", sans-serif`;
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            const label = 'lufel.net';
            const textW = ctx.measureText(label).width;
            const wmX = cw - pad * pixelRatio - textW;

            ctx.fillText(label, wmX, wmY + logoSize * 0.75);

            if (logoImg) {
                const logoX = wmX - logoSize - 5 * pixelRatio;
                ctx.drawImage(logoImg, logoX, wmY, logoSize, logoSize);
            }

            return canvas;
        }

        async function handleDownloadPng() {
            if (!d.state.selectedCharacter) {
                alert(d.t('msg_preview_empty', 'Please select a character first.'));
                return;
            }

            const captureNode = d.dom.configLayout || document.querySelector('.rs-config-layout');
            if (!captureNode) return;

            if (d.dom.downloadBtn) d.dom.downloadBtn.disabled = true;

            try {
                const canvas = await withZeroUpgradeHiddenForCapture(
                    captureNode,
                    () => captureToCanvas(captureNode)
                );
                const dataUrl = canvas.toDataURL('image/png');

                const characterToken = sanitizeFileToken(d.state.selectedCharacter || 'unknown');
                const fileName = `revelation-share_${characterToken}_${Date.now()}.png`;

                const anchor = document.createElement('a');
                anchor.href = dataUrl;
                anchor.download = fileName;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                d.showToast(d.t('msg_capture_success', 'PNG downloaded.'));
            } catch (error) {
                console.error('[revelation-setting] capture failed:', error);
                alert(d.t('msg_capture_failed', `Failed to capture image. (${error.message || error})`));
            } finally {
                if (d.dom.downloadBtn) d.dom.downloadBtn.disabled = false;
            }
        }

        async function handleCopyPng() {
            if (!d.state.selectedCharacter) {
                alert(d.t('msg_preview_empty', 'Please select a character first.'));
                return;
            }

            const captureNode = d.dom.configLayout || document.querySelector('.rs-config-layout');
            if (!captureNode) return;

            if (d.dom.copyBtn) d.dom.copyBtn.disabled = true;

            try {
                const canvas = await withZeroUpgradeHiddenForCapture(
                    captureNode,
                    () => captureToCanvas(captureNode)
                );
                const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
                if (!blob) throw new Error('Failed to create blob');

                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                d.showToast(d.t('msg_copy_success', 'Image copied to clipboard.'));
            } catch (error) {
                console.error('[revelation-setting] copy failed:', error);
                alert(d.t('msg_copy_failed', `Failed to copy image. (${error.message || error})`));
            } finally {
                if (d.dom.copyBtn) d.dom.copyBtn.disabled = false;
            }
        }

        return {
            handleDownloadPng,
            handleCopyPng
        };
    }

    window.RevelationSettingCapture = {
        createController
    };
})();
