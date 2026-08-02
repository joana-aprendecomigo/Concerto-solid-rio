-- ============================================================================
-- Cargo e departamento de cada membro
-- ============================================================================
-- Servem para preencher automaticamente a assinatura dos e-mails: em vez de
-- cada pessoa escrever "[Teu Nome]" e "[teu cargo]" à mão em cada envio, o
-- template usa as variáveis {{cargo}} e {{departamento}} e a plataforma
-- preenche-as com os dados de quem está a enviar.
-- ============================================================================

alter table profiles add column if not exists cargo text;
alter table profiles add column if not exists departamento text;

comment on column profiles.cargo is
  'Cargo do membro, usado na assinatura dos e-mails (ex.: trainee).';
comment on column profiles.departamento is
  'Departamento do membro, usado na assinatura (ex.: sales & commercial).';

-- Dados atuais da equipa.
update profiles set cargo = 'Trainee',           departamento = 'Sales & Commercial'  where nome = 'Jonathan';
update profiles set cargo = 'Junior Consultant', departamento = 'Human Resources'     where nome = 'Ana';
update profiles set cargo = 'Junior Consultant', departamento = 'Sales & Commercial'  where nome = 'Maria Rita';
update profiles set cargo = 'Design Manager',    departamento = 'Digital Development' where nome = 'Tiago';
update profiles set cargo = 'Trainee',           departamento = 'Human Resources'     where nome = 'Andreia';
update profiles set cargo = 'Trainee',           departamento = 'Quality Management'  where nome = 'Sara';
update profiles set cargo = 'Trainee',           departamento = 'Legal & Finance'     where nome = 'Martim';
update profiles set cargo = 'Trainee',           departamento = 'Human Resources'     where nome = 'Lara Costa';
update profiles set cargo = 'Trainee',           departamento = 'Brand & Strategy'    where nome = 'Lara Leão';
