/* Құран жаттау — service worker */
const CACHE = 'qj-v5';
const SHELL = ['./', './index.html', './styles.css', './app.js', './vocab.js', './ustaz.html', './firebase-config.js', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Мәтін мен аудармалар: желі -> кэш (өткенге офлайн қол жеткізу)
  if (url.hostname === 'api.alquran.cloud') {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Аудио кэштелмейді (үлкен файлдар) — тек желі
  if (url.hostname === 'cdn.islamic.network') return;

  // Қаріптер мен қабық: кэш -> желі
  e.respondWith(
    caches.match(e.request).then(hit => hit ||
      fetch(e.request).then(r => {
        if (e.request.method === 'GET' && r.ok && (url.origin === location.origin || url.hostname.includes('fonts.g'))) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      }).catch(() => caches.match(e.request))
    )
  );
});
