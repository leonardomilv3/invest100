// Visão geral da carteira — balance, actions, performance, holdings, transactions.
(() => {
  const { MetricCard, Card, CardHeader, AreaChart, RangeToggle, PositionRow, AssetCard, SegmentedControl, TransactionRow, Button, IconButton } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100Data;
  const W = window.I100Widgets;

  function PortfolioScreen({ mobile, wide, total, txs, onTrade, onCash }) {
    const [range, setRange] = React.useState('1A');
    const [cls, setCls] = React.useState('Ações');
    const [showAll, setShowAll] = React.useState(false);
    const series = React.useMemo(() => D.makeSeries(W.RANGES.indexOf(range) * 11 + 5, mobile ? 40 : 60), [range, mobile]);
    const peak = series.indexOf(Math.max.apply(null, series));
    const actions = (
      <div style={{ display: mobile ? 'grid' : 'flex', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, width: mobile ? '100%' : 'auto' }}>
        <Button iconLeft={mobile ? undefined : 'plus'} size={mobile ? 'lg' : 'md'} onClick={() => onCash('deposit')} style={mobile ? { padding: 0 } : null}>Depositar</Button>
        <Button variant="secondary" iconLeft={mobile ? undefined : 'minus'} size={mobile ? 'lg' : 'md'} onClick={() => onCash('withdraw')} style={mobile ? { padding: 0 } : null}>Sacar</Button>
        <Button variant="secondary" iconLeft={mobile ? undefined : 'arrow-up-right'} size={mobile ? 'lg' : 'md'} onClick={() => onCash('transfer')} style={mobile ? { padding: 0 } : null}>Transferir</Button>
      </div>
    );
    const kpis = (
      <W.Scroller mobile={mobile} min={260}>
        <MetricCard emphasis="label" label="Melhor desempenho" value="PRIO3" caption="PRIO S.A." delta={4.05} />
        <MetricCard emphasis="label" label="Margem de lucro/prejuízo" value="+R$ 1.320,45" caption="Resultado no mês" delta={0.21} />
        <MetricCard emphasis="label" label="Pior desempenho" value="MGLU3" caption="Magazine Luiza" delta={-3.41} />
      </W.Scroller>
    );
    const perf = (
      <Card padding={mobile ? 18 : 22} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <CardHeader title="Desempenho da carteira" actions={mobile ? null : <RangeToggle value={range} onChange={setRange} size="sm" />} />
        {mobile ? <RangeToggle value={range} onChange={setRange} size="lg" style={{ marginTop: 6 }} /> : null}
        <AreaChart
          data={series}
          highlight={peak}
          labels={mobile ? ['Jan', 'Mar', 'Mai', 'Jul', 'Ago'] : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago']}
          yTicks={mobile ? [] : ['R$ 12,5 mil', 'R$ 12,0 mil', 'R$ 11,5 mil', 'R$ 11,0 mil', 'R$ 10,5 mil']}
          tooltip={(i, v) => '+' + D.fmt(v * 2, 2) + '%'}
          height={mobile ? 190 : 270}
        />
      </Card>
    );
    const recent = (
      <Card padding={mobile ? 18 : 22} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <CardHeader title="Adicionados recentemente" size={mobile ? 'md' : 'sm'} />
        <div style={{ height: 6 }} />
        {D.recent.slice(0, mobile && !showAll ? 3 : 6).map(r => <PositionRow key={r.symbol} symbol={r.symbol} company={r.company} value={D.brl(r.value)} onAction={() => onTrade(r.symbol, 'Vender')} />)}
        {mobile ? <Button variant="ghost" size="lg" fullWidth onClick={() => setShowAll(!showAll)}>{showAll ? 'Mostrar menos' : 'Mostrar todos'}</Button> : null}
      </Card>
    );
    const holdings = (
      <Card padding={mobile ? 16 : 22} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: mobile ? 'stretch' : 'center', flexDirection: mobile ? 'column' : 'row', gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em' }}>Posições</div>
          <SegmentedControl options={W.CLASSES} value={cls} onChange={setCls} size="sm" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: 12 }}>
          {D.holdings[cls].map(h => <AssetCard key={h.symbol} name={h.name} symbol={h.symbol} value={D.brl(h.value)} delta={h.change} onClick={D.stock(h.symbol) ? () => onTrade(h.symbol) : undefined} />)}
        </div>
      </Card>
    );
    const transactions = (
      <Card padding={mobile ? 18 : 22} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <CardHeader title="Transações" size={mobile ? 'md' : 'sm'} actions={<IconButton icon="arrow-up-right" label="Ver extrato" size="sm" />} />
        <div style={{ height: 4 }} />
        {txs.slice(0, 6).map(t => (
          <TransactionRow
            key={t.id}
            side={t.side}
            symbol={t.symbol}
            date={t.date}
            price={D.brl(t.price)}
            shares={t.qty + ' cotas'}
            amount={D.signedBrl(t.side === 'buy' ? t.price * t.qty : -t.price * t.qty)}
            style={mobile ? { gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr) auto' } : undefined}
          />
        ))}
      </Card>
    );

    const head = (
      <W.PageHeader title="Visão geral da carteira" mobile={mobile} actions={mobile ? null : actions}>
        <div style={{ fontSize: 14, color: 'var(--ink-600)', marginTop: mobile ? 14 : 18 }}>Patrimônio total</div>
        <div style={{ marginTop: 8 }}><W.Money value={total} size={mobile ? 38 : 48} /></div>
      </W.PageHeader>
    );

    if (mobile) {
      return (
        <div>
          {head}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {actions}
            {kpis}
            {perf}
            {recent}
            {holdings}
            {transactions}
          </div>
        </div>
      );
    }
    return (
      <div>
        {head}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {kpis}
          <div style={{ display: 'grid', gridTemplateColumns: wide ? 'minmax(0,2fr) minmax(320px,1fr)' : 'minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
            {perf}
            {recent}
            {holdings}
            {transactions}
          </div>
        </div>
      </div>
    );
  }

  window.I100PortfolioScreen = PortfolioScreen;
})();
