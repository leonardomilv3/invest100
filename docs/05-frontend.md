# 05 · Frontend (React 18 + Vite + TypeScript)

## Dependências
`react-router-dom` 6 · `@tanstack/react-query` 5 · `react-hook-form` + `zod` + `@hookform/resolvers` · `lucide-react` · `date-fns` · `clsx`. Dev: `vitest` + `@testing-library/react` + `msw` (mocks da API) · `@playwright/test` (e2e) · `eslint` + `prettier` · `openapi-typescript` (opcional).
**Não** usar biblioteca de UI (MUI/Chakra/shadcn) nem de gráficos — os gráficos do design são SVG próprios e já existem em `design/components/charts/`.

## Estrutura
```
web/src/
├── main.tsx
├── app/
│   ├── providers.tsx        QueryClient, AuthProvider, Router
│   ├── router.tsx
│   ├── AuthGate.tsx         redireciona p/ /entrar sem sessão
│   ├── DesktopShell.tsx     header 64px + TopTabs (port de Parts.jsx)
│   ├── MobileShell.tsx      header sticky + BottomNav flutuante + FAB lime
│   ├── LancamentoProvider.tsx  abre o diálogo "Adicionar lançamento" de qualquer lugar (context)
│   └── Toast.tsx
├── styles/
│   ├── tokens/{fonts,colors,typography,spacing,base}.css   ← copiar de design/tokens
│   └── index.css            @import dos tokens
├── assets/fonts/*.woff2     ← copiar de design/assets/fonts (ajustar url() em fonts.css)
├── design-system/
│   ├── core/ navigation/ forms/ data/ charts/ finance/ overlay/
│   │   └── Button.tsx + Button.module.css (+ Button.test.tsx)
│   └── index.ts             barrel
├── lib/
│   ├── auth.ts              login/cadastro/refresh/logout contra /api/v1/auth/* (sem SDK de terceiros)
│   ├── api/client.ts        fetch wrapper: injeta Bearer, parse problem+json → ApiError
│   ├── api/types.ts         DTOs (espelho de docs/03-api.md ou gerado do OpenAPI)
│   ├── format.ts            brl, signed, pct, fmt, compact, parseBRL, monthLabel
│   └── useBreakpoint.ts     mobile <900 · wide ≥1200
└── features/
    ├── auth/        Entrar, Cadastro
    ├── resumo/      ResumoPage + api.ts
    ├── investimentos/
    ├── gastos/
    ├── cartoes/
    ├── lancamento/  LancamentoDialog (Despesa | Receita | Investimento)
    ├── configuracoes/  perfil, categorias, cartões, % ideal, sair, excluir conta
    └── placeholder/ Metas, Relatórios (componente Empty do design)
```

## Port do design system
- Fonte: `design/components/<grupo>/Name.jsx` (implementação com estilos inline + tokens), `Name.types.ts` (props — **manter a API**), `Name.prompt.md` (quando usar).
- Converter para TSX; mover estilos estáticos para `Name.module.css` usando `var(--token)`; manter inline só valores dinâmicos (larguras de barra, cores por categoria).
- Estados (hover/press/focus/disabled) descritos em `readme` do DS: hover = um passo tonal; press `scale(.97)` (icon buttons `.94`); focus `--focus-ring`; disabled 45% opacity. Implementar via CSS (`:hover`, `:active`, `:focus-visible`).
- `Icon`: wrapper sobre `lucide-react` com `strokeWidth` default 1.6. Mapa nome-kebab → componente (ex.: `'chart-candlestick'` → `CandlestickChart`). Manter a prop `name: string` para que `CATEGORY_META.icon` e dados da API funcionem.
- `CATEGORY_META` fica no frontend como fallback, mas a fonte é `GET /categories` (`icon`, `bgHex`, `fgHex`, `colorToken`).
- Rota `/_ds` (só em dev) renderizando cada componente com variações — substitui as cards do Design System.
- Componentes usados no MVP: Icon, Button, IconButton, Badge, Delta, Tag, Avatar, Card, TickerLogo, Wordmark · TopTabs, BottomNav, SegmentedControl, UserChip · SearchInput, TextField, SelectField · DataTable · StackedBarChart, DonutChart · CategoryIcon, BudgetRow, InstallmentRow, CreditCardTile, AssetGroup · Dialog. (Os demais — SideRail, NavTabs, RangeToggle, AreaChart, FloatingBarChart, RibbonChart, WatchRow, StatCard, MetricCard, AssetCard, PositionRow, TransactionRow, Select — são da fase Mercado.)
- Partes de layout do protótipo (`Panel`, `Kpi`, `Big`, `Split`, `Grid`, `PageTitle`, `Empty`) → `design-system/layout/`.

## Rotas
| Rota | Tela |
|---|---|
| `/entrar`, `/cadastro` | auth (públicas). Recuperar senha fica fora do MVP (sem serviço de e-mail) |
| `/` | redirect → `/resumo` |
| `/resumo` | Resumo |
| `/investimentos` | Investimentos |
| `/gastos?mes=2026-10&tipo=despesas&categoria=alimentacao&q=` | Gastos (filtros na URL) |
| `/cartoes/:cardId?` | Cartões (cartão selecionado na URL) |
| `/metas`, `/relatorios` | placeholder (Empty) |
| `/configuracoes` | Configurações |
Diálogo: `?novo=despesa|receita|investimento[&ativo=PETR4]` abre o "Adicionar lançamento" — permite deep link e botão voltar fecha.

## Estado e dados
- **Servidor:** TanStack Query. Query keys: `['summary', month]`, `['portfolio']`, `['transactions', filters]`, `['budgets', month]`, `['cards']`, `['invoice', cardId, month]`, `['installments', scope]`, `['dividends','monthly']`, `['categories']`.
- **Invalidação após salvar lançamento** (o protótipo atualiza todas as telas): despesa/receita → `summary`, `transactions`, `budgets`, `cards`, `invoice`, `installments`; investimento → + `portfolio`, `dividends`. Use `queryClient.invalidateQueries` com prefixos.
- `staleTime` 30s; `refetchOnWindowFocus` true. Cotações: `refetchInterval` 5 min no `portfolio` em horário de pregão.
- **UI local:** aba via rota; estado de filtros via `useSearchParams`; grupos de ativos abertos/fechados em `localStorage` (`i100.groups.<classe>`).
- **Auth:** `AuthProvider` guarda o `accessToken` em memória e o `refreshToken` em `localStorage` (`i100.refreshToken`). Ao abrir o app, se houver refresh token, chama `POST /auth/refresh` para obter a sessão. `client.ts` injeta o Bearer em cada request e, ao receber 401, tenta um refresh uma única vez (requisições concorrentes compartilham a mesma promessa) antes de `signOut()` (limpa o storage + `POST /auth/logout`) e redirect `/entrar`.

## Formulário "Adicionar lançamento"
- `react-hook-form` + `zod` com schema discriminado por `type`.
- Campos de dinheiro: input texto pt-BR (`inputMode="decimal"`), `parseBRL` no submit; prefixo `R$` do `TextField`.
- Erros mostrados só após a primeira tentativa de salvar (`tried`), com as mensagens do protótipo.
- Investimento: prévia via `GET /trades/preview` com debounce 300ms (ou cálculo local espelhando a regra 7 — mas o servidor é a verdade).
- Submit otimista **não** necessário; mostrar `Button` com loading, fechar e exibir toast com a `message` da API.

## Loading / erro / vazio (não existem no protótipo — criar no mesmo vocabulário)
- Skeleton: blocos `--ink-75` com radius do componente e shimmer sutil (1.2s, sem bounce).
- Erro de seção: dentro do `Panel`, texto `--ink-500` 13px + `Button variant="secondary" size="sm"` "Tentar novamente".
- Vazio: frase editorial ExtraLight com uma palavra em Bold (ex.: "Nenhum lançamento **neste mês**.") + CTA.
- Primeiro acesso (sem dados): Resumo mostra card de onboarding com 3 ações — "Adicionar cartão", "Registrar primeira despesa", "Adicionar investimento".

## Acessibilidade
Foco visível em tudo; `Dialog` com focus trap, `Esc` fecha, `aria-modal`; tabelas com `<th scope>`; ícones decorativos `aria-hidden`; `IconButton` sempre com `label`; gráficos com `<title>` e resumo textual.

## Testes
- Unit: `format.ts` (pt-BR, negativos, `−`), schemas zod, componentes críticos (BudgetRow thresholds, InstallmentRow).
- Integração com MSW: diálogo de lançamento (3 tipos), filtros de Gastos.
- E2E Playwright (contra API local): login → despesa 10x no cartão → aparece em Gastos, Cartões e Resumo.
