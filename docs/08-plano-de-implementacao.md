# 08 · Plano de implementação passo a passo (DDD leve + TDD)

Como usar: na primeira sessão cole `PROMPT-CLAUDE-CODE.md`. Depois, **um passo por sessão** (`/clear` entre passos): cole o prompt do passo. O Claude Code deve apresentar o plano (plan mode), executar o ciclo TDD de `docs/09 §6` e parar no fim do passo com o relatório pedido.

Cada passo lista: **objetivo · testes a escrever primeiro (red) · implementação · pronto quando**.
Capturas de referência em `screenshots/`.

---

## Passo 0 — Monorepo, ferramentas e esqueleto de testes
**Prompt:**
> Execute o Passo 0 de docs/08. Leia CLAUDE.md, docs/01, docs/07 e docs/09. Crie o monorepo (web Vite react-ts; api Quarkus 3 LTS, Java 25 , Maven, pacote br.com.investidor100). Configure: surefire (*Test) + failsafe (*IT) + JaCoCo com os limites de docs/09; AssertJ, ArchUnit, RestAssured, smallrye-jwt-build; Vitest + Testing Library + MSW + cobertura; Playwright; ESLint/Prettier; GitHub Actions; render.yaml, vercel.json, Dockerfile, application.properties a partir de backend/ e infra/. Remova o sufixo .txt de design/. Não implemente features.

**Testes primeiro:** `ArchitectureTest` (regras de docs/09 §2 — passam vazias) · `HealthIT` (`GET /q/health/ready` = 200) · `App.test.tsx` (renderiza sem erro).
**Pronto quando:** `./mvnw verify` e `npm run test && npm run build` verdes; CI verde.

## Passo 1 — Kernel compartilhado (`shared`)
**Prompt:**
> Execute o Passo 1. Em TDD, implemente os value objects de `shared.domain`: Money, Quantity, UnitPrice, Percentage, CompetenceMonth, UserId, DomainException/NotFoundException; o ProblemExceptionMapper (problem+json pt-BR); `@Produces Clock`; CurrentUser (lê `sub`/`email` do JWT). No web, `src/lib/format.ts` (brl, signed, pct, fmt, compact, parseBRL, monthLabel) em TDD.

**Testes primeiro:**
- `MoneyTest`: `arredonda_half_even_em_2_casas` · `nao_existe_construtor_com_double` (API só aceita `String`/`BigDecimal`) · `soma_subtrai_e_nega` · `compara_por_valor`.
- `CompetenceMonthTest`: `parse_yyyy_MM` · `plus_meses_vira_o_ano` · `primeiro_dia`.
- `ProblemMapperIT` (endpoint de teste): 422 com `errors[]`, 404, 409.
- `format.test.ts`: `brl(1234.5) === 'R$\u00a01.234,50'` · `signed(-10) === '−R$\u00a010,00'` (U+2212) · `pct(2.456) === '+2,46%'` · `parseBRL('1.234,56') === 1234.56` · `parseBRL('') === 0`.
**Pronto quando:** cobertura de `shared.domain` ≥ 95%.

## Passo 2 — Design system React
**Prompt:**
> Execute o Passo 2. Leia docs/05 (Port do design system) e docs/06 (Base comum). Copie tokens e fontes. Porte para TSX + CSS Modules os componentes "usados no MVP" mantendo as props dos `.types.ts` e o visual dos `.jsx`; porte Panel, Kpi, Big, Split, Grid, PageTitle, Empty de design/reference/finance/Parts.jsx para design-system/layout. Crie /_ds (dev). Escreva os testes antes de cada componente com comportamento.

**Testes primeiro:** `Button.test` (variantes, disabled, onClick, foco visível) · `Delta.test` (sinal, cor positiva/negativa, ícone trending) · `BudgetRow.test` (<85% normal, 85–100% warning, >100% "R$ X acima") · `InstallmentRow.test` ("Parcela 4/10", restante) · `SegmentedControl.test` (teclado ←/→) · `Dialog.test` (Esc fecha, focus trap, aria-modal) · `DataTable.test` (ordenação, vazio).
**Pronto quando:** /_ds comparado lado a lado com `screenshots/` sem diferenças perceptíveis; nenhum hex fora dos tokens (regra ESLint/stylelint).

## Passo 3 — Shells, rotas e autenticação
**Prompt:**
> Execute o Passo 3. Implemente o contexto `identity` na API (cadastro, login, refresh, logout com BCrypt — docs/03 › Autenticação; migration nova com `app.users` e `app.refresh_tokens`) e, no web, lib/auth, AuthProvider, AuthGate, telas Entrar/Cadastro (docs/06 › Auth; sem recuperar senha no MVP), DesktopShell e MobileShell (docs/06 › Shell), router de docs/05 com placeholders Empty, LancamentoProvider (`?novo=`), Toast, useBreakpoint. TDD com Testing Library.

**Testes primeiro:** `AuthGate.test` (sem sessão → /entrar; com sessão → filho) · `Entrar.test` (validação, erro da API em pt-BR) · `UserTest`/`PasswordTest` (domínio) · `AuthResourceIT` (cadastro, login inválido 401, refresh rotaciona, logout revoga) · `DesktopShell.test` (aba ativa pela rota) · `MobileShell.test` (BottomNav; "Mais" abre sheet; FAB abre `?novo=despesa`) · `useBreakpoint.test` (899/900/1199/1200).
**Pronto quando:** login real contra a API local (docker compose); navegação igual às capturas desktop e mobile.

## Passo 4 — Perfil + categorias + integração web↔API
**Prompt:**
> Execute o Passo 4. Contexto `profile` e `ledger.Category`. Migrations V1/V2 já estão em api/src/main/resources/db/migration (movidas no Passo 0). JWT RS256 com chaves em env vars (dev/prod) e par de teste (test). Casos de uso: GetOrCreateProfile, UpdateProfile, ListCategories, CreateCategory, ArchiveCategory. Web: lib/api/client.ts (Bearer, ApiError, 401 → signOut) e /me no UserChip/Avatar. Deploy de teste em Render + Vercel.

**Testes primeiro:**
- Unit: `ProfileTest` (nome obrigatório; meta ≥ 0) · `CategoryTest` (sistema não pode ser editada/arquivada; kind válido).
- App: `GetOrCreateProfileTest` com `InMemoryProfileRepository` (cria na 1ª vez, reaproveita depois).
- IT: `MeResourceIT` (`sem_token_401`, `token_expirado_401`, `primeira_chamada_cria_perfil`) · `CategoriesResourceIT` (`lista_sistema_e_do_usuario`, `usuario_b_nao_ve_categoria_de_a`, `nao_edita_categoria_do_sistema_409`).
- Web: `client.test.ts` (injeta Bearer; problem+json → ApiError com `errors`; 401 dispara signOut).
**Pronto quando:** web em produção autenticando na API em produção.

## Passo 5 — Lançamentos simples (`ledger`)
**Prompt:**
> Execute o Passo 5. Leia docs/04 regras 3 e 4 e docs/03 › Lançamentos. Implemente Transaction (rica), MonthStats, casos de uso RegisterExpense, RegisterIncome, EditTransaction, DeleteTransaction, ListTransactions, GetMonthStats, GetMonthlySpending — sem cartão. Siga o ciclo TDD de docs/09.

**Testes primeiro:**
- Unit: `TransactionTest` (`despesa_tem_valor_negativo`, `receita_tem_valor_positivo`, `descricao_vazia_lanca_erro`, `competencia_e_mes_da_data`, `cartao_exige_card_id`) · `MonthStatsTest` (`investimento_nao_entra_em_receita_nem_despesa`, `saldo_e_receitas_menos_despesas`, `agrupa_por_categoria_top6_mais_outros`).
- IT: `TransactionsResourceIT` (`cria_despesa_pix_201`, `descricao_vazia_422_mensagem_pt`, `valor_zero_422`, `categoria_de_receita_em_despesa_422`, `filtra_por_mes_categoria_e_busca`, `pagina_resultados`, `usuario_b_404`) · `StatsResourceIT` · `MonthlySpendingIT`.
**Pronto quando:** cobertura `ledger.domain` ≥ 90%.

## Passo 6 — Orçamento (`budget`) + tela Gastos
**Prompt:**
> Execute o Passo 6. Leia docs/04 regra 5 e docs/06 › Gastos (compare com screenshots/desktop-03-gastos.png e mobile-03-gastos.png). Backend: Budget, BudgetStatus, SetBudgets, GetBudgets(month). Web: features/ledger e features/budget — tela Gastos completa (seletor de mês, KPIs, orçamento, donut, barras, lista com filtros na URL), dialog Editar limites, LancamentoDialog para Despesa (Pix/Débito/Dinheiro) e Receita.

**Testes primeiro:**
- Unit: `BudgetStatusTest` (thresholds 85/100) · `ledger/domain/lancamentoSchema.test.ts` (mensagens pt-BR).
- IT: `BudgetsResourceIT` (`upsert_em_lote`, `limite_zero_remove`, `spent_considera_competencia`).
- Web integração (MSW): `GastosPage.test` (`troca_de_mes_refaz_queries`, `filtro_categoria_atualiza_url_e_lista`, `busca_filtra_por_descricao`, `clique_no_budgetrow_filtra`) · `LancamentoDialog.test` (`erros_so_apos_tentar_salvar`, `troca_tipo_reseta_categoria`, `salvar_invalida_queries_e_mostra_toast`).
**Pronto quando:** fluxo criar despesa → KPIs/orçamento/donut/lista atualizam sem reload; visual = capturas.

## Passo 7 — Cartões: ciclo de fatura e parcelamento (`cards`)
**Prompt:**
> Execute o Passo 7 (só backend). Leia docs/04 regras 1, 2 e 6. Comece pelos testes de InvoiceCycle e InstallmentPlan (todos os casos), depois CreditCard, Invoice, CardPurchase e os casos de uso RegisterCard, UpdateCard, ArchiveCard, RegisterCardPurchase (chama ledger.application.RecordTransactions), GetInvoice, PayInvoice, ListInstallments, GetCommitments, CRUD RecurringCharge. POST /transactions com paymentMethod=cartao delega para RegisterCardPurchase.

**Testes primeiro:**
- `InvoiceCycleTest`: `compra_antes_do_fechamento_entra_na_fatura_do_mes` · `compra_no_dia_do_fechamento_vai_para_a_proxima` · `fechamento_maior_que_vencimento_fecha_no_mes_anterior` · `dia_31_em_fevereiro_usa_ultimo_dia` · `virada_dezembro_janeiro` · `parcela_n_vai_para_referencia_mais_n_menos_1`.
- `InstallmentPlanTest`: `100_em_3_da_33_34_33_33_33_33` · `soma_igual_ao_total` (parametrizado/property 1..12 × valores aleatórios) · `a_vista_gera_uma` · `rejeita_0_ou_mais_de_24`.
- `InvoiceTest`: `status_aberta_fechada_paga` · `pagar_duas_vezes_lanca_InvoiceAlreadyPaid`.
- `CreditCardTest`: `last4_4_digitos` · `limite_usado_soma_parcelas_nao_pagas`.
- App: `RegisterCardPurchaseTest` (fakes): cria compra + N transações com competências e faturas corretas.
- IT: `CardsResourceIT` · `CardPurchaseIT` (`despesa_10x_cria_10_lancamentos_em_10_faturas`) · `PayInvoiceIT` (`libera_limite`, `segunda_vez_409`) · `InstallmentsIT` · `CommitmentsIT` · cross-user 404 em todos.
**Pronto quando:** cobertura `cards.domain` ≥ 95%.

## Passo 8 — Tela Cartões + diálogo com cartão/parcelas
**Prompt:**
> Execute o Passo 8. Leia docs/06 › Cartões e › Diálogo (compare com screenshots/desktop-04-cartoes.png, desktop-05-lancamento-despesa.png, mobile-04/05). Implemente features/cards (tela completa, formulário Adicionar cartão, Pagar fatura) e no LancamentoDialog as opções de cartão, Parcelas e a nota "1ª parcela na fatura de {mês}".

**Testes primeiro:**
- `cards/domain/installmentPreview.test.ts` (rótulos "À vista", "10x de R$ 489,90"; nota da fatura).
- MSW: `CartoesPage.test` (`seleciona_cartao_pela_url`, `pagar_fatura_desabilitado_quando_zero`, `escopo_este_cartao_todos`) · `LancamentoDialog.cartao.test` (`parcelas_so_aparecem_com_cartao`, `rotulo_valor_total_da_compra_quando_parcelado`).
**Pronto quando:** E2E manual: despesa 10x aparece em Gastos (1/10), Cartões (fatura, parcelamentos, compromissos).

## Passo 9 — Carteira (`portfolio`) + cotações (`marketdata`)
**Prompt:**
> Execute o Passo 9 (só backend). Leia docs/04 regras 7, 8, 10 e 11. Testes primeiro de PositionCalculator. Depois Asset, Trade, Dividend, AllocationTarget, FixedIncomeValuation; casos de uso SearchAssets, RegisterFixedIncomeAsset, RegisterTrade (+ evento TradeRegistered → ledger), DeleteTrade, PreviewTrade, GetPortfolio, RegisterDividend (+ DividendRegistered), GetMonthlyDividends, SetAllocationTargets, UpdateValuation, GetPortfolioHistory; QuoteProvider/BrapiQuoteProvider e /internal/jobs/quotes.

**Testes primeiro:**
- `PositionCalculatorTest`: `compra_unica_pm_inclui_custos` · `compras_sucessivas_ponderam_pm` · `venda_parcial_mantem_pm_e_gera_resultado` · `venda_total_zera_pm` · `venda_acima_da_posicao_lanca_InsufficientQuantity` · `operacao_retroativa_reprocessa_em_ordem`.
- `PositionTest` (invested, valueAt, rentAt) · `AllocationTargetsTest` (`soma_diferente_de_100_lanca`) · `PortfolioSummaryTest` (dayPct ponderado; RF sem dayPct).
- App: `RegisterTradeTest` (dispara `TradeRegistered`; venda inválida não dispara).
- IT: `TradesResourceIT` (`compra_cria_movimento_no_ledger`, `venda_acima_422_voce_tem_n_cotas`, `delete_que_negativa_posicao_422`) · `PortfolioResourceIT` (números batem com fixture) · `DividendsIT` · `QuotesJobIT` (`sem_segredo_401`, `atualiza_com_fake_brapi`) · `AssetSearchIT`.
**Pronto quando:** cobertura `portfolio.domain` ≥ 95%.

## Passo 10 — Tela Investimentos + modo Investimento do diálogo
**Prompt:**
> Execute o Passo 10. Leia docs/06 › Investimentos e › Diálogo (screenshots/desktop-02-investimentos.png, desktop-06-lancamento-investimento.png, mobile-02). Implemente features/portfolio (KPIs, proventos, donut, AssetGroups com DataTable/lista mobile, menu da posição com Registrar provento / Atualizar valor, dialog Configurar % ideal) e o modo Investimento do LancamentoDialog com combobox de ativo e prévia via /trades/preview.

**Testes primeiro:** `portfolio/domain/tradePreview.test.ts` · MSW: `InvestimentosPage.test` (`grupos_com_metricas`, `clique_na_linha_abre_dialogo_com_ativo`, `percentual_ideal_valida_100`) · `LancamentoDialog.investimento.test` (`venda_mostra_disponivel`, `erro_voce_tem_n_cotas`, `previa_novo_preco_medio`).
**Pronto quando:** visual = capturas; compra/venda refletem em Investimentos, Gastos (filtro Todos) e Resumo.

## Passo 11 — Resumo (`summary`) + snapshots
**Prompt:**
> Execute o Passo 11. Leia docs/03 › Resumo, docs/04 regra 9 e docs/06 › Resumo (screenshots/desktop-01-resumo.png, mobile-01-resumo.png). Backend: GetSummary (read model que usa queries públicas dos outros contextos), /internal/jobs/snapshots. Web: tela Resumo completa + onboarding de primeiro acesso.

**Testes primeiro:** `SummaryAssemblerTest` (fakes das queries: top 4 orçamentos por spent/limit, próximas parcelas) · `PortfolioHistoryTest` (meses sem snapshot = só aplicado) · IT `SummaryResourceIT` (`usuario_novo_retorna_zeros`, números consistentes com /transactions/stats e /portfolio) · `SnapshotsJobIT` · MSW `ResumoPage.test` (`onboarding_quando_sem_dados`, `links_ver_gastos_e_cartoes`).
**Pronto quando:** Resumo faz ≤ 3 requests; números iguais às outras telas.

## Passo 12 — Configurações, estados e acessibilidade
**Prompt:**
> Execute o Passo 12. Implemente Configurações (docs/06), DELETE /me (apaga dados + conta em `app.users`), skeletons, estados de erro/vazio (docs/05), rate limit de POSTs, revisão de acessibilidade.

**Testes primeiro:** `DeleteAccountIT` (apaga tudo do usuário, não toca outros) · `RateLimitIT` (61ª requisição/min → 429) · MSW `Configuracoes.test` (`excluir_exige_digitar_EXCLUIR`) · testes de estados (`mostra_skeleton`, `erro_com_tentar_novamente`) · `axe` nos testes de página (jest-axe/vitest-axe sem violações).

## Passo 13 — E2E e go-live
**Prompt:**
> Execute o Passo 13. Escreva os E2E Playwright e execute o checklist de go-live de docs/07.

**Testes:** `e2e/auth.spec.ts` (cadastro → login → logout) · `e2e/fluxo-principal.spec.ts` (despesa 10x no cartão → Gastos 1/10 → Cartões fatura/parcelamento → pagar fatura → limite liberado) · `e2e/investimento.spec.ts` (compra → PM → venda parcial → resultado) · `e2e/mobile.spec.ts` (viewport 390: FAB, bottom sheet, BottomNav). Rodar em CI contra stack local (docker compose + api + web; ver pendência de Auth em dev em docs/01).
**Pronto quando:** E2E verde em CI; Lighthouse a11y ≥ 95; checklist de docs/07 completo.

---

## Fases futuras (precisam de design antes)
- **Mercado** (`design/reference/dashboard`): tabela de mercado, lista de observação, panorama — nova aba "Mercado" no TopTabs (o SideRail do v1 não é usado).
- **Metas**, **Relatórios** (IR: ganho de capital mensal, isenção de R$ 20 mil em ações, DARF), **Importar extrato B3**, lançamento automático de recorrentes, fatura em PDF, notificações.
