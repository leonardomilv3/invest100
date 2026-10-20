// Tabela de mercado — filters, search, sort, watch toggle, quick trade.
(() => {
  const { MetricCard, Card, DataTable, TickerLogo, Delta, Button, IconButton, SearchInput, Select, WatchRow, Icon } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100Data;
  const W = window.I100Widgets;

  const SECTORS = ['Todos', 'Energia', 'Financeiro', 'Mineração', 'Industrial', 'Consumo', 'Varejo', 'Materiais'];
  const PRICE = ['Todas', 'Até R$ 20', 'R$ 20–40', 'Acima de R$ 40'];
  const CAP = ['Todos', 'Até R$ 50 bi', 'R$ 50–200 bi', 'Acima de R$ 200 bi'];
  const PERF = ['Todos', 'Em alta', 'Em baixa'];
  const SORT = ['Maior variação', 'Menor variação', 'Maior volume', 'A–Z'];
  const TITLES = { all: 'Tabela de mercado', gainers: 'Maiores altas', losers: 'Maiores baixas', watch: 'Lista de observação' };

  function inRange(v, opt, list, edges) {
    const i = list.indexOf(opt);
    if (i <= 0) return true;
    const lo = edges[i - 1], hi = edges[i];
    return v >= lo && v < hi;
  }

  function MarketScreen({ mobile, tab, watch, toggleWatch, onTrade }) {
    const [q, setQ] = React.useState('');
    const [sector, setSector] = React.useState('Todos');
    const [price, setPrice] = React.useState('Todas');
    const [cap, setCap] = React.useState('Todos');
    const [perf, setPerf] = React.useState('Todos');
    const [sort, setSort] = React.useState('Maior variação');
    const query = q.trim().toLowerCase();
    let rows = D.stocks.filter(s =>
      (!query || s.symbol.toLowerCase().includes(query) || s.name.toLowerCase().includes(query)) &&
      (sector === 'Todos' || s.sector === sector) &&
      inRange(s.price, price, PRICE, [0, 20, 40, Infinity]) &&
      inRange(s.cap, cap, CAP, [0, 50e9, 200e9, Infinity]) &&
      (perf === 'Todos' || (perf === 'Em alta' ? s.change >= 0 : s.change < 0)) &&
      (tab === 'gainers' ? s.change > 0 : tab === 'losers' ? s.change < 0 : tab === 'watch' ? watch.includes(s.symbol) : true)
    );
    if (tab === 'gainers') rows = rows.sort((a, b) => b.change - a.change);
    if (tab === 'losers') rows = rows.sort((a, b) => a.change - b.change);
    const filtered = q || sector !== 'Todos' || price !== 'Todas' || cap !== 'Todos' || perf !== 'Todos';
    const clear = () => { setQ(''); setSector('Todos'); setPrice('Todas'); setCap('Todos'); setPerf('Todos'); };

    const summary = (
      <W.Scroller mobile={mobile} min={270}>
        <MetricCard variant="accent" emphasis="label" label="Ações em aberto" value="R$ 224.901,12" caption="Total em ações abertas" delta={2.15} />
        <MetricCard emphasis="label" label="Valor de mercado" value="R$ 3,53 tri" unit="BRL" caption="Valor de mercado total" delta={1.87} />
        <MetricCard emphasis="label" label="Volume total" value="69,1 mi" caption="Volume total negociado" delta={-0.45} />
      </W.Scroller>
    );

    if (mobile) {
      let list = rows.slice();
      if (tab === 'all' || tab === 'watch') {
        if (sort === 'Maior variação') list.sort((a, b) => b.change - a.change);
        if (sort === 'Menor variação') list.sort((a, b) => a.change - b.change);
        if (sort === 'Maior volume') list.sort((a, b) => b.volume - a.volume);
        if (sort === 'A–Z') list.sort((a, b) => a.symbol.localeCompare(b.symbol));
      }
      return (
        <div>
          <W.PageHeader title={TITLES[tab] || 'Mercado'} mobile />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {summary}
            <SearchInput value={q} onChange={setQ} size="lg" fullWidth />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative', zIndex: 5 }}>
              <Select variant="pill" size="sm" placeholder="Setor" options={SECTORS.map(s => ({ value: s, label: s === 'Todos' ? 'Todos os setores' : s }))} onChange={setSector} />
              <Select variant="pill" size="sm" placeholder="Desempenho" options={PERF} onChange={setPerf} />
              <Select variant="pill" size="sm" value={sort} options={SORT} onChange={setSort} />
              <Select variant="pill" size="sm" placeholder="Preço" options={PRICE} onChange={setPrice} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--ink-500)', padding: '2px 4px' }}>
              <span>{list.length} ativos</span>
              {filtered ? <Button variant="ghost" size="sm" onClick={clear}>Limpar filtros</Button> : null}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {list.map(s => <WatchRow key={s.symbol} name={s.name} symbol={s.symbol} price={D.brl(s.price)} delta={s.change} onClick={() => onTrade(s.symbol)} />)}
              {list.length === 0 ? <Card padding={24} style={{ textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>Nenhum ativo encontrado.</Card> : null}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <W.PageHeader title={TITLES[tab] || 'Tabela de mercado'} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {summary}
          <Card padding={20} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SearchInput value={q} onChange={setQ} style={{ width: 320 }} shortcut="/" />
                <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>{rows.length} ativos</span>
                {filtered ? <Button variant="ghost" size="sm" iconLeft="x" onClick={clear}>Limpar</Button> : null}
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <Select placeholder="Setor" options={SECTORS.map(s => ({ value: s, label: s === 'Todos' ? 'Todos os setores' : s }))} onChange={setSector} align="right" />
                <Select placeholder="Valor de mercado" options={CAP} onChange={setCap} align="right" />
                <Select placeholder="Faixa de preço" options={PRICE} onChange={setPrice} align="right" />
                <Select placeholder="Desempenho" options={PERF} onChange={setPerf} align="right" />
              </div>
            </div>
            <DataTable
              rowKey="symbol"
              rows={rows}
              minWidth={980}
              defaultSort={tab === 'all' || tab === 'watch' ? { key: 'cap', dir: 'desc' } : undefined}
              onRowClick={r => onTrade(r.symbol)}
              empty="Nenhum ativo encontrado com esses filtros."
              columns={[
                { key: 'watch', label: '', width: 44, render: r => {
                  const on = watch.includes(r.symbol);
                  return <IconButton icon="star" label={on ? 'Remover da observação' : 'Observar'} size="sm" variant={on ? 'accent' : 'ghost'} onClick={e => { e.stopPropagation(); toggleWatch(r.symbol); }} />;
                } },
                { key: 'symbol', label: 'Código', sortable: true, render: r => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 600 }}><TickerLogo symbol={r.symbol} size={28} />{r.symbol}</span> },
                { key: 'name', label: 'Empresa', sortable: true, render: r => <span style={{ color: 'var(--ink-600)' }}>{r.name}</span> },
                { key: 'change', label: 'Var. %', align: 'right', sortable: true, render: r => <Delta value={r.change} variant="plain" size="sm" /> },
                { key: 'price', label: 'Preço', align: 'right', sortable: true, render: r => D.brl(r.price) },
                { key: 'high', label: 'Máx. dia', align: 'right', sortable: true, render: r => <span style={{ color: 'var(--ink-600)' }}>{D.brl(r.high)}</span> },
                { key: 'low', label: 'Mín. dia', align: 'right', sortable: true, render: r => <span style={{ color: 'var(--ink-600)' }}>{D.brl(r.low)}</span> },
                { key: 'cap', label: 'Valor de mercado', align: 'right', sortable: true, render: r => 'R$ ' + D.compact(r.cap) },
                { key: 'volume', label: 'Volume', align: 'right', sortable: true, render: r => <span style={{ color: 'var(--ink-600)' }}>{D.compact(r.volume)}</span> },
                { key: 'trade', label: '', align: 'right', render: r => <Button variant="soft" size="sm" onClick={e => { e.stopPropagation(); onTrade(r.symbol); }}>Negociar</Button> },
              ]}
            />
          </Card>
        </div>
      </div>
    );
  }

  window.I100MarketScreen = MarketScreen;
})();
