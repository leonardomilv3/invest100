# 06 · Telas (spec hi-fi)

Fonte exata de cada tela: `screenshots/*.png` (visual) + `design/reference/finance/*.jsx` (layout) + `design/components/**` (componentes). Em caso de dúvida, **captura + código de referência vencem este texto**. Capturas desktop em 1440px (layout wide), mobile em 390px (página inteira, sem moldura).

| Tela | Desktop | Mobile |
|---|---|---|
| Resumo | `screenshots/desktop-01-resumo.png` | `screenshots/mobile-01-resumo.png` |
| Investimentos | `screenshots/desktop-02-investimentos.png` | `screenshots/mobile-02-investimentos.png` |
| Gastos | `screenshots/desktop-03-gastos.png` | `screenshots/mobile-03-gastos.png` |
| Cartões | `screenshots/desktop-04-cartoes.png` | `screenshots/mobile-04-cartoes.png` |
| Lançamento — despesa | `screenshots/desktop-05-lancamento-despesa.png` | `screenshots/mobile-05-lancamento-sheet.png` |
| Lançamento — investimento | `screenshots/desktop-06-lancamento-investimento.png` | — |

## Base comum
- Canvas `--bg-app-soft #F3F3F1`. Conteúdo `max-width 1440`, padding `20px 24px 56px` (desktop) / `4px 16px 132px` (mobile).
- **Panel** = `Card variant="outlined"`: fundo branco, borda 1px `--border-card`, radius 16, sem sombra. Cabeçalho `16px 20px` com título 17/600/−0.02em + subtítulo 12 `--ink-500` (margem 3) + ações à direita; divisor 1px `--border-card`; corpo padding 20.
- **Kpi** = Card outlined (ou `accent` lime) radius 16 padding 18, gap 14. Linha: disco 32px (`--ink-75`; no accent `rgba(255,255,255,.55)`) com ícone 16 · título 14/500 `--ink-800` · ícone `info` 14 `--ink-300`. Conteúdo recuado 42px. **Big** = 22/600/−0.03em tabular. **Split** = grid de N colunas, label 12.5 `--ink-500`, valor 14/600 (margem 4).
- **Grid de KPIs**: desktop `repeat(auto-fit,minmax(250px,1fr))`, wide (≥1200) `repeat(4,1fr)`, gap 16. Mobile: carrossel horizontal scroll-snap, itens de 280px, gap 12, sangra até a borda (margem −16).
- **PageTitle**: h1 30/600/−0.03em (mobile 26), contador opcional "(11)" 14 `--ink-400`; margem `6px 0 18px` (mobile `4px 0 14px`).
- Gap vertical entre blocos 16.

## Shell desktop (≥900)
Header sticky, branco 94% + blur 12px, borda inferior `--border-card`.
- Linha 1 (64px): `Wordmark` 21 · espaço · `SearchInput sm` "Buscar ativo, lançamento ou categoria" atalho `/` (240px; 340 wide) · `IconButton bell soft` com badge · `UserChip` (compacto <1200).
- Linha 2 (borda topo `--border-subtle`): `TopTabs` — Resumo `layout-grid` · Investimentos `chart-pie` · Gastos `receipt` · Cartões `credit-card` · Metas `target` · Relatórios `file-text`; ativo = sublinhado ink + disco lime no ícone. À direita: [wide] `Button secondary sm link` "Conectar B3" (desabilitado no MVP, tooltip "Em breve") · `Button sm plus` "Adicionar lançamento".

## Shell mobile (<900)
- Header sticky `rgba(243,243,241,.92)` + blur 12: `Wordmark` 19 · `IconButton bell lg` · `Avatar` 44.
- `BottomNav` flutuante (left/right 16, bottom 16): Resumo · Investir · Gastos · Cartões · Mais (`menu`). "Mais" abre sheet com Metas, Relatórios, Configurações, Ajuda (linhas 56px, borda `--border-card`, radius 14, disco 36 `--ink-75`, chevron-right).
- FAB lime 56px, right 20, bottom 96, ícone `plus` 24/2.2, sombra `0 10px 24px -6px rgba(77,122,16,.45)` → abre diálogo como bottom sheet.
- Toast: pill ink, texto branco 13/500, disco lime 24 com `check`; bottom 112, some em 2,4s.

## Resumo (`Resumo.jsx`)
1. PageTitle "Resumo" + (desktop) "Atualizado hoje, 14:15" 13 `--ink-500` (= `updatedAt`).
2. KPIs: **Patrimônio total** (accent lime — a única superfície lime da tela; Big + `Delta pill sm` do dia; Split Valor aplicado / Rentabilidade) · **Saldo de {mês}** (Big verde/vermelho com sinal; Split Receitas / Despesas) · **Faturas dos cartões** (Big; Split Próximo vencimento "05 NOV" / Cartões) · **Proventos (12M)** (Big; Split Este mês / Média).
3. Linha (wide `1.65fr 1fr`, senão 1 coluna): **Evolução do patrimônio** — `StackedBarChart` h270 (mobile 220, 6 meses), séries "Valor aplicado" `--ink-800` + "Ganho de capital" `--lime-300`, destaque na última barra, `SelectField sm calendar` 186px "Últimos 12 meses / 6 meses". **Gastos por categoria** — sub "{Mês} {ano}", `DonutChart` 184 (legenda direita; bottom em wide), centro "Gasto no mês" + valor sem centavos, ação `ghost sm` "Ver gastos ↗".
4. Linha 2 colunas: **Orçamento do mês** (sub "Categorias mais próximas do limite", 4 `BudgetRow` com divisor `--border-subtle`, ação "Orçamento completo ↗") · **Próximas parcelas** (sub "Fatura de novembro · R$ X", 4 `InstallmentRow compact`, ação "Ver cartões ↗").
5. PageTitle "Meus ativos (N)" + `Button secondary sm` "Ir para investimentos ↗" e os `AssetGroup` **fechados** por padrão.

## Investimentos (`Investimentos.jsx`)
1. PageTitle + `Button secondary sm sliders-horizontal` "Configurar % ideal" (abre Dialog com um TextField % por classe; soma precisa dar 100).
2. KPIs (nenhum lime): **Patrimônio investido** (Big + Delta plain; Split Valor aplicado / Lucro colorido) · **Destaques da carteira** (Split Melhor/Pior posição + 2 `Delta soft`) · **Posições no lucro** ("9 de 11" + `Badge accent` "82%"; barra 8px fundo `--red-50`, preenchimento `--green-400`; legenda "9 no lucro" verde / "2 no prejuízo" vermelho 12px) · **Proventos (12M)** (Split Média mensal / Meta mensal).
3. Linha (wide `1.6fr 1fr`, desktop `1fr 1fr`): **Evolução de proventos** — sub "Clique nas barras para ver o detalhe do mês", `Badge positive` "Total R$ X", barras `--lime-400` h240, eixo "R$ 0". Clique na barra → lista dos proventos do mês (Dialog). **Ativos na carteira** — `DonutChart` 180 por classe (Ações `--ink-900`, FIIs `--lime-300`, Renda fixa `--cat-teal`), legenda "Ações · ideal 40%".
4. "Meus ativos (N)" → um `AssetGroup` por classe (aberto): métricas Ativos · Valor total · Variação · Rentabilidade · "% na carteira 38% / 40%". Corpo desktop = `DataTable` minWidth 880, ordenado por Saldo desc, colunas: Ativo (`TickerLogo` 32 square + símbolo 600 + nome 11 `--ink-400`) · Quant. · Preço médio · Preço atual · Variação · Rentabilidade (`Delta soft`) · Saldo (600) · % Carteira · `IconButton ellipsis`. Renda fixa troca Quant./PM/Preço/Variação por Indexador (`Badge neutral`) e Aplicado. Mobile = lista: logo 36 · símbolo + "100 cotas · PM R$ 32,10" (RF: indexador) · valor + Delta. Clique na linha → diálogo Investimento com ativo pré-selecionado. Rodapé do grupo: "Lançamentos ↗" (filtra Gastos por investimentos) · "Gráficos" (fase futura — ocultar no MVP) · `Button sm plus` "Adicionar lançamento" (mobile lg fullWidth).

## Gastos (`Gastos.jsx`)
1. PageTitle + seletor de mês (pill branca, borda `--border-card`, padding 4; chevrons `ghost sm`; rótulo 14/600 min-width 128 "Outubro 2026") + `Button sm plus` "Nova despesa". No mobile só o seletor.
2. KPIs: Receitas (verde) · Despesas · Saldo do mês (sinal + cor) · Orçamento usado (Big = restante; `Badge` com %; barra 8px fundo `--ink-100`, fill `--lime-400` ou `--red-500` se >100%).
3. Linha (wide `1.7fr 1fr`): **Orçamento por categoria** — sub "Limite total R$ X", ação "Editar limites" (`pencil`; abre Dialog com TextField por categoria), grid 2 colunas (gap 28) de `BudgetRow` com caption "3 lançamentos"; clique filtra a lista. **Distribuição** — Donut 196 legenda bottom.
4. **Gastos por mês** — sub "Últimos 6 meses por categoria", StackedBar h260: Moradia, Alimentação, Transporte, Lazer + Outros; destaque no mês selecionado.
5. **Lançamentos** — sub "17 em outubro 2026"; ações: `SegmentedControl sm` Todos/Despesas/Receitas · `SelectField sm` 200px categorias · `SearchInput sm` 220px "Buscar lançamento". Desktop `DataTable` minWidth 820: Data (80, `--ink-600`) · Descrição (CategoryIcon 30 + texto 500) · Categoria (`Badge neutral sm`) · Pagamento · Parcela (`Badge white` com borda "4/10" ou "—") · Valor (600, verde se positivo, "+R$"/"−R$"). Vazio: "Nenhum lançamento com esses filtros." Mobile: lista CategoryIcon 38 + descrição + "20/10 · Pix · 4/10" + valor. Clique na linha → Dialog de edição (fase 4.5; MVP pode só permitir excluir).

## Cartões (`Cartoes.jsx`)
1. PageTitle "Cartões (3)" + `Button secondary sm plus` "Adicionar cartão".
2. Grid de `CreditCardTile` (min 270; wide 4 colunas) — selecionado = estado ativo do tile; último item desktop = tile tracejado "Adicionar cartão" (min-height 196, radius 20, borda 1.5 dashed `--border-strong`, disco branco 44 com `plus`). **Atenção:** no protótipo esse tile abre o diálogo de despesa — corrigir para abrir o formulário de cartão.
3. Linha (wide `minmax(320px,1fr) 1.7fr`): **Fatura de {mês}** — sub "Cartão Black •• 4821", `Badge` status; valor 34/500/−0.035em; linhas chave-valor (13.5; 9px; divisor): Fecha em · Vence em · Limite total · Limite disponível; barra de uso 8px ink; "39% do limite em uso" 12; botões `Pagar fatura` (desabilitado se 0) + `secondary download` "Baixar PDF" (fase futura → ocultar no MVP). **Compromissos futuros** — sub "Parcelas + assinaturas previstas por cartão", StackedBar h290, 6 meses, uma série por cartão (cor do tone: ink `--ink-900`, lime `--lime-400`, white `--cat-teal`).
4. Linha (wide `1.7fr 1fr`): **Parcelamentos ativos** — sub "Restante a pagar R$ X", `SegmentedControl sm` "Este cartão / Todos", `InstallmentRow`; vazio "Nenhum parcelamento neste cartão." **Lançamentos da fatura** — sub "N itens em outubro", linhas CategoryIcon 32 + descrição 13.5/500 + "01/10 · parcela 4/10" + valor; vazio "Sem lançamentos neste mês."

## Diálogo "Adicionar lançamento" (`Lancamento.jsx`)
`Dialog` width 600 (desktop centrado) / bottom sheet (mobile). Título "Adicionar lançamento". Rodapé: `ghost` "Cancelar" + `Button check` "Salvar lançamento" (mobile `lg`). Corpo grid 2 colunas gap 16 (mobile tudo em 1 coluna).
- Topo: `SegmentedControl fullWidth` Despesa · Receita · Investimento (trocar reseta erros e categoria).
- **Despesa/Receita:** Descrição (placeholder "Ex.: Supermercado"/"Ex.: Salário", autofocus desktop) · Valor (`R$`; rótulo "Valor total da compra" se cartão e >1x) · Data (`calendar`) · Categoria = chips pill (altura 38 / mobile 44, `CategoryIcon` 30/34; selecionado fundo ink texto branco) · [Despesa] Forma de pagamento (Pix, Débito, Dinheiro, cartões "Nome •• 1234") · [cartão] Parcelas ("À vista", "2x de R$ X" … "12x").
- Bloco total (fundo `--ink-75`, radius 12, padding `14px 16px`): rótulo 15/600 "Valor total"/"Valor a receber", nota 12 `--ink-500` ("10x de R$ 489,90 · 1ª parcela na fatura de novembro"), valor 18/700.
- **Investimento:** `SegmentedControl` Compra/Venda · Tipo de ativo · Ativo (busca `/assets/search` — trocar o Select por combobox com busca) · Data da transação · Quantidade (hint "Disponível: N cotas" na venda) · Preço (pré-preenchido com cotação) · Outros custos (opcional) · bloco "Valor total" com "Novo preço médio R$ X" ou "Resultado estimado ±R$ X".
- Registrar provento: adicionar 4ª opção? **Não** — usar ação no menu `ellipsis` da posição ("Registrar provento") para não mudar o diálogo desenhado.

## Configurações (sem design — usar vocabulário existente)
Página com Panels: Perfil (TextField nome, e-mail só leitura, meta mensal de proventos) · Cartões (lista + editar/arquivar) · Categorias (lista com CategoryIcon; adicionar personalizada) · Assinaturas recorrentes · Sessão (Sair) · Zona de perigo ("Excluir conta", Button com confirmação digitando "EXCLUIR").

## Auth (sem design)
Tela centrada, canvas `--bg-app` com `--bg-app-glow`, Card branco radius 24 max 420: Wordmark, título 28/600 "Entrar", TextFields e-mail/senha (`lg`), Button primário fullWidth, links 13px. Frase editorial ExtraLight à esquerda no desktop: "Investimentos e vida financeira em **um só lugar**."
