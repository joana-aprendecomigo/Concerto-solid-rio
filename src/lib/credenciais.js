// ============================================================================
// Credenciais do Supabase
// ============================================================================
//
// Estão aqui em código, e não só em variáveis de ambiente, porque o Cloudflare
// Pages não as estava a disponibilizar durante o build — o Vite lê as variáveis
// `VITE_*` no momento em que compila, e o site ficava sem ligação à base de
// dados sem nenhum sinal visível.
//
// Isto não expõe nada que já não estivesse exposto: o Vite embebe estes valores
// no JavaScript final, portanto qualquer visitante os consegue ler no browser.
// A publishable key é desenhada para isso mesmo.
//
// O que protege realmente os dados são as políticas de Row Level Security. As
// atuais estão abertas (ver supabase/migrations/0002_rls.sql), pelo que qualquer
// pessoa com o endereço do site pode ler e alterar tudo. Fechar isso exige
// autenticação — está preparado em 0003_rls_autenticado.sql.disabled.
//
// A chave `service_role` / `sb_secret_` NUNCA pode vir para aqui: essa ignora
// todas as políticas e só deve viver em servidores.
// ============================================================================

const PROJETO = "drqllcofylgzvzcppeds";

// As variáveis de ambiente, quando existem, ganham prioridade — permite apontar
// para outro projeto (por exemplo, um de testes) sem alterar o código.
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || `https://${PROJETO}.supabase.co`;

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_OKXmL5mCzo5lAuykoZ2pqQ_dzBYP2gm";
