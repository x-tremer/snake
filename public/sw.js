// Service Worker for Snake PWA — cache-first for app shell
const CACHE_NAME = 'snake-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const urlPath = new URL(event.request.url).pathname;
  // Match relative asset paths against registered assets
  const matched = ASSETS.some((a) => urlPath.endsWith(a.replace('./', '/')));
  if (matched || urlPath === '/snake/' || urlPath === '/snake/index.html') {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
