const fs = require('fs');
const path = require('path');

// maps_list.json 파일 읽기
const mapsListPath = 'c:\\Users\\super\\Desktop\\P5X\\lufelnet\\apps\\maps\\maps_list.json';
const mapsList = JSON.parse(fs.readFileSync(mapsListPath, 'utf8'));

// 영어/일본어 맵 파일 경로
const enMapDir = 'c:\\Users\\super\\Desktop\\P5X\\lufelnet\\apps\\maps\\map_json\\en';
const jpMapDir = 'c:\\Users\\super\\Desktop\\P5X\\lufelnet\\apps\\maps\\map_json\\jp';

// 모든 영어/일본어 파일 목록 가져오기
function getAllMapFiles(dir) {
    const files = [];
    
    function traverseDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                traverseDirectory(fullPath);
            } else if (item.endsWith('_data.json')) {
                files.push(fullPath);
            }
        }
    }
    
    traverseDirectory(dir);
    return files;
}

const enFiles = getAllMapFiles(enMapDir);
const jpFiles = getAllMapFiles(jpMapDir);

// 파일 경로에서 상대 경로 추출
function extractRelativePath(fullPath, baseDir) {
    return fullPath.replace(baseDir + '\\', '').replace(/\\/g, '/');
}

// 모든 맵 항목에 대해 file_en, file_jp 추가
function processMaps(maps) {
    for (const map of maps) {
        if (map.categories) {
            for (const category of map.categories) {
                processCategory(category);
            }
        }
    }
}

function processCategory(category) {
    if (category.submaps) {
        for (const submap of category.submaps) {
            processSubmap(submap);
        }
    } else {
        processSubmap(category);
    }
}

function processSubmap(submap) {
    if (submap.submaps) {
        for (const nestedSubmap of submap.submaps) {
            processSubmap(nestedSubmap);
        }
    } else {
        addLanguageFiles(submap);
    }
}

function addLanguageFiles(submap) {
    if (!submap.name_en && !submap.name_jp) {
        return; // name_en이나 name_jp가 없으면 건너뜀
    }
    
    // 기존 파일 경로에서 기본 이름 추출
    const originalFiles = submap.file || [];
    const baseNames = originalFiles.map(file => {
        // 경로에서 파일명만 추출 (확장자 제외)
        const fileName = path.basename(file, '_data.json');
        return fileName;
    });
    
    // 영어 파일 찾기
    const enMatches = [];
    for (const baseName of baseNames) {
        const enMatches = enFiles.filter(file => {
            const fileName = path.basename(file, '_data.json');
            return fileName.includes(baseName) || baseName.includes(fileName);
        });
        enMatches.push(...enMatches);
    }
    
    // 일본어 파일 찾기
    const jpMatches = [];
    for (const baseName of baseNames) {
        const jpMatches = jpFiles.filter(file => {
            const fileName = path.basename(file, '_data.json');
            return fileName.includes(baseName) || baseName.includes(fileName);
        });
        jpMatches.push(...jpMatches);
    }
    
    // 중복 제거
    const uniqueEnFiles = [...new Set(enMatches)];
    const uniqueJpFiles = [...new Set(jpMatches)];
    
    // file_en, file_jp 추가
    if (uniqueEnFiles.length > 0) {
        submap.file_en = uniqueEnFiles.map(file => extractRelativePath(file, enMapDir));
    }
    
    if (uniqueJpFiles.length > 0) {
        submap.file_jp = uniqueJpFiles.map(file => extractRelativePath(file, jpMapDir));
    }
}

// 처리 시작
processMaps(mapsList.maps);

// 결과 저장
const outputPath = 'c:\\Users\\super\\Desktop\\P5X\\lufelnet\\apps\\maps\\maps_list_updated.json';
fs.writeFileSync(outputPath, JSON.stringify(mapsList, null, 2), 'utf8');

console.log('처리 완료! 결과가 maps_list_updated.json에 저장되었습니다.');
console.log(`영어 파일 수: ${enFiles.length}`);
console.log(`일본어 파일 수: ${jpFiles.length}`);

// 매칭된 항목 통계
let enMatchesCount = 0;
let jpMatchesCount = 0;

function countMatches(maps) {
    for (const map of maps) {
        if (map.categories) {
            for (const category of map.categories) {
                countMatchesInCategory(category);
            }
        }
    }
}

function countMatchesInCategory(category) {
    if (category.submaps) {
        for (const submap of category.submaps) {
            countMatchesInSubmap(submap);
        }
    } else {
        countMatchesInSubmap(category);
    }
}

function countMatchesInSubmap(submap) {
    if (submap.submaps) {
        for (const nestedSubmap of submap.submaps) {
            countMatchesInSubmap(nestedSubmap);
        }
    } else {
        if (submap.file_en) enMatchesCount++;
        if (submap.file_jp) jpMatchesCount++;
    }
}

countMatches(mapsList.maps);
console.log(`file_en이 추가된 항목 수: ${enMatchesCount}`);
console.log(`file_jp이 추가된 항목 수: ${jpMatchesCount}`);
