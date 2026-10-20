// Root: routing between areas, sheets, shared state. Responsive: <900px renders the mobile layout.
(() => {
  const { Card, Icon, UserChip } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100Data;
  const S = window.I100Shell;
  const W = window.I100Widgets;
  const Dashboard = window.I100DashboardScreen;
  const Market = window.I100MarketScreen;
  const Portfolio = window.I100PortfolioScreen;
  const TradeSheet = window.I100TradeSheet;
  const Sheet = window.I100Sheet;

  const today = () => new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '').replace(/ de /g, ' ');

  function MoreSheet({ onClose, go }) {
    const items = S.AREAS.filter(a => ['perf', 'trade', 'analytics', 'reports'].includes(a.id)).concat(S.FOOTER);
    return (
      <Sheet mobile onClose={onClose}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ marginBottom: 8 }}><UserChip name={D.user.name} email={D.user.email} style={{ width: '100%' }} /></div>
          {items.map(a => (
            <button key={a.id} type="button" onClick={() => { go(a.id); onClose(); }} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 56, padding: '0 16px', border: '1px solid var(--border-highlight)', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500, color: 'var(--ink-900)', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}><Icon name={a.icon} size={18} /></span>
              <span style={{ flex: 1 }}>{a.label}</span>
              <Icon name="chevron-right" size={16} color="var(--ink-400)" />
            </button>
          ))}
        </div>
      </Sheet>
    );
  }

  function App({ forceMobile = false, framed = false }) {
    const vw = S.useViewportWidth();
    const mobile = forceMobile || vw < 900;
    const wide = vw >= 1180;
    const [area, setArea] = React.useState(() => localStorage.getItem('i100.kit.area') || 'dash');
    const [tabs, setTabs] = React.useState({ dash: 'overview', market: 'all' });
    const [sheet, setSheet] = React.useState(null);
    const [more, setMore] = React.useState(false);
    const [total, setTotal] = React.useState(422525.82);
    const [txs, setTxs] = React.useState(D.transactions);
    const [watch, setWatch] = React.useState(D.watchlist);
    React.useEffect(() => { localStorage.setItem('i100.kit.area', area); }, [area]);

    const go = (a, t) => { setArea(a); if (t) setTabs(s => ({ ...s, [a]: t })); };
    const onTab = t => {
      if (area === 'market' || area === 'portfolio') { if (t === 'overview') go('portfolio'); else go('market', t); }
      else setTabs(s => ({ ...s, [area]: t }));
    };
    const tabValue = area === 'portfolio' ? 'overview' : tabs[area];
    const onTrade = (symbol, side) => setSheet({ mode: 'trade', symbol, side: side || 'Comprar' });
    const onCash = kind => setSheet({ mode: 'cash', kind });
    const toggleWatch = s => setWatch(w => (w.includes(s) ? w.filter(x => x !== s) : w.concat(s)));
    const onConfirm = r => {
      if (r.mode === 'trade') setTxs(list => [{ id: 't' + Date.now(), side: r.side === 'Comprar' ? 'buy' : 'sell', symbol: r.symbol, date: today(), price: r.price, qty: r.qty }].concat(list));
      else setTotal(v => Math.max(0, v + r.amount));
    };

    const props = { mobile, wide, tab: tabs[area], total, txs, watch, toggleWatch, onTrade, onCash, go };
    const area0 = S.AREAS.concat(S.FOOTER).find(a => a.id === area) || S.AREAS[0];
    let screen;
    if (area === 'dash') screen = <Dashboard {...props} />;
    else if (area === 'market') screen = <Market {...props} />;
    else if (area === 'portfolio') screen = <Portfolio {...props} />;
    else screen = <div><W.PageHeader title={area0.label} mobile={mobile} /><W.EmptyArea title={area0.label} mobile={mobile} /></div>;

    const sheetEl = <TradeSheet sheet={sheet} mobile={mobile} balance={total} onClose={() => setSheet(null)} onConfirm={onConfirm} />;

    if (!mobile) {
      return (
        <S.DesktopShell area={area} onArea={a => go(a)} subtabs={S.SUBTABS[area] || []} tab={tabValue} onTab={onTab}>
          {screen}
          {sheetEl}
        </S.DesktopShell>
      );
    }
    const navValue = ['dash', 'market', 'portfolio'].includes(area) ? area : 'more';
    const onNav = id => {
      if (id === 'trade') onTrade(watch[0] || 'PETR4');
      else if (id === 'more') setMore(true);
      else go(id);
    };
    return (
      <S.MobileShell
        framed={framed}
        area={area}
        subtabs={S.SUBTABS[area] || []}
        tab={tabValue}
        onTab={onTab}
        navValue={navValue}
        onNav={onNav}
        onSearch={() => go('market', 'all')}
        overlay={<>{sheetEl}{more ? <MoreSheet onClose={() => setMore(false)} go={go} /> : null}</>}
      >
        {screen}
      </S.MobileShell>
    );
  }

  window.I100App = App;
})();
