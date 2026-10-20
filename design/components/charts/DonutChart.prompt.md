Part-to-whole donut — "Gastos por categoria", "Ativos na carteira".

```jsx
<DonutChart centerLabel="Gasto em outubro" centerValue="R$ 6.249,00"
  data={cats.map(c => ({ label: CATEGORY_META[c.key].label, value: c.spent, color: CATEGORY_META[c.key].color }))}
  format={v => brl(v)} />
```

- Max ~8 slices; group the tail into "Outros". Use `legend="bottom"` on mobile.
