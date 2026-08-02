// ============================================================================
// Service worker — o mínimo para a plataforma poder ser instalada
// ============================================================================
//
// Serve só para o browser oferecer "Instalar" / "Adicionar ao ecrã principal".
// Não guarda dados em cache de propósito: a plataforma é partilhada por nove
// pessoas e mostrar contactos ou tarefas desatualizados seria pior do que
// obrigar a esperar pela ligação.
//
// Guarda apenas os ficheiros da própria aplicação (HTML, JS, ícones), para o
// arranque ser rápido — e mesmo esses são sempre revalidados contra o
// servidor, para uma versão nova entrar em vigor no recarregamento seguinte.
// ============================================================================

const CACHE = "concerto-v1";

// Só os ícones: o HTML e o JS têm de vir sempre frescos, senão uma versão nova
// da plataforma podia demorar dias a chegar a quem a tem instalada.
const ESTATICOS = [
  "/favicon.ico",
  "/favicon-32.png",
  "/favicon-192.png",
  "/favicon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
  "/site.webmanifest",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ESTATICOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  const { request } = evento;

  // Tudo o que não seja um GET simples do próprio site passa direto: pedidos
  // ao Supabase (dados, autenticação, tempo real) nunca podem ser servidos de
  // cache.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Ícones e manifest: da cache, com atualização em segundo plano.
  if (ESTATICOS.includes(url.pathname)) {
    evento.respondWith(
      caches.match(request).then((emCache) => {
        const daRede = fetch(request)
          .then((resposta) => {
            if (resposta.ok) caches.open(CACHE).then((c) => c.put(request, resposta.clone()));
            return resposta;
          })
          .catch(() => emCache);
        return emCache || daRede;
      })
    );
    return;
  }

  // Restante (HTML, JS, CSS): rede primeiro. Sem ligação, devolve o que houver
  // em cache para a aplicação abrir — os dados aparecerão quando a ligação
  // voltar.
  evento.respondWith(
    fetch(request)
      .then((resposta) => {
        if (resposta.ok && request.mode === "navigate") {
          const copia = resposta.clone();
          caches.open(CACHE).then((c) => c.put("/", copia));
        }
        return resposta;
      })
      .catch(() => caches.match(request).then((r) => r || caches.match("/")))
  );
});
