// Service Worker for PWA
const SW_FALLBACK_VERSION = 'v3-js-css-no-cache';
const SW_VERSION = (() => {
  try {
    const url = new URL(self.location.href);
    return url.searchParams.get('v') || SW_FALLBACK_VERSION;
  } catch (_) {
    return SW_FALLBACK_VERSION;
  }
})();
const IMAGE_CACHE = 'lufelnet-images-v1';
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'];

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
      .then(() => self.clients.claim())
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
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request)
            .then((response) => {
              if (response && response.status === 200 && response.type === 'basic') {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => null);
        })
      )
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
    caches.delete(IMAGE_CACHE).then(() => {
      console.log('[Service Worker] Image cache cleared');
    });
  }
});
