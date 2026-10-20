Sortable data table for markets, positions and orders — airy rows, tiny grey headers.

```jsx
<DataTable
  rows={stocks}
  defaultSort={{ key: 'change', dir: 'desc' }}
  columns={[
    { key: 'symbol', label: 'Código', sortable: true, render: r => <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><TickerLogo symbol={r.symbol} size={24} />{r.symbol}</span> },
    { key: 'price', label: 'Preço', align: 'right', sortable: true, render: r => fmtBRL(r.price) },
    { key: 'change', label: 'Var. %', align: 'right', sortable: true, render: r => <Delta value={r.change} variant="plain" size="sm" /> },
  ]}
/>
```

- On mobile (<640px) prefer a list of `WatchRow`s + a filter sheet over a horizontally scrolling table.
- The reference tints the Day-High column orange; we recommend colouring only signed changes (Var. %, P&L) so red always means "down".
