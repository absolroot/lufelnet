#!/usr/bin/env node

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..', '..');
const MANIFEST_PATH = path.join(PROJECT_ROOT, '_data', 'asset_versions.json');
const HASH_PATTERN = /^[0-9a-f]{16}$/;
const TEXT_EXTENSIONS = new Set(['.css', '.csv', '.js', '.json', '.md', '.mjs', '.txt']);

function contentHash(content, assetPath) {
  const normalized = TEXT_EXTENSIONS.has(path.extname(assetPath).toLowerCase())
    ? Buffer.from(content.toString('utf8').replace(/\r\n?/g, '\n'), 'utf8')
    : content;
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

function readAsset(assetPath) {
  return fs.readFileSync(path.join(PROJECT_ROOT, assetPath.slice(1)));
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
assert.deepEqual(Object.keys(manifest).sort(), ['files', 'schema']);
assert.equal(manifest.schema, 1);
assert.ok(Object.keys(manifest.files).length > 0);

for (const [assetPath, hash] of Object.entries(manifest.files)) {
  assert.ok(assetPath.startsWith('/'), `Invalid asset path: ${assetPath}`);
  assert.match(hash, HASH_PATTERN, `Invalid hash for ${assetPath}`);
}

const representativeAssets = [
  '/assets/css/default/common.css',
  '/assets/js/version-runtime.js',
  '/data/character_info.js',
  '/sw.js'
];

for (const assetPath of representativeAssets) {
  assert.equal(
    manifest.files[assetPath],
    contentHash(readAsset(assetPath), assetPath),
    `${assetPath} must use its own file content hash`
  );
}

const cssPath = '/assets/css/default/common.css';
const jsPath = '/assets/js/version-runtime.js';
const dataPath = '/data/character_info.js';
const cssHashBefore = contentHash(readAsset(cssPath), cssPath);
const jsHashBefore = contentHash(readAsset(jsPath), jsPath);
const dataBytes = readAsset(dataPath);
const simulatedDataHashAfter = contentHash(
  Buffer.concat([dataBytes, Buffer.from('\n/* data-only-build-test */\n')]),
  dataPath
);

assert.equal(contentHash(readAsset(cssPath), cssPath), cssHashBefore);
assert.equal(contentHash(readAsset(jsPath), jsPath), jsHashBefore);
assert.notEqual(simulatedDataHashAfter, manifest.files[dataPath]);

console.log(`Verified ${Object.keys(manifest.files).length} independent per-file content hashes.`);
console.log('A simulated data-only change leaves representative CSS and JS hashes unchanged.');
