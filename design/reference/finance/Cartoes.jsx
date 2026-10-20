// Cartões — card selector, invoice detail, future commitments, installments, invoice items.
(() => {
  const { CreditCardTile, Button, Badge, SegmentedControl, InstallmentRow, StackedBarChart, CategoryIcon, Icon } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100F;
  const P = window.I100P;
  const COLORS = { c1: 'var(--ink-900)', c2: 'var(--lime-400)', c3: 'var(--cat-teal)' };
  const NEXT = ['NOV', 'DEZ', 'JAN', 'FEV', 'MAR', 'ABR'];

  function Row({ k, v, strong }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: strong ? 15 : 13.5 }}>
        <span style={{ color: strong ? 'var(--ink-900)' : 'var(--ink-500)', fontWeight: strong ? 600 : 400 }}>{k}</span>
        <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
      </div>
    );
  }

  function Cartoes({ mobile, wide, cards, installments, txs, onPay, onAdd }) {
    const [sel, setSel] = React.useState(cards[0].id);
    const [scope, setScope] = React.useState('Este cartão');
    const card = cards.find(c => c.id === sel) || cards[0];
    const future = NEXT.map((label, mIdx) => ({
      label,
      values: cards.map(c => +(installments.filter(i => i.card === c.id && i.current + mIdx + 1 <= i.total).reduce((s, i) => s + i.amount, 0) + c.recurring).toFixed(2)),
    }));
    const inst = installments.filter(i => scope === 'Todos' || i.card === card.id);
    const remaining = inst.reduce((s, i) => s + (i.total - i.current) * i.amount, 0);
    const items = txs.filter(t => t.month === '10' && t.method === card.id).sort((a, b) => b.date.localeCompare(a.date));
    const tiles = cards.map(c => <CreditCardTile key={c.id} {...c} dueDate={c.due} selected={c.id === sel} onClick={() => setSel(c.id)} />);
    const addTile = (
      <button type="button" onClick={() => onAdd({ type: 'Despesa' })} style={{ minHeight: 196, width: '100%', borderRadius: 20, border: '1.5px dashed var(--border-strong)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', color: 'var(--ink-600)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--white)', border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={20} /></span>
        Adicionar cartão
      </button>
    );
    return (
      <div>
        <P.PageTitle title="Cartões" count={cards.length} mobile={mobile} actions={mobile ? null : <Button variant="secondary" size="sm" iconLeft="plus">Adicionar cartão</Button>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <P.Grid mobile={mobile} min={mobile ? 290 : 270} cols={wide ? 'repeat(4,minmax(0,1fr))' : undefined}>{tiles.concat(mobile ? [] : [<div key="add">{addTile}</div>])}</P.Grid>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'minmax(0,1fr)' : wide ? 'minmax(320px,1fr) minmax(0,1.7fr)' : 'minmax(0,1fr)', gap: 16 }}>
            <P.Panel title={'Fatura de novembro'} sub={card.name + ' •• ' + card.last4} actions={<Badge tone={card.status === 'Paga' ? 'positive' : card.status === 'Fechada' ? 'warning' : 'info'}>{card.status}</Badge>}>
              <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums', marginBottom: 12 }}>{D.brl(card.invoice)}</div>
              <Row k="Fecha em" v={card.close} />
              <Row k="Vence em" v={card.due} />
              <Row k="Limite total" v={D.brl(card.limit)} />
              <Row k="Limite disponível" v={D.brl(card.limit - card.used)} />
              <div style={{ height: 8, borderRadius: 999, background: 'var(--ink-100)', overflow: 'hidden', margin: '14px 0 4px' }}><div style={{ width: Math.min(100, (card.used / card.limit) * 100) + '%', height: '100%', borderRadius: 999, background: 'var(--ink-900)' }} /></div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{D.fmt((card.used / card.limit) * 100, 0)}% do limite em uso</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 18 }}>
                <Button size={mobile ? 'lg' : 'md'} disabled={card.invoice <= 0} onClick={() => onPay(card.id)}>Pagar fatura</Button>
                <Button size={mobile ? 'lg' : 'md'} variant="secondary" iconLeft="download">Baixar PDF</Button>
              </div>
            </P.Panel>
            <P.Panel title="Compromissos futuros" sub="Parcelas + assinaturas previstas por cartão">
              <StackedBarChart height={mobile ? 220 : 290} series={cards.map(c => ({ label: c.name, color: COLORS[c.id] }))} data={future} />
            </P.Panel>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'minmax(0,1fr)' : wide ? 'minmax(0,1.7fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: 16 }}>
            <P.Panel title="Parcelamentos ativos" sub={'Restante a pagar ' + D.brl(remaining)} actions={<SegmentedControl size="sm" options={['Este cartão', 'Todos']} value={scope} onChange={setScope} />}>
              {inst.length ? inst.map((it, i) => {
                const c = cards.find(x => x.id === it.card);
                return <InstallmentRow key={it.id} compact={mobile} description={it.desc} subtitle={it.sub} category={it.category} card={'•• ' + c.last4} current={it.current} total={it.total} amount={it.amount} style={{ borderTop: i ? '1px solid var(--border-subtle)' : 'none' }} />;
              }) : <div style={{ fontSize: 13, color: 'var(--ink-500)', padding: '16px 0' }}>Nenhum parcelamento neste cartão.</div>}
            </P.Panel>
            <P.Panel title="Lançamentos da fatura" sub={items.length + ' itens em outubro'}>
              {items.map((t, i) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                  <CategoryIcon category={t.category} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.desc}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-400)', marginTop: 2 }}>{t.date}{t.inst ? ' · parcela ' + t.inst : ''}</div>
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{D.brl(-t.amount)}</span>
                </div>
              ))}
              {items.length === 0 ? <div style={{ fontSize: 13, color: 'var(--ink-500)', padding: '16px 0' }}>Sem lançamentos neste mês.</div> : null}
            </P.Panel>
          </div>
        </div>
      </div>
    );
  }

  window.I100Cartoes = Cartoes;
})();
