#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { parse } from '@babel/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const PAGES_ROOT = path.join(ROOT, 'i18n', 'pages');
const TARGET_JS_FILES = new Set(['kr.js', 'en.js', 'jp.js', 'cn.js']);

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function hasUtf8Bom(buffer) {
  return buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
}

function listTargetFiles(dirPath) {
  const out = [];
  if (!fs.existsSync(dirPath)) return out;

  const stack = [dirPath];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (TARGET_JS_FILES.has(entry.name) || entry.name === 'seo-meta.json') {
        out.push(fullPath);
      }
    }
  }

  return out.sort((a, b) => a.localeCompare(b));
}

function addBomIssue(issues, relPath, hasBom) {
  if (!hasBom) return;
  issues.push({
    file: relPath,
    line: 1,
    key: '<bom>',
    raw: 'UTF-8 BOM'
  });
}

function pushIssue(issues, relPath, line, key, raw) {
  issues.push({
    file: relPath,
    line,
    key: key || '<unknown>',
    raw
  });
}

function getPropertyKey(node) {
  if (!node) return '<unknown>';
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'StringLiteral' || node.type === 'NumericLiteral') return String(node.value);
  return '<computed>';
}

function collectTextEscapes(raw) {
  const hits = [];
  for (let index = 0; index < raw.length; index += 1) {
    if (raw[index] !== '\\') continue;

    let slashCount = 1;
    for (let cursor = index - 1; cursor >= 0 && raw[cursor] === '\\'; cursor -= 1) {
      slashCount += 1;
    }
    if (slashCount % 2 === 0) continue;

    if (raw[index + 1] === 'u') {
      const fixed = raw.slice(index + 2, index + 6);
      if (/^[0-9A-Fa-f]{4}$/.test(fixed)) {
        hits.push(raw.slice(index, index + 6));
        continue;
      }

      if (raw[index + 2] === '{') {
        const end = raw.indexOf('}', index + 3);
        if (end !== -1) {
          const codePoint = raw.slice(index + 3, end);
          if (/^[0-9A-Fa-f]+$/.test(codePoint)) {
            hits.push(raw.slice(index, end + 1));
          }
        }
      }
      continue;
    }

    if (raw[index + 1] === 'x') {
      const fixed = raw.slice(index + 2, index + 4);
      if (/^[0-9A-Fa-f]{2}$/.test(fixed)) {
        hits.push(raw.slice(index, index + 4));
      }
    }
  }

  return hits;
}

function inspectStringLiteral(node, issues, relPath, pathSegments) {
  const raw = node?.extra?.raw;
  if (typeof raw !== 'string') return;
  if (collectTextEscapes(raw).length === 0) return;
  pushIssue(issues, relPath, node.loc?.start?.line || 1, pathSegments.join('.'), raw);
}

function scanJsNode(node, issues, relPath, pathSegments = []) {
  if (!node) return;

  switch (node.type) {
    case 'Program':
      for (const child of node.body) {
        scanJsNode(child, issues, relPath, pathSegments);
      }
      return;

    case 'ExpressionStatement':
      scanJsNode(node.expression, issues, relPath, pathSegments);
      return;

    case 'AssignmentExpression':
      scanJsNode(node.right, issues, relPath, pathSegments);
      return;

    case 'VariableDeclaration':
      for (const declaration of node.declarations) {
        scanJsNode(declaration, issues, relPath, pathSegments);
      }
      return;

    case 'VariableDeclarator':
      scanJsNode(node.init, issues, relPath, pathSegments);
      return;

    case 'ObjectExpression':
      for (const property of node.properties) {
        scanJsNode(property, issues, relPath, pathSegments);
      }
      return;

    case 'ObjectProperty': {
      const nextPath = [...pathSegments, getPropertyKey(node.key)];
      scanJsNode(node.value, issues, relPath, nextPath);
      return;
    }

    case 'ArrayExpression':
      node.elements.forEach((element, index) => {
        scanJsNode(element, issues, relPath, [...pathSegments, String(index)]);
      });
      return;

    case 'StringLiteral':
      inspectStringLiteral(node, issues, relPath, pathSegments);
      return;

    default:
      return;
  }
}

function scanJsFile(filePath, relPath, issues) {
  const buffer = fs.readFileSync(filePath);
  addBomIssue(issues, relPath, hasUtf8Bom(buffer));
  const text = buffer.toString('utf8');

  try {
    const ast = parse(text, {
      sourceType: 'script'
    });
    scanJsNode(ast.program, issues, relPath);
  } catch (error) {
    pushIssue(issues, relPath, 1, '<parse-error>', error instanceof Error ? error.message : String(error));
  }
}

function scanJsonFile(filePath, relPath, issues) {
  const buffer = fs.readFileSync(filePath);
  addBomIssue(issues, relPath, hasUtf8Bom(buffer));
  const text = buffer.toString('utf8');
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const keyMatch = line.match(/^\s*"([^"]+)"\s*:/);
    const valueMatch = line.match(/:\s*("(?:[^"\\]|\\.)*")/);
    if (!keyMatch || !valueMatch) return;
    if (collectTextEscapes(valueMatch[1]).length === 0) return;
    pushIssue(issues, relPath, index + 1, keyMatch[1], valueMatch[1]);
  });
}

function scanFile(filePath, issues) {
  const relPath = toPosix(path.relative(ROOT, filePath));
  if (filePath.endsWith('.js')) {
    scanJsFile(filePath, relPath, issues);
    return;
  }
  scanJsonFile(filePath, relPath, issues);
}

function printIssues(issues) {
  for (const issue of issues) {
    process.stdout.write(`${issue.file}:${issue.line}:${issue.key}:${issue.raw}\n`);
  }
}

function main() {
  const shouldCheck = process.argv.includes('--check');
  const files = listTargetFiles(PAGES_ROOT);
  const issues = [];

  for (const filePath of files) {
    scanFile(filePath, issues);
  }

  issues.sort((a, b) => {
    const fileCompare = a.file.localeCompare(b.file);
    if (fileCompare !== 0) return fileCompare;
    if (a.line !== b.line) return a.line - b.line;
    return a.key.localeCompare(b.key);
  });

  if (issues.length > 0) {
    printIssues(issues);
    process.stdout.write(`Scanned ${files.length} files. Found ${issues.length} issue(s).\n`);
    if (shouldCheck) {
      process.exit(1);
    }
    return;
  }

  process.stdout.write(`Scanned ${files.length} files. No textual escapes or BOM found.\n`);
}

main();
