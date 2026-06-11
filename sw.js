const CACHE = 'mind-v1';
const ASSETS = ['/mind/', '/mind/index.html', '/mind/manifest.json', '/mind/icon-192.png', '/mind/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Push notifications
self.addEventListener('push', e => {
  const data = e.data?.json() || { title: 'Mind', body: 'oi!' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/mind/icon-192.png',
      badge: '/mind/icon-192.png',
      vibrate: [100, 50, 100],
      data: { url: '/mind/' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/mind/'));
});
