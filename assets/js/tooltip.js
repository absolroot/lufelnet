const contextTooltipHover = window.matchMedia('(min-width: 1201px) and (any-hover: hover)');
let contextTooltipPanel;
let activeContextTooltip;
let contextTooltipFrame;
let hideHoveredContextTooltip;

contextTooltipHover.addEventListener('change', () => {
    if (!contextTooltipHover.matches) hideHoveredContextTooltip?.();
});

function closeContextTooltip(restoreFocus = false) {
    if (!activeContextTooltip) return;
    const { trigger } = activeContextTooltip;
    activeContextTooltip = null;
    trigger.setAttribute('aria-expanded', 'false');
    contextTooltipPanel.hidden = true;
    if (restoreFocus && trigger.isConnected) trigger.focus({ preventScroll: true });
}

function positionContextTooltip() {
    if (!activeContextTooltip) return;
    const { trigger, line } = activeContextTooltip;
    const rects = trigger.getClientRects();
    const rect = rects[Math.min(line, rects.length - 1)];
    const viewport = window.visualViewport;
    const left = viewport?.offsetLeft ?? 0;
    const top = viewport?.offsetTop ?? 0;
    const width = viewport?.width ?? document.documentElement.clientWidth;
    const height = viewport?.height ?? window.innerHeight;
    const panel = contextTooltipPanel;
    const style = getComputedStyle(panel);
    const safeInset = side => parseFloat(style.getPropertyValue('--tooltip-safe-' + side)) || 0;
    const gutter = 14;
    const gap = 8;
    const headerBottom = document.querySelector('.mobile-header')?.getBoundingClientRect().bottom ?? 0;
    let minX = left + Math.max(gutter, safeInset('left'));
    let maxX = left + width - Math.max(gutter, safeInset('right'));
    const minY = Math.max(top + Math.max(gutter, safeInset('top')), headerBottom + gap);
    const maxY = top + height - Math.max(gutter, safeInset('bottom'));
    if (!rect || rect.bottom <= minY - gap || rect.top >= maxY + gap) {
        closeContextTooltip();
        return;
    }

    const card = width <= 768 ? trigger.closest('.card-style') : null;
    if (card) {
        const bounds = card.getBoundingClientRect();
        const cardStyle = getComputedStyle(card);
        const contentLeft = Math.max(minX, bounds.left + parseFloat(cardStyle.paddingLeft));
        const contentRight = Math.min(maxX, bounds.right - parseFloat(cardStyle.paddingRight));
        if (contentRight - contentLeft >= 240) {
            minX = contentLeft;
            maxX = contentRight;
        }
    }
    const panelWidth = Math.min(320, maxX - minX);
    const termBounds = trigger.getBoundingClientRect();
    const above = Math.max(0, termBounds.top - gap - minY);
    const below = Math.max(0, maxY - termBounds.bottom - gap);
    panel.style.width = panelWidth + 'px';
    const placeBelow = below >= panel.firstElementChild.scrollHeight || below >= above;
    panel.style.maxHeight = (placeBelow ? below : above) + 'px';
    const anchorX = (rect.left + rect.right) / 2;
    const panelLeft = Math.min(maxX - panelWidth, Math.max(minX, anchorX - panelWidth / 2));
    panel.style.left = panelLeft + 'px';
    panel.style.top = (placeBelow ? termBounds.bottom + gap : termBounds.top - gap - panel.offsetHeight) + 'px';
    panel.style.setProperty('--tooltip-anchor-x', Math.min(panelWidth - 16, Math.max(16, anchorX - panelLeft)) + 'px');
    panel.dataset.placement = placeBelow ? 'below' : 'above';
}

function createContextTooltipPanel() {
    const panel = document.createElement('div');
    panel.className = 'tooltip-panel';
    panel.id = 'tooltip-panel';
    panel.hidden = true;
    panel.tabIndex = -1;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'tooltip-panel-title');
    panel.setAttribute('aria-describedby', 'tooltip-panel-description');
    panel.innerHTML = '<div class="tooltip-panel-surface">'
        + '<div class="tooltip-panel-heading"><strong id="tooltip-panel-title"></strong>'
        + '<button type="button" class="tooltip-panel-close"></button></div>'
        + '<div id="tooltip-panel-description" class="tooltip-panel-description"></div></div>';
    const close = panel.querySelector('button');
    close.addEventListener('click', () => closeContextTooltip(true));
    panel.addEventListener('keydown', event => {
        if (event.key === 'Tab' && (event.shiftKey || event.target === close)) {
            closeContextTooltip(true);
        }
    });
    document.addEventListener('pointerdown', event => {
        if (activeContextTooltip && !panel.contains(event.target) && !activeContextTooltip.trigger.contains(event.target)) {
            closeContextTooltip();
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && activeContextTooltip) closeContextTooltip(panel.contains(document.activeElement));
    });
    const schedulePosition = () => {
        if (!activeContextTooltip || contextTooltipFrame) return;
        contextTooltipFrame = requestAnimationFrame(() => {
            contextTooltipFrame = 0;
            positionContextTooltip();
        });
    };
    window.addEventListener('scroll', schedulePosition, { passive: true, capture: true });
    window.addEventListener('resize', schedulePosition);
    window.visualViewport?.addEventListener('resize', schedulePosition);
    window.visualViewport?.addEventListener('scroll', schedulePosition);
    document.body.append(panel);
    return panel;
}

function renderContextTooltip(panel, node) {
    let title = node.dataset.tooltipTitle || (node.querySelector('.tooltip-text-label') ?? node).textContent.trim();
    const description = panel.querySelector('.tooltip-panel-description');
    const content = node.dataset.tooltip;
    if (node.classList.contains('revelation-value-item')) {
        const effects = content.trim().split(/\r?\n\r?\n/);
        const headingPattern = /^\[([^\]\r\n]+)\]\r?\n/;
        const heading = effects.length === 1 && effects[0].match(headingPattern);
        if (heading) title = heading[1];
        description.replaceChildren(...effects.map(effect => {
            const block = document.createElement('div');
            const effectHeading = effect.match(headingPattern);
            if (!heading && effectHeading) {
                const label = document.createElement('strong');
                label.textContent = effectHeading[1];
                block.append(label);
            }
            block.append(effectHeading ? effect.slice(effectHeading[0].length) : effect);
            return block;
        }));
    } else if (node.hasAttribute('data-skill-tooltip')) {
        description.innerHTML = content;
    } else {
        description.textContent = content;
    }
    panel.querySelector('#tooltip-panel-title').textContent = title;
}

function bindContextTooltip(node) {
    node.tabIndex = 0;
    node.setAttribute('role', 'button');
    node.setAttribute('aria-haspopup', 'dialog');
    node.setAttribute('aria-expanded', 'false');
    bindCursorTooltip(node, event => event.pointerType === 'mouse'
        && contextTooltipHover.matches && !activeContextTooltip, true);

    node.addEventListener('click', event => {
        if (activeContextTooltip?.trigger === node) {
            closeContextTooltip(true);
            return;
        }
        const content = node.dataset.tooltip;
        if (!content) return;
        closeContextTooltip();
        const panel = contextTooltipPanel ??= createContextTooltipPanel();
        renderContextTooltip(panel, node);
        const close = panel.querySelector('button');
        close.setAttribute('aria-label', window.I18nService?.t('common.close', 'Close') || 'Close');
        const line = event.detail ? Array.from(node.getClientRects())
            .findIndex(rect => event.clientY >= rect.top && event.clientY <= rect.bottom) : 0;
        activeContextTooltip = { trigger: node, line: Math.max(0, line) };
        node.setAttribute('aria-controls', panel.id);
        node.setAttribute('aria-expanded', 'true');
        hideHoveredContextTooltip?.();
        panel.hidden = false;
        panel.firstElementChild.scrollTop = 0;
        positionContextTooltip();
        if (!panel.hidden) panel.focus({ preventScroll: true });
    });
    node.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (!event.repeat) node.click();
    });
}

function bindCursorTooltip(node, shouldShow = () => true, trackContext = false) {
    let floating;
    const move = event => {
        if (!floating) return;
        const offset = 16;
        const gutter = 8;
        const { clientX: x, clientY: y } = event;
        const { offsetWidth: width, offsetHeight: height } = floating;
        floating.style.left = Math.max(gutter, x + offset + width + gutter > window.innerWidth ? x - width - offset : x + offset) + 'px';
        floating.style.top = Math.max(gutter, y + offset + height + gutter > window.innerHeight ? y - height - offset : y + offset) + 'px';
    };
    const enter = event => {
        const content = node.dataset.tooltip;
        if (!content || !shouldShow(event)) return;
        floating = document.getElementById('cursor-tooltip');
        if (!floating) {
            floating = document.createElement('div');
            floating.id = 'cursor-tooltip';
            floating.className = 'cursor-tooltip';
            document.body.appendChild(floating);
        }
        node.classList.add('js-tooltip-active');
        floating.innerHTML = content;
        floating.style.display = 'block';
        if (trackContext) hideHoveredContextTooltip = hide;
        move(event);
    };
    node.addEventListener('pointermove', move);
    const hide = () => {
        if (!floating) return;
        floating.style.display = 'none';
        floating = null;
        if (hideHoveredContextTooltip === hide) hideHoveredContextTooltip = null;
        node.classList.remove('js-tooltip-active');
    };
    node.addEventListener('pointerenter', enter);
    node.addEventListener('pointerleave', hide);
}

// 내부 유틸: 단일 요소에 툴팁 리스너 바인딩 (중복 방지)
function bindTooltipElement(el) {
    if (!el || el.dataset.tooltipBound === '1') return;
    if (el.matches('.help-icon[data-help-type], .revelation-value-item') && !el.dataset.tooltip) return;
    if (el.hasAttribute('data-skill-tooltip') || el.hasAttribute('data-tooltip-title')) {
        bindContextTooltip(el);
        el.dataset.tooltipBound = '1';
        return;
    }
    const viewportWidth = window.innerWidth;
    let node = el;

    // 현재 바인딩 모드 확인 (desktop/mobile)
    const currentMode = node.dataset.tooltipMode;

    if (viewportWidth > 1200) {
        // 데스크톱 모드 필요. 기존에 모바일로 바인딩되어 있다면 리셋
        if (currentMode !== 'desktop') {
            const fresh = node.cloneNode(true);
            fresh.classList.remove('mobile-banner');
            node.replaceWith(fresh);
            node = fresh;
            node.dataset.tooltipMode = 'desktop';
            // 남아있는 모바일 배너 제거
            const leftoverBanner = document.querySelector('.tooltip-mobile-banner');
            if (leftoverBanner) leftoverBanner.remove();
        } else {
            // 이미 데스크톱 모드면 계속 진행 (이전 바인딩이 제거되었을 수 있으므로 재검사)
        }

        bindCursorTooltip(node);

        // 중복 바인딩 방지 플래그
        node.dataset.tooltipBound = '1';
    } else {
        // 모바일 모드 필요. 기존에 데스크톱으로 바인딩되어 있다면 리셋
        if (currentMode !== 'mobile') {
            const fresh = node.cloneNode(true);
            fresh.classList.add('mobile-banner');
            node.replaceWith(fresh);
            node = fresh;
            node.dataset.tooltipMode = 'mobile';
        }

        const showMobileBanner = (tooltipText) => {
            if (!tooltipText) return false;
            const existingBanner = document.querySelector('.tooltip-mobile-banner');
            if (existingBanner) existingBanner.remove();
            const banner = document.createElement('div');
            banner.className = 'tooltip-mobile-banner';
            banner.innerHTML = tooltipText;
            const closeButton = document.createElement('button');
            closeButton.className = 'tooltip-banner-close';
            closeButton.innerHTML = '&times;';
            closeButton.onclick = () => { if (banner.parentElement) banner.remove(); };
            banner.appendChild(closeButton);
            if (!document.body) return false;
            document.body.appendChild(banner);
            setTimeout(() => { if (banner.parentElement) banner.remove(); }, 5000);
            return true;
        };

        const mobileBehavior = (node.getAttribute('data-tooltip-mobile') || 'click').toLowerCase();
        const parsedLongPressMs = parseInt(node.getAttribute('data-tooltip-longpress-ms') || '380', 10);
        const longPressMs = Number.isFinite(parsedLongPressMs) && parsedLongPressMs > 0 ? parsedLongPressMs : 380;

        if (mobileBehavior === 'longpress') {
            const MOVE_THRESHOLD = 8;
            let pressTimer = null;
            let startX = 0;
            let startY = 0;

            const clearPressTimer = () => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            };

            const beginPress = (clientX, clientY) => {
                startX = clientX;
                startY = clientY;
                node.dataset.tooltipLongpressTriggered = '0';
                clearPressTimer();
                pressTimer = setTimeout(() => {
                    pressTimer = null;
                    try {
                        const tooltipText = node.getAttribute('data-tooltip');
                        if (showMobileBanner(tooltipText)) {
                            node.dataset.tooltipLongpressTriggered = '1';
                        }
                    } catch (error) {
                        console.error('Failed to show long-press tooltip banner:', error);
                    }
                }, longPressMs);
            };

            const shouldCancelByMove = (clientX, clientY) => (
                Math.abs(clientX - startX) > MOVE_THRESHOLD ||
                Math.abs(clientY - startY) > MOVE_THRESHOLD
            );

            if (window.PointerEvent) {
                node.addEventListener('pointerdown', function (e) {
                    if (e.pointerType === 'mouse') return;
                    beginPress(e.clientX, e.clientY);
                });
                node.addEventListener('pointermove', function (e) {
                    if (e.pointerType === 'mouse' || !pressTimer) return;
                    if (shouldCancelByMove(e.clientX, e.clientY)) clearPressTimer();
                });
                node.addEventListener('pointerup', clearPressTimer);
                node.addEventListener('pointercancel', clearPressTimer);
                node.addEventListener('pointerleave', clearPressTimer);
            } else {
                node.addEventListener('touchstart', function (e) {
                    const touch = e.touches && e.touches[0];
                    if (!touch) return;
                    beginPress(touch.clientX, touch.clientY);
                }, { passive: true });
                node.addEventListener('touchmove', function (e) {
                    if (!pressTimer) return;
                    const touch = e.touches && e.touches[0];
                    if (!touch) return;
                    if (shouldCancelByMove(touch.clientX, touch.clientY)) clearPressTimer();
                }, { passive: true });
                node.addEventListener('touchend', clearPressTimer, { passive: true });
                node.addEventListener('touchcancel', clearPressTimer, { passive: true });
            }

            node.addEventListener('click', function (e) {
                if (this.dataset.tooltipLongpressTriggered === '1') {
                    this.dataset.tooltipLongpressTriggered = '0';
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        } else {
            node.addEventListener('click', function(e) {
                try {
                    const tooltipText = this.getAttribute('data-tooltip');
                    if (!tooltipText) return;
                    if (!showMobileBanner(tooltipText)) return;
                    e.preventDefault();
                    e.stopPropagation();
                } catch (error) { console.error('Mobile tooltip banner render failed:', error); }
            });
        }

        node.dataset.tooltipBound = '1';
    }
}

// 툴팁 기능 추가
const skillTooltipRuns = new WeakMap();

function skillTooltipLanguage() {
    return window.LanguageRouter?.getCurrentLanguage() || window.getCurrentLanguage?.() || 'kr';
}

function addTooltips() {
    const lang = skillTooltipLanguage();
    const module = window.ConfigTooltips;
    const pack = module?.load(lang);
    const legacy = lang === 'en' && typeof tooltip_en !== 'undefined' ? tooltip_en
        : lang === 'kr' && typeof tooltip !== 'undefined' ? tooltip : null;
    const descriptions = document.querySelectorAll('.ritual-description, .weapon-skill p, .skill-description, .set-desc, .persona-tier-info p, .persona-instinct-info p, .persona-unique-skill-info p, .persona-highlight-info p');
    
    descriptions.forEach(desc => {
        for (const span of desc.querySelectorAll('[data-skill-tooltip]')) {
            span.replaceWith(...span.childNodes);
        }
        desc.normalize();
        let html = desc.innerHTML;

        // 숫자와 퍼센트 처리 (소수점 포함)
        html = html.replace(/(\d+\.?\d*%?)(?![^<]*>)/g, (match, p1, offset, string) => {
            // 전체 문맥을 체크하기 위해 앞뒤 텍스트를 가져옴
            const beforeText = string.slice(Math.max(0, offset - 100), offset);
            // 현재 매치된 숫자 바로 뒤의 텍스트만 확인
            const afterText = string.slice(offset + match.length, Math.min(string.length, offset + match.length + 20));
            
            // enhancement-values나 skill-level-values 클래스를 가진 span 내부인지 확인
            const isInSpecialValues = (
                (/<span class="[^"]*\benhancement-values\b[^"]*">.*?$/.test(beforeText) &&
                !/<\/span>/.test(beforeText.split(/\<span class="[^"]*\benhancement-values\b[^"]*">/).pop())) ||
                (/<span class="[^"]*\bskill-level-values\b[^"]*">.*?$/.test(beforeText) &&
                !/<\/span>/.test(beforeText.split(/\<span class="[^"]*\bskill-level-values\b[^"]*">/).pop())) ||
                (/<span class="[^"]*\bsync-mindscape-value\b[^"]*">.*?$/.test(beforeText) &&
                !/<\/span>/.test(beforeText.split(/\<span class="[^"]*\bsync-mindscape-value\b[^"]*">/).pop()))
            );
            if (isInSpecialValues) {
                return match;
            }
            
            // HTML 태그를 제외한 순수 텍스트 컨텍스트 생성
            const fullContext = (beforeText + match + afterText).replace(/<[^>]*>/g, '');
            const cleanAfterText = afterText.replace(/<[^>]*>/g, '').trim();
            
            //console.log('Match:', match);
            //console.log('Clean After text:', cleanAfterText);
            //console.log('Context:', fullContext);
            
            
            
            // 바로 뒤에 오는 텍스트 체크
            if (/^(?:레벨|명|회|중첩|턴|잔|개|X|순위)/.test(cleanAfterText)) {
                //console.log('Matched immediate pattern:', cleanAfterText);
                return match;
            }
            
            // 1/2/>=3 패턴의 일부인지 체크
            if (/\d+\/\d+\/(?:>=|&gt;=)\d+/.test(fullContext)) {
                const pattern = /(\d+)\/(\d+)\/(?:>=|&gt;=)(\d+)/;
                const matches = fullContext.match(pattern);
                if (matches && matches[0].includes(match)) {
                    return match;
                }
            }
            
            
            // 나머지 예외 패턴들 체크
            const exceptionPatterns = [
                /\(1\/50\/70레벨\)/,       // "(숫자/숫자/숫자레벨)" 패턴
                /\d+명 이상/,                   // "숫자명 이상" 패턴
                /\d+명.*이상/                   // "숫자명 ... 이상" 패턴
            ];
            
            // 이미 number-value span으로 감싸져 있는지 확인하는 함수
            const isAlreadyWrapped = (text) => {
                return text.includes('class="number-value"');
            };

            // 예외 패턴 중 하나라도 매칭되면 원래 텍스트 반환
            for (const pattern of exceptionPatterns) {
                if (pattern.test(fullContext)) {
                    // 퍼센트 값은 예외에서 제외
                    if (match.endsWith('%') && !fullContext.includes('%의')) {
                        return isAlreadyWrapped(beforeText) ? match : `<span class="number-value">${p1}</span>`;
                    }
                    return match;
                }
            }

            
            const numberSlashPattern = /\d+\/\d+\/\d+(?!%|레벨)/;
            if (numberSlashPattern.test(fullContext)) {
                const slashMatch = fullContext.match(numberSlashPattern)[0];
                if (slashMatch.includes(match)) {
                    return isAlreadyWrapped(beforeText) ? match : `<span class="number-value">${match}</span>`;
                }
            }
            
            // 예외에 해당하지 않으면 span으로 감싸기
            return isAlreadyWrapped(beforeText) ? match : `<span class="number-value">${p1}</span>`;
        });

        
        if (html !== desc.innerHTML) desc.innerHTML = html;
        if (!pack) return;

        const run = {};
        skillTooltipRuns.set(desc, run);
        pack.then(data => {
            if (desc.isConnected && skillTooltipRuns.get(desc) === run && skillTooltipLanguage() === lang) {
                module.add(desc, data, legacy, lang, bindTooltipElement);
            }
        });
    });

    // 번역/치환이 끝난 후 현재 존재하는 모든 툴팁 요소에 리스너 바인딩
    document.querySelectorAll('.tooltip-text').forEach(bindTooltipElement);

    // 이후 DOM 변동(번역으로 인한 innerHTML 교체 등) 시 새로 추가되는 요소에도 자동 바인딩
    try {
        if (!window.__tooltipObserver) {
            const observer = new MutationObserver((mutations) => {
                if (activeContextTooltip && !activeContextTooltip.trigger.isConnected) closeContextTooltip();
                for (const m of mutations) {
                    if (m.type === 'childList') {
                        m.addedNodes && m.addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return; // ELEMENT_NODE
                            if (node.classList && node.classList.contains('tooltip-text')) bindTooltipElement(node);
                            const inner = node.querySelectorAll ? node.querySelectorAll('.tooltip-text') : [];
                            inner && inner.forEach(bindTooltipElement);
                        });
                    } else if (m.type === 'attributes' && m.target && m.target.classList && m.target.classList.contains('tooltip-text')) {
                        // data-tooltip 변경 시에도 바인딩 보장
                        bindTooltipElement(m.target);
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-tooltip'] });
            window.__tooltipObserver = observer;
        }
    } catch (_) {}
}
