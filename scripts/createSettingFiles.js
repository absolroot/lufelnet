const fs = require('fs');
const path = require('path');

// characters.js 파일 경로
const charactersFilePath = path.join(__dirname, '..', 'data', 'kr', 'characters', 'characters.js');
const charactersDir = path.join(__dirname, '..', 'data', 'characters');

// 추출할 속성 목록
const targetProperties = [
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

// characters.js 파일 읽기
const charactersFileContent = fs.readFileSync(charactersFilePath, 'utf-8');

// window.characterData 객체 추출
// 간단한 파싱: Object.assign(window.characterData, { ... }) 부분 찾기
const dataMatch = charactersFileContent.match(/Object\.assign\(window\.characterData,\s*\{([\s\S]*)\}\);/);
if (!dataMatch) {
    console.error('characterData 객체를 찾을 수 없습니다.');
    process.exit(1);
}

// JavaScript 코드를 실행하여 characterData 객체 가져오기
// eval을 사용하는 대신, 파일을 모듈로 로드하는 방식 사용
const vm = require('vm');
const context = { window: { characterData: {} } };
vm.createContext(context);

// characters.js 파일을 실행하여 characterData 추출
try {
    vm.runInContext(charactersFileContent, context);
    const characterData = context.window.characterData;

    // 각 캐릭터에 대해 setting.js 파일 생성
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const [charName, charData] of Object.entries(characterData)) {
        try {
            // 캐릭터 폴더 경로
            const charFolderPath = path.join(charactersDir, charName);
            
            // 폴더가 존재하는지 확인
            if (!fs.existsSync(charFolderPath)) {
                console.log(`⚠️  폴더 없음: ${charName}`);
                skippedCount++;
                continue;
            }

            // 추출할 데이터 객체 생성
            const settingData = {};
            for (const prop of targetProperties) {
                if (charData.hasOwnProperty(prop)) {
                    settingData[prop] = charData[prop];
                }
            }

            // 배열을 한 줄로 출력하는 커스텀 JSON 포맷터
            const formatJSON = (obj, indent = 0) => {
                const indentStr = '    '.repeat(indent);
                const nextIndentStr = '    '.repeat(indent + 1);
                
                if (Array.isArray(obj)) {
                    // 배열은 한 줄로 출력
                    return '[' + obj.map(item => {
                        if (typeof item === 'string') {
                            return JSON.stringify(item);
                        } else if (typeof item === 'object' && item !== null) {
                            return formatJSON(item, indent + 1);
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

            // setting.js 파일 내용 생성
            const formattedData = formatJSON(settingData);
            const settingContent = `window.characterSetting = window.characterSetting || {};
window.characterSetting["${charName}"] = ${formattedData};
`;

            // 파일 경로
            const settingFilePath = path.join(charFolderPath, 'setting.js');

            // 파일 쓰기
            fs.writeFileSync(settingFilePath, settingContent, 'utf-8');
            console.log(`✅ 생성 완료: ${charName}/setting.js`);
            createdCount++;

        } catch (error) {
            console.error(`❌ 오류 발생 (${charName}):`, error.message);
            errorCount++;
        }
    }

    console.log('\n=== 완료 ===');
    console.log(`생성: ${createdCount}개`);
    console.log(`건너뜀: ${skippedCount}개`);
    console.log(`오류: ${errorCount}개`);

} catch (error) {
    console.error('파일 파싱 오류:', error);
    process.exit(1);
}

