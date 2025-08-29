// 不使用缓存，直接通过网络获取资源
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    try {
      const cache = await caches.open('app-static');
      await cache.addAll([
        '/image/site-icon.png'
      ]);
    } catch (e) {
      // ignore cache errors
    }
  })());
});
