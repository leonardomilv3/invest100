// Resumo — net worth, month balance, invoices, spending, budgets, upcoming installments, assets.
(() => {
  const { Delta, Badge, Button, SelectField, StackedBarChart, DonutChart, BudgetRow, InstallmentRow, CATEGORY_META } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100F;
  const P = window.I100P;
  const I = window.I100Invest;

  function monthStats(txs, month) {
    const list = txs.filter(t => t.month === month);
    const income = list.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const spend = -list.filter(t => t.amount < 0 && t.category !== 'investimentos').reduce((s, t) => s + t.amount, 0);
    const byCat = {};
    list.forEach(t => { if (t.amount < 0 && t.category !== 'investimentos') byCat[t.category] = (byCat[t.category] || 0) - t.amount; });
    return { list, income, spend, byCat, balance: income - spend };
  }
  function donutData(byCat) {
    const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const top = rows.slice(0, 6);
    const rest = rows.slice(6).reduce((s, r) => s + r[1], 0);
    const out = top.map(([k, v]) => ({ label: (CATEGORY_META[k] || CATEGORY_META.outros).label, value: v, color: (CATEGORY_META[k] || CATEGORY_META.outros).color }));
    if (rest > 0) out.push({ label: 'Outros', value: rest, color: 'var(--cat-stone)' });
    return out;
  }

  function Resumo({ mobile, wide, txs, cards, installments, invest, go, onAdd }) {
    const [range, setRange] = React.useState('12');
    const sum = I.summarize(invest);
    const m = monthStats(txs, '10');
    const invoices = cards.reduce((s, c) => s + c.invoice, 0);
    const evo = D.patrimonio.concat([['10/26', sum.invested, +(sum.total - sum.invested).toFixed(2)]]).slice(range === '6' ? -6 : -13);
    const budgets = Object.entries(D.budgets).map(([k, limit]) => ({ k, limit, spent: m.byCat[k] || 0 })).sort((a, b) => b.spent / b.limit - a.spent / a.limit).slice(0, 4);
    const next = installments.slice().sort((a, b) => (a.total - a.current) - (b.total - b.current)).slice(0, 4);
    const cardName = id => { const c = cards.find(x => x.id === id); return c ? '•• ' + c.last4 : ''; };
    return (
      <div>
        <P.PageTitle title="Resumo" mobile={mobile} actions={mobile ? null : <span style={{ fontSize: 13, color: 'var(--ink-500)' }}>Atualizado hoje, 14:15</span>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <P.Grid mobile={mobile} min={mobile ? 280 : 250} cols={wide ? 'repeat(4,minmax(0,1fr))' : undefined}>
            <P.Kpi icon="wallet" title="Patrimônio total" accent>
              <P.Big after={<Delta value={sum.day} variant="pill" size="sm" />}>{D.brl(sum.total)}</P.Big>
              <P.Split items={[['Valor aplicado', D.brl(sum.invested)], ['Rentabilidade', D.pct(sum.rent)]]} />
            </P.Kpi>
            <P.Kpi icon="arrow-left-right" title="Saldo de outubro">
              <P.Big color={m.balance >= 0 ? 'var(--text-positive)' : 'var(--text-negative)'}>{D.signed(m.balance)}</P.Big>
              <P.Split items={[['Receitas', D.brl(m.income)], ['Despesas', D.brl(m.spend)]]} />
            </P.Kpi>
            <P.Kpi icon="credit-card" title="Faturas dos cartões">
              <P.Big>{D.brl(invoices)}</P.Big>
              <P.Split items={[['Próximo vencimento', '05 NOV'], ['Cartões', String(cards.length)]]} />
            </P.Kpi>
            <P.Kpi icon="hand-coins" title="Proventos (12M)">
              <P.Big>{D.brl(D.proventos.reduce((s, p) => s + p[1], 0))}</P.Big>
              <P.Split items={[['Este mês', D.brl(D.proventos[11][1])], ['Média', D.brl(D.proventos.reduce((s, p) => s + p[1], 0) / 12)]]} />
            </P.Kpi>
          </P.Grid>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'minmax(0,1fr)' : wide ? 'minmax(0,1.65fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: 16 }}>
            <P.Panel title="Evolução do patrimônio" actions={<SelectField size="sm" icon="calendar" value={range} onChange={setRange} options={[{ value: '12', label: 'Últimos 12 meses' }, { value: '6', label: 'Últimos 6 meses' }]} style={{ width: 186 }} />}>
              <StackedBarChart height={mobile ? 220 : 270} series={[{ label: 'Valor aplicado', color: 'var(--ink-800)' }, { label: 'Ganho de capital', color: 'var(--lime-300)' }]} data={(mobile ? evo.slice(-6) : evo).map(e => ({ label: e[0], values: [e[1], e[2]] }))} highlight={(mobile ? 6 : evo.length) - 1} />
            </P.Panel>
            <P.Panel title="Gastos por categoria" sub="Outubro 2026" actions={<Button variant="ghost" size="sm" iconRight="arrow-up-right" onClick={() => go('gastos')}>Ver gastos</Button>}>
              <DonutChart size={mobile ? 180 : 184} legend={mobile || !wide ? 'right' : 'bottom'} centerLabel="Gasto no mês" centerValue={D.brl(m.spend).replace(/,\d\d$/, '')} format={v => D.brl(v)} data={donutData(m.byCat)} style={mobile ? { flexDirection: 'column' } : null} />
            </P.Panel>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
            <P.Panel title="Orçamento do mês" sub="Categorias mais próximas do limite" actions={<Button variant="ghost" size="sm" iconRight="arrow-up-right" onClick={() => go('gastos')}>Orçamento completo</Button>} padding={20}>
              {budgets.map((b, i) => <BudgetRow key={b.k} category={b.k} spent={b.spent} limit={b.limit} style={{ borderTop: i ? '1px solid var(--border-subtle)' : 'none' }} />)}
            </P.Panel>
            <P.Panel title="Próximas parcelas" sub={'Fatura de novembro · ' + D.brl(next.reduce((s, i) => s + i.amount, 0))} actions={<Button variant="ghost" size="sm" iconRight="arrow-up-right" onClick={() => go('cartoes')}>Ver cartões</Button>}>
              {next.map((it, i) => <InstallmentRow key={it.id} compact description={it.desc} subtitle={it.sub} category={it.category} card={cardName(it.card)} current={it.current} total={it.total} amount={it.amount} style={{ borderTop: i ? '1px solid var(--border-subtle)' : 'none' }} />)}
            </P.Panel>
          </div>
          <P.PageTitle title="Meus ativos" count={sum.all.length} mobile={mobile} actions={mobile ? null : <Button variant="secondary" size="sm" iconRight="arrow-up-right" onClick={() => go('investimentos')}>Ir para investimentos</Button>} />
          <I.Groups sum={sum} mobile={mobile} defaultOpen={false} onAdd={onAdd} onTrade={(g, s) => onAdd({ type: 'Investimento', group: g, symbol: s })} />
        </div>
      </div>
    );
  }

  window.I100Resumo = { Resumo, monthStats, donutData };
})();
