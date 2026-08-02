-- ============================================================================
-- Corrigir `atualizado_em`, que deixou de ser mantido
-- ============================================================================
-- A tabela `contacts` ficou com dois triggers BEFORE UPDATE. O Postgres
-- corre-os por ordem alfabética e passa o `NEW` de um para o outro:
--
--   contacts_atualizado_em    → define new.atualizado_em = now()
--   contacts_limpar_dispensa  → devolve o seu próprio `new`, sem essa alteração
--
-- Resultado: `atualizado_em` deixou de mudar em quase todas as gravações.
-- Isso quebra a deteção de edições simultâneas — a plataforma compara esta
-- marca para avisar quando duas pessoas mexem no mesmo contacto, e sem ela o
-- aviso nunca aparecia.
--
-- Passa a haver um único trigger com as duas responsabilidades, o que também
-- evita que o problema se repita ao acrescentar outro no futuro.
-- ============================================================================

drop trigger if exists contacts_limpar_dispensa on contacts;
drop trigger if exists contacts_atualizado_em on contacts;
drop function if exists limpar_dispensa_ao_mudar_responsavel();

create or replace function contacts_antes_de_atualizar()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();

  -- Reatribuir o contacto a outra pessoa é um recomeço: a tarefa automática
  -- volta a fazer sentido para quem passou a ser responsável.
  if new.responsavel is distinct from old.responsavel then
    new.tarefa_auto_dispensada = false;
  end if;

  return new;
end;
$$;

create trigger contacts_antes_de_atualizar
  before update on contacts
  for each row execute function contacts_antes_de_atualizar();
