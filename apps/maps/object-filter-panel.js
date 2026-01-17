// Object Filter Panel - 오브젝트 필터 및 줌 컨트롤

(function() {
    'use strict';

    let objectFilters = {};

    window.ObjectFilterPanel = {
        // 필터 UI 업데이트
        updateFilterUI(objects) {
            const container = document.getElementById('filter-container');
            if (!container) return;
            
            container.innerHTML = '';

            const objectTypes = new Set();
            objects.forEach(obj => {
                if (!obj || !obj.image) return;
                
                // 비대화형 아이콘은 필터에서 제외
                if (window.MapsCore && window.MapsCore.isNonInteractiveIcon && 
                    window.MapsCore.isNonInteractiveIcon(obj.image)) {
                    return;
                }
                
                // 오브젝트 타입 추출 (더 견고한 로직)
                let type = obj.image;
                // yishijie-icon- 접두사 제거
                if (type.startsWith('yishijie-icon-')) {
                    type = type.replace('yishijie-icon-', '');
                }
                // .png 확장자 제거
                if (type.endsWith('.png')) {
                    type = type.replace('.png', '');
                }
                
                if (type) {
                    objectTypes.add(type);
                }
            });

            objectFilters = {};
            objectTypes.forEach(type => {
                objectFilters[type] = true;
            });

            const ICON_PATH = window.MapsCore ? window.MapsCore.getPaths().ICON_PATH : '';

            Array.from(objectTypes).sort().forEach(type => {
                const filterItem = document.createElement('div');
                filterItem.className = 'filter-item';
                filterItem.dataset.type = type;
                filterItem.dataset.checked = 'true';

                // 아이콘 이미지
                const icon = document.createElement('img');
                icon.className = 'filter-icon';
                icon.src = `${ICON_PATH}yishijie-icon-${type}.png`;
                icon.onerror = () => {
                    icon.style.display = 'none';
                };

                // 체크 표시 SVG (우측 상단 라벨 형식)
                const checkMark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                checkMark.setAttribute('class', 'filter-checkmark');
                checkMark.setAttribute('viewBox', '0 0 24 24');
                checkMark.setAttribute('width', '12');
                checkMark.setAttribute('height', '12');
                checkMark.style.display = 'flex'; // 초기에는 모두 체크된 상태
                
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z');
                path.setAttribute('fill', '#ffffff');
                checkMark.appendChild(path);

                // 클릭 이벤트
                filterItem.addEventListener('click', () => {
                    const isChecked = filterItem.dataset.checked === 'true';
                    filterItem.dataset.checked = isChecked ? 'false' : 'true';
                    checkMark.style.display = isChecked ? 'none' : 'flex';
                    objectFilters[type] = !isChecked;
                    this.updateObjectVisibility();
                });

                filterItem.appendChild(icon);
                filterItem.appendChild(checkMark);
                container.appendChild(filterItem);
            });
        },

        // 오브젝트 가시성 업데이트
        updateObjectVisibility() {
            if (!window.MapsCore) return;
            const objectSprites = window.MapsCore.getObjectSprites();
            objectSprites.forEach(sprite => {
                const type = sprite.objectType;
                sprite.visible = objectFilters[type] !== false;
            });
        },

        // 줌 컨트롤 초기화
        initZoomControls() {
            const zoomIn = document.getElementById('zoom-in');
            const zoomOut = document.getElementById('zoom-out');
            const zoomReset = document.getElementById('zoom-reset');

            if (zoomIn) {
                zoomIn.addEventListener('click', () => {
                    if (window.MapsCore) {
                        window.MapsCore.zoomAtPoint(
                            window.innerWidth / 2,
                            window.innerHeight / 2,
                            1.2
                        );
                    }
                });
            }

            if (zoomOut) {
                zoomOut.addEventListener('click', () => {
                    if (window.MapsCore) {
                        window.MapsCore.zoomAtPoint(
                            window.innerWidth / 2,
                            window.innerHeight / 2,
                            0.8
                        );
                    }
                });
            }

            if (zoomReset) {
                zoomReset.addEventListener('click', () => {
                    if (window.MapsCore) {
                        window.MapsCore.setZoomLevel(1);
                        const mapContainer = window.MapsCore.getMapContainer();
                        if (mapContainer) {
                            mapContainer.scale.set(1);
                        }
                        const currentMapData = window.MapsCore.getCurrentMapData();
                        if (currentMapData) {
                            window.MapsCore.centerMap(currentMapData.map_size);
                        }
                    }
                });
            }
        },

        // UI 번역
        translateUI() {
            if (!window.MapsI18n) return;
            const lang = window.MapsI18n.getCurrentLanguage();
            
            const objectFilterTitle = document.getElementById('object-filter-title');
            if (objectFilterTitle) {
                objectFilterTitle.textContent = window.MapsI18n.getText(lang, 'objectFilter');
            }
            
            const selectAllText = document.getElementById('select-all-text');
            if (selectAllText) {
                selectAllText.textContent = window.MapsI18n.getText(lang, 'selectAll');
            }
            
            const resetFilterText = document.getElementById('reset-filter-text');
            if (resetFilterText) {
                resetFilterText.textContent = window.MapsI18n.getText(lang, 'resetFilter');
            }
            
            const zoomLabel = document.querySelector('#object-filter-panel .control-group label');
            if (zoomLabel) {
                zoomLabel.textContent = window.MapsI18n.getText(lang, 'zoom');
            }
            
            const resetBtn = document.getElementById('zoom-reset');
            if (resetBtn) {
                resetBtn.textContent = window.MapsI18n.getText(lang, 'reset');
            }
            
            const dragMoveText = document.getElementById('drag-move-text');
            if (dragMoveText) {
                dragMoveText.textContent = window.MapsI18n.getText(lang, 'dragMove');
            }
            
            const wheelZoomText = document.getElementById('wheel-zoom-text');
            if (wheelZoomText) {
                wheelZoomText.textContent = window.MapsI18n.getText(lang, 'wheelZoom');
            }
        },

        // 언어 선택기 초기화
        initLanguageSelector() {
            const BASE_URL = typeof window.BASE_URL !== 'undefined' ? window.BASE_URL : '';
            const currentLang = window.MapsI18n ? window.MapsI18n.getCurrentLanguage() : 'kr';
            
            const selectedOption = document.querySelector('#object-filter-panel .selected-option');
            const optionsContainer = document.querySelector('#object-filter-panel .options-container');
            const options = document.querySelectorAll('#object-filter-panel .option');
            
            if (!selectedOption || !optionsContainer) return;
            
            // 현재 언어에 맞게 선택된 옵션 업데이트
            const flagImg = selectedOption.querySelector('.flag-icon');
            const flagSpan = selectedOption.querySelector('span');
            
            if (flagImg) {
                flagImg.src = `${BASE_URL}/assets/img/flags/${currentLang}.png`;
                flagImg.alt = currentLang;
            }
            if (flagSpan) {
                flagSpan.textContent = currentLang === 'kr' ? '한국어' : currentLang === 'en' ? 'English' : currentLang === 'jp' ? '日本語' : '中文';
            }
            
            // 옵션들의 플래그 이미지 설정
            options.forEach(option => {
                const lang = option.getAttribute('data-value');
                const optionFlagImg = option.querySelector('.flag-icon');
                if (optionFlagImg && lang) {
                    optionFlagImg.src = `${BASE_URL}/assets/img/flags/${lang}.png`;
                    optionFlagImg.alt = lang;
                }
                
                // 현재 선택된 언어 표시
                if (lang === currentLang) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
            
            // 선택된 옵션 클릭 시 드롭다운 토글
            if (!selectedOption.hasAttribute('data-event-bound')) {
                selectedOption.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    optionsContainer.classList.toggle('active');
                });
                selectedOption.setAttribute('data-event-bound', 'true');
            }
            
            // 옵션 클릭 시 언어 변경
            options.forEach(option => {
                if (!option.hasAttribute('data-event-bound')) {
                    option.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        
                        const lang = option.getAttribute('data-value');
                        if (lang) {
                            this.selectLanguage(lang);
                        }
                    });
                    option.setAttribute('data-event-bound', 'true');
                }
            });
        },
        
        // 언어 선택 함수
        selectLanguage(lang) {
            // 드롭다운 닫기
            const optionsContainer = document.querySelector('#object-filter-panel .options-container');
            if (optionsContainer) {
                optionsContainer.classList.remove('active');
            }
            
            // 선호 언어 저장
            localStorage.setItem('preferredLanguage', lang);
            
            // 현재 URL 구성
            const currentPath = window.location.pathname;
            const currentSearch = window.location.search;
            
            // URL 파라미터 구성
            const params = new URLSearchParams(currentSearch);
            params.set('lang', lang);
            
            // 경로 정리 (기존 언어 디렉토리 제거)
            let cleanPath = currentPath;
            const pathSegments = currentPath.split('/').filter(Boolean);
            
            // 첫 번째 세그먼트가 언어 코드인 경우 제거
            if (pathSegments.length > 0 && ['kr', 'en', 'jp', 'cn'].includes(pathSegments[0])) {
                pathSegments.shift();
                cleanPath = '/' + pathSegments.join('/');
            }
            
            // 빈 경로면 루트로
            if (cleanPath === '/' || cleanPath === '') {
                cleanPath = '/';
            }
            
            // 새 URL 생성
            const newUrl = cleanPath + '?' + params.toString();
            
            // 페이지 이동
            window.location.href = newUrl;
        },

        // 전체 선택
        selectAll() {
            const filterItems = document.querySelectorAll('.filter-item');
            filterItems.forEach(item => {
                item.dataset.checked = 'true';
                const checkMark = item.querySelector('.filter-checkmark');
                if (checkMark) {
                    checkMark.style.display = 'flex';
                }
                const type = item.dataset.type;
                objectFilters[type] = true;
            });
            this.updateObjectVisibility();
        },

        // 필터 초기화
        resetFilters() {
            const filterItems = document.querySelectorAll('.filter-item');
            filterItems.forEach(item => {
                item.dataset.checked = 'false';
                const checkMark = item.querySelector('.filter-checkmark');
                if (checkMark) {
                    checkMark.style.display = 'none';
                }
                const type = item.dataset.type;
                objectFilters[type] = false;
            });
            this.updateObjectVisibility();
        },

        // 필터 컨트롤 버튼 초기화
        initFilterControls() {
            const selectAllBtn = document.getElementById('select-all-btn');
            const resetBtn = document.getElementById('reset-filter-btn');

            if (selectAllBtn) {
                selectAllBtn.addEventListener('click', () => {
                    this.selectAll();
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.resetFilters();
                });
            }
        },

        // 모바일 감지
        isMobile() {
            return window.innerWidth <= 768;
        },

        // 모바일 바텀시트 초기화
        initMobileBottomsheet() {
            const panel = document.getElementById('object-filter-panel');
            const filterBtn = document.getElementById('mobile-filter-btn');
            const overlay = document.getElementById('mobile-overlay');

            if (!panel || !filterBtn) return;

            // 바텀시트 헤더 추가 (한 번만)
            if (!panel.querySelector('.bottomsheet-header')) {
                const header = document.createElement('div');
                header.className = 'bottomsheet-header';
                header.innerHTML = `
                    <div class="bottomsheet-handle"></div>
                    <div class="bottomsheet-title" id="filter-panel-title">오브젝트 필터</div>
                `;

                const closeBtn = document.createElement('button');
                closeBtn.className = 'bottomsheet-close';
                closeBtn.innerHTML = '&times;';
                closeBtn.addEventListener('click', () => this.closeMobilePanel());

                panel.insertBefore(header, panel.firstChild);
                panel.appendChild(closeBtn);
            }

            // 모바일 여부에 따라 클래스 토글
            if (this.isMobile()) {
                panel.classList.add('mobile-bottomsheet');
            }

            // 필터 버튼 클릭 이벤트
            if (!filterBtn.dataset.eventBound) {
                filterBtn.addEventListener('click', () => {
                    this.toggleMobilePanel();
                });
                filterBtn.dataset.eventBound = 'true';
            }

            // 리사이즈 이벤트
            if (!this._resizeHandler) {
                this._resizeHandler = () => {
                    const panel = document.getElementById('object-filter-panel');
                    if (!panel) return;

                    if (this.isMobile()) {
                        panel.classList.add('mobile-bottomsheet');
                    } else {
                        panel.classList.remove('mobile-bottomsheet', 'open');
                        const overlay = document.getElementById('mobile-overlay');
                        if (overlay) overlay.classList.remove('active');
                        const filterBtn = document.getElementById('mobile-filter-btn');
                        if (filterBtn) filterBtn.classList.remove('active');
                    }
                };
                window.addEventListener('resize', this._resizeHandler);
            }
        },

        // 모바일 패널 토글
        toggleMobilePanel() {
            const panel = document.getElementById('object-filter-panel');
            const filterBtn = document.getElementById('mobile-filter-btn');
            const overlay = document.getElementById('mobile-overlay');

            if (!panel) return;

            const isOpen = panel.classList.contains('open');

            if (isOpen) {
                this.closeMobilePanel();
            } else {
                // 다른 패널 닫기
                if (window.MapSelectPanel) {
                    window.MapSelectPanel.closeMobilePanel();
                }

                panel.classList.add('open');
                if (filterBtn) filterBtn.classList.add('active');
                if (overlay) overlay.classList.add('active');
            }
        },

        // 모바일 패널 닫기
        closeMobilePanel() {
            const panel = document.getElementById('object-filter-panel');
            const filterBtn = document.getElementById('mobile-filter-btn');
            const overlay = document.getElementById('mobile-overlay');

            if (panel) panel.classList.remove('open');
            if (filterBtn) filterBtn.classList.remove('active');

            // 맵 패널도 닫혀있으면 오버레이 숨김
            const mapPanel = document.getElementById('map-select-panel');
            if (mapPanel && !mapPanel.classList.contains('open')) {
                if (overlay) overlay.classList.remove('active');
            }
        },

        // 모바일 UI 번역
        translateMobileUI() {
            if (!window.MapsI18n) return;
            const lang = window.MapsI18n.getCurrentLanguage();

            const filterPanelTitle = document.getElementById('filter-panel-title');
            if (filterPanelTitle) {
                filterPanelTitle.textContent = window.MapsI18n.getText(lang, 'objectFilter') || '오브젝트 필터';
            }

            const filterBtnSpan = document.querySelector('#mobile-filter-btn span');
            if (filterBtnSpan) {
                filterBtnSpan.textContent = window.MapsI18n.getText(lang, 'filter') || '필터';
            }
        },

        // 초기화
        init() {
            this.initZoomControls();
            this.initFilterControls();
            this.translateUI();
            this.initLanguageSelector();
            this.initMobileBottomsheet();
            this.translateMobileUI();
            this.initRandomPolygon();
        },

        // 랜덤 폴리곤 초기화
        initRandomPolygon() {
            const panel = document.getElementById('object-filter-panel');
            if (!panel) return;

            // 랜덤 CSS 변수 설정 (-1% ~ +1% 범위)
            const randomValues = {};
            for (let i = 1; i <= 4; i++) {
                randomValues[`--random-x-${i}`] = (Math.random() * 2 - 1) + '%';
                randomValues[`--random-y-${i}`] = (Math.random() * 2 - 1) + '%';
            }

            // CSS 변수 적용
            Object.entries(randomValues).forEach(([key, value]) => {
                panel.style.setProperty(key, value);
            });
        }
    };
})();
