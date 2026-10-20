# 01 · Arquitetura

## Visão
```
 Navegador (React SPA, Vercel)
   │  1. POST /api/v1/auth/login|register ──► Quarkus API (email+senha)
   │  ◄── accessToken (JWT RS256, assinado com JWT_PRIVATE_KEY) + refresh token
   │  2. fetch /api/v1/*  Authorization: Bearer <JWT>
   ▼
 Quarkus API (Render, Docker)
   │  valida JWT com JWT_PUBLIC_KEY (iss, aud, exp) → user_id = claim `sub`
   │  JDBC (Agroal) ── Supavisor session pooler :5432 (IPv4) ──► Postgres Supabase, schema `app`
   │  REST client ─────────────────────────────────────────────► brapi.dev (cotações B3)
   ▲
 pg_cron + pg_net (Supabase) ── POST /internal/jobs/* (header X-Job-Secret) — cotações, snapshots
```

## Princípios
1. **A API é o provedor de identidade.** Cadastro, login, refresh e recuperação de senha são endpoints da própria API (contexto `identity`), que emite JWT **RS256** com um par de chaves vindo de env vars — `JWT_PRIVATE_KEY` assina, `JWT_PUBLIC_KEY` valida — em dev (`apps/api/.env`, gerado por `scripts/gen-jwt-keys.sh`) e em produção (Environment do Render, par próprio). Supabase é **só Postgres** em produção. Todos os dados passam pela API Quarkus. Isso centraliza regras de negócio (parcelas, preço médio) e mantém um só lugar para validar.
2. **Schema `app` privado.** Tabelas não ficam em `public`, então a Data API (PostgREST) do Supabase não as expõe mesmo com a anon/publishable key pública. RLS habilitado em todas como defesa em profundidade (sem policies = nega tudo para `anon`/`authenticated`).
3. **Backend é dono do schema.** Migrations via **Flyway** no Quarkus (`migrate-at-start`). Não usar migrations do Supabase CLI para o schema `app` (evita duas fontes de verdade). Supabase é usado **apenas em produção**; em desenvolvimento o banco é o Postgres do `docker-compose.yml` (decisão do Passo 0).
4. **Usuários no schema `app`.** `app.users` (e-mail, hash de senha) e `app.refresh_tokens` são da API — nada depende do schema `auth` do Supabase, então tudo roda em Postgres puro (Dev Services, docker compose). O perfil é criado de forma preguiçosa (upsert) na primeira chamada autenticada (`GET /me`). Exclusão de conta: `DELETE /me` apaga os dados do usuário em `app`, incluindo `users`.
5. **Cálculos derivados no servidor.** Posições, totais de fatura, orçamento consumido e KPIs vêm prontos da API; o frontend só formata.
6. **Latência API↔DB > latência usuário↔API.** Cada request faz várias queries; coloque **Render e Supabase na mesma região** (recomendado: Supabase `us-east-1` + Render `virginia`). Render não tem região no Brasil.

## Monorepo
```
investidor100/
├── CLAUDE.md
├── render.yaml
├── .github/workflows/{web.yml,api.yml}
├── docs/                 (este pacote)
├── design/               (este pacote — referência)
├── docker-compose.yml    (Postgres 17 local — dev; Supabase só em produção)
├── apps/web/             (Vite)
└── apps/api/             (Quarkus, Maven)
```
Sem ferramenta de monorepo (Nx/Turbo) — dois projetos independentes com build filters no Render/Vercel.

## Backend — módulos (pacote `br.com.investidor100`)
> A organização definitiva em contextos DDD leve (`shared · profile · ledger · budget · cards · portfolio · marketdata · summary`) e camadas `domain/application/infrastructure/api` está em **docs/09**, que prevalece sobre a tabela abaixo (visão funcional).

| Pacote | Responsabilidade |
|---|---|
| `common` | `CurrentUser` (lê `sub`/`email` do JWT), `Money` (escala/arredondamento), `ProblemMapper`, conversores `YearMonth`, `PageResponse` |
| `profile` | `/me`, upsert preguiçoso, meta mensal de proventos |
| `category` | categorias do sistema + customizadas |
| `budget` | limites mensais por categoria, consumo |
| `transaction` | lançamentos (despesa/receita), filtros, estatísticas do mês |
| `card` | cartões, `InvoiceCycle` (resolve fatura), faturas, compras parceladas, pagamento, compromissos futuros |
| `investment` | catálogo de ativos, operações, `PositionCalculator`, proventos, % ideal, valorização de renda fixa, histórico |
| `quote` | `QuoteProvider` (brapi), cache em `app.quotes`, job |
| `summary` | agregação da tela Resumo |
| `jobs` | endpoints internos protegidos por segredo |

Extensões Quarkus: `rest`, `rest-jackson`, `hibernate-orm-panache`, `jdbc-postgresql`, `flyway`, `smallrye-jwt`, `hibernate-validator`, `smallrye-openapi`, `smallrye-health`, `rest-client-jackson`, `cache`.

## Frontend — camadas
`app/` (providers, router, shells) → `features/<tela>/` (páginas + hooks de query) → `design-system/` (port 1:1 dos componentes) → `styles/tokens/`. Detalhes em `docs/05-frontend.md`.

## Ambientes
| | Web | API | Banco |
|---|---|---|---|
| local | `localhost:5173` | `localhost:8080` | `docker compose up -d` — Postgres 17 (`:54322`) |
| preview | Vercel Preview (por PR) | API de staging (opcional) ou prod | projeto Supabase de staging |
| prod | Vercel Production | Render `investidor100-api` | projeto Supabase prod |

## Segurança (checklist)
- JWT: RS256, validar assinatura (`JWT_PUBLIC_KEY`), `iss = JWT_ISSUER` (`investidor100-api`), `aud = investidor100`, `exp` (access token de 15 min). Um par de chaves por ambiente; a privada só existe no `.env` local e no Render.
- Senhas com hash forte (BCrypt/Argon2id); nunca logar senha nem token.
- CORS: só origens do Vercel (prod + regex de previews) e localhost.
- Rate limit leve por usuário em POSTs (ex.: 60/min) — filtro simples em memória.
- Segredos só em variáveis de ambiente; `.env*` no `.gitignore`.
- Logs sem dados financeiros nem tokens.

## Decisões registradas
| Data | Decisão |
|---|---|
| 2026-10-20 (Passo 0) | **Java 25** em todo o projeto (build, Dockerfile `maven:3.9-eclipse-temurin-25` / `eclipse-temurin:25-jre`, CI). |
| 2026-10-20 (Passo 0) | **Quarkus 3.40 LTS** (platform `3.40.1.1`) — LTS mais recente na data. |
| 2026-10-20 (Passo 0) | **Supabase só em produção.** Dev usa Postgres 17 do `docker-compose.yml` (porta 54322, mesmos defaults do `application.properties`); testes usam Dev Services. |
| 2026-10-20 (Passo 0) | **Auth própria com JWT RS256**, em dev e prod: a API emite e valida tokens com par de chaves em env vars (`JWT_PUBLIC_KEY`/`JWT_PRIVATE_KEY`, PEM base64 de uma linha). Substitui o Supabase Auth e o `@supabase/supabase-js`. Testes usam o mesmo formato (par de teste em `src/test/resources/META-INF/microprofile-config.properties`). Endpoints `/auth/*` e armazenamento do refresh token: Passo 3/4 (ver docs/03). |
