// Shared layout parts for the finance kit.
(() => {
  const { Card, Icon, IconButton, Button, Wordmark, TopTabs, UserChip, SearchInput, BottomNav, Tag, Avatar } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100F;

  function useVW() {
    const [w, setW] = React.useState(window.innerWidth);
    React.useEffect(() => { const f = () => setW(window.innerWidth); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
    return w;
  }

  function Panel({ title, sub, actions, children, padding = 20, divider = true, style }) {
    return (
      <Card variant="outlined" radius="var(--radius-card)" padding={0} style={{ display: 'flex', flexDirection: 'column', minWidth: 0, ...style }}>
        {title ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '16px ' + padding + 'px', borderBottom: divider ? '1px solid var(--border-card)' : 'none' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</div>
              {sub ? <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>{sub}</div> : null}
            </div>
            {actions ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{actions}</div> : null}
          </div>
        ) : null}
        <div style={{ padding: divider || !title ? padding : '0 ' + padding + 'px ' + padding + 'px', flex: 1, minWidth: 0 }}>{children}</div>
      </Card>
    );
  }

  function Kpi({ icon, title, accent = false, children }) {
    return (
      <Card variant={accent ? 'accent' : 'outlined'} radius="var(--radius-card)" padding={18} style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0, height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: accent ? 'rgba(255,255,255,0.55)' : 'var(--ink-75)', color: 'var(--ink-800)', flexShrink: 0 }}><Icon name={icon} size={16} /></span>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--ink-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
          <Icon name="info" size={14} color={accent ? 'rgba(20,20,20,0.45)' : 'var(--ink-300)'} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 42 }}>{children}</div>
      </Card>
    );
  }
  function Big({ children, color = 'var(--ink-900)', after }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color, whiteSpace: 'nowrap' }}>{children}</span>{after}
      </div>
    );
  }
  function Split({ items }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + items.length + ', minmax(0,1fr))', gap: 12 }}>
        {items.map(it => (
          <div key={it[0]} style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it[0]}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4, fontVariantNumeric: 'tabular-nums', color: it[2] || 'var(--ink-900)', whiteSpace: 'nowrap' }}>{it[1]}</div>
          </div>
        ))}
      </div>
    );
  }

  function Grid({ mobile, cols, min = 280, gap = 16, children }) {
    if (mobile) {
      return (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', margin: '0 -16px', padding: '2px 16px 4px', scrollbarWidth: 'none' }}>
          {React.Children.toArray(children).map((c, i) => <div key={i} style={{ flex: '0 0 ' + min + 'px', scrollSnapAlign: 'start' }}>{c}</div>)}
        </div>
      );
    }
    return <div style={{ display: 'grid', gridTemplateColumns: cols || 'repeat(auto-fit, minmax(' + min + 'px, 1fr))', gap }}>{children}</div>;
  }

  function PageTitle({ title, count, mobile, actions, children }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', margin: mobile ? '4px 0 14px' : '6px 0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: mobile ? 26 : 30, fontWeight: 600, letterSpacing: '-0.03em' }}>{title}</h1>
          {count != null ? <span style={{ fontSize: 14, color: 'var(--ink-400)' }}>({count})</span> : null}
          {children}
        </div>
        {actions ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{actions}</div> : null}
      </div>
    );
  }

  function Empty({ title, mobile }) {
    return (
      <Panel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start', padding: mobile ? 4 : 20, minHeight: 260, justifyContent: 'center' }}>
          <Tag dot="ink" tone="soft">Fora da referência</Tag>
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 200, lineHeight: 1.3, maxWidth: 620 }}>A área <b style={{ fontWeight: 700 }}>{title}</b> não aparece nas telas de referência e foi deixada em branco de propósito.</div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>Envie o layout desejado para desenhá-la com este sistema.</div>
        </div>
      </Panel>
    );
  }

  function Toast({ msg }) {
    if (!msg) return null;
    return (
      <div style={{ position: 'absolute', left: '50%', bottom: 112, transform: 'translateX(-50%)', zIndex: 300, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 10px 10px', borderRadius: 999, background: 'var(--ink-900)', color: '#fff', fontSize: 13, fontWeight: 500, boxShadow: 'var(--shadow-float)', whiteSpace: 'nowrap' }}>
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--lime-300)', color: 'var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={14} strokeWidth={2.4} /></span>{msg}
      </div>
    );
  }

  const TABS = [
    { id: 'resumo', icon: 'layout-grid', label: 'Resumo' }, { id: 'investimentos', icon: 'chart-pie', label: 'Investimentos' },
    { id: 'gastos', icon: 'receipt', label: 'Gastos' }, { id: 'cartoes', icon: 'credit-card', label: 'Cartões' },
    { id: 'metas', icon: 'target', label: 'Metas' }, { id: 'relatorios', icon: 'file-text', label: 'Relatórios' },
  ];

  function DesktopShell({ tab, onTab, onAdd, wide, children }) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-app-soft)', position: 'relative' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-card)' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>
              <Wordmark size={21} />
              <div style={{ flex: 1 }} />
              <SearchInput size="sm" placeholder="Buscar ativo, lançamento ou categoria" shortcut="/" style={{ width: wide ? 340 : 240 }} />
              <IconButton icon="bell" label="Notificações" badge variant="soft" />
              <UserChip name={D.user.name} email={D.user.email} compact={!wide} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderTop: '1px solid var(--border-subtle)' }}>
              <TopTabs items={TABS} value={tab} onChange={onTab} />
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {wide ? <Button variant="secondary" size="sm" iconLeft="link">Conectar B3</Button> : null}
                <Button size="sm" iconLeft="plus" onClick={() => onAdd()}>Adicionar lançamento</Button>
              </div>
            </div>
          </div>
        </header>
        <main style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 24px 56px' }}>{children}</main>
      </div>
    );
  }

  function MobileShell({ framed, tab, onNav, onAdd, scrollKey, overlay, children }) {
    const ref = React.useRef(null);
    React.useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [scrollKey]);
    const nav = ['resumo', 'investimentos', 'gastos', 'cartoes'].includes(tab) ? tab : 'mais';
    return (
      <div style={{ position: 'relative', height: framed ? '100%' : '100vh', overflow: 'hidden', background: 'var(--bg-app-soft)' }}>
        <div ref={ref} style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          <header style={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: (framed ? 58 : 12) + 'px 16px 12px', background: 'rgba(243,243,241,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            <Wordmark size={19} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <IconButton icon="bell" label="Notificações" badge size="lg" />
              <Avatar name={D.user.name} size={44} tone="neutral" />
            </div>
          </header>
          <main style={{ padding: '4px 16px 132px' }}>{children}</main>
        </div>
        <button type="button" aria-label="Adicionar lançamento" onClick={() => onAdd()} style={{ position: 'absolute', right: 20, bottom: framed ? 112 : 96, zIndex: 31, width: 56, height: 56, borderRadius: '50%', border: 'none', background: 'var(--lime-300)', color: 'var(--ink-900)', boxShadow: '0 10px 24px -6px rgba(77,122,16,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="plus" size={24} strokeWidth={2.2} />
        </button>
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: framed ? 30 : 16, zIndex: 30 }}>
          <BottomNav value={nav} onChange={onNav} items={[
            { id: 'resumo', icon: 'layout-grid', label: 'Resumo' }, { id: 'investimentos', icon: 'chart-pie', label: 'Investir' },
            { id: 'gastos', icon: 'receipt', label: 'Gastos' }, { id: 'cartoes', icon: 'credit-card', label: 'Cartões' }, { id: 'mais', icon: 'menu', label: 'Mais' },
          ]} />
        </div>
        {overlay}
      </div>
    );
  }

  window.I100P = { useVW, Panel, Kpi, Big, Split, Grid, PageTitle, Empty, Toast, TABS, DesktopShell, MobileShell };
})();
