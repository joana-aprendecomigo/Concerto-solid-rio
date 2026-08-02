// ============================================================================
// Realtime — sincronização instantânea entre os membros da equipa.
//
// Quando alguém altera um contacto, conclui uma tarefa ou envia um email, as
// outras pessoas veem a alteração sem recarregar a página.
//
// Estratégia: ao receber uma alteração, marcamos a cache como suja e avisamos
// a aplicação para reler. É mais simples (e mais fiável) do que tentar aplicar
// cada alteração individualmente ao estado do React — e como as listas são
// pequenas, a releitura é barata.
// ============================================================================

import { supabase } from "./supabase.js";
import { CHAVES, limparCache } from "./storageSupabase.js";

// Que chaves do interface são afetadas por cada tabela.
const CHAVES_AFETADAS = {
  contacts: [CHAVES.ARTISTAS, CHAVES.ESPACOS, CHAVES.PARCEIROS],
  contact_events: [CHAVES.ARTISTAS, CHAVES.ESPACOS, CHAVES.PARCEIROS],
  templates: [CHAVES.TEMPLATES],
  tasks: [CHAVES.TAREFAS],
  documents: [CHAVES.DOCUMENTOS],
  profiles: [CHAVES.MEMBROS],
};

/**
 * Começa a ouvir alterações. `aoMudar` é chamada com a lista de chaves que
 * precisam de ser relidas.
 *
 * Devolve uma função para cancelar a subscrição.
 */
export function ouvirAlteracoes(aoMudar) {
  if (!supabase) return () => {};

  // Agrupa alterações em rajada — uma operação que toca em várias tabelas
  // (ex.: enviar email cria um evento e atualiza o contacto) não deve provocar
  // várias releituras seguidas.
  let pendentes = new Set();
  let timer = null;

  const agendar = (tabela) => {
    (CHAVES_AFETADAS[tabela] || []).forEach((c) => {
      limparCache(c);
      pendentes.add(c);
    });
    clearTimeout(timer);
    timer = setTimeout(() => {
      const chaves = [...pendentes];
      pendentes = new Set();
      if (chaves.length) aoMudar(chaves);
    }, 250);
  };

  const canal = supabase.channel("concerto-alteracoes");

  Object.keys(CHAVES_AFETADAS).forEach((tabela) => {
    canal.on(
      "postgres_changes",
      { event: "*", schema: "public", table: tabela },
      () => agendar(tabela)
    );
  });

  canal.subscribe();

  return () => {
    clearTimeout(timer);
    supabase.removeChannel(canal);
  };
}
