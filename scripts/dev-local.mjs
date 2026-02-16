#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import readline from 'readline';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const CONFIG_PATH = path.join(__dirname, 'dev-local.config.json');
const PATCH_CONSOLE_ENTRY = path.join('apps', 'patch-console', 'run-patch-console.mjs');
const BUNDLE_CMD = 'bundle';

const PROCESS_STATE = Object.freeze({
  STOPPED: 'stopped',
  STARTING: 'starting',
  RUNNING: 'running',
  STOPPING: 'stopping',
  FAILED: 'failed'
});

const SETTABLE_FLAGS = ['drafts', 'future', 'unpublished', 'livereload', 'force_polling'];
const FAST_BUILD_ALLOWED_MODES = new Set(['full', 'fast']);
const STOP_TIMEOUT_MS = 5000;

const DEFAULT_CONFIG = Object.freeze({
  jekyll: {
    host: '0.0.0.0',
    port: 4000,
    baseArgs: ['--force_polling']
  },
  modes: {
    full: {
      drafts: true,
      future: true,
      unpublished: true,
      livereload: true
    },
    fast: {
      drafts: false,
      future: false,
      unpublished: false,
      livereload: false
    }
  },
  patch: {
    enabledOnStart: true,
    port: 4173
  }
});

const runtime = {
  config: null,
  currentMode: 'full',
  modeOverrides: {},
  shuttingDown: false,
  shutdownRequested: false,
  shutdownPromise: null,
  operationChain: Promise.resolve(),
  finalExitCode: 0,
  rl: null,
  processes: {
    jekyll: createManagedProcess('jekyll', 'jekyll', true),
    patch: createManagedProcess('patch', 'patch', true),
    build: createManagedProcess('build', 'build', false)
  }
};

function createManagedProcess(name, prefix, detached) {
  return {
    name,
    prefix,
    detached,
    state: PROCESS_STATE.STOPPED,
    child: null,
    expectedExit: false,
    stopPromise: null,
    lastExitCode: null
  };
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj || {}, key);
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function deepMerge(base, incoming) {
  if (!isPlainObject(base)) return incoming;
  if (!isPlainObject(incoming)) return incoming;
  const out = { ...base };
  for (const [key, value] of Object.entries(incoming)) {
    if (isPlainObject(value) && isPlainObject(base[key])) {
      out[key] = deepMerge(base[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function toPort(value, fallback) {
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed > 0 && parsed <= 65535) return parsed;
  return fallback;
}

function toBoolean(value, fallback) {
  if (typeof value === 'boolean') return value;
  return fallback;
}

function normalizeMode(rawMode, fallbackMode) {
  const mode = isPlainObject(rawMode) ? rawMode : {};
  return {
    drafts: toBoolean(mode.drafts, fallbackMode.drafts),
    future: toBoolean(mode.future, fallbackMode.future),
    unpublished: toBoolean(mode.unpublished, fallbackMode.unpublished),
    livereload: toBoolean(mode.livereload, fallbackMode.livereload)
  };
}

function normalizeConfig(rawConfig) {
  const merged = deepMerge(DEFAULT_CONFIG, rawConfig || {});
  const jekyllRaw = isPlainObject(merged.jekyll) ? merged.jekyll : DEFAULT_CONFIG.jekyll;
  const patchRaw = isPlainObject(merged.patch) ? merged.patch : DEFAULT_CONFIG.patch;
  const modesRaw = isPlainObject(merged.modes) ? merged.modes : {};

  const normalized = {
    jekyll: {
      host: String(jekyllRaw.host || DEFAULT_CONFIG.jekyll.host),
      port: toPort(jekyllRaw.port, DEFAULT_CONFIG.jekyll.port),
      baseArgs: Array.isArray(jekyllRaw.baseArgs)
        ? jekyllRaw.baseArgs.map((x) => String(x)).filter((x) => x.trim().length > 0)
        : [...DEFAULT_CONFIG.jekyll.baseArgs]
    },
    modes: {},
    patch: {
      enabledOnStart: toBoolean(patchRaw.enabledOnStart, DEFAULT_CONFIG.patch.enabledOnStart),
      port: toPort(patchRaw.port, DEFAULT_CONFIG.patch.port)
    }
  };

  normalized.modes.full = normalizeMode(modesRaw.full, DEFAULT_CONFIG.modes.full);
  normalized.modes.fast = normalizeMode(modesRaw.fast, DEFAULT_CONFIG.modes.fast);

  for (const [name, modeDef] of Object.entries(modesRaw)) {
    if (name === 'full' || name === 'fast') continue;
    if (!isPlainObject(modeDef)) continue;
    normalized.modes[name] = normalizeMode(modeDef, DEFAULT_CONFIG.modes.full);
  }

  return normalized;
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    logDev(`Config not found, using defaults: ${normalizePath(path.relative(PROJECT_ROOT, CONFIG_PATH))}`);
    return normalizeConfig(DEFAULT_CONFIG);
  }
  try {
    const rawText = fs.readFileSync(CONFIG_PATH, 'utf8');
    const parsed = JSON.parse(rawText);
    const config = normalizeConfig(parsed);
    logDev(`Loaded config: ${normalizePath(path.relative(PROJECT_ROOT, CONFIG_PATH))}`);
    return config;
  } catch (error) {
    logDev(`Failed to parse config, fallback to defaults: ${error.message}`);
    return normalizeConfig(DEFAULT_CONFIG);
  }
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function writePrefixed(prefix, message, stream = 'stdout') {
  const text = `[${prefix}] ${message}\n`;
  if (stream === 'stderr') {
    process.stderr.write(text);
    return;
  }
  process.stdout.write(text);
}

function logDev(message) {
  writePrefixed('dev', message, 'stdout');
}

function logDevError(message) {
  writePrefixed('dev', message, 'stderr');
}

function createPrefixedChunkWriter(prefix, stream = 'stdout') {
  let buffer = '';

  function flushLine(line) {
    writePrefixed(prefix, line, stream);
  }

  return {
    write(chunk) {
      const text = String(chunk || '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
      buffer += text;
      let idx = buffer.indexOf('\n');
      while (idx >= 0) {
        const line = buffer.slice(0, idx);
        flushLine(line);
        buffer = buffer.slice(idx + 1);
        idx = buffer.indexOf('\n');
      }
    },
    flush() {
      if (buffer.length > 0) {
        flushLine(buffer);
        buffer = '';
      }
    }
  };
}

function spawnCrossPlatform(command, args, options) {
  if (process.platform === 'win32' && command === BUNDLE_CMD) {
    return spawn('cmd.exe', ['/d', '/s', '/c', BUNDLE_CMD, ...args], {
      ...options,
      shell: false
    });
  }
  return spawn(command, args, options);
}

function isBaseForcePollingEnabled() {
  return runtime.config.jekyll.baseArgs.some((arg) => String(arg).trim() === '--force_polling');
}

function getModeNames() {
  return Object.keys(runtime.config.modes);
}

function getModeOrNull(modeName) {
  const key = String(modeName || '').trim();
  if (!key) return null;
  return hasOwn(runtime.config.modes, key) ? runtime.config.modes[key] : null;
}

function getEffectiveFlags(modeName = runtime.currentMode) {
  const mode = getModeOrNull(modeName) || runtime.config.modes.full;
  const effective = {
    drafts: Boolean(mode.drafts),
    future: Boolean(mode.future),
    unpublished: Boolean(mode.unpublished),
    livereload: Boolean(mode.livereload),
    force_polling: isBaseForcePollingEnabled()
  };
  for (const key of SETTABLE_FLAGS) {
    if (hasOwn(runtime.modeOverrides, key)) {
      effective[key] = Boolean(runtime.modeOverrides[key]);
    }
  }
  return effective;
}

function sanitizeBaseArgs(baseArgs) {
  const out = [];
  for (let i = 0; i < baseArgs.length; i += 1) {
    const arg = String(baseArgs[i] || '').trim();
    if (!arg) continue;
    const lower = arg.toLowerCase();

    if (
      lower === 'serve'
      || lower === 'build'
      || lower === 'clean'
      || lower === '--drafts'
      || lower === '--future'
      || lower === '--unpublished'
      || lower === '--livereload'
      || lower === '--force_polling'
      || lower === '--host'
      || lower === '-h'
      || lower === '--port'
      || lower === '-p'
    ) {
      if (lower === '--host' || lower === '-h' || lower === '--port' || lower === '-p') {
        i += 1;
      }
      continue;
    }

    out.push(arg);
  }
  return out;
}

function buildJekyllServeArgs() {
  const flags = getEffectiveFlags(runtime.currentMode);
  const args = [
    'exec',
    'jekyll',
    'serve',
    '--host',
    runtime.config.jekyll.host,
    '--port',
    String(runtime.config.jekyll.port)
  ];

  if (flags.livereload) args.push('--livereload');
  if (flags.drafts) args.push('--drafts');
  if (flags.future) args.push('--future');
  if (flags.unpublished) args.push('--unpublished');
  if (flags.force_polling) args.push('--force_polling');

  args.push(...sanitizeBaseArgs(runtime.config.jekyll.baseArgs));
  return args;
}

function buildJekyllBuildArgs(modeName) {
  const mode = String(modeName || '').trim();
  const flags = getEffectiveFlags(mode);
  const args = ['exec', 'jekyll', 'build'];
  if (flags.drafts) args.push('--drafts');
  if (flags.future) args.push('--future');
  if (flags.unpublished) args.push('--unpublished');
  return args;
}

function launchManagedProcess(proc, command, args, options = {}) {
  if (proc.child) {
    throw new Error(`${proc.name} process is already active`);
  }

  proc.state = PROCESS_STATE.STARTING;
  proc.expectedExit = false;
  proc.lastExitCode = null;

  const child = spawnCrossPlatform(command, args, {
    cwd: PROJECT_ROOT,
    shell: false,
    windowsHide: true,
    detached: options.detached ?? proc.detached,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  proc.child = child;

  const stdoutWriter = createPrefixedChunkWriter(proc.prefix, 'stdout');
  const stderrWriter = createPrefixedChunkWriter(proc.prefix, 'stderr');

  if (child.stdout) {
    child.stdout.on('data', (chunk) => stdoutWriter.write(chunk));
    child.stdout.on('end', () => stdoutWriter.flush());
  }
  if (child.stderr) {
    child.stderr.on('data', (chunk) => stderrWriter.write(chunk));
    child.stderr.on('end', () => stderrWriter.flush());
  }

  child.on('spawn', () => {
    proc.state = PROCESS_STATE.RUNNING;
    logDev(`${proc.name} started (pid ${child.pid})`);
  });

  child.on('error', (error) => {
    proc.state = PROCESS_STATE.FAILED;
    proc.child = null;
    proc.stopPromise = null;
    proc.lastExitCode = 1;
    logDevError(`${proc.name} failed to start: ${error.message}`);
    if (!runtime.shuttingDown) {
      requestShutdown(`${proc.name} start error`, 1);
    }
  });

  child.on('exit', (code, signal) => {
    stdoutWriter.flush();
    stderrWriter.flush();
    handleManagedExit(proc, code, signal);
  });
}

function handleManagedExit(proc, code, signal) {
  const numericCode = Number.isInteger(code) ? code : null;
  const expected = proc.expectedExit || runtime.shuttingDown || proc.state === PROCESS_STATE.STOPPING;

  proc.child = null;
  proc.stopPromise = null;
  proc.expectedExit = false;
  proc.lastExitCode = numericCode;

  if (expected) {
    proc.state = PROCESS_STATE.STOPPED;
    return;
  }

  if (numericCode !== null && numericCode !== 0) {
    proc.state = PROCESS_STATE.FAILED;
    logDevError(`${proc.name} exited non-zero (code ${numericCode}${signal ? `, signal ${signal}` : ''})`);
    requestShutdown(`${proc.name} exited non-zero`, numericCode);
    return;
  }

  proc.state = PROCESS_STATE.STOPPED;

  if (proc.name === 'build') {
    logDev('build completed');
    return;
  }

  logDevError(`${proc.name} exited unexpectedly (code ${numericCode ?? 'null'}${signal ? `, signal ${signal}` : ''})`);
}

function isProcessActive(proc) {
  return proc.state === PROCESS_STATE.STARTING || proc.state === PROCESS_STATE.RUNNING;
}

async function waitForChildExit(child, timeoutMs) {
  if (!child) return true;
  if (child.exitCode !== null || child.signalCode !== null) return true;
  return new Promise((resolve) => {
    let resolved = false;
    const onExit = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      resolve(true);
    };
    const timer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      child.off('exit', onExit);
      resolve(false);
    }, timeoutMs);
    child.once('exit', onExit);
  });
}

async function forceKillByPid(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return;
  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      const killer = spawn('taskkill', ['/PID', String(pid), '/T', '/F'], {
        shell: false,
        windowsHide: true,
        stdio: 'ignore'
      });
      killer.on('error', () => resolve());
      killer.on('close', () => resolve());
    });
    return;
  }

  try {
    process.kill(-pid, 'SIGKILL');
    return;
  } catch {
    // fallback
  }

  try {
    process.kill(pid, 'SIGKILL');
  } catch {
    // ignored
  }
}

async function stopManagedProcess(proc) {
  if (!proc.child) {
    if (proc.state !== PROCESS_STATE.FAILED) {
      proc.state = PROCESS_STATE.STOPPED;
    }
    return;
  }

  if (proc.stopPromise) {
    await proc.stopPromise;
    return;
  }

  proc.state = PROCESS_STATE.STOPPING;
  proc.expectedExit = true;

  const child = proc.child;
  const pid = child.pid;

  proc.stopPromise = (async () => {
    if (process.platform === 'win32') {
      try {
        child.kill('SIGTERM');
      } catch {
        // ignored
      }
    } else {
      let signaled = false;
      if (Number.isInteger(pid) && pid > 0) {
        try {
          process.kill(-pid, 'SIGTERM');
          signaled = true;
        } catch {
          signaled = false;
        }
      }
      if (!signaled) {
        try {
          child.kill('SIGTERM');
        } catch {
          // ignored
        }
      }
    }

    const graceful = await waitForChildExit(child, STOP_TIMEOUT_MS);
    if (graceful) return;

    logDev(`${proc.name} did not stop in ${STOP_TIMEOUT_MS}ms, forcing termination`);
    await forceKillByPid(pid);
    await waitForChildExit(child, 1000);
  })();

  await proc.stopPromise;
}

function startJekyllProcess() {
  const proc = runtime.processes.jekyll;
  if (proc.state === PROCESS_STATE.STARTING || proc.state === PROCESS_STATE.RUNNING) {
    logDev('jekyll is already running');
    return;
  }
  if (proc.state === PROCESS_STATE.STOPPING) {
    logDev('jekyll is stopping; try again in a moment');
    return;
  }
  const args = buildJekyllServeArgs();
  launchManagedProcess(proc, BUNDLE_CMD, args, { detached: process.platform !== 'win32' });
  logDev(`jekyll start requested (mode=${runtime.currentMode})`);
}

async function stopJekyllProcess() {
  const proc = runtime.processes.jekyll;
  if (!proc.child && proc.state === PROCESS_STATE.STOPPED) {
    logDev('jekyll is already stopped');
    return;
  }
  await stopManagedProcess(proc);
  logDev('jekyll stop requested');
}

async function restartJekyllProcess() {
  await stopManagedProcess(runtime.processes.jekyll);
  if (!runtime.shuttingDown) {
    startJekyllProcess();
  }
}

function startPatchProcess() {
  const proc = runtime.processes.patch;
  if (proc.state === PROCESS_STATE.STARTING || proc.state === PROCESS_STATE.RUNNING) {
    logDev('patch is already running');
    return;
  }
  if (proc.state === PROCESS_STATE.STOPPING) {
    logDev('patch is stopping; try again in a moment');
    return;
  }
  const args = [PATCH_CONSOLE_ENTRY, '--port', String(runtime.config.patch.port)];
  launchManagedProcess(proc, process.execPath, args, { detached: process.platform !== 'win32' });
  logDev(`patch start requested (port=${runtime.config.patch.port})`);
}

async function stopPatchProcess() {
  const proc = runtime.processes.patch;
  if (!proc.child && proc.state === PROCESS_STATE.STOPPED) {
    logDev('patch is already stopped');
    return;
  }
  await stopManagedProcess(proc);
  logDev('patch stop requested');
}

async function restartPatchProcess() {
  await stopManagedProcess(runtime.processes.patch);
  if (!runtime.shuttingDown) {
    startPatchProcess();
  }
}

function startBuildProcess(modeName) {
  const proc = runtime.processes.build;
  if (proc.state === PROCESS_STATE.STARTING || proc.state === PROCESS_STATE.RUNNING) {
    logDev('build already in progress; request rejected');
    return;
  }
  const mode = String(modeName || runtime.currentMode).trim();
  if (!FAST_BUILD_ALLOWED_MODES.has(mode)) {
    logDev("build mode must be 'full' or 'fast'");
    return;
  }
  const args = buildJekyllBuildArgs(mode);
  launchManagedProcess(proc, BUNDLE_CMD, args, { detached: false });
  logDev(`build started (${mode})`);
}

async function runOneShotCommand(prefix, command, args) {
  return new Promise((resolve) => {
    const child = spawnCrossPlatform(command, args, {
      cwd: PROJECT_ROOT,
      shell: false,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    const stdoutWriter = createPrefixedChunkWriter(prefix, 'stdout');
    const stderrWriter = createPrefixedChunkWriter(prefix, 'stderr');

    if (child.stdout) {
      child.stdout.on('data', (chunk) => stdoutWriter.write(chunk));
      child.stdout.on('end', () => stdoutWriter.flush());
    }
    if (child.stderr) {
      child.stderr.on('data', (chunk) => stderrWriter.write(chunk));
      child.stderr.on('end', () => stderrWriter.flush());
    }

    child.on('error', (error) => {
      stdoutWriter.flush();
      stderrWriter.flush();
      logDevError(`${prefix} failed to start: ${error.message}`);
      resolve(1);
    });

    child.on('close', (code) => {
      stdoutWriter.flush();
      stderrWriter.flush();
      resolve(Number.isInteger(code) ? code : 1);
    });
  });
}

async function runCleanCommand() {
  return runOneShotCommand('clean', BUNDLE_CMD, ['exec', 'jekyll', 'clean']);
}

function parseOnOff(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'on' || normalized === 'true' || normalized === '1') return true;
  if (normalized === 'off' || normalized === 'false' || normalized === '0') return false;
  return null;
}

function printHelp() {
  logDev('Commands:');
  logDev('  help');
  logDev('  status');
  logDev('  modes');
  logDev('  mode <name>');
  logDev('  set <flag> <on|off>        flags: drafts,future,unpublished,livereload,force_polling');
  logDev('  build [full|fast]');
  logDev('  jekyll <start|stop|restart>');
  logDev('  patch <start|stop|restart>');
  logDev('  clean');
  logDev('  exit (or quit)');
}

function printModes() {
  for (const modeName of getModeNames()) {
    const mode = runtime.config.modes[modeName];
    const mark = modeName === runtime.currentMode ? '*' : ' ';
    logDev(`${mark} ${modeName}: drafts=${mode.drafts} future=${mode.future} unpublished=${mode.unpublished} livereload=${mode.livereload}`);
  }
}

function printStatus() {
  const jekyll = runtime.processes.jekyll;
  const patch = runtime.processes.patch;
  const build = runtime.processes.build;

  logDev(`mode=${runtime.currentMode}`);
  logDev(`process jekyll=${jekyll.state}${jekyll.child?.pid ? ` (pid ${jekyll.child.pid})` : ''}`);
  logDev(`process patch=${patch.state}${patch.child?.pid ? ` (pid ${patch.child.pid})` : ''}`);
  logDev(`process build=${build.state}${build.child?.pid ? ` (pid ${build.child.pid})` : ''}`);
  logDev(`jekyll endpoint=http://127.0.0.1:${runtime.config.jekyll.port}`);
  logDev(`patch endpoint=http://127.0.0.1:${runtime.config.patch.port}`);

  const activeMode = getModeOrNull(runtime.currentMode) || runtime.config.modes.full;
  const effective = getEffectiveFlags(runtime.currentMode);
  for (const flag of SETTABLE_FLAGS) {
    const baseValue = flag === 'force_polling'
      ? isBaseForcePollingEnabled()
      : Boolean(activeMode[flag]);
    const overrideValue = hasOwn(runtime.modeOverrides, flag)
      ? String(Boolean(runtime.modeOverrides[flag]))
      : '(none)';
    logDev(`flag ${flag}: base=${baseValue} override=${overrideValue} effective=${effective[flag]}`);
  }
}

async function handleModeCommand(modeNameRaw) {
  const modeName = String(modeNameRaw || '').trim();
  if (!modeName) {
    logDev('usage: mode <name>');
    return;
  }
  if (!getModeOrNull(modeName)) {
    logDev(`unknown mode: ${modeName}`);
    printModes();
    return;
  }

  runtime.currentMode = modeName;
  logDev(`mode set to ${modeName}`);
  await restartJekyllProcess();
}

async function handleSetCommand(flagRaw, valueRaw) {
  const flag = String(flagRaw || '').trim().toLowerCase();
  if (!SETTABLE_FLAGS.includes(flag)) {
    logDev(`unsupported flag: ${flag}`);
    logDev(`allowed flags: ${SETTABLE_FLAGS.join(',')}`);
    return;
  }

  const parsed = parseOnOff(valueRaw);
  if (parsed == null) {
    logDev('usage: set <flag> <on|off>');
    return;
  }

  runtime.modeOverrides[flag] = parsed;
  logDev(`override set: ${flag}=${parsed}`);
  await restartJekyllProcess();
}

async function handleServiceCommand(serviceRaw, actionRaw) {
  const service = String(serviceRaw || '').trim().toLowerCase();
  const action = String(actionRaw || '').trim().toLowerCase();
  if (!action) {
    logDev(`usage: ${service} <start|stop|restart>`);
    return;
  }

  if (service === 'jekyll') {
    if (action === 'start') {
      startJekyllProcess();
      return;
    }
    if (action === 'stop') {
      await stopJekyllProcess();
      return;
    }
    if (action === 'restart') {
      await restartJekyllProcess();
      return;
    }
    logDev(`unknown jekyll action: ${action}`);
    return;
  }

  if (service === 'patch') {
    if (action === 'start') {
      startPatchProcess();
      return;
    }
    if (action === 'stop') {
      await stopPatchProcess();
      return;
    }
    if (action === 'restart') {
      await restartPatchProcess();
      return;
    }
    logDev(`unknown patch action: ${action}`);
    return;
  }

  logDev(`unsupported service: ${service}`);
}

async function handleCleanCommand() {
  const buildState = runtime.processes.build.state;
  if (buildState === PROCESS_STATE.STARTING || buildState === PROCESS_STATE.RUNNING) {
    logDev('clean rejected because build is running');
    return;
  }

  const wasJekyllRunning = isProcessActive(runtime.processes.jekyll);
  if (wasJekyllRunning) {
    await stopJekyllProcess();
  }

  const cleanCode = await runCleanCommand();
  if (cleanCode === 0) {
    logDev('jekyll clean completed');
  } else {
    logDevError(`jekyll clean failed with exit code ${cleanCode}`);
  }

  if (wasJekyllRunning && !runtime.shuttingDown) {
    startJekyllProcess();
  }
}

async function executeCommand(line) {
  const input = String(line || '').trim();
  if (!input) return;

  const [cmdRaw, ...rest] = input.split(/\s+/);
  const cmd = cmdRaw.toLowerCase();

  if (cmd === 'help') {
    printHelp();
    return;
  }
  if (cmd === 'status') {
    printStatus();
    return;
  }
  if (cmd === 'modes') {
    printModes();
    return;
  }
  if (cmd === 'mode') {
    await handleModeCommand(rest[0]);
    return;
  }
  if (cmd === 'set') {
    await handleSetCommand(rest[0], rest[1]);
    return;
  }
  if (cmd === 'build') {
    startBuildProcess(rest[0]);
    return;
  }
  if (cmd === 'jekyll') {
    await handleServiceCommand('jekyll', rest[0]);
    return;
  }
  if (cmd === 'patch') {
    await handleServiceCommand('patch', rest[0]);
    return;
  }
  if (cmd === 'clean') {
    await handleCleanCommand();
    return;
  }
  if (cmd === 'exit' || cmd === 'quit') {
    requestShutdown('exit command', 0);
    return;
  }

  logDev(`unknown command: ${cmd}`);
  logDev("type 'help' to view available commands");
}

function prompt() {
  if (!runtime.rl || runtime.shuttingDown || runtime.rl.closed) return;
  runtime.rl.prompt();
}

function enqueueOperation(label, task) {
  runtime.operationChain = runtime.operationChain
    .then(async () => {
      if (runtime.shuttingDown) return;
      await task();
    })
    .catch((error) => {
      logDevError(`operation failed (${label}): ${error.message}`);
      if (!runtime.shuttingDown) {
        requestShutdown(`operation failed (${label})`, 1);
      }
    })
    .finally(() => {
      if (!runtime.shuttingDown) {
        prompt();
      }
    });
}

function setExitCodeFromFailure(code) {
  if (!Number.isInteger(code) || code === 0) return;
  if (runtime.finalExitCode === 0) {
    runtime.finalExitCode = code;
  }
}

function requestShutdown(reason, code = 0) {
  setExitCodeFromFailure(code);
  if (runtime.shutdownRequested) {
    return runtime.shutdownPromise;
  }

  runtime.shutdownRequested = true;
  runtime.shuttingDown = true;
  logDev(`shutdown requested: ${reason}`);

  runtime.shutdownPromise = (async () => {
    await runtime.operationChain.catch(() => {});

    if (runtime.rl) {
      runtime.rl.pause();
      runtime.rl.close();
    }

    await stopManagedProcess(runtime.processes.build);
    await stopManagedProcess(runtime.processes.jekyll);
    await stopManagedProcess(runtime.processes.patch);

    const cleanCode = await runCleanCommand();
    if (cleanCode !== 0) {
      logDevError(`jekyll clean failed with exit code ${cleanCode}`);
      setExitCodeFromFailure(cleanCode);
    } else {
      logDev('jekyll clean completed');
    }

    const finalCode = runtime.finalExitCode;
    logDev(`shutdown complete (exit ${finalCode})`);
    process.exit(finalCode);
  })().catch((error) => {
    logDevError(`shutdown failure: ${error.message}`);
    process.exit(runtime.finalExitCode || 1);
  });

  return runtime.shutdownPromise;
}

function setupSignalHandlers() {
  process.on('SIGINT', () => {
    requestShutdown('SIGINT', 0);
  });

  process.on('SIGTERM', () => {
    requestShutdown('SIGTERM', 0);
  });

  process.on('uncaughtException', (error) => {
    logDevError(`uncaughtException: ${error.stack || error.message}`);
    requestShutdown('uncaughtException', 1);
  });

  process.on('unhandledRejection', (reason) => {
    const message = reason instanceof Error ? reason.stack || reason.message : String(reason);
    logDevError(`unhandledRejection: ${message}`);
    requestShutdown('unhandledRejection', 1);
  });
}

function setupReadline() {
  runtime.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: Boolean(process.stdin.isTTY && process.stdout.isTTY)
  });

  runtime.rl.setPrompt('dev-local> ');

  runtime.rl.on('line', (line) => {
    enqueueOperation(`command:${line}`, async () => {
      await executeCommand(line);
    });
  });

  runtime.rl.on('close', () => {
    if (!runtime.shuttingDown) {
      enqueueOperation('stdin-close', async () => {
        requestShutdown('stdin closed', 0);
      });
    }
  });
}

function bootstrap() {
  runtime.config = loadConfig();
  runtime.currentMode = getModeOrNull('full') ? 'full' : getModeNames()[0];
  runtime.modeOverrides = {};

  setupSignalHandlers();
  setupReadline();

  enqueueOperation('startup', async () => {
    startJekyllProcess();
    if (runtime.config.patch.enabledOnStart) {
      startPatchProcess();
    } else {
      logDev('patch auto-start disabled by config');
    }
    logDev("type 'help' for available commands");
  });
}

bootstrap();
