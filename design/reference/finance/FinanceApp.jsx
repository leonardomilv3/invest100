// Root — tabs, shared state (lançamentos, cartões, parcelas, carteira), dialog + toast.
(() => {
  const { Dialog, Icon } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100F;
  const P = window.I100P;

  function MoreSheet({ framed, onClose, go }) {
    const items = [['metas', 'target', 'Metas'], ['relatorios', 'file-text', 'Relatórios'], ['config', 'settings', 'Configurações'], ['ajuda', 'circle-help', 'Ajuda']];
    return (
      <Dialog title="Mais" sheet contained={framed} onClose={onClose}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(([id, icon, label]) => (
            <button key={id} type="button" onClick={() => { go(id); onClose(); }} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 56, padding: '0 14px', borderRadius: 14, border: '1px solid var(--border-card)', background: 'var(--white)', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500, color: 'var(--ink-900)', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink-75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={18} /></span>
              <span style={{ flex: 1 }}>{label}</span><Icon name="chevron-right" size={16} color="var(--ink-400)" />
            </button>
          ))}
        </div>
      </Dialog>
    );
  }

  function App({ forceMobile = false, framed = false }) {
    const vw = P.useVW();
    const mobile = forceMobile || vw < 900;
    const wide = vw >= 1200;
    const [tab, setTab] = React.useState(() => localStorage.getItem('i100.fin.tab') || 'resumo');
    const [txs, setTxs] = React.useState(D.txs);
    const [cards, setCards] = React.useState(D.cards);
    const [installments, setInst] = React.useState(D.installments);
    const [invest, setInvest] = React.useState(D.invest);
    const [dialog, setDialog] = React.useState(null);
    const [more, setMore] = React.useState(false);
    const [toast, setToast] = React.useState(null);
    React.useEffect(() => { localStorage.setItem('i100.fin.tab', tab); if (!mobile) window.scrollTo(0, 0); }, [tab]);
    React.useEffect(() => { if (!toast) return undefined; const t = setTimeout(() => setToast(null), 2400); return () => clearTimeout(t); }, [toast]);

    const go = t => setTab(t);
    const onAdd = preset => setDialog({ preset: preset || {}, key: Date.now() });

    const onSave = r => {
      const id = 'n' + Date.now();
      if (r.type === 'Investimento') {
        setInvest(list => list.map(g => g.id !== r.group ? g : { ...g, rows: g.rows.map(row => {
          if (row.symbol !== r.symbol) return row;
          if (r.side === 'Compra') { const q = row.qty + r.qty; return { ...row, qty: q, pm: +((row.qty * row.pm + r.qty * r.price + r.costs) / q).toFixed(2) }; }
          return { ...row, qty: Math.max(0, row.qty - r.qty) };
        }) }));
        const total = r.qty * r.price + (r.side === 'Compra' ? r.costs : -r.costs);
        setTxs(l => [{ id, month: r.month, date: r.date, desc: r.side + ' · ' + r.symbol + ' (' + r.qty + ')', category: 'investimentos', method: 'conta', amount: r.side === 'Compra' ? -total : total }].concat(l));
        setToast(r.side + ' de ' + r.symbol + ' registrada');
      } else if (r.type === 'Receita') {
        setTxs(l => [{ id, month: r.month, date: r.date, desc: r.desc, category: r.category, method: 'conta', amount: r.amount }].concat(l));
        setToast('Receita registrada');
      } else {
        const isCard = r.method.charAt(0) === 'c';
        const per = r.amount / r.parcelas;
        if (isCard) {
          setCards(cs => cs.map(c => c.id === r.method ? { ...c, invoice: +(c.invoice + per).toFixed(2), used: +(c.used + r.amount).toFixed(2), status: c.status === 'Paga' ? 'Aberta' : c.status } : c));
          if (r.parcelas > 1) setInst(l => [{ id, desc: r.desc, sub: 'Nova compra parcelada', category: r.category, card: r.method, current: 1, total: r.parcelas, amount: +per.toFixed(2) }].concat(l));
        }
        setTxs(l => [{ id, month: r.month, date: r.date, desc: r.desc, category: r.category, method: r.method, amount: -(+per.toFixed(2)), inst: r.parcelas > 1 ? '1/' + r.parcelas : undefined }].concat(l));
        setToast(r.parcelas > 1 ? 'Compra em ' + r.parcelas + 'x registrada' : 'Despesa registrada');
      }
      setDialog(null);
    };
    const onPay = id => { setCards(cs => cs.map(c => c.id === id ? { ...c, used: Math.max(0, +(c.used - c.invoice).toFixed(2)), invoice: 0, status: 'Paga' } : c)); setToast('Fatura paga'); };

    const props = { mobile, wide, txs, cards, installments, invest, go, onAdd, onPay };
    const label = (P.TABS.find(t => t.id === tab) || { label: { config: 'Configurações', ajuda: 'Ajuda' }[tab] || 'Área' }).label;
    let screen;
    if (tab === 'resumo') screen = <window.I100Resumo.Resumo {...props} />;
    else if (tab === 'investimentos') screen = <window.I100Invest.Investimentos {...props} />;
    else if (tab === 'gastos') screen = <window.I100Gastos {...props} />;
    else if (tab === 'cartoes') screen = <window.I100Cartoes {...props} />;
    else screen = <div><P.PageTitle title={label} mobile={mobile} /><P.Empty title={label} mobile={mobile} /></div>;

    const Lanc = window.I100Lancamento;
    const overlays = (
      <>
        {dialog ? <Lanc key={dialog.key} preset={dialog.preset} cards={cards} invest={invest} mobile={mobile} framed={framed} onClose={() => setDialog(null)} onSave={onSave} /> : null}
        {more ? <MoreSheet framed={framed} onClose={() => setMore(false)} go={go} /> : null}
        <div style={{ position: mobile ? 'absolute' : 'fixed', left: 0, right: 0, bottom: mobile ? 0 : -60, height: 0, zIndex: 300 }}><P.Toast msg={toast} /></div>
      </>
    );

    if (!mobile) return <P.DesktopShell tab={tab} onTab={go} onAdd={onAdd} wide={wide}>{screen}{overlays}</P.DesktopShell>;
    return (
      <P.MobileShell framed={framed} tab={tab} scrollKey={tab} onAdd={onAdd} onNav={id => (id === 'mais' ? setMore(true) : go(id))} overlay={overlays}>
        {screen}
      </P.MobileShell>
    );
  }

  window.I100FinanceApp = App;
})();
