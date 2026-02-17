#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const SOURCE_ROOTS = ['_includes', '_layouts', 'apps', 'assets/js'];
const LEGACY_SCAN_ROOTS = ['_includes', '_layouts', 'apps', 'assets/js', 'scripts'];
const SOURCE_EXTENSIONS = new Set(['.js', '.html']);
const ALLOW_DIRECT_WRITERS = new Set([
  'assets/js/seo/engine.js'
]);

const DIRECT_WRITER_PATTERNS = [
  /document\.title\s*=/,
  /setAttribute\(\s*['"]content['"]/,
  /link\[rel=['"]canonical['"]\]/,
  /upsertMetaByName\s*\(/,
  /upsertMetaByProperty\s*\(/
];

const LEGACY_PATTERN = /\b(?:SeoEngine\.)?applyLegacyMeta\s*\(/;

function toPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

function listSourceFiles(startDir) {
  const files = [];
  if (!fs.existsSync(startDir)) return files;

  const walk = (currentDir) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (!SOURCE_EXTENSIONS.has(ext)) continue;
      files.push(fullPath);
    }
  };

  walk(startDir);
  return files;
}

function listAllTextFiles(startDir) {
  const files = [];
  if (!fs.existsSync(startDir)) return files;

  const walk = (currentDir) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '_site') continue;
        walk(fullPath);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (!['.js', '.mjs', '.cjs', '.ts', '.html', '.md'].includes(ext)) continue;
      files.push(fullPath);
    }
  };

  walk(startDir);
  return files;
}

function main() {
  const offenders = [];

  const sourceFiles = SOURCE_ROOTS
    .flatMap((relRoot) => listSourceFiles(path.join(ROOT, relRoot)))
    .sort((a, b) => a.localeCompare(b));

  for (const fullPath of sourceFiles) {
    const relPath = toPosix(path.relative(ROOT, fullPath));
    if (ALLOW_DIRECT_WRITERS.has(relPath)) continue;

    const text = fs.readFileSync(fullPath, 'utf8');
    if (DIRECT_WRITER_PATTERNS.some((pattern) => pattern.test(text))) {
      offenders.push(`${relPath}: has direct SEO writer; SeoEngine must be sole writer`);
    }
  }

  const allTextFiles = LEGACY_SCAN_ROOTS
    .flatMap((relRoot) => listAllTextFiles(path.join(ROOT, relRoot)))
    .sort((a, b) => a.localeCompare(b));
  for (const fullPath of allTextFiles) {
    const relPath = toPosix(path.relative(ROOT, fullPath));
    const text = fs.readFileSync(fullPath, 'utf8');
    if (LEGACY_PATTERN.test(text)) {
      offenders.push(`${relPath}: uses applyLegacyMeta; this API is forbidden`);
    }
  }

  if (offenders.length > 0) {
    console.error('SEO writer check failed:');
    for (const line of offenders) {
      console.error(`- ${line}`);
    }
    process.exit(1);
  }

  console.log(`SEO writer check passed (${sourceFiles.length} source files scanned).`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
