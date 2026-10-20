Pill-shaped action button — use for page actions (Depositar, Sacar), row actions (Vender) and form submits.

```jsx
<Button variant="primary" iconLeft="plus">Depositar</Button>
<Button variant="secondary" iconLeft="minus">Sacar</Button>
<Button variant="soft" size="sm">Vender</Button>
```

- `primary` (black) is the one main action per view; `secondary` (white) for siblings; `soft` for repeated row actions.
- `accent` (lime) is reserved — lime is the highlight colour, not a default CTA.
- Use `size="lg"` (48px) on mobile to clear the 44px hit target.
