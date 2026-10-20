Performance-over-time chart with dot-matrix fill, dashed crosshair and pill tooltip.

```jsx
<AreaChart
  data={series}
  labels={['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago']}
  yTicks={['R$ 12,5 mil','R$ 12,0 mil','R$ 11,5 mil','R$ 11,0 mil']}
  highlight={38}
  tooltip={(i, v) => '+104,45%'}
/>
```

- Use `color="var(--chart-negative)"` for a losing series; never fill solid.
