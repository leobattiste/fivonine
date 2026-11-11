/* Fivonine service worker: keeps opened pages readable on a weak or lost connection. */
const CACHE = "fivonine-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (/\/(admin|dashboard|login|create|auth|api)(\/|$)/.test(url.pathname)) return;
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })));
    return;
  }
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req).then((hit) => hit || new Response("<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>Fivonine</title><body style='font-family:system-ui;padding:32px;color:#1f503b'><h1>fivonine</h1><p>Ou pa gen entènèt. Eseye ankò lè koneksyon an tounen.</p><p>Vous êtes hors ligne. You are offline.</p>", { headers: { "Content-Type": "text/html; charset=utf-8" } }))),
    );
  }
});
