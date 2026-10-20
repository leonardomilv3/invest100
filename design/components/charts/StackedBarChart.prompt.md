Stacked monthly columns that handle negative values — patrimônio, gastos por categoria, faturas futuras.

```jsx
<StackedBarChart
  series={[{ label: 'Valor aplicado', color: 'var(--ink-800)' }, { label: 'Ganho de capital', color: 'var(--lime-300)' }]}
  data={[{ label: '10/25', values: [19800, 420] }, { label: '11/25', values: [21100, -1600] }]}
/>
```

- Ink + lime for 2 series; CATEGORY_META colours for categories; keep ≤5 series.
