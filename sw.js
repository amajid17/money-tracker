'use strict';

// Read the cache version from the query string (passed by index.html)
const params = new URL(self.location).searchParams;
const CACHE = params.get('ver') || 'mt-default';

// ── INSTALL ────────────────────────────────────────────────
self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(CACHE)
      .then(c => c.add('./'))   // cache the root (index.html)
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ──────────────────────────────────────────────
self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH ──────────────────────────────────────────────────
self.addEventListener('fetch', ev => {
  // Intercept navigation requests (page loads)
  if (ev.request.mode === 'navigate') {
    ev.respondWith(
      caches.match('./')
        .then(cached => cached || fetch(ev.request))
    );
  }
  // All other assets (images, etc.) pass through untouched
});