// data/external/persona 의 페르소나 파일들을 돌면서
// 각 언어별 innate_skill(name, desc)을 추출한 뒤,
// data/kr/wonder/skills copy.js 의 personaSkillList 안에 있는
// description/description_en/description_jp 를 업데이트하고
// 모든 스킬의 effects 를 제거하는 스크립트입니다.
//
// 사용 방법(프로젝트 루트에서):
//   node scripts/updatePersonaSkills.mjs

import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';

const ROOT = process.cwd();
const PERSONA_DIR = path.join(ROOT, 'data', 'external', 'persona');
const SKILLS_FILE = path.join(ROOT, 'data', 'kr', 'wonder', 'skills copy.js');
const LANGS = ['kr', 'en', 'jp'];

async function readJsonIfExists(filePath) {
    try {
        const raw = await fs.readFile(filePath, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        if (err.code === 'ENOENT') return null;
        console.error(`JSON 파싱 실패: ${filePath}`, err);
        return null;
    }
}

async function collectPersonaIds() {
    // kr 폴더 기준으로 ID 리스트를 얻는다.
    const krDir = path.join(PERSONA_DIR, 'kr');
    const entries = await fs.readdir(krDir, { withFileTypes: true });
    return entries
        .filter((e) => e.isFile() && e.name.endsWith('.json'))
        .map((e) => path.basename(e.name, '.json'))
        .sort((a, b) => Number(a) - Number(b));
}

async function buildInnateSkillEntries() {
    const ids = await collectPersonaIds();
    /** @type {Array<{name_kr:string,name_en:string,name_jp:string,desc_kr:string,desc_en:string,desc_jp:string}>} */
    const result = [];

    for (const id of ids) {
        const perLangInnate = {};
        let skip = false;

        for (const lang of LANGS) {
            const filePath = path.join(PERSONA_DIR, lang, `${id}.json`);
            const json = await readJsonIfExists(filePath);
            if (!json || !json.data || !json.data.skill) {
                skip = true;
                break;
            }
            const innate = json.data.skill.innate_skill || [];
            perLangInnate[lang] = innate;
        }

        if (skip) continue;

        const lenKr = perLangInnate.kr.length;
        const lenEn = perLangInnate.en.length;
        const lenJp = perLangInnate.jp.length;
        if (!lenKr || lenKr !== lenEn || lenKr !== lenJp) {
            // 길이가 안 맞으면 해당 페르소나는 스킵
            continue;
        }

        for (let i = 0; i < lenKr; i++) {
            const k = perLangInnate.kr[i];
            const e = perLangInnate.en[i];
            const j = perLangInnate.jp[i];
            if (!k || !e || !j) continue;

            // name/desc 가 모두 있는 것만 사용
            if (!k.name || !e.name || !j.name || !k.desc || !e.desc || !j.desc) continue;

            result.push({
                name_kr: k.name.trim(),
                name_en: e.name.trim(),
                name_jp: j.name.trim(),
                desc_kr: k.desc.trim(),
                desc_en: e.desc.trim(),
                desc_jp: j.desc.trim()
            });
        }
    }

    return result;
}

function findMatchingEntry(skillNameKr, skillObj, entries) {
    const targets = new Set();
    if (skillNameKr) targets.add(String(skillNameKr).trim());
    if (skillObj && typeof skillObj === 'object') {
        if (skillObj.name) targets.add(String(skillObj.name).trim());
        if (skillObj.name_en) targets.add(String(skillObj.name_en).trim());
        if (skillObj.name_jp) targets.add(String(skillObj.name_jp).trim());
    }

    for (const entry of entries) {
        if (
            targets.has(entry.name_kr) ||
            targets.has(entry.name_en) ||
            targets.has(entry.name_jp)
        ) {
            return entry;
        }
    }
    return null;
}

async function loadPersonaSkillList() {
    const src = await fs.readFile(SKILLS_FILE, 'utf8');

    const regex = /const\s+personaSkillList\s*=\s*({[\s\S]*})\s*$/m;
    const match = src.match(regex);
    if (!match) {
        throw new Error('skills copy.js 에서 personaSkillList 오브젝트를 찾지 못했습니다.');
    }

    const objLiteral = match[1];
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`result = ${objLiteral}`, sandbox);
    const personaSkillList = sandbox.result;

    return { src, match, personaSkillList };
}

async function savePersonaSkillList(src, match, personaSkillList) {
    const before = src.slice(0, match.index);
    const after = src.slice(match.index + match[0].length);

    const newObjCode =
        'const personaSkillList = ' +
        JSON.stringify(personaSkillList, null, 4) +
        ';\n';

    const newSrc = before + newObjCode + after;
    await fs.writeFile(SKILLS_FILE, newSrc, 'utf8');
}

async function main() {
    console.log('1) innate_skill 목록 수집 중...');
    const entries = await buildInnateSkillEntries();
    console.log(`   → 수집된 innate_skill 개수: ${entries.length}`);

    console.log('2) personaSkillList 로딩 중...');
    const { src, match, personaSkillList } = await loadPersonaSkillList();

    console.log('3) description 교체 및 effects 제거 중...');
    let replacedCount = 0;

    for (const [skillKey, skill] of Object.entries(personaSkillList)) {
        if (!skill || typeof skill !== 'object') continue;

        // type 이 "패시브" 인 것은 description 교체는 하지 않는다.
        const isPassive = skill.type === '패시브';
        const entry = findMatchingEntry(skillKey, skill, entries);

        if (entry && !isPassive) {
            skill.description = entry.desc_kr;
            skill.description_en = entry.desc_en;
            skill.description_jp = entry.desc_jp;
            replacedCount++;
        }

        // 3. effects 는 전부 제거
        if ('effects' in skill) {
            delete skill.effects;
        }
    }

    console.log(`   → description 교체된 스킬 수: ${replacedCount}`);

    console.log('4) skills copy.js 저장 중...');
    await savePersonaSkillList(src, match, personaSkillList);

    console.log('완료: skills copy.js 의 personaSkillList 가 업데이트되었습니다.');
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});


