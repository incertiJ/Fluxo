const CACHE = "fluxo-v3";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./app.js",
  "./manifest.json", "./icon.svg"
];

const timers = new Map();

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        const url = new URL(e.request.url);
        if (url.origin === self.location.origin && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

self.addEventListener("message", e => {
  const data = e.data;
  if (!data) return;
  if (data.type === "schedule") rescheduleAll(data.items || []);
});

function rescheduleAll(items) {
  for (const t of timers.values()) clearTimeout(t);
  timers.clear();
  const now = Date.now();
  for (const item of items) {
    const delay = item.triggerMs - now;
    if (delay <= 0 || delay > 24 * 3600000) continue;
    const handle = setTimeout(() => {
      self.registration.showNotification(item.title, {
        body: item.body,
        tag: item.id,
        icon: "./icon.svg",
        badge: "./icon.svg",
      });
      timers.delete(item.id);
    }, delay);
    timers.set(item.id, handle);
  }
}

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) if ("focus" in c) return c.focus();
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});
