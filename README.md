# Handoff: Investidor100 — sistema completo (Finanças + Investimentos)

## Visão geral
Investidor100 é um gerenciador pessoal de **investimentos + vida financeira** (pt-BR, BRL, B3). Este pacote contém tudo para o Claude Code implementar o produto em produção:

| Camada | Stack | Hospedagem |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Vercel |
| Backend | Java 25  + Quarkus 3 (LTS) — REST/JSON | Render (Docker) |
| Banco + Auth | Postgres + Supabase Auth | Supabase |

**Escopo do MVP = UI kit v2 "Finanças"**: Resumo · Investimentos · Gastos · Cartões · diálogo "Adicionar lançamento" (despesa com parcelamento 1–12x no cartão, receita, compra/venda de ativo). O kit v1 "Dashboard" (Tabela de mercado, lista de observação) entra como fase posterior (módulo **Mercado**). Metas e Relatórios **não têm design** — ficam como placeholder até serem desenhados.

## Sobre os arquivos de design
Os arquivos em `design/` são **referências de design criadas em HTML/JSX** — protótipos que mostram aparência e comportamento, **não código de produção**. A tarefa é **recriá-los** num app React + Vite + TS limpo, com tipagem, chamadas reais à API e testes. Os componentes `design/components/**` podem ser portados quase 1:1 (mesma API de props), mas devem ser convertidos para TSX + CSS Modules.

## Fidelidade
**Alta fidelidade (hi-fi).** Cores, tipografia, espaçamentos, raios, estados e copy são finais. Recriar pixel-perfect usando os tokens de `design/tokens/*.css`. Números, nomes de cartões e categorias dos mocks são fictícios.

## Como usar este pacote (ordem de leitura)
0. Os arquivos de código em `design/` vêm com sufixo `.txt` (ex.: `Button.jsx.txt`) para não serem executados no ambiente de design. Ao copiar para o repo, remova o sufixo:
   ```bash
   find design -name '*.txt' -exec sh -c 'mv "$1" "${1%.txt}"' _ {} \;
   ```
1. Copie todo o conteúdo deste pacote para a **raiz do repositório** (o `CLAUDE.md` é lido automaticamente pelo Claude Code em toda sessão).
2. **`PROMPT-CLAUDE-CODE.md`** → cole na primeira sessão. Ele inicia o Passo 0.
3. `docs/08-plano-de-implementacao.md` → 14 passos (0–13) em **DDD leve + TDD**, cada um com prompt, testes a escrever primeiro e critério de pronto. **Um passo por sessão.**
4. `docs/09-ddd-e-testes.md` → contextos, camadas, regras ArchUnit, pirâmide de testes, infra de teste (JWT de teste, Dev Services, MSW).
5. Specs de referência (consultadas sob demanda pelo Claude Code):
   - `docs/01-arquitetura.md` — monorepo, fluxo de auth, decisões
   - `docs/02-banco-de-dados.md` — modelo de dados (+ `backend/db/migration/*.sql`)
   - `docs/03-api.md` — contrato REST
   - `docs/04-regras-de-negocio.md` — fatura, parcelas, preço médio, orçamento, KPIs
   - `docs/05-frontend.md` — estrutura, port do design system, estado, rotas
   - `docs/06-telas.md` — spec visual de cada tela e do diálogo
   - `docs/07-deploy.md` — Supabase, Render, Vercel, variáveis, CI

## Estrutura do pacote
```
design_handoff_investidor100/
├── README.md                 ← este arquivo
├── PROMPT-CLAUDE-CODE.md     ← prompt mestre (1ª sessão)
├── CLAUDE.md                 ← regras permanentes do Claude Code
├── docs/01…09-*.md
├── screenshots/              ← capturas hi-fi: desktop 1440 (01–06) e mobile 390 (01–05)
├── backend/
│   ├── db/migration/V1__schema.sql, V2__seed.sql   ← Flyway (src/main/resources/db/migration)
│   ├── application.properties
│   └── Dockerfile
├── infra/
│   ├── render.yaml           ← Blueprint Render (raiz do repo)
│   ├── vercel.json           ← apps/web/vercel.json
│   ├── env.web.example
│   └── env.api.example
└── design/
    ├── styles.css + tokens/  ← CSS custom properties (fonte da verdade visual)
    ├── assets/fonts/         ← Plus Jakarta Sans variável (woff2)
    ├── assets/icons/         ← SVGs Lucide usados (usar `lucide-react` no app)
    ├── components/<grupo>/   ← Name.jsx.txt (implementação) · Name.types.ts.txt (props) · Name.prompt.md (uso)
    └── reference/
        ├── finance/          ← telas v2 (MVP): Parts, Resumo, Investimentos, Gastos, Cartoes, Lancamento, FinanceApp, data.js
        └── dashboard/        ← telas v1 (fase Mercado)
```

## Design tokens (resumo — valores completos em `design/tokens/`)
- **Cores núcleo:** lime `#C2F86C` (acento único) · ink `#141414` · branco `#FFFFFF`
- **Canvas v2:** `--bg-app-soft #F3F3F1` · cards brancos com borda `--border-card #E6E6E3` · campos `--border-field #DCDCD8`
- **Mercado:** positivo `#1FA855` (texto) / `#2BC48A` (gráfico) · negativo `#F0532D` · alerta `#F5C04A`/`#E9AE2A` · info `#3D6BF5`
- **Neutros:** ink-950 `#0A0A0A` · 800 `#222` · 700 `#333` · 600 `#4D4D4D` · 500 `#6B6B6B` · 400 `#8E8E8E` · 300 `#B4B4B4` · 200 `#D6D6D6` · 150 `#E4E4E3` · 100 `#EEEEED` · 75 `#F2F2F1` · 50 `#F7F7F6`
- **Categorias:** `--cat-lime/ink/teal/blue/amber/coral/violet/sky/pink/stone` (mapa em `CategoryIcon.jsx → CATEGORY_META`)
- **Tipografia:** Plus Jakarta Sans apenas. Escala 56/40/28/22/18/16/14/13/12/11. Tracking negativo (−0,015 a −0,035em) ≥18px. `font-variant-numeric: tabular-nums` em todo número.
- **Espaço:** base 4px (4·6·8·12·16·20·24·32·40·48·64). Gap entre widgets 16. Gutter 24 (16 mobile).
- **Raios:** card v2 16 · campo 12 · tile 20 · widget 24 · pill 999 (botões, tabs, badges).
- **Sombras:** só camadas flutuantes (`--shadow-float`). Cards v2 não têm sombra.
- **Motion:** `cubic-bezier(.22,.8,.24,1)`; 120ms hover · 200ms estado · 320ms sheets.
- **Breakpoints:** <900 mobile · ≥900 desktop · ≥1200 wide (4 KPIs por linha).

## Assets
- Fonte: Plus Jakarta Sans (OFL) — woff2 em `design/assets/fonts/` (ou `@fontsource-variable/plus-jakarta-sans`).
- Ícones: Lucide (ISC) — usar o pacote `lucide-react`, stroke 1.6, 15/18/20px.
- Logos de empresas: **não licenciados** → `TickerLogo` (monograma). Marca Investidor100 sem logo → `Wordmark` tipográfico.

## Decisões em aberto (confirmar com o produto)
1. Dashboard v1 e Finanças v2 → **um único app** (assumido aqui; v1 vira módulo Mercado).
2. Fonte de cotações: **brapi.dev** (assumido; atrás de interface `QuoteProvider`).
3. Lançamento de cartão conta no **mês da compra** (parcela n → mês da compra + n−1); a fatura é rastreada à parte. Ver `docs/04`.
4. "Conectar B3" fica desabilitado no MVP (integração oficial exige convênio) — fase futura: importar extrato CSV/XLSX da Área do Investidor.
