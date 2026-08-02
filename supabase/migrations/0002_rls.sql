-- ============================================================================
-- Row Level Security
-- ============================================================================
--
-- ATENÇÃO — LEIA ANTES DE USAR EM PRODUÇÃO
--
-- A plataforma entra por escolha de nome, sem password. Isso significa que o
-- Postgres NÃO consegue saber quem está a fazer cada pedido: todos os acessos
-- chegam como o papel `anon`, com a chave anónima que vai no JavaScript e que
-- qualquer pessoa lê no DevTools do browser.
--
-- Consequência prática: as políticas desta primeira secção deixam qualquer
-- pessoa com o endereço do site ler e alterar tudo — contactos, emails,
-- telefones, tarefas. A distinção entre líderes e membros existe no interface,
-- mas não é imposta pela base de dados e contorna-se com poucas linhas de
-- código no browser.
--
-- Para fechar isto é preciso autenticação a sério. Quando existir, basta:
--   1. preencher profiles.user_id para cada membro;
--   2. correr a migration 0003_rls_autenticado.sql, que troca as políticas
--      abertas pelas restritas (já escritas, prontas a aplicar).
-- O esquema não muda — só as políticas.
-- ============================================================================

alter table profiles       enable row level security;
alter table contacts       enable row level security;
alter table contact_events enable row level security;
alter table templates      enable row level security;
alter table tasks          enable row level security;
alter table documents      enable row level security;

-- ---------------------------------------------------------------------------
-- Funções auxiliares — usadas pelas políticas restritas (migration 0003).
-- Ficam já criadas para a transição ser só trocar políticas.
-- ---------------------------------------------------------------------------

-- Nome do membro correspondente ao utilizador autenticado.
create or replace function membro_atual()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select nome from profiles where user_id = auth.uid();
$$;

-- Verdadeiro quando o utilizador autenticado é líder de equipa.
create or replace function e_lider()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'lider' from profiles where user_id = auth.uid()),
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- POLÍTICAS ABERTAS (estado atual: sem autenticação)
--
-- Nomeadas com o prefixo `aberto_` para serem fáceis de encontrar e remover.
-- ---------------------------------------------------------------------------

create policy aberto_profiles on profiles
  for all to anon, authenticated using (true) with check (true);

create policy aberto_contacts on contacts
  for all to anon, authenticated using (true) with check (true);

create policy aberto_contact_events on contact_events
  for all to anon, authenticated using (true) with check (true);

create policy aberto_templates on templates
  for all to anon, authenticated using (true) with check (true);

create policy aberto_tasks on tasks
  for all to anon, authenticated using (true) with check (true);

create policy aberto_documents on documents
  for all to anon, authenticated using (true) with check (true);
