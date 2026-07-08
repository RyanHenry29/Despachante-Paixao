const CACHE = "despachante-paixao-v2";

const PRECACHE = [
  "/",
  "/privacidade",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim())
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Navegacao (documento HTML): network-first. O HTML referencia os
  // bundles JS/CSS com hash do build atual, e o Vite APAGA os arquivos
  // do build anterior a cada deploy. Servir um HTML antigo do cache
  // significa apontar para arquivos que nao existem mais (tela em branco).
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  // Demais arquivos (JS/CSS com hash, imagens, fontes): stale-while-revalidate.
  // Seguro aqui porque esses arquivos sao imutaveis (nome muda a cada build).
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    }),
  );
});
