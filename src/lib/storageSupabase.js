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

// Momento da última gravação feita nesta sessão. O Realtime devolve também as
// alterações que nós próprios fazemos; sem isto, gravar levava a aplicação a
// recarregar-se e a voltar ao ecrã inicial a cada edição.
let ultimaEscritaLocal = 0;
export const escreveuAgora = () => ultimaEscritaLocal;
export const marcarEscritaLocal = () => { ultimaEscritaLocal = Date.now(); };

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

/**
 * Campos que mudaram entre duas versões do mesmo registo.
 *
 * Enviar o registo inteiro fazia com que quem gravasse por último apagasse o
 * trabalho do outro: bastava terem aberto a mesma ficha, mesmo que tivessem
 * mexido em campos diferentes. Enviando só o que cada um alterou, duas pessoas
 * podem editar campos distintos do mesmo contacto sem se atropelarem.
 */
function camposAlterados(antes, depois) {
  const alteracoes = {};
  Object.keys(depois).forEach((k) => {
    if (JSON.stringify(antes?.[k]) !== JSON.stringify(depois[k])) {
      alteracoes[k] = depois[k];
    }
  });
  return alteracoes;
}

/** Avisos de conflito acumulados durante uma gravação, para a UI mostrar. */
let conflitos = [];
export function recolherConflitos() {
  const c = conflitos;
  conflitos = [];
  return c;
}

async function guardarContactos(chave, tipo, novos) {
  const antigos = cache.get(chave) || [];
  const antigosPorId = porId(antigos);
  const novosPorId = porId(novos);

  const criados = [];
  const editados = [];
  novos.forEach((c) => {
    const antigo = antigosPorId.get(c.id);
    if (!antigo) {
      criados.push(c);
      return;
    }
    const { historico: _h1, ...a } = antigo;
    const { historico: _h2, ...b } = c;
    if (JSON.stringify(a) !== JSON.stringify(b)) editados.push({ antigo: a, novo: c });
  });

  if (criados.length) {
    const { error } = await supabase.from("contacts").insert(
      criados.map((c) => {
        const linha = contactoParaBD(c, tipo);
        // Quem gere estas colunas é a base de dados.
        delete linha.atualizado_em;
        return linha;
      })
    );
    if (error) throw error;
  }

  for (const { antigo, novo } of editados) {
    const linhaAntiga = contactoParaBD(antigo, tipo);
    const linhaNova = contactoParaBD(novo, tipo);
    const alteracoes = camposAlterados(linhaAntiga, linhaNova);
    delete alteracoes.id;
    delete alteracoes.tipo;
    delete alteracoes.atualizado_em; // mantido pelo trigger
    if (!Object.keys(alteracoes).length) continue;

    // Confirma que ninguém mexeu no registo desde que o lemos. Se mexeu,
    // gravamos na mesma (as alterações são de campos que este utilizador
    // editou) mas avisamos, para a pessoa poder verificar o resultado.
    const { data: atual } = await supabase
      .from("contacts")
      .select("atualizado_em, atualizado_por")
      .eq("id", novo.id)
      .maybeSingle();

    const { error } = await supabase
      .from("contacts")
      .update(alteracoes)
      .eq("id", novo.id);
    if (error) throw error;

    if (
      atual &&
      antigo.atualizado_em &&
      atual.atualizado_em !== antigo.atualizado_em &&
      atual.atualizado_por &&
      atual.atualizado_por !== novo.atualizadoPor
    ) {
      conflitos.push({ nome: novo.nome, outro: atual.atualizado_por });
    }
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
    if (error) {
      // As tarefas automáticas (primeiro contacto e follow-up) são geradas em
      // paralelo por todos os browsers abertos, por isso duas pessoas podem
      // tentar criar a mesma ao mesmo tempo. O índice único garante que só uma
      // fica — a colisão é o mecanismo a funcionar, não um erro para mostrar a
      // quem por acaso perdeu a corrida.
      const colisaoDeTarefaAutomatica =
        tabela === "tasks" &&
        error.code === "23505" &&
        paraGravar.every((t) => t.origem_contact_id);
      if (!colisaoDeTarefaAutomatica) throw error;
    }
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
      marcarEscritaLocal();

      // Avisa a interface se alguém tiver alterado os mesmos contactos
      // entretanto. A gravação foi feita (só dos campos que esta pessoa
      // mexeu), mas convém saber que a ficha tem também trabalho de outrem.
      const cs = recolherConflitos();
      if (cs.length && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("concerto:conflito", { detail: cs }));
      }
      return true;
    },
  };
}

// Permite ao Realtime invalidar a cache quando os dados mudam noutro browser.
export function limparCache(chave) {
  if (chave) cache.delete(chave);
  else cache.clear();
}
