import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const CONFIG_KR_ROOT = path.join(PROJECT_ROOT, '_config', 'Config_KR');
const CONFIG_CN_ROOT = path.join(PROJECT_ROOT, '_config', 'Config_CN');
const DATA_ROOT = path.join(PROJECT_ROOT, 'data');
const I18N_ROOT = path.join(PROJECT_ROOT, 'i18n');
const CN_AUDIT_ROOT = path.join(PROJECT_ROOT, '.tmp', 'cn-audit');
const CN_AUDIT_REPORT_ROOT = path.join(CN_AUDIT_ROOT, 'reports', 'generate-cn-i18n');
const COMMON_KR_FILE = path.join(I18N_ROOT, 'common', 'kr.js');
const COMMON_CN_FILE = path.join(I18N_ROOT, 'common', 'cn.js');
const PAGES_ROOT = path.join(I18N_ROOT, 'pages');
const REPORT_FILE = path.join(CN_AUDIT_REPORT_ROOT, 'report.json');

const PLACEHOLDER_VALUE = 'AAAAAA==';
const CONFIG_PAIR_SEPARATOR = '\u0000';
const SAFE_COMMON_SECTIONS = new Set([
    'gameTerms',
    'awarenessLevel',
    'refinement',
    'turns',
    'elements',
    'ailments',
    'positions',
    'revelation'
]);
const SEED_BUNDLE_TARGETS = new Set([
    path.join('i18n', 'pages', 'astrolabe', 'cn.js')
]);
const AMBIGUOUS_AUTO_TRANSLATION_VALUES = new Set([
    '수정'
]);
const ARRAY_ALIGNMENT_FIELDS = [
    'sn',
    'id',
    'ID',
    'key',
    'name',
    'title',
    'type',
    'itemId',
    'skillId'
];

function listFilesRecursive(rootDir, predicate) {
    const results = [];
    const stack = [rootDir];

    while (stack.length > 0) {
        const currentDir = stack.pop();
        for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                stack.push(fullPath);
                continue;
            }
            if (!entry.isFile()) continue;
            if (!predicate || predicate(fullPath)) {
                results.push(fullPath);
            }
        }
    }

    return results.sort((a, b) => a.localeCompare(b));
}

function normalizeComparable(value) {
    return String(value || '').replace(/\s+/g, '');
}

function isMeaningfulConfigString(value) {
    return typeof value === 'string' && value.trim() !== '' && value !== PLACEHOLDER_VALUE;
}

function loadJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadWindowAssignment(filePath, variableName) {
    const code = fs.readFileSync(filePath, 'utf8');
    const context = { window: {} };
    vm.createContext(context);
    vm.runInContext(code, context, { filename: filePath });
    return context.window[variableName];
}

function getBundleVariableName(kind, pageName, lang) {
    if (kind === 'common') {
        return `I18N_COMMON_${lang.toUpperCase()}`;
    }
    const pageToken = pageName.toUpperCase().replace(/-/g, '_');
    return `I18N_PAGE_${pageToken}_${lang.toUpperCase()}`;
}

function serializeBundle(variableName, data) {
    const json = JSON.stringify(data, null, 4);
    return `window.${variableName} = ${json};\n`;
}

function ensureParentDir(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function createTranslationBucket() {
    return {
        exactIndex: new Map(),
        normalizedIndex: new Map(),
        exactSources: new Map(),
        normalizedSources: new Map()
    };
}

function registerTranslation(bucket, sourceValue, translatedValue, source) {
    if (!isMeaningfulConfigString(sourceValue) || !isMeaningfulConfigString(translatedValue)) {
        return false;
    }

    function register(index, sourceIndex, key, targetValue, sourceMeta) {
        if (!index.has(key)) {
            index.set(key, new Set());
        }
        index.get(key).add(targetValue);

        const pairKey = `${key}${CONFIG_PAIR_SEPARATOR}${targetValue}`;
        if (!sourceIndex.has(pairKey)) {
            sourceIndex.set(pairKey, sourceMeta);
        }
    }

    register(bucket.exactIndex, bucket.exactSources, sourceValue, translatedValue, source);

    const normalizedKey = normalizeComparable(sourceValue);
    if (normalizedKey) {
        register(bucket.normalizedIndex, bucket.normalizedSources, normalizedKey, translatedValue, source);
    }

    return true;
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isScalarIdentifier(value) {
    return ['string', 'number'].includes(typeof value) && String(value).trim() !== '';
}

function arraysContainOnlyPrimitives(array) {
    return array.every((item) => item === null || ['string', 'number', 'boolean'].includes(typeof item));
}

function detectArrayAlignmentField(krArray, cnArray) {
    if (krArray.length === 0 || cnArray.length === 0) return null;
    if (!krArray.every(isPlainObject) || !cnArray.every(isPlainObject)) return null;

    for (const field of ARRAY_ALIGNMENT_FIELDS) {
        const krValues = krArray.map((item) => item[field]);
        const cnValues = cnArray.map((item) => item[field]);
        if (!krValues.every(isScalarIdentifier) || !cnValues.every(isScalarIdentifier)) {
            continue;
        }

        const krKeys = krValues.map(String);
        const cnKeys = cnValues.map(String);
        if (new Set(krKeys).size !== krKeys.length || new Set(cnKeys).size !== cnKeys.length) {
            continue;
        }

        if (krKeys.length !== cnKeys.length) continue;

        const cnKeySet = new Set(cnKeys);
        if (krKeys.every((key) => cnKeySet.has(key))) {
            return field;
        }
    }

    return null;
}

function walkAlignedJsonNodes(krNode, cnNode, bucket, sourceBase, stats, pathSegments = []) {
    if (typeof krNode === 'string' || typeof cnNode === 'string') {
        if (typeof krNode === 'string' && typeof cnNode === 'string') {
            if (registerTranslation(bucket, krNode, cnNode, {
                ...sourceBase,
                jsonPath: pathSegments.join('.') || '<root>'
            })) {
                stats.recordedPairs += 1;
            }
        }
        return;
    }

    if (Array.isArray(krNode)) {
        if (!Array.isArray(cnNode)) return;

        const alignmentField = detectArrayAlignmentField(krNode, cnNode);
        if (alignmentField) {
            const cnByKey = new Map(cnNode.map((item) => [String(item[alignmentField]), item]));
            for (const item of krNode) {
                const key = String(item[alignmentField]);
                const cnItem = cnByKey.get(key);
                if (!cnItem) continue;
                walkAlignedJsonNodes(item, cnItem, bucket, sourceBase, stats, [...pathSegments, `${alignmentField}:${key}`]);
            }
            return;
        }

        if (krNode.length !== cnNode.length || !arraysContainOnlyPrimitives(krNode) || !arraysContainOnlyPrimitives(cnNode)) {
            return;
        }

        for (let index = 0; index < krNode.length; index += 1) {
            walkAlignedJsonNodes(krNode[index], cnNode[index], bucket, sourceBase, stats, [...pathSegments, String(index)]);
        }
        return;
    }

    if (isPlainObject(krNode) && isPlainObject(cnNode)) {
        for (const key of Object.keys(krNode)) {
            if (!(key in cnNode)) continue;
            walkAlignedJsonNodes(krNode[key], cnNode[key], bucket, sourceBase, stats, [...pathSegments, key]);
        }
    }
}

function loadWindowData(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    const context = {
        window: {},
        BASE_URL: ''
    };
    context.globalThis = context;
    context.self = context.window;
    vm.createContext(context);
    vm.runInContext(code, context, { filename: filePath });
    return context.window;
}

function collectSiblingLanguagePairs(node, bucket, sourceBase, stats, pathSegments = []) {
    if (Array.isArray(node)) {
        node.forEach((item, index) => {
            collectSiblingLanguagePairs(item, bucket, sourceBase, stats, [...pathSegments, String(index)]);
        });
        return;
    }

    if (!isPlainObject(node)) return;

    for (const [field, cnValue] of Object.entries(node)) {
        if (!field.endsWith('_cn')) continue;
        if (!isMeaningfulConfigString(cnValue)) continue;

        const baseField = field.slice(0, -3);
        const krField = `${baseField}_kr` in node
            ? `${baseField}_kr`
            : (baseField in node ? baseField : null);

        if (!krField || !isMeaningfulConfigString(node[krField])) {
            continue;
        }

        if (registerTranslation(bucket, node[krField], cnValue, {
            ...sourceBase,
            dataPath: pathSegments.join('.') || '<root>',
            krField,
            cnField: field
        })) {
            stats.recordedPairs += 1;
        }
    }

    for (const [key, value] of Object.entries(node)) {
        collectSiblingLanguagePairs(value, bucket, sourceBase, stats, [...pathSegments, key]);
    }
}

function buildConfigTranslationIndex() {
    const krFiles = listFilesRecursive(CONFIG_KR_ROOT, (filePath) => filePath.endsWith('.json'));
    const bucket = createTranslationBucket();
    let totalJsonPairs = 0;
    let exactSnMatchPairs = 0;
    let mismatchedPairs = 0;
    let noSnPairs = 0;
    let recordedPairs = 0;
    const mismatchSamples = [];

    for (const krFile of krFiles) {
        const relativePath = path.relative(CONFIG_KR_ROOT, krFile);
        const cnFile = path.join(CONFIG_CN_ROOT, relativePath);
        if (!fs.existsSync(cnFile)) continue;

        totalJsonPairs += 1;

        const krData = loadJson(krFile);
        const cnData = loadJson(cnFile);
        if (!Array.isArray(krData) || !Array.isArray(cnData)) continue;

        const krRecords = krData.filter((item) => item && typeof item === 'object' && 'sn' in item);
        const cnRecords = cnData.filter((item) => item && typeof item === 'object' && 'sn' in item);

        if (krRecords.length === 0 || cnRecords.length === 0) {
            noSnPairs += 1;
            continue;
        }

        const cnBySn = new Map(cnRecords.map((item) => [String(item.sn), item]));
        const krSnList = krRecords.map((item) => String(item.sn));
        const cnSnSet = new Set(cnRecords.map((item) => String(item.sn)));
        const sharedSnCount = krSnList.filter((sn) => cnSnSet.has(sn)).length;

        if (sharedSnCount === krSnList.length && krRecords.length === cnRecords.length) {
            exactSnMatchPairs += 1;
        } else {
            mismatchedPairs += 1;
            if (mismatchSamples.length < 20) {
                mismatchSamples.push({
                    relativePath,
                    krCount: krRecords.length,
                    cnCount: cnRecords.length,
                    sharedSnCount
                });
            }
        }

        for (const krRecord of krRecords) {
            const recordSn = String(krRecord.sn);
            const cnRecord = cnBySn.get(recordSn);
            if (!cnRecord) continue;

            for (const [field, krValue] of Object.entries(krRecord)) {
                const cnValue = cnRecord[field];
                if (registerTranslation(bucket, krValue, cnValue, {
                    relativePath,
                    sn: recordSn,
                    field
                })) {
                    recordedPairs += 1;
                }
            }
        }
    }

    return {
        ...bucket,
        summary: {
            totalJsonPairs,
            exactSnMatchPairs,
            mismatchedPairs,
            noSnPairs,
            recordedPairs,
            mismatchSamples
        }
    };
}

function buildDetailedConfigTranslationIndex() {
    const krFiles = listFilesRecursive(CONFIG_KR_ROOT, (filePath) => filePath.endsWith('.json'));
    const bucket = createTranslationBucket();
    let totalJsonPairs = 0;
    let alignedFiles = 0;
    let recordedPairs = 0;

    for (const krFile of krFiles) {
        const relativePath = path.relative(CONFIG_KR_ROOT, krFile);
        const cnFile = path.join(CONFIG_CN_ROOT, relativePath);
        if (!fs.existsSync(cnFile)) continue;

        totalJsonPairs += 1;

        const stats = { recordedPairs: 0 };
        walkAlignedJsonNodes(
            loadJson(krFile),
            loadJson(cnFile),
            bucket,
            { relativePath },
            stats
        );

        if (stats.recordedPairs > 0) {
            alignedFiles += 1;
            recordedPairs += stats.recordedPairs;
        }
    }

    return {
        ...bucket,
        summary: {
            totalJsonPairs,
            alignedFiles,
            recordedPairs
        }
    };
}

function buildDataTranslationIndex() {
    const bucket = createTranslationBucket();
    const jsFiles = listFilesRecursive(DATA_ROOT, (filePath) => filePath.endsWith('.js') && fs.readFileSync(filePath, 'utf8').includes('_cn'));
    const jsonFiles = listFilesRecursive(DATA_ROOT, (filePath) => filePath.endsWith('.json') && fs.readFileSync(filePath, 'utf8').includes('_cn'));
    const failedFiles = [];
    let recordedPairs = 0;

    for (const jsFile of jsFiles) {
        try {
            const windowData = loadWindowData(jsFile);
            const stats = { recordedPairs: 0 };
            collectSiblingLanguagePairs(windowData, bucket, {
                relativePath: path.relative(PROJECT_ROOT, jsFile),
                sourceKind: 'script'
            }, stats);
            recordedPairs += stats.recordedPairs;
        } catch (error) {
            failedFiles.push({
                relativePath: path.relative(PROJECT_ROOT, jsFile),
                message: error.message
            });
        }
    }

    for (const jsonFile of jsonFiles) {
        try {
            const stats = { recordedPairs: 0 };
            collectSiblingLanguagePairs(loadJson(jsonFile), bucket, {
                relativePath: path.relative(PROJECT_ROOT, jsonFile),
                sourceKind: 'json'
            }, stats);
            recordedPairs += stats.recordedPairs;
        } catch (error) {
            failedFiles.push({
                relativePath: path.relative(PROJECT_ROOT, jsonFile),
                message: error.message
            });
        }
    }

    return {
        ...bucket,
        summary: {
            jsFiles: jsFiles.length,
            jsonFiles: jsonFiles.length,
            recordedPairs,
            failedFiles
        }
    };
}

function resolveTranslationCandidate(value, index, sourceIndex, useNormalizedKey = false) {
    const key = useNormalizedKey ? normalizeComparable(value) : value;
    if (!key || !index.has(key)) {
        return null;
    }

    const candidates = Array.from(index.get(key)).sort((a, b) => a.localeCompare(b));
    if (candidates.length !== 1) {
        return {
            mode: useNormalizedKey ? 'ambiguous-normalized' : 'ambiguous-exact',
            candidates
        };
    }

    const translatedValue = candidates[0];
    const pairKey = `${key}${CONFIG_PAIR_SEPARATOR}${translatedValue}`;
    return {
        mode: useNormalizedKey ? 'normalized' : 'exact',
        translatedValue,
        source: sourceIndex.get(pairKey) || null
    };
}

function translateBundle({ bundleKind, bundleName, krData, seedData, translationIndex }) {
    const counters = {
        configExact: 0,
        configNormalized: 0,
        dataExact: 0,
        dataNormalized: 0,
        structuredConfigExact: 0,
        structuredConfigNormalized: 0,
        alias: 0,
        seed: 0,
        fallback: 0
    };
    const unresolved = [];
    const translatedByPath = new Map();
    const totalStringLeaves = { count: 0 };

    function translateNode(node, seedNode, pathSegments) {
        if (typeof node === 'string') {
            totalStringLeaves.count += 1;
            const pathKey = pathSegments.join('.');
            const allowAutoTranslation =
                bundleKind !== 'common' || SAFE_COMMON_SECTIONS.has(pathSegments[0]);
            const normalizedNode = normalizeComparable(node);
            const allowRiskyStringTranslation =
                normalizedNode.length >= 2 && !AMBIGUOUS_AUTO_TRANSLATION_VALUES.has(node);
            const ambiguousCandidates = {
                configExactCandidates: [],
                configNormalizedCandidates: [],
                dataExactCandidates: [],
                dataNormalizedCandidates: [],
                structuredConfigExactCandidates: [],
                structuredConfigNormalizedCandidates: []
            };
            const translationSteps = allowAutoTranslation && allowRiskyStringTranslation
                ? [
                    {
                        counterKey: 'configExact',
                        candidateKey: 'configExactCandidates',
                        useNormalizedKey: false,
                        index: translationIndex.config.exactIndex,
                        sourceIndex: translationIndex.config.exactSources
                    },
                    {
                        counterKey: 'configNormalized',
                        candidateKey: 'configNormalizedCandidates',
                        useNormalizedKey: true,
                        index: translationIndex.config.normalizedIndex,
                        sourceIndex: translationIndex.config.normalizedSources
                    },
                    {
                        counterKey: 'dataExact',
                        candidateKey: 'dataExactCandidates',
                        useNormalizedKey: false,
                        index: translationIndex.data.exactIndex,
                        sourceIndex: translationIndex.data.exactSources
                    },
                    {
                        counterKey: 'dataNormalized',
                        candidateKey: 'dataNormalizedCandidates',
                        useNormalizedKey: true,
                        index: translationIndex.data.normalizedIndex,
                        sourceIndex: translationIndex.data.normalizedSources
                    },
                    {
                        counterKey: 'structuredConfigExact',
                        candidateKey: 'structuredConfigExactCandidates',
                        useNormalizedKey: false,
                        index: translationIndex.structuredConfig.exactIndex,
                        sourceIndex: translationIndex.structuredConfig.exactSources
                    },
                    {
                        counterKey: 'structuredConfigNormalized',
                        candidateKey: 'structuredConfigNormalizedCandidates',
                        useNormalizedKey: true,
                        index: translationIndex.structuredConfig.normalizedIndex,
                        sourceIndex: translationIndex.structuredConfig.normalizedSources
                    }
                ]
                : [];

            for (const step of translationSteps) {
                const hit = resolveTranslationCandidate(node, step.index, step.sourceIndex, step.useNormalizedKey);
                if (hit && ['exact', 'normalized'].includes(hit.mode)) {
                    counters[step.counterKey] += 1;
                    translatedByPath.set(pathKey, hit.translatedValue);
                    return hit.translatedValue;
                }

                if (hit && hit.mode.startsWith('ambiguous')) {
                    ambiguousCandidates[step.candidateKey] = hit.candidates.slice(0, 10);
                }
            }

            const currentKey = pathSegments[pathSegments.length - 1] || '';
            if (
                bundleKind === 'common' &&
                pathSegments[0] === 'gameTerms' &&
                currentKey.endsWith('Alt')
            ) {
                const basePath = [...pathSegments.slice(0, -1), currentKey.slice(0, -3)].join('.');
                if (translatedByPath.has(basePath)) {
                    const aliasedValue = translatedByPath.get(basePath);
                    counters.alias += 1;
                    translatedByPath.set(pathKey, aliasedValue);
                    return aliasedValue;
                }
            }

            if (typeof seedNode === 'string' && seedNode.trim() !== '') {
                counters.seed += 1;
                translatedByPath.set(pathKey, seedNode);
                return seedNode;
            }

            counters.fallback += 1;
            translatedByPath.set(pathKey, node);

            unresolved.push({
                path: pathKey,
                krValue: node,
                ...ambiguousCandidates
            });
            return node;
        }

        if (Array.isArray(node)) {
            return node.map((item, index) => {
                const nextSeed = Array.isArray(seedNode) ? seedNode[index] : undefined;
                return translateNode(item, nextSeed, [...pathSegments, String(index)]);
            });
        }

        if (node && typeof node === 'object') {
            const translatedObject = {};
            for (const key of Object.keys(node)) {
                const nextSeed = seedNode && typeof seedNode === 'object' ? seedNode[key] : undefined;
                translatedObject[key] = translateNode(node[key], nextSeed, [...pathSegments, key]);
            }
            return translatedObject;
        }

        return node;
    }

    const translatedData = translateNode(krData, seedData, []);

    return {
        translatedData,
        report: {
            bundleKind,
            bundleName,
            totalStringLeaves: totalStringLeaves.count,
            translated: counters,
            unresolved
        }
    };
}

function loadOptionalBundle(filePath, variableName, allowSeed = false) {
    if (!allowSeed || !fs.existsSync(filePath)) return undefined;
    return loadWindowAssignment(filePath, variableName);
}

function buildBundleJobs() {
    const jobs = [
        {
            kind: 'common',
            name: 'common',
            krFile: COMMON_KR_FILE,
            cnFile: COMMON_CN_FILE,
            variableNameKr: getBundleVariableName('common', null, 'kr'),
            variableNameCn: getBundleVariableName('common', null, 'cn'),
            allowSeed: false
        }
    ];

    const pageDirs = fs.readdirSync(PAGES_ROOT, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));

    for (const pageName of pageDirs) {
        const krFile = path.join(PAGES_ROOT, pageName, 'kr.js');
        if (!fs.existsSync(krFile)) continue;

        jobs.push({
            kind: 'page',
            name: pageName,
            krFile,
            cnFile: path.join(PAGES_ROOT, pageName, 'cn.js'),
            variableNameKr: getBundleVariableName('page', pageName, 'kr'),
            variableNameCn: getBundleVariableName('page', pageName, 'cn'),
            allowSeed: SEED_BUNDLE_TARGETS.has(path.join('i18n', 'pages', pageName, 'cn.js'))
        });
    }

    return jobs;
}

function validateShapes(krNode, cnNode, pathSegments = []) {
    const location = pathSegments.join('.') || '<root>';

    if (Array.isArray(krNode)) {
        if (!Array.isArray(cnNode) || krNode.length !== cnNode.length) {
            throw new Error(`Shape mismatch at ${location}: array length changed`);
        }
        for (let index = 0; index < krNode.length; index += 1) {
            validateShapes(krNode[index], cnNode[index], [...pathSegments, String(index)]);
        }
        return;
    }

    if (krNode && typeof krNode === 'object') {
        if (!cnNode || typeof cnNode !== 'object' || Array.isArray(cnNode)) {
            throw new Error(`Shape mismatch at ${location}: expected object`);
        }

        const krKeys = Object.keys(krNode);
        const cnKeys = Object.keys(cnNode);
        if (krKeys.length !== cnKeys.length || krKeys.some((key, index) => key !== cnKeys[index])) {
            throw new Error(`Shape mismatch at ${location}: object keys changed`);
        }

        for (const key of krKeys) {
            validateShapes(krNode[key], cnNode[key], [...pathSegments, key]);
        }
        return;
    }

    if (typeof krNode !== typeof cnNode) {
        throw new Error(`Shape mismatch at ${location}: type ${typeof krNode} -> ${typeof cnNode}`);
    }
}

function main() {
    const translationIndex = {
        config: buildConfigTranslationIndex(),
        structuredConfig: buildDetailedConfigTranslationIndex(),
        data: buildDataTranslationIndex()
    };
    const bundleJobs = buildBundleJobs();
    const bundleReports = [];

    for (const job of bundleJobs) {
        const krData = loadWindowAssignment(job.krFile, job.variableNameKr);
        const seedData = loadOptionalBundle(job.cnFile, job.variableNameCn, job.allowSeed);
        const { translatedData, report } = translateBundle({
            bundleKind: job.kind,
            bundleName: job.name,
            krData,
            seedData,
            translationIndex
        });

        validateShapes(krData, translatedData);
        ensureParentDir(job.cnFile);
        fs.writeFileSync(job.cnFile, serializeBundle(job.variableNameCn, translatedData), 'utf8');

        bundleReports.push({
            ...report,
            sourceFile: path.relative(PROJECT_ROOT, job.krFile),
            targetFile: path.relative(PROJECT_ROOT, job.cnFile)
        });
    }

    const reportData = {
        generatedAt: new Date().toISOString(),
        configSummary: translationIndex.config.summary,
        structuredConfigSummary: translationIndex.structuredConfig.summary,
        dataSummary: translationIndex.data.summary,
        bundleSummary: bundleReports.map((report) => ({
            bundleKind: report.bundleKind,
            bundleName: report.bundleName,
            sourceFile: report.sourceFile,
            targetFile: report.targetFile,
            totalStringLeaves: report.totalStringLeaves,
            translated: report.translated,
            unresolvedCount: report.unresolved.length
        })),
        unresolved: bundleReports
            .filter((report) => report.unresolved.length > 0)
            .map((report) => ({
                bundleKind: report.bundleKind,
                bundleName: report.bundleName,
                targetFile: report.targetFile,
                unresolved: report.unresolved
            }))
    };

    ensureParentDir(REPORT_FILE);
    fs.writeFileSync(REPORT_FILE, `${JSON.stringify(reportData, null, 2)}\n`, 'utf8');

    const translatedCounterKeys = Object.keys(bundleReports[0]?.translated || {});
    const totals = bundleReports.reduce((acc, report) => {
        acc.totalStringLeaves += report.totalStringLeaves;
        for (const key of translatedCounterKeys) {
            acc.translated[key] += report.translated[key];
        }
        acc.unresolved += report.unresolved.length;
        return acc;
    }, {
        totalStringLeaves: 0,
        translated: Object.fromEntries(translatedCounterKeys.map((key) => [key, 0])),
        unresolved: 0
    });

    console.log(JSON.stringify({
        generatedBundles: bundleReports.length,
        totalStringLeaves: totals.totalStringLeaves,
        translated: totals.translated,
        unresolved: totals.unresolved,
        reportFile: path.relative(PROJECT_ROOT, REPORT_FILE)
    }, null, 2));
}

main();
