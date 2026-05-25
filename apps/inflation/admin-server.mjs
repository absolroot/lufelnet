#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import process from 'process';
import {
  PROJECT_ROOT,
  INFLATION_DATA_REL,
  buildCharacterOptions,
  buildReleaseOptions,
  contentHash,
  loadDataContext,
  readTextUtf8,
  serializeInflationData,
  validateInflationData,
  writeTextUtf8
} from './inflation-data-utils.mjs';

const HOST = '127.0.0.1';
const DEFAULT_PORT = 4174;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const ALLOWED_ORIGINS = new Set([
  'http://127.0.0.1:4000',
  'http://localhost:4000'
]);

function parsePort() {
  const raw = String(process.env.INFLATION_ADMIN_PORT || '').trim();
  const value = Number(raw || DEFAULT_PORT);
  if (Number.isInteger(value) && value > 0 && value <= 65535) return value;
  return DEFAULT_PORT;
}

function log(message) {
  process.stdout.write(`[inflation-admin] ${message}\n`);
}

function applyCors(req, res) {
  const origin = String(req.headers.origin || '').trim();
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
}

function isAllowedOriginRequest(req) {
  const origin = String(req.headers.origin || '').trim();
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function sendJson(req, res, status, payload) {
  applyCors(req, res);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(`${JSON.stringify(payload, null, 2)}\n`);
}

function sendText(req, res, status, text) {
  applyCors(req, res);
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let body = '';

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        req.destroy(new Error('Request body too large.'));
        return;
      }
      body += chunk;
    });

    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error(`Invalid JSON body: ${error.message}`));
      }
    });

    req.on('error', reject);
  });
}

function loadEnvironment() {
  const windowData = loadDataContext(PROJECT_ROOT);
  const raw = readTextUtf8(PROJECT_ROOT, INFLATION_DATA_REL);
  return {
    raw,
    fileHash: contentHash(raw),
    data: windowData.InflationData || { unit: 'eok', entries: [] },
    characterData: windowData.characterData || {},
    releaseScheduleData: windowData.ReleaseScheduleData || {}
  };
}

function validationPayload(data) {
  const env = loadEnvironment();
  const validation = validateInflationData(data, {
    characterData: env.characterData,
    releaseScheduleData: env.releaseScheduleData
  });
  return validation;
}

function buildBootstrapPayload() {
  const env = loadEnvironment();
  const validation = validateInflationData(env.data, {
    characterData: env.characterData,
    releaseScheduleData: env.releaseScheduleData
  });

  return {
    ok: true,
    fileHash: env.fileHash,
    data: env.data,
    validation,
    characters: buildCharacterOptions(env.characterData),
    releases: buildReleaseOptions(env.releaseScheduleData)
  };
}

function saveInflationData(payload) {
  const data = payload?.data;
  const expectedHash = String(payload?.fileHash || payload?.hash || '').trim();
  const env = loadEnvironment();

  if (expectedHash && expectedHash !== env.fileHash) {
    return {
      status: 409,
      body: {
        ok: false,
        error: 'file_changed',
        message: 'Inflation data file changed after this editor loaded it.',
        fileHash: env.fileHash
      }
    };
  }

  const validation = validateInflationData(data, {
    characterData: env.characterData,
    releaseScheduleData: env.releaseScheduleData
  });

  if (!validation.ok) {
    return {
      status: 400,
      body: {
        ok: false,
        error: 'validation_failed',
        validation,
        fileHash: env.fileHash
      }
    };
  }

  const targetPath = path.join(PROJECT_ROOT, INFLATION_DATA_REL);
  const nextText = serializeInflationData(validation.data);

  try {
    writeTextUtf8(targetPath, nextText);

    const verifyEnv = loadEnvironment();
    const verify = validateInflationData(verifyEnv.data, {
      characterData: verifyEnv.characterData,
      releaseScheduleData: verifyEnv.releaseScheduleData
    });

    if (!verify.ok) {
      writeTextUtf8(targetPath, env.raw);
      return {
        status: 500,
        body: {
          ok: false,
          error: 'post_write_validation_failed',
          validation: verify,
          fileHash: env.fileHash
        }
      };
    }

    return {
      status: 200,
      body: {
        ok: true,
        fileHash: verifyEnv.fileHash,
        validation: verify,
        data: verifyEnv.data
      }
    };
  } catch (error) {
    try {
      if (fs.existsSync(targetPath)) {
        writeTextUtf8(targetPath, env.raw);
      }
    } catch {
      // Best-effort rollback.
    }

    return {
      status: 500,
      body: {
        ok: false,
        error: 'save_failed',
        message: String(error?.message || error)
      }
    };
  }
}

async function requestHandler(req, res) {
  applyCors(req, res);

  if (!isAllowedOriginRequest(req)) {
    sendText(req, res, 403, 'Forbidden origin');
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host || `${HOST}:${DEFAULT_PORT}`;
  const url = new URL(req.url || '/', `http://${host}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(req, res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/inflation/bootstrap') {
    sendJson(req, res, 200, buildBootstrapPayload());
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/inflation/validate') {
    const body = await readJsonBody(req);
    const validation = validationPayload(body.data || body);
    sendJson(req, res, 200, {
      ok: validation.ok,
      validation
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/inflation/save') {
    const body = await readJsonBody(req);
    const result = saveInflationData(body);
    sendJson(req, res, result.status, result.body);
    return;
  }

  sendText(req, res, 404, 'Not found');
}

const port = parsePort();
const server = http.createServer((req, res) => {
  requestHandler(req, res).catch((error) => {
    sendJson(req, res, 500, {
      ok: false,
      error: String(error?.message || error)
    });
  });
});

server.listen(port, HOST, () => {
  log(`running at http://${HOST}:${port}`);
  log(`data file: ${INFLATION_DATA_REL}`);
});
