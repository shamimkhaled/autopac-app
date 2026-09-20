/* Auto Pac PWA service worker — public site only; admin/auth never cached. */
const CACHE = 'autopac-v4';
const PRECACHE = [
  '/',
  '/products',
  '/brochure',
  '/contact',
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.all(
          PRECACHE.map((url) =>
            cache.add(url).catch(() => {
              /* ignore individual precache miss */
            })
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function isAdminOrAuth(url) {
  return (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/admin') ||
    url.pathname.startsWith('/api/auth') ||
    url.pathname.startsWith('/api/upload')
  );
}

async function networkFirst(request) {
  try {
    const fresh = await fetch(request);
    if (fresh.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return (await caches.match('/offline.html')) || Response.error();
    }
    return caches.match('/offline.html');
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    return caches.match('/offline.html');
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isAdminOrAuth(url)) return;

  // Never cache the service worker or Next build chunks incorrectly via stale SW
  if (url.pathname === '/sw.js' || url.pathname.startsWith('/_next/webpack')) {
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    const cmsPaths = [
      '/api/company',
      '/api/site-content',
      '/api/appearance',
      '/api/hero',
      '/api/partners',
      '/api/products',
      '/api/categories',
      '/api/owner',
      '/api/industries',
      '/api/testimonials',
      '/api/stats',
      '/api/translations',
      '/api/catalog-map',
      '/api/blog',
    ];
    if (cmsPaths.some((p) => url.pathname === p || url.pathname.startsWith(p + '/'))) {
      event.respondWith(fetch(request).catch(() => caches.match('/offline.html')));
      return;
    }
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    url.pathname.startsWith('/brochures/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/uploads/') ||
    url.pathname.startsWith('/icons/')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'autopac-quote-sync') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => client.postMessage({ type: 'FLUSH_QUOTE_QUEUE' }));
      })
    );
  }
});
