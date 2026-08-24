const SHELL_CACHE = "numbrrr-shell-v129";
const DATA_CACHE = "numbrrr-data-v2";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css?v=111",
  "/command-parser.js?v=4",
  "/app.js?v=82",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/numbr-logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/badge-96.png",
  "/assets/ui-icons/alerts.png",
  "/assets/ui-icons/car.png",
  "/assets/ui-icons/countdown.png",
  "/assets/ui-icons/expenses.png",
  "/assets/ui-icons/goals.png",
  "/assets/ui-icons/growth.png",
  "/assets/ui-icons/health.png",
  "/assets/ui-icons/income.png",
  "/assets/ui-icons/insights.png",
  "/assets/ui-icons/ipos.png",
  "/assets/ui-icons/market-data.png",
  "/assets/ui-icons/markets.png",
  "/assets/ui-icons/notes.png",
  "/assets/ui-icons/portfolio.png",
  "/assets/ui-icons/top-performers.png",
  "/assets/ui-icons/watch.png",
  "/assets/monthly-share/cat-shout.png",
  "/assets/monthly-share/cat-blurry.png",
  "/assets/monthly-share/cat-close.png",
  "/assets/monthly-share/cat-wide.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await Promise.allSettled(APP_SHELL.map(async (url) => {
      const response = await fetch(url, { cache: "reload" });
      if (response.ok) await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL_CACHE, DATA_CACHE]);
    await Promise.all((await caches.keys()).filter((key) => !keep.has(key)).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(DATA_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    return (await cache.match(request)) || (fallbackUrl ? await caches.match(fallbackUrl) : undefined) || Response.error();
  }
}

// Navigation must prefer the network so a fresh deployment is visible on the
// first visit. A short deadline keeps startup responsive and preserves the
// cached app shell when the device is offline or on an unreliable connection.
async function navigationNetworkFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(request, { signal: controller.signal });
    if (response && response.ok) {
      await cache.put("/index.html", response.clone());
      return response;
    }
    return (await cache.match("/index.html")) || response || Response.error();
  } catch (error) {
    return (await cache.match(request)) || (await cache.match("/index.html")) || Response.error();
  } finally {
    clearTimeout(timer);
  }
}

async function staleWhileRevalidate(request, fallbackUrl) {
  const cache = await caches.open(request.url.startsWith(self.location.origin) ? SHELL_CACHE : DATA_CACHE);
  const cached = (await cache.match(request)) || (fallbackUrl ? await cache.match(fallbackUrl) : undefined);
  const update = fetch(request).then((response) => {
    if (response && (response.ok || response.type === "opaque")) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || await update || Response.error();
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (request.mode === "navigate") {
    event.respondWith(navigationNetworkFirst(request));
    return;
  }
  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if (url.hostname === "api.open-meteo.com" || url.hostname === "geocoding-api.open-meteo.com") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com" || url.hostname === "api.coingecko.com") {
    event.respondWith(staleWhileRevalidate(request));
  }
});

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (error) { data = { body: event.data ? event.data.text() : "" }; }
  const title = data.title || "NumBrrr";
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || "",
    tag: data.tag || "numbrrr-alert",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-96.png",
    renotify: false,
    data: { url: data.url || "/" }
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || "/", self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) {
      if (new URL(client.url).origin === self.location.origin) {
        await client.focus();
        if ("navigate" in client) await client.navigate(target);
        return;
      }
    }
    await self.clients.openWindow(target);
  })());
});
