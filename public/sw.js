// ASK ONE service worker — app-shell caching for fast repeat startup and an
// offline fallback. Static build assets are cache-first (they're
// content-hashed by Vite, so a cached copy is always valid); navigations are
// network-first so users get fresh content when online, falling back to the
// cached shell or offline.html when they don't.

const CACHE_VERSION = "ask-one-v1";
const APP_SHELL = ["/", "/manifest.webmanifest", "/offline.html", "/brand/icon-192.png", "/brand/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept embedded third-party app iframes or their sub-requests.
  if (url.pathname.startsWith("/launch/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put("/", clone));
          return res;
        })
        .catch(() => caches.match("/").then((cached) => cached || caches.match("/offline.html"))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((res) => {
            if (res.ok && (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/brand/"))) {
              const clone = res.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
            }
            return res;
          })
          .catch(() => cached),
    ),
  );
});
