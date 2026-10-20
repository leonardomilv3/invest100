import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

const brl = v => 'R$\u00a0' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TONES = {
  ink: { bg: 'var(--ink-900)', fg: 'var(--white)', sub: 'rgba(255,255,255,0.6)', track: 'rgba(255,255,255,0.16)', fill: 'var(--lime-300)', border: 'transparent' },
  lime: { bg: 'var(--lime-300)', fg: 'var(--ink-900)', sub: 'rgba(20,20,20,0.6)', track: 'rgba(20,20,20,0.12)', fill: 'var(--ink-900)', border: 'transparent' },
  white: { bg: 'var(--white)', fg: 'var(--ink-900)', sub: 'var(--ink-500)', track: 'var(--ink-100)', fill: 'var(--ink-900)', border: 'var(--border-card)' },
};

export function CreditCardTile({ name, last4, brand, tone = 'ink', invoice = 0, dueDate, limit = 0, used = 0, status, selected = false, onClick, style }) {
  const [hover, setHover] = useState(false);
  const t = TONES[tone] || TONES.ink;
  const pct = limit > 0 ? Math.min(1, used / limit) : 0;
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-pressed={selected}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 18, width: '100%', minHeight: 196, padding: 20, textAlign: 'left',
        borderRadius: 20, border: '1px solid ' + t.border, background: t.bg, color: t.fg, cursor: onClick ? 'pointer' : 'default', fontFamily: 'var(--font-sans)', overflow: 'hidden',
        boxShadow: selected ? '0 0 0 2px var(--white), 0 0 0 4px var(--ink-900)' : hover && onClick ? 'var(--shadow-md)' : 'none',
        transform: hover && onClick && !selected ? 'translateY(-2px)' : 'none', transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)', ...style,
      }}>
      <span style={{ position: 'absolute', right: -40, top: -40, width: 170, height: 170, borderRadius: '50%', background: t.track, opacity: 0.55, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' }}>{name}</div>
          <div style={{ fontSize: 12, color: t.sub, marginTop: 4, letterSpacing: '0.08em' }}>•••• {last4}</div>
        </div>
        <Icon name="nfc" size={20} color={t.sub} />
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 12, color: t.sub }}>Fatura atual{status ? ' · ' + status : ''}</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.035em', marginTop: 4, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{brl(invoice)}</div>
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 6, borderRadius: 999, background: t.track, overflow: 'hidden' }}><div style={{ width: pct * 100 + '%', height: '100%', borderRadius: 999, background: t.fill }} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 11.5, color: t.sub }}>
          <span style={{ whiteSpace: 'nowrap' }}>{dueDate ? 'Vence ' + dueDate : ''}</span>
          <span style={{ display: 'flex', gap: 10, alignItems: 'center', whiteSpace: 'nowrap' }}>{brl(limit - used)} disp.<b style={{ color: t.fg, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: 11 }}>{brand}</b></span>
        </div>
      </div>
    </button>
  );
}
