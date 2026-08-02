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
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((e) => {
      console.warn("[Concerto] Service worker não registado:", e);
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppComRealtime />
  </React.StrictMode>
);
