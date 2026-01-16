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
            
            tabs.forEach(tab => {
                const mapId = tab.dataset.mapId;
                if (mapId === 'palace') {
                    tab.textContent = window.MapsI18n.getText(lang, 'palace');
                } else if (mapId === 'mementoes') {
                    tab.textContent = window.MapsI18n.getText(lang, 'mementoes');
                }
            });
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    currentMapId = tab.dataset.mapId;
                    currentCategoryId = '';
                    selectedMapItem = null;
                    
                    this.updateCategoryDropdown();
                    document.getElementById('map-list').innerHTML = '';
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
            const hasFile = !!submap.file;
            
            if (!hasSubmaps && !hasFile) return;
            
            const item = document.createElement('div');
            item.className = hasSubmaps ? 'map-item has-submaps' : 'map-item';
            item.dataset.submapId = submap.id;
            if (hasFile) {
                item.dataset.file = submap.file;
            }
            
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
                    item.classList.toggle('expanded');
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
            const hasFile = !!submap.file;
            
            if (!hasSubmaps && !hasFile) return;
            
            const item = document.createElement('div');
            item.className = hasSubmaps ? 'map-sub-item has-submaps' : 'map-sub-item';
            item.dataset.submapId = submap.id;
            if (hasFile) {
                item.dataset.file = submap.file;
            }
            
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
                    item.classList.toggle('expanded');
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

        // 맵 아이템 선택
        selectMapItem(item, file) {
            if (selectedMapItem) {
                selectedMapItem.classList.remove('active');
            }
            
            item.classList.add('active');
            selectedMapItem = item;
            
            if (window.MapsCore) {
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
                        const mapItem = document.querySelector(`[data-file="${firstMap.file}"]`);
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
