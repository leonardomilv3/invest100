Primary page navigation in the top bar — text tabs, active = black pill.

```jsx
<NavTabs
  items={[{ id: 'overview', label: 'Visão geral' }, { id: 'perf', label: 'Desempenho' }, { id: 'alloc', label: 'Alocação' }]}
  value={tab} onChange={setTab}
/>
```

- 4–6 items. On mobile use `size="sm" scrollable` under the header.
- For in-card filters (Ações / Renda fixa…) use `SegmentedControl`, not NavTabs.
