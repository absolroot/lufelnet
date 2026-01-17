// Maps Debug - 디버그 관련 기능

(function() {
    'use strict';

    // 전역 디버그 정보 저장소
    window.MapsDebug = {
        objectDebugInfo: [],
        tileDebugInfo: [],

        // 디버그 정보 초기화
        clear() {
            this.objectDebugInfo = [];
            this.tileDebugInfo = [];
        },

        // 오브젝트 디버그 정보 추가
        addObjectDebugInfo(info) {
            this.objectDebugInfo.push(info);
        },

        // 타일 디버그 정보 추가
        addTileDebugInfo(info) {
            this.tileDebugInfo.push(info);
        },

        // 디버그 패널 표시
        showDebugPanel(debugInfo, sprite) {
            // 기존 패널 제거
            const existingPanel = document.getElementById('tile-debug-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'tile-debug-panel';
            panel.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.9);
                color: #0f0;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                max-width: 450px;
                max-height: 80vh;
                overflow-y: auto;
                border: 1px solid #0f0;
            `;

            const formatValue = (val) => {
                if (Array.isArray(val)) return `[${val.map(v => typeof v === 'number' ? v.toFixed(2) : v).join(', ')}]`;
                if (typeof val === 'number') return val.toFixed(2);
                if (typeof val === 'object' && val !== null) return JSON.stringify(val, null, 2);
                return String(val);
            };

            // 타일인지 오브젝트인지 구분
            const isObject = sprite.objectType !== undefined;
            const title = isObject ? 'OBJECT DEBUG' : 'TILE DEBUG';

            let html = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="color: #ff0; font-size: 14px;">${title} #${debugInfo.index}</strong>
                    <button id="close-debug-panel" style="background: #f00; color: #fff; border: none; padding: 2px 8px; cursor: pointer;">X</button>
                </div>
                <hr style="border-color: #333;">
                <div><span style="color: #aaa;">Image:</span> ${debugInfo.image}</div>
                <div><span style="color: #aaa;">JSON Position:</span> ${formatValue(debugInfo.originalPosition)}</div>
                <div><span style="color: #aaa;">Rotate:</span> <span style="color: ${debugInfo.rotate !== 0 ? '#ff0' : '#0f0'}">${debugInfo.rotate}°</span></div>
                <div><span style="color: #aaa;">Rotate Pivot:</span> ${formatValue(debugInfo.rotate_pivot)}</div>
                <div><span style="color: #aaa;">Ratio:</span> ${debugInfo.ratio}</div>
                <div><span style="color: #aaa;">Texture Size:</span> ${formatValue(debugInfo.textureSize)}</div>
                <div><span style="color: #aaa;">Scaled Size:</span> ${formatValue(debugInfo.scaledSize)}</div>
                <hr style="border-color: #333;">
                <div style="color: #0ff;"><strong>Computed Values:</strong></div>
                <div><span style="color: #aaa;">Branch:</span> <span style="color: #ff0">${debugInfo.computed.branch || 'N/A'}</span></div>
            `;

            if (debugInfo.computed.px !== undefined) {
                html += `
                    <div><span style="color: #aaa;">px, py:</span> ${formatValue([debugInfo.computed.px, debugInfo.computed.py])}</div>
                    <div><span style="color: #aaa;">rot_deg:</span> ${debugInfo.computed.rot_deg}</div>
                    <div><span style="color: #aaa;">new_w, new_h:</span> ${formatValue([debugInfo.computed.new_w, debugInfo.computed.new_h])}</div>
                    <div><span style="color: #aaa;">paste_x, paste_y:</span> ${formatValue([debugInfo.computed.paste_x, debugInfo.computed.paste_y])}</div>
                    <div><span style="color: #aaa;">Pivot (texture):</span> ${formatValue(debugInfo.computed.pivotTexture)}</div>
                `;
            }

            if (debugInfo.computed.expandedSize) {
                html += `
                    <div><span style="color: #aaa;">pil_angle:</span> ${debugInfo.computed.pil_angle}</div>
                    <div><span style="color: #aaa;">center:</span> ${formatValue(debugInfo.computed.center)}</div>
                    <div><span style="color: #aaa;">Expanded Size:</span> <span style="color: #f0f">${formatValue(debugInfo.computed.expandedSize)}</span></div>
                `;
            }

            if (debugInfo.computed.rotatedW !== undefined) {
                html += `
                    <div><span style="color: #aaa;">Rotated Size:</span> ${formatValue([debugInfo.computed.rotatedW, debugInfo.computed.rotatedH])}</div>
                    <div><span style="color: #aaa;">Final Size:</span> ${formatValue([debugInfo.computed.finalW, debugInfo.computed.finalH])}</div>
                `;
            }

            html += `
                <hr style="border-color: #333;">
                <div style="color: #f80;"><strong>Final Sprite:</strong></div>
                <div><span style="color: #aaa;">Position:</span> <span style="color: #0f0">${formatValue([sprite.x, sprite.y])}</span></div>
                <div><span style="color: #aaa;">Rotation:</span> ${(sprite.rotation * 180 / Math.PI).toFixed(2)}°</div>
                <div><span style="color: #aaa;">Pivot:</span> ${formatValue([sprite.pivot.x, sprite.pivot.y])}</div>
                <div><span style="color: #aaa;">Anchor:</span> ${formatValue([sprite.anchor.x, sprite.anchor.y])}</div>
                <div><span style="color: #aaa;">Scale:</span> ${formatValue([sprite.scale.x, sprite.scale.y])}</div>
                ${isObject ? `<div><span style="color: #aaa;">Object Type:</span> ${sprite.objectType}</div>` : ''}
                <hr style="border-color: #333;">
                <div style="color: #888; font-size: 10px;">클릭으로 패널 닫기 또는 다른 ${isObject ? '오브젝트' : '타일'} 클릭</div>
            `;

            panel.innerHTML = html;
            document.body.appendChild(panel);

            document.getElementById('close-debug-panel').addEventListener('click', () => panel.remove());
        },

        // 디버그 정보 다운로드
        downloadDebugInfo(type = 'objects') {
            const debugInfoArray = type === 'objects' ? this.objectDebugInfo : this.tileDebugInfo;
            
            if (debugInfoArray.length === 0) {
                console.warn(`다운로드할 ${type} 디버그 정보가 없습니다.`);
                return;
            }

            const currentMapFileName = window.currentMapFileName || 'unknown';
            const debugData = {
                mapFileName: currentMapFileName,
                type: type,
                totalItems: debugInfoArray.length,
                items: debugInfoArray
            };
            
            const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}-debug-${currentMapFileName.replace(/[\/\\]/g, '_')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log(`디버그 정보 파일 다운로드 완료: ${debugInfoArray.length}개 ${type}`);
        }
    };

    // 콘솔 명령어 등록
    if (typeof window !== 'undefined') {
        window.downloadObjectDebug = () => window.MapsDebug.downloadDebugInfo('objects');
        window.downloadTileDebug = () => window.MapsDebug.downloadDebugInfo('tiles');
        window.clearDebug = () => window.MapsDebug.clear();
        
        console.log('디버그 명령어:');
        console.log('  downloadObjectDebug() - 오브젝트 디버그 정보 다운로드');
        console.log('  downloadTileDebug() - 타일 디버그 정보 다운로드');
        console.log('  clearDebug() - 디버그 정보 초기화');
    }
})();
