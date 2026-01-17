// Object Filter Panel - 오브젝트 필터 및 줌 컨트롤

(function() {
    'use strict';

    let objectFilters = {};
    let objectCounts = {}; // 타입별 { total: n, remaining: n, snList: [] }

    window.ObjectFilterPanel = {
        // 비대화형 아이콘인지 확인
        isNonInteractiveIcon(imageName) {
            if (window.MapsCore && window.MapsCore.isNonInteractiveIcon) {
                return window.MapsCore.isNonInteractiveIcon(imageName);
            }
            return false;
        },

        // 개수 세지 않을 아이콘인지 확인
        isNonCountableIcon(imageName) {
            // non-interactive-icons.json에서 non_countable_icons 배열 가져오기
            if (window.nonInteractiveIconsData && window.nonInteractiveIconsData.non_countable_icons) {
                return window.nonInteractiveIconsData.non_countable_icons.includes(imageName);
            }
            return false;
        },

        // 필터 UI 업데이트
        updateFilterUI(objects) {
            const container = document.getElementById('filter-container');
            if (!container) return;

            container.innerHTML = '';

            // 타입별 오브젝트 수집 (비대화형 아이콘도 포함)
            const objectsByType = {};
            const nonInteractiveTypes = new Set(); // 비대화형 타입 추적

            objects.forEach(obj => {
                if (!obj || !obj.image) return;

                // 비대화형 아이콘 여부 확인
                const isNonInteractive = this.isNonInteractiveIcon(obj.image);
                const isNonCountable = this.isNonCountableIcon(obj.image);

                // 오브젝트 타입 추출
                let type = obj.image;
                if (type.startsWith('yishijie-icon-')) {
                    type = type.replace('yishijie-icon-', '');
                }
                if (type.startsWith('yishijie-')) {
                    type = type.replace('yishijie-', '');
                }
                if (type.endsWith('.png')) {
                    type = type.replace('.png', '');
                }

                if (type) {
                    if (!objectsByType[type]) {
                        objectsByType[type] = [];
                    }
                    // sn이 있고 개수 세지 않는 아이콘이 아닌 경우에만 저장
                    if (obj.sn && !isNonInteractive && !isNonCountable) {
                        objectsByType[type].push(obj.sn);
                    }
                    // 비대화형 타입 기록
                    if (isNonInteractive) {
                        nonInteractiveTypes.add(type);
                    }
                }
            });

            // 타입별 개수 계산
            objectFilters = {};
            objectCounts = {};

            Object.keys(objectsByType).forEach(type => {
                objectFilters[type] = true;
                const snList = objectsByType[type];
                const total = snList.length;
                const isNonInteractive = nonInteractiveTypes.has(type);

                // 개수 세지 않는 아이콘인지 확인
                let isNonCountable = false;
                // 해당 타입의 첫 번째 오브젝트 이미지로 확인
                const firstObj = objects.find(obj => {
                    if (!obj || !obj.image) return false;
                    let objType = obj.image;
                    if (objType.startsWith('yishijie-icon-')) {
                        objType = objType.replace('yishijie-icon-', '');
                    }
                    if (objType.startsWith('yishijie-')) {
                        objType = objType.replace('yishijie-', '');
                    }
                    if (objType.endsWith('.png')) {
                        objType = objType.replace('.png', '');
                    }
                    return objType === type;
                });
                
                if (firstObj) {
                    isNonCountable = this.isNonCountableIcon(firstObj.image);
                }

                // 비대화형이거나 개수 세지 않는 아이콘이 아닌 경우에만 클릭 상태 계산
                let clicked = 0;
                if (!isNonInteractive && !isNonCountable && window.ObjectClickHandler) {
                    snList.forEach(sn => {
                        if (window.ObjectClickHandler.getObjectClickedState(sn)) {
                            clicked++;
                        }
                    });
                }

                objectCounts[type] = {
                    total: total,
                    remaining: total - clicked,
                    snList: snList,
                    isNonInteractive: isNonInteractive,
                    isNonCountable: isNonCountable
                };
            });

            const ICON_PATH = window.MapsCore ? window.MapsCore.getPaths().ICON_PATH : '';

            Array.from(Object.keys(objectsByType)).sort().forEach(type => {
                const filterItem = document.createElement('div');
                filterItem.className = 'filter-item';
                filterItem.dataset.type = type;
                filterItem.dataset.checked = 'true';

                const countInfo = objectCounts[type];
                const isNonInteractive = countInfo.isNonInteractive;
                const isNonCountable = countInfo.isNonCountable;

                // 비대화형이거나 개수 세지 않는 아이콘은 padding-bottom 없이
                if (isNonInteractive || isNonCountable) {
                    filterItem.style.paddingBottom = '8px';
                }

                // 아이콘 이미지 (yishijie-icon- 또는 yishijie- 접두사 시도)
                const icon = document.createElement('img');
                icon.className = 'filter-icon';
                icon.src = `${ICON_PATH}yishijie-icon-${type}.png`;
                icon.onerror = () => {
                    // yishijie-icon- 실패 시 yishijie- 시도
                    icon.src = `${ICON_PATH}yishijie-${type}.png`;
                    icon.onerror = () => {
                        icon.style.display = 'none';
                    };
                };

                // 체크 표시 SVG (우측 상단 라벨 형식)
                const checkMark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                checkMark.setAttribute('class', 'filter-checkmark');
                checkMark.setAttribute('viewBox', '0 0 24 24');
                checkMark.setAttribute('width', '12');
                checkMark.setAttribute('height', '12');
                checkMark.style.display = 'flex';

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

                // 개수 표시 (비대화형이거나 개수 세지 않는 아이콘은 개수 표시 안 함)
                if (!isNonInteractive && !isNonCountable && countInfo.total > 0) {
                    const countDiv = document.createElement('div');
                    countDiv.className = 'filter-count';
                    countDiv.dataset.type = type;
                    if (countInfo.remaining === 0) {
                        countDiv.classList.add('all-collected');
                    }
                    countDiv.innerHTML = `<span class="remaining">${countInfo.remaining}</span>/${countInfo.total}`;
                    filterItem.appendChild(countDiv);
                }

                container.appendChild(filterItem);
            });
        },

        // 특정 타입의 개수 업데이트 (오브젝트 클릭 시 호출)
        updateTypeCount(type, sn, isClicked) {
            if (!objectCounts[type]) return;

            // remaining 업데이트
            if (isClicked) {
                objectCounts[type].remaining = Math.max(0, objectCounts[type].remaining - 1);
            } else {
                objectCounts[type].remaining = Math.min(objectCounts[type].total, objectCounts[type].remaining + 1);
            }

            // UI 업데이트
            const countDiv = document.querySelector(`.filter-count[data-type="${type}"]`);
            if (countDiv) {
                const countInfo = objectCounts[type];
                countDiv.innerHTML = `<span class="remaining">${countInfo.remaining}</span>/${countInfo.total}`;

                if (countInfo.remaining === 0) {
                    countDiv.classList.add('all-collected');
                } else {
                    countDiv.classList.remove('all-collected');
                }
            }
        },

        // SN으로 타입 찾기
        getTypeBySnFromSprites(sn) {
            if (!window.MapsCore) return null;
            const sprites = window.MapsCore.getObjectSprites();
            for (const sprite of sprites) {
                if (sprite.objectSn === sn) {
                    return sprite.objectType;
                }
            }
            return null;
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
