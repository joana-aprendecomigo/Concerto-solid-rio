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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppComRealtime />
  </React.StrictMode>
);
