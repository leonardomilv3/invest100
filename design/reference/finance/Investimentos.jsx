// Investimentos — positions grouped by asset class (+ helpers reused by Resumo).
(() => {
  const { AssetGroup, DataTable, TickerLogo, Delta, Badge, Button, IconButton, DonutChart, StackedBarChart, Icon } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100F;
  const P = window.I100P;
  const CLASS_COLORS = { acoes: 'var(--ink-900)', fiis: 'var(--lime-300)', rf: 'var(--cat-teal)' };

  function summarize(invest) {
    const groups = invest.map(g => {
      const rows = g.rows.map(r => ({ ...r, value: r.qty * r.price, invested: r.qty * r.pm, rent: (r.price / r.pm - 1) * 100 }));
      const total = rows.reduce((s, r) => s + r.value, 0);
      const invested = rows.reduce((s, r) => s + r.invested, 0);
      const day = total ? rows.reduce((s, r) => s + r.day * r.value, 0) / total : 0;
      return { ...g, rows, total, invested, day, rent: invested ? (total / invested - 1) * 100 : 0 };
    });
    const total = groups.reduce((s, g) => s + g.total, 0);
    const invested = groups.reduce((s, g) => s + g.invested, 0);
    groups.forEach(g => { g.share = total ? (g.total / total) * 100 : 0; g.rows.forEach(r => { r.share = total ? (r.value / total) * 100 : 0; }); });
    const all = groups.flatMap(g => g.rows);
    const day = total ? groups.reduce((s, g) => s + g.day * g.total, 0) / total : 0;
    return { groups, total, invested, day, gain: total - invested, rent: invested ? (total / invested - 1) * 100 : 0, all };
  }

  function metricsFor(g) {
    return [
      { label: 'Ativos', value: String(g.rows.length) },
      { label: 'Valor total', value: D.brl(g.total) },
      { label: 'Variação', value: <Delta value={g.day} variant="plain" size="sm" /> },
      { label: 'Rentabilidade', value: <Delta value={g.rent} variant="soft" size="sm" /> },
      { label: '% na carteira', value: D.fmt(g.share, 0) + '% / ' + g.ideal + '%' },
    ];
  }

  function PositionsBody({ g, mobile, onTrade }) {
    if (mobile) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {g.rows.map(r => (
            <div key={r.symbol} onClick={() => onTrade(g.id, r.symbol)} role="button" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
              <TickerLogo symbol={r.symbol} size={36} shape="square" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.symbol}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-400)', marginTop: 2 }}>{g.fixed ? r.index : r.qty + ' cotas · PM ' + D.brl(r.pm)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{D.brl(r.value)}</div>
                <Delta value={r.rent} variant="plain" size="sm" style={{ marginTop: 3 }} />
              </div>
            </div>
          ))}
        </div>
      );
    }
    const asset = { key: 'symbol', label: 'Ativo', sortable: true, render: r => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <TickerLogo symbol={r.symbol} size={32} shape="square" />
        <span><span style={{ display: 'block', fontWeight: 600 }}>{r.symbol}</span><span style={{ display: 'block', fontSize: 11, color: 'var(--ink-400)', marginTop: 2 }}>{r.name}</span></span>
      </span>
    ) };
    const tail = [
      { key: 'rent', label: 'Rentabilidade', align: 'right', sortable: true, render: r => <Delta value={r.rent} variant="soft" size="sm" /> },
      { key: 'value', label: 'Saldo', align: 'right', sortable: true, render: r => <b style={{ fontWeight: 600 }}>{D.brl(r.value)}</b> },
      { key: 'share', label: '% Carteira', align: 'right', sortable: true, render: r => D.fmt(r.share) + '%' },
      { key: 'opt', label: '', align: 'right', render: r => <IconButton icon="ellipsis" label="Opções" variant="ghost" size="sm" onClick={e => { e.stopPropagation(); onTrade(g.id, r.symbol); }} /> },
    ];
    const cols = g.fixed
      ? [asset, { key: 'index', label: 'Indexador', render: r => <Badge tone="neutral" size="sm">{r.index}</Badge> }, { key: 'invested', label: 'Aplicado', align: 'right', sortable: true, render: r => D.brl(r.invested) }].concat(tail)
      : [asset,
        { key: 'qty', label: 'Quant.', align: 'right', sortable: true },
        { key: 'pm', label: 'Preço médio', align: 'right', sortable: true, render: r => D.brl(r.pm) },
        { key: 'price', label: 'Preço atual', align: 'right', sortable: true, render: r => D.brl(r.price) },
        { key: 'day', label: 'Variação', align: 'right', sortable: true, render: r => <Delta value={r.day} variant="plain" size="sm" /> }].concat(tail);
    return <div style={{ padding: '4px 8px' }}><DataTable rows={g.rows} rowKey="symbol" columns={cols} minWidth={880} onRowClick={r => onTrade(g.id, r.symbol)} defaultSort={{ key: 'value', dir: 'desc' }} /></div>;
  }

  function Groups({ sum, mobile, onTrade, defaultOpen = true, onAdd }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sum.groups.map(g => (
          <AssetGroup key={g.id} icon={g.icon} title={g.title} defaultOpen={defaultOpen} compact={mobile} metrics={mobile ? metricsFor(g).filter(m => m.label !== 'Ativos') : metricsFor(g)}
            footer={<>
              {mobile ? null : <Button variant="ghost" size="sm" iconRight="arrow-up-right">Lançamentos</Button>}
              {mobile ? null : <Button variant="secondary" size="sm" iconLeft="chart-column">Gráficos</Button>}
              <Button size={mobile ? 'lg' : 'sm'} iconLeft="plus" fullWidth={mobile} onClick={() => onAdd({ type: 'Investimento', group: g.id })}>Adicionar lançamento</Button>
            </>}>
            <PositionsBody g={g} mobile={mobile} onTrade={onTrade} />
          </AssetGroup>
        ))}
      </div>
    );
  }

  function Investimentos({ mobile, wide, invest, onAdd }) {
    const sum = summarize(invest);
    const sorted = sum.all.slice().sort((a, b) => b.rent - a.rent);
    const best = sorted[0], worst = sorted[sorted.length - 1];
    const inProfit = sum.all.filter(r => r.rent >= 0).length;
    const provTotal = D.proventos.reduce((s, p) => s + p[1], 0);
    const onTrade = (group, symbol) => onAdd({ type: 'Investimento', group, symbol });
    return (
      <div>
        <P.PageTitle title="Investimentos" mobile={mobile} actions={mobile ? null : <Button variant="secondary" size="sm" iconLeft="sliders-horizontal">Configurar % ideal</Button>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <P.Grid mobile={mobile} min={mobile ? 280 : 250} cols={wide ? 'repeat(4,minmax(0,1fr))' : undefined}>
            <P.Kpi icon="wallet" title="Patrimônio investido">
              <P.Big after={<Delta value={sum.day} variant="plain" size="sm" />}>{D.brl(sum.total)}</P.Big>
              <P.Split items={[['Valor aplicado', D.brl(sum.invested)], ['Lucro', D.signed(sum.gain), sum.gain >= 0 ? 'var(--text-positive)' : 'var(--text-negative)']]} />
            </P.Kpi>
            <P.Kpi icon="trophy" title="Destaques da carteira">
              <P.Split items={[['Melhor posição', best.symbol.split(' ')[0]], ['Pior posição', worst.symbol.split(' ')[0]]]} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><Delta value={best.rent} variant="soft" size="sm" style={{ justifySelf: 'start' }} /><Delta value={worst.rent} variant="soft" size="sm" style={{ justifySelf: 'start' }} /></div>
            </P.Kpi>
            <P.Kpi icon="chart-bar" title="Posições no lucro">
              <P.Big after={<Badge tone="accent" size="sm">{D.fmt((inProfit / sum.all.length) * 100, 0)}%</Badge>}>{inProfit} de {sum.all.length}</P.Big>
              <div style={{ height: 8, borderRadius: 999, background: 'var(--red-50)', overflow: 'hidden' }}><div style={{ width: (inProfit / sum.all.length) * 100 + '%', height: '100%', background: 'var(--green-400)', borderRadius: 999 }} /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span style={{ color: 'var(--text-positive)' }}>{inProfit} no lucro</span><span style={{ color: 'var(--text-negative)' }}>{sum.all.length - inProfit} no prejuízo</span></div>
            </P.Kpi>
            <P.Kpi icon="coins" title="Proventos (12M)">
              <P.Big>{D.brl(provTotal)}</P.Big>
              <P.Split items={[['Média mensal', D.brl(provTotal / 12)], ['Meta mensal', D.brl(100)]]} />
            </P.Kpi>
          </P.Grid>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'minmax(0,1fr)' : wide ? 'minmax(0,1.6fr) minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
            <P.Panel title="Evolução de proventos" sub="Clique nas barras para ver o detalhe do mês" actions={mobile ? null : <Badge tone="positive">{'Total ' + D.brl(provTotal)}</Badge>}>
              <StackedBarChart height={mobile ? 200 : 240} series={[{ label: 'Proventos recebidos', color: 'var(--lime-400)' }]} data={(mobile ? D.proventos.slice(-6) : D.proventos).map(p => ({ label: p[0], values: [p[1]] }))} formatAxis={v => 'R$ ' + D.fmt(v, 0)} />
            </P.Panel>
            <P.Panel title="Ativos na carteira">
              <DonutChart size={mobile ? 170 : 180} legend={mobile ? 'bottom' : 'right'} centerLabel="Patrimônio" centerValue={D.brl(sum.total).replace(/,\d\d$/, '')} format={v => D.brl(v)}
                data={sum.groups.map(g => ({ label: g.title + ' · ideal ' + g.ideal + '%', value: g.total, color: CLASS_COLORS[g.id] }))} />
            </P.Panel>
          </div>
          <P.PageTitle title="Meus ativos" count={sum.all.length} mobile={mobile} />
          <Groups sum={sum} mobile={mobile} onTrade={onTrade} onAdd={onAdd} />
        </div>
      </div>
    );
  }

  window.I100Invest = { Investimentos, Groups, summarize, CLASS_COLORS };
})();
