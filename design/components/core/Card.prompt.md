Base rounded surface for every widget — tonal (grey on grey) rather than shadowed.

```jsx
<Card>…widget…</Card>
<Card variant="accent">…the single hero KPI…</Card>
<Card variant="raised" padding={14} radius="var(--radius-lg)">…nested row…</Card>
```

- Max ONE `accent` (lime) card per view.
- Nest `raised` (white) inside `default` (grey) — never grey in grey.
- Radius 24 for widgets, 20 for nested items, 14 for small tiles.
