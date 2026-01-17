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
    let currentMapFileName = null; // 현재 로드된 맵 파일명
    let mapVersions = []; // 사용 가능한 맵 버전 목록
    let currentMapVersion = 0; // 현재 선택된 버전

    // MapsCore 클래스
    window.MapsCore = {
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
                            sprite.x = tile.position[0] + px;
                            sprite.y = tile.position[1] + py;

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

                    // 클릭 이벤트 비활성화
                    sprite.eventMode = 'none';
                    sprite.cursor = 'default';
                    /* 타일 디버그 모드 - 주석处理
                    sprite.on('pointerdown', function() {
                        console.log('=== TILE DEBUG INFO ===');
                        console.log('Index:', this.debugInfo.index);
                        console.log('Image:', this.debugInfo.image);
                        console.log('Original Position (JSON):', this.debugInfo.originalPosition);
                        console.log('Rotate:', this.debugInfo.rotate);
                        console.log('Rotate Pivot:', this.debugInfo.rotate_pivot);
                        console.log('Ratio:', this.debugInfo.ratio);
                        console.log('Texture Size:', this.debugInfo.textureSize);
                        console.log('Scaled Size:', this.debugInfo.scaledSize);
                        console.log('Computed:', this.debugInfo.computed);
                        console.log('Final Sprite Position:', [this.x, this.y]);
                        console.log('Sprite Rotation (deg):', this.rotation * 180 / Math.PI);
                        console.log('Sprite Pivot:', [this.pivot.x, this.pivot.y]);
                        console.log('=======================');
                        
                        // 화면에 디버그 패널 표시
                        if (window.MapsDebug) {
                            window.MapsDebug.showDebugPanel(this.debugInfo, this);
                        }
                    });
                    */

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

        // Python _draw_entities 함수를 정확히 재현
        async loadObjects(objects) {
            const loadingText = document.getElementById('loading-text');
            const total = objects.length;
            let loaded = 0;
            const isMementosMap = currentMapFileName && currentMapFileName.includes('mementos');

            const self = this;
            const promises = objects.map(async (obj, objIndex) => {
                try {
                    const texture = await this.loadTexture(`${ICON_PATH}${obj.image}`);
                    const sprite = new PIXI.Sprite(texture);
                    
                    // Python: image_scale = (minimap_size[0] // 45) / entity_img.width
                    // 메멘토스 맵의 경우 Python 로직으로 위치 계산용 ratio 계산
                    let positionRatio = obj.ratio || 1; // 위치 계산용 ratio
                    if (isMementosMap && currentMapData && currentMapData.map_size) {
                        // Python과 동일한 계산: (minimap_size[0] // 45) / entity_img.width
                        // map_size는 [width, height] 배열 또는 {width, height} 객체
                        const minimapWidth = Array.isArray(currentMapData.map_size) 
                            ? currentMapData.map_size[0] 
                            : (currentMapData.map_size.width || currentMapData.map_size[0] || 1);
                        positionRatio = Math.floor(minimapWidth / 45) / texture.width;
                    }
                    
                    // 최종 scale은 JSON의 obj.ratio 사용
                    const finalRatio = obj.ratio || 1;
                    
                    // 디버그 정보 저장
                    const debugInfo = {
                        index: objIndex,
                        image: obj.image,
                        originalPosition: [...obj.position],
                        rotate: obj.rotate || 0,
                        rotate_pivot: obj.rotate_pivot || null,
                        ratio: finalRatio,
                        positionRatio: positionRatio, // 위치 계산용
                        textureSize: [texture.width, texture.height],
                        scaledSize: [Math.round(texture.width * finalRatio), Math.round(texture.height * finalRatio)],
                        computed: {}
                    };
                    

                    const rot_deg = obj.rotate || 0;
                    const rot_deg_rad = rot_deg * (Math.PI / 180);
                    
                    // 원본 이미지 크기 (텍스처 크기)
                    const originalW = texture.width;
                    const originalH = texture.height;
                    
                    // Python: rotate_pivot은 항상 [0.5, 0.5] (중심점)
                    // Python PIL rotate(expand=True)는 중심점 기준으로 회전하고 expand
                    // 회전 후 확장된 이미지 크기 계산 (원본 크기 기준)
                    let rotatedW = originalW;
                    let rotatedH = originalH;
                    
                    if (Math.abs(rot_deg) >= 0.01) {
                        // PIL rotate(expand=True)는 회전 후 bounding box 크기
                        // 중심점 기준 회전이므로, 네 모서리를 회전시켜 bounding box 구하기
                        const corners = [
                            [-originalW / 2, -originalH / 2],
                            [originalW / 2, -originalH / 2],
                            [originalW / 2, originalH / 2],
                            [-originalW / 2, originalH / 2]
                        ];
                        
                        const cos = Math.cos(rot_deg_rad);
                        const sin = Math.sin(rot_deg_rad);
                        
                        const rotatedCorners = corners.map(([x, y]) => [
                            x * cos - y * sin,
                            x * sin + y * cos
                        ]);
                        
                        const xs = rotatedCorners.map(c => c[0]);
                        const ys = rotatedCorners.map(c => c[1]);
                        rotatedW = Math.max(...xs) - Math.min(...xs);
                        rotatedH = Math.max(...ys) - Math.min(...ys);
                    }
                    
                    // Python: entity_img.resize((int(entity_img.width * image_scale), ...))
                    // 회전 후 리사이즈된 최종 크기 (위치 계산용 - positionRatio 사용)
                    const finalW = Math.round(rotatedW * positionRatio);
                    const finalH = Math.round(rotatedH * positionRatio);
                    
                    // 디버그 정보 추가
                    debugInfo.computed = {
                        branch: 'standard',
                        originalW, originalH,
                        rotatedW, rotatedH,
                        finalW, finalH,
                        rot_deg
                    };
                    
                    // Python: rotate_pivot = [0.5, 0.5] (항상 중심)
                    sprite.anchor.set(0.5, 0.5);
                    
                    // Python: final_x = calc_x - entity_img.width // 2
                    //         final_y = minimap_size[1] - calc_y - entity_img.height // 2
                    // obj.position은 회전+리사이즈된 이미지의 좌상단 (Y축 반전 적용됨)
                    // Unity Y축: 위로 증가, PixiJS Y축: 아래로 증가
                    // Python의 minimap_size[1] - calc_y는 Y축 반전이므로
                    // obj.position[1]은 이미 Y축 반전이 적용된 값
                    // PixiJS anchor가 0.5, 0.5이므로 중심점은 좌상단 + (finalW/2, finalH/2)
                    sprite.x = obj.position[0] + finalW / 2;
                    sprite.y = obj.position[1] + finalH / 2;
                    
                    // Python: entity_img.rotate(rot_deg, expand=True)
                    // PIL rotate는 양수 방향이 시계 방향
                    // Unity는 음수 방향이 시계 방향이므로 부호 반대
                    // 하지만 JSON의 rotate는 이미 Python에서 계산된 값이므로 그대로 사용
                    // Python 코드를 보면 rot_deg를 그대로 rotate()에 전달하므로
                    // Unity로 변환하려면 부호 반대 필요
                    sprite.rotation = -rot_deg * (Math.PI / 180);
                    
                    // 위치 계산 완료 후, JSON의 obj.ratio로 scale 재설정 (중앙 고정)
                    // anchor가 0.5, 0.5이므로 중앙이 고정되어 위치는 그대로 유지됨
                    
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
                    
                    sprite.scale.set(adjustedRatio);
                    
                    debugInfo.computed.finalPos = [sprite.x, sprite.y];
                    debugInfo.computed.positionRatio = positionRatio;
                    debugInfo.computed.finalRatio = finalRatio;
                    debugInfo.computed.adjustedRatio = adjustedRatio;
                    
                    // 디버그 정보를 sprite에 저장
                    sprite.debugInfo = debugInfo;
                    
                    // sn 정보 저장
                    sprite.objectSn = obj.sn || null;
                    
                    // enemy_data 저장
                    if (obj.enemy_data) {
                        sprite.debugInfo.enemyData = obj.enemy_data;
                    }
                    
                    // 디버그 정보를 전역 저장소에 추가
                    if (window.MapsDebug) {
                        window.MapsDebug.addObjectDebugInfo({
                            index: debugInfo.index,
                            image: debugInfo.image,
                            originalPosition: debugInfo.originalPosition,
                            rotate: debugInfo.rotate,
                            rotate_pivot: debugInfo.rotate_pivot,
                            ratio: debugInfo.ratio,
                            textureSize: debugInfo.textureSize,
                            scaledSize: debugInfo.scaledSize,
                            computed: debugInfo.computed,
                            finalSpritePosition: [sprite.x, sprite.y],
                            spriteRotationDeg: sprite.rotation * 180 / Math.PI,
                            spritePivot: [sprite.pivot.x, sprite.pivot.y],
                            spriteAnchor: [sprite.anchor.x, sprite.anchor.y],
                            spriteScale: [sprite.scale.x, sprite.scale.y]
                        });
                    }
                    
                    // 저장된 클릭 상태 확인 및 적용 (비대화형 아이콘 제외)
                    const isNonInteractive = this.isNonInteractiveIcon(obj.image);
                    console.log(`오브젝트: ${obj.image}, 비대화형: ${isNonInteractive}`);
                    
                    if (sprite.objectSn && window.ObjectClickHandler && !isNonInteractive) {
                        window.ObjectClickHandler.restoreClickedState(sprite);
                    }
                    
                    // 클릭 이벤트 활성화 (비대화형 아이콘 제외)
                    if (!isNonInteractive) {
                        sprite.eventMode = 'static';
                        sprite.cursor = 'pointer';
                        sprite.on('pointerdown', function() {
                            if (this.objectSn && window.ObjectClickHandler) {
                                window.ObjectClickHandler.toggleObjectClicked(this);
                            }
                            
                            // 디버그: 파일 이름만 출력
                            console.log('Object clicked:', this.debugInfo.image);
                            
                            // 상세 디버그 정보 (주석처리)
                            // console.log('=== OBJECT DEBUG INFO (CLICKED) ===');
                            // console.log('Index:', this.debugInfo.index);
                            // console.log('Image:', this.debugInfo.image);
                            // console.log('SN:', this.objectSn);
                            // console.log('Original Position (JSON):', this.debugInfo.originalPosition);
                            // console.log('Rotate:', this.debugInfo.rotate);
                            // console.log('Rotate Pivot:', this.debugInfo.rotate_pivot);
                            // console.log('Ratio:', this.debugInfo.ratio);
                            // console.log('Texture Size:', this.debugInfo.textureSize);
                            // console.log('Scaled Size:', this.debugInfo.scaledSize);
                            // console.log('Computed:', this.debugInfo.computed);
                            // console.log('Final Sprite Position:', [this.x, this.y]);
                            // console.log('Sprite Rotation (deg):', this.rotation * 180 / Math.PI);
                            // console.log('Sprite Pivot:', [this.pivot.x, this.pivot.y]);
                            // console.log('Sprite Anchor:', [this.anchor.x, this.anchor.y]);
                            // console.log('Sprite Scale:', [this.scale.x, this.scale.y]);
                            // console.log('=======================');
                            
                            // 화면에 디버그 패널 표시
                            // if (window.MapsDebug) {
                            //     window.MapsDebug.showDebugPanel(this.debugInfo, this);
                            // }
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
                    if (objectType.endsWith('.png')) {
                        objectType = objectType.replace('.png', '');
                    }
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
            if (!currentMapFileName) return;
            
            // 현재 파일 배열이 저장되어 있는지 확인
            const currentFileArray = window.currentMapFileArray;
            if (Array.isArray(currentFileArray) && currentFileArray.length > 0) {
                // 버전은 배열 인덱스이므로 직접 접근
                if (version >= 0 && version < currentFileArray.length) {
                    const versionFile = currentFileArray[version];
                    // 해당 버전 파일을 첫 번째로 하여 배열 재정렬
                    const reorderedArray = [versionFile, ...currentFileArray.filter(f => f !== versionFile)];
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
                    
                    await this.loadMap(reorderedArray);
                    
                    // 버전 선택 UI 업데이트
                    const versions = currentFileArray.map((file, index) => ({
                        version: index,
                        file: file,
                        index: index
                    }));
                    this.createVersionSelectorFromArray(versions, version);
                    return;
                }
            }
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
                
                if (index < versions.length - 1) {
                    const separator = document.createElement('span');
                    separator.className = 'version-separator';
                    separator.textContent = '|';
                    selector.appendChild(separator);
                }
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

        // 맵 데이터 로드 (file 배열 또는 단일 파일명 지원)
        async loadMap(mapFileNameOrArray) {
            try {
                const loadingEl = document.getElementById('loading');
                const loadingText = document.getElementById('loading-text');
                loadingEl.style.display = 'block';
                
                if (window.MapsI18n) {
                    const lang = getCurrentLanguage();
                    loadingText.textContent = window.MapsI18n.getText(lang, 'loading');
                }
                
                // 배열인 경우 첫 번째 파일 사용
                let mapFileName;
                let fileArray = [];
                if (Array.isArray(mapFileNameOrArray)) {
                    fileArray = mapFileNameOrArray.filter(f => f && f.trim() !== '');
                    if (fileArray.length === 0) {
                        throw new Error('유효한 맵 파일이 없습니다.');
                    }
                    mapFileName = fileArray[0];
                } else {
                    mapFileName = mapFileNameOrArray;
                }
                
                let url;
                if (mapFileName.includes('/')) {
                    url = `${MAP_DATA_PATH}${mapFileName}`;
                } else {
                    url = `${MAP_DATA_PATH}${mapFileName}`;
                }
                
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('응답이 JSON 형식이 아닙니다.');
                }
                
                const data = await response.json();
                currentMapData = data;
                currentMapFileName = mapFileName;
                
                // 파일 배열 저장 (버전 선택용)
                if (fileArray.length > 0) {
                    window.currentMapFileArray = fileArray;
                } else {
                    window.currentMapFileArray = [mapFileName];
                }

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
                
                // objects와 enemies 배열 모두 로드
                const allObjects = [];
                if (data.objects && Array.isArray(data.objects)) {
                    allObjects.push(...data.objects);
                }
                if (data.enemies && Array.isArray(data.enemies)) {
                    allObjects.push(...data.enemies);
                }
                
                await this.loadObjects(allObjects);

                this.centerMap(data.map_size);

                if (window.ObjectFilterPanel) {
                    window.ObjectFilterPanel.updateFilterUI(allObjects);
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
                    
                    const currentIndex = fileArray.indexOf(mapFileName);
                    const currentVersion = currentIndex >= 0 ? currentIndex : 0;
                    mapVersions = versions.map(v => v.version);
                    currentMapVersion = currentVersion;
                    this.createVersionSelectorFromArray(versions, currentVersion);
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
                    // file이 배열인 경우 첫 번째 파일 확인
                    const files = Array.isArray(submap.file) ? submap.file : [submap.file];
                    for (const file of files) {
                        if (file && file.trim() !== '') {
                            const fileUrl = `${MAP_DATA_PATH}${file}`;
                            const exists = await this.checkFileExists(fileUrl);
                            if (exists) {
                                // 배열인 경우 첫 번째 파일을 사용하도록 submap 복사
                                return { ...submap, file: files };
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