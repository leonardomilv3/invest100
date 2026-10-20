Signed change indicator (green up / red down + trend arrow) — every price variation in cards, rows and tables.

```jsx
<Delta value={2.15} />                          // +2,15% ↗ white pill
<Delta value={-3.41} variant="soft" />          // tinted
<Delta value={-0.24} variant="plain" size="sm" />
<Delta value={4525.82} prefix="R$ " suffix="" variant="plain" showIcon={false} />
```

- `pill` sits bottom-right of KPI cards; `plain` inside rows/tables.
- `xl` is the hero "+3,41 ↗" editorial figure.
- Formats with pt-BR separators by default.
