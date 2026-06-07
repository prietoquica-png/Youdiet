const CACHE_NAME = 'youdiet-v1';
const ASSETS = [
   '/Youdiet/',
  '/Youdiet/index.html',
  '/Youdiet/manifest.json',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap'
];

// Instalación — guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activación — limpia cachés viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — sirve desde caché, si no hay red cae al caché
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
