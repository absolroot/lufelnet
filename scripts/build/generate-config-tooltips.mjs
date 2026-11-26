import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import tooltipText from '../../assets/js/config-tooltips.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(root, 'data', 'tooltips');
const languages = ['kr', 'en', 'jp', 'cn'];
const descriptionFields = ['desc', 'descSimple', 'descSynchroniza', 'descSimpleSynchroniza'];
const present = text => typeof text === 'string' && text.trim() && text !== 'AAAAAA==';
const readJson = async file => JSON.parse((await readFile(file, 'utf8')).replace(/^\uFEFF/, ''));
const textOnly = html => html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/gu, '');
const overrides = await readJson(path.join(output, 'overrides.json')).catch(error => {
    if (error.code === 'ENOENT') return [];
    throw error;
});
const translations = await readJson(path.join(output, 'provisional.json'));

async function readSiteDescriptions() {
    const characters = path.join(root, 'data', 'characters');
    const personas = path.join(root, 'data', 'persona');
    const groups = [];
    for (const dir of await readdir(characters, { withFileTypes: true })) {
        if (!dir.isDirectory() || dir.name === 'template') continue;
        for (const file of await readdir(path.join(characters, dir.name))) {
            if (!/^(skill|ritual|innate|weapon)\.js$/u.test(file)) continue;
            groups.push([path.join(characters, dir.name, file), dir.name]);
        }
    }
    for (const file of await readdir(personas)) {
        if (file.endsWith('.js') && !['order.js', 'nonorder.js', 'index.js'].includes(file)) {
            groups.push([path.join(personas, file), path.basename(file, '.js')]);
        }
    }
    const descriptions = [];
    function visit(base, localized) {
        for (const [key, value] of Object.entries(base || {})) {
            if (value && typeof value === 'object') {
                visit(value, Object.fromEntries(['en', 'jp', 'cn'].map(lang => [lang, localized[lang]?.[key]])));
                continue;
            }
            if (!present(value) || !/^(?:description|desc|r\d+_detail)$/u.test(key)) continue;
            const row = { kr: value };
            for (const lang of ['en', 'jp', 'cn']) {
                row[lang] = localized[lang]?.[key] || base[`${key}_${lang}`];
            }
            descriptions.push(row);
        }
    }
    for (const [file, name] of groups) {
        const window = {};
        vm.runInNewContext(await readFile(file, 'utf8'), { window }, { filename: file, timeout: 1000 });
        const local = Object.entries(window).find(([key, rows]) => !/^(en|jp|cn)/u.test(key) && rows?.[name]);
        if (!local) continue;
        const [baseKey, base] = local;
        const suffix = baseKey[0].toUpperCase() + baseKey.slice(1);
        const versions = Object.fromEntries(['en', 'jp', 'cn'].map(lang => [
            lang, window[`${lang}Character${suffix.replace(/^Character/u, '')}`]?.[name]
        ]));
        visit(base[name], versions);
    }
    return descriptions;
}

function translatedLinks(text, sourceLinks, lang) {
    const compact = tooltipText.compact(textOnly(text));
    const found = [];
    for (const id of new Set(sourceLinks.map(([id]) => id))) {
        const phrases = translations[id]?.[lang]?.phrases;
        if (!phrases) continue;
        const reference = sourceLinks.filter(([key]) => key === id);
        const groups = new Map();
        for (const [key, label, ordinal, total] of reference) {
            if (!groups.has(label)) groups.set(label, { total, ordinals: [] });
            groups.get(label).ordinals.push(ordinal);
        }
        const matches = [];
        const aliases = phrases.map(entry => typeof entry === 'string' ? { phrase: entry } : entry)
            .map(entry => ({ phrase: tooltipText.compact(entry.phrase), before: tooltipText.compact(entry.before || '') }))
            .sort((a, b) => b.phrase.length - a.phrase.length);
        for (const { phrase: alias, before } of aliases) {
            for (const start of tooltipText.occurrences(compact.toLowerCase(), alias.toLowerCase())) {
                if (before && !compact.slice(0, start).toLowerCase().endsWith(before.toLowerCase())) continue;
                const last = start + alias.length;
                if (matches.some(match => start < match.last && match.start < last)) continue;
                matches.push({ start, last });
            }
        }
        matches.sort((a, b) => a.start - b.start);
        const [group] = groups.values();
        const selected = groups.size === 1 && matches.length === group.total
            ? group.ordinals.map(ordinal => matches[ordinal])
            : matches.length === reference.length ? matches : [];
        for (const { start, last } of selected) {
            const phrase = compact.slice(start, last);
            const starts = tooltipText.occurrences(compact, phrase);
            found.push([id, phrase, starts.indexOf(start), starts.length]);
        }
    }
    return found;
}

function addTranslatedFields(fields, lang, sourcePacks, descriptions) {
    const proposed = new Map();
    const conflicts = new Set();
    for (const row of descriptions) {
        if (!present(row[lang])) continue;
        const key = tooltipText.signature(textOnly(row[lang]));
        if (!key || fields.get(key)?.length || conflicts.has(key)) continue;
        const krLinks = sourcePacks.kr.fields[tooltipText.signature(textOnly(row.kr))] || [];
        const cnLinks = present(row.cn) ? sourcePacks.cn.fields[tooltipText.signature(textOnly(row.cn))] || [] : [];
        const krIds = new Set(krLinks.map(([id]) => id));
        const links = translatedLinks(row[lang], [...krLinks, ...cnLinks.filter(([id]) => !krIds.has(id))], lang);
        if (proposed.has(key) && JSON.stringify(proposed.get(key)) !== JSON.stringify(links)) {
            proposed.delete(key);
            conflicts.add(key);
        } else {
            proposed.set(key, links);
        }
    }
    for (const [key, links] of proposed) {
        if (links.length) fields.set(key, links);
    }
}

function readLinks(markup, tips) {
    const text = tooltipText.compact(textOnly(markup));
    const links = [];
    for (const match of markup.matchAll(/<link="s\|(\d+)">([\s\S]*?)<\/link>/gu)) {
        const id = Number(match[1]);
        assert(Object.hasOwn(tips, id), `Missing Config tooltip ${id}`);
        const phrase = tooltipText.compact(textOnly(match[2]));
        const start = tooltipText.compact(textOnly(markup.slice(0, match.index))).length;
        const starts = tooltipText.occurrences(text, phrase);
        const ordinal = starts.indexOf(start);
        if (ordinal !== -1) links.push([id, phrase, ordinal, starts.length]);
    }
    return links;
}

async function generate(lang, sourcePacks, descriptions) {
    const code = lang.toUpperCase();
    const config = path.join(root, '_config', `Config_${code}`);
    const translated = lang === 'en' || lang === 'jp';
    const tables = translated
        ? [`conftranslation${lang}/ConfSkillTips_${code}.json`, `conftranslation${lang}/ConfSkill_${code}.json`]
        : ['default/ConfSkillTips.json', 'battle/ConfSkill.json'];
    const [tipRows, skillRows] = await Promise.all(tables.map(file => readJson(path.join(config, file))));
    const tips = Object.fromEntries(tipRows.filter(row => present(row.desc))
        .map(row => [row.sn, textOnly(row.desc)]));
    const provisional = [];
    if (translated) {
        for (const [id, row] of Object.entries(translations)) {
            if (tips[id] || !(sourcePacks.kr.tips[id] || sourcePacks.cn.tips[id])) continue;
            tips[id] = row[lang].description;
            provisional.push(Number(id));
        }
    }
    const candidates = new Map();
    const ambiguous = new Set();
    for (const row of skillRows) {
        for (const field of descriptionFields) {
            const markup = row[field];
            if (!present(markup)) continue;
            const key = tooltipText.signature(textOnly(markup));
            if (!key || ambiguous.has(key)) continue;
            const links = readLinks(markup, tips);
            const previous = candidates.get(key);
            if (previous && JSON.stringify(previous) !== JSON.stringify(links)) {
                candidates.delete(key);
                ambiguous.add(key);
                continue;
            }
            candidates.set(key, links);
        }
    }
    // An ambiguous field still suppresses fallback guessing.
    for (const key of ambiguous) candidates.set(key, []);
    if (translated) addTranslatedFields(candidates, lang, sourcePacks, descriptions);
    for (const entry of overrides.filter(row => row.lang === lang)) {
        const text = tooltipText.compact(textOnly(entry.text));
        const key = tooltipText.signature(text);
        assert(key, 'Override description is required');
        const links = entry.links.map(({ id, phrase, occurrence = 1 }) => {
            const label = tooltipText.compact(phrase);
            const starts = tooltipText.occurrences(text, label);
            assert(starts[occurrence - 1] !== undefined, `Override phrase not found: ${phrase}`);
            return [id, label, occurrence - 1, starts.length];
        });
        candidates.set(key, links);
    }
    const fields = Object.fromEntries([...candidates].sort(([a], [b]) => a.localeCompare(b, 'en')));
    return { tips, fields, ...(provisional.length ? { provisional } : {}) };
}

function validate(pack, lang) {
    assert(Object.keys(pack.tips).length, `${lang}: no tooltip definitions`);
    for (const links of Object.values(pack.fields)) {
        assert(Array.isArray(links));
        for (const [id, phrase, ordinal, count] of links) {
            assert(pack.tips[id] && phrase && Number.isInteger(ordinal) && ordinal >= 0 && ordinal < count);
        }
    }
    assert(Object.values(pack.fields).some(links => links.length), `${lang}: no linked fields`);
    for (const id of pack.provisional || []) assert(pack.tips[id] && translations[id]?.[lang], `${lang}: invalid provisional tooltip ${id}`);
}

async function audit(name) {
    assert(name && path.basename(name) === name, 'Supply a character or Persona key');
    const charDir = path.join(root, 'data', 'characters', name);
    const charFiles = await readdir(charDir).catch(error => {
        if (error.code === 'ENOENT') return [];
        throw error;
    });
    const files = charFiles.length
        ? charFiles.filter(file => /^(skill|ritual|innate|weapon)\.js$/u.test(file)).map(file => path.join(charDir, file))
        : [path.join(root, 'data', 'persona', `${name}.js`)];
    const packs = Object.fromEntries(await Promise.all(languages.map(async lang =>
        [lang, await readJson(path.join(output, `${lang}.json`))])));
    const totals = Object.fromEntries(languages.map(lang => [lang, { fields: 0, matched: 0, linked: 0 }]));
    function visit(value, baseLang, label) {
        for (const [key, entry] of Object.entries(value || {})) {
            if (entry !== null && typeof entry === 'object') {
                visit(entry, baseLang, `${label}.${key}`);
                continue;
            }
            if (!present(entry) || !/^(?:description|desc|r\d+_detail)(?:_(?:en|jp|cn))?$/u.test(key)) continue;
            const lang = key.match(/_(en|jp|cn)$/u)?.[1] || baseLang;
            const stats = totals[lang];
            stats.fields++;
            const links = packs[lang].fields[tooltipText.signature(textOnly(entry))];
            if (links) stats.matched++;
            if (links?.length) {
                stats.linked++;
                console.log(`${lang}: ${label}.${key} → ${links.map(([id, phrase]) =>
                    `${id} ${phrase}${packs[lang].provisional?.includes(id) ? ' (provisional)' : ''}`).join(', ')}`);
            }
        }
    }
    for (const file of files) {
        const window = {};
        vm.runInNewContext(await readFile(file, 'utf8'), { window }, { filename: file, timeout: 1000 });
        for (const [key, entries] of Object.entries(window)) {
            const lang = key.match(/^(en|jp|cn)Character/u)?.[1] || 'kr';
            if (entries?.[name]) visit(entries[name], lang, path.basename(file));
        }
    }
    for (const [lang, stats] of Object.entries(totals)) console.log(lang, stats);
}

const mode = process.argv[2];
assert([undefined, '--check', '--validate', '--audit'].includes(mode), 'Use --check, --validate or --audit');
if (mode === '--audit') {
    await audit(process.argv[3]);
    process.exit(0);
}
if (!mode) await mkdir(output, { recursive: true });
const packs = {};
if (mode !== '--validate') {
    for (const lang of ['kr', 'cn']) packs[lang] = await generate(lang);
    const descriptions = await readSiteDescriptions();
    for (const lang of ['en', 'jp']) packs[lang] = await generate(lang, packs, descriptions);
}
for (const lang of languages) {
    const file = path.join(output, `${lang}.json`);
    const pack = mode === '--validate' ? await readJson(file) : packs[lang];
    validate(pack, lang);
    const bytes = JSON.stringify(pack) + '\n';
    if (mode === '--check') assert.equal(await readFile(file, 'utf8'), bytes, `${lang}: regenerate tooltips`);
    if (!mode) await writeFile(file, bytes, 'utf8');
    const linked = Object.values(pack.fields).filter(links => links.length).length;
    console.log(`${lang}: ${Object.keys(pack.tips).length} tips, ${linked} linked fields, ${Buffer.byteLength(bytes)} bytes`);
}
