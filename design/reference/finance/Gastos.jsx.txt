// Gastos — monthly budget by category, spending charts, transaction list with filters.
(() => {
  const { IconButton, Button, Badge, SegmentedControl, SelectField, SearchInput, DataTable, CategoryIcon, CATEGORY_META, BudgetRow, DonutChart, StackedBarChart } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100F;
  const P = window.I100P;
  const R = window.I100Resumo;
  const STACK = [['moradia', 'Moradia'], ['alimentacao', 'Alimentação'], ['transporte', 'Transporte'], ['lazer', 'Lazer']];

  function Amount({ v }) {
    return <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: v >= 0 ? 'var(--text-positive)' : 'var(--ink-900)', whiteSpace: 'nowrap' }}>{D.signed(v)}</span>;
  }

  function Gastos({ mobile, wide, txs, onAdd }) {
    const [mi, setMi] = React.useState(2);
    const [kind, setKind] = React.useState('Todos');
    const [cat, setCat] = React.useState('all');
    const [q, setQ] = React.useState('');
    const month = D.months[mi];
    const m = R.monthStats(txs, month.id);
    const budgetTotal = Object.values(D.budgets).reduce((s, v) => s + v, 0);
    const used = m.spend / budgetTotal;
    const budgets = Object.entries(D.budgets).map(([k, limit]) => ({ k, limit, spent: m.byCat[k] || 0, n: m.list.filter(t => t.category === k).length }));
    const hist = D.spendingPast.map(p => ({ label: p[0], values: p[1] })).concat(D.months.map(mo => {
      const s = R.monthStats(txs, mo.id);
      const main = STACK.map(c => +(s.byCat[c[0]] || 0).toFixed(2));
      return { label: mo.short, values: main.concat([+(s.spend - main.reduce((a, b) => a + b, 0)).toFixed(2)]) };
    }));
    const query = q.trim().toLowerCase();
    const rows = m.list.filter(t => t.category !== 'investimentos' || kind === 'Todos')
      .filter(t => kind === 'Todos' || (kind === 'Despesas' ? t.amount < 0 : t.amount > 0))
      .filter(t => cat === 'all' || t.category === cat)
      .filter(t => !query || t.desc.toLowerCase().includes(query) || (D.methods[t.method] || '').toLowerCase().includes(query))
      .sort((a, b) => b.date.localeCompare(a.date));
    const catOpts = [{ value: 'all', label: 'Todas as categorias' }].concat(Object.keys(CATEGORY_META).map(k => ({ value: k, label: CATEGORY_META[k].label })));

    const switcher = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--white)', border: '1px solid var(--border-card)', borderRadius: 999, padding: 4 }}>
        <IconButton icon="chevron-left" label="Mês anterior" variant="ghost" size="sm" disabled={mi === 0} onClick={() => setMi(mi - 1)} />
        <span style={{ fontSize: 14, fontWeight: 600, minWidth: 128, textAlign: 'center' }}>{month.label}</span>
        <IconButton icon="chevron-right" label="Próximo mês" variant="ghost" size="sm" disabled={mi === D.months.length - 1} onClick={() => setMi(mi + 1)} />
      </div>
    );
    const list = mobile ? (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <CategoryIcon category={t.category} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.desc}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-400)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.date} · {D.methods[t.method] || t.method}{t.inst ? ' · ' + t.inst : ''}</div>
            </div>
            <Amount v={t.amount} />
          </div>
        ))}
      </div>
    ) : (
      <DataTable rows={rows} minWidth={820} empty="Nenhum lançamento com esses filtros." columns={[
        { key: 'date', label: 'Data', sortable: true, width: 80, render: t => <span style={{ color: 'var(--ink-600)' }}>{t.date}</span> },
        { key: 'desc', label: 'Descrição', sortable: true, render: t => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><CategoryIcon category={t.category} size={30} /><span style={{ fontWeight: 500 }}>{t.desc}</span></span> },
        { key: 'category', label: 'Categoria', sortable: true, render: t => <Badge tone="neutral" size="sm">{(CATEGORY_META[t.category] || CATEGORY_META.outros).label}</Badge> },
        { key: 'method', label: 'Pagamento', render: t => <span style={{ color: 'var(--ink-600)' }}>{D.methods[t.method] || t.method}</span> },
        { key: 'inst', label: 'Parcela', align: 'center', render: t => t.inst ? <Badge tone="white" size="sm" style={{ border: '1px solid var(--border-card)' }}>{t.inst}</Badge> : <span style={{ color: 'var(--ink-300)' }}>—</span> },
        { key: 'amount', label: 'Valor', align: 'right', sortable: true, render: t => <Amount v={t.amount} /> },
      ]} />
    );

    return (
      <div>
        <P.PageTitle title="Gastos" mobile={mobile} actions={mobile ? switcher : <>{switcher}<Button iconLeft="plus" size="sm" onClick={() => onAdd({ type: 'Despesa' })}>Nova despesa</Button></>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <P.Grid mobile={mobile} min={mobile ? 250 : 220} cols={wide ? 'repeat(4,minmax(0,1fr))' : undefined}>
            <P.Kpi icon="arrow-down-left" title="Receitas"><P.Big color="var(--text-positive)">{D.brl(m.income)}</P.Big></P.Kpi>
            <P.Kpi icon="arrow-up-right" title="Despesas"><P.Big>{D.brl(m.spend)}</P.Big></P.Kpi>
            <P.Kpi icon="piggy-bank" title="Saldo do mês"><P.Big color={m.balance >= 0 ? 'var(--text-positive)' : 'var(--text-negative)'}>{D.signed(m.balance)}</P.Big></P.Kpi>
            <P.Kpi icon="target" title="Orçamento usado">
              <P.Big after={<Badge tone={used > 1 ? 'negative' : used > 0.85 ? 'warning' : 'accent'} size="sm">{D.fmt(used * 100, 0)}%</Badge>}>{D.brl(budgetTotal - m.spend)}</P.Big>
              <div style={{ height: 8, borderRadius: 999, background: 'var(--ink-100)', overflow: 'hidden' }}><div style={{ width: Math.min(100, used * 100) + '%', height: '100%', borderRadius: 999, background: used > 1 ? 'var(--red-500)' : 'var(--lime-400)' }} /></div>
            </P.Kpi>
          </P.Grid>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'minmax(0,1fr)' : wide ? 'minmax(0,1.7fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: 16 }}>
            <P.Panel title="Orçamento por categoria" sub={'Limite total ' + D.brl(budgetTotal)} actions={mobile ? null : <Button variant="secondary" size="sm" iconLeft="pencil">Editar limites</Button>}>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', columnGap: 28 }}>
                {budgets.map(b => <BudgetRow key={b.k} category={b.k} spent={b.spent} limit={b.limit} caption={b.n + (b.n === 1 ? ' lançamento' : ' lançamentos')} onClick={() => setCat(b.k)} style={{ borderBottom: '1px solid var(--border-subtle)' }} />)}
              </div>
            </P.Panel>
            <P.Panel title="Distribuição" sub={month.label}>
              <DonutChart size={mobile ? 180 : 196} legend="bottom" centerLabel="Gasto no mês" centerValue={D.brl(m.spend).replace(/,\d\d$/, '')} format={v => D.brl(v)} data={R.donutData(m.byCat)} />
            </P.Panel>
          </div>
          <P.Panel title="Gastos por mês" sub="Últimos 6 meses por categoria">
            <StackedBarChart height={mobile ? 220 : 260} highlight={3 + mi} series={STACK.map(c => ({ label: c[1], color: CATEGORY_META[c[0]].color })).concat([{ label: 'Outros', color: 'var(--cat-stone)' }])} data={hist} />
          </P.Panel>
          <P.Panel title="Lançamentos" sub={rows.length + ' em ' + month.label.toLowerCase()} padding={mobile ? 16 : 20}
            actions={<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', width: mobile ? '100%' : 'auto' }}>
              <SegmentedControl size="sm" options={['Todos', 'Despesas', 'Receitas']} value={kind} onChange={setKind} />
              <SelectField size="sm" options={catOpts} value={cat} onChange={setCat} style={{ width: mobile ? '100%' : 200 }} />
              <SearchInput size="sm" value={q} onChange={setQ} placeholder="Buscar lançamento" fullWidth={mobile} style={mobile ? null : { width: 220 }} />
            </div>}>
            {list}
          </P.Panel>
        </div>
      </div>
    );
  }

  window.I100Gastos = Gastos;
})();
