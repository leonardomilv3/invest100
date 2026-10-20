Mobile floating tab bar (≤900px) mirroring the desktop SideRail — pin it 16px above the safe area.

```jsx
<div style={{ position: 'fixed', left: 16, right: 16, bottom: 16 }}>
  <BottomNav items={[{ id: 'dash', icon: 'layout-grid', label: 'Início' }, { id: 'market', icon: 'chart-column', label: 'Mercado' }]} value={area} onChange={setArea} />
</div>
```

- Max 5 items; put overflow (Relatórios, Configurações) behind a "Mais" item.
- Add bottom padding ≈ 100px to the scroll container so content clears the bar.
