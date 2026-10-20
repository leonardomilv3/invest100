Modal for focused tasks — Adicionar lançamento, editar meta, pagar fatura. Bottom sheet on mobile.

```jsx
<Dialog title="Adicionar lançamento" onClose={close} sheet={isMobile}
  footer={<><Button variant="ghost" onClick={close}>Cancelar</Button><Button onClick={save}>Salvar lançamento</Button></>}>
  <SegmentedControl fullWidth size="lg" options={['Despesa', 'Receita', 'Investimento']} />
  …TextField / SelectField grid…
</Dialog>
```
