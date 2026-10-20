Portfolio-value chart with frosted columns and coloured caps — the dashboard hero chart.

```jsx
<FloatingBarChart
  bars={[{ value: .7, tone: 'positive' }, { value: .4, tone: 'negative' }, /* … */]}
  labels={['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']}
  highlight={10}
  onHighlight={(i) => setSel(i)}
/>
```

- Pair with `Legend` (positive / low / negative) and a callout card showing the selected figure.
