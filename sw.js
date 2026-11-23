const CACHE_NAME = "tenkyuu-gravity-runner-v21";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./logo.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

const EXTERNAL_LIB_ASSETS = [
  "https://cdn.tailwindcss.com",
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await cache.addAll(CORE_ASSETS);
      for (const url of EXTERNAL_LIB_ASSETS) {
        try {
          await cache.add(url);
        } catch (e) {}
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const reqUrl = event.request.url;
  // Never cache ad scripts or PeerJS signaling calls
  if (reqUrl.includes("shinobi.jp") || reqUrl.includes("peerjs")) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request)
        .then(networkRes => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return networkRes;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
