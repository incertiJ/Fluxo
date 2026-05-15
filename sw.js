const CACHE = "fluxo-v22";
const NOTIF_CACHE = "fluxo-notif";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./app.js",
  "./manifest.json", "./icon.svg"
];

const timers = new Map();
let scheduledItems = [];
let notifIcon = "./icon.svg";
let notifBadge = "./icon.svg";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== NOTIF_CACHE).map(k => caches.delete(k)))
    ).then(() => loadPersistedItems()).then(() => self.clients.claim())
  );
});

async function loadPersistedItems() {
  try {
    const cache = await caches.open(NOTIF_CACHE);
    const res = await cache.match("scheduled-items");
    if (res) {
      scheduledItems = await res.json();
      rescheduleAll(scheduledItems);
    }
  } catch {}
}

async function persistItems(items) {
  try {
    const cache = await caches.open(NOTIF_CACHE);
    await cache.put("scheduled-items", new Response(JSON.stringify(items), {
      headers: { "Content-Type": "application/json" }
    }));
  } catch {}
}

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
  if (data.type === "SKIP_WAITING") { self.skipWaiting(); return; }
  if (data.type === "schedule") {
    scheduledItems = data.items || [];
    if (data.icon) notifIcon = data.icon;
    if (data.badge) notifBadge = data.badge;
    persistItems(scheduledItems);
    // Show any items that are already past-due immediately
    const now = Date.now();
    for (const item of scheduledItems) {
      if (item.triggerMs <= now) {
        self.registration.showNotification(item.title, {
          body: item.body,
          tag: item.id,
          icon: notifIcon,
          badge: notifBadge,
        }).catch(() => {});
      }
    }
    rescheduleAll(scheduledItems.filter(item => item.triggerMs > now));
  }
});

function rescheduleAll(items) {
  for (const t of timers.values()) clearTimeout(t);
  timers.clear();
  const now = Date.now();
  for (const item of items) {
    const delay = item.triggerMs - now;
    if (delay <= 0 || delay > 25 * 3600000) continue;
    const handle = setTimeout(() => {
      self.registration.showNotification(item.title, {
        body: item.body,
        tag: item.id,
        icon: notifIcon,
        badge: notifBadge,
      });
      timers.delete(item.id);
    }, delay);
    timers.set(item.id, handle);
  }
}

// Re-arm timers whenever SW wakes due to a fetch
self.addEventListener("fetch", () => {
  if (scheduledItems.length && timers.size === 0) rescheduleAll(scheduledItems);
}, { passive: true });

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) if ("focus" in c) return c.focus();
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});
