/* Fivonine service worker: keeps opened pages readable on a weak or lost connection. */
const CACHE = "fivonine-v2";
const offlineCopy = {
  en: ["You're offline", "Try again when your connection is back."],
  fr: ["Vous êtes hors ligne", "Réessayez quand votre connexion sera rétablie."],
  ht: ["Ou pa gen entènèt", "Eseye ankò lè koneksyon an tounen."],
  es: ["No tienes conexión", "Vuelve a intentarlo cuando se restablezca la conexión."],
};
function offlinePage(pathname) {
  const requested = pathname.split("/")[1];
  const locale = Object.hasOwn(offlineCopy, requested) ? requested : "fr";
  const [title, body] = offlineCopy[locale];
  return new Response(`<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | yon kout men</title><body style="font-family:system-ui;padding:32px;color:#1f503b"><h1>${title}</h1><p>${body}</p></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
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
        .catch(() => caches.match(req).then((hit) => hit || offlinePage(url.pathname))),
    );
  }
});
