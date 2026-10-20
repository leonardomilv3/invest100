# 03 · Contrato da API (REST, `/api/v1`)

Todas as rotas exigem `Authorization: Bearer <supabase access_token>`, exceto `/q/health/*` e `/internal/jobs/*` (header `X-Job-Secret`). OpenAPI gerado em `/q/openapi`; o frontend pode gerar tipos com `openapi-typescript`.

## Convenções
- JSON camelCase. Dinheiro como **número JSON** com até 2 casas (`1234.56`); quantidade/preço até 8. Datas `yyyy-MM-dd`; meses `yyyy-MM`.
- Valores de lançamento têm **sinal** (saída negativa) nas respostas; nos POSTs o cliente envia `amount` **positivo** + `kind`.
- Listas paginadas: `?page=0&size=50` → `{ "items": [...], "page": 0, "size": 50, "total": 123 }`.
- Erros `application/problem+json`:
```json
{ "type": "about:blank", "title": "Dados inválidos", "status": 422,
  "errors": [{ "field": "description", "message": "Informe uma descrição" }] }
```
Status: 400 malformado · 401 sem token · 404 inexistente **ou de outro usuário** · 409 conflito (ex.: fatura já paga) · 422 validação de negócio.

## Perfil
| Método | Rota | Descrição |
|---|---|---|
| GET | `/me` | upsert preguiçoso + retorna `{ userId, displayName, email, monthlyDividendGoal }` |
| PATCH | `/me` | `{ displayName?, monthlyDividendGoal? }` |
| DELETE | `/me` | apaga todos os dados do usuário + conta no Supabase (Admin API) |

## Categorias e orçamento
| GET | `/categories?kind=expense\|income` | sistema + do usuário, ordenadas por `sortOrder` |
|---|---|---|
| POST | `/categories` | `{ label, kind, icon, colorToken }` |
| PATCH/DELETE | `/categories/{id}` | só do usuário; DELETE = arquivar se houver lançamentos |
| GET | `/budgets?month=2026-10` | `[{ categoryId, slug, label, limit, spent, count }]` + `totalLimit`, `totalSpent` |
| PUT | `/budgets` | `[{ categoryId, limit }]` (upsert em lote; limit 0 remove) |

## Lançamentos
| GET | `/transactions?month=2026-10&kind=expense\|income&categoryId=&cardId=&q=&page=&size=` | ordenado por `occurredOn desc` |
|---|---|---|
| POST | `/transactions` | despesa ou receita (ver abaixo) |
| PATCH | `/transactions/{id}` | descrição, categoria, data, valor (não para parcelas/trades — 409) |
| DELETE | `/transactions/{id}?scope=one\|purchase` | parcela: `scope=purchase` apaga a compra inteira |
| GET | `/transactions/stats?month=2026-10` | `{ income, expense, balance, investedNet, byCategory: [{ slug, label, colorToken, amount }] }` |
| GET | `/spending/monthly?months=6&top=moradia,alimentacao,transporte,lazer` | `[{ month: "2026-05", values: { moradia: 2200, ..., outros: 1380 } }]` |

`POST /transactions` — despesa no cartão parcelada:
```json
{ "kind": "expense", "description": "Notebook", "amount": 4899.00, "occurredOn": "2026-10-20",
  "categoryId": "…", "paymentMethod": "cartao", "cardId": "…", "installments": 10 }
```
Resposta `201`:
```json
{ "purchaseId": "…", "transactions": [ { "id": "…", "amount": -489.90, "competenceMonth": "2026-10",
  "installment": "1/10", "invoice": { "id": "…", "referenceMonth": "2026-11", "dueDate": "2026-11-10" } }, … ],
  "message": "Compra em 10x registrada" }
```
Receita: `{ "kind": "income", "description": "Salário", "amount": 9800, "occurredOn": "…", "categoryId": "…" }` (`paymentMethod` default `conta`).
Validação: `description` obrigatória ("Informe uma descrição"); `amount > 0` ("Informe um valor maior que zero"); `installments` 1–12 só com `cartao`; `categoryId.kind` compatível com `kind`.

**Item de lista (`TransactionDto`)**
```json
{ "id": "…", "kind": "expense", "description": "Supermercado", "amount": -312.40, "occurredOn": "2026-10-20",
  "competenceMonth": "2026-10", "category": { "slug": "alimentacao", "label": "Alimentação" },
  "paymentMethod": "cartao", "paymentLabel": "Cartão Black •• 4821", "installment": null,
  "cardId": "…", "purchaseId": null, "tradeId": null }
```

## Cartões e faturas
| GET | `/cards` | `[{ id, name, last4, brand, tone, limit, used, available, currentInvoice: { id, referenceMonth, total, closingDate, dueDate, status } , recurringMonthly }]` |
|---|---|---|
| POST | `/cards` | `{ name, last4, brand, tone, limit, closingDay, dueDay }` |
| PATCH/DELETE | `/cards/{id}` | DELETE = arquivar se houver lançamentos |
| GET | `/cards/{id}/invoices/{yyyy-MM}` | `{ id, referenceMonth, closingDate, dueDate, status, total, items: TransactionDto[] }` |
| POST | `/invoices/{id}/pay` | `{ paidOn?, amount? }` → 409 se já paga; default = total |
| GET | `/installments?active=true&cardId=` | `[{ purchaseId, description, note, category, card: { id, last4 }, current, total, amount, remaining }]` |
| GET | `/cards/commitments?months=6` | `[{ month: "2026-11", byCard: { "<cardId>": 1203.40 } }]` (parcelas + recorrentes) |
| GET/POST/PATCH/DELETE | `/recurring-charges` | assinaturas |

## Investimentos
| GET | `/portfolio` | grupos por classe com posições e métricas (abaixo) |
|---|---|---|
| GET | `/assets/search?q=PETR` | catálogo global + RF do usuário; se não achar, consulta brapi e cadastra no catálogo |
| POST | `/assets` | renda fixa: `{ assetClass: "renda_fixa", symbol, name, issuer, indexer, rateLabel, maturityDate, taxExempt }` |
| GET | `/trades?assetId=&page=` | histórico |
| POST | `/trades` | `{ assetId, side: "buy"\|"sell", tradeDate, quantity, unitPrice, costs }` → cria trade + transação `investment`; 422 "Você tem 12 cotas" se venda > posição na data |
| DELETE | `/trades/{id}` | 422 se deixar posição negativa em data posterior |
| GET | `/trades/preview?assetId=&side=&quantity=&unitPrice=&costs=` | `{ total, newAvgPrice? , estimatedResult? , available }` — alimenta o bloco "Valor total" do diálogo |
| GET/POST/DELETE | `/dividends` | `{ assetId, type, paymentDate, amount }` → cria receita `proventos` |
| GET | `/dividends/monthly?months=12` | `[{ month, amount }]` + `total12m`, `average`, `currentMonth` |
| PUT | `/allocation-targets` | `[{ assetClass, targetPct }]` soma = 100 |
| PUT | `/assets/{id}/valuation` | RF: `{ asOf, currentValue }` |
| GET | `/portfolio/history?months=12` | `[{ month, invested, gain }]` |

`GET /portfolio`:
```json
{ "total": 52345.10, "invested": 49380.00, "gain": 2965.10, "rentPct": 6.00, "dayPct": 0.84,
  "quotesUpdatedAt": "2026-10-20T17:15:00Z",
  "groups": [ { "assetClass": "acoes", "title": "Ações", "icon": "chart-candlestick", "targetPct": 40,
    "sharePct": 38.2, "total": 19990.00, "invested": 17722.00, "dayPct": 1.4, "rentPct": 12.8,
    "positions": [ { "assetId": "…", "symbol": "PETR4", "name": "Petrobras", "quantity": 100, "avgPrice": 32.10,
      "price": 38.42, "dayPct": 2.45, "value": 3842.00, "invested": 3210.00, "rentPct": 19.69, "sharePct": 7.34,
      "indexer": null, "rateLabel": null } ] } ],
  "highlights": { "best": { "symbol": "PETR4", "rentPct": 19.69 }, "worst": { "symbol": "VALE3", "rentPct": -8.03 },
    "inProfit": 9, "positions": 11 } }
```

## Resumo
`GET /summary?month=2026-10` — tudo que a tela Resumo precisa em uma chamada:
```json
{ "netWorth": { "total", "invested", "rentPct", "dayPct" },
  "month": { "income", "expense", "balance" },
  "invoices": { "total", "nextDueDate": "2026-11-05", "cards": 3 },
  "dividends": { "total12m", "currentMonth", "average" },
  "spendingByCategory": [ { "slug", "label", "colorToken", "amount" } ],
  "budgetsNearLimit": [ { "slug", "label", "spent", "limit" } ],          // top 4 por spent/limit
  "nextInstallments": { "invoiceMonth": "2026-11", "total", "items": [ … ] }, // top 4 que terminam antes
  "updatedAt": "2026-10-20T17:15:00Z" }
```
"Meus ativos" usa `GET /portfolio` em paralelo; "Evolução do patrimônio" usa `/portfolio/history`.

## Jobs internos (chamados por pg_cron/pg_net)
| POST | `/internal/jobs/quotes` | atualiza `app.quotes` para todos os símbolos com posição aberta (dias úteis, a cada 15 min das 10h às 18h BRT) |
|---|---|---|
| POST | `/internal/jobs/snapshots` | grava `portfolio_snapshots` do mês corrente para todos os usuários (diário 23h BRT; último valor do mês prevalece) |
| POST | `/internal/jobs/invoices` | cria faturas do próximo ciclo (diário) — opcional, pois são criadas sob demanda |
