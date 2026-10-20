// Dashboard (Visão geral) — desktop + mobile.
(() => {
  const { StatCard, MetricCard, RibbonChart, IconButton, Card, CardHeader, DataTable, TickerLogo, Delta, Button, WatchRow } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100Data;
  const W = window.I100Widgets;

  function MarketPreview({ go, onTrade }) {
    return (
      <Card padding={22} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CardHeader
          title="Tabela de mercado"
          actions={<>
            <IconButton icon="list-filter" label="Filtrar" variant="soft" size="sm" onClick={() => go('market', 'all')} />
            <IconButton icon="arrow-up-right" label="Abrir tabela completa" size="sm" onClick={() => go('market', 'all')} />
          </>}
        />
        <DataTable
          dense
          minWidth={560}
          rowKey="symbol"
          rows={D.stocks.slice(0, 6)}
          onRowClick={r => onTrade(r.symbol)}
          columns={[
            { key: 'symbol', label: 'Código', sortable: true, render: r => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 600 }}><TickerLogo symbol={r.symbol} size={26} />{r.symbol}</span> },
            { key: 'name', label: 'Empresa', sortable: true, render: r => <span style={{ color: 'var(--ink-600)' }}>{r.name}</span> },
            { key: 'price', label: 'Preço', align: 'right', sortable: true, render: r => D.brl(r.price) },
            { key: 'change', label: 'Var. %', align: 'right', sortable: true, render: r => <Delta value={r.change} variant="plain" size="sm" /> },
            { key: 'volume', label: 'Volume', align: 'right', sortable: true, render: r => <span style={{ color: 'var(--ink-600)' }}>{D.compact(r.volume)}</span> },
          ]}
        />
      </Card>
    );
  }

  function MoversCard({ go, onTrade }) {
    const rows = D.stocks.slice().sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 4);
    return (
      <Card padding={18} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CardHeader title="Destaques do mercado" actions={<IconButton icon="arrow-up-right" label="Abrir mercado" size="sm" onClick={() => go('market', 'all')} />} />
        <div style={{ height: 2 }} />
        {rows.map(r => <WatchRow key={r.symbol} name={r.name} symbol={r.symbol} price={D.brl(r.price)} delta={r.change} onClick={() => onTrade(r.symbol)} />)}
        <Button variant="secondary" size="lg" fullWidth iconRight="arrow-up-right" onClick={() => go('market', 'all')} style={{ marginTop: 4 }}>Ver tabela completa</Button>
      </Card>
    );
  }

  function DashboardScreen({ mobile, wide, tab, total, watch, onTrade, go }) {
    const sorted = D.stocks.slice().sort((a, b) => b.change - a.change);
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];
    const header = (
      <W.PageHeader
        title="Dashboard"
        mobile={mobile}
        actions={<>
          {mobile ? null : <IconButton icon="search" label="Buscar ativos" onClick={() => go('market', 'all')} />}
          <IconButton icon="sliders-horizontal" label="Personalizar widgets" variant="inverse" size={mobile ? 'lg' : 'md'} />
          <IconButton icon="calendar" label="Calendário" size={mobile ? 'lg' : 'md'} />
        </>}
      />
    );
    if (tab !== 'overview') {
      const labels = { performance: 'Desempenho', allocation: 'Alocação', insights: 'Insights', reports: 'Relatórios' };
      return <div>{header}<W.EmptyArea title={labels[tab] || tab} mobile={mobile} /></div>;
    }
    const kpis = [
      <StatCard key="g" variant="accent" label="Maior alta" name={top.name} symbol={top.symbol} meta="2.340 Volume" value={D.brl(585235.52)} caption="Sentimento e desempenho geral do mercado." delta={top.change} onClick={() => onTrade(top.symbol)} />,
      <StatCard key="l" label="Maior baixa" name={bottom.name} symbol={bottom.symbol} meta="2.340 Volume" value={D.brl(1235525.22)} caption="Sentimento e desempenho geral do mercado." delta={bottom.change} onClick={() => onTrade(bottom.symbol)} />,
      <MetricCard key="i" label="Ibovespa" value={D.ibov.value} caption="Sentimento e desempenho geral do mercado." action="arrow-up-right" actionLabel="Abrir mercado" onAction={() => go('market', 'all')}>
        <RibbonChart upper={D.ibov.upper} lower={D.ibov.lower} highlight={4} label="8,65%" height={mobile ? 72 : 84} />
      </MetricCard>,
    ];
    if (mobile) {
      return (
        <div>
          {header}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <W.Scroller mobile>{kpis}</W.Scroller>
            <W.PortfolioValueCard mobile total={total} />
            <W.MarketSnapshotCard />
            <W.WatchlistCard symbols={watch} onOpen={onTrade} onAdd={() => go('market', 'all')} />
            <MoversCard go={go} onTrade={onTrade} />
          </div>
        </div>
      );
    }
    return (
      <div>
        {header}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <W.Scroller>{kpis}</W.Scroller>
          <div style={{ display: 'grid', gridTemplateColumns: wide ? 'minmax(0,2fr) minmax(320px,1fr)' : 'minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
              <W.PortfolioValueCard total={total} />
              {wide ? <MarketPreview go={go} onTrade={onTrade} /> : null}
            </div>
            <div style={{ display: wide ? 'flex' : 'grid', flexDirection: 'column', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
              <W.MarketSnapshotCard />
              <W.WatchlistCard symbols={watch} onOpen={onTrade} onAdd={() => go('market', 'all')} />
            </div>
            {wide ? null : <MarketPreview go={go} onTrade={onTrade} />}
          </div>
        </div>
      </div>
    );
  }

  window.I100DashboardScreen = DashboardScreen;
})();
