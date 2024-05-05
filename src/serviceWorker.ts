// This is a mock function to simulate registration. In a real app, this would be done in the main JavaScript file, not in the service worker.
declare const self: ServiceWorkerGlobalScope;

export function register() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.ts')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((err) => {
        console.log('Service Worker registration failed:', err);
      });
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('race-pace-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/myGif.gif' // Add this line
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.url.endsWith('.gif')) {
          return caches.match('/myGif.gif').then((cacheResponse) => {
            return cacheResponse || new Response('', { status: 404, statusText: 'Not found' });
          });
        }
        return new Response('', { status: 404, statusText: 'Not found' });
      });
    })
  );
});