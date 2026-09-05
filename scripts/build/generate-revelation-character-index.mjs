#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SETTINGS = path.join(ROOT, 'data', 'characters');
const OUTPUT = path.join(ROOT, 'data', 'revelations', 'character-index.js');

function buildIndex() {
  const index = {};
  for (const entry of fs.readdirSync(SETTINGS, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(SETTINGS, entry.name, 'setting.js');
    if (!fs.existsSync(file)) continue;
    const sandbox = { window: { characterSetting: {} } };
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { timeout: 5000 });
    const setting = sandbox.window.characterSetting[entry.name];
    if (!setting || typeof setting !== 'object') continue;
    for (const revelation of [...(setting.main_revelation || []), ...(setting.sub_revelation || [])]) {
      if (!revelation) continue;
      if (!index[revelation]) index[revelation] = [];
      index[revelation].push(entry.name);
    }
  }
  for (const names of Object.values(index)) names.sort((a, b) => a.localeCompare(b, 'ko'));
  return index;
}

const check = process.argv.includes('--check');
const output = `window.revelationCharacterIndex = ${JSON.stringify(buildIndex(), null, 2)};\n`;
const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : '';
if (check && current !== output) {
  throw new Error('data/revelations/character-index.js is out of date. Run npm run revelation:index:generate');
}
if (!check && current !== output) {
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, output, 'utf8');
}
