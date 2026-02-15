#!/usr/bin/env node

/**
 * generate-synergy-pages.mjs
 *
 * Generates static stub pages for each synergy character × language combination.
 * These pages provide unique SEO meta (title, description, og:image, hreflang)
 * while sharing the same body content via {% include synergy-body.html %}.
 *
 * Usage: node scripts/seo/generate-synergy-pages.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

// ── Data sources ─────────────────────────────────────────────────────

// 1) friend_num.json → synergy characters (truth source)
const friendNumPath = path.join(ROOT, 'apps', 'synergy', 'friends', 'friend_num.json');
const friendNum = JSON.parse(fs.readFileSync(friendNumPath, 'utf-8'));

// 2) character_info.js → codename / name_en / name_jp mapping
//    Parse the JS file: extract the Object.assign({...}) payload
const charInfoPath = path.join(ROOT, 'data', 'character_info.js');
const charInfoSrc = fs.readFileSync(charInfoPath, 'utf-8');

function parseCharacterData(src) {
    // Extract the object literal inside Object.assign(window.characterData, { ... });
    const match = src.match(/Object\.assign\(\s*window\.characterData\s*,\s*(\{[\s\S]*\})\s*\)\s*;/);
    if (!match) throw new Error('Could not parse character_info.js');
    // Use Function constructor to evaluate the object literal safely
    const fn = new Function(`return (${match[1]});`);
    return fn();
}

const characterData = parseCharacterData(charInfoSrc);

// 3) i18n title strings (hardcoded from the JS files to avoid eval)
const i18nTitles = {
    kr: {
        prefix: 'P5X 협력자',
        suffix: '루페르넷',
        descPrefix: '페르소나5 더 팬텀 X',
        descSuffix: '의 협력자(시너지) 가이드',
    },
    en: {
        prefix: 'P5X Synergy',
        suffix: 'Lufelnet',
        descPrefix: 'Persona 5 The Phantom X',
        descSuffix: 'synergy guide',
    },
    jp: {
        prefix: 'P5X シナジーガイド',
        suffix: 'Lufelnet',
        descPrefix: 'Persona 5 The Phantom X',
        descSuffix: 'シナジーガイド',
    },
};

// Characters not in characterData that need name overrides
const NAME_OVERRIDES = {
    '메로페': { name_en: 'Merope', name_jp: 'メロペ' },
};

// ── Helpers ───────────────────────────────────────────────────────────

/** Get the codename for a synergy character (Korean name key) */
function getCodename(krName) {
    if (krName === '메로페') return 'merope';
    // Look up in characterData
    const data = characterData[krName];
    if (data && data.codename) return data.codename.toLowerCase();
    // friend_num.json may have name_en as a fallback key hint
    const fnEntry = friendNum[krName];
    if (fnEntry && fnEntry.name_en) return fnEntry.name_en.toLowerCase().replace(/\s+/g, '-');
    // Last resort: use the korean name itself (shouldn't happen)
    return krName.toLowerCase();
}

/** Get display name by language */
function getDisplayName(krName, lang) {
    if (lang === 'kr') return krName;

    // Check hardcoded overrides first
    const override = NAME_OVERRIDES[krName];

    // Check friend_num.json (has name_en/name_jp for some chars like 무스비, 나루미)
    const fnEntry = friendNum[krName];

    // Then check characterData
    const charEntry = characterData[krName];

    if (lang === 'en') {
        if (override && override.name_en) return override.name_en;
        if (fnEntry && fnEntry.name_en) return fnEntry.name_en;
        if (charEntry && charEntry.name_en) return charEntry.name_en;
        return krName;
    }
    if (lang === 'jp') {
        if (override && override.name_jp) return override.name_jp;
        if (fnEntry && fnEntry.name_jp) return fnEntry.name_jp;
        if (charEntry && charEntry.name_jp) return charEntry.name_jp;
        // Fallback to English
        if (override && override.name_en) return override.name_en;
        if (fnEntry && fnEntry.name_en) return fnEntry.name_en;
        if (charEntry && charEntry.name_en) return charEntry.name_en;
        return krName;
    }
    return krName;
}

/** Get the OG image path for a character */
function getImagePath(krName) {
    const fnEntry = friendNum[krName];
    if (fnEntry && fnEntry.img_color) {
        return `/assets/img/synergy/face/${fnEntry.img_color}`;
    }
    // No color image → use grayscale
    if (fnEntry && fnEntry.img) {
        return `/assets/img/synergy/face_black/${fnEntry.img}`;
    }
    return '/assets/img/logo/lufel.png';
}

/** Get permalink for a character page */
function getPermalink(codename, lang) {
    if (lang === 'kr') return `/synergy/${codename}/`;
    return `/${lang}/synergy/${codename}/`;
}

/** Get Jekyll language code */
function getLangCode(lang) {
    return lang; // kr, en, jp
}

// ── Main generation ──────────────────────────────────────────────────

const OUTPUT_DIR = path.join(ROOT, 'pages', 'synergy');
const languages = ['kr', 'en', 'jp'];

// Clean up old generated files
if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
}

let totalFiles = 0;

for (const krName of Object.keys(friendNum)) {
    const fnEntry = friendNum[krName];

    // Skip inactive characters with num === 0
    if (fnEntry.inactive && fnEntry.num === 0) continue;

    const codename = getCodename(krName);
    const imagePath = getImagePath(krName);

    for (const lang of languages) {
        const displayName = getDisplayName(krName, lang);
        const permalink = getPermalink(codename, lang);
        const titles = i18nTitles[lang];

        const title = `${titles.prefix} ${displayName} | ${titles.suffix}`;
        let description;
        if (lang === 'kr') {
            description = `${titles.descPrefix} ${displayName}${titles.descSuffix}`;
        } else {
            description = `${titles.descPrefix} ${displayName} ${titles.descSuffix}`;
        }

        // Build alternate_urls
        const altKo = `/synergy/${codename}/`;
        const altEn = `/en/synergy/${codename}/`;
        const altJp = `/jp/synergy/${codename}/`;

        const frontMatter = [
            '---',
            'layout: default',
            `title: "${title}"`,
            `description: "${description}"`,
            `image: "${imagePath}"`,
            `language: ${getLangCode(lang)}`,
            `permalink: ${permalink}`,
            `synergy_character: ${codename}`,
            'alternate_urls:',
            `  ko: ${altKo}`,
            `  en: ${altEn}`,
            `  jp: ${altJp}`,
            '---',
            '{% include synergy-body.html %}',
            '',
        ].join('\n');

        // Write file
        const dir = path.join(OUTPUT_DIR, lang);
        fs.mkdirSync(dir, { recursive: true });
        const filePath = path.join(dir, `${codename}.html`);
        fs.writeFileSync(filePath, frontMatter, 'utf-8');
        totalFiles++;
    }
}

console.log(`Generated ${totalFiles} synergy SEO pages in ${OUTPUT_DIR}`);
