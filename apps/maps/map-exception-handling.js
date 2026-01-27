
(function () {
    'use strict';
    console.log('[MapExceptionHandling] Script loaded');

    window.MapExceptionHandling = {
        applyExceptions(mapFileName, mapData) {
            // Target maps (only 0 and 1 versions as requested)
            const targetMaps = [
                "palace/아카시 팰리스/3장 컨트롤 센터 중정 광장_0_data.json",
                "palace/아카시 팰리스/3장 컨트롤 센터 중정 광장_1_data.json",
                "palace/Akashi's Palace/Central Plaza_0_data.json",
                "palace/Akashi's Palace/Central Plaza_1_data.json",
                "palace/アカシ・パレス/中庭広場_0_data.json",
                "palace/アカシ・パレス/中庭広場_1_data.json"
            ];

            // Helper to normalize paths for comparison
            // 1. Decode URI components (handles %20 etc)
            // 2. Replace backslashes with forward slashes
            // 3. Remove leading slashes
            const normalize = (path) => {
                try {
                    return decodeURIComponent(path).replace(/\\/g, '/').replace(/^\/+/, '');
                } catch (e) {
                    return path.replace(/\\/g, '/').replace(/^\/+/, '');
                }
            };

            const normalizedInput = normalize(mapFileName);

            console.log(`[MapExceptionHandling] Checking: ${mapFileName}`);
            console.log(`[MapExceptionHandling] Normalized Input: ${normalizedInput}`);

            // Check if normalizedInput ends with any of the normalized target paths
            const isTargetMap = targetMaps.some(target => {
                const normalizedTarget = normalize(target);
                const match = normalizedInput.endsWith(normalizedTarget);
                if (match) {
                    console.log(`[MapExceptionHandling] Matched target: ${target}`);
                }
                return match;
            });

            if (isTargetMap && mapData && mapData.tiles) {
                console.log(`[MapExceptionHandling] Target map matched. Checking tiles...`);
                let applied = false;
                mapData.tiles.forEach((tile, index) => {
                    // Check for exactly [0, 0]
                    if (tile.position && tile.position[0] === 0 && tile.position[1] === 0) {
                        console.log(`[MapExceptionHandling] Tile ${index} at [0,0] found. Applying fix.`);
                        tile.position = [0, 357];
                        applied = true;
                    }
                });

                if (applied) {
                    console.log(`[MapExceptionHandling] Applied fix for ${mapFileName}: Changed tile position [0,0] to [0,357]`);
                } else {
                    // Log if target map found but no tile at [0,0] matched (for debugging)
                    console.log(`[MapExceptionHandling] Target map found (${mapFileName}) but no tile at [0,0] needed fixing.`);
                }
            } else {
                if (!isTargetMap) console.log(`[MapExceptionHandling] Not a target map (for tile fix).`);
            }

            // ---------------------------------------------------------
            // Object Injection Logic for Central Plaza 2 maps
            // ---------------------------------------------------------
            const targetMapsForObjects = [
                "palace/아카시 팰리스/3장 컨트롤 센터 중정 광장_2_data.json",
                "palace/Akashi's Palace/Central Plaza_2_data.json",
                "palace/アカシ・パレス/中庭広場_2_data.json"
            ];

            const isTargetMapForObjects = targetMapsForObjects.some(target => {
                const normalizedTarget = normalize(target);
                return normalizedInput.endsWith(normalizedTarget);
            });

            if (isTargetMapForObjects && mapData) {
                console.log(`[MapExceptionHandling] Checking objects for ${mapFileName}...`);

                // Ensure objects array exists
                if (!mapData.objects) {
                    mapData.objects = [];
                }

                // Check if target image already exists
                const targetImage = "yishijie-icon-box-hexin-new.png";
                const hasTargetImage = mapData.objects.some(obj => obj.image === targetImage);

                if (!hasTargetImage) {
                    console.log(`[MapExceptionHandling] Missing ${targetImage} in ${mapFileName}. Injecting objects...`);

                    const newObjects = [
                        {
                            "sn": 9009999,
                            "image": "yishijie-icon-box-hexin-new.png",
                            "position": [130, 530],
                            "ratio": 0.7777777777777778,
                            "rotate": 0.0,
                            "rotate_pivot": [0.5, 0.5],
                            "enemy_data": null
                        },
                        {
                            "sn": 8009999,
                            "image": "yishijie-icon-box-hexin-new.png",
                            "position": [610, 500],
                            "ratio": 0.7777777777777778,
                            "rotate": 0.0,
                            "rotate_pivot": [0.5, 0.5],
                            "enemy_data": null
                        }
                    ];

                    mapData.objects.push(...newObjects);
                    console.log(`[MapExceptionHandling] Injected 2 objects into ${mapFileName}.`);
                } else {
                    console.log(`[MapExceptionHandling] ${targetImage} already exists in ${mapFileName}. No injection needed.`);
                }
            }

            return mapData;
        }
    };
})();
