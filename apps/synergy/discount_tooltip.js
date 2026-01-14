// discount_tooltip.js
// 할인 조건 툴팁 기능

(function() {
    'use strict';

    // 기존 tooltip.js의 bindTooltipElement 로직을 참고하여 할인 조건 툴팁 구현
    function bindDiscountTooltip(el) {
        if (!el || el.dataset.discountTooltipBound === '1') return;
        const viewportWidth = window.innerWidth;
        let node = el;

        // 현재 바인딩 모드 확인 (desktop/mobile)
        const currentMode = node.dataset.tooltipMode;

        if (viewportWidth > 1200) {
            // 데스크톱 모드
            if (currentMode !== 'desktop') {
                const fresh = node.cloneNode(true);
                fresh.classList.remove('mobile-banner');
                node.replaceWith(fresh);
                node = fresh;
                node.dataset.tooltipMode = 'desktop';
                const leftoverBanner = document.querySelector('.tooltip-mobile-banner');
                if (leftoverBanner) leftoverBanner.remove();
            }

            // PC: 커서 추종 툴팁 컨테이너 준비
            const floating = document.getElementById('cursor-tooltip') || (function() {
                const el = document.createElement('div');
                el.id = 'cursor-tooltip';
                el.className = 'cursor-tooltip';
                document.body.appendChild(el);
                return el;
            })();

            const showFloating = (el, content, isHtml) => { 
                if (!content) return; 
                if (isHtml) {
                    el.innerHTML = content;
                } else {
                    el.textContent = content; 
                }
                el.style.display = 'block'; 
            };
            const hideFloating = (el) => { 
                el.style.display = 'none'; 
            };
            const moveFloating = (el, e) => {
                const offset = 16;
                let x = e.clientX + offset;
                let y = e.clientY + offset;
                const vw = window.innerWidth; 
                const vh = window.innerHeight;
                if (el.style.display !== 'block') { 
                    el.style.display = 'block'; 
                }
                const ttW = el.offsetWidth; 
                const ttH = el.offsetHeight;
                if (x + ttW + 8 > vw) x = e.clientX - ttW - offset;
                if (y + ttH + 8 > vh) y = e.clientY - ttH - offset;
                el.style.left = x + 'px'; 
                el.style.top = y + 'px';
            };

            node.addEventListener('mouseenter', function(e) {
                try {
                    // HTML 툴팁 우선 확인
                    const htmlContent = this.getAttribute('data-discount-tooltip-html');
                    const textContent = this.getAttribute('data-discount-tooltip');
                    const content = htmlContent || textContent;
                    if (!content) return;
                    this.classList.add('js-tooltip-active');
                    showFloating(floating, content, !!htmlContent);
                    moveFloating(floating, e);
                } catch (_) {}
            });
            node.addEventListener('mousemove', function(e) { 
                try { 
                    moveFloating(floating, e); 
                } catch (_) {} 
            });
            node.addEventListener('mouseleave', function() { 
                try { 
                    hideFloating(floating); 
                    this.classList.remove('js-tooltip-active'); 
                } catch (_) {} 
            });

            node.dataset.discountTooltipBound = '1';
        } else {
            // 모바일 모드
            if (currentMode !== 'mobile') {
                const fresh = node.cloneNode(true);
                fresh.classList.add('mobile-banner');
                node.replaceWith(fresh);
                node = fresh;
                node.dataset.tooltipMode = 'mobile';
            }

            node.addEventListener('click', function(e) {
                try {
                    // HTML 툴팁 우선 확인
                    const htmlContent = this.getAttribute('data-discount-tooltip-html');
                    const textContent = this.getAttribute('data-discount-tooltip');
                    const tooltipContent = htmlContent || textContent;
                    if (!tooltipContent) return;
                    const existingBanner = document.querySelector('.tooltip-mobile-banner');
                    if (existingBanner) existingBanner.remove();
                    const banner = document.createElement('div');
                    banner.className = 'tooltip-mobile-banner';
                    // HTML이 있으면 innerHTML로, 없으면 textContent로
                    if (htmlContent) {
                        banner.innerHTML = htmlContent;
                    } else {
                        banner.textContent = textContent;
                    }
                    const closeButton = document.createElement('button');
                    closeButton.className = 'tooltip-banner-close';
                    closeButton.innerHTML = '×';
                    closeButton.onclick = () => { 
                        if (banner.parentElement) banner.remove(); 
                    };
                    banner.appendChild(closeButton);
                    if (document.body) document.body.appendChild(banner); 
                    else return;
                    setTimeout(() => { 
                        if (banner.parentElement) banner.remove(); 
                    }, 5000);
                    e.preventDefault(); 
                    e.stopPropagation();
                } catch (error) { 
                    console.error('모바일 툴팁 배너 생성 중 오류:', error); 
                }
            });

            node.dataset.discountTooltipBound = '1';
        }
    }

    // 할인 조건 툴팁 초기화 함수
    function initDiscountTooltips() {
        const discountIcons = document.querySelectorAll('.discount-tooltip-icon');
        discountIcons.forEach(bindDiscountTooltip);
    }

    // DOMContentLoaded 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDiscountTooltips);
    } else {
        initDiscountTooltips();
    }

    // MutationObserver로 동적으로 추가되는 요소에도 툴팁 바인딩
    if (!window.__discountTooltipObserver) {
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'childList') {
                    m.addedNodes && m.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return; // ELEMENT_NODE
                        if (node.classList && node.classList.contains('discount-tooltip-icon')) {
                            bindDiscountTooltip(node);
                        }
                        const inner = node.querySelectorAll ? node.querySelectorAll('.discount-tooltip-icon') : [];
                        inner && inner.forEach(bindDiscountTooltip);
                    });
                } else if (m.type === 'attributes' && m.target && m.target.classList && m.target.classList.contains('discount-tooltip-icon')) {
                    // data-discount-tooltip 또는 data-discount-tooltip-html 변경 시에도 바인딩 보장
                    bindDiscountTooltip(m.target);
                }
            }
        });
        observer.observe(document.body, { 
            childList: true, 
            subtree: true, 
            attributes: true, 
            attributeFilter: ['data-discount-tooltip', 'data-discount-tooltip-html'] 
        });
        window.__discountTooltipObserver = observer;
    }

    // 전역 함수로 노출 (synergy.js에서 호출 가능하도록)
    window.initDiscountTooltips = initDiscountTooltips;
})();

