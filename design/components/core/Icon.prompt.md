Thin-stroke line icon (Lucide, 1.6 stroke) — use for every glyph in the UI; never emoji or unicode symbols.

```jsx
<Icon name="bell" size={18} />
<Icon name="trending-up" size={14} color="var(--text-positive)" />
<Icon name="play" size={10} fill="var(--green-500)" color="var(--green-500)" />
```

- Sizes: 15 (sm controls), 18 (default), 20 (lg / mobile tab bar).
- Colors: inherit `currentColor`; pass `var(--text-positive)` / `var(--text-negative)` for market direction.
- Names: see `iconNames` export or `assets/icons/*.svg`.
