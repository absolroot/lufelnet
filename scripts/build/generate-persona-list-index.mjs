#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUTPUT = path.join(ROOT, 'data', 'persona', 'index.js');
const lists = [
  { file: path.join(ROOT, 'data', 'persona', 'order.js'), directory: 'data/persona' },
  { file: path.join(ROOT, 'data', 'persona', 'nonorder.js'), directory: 'data/persona/nonorder' }
];

function runFile(file, sandbox) {
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { timeout: 5000 });
}

function buildIndex() {
  const index = {};
  for (const list of lists) {
    const sandbox = { window: {} };
    runFile(list.file, sandbox);
    const names = sandbox.window.personaOrder || sandbox.window.personaNonOrder || [];
    for (const name of names) {
      const file = path.join(ROOT, list.directory, `${name}.js`);
      if (!fs.existsSync(file)) throw new Error(`Missing persona data file: ${file}`);
      const personaSandbox = { window: { personaFiles: {} } };
      runFile(file, personaSandbox);
      const persona = personaSandbox.window.personaFiles[name];
      if (!persona || typeof persona !== 'object') throw new Error(`Invalid persona data: ${file}`);
      index[name] = {
        name: persona.name || name,
        name_en: persona.name_en || '',
        name_jp: persona.name_jp || '',
        name_cn: persona.name_cn || '',
        element: persona.element || '',
        position: persona.position || '',
        star: persona.star || '',
        grade: persona.grade || '',
        event: persona.event || '',
        wild_emblem_rainbow: !!persona.wild_emblem_rainbow,
        tier: persona.tier || '',
        __path: list.directory,
        __hash: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 16)
      };
    }
  }
  return index;
}

const check = process.argv.includes('--check');
const output = `window.personaIndex = ${JSON.stringify(buildIndex(), null, 2)};\n`;
const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : '';
if (check && current !== output) {
  throw new Error('data/persona/index.js is out of date. Run npm run persona:index:generate');
}
if (!check && current !== output) fs.writeFileSync(OUTPUT, output, 'utf8');
