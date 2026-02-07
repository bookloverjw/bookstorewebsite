/**
 * Service Worker for Chapter & Verse Bookstore
 * Provides offline caching with a cache-first strategy for static assets
 * and network-first for HTML pages.
 */

const CACHE_NAME = 'cv-bookstore-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/books.js',
  '/js/app.js'
];

// Install: cache static assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for navigations, cache-first for static assets
self.addEventListener('fetch', function (event) {
  var request = event.request;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Navigation requests: network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(function (response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(request, clone);
        });
        return response;
      }).catch(function () {
        return caches.match(request).then(function (cached) {
          return cached || caches.match('/index.html');
        });
      })
    );
    return;
  }

  // Static assets: cache first, fallback to network
  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        // Cache successful responses for same-origin requests
        if (response.ok && new URL(request.url).origin === self.location.origin) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, clone);
          });
        }
        return response;
      });
    })
  );
});
