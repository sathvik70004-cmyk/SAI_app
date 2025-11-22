
const CACHE_NAME = 'mindfulmate-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // 1. Navigation requests (HTML): Network First, fall back to cache
  // This ensures users get the latest version when online, but app still opens offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 2. All other assets (JS, CSS, Images): Stale-While-Revalidate
  // Serve cached version immediately for speed, update cache in background
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      
      // Fetch from network to update cache
      const networkPromise = fetch(event.request).then((networkResponse) => {
        // Only cache valid responses
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch((err) => {
        // Network failed, ignore
      });

      // Return cached response if available, otherwise wait for network
      return cachedResponse || networkPromise;
    })
  );
});
