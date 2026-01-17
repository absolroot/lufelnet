const fs = require('fs');
const path = require('path');

// palace 폴더에서 모든 _data.json 파일 찾기
function findPalaceFiles(dir, baseDir = dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findPalaceFiles(fullPath, baseDir));
        } else if (entry.isFile() && entry.name.endsWith('_data.json')) {
            // baseDir 기준 상대 경로로 변환
            const relativePath = path.relative(baseDir, fullPath);
            // Windows 경로를 Unix 스타일로 변환
            const normalizedPath = relativePath.replace(/\\/g, '/');
            files.push(normalizedPath);
        }
    }
    
    return files;
}

// maps_list.json에서 palace 관련 파일 경로 추출
function extractPalaceFilesFromList(mapsList) {
    const files = [];
    
    function traverse(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(item => traverse(item));
        } else if (obj && typeof obj === 'object') {
            if (obj.file && obj.file.startsWith('palace/')) {
                // palace/ 접두사 제거
                const relativePath = obj.file.replace(/^palace\//, '');
                files.push(relativePath);
            }
            Object.values(obj).forEach(value => {
                if (value && typeof value === 'object') {
                    traverse(value);
                }
            });
        }
    }
    
    traverse(mapsList);
    return files;
}

// 메인 실행
const palaceDir = path.join(__dirname, 'map_json', 'palace');
const mapsListPath = path.join(__dirname, 'maps_list.json');

console.log('=== Palace 파일 비교 ===\n');

// 1. 실제 파일 목록
const actualFiles = findPalaceFiles(palaceDir);
const actualFilesSet = new Set(actualFiles.map(f => f.toLowerCase()));

console.log(`실제 파일 개수: ${actualFiles.length}`);

// 2. maps_list.json에서 추출
const mapsListData = JSON.parse(fs.readFileSync(mapsListPath, 'utf-8'));
const listFiles = extractPalaceFilesFromList(mapsListData);
const listFilesSet = new Set(listFiles.map(f => f.toLowerCase()));

console.log(`maps_list.json에 있는 파일 개수: ${listFiles.length}\n`);

// 3. 비교
const onlyInFolder = actualFiles.filter(f => !listFilesSet.has(f.toLowerCase()));
const onlyInList = listFiles.filter(f => !actualFilesSet.has(f.toLowerCase()));

console.log('=== palace 폴더에는 있지만 maps_list.json에는 없는 파일 ===');
if (onlyInFolder.length === 0) {
    console.log('없음');
} else {
    onlyInFolder.forEach(f => console.log(`  - ${f}`));
}

console.log('\n=== maps_list.json에는 있지만 palace 폴더에는 없는 파일 ===');
if (onlyInList.length === 0) {
    console.log('없음');
} else {
    onlyInList.forEach(f => console.log(`  - ${f}`));
}

console.log('\n=== 요약 ===');
console.log(`폴더에만 있는 파일: ${onlyInFolder.length}개`);
console.log(`리스트에만 있는 파일: ${onlyInList.length}개`);
