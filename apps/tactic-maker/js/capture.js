/**
 * Tactic Maker V2 - Capture Module
 * Captures the tactic board as an image using html-to-image
 */

export class CaptureUI {
    constructor(store) {
        this.store = store;
        this.btnCapture = document.getElementById('btnCapture');
        this.baseUrl = window.BASE_URL || '';

        this.init();
    }

    init() {
        if (this.btnCapture) {
            this.btnCapture.addEventListener('click', () => this.captureAndDownload());
        }
    }

    showLoading(text) {
        const el = document.createElement('div');
        el.className = 'capture-loading-overlay';
        el.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.85);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 99999;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        // Use CSS animation instead of SVG animateTransform for smoother performance during capture
        el.innerHTML = `
            <style>
                @keyframes capture-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .capture-spinner-css {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: capture-spin 0.8s linear infinite;
                }
            </style>
            <div class="capture-spinner-css"></div>
            <span class="capture-text">${text || 'Generating image...'}</span>
        `;
        document.body.appendChild(el);
        return el;
    }

    updateLoading(el, text) {
        const textEl = el.querySelector('.capture-text');
        if (textEl) textEl.textContent = text;
    }

    downloadDataUrl(dataUrl, filename) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename || `tactic-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    getFilename() {
        const titleInput = document.getElementById('tacticTitle');
        const title = titleInput?.value?.trim();
        if (title) {
            // Sanitize filename
            const safe = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50);
            return `tactic_${safe}.png`;
        }
        return `tactic_${Date.now()}.png`;
    }

    async captureAndDownload() {
        // Check if html-to-image is loaded
        if (typeof htmlToImage === 'undefined') {
            const message = (window.I18nService && window.I18nService.t)
                ? window.I18nService.t('captureLibraryMissing', '이미지 캡처 라이브러리를 불러오지 못했습니다. 페이지를 새로고침해주세요.')
                : '이미지 캡처 라이브러리를 불러오지 못했습니다. 페이지를 새로고침해주세요.';
            alert(message);
            return;
        }

        const mainWrapper = document.querySelector('.main-wrapper.tactic-maker-page');
        if (!mainWrapper) {
            console.error('[capture] .main-wrapper not found');
            return;
        }

        const loading = this.showLoading(window.I18nService?.t('capturing') || 'Capturing...');

        // Store original states
        const wasEditMode = document.body.classList.contains('tactic-edit-mode');

        // Hide edit UI for capture and trigger view mode reorganization
        document.body.classList.remove('tactic-edit-mode');
        document.dispatchEvent(new CustomEvent('editModeChange', { detail: { enabled: false } }));

        // Temporarily replace navigation-path text with logo + site name
        const navigationPath = mainWrapper.querySelector('.navigation-path');
        const originalNavigationContent = navigationPath ? navigationPath.innerHTML : null;
        if (navigationPath) navigationPath.innerHTML = `<img src="${this.baseUrl}/assets/img/logo/lufel.webp" alt="logo" style="height: 16px; vertical-align: middle; margin-right: 6px;">lufel.net`;

        // Hide elements that shouldn't be in capture
        const elementsToHide = [
            mainWrapper.querySelector('.header-container h1'),
            mainWrapper.querySelector('.sheet-status'),
            mainWrapper.querySelector('.roster-container'),
            mainWrapper.querySelector('#btnAddTurn'),
        ].filter(Boolean);

        const prevDisplay = new Map();
        elementsToHide.forEach(el => {
            prevDisplay.set(el, el.style.display);
            el.style.display = 'none';
        });

        // Hide empty placeholder texts and add action buttons
        const emptySlots = mainWrapper.querySelectorAll('.slot-card.empty .empty-text');
        emptySlots.forEach(el => {
            prevDisplay.set(el, el.style.visibility);
            el.style.visibility = 'hidden';
        });

        // Store main-wrapper styles
        const prev = {
            left: mainWrapper.style.left,
            right: mainWrapper.style.right,
            paddingLeft: mainWrapper.style.paddingLeft,
            paddingRight: mainWrapper.style.paddingRight,
            marginLeft: mainWrapper.style.marginLeft,
            marginRight: mainWrapper.style.marginRight,
            backgroundColor: mainWrapper.style.backgroundColor,
            position: mainWrapper.style.position,
            width: mainWrapper.style.width,
            maxWidth: mainWrapper.style.maxWidth,
            transform: mainWrapper.style.transform
        };

        const cs = getComputedStyle(mainWrapper);
        const bodyBg = getComputedStyle(document.body).backgroundColor || '#121212';

        // Fixed padding for consistent capture
        const CAPTURE_PADDING = 24;

        // Neutralize all positioning - use fixed symmetric padding
        mainWrapper.style.position = 'relative';
        mainWrapper.style.left = '0';
        mainWrapper.style.right = '0';
        mainWrapper.style.marginLeft = '0';
        mainWrapper.style.marginRight = '0';
        mainWrapper.style.paddingLeft = CAPTURE_PADDING + 'px';
        mainWrapper.style.paddingRight = CAPTURE_PADDING + 'px';
        mainWrapper.style.transform = 'none';
        mainWrapper.style.backgroundColor = cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
            ? cs.backgroundColor
            : bodyBg;

        try {
            // Wait for all style changes to fully apply
            await new Promise(r => setTimeout(r, 300));

            const opts = {
                backgroundColor: bodyBg,
                pixelRatio: Math.min(3, (window.devicePixelRatio || 1) * 2),
                skipAutoScale: true,
                filter: (node) => {
                    try {
                        if (!(node instanceof Element)) return true;
                        // Filter out edit-mode specific elements
                        if (node.classList.contains('btn-add-action')) return false;
                        if (node.classList.contains('action-actions')) return false;
                        if (node.classList.contains('action-drag-handle')) return false;
                        if (node.classList.contains('turn-drag-handle')) return false;
                        if (node.classList.contains('turn-actions')) return false;
                        if (node.classList.contains('roster-container')) return false;
                        if (node.classList.contains('auto-action-prompt')) return false;
                        if (node.classList.contains('custom-select-arrow')) return false;
                        // Skip hidden images or images that failed to load
                        if (node.tagName === 'IMG') {
                            const style = window.getComputedStyle(node);
                            if (style.display === 'none' || style.visibility === 'hidden') return false;
                            // Skip images with empty or invalid src
                            if (!node.src || node.src === '' || node.src === 'about:blank') return false;
                        }
                    } catch (_) { }
                    return true;
                },
                onclone: (clonedDoc) => {
                    // Remove any broken images in the cloned document
                    const brokenImages = clonedDoc.querySelectorAll('img');
                    brokenImages.forEach(img => {
                        if (!img.complete || img.naturalWidth === 0) {
                            img.style.display = 'none';
                        }
                    });
                }
            };

            this.updateLoading(loading, window.I18nService?.t('generatingImage') || 'Generating image...');

            const dataUrl = await htmlToImage.toPng(mainWrapper, opts);

            this.updateLoading(loading, window.I18nService?.t('downloading') || 'Downloading...');

            this.downloadDataUrl(dataUrl, this.getFilename());

            this.updateLoading(loading, window.I18nService?.t('done') || 'Done!');

            // Wait before restoring to ensure capture is fully complete
            await new Promise(r => setTimeout(r, 200));

        } catch (err) {
            console.error('[capture] failed:', err);
            this.updateLoading(loading, window.I18nService?.t('captureFailed') || 'Failed to capture');
        }

        // Restore after capture is complete (outside try-catch to always run)
        // Restore hidden elements
        prevDisplay.forEach((display, el) => {
            if (el.style.visibility === 'hidden') {
                el.style.visibility = display || '';
            } else {
                el.style.display = display || '';
            }
        });

        // Restore main-wrapper styles
        mainWrapper.style.left = prev.left;
        mainWrapper.style.right = prev.right;
        mainWrapper.style.paddingLeft = prev.paddingLeft;
        mainWrapper.style.paddingRight = prev.paddingRight;
        mainWrapper.style.marginLeft = prev.marginLeft;
        mainWrapper.style.marginRight = prev.marginRight;
        mainWrapper.style.backgroundColor = prev.backgroundColor;
        mainWrapper.style.position = prev.position;
        mainWrapper.style.width = prev.width;
        mainWrapper.style.maxWidth = prev.maxWidth;
        mainWrapper.style.transform = prev.transform;

        // Restore navigation-path
        if (navigationPath && originalNavigationContent != null) {
            navigationPath.innerHTML = originalNavigationContent;
        }

        // Restore edit mode if it was enabled
        if (wasEditMode) {
            document.body.classList.add('tactic-edit-mode');
            document.dispatchEvent(new CustomEvent('editModeChange', { detail: { enabled: true } }));
        }

        // Remove loading overlay after delay
        setTimeout(() => {
            if (loading && loading.parentNode) loading.remove();
        }, 800);
    }
}
