// 내부 유틸: 단일 요소에 툴팁 리스너 바인딩 (중복 방지)
function bindTooltipElement(el) {
    if (!el || el.dataset.tooltipBound === '1') return;
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

        // PC: 커서 추종 툴팁 컨테이너 준비
        const floating = document.getElementById('cursor-tooltip') || (function() {
            const el = document.createElement('div');
            el.id = 'cursor-tooltip';
            el.className = 'cursor-tooltip';
            document.body.appendChild(el);
            return el;
        })();

        const showFloating = (el, content) => { if (!content) return; el.textContent = content; el.style.display = 'block'; };
        const hideFloating = (el) => { el.style.display = 'none'; };
        const moveFloating = (el, e) => {
            const offset = 16;
            let x = e.clientX + offset;
            let y = e.clientY + offset;
            const vw = window.innerWidth; const vh = window.innerHeight;
            if (el.style.display !== 'block') { el.style.display = 'block'; }
            const ttW = el.offsetWidth; const ttH = el.offsetHeight;
            if (x + ttW + 8 > vw) x = e.clientX - ttW - offset;
            if (y + ttH + 8 > vh) y = e.clientY - ttH - offset;
            el.style.left = x + 'px'; el.style.top = y + 'px';
        };

        node.addEventListener('mouseenter', function(e) {
            try {
                const content = this.getAttribute('data-tooltip');
                this.classList.add('js-tooltip-active');
                showFloating(floating, content); moveFloating(floating, e);
            } catch (_) {}
        });
        node.addEventListener('mousemove', function(e) { try { moveFloating(floating, e); } catch (_) {} });
        node.addEventListener('mouseleave', function() { try { hideFloating(floating); this.classList.remove('js-tooltip-active'); } catch (_) {} });

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

        node.addEventListener('click', function(e) {
            try {
                const tooltipText = this.getAttribute('data-tooltip');
                if (!tooltipText) return;
                const existingBanner = document.querySelector('.tooltip-mobile-banner');
                if (existingBanner) existingBanner.remove();
                const banner = document.createElement('div');
                banner.className = 'tooltip-mobile-banner';
                banner.textContent = tooltipText;
                const closeButton = document.createElement('button');
                closeButton.className = 'tooltip-banner-close';
                closeButton.innerHTML = '×';
                closeButton.onclick = () => { if (banner.parentElement) banner.remove(); };
                banner.appendChild(closeButton);
                if (document.body) document.body.appendChild(banner); else return;
                setTimeout(() => { if (banner.parentElement) banner.remove(); }, 5000);
                e.preventDefault(); e.stopPropagation();
            } catch (error) { console.error('모바일 툴팁 배너 생성 중 오류:', error); }
        });

        node.dataset.tooltipBound = '1';
    }
}

// 툴팁 기능 추가
function addTooltips() {
    const descriptions = document.querySelectorAll('.ritual-description, .weapon-skill p, .skill-description, .set-desc, .persona-instinct-info p, .persona-unique-skill-info p, .persona-highlight-info p');
    
    descriptions.forEach(desc => {
        let html = desc.innerHTML;
        
        // 기존에 생성된 tooltip wrapper를 제거하여 중첩 생성을 방지
        // 예: <span class="tooltip-text" ...>Blessing</span> -> Blessing
        html = html.replace(/<span\s+class=["']tooltip-text["'][^>]*>([\s\S]*?)<\/span>/g, '$1');
        
        
        // 숫자와 퍼센트 처리 (소수점 포함)
        html = html.replace(/(\d+\.?\d*%?)(?![^<]*>)/g, (match, p1, offset, string) => {
            // 전체 문맥을 체크하기 위해 앞뒤 텍스트를 가져옴
            const beforeText = string.slice(Math.max(0, offset - 100), offset);
            // 현재 매치된 숫자 바로 뒤의 텍스트만 확인
            const afterText = string.slice(offset + match.length, Math.min(string.length, offset + match.length + 20));
            
            // enhancement-values나 skill-level-values 클래스를 가진 span 내부인지 확인
            const isInSpecialValues = (
                (/<span class="enhancement-values">.*?$/.test(beforeText) && 
                !/<\/span>/.test(beforeText.split('<span class="enhancement-values">').pop())) ||
                (/<span class="skill-level-values">.*?$/.test(beforeText) && 
                !/<\/span>/.test(beforeText.split('<span class="skill-level-values">').pop()))
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
            if (/^(?:레벨|명|회|중첩|턴|잔|개)/.test(cleanAfterText)) {
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

        
        // 언어별 툴팁 처리
        const getLang = () => {
            try { return (typeof window !== 'undefined' && typeof window.getCurrentLanguage === 'function') ? window.getCurrentLanguage() : null; } catch (e) { return null; }
        };
        const currentLang = getLang() || (new URLSearchParams(window.location.search).get('lang') || 'kr');

        // 유틸: 정규식 이스케이프
        const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        if (currentLang === 'en' && typeof tooltip_en !== 'undefined') {
            const specialKeywords=['Chosen One','Beat','Affection','Memory','Inspiration','Imagination','Creation','Standard','Basic','Tailor-Made']
            // EN: []로 감싸진 키워드를 tooltip_en으로 매칭 (없으면 아무 것도 하지 않음)
            const dict = tooltip_en;
            const sortedKeys = Object.keys(dict).filter(k => k).sort((a, b) => b.length - a.length);
            let counter = 0;
            const replacements = new Map();

            sortedKeys.forEach(key => {
                if (!specialKeywords.includes(key)) {
                    // 대소문자 구분 안함
                    const keyEsc = escapeRegExp(key);
                    const regex = new RegExp(`${keyEsc}(?![^<]*>)`, 'gi');
                    html = html.replace(regex, (match) => {
                        const marker = `###TOOLTIP${counter}###`;
                        replacements.set(marker, `<span class="tooltip-text" data-tooltip="${dict[key]}">${match}</span>`);
                        counter++;
                        return marker;
                    });
                }
                else{
                    const keyEsc = escapeRegExp(key);
                    const regex = new RegExp(`\\[${keyEsc}\\](?![^<]*>)`, 'gi');
                    html = html.replace(regex, () => {
                        const marker = `###TOOLTIP${counter}###`;
                        replacements.set(marker, `[<span class="tooltip-text" data-tooltip="${dict[key]}">${key}</span>]`);
                        counter++;
                        return marker;
                    });
                }
            });

            // 적용
            replacements.forEach((value, marker) => { html = html.replace(marker, value); });
            desc.innerHTML = html;
            // EN에서는 『』 장식 처리하지 않음
        } else if (typeof tooltip !== 'undefined') {
            // KR: 기존 『』 매칭 유지
            const sortedKeys = Object.keys(tooltip)
                .filter(key => key)
                .sort((a, b) => b.length - a.length);
            
            const specialKeywords = ['추가 효과', '동결', '감전', '풍습', '화상', '정신 이상', '망각', '절망', '수면', '현기증', '광노', '도발', '화염 속성 TECHNICAL', '핵열 속성 TECHNICAL', '스킬 마스터','빙결 속성 TECHNICAL','TECH 이상'];
            const specialEffectKeywords = ['주원', '축복'];
            
            let counter = 0;
            const replacements = new Map();
            
            sortedKeys.forEach(key => {
                let replacedForKey = false;
                const keyEsc = escapeRegExp(key);
                if (specialKeywords.includes(key)) {
                    const regex = new RegExp(`${keyEsc}(?![^<]*>)`, 'g');
                    html = html.replace(regex, (match) => {
                        const marker = `###TOOLTIP${counter}###`;
                        replacements.set(marker, `<span class="tooltip-text" data-tooltip="${tooltip[key]}">${match}</span>`);
                        counter++;
                        replacedForKey = true;
                        return marker;
                    });
                } else if (specialEffectKeywords.includes(key)) {
                    const regex = new RegExp(`${keyEsc} 효과(?![^<]*>)`, 'g');
                    html = html.replace(regex, (match) => {
                        const marker = `###TOOLTIP${counter}###`;
                        replacements.set(marker, `<span class="tooltip-text" data-tooltip="${tooltip[key]}">${key}</span> 효과`);
                        counter++;
                        replacedForKey = true;
                        return marker;
                    });
                } else {
                    const regex = new RegExp(`『${keyEsc}』(?![^<]*>)`, 'g');
                    html = html.replace(regex, () => {
                        const marker = `###TOOLTIP${counter}###`;
                        replacements.set(marker, `『<span class="tooltip-text" data-tooltip="${tooltip[key]}">${key}</span>』`);
                        counter++;
                        replacedForKey = true;
                        return marker;
                    });
                }
                // if (replacedForKey) matchedKeys.push(key);
            });
            
            // 임시 마커를 실제 툴팁으로 교체
            replacements.forEach((value, marker) => { html = html.replace(marker, value); });
            
            desc.innerHTML = html;

            // 『』 장식 처리 (KR 전용)
            /*
            if (!html.includes('class="bracket-left"') && !html.includes('class="bracket-right"')) {
                html = html.replace(/『(?![^<]*>)/g, '<span class="bracket-left">『</span>');
                html = html.replace(/』(?![^<]*>)/g, '<span class="bracket-right">』</span>');
                
                desc.innerHTML = html;
            }*/
        }
    });

    // 번역/치환이 끝난 후 현재 존재하는 모든 툴팁 요소에 리스너 바인딩
    document.querySelectorAll('.tooltip-text').forEach(bindTooltipElement);

    // 이후 DOM 변동(번역으로 인한 innerHTML 교체 등) 시 새로 추가되는 요소에도 자동 바인딩
    try {
        if (!window.__tooltipObserver) {
            const observer = new MutationObserver((mutations) => {
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