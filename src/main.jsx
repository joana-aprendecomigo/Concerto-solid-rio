import React from "react";
import ReactDOM from "react-dom/client";
import { supabaseConfigurado } from "./lib/supabase.js";
import { instalarStorageSupabase } from "./lib/storageSupabase.js";
import { instalarStorageLocal } from "./storageShim.js";
import AppComRealtime from "./AppComRealtime.jsx";

// O componente guarda tudo através de `window.storage`. Instalamos a
// implementação certa antes de o montar: Supabase quando há credenciais
// (plataforma colaborativa), localStorage caso contrário (modo local).
if (supabaseConfigurado) {
  instalarStorageSupabase();
} else {
  instalarStorageLocal();
}

// Regista o service worker — é o que faz o browser oferecer "Instalar".
// Falhar aqui não impede a plataforma de funcionar, apenas de ser instalável.
//
// Uma vez instalado, um service worker novo fica normalmente "à espera" e só
// assume controlo quando todas as instâncias abertas fecharem por completo —
// em quem tem a plataforma instalada como app no telemóvel, isso podia nunca
// chegar a acontecer sozinho, e uma correção de bugs ficava sem efeito no
// aparelho dessa pessoa apesar de já estar publicada. Aqui força-se a
// atualização assim que um SW novo está pronto, sem depender de a pessoa
// fechar a app manualmente.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registo) => {
        // Verifica logo se já há uma versão mais recente à espera.
        registo.update().catch(() => {});

        const ativarNovaVersao = (sw) => {
          sw.addEventListener("statechange", () => {
            if (sw.state === "installed" && navigator.serviceWorker.controller) {
              // Há uma versão nova pronta e uma versão antiga ainda a
              // controlar a página — manda a nova assumir de imediato em
              // vez de esperar que a pessoa feche tudo.
              sw.postMessage({ tipo: "ATIVAR_AGORA" });
            }
          });
        };

        if (registo.waiting) ativarNovaVersao(registo.waiting);
        registo.addEventListener("updatefound", () => {
          if (registo.installing) ativarNovaVersao(registo.installing);
        });
      })
      .catch((e) => {
        console.warn("[Concerto] Service worker não registado:", e);
      });

    // Quando o SW novo assume o controlo, recarrega para usar o código novo
    // de imediato — sem isto, a página continuava a correr o JavaScript
    // antigo até ao próximo carregamento manual.
    let jaRecarregou = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (jaRecarregou) return;
      jaRecarregou = true;
      window.location.reload();
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppComRealtime />
  </React.StrictMode>
);
