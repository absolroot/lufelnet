// 툴팁 기능 추가
function addTooltips() {
    const descriptions = document.querySelectorAll('.ritual-description, .weapon-skill p, .skill-description, .set-desc, .persona-instinct-info p, .persona-unique-skill-info p, .persona-highlight-info p');
    
    descriptions.forEach(desc => {
        let html = desc.innerHTML;
        
        
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
            if (/^(?:레벨|명|회|중첩|턴|잔|개|이)/.test(cleanAfterText)) {
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
                /\d+\.?\d*%의 (기본|고정) 확률/, // "X%의 기본/고정 확률" 패턴
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

        
        // tooltip 객체의 키를 길이순으로 정렬 (긴 것이 먼저 오도록)
        const sortedKeys = Object.keys(tooltip)
            .filter(key => key) // 빈 문자열 제외
            .sort((a, b) => b.length - a.length);
            
        // 특별 키워드 목록 (『』없이도 적용될 키워드들)
        const specialKeywords = ['추가 효과', '동결', '감전', '풍습', '화상', '정신 이상', '망각', '수면', '현기증', '광노', '도발', '화염 속성 TECHNICAL', '핵열 속성 TECHNICAL', '스킬 마스터','빙결 속성 TECHNICAL','TECH 이상'];
        // 특수 처리가 필요한 키워드들
        const specialEffectKeywords = ['주원', '축복'];
        
        let counter = 0;
        const replacements = new Map();
        
        sortedKeys.forEach(key => {
            if (specialKeywords.includes(key)) {
                // 특별 키워드는 『』없이 직접 매칭
                const regex = new RegExp(`${key}(?![^<]*>)`, 'g');
                html = html.replace(regex, (match) => {
                    const marker = `###TOOLTIP${counter}###`;
                    replacements.set(marker, `<span class="tooltip-text" data-tooltip="${tooltip[key]}">${match}</span>`);
                    counter++;
                    return marker;
                });
            } else if (specialEffectKeywords.includes(key)) {
                // '효과'가 뒤에 오는 경우에만 매칭
                const regex = new RegExp(`${key} 효과(?![^<]*>)`, 'g');
                html = html.replace(regex, (match) => {
                    const marker = `###TOOLTIP${counter}###`;
                    replacements.set(marker, `<span class="tooltip-text" data-tooltip="${tooltip[key]}">${key}</span> 효과`);
                    counter++;
                    return marker;
                });
            } else {
                // 기존 『』로 감싸진 키워드 매칭
                const regex = new RegExp(`『${key}』(?![^<]*>)`, 'g');            
                html = html.replace(regex, (match) => {
                    const marker = `###TOOLTIP${counter}###`;
                    replacements.set(marker, `『<span class="tooltip-text" data-tooltip="${tooltip[key]}">${key}</span>』`);
                    counter++;
                    return marker;
                });
            }
        });
        
        // 임시 마커를 실제 툴팁으로 교체
        replacements.forEach((value, marker) => {
            html = html.replace(marker, value);
        });
        
        desc.innerHTML = html;

        // 『』가 이미 span으로 감싸져 있는지 확인
        if (!html.includes('class="bracket-left"') && !html.includes('class="bracket-right"')) {
            // 『』 처리 코드
            html = html.replace(/『(?![^<]*>)/g, '<span class="bracket-left">『</span>');
            html = html.replace(/』(?![^<]*>)/g, '<span class="bracket-right">』</span>');
            
            desc.innerHTML = html;
        }
    });

    // 툴팁 위치 조정
    const tooltips = document.querySelectorAll('.tooltip-text');
    
    tooltips.forEach(tooltip => {
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth > 1200) {
            // PC 환경에서는 마우스 진입 시에만 위치 계산
            tooltip.addEventListener('mouseenter', function() {
                const range = document.createRange();
                const textNode = this.childNodes[0];
                
                if (!textNode) return;

                range.setStart(textNode, 0);
                range.setEnd(textNode, textNode.length);
                const rects = Array.from(range.getClientRects());
                
                let rect;
                if (rects.length > 1) {
                    rect = rects.reduce((shortest, current) => 
                        current.width < shortest.width ? current : shortest
                    );
                } else {
                    rect = rects[0];
                }

                if (!rect) return;

                const relativePosition = rect.left / window.innerWidth;
                
                if (rect.top < 100) {
                    this.classList.add('show-bottom');
                }

                if (relativePosition < 0.25) {
                    this.classList.add('align-right');
                } else if (relativePosition > 0.75) {
                    this.classList.add('align-left');
                } else {
                    this.classList.add('align-center');
                }
            });

            // 마우스가 떠날 때 클래스 제거
            tooltip.addEventListener('mouseleave', function() {
                this.classList.remove('show-bottom', 'align-right', 'align-left', 'align-center');
            });
        } else {
            // 모바일 환경에서는 배너 스타일 적용
            tooltip.classList.add('mobile-banner');
            
            // 클릭 이벤트 리스너 추가
            tooltip.addEventListener('click', function(e) {
                try {
                    const tooltipText = this.getAttribute('data-tooltip');
                    
                    if (!tooltipText) {
                        console.warn('툴팁 텍스트가 없습니다.');
                        return;
                    }
                    
                    // 기존 배너가 있다면 제거
                    const existingBanner = document.querySelector('.tooltip-mobile-banner');
                    if (existingBanner) {
                        existingBanner.remove();
                    }
                    
                    // 새로운 배너 생성
                    const banner = document.createElement('div');
                    banner.className = 'tooltip-mobile-banner';
                    banner.textContent = tooltipText;
                    
                    // 배너에 닫기 버튼 추가
                    const closeButton = document.createElement('button');
                    closeButton.className = 'tooltip-banner-close';
                    closeButton.innerHTML = '×';
                    closeButton.onclick = () => {
                        if (banner.parentElement) {
                            banner.remove();
                        }
                    };
                    banner.appendChild(closeButton);
                    
                    // 배너를 body에 추가
                    if (document.body) {
                        document.body.appendChild(banner);
                    } else {
                        console.warn('document.body가 없습니다.');
                        return;
                    }
                    
                    // 5초 후 자동으로 배너 제거
                    setTimeout(() => {
                        if (banner.parentElement) {
                            banner.remove();
                        }
                    }, 5000);
                    
                    e.preventDefault();
                    e.stopPropagation();
                } catch (error) {
                    console.error('모바일 툴팁 배너 생성 중 오류:', error);
                }
            });
        }
    });
}