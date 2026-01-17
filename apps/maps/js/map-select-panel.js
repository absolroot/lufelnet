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
            const select = document.getElementById('category-select');
            if (!select || !window.MapsI18n || !window.MapsCore) return;
            
            const lang = window.MapsI18n.getCurrentLanguage();
            const mapsListData = window.MapsCore.getMapsListData();
            
            select.innerHTML = '';
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = window.MapsI18n.getText(lang, 'selectCategory');
            select.appendChild(defaultOption);
            
            if (!mapsListData || !mapsListData.maps) return;
            
            const currentMap = mapsListData.maps.find(m => m.id === currentMapId);
            if (!currentMap || !currentMap.categories) return;
            
            currentMap.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = window.MapsI18n.getMapName(category, lang);
                select.appendChild(option);
            });
        },

        // 카테고리 선택 설정
        setupCategorySelect() {
            const select = document.getElementById('category-select');
            if (!select) return;
            
            select.addEventListener('change', (e) => {
                currentCategoryId = e.target.value;
                this.updateMapList();
            });
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
                    const categorySelect = document.getElementById('category-select');
                    if (categorySelect) {
                        categorySelect.value = saved.categoryId;
                    }
                    
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
            
            const categorySelect = document.getElementById('category-select');
            if (categorySelect) {
                categorySelect.value = firstCategory.id;
            }
            
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

        // 빨간 폴리곤 레이어 제거
        hideRedPolygonLayer() {
            document.querySelectorAll('.red-polygon-layer').forEach(layer => {
                layer.remove();
            });
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
                
                const categorySelect = document.getElementById('category-select');
                if (categorySelect) {
                    categorySelect.value = firstCategory.id;
                }
                
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
            
            const categorySelect = document.getElementById('category-select');
            if (categorySelect && categorySelect.firstChild) {
                categorySelect.firstChild.textContent = window.MapsI18n.getText(lang, 'selectCategory');
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
