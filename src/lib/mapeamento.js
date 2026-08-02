// ============================================================================
// Tradução entre o formato do interface (camelCase, um array por módulo) e o
// formato da base de dados (snake_case, tabelas normalizadas).
//
// O componente foi escrito para guardar arrays inteiros em `window.storage`.
// Em vez de o reescrever, traduzimos aqui — cada objeto do interface continua
// com a forma que ele espera, e a base de dados fica com um esquema decente.
// ============================================================================

const ouVazio = (v) => v ?? "";

// ---------------------------------------------------------------------------
// contactos (artistas, espaços, parceiros)
// ---------------------------------------------------------------------------

export function contactoDaBD(row) {
  const base = {
    id: row.id,
    nome: ouVazio(row.nome),
    pessoaContacto: ouVazio(row.pessoa_contacto),
    email: ouVazio(row.email),
    telefone: ouVazio(row.telefone),
    responsavel: ouVazio(row.responsavel),
    estado: row.estado,
    // Etiqueta manual da equipa (Fase 1/2/3), distinta de `faseFollowup`.
    fase: ouVazio(row.fase),
    dataUltimoContacto: ouVazio(row.data_ultimo_contacto),
    dataProximoContacto: ouVazio(row.data_proximo_contacto),
    observacoes: ouVazio(row.observacoes),
    aguardaResposta: Boolean(row.aguarda_resposta),
    // A equipa eliminou a tarefa automática deste contacto; não recriar.
    tarefaAutoDispensada: Boolean(row.tarefa_auto_dispensada),
    faseFollowup: row.fase_followup ?? 0,
    dataUltimoEnvio: ouVazio(row.data_ultimo_envio),
    criadoPor: ouVazio(row.criado_por),
    atualizadoPor: ouVazio(row.atualizado_por),
    // Marca temporal da última gravação, usada para detetar que outra pessoa
    // alterou este contacto entretanto.
    atualizadoEm: row.atualizado_em || "",
    historico: (row.contact_events || []).map(eventoDaBD),
  };

  if (row.tipo === "artista") base.agencia = ouVazio(row.agencia);
  if (row.tipo === "espaco") {
    base.cidade = ouVazio(row.cidade);
    base.capacidade = ouVazio(row.capacidade);
  }
  if (row.tipo === "parceiro") {
    base.categoria = row.categoria || "Financeiro";
    base.contributo = ouVazio(row.contributo);
  }
  return base;
}

export function contactoParaBD(c, tipo) {
  // Datas: o interface usa "" para vazio, o Postgres precisa de null.
  const data = (v) => (v ? v : null);

  const row = {
    id: c.id,
    tipo,
    nome: ouVazio(c.nome),
    pessoa_contacto: ouVazio(c.pessoaContacto),
    email: ouVazio(c.email),
    telefone: ouVazio(c.telefone),
    responsavel: c.responsavel || null,
    estado: c.estado || "Por contactar",
    // "" no interface significa sem fase atribuída; o enum precisa de null.
    fase: c.fase || null,
    data_ultimo_contacto: data(c.dataUltimoContacto),
    data_proximo_contacto: data(c.dataProximoContacto),
    observacoes: ouVazio(c.observacoes),
    aguarda_resposta: Boolean(c.aguardaResposta),
    tarefa_auto_dispensada: Boolean(c.tarefaAutoDispensada),
    fase_followup: c.faseFollowup ?? 0,
    data_ultimo_envio: data(c.dataUltimoEnvio),
    criado_por: c.criadoPor || null,
    atualizado_por: c.atualizadoPor || null,
    // Não se envia `atualizado_em`: é o trigger da base de dados que o mantém.
    // Fica aqui só para a comparação de versões saber o que já tínhamos lido.
    atualizado_em: c.atualizadoEm || null,
  };

  if (tipo === "artista") row.agencia = ouVazio(c.agencia);
  if (tipo === "espaco") {
    row.cidade = ouVazio(c.cidade);
    row.capacidade = ouVazio(c.capacidade);
  }
  if (tipo === "parceiro") {
    row.categoria = c.categoria || "Financeiro";
    row.contributo = ouVazio(c.contributo);
  }
  return row;
}

// ---------------------------------------------------------------------------
// eventos da timeline
// ---------------------------------------------------------------------------

export function eventoDaBD(row) {
  const ev = {
    id: row.id,
    tipo: row.tipo,
    data: row.data,
    user: ouVazio(row.autor),
  };
  if (row.tipo === "email") {
    ev.enviadoPor = ouVazio(row.autor);
    ev.assunto = ouVazio(row.assunto);
    ev.corpo = ouVazio(row.corpo);
    ev.templateId = row.template_id;
    ev.templateNome = ouVazio(row.template_nome);
  }
  if (row.tipo === "nota") ev.texto = ouVazio(row.texto);
  if (row.tipo === "estado") {
    ev.de = row.estado_de;
    ev.para = row.estado_para;
  }
  if (row.tipo === "followup_criado" || row.tipo === "followup_auto") {
    ev.fase = row.fase;
    ev.templateNome = row.template_nome;
    if (row.dias != null) ev.dias = row.dias;
  }
  if (row.tipo === "tarefa_concluida") ev.tarefaTitulo = ouVazio(row.tarefa_titulo);

  if (row.editado_por) {
    ev.editadoPor = row.editado_por;
    ev.editadoEm = row.editado_em;
    ev.edicoes = row.edicoes || [];
  }
  return ev;
}

export function eventoParaBD(ev, contactId) {
  return {
    id: ev.id,
    contact_id: contactId,
    tipo: ev.tipo || "email",
    autor: ev.enviadoPor || ev.user || null,
    data: ev.data,
    assunto: ev.assunto ?? null,
    corpo: ev.corpo ?? null,
    texto: ev.texto ?? null,
    estado_de: ev.de ?? null,
    estado_para: ev.para ?? null,
    fase: ev.fase ?? null,
    template_id: ev.templateId ?? null,
    template_nome: ev.templateNome ?? null,
    dias: ev.dias ?? null,
    tarefa_titulo: ev.tarefaTitulo ?? null,
    editado_por: ev.editadoPor ?? null,
    editado_em: ev.editadoEm ?? null,
    edicoes: ev.edicoes ?? [],
  };
}

// ---------------------------------------------------------------------------
// templates
// ---------------------------------------------------------------------------

export function templateDaBD(row) {
  return {
    id: row.id,
    nome: ouVazio(row.nome),
    categoria: row.categoria,
    fase: row.fase,
    assunto: ouVazio(row.assunto),
    corpo: ouVazio(row.corpo),
    intervaloDias: row.intervalo_dias,
    criadoPor: ouVazio(row.criado_por),
    atualizadoPor: ouVazio(row.atualizado_por),
    criadoEm: ouVazio(row.criado_em),
    atualizadoEm: ouVazio(row.atualizado_em),
  };
}

export function templateParaBD(t) {
  return {
    id: t.id,
    nome: ouVazio(t.nome),
    categoria: t.categoria || "Artistas",
    fase: Number(t.fase) || 1,
    assunto: ouVazio(t.assunto),
    corpo: ouVazio(t.corpo),
    intervalo_dias: Number(t.intervaloDias) || 10,
    criado_por: t.criadoPor || null,
    atualizado_por: t.atualizadoPor || null,
  };
}

// ---------------------------------------------------------------------------
// tarefas
// ---------------------------------------------------------------------------

export function tarefaDaBD(row) {
  const t = {
    id: row.id,
    titulo: ouVazio(row.titulo),
    responsavel: ouVazio(row.responsavel),
    dataLimite: ouVazio(row.data_limite),
    estado: row.estado,
    prioridade: row.prioridade,
    criadoPor: ouVazio(row.criado_por),
    atualizadoPor: ouVazio(row.atualizado_por),
    criadoEm: ouVazio(row.criado_em),
    concluidaEm: ouVazio(row.concluida_em),
  };
  if (row.origem_contact_id) {
    t.origem = {
      tipo: row.origem_tipo,
      contactId: row.origem_contact_id,
    };
    if (row.origem_evento) {
      t.origem.evento = row.origem_evento;
      t.origem.fase = row.origem_fase;
      t.origem.templateId = row.origem_template_id;
    }
  }
  return t;
}

export function tarefaParaBD(t) {
  return {
    id: t.id,
    titulo: ouVazio(t.titulo),
    responsavel: t.responsavel || null,
    data_limite: t.dataLimite || null,
    estado: t.estado || "Por fazer",
    prioridade: t.prioridade || "Média",
    origem_contact_id: t.origem?.contactId ?? null,
    origem_tipo: t.origem?.tipo ?? null,
    origem_evento: t.origem?.evento ?? null,
    origem_fase: t.origem?.fase ?? null,
    origem_template_id: t.origem?.templateId ?? null,
    criado_por: t.criadoPor || null,
    atualizado_por: t.atualizadoPor || null,
    concluida_em: t.concluidaEm || null,
  };
}

// ---------------------------------------------------------------------------
// documentos
// ---------------------------------------------------------------------------

export function documentoDaBD(row) {
  return {
    id: row.id,
    titulo: ouVazio(row.titulo),
    categoria: row.categoria,
    link: ouVazio(row.link),
    notas: ouVazio(row.notas),
    criadoPor: ouVazio(row.criado_por),
    atualizadoPor: ouVazio(row.atualizado_por),
    criadoEm: ouVazio(row.criado_em),
  };
}

export function documentoParaBD(d) {
  return {
    id: d.id,
    titulo: ouVazio(d.titulo),
    categoria: d.categoria || "Acordos",
    link: ouVazio(d.link),
    notas: ouVazio(d.notas),
    criado_por: d.criadoPor || null,
    atualizado_por: d.atualizadoPor || null,
  };
}
