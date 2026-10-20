# CLAUDE.md — Investidor100

Gerenciador pessoal de investimentos + finanças (pt-BR, BRL, B3). Monorepo:
- `apps/web` — React 18 + Vite + TypeScript → Vercel
- `apps/api` — Java 25 + Quarkus 3.40 LTS (REST) → Render (Docker)
- Banco — Postgres: Supabase **somente em produção**; em dev, `docker compose`
- Auth — própria da API: JWT RS256, chaves em env vars (`JWT_PUBLIC_KEY`/`JWT_PRIVATE_KEY`) em dev (`apps/api/.env`) e prod (Render)
- `docs/` — specs (arquitetura, banco, API, regras, frontend, telas, deploy, plano)
- `design/` — referência visual hi-fi (NÃO é código de produção)

## Comandos
```bash
# raiz
docker compose up -d                # Postgres 17 local (Docker); db em localhost:54322
cd apps/api && ./scripts/gen-jwt-keys.sh  # 1ª vez: par RSA de dev em apps/api/.env
# web
cd apps/web && npm i && npm run dev # http://localhost:5173
npm run lint && npm run typecheck && npm test && npm run build
# api
cd apps/api && ./mvnw quarkus:dev   # http://localhost:8080 · Swagger em /q/swagger-ui
./mvnw verify                       # testes (Dev Services sobe Postgres via Testcontainers)
```

## Fluxo de trabalho
- Siga `docs/08-plano-de-implementacao.md`, **um passo por vez**, e pare ao final com o relatório definido em `PROMPT-CLAUDE-CODE.md`.
- Compare cada tela com `screenshots/` antes de finalizar.
- Antes de codar uma tela, leia `docs/06-telas.md` + o arquivo correspondente em `design/reference/finance/`.
- Antes de codar regra de dinheiro, leia `docs/04-regras-de-negocio.md` e escreva o teste unitário primeiro.
- Mudou contrato? Atualize `docs/03-api.md` e os tipos em `apps/web/src/lib/api/types.ts` no mesmo commit.
- Migrations são imutáveis depois de aplicadas: crie `V{n+1}__*.sql`, nunca edite uma antiga.

## Arquitetura e testes (detalhes em docs/09)
- **DDD leve:** contextos `shared · identity · profile · ledger · budget · cards · portfolio · marketdata · summary`, cada um com `domain/ application/ infrastructure/ api/`. Regras de negócio no domínio (agregados/VOs ricos); casos de uso finos; portas no domínio; contextos conversam por casos de uso públicos ou eventos CDI. `ArchitectureTest` (ArchUnit) sempre verde.
- **TDD estrito:** teste vermelho (mostrar saída) → mínimo para verde → refatorar. Ordem: domínio → aplicação (fakes em memória) → API (`*IT`, Dev Services, JWT de teste, usuário aleatório por teste) → frontend (Vitest/RTL/MSW). Sem código de produção sem teste que o exija.
- Cobertura mínima: domínio ≥ 90% (cards/portfolio ≥ 95%), total ≥ 80%.
- Testes Java em pt-BR snake_case: `compra_no_dia_do_fechamento_vai_para_a_proxima()`.

## Regras invioláveis — backend
- **Toda query filtra por `user_id`** vindo do JWT (`CurrentUser`), nunca do body/path. Recurso de outro usuário → 404 (não 403).
- Dinheiro: `BigDecimal` + `NUMERIC` no banco. Nunca `double`/`float`. Arredondamento `HALF_EVEN`, escala 2 para BRL, 8 para quantidade/preço unitário.
- Operações multi-tabela (parcelas, venda, pagar fatura) em `@Transactional`.
- Erros em `application/problem+json` (RFC 9457) com mensagens pt-BR iguais às do design ("Informe uma descrição").
- Resources só mapeiam DTO ↔ comando; DTOs como `record`. Sem lógica em resources nem em casos de uso além de orquestração.
- Tabelas no schema `app` (não exposto pela Data API do Supabase). O frontend nunca acessa tabelas diretamente.
- Nunca versionar chave privada JWT, senha ou `.env`. Senhas só com hash forte; nunca logar senha/token.

## Regras invioláveis — frontend
- Visual **somente** via tokens CSS (`src/styles/tokens/*.css`). Nada de hex solto fora dos tokens, exceto `CATEGORY_META`.
- Componentes de UI vêm de `src/design-system/` (port de `design/components/`). Mantenha a mesma API de props dos `.types.ts`.
- Copy em pt-BR, sentence case, você implícito. **Sem emoji. Sem caracteres unicode como ícone** (use `lucide-react`).
- Formatação: `src/lib/format.ts` (`brl`, `signed`, `pct`, `parseBRL`). `R$` + espaço não-quebrável; sinal de menos `−` (U+2212).
- Números sempre `tabular-nums`. Decimais grandes esmaecidos onde o design pede.
- **Uma superfície lime por tela** (KPI herói / cartão ativo). Lime nunca é texto nem CTA padrão; CTA primário = pill ink.
- Dados do servidor só via TanStack Query (hooks em `features/*/api.ts`). Sem estado global para dados remotos.
- Mobile (<900px) é paridade completa, não versão reduzida. Alvos de toque ≥ 44px.
- Datas: `date-fns` com locale `ptBR`. Mês na URL como `yyyy-MM`.

## Glossário (UI pt-BR → código en)
lançamento=transaction · despesa=expense · receita=income · cartão=credit_card · fatura=invoice · parcela=installment · compra parcelada=card_purchase · orçamento=budget · ativo=asset · operação compra/venda=trade (buy/sell) · preço médio=avg_price · provento=dividend · posição=position · classe de ativo=asset_class · % ideal=allocation_target · patrimônio=net_worth / portfolio value
