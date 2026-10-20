# 02 · Banco de dados (Supabase Postgres, schema `app`)

SQL completo e executável em `backend/db/migration/V1__schema.sql` e `V2__seed.sql` → copiar para `apps/api/src/main/resources/db/migration/`.

## Convenções
- PK `uuid default gen_random_uuid()`. Toda tabela de usuário tem `user_id uuid not null` + índice começando por `user_id`.
- Dinheiro `numeric(14,2)`; quantidade e preço unitário `numeric(20,8)`; percentuais `numeric(7,4)`.
- Mês de referência = `date` sempre no dia 1 (`check (extract(day from x) = 1)`); na API trafega como `yyyy-MM`.
- `created_at`/`updated_at timestamptz`. Trigger `app.touch_updated_at()`.
- Enums como `text + check` (fácil de evoluir com migration).
- RLS `enable` em todas as tabelas (sem policies). A API conecta como `postgres` (dono das tabelas), que não é afetado.

## Diagrama
```
profiles (user_id PK)
categories ──< budgets
categories ──< transactions >── credit_cards ──< card_invoices
                    │  ╲                 ╲──< card_purchases ──< transactions (parcelas)
                    │   ╲──< recurring_charges
assets ──< trades ──1:1── transactions (kind=investment)
assets ──< dividends ─1:1─ transactions (categoria proventos)
assets ──< fixed_income_valuations
allocation_targets (user_id, asset_class)
quotes (symbol PK, global)          portfolio_snapshots (user_id, month)
```

## Tabelas
| Tabela | Campos principais | Notas |
|---|---|---|
| `users` *(migration nova no Passo 3)* | `id` PK, `email` (único, case-insensitive), `password_hash`, `created_at` | identidade própria da API (auth JWT RS256); `profiles.user_id` passa a referenciar `users.id` |
| `refresh_tokens` *(Passo 3)* | `user_id`, `token_hash`, `expires_at`, `revoked_at`, `replaced_by` | rotação a cada `/auth/refresh`; só o hash é guardado |
| `profiles` | `user_id` PK, `display_name`, `email`, `monthly_dividend_goal` | upsert em `GET /me` a partir das claims |
| `categories` | `user_id` (null = sistema), `slug`, `label`, `kind` (`expense`/`income`/`system`), `icon` (nome Lucide), `color_token`, `bg_hex`, `fg_hex`, `sort_order`, `archived` | `unique nulls not distinct (user_id, slug)`. Seed = `CATEGORY_META` |
| `budgets` | `category_id`, `monthly_limit` | um limite fixo mensal por categoria |
| `credit_cards` | `name`, `last4`, `brand`, `tone` (`ink`/`lime`/`white`), `credit_limit`, `closing_day`, `due_day`, `archived_at` | `tone` = visual do `CreditCardTile` |
| `card_invoices` | `card_id`, `reference_month` (= mês do **vencimento**), `closing_date`, `due_date`, `paid_at`, `paid_amount` | status derivado (ver regras). Criada sob demanda |
| `card_purchases` | `card_id`, `description`, `note`, `category_id`, `total_amount`, `installments` (1–24), `purchase_date` | gera N `transactions` |
| `transactions` | `kind` (`expense`/`income`/`investment`), `description`, `category_id`, `amount` (**com sinal**: saída < 0), `occurred_on`, `competence_month`, `payment_method` (`pix`/`debito`/`conta`/`dinheiro`/`cartao`), `card_id`, `invoice_id`, `purchase_id`, `installment_number`, `installment_total`, `trade_id`, `dividend_id`, `recurring_id` | `check ((payment_method='cartao') = (card_id is not null))` |
| `recurring_charges` | `description`, `category_id`, `amount`, `payment_method`, `card_id`, `day_of_month`, `active` | assinaturas — usadas em "Compromissos futuros"; lançamento automático é fase posterior |
| `assets` | `user_id` (null = catálogo global B3), `asset_class` (`acoes`/`fiis`/`renda_fixa`/`etfs`/`bdrs`/`cripto`), `symbol`, `name`, `sector`; RF: `issuer`, `indexer` (`CDI`/`SELIC`/`IPCA`/`PRE`), `rate_label` ("110% CDI"), `maturity_date`, `tax_exempt` | RF é sempre do usuário |
| `trades` | `asset_id`, `side` (`buy`/`sell`), `trade_date`, `quantity`, `unit_price`, `costs` | fonte da verdade das posições |
| `dividends` | `asset_id`, `type` (`dividendo`/`jcp`/`rendimento`/`amortizacao`), `payment_date`, `amount` | gera uma receita (categoria `proventos`) |
| `fixed_income_valuations` | `asset_id`, `as_of`, `current_value` | valor atual informado pelo usuário (MVP) |
| `allocation_targets` | PK (`user_id`, `asset_class`), `target_pct` | soma deve ser 100 (validado na API) |
| `quotes` | `symbol` PK, `price`, `change_pct`, `previous_close`, `updated_at`, `source` | global, preenchida pelo job |
| `portfolio_snapshots` | PK (`user_id`, `month`), `invested`, `market_value` | fechamento mensal p/ "Evolução do patrimônio" |

## Posições: calculadas, não armazenadas
Recalculadas a partir de `trades` (ordenadas por `trade_date, created_at`) a cada leitura — permite editar/apagar operações retroativas sem inconsistência. Volume por usuário é pequeno (centenas de operações). Se ficar lento, cache por usuário invalidado em qualquer escrita em `trades`.

## Ambiente local
`docker compose up -d` (raiz do repo) → Postgres 17 em `postgresql://postgres:postgres@localhost:54322/postgres`. O Quarkus aplica Flyway ao subir. Testes usam Dev Services (Postgres em container) — por isso nenhuma dependência do schema `auth`.
