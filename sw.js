// Service Worker for PWA
const CACHE_NAME = 'lufelnet-v1';
const RUNTIME_CACHE = 'lufelnet-runtime-v1';
const IMAGE_CACHE = 'lufelnet-images-v1';

// 캐시할 정적 리소스 목록 (핵심 파일만)
const STATIC_CACHE_URLS = [
  '/',
  '/assets/css/default/common.css',
  '/assets/css/default/nav.css',
  '/assets/js/nav.js',
  '/assets/js/language-router.js',
  '/assets/img/favicon/favicon.ico',
  '/assets/img/favicon/apple-touch-icon.png'
];

// 이미지 파일 확장자 목록
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'];

// assets/img 경로인지 확인
function isImageAsset(url) {
  return url.pathname.startsWith('/assets/img/') && 
         IMAGE_EXTENSIONS.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

// 설치 이벤트 - 정적 리소스 캐싱
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting()) // 즉시 활성화
  );
});

// 활성화 이벤트 - 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // 현재 사용 중인 캐시는 유지
            return cacheName !== CACHE_NAME && 
                   cacheName !== RUNTIME_CACHE && 
                   cacheName !== IMAGE_CACHE;
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

  // API, data 요청은 네트워크 우선
  if (url.pathname.includes('/api/') || url.pathname.includes('/data/') || url.pathname.includes('/auth/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // assets/img 이미지는 자동 캐싱 (캐시 우선, 네트워크 폴백)
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

  // 개발 환경이거나 강력 새로고침인 경우 네트워크 우선
  if (isDevelopment || isHardReload) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 네트워크에서 가져온 응답을 캐시에 업데이트
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시 캐시에서 가져오기
          return caches.match(request);
        })
    );
    return;
  }

  // 프로덕션 환경: 네트워크 우선 (항상 최신 버전), 오프라인일 때만 캐시 사용
  // STATIC_CACHE_URLS와 images는 이미 위에서 처리됨
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 네트워크에서 성공적으로 가져왔으면 캐시에 저장 (오프라인 대비)
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 (오프라인) 캐시에서 가져오기
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // 캐시에도 없으면 기본 페이지 반환 (페이지 네비게이션인 경우)
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
            return null;
          });
      })
  );
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
