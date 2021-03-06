// define cache variables
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/dist/manifest.json",
    "/assets/css/style.css",
    "/dist/bundle.js",
    "/dist/assets/icons/icon_192x192.png",
    "/dist/assets/icons/icon_512x512.png",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
];
const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache";
// install
self.addEventListener("install", event => {
    // pre cache all static assets
    event.waitUntil(
        caches
        .open(STATIC_CACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        // tell the browser to activate this service worker immediately once it has finished installing
        .then(() => self.skipWaiting())
    );
});

// activate the service worker and remove old data from the cache
self.addEventListener("activate", event => {
    const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
    event.waitUntil(
        caches
        .keys()
        .then(cacheNames => {
            // return array of cache names that are old to delete
            return cacheNames.filter(
                cacheName => !currentCaches.includes(cacheName)
            );
        })
        .then(cachesToDelete => {
            return Promise.all(
                cachesToDelete.map(cacheToDelete => {
                    return caches.delete(cacheToDelete);
                })
            );
        })
        .then(() => self.clients.claim())
    );
});
// enable the service worker to intercept network requests.
self.addEventListener("fetch", event => {
    // non GET requests are not cached and requests to other origins are not cached
    if (
        event.request.method !== "GET" ||
        !event.request.url.startsWith(self.location.origin)
    ) {
        event.respondWith(fetch(event.request));
        return;
    }
    // handle runtime GET requests for data from /api routes
    if (event.request.url.includes("/api/transaction")) {
        // make network request and fallback to cache if network request fails (offline)
        event.respondWith(
            caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    // network request failed, try to get it from the cache.
                    .catch(() => caches.match(event.request));
            })
        );
        return;
    }
    // use cache first for all other requests for performance
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            // request is not in cache. make network request and cache the response
            return caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(event.request).then(response => {
                    return cache.put(event.request, response.clone()).then(() => {
                        return response;
                    });
                });
            });
        })
    );
});