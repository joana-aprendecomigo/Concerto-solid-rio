import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Sem credenciais a plataforma continua a arrancar, mas em modo local
// (localStorage). Assim ninguém fica com um ecrã em branco por falta de
// configuração — ver storageShim.js.
export const supabaseConfigurado = Boolean(url && anonKey);

export const supabase = supabaseConfigurado
  ? createClient(url, anonKey, {
      auth: {
        // O acesso é por escolha de nome, sem contas: não há sessão para
        // persistir nem token para renovar.
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

if (!supabaseConfigurado && typeof window !== "undefined") {
  console.warn(
    "[Concerto] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não definidos — " +
      "a usar armazenamento local do browser. Os dados não são partilhados " +
      "entre computadores."
  );
}
