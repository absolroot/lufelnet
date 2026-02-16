#!/usr/bin/env node

/**
 * scripts/manage-persona-data.mjs
 * 
 * 1. Checks consistency between data/external/persona/mapping.json and data/persona files.
 * 2. Automatically updates `innate_skill` for ALL personas (ordered AND non-ordered).
 * 3. Automatically creates/updates other fields ONLY for non-ordered personas.
 * 
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

const DATA_DIR = path.join(PROJECT_ROOT, 'data');
const EXTERNAL_DIR = path.join(DATA_DIR, 'external', 'persona');
const PERSONA_DIR = path.join(DATA_DIR, 'persona');
const NONORDER_DIR = path.join(PERSONA_DIR, 'nonorder');
const MAPPING_FILE = path.join(EXTERNAL_DIR, 'mapping.json');
const ORDER_FILE = path.join(PERSONA_DIR, 'order.js');

// Ensure nonorder directory exists
if (!fs.existsSync(NONORDER_DIR)) {
    fs.mkdirSync(NONORDER_DIR, { recursive: true });
}

function loadJson(p) {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadJsObject(p) {
    if (!fs.existsSync(p)) return null;
    const content = fs.readFileSync(p, 'utf8');
    const sandbox = { window: { personaFiles: {} } };
    try {
        vm.runInNewContext(content, sandbox);
        const keys = Object.keys(sandbox.window.personaFiles);
        if (keys.length > 0) return sandbox.window.personaFiles[keys[0]];
        return null;
    } catch (e) {
        console.error(`Error loading JS object from ${p}:`, e.message);
        return null;
    }
}

// Load static resources
const mapping = loadJson(MAPPING_FILE) || {};
const orderContent = fs.readFileSync(ORDER_FILE, 'utf8');
const orderSandbox = { window: { personaOrder: [] } };
vm.runInNewContext(orderContent, orderSandbox);
const orderList = orderSandbox.window.personaOrder;

const languages = ['kr', 'en', 'jp'];

async function main() {
    console.log('Starting Persona Data Management...');

    let newCount = 0;
    let updateCount = 0;
    let errorCount = 0;

    for (const [id, mapData] of Object.entries(mapping)) {
        const nameKr = mapData.name_kr;

        // Skip invalid names (e.g. "???") or empty
        if (!nameKr || nameKr.includes('?')) {
            continue;
        }

        const isOrdered = orderList.includes(nameKr);

        if (id === '101') {
            console.log(`[DEBUG] Processing ID 101. NameKr: '${nameKr}', isOrdered: ${isOrdered}`);
        }

        try {
            await processPersona(id, mapData, isOrdered);

            if (isOrdered) updateCount++;
            else newCount++;
        } catch (err) {
            console.error(`[ERROR] Failed processing ${nameKr} (ID: ${id}):`, err);
            errorCount++;
        }
    }

    console.log('------------------------------------------------');
    console.log(`Done. New/Updated Non-Ordered: ${newCount}, Updated Ordered: ${updateCount}, Errors: ${errorCount}`);
}

async function processPersona(id, mapData, isOrdered) {
    const nameKr = mapData.name_kr;

    // Determine file path
    let filePath;
    if (isOrdered) {
        filePath = path.join(PERSONA_DIR, `${nameKr}.js`);
    } else {
        filePath = path.join(NONORDER_DIR, `${nameKr}.js`);
    }

    const exists = fs.existsSync(filePath);

    // If ordered and missing, warn and skip (should happen via check, but fail safely here)
    if (isOrdered && !exists) {
        console.warn(`[WARN] Ordered persona not found: ${nameKr} (ID: ${id})`);
        return;
    }

    // Load existing data or create template
    let finalData = {};

    if (exists) {
        const existing = loadJsObject(filePath);
        if (existing) {
            finalData = { ...existing };
        }
    }

    // If new (non-ordered only), fill defaults
    if (!exists && !isOrdered) {
        finalData = {
            id: String(id),
            key: nameKr,
            name: nameKr,
            name_en: mapData.name_en || "",
            name_jp: mapData.name_jp || "",
            grade: "5",
            star: "4",
            position: "지배",
            element: "주원",
            event: false,
            wild_emblem_rainbow: false,
            best_persona: false,
            added: "",
            cost: null,
            combination: null,
            recommendSkill: [],
            comment: "",
            comment_en: "",
            comment_jp: "",
            passive_priority: null,
            passive_skill: [],
            innate_skill: [],
            uniqueSkill: null,
            highlight: null
        };
    }

    // Always ensure ID consistency
    finalData.id = String(id);

    // Fetch external data for updates
    const extData = {};
    for (const lang of languages) {
        const pPath = path.join(EXTERNAL_DIR, lang, `${id}.json`);
        const json = loadJson(pPath);
        if (json && json.data) {
            extData[lang] = json.data;
        }
    }

    if (!extData.kr) {
        // No external data, skip updates
        return;
    }

    // --- SHARED UPDATE LOGIC: innate_skill ---
    // Both Ordered and Non-Ordered receive this update
    const externalInnate = extData.kr.skill?.innate_skill || [];

    if (nameKr === '야노식') {
        console.log(`[DEBUG_JANOSIK] ID: ${id}, isOrdered: ${isOrdered}, FilePath: ${filePath}`);
        console.log(`[DEBUG_JANOSIK] External Innate Count: ${externalInnate.length}`);
    }

    const mergedInnate = externalInnate.map((p, idx) => {
        const pEn = extData.en?.skill?.innate_skill?.[idx];
        const pJp = extData.jp?.skill?.innate_skill?.[idx];
        return {
            name: p.name,
            name_en: pEn?.name,
            name_jp: pJp?.name,
            desc: p.desc,
            desc_en: pEn?.desc,
            desc_jp: pJp?.desc,
            cost: p.cost,
            level: p.level,
            learn_level: p.learn_level
        };
    });
    finalData.innate_skill = mergedInnate;

    if (nameKr === '야노식') {
        console.log(`[DEBUG_JANOSIK] Final Innate Count: ${finalData.innate_skill.length}`);
        console.log(`[DEBUG_JANOSIK] Writing to ${filePath}`);
    }


    // --- NON-ORDERED ONLY LOGIC ---
    if (!isOrdered) {
        finalData.name_en = mapData.name_en || finalData.name_en;
        finalData.name_jp = mapData.name_jp || finalData.name_jp;

        // 1. Passive Skills
        const externalPassives = extData.kr.skill?.passive_skill || [];
        const mergedPassives = externalPassives.map((p, idx) => {
            const pEn = extData.en?.skill?.passive_skill?.[idx];
            const pJp = extData.jp?.skill?.passive_skill?.[idx];
            return {
                name: p.name,
                name_en: pEn?.name,
                name_jp: pJp?.name,
                desc: p.desc,
                desc_en: pEn?.desc,
                desc_jp: pJp?.desc
            };
        });
        finalData.passive_skill = mergedPassives;

        // 2. Unique Skill (Fixed Skill)
        const fixed = extData.kr.skill?.fixed_skill;
        if (fixed) {
            const fixedEn = extData.en?.skill?.fixed_skill;
            const fixedJp = extData.jp?.skill?.fixed_skill;
            finalData.uniqueSkill = {
                ...(finalData.uniqueSkill || {}),
                name: fixed.name,
                name_en: fixedEn?.name,
                name_jp: fixedJp?.name,
                desc: fixed.desc,
                desc_en: fixedEn?.desc,
                desc_jp: fixedJp?.desc,
                priority: (finalData.uniqueSkill && finalData.uniqueSkill.priority !== undefined) ? finalData.uniqueSkill.priority : 0,
                icon: (finalData.uniqueSkill && finalData.uniqueSkill.icon) ? finalData.uniqueSkill.icon : "Default",
                icon_gl: (finalData.uniqueSkill && finalData.uniqueSkill.icon_gl) ? finalData.uniqueSkill.icon_gl : ""
            };
        }

        // 3. Highlight (Showtime)
        const showtime = extData.kr.skill?.showtime_skill;
        if (showtime) {
            const stEn = extData.en?.skill?.showtime_skill;
            const stJp = extData.jp?.skill?.showtime_skill;
            finalData.highlight = {
                ...(finalData.highlight || {}),
                name: "HIGHLIGHT",
                name_en: "Highlight",
                name_jp: "ハイライト",
                desc: showtime.desc,
                desc_en: stEn?.desc,
                desc_jp: stJp?.desc,
                priority: (finalData.highlight && finalData.highlight.priority !== undefined) ? finalData.highlight.priority : 0
            };
        }
    }

    // Write File
    const fileContent = `window.personaFiles = window.personaFiles || {};
window.personaFiles["${nameKr}"] = ${JSON.stringify(finalData, null, 2)};
`;

    fs.writeFileSync(filePath, fileContent, 'utf8');
}

main().catch(e => console.error(e));
