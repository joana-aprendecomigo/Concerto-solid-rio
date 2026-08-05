// ============================================================================
// Entrada na plataforma com nome + código próprio
// ============================================================================
//
// Cada pessoa escolhe o seu nome na lista e define um código na primeira vez.
// Por trás, isso é uma conta no Supabase Auth — o e-mail é derivado do nome
// (ana@concerto.local) e o código é a palavra-passe.
//
// A equipa nunca vê e-mails: para elas é "escolhe o teu nome e escreve o teu
// código". Mas como a verificação passa a ser feita pelo servidor do Supabase,
// ninguém se pode fazer passar por outra pessoa mexendo no browser.
// ============================================================================

import { supabase } from "./supabase.js";

// Domínio interno, sem existência real. Serve só para dar ao Supabase Auth o
// formato de e-mail que ele exige.
const DOMINIO = "concerto.local";

/** Converte "Lara Leão" em "lara.leao@concerto.local". */
export function emailDoNome(nome) {
  const base = (nome || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // tira acentos
    .replace(/[^a-z0-9]+/g, ".")     // espaços e sinais viram pontos
    .replace(/^\.|\.$/g, "");
  return `${base}@${DOMINIO}`;
}

// O Supabase exige pelo menos 6 caracteres na palavra-passe.
export const COMPRIMENTO_MINIMO = 6;

/** Lista de membros com indicação de quem já definiu código. */
export async function listarMembros() {
  const { data, error } = await supabase
    .from("profiles")
    .select("nome, role, codigo_definido_em")
    .order("nome");
  if (error) throw error;
  return data || [];
}

/**
 * Define o código na primeira entrada: cria a conta e liga-a ao perfil.
 */
export async function definirCodigo(nome, codigo) {
  if (!codigo || codigo.length < COMPRIMENTO_MINIMO) {
    throw new Error(`O código tem de ter pelo menos ${COMPRIMENTO_MINIMO} caracteres.`);
  }

  const email = emailDoNome(nome);
  const { data, error } = await supabase.auth.signUp({ email, password: codigo });

  if (error) {
    // Conta já existente significa que alguém já definiu código para este nome.
    if (/already registered|already exists/i.test(error.message)) {
      throw new Error("Este membro já tem código definido. Usa o teu código para entrar.");
    }
    throw error;
  }

  // Associa a conta ao perfil. A função recusa se o perfil já tiver conta, o
  // que impede alguém de se apropriar do perfil de outra pessoa.
  //
  // Entre o signUp e esta chamada há uma janela em que a conta existe no
  // Supabase Auth mas ainda não está ligada a nenhum perfil. Se a chamada
  // falhar aqui (rede, RLS momentânea), a conta ficava órfã: a pessoa
  // conseguia entrar, mas a plataforma nunca saberia a quem essa conta
  // pertence — via tudo a zero, sem explicação, só a ela.
  //
  // Tenta uma segunda vez antes de desistir, e se mesmo assim falhar avisa
  // com uma mensagem que diz exatamente o que aconteceu e o que fazer, em
  // vez de deixar a conta num estado a meio sem ninguém dar por isso.
  let erroAssociar = null;
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    const r = await supabase.rpc("associar_conta", { p_nome: nome, p_user_id: data.user.id });
    erroAssociar = r.error;
    if (!erroAssociar) break;
  }
  if (erroAssociar) {
    throw new Error(
      "A conta foi criada mas não foi possível associá-la ao teu perfil " +
        `(${erroAssociar.message}). Tenta entrar novamente com o mesmo código — ` +
        "se o problema persistir, pede a quem gere a plataforma para verificar."
    );
  }

  return data.user;
}

/** Entra com um código já definido. */
export async function entrar(nome, codigo) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailDoNome(nome),
    password: codigo,
  });
  if (error) {
    if (/invalid login credentials/i.test(error.message)) {
      throw new Error("Código incorreto.");
    }
    throw error;
  }
  return data.user;
}

export async function sair() {
  await supabase.auth.signOut();
}

/**
 * Muda o código de quem tem sessão iniciada.
 *
 * Pede o código atual antes de mudar: sem isso, bastava alguém apanhar uma
 * sessão aberta num computador para trocar o código e tomar conta do perfil.
 */
export async function mudarCodigo(nome, codigoAtual, codigoNovo) {
  if (!codigoNovo || codigoNovo.length < COMPRIMENTO_MINIMO) {
    throw new Error(`O código tem de ter pelo menos ${COMPRIMENTO_MINIMO} caracteres.`);
  }
  if (codigoNovo === codigoAtual) {
    throw new Error("O código novo é igual ao atual.");
  }

  // Confirma o código atual voltando a autenticar.
  const { error: erroAtual } = await supabase.auth.signInWithPassword({
    email: emailDoNome(nome),
    password: codigoAtual,
  });
  if (erroAtual) throw new Error("O código atual está incorreto.");

  const { error } = await supabase.auth.updateUser({ password: codigoNovo });
  if (error) throw error;
}

/**
 * Nome do membro com sessão iniciada.
 *
 * Distingue três situações que antes eram todas tratadas como "sem sessão",
 * o que fazia a plataforma mostrar zero em tudo sem explicação: bastava a
 * leitura de `profiles` falhar (rede, RLS) para o utilizador ficar sem nome
 * apesar de a sessão do Supabase Auth continuar válida.
 *
 *   { logado: false }                         — sem sessão, é suposto ver o ecrã de entrada
 *   { logado: true, nome, erro: null }         — tudo bem
 *   { logado: true, nome: null, erro: '...' }  — sessão válida, mas não foi possível
 *                                                 confirmar a que perfil corresponde
 */
export async function membroComSessao() {
  const { data, error: erroSessao } = await supabase.auth.getSession();
  if (erroSessao) throw erroSessao;
  if (!data?.session) return { logado: false, nome: null, erro: null };

  const { data: perfil, error: erroPerfil } = await supabase
    .from("profiles")
    .select("nome")
    .eq("user_id", data.session.user.id)
    .maybeSingle();

  if (erroPerfil) {
    return { logado: true, nome: null, erro: erroPerfil.message };
  }
  if (!perfil) {
    // Sessão válida (o login foi aceite), mas nenhum perfil aponta para esta
    // conta — normalmente porque `associar_conta` falhou depois do signUp
    // (ver definirCodigo). É diferente de "sem sessão": aqui há alguém
    // autenticado que a plataforma não consegue reconhecer.
    return {
      logado: true, nome: null,
      erro: "A tua conta não está associada a nenhum membro da equipa. Contacta quem gere a plataforma.",
    };
  }
  return { logado: true, nome: perfil.nome, erro: null };
}

/**
 * Dados de toda a equipa, indexados por nome.
 *
 * Os e-mails são assinados pelo responsável atribuído ao contacto, que pode
 * não ser quem está a enviar — daí precisarmos dos dados de todos, e não só
 * de quem tem sessão.
 */
export async function dadosDeTodosOsMembros() {
  const { data, error } = await supabase
    .from("profiles")
    .select("nome, cargo, departamento");
  if (error) throw error;
  const porNome = {};
  (data || []).forEach((m) => { porNome[m.nome] = m; });
  return porNome;
}

/**
 * Dados de um membro para a assinatura dos e-mails (nome, cargo, departamento).
 */
export async function dadosMembro(nome) {
  if (!nome) return null;
  const { data } = await supabase
    .from("profiles")
    .select("nome, cargo, departamento")
    .eq("nome", nome)
    .maybeSingle();
  return data || { nome, cargo: "", departamento: "" };
}
