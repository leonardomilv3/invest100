Labelled text/money input for forms and dialogs (Adicionar lançamento).

```jsx
<TextField label="Descrição" placeholder="Ex.: Supermercado" value={desc} onChange={setDesc} />
<TextField label="Valor" prefix="R$" inputMode="decimal" value={valor} onChange={setValor} />
<TextField label="Outros custos" optional prefix="R$" value="0,00" />
<TextField label="Data" icon="calendar" type="date" />
```

- Use `size="lg"` on mobile. Pair two fields per row on desktop (grid 1fr 1fr, gap 16).
