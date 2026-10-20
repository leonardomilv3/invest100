# 04 · Regras de negócio

Cada regra abaixo deve ter **teste unitário** (JUnit 5, sem banco) antes da implementação. Classes puras sugeridas entre parênteses.

## 1. Ciclo da fatura (`InvoiceCycle`)
- Fatura de referência **M** = fatura que **vence** no mês M ("Fatura de novembro" vence em novembro).
- `dueDate(M) = min(due_day, últimoDia(M))` em M.
- `closingDate(M)`: se `closing_day < due_day` → `min(closing_day, últimoDia(M))` em M; senão → mesmo cálculo em M−1.
- **Compra na data d entra na primeira fatura com `closingDate > d`** (comprar no dia do fechamento já cai na próxima — "melhor dia de compra").
- Parcela n (1-based) vai para a fatura `referência(1ª) + (n−1)` meses.
- Status: `paga` se `paid_at` ≠ null · `fechada` se hoje ≥ `closing_date` · senão `aberta`. (Badge: paga=positive, fechada=warning, aberta=info.)
- Faturas são criadas sob demanda (`findOrCreate(cardId, M)`).

Testes obrigatórios: fechamento 03/vencimento 10 → compra 02/10 cai na fatura **OUT** (fecha 03/10), compra 03/10 cai na **NOV**; fechamento 29/vencimento 05 (fecha no mês anterior); fechamento 31 em fevereiro; virada dezembro→janeiro.

## 2. Parcelamento (`InstallmentSplitter`)
- `parcela = floor(total / n, 2 casas)`; a **diferença de centavos vai para a 1ª parcela**. Ex.: 100,00 em 3x → 33,34 + 33,33 + 33,33. Soma sempre = total.
- Cada parcela vira uma `transaction`: `amount = −valor`, `installment_number = n`, `installment_total = N`, `occurred_on = data da compra`, **`competence_month = mês(compra) + (n−1)`**, `invoice_id` conforme regra 1.
- À vista no cartão = compra com `installments = 1` (ainda gera `card_purchases` para manter um só caminho).
- Limite usado do cartão = soma das parcelas **não pagas** (de faturas sem `paid_at`) — inclui parcelas futuras. Disponível = limite − usado (pode ficar negativo; UI mostra 100%+).
- Editar uma compra parcelada = apagar e recriar (MVP). Excluir parcela isolada não é permitido (`scope=purchase`).

## 3. Mês de competência (o que aparece em Gastos/Orçamento)
- Pix, débito, dinheiro, conta: `competence_month = mês(occurred_on)`.
- Cartão: regra 2 (mês da compra + n−1). Decisão: o usuário vê a despesa no mês em que comprou, igual ao protótipo. A fatura é visão separada (Cartões).
- Toast após salvar despesa no cartão: "Compra em 10x registrada" / "Despesa registrada"; nota no diálogo: "1ª parcela na fatura de {mês}".

## 4. KPIs do mês (`MonthStats`)
- **Receitas** = Σ `amount` de `kind=income` no mês.
- **Despesas** = Σ |`amount`| de `kind=expense` no mês.
- **Saldo** = receitas − despesas (cor positiva/negativa).
- Movimentos `kind=investment` (compra/venda de ativos) **não** entram em receitas/despesas; aparecem na lista de lançamentos com filtro "Todos" e somam em `investedNet`.
- Gasto por categoria (donut) = despesas agrupadas; top 6 + "Outros" (`--cat-stone`).

## 5. Orçamento
- `spent(cat, M)` = despesas da categoria no mês de competência M. `count` = nº de lançamentos.
- Barra do `BudgetRow`: <85% neutro/lime · 85–100% warning · >100% negative (ver `BudgetRow.jsx`).
- "Orçamento usado" (Gastos) = Σ despesas / Σ limites; badge accent <85%, warning 85–100%, negative >100%. Valor grande = limite total − gasto.
- Resumo mostra as 4 categorias com maior `spent/limit`.

## 6. Pagar fatura
- `POST /invoices/{id}/pay`: grava `paid_at`, `paid_amount` (default = total). Não cria transação de despesa (as parcelas já são despesas — evita contagem dupla). 409 se já paga. Botão desabilitado se total ≤ 0.
- Libera limite: parcelas daquela fatura deixam de contar em "usado".

## 7. Posições e preço médio (`PositionCalculator`) — método da Receita Federal
Processar `trades` do ativo em ordem (`trade_date`, `created_at`):
- **Compra:** `pm = (qtd·pm + q·preço + custos) / (qtd + q)`; `qtd += q`.
- **Venda:** `q ≤ qtd` (senão 422 "Você tem {qtd} cotas"); `resultado = (preço − pm)·q − custos`; `qtd −= q`; **pm não muda**. Se `qtd = 0` → `pm = 0`.
- Transação gerada: compra `amount = −(q·preço + custos)`; venda `amount = +(q·preço − custos)`; categoria `investimentos`, `kind=investment`, `payment_method=conta`, descrição "Compra · PETR4 (100)".
- Prévia do diálogo: compra → "Novo preço médio R$ X"; venda → "Resultado estimado ±R$ X". Hint "Disponível: {qtd} cotas".
- Valor da posição = `qtd · cotação` (renda variável) ou última `fixed_income_valuations.current_value` (RF; se não houver, = aplicado).
- `invested = qtd · pm` · `rentPct = (value/invested − 1)·100` · `sharePct = value / total da carteira · 100`.
- `dayPct` do grupo/carteira = média ponderada pelo valor. RF: `dayPct = null` (UI mostra "—").
- Testes: compras múltiplas com custos; venda parcial mantém pm; venda total zera; venda maior que posição; operação retroativa.

## 8. Proventos
- Registrar provento cria `dividends` + transação `income` categoria `proventos`.
- "Proventos (12M)" = soma dos últimos 12 meses incluindo o atual; média = total/12; "Meta mensal" = `profiles.monthly_dividend_goal`.

## 9. Evolução do patrimônio
- Meses passados: `portfolio_snapshots` (aplicado + ganho = market_value − invested).
- Mês atual: calculado ao vivo.
- Meses antes do primeiro snapshot: só "Valor aplicado" calculado das trades (ganho = 0). Não inventar histórico de preço.

## 10. Alocação (% ideal)
- Soma dos alvos = 100 (422 "A soma deve ser 100%"). Exibido como "38% / 40%" na métrica "% na carteira" do `AssetGroup`.

## 11. Cotações
- `QuoteProvider` (interface) → `BrapiQuoteProvider` (`GET https://brapi.dev/api/quote/{tickers}?token=…`, lotes de até 10 símbolos conforme plano). Persistir em `app.quotes`.
- Sem cotação → usar `avgPrice` como preço e marcar `stale: true` na posição.
- Ativos novos buscados em `/assets/search` são adicionados ao catálogo global.
