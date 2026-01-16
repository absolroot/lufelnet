// Maps Core - 공통 로직 (PixiJS, 맵 로드, 타일/오브젝트 로드, 마우스 이벤트)

(function() {
    'use strict';

    // BASE_URL은 레이아웃에서 window.BASE_URL로 설정됨
    const BASE_URL = typeof window.BASE_URL !== 'undefined' ? window.BASE_URL : '';
    
    // 경로 정규화
    function normalizePath(base, path) {
        const cleanBase = base.replace(/\/+$/, '');
        const cleanPath = path.replace(/^\/+/, '');
        return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
    }
    
    // 경로 상수
    const MAP_DATA_PATH = normalizePath(BASE_URL, 'apps/maps/map_json/');
    const TILE_PATH = normalizePath(BASE_URL, 'apps/maps/tiles/');
    const ICON_PATH = normalizePath(BASE_URL, 'apps/maps/yishijie-icon/');
    const MAPS_LIST_PATH = normalizePath(BASE_URL, 'apps/maps/maps_list.json');

    // 현재 언어 감지
    function getCurrentLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) {
            return urlLang;
        }
        try {
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && ['kr', 'en', 'jp'].includes(savedLang)) {
                return savedLang;
            }
        } catch (e) {}
        return 'kr';
    }

    // 전역 변수
    let app;
    let mapContainer;
    let tilesContainer;
    let objectsContainer;
    let currentMapData = null;
    let objectSprites = [];
    let zoomLevel = 1;
    let isDragging = false;
    let lastMousePos = { x: 0, y: 0 };
    let mapsListData = null;

    // MapsCore 클래스
    window.MapsCore = {
        // 공개 API
        getApp: () => app,
        getMapContainer: () => mapContainer,
        getTilesContainer: () => tilesContainer,
        getObjectsContainer: () => objectsContainer,
        getCurrentMapData: () => currentMapData,
        getObjectSprites: () => objectSprites,
        getZoomLevel: () => zoomLevel,
        setZoomLevel: (level) => { zoomLevel = level; },
        getMapsListData: () => mapsListData,
        setMapsListData: (data) => { mapsListData = data; },
        getCurrentLanguage: getCurrentLanguage,
        getPaths: () => ({ MAP_DATA_PATH, TILE_PATH, ICON_PATH, MAPS_LIST_PATH }),
        
        // PixiJS 초기화
        async initPixi() {
            try {
                const appOptions = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    backgroundColor: 0x1a1a1a,
                    antialias: true,
                    resolution: window.devicePixelRatio || 1,
                    autoDensity: true
                };

                if (typeof PIXI.Application.prototype.init === 'function') {
                    app = new PIXI.Application();
                    await app.init(appOptions);
                } else {
                    app = new PIXI.Application(appOptions);
                }

                if (!app || !app.view) {
                    throw new Error('PixiJS Application 초기화 실패');
                }

                document.getElementById('map-container').appendChild(app.view);
                app.view.style.width = '100%';
                app.view.style.height = '100%';

                mapContainer = new PIXI.Container();
                tilesContainer = new PIXI.Container();
                objectsContainer = new PIXI.Container();

                mapContainer.addChild(tilesContainer);
                mapContainer.addChild(objectsContainer);
                app.stage.addChild(mapContainer);

                this.setupMouseEvents();

                window.addEventListener('resize', () => {
                    if (app && app.renderer) {
                        app.renderer.resize(window.innerWidth, window.innerHeight);
                    }
                });

                return true;
            } catch (error) {
                console.error('PixiJS 초기화 실패:', error);
                const loadingText = document.getElementById('loading-text');
                if (loadingText) {
                    loadingText.textContent = 'PixiJS 초기화 실패: ' + error.message;
                }
                return false;
            }
        },

        // 마우스 이벤트 설정
        setupMouseEvents() {
            if (!app || !app.view) {
                console.error('app.view가 없어서 마우스 이벤트를 설정할 수 없습니다.');
                return;
            }

            app.view.addEventListener('mousedown', (e) => {
                isDragging = true;
                lastMousePos = { x: e.clientX, y: e.clientY };
            });

            app.view.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const dx = e.clientX - lastMousePos.x;
                    const dy = e.clientY - lastMousePos.y;
                    mapContainer.x += dx;
                    mapContainer.y += dy;
                    lastMousePos = { x: e.clientX, y: e.clientY };
                }
            });

            app.view.addEventListener('mouseup', () => {
                isDragging = false;
            });

            app.view.addEventListener('mouseleave', () => {
                isDragging = false;
            });

            app.view.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                this.zoomAtPoint(e.clientX, e.clientY, delta);
            });

            let touchStartDistance = 0;
            let touchStartZoom = 1;

            app.view.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    isDragging = true;
                    const touch = e.touches[0];
                    lastMousePos = { x: touch.clientX, y: touch.clientY };
                } else if (e.touches.length === 2) {
                    isDragging = false;
                    const touch1 = e.touches[0];
                    const touch2 = e.touches[1];
                    touchStartDistance = Math.hypot(
                        touch2.clientX - touch1.clientX,
                        touch2.clientY - touch1.clientY
                    );
                    touchStartZoom = zoomLevel;
                }
            });

            app.view.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (e.touches.length === 1 && isDragging) {
                    const touch = e.touches[0];
                    const dx = touch.clientX - lastMousePos.x;
                    const dy = touch.clientY - lastMousePos.y;
                    mapContainer.x += dx;
                    mapContainer.y += dy;
                    lastMousePos = { x: touch.clientX, y: touch.clientY };
                } else if (e.touches.length === 2) {
                    const touch1 = e.touches[0];
                    const touch2 = e.touches[1];
                    const distance = Math.hypot(
                        touch2.clientX - touch1.clientX,
                        touch2.clientY - touch1.clientY
                    );
                    const delta = distance / touchStartDistance;
                    zoomLevel = Math.max(0.1, Math.min(5, touchStartZoom * delta));
                    mapContainer.scale.set(zoomLevel);
                }
            });

            app.view.addEventListener('touchend', () => {
                isDragging = false;
                touchStartDistance = 0;
            });
        },

        // 특정 지점 기준 줌
        zoomAtPoint(screenX, screenY, delta) {
            const worldPos = {
                x: (screenX - mapContainer.x) / zoomLevel,
                y: (screenY - mapContainer.y) / zoomLevel
            };

            zoomLevel = Math.max(0.1, Math.min(5, zoomLevel * delta));
            mapContainer.scale.set(zoomLevel);

            const newScreenPos = {
                x: worldPos.x * zoomLevel + mapContainer.x,
                y: worldPos.y * zoomLevel + mapContainer.y
            };

            mapContainer.x += screenX - newScreenPos.x;
            mapContainer.y += screenY - newScreenPos.y;
        },

        // 맵 중앙 정렬
        centerMap(mapSize) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            mapContainer.x = centerX - (mapSize[0] / 2) * zoomLevel;
            mapContainer.y = centerY - (mapSize[1] / 2) * zoomLevel;
        },

        // 텍스처 로드
        async loadTexture(url) {
            try {
                if (typeof PIXI.Texture.fromURL === 'function') {
                    return await PIXI.Texture.fromURL(url);
                } else if (typeof PIXI.Assets !== 'undefined' && PIXI.Assets.load) {
                    const texture = await PIXI.Assets.load(url);
                    return texture instanceof PIXI.Texture ? texture : PIXI.Texture.from(texture);
                } else {
                    return PIXI.Texture.from(url);
                }
            } catch (error) {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        try {
                            const texture = PIXI.Texture.from(img);
                            resolve(texture);
                        } catch (e) {
                            reject(e);
                        }
                    };
                    img.onerror = reject;
                    img.src = url;
                });
            }
        },

        // 타일 로드
        async loadTiles(tiles) {
            const loadingText = document.getElementById('loading-text');
            const total = tiles.length;
            let loaded = 0;

            const promises = tiles.map(async (tile) => {
                try {
                    const texture = await this.loadTexture(`${TILE_PATH}${tile.image}`);
                    const sprite = new PIXI.Sprite(texture);
                    sprite.x = tile.position[0];
                    sprite.y = tile.position[1];
                    sprite.scale.set(tile.ratio || 1);
                    sprite.rotation = (tile.rotate || 0) * (Math.PI / 180);
                    tilesContainer.addChild(sprite);
                    
                    loaded++;
                    if (loadingText && window.MapsI18n) {
                        const lang = getCurrentLanguage();
                        const text = window.MapsI18n.getText(lang, 'loadingTiles');
                        loadingText.textContent = `${text} (${loaded}/${total})`;
                    }
                    return sprite;
                } catch (error) {
                    console.warn(`타일 로드 실패: ${tile.image}`, error);
                    return null;
                }
            });

            await Promise.all(promises);
        },

        // 오브젝트 로드
        async loadObjects(objects) {
            const loadingText = document.getElementById('loading-text');
            const total = objects.length;
            let loaded = 0;

            const promises = objects.map(async (obj) => {
                try {
                    const texture = await this.loadTexture(`${ICON_PATH}${obj.image}`);
                    const sprite = new PIXI.Sprite(texture);
                    sprite.x = obj.position[0];
                    sprite.y = obj.position[1];
                    sprite.scale.set(obj.ratio || 1);
                    sprite.rotation = (obj.rotate || 0) * (Math.PI / 180);
                    sprite.anchor.set(0.5);
                    
                    const objectType = obj.image.replace('yishijie-icon-', '').replace('.png', '');
                    sprite.objectType = objectType;
                    
                    objectSprites.push(sprite);
                    objectsContainer.addChild(sprite);
                    
                    loaded++;
                    if (loadingText && window.MapsI18n) {
                        const lang = getCurrentLanguage();
                        const text = window.MapsI18n.getText(lang, 'loadingObjects');
                        loadingText.textContent = `${text} (${loaded}/${total})`;
                    }
                    return sprite;
                } catch (error) {
                    console.warn(`오브젝트 로드 실패: ${obj.image}`, error);
                    return null;
                }
            });

            await Promise.all(promises);
        },

        // 맵 데이터 로드
        async loadMap(mapFileName) {
            try {
                const loadingEl = document.getElementById('loading');
                const loadingText = document.getElementById('loading-text');
                loadingEl.style.display = 'block';
                
                if (window.MapsI18n) {
                    const lang = getCurrentLanguage();
                    loadingText.textContent = window.MapsI18n.getText(lang, 'loading');
                }
                
                // 파일 경로가 이미 카테고리 폴더를 포함하는지 확인
                // 예: "palace/인지·야구장/야구장·정문0_data.json" 또는 "야구장·정문0_data.json"
                let url;
                if (mapFileName.includes('/')) {
                    // 이미 경로가 포함된 경우
                    url = `${MAP_DATA_PATH}${mapFileName}`;
                } else {
                    // 파일명만 있는 경우 (기존 방식)
                    url = `${MAP_DATA_PATH}${mapFileName}`;
                }
                
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('JSON이 아닌 응답:', text.substring(0, 200));
                    throw new Error('응답이 JSON 형식이 아닙니다.');
                }
                
                const data = await response.json();
                currentMapData = data;

                tilesContainer.removeChildren();
                objectsContainer.removeChildren();
                objectSprites = [];

                if (window.MapsI18n) {
                    const lang = getCurrentLanguage();
                    loadingText.textContent = window.MapsI18n.getText(lang, 'loadingTiles');
                }
                await this.loadTiles(data.tiles);

                if (window.MapsI18n) {
                    const lang = getCurrentLanguage();
                    loadingText.textContent = window.MapsI18n.getText(lang, 'loadingObjects');
                }
                await this.loadObjects(data.objects);

                this.centerMap(data.map_size);

                // 오브젝트 필터 패널에 알림
                if (window.ObjectFilterPanel) {
                    window.ObjectFilterPanel.updateFilterUI(data.objects);
                }

                loadingEl.style.display = 'none';
            } catch (error) {
                console.error('맵 로드 실패:', error);
                const loadingText = document.getElementById('loading-text');
                if (loadingText) {
                    loadingText.textContent = '맵 로드 실패: ' + error.message;
                }
            }
        },

        // 파일 존재 여부 확인
        async checkFileExists(url) {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                return response.ok;
            } catch (error) {
                return false;
            }
        },

        // 첫 번째 존재하는 서브맵 찾기
        async findFirstAvailableSubmap(submaps) {
            for (const submap of submaps) {
                if (submap.file) {
                    const fileUrl = `${MAP_DATA_PATH}${submap.file}`;
                    const exists = await this.checkFileExists(fileUrl);
                    if (exists) return submap;
                }
                if (submap.submaps && submap.submaps.length > 0) {
                    const found = await this.findFirstAvailableSubmap(submap.submaps);
                    if (found) return found;
                }
            }
            return null;
        }
    };
})();
