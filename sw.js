const CACHE_NAME = "gyro-dodge-3d-aero-v5";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=5",
  "./voices.js?v=5",
  "./models3d.js?v=5",
  "./game.js?v=5",
  "./manifest.webmanifest",
  "./logo.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

const EXTERNAL_LIB_ASSETS = [
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(CORE_ASSETS);
      for (const url of EXTERNAL_LIB_ASSETS) {
        try { await cache.add(url); } catch (e) {}
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Network-First so newly deployed UI updates on GitHub Pages appear immediately on first reload!
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const reqUrl = event.request.url;
  if (reqUrl.includes("shinobi.jp") || reqUrl.includes("peerjs") || reqUrl.includes("ad_slot_")) return;

  event.respondWith(
    fetch(event.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const copy = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkRes;
      })
      .catch(() => caches.match(event.request))
  );
});
