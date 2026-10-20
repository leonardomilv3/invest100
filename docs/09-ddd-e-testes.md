# 09 · Arquitetura DDD leve + estratégia de testes (TDD)

"DDD leve" aqui significa: **contextos delimitados como módulos**, **regras de negócio dentro do domínio** (agregados e value objects com comportamento, não anêmicos), **portas (interfaces) no domínio** e adaptadores na infraestrutura — sem CQRS/event sourcing, sem microserviços, um único deployable e um único banco.

---

## 1. Contextos delimitados (backend)

| Contexto | Pacote | Agregados / VOs | Responsabilidade |
|---|---|---|---|
| Compartilhado | `shared` | `Money`, `Quantity`, `UnitPrice`, `Percentage`, `CompetenceMonth`, `UserId`, `DomainException`, `NotFoundException` | tipos e infraestrutura comuns |
| Perfil | `profile` | `Profile` | usuário do app, meta de proventos |
| Lançamentos | `ledger` | `Transaction` (raiz), `Category`, `PaymentMethod`, `InstallmentInfo` | despesas, receitas, movimentos de investimento, estatísticas do mês |
| Orçamento | `budget` | `Budget`, `BudgetStatus` | limites e consumo por categoria |
| Cartões | `cards` | `CreditCard` (raiz), `Invoice` (raiz), `CardPurchase` (raiz), `InvoiceCycle`, `InstallmentPlan`, `Last4`, `DayOfMonth` | ciclo de fatura, parcelamento, pagamento, compromissos |
| Carteira | `portfolio` | `Asset`, `Trade`, `Position` (VO calculado), `PositionCalculator`, `Dividend`, `AllocationTarget`, `FixedIncomeValuation` | posições, preço médio, proventos, alocação |
| Dados de mercado | `marketdata` | `Quote`, porta `QuoteProvider` | cotações (brapi) |
| Resumo | `summary` | — (read model) | agrega dados de outros contextos para a tela Resumo |

## 2. Camadas por contexto
```
br.com.investidor100.<contexto>/
├── domain/          entidades/agregados, value objects, serviços de domínio, eventos, exceções,
│                    interfaces de repositório (portas). Java puro + anotações JPA permitidas (pragmatismo).
│                    PROIBIDO: Quarkus, JAX-RS, Jackson, CDI, Panache.
├── application/     casos de uso (1 classe por caso: RegisterExpense, PayInvoice, RegisterTrade…),
│                    @ApplicationScoped + @Transactional, comandos/resultados como records.
│                    Orquestra domínio + portas; sem regra de negócio própria.
├── infrastructure/  repositórios Panache que implementam as portas, clientes REST (brapi), mapeadores.
└── api/             resources JAX-RS, request/response records, validação de entrada (Bean Validation),
                     mapeamento DTO ↔ comando. Nunca acessa infrastructure diretamente.
```
Regras verificadas por **ArchUnit** (`ArchitectureTest`):
- `..domain..` não depende de `..application..`, `..infrastructure..`, `..api..`, `io.quarkus..`, `jakarta.ws.rs..`, `com.fasterxml..`.
- `..api..` não depende de `..infrastructure..`.
- Contexto A só acessa contexto B via `B.application` (casos de uso/portas públicas) ou eventos — nunca `B.domain` repositórios ou `B.infrastructure`. Exceção: `shared`.
- Classes em `..application..` terminam com nome de verbo (`RegisterExpense`) ou `Query`.

Implementação (Passo 0) — `src/test/java/.../architecture/ArchitectureRules.java`, com auto-teste `ArchitectureRulesTest` sobre fixtures:
- O contexto é o segmento antes da camada (`<contexto>.<domain|application|infrastructure|api>`).
- "Eventos" = pacote `<contexto>.domain.event` — é a única parte do `domain` de outro contexto que pode ser referenciada.
- Domínio também não pode depender de CDI (`jakarta.enterprise..`, `jakarta.inject..`).
- Nome de caso de uso: classe de topo em `application` que começa com um verbo da lista `USE_CASE_VERBS` (Add, Archive, Calculate, Change, Close, Compute, Create, Delete, Get, Import, List, On, Pay, Preview, Record, Refresh, Register, Remove, Resolve, Set, Take, Update, Upsert) ou termina em `Query`/`Command`/`Result`. Novo verbo → adicione à lista.
- Regras vazias passam (`archRule.failOnEmptyShould=false`) enquanto não há código.

## 3. Modelo rico — exemplos de comportamento no domínio
```java
// cards.domain
public final class InvoiceCycle {               // VO puro
  public static InvoiceCycle of(DayOfMonth closing, DayOfMonth due) {…}
  public YearMonth referenceFor(LocalDate purchaseDate) {…}   // regra 1 de docs/04
  public LocalDate closingDate(YearMonth ref) {…}
  public LocalDate dueDate(YearMonth ref) {…}
}
public final class InstallmentPlan {            // VO puro
  public static InstallmentPlan split(Money total, int count) {…} // centavos na 1ª
  public List<Money> amounts() {…}
}
public class CreditCard { … public InvoiceCycle cycle() {…} public void archive(Clock c) {…} }
public class Invoice   { … public void pay(Money amount, Instant at) { if (isPaid()) throw new InvoiceAlreadyPaid(id); … }
                         public InvoiceStatus statusOn(LocalDate today) {…} }

// portfolio.domain
public final class PositionCalculator {         // serviço de domínio puro
  public Position compute(List<Trade> tradesOrdered) {…} // lança InsufficientQuantity
}
public record Position(Quantity quantity, UnitPrice avgPrice, Money realizedResult) {
  public Money invested() {…}  public Money valueAt(UnitPrice price) {…}  public Percentage rentAt(UnitPrice p) {…}
}

// ledger.domain
public class Transaction {
  public static Transaction expense(UserId u, String desc, Money amount, LocalDate on, CategoryRef c, PaymentMethod m) {…}
  public static Transaction installment(…, int n, int total, YearMonth competence, InvoiceRef inv) {…}
  public static Transaction investmentMovement(…) {…}
  // invariantes: descrição não vazia, sinal coerente com kind, cartão ⇔ paymentMethod CARTAO
}
public final class MonthStats { public static MonthStats from(List<Transaction> monthTx) {…} } // regra 4
```
`Money` encapsula `BigDecimal` (escala 2, `HALF_EVEN`), não tem construtor com `double`, expõe `plus/minus/negate/times/isNegative`. Persistido via `@Embeddable` ou `AttributeConverter`.

## 4. Comunicação entre contextos
- **Chamada síncrona via caso de uso público**: `cards.application.RegisterCardPurchase` chama `ledger.application.RecordTransactions` (interface no `ledger.application`) para criar as N parcelas na mesma transação.
- **Eventos de domínio in-process** (CDI `Event<T>` disparado no caso de uso, `@Observes` síncrono → mesma transação):
  - `TradeRegistered` → `ledger` cria movimento `investment`.
  - `DividendRegistered` → `ledger` cria receita `proventos`.
  - `TradeDeleted` / `DividendDeleted` → `ledger` remove o movimento (ou `on delete cascade`).
- `summary` só lê: chama queries públicas de `ledger`, `cards`, `portfolio`, `budget`.

## 5. Tratamento de erros
Exceções de domínio estendem `DomainException(code, message pt-BR)`; um `ExceptionMapper` converte para problem+json:
| Exceção | Status | Mensagem |
|---|---|---|
| `ValidationException` (Bean Validation) | 422 | por campo ("Informe uma descrição") |
| `InsufficientQuantity` | 422 | "Você tem {n} cotas" |
| `AllocationMustSum100` | 422 | "A soma deve ser 100%" |
| `InvoiceAlreadyPaid` | 409 | "Esta fatura já foi paga" |
| `NotFoundException` (inclui recurso de outro usuário) | 404 | "Não encontrado" |

---

## 6. Estratégia de testes

### Pirâmide
| Nível | Ferramentas | O que cobre | Velocidade |
|---|---|---|---|
| **Unit — domínio** | JUnit 5, AssertJ, `@ParameterizedTest`, jqwik (property-based, opcional) | VOs, agregados, serviços de domínio, regras de docs/04 | ms, sem Quarkus |
| **Unit — aplicação** | JUnit 5 + **fakes em memória** das portas (preferir a Mockito) | orquestração dos casos de uso, eventos disparados | ms |
| **Integração — API** | `@QuarkusTest`, Dev Services Postgres (Testcontainers), RestAssured, JWT de teste | endpoint ponta a ponta com Flyway real: sucesso, 422, 404 cross-user, 401 | s |
| **Integração — persistência** | `@QuarkusTest` + `@TestTransaction` | queries não triviais (agregações, filtros, paginação) | s |
| **Arquitetura** | ArchUnit | regras da seção 2 | ms |
| **Frontend unit** | Vitest | `domain/` TS puro: `format`, schemas zod, cálculos de prévia | ms |
| **Frontend componente** | Vitest + Testing Library | componentes do DS e formulários | ms |
| **Frontend integração** | Vitest + Testing Library + **MSW** | página inteira com API mockada pelo contrato de docs/03 | s |
| **E2E** | Playwright | fluxo crítico contra API local + Supabase local | min |

### Ciclo TDD obrigatório (por caso de uso)
1. **Red (domínio):** escrever os testes unitários da regra → rodar → **mostrar a falha**.
2. **Green:** implementação mínima no domínio → rodar → verde.
3. **Refactor:** limpar nomes/duplicação mantendo verde.
4. **Red (integração):** teste `@QuarkusTest` do endpoint (inclui 422/404/401) → falha.
5. **Green:** caso de uso (application) + repositório (infrastructure) + resource (api) → verde.
6. **Red/Green (frontend):** teste de integração MSW da interação na tela → implementar UI → verde.
7. `./mvnw verify` + `npm test` completos verdes → commit (Conventional Commits: `feat(cards): parcelamento no cartão`).
Nunca escrever produção antes do teste vermelho correspondente. Nunca "consertar" teste para passar sem confirmar a regra em docs/04.

### Nomenclatura
- Java: `<Classe>Test` (unit), `<Resource>IT` (integração, plugin failsafe). Métodos em pt-BR snake_case descrevendo comportamento: `compra_no_dia_do_fechamento_vai_para_a_proxima_fatura()`. Estrutura *given/when/then* com comentários curtos.
- TS: `*.test.ts(x)`; `describe('LancamentoDialog')` / `it('mostra erros só depois de tentar salvar')`.

### Infra de teste — backend
```xml
<!-- pom.xml (test) -->
quarkus-junit5 · rest-assured · assertj-core · archunit-junit5 · smallrye-jwt-build · jqwik (opcional)
<!-- plugins -->
maven-surefire (*Test) · maven-failsafe (*IT) · jacoco (check: domain ≥ 90% linhas, total ≥ 80%)
```
```properties
# src/test/resources/application.properties (ou %test.)
%test.mp.jwt.verify.publickey.location=publicKey.pem
%test.mp.jwt.verify.publickey.algorithm=RS256
%test.mp.jwt.verify.issuer=https://test.supabase.co/auth/v1
%test.smallrye.jwt.sign.key.location=privateKey.pem
%test.app.jobs.secret=test-secret
%test.quarkus.rest-client.brapi.url=http://localhost:${quarkus.http.test-port}/fake-brapi
```
```java
// TestTokens.java — cada teste usa um usuário aleatório ⇒ isolamento sem limpar o banco
public static String forUser(UUID id) {
  return Jwt.issuer("https://test.supabase.co/auth/v1").subject(id.toString())
            .audience("authenticated").claim("email", id + "@test.dev").sign();
}
```
- `FakeBrapiResource` (só no perfil test) devolve cotações fixas.
- `Clock` injetável (`@Produces Clock`) — testes fixam `2026-10-20`.
- Builders de teste (`TransactionBuilder`, `TradeBuilder`) em `src/test/java/.../fixtures`.

### Infra de teste — frontend
```ts
// vitest.config.ts
test: { environment: 'jsdom', setupFiles: ['src/test/setup.ts'],
        coverage: { provider: 'v8', thresholds: { lines: 80, 'src/features/**/domain/**': { lines: 95 } } } }
```
- `src/test/msw/handlers.ts` — handlers por endpoint com fixtures baseadas em `design/reference/finance/data.js` (mesmos números das capturas ⇒ fácil comparar visualmente).
- `renderWithProviders()` (QueryClient novo por teste, Router em memória, Auth fake).
- Playwright: `e2e/fluxo-principal.spec.ts` com `docker compose` (Postgres) + API local; usuário criado via Admin API no `globalSetup`.

## 7. Frontend em "DDD leve"
```
src/features/<contexto>/
├── domain/   tipos TS, funções puras (ex.: cards/domain/installmentPreview.ts), schemas zod — 100% testável sem React
├── api/      hooks TanStack Query + chamadas ao client (um arquivo por recurso)
└── ui/       páginas e componentes da feature (usam design-system/)
```
Contextos espelham o backend: `ledger` (Gastos + diálogo despesa/receita), `cards`, `portfolio`, `budget`, `summary`, `profile`, `auth`. O diálogo "Adicionar lançamento" vive em `features/ledger/ui/LancamentoDialog` e importa `portfolio/domain` para a prévia de trade.
