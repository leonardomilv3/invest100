import React from 'react';
import { Card } from '../core/Card.jsx';
import { Delta } from '../core/Delta.jsx';
import { TickerLogo } from '../core/TickerLogo.jsx';

export function StatCard({ label, name, symbol, logo, meta, value, caption, delta, deltaSuffix = '%', variant = 'default', onClick, style }) {
  const accent = variant === 'accent';
  const muted = accent ? 'rgba(20,20,20,0.62)' : 'var(--ink-500)';
  return (
    <Card variant={accent ? 'accent' : 'default'} interactive={!!onClick} onClick={onClick} padding={20} style={{ display: 'flex', flexDirection: 'column', gap: 20, ...style }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {label ? <div style={{ fontSize: 14, color: muted, letterSpacing: '-0.01em' }}>{label}</div> : null}
        {name ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {logo || (symbol ? <TickerLogo symbol={symbol} size={34} /> : null)}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.15, color: 'var(--ink-900)' }}>{name}</div>
              {symbol ? <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{symbol}</div> : null}
            </div>
          </div>
        ) : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          {meta ? <div style={{ fontSize: 14, color: muted, marginBottom: 6 }}>{meta}</div> : null}
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-900)', lineHeight: 1.1, whiteSpace: 'nowrap' }}>{value}</div>
          {caption ? <div style={{ fontSize: 11, color: muted, marginTop: 6 }}>{caption}</div> : null}
        </div>
        {delta != null ? <Delta value={delta} suffix={deltaSuffix} /> : null}
      </div>
    </Card>
  );
}
