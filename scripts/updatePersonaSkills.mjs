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

    // 예: "77.1/80.6/84.1%의" 처럼 마지막 값에만 %가 붙어있으면
    // 앞의 두 값에도 %를 붙여 "77.1%/80.6%/84.1%의" 로 보정한다.
    const fixTriplePercent = (text) => {
        if (typeof text !== 'string') return text;
        return text.replace(
            /(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)%/g,
            '$1%/$2%/$3%'
        );
    };

    for (const id of ids) {
        const perLangInnate = {};
        const perLangFixed = {};
        let skip = false;

        for (const lang of LANGS) {
            const filePath = path.join(PERSONA_DIR, lang, `${id}.json`);
            const json = await readJsonIfExists(filePath);
            if (!json || !json.data || !json.data.skill) {
                skip = true;
                break;
            }
            const skillBlock = json.data.skill;
            const innate = skillBlock.innate_skill || [];
            perLangInnate[lang] = innate;
            perLangFixed[lang] = skillBlock.fixed_skill || null;
        }

        if (skip) continue;

        // 1) innate_skill 배열 매핑 (길이 맞는 경우에만)
        const lenKr = perLangInnate.kr.length;
        const lenEn = perLangInnate.en.length;
        const lenJp = perLangInnate.jp.length;
        if (lenKr && lenKr === lenEn && lenKr === lenJp) {
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
                    desc_kr: fixTriplePercent(k.desc.trim()),
                    desc_en: fixTriplePercent(e.desc.trim()),
                    desc_jp: fixTriplePercent(j.desc.trim())
                });
            }
        }

        // 2) fixed_skill 도 추가로 매핑
        const fk = perLangFixed.kr;
        const fe = perLangFixed.en;
        const fj = perLangFixed.jp;
        if (fk && fe && fj && fk.name && fe.name && fj.name && fk.desc && fe.desc && fj.desc) {
            result.push({
                name_kr: fk.name.trim(),
                name_en: fe.name.trim(),
                name_jp: fj.name.trim(),
                desc_kr: fixTriplePercent(fk.desc.trim()),
                desc_en: fixTriplePercent(fe.desc.trim()),
                desc_jp: fixTriplePercent(fj.desc.trim())
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

    const declIndex = src.indexOf('const personaSkillList');
    if (declIndex === -1) {
        throw new Error('skills copy.js 에서 personaSkillList 선언을 찾지 못했습니다.');
    }

    const openBraceIndex = src.indexOf('{', declIndex);
    const closeSeqIndex = src.lastIndexOf('};');
    if (openBraceIndex === -1 || closeSeqIndex === -1 || closeSeqIndex <= openBraceIndex) {
        throw new Error('skills copy.js 에서 personaSkillList 오브젝트의 범위를 계산하지 못했습니다.');
    }

    const objLiteral = src.slice(openBraceIndex, closeSeqIndex + 1);

    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`result = ${objLiteral}`, sandbox);
    const personaSkillList = sandbox.result;

    return {
        src,
        range: {
            declIndex,
            openBraceIndex,
            closeSeqIndex
        },
        personaSkillList
    };
}

async function savePersonaSkillList(src, range, personaSkillList) {
    const before = src.slice(0, range.declIndex);
    const after = src.slice(range.closeSeqIndex + 2); // '};' 이후부터

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
    const { src, range, personaSkillList } = await loadPersonaSkillList();

    console.log('3) description 교체 및 effects 제거 중...');
    let replacedCount = 0;
    const matchedSkills = [];
    const unmatchedSkills = [];

    for (const [skillKey, skill] of Object.entries(personaSkillList)) {
        if (!skill || typeof skill !== 'object') continue;

        // type 이 "패시브" 인 것은 description 교체는 하지 않는다.
        const isPassive = skill.type === '패시브';
        const entry = findMatchingEntry(skillKey, skill, entries);

        if (entry && !isPassive) {
            skill.description = entry.desc_kr;
            skill.description_en = entry.desc_en;
            skill.description_jp = entry.desc_jp;
            matchedSkills.push(skillKey);
            replacedCount++;
        } else if (!entry && !isPassive) {
            unmatchedSkills.push(skillKey);
        }

        // 3. effects 는 전부 제거
        if ('effects' in skill) {
            delete skill.effects;
        }
    }

    console.log(`   → description 교체된 스킬 수: ${replacedCount}`);
    console.log(`   → 매칭 실패(비패시브 스킬) 수: ${unmatchedSkills.length}`);
    if (unmatchedSkills.length) {
        console.log('   → 매칭 실패 스킬 목록:');
        for (const name of unmatchedSkills) {
            console.log(`      - ${name}`);
        }
    }

    console.log('4) skills copy.js 저장 중...');
    await savePersonaSkillList(src, range, personaSkillList);

    console.log('완료: skills copy.js 의 personaSkillList 가 업데이트되었습니다.');
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});


