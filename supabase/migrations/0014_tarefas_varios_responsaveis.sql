-- ============================================================================
-- Tarefas com vários responsáveis
-- ============================================================================
-- Até aqui, uma tarefa partilhada por várias pessoas só podia existir como
-- várias linhas repetidas (mesmo título, um "responsavel" cada). Isso fazia a
-- mesma tarefa aparecer duplicada no quadro e nas estatísticas do Dashboard.
--
-- Passa a existir uma única tarefa com uma lista de responsáveis
-- ("responsaveis text[]"). Esta migration:
--   1. cria a nova coluna e copia para lá o responsável único existente;
--   2. funde tarefas duplicadas — mesmo título, mesmo estado, mesma data
--      limite e a mesma origem (ou nenhuma) — numa só, juntando todos os
--      responsáveis dessas linhas;
--   3. remove a coluna antiga e os índices que dependiam dela.
-- ============================================================================

alter table tasks add column if not exists responsaveis text[] not null default '{}';

update tasks
set responsaveis = case when responsavel is not null then array[responsavel] else '{}' end
where responsaveis = '{}';

-- Grupos de linhas que são "a mesma tarefa" feita por pessoas diferentes:
-- mesmo título, estado, data limite e origem (contacto/evento/fase iguais, ou
-- ambas sem origem nenhuma).
-- Tudo num só statement, com CTEs: uma tabela temporária não sobrevive de forma
-- fiável entre statements no SQL Editor do Supabase (o pool pode servir cada um
-- numa sessão diferente, e as temp tables são por sessão).
--
-- Os responsáveis do grupo são recolhidos por subquery sobre os ids, e não por
-- `array_agg(responsaveis)`: agregar uma coluna text[] produz um array
-- multidimensional (não um array de arrays), que o unnest achata de uma vez só
-- — e a agregação falha à partida se as linhas do grupo tiverem números
-- diferentes de responsáveis.
with grupos as (
  select array_agg(id order by criado_em asc) as ids
  from tasks
  group by
    titulo, estado, data_limite,
    coalesce(origem_contact_id::text, ''),
    coalesce(origem_evento, ''),
    coalesce(origem_fase, -1)
  having count(*) > 1
),
-- A linha mais antiga do grupo fica com todos os responsáveis juntos.
fundir as (
  update tasks
  set responsaveis = coalesce((
    select array_agg(distinct r)
    from tasks linha, unnest(linha.responsaveis) as r
    where linha.id = any (g.ids)
  ), '{}')
  from grupos g
  where tasks.id = g.ids[1]
  returning tasks.id
)
-- As restantes linhas do grupo (já fundidas na primeira) são removidas.
delete from tasks
using grupos g
where tasks.id = any (g.ids[2:array_length(g.ids, 1)]);

-- A policy de edição e o trigger de proteção de atribuição (migration 0009)
-- comparavam `responsavel = membro_atual()` / `new.responsavel is distinct
-- from old.responsavel` — dependiam da coluna que está a ser removida.
drop policy if exists tasks_editar on tasks;
create policy tasks_editar on tasks
  for update to authenticated
  using (e_lider() or membro_atual() = any (responsaveis))
  with check (e_lider() or membro_atual() = any (responsaveis));

create or replace function proteger_atribuicao_tarefa()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not e_lider() then
    if new.responsaveis is distinct from old.responsaveis then
      raise exception 'Apenas os líderes de equipa podem reatribuir tarefas.';
    end if;
    if new.titulo is distinct from old.titulo
       or new.data_limite is distinct from old.data_limite
       or new.prioridade is distinct from old.prioridade then
      raise exception 'Apenas os líderes de equipa podem editar tarefas.';
    end if;
  end if;
  return new;
end;
$$;

drop index if exists tasks_responsavel_idx;
alter table tasks drop column if exists responsavel;

create index if not exists tasks_responsaveis_idx on tasks using gin (responsaveis);
