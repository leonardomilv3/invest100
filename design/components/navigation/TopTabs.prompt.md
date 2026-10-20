Primary section navigation for the finance app (Resumo · Investimentos · Gastos · Cartões…) — icon + label with ink underline.

```jsx
<TopTabs items={[{ id: 'resumo', icon: 'layout-grid', label: 'Resumo' }, { id: 'gastos', icon: 'receipt', label: 'Gastos' }]} value={tab} onChange={setTab} />
```

- Sits in a white band under the header, with page actions on the right.
- Use NavTabs (black pill) for the v1 dashboard; TopTabs when there are 6+ sections.
