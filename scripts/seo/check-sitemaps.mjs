#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const SITE_ROOT = path.join(ROOT, '_site');

const INDEX_PATH = path.join(SITE_ROOT, 'sitemap.xml');
const SITEMAP_DEFS = [
  { key: 'core', path: path.join(SITE_ROOT, 'sitemaps', 'sitemap-core.xml'), expectedPath: '/sitemaps/sitemap-core.xml' },
  { key: 'ko', path: path.join(SITE_ROOT, 'sitemaps', 'sitemap-ko.xml'), expectedPath: '/sitemaps/sitemap-ko.xml', prefix: '/kr/' },
  { key: 'en', path: path.join(SITE_ROOT, 'sitemaps', 'sitemap-en.xml'), expectedPath: '/sitemaps/sitemap-en.xml', prefix: '/en/' },
  { key: 'ja', path: path.join(SITE_ROOT, 'sitemaps', 'sitemap-ja.xml'), expectedPath: '/sitemaps/sitemap-ja.xml', prefix: '/jp/' },
  { key: 'zh', path: path.join(SITE_ROOT, 'sitemaps', 'sitemap-zh.xml'), expectedPath: '/sitemaps/sitemap-zh.xml', prefix: '/cn/' }
];

const SOURCE_FILES_WITHOUT_BOM = [
  'sitemap.xml',
  '_includes/sitemap-hreflang-links.xml',
  '_includes/sitemap-url-entry.xml',
  'sitemaps/sitemap-core.xml',
  'sitemaps/sitemap-ko.xml',
  'sitemaps/sitemap-en.xml',
  'sitemaps/sitemap-ja.xml',
  'sitemaps/sitemap-zh.xml',
  'scripts/seo/run-all.mjs',
  'scripts/seo/check-sitemaps.mjs'
];

const ALLOWED_HREFLANG = new Set(['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'x-default']);
const FORBIDDEN_HREFLANG = new Set(['kr', 'jp', 'cn', 'tw']);

function hasUtf8Bom(buffer) {
  return buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
}

function readUtf8WithoutBom(filePath, errors) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing file: ${path.relative(ROOT, filePath).replace(/\\/g, '/')}`);
    return '';
  }
  const raw = fs.readFileSync(filePath);
  if (hasUtf8Bom(raw)) {
    errors.push(`UTF-8 BOM detected: ${path.relative(ROOT, filePath).replace(/\\/g, '/')}`);
  }
  return raw.toString('utf8');
}

function extractLocs(xml) {
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = re.exec(xml)) !== null) {
    locs.push(match[1].trim());
  }
  return locs;
}

function extractHreflangs(xml) {
  const langs = [];
  const re = /hreflang="([^"]+)"/g;
  let match;
  while ((match = re.exec(xml)) !== null) {
    langs.push(match[1].trim());
  }
  return langs;
}

function toPathname(rawUrl) {
  try {
    return new URL(rawUrl).pathname;
  } catch {
    try {
      return new URL(rawUrl, 'https://lufel.net').pathname;
    } catch {
      return null;
    }
  }
}

function normalizePath(rawPath) {
  let out = String(rawPath || '').trim();
  if (!out) return null;

  out = out.replace(/^['"]|['"]$/g, '');
  if (!out) return null;

  if (/^https?:\/\//i.test(out)) {
    const parsed = toPathname(out);
    if (!parsed) return null;
    out = parsed;
  }

  if (!out.startsWith('/')) out = `/${out}`;
  out = out.replace(/index\.html$/i, '');
  if (out.length > 1 && !out.endsWith('/') && !out.endsWith('.html')) {
    out += '/';
  }
  return out;
}

function listHtmlFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const out = [];
  const stack = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && full.toLowerCase().endsWith('.html')) {
        out.push(full);
      }
    }
  }

  return out;
}

function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  return match[1];
}

function collectSitemapFalsePermalinks(errors) {
  const files = [
    ...listHtmlFiles(path.join(ROOT, 'pages')),
    ...listHtmlFiles(path.join(ROOT, 'apps'))
  ];

  const permalinkSet = new Set();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const frontMatter = parseFrontMatter(content);
    if (!frontMatter) continue;
    if (!/^sitemap:\s*false\s*$/m.test(frontMatter)) continue;

    const permalinkMatch = frontMatter.match(/^permalink:\s*(.+)\s*$/m);
    if (!permalinkMatch) {
      errors.push(`sitemap:false page missing permalink: ${path.relative(ROOT, file).replace(/\\/g, '/')}`);
      continue;
    }

    const normalized = normalizePath(permalinkMatch[1]);
    if (!normalized) continue;
    permalinkSet.add(normalized);
  }

  return permalinkSet;
}

function ensureNoDuplicates(locs, label, errors) {
  const counts = new Map();
  for (const loc of locs) {
    counts.set(loc, (counts.get(loc) || 0) + 1);
  }
  for (const [loc, count] of counts.entries()) {
    if (count > 1) {
      errors.push(`Duplicate <loc> in ${label}: ${loc} (count=${count})`);
    }
  }
}

function checkIndex(indexXml, errors) {
  const locs = extractLocs(indexXml);
  const expectedPaths = new Set(SITEMAP_DEFS.map((item) => item.expectedPath));
  const foundPaths = new Set();

  for (const loc of locs) {
    const pathname = toPathname(loc);
    if (!pathname) {
      errors.push(`Invalid sitemap index <loc>: ${loc}`);
      continue;
    }
    foundPaths.add(pathname);
  }

  if (locs.length !== SITEMAP_DEFS.length) {
    errors.push(`sitemap.xml must reference exactly ${SITEMAP_DEFS.length} child sitemaps, got ${locs.length}`);
  }

  for (const expected of expectedPaths) {
    if (!foundPaths.has(expected)) {
      errors.push(`sitemap.xml missing child sitemap: ${expected}`);
    }
  }

  for (const found of foundPaths) {
    if (!expectedPaths.has(found)) {
      errors.push(`sitemap.xml contains unexpected child sitemap: ${found}`);
    }
  }
}

function main() {
  const errors = [];

  for (const relPath of SOURCE_FILES_WITHOUT_BOM) {
    readUtf8WithoutBom(path.join(ROOT, relPath), errors);
  }

  const indexXml = readUtf8WithoutBom(INDEX_PATH, errors);
  if (indexXml) {
    checkIndex(indexXml, errors);
  }

  const allLocPathSet = new Set();
  const allLocs = [];
  const allHreflangs = [];
  const childLocsByKey = {};

  for (const def of SITEMAP_DEFS) {
    const xml = readUtf8WithoutBom(def.path, errors);
    if (!xml) continue;

    const locs = extractLocs(xml);
    const hreflangs = extractHreflangs(xml);
    childLocsByKey[def.key] = [];

    ensureNoDuplicates(locs, path.relative(ROOT, def.path).replace(/\\/g, '/'), errors);

    for (const loc of locs) {
      allLocs.push(loc);
      const pathname = toPathname(loc);
      if (!pathname) {
        errors.push(`Invalid <loc> URL in ${def.key} sitemap: ${loc}`);
        continue;
      }
      childLocsByKey[def.key].push(pathname);
      allLocPathSet.add(pathname);

      if (loc.includes('?')) {
        errors.push(`Query URL detected in sitemap (${def.key}): ${loc}`);
      }

      if (/^\/(character|persona|synergy|wonder-weapon)\/[^/?#]+\/$/i.test(pathname)) {
        errors.push(`Legacy non-language detail URL detected in sitemap (${def.key}): ${pathname}`);
      }

      if (def.prefix) {
        if (!pathname.startsWith(def.prefix)) {
          errors.push(`Wrong language prefix in ${def.key} sitemap: ${pathname}`);
        }
      } else if (/^\/(kr|en|jp|cn)\//.test(pathname)) {
        errors.push(`Language-prefixed URL should not be in core sitemap: ${pathname}`);
      }
    }

    allHreflangs.push(...hreflangs);
  }

  for (const hreflang of allHreflangs) {
    const lower = hreflang.toLowerCase();
    if (FORBIDDEN_HREFLANG.has(lower)) {
      errors.push(`Forbidden hreflang found: ${hreflang}`);
      continue;
    }
    if (!ALLOWED_HREFLANG.has(hreflang)) {
      errors.push(`Unexpected hreflang found: ${hreflang}`);
    }
  }

  const sitemapFalsePermalinks = collectSitemapFalsePermalinks(errors);
  for (const permalink of sitemapFalsePermalinks) {
    if (allLocPathSet.has(permalink)) {
      errors.push(`sitemap:false permalink leaked into sitemap: ${permalink}`);
    }
  }

  const zhPaths = childLocsByKey.zh || [];
  if (!zhPaths.includes('/cn/astrolabe/')) {
    errors.push('CN sitemap must contain /cn/astrolabe/');
  }
  for (const p of zhPaths) {
    if (!p.startsWith('/cn/astrolabe/')) {
      errors.push(`CN sitemap contains unexpected URL: ${p}`);
    }
  }

  if (errors.length > 0) {
    console.error('Sitemap checks failed:');
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    process.exit(1);
  }

  console.log(`Sitemap checks passed. Indexed URLs: ${allLocs.length}`);
}

main();
