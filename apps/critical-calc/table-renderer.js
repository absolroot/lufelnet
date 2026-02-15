/**
 * 공통 테이블 렌더러 라이브러리
 * defense-calc와 critical-calc에서 공통으로 사용하는 테이블 렌더링 로직
 */

class TableRenderer {
    /**
     * 아코디언 렌더링 (그룹 헤더 + 각 row)
     * @param {HTMLElement} tbody - 테이블 tbody 요소
     * @param {Object} config - 설정 객체
     * @param {Array} config.order - 그룹 순서 배열
     * @param {Object} config.groupsObj - 그룹별 아이템 객체
     * @param {Function} config.getGroupDisplayName - 그룹 표시 이름 가져오기 함수
     * @param {Function} config.createTableRow - 테이블 row 생성 함수
     * @param {Function} config.getCurrentLang - 현재 언어 가져오기 함수
     * @param {Function} config.getInitiallyOpen - 초기 열림 상태 결정 함수 (groupName, isMobile) => boolean
     * @param {Function} config.onHeaderClick - 헤더 클릭 시 추가 처리 함수 (optional)
     * @param {Function} config.onJCAttach - J&C 컨트롤 부착 함수 (optional)
     */
    static async renderAccordion(tbody, config) {
        // 기존 내용 비움
        while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

        const { order, groupsObj, getGroupDisplayName, createTableRow, getCurrentLang, getInitiallyOpen, onHeaderClick, onJCAttach } = config;

        // 스포일러 토글에 따른 표시 캐릭터 목록 계산
        const showSpoiler = (window.SpoilerState && typeof window.SpoilerState.get === 'function')
            ? !!window.SpoilerState.get()
            : !!(document.getElementById('showSpoilerToggle') && document.getElementById('showSpoilerToggle').checked);
        let visibleNames = [];
        try {
            if (typeof CharacterListLoader !== 'undefined') {
                visibleNames = await CharacterListLoader.getVisibleNames(showSpoiler);
            }
        } catch(_) {}

        order.forEach(groupName => {
            const items = groupsObj[groupName] || [];

            // 그룹 필터링: 원더/계시/공통 제외하고 목록에 없는 캐릭터는 스킵
            if (!['원더','계시','공통'].includes(groupName)) {
                if (Array.isArray(visibleNames) && visibleNames.length > 0 && !visibleNames.includes(groupName)) {
                    return; // skip rendering this group
                }
            }

            // 그룹 헤더 행
            const headerTr = document.createElement('tr');
            headerTr.className = 'group-header';
            headerTr.setAttribute('data-group', groupName);

            // 단일 셀 헤더
            const fullTd = document.createElement('td');
            fullTd.className = 'group-header-cell';
            fullTd.setAttribute('colspan', '8');

            const inner = document.createElement('div');
            inner.className = 'group-header-inner';

            const caret = document.createElement('span');
            caret.className = 'accordion-caret';
            const isMobile = window.innerWidth <= 1200;
            const initiallyOpen = getInitiallyOpen(groupName, isMobile);
            caret.classList.toggle('open', initiallyOpen);
            
            // SVG chevron 생성
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '16');
            svg.setAttribute('height', '16');
            svg.setAttribute('viewBox', '0 0 16 16');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (initiallyOpen) {
                // 아래를 보는 chevron (열림)
                path.setAttribute('d', 'M4 6L8 10L12 6');
            } else {
                // 오른쪽을 보는 chevron (닫힘)
                path.setAttribute('d', 'M6 4L10 8L6 12');
            }
            path.setAttribute('stroke', 'currentColor');
            path.setAttribute('stroke-width', '1.5');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            svg.appendChild(path);
            caret.appendChild(svg);
            inner.appendChild(caret);

            const infoWrap = document.createElement('span');
            infoWrap.className = 'group-info';
            const img = document.createElement('img');
            img.src = `${BASE_URL}/assets/img/character-half/${groupName}.webp`;
            img.className = 'group-avatar';
            infoWrap.appendChild(img);
            const nameSpan = document.createElement('span');
            nameSpan.className = 'group-name';
            nameSpan.textContent = getGroupDisplayName(groupName);
            infoWrap.appendChild(nameSpan);
            inner.appendChild(infoWrap);
            fullTd.appendChild(inner);
            headerTr.appendChild(fullTd);

            // J&C 전용 Desire 레벨 입력 컨트롤 추가 (DOM 구조 구성 후)
            if (onJCAttach) {
                try {
                    onJCAttach(headerTr, groupName);
                } catch(_) {}
            }

            // 토글 동작: 같은 그룹의 데이터 행 show/hide
            headerTr.addEventListener('click', () => {
                const isOpen = caret.classList.contains('open');
                const newIsOpen = !isOpen;
                caret.classList.toggle('open', newIsOpen);
                
                // 그룹 헤더의 열림/닫힘 상태 클래스 업데이트
                if (newIsOpen) {
                    headerTr.classList.add('group-open');
                    headerTr.classList.remove('group-closed');
                } else {
                    headerTr.classList.add('group-closed');
                    headerTr.classList.remove('group-open');
                }
                
                // SVG chevron 업데이트
                const svg = caret.querySelector('svg');
                if (svg) {
                    const path = svg.querySelector('path');
                    if (path) {
                        if (newIsOpen) {
                            // 열림: 아래를 보는 chevron
                            path.setAttribute('d', 'M4 6L8 10L12 6');
                        } else {
                            // 닫힘: 오른쪽을 보는 chevron
                            path.setAttribute('d', 'M6 4L10 8L6 12');
                        }
                    }
                }
                
                items.forEach(it => {
                    if (it.__rowEl) {
                        if (newIsOpen) {
                            // 모바일에서는 grid, 데스크탑에서는 인라인 스타일 제거하여 CSS 적용
                            const isMobile = window.innerWidth <= 1200;
                            if (isMobile) {
                                it.__rowEl.style.setProperty('display', 'grid', 'important');
                            } else {
                                // 데스크탑에서는 인라인 스타일 제거
                                it.__rowEl.style.removeProperty('display');
                            }
                        } else {
                            // 모바일 CSS의 !important를 덮어쓰기 위해 !important 사용
                            it.__rowEl.style.setProperty('display', 'none', 'important');
                        }
                    }
                });
                
                // 추가 클릭 처리
                if (onHeaderClick) {
                    onHeaderClick(newIsOpen, items);
                }
            });
            
            // 초기 상태 클래스 설정
            if (initiallyOpen) {
                headerTr.classList.add('group-open');
            } else {
                headerTr.classList.add('group-closed');
            }

            tbody.appendChild(headerTr);

            // 데이터 행들
            items.forEach((item, index) => {
                const row = createTableRow(item, groupName);
                // 초기 표시 상태
                if (initiallyOpen) {
                    const isMobile = window.innerWidth <= 1200;
                    if (isMobile) {
                        row.style.setProperty('display', 'grid', 'important');
                    } else {
                        // 데스크탑에서는 인라인 스타일 제거
                        row.style.removeProperty('display');
                    }
                } else {
                    // 모바일 CSS의 !important를 덮어쓰기 위해 !important 사용
                    row.style.setProperty('display', 'none', 'important');
                }
                row.classList.add('group-row');
                row.setAttribute('data-group', groupName);
                
                // 각 그룹의 마지막 row에 클래스 추가
                if (index === items.length - 1) {
                    row.classList.add('group-last-row');
                }
                
                // 참조 저장해 토글에 사용
                try {
                    if (!Object.prototype.hasOwnProperty.call(item, '__rowEl')) {
                        Object.defineProperty(item, '__rowEl', { value: row, writable: true, configurable: true });
                    } else {
                        item.__rowEl = row;
                    }
                } catch(_) {
                    try { item.__rowEl = row; } catch(_) {}
                }
                tbody.appendChild(row);
            });

            // 그룹 헤더 렌더 후 텍스트 번역 보정
            try { if (typeof I18NUtils !== 'undefined' && I18NUtils.translateStatTexts) { I18NUtils.translateStatTexts(tbody); } } catch(_) {}
        });
    }
}
