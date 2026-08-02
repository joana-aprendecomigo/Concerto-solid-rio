-- ============================================================================
-- Entrada com código próprio, verificado pelo Supabase Auth
-- ============================================================================
-- Cada pessoa escolhe o seu nome na lista e define um código na primeira
-- entrada. Por trás, isso cria uma conta real no Supabase Auth
-- (nome@concerto.local, com o código como palavra-passe).
--
-- A diferença face a verificar o código no browser é onde a verificação
-- acontece: aqui é o servidor do Supabase que a faz e devolve um token
-- assinado, que ninguém consegue forjar. A base de dados passa a saber quem
-- está a fazer cada pedido, e as regras de líder/membro deixam de ser apenas
-- do interface — passam a ser impostas pelo Postgres (ver 0009).
-- ============================================================================

-- Marca quem já definiu código. O código em si vive no Supabase Auth, cifrado;
-- esta coluna serve só para o ecrã de entrada saber se pede um código novo ou
-- o código existente.
alter table profiles add column if not exists codigo_definido_em timestamptz;

comment on column profiles.codigo_definido_em is
  'Quando o membro definiu o código pela primeira vez. O código está no Supabase Auth, não aqui.';

-- ---------------------------------------------------------------------------
-- Ligar um perfil à conta de autenticação correspondente.
--
-- Corre automaticamente quando alguém define o código: o cliente cria a conta
-- e chama esta função para a associar ao perfil. É `security definer` porque
-- precisa de escrever em `profiles` antes de haver sessão iniciada.
-- ---------------------------------------------------------------------------
create or replace function associar_conta(p_nome text, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Só associa se o perfil ainda não tiver conta. Sem esta condição, alguém
  -- podia apropriar-se do perfil de outra pessoa apontando-o para a sua conta.
  update profiles
     set user_id = p_user_id,
         codigo_definido_em = now()
   where nome = p_nome
     and user_id is null;

  if not found then
    raise exception 'Este membro já tem código definido.';
  end if;
end;
$$;

revoke all on function associar_conta(text, uuid) from public;
grant execute on function associar_conta(text, uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Repor o código de quem se esqueceu (só por si, no SQL Editor):
--
--   1. Desligar o perfil da conta antiga:
--        update profiles
--           set user_id = null, codigo_definido_em = null
--         where nome = 'Ana';
--
--   2. Apagar a conta em Authentication → Users (procurar ana@concerto.local).
--
--   A pessoa define um código novo na entrada seguinte.
-- ---------------------------------------------------------------------------
