-- ============================================================================
-- Categorias de template deixam de ser um enum fixo
-- ============================================================================
-- Até aqui "Contacto IPO", "Artistas", "Espaços"... eram um enum do Postgres:
-- para acrescentar, remover, renomear ou reordenar uma secção era preciso
-- mexer no código e fazer deploy. Passam a ser linhas de uma tabela, geridas
-- na própria interface.
--
-- Três categorias continuam a ter significado funcional (não são só um
-- rótulo): é a elas que o fluxo de follow-up automático vai buscar o
-- template de cada fase, associando por tipo de contacto (artista / espaço /
-- parceiro). Para o utilizador poder renomear essas categorias livremente
-- sem partir essa associação, ela passa a ser feita por uma chave estável
-- (`chave_sistema`), não pelo nome de texto.
-- ============================================================================

create table template_categorias (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null unique,
  cor             text not null default '#5B6478',
  icone           text not null default 'Mail',
  ordem           integer not null default 0,

  -- Preenchido só nas três categorias que o fluxo de follow-up usa para
  -- associar automaticamente um template ao tipo de contacto. As restantes
  -- (ex.: "Tipografias") ficam com isto a null — são organização livre da
  -- equipa, sem efeito no comportamento da plataforma.
  chave_sistema   text unique check (chave_sistema in ('artista', 'espaco', 'parceiro')),

  criado_por      text,
  atualizado_por  text,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

create trigger template_categorias_atualizado_em
  before update on template_categorias
  for each row execute function set_atualizado_em();

-- Dados iniciais: as mesmas seis categorias que já existiam, na mesma ordem,
-- com as mesmas cores e ícones — a migração não muda nada visualmente.
insert into template_categorias (nome, cor, icone, ordem, chave_sistema) values
  ('Contacto IPO',                '#B8791A', 'Landmark',  0, null),
  ('Artistas',                    '#E6178C', 'Music2',    1, 'artista'),
  ('Espaços',                     '#256B79', 'MapPin',    2, 'espaco'),
  ('Tipografias',                 '#8A93A1', 'Printer',   3, null),
  ('Parceiros',                   '#2C7A54', 'Handshake', 4, 'parceiro'),
  ('Parceiros Divulgação (RSC)',  '#B0394A', 'Megaphone', 5, null);

-- ---------------------------------------------------------------------------
-- Migrar templates.categoria de enum para referência a template_categorias
-- ---------------------------------------------------------------------------

-- `on delete cascade`: remover uma secção remove também os templates lá
-- dentro — decisão da equipa ao desenhar esta funcionalidade, avisada na
-- interface antes de confirmar, não um efeito acidental da base de dados.
alter table templates add column categoria_id uuid references template_categorias (id) on delete cascade;

update templates t
   set categoria_id = c.id
  from template_categorias c
 where c.nome = t.categoria::text;

alter table templates alter column categoria_id set not null;

drop index if exists templates_categoria_fase_unica;
alter table templates drop column categoria;
alter table templates rename column categoria_id to categoria_id;

-- Cada categoria só tem um template por fase — o fluxo de follow-up assume
-- isto ao procurar "a fase seguinte" desta categoria.
create unique index templates_categoria_fase_unica on templates (categoria_id, fase);

drop type if exists template_categoria;

comment on column templates.categoria_id is
  'Referência a template_categorias. Antes era um enum fixo (template_categoria).';

-- ---------------------------------------------------------------------------
-- Segurança — mesma política aberta das restantes tabelas (ver 0002_rls.sql).
-- Quando a autenticação for ativada (0009_rls_autenticado.sql), esta tabela
-- segue a mesma regra de `templates`: qualquer membro autenticado gere,
-- eliminar fica reservado a líderes.
-- ---------------------------------------------------------------------------

alter table template_categorias enable row level security;

create policy aberto_template_categorias on template_categorias
  for all to anon, authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Realtime — para uma secção criada, renomeada ou reordenada por alguém
-- aparecer nos outros browsers sem recarregar (ver 0005_realtime.sql).
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table template_categorias;
alter table template_categorias replica identity full;

