#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..', '..');
const listeners = new Map();
let lastFetchRequest = null;

const workerGlobal = {
  location: { href: 'https://lufel.net/sw.js?h=test-worker-hash' },
  addEventListener(type, handler) {
    listeners.set(type, handler);
  }
};

const context = vm.createContext({
  self: workerGlobal,
  location: { origin: 'https://lufel.net' },
  URL,
  Request,
  Response,
  Map,
  Promise,
  console,
  setTimeout,
  clearTimeout,
  caches: {
    open: async () => { throw new Error('Image cache is outside this policy test'); },
    keys: async () => []
  },
  fetch: async (request) => {
    lastFetchRequest = request;
    return new Response('ok');
  }
});

vm.runInContext(fs.readFileSync(path.join(PROJECT_ROOT, 'sw.js'), 'utf8'), context);
const fetchHandler = listeners.get('fetch');
assert.equal(typeof fetchHandler, 'function');

function dispatch(url) {
  let responsePromise;
  fetchHandler({
    request: new Request(url),
    respondWith(value) {
      responsePromise = Promise.resolve(value);
    },
    waitUntil() {}
  });
  return responsePromise;
}

assert.equal(
  dispatch('https://lufel.net/assets/css/default/common.css?h=0123456789abcdef'),
  undefined,
  'Content-hashed CSS must bypass service-worker revalidation'
);
assert.equal(
  dispatch('https://lufel.net/assets/js/nav.js?h=0123456789abcdef'),
  undefined,
  'Content-hashed JS must bypass service-worker revalidation'
);
assert.equal(
  dispatch('https://lufel.net/data/character_info.js?h=0123456789abcdef'),
  undefined,
  'Content-hashed data must bypass service-worker revalidation'
);

const legacyResponse = dispatch('https://lufel.net/assets/js/nav.js?v=5.0.6');
assert.ok(legacyResponse instanceof Promise, 'Legacy version URLs must still be revalidated');
await legacyResponse;
assert.equal(lastFetchRequest.cache, 'no-cache');

assert.equal(
  dispatch('https://lufel.net/kr/character/'),
  undefined,
  'HTML navigation must remain browser-managed'
);

console.log('Verified content-hashed assets bypass SW revalidation.');
console.log('Verified legacy versioned assets retain the no-cache fallback.');
