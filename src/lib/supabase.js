import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./credenciais.js";

const url = SUPABASE_URL;
const anonKey = SUPABASE_ANON_KEY;

// Sem credenciais a plataforma continua a arrancar, mas em modo local
// (localStorage). Assim ninguém fica com um ecrã em branco por falta de
// configuração — ver storageShim.js.
export const supabaseConfigurado = Boolean(url && anonKey);

// Diagnóstico: distingue "variável em falta" de "variável mal preenchida".
// Sem isto, qualquer um dos casos dava a mesma mensagem genérica e obrigava a
// adivinhar qual era o problema.
export const diagnostico = {
  temUrl: Boolean(url),
  temChave: Boolean(anonKey),
  urlValido: typeof url === "string" && url.startsWith("https://"),
  // A chave pode ser um JWT (formato antigo) ou sb_publishable_ (novo).
  chaveValida:
    typeof anonKey === "string" &&
    (anonKey.startsWith("eyJ") || anonKey.startsWith("sb_publishable_")),
  urlAbreviado: url ? `${String(url).slice(0, 30)}…` : "(em falta)",
  chaveAbreviada: anonKey ? `${String(anonKey).slice(0, 12)}…` : "(em falta)",
};

if (typeof window !== "undefined") {
  console.info("[Concerto] Configuração Supabase:", diagnostico);
}

export const supabase = supabaseConfigurado
  ? createClient(url, anonKey, {
      auth: {
        // A entrada é por nome + código, apoiada em contas do Supabase Auth.
        // A sessão persiste para não obrigar a escrever o código a cada
        // recarregamento, e o token renova-se sozinho durante o dia de trabalho.
        persistSession: true,
        autoRefreshToken: true,
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

/**
 * Confirma que a base de dados responde.
 *
 * Sem isto, uma credencial errada faria a aplicação recair em silêncio para o
 * armazenamento local: a equipa via listas vazias (ou desatualizadas) sem
 * perceber que estava desligada da base de dados partilhada.
 */
export async function verificarLigacao() {
  if (!supabase) return { ok: false, motivo: "sem_credenciais" };
  try {
    const { error } = await supabase.from("profiles").select("nome").limit(1);
    if (error) return { ok: false, motivo: "erro", detalhe: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, motivo: "erro", detalhe: e.message };
  }
}
