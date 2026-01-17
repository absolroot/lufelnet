// Map Select Panel - 맵 선택 패널 (탭, 카테고리, 맵 리스트)

(function() {
    'use strict';

    let currentMapId = 'palace';
    let currentCategoryId = '';
    let selectedMapItem = null;

    window.MapSelectPanel = {
        // 탭 설정
        setupTabs() {
            const tabs = document.querySelectorAll('.map-tab');
            if (!window.MapsI18n) return;
            
            const lang = window.MapsI18n.getCurrentLanguage();
            
            // BASE_URL 가져오기
            const BASE_URL = typeof window.BASE_URL !== 'undefined' ? window.BASE_URL : '';
            function normalizePath(base, path) {
                const cleanBase = base.replace(/\/+$/, '');
                const cleanPath = path.replace(/^\/+/, '');
                return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
            }
            
            tabs.forEach(tab => {
                const mapId = tab.dataset.mapId;
                let bgPath = '';
                
                if (mapId === 'palace') {
                    // 팰리스 탭 배경 이미지 설정
                    bgPath = normalizePath(BASE_URL, 'apps/maps/ui/zuozhanjidi-tansuo-bg02-1.png');
                } else if (mapId === 'mementoes') {
                    // 메멘토스 탭 배경 이미지 설정
                    bgPath = normalizePath(BASE_URL, 'apps/maps/ui/zuozhanjidi-tansuo-bg02-i18n.png');
                }
                
                if (bgPath) {
                    tab.style.backgroundImage = `url('${bgPath}')`;
                    // 텍스트를 span으로 감싸기
                    const text = window.MapsI18n.getText(lang, mapId === 'palace' ? 'palace' : 'mementoes');
                    tab.innerHTML = `<span>${text}</span>`;
                }
            });
            
            tabs.forEach(tab => {
                tab.addEventListener('click', async () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    const newMapId = tab.dataset.mapId;
                    
                    // 이전 맵 정보 저장 (다른 탭으로 이동하는 경우)
                    if (currentMapId && currentMapId !== newMapId && currentCategoryId) {
                        const currentMapItem = document.querySelector('.map-item.active, .map-sub-item.active');
                        if (currentMapItem && currentMapItem.dataset.file) {
                            this.saveMapState(currentMapId, currentCategoryId, currentMapItem.dataset.file);
                        }
                    }
                    
                    currentMapId = newMapId;
                    currentCategoryId = '';
                    selectedMapItem = null;
                    
                    this.updateCategoryDropdown();
                    document.getElementById('map-list').innerHTML = '';
                    
                    // 저장된 맵 복원 시도
                    const restored = await this.restoreSavedMap(currentMapId);
                    if (!restored) {
                        // 저장된 맵이 없으면 첫 번째 맵 로드
                        await this.loadFirstMap(currentMapId);
                    }
                });
            });
        },

        // 카테고리 드롭다운 업데이트
        updateCategoryDropdown() {
            const selectContainer = document.getElementById('category-select');
            const optionsContainer = document.getElementById('category-options-container');
            const selectedText = document.getElementById('selected-category-text');
            const selectedIcon = document.getElementById('selected-category-icon');
            
            if (!selectContainer || !window.MapsI18n || !window.MapsCore) return;
            
            const lang = window.MapsI18n.getCurrentLanguage();
            const mapsListData = window.MapsCore.getMapsListData();
            
            // BASE_URL 가져오기
            const BASE_URL = typeof window.BASE_URL !== 'undefined' ? window.BASE_URL : '';
            function normalizePath(base, path) {
                const cleanBase = base.replace(/\/+$/, '');
                const cleanPath = path.replace(/^\/+/, '');
                return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
            }
            const ICON_PATH = normalizePath(BASE_URL, 'apps/maps/yishijie-icon/');
            
            // 옵션 컨테이너 초기화
            if (optionsContainer) {
                optionsContainer.innerHTML = '';
            }
            
            if (!mapsListData || !mapsListData.maps) {
                // 기본 선택 텍스트 설정
                if (selectedText) {
                    selectedText.textContent = window.MapsI18n.getText(lang, 'selectCategory');
                }
                if (selectedIcon) {
                    selectedIcon.style.display = 'none';
                    selectedIcon.src = '';
                }
                return;
            }
            
            const currentMap = mapsListData.maps.find(m => m.id === currentMapId);
            if (!currentMap || !currentMap.categories) {
                // 기본 선택 텍스트 설정
                if (selectedText) {
                    selectedText.textContent = window.MapsI18n.getText(lang, 'selectCategory');
                }
                if (selectedIcon) {
                    selectedIcon.style.display = 'none';
                    selectedIcon.src = '';
                }
                return;
            }
            
            // 현재 선택된 카테고리가 있으면 표시
            if (currentCategoryId) {
                const selectedCategory = currentMap.categories.find(c => c.id === currentCategoryId);
                if (selectedCategory) {
                    const categoryName = window.MapsI18n.getMapName(selectedCategory, lang);
                    const iconPath = selectedCategory.icon ? `${ICON_PATH}${selectedCategory.icon}` : '';
                    this.updateSelectedOption(currentCategoryId, categoryName, iconPath);
                } else {
                    // 선택된 카테고리가 현재 맵에 없으면 기본 텍스트
                    if (selectedText) {
                        selectedText.textContent = window.MapsI18n.getText(lang, 'selectCategory');
                    }
                    if (selectedIcon) {
                        selectedIcon.style.display = 'none';
                        selectedIcon.src = '';
                    }
                }
            } else {
                // 기본 선택 텍스트 설정
                if (selectedText) {
                    selectedText.textContent = window.MapsI18n.getText(lang, 'selectCategory');
                }
                if (selectedIcon) {
                    selectedIcon.style.display = 'none';
                    selectedIcon.src = '';
                }
            }
            
            // 기본 옵션 추가
            const defaultOption = document.createElement('div');
            defaultOption.className = 'category-option';
            defaultOption.dataset.value = '';
            defaultOption.innerHTML = `
                <span>${window.MapsI18n.getText(lang, 'selectCategory')}</span>
            `;
            defaultOption.addEventListener('click', () => {
                currentCategoryId = '';
                this.updateSelectedOption('', window.MapsI18n.getText(lang, 'selectCategory'), '');
                this.updateMapList();
                this.closeCategoryDropdown();
            });
            if (optionsContainer) {
                optionsContainer.appendChild(defaultOption);
            }
            
            // 카테고리 옵션 추가
            currentMap.categories.forEach(category => {
                const option = document.createElement('div');
                option.className = 'category-option';
                option.dataset.value = category.id;
                
                const categoryName = window.MapsI18n.getMapName(category, lang);
                const iconPath = category.icon ? `${ICON_PATH}${category.icon}` : '';
                
                if (iconPath) {
                    option.innerHTML = `
                        <img src="${iconPath}" alt="${categoryName}" class="category-icon">
                        <span>${categoryName}</span>
                    `;
                } else {
                    option.innerHTML = `<span>${categoryName}</span>`;
                }
                
                option.addEventListener('click', () => {
                    currentCategoryId = category.id;
                    this.updateSelectedOption(category.id, categoryName, iconPath);
                    this.updateMapList();
                    this.closeCategoryDropdown();
                });
                
                if (optionsContainer) {
                    optionsContainer.appendChild(option);
                }
            });
        },
        
        // 선택된 옵션 업데이트
        updateSelectedOption(value, text, iconPath) {
            const selectedText = document.getElementById('selected-category-text');
            const selectedIcon = document.getElementById('selected-category-icon');
            
            if (selectedText) {
                selectedText.textContent = text;
            }
            
            if (selectedIcon) {
                if (iconPath) {
                    selectedIcon.src = iconPath;
                    selectedIcon.style.display = 'inline-block';
                } else {
                    selectedIcon.style.display = 'none';
                    selectedIcon.src = '';
                }
            }
        },
        
        // 드롭다운 열기/닫기
        toggleCategoryDropdown() {
            const optionsContainer = document.getElementById('category-options-container');
            if (!optionsContainer) {
                console.warn('category-options-container를 찾을 수 없습니다.');
                return;
            }
            
            // 현재 상태 확인
            const currentDisplay = optionsContainer.style.display;
            const isOpen = currentDisplay === 'block';
            
            console.log('드롭다운 토글:', { currentDisplay, isOpen });
            
            if (isOpen) {
                this.closeCategoryDropdown();
            } else {
                this.openCategoryDropdown();
            }
        },
        
        openCategoryDropdown() {
            const optionsContainer = document.getElementById('category-options-container');
            if (optionsContainer) {
                // console.log('드롭다운 열기');
                optionsContainer.style.display = 'block';
            } else {
                console.warn('optionsContainer를 찾을 수 없습니다.');
            }
        },
        
        closeCategoryDropdown() {
            const optionsContainer = document.getElementById('category-options-container');
            if (optionsContainer) {
                // console.log('드롭다운 닫기');
                optionsContainer.style.display = 'none';
            }
        },

        // 카테고리 선택 설정
        setupCategorySelect() {
            const selectContainer = document.getElementById('category-select');
            const selectedOption = document.querySelector('.selected-category-option');
            if (!selectContainer || !selectedOption) {
                console.warn('카테고리 드롭다운 요소를 찾을 수 없습니다.', { selectContainer, selectedOption });
                return;
            }
            
            // 이미 설정되었는지 확인 (중복 방지)
            if (selectedOption.dataset.setup === 'true') {
                console.log('카테고리 드롭다운은 이미 설정되었습니다.');
                return;
            }
            selectedOption.dataset.setup = 'true';
            
            // 클릭 이벤트
            selectedOption.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('카테고리 드롭다운 클릭됨');
                this.toggleCategoryDropdown();
            });
            
            // 외부 클릭 시 닫기 (한 번만 등록)
            if (!this._categoryDropdownClickHandler) {
                this._categoryDropdownClickHandler = (e) => {
                    const container = document.getElementById('category-select');
                    if (container && !container.contains(e.target)) {
                        this.closeCategoryDropdown();
                    }
                };
                document.addEventListener('click', this._categoryDropdownClickHandler);
            }
        },

        // 맵 리스트 업데이트
        updateMapList() {
            const container = document.getElementById('map-list');
            if (!container || !window.MapsCore || !window.MapsI18n) return;
            
            // 빨간 폴리곤 레이어 제거
            document.querySelectorAll('.red-polygon-layer').forEach(layer => {
                layer.remove();
            });
            
            // 모든 active 클래스 제거
            document.querySelectorAll('.map-item.active, .map-sub-item.active').forEach(activeItem => {
                activeItem.classList.remove('active');
            });
            
            selectedMapItem = null;
            
            container.innerHTML = '';
            
            if (!currentCategoryId) return;
            
            const mapsListData = window.MapsCore.getMapsListData();
            if (!mapsListData || !mapsListData.maps) return;
            
            const currentMap = mapsListData.maps.find(m => m.id === currentMapId);
            if (!currentMap || !currentMap.categories) return;
            
            const category = currentMap.categories.find(c => c.id === currentCategoryId);
            if (!category || !category.submaps) return;
            
            const lang = window.MapsI18n.getCurrentLanguage();
            
            category.submaps.forEach(submap => {
                this.renderMapItem(container, submap, lang);
            });
        },

        // 맵 아이템 렌더링 (재귀)
        renderMapItem(container, submap, lang) {
            const hasSubmaps = submap.submaps && submap.submaps.length > 0;
            // file이 배열인 경우도 hasFile로 처리
            const hasFile = !!(submap.file && (Array.isArray(submap.file) ? submap.file.length > 0 : submap.file.trim() !== ''));
            
            if (!hasSubmaps && !hasFile) return;
            
            const item = document.createElement('div');
            item.className = hasSubmaps ? 'map-item has-submaps' : 'map-item';
            item.dataset.submapId = submap.id;
            if (hasFile) {
                // file이 배열인 경우 첫 번째 파일을 dataset.file에 저장하고, 전체 배열을 dataset.files에 JSON으로 저장
                if (Array.isArray(submap.file)) {
                    const firstFile = submap.file[0] || '';
                    item.dataset.file = firstFile;
                    item.dataset.files = JSON.stringify(submap.file);
                } else {
                    item.dataset.file = submap.file;
                }
            }
            
            // 배경 폴리곤 분리
            const bg = document.createElement('div');
            bg.className = 'map-item-bg';
            item.appendChild(bg);
            
            // 텍스트
            const span = document.createElement('span');
            span.textContent = window.MapsI18n.getMapName(submap, lang);
            item.appendChild(span);
            
            if (hasSubmaps) {
                const toggle = document.createElement('div');
                toggle.className = 'map-item-toggle';
                toggle.textContent = '▶';
                item.appendChild(toggle);
                
                // 서브메뉴는 item 밖에 생성
                const subList = document.createElement('div');
                subList.className = 'map-sub-list';
                subList.dataset.parentId = submap.id;
                
                submap.submaps.forEach(nestedSubmap => {
                    this.renderSubMapItem(subList, nestedSubmap, lang);
                });
                
                // 하위 맵이 있으면 클릭 시 무조건 토글만
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const wasExpanded = item.classList.contains('expanded');
                    item.classList.toggle('expanded');
                    const isExpanded = item.classList.contains('expanded');
                    
                    // 서브메뉴가 닫히면 빨간 폴리곤 숨김
                    if (!isExpanded) {
                        // 서브메뉴 내부에 활성화된 항목이 있는지 확인
                        const subList = item.nextElementSibling;
                        if (subList && subList.classList.contains('map-sub-list')) {
                            const activeInSub = subList.querySelector('.map-sub-item.active');
                            if (activeInSub) {
                                this.hideRedPolygonLayer();
                            }
                        }
                    } else {
                        // 서브메뉴가 열리면 활성화된 항목이 있으면 빨간 폴리곤 표시
                        setTimeout(() => {
                            const subList = item.nextElementSibling;
                            if (subList && subList.classList.contains('map-sub-list')) {
                                const activeInSub = subList.querySelector('.map-sub-item.active');
                                if (activeInSub) {
                                    this.showRedPolygonLayer(activeInSub);
                                }
                            }
                        }, 50); // 애니메이션 시작 후 약간의 지연
                    }
                    
                    // 서브메뉴 토글 시 빨간 폴리곤 위치 업데이트
                    this.updateRedPolygonPosition();
                });
                
                container.appendChild(item);
                container.appendChild(subList);
            } else if (hasFile) {
                item.addEventListener('click', () => {
                    this.selectMapItem(item, submap.file);
                });
                container.appendChild(item);
            }
        },

        // 서브 맵 아이템 렌더링
        renderSubMapItem(container, submap, lang) {
            const hasSubmaps = submap.submaps && submap.submaps.length > 0;
            // file이 배열인 경우도 hasFile로 처리
            const hasFile = !!(submap.file && (Array.isArray(submap.file) ? submap.file.length > 0 : submap.file.trim() !== ''));
            
            if (!hasSubmaps && !hasFile) return;
            
            const item = document.createElement('div');
            item.className = hasSubmaps ? 'map-sub-item has-submaps' : 'map-sub-item';
            item.dataset.submapId = submap.id;
            if (hasFile) {
                // file이 배열인 경우 첫 번째 파일을 dataset.file에 저장하고, 전체 배열을 dataset.files에 JSON으로 저장
                if (Array.isArray(submap.file)) {
                    const firstFile = submap.file[0] || '';
                    item.dataset.file = firstFile;
                    item.dataset.files = JSON.stringify(submap.file);
                } else {
                    item.dataset.file = submap.file;
                }
            }
            
            // 텍스트
            const span = document.createElement('span');
            span.textContent = window.MapsI18n.getMapName(submap, lang);
            item.appendChild(span);
            
            if (hasSubmaps) {
                const toggle = document.createElement('div');
                toggle.className = 'map-item-toggle';
                toggle.textContent = '▶';
                item.appendChild(toggle);
                
                // 서브메뉴는 item 밖에 생성
                const subList = document.createElement('div');
                subList.className = 'map-sub-list';
                subList.dataset.parentId = submap.id;
                
                submap.submaps.forEach(nestedSubmap => {
                    this.renderSubMapItem(subList, nestedSubmap, lang);
                });
                
                // 하위 맵이 있으면 클릭 시 무조건 토글만
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const wasExpanded = item.classList.contains('expanded');
                    item.classList.toggle('expanded');
                    const isExpanded = item.classList.contains('expanded');
                    
                    // 서브메뉴가 닫히면 빨간 폴리곤 숨김
                    if (!isExpanded) {
                        // 서브메뉴 내부에 활성화된 항목이 있는지 확인
                        const subList = item.nextElementSibling;
                        if (subList && subList.classList.contains('map-sub-list')) {
                            const activeInSub = subList.querySelector('.map-sub-item.active');
                            if (activeInSub) {
                                this.hideRedPolygonLayer();
                            }
                        }
                    } else {
                        // 서브메뉴가 열리면 활성화된 항목이 있으면 빨간 폴리곤 표시
                        setTimeout(() => {
                            const subList = item.nextElementSibling;
                            if (subList && subList.classList.contains('map-sub-list')) {
                                const activeInSub = subList.querySelector('.map-sub-item.active');
                                if (activeInSub) {
                                    this.showRedPolygonLayer(activeInSub);
                                }
                            }
                        }, 50); // 애니메이션 시작 후 약간의 지연
                    }
                    
                    // 서브메뉴 토글 시 빨간 폴리곤 위치 업데이트
                    this.updateRedPolygonPosition();
                });
                
                container.appendChild(item);
                container.appendChild(subList);
            } else if (hasFile) {
                item.addEventListener('click', () => {
                    this.selectMapItem(item, submap.file);
                });
                container.appendChild(item);
            }
        },

        // 맵 정보 저장 (localStorage)
        saveMapState(mapId, categoryId, mapFile) {
            try {
                const state = {
                    mapId: mapId,
                    categoryId: categoryId,
                    mapFile: mapFile
                };
                localStorage.setItem('lastMapState', JSON.stringify(state));
            } catch (e) {
                console.warn('맵 상태 저장 실패:', e);
            }
        },

        // 저장된 맵 정보 불러오기
        getSavedMapState() {
            try {
                const saved = localStorage.getItem('lastMapState');
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch (e) {
                console.warn('맵 상태 불러오기 실패:', e);
            }
            return null;
        },

        // 저장된 맵 복원
        async restoreSavedMap(mapId) {
            const saved = this.getSavedMapState();
            if (saved && saved.mapId === mapId && saved.mapFile) {
                // 저장된 카테고리와 맵 파일 확인
                const mapsListData = window.MapsCore.getMapsListData();
                if (!mapsListData || !mapsListData.maps) return false;
                
                const currentMap = mapsListData.maps.find(m => m.id === mapId);
                if (!currentMap || !currentMap.categories) return false;
                
                // 저장된 카테고리 찾기
                const savedCategory = currentMap.categories.find(c => c.id === saved.categoryId);
                if (savedCategory) {
                    // 카테고리 선택
                    currentCategoryId = saved.categoryId;
                    const lang = window.MapsI18n.getCurrentLanguage();
                    const categoryName = window.MapsI18n.getMapName(savedCategory, lang);
                    const BASE_URL = typeof window.BASE_URL !== 'undefined' ? window.BASE_URL : '';
                    function normalizePath(base, path) {
                        const cleanBase = base.replace(/\/+$/, '');
                        const cleanPath = path.replace(/^\/+/, '');
                        return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
                    }
                    const ICON_PATH = normalizePath(BASE_URL, 'apps/maps/yishijie-icon/');
                    const iconPath = savedCategory.icon ? `${ICON_PATH}${savedCategory.icon}` : '';
                    this.updateSelectedOption(savedCategory.id, categoryName, iconPath);
                    
                    // 맵 리스트 업데이트
                    this.updateMapList();
                    
                    // 저장된 맵 파일이 존재하는지 확인
                    const fileExists = await window.MapsCore.checkFileExists(
                        `${window.MapsCore.getPaths().MAP_DATA_PATH}${saved.mapFile}`
                    );
                    
                    if (fileExists) {
                        // 저장된 맵 로드
                        setTimeout(() => {
                            const mapItem = document.querySelector(`[data-file="${saved.mapFile}"]`);
                            if (mapItem) {
                                this.selectMapItem(mapItem, saved.mapFile);
                            } else {
                                window.MapsCore.loadMap(saved.mapFile);
                            }
                        }, 100);
                        return true;
                    }
                }
            }
            return false;
        },

        // 첫 번째 맵 로드 (저장된 맵이 없을 때)
        async loadFirstMap(mapId) {
            if (!window.MapsCore) return;
            
            const mapsListData = window.MapsCore.getMapsListData();
            if (!mapsListData || !mapsListData.maps) return;
            
            const currentMap = mapsListData.maps.find(m => m.id === mapId);
            if (!currentMap || !currentMap.categories || currentMap.categories.length === 0) return;
            
            const firstCategory = currentMap.categories[0];
            currentCategoryId = firstCategory.id;
            
            const lang = window.MapsI18n.getCurrentLanguage();
            const categoryName = window.MapsI18n.getMapName(firstCategory, lang);
            const BASE_URL = typeof window.BASE_URL !== 'undefined' ? window.BASE_URL : '';
            function normalizePath(base, path) {
                const cleanBase = base.replace(/\/+$/, '');
                const cleanPath = path.replace(/^\/+/, '');
                return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
            }
            const ICON_PATH = normalizePath(BASE_URL, 'apps/maps/yishijie-icon/');
            const iconPath = firstCategory.icon ? `${ICON_PATH}${firstCategory.icon}` : '';
            this.updateSelectedOption(firstCategory.id, categoryName, iconPath);
            
            this.updateMapList();
            
            const firstMap = await window.MapsCore.findFirstAvailableSubmap(firstCategory.submaps || []);
            if (firstMap && firstMap.file) {
                setTimeout(() => {
                    // file이 배열인 경우 첫 번째 파일로 검색
                    const searchFile = Array.isArray(firstMap.file) ? firstMap.file[0] : firstMap.file;
                    const mapItem = document.querySelector(`[data-file="${searchFile}"]`);
                    if (mapItem) {
                        this.selectMapItem(mapItem, firstMap.file);
                    } else {
                        window.MapsCore.loadMap(firstMap.file);
                    }
                }, 100);
            }
        },

        // 빨간 폴리곤 레이어 표시
        showRedPolygonLayer(item) {
            // 기존 빨간 폴리곤 레이어 모두 제거
            document.querySelectorAll('.red-polygon-layer').forEach(layer => {
                layer.remove();
            });
            
            if (!item) return;
            
            const rect = item.getBoundingClientRect();
            const mapSelectPanel = document.getElementById('map-select-panel');
            if (!mapSelectPanel) return;
            
            const panelRect = mapSelectPanel.getBoundingClientRect();
            const redLayer = document.createElement('div');
            redLayer.className = 'red-polygon-layer';
            redLayer.style.width = `${rect.width + 8}px`;
            redLayer.style.height = `${rect.height + 8}px`;
            redLayer.style.top = `${rect.top - panelRect.top - 4}px`;
            redLayer.style.left = `${rect.left - panelRect.left - 4}px`;
            redLayer.dataset.itemId = item.dataset.submapId || item.dataset.file || 'unknown';
            redLayer.dataset.targetItemId = item.dataset.submapId || item.dataset.file || 'unknown';
            mapSelectPanel.appendChild(redLayer);
            
            // 아이템 위치 변경 시 레이어 위치 업데이트
            const updateLayerPosition = () => {
                if (!item.parentElement) {
                    // 아이템이 DOM에서 제거되었으면 레이어도 제거
                    redLayer.remove();
                    return;
                }
                const newRect = item.getBoundingClientRect();
                const newPanelRect = mapSelectPanel.getBoundingClientRect();
                redLayer.style.top = `${newRect.top - newPanelRect.top - 4}px`;
                redLayer.style.left = `${newRect.left - newPanelRect.left - 4}px`;
                redLayer.style.width = `${newRect.width + 8}px`;
            };
            
            // 전역으로 업데이트 함수 저장 (서브메뉴 토글 시 호출용)
            this._updateRedPolygonPosition = updateLayerPosition;
            this._redPolygonItem = item;
            
            // 스크롤 및 리사이즈 시 위치 업데이트
            const scrollHandler = () => updateLayerPosition();
            window.addEventListener('scroll', scrollHandler, true);
            window.addEventListener('resize', updateLayerPosition);
            
            // 레이어 제거 시 이벤트 리스너도 제거
            const originalRemove = redLayer.remove;
            redLayer.remove = function() {
                window.removeEventListener('scroll', scrollHandler, true);
                window.removeEventListener('resize', updateLayerPosition);
                originalRemove.call(this);
            };
        },
        
        // 빨간 폴리곤 위치 업데이트 (서브메뉴 토글 시 호출)
        updateRedPolygonPosition() {
            if (this._updateRedPolygonPosition && this._redPolygonItem) {
                // 애니메이션 완료 후 위치 업데이트
                setTimeout(() => {
                    if (this._updateRedPolygonPosition) {
                        this._updateRedPolygonPosition();
                    }
                }, 300); // transition 시간과 맞춤 (0.3s)
            }
        },

        // 빨간 폴리곤 레이어 제거
        hideRedPolygonLayer() {
            document.querySelectorAll('.red-polygon-layer').forEach(layer => {
                layer.remove();
            });
            // 업데이트 함수 초기화
            this._updateRedPolygonPosition = null;
            this._redPolygonItem = null;
        },

        // 맵 아이템 선택
        selectMapItem(item, file) {
            // 모든 active 클래스 제거
            document.querySelectorAll('.map-item.active, .map-sub-item.active').forEach(activeItem => {
                activeItem.classList.remove('active');
            });
            
            item.classList.add('active');
            selectedMapItem = item;
            
            // 빨간 폴리곤 레이어 표시
            this.showRedPolygonLayer(item);
            
            // 맵 상태 저장 (배열인 경우 첫 번째 파일 저장)
            const fileToSave = Array.isArray(file) ? file[0] : file;
            this.saveMapState(currentMapId, currentCategoryId, fileToSave);
            
            if (window.MapsCore) {
                // file이 배열이면 배열 전체를 전달, 아니면 단일 파일명 전달
                window.MapsCore.loadMap(file);
            }
        },

        // 맵 UI 구축
        buildMapUI() {
            this.setupTabs();
            this.setupCategorySelect();
            this.updateCategoryDropdown();
            this.updateMapList();
        },

        // 첫 번째 맵 자동 선택
        async autoSelectFirstMap() {
            if (!window.MapsCore) return;
            
            const mapsListData = window.MapsCore.getMapsListData();
            if (!mapsListData || !mapsListData.maps) {
                const loadingEl = document.getElementById('loading');
                if (loadingEl) loadingEl.style.display = 'none';
                return;
            }
            
            const palaceMap = mapsListData.maps.find(m => m.id === 'palace');
            if (palaceMap && palaceMap.categories && palaceMap.categories.length > 0) {
                const firstCategory = palaceMap.categories[0];
                currentCategoryId = firstCategory.id;
                
                const lang = window.MapsI18n.getCurrentLanguage();
                const categoryName = window.MapsI18n.getMapName(firstCategory, lang);
                const BASE_URL = typeof window.BASE_URL !== 'undefined' ? window.BASE_URL : '';
                function normalizePath(base, path) {
                    const cleanBase = base.replace(/\/+$/, '');
                    const cleanPath = path.replace(/^\/+/, '');
                    return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
                }
                const ICON_PATH = normalizePath(BASE_URL, 'apps/maps/yishijie-icon/');
                const iconPath = firstCategory.icon ? `${ICON_PATH}${firstCategory.icon}` : '';
                this.updateSelectedOption(firstCategory.id, categoryName, iconPath);
                
                this.updateMapList();
                
                const firstMap = await window.MapsCore.findFirstAvailableSubmap(firstCategory.submaps || []);
                if (firstMap && firstMap.file) {
                    setTimeout(() => {
                        // file이 배열인 경우 첫 번째 파일로 검색
                        const searchFile = Array.isArray(firstMap.file) ? firstMap.file[0] : firstMap.file;
                        const mapItem = document.querySelector(`[data-file="${searchFile}"]`);
                        if (mapItem) {
                            this.selectMapItem(mapItem, firstMap.file);
                        } else {
                            window.MapsCore.loadMap(firstMap.file);
                        }
                    }, 100);
                } else {
                    const loadingEl = document.getElementById('loading');
                    if (loadingEl) loadingEl.style.display = 'none';
                }
            } else {
                const loadingEl = document.getElementById('loading');
                if (loadingEl) loadingEl.style.display = 'none';
            }
        },

        // UI 번역
        translateUI() {
            if (!window.MapsI18n) return;
            const lang = window.MapsI18n.getCurrentLanguage();
            
            // 선택된 카테고리가 없으면 기본 텍스트만 업데이트
            if (!currentCategoryId) {
                const selectedText = document.getElementById('selected-category-text');
                if (selectedText) {
                    selectedText.textContent = window.MapsI18n.getText(lang, 'selectCategory');
                }
            } else {
                // 선택된 카테고리가 있으면 드롭다운 다시 업데이트
                this.updateCategoryDropdown();
            }
            
            const tabs = document.querySelectorAll('.map-tab');
            tabs.forEach(tab => {
                const mapId = tab.dataset.mapId;
                if (mapId === 'palace') {
                    tab.textContent = window.MapsI18n.getText(lang, 'palace');
                } else if (mapId === 'mementoes') {
                    tab.textContent = window.MapsI18n.getText(lang, 'mementoes');
                }
            });
        },

        // 초기화
        init() {
            this.setupTabs();
            this.setupCategorySelect();
            this.translateUI();
        }
    };
})();
