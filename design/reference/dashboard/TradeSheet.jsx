// Order / cash-movement sheet: right drawer on desktop, bottom sheet on mobile.
(() => {
  const { TickerLogo, IconButton, Delta, SegmentedControl, Button, Card, Icon } = window.Investidor100DesignSystem_60e5fe;
  const D = window.I100Data;

  function Row({ k, v, strong }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: strong ? 15 : 13, padding: '6px 0' }}>
        <span style={{ color: strong ? 'var(--ink-900)' : 'var(--ink-500)', fontWeight: strong ? 500 : 400 }}>{k}</span>
        <span style={{ fontWeight: strong ? 700 : 500, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{v}</span>
      </div>
    );
  }

  function Success({ title, text, onClose }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, padding: '28px 0 8px' }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--lime-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 12px var(--lime-glow)' }}>
          <Icon name="check" size={34} strokeWidth={2.2} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.03em', marginTop: 8 }}>{title}</div>
        <div style={{ fontSize: 14, color: 'var(--ink-500)', maxWidth: 300, lineHeight: 1.5 }}>{text}</div>
        <Button variant="secondary" size="lg" fullWidth onClick={onClose} style={{ marginTop: 8 }}>Fechar</Button>
      </div>
    );
  }

  function TradeBody({ symbol, side0, onClose, onConfirm }) {
    const s = D.stock(symbol) || D.stocks[0];
    const [side, setSide] = React.useState(side0 || 'Comprar');
    const [qty, setQty] = React.useState(10);
    const [done, setDone] = React.useState(false);
    const total = qty * s.price;
    if (done) return <Success title="Ordem enviada" text={side + ' de ' + qty + ' cotas de ' + s.symbol + ' por ' + D.brl(total) + '. Acompanhe em Transações.'} onClose={onClose} />;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <TickerLogo symbol={s.symbol} size={44} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.025em' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 2 }}>{s.symbol} · {s.sector}</div>
            </div>
          </div>
          <IconButton icon="x" label="Fechar" variant="soft" size="sm" onClick={onClose} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 34, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums' }}>{D.brl(s.price)}</span>
          <Delta value={s.change} variant="soft" size="sm" />
        </div>
        <SegmentedControl options={['Comprar', 'Vender']} value={side} onChange={setSide} size="lg" fullWidth />
        <div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 8 }}>Quantidade de cotas</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: 6 }}>
            <IconButton icon="minus" label="Diminuir" size="lg" onClick={() => setQty(Math.max(1, qty - 1))} />
            <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
            <IconButton icon="plus" label="Aumentar" size="lg" onClick={() => setQty(qty + 1)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {[10, 50, 100, 500].map(n => <Button key={n} variant={qty === n ? 'primary' : 'soft'} size="sm" onClick={() => setQty(n)} style={{ flex: 1 }}>{n}</Button>)}
          </div>
        </div>
        <Card variant="sunken" padding="10px 16px" radius="var(--radius-lg)">
          <Row k="Preço unitário" v={D.brl(s.price)} />
          <Row k="Quantidade" v={qty + ' cotas'} />
          <Row k="Taxas e emolumentos" v={D.brl(total * 0.0003)} />
          <div style={{ height: 1, background: 'var(--border-default)', margin: '6px 0' }} />
          <Row k="Total estimado" v={D.brl(total * 1.0003)} strong />
        </Card>
        <Button size="lg" fullWidth onClick={() => { setDone(true); onConfirm({ mode: 'trade', side, symbol: s.symbol, qty, price: s.price }); }}>
          {side === 'Comprar' ? 'Confirmar compra' : 'Confirmar venda'}
        </Button>
        <div style={{ fontSize: 11, color: 'var(--ink-400)', textAlign: 'center', marginTop: -8 }}>Ordem a mercado · Liquidação em D+2</div>
      </div>
    );
  }

  const CASH = { deposit: 'Depositar', withdraw: 'Sacar', transfer: 'Transferir' };

  function CashBody({ kind, balance, onClose, onConfirm }) {
    const [amount, setAmount] = React.useState(1000);
    const [done, setDone] = React.useState(false);
    const sign = kind === 'deposit' ? 1 : -1;
    if (done) return <Success title="Tudo certo" text={CASH[kind] + ' de ' + D.brl(amount) + ' registrado. Novo patrimônio: ' + D.brl(balance) + '.'} onClose={onClose} />;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em' }}>{CASH[kind]}</div>
          <IconButton icon="x" label="Fechar" variant="soft" size="sm" onClick={onClose} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 8 }}>Valor</div>
          <label style={{ display: 'flex', alignItems: 'baseline', gap: 8, background: 'var(--white)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', padding: '16px 20px' }}>
            <span style={{ fontSize: 20, color: 'var(--ink-400)' }}>R$</span>
            <input
              inputMode="decimal"
              value={D.fmt(amount, 2)}
              onChange={e => { const n = Number(e.target.value.replace(/\D/g, '')) / 100; setAmount(isFinite(n) ? n : 0); }}
              style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: 36, letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums', background: 'transparent', color: 'var(--ink-900)', padding: 0 }}
            />
          </label>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {[500, 1000, 5000, 10000].map(n => <Button key={n} variant={amount === n ? 'primary' : 'soft'} size="sm" onClick={() => setAmount(n)} style={{ flex: 1, padding: 0 }}>{D.compact(n)}</Button>)}
          </div>
        </div>
        <Card variant="sunken" padding="10px 16px" radius="var(--radius-lg)">
          <Row k="Patrimônio atual" v={D.brl(balance)} />
          <Row k={kind === 'deposit' ? 'Entrada' : 'Saída'} v={(sign > 0 ? '+' : '\u2212') + D.brl(amount)} />
          <div style={{ height: 1, background: 'var(--border-default)', margin: '6px 0' }} />
          <Row k="Após a operação" v={D.brl(balance + sign * amount)} strong />
        </Card>
        <Button size="lg" fullWidth disabled={amount <= 0} onClick={() => { setDone(true); onConfirm({ mode: 'cash', kind, amount: sign * amount }); }}>Confirmar</Button>
      </div>
    );
  }

  function Sheet({ mobile, onClose, children }) {
    const [shown, setShown] = React.useState(false);
    React.useEffect(() => { const r = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(r); }, []);
    const panel = mobile
      ? { left: 0, right: 0, bottom: 0, maxHeight: '90%', borderRadius: '32px 32px 0 0', padding: '12px 20px 36px', transform: shown ? 'none' : 'translateY(40px)' }
      : { top: 12, right: 12, bottom: 12, width: 440, borderRadius: 32, padding: 28, transform: shown ? 'none' : 'translateX(32px)' };
    return (
      <div style={{ position: mobile ? 'absolute' : 'fixed', inset: 0, zIndex: 100 }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--surface-overlay)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', opacity: shown ? 1 : 0, transition: 'opacity var(--dur-slow) var(--ease-out)' }} />
        <div role="dialog" aria-modal="true" style={{ position: 'absolute', background: 'var(--bg-app)', boxShadow: 'var(--shadow-float)', overflowY: 'auto', opacity: shown ? 1 : 0, transition: 'transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out)', ...panel }}>
          {mobile ? <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--ink-200)', margin: '0 auto 16px' }} /> : null}
          {children}
        </div>
      </div>
    );
  }

  function TradeSheet({ sheet, mobile, balance, onClose, onConfirm }) {
    if (!sheet) return null;
    return (
      <Sheet mobile={mobile} onClose={onClose}>
        {sheet.mode === 'trade'
          ? <TradeBody key={sheet.symbol + sheet.side} symbol={sheet.symbol} side0={sheet.side} onClose={onClose} onConfirm={onConfirm} />
          : <CashBody key={sheet.kind} kind={sheet.kind} balance={balance} onClose={onClose} onConfirm={onConfirm} />}
      </Sheet>
    );
  }

  window.I100TradeSheet = TradeSheet;
  window.I100Sheet = Sheet;
})();
