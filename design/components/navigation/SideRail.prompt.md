Desktop vertical icon navigation between product areas (Dashboard, Mercado, Carteira…).

```jsx
<SideRail
  items={[{ id: 'dash', icon: 'layout-grid', label: 'Dashboard' }, { id: 'market', icon: 'chart-column', label: 'Mercado' }]}
  footerItems={[{ id: 'settings', icon: 'settings', label: 'Configurações' }]}
  value={area} onChange={setArea}
/>
```

- 5–8 items max; always provide `label` (tooltip + aria).
- Below 900px swap for `BottomNav` with the same items.
