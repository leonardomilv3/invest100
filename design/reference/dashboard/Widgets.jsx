// Shared dashboard widgets composed from DS primitives.
(() => {
  const { Card, CardHeader, IconButton, SegmentedControl, RangeToggle, Legend, FloatingBarChart, Badge, Delta, ProgressTrack, Select, Icon, WatchRow, Tag } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100Data;

  function Money({ value, size = 56, weight = 400, dim = 'var(--ink-400)' }) {
    const parts = D.fmt(value).split(',');
    return (
      <span style={{ fontSize: size, fontWeight: weight, letterSpacing: '-0.035em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: 'var(--ink-900)' }}>
        R$&nbsp;{parts[0]}<span style={{ color: dim }}>,{parts[1]}</span>
      </span>
    );
  }

  function PageHeader({ title, actions, mobile, children }) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: mobile ? 16 : 20 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: mobile ? 28 : 40, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{title}</h1>
          {children}
        </div>
        {actions ? <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{actions}</div> : null}
      </div>
    );
  }

  function Scroller({ mobile, cols = 3, min = 292, children }) {
    if (!mobile) return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', minmax(0,1fr))', gap: 16 }}>{children}</div>;
    return (
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', margin: '0 -16px', padding: '2px 16px 6px', scrollbarWidth: 'none' }}>
        {React.Children.map(children, c => <div style={{ flex: '0 0 ' + min + 'px', scrollSnapAlign: 'start', display: 'grid' }}>{c}</div>)}
      </div>
    );
  }

  const CLASSES = ['Commodities', 'Ações', 'Renda fixa', 'Índices'];
  const RANGES = ['1D', '1S', '1M', '1A', '5A'];
  const LEGEND = [{ label: 'crescimento positivo', tone: 'positive' }, { label: 'crescimento baixo', tone: 'low' }, { label: 'retorno negativo', tone: 'negative' }];

  function PortfolioValueCard({ mobile, total }) {
    const peak = mobile ? 5 : 10;
    const [cls, setCls] = React.useState('Ações');
    const [range, setRange] = React.useState('1A');
    const [sel, setSel] = React.useState(peak);
    const seed = CLASSES.indexOf(cls) * 7 + RANGES.indexOf(range) * 13 + 3;
    const bars = React.useMemo(() => {
      const b = D.makeBars(seed, 10);
      return mobile ? b.filter((_, i) => i % 2 === 0) : b;
    }, [seed, mobile]);
    const bar = bars[Math.min(sel, bars.length - 1)];
    const count = Math.round(bar.value * 1272);
    const pct = bar.tone === 'negative' ? -(bar.value * 9) : bar.value * 30.1;
    const n = bars.length;
    const i = Math.min(sel, n - 1);
    const H = mobile ? 150 : 230;
    const right = i < n * 0.66;
    const calloutStyle = {
      position: 'absolute', top: Math.max(0, (1 - bar.value) * H - 8), zIndex: 2, pointerEvents: 'none',
      left: right ? 'calc(' + ((i + 1) / n * 100) + '% + 6px)' : 'auto',
      right: right ? 'auto' : 'calc(' + ((n - i) / n * 100) + '% + 6px)',
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      border: '1px solid var(--border-highlight)', borderRadius: 16, padding: mobile ? '8px 10px' : '12px 14px', boxShadow: 'var(--shadow-md)',
      transition: 'left var(--dur-base) var(--ease-out), right var(--dur-base) var(--ease-out), top var(--dur-base) var(--ease-out)',
    };
    const callout = (
      <div style={calloutStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: mobile ? 17 : 22, fontWeight: 500, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{D.fmt(count, 0)}</span>
          <Badge size="sm" tone={pct >= 0 ? 'accent' : 'negative'}>{(pct >= 0 ? '' : '\u2212') + D.fmt(Math.abs(pct), 1) + '%'}</Badge>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-400)', marginTop: 4, whiteSpace: 'nowrap' }}>{pct >= 0 ? 'Aumento no período' : 'Queda no período'}</div>
      </div>
    );
    return (
      <Card padding={mobile ? 18 : 24} style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 16 : 24 }}>
        <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'stretch' : 'flex-start', gap: mobile ? 14 : 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.015em' }}>Valor da carteira</div>
            <div style={{ marginTop: 14 }}><Money value={total} size={mobile ? 38 : 56} /></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: mobile ? 'stretch' : 'flex-end', gap: 12, minWidth: 0 }}>
            <SegmentedControl options={CLASSES} value={cls} onChange={setCls} size={mobile ? 'md' : 'sm'} />
            <RangeToggle options={RANGES} value={range} onChange={setRange} size={mobile ? 'lg' : 'sm'} style={{ justifyContent: mobile ? 'space-between' : 'flex-end' }} />
            <Legend items={LEGEND} size="sm" />
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          {callout}
          <FloatingBarChart bars={bars} labels={mobile ? D.monthsShort : D.months} highlight={sel} onHighlight={setSel} height={H} />
        </div>
      </Card>
    );
  }

  function useCountdown(start) {
    const [s, setS] = React.useState(start);
    React.useEffect(() => {
      const t = setInterval(() => setS(x => (x > 0 ? x - 1 : 0)), 1000);
      return () => clearInterval(t);
    }, []);
    return s;
  }
  const hms = s => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(n => String(n).padStart(2, '0')).join(':');
  const EXCH = { B3: { v: 1585525.75, d: 1.87 }, NASDAQ: { v: 2104330.12, d: 0.64 }, NYSE: { v: 1932018.4, d: -0.38 } };

  function MarketSnapshotCard() {
    const [exch, setExch] = React.useState('B3');
    const left = useCountdown(5 * 3600 + 43 * 60 + 6);
    const pct = ((54000 - left) / 54000) * 100;
    const e = EXCH[exch];
    return (
      <Card padding={22} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CardHeader title="Panorama do mercado" actions={<IconButton icon="list-filter" label="Filtrar" variant="soft" size="sm" />} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 28, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{D.brl(e.v)}</span>
          <Delta value={e.d} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-500)', marginTop: -6 }}>
          14:15 <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ink-300)' }} /> Hoje
        </div>
        <ProgressTrack value={pct} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Select value={exch} onChange={setExch} options={['B3', 'NASDAQ', 'NYSE']} />
          <span title="Tempo até o fechamento" style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, color: 'var(--ink-800)', fontVariantNumeric: 'tabular-nums' }}>
            <Icon name="clock" size={15} />{hms(left)}
          </span>
        </div>
      </Card>
    );
  }

  function WatchlistCard({ symbols, onOpen, onAdd, limit = 5 }) {
    const [sorted, setSorted] = React.useState(false);
    let rows = symbols.map(D.stock).filter(Boolean);
    if (sorted) rows = rows.slice().sort((a, b) => b.change - a.change);
    return (
      <Card padding={22} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CardHeader
          title="Lista de observação"
          actions={<>
            <IconButton icon="list-filter" label="Ordenar por variação" variant={sorted ? 'inverse' : 'soft'} size="sm" onClick={() => setSorted(!sorted)} />
            <IconButton icon="plus" label="Adicionar ativo" variant="inverse" size="sm" onClick={onAdd} />
          </>}
        />
        <div style={{ height: 4 }} />
        {rows.length ? rows.slice(0, limit).map(r => (
          <WatchRow key={r.symbol} name={r.name} symbol={r.symbol} price={D.brl(r.price)} delta={r.change} onClick={() => onOpen(r.symbol)} />
        )) : <div style={{ fontSize: 13, color: 'var(--ink-500)', padding: '12px 0' }}>Nenhum ativo na lista. Use + para adicionar.</div>}
      </Card>
    );
  }

  function EmptyArea({ title, mobile }) {
    return (
      <Card padding={mobile ? 24 : 40} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 14, minHeight: mobile ? 260 : 380, backgroundImage: 'var(--pattern-hatch-soft)' }}>
        <Tag dot="ink">Fora da referência</Tag>
        <div style={{ fontSize: mobile ? 22 : 30, fontWeight: 200, maxWidth: 600, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          A tela <b style={{ fontWeight: 700 }}>{title}</b> não aparece nas telas de referência e foi deixada em branco de propósito.
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>Envie o layout desejado para desenhá-la com este sistema.</div>
      </Card>
    );
  }

  window.I100Widgets = { Money, PageHeader, Scroller, PortfolioValueCard, MarketSnapshotCard, WatchlistCard, EmptyArea, CLASSES, RANGES };
})();
