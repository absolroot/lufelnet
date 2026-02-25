// Service Worker for PWA
const SW_FALLBACK_VERSION = 'v4-js-css-no-cache';
const SW_VERSION = (() => {
  try {
    const url = new URL(self.location.href);
    return url.searchParams.get('v') || SW_FALLBACK_VERSION;
  } catch (_) {
    return SW_FALLBACK_VERSION;
  }
})();
const IMAGE_CACHE_PREFIX = 'lufelnet-images-';
const IMAGE_CACHE_VERSION = 'runtime-v3';
const IMAGE_CACHE = `${IMAGE_CACHE_PREFIX}${IMAGE_CACHE_VERSION}`;
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'];
const IMAGE_REVALIDATE_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12h
const IMAGE_CACHE_MAX_ENTRIES = 2000;
const IMAGE_CACHEABLE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
const imageRevalidateAt = new Map();

function isCacheableResponse(response) {
  return response && response.status === 200 && response.type === 'basic';
}

function toNoCacheRequest(request) {
  try {
    return new Request(request, { cache: 'no-cache' });
  } catch (_) {
    return request;
  }
}

function toImageCacheKey(request) {
  try {
    const url = new URL(request.url);
    // Ignore runtime version query to avoid duplicate cache entries.
    url.searchParams.delete('v');
    return url.toString();
  } catch (_) {
    return request.url;
  }
}

function getResponseLengthBytes(response) {
  if (!response || !response.headers) return null;
  const raw = response.headers.get('content-length');
  if (!raw) return null;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function isCacheableImageResponse(response) {
  if (!isCacheableResponse(response)) return false;
  const size = getResponseLengthBytes(response);
  if (size === null) return true;
  return size <= IMAGE_CACHEABLE_MAX_BYTES;
}

function shouldRevalidateImage(cacheKey) {
  const now = Date.now();
  const lastAt = imageRevalidateAt.get(cacheKey) || 0;
  if (now - lastAt < IMAGE_REVALIDATE_INTERVAL_MS) {
    return false;
  }
  imageRevalidateAt.set(cacheKey, now);
  return true;
}

async function pruneCacheEntries(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  const deleteCount = keys.length - maxEntries;
  const oldKeys = keys.slice(0, deleteCount);
  oldKeys.forEach((key) => {
    imageRevalidateAt.delete(toImageCacheKey(key));
  });
  await Promise.all(oldKeys.map((key) => cache.delete(key)));
}

function isImageAsset(url) {
  return (
    url.pathname.startsWith('/assets/img/') &&
    IMAGE_EXTENSIONS.some((ext) => url.pathname.toLowerCase().endsWith(ext))
  );
}

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(Promise.resolve().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...', SW_VERSION);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== IMAGE_CACHE)
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        )
      )
      .then(() => {
        imageRevalidateAt.clear();
        return self.clients.claim();
      })
      .then(() =>
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'SW_UPDATED', version: SW_VERSION });
          });
        })
      )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) return;
  if (request.method !== 'GET') return;

  if (isImageAsset(url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cacheKey = toImageCacheKey(request);
        const cachedResponse = await cache.match(cacheKey);

        if (cachedResponse) {
          if (shouldRevalidateImage(cacheKey)) {
            event.waitUntil(
              fetch(toNoCacheRequest(request))
                .then((response) => {
                  if (!isCacheableImageResponse(response)) return null;
                  return cache
                    .put(cacheKey, response.clone())
                    .then(() => pruneCacheEntries(cache, IMAGE_CACHE_MAX_ENTRIES));
                })
                .catch(() => null)
            );
          }
          return cachedResponse;
        }

        try {
          const response = await fetch(toNoCacheRequest(request));
          if (isCacheableImageResponse(response)) {
            event.waitUntil(
              cache
                .put(cacheKey, response.clone())
                .then(() => pruneCacheEntries(cache, IMAGE_CACHE_MAX_ENTRIES))
                .catch(() => null)
            );
          }
          return response;
        } catch (_) {
          return cachedResponse || Response.error();
        }
      })
    );
    return;
  }

  const isJSOrCSSOrData =
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('/data/') ||
    url.pathname.includes('/assets/js/') ||
    url.pathname.includes('/assets/css/');

  if (isJSOrCSSOrData) {
    const revalidateRequest = new Request(request, { cache: 'no-cache' });
    event.respondWith(fetch(revalidateRequest));
    return;
  }

  event.respondWith(fetch(request));
});

self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
});

self.addEventListener('push', () => {
  console.log('[Service Worker] Push notification received');
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_CACHE') {
    console.log('[Service Worker] Received SKIP_CACHE');
    const hostname = self.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[Service Worker] Dev mode cache delete:', cacheName);
            return caches.delete(cacheName);
          })
        )
      );
    }
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[Service Worker] Received CLEAR_CACHE');
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[Service Worker] Cache delete:', cacheName);
            return caches.delete(cacheName);
          })
        )
      )
      .then(() => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
        }
      });
  }

  if (event.data && event.data.type === 'VERSION_UPDATE') {
    const newVersion = event.data.version;
    console.log('[Service Worker] Received VERSION_UPDATE:', newVersion);
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[Service Worker] Version-change cache delete:', cacheName);
            return caches.delete(cacheName);
          })
        )
      )
      .then(() => {
        console.log('[Service Worker] Version update complete: cleared all caches');
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ type: 'VERSION_UPDATED' });
        }
      });
  }

  if (event.data && event.data.type === 'CLEAR_IMAGE_CACHE') {
    console.log('[Service Worker] Received CLEAR_IMAGE_CACHE');
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith(IMAGE_CACHE_PREFIX))
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => {
        imageRevalidateAt.clear();
        console.log('[Service Worker] Image cache cleared');
      });
  }
});
