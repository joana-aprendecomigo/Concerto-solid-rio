-- ============================================================================
-- Fase do contacto — etiqueta definida à mão pela equipa
-- ============================================================================
-- Distinta de `fase_followup`, que a plataforma calcula sozinha a partir dos
-- e-mails enviados. Esta é atribuída manualmente e serve para a equipa
-- organizar o trabalho como entender.
-- ============================================================================

create type contact_fase as enum ('Fase 1', 'Fase 2', 'Fase 3');

alter table contacts add column fase contact_fase;

comment on column contacts.fase is
  'Etiqueta atribuída manualmente pela equipa. Não confundir com fase_followup, que é automática.';

create index contacts_fase_idx on contacts (fase) where fase is not null;
