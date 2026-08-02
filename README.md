# Concerto Solidário · YME

Plataforma de gestão de relações externas para o concerto solidário a favor do
IPO: artistas, espaços, parceiros, templates de email, tarefas, documentos e
dashboard.

## Arrancar

```sh
npm install
cp .env.example .env   # preencher com as credenciais do Supabase
npm run dev
```

Sem `.env` a aplicação funciona à mesma, mas guarda os dados apenas no browser
deste computador. Com as credenciais preenchidas, os dados passam a ser
partilhados por toda a equipa, com sincronização instantânea.

## Base de dados

As migrations estão em `supabase/migrations/`, para correr por ordem no SQL
Editor do Supabase:

| Ficheiro | O que faz |
|---|---|
| `0001_schema.sql` | Tabelas, tipos e índices |
| `0002_rls.sql` | Row Level Security (ver aviso abaixo) |
| `0004_seed.sql` | Equipa, artistas, espaços, templates e tarefas já recolhidos |
| `0005_realtime.sql` | Ativa a sincronização instantânea |

`0003_rls_autenticado.sql.disabled` **não deve ser corrido já** — ver a secção
seguinte.

### Modelo de dados

Artistas, espaços e parceiros partilham quase todos os campos e toda a lógica de
seguimento, e o dashboard já os tratava em conjunto. Por isso vivem numa única
tabela `contacts` distinguida por `tipo`, em vez de três tabelas quase iguais.

A timeline de cada contacto, que antes era um array dentro do próprio registo,
passou a ser a tabela `contact_events` — dá para ordenar, filtrar e agregar nas
estatísticas sem carregar tudo para memória.

## ⚠️ Segurança — importante

**Neste momento qualquer pessoa com o endereço do site consegue ler e alterar
todos os dados**, incluindo emails e telefones de artistas, agências e
autarquias.

A razão é o login: entra-se escolhendo um nome numa lista, sem password. Sem
identidade verificada, a base de dados não distingue quem faz cada pedido — e a
chave de acesso vai no JavaScript, visível no browser de qualquer visitante. As
regras de "só líderes podem atribuir responsáveis" existem no interface, mas
contornam-se facilmente.

Para fechar isto é preciso autenticação a sério. O trabalho já está preparado:

1. Ativar um método de login no Supabase (email + password é o mais simples).
2. Criar as contas em *Authentication → Users*.
3. Ligar cada conta ao perfil:
   ```sql
   update profiles set user_id = '<uuid>' where nome = 'Ana';
   ```
4. Tirar o `.disabled` a `0003_rls_autenticado.sql` e correr a migration.

Essa migration já contém as políticas completas (líderes vs. membros), incluindo
proteções que o interface sozinho não consegue garantir — como impedir que
alguém se atribua contactos a si próprio. O esquema não muda.

## Como está construído

O componente principal (`src/App.jsx`) guarda tudo através de uma interface
`window.storage`. Em vez de o reescrever, há duas implementações dessa
interface:

- `src/lib/storageSupabase.js` — traduz cada leitura/escrita para as tabelas do
  Supabase. Grava por diferença (só o que mudou), o que evita que duas pessoas a
  trabalhar ao mesmo tempo se sobreponham.
- `src/storageShim.js` — localStorage, para quando não há credenciais.

`src/lib/mapeamento.js` faz a tradução entre o formato do interface (camelCase)
e o da base de dados (snake_case).

`src/AppComRealtime.jsx` envolve a aplicação e relê os dados quando o Realtime
avisa que algo mudou — mas nunca enquanto houver um formulário aberto, para não
apagar o que se está a escrever.

## Publicação (Cloudflare Pages)

Definições do projeto:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Framework preset:** Vite

As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` têm de estar
definidas nas *Environment variables* do Pages — sem elas o site publicado fica
em modo local e cada pessoa vê dados diferentes.
