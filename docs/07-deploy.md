# 07 · Deploy (Supabase · Render · Vercel)

## 1. Supabase
1. Criar projeto (prod) — região **us-east-1** (mesma região do Render). Opcional: projeto `staging`.
2. **Auth → Providers:** Email (confirmação ligada). Google opcional.
3. **Auth → URL Configuration:** Site URL = `https://investidor100.vercel.app`; Redirect URLs: `https://investidor100.vercel.app/**`, `https://*-<time>.vercel.app/**`, `http://localhost:5173/**`.
4. **Auth → JWT Signing Keys:** usar chaves assimétricas (ES256, padrão em projetos novos). A API valida via JWKS: `https://<ref>.supabase.co/auth/v1/.well-known/jwks.json`. Se o projeto ainda usar o segredo legado HS256, migre para signing keys no painel.
5. **Email templates** em pt-BR (confirmação, recuperar senha) com o tom do produto.
6. **Database → Connect → Session pooler** (Supavisor, porta 5432, IPv4) → copiar host/usuário (`postgres.<ref>`). Render não tem saída IPv6, então **não** usar a conexão direta `db.<ref>.supabase.co`. Não usar o transaction pooler (6543) — quebra prepared statements do Hibernate.
7. **API keys:** anon/publishable → frontend. service_role/secret → só na API (para `DELETE /me` via Admin API). Nunca no frontend.
8. **Agendamentos** (SQL Editor, após o deploy da API):
```sql
create extension if not exists pg_cron; create extension if not exists pg_net;
select cron.schedule('quotes', '*/15 13-21 * * 1-5', $$
  select net.http_post(url := 'https://investidor100-api.onrender.com/internal/jobs/quotes',
    headers := jsonb_build_object('X-Job-Secret', '<JOBS_SECRET>'), timeout_milliseconds := 60000) $$);
select cron.schedule('snapshots', '0 2 * * *', $$
  select net.http_post(url := 'https://investidor100-api.onrender.com/internal/jobs/snapshots',
    headers := jsonb_build_object('X-Job-Secret', '<JOBS_SECRET>'), timeout_milliseconds := 60000) $$);
```
(horários em UTC: 13–21 UTC ≈ 10–18h BRT). Guardar o segredo no Vault do Supabase em vez de literal, se preferir. Isso também "acorda" a API no plano free.

## 2. Render (API)
- **Blueprint** `render.yaml` na raiz (arquivo em `infra/render.yaml`). Serviço Docker, `rootDir: apps/api`, health check `/q/health/ready`, build filter `apps/api/**`.
- **Plano:** Free dorme após ~15 min sem tráfego (cold start de dezenas de segundos para JVM) e tem 512 MB. Para produção usar **Starter** ou superior. No free, manter `-XX:MaxRAMPercentage=75` e pool pequeno.
- Porta: Quarkus lê `PORT` (`quarkus.http.port=${PORT:8080}`).
- Variáveis (ver `infra/env.api.example`): `DB_URL`, `DB_USER`, `DB_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `CORS_ORIGINS`, `BRAPI_TOKEN`, `JOBS_SECRET`.
- Flyway roda no start (`migrate-at-start=true`). Para várias instâncias, Flyway usa lock — ok.
- Native image (GraalVM/Mandrel) é opcional: reduz memória e cold start, mas o build costuma estourar a memória do builder do Render. Se quiser, buildar no GitHub Actions, publicar no GHCR e usar "Deploy from image" no Render.

## 3. Vercel (Web)
- Importar o repo, **Root Directory** `apps/web`, Framework **Vite**, build `npm run build`, output `dist`.
- `apps/web/vercel.json` (arquivo em `infra/vercel.json`) com rewrite SPA e headers de cache/segurança.
- Variáveis: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL` (Production → API prod; Preview → API staging).
- **Ignored Build Step:** `git diff --quiet HEAD^ HEAD -- .` (relativo ao root dir) para não rebuildar quando só a API muda.

## 4. CORS
`quarkus.http.cors.origins=${CORS_ORIGINS}` com, por exemplo:
`https://investidor100.vercel.app,/https://investidor100-.*-<time>\.vercel\.app/,http://localhost:5173` (Quarkus aceita regex entre barras).

## 5. CI (GitHub Actions)
- `web.yml` (paths `apps/web/**`): `npm ci` → lint → typecheck → vitest → build.
- `api.yml` (paths `apps/api/**`): Temurin **25** → `./mvnw -B verify` (Dev Services usa Docker do runner).
- Deploys: Vercel e Render via integração Git (auto-deploy em `main`; preview em PR no Vercel).

## 6. Checklist de go-live
- [ ] Região Render = região Supabase
- [ ] Session pooler + `sslmode=require`
- [ ] JWT validando `iss`/`aud`; teste com token expirado → 401
- [ ] CORS só com origens conhecidas
- [ ] Tabelas no schema `app` + RLS ligado (conferir que `/rest/v1/` não expõe nada)
- [ ] Backups (plano Pro do Supabase tem PITR)
- [ ] Domínio próprio no Vercel + atualizar Site URL do Supabase e `CORS_ORIGINS`
- [ ] pg_cron agendado e respondendo 200
