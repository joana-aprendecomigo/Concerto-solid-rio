-- ============================================================================
-- Concerto Solidário · esquema base
-- ============================================================================
-- Artistas, Espaços e Parceiros partilham praticamente todos os campos e toda a
-- lógica de seguimento/follow-up, e o Dashboard já os trata em conjunto. Por
-- isso vivem numa única tabela `contacts` distinguida por `tipo`, em vez de três
-- tabelas quase idênticas: a timeline, as tarefas automáticas e as estatísticas
-- passam a ser uma só query em vez de três unidas à mão.
-- ============================================================================

-- `unaccent` permite comparar nomes ignorando acentos, como o código já fazia
-- em `normNome` para detetar duplicados.
create extension if not exists unaccent;

-- O `unaccent` da extensão não é IMMUTABLE (o resultado depende do dicionário
-- configurado), e o Postgres só aceita funções imutáveis em índices. Este
-- wrapper fixa o dicionário, tornando o resultado determinístico e utilizável
-- no índice de nomes duplicados mais abaixo.
create or replace function nome_normalizado(texto text)
returns text
language sql
immutable
strict
parallel safe
as $$
  select lower(public.unaccent('public.unaccent', texto));
$$;

-- ---------------------------------------------------------------------------
-- Tipos enumerados: espelham as constantes que já existiam no código
-- ---------------------------------------------------------------------------

create type contact_tipo as enum ('artista', 'espaco', 'parceiro');

create type contact_estado as enum (
  'Por contactar',
  'A aguardar resposta',
  'Pediu mais informações',
  'Positivo / Disponível',
  'Confirmado',
  'Recusado'
);

create type parceiro_categoria as enum (
  'Financeiro',
  'Logística',
  'Notoriedade / Media',
  'Institucional',
  'Em espécie / Produto'
);

create type template_categoria as enum (
  'Contacto IPO',
  'Artistas',
  'Espaços',
  'Tipografias',
  'Parceiros',
  'Parceiros Divulgação (RSC)'
);

create type task_estado as enum ('Por fazer', 'Em progresso', 'Concluída');

create type task_prioridade as enum ('Baixa', 'Média', 'Alta');

create type documento_categoria as enum (
  'Acordos',
  'Contratos',
  'Financeiro',
  'Comunicação',
  'Logística',
  'Outro'
);

-- Tipos de acontecimento na timeline de um contacto.
create type evento_tipo as enum (
  'email',
  'primeiro_contacto',
  'followup_criado',
  'followup_auto',
  'resposta',
  'estado',
  'nota',
  'tarefa_concluida'
);

create type membro_role as enum ('lider', 'membro');

-- ---------------------------------------------------------------------------
-- profiles — membros da equipa
-- ---------------------------------------------------------------------------
-- `user_id` liga a auth.users e fica nulo enquanto o login for apenas a escolha
-- de um nome. Quando se ativar autenticação a sério, preenche-se esta coluna e
-- as políticas de RLS passam a ter identidade verificada sem mudar o esquema.

create table profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique references auth.users (id) on delete cascade,
  nome        text not null unique,
  role        membro_role not null default 'membro',
  criado_em   timestamptz not null default now()
);

comment on column profiles.user_id is
  'Liga a auth.users. Nulo enquanto o acesso for por escolha de nome sem password.';

-- ---------------------------------------------------------------------------
-- contacts — artistas, espaços e parceiros
-- ---------------------------------------------------------------------------

create table contacts (
  id                     uuid primary key default gen_random_uuid(),
  tipo                   contact_tipo not null,
  nome                   text not null,

  -- contacto
  pessoa_contacto        text not null default '',
  email                  text not null default '',
  telefone               text not null default '',

  -- campos específicos de cada tipo (nulos nos restantes)
  agencia                text,               -- artistas
  cidade                 text,               -- espaços
  capacidade             text,               -- espaços
  categoria              parceiro_categoria, -- parceiros
  contributo             text,               -- parceiros

  -- seguimento
  responsavel            text references profiles (nome) on update cascade on delete set null,
  estado                 contact_estado not null default 'Por contactar',
  data_ultimo_contacto   date,
  data_proximo_contacto  date,
  observacoes            text not null default '',

  -- fluxo de follow-up automático
  aguarda_resposta       boolean not null default false,
  fase_followup          smallint not null default 0,
  data_ultimo_envio      timestamptz,

  -- auditoria
  criado_por             text,
  atualizado_por         text,
  criado_em              timestamptz not null default now(),
  atualizado_em          timestamptz not null default now(),

  -- um contacto só tem categoria/contributo se for parceiro
  constraint categoria_so_em_parceiros
    check (tipo = 'parceiro' or categoria is null)
);

-- Evita duplicados do mesmo nome dentro do mesmo tipo, ignorando maiúsculas e
-- acentos — a mesma normalização que o código já fazia em `normNome`.
create unique index contacts_nome_unico_por_tipo
  on contacts (tipo, nome_normalizado(nome));

create index contacts_tipo_idx on contacts (tipo);
create index contacts_responsavel_idx on contacts (responsavel);
create index contacts_estado_idx on contacts (estado);
create index contacts_proximo_contacto_idx on contacts (data_proximo_contacto)
  where data_proximo_contacto is not null;

-- ---------------------------------------------------------------------------
-- contact_events — a timeline de cada contacto
-- ---------------------------------------------------------------------------
-- Substitui o array `historico` que vivia dentro de cada contacto. Sendo linhas
-- próprias, dá para ordenar, filtrar e agregar no Dashboard sem carregar todos
-- os contactos para memória.

create table contact_events (
  id             uuid primary key default gen_random_uuid(),
  contact_id     uuid not null references contacts (id) on delete cascade,
  tipo           evento_tipo not null,
  autor          text,
  data           timestamptz not null default now(),

  -- conteúdo consoante o tipo de acontecimento
  assunto        text,        -- email
  corpo          text,        -- email
  texto          text,        -- nota
  estado_de      contact_estado, -- estado
  estado_para    contact_estado, -- estado
  fase           smallint,    -- followup_criado / followup_auto
  template_id    uuid,        -- email / followup
  template_nome  text,
  dias           smallint,    -- followup_auto
  tarefa_titulo  text,        -- tarefa_concluida

  -- histórico de edições das observações (autor, data e conteúdo anterior)
  editado_por    text,
  editado_em     timestamptz,
  edicoes        jsonb not null default '[]'::jsonb
);

create index contact_events_contact_idx on contact_events (contact_id, data desc);
create index contact_events_tipo_data_idx on contact_events (tipo, data desc);

-- ---------------------------------------------------------------------------
-- templates — templates de email, organizados por categoria e fase
-- ---------------------------------------------------------------------------

create table templates (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  categoria       template_categoria not null default 'Artistas',
  fase            smallint not null default 1 check (fase >= 1),
  assunto         text not null default '',
  corpo           text not null default '',

  -- dias sem resposta antes de a plataforma criar o follow-up da fase seguinte
  intervalo_dias  smallint not null default 10 check (intervalo_dias > 0),

  criado_por      text,
  atualizado_por  text,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

-- Cada categoria só tem um template por fase — é o que o fluxo de follow-up
-- assume ao procurar "a fase seguinte" desta categoria.
create unique index templates_categoria_fase_unica on templates (categoria, fase);

-- ---------------------------------------------------------------------------
-- tasks — tarefas manuais e as automáticas geradas a partir dos contactos
-- ---------------------------------------------------------------------------

create table tasks (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null,
  responsavel     text references profiles (nome) on update cascade on delete set null,
  data_limite     date,
  estado          task_estado not null default 'Por fazer',
  prioridade      task_prioridade not null default 'Média',

  -- origem: preenchido nas tarefas geradas automaticamente a partir de um
  -- contacto. `origem_evento` distingue o primeiro contacto (nulo) do follow-up.
  origem_contact_id uuid references contacts (id) on delete cascade,
  origem_tipo       contact_tipo,
  origem_evento     text check (origem_evento in ('followup')),
  origem_fase       smallint,
  origem_template_id uuid references templates (id) on delete set null,

  -- `origem_tipo` acompanha sempre `origem_contact_id`
  constraint origem_coerente
    check ((origem_contact_id is null) = (origem_tipo is null)),

  criado_por      text,
  atualizado_por  text,
  criado_em       timestamptz not null default now(),
  concluida_em    timestamptz
);

-- Um contacto só tem uma tarefa de primeiro contacto...
create unique index tasks_primeiro_contacto_unico
  on tasks (origem_contact_id)
  where origem_contact_id is not null and origem_evento is null;

-- ...e uma tarefa de follow-up por fase. Evita os duplicados que o scan
-- automático tinha de verificar à mão antes de criar cada tarefa.
create unique index tasks_followup_unico_por_fase
  on tasks (origem_contact_id, origem_fase)
  where origem_contact_id is not null and origem_evento = 'followup';

create index tasks_responsavel_idx on tasks (responsavel);
create index tasks_estado_idx on tasks (estado);

-- ---------------------------------------------------------------------------
-- documents — repositório de documentação partilhada
-- ---------------------------------------------------------------------------

create table documents (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null,
  categoria       documento_categoria not null default 'Acordos',
  link            text not null default '',
  notas           text not null default '',
  criado_por      text,
  atualizado_por  text,
  criado_em       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- atualizado_em automático
-- ---------------------------------------------------------------------------

create or replace function set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger contacts_atualizado_em
  before update on contacts
  for each row execute function set_atualizado_em();

create trigger templates_atualizado_em
  before update on templates
  for each row execute function set_atualizado_em();
