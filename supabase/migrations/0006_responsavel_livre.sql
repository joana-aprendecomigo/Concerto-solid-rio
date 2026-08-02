-- ============================================================================
-- Permitir responsáveis que não são membros individuais
-- ============================================================================
-- A chave estrangeira para `profiles` obrigava o responsável a ser uma pessoa
-- registada. Mas a equipa também atribui trabalho a departamentos — há uma
-- tarefa para "Comunicação" que era rejeitada com violação de chave
-- estrangeira, e por isso nunca chegou a entrar na plataforma.
--
-- Passa a ser texto livre. A ligação a `profiles` continua a existir para os
-- membros individuais (é por lá que o Dashboard agrega as estatísticas), mas
-- deixa de ser imposta pela base de dados.
-- ============================================================================

alter table contacts drop constraint if exists contacts_responsavel_fkey;
alter table tasks    drop constraint if exists tasks_responsavel_fkey;

-- Recupera a tarefa de Comunicação, que a restrição tinha bloqueado.
insert into tasks (titulo, responsavel)
select
  'Ter mais ideias para comunicar o concerto e ajudar na divulgação (ex.: ideia dos embaixadores) — combinar reunião com a equipa para apresentar propostas',
  'Comunicação'
where not exists (
  select 1 from tasks where responsavel = 'Comunicação'
);
