// Service Worker for PWA
const IMAGE_CACHE = 'lufelnet-images-v1';

// 이미지 파일 확장자 목록
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'];

// assets/img 경로인지 확인
function isImageAsset(url) {
  return url.pathname.startsWith('/assets/img/') && 
         IMAGE_EXTENSIONS.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    Promise.resolve().then(() => self.skipWaiting()) // 즉시 활성화
  );
});

// 활성화 이벤트 - 오래된 캐시 정리 (이미지 캐시만 유지)
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // 이미지 캐시만 유지, 나머지는 모두 삭제
            return cacheName !== IMAGE_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => self.clients.claim()) // 모든 클라이언트 제어
  );
});

// fetch 이벤트 - 네트워크 우선, 캐시 폴백 전략
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 같은 출처의 요청만 처리
  if (url.origin !== location.origin) {
    return;
  }

  // GET 요청만 캐싱
  if (request.method !== 'GET') {
    return;
  }

  // 개발 환경 감지 (localhost, 127.0.0.1 등)
  const isDevelopment = url.hostname === 'localhost' || 
                        url.hostname === '127.0.0.1' || 
                        url.hostname === '0.0.0.0';

  // 강력 새로고침 감지 (Cache-Control: no-cache 헤더 확인)
  const isHardReload = request.cache === 'reload' || 
                       request.cache === 'no-cache' ||
                       request.headers.get('Cache-Control') === 'no-cache';

  // 이미지만 캐싱 (assets/img 경로의 이미지 파일)
  if (isImageAsset(url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                // 캐시에 있으면 즉시 반환
                return cachedResponse;
              }

              // 캐시에 없으면 네트워크에서 가져와서 캐시에 저장
              return fetch(request)
                .then((response) => {
                  // 유효한 응답만 캐싱
                  if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    cache.put(request, responseToCache);
                  }
                  return response;
                })
                .catch(() => {
                  // 네트워크 실패 시 null 반환
                  return null;
                });
            });
        })
    );
    return;
  }

  // 이미지가 아닌 모든 요청은 네트워크에서만 가져오기 (캐싱 안 함)
  event.respondWith(fetch(request));
});

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
});

// 푸시 알림 (선택사항)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  // 푸시 알림 처리 로직 추가 가능
});

// 메시지 수신 (캐시 우회 요청 등)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_CACHE') {
    console.log('[Service Worker] 캐시 우회 요청 수신');
    // 모든 캐시 삭제 (개발 중에만)
    const hostname = self.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[Service Worker] 개발 모드: 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          })
        );
      });
    }
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[Service Worker] 캐시 삭제 요청');
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[Service Worker] 캐시 삭제:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // 캐시 삭제 완료 후 클라이언트에 알림
      event.ports && event.ports[0] && event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
    });
  }

  if (event.data && event.data.type === 'VERSION_UPDATE') {
    const newVersion = event.data.version;
    console.log('[Service Worker] 버전 업데이트 요청:', newVersion);
    // 버전이 바뀌었으므로 모든 캐시 삭제 (이미지 캐시 포함)
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[Service Worker] 버전 변경으로 인한 캐시 삭제:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('[Service Worker] 버전 업데이트 완료: 모든 캐시 삭제됨');
      // 클라이언트에 알림
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ type: 'VERSION_UPDATED' });
      }
    });
  }

  if (event.data && event.data.type === 'CLEAR_IMAGE_CACHE') {
    console.log('[Service Worker] 이미지 캐시만 삭제 요청');
    caches.delete(IMAGE_CACHE).then(() => {
      console.log('[Service Worker] 이미지 캐시 삭제 완료');
    });
  }
});
