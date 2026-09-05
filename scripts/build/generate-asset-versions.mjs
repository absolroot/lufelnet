#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..', '..');
const OUTPUT_PATH = path.join(PROJECT_ROOT, '_data', 'asset_versions.json');
const HASH_LENGTH = 16;

// These sets only define which files are discovered. Every output value is
// calculated from one file's own bytes; no shared/group hash is produced.
const ASSET_SETS = Object.freeze({
  styles: {
    roots: ['assets', 'apps'],
    extensions: new Set(['.css']),
    excludedPrefixes: ['apps/patch-console/']
  },
  scripts: {
    roots: ['assets/js', 'apps', 'i18n'],
    extensions: new Set(['.js', '.mjs']),
    excludedPrefixes: ['apps/patch-console/']
  },
  data: {
    roots: ['data'],
    extensions: null,
    excludedPrefixes: ['data/external/before/']
  }
});

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function isExcluded(relativePath, excludedPrefixes) {
  return excludedPrefixes.some((prefix) => relativePath.startsWith(prefix));
}

function collectFiles(group) {
  const files = [];

  function visit(absolutePath) {
    const entries = fs.readdirSync(absolutePath, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name, 'en'));

    for (const entry of entries) {
      const childPath = path.join(absolutePath, entry.name);
      const relativePath = normalizePath(path.relative(PROJECT_ROOT, childPath));
      if (isExcluded(relativePath + (entry.isDirectory() ? '/' : ''), group.excludedPrefixes)) continue;
      if (entry.isDirectory()) {
        visit(childPath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (group.extensions && !group.extensions.has(path.extname(entry.name).toLowerCase())) continue;
      files.push({ absolutePath: childPath, relativePath });
    }
  }

  for (const root of group.roots) {
    const absoluteRoot = path.join(PROJECT_ROOT, root);
    if (fs.existsSync(absoluteRoot)) visit(absoluteRoot);
  }

  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'en'));
}

function hashFile(file) {
  return crypto.createHash('sha256')
    .update(fs.readFileSync(file.absolutePath))
    .digest('hex')
    .slice(0, HASH_LENGTH);
}

function buildManifest() {
  const filesByPath = new Map();
  for (const assetSet of Object.values(ASSET_SETS)) {
    for (const file of collectFiles(assetSet)) {
      filesByPath.set(file.relativePath, file);
    }
  }

  const serviceWorkerPath = path.join(PROJECT_ROOT, 'sw.js');
  filesByPath.set('sw.js', {
    absolutePath: serviceWorkerPath,
    relativePath: 'sw.js'
  });

  const files = {};
  for (const relativePath of [...filesByPath.keys()].sort((a, b) => a.localeCompare(b, 'en'))) {
    files[`/${relativePath}`] = hashFile(filesByPath.get(relativePath));
  }

  return { schema: 1, files };
}

export function generateAssetVersions({ check = false } = {}) {
  const manifest = buildManifest();
  const output = `${JSON.stringify(manifest, null, 2)}\n`;
  const current = fs.existsSync(OUTPUT_PATH) ? fs.readFileSync(OUTPUT_PATH, 'utf8') : '';
  const changed = current !== output;

  if (check) {
    if (changed) {
      throw new Error(`${normalizePath(path.relative(PROJECT_ROOT, OUTPUT_PATH))} is out of date`);
    }
  } else if (changed) {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
  }

  return { changed, manifest, outputPath: OUTPUT_PATH };
}

function runCli() {
  const check = process.argv.includes('--check');
  try {
    const result = generateAssetVersions({ check });
    const action = check ? 'verified' : (result.changed ? 'updated' : 'unchanged');
    console.log(`Asset versions ${action}: ${Object.keys(result.manifest.files).length} files`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (path.resolve(process.argv[1] || '') === SCRIPT_PATH) {
  runCli();
}
