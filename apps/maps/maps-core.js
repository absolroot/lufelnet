// Maps Core - 공통 로직 (PixiJS, 맵 로드, 타일/오브젝트 로드, 마우스 이벤트)

(function () {
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
    const MAP_DATA_BASE_PATH = normalizePath(BASE_URL, 'apps/maps/map_json/');
    const TILE_PATH = normalizePath(BASE_URL, 'apps/maps/tiles/');
    const ICON_PATH = normalizePath(BASE_URL, 'apps/maps/yishijie-icon/');
    const MAPS_LIST_PATH = normalizePath(BASE_URL, 'apps/maps/maps_list.json');

    // 언어별 맵 데이터 경로 반환
    function getMapDataPath(lang) {
        // lang: 'kr', 'en', 'jp'
        return `${MAP_DATA_BASE_PATH}${lang}/`;
    }

    // 현재 언어 감지
    function getCurrentLanguage() {
        const pathMatch = window.location.pathname.match(/^\/(kr|en|jp)(\/|$)/i);
        if (pathMatch) {
            return pathMatch[1].toLowerCase();
        }

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
        } catch (e) { }
        return 'kr';
    }

    function getMapsText(lang, key, fallback = '') {
        if (window.MapsI18n && typeof window.MapsI18n.getText === 'function') {
            const text = window.MapsI18n.getText(lang, key);
            if (text && text !== key) return text;
        }

        if (window.MapsI18n && typeof window.MapsI18n.getPack === 'function') {
            const krPack = window.MapsI18n.getPack('kr') || {};
            if (Object.prototype.hasOwnProperty.call(krPack, key)) {
                return krPack[key];
            }
        }

        return fallback || key;
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
    let currentMapFileName = null; // 현재 로드된 맵 파일명
    let mapVersions = []; // 사용 가능한 맵 버전 목록
    let currentMapVersion = 0; // 현재 선택된 버전
    let currentMapId = null; // 현재 맵 ID (위치 저장용)
    // 위치 저장 디바운스용
    const positionSaveTimeout = null;

    // 텍스처 메모리 캐시 (세션 동안 유지)
    const textureCache = new Map();
    const textureCacheStats = { hits: 0, misses: 0 };

    // MapsCore 클래스
    window.MapsCore = {
        // 디버그 모드 (콘솔에서 MapsCore.debugMode = true 로 활성화)
        debugMode: false,

        // 공개 API
        getApp: () => app,
        getMapContainer: () => mapContainer,

        // 초기화 함수
        async init() {
            // 비대화형 아이콘 목록 로드
            await this.loadNonInteractiveIcons();
        },
        getTilesContainer: () => tilesContainer,
        getObjectsContainer: () => objectsContainer,
        getCurrentMapData: () => currentMapData,
        getObjectSprites: () => objectSprites,
        getZoomLevel: () => zoomLevel,
        setZoomLevel: (level) => { zoomLevel = level; },
        getMapsListData: () => mapsListData,
        setMapsListData: (data) => { mapsListData = data; },
        getCurrentLanguage: getCurrentLanguage,
        getMapDataPath: getMapDataPath,
        getPaths: () => ({ MAP_DATA_BASE_PATH, TILE_PATH, ICON_PATH, MAPS_LIST_PATH, getMapDataPath }),

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
                // 캔버스 크기를 명시적으로 설정 (모바일 뷰포트 문제 방지)
                app.view.style.width = window.innerWidth + 'px';
                app.view.style.height = window.innerHeight + 'px';

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
                        // 캔버스 CSS 크기도 업데이트
                        app.view.style.width = window.innerWidth + 'px';
                        app.view.style.height = window.innerHeight + 'px';
                    }
                });

                return true;
            } catch (error) {
                console.error('PixiJS 초기화 실패:', error);
                const loadingText = document.getElementById('loading-text');
                if (loadingText) {
                    const lang = getCurrentLanguage();
                    const message = getMapsText(lang, 'pixiInitError', 'PixiJS 초기화 실패');
                    loadingText.textContent = `${message}: ${error.message}`;
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
                this.schedulePositionSave();
            });

            app.view.addEventListener('mouseleave', () => {
                isDragging = false;
            });

            app.view.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                this.zoomAtPoint(e.clientX, e.clientY, delta);
                this.schedulePositionSave();
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
                this.schedulePositionSave();
            });

            // 키보드 이벤트 설정
            this.setupKeyboardEvents();
        },

        // 키보드 이벤트 설정
        setupKeyboardEvents() {
            const MOVE_SPEED = 40;
            const ZOOM_FACTOR = 1.15;
            const pressedKeys = new Set();
            let animationId = null;

            const handleMovement = () => {
                let moved = false;

                if (pressedKeys.has('w') || pressedKeys.has('arrowup')) {
                    mapContainer.y += MOVE_SPEED;
                    moved = true;
                }
                if (pressedKeys.has('s') || pressedKeys.has('arrowdown')) {
                    mapContainer.y -= MOVE_SPEED;
                    moved = true;
                }
                if (pressedKeys.has('a') || pressedKeys.has('arrowleft')) {
                    mapContainer.x += MOVE_SPEED;
                    moved = true;
                }
                if (pressedKeys.has('d') || pressedKeys.has('arrowright')) {
                    mapContainer.x -= MOVE_SPEED;
                    moved = true;
                }

                if (moved && pressedKeys.size > 0) {
                    animationId = requestAnimationFrame(handleMovement);
                }
            };

            document.addEventListener('keydown', (e) => {
                // 입력 필드에 포커스가 있으면 무시
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                const key = e.key.toLowerCase();

                // 이동 키
                if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
                    e.preventDefault();
                    if (!pressedKeys.has(key)) {
                        pressedKeys.add(key);
                        if (!animationId) {
                            animationId = requestAnimationFrame(handleMovement);
                        }
                    }
                }

                // 줌 키
                if (key === '=' || key === '+' || key === 'numpadadd') {
                    e.preventDefault();
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;
                    this.zoomAtPoint(centerX, centerY, ZOOM_FACTOR);
                    this.schedulePositionSave();
                }
                if (key === '-' || key === 'numpadsubtract') {
                    e.preventDefault();
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;
                    this.zoomAtPoint(centerX, centerY, 1 / ZOOM_FACTOR);
                    this.schedulePositionSave();
                }

                // 리셋 키 (0 또는 Home)
                if (key === '0' || key === 'home') {
                    e.preventDefault();
                    if (currentMapData && currentMapData.map_size) {
                        zoomLevel = 1;
                        this.centerMap(currentMapData.map_size);
                        this.schedulePositionSave();
                    }
                }
            });

            document.addEventListener('keyup', (e) => {
                const key = e.key.toLowerCase();
                const wasMovementKey = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key);
                pressedKeys.delete(key);

                if (pressedKeys.size === 0 && animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }

                // 이동 키에서 손을 뗐을 때 위치 저장
                if (wasMovementKey) {
                    this.schedulePositionSave();
                }
            });

            // 창 포커스 잃으면 키 초기화
            window.addEventListener('blur', () => {
                pressedKeys.clear();
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
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

            // 맵의 가로세로 비율 확인
            const mapAspectRatio = mapSize[0] / mapSize[1];
            const isWideMap = mapAspectRatio >= 2.5; // 가로가 세로보다 2.5배 이상 큰 경우

            // 맵 이미지가 화면 세로의 최소 비율을 채우도록 최소 줌 레벨 계산
            // 가로가 긴 맵(2.5배 이상)은 25%, 일반 맵은 50%
            const minHeightRatio = isWideMap ? 0.25 : 0.7;
            const screenHeight = window.innerHeight;
            const minRequiredHeight = screenHeight * minHeightRatio;
            const minZoomLevel = minRequiredHeight / mapSize[1];

            // 이전 줌 레벨과 최소 줌 레벨 중 더 큰 값을 사용 (이전 확대를 기반으로 하되, 최소 비율은 채워야 함)
            if (zoomLevel < minZoomLevel) {
                zoomLevel = minZoomLevel;
                mapContainer.scale.set(zoomLevel);
            }

            // pivot이 설정된 경우 (회전된 맵)와 그렇지 않은 경우를 구분
            if (mapContainer.pivot.x !== 0 || mapContainer.pivot.y !== 0) {
                // pivot이 중앙에 설정된 경우, mapContainer의 위치는 pivot의 위치
                mapContainer.x = centerX;
                mapContainer.y = centerY;
            } else {
                // pivot이 없는 경우 (기존 로직)
                mapContainer.x = centerX - (mapSize[0] / 2) * zoomLevel;
                mapContainer.y = centerY - (mapSize[1] / 2) * zoomLevel;
            }
        },

        // 현재 맵 ID 설정 (외부에서 호출)
        setCurrentMapId(mapId) {
            // 이전 맵의 위치 저장
            if (currentMapId && currentMapId !== mapId) {
                this.saveMapPosition(currentMapId);
            }
            currentMapId = mapId;
        },

        // 현재 맵 ID 조회
        getCurrentMapId() {
            return currentMapId;
        },

        // 맵 위치/줌 저장 (localStorage)
        saveMapPosition(mapId) {
            if (!mapId || !mapContainer) return;

            try {
                const positionData = {
                    x: mapContainer.x,
                    y: mapContainer.y,
                    zoom: zoomLevel,
                    timestamp: Date.now()
                };
                localStorage.setItem(`map_position_${mapId}`, JSON.stringify(positionData));
            } catch (e) {
                console.warn('맵 위치 저장 실패:', e);
            }
        },

        // 맵 위치/줌 복원 (localStorage)
        restoreMapPosition(mapId) {
            if (!mapId || !mapContainer) return false;

            try {
                const saved = localStorage.getItem(`map_position_${mapId}`);
                if (!saved) return false;

                const positionData = JSON.parse(saved);

                // 30일 이상 된 데이터는 무시
                const maxAge = 30 * 24 * 60 * 60 * 1000;
                if (Date.now() - positionData.timestamp > maxAge) {
                    localStorage.removeItem(`map_position_${mapId}`);
                    return false;
                }

                // 위치/줌 복원
                mapContainer.x = positionData.x;
                mapContainer.y = positionData.y;
                zoomLevel = positionData.zoom;
                mapContainer.scale.set(zoomLevel);

                return true;
            } catch (e) {
                console.warn('맵 위치 복원 실패:', e);
                return false;
            }
        },

        // 위치 변경 시 디바운스로 자동 저장
        schedulePositionSave() {
            if (!currentMapId) return;

            if (positionSaveTimeout) {
                clearTimeout(positionSaveTimeout);
            }

            positionSaveTimeout = setTimeout(() => {
                this.saveMapPosition(currentMapId);
            }, 500);
        },

        // 텍스처 캐시 통계 조회
        getTextureCacheStats() {
            return {
                ...textureCacheStats,
                size: textureCache.size,
                hitRate: textureCacheStats.hits + textureCacheStats.misses > 0
                    ? (textureCacheStats.hits / (textureCacheStats.hits + textureCacheStats.misses) * 100).toFixed(1) + '%'
                    : '0%'
            };
        },

        // 텍스처 캐시 클리어 (메모리 부족 시 호출)
        clearTextureCache() {
            textureCache.clear();
            textureCacheStats.hits = 0;
            textureCacheStats.misses = 0;
            console.log('텍스처 캐시 클리어됨');
        },

        // 텍스처 로드 (메모리 캐시 적용)
        async loadTexture(url) {
            // 캐시에서 먼저 확인
            if (textureCache.has(url)) {
                textureCacheStats.hits++;
                return textureCache.get(url);
            }

            textureCacheStats.misses++;

            try {
                let texture;
                if (typeof PIXI.Texture.fromURL === 'function') {
                    texture = await PIXI.Texture.fromURL(url);
                } else if (typeof PIXI.Assets !== 'undefined' && PIXI.Assets.load) {
                    const loaded = await PIXI.Assets.load(url);
                    texture = loaded instanceof PIXI.Texture ? loaded : PIXI.Texture.from(loaded);
                } else {
                    texture = PIXI.Texture.from(url);
                }

                // 캐시에 저장
                textureCache.set(url, texture);
                return texture;
            } catch (error) {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        try {
                            const texture = PIXI.Texture.from(img);
                            // 캐시에 저장
                            textureCache.set(url, texture);
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

        // 타일 로드 (회전 보정 로직 추가됨)
        // maps-core.js - Python 로직 정확한 재현

        // maps-core.js - Python 로직 정확한 재현
        // 디버그 모드: 콘솔에서 MapsCore.debugMode = true 로 활성화
        debugMode: false,

        // Python 3와 동일한 banker's rounding (가장 가까운 짝수로 반올림)
        pythonRound(x) {
            const floor = Math.floor(x);
            const decimal = x - floor;
            if (decimal === 0.5) {
                // 정확히 0.5면 가장 가까운 짝수로
                return floor % 2 === 0 ? floor : floor + 1;
            }
            return Math.round(x);
        },

        // Python rotate_and_expand 함수를 정확히 재현
        // Python: rotate_and_expand(image, angle, pivot)
        // Returns: rotated and expanded canvas
        calculateRotatedSize(w, h, px, py, angleRad) {
            // Python: new_w = round(max(px, w - px) * 2)
            //         new_h = round(max(py, h - py) * 2)
            const new_w = Math.round(Math.max(px, w - px) * 2);
            const new_h = Math.round(Math.max(py, h - py) * 2);

            // Python: paste_x = round(new_w / 2 - px)
            //         paste_y = round(new_h / 2 - py)
            const paste_x = Math.round(new_w / 2 - px);
            const paste_y = Math.round(new_h / 2 - py);

            // Python: center = (paste_x + px, paste_y + py)
            const center_x = paste_x + px;
            const center_y = paste_y + py;

            // 회전된 캔버스의 네 모서리
            const canvas_corners = [
                [0, 0], [new_w, 0], [new_w, new_h], [0, new_h]
            ];

            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);

            // 회전 변환
            const rotated_corners = canvas_corners.map(([x, y]) => {
                const dx = x - center_x;
                const dy = y - center_y;
                return [
                    dx * cos - dy * sin,
                    dx * sin + dy * cos
                ];
            });

            const xs = rotated_corners.map(c => c[0]);
            const ys = rotated_corners.map(c => c[1]);
            const minX = Math.min(...xs);
            const minY = Math.min(...ys);
            const maxX = Math.max(...xs);
            const maxY = Math.max(...ys);

            // Python: PIL rotate(expand=True)는 결과 크기를 정수로 처리
            const expandedWidth = Math.round(maxX - minX);
            const expandedHeight = Math.round(maxY - minY);

            return {
                expandedWidth,
                expandedHeight,
                paste_x,
                paste_y,
                center_x,
                center_y,
                new_w,
                new_h
            };
        },

        async loadTiles(tiles) {
            const loadingText = document.getElementById('loading-text');
            const total = tiles.length;
            let loaded = 0;
            const isMementosMap = currentMapFileName && currentMapFileName.includes('mementos');
            const self = this;

            const promises = tiles.map(async (tile, tileIndex) => {
                try {
                    const texture = await this.loadTexture(`${TILE_PATH}${tile.image}`);
                    const sprite = new PIXI.Sprite(texture);

                    const ratio = tile.ratio || 1;
                    sprite.scale.set(ratio);

                    // 디버그 정보 저장
                    const debugInfo = {
                        index: tileIndex,
                        image: tile.image,
                        originalPosition: [...tile.position],
                        rotate: tile.rotate || 0,
                        rotate_pivot: tile.rotate_pivot || null,
                        ratio: ratio,
                        textureSize: [texture.width, texture.height],
                        scaledSize: [Math.round(texture.width * ratio), Math.round(texture.height * ratio)],
                        computed: {}
                    };

                    if (isMementosMap && tile.rotate_pivot && Array.isArray(tile.rotate_pivot) && tile.rotate_pivot.length >= 2) {
                        const ratio_xy = tile.rotate_pivot;

                        const w = Math.round(texture.width * ratio);
                        const h = Math.round(texture.height * ratio);

                        // Python pivot (스케일된 이미지 좌표)
                        const px = w * ratio_xy[0];
                        const py = h * (1 - ratio_xy[1]);

                        const rot_deg = -(tile.rotate || 0);

                        // rotate_and_expand 로직
                        const new_w = Math.round(Math.max(px, w - px) * 2);
                        const new_h = Math.round(Math.max(py, h - py) * 2);
                        const paste_x = Math.round(new_w / 2 - px);
                        const paste_y = Math.round(new_h / 2 - py);

                        // 디버그 정보 추가
                        debugInfo.computed = {
                            px, py,
                            rot_deg,
                            new_w, new_h,
                            paste_x, paste_y,
                            pivotTexture: [texture.width * ratio_xy[0], texture.height * (1 - ratio_xy[1])]
                        };

                        // PixiJS pivot 설정 (원본 텍스처 좌표)
                        sprite.pivot.set(
                            texture.width * ratio_xy[0],
                            texture.height * (1 - ratio_xy[1])
                        );

                        if (Math.abs(rot_deg) < 0.01) {
                            // 회전 없음: Python rotate_and_expand(expand=True) 로직 구현
                            // Python position은 확장된 캔버스(new_w x new_h)의 좌상단 좌표
                            // PixiJS sprite는 pivot을 중심으로 위치하므로 pivot을 기준으로 조정 필요

                            sprite.rotation = 0;
                            // 확장된 캔버스의 좌상단에서 pivot까지의 거리를 계산
                            sprite.x = tile.position[0] + paste_x + px;
                            sprite.y = tile.position[1] + paste_y + py;

                            debugInfo.computed.branch = 'no-rotation';
                            debugInfo.computed.finalPos = [sprite.x, sprite.y];
                        } else {
                            // 회전 있음
                            const pil_angle = -rot_deg;
                            const pil_angle_rad = pil_angle * (Math.PI / 180);

                            const center_x = paste_x + px;
                            const center_y = paste_y + py;

                            const cos = Math.cos(pil_angle_rad);
                            const sin = Math.sin(pil_angle_rad);

                            const canvas_corners = [
                                [0, 0], [new_w, 0], [new_w, new_h], [0, new_h]
                            ];

                            const rotated_corners = canvas_corners.map(([x, y]) => {
                                const dx = x - center_x;
                                const dy = y - center_y;
                                return [
                                    dx * cos - dy * sin,
                                    dx * sin + dy * cos
                                ];
                            });

                            const xs = rotated_corners.map(c => c[0]);
                            const ys = rotated_corners.map(c => c[1]);
                            const minX = Math.min(...xs);
                            const minY = Math.min(...ys);
                            const maxX = Math.max(...xs);
                            const maxY = Math.max(...ys);

                            // PIL rotate(expand=True)는 결과 크기를 정수로 처리
                            const expandedWidth = Math.round(maxX - minX);
                            const expandedHeight = Math.round(maxY - minY);

                            sprite.rotation = rot_deg * (Math.PI / 180);
                            sprite.x = tile.position[0] + expandedWidth / 2;
                            sprite.y = tile.position[1] + expandedHeight / 2;

                            debugInfo.computed.branch = 'with-rotation';
                            debugInfo.computed.pil_angle = pil_angle;
                            debugInfo.computed.center = [center_x, center_y];
                            debugInfo.computed.expandedSize = [expandedWidth, expandedHeight];
                            debugInfo.computed.finalPos = [sprite.x, sprite.y];
                        }

                    } else {
                        // 일반 맵 (팰리스) - 회전 없음
                        sprite.x = tile.position[0];
                        sprite.y = tile.position[1];
                        debugInfo.computed.branch = 'simple';
                        debugInfo.computed.finalPos = [sprite.x, sprite.y];
                    }

                    // 디버그 정보를 sprite에 저장
                    sprite.debugInfo = debugInfo;

                    // 타일 클릭 이벤트 (디버그 모드에서만 동작)
                    sprite.eventMode = 'static';
                    sprite.cursor = 'default';
                    sprite.on('pointerup', function () {
                        if (window.MapsCore && window.MapsCore.debugMode) {
                            console.log('=== TILE DEBUG INFO ===');
                            console.log('Index:', this.debugInfo.index);
                            console.log('Image:', this.debugInfo.image);
                            console.log('Position:', this.debugInfo.originalPosition);
                            console.log('Rotate:', this.debugInfo.rotate);
                            console.log('Rotate Pivot:', this.debugInfo.rotate_pivot);
                            console.log('Computed:', this.debugInfo.computed);
                            console.log('========================');

                            // 화면에 디버그 패널 표시
                            if (window.MapsDebug) {
                                window.MapsDebug.showDebugPanel(this.debugInfo, this);
                            }
                        }
                    });

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

        // 비대화형 아이콘 목록
        nonInteractiveIcons: [],

        // 비대화형 아이콘 목록 로드
        async loadNonInteractiveIcons() {
            try {
                // BASE_URL 사용하여 정확한 경로 설정
                const BASE = (typeof window !== 'undefined' && (window.BASE_URL || window.SITE_BASEURL)) || '';
                const response = await fetch(`${BASE}/apps/maps/non-interactive-icons.json`);
                // console.log('JSON 응답 상태:', response.status, response.ok);
                if (response.ok) {
                    const data = await response.json();
                    console.log('JSON 데이터:', data);
                    this.nonInteractiveIcons = data.non_interactive_icons || [];
                    // 전역 변수에 카운트 관련 데이터도 저장
                    window.nonInteractiveIconsData = {
                        non_interactive_icons: data.non_interactive_icons || [],
                        non_countable_icons: data.non_countable_icons || [],
                        have_to_count_icons: data.have_to_count_icons || []
                    };
                    // console.log('비대화형 아이콘 목록 로드됨:', this.nonInteractiveIcons);
                } else {
                    // console.warn('비대화형 아이콘 JSON 로드 실패:', response.status);
                }
            } catch (error) {
                console.warn('비대화형 아이콘 목록 로드 실패:', error);
            }
        },

        // 비대화형 아이콘인지 확인
        isNonInteractiveIcon(imageName) {
            return this.nonInteractiveIcons.includes(imageName);
        },

        // 오브젝트 로드 및 배치
        // mapRotationDeg: 맵 회전 각도 (도 단위, 반시계 방향), 오브젝트는 역회전하여 원래 방향 유지
        async loadObjects(objects, mapRotationDeg = 0) {
            const loadingText = document.getElementById('loading-text');
            const total = objects.length;
            let loaded = 0;

            const self = this;
            const promises = objects.map(async (obj, objIndex) => {
                try {
                    const texture = await this.loadTexture(`${ICON_PATH}${obj.image}`);
                    const sprite = new PIXI.Sprite(texture);

                    // JSON의 ratio를 scale로 사용
                    const finalRatio = obj.ratio || 1;
                    const rot_deg = obj.rotate || 0;

                    // 디버그 정보 저장
                    const debugInfo = {
                        index: objIndex,
                        image: obj.image,
                        originalPosition: [...obj.position],
                        rotate: rot_deg,
                        ratio: finalRatio,
                        textureSize: [texture.width, texture.height],
                        scaledSize: [Math.round(texture.width * finalRatio), Math.round(texture.height * finalRatio)],
                        computed: {}
                    };

                    // obj.position은 오브젝트 중앙 좌표
                    // anchor를 중앙(0.5, 0.5)으로 설정하면 position이 곧 sprite 위치
                    sprite.anchor.set(0.5, 0.5);
                    sprite.x = obj.position[0];
                    sprite.y = obj.position[1];

                    // 오브젝트 자체 회전 + 맵 회전의 역회전 적용
                    // 맵이 반시계 방향으로 회전하면, 오브젝트는 시계 방향으로 회전하여 원래 방향 유지
                    const objectRotation = -rot_deg * (Math.PI / 180);
                    const mapRotationCompensation = mapRotationDeg * (Math.PI / 180); // 맵 회전의 역회전
                    sprite.rotation = objectRotation + mapRotationCompensation;

                    debugInfo.computed = {
                        rot_deg,
                        mapRotationCompensation: mapRotationDeg,
                        finalRotation: (objectRotation + mapRotationCompensation) * 180 / Math.PI,
                        finalPos: [sprite.x, sprite.y]
                    };

                    // 특정 아이콘들의 ratio가 1.5보다 크면 1.5로 제한
                    const limitedIcons = [
                        'yishijie-icon-box-01-new.png',
                        'yishijie-icon-chepiao01.png',
                        'yishijie-icon-chepiao02.png',
                        'yishijie-icon-chepiao03.png',
                        'yishijie-icon-youtong-new.png'
                    ];

                    let adjustedRatio = finalRatio;
                    if (limitedIcons.includes(obj.image) && adjustedRatio > 1.5) {
                        adjustedRatio = 1.5;
                    }

                    // 최소 사이즈 24px 보장
                    const minSize = 24;
                    const scaledWidth = texture.width * adjustedRatio;
                    const scaledHeight = texture.height * adjustedRatio;
                    const minDimension = Math.min(scaledWidth, scaledHeight);

                    if (minDimension < minSize) {
                        // 최소 사이즈를 보장하기 위해 ratio 조정
                        const minRatioForWidth = minSize / texture.width;
                        const minRatioForHeight = minSize / texture.height;
                        const requiredMinRatio = Math.max(minRatioForWidth, minRatioForHeight);

                        // 기존 adjustedRatio와 requiredMinRatio 중 더 큰 값 사용
                        adjustedRatio = Math.max(adjustedRatio, requiredMinRatio);
                    }

                    // breakable 아이콘은 ratio를 원래 그대로 설정
                    if (obj.image === 'breakable.png' || obj.image === 'yishijie-icon-breakable.png') {
                        adjustedRatio = finalRatio * 0.6;

                        // breakable 아이콘은 자기 height/2 + height/10 만큼 위로 이동
                        sprite.y -= texture.height * adjustedRatio / 2 + texture.height * adjustedRatio / 10;
                    }

                    sprite.scale.set(adjustedRatio);

                    debugInfo.computed.finalRatio = finalRatio;
                    debugInfo.computed.adjustedRatio = adjustedRatio;

                    // 디버그 정보를 sprite에 저장
                    sprite.debugInfo = debugInfo;

                    // sn 정보 저장
                    sprite.objectSn = obj.sn || null;

                    // 이미지 정보 저장 (non_countable_icons 확인용)
                    sprite.objectImage = obj.image || null;

                    // enemy_data 저장
                    if (obj.enemy_data) {
                        sprite.debugInfo.enemyData = obj.enemy_data;
                    }

                    // 디버그 정보를 전역 저장소에 추가
                    if (window.MapsDebug) {
                        window.MapsDebug.addObjectDebugInfo({
                            index: debugInfo.index,
                            image: debugInfo.image,
                            position: debugInfo.originalPosition,
                            rotate: debugInfo.rotate,
                            ratio: debugInfo.ratio,
                            textureSize: debugInfo.textureSize,
                            scaledSize: debugInfo.scaledSize,
                            computed: debugInfo.computed,
                            spritePosition: [sprite.x, sprite.y],
                            spriteRotationDeg: sprite.rotation * 180 / Math.PI,
                            spriteAnchor: [sprite.anchor.x, sprite.anchor.y],
                            spriteScale: [sprite.scale.x, sprite.scale.y]
                        });
                    }

                    // 저장된 클릭 상태 확인 및 적용 (비대화형 아이콘 제외)
                    const isNonInteractive = this.isNonInteractiveIcon(obj.image);
                    // console.log(`오브젝트: ${obj.image}, 비대화형: ${isNonInteractive}`);

                    if (sprite.objectSn && window.ObjectClickHandler && !isNonInteractive) {
                        window.ObjectClickHandler.restoreClickedState(sprite);
                    }

                    // 클릭 이벤트 활성화 (비대화형 아이콘 제외)
                    if (!isNonInteractive) {
                        sprite.eventMode = 'static';
                        sprite.cursor = 'pointer';
                        sprite.on('pointerup', function () {
                            if (this.objectSn && window.ObjectClickHandler) {
                                window.ObjectClickHandler.toggleObjectClicked(this);
                            }

                            // 디버그 모드일 때만 출력 (콘솔에서 MapsCore.debugMode = true 로 활성화)
                            if (window.MapsCore && window.MapsCore.debugMode) {
                                console.log('Object clicked:', this.debugInfo.image);
                                console.log('=== OBJECT DEBUG INFO ===');
                                console.log('Index:', this.debugInfo.index);
                                console.log('SN:', this.objectSn);
                                console.log('Position:', this.debugInfo.originalPosition);
                                console.log('Rotate:', this.debugInfo.rotate);
                                console.log('Computed:', this.debugInfo.computed);
                                console.log('=========================');

                                // 화면에 디버그 패널 표시
                                if (window.MapsDebug) {
                                    window.MapsDebug.showDebugPanel(this.debugInfo, this);
                                }
                            }
                        });
                    } else {
                        // 비대화형 아이콘은 클릭 이벤트 비활성화
                        sprite.eventMode = 'none';
                        sprite.cursor = 'default';
                        //console.log(`비대화형 아이콘 처리: ${obj.image}`);
                    }

                    let objectType = obj.image;
                    if (objectType.startsWith('yishijie-icon-')) {
                        objectType = objectType.replace('yishijie-icon-', '');
                    }
                    if (objectType.startsWith('yishijie-')) {
                        objectType = objectType.replace('yishijie-', '');
                    }
                    if (objectType.endsWith('.png')) {
                        objectType = objectType.replace('.png', '');
                    }
                    // 특수 케이스: jinzhi2를 jinzhi로 통일 (같은 이미지)
                    if (objectType === 'jinzhi2') {
                        objectType = 'jinzhi';
                    }
                    sprite.objectType = objectType;

                    // null이 아닌 경우에만 추가 (로드 실패한 오브젝트는 스프라이트 생성 안 함)
                    if (sprite) {
                        objectSprites.push(sprite);
                        objectsContainer.addChild(sprite);
                    }

                    loaded++;
                    if (loadingText && window.MapsI18n) {
                        const lang = getCurrentLanguage();
                        const text = window.MapsI18n.getText(lang, 'loadingObjects');
                        loadingText.textContent = `${text} (${loaded}/${total})`;
                    }
                    return sprite;
                } catch (error) {
                    console.warn(`오브젝트 로드 실패: ${obj.image}`, error);
                    return null; // 실패한 오브젝트는 null 반환, 스프라이트 생성 안 함
                }
            });

            await Promise.all(promises);
        },

        // 파일명에서 기본 이름과 버전 추출
        parseMapFileName(fileName) {
            // 타입 체크: 배열이 전달되면 첫 번째 요소 사용
            if (Array.isArray(fileName)) {
                if (fileName.length === 0) {
                    throw new Error('파일명 배열이 비어있습니다.');
                }
                fileName = fileName[0];
            }

            // 문자열 타입 체크
            if (typeof fileName !== 'string') {
                throw new Error(`잘못된 파일명 타입: ${typeof fileName}. 문자열이 필요합니다.`);
            }

            // 예: "palace/인지·폭식의 댐/댐·정신 에너지탑 하층0_data.json" 또는 "댐·정신 에너지탑 하층0_data.json"
            const match = fileName.match(/^(.+?)(\d+)_data\.json$/);
            if (match) {
                const fullBase = match[1];
                const version = parseInt(match[2], 10);

                let basePath = '';
                let baseName = fullBase;

                if (fullBase.includes('/')) {
                    const lastSlash = fullBase.lastIndexOf('/');
                    basePath = fullBase.substring(0, lastSlash + 1);
                    baseName = fullBase.substring(lastSlash + 1);
                }

                return {
                    basePath: basePath,
                    baseName: baseName,
                    version: version,
                    fullPath: fileName
                };
            }

            let basePath = '';
            let baseName = fileName.replace('_data.json', '');

            if (baseName.includes('/')) {
                const lastSlash = baseName.lastIndexOf('/');
                basePath = baseName.substring(0, lastSlash + 1);
                baseName = baseName.substring(lastSlash + 1);
            }

            return {
                basePath: basePath,
                baseName: baseName,
                version: null,
                fullPath: fileName
            };
        },


        // 특정 버전의 맵 로드
        async loadMapVersion(version) {
            // 원본 파일 배열 사용 (재정렬되지 않은 원본)
            const originalFileArray = window.originalMapFileArray;
            if (!Array.isArray(originalFileArray) || originalFileArray.length === 0) return;

            // 버전은 배열 인덱스이므로 직접 접근
            if (version < 0 || version >= originalFileArray.length) return;

            const versionFile = originalFileArray[version];
            currentMapVersion = version;

            // 버전 변경 시에는 강제로 스테이지 정리
            if (app && app.stage) {
                const tilesContainer = app.stage.getChildByName('tiles');
                const objectsContainer = app.stage.getChildByName('objects');

                if (tilesContainer) {
                    tilesContainer.removeChildren();
                }
                if (objectsContainer) {
                    objectsContainer.removeChildren();
                }
                objectSprites = [];
            }

            // 단일 파일로 로드 (배열 재정렬 없이, 폴백 배열 포함)
            const fallbackArray = window.fallbackMapFileArray || null;
            await this.loadMapInternal(versionFile, originalFileArray, version, fallbackArray);

            // 버전 선택 UI 업데이트
            const versions = originalFileArray.map((file, index) => ({
                version: index,
                file: file,
                index: index
            }));
            this.createVersionSelectorFromArray(versions, version);
        },

        // 배열 기반 버전 선택 UI 생성 (오브젝트 필터 패널 외부 오른쪽 상단)
        createVersionSelectorFromArray(versions, currentVersion) {
            const existing = document.getElementById('map-version-selector');
            if (existing) {
                existing.remove();
            }

            if (versions.length < 2) {
                return;
            }

            const selector = document.createElement('div');
            selector.id = 'map-version-selector';

            versions.forEach((v, index) => {
                const button = document.createElement('button');
                button.className = 'version-btn';
                button.textContent = (v.version + 1).toString();
                if (v.version === currentVersion) {
                    button.classList.add('active');
                }
                button.addEventListener('click', () => {
                    this.loadMapVersion(v.version);
                });
                selector.appendChild(button);
            });

            // 오브젝트 필터 패널 외부 오른쪽 상단에 배치
            const objectFilterPanel = document.getElementById('object-filter-panel');
            const mapContainer = document.getElementById('map-container');
            if (objectFilterPanel && mapContainer) {
                mapContainer.appendChild(selector);
            } else {
                // 폴백: map-container에 추가
                document.getElementById('map-container').appendChild(selector);
            }
        },

        // 맵 데이터 로드 (file 배열 또는 단일 파일명 지원) - 외부 호출용
        // fallbackFiles: kr 파일 배열 (폴백용, 옵션)
        async loadMap(mapFileNameOrArray, fallbackFiles = null) {
            // 배열인 경우 첫 번째 파일 사용
            let mapFileName;
            let fileArray = [];
            if (Array.isArray(mapFileNameOrArray)) {
                fileArray = mapFileNameOrArray.filter(f => f && f.trim() !== '');
                if (fileArray.length === 0) {
                    console.error('유효한 맵 파일이 없습니다.');
                    return;
                }
                mapFileName = fileArray[0];
            } else {
                mapFileName = mapFileNameOrArray;
                fileArray = [mapFileName];
            }

            // 폴백 파일 배열 정리
            let fallbackArray = null;
            if (fallbackFiles) {
                fallbackArray = Array.isArray(fallbackFiles)
                    ? fallbackFiles.filter(f => f && f.trim() !== '')
                    : [fallbackFiles];
            }

            // 원본 배열 저장 (버전 선택용 - 재정렬되지 않음)
            window.originalMapFileArray = fileArray;
            window.currentMapFileArray = fileArray;
            window.fallbackMapFileArray = fallbackArray;

            // 내부 로드 함수 호출
            await this.loadMapInternal(mapFileName, fileArray, 0, fallbackArray);
        },

        // 맵 데이터 로드 (내부용 - 버전 전환 시에도 사용)
        // fallbackArray: kr 파일 배열 (폴백용, 옵션)
        async loadMapInternal(mapFileName, fileArray, versionIndex, fallbackArray = null) {
            try {
                const loadingEl = document.getElementById('loading');
                const loadingText = document.getElementById('loading-text');
                loadingEl.style.display = 'block';

                const lang = getCurrentLanguage();
                if (window.MapsI18n) {
                    loadingText.textContent = window.MapsI18n.getText(lang, 'loading');
                }

                // 현재 언어에 맞는 경로로 시도
                let url = `${getMapDataPath(lang)}${mapFileName}`;
                let response = await fetch(url);
                let loadedLang = lang;
                let actualFileName = mapFileName;

                // 해당 언어 파일이 없으면 kr로 폴백
                if (!response.ok && lang !== 'kr') {
                    // 폴백 파일이 있으면 kr 파일명 + kr 경로 사용
                    const krFileName = fallbackArray && fallbackArray[versionIndex]
                        ? fallbackArray[versionIndex]
                        : mapFileName;
                    console.log(`[Maps] ${lang.toUpperCase()} 맵 데이터 없음, KR로 폴백: ${krFileName}`);
                    url = `${getMapDataPath('kr')}${krFileName}`;
                    response = await fetch(url);
                    loadedLang = 'kr';
                    actualFileName = krFileName;
                }

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                console.log(`[Maps] 맵 데이터 로드됨 (${loadedLang.toUpperCase()}): ${actualFileName}`);

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('응답이 JSON 형식이 아닙니다.');
                }

                const data = await response.json();

                // 맵 예외 처리 적용 (MapExceptionHandling)
                if (window.MapExceptionHandling && window.MapExceptionHandling.applyExceptions) {
                    console.log(`[MapsCore] Calling MapExceptionHandling for ${actualFileName}`);
                    window.MapExceptionHandling.applyExceptions(actualFileName, data);
                } else {
                    console.warn(`[MapsCore] MapExceptionHandling not found or invalid`);
                }

                currentMapData = data;
                currentMapFileName = mapFileName;

                tilesContainer.removeChildren();
                objectsContainer.removeChildren();
                objectSprites = [];

                // 이전 맵의 회전 및 pivot 초기화
                mapContainer.rotation = 0;
                mapContainer.pivot.set(0, 0);

                // 맵 전체 회전 처리
                let mapRotation = 0;
                let rotatedMapSize = data.map_size ? [...data.map_size] : null;

                if (data.rotate !== undefined && data.rotate !== null) {
                    mapRotation = data.rotate;

                    // 맵 크기를 기준으로 pivot 설정 (중앙 기준 회전)
                    if (rotatedMapSize && rotatedMapSize.length >= 2) {
                        const originalWidth = rotatedMapSize[0];
                        const originalHeight = rotatedMapSize[1];

                        // pivot을 맵 중앙으로 설정
                        mapContainer.pivot.set(originalWidth / 2, originalHeight / 2);

                        // 반시계 방향 회전 (PixiJS는 시계 방향이므로 음수로 변환)
                        const rotationRad = -mapRotation * (Math.PI / 180);
                        mapContainer.rotation = rotationRad;

                        // 90도 또는 270도 회전 시 맵 크기 swap
                        const normalizedRotation = ((mapRotation % 360) + 360) % 360;
                        if (normalizedRotation === 90 || normalizedRotation === 270) {
                            rotatedMapSize = [originalHeight, originalWidth];
                        }
                    }
                } else {
                    mapContainer.rotation = 0;
                    mapContainer.pivot.set(0, 0);
                }

                if (window.MapsI18n) {
                    const lang = getCurrentLanguage();
                    loadingText.textContent = window.MapsI18n.getText(lang, 'loadingTiles');
                }
                await this.loadTiles(data.tiles);

                if (window.MapsI18n) {
                    const lang = getCurrentLanguage();
                    loadingText.textContent = window.MapsI18n.getText(lang, 'loadingObjects');
                }

                // objects와 enemies 배열 모두 로드
                const allObjects = [];
                if (data.objects && Array.isArray(data.objects)) {
                    allObjects.push(...data.objects);
                }
                if (data.enemies && Array.isArray(data.enemies)) {
                    allObjects.push(...data.enemies);
                }

                // 맵 회전 정보를 오브젝트 로드에 전달 (오브젝트는 역회전하여 원래 방향 유지)
                await this.loadObjects(allObjects, mapRotation);

                // 저장된 위치가 있으면 복원, 없으면 중앙 정렬
                // 회전된 맵 크기 사용
                const finalMapSize = rotatedMapSize || data.map_size;
                if (!currentMapId || !this.restoreMapPosition(currentMapId)) {
                    this.centerMap(finalMapSize);
                }

                if (window.ObjectFilterPanel) {
                    // objectSprites에서 null이 아닌 유효한 스프라이트만 필터링
                    const validSprites = objectSprites.filter(sprite => sprite !== null);
                    const validObjectData = validSprites.map(sprite => ({
                        image: sprite.objectImage,
                        sn: sprite.objectSn,
                        debugInfo: sprite.debugInfo
                    }));
                    window.ObjectFilterPanel.updateFilterUI(validObjectData);
                }

                // 맵 버전 UI
                // 배열이 있고 2개 이상인 경우, 배열의 파일들을 버전으로 사용
                if (fileArray.length > 1) {
                    // 배열 인덱스를 버전으로 사용 (0부터 시작)
                    const versions = fileArray.map((file, index) => ({
                        version: index,
                        file: file,
                        index: index
                    }));

                    mapVersions = versions.map(v => v.version);
                    currentMapVersion = versionIndex;
                    this.createVersionSelectorFromArray(versions, versionIndex);
                } else {
                    // 파일이 1개만 있으면 버전 선택 UI 제거
                    const existing = document.getElementById('map-version-selector');
                    if (existing) existing.remove();
                }

                loadingEl.style.display = 'none';
            } catch (error) {
                console.error('맵 로드 실패:', error);
                const loadingText = document.getElementById('loading-text');
                if (loadingText) {
                    const currentLang = getCurrentLanguage();
                    const message = getMapsText(currentLang, 'mapLoadError', '맵을 불러오는데 실패했습니다.');
                    loadingText.textContent = `${message} (${error.message})`;
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
            const lang = getCurrentLanguage();

            for (const submap of submaps) {
                // 현재 언어에 맞는 파일 배열 선택
                let files = null;
                let usedLang = lang;

                if (lang === 'en' && submap.file_en && submap.file_en.length > 0) {
                    files = submap.file_en;
                } else if (lang === 'jp' && submap.file_jp && submap.file_jp.length > 0) {
                    files = submap.file_jp;
                } else if (submap.file && submap.file.length > 0) {
                    files = submap.file;
                    usedLang = 'kr';
                }

                if (files) {
                    const fileArray = Array.isArray(files) ? files : [files];
                    for (let i = 0; i < fileArray.length; i++) {
                        const file = fileArray[i];
                        if (file && file.trim() !== '') {
                            // 현재 언어 경로로 확인
                            let fileUrl = `${getMapDataPath(usedLang)}${file}`;
                            let exists = await this.checkFileExists(fileUrl);

                            // 없으면 kr 파일명 + kr 경로로 폴백
                            if (!exists && usedLang !== 'kr' && submap.file && submap.file.length > 0) {
                                const krFiles = Array.isArray(submap.file) ? submap.file : [submap.file];
                                const krFile = krFiles[i] || krFiles[0];
                                if (krFile && krFile.trim() !== '') {
                                    fileUrl = `${getMapDataPath('kr')}${krFile}`;
                                    exists = await this.checkFileExists(fileUrl);
                                    if (exists) {
                                        // kr 파일로 폴백 성공
                                        return { ...submap, file: krFiles, _fallbackLang: 'kr' };
                                    }
                                }
                            }

                            if (exists) {
                                return { ...submap, file: fileArray, _usedLang: usedLang };
                            }
                        }
                    }
                }
                if (submap.submaps && submap.submaps.length > 0) {
                    const found = await this.findFirstAvailableSubmap(submap.submaps);
                    if (found) return found;
                }
            }
            return null;
        },

        // 디버그 패널 표시 (타일/오브젝트 공통)
    };

    // 초기화 함수 호출
    window.MapsCore.init();
})();
