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
  const { error: erroAssociar } = await supabase.rpc("associar_conta", {
    p_nome: nome,
    p_user_id: data.user.id,
  });
  if (erroAssociar) throw erroAssociar;

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

/** Nome do membro com sessão iniciada, ou null. */
export async function membroComSessao() {
  const { data } = await supabase.auth.getSession();
  if (!data?.session) return null;
  const { data: perfil } = await supabase
    .from("profiles")
    .select("nome")
    .eq("user_id", data.session.user.id)
    .maybeSingle();
  return perfil?.nome || null;
}
