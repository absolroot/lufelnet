// Map Select Panel - 맵 선택 패널 (탭, 카테고리, 맵 리스트)

(function() {
    'use strict';

    let currentMapId = 'palace';
    let currentCategoryId = '';
    let selectedMapItem = null;

    window.MapSelectPanel = {
        // 언어에 따른 파일 배열 선택 (file_en, file_jp, 폴백은 file)
        getFileForLang(submap, lang) {
            if (lang === 'en' && submap.file_en && submap.file_en.length > 0) {
                return submap.file_en;
            } else if (lang === 'jp' && submap.file_jp && submap.file_jp.length > 0) {
                return submap.file_jp;
            }
            return submap.file;
        },

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
                // 빈 텍스트
                if (selectedText) {
                    selectedText.textContent = '';
                }
                if (selectedIcon) {
                    selectedIcon.style.display = 'none';
                    selectedIcon.src = '';
                }
                return;
            }
            
            const currentMap = mapsListData.maps.find(m => m.id === currentMapId);
            if (!currentMap || !currentMap.categories) {
                // 빈 텍스트
                if (selectedText) {
                    selectedText.textContent = '';
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
                    // 선택된 카테고리가 현재 맵에 없으면 첫 번째 카테고리 자동 선택
                    if (currentMap.categories && currentMap.categories.length > 0) {
                        const firstCategory = currentMap.categories[0];
                        currentCategoryId = firstCategory.id;
                        const categoryName = window.MapsI18n.getMapName(firstCategory, lang);
                        const iconPath = firstCategory.icon ? `${ICON_PATH}${firstCategory.icon}` : '';
                        this.updateSelectedOption(currentCategoryId, categoryName, iconPath);
                    } else {
                        // 빈 텍스트
                        if (selectedText) {
                            selectedText.textContent = '';
                        }
                        if (selectedIcon) {
                            selectedIcon.style.display = 'none';
                            selectedIcon.src = '';
                        }
                    }
                }
            } else {
                // 카테고리가 선택되지 않았으면 첫 번째 카테고리 자동 선택
                if (currentMap.categories && currentMap.categories.length > 0) {
                    const firstCategory = currentMap.categories[0];
                    currentCategoryId = firstCategory.id;
                    const categoryName = window.MapsI18n.getMapName(firstCategory, lang);
                    const iconPath = firstCategory.icon ? `${ICON_PATH}${firstCategory.icon}` : '';
                    this.updateSelectedOption(currentCategoryId, categoryName, iconPath);
                } else {
                    // 카테고리가 없으면 빈 텍스트
                    if (selectedText) {
                        selectedText.textContent = '';
                    }
                    if (selectedIcon) {
                        selectedIcon.style.display = 'none';
                        selectedIcon.src = '';
                    }
                }
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
                // console.log('카테고리 드롭다운은 이미 설정되었습니다.');
                return;
            }
            selectedOption.dataset.setup = 'true';
            
            // 클릭 이벤트
            selectedOption.addEventListener('click', (e) => {
                e.stopPropagation();
                // console.log('카테고리 드롭다운 클릭됨');
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

            // 빨간 폴리곤 제거
            this.hideRedPolygonLayer();

            // 모든 active 클래스 제거
            document.querySelectorAll('.map-item.active, .map-sub-item.active').forEach(activeItem => {
                activeItem.classList.remove('active');
            });

            selectedMapItem = null;

            // 브레드크럼 업데이트 (맵 선택 전이므로 맵/서브맵은 "-"로 표시)
            this.updateBreadcrumb();

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
            // 언어에 맞는 파일 배열 선택
            const fileForLang = this.getFileForLang(submap, lang);
            const hasFile = !!(fileForLang && (Array.isArray(fileForLang) ? fileForLang.length > 0 : fileForLang.trim() !== ''));

            if (!hasSubmaps && !hasFile) return;

            const item = document.createElement('div');
            item.className = hasSubmaps ? 'map-item has-submaps' : 'map-item';
            item.dataset.submapId = submap.id;
            if (hasFile) {
                // file이 배열인 경우 첫 번째 파일을 dataset.file에 저장하고, 전체 배열을 dataset.files에 JSON으로 저장
                if (Array.isArray(fileForLang)) {
                    const firstFile = fileForLang[0] || '';
                    item.dataset.file = firstFile;
                    item.dataset.files = JSON.stringify(fileForLang);
                } else {
                    item.dataset.file = fileForLang;
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
                // CSS ::before로 삼각형 표시 (이모지 대신)
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
                    item.classList.toggle('expanded');
                    const isExpanded = item.classList.contains('expanded');

                    // 서브메뉴 토글 시 활성화된 항목의 빨간 폴리곤 처리
                    const subList = item.nextElementSibling;
                    if (subList && subList.classList.contains('map-sub-list')) {
                        const activeInSub = subList.querySelector('.map-sub-item.active');
                        if (activeInSub) {
                            if (!isExpanded) {
                                // 서브메뉴가 닫히면 빨간 폴리곤 숨김
                                this.hideRedPolygonLayer();
                            } else {
                                // 서브메뉴가 열리면 빨간 폴리곤 다시 표시
                                this.showRedPolygonLayer(activeInSub);
                            }
                        } else {
                            // 서브메뉴 외부에 활성화된 아이템이 있으면 위치 업데이트
                            this.updateRedPolygonPosition();
                        }
                    } else {
                        // 서브메뉴 토글로 다른 아이템 위치가 변경될 수 있음
                        this.updateRedPolygonPosition();
                    }
                });

                container.appendChild(item);
                container.appendChild(subList);
            } else if (hasFile) {
                item.addEventListener('click', () => {
                    this.selectMapItem(item, fileForLang, submap.file);
                });
                container.appendChild(item);
            }
        },

        // 서브 맵 아이템 렌더링
        renderSubMapItem(container, submap, lang) {
            const hasSubmaps = submap.submaps && submap.submaps.length > 0;
            // 언어에 맞는 파일 배열 선택
            const fileForLang = this.getFileForLang(submap, lang);
            const hasFile = !!(fileForLang && (Array.isArray(fileForLang) ? fileForLang.length > 0 : fileForLang.trim() !== ''));

            if (!hasSubmaps && !hasFile) return;

            const item = document.createElement('div');
            item.className = hasSubmaps ? 'map-sub-item has-submaps' : 'map-sub-item';
            item.dataset.submapId = submap.id;
            if (hasFile) {
                // file이 배열인 경우 첫 번째 파일을 dataset.file에 저장하고, 전체 배열을 dataset.files에 JSON으로 저장
                if (Array.isArray(fileForLang)) {
                    const firstFile = fileForLang[0] || '';
                    item.dataset.file = firstFile;
                    item.dataset.files = JSON.stringify(fileForLang);
                } else {
                    item.dataset.file = fileForLang;
                }
            }
            
            // 텍스트
            const span = document.createElement('span');
            span.textContent = window.MapsI18n.getMapName(submap, lang);
            item.appendChild(span);
            
            if (hasSubmaps) {
                const toggle = document.createElement('div');
                toggle.className = 'map-item-toggle';
                // CSS ::before로 삼각형 표시 (이모지 대신)
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
                    item.classList.toggle('expanded');
                    const isExpanded = item.classList.contains('expanded');

                    // 서브메뉴 토글 시 활성화된 항목의 빨간 폴리곤 처리
                    const subList = item.nextElementSibling;
                    if (subList && subList.classList.contains('map-sub-list')) {
                        const activeInSub = subList.querySelector('.map-sub-item.active');
                        if (activeInSub) {
                            if (!isExpanded) {
                                // 서브메뉴가 닫히면 빨간 폴리곤 숨김
                                this.hideRedPolygonLayer();
                            } else {
                                // 서브메뉴가 열리면 빨간 폴리곤 다시 표시
                                this.showRedPolygonLayer(activeInSub);
                            }
                        } else {
                            // 서브메뉴 외부에 활성화된 아이템이 있으면 위치 업데이트
                            this.updateRedPolygonPosition();
                        }
                    } else {
                        // 서브메뉴 토글로 다른 아이템 위치가 변경될 수 있음
                        this.updateRedPolygonPosition();
                    }
                });

                container.appendChild(item);
                container.appendChild(subList);
            } else if (hasFile) {
                item.addEventListener('click', () => {
                    this.selectMapItem(item, fileForLang, submap.file);
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

        // 빨간 폴리곤 레이어 표시 - 패널에 추가하고 위치 실시간 추적
        showRedPolygonLayer(item) {
            // 기존 빨간 폴리곤 레이어 모두 제거
            this.hideRedPolygonLayer();

            if (!item) return;

            const mapSelectPanel = document.getElementById('map-select-panel');
            if (!mapSelectPanel) return;

            // 패널에 빨간 폴리곤 추가
            const redLayer = document.createElement('div');
            redLayer.className = 'red-polygon-layer';
            // 서브아이템이면 더 진한 색상 클래스 추가
            if (item.classList.contains('map-sub-item')) {
                redLayer.classList.add('red-polygon-layer--sub');
            }
            mapSelectPanel.appendChild(redLayer);

            // 위치 업데이트 함수
            const updatePosition = () => {
                if (!item.parentElement || !redLayer.parentElement) {
                    this.stopPositionTracking();
                    return;
                }
                const rect = item.getBoundingClientRect();
                const panelRect = mapSelectPanel.getBoundingClientRect();
                redLayer.style.width = `${rect.width + 8}px`;
                redLayer.style.height = `${rect.height + 8}px`;
                redLayer.style.top = `${rect.top - panelRect.top - 4}px`;
                redLayer.style.left = `${rect.left - panelRect.left - 4}px`;
            };

            // 즉시 위치 설정
            updatePosition();

            // 상태 저장
            this._redPolygonItem = item;
            this._redPolygonLayer = redLayer;
            this._updatePositionFn = updatePosition;

            // 스크롤/리사이즈 이벤트
            this._scrollHandler = () => updatePosition();
            window.addEventListener('scroll', this._scrollHandler, true);
            window.addEventListener('resize', this._scrollHandler);

            // 서브메뉴 토글 애니메이션 중 실시간 추적 시작
            this.startPositionTracking();
        },

        // RAF로 위치 실시간 추적 시작
        startPositionTracking() {
            if (this._trackingRAF) return;

            const track = () => {
                if (this._updatePositionFn) {
                    this._updatePositionFn();
                }
                this._trackingRAF = requestAnimationFrame(track);
            };
            this._trackingRAF = requestAnimationFrame(track);

            // 0.5초 후 추적 중지 (애니메이션 완료)
            clearTimeout(this._trackingTimeout);
            this._trackingTimeout = setTimeout(() => {
                this.stopPositionTracking();
            }, 500);
        },

        // 위치 추적 중지
        stopPositionTracking() {
            if (this._trackingRAF) {
                cancelAnimationFrame(this._trackingRAF);
                this._trackingRAF = null;
            }
        },

        // 빨간 폴리곤 위치 업데이트 (서브메뉴 토글 시 호출)
        updateRedPolygonPosition() {
            if (this._updatePositionFn) {
                this._updatePositionFn();
                // 애니메이션 중 실시간 추적
                this.startPositionTracking();
            }
        },

        // 빨간 폴리곤 레이어 제거
        hideRedPolygonLayer() {
            this.stopPositionTracking();
            clearTimeout(this._trackingTimeout);

            if (this._scrollHandler) {
                window.removeEventListener('scroll', this._scrollHandler, true);
                window.removeEventListener('resize', this._scrollHandler);
                this._scrollHandler = null;
            }

            document.querySelectorAll('.red-polygon-layer').forEach(layer => {
                layer.remove();
            });

            this._redPolygonItem = null;
            this._redPolygonLayer = null;
            this._updatePositionFn = null;
        },

        // 맵 아이템 선택
        // fallbackFile: kr 파일 배열 (폴백용, 옵션)
        selectMapItem(item, file, fallbackFile = null) {
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

            // 브레드크럼 업데이트
            this.updateBreadcrumb();

            // SEO: URL 및 메타 태그 업데이트
            const mapId = item.dataset.submapId;
            if (window.MapsSEO && mapId) {
                window.MapsSEO.onMapSelected(mapId, currentCategoryId);
            }

            if (window.MapsCore) {
                // 맵 ID 설정 (위치 저장/복원용)
                if (mapId) {
                    window.MapsCore.setCurrentMapId(mapId);
                }
                // file이 배열이면 배열 전체를 전달, 아니면 단일 파일명 전달
                // fallbackFile: 폴백용 kr 파일 배열
                window.MapsCore.loadMap(file, fallbackFile);
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

        // 모바일 감지
        isMobile() {
            return window.innerWidth <= 1200;
        },

        // 모바일 바텀시트 초기화
        initMobileBottomsheet() {
            const panel = document.getElementById('map-select-panel');
            const mapBtn = document.getElementById('mobile-map-btn');
            const overlay = document.getElementById('mobile-overlay');

            if (!panel || !mapBtn) return;

            // 바텀시트 헤더 추가 (한 번만)
            if (!panel.querySelector('.bottomsheet-header')) {
                const header = document.createElement('div');
                header.className = 'bottomsheet-header';
                header.innerHTML = `
                    <div class="bottomsheet-handle"></div>
                    <div class="bottomsheet-title" id="map-panel-title">맵 선택</div>
                `;

                const closeBtn = document.createElement('button');
                closeBtn.className = 'bottomsheet-close';
                closeBtn.innerHTML = '&times;';
                closeBtn.addEventListener('click', () => this.closeMobilePanel());

                panel.insertBefore(header, panel.firstChild);
                panel.appendChild(closeBtn);
            }

            // 모바일 여부에 따라 클래스 토글 (뷰포트 크기만으로 판단)
            const isMobileWidth = window.innerWidth <= 1200;
            if (isMobileWidth) {
                panel.classList.add('mobile-bottomsheet');
            } else {
                panel.classList.remove('mobile-bottomsheet', 'open');
            }

            // 맵 버튼 클릭 이벤트
            if (!mapBtn.dataset.eventBound) {
                mapBtn.addEventListener('click', () => {
                    this.toggleMobilePanel();
                });
                mapBtn.dataset.eventBound = 'true';
            }

            // 오버레이 클릭 시 닫기
            if (overlay && !overlay.dataset.eventBound) {
                overlay.addEventListener('click', () => {
                    this.closeMobilePanel();
                    if (window.ObjectFilterPanel) {
                        window.ObjectFilterPanel.closeMobilePanel();
                    }
                });
                overlay.dataset.eventBound = 'true';
            }

            // 리사이즈 이벤트 (뷰포트 크기만 체크)
            if (!this._resizeHandler) {
                this._resizeHandler = () => {
                    const panel = document.getElementById('map-select-panel');
                    if (!panel) return;

                    const isMobileWidth = window.innerWidth <= 1200;
                    if (isMobileWidth) {
                        panel.classList.add('mobile-bottomsheet');
                    } else {
                        panel.classList.remove('mobile-bottomsheet', 'open');
                        const overlay = document.getElementById('mobile-overlay');
                        if (overlay) overlay.classList.remove('active');
                        const mapBtn = document.getElementById('mobile-map-btn');
                        if (mapBtn) mapBtn.classList.remove('active');
                    }
                };
                window.addEventListener('resize', this._resizeHandler);
            }
        },

        // 모바일 패널 토글
        toggleMobilePanel() {
            const panel = document.getElementById('map-select-panel');
            const mapBtn = document.getElementById('mobile-map-btn');
            const overlay = document.getElementById('mobile-overlay');

            if (!panel) return;

            const isOpen = panel.classList.contains('open');

            if (isOpen) {
                this.closeMobilePanel();
            } else {
                // 다른 패널 닫기
                if (window.ObjectFilterPanel) {
                    window.ObjectFilterPanel.closeMobilePanel();
                }

                panel.classList.add('open');
                if (mapBtn) mapBtn.classList.add('active');
                if (overlay) overlay.classList.add('active');
            }
        },

        // 모바일 패널 닫기
        closeMobilePanel() {
            const panel = document.getElementById('map-select-panel');
            const mapBtn = document.getElementById('mobile-map-btn');
            const overlay = document.getElementById('mobile-overlay');

            if (panel) panel.classList.remove('open');
            if (mapBtn) mapBtn.classList.remove('active');

            // 필터 패널도 닫혀있으면 오버레이 숨김
            const filterPanel = document.getElementById('object-filter-panel');
            if (filterPanel && !filterPanel.classList.contains('open')) {
                if (overlay) overlay.classList.remove('active');
            }
        },

        // 모바일 UI 번역
        translateMobileUI() {
            if (!window.MapsI18n) return;
            const lang = window.MapsI18n.getCurrentLanguage();

            const mapPanelTitle = document.getElementById('map-panel-title');
            if (mapPanelTitle) {
                mapPanelTitle.textContent = window.MapsI18n.getText(lang, 'mapSelect') || '맵 선택';
            }

            const mapBtnSpan = document.querySelector('#mobile-map-btn span');
            if (mapBtnSpan) {
                mapBtnSpan.textContent = window.MapsI18n.getText(lang, 'map') || '맵';
            }

            // 브레드크럼도 업데이트
            this.updateBreadcrumb();
        },

        // 브레드크럼 업데이트
        updateBreadcrumb(submapName = null) {
            const breadcrumb = document.getElementById('mobile-breadcrumb');
            if (!breadcrumb || !window.MapsI18n || !window.MapsCore) return;

            const lang = window.MapsI18n.getCurrentLanguage();
            const mapsListData = window.MapsCore.getMapsListData();

            // 탭 이름
            const tabItem = breadcrumb.querySelector('[data-level="tab"]');
            if (tabItem) {
                tabItem.textContent = window.MapsI18n.getText(lang, currentMapId) || currentMapId;
            }

            // 카테고리 이름
            const categoryItem = breadcrumb.querySelector('[data-level="category"]');
            if (categoryItem) {
                if (currentCategoryId && mapsListData && mapsListData.maps) {
                    const currentMap = mapsListData.maps.find(m => m.id === currentMapId);
                    if (currentMap && currentMap.categories) {
                        const category = currentMap.categories.find(c => c.id === currentCategoryId);
                        if (category) {
                            categoryItem.textContent = window.MapsI18n.getMapName(category, lang);
                        } else {
                            categoryItem.textContent = '-';
                        }
                    } else {
                        categoryItem.textContent = '-';
                    }
                } else {
                    categoryItem.textContent = '-';
                }
            }

            // 맵 이름 (선택된 아이템에서 가져오기)
            const mapItem = breadcrumb.querySelector('[data-level="map"]');
            const submapItem = breadcrumb.querySelector('[data-level="submap"]');
            const submapSep = breadcrumb.querySelector('.breadcrumb-submap-sep');

            if (mapItem) {
                if (selectedMapItem) {
                    // 선택된 아이템의 텍스트 가져오기
                    const itemSpan = selectedMapItem.querySelector('span');
                    const mapName = itemSpan ? itemSpan.textContent : '-';

                    // 부모 맵이 있는지 확인 (서브맵인 경우)
                    const parentSubList = selectedMapItem.closest('.map-sub-list');
                    if (parentSubList) {
                        // 부모 맵 아이템 찾기
                        const parentMapItem = parentSubList.previousElementSibling;
                        if (parentMapItem && (parentMapItem.classList.contains('map-item') || parentMapItem.classList.contains('map-sub-item'))) {
                            const parentSpan = parentMapItem.querySelector('span');
                            const parentName = parentSpan ? parentSpan.textContent : '';

                            // 부모가 또 서브리스트 안에 있는지 확인 (2단계 깊이)
                            const grandParentSubList = parentMapItem.closest('.map-sub-list');
                            if (grandParentSubList) {
                                const grandParentItem = grandParentSubList.previousElementSibling;
                                if (grandParentItem) {
                                    const grandParentSpan = grandParentItem.querySelector('span');
                                    mapItem.textContent = grandParentSpan ? grandParentSpan.textContent : parentName;
                                    // submapItem에 부모 + 현재 표시
                                    if (submapItem && submapSep) {
                                        submapItem.textContent = parentName + ' › ' + mapName;
                                        submapItem.style.display = 'inline-block';
                                        submapSep.style.display = 'inline';
                                    }
                                } else {
                                    mapItem.textContent = parentName;
                                    if (submapItem && submapSep) {
                                        submapItem.textContent = mapName;
                                        submapItem.style.display = 'inline-block';
                                        submapSep.style.display = 'inline';
                                    }
                                }
                            } else {
                                // 1단계 서브맵
                                mapItem.textContent = parentName;
                                if (submapItem && submapSep) {
                                    submapItem.textContent = mapName;
                                    submapItem.style.display = 'inline-block';
                                    submapSep.style.display = 'inline';
                                }
                            }
                        } else {
                            mapItem.textContent = mapName;
                            if (submapItem && submapSep) {
                                submapItem.style.display = 'none';
                                submapSep.style.display = 'none';
                            }
                        }
                    } else {
                        // 최상위 맵 아이템
                        mapItem.textContent = mapName;
                        if (submapItem && submapSep) {
                            submapItem.style.display = 'none';
                            submapSep.style.display = 'none';
                        }
                    }
                } else {
                    mapItem.textContent = '-';
                    if (submapItem && submapSep) {
                        submapItem.style.display = 'none';
                        submapSep.style.display = 'none';
                    }
                }
            }
        },

        // 초기화
        init() {
            this.setupTabs();
            this.setupCategorySelect();
            this.translateUI();
            this.initMobileBottomsheet();
            this.translateMobileUI();
        }
    };
})();
