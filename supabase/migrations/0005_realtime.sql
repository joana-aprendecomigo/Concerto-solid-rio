-- ============================================================================
-- Realtime — publicar alterações para sincronização instantânea
-- ============================================================================
-- Sem isto o Supabase não emite eventos e cada pessoa só vê o que estava lá
-- quando abriu a página.
-- ============================================================================

alter publication supabase_realtime add table contacts;
alter publication supabase_realtime add table contact_events;
alter publication supabase_realtime add table templates;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table documents;
alter publication supabase_realtime add table profiles;

-- `REPLICA IDENTITY FULL` faz com que os eventos de UPDATE/DELETE incluam os
-- valores antigos das linhas. Não é preciso para a estratégia atual (que relê
-- tudo ao ser notificada), mas evita surpresas se mais tarde se quiser aplicar
-- alterações individuais sem nova leitura.
alter table contacts       replica identity full;
alter table contact_events replica identity full;
alter table templates      replica identity full;
alter table tasks          replica identity full;
alter table documents      replica identity full;
