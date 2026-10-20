Single-figure metric card with optional chart slot — index cards, market cap, total volume, P&L.

```jsx
<MetricCard label="Ibovespa" value="128.021,16" caption="Sentimento e desempenho geral do mercado." action="arrow-up-right">
  <RibbonChart upper={[...]} lower={[...]} highlight={3} label="8,65%" />
</MetricCard>
<MetricCard emphasis="label" label="Valor de mercado" value="R$ 3,53 tri" unit="BRL" caption="Valor de mercado total" delta={1.87} />
```
