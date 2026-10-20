// App chrome: desktop top bar + icon rail, mobile header + floating tab bar.
(() => {
  const { SideRail, NavTabs, UserChip, IconButton, Wordmark, BottomNav } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100Data;

  function useViewportWidth() {
    const [w, setW] = React.useState(window.innerWidth);
    React.useEffect(() => {
      const f = () => setW(window.innerWidth);
      window.addEventListener('resize', f);
      return () => window.removeEventListener('resize', f);
    }, []);
    return w;
  }

  const AREAS = [
    { id: 'dash', icon: 'layout-grid', label: 'Dashboard' },
    { id: 'market', icon: 'chart-column', label: 'Mercado' },
    { id: 'portfolio', icon: 'chart-pie', label: 'Carteira' },
    { id: 'perf', icon: 'activity', label: 'Desempenho' },
    { id: 'trade', icon: 'chart-candlestick', label: 'Negociação' },
    { id: 'analytics', icon: 'chart-no-axes-column-increasing', label: 'Análises' },
    { id: 'reports', icon: 'file-text', label: 'Relatórios' },
  ];
  const FOOTER = [{ id: 'settings', icon: 'settings', label: 'Configurações' }, { id: 'help', icon: 'circle-help', label: 'Ajuda' }];
  const STOCK_TABS = [
    { id: 'overview', label: 'Visão geral' }, { id: 'all', label: 'Todas as ações' }, { id: 'gainers', label: 'Maiores altas' },
    { id: 'losers', label: 'Maiores baixas' }, { id: 'watch', label: 'Observação' },
  ];
  const SUBTABS = {
    dash: [{ id: 'overview', label: 'Visão geral' }, { id: 'performance', label: 'Desempenho' }, { id: 'allocation', label: 'Alocação' }, { id: 'insights', label: 'Insights' }, { id: 'reports', label: 'Relatórios' }],
    market: STOCK_TABS,
    portfolio: STOCK_TABS,
  };

  function DesktopShell({ area, onArea, subtabs, tab, onTab, children }) {
    React.useEffect(() => { window.scrollTo(0, 0); }, [area]);
    const vw = useViewportWidth();
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-app)', backgroundImage: 'var(--bg-app-glow)', backgroundAttachment: 'fixed' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 24px 48px' }}>
          <header style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto', alignItems: 'center', gap: 24, height: 56 }}>
            <Wordmark size={22} />
            <div style={{ display: 'flex', justifyContent: 'safe center', minWidth: 0 }}>
              <NavTabs items={subtabs} value={tab} onChange={onTab} scrollable style={{ maxWidth: '100%' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
              <IconButton icon="bell" label="Notificações" badge />
              <UserChip name={D.user.name} email={D.user.email} compact={vw < 1180} />
            </div>
          </header>
          <div style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr)', gap: 24, marginTop: 16 }}>
            <div style={{ position: 'sticky', top: 24, alignSelf: 'start', height: 'calc(100vh - 120px)', minHeight: 520, maxHeight: 820, paddingTop: 92 }}>
              <SideRail items={AREAS} footerItems={FOOTER} value={area} onChange={onArea} style={{ height: '100%' }} />
            </div>
            <main style={{ minWidth: 0 }}>{children}</main>
          </div>
        </div>
      </div>
    );
  }

  function MobileShell({ framed, area, subtabs, tab, onTab, navValue, onNav, onSearch, overlay, children }) {
    const ref = React.useRef(null);
    React.useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [area]);
    return (
      <div style={{ position: 'relative', height: framed ? '100%' : '100vh', overflow: 'hidden', background: 'var(--bg-app)' }}>
        <div ref={ref} style={{ position: 'absolute', inset: 0, overflowY: 'auto', backgroundImage: 'var(--bg-app-glow)', paddingTop: framed ? 54 : 0 }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 16px 12px' }}>
            <Wordmark size={19} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconButton icon="search" label="Buscar" onClick={onSearch} size="lg" />
              <IconButton icon="bell" label="Notificações" badge size="lg" />
              <UserChip name={D.user.name} compact />
            </div>
          </header>
          {subtabs && subtabs.length ? (
            <div style={{ padding: '0 16px 14px' }}><NavTabs items={subtabs} value={tab} onChange={onTab} size="sm" scrollable /></div>
          ) : null}
          <main style={{ padding: '0 16px 124px' }}>{children}</main>
        </div>
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: framed ? 30 : 16, zIndex: 30 }}>
          <BottomNav
            value={navValue}
            onChange={onNav}
            items={[
              { id: 'dash', icon: 'layout-grid', label: 'Início' },
              { id: 'market', icon: 'chart-column', label: 'Mercado' },
              { id: 'portfolio', icon: 'chart-pie', label: 'Carteira' },
              { id: 'trade', icon: 'chart-candlestick', label: 'Negociar' },
              { id: 'more', icon: 'menu', label: 'Mais' },
            ]}
          />
        </div>
        {overlay}
      </div>
    );
  }

  window.I100Shell = { useViewportWidth, AREAS, FOOTER, SUBTABS, DesktopShell, MobileShell };
})();
