// ============================================================================
// Adaptador: implementa a interface `window.storage` sobre o Supabase.
//
// O componente guarda arrays inteiros por chave ("ymec_artists_v1", ...). Aqui
// traduzimos cada uma dessas escritas para as tabelas correspondentes, o que
// permite manter as 5000+ linhas do interface sem alterações enquanto os dados
// passam a ser partilhados por toda a equipa.
//
// A escrita é feita por diferença: comparamos com o que está em memória e só
// enviamos o que mudou. Isso evita reescrever centenas de linhas a cada
// alteração e — mais importante — evita que dois membros a trabalhar ao mesmo
// tempo se sobreponham um ao outro.
// ============================================================================

import { supabase } from "./supabase.js";
import {
  contactoDaBD, contactoParaBD,
  eventoParaBD,
  templateDaBD, templateParaBD,
  tarefaDaBD, tarefaParaBD,
  documentoDaBD, documentoParaBD,
} from "./mapeamento.js";

export const CHAVES = {
  ARTISTAS: "ymec_artists_v1",
  ESPACOS: "ymec_spaces_v1",
  PARCEIROS: "ymec_partners_v1",
  MEMBROS: "ymec_members_v1",
  TEMPLATES: "ymec_templates_v1",
  TAREFAS: "ymec_tasks_v1",
  DOCUMENTOS: "ymec_documents_v1",
};

const TIPO_POR_CHAVE = {
  [CHAVES.ARTISTAS]: "artista",
  [CHAVES.ESPACOS]: "espaco",
  [CHAVES.PARCEIROS]: "parceiro",
};

// Última versão lida de cada chave, para calcular diferenças na escrita.
const cache = new Map();

const porId = (lista) => new Map((lista || []).map((x) => [x.id, x]));

// ---------------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------------

async function lerContactos(tipo) {
  const { data, error } = await supabase
    .from("contacts")
    .select("*, contact_events(*)")
    .eq("tipo", tipo)
    .order("data", { referencedTable: "contact_events", ascending: false });
  if (error) throw error;
  return (data || []).map(contactoDaBD);
}

async function lerTemplates() {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("categoria")
    .order("fase");
  if (error) throw error;
  return (data || []).map(templateDaBD);
}

async function lerTarefas() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return (data || []).map(tarefaDaBD);
}

async function lerDocumentos() {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return (data || []).map(documentoDaBD);
}

async function lerMembros() {
  const { data, error } = await supabase.from("profiles").select("nome").order("nome");
  if (error) throw error;
  return (data || []).map((r) => r.nome);
}

async function ler(chave) {
  const tipo = TIPO_POR_CHAVE[chave];
  if (tipo) return lerContactos(tipo);
  if (chave === CHAVES.TEMPLATES) return lerTemplates();
  if (chave === CHAVES.TAREFAS) return lerTarefas();
  if (chave === CHAVES.DOCUMENTOS) return lerDocumentos();
  if (chave === CHAVES.MEMBROS) return lerMembros();
  return null;
}

// ---------------------------------------------------------------------------
// Escrita por diferença
// ---------------------------------------------------------------------------

async function guardarContactos(chave, tipo, novos) {
  const antigos = cache.get(chave) || [];
  const antigosPorId = porId(antigos);
  const novosPorId = porId(novos);

  const paraGravar = novos.filter((c) => {
    const antigo = antigosPorId.get(c.id);
    if (!antigo) return true;
    // Compara tudo menos a timeline, tratada em separado.
    const { historico: _h1, ...a } = antigo;
    const { historico: _h2, ...b } = c;
    return JSON.stringify(a) !== JSON.stringify(b);
  });

  if (paraGravar.length) {
    const { error } = await supabase
      .from("contacts")
      .upsert(paraGravar.map((c) => contactoParaBD(c, tipo)));
    if (error) throw error;
  }

  // Eventos novos da timeline (só se acrescentam, nunca se apagam).
  const eventosNovos = [];
  novos.forEach((c) => {
    const antigo = antigosPorId.get(c.id);
    const jaExistentes = new Set((antigo?.historico || []).map((e) => e.id));
    (c.historico || []).forEach((ev) => {
      if (!jaExistentes.has(ev.id)) eventosNovos.push(eventoParaBD(ev, c.id));
    });
  });
  if (eventosNovos.length) {
    const { error } = await supabase.from("contact_events").upsert(eventosNovos);
    if (error) throw error;
  }

  // Eventos editados (as observações de uma nota ou email).
  const eventosEditados = [];
  novos.forEach((c) => {
    const antigo = antigosPorId.get(c.id);
    if (!antigo) return;
    const antesPorId = new Map((antigo.historico || []).map((e) => [e.id, e]));
    (c.historico || []).forEach((ev) => {
      const antes = antesPorId.get(ev.id);
      if (antes && JSON.stringify(antes) !== JSON.stringify(ev)) {
        eventosEditados.push(eventoParaBD(ev, c.id));
      }
    });
  });
  if (eventosEditados.length) {
    const { error } = await supabase.from("contact_events").upsert(eventosEditados);
    if (error) throw error;
  }

  const removidos = antigos.filter((c) => !novosPorId.has(c.id)).map((c) => c.id);
  if (removidos.length) {
    const { error } = await supabase.from("contacts").delete().in("id", removidos);
    if (error) throw error;
  }
}

async function guardarSimples(chave, tabela, novos, paraBD) {
  const antigos = cache.get(chave) || [];
  const antigosPorId = porId(antigos);
  const novosPorId = porId(novos);

  const paraGravar = novos.filter((x) => {
    const antigo = antigosPorId.get(x.id);
    return !antigo || JSON.stringify(antigo) !== JSON.stringify(x);
  });
  if (paraGravar.length) {
    const { error } = await supabase.from(tabela).upsert(paraGravar.map(paraBD));
    if (error) throw error;
  }

  const removidos = antigos.filter((x) => !novosPorId.has(x.id)).map((x) => x.id);
  if (removidos.length) {
    const { error } = await supabase.from(tabela).delete().in("id", removidos);
    if (error) throw error;
  }
}

async function guardarMembros(novos) {
  // `novos` é uma lista de nomes. Só acrescentamos: remover um membro é uma
  // decisão de gestão de equipa, não um efeito lateral de alguém entrar.
  const existentes = new Set(cache.get(CHAVES.MEMBROS) || []);
  const aAdicionar = (novos || []).filter((n) => n && !existentes.has(n));
  if (aAdicionar.length) {
    const { error } = await supabase
      .from("profiles")
      .upsert(aAdicionar.map((nome) => ({ nome })), { onConflict: "nome" });
    if (error) throw error;
  }
}

async function guardar(chave, valor) {
  const tipo = TIPO_POR_CHAVE[chave];
  if (tipo) return guardarContactos(chave, tipo, valor);
  if (chave === CHAVES.TEMPLATES) return guardarSimples(chave, "templates", valor, templateParaBD);
  if (chave === CHAVES.TAREFAS) return guardarSimples(chave, "tasks", valor, tarefaParaBD);
  if (chave === CHAVES.DOCUMENTOS) return guardarSimples(chave, "documents", valor, documentoParaBD);
  if (chave === CHAVES.MEMBROS) return guardarMembros(valor);
}

// ---------------------------------------------------------------------------
// Interface window.storage
// ---------------------------------------------------------------------------

export function instalarStorageSupabase() {
  window.storage = {
    async get(chave) {
      const lista = await ler(chave);
      if (lista === null) return { value: null };
      cache.set(chave, lista);
      return { value: JSON.stringify(lista) };
    },

    async set(chave, valorJSON) {
      const valor = JSON.parse(valorJSON);
      await guardar(chave, valor);
      cache.set(chave, valor);
      return true;
    },
  };
}

// Permite ao Realtime invalidar a cache quando os dados mudam noutro browser.
export function limparCache(chave) {
  if (chave) cache.delete(chave);
  else cache.clear();
}
