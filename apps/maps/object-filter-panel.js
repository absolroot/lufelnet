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
                const type = obj.image.replace('yishijie-icon-', '').replace('.png', '');
                objectTypes.add(type);
            });

            objectFilters = {};
            objectTypes.forEach(type => {
                objectFilters[type] = true;
            });

            const ICON_PATH = window.MapsCore ? window.MapsCore.getPaths().ICON_PATH : '';

            Array.from(objectTypes).sort().forEach(type => {
                const filterItem = document.createElement('div');
                filterItem.className = 'filter-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `filter-${type}`;
                checkbox.checked = true;
                checkbox.addEventListener('change', (e) => {
                    objectFilters[type] = e.target.checked;
                    this.updateObjectVisibility();
                });

                const label = document.createElement('label');
                label.htmlFor = `filter-${type}`;
                label.textContent = type;

                const preview = document.createElement('img');
                preview.className = 'filter-preview';
                preview.src = `${ICON_PATH}yishijie-icon-${type}.png`;
                preview.onerror = () => {
                    preview.style.display = 'none';
                };

                filterItem.appendChild(checkbox);
                filterItem.appendChild(label);
                filterItem.appendChild(preview);
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
            
            const zoomLabel = document.querySelector('#object-filter-panel .control-group label');
            if (zoomLabel) {
                zoomLabel.textContent = window.MapsI18n.getText(lang, 'zoom');
            }
            
            const resetBtn = document.getElementById('zoom-reset');
            if (resetBtn) {
                resetBtn.textContent = window.MapsI18n.getText(lang, 'reset');
            }
            
            const infoText = document.querySelector('.info-text');
            if (infoText) {
                infoText.innerHTML = `${window.MapsI18n.getText(lang, 'dragMove')}<br>${window.MapsI18n.getText(lang, 'wheelZoom')}`;
            }
        },

        // 초기화
        init() {
            this.initZoomControls();
            this.translateUI();
        }
    };
})();
