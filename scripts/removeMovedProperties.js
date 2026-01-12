const fs = require('fs');
const path = require('path');
const vm = require('vm');

// characters.js 파일 경로
const charactersFilePath = path.join(__dirname, '..', 'data', 'kr', 'characters', 'characters.js');

// 제거할 속성 목록
const propertiesToRemove = [
    'role',
    'video',
    'video_en',
    'video_jp',
    'main_revelation',
    'sub_revelation',
    'sub_revel2',
    'sub_revel3',
    'sub_revel4',
    'sub_option1',
    'sub_option2',
    'sub_option3',
    'minimum_stats',
    'minimum_stats_glb',
    'battle_plus_stats',
    'battle_plus_stats_en',
    'battle_plus_stats_jp',
    'element_weakness',
    'element_resistance',
    'skill1_lv',
    'skill2_lv',
    'skill3_lv',
    'skill4_lv',
    'skill_priority',
    'mind_stats1',
    'mind_stats2',
    'mind_skill1',
    'mind_skill2'
];

// 파일 읽기
const content = fs.readFileSync(charactersFilePath, 'utf-8');

// JavaScript 코드를 실행하여 characterData 객체 가져오기
const context = { window: { characterData: {}, characterList: {} } };
vm.createContext(context);

try {
    vm.runInContext(content, context);
    const characterData = context.window.characterData;
    const characterList = context.window.characterList;

    // 각 캐릭터에서 제거할 속성들 삭제
    for (const charName in characterData) {
        const charData = characterData[charName];
        propertiesToRemove.forEach(prop => {
            if (charData.hasOwnProperty(prop)) {
                delete charData[prop];
            }
        });
    }

    // JSON 포맷터 - 원본 형식 유지 (4칸 들여쓰기)
    const formatJSON = (obj, indent = 0) => {
        const indentStr = '    '.repeat(indent);
        const nextIndentStr = '    '.repeat(indent + 1);
        
        if (Array.isArray(obj)) {
            // 배열은 한 줄로 표시
            return '[' + obj.map(item => {
                if (typeof item === 'string') {
                    return JSON.stringify(item);
                } else if (typeof item === 'object' && item !== null) {
                    return formatJSON(item, indent);
                }
                return JSON.stringify(item);
            }).join(', ') + ']';
        } else if (obj !== null && typeof obj === 'object') {
            const entries = Object.entries(obj);
            if (entries.length === 0) return '{}';
            
            const lines = entries.map(([key, value]) => {
                const keyStr = JSON.stringify(key);
                let valueStr;
                
                if (Array.isArray(value)) {
                    valueStr = formatJSON(value, indent);
                } else if (value !== null && typeof value === 'object') {
                    valueStr = formatJSON(value, indent + 1);
                } else {
                    valueStr = JSON.stringify(value);
                }
                
                return `${nextIndentStr}${keyStr}: ${valueStr}`;
            });
            
            return `{\n${lines.join(',\n')}\n${indentStr}}`;
        } else {
            return JSON.stringify(obj);
        }
    };

    // 새로운 파일 내용 생성
    let newContent = '      \n// 캐릭터 목록 데이터\n';
    newContent += 'window.characterList = window.characterList || {\n';
    newContent += '    mainParty: [\n';
    newContent += '        "렌", "루우나", "루페르", "레오", "류지",\n';
    newContent += '        "리코·매화", "마사키", "마유미", "마코토", "미나미", "미나미·여름", "미유·여름", "모르가나",\n';
    newContent += '        "모토하", "모토하·여름", "몽타뉴", "몽타뉴·백조", "미오", "미츠루", "사나다","쇼키","쇼키·암야", "슌", "슌·프론티어",\n';
    newContent += '        "세이지", "안", "아야카", "아케치", "야오링", "야오링·사자무",\n';
    newContent += '        "원더", "유스케", "YUI", "YUI·스텔라","유카리", "유키미", "유키 마코토", "이치고", "카스미", "카타야마",\n';
    newContent += '        "키라", "키요시", "토모코", "토모코·여름", "토시야",\n';
    newContent += '        "하루", "하루나", "치즈코", "J&C"\n';
    newContent += '    ],\n';
    newContent += '    supportParty: [\n';
    newContent += '        "리코", "미유","마나카", "유우미", "카요", "후타바", "후카"\n';
    newContent += '    ]\n';
    newContent += '};\n\n';
    newContent += '/* \n';
    newContent += '    color : 택틱 메이커 등에서 나타날 대표 색상\n';
    newContent += '    element : 속성\n';
    newContent += '    rarity : 4성/5성 \n';
    newContent += '    position : 지배/굴복/구원/반항/해명/우월/구원/반항/해명\n';
    newContent += '    release_order : 캐릭터 출시 순서\n';
    newContent += '    codename : 코드네임\n';
    newContent += '    persona : 페르소나 이름\n';
    newContent += '    name : 캐릭터 이름\n';
    newContent += '*/\n\n';
    newContent += 'window.characterData = window.characterData || {};\n';
    newContent += 'Object.assign(window.characterData, {\n';

    // release_order 기준으로 정렬 (내림차순 - 높은 게 위로)
    const charNames = Object.keys(characterData).sort((a, b) => {
        const orderA = characterData[a].release_order ?? 0;
        const orderB = characterData[b].release_order ?? 0;
        // release_order가 없으면 0으로 처리하고 맨 아래로
        if (orderA === 0 && orderB === 0) {
            return a.localeCompare(b); // 알파벳 순
        }
        if (orderA === 0) return 1; // A가 0이면 뒤로
        if (orderB === 0) return -1; // B가 0이면 뒤로
        return orderB - orderA; // 내림차순
    });

    charNames.forEach((charName, index) => {
        const charData = characterData[charName];
        const formattedData = formatJSON(charData, 1);
        newContent += `    "${charName}": ${formattedData}`;
        if (index < charNames.length - 1) {
            newContent += ',';
        }
        newContent += '\n';
    });

    newContent += '});\n';

    // 파일 쓰기
    fs.writeFileSync(charactersFilePath, newContent, 'utf-8');
    console.log(`✅ characters.js에서 옮긴 속성들이 제거되었습니다. (${charNames.length}개 캐릭터)`);
    console.log(`✅ release_order 기준으로 정렬 완료 (높은 순서가 위로)`);

} catch (error) {
    console.error('오류 발생:', error);
    console.error('스택:', error.stack);
    process.exit(1);
}
