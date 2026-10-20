Circular icon-only button — toolbar actions (buscar, filtros, calendário), card-header actions (filtro, adicionar, abrir ↗) and the notifications bell.

```jsx
<IconButton icon="search" label="Buscar" />
<IconButton icon="sliders-horizontal" label="Filtros" variant="inverse" />
<IconButton icon="list-filter" label="Filtrar" variant="soft" size="sm" />
<IconButton icon="bell" label="Notificações" badge />
```

- Toolbar clusters: raised + one inverse (the active/primary one), 8px gap.
- `active` flips any variant to black for toggle groups.
