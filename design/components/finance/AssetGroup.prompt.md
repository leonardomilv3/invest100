Collapsible section per asset class on "Investimentos" / "Meus ativos".

```jsx
<AssetGroup icon="building-2" title="FIIs" count={4}
  metrics={[{ label: 'Valor total', value: 'R$ 4.361,20' }, { label: 'Variação', value: <Delta value={5.25} variant="plain" size="sm" /> }, { label: '% na carteira', value: '18%' }]}
  footer={<><Button variant="ghost" size="sm" iconRight="arrow-up-right">Lançamentos</Button><Button size="sm" iconLeft="plus">Adicionar lançamento</Button></>}>
  <DataTable … />
</AssetGroup>
```
