const fs = require('fs');
const path = require('path');

// 공통 이름 부분 추출 (예: "전기 에너지탑 중층"과 "전기 에너지탑 중층 2" -> "전기 에너지탑 중층")
function getCommonName(names) {
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    
    // 숫자로 끝나는 부분 제거 (예: " 2", " 3")
    const cleaned = names.map(n => n.replace(/\s+\d+$/, ''));
    
    // 모든 이름이 같으면 그대로 반환
    if (cleaned.every(n => n === cleaned[0])) {
        return cleaned[0];
    }
    
    // 가장 짧은 이름을 기준으로 공통 부분 찾기
    const shortest = cleaned.reduce((a, b) => a.length < b.length ? a : b);
    let common = shortest;
    
    for (let i = shortest.length; i > 0; i--) {
        const prefix = shortest.substring(0, i);
        if (cleaned.every(n => n.startsWith(prefix))) {
            common = prefix;
            break;
        }
    }
    
    return common.trim();
}

// submaps 배열 처리 (재귀)
function processSubmaps(submaps) {
    if (!Array.isArray(submaps)) return submaps;
    
    const processed = [];
    const groups = new Map(); // baseId -> items[]
    
    // 먼저 모든 항목을 순회하면서 그룹화
    for (const item of submaps) {
        if (!item.id) {
            processed.push(item);
            continue;
        }
        
        // _숫자 패턴 찾기
        const match = item.id.match(/^(.+)_(\d+)$/);
        if (match) {
            const baseId = match[1];
            if (!groups.has(baseId)) {
                groups.set(baseId, []);
            }
            groups.get(baseId).push(item);
        } else {
            // 숫자로 끝나지 않는 항목은 그대로 추가
            processed.push(item);
        }
    }
    
    // 그룹화된 항목들 병합
    for (const [baseId, items] of groups.entries()) {
        // id로 정렬 (숫자 순서대로)
        items.sort((a, b) => {
            const aNum = parseInt(a.id.match(/_(\d+)$/)?.[1] || '0');
            const bNum = parseInt(b.id.match(/_(\d+)$/)?.[1] || '0');
            return aNum - bNum;
        });
        
        // 첫 번째 항목을 기준으로 병합
        const merged = { ...items[0] };
        merged.id = baseId;
        
        // file을 배열로 변환
        const files = items
            .map(item => item.file)
            .filter(file => file && file.trim() !== '');
        
        merged.file = files.length > 0 ? files : (merged.file ? [merged.file] : []);
        
        // name 공통 부분 추출
        const names = items.map(item => item.name).filter(n => n);
        if (names.length > 0) {
            merged.name = getCommonName(names);
        }
        
        // name_en, name_jp도 동일하게 처리
        const namesEn = items.map(item => item.name_en).filter(n => n);
        if (namesEn.length > 0) {
            merged.name_en = getCommonName(namesEn);
        }
        
        const namesJp = items.map(item => item.name_jp).filter(n => n);
        if (namesJp.length > 0) {
            merged.name_jp = getCommonName(namesJp);
        }
        
        // submaps가 있으면 재귀 처리
        if (merged.submaps && Array.isArray(merged.submaps)) {
            merged.submaps = processSubmaps(merged.submaps);
        }
        
        processed.push(merged);
    }
    
    // 숫자로 끝나지 않는 항목들도 file을 배열로 변환
    for (const item of processed) {
        if (item.file && typeof item.file === 'string') {
            item.file = item.file.trim() !== '' ? [item.file] : [];
        } else if (!item.file) {
            item.file = [];
        }
        
        // submaps가 있으면 재귀 처리
        if (item.submaps && Array.isArray(item.submaps)) {
            item.submaps = processSubmaps(item.submaps);
        }
    }
    
    return processed;
}

// 메인 실행
const mapsListPath = path.join(__dirname, 'maps_list.json');
const mapsListData = JSON.parse(fs.readFileSync(mapsListPath, 'utf-8'));

console.log('=== maps_list.json 병합 및 변환 시작 ===\n');

// 각 맵의 categories 처리
if (mapsListData.maps && Array.isArray(mapsListData.maps)) {
    for (const map of mapsListData.maps) {
        if (map.categories && Array.isArray(map.categories)) {
            for (const category of map.categories) {
                if (category.submaps && Array.isArray(category.submaps)) {
                    category.submaps = processSubmaps(category.submaps);
                }
            }
        }
    }
}

// 결과 저장
const outputPath = path.join(__dirname, 'maps_list.json');
fs.writeFileSync(outputPath, JSON.stringify(mapsListData, null, 2), 'utf-8');

console.log('✅ 완료! maps_list.json이 업데이트되었습니다.');
console.log('\n변경 사항:');
console.log('- _1, _2, _3 등으로 끝나는 id를 가진 항목들이 병합되었습니다.');
console.log('- 모든 file 필드가 배열로 변환되었습니다.');
console.log('- name에서 공통 부분만 추출되었습니다.');
