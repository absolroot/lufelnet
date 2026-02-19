#!/usr/bin/env node

import { spawnSync } from 'child_process';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const SCRIPT_TARGETS = [
  'home',
  'about',
  'article',
  'astrolabe',
  'character',
  'critical-calc',
  'defense-calc',
  'gallery',
  'maps',
  'material-calc',
  'persona',
  'pay-calc',
  'pull-calc',
  'pull-tracker',
  'revelations',
  'revelation-setting',
  'schedule',
  'synergy',
  'tactic',
  'tactic-maker',
  'tier',
  'wonder-weapon'
];

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  for (const arg of args) {
    if (arg !== '--check') {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }
  return { check: args.has('--check') };
}

function runScript(scriptName) {
  const npmExecPath = process.env.npm_execpath;
  let command;
  let args;

  if (npmExecPath) {
    command = process.execPath;
    args = [npmExecPath, 'run', scriptName];
  } else if (process.platform === 'win32') {
    command = process.env.ComSpec || 'cmd.exe';
    args = ['/d', '/s', '/c', 'npm', 'run', scriptName];
  } else {
    command = 'npm';
    args = ['run', scriptName];
  }

  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit'
  });

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }

  if (result.error) {
    console.error(`Failed to run ${scriptName}: ${result.error.message}`);
    process.exit(1);
  }
}

function main() {
  const mode = parseArgs(process.argv);
  const action = mode.check ? 'check' : 'generate';

  for (const target of SCRIPT_TARGETS) {
    const scriptName = `seo:${target}:${action}`;
    console.log(`\n> ${scriptName}`);
    runScript(scriptName);
  }

  console.log(`\nSEO ${action} finished for ${SCRIPT_TARGETS.length} targets.`);
}

main();
