// ScreenCapture Pro — Service Worker
// This file is used in development. The build process (generate-sw.mjs)
// replaces it with a fully pre-cached version for production.

const CACHE = "screencapture-dev-v1";
const OFFLINE_URL = "/";

// Assets to cache immediately on install
const PRECACHE = ["/", "/manifest.webmanifest", "/pwa-192x192.png", "/pwa-512x512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  // Only handle GET requests from our origin
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isNavigation = e.request.mode === "navigate";
  const isAsset =
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|ico|woff2?|ttf)$/);

  if (!isSameOrigin) return;

  if (isNavigation) {
    // Network-first for navigation — fall back to cached root
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() =>
          caches.match(OFFLINE_URL).then((cached) => cached || new Response("Offline")),
        ),
    );
    return;
  }

  if (isAsset) {
    // Cache-first for static assets
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
            return res;
          }),
      ),
    );
    return;
  }

  // Network-first for everything else
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request)),
  );
});

// Listen for skip-waiting message from the install prompt
self.addEventListener("message", (e) => {
  if (e.data?.type === "SKIP_WAITING") self.skipWaiting();
});
