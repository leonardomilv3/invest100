Chart time-range selector — white discs, lime when active. Sits top-right of chart cards.

```jsx
<RangeToggle value={range} onChange={setRange} />
<RangeToggle size="lg" options={['1D','1S','1M','1A','5A','Máx']} />
```

- Lime here is a "you are here" highlight; keep it the only lime in the card header.
