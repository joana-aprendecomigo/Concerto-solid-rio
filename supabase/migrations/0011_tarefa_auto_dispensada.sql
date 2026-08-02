-- ============================================================================
-- Marcar contactos cuja tarefa automática foi dispensada
-- ============================================================================
-- A plataforma cria sozinha uma tarefa "Contactar X" para cada contacto com
-- responsável atribuído. Quando alguém a elimina por já não fazer sentido, o
-- sincronizador recriava-a na visita seguinte e a eliminação não durava.
--
-- Esta coluna guarda essa decisão. Fica no contacto, e não numa lista de
-- tarefas apagadas, porque é uma propriedade do contacto: "não é preciso
-- criar tarefa de primeiro contacto para este".
-- ============================================================================

alter table contacts
  add column if not exists tarefa_auto_dispensada boolean not null default false;

comment on column contacts.tarefa_auto_dispensada is
  'A equipa eliminou a tarefa automática de primeiro contacto; não voltar a criá-la.';

-- Reatribuir o contacto a outra pessoa é um recomeço: faz sentido a tarefa
-- voltar a aparecer para quem passou a ser responsável.
create or replace function limpar_dispensa_ao_mudar_responsavel()
returns trigger
language plpgsql
as $$
begin
  if new.responsavel is distinct from old.responsavel then
    new.tarefa_auto_dispensada = false;
  end if;
  return new;
end;
$$;

create trigger contacts_limpar_dispensa
  before update on contacts
  for each row execute function limpar_dispensa_ao_mudar_responsavel();
