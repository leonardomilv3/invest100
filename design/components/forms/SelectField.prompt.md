Boxed dropdown for forms and card-header filters.

```jsx
<SelectField label="Categoria" options={[{ value: 'alimentacao', label: 'Alimentação' }]} value={cat} onChange={setCat} />
<SelectField size="sm" icon="calendar" options={['Últimos 12 meses', 'Este ano', 'Tudo']} style={{ width: 190 }} />
```

- Use `Select` (plain/pill popover) for table toolbars; SelectField inside forms and card headers.
